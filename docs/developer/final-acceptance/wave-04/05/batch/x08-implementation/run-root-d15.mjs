import {spawn} from 'node:child_process';
import {openSync,closeSync,existsSync,writeFileSync} from 'node:fs';
import {resolve,dirname,delimiter} from 'node:path';
import {fileURLToPath} from 'node:url';
const task=dirname(fileURLToPath(import.meta.url)),root=resolve(task,'../../../../../../..'),output=resolve(task,'shared-native-01');
if(process.versions.node.split('.')[0]!=='24')throw Error('Node24 required');
if(existsSync(resolve(output,'d15-root.log')))throw Error('Preserve existing run; choose a fresh reviewed output for a follow-up');
const args=[resolve(root,'packages/ui/node_modules/@playwright/test/cli.js'),'test','--config',resolve(task,'state.config.cjs')];
const env={...process.env,PATH:dirname(process.execPath)+delimiter+(process.env.PATH??''),SGUI_X08_RUN:output,PWTEST_CACHE_DIR:resolve(output,'d15-transform-cache')};
const record={executable:process.execPath,args,cwd:resolve(root,'packages/ui'),env:{SGUI_X08_RUN:env.SGUI_X08_RUN,PWTEST_CACHE_DIR:env.PWTEST_CACHE_DIR},expectedCases:6,workers:1,retries:0,host:'http://127.0.0.1:6173',rebuild:false};
writeFileSync(resolve(output,'d15-root-command.json'),JSON.stringify(record,null,2)+'\n');
const fd=openSync(resolve(output,'d15-root.log'),'wx');
try{const child=spawn(process.execPath,args,{cwd:record.cwd,env,stdio:['ignore',fd,fd]});process.exitCode=await new Promise((done,reject)=>{child.once('error',reject);child.once('exit',code=>done(code??1));});}
finally{closeSync(fd);}
