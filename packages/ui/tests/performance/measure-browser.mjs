// Coordinator-only: immutable production preview already running on 4179.
// Usage: node tests/performance/measure-browser.mjs /absolute/new-result.json
import {chromium} from '@playwright/test';
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {resolve,dirname,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import * as os from 'node:os';
import assert from 'node:assert/strict';
import {assertLatencySamples} from '../consumers/performance-proof-policy.mjs';
const destination=process.argv[2];assert.ok(destination&&isAbsolute(destination),'Pass explicit absolute NEW result path');
const here=dirname(fileURLToPath(import.meta.url));
const assets={};for(const name of (await readdir(here+'/dist/assets')).sort()){const bytes=await readFile(here+'/dist/assets/'+name);assets[name]={bytes:bytes.length,gzipLevel9Bytes:gzipSync(bytes,{level:9}).length,sha256:createHash('sha256').update(bytes).digest('hex')};}
const renderer=process.argv[3]??'processing';assert.ok(['processing','catalog'].includes(renderer));
const availableWorkloads=renderer==='catalog'?['small','wide','largePage']:['small','wide','largePage','selector'];
const only=process.argv[4];assert.ok(only===undefined||availableWorkloads.includes(only),'Optional workload must be an existing renderer workload');
const workloads=only?[only]:availableWorkloads;
const iterations=process.argv[5]===undefined?12:Number(process.argv[5]);assert.ok([1,12].includes(iterations),'Use one diagnostic navigation or the existing twelve-navigation protocol');
const sourceHead=process.env.SGUI_PERF_SOURCE_HEAD;assert.match(sourceHead??'',/^[a-f0-9]{40}$/,'Set SGUI_PERF_SOURCE_HEAD to the immutable measured source commit');
const fixtureHashes={};for(const name of ['fixture.tsx','measure-browser.mjs','vite.config.mjs','index.html'])fixtureHashes[name]=createHash('sha256').update(await readFile(here+'/'+name)).digest('hex');
const browser=await chromium.launch();const results=[],cleanupProbes=[];let currentAttempt,activePage;
try {
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const page=activePage=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  for(const workload of workloads)for(let iteration=0;iteration<iterations;iteration++){
    currentAttempt={workload,iteration,actions:[]};
    await page.goto('http://127.0.0.1:4179/?renderer='+renderer+'&workload='+workload);
    await page.waitForFunction(()=>window.sguiPerf?.ready);
    const input=page.getByRole('searchbox',{name:workload==='selector'?'Courses':'Search',exact:true});
    const inputHandle=await input.elementHandle();assert.ok(inputHandle,'Missing native search input');
    await page.getByRole('button',{name:'Run 50 updates'}).click();
    await page.waitForFunction(()=>window.sguiPerf.updating);
    // Resolve the native input once before the burst. Repeated role-locator
    // work is driver overhead, not input-to-frame latency in the page sampler.
    await inputHandle.focus();
    const action=async(name,run)=>{const start=performance.now();await run();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));const state=await page.evaluate(()=>({updating:window.sguiPerf.updating,updateCount:window.sguiPerf.samples.filter(s=>s.action==='update').length,samples:window.sguiPerf.samples.filter(s=>s.action==='input')}));currentAttempt.actions.push({name,driverWallMs:performance.now()-start,...state});};
    for(const character of ['C','o','u','r','s','e',' ','9'])await action(character,()=>page.keyboard.press(character===' '?'Space':character));
    await action('clear',async()=>{await page.keyboard.press('ControlOrMeta+A');await page.keyboard.press('Backspace');});
    assert.equal(await inputHandle.inputValue(),'','Native keyboard clear must commit');
    assert.ok(await page.evaluate(()=>window.sguiPerf.updating),'Updates ended before interactive sequence; preserve failure and investigate contention');
    if(workload==='selector') {
      // After native clear the first result is Course 0. Avoid recomputing 2,000
      // accessible names during the fixed update burst, as with the search input.
      const option=page.locator('[role="option"]').first();
      assert.equal((await option.textContent()).replace(/^[○✓]\s*/,''),'Course 0');
      await option.click();
      assert.equal(await option.getAttribute('aria-selected'),'true','selection must actually commit');
    }
    else {
      const checkbox=page.getByRole('checkbox',{name:'Select Course 0',exact:true});
      await checkbox.locator('xpath=ancestor::label[1]').click();
      assert.ok(await checkbox.isChecked(),'selection must actually commit');
      await page.getByRole('button',{name:'Sort Name',exact:true}).click();
      if(renderer==='catalog')await page.getByRole('menuitemradio',{name:'Sort Ascending',exact:true}).click();
    }
    await page.waitForFunction(()=>!window.sguiPerf.updating,{},{timeout:20000});
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const samples=await page.evaluate(()=>window.sguiPerf.samples);
    assertLatencySamples(samples);
    results.push({workload,iteration,warmup:iteration<3,samples,driverActions:currentAttempt.actions});currentAttempt=undefined;
    console.log(JSON.stringify({renderer,workload,iteration}));
    await page.evaluate(()=>window.sguiPerf.unmount());
    const cleanup=await page.evaluate(()=>({...window.sguiPerf.lifecycle,updating:window.sguiPerf.updating,sampleCount:window.sguiPerf.samples.length}));
    assert.deepEqual({mounted:cleanup.mounted,pendingFrames:cleanup.pendingFrames,activeTimers:cleanup.activeTimers,updating:cleanup.updating},{mounted:false,pendingFrames:0,activeTimers:0,updating:false});
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    assert.equal(await page.evaluate(()=>window.sguiPerf.samples.length),cleanup.sampleCount,'Samples changed after unmount');
    results.at(-1).cleanup=cleanup;
  }
  for(const workload of workloads) {
    await page.goto('http://127.0.0.1:4179/?renderer='+renderer+'&workload='+workload);
    await page.waitForFunction(()=>window.sguiPerf?.ready);
    await page.getByRole('button',{name:'Run 50 updates'}).click();
    await page.waitForFunction(()=>window.sguiPerf.samples.some(sample=>sample.action==='update'));
    const before=await page.evaluate(()=>({...window.sguiPerf.lifecycle,updating:window.sguiPerf.updating}));
    assert.equal(before.activeTimers,1);assert.equal(before.updating,true);
    const after=await page.evaluate(()=>{window.sguiPerf.unmount();return {...window.sguiPerf.lifecycle,updating:window.sguiPerf.updating,sampleCount:window.sguiPerf.samples.length};});
    assert.deepEqual({mounted:after.mounted,pendingFrames:after.pendingFrames,activeTimers:after.activeTimers,updating:after.updating},{mounted:false,pendingFrames:0,activeTimers:0,updating:false});
    await page.waitForTimeout(150); // Longer than one scheduled100ms tick: detect late publication.
    const later=await page.evaluate(()=>window.sguiPerf.samples.length);assert.equal(later,after.sampleCount);
    cleanupProbes.push({workload,before,after,laterSampleCount:later});
  }
  assert.deepEqual(errors,[]);
  const summaries={};for(const row of results.filter(r=>!r.warmup))for(const sample of row.samples){const key=row.workload+':'+sample.action+(sample.duringUpdates?':updating':':idle');(summaries[key]??=[]).push(sample.ms);}
  for(const [key,values] of Object.entries(summaries)){values.sort((a,b)=>a-b);summaries[key]={count:values.length,medianMs:values[Math.ceil(values.length*.5)-1],p95Ms:values[Math.ceil(values.length*.95)-1],maxMs:values.at(-1)};}
  await writeFile(destination,JSON.stringify({schemaVersion:2,renderer,sourceHead,selectedWorkloads:workloads,iterations,fixtureHashes,cleanupProbes,viewport:{width:1440,height:900},summaries,measuredAt:new Date().toISOString(),environment:{react:JSON.parse(await readFile(resolve(here,'../../node_modules/react/package.json'),'utf8')).version,throttlePolicy:'none',node:process.version,browser:browser.version(),os:os.type(),release:os.release(),arch:os.arch(),cpu:os.cpus()[0]?.model,totalMemoryBytes:os.totalmem(),loadAverage:os.loadavg()},assets,results,method:'Production React; 3 warmup/9 recorded navigations per workload; overlapping native input/selection during 50 updates; input/grid-click capture, selector public selection callback or timer callback to two post-commit RAFs. Frame-opportunity estimate, not physical paint/INP/AT. All emitted assets summed separately, not route transfer.',limits:['No cross-build baseline or physical-device result without second matching run.','No heap retention/GC plateau or global listener census.','No budget auto-record/update.']},null,2)+'\n',{flag:'wx'});
} catch(error) {
  if(currentAttempt&&activePage)currentAttempt.browserState=await activePage.evaluate(()=>({updating:window.sguiPerf?.updating,samples:window.sguiPerf?.samples,activeElement:{tag:document.activeElement?.tagName,name:document.activeElement?.getAttribute('aria-label'),value:document.activeElement?.value}})).catch(failure=>({error:String(failure)}));
  await writeFile(destination+'.failed.json',JSON.stringify({renderer,sourceHead,fixtureHashes,assets,results,cleanupProbes,currentAttempt,error:String(error.stack??error)},null,2)+'\n',{flag:'wx'});throw error;
} finally {await browser.close();}
