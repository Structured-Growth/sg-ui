const { createRequire } = require('node:module');
const { resolve } = require('node:path');
const root = resolve(__dirname, '../../..');
const { defineConfig, devices } = createRequire(resolve(root, 'packages/ui/package.json'))('@playwright/test');
const output = process.env.SGUI_BACKLOG_OUTPUT;
if (!output) throw Error('Evidence output required');
module.exports = defineConfig({
  testDir: resolve(root, 'packages/ui/tests/browser'),
  testMatch: '*.spec.ts',
  workers: 1, retries: 0, forbidOnly: true, timeout: 60000,
  outputDir: resolve(output, 'traces'),
  reporter: [['list'], ['json', { outputFile: resolve(output, 'results.json') }]],
  use: { baseURL: 'http://127.0.0.1:6173', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: ['chromium', 'firefox', 'webkit'].map(name => ({ name, use: {...devices[{ chromium: 'Desktop Chrome', firefox: 'Desktop Firefox', webkit: 'Desktop Safari' }[name]], ...(name === 'chromium' ? {channel:'chromium'} : {})} })),
});
