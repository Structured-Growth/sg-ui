import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const testRoot = fileURLToPath(new URL('.', import.meta.url));
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { consumerFixture, consumerTarball } from './consumer-artifact.mjs';

test('external candidate is copied byte-for-byte into independently owned fixtures', async () => {
  const root = await mkdtemp(join(testRoot, 'sgui-artifact-unit-'));
  try {
    const input = join(root, 'input.tgz'); const bytes = Buffer.from('artifact identity probe');
    await writeFile(input, bytes);
    const env = { SGUI_CONSUMER_ROOT: root, SGUI_CONSUMER_TARBALL: input,
      SGUI_CONSUMER_SHA256: createHash('sha256').update(bytes).digest('hex') };
    const a = await consumerFixture('a-', env); const b = await consumerFixture('b-', env);
    const first = await consumerTarball(a, env); const second = await consumerTarball(b, env);
    assert.notEqual(first, second); assert.deepEqual(await readFile(first), bytes);
    await writeFile(input, 'changed candidate');
    assert.deepEqual(await readFile(second), bytes);
    assert.equal(JSON.parse(await readFile(join(a, 'artifact.json'))).sha256, env.SGUI_CONSUMER_SHA256);
  } finally { await rm(root, { recursive: true, force: true }); }
});
test('external candidate hash mismatch stops before any package install', async () => {
  const root = await mkdtemp(join(testRoot, 'sgui-artifact-unit-'));
  try {
    const input = join(root, 'input.tgz'); await writeFile(input, 'wrong bytes');
    const fixture = await consumerFixture('negative-', { SGUI_CONSUMER_ROOT: root });
    await assert.rejects(consumerTarball(fixture, { SGUI_CONSUMER_TARBALL: input,
      SGUI_CONSUMER_SHA256: '0'.repeat(64) }), /Consumer candidate changed/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
