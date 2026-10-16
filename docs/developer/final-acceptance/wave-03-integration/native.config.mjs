import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
const require=createRequire(new URL('../../../../packages/ui/package.json',import.meta.url));
const {defineConfig,devices}=require('@playwright/test');
export default defineConfig({
 testDir:root+'packages/ui/tests/browser', testMatch:["acceptance-touch-targets.spec.ts", "action-notifications.spec.ts", "calendar-navigation-reflow.spec.ts", "card-container-boundary.spec.ts", "date-entry-clipboard.spec.ts", "editor-selection-editing-successors.spec.ts", "editor-style-range-transactions.spec.ts", "navigation-composed.spec.ts", "navigation-locale-motion.spec.ts", "translations-locale-acceptance.spec.ts", "wave03-18-primitives.spec.ts", "wave03-editor-chrome-acceptance.spec.ts", "wave03-editor-selection-acceptance.spec.ts", "wave03-grid-successors.spec.ts", "wave03-overlay-successors.spec.ts", "wave03-selector-contracts.spec.ts", "wave03-system-indications.spec.ts"],
 workers:1,retries:0,timeout:30000,maxFailures:8,
 outputDir:root+'packages/ui/artifacts/wave03-integration/traces',
 reporter:[['list'],['json',{outputFile:process.env.SGUI_WAVE03_RESULTS??root+'packages/ui/artifacts/wave03-integration/results.json'}]],
 use:{baseURL:'http://127.0.0.1:6173',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'chromium',use:devices['Desktop Chrome']},{name:'firefox',use:devices['Desktop Firefox']},{name:'webkit',use:devices['Desktop Safari']}],
 webServer:{command:'node scripts/serve-browser-docs.mjs',cwd:root+'packages/ui',url:'http://127.0.0.1:6173/fixtures/',reuseExistingServer:false}
});
