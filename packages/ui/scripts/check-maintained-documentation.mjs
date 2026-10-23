/** Source-only navigation check. Run from repository root:
 * node packages/ui/scripts/check-maintained-documentation.mjs
 * Includes tracked root guides, docs guides and workspace READMEs. Reports
 * excluded historical batch/evidence/migration snapshot documents separately.
 * Reuses check-document-links unchanged; recognized Next routes are joined to
 * actual app pages/catalog, not treated as absolute filesystem paths.
 * Scope/limitations of that Markdown parser still apply. No remote HTTP, MDX,
 * code compilation or prose/command execution is performed.
 */
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,relative,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {checkDocumentLinks,markdownLinks} from './check-document-links.mjs';

export function maintainedDocument(file) {
 if(!/\.(?:md|markdown)$/i.test(file))return false;
 if(!file.includes('/'))return true;
 if(['packages/ui/README.md','apps/docs/README.md','apps/docs/native-fixtures/README.md'].includes(file))return true;
 return file.startsWith('docs/')&&!/^docs\/developer\/(?:final-acceptance\/|parallel[^/]*(?:\/|$)|next100[^/]*(?:\/|$)|migration-baseline\/)/.test(file);
}
export function currentSiteRoutes(root) {
 const app=resolve(root,'apps/docs/app'),routes=new Set();let catalogHost=false;
 function walk(dir) {
  for(const entry of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
   const path=join(dir,entry.name);
   if(entry.isDirectory())walk(path);
   else if(entry.name==='page.tsx') {
    const parts=relative(app,dir).split('/').filter(Boolean).filter(p=>!/^\(.*\)$/.test(p));
    if(parts.join('/')==='docs/components/[slug]')catalogHost=true;
    if(parts.some(p=>p.includes('[')||p.startsWith('@')))continue;
    routes.add('/'+parts.join('/'));
   }
  }
 }
 walk(app);
 const catalog=JSON.parse(readFileSync(resolve(root,'apps/docs/content/catalog.json'),'utf8'));
 if(!catalogHost)throw Error('Missing component catalog dynamic page');
 const slugs=new Set();
 for(const row of catalog) {
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)||slugs.has(row.slug))throw Error(`Invalid/duplicate catalog slug: ${row.slug}`);
  slugs.add(row.slug);routes.add('/docs/components/'+row.slug);
 }
 return {routes:[...routes].sort(),componentRoutes:slugs.size};
}
export async function checkMaintainedDocumentation({root,trackedFiles}={}) {
 root=resolve(root??resolve(fileURLToPath(new URL('../../..',import.meta.url))));
 trackedFiles??=execFileSync('git',['ls-files','-z','--','*.md','*.markdown','*.MD'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean);
 trackedFiles=trackedFiles.filter(file=>existsSync(resolve(root,file)));
 const files=trackedFiles.filter(maintainedDocument).sort(),site=currentSiteRoutes(root),routes=new Set(site.routes),siteLinks=[];
 const checked=await checkDocumentLinks({root,files});
 // Preserve the generic auditor's raw result. Only exact canonical routes from
 // source are dispositioned; unknown/legacy paths and real file defects remain.
 const routePath=destination=>{try{return decodeURIComponent(destination.split(/[?#]/)[0]);}catch{return null;}};
 for(const file of files)for(const link of markdownLinks(readFileSync(resolve(root,file),'utf8')))
  if(link.destination?.startsWith('/')&&routes.has(routePath(link.destination)))siteLinks.push({file,destination:link.destination,route:routePath(link.destination)});
 const findings=checked.findings.filter(f=>!(f.code==='missing-path'&&routes.has(routePath(f.destination))));
 return {root,files:files.length,filesAudited:files,excludedDocuments:trackedFiles.filter(f=>!maintainedDocument(f)).sort().map(file=>({file,reason:file.startsWith('docs/developer/')?'Historical batch, frozen acceptance evidence or migration snapshot':'Outside maintained guide scope'})),
  checkedLinks:checked.checkedLinks,externalLinksExcluded:checked.excludedLinks,site:{...site,linkOccurrences:siteLinks.length,links:siteLinks},findings,
  defects:findings.filter(f=>f.category==='document').length,retentionFindings:findings.filter(f=>f.category!=='document').length,
  rawFilesystemAudit:checked,limits:['No remote URL requests','Markdown parser limits retained; no MDX/raw HTML href audit','No command execution or example compilation','Historical excluded evidence is retained, not repaired or certified']};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url) {
 try{if(process.argv.length>2)throw Error('No CLI arguments supported');const result=await checkMaintainedDocumentation();console.log(JSON.stringify(result,null,2));process.exitCode=result.defects?1:0;}catch(e){console.error(e.stack);process.exitCode=2;}
}
