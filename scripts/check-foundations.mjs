import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import postcss from 'postcss';
import { compileTokens } from './tokens.mjs';

const source = JSON.parse(await readFile('src/foundation/tokens.json', 'utf8'));
const { ts } = compileTokens(source);
const variables = new Set([...ts.matchAll(/var\((--sgui-[\w-]+)\)/g)].map(match => match[1]));
const interactionFiles = new Set(['Button', 'TextField', 'Provider', 'Dialog', 'Popover', 'Tabs', 'ComboBox', 'AsyncMultiSelect', 'DateRangeSelector', 'DateField', 'TimeField', 'Checkbox', 'DataGrid', 'Calendar', 'DatePicker', 'DateRangePicker', 'Menu', 'Switch', 'RadioGroup', 'Select', 'TextArea', 'ToggleButton', 'Tooltip', 'TagGroup', 'Progress']
  .map(name => `src/experimental/${name}/${name}.tsx`));
const componentFiles = new Set([...interactionFiles, ...['Typography', 'Box', 'Stack', 'Surface', 'Card', 'Divider', 'IconButton', 'ButtonGroup', 'SplitAction', 'Link', 'Breadcrumbs', 'List', 'Navigation', 'Disclosure', 'Collapse', 'Chip', 'Badge', 'Progress', 'Status', 'Avatar', 'Table', 'Pagination'].map(name => `src/experimental/${name}/${name}.tsx`)]);
// Catalog components enter the same strict owned boundary as they migrate.
const migratedDirectories = ['AppInlineProgress', 'AppOperationSteps', 'EditableTitleField', 'Typefaces', 'CardPaginationFooter', 'CardCollectionWithFooter', 'ClassCardFrame', 'InstructorClassCard', 'LearnerClassCard', 'AppButton', 'ExperiencePageNavigator', 'AppPageTabs', 'AppPageHeader', 'AppModal', 'AuthShell', 'SideNavigation', 'AppShell', 'ColumnsLayoutModal', 'ImageUploadModal', 'LinkUrlModal', 'InsertContentMenuControl', 'TextAlignMenuControl', 'TextColorPickerControl', 'TextStyleMenuControl', 'RichTextFormattingToolbar'];
for (const name of migratedDirectories.filter(name => name !== 'Typefaces')) {
  componentFiles.add(`src/components/${name}/${name}.tsx`);
}
async function visit(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await visit(path);
    else if (/\.(tsx?|css)$/.test(path)) {
      const code = await readFile(path, 'utf8');
      assert(!/@mui|@emotion|Mui[A-Z]|\bsx[=:]/.test(code), `Retired styling/foundation in ${path}`);
      assert(!/from\s+["'](?:@structured-growth\/sg-ui|\.\.\/index|\.\.\/\.\.\/index)["']/.test(code), `Internal root import in ${path}`);
      if (/from\s+["']react-aria/.test(code)) assert(interactionFiles.has(path), `Interaction dependency outside its implementation layer: ${path}`);
      if (componentFiles.has(path) || path === 'src/foundation/ThemeScope.tsx') {
        await access(path.replace(/\.tsx$/, '.test.tsx')).catch(() => {
          throw new Error(`Missing colocated component behavior tests: ${path}`);
        });
      }
      if (path.endsWith('.module.css')) {
        const css = postcss.parse(code);
        css.walkDecls(decl => {
          for (const match of decl.value.matchAll(/var\((--sgui-[\w-]+)/g)) {
            assert(variables.has(match[1]), `Unknown token ${match[1]} in ${path}`);
          }
        });
        css.walkRules(rule => {
          let parent = rule.parent;
          while (parent && !(parent.type === 'atrule' && parent.name === 'layer')) parent = parent.parent;
          assert(parent?.params === 'sgui.components', `Unlayered component rule in ${path}`);
          assert(!/(^|[\s,>])(?:body|html|:root)(?=$|[\s,.:[>])/.test(rule.selector), `Global host selector in ${path}`);
        });
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
  for (const match of code.matchAll(/(?:from\s+|import\s*)["'](\.[^"']+)["']/g)) {
    const base = resolve(dirname(path), match[1]);
    if (/\.(?:css|json)$/.test(base)) continue;
    let target;
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]) {
      if (!/\.(?:ts|tsx)$/.test(candidate)) continue;
      try { await access(candidate); target = candidate; break; } catch { /* Try the next source resolution. */ }
    }
    assert(target, `Unresolved migrated source dependency ${match[1]} from ${path}`);
    await auditDependencies(target);
  }
}
for (const name of migratedDirectories.filter(name => name !== 'Typefaces')) {
  await auditDependencies(resolve(`src/components/${name}/${name}.tsx`));
}
console.log('Owned foundation import, layer and token checks pass.');
