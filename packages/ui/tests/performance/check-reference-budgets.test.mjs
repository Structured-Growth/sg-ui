import test from 'node:test';
import assert from 'node:assert/strict';
import {checkReferenceBudgets} from './check-reference-budgets.mjs';
function fixture(){
 const fixtureHashes={'fixture.tsx':'a'.repeat(64)},memoryInputs={'fixture.tsx':'a'.repeat(64),'measure-memory.mjs':'b'.repeat(64)};
 const environment={cpu:'fixture',totalMemoryBytes:16,browser:'153',throttlePolicy:'cdp-cpu-4x',cpuThrottleRate:4},viewport={width:1440,height:900};
 const results=Array.from({length:12},(_,iteration)=>({workload:'small',iteration,warmup:iteration<3,samples:[{action:'initial',duringUpdates:false,ms:50},{action:'input',duringUpdates:true,ms:50},{action:'selection',duringUpdates:true,ms:50},...Array.from({length:50},()=>({action:'update',duringUpdates:true,ms:50}))]}));
 const summaries=Object.fromEntries(['initial:idle','input:updating','selection:updating','update:updating'].map(key=>['small:'+key,{count:key.startsWith('update')?450:9,medianMs:50,p95Ms:50,maxMs:50}]));
 const limits=Object.fromEntries(Object.keys(summaries).map(key=>[key,{medianMs:100,p95Ms:200}]));
 const disposed={children:0,scopes:0,options:0,menus:0,pendingFrames:0,activeTimers:0,mounted:false,updating:false,samples:3};
 return {budget:{schemaVersion:1,environment,viewport,fixtureHashes,memoryInputs,latency:{'processing:small':limits},bundleGzipBytes:{js:200,css:200},memory:{heapGrowthBytes:1024,listenerGrowth:0,nodeGrowth:4}},measurements:[{environment,viewport,fixtureHashes,iterations:12,renderer:'processing',selectedWorkloads:['small'],summaries,results,assets:{'main.js':{gzipLevel9Bytes:100},'main.css':{gzipLevel9Bytes:100}}}],memory:{status:'pass',environment,inputs:memoryInputs,workloads:[{renderer:'processing',workload:'small',cycles:Array.from({length:30},(_,i)=>({cycle:i,warmup:i<5,active:{mounted:true,activeTimers:1,updating:true},disposed,later:disposed,afterGC:{JSHeapUsedSize:5000+i*10,JSHeapTotalSize:10000,documents:1,jsEventListeners:20,nodes:30}}))}]}};
}
test('passes complete comparable packets',()=>{const x=fixture();assert.deepEqual(checkReferenceBudgets(x.budget,x.measurements,x.memory),[]);});
test('reports timing and retained resource regressions without changing budgets',()=>{const x=fixture();x.budget.latency['processing:small']['small:input:updating'].p95Ms=49;x.memory.workloads[0].cycles.at(-1).afterGC.jsEventListeners=21;assert.equal(checkReferenceBudgets(x.budget,x.measurements,x.memory).length,2);assert.equal(x.budget.latency['processing:small']['small:input:updating'].p95Ms,49);});
test('rejects incomparable environments and incomplete matrices',()=>{const x=fixture();x.measurements[0].environment={...x.budget.environment,cpuThrottleRate:1};assert.throws(()=>checkReferenceBudgets(x.budget,x.measurements,x.memory),/Incomparable/);const y=fixture();assert.throws(()=>checkReferenceBudgets(y.budget,[],y.memory),/Incomplete/);y.memory.workloads[0].cycles.pop();assert.throws(()=>checkReferenceBudgets(y.budget,y.measurements,y.memory),/Full memory/);});

test('rejects fabricated summaries and late lifecycle publication',()=>{const x=fixture();x.measurements[0].summaries['small:input:updating'].p95Ms=1;assert.throws(()=>checkReferenceBudgets(x.budget,x.measurements,x.memory),/Summary differs/);const y=fixture();y.memory.workloads[0].cycles[5].later={...y.memory.workloads[0].cycles[5].later,samples:4};assert.throws(()=>checkReferenceBudgets(y.budget,y.measurements,y.memory),/kept producing/);});

test('rejects changed benchmark inputs',()=>{const x=fixture();x.measurements[0].fixtureHashes={'fixture.tsx':'c'.repeat(64)};assert.throws(()=>checkReferenceBudgets(x.budget,x.measurements,x.memory),/Changed benchmark/);});


test('accepts sparse incidental click buckets while preserving required overlap evidence',()=>{
 const x=fixture(),packet=x.measurements[0],key='small:click:updating';
 x.budget.latency['processing:small'][key]={medianMs:100,p95Ms:200};
 for(const row of packet.results.filter(row=>!row.warmup).slice(0,2))row.samples.push({action:'click',duringUpdates:true,ms:50});
 packet.summaries[key]={count:2,medianMs:50,p95Ms:50,maxMs:50};
 assert.deepEqual(checkReferenceBudgets(x.budget,x.measurements,x.memory),[]);
 for(const row of packet.results)row.samples=row.samples.filter(sample=>sample.action!=='click');
 delete packet.summaries[key];
 assert.deepEqual(checkReferenceBudgets(x.budget,x.measurements,x.memory),[]);
 packet.results[3].samples=packet.results[3].samples.filter(sample=>sample.action!=='selection');
 assert.throws(()=>checkReferenceBudgets(x.budget,x.measurements,x.memory));
});
