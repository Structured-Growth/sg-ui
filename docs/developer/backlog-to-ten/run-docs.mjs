import {resolve,dirname,delimiter} from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';import {createRequire} from 'node:module';
const task=dirname(fileURLToPath(import.meta.url)),root=resolve(task,'../../..'),ui=resolve(root,'packages/ui'),docs=resolve(root,'apps/docs');
const pool=await import(pathToFileURL(resolve(ui,'scripts/browser-validation-pool.mjs'))),req=createRequire(resolve(docs,'package.json'));
if(process.versions.node.split('.')[0]!=='24')throw Error('Node24 required');
const name=process.argv[2];if(!/^[a-z0-9-]+$/.test(name??''))throw Error('Fresh output required');
const output=resolve(task,name),claims=[],controller=new AbortController(),serverController=new AbortController();let serverRun,unsettled=false;
const selection=process.argv[3];
const receipt={node:process.version,steps:[],selection:selection??null,limits:['Focused docs corrections; no full production or AT claim.']};
const env={...process.env,PATH:dirname(process.execPath)+delimiter+process.env.PATH,SGUI_BACKLOG_DOCS_OUTPUT:output,...(selection?{SGUI_BACKLOG_DOCS_SELECTION:resolve(task,selection)}:{})};
process.once('SIGINT',()=>controller.abort());process.once('SIGTERM',()=>controller.abort());
const save=()=>writeFile(resolve(output,'execution.json'),JSON.stringify(receipt,null,2)+'\n');
async function stage(name,executable,args,cwd=root){console.log('START '+name);try{await pool.runOwnedCommand({cwd,env,executable,args,log:resolve(output,name+'.log'),signal:controller.signal});}catch(error){unsettled ||=error.ownedCommandUnsettled===true;throw error;}receipt.steps.push({name,executable,args,passed:true});await save();console.log('PASS '+name);}
try{
 const owner='backlog-docs-'+process.pid;claims.push(await pool.acquireLease(pool.LEGACY_LOCK,owner));claims.push(await pool.acquireLease(pool.HEAVY_LOCK,owner));claims.push(await pool.acquirePortLease(pool.POOL_ROOT,3100,owner));await mkdir(output);
 receipt.dist=await pool.digestTree(resolve(ui,'dist'));
 await stage('docs-build','pnpm',['--filter','@structured-growth/docs','build']);
 serverRun=pool.runOwnedCommand({cwd:docs,env,executable:process.execPath,args:[req.resolve('next/dist/bin/next'),'start','--hostname','127.0.0.1','--port','3100'],log:resolve(output,'server.log'),signal:serverController.signal}).catch(error=>{if(error.ownedCommandUnsettled)unsettled=true;receipt.serverExit=String(error);});
 const deadline=Date.now()+60000;let ready=false;while(Date.now()<deadline&&!controller.signal.aborted){try{const response=await fetch('http://127.0.0.1:3100/theming',{signal:AbortSignal.timeout(3000)});if(response.ok){ready=true;break;}}catch{}await new Promise(done=>setTimeout(done,250));}
 if(!ready)throw Error('Owned docs server did not become ready');
 await stage('docs-browser',process.execPath,[req.resolve('@playwright/test/cli'),'test','--config',resolve(task,'docs.config.cjs')],docs);
 if(receipt.dist!==await pool.digestTree(resolve(ui,'dist')))throw Error('Compiled package drift');receipt.complete=true;
}catch(error){receipt.failure=String(error.stack??error);console.error(error);process.exitCode=1;}
finally{serverController.abort();if(serverRun)await serverRun;receipt.finishedAt=new Date().toISOString();await save().catch(()=>{});if(!unsettled)for(const claim of claims.reverse())await pool.releaseLease(claim);}
