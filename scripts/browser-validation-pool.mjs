import { spawn, execFileSync } from 'node:child_process';
import { randomUUID, createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, readdir, lstat, realpath, unlink, rmdir, chmod } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { resolve, join, relative, isAbsolute } from 'node:path';
import { tmpdir, platform, release } from 'node:os';
import { fileURLToPath } from 'node:url';

export const LEGACY_LOCK = '/tmp/sgui-parallel-batch-01-validation.lock';
export const POOL_ROOT = join(tmpdir(), 'sgui-browser-validation-pool-v1');
export const HEAVY_LOCK = join(tmpdir(), 'sgui-heavyweight-build.lock');

// mkdir is the atomic claim. Never reclaim stale leases automatically.
export async function acquireLease(path, owner) {
  await mkdir(path);
  try { await writeFile(join(path, 'owner'), owner, { flag: 'wx' }); }
  catch (error) { await rmdir(path); throw error; }
  return { path, owner };
}
export async function releaseLease(lease) {
  if ((await readFile(join(lease.path, 'owner'), 'utf8')) !== lease.owner) {
    throw new Error(`Owner mismatch; refusing cleanup: ${lease.path}`);
  }
  await unlink(join(lease.path, 'owner'));
  await rmdir(lease.path);
}
export async function acquireSlot(root, owner, max = 2) {
  if (!Number.isInteger(max) || max < 1 || max > 2) throw new Error('Session limit must be 1 or 2');
  await mkdir(root, { recursive: true });
  for (let slot = 0; slot < max; slot++) {
    try { return { ...await acquireLease(join(root, `slot-${slot}`), owner), slot }; }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
  throw new Error('Browser slots occupied; no session started');
}
export async function assertQueueDrained(path) {
  if (!path || !isAbsolute(path)) throw new Error('An absolute legacy --queue-file is required');
  const contents = (await readFile(path, 'utf8')).trim();
  if (!contents) return;
  let value;
  try { value = JSON.parse(contents); } catch { throw new Error(`Invalid legacy queue: ${path}`); }
  const queue = Array.isArray(value) ? value : value?.queue;
  if (!Array.isArray(queue) || queue.length) throw new Error(`Legacy queue is not drained: ${path}`);
}
export async function assertPortFree(port) {
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid browser port');
  const server = createServer();
  await new Promise((done, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', done);
  });
  await new Promise((done, reject) => server.close(error => error ? reject(error) : done()));
}
export function ownedPath(worktree, path) {
  const result = resolve(worktree, path);
  const rel = relative(worktree, result);
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) throw new Error(`Path must be inside worktree: ${path}`);
  return result;
}
export async function digestTree(root, freeze = false) {
  const hash = createHash('sha256');
  async function walk(dir) {
    for (const name of (await readdir(dir)).sort()) {
      const path = join(dir, name);
      const stat = await lstat(path);
      if (stat.isSymbolicLink()) throw new Error(`Symlink in static build: ${path}`);
      hash.update(relative(root, path));
      if (stat.isDirectory()) { hash.update('directory'); await walk(path); }
      else if (stat.isFile()) { hash.update('file'); hash.update(await readFile(path)); }
      else throw new Error(`Non-regular static asset: ${path}`);
      if (freeze) await chmod(path, stat.isDirectory() ? 0o555 : 0o444);
    }
  }
  await walk(root);
  if (freeze) await chmod(root, 0o555);
  return hash.digest('hex');
}
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const version = (cwd, command, args) => execFileSync(command, args, { cwd, encoding: 'utf8' }).trim();

export function validateSelection(args) {
  if (!Array.isArray(args) || args.some(arg => typeof arg !== 'string')) throw new Error('Each job needs Playwright args (use [] for full matrix)');
  const overrides = /^--(?:config|output|reporter|workers|web-server|retries|list|ui|debug|pass-with-no-tests|ignore-snapshots|update-snapshots)(?:=|$)/;
  if (args.some(arg => overrides.test(arg) || /^-[cj]/.test(arg))) throw new Error('Plan cannot override harness configuration or weaken tests');
}

export function createStage(size) {
  if (!Number.isInteger(size) || size < 1 || size > 2) throw new Error('Invalid staging size');
  const arrivals = new Set();
  let done;
  const ready = new Promise(resolveReady => { done = resolveReady; });
  return { ready, arrive(key) { arrivals.add(key); if (arrivals.size >= size) done(); } };
}

// Each command has an owned process group; all termination is scoped to that group.
export async function runOwnedCommand({ cwd, env = process.env, executable, args, log, signal, terminateDelay = 3000 }) {
  if (signal?.aborted) throw new Error('Pool interrupted');
  const child = spawn(executable, args, { cwd, env, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
  const kill = kind => {
    if (child.pid) { try { process.kill(-child.pid, kind); } catch (error) { if (error.code !== 'ESRCH') throw error; } }
  };
  let timer;
  const stop = () => {
    kill('SIGTERM');
    timer ??= setTimeout(() => kill('SIGKILL'), terminateDelay);
    timer.unref();
  };
  signal?.addEventListener('abort', stop, { once: true });
  child.once('exit', stop); // Clean descendants even when the command exits normally.
  let text = '';
  const collect = chunk => { text += chunk.toString(); };
  child.stdout.on('data', collect); child.stderr.on('data', collect);
  let result;
  try {
    result = await new Promise((done, reject) => {
      child.once('error', reject);
      child.once('close', (code, childSignal) => done({ code, signal: childSignal }));
    });
  } finally {
    clearTimeout(timer); signal?.removeEventListener('abort', stop);
    kill('SIGKILL');
    await writeFile(log, text);
  }
  if (result.code !== 0 || signal?.aborted) throw new Error(`${executable} ${args.join(' ')} failed (${result.code}/${result.signal}); see ${log}`);
}

export async function runPool(plan, { queueFile = '/tmp/sgui-browser-validation-priority.json', max = 2, firstPort = 6273, output = 'artifacts/browser-pool' } = {}) {
  if (!Array.isArray(plan) || plan.length === 0) throw new Error('Plan must be a nonempty JSON array');
  if (!Number.isInteger(max) || max < 1 || max > 2) throw new Error('Session limit must be 1 or 2');
  if (queueFile !== '/tmp/sgui-browser-validation-priority.json') throw new Error('Use the existing legacy priority queue; substitute queues are forbidden');
  const jobs = [];
  for (const entry of plan) {
    const worktree = await realpath(entry.worktree);
    if (git(worktree, 'rev-parse', '--show-toplevel') !== worktree) throw new Error('Use an exact worktree root');
    if (!/^[a-f0-9]{40}$/.test(entry.head) || git(worktree, 'rev-parse', 'HEAD') !== entry.head) throw new Error(`Head mismatch: ${worktree}`);
    if (git(worktree, 'status', '--porcelain', '--untracked-files=normal')) throw new Error(`Commit changes before validation: ${worktree}`);
    validateSelection(entry.args);
    const config = await readFile(join(worktree, 'playwright.config.ts'), 'utf8');
    if (!config.includes('SGUI_BROWSER_PORT') || !config.includes('SGUI_BROWSER_RESULTS_FILE')) throw new Error('Each worktree must contain the reviewed configurable browser harness');
    const parent = ownedPath(worktree, output);
    try { git(worktree, 'check-ignore', parent); } catch { throw new Error('Output must be gitignored inside its worktree'); }
    // Reject symlinked existing output ancestors, including artifacts from another checkout.
    let cursor = parent;
    while (!existsSync(cursor)) cursor = resolve(cursor, '..');
    if (await realpath(cursor) !== cursor) throw new Error('Output ancestors must not be symlinks');
    jobs.push({ ...entry, worktree, parent });
  }
  if (new Set(jobs.map(job => job.worktree)).size !== jobs.length) throw new Error('Only one job per worktree per pool run');
  await assertQueueDrained(queueFile);
  if (!Number.isInteger(firstPort) || firstPort < 1024 || firstPort + max - 1 > 65535) throw new Error('Invalid pool port range');
  const owner = `browser-pool:${process.pid}:${randomUUID()}`;
  // Compatibility bridge: excludes all legacy heavy/browser workers throughout this opt-in run.
  const bridge = await acquireLease(LEGACY_LOCK, owner);
  const controller = new AbortController();
  let aborted = false;
  let failed = false;
  const onSignal = () => { aborted = true; controller.abort(); };
  process.on('SIGINT', onSignal); process.on('SIGTERM', onSignal);
  const command = (cwd, env, executable, args, log) => runOwnedCommand({ cwd, env, executable, args, log, signal: controller.signal });
  // Each wave stages its builds/types first, then admits at most two browsers together.
  let buildTail = Promise.resolve();
  async function runJob(job, stage) {
    const token = randomUUID();
    const slot = await acquireSlot(POOL_ROOT, `${owner}:${token}`, max);
    let evidence;
    let run;
    try {
      const port = firstPort + slot.slot;
      await mkdir(job.parent, { recursive: true });
      run = join(job.parent, token);
      await mkdir(run); // Fresh output, never reuse artifacts or another worktree's server.
      const build = join(run, 'storybook');
      const env = { ...process.env, SGUI_BROWSER_PORT: String(port), SGUI_BROWSER_BASE_URL: `http://127.0.0.1:${port}`,
        SGUI_BROWSER_STORYBOOK_DIR: build, SGUI_BROWSER_OUTPUT_DIR: join(run, 'traces'),
        SGUI_BROWSER_REPORT_DIR: join(run, 'report'), SGUI_BROWSER_RESULTS_FILE: join(run, 'results.json'), SGUI_BROWSER_IMMUTABLE: '1' };
      evidence = { owner, token, worktree: job.worktree, head: job.head, sourceTree: git(job.worktree, 'rev-parse', 'HEAD^{tree}'),
        startedAt: new Date().toISOString(), node: process.version, nodeExecutable: process.execPath, platform: platform(), osRelease: release(),
        slot: slot.slot, port, baseURL: env.SGUI_BROWSER_BASE_URL, build, outputs: { run, report: env.SGUI_BROWSER_REPORT_DIR, results: env.SGUI_BROWSER_RESULTS_FILE, traces: env.SGUI_BROWSER_OUTPUT_DIR },
        configuredProjects: ['chromium', 'firefox', 'webkit'], selection: job.args,
        packageLockDigest: createHash('sha256').update(await readFile(join(job.worktree, 'pnpm-lock.yaml'))).digest('hex'),
        harnessDigest: createHash('sha256').update(await readFile(fileURLToPath(import.meta.url))).digest('hex'),
        commands: [['pnpm', 'exec', 'storybook', 'build', '--output-dir', build], ['pnpm', 'exec', 'tsc', '--noEmit', '-p', 'tests/browser/tsconfig.json'], ['pnpm', 'exec', 'playwright', 'test', ...job.args]], status: 'running' };
      await writeFile(join(run, 'evidence.json'), JSON.stringify(evidence, null, 2));
      await assertQueueDrained(queueFile);
      await assertPortFree(port);
      evidence.pnpm = version(job.worktree, 'pnpm', ['--version']);
      evidence.playwright = version(job.worktree, 'pnpm', ['exec', 'playwright', '--version']);
      const prior = buildTail;
      let finish;
      buildTail = new Promise(done => { finish = done; });
      await prior;
      let heavy;
      try {
        heavy = await acquireLease(HEAVY_LOCK, `${owner}:${token}`);
        await command(job.worktree, env, 'pnpm', ['exec', 'storybook', 'build', '--output-dir', build], join(run, 'build.log'));
        evidence.buildDigest = await digestTree(build, true);
      } finally { try { if (heavy) await releaseLease(heavy); } finally { finish(); } }
      if (git(job.worktree, 'rev-parse', 'HEAD') !== job.head || git(job.worktree, 'status', '--porcelain')) throw new Error('Source changed during build');
      await command(job.worktree, env, 'pnpm', ['exec', 'tsc', '--noEmit', '-p', 'tests/browser/tsconfig.json'], join(run, 'types.log'));
      stage.arrive(job.worktree);
      await stage.ready;
      evidence.browserStartedAt = new Date().toISOString();
      await command(job.worktree, env, 'pnpm', ['exec', 'playwright', 'test', ...job.args], join(run, 'browser.log'));
      evidence.browserFinishedAt = new Date().toISOString();
      evidence.status = 'passed';
    } catch (error) {
      failed = true;
      if (evidence) { evidence.status = 'failed'; evidence.error = error.message; }
      console.error(error.message);
    } finally {
      stage.arrive(job.worktree);
      try {
        if (evidence) {
          try {
            if (evidence.buildDigest) {
              evidence.finalBuildDigest = await digestTree(evidence.build);
              if (evidence.finalBuildDigest !== evidence.buildDigest) { evidence.status = 'failed'; evidence.integrityError = 'Static build changed during validation'; failed = true; }
            }
            evidence.finalHead = git(job.worktree, 'rev-parse', 'HEAD');
            evidence.finalStatus = git(job.worktree, 'status', '--porcelain');
            if (evidence.finalHead !== job.head || evidence.finalStatus) { evidence.status = 'failed'; evidence.sourceError = 'Source changed during validation'; failed = true; }
          } catch (error) { evidence.status = 'failed'; evidence.finalizationError = error.message; failed = true; }
          evidence.finishedAt = new Date().toISOString();
          await writeFile(join(run, 'evidence.json'), JSON.stringify(evidence, null, 2));
          console.log(`${evidence.status}: ${join(run, 'evidence.json')}`);
        }
      } finally { await releaseLease(slot); }
    }
  }
  try {
    await assertQueueDrained(queueFile); // Recheck after acquiring the compatibility bridge.
    for (let offset = 0; !aborted && offset < jobs.length; offset += max) {
      const wave = jobs.slice(offset, offset + max);
      const stage = createStage(wave.length);
      const outcomes = await Promise.allSettled(wave.map(async job => {
        try { await runJob(job, stage); } finally { stage.arrive(job.worktree); }
      }));
      if (outcomes.some(result => result.status === 'rejected')) failed = true;
    }
    if (failed || aborted) throw new Error('Pool validation incomplete; inspect per-job evidence');
  } finally {
    process.off('SIGINT', onSignal); process.off('SIGTERM', onSignal);
    await releaseLease(bridge);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('node scripts/browser-validation-pool.mjs --plan <json> --queue-file <absolute legacy queue> [--max 1|2] [--first-port 6273] [--output artifacts/browser-pool]');
  } else {
    const options = {};
    const allowed = new Set(['--plan', '--queue-file', '--max', '--first-port', '--output']);
    for (let i = 0; i < args.length; i += 2) {
      if (!allowed.has(args[i]) || !args[i + 1] || options[args[i]]) throw new Error('Invalid arguments; see --help');
      options[args[i]] = args[i + 1];
    }
    try {
      const plan = JSON.parse(await readFile(options['--plan'], 'utf8'));
      await runPool(plan, { queueFile: options['--queue-file'], max: Number(options['--max'] ?? 2), firstPort: Number(options['--first-port'] ?? 6273), output: options['--output'] ?? 'artifacts/browser-pool' });
    } catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
