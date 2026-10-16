import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '../../../..');
const owner = resolve(root,'docs/developer/final-acceptance/wave-03-18');
const modules = ['TextArea/TextArea.tsx','TextField/useStandaloneFormReset.ts','RadioGroup/RadioGroup.tsx'];
export default {
  esbuild:{jsx:'automatic'},
  resolve:{alias: Object.fromEntries(['react','react-dom','vitest','@testing-library/react','@testing-library/user-event'].map(name => [name,resolve(root,'packages/ui/node_modules',name)]))},
  root, cacheDir: resolve(owner,'.vite-cache'),
  plugins: process.env.SGUI_W03_PATCH === '1' ? [{name:'review-proposed-source', enforce:'pre', load(id) {
    if (modules.some(module => id === resolve(root,'packages/ui/src/experimental',module)))
      return readFileSync(resolve(owner,'proposed-files',id.slice(root.length+1)),'utf8');
  }}] : [],
  test: { include:['docs/developer/final-acceptance/wave-03-18/*.test.tsx',...(['TextField','TextArea','RadioGroup'].map(name=>`packages/ui/src/experimental/${name}/${name}.test.tsx`))],
    setupFiles:[resolve(root,'packages/ui/scripts/vitest.setup.ts')], execArgv:['--no-experimental-webstorage'], maxWorkers:1 },
};
