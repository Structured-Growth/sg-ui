import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFile, mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

export async function consumerFixture(prefix, env = process.env) {
  const root = resolve(env.SGUI_CONSUMER_ROOT || tmpdir());
  await mkdir(root, { recursive: true });
  return mkdtemp(join(root, prefix));
}

// External mode never reads live dist or repacks. Each fixture owns identical bytes.
export async function consumerTarball(fixture, env = process.env) {
  const pack = join(fixture, 'pack');
  await mkdir(pack);
  if (!env.SGUI_CONSUMER_TARBALL) {
    execFileSync('pnpm', ['pack', '--pack-destination', pack], { stdio: 'inherit' });
    const files = (await readdir(pack)).filter(name => name.endsWith('.tgz'));
    assert.equal(files.length, 1, 'Expected exactly one tarball');
    return join(pack, files[0]);
  }
  assert.match(env.SGUI_CONSUMER_SHA256 || '', /^[a-f0-9]{64}$/, 'External tarball requires SHA-256');
  const artifact = join(pack, 'candidate.tgz');
  await copyFile(resolve(env.SGUI_CONSUMER_TARBALL), artifact);
  const sha256 = createHash('sha256').update(await readFile(artifact)).digest('hex');
  assert.equal(sha256, env.SGUI_CONSUMER_SHA256, 'Consumer candidate changed');
  await writeFile(join(fixture, 'artifact.json'), JSON.stringify({ sha256, node: process.version, external: true }, null, 2));
  return artifact;
}
