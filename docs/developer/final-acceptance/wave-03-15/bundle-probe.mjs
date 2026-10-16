import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../../..');
const out=dirname(fileURLToPath(import.meta.url));
const require=createRequire(resolve(root,'packages/ui/package.json'));
const viteRequire=createRequire(require.resolve('vite/package.json'));
const {build,version}=viteRequire('esbuild');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const cases=[
 {name:'granular-add',entry:'icons/AddIcon',symbol:'AddIcon',required:['plus'],absent:['paintbrush','flask-conical','graduation-cap']},
 {name:'basic-button-add',entry:'components/Button',symbol:'Button',extra:true,required:['plus'],absent:['paintbrush','flask-conical','graduation-cap']},
 {name:'toolbar',entry:'components/DataToolbar',symbol:'DataToolbar',required:['search','refresh-cw'],absent:['paintbrush','flask-conical','graduation-cap']},
 {name:'navigation',entry:'components/SideNavigation',symbol:'SideNavigation',required:['log-out','chevron-right'],absent:['paintbrush','flask-conical','graduation-cap']}
];
const prior=JSON.parse(readFileSync(resolve(root,'docs/developer/final-acceptance/parallel-12/evidence.json'),'utf8'));
const integrated=JSON.parse(readFileSync(resolve(root,'docs/developer/final-acceptance/coordinator-integration/evidence.json'),'utf8'));
const receipt={schemaVersion:1,capturedAt:new Date().toISOString(),runtime:process.version,esbuild:version,scope:'Isolated ESM production tree-shaking probe of existing dist, React/ReactDOM external. No pack/install/library rebuild or Vite host executed.',cases:[],inputHashes:{},sourceOutputPairs:[]};
for(const item of cases){
 const text=`import {${item.symbol}} from '@structured-growth/sg-ui/${item.entry}';\n${item.extra?"import {AddIcon} from '@structured-growth/sg-ui/icons/AddIcon';\n":''}import '@structured-growth/sg-ui/styles.css';\nglobalThis.iconAcceptanceProbe=[${item.symbol}${item.extra?',AddIcon':''}];\n`;
 const entry=resolve(out,`${item.name}.entry.mjs`);writeFileSync(entry,text);
 const result=await build({entryPoints:[entry],absWorkingDir:root,outdir:resolve(out,'bundles',item.name),nodePaths:[resolve(root,'apps/docs/node_modules')],bundle:true,write:false,format:'esm',platform:'browser',treeShaking:true,minify:true,metafile:true,external:['react','react/*','react-dom','react-dom/*'],logLevel:'silent'});
 const retained=new Set();let cssBytes=0;const outputs=[];
 for(const [path,output]of Object.entries(result.metafile.outputs)){
  if(path.endsWith('.css'))cssBytes+=output.bytes;
  for(const [input,value]of Object.entries(output.inputs))if(value.bytesInOutput>0){const match=input.match(/lucide-react\/dist\/esm\/icons\/([^/]+)\.(?:js|mjs)$/);if(match)retained.add(match[1]);}
 }
 for(const file of result.outputFiles)outputs.push({path:relative(root,file.path),bytes:file.contents.length,sha256:hash(file.contents)});
 for(const input of Object.keys(result.metafile.inputs)){const path=resolve(root,input);receipt.inputHashes[relative(root,path)]=hash(readFileSync(path));}
 for(const vector of item.required)assert(retained.has(vector),`${item.name} missing ${vector}`);
 for(const vector of item.absent)assert(!retained.has(vector),`${item.name} retained unrelated ${vector}`);
 assert(cssBytes>0,`${item.name} lost explicit stylesheet side effect`);
 writeFileSync(resolve(out,`${item.name}.metafile.json`),JSON.stringify(result.metafile,null,2)+'\n');
 receipt.cases.push({...item,result:'pass',retainedLucideModules:[...retained].sort(),retainedCount:retained.size,cssBytes,outputs});
}
// Bind changed-source risk: emitted source maps retain exact TSX source content.
for(const input of Object.keys(receipt.inputHashes).filter(p=>p.startsWith('packages/ui/dist/')&&p.endsWith('.js'))){
 const mapPath=resolve(root,input+'.map');if(!existsSync(mapPath))continue;
 const map=JSON.parse(readFileSync(mapPath,'utf8'));for(let i=0;i<map.sources.length;i++){
 const source=resolve(dirname(mapPath),map.sources[i]);if(!source.startsWith(resolve(root,'packages/ui/src')+'/')||!existsSync(source))continue;
 const current=hash(readFileSync(source)),embedded=map.sourcesContent?.[i]===undefined?null:hash(map.sourcesContent[i]);
 receipt.sourceOutputPairs.push({source:relative(root,source),output:input,currentSha256:current,embeddedSha256:embedded,equal:embedded===null?null:current===embedded,priorSha256:prior.inputComparisons[relative(root,source)]?.sha256??null});
 }
}
receipt.changedSourcePairs=receipt.sourceOutputPairs.filter(p=>p.equal===false);
receipt.unembeddedSourceMaps=receipt.sourceOutputPairs.filter(p=>p.equal===null).length;
receipt.priorIconSourceDeltas=receipt.sourceOutputPairs.filter(p=>p.priorSha256&&p.currentSha256!==p.priorSha256);
receipt.integratedOutputDeltas=Object.entries(receipt.inputHashes).filter(([p,h])=>p.startsWith('packages/ui/dist/')&&integrated.builtLibraryHashes[p]!==h).map(([path,current])=>({path,current,saved:integrated.builtLibraryHashes[path]??null}));
writeFileSync(resolve(out,'bundle-results.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({runtime:receipt.runtime,esbuild:version,cases:receipt.cases.map(({name,retainedCount,cssBytes,result})=>({name,retainedCount,cssBytes,result})),sourceOutputPairs:receipt.sourceOutputPairs.length,changedSourcePairs:receipt.changedSourcePairs.length},null,2));
