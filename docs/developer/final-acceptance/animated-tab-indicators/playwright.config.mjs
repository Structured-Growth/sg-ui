import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
const require=createRequire(root+'apps/docs/package.json');
const {defineConfig,devices}=require('@playwright/test');
export default defineConfig({testDir:root+'apps/docs/tests',testMatch:['tab-indicator.spec.ts','tabs-overflow.spec.ts'],workers:1,retries:0,timeout:30000,maxFailures:0,outputDir:root+'apps/docs/test-results/tab-indicator',reporter:[['list'],['json',{outputFile:root+'apps/docs/test-results/tab-indicator-results.json'}]],use:{baseURL:'http://127.0.0.1:3100',trace:'retain-on-failure'},projects:[{name:'chromium',use:devices['Desktop Chrome']},{name:'firefox',testMatch:['tab-indicator.spec.ts','tabs-overflow.spec.ts'],use:devices['Desktop Firefox']},{name:'webkit',testMatch:['tab-indicator.spec.ts','tabs-overflow.spec.ts'],use:devices['Desktop Safari']}],webServer:{command:'pnpm start --port 3100',cwd:root+'apps/docs',url:'http://127.0.0.1:3100',reuseExistingServer:false}});
