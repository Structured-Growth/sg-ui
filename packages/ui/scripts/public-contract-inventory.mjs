// Resolve public export types from compiled declarations; never emits or edits package bytes.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {readFile,readdir,mkdir,writeFile,realpath} from 'node:fs/promises';
import {resolve,join,relative,dirname} from 'node:path';
const args=process.argv.slice(2), option=k=>{const i=args.indexOf(k);return i<0?undefined:args[i+1]};
assert(option('--package')&&option('--output'),'--package compiled-package-directory --output new-directory [--typescript absolute-typescript.js]');
const root=await realpath(resolve(option('--package'))),output=resolve(option('--output'));
assert(output!==root&&!output.startsWith(root+'/'),'Output must be outside package');
const req=createRequire(join(root,'package.json'));
const compiler=option('--typescript')?resolve(option('--typescript')):req.resolve('typescript');
const ts=req(compiler),manifest=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const all=[];
async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())await walk(p);else if(e.name.endsWith('.d.ts'))all.push(p);}}
await walk(join(root,'dist'));
const entries=[],assets=[];
for(const [route,entry]of Object.entries(manifest.exports)){
 const target=typeof entry==='string'?entry:entry.types;
 if(!target)continue;
 if(!target.endsWith('.d.ts')){assets.push({route,target});continue;}
 if(target.includes('*')){
  const escaped=resolve(root,target).split('*').map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  const pattern=new RegExp('^'+escaped.join('(.*)')+'$');
  for(const file of all){const match=file.match(pattern);if(match)entries.push({route:route.replace('*',match[1]),file});}
 }else entries.push({route,file:resolve(root,target)});
}
assert(entries.length,'No public declaration entries');
const options={noEmit:true,strict:true,skipLibCheck:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true};
const program=ts.createProgram([...new Set(entries.map(e=>e.file))],options),checker=program.getTypeChecker();
const flags=ts.TypeFormatFlags.NoTruncation|ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;
const format=t=>checker.typeToString(t,undefined,flags);
const location=node=>{const source=node.getSourceFile();return {file:relative(root,source.fileName),line:source.getLineAndCharacterOfPosition(node.getStart()).line+1}};
const contracts=new Map(),routes={},issues=[];
function describe(type,at){return {type:format(type),callSignatures:checker.getSignaturesOfType(type,ts.SignatureKind.Call).map(s=>checker.signatureToString(s,undefined,flags)),indexSignatures:checker.getIndexInfosOfType(type).map(i=>({key:format(i.keyType),value:format(i.type),readonly:i.isReadonly})),properties:checker.getPropertiesOfType(type).map(p=>{const d=p.valueDeclaration||p.declarations?.[0]||at,t=checker.getTypeOfSymbolAtLocation(p,d);return {name:p.name,optional:!!(p.flags&ts.SymbolFlags.Optional),type:format(t),callbacks:checker.getSignaturesOfType(checker.getNonNullableType(t),ts.SignatureKind.Call).map(s=>checker.signatureToString(s,undefined,flags)),declarations:(p.declarations||[]).map(location),deprecated:p.getJsDocTags(checker).filter(t=>t.name==='deprecated')};}).sort((a,b)=>a.name.localeCompare(b.name))};}
for(const entry of entries.sort((a,b)=>a.route.localeCompare(b.route))){
 const source=program.getSourceFile(entry.file),module=source&&checker.getSymbolAtLocation(source);
 if(!module){issues.push({route:entry.route,error:'Missing declaration module',file:relative(root,entry.file)});continue;}
 routes[entry.route]=[];
 for(const exported of checker.getExportsOfModule(module)){
  const target=exported.flags&ts.SymbolFlags.Alias?checker.getAliasedSymbol(exported):exported;
  const declarations=target.declarations||[],at=target.valueDeclaration||declarations[0]||source;
  const id=declarations.length?declarations.map(d=>relative(root,d.getSourceFile().fileName)+':'+d.pos+':'+target.name).join('|'):'unresolved:'+entry.route+':'+exported.name;
  routes[entry.route].push({name:exported.name,contract:id});
  if(!contracts.has(id)){
   const type=target.flags&ts.SymbolFlags.Value?checker.getTypeOfSymbolAtLocation(target,at):checker.getDeclaredTypeOfSymbol(target);
   const signatures=checker.getSignaturesOfType(type,ts.SignatureKind.Call);
   const parameters=signatures.map(signature=>signature.parameters.map(p=>{const d=p.valueDeclaration||p.declarations?.[0]||at,t=checker.getTypeOfSymbolAtLocation(p,d);return {name:p.name,...describe(t,d),alternatives:t.isUnion()?t.types.map(branch=>describe(branch,d)):undefined};}));
   const unresolved=!!(type.flags&(ts.TypeFlags.Any|ts.TypeFlags.Unknown));
   if(unresolved)issues.push({contract:id,name:exported.name,type:format(type),error:'Top-level any/unknown requires review'});
   contracts.set(id,{name:target.name,aliases:[],declarations:declarations.map(d=>({...location(d),text:d.getText()})),typeParameters:declarations.flatMap(d=>(d.typeParameters||[]).map(p=>p.getText())),...describe(type,at),parameters,deprecated:target.getJsDocTags(checker).filter(t=>t.name==='deprecated'),unresolved});
  }
  contracts.get(id).aliases.push({route:entry.route,name:exported.name});
 }
 routes[entry.route].sort((a,b)=>a.name.localeCompare(b.name));
}
const declarationHashes={};for(const p of all)declarationHashes[relative(root,p)]=hash(await readFile(p));
const receipt={schemaVersion:1,package:{name:manifest.name,version:manifest.version,manifestSha256:hash(await readFile(join(root,'package.json')))},compiler:{version:ts.version,sha256:hash(await readFile(compiler))},routes,assets,contracts:Object.fromEntries([...contracts].sort(([a],[b])=>a.localeCompare(b))),declarationHashes,issues,limits:['Resolved published declarations, including React/native inherited properties, union branches, callback payloads and refs. No emit or package mutation.','Optionality and JSDoc are not runtime defaults. Implementation/dataflow defaults and historical migration dispositions need their own source-backed evidence.','No runtime, installed-isolation, full declaration-internals compilation or release approval inferred.']};
await mkdir(output);await writeFile(join(output,'public-contracts.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({routes:entries.length,contracts:contracts.size,issues:issues.length,output}));
process.exitCode=issues.length?1:0;
