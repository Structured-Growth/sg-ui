// Data-only assembly of already validated exports; no build or deployment.
import assert from 'node:assert/strict';
import {cp,mkdir,readFile,readdir,lstat,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {isDocumentationReleaseVersion} from '../content/documentation-versioning.mjs';
export async function treeHashes(root){
 const hashes={};
 async function visit(dir,prefix=''){
  for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
   const rel=prefix+entry.name,path=join(dir,entry.name);const info=await lstat(path);
   assert(!info.isSymbolicLink(),'Snapshot symlink rejected');
   if(info.isDirectory())await visit(path,rel+'/');
   else {assert(info.isFile(),'Nonregular snapshot member');hashes[rel]=createHash('sha256').update(await readFile(path)).digest('hex');}
  }
 }
 await visit(root);return hashes;
}
export async function assembleStaticHost(destination,stages){
 assert(stages.length,'At least the development staging directory is required');
 const entries=[],seen=new Set();
 for(const stage of stages){
  const receipt=JSON.parse(await readFile(join(stage,'deployment-receipt.json'),'utf8'));
  const base=receipt.basePath;
  assert(base==='/dev'||(base?.startsWith('/releases/')&&!base.slice(10).startsWith('v')&&isDocumentationReleaseVersion(base.slice(10))),'Invalid staged base path');
  assert(!seen.has(base),'Duplicate immutable release/development prefix');seen.add(base);
  const root=join(stage,'.'+base);const hashes=await treeHashes(root);
  assert(hashes['index.html']&&hashes['documentation-routes.json'],'Incomplete snapshot');
  const routes=JSON.parse(await readFile(join(root,'documentation-routes.json'),'utf8')).routes;
  assert(Array.isArray(routes)&&routes.includes('/'),'Invalid route manifest');
  for(const route of routes){assert(/^\/(?!\/)[^?#\\]*$/.test(route)&&!route.split('/').includes('..'),'Unsafe manifest route');assert(hashes[(route==='/'?'':route.slice(1)+'/')+'index.html'],'Missing route HTML');}
  entries.push({stage,root,base,hashes,receipt,rules:JSON.parse(await readFile(join(stage,'amplify-redirects.json'),'utf8'))});
 }
 assert(seen.has('/dev'),'Development snapshot required');
 const stable=entries.filter(e=>/^\/releases\/\d+\.\d+\.\d+$/.test(e.base)).sort((a,b)=>{
  const av=a.base.slice(10).split('.').map(BigInt),bv=b.base.slice(10).split('.').map(BigInt);
  for(let i=0;i<3;i++)if(av[i]!==bv[i])return av[i]>bv[i]?-1:1;
  return 0;
 });
 const latest=stable[0]?.base??null;
 await mkdir(destination); // Never replace an existing host artifact.
 for(const entry of entries){
  await cp(entry.root,join(destination,'.'+entry.base),{recursive:true});
  assert.deepEqual(await treeHashes(join(destination,'.'+entry.base)),entry.hashes,'Snapshot changed during assembly');
 }
 const dev=entries.find(e=>e.base==='/dev');
 await cp(join(dev.stage,'404.html'),join(destination,'404.html'));
 const rules=[{source:'/',target:'/dev/',status:'302'},...(latest?[
  {source:'/latest',target:latest+'/',status:'302'},
  {source:'/latest/',target:latest+'/',status:'302'},
  {source:'/latest/<*>',target:latest+'/<*>',status:'302'},
 ]:[]),...entries.flatMap(e=>e.rules.filter(rule=>rule.source!=='/'))];
 await writeFile(join(destination,'amplify-redirects.json'),JSON.stringify(rules,null,2)+'\n');
 const receipt={schemaVersion:1,latest,snapshots:entries.map(e=>({basePath:e.base,source:e.receipt.sourceHead,hashes:e.hashes})),limits:['All supplied snapshots preserved byte-for-byte; caller must supply the complete authenticated release archive.','No deployment or release approval. Configure host rules separately.']};
 await writeFile(join(destination,'host-receipt.json'),JSON.stringify(receipt,null,2)+'\n');return receipt;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const [output,...stages]=process.argv.slice(2);assert(output,'Pass a fresh output and staged exports');
 const result=await assembleStaticHost(resolve(output),stages.map(p=>resolve(p)));
 console.log(`Preserved ${result.snapshots.length} snapshots; latest: ${result.latest??'none'}`);
}
