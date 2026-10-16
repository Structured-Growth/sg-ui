// Coordinator execution only. No source build, pack, shared output or shared server.
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { finished } from 'node:stream/promises';
import { chmod, copyFile, cp, mkdir, readFile, readdir, symlink, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const option = key => { const i = argv.indexOf(key); return i < 0 ? undefined : argv[i + 1]; };
const repo = resolve(here, '../../../..');
const ui = join(repo, 'packages/ui');
const major = Number(process.versions.node.split('.')[0]);
assert([22, 24].includes(major) && (major !== 22 || Number(process.versions.node.split('.')[1]) >= 12), 'Use supported Node >=22.12 on 22, or Node24');
assert(option('--tarball') && option('--output'), 'Required: --tarball /absolute/candidate.tgz --output /new/absolute/evidence-dir');
const output = resolve(option('--output'));
await mkdir(output); // Existing destination is rejected; no evidence overwrite.
const sha = async path => createHash('sha256').update(await readFile(path)).digest('hex');
const artifact = join(output, 'candidate.tgz');
await copyFile(resolve(option('--tarball')), artifact);
await chmod(artifact, 0o444);
const artifactSha256 = await sha(artifact);
const driver = join(output, 'driver');
const fixtures = join(output, 'fixtures');
await mkdir(join(driver, 'scripts'), { recursive: true }); await mkdir(fixtures);
// Tool dependencies belong to the driver only. Consumer installs are independent.
await symlink(join(ui, 'node_modules'), join(driver, 'node_modules'), 'dir');
for (const name of ['test-foundation-consumer.mjs', 'test-editor-consumer.mjs', 'test-next-consumer.mjs', 'consumer-artifact.mjs', 'consumer-css-proof.mjs', 'consumer-types-proof.mjs']) {
  await copyFile(join(ui, 'scripts', name), join(driver, 'scripts', name));
}
for (const name of ['package-consumer.tsx', 'packed-browser.mjs']) await copyFile(join(ui, 'scripts', name), join(driver, 'scripts', name));
await cp(join(ui, 'scripts/fixtures/editor-packed-browser'), join(driver, 'scripts/fixtures/editor-packed-browser'), { recursive: true });
const inventory = async (root, prefix = '', accept = () => true) => {
  const records = {};
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const relative = join(prefix, entry.name);
    if (entry.isDirectory() && !['node_modules', 'cache', '.git'].includes(entry.name)) Object.assign(records, await inventory(root, relative, accept));
    else if (entry.isFile() && accept(relative)) records[relative] = await sha(join(root, relative));
  }
  return records;
};
const all = [
  ['foundation18', 'test-foundation-consumer.mjs', '--react18'],
  ['foundation19', 'test-foundation-consumer.mjs'],
  ['editor18', 'test-editor-consumer.mjs', '--react18'],
  ['editor19', 'test-editor-consumer.mjs'],
  ['next19', 'test-next-consumer.mjs'],
];
const selected = option('--only')?.split(',');
assert(!selected || selected.every(name => all.some(row => row[0] === name)), 'Unknown --only scope');
const manifest = { startedAt: new Date().toISOString(), node: process.version, pnpm: execFileSync('pnpm', ['--version'], {encoding:'utf8'}).trim(),
  artifactSha256, browserRequested: argv.includes('--browser'), engineSelection: process.env.SGUI_BROWSER_ENGINES || 'chromium,firefox,webkit',
  driverInputs: await inventory(driver), cases: [], retainedFixtures: [], limits: ['Next always runs browsers; Vite browser hydration requires --browser.', 'Driver symlink supplies test tools only; no consumer aliases or workspace links.', 'TypeScript5.9.3 only; no broader supported TS range inferred.'] };
const save = () => writeFile(join(output, 'matrix.json'), JSON.stringify(manifest, null, 2));
await save();
for (const [name, script, ...args] of all.filter(row => !selected || selected.includes(row[0]))) {
  const command = [join(driver, 'scripts', script), ...args, ...(argv.includes('--browser') && name !== 'next19' ? ['--browser'] : [])];
  const stdout = createWriteStream(join(output, name + '.stdout.txt'));
  const stderr = createWriteStream(join(output, name + '.stderr.txt'));
  const child = spawn(process.execPath, command, { cwd: driver, env: { ...process.env,
    SGUI_CONSUMER_ROOT: fixtures, SGUI_CONSUMER_TARBALL: artifact, SGUI_CONSUMER_SHA256: artifactSha256 }, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.pipe(stdout); child.stderr.pipe(stderr);
  const result = await new Promise(resolve => {
    child.on('error', error => resolve({ error: String(error), code: null }));
    child.on('close', (code, signal) => resolve({ code, signal }));
  });
  await Promise.all([finished(stdout), finished(stderr)]);
  manifest.cases.push({ name, command: [process.execPath, ...command], ...result, passed: result.code === 0 });
  if (await sha(artifact) !== artifactSha256) { manifest.artifactChanged = true; await save(); throw Error('Frozen tarball mutated'); }
  await save();
}
for (const name of await readdir(fixtures)) {
  const path = join(fixtures, name);
  const record = { name, files: await inventory(path) };
  try {
    record.installedGraph = JSON.parse(execFileSync('pnpm', ['list', '--depth', 'Infinity', '--json'], { cwd: path, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));
    await writeFile(join(path, 'installed-graph.json'), JSON.stringify(record.installedGraph, null, 2));
    // Traverse the actual installed graph, including nested dependencies.
    const retired = [];
    function visit(value) {
      if (!value || typeof value !== 'object') return;
      for (const [key, child] of Object.entries(value)) {
        if (/^@(?:mui|emotion)\//.test(key)) retired.push(key);
        visit(child);
      }
    }
    visit(record.installedGraph); record.retiredDependencies = [...new Set(retired)];
    if (retired.length) record.error = 'Retired dependency installed';
    delete record.installedGraph;
  } catch (error) { record.error = String(error); }
  manifest.retainedFixtures.push(record);
}
manifest.finishedAt = new Date().toISOString();
manifest.browserArtifacts = await inventory(join(driver, 'artifacts')).catch(() => ({}));
await save();
process.exitCode = manifest.cases.every(row => row.passed) && manifest.retainedFixtures.every(row => !row.error) ? 0 : 1;
console.log(`Consumer matrix retained at ${output}; result ${process.exitCode === 0 ? 'pass' : 'fail'}`);
