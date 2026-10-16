import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const own=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(own,'../../../..');
const require=createRequire(path.join(root,'packages/ui/package.json'));
const {defineConfig,devices}=require('@playwright/test');
const baseURL=process.env.SGUI_OVERLAY_HOST;
if (!baseURL) throw Error('SGUI_OVERLAY_HOST must name the coordinator-admitted immutable fixture host. This config never starts a server.');
const host=new URL(baseURL);
if(host.hostname!=='127.0.0.1'||host.protocol!=='http:'||!host.port||host.port==='3000'||host.pathname!=='/'||host.search||host.hash)
 throw Error('Require an admitted loopback fixture origin with explicit non-3000 port');
export default defineConfig({
 testDir:path.join(root,'packages/ui/tests/browser'),
 workers:1,retries:0,forbidOnly:true,
 timeout:30_000,
 outputDir:path.join(own,'native-traces'),
 reporter:[['list'],['json',{outputFile:path.join(own,'native-results.json')}]],
 use:{baseURL,trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[['chromium','Desktop Chrome'],['firefox','Desktop Firefox'],['webkit','Desktop Safari']]
  .map(([name,device])=>({name,use:devices[device]})),
});
