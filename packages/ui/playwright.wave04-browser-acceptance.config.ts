import { defineConfig, devices } from '@playwright/test';
import { isAbsolute } from 'node:path';
const baseURL = process.env.SGUI_ACCEPTANCE_BASE_URL;
const output = process.env.SGUI_ACCEPTANCE_OUTPUT;
if (!baseURL || !/^http:\/\/127\.0\.0\.1:\d+$/.test(baseURL) || new URL(baseURL).port === '3000' ||
    !output || !isAbsolute(output)) throw new Error('Use an isolated coordinator loopback host and absolute SGUI_ACCEPTANCE_OUTPUT. User3000 is forbidden.');
export default defineConfig({
  testDir: './tests/browser',
  // Three new finite cases and the existing nine removed/surviving-opener cases.
  // --grep narrows a continuation without repeating already accepted cases.
  testMatch: ['wave04-browser-acceptance.spec.ts', 'batch52-dialog-removed-opener.spec.ts'],
  forbidOnly: true, workers: 1, retries: 0, timeout: 60_000,
  outputDir: `${output}/traces`,
  reporter: [['list'], ['json', { outputFile: `${output}/results.json` }]],
  use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
  // Deliberately no webServer: coordinator owns the immutable host and lease.
});
