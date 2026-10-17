import {test} from 'node:test';
import assert from 'node:assert/strict';
import {memoryConfigurations, assertActiveOwner, assertDisposedOwner,
  assertNoLatePublication, assertMemoryCounters, assertLatencySamples} from './performance-proof-policy.mjs';

const disposed = {children:0, scopes:0, options:0, menus:0, pendingFrames:0,
  activeTimers:0, mounted:false, updating:false, samples:4};

test('memory configuration covers both public grids and the inline selector once', () => {
  assert.equal(memoryConfigurations.length, 7);
  assert.equal(new Set(memoryConfigurations.map(row => `${row.renderer}:${row.workload}`)).size, 7);
  for (const renderer of ['processing', 'catalog']) {
    assert.deepEqual(memoryConfigurations.filter(row => row.renderer === renderer && row.workload !== 'selector')
      .map(row => row.workload), ['small', 'wide', 'largePage']);
  }
  assert.equal(memoryConfigurations.filter(row => row.workload === 'selector')[0].renderer, 'processing');
});

test('active-disposal proof rejects a completed or never-started interval', () => {
  assertActiveOwner({mounted:true, activeTimers:1, updating:true});
  assert.throws(() => assertActiveOwner({mounted:true, activeTimers:0, updating:false}));
  assert.throws(() => assertActiveOwner({mounted:false, activeTimers:1, updating:true}));
});

test('every residual resource and missing disposal field fails independently', () => {
  assertDisposedOwner(disposed);
  for (const name of ['children','scopes','options','menus','pendingFrames','activeTimers']) {
    assert.throws(() => assertDisposedOwner({...disposed, [name]:1}), new RegExp(name));
    const incomplete = {...disposed}; delete incomplete[name];
    assert.throws(() => assertDisposedOwner(incomplete), new RegExp(name));
  }
  assert.throws(() => assertDisposedOwner({...disposed, updating:true}));
});

test('a delayed update or a reappearing portal cannot pass a stable-disposal receipt', () => {
  assertNoLatePublication(disposed, {...disposed});
  assert.throws(() => assertNoLatePublication(disposed, {...disposed, samples:5}), /producing samples/);
  assert.throws(() => assertNoLatePublication(disposed, {...disposed, menus:1}), /menus/);
});

test('CDP must supply actual valid counters; missing heap metrics never produce a pass', () => {
  const counters = {documents:1,nodes:5,jsEventListeners:0,JSHeapUsedSize:100,JSHeapTotalSize:200};
  assertMemoryCounters(counters);
  for (const name of Object.keys(counters)) {
    const missing = {...counters}; delete missing[name];
    assert.throws(() => assertMemoryCounters(missing), new RegExp(name));
  }
  assert.throws(() => assertMemoryCounters({...counters, JSHeapUsedSize:201}), /Impossible/);
});

const latencySamples=[{action:'initial',ms:1,duringUpdates:false},{action:'input',ms:2,duringUpdates:true},{action:'selection',ms:3,duringUpdates:true},...Array.from({length:50},()=>({action:'update',ms:4,duringUpdates:true}))];
test('latency proof rejects missing or inflated updates and either interaction outside the burst',()=>{
  assertLatencySamples(latencySamples);
  assert.throws(()=>assertLatencySamples(latencySamples.slice(0,-1)),/missing updates/);
  assert.throws(()=>assertLatencySamples([...latencySamples,latencySamples.at(-1)]),/missing updates/);
  for(const action of ['input','selection'])assert.throws(()=>assertLatencySamples(latencySamples.map(sample=>sample.action===action?{...sample,duringUpdates:false}:sample)),/during updates/);
});
test('latency proof rejects missing initial or nonfinite frame measurements',()=>{
  assert.throws(()=>assertLatencySamples(latencySamples.filter(sample=>sample.action!=='initial')),/initial/);
  for(const ms of [NaN,Infinity,-1])assert.throws(()=>assertLatencySamples(latencySamples.map((sample,index)=>index===1?{...sample,ms}:sample)),/Invalid latency/);
});
