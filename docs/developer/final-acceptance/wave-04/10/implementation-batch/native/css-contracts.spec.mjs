import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require=createRequire(new URL('../../../../../../../packages/ui/package.json',import.meta.url));
const {test,expect}=require('@playwright/test');
const fixture='/fixtures/?id=migration-proofs-popover--css-contract';
async function ring(locator) {
 return locator.evaluate(el=>{const c=getComputedStyle(el);return {style:c.outlineStyle,width:parseFloat(c.outlineWidth),color:c.outlineColor,offset:parseFloat(c.outlineOffset)};});
}
test('decorated-field enhancement fallback and final-card repair retain a computed focus ring',async({page},info)=>{
 // Exercise the unsupported-:has branch by disabling only its declared guard.
 // This is branch injection in a modern engine, not proof of a legacy engine.
 await page.route('**/*.css',async route=>{
  const response=await route.fetch();const text=await response.text();
  await route.fulfill({response,body:text.replaceAll('@supports selector(:has(*))','@supports (sgui-test-disabled: 1)')});
 });
 await page.goto(fixture);
 const input=page.getByRole('textbox',{name:'Decorated note'});
 await input.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
 await expect(input).toBeFocused();expect((await ring(input)).width).toBeGreaterThan(0);
 await page.getByRole('button',{name:'Remove last course'}).focus();await page.keyboard.press('Enter');
 const content=page.locator('[tabindex="-1"][aria-label="Focus repair courses"]');
 await expect(content).toBeFocused();expect((await ring(content)).width).toBeGreaterThan(0);expect((await ring(content)).offset).toBeLessThanOrEqual(0);
 await page.emulateMedia({forcedColors:'active'});expect((await ring(content)).width).toBeGreaterThan(0);
 await info.attach('focus-observations',{body:JSON.stringify({field:await ring(input),empty:await ring(content),engine:info.project.name,branch:'injected unsupported-has guard'}),contentType:'application/json'});
});
test('presentation geometry survives resize and reopen without replacing the focused draft',async({page},info)=>{
 await page.goto(fixture);const observations=[];
 for(const presentation of ['popover','dialog','drawer','auto']) {
  await page.setViewportSize({width:1100,height:800});
  const opener=page.getByRole('button',{name:'Open '+presentation,exact:true});await opener.click();
  const dialog=page.getByRole('dialog',{name:presentation+' contract',exact:true});
  const root=dialog.locator('..'),input=page.getByRole('textbox',{name:presentation+' draft'});
  await input.fill('Preserve draft');
  for(const width of [1100,390,1000]) {
   await page.setViewportSize({width,height:800});
   await expect(input).toBeFocused();await expect(input).toHaveValue('Preserve draft');
   await expect.poll(async()=>root.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1&&r.top>=-1&&r.bottom<=innerHeight+1;})).toBe(true);
   const geometry=await root.evaluate(el=>{const c=getComputedStyle(el),r=el.getBoundingClientRect();return {position:c.position,left:r.left,top:r.top,width:r.width,height:r.height,maxHeight:c.maxHeight};});
   if(presentation==='dialog') {expect(geometry.position).toBe('fixed');expect(Math.abs(geometry.left+geometry.width/2-width/2)).toBeLessThan(2);}
   if(presentation==='drawer'||presentation==='auto'&&width===390) {expect(geometry.position).toBe('fixed');expect(Math.abs(geometry.width-width)).toBeLessThan(2);expect(Math.abs(geometry.top+geometry.height-800)).toBeLessThan(2);}
   observations.push({presentation,width,...geometry});
  }
  await page.keyboard.press('Escape');await expect(opener).toBeFocused();await opener.click();await expect(dialog).toBeVisible();await page.keyboard.press('Escape');
 }
 await info.attach('geometry',{body:JSON.stringify(observations),contentType:'application/json'});
});
for(const mode of ['restrictive','allow-style-attributes'])test('response-header CSP characterization: '+mode,async({page},info)=>{
 const violations=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.exposeFunction('captureCSP',value=>violations.push(value));
 await page.addInitScript(()=>document.addEventListener('securitypolicyviolation',e=>window.captureCSP({directive:e.effectiveDirective,blocked:e.blockedURI,sample:e.sample,disposition:e.disposition})));
 const policy="default-src 'self'; script-src 'self'; style-src 'self'; style-src-elem 'self' 'nonce-sgui-test'; style-src-attr "+(mode==='restrictive'?"'none'":"'unsafe-inline'")+"; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'";
 let documentHeaders, documentBodySha256;
 await page.route('**/fixtures/?*',async route=>{
  if(!route.request().isNavigationRequest())return route.continue();
  const response=await route.fetch();documentHeaders={...response.headers(),'content-security-policy':policy};
  const body=(await response.text()).replace('<head>','<head><meta property="csp-nonce" content="sgui-test">').replaceAll('<style>','<style nonce="sgui-test">').replace('</body>','<div id="csp-markup-probe" style="width:37px;height:1px"></div></body>');
  documentBodySha256=createHash('sha256').update(body).digest('hex');
  await route.fulfill({response,headers:documentHeaders,body});
 });
 const outcomes=[]; let probe;
 try {
 await page.goto(fixture);
 await expect.poll(()=>page.locator('#react-aria-pressable-style').evaluate(style=>style.nonce)).toBe('sgui-test');
 for(const presentation of ['popover','dialog','drawer','auto']) {
  try {
   await page.getByRole('button',{name:'Open '+presentation,exact:true}).click({timeout:5000});
   const input=page.getByRole('textbox',{name:presentation+' draft'});await input.fill('CSP draft',{timeout:5000});
   outcomes.push({presentation,focused:await input.evaluate(el=>el===document.activeElement),geometry:await input.boundingBox()});
   await page.keyboard.press('Escape');
  }catch(error){outcomes.push({presentation,error:String(error)});break;}
 }
 await expect.poll(()=>documentHeaders?.['content-security-policy']).toBe(policy);
 probe=await page.locator('#csp-markup-probe').evaluate(el=>({width:getComputedStyle(el).width,height:getComputedStyle(el).height}));
 if(mode==='restrictive') {await expect.poll(()=>violations.some(v=>v.directive==='style-src-attr'&&v.disposition==='enforce')).toBe(true);expect(probe.width).not.toBe('37px');}
 else {expect(probe.width).toBe('37px');expect(errors).toEqual([]);expect(violations).toEqual([]);expect(outcomes).toHaveLength(4);expect(outcomes.every(o=>!o.error&&o.focused)).toBe(true);}
 } finally {
 if(!probe)probe=await page.locator('#csp-markup-probe').evaluate(el=>({width:getComputedStyle(el).width,height:getComputedStyle(el).height})).catch(error=>({error:String(error)}));
 const injectedStyles=await page.locator('style').evaluateAll(styles=>styles.map(style=>({id:style.id,nonce:style.nonce,content:style.textContent})));
 await info.attach('csp-receipt',{body:JSON.stringify({policy,documentHeaders,documentBodySha256,violations,errors,outcomes,probe,injectedStyles,browser:info.project.name,limit:'Intercepted document response with nonce only on fixture host style. Characterizes this host, not deployment policy approval or whole-library CSP.'},null,2),contentType:'application/json'});
 }
});
