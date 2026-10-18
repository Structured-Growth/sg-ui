import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(new URL('../../../../../../packages/ui/package.json',import.meta.url));
const {defineConfig,devices}=require('@playwright/test');
if(!process.env.SGUI_BROWSER_BASE_URL||!process.env.SGUI_ACCEPTANCE_OUTPUT)throw Error('Owned existing host and fresh output required');
export default defineConfig({testDir:fileURLToPath(new URL('../../../wave-03-13/',import.meta.url)),testMatch:'css-contracts.spec.mjs',grep:/decorated-field enhancement fallback|presentation geometry survives/,workers:1,retries:0,timeout:45000,outputDir:process.env.SGUI_ACCEPTANCE_OUTPUT+'/traces',reporter:[['list'],['json',{outputFile:process.env.SGUI_ACCEPTANCE_OUTPUT+'/results.json'}]],use:{baseURL:process.env.SGUI_BROWSER_BASE_URL,trace:'retain-on-failure'},projects:[{name:'chromium',use:devices['Desktop Chrome']},{name:'firefox',use:devices['Desktop Firefox']},{name:'webkit',use:devices['Desktop Safari']}]});
