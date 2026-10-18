// Bounded local declaration fixture proof; no installed-consumer claim or output emit.
import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const here=dirname(fileURLToPath(import.meta.url)),ui=resolve(here,'../../../../../packages/ui');
const req=createRequire(join(ui,'package.json')),ts=req('typescript'),manifest=JSON.parse(await readFile(join(ui,'package.json'),'utf8'));
const actual=join(here,'proposed-files/packages/ui/scripts/public-contract-consumer.tsx'),virtual=join(ui,'scripts/__wave04_contract_fixture.tsx');
const code=await readFile(actual,'utf8'),paths={};
for(const [name,value]of Object.entries(manifest.exports)){if(value.types)paths[manifest.name+(name==='.'?'':name.slice(1))]=[value.types];}
const results={node:process.version,typescript:ts.version,fixtureSha256:createHash('sha256').update(code).digest('hex'),limits:'Local existing dist declarations and matched repository types, using explicit public export paths. No emit/install/build/SSR/browser; not an isolated installed consumer.',runs:[]};
const parsed=ts.createSourceFile(virtual,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const directives=[...code.matchAll(/^[\t ]*\/\/\s*@ts-expect-error[^\n]*/gm)].map(m=>({start:m.index,end:parsed.statements.find(s=>s.end>m.index+m[0].length).end}));
for(const skipLibCheck of [true,false]){
 const options={noEmit:true,strict:true,skipLibCheck,jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,target:ts.ScriptTarget.ES2022,esModuleInterop:true,baseUrl:ui,paths,types:[],lib:['lib.es2022.d.ts','lib.dom.d.ts','lib.dom.iterable.d.ts']};
 function compile(text){const host=ts.createCompilerHost(options),read=host.readFile.bind(host),exists=host.fileExists.bind(host);host.fileExists=p=>p===virtual||exists(p);host.readFile=p=>p===virtual?text:read(p);return ts.getPreEmitDiagnostics(ts.createProgram([virtual],options,host)).map(d=>({code:d.code,file:d.file?.fileName,start:d.start,message:ts.flattenDiagnosticMessageText(d.messageText,'\n')}));}
 const diagnostics=compile(code),negative=compile(code.replace(/^[\t ]*\/\/\s*@ts-expect-error[^\n]*/gm,m=>' '.repeat(m.length)));
 const rejected=directives.map(d=>negative.some(n=>n.file===virtual&&n.start>=d.start&&n.start<d.end));
 results.runs.push({skipLibCheck,diagnostics,negative,rejected,passed:diagnostics.length===0&&rejected.every(Boolean)});
}
results.passed=results.runs.every(r=>r.passed);
await writeFile(join(here,'contract-fixture-proof.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({passed:results.passed,runs:results.runs.map(r=>({skipLibCheck:r.skipLibCheck,diagnostics:r.diagnostics.length,rejected:r.rejected.filter(Boolean).length,total:r.rejected.length}))}));
process.exitCode=results.passed?0:1;
