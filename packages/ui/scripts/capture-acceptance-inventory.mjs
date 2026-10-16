// Capture evidence; this does not build, modify Git state, or certify acceptance.
// Run from packages/ui after a fresh build. Pass the repository-relative output path.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {dirname,resolve,relative} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';

const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const workspace=resolve(root,'packages/ui');
assert.equal(process.cwd(),workspace,'Run from packages/ui');
const output=resolve(root,process.argv[2]??'docs/developer/final-acceptance/2026-10-16-inventory.json');
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trimEnd();
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const manifest=JSON.parse(await readFile('package.json','utf8'));
const paths=git('ls-files','-z','--cached','--others','--exclude-standard').split('\0').filter(Boolean);
const libraryPaths=[...new Set(paths)].filter(path=>path.startsWith('packages/ui/')).sort();
const sourceHashes={};
for(const path of libraryPaths){
 try{sourceHashes[path]=hash(await readFile(resolve(root,path)));}
 catch(error){if(error.code!=='ENOENT')throw error;sourceHashes[path]=null;}
}
const entries=[];
for(const [subpath,conditions] of Object.entries(manifest.exports)){
 if(typeof conditions!=='object'||!conditions.import)continue;
 if(subpath.includes('*')){
  const pattern=conditions.import,folder=dirname(pattern);
  const [prefix,suffix]=pattern.slice(folder.length+1).split('*');
  for(const file of (await readdir(folder)).sort()){
   if(!file.startsWith(prefix)||!file.endsWith(suffix))continue;
   const name=file.slice(prefix.length,file.length-suffix.length);
   entries.push({subpath:subpath.replace('*',name),import:pattern.replace('*',name),types:conditions.types.replace('*',name)});
  }
 }else entries.push({subpath,...conditions});
}
const program=ts.createProgram(entries.map(entry=>entry.types),{skipLibCheck:true,module:ts.ModuleKind.NodeNext,moduleResolution:ts.ModuleResolutionKind.NodeNext,target:ts.ScriptTarget.ES2022});
const checker=program.getTypeChecker();
for(const entry of entries){
 const source=program.getSourceFile(entry.types);
 assert(source,`Missing declarations: ${entry.types}`);
 const symbol=checker.getSymbolAtLocation(source);
 assert(symbol,`Missing declaration module: ${entry.types}`);
 entry.declaredExports=checker.getExportsOfModule(symbol).map(exported=>{
  const target=exported.flags&ts.SymbolFlags.Alias?checker.getAliasedSymbol(exported):exported;
  return {name:exported.name,value:Boolean(target.flags&ts.SymbolFlags.Value),type:Boolean(target.flags&ts.SymbolFlags.Type)};
 }).sort((a,b)=>a.name.localeCompare(b.name));
 entry.runtimeExports=Object.keys(await import(pathToFileURL(resolve(entry.import)).href)).sort();
 assert.deepEqual(entry.runtimeExports,entry.declaredExports.filter(item=>item.value).map(item=>item.name).sort(),`Runtime/declaration export mismatch: ${entry.subpath}`);
 entry.declarationSha256=hash(await readFile(entry.types));
}
const directIconModules={};
for(const folder of ['src/icons','src/experimental/icons']){
 directIconModules[folder]=(await readdir(folder)).filter(file=>/Icon\.tsx?$/.test(file)&&!file.includes('.test.')).sort();
 const subpath=folder==='src/icons'?'./icons/':'./experimental/icons/';
 for(const file of directIconModules[folder])assert(entries.some(entry=>entry.subpath===subpath+file.replace(/\.tsx?$/,'')),`Icon module missing public route: ${folder}/${file}`);
}
const builtHashes={};
async function walk(folder){for(const item of (await readdir(folder,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){const path=`${folder}/${item.name}`;if(item.isDirectory())await walk(path);else builtHashes[path]=hash(await readFile(path));}}
await walk('dist');
const report={
 schemaVersion:1,capturedAt:new Date().toISOString(),
 scope:'Working-tree inventory only. Declarations and runtime names are captured; browser, legal, release and full API behavior acceptance remain separate.',
 git:{head:git('rev-parse','HEAD'),branch:git('branch','--show-current'),status:git('status','--porcelain=v1','--untracked-files=all').split('\n').filter(Boolean),tags:git('tag','--list').split('\n').filter(Boolean),remoteTrackingDev:git('rev-parse','refs/remotes/origin/dev'),remoteTrackingNote:'Local tracking ref only; no fetch performed.'},
 runtime:{node:process.version,pnpm:execFileSync('pnpm',['--version'],{encoding:'utf8'}).trim()},
 manifest:{name:manifest.name,version:manifest.version,type:manifest.type,engines:manifest.engines,peerDependencies:manifest.peerDependencies,dependencies:manifest.dependencies,files:manifest.files,sideEffects:manifest.sideEffects,publishConfig:manifest.publishConfig,exports:manifest.exports},
 entries,directIconModules,sourceHashes,builtHashes,
};
await mkdir(dirname(output),{recursive:true});await writeFile(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output:relative(root,output),entries:entries.length,primitiveExports:entries.find(entry=>entry.subpath==='./primitives')?.declaredExports.length,iconModules:Object.fromEntries(Object.entries(directIconModules).map(([key,value])=>[key,value.length])),libraryFiles:libraryPaths.length,builtFiles:Object.keys(builtHashes).length}));
