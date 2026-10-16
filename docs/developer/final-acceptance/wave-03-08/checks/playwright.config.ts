import { defineConfig, devices } from '@playwright/test';
if (!process.env.SGUI_ACCEPTANCE_BASE_URL) throw new Error('Supply the coordinator-owned fresh docs host via SGUI_ACCEPTANCE_BASE_URL');
export default defineConfig({
  testDir: '../proposed-files/apps/docs/tests',
  testMatch: 'button-neutral-pressed.spec.ts',
  workers: 1, retries: 0,
  outputDir: '../native-results',
  use: { baseURL: process.env.SGUI_ACCEPTANCE_BASE_URL, trace: 'retain-on-failure' },
  projects: ['chromium', 'firefox', 'webkit'].map(name => ({ name, use: devices[name === 'chromium' ? 'Desktop Chrome' : name === 'firefox' ? 'Desktop Firefox' : 'Desktop Safari'] })),
});
