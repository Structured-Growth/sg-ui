// Preserve legal files for file-backed modules actually assigned to client chunks.
// This is technical distribution evidence, not a rights/compatibility decision.
import {existsSync,readFileSync,readdirSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve,relative,join} from 'node:path';
import {createHash} from 'node:crypto';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const legalName=/^(?:licen[sc]e|copying|notice)(?:$|[.-])/i;
export function collectDocsLegalEvidence(resources,root){
 const packages=new Map(),legal=new Map(),findings=[],cache=new Map();
 const rememberLegal=path=>{if(legal.has(path))return;const bytes=readFileSync(path),text=bytes.toString('utf8');legal.set(path,{path:relative(root,path),sha256:hash(bytes),text});if(!text.trim())findings.push({code:'empty-legal-file',path:relative(root,path)});};
 for(const resource of [...new Set(resources)].sort()){
  let dir=dirname(resource),owner;const visited=[];
  while(dir!==dirname(dir)){
   if(cache.has(dir)){owner=cache.get(dir);break;}
   visited.push(dir);
   const files=readdirSync(dir,{withFileTypes:true});
   for(const file of files)if(file.isFile()&&legalName.test(file.name)){
    rememberLegal(join(dir,file.name));
   }
   if(existsSync(join(dir,'package.json'))){owner=dir;break;}
   dir=dirname(dir);
  }
  for(const path of visited)cache.set(path,owner);
  if(!owner){findings.push({code:'module-package-unresolved',resource:relative(root,resource)});continue;}
  const manifest=JSON.parse(readFileSync(join(owner,'package.json'),'utf8'));
  if(['@structured-growth/sg-ui','@structured-growth/docs','sg-ui-workspace'].includes(manifest.name)){
   for(const path of [...legal.keys()])if(dirname(path)===owner)legal.delete(path);
   continue;
  }
  if(!packages.has(owner)){
   const files=readdirSync(owner,{withFileTypes:true}).filter(f=>f.isFile()&&legalName.test(f.name)).map(f=>join(owner,f.name));
   for(const path of files)rememberLegal(path);
   const entry={id:`${manifest.name}@${manifest.version??'unversioned-vendored'}`,manifest:relative(root,join(owner,'package.json')),manifestSha256:hash(readFileSync(join(owner,'package.json'))),declaredLicense:manifest.license??null,legalFiles:files.map(path=>relative(root,path))};
   packages.set(owner,entry);if(!files.length)findings.push({code:'emitted-package-legal-text-missing',...entry});
  }
 }
 return {packages:[...packages.values()].sort((a,b)=>a.id.localeCompare(b.id)),legalFiles:[...legal.values()].sort((a,b)=>a.path.localeCompare(b.path)),findings};
}
export class DocsLicenseAuditPlugin {
 constructor(root){this.root=root;}
 apply(compiler){compiler.hooks.done.tap('SGUIDocsLicenseAudit',stats=>{
  const resources=[],virtual=[];const compilation=stats.compilation;
  function visit(module){if(module.resource&&existsSync(module.resource))resources.push(module.resource);else if(!module.modules)virtual.push(module.identifier());if(module.modules)for(const child of module.modules)visit(child);}
  for(const module of compilation.modules)if(compilation.chunkGraph.getNumberOfModuleChunks(module)>0)visit(module);
  const evidence=collectDocsLegalEvidence(resources,this.root);
  const runtimeNotice=join(this.root,'apps/docs/node_modules/next/dist/compiled/webpack/LICENSE');
  if(virtual.some(name=>name.startsWith('webpack/runtime/'))&&existsSync(runtimeNotice)){const bytes=readFileSync(runtimeNotice);evidence.legalFiles.push({path:'next/dist/compiled/webpack/LICENSE (generated runtime)',sha256:hash(bytes),text:bytes.toString('utf8')});}
  const library=readFileSync(join(this.root,'packages/ui/THIRD_PARTY_NOTICES.md'),'utf8');
  const supplemental=evidence.legalFiles.map(file=>`\n## ${file.path}\n\n${file.text}\n`).join('');
  const notice=library+'\n# Documentation client bundle — supplemental legal texts\n\nThese installed legal texts accompany file-backed modules in the docs client chunks.\nThey supplement the library notices; inclusion is not an assertion that every file\nin the corresponding package is shipped. Missing publisher evidence remains recorded.\n'+supplemental;
  writeFileSync(join(this.root,'apps/docs/public/THIRD_PARTY_NOTICES.txt'),notice);
  mkdirSync(compiler.outputPath,{recursive:true});
  writeFileSync(join(compiler.outputPath,'docs-license-audit.json'),JSON.stringify({schemaVersion:1,resources:resources.map(path=>relative(this.root,path)).sort(),virtualModules:virtual.sort(),...evidence,legalFiles:evidence.legalFiles.map(({text,...file})=>file),noticeSha256:hash(notice),limits:['File-backed client chunk inventory only; generated runtime/loader code and copied assets require separate review.','No automatic license approval, missing-notice inference or removal of historical notices.']},null,2)+'\n');
 });}
}
