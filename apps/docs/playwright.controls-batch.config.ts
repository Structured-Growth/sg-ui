import {defineConfig,devices} from '@playwright/test';
import {isAbsolute} from 'node:path';
const baseURL=process.env.SGUI_DOCS_CONTROLS_URL,output=process.env.SGUI_DOCS_CONTROLS_OUTPUT;
if(!baseURL||!output||!isAbsolute(output))throw new Error('Coordinator frozen docs origin and absolute owned output required');
const url=new URL(baseURL);
if(url.protocol!=='http:'||url.hostname!=='127.0.0.1'||!url.port||url.port==='3000'||url.pathname!=='/'||url.search||url.hash||url.username||url.password)throw new Error('Dedicated loopback docs origin outside user3000 required');
export default defineConfig({
 testDir:'./tests',testMatch:'controls-batch-public.spec.ts',workers:1,retries:0,forbidOnly:true,timeout:45000,
 outputDir:output+'/traces',reporter:[['list'],['json',{outputFile:output+'/results.json'}]],
 use:{baseURL,trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'chromium',use:{...devices['Desktop Chrome']}}],
 // The coordinator owns the existing production docs server and immutable build.
});
