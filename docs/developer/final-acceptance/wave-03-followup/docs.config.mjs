import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../../../',import.meta.url));
const require=createRequire(new URL('../../../../apps/docs/package.json',import.meta.url));
const {defineConfig,devices}=require('@playwright/test');
export default defineConfig({testDir:root+'apps/docs/tests',testMatch:['foundation-examples.spec.ts','icons-acceptance.spec.ts','button-neutral-pressed.spec.ts','scrollbar-layout.spec.ts','catalog.spec.ts'],workers:1,retries:0,maxFailures:8,outputDir:root+'apps/docs/test-results/wave03-followup',reporter:[['list'],['json',{outputFile:process.env.SGUI_WAVE03_DOCS_RESULTS??root+'apps/docs/test-results/wave03-followup-results.json'}]],use:{baseURL:'http://127.0.0.1:3100',trace:'retain-on-failure',screenshot:'only-on-failure'},projects:[{name:'chromium',use:devices['Desktop Chrome']}],webServer:{command:'pnpm start --port 3100',cwd:root+'apps/docs',url:'http://127.0.0.1:3100',reuseExistingServer:false}});
