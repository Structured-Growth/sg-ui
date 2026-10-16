const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),Module=require('node:module');
const root=cp.execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
process.chdir(root);
const out=path.join(root,'docs/developer/final-acceptance/wave-02-02');
const ts=require(path.join(root,'packages/ui/node_modules/typescript'));
const inventoryPath='docs/developer/final-acceptance/2026-10-16-source-inventory.json';
const inventory=JSON.parse(fs.readFileSync(inventoryPath));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const sourceRoots=['AppDataGrid/AppDataGrid.tsx','AppDataGridShell/AppDataGridShell.tsx','AppDataGridRowDnd/DataGridDragHandle.tsx','AppDataGridRowDnd/useDataGridRowDnd.ts','LearnerClassesDataGrid/LearnerClassesDataGrid.tsx','DataToolbar/DataToolbar.tsx'].map(f=>'packages/ui/src/components/'+f);
const closure=new Set(), unresolved=[];
const options={module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,jsx:ts.JsxEmit.ReactJSX,resolveJsonModule:true};
function walk(f){if(closure.has(f))return;closure.add(f);for(const e of inventory.imports.filter(e=>e.file===f&&e.specifier.startsWith('.'))){let target=ts.resolveModuleName(e.specifier,path.resolve(f),options,ts.sys).resolvedModule?.resolvedFileName;
 if(!target){const p=path.resolve(path.dirname(f),e.specifier);if(fs.existsSync(p)&&fs.statSync(p).isFile())target=p;}
 if(target){const r=path.relative(root,target);if(r.startsWith('packages/ui/src/'))walk(r);}else unresolved.push(e);}}
sourceRoots.forEach(walk);
const listed=cp.execFileSync('git',['ls-files','-z','--cached','--others','--exclude-standard'],{encoding:'utf8'}).split('\0');
const selected=listed.filter(f=>/^packages\/ui\/src\/components\/(AppDataGrid|AppDataGridShell|AppDataGridRowDnd|LearnerClassesDataGrid|DataToolbar)\//.test(f)||/^packages\/ui\/tests\/browser\/.*(?:grid|reorder|toolbar-composition|toolbar-container)/.test(f)||/^apps\/docs\/native-fixtures\/scenarios\/components\/(AppDataGrid|AppDataGridShell|AppDataGridRowDnd|LearnerClassesDataGrid|DataToolbar)\//.test(f));
const references=['apps/docs/examples/GridHostExamples.tsx','packages/ui/src/foundation/tokens.json','packages/ui/src/foundation/tokens.css','packages/ui/src/foundation/tokens.generated.ts','packages/ui/package.json','packages/ui/vitest.config.ts','pnpm-lock.yaml','docs/developer/react-aria-grid-contracts.md','docs/developer/react-aria-catalog-grid.md','docs/developer/react-aria-grid-reorder.md','docs/developer/react-aria-data-toolbar.md','docs/developer/react-aria-hardening-tasks.md','docs/developer/react-aria-hardening-execution.md','docs/developer/backlog-execution-2026-10-15.md','docs/developer/react-aria-baseline-tasks.md','docs/developer/react-aria-regression-tasks.md','docs/developer/parallel-next100/next100-c16.md','docs/developer/parallel-next100/next100-c17.md','docs/developer/parallel-next100/next100-c18.md','docs/developer/parallel-next100/next100-c19.md','docs/developer/parallel-next100/next100-c20.md'];
const inputs=[...new Set([...closure,...selected,...references])].sort().filter(f=>fs.existsSync(f)&&fs.statSync(f).isFile()).map(file=>({file,sha256:hash(file),matchesFA02:inventory.inputHashes[file]===hash(file),inDependencyClosure:closure.has(file)}));
// New characterization only: load pure TS helpers in memory; no shared transpile output.
const cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const m=new Module(file);cache.set(file,m);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));const native=m.require.bind(m);m.require=s=>{if(s.startsWith('.')){const base=path.resolve(path.dirname(file),s);for(const candidate of [base,base+'.ts',base+'.tsx'])if(fs.existsSync(candidate)&&fs.statSync(candidate).isFile()&&/\.tsx?$/.test(candidate))return load(candidate);}return native(s);};m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,file);return m.exports;}
const columnsPath='packages/ui/src/components/AppDataGrid/ownedGridColumns.ts';
const columns=load(columnsPath);
const model=load('packages/ui/src/components/AppDataGrid/ownedGridModel.ts');
const results=[];
for(const field of ['__selection','__drag','__reorder']){
 let built,processed,buildError,processingError;
 try{built=columns.createOwnedGridColumns([{field}]).map(c=>c.field);}catch(e){buildError=e.message;}
 try{processed=model.processOwnedGridRows({rows:[{id:'a',[field]:'Course A'}],columns:[{field}],paginationModel:{page:0,pageSize:25}}).rowIds;}catch(e){processingError=e.message;}
 results.push({field,built,processed,buildError,processingError});
}
const evidence={capturedAt:new Date().toISOString(),head:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),branch:cp.execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim(),node:process.version,inventory:{file:inventoryPath,capturedAt:inventory.capturedAt,sha256:hash(inventoryPath)},sourceRoots,dependencyClosureCount:closure.size,unresolved,inputs,changedDependencyInputs:inputs.filter(x=>x.inDependencyClosure&&!x.matchesFA02),newCharacterization:{scope:'Pure source helper execution via in-memory TypeScript transpilation, not rendering or native/browser evidence.',results,rendererUtilityId:'__reorder',rendererReference:'packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx:386',finding:'Both public-column validation and row-processing validation accept __reorder, although the renderer uses it for its utility column when rowDrag is supplied. Existing reserved-ID tests do not include that name.'},retainedEvidence:['docs/developer/final-acceptance/fa04-original-check.txt','docs/developer/final-acceptance/fa04-calendar-rerun.txt','docs/developer/final-acceptance/fa04-package.txt','docs/developer/backlog-execution-2026-10-15.md:720-765'],missingRawNativeArtifact:'packages/ui/artifacts/hb17-fixed-2026-10-16 does not exist locally; canonical accepted receipt remains available. Root artifacts/browser-results.json targets retired pre-workspace paths and is not attributed to HB17/current docs host.'};
fs.writeFileSync(path.join(out,'input-evidence.json'),JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({head:evidence.head,node:evidence.node,dependencyInputs:closure.size,changedDependencyInputs:evidence.changedDependencyInputs.length,inputs:inputs.length,unresolved:unresolved.length,newCharacterization:results},null,2));
