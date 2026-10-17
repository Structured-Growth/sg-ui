/** Scoped current-doc consistency check; read-only, no build or command execution.
 * node packages/ui/scripts/check-current-guidance-wave04.mjs [--proposed-root PATH]
 * Validates four current guides. Browser guide's dated receipt sections are explicitly
 * outside this scope. Git history/evidence archives and literal old paths stay untouched.
 */
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {markdownLinks,markdownAnchors} from './check-document-links.mjs';
import {commandCodeIn} from './check-docs-provenance-wave04.mjs';
export const guidanceScope=[
 'docs/developer/react-aria-browser-acceptance.md',
 'docs/developer/react-aria-development-validation.md',
 'docs/developer/react-aria-server-components.md',
 'docs/developer/form-field-message-placement.md',
];
const toolDependencies={playwright:'@playwright/test',vitest:'vitest',tsc:'typescript'};
const builtins=new Set(['install','exec','pack','dlx','why','list','add','remove','update','publish','config','store']);
export function auditGuidance({root,files=guidanceScope,proposedRoot}={}) {
 root=resolve(root);const issues=[],checks=[],excluded=[];
 const read=p=>readFileSync(proposedRoot&&existsSync(resolve(proposedRoot,p))?resolve(proposedRoot,p):resolve(root,p),'utf8');
 const exists=p=>existsSync(resolve(root,p))||Boolean(proposedRoot&&existsSync(resolve(proposedRoot,p)));
 const manifests=['package.json','packages/ui/package.json','apps/docs/package.json'].map(path=>({path,cwd:dirname(path),...JSON.parse(read(path))}));
 const catalog=exists('apps/docs/content/catalog.json')?JSON.parse(read('apps/docs/content/catalog.json')):[];
 const routes=new Set(['/', '/installation','/theming','/releases','/licensing','/docs/components',...catalog.map(row=>`/docs/components/${row.slug}`)]);
 for(const file of files) {
  let text=read(file);
  if(file==='docs/developer/react-aria-browser-acceptance.md') {
   const at=text.indexOf('## Historical validation and environment receipts');
   if(at>=0){excluded.push({file,section:'Historical validation and environment receipts and following dated acceptance records'});text=text.slice(0,at);}
  }
  for(const link of markdownLinks(text)) {
   if(link.destination===undefined){issues.push({file,code:'undefined-reference',reference:link.reference});continue;}
   const target=link.destination;if(!target||/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target))continue;
   let path,fragment;
   try{[path,fragment='']=target.split('#').map(decodeURIComponent);}catch{issues.push({file,code:'invalid-encoding',target});continue;}
   path=path.split('?')[0];
   if(path.startsWith('/')) {
    const canonical=!/^\/docs\/(?:installation|theming|releases|licensing)(?:\/|$)/.test(path);
    checks.push({file,kind:'route',target});
    if(!routes.has(path)||!canonical)issues.push({file,code:'invalid-or-noncanonical-route',target});
    continue;
   }
   const destination=path?relative(root,resolve(root,dirname(file),path)):file;
   checks.push({file,kind:'link',target});
   if(!exists(destination)){issues.push({file,code:'missing-path',target});continue;}
   if(fragment&&/\.md$/i.test(destination)&&!markdownAnchors(read(destination)).has(fragment))issues.push({file,code:'missing-anchor',target});
  }
  const code=commandCodeIn(text);
  for(const line of code.split('\n')) {
   const direct=line.match(/^[ \t]*node[ \t]+(?:--test[ \t]+)?((?:scripts|packages)\/[\w./-]+\.[cm]?js)/);
   if(direct){checks.push({file,kind:'direct-node-script',script:direct[1]});if(!exists(direct[1]))issues.push({file,code:'missing-direct-node-script',script:direct[1],workspace:'repository root'});}
   for(const m of line.matchAll(/\bpnpm[ \t]+(?:--filter[ \t]+([@\w/.-]+)[ \t]+)?(?:run[ \t]+)?([\w:.-]+)(?:[ \t]+([^\n]*))?/g)) {
    const [,filter,task,args='']=m;const manifest=filter?manifests.find(p=>p.name===filter):manifests[0];
    checks.push({file,kind:'command',command:m[0],manifest:manifest?.path??null});
    if(!manifest){issues.push({file,code:'unknown-workspace-filter',command:m[0]});continue;}
    if(!builtins.has(task)&&!manifest.scripts?.[task])issues.push({file,code:'missing-package-script',command:m[0]});
    if(task==='exec') {
     const tool=args.split(/[ \t]+/)[0], dependency=toolDependencies[tool];
     if(dependency&&!manifest.dependencies?.[dependency]&&!manifest.devDependencies?.[dependency])issues.push({file,code:'tool-not-owned-by-workspace',tool,workspace:manifest.path});
     if(tool==='node') {
      const match=args.match(/^node[ \t]+(?:--test[ \t]+)?(scripts\/[\w./-]+\.[cm]?js|packages\/[\w./-]+\.[cm]?js)/);
      if(match&&!exists(relative(root,resolve(root,manifest.cwd,match[1]))))issues.push({file,code:'missing-node-script',script:match[1],workspace:manifest.path});
     }
    }
   }
  }
  for(const m of code.matchAll(/(?:from[ \t]+|import[ \t]+)["'](@structured-growth\/sg-ui(?:\/[\w./*-]+)?)["']/g)) {
   const path=m[1].replace('@structured-growth/sg-ui','')||'.';const key=path==='.'?'.':'.'+path;
   const available=Object.keys(manifests[1].exports??{}).some(e=>e===key||(e.includes('*')&&key.startsWith(e.split('*')[0])&&key.endsWith(e.split('*')[1])));
   checks.push({file,kind:'public-import',import:m[1]});if(!available)issues.push({file,code:'unexported-package-route',import:m[1]});
  }
  for(const m of code.matchAll(/\b((?:packages\/ui|apps\/docs)\/[\w./-]+\.(?:tsx?|mjs|json|css))\b/g)) {
   checks.push({file,kind:'source-path',path:m[1]});if(!exists(m[1]))issues.push({file,code:'missing-source-path',path:m[1]});
  }
 }
 return {status:issues.length?'failed':'passed',files,excluded,checks,issues,limits:['Four named current guides only; explicit Markdown links/anchors, canonical public routes, pnpm script/filter/tool ownership, referenced exec-node scripts, qualified source paths and public package import routes.','Does not run commands, compile snippets/types or validate flags, arbitrary shell, dynamic import names, HTML href/src, external sites, devices, AT or legal/release approval. Browser guide current prefix only; excluded dated records are named, not certified.']};
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url) {
 try {
  const args=process.argv.slice(2);let proposedRoot;
  for(let i=0;i<args.length;i++)if(args[i]==='--proposed-root'&&args[i+1])proposedRoot=resolve(args[++i]);else throw Error(`Unknown/incomplete option: ${args[i]}`);
  const root=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
  const result=auditGuidance({root,proposedRoot});console.log(JSON.stringify(result,null,2));process.exitCode=result.issues.length?1:0;
 }catch(error){console.error(error.stack);process.exitCode=2;}
}
