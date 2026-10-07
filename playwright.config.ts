import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.SGUI_BROWSER_PORT ?? 6173);
const baseURL = process.env.SGUI_BROWSER_BASE_URL ?? `http://127.0.0.1:${port}`;
const url = new URL(baseURL);
if (!Number.isInteger(port) || port < 1024 || port > 65535 ||
    url.origin !== `http://127.0.0.1:${port}` || url.pathname !== '/' || url.search || url.hash) {
  throw new Error('Browser baseURL must match a valid loopback port');
}

export default defineConfig({
  testDir: './tests/browser',
  forbidOnly: Boolean(process.env.CI),
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: [['list'], ['html', { outputFolder: process.env.SGUI_BROWSER_REPORT_DIR ?? 'artifacts/browser-report', open: 'never' }], ['json', { outputFile: process.env.SGUI_BROWSER_RESULTS_FILE ?? 'artifacts/browser-results.json' }]],
  outputDir: process.env.SGUI_BROWSER_OUTPUT_DIR ?? 'artifacts/browser-traces',
  use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: { command: 'node scripts/serve-browser-storybook.mjs', url: `${baseURL}/iframe.html`, reuseExistingServer: false },
});
