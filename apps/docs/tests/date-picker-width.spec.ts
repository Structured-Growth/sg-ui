import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

for(const slug of ['date-picker','date-range-picker'])test(`${slug}: examples fit their controls and remain responsive`,async({page},info)=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto(`/docs/components/${slug}`);
 const names=['Prop playground','Compact density','Comfortable density','Controlled host flow'];
 for(const name of names){
  const panel=page.getByRole('region',{name:exampleName(name),exact:true}),preview=panel.locator('[data-docs-preview]');await preview.scrollIntoViewIfNeeded();
  const control=slug==='date-picker'?preview.locator('[data-sgui-part="date-field-control-group"]'):preview.locator('[data-sgui-part="date-range-field-control-group"]');
  const box=(await control.boundingBox())!,host=(await preview.boundingBox())!;
  expect(box.width).toBeLessThan(450);expect(box.width).toBeLessThan(host.width*.6);
  await panel.getByRole('button',{name:`Show source: ${name}`,exact:true}).click();const source=(await panel.getByRole('code').textContent())!;
  expect(source).toContain('align="start"');expect(checkSources([{slug,source}])).toEqual([]);
 }
 const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await info.attach('content-sized-picker',{body:await playground.screenshot({path:info.outputPath('picker.png')}),contentType:'image/png'});
 const trigger=playground.getByRole('button',{name:'Choose Course schedule',exact:true});await trigger.click();await expect(page.getByRole('dialog',{name:'Course schedule',exact:true})).toBeVisible();await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
 await page.setViewportSize({width:375,height:900});await playground.scrollIntoViewIfNeeded();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const preview=playground.locator('[data-docs-preview]');const control=slug==='date-picker'?preview.locator('[data-sgui-part="date-field-control-group"]'):preview.locator('[data-sgui-part="date-range-field-control-group"]');
 const box=(await control.boundingBox())!,host=(await preview.boundingBox())!;expect(box.width).toBeLessThanOrEqual(host.width);
});
