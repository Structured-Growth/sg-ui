const {createRequire}=require('node:module');const {resolve}=require('node:path');
const root=resolve(__dirname,'../../..'),{defineConfig,devices}=createRequire(resolve(root,'apps/docs/package.json'))('@playwright/test');
if(!process.env.SGUI_BACKLOG_DOCS_OUTPUT)throw Error('Evidence output required');
const selection=process.env.SGUI_BACKLOG_DOCS_SELECTION?require(process.env.SGUI_BACKLOG_DOCS_SELECTION):null;
const escape=RegExp.escape;
module.exports=defineConfig({testDir:resolve(root,'apps/docs/tests'),testMatch:selection?selection.files:['calendar-expansion.spec.ts','theme-pipeline.spec.ts'],
grep:selection?.full?undefined:selection?new RegExp(selection.titles.map(escape).join('|')):/resize endpoint days|independent months, scrolling browser|component aliases resolve/,
workers:1,retries:0,forbidOnly:true,timeout:selection?30000:90000,outputDir:resolve(process.env.SGUI_BACKLOG_DOCS_OUTPUT,'traces'),
reporter:[['list'],['json',{outputFile:resolve(process.env.SGUI_BACKLOG_DOCS_OUTPUT,'results.json')}]],
use:{baseURL:'http://127.0.0.1:3100',trace:'retain-on-failure',screenshot:'only-on-failure'},projects:[{name:'chromium',use:devices['Desktop Chrome']}]});
