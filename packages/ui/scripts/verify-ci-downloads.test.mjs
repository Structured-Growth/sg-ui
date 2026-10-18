import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { verifyCI } from './verify-ci-downloads.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex');
async function fixture(t) {
 const root=await mkdtemp(resolve(process.env.SGUI_CI_EVIDENCE_SCRATCH ?? dirname(fileURLToPath(import.meta.url)),'.verify-ci-'));t.after(()=>rm(root,{recursive:true,force:true}));
 const put=async(path,value='bytes')=>{const full=resolve(root,path);await mkdir(dirname(full),{recursive:true});await writeFile(full,value);return full;};
 const head='a'.repeat(40),run={id:123,head_sha:head,status:'completed',conclusion:'success',html_url:'https://github.com/Structured-Growth/sg-ui/actions/runs/123',run_attempt:1};
 const names=['Require every native engine','Package and behavior checks','Build native docs fixtures','Packed React 18.3 foundation consumer','Packed React 19 foundation and Flight consumer','Packed React 18.3 editor consumer','Packed React 19 editor consumer','Pack validated package','Bind fresh outputs and tarball to validated inputs'];
 const job={run_id:123,run_attempt:1,name:'Validate Node 22.12.0',head_sha:head,status:'completed',conclusion:'success',steps:names.map(name=>({name,status:'completed',conclusion:'success'}))};
 const outputs={};for(const name of ['index.js','index.d.ts','styles.css']){await put('package/dist/'+name);outputs['packages/ui/dist/'+name]=hash('bytes');}await put('native/index.html');outputs['packages/ui/browser-docs-static/index.html']=hash('bytes');
 await put('native/assets/app.css');outputs['packages/ui/browser-docs-static/assets/app.css']=hash('bytes');
 await put('package/LICENSE','license');await put('package/THIRD_PARTY_NOTICES.md','notices');
 const inputs={'src/input':hash('source'),'packages/ui/LICENSE':hash('license'),'packages/ui/THIRD_PARTY_NOTICES.md':hash('notices')};
 const receipt={schemaVersion:1,head,runURL:run.html_url,runAttempt:'1',node:'v22.12.0',inputs,inputHash:hash(JSON.stringify(inputs)),outputs,tarball:{sha256:hash('tarball')}};
 const download={expectedHead:head,runtime:'22.12.0',run,job,artifacts:[],receiptPath:await put('receipt.json',JSON.stringify(receipt)),tarballPath:await put('package.tgz','tarball'),nativeDirectory:resolve(root,'native'),packageDirectory:resolve(root,'package')};
 for(const prefix of ['sgui-package','sgui-browser-docs','sgui-validation'])download.artifacts.push({name:prefix+'-node-22.12.0',expired:false,expires_at:'2099-01-01T00:00:00Z',workflow_run:{id:123,head_sha:head},digest:'sha256:'+hash('archive'),archivePath:await put(prefix+'.zip','archive')});
 return {download,put,receipt};
}
test('synthetic consistent bytes pass with explicit authenticity and approval limits',async t=>{const f=await fixture(t);assert.equal((await verifyCI(f.download)).status,'consistent-downloaded-ci-evidence');});
test('rejects stale head, skipped check, missing/expired/wrong-run archive and altered archive bytes',async t=>{
 const f=await fixture(t);
 for(const edit of [d=>d.run.head_sha='b'.repeat(40),d=>d.job.run_attempt=2,d=>d.job.steps[0].conclusion='skipped',d=>d.artifacts.pop(),d=>d.artifacts[0].expired=true,d=>d.artifacts[0].workflow_run.id=456,d=>d.artifacts[0].digest='sha256:'+hash('replacement')]){const d=structuredClone(f.download);edit(d);await assert.rejects(verifyCI(d));}
});
test('rejects changed tarball, changed/extra extracted files and corrupted receipt inventory',async t=>{
 const f=await fixture(t);await f.put('package.tgz','changed');await assert.rejects(verifyCI(f.download),/Tarball/);await f.put('package.tgz','tarball');await f.put('package/dist/extra.js');await assert.rejects(verifyCI(f.download),/inventory mismatch/);await rm(resolve(f.download.packageDirectory,'dist/extra.js'));f.receipt.inputHash='0'.repeat(64);await f.put('receipt.json',JSON.stringify(f.receipt));await assert.rejects(verifyCI(f.download),/Input inventory/);
});

test('rejects packaged notices that differ from the fingerprinted input',async t=>{const f=await fixture(t);await f.put('package/THIRD_PARTY_NOTICES.md','changed notice');await assert.rejects(verifyCI(f.download),/legal-file digest/);});

test('Node24 downloaded evidence requires all three complete engine proofs matching packaged bytes',async t=>{
 const f=await fixture(t),d=f.download;d.runtime='24';d.job.name='Validate Node 24';f.receipt.node='v24.19.0';
 for(const step of ['Verify native engine scope and compiled package identity','Packed Next.js production and browser consumer'])d.job.steps.push({name:step,status:'completed',conclusion:'success'});
 for(const a of d.artifacts)a.name=a.name.replace('22.12.0','24');
 for(const name of ['sgui-browser-node-24',...['chromium','firefox','webkit'].map(b=>`sgui-native-${b}-node-24`)])d.artifacts.push({name,expired:false,expires_at:'2099-01-01T00:00:00Z',workflow_run:{id:123,head_sha:d.expectedHead},digest:'sha256:'+hash('archive'),archivePath:await f.put(name+'.zip','archive')});
 await f.put('receipt.json',JSON.stringify(f.receipt));
 d.nativeProofRoot=dirname(await f.put('engines/root','data'));
 for(const browser of ['chromium','firefox','webkit']){
  const base=`engines/sgui-native-${browser}-node-24/`;
  await f.put(base+'logs/build-receipt.json',JSON.stringify({...f.receipt,browser}));
  const report={config:{workers:1},suites:[{specs:[{id:'one',tests:[{projectName:browser,projectId:browser,status:'expected',results:[{status:'passed'}]}]}]}],stats:{expected:1,unexpected:0,flaky:0,skipped:0},errors:[]};
  await f.put(base+'logs/browser-collection.json',JSON.stringify(report));await f.put(base+'browser-results.json',JSON.stringify(report));
 }
 assert.equal((await verifyCI(d)).runtime,'24');
 await f.put('engines/sgui-native-webkit-node-24/browser-results.json','{"suites":[]}');
 await assert.rejects(verifyCI(d),/Empty native collection/);
});
