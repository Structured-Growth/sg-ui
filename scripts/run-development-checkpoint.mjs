import { randomUUID, createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, realpath } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  acquireLease, acquireInstallSlot, releaseLease, assertQueueDrained,
  LEGACY_LOCK, HEAVY_LOCK, runOwnedCommand, sampleResources, assertBudget,
  validateBudget, assertSource, sourceDigest, digestTree, ownedPath,
  prepareSnapshot, runFrozenSnapshot, snapshotCases,
} from './browser-validation-pool.mjs';

const json = async path => JSON.parse(await readFile(path, 'utf8'));
const sha = async path => createHash('sha256').update(await readFile(path)).digest('hex');
const optionalJSON = async path => { try { return await json(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } };
const optionalText = async path => { try { return await readFile(path, 'utf8'); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } };
const children = async path => { try { return await readdir(path); } catch (error) { if (error.code === 'ENOENT') return []; throw error; } };
const consumers = [
  ['foundation-react18', ['scripts/test-foundation-consumer.mjs', '--react18', '--browser']],
  ['foundation-react19', ['scripts/test-foundation-consumer.mjs', '--browser']],
  ['editor-react18', ['scripts/test-editor-consumer.mjs', '--react18']],
  ['editor-react19', ['scripts/test-editor-consumer.mjs']],
  ['next-consumer', ['scripts/test-next-consumer.mjs']],
];

// No scheduler here: the reviewed pool owns admission, monitoring, cancellation
// and settlement directly in this process. Never wrap it in runOwnedCommand.
export async function runCheckpointStages(stages, executeCommand, executePool, onUpdate = async () => {}) {
  const rows = []; let stopped;
  for (const stage of stages) {
    const row = { id: stage.id, kind: stage.kind, status: 'unrun' }; rows.push(row);
    if (stopped) { row.reason = stopped; await onUpdate(rows); continue; }
    row.status = 'running'; row.startedAt = new Date().toISOString();
    await onUpdate(rows);
    try {
      Object.assign(row, await (stage.kind === 'pool' ? executePool(stage) : executeCommand(stage)));
      if (row.status === 'running') row.status = 'passed';
      if (row.status !== 'passed' || row.holds?.length) stopped = `${row.id}: ${row.error ?? row.holds?.join('; ') ?? row.status}`;
    } catch (error) {
      row.status = 'failed'; row.error = error.message;
      row.holds = error.holds ?? (error.ownedCommandUnsettled ? ['owned command group unsettled'] : []);
      stopped = `${row.id}: ${row.error}`;
    } finally { row.finishedAt = new Date().toISOString(); await onUpdate(rows); }
  }
  return rows;
}

export async function runBoundedCommand(command, { budget, timeoutMs, intervalMs = 1000, check = async () => {}, sample = sampleResources, onCommandStart = () => {} }, fixture = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1) throw new Error('Positive bounded command timeout required');
  validateBudget(budget);
  const controller = new AbortController(); let failure, monitoring = Promise.resolve(), active = false;
  const monitor = () => {
    if (active) return;
    active = true;
    monitoring = (async () => { await check(); assertBudget(await sample(), budget); })()
      .catch(error => { failure ??= error; controller.abort(); }).finally(() => { active = false; });
  };
  const cancel = () => { failure ??= new Error('Checkpoint interrupted'); controller.abort(); };
  process.on('SIGINT', cancel); process.on('SIGTERM', cancel);
  let timer, deadline;
  try {
    monitor(); await monitoring;
    if (failure) throw failure;
    timer = setInterval(monitor, intervalMs);
    deadline = setTimeout(() => { failure ??= new Error('Checkpoint command deadline exceeded'); controller.abort(); }, timeoutMs);
    onCommandStart();
    await (fixture.command ?? runOwnedCommand)({ ...command, signal: controller.signal });
    await monitoring;
    if (failure) throw failure;
  } catch (error) {
    if (failure) error.checkpointFailure = failure.message;
    throw error;
  } finally {
    clearInterval(timer); clearTimeout(deadline); await monitoring;
    process.off('SIGINT', cancel); process.off('SIGTERM', cancel);
  }
}

export async function runDevelopmentCheckpoint(config) {
  if (!config || Object.keys(config).some(key => !['plan', 'poolOptions', 'output', 'timeoutMs', 'install'].includes(key))) throw new Error('Unsupported checkpoint configuration; resume/reuse is unavailable');
  const { plan, poolOptions = {}, output = 'artifacts/development-checkpoint', timeoutMs = 3600000, install = false } = config;
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || typeof install !== 'boolean') throw new Error('Invalid checkpoint command bounds/install flag');
  if (Object.keys(poolOptions).some(key => !['queueFile', 'queueOwner', 'max', 'firstPort', 'output', 'budget'].includes(key))) throw new Error('Unsupported pool override; resume/reuse is unavailable');
  // prepareSnapshot validates clean source, exact selectors and ignored output
  // before any command or lease. A resume flag is deliberately unsupported.
  const prepared = await prepareSnapshot(plan, poolOptions.output ?? 'artifacts/browser-pool');
  const { worktree, head } = prepared;
  const poolSHA256 = await sha(new URL('./browser-validation-pool.mjs', import.meta.url));
  if (await sha(join(worktree, 'scripts/browser-validation-pool.mjs')) !== poolSHA256) throw new Error('Target pool differs from the reviewed imported pool');
  const parent = ownedPath(worktree, output);
  await prepareSnapshot(plan, output);
  const evidencePath = join(parent, randomUUID(), 'evidence.json');
  await mkdir(dirname(evidencePath), { recursive: true });
  const owner = `checkpoint:${process.pid}:${randomUUID()}`;
  const queue = poolOptions.queueFile ?? '/tmp/sgui-browser-validation-priority.json';
  if (queue !== '/tmp/sgui-browser-validation-priority.json') throw new Error('Canonical queue required');
  const budget = poolOptions.budget ?? {}; validateBudget(budget);
  const evidence = { owner, head, worktree, sourceDigest: prepared.sourceDigest, node: process.version,
    nodeExecutable: process.execPath, runnerSHA256: await sha(fileURLToPath(import.meta.url)),
    poolSHA256,
    startedAt: new Date().toISOString(), stages: [], status: 'running', scope: 'Coordinator checkpoint; manual/device/AT acceptance pending' };
  const save = () => writeFile(evidencePath, JSON.stringify(evidence, null, 2));
  await save();
  const check = async () => {
    assertSource(worktree, head);
    if (await sourceDigest(worktree) !== prepared.sourceDigest) throw new Error('Frozen source bytes changed');
    await assertQueueDrained(queue, poolOptions.queueOwner);
  };
  const executeCommand = async stage => {
    const leases = []; const row = { executable: stage.executable, argv: stage.args, log: join(dirname(evidencePath), `${stage.id}.log`), leases, holds: [] };
    let unsettled = false, admitted = false;
    try {
      await check();
      leases.push(await acquireLease(LEGACY_LOCK, `${owner}:${stage.id}`));
      leases.push(await acquireLease(HEAVY_LOCK, `${owner}:${stage.id}`));
      if (stage.installer) leases.push(await acquireInstallSlot(`${owner}:${stage.id}`));
      await check();
      await runBoundedCommand({ cwd: worktree, executable: stage.executable, args: stage.args, log: row.log }, { budget, timeoutMs, check, onCommandStart: () => { admitted = true; } });
      row.status = 'passed';
    } catch (error) {
      row.status = 'failed'; row.error = error.message; row.checkpointFailure = error.checkpointFailure;
      unsettled = !!error.ownedCommandUnsettled;
    } finally {
      try { row.resources = await optionalJSON(`${row.log}.resources.json`); }
      catch (error) { row.holds.push(`Unreadable command receipt: ${error.message}`); unsettled = true; }
      if (admitted && row.resources?.settled !== true) unsettled = true;
      if (unsettled) { row.status = 'failed'; row.holds.push('owned command group unsettled; leases retained'); }
      else for (const lease of [...leases].reverse()) {
        try { await releaseLease(lease); }
        catch (error) { row.holds.push(error.message); row.status = 'failed'; }
      }
    }
    return row;
  };
  const executePool = async () => {
    // No outer interval, deadline, AbortController, bridge or child supervisor.
    const before = new Set(await children(prepared.parent));
    const row = { api: 'runFrozenSnapshot', options: poolOptions, holds: [], status: 'passed', runs: [] };
    try { await check(); await runFrozenSnapshot(plan, poolOptions); }
    catch (error) { row.status = 'failed'; row.error = error.message; }
    for (const name of await children(prepared.parent)) {
      if (before.has(name)) continue;
      const path = join(prepared.parent, name, 'evidence.json');
      const pool = await optionalJSON(path);
      if (!pool || pool.head !== head || pool.worktree !== worktree || !pool.owner?.startsWith(`browser-snapshot:${process.pid}:`)) continue;
      row.runs.push({ path, sha256: await sha(path), evidence: pool });
      if (pool.status !== 'passed') row.status = 'failed';
      if (pool.cleanup !== 'owned commands settled' || !pool.finishedAt) row.holds.push(`Pool settlement unresolved: ${path}`);
      // Group disappearance alone cannot attest separately detached web servers.
      if (pool.status !== 'passed') row.holds.push(`Nested server ownership needs coordinator verification: ${pool.owner}`);
    }
    if (row.runs.length !== 1) { row.status = 'failed'; row.holds.push('Missing or ambiguous final pool receipt'); }
    return row;
  };
  try {
    evidence.stages = await runCheckpointStages([
      ...(install ? [{ id: 'install', kind: 'command', executable: 'pnpm', args: ['install', '--frozen-lockfile'], installer: true }] : []),
      { id: 'check', kind: 'command', executable: 'pnpm', args: ['check'] },
      { id: 'complete-browser-matrix', kind: 'pool' },
      ...consumers.map(([id, args]) => ({ id, kind: 'command', executable: process.execPath, args, installer: true })),
    ], executeCommand, executePool, async rows => { evidence.stages = rows; await save(); });
    await check(); evidence.finalSourceDigest = await sourceDigest(worktree);
    evidence.status = evidence.stages.every(row => row.status === 'passed' && !row.holds?.length) ? 'passed' : 'incomplete-or-failed';
  } catch (error) { evidence.status = 'incomplete-or-failed'; evidence.error = error.message; }
  finally { evidence.finishedAt = new Date().toISOString(); await save(); }
  return { evidencePath, evidence };
}

// Read-only reconstruction. Never rebuild, signal a process or release a lease.
export async function createContinuationManifest({ planPath, dailyPath, poolPath, auditPath }) {
  const plan = await json(planPath), daily = await json(dailyPath), pool = await json(poolPath), audit = await json(auditPath);
  if (plan.head !== daily.head || plan.head !== pool.head || plan.worktree !== pool.worktree || daily.cwd !== plan.worktree) throw new Error('Artifact source identity mismatch');
  const run = dirname(poolPath), shards = [];
  for (const shard of plan.shards) {
    const base = join(run, shard.id);
    const paths = { evidence: join(base, 'evidence.json'), results: join(base, 'results.json'), resources: join(base, 'browser.log.resources.json'), owner: join(base, 'owner') };
    const item = await optionalJSON(paths.evidence), results = await optionalJSON(paths.results), receipt = await optionalJSON(paths.resources);
    const ownerToken = await optionalText(paths.owner);
    const row = { ...shard, ownerToken, status: item?.status ?? (receipt ? 'incomplete' : (ownerToken ? 'missing-final-evidence' : 'unrun')), paths, stats: results?.stats ?? null,
      resourceReceipt: receipt ? { processGroup: receipt.processGroup, result: receipt.result, settled: receipt.settled, signalErrors: receipt.signalErrors, commandError: receipt.commandError, durationMs: receipt.durationMs } : null, buildDigest: item?.buildDigest ?? null, hashes: {} };
    for (const [key, path] of Object.entries(paths)) if (key === 'owner' ? ownerToken !== null : await optionalJSON(path)) row.hashes[key] = await sha(path);
    if (item?.status === 'passed') {
      const cases = snapshotCases(results, shard, plan.worktree);
      if (receipt?.result?.code !== 0 || receipt.settled !== true || receipt.result.signal !== null || !Array.isArray(receipt.signalErrors) || receipt.signalErrors.length || receipt.commandError || cases.length !== item.count || JSON.stringify(cases) !== JSON.stringify(item.cases)) throw new Error(`Unattested green shard: ${shard.id}`);
      row.status = 'accepted-green';
    } else if (results && receipt?.result?.code === 0) {
      row.status = 'acceptance-held'; row.heldCases = [];
      const visit = (suites, titles = []) => {
        for (const suite of suites ?? []) {
          const chain = [...titles, suite.title].filter(Boolean);
          for (const spec of suite.specs ?? []) for (const test of spec.tests ?? []) {
            if (test.status !== 'expected') row.heldCases.push({ file: spec.file, title: [...chain, spec.title].join(' '), project: test.projectName, status: test.status });
          }
          visit(suite.suites, chain);
        }
      };
      visit(results.suites);
    }
    shards.push(row);
  }
  const builds = [...new Set(shards.map(row => row.buildDigest).filter(Boolean))];
  if (builds.length !== 1) throw new Error('Missing or conflicting original build attestations');
  const currentBuildDigest = await digestTree(pool.build);
  const currentSourceDigest = await sourceDigest(plan.worktree);
  assertSource(plan.worktree, plan.head);
  const counts = { planned: shards.length, acceptedGreen: shards.filter(row => row.status === 'accepted-green').length,
    completedReports: shards.filter(row => row.stats && row.resourceReceipt?.result?.code === 0).length,
    acceptanceHeld: shards.filter(row => row.status === 'acceptance-held').length,
    incompleteOrUnrun: shards.filter(row => !['accepted-green', 'acceptance-held'].includes(row.status)).length,
    unrunConsumers: daily.commands.filter(row => consumers.some(([id]) => id === row.id) && row.status === 'unrun').length };
  return { mode: 'read-only-continuation-manifest', head: plan.head, worktree: plan.worktree,
    originalBuild: pool.build, attestedBuildDigest: builds[0], currentBuildDigest, sourceDigest: pool.sourceDigest, currentSourceDigest,
    integrityMatches: currentBuildDigest === builds[0] && currentSourceDigest === pool.sourceDigest,
    inputs: await Promise.all(Object.entries({ planPath, dailyPath, poolPath, auditPath }).map(async ([kind, path]) => ({ kind, path, sha256: await sha(path) }))),
    counts, shards, pendingConsumers: daily.commands.filter(row => consumers.some(([id]) => id === row.id) && row.status !== 'passed'),
    ownershipHoldsAtAudit: audit.unresolved, retainedLeaseReceiptsAtAudit: audit.retainedOwnedLeases,
    ownershipNote: 'Historical audit holds; current cleanup is coordinator-owned and not inferred from old receipts.',
    resume: { supported: false, reason: 'runFrozenSnapshot always builds a new Storybook tree; no exported attested-build resume API. Do not execute this manifest or fabricate reuse through fixture seams.' } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [mode, path] = process.argv.slice(2);
  if (!['manifest', 'run'].includes(mode) || !path || process.argv.length !== 4) throw new Error('Usage: node scripts/run-development-checkpoint.mjs manifest|run <config.json>');
  const config = await json(await realpath(path));
  if (mode === 'manifest') console.log(JSON.stringify(await createContinuationManifest(config), null, 2));
  else {
    const result = await runDevelopmentCheckpoint(config);
    console.log(`${result.evidence.status}: ${result.evidencePath}`);
    if (result.evidence.status !== 'passed') process.exitCode = 1;
  }
}
