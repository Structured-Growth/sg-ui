const ts = require('../../../../../packages/ui/node_modules/typescript');
const fs = require('node:fs');
const path = require('node:path');
const root = process.cwd();
const own = path.resolve(__dirname, 'proposed-files');
const overlay = new Map();
function visit(dir) {
 for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
  const file=path.join(dir,entry.name);
  if(entry.isDirectory()) visit(file); else overlay.set(path.resolve(root,path.relative(own,file)),fs.readFileSync(file,'utf8'));
 }
}
visit(own);
const config=path.resolve(root,'packages/ui/playwright.visual-acceptance.config.ts');
const options={target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,strict:true,skipLibCheck:true,noEmit:true,types:['node'],typeRoots:[path.resolve(root,'packages/ui/node_modules/@types')]};
const host=ts.createCompilerHost(options); const read=host.readFile,exists=host.fileExists;
host.readFile=file=>overlay.get(path.resolve(file))??read(file);
host.fileExists=file=>overlay.has(path.resolve(file))||exists(file);
const program=ts.createProgram([config, path.resolve(root,'packages/ui/playwright.wave04-browser-acceptance.config.ts'), path.resolve(root,'packages/ui/tests/browser/wave04-browser-acceptance.spec.ts')],options,host);
const diagnostics=ts.getPreEmitDiagnostics(program);
const formatted=ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:x=>x,getCurrentDirectory:()=>root,getNewLine:()=> '\n'});
const receipt={node:process.version,typescript:ts.version,kind:'In-memory proposed visual/native config and native spec semantic typecheck, no emit, no browser',diagnostics:diagnostics.length,details:formatted};
fs.writeFileSync(path.join(__dirname,'proposal-types.json'),JSON.stringify(receipt,null,2));
console.log(formatted||'Zero TypeScript diagnostics');process.exitCode=diagnostics.length?1:0;
