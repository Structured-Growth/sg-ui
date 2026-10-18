const fs = require('node:fs');
const path = require('node:path');
const ts = require(path.resolve('packages/ui/node_modules/typescript'));
const base = 'docs/developer/final-acceptance/wave-04/02';
const targets = JSON.parse(fs.readFileSync(`${base}/proposal-targets.json`));
const results = targets.map(t => {
 const result = ts.transpileModule(fs.readFileSync(`${base}/proposed-files/${t.path}`, 'utf8'), {fileName:t.path,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});
 return {path:t.path,diagnostics:(result.diagnostics||[]).map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n'))};
});
console.log(JSON.stringify({typescript:ts.version,check:'syntax only, not type or runtime validation',results},null,2));
if(results.some(r=>r.diagnostics.length))process.exitCode=1;
