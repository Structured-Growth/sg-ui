// Stage a fresh static export at its build-time prefix. Never replace an output.
import assert from 'node:assert/strict';
import {mkdir,readFile,cp,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {isDocumentationReleaseVersion} from '../content/documentation-versioning.mjs';
const app=fileURLToPath(new URL('..',import.meta.url));
const base=process.env.NEXT_PUBLIC_DOCS_BASE_PATH;
assert(base==='/dev'||(base?.startsWith('/releases/')&&!base.slice(10).startsWith('v')&&isDocumentationReleaseVersion(base.slice(10))),'Explicit /dev or immutable release prefix required');
const destination=resolve(process.argv[2]??'');
assert(process.argv[2]&&destination!==app,'Pass a fresh staging directory');
const output=resolve(app,'.next-static');
const routes=JSON.parse(await readFile(resolve(output,'documentation-routes.json'),'utf8')).routes;
assert(Array.isArray(routes)&&routes.includes('/'),'Missing generated route manifest');
for(const route of routes){
 assert(route.startsWith('/')&&!route.includes('..'),'Invalid route');
 const html=await readFile(resolve(output,'.'+route,'index.html'),'utf8');
 assert(html.includes(`${base}/_next/`),'Export was built with a different base path: '+route);
}
await mkdir(destination); // Reject replacement, including immutable snapshots.
await mkdir(resolve(destination,'.'+base),{recursive:true});
await cp(output,resolve(destination,'.'+base),{recursive:true});
await cp(resolve(output,'404.html'),resolve(destination,'404.html'));
// Amplify's 404 destination can be displayed at the requested URL. A small
// static fallback moves the browser to the actual overview URL before Next
// hydrates, with the unavailable route carried as plain query data.
await writeFile(resolve(destination,'.'+base,'documentation-not-found.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Documentation unavailable</title><body data-docs-base="${base}"><h1>Documentation unavailable</h1><p>This version does not contain the requested page.</p><a href="${base}/">Open this version's overview</a><script src="${base}/documentation-fallback.js" defer></script></body></html>`);
await writeFile(resolve(destination,'.'+base,'documentation-fallback.js'),`const base=document.body.dataset.docsBase;const path=window.location.pathname;if(path.startsWith(base+'/docs/components/')){const target=new URL(base+'/',window.location.origin);target.searchParams.set('documentation-unavailable',path.slice(base.length));window.location.replace(target.href);}`);
const redirects=[
 {source:'/',target:`${base}/`,status:'302'},
 ...['installation','theming','releases','licensing'].map(page=>({source:`${base}/docs/${page}`,target:`${base}/${page}/`,status:'301'})),
 {source:`${base}/docs/components/owned-button`,target:`${base}/docs/components/button/`,status:'301'},
 // Amplify evaluates existing files first for 404 redirects. Restrict the
 // fallback to documentation pages so failed assets remain real failures.
 {source:`${base}/docs/components/<*>`,target:`${base}/documentation-not-found.html`,status:'404'},
];
await writeFile(resolve(destination,'amplify-redirects.json'),JSON.stringify(redirects,null,2)+'\n');
await writeFile(resolve(destination,'deployment-receipt.json'),JSON.stringify({schemaVersion:1,basePath:base,routeCount:routes.length,sourceHead:process.env.SGUI_DOCS_SOURCE_HEAD??null,limits:['Static staging only; configure and validate Amplify redirect rules separately.','Release assembly must retain prior snapshots; this command never merges or replaces a deployment.','No /latest alias until an actual published release exists.']},null,2)+'\n');
console.log(`Staged ${routes.length} routes under ${base}`);
