import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm, chmod, symlink, readdir, lstat, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { acquireLightSlot, acquireInstallSlot, LIGHT_ROOT, INSTALL_ROOT, acquireLease, releaseLease, acquireSlot, assertQueueDrained, assertPortFree, ownedPath, digestTree, LEGACY_LOCK, runPool, runOwnedCommand, createStage, validateSelection, prepareSnapshot, runFrozenSnapshot, sampleResources, assertBudget, validateBudget, acquirePortLease, sourceDigest, assertSource, MAX_SESSIONS, createAdmission, validateCaseFilter, snapshotCases } from './browser-validation-pool.mjs';
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
const canonicalHelpers = [
  { name: 'light', acquire: acquireLightSlot, prefix: 'slot', max: 4 },
  { name: 'install', acquire: acquireInstallSlot, prefix: 'slot', max: 2 },
];
function canonicalClaimProcess(root, name, owner) {
  const script = `import {acquireLightSlot,acquireInstallSlot} from ${JSON.stringify(moduleURL)};
    try { const acquire=process.argv[2]==='light'?acquireLightSlot:acquireInstallSlot;
      console.log(JSON.stringify(await acquire(process.argv[3],{root:process.argv[1]}))); }
    catch(error) { console.error(error.message); process.exitCode=2; }`;
  return new Promise((done, reject) => {
    const child = spawn(process.execPath, ['--input-type=module', '-e', script, root, name, owner]);
    let output = '', errors = '';
    child.stdout.on('data', data => { output += data; });
    child.stderr.on('data', data => { errors += data; });
    child.once('error', reject); child.once('close', code => done({ code, output, errors }));
  });
}
test('canonical helper processes contend with human claims and enforce light/install limits', async t => {
  assert.equal(LIGHT_ROOT, '/tmp/sgui-light-validation-slots');
  assert.equal(INSTALL_ROOT, '/tmp/sgui-install-slots');
  for (const { name, acquire, prefix, max } of canonicalHelpers) {
    const root = await fixture(t);
    const human = await acquireLease(join(root, `${prefix}0`), 'human');
    const results = await Promise.all(Array.from({ length: max + 4 }, (_, i) => canonicalClaimProcess(root, name, `helper-${i}`)));
    const admitted = results.filter(result => result.code === 0).map(result => JSON.parse(result.output));
    assert.equal(admitted.length, max - 1);
    assert.equal(new Set(admitted.map(lease => lease.slot)).size, max - 1);
    assert.equal(results.filter(result => result.code === 2 && /occupied/.test(result.errors)).length, 5);
    for (const lease of admitted) {
      assert.equal(lease.path, join(root, `${prefix}${lease.slot}`));
      assert.equal(lease.legacyLease.path, join(root, `slot-${lease.slot}`));
      await assert.rejects(acquireLease(lease.path, 'human-late'), { code: 'EEXIST' });
      await assert.rejects(acquireLease(lease.legacyLease.path, 'old-helper-late'), { code: 'EEXIST' });
    }
    assert.equal(await readFile(join(human.path, 'owner'), 'utf8'), 'human');
    assert.equal((await readdir(root)).includes('slot-0'), false);
    for (const lease of admitted) await releaseLease(lease);
    await releaseLease(human);
    assert.deepEqual(await readdir(root), []);
    const full = [];
    for (let slot = 0; slot < max; slot++) full.push(await acquire('full', { root }));
    await assert.rejects(acquireSlot(root, 'old-helper', max), /occupied/);
    await assert.rejects(acquire('extra', { root }), /occupied/);
    for (const lease of full) await releaseLease(lease);
  }
});
test('canonical helpers refuse corresponding legacy occupancy without changing foreign claims', async t => {
  for (const { acquire, prefix, max } of canonicalHelpers) {
    const root = await fixture(t);
    const old = await acquireSlot(root, 'old-helper', max);
    // An ownerless legacy claim is occupied too; no stale reclamation.
    await mkdir(join(root, 'slot-1'));
    const leases = [];
    for (let slot = 2; slot < max; slot++) {
      const lease = await acquire('new-helper', { root }); leases.push(lease);
      assert.equal(lease.slot, slot);
    }
    await assert.rejects(acquire('blocked', { root }), /occupied/);
    await assert.rejects(lstat(join(root, `${prefix}0`)), { code: 'ENOENT' });
    await assert.rejects(lstat(join(root, `${prefix}1`)), { code: 'ENOENT' });
    assert.equal(await readFile(join(old.path, 'owner'), 'utf8'), 'old-helper');
    assert.deepEqual(await readdir(join(root, 'slot-1')), []);
    for (const lease of leases) await releaseLease(lease);
    await releaseLease(old);
    const next = await acquire('next', { root }); assert.equal(next.slot, 0);
    await releaseLease(next);
  }
});
test('canonical helper cleanup checks both exact owners and retains claims on errors', async t => {
  for (const { acquire, prefix, max } of canonicalHelpers) {
    for (const changed of ['canonical', 'legacy']) {
      const root = await fixture(t);
      const lease = await acquire('original', { root });
      const claim = changed === 'canonical' ? lease : lease.legacyLease;
      await writeFile(join(claim.path, 'owner'), 'foreign');
      await assert.rejects(releaseLease(lease), /Owner mismatch/);
      assert.equal(await readFile(join(claim.path, 'owner'), 'utf8'), 'foreign');
      const untouched = changed === 'canonical' ? lease.legacyLease : lease;
      assert.equal(await readFile(join(untouched.path, 'owner'), 'utf8'), 'original');
      await writeFile(join(claim.path, 'owner'), 'original');
      await releaseLease(lease);
      assert.deepEqual(await readdir(root), []);
    }
    const malformedRoot = await fixture(t);
    const malformed = await acquire('original', { root: malformedRoot });
    const legacyOwner = join(malformed.legacyLease.path, 'owner');
    await rm(legacyOwner); await symlink(join(malformed.path, 'owner'), legacyOwner);
    await assert.rejects(releaseLease(malformed), /Non-regular lease/);
    assert.equal(await readFile(join(malformed.path, 'owner'), 'utf8'), 'original');
    assert.equal((await lstat(legacyOwner)).isSymbolicLink(), true);
    await rm(legacyOwner); await writeFile(legacyOwner, 'original');
    await releaseLease(malformed);
    const root = await fixture(t);
    // A canonical symlink/file is occupied and is never followed or removed.
    const foreign = join(root, 'foreign'); await mkdir(foreign);
    await writeFile(join(foreign, 'owner'), 'foreign');
    await symlink(foreign, join(root, `${prefix}0`));
    for (let slot = 1; slot < max; slot++) await writeFile(join(root, `${prefix}${slot}`), 'foreign');
    await assert.rejects(acquire('blocked', { root }), /occupied/);
    assert.equal((await lstat(join(root, `${prefix}0`))).isSymbolicLink(), true);
    assert.equal(await readFile(join(foreign, 'owner'), 'utf8'), 'foreign');
    assert.equal((await readdir(root)).some(name => name.startsWith('slot-')), false);
    const linkRoot = join(root, 'link-root'); await symlink(foreign, linkRoot);
    await assert.rejects(acquire('blocked', { root: linkRoot }), /regular directory/);
    assert.deepEqual(await readdir(foreign), ['owner']);
  }
});
test('canonical helper failure releases both owned claims while generic pool naming stays unchanged', async t => {
  for (const { acquire, max } of canonicalHelpers) {
    const root = await fixture(t);
    const other = await acquireSlot(root, 'foreign', max);
    await assert.rejects((async () => {
      const lease = await acquire('own', { root });
      try { throw new Error('fixture job failure'); } finally { await releaseLease(lease); }
    })(), /fixture job failure/);
    assert.deepEqual(await readdir(root), ['slot-0']);
    assert.equal(await readFile(join(other.path, 'owner'), 'utf8'), 'foreign');
    await releaseLease(other);
    const generic = await acquireSlot(root, 'session', max);
    assert.equal(generic.path, join(root, 'slot-0'));
    assert.equal(generic.legacyLease, undefined);
    await releaseLease(generic);
  }
});
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
function caseResults(shard, { empty = false, title = 'focused case', worktree = '/owned' } = {}) {
  const projects = Array.isArray(shard.project) ? shard.project : [shard.project];
  return { config: { rootDir: join(worktree, 'tests/browser') }, errors: [], stats: { expected: empty ? 0 : shard.specs.length * projects.length, unexpected: 0, skipped: 0, flaky: 0 },
    suites: shard.specs.map(file => ({ title: file.slice('tests/browser/'.length), specs: empty ? [] : [{ title, file: file.slice('tests/browser/'.length), id: file, tags: [],
      tests: projects.map(projectName => ({ projectName, status: 'expected', results: [{ status: 'passed', retry: 0 }] })) }] })) };
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
  const command = async ({ cwd, args, env, log, signal }) => {
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
        const selected = plan.shards.find(shard => new RegExp(args[3]).test(shard.specs[0]));
        await writeFile(env.SGUI_BROWSER_RESULTS_FILE, JSON.stringify(caseResults(selected, { empty: state.empty, worktree: cwd })));
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

// Signal failures must reach promises/evidence, never escape event or timer callbacks.
test('exit, timeout and final cleanup signal errors remain controlled failures', async t => {
  const root = await fixture(t);
  for (const phase of ['exit', 'timeout', 'cleanup']) {
    const log = join(root, `${phase}.log`); let terms = 0, kills = 0;
    const denied = Object.assign(new Error('fixture denied'), { code: 'EPERM' });
    const controller = new AbortController();
    const request = { executable: process.execPath, args: ['-e', phase === 'timeout'
      ? 'process.on("SIGTERM",()=>{}); setInterval(()=>{},1000)'
      : 'console.log("leader done")'], log, signal: controller.signal, terminateDelay: 80 };
    const command = runOwnedCommand(request, { kill(pid, kind) {
      assert.ok(pid < 0);
      if (kind === 'SIGTERM' && ++terms === 1 && phase === 'exit') throw denied;
      if (kind === 'SIGKILL' && ++kills === 1 && phase !== 'exit') {
        // Deny this operation after an independent owned cleanup so the fixture
        // can prove that a signal error stays red even after verified settlement.
        try { process.kill(pid, 'SIGKILL'); } catch (error) { if (error.code !== 'ESRCH') throw error; }
        throw denied;
      }
      return process.kill(pid, kind);
    } });
    const timer = phase === 'timeout' ? setTimeout(() => controller.abort(), 400) : undefined;
    try { await assert.rejects(command, /EPERM/); } finally { clearTimeout(timer); }
    const evidence = JSON.parse(await readFile(`${log}.resources.json`, 'utf8'));
    assert.equal(evidence.settled, true); assert.ok(evidence.signalErrors.some(item => item.code === 'EPERM'));
  }
});

test('normal leader exit still kills and settles an owned descendant', async t => {
  const root = await fixture(t); const log = join(root, 'descendant.log');
  const script = 'const {spawn}=require("node:child_process"); const c=spawn(process.execPath,["-e","setInterval(()=>{},1000)"],{stdio:"inherit"}); console.log(c.pid); setTimeout(()=>process.exit(0),100);';
  await runOwnedCommand({ executable: process.execPath, args: ['-e', script], log, terminateDelay: 100 });
  const evidence = JSON.parse(await readFile(`${log}.resources.json`, 'utf8'));
  assert.equal(evidence.settled, true);
  assert.throws(() => process.kill(-evidence.processGroup, 0), { code: 'ESRCH' });
});

test('unsettled permission failure retains snapshot claims and failed evidence without foreign cleanup', async t => {
  const { plan, runtime, worktree, root } = await snapshotFixture(t, 1);
  const foreign = await acquireSlot(runtime.poolRoot, 'foreign', 2);
  const other = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)']);
  const otherClosed = new Promise(done => other.once('close', done));
  let group;
  t.after(async () => { other.kill(); await otherClosed; });
  runtime.command = async request => {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 200);
    try {
      await runOwnedCommand({ ...request, executable: process.execPath, args: ['-e', 'setInterval(()=>{},1000)'],
        signal: controller.signal, terminateDelay: 50 }, { kill(pid, kind) {
        group = -pid;
        throw Object.assign(new Error('fixture denied live group'), { code: 'EPERM' });
      } });
    } finally { clearTimeout(timer); }
  };
  try {
    await assert.rejects(runFrozenSnapshot(plan, {}, runtime), /Snapshot/);
    assert.doesNotThrow(() => process.kill(-group, 0));
    const [run] = await readdir(join(worktree, 'artifacts/browser-pool'));
    const evidence = JSON.parse(await readFile(join(worktree, 'artifacts/browser-pool', run, 'evidence.json'), 'utf8'));
    assert.equal(evidence.status, 'failed'); assert.match(evidence.error, /unsettled.*EPERM/);
    assert.match(evidence.cleanup, /leases retained/);
    assert.equal(await readFile(join(runtime.bridgePath, 'owner'), 'utf8'), evidence.owner);
    assert.equal(await readFile(join(runtime.heavyPath, 'owner'), 'utf8'), evidence.owner);
    assert.equal(await readFile(join(foreign.path, 'owner'), 'utf8'), 'foreign');
    assert.doesNotThrow(() => process.kill(other.pid, 0));
  } finally {
    if (group) process.kill(-group, 'SIGKILL');
    // Fixture cleanup uses exact retained owner tokens only after real settlement.
    if (group) {
      for (let i = 0; i < 100; i++) {
        try { process.kill(-group, 0); } catch (error) { if (error.code === 'ESRCH') break; throw error; }
        await new Promise(done => setTimeout(done, 10));
      }
      assert.throws(() => process.kill(-group, 0), { code: 'ESRCH' });
    }
    for (const path of [runtime.heavyPath, runtime.bridgePath]) {
      await releaseLease({ path, owner: await readFile(join(path, 'owner'), 'utf8') });
    }
    await releaseLease(foreign);
  }
});

test('SIGINT and SIGTERM supervisor handlers bound owned command cancellation', async t => {
  const root = await fixture(t);
  for (const kind of ['SIGINT', 'SIGTERM']) {
    const log = join(root, `${kind}.log`);
    const script = `import {runOwnedCommand} from ${JSON.stringify(moduleURL)};
      const c=new AbortController(); process.on('SIGINT',()=>c.abort()); process.on('SIGTERM',()=>c.abort());
      console.log('ready'); try { await runOwnedCommand({executable:process.execPath,args:['-e','process.on("SIGTERM",()=>{}); setInterval(()=>{},1000)'],log:process.argv[1],signal:c.signal,terminateDelay:80}); }
      catch(error) { console.error(error.message); process.exitCode=1; }`;
    const child = spawn(process.execPath, ['--input-type=module', '-e', script, log]);
    let stderr = ''; child.stderr.on('data', chunk => { stderr += chunk; });
    const closed = new Promise(done => child.once('close', code => done(code)));
    await new Promise(done => child.stdout.once('data', done));
    await new Promise(done => setTimeout(done, 200)); child.kill(kind);
    const bound = setTimeout(() => child.kill('SIGKILL'), 5000);
    try { assert.equal(await closed, 1); } finally { clearTimeout(bound); }
    assert.match(stderr, /failed/);
    assert.equal(JSON.parse(await readFile(`${log}.resources.json`, 'utf8')).settled, true);
  }
});


test('legacy pool retains all admitted leases when command settlement is unknown', async t => {
  const { plan, runtime, worktree } = await snapshotFixture(t, 1);
  runtime.command = async () => { throw Object.assign(new Error('fixture unsettled'), { ownedCommandUnsettled: true }); };
  await assert.rejects(runPool([{ worktree, head: plan.head, args: [] }], {}, runtime), /incomplete/);
  const [run] = await readdir(join(worktree, 'artifacts/browser-pool'));
  const evidence = JSON.parse(await readFile(join(worktree, 'artifacts/browser-pool', run, 'evidence.json'), 'utf8'));
  assert.equal(evidence.status, 'failed'); assert.match(evidence.cleanup, /retained/);
  assert.equal(await readFile(join(runtime.bridgePath, 'owner'), 'utf8'), evidence.owner);
  assert.equal(await readFile(join(runtime.heavyPath, 'owner'), 'utf8'), evidence.owner);
  const [slot] = (await readdir(runtime.poolRoot)).filter(name => name.startsWith('slot-'));
  assert.equal(await readFile(join(runtime.poolRoot, slot, 'owner'), 'utf8'), `${evidence.owner}:${evidence.token}`);
  assert.equal(await readFile(join(runtime.poolRoot, 'ports', String(evidence.port), 'owner'), 'utf8'), `${evidence.owner}:${evidence.token}`);
});


test('focused snapshot filters propagate as separate arguments and retain exact case evidence', async t => {
  const { plan, runtime, state } = await snapshotFixture(t, 2);
  plan.shards[0].project = ['firefox', 'webkit'];
  plan.shards[0].grep = 'focused case$|literal `\\$\\(echo\\)`';
  const run = await runFrozenSnapshot(plan, {}, runtime);
  const evidence = JSON.parse(await readFile(join(run, 'evidence.json'), 'utf8'));
  const item = evidence.sessions.find(item => item.id === plan.shards[0].id);
  assert.equal(item.grep, plan.shards[0].grep);
  assert.deepEqual(item.selectionArgs.slice(-2), ['--grep', plan.shards[0].grep]);
  const call = state.calls.find(call => call.args.includes('--grep'));
  assert.deepEqual(call.args.slice(-2), ['--grep', plan.shards[0].grep]);
  assert.equal(item.count, 2); assert.equal(item.cases.length, 2);
  assert.deepEqual(item.cases.map(item => item.project), ['firefox', 'webkit']);
  assert.equal(evidence.sessions[1].grep, null);
  assert.equal(evidence.sessions[1].selectionArgs.includes('--grep'), false);
  assert.deepEqual(JSON.parse(await readFile(join(item.session, 'evidence.json'), 'utf8')), item);
});
test('focused regex admission rejects malformed, empty, unsafe and ambiguous fields before commands', async t => {
  const { plan, runtime, state } = await snapshotFixture(t, 1);
  for (const grep of ['', ' ', null, [], {}, 1, '--workers=30', '--help', 'foo|', '^$', 'foo||bar', '(foo)+', '.*', '[foo]', 'foo{2}', '\\1', '\\k<x>', 'foo\nbar', 'x'.repeat(513), Array(10).fill('x').join('|'), 'trailing\\']) {
    await assert.rejects(runFrozenSnapshot({ ...plan, shards: [{ ...plan.shards[0], grep }] }, {}, runtime), /regex/);
  }
  for (const field of ['grepInvert', 'flags', 'args', 'env', 'source']) {
    await assert.rejects(prepareSnapshot({ ...plan, shards: [{ ...plan.shards[0], [field]: 'foo' }] }, 'artifacts/pool'), /Ambiguous/);
  }
  assert.equal(state.calls.length, 0);
  assert.equal(validateCaseFilter('focused case$|literal \\(case\\)').test('literal (case)'), true);
});
test('complete snapshot JSON rejects missing selections and inconsistent aggregate passes', async () => {
  const shard = { specs: ['tests/browser/one.spec.ts', 'tests/browser/two.spec.ts'], project: ['firefox', 'webkit'], grep: 'focused case$' };
  assert.equal(snapshotCases(caseResults(shard), shard, '/owned').length, 4);
  for (const mutate of [
    r => { r.suites = []; }, r => { r.config.rootDir = '/foreign'; }, r => { r.errors.push({ message: 'global failure' }); }, r => { delete r.suites; }, r => { r.stats.expected++; },
    r => { r.suites.pop(); r.stats.expected = 2; },
    r => { for (const suite of r.suites) suite.specs[0].tests.pop(); r.stats.expected = 2; },
    r => { r.suites[0].specs[0].title = 'unselected'; },
    r => { r.suites[0].specs[0].tags = ['focused']; },
    r => { r.suites[0].specs[0].file = 'tests/browser/foreign.spec.ts'; },
    r => { r.suites[0].specs[0].tests[0].projectName = 'chromium'; },
    r => { r.suites[0].specs[0].tests[0].results.push({ status: 'passed', retry: 1 }); },
    r => { r.suites[0].specs[0].tests[0].status = 'flaky'; },
    r => { r.suites[0].specs[0].tests[0].results[0].status = 'skipped'; },
    r => { r.suites[0].specs.push(r.suites[0].specs[0]); r.stats.expected += 2; },
    ...['unexpected', 'flaky', 'skipped'].map(key => r => { r.stats[key] = 1; })
  ]) { const results = caseResults(shard); mutate(results); assert.throws(() => snapshotCases(results, shard, '/owned')); }
});
test('zero or unselected focused cases retain failed evidence and release only owned claims', async t => {
  for (const empty of [true, false]) {
    const { plan, runtime, state, worktree } = await snapshotFixture(t, 1);
    plan.shards[0].grep = 'missing case$'; state.empty = empty;
    await assert.rejects(runFrozenSnapshot(plan, {}, runtime), /Snapshot/);
    const [run] = await readdir(join(worktree, 'artifacts/browser-pool'));
    const evidence = JSON.parse(await readFile(join(worktree, 'artifacts/browser-pool', run, 'evidence.json'), 'utf8'));
    assert.equal(evidence.status, 'failed'); assert.equal(evidence.sessions[0].status, 'failed');
    assert.equal(evidence.sessions[0].grep, 'missing case$');
    assert.ok(await readFile(join(evidence.sessions[0].session, 'results.json'), 'utf8'));
    await assert.rejects(readFile(join(runtime.bridgePath, 'owner')), { code: 'ENOENT' });
  }
});

test('snapshot case attestation preserves nested untagged titles and whole-file tagged defaults', () => {
  const shard = { specs: ['tests/browser/nested.spec.ts'], project: 'webkit', grep: 'describe focused case$' };
  const report = caseResults(shard);
  const fileSuite = report.suites[0];
  fileSuite.suites = [{ title: 'describe', specs: fileSuite.specs }]; fileSuite.specs = [];
  assert.equal(snapshotCases(report, shard, '/owned')[0].title, 'webkit nested.spec.ts describe focused case');
  fileSuite.suites[0].specs[0].tags = ['regression'];
  const { grep, ...wholeFile } = shard;
  assert.equal(snapshotCases(report, wholeFile, '/owned').length, 1);
  assert.throws(() => snapshotCases(report, shard, '/owned'), /untagged/);
});
