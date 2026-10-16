import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {openSiteTool,closeSiteTool} from './site-tools';

for(const [density,appearance] of [['Compact','Light'],['Comfortable','Dark']] as const)test(`Material rounded fields: ${density}, ${appearance}`,async({page},info)=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/date-picker');
 await openSiteTool(page,'Demo settings');
 await page.getByRole('button',{name:/Demo theme/}).click();await page.getByRole('option',{name:'Material Design',exact:true}).click();
 await page.getByRole('button',{name:/Demo appearance/}).click();await page.getByRole('option',{name:appearance,exact:true}).click();await closeSiteTool(page);
 for(const slug of ['date-picker','date-range-picker','time-field','text-field','select']){
  if(slug!=='date-picker')await page.goto(`/docs/components/${slug}`);
  const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]');
  await expect(preview).toHaveAttribute('data-demo-identity','material');
  await panel.getByRole('button',{name:/Example density/}).click();await page.getByRole('option',{name:density,exact:true}).click();
  const control=slug==='select'?preview.getByRole('button').first():preview.getByRole('textbox').first();
  await expect(control).toHaveCSS('border-top-left-radius','24px');
  expect((await control.boundingBox())!.height).toBe(density==='Compact'?32:44);
  if(slug==='date-picker'||slug==='time-field'||slug==='date-range-picker'){
   const group=preview.locator(slug==='date-range-picker'?'[data-sgui-part="date-range-field-control-group"]':`[data-sgui-part="${slug==='date-picker'?'date':'time'}-field-control-group"]`),button=group.getByRole('button');
   await expect(control).toHaveCSS('border-top-right-radius','0px');await expect(button).toHaveCSS('border-top-left-radius','0px');await expect(button).toHaveCSS('border-top-right-radius','24px');
   const a=(await control.boundingBox())!,b=(await button.boundingBox())!,icon=(await button.locator('svg').boundingBox())!;
   expect(a.y).toBeCloseTo(b.y,0);expect(a.height).toBeCloseTo(b.height,0);expect(a.x+a.width).toBeCloseTo(b.x,0);
   expect(b.x+b.width-icon.x-icon.width).toBeGreaterThanOrEqual(a.height/2-1);
   await control.focus();await control.press('Tab');await expect(button).toBeFocused();
   await info.attach(slug,{body:await preview.screenshot({path:info.outputPath(`${slug}.png`)}),contentType:'image/png'});
   if(slug==='date-picker'){
    await panel.getByRole('button',{name:/Calendar navigation/}).click();await page.getByRole('option',{name:'Month and year dropdowns',exact:true}).click();
    await button.click();const dialog=page.getByRole('dialog',{name:'Course schedule',exact:true});
    const year=dialog.getByRole('button',{name:'2026 year',exact:true});
    expect(await year.getByText('2026',{exact:true}).evaluate(element=>element.scrollWidth<=element.clientWidth)).toBe(true);
    await year.click();await page.getByRole('option',{name:'1984',exact:true}).click();await expect(dialog.getByRole('grid')).toHaveAttribute('aria-label',/1984/);
    await page.keyboard.press('Escape');await expect(button).toBeFocused();
    await preview.evaluate(element=>element.setAttribute('dir','rtl'));
    await expect(control).toHaveCSS('border-top-left-radius','0px');await expect(control).toHaveCSS('border-top-right-radius','24px');await expect(button).toHaveCSS('border-top-left-radius','24px');
   }
  }else{
   await expect(control).toHaveCSS('border-top-right-radius','24px');

  }
 }
});
