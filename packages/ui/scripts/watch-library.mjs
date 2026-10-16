import {readdir,stat} from 'node:fs/promises';
import {spawn,execFileSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {acquireLease,releaseLease,LEGACY_LOCK,HEAVY_LOCK} from './browser-validation-pool.mjs';

const library=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const docs=resolve(library,'../../apps/docs');
const owner=`library-watch-${process.pid}`;
let pending=true,running=false,closed=false,timer,child;
let pollTimer,polling=false;
const run=(script,cwd)=>new Promise(resolveCode=>{
 child=spawn(process.execPath,[script],{cwd,stdio:'inherit',detached:process.platform!=='win32'});
 child.on('error',error=>{console.error(error.message);resolveCode(1);});
 child.on('exit',code=>{child=undefined;resolveCode(code??1);});
});
function schedule(){
 if(closed)return;
 pending=true;clearTimeout(timer);
 timer=setTimeout(build,200);
}
async function build(){
 if(closed||running||!pending)return;
 running=true;let legacy,heavy;
 try {
  // Share the same claims as browser/production validation: never replace dist
  // underneath a running suite. A busy lease leaves this build queued.
  legacy=await acquireLease(LEGACY_LOCK,owner);
  heavy=await acquireLease(HEAVY_LOCK,owner);
  if(closed)return;
  pending=false;
  console.log('[ui watch] Building public package…');
  const code=await run(resolve(library,'scripts/build.mjs'),library);
  if(code===0&&!closed){
   const metadata=await run(resolve(docs,'scripts/generate-catalog.mjs'),docs);
   console.log(metadata===0?'[ui watch] Package and docs metadata ready.':'[ui watch] Metadata failed; waiting for the next change.');
  }else if(!closed)console.error('[ui watch] Build failed; waiting for the next change.');
 }catch(error){
  if(error.code==='EEXIST')pending=true;
  else {pending=false;console.error(`[ui watch] ${error.message}`);}
 }finally{
  if(heavy)await releaseLease(heavy);
  if(legacy)await releaseLease(legacy);
  running=false;
  if(!closed&&pending){clearTimeout(timer);timer=setTimeout(build,1000);}
 }
}
function stop(){
 closed=true;clearTimeout(timer);clearInterval(pollTimer);
 if(child?.pid)try {
  if(process.platform==='win32')execFileSync('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore'});
  else process.kill(-child.pid,'SIGTERM');
 }catch(error){if(error.code!=='ESRCH')console.error(error.message);}
}
// Poll the bounded build-input tree instead of installing one OS watcher per
// source file. This also works under restricted desktop file-descriptor limits.
async function snapshot(){
 const files=new Map();
 async function record(path){
  try {const value=await stat(path);files.set(path,`${value.mtimeMs}:${value.size}`);}
  catch(error){if(error.code!=='ENOENT')throw error;}
 }
 async function visit(folder){
  const entries=await readdir(folder,{withFileTypes:true});
  await Promise.all(entries.map(async entry=>{
   const path=resolve(folder,entry.name);
   if(entry.isDirectory())await visit(path);
   else if(entry.isFile()&&!/(?:\.test\.|\.native-fixture)/.test(entry.name))await record(path);
  }));
 }
 await Promise.all(['src','scripts'].map(folder=>visit(resolve(library,folder))));
 await Promise.all(['package.json','tsconfig.json','tsconfig.build.json'].map(file=>record(resolve(library,file))));
 return files;
}
let previous=await snapshot();
pollTimer=setInterval(async()=>{
 if(polling||closed)return;
 polling=true;
 try {
  const next=await snapshot();
  if(next.size!==previous.size||[...next].some(([path,value])=>previous.get(path)!==value))schedule();
  previous=next;
 }catch(error){console.error(`[ui watch] Input scan failed: ${error.message}`);}
 finally{polling=false;}
},1000);
process.once('SIGINT',stop);process.once('SIGTERM',stop);
await build();
