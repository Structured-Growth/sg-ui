import {createRequire} from 'node:module';
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,join} from 'node:path';
const owned=fileURLToPath(new URL('.',import.meta.url));
const root=resolve(owned,'../../../..');
const ts=createRequire(join(root,'packages/ui/package.json'))('typescript');
function files(dir) {return readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?files(join(dir,x.name)):[join(dir,x.name)]);}
const results=files(join(owned,'proposed-files')).filter(p=>/\.tsx?$/.test(p)).map(file=>{
 const result=ts.transpileModule(readFileSync(file,'utf8'),{fileName:file,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});
 return {file,diagnostics:(result.diagnostics??[]).map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n'))};
});
writeFileSync(join(owned,'static-check.json'),JSON.stringify({runtime:process.version,typescript:ts.version,kind:'syntax transpilation only; not typecheck or execution',results},null,2)+'\n');
if(results.some(r=>r.diagnostics.length))process.exitCode=1;
