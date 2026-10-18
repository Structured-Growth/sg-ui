import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { begin, complete } from './ci-artifacts.mjs';
import {verifyNativeRecords,readNativeJSON} from './verify-native-ci.mjs';
// Scratch stays alongside this test, so the review mirror never writes shared output.
const scratch = dirname(fileURLToPath(import.meta.url));
async function fixture(t) {
  const root = await mkdtemp(resolve(scratch, '.ci-artifacts-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  async function put(path, text = 'current') {
    await mkdir(dirname(resolve(root, path)), { recursive: true });
    await writeFile(resolve(root, path), text);
  }
  for (const path of ['packages/ui/README.md', 'packages/ui/LICENSE', 'packages/ui/THIRD_PARTY_NOTICES.md', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', '.nvmrc', 'packages/ui/package.json', 'packages/ui/tsconfig.json', 'packages/ui/tsconfig.build.json', 'packages/ui/src/index.ts', 'packages/ui/scripts/build.mjs', 'packages/ui/playwright.config.ts', 'packages/ui/tests/browser/proof.spec.ts', 'apps/docs/package.json', 'apps/docs/theme/theme-graph.ts', 'apps/docs/native-fixtures/main.tsx', '.github/workflows/ci.yml']) await put(path);
  async function outputs() {
    for (const path of ['packages/ui/dist/index.js', 'packages/ui/dist/index.d.ts', 'packages/ui/dist/styles.css', 'packages/ui/browser-docs-static/index.html', 'packages/ui/browser-docs-static/assets/app.css', 'packages/ui/artifacts/sgui.tgz']) await put(path);
  }
  return { root, put, outputs };
}
test('clean start removes stale dist, native host and tarballs; receipt binds current inputs and bytes', async t => {
  const f = await fixture(t);
  await f.outputs(); await f.put('packages/ui/artifacts/old.tgz');
  await begin(f.root);
  await assert.rejects(readFile(resolve(f.root, 'packages/ui/dist/index.js')), { code: 'ENOENT' });
  await assert.rejects(readFile(resolve(f.root, 'packages/ui/browser-docs-static/index.html')), { code: 'ENOENT' });
  await assert.rejects(readFile(resolve(f.root, 'packages/ui/artifacts/old.tgz')), { code: 'ENOENT' });
  await f.outputs();
  await f.put('apps/docs/native-fixtures/registry.json', 'regenerated');
  await f.put('apps/docs/native-fixtures/public/index.json', 'regenerated');
  const r = await complete(f.root, { head: 'test-head' });
  assert.equal(r.head, 'test-head'); assert.match(r.tarball.sha256, /^[a-f0-9]{64}$/);
  assert.equal(r.outputs['packages/ui/dist/styles.css'], r.outputs['packages/ui/browser-docs-static/assets/app.css']);
  assert.equal(JSON.parse(await readFile(resolve(f.root, 'packages/ui/artifacts/logs/build-receipt.json'))).inputHash, r.inputHash);
});
test('changed source or missing stylesheet cannot produce a successful receipt', async t => {
  const f = await fixture(t); await begin(f.root); await f.outputs();
  await f.put('packages/ui/src/index.ts', 'changed');
  await assert.rejects(complete(f.root), /inputs changed/);
  await f.put('packages/ui/src/index.ts', 'current');
  await rm(resolve(f.root, 'packages/ui/dist/styles.css'));
  await assert.rejects(complete(f.root), /Missing\/empty output/);
  await f.put('packages/ui/dist/styles.css');
  await rm(resolve(f.root, 'packages/ui/browser-docs-static/assets/app.css'));
  await assert.rejects(complete(f.root), /Missing native fixture CSS/);
});
test('extra stale package and symlink output fail closed', async t => {
  const f = await fixture(t); await begin(f.root); await f.outputs();
  await f.put('packages/ui/artifacts/stale.tgz');
  await assert.rejects(complete(f.root), /exactly one/);
  await rm(resolve(f.root, 'packages/ui/artifacts/stale.tgz'));
  await symlink(resolve(f.root, 'package.json'), resolve(f.root, 'packages/ui/dist/leak.js'));
  await assert.rejects(complete(f.root), /Refusing symlink/);
});

function nativeProof() {
 const expected={head:'a'.repeat(40),node:'v24.19.0',runURL:'https://github.com/example/ui/actions/runs/1',runAttempt:'1',inputHash:'b'.repeat(64),dist:{'packages/ui/dist/index.js':'c'.repeat(64)}};
 expected.outputs={...expected.dist,'packages/ui/browser-docs-static/index.html':'f'.repeat(64)};
 const records=Object.fromEntries(['chromium','firefox','webkit'].map(browser=>{
  const test={projectName:browser,projectId:browser,status:'expected',results:[{status:'passed'}]};
  const report={config:{workers:1},suites:[{specs:[{id:'one',tests:[test]}]}],stats:{expected:1,unexpected:0,flaky:0,skipped:0},errors:[]};
  return [browser,{receipt:{schemaVersion:1,...expected,browser,outputs:expected.outputs},collection:structuredClone(report),results:report}];
 }));
 return {records,expected};
}
test('independent engine collections join the exact package inputs and compiled bytes',()=>{
 const {records,expected}=nativeProof();const result=verifyNativeRecords(records,expected);
 assert.deepEqual(Object.keys(result.engines),['chromium','firefox','webkit']);assert.equal(result.engines.webkit.tests,1);
});
test('missing engines, wrong heads/runs and changed distributed bytes fail the native join',()=>{
 for(const mutate of [r=>delete r.webkit,r=>r.firefox.receipt.head='d'.repeat(40),r=>r.chromium.receipt.runAttempt='2',r=>r.webkit.receipt.outputs={'packages/ui/dist/index.js':'d'.repeat(64)},r=>r.firefox.receipt.inputHash='e'.repeat(64),r=>r.webkit.receipt.outputs={...r.webkit.receipt.outputs,'packages/ui/browser-docs-static/index.html':'0'.repeat(64)}]){
  const {records,expected}=nativeProof();mutate(records);assert.throws(()=>verifyNativeRecords(records,expected));
 }
});
test('partial collections, absent executions and native runner errors cannot validate',()=>{
 for(const mutate of [r=>r.chromium.results.suites[0].specs=[],r=>r.firefox.results.suites[0].specs[0].tests[0].results=[],r=>r.webkit.results.errors=[{message:'runner error'}],r=>r.chromium.results.stats.unexpected=1,r=>r.firefox.results.config.workers=2,r=>r.chromium.results.suites[0].specs[0].tests[0].results[0].status='failed',r=>r.webkit.results.suites[0].specs[0].tests[0].results.push({status:'passed'})]){
  const {records,expected}=nativeProof();mutate(records);assert.throws(()=>verifyNativeRecords(records,expected));
 }
});

test('downloaded native JSON accepts data and rejects escaping and symlink paths',async t=>{
 const f=await fixture(t);await f.put('evidence/proof.json','{"passed":true}');
 assert.deepEqual((await readNativeJSON(resolve(f.root,'evidence'),'proof.json')).value,{passed:true});
 await assert.rejects(readNativeJSON(resolve(f.root,'evidence'),'../package.json'),/escaped/);
 await symlink(resolve(f.root,'evidence/proof.json'),resolve(f.root,'evidence/link.json'));
 await assert.rejects(readNativeJSON(resolve(f.root,'evidence'),'link.json'),/Invalid/);
});
