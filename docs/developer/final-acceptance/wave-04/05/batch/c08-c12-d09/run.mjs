import {spawn} from 'node:child_process';
import {mkdirSync,existsSync,writeFileSync,readFileSync,readdirSync,lstatSync,openSync,closeSync} from 'node:fs';
import {resolve,dirname,relative,delimiter} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const task=dirname(fileURLToPath(import.meta.url)),batch=task,root=resolve(task,'../../../../../../..');
if(![22,24].includes(Number(process.versions.node.split('.')[0])))throw new Error('Use supported Node22/24');
const runName=process.argv[2];if(!runName||!/^[a-z0-9][a-z0-9-]*$/.test(runName))throw new Error('Pass a fresh run name');
const output=resolve(batch,runName);if(existsSync(output))throw new Error('Output exists; no overwrite');
const pool=await import(pathToFileURL(resolve(root,'packages/ui/scripts/browser-validation-pool.mjs')).href);
const claims=[];let server;const owner=`toolbar-container-6:${process.pid}`;
function hash(path){return createHash('sha256').update(readFileSync(path)).digest('hex');}
function runtimeInputs(){
 const rows={};
 function walk(dir){for(const name of readdirSync(dir).sort()){const path=resolve(dir,name),stat=lstatSync(path);if(stat.isSymbolicLink())throw new Error('Source symlink rejected: '+path);if(stat.isDirectory())walk(path);else if(/\.(?:[cm]?[jt]sx?|css)$/.test(path)&&!/(?:\.test\.|\.native-fixture)/.test(path))rows[relative(root,path)]=hash(path);}}
 walk(resolve(root,'packages/ui/src'));
 walk(resolve(root,'apps/docs/native-fixtures'));
 walk(resolve(root,'apps/docs/theme'));
 const explicit=[
  'packages/ui/package.json','pnpm-lock.yaml',
  'packages/ui/tests/browser/toolbar-container-boundary.spec.ts',
  'packages/ui/scripts/build-browser-docs.mjs',
  'packages/ui/scripts/serve-browser-docs.mjs',
  'packages/ui/scripts/browser-validation-pool.mjs',
 ];
 for(const path of explicit)rows[path]=hash(resolve(root,path));
 rows[relative(root,resolve(task,'native.config.cjs'))]=hash(resolve(task,'native.config.cjs'));
 rows[relative(root,fileURLToPath(import.meta.url))]=hash(fileURLToPath(import.meta.url));
 return rows;
}
const stages=[];
async function stage(name,args){
 const log=resolve(output,name+'.log'),fd=openSync(log,'wx');
 const row={name,executable:process.execPath,args,cwd:resolve(root,'packages/ui'),startedAt:new Date().toISOString()};stages.push(row);
 try{
  const child=spawn(process.execPath,args,{cwd:row.cwd,stdio:['ignore',fd,fd],env:{...process.env,PATH:dirname(process.execPath)+delimiter+(process.env.PATH??'')}});
  row.exitCode=await new Promise((done,reject)=>{child.once('error',reject);child.once('exit',code=>done(code??1));});
 }finally{closeSync(fd);row.completedAt=new Date().toISOString();writeFileSync(resolve(output,'build-stages.json'),JSON.stringify(stages,null,2)+'\n');}
 if(row.exitCode!==0)throw new Error(name+' failed; see '+log);
}
try{
 claims.push(await pool.acquireLease(pool.LEGACY_LOCK,owner));claims.push(await pool.acquireLease(pool.HEAVY_LOCK,owner));claims.push(await pool.acquirePortLease(pool.POOL_ROOT,6173,owner));
 mkdirSync(output);
 const buildSource=runtimeInputs();writeFileSync(resolve(output,'build-source-before.json'),JSON.stringify(buildSource,null,2)+'\n');
 const libraryBeforeFixtureBuild=await pool.digestTree(resolve(root,'packages/ui/dist'));
 writeFileSync(resolve(output,'library-before-fixture-build.json'),JSON.stringify({sha256:libraryBeforeFixtureBuild})+'\n');
 await stage('fixture-build',[resolve(root,'packages/ui/scripts/build-browser-docs.mjs')]);
 if(await pool.digestTree(resolve(root,'packages/ui/dist'))!==libraryBeforeFixtureBuild)throw new Error('Fixture build changed the admitted library output');
 await stage('browser-types',[resolve(root,'packages/ui/node_modules/typescript/bin/tsc'),'--noEmit','-p','tests/browser/tsconfig.json']);
 if(JSON.stringify(buildSource)!==JSON.stringify(runtimeInputs()))throw new Error('Runtime inputs changed during admitted build stages');
 const source=runtimeInputs(),libraryRoot=resolve(root,'packages/ui/dist'),hostRoot=resolve(root,'packages/ui/browser-docs-static');
 const before={node:process.version,source,librarySha256:await pool.digestTree(libraryRoot),hostSha256:await pool.digestTree(hostRoot),baseURL:'http://127.0.0.1:6173',expectedExecutions:6,builds:1};
 writeFileSync(resolve(output,'inputs-and-outputs-before.json'),JSON.stringify(before,null,2)+'\n');
 const {startServer}=await import(pathToFileURL(resolve(root,'packages/ui/scripts/serve-browser-docs.mjs')).href);
 server=await startServer({...process.env,SGUI_BROWSER_PORT:'6173',SGUI_BROWSER_BASE_URL:before.baseURL,SGUI_BROWSER_DOCS_DIR:hostRoot,SGUI_BROWSER_IMMUTABLE:'1'});
 const args=[resolve(root,'packages/ui/node_modules/@playwright/test/cli.js'),'test','--config',resolve(task,'native.config.cjs')];
 writeFileSync(resolve(output,'command.json'),JSON.stringify({executable:process.execPath,args,cwd:resolve(root,'packages/ui'),node:process.version,owner,workers:1,retries:0},null,2)+'\n');
 const child=spawn(process.execPath,args,{cwd:resolve(root,'packages/ui'),stdio:'inherit',env:{...process.env,SGUI_TOOLBAR_OUTPUT:output,PWTEST_CACHE_DIR:resolve(output,'transform-cache')}});
 const code=await new Promise((done,reject)=>{child.once('error',reject);child.once('exit',code=>done(code??1));});
 const after={source:runtimeInputs(),librarySha256:await pool.digestTree(libraryRoot),hostSha256:await pool.digestTree(hostRoot)};
 const stable=JSON.stringify(before.source)===JSON.stringify(after.source)&&before.librarySha256===after.librarySha256&&before.hostSha256===after.hostSha256;
 writeFileSync(resolve(output,'inputs-and-outputs-after.json'),JSON.stringify({...after,stable},null,2)+'\n');
 writeFileSync(resolve(output,'execution.json'),JSON.stringify({exitCode:code,stable,builds:1,expectedExecutions:6,completedAt:new Date().toISOString()},null,2)+'\n');
 process.exitCode=stable?code:1;
}catch(error){if(existsSync(output))writeFileSync(resolve(output,'failure.json'),JSON.stringify({error:String(error.stack??error),stages},null,2)+'\n');process.exitCode=1;
}finally{
 if(server){server.closeAllConnections();await new Promise(done=>server.close(done));}
 for(const claim of claims.reverse())await pool.releaseLease(claim);
 if(existsSync(output))writeFileSync(resolve(output,'cleanup.json'),JSON.stringify({ownedServerClosed:true,ownedClaimsReleased:true,owner},null,2)+'\n');
}
