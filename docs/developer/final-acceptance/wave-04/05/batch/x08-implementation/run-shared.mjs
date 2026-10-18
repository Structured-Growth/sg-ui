import {spawn,execFileSync} from 'node:child_process';
import {mkdirSync,existsSync,writeFileSync,readFileSync,readdirSync,lstatSync,openSync,closeSync} from 'node:fs';
import {resolve,dirname,relative,delimiter} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const task=dirname(fileURLToPath(import.meta.url)),root=resolve(task,'../../../../../../..'),ui=resolve(root,'packages/ui');
if(process.versions.node.split('.')[0]!=='24')throw Error('Node24 required');
const name=process.argv[2];if(!name||!/^[a-z0-9-]+$/.test(name))throw Error('Fresh run name required');
const output=resolve(task,name);if(existsSync(output))throw Error('Output exists');
const pool=await import(pathToFileURL(resolve(ui,'scripts/browser-validation-pool.mjs')).href);
const claims=[],stages=[],owner=`x08-d15-shared:${process.pid}`;
let server,stopping=false;
const save=(name,value)=>writeFileSync(resolve(output,name),JSON.stringify(value,null,2)+'\n');
function sourceInputs(){
 const rows={};
 const add=path=>rows[relative(root,path)]=createHash('sha256').update(readFileSync(path)).digest('hex');
 const walk=path=>{for(const name of readdirSync(path).sort()){const file=resolve(path,name),stat=lstatSync(file);if(stat.isSymbolicLink())throw Error('Source symlink: '+file);if(stat.isDirectory())walk(file);else if(/\.(?:[cm]?[jt]sx?|css|json|svg)$/.test(name))add(file);}};
 for(const directory of ['packages/ui/src','apps/docs/native-fixtures','apps/docs/theme','apps/docs/examples','apps/docs/content/component-usage','apps/docs/scripts'])walk(resolve(root,directory));
 for(const file of ['pnpm-lock.yaml','packages/ui/package.json','packages/ui/scripts/build.mjs','packages/ui/scripts/css-modules.mjs','packages/ui/scripts/build-browser-docs.mjs','packages/ui/scripts/serve-browser-docs.mjs','packages/ui/scripts/browser-validation-pool.mjs','packages/ui/tests/browser/x08-pointer-alternatives.spec.ts','packages/ui/tests/browser/wave04-state-indicators.spec.ts'])add(resolve(root,file));
 for(const file of ['native.config.cjs','state.config.cjs','run-shared.mjs'])add(resolve(task,file));
 return Object.fromEntries(Object.entries(rows).sort(([a],[b])=>a.localeCompare(b)));
}
async function stage(name,args,cwd=ui,executable=process.execPath){
 const fd=openSync(resolve(output,name+'.log'),'wx');const row={name,executable,args,cwd,startedAt:new Date().toISOString()};stages.push(row);
 try{const child=spawn(executable,args,{cwd,stdio:['ignore',fd,fd],env:{...process.env,PATH:dirname(process.execPath)+delimiter+(process.env.PATH??''),SGUI_X08_RUN:output,PWTEST_CACHE_DIR:resolve(output,'transform-cache')}});row.exitCode=await new Promise((done,reject)=>{child.once('error',reject);child.once('exit',code=>done(code??1));});}
 finally{closeSync(fd);row.completedAt=new Date().toISOString();save('stages.json',stages);}
 console.log(JSON.stringify(row));if(row.exitCode!==0)throw Error(name+' failed');
}
process.once('SIGTERM',()=>{stopping=true;});process.once('SIGINT',()=>{stopping=true;});
try{
 claims.push(await pool.acquireLease(pool.LEGACY_LOCK,owner));claims.push(await pool.acquireLease(pool.HEAVY_LOCK,owner));claims.push(await pool.acquirePortLease(pool.POOL_ROOT,6173,owner));
 mkdirSync(output);save('claims.json',{owner,pid:process.pid,claims});
 const sourceBefore=sourceInputs();save('source-before-build.json',sourceBefore);
 const head=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 await stage('library-build',[resolve(ui,'scripts/build.mjs')]);
 save('fresh-declarations.json',{head,node:process.version,librarySha256:await pool.digestTree(resolve(ui,'dist')),completedAt:new Date().toISOString()});
 console.log('FRESH_DECLARATIONS_AVAILABLE '+resolve(ui,'dist'));
 await stage('catalog-generate',[resolve(root,'apps/docs/scripts/generate-catalog.mjs')],resolve(root,'apps/docs'));
 await stage('catalog-check',['catalog:check'],resolve(root,'apps/docs'),'pnpm');
 await stage('fixture-build',[resolve(ui,'scripts/build-browser-docs.mjs')]);
 await stage('browser-types',[resolve(ui,'node_modules/typescript/bin/tsc'),'--noEmit','-p','tests/browser/tsconfig.json']);
 const source=sourceInputs();save('source-after-build.json',source);
 if(JSON.stringify(sourceBefore)!==JSON.stringify(source))throw Error('Frozen input source changed during build');
 const admission={head,node:process.version,owner,pid:process.pid,sourceManifest:resolve(output,'source-after-build.json'),sourceSha256:createHash('sha256').update(JSON.stringify(source)).digest('hex'),librarySha256:await pool.digestTree(resolve(ui,'dist')),hostSha256:await pool.digestTree(resolve(ui,'browser-docs-static')),hostRoot:resolve(ui,'browser-docs-static'),baseURL:'http://127.0.0.1:6173',immutable:true};
 server=await(await import(pathToFileURL(resolve(ui,'scripts/serve-browser-docs.mjs')).href)).startServer({...process.env,SGUI_BROWSER_PORT:'6173',SGUI_BROWSER_BASE_URL:admission.baseURL,SGUI_BROWSER_DOCS_DIR:admission.hostRoot,SGUI_BROWSER_IMMUTABLE:'1'});
 save('host-admission.json',admission);console.log('HOST_ADMITTED '+JSON.stringify(admission));
 let failure=null;
 try{await stage('x08-browser',[resolve(ui,'node_modules/@playwright/test/cli.js'),'test','--config',resolve(task,'native.config.cjs')]);}catch(error){failure=String(error);}
 const stable=JSON.stringify(source)===JSON.stringify(sourceInputs())&&admission.librarySha256===await pool.digestTree(resolve(ui,'dist'))&&admission.hostSha256===await pool.digestTree(resolve(ui,'browser-docs-static'));
 save('x08-execution.json',{failure,stable,expectedCases:9,completedAt:new Date().toISOString()});
 console.log('X08_COMPLETE_HOST_RETAINED '+JSON.stringify({failure,stable,stopFile:resolve(output,'stop-request')}));
 if(!stable)throw Error('Admitted input/output drift');
 while(!stopping&&!existsSync(resolve(output,'stop-request')))await new Promise(done=>setTimeout(done,1000));
}catch(error){if(existsSync(output))save('failure.json',{error:String(error.stack??error),stages});console.error(String(error));process.exitCode=1;}
finally{
 if(server){server.closeAllConnections();await new Promise(done=>server.close(done));}
 for(const claim of claims.reverse())await pool.releaseLease(claim);
 if(existsSync(output))save('cleanup.json',{ownedServerClosed:true,ownedClaimsReleased:true,owner,completedAt:new Date().toISOString()});
}
