import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, access, rm, readdir, mkdir, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, basename, isAbsolute } from 'node:path';
import { runCheckpointStages, runBoundedCommand } from './run-development-checkpoint.mjs';
import { runOwnedCommand, acquireLease, releaseLease } from './browser-validation-pool.mjs';
const quiet = async () => ({ load: [0], freeMemoryBytes: 1e9, systemRSSBytes: 0 });
const fixture = async fn => {
  const dir = await mkdtemp(join(tmpdir(), 'sgui-checkpoint-fixture-'));
  try { await fn(dir); } finally {
    const output = process.env.SGUI_CHECKPOINT_FIXTURE_ARTIFACTS;
    if (output) {
      assert.ok(isAbsolute(output));
      const destination = join(output, basename(dir)); await mkdir(destination, { recursive: true });
      for (const name of await readdir(dir)) if (/\.(log|json)$/.test(name)) await copyFile(join(dir, name), join(destination, name));
    }
    await rm(dir, { recursive: true, force: true });
  }
};

test('resource guard aborts a real command and records settled resources', () => fixture(async dir => {
  const ready = join(dir, 'ready'), log = join(dir, 'command.log');
  let breach = false;
  const sample = async () => {
    try { await access(ready); breach = true; } catch {}
    return { ...(await quiet()), load: [breach ? 2 : 0] };
  };
  await assert.rejects(runBoundedCommand({ cwd: dir, executable: process.execPath,
    args: ['-e', `require('fs').writeFileSync(${JSON.stringify(ready)}, 'ready'); setInterval(()=>{},1000)`], log },
  { timeoutMs: 5000, intervalMs: 30, budget: { maxLoad1: 1 }, sample },
  { command: options => runOwnedCommand({ ...options, terminateDelay: 100 }) }), error => {
    assert.match(error.checkpointFailure, /Resource budget/); return true;
  });
  const receipt = JSON.parse(await readFile(`${log}.resources.json`));
  assert.equal(receipt.settled, true); assert.notEqual(receipt.result.code, 0);
}));

test('pool authority completes delayed detached-child cleanup without an outer deadline', () => fixture(async dir => {
  const done = join(dir, 'done'), log = join(dir, 'supervisor.log');
  // Real inert supervisor owns a separately detached child. It takes longer than
  // the old 3-second outer grace to clean it and only then returns red evidence.
  const script = `const {spawn}=require('child_process');
    const child=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{detached:true,stdio:'ignore'});
    setTimeout(()=>{child.kill('SIGTERM'); child.once('exit',()=>{require('fs').writeFileSync(${JSON.stringify(done)},'settled'); process.exitCode=7;});},3200);`;
  const rows = await runCheckpointStages([{ id: 'pool', kind: 'pool' }, { id: 'later', kind: 'command' }],
    async () => assert.fail('later command admitted'),
    async () => {
      // The command here represents the fixture supervisor, not production pool
      // wrapping. No checkpoint guard or timeout is passed to this authority.
      await runOwnedCommand({ cwd: dir, executable: process.execPath, args: ['-e', script], log, terminateDelay: 100 });
    });
  assert.equal(await readFile(done, 'utf8'), 'settled');
  assert.equal(rows[0].status, 'failed'); assert.match(rows[0].error, /7\/null/);
  assert.equal(rows[1].status, 'unrun');
}));

test('command deadline bounds a real SIGTERM-resistant child', () => fixture(async dir => {
  const log = join(dir, 'timeout.log');
  await assert.rejects(runBoundedCommand({ cwd: dir, executable: process.execPath,
    args: ['-e', "process.on('SIGTERM',()=>{});setInterval(()=>{},1000)"], log },
  { timeoutMs: 300, budget: {}, sample: quiet },
  { command: options => runOwnedCommand({ ...options, terminateDelay: 100 }) }),
  error => error.checkpointFailure === 'Checkpoint command deadline exceeded');
  assert.equal(JSON.parse(await readFile(`${log}.resources.json`)).settled, true);
}));

test('unverifiable group retains owner lease and stops admission', () => fixture(async dir => {
  const lease = await acquireLease(join(dir, 'lease'), 'fixture-owner');
  const log = join(dir, 'unsettled.log');
  const rows = await runCheckpointStages([{ id: 'command', kind: 'command' }, { id: 'pool', kind: 'pool' }],
    async () => {
      try {
        await runOwnedCommand({ cwd: dir, executable: process.execPath, args: ['-e', 'process.exit(2)'], log, terminateDelay: 30 }, {
          kill: (group, signal) => {
            if (signal === 0) { const error = new Error('fixture unverifiable probe'); error.code = 'EPERM'; throw error; }
            return process.kill(group, signal);
          },
        });
      } catch (error) { if (!error.ownedCommandUnsettled) await releaseLease(lease); throw error; }
    }, async () => assert.fail('pool admitted after unsettled command'));
  assert.equal(rows[0].status, 'failed'); assert.match(rows[0].holds[0], /unsettled/);
  assert.equal(rows[1].status, 'unrun');
  assert.equal(await readFile(join(lease.path, 'owner'), 'utf8'), 'fixture-owner');
  await writeFile(join(dir, 'retained-lease.json'), JSON.stringify(lease));
  const receipt = JSON.parse(await readFile(`${log}.resources.json`));
  assert.equal(receipt.settled, false); assert.ok(receipt.signalErrors.some(row => row.code === 'EPERM'));
  // The fixture command exited; only injected probes were unverifiable. Explicit
  // fixture-owner cleanup is separate from the runner's retained evidence.
  assert.throws(() => process.kill(-receipt.processGroup, 0), error => error.code === 'ESRCH');
  await releaseLease(lease);
}));

test('pool retention outcome remains distinct from accepted prior stages', async () => {
  const rows = await runCheckpointStages([{ id: 'check', kind: 'command' }, { id: 'pool', kind: 'pool' }, { id: 'consumer', kind: 'command' }],
    async () => ({ status: 'passed', resources: { settled: true, result: { code: 0 } } }),
    async () => ({ status: 'failed', error: 'resource ceiling', holds: ['nested servers need owner verification'], runs: ['receipt'] }));
  assert.deepEqual(rows.map(row => row.status), ['passed', 'failed', 'unrun']);
  assert.deepEqual(rows[1].runs, ['receipt']); assert.equal(rows[1].holds.length, 1);
});

test('unsupported resume fails before admission or source/output access', async () => {
  const { runDevelopmentCheckpoint } = await import('./run-development-checkpoint.mjs');
  await assert.rejects(runDevelopmentCheckpoint({ resume: { build: '/foreign/build' } }), /resume\/reuse is unavailable/);
  await assert.rejects(runDevelopmentCheckpoint({ poolOptions: { build: '/foreign/build' } }), /resume\/reuse is unavailable/);
});

test('stage receipts persist running and terminal outcomes before later admission', async () => {
  const observations = [];
  await runCheckpointStages([{ id: 'first', kind: 'command' }, { id: 'second', kind: 'pool' }],
    async () => ({ status: 'passed' }), async () => { throw new Error('pool red'); },
    async rows => observations.push(rows.map(row => `${row.id}:${row.status}`)));
  assert.deepEqual(observations, [['first:running'], ['first:passed'], ['first:passed', 'second:running'], ['first:passed', 'second:failed']]);
});

test('manifest preserves held reports, verifies attested bytes and rejects false green', () => fixture(async dir => {
  const { execFileSync } = await import('node:child_process');
  const { mkdir } = await import('node:fs/promises');
  const { createContinuationManifest } = await import('./run-development-checkpoint.mjs');
  const { sourceDigest, digestTree, snapshotCases } = await import('./browser-validation-pool.mjs');
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim();
  await writeFile(join(dir, 'source'), 'frozen'); await writeFile(join(dir, '.gitignore'), 'artifacts/\n');
  git('init', '-q'); git('add', '.'); git('-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'fixture');
  const head = git('rev-parse', 'HEAD'), run = join(dir, 'artifacts/run'), build = join(run, 'storybook');
  await mkdir(build, { recursive: true }); await writeFile(join(build, 'index.html'), 'original frozen build');
  const buildDigest = await digestTree(build), source = await sourceDigest(dir);
  const shards = ['green', 'held', 'pending'].map(id => ({ id, specs: [`tests/browser/${id}.spec.ts`], project: 'chromium' }));
  const write = async (path, value) => writeFile(path, JSON.stringify(value));
  const paths = { planPath: join(run, 'plan.json'), dailyPath: join(run, 'daily.json'), poolPath: join(run, 'evidence.json'), auditPath: join(run, 'audit.json') };
  await write(paths.planPath, { worktree: dir, head, shards });
  await write(paths.dailyPath, { cwd: dir, head, commands: [{ id: 'next-consumer', status: 'unrun' }] });
  await write(paths.poolPath, { worktree: dir, head, build, sourceDigest: source });
  await write(paths.auditPath, { unresolved: { leasesCount: 1 }, retainedOwnedLeases: [{ owner: 'original' }] });
  for (const shard of shards.slice(0, 2)) {
    const base = join(run, shard.id); await mkdir(base);
    const report = { config: { rootDir: join(dir, 'tests/browser') }, errors: [],
      stats: { expected: 1, skipped: 0, flaky: 0, unexpected: 0 },
      suites: [{ title: '', specs: [{ title: 'case', file: `${shard.id}.spec.ts`, id: shard.id, tags: [],
        tests: [{ projectName: 'chromium', status: 'expected', results: [{ status: 'passed', retry: 0 }] }] }] }] };
    const cases = snapshotCases(report, shard, dir);
    if (shard.id === 'held') { report.stats.skipped = 1; report.stats.expected = 0; report.suites[0].specs[0].tests[0].status = 'skipped'; }
    await write(join(base, 'results.json'), report);
    await write(join(base, 'evidence.json'), { status: shard.id === 'green' ? 'passed' : 'failed', buildDigest, count: 1, cases });
    await write(join(base, 'browser.log.resources.json'), { settled: true, result: { code: 0, signal: null }, signalErrors: [] });
  }
  const manifest = await createContinuationManifest(paths);
  assert.deepEqual(manifest.counts, { planned: 3, acceptedGreen: 1, completedReports: 2, acceptanceHeld: 1, incompleteOrUnrun: 1, unrunConsumers: 1 });
  assert.equal(manifest.integrityMatches, true); assert.equal(manifest.resume.supported, false);
  assert.equal(manifest.retainedLeaseReceiptsAtAudit[0].owner, 'original');
  await mkdir(join(run, 'pending')); await writeFile(join(run, 'pending/owner'), 'original:pending');
  const pending = (await createContinuationManifest(paths)).shards.find(row => row.id === 'pending');
  assert.equal(pending.status, 'missing-final-evidence'); assert.equal(pending.ownerToken, 'original:pending');
  await writeFile(join(build, 'index.html'), 'mutated bytes');
  assert.equal((await createContinuationManifest(paths)).integrityMatches, false);
  const bad = JSON.parse(await readFile(join(run, 'green/results.json'))); bad.stats.skipped = 1;
  await write(join(run, 'green/results.json'), bad);
  await assert.rejects(createContinuationManifest(paths), /skipped/);
}));
