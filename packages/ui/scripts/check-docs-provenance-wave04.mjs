/** Current inventory, fixture-host and documentation-command checks.
 * First-party source-origin records are not required by this audit.
 */
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import ts from 'typescript';
import {checkDocsHost} from './check-docs-host.mjs';
const initial='21adebd61bedfc6a1ed395fe664ff4be83896821';
const workspacePath=p=>p.startsWith('src/')?`packages/ui/${p}`:p;
export function exportsIn(text,path='fixture.tsx') {
  const source=ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const result=[];
  for(const node of source.statements) {
    if(ts.isExportDeclaration(node)&&node.exportClause&&ts.isNamedExports(node.exportClause))for(const n of node.exportClause.elements)result.push(n.name.text);
    if(!node.modifiers?.some(m=>m.kind===ts.SyntaxKind.ExportKeyword))continue;
    if(ts.isVariableStatement(node))for(const d of node.declarationList.declarations)if(ts.isIdentifier(d.name))result.push(d.name.text);
    if((ts.isFunctionDeclaration(node)||ts.isClassDeclaration(node))&&node.name)result.push(node.name.text);
  }
  return result.sort();
}
export function checkManifest(manifest,exists) {
  const issues=[],rows=[],seen=new Set();
  for(const row of manifest.files) {
    const path=workspacePath(row.destination);
    if(seen.has(path))issues.push(`Duplicate current path: ${path}`);seen.add(path);
    const present=exists(path);
    if(present!==row.present)issues.push(`Presence mismatch: ${path}`);
    const replacements=(row.migration?.replacements??[]).map(workspacePath);
    for(const replacement of replacements)if(!exists(replacement))issues.push(`Missing replacement: ${replacement}`);
    if(!present&&!replacements.length)issues.push(`Removed component has no explicit replacement: ${path}`);
    rows.push({path,present,replacements});
  }
  return {issues,rows};
}
export function commandCodeIn(text) {
  const blocks=[];
  const prose=text.replace(/```[^\n]*\n([\s\S]*?)```/g,(_,code)=>{blocks.push(code);return '';});
  for(const m of prose.matchAll(/`([^`\n]+)`/g))blocks.push(m[1]);
  return blocks.join('\n');
}
export function checkCommands(text,manifests,document) {
  const issues=[],commands=[];
  const builtins=new Set(['install','exec','pack','dlx','why','list','add','remove','update','publish','config','store','-r']);
  for(const m of text.matchAll(/\bpnpm\s+(?:--filter\s+([@\w/.-]+)\s+)?(?:run\s+)?([\w:.-]+)/g)) {
    const [,filter,script]=m;
    if(builtins.has(script))continue;
    // Shell placeholders, process substitutions and complete shell semantics are outside scope.
    const manifest=filter?manifests.find(p=>p.name===filter):manifests[0];
    const exists=Boolean(manifest?.scripts?.[script]);
    commands.push({document,command:m[0],filter:filter??null,script,exists});
    if(!exists)issues.push(`${document}: unknown package/script in ${m[0]}`);
  }
  return {issues,commands};
}
export function checkScenarioTransfer(before,current,{original,fixture}) {
  const previous=exportsIn(before,original), now=exportsIn(current,fixture);
  return {original,fixture,previousExports:previous,currentExports:now,
    missingExports:previous.filter(name=>!now.includes(name))};
}
/** Validate explicit semantic records, not aliases or export-presence parity. */
export function checkScenarioDispositions(early,manifest,read) {
  const issues=[],rows=[],seen=new Set();
  if(manifest.schemaVersion!==1||manifest.baselineCommit!==initial)issues.push('Invalid early-scenario disposition schema/baseline');
  if(!Array.isArray(manifest.scenarios))issues.push('Expected explicit scenario disposition array');
  const expected=new Map(early.map(row=>[`${row.original}#${row.name}`,row]));
  for(const row of Array.isArray(manifest.scenarios)?manifest.scenarios:[]) {
    const key=`${row.original}#${row.name}`,source=expected.get(key),errors=[];
    if(seen.has(key))errors.push('duplicate disposition');seen.add(key);
    if(!source)errors.push('unknown original scenario');
    else if(row.initialSha256!==source.initialSha256)errors.push('original source hash mismatch');
    for(const field of ['originalBehavior','originalAssertions','rationale'])if(typeof row[field]!=='string'||!row[field].trim())errors.push(`missing ${field}`);
    if(!['represented','changed-contract','gap'].includes(row.disposition))errors.push('invalid semantic disposition');
    if(!Array.isArray(row.behaviorChanges)||!Array.isArray(row.remainingGaps))errors.push('explicit changes/gaps required');
    else if([...row.behaviorChanges,...row.remainingGaps].some(value=>typeof value!=='string'||!value.trim()))errors.push('changes/gaps must contain explicit descriptions');
    if(row.disposition==='changed-contract'&&!row.behaviorChanges?.length)errors.push('changed contract needs explicit differences');
    const evidence=row.evidence??[];
    if(!evidence.some(e=>e.kind==='fixture'||e.kind==='example')||!evidence.some(e=>e.kind==='test'))errors.push('current host and assertion evidence required');
    for(const ref of evidence) {
      if(!['fixture','example','implementation','test'].includes(ref.kind)||typeof ref.path!=='string'||ref.path.startsWith('/')||ref.path.split('/').includes('..')){errors.push('invalid evidence path/kind');continue;}
      let text;try{text=read(ref.path);}catch{errors.push(`missing evidence ${ref.path}`);continue;}
      if(typeof text!=='string'){errors.push(`missing evidence ${ref.path}`);continue;}
      if(typeof ref.claim!=='string'||!ref.claim.trim()||!Array.isArray(ref.anchors)||!ref.anchors.length)errors.push(`missing semantic claim/anchors ${ref.path}`);
      for(const anchor of ref.anchors??[])if(typeof anchor!=='string'||!anchor||!text.includes(anchor))errors.push(`stale evidence anchor ${ref.path}`);
      if(ref.kind==='test'&&(typeof ref.assertion!=='string'||!/(?:^|\s)expect\(/.test(ref.assertion)||!text.includes(ref.assertion)))errors.push(`missing current assertion ${ref.path}`);
    }
    const resolved=!errors.length&&row.disposition!=='gap'&&row.remainingGaps?.length===0;
    for(const error of errors)issues.push(`${key}: ${error}`);
    rows.push({...row,resolved});
  }
  return {issues,rows,unresolved:early.filter(row=>!rows.some(r=>r.original===row.original&&r.name===row.name&&r.resolved))};
}
export function audit(root) {
  const read=p=>readFileSync(resolve(root,p),'utf8');
  const host=checkDocsHost(root);
  const manifests=['package.json','packages/ui/package.json','apps/docs/package.json'].map(p=>JSON.parse(read(p)));
  const commandDocuments=['README.md','docs/migration.md','docs/developer/react-aria-component-recipe.md','docs/developer/react-aria-dependency-upgrades.md'];
  const commands=commandDocuments.map(p=>checkCommands(commandCodeIn(read(p)),manifests,p));
  const issues=[...host.findings.map(f=>`${f.file}: ${f.message}`),...commands.flatMap(r=>r.issues)];
  return {status:issues.length?'failed':'current-checks-pass',fixtureModules:host.modules,scenarios:host.scenarios,commands:commands.flatMap(r=>r.commands),issues,
    limits:['Current paths, fixture mapping and command existence only. No runtime, legal, release or manual acceptance inferred.']};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url) {
  try {const result=audit(resolve(dirname(fileURLToPath(import.meta.url)),'../../..'));console.log(JSON.stringify(result,null,2));process.exitCode=result.issues.length?1:0;}
  catch(error){console.error(error.stack);process.exitCode=2;}
}
