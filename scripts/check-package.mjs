import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
for (const [name, entry] of Object.entries(pkg.exports)) {
  if (name === './package.json') continue;
  if (name === './experimental/icons/*Icon') {
    const files = (await readdir('dist/experimental/icons')).filter(file => /^[A-Z].*Icon\.js$/.test(file));
    assert(files.length > 0, 'Individual icon modules are missing');
    for (const file of files) {
      await readFile(`dist/experimental/icons/${file.replace(/\.js$/, '.d.ts')}`, 'utf8');
      const icon = await import(new URL(`../dist/experimental/icons/${file}`, import.meta.url));
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
for (const name of ['AppButton', 'AppDataGrid', 'AppModal', 'SideNavigation', 'PageRichTextEditorSection', 'lightTheme', 'darkTheme', 'SGNavigationProvider']) {
  assert(ui[name], `Missing ${name}`);
}
assert.equal(ui.lightTheme.typography.bodyAlt2.fontWeight, 500);
console.log('All package entry points import successfully.');

execFileSync('pnpm', ['exec', 'tsc', '--noEmit', '--strict', '--skipLibCheck', '--jsx', 'react-jsx', '--module', 'ESNext', '--moduleResolution', 'Bundler', '--target', 'ES2022', '--esModuleInterop', 'scripts/package-consumer.tsx'], { stdio: 'inherit' });
console.log('Consumer imports and custom typography declarations typecheck.');

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
for (const name of ['AppInlineProgress', 'AppOperationSteps', 'EditableTitleField', 'CardPaginationFooter', 'CardCollectionWithFooter', 'ClassCardFrame', 'InstructorClassCard', 'LearnerClassCard', 'AppButton', 'ExperiencePageNavigator', 'AppPageTabs', 'AppPageHeader', 'AppModal', 'AuthShell', 'SideNavigation', 'AppShell', 'ColumnsLayoutModal', 'ImageUploadModal', 'LinkUrlModal', 'InsertContentMenuControl', 'TextAlignMenuControl', 'TextColorPickerControl', 'TextStyleMenuControl', 'RichTextFormattingToolbar', 'FloatingTextSelectionToolbar', 'DocumentEditorLayout', 'DocumentEditorToolbar', 'ContentEditorChrome', 'PageRichTextEditorSection']) await checkOwnedDeclarations(`dist/components/${name}`);
