import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
for (const [name, entry] of Object.entries(pkg.exports)) {
  if (name === './package.json') continue;
  if (name === './experimental/icons/*Icon' || name === './icons/*Icon') {
    const directory = name.startsWith('./experimental/') ? 'dist/experimental/icons' : 'dist/icons';
    const files = (await readdir(directory)).filter(file => /^[A-Z].*Icon\.js$/.test(file));
    assert(files.length > 0, 'Individual icon modules are missing');
    for (const file of files) {
      await readFile(`${directory}/${file.replace(/\.js$/, '.d.ts')}`, 'utf8');
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
  await readFile(entry.types, 'utf8');
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
async function checkOwnedDeclarations(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await checkOwnedDeclarations(path);
    else if (path.endsWith('.d.ts')) {
      assert(!/react-aria|@react-types|@mui|@emotion|lucide-react|@tanstack/.test(await readFile(path, 'utf8')), `Upstream type escaped: ${path}`);
    }
  }
}
await checkOwnedDeclarations('dist/experimental');
await checkOwnedDeclarations('dist/foundation');
for (const file of ['ownedGridModel', 'ownedGridState', 'ownedGridColumns', 'ownedGridCells', 'ownedGridParts', 'ownedGridController', 'ownedGridLayoutController', 'ownedGridInteraction']) {
  const declaration = await readFile(`dist/components/AppDataGrid/${file}.d.ts`, 'utf8');
  assert(!/react-aria|@react-types|@mui|@emotion|lucide-react|@tanstack/.test(declaration), `Upstream grid model type escaped: ${file}`);
}
for (const name of ['AppInlineProgress', 'AppOperationSteps', 'EditableTitleField', 'CardPaginationFooter', 'CardCollectionWithFooter', 'ClassCardFrame', 'InstructorClassCard', 'LearnerClassCard', 'AppButton', 'ExperiencePageNavigator', 'AppPageTabs', 'AppPageHeader', 'AppModal', 'AuthShell', 'SideNavigation', 'AppShell', 'ColumnsLayoutModal', 'ImageUploadModal', 'LinkUrlModal', 'InsertContentMenuControl', 'TextAlignMenuControl', 'TextColorPickerControl', 'TextStyleMenuControl', 'RichTextFormattingToolbar', 'FloatingTextSelectionToolbar', 'DocumentEditorLayout', 'DocumentEditorToolbar', 'ContentEditorChrome', 'PageRichTextEditorSection', 'DataToolbar', 'AppDataGrid', 'AppDataGridShell', 'LearnerClassesDataGrid', 'AppDataGridRowDnd', 'icons', 'primitives']) await checkOwnedDeclarations(`dist/components/${name}`);

await checkOwnedDeclarations('dist/icons');
await checkOwnedDeclarations('dist/primitives');
const primitives = await import('../dist/primitives/index.js');
for (const name of ['Box','Stack','Typography','TextField','CircularProgress','Checkbox','IconButton','Link','Menu','Select','Autocomplete','Divider','Chip','LinearProgress','Switch','List','ListItem','ListItemButton','ListItemText','Table','TableHead','TableBody','TableRow','TableCell','Collapse','Tooltip']) assert(primitives[name], `Missing owned public primitive ${name}`);
for (const name of ['MuiLink','FormControlLabel','MenuItem']) assert(!primitives[name], `Retired primitive still exported: ${name}`);

for (const directory of ['dist/adapters', 'dist/hooks', 'dist/i18n']) await checkOwnedDeclarations(directory);
