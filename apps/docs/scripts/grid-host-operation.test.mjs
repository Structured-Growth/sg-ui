// Maintained deterministic tests of the private native-host adapter; no browser/build needed.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import path from 'node:path';
const root=process.env.SGUI_GRID_TEST_REPOSITORY??fileURLToPath(new URL('../../../',import.meta.url));
const sourcePath=path.join(root,'apps/docs/native-fixtures/scenarios/components/AppDataGridShell/gridHostOperation.ts');
const ts=createRequire(path.join(root,'apps/docs/package.json'))('typescript');
const source=readFileSync(sourcePath,'utf8');
const {outputText}=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});
const {createGridHostOperation}=await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const original=()=>[{id:'a',name:'Alpha'},{id:'b',name:'Beta'}];
function setup() {
  const rows=original(),requests=[],events=[];
  const host=createGridHostOperation(rows,(next,operation)=>{
    let resolve,reject;const promise=new Promise((accept,fail)=>{resolve=accept;reject=fail;});
    requests.push({rows:next,...operation,resolve,reject});return promise;
  });
  const unsubscribe=host.subscribe(()=>events.push(host.getSnapshot()));
  return {host,rows,requests,events,unsubscribe};
}
test('latest authoritative snapshot wins stale success and stale failure in either settlement order',async()=>{
  for(const latestFails of [false,true]) {
    const {host,rows,requests,events}=setup();
    const first=host.request([...rows].reverse());
    const second=host.request(rows.map(row=>({...row,name:row.name+' revised'})));
    assert.equal(requests[0].signal.aborted,true);assert.equal(requests[1].signal.aborted,false);
    assert.ok(requests[1].id>requests[0].id);
    const canonical=rows.map(row=>({...row,name:row.name+' canonical'}));
    if(latestFails)requests[1].reject(new Error('revision conflict'));else requests[1].resolve(canonical);
    assert.equal(await second,latestFails?'error':'saved');
    const accepted=host.getSnapshot(),eventCount=events.length;
    if(latestFails)requests[0].resolve([...rows].reverse());else requests[0].reject(new Error('obsolete failure'));
    assert.equal(await first,'discarded');assert.equal(host.getSnapshot(),accepted);assert.equal(events.length,eventCount);
    assert.equal(accepted.rows,latestFails?rows:canonical);
    assert.deepEqual(rows,original(),'host input was not mutated');
  }
});
test('failed optimistic actions restore confirmed rows and retry the exact attempted snapshot with a new signal',async()=>{
  const {host,rows,requests,events}=setup();
  const attempted=rows.map(row=>row.id==='a'?{...row,name:'Alpha revised'}:row);
  const first=host.request(attempted);assert.equal(host.getSnapshot().rows,attempted);assert.equal(host.getSnapshot().phase,'pending');
  requests[0].reject(new Error('Save failed'));assert.equal(await first,'error');
  assert.deepEqual(host.getSnapshot(),{rows,phase:'error',error:'Save failed'});
  const retry=host.retry();assert.equal(requests[1].rows,attempted);assert.notEqual(requests[1].signal,requests[0].signal);assert.ok(requests[1].id>requests[0].id);
  const canonical=attempted.map(row=>({...row,name:row.name+' accepted'}));requests[1].resolve(canonical);assert.equal(await retry,'saved');
  assert.equal(host.getSnapshot().rows,canonical);assert.deepEqual(events.map(event=>event.phase),['pending','error','pending','saved']);
  assert.equal(await host.retry(),'discarded');assert.equal(requests.length,2);
  const throwing=createGridHostOperation(rows,()=>{throw new Error('sync transport');});assert.equal(await throwing.request(attempted),'error');assert.equal(throwing.getSnapshot().rows,rows);
});
test('cancel, replacement and unsubscribe cleanup reject late publication and preserve a colliding-ID sibling',async()=>{
  const a=setup(),b=setup(),sibling=b.host.getSnapshot();
  const idle=a.host.getSnapshot();a.host.cancel();assert.equal(a.host.getSnapshot(),idle);assert.equal(a.events.length,0);
  const canceled=a.host.request([...a.rows].reverse());a.host.cancel();assert.equal(a.requests[0].signal.aborted,true);
  const count=a.events.length;a.requests[0].resolve([...a.rows].reverse());assert.equal(await canceled,'discarded');assert.equal(a.events.length,count);assert.equal(a.host.getSnapshot().phase,'canceled');assert.equal(a.host.getSnapshot().rows,a.rows);
  const pending=a.host.request([...a.rows].reverse()),replacement=[{id:'a',name:'Authoritative replacement'}];a.host.replace(replacement);assert.equal(a.requests[1].signal.aborted,true);
  a.requests[1].reject(new Error('late obsolete failure'));assert.equal(await pending,'discarded');assert.deepEqual(a.host.getSnapshot(),{rows:replacement,phase:'ready'});
  const unmounted=a.host.request(a.rows);a.host.cancel();a.unsubscribe();const final=a.host.getSnapshot(),afterUnsubscribe=a.events.length;
  a.requests[2].resolve(a.rows);assert.equal(await unmounted,'discarded');assert.equal(a.host.getSnapshot(),final);
  a.host.replace(replacement);assert.equal(a.events.length,afterUnsubscribe,'removed subscription was called');
  assert.equal(b.host.getSnapshot(),sibling);assert.deepEqual(b.events,[]);assert.deepEqual(b.requests,[]);
});
