import { existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const evidence = dirname(fileURLToPath(import.meta.url));
const root = resolve(evidence, '../../../..');
const mirror = resolve(evidence, 'proposed-files');
export default {
  root: resolve(root, 'packages/ui'),
  cacheDir: resolve(evidence, '.vite-cache'),
  esbuild: { jsx: 'automatic' },
  plugins: [{ name: 'wave0310-proposed-relative-imports', enforce: 'pre', resolveId(source, importer) {
    if (!importer?.startsWith(mirror + '/')) return;
    if (!source.startsWith('.')) return this.resolve(source, resolve(root, importer.slice(mirror.length + 1)), { skipSelf: true });
    const candidate = resolve(dirname(importer), source);
    const extensions = ['', '.tsx', '.ts', '.js', '/index.ts', '/index.tsx'];
    if (extensions.some(ext => existsSync(candidate + ext) && statSync(candidate + ext).isFile())) return;
    const original = resolve(root, candidate.slice(mirror.length + 1));
    return extensions.map(ext => original + ext).find(path => existsSync(path) && statSync(path).isFile());
  }}],
  test: {
    include: [resolve(mirror, 'packages/ui/src/experimental/DataGrid/GridColumnWidthControl.test.tsx'), resolve(mirror, 'packages/ui/src/components/AppDataGrid/columnWidthAlternative.test.tsx')],
    setupFiles: [resolve(root, 'packages/ui/scripts/vitest.setup.ts')],
    maxWorkers: 1,
    execArgv: ['--no-experimental-webstorage'],
  },
};
