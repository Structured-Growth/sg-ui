// Read-only source/emitted graph evidence; not a bundler/native/packed test.
import { readFileSync, readdirSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { resolve, dirname, relative, extname } from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const repo=process.cwd(), owned=resolve(repo,'docs/developer/final-acceptance/wave-03-05');
const ui=resolve(repo,'packages/ui'), ts=createRequire(resolve(ui,'package.json'))('typescript');
const sha=b=>createHash('sha256').update(b).digest('hex');
const hashes={};
function read(p, overlay=false) {
 const rel=relative(repo,p), mirror=resolve(owned,'proposed-files',rel);
 const actual=overlay&&existsSync(mirror)?mirror:p, bytes=readFileSync(actual);
 hashes[relative(repo,actual)]=sha(bytes); return bytes.toString();
}
function references(p,overlay) {
 const sf=ts.createSourceFile(p,read(p,overlay),ts.ScriptTarget.Latest,true);
 const refs=[];
 function walk(n) {
  if ((ts.isImportDeclaration(n)||ts.isExportDeclaration(n))&&n.moduleSpecifier&&ts.isStringLiteral(n.moduleSpecifier)) {
   if(n.isTypeOnly||n.importClause?.isTypeOnly)return;
   const bindings=n.importClause?.namedBindings??n.exportClause;
   if(bindings?.elements?.length&&bindings.elements.every(e=>e.isTypeOnly))return;
   refs.push(n.moduleSpecifier.text);
  }
  if(ts.isCallExpression(n)&&n.expression.kind===ts.SyntaxKind.ImportKeyword&&n.arguments.length===1&&ts.isStringLiteral(n.arguments[0]))refs.push(n.arguments[0].text);
  ts.forEachChild(n,walk);
 }
 walk(sf);return refs;
}
function graph(entry,overlay=false) {
 const seen=new Set(), external=new Set(), barrels=new Set(), missing=new Set();
 function visit(p) {
  if(seen.has(p))return;seen.add(p);
  for(const ref of references(p,overlay)) {
   if(!ref.startsWith('.')){external.add(ref);continue;}
   const path=resolve(dirname(p),ref);
   const candidates=[path,...(path.endsWith('.js')?[path.slice(0,-3)+'.ts',path.slice(0,-3)+'.tsx']:[]),...['.ts','.tsx','.js'].map(e=>path+e),...['.ts','.tsx','.js'].map(e=>resolve(path,'index'+e))];
   const found=candidates.find(p=>existsSync(p)&&statSync(p).isFile());
   if(!found){missing.add(relative(repo,p)+':'+ref);continue;}
   if(!/\.[cm]?[jt]sx?$/.test(found))continue;
   if(/\/(?:experimental\/)?icons\/index\.[jt]s$/.test(found))barrels.add(relative(repo,found));
   visit(found);
  }
 }
 visit(entry);
 return {modules:seen.size,heavy:[...external].filter(s=>/^(?:@lexical\/|lexical(?:\/|$)|@tanstack\/)/.test(s)).sort(),iconWrappers:[...seen].filter(p=>/\/experimental\/icons\/[^/]+Icon\.[jt]sx?$/.test(p)).map(p=>relative(repo,p)).sort(),iconBarrels:[...barrels].sort(),external:[...external].sort(),missing:[...missing].sort()};
}
const manifest=JSON.parse(read(resolve(ui,'package.json')));
const entries={};
for(const [key,exp] of Object.entries(manifest.exports)) {
 if(!exp.import||key.includes('*'))continue;
 const dist=resolve(ui,exp.import);const source=dist.replace('/dist/','/src/').replace(/\.js$/,'.ts');
 const src=existsSync(source)?source:source+'x';
 if(!existsSync(src))continue;
 entries[key]={source:graph(src),proposed:graph(src,true),emitted:graph(dist)};
}
// Explicit wildcard representative and all declared individual icon modules.
for(const folder of ['icons','experimental/icons'])for(const file of readdirSync(resolve(ui,'dist',folder)).filter(f=>f.endsWith('Icon.js'))) {
 const key='./'+folder+'/'+file.slice(0,-3), path=resolve(ui,'dist',folder,file);
 entries[key]={emitted:graph(path)};
}
const prior={};
for(const wave of ['wave-02-05','wave-02-03','wave-02-15','wave-02-12']) {
 const p=resolve(repo,'docs/developer/final-acceptance',wave,'results.json');const d=JSON.parse(read(p));
 prior[wave]={resultSha256:hashes[relative(repo,p)],inputComparisons:[]};
 const companionName=wave==='wave-02-15'?'input-receipt.json':'evidence.json';
 const companionPath=resolve(repo,'docs/developer/final-acceptance',wave,companionName);
 const companion=existsSync(companionPath)?JSON.parse(read(companionPath)):{};
 const records=d.inputHashes??companion.inputHashes??companion.inputs??{};
 const pairs=Array.isArray(records)?records.map(x=>[x.path,x.sha256]):Object.entries(records).map(([p,h])=>[p,typeof h==='string'?h:h.sha256]);
 for(const [path,expected] of pairs)if(typeof expected==='string')prior[wave].inputComparisons.push({path,exists:existsSync(resolve(repo,path)),unchanged:existsSync(resolve(repo,path))&&sha(readFileSync(resolve(repo,path)))===expected});
}
const coord=JSON.parse(read(resolve(repo,'docs/developer/final-acceptance/coordinator-integration/evidence.json')));
const coordOutputs=Object.entries(coord.builtLibraryHashes??{}).map(([p,h])=>({path:p,exists:existsSync(resolve(repo,p)),unchanged:existsSync(resolve(repo,p))&&sha(readFileSync(resolve(repo,p)))===h}));
const result={runtime:process.version,platform:process.platform,method:'TypeScript AST static runtime-reference traversal; all reexports traversed, no tree shaking or upstream traversal',entries,prior,coordinatorOutputComparison:{total:coordOutputs.length,changed:coordOutputs.filter(x=>!x.unchanged)},hashes};
writeFileSync(resolve(owned,'boundary-evidence.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({runtime:process.version,entries:Object.keys(entries).length,coordinatorOutputs:result.coordinatorOutputComparison,iconImportChanges:Object.entries(entries).filter(([k,v])=>v.source&&v.source.iconWrappers.length!==v.proposed.iconWrappers.length).map(([k,v])=>({entry:k,before:v.source.iconWrappers.length,after:v.proposed.iconWrappers.length})),hashes:Object.keys(hashes).length},null,2));
