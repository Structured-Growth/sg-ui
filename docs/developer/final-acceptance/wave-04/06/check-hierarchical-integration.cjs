const {createRequire}=require('node:module');
const {resolve,relative,dirname}=require('node:path');
const fs=require('node:fs');
const root=resolve(__dirname,'../../../../..');
const req=createRequire(resolve(root,'packages/ui/package.json'));const ts=req('typescript');
const proposed=resolve(__dirname,'proposed-files');
const ui=resolve(root,'packages/ui');
const config=ts.readConfigFile(resolve(ui,'tsconfig.json'),ts.sys.readFile);
const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,ui);
const options={...parsed.options,noEmit:true,types:['node'],typeRoots:[resolve(ui,'node_modules/@types')],baseUrl:root,paths:{
 '@structured-growth/sg-ui/experimental':['packages/ui/src/experimental/index.ts'],
 '@structured-growth/sg-ui/theme':['packages/ui/src/theme/index.ts'],
 '@structured-growth/sg-ui/primitives':['packages/ui/src/primitives/index.ts'],
 '@structured-growth/sg-ui/components/Button':['packages/ui/src/components/Button/index.ts'],
}};
const host=ts.createCompilerHost(options);const exists=host.fileExists,read=host.readFile;
const candidate=p=>resolve(proposed,relative(root,p));
host.fileExists=p=>fs.existsSync(candidate(p))||exists(p);
host.readFile=p=>fs.existsSync(candidate(p))?fs.readFileSync(candidate(p),'utf8'):read(p);
host.getSourceFile=(p,lang)=>{const s=host.readFile(p);return s===undefined?undefined:ts.createSourceFile(p,s,lang,true)};
const roots=['packages/ui/src/css-modules.d.ts','packages/ui/src/experimental/HierarchicalMenu/HierarchicalMenu.tsx','packages/ui/src/experimental/HierarchicalMenu/HierarchicalMenu.test.tsx','apps/docs/native-fixtures/scenarios/experimental/HierarchicalMenu/HierarchicalMenu.fixture.tsx','packages/ui/tests/browser/hierarchical-menu.spec.ts','apps/docs/examples/HierarchicalMenuExamples.tsx'].map(p=>resolve(root,p));
const errors=ts.getPreEmitDiagnostics(ts.createProgram(roots,options,host));
const rendered=ts.formatDiagnosticsWithColorAndContext(errors,{getCurrentDirectory:()=>root,getCanonicalFileName:x=>x,getNewLine:()=> '\n'});
fs.writeFileSync(resolve(__dirname,'hierarchical-integration-types.txt'),rendered||'Zero diagnostics: virtual proposed shared exports plus actual component,3 units,3 native cases,public fixture and independent docs examples. No emit/runtime execution.\n');
console.log(rendered||'Zero integration TypeScript diagnostics');process.exitCode=errors.length?1:0;
