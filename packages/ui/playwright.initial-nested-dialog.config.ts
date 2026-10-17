import { defineConfig, devices } from '@playwright/test';
import { isAbsolute } from 'node:path';
const baseURL = process.env.SGUI_INITIAL_STACK_BASE_URL;
const output = process.env.SGUI_INITIAL_STACK_OUTPUT;
if (!baseURL || !/^http:\/\/127\.0\.0\.1:\d+$/.test(baseURL) || new URL(baseURL).port === '3000' || !output || !isAbsolute(output)) {
 throw new Error('Use the coordinator isolated loopback host and absolute SGUI_INITIAL_STACK_OUTPUT; user3000 is forbidden.');
}
export default defineConfig({
 testDir: './tests/browser', testMatch: 'initial-nested-dialog.spec.ts', workers: 1, retries: 0, forbidOnly: true,
 outputDir: `${output}/traces`, reporter: [['list'], ['json', { outputFile: `${output}/results.json` }]],
 use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
 projects: [
  { name: 'chromium', use: devices['Desktop Chrome'] },
  { name: 'firefox', use: devices['Desktop Firefox'] },
  { name: 'webkit', use: devices['Desktop Safari'] },
 ],
 // No webServer: coordinator owns the frozen fixture host/build and serial lease.
});
