import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const own = dirname(fileURLToPath(import.meta.url));
const repository = resolve(own, '../../../..');
const root = resolve(repository, 'packages/ui');
export default {
  root,
  cacheDir: resolve(own, '.vite-cache'),
  plugins: [{
    name: 'wave-03-26-read-only-overlay', enforce: 'pre',
    resolveId(source, importer) {
      if (source.endsWith('/imagePayloadPolicy') && importer) return resolve(dirname(importer), source + '.ts');
    },
    load(id) {
      const clean = id.split('?')[0];
      if (!clean.startsWith(repository + '/')) return;
      if (process.env.WAVE26_BASELINE === '1' && !clean.endsWith('.test.tsx')) return;
      const mirror = resolve(own, 'proposed-files', clean.slice(repository.length + 1));
      if (existsSync(mirror)) return readFileSync(mirror, 'utf8');
    },
  }],
  test: {
    environment: 'node',
    include: ['src/components/PageRichTextEditorSection/lexical/ImageNode.test.tsx',
      'src/components/PageRichTextEditorSection/PageRichTextEditorSection.dialogs.test.tsx'],
    setupFiles: [resolve(root, 'scripts/vitest.setup.ts')],
    execArgv: ['--no-experimental-webstorage'],
    maxWorkers: 1,
  },
};
