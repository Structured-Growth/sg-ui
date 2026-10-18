import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

for(const density of ['Compact density','Comfortable density'])test(`date-picker dropdown fits its calendar with balanced padding: ${density}`,async({page},info)=>{
 await page.emulateMedia({colorScheme:'dark'});
 await page.setViewportSize({width:1440,height:1100});
 await page.goto('/docs/components/date-picker');
 const panel=page.getByRole('region',{name:exampleName(density),exact:true});
 for(const width of [1440,375]){
  await page.setViewportSize({width,height:1100});
  await panel.getByRole('button',{name:'Choose Course schedule',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Course schedule',exact:true});
  await expect(dialog.getByRole('grid')).toBeVisible();
  const dimensions=await dialog.evaluate(element=>{
   const box=element.getBoundingClientRect(),grid=element.querySelector('[role="grid"]')!.getBoundingClientRect(),style=getComputedStyle(element);
   return {left:grid.left-box.left,right:box.right-grid.right,paddingLeft:parseFloat(style.paddingLeft),paddingRight:parseFloat(style.paddingRight)};
  });
  expect(dimensions.left).toBeCloseTo(dimensions.paddingLeft,0);
  expect(dimensions.right).toBeCloseTo(dimensions.paddingRight,0);
  expect(Math.abs(dimensions.left-dimensions.right)).toBeLessThan(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await info.attach(`dropdown-${width}`,{body:await dialog.screenshot(),contentType:'image/png'});
  await page.keyboard.press('Escape');
 }
});

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
