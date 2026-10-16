// Read-only typecheck: proposed files replace logical source paths in memory.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '../../../..');
const req = createRequire(path.join(root, 'packages/ui/package.json'));
const ts = req('typescript');
const base = path.join(__dirname, 'proposed-files');
const groups = [
 ['apps/docs/native-fixtures/tsconfig.json', [
  'apps/docs/native-fixtures/scenarios/experimental/Select/Select.fixture.tsx',
  'apps/docs/native-fixtures/scenarios/experimental/ComboBox/ComboBox.fixture.tsx',
  'apps/docs/native-fixtures/scenarios/experimental/Menu/Menu.fixture.tsx',
 ]],
 ['packages/ui/tsconfig.json', ['packages/ui/tests/browser/wave03-selector-contracts.spec.ts']],
];
let count=0;
for (const [config, names] of groups) {
 const configPath=path.join(root,config);
 const loaded=ts.readConfigFile(configPath,ts.sys.readFile);
 const parsed=ts.parseJsonConfigFileContent(loaded.config,ts.sys,path.dirname(configPath));
 const options={...parsed.options,noEmit:true,incremental:false,rootDir:root};
 const host=ts.createCompilerHost(options);
 host.getCurrentDirectory=()=>path.dirname(configPath);
 const originalRead=host.readFile;
 const overrides=new Map(names.map(name=>[path.join(root,name),fs.readFileSync(path.join(base,name),'utf8')]));
 host.readFile=name=>overrides.get(name)??originalRead(name);
 const program=ts.createProgram([...overrides.keys()],options,host);
 const diagnostics=ts.getPreEmitDiagnostics(program);
 count+=diagnostics.length;
 if(diagnostics.length) process.stdout.write(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCurrentDirectory:()=>root,getCanonicalFileName:n=>n,getNewLine:()=> '\n'}));
 console.log(`${config}: ${names.length} proposed files; ${diagnostics.length} diagnostics`);
}
console.log(`Runtime ${process.version}; TypeScript ${ts.version}; static compiler evidence only`);
process.exitCode=count?1:0;
