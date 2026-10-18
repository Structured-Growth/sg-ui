import { resolve, dirname, delimiter } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const task = dirname(fileURLToPath(import.meta.url)), root = resolve(task, '../../..'), ui = resolve(root, 'packages/ui');
const pool = await import(pathToFileURL(resolve(ui, 'scripts/browser-validation-pool.mjs')));
if (process.versions.node.split('.')[0] !== '24') throw Error('Node24 required');
const name = process.argv[2]; if (!/^[a-z0-9-]+$/.test(name ?? '')) throw Error('Fresh output name required');
const output = resolve(task, name), claims = [], controller = new AbortController(); let unsettled = false;
process.once('SIGINT', () => controller.abort()); process.once('SIGTERM', () => controller.abort());
const receipt = { steps: [], limits: ['Local retained candidate only; no official Actions artifact or release claim.', 'React19.2.3/Node24 measured here; prior broader compatibility receipts retain their exact scope.'] };
const save = () => writeFile(resolve(output, 'execution.json'), JSON.stringify(receipt, null, 2) + '\n');
async function stage(name, args) {
  console.log('START ' + name);
  try { await pool.runOwnedCommand({ cwd: ui, executable: process.execPath, args, log: resolve(output, name + '.log'), signal: controller.signal,
    env: { ...process.env, PATH: dirname(process.execPath) + delimiter + process.env.PATH } }); }
  catch (error) { unsettled ||= error.ownedCommandUnsettled === true; throw error; }
  receipt.steps.push({ name, args, passed: true }); await save(); console.log('PASS ' + name);
}
try {
  const owner = `backlog-bundles-${process.pid}`;
  claims.push(await pool.acquireLease(pool.LEGACY_LOCK, owner)); claims.push(await pool.acquireLease(pool.HEAVY_LOCK, owner));
  await mkdir(output);
  receipt.node = process.version; receipt.dist = await pool.digestTree(resolve(ui, 'dist'));
  await stage('package-audit', [resolve(ui, 'scripts/check-package.mjs'), '--retain-packed=' + resolve(output, 'package')]);
  const directory = resolve(output, 'package');
  const archives = (await readdir(directory)).filter(name => name.endsWith('.tgz'));
  if (archives.length !== 1) throw Error('Expected one audited archive');
  const archive = resolve(directory, archives[0]), digest = createHash('sha256').update(await readFile(archive)).digest('hex');
  receipt.archive = { path: archive, sha256: digest }; await save();
  await stage('installed-consumer', [resolve(ui, 'scripts/run-acceptance-consumers.mjs'), '--tarball', archive, '--expected-sha256', digest, '--output', resolve(output, 'matrix'), '--only', 'foundation19']);
  const fixtures = resolve(output, 'matrix/fixtures');
  const fixture = (await readdir(fixtures)).find(name => name.startsWith('sgui-foundation-consumer-'));
  if (!fixture) throw Error('No independently installed consumer');
  await stage('import-bundles', [resolve(ui, 'scripts/audit-packed-import-boundaries.mjs'), resolve(fixtures, fixture), resolve(output, 'import-bundles.json')]);
  if (receipt.dist !== await pool.digestTree(resolve(ui, 'dist'))) throw Error('Distribution changed during packed measurement');
  receipt.complete = true;
} catch (error) { receipt.failure = String(error.stack ?? error); console.error(error); process.exitCode = 1; }
finally { receipt.finishedAt = new Date().toISOString(); await save().catch(() => {}); if (!unsettled) for (const claim of claims.reverse()) await pool.releaseLease(claim); }
