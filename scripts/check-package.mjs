import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
for (const [name, entry] of Object.entries(pkg.exports)) {
  if (name === './package.json') continue;
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
