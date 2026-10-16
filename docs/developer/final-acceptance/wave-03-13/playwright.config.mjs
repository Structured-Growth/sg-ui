import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(new URL('../../../../packages/ui/package.json',import.meta.url));
const {defineConfig,devices}=require('@playwright/test');
if(!process.env.SGUI_BROWSER_BASE_URL)throw Error('Coordinator must supply an allocated existing fixture host; this config never starts a server.');
export default defineConfig({testDir:'.',testMatch:'css-contracts.spec.mjs',workers:1,retries:0,timeout:45000,outputDir:fileURLToPath(new URL('./native-output/',import.meta.url)),reporter:[['list'],['json',{outputFile:fileURLToPath(new URL('./native-results.json',import.meta.url))}]],use:{baseURL:process.env.SGUI_BROWSER_BASE_URL,trace:'retain-on-failure'},projects:[{name:'chromium',use:devices['Desktop Chrome']},{name:'firefox',use:devices['Desktop Firefox']},{name:'webkit',use:devices['Desktop Safari']}]});
