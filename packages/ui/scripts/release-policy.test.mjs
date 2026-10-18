import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { analyzeCommits } from '@semantic-release/commit-analyzer';
import config from '../release.config.mjs';

// Import only the installed pure version calculator, never semantic-release's
// entry point or its credential/network/publish lifecycle.
const require = createRequire(import.meta.url);
const { default: getNextVersion } = await import(pathToFileURL(join(dirname(require.resolve('semantic-release')), 'lib/get-next-version.js')));
const nextVersion = (type, version) => getNextVersion({
  branch: { name: 'main', type: 'release', tags: [] },
  nextRelease: { type }, lastRelease: version ? { version } : {}, logger: { log() {} },
});

const analyzerOptions = config.plugins.find(([name]) => name === '@semantic-release/commit-analyzer')[1];
async function analyze(messages) {
  return analyzeCommits(analyzerOptions, {
    cwd: process.cwd(),
    commits: messages.map((message, i) => ({ message, hash: `commit-${i}` })),
    logger: { log() {} },
  });
}

test('published release policy recognizes fixes, features and both breaking markers', async () => {
  for (const [message, expected] of [
    ['fix: preserve modal focus', 'patch'],
    ['perf: reduce grid work', 'patch'],
    ['feat: add a new button variant', 'minor'],
    ['feat!: remove a legacy prop', 'major'],
    ['fix(grid)!: remove a legacy selection API', 'major'],
    ['refactor: simplify the API\n\nBREAKING CHANGE: remove the deprecated prop', 'major'],
  ]) {
    assert.equal(await analyze([message]), expected, message);
  }
});

test('maintenance and documentation do not publish a package', async () => {
  assert.equal(await analyze(['docs: explain routing', 'chore: update tooling', 'ci: revise checks', 'test: cover focus', 'refactor: reorganize helpers', 'build: update tools']), null);
});

test('the largest change since the previous release determines the version bump', async () => {
  assert.equal(await analyze(['fix: repair focus', 'feat: add a button']), 'minor');
  assert.equal(await analyze(['feat: add a button', 'fix!: change the event signature', 'docs: explain migration']), 'major');
});

test('PR-title validation accepts release markers and rejects unparseable titles', () => {
  for (const [title, valid] of [
    ['fix: restore keyboard focus', true],
    ['feat(button): add a compact variant', true],
    ['feat!: remove the deprecated prop', true],
    ['docs: clarify the commercial license', true],
    ['Update UI', false],
    ['fix:', false],
    ['feature: add a button', false],
  ]) {
    const result = spawnSync('pnpm', ['exec', 'commitlint'], { input: `${title}\n`, encoding: 'utf8' });
    assert.equal(result.error, undefined);
    assert.equal(result.status === 0, valid, `${title}\n${result.stdout}\n${result.stderr}`);
  }
});

test('first publication uses the configured initial version while an existing release gets the analyzed major', async () => {
  for (const message of ['feat!: remove a legacy public API', 'refactor: replace public contracts\n\nBREAKING CHANGE: replace the old event contract']) {
    const impact = await analyze([message]);
    assert.equal(impact, 'major');
    assert.equal(nextVersion(impact), '1.0.0');
    assert.equal(nextVersion(impact, '1.4.2'), '2.0.0');
    assert.equal(nextVersion(impact, '0.9.0'), '1.0.0');
  }
});

test('release defaults are main-only and disable issue/PR notification hooks', () => {
  assert.deepEqual(config.branches, ['main']);
  assert.equal(config.tagFormat, 'v${version}');
  assert.equal(config.plugins.some(([name]) => name === '@semantic-release/git'), false);
  const github = config.plugins.find(([name]) => name === '@semantic-release/github')[1];
  for (const option of ['successCommentCondition', 'failCommentCondition', 'releasedLabels', 'addReleases']) assert.equal(github[option], false, option);
});
