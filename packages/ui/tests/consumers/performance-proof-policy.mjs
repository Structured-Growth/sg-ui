import assert from 'node:assert/strict';

// A selector uses its own inline ListBox. Only catalog sort-menu cases below
// establish portal disposal; keep that distinction in saved receipts.
export const memoryConfigurations = [
  ...['processing', 'catalog'].flatMap(renderer =>
    ['small', 'wide', 'largePage'].map(workload => ({renderer, workload}))),
  {renderer: 'processing', workload: 'selector'},
];

export function assertActiveOwner(owner) {
  assert.equal(owner.mounted, true, 'Owner must be mounted before disposal');
  assert.equal(owner.activeTimers, 1, 'Dispose while the host update interval is active');
  assert.equal(owner.updating, true, 'Update workload finished before disposal');
}

export function assertDisposedOwner(disposed) {
  for (const name of ['children', 'scopes', 'options', 'menus', 'pendingFrames', 'activeTimers']) {
    assert.equal(disposed[name], 0, `Disposed owner retains ${name}`);
  }
  assert.equal(disposed.mounted, false, 'Disposed fixture remains mounted');
  assert.equal(disposed.updating, false, 'Disposed fixture remains updating');
  assert(Number.isInteger(disposed.samples) && disposed.samples >= 0, 'Missing disposed sample count');
}

export function assertNoLatePublication(before, after) {
  assertDisposedOwner(before);
  assertDisposedOwner(after);
  assert.equal(after.samples, before.samples, 'Disposed fixture kept producing samples');
}

export function assertMemoryCounters(counters) {
  for (const name of ['documents', 'nodes', 'jsEventListeners']) {
    assert(Number.isInteger(counters[name]) && counters[name] >= 0, `Missing/invalid CDP ${name}`);
  }
  for (const name of ['JSHeapUsedSize', 'JSHeapTotalSize']) {
    assert(Number.isFinite(counters[name]) && counters[name] > 0, `Missing/invalid CDP ${name}`);
  }
  assert(counters.JSHeapUsedSize <= counters.JSHeapTotalSize, 'Impossible heap counters');
}

// Preserve the fixed latency workload; late/idle selection cannot satisfy overlap.
export function assertLatencySamples(samples) {
  assert.ok(samples.some(sample=>sample.action==='initial'),'Missing initial sample');
  assert.ok(samples.some(sample=>sample.action==='input'&&sample.duringUpdates),'No input sampled during updates');
  assert.ok(samples.some(sample=>sample.action==='selection'&&sample.duringUpdates),'No selection sampled during updates');
  assert.equal(samples.filter(sample=>sample.action==='update').length,50,'missing updates: investigate contention; do not inflate budget');
  for(const sample of samples)assert.ok(Number.isFinite(sample.ms)&&sample.ms>=0,'Invalid latency sample');
}
