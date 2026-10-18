// One new case on the coordinator's frozen host. Never builds/starts a server.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const here=fileURLToPath(new URL('.',import.meta.url));
const root=resolve(here,'../../../../..');
const {defineConfig,devices}=createRequire(resolve(root,'packages/ui/package.json'))('@playwright/test');
const baseURL=process.env.SGUI_FORMS_ACCEPTANCE_URL;
if(!baseURL)throw new Error('Set SGUI_FORMS_ACCEPTANCE_URL to the coordinator frozen fixture origin');
const url=new URL(baseURL);
if(url.protocol!=='http:'||url.hostname!=='127.0.0.1'||!url.port||url.port==='3000'||url.pathname!=='/'||url.search||url.hash||url.username||url.password)throw new Error('Use a dedicated loopback fixture origin outside user port 3000');
export default defineConfig({
  testDir:resolve(root,'packages/ui/tests/browser'),testMatch:'calendar-period-draft-isolation.spec.ts',
  workers:1,retries:0,forbidOnly:true,timeout:30_000,
  outputDir:process.env.SGUI_FORMS_OUTPUT_DIR??resolve(here,'period-draft-run/traces'),
  reporter:[['list'],['json',{outputFile:process.env.SGUI_FORMS_RESULTS_FILE??resolve(here,'period-draft-run/results.json')}]],
  use:{baseURL,trace:'retain-on-failure',screenshot:'only-on-failure'},
  projects:[
    {name:'chromium',use:devices['Desktop Chrome']},
    {name:'firefox',use:devices['Desktop Firefox']},
    {name:'webkit',use:devices['Desktop Safari']},
  ],
});
