import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const own = dirname(fileURLToPath(import.meta.url));
const root = resolve(own, '../../../../packages/ui');
const proposed = resolve(own, 'proposed-files/packages/ui');
export default {
  esbuild: { jsx: 'automatic' },
  root, cacheDir: resolve(own, '.vite-cache'),
  plugins: [{ name: 'reviewable-proposal-imports', enforce: 'pre', resolveId(source, importer) {
    if (!source.startsWith('.') && importer?.startsWith(proposed)) return this.resolve(source, importer.replace(proposed, root), { skipSelf: true });
    if (source.startsWith('.') && importer?.startsWith(proposed)) {
      const target = resolve(dirname(importer), source);
      if (![target, target + '.tsx', target + '.ts'].some(existsSync)) return this.resolve(target.replace(proposed, root), undefined, { skipSelf: true });
    }
  }}],
  test: { environment: 'node', include: [proposed + '/src/**/*.test.{ts,tsx}'], setupFiles: [root + '/scripts/vitest.setup.ts'],
    execArgv: ['--no-experimental-webstorage'], maxWorkers: 1, fileParallelism: false }
};
