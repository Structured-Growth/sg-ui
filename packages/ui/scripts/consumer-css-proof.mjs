// Runs inside an independently installed packed Vite fixture.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { build } from 'vite';
const packageJson = JSON.parse(await readFile(new URL('./package.json', import.meta.resolve('@structured-growth/sg-ui/package.json')), 'utf8'));
assert.deepEqual(packageJson.sideEffects, ['./dist/**/*.css'], 'Packed CSS side effects changed');
await writeFile('css-only.js', "import '@structured-growth/sg-ui/styles.css';\n");
await writeFile('css-lazy.js', "import '@structured-growth/sg-ui/styles.css';export {Button} from '@structured-growth/sg-ui/components/Button';\n");
await writeFile('css-mixed.js', `import '@structured-growth/sg-ui/styles.css';
import '@structured-growth/sg-ui/styles.css';
export {Button as RootButton} from '@structured-growth/sg-ui';
export {Button as GranularButton} from '@structured-growth/sg-ui/components/Button';
export const load = () => import('./css-lazy.js');\n`);
const receipts = [];
for (const entry of ['css-only.js', 'css-mixed.js']) {
  let moduleIds = [];
  const result = await build({ configFile: false, logLevel: 'error', plugins: [{name:'retain-css-graph', generateBundle() {moduleIds = [...this.getModuleIds()];}}],
    build: {write:false, rollupOptions:{input:entry}, cssCodeSplit:true} });
  const output = (Array.isArray(result) ? result : [result]).flatMap(result => result.output);
  const css = output.filter(asset => asset.type === 'asset' && asset.fileName.endsWith('.css'));
  assert.equal(css.length, 1, entry + ' must retain one stylesheet');
  assert(String(css[0].source).includes('--sgui-action') && String(css[0].source).includes('sgui_root_'), 'Tokens/classes pruned');
  receipts.push({entry, moduleIds, cssSha256:createHash('sha256').update(css[0].source).digest('hex'),
    assets: output.map(asset => ({fileName:asset.fileName,type:asset.type}))});
}
assert.equal(receipts[0].cssSha256, receipts[1].cssSha256, 'Mixed/repeated/dynamic imports duplicated or changed stylesheet bytes');
await writeFile('css-retention.json', JSON.stringify(receipts, null, 2));
console.log('Packed CSS import-only and mixed root/granular/repeated/dynamic production graphs retain identical single CSS assets.');
