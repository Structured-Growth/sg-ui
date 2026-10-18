import { defineConfig, devices } from '../../../../../../packages/ui/node_modules/@playwright/test/index.mjs';
import { isAbsolute } from 'node:path';
const baseURL = process.env.SGUI_ACCEPTANCE_BASE_URL;
const output = process.env.SGUI_ACCEPTANCE_OUTPUT;
if (!baseURL || !/^http:\/\/127\.0\.0\.1:\d+$/.test(baseURL) || new URL(baseURL).port === '3000' ||
    !output || !isAbsolute(output)) throw new Error('Use an isolated coordinator loopback host and absolute SGUI_ACCEPTANCE_OUTPUT. User3000 is forbidden.');
export default defineConfig({
  testDir: '../../../../../../packages/ui/tests/browser',
  testMatch: 'batch05-grid-clipboard.spec.ts',
  forbidOnly: true, workers: 1, retries: 0, timeout: 60_000,
  outputDir: `${output}/traces`,
  reporter: [['list'], ['json', { outputFile: `${output}/results.json` }]],
  use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'firefox', use: devices['Desktop Firefox'] },
  ],
  // Deliberately no webServer: coordinator owns the immutable host and lease.
});
