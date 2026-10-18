import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ui = resolve(dirname(fileURLToPath(import.meta.url)), '../../../packages/ui');
const require = createRequire(resolve(ui, 'package.json'));
const { defineConfig } = require('vitest/config');
export default defineConfig({
  root: ui,
  plugins: [{ name: 'reject-built-package-in-source-units', enforce: 'pre', resolveId(id) {
    if (id === '@structured-growth/sg-ui' || id.startsWith('@structured-growth/sg-ui/')) throw Error('Source unit tests must not depend on dist: ' + id);
  } }],
  test: { environment: 'node', include: ['src/components/AppDataGrid/AppDataGrid.sectioned-lineage.test.tsx'],
    setupFiles: ['scripts/vitest.setup.ts'], execArgv: ['--no-experimental-webstorage'] },
});
