import {test,expect,type Locator} from './fixtures';
import {exampleName} from './example-name';
import {openSiteTool,closeSiteTool} from './site-tools';
async function inset(control:Locator,focus=true){
 if(focus)await control.focus();
 const ring=await control.evaluate(element=>{const css=getComputedStyle(element);return {width:parseFloat(css.outlineWidth),offset:parseFloat(css.outlineOffset),style:css.outlineStyle};});
 expect(ring.style).toBe('solid');expect(ring.width).toBeGreaterThanOrEqual(2);expect(ring.offset+ring.width).toBeLessThanOrEqual(0);
}
for(const theme of ['None — global defaults','Material Design','Apple Human Interface','Editorial'])test(`${theme}: field focus stays within control boundaries at both densities`,async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/date-range-picker');await openSiteTool(page,'Demo settings');
 await page.getByRole('button',{name:/Demo theme/}).click();await page.getByRole('option',{name:theme,exact:true}).click();await closeSiteTool(page);
 for(const slug of ['date-range-picker','date-picker','time-field','text-field','text-area','select','combo-box','search-field','async-multi-select','date-field']){
  if(slug!=='date-range-picker')await page.goto(`/docs/components/${slug}`);
  const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]');
  for(const density of ['Compact','Comfortable']){
   await panel.getByRole('button',{name:/Example density/}).click();await page.getByRole('option',{name:density,exact:true}).click();
   const control=slug==='select'?preview.getByRole('button').first():slug==='date-field'?preview.getByRole('spinbutton').first():preview.locator('input:not([type="hidden"]),textarea').first();
   await page.keyboard.press('Tab');await control.focus();
   // Decorated textboxes delegate their single ring to the complete decorated wrapper.
   const owner=await control.evaluate(element=>{const parent=element.parentElement!;return getComputedStyle(element).outlineStyle==='none'&&getComputedStyle(parent).outlineStyle==='solid';});
   if(owner)await inset(control.locator('..'),false);else await inset(control);
   if(slug==='date-range-picker'||slug==='date-picker'||slug==='time-field'){
    const action=preview.getByRole('button').first();await inset(action);
    if(slug==='date-range-picker'){await control.focus();await preview.screenshot({path:`/tmp/field-focus-${theme.split(' ')[0]}-${density}.png`});}
   }
  }
 }
});
test('inset focus remains visible in dark and forced colors',async({page})=>{
 await page.goto('/docs/components/date-range-picker');await openSiteTool(page,'Demo settings');
 await page.getByRole('button',{name:/Demo appearance/}).click();await page.getByRole('option',{name:'Dark',exact:true}).click();await closeSiteTool(page);
 const preview=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}).locator('[data-docs-preview]');
 const input=preview.getByRole('textbox').first();await inset(input);await page.emulateMedia({forcedColors:'active'});await inset(input);await inset(preview.getByRole('button').first());
});
