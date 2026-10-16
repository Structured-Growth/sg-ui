import ts from '../../../../packages/ui/node_modules/typescript/lib/typescript.js';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const own=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(own,'../../../..');
const names=[
 'apps/docs/native-fixtures/scenarios/components/AppModal/AppModal.fixture.tsx',
 'packages/ui/tests/browser/wave03-overlay-successors.spec.ts',
 'apps/docs/tests/scrollbar-layout.spec.ts',
];
const replacement=new Map(names.map(name=>[path.join(root,name),fs.readFileSync(path.join(own,'proposed-files',name),'utf8')]));
const options={target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,
 jsx:ts.JsxEmit.ReactJSX,lib:['lib.es2022.d.ts','lib.dom.d.ts','lib.dom.iterable.d.ts'],typeRoots:[path.join(root,'packages/ui/node_modules/@types')],types:['node'],strict:true,skipLibCheck:true,esModuleInterop:true,noEmit:true};
const host=ts.createCompilerHost(options);
const oldRead=host.readFile.bind(host),oldExists=host.fileExists.bind(host);
host.readFile=name=>replacement.get(path.resolve(name))??oldRead(name);
host.fileExists=name=>replacement.has(path.resolve(name))||oldExists(name);
const program=ts.createProgram([...replacement.keys()],options,host);
const diagnostics=ts.getPreEmitDiagnostics(program);
console.log(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCurrentDirectory:()=>root,getCanonicalFileName:x=>x,getNewLine:()=> '\n'}));
console.log(JSON.stringify({runtime:process.version,kind:'in-memory candidate public-type check; no build/native result',files:names,diagnostics:diagnostics.length},null,2));
process.exitCode=diagnostics.length?1:0;
