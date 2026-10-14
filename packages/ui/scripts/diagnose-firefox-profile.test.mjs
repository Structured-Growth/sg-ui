import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

// Execute the actual standalone script with mocked subprocesses and files.
// No Firefox, personal profile, shared browser lock or filesystem is accessed.
const source = (await readFile(new URL('./diagnose-firefox-profile.mjs', import.meta.url), 'utf8'))
  .replace(/^import .*;\n/gm, '')
  .replace('createRequire(import.meta.url)', 'createRequire()');

async function runProbe({ phase = 'exit', killCode, code = 0, screenshot = true, lockOwned = true } = {}) {
  const child = new EventEmitter();
  child.pid = 43210;
  child.stdout = new EventEmitter();
  child.stderr = new EventEmitter();
  const signals = [];
  const removals = [];
  const logs = [];
  const errors = [];
  const timers = [];
  let lockCleanup;
  let closedContext = false;
  const fakeProcess = {
    argv: ['node', '/mock/diagnose-firefox-profile.mjs', '--owner', 'mock-owner'],
    version: 'mock-node',
    kill(pid, signal) {
      signals.push({ pid, signal });
      if (killCode) throw Object.assign(new Error(`mock ${killCode}`), { code: killCode });
    },
  };
  const sandbox = {
    process: fakeProcess,
    console: { log: value => logs.push(value), error: (...values) => errors.push(values) },
    createRequire: () => name => name.endsWith('/package.json') ? { version: 'mock-playwright' } : {
      firefox: {
        executablePath: () => '/mock/firefox',
        launchPersistentContext: async () => ({
          newPage: async () => ({ goto: async () => {} }),
          close: async () => { closedContext = true; },
        }),
      },
    },
    homedir: () => '/mock/home', platform: () => 'mock-platform', release: () => 'mock-release', tmpdir: () => '/mock/tmp',
    join: (...parts) => parts.join('/'), resolve: value => value,
    constants: { X_OK: 1 },
    readdir: async () => [], mkdir: async () => {}, writeFile: async () => {}, realpath: async path => path,
    mkdtemp: async () => '/mock/tmp/owned-root',
    rm: async (path, options) => removals.push({ path, options }),
    access: async path => {
      if (path.endsWith('/native.png') && !screenshot) throw Object.assign(new Error('missing'), { code: 'ENOENT' });
    },
    setTimeout(callback, delay) {
      const timer = { callback, delay, cleared: false };
      timers.push(timer);
      return timer;
    },
    clearTimeout: timer => { timer.cleared = true; },
    spawn(executable, args, options) {
      assert.equal(executable, '/mock/firefox');
      assert.equal(args[3], '/mock/tmp/owned-root/native-profile');
      assert.deepEqual(JSON.parse(JSON.stringify(options)), { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
      queueMicrotask(() => {
        child.stdout.emit('data', Buffer.from('native output'));
        if (phase === 'timeout') {
          timers[0].callback();
          if (killCode) return; // A live child whose signal failed never closes.
        }
        child.emit('exit', code, phase === 'timeout' ? 'SIGKILL' : null);
        child.emit('close', code, phase === 'timeout' ? 'SIGKILL' : null);
      });
      return child;
    },
    spawnSync(executable, args) {
      lockCleanup = { executable, args };
      return { status: lockOwned ? 0 : 1, stderr: '' };
    },
  };
  await vm.runInNewContext(`(async () => { ${source}\n })()`, sandbox);
  assert.equal(closedContext, true);
  assert.equal(timers[0].delay, 10000);
  assert.equal(lockCleanup.executable, 'python3');
  assert.match(lockCleanup.args[1], /o\.read_text\(\)==sys\.argv\[2\]/);
  assert.equal(lockCleanup.args[2], '/tmp/sgui-parallel-batch-01-validation.lock');
  assert.equal(lockCleanup.args[3], 'mock-owner');
  assert.ok(signals.every(({ pid, signal }) => pid === -43210 && signal === 'SIGKILL'));
  return { report: JSON.parse(logs[0]), exitCode: fakeProcess.exitCode, signals, removals, timers, errors };
}

test('exit EPERM preserves completed capture and emits cleanup failure before finally', async () => {
  const { report, exitCode, removals, timers } = await runProbe({ killCode: 'EPERM' });
  const native = report.probes[1];
  assert.equal(native.status, 'page-captured');
  assert.equal(native.code, 0);
  assert.equal(native.signal, null);
  assert.equal(native.screenshotCreated, true);
  assert.equal(native.output, 'native output');
  assert.deepEqual(native.cleanupErrors, [{ phase: 'exit', code: 'EPERM', error: 'mock EPERM' }]);
  assert.equal(report.resolved, false);
  assert.equal(exitCode, 1);
  assert.equal(timers[0].cleared, true);
  assert.ok(removals.some(({ path, options }) => path === '/mock/tmp/owned-root' && options.recursive));
});

test('already absent owned group is benign; normal capture remains successful', async () => {
  for (const killCode of [undefined, 'ESRCH']) {
    const { report, exitCode } = await runProbe({ killCode });
    assert.equal(report.probes[1].status, 'page-captured');
    assert.deepEqual(report.probes[1].cleanupErrors, []);
    assert.equal(report.resolved, true);
    assert.equal(exitCode, undefined);
  }
});

test('live timeout EPERM settles failed, retains profile and still verifies lock owner', async () => {
  const { report, exitCode, removals, signals } = await runProbe({ phase: 'timeout', killCode: 'EPERM' });
  const native = report.probes[1];
  assert.equal(native.status, 'failed');
  assert.equal(native.code, null);
  assert.equal(native.signal, null);
  assert.equal(native.timedOut, true);
  assert.equal(native.screenshotCreated, true);
  assert.equal(native.childMayStillBeRunning, true);
  assert.deepEqual(native.cleanupErrors, [{ phase: 'timeout', code: 'EPERM', error: 'mock EPERM' }]);
  assert.equal(report.retainedTemporaryRoot, '/mock/tmp/owned-root');
  assert.equal(report.resolved, false);
  assert.equal(exitCode, 1);
  assert.equal(signals.length, 1);
  assert.ok(!removals.some(({ path }) => path === '/mock/tmp/owned-root'));
});

test('timeout cannot pass even with an eventual zero code and screenshot', async () => {
  const { report, exitCode } = await runProbe({ phase: 'timeout' });
  assert.equal(report.probes[1].timedOut, true);
  assert.equal(report.probes[1].status, 'failed');
  assert.equal(report.probes[1].code, 0);
  assert.equal(report.probes[1].signal, 'SIGKILL');
  assert.equal(report.resolved, false);
  assert.equal(exitCode, 1);
});

test('missing screenshot or nonzero code remains failed', async () => {
  for (const options of [{ screenshot: false }, { code: 7 }]) {
    const { report, exitCode } = await runProbe(options);
    assert.equal(report.probes[1].status, 'failed');
    assert.equal(report.probes[1].code, options.code ?? 0);
    assert.equal(report.probes[1].screenshotCreated, options.screenshot ?? true);
    assert.equal(report.resolved, false);
    assert.equal(exitCode, 1);
  }
});

test('unverified lock ownership remains a failure without removing the lock in JavaScript', async () => {
  const { report, exitCode, removals, errors } = await runProbe({ lockOwned: false });
  assert.equal(report.resolved, true);
  assert.equal(exitCode, 1);
  assert.match(errors[0][0], /did not verify ownership/);
  assert.ok(!removals.some(({ path }) => path.includes('validation.lock')));
});
