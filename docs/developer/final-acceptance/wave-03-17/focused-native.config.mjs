// Coordinator-owned execution against a separately leased, rebuilt native host.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(new URL('../../../../packages/ui/package.json', import.meta.url));
const { defineConfig, devices } = require('@playwright/test');
const baseURL = process.env.SGUI_BROWSER_BASE_URL;
if (!baseURL) throw new Error('Provide the coordinator leased SGUI_BROWSER_BASE_URL; this config starts no server.');
const url = new URL(baseURL);
if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || url.protocol !== 'http:' || url.port === '3000') throw new Error('Use a coordinator leased loopback native fixture host, never user server 3000.');
export default defineConfig({
  testDir: fileURLToPath(new URL('../../../../packages/ui/tests/browser', import.meta.url)),
  testMatch: ['translations-locale-acceptance.spec.ts', 'navigation-locale-motion.spec.ts'],
  workers: 1, retries: 0, timeout: 45_000,
  outputDir: fileURLToPath(new URL('./native-artifacts', import.meta.url)),
  reporter: [['list'], ['json', { outputFile: fileURLToPath(new URL('./native-results.json', import.meta.url)) }]],
  use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
