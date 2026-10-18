import {defineConfig, devices} from '@playwright/test';
import {isAbsolute, resolve} from 'node:path';
import {existsSync, mkdirSync, readFileSync, writeFileSync, lstatSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {visualBaselineNames, validateVisualBaseline} from './scripts/visual-baseline-review.mjs';
// Coordinator starts an immutable built docs-owned native host separately.
const baseURL = process.env.SGUI_VISUAL_BASE_URL;
const output = process.env.SGUI_VISUAL_OUTPUT;
if (!baseURL || !/^http:\/\/127\.0\.0\.1:\d+$/.test(baseURL) || !output || !isAbsolute(output)) {
  throw new Error('Set SGUI_VISUAL_BASE_URL to the coordinator loopback host and SGUI_VISUAL_OUTPUT to an absolute evidence directory.');
}
const mode = process.env.SGUI_VISUAL_MODE ?? 'compare';
if (!['capture', 'compare'].includes(mode)) throw new Error('SGUI_VISUAL_MODE must be capture or compare');
// CLI snapshot flags must not bypass review or silently replace approved files.
if (process.argv.some(argument => /^--update-snapshots(?:=|$)/.test(argument) || argument === '-u')) {
  throw new Error('Use capture mode in a fresh output directory; snapshot-update flags are forbidden.');
}
let baselines: string;
if (mode === 'capture') {
  const admissionPath = resolve(output, 'capture-admission.json');
  if (process.env.TEST_WORKER_INDEX !== undefined) {
    // Playwright reloads this config in workers after creating output/traces.
    // Only the parent's fresh admission may be reused, never another capture.
    const admission = JSON.parse(readFileSync(admissionPath, 'utf8'));
    if (!lstatSync(admissionPath).isFile() || !process.env.SGUI_VISUAL_CAPTURE_RUN ||
      admission.run !== process.env.SGUI_VISUAL_CAPTURE_RUN || admission.output !== output) {
      throw new Error('Worker requires this parent capture admission');
    }
  } else {
    if (existsSync(output)) throw new Error('Capture output must be a new directory');
    const run = randomUUID();
    mkdirSync(output);
    writeFileSync(admissionPath, JSON.stringify({run, output, parentPid: process.pid}), {flag: 'wx'});
    process.env.SGUI_VISUAL_CAPTURE_RUN = run;
  }
  baselines = `${output}/candidates`;
} else {
  baselines = process.env.SGUI_VISUAL_BASELINES ?? '';
  const receiptPath = process.env.SGUI_VISUAL_REVIEW ?? '';
  if (!isAbsolute(baselines) || !isAbsolute(receiptPath)) throw new Error('Comparison requires absolute SGUI_VISUAL_BASELINES and SGUI_VISUAL_REVIEW');
  const errors = validateVisualBaseline({receiptPath, baselineRoot: baselines, repositoryRoot: resolve(import.meta.dirname, '../..')});
  if (errors.length) throw new Error(`Reviewed ${visualBaselineNames.length}-image baseline required:\n${errors.join('\n')}`);
}
export default defineConfig({
  updateSnapshots: mode === 'capture' ? 'all' : 'none',
  testDir:'./tests/browser',testMatch:'visual-acceptance.spec.ts',workers:1,retries:0,
  timeout:60_000,outputDir:`${output}/traces`,
  snapshotPathTemplate:`${baselines}/{projectName}/{testFilePath}/{arg}{ext}`,
  reporter:[['list'],['json',{outputFile:`${output}/results.json`}]],
  use:{baseURL,trace:'retain-on-failure'},
  projects:[{name:'chromium',use:devices['Desktop Chrome']}],
});
