import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import typescript from 'typescript';
import { validateComponentCss } from './check-component-css.mjs';
import { compileTokens } from './tokens.mjs';

const interactionFiles = new Set(['Button', 'TextField', 'Provider', 'Dialog', 'Popover', 'Tabs', 'ComboBox', 'AsyncMultiSelect', 'DateRangeSelector', 'DateField', 'TimeField', 'Checkbox', 'DataGrid', 'Calendar', 'DatePicker', 'DateRangePicker', 'Menu', 'Switch', 'RadioGroup', 'Select', 'TextArea', 'ToggleButton', 'Tooltip', 'TagGroup', 'Progress']
  .map(name => `src/experimental/${name}/${name}.tsx`));
interactionFiles.add("src/components/AppDataGrid/ownedGridInteraction.tsx");
interactionFiles.add("src/components/AppDataGridRowDnd/DataGridDragHandle.tsx");
const componentFiles = new Set([...interactionFiles, ...['Typography', 'Box', 'Stack', 'Surface', 'Card', 'Divider', 'IconButton', 'ButtonGroup', 'SplitAction', 'Link', 'Breadcrumbs', 'List', 'Navigation', 'Disclosure', 'Collapse', 'Chip', 'Badge', 'Progress', 'Status', 'Avatar', 'Table', 'Pagination'].map(name => `src/experimental/${name}/${name}.tsx`)]);
// Catalog components enter the same strict owned boundary as they migrate.
const migratedDirectories = ['AppInlineProgress', 'AppOperationSteps', 'EditableTitleField', 'Typefaces', 'CardPaginationFooter', 'CardCollectionWithFooter', 'ClassCardFrame', 'InstructorClassCard', 'LearnerClassCard', 'AppButton', 'ExperiencePageNavigator', 'AppPageTabs', 'AppPageHeader', 'AppModal', 'AuthShell', 'SideNavigation', 'AppShell', 'ColumnsLayoutModal', 'ImageUploadModal', 'LinkUrlModal', 'InsertContentMenuControl', 'TextAlignMenuControl', 'TextColorPickerControl', 'TextStyleMenuControl', 'RichTextFormattingToolbar', 'FloatingTextSelectionToolbar', 'DocumentEditorLayout', 'DocumentEditorToolbar', 'ContentEditorChrome', 'PageRichTextEditorSection', 'DataToolbar', 'AppDataGrid', 'AppDataGridShell', 'LearnerClassesDataGrid', 'AppDataGridRowDnd', 'icons', 'primitives'];
const entryOnlyDirectories = new Set(['Typefaces', 'icons', 'primitives']);
componentFiles.add('src/components/primitives/Progress.tsx');
for (const name of migratedDirectories.filter(name => !entryOnlyDirectories.has(name))) {
  componentFiles.add(`src/components/${name}/${name === 'AppDataGridRowDnd' ? 'DataGridDragHandle' : name}.tsx`);
}
// Parse module references so type imports, reexports and lower-level hooks cannot
// bypass the interaction boundary via syntax that lacks a `from` clause.
function moduleReferences(path, code) {
  const modules = [];
  const source = typescript.createSourceFile(path, code, typescript.ScriptTarget.Latest, true);
  function inspect(node) {
    let module;
    if (typescript.isImportDeclaration(node) || typescript.isExportDeclaration(node)) module = node.moduleSpecifier;
    else if (typescript.isImportTypeNode(node) && typescript.isLiteralTypeNode(node.argument)) module = node.argument.literal;
    else if (typescript.isExternalModuleReference(node)) module = node.expression;
    else if (typescript.isCallExpression(node) && (node.expression.kind === typescript.SyntaxKind.ImportKeyword
      || (typescript.isIdentifier(node.expression) && node.expression.text === 'require'))) module = node.arguments[0];
    if (module && typescript.isStringLiteralLike(module)) modules.push(module.text);
    typescript.forEachChild(node, inspect);
  }
  inspect(source);
  return modules;
}

export function assertInteractionBoundary(path, code, root = process.cwd()) {
  const ownedPath = relative(root, resolve(root, path)).split('\\').join('/');
  for (const module of moduleReferences(path, code)) {
    if (/^(?:react-aria(?:-components)?|react-stately|@react-aria\/[^/]+|@react-stately\/[^/]+)(?:\/|$)/.test(module)) {
      assert(interactionFiles.has(ownedPath), `Interaction dependency outside its implementation layer: ${path}`);
    }
  }
}

export async function checkFoundations() {
const source = JSON.parse(await readFile('src/foundation/tokens.json', 'utf8'));
const { ts } = compileTokens(source);
const cssErrors = [];
const variables = new Set([...ts.matchAll(/var\((--sgui-[\w-]+)\)/g)].map(match => match[1]));
async function visit(dir, accept = () => true) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await visit(path, accept);
    else if (accept(entry.name) && /\.(tsx?|css)$/.test(path)) {
      const code = await readFile(path, 'utf8');
      assert(!/@mui|@emotion|Mui[A-Z]|\bsx[=:]/.test(code), `Retired styling/foundation in ${path}`);
      assert(!/from\s+["'](?:@structured-growth\/sg-ui|\.\.\/index|\.\.\/\.\.\/index)["']/.test(code), `Internal root import in ${path}`);
      assertInteractionBoundary(path, code);
      if (componentFiles.has(path) || path === 'src/foundation/ThemeScope.tsx') {
        await access(path.replace(/\.tsx$/, '.test.tsx')).catch(() => {
          throw new Error(`Missing colocated component behavior tests: ${path}`);
        });
      }
      if (path.endsWith('.module.css')) {
        cssErrors.push(...validateComponentCss(code, { path, variables }));
      }
    }
  }
}
await visit('src/foundation');
await visit('src/experimental');
for (const name of migratedDirectories) await visit(`src/components/${name}`);
const audited = new Set();
async function auditDependencies(path) {
  if (audited.has(path)) return;
  audited.add(path);
  const code = await readFile(path, 'utf8');
  assert(!/@mui|@emotion|Mui[A-Z]|\bsx[=:]/.test(code), `Retired transitive dependency of migrated catalog: ${path}`);
  assertInteractionBoundary(path, code);
  for (const module of moduleReferences(path, code).filter(module => module.startsWith('.'))) {
    const base = resolve(dirname(path), module);
    if (/\.(?:css|json)$/.test(base)) continue;
    let target;
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]) {
      if (!/\.(?:ts|tsx)$/.test(candidate)) continue;
      try { await access(candidate); target = candidate; break; } catch { /* Try the next source resolution. */ }
    }
    assert(target, `Unresolved migrated source dependency ${module} from ${path}`);
    await auditDependencies(target);
  }
}
for (const name of migratedDirectories.filter(name => !entryOnlyDirectories.has(name))) {
  await auditDependencies(resolve(`src/components/${name}/${name === 'AppDataGridRowDnd' ? 'DataGridDragHandle' : name}.tsx`));
}
for (const path of ['src/components/icons/index.ts', 'src/components/primitives/index.ts', 'src/icons/index.ts', 'src/primitives/index.ts']) await auditDependencies(resolve(path));
for (const file of await readdir('src/icons')) if (file.endsWith('.tsx')) await auditDependencies(resolve(`src/icons/${file}`));
await visit('src/icons');
await visit('src/primitives');
await visit('src/theme');
await auditDependencies(resolve('src/theme/index.ts'));
await auditDependencies(resolve('src/index.ts'));
for (const name of ['AdminDataGridOptions', 'InstructorDataGridOptions']) await auditDependencies(resolve(`src/components/${name}.ts`));
// M-16 is split into implementation batches. Audit the owned processing/model
// files now without claiming that the surrounding legacy catalog has migrated.
await visit('src/components/AppDataGrid', name => name.startsWith('ownedGrid'));
for (const file of ['ownedGridModel.ts', 'ownedGridState.ts', 'ownedGridController.ts', 'ownedGridLayoutController.ts', 'ownedGridInteraction.tsx', 'ownedGridInteraction.stories.tsx', 'ownedGridColumns.ts', 'ownedGridCells.tsx', 'ownedGridParts.tsx', 'ownedGridProcessing.stories.tsx', 'ownedGridCells.stories.tsx', 'ownedGridParts.stories.tsx']) {
  await auditDependencies(resolve(`src/components/AppDataGrid/${file}`));
}
assert.equal(cssErrors.length, 0, [...new Set(cssErrors)].join('\n'));
console.log('Owned foundation import, layer and token checks pass.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await checkFoundations();
}
