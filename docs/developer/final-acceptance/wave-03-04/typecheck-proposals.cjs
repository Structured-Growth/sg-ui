const fs = require('node:fs'); const path = require('node:path'); const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const out=__dirname, root=path.resolve(out,'../../../..');
const req=createRequire(path.join(root,'packages/ui/package.json')); const ts=req('typescript');
const base=path.join(out,'proposed-files'); const overlays=new Map();
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.tsx?$/.test(p))overlays.set(path.join(root,path.relative(base,p)),fs.readFileSync(p,'utf8'));}}
walk(base);
const options={target:ts.ScriptTarget.ES2022,lib:['lib.es2022.d.ts','lib.dom.d.ts','lib.dom.iterable.d.ts'],module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,jsx:ts.JsxEmit.ReactJSX,strict:true,skipLibCheck:true,esModuleInterop:true,resolveJsonModule:true,noEmit:true,types:[]};
const host=ts.createCompilerHost(options); const read=host.readFile,exists=host.fileExists;
host.readFile=p=>overlays.get(p)??read(p);host.fileExists=p=>overlays.has(p)||exists(p);
const files=[...overlays.keys(),path.join(root,'packages/ui/src/css-modules.d.ts')];
const program=ts.createProgram(files,options,host);
const diagnostics=ts.getPreEmitDiagnostics(program).map(d=>({code:d.code,path:d.file?path.relative(root,d.file.fileName):null,line:d.file&&d.start!==undefined?d.file.getLineAndCharacterOfPosition(d.start).line+1:null,message:ts.flattenDiagnosticMessageText(d.messageText,'\n')}));
const hashes=Object.fromEntries(program.getSourceFiles().filter(f=>!f.fileName.includes('/node_modules/')).map(f=>[path.relative(root,f.fileName),crypto.createHash('sha256').update(f.text).digest('hex')]));
const result={runtime:process.version,typescript:ts.version,scope:'Virtual overlay of proposed files at their intended paths, current source dependencies and existing built public declarations; no shared patch application/build',diagnostics,inputHashes:hashes};
fs.writeFileSync(path.join(out,'typecheck-proposals.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({diagnostics},null,2));process.exitCode=diagnostics.length?1:0;
