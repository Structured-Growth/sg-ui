import ts from '../../../../packages/ui/node_modules/typescript/lib/typescript.js';
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const own=new URL('.',import.meta.url).pathname;
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);}
const inputs=[join(own,'acceptance.test.tsx'),...files(join(own,'proposed-files')).filter(f=>/\.tsx?$/.test(f))];
const outcomes=inputs.map(path=>{
 const result=ts.transpileModule(readFileSync(path,'utf8'),{fileName:path,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},reportDiagnostics:true});
 return {path,diagnostics:(result.diagnostics??[]).map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n'))};
});
const result={command:'Node 24 check-syntax.mjs',node:process.version,typescript:ts.version,scope:'transpileModule syntax diagnostics only; no semantic typecheck, test or browser execution',outcomes};
writeFileSync(join(own,'syntax-results.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
if(outcomes.some(x=>x.diagnostics.length))process.exitCode=1;
