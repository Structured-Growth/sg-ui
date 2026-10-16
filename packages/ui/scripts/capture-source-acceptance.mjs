// A-B-03 inventory, not an accessibility/security or behavioral conformance audit.
// Run from packages/ui. Repository contents are read; only the report is written.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import ts from 'typescript';
import postcss from 'postcss';

const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
assert.equal(process.cwd(),resolve(root,'packages/ui'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const files=[...new Set(execFileSync('git',['ls-files','-z','--cached','--others','--exclude-standard'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean))].sort();
const inputHashes={},imports=[],augmentations=[],classNames=[],domCandidates=[],cssSelectors=[],retiredReferences=[],hiddenConfiguration=[];
const excluded=[];
const domNames=new Set(['window','document','navigator','HTMLElement','HTMLInputElement','HTMLButtonElement','localStorage','sessionStorage','ResizeObserver','IntersectionObserver','MutationObserver','requestAnimationFrame','cancelAnimationFrame','getComputedStyle','matchMedia','visualViewport','getBoundingClientRect','querySelector','querySelectorAll','closest','elementFromPoint','scrollIntoView','setPointerCapture','releasePointerCapture','getSelection','createRange','createObjectURL','revokeObjectURL','clipboard','DataTransfer','PointerEvent']);
const retired=/@mui\b|@emotion\b|\bMui[A-Z]\w*|\bmaterial-ui\b|mui-typography|baseGridSx/g;
for(const file of files){
 // Never read local credentials, personal app state, or this audit's own output.
 if(/(^|\/)\.env(?:\.|$)/.test(file)||file.startsWith('.obsidian/')||file.startsWith('docs/developer/final-acceptance/')){excluded.push(file);continue;}
 if(!/\.(?:[cm]?[jt]sx?|css|json|ya?ml|md|txt|html|sh|toml)$/.test(file)&&!/(^|\/)\.(?:npmrc|nvmrc|gitignore)$/.test(file))continue;
 let bytes;try{bytes=await readFile(resolve(root,file));}catch(error){if(error.code==='ENOENT'){inputHashes[file]=null;continue;}throw error;}
 inputHashes[file]=hash(bytes);const code=bytes.toString('utf8');
 if(file.split('/').some(part=>part.startsWith('.')))hiddenConfiguration.push(file);
 const hits=[...code.matchAll(retired)];
 if(hits.length)retiredReferences.push({file,count:hits.length,classification:file.startsWith('docs/')?'documentation-or-historical':/LICENSE|NOTICES/.test(file)?'legal':file.includes('/scripts/')||file.includes('.test.')||file.includes('/tests/')?'guard-or-test':file.startsWith('packages/ui/src/')?'library-source-review':'configuration-or-tooling'});
 if(file.endsWith('.css')){postcss.parse(code,{from:file}).walkRules(rule=>cssSelectors.push({file,line:rule.source.start.line,selector:rule.selector}));}
 if(!/\.[cm]?[jt]sx?$/.test(file))continue;
 const source=ts.createSourceFile(file,code,ts.ScriptTarget.Latest,true);
 const dom=new Map();const line=node=>source.getLineAndCharacterOfPosition(node.getStart(source)).line+1;
 const reference=(node,specifier,kind,typeOnly=false)=>{
  if(specifier&&ts.isStringLiteralLike(specifier))imports.push({file,line:line(node),kind,specifier:specifier.text,typeOnly});
  else imports.push({file,line:line(node),kind,specifier:'<computed>',typeOnly});
 };
 function visit(node){
  if(ts.isImportDeclaration(node))reference(node,node.moduleSpecifier,'import',Boolean(node.importClause?.isTypeOnly));
  else if(ts.isExportDeclaration(node)&&node.moduleSpecifier)reference(node,node.moduleSpecifier,'reexport',node.isTypeOnly);
  else if(ts.isImportTypeNode(node)&&ts.isLiteralTypeNode(node.argument))reference(node,node.argument.literal,'import-type',true);
  else if(ts.isExternalModuleReference(node))reference(node,node.expression,'import-equals');
  else if(ts.isCallExpression(node)&&(node.expression.kind===ts.SyntaxKind.ImportKeyword||ts.isIdentifier(node.expression)&&node.expression.text==='require'))reference(node,node.arguments[0],'dynamic-or-require');
  if(ts.isModuleDeclaration(node)&&(ts.isStringLiteral(node.name)||node.name.text==='global'))augmentations.push({file,line:line(node),name:node.name.text});
  if(ts.isJsxAttribute(node)&&node.name.getText(source)==='className')classNames.push({file,line:line(node),expression:node.initializer?.getText(source).slice(0,240)??''});
  if(ts.isIdentifier(node)&&domNames.has(node.text)&&!dom.has(node.text))dom.set(node.text,line(node));
  ts.forEachChild(node,visit);
 }
 visit(source);if(dom.size)domCandidates.push({file,identifiers:Object.fromEntries([...dom].sort())});
}
const installed=JSON.parse(execFileSync('pnpm',['-r','list','--depth','Infinity','--json'],{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024}));
const nodes=new Map(),edges=new Set(),roots=[];
function dependencies(parent,groups){
 for(const group of ['dependencies','devDependencies','optionalDependencies'])for(const [alias,item] of Object.entries(groups[group]??{})){
  assert(!item.isMissing,`Missing installed dependency ${alias}`);
  const key=`${item.from??alias}@${item.version}`;
  nodes.set(key,{name:item.from??alias,version:item.version});edges.add(JSON.stringify({from:parent,to:key,group,alias}));
  dependencies(key,item);
 }
}
for(const item of installed){const key=`${item.name}@${item.version}`;roots.push({key,path:relative(root,item.path)});dependencies(key,item);}
const report={schemaVersion:1,capturedAt:new Date().toISOString(),head:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),scope:'Inventory includes maintained tracked/untracked text and hidden configuration, excluding personal state, .env files and this audit output. DOM identifiers are review candidates, not proven unguarded browser access. Installed dependency graph includes development tooling; lockfile hash is captured independently. Ignored generated declarations/runtime hashes are retained in FA-01.',inputHashes,hiddenConfiguration,excluded,imports,augmentations,classNames,domCandidates,cssSelectors,retiredReferences,installedDependencies:{roots,nodes:[...nodes.values()].sort((a,b)=>`${a.name}@${a.version}`.localeCompare(`${b.name}@${b.version}`)),edges:[...edges].sort().map(edge=>JSON.parse(edge))}};
await writeFile(resolve(root,'docs/developer/final-acceptance/2026-10-16-source-inventory.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({files:Object.keys(inputHashes).length,imports:imports.length,augmentations:augmentations.length,classNames:classNames.length,domCandidateFiles:domCandidates.length,cssSelectors:cssSelectors.length,hiddenConfiguration:hiddenConfiguration.length,retiredReferenceFiles:retiredReferences.length,dependencyNodes:nodes.size,dependencyEdges:edges.size}));
