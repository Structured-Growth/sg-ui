import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { begin, complete } from './ci-artifacts.mjs';
// Scratch stays alongside this test, so the review mirror never writes shared output.
const scratch = dirname(fileURLToPath(import.meta.url));
async function fixture(t) {
  const root = await mkdtemp(resolve(scratch, '.ci-artifacts-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  async function put(path, text = 'current') {
    await mkdir(dirname(resolve(root, path)), { recursive: true });
    await writeFile(resolve(root, path), text);
  }
  for (const path of ['packages/ui/README.md', 'packages/ui/LICENSE', 'packages/ui/THIRD_PARTY_NOTICES.md', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', '.nvmrc', 'packages/ui/package.json', 'packages/ui/tsconfig.json', 'packages/ui/tsconfig.build.json', 'packages/ui/src/index.ts', 'packages/ui/scripts/build.mjs', 'packages/ui/playwright.config.ts', 'packages/ui/tests/browser/proof.spec.ts', 'apps/docs/package.json', 'apps/docs/native-fixtures/main.tsx', '.github/workflows/ci.yml']) await put(path);
  async function outputs() {
    for (const path of ['packages/ui/dist/index.js', 'packages/ui/dist/index.d.ts', 'packages/ui/dist/styles.css', 'packages/ui/browser-docs-static/index.html', 'packages/ui/browser-docs-static/assets/app.css', 'packages/ui/artifacts/sgui.tgz']) await put(path);
  }
  return { root, put, outputs };
}
test('clean start removes stale dist, native host and tarballs; receipt binds current inputs and bytes', async t => {
  const f = await fixture(t);
  await f.outputs(); await f.put('packages/ui/artifacts/old.tgz');
  await begin(f.root);
  await assert.rejects(readFile(resolve(f.root, 'packages/ui/dist/index.js')), { code: 'ENOENT' });
  await assert.rejects(readFile(resolve(f.root, 'packages/ui/browser-docs-static/index.html')), { code: 'ENOENT' });
  await assert.rejects(readFile(resolve(f.root, 'packages/ui/artifacts/old.tgz')), { code: 'ENOENT' });
  await f.outputs();
  await f.put('apps/docs/native-fixtures/registry.json', 'regenerated');
  await f.put('apps/docs/native-fixtures/public/index.json', 'regenerated');
  const r = await complete(f.root, { head: 'test-head' });
  assert.equal(r.head, 'test-head'); assert.match(r.tarball.sha256, /^[a-f0-9]{64}$/);
  assert.equal(r.outputs['packages/ui/dist/styles.css'], r.outputs['packages/ui/browser-docs-static/assets/app.css']);
  assert.equal(JSON.parse(await readFile(resolve(f.root, 'packages/ui/artifacts/logs/build-receipt.json'))).inputHash, r.inputHash);
});
test('changed source or missing stylesheet cannot produce a successful receipt', async t => {
  const f = await fixture(t); await begin(f.root); await f.outputs();
  await f.put('packages/ui/src/index.ts', 'changed');
  await assert.rejects(complete(f.root), /inputs changed/);
  await f.put('packages/ui/src/index.ts', 'current');
  await rm(resolve(f.root, 'packages/ui/dist/styles.css'));
  await assert.rejects(complete(f.root), /Missing\/empty output/);
  await f.put('packages/ui/dist/styles.css');
  await rm(resolve(f.root, 'packages/ui/browser-docs-static/assets/app.css'));
  await assert.rejects(complete(f.root), /Missing native fixture CSS/);
});
test('extra stale package and symlink output fail closed', async t => {
  const f = await fixture(t); await begin(f.root); await f.outputs();
  await f.put('packages/ui/artifacts/stale.tgz');
  await assert.rejects(complete(f.root), /exactly one/);
  await rm(resolve(f.root, 'packages/ui/artifacts/stale.tgz'));
  await symlink(resolve(f.root, 'package.json'), resolve(f.root, 'packages/ui/dist/leak.js'));
  await assert.rejects(complete(f.root), /Refusing symlink/);
});
