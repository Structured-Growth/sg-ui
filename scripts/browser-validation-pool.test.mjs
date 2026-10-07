import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm, chmod, symlink, readdir, lstat, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { acquireLease, releaseLease, acquireSlot, assertQueueDrained, assertPortFree, ownedPath, digestTree, LEGACY_LOCK, runPool, runOwnedCommand, createStage, validateSelection, prepareSnapshot, runFrozenSnapshot, sampleResources, assertBudget, validateBudget, acquirePortLease, sourceDigest, assertSource, MAX_SESSIONS, createAdmission } from './browser-validation-pool.mjs';
import { browserSettings, startServer } from './serve-browser-storybook.mjs';
const moduleURL = new URL('./browser-validation-pool.mjs', import.meta.url).href;
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'sgui-pool-test-'));
  t.after(async () => { await thaw(root); await rm(root, { recursive: true, force: true }); });
  return root;
}
function claimProcess(root, owner) {
  const script = `import {acquireSlot} from ${JSON.stringify(moduleURL)}; try { const lease=await acquireSlot(process.argv[1],process.argv[2]); console.log(JSON.stringify(lease)); } catch(error) { console.error(error.message); process.exitCode=2; }`;
  return new Promise((done, reject) => {
    const child = spawn(process.execPath, ['--input-type=module', '-e', script, root, owner]);
    let output = '';
    child.stdout.on('data', data => { output += data; });
    child.once('error', reject); child.once('close', code => done({ code, output }));
  });
}
test('independent processes atomically admit exactly two sessions', async t => {
  const root = await fixture(t);
  const results = await Promise.all(Array.from({ length: 8 }, (_, i) => claimProcess(root, `owner-${i}`)));
  const admitted = results.filter(result => result.code === 0).map(result => JSON.parse(result.output));
  assert.equal(admitted.length, 2);
  assert.equal(new Set(admitted.map(lease => lease.slot)).size, 2);
  assert.equal(results.filter(result => result.code === 2).length, 6);
  for (const lease of admitted) await releaseLease(lease);
  const lease = await acquireSlot(root, 'next'); await releaseLease(lease);
});
test('cleanup refuses a replaced owner and leaves the lease intact', async t => {
  const root = await fixture(t);
  const lease = await acquireLease(join(root, 'lease'), 'original');
  await writeFile(join(lease.path, 'owner'), 'replacement');
  await assert.rejects(releaseLease(lease), /Owner mismatch/);
  assert.equal(await readFile(join(lease.path, 'owner'), 'utf8'), 'replacement');
  await releaseLease({ ...lease, owner: 'replacement' });
});
test('failure cleanup releases only own slots; stale claims stay occupied', async t => {
  const root = await fixture(t);
  const other = await acquireSlot(root, 'other');
  await assert.rejects((async () => {
    const own = await acquireSlot(root, 'own');
    try { throw new Error('validation failure'); } finally { await releaseLease(own); }
  })(), /validation failure/);
  assert.equal(await readFile(join(other.path, 'owner'), 'utf8'), 'other');
  const next = await acquireSlot(root, 'next'); assert.equal(next.slot, 1);
  await releaseLease(next); await releaseLease(other);
  await mkdir(join(root, 'slot-0'));
  const stale = await acquireSlot(root, 'fresh'); assert.equal(stale.slot, 1);
  await releaseLease(stale);
  await assert.rejects(acquireSlot(root, 'fresh', 1), /occupied/);
  await assert.rejects(acquireSlot(root, 'bad', MAX_SESSIONS + 1), /port namespace/);
});
test('separate heavyweight lock excludes builds independently of session slots', async t => {
  const root = await fixture(t);
  const slot = await acquireSlot(root, 'session');
  const build = await acquireLease(join(root, 'heavy'), 'builder');
  await assert.rejects(acquireLease(build.path, 'other'), { code: 'EEXIST' });
  await releaseLease(build);
  assert.equal(await readFile(join(slot.path, 'owner'), 'utf8'), 'session');
  await releaseLease(slot);
});
test('legacy queue must be readable, recognized and empty', async t => {
  const root = await fixture(t); const path = join(root, 'queue');
  await assert.rejects(assertQueueDrained(path), { code: 'ENOENT' });
  for (const contents of ['["worker"]', '{"queue":["worker"]}', '{}', 'bad']) {
    await writeFile(path, contents); await assert.rejects(assertQueueDrained(path));
  }
  for (const contents of ['', '[]', '{"queue":[],"reason":"drained"}']) {
    await writeFile(path, contents); await assertQueueDrained(path);
  }
  await assert.rejects(runPool([], {}), /nonempty/);
  await assert.rejects(runPool([{}], { queueFile: path }), /substitute queues/);
});
test('output paths cannot escape or share another worktree', () => {
  assert.equal(ownedPath('/worktree/a', 'artifacts/run'), '/worktree/a/artifacts/run');
  for (const path of ['..', '../b/artifacts', '/worktree/b/artifacts', '/worktree/a']) assert.throws(() => ownedPath('/worktree/a', path));
});
test('defaults and configurable loopback URL stay aligned', () => {
  assert.equal(browserSettings({}).port, 6173);
  assert.equal(browserSettings({}).baseURL, 'http://127.0.0.1:6173');
  assert.equal(browserSettings({ SGUI_BROWSER_PORT: '6274', SGUI_BROWSER_STORYBOOK_DIR: '/owned/build' }).root, '/owned/build');
  for (const env of [{ SGUI_BROWSER_PORT: 'NaN' }, { SGUI_BROWSER_BASE_URL: 'http://127.0.0.1:6274' }, { SGUI_BROWSER_BASE_URL: 'https://example.com' }]) assert.throws(() => browserSettings(env));
});
test('occupied ports fail without reusing or stopping the existing owner', async t => {
  const server = createServer(); await new Promise(done => server.listen(0, '127.0.0.1', done));
  t.after(() => new Promise(done => server.close(done)));
  const port = server.address().port;
  await assert.rejects(assertPortFree(port), { code: 'EADDRINUSE' });
  assert.equal(server.listening, true);
});
test('static digest detects byte changes, rejects symlinks and freezes the build', async t => {
  const root = await fixture(t); const file = join(root, 'iframe.html');
  await writeFile(file, 'first'); const before = await digestTree(root);
  await writeFile(file, 'second'); assert.notEqual(await digestTree(root), before);
  await symlink(file, join(root, 'link')); await assert.rejects(digestTree(root), /Symlink/);
  await rm(join(root, 'link')); await digestTree(root, true);
  await assert.rejects(writeFile(file, 'third'), { code: 'EACCES' });
});
// Explicitly gated: no static Storybook-like servers while the legacy queue/lock is occupied.
test('two configurable static servers preserve independent immutable bytes', { skip: process.env.SGUI_POOL_SERVER_TESTS !== '1' }, async t => {
  await assertQueueDrained('/tmp/sgui-browser-validation-priority.json', process.env.SGUI_POOL_OWNER);
  const bridge = await acquireLease(LEGACY_LOCK, `pool-server-test:${process.pid}`);
  const servers = [];
  t.after(async () => {
    try { for (const server of servers) await new Promise(done => server.close(done)); }
    finally { await releaseLease(bridge); }
  });
  const root = await fixture(t);
  for (let i = 0; i < 2; i++) {
    const dir = join(root, String(i)); await mkdir(dir); await writeFile(join(dir, 'iframe.html'), `server-${i}`);
    const port = 6473 + i;
    const server = await startServer({ SGUI_BROWSER_PORT: String(port), SGUI_BROWSER_STORYBOOK_DIR: dir, SGUI_BROWSER_IMMUTABLE: '1' }); servers.push(server);
    await writeFile(join(dir, 'iframe.html'), 'changed');
    assert.equal(await (await fetch(`http://127.0.0.1:${port}/iframe.html`)).text(), `server-${i}`);
    await assert.rejects(startServer({ SGUI_BROWSER_PORT: String(port), SGUI_BROWSER_STORYBOOK_DIR: dir }), { code: 'EADDRINUSE' });
  }
});

test('owned command logs failures and abort kills only its process group', async t => {
  const root = await fixture(t);
  const log = join(root, 'command.log');
  await assert.rejects(runOwnedCommand({ executable: process.execPath, args: ['-e', 'console.error("bounded failure"); process.exitCode=7'], log }), /failed \(7/);
  assert.match(await readFile(log, 'utf8'), /bounded failure/);
  const other = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)']);
  const otherClosed = new Promise(done => other.once('close', done));
  t.after(async () => { other.kill(); await otherClosed; });
  const controller = new AbortController();
  const command = runOwnedCommand({ executable: process.execPath, args: ['-e', 'process.on("SIGTERM",()=>{}); console.log("ready"); setInterval(()=>{},1000)'], log, signal: controller.signal, terminateDelay: 100 });
  // Wait on this own child's ready log via a bounded abort; no shared process discovery.
  const timer = setTimeout(() => controller.abort(), 600);
  try { await assert.rejects(command, /failed/); } finally { clearTimeout(timer); }
  assert.match(await readFile(log, 'utf8'), /ready/);
  assert.equal(other.exitCode, null);
  assert.doesNotThrow(() => process.kill(other.pid, 0));
});

test('browser staging waits for both worktrees and duplicate arrival cannot bypass it', async () => {
  const stage = createStage(2);
  let ready = false;
  stage.ready.then(() => { ready = true; });
  stage.arrive('first'); stage.arrive('first');
  await Promise.resolve(); assert.equal(ready, false);
  stage.arrive('second'); await stage.ready; assert.equal(ready, true);
  assert.throws(() => createStage(MAX_SESSIONS + 1));
});

test('targeted selections preserve harness configuration and failure requirements', () => {
  validateSelection([]);
  validateSelection(['tests/browser/example.spec.ts', '--project=chromium', '--grep', 'one case']);
  for (const args of [['-c', 'other.ts'], ['-j50'], ['--workers=50'], ['--config=other.ts'], ['--reporter=line'], ['--output=shared'], ['--retries=1'], ['--list'], ['--pass-with-no-tests'], ['--ignore-snapshots'], ['--update-snapshots']]) assert.throws(() => validateSelection(args), /override/);
});

test('explicit priority owner may run only from the existing first entry', async t => {
  const root = await fixture(t); const path = join(root, 'queue');
  await writeFile(path, JSON.stringify({ queue: ['preceding', 'own', 'following'] }));
  await assert.rejects(assertQueueDrained(path, 'own'), /not drained/);
  await writeFile(path, JSON.stringify({ queue: ['own', 'following'] }));
  await assertQueueDrained(path, 'own');
  await assert.rejects(assertQueueDrained(path), /not drained/);
  await assert.rejects(assertQueueDrained(path, 'following'), /not drained/);
  await writeFile(path, '[]');
  await assert.rejects(assertQueueDrained(path, 'own'), /not drained/);
});

async function thaw(root) {
  await chmod(root, 0o755);
  for (const name of await readdir(root)) {
    const path = join(root, name);
    if ((await lstat(path)).isDirectory()) await thaw(path);
  }
}
async function snapshotFixture(t, count = 4) {
  const root = await fixture(t); const worktree = join(root, 'worktree'); await mkdir(worktree);
  const git = (...args) => execFileSync('git', args, { cwd: worktree, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init'); git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.invalid');
  await mkdir(join(worktree, 'tests/browser'), { recursive: true });
  await writeFile(join(worktree, '.gitignore'), 'artifacts/\n');
  await writeFile(join(worktree, 'pnpm-lock.yaml'), 'fixture lock');
  await writeFile(join(worktree, 'playwright.config.ts'), "workers: 1, retries: 0, reuseExistingServer: false, SGUI_BROWSER_PORT SGUI_BROWSER_RESULTS_FILE");
  const shards = [];
  for (let i = 0; i < count; i++) {
    const spec = `tests/browser/slice-${i}.spec.ts`;
    await writeFile(join(worktree, spec), `fixture-${i}`);
    shards.push({ id: `slice-${i}`, specs: [spec], project: 'chromium' });
  }
  git('add', '.'); git('commit', '-m', 'test: fixture');
  const plan = { mode: 'snapshot', worktree, head: git('rev-parse', 'HEAD'), shards };
  const queueFile = join(root, 'queue'); await writeFile(queueFile, '[]');
  const state = { builds: 0, types: 0, active: 0, peak: 0, calls: [], fail: false, mutate: false, mutateBuild: false, empty: false };
  const command = async ({ args, env, log, signal }) => {
    state.calls.push({ args, env }); await writeFile(log, args.join(' '));
    if (args[1] === 'storybook') {
      state.builds++;
      if (state.transientMutation) {
        const file = join(worktree, plan.shards[0].specs[0]);
        await writeFile(file, 'transient source mutation');
        await new Promise(done => setTimeout(done, 1300));
        state.observedAbort = signal.aborted; await writeFile(file, 'fixture-0');
      }
      await mkdir(args.at(-1)); await writeFile(join(args.at(-1), 'iframe.html'), 'immutable fixture');
    } else if (args[1] === 'tsc') state.types++;
    else {
      state.active++; state.peak = Math.max(state.peak, state.active);
      try {
        await new Promise(done => setTimeout(done, 40));
        if (state.mutate) await writeFile(join(worktree, plan.shards[0].specs[0]), 'mutated source');
        if (state.mutateBuild) {
          const file = join(env.SGUI_BROWSER_STORYBOOK_DIR, 'iframe.html'); await chmod(file, 0o644); await writeFile(file, 'mutated static bytes');
        }
        if (state.fail) throw new Error('fixture browser failure');
        await writeFile(env.SGUI_BROWSER_RESULTS_FILE, JSON.stringify({ stats: { expected: state.empty ? 0 : 1, unexpected: 0, skipped: 0, flaky: 0 } }));
      } finally { state.active--; }
    }
  };
  const runtime = { queueFile, bridgePath: join(root, 'bridge'), heavyPath: join(root, 'heavy'), poolRoot: join(root, 'pool'), lightRoot: join(root, 'light'), versions: { pnpm: 'fixture', playwright: 'fixture' }, command };
  return { root, worktree, plan, state, runtime, git };
}
test('explicit caps admit 30 and higher, bounded by port namespace; defaults remain two', async t => {
  const root = await fixture(t);
  for (const cap of [30, 32]) {
    const leases = await Promise.all(Array.from({ length: cap }, (_, i) => acquireSlot(join(root, String(cap)), `owner-${i}`, cap)));
    assert.equal(new Set(leases.map(lease => lease.slot)).size, cap);
    await assert.rejects(acquireSlot(join(root, String(cap)), 'excess', cap), /occupied/);
    await Promise.all(leases.map(releaseLease));
  }
  for (const cap of [0, -1, 1.5, NaN, MAX_SESSIONS + 1]) await assert.rejects(acquireSlot(root, 'invalid', cap));
});
test('snapshot preflight rejects ambiguous selectors, overlapping files, dirty source, symlinks and wrong heads', async t => {
  const { plan, worktree } = await snapshotFixture(t);
  const prepare = value => prepareSnapshot(value, 'artifacts/pool');
  const prepared = await prepare(plan); assert.equal(prepared.shards.length, 4);
  assert.equal(new RegExp(prepared.shards[0].args[0]).test(join(worktree, plan.shards[0].specs[0])), true);
  assert.equal(new RegExp(prepared.shards[0].args[0]).test(`${plan.shards[0].specs[0]}-extra`), false);
  for (const value of [
    { ...plan, args: ['--workers=30'] }, { ...plan, head: '0'.repeat(40) },
    { ...plan, shards: [] }, { ...plan, shards: [...plan.shards, plan.shards[0]] },
    { ...plan, shards: [plan.shards[0], { ...plan.shards[1], specs: plan.shards[0].specs }] },
    ...['tests/browser/.*', '../foreign.spec.ts', 'tests/browser/slice-0.spec.ts:2', '--workers=30'].map(spec => ({ ...plan, shards: [{ ...plan.shards[0], specs: [spec] }] })),
    { ...plan, shards: [{ ...plan.shards[0], args: [] }] },
    { ...plan, shards: [{ ...plan.shards[0], project: 'all' }] }
  ]) await assert.rejects(prepare(value));
  await writeFile(join(worktree, 'untracked'), 'dirty'); await assert.rejects(prepare(plan), /dirty/); await rm(join(worktree, 'untracked'));
  const before = await sourceDigest(worktree);
  await writeFile(join(worktree, plan.shards[0].specs[0]), 'dirty');
  assert.notEqual(await sourceDigest(worktree), before); assert.throws(() => assertSource(worktree, plan.head), /dirty/);
});
test('snapshot builds/types once, schedules disjoint waves, and records unique immutable session evidence', async t => {
  const { plan, runtime, state } = await snapshotFixture(t, 5);
  const run = await runFrozenSnapshot(plan, { max: 4 }, runtime);
  assert.equal(state.builds, 1); assert.equal(state.types, 1); assert.equal(state.peak, 4);
  const evidence = JSON.parse(await readFile(join(run, 'evidence.json'), 'utf8'));
  assert.equal(evidence.status, 'passed'); assert.equal(evidence.sessions.length, 5);
  assert.equal(evidence.buildDigest, evidence.finalBuildDigest);
  assert.equal(new Set(evidence.sessions.map(item => item.session)).size, 5);
  assert.equal(new Set(evidence.sessions.slice(0, 4).map(item => item.port)).size, 4);
  assert.equal(new Set(state.calls.filter(call => call.args[1] === 'playwright').map(call => call.env.SGUI_BROWSER_STORYBOOK_DIR)).size, 1);
  assert.equal(evidence.commands.length, 7);
  assert.equal(evidence.resourcesBefore.logicalCPUs > 0, true);
  await assert.rejects(readFile(join(runtime.bridgePath, 'owner')), { code: 'ENOENT' });
  await assert.rejects(readFile(join(runtime.heavyPath, 'owner')), { code: 'ENOENT' });
  for (let i = 0; i < 4; i++) await assert.rejects(readFile(join(runtime.poolRoot, `slot-${i}`, 'owner')), { code: 'ENOENT' });
});
test('32 distinct ready shards can overlap without repeated builds or repeated tests (fixtures only)', async t => {
  const { plan, runtime, state } = await snapshotFixture(t, 32);
  await runFrozenSnapshot(plan, { max: 32, firstPort: 26000 }, runtime);
  assert.equal(state.peak, 32); assert.equal(state.builds, 1); assert.equal(state.types, 1);
  assert.equal(new Set(state.calls.filter(call => call.args[1] === 'playwright').map(call => call.args[3])).size, 32);
});
test('snapshot failures and source/build mutation remain red and settle siblings before cleanup', async t => {
  for (const kind of ['fail', 'mutate', 'mutateBuild', 'empty']) {
    const { plan, runtime, state, worktree } = await snapshotFixture(t, 2); state[kind] = true;
    await assert.rejects(runFrozenSnapshot(plan, { max: 2, firstPort: 28000 }, runtime), /Snapshot/);
    assert.equal(state.active, 0);
    const parent = join(worktree, 'artifacts/browser-pool'); const [run] = await readdir(parent);
    const evidence = JSON.parse(await readFile(join(parent, run, 'evidence.json'), 'utf8'));
    assert.equal(evidence.status, 'failed');
    if (kind === 'mutate' || kind === 'mutateBuild') assert.ok(evidence.integrityError);
    await assert.rejects(readFile(join(runtime.bridgePath, 'owner')), { code: 'ENOENT' });
  }
});
test('snapshot refuses occupied foreign slots/ports/heavy bridge without starting browsers or cleaning foreign owners', async t => {
  for (const kind of ['slot', 'port', 'heavy', 'bridge']) {
    const { plan, runtime, state } = await snapshotFixture(t, 2);
    const path = kind === 'slot' ? join(runtime.poolRoot, 'slot-1') : kind === 'port' ? join(runtime.poolRoot, 'ports', '29001') : kind === 'heavy' ? runtime.heavyPath : runtime.bridgePath;
    await mkdir(join(path, '..'), { recursive: true }); const foreign = await acquireLease(path, 'foreign');
    await assert.rejects(runFrozenSnapshot(plan, { max: 2, firstPort: 29000 }, runtime));
    assert.equal(state.calls.filter(call => call.args[1] === 'playwright').length, 0);
    assert.equal(await readFile(join(path, 'owner'), 'utf8'), 'foreign'); await releaseLease(foreign);
  }
});
test('explicit port lease rejects occupied native listener and never closes it', async t => {
  const root = await fixture(t); const server = createServer(); await new Promise(done => server.listen(0, '127.0.0.1', done));
  t.after(() => new Promise(done => server.close(done)));
  await assert.rejects(acquirePortLease(root, server.address().port, 'own'), { code: 'EADDRINUSE' });
  assert.equal(server.listening, true);
});
test('resource budgets fail closed and samples expose CPU/load/RSS/memory/pressure/swap', async () => {
  const sample = await sampleResources(process.pid);
  assert.ok(sample.logicalCPUs > 0); assert.equal(sample.load.length, 3); assert.ok(sample.totalMemoryBytes > 0);
  assert.ok(sample.cpuTimes.idle > 0); assert.ok(sample.memoryPressure); assert.ok(sample.swap);
  assertBudget({ freeMemoryBytes: 100, load: [1], systemRSSBytes: 100 }, { minFreeMemoryBytes: 50, maxLoad1: 2, maxSystemRSSBytes: 200 });
  for (const budget of [{ minFreeMemoryBytes: 200 }, { maxLoad1: 0.5 }, { maxSystemRSSBytes: 50 }]) assert.throws(() => assertBudget({ freeMemoryBytes: 100, load: [1], systemRSSBytes: 100 }, budget), /budget/);
  for (const budget of [{ maxLoad1: NaN }, { maxLoad1: 0 }, { unknown: 4 }]) assert.throws(() => validateBudget(budget));
});
test('budget rejection prevents browser admission and leaves failed retained evidence', async t => {
  const { plan, runtime, state } = await snapshotFixture(t);
  await assert.rejects(runFrozenSnapshot(plan, { budget: { minFreeMemoryBytes: Number.MAX_SAFE_INTEGER } }, runtime), /Snapshot/);
  assert.equal(state.calls.filter(call => call.args[1] === 'playwright').length, 0);
});

test('independent build admission expands distinct tasks and releases tickets after failure', async () => {
  for (const cap of [1, 2, 3]) {
    const admit = createAdmission(cap); let active = 0, peak = 0;
    const outcomes = await Promise.allSettled(Array.from({ length: 8 }, async (_, i) => {
      const finish = await admit(); active++; peak = Math.max(active, peak);
      try { await new Promise(done => setTimeout(done, 10)); if (i === 0) throw new Error('fixture'); }
      finally { active--; finish(); }
    }));
    assert.equal(peak, cap); assert.equal(active, 0); assert.equal(outcomes.filter(item => item.status === 'rejected').length, 1);
    const finish = await admit(); finish(); assert.throws(finish, /already released/);
  }
});
test('snapshot full-engine selection stays disjoint and flags/cap/queue substitutions fail before launching', async t => {
  const { plan, runtime } = await snapshotFixture(t, 2);
  plan.shards[0].project = ['chromium', 'firefox', 'webkit'];
  const prepared = await prepareSnapshot(plan, 'artifacts/pool');
  assert.deepEqual(prepared.shards[0].args.slice(1), ['--project=chromium', '--project=firefox', '--project=webkit']);
  for (const args of [['--repeat-each=10'], ['--shard=1/3'], ['--timeout=0'], ['--max-failures=1'], ['--no-deps'], ['--last-failed']]) assert.throws(() => validateSelection(args), /override/);
  await assert.rejects(runPool(plan, { buildMax: 2 }), /exactly once/);
  await assert.rejects(runFrozenSnapshot(plan, { firstPort: 65535, max: 2 }, runtime), /port range/);
  await assert.rejects(runFrozenSnapshot(plan, { queueFile: runtime.queueFile }), /substitute queues/);
  await writeFile(runtime.queueFile, '["foreign"]');
  await assert.rejects(runFrozenSnapshot(plan, {}, runtime), /not drained/);
});
test('snapshot rejects symlinked ignored output ancestors without altering foreign output', async t => {
  const { plan, root, worktree, git } = await snapshotFixture(t, 2);
  await writeFile(join(worktree, '.gitignore'), 'artifacts\n'); git('add', '.gitignore'); git('commit', '-m', 'test: ignored artifact path'); plan.head = git('rev-parse', 'HEAD');
  const foreign = join(root, 'foreign'); await mkdir(foreign);
  await writeFile(join(foreign, 'sentinel'), 'foreign');
  await symlink(foreign, join(worktree, 'artifacts'));
  await assert.rejects(prepareSnapshot(plan, 'artifacts/pool'), /symlink/);
  assert.equal(await readFile(join(foreign, 'sentinel'), 'utf8'), 'foreign');
});

test('periodic integrity observation stays failed after source restoration and aborts later command admission', async t => {
  const { plan, runtime, state, worktree } = await snapshotFixture(t, 2);
  state.transientMutation = true;
  await assert.rejects(runFrozenSnapshot(plan, { max: 2 }, runtime), /Snapshot/);
  assert.equal(state.observedAbort, true); assert.equal(state.types, 0); assert.equal(state.peak, 0);
  const parent = join(worktree, 'artifacts/browser-pool'); const [run] = await readdir(parent);
  const evidence = JSON.parse(await readFile(join(parent, run, 'evidence.json'), 'utf8'));
  assert.equal(evidence.status, 'failed'); assert.match(evidence.integrityError, /dirty/);
  assert.equal(evidence.finalStatus, ''); assert.equal(evidence.finalHead, plan.head);
});

test('legacy distinct-worktree orchestration preserves defaults and independently tunes builds under one heavy owner', async t => {
  for (const buildMax of [1, 2]) {
    const first = await snapshotFixture(t, 1); const second = await snapshotFixture(t, 1);
    const runtime = { ...first.runtime };
    let activeBuilds = 0, peakBuilds = 0;
    runtime.command = async request => {
      assert.match(await readFile(join(runtime.heavyPath, 'owner'), 'utf8'), /^browser-pool:/);
      if (request.args[1] === 'storybook') {
        activeBuilds++; peakBuilds = Math.max(peakBuilds, activeBuilds);
        try { await new Promise(done => setTimeout(done, 40)); await first.runtime.command(request); }
        finally { activeBuilds--; }
      } else {
        if (request.args[1] === 'playwright') assert.equal(activeBuilds, 0);
        await first.runtime.command(request);
      }
    };
    const plan = [first, second].map(item => ({ worktree: item.worktree, head: item.plan.head, args: [item.plan.shards[0].specs[0], '--project=chromium'] }));
    await runPool(plan, buildMax === 1 ? {} : { buildMax }, runtime);
    assert.equal(peakBuilds, buildMax); assert.equal(first.state.builds, 2); assert.equal(first.state.types, 2); assert.equal(first.state.peak, 2);
    for (const item of [first, second]) {
      const parent = join(item.worktree, 'artifacts/browser-pool'); const [run] = await readdir(parent);
      const evidence = JSON.parse(await readFile(join(parent, run, 'evidence.json'), 'utf8'));
      assert.equal(evidence.status, 'passed'); assert.equal(evidence.max, 2); assert.equal(evidence.buildMax, buildMax);
      assert.equal(evidence.buildDigest, evidence.finalBuildDigest);
    }
    await assert.rejects(readFile(join(runtime.heavyPath, 'owner')), { code: 'ENOENT' });
    await assert.rejects(readFile(join(runtime.bridgePath, 'owner')), { code: 'ENOENT' });
  }
});
test('legacy failed build unblocks staged siblings and retains failed per-worktree evidence', async t => {
  const first = await snapshotFixture(t, 1); const second = await snapshotFixture(t, 1);
  const runtime = { ...first.runtime }; const firstPath = await realpath(first.worktree); let failedBuild = false;
  runtime.command = async request => {
    if (request.args[1] === 'storybook' && request.cwd === firstPath && !failedBuild) { failedBuild = true; await writeFile(request.log, 'fixture build failure'); throw new Error('fixture build failure'); }
    await first.runtime.command(request);
  };
  const plan = [first, second].map(item => ({ worktree: item.worktree, head: item.plan.head, args: [item.plan.shards[0].specs[0], '--project=chromium'] }));
  await assert.rejects(runPool(plan, {}, runtime), /incomplete/);
  assert.equal(first.state.peak, 1);
  const parent = join(first.worktree, 'artifacts/browser-pool'); const [run] = await readdir(parent);
  const evidence = JSON.parse(await readFile(join(parent, run, 'evidence.json'), 'utf8'));
  assert.equal(evidence.status, 'failed'); assert.match(evidence.error, /build failure/);
  await assert.rejects(readFile(join(runtime.heavyPath, 'owner')), { code: 'ENOENT' });
});

test('symlinked slot roots and owner files cannot redirect allocation or foreign cleanup', async t => {
  const root = await fixture(t); const foreign = join(root, 'foreign'); await mkdir(foreign);
  const link = join(root, 'slots'); await symlink(foreign, link);
  await assert.rejects(acquireSlot(link, 'own', 2), /regular directory/);
  assert.deepEqual(await readdir(foreign), []);
  const lease = await acquireLease(join(root, 'lease'), 'own');
  const owner = join(lease.path, 'owner'); await rm(owner); await writeFile(join(foreign, 'owner'), 'own'); await symlink(join(foreign, 'owner'), owner);
  await assert.rejects(releaseLease(lease), /refusing cleanup/);
  assert.equal(await readFile(join(foreign, 'owner'), 'utf8'), 'own');
});
