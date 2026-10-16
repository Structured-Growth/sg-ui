import assert from 'node:assert/strict';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createRequire } from 'node:module';
const root=process.cwd(), owned=resolve(root,'docs/developer/final-acceptance/wave-03-05');
const ts=createRequire(resolve(root,'packages/ui/package.json'))('typescript');
const base=resolve(owned,'proposed-files/packages/ui/src'), results=[];
function inspect(dir){for(const e of readdirSync(dir,{withFileTypes:true})){const p=resolve(dir,e.name);if(e.isDirectory()){inspect(p);continue;}const target=relative(resolve(owned,'proposed-files'),p);const before=readFileSync(resolve(root,target),'utf8'),after=readFileSync(p,'utf8');
 function parse(text){const f=ts.createSourceFile(p,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const imports=f.statements.filter(ts.isImportDeclaration);return {body:f.statements.filter(n=>!ts.isImportDeclaration(n)).map(n=>n.getText(f)).join('\n'),locals:imports.flatMap(n=>n.importClause?.namedBindings?.elements?.map(e=>e.name.text)??[]).sort(),refs:imports.map(n=>n.moduleSpecifier.text)};}
 const a=parse(before),b=parse(after);assert.equal(a.body,b.body,target+' implementation changed');assert.deepEqual(a.locals,b.locals,target+' imported bindings changed');assert(!b.refs.some(r=>r.endsWith('/icons')),target+' still uses catalog');results.push({path:target,bodyUnchanged:true,bindingsUnchanged:true});}}
inspect(base);assert.equal(results.length,5);writeFileSync(resolve(owned,'payload-verification.json'),JSON.stringify({runtime:process.version,result:'pass',files:results},null,2)+'\n');console.log('Five import-only changes preserve implementation statements and named local bindings');
