// Join independent engine runners to the package that will actually be packed.
// JSON data only: never execute files downloaded from validation artifacts.
import assert from 'node:assert/strict';
import {readFile,writeFile,lstat,realpath} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {inventory,inputPaths} from './ci-artifacts.mjs';

const engines=['chromium','firefox','webkit'];
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
function collected(report,browser,executed) {
 const ids=[];
 function walk(suites) {
  for(const suite of suites??[]) {
   for(const spec of suite.specs??[])for(const test of spec.tests??[]) {
    assert.equal(test.projectName,browser,'Unexpected engine in native report');
    assert.ok(spec.id,'Missing test identity');
    ids.push(`${spec.id}:${test.projectId??test.projectName}`);
    if(executed) {
     assert.ok(['expected','skipped'].includes(test.status),'Unexpected/flaky native test');
     assert.equal(test.results?.length,1,'Native test must execute once without retries');
     assert.equal(test.results[0].status,test.expectedStatus??'passed','Native execution differs from its expected result');
     if(test.status==='skipped')assert.equal(test.results[0].status,'skipped','Skipped native result mismatch');
    }
   }
   walk(suite.suites);
  }
 }
 walk(report.suites);
 assert.ok(ids.length,'Empty native collection');
 assert.equal(new Set(ids).size,ids.length,'Duplicate native test identity');
 return ids.sort();
}
export function verifyNativeRecords(records,expected) {
 assert.deepEqual(Object.keys(records).sort(),[...engines].sort(),'All three engines are mandatory');
 const summaries={};
 for(const browser of engines) {
  const {receipt,collection,results}=records[browser];
  assert.equal(receipt.schemaVersion,1);
  for(const key of ['head','node','runURL','runAttempt','inputHash'])assert.equal(receipt[key],expected[key],`Native ${browser} ${key} mismatch`);
  assert.equal(receipt.browser,browser,'Native receipt engine mismatch');
  const dist=Object.fromEntries(Object.entries(receipt.outputs??{}).filter(([path])=>path.startsWith('packages/ui/dist/')));
  assert.ok(Object.keys(dist).length,'Missing native compiled distribution');
  assert.deepEqual(dist,expected.dist,`Native ${browser} compiled bytes differ from package`);
  assert.deepEqual(receipt.outputs,expected.outputs,`Native ${browser} fixture/distribution bytes differ from official artifacts`);
  assert.deepEqual(collected(results,browser,true),collected(collection,browser,false),'Executed native scope differs from complete collection');
  assert.equal(results.config.workers,1,'Native engines retain serial execution');
  assert.equal(results.stats.unexpected,0);
  assert.equal(results.stats.flaky,0);
  assert.ok(results.stats.expected>0,'No successful native tests');
  assert.deepEqual(results.errors??[],[],'Native runner errors');
  summaries[browser]={tests:collected(results,browser,true).length,stats:results.stats};
 }
 return {head:expected.head,node:expected.node,runURL:expected.runURL,inputHash:expected.inputHash,distHash:sha(JSON.stringify(expected.dist)),outputHash:sha(JSON.stringify(expected.outputs)),engines:summaries,
  limits:'Complete maintained engine collections, including explicitly reported existing skips; not manual AT, visual-baseline approval or publication.'};
}
export async function readNativeJSON(root,path) {
 const absolute=resolve(root,path),actualRoot=await realpath(root),actual=await realpath(absolute),stat=await lstat(absolute);
 assert.ok(actual.startsWith(actualRoot+sep),'Native artifact escaped its root');
 assert.ok(stat.isFile()&&!stat.isSymbolicLink()&&stat.size<=128*1024*1024,'Invalid/oversized native JSON artifact');
 const bytes=await readFile(absolute);
 return {value:JSON.parse(bytes),sha256:sha(bytes)};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..'),artifactRoot=process.argv[2];
 assert.ok(artifactRoot,'Supply downloaded native artifact directory');
 const inputs=await inventory(root,inputPaths),records={},hashes={};
 for(const browser of engines) {
  const base=`sgui-native-${browser}-node-24`;
  records[browser]={};hashes[browser]={};
  for(const [key,path]of Object.entries({receipt:'logs/build-receipt.json',collection:'logs/browser-collection.json',results:'browser-results.json'})) {
   const data=await readNativeJSON(artifactRoot,`${base}/${path}`);records[browser][key]=data.value;hashes[browser][key]=data.sha256;
  }
 }
 const summary=verifyNativeRecords(records,{
  head:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),node:process.version,
  runURL:`${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
  runAttempt:process.env.GITHUB_RUN_ATTEMPT,inputHash:sha(JSON.stringify(inputs)),dist:await inventory(root,['packages/ui/dist']),outputs:await inventory(root,['packages/ui/dist','packages/ui/browser-docs-static']),
 });
 await writeFile(resolve(root,'packages/ui/artifacts/logs/native-validation.json'),JSON.stringify({...summary,artifactHashes:hashes},null,2)+'\n');
 console.log('Verified all three native engine collections against the exact package inputs and compiled bytes.');
}
