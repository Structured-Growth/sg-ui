import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { analyzeCommits } from '@semantic-release/commit-analyzer';
import config from '../release.config.mjs';

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
