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
const destination=process.argv[2];assert.ok(destination&&isAbsolute(destination),'Pass explicit absolute NEW result path');
const here=dirname(fileURLToPath(import.meta.url));
const assets={};for(const name of (await readdir(here+'/dist/assets')).sort()){const bytes=await readFile(here+'/dist/assets/'+name);assets[name]={bytes:bytes.length,gzipLevel9Bytes:gzipSync(bytes,{level:9}).length,sha256:createHash('sha256').update(bytes).digest('hex')};}
const browser=await chromium.launch();const results=[];
try {
  const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  for(const workload of ['small','wide','largePage','selector'])for(let iteration=0;iteration<12;iteration++){
    await page.goto('http://127.0.0.1:4179/?workload='+workload);
    await page.waitForFunction(()=>window.sguiPerf?.ready);
    const input=page.getByRole('searchbox',{name:workload==='selector'?'Courses':'Search',exact:true});
    // Sequential native key events, each followed by two frames; no synthetic fill timing claim.
    for(const character of ['C','o','u','r','s','e',' ','9']){await input.press(character===' '?'Space':character);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
    await input.clear();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    if(workload==='selector') await page.getByRole('option',{name:'Course 0',exact:true}).click();
    else {await page.getByRole('checkbox',{name:'Select Course 0',exact:true}).check();await page.getByRole('button',{name:'Sort Name',exact:true}).click();}
    await page.getByRole('button',{name:'Run 50 updates'}).click();
    await page.waitForFunction(()=>window.sguiPerf.updating);
    await page.waitForFunction(()=>!window.sguiPerf.updating,{},{timeout:20000});
    await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    const samples=await page.evaluate(()=>window.sguiPerf.samples);
    assert.ok(samples.some(s=>s.action==='initial'));assert.equal(samples.filter(s=>s.action==='update').length,50,'missing updates: investigate contention; do not inflate budget');
    results.push({workload,iteration,warmup:iteration<3,samples});
    await page.evaluate(()=>window.sguiPerf.unmount());
  }
  assert.deepEqual(errors,[]);
  const summaries={};for(const row of results.filter(r=>!r.warmup))for(const sample of row.samples){const key=row.workload+':'+sample.action;(summaries[key]??=[]).push(sample.ms);}
  for(const [key,values] of Object.entries(summaries)){values.sort((a,b)=>a-b);summaries[key]={count:values.length,medianMs:values[Math.ceil(values.length*.5)-1],p95Ms:values[Math.ceil(values.length*.95)-1],maxMs:values.at(-1)};}
  await writeFile(destination,JSON.stringify({summaries,measuredAt:new Date().toISOString(),environment:{node:process.version,browser:browser.version(),os:os.type(),release:os.release(),arch:os.arch(),cpu:os.cpus()[0]?.model,totalMemoryBytes:os.totalmem(),loadAverage:os.loadavg()},assets,results,method:'Production React; 3 warmup/9 recorded navigations per workload; input/click capture or timer callback to two post-commit RAFs. Frame-opportunity estimate, not physical paint/INP/AT. All emitted assets summed separately, not route transfer.',limits:['No cross-build baseline or physical-device result without second matching run.','No heap retention/GC plateau or global listener census.','No budget auto-record/update.']},null,2)+'\n',{flag:'wx'});
} finally {await browser.close();}
