import ts from '../../../../packages/ui/node_modules/typescript/lib/typescript.js';
import fs from 'node:fs';
import path from 'node:path';
const owner=path.dirname(new URL(import.meta.url).pathname);
let count=0;
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else if(/\.(ts|tsx)$/.test(file)){
  const result=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});
  const errors=(result.diagnostics??[]).filter(d=>d.category===ts.DiagnosticCategory.Error);
  if(errors.length)throw new Error(ts.formatDiagnosticsWithColorAndContext(errors,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>owner,getNewLine:()=> '\n'}));count++;
 }}}
walk(path.join(owner,'proposed-files'));console.log(`${count} proposed TypeScript files transpile without syntax diagnostics. This is not a public API typecheck or native execution.`);
