// Source-only audit of current dependencies and native fixture registration.
import {readFileSync,readdirSync} from 'node:fs';
import {resolve,posix} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import ts from 'typescript';

const retired=name=>/^(?:@storybook\/|storybook(?:$|\/))/.test(name);
export function docsHostFindings(files) {
 const findings=[];const issue=(file,message)=>findings.push({file,message});
 for(const file of ['package.json','packages/ui/package.json','apps/docs/package.json']) {
  const manifest=JSON.parse(files[file]);
  for(const group of ['dependencies','devDependencies','optionalDependencies','peerDependencies'])
   for(const name of Object.keys(manifest[group]??{}))if(retired(name))issue(file,`Retired dependency: ${name}`);
  for(const [name,command] of Object.entries(manifest.scripts??{}))if(/storybook|test-storybook|storybook-static/i.test(command))issue(file,`Retired command: ${name}`);
 }
 if(/^\s+['"]?(?:@storybook\/[^\s:'"]+|storybook)(?:@|:|['"])/m.test(files['pnpm-lock.yaml']))issue('pnpm-lock.yaml','Retired locked dependency');
 for(const [file,text] of Object.entries(files)) {
  if(file.startsWith('.github/workflows/')) {
   if(/storybook|test-storybook|storybook-static/i.test(text.replace(/^\s*#.*$/gm,'')))issue(file,'Retired CI host reference');
  }
  if(!/^(?:packages\/ui\/src\/|apps\/docs\/)/.test(file)||! /\.[cm]?[jt]sx?$/.test(file))continue;
  if(/(?:^|\/)\.storybook(?:\/|$)|\.stories\.[cm]?[jt]sx?$/.test(file))issue(file,'Retired story/configuration source');
  const source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
  function visit(node) {
   let specifier;
   if(ts.isImportDeclaration(node)||ts.isExportDeclaration(node))specifier=node.moduleSpecifier;
   else if(ts.isImportTypeNode(node)&&ts.isLiteralTypeNode(node.argument))specifier=node.argument.literal;
   else if(ts.isCallExpression(node)&&(node.expression.kind===ts.SyntaxKind.ImportKeyword||ts.isIdentifier(node.expression)&&node.expression.text==='require'))specifier=node.arguments[0];
   if(specifier&&ts.isStringLiteralLike(specifier)&&retired(specifier.text))issue(file,`Retired source import: ${specifier.text}`);
   ts.forEachChild(node,visit);
  }
  visit(source);
 }
 const host='apps/docs/native-fixtures';
 const manifest=JSON.parse(files[`${host}/module-manifest.json`]);
 const registry=JSON.parse(files[`${host}/registry.json`]).entries;
 const mapped=new Map();
 for(const item of manifest.modules) {
  if(!item.fixture.startsWith(`${host}/scenarios/`)||posix.normalize(item.fixture)!==item.fixture||!Object.hasOwn(files,item.fixture))issue(item.fixture,'Missing or unsafe mapped fixture');
  if(mapped.has(item.fixture))issue(item.fixture,'Duplicate fixture mapping');
  mapped.set(item.fixture,item);
 }
 const used=new Set();
 for(const [id,entry] of Object.entries(registry)) {
  const path=typeof entry.module==='string'?posix.normalize(`${host}/${entry.module}`):'';
  const item=mapped.get(path);
  if(entry.id!==id||!item?.scenarioModule||entry.importPath!==entry.module)issue(id,'Registry entry does not match its scenario mapping');
  else used.add(path);
 }
 for(const [path,item] of mapped)if(item.scenarioModule&&!used.has(path))issue(path,'Mapped scenario has no registered example');
 if(!Object.keys(registry).length)issue(`${host}/registry.json`,'Empty fixture registry');
 return findings;
}

export function checkDocsHost(root) {
 const files={};
 function walk(dir) {
  for(const entry of readdirSync(resolve(root,dir),{withFileTypes:true})) {
   if(['node_modules','.next','artifacts','test-results','playwright-report'].includes(entry.name))continue;
   const file=`${dir}/${entry.name}`;
   if(entry.isDirectory())walk(file);
   else if(entry.isFile()&&/\.(?:[cm]?[jt]sx?|ya?ml|json)$/.test(file))files[file]=readFileSync(resolve(root,file),'utf8');
  }
 }
 for(const dir of ['packages/ui/src','apps/docs','.github/workflows'])walk(dir);
 for(const file of ['package.json','packages/ui/package.json','pnpm-lock.yaml'])files[file]=readFileSync(resolve(root,file),'utf8');
 const findings=docsHostFindings(files);
 return {files:Object.keys(files).length,modules:JSON.parse(files['apps/docs/native-fixtures/module-manifest.json']).modules.length,scenarios:Object.keys(JSON.parse(files['apps/docs/native-fixtures/registry.json']).entries).length,findings,limits:'Source/dependency/CI reference and manifest/registry consistency only; no build, execution, export resolution, preserved assertion audit or production acceptance.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
 const result=checkDocsHost(resolve(fileURLToPath(new URL('../../..',import.meta.url))));
 console.log(JSON.stringify(result,null,2));process.exitCode=result.findings.length?1:0;
}
