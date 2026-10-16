// Pure compiler API: virtual consumer files, no emitted files and no builds.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {createRequire} = require('node:module');
const root = process.cwd();
const out = path.join(root, 'docs/developer/final-acceptance/wave-03-34');
const ts = createRequire(path.join(root, 'apps/docs/package.json'))('typescript');
const guide = fs.readFileSync(path.join(out, 'proposed-files/docs/migration.md'), 'utf8');
const snippet = guide.match(/```tsx\n([\s\S]*?)```/)[1];
const contracts = `import type { ButtonProps } from '@structured-growth/sg-ui/components/Button';
import type { AppGridRowSelectionModel, AppGridPaginationModel, AppDataGridSelectionConfig } from '@structured-growth/sg-ui/components/AppDataGrid';
const selection: AppGridRowSelectionModel = new Set(['course-1']);
const pagination: AppGridPaginationModel = {page: 0, pageSize: 10};
const config: AppDataGridSelectionConfig<{id:string}> = {selectedRowIds: selection, onSelectedRowIdsChange: next => { const ids: Set<string> = next; }};
// @ts-expect-error Retired style engine props are not an owned Button contract.
const retired: ButtonProps = {sx: {color: 'red'}};
// @ts-expect-error Upstream event objects are not part of onPress.
const eventCallback: ButtonProps = {onPress: (event: MouseEvent) => {}};
// @ts-expect-error Engine include/exclude selection objects are not SGUI ID sets.
const engineSelection: AppGridRowSelectionModel = {type: 'include', ids: new Set(['course-1'])};
export {selection,pagination,config,retired,eventCallback,engineSelection};`;
fs.writeFileSync(path.join(out,'migration-example.tsx'),snippet);
fs.writeFileSync(path.join(out,'migration-contracts.tsx'),contracts);
const files = new Map([
 [path.join(root,'apps/docs/.wave-03-34-example.tsx'),snippet],
 [path.join(root,'apps/docs/.wave-03-34-contracts.tsx'),contracts]
]);
const options = {strict:true,noEmit:true,skipLibCheck:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true};
const host = ts.createCompilerHost(options), get = host.getSourceFile.bind(host);
host.getSourceFile=(file,language,onError,fresh)=>files.has(file)?ts.createSourceFile(file,files.get(file),ts.ScriptTarget.Latest,true):get(file,language,onError,fresh);
const program = ts.createProgram([...files.keys()], options, host);
const diagnostics = ts.getPreEmitDiagnostics(program).map(d=>ts.flattenDiagnosticMessageText(d.messageText,'\n'));
const inputHashes={};
for(const file of program.getSourceFiles().map(f=>f.fileName)) {
 if(file.includes('/node_modules/') || !fs.existsSync(file)) continue;
 inputHashes[path.relative(root,file)]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
const result={runtime:process.version,typescript:ts.version,mode:'pure compiler API against existing built public declarations; virtual consumer resolution from apps/docs',diagnostics,inputHashes,assertions:['migration guide snippet compiles','grid Set/string ID and zero-based pagination public types compile','removed sx prop, event callback and engine selection object rejected via consumed @ts-expect-error directives'],limits:['No fresh build or runtime behavior validation','Does not compile every displayed dynamic catalog source; coordinator catalog browser gate remains required']};
fs.writeFileSync(path.join(out,'types-result.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({runtime:result.runtime,typescript:result.typescript,diagnostics,hashedInputs:Object.keys(inputHashes).length}));
process.exitCode=diagnostics.length?1:0;
