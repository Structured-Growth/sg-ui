/** Read-only extraction/story/command guard. Run from any cwd:
 * node packages/ui/scripts/check-docs-provenance-wave04.mjs [--strict-history] [--json]
 * Structural success preserves explicit unresolved early scenarios; --strict-history
 * fails while any such scenario lacks an explicit source-backed semantic disposition. No Git/network writes.
 * Local extraction Git objects authenticate local bytes only, never upstream behavior.
 */
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import ts from 'typescript';
const initial='21adebd61bedfc6a1ed395fe664ff4be83896821';
const beforeDocs='530bbc00465d9dbf1e9948f8a2c01b2e51b1a479^';
const hash=text=>createHash('sha256').update(text).digest('hex');
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
export function checkManifest(manifest,baseline,exists) {
  const issues=[];const rows=[];
  for(const key of ['sourceRepository','sourceCommit','sourceRoot'])if(manifest[key]!==baseline[key])issues.push(`Changed original provenance: ${key}`);
  if(JSON.stringify(manifest.files.map(r=>[r.source,r.destination]))!==JSON.stringify(baseline.files.map(r=>[r.source,r.destination])))issues.push('Original ordered extraction source/destination identities differ');
  const seen=new Set();
  for(const r of manifest.files) {
    if(seen.has(r.source))issues.push(`Duplicate source identity: ${r.source}`);seen.add(r.source);
    const path=workspacePath(r.destination);const present=exists(path);
    if(present!==r.present)issues.push(`Presence mismatch: ${path}`);
    const replacements=(r.migration?.replacements??[]).map(workspacePath);
    for(const replacement of replacements)if(!exists(replacement))issues.push(`Missing replacement: ${replacement}`);
    if(!present&&replacements.length===0)issues.push(`Removed extraction has no explicit replacement: ${r.source}`);
    rows.push({source:r.source,path,present,replacements});
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
export function audit(root,{strictHistory=false}={}) {
  const read=p=>readFileSync(resolve(root,p),'utf8');
  const git=(ref,path)=>execFileSync('git',['show',`${ref}:${path}`],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});
  const manifest=JSON.parse(read('docs/extraction-manifest.json'));
  const baseline=JSON.parse(git(initial,'docs/extraction-manifest.json'));
  const extraction=checkManifest(manifest,baseline,p=>existsSync(resolve(root,p)));
  const issues=[...extraction.issues], transfers=[],early=[],deliberate=[];
  const modules=JSON.parse(read('apps/docs/native-fixtures/migration-manifest.json')).modules;
  const stories=manifest.files.filter(r=>r.destination.endsWith('.stories.tsx'));
  for(const story of stories) {
    const original=workspacePath(story.destination);
    const localPath=story.destination;
    const before=git(beforeDocs,localPath),first=git(initial,localPath);
    const mapping=modules.filter(r=>r.original===original);
    if(story.source==='components/AppButton/AppButton.stories.tsx') {
      const successors=['apps/docs/examples/ButtonDocumentation.tsx','apps/docs/native-fixtures/scenarios/experimental/Button/Button.fixture.tsx'];
      const documented=read('docs/developer/extraction-lineage.md');
      for(const name of exportsIn(before,localPath))if(!documented.includes(`| ${name} |`))issues.push(`Button export missing explicit lineage row: ${name}`);
      for(const target of successors)if(!story.migration?.replacements?.includes(target))issues.push(`Button successor absent from extraction mapping: ${target}`);
      deliberate.push({original,exports:exportsIn(before),successors,firstSha256:hash(first),beforeDocsSha256:hash(before),limit:'Documented deliberate replacement; no semantic-parity or runtime assertion inferred.'});
      continue;
    }
    if(mapping.length!==1){issues.push(`Expected one native migration mapping for ${original}; found ${mapping.length}`);continue;}
    if(!existsSync(resolve(root,mapping[0].fixture))){issues.push(`Missing native fixture: ${mapping[0].fixture}`);continue;}
    const current=read(mapping[0].fixture);
    const transfer=checkScenarioTransfer(before,current,mapping[0]);
    transfer.sourceSha256=hash(before);transfer.fixtureSha256=hash(current);
    transfers.push(transfer);
    for(const missing of transfer.missingExports)issues.push(`Lost pre-docs scenario: ${original}#${missing}`);
    const beforeNames=exportsIn(before);
    for(const name of exportsIn(first).filter(name=>!beforeNames.includes(name)))early.push({original,name,initialSha256:hash(first),fixture:mapping[0].fixture,status:'semantic-disposition-required'});
  }
  const dispositionPath='apps/docs/native-fixtures/scenario-dispositions.json';
  const dispositions=existsSync(resolve(root,dispositionPath))?checkScenarioDispositions(early,JSON.parse(read(dispositionPath)),read):{issues:[],rows:[],unresolved:early};
  issues.push(...dispositions.issues);
  if(strictHistory)for(const e of dispositions.unresolved)issues.push(`Unresolved early extracted scenario: ${e.original}#${e.name}`);
  const manifests=['package.json','packages/ui/package.json','apps/docs/package.json'].map(p=>JSON.parse(read(p)));
  const commandDocuments=['README.md','docs/migration.md','docs/developer/react-aria-component-recipe.md','docs/developer/react-aria-dependency-upgrades.md'];
  const commandResults=commandDocuments.map(p=>checkCommands(commandCodeIn(read(p)),manifests,p));
  for(const result of commandResults)issues.push(...result.issues);
  return {status:issues.length?'failed':'structural-checks-pass',strictHistory,localBaseline:{commit:initial,preDocs:beforeDocs,originalSourceCommit:manifest.sourceCommit},
    extractionRows:extraction.rows,originalStoryModules:stories.length,transfers,deliberateReplacements:deliberate,earlyScenarioDispositions:dispositions.rows,unresolvedEarlyScenarios:dispositions.unresolved,
    commands:commandResults.flatMap(r=>r.commands),issues,
    limits:['Source/metadata/command existence only; no product, browser, spoken AT, legal, release or upstream authentication result.',
      'Command code spans/fences checked only in four named current guides; script names/package filters, not shell flags, arguments or actual execution.',
      'Semantic dispositions bind original hashes, behavior/differences/gaps and current host/assertion anchors; they do not prove runtime parity. Strict-history fails for unresolved records.']};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url) {
  try {
    const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
    const result=audit(root,{strictHistory:process.argv.includes('--strict-history')});
    console.log(JSON.stringify(process.argv.includes('--json')?result:{status:result.status,extractionRows:result.extractionRows.length,originalStoryModules:result.originalStoryModules,transfers:result.transfers.length,deliberateReplacements:result.deliberateReplacements.length,unresolvedEarlyScenarios:result.unresolvedEarlyScenarios,commands:result.commands.length,issues:result.issues,limits:result.limits},null,2));
    process.exitCode=result.issues.length?1:0;
  }catch(error){console.error(error.stack);process.exitCode=2;}
}
