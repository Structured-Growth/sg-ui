// Coordinator-only runner: attaches to an explicitly supplied frozen host.
// This config never starts/reuses/replaces a server and rejects the user's 3000.
const { createRequire } = require('node:module');
const path = require('node:path');
const root = path.resolve(__dirname, '../../../..');
const req = createRequire(path.join(root, 'packages/ui/package.json'));
const { defineConfig, devices } = req('@playwright/test');
const baseURL = process.env.SGUI_BROWSER_BASE_URL;
if (!baseURL) throw Error('Set SGUI_BROWSER_BASE_URL to the coordinator frozen fixture host');
const url = new URL(baseURL);
if (url.hostname !== '127.0.0.1' || url.protocol !== 'http:' || !url.port || url.port === '3000' || url.pathname !== '/' || url.search || url.hash) {
 throw Error('Use explicit http://127.0.0.1:<port>/; port 3000 is reserved for the user');
}
module.exports = defineConfig({
 testDir: path.join(root, 'packages/ui/tests/browser'),
 testMatch: ['wave03-selector-contracts.spec.ts', 'batch01-selectors.spec.ts', 'batch14-async-busy.spec.ts'],
 // Eight cases/engine: five new, one existing ComboBox disabled-options case,
 // and two AsyncMultiSelect host race/busy cases. No duplicate full-suite run.
 grep: /(?:Select noneditable|ComboBox text editing|Menu key endpoints|Popover exposes|Tooltip supplements|ComboBox keyboard skips|Host async adapter ignores|AsyncMultiSelect forwards native busy)/,
 workers: 1, retries: 0, timeout: 30000,
 use: { baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
 outputDir: path.join(__dirname, 'native-artifacts'),
 reporter: [['list'], ['json', { outputFile: path.join(__dirname, 'native-results.json') }]],
 projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
 ],
});
