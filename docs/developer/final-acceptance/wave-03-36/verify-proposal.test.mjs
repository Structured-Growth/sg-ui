import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../..');
const pnpmDir = resolve(root, 'node_modules/.pnpm');
const yamlPackage = readdirSync(pnpmDir).find(name => /^js-yaml@4\./.test(name));
if (!yamlPackage) throw new Error('Existing js-yaml 4 package required for read-only YAML validation; do not install into shared checkout');
const yaml = createRequire(import.meta.url)(resolve(pnpmDir, yamlPackage, 'node_modules/js-yaml'));
const load = path => yaml.load(readFileSync(path, 'utf8'), { json: false });
const pins = JSON.parse(readFileSync(resolve(here, 'remote/action-pins.json')));
const files = ['ci.yml', 'release.yml', 'pr-title.yml', 'ai-code.yml'];
const pair = file => [load(resolve(root, '.github/workflows', file)), load(resolve(here, 'proposed-files/.github/workflows', file))];
test('workflow YAML parses; all external action references match captured upstream commits', () => {
  for (const file of files) {
    const [, proposed] = pair(file);
    for (const job of Object.values(proposed.jobs)) for (const step of job.steps ?? []) {
      if (!step.uses) continue;
      const [repo, sha] = step.uses.split('@');
      assert.match(sha, /^[a-f0-9]{40}$/);
      assert.equal(sha, pins.find(pin => pin.repository === repo)?.sha);
      if (repo === 'actions/setup-node') assert.equal(step.with['cache-dependency-path'], 'pnpm-lock.yaml');
      assert.equal(step['continue-on-error'], undefined);
    }
  }
});
test('event paths, token permissions, validation dependency and AI safeguards stay intact', () => {
  for (const file of files) {
    const [current, proposed] = pair(file);
    for (const key of ['on', 'permissions', 'concurrency']) assert.deepEqual(proposed[key], current[key]);
    assert.deepEqual(Object.keys(proposed.jobs), Object.keys(current.jobs));
    for (const id of Object.keys(current.jobs)) {
      const before = current.jobs[id], after = proposed.jobs[id];
      for (const key of ['name', 'if', 'needs', 'uses', 'permissions', 'strategy', 'defaults', 'runs-on']) assert.deepEqual(after[key], before[key]);
      if (file !== 'ci.yml' && before.steps) {
        assert.deepEqual(after.steps.map(step => ({ ...step, uses: undefined, with: step.with && Object.fromEntries(Object.entries(step.with).filter(([k]) => k !== 'cache-dependency-path')) })), before.steps.map(step => ({ ...step, uses: undefined, with: step.with })));
      }
    }
  }
  const [, ci] = pair('ci.yml');
  for (const before of pair('ci.yml')[0].jobs.validate.steps.filter(step => step.run)) {
    assert(ci.jobs.validate.steps.some(step => step.run === before.run), `Mandatory command removed: ${before.run}`);
  }
});
test('fresh-output receipt precedes success uploads; failures retain logs and docs traces', () => {
  const [, ci] = pair('ci.yml'), steps = ci.jobs.validate.steps;
  const index = fragment => steps.findIndex(step => step.run?.includes(fragment));
  assert(index('ci-artifacts.mjs begin') < index('pnpm check'));
  assert(index('ci-artifacts.mjs complete') > index('pnpm pack'));
  assert(index('ci-artifacts.mjs complete') < steps.findIndex(step => step.name === 'Upload validated package'));
  assert.equal(steps.find(step => step.name === 'Upload validation results').if, 'always()');
  assert.equal(steps.find(step => step.name === 'Browser interactions, accessibility and performance smoke')['timeout-minutes'], 45);
  for (const step of steps.filter(step => step.uses?.startsWith('actions/upload-artifact@'))) {
    assert.equal(step.with['retention-days'], 14);
    if (step.name.startsWith('Upload validated')) assert.equal(step.with['if-no-files-found'], 'error');
  }
  const docs = ci.jobs.docs.steps;
  const upload = docs.find(step => step.name === 'Upload docs validation and failure traces');
  assert.equal(upload.if, 'always()'); assert.match(upload.with.path, /apps\/docs\/test-results/);
  for (const step of docs.filter(step => step.run?.includes('| tee'))) assert.equal(step.shell, 'bash');
});
test('all proposed shell run blocks pass bash syntax parsing without execution', () => {
  for (const file of files) for (const job of Object.values(pair(file)[1].jobs)) for (const step of job.steps ?? []) {
    if (!step.run) continue;
    const bash = step.run.replace(/\$\{\{[\s\S]*?\}\}/g, 'EXPRESSION');
    const result = spawnSync('bash', ['-n'], { input: bash, encoding: 'utf8' });
    assert.equal(result.status, 0, `${file}: ${step.name ?? step.run}: ${result.stderr}`);
  }
});
