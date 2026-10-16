import { readdir, readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const inputPaths = [
  'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', '.nvmrc',
  'packages/ui/README.md', 'packages/ui/LICENSE', 'packages/ui/THIRD_PARTY_NOTICES.md',
  'packages/ui/package.json', 'packages/ui/tsconfig.json', 'packages/ui/tsconfig.build.json',
  'packages/ui/src', 'packages/ui/scripts', 'packages/ui/playwright.config.ts',
  'packages/ui/tests/browser', 'apps/docs/package.json', 'apps/docs/native-fixtures',
  '.github/workflows/ci.yml',
];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export async function inventory(root, paths) {
  const entries = {};
  async function visit(path) {
    // The native host regenerates these indexes from the hashed manifest/scenarios.
    if (['apps/docs/native-fixtures/registry.json', 'apps/docs/native-fixtures/public/index.json'].includes(path)) return;
    const absolute = resolve(root, path);
    const { lstat } = await import('node:fs/promises');
    const stat = await lstat(absolute);
    if (stat.isSymbolicLink()) throw new Error(`Refusing symlink in evidence: ${path}`);
    if (stat.isDirectory()) {
      for (const name of (await readdir(absolute)).sort()) await visit(`${path}/${name}`);
    } else if (stat.isFile()) entries[path] = sha256(await readFile(absolute));
    else throw new Error(`Unsupported evidence file: ${path}`);
  }
  for (const path of paths) await visit(path);
  return Object.fromEntries(Object.entries(entries).sort(([a], [b]) => a.localeCompare(b, 'en')));
}
export async function begin(root) {
  // Fixed repository-owned paths only. Never clean an arbitrary caller path.
  for (const path of ['packages/ui/dist', 'packages/ui/browser-docs-static', 'packages/ui/artifacts']) {
    await rm(resolve(root, path), { recursive: true, force: true });
  }
  await mkdir(resolve(root, 'packages/ui/artifacts/logs'), { recursive: true });
  const inputs = await inventory(root, inputPaths);
  await writeFile(resolve(root, 'packages/ui/artifacts/logs/build-inputs.json'), JSON.stringify({
    schemaVersion: 1, capturedAt: new Date().toISOString(), inputs,
  }, null, 2) + '\n');
}
export async function complete(root, metadata = {}) {
  const logs = resolve(root, 'packages/ui/artifacts/logs');
  const before = JSON.parse(await readFile(resolve(logs, 'build-inputs.json'), 'utf8'));
  const inputs = await inventory(root, inputPaths);
  if (JSON.stringify(before.inputs) !== JSON.stringify(inputs)) throw new Error('Build inputs changed during validation');
  const outputs = await inventory(root, ['packages/ui/dist', 'packages/ui/browser-docs-static']);
  for (const file of ['packages/ui/dist/index.js', 'packages/ui/dist/index.d.ts', 'packages/ui/dist/styles.css', 'packages/ui/browser-docs-static/index.html']) {
    if (!outputs[file] || (await readFile(resolve(root, file))).length === 0) throw new Error(`Missing/empty output: ${file}`);
  }
  const fixtureCSS = Object.keys(outputs).filter(file => file.startsWith('packages/ui/browser-docs-static/') && file.endsWith('.css'));
  if (!fixtureCSS.length || !(await Promise.all(fixtureCSS.map(file => readFile(resolve(root, file))))).some(bytes => bytes.length)) throw new Error('Missing native fixture CSS');
  const tarballs = (await readdir(resolve(root, 'packages/ui/artifacts'))).filter(name => name.endsWith('.tgz'));
  if (tarballs.length !== 1) throw new Error(`Expected exactly one validated tarball; found ${tarballs.length}`);
  const tarball = `packages/ui/artifacts/${tarballs[0]}`;
  if (!(await readFile(resolve(root, tarball))).length) throw new Error('Empty validated tarball');
  const receipt = {
    schemaVersion: 1, startedAt: before.capturedAt, completedAt: new Date().toISOString(),
    ...metadata, inputHash: sha256(JSON.stringify(inputs)), inputs, outputs,
    tarball: { path: tarball, sha256: sha256(await readFile(resolve(root, tarball))) },
    scope: 'Fresh library/native-docs build and validated CI tarball; not publication or release approval',
  };
  await writeFile(resolve(logs, 'build-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
  return receipt;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
  if (process.argv[2] === 'begin') await begin(root);
  else if (process.argv[2] === 'complete') await complete(root, {
    head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    node: process.version,
    pnpm: execFileSync('pnpm', ['--version'], { cwd: root, encoding: 'utf8' }).trim(),
    runURL: process.env.GITHUB_RUN_ID ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` : null,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
  });
  else throw new Error('Usage: node scripts/ci-artifacts.mjs begin|complete');
}
