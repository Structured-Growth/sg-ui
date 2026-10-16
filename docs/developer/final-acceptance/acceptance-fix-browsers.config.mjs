import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const require=createRequire(new URL('../../../apps/docs/package.json',import.meta.url));
const {defineConfig,devices}=require('@playwright/test');
export default defineConfig({
 testDir:fileURLToPath(new URL('../../../apps/docs/tests/',import.meta.url)),
 testMatch:['acceptance-picker-field-fixes.spec.ts','date-picker-availability-parity.spec.ts'],
 workers:1,retries:0,timeout:30000,
 reporter:[['list'],['json',{outputFile:root+'apps/docs/artifacts/acceptance-bugfix-engines/results.json'}]],
 outputDir:root+'apps/docs/artifacts/acceptance-bugfix-engines/traces',
 use:{baseURL:'http://127.0.0.1:3100',trace:'retain-on-failure'},
 projects:[{name:'chromium',use:devices['Desktop Chrome']},{name:'firefox',use:devices['Desktop Firefox']},{name:'webkit',use:devices['Desktop Safari']}],
 webServer:{command:'pnpm --filter @structured-growth/docs start --port 3100',cwd:root,url:'http://127.0.0.1:3100',reuseExistingServer:false}
});
