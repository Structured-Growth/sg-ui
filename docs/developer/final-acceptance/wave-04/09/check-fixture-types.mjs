// Typecheck proposed fixture at its intended virtual path without writing shared files.
import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(here,'../../../../..'),ui=root+'/packages/ui';
const require=createRequire(ui+'/package.json'),ts=require('typescript');
const virtual=ui+'/tests/performance/fixture.tsx';
const text=await readFile(here+'/proposed-files/packages/ui/tests/performance/fixture.tsx','utf8');
const options={noEmit:true,strict:true,skipLibCheck:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,types:[],baseUrl:ui,paths:{'@structured-growth/sg-ui/experimental':['dist/experimental/index.d.ts']}};
const host=ts.createCompilerHost(options),original=host.getSourceFile;
host.getSourceFile=(file,language,...rest)=>file===virtual?ts.createSourceFile(file,text,language,true):original(file,language,...rest);
const program=ts.createProgram([virtual],options,host);
const diagnostics=ts.getPreEmitDiagnostics(program);
const output=ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:f=>f,getCurrentDirectory:()=>ui,getNewLine:()=> '\n'});
await writeFile(here+'/fixture-typecheck.txt',output||`PASS TypeScript ${ts.version}; virtual proposed fixture; current built public declarations; noEmit. Runtime ${process.version}.\n`);
console.log(output||'PASS proposed fixture types');process.exitCode=diagnostics.length?1:0;
