import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import {execFileSync} from 'node:child_process';
const root=process.cwd(), pkg=path.join(root,'packages/ui');
const require=createRequire(path.join(pkg,'package.json')), ts=require('typescript');
const reportDir=path.join(root,'docs/developer/final-acceptance/parallel-03');
const old=JSON.parse(fs.readFileSync(path.join(root,'docs/developer/final-acceptance/2026-10-16-inventory.json')));
const oldSource=JSON.parse(fs.readFileSync(path.join(root,'docs/developer/final-acceptance/2026-10-16-source-inventory.json')));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const rel=p=>path.relative(root,p);
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
function parse(file){return ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);}
function modules(sf){const refs=[];function walk(n){let m;if(ts.isImportDeclaration(n)||ts.isExportDeclaration(n))m=n.moduleSpecifier;else if(ts.isImportTypeNode(n)&&ts.isLiteralTypeNode(n.argument))m=n.argument.literal;else if(ts.isExternalModuleReference(n))m=n.expression;else if(ts.isCallExpression(n)&&(n.expression.kind===ts.SyntaxKind.ImportKeyword||n.expression.getText(sf)==='require'))m=n.arguments[0];if(m&&ts.isStringLiteralLike(m))refs.push({module:m.text,line:sf.getLineAndCharacterOfPosition(n.getStart(sf)).line+1,kind:ts.SyntaxKind[n.kind]});ts.forEachChild(n,walk);}walk(sf);return refs;}
const forbidden=/^(?:react-aria(?:-components)?|react-stately|@react-aria\/|@react-stately\/|@react-types\/|@internationalized\/date|@tanstack\/)/;
const prod=files(path.join(pkg,'src')).filter(f=>/\.tsx?$/.test(f)&&!(/\.(?:test|native-fixture[^.]*)\./.test(f)||f.includes('/fixtures/')));
const dts=files(path.join(pkg,'dist')).filter(f=>f.endsWith('.d.ts'));
const sourceImports=[],declarationImports=[],heritage=[],callbacks=[],inputHashes={};
for(const file of [...prod,...dts]){const sf=parse(file);inputHashes[rel(file)]=hash(fs.readFileSync(file));const refs=modules(sf);for(const ref of refs)if(!ref.module.startsWith('.'))(file.endsWith('.d.ts')?declarationImports:sourceImports).push({file:rel(file),...ref});if(file.endsWith('.d.ts')){function walk(n){if(ts.isInterfaceDeclaration(n)&&n.heritageClauses)heritage.push({file:rel(file),line:sf.getLineAndCharacterOfPosition(n.getStart(sf)).line+1,name:n.name.text,bases:n.heritageClauses.map(c=>c.getText(sf))});if(ts.isPropertySignature(n)&&n.name&&/^on[A-Z]/.test(n.name.getText(sf)))callbacks.push({file:rel(file),line:sf.getLineAndCharacterOfPosition(n.getStart(sf)).line+1,signature:n.getText(sf)});ts.forEachChild(n,walk);}walk(sf);}}
const checkerSource=fs.readFileSync(path.join(pkg,'scripts/check-foundations.mjs'),'utf8');
// Read the registry's explicit literals and generated component names; no guard execution.
const registryNames=checkerSource.match(/const interactionFiles = new Set\(\[([\s\S]*?)\]\s*\.map/)[1].match(/'([^']+)'/g).map(v=>v.slice(1,-1));
const registry=new Set(registryNames.map(n=>`packages/ui/src/experimental/${n}/${n}.tsx`));
for(const match of checkerSource.matchAll(/interactionFiles\.add\("([^"]+)"\)/g))registry.add('packages/ui/'+match[1]);
const ariaImports=sourceImports.filter(r=>/^(?:react-aria(?:-components)?|react-stately|@react-aria\/|@react-stately\/)/.test(r.module));
const escapes=ariaImports.filter(r=>!registry.has(r.file));
const reachable=new Set();
function visit(file){if(reachable.has(file))return;reachable.add(file);for(const r of modules(parse(file))){if(r.module.startsWith('.')){const resolved=ts.resolveModuleName(r.module,file,{moduleResolution:ts.ModuleResolutionKind.Bundler},ts.sys).resolvedModule;if(resolved&&resolved.resolvedFileName.startsWith(path.join(pkg,'dist')))visit(resolved.resolvedFileName);}}}
for(const e of old.entries)visit(path.resolve(pkg,e.types));
const publicExternal=declarationImports.filter(r=>reachable.has(path.resolve(root,r.file))&&!['react','react/jsx-runtime'].includes(r.module));
const changedSource=Object.entries(oldSource.inputHashes).filter(([f,h])=>f.startsWith('packages/ui/')&&(!fs.existsSync(path.join(root,f))||hash(fs.readFileSync(path.join(root,f)))!==h)).map(([f,h])=>({file:f,previous:h,current:fs.existsSync(path.join(root,f))?hash(fs.readFileSync(path.join(root,f))):null}));
const changedOutput=Object.entries(old.builtHashes).filter(([f,h])=>!fs.existsSync(path.join(pkg,f))||hash(fs.readFileSync(path.join(pkg,f)))!==h).map(([f,h])=>({file:f,previous:h,current:fs.existsSync(path.join(pkg,f))?hash(fs.readFileSync(path.join(pkg,f))):null}));
const newProduction=prod.filter(f=>!oldSource.inputHashes[rel(f)]).map(rel);
for(const f of ['packages/ui/scripts/check-foundations.mjs','packages/ui/scripts/check-package.mjs','packages/ui/scripts/react-stately-boundaries.test.mjs','packages/ui/package.json'])inputHashes[f]=hash(fs.readFileSync(path.join(root,f)));
const out={capturedAt:new Date().toISOString(),head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),scope:'Read-only AST audit; no compiler emit, runtime tests, build, package rerun, browser or AT execution.',summary:{productionSourceFiles:prod.length,declarationFiles:dts.length,publicEntriesReused:old.entries.length,publicReachableDeclarationFiles:reachable.size,ariaImportReferences:ariaImports.length,ariaImportFiles:new Set(ariaImports.map(r=>r.file)).size,unregisteredAriaReferences:escapes.length,forbiddenDeclarationImports:declarationImports.filter(r=>forbidden.test(r.module)).length,publicNonReactExternalReferences:publicExternal.length,changedSourceInputs:changedSource.length,changedBuiltOutputs:changedOutput.length,newProductionFiles:newProduction.length},reusedEvidence:{fa01CapturedAt:old.capturedAt,fa02CapturedAt:oldSource.capturedAt},changedSource,changedOutput,newProduction,sourceImports,unregisteredAriaReferences:escapes,declarationImports,publicNonReactExternalReferences:publicExternal,heritage,callbacks,inputHashes};
fs.writeFileSync(path.join(reportDir,'audit-evidence.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out.summary,null,2));
console.log('Changed source:',JSON.stringify(changedSource.map(x=>x.file)));
console.log('Public non-React external:',JSON.stringify(publicExternal));
