import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const root=process.cwd();
const dir=path.join(root,'docs/developer/final-acceptance/wave-03-30');
const require=createRequire(path.join(root,'apps/docs/package.json'));
const ts=require('typescript');
const virtual=new Map();
function collect(where) {for(const entry of fs.readdirSync(where,{withFileTypes:true})) {
  const file=path.join(where,entry.name);
  if(entry.isDirectory())collect(file);
  else if(/\.tsx?$/.test(file))virtual.set(path.join(root,path.relative(path.join(dir,'proposed-files'),file)),fs.readFileSync(file,'utf8'));
}}
collect(path.join(dir,'proposed-files'));
const foundation=virtual.get(path.join(root,'apps/docs/components/FoundationExamples.tsx'));
const sf=ts.createSourceFile('FoundationExamples.tsx',foundation,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let count=0;
for(const node of sf.statements)if(ts.isVariableStatement(node))for(const dec of node.declarationList.declarations) {
  if(/Source$/.test(dec.name.getText(sf)) && dec.initializer && ts.isNoSubstitutionTemplateLiteral(dec.initializer)) {
    virtual.set(path.join(root,`apps/docs/components/__wave30_snippet${++count}.tsx`),dec.initializer.text);
  }
}
assert.equal(count,3,'all three copyable snippets must be extracted as literal code');
const options={target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,
  jsx:ts.JsxEmit.ReactJSX,strict:true,skipLibCheck:true,noEmit:true,esModuleInterop:true,resolveJsonModule:true,
  allowArbitraryExtensions:true,types:['node'],typeRoots:[path.dirname(path.dirname(require.resolve('@types/node/package.json')))]};
const host=ts.createCompilerHost(options);
const read=host.readFile.bind(host), exists=host.fileExists.bind(host), get=host.getSourceFile.bind(host);
host.readFile=file=>virtual.get(file)??read(file);
host.fileExists=file=>virtual.has(file)||exists(file);
host.getSourceFile=(file,version,onError,create)=>virtual.has(file)?ts.createSourceFile(file,virtual.get(file),version,true):get(file,version,onError,create);
// The local CSS-module declaration is read as input. No tsbuildinfo or JS is emitted.
const program=ts.createProgram([...virtual.keys(),path.join(root,'apps/docs/native-fixtures/env.d.ts')],options,host);
const diagnostics=ts.getPreEmitDiagnostics(program);
const format=ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:x=>x,getCurrentDirectory:()=>root,getNewLine:()=> '\n'});
if(diagnostics.length){process.stderr.write(format);process.exitCode=1;}
console.log(JSON.stringify({runtime:process.version,virtualFiles:virtual.size,snippets:count,diagnostics:diagnostics.length,
  kind:'in-memory authoring typecheck against currently available declarations; no build/native/browser acceptance'},null,2));
