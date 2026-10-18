// Resolve old public primitive props exclusively from integrity-bound declaration data.
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const here=dirname(fileURLToPath(import.meta.url)),repo=resolve(here,'../../../../..');
const ts=createRequire(join(repo,'packages/ui/package.json'))('typescript');
const hash=s=>createHash('sha256').update(s).digest('hex'),virtual='/__sgui_locked_types__',files=new Map(),dirs=new Set(),artifacts={};
function add(path,text){files.set(path,text);for(let dir=dirname(path);dir!=='/';dir=dirname(dir))dirs.add(dir);}
for(const dir of ['historical-primary-types','historical-transitive-types','historical-support-types','historical-react-types','historical-theming-types','historical-module-types','historical-selector-types'])for(const name of await readdir(join(here,dir))){if(!name.endsWith('-declarations.json'))continue;const path=join(here,dir,name),bytes=await readFile(path),pkg=JSON.parse(bytes);artifacts[path.slice(here.length+1)]={sha256:hash(bytes),name:pkg.name,version:pkg.version};const root=join(virtual,'node_modules',pkg.name);add(join(root,'package.json'),JSON.stringify(pkg.packageJson));for(const [file,data]of Object.entries(pkg.declarations))add(join(root,file),data.text);}
const snapshot=JSON.parse(await readFile(join(repo,'docs/developer/final-acceptance/parallel-01/api-snapshot.json'),'utf8'));
const historicalNodes={};
function exportedTypes(path,names){const text=execFileSync('git',['show','21adebd61bedfc6a1ed395fe664ff4be83896821:'+path],{cwd:repo,encoding:'utf8'});const parsed=ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);const nodes=parsed.statements.filter(n=>(ts.isTypeAliasDeclaration(n)||ts.isInterfaceDeclaration(n))&&names.includes(n.name.text));if(nodes.length!==names.length)throw Error('Missing historical type in '+path);historicalNodes[path]={sourceSha256:hash(text),nodes:nodes.map(n=>n.getText(parsed))};return nodes.map(n=>n.getText(parsed)).join('\n');}
const gridProps=exportedTypes('src/components/AppDataGrid/AppDataGrid.tsx',['AppDataGridProps']);
const modalProps=exportedTypes('src/components/AppModal/AppModal.tsx',['AppModalStep','AppModalAction','AppModalProps']);
const buttonProps=exportedTypes('src/components/AppButton/AppButton.tsx',['AppButtonProps']);
const subheaderProps=exportedTypes('src/components/AppDataGrid/components/RowSubHeader.tsx',['RowSubHeaderProps']);
const frameProps=exportedTypes('src/components/ClassCardFrame/ClassCardFrame.tsx',['ClassCardFrameProps']).replace(/^type /,'export type ');
const shellSource=execFileSync('git',['show','21adebd61bedfc6a1ed395fe664ff4be83896821:src/components/AppDataGridShell/AppDataGridShell.tsx'],{cwd:repo,encoding:'utf8'});
const shellAst=ts.createSourceFile('shell.tsx',shellSource,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),shellNode=shellAst.statements.find(n=>ts.isTypeAliasDeclaration(n)&&n.name.text==='AppDataGridShellProps');
if(!shellNode||!ts.isIntersectionTypeNode(shellNode.type))throw Error('Unexpected original shell contract');
const shellOwn=shellNode.type.types.slice(1).map(n=>n.getText(shellAst));
const shellInherited=`export type AppDataGridShellInheritedProps<RowModel extends GridValidRowModel> = ${shellNode.type.types[0].getText(shellAst)};`;
historicalNodes['src/components/AppDataGridShell/AppDataGridShell.tsx']={sourceSha256:hash(shellSource),originalNode:shellNode.getText(shellAst),analyzedInheritedNode:shellInherited,ownAdditions:shellOwn,limits:'Inherited branch analyzed for styling. Full nested toolbar/view semantic graph remains separate.'};

const mode=exportedTypes('src/components/DataToolbar/DataToolbar.tsx',['DataGridInteractionMode']);
add(join(virtual,'src/grid-types.ts'),snapshot.historical['src/components/AppDataGrid/types.ts'].text);
const root=join(virtual,'src/primitives.ts');add(root,snapshot.historical['src/components/primitives/index.ts'].text+`\nimport type { TypographyProps } from '@mui/material/Typography';\nimport type { ButtonProps } from '@mui/material/Button';\nimport type { DialogProps } from '@mui/material/Dialog';\nimport type { SxProps,Theme } from '@mui/material/styles';\nimport type { ReactNode } from 'react';\nimport type { DataGridProps as MuiDataGridProps,GridValidRowModel,GridPaginationModel } from '@mui/x-data-grid';\nimport type { AppDataGridColumn,AppDataGridRowDragConfig,AppDataGridSelectionConfig,AppDataGridSortRule } from './grid-types';\n`+mode+'\n'+gridProps+'\n'+modalProps+'\n'+buttonProps+'\n'+frameProps+'\n'+subheaderProps+'\n'+shellInherited+`\nexport type HistoricalSystemProps = import('@mui/system').SystemProps<Theme>;`);

const augmentation=execFileSync('git',['show','21adebd61bedfc6a1ed395fe664ff4be83896821:src/theme/mui-typography.ts'],{cwd:repo,encoding:'utf8'});add(join(virtual,'src/mui-typography.ts'),augmentation);
const options={noEmit:true,strict:true,skipLibCheck:true,types:[],jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,esModuleInterop:true};
const host=ts.createCompilerHost(options),read=host.readFile.bind(host),exists=host.fileExists.bind(host),libdir=dirname(ts.getDefaultLibFilePath(options));
host.fileExists=p=>files.has(p)||(p.startsWith(libdir+'/')&&exists(p));host.readFile=p=>files.get(p)??(p.startsWith(libdir+'/')?read(p):undefined);host.directoryExists=p=>dirs.has(resolve(p))||resolve(p)===libdir;host.getDirectories=p=>[...dirs].filter(d=>dirname(d)===p);host.realpath=p=>p;
const unresolved=[];host.resolveModuleNames=(names,containing)=>names.map(name=>{const result=ts.resolveModuleName(name,containing,options,host).resolvedModule;if(!result)unresolved.push({name,containing});return result;});
const program=ts.createProgram([root,join(virtual,'src/mui-typography.ts')],options,host),checker=program.getTypeChecker(),source=program.getSourceFile(root),module=checker.getSymbolAtLocation(source),contracts={};
const flags=ts.TypeFormatFlags.NoTruncation|ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,format=t=>checker.typeToString(t,undefined,flags);
for(const sym of checker.getExportsOfModule(module)){
 if(!sym.name.endsWith('Props')&&sym.name!=='SelectChangeEvent'&&!sym.name.startsWith('AppModal'))continue;
 const target=sym.flags&ts.SymbolFlags.Alias?checker.getAliasedSymbol(sym):sym,type=checker.getDeclaredTypeOfSymbol(target),at=target.declarations?.[0]||source;
 const describe=t=>({type:format(t),properties:checker.getPropertiesOfType(t).map(p=>{const d=p.valueDeclaration||p.declarations?.[0]||at,pt=checker.getTypeOfSymbolAtLocation(p,d);return {name:p.name,optional:!!(p.flags&ts.SymbolFlags.Optional),type:format(pt),deprecated:p.getJsDocTags(checker).filter(t=>t.name==='deprecated'),origin:d.getSourceFile().fileName,callbacks:checker.getSignaturesOfType(checker.getNonNullableType(pt),ts.SignatureKind.Call).map(s=>checker.signatureToString(s,undefined,flags))};}).sort((a,b)=>a.name.localeCompare(b.name))});
 contracts[sym.name]={...describe(type),alternatives:type.isUnion()?type.types.map(describe):undefined};
}
const diagnostics=ts.getPreEmitDiagnostics(program).map(d=>({code:d.code,file:d.file?.fileName,message:ts.flattenDiagnosticMessageText(d.messageText,'\n')}));
const receipt={baselineCommit:'21adebd61bedfc6a1ed395fe664ff4be83896821',compiler:ts.version,artifacts,historicalNodes,augmentationSha256:hash(augmentation),contracts,unresolved:[...new Map(unresolved.map(r=>[r.name+'|'+r.containing,r])).values()],diagnostics,limits:['Current compiler reads original lock-integrity-bound declarations in memory. No install, emitted code or upstream execution.','Unresolved external modules and diagnostics remain explicit; no full inheritance closure claim while these exist.','Generic public props retained; runtime defaults and released-version history require separate evidence.']};
await writeFile(join(here,'historical-resolved-props.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({contracts:Object.keys(contracts).length,unresolved:receipt.unresolved,diagnostics:diagnostics.length}));process.exitCode=receipt.unresolved.length||diagnostics.length?1:0;
