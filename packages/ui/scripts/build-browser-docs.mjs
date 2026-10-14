import { execFileSync } from 'node:child_process';
import { build } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Build the dedicated public-package consumer fixtures. Tests never rebuild or
// mutate this tree while a browser suite or attested frozen snapshot is running.
const libraryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = resolve(libraryRoot, '../..');
const args = process.argv.slice(2);
let outDir = resolve(libraryRoot, 'browser-docs-static');
if (args.length) {
  if (args.length !== 2 || args[0] !== '--output-dir' || !args[1]) throw new Error('Usage: node scripts/build-browser-docs.mjs [--output-dir path]');
  outDir = resolve(process.cwd(), args[1]);
}
execFileSync('pnpm', ['exec', 'tsc', '--noEmit', '-p', resolve(workspaceRoot, 'apps/docs/native-fixtures/tsconfig.json')], {cwd: libraryRoot, stdio:'inherit'});
await build({
  configFile: resolve(workspaceRoot, 'apps/docs/native-fixtures/vite.config.ts'),
  build: { outDir, emptyOutDir: true },
});
