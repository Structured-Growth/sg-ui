// Run against the staged /dev export without a Next.js server.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {chromium} from '@playwright/test';
const root=resolve(process.argv[2]??'');
assert(process.argv[2],'Pass a staged export directory');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');let path=resolve(root,'.'+decodeURIComponent(url.pathname));
  assert(path===root||path.startsWith(root+sep));
  if((await stat(path)).isDirectory())path=resolve(path,'index.html');
  const bytes=await readFile(path);res.writeHead(200,{'content-type':types[extname(path)]??'application/octet-stream'});res.end(bytes);
 }catch{
  if(new URL(req.url,'http://localhost').pathname.startsWith('/dev/docs/components/')){res.writeHead(404,{'content-type':'text/html'});res.end(await readFile(resolve(root,'dev/documentation-not-found.html')));}
  else {res.writeHead(404);res.end('Not found');}
 }
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const origin=`http://127.0.0.1:${server.address().port}`;
let browser;
try{
 browser=await chromium.launch();const page=await browser.newPage();const errors=[];const failed=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/dev/docs/components/missing-in-this-version/'))failed.push(r.url());});
 await page.goto(origin+'/dev/docs/components/button/');
 await page.getByRole('heading',{name:'Button',exact:true,level:1}).waitFor();
 await page.getByRole('navigation',{name:'Documentation',exact:true}).getByRole('link',{name:'Button',exact:true}).waitFor();
 assert.equal(await page.getByRole('navigation',{name:'Documentation',exact:true}).getByRole('link',{name:'Button',exact:true}).getAttribute('aria-current'),'page');
 const installation=page.getByRole('navigation',{name:'Documentation',exact:true}).getByRole('link',{name:'Installation',exact:true});
 assert.equal(await installation.getAttribute('href'),'/dev/installation/','Native link must preserve build prefix');
 await installation.click();await page.waitForURL('**/dev/installation/');
 await page.reload();await page.getByRole('heading',{name:'Installation',exact:true,level:1}).waitFor();
 await page.goto(origin+'/dev/docs/components/missing-in-this-version/');
 await page.waitForURL('**/dev/?documentation-unavailable=*');
 assert.match(await page.getByRole('status').first().innerText(),/does not include \/docs\/components\/missing-in-this-version/);
 const notices=await page.request.get(origin+'/dev/THIRD_PARTY_NOTICES.txt');assert(notices.ok());assert.match(await notices.text(),/Documentation client bundle/);
 const manifest=await page.request.get(origin+'/dev/documentation-routes.json');assert(manifest.ok());assert((await manifest.json()).routes.includes('/docs/components/button'));
 await page.goto(origin+'/dev/docs/components/page-rich-text-editor-section/');
 const image=page.getByRole('img',{name:'Learning sequence: learn, practice, reflect',exact:true}).first();
 await image.waitFor();assert.equal(await image.getAttribute('src'),'/dev/course-guide.svg');
 assert(await image.evaluate(img=>img.complete&&img.naturalWidth>0),'Prefixed editor image must load');
 await page.goto(origin+'/dev/docs/components/learner-grid/');
 await page.getByRole('heading',{level:1,name:'LearnerClassesDataGrid',exact:true}).waitFor();
 await page.waitForTimeout(300); // Observe accidental prefetches of host-only destinations.
 await page.waitForTimeout(200);
 assert.deepEqual(errors,[],'Hydration/runtime errors');assert.deepEqual(failed,[],'Failed static asset/route requests');
 console.log(JSON.stringify({status:'pass',checks:['prefixed hrefs','component hydration','client navigation','hard refresh','404-to-overview fallback and notice','route manifest','no demo-destination prefetch','served third-party notices','prefixed editor image','no runtime errors','no failed requests']}));
}finally{await browser?.close();await new Promise(done=>server.close(done));}
