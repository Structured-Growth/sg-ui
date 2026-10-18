import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, mkdirSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import ts from 'typescript';
import {pathToFileURL} from 'node:url';

// Transpile the actual maintained config; native Node22.12 does not load .ts.
// Keep its emitted module beside the original so relative imports/import.meta
// retain the real config's repository context in both parent and worker children.
const originalConfig = resolve(import.meta.dirname, '../playwright.visual-acceptance.config.ts');
const emittedConfig = resolve(import.meta.dirname, `../.visual-capture-config-${randomUUID()}.mjs`);
writeFileSync(emittedConfig, ts.transpileModule(readFileSync(originalConfig, 'utf8'), {
  compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext},
  fileName: originalConfig,
}).outputText, {flag: 'wx'});
after(() => rmSync(emittedConfig, {force: true}));
const config = pathToFileURL(emittedConfig).href;
function setup(t) {
  const root = mkdtempSync(join(tmpdir(), 'sgui-visual-capture-admission-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  return join(root, 'capture');
}
function load(output, extra = {}, args = []) {
  const env = {...process.env, SGUI_VISUAL_MODE: 'capture', SGUI_VISUAL_OUTPUT: output,
    SGUI_VISUAL_BASE_URL: 'http://127.0.0.1:6173'};
  delete env.TEST_WORKER_INDEX; delete env.SGUI_VISUAL_CAPTURE_RUN;
  return spawnSync(process.execPath, ['--input-type=module', '--eval',
    `const {default:config}=await import(${JSON.stringify(config)}); console.log(JSON.stringify({policy:config.updateSnapshots,workers:config.workers,retries:config.retries}));`,
    '--', ...args], {env: {...env, ...extra}, encoding: 'utf8'});
}

test('fresh parent admission permits its worker config reload with capture policy intact', t => {
  const output = setup(t), parent = load(output);
  assert.equal(parent.status, 0, parent.stderr);
  const admission = JSON.parse(readFileSync(join(output, 'capture-admission.json'), 'utf8'));
  assert.equal(admission.output, output); assert.ok(admission.run);
  mkdirSync(join(output, 'traces'));
  const worker = load(output, {TEST_WORKER_INDEX: '0', SGUI_VISUAL_CAPTURE_RUN: admission.run});
  assert.equal(worker.status, 0, worker.stderr);
  assert.deepEqual(JSON.parse(worker.stdout.trim()), {policy: 'all', workers: 1, retries: 0});
});

test('worker reload refuses missing admission', t => {
  const result = load(setup(t), {TEST_WORKER_INDEX: '0', SGUI_VISUAL_CAPTURE_RUN: 'absent'});
  assert.notEqual(result.status, 0); assert.match(result.stderr, /ENOENT/);
});

test('worker reload refuses mismatched or missing run binding', t => {
  const output = setup(t); assert.equal(load(output).status, 0);
  for (const extra of [{TEST_WORKER_INDEX: '0', SGUI_VISUAL_CAPTURE_RUN: 'another-run'}, {TEST_WORKER_INDEX: '0'}]) {
    const result = load(output, extra);
    assert.notEqual(result.status, 0); assert.match(result.stderr, /Worker requires this parent capture admission/);
  }
});

test('parent refuses existing candidate destination even with a prior admission', t => {
  const output = setup(t); assert.equal(load(output).status, 0);
  mkdirSync(join(output, 'candidates')); writeFileSync(join(output, 'candidates', 'retained.png'), 'retained');
  const result = load(output);
  assert.notEqual(result.status, 0); assert.match(result.stderr, /Capture output must be a new directory/);
  assert.equal(readFileSync(join(output, 'candidates', 'retained.png'), 'utf8'), 'retained');
});

test('snapshot update flags cannot bypass fresh admission', t => {
  const result = load(setup(t), {}, ['--update-snapshots']);
  assert.notEqual(result.status, 0); assert.match(result.stderr, /snapshot-update flags are forbidden/);
});
