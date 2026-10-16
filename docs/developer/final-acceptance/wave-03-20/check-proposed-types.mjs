import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const ts = createRequire(path.join(root, 'packages/ui/package.json'))('typescript');
const proposed = fileURLToPath(new URL('./proposed-files/', import.meta.url));
const overlay = new Map();
function walk(dir) { for (const name of readdirSync(dir, { withFileTypes: true })) { const p=path.join(dir,name.name); if(name.isDirectory())walk(p);else if(/\.tsx?$/.test(p))overlay.set(path.join(root,path.relative(proposed,p)),readFileSync(p,'utf8')); } }
walk(proposed);
let errors = 0;
for (const [config, roots] of [
  ['apps/docs/native-fixtures/tsconfig.json', [...overlay.keys()].filter(p=>p.includes('/apps/'))],
  ['packages/ui/tests/browser/tsconfig.json', [...overlay.keys()].filter(p=>p.includes('/packages/'))],
]) {
  const configPath = path.join(root,config);
  const raw=ts.readConfigFile(configPath,ts.sys.readFile);
  const parsed=ts.parseJsonConfigFileContent(raw.config,ts.sys,path.dirname(configPath));
  const options={...parsed.options,configFilePath:configPath,incremental:false,noEmit:true};
  const host=ts.createCompilerHost(options);
  host.getCurrentDirectory=()=>path.join(root, config.startsWith('packages/')?'packages/ui':'apps/docs');
  const read=host.readFile.bind(host),exists=host.fileExists.bind(host);
  host.readFile=p=>overlay.get(path.resolve(p))??read(p);
  host.fileExists=p=>overlay.has(path.resolve(p))||exists(p);
  host.getSourceFile=(p,version)=>{const s=host.readFile(p);return s===undefined?undefined:ts.createSourceFile(p,s,version,true);};
  const program=ts.createProgram(roots,options,host);
  const diagnostics=ts.getPreEmitDiagnostics(program);
  errors+=diagnostics.length;
  console.log(`${config}: ${roots.length} proposed roots; ${diagnostics.length} diagnostics`);
  console.log(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:p=>p,getCurrentDirectory:()=>root,getNewLine:()=> '\n'}));
}
console.log(`Runtime ${process.version}; overlay only, no source writes or build`);
process.exitCode=errors?1:0;
