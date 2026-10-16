import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(new URL('../../../../packages/ui/package.json',import.meta.url));
const {defineConfig,devices}=require('@playwright/test');
const origin=process.env.SGUI_W29_BASE_URL;
if(!origin || !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin) || new URL(origin).port==='3000') throw new Error('Set SGUI_W29_BASE_URL to coordinator-owned immutable loopback host; user3000 forbidden');
export default defineConfig({
 testDir:fileURLToPath(new URL('.',import.meta.url)),testMatch:'grid-native-entry.spec.ts',workers:1,retries:0,forbidOnly:true,timeout:30000,
 reporter:[['list'],['json',{outputFile:fileURLToPath(new URL('native-results.json',import.meta.url))}]],
 outputDir:fileURLToPath(new URL('native-output',import.meta.url)),
 use:{baseURL:origin,trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'chromium',use:devices['Desktop Chrome']},{name:'firefox',use:devices['Desktop Firefox']},{name:'webkit',use:devices['Desktop Safari']}],
 // No webServer: never starts, stops, or rebuilds a shared host.
});
