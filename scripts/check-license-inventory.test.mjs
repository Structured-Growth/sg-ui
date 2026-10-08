import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { inventory, parseLock } from './check-license-inventory.mjs';

const lock = `lockfileVersion: '9.0'
importers:
  .:
    dependencies:
      runtime:
        specifier: 1.0.0
        version: 1.0.0(peer@2.0.0)
    devDependencies:
      peer:
        specifier: 2.0.0
        version: 2.0.0
      tooling:
        specifier: ^3.0.0
        version: 3.0.0
packages:
  runtime@1.0.0:
    resolution: {integrity: inert}
  child@1.1.0:
    resolution: {integrity: inert}
  peer@2.0.0:
    resolution: {integrity: inert}
  tooling@3.0.0:
    resolution: {integrity: inert}
snapshots:
  runtime@1.0.0(peer@2.0.0):
    dependencies:
      child: 1.1.0
      peer: 2.0.0
  child@1.1.0: {}
  peer@2.0.0: {}
  tooling@3.0.0:
    dependencies:
      child: 1.1.0
`;
const manifest = { name: 'inert-fixture', version: '0.0.0', license: 'SEE LICENSE IN LICENSE', files: ['dist', 'LICENSE', 'THIRD_PARTY_NOTICES.md'], dependencies: { runtime: '1.0.0' }, devDependencies: { peer: '2.0.0', tooling: '^3.0.0' }, peerDependencies: { peer: '^2.0.0' } };
async function put(root, file, value) {
  await mkdir(join(root, file, '..'), { recursive: true });
  await writeFile(join(root, file), typeof value === 'string' ? value : JSON.stringify(value));
}
async function installed(root, name, version, overrides = {}, suffix = '') {
  const base = `node_modules/.pnpm/${name}@${version}${suffix}/node_modules/${name}`;
  await put(root, `${base}/package.json`, { name, version, license: 'MIT', repository: { url: 'https://invalid.example/inert' }, ...overrides });
  await put(root, `${base}/LICENSE`, 'Inert fixture license text; no legal conclusion.');
  return base;
}
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'sgui-license-fixture-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await put(root, 'package.json', manifest);
  await put(root, 'pnpm-lock.yaml', lock);
  await put(root, 'node_modules/.pnpm/lock.yaml', lock);
  await put(root, 'LICENSE', 'Inert commercial placeholder');
  await put(root, 'THIRD_PARTY_NOTICES.md', 'Inert notice placeholder\n## runtime 1.0.0 (MIT)\n## peer 2.0.0 (MIT)\n');
  await mkdir(join(root, 'dist'));
  for (const [name, version] of [['runtime', '1.0.0'], ['child', '1.1.0'], ['peer', '2.0.0'], ['tooling', '3.0.0']]) {
    const base = await installed(root, name, version);
    if (name !== 'child') await symlink(join(root, base), join(root, 'node_modules', name), 'dir');
  }
  return root;
}
const codes = report => report.issues.map(issue => issue.code);

test('resolved scopes distinguish direct, shared transitive, peers and development', async t => {
  const report = await inventory(await fixture(t));
  assert.deepEqual(report.issues, []);
  assert.equal(report.packages.find(pkg => pkg.name === 'child').relationship, 'transitive');
  assert.deepEqual(report.packages.find(pkg => pkg.name === 'child').scopes, ['dev', 'runtime']);
  assert.deepEqual(report.packages.find(pkg => pkg.name === 'peer').scopes, ['dev', 'peer-realization', 'runtime']);
  assert.deepEqual(report.peers[0].resolutions, ['peer@2.0.0']);
  assert.equal(report.project.license, manifest.license);
  assert.equal(report.packages[0].metadata[0].evidence[0].sha256.length, 64);
});

test('deterministic across repository paths and read-only for input/legal bytes', async t => {
  const first = await fixture(t);
  const second = await fixture(t);
  const before = await Promise.all(['package.json', 'pnpm-lock.yaml', 'LICENSE', 'THIRD_PARTY_NOTICES.md'].map(file => readFile(join(first, file))));
  assert.deepEqual(await inventory(first), await inventory(second));
  assert.deepEqual(await inventory(first), await inventory(first));
  const after = await Promise.all(['package.json', 'pnpm-lock.yaml', 'LICENSE', 'THIRD_PARTY_NOTICES.md'].map(file => readFile(join(first, file))));
  assert.deepEqual(after, before);
  assert.ok(!JSON.stringify(await inventory(first)).includes(first));
});

test('missing installed lock, package metadata, legal files and distribution roots stay unknown', async t => {
  const root = await fixture(t);
  await rm(join(root, 'node_modules/.pnpm/lock.yaml'));
  await rm(join(root, 'node_modules/.pnpm/child@1.1.0'), { recursive: true });
  await rm(join(root, 'dist'), { recursive: true });
  await rm(join(root, 'LICENSE'));
  const report = await inventory(root);
  for (const code of ['missing-installed-lock', 'missing-installed-metadata', 'missing-distribution-root', 'missing-project-legal-file']) assert.ok(codes(report).includes(code), code);
  assert.deepEqual(report.packages.find(pkg => pkg.name === 'child').metadata, []);
});

test('manifest/installed lock/direct metadata mismatches and unlocked entries are findings', async t => {
  const root = await fixture(t);
  await put(root, 'package.json', { ...manifest, dependencies: { runtime: '^1.0.0', absent: '9.0.0' } });
  await put(root, 'node_modules/.pnpm/lock.yaml', `${lock}\n# stale install\n`);
  await put(root, 'node_modules/runtime/package.json', { name: 'wrong', version: '9.0.0', license: 'MIT' });
  await installed(root, 'extra', '4.0.0');
  const report = await inventory(root);
  for (const code of ['manifest-lock-mismatch', 'installed-lock-mismatch', 'direct-metadata-mismatch', 'missing-direct-resolution', 'unlocked-installed-package']) assert.ok(codes(report).includes(code), code);
});

test('ambiguous licenses, missing provenance and missing license files never become approval', async t => {
  const root = await fixture(t);
  await installed(root, 'child', '1.1.0', { license: 'Apache-2.0' }, '_another-peer');
  await installed(root, 'tooling', '3.0.0', { license: null, licenses: [{ type: 'MIT' }], repository: null });
  await rm(join(root, 'node_modules/.pnpm/tooling@3.0.0/node_modules/tooling/LICENSE'));
  const report = await inventory(root);
  for (const code of ['ambiguous-installed-evidence', 'unknown-license', 'missing-package-provenance', 'missing-license-file']) assert.ok(codes(report).includes(code), code);
  assert.equal(report.packages.find(pkg => pkg.name === 'child').metadata.length, 2);
});

test('distributed assets receive hashes and explicit unknown provenance; symlinks/patterns are unresolved', async t => {
  const root = await fixture(t);
  await put(root, 'dist/icon.svg', '<svg/>');
  await put(root, 'dist/font.woff2', 'inert');
  await symlink(join(root, 'LICENSE'), join(root, 'dist/external.svg'));
  await put(root, 'package.json', { ...manifest, files: [...manifest.files, '../outside', 'dist/**/*.png'] });
  const report = await inventory(root);
  assert.deepEqual(report.assets.map(asset => [asset.path, asset.provenance]), [['dist/font.woff2', 'unknown'], ['dist/icon.svg', 'unknown']]);
  assert.ok(codes(report).includes('unresolved-distribution-symlink'));
  assert.equal(report.issues.filter(issue => issue.code === 'unsupported-distribution-pattern').length, 2);
});

test('pnpm aliases/unsupported versions fail explicitly, missing edges remain findings', async t => {
  assert.throws(() => parseLock(lock.replace("'9.0'", "'8.0'")), /Only pnpm/);
  assert.throws(() => parseLock(lock.replace('child@1.1.0:', 'child@link:local:')), /Unsupported pnpm/);
  const root = await fixture(t);
  await put(root, 'pnpm-lock.yaml', lock.replace('child: 1.1.0', 'child: 8.0.0'));
  assert.ok(codes(await inventory(root)).includes('missing-lock-package'));
});

test('notice headings compare identities and exact license metadata without rewriting terms', async t => {
  const root = await fixture(t);
  await put(root, 'THIRD_PARTY_NOTICES.md', '## runtime 1.0.0 (Apache-2.0)\n## retired 7.0.0 (MIT)\n## Other retained attribution\n');
  const before = await readFile(join(root, 'THIRD_PARTY_NOTICES.md'));
  const report = await inventory(root);
  for (const code of ['notice-metadata-license-difference', 'unmatched-notice-reference', 'missing-notice-reference', 'unparsed-notice-heading']) assert.ok(codes(report).includes(code), code);
  assert.deepEqual(await readFile(join(root, 'THIRD_PARTY_NOTICES.md')), before);
  assert.equal(report.notices[0].locked, true);
  assert.equal(report.notices[1].locked, false);
});

test('scoped packages, cycles, optional edges and equal peer instances are deterministic', async t => {
  const root = await fixture(t);
  const extraLock = lock.replace('packages:\n', 'packages:\n  \'@scope/optional@5.0.0\':\n    resolution: {integrity: inert}\n')
    .replace('  child@1.1.0: {}', "  child@1.1.0:\n    optionalDependencies:\n      '@scope/optional': 5.0.0")
    .replace('snapshots:\n', "snapshots:\n  '@scope/optional@5.0.0':\n    dependencies:\n      runtime: 1.0.0(peer@2.0.0)\n");
  await put(root, 'pnpm-lock.yaml', extraLock);
  await put(root, 'node_modules/.pnpm/lock.yaml', extraLock);
  // Scoped physical store paths need not match a pnpm slot naming heuristic.
  await put(root, 'node_modules/.pnpm/scoped_slot/node_modules/@scope/optional/package.json', { name: '@scope/optional', version: '5.0.0', license: 'MIT', repository: 'inert' });
  await put(root, 'node_modules/.pnpm/scoped_slot/node_modules/@scope/optional/LICENSE', 'inert');
  await installed(root, 'child', '1.1.0', {}, '_same-peer');
  const report = await inventory(root);
  assert.deepEqual(report.issues, []);
  assert.deepEqual(report.packages.find(pkg => pkg.name === '@scope/optional').scopes, ['dev', 'runtime']);
  assert.equal(report.packages.find(pkg => pkg.name === 'child').metadata.length, 2);
});

test('CLI uses exit 0 for complete fixture evidence, 1 for findings, 2 for input failure', async t => {
  const root = await fixture(t);
  const script = new URL('./check-license-inventory.mjs', import.meta.url).pathname;
  const run = args => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  const good = run([root]);
  assert.equal(good.status, 0, good.stderr);
  assert.equal(JSON.parse(good.stdout).schemaVersion, 1);
  await rm(join(root, 'LICENSE'));
  const missing = run([root]);
  assert.equal(missing.status, 1);
  assert.ok(codes(JSON.parse(missing.stdout)).includes('missing-project-legal-file'));
  assert.equal(run(['--install']).status, 2);
  await put(root, 'pnpm-lock.yaml', 'invalid');
  assert.equal(run([root]).status, 2);
});
