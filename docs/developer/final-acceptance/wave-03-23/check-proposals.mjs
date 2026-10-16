// Read-only TypeScript overlay: resolve as final destination without copying or
// modifying any shared file. This is static validation, never native execution.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const root=process.cwd();
const require=createRequire(path.join(root,'packages/ui/package.json'));
const ts=require('typescript');
const dir=path.join(root,'docs/developer/final-acceptance/wave-03-23');
const mirror=path.join(dir,'proposed-files');
const overrides=new Map();
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else if(/\.tsx?$/.test(p))overrides.set(path.join(root,path.relative(mirror,p)),fs.readFileSync(p,'utf8'));
}}
walk(mirror);
let failed=false;
for(const [name,configPath,prefix] of [
 ['native-fixture','apps/docs/native-fixtures/tsconfig.json','apps/docs/'],
 ['browser-spec','packages/ui/tests/browser/tsconfig.json','packages/ui/'],
]){
 const config=ts.readConfigFile(path.join(root,configPath),ts.sys.readFile);
 const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,path.dirname(path.join(root,configPath)));
 const host=ts.createCompilerHost({...parsed.options,noEmit:true,incremental:false});
 host.getCurrentDirectory=()=>path.join(root,prefix);
 const originalRead=host.readFile.bind(host),originalExists=host.fileExists.bind(host);
 host.readFile=p=>overrides.get(path.resolve(p))??originalRead(p);
 host.fileExists=p=>overrides.has(path.resolve(p))||originalExists(p);
 const files=[...overrides.keys()].filter(p=>path.relative(root,p).startsWith(prefix));
 const program=ts.createProgram(files,{...parsed.options,noEmit:true,incremental:false},host);
 const diagnostics=ts.getPreEmitDiagnostics(program);
 const own=diagnostics.filter(d=>d.file&&overrides.has(path.resolve(d.file.fileName)));
 const other=diagnostics.filter(d=>!d.file||!overrides.has(path.resolve(d.file.fileName)));
 console.log(JSON.stringify({check:name,runtime:process.version,typescript:ts.version,files:files.map(p=>path.relative(root,p)),proposalDiagnostics:own.length,dependencyDiagnostics:other.length}));
 for(const d of diagnostics)console.log(ts.flattenDiagnosticMessageText(d.messageText,'\n')+' at '+(d.file?path.relative(root,d.file.fileName)+':'+d.file.getLineAndCharacterOfPosition(d.start??0).line:'config'));
 if(diagnostics.length)failed=true;
}
process.exitCode=failed?1:0;
