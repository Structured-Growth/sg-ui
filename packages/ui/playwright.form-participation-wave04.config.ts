import {defineConfig, devices} from '@playwright/test';
const baseURL = process.env.SGUI_FORMS_ACCEPTANCE_URL;
if (!baseURL) throw new Error('Set SGUI_FORMS_ACCEPTANCE_URL to the coordinator frozen fixture origin');
const url = new URL(baseURL);
if (url.protocol !== 'http:' || url.hostname !== '127.0.0.1' || !url.port || url.port === '3000' || url.pathname !== '/' || url.search || url.hash || url.username || url.password) throw new Error('Use a dedicated loopback fixture origin outside user port 3000');
const autofillChannel = process.env.SGUI_AUTOFILL_CHANNEL ?? 'chromium';
if (autofillChannel !== 'chromium' && autofillChannel !== 'chrome') throw new Error('Autofill channel must be installed full chromium or chrome');
export default defineConfig({
  testDir: './tests/browser', testMatch: 'wave04-form-participation.spec.ts',
  workers: 1, retries: 0, forbidOnly: true, timeout: 45_000,
  outputDir: process.env.SGUI_FORMS_OUTPUT_DIR ?? 'artifacts/wave04-form-participation/traces',
  reporter: [['list'], ['json', {outputFile: process.env.SGUI_FORMS_RESULTS_FILE ?? 'artifacts/wave04-form-participation/results.json'}]],
  use: {baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure'},
  projects: [
    {name: 'chromium', use: {...devices['Desktop Chrome'], channel: autofillChannel, headless: process.env.SGUI_AUTOFILL_HEADED !== '1'}},
    {name: 'firefox', grepInvert: /native CDP/, use: {...devices['Desktop Firefox']}},
    {name: 'webkit', grepInvert: /native CDP/, use: {...devices['Desktop Safari']}},
  ],
});
