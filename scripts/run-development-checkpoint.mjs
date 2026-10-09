import { execFileSync } from 'node:child_process';
import { randomUUID, createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, realpath, lstat } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  acquireLease, acquireInstallSlot, releaseLease, assertQueueDrained,
  LEGACY_LOCK, HEAVY_LOCK, runOwnedCommand, sampleResources, assertBudget,
  validateBudget, assertSource, sourceDigest, digestTree, ownedPath,
  prepareSnapshot, runFrozenSnapshot, runFrozenContinuation, snapshotCases, assertPortFree,
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
  if (plan.head !== daily.head || plan.head !== pool.head || plan.worktree !== pool.worktree || (daily.cwd ?? daily.worktree) !== plan.worktree) throw new Error('Artifact source identity mismatch');
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
    unrunConsumers: (daily.commands ?? daily.stages).filter(row => consumers.some(([id]) => id === row.id) && row.status === 'unrun').length };
  return { mode: 'read-only-continuation-manifest', head: plan.head, worktree: plan.worktree,
    originalBuild: pool.build, attestedBuildDigest: builds[0], currentBuildDigest, sourceDigest: pool.sourceDigest, currentSourceDigest,
    integrityMatches: currentBuildDigest === builds[0] && currentSourceDigest === pool.sourceDigest,
    inputs: await Promise.all(Object.entries({ planPath, dailyPath, poolPath, auditPath }).map(async ([kind, path]) => ({ kind, path, sha256: await sha(path) }))),
    counts, shards, pendingConsumers: (daily.commands ?? daily.stages).filter(row => consumers.some(([id]) => id === row.id) && row.status !== 'passed'),
    ownershipHoldsAtAudit: audit.unresolved, retainedLeaseReceiptsAtAudit: audit.retainedOwnedLeases,
    ownershipNote: 'Historical audit holds; current cleanup is coordinator-owned and not inferred from old receipts.',
    resume: { supported: false, reason: 'runFrozenSnapshot always builds a new Storybook tree; no exported attested-build resume API. Do not execute this manifest or fabricate reuse through fixture seams.' } };
}

// Reviewed pins are caller-supplied trust anchors, not signatures. Every read used
// for admission must be pinned; path categories never substitute for byte review.
const strict = (value, keys) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !keys.includes(key))) throw new Error('Unknown continuation claims');
};
const hashBytes = bytes => createHash('sha256').update(bytes).digest('hex');
const caseKey = row => JSON.stringify([row.file, row.project, row.title]);
const gitBytes = (cwd, ...args) => execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });

export async function prepareFrozenContinuation(request) {
  strict(request, ['original', 'pins', 'candidate', 'deltas', 'shards', 'expectedCases', 'history']);
  strict(request.original, ['planPath', 'dailyPath', 'poolPath', 'auditPath']);
  strict(request.candidate, ['worktree', 'head', 'sourceDigest']);
  if (!Array.isArray(request.pins) || !Array.isArray(request.deltas) || !Array.isArray(request.history)) throw new Error('Explicit pins, reviewed deltas and history required');
  const pins = new Map();
  for (const pin of request.pins) {
    strict(pin, ['path', 'sha256']);
    if (typeof pin.path !== 'string' || pins.has(pin.path) || !/^[a-f0-9]{64}$/.test(pin.sha256)) throw new Error('Invalid or duplicate evidence pin');
    pins.set(pin.path, pin.sha256);
  }
  const used = new Set();
  const verify = async path => {
    if (!pins.has(path) || await realpath(path) !== path || await sha(path) !== pins.get(path)) throw new Error(`Missing or tampered evidence pin: ${path}`);
    used.add(path);
  };
  for (const path of Object.values(request.original)) await verify(path);
  const manifest = await createContinuationManifest(request.original);
  if (!manifest.integrityMatches) throw new Error('Original source/build mismatch');
  if (manifest.originalBuild !== join(dirname(request.original.poolPath), 'storybook') || await realpath(manifest.originalBuild) !== manifest.originalBuild) throw new Error('Foreign/symlinked original build');
  const immutable = async path => {
    const info = await lstat(path);
    if (info.isSymbolicLink() || info.mode & 0o222 || (!info.isFile() && !info.isDirectory())) throw new Error('Original build is not immutable');
    if (info.isDirectory()) for (const name of await readdir(path)) await immutable(join(path, name));
  };
  await immutable(manifest.originalBuild);
  const pool = await json(request.original.poolPath), daily = await json(request.original.dailyPath), audit = await json(request.original.auditPath);
  if (!pool.owner || audit.owner !== pool.owner || audit.settled !== true || !Array.isArray(audit.unresolved) || audit.unresolved.length ||
      (audit.retainedOwnedLeases?.length ?? 0) || !Array.isArray(audit.groups) || !Array.isArray(audit.servers) || !Array.isArray(audit.ports) || !Array.isArray(audit.leases) ||
      audit.leases.some(row => row.owner?.startsWith(pool.owner)) || audit.groups.some(row => row.status !== 'absent') || audit.servers.some(row => row.status !== 'absent' || row.groupProbe?.status !== 'absent') || audit.ports.some(row => row.status !== 'free')) throw new Error('Unsettled original cleanup ownership');
  if (pool.finalSourceDigest !== pool.sourceDigest || pool.buildDigest !== manifest.attestedBuildDigest ||
      (pool.integrityError && pool.integrityError !== pool.resourceError)) throw new Error('Original integrity failure');
  const passReceipt = async log => {
    await verify(log); await verify(`${log}.resources.json`);
    const receipt = await json(`${log}.resources.json`);
    if (receipt.settled !== true || receipt.result?.code !== 0 || receipt.result.signal !== null || !Array.isArray(receipt.signalErrors) || receipt.signalErrors.length || receipt.commandError || receipt.ownershipErrors?.length) throw new Error('Unattested setup/history command');
  };
  const setupArgs = [
    ['pnpm', 'exec', 'storybook', 'build', '--output-dir', pool.build],
    ['pnpm', 'exec', 'tsc', '--noEmit', '-p', 'tests/browser/tsconfig.json'],
  ];
  for (const args of setupArgs) {
    const rows = pool.commands?.filter(row => JSON.stringify(row.args) === JSON.stringify(args));
    if (rows?.length !== 1) throw new Error('Missing or ambiguous original setup');
    await passReceipt(rows[0].log);
  }
  const checkStage = (daily.commands ?? daily.stages)?.find(row => row.id === 'check');
  if (checkStage?.status !== 'passed' || checkStage.holds?.length) throw new Error('Original check prerequisite failed');
  await passReceipt(checkStage.log);
  const accepted = new Set();
  for (const row of manifest.shards) {
    for (const key of Object.keys(row.hashes)) await verify(row.paths[key]);
    const session = pool.sessions?.find(item => item.id === row.id);
    if (row.ownerToken && row.ownerToken !== `${pool.owner}:${row.id}`) throw new Error('Original shard owner mismatch');
    if (session && (JSON.stringify(session.specs) !== JSON.stringify(row.specs) || JSON.stringify(session.project) !== JSON.stringify(row.project) || (session.grep ?? null) !== (row.grep ?? null))) throw new Error('Original shard selection mismatch');
    if (row.status === 'accepted-green') {
      if (!session || session.status !== 'passed' || session.count !== (await json(row.paths.evidence)).count || JSON.stringify(session.cases) !== JSON.stringify((await json(row.paths.evidence)).cases) || row.buildDigest !== pool.buildDigest) throw new Error('Original green aggregate mismatch');
      for (const item of (await json(row.paths.evidence)).cases) accepted.add(caseKey(item));
    } else if (row.status !== 'unrun' && !(row.status === 'failed' && row.resourceReceipt && (row.resourceReceipt.result?.signal || Number.isInteger(row.resourceReceipt.result?.code) && row.resourceReceipt.result.code !== 0))) throw new Error('Only canceled/unrun original shards are eligible');
    if (row.resourceReceipt && !audit.groups.some(item => item.shard === row.id && item.id === row.resourceReceipt.processGroup)) throw new Error('Missing original shard group audit');
  }
  const worktree = await realpath(request.candidate.worktree), head = request.candidate.head;
  if (worktree === manifest.worktree) throw new Error('Continuation requires separate candidate checkout');
  assertSource(worktree, head);
  if (await sourceDigest(worktree) !== request.candidate.sourceDigest) throw new Error('Candidate source digest mismatch');
  const oldFiles = gitBytes(worktree, 'ls-tree', '-r', '--name-only', '-z', manifest.head).toString().split('\0').filter(Boolean);
  const newFiles = gitBytes(worktree, 'ls-files', '-z').toString().split('\0').filter(Boolean);
  const changes = new Map();
  for (const file of new Set([...oldFiles, ...newFiles])) {
    const before = oldFiles.includes(file) ? hashBytes(gitBytes(worktree, 'show', `${manifest.head}:${file}`)) : null;
    const after = newFiles.includes(file) ? await sha(join(worktree, file)) : null;
    if (before !== after) changes.set(file, { before, after });
  }
  const deltas = new Map();
  for (const delta of request.deltas) {
    strict(delta, ['path', 'kind', 'before', 'after']);
    const supervisors = ['scripts/browser-validation-pool.mjs', 'scripts/run-development-checkpoint.mjs', 'scripts/serve-browser-storybook.mjs'];
    const allowed = delta.kind === 'supervisor' ? supervisors.includes(delta.path) : delta.kind === 'documentation' ? /^docs\/.+\.md$/.test(delta.path) :
      delta.kind === 'test' ? /^(?:src\/.+\.test\.[cm]?[jt]sx?|scripts\/.+\.test\.mjs|tests\/consumers\/[^/]+\.(?:tsx|tsconfig\.json))$/.test(delta.path) :
      delta.kind === 'new-spec' ? /^tests\/browser\/[a-zA-Z0-9_-]+\.spec\.ts$/.test(delta.path) && delta.before === null : false;
    if (!allowed || !delta.after || deltas.has(delta.path) || JSON.stringify(changes.get(delta.path)) !== JSON.stringify({ before: delta.before, after: delta.after })) throw new Error(`Unreviewed/illegal source delta: ${delta.path}`);
    deltas.set(delta.path, delta);
  }
  if (deltas.size !== changes.size) throw new Error('Source changes missing from reviewed delta manifest');
  // The module actually executing, including the detached-server helper, must be
  // the reviewed candidate bytes rather than an unrelated supervisor checkout.
  for (const file of ['browser-validation-pool.mjs', 'run-development-checkpoint.mjs', 'serve-browser-storybook.mjs']) {
    if (await sha(new URL(`./${file}`, import.meta.url)) !== await sha(join(worktree, 'scripts', file))) throw new Error('Executing supervisor differs from candidate');
  }
  const plan = { mode: 'snapshot', worktree, head, shards: request.shards };
  await prepareSnapshot(plan, 'artifacts/browser-continuation');
  const histories = new Set();
  for (const entry of request.history) {
    strict(entry, ['path', 'sha256']);
    if (histories.has(entry.path) || pins.get(entry.path) !== entry.sha256) throw new Error('Invalid continuation history');
    histories.add(entry.path); await verify(entry.path);
    const prior = await json(entry.path);
    if (prior.mode !== 'continuation' || prior.buildDigest !== pool.buildDigest || prior.continuation?.originalPoolSHA256 !== pins.get(request.original.poolPath) || prior.cleanup !== 'owned commands settled' || prior.status !== 'passed' || !prior.finishedAt) throw new Error('Unsettled/mismatched continuation history');
    if (prior.typecheckCount === 1) await passReceipt(join(dirname(entry.path), 'types.log'));
    for (const item of prior.sessions) {
      const evidencePath = join(item.session, 'evidence.json'), resultsPath = join(item.session, 'results.json');
      await verify(evidencePath); await verify(join(item.session, 'owner'));
      if (await readFile(join(item.session, 'owner'), 'utf8') !== `${prior.owner}:${item.id}`) throw new Error('History owner mismatch');
      const actual = await json(evidencePath);
      if (JSON.stringify(actual) !== JSON.stringify(item)) throw new Error('History session mismatch');
      if (item.status === 'passed') {
        await verify(resultsPath); await passReceipt(join(item.session, 'browser.log'));
        const cases = snapshotCases(await json(resultsPath), { ...item, grep: item.grep ?? undefined }, prior.worktree);
        if (JSON.stringify(cases) !== JSON.stringify(item.cases) || cases.length !== item.count) throw new Error('Unattested history green');
        for (const row of cases) accepted.add(caseKey(row));
      } else throw new Error('Failed continuation history requires a separate settled audit; unsupported');
    }
  }
  // Unknown prior claims in this candidate's fixed output root block admission.
  for (const name of await children(join(worktree, 'artifacts/browser-continuation'))) {
    const path = join(worktree, 'artifacts/browser-continuation', name, 'evidence.json');
    if (!histories.has(path)) throw new Error(`Unknown continuation claim: ${path}`);
  }
  strict(request.expectedCases, request.shards.map(row => row.id));
  const planned = new Set();
  for (const shard of request.shards) {
    const originalRows = manifest.shards.filter(row => shard.specs.some(file => row.specs.includes(file)));
    if (originalRows.some(row => row.status === 'accepted-green' || row.status === 'acceptance-held')) throw new Error('Accepted-green/held shard rerun refused');
    for (const file of shard.specs) {
      const original = originalRows.find(row => row.specs.includes(file));
      const projects = Array.isArray(shard.project) ? shard.project : [shard.project];
      const oldProjects = original && (Array.isArray(original.project) ? original.project : [original.project]);
      if (original ? projects.some(project => !oldProjects.includes(project)) : deltas.get(file)?.kind !== 'new-spec') throw new Error('Unknown pending/new shard selection');
    }
    const cases = request.expectedCases[shard.id];
    if (!Array.isArray(cases) || !cases.length) throw new Error('Reviewed expected case inventory required');
    for (const row of cases) {
      strict(row, ['file', 'id', 'project', 'title']);
      if (![row.file, row.id, row.project, row.title].every(value => typeof value === 'string' && value) || !shard.specs.includes(row.file) || !(Array.isArray(shard.project) ? shard.project : [shard.project]).includes(row.project) || accepted.has(caseKey(row)) || planned.has(caseKey(row))) throw new Error('Duplicate/invalid accepted case inventory');
      planned.add(caseKey(row));
    }
  }
  if (used.size !== pins.size) throw new Error('Unknown unused evidence pins');
  const check = async () => {
    assertSource(manifest.worktree, manifest.head); assertSource(worktree, head);
    if (await sourceDigest(manifest.worktree) !== manifest.sourceDigest || await sourceDigest(worktree) !== request.candidate.sourceDigest || await digestTree(pool.build) !== pool.buildDigest) throw new Error('Continuation source/build mutated');
    for (const path of used) await verify(path);
  };
  await check();
  // Recheck historical ownership without signaling or assuming old ESRCH persists.
  for (const row of [...audit.groups, ...audit.servers]) {
    if (!Number.isSafeInteger(row.id) || row.id < 1) throw new Error('Unknown audit process identity');
    for (const id of [row.id, -row.id]) {
      try { process.kill(id, 0); throw new Error('Original process identity occupied'); }
      catch (error) { if (error.code !== 'ESRCH') throw error; }
    }
  }
  for (const row of audit.ports) await assertPortFree(row.port);
  return { plan, build: pool.build, buildDigest: pool.buildDigest,
    needsTypes: request.deltas.some(row => row.kind === 'new-spec'), check,
    assertCases(id, cases) {
      const canonical = rows => rows.map(row => JSON.stringify([row.file, row.id, row.project, row.title])).sort();
      if (JSON.stringify(canonical(cases)) !== JSON.stringify(canonical(request.expectedCases[id]))) throw new Error('Actual case inventory differs from reviewed selection');
    },
    attestation: { schemaVersion: 1, originalHead: manifest.head, originalWorktree: manifest.worktree, originalSourceDigest: manifest.sourceDigest,
      originalPoolSHA256: pins.get(request.original.poolPath), originalInputs: manifest.inputs, pins: request.pins, originalCounts: manifest.counts,
      candidate: request.candidate, deltas: request.deltas, deltaManifestSHA256: hashBytes(JSON.stringify(request.deltas)),
      expectedCases: request.expectedCases, history: request.history, excludedAcceptedCases: [...accepted],
      originalStatus: pool.status, scope: 'Selected continuation only; original checkpoint and consumers remain pending' } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [mode, path] = process.argv.slice(2);
  if (!['manifest', 'run', 'continue'].includes(mode) || !path || process.argv.length !== 4) throw new Error('Usage: node scripts/run-development-checkpoint.mjs manifest|run|continue <config.json>');
  const config = await json(await realpath(path));
  if (mode === 'manifest') console.log(JSON.stringify(await createContinuationManifest(config), null, 2));
  else if (mode === 'continue') {
    strict(config, ['request', 'poolOptions']);
    console.log(await runFrozenContinuation(config.request, config.poolOptions));
  } else {
    const result = await runDevelopmentCheckpoint(config);
    console.log(`${result.evidence.status}: ${result.evidencePath}`);
    if (result.evidence.status !== 'passed') process.exitCode = 1;
  }
}
