import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

export function assertOwnedDeclaration(path, declaration) {
  assert(!/react-aria|react-stately|@react-types|@react-stately|@mui|@emotion|lucide-react|@tanstack/.test(declaration), `Upstream type escaped: ${path}`);
}

export async function checkOwnedDeclarations(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await checkOwnedDeclarations(path);
    else if (path.endsWith('.d.ts')) {
      assertOwnedDeclaration(path, await readFile(path, 'utf8'));
    }
  }
}
export async function checkPackage() {
// Directives belong to source implementations, never to a build-time directory rule.
async function checkClientBoundaries(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory() && path !== 'src/fixtures') await checkClientBoundaries(path);
    else if (/\.tsx?$/.test(path) && !/\.(test|stories)\./.test(path) && !path.endsWith('.d.ts')) {
      const source = await readFile(path, 'utf8');
      const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
      const client = sourceFile.statements.some(statement => ts.isExpressionStatement(statement)
        && ts.isStringLiteral(statement.expression) && statement.expression.text === 'use client');
      const output = await readFile(path.replace(/^src\//, 'dist/').replace(/\.tsx?$/, '.js'), 'utf8');
      assert.equal(/^['"]use client['"];/.test(output), client, `Build changed source client boundary: ${path}`);
      for (const statement of sourceFile.statements) {
        if (!ts.isImportDeclaration(statement) || statement.importClause?.isTypeOnly
          || statement.moduleSpecifier.text !== 'react') continue;
        const imports = statement.importClause?.namedBindings;
        if (imports && ts.isNamedImports(imports)) {
          const clientOnly = imports.elements.some(element => !element.isTypeOnly
            && /^(createContext|useContext|useState|useReducer|useEffect|useLayoutEffect|useInsertionEffect|useRef|useSyncExternalStore|useImperativeHandle)$/.test((element.propertyName ?? element.name).text));
          assert(!clientOnly || client, `React client API requires explicit source directive: ${path}`);
        }
      }
    }
  }
}
await checkClientBoundaries('src');
// Audit every emitted implementation, stylesheet, declaration and source map,
// including modules outside the public declaration checks below. Historical
// documentation and preserved legal notices are reviewed separately.
const retiredReference = /@mui\b|@emotion\b|\bmui\b|\bMui[A-Z]\w*|\bemotion\b|\bmaterial-ui\b|mui-typography|baseGridSx/i;
async function checkRetiredOutput(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    assert(!retiredReference.test(entry.name), `Retired output filename: ${path}`);
    if (entry.isDirectory()) await checkRetiredOutput(path);
    else if (/\.(?:js|mjs|cjs|ts|css|json|map|svg|html|txt|md)$/.test(entry.name)) {
      assert(!retiredReference.test(await readFile(path, 'utf8')), `Retired implementation reference in output: ${path}`);
    }
  }
}
await checkRetiredOutput('dist');
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
for (const [name, entry] of Object.entries(pkg.exports)) {
  if (name === './package.json') continue;
  if (name === './experimental/icons/*Icon' || name === './icons/*Icon') {
    const directory = name.startsWith('./experimental/') ? 'dist/experimental/icons' : 'dist/icons';
    const files = (await readdir(directory)).filter(file => /^[A-Z].*Icon\.js$/.test(file));
    assert(files.length > 0, 'Individual icon modules are missing');
    for (const file of files) {
      const declarationPath = `${directory}/${file.replace(/\.js$/, '.d.ts')}`;
      assertOwnedDeclaration(declarationPath, await readFile(declarationPath, 'utf8'));
      const icon = await import(new URL(`../${directory}/${file}`, import.meta.url));
      assert(icon[file.replace(/\.js$/, '')], `Missing icon export ${file}`);
    }
    continue;
  }
  if (name === './styles.css') {
    const css = await readFile(entry, 'utf8');
    assert(css.includes('@layer sgui.tokens'), 'Missing scoped token layer');
    assert(css.includes('sgui_root_'), 'Missing compiled component styles');
    assert(!css.includes(':global') && !css.includes(':local'), 'Uncompiled CSS Modules');
    assert(pkg.sideEffects.includes('./dist/**/*.css'), 'Styles must survive tree shaking');
    continue;
  }
  assertOwnedDeclaration(entry.types, await readFile(entry.types, 'utf8'));
  const exports = await import(new URL(`../${entry.import}`, import.meta.url));
  assert(Object.keys(exports).length > 0, `${name} has no exports`);
}
const ui = await import('../dist/index.js');
for (const name of ['AppButton', 'AppDataGrid', 'AppModal', 'SideNavigation', 'PageRichTextEditorSection', 'AppThemeProvider', 'Provider', 'ThemeScope', 'SGNavigationProvider']) {
  assert(ui[name], `Missing ${name}`);
}
for (const name of ['lightTheme', 'darkTheme', 'theme']) assert(!ui[name], `Retired theme object exported: ${name}`);
await checkOwnedDeclarations('dist/theme');
for (const group of ['dependencies','peerDependencies','devDependencies','optionalDependencies']) assert(!Object.keys(pkg[group] ?? {}).some(name => /^@mui\/|^@emotion\//.test(name)), `Retired package in ${group}`);
for (const name of ['createAdminCourseGridOptions', 'createAdminPeopleGridOptions', 'createInstructorCourseGridOptions', 'createInstructorCourseLearnersGridOptions']) {
  const preset = ui[name]();
  assert(preset.columnOptions[0].locked && preset.columnOptions.at(-1).locked, `Missing public preset locks: ${name}`);
}
console.log('All package entry points import successfully.');

execFileSync('pnpm', ['exec', 'tsc', '--noEmit', '--strict', '--skipLibCheck', '--jsx', 'react-jsx', '--module', 'ESNext', '--moduleResolution', 'Bundler', '--target', 'ES2022', '--esModuleInterop', 'scripts/package-consumer.tsx'], { stdio: 'inherit' });
console.log('Consumer imports and owned theme/typography contracts typecheck.');

const experimental = await import('../dist/experimental/index.js');
for (const name of ['Button', 'TextField', 'ThemeScope', 'Provider', 'Dialog', 'Popover', 'Tabs', 'ComboBox', 'AsyncMultiSelect', 'DateRangeSelector', 'isDateOnly', 'isDateRangeAllowed', 'DateField', 'TimeField', 'dateTimeToInstant', 'Checkbox', 'DataGrid', 'Calendar', 'DatePicker', 'DateRangePicker',
  'ToggleButton', 'ToggleButtonGroup', 'Tooltip', 'List', 'ListItem', 'ListItemButton', 'ListItemText', 'ListItemIcon',
  'Navigation', 'NavigationItem', 'Disclosure', 'Collapse', 'Chip', 'Badge', 'TagGroup', 'Progress', 'Status', 'Avatar',
  'Table', 'TableHead', 'TableBody', 'TableFoot', 'TableRow', 'TableCell', 'TableHeaderCell', 'TableCaption', 'Pagination']) {
  assert(experimental[name], `Missing experimental ${name}`);
}
const tokens = await readFile('dist/foundation/tokens.generated.js', 'utf8');
assert(!tokens.includes('use client'), 'Token references must be server importable');
await checkOwnedDeclarations('dist/experimental');
await checkOwnedDeclarations('dist/foundation');
for (const file of ['ownedGridModel', 'ownedGridState', 'ownedGridColumns', 'ownedGridCells', 'ownedGridParts', 'ownedGridController', 'ownedGridLayoutController', 'ownedGridInteraction']) {
  const declaration = await readFile(`dist/components/AppDataGrid/${file}.d.ts`, 'utf8');
  assertOwnedDeclaration(`dist/components/AppDataGrid/${file}.d.ts`, declaration);
}
for (const name of ['AppInlineProgress', 'AppOperationSteps', 'EditableTitleField', 'CardPaginationFooter', 'CardCollectionWithFooter', 'ClassCardFrame', 'InstructorClassCard', 'LearnerClassCard', 'AppButton', 'ExperiencePageNavigator', 'AppPageTabs', 'AppPageHeader', 'AppModal', 'AuthShell', 'SideNavigation', 'AppShell', 'ColumnsLayoutModal', 'ImageUploadModal', 'LinkUrlModal', 'InsertContentMenuControl', 'TextAlignMenuControl', 'TextColorPickerControl', 'TextStyleMenuControl', 'RichTextFormattingToolbar', 'FloatingTextSelectionToolbar', 'DocumentEditorLayout', 'DocumentEditorToolbar', 'ContentEditorChrome', 'PageRichTextEditorSection', 'DataToolbar', 'AppDataGrid', 'AppDataGridShell', 'LearnerClassesDataGrid', 'AppDataGridRowDnd', 'icons', 'primitives']) await checkOwnedDeclarations(`dist/components/${name}`);

await checkOwnedDeclarations('dist/icons');
await checkOwnedDeclarations('dist/primitives');
const primitives = await import('../dist/primitives/index.js');
for (const name of ['Box','Stack','Typography','TextField','CircularProgress','Checkbox','IconButton','Link','Menu','Select','Autocomplete','Divider','Chip','LinearProgress','Switch','List','ListItem','ListItemButton','ListItemText','Table','TableHead','TableBody','TableRow','TableCell','Collapse','Tooltip']) assert(primitives[name], `Missing owned public primitive ${name}`);
for (const name of ['MuiLink','FormControlLabel','MenuItem']) assert(!primitives[name], `Retired primitive still exported: ${name}`);

for (const directory of ['dist/adapters', 'dist/hooks', 'dist/i18n']) await checkOwnedDeclarations(directory);
for (const file of ['dist/index.d.ts', 'dist/models.d.ts']) {
  assertOwnedDeclaration(file, await readFile(file, 'utf8'));
}
await checkOwnedDeclarations('dist/utils');

// Inspect the actual distributable, not only self-referenced checkout exports.
const packedAudit = await mkdtemp(join(tmpdir(), 'sgui-package-audit-'));
try {
  execFileSync('pnpm', ['pack', '--pack-destination', packedAudit], { stdio: 'pipe' });
  const tarballs = (await readdir(packedAudit)).filter(name => name.endsWith('.tgz'));
  assert.equal(tarballs.length, 1, 'Expected one package tarball');
  execFileSync('tar', ['-xzf', join(packedAudit, tarballs[0]), '-C', packedAudit]);
  const packedRoot = join(packedAudit, 'package');
  const packedPackage = JSON.parse(await readFile(join(packedRoot, 'package.json'), 'utf8'));
  assert.deepEqual(packedPackage.exports, pkg.exports, 'Pack changed public export conditions');
  assert.deepEqual(packedPackage.sideEffects, pkg.sideEffects, 'Pack changed CSS side effects');
  async function comparePacked(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) await comparePacked(path);
      else assert.deepEqual(await readFile(join(packedRoot, path)), await readFile(path), `Packed output missing or stale: ${path}`);
    }
  }
  await comparePacked('dist');
  await checkRetiredOutput(join(packedRoot, 'dist'));
  for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'README.md']) {
    assert.deepEqual(await readFile(join(packedRoot, name)), await readFile(name), `Pack lost or changed ${name}`);
  }
  const topLevel = await readdir(packedRoot);
  assert(topLevel.every(name => ['dist', 'LICENSE', 'THIRD_PARTY_NOTICES.md', 'README.md', 'package.json'].includes(name)), 'Unexpected source/configuration shipped');
  console.log('Packed JS, declarations, CSS, maps and assets match the fresh build; exports and notices are retained.');
} finally {
  await rm(packedAudit, { recursive: true, force: true });
}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await checkPackage();
}
