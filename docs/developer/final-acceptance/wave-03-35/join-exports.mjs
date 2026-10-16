import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
const out=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(out,'../../../..');
const require=createRequire(path.join(root,'packages/ui/package.json')),ts=require('typescript');
const read=f=>JSON.parse(readFileSync(path.join(root,f),'utf8'));
const base=read('docs/developer/migration-baseline/public-api.json'),pkg=read('docs/developer/migration-baseline/package.json');
const api=read('docs/developer/final-acceptance/parallel-01/api-snapshot.json');
const cache=new Map();
function exportsOf(f,seen=new Set()) {
 if(cache.has(f))return cache.get(f);if(seen.has(f))return new Map();seen=new Set([...seen,f]);
 if(!base[f])throw Error(`Missing baseline local declaration ${f}`);
 const result=new Map(),source=ts.createSourceFile(f,base[f],ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
 for(const n of source.statements){
  if(ts.isExportDeclaration(n)) {
   const spec=n.moduleSpecifier?.text,local=spec?.startsWith('.')?path.posix.normalize(path.posix.join(path.posix.dirname(f),spec.replace(/\.js$/,'.d.ts'))):null;
   if(n.exportClause&&ts.isNamedExports(n.exportClause))for(const e of n.exportClause.elements)result.set(e.name.text,{origin:f,sourceName:e.propertyName?.text??e.name.text,target:local??spec??null});
   else if(local)for(const [name,entry]of exportsOf(local,seen))result.set(name,entry);
  } else if(n.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword)) {
   if(ts.isVariableStatement(n))for(const d of n.declarationList.declarations)if(ts.isIdentifier(d.name))result.set(d.name.text,{origin:f,sourceName:d.name.text});
   else {} // Exported interfaces/functions/classes/types below.
   if(n.name&&ts.isIdentifier(n.name)&&!n.modifiers.some(m=>m.kind===ts.SyntaxKind.DefaultKeyword))result.set(n.name.text,{origin:f,sourceName:n.name.text});
  }
 }
 cache.set(f,result);return result;
}
const identities=[];
for(const [route,target] of Object.entries(pkg.exports))if(typeof target==='object')for(const [name,entry]of exportsOf(target.types.replace('./dist/','')))identities.push({route,name,...entry});
const names=new Map();for(const x of identities){if(!names.has(x.name))names.set(x.name,[]);names.get(x.name).push(x);}
const current=Object.entries(api.contracts).map(([id,c])=>({id,name:c.name,declarations:c.declarations.map(({file,line})=>({file,line})),routes:Object.entries(api.routes).filter(([,xs])=>xs.some(x=>x.contract===id)).map(([r])=>r)}));
for(const c of current)c.publicIdentities=Object.entries(api.routes).flatMap(([route,xs])=>xs.filter(x=>x.contract===c.id).map(x=>({route,name:x.name})));
const currentNames=new Set(current.flatMap(c=>c.publicIdentities.map(x=>x.name)));
writeFileSync(path.join(out,'baseline-export-identities.json'),JSON.stringify({method:'TypeScript AST over frozen declaration graph; external reexport names retained explicitly; no old dependency installed or executed.',identities},null,2)+'\n');
console.log(JSON.stringify({baselineIdentities:identities.length,baselineNames:names.size,currentContracts:current.length,removedNames:[...names.keys()].filter(n=>!currentNames.has(n))},null,2));
writeFileSync(path.join(out,'export-join-work.json'),JSON.stringify({baselineNames:Object.fromEntries(names),current},null,2)+'\n');
// Reconcile only the changed declaration snapshot, using current declaration exports.
// No runtime imports, fresh build, dependency install or shared generated output.
const inv=read('docs/developer/final-acceptance/2026-10-16-inventory.json');
const program=ts.createProgram(inv.entries.map(e=>path.join(root,'packages/ui',e.types)),{skipLibCheck:true,module:ts.ModuleKind.NodeNext,moduleResolution:ts.ModuleResolutionKind.NodeNext,target:ts.ScriptTarget.ES2022});
const checker=program.getTypeChecker(),delta=[];
for(const e of inv.entries){
 const f=program.getSourceFile(path.join(root,'packages/ui',e.types));if(!f)throw Error(`Missing ${e.types}`);
 const names=checker.getExportsOfModule(checker.getSymbolAtLocation(f)).map(x=>x.name).sort();
 const prior=(api.routes[e.subpath]??[]).map(x=>x.name).sort();
 if(JSON.stringify(names)!==JSON.stringify(prior))delta.push({route:e.subpath,previous:prior,current:names});
}
writeFileSync(path.join(out,'current-export-delta.json'),JSON.stringify({entries:inv.entries.length,method:'TypeScript checker on existing current built declarations; no runtime re-execution.',routeNameDeltas:delta},null,2)+'\n');
if(delta.length)throw Error('Current public route names differ; refresh affected join before accepting.');
