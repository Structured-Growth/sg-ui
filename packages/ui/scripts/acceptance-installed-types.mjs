// Read an existing isolated consumer. No install, build, pack, browser or fixture write.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {readFile, readdir, mkdir, writeFile, realpath} from 'node:fs/promises';
import {resolve, join, relative, dirname, basename, isAbsolute, sep} from 'node:path';
const argv=process.argv.slice(2);
const option=key=>{const i=argv.indexOf(key);return i<0?undefined:argv[i+1]};
assert(option('--fixture') && option('--output'), 'Required --fixture existing-installed-consumer --output new-evidence-directory; optional --compilers comma-separated-typescript-package-directories');
const [major,minor]=process.versions.node.split('.').map(Number);
assert((major===22&&minor>=12)||major===24, 'Use supported Node22.12+/24');
const fixture=await realpath(resolve(option('--fixture'))), output=resolve(option('--output'));
assert(output!==fixture && !output.startsWith(fixture+'/'), 'Keep receipts outside immutable fixture');
const req=createRequire(join(fixture,'package.json'));
const nodeModulesRoot=await realpath(join(fixture,'node_modules'));
const packageRoot=await realpath(dirname(req.resolve('@structured-growth/sg-ui/package.json')));
const installedLocation=relative(nodeModulesRoot,packageRoot);
assert(installedLocation && installedLocation!=='..' && !installedLocation.startsWith('..'+sep) && !isAbsolute(installedLocation),
  'Use independently installed package within this fixture node_modules; workspace fallback is not allowed');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const input=join(fixture,'package-consumer.tsx'), code=await readFile(input,'utf8');
const supplemental=option('--additional')?.split(',') || [join(dirname(fileURLToPath(import.meta.url)),'public-contract-consumer.tsx')];
const inputs=new Map([[input,code]]);
for(const path of supplemental){const virtual=join(fixture,basename(path));assert(!inputs.has(virtual),'Supplemental basename collides');inputs.set(virtual,await readFile(resolve(path),'utf8'));}
assert(!/from\s*['"](?:\.\.|\/).*packages\/ui\/src/.test(code), 'No source import fallback');
await mkdir(output); // New directory required: never overwrite a previous run.
const manifest={node:process.version,fixture,nodeModulesRoot,packageRoot,fixtureSha256:hash(code),additionalSources:Object.fromEntries([...inputs].filter(([p])=>p!==input).map(([p,t])=>[p,{sha256:hash(t),text:t}])),versions:{},declarations:{},runs:[],limits:['Only explicit compiler versions and this installed React/type set are covered.','Type checks do not establish SSR, CSS retention, hydration or spoken AT behavior.','No release decision or broader TypeScript support range inferred.']};
for(const name of ['react','react-dom','@types/react','@types/react-dom']) manifest.versions[name]=JSON.parse(await readFile(req.resolve(name+'/package.json'),'utf8')).version;
async function visit(dir){for(const ent of await readdir(dir,{withFileTypes:true})){const path=join(dir,ent.name);if(ent.isDirectory())await visit(path);else if(ent.name.endsWith('.d.ts')){const bytes=await readFile(path), text=bytes.toString();manifest.declarations[relative(packageRoot,path)]={sha256:hash(bytes),forbidden:/react-aria|react-stately|@react-types|@react-stately|@mui|@emotion|lucide-react|@tanstack|@internationalized\/date/.test(text)};}}}
await visit(join(packageRoot,'dist'));
const save=()=>writeFile(join(output,'installed-types.json'),JSON.stringify(manifest,null,2)+'\n');
await save();
const compilers=option('--compilers')?.split(',').map(p=>resolve(p)) || [dirname(req.resolve('typescript/package.json'))];
for(const compiler of compilers){
 const ts=createRequire(join(compiler,'package.json'))(join(compiler,'lib/typescript.js'));
 const compilerJson=JSON.parse(await readFile(join(compiler,'package.json'),'utf8'));
 const directives=[...inputs].flatMap(([file,text])=>{const source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);return [...text.matchAll(/^[\t ]*\/\/\s*@ts-expect-error[^\n]*/gm)].map(m=>{
  const statement=source.statements.find(s=>s.end>m.index+m[0].length);
  assert(statement, 'Negative directive needs a following top-level statement');
  return {file,line:source.getLineAndCharacterOfPosition(m.index).line+1,start:m.index,end:statement.end,expectation:m[0].trim()};
 });});
 assert(directives.length>0,'Consumer must retain negative assertions');
 // Mask comments in memory, preserving offsets, newlines and immutable fixture bytes.
 const mutant=new Map([...inputs].map(([file,text])=>[file,text.replace(/^[\t ]*\/\/\s*@ts-expect-error[^\n]*/gm,m=>' '.repeat(m.length))]));
 for(const skipLibCheck of [true,false]){
  const options={noEmit:true,strict:true,skipLibCheck,jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,target:ts.ScriptTarget.ES2022,esModuleInterop:true};
  function compile(texts){const host=ts.createCompilerHost(options);const original=host.readFile.bind(host),exists=host.fileExists.bind(host);host.fileExists=p=>texts.has(resolve(p))||exists(p);host.readFile=p=>texts.get(resolve(p))??original(p);const p=ts.createProgram([...texts.keys()],options,host);return ts.getPreEmitDiagnostics(p).map(d=>({code:d.code,file:d.file?.fileName,start:d.start,line:d.file&&d.start!==undefined?d.file.getLineAndCharacterOfPosition(d.start).line+1:null,message:ts.flattenDiagnosticMessageText(d.messageText,'\n')}));}
  const diagnostics=compile(inputs), negativeDiagnostics=compile(mutant);
  const negativeControls=directives.map(d=>({...d,detected:negativeDiagnostics.some(n=>n.file===d.file&&n.start>=d.start&&n.start<d.end)}));
  manifest.runs.push({compiler:compilerJson.version,compilerEntrySha256:hash(await readFile(join(compiler,'lib/typescript.js'))),skipLibCheck,diagnostics,negativeDiagnostics,negativeControls,passed:diagnostics.length===0&&negativeControls.every(d=>d.detected)});
  await save();
 }
}
manifest.passed=Object.values(manifest.declarations).every(d=>!d.forbidden)&&manifest.runs.every(r=>r.passed);
assert.equal(hash(await readFile(input)),manifest.fixtureSha256,'Fixture bytes changed during proof');
await save();
console.log(JSON.stringify({passed:manifest.passed,compilers:manifest.runs.map(r=>({version:r.compiler,skipLibCheck:r.skipLibCheck,passed:r.passed})),receipt:join(output,'installed-types.json')}));
process.exitCode=manifest.passed?0:1;
