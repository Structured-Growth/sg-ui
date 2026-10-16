import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../../../../packages/ui/package.json', import.meta.url));
const ts = require('typescript');
const source = new URL('./proposed-files/apps/docs/native-fixtures/scenarios/components/AppDataGridShell/gridHostOperation.ts', import.meta.url);
const { outputText } = ts.transpileModule(readFileSync(source, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
const { createGridHostOperation } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; };
function setup() {
  const requests = [];
  const host = createGridHostOperation(['A','B'], (rows, operation) => { const pending = deferred(); requests.push({ rows, operation, ...pending }); return pending.promise; });
  const trace = [];
  host.subscribe(() => trace.push(host.getSnapshot()));
  return { host, requests, trace };
}
{
  const { host, requests, trace } = setup();
  const first = host.request(['B','A']);
  const second = host.request(['B','A revised']);
  assert.equal(requests[0].operation.signal.aborted, true);
  requests[1].resolve(['B','A accepted']); assert.equal(await second, 'saved');
  requests[0].reject(new Error('obsolete failure')); assert.equal(await first, 'discarded');
  assert.deepEqual(host.getSnapshot(), { rows: ['B','A accepted'], phase: 'saved' });
  const failed = host.request(['A accepted','B']);
  requests[2].reject(new Error('Persistence unavailable')); assert.equal(await failed, 'error');
  assert.deepEqual(host.getSnapshot(), { rows: ['B','A accepted'], phase: 'error', error: 'Persistence unavailable' });
  const retry = host.retry(); assert.deepEqual(requests[3].rows, ['A accepted','B']);
  requests[3].resolve(['A accepted','B']); assert.equal(await retry, 'saved');
  const isolated = setup();
  const obsolete = isolated.host.request(['B','A']);
  const latest = isolated.host.request(['B revised','A']);
  isolated.requests[1].reject(new Error('latest failed')); await latest;
  const rollback = isolated.host.getSnapshot();
  isolated.requests[0].resolve(['B','A']); assert.equal(await obsolete, 'discarded');
  assert.equal(isolated.host.getSnapshot(), rollback);
  console.log('PASS latest success, stale failure discarded, confirmed rollback, explicit retry', JSON.stringify(trace));
}
{
  const { host, requests, trace } = setup();
  const canceled = host.request(['B','A']); host.cancel();
  requests[0].resolve(['B','A']); assert.equal(await canceled, 'discarded');
  assert.deepEqual(host.getSnapshot(), { rows: ['A','B'], phase: 'canceled' });
  const replaced = host.request(['B','A']); host.replace(['Fresh']);
  requests[1].reject(new Error('late')); assert.equal(await replaced, 'discarded');
  assert.deepEqual(host.getSnapshot(), { rows: ['Fresh'], phase: 'ready' });
  // Component cleanup cancels before the listener is removed; transport remains settleable.
  const unmounted = host.request(['New']); host.cancel();
  const before = trace.length; requests[2].resolve(['New']); await unmounted;
  assert.equal(trace.length, before); assert.equal(trace.some(item => item.phase === 'saved'), false);
  console.log('PASS cancel, replacement, unmount cleanup never announce saved', JSON.stringify(trace));
}
{
  const a = setup(), b = setup(); const original = b.host.getSnapshot();
  b.host.cancel(); assert.equal(b.host.getSnapshot(), original); // Strict Mode idle cleanup is silent.
  const failed = a.host.request(['A revised','B']); a.requests[0].reject(new Error('denied')); await failed;
  assert.equal(b.host.getSnapshot(), original); assert.equal(b.trace.length, 0);
  const host = createGridHostOperation(['A'], () => { throw new Error('sync transport failure'); });
  assert.equal(await host.request(['B']), 'error'); assert.deepEqual(host.getSnapshot().rows, ['A']);
  console.log('PASS independent hosts with colliding row IDs and synchronous transport error');
}
console.log(`Runtime ${process.version}; 3 pure host-controller cases; no DOM/native/AT execution`);
