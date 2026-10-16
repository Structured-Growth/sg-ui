// Run from repository root through /tmp/sgui-calendar-validate.mjs; no server is started.
const {createRequire}=require('node:module');
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const assert=require('node:assert/strict');
const {chromium,expect}=createRequire(path.join(process.cwd(),'packages/ui/package.json'))('@playwright/test');
const out=__dirname;const base=process.env.SGUI_REFLOW_BASE_URL||'http://127.0.0.1:3000';
const modes=[
 {id:'en-compact-mono-320',locale:'en',density:'compact',font:'monospace',width:320,scale:100},
 {id:'ar-comfortable-serif-320',locale:'ar',density:'comfortable',font:'serif',width:320,scale:100},
 {id:'en-comfortable-serif-text200',locale:'en',density:'comfortable',font:'serif',width:640,scale:200},
 {id:'ar-compact-mono-text200',locale:'ar',density:'compact',font:'monospace',width:640,scale:200},
];
const stress=(font,scale)=>`html {font-size:${scale}%;} [data-sgui-part="class-card-frame"] *, [data-sgui-part="dialog-overlay"] * {font-family:${font} !important;line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important;} [data-sgui-part="class-card-frame"] p,[data-sgui-part="dialog-overlay"] p {margin-block-end:2em !important;}`;
async function focusedGeometry(locator){return locator.evaluate(e=>{
 const r=e.getBoundingClientRect(),css=getComputedStyle(e);const ring=parseFloat(css.outlineWidth)+Math.max(0,parseFloat(css.outlineOffset)||0);const clips=[];
 for(let p=e.parentElement;p;p=p.parentElement){const s=getComputedStyle(p),b=p.getBoundingClientRect();if(/auto|scroll|hidden|clip/.test(s.overflowX+' '+s.overflowY)){clips.push({part:p.getAttribute('data-sgui-part'),tag:p.tagName,top:b.top,bottom:b.bottom,left:b.left,right:b.right,scrollTop:p.scrollTop,scrollLeft:p.scrollLeft,overflow:s.overflow,clipped:r.top<b.top-1||r.bottom>b.bottom+1||r.left<b.left-1||r.right>b.right+1});}}
 const hits=[[.5,.5],[.1,.1],[.9,.9]].map(([x,y])=>{const h=document.elementFromPoint(r.left+r.width*x,r.top+r.height*y);return !!h&&(e.contains(h)||h.contains(e));});
 return {name:e.getAttribute('aria-label')||e.textContent||e.getAttribute('name'),tag:e.tagName,rect:{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height},focused:document.activeElement===e,outline:{style:css.outlineStyle,width:css.outlineWidth,offset:css.outlineOffset,ring},viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio,visualScale:visualViewport?.scale},clips,hits,visible:r.left>=-1&&r.right<=innerWidth+1&&r.top>=-1&&r.bottom<=innerHeight+1&&hits.every(Boolean)&&clips.every(c=>!c.clipped)};
 });}
(async()=>{
 const browser=await chromium.launch({headless:true});const receipt={startedAt:new Date().toISOString(),runtime:process.version,browser:browser.version(),base,limits:'Existing mutable development host, separate disposable browser contexts; DOM-injected font/spacing/label/density stress. Root text enlargement and CSS viewport reflow, NOT browser zoom, AT or production-build acceptance.',cases:[],responses:[]};
 const bodies=[];
 try{for(const mode of modes){const context=await browser.newContext({viewport:{width:mode.width,height:640},reducedMotion:'reduce'});const page=await context.newPage();const result={...mode,errors:[],focus:[]};receipt.cases.push(result);
 page.on('pageerror',e=>result.errors.push(e.message));
 page.on('response',r=>{if(r.url().startsWith(base)&&/\.(css|js)(\?|$)/.test(r.url()))bodies.push((async()=>{try{receipt.responses.push({url:r.url(),sha256:crypto.createHash('sha256').update(await r.body()).digest('hex')});}catch{}})());});
 try{
 await page.goto(base+'/docs/components/card-frame');const card=page.locator('[data-sgui-part="class-card-frame"]').nth(1);await card.waitFor();
 const longLabel=mode.locale==='ar'?'خطة الدورة الدولية لتطوير مهارات القيادة والتعاون ومراجعة المواد التعليمية':'International course plan for leadership collaboration and learning materials review';
 await page.getByRole('textbox',{name:'Card title',exact:true}).fill(longLabel);await expect(card.locator('h3')).toHaveText(longLabel);
 await page.addStyleTag({content:stress(mode.font,mode.scale)});
 await card.evaluate((e,m)=>{e.closest('[data-sgui-density]').setAttribute('data-sgui-density',m.density);e.setAttribute('dir',m.locale==='ar'?'rtl':'ltr');e.setAttribute('lang',m.locale);},mode);
 const link=card.getByRole('link');await link.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');const cardFocus=await focusedGeometry(link);result.focus.push({target:'card-footer',...cardFocus});
 result.card=await card.evaluate(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth,header:e.querySelector('h3').textContent,headerHeight:e.querySelector('h3').getBoundingClientRect().height,font:getComputedStyle(e.querySelector('h3')).fontFamily}));
 await card.screenshot({path:path.join(out,mode.id+'-card.png')});assert(cardFocus.visible,'card footer clipped or obscured');assert(result.card.scrollWidth<=result.card.width+1,'card inline overflow');
 await page.goto(base+'/docs/components/dialog');await page.addStyleTag({content:stress(mode.font,mode.scale)});
 const trigger=page.getByRole('button',{name:'Open tabbed settings',exact:true});await trigger.scrollIntoViewIfNeeded();await trigger.focus();await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog',{name:'Course configuration',exact:true});await dialog.waitFor();
 await dialog.evaluate((e,m)=>{const overlay=e.closest('[data-sgui-part="dialog-overlay"]');overlay.setAttribute('data-sgui-density',m.density);overlay.setAttribute('dir',m.locale==='ar'?'rtl':'ltr');overlay.setAttribute('lang',m.locale);},mode);
 // Real Tab traversal through the mounted dialog; do not call scrollIntoView on its controls.
 const seen=new Set();for(let i=0;i<12;i++){const active=page.locator(':focus');const g=await focusedGeometry(active);result.focus.push({target:'dialog-tab-'+i,...g});const key=g.tag+':'+g.name;if(seen.has(key))break;seen.add(key);await page.keyboard.press('Tab');}
 result.dialog=await dialog.evaluate(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth,scrollTop:e.scrollTop,height:e.clientHeight,scrollHeight:e.scrollHeight}));
 await page.screenshot({path:path.join(out,mode.id+'-dialog.png')});
 for(const g of result.focus)assert(g.visible,`${g.target}: focused control clipped or obscured`);
 assert(result.dialog.scrollWidth<=result.dialog.width+1,'dialog inline overflow');
 await page.keyboard.press('Escape');await expect(trigger).toBeFocused();assert.equal(result.errors.length,0,'runtime errors');result.status='passed';
 }catch(e){result.status='failed';result.failure=e.stack;await page.screenshot({path:path.join(out,mode.id+'-failure.png')}).catch(()=>{});}
 finally{await context.close();}
 }}finally{await Promise.allSettled(bodies);await browser.close();receipt.finishedAt=new Date().toISOString();receipt.responses=[...new Map(receipt.responses.map(x=>[x.url+':'+x.sha256,x])).values()];fs.writeFileSync(path.join(out,'reflow-results.json'),JSON.stringify(receipt,null,2));}
 console.log(receipt.cases.map(c=>`${c.id}: ${c.status}${c.failure?' '+c.failure.split('\n')[0]:''}`).join('\n'));if(receipt.cases.some(c=>c.status==='failed'))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
