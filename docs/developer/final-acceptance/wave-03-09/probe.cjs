const {createRequire}=require('node:module');
const {writeFileSync}=require('node:fs');
const {join}=require('node:path');
const {createHash}=require('node:crypto');
const root=process.cwd();
const out=__dirname;
const {chromium}=createRequire(join(root,'packages/ui/package.json'))('@playwright/test');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
 const context=await browser.newContext({viewport:{width:1280,height:900}});
 const page=await context.newPage();
 const responses=[];
 page.on('response',async r=>{if(r.url().includes('/_next/static/')&&/\.(css|js)(\?|$)/.test(r.url()))try{responses.push({url:r.url(),sha256:createHash('sha256').update(await r.body()).digest('hex')});}catch{}});
 await page.goto('http://127.0.0.1:3000/docs/components/card-frame');
 await page.locator('[data-sgui-part="class-card-frame"]').first().waitFor();
 const result={runtime:process.version,browser:browser.version(),url:page.url(),titles:await page.getByRole('heading').allTextContents(),buttons:await page.getByRole('button').allTextContents(),card:await page.locator('[data-sgui-part="class-card-frame"]').first().evaluate(e=>({html:e.outerHTML,container:getComputedStyle(e).containerType}))};
 await page.goto('http://127.0.0.1:3000/docs/components/dialog');
 await page.getByRole('heading',{name:'AppModal',exact:true}).waitFor();
 result.dialogButtons=await page.getByRole('button').allTextContents();
 result.responses=responses;
 writeFileSync(join(out,'probe.json'),JSON.stringify(result,null,2));
 await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
