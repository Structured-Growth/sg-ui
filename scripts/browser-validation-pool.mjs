import { spawn, execFile, execFileSync } from 'node:child_process';
import { randomUUID, createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, readdir, lstat, realpath, unlink, rmdir, chmod } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createServer, createConnection } from 'node:net';
import { resolve, join, relative, isAbsolute } from 'node:path';
import { tmpdir, platform, release, cpus, loadavg, freemem, totalmem } from 'node:os';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
const execAsync = promisify(execFile);
const ownedGroups = new Set();
export const LIGHT_ROOT = '/tmp/sgui-light-validation-slots';
export const INSTALL_ROOT = '/tmp/sgui-install-slots';
// The loopback port namespace supplies the hard bound, not an arbitrary hardware target.
export const MAX_SESSIONS = 65535 - 1024 + 1;
export function validateLimit(max) {
  if (!Number.isInteger(max) || max < 1 || max > MAX_SESSIONS) throw new Error('Session limit must fit the valid loopback port namespace');
}
// The optional root is a fixture-only seam; production callers use canonical roots.
export const acquireLightSlot = (owner, fixture = {}) => acquireCanonicalSlot(fixture.root ?? LIGHT_ROOT, owner, 4, 'slot');
export const acquireInstallSlot = (owner, fixture = {}) => acquireCanonicalSlot(fixture.root ?? INSTALL_ROOT, owner, 2, 'slot');

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
async function assertLeaseOwner(lease) {
  if (!(await lstat(lease.path)).isDirectory() || !(await lstat(join(lease.path, 'owner'))).isFile()) throw new Error(`Non-regular lease; refusing cleanup: ${lease.path}`);
  if ((await readFile(join(lease.path, 'owner'), 'utf8')) !== lease.owner) {
    throw new Error(`Owner mismatch; refusing cleanup: ${lease.path}`);
  }
}
export async function releaseLease(lease) {
  // Verify both claims before changing either; a replaced/malformed owner retains
  // the canonical claim and its transition guard for explicit owner resolution.
  const claims = lease.legacyLease ? [lease, lease.legacyLease] : [lease];
  for (const claim of claims) await assertLeaseOwner(claim);
  for (const claim of claims) {
    await unlink(join(claim.path, 'owner'));
    await rmdir(claim.path);
  }
}
async function acquireCanonicalSlot(root, owner, max, prefix) {
  await mkdir(root, { recursive: true });
  if (!(await lstat(root)).isDirectory()) throw new Error('Lease root must be a regular directory');
  for (let slot = 0; slot < max; slot++) {
    let legacyLease;
    try { legacyLease = await acquireLease(join(root, `slot-${slot}`), owner); }
    catch (error) { if (error.code === 'EEXIST') continue; throw error; }
    // Holding the legacy claim throughout the admitted job excludes old helpers
    // too, including those starting after this helper's canonical mkdir.
    try { return { ...await acquireLease(join(root, `${prefix}${slot}`), owner), slot, legacyLease }; }
    catch (error) {
      await releaseLease(legacyLease);
      if (error.code !== 'EEXIST') throw error;
    }
  }
  throw new Error('Validation slots occupied; no work started');
}
export async function acquireSlot(root, owner, max = 2) {
  validateLimit(max);
  await mkdir(root, { recursive: true });
  if (!(await lstat(root)).isDirectory()) throw new Error('Lease root must be a regular directory');
  for (let slot = 0; slot < max; slot++) {
    try { return { ...await acquireLease(join(root, `slot-${slot}`), owner), slot }; }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
  throw new Error('Browser slots occupied; no session started');
}
export async function assertQueueDrained(path, owner) {
  if (!path || !isAbsolute(path)) throw new Error('An absolute legacy --queue-file is required');
  const contents = (await readFile(path, 'utf8')).trim();
  if (!contents && !owner) return;
  let value;
  try { value = JSON.parse(contents); } catch { throw new Error(`Invalid legacy queue: ${path}`); }
  const queue = Array.isArray(value) ? value : value?.queue;
  if (!Array.isArray(queue) || (owner ? queue[0] !== owner : queue.length !== 0)) {
    throw new Error(`Legacy queue is not drained for ${owner ?? 'unlisted caller'}: ${path}`);
  }
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
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const version = (cwd, command, args) => execFileSync(command, args, { cwd, encoding: 'utf8' }).trim();

export function validateSelection(args) {
  if (!Array.isArray(args) || args.some(arg => typeof arg !== 'string')) throw new Error('Each job needs Playwright args (use [] for full matrix)');
  const overrides = /^--(?:config|output|reporter|workers|web-server|retries|list|ui|debug|pass-with-no-tests|ignore-snapshots|update-snapshots|repeat-each|shard|no-deps|max-failures|last-failed|only-changed|test-list|timeout|fully-parallel|forbid-only)(?:=|$)/;
  if (args.some(arg => overrides.test(arg) || /^-[cj]/.test(arg))) throw new Error('Plan cannot override harness configuration or weaken tests');
}

// In-supervisor stage admission; the outer heavyweight lease excludes all foreign builds.
export function createAdmission(limit) {
  validateLimit(limit);
  let active = 0; const waiting = [];
  return async function admit() {
    if (active >= limit) await new Promise(done => waiting.push(done));
    else active++;
    let released = false;
    return () => {
      if (released) throw new Error('Admission already released');
      released = true;
      const next = waiting.shift();
      if (next) next(); else active--;
    };
  };
}

export function createStage(size) {
  validateLimit(size);
  const arrivals = new Set();
  let done;
  const ready = new Promise(resolveReady => { done = resolveReady; });
  return { ready, arrive(key) { arrivals.add(key); if (arrivals.size >= size) done(); } };
}

// Playwright's webServer launcher detaches its shell from the command group.
// Register before listening, and keep the supervisor connection as a lifetime guard.
function processTable() {
  return execFileSync('ps', ['-axo', 'pid=,ppid=,pgid=,lstart='], { encoding: 'utf8' })
    .trim().split('\n').map(line => {
      const match = line.trim().match(/^(\d+)\s+(\d+)\s+(\d+)\s+(.+)$/);
      if (!match) throw new Error('Unverifiable process table');
      return { pid: Number(match[1]), ppid: Number(match[2]), pgid: Number(match[3]), started: match[4] };
    });
}
export async function registerOwnedServer(env, port) {
  if (!env.SGUI_COMMAND_SOCKET && !env.SGUI_COMMAND_TOKEN) return undefined;
  if (!env.SGUI_COMMAND_SOCKET || !env.SGUI_COMMAND_TOKEN) throw new Error('Incomplete server ownership');
  const socket = createConnection(env.SGUI_COMMAND_SOCKET);
  await new Promise((done, reject) => {
    socket.once('error', reject);
    socket.once('connect', () => socket.write(JSON.stringify({ token: env.SGUI_COMMAND_TOKEN, pid: process.pid, port }) + '\n'));
    let reply = '';
    socket.on('data', data => {
      reply += data;
      if (reply.includes('\n')) reply === 'owned\n' ? done() : reject(new Error('Server ownership refused'));
    });
    socket.once('close', () => reject(new Error('Server supervisor closed')));
  }).catch(error => { socket.destroy(); throw error; });
  return socket;
}

// Each command has an owned process group; all termination is scoped to that group.
// The second argument is a fixture-only signal seam, never a CLI option.
export async function runOwnedCommand({ cwd, env = process.env, executable, args, log, signal, terminateDelay = 3000 }, fixture = {}) {
  if (signal?.aborted) throw new Error('Pool interrupted');
  const started = performance.now();
  const samples = [], signalErrors = [], serverGroups = new Map(), ownershipErrors = [];
  const token = randomUUID();
  const socketPath = join(tmpdir(), `sgui-command-${token}.sock`);
  let child;
  const connections = new Set();
  const registry = createServer(socket => {
    connections.add(socket); socket.on('error', () => {});
    socket.once('close', () => connections.delete(socket));
    let input = '';
    socket.on('data', data => {
      input += data;
      if (input.length > 4096) { ownershipErrors.push('Oversized ownership request'); socket.destroy(); return; }
      if (!input.includes('\n')) return;
      socket.removeAllListeners('data');
      try {
        const receipt = JSON.parse(input);
        if (receipt.token !== token || !Number.isSafeInteger(receipt.pid) || receipt.pid <= 0) throw new Error('Server owner token/PID mismatch');
        const rows = processTable();
        const server = rows.find(row => row.pid === receipt.pid);
        const leader = rows.find(row => row.pid === server?.pgid);
        let ancestor = server; const seen = new Set(), ancestry = [];
        while (ancestor && ancestor.pid !== child?.pid && !seen.has(ancestor.pid)) {
          ancestry.push(ancestor); seen.add(ancestor.pid); ancestor = rows.find(row => row.pid === ancestor.ppid);
        }
        if (!server || !leader || ancestor?.pid !== child?.pid || leader.pgid !== leader.pid) throw new Error('Server ancestry/group ownership ambiguous');
        if (!Number.isInteger(receipt.port) || receipt.port < 1024 || receipt.port > 65535) throw new Error('Invalid owned server port');
        serverGroups.set(server.pgid, { ...leader, serverPID: server.pid, port: receipt.port, ancestry: [...ancestry, ancestor] });
        ownedGroups.add(server.pgid);
        socket.write('owned\n');
      } catch (error) { ownershipErrors.push(error.message); socket.end('refused\n'); }
    });
  });
  await new Promise((done, reject) => { registry.once('error', reject); registry.listen(socketPath, done); });
  const send = fixture.kill ?? process.kill;
  child = spawn(executable, args, { cwd, env: { ...env, SGUI_COMMAND_SOCKET: socketPath, SGUI_COMMAND_TOKEN: token }, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
  if (child.pid) ownedGroups.add(child.pid);
  let timer, deadline, sampler, stopping = false, closed = false, settled = !child.pid;
  let text = '', result, commandError;
  const groups = () => [...new Set([child.pid, ...serverGroups.keys()].filter(Boolean))];
  const probe = group => {
    try { send(-group, 0); return false; }
    catch (error) {
      if (error.code === 'ESRCH') return true;
      signalErrors.push({ processGroup: group, signal: 0, code: error.code, message: error.message });
      return false;
    }
  };
  const kill = kind => {
    for (const group of groups()) {
      try {
        const receipt = serverGroups.get(group);
        if (receipt && group !== child.pid) {
          if (probe(group)) continue;
          const leader = processTable().find(row => row.pid === group);
          if (!leader || leader.pgid !== group || leader.started !== receipt.started) {
            ownershipErrors.push(`Group ${group} identity ambiguous; refusing signal`); continue;
          }
        }
        send(-group, kind);
      } catch (error) {
        if (error.code !== 'ESRCH') signalErrors.push({ processGroup: group, signal: kind, code: error.code, message: error.message });
      }
    }
  };
  const gone = () => groups().map(probe).every(Boolean) && ownershipErrors.length === 0;
  let finish;
  const completion = new Promise(done => { finish = done; });
  const stop = () => {
    if (stopping) return;
    stopping = true;
    kill('SIGTERM');
    timer = setTimeout(() => kill('SIGKILL'), terminateDelay);
    // A permission failure can leave the leader/pipes open. Return failed evidence
    // within a bound, retaining group ownership and leases if settlement is unknown.
    deadline = setTimeout(() => finish(), terminateDelay * 2 + 100);
  };
  child.once('error', error => { commandError = error; stop(); finish(); });
  child.once('exit', stop); // Clean descendants even when the leader exits normally.
  child.once('close', (code, childSignal) => { closed = true; result = { code, signal: childSignal }; finish(); });
  child.stdout.on('data', chunk => { text += chunk.toString(); });
  child.stderr.on('data', chunk => { text += chunk.toString(); });
  signal?.addEventListener('abort', stop, { once: true });
  if (signal?.aborted) stop();
  let sampling = Promise.resolve(), samplingActive = false;
  const sample = () => {
    if (samplingActive) return;
    samplingActive = true;
    sampling = sampleResources(groups()).then(value => samples.push(value)).catch(error => {
      commandError ??= error;
    }).finally(() => { samplingActive = false; });
  };
  sample(); sampler = setInterval(sample, 1000); sampler.unref();
  try {
    await completion;
    kill('SIGKILL');
    const until = performance.now() + terminateDelay;
    do {
      kill('SIGKILL');
      settled = gone();
      if (settled) {
        for (const receipt of serverGroups.values()) {
          try { await assertPortFree(receipt.port); } catch (error) { ownershipErrors.push(`Owned server port ${receipt.port} unresolved: ${error.message}`); settled = false; }
        }
        if (settled) break;
      }
      await new Promise(done => setTimeout(done, 25));
    } while (performance.now() < until);
  } finally {
    clearInterval(sampler); clearTimeout(timer); clearTimeout(deadline);
    signal?.removeEventListener('abort', stop);
    child.removeListener('exit', stop);
    if (!closed) { child.stdout.destroy(); child.stderr.destroy(); child.unref(); }
    await sampling; sample(); await sampling;
    for (const socket of connections) socket.destroy();
    await new Promise(done => registry.close(done));
    // Registrations arriving during settlement must be included in its final proof.
    settled = settled && gone();
    if (settled) for (const group of groups()) ownedGroups.delete(group);
    try { await Promise.all([writeFile(log, text), writeFile(`${log}.resources.json`, JSON.stringify({
      durationMs: performance.now() - started, commandOwner: token, processGroup: child.pid, samples,
      result, commandError: commandError?.message, signalErrors, ownershipErrors, serverGroups: [...serverGroups.values()], settled,
    }, null, 2))]); }
    catch (error) { error.ownedCommandUnsettled = !settled; throw error; }
  }
  if (commandError || signalErrors.length || ownershipErrors.length || !settled || result?.code !== 0 || signal?.aborted) {
    const error = new Error(`${executable} ${args.join(' ')} failed (${result?.code}/${result?.signal}); group ${settled ? 'settled' : 'unsettled'}; ${signalErrors.map(item => `${item.signal}:${item.code}`).join(', ')}; ${ownershipErrors.join(', ')}; see ${log}`);
    error.ownedCommandUnsettled = !settled;
    throw error;
  }
}

// Resource samples are evidence, not an admission policy: the coordinator chooses the cap.
export async function sampleResources(processGroup) {
  const cpu = cpus();
  const result = { at: new Date().toISOString(), logicalCPUs: cpu.length, load: loadavg(),
    freeMemoryBytes: freemem(), totalMemoryBytes: totalmem(), supervisorRSSBytes: process.memoryUsage().rss,
    cpuTimes: cpu.reduce((sum, core) => {
      for (const [key, value] of Object.entries(core.times)) sum[key] = (sum[key] ?? 0) + value;
      return sum;
    }, {}) };
  const capture = async (key, executable, args) => {
    try { result[key] = (await execAsync(executable, args, { timeout: 2000, maxBuffer: 4 * 1024 * 1024 })).stdout.trim(); }
    catch (error) { result[key] = { unavailable: error.message }; }
  };
  await capture('processes', 'ps', ['-axo', 'pid=,pgid=,rss=,%cpu=']);
  if (typeof result.processes === 'string') {
    const rows = result.processes.split('\n').map(line => line.trim().split(/\s+/).map(Number));
    const owned = rows.filter(row => processGroup === undefined ? ownedGroups.has(row[1]) : (Array.isArray(processGroup) ? processGroup.includes(row[1]) : row[1] === processGroup));
    result.ownedProcesses = owned.map(([pid, pgid, rssKiB, cpuPercent]) => ({ pid, pgid, rssKiB, cpuPercent }));
    result.ownedRSSBytes = owned.reduce((sum, row) => sum + row[2] * 1024, 0);
    result.systemRSSBytes = rows.reduce((sum, row) => sum + row[2] * 1024, 0);
    delete result.processes;
  }
  if (platform() === 'darwin') {
    await Promise.all([capture('memoryPressure', 'memory_pressure', ['-Q']), capture('swap', 'sysctl', ['vm.swapusage']), capture('vmStatistics', 'vm_stat', [])]);
  } else if (platform() === 'linux') {
    for (const [key, path] of [['memoryPressure', '/proc/pressure/memory'], ['swap', '/proc/meminfo']]) {
      try { result[key] = await readFile(path, 'utf8'); } catch (error) { result[key] = { unavailable: error.message }; }
    }
  } else { result.memoryPressure = result.swap = { unavailable: 'Unsupported platform' }; }
  if (typeof result.swap === 'string' && platform() === 'darwin') {
    const used = result.swap.match(/used\s*=\s*([\d.]+)([MG])/);
    if (used) result.swapUsedBytes = Number(used[1]) * (used[2] === 'G' ? 1073741824 : 1048576);
  }
  if (typeof result.vmStatistics === 'string') {
    result.swapCounters = Object.fromEntries(['Swapins', 'Swapouts'].map(key => [key, Number(result.vmStatistics.match(new RegExp(`${key}:\\s*(\\d+)`))?.[1] ?? NaN)]));
  }
  return result;
}
export function validateBudget(budget) {
  exactKeys(budget, ['minFreeMemoryBytes', 'maxLoad1', 'maxSystemRSSBytes']);
  if (Object.values(budget).some(value => !Number.isFinite(value) || value <= 0)) throw new Error('Resource budgets must be positive finite numbers');
}
export function assertBudget(sample, budget) {
  validateBudget(budget);
  if (budget.minFreeMemoryBytes && sample.freeMemoryBytes < budget.minFreeMemoryBytes) throw new Error('Resource budget: free memory below floor');
  if (budget.maxLoad1 && sample.load[0] > budget.maxLoad1) throw new Error('Resource budget: load above ceiling');
  if (budget.maxSystemRSSBytes && (!Number.isFinite(sample.systemRSSBytes) || sample.systemRSSBytes > budget.maxSystemRSSBytes)) throw new Error('Resource budget: system RSS above ceiling or unavailable');
}

export async function acquirePortLease(root, port, owner) {
  await mkdir(root, { recursive: true });
  if (!(await lstat(root)).isDirectory()) throw new Error('Lease root must be a regular directory');
  await mkdir(join(root, 'ports'), { recursive: true });
  if (!(await lstat(join(root, 'ports'))).isDirectory()) throw new Error('Port lease root must be a regular directory');
  const lease = await acquireLease(join(root, 'ports', String(port)), owner);
  try { await assertPortFree(port); return lease; }
  catch (error) { await releaseLease(lease); throw error; }
}
export function assertSource(worktree, head) {
  if (!/^[a-f0-9]{40}$/.test(head ?? '') || git(worktree, 'rev-parse', 'HEAD') !== head) throw new Error('Head mismatch');
  if (git(worktree, 'status', '--porcelain', '--untracked-files=normal')) throw new Error('Source changed or dirty; commit changes before validation');
}
export async function sourceDigest(worktree) {
  const hash = createHash('sha256');
  const files = execFileSync('git', ['ls-files', '-z'], { cwd: worktree, encoding: 'utf8' }).split('\0').filter(Boolean);
  for (const file of files) {
    const path = join(worktree, file);
    const stat = await lstat(path);
    if (!stat.isFile()) throw new Error(`Non-regular source: ${file}`);
    hash.update(file); hash.update('\0'); hash.update(await readFile(path));
  }
  return hash.digest('hex');
}
function exactKeys(value, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !allowed.includes(key))) throw new Error('Ambiguous snapshot plan or override fields');
}
// Bounded fixed-width regex grammar: no repetition, groups, classes or backreferences.
// This admits title literals/alternatives without executing arbitrary backtracking patterns.
export function validateCaseFilter(value) {
  if (typeof value !== 'string' || !value.trim() || value.startsWith('-') || value.length > 512 || /[\x00-\x1f\x7f]/.test(value)) throw new Error('Invalid focused case regex');
  let alternatives = 1;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === '\\') {
      const escaped = value[++i];
      if (!escaped || /[a-zA-Z0-9]/.test(escaped)) throw new Error('Focused case regex permits escaped punctuation only');
    } else if ('*+?{}()[]'.includes(char)) throw new Error('Focused case regex forbids repetition, groups and classes');
    else if (char === '|' && ++alternatives > 8) throw new Error('Focused case regex permits at most eight alternatives');
  }
  let regex;
  try { regex = new RegExp(value); } catch { throw new Error('Malformed focused case regex'); }
  if (regex.test('') || value.split(/(?<!\\)\|/).some(part => !part.trim())) throw new Error('Focused case regex must not select empty text');
  return regex;
}

export function snapshotCases(results, shard, worktree) {
  const stats = results?.stats;
  if (!Number.isSafeInteger(stats?.expected) || stats.expected < 1 || stats.unexpected !== 0 || stats.flaky !== 0 || stats.skipped !== 0) throw new Error('Missing, empty, skipped, flaky or failing shard results');
  if (results.config?.rootDir !== join(worktree, 'tests/browser') || !Array.isArray(results.errors) || results.errors.length) throw new Error('Missing or invalid shard report root/errors');
  const projects = Array.isArray(shard.project) ? shard.project : [shard.project];
  const regex = shard.grep === undefined ? undefined : validateCaseFilter(shard.grep);
  const cases = [], identities = new Set(), covered = new Set();
  const fail = () => { throw new Error('Incomplete or out-of-selection shard case results'); };
  function walk(suites, titles = []) {
    if (!Array.isArray(suites)) fail();
    for (const suite of suites) {
      const path = [...titles, suite.title];
      if (typeof suite.title !== 'string' || !Array.isArray(suite.specs) || (suite.suites !== undefined && !Array.isArray(suite.suites))) fail();
      for (const spec of suite.specs) {
        if (typeof spec.title !== 'string' || !Array.isArray(spec.tests) || !spec.tests.length) fail();
        if (typeof spec.file !== 'string' || !Array.isArray(spec.tags) || spec.tags.some(tag => typeof tag !== 'string')) fail();
        const file = relative(worktree, resolve(results.config.rootDir, spec.file));
        if (!shard.specs.includes(file)) fail();
        for (const test of spec.tests) {
          // JSON flattens tag provenance and cannot reconstruct tag placement.
          // Focused title attestation therefore fails closed for tagged cases.
          if (regex && spec.tags.length) throw new Error('Focused case attestation requires untagged cases');
          const title = [test.projectName, ...path.filter(Boolean), spec.title].join(' ');
          if (!projects.includes(test.projectName) || (regex && !regex.test(` ${title}`)) || test.status !== 'expected' ||
              !Array.isArray(test.results) || test.results.length !== 1 || test.results[0].status !== 'passed' || test.results[0].retry !== 0) fail();
          const identity = JSON.stringify([file, spec.id, test.projectName]);
          if (typeof spec.id !== 'string' || !spec.id || identities.has(identity)) fail();
          identities.add(identity); covered.add(JSON.stringify([file, test.projectName]));
          cases.push({ file, id: spec.id, project: test.projectName, title });
        }
      }
      walk(suite.suites ?? [], path);
    }
  }
  walk(results.suites);
  if (cases.length !== stats.expected || shard.specs.some(file => projects.some(project => !covered.has(JSON.stringify([file, project]))))) fail();
  return cases;
}

export async function prepareSnapshot(plan, output) {
  exactKeys(plan, ['mode', 'worktree', 'head', 'shards']);
  if (plan.mode !== 'snapshot') throw new Error('Expected snapshot mode');
  const worktree = await realpath(plan.worktree);
  if (git(worktree, 'rev-parse', '--show-toplevel') !== worktree) throw new Error('Use an exact worktree root');
  assertSource(worktree, plan.head);
  const config = await readFile(join(worktree, 'playwright.config.ts'), 'utf8');
  if (!/workers:\s*1\s*,/.test(config) || !/retries:\s*0\s*,/.test(config) || !/reuseExistingServer:\s*false/.test(config) ||
      !config.includes('SGUI_BROWSER_PORT') || !config.includes('SGUI_BROWSER_RESULTS_FILE')) throw new Error('Snapshot requires reviewed one-worker zero-retry isolated harness');
  if (!Array.isArray(plan.shards) || !plan.shards.length) throw new Error('Snapshot needs nonempty focused shards');
  const seen = new Set(); const ids = new Set();
  const shards = [];
  for (const shard of plan.shards) {
    exactKeys(shard, ['id', 'specs', 'project', 'grep']);
    if (Object.hasOwn(shard, 'grep')) validateCaseFilter(shard.grep);
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(shard.id ?? '') || ids.has(shard.id)) throw new Error('Shard IDs must be unique');
    ids.add(shard.id);
    const projects = Array.isArray(shard.project) ? shard.project : [shard.project];
    if (!projects.length || new Set(projects).size !== projects.length || projects.some(project => !['chromium', 'firefox', 'webkit'].includes(project))) throw new Error('Each shard needs explicit unique engines');
    if (!Array.isArray(shard.specs) || !shard.specs.length) throw new Error('Each shard needs exact spec files');
    for (const spec of shard.specs) {
      if (typeof spec !== 'string' || !/^tests\/browser\/[a-zA-Z0-9_-]+\.spec\.ts$/.test(spec)) throw new Error('Use exact top-level browser spec paths; patterns/flags are forbidden');
      if (seen.has(spec)) throw new Error(`Overlapping spec assignment: ${spec}`);
      seen.add(spec);
      const path = ownedPath(worktree, spec);
      if (await realpath(path) !== path || !(await lstat(path)).isFile()) throw new Error('Spec must be a regular tracked source file');
      git(worktree, 'ls-files', '--error-unmatch', spec);
    }
    // Playwright treats positional selectors as regexes. Anchor and escape the exact path.
    const args = [...shard.specs.map(spec => `(?:^|/)${spec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), ...projects.map(project => `--project=${project}`)];
    if (shard.grep !== undefined) args.push('--grep', shard.grep);
    shards.push({ ...shard, args });
  }
  const parent = ownedPath(worktree, output);
  let cursor = parent;
  while (!existsSync(cursor)) cursor = resolve(cursor, '..');
  if (await realpath(cursor) !== cursor) throw new Error('Output ancestors must not be symlinks');
  try { git(worktree, 'check-ignore', parent); } catch { throw new Error('Output must be gitignored inside its worktree'); }
  return { worktree, head: plan.head, parent, shards, sourceDigest: await sourceDigest(worktree) };
}

// Third argument is a fixture-only dependency seam; the CLI never exposes resource substitutions.
export async function runFrozenSnapshot(plan, options = {}, fixture = {}) {
  return runSnapshot(plan, options, fixture);
}

// Public continuation always authenticates evidence; fixture overrides cannot enable reuse.
export async function runFrozenContinuation(request, options = {}, fixture = {}) {
  exactKeys(options, ['queueFile', 'queueOwner', 'max', 'firstPort', 'output', 'budget']);
  if (options.output && options.output !== 'artifacts/browser-continuation') throw new Error('Continuation output root is fixed');
  options = { ...options, output: 'artifacts/browser-continuation' };
  const { prepareFrozenContinuation } = await import('./run-development-checkpoint.mjs');
  const reuse = await prepareFrozenContinuation(request);
  return runSnapshot(reuse.plan, options, fixture, reuse);
}

// Fresh authentication is mandatory even when Node fixtures isolate resources.
export async function runRetainedSnapshotFreshProof(request, options = {}, fixture = {}) {
  exactKeys(options, ['queueFile', 'queueOwner', 'max', 'firstPort', 'budget']);
  if (process.versions.node.split('.')[0] !== '24') throw new Error('Fresh proof requires Node 24');
  const { prepareRetainedSnapshotFreshProof } = await import('./run-development-checkpoint.mjs');
  const reuse = await prepareRetainedSnapshotFreshProof(request);
  return runSnapshot(reuse.plan, { ...options, output: 'artifacts/retained-snapshot-fresh-proof' }, fixture, reuse);
}

async function runSnapshot(plan, { queueFile = '/tmp/sgui-browser-validation-priority.json', queueOwner, max = 2, firstPort = 6273, output = 'artifacts/browser-pool', budget = {} } = {}, fixture = {}, reuse) {
  validateLimit(max);
  if (reuse && (max > 8 || budget.maxLoad1 !== 24 || budget.maxSystemRSSBytes !== 28000 * 1024 * 1024 || Object.keys(budget).some(key => !['maxLoad1', 'maxSystemRSSBytes'].includes(key)))) throw new Error('Continuation requires max <= 8, load 24 and RSS 28000 MiB');
  validateBudget(budget);
  if (!fixture.queueFile && queueFile !== '/tmp/sgui-browser-validation-priority.json') throw new Error('Use the existing legacy priority queue; substitute queues are forbidden');
  if (queueOwner && !/^[a-f0-9-]{36}$/.test(queueOwner)) throw new Error('Queue owner must be an exact chat ID');
  if (!Number.isInteger(firstPort) || firstPort < 1024 || firstPort + max - 1 > 65535) throw new Error('Invalid pool port range');
  const prepared = await prepareSnapshot(plan, output);
  if (reuse) await reuse.check();
  const { worktree, head, parent, shards } = prepared;
  queueFile = fixture.queueFile ?? queueFile;
  const poolRoot = fixture.poolRoot ?? POOL_ROOT;
  const owner = `browser-snapshot:${process.pid}:${randomUUID()}`;
  await assertQueueDrained(queueFile, queueOwner);
  const bridge = await acquireLease(fixture.bridgePath ?? LEGACY_LOCK, owner);
  const controller = new AbortController();
  const onSignal = () => controller.abort();
  process.on('SIGINT', onSignal); process.on('SIGTERM', onSignal);
  let run, evidence, monitor, monitoring = Promise.resolve(), monitoringActive = false;
  const checkSource = async () => {
    if (reuse) await reuse.check();
    assertSource(worktree, head);
    if (await sourceDigest(worktree) !== prepared.sourceDigest) throw new Error('Source bytes changed during snapshot validation');
  };
  const command = fixture.command ?? runOwnedCommand;
  const execute = async (args, log, env = process.env) => {
    const start = performance.now();
    if (controller.signal.aborted) throw new Error('Snapshot interrupted before command admission');
    try { await command({ cwd: worktree, env, executable: 'pnpm', args, log, signal: controller.signal }); }
    catch (error) { if (error.ownedCommandUnsettled) { unsettled = true; controller.abort(); } throw error; }
    finally { evidence.commands.push({ args: ['pnpm', ...args], durationMs: performance.now() - start, log }); }
  };
  let failed = false;
  let unsettled = false;
  const cleanup = async lease => { if (!unsettled) await releaseLease(lease); };
  try {
    await assertQueueDrained(queueFile, queueOwner);
    await mkdir(parent, { recursive: true });
    run = join(parent, randomUUID()); await mkdir(run);
    await writeFile(join(run, 'owner'), owner, { flag: 'wx' }); // Retained evidence/output ownership.
    const build = reuse ? reuse.build : join(run, 'storybook');
    evidence = { mode: reuse?.mode ?? (reuse ? 'continuation' : 'snapshot'), continuation: reuse?.mode ? undefined : reuse?.attestation, freshProof: reuse?.mode ? reuse.attestation : undefined, owner, queueOwner, worktree, head, sourceTree: git(worktree, 'rev-parse', 'HEAD^{tree}'),
      sourceDigest: prepared.sourceDigest, max, firstPort, budget, build, startedAt: new Date().toISOString(), node: process.version,
      nodeExecutable: process.execPath, platform: platform(), osRelease: release(), commands: [], sessions: [], status: 'running',
      packageLockDigest: createHash('sha256').update(await readFile(join(worktree, 'pnpm-lock.yaml'))).digest('hex'),
      harnessDigest: createHash('sha256').update(await readFile(fileURLToPath(import.meta.url))).digest('hex'),
      resourceSamples: [], resourcesBefore: await sampleResources(), configuredProjects: ['chromium', 'firefox', 'webkit'] };
    await writeFile(join(run, 'evidence.json'), JSON.stringify(evidence, null, 2));
    evidence.pnpm = fixture.versions?.pnpm ?? version(worktree, 'pnpm', ['--version']);
    evidence.playwright = fixture.versions?.playwright ?? version(worktree, 'pnpm', ['exec', 'playwright', '--version']);
    monitor = setInterval(() => {
      if (monitoringActive) return;
      monitoringActive = true;
      monitoring = (async () => {
        await assertQueueDrained(queueFile, queueOwner);
        await checkSource();
        if (evidence.buildDigest && await digestTree(evidence.build) !== evidence.buildDigest) {
          throw new Error('Static build changed during snapshot validation');
        }
        const sample = await sampleResources();
        evidence.resourceSamples.push(sample);
        assertBudget(sample, budget);
      })().catch(error => {
        if (error.message.startsWith('Resource budget:')) evidence.resourceError ??= error.message;
        else evidence.integrityError ??= error.message;
        controller.abort();
      }).finally(() => { monitoringActive = false; });
    }, 1000); monitor.unref();
    await checkSource();
    assertBudget(evidence.resourcesBefore, budget);
    if (!reuse) {
      const heavy = await acquireLease(fixture.heavyPath ?? HEAVY_LOCK, owner);
      try { await execute(['exec', 'storybook', 'build', '--output-dir', build], join(run, 'build.log')); }
      finally { await cleanup(heavy); }
      evidence.buildDigest = await digestTree(build, true);
    } else {
      evidence.buildDigest = reuse.buildDigest;
      evidence.buildReused = true; evidence.buildCommands = 0;
    }
    await checkSource();
    if (!reuse || reuse.needsTypes) {
      const light = await acquireLightSlot(owner, { root: fixture.lightRoot ?? LIGHT_ROOT });
      try { await execute(['exec', 'tsc', '--noEmit', '-p', 'tests/browser/tsconfig.json'], join(run, 'types.log')); }
      finally { await cleanup(light); }
      evidence.typecheckCount = 1;
    } else evidence.typecheckCount = 0;
    await checkSource();
    for (let offset = 0; offset < shards.length && !controller.signal.aborted; offset += max) {
      await assertQueueDrained(queueFile, queueOwner); await checkSource();
      assertBudget(await sampleResources(), budget);
      if (await digestTree(build) !== evidence.buildDigest) throw new Error('Static build changed before wave');
      // Admit all wave resources before launching any command; occupied foreign resources fail closed.
      const leases = [];
      try {
        for (const shard of shards.slice(offset, offset + max)) {
          const token = `${owner}:${shard.id}`;
          const slot = await acquireSlot(poolRoot, token, max);
          const lease = { slot }; leases.push(lease);
          lease.port = firstPort + slot.slot;
          lease.portLease = await acquirePortLease(poolRoot, lease.port, token);
          lease.session = join(run, shard.id); await mkdir(lease.session);
          await writeFile(join(lease.session, 'owner'), token, { flag: 'wx' });
          lease.shard = shard;
        }
        const outcomes = await Promise.allSettled(leases.map(async lease => {
          const { shard, port, slot, session } = lease;
          const env = { ...process.env, SGUI_BROWSER_PORT: String(port), SGUI_BROWSER_BASE_URL: `http://127.0.0.1:${port}`,
            SGUI_BROWSER_STORYBOOK_DIR: build, SGUI_BROWSER_OUTPUT_DIR: join(session, 'traces'), SGUI_BROWSER_REPORT_DIR: join(session, 'report'),
            SGUI_BROWSER_RESULTS_FILE: join(session, 'results.json'), SGUI_BROWSER_IMMUTABLE: '1', CI: '1' };
          const item = { id: shard.id, specs: shard.specs, project: shard.project, grep: shard.grep ?? null, selectionArgs: shard.args, slot: slot.slot, port, session, buildDigest: evidence.buildDigest,
            startedAt: new Date().toISOString(), status: 'running' };
          evidence.sessions.push(item);
          try {
            await execute(['exec', 'playwright', 'test', ...shard.args], join(session, 'browser.log'), env);
            const results = JSON.parse(await readFile(env.SGUI_BROWSER_RESULTS_FILE, 'utf8'));
            item.cases = snapshotCases(results, shard, worktree);
            if (reuse) reuse.assertCases(shard.id, item.cases);
            item.count = item.cases.length; item.status = 'passed';
          } catch (error) { item.status = 'failed'; item.error = error.message; throw error; }
          finally {
            item.finishedAt = new Date().toISOString();
            if (reuse) {
              item.artifactHashes = {};
              for (const name of ['owner', 'results.json', 'browser.log', 'browser.log.resources.json']) {
                try { item.artifactHashes[name] = createHash('sha256').update(await readFile(join(session, name))).digest('hex'); }
                catch (error) { if (error.code !== 'ENOENT') throw error; item.artifactHashes[name] = null; }
              }
            }
            await writeFile(join(session, 'evidence.json'), JSON.stringify(item, null, 2));
          }
        }));
        if (outcomes.some(result => result.status === 'rejected')) failed = true;
      } finally {
        const cleanupResults = await Promise.allSettled(leases.map(async lease => {
          try { if (lease.portLease) await cleanup(lease.portLease); } finally { await cleanup(lease.slot); }
        }));
        if (cleanupResults.some(result => result.status === 'rejected')) throw new Error('Owner-only lease cleanup failed; foreign leases retained');
      }
      await checkSource();
    }
    if (failed || controller.signal.aborted) throw new Error('Snapshot validation incomplete; inspect session evidence');
    evidence.status = 'passed';
  } catch (error) {
    if (evidence) { evidence.status = 'failed'; evidence.error = error.message; }
    throw error;
  } finally {
    clearInterval(monitor); await monitoring;
    try {
      if (evidence) {
        try {
          evidence.finalHead = git(worktree, 'rev-parse', 'HEAD');
          evidence.finalStatus = git(worktree, 'status', '--porcelain', '--untracked-files=normal');
          evidence.finalSourceDigest = await sourceDigest(worktree);
          await checkSource();
          if (evidence.buildDigest) {
            evidence.finalBuildDigest = await digestTree(evidence.build);
            if (evidence.finalBuildDigest !== evidence.buildDigest) throw new Error('Static build changed during validation');
          }
          if (reuse?.mode) evidence.freshProofFinal = await reuse.check();
          else if (reuse) evidence.continuationFinal = await reuse.check();
          if (evidence.integrityError) throw new Error(evidence.integrityError);
          if (evidence.resourceError) throw new Error(evidence.resourceError);
        } catch (error) { evidence.status = 'failed'; evidence.integrityError = error.message; }
        if (reuse?.mode) {
          evidence.freshArtifactHashes = {};
          for (const name of ['types.log', 'types.log.resources.json']) {
            try { evidence.freshArtifactHashes[name] = createHash('sha256').update(await readFile(join(run, name))).digest('hex'); }
            catch (error) { if (error.code !== 'ENOENT') throw error; evidence.freshArtifactHashes[name] = null; }
          }
        }
        evidence.resourcesAfter = await sampleResources();
        evidence.cleanup = unsettled ? 'leases retained: owned command unsettled' : 'owned commands settled';
        evidence.finishedAt = new Date().toISOString();
        evidence.durationMs = Date.parse(evidence.finishedAt) - Date.parse(evidence.startedAt);
        const browserTimes = evidence.sessions.flatMap(item => item.finishedAt ? [Date.parse(item.startedAt), Date.parse(item.finishedAt)] : []);
        evidence.browserWindowMs = browserTimes.length ? Math.max(...browserTimes) - Math.min(...browserTimes) : 0;
        evidence.passedCases = evidence.sessions.reduce((sum, item) => sum + (item.status === 'passed' ? item.count : 0), 0);
        evidence.passedCasesPerBrowserSecond = evidence.browserWindowMs ? evidence.passedCases * 1000 / evidence.browserWindowMs : 0;
        await writeFile(join(run, 'evidence.json'), JSON.stringify(evidence, null, 2));
        console.log(`${evidence.status}: ${join(run, 'evidence.json')}`);
      }
    } finally {
      process.off('SIGINT', onSignal); process.off('SIGTERM', onSignal);
      await cleanup(bridge);
    }
    if (evidence?.status === 'failed') throw new Error(`Snapshot failed; see ${join(run, 'evidence.json')}`);
  }
  return run;
}

export async function runPool(plan, { queueFile = '/tmp/sgui-browser-validation-priority.json', queueOwner, max = 2, firstPort = 6273, output = 'artifacts/browser-pool', budget = {}, buildMax = 1 } = {}, fixture = {}) {
  validateLimit(buildMax);
  if (plan?.mode === 'snapshot' && buildMax !== 1) throw new Error('Snapshot builds exactly once; build-max is only for distinct worktrees');
  if (plan?.mode === 'snapshot') return runFrozenSnapshot(plan, { queueFile, queueOwner, max, firstPort, output, budget }, fixture);
  if (Object.keys(budget).length) throw new Error('Resource budget options require snapshot mode');
  if (!Array.isArray(plan) || plan.length === 0) throw new Error('Plan must be a nonempty JSON array');
  validateLimit(max);
  if (!fixture.queueFile && queueFile !== '/tmp/sgui-browser-validation-priority.json') throw new Error('Use the existing legacy priority queue; substitute queues are forbidden');
  if (queueOwner && !/^[a-f0-9-]{36}$/.test(queueOwner)) throw new Error('Queue owner must be an exact chat ID');
  queueFile = fixture.queueFile ?? queueFile;
  const poolRoot = fixture.poolRoot ?? POOL_ROOT;
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
    // Reject symlinked existing output ancestors, including artifacts from another checkout.
    let cursor = parent;
    while (!existsSync(cursor)) cursor = resolve(cursor, '..');
    if (await realpath(cursor) !== cursor) throw new Error('Output ancestors must not be symlinks');
    try { git(worktree, 'check-ignore', parent); } catch { throw new Error('Output must be gitignored inside its worktree'); }
    jobs.push({ ...entry, worktree, parent });
  }
  if (new Set(jobs.map(job => job.worktree)).size !== jobs.length) throw new Error('Only one job per worktree per pool run');
  await assertQueueDrained(queueFile, queueOwner);
  if (!Number.isInteger(firstPort) || firstPort < 1024 || firstPort + max - 1 > 65535) throw new Error('Invalid pool port range');
  const owner = `browser-pool:${process.pid}:${randomUUID()}`;
  // Compatibility bridge: excludes all legacy heavy/browser workers throughout this opt-in run.
  const bridge = await acquireLease(fixture.bridgePath ?? LEGACY_LOCK, owner);
  const controller = new AbortController();
  let aborted = false;
  let failed = false;
  const onSignal = () => { aborted = true; controller.abort(); };
  process.on('SIGINT', onSignal); process.on('SIGTERM', onSignal);
  let unsettled = false;
  const cleanup = async lease => { if (!unsettled) await releaseLease(lease); };
  const command = async (cwd, env, executable, args, log) => {
    try { await (fixture.command ?? runOwnedCommand)({ cwd, env, executable, args, log, signal: controller.signal }); }
    catch (error) { if (error.ownedCommandUnsettled) { unsettled = true; aborted = true; controller.abort(); } throw error; }
  };
  // Defaults remain serialized builds; explicit buildMax expands only distinct source jobs.
  const admitBuild = createAdmission(buildMax);
  const admitLight = createAdmission(4);
  async function runJob(job, stage) {
    const token = randomUUID();
    const slot = await acquireSlot(poolRoot, `${owner}:${token}`, max);
    let evidence;
    let run;
    let portLease;
    try {
      const port = firstPort + slot.slot;
      portLease = await acquirePortLease(poolRoot, port, slot.owner);
      await mkdir(job.parent, { recursive: true });
      run = join(job.parent, token);
      await mkdir(run); // Fresh output, never reuse artifacts or another worktree's server.
      await writeFile(join(run, 'owner'), slot.owner, { flag: 'wx' });
      const build = join(run, 'storybook');
      const env = { ...process.env, SGUI_BROWSER_PORT: String(port), SGUI_BROWSER_BASE_URL: `http://127.0.0.1:${port}`,
        SGUI_BROWSER_STORYBOOK_DIR: build, SGUI_BROWSER_OUTPUT_DIR: join(run, 'traces'),
        SGUI_BROWSER_REPORT_DIR: join(run, 'report'), SGUI_BROWSER_RESULTS_FILE: join(run, 'results.json'), SGUI_BROWSER_IMMUTABLE: '1' };
      evidence = { owner, queueOwner, token, worktree: job.worktree, head: job.head, sourceTree: git(job.worktree, 'rev-parse', 'HEAD^{tree}'),
        startedAt: new Date().toISOString(), node: process.version, nodeExecutable: process.execPath, platform: platform(), osRelease: release(),
        slot: slot.slot, port, baseURL: env.SGUI_BROWSER_BASE_URL, build, outputs: { run, report: env.SGUI_BROWSER_REPORT_DIR, results: env.SGUI_BROWSER_RESULTS_FILE, traces: env.SGUI_BROWSER_OUTPUT_DIR },
        configuredProjects: ['chromium', 'firefox', 'webkit'], selection: job.args, max, buildMax,
        packageLockDigest: createHash('sha256').update(await readFile(join(job.worktree, 'pnpm-lock.yaml'))).digest('hex'),
        harnessDigest: createHash('sha256').update(await readFile(fileURLToPath(import.meta.url))).digest('hex'),
        commands: [['pnpm', 'exec', 'storybook', 'build', '--output-dir', build], ['pnpm', 'exec', 'tsc', '--noEmit', '-p', 'tests/browser/tsconfig.json'], ['pnpm', 'exec', 'playwright', 'test', ...job.args]], status: 'running' };
      await writeFile(join(run, 'evidence.json'), JSON.stringify(evidence, null, 2));
      await assertQueueDrained(queueFile, queueOwner);
      await assertPortFree(port);
      evidence.pnpm = fixture.versions?.pnpm ?? version(job.worktree, 'pnpm', ['--version']);
      evidence.playwright = fixture.versions?.playwright ?? version(job.worktree, 'pnpm', ['exec', 'playwright', '--version']);
      const finishBuild = await admitBuild();
      try {
        await command(job.worktree, env, 'pnpm', ['exec', 'storybook', 'build', '--output-dir', build], join(run, 'build.log'));
        evidence.buildDigest = await digestTree(build, true);
      } finally { finishBuild(); }
      if (git(job.worktree, 'rev-parse', 'HEAD') !== job.head || git(job.worktree, 'status', '--porcelain')) throw new Error('Source changed during build');
      const finishLight = await admitLight();
      let light;
      try {
        light = await acquireLightSlot(`${owner}:${token}`, { root: fixture.lightRoot ?? LIGHT_ROOT });
        await command(job.worktree, env, 'pnpm', ['exec', 'tsc', '--noEmit', '-p', 'tests/browser/tsconfig.json'], join(run, 'types.log'));
      } finally { try { if (light) await cleanup(light); } finally { finishLight(); } }
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
          evidence.cleanup = unsettled ? 'leases retained: owned command unsettled' : 'owned commands settled';
          evidence.finishedAt = new Date().toISOString();
          await writeFile(join(run, 'evidence.json'), JSON.stringify(evidence, null, 2));
          console.log(`${evidence.status}: ${join(run, 'evidence.json')}`);
        }
      } finally { try { if (portLease) await cleanup(portLease); } finally { await cleanup(slot); } }
    }
  }
  try {
    await assertQueueDrained(queueFile, queueOwner); // Recheck after acquiring the compatibility bridge.
    for (let offset = 0; !aborted && offset < jobs.length; offset += max) {
      const wave = jobs.slice(offset, offset + max);
      const stage = createStage(wave.length);
      const heavy = await acquireLease(fixture.heavyPath ?? HEAVY_LOCK, owner);
      let outcomes;
      try {
        outcomes = await Promise.allSettled(wave.map(async job => {
          try { await runJob(job, stage); } finally { stage.arrive(job.worktree); }
        }));
      } finally { await cleanup(heavy); }
      if (outcomes.some(result => result.status === 'rejected')) failed = true;
    }
    if (failed || aborted) throw new Error('Pool validation incomplete; inspect per-job evidence');
  } finally {
    process.off('SIGINT', onSignal); process.off('SIGTERM', onSignal);
    await cleanup(bridge);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('node scripts/browser-validation-pool.mjs --plan <json> --queue-file <absolute legacy queue> [--owner <first priority chat ID>] [--max <sessions>] [--first-port 6273] [--output artifacts/browser-pool] [--build-max <distinct worktree builds>] [--min-free-mib <MiB>] [--max-load <1m load>] [--max-system-rss-mib <MiB>]');
  } else {
    const options = {};
    const allowed = new Set(['--plan', '--queue-file', '--owner', '--max', '--first-port', '--output', '--min-free-mib', '--max-load', '--max-system-rss-mib', '--build-max']);
    for (let i = 0; i < args.length; i += 2) {
      if (!allowed.has(args[i]) || !args[i + 1] || options[args[i]]) throw new Error('Invalid arguments; see --help');
      options[args[i]] = args[i + 1];
    }
    try {
      const plan = JSON.parse(await readFile(options['--plan'], 'utf8'));
      await runPool(plan, { queueFile: options['--queue-file'], queueOwner: options['--owner'], max: Number(options['--max'] ?? 2), firstPort: Number(options['--first-port'] ?? 6273), output: options['--output'] ?? 'artifacts/browser-pool', buildMax: Number(options['--build-max'] ?? 1), budget: Object.fromEntries([['minFreeMemoryBytes', options['--min-free-mib'] && Number(options['--min-free-mib']) * 1048576], ['maxLoad1', options['--max-load'] && Number(options['--max-load'])], ['maxSystemRSSBytes', options['--max-system-rss-mib'] && Number(options['--max-system-rss-mib']) * 1048576]].filter(([, value]) => value !== undefined)) });
    } catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
