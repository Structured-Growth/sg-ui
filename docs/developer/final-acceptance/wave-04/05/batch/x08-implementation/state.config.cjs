const {createRequire}=require('node:module');
const {resolve,isAbsolute}=require('node:path');
const root=resolve(__dirname,'../../../../../../..');
const {defineConfig,devices}=createRequire(resolve(root,'packages/ui/package.json'))('@playwright/test');
const output=process.env.SGUI_X08_RUN;
if(!output||!isAbsolute(output))throw Error('Absolute SGUI_X08_RUN required');
module.exports=defineConfig({testDir:resolve(root,'packages/ui/tests/browser'),testMatch:'wave04-state-indicators.spec.ts',
workers:1,retries:0,forbidOnly:true,timeout:45000,maxFailures:0,
outputDir:resolve(output,'d15-root','traces'),reporter:[['list'],['json',{outputFile:resolve(output,'d15-root','results.json')}]],
use:{baseURL:'http://127.0.0.1:6173',trace:'retain-on-failure',screenshot:'only-on-failure'},projects:[{name:'chromium',use:devices['Desktop Chrome']}]});
