import ts from '../../../../packages/ui/node_modules/typescript/lib/typescript.js';
import {readFileSync, readdirSync, writeFileSync, existsSync} from 'node:fs';
import {resolve, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
const evidence=dirname(fileURLToPath(import.meta.url)), root=resolve(evidence,'../../../..'), mirror=resolve(evidence,'proposed-files');
const sources=[];
function walk(path) { for(const entry of readdirSync(path,{withFileTypes:true})) { const item=resolve(path,entry.name); if(entry.isDirectory())walk(item); else if(/\.tsx?$/.test(item))sources.push(item); } }
walk(mirror);
let diagnostics=[];
for(const file of sources) {
 const result=ts.transpileModule(readFileSync(file,'utf8'),{fileName:file,reportDiagnostics:true,compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}});
 diagnostics.push(...(result.diagnostics??[]));
}
console.log(`Syntax/transpile diagnostics: ${diagnostics.length} across ${sources.length} proposed TypeScript files`);
const configPath=resolve(root,'packages/ui/tsconfig.json');
const config=ts.readConfigFile(configPath,ts.sys.readFile);
const options=ts.parseJsonConfigFileContent(config.config,ts.sys,dirname(configPath)).options;
options.typeRoots=[resolve(root,'packages/ui/node_modules/@types')];
options.noEmit=true;options.incremental=false;
const host=ts.createCompilerHost(options), read=host.readFile, exists=host.fileExists;
const overlaid=path=>resolve(mirror,relative(root,path));
host.readFile=path=>existsSync(overlaid(path))?readFileSync(overlaid(path),'utf8'):read(path);
host.fileExists=path=>existsSync(overlaid(path))||exists(path);
const production=sources.filter(file=>/\/src\//.test(file)&&!file.endsWith('.test.tsx')).map(file=>resolve(root,relative(mirror,file)));
const program=ts.createProgram([...production,resolve(root,'packages/ui/src/css-modules.d.ts')],options,host);
diagnostics.push(...ts.getPreEmitDiagnostics(program));
const formatted=ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:path=>path,getCurrentDirectory:()=>root,getNewLine:()=> '\n'});
console.log(formatted || 'Overlay production typecheck passed (proposed files plus current transitive source; no build/emission).');
process.exitCode=diagnostics.length?1:0;
