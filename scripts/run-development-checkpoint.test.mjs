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
    const { chmod } = await import('node:fs/promises');
    const writable = async path => { await chmod(path, 0o755); for (const entry of await readdir(path, { withFileTypes: true })) if (entry.isDirectory()) await writable(join(path, entry.name)); };
    await writable(dir);
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

// Production entry point exercised with an inert executable named pnpm on a
// temporary PATH. No exported fixture seam can authorize build reuse.
async function continuationFixture(dir, { newSpec = false } = {}) {
  const { execFileSync } = await import('node:child_process');
  const { realpath, chmod } = await import('node:fs/promises');
  const { fileURLToPath } = await import('node:url');
  const { createHash } = await import('node:crypto');
  const { sourceDigest, digestTree, snapshotCases } = await import('./browser-validation-pool.mjs');
  dir = await realpath(dir);
  const original = join(dir, 'original'), candidate = join(dir, 'candidate');
  await mkdir(original);
  const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  await mkdir(join(original, 'scripts')); await mkdir(join(original, 'tests/browser'), { recursive: true }); await mkdir(join(original, 'src'));
  for (const name of ['browser-validation-pool.mjs', 'run-development-checkpoint.mjs', 'serve-browser-storybook.mjs']) await copyFile(fileURLToPath(new URL(`./${name}`, import.meta.url)), join(original, 'scripts', name));
  await writeFile(join(original, '.gitignore'), 'artifacts/\n'); await writeFile(join(original, 'pnpm-lock.yaml'), 'fixture lock');
  await writeFile(join(original, 'playwright.config.ts'), 'workers: 1, retries: 0, reuseExistingServer: false SGUI_BROWSER_PORT SGUI_BROWSER_RESULTS_FILE');
  await writeFile(join(original, 'src/production.ts'), 'export const production = true;');
  const shards = ['green', 'canceled', 'unrun'].map(id => ({ id, specs: [`tests/browser/${id}.spec.ts`], project: 'chromium' }));
  for (const shard of shards) await writeFile(join(original, shard.specs[0]), `// ${shard.id}`);
  git(original, 'init', '-q'); git(original, 'add', '.'); git(original, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'original');
  const originalHead = git(original, 'rev-parse', 'HEAD');
  git(original, 'worktree', 'add', '--detach', candidate, originalHead);
  const deltaPath = newSpec ? 'tests/browser/new.spec.ts' : 'src/driver.test.ts';
  await writeFile(join(candidate, deltaPath), '// reviewed new driver');
  git(candidate, 'add', '.'); git(candidate, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'candidate');
  const selected = newSpec ? { id: 'new', specs: [deltaPath], project: 'chromium' } : shards[2];
  const run = join(original, 'artifacts/run'), build = join(run, 'storybook');
  await mkdir(build, { recursive: true }); await writeFile(join(build, 'iframe.html'), 'retained build');
  const buildDigest = await digestTree(build, true), originalSource = await sourceDigest(original);
  const owner = 'browser-snapshot:fixture:original';
  const paths = { planPath: join(run, 'plan.json'), dailyPath: join(run, 'daily.json'), poolPath: join(run, 'evidence.json'), auditPath: join(run, 'audit.json') };
  const write = async (path, value) => writeFile(path, JSON.stringify(value));
  const report = (shard, root) => ({ config: { rootDir: join(root, 'tests/browser') }, errors: [], stats: { expected: 1, skipped: 0, unexpected: 0, flaky: 0 }, suites: [{ title: '', specs: [{ title: 'case', file: basename(shard.specs[0]), id: `${shard.id}-case`, tags: [], tests: [{ projectName: 'chromium', status: 'expected', results: [{ status: 'passed', retry: 0 }] }] }] }] });
  const greenReport = report(shards[0], original), greenCases = snapshotCases(greenReport, shards[0], original);
  const receipt = { settled: true, result: { code: 0, signal: null }, signalErrors: [], ownershipErrors: [], processGroup: 999999991 };
  const commands = [];
  for (const [name, args] of [['build', ['pnpm', 'exec', 'storybook', 'build', '--output-dir', build]], ['types', ['pnpm', 'exec', 'tsc', '--noEmit', '-p', 'tests/browser/tsconfig.json']]]) {
    const log = join(run, `${name}.log`); await writeFile(log, 'successful original setup'); await write(`${log}.resources.json`, receipt); commands.push({ args, log });
  }
  const checkLog = join(run, 'check.log'); await writeFile(checkLog, 'original check'); await write(`${checkLog}.resources.json`, receipt);
  await write(paths.planPath, { mode: 'snapshot', worktree: original, head: originalHead, shards });
  await write(paths.dailyPath, { worktree: original, head: originalHead, stages: [{ id: 'check', status: 'passed', log: checkLog }, { id: 'next-consumer', status: 'unrun' }] });
  const sessions = [];
  for (const shard of shards.slice(0, 2)) {
    const base = join(run, shard.id); await mkdir(base);
    await writeFile(join(base, 'owner'), `${owner}:${shard.id}`);
    const item = { ...shard, status: shard.id === 'green' ? 'passed' : 'failed', buildDigest, ...(shard.id === 'green' ? { cases: greenCases, count: 1 } : {}) };
    await write(join(base, 'evidence.json'), item); sessions.push(item);
    await write(join(base, 'browser.log.resources.json'), { ...receipt, processGroup: shard.id === 'green' ? 999999992 : 999999993, ...(shard.id === 'canceled' ? { result: { code: null, signal: 'SIGTERM' } } : {}) });
    if (shard.id === 'green') await write(join(base, 'results.json'), greenReport);
  }
  await write(paths.poolPath, { owner, head: originalHead, worktree: original, build, buildDigest, sourceDigest: originalSource, finalSourceDigest: originalSource, status: 'failed', commands, sessions });
  const audit = { owner, settled: true, unresolved: [], groups: [{ shard: 'green', id: 999999992, status: 'absent' }, { shard: 'canceled', id: 999999993, status: 'absent' }], servers: [], ports: [], leases: [] };
  await write(paths.auditPath, audit);
  const pins = [];
  async function pinTree(path) { for (const name of await readdir(path, { withFileTypes: true })) { const file = join(path, name.name); if (name.isDirectory()) { if (name.name !== 'storybook') await pinTree(file); } else pins.push({ path: file, sha256: createHash('sha256').update(await readFile(file)).digest('hex') }); } }
  await pinTree(run);
  const request = { original: paths, pins, candidate: { worktree: candidate, head: git(candidate, 'rev-parse', 'HEAD'), sourceDigest: await sourceDigest(candidate) },
    deltas: [{ path: deltaPath, kind: newSpec ? 'new-spec' : 'test', before: null, after: createHash('sha256').update(await readFile(join(candidate, deltaPath))).digest('hex') }], shards: [selected], expectedCases: { [selected.id]: snapshotCases(report(selected, candidate), selected, candidate) }, history: [] };
  const bin = join(dir, 'bin'); await mkdir(bin);
  const fake = join(bin, 'pnpm');
  await writeFile(fake, `#!${process.execPath}\nconst fs=require('fs');const a=process.argv.slice(2);\nif(a.includes('build'))throw Error('forbidden build callback');\nif(a[0]==='--version'||a.includes('--version'))console.log('fixture-version');\nelse {fs.appendFileSync(${JSON.stringify(join(dir, 'commands.log'))},JSON.stringify(a)+'\\n');if(a.includes('playwright'))fs.writeFileSync(process.env.SGUI_BROWSER_RESULTS_FILE,${JSON.stringify(JSON.stringify(report(selected, candidate)))});}\n`);
  await chmod(fake, 0o755);
  const queueFile = join(dir, 'queue.json'); await write(queueFile, []);
  const runtime = { queueFile, bridgePath: join(dir, 'bridge'), heavyPath: join(dir, 'heavy'), lightRoot: join(dir, 'light'), poolRoot: join(dir, 'pool'), versions: { pnpm: 'fixture', playwright: 'fixture' } };
  return { runtime, request, candidate, original, run, build, audit, paths, bin, write, git, commandsLog: join(dir, 'commands.log'), sourceDigest, hash: async path => createHash('sha256').update(await readFile(path)).digest('hex') };
}

const continuationOptions = { max: 2, budget: { maxLoad1: 24, maxSystemRSSMiB: 28000 } };

test('continuation rejects green reruns, tampered/missing pins, illegal source deltas and unsettled cleanup before admission', () => fixture(async dir => {
  const f = await continuationFixture(dir);
  const { prepareFrozenContinuation } = await import('./run-development-checkpoint.mjs');
  await prepareFrozenContinuation(f.request);
  const clone = () => structuredClone(f.request);
  let bad = clone(); bad.shards = [{ id: 'green', specs: ['tests/browser/green.spec.ts'], project: 'chromium' }]; bad.expectedCases = { green: [{ file: 'tests/browser/green.spec.ts', id: 'green-case', project: 'chromium', title: 'chromium case' }] };
  await assert.rejects(prepareFrozenContinuation(bad), /green.*rerun/);
  bad = clone(); bad.pins[0].sha256 = '0'.repeat(64); await assert.rejects(prepareFrozenContinuation(bad), /tampered/);
  bad = clone(); bad.pins.pop(); await assert.rejects(prepareFrozenContinuation(bad), /Missing.*pin/);
  bad = clone(); bad.candidate.head = '0'.repeat(40); await assert.rejects(prepareFrozenContinuation(bad), /Head mismatch/);
  bad = clone(); bad.candidate.sourceDigest = '0'.repeat(64); await assert.rejects(prepareFrozenContinuation(bad), /source digest/);
  bad = clone(); bad.unknown = true; await assert.rejects(prepareFrozenContinuation(bad), /Unknown/);
  await f.write(f.paths.auditPath, { ...f.audit, unresolved: ['unverified detached server'] });
  bad = clone(); bad.pins.find(row => row.path === f.paths.auditPath).sha256 = await f.hash(f.paths.auditPath);
  await assert.rejects(prepareFrozenContinuation(bad), /Unsettled/);
  await f.write(f.paths.auditPath, f.audit);
  await writeFile(join(f.candidate, 'src/production.ts'), 'export const production = false;'); f.git(f.candidate, 'add', '.'); f.git(f.candidate, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'illegal');
  bad = clone(); bad.candidate.head = f.git(f.candidate, 'rev-parse', 'HEAD'); bad.candidate.sourceDigest = await f.sourceDigest(f.candidate);
  bad.deltas.push({ path: 'src/production.ts', kind: 'test', before: await f.hash(join(f.original, 'src/production.ts')), after: await f.hash(join(f.candidate, 'src/production.ts')) });
  await assert.rejects(prepareFrozenContinuation(bad), /illegal source delta/);
  await assert.rejects(access(f.commandsLog), { code: 'ENOENT' });
}));

test('production continuation reuses immutable bytes without build/types and rejects unknown prior claims', () => fixture(async dir => {
  const f = await continuationFixture(dir), { runFrozenContinuation, assertQueueDrained, LEGACY_LOCK } = await import('./browser-validation-pool.mjs');
  // Fixture-only resource isolation; production authentication still runs.
  await assertQueueDrained(f.runtime.queueFile);
  const before = await f.hash(join(f.build, 'iframe.html'));
  const oldPath = process.env.PATH; process.env.PATH = `${f.bin}:${oldPath}`;
  let run;
  try { run = await runFrozenContinuation(f.request, { ...continuationOptions, queueOwner: process.env.SGUI_CONTINUATION_FIXTURE_OWNER, firstPort: 16473 }, f.runtime); }
  finally { process.env.PATH = oldPath; }
  const evidence = JSON.parse(await readFile(join(run, 'evidence.json')));
  assert.equal(evidence.mode, 'continuation'); assert.equal(evidence.status, 'passed'); assert.equal(evidence.build, f.build);
  assert.equal(evidence.buildCommands, 0); assert.equal(evidence.typecheckCount, 0); assert.equal(evidence.passedCases, 1);
  assert.equal(evidence.continuation.originalCounts.acceptedGreen, 1); assert.equal(evidence.cleanup, 'owned commands settled');
  assert.equal(await f.hash(join(f.build, 'iframe.html')), before);
  const commands = (await readFile(f.commandsLog, 'utf8')).trim().split('\n').map(JSON.parse);
  assert.equal(commands.length, 1); assert.equal(commands[0][1], 'playwright');
  const receipt = JSON.parse(await readFile(join(run, 'unrun/browser.log.resources.json'))); assert.equal(receipt.settled, true);
  assert.throws(() => process.kill(-receipt.processGroup, 0), { code: 'ESRCH' });
  await assert.rejects(access(f.runtime.bridgePath), { code: 'ENOENT' });
  const { prepareFrozenContinuation } = await import('./run-development-checkpoint.mjs');
  await assert.rejects(prepareFrozenContinuation(f.request), /Unknown continuation claim/);
  await assert.rejects(runFrozenContinuation(f.request, { ...continuationOptions, fixture: {} }), /Ambiguous/);
}));

test('new reviewed spec gets exactly one typecheck; build mutation and relaxed budgets refuse reuse', () => fixture(async dir => {
  const f = await continuationFixture(dir, { newSpec: true });
  const { runFrozenContinuation } = await import('./browser-validation-pool.mjs');
  const { prepareFrozenContinuation } = await import('./run-development-checkpoint.mjs');
  await assert.rejects(runFrozenContinuation(f.request, { max: 9, budget: continuationOptions.budget }), /max <= 8/);
  await assert.rejects(runFrozenContinuation(f.request, { max: 2, budget: {} }), /load 24/);
  const oldPath = process.env.PATH; process.env.PATH = `${f.bin}:${oldPath}`;
  let run;
  try { run = await runFrozenContinuation(f.request, { ...continuationOptions, queueOwner: process.env.SGUI_CONTINUATION_FIXTURE_OWNER, firstPort: 16473 }, f.runtime); }
  finally { process.env.PATH = oldPath; }
  const evidence = JSON.parse(await readFile(join(run, 'evidence.json'))); assert.equal(evidence.typecheckCount, 1); assert.equal(evidence.buildCommands, 0);
  const commands = (await readFile(f.commandsLog, 'utf8')).trim().split('\n').map(JSON.parse); assert.equal(commands.length, 2); assert.equal(commands[0][1], 'tsc');
  const { chmod } = await import('node:fs/promises'); await chmod(join(f.build, 'iframe.html'), 0o644); await writeFile(join(f.build, 'iframe.html'), 'tampered');
  await assert.rejects(prepareFrozenContinuation(f.request), /source\/build mismatch/);
}));
