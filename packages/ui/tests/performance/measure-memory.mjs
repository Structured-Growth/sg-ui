// Coordinator only: separately instrumented Chromium run, never a latency budget.
// node tests/performance/measure-memory.mjs /absolute/NEW-directory [--snapshots]
import assert from 'node:assert/strict';
import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {appendFileSync} from 'node:fs';
import {dirname, isAbsolute, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import * as os from 'node:os';
import {chromium} from '@playwright/test';
import {memoryConfigurations, assertActiveOwner, assertDisposedOwner,
  assertNoLatePublication, assertMemoryCounters} from '../consumers/performance-proof-policy.mjs';
const output=process.argv[2];
assert(output&&isAbsolute(output),'Pass an absolute NEW evidence directory');
assert(process.argv.slice(3).every(arg=>arg==='--snapshots'),'Unknown option');
await mkdir(output); // Refuse overwrite; retain failures.
const here=dirname(fileURLToPath(import.meta.url));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function inventory(directory){
  const result={};
  for(const item of await readdir(directory,{withFileTypes:true})){
    if(item.isDirectory()) for(const [name,value] of Object.entries(await inventory(join(directory,item.name)))) result[item.name+'/'+name]=value;
    else if(item.isFile())result[item.name]=hash(await readFile(join(directory,item.name)));
  }
  return result;
}
const receipt={startedAt:new Date().toISOString(),status:'running',environment:{node:process.version,os:os.type(),release:os.release(),arch:os.arch(),cpu:os.cpus()[0]?.model,totalMemoryBytes:os.totalmem(),loadAverage:os.loadavg()},
  method:'Chromium CDP explicit GC after same-document disposal; 5 warmup +25 recorded cycles/workload; counters are whole-page observations, not attributed SGUI leaks or process RSS.',
  limits:['No memory threshold/plateau approval inferred. Compare raw trends and inspect snapshot retaining paths.', 'GC/instrumentation changes execution; do not compare these samples with latency runs.', 'Both grids, inline selector, Provider and catalog sort-menu portal only. Upload URL and editor observer cleanup retain separate existing test evidence.', 'Chromium-only instrumentation does not certify Firefox/WebKit or physical hardware.'],workloads:[],snapshots:[]};
const save=()=>writeFile(join(output,'memory.json'),JSON.stringify(receipt,null,2)+'\n');
let browser;
try {
  receipt.assets=await inventory(join(here,'dist'));
  receipt.inputs={};
  for(const name of ['fixture.tsx','vite.config.mjs','measure-memory.mjs'])receipt.inputs[name]=hash(await readFile(join(here,name)));
  receipt.inputs['../consumers/performance-proof-policy.mjs']=hash(await readFile(join(here,'../consumers/performance-proof-policy.mjs')));
  receipt.libraryOutput=await inventory(join(here,'../../dist'));
  browser=await chromium.launch();receipt.environment.browser=browser.version();
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(15000);
  const diagnostics=[];
  page.on('pageerror',error=>diagnostics.push(String(error)));
  page.on('console',message=>{if(['warning','error'].includes(message.type()))diagnostics.push(message.text());});
  // Verify the already-running preview serves exactly the local immutable build.
  for(const [name,sha] of Object.entries(receipt.assets)){
    const response=await page.request.get('http://127.0.0.1:4179/'+name);
    assert(response.ok(),'Missing served asset '+name);
    assert.equal(hash(await response.body()),sha,'Preview differs from frozen build: '+name);
  }
  const cdp=await context.newCDPSession(page);
  await cdp.send('Performance.enable');
  const frames=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const counters=async()=>{
    await frames();await cdp.send('HeapProfiler.collectGarbage');
    const dom=await cdp.send('Memory.getDOMCounters');
    const {metrics}=await cdp.send('Performance.getMetrics');
    const observed={...dom,...Object.fromEntries(metrics.filter(x=>['JSHeapUsedSize','JSHeapTotalSize'].includes(x.name)).map(x=>[x.name,x.value]))};
    assertMemoryCounters(observed);return observed;
  };
  async function snapshot(name){
    if(!process.argv.includes('--snapshots'))return;
    const path=join(output,name+'.heapsnapshot');await writeFile(path,'',{flag:'wx'});
    let bytes=0,exceeded=false;
    const listener=({chunk})=>{bytes+=Buffer.byteLength(chunk);if(bytes>256*1024*1024){exceeded=true;return;}appendFileSync(path,chunk);};
    cdp.on('HeapProfiler.addHeapSnapshotChunk',listener);
    let timer;
    try{
      await Promise.race([cdp.send('HeapProfiler.takeHeapSnapshot',{reportProgress:false}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Heap snapshot exceeded 60s')),60000);})]);
      assert(!exceeded,'Heap snapshot exceeded 256MiB; retained partial file is invalid');
      receipt.snapshots.push({name,bytes,sha256:hash(await readFile(path))});
    }finally{clearTimeout(timer);cdp.off('HeapProfiler.addHeapSnapshotChunk',listener);}
  }
  const disposal=()=>page.evaluate(()=>({children:document.getElementById('root').childElementCount,scopes:document.querySelectorAll('[data-sgui-scope]').length,options:document.querySelectorAll('[role=option]').length,menus:document.querySelectorAll('[role=menu]').length,...window.sguiPerf.lifecycle,updating:window.sguiPerf.updating,samples:window.sguiPerf.samples.length}));
  for(const {renderer,workload} of memoryConfigurations){
    const name=renderer+'-'+workload;
    await page.goto('http://127.0.0.1:4179/?renderer='+renderer+'&workload='+workload);
    await page.waitForFunction(()=>window.sguiPerf?.ready);
    await page.evaluate(()=>window.sguiPerf.unmount());
    const record={renderer,workload,portalCovered:renderer==='catalog',coldDisposed:await counters(),cycles:[]};receipt.workloads.push(record);await save();
    for(let cycle=0;cycle<30;cycle++){
      await page.evaluate(()=>window.sguiPerf.mount());await page.waitForFunction(()=>window.sguiPerf.ready);
      if(workload==='selector'){
        const input=page.getByRole('searchbox',{name:'Courses',exact:true});
        await input.click();await input.pressSequentially('Course 9');await input.clear();
        await page.getByRole('option',{name:'Course 0',exact:true}).click();
        // AsyncMultiSelect owns an inline ListBox, not an overlay portal.
        await page.getByRole('option',{name:'Course 1',exact:true}).waitFor({state:'visible'});
      }else{
        const checkbox=page.getByRole('checkbox',{name:'Select Course 0',exact:true});
        await checkbox.locator('xpath=ancestor::label[1]').click();
        assert.equal(await checkbox.isChecked(),true,'Native label activation must commit selection');
        await page.getByRole('button',{name:'Sort Name',exact:true}).click();
        if(renderer==='catalog')await page.getByRole('menuitemradio',{name:'Sort Ascending',exact:true}).click();
      }
      await page.getByRole('button',{name:'Run 50 updates',exact:true}).click();
      await page.waitForFunction(()=>window.sguiPerf.samples.filter(x=>x.action==='update').length>=3);
      if(renderer==='catalog'){
        await page.getByRole('button',{name:'Sort Name',exact:true}).click();
        await page.getByRole('menuitemradio',{name:'Sort Descending',exact:true}).waitFor({state:'visible'});
      }
      const active=await page.evaluate(()=>({...window.sguiPerf.lifecycle,updating:window.sguiPerf.updating}));
      assertActiveOwner(active);
      await page.evaluate(()=>{window.sguiPerf.unmount();window.sguiPerf.unmount();});
      await page.waitForTimeout(250); // Intentional observation window for an incorrectly retained 100ms interval.
      const disposed=await disposal();assertDisposedOwner(disposed);
      await page.waitForTimeout(250);
      const later=await disposal();assertNoLatePublication(disposed,later);
      record.cycles.push({cycle,warmup:cycle<5,active,disposed,later,afterGC:await counters()});
      if(cycle===4)await snapshot(name+'-warm');
      if(cycle===29)await snapshot(name+'-final');
      assert.deepEqual(diagnostics,[],'Browser diagnostics');await save();
    }
  }
  assert.deepEqual(await inventory(join(here,'dist')),receipt.assets,'Profiling assets changed');
  assert.deepEqual(await inventory(join(here,'../../dist')),receipt.libraryOutput,'Library output changed');
  receipt.status='pass';
}catch(error){receipt.status='fail';receipt.failure=String(error.stack??error);process.exitCode=1;}
finally{
  try{await browser?.close();}
  catch(error){receipt.status='fail';receipt.closeFailure=String(error);process.exitCode=1;}
  finally{receipt.finishedAt=new Date().toISOString();await save();}
}
