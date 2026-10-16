import {defineConfig, devices} from '@playwright/test';
// Coordinator starts an immutable built docs-owned native host separately.
const baseURL = process.env.SGUI_VISUAL_BASE_URL;
const output = process.env.SGUI_VISUAL_OUTPUT;
if (!baseURL || !/^http:\/\/127\.0\.0\.1:\d+$/.test(baseURL) || !output) {
  throw new Error('Set SGUI_VISUAL_BASE_URL to the coordinator loopback host and SGUI_VISUAL_OUTPUT to an absolute evidence directory.');
}
export default defineConfig({
  testDir:'./tests/browser',testMatch:'visual-acceptance.spec.ts',workers:1,retries:0,
  timeout:60_000,outputDir:`${output}/traces`,
  snapshotPathTemplate:`${output}/baselines/{projectName}/{testFilePath}/{arg}{ext}`,
  reporter:[['list'],['json',{outputFile:`${output}/results.json`}]],
  use:{baseURL,trace:'retain-on-failure'},
  projects:[{name:'chromium',use:devices['Desktop Chrome']}],
});
