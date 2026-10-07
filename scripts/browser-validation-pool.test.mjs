import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm, chmod, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { acquireLease, releaseLease, acquireSlot, assertQueueDrained, assertPortFree, ownedPath, digestTree, LEGACY_LOCK, runPool, runOwnedCommand, createStage, validateSelection } from './browser-validation-pool.mjs';
import { browserSettings, startServer } from './serve-browser-storybook.mjs';
const moduleURL = new URL('./browser-validation-pool.mjs', import.meta.url).href;
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'sgui-pool-test-'));
  t.after(async () => { await chmod(root, 0o755); await rm(root, { recursive: true, force: true }); });
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
  await assert.rejects(acquireSlot(root, 'bad', 3), /1 or 2/);
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
  await assertQueueDrained('/tmp/sgui-browser-validation-priority.json');
  const bridge = await acquireLease(LEGACY_LOCK, `pool-server-test:${process.pid}`);
  t.after(() => releaseLease(bridge));
  const root = await fixture(t);
  const servers = [];
  t.after(async () => { for (const server of servers) await new Promise(done => server.close(done)); });
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
  assert.throws(() => createStage(3));
});

test('targeted selections preserve harness configuration and failure requirements', () => {
  validateSelection([]);
  validateSelection(['tests/browser/example.spec.ts', '--project=chromium', '--grep', 'one case']);
  for (const args of [['-c', 'other.ts'], ['-j50'], ['--workers=50'], ['--config=other.ts'], ['--reporter=line'], ['--output=shared'], ['--retries=1'], ['--list'], ['--pass-with-no-tests'], ['--ignore-snapshots'], ['--update-snapshots']]) assert.throws(() => validateSelection(args), /override/);
});
