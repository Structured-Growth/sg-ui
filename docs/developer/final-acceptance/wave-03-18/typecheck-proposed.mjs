import ts from '../../../../packages/ui/node_modules/typescript/lib/typescript.js';
import fs from 'node:fs';
import path from 'node:path';
const owner=path.dirname(new URL(import.meta.url).pathname),root=path.resolve(owner,'../../../..'),base=path.join(owner,'proposed-files');
const mirror=new Map();
function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,item.name);if(item.isDirectory())walk(p);else mirror.set(path.join(root,path.relative(base,p)),fs.readFileSync(p,'utf8'));}}
walk(base);
const config=ts.readConfigFile(path.join(root,'packages/ui/tsconfig.json'),ts.sys.readFile);
const options=ts.parseJsonConfigFileContent(config.config,ts.sys,path.join(root,'packages/ui')).options;
options.noEmit=true; options.typeRoots=[path.join(root,'packages/ui/node_modules/@types')];
const host=ts.createCompilerHost(options);const read=host.readFile.bind(host),exists=host.fileExists.bind(host),directory=host.directoryExists.bind(host);
host.readFile=p=>mirror.get(p)??read(p);host.fileExists=p=>mirror.has(p)||exists(p);host.directoryExists=p=>[...mirror.keys()].some(f=>f.startsWith(p+path.sep))||directory(p);
host.getSourceFile=(p,lang)=>{const text=host.readFile(p);return text===undefined?undefined:ts.createSourceFile(p,text,lang,true);};
const selected=[...mirror.keys()].filter(p=>/\.(ts|tsx)$/.test(p)&&!p.endsWith('/catalog/forms-dates.tsx'));
const program=ts.createProgram([...selected,path.join(root,'packages/ui/src/css-modules.d.ts')],options,host);
const diagnostics=ts.getPreEmitDiagnostics(program);
if(diagnostics.length){console.log(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:p=>p,getCurrentDirectory:()=>root,getNewLine:()=> '\n'}));process.exitCode=1;}
else console.log(`${selected.length} proposed roots passed TypeScript checking with virtual proposed source, existing public declarations and normal imports. No output emitted; no docs build/snippet compiler or native execution implied.`);
