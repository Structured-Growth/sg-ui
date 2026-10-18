const {createRequire}=require('node:module');
const {resolve,isAbsolute,relative}=require('node:path');
const root=resolve(__dirname,'../../../../../../..');
const {defineConfig,devices}=createRequire(resolve(root,'packages/ui/package.json'))('@playwright/test');
const output=process.env.SGUI_TOOLBAR_OUTPUT;
if(!output||!isAbsolute(output)||relative(__dirname,output).startsWith('..')||!relative(__dirname,output))throw Error('Fresh output inside owned toolbar batch required');
module.exports=defineConfig({
 testDir:resolve(root,'packages/ui/tests/browser'),testMatch:'toolbar-container-boundary.spec.ts',
 workers:1,retries:0,forbidOnly:true,timeout:45000,maxFailures:0,
 outputDir:resolve(output,'traces'),reporter:[['list'],['json',{outputFile:resolve(output,'results.json')}]],
 use:{baseURL:'http://127.0.0.1:6173',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'chromium',use:devices['Desktop Chrome']},{name:'firefox',use:devices['Desktop Firefox']},{name:'webkit',use:devices['Desktop Safari']}],
 // Exactly two existing normal/enlarged cases in three engines. Owned immutable host started separately by run.mjs.
});
