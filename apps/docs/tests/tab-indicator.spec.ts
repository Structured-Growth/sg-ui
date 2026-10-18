import {test,expect,type Locator} from './fixtures';
import {exampleName} from './example-name';
const line=(host:Locator)=>host.locator('[data-sgui-part="tab-indicator"]');
async function aligned(indicator:Locator,target:Locator,vertical=false,rtl=false){
 await expect(indicator).toBeVisible();
 await expect.poll(async()=>{const a=(await indicator.boundingBox())!,b=(await target.boundingBox())!;return vertical?Math.abs(a.x-(rtl?b.x:b.x+b.width-2))+Math.abs(a.y-b.y)+Math.abs(a.height-b.height):Math.abs(a.x-b.x)+Math.abs(a.y-(b.y+b.height-2))+Math.abs(a.width-b.width);}).toBeLessThan(2);
}
async function halfway(indicator:Locator){
 await expect.poll(()=>indicator.evaluate(element=>element.getAnimations().length)).toBeGreaterThan(0);
 await indicator.evaluate(element=>element.getAnimations().forEach(animation=>{animation.pause();animation.currentTime=500;}));
}
for(const orientation of ['horizontal','vertical'])for(const density of ['compact','comfortable'])test(`${orientation} tab indicator slides at ${density} density`,async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/docs/components/tabs');
 const title=`${orientation==='horizontal'?'Horizontal':'Vertical'} tabs · ${density} · automatic`,panel=page.getByRole('region',{name:exampleName(title),exact:true}),preview=panel.locator('[data-docs-preview]');
 await preview.evaluate(element=>(element as HTMLElement).style.setProperty('--sgui-motion-duration','1000ms'));
 const indicator=line(preview),first=preview.getByRole('tab',{name:'Course overview',exact:true}),next=preview.getByRole('tab',{name:'Lessons and activities',exact:true});await preview.scrollIntoViewIfNeeded();await aligned(indicator,first,orientation==='vertical');
 expect(await indicator.evaluate(element=>element.getAnimations().length)).toBe(0);const before=(await indicator.boundingBox())!,beforeClip=(await indicator.locator('..').boundingBox())!;
 await next.click();await expect(next).toHaveAttribute('aria-selected','true');await halfway(indicator);
 const middle=(await indicator.boundingBox())!,target=(await next.boundingBox())!;
 const clip=(await indicator.locator('..').boundingBox())!;
 // Native focus scrolling may move the strip; compare within its clipping area.
 const initial=orientation==='vertical'?before.y-beforeClip.y:before.x-beforeClip.x,position=orientation==='vertical'?middle.y-clip.y:middle.x-clip.x,end=orientation==='vertical'?target.y-clip.y:target.x-clip.x;
 expect(position).toBeGreaterThan(Math.min(initial,end)+1);expect(position).toBeLessThan(Math.max(initial,end)-1);
 expect(await next.evaluate((element,vertical)=>getComputedStyle(element)[vertical?'borderInlineEndColor':'borderBottomColor'],orientation==='vertical')).toBe('rgba(0, 0, 0, 0)');
 await preview.screenshot({path:`/tmp/tab-indicator-${orientation}-${density}.png`});
 await indicator.evaluate(element=>element.getAnimations().forEach(animation=>animation.finish()));await aligned(indicator,next,orientation==='vertical');
});
for(const orientation of ['horizontal','vertical'])test(`${orientation} manual tabs animate on activation and snap for reduced motion`,async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/docs/components/tabs');
 const title=`${orientation==='horizontal'?'Horizontal':'Vertical'} tabs · comfortable · manual`,preview=page.getByRole('region',{name:exampleName(title),exact:true}).locator('[data-docs-preview]');
 await preview.evaluate(element=>(element as HTMLElement).style.setProperty('--sgui-motion-duration','1000ms'));
 const indicator=line(preview),first=preview.getByRole('tab',{name:'Course overview',exact:true}),next=preview.getByRole('tab',{name:'Lessons and activities',exact:true});await first.focus();await first.press(orientation==='vertical'?'ArrowDown':'ArrowRight');await expect(next).toBeFocused();await expect(first).toHaveAttribute('aria-selected','true');await aligned(indicator,first,orientation==='vertical');expect(await indicator.evaluate(element=>element.getAnimations().length)).toBe(0);
 await next.press('Enter');await halfway(indicator);await indicator.evaluate(element=>element.getAnimations().forEach(animation=>animation.finish()));await aligned(indicator,next,orientation==='vertical');
 await page.emulateMedia({reducedMotion:'reduce'});await first.click();await aligned(indicator,first,orientation==='vertical');expect(await indicator.evaluate(element=>element.getAnimations().length)).toBe(0);
});
test('vertical RTL and forced colors retain an aligned visible indicator',async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});await page.goto('/docs/components/tabs');
 const preview=page.getByRole('region',{name:exampleName('Vertical tabs · compact · automatic'),exact:true}).locator('[data-docs-preview]');await preview.evaluate(element=>{element.setAttribute('dir','rtl');element.querySelector('[role="tablist"]')?.setAttribute('dir','rtl');});
 const next=preview.getByRole('tab',{name:'Lessons and activities',exact:true});await next.click();await aligned(line(preview),next,true,true);
 expect(await line(preview).evaluate(element=>getComputedStyle(element).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
 expect(await line(preview).evaluate(element=>getComputedStyle(element).forcedColorAdjust)).not.toBe('none');
});
test('route page tabs share the moving indicator',async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/docs/components/page-tabs');
 const preview=page.getByRole('region',{name:exampleName('Host route navigation — compact'),exact:true}).locator('[data-docs-preview]');await preview.evaluate(element=>(element as HTMLElement).style.setProperty('--sgui-motion-duration','1000ms'));
 const first=preview.getByRole('link',{name:'Overview',exact:true}),next=preview.getByRole('link',{name:'Practice',exact:true}),indicator=line(preview);await aligned(indicator,first);await next.click();await expect(next).toHaveAttribute('aria-current','page');await halfway(indicator);await indicator.evaluate(element=>element.getAnimations().forEach(animation=>animation.finish()));await aligned(indicator,next);
});
