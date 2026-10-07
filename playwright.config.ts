import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  forbidOnly: Boolean(process.env.CI),
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: [['list'], ['html', { outputFolder: 'artifacts/browser-report', open: 'never' }], ['json', { outputFile: 'artifacts/browser-results.json' }]],
  outputDir: 'artifacts/browser-traces',
  use: { baseURL: 'http://127.0.0.1:6173', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: { command: 'node scripts/serve-browser-storybook.mjs', url: 'http://127.0.0.1:6173/iframe.html', reuseExistingServer: false },
});
