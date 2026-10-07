// Standalone environment probe: no Storybook, shared config, or personal profiles.
import { spawn, spawnSync } from 'node:child_process';
import { access, mkdir, mkdtemp, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { homedir, platform, release, tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('node scripts/diagnose-firefox-profile.mjs --owner <chat-id> [--playwright-module <absolute-package-dir>] [--metadata-only]');
  process.exit(0);
}
const allowed = new Set(['--owner', '--playwright-module', '--metadata-only']);
const options = {};
for (let i = 0; i < args.length; i++) {
  const key = args[i];
  if (!allowed.has(key) || (key !== '--metadata-only' && (!args[i + 1] || args[i + 1].startsWith('--')))) {
    throw new Error(`Invalid argument: ${key}; use --help`);
  }
  options[key] = key === '--metadata-only' ? true : args[++i];
}
const require = createRequire(import.meta.url);
const moduleName = options['--playwright-module'] ? resolve(options['--playwright-module']) : '@playwright/test';
const { firefox } = require(moduleName);
const version = require(`${moduleName}/package.json`).version;
const executable = firefox.executablePath();
const appData = join(homedir(), 'Library/Application Support/Firefox');
const report = { node: process.version, platform: platform(), osRelease: release(), playwright: version, executable, probes: [] };
try {
  await readdir(appData);
  report.appDataListing = 'readable (contents not collected)';
} catch (error) {
  report.appDataListing = error.code;
}
await access(executable, constants.X_OK);
if (options['--metadata-only']) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}
const owner = options['--owner'];
if (!owner || !/^[a-zA-Z0-9-]+$/.test(owner)) throw new Error('A chat ID is required as --owner');
const lock = '/tmp/sgui-parallel-batch-01-validation.lock';
try {
  await mkdir(lock);
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.error('Shared browser lock is occupied; no browser launched.');
  process.exit(2);
}
let root;
let retainRoot = false;
try {
  await writeFile(join(lock, 'owner'), owner);
  root = await mkdtemp(join(tmpdir(), 'sgui-firefox-diagnostic-'));
  const profile = join(root, 'persistent-profile');
  await mkdir(profile);
  await writeFile(join(profile, 'write-probe'), 'owned temporary profile');
  await rm(join(profile, 'write-probe'));
  report.profile = await realpath(profile);
  report.profileWritable = true;
  let context;
  try {
    context = await firefox.launchPersistentContext(report.profile, { headless: true, timeout: 10000 });
    const page = await context.newPage();
    await page.goto('about:blank', { timeout: 5000 });
    report.probes.push({ name: 'explicit-persistent-profile', status: 'page-opened' });
  } catch (error) {
    report.probes.push({ name: 'explicit-persistent-profile', status: 'failed', error: error.message });
  } finally {
    await context?.close();
  }
  report.persistentProfileEntries = (await readdir(profile)).length;
  const nativeProfile = join(root, 'native-profile');
  await mkdir(nativeProfile);
  const screenshot = join(root, 'native.png');
  const nativeArgs = ['--no-remote', '--headless', '--profile', await realpath(nativeProfile), '--screenshot', screenshot, 'about:blank'];
  const native = await new Promise((complete, reject) => {
    const child = spawn(executable, nativeArgs, { detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    let timedOut = false;
    const cleanupErrors = [];
    const collect = chunk => { output = (output + chunk.toString()).slice(-12000); };
    child.stdout.on('data', collect);
    child.stderr.on('data', collect);
    // Signal only this owned process group, never other workers or user browsers.
    const kill = phase => {
      try {
        process.kill(-child.pid, 'SIGKILL');
        return true;
      } catch (error) {
        if (error.code === 'ESRCH') return true;
        cleanupErrors.push({ phase, code: error.code, error: error.message });
        return false;
      }
    };
    const result = (code, signal) => ({ name: 'native-explicit-profile', args: nativeArgs, code, signal, timedOut, output, cleanupErrors });
    const timer = setTimeout(() => {
      timedOut = true;
      // A failed signal may never produce close. Report the failure without
      // deleting a profile that the owned child may still be using.
      if (!kill('timeout')) complete({ ...result(null, null), childMayStillBeRunning: true });
    }, 10000);
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', () => {
      clearTimeout(timer);
      kill('exit');
    });
    child.once('close', (code, signal) => {
      complete(result(code, signal));
    });
  });
  try { await access(screenshot); native.screenshotCreated = true; } catch { native.screenshotCreated = false; }
  native.status = !native.timedOut && native.code === 0 && native.screenshotCreated ? 'page-captured' : 'failed';
  report.probes.push(native);
  retainRoot = native.childMayStillBeRunning === true;
  if (retainRoot) report.retainedTemporaryRoot = root;
  report.nativeProfileEntries = (await readdir(nativeProfile)).length;
  report.resolved = report.probes.every(probe => probe.status !== 'failed' && !probe.cleanupErrors?.length);
  console.log(JSON.stringify(report, null, 2));
  if (!report.resolved) process.exitCode = 1;
} finally {
  try {
    if (root && !retainRoot) await rm(root, { recursive: true, force: true });
  } finally {
    // Shared policy requires Python cleanup that verifies the exact owner first.
    const cleanup = spawnSync('python3', ['-c',
      'import pathlib,sys; p=pathlib.Path(sys.argv[1]); o=p/"owner"; owned=o.is_file() and o.read_text()==sys.argv[2]; owned and o.unlink(); owned and p.rmdir(); sys.exit(0 if owned else 1)',
      lock, owner], { encoding: 'utf8' });
    if (cleanup.status !== 0) {
      console.error('Lock cleanup did not verify ownership; inspect the lock without removing another owner.', cleanup.stderr);
      process.exitCode = 1;
    }
  }
}
