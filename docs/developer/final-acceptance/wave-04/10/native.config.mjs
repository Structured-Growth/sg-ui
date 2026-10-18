import { defineConfig } from '../../../../../packages/ui/node_modules/@playwright/test/index.mjs';
const baseURL = process.env.SGUI_BROWSER_BASE_URL;
if (!baseURL) throw new Error('Provide coordinator-admitted frozen native fixture URL');
const url = new URL(baseURL);
if (url.hostname !== '127.0.0.1' || url.port === '3000') throw new Error('Use an isolated loopback host excluding user3000');
export default defineConfig({
  testDir: './proposed-files/packages/ui/tests/browser', testMatch: 'wave04-*.spec.ts',
  workers: 1, retries: 0, timeout: 60000,
  reporter: [['list'], ['json', { outputFile: './docs/developer/final-acceptance/wave-04/10/native-results.json' }]],
  outputDir: './docs/developer/final-acceptance/wave-04/10/native-output',
  use: { baseURL }, projects: [{ name: 'chromium', use: { browserName: 'chromium' } }, { name: 'firefox', use: { browserName: 'firefox' } }, { name: 'webkit', use: { browserName: 'webkit' } }],
});
