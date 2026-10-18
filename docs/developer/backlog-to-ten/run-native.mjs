import { resolve, dirname, delimiter } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const task = dirname(fileURLToPath(import.meta.url)), root = resolve(task, '../../..'), ui = resolve(root, 'packages/ui');
const pool = await import(pathToFileURL(resolve(ui, 'scripts/browser-validation-pool.mjs')));
if (process.versions.node.split('.')[0] !== '24') throw Error('Node 24 required');
const name = process.argv[2]; if (!/^[a-z0-9-]+$/.test(name ?? '')) throw Error('Fresh run name required');
const output = resolve(task, name), owner = `backlog-to-ten-${name}-${process.pid}`;
const claims = [], controller = new AbortController(); let server, unsettled = false;
process.once('SIGTERM', () => controller.abort()); process.once('SIGINT', () => controller.abort());
const save = (name, value) => writeFile(resolve(output, name), JSON.stringify(value, null, 2) + '\n');
async function inputs() {
  const hashes = {};
  async function walk(dir) {
    for (const entry of await readdir(resolve(root, dir), { withFileTypes: true })) {
      const path = dir + '/' + entry.name;
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile() && !['apps/docs/native-fixtures/registry.json', 'apps/docs/native-fixtures/public/index.json'].includes(path)) hashes[path] = createHash('sha256').update(await readFile(resolve(root, path))).digest('hex');
    }
  }
  for (const dir of ['packages/ui/src', 'apps/docs/theme', 'apps/docs/native-fixtures', 'packages/ui/tests/browser']) await walk(dir);
  return hashes;
}
async function stage(name, args) {
  console.log('START ' + name);
  try { await pool.runOwnedCommand({ cwd: ui, executable: process.execPath, args, log: resolve(output, name + '.log'), signal: controller.signal,
    env: { ...process.env, PATH: dirname(process.execPath) + delimiter + process.env.PATH, SGUI_BACKLOG_OUTPUT: output, PWTEST_CACHE_DIR: resolve(output, 'transform-cache') } }); }
  catch (error) { unsettled ||= error.ownedCommandUnsettled === true; throw error; }
  console.log('PASS ' + name);
}
try {
  claims.push(await pool.acquireLease(pool.LEGACY_LOCK, owner));
  claims.push(await pool.acquireLease(pool.HEAVY_LOCK, owner));
  claims.push(await pool.acquirePortLease(pool.POOL_ROOT, 6173, owner));
  await mkdir(output);
  const before = await inputs(); await save('inputs.json', before);
  await save('identity.json', { head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), node: process.version, owner, startedAt: new Date().toISOString(), workingTree: true });
  if (process.argv[3]) {
    const prior = resolve(task, process.argv[3]);
    const admission = JSON.parse(await readFile(resolve(prior, 'admission.json'), 'utf8'));
    const previous = JSON.parse(await readFile(resolve(prior, 'inputs.json'), 'utf8'));
    // Tests may change between continuations; production/fixture inputs may not.
    const production = value => Object.fromEntries(Object.entries(value).filter(([path]) => !path.startsWith('packages/ui/tests/browser/')));
    if (JSON.stringify(production(before)) !== JSON.stringify(production(previous)) || admission.dist !== await pool.digestTree(resolve(ui, 'dist')) || admission.host !== await pool.digestTree(resolve(ui, 'browser-docs-static'))) throw Error('Prior build is not reusable');
    await save('reuse.json', { prior, verifiedProductionAndOutputIdentity: true });
  } else {
    await stage('library-build', [resolve(ui, 'scripts/build.mjs')]);
    await stage('fixture-build', [resolve(ui, 'scripts/build-browser-docs.mjs')]);
  }
  await stage('browser-types', [resolve(ui, 'node_modules/typescript/bin/tsc'), '--noEmit', '-p', 'tests/browser/tsconfig.json']);
  const dist = await pool.digestTree(resolve(ui, 'dist')), host = await pool.digestTree(resolve(ui, 'browser-docs-static'));
  await save('admission.json', { dist, host, stableSource: JSON.stringify(before) === JSON.stringify(await inputs()) });
  if (JSON.stringify(before) !== JSON.stringify(await inputs())) throw Error('Source drift');
  server = await (await import(pathToFileURL(resolve(ui, 'scripts/serve-browser-docs.mjs')))).startServer({ ...process.env, SGUI_BROWSER_DOCS_DIR: resolve(ui, 'browser-docs-static'), SGUI_BROWSER_PORT: '6173', SGUI_BROWSER_BASE_URL: 'http://127.0.0.1:6173', SGUI_BROWSER_IMMUTABLE: '1' });
  let failure;
  try { await stage('native', [resolve(ui, 'node_modules/@playwright/test/cli.js'), 'test', '--config', resolve(task, 'native.config.cjs'), ...process.argv.slice(4)]); }
  catch (error) { failure = String(error); }
  const stable = JSON.stringify(before) === JSON.stringify(await inputs()) && dist === await pool.digestTree(resolve(ui, 'dist')) && host === await pool.digestTree(resolve(ui, 'browser-docs-static'));
  await save('execution.json', { failure: failure ?? null, stable, completedAt: new Date().toISOString() });
  if (!stable || failure) throw Error(failure ?? 'Source/output drift');
} catch (error) { console.error(error); process.exitCode = 1; }
finally {
  if (server) { server.closeAllConnections(); await new Promise(done => server.close(done)); }
  if (!unsettled) for (const claim of claims.reverse()) await pool.releaseLease(claim);
}
