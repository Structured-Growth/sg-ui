import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {assembleStaticHost,treeHashes} from './assemble-static-host.mjs';
async function fixture(run){const root=await mkdtemp(join(tmpdir(),'sgui-host-assembly-'));try{await run(root);}finally{await rm(root,{recursive:true,force:true});}}
async function stage(root,base){const path=join(root,base.replaceAll('/','-'));const tree=join(path,'.'+base);await mkdir(tree,{recursive:true});await writeFile(join(tree,'index.html'),base);await writeFile(join(tree,'documentation-routes.json'),JSON.stringify({routes:['/']}));await writeFile(join(path,'404.html'),'missing');await writeFile(join(path,'deployment-receipt.json'),JSON.stringify({basePath:base,sourceHead:'fixture'}));await writeFile(join(path,'amplify-redirects.json'),'[]');return path;}
test('preserves every snapshot and chooses latest stable numerically',()=>fixture(async root=>{
 const stages=await Promise.all(['/dev','/releases/1.9.0','/releases/1.10.0','/releases/2.0.0-rc.1'].map(base=>stage(root,base)));
 const before=await treeHashes(join(stages[1],'releases/1.9.0'));
 const result=await assembleStaticHost(join(root,'host'),stages);assert.equal(result.latest,'/releases/1.10.0');assert.equal(result.snapshots.length,4);
 assert.deepEqual(await treeHashes(join(root,'host/releases/1.9.0')),before);
 const rules=JSON.parse(await readFile(join(root,'host/amplify-redirects.json'),'utf8'));assert.equal(rules.find(r=>r.source==='/latest/<*>').target,'/releases/1.10.0/<*>');
 await assert.rejects(assembleStaticHost(join(root,'host'),stages),/EEXIST/);
}));
test('does not invent latest before a stable release',()=>fixture(async root=>{const dev=await stage(root,'/dev');const result=await assembleStaticHost(join(root,'host'),[dev]);assert.equal(result.latest,null);}));
test('rejects duplicate immutable prefixes and symlinks before output creation',()=>fixture(async root=>{
 const dev=await stage(root,'/dev');await assert.rejects(assembleStaticHost(join(root,'duplicate'),[dev,dev]),/Duplicate/);
 await symlink('/etc/passwd',join(dev,'dev/escape'));await assert.rejects(assembleStaticHost(join(root,'linked'),[dev]),/symlink/);
}));
test('rejects missing manifest pages',()=>fixture(async root=>{const dev=await stage(root,'/dev');await writeFile(join(dev,'dev/documentation-routes.json'),JSON.stringify({routes:['/','/missing']}));await assert.rejects(assembleStaticHost(join(root,'host'),[dev]),/Missing route HTML/);}));
