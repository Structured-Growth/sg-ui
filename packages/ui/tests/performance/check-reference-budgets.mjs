// Read-only regression gate. Budgets are versioned policy, never recalculated here.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {assertLatencySamples,assertActiveOwner,assertDisposedOwner,assertNoLatePublication,assertMemoryCounters} from '../consumers/performance-proof-policy.mjs';
export function checkReferenceBudgets(budget,measurements,memory){
 const findings=[],seen=new Set();
 assert.equal(budget.schemaVersion,1);assert(budget.latency&&budget.environment);
 for(const measurement of measurements){
  const env=measurement.environment;
  for(const key of ['cpu','totalMemoryBytes','browser','throttlePolicy','cpuThrottleRate'])assert.equal(env[key],budget.environment[key],`Incomparable reference environment: ${key}`);
  assert.deepEqual(measurement.viewport,budget.viewport,'Incomparable viewport');
  assert.deepEqual(measurement.fixtureHashes,budget.fixtureHashes,'Changed benchmark requires a reviewed new baseline');
  assert.equal(measurement.iterations,12,'Full 3-warmup / 9-recorded protocol required');
  for(const extension of ['js','css']){
   const observed=Object.entries(measurement.assets).filter(([name])=>name.endsWith('.'+extension)).reduce((sum,[,asset])=>{assert(Number.isInteger(asset.gzipLevel9Bytes)&&asset.gzipLevel9Bytes>0,'Missing gzip inventory');return sum+asset.gzipLevel9Bytes;},0);
   assert(observed>0,'Missing bundle inventory');
   if(observed>budget.bundleGzipBytes[extension])findings.push({configuration:'composed-fixture',metric:extension+'GzipBytes',observed,limit:budget.bundleGzipBytes[extension]});
  }
  for(const workload of measurement.selectedWorkloads){
   const prefix=measurement.renderer+':'+workload;assert(!seen.has(prefix),'Duplicate configuration');seen.add(prefix);
   const expected=budget.latency[prefix];assert(expected,'Unknown reference workload');
   const rows=measurement.results.filter(row=>row.workload===workload);
   assert.equal(rows.length,12,'Missing raw navigations');
   const raw={};
   for(let iteration=0;iteration<12;iteration++){
    const row=rows[iteration];assert.equal(row.iteration,iteration);assert.equal(row.warmup,iteration<3);
    assertLatencySamples(row.samples);
    if(!row.warmup)for(const sample of row.samples){const key=workload+':'+sample.action+(sample.duringUpdates?':updating':':idle');(raw[key]??=[]).push(sample.ms);}
   }
   const recomputed={};
   for(const [key,values] of Object.entries(raw)){values.sort((a,b)=>a-b);recomputed[key]={count:values.length,medianMs:values[Math.ceil(values.length*.5)-1],p95Ms:values[Math.ceil(values.length*.95)-1],maxMs:values.at(-1)};}
   assert.deepEqual(Object.fromEntries(Object.entries(measurement.summaries).filter(([key])=>key.startsWith(workload+':'))),recomputed,'Summary differs from raw samples');
   const actual=Object.entries(measurement.summaries).filter(([key])=>key.startsWith(workload+':'));
   // Sorting follows selection and may finish after the fixed update burst.
   // Keep either observed sort timing, without requiring an idle sort to recur.
   for(const key of Object.keys(expected).filter(key=>!key.includes(':sort:')))assert(actual.some(([name])=>name===key),'Missing required latency metric');
   assert(actual.every(([key])=>expected[key]),'Unknown latency metric');
   for(const [key,value] of actual){
    assert(Number.isInteger(value.count)&&value.count>=(key.includes(':sort:')?1:9),'Insufficient samples');
    for(const metric of ['medianMs','p95Ms']){
     assert(Number.isFinite(value[metric])&&value[metric]>=0,'Invalid timing');
     if(value[metric]>expected[key][metric])findings.push({configuration:prefix,metric:key+':'+metric,observed:value[metric],limit:expected[key][metric]});
    }
   }
  }
 }
 assert.deepEqual([...seen].sort(),Object.keys(budget.latency).sort(),'Incomplete reference matrix');
 assert.equal(memory.status,'pass','Lifecycle execution must pass');
 assert.deepEqual(memory.inputs,budget.memoryInputs,'Changed memory protocol requires a reviewed new baseline');
 for(const key of ['cpu','totalMemoryBytes','browser'])assert.equal(memory.environment[key],budget.environment[key],`Incomparable memory environment: ${key}`);
 const memorySeen=new Set();
 for(const workload of memory.workloads){
  const key=workload.renderer+':'+workload.workload;assert(!memorySeen.has(key),'Duplicate memory workload');memorySeen.add(key);
  const cycles=workload.cycles.filter(c=>!c.warmup);assert.equal(cycles.length,25,'Full memory protocol required');
  assert.equal(workload.cycles.length,30,'Missing memory warmups');
  workload.cycles.forEach((cycle,index)=>{assert.equal(cycle.cycle,index);assert.equal(cycle.warmup,index<5);});
  for(const cycle of workload.cycles){assertActiveOwner(cycle.active);assertDisposedOwner(cycle.disposed);assertNoLatePublication(cycle.disposed,cycle.later);assertMemoryCounters(cycle.afterGC);}
  const values=cycles.map(c=>c.afterGC);
  const growth=values.at(-1).JSHeapUsedSize-values[0].JSHeapUsedSize;
  const listenerGrowth=Math.max(...values.map(c=>c.jsEventListeners))-Math.min(...values.map(c=>c.jsEventListeners));
  const nodeGrowth=Math.max(...values.map(c=>c.nodes))-Math.min(...values.map(c=>c.nodes));
  for(const [metric,observed] of Object.entries({heapGrowthBytes:growth,listenerGrowth,nodeGrowth})){
   assert(Number.isFinite(observed),'Missing memory counter');
   if(observed>budget.memory[metric])findings.push({configuration:key,metric,observed,limit:budget.memory[metric]});
  }
 }
 assert.deepEqual([...memorySeen].sort(),Object.keys(budget.latency).sort(),'Incomplete memory matrix');
 return findings;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const [budgetPath,memoryPath,...measurePaths]=process.argv.slice(2);assert(budgetPath&&memoryPath&&measurePaths.length,'Pass budget, memory and complete latency packets');
 const load=async path=>JSON.parse(await readFile(path,'utf8'));
 const findings=checkReferenceBudgets(await load(budgetPath),await Promise.all(measurePaths.map(load)),await load(memoryPath));
 console.log(JSON.stringify({status:findings.length?'fail':'pass',findings},null,2));process.exitCode=findings.length?1:0;
}
