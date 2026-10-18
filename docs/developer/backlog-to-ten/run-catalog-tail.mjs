// Serialized production comparison using identical host/runner bytes.
import { resolve, dirname, delimiter } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdir, readFile, writeFile, copyFile, symlink } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const task = dirname(fileURLToPath(import.meta.url)), root = resolve(task, '../../..'), ui = resolve(root, 'packages/ui');
const pool = await import(pathToFileURL(resolve(ui, 'scripts/browser-validation-pool.mjs')));
const require = createRequire(resolve(ui, 'package.json'));
const { build, preview } = await import(pathToFileURL(require.resolve('vite')));
if (process.versions.node.split('.')[0] !== '24') throw Error('Node24 required');
const name = process.argv[2]; if (!/^[a-z0-9-]+$/.test(name ?? '')) throw Error('Fresh output name required');
const diagnosticOnly = false;
const candidateOnly = true;
const output = resolve(task, name), claims = [], controller = new AbortController(); let server, unsettled = false;
process.once('SIGINT', () => controller.abort()); process.once('SIGTERM', () => controller.abort());
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const save = (name, value) => writeFile(resolve(output, name), JSON.stringify(value, null, 2) + '\n');
const previous = JSON.parse(await readFile(resolve(root, 'docs/developer/final-acceptance/wave-04/09/batch-implementation/runs/profile-01/profile-window.json'), 'utf8'));
const baselineManifest = JSON.parse(await readFile(resolve(previous.fixture, 'package.json'), 'utf8'));
const archive = resolve(previous.fixture, baselineManifest.dependencies['@structured-growth/sg-ui'].slice(5));
if (sha(await readFile(archive)) !== previous.artifactSha256) throw Error('Baseline archive drift');
const candidateHead = 'c7b2192dbb6d51284a64135ab5ebbebb4cd8fd91';
const sourceJoin=JSON.parse(await readFile(resolve(task,'source-input-join-03.json'),'utf8'));
if(sourceJoin.sourceCommit!==candidateHead||!sourceJoin.allSourceFilesMatchCommit)throw Error('Exact source join required');
const receipt = { node: process.version, baseline: { headReference: previous.trackedHead, archive, sha256: previous.artifactSha256 }, candidate: { headReference: candidateHead, workingTree: true }, steps: [], limits: ['Both artifacts use the owned foundation; no original MUI comparison.', 'Head references alone do not identify uncommitted package bytes; distribution manifests and baseline archive do.', 'Single Apple M4 host, Chromium desktop; no approved timing/memory budgets, physical input or INP claim.'] };
async function stage(name, args, env = {}) {
  console.log('START ' + name);
  try { await pool.runOwnedCommand({ cwd: ui, executable: process.execPath, args, log: resolve(output, name + '.log'), signal: controller.signal, env: { ...process.env, PATH: dirname(process.execPath) + delimiter + process.env.PATH, ...env } }); }
  catch (error) { unsettled ||= error.ownedCommandUnsettled === true; throw error; }
  receipt.steps.push({ name, args, passed: true }); await save('execution.json', receipt); console.log('PASS ' + name);
}
try {
  const owner = `backlog-performance-${process.pid}`;
  claims.push(await pool.acquireLease(pool.LEGACY_LOCK, owner)); claims.push(await pool.acquireLease(pool.HEAVY_LOCK, owner)); claims.push(await pool.acquirePortLease(pool.POOL_ROOT, 4179, owner));
  await mkdir(output);
  receipt.startedAt = new Date().toISOString();
  const dist = await pool.digestTree(resolve(ui, 'dist'));
  if(dist!==sourceJoin.distribution)throw Error('Current distribution differs from exact-source package audit');
  receipt.candidate.dist = dist; receipt.baseline.dist = await pool.digestTree(resolve(previous.packageRoot, 'dist'));
  if(candidateOnly) {
    receipt.comparisonReference='performance-06/candidate-catalog.json';
    await copyFile(resolve(task,'performance-06','candidate-catalog.json'),resolve(output,'previous-candidate-catalog.json'));
    receipt.baseline.referenceOnly=true;
  }
  await save('execution.json', receipt);
  for (const [label, packageRoot, head] of [['baseline', previous.packageRoot, previous.trackedHead], ['candidate', ui, candidateHead]]) {
    if (diagnosticOnly && label !== 'baseline' || candidateOnly && label === 'baseline') continue;
    const project = resolve(output, label), host = resolve(project, 'tests/performance');
    await mkdir(host, { recursive: true }); await mkdir(resolve(project, 'tests/consumers'));
    await symlink(resolve(ui, 'node_modules'), resolve(project, 'node_modules'), 'dir');
    await writeFile(resolve(project, 'package.json'), '{"private":true,"type":"module"}\n');
    for (const file of ['fixture.tsx', 'index.html', 'measure-browser.mjs']) await copyFile(resolve(ui, 'tests/performance', file), resolve(host, file));
    await copyFile(resolve(ui, 'tests/consumers/performance-proof-policy.mjs'), resolve(project, 'tests/consumers/performance-proof-policy.mjs'));
    const config = `import {defineConfig} from 'vite';import {fileURLToPath} from 'node:url';import {resolve} from 'node:path';const root=fileURLToPath(new URL('.',import.meta.url)),dist=process.env.SGUI_PERF_PACKAGE_DIST;if(!dist)throw Error('Explicit compiled distribution required');export default defineConfig({root,resolve:{dedupe:['react','react-dom'],alias:[{find:'@structured-growth/sg-ui/styles.css',replacement:resolve(dist,'styles.css')},{find:'@structured-growth/sg-ui/experimental',replacement:resolve(dist,'experimental/index.js')},{find:'@structured-growth/sg-ui/components/AppDataGrid',replacement:resolve(dist,'components/AppDataGrid/index.js')},{find:'@structured-growth/sg-ui',replacement:resolve(dist,'index.js')}]},build:{outDir:resolve(root,'dist'),emptyOutDir:true},preview:{host:'127.0.0.1',port:4179,strictPort:true}});\n`;
    await writeFile(resolve(host, 'vite.config.mjs'), config);
    process.env.SGUI_PERF_PACKAGE_DIST = resolve(packageRoot, 'dist');
    await build({ configFile: resolve(host, 'vite.config.mjs'), logLevel: 'error' });
    server = await preview({ configFile: resolve(host, 'vite.config.mjs'), logLevel: 'error' });
    // Establish the previously failing selector boundary before spending the
    // full matrix window. A diagnostic never substitutes for the 12-run result.
    if (label === 'baseline') await stage('selector-diagnostic', [resolve(host, 'measure-browser.mjs'), resolve(output, 'selector-diagnostic.json'), 'processing', 'selector', diagnosticOnly ? '12' : '1'], { SGUI_PERF_SOURCE_HEAD: head });
    if (!diagnosticOnly) for (const renderer of ['catalog']) await stage(`${label}-${renderer}`, [resolve(host, 'measure-browser.mjs'), resolve(output, `${label}-${renderer}.json`), renderer, 'largePage'], { SGUI_PERF_SOURCE_HEAD: head });
    server.httpServer.closeAllConnections(); await new Promise(done => server.httpServer.close(done)); server = undefined;
  }
  if (dist !== await pool.digestTree(resolve(ui, 'dist')) || receipt.baseline.dist !== await pool.digestTree(resolve(previous.packageRoot, 'dist'))) throw Error('Distribution drift');
  receipt.complete = false; receipt.diagnosticComplete = true; receipt.selectedWorkloads=['catalog:largePage']; receipt.fullAcceptanceMatrix=false;

} catch (error) { receipt.failure = String(error.stack ?? error); console.error(error); process.exitCode = 1; }
finally {
  if (server) { server.httpServer.closeAllConnections(); await new Promise(done => server.httpServer.close(done)); }
  receipt.finishedAt = new Date().toISOString(); await save('execution.json', receipt).catch(() => {});
  if (!unsettled) for (const claim of claims.reverse()) await pool.releaseLease(claim);
}
