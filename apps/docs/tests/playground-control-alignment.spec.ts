import {expect, test} from './fixtures';

for (const width of [1280,600,375]) for (const hasTouch of [false,true]) test(`playground checkboxes align with adjacent input boxes at ${width}px (touch=${hasTouch})`,async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,viewport:{width,height:1100},hasTouch});
  const page=await context.newPage();
  await page.goto('/docs/components/button');
  const controls=page.getByRole('region',{name:'Prop playground',exact:true}).locator('[data-docs-controls]');
  const checkbox=controls.getByRole('checkbox',{name:'disabled',exact:true});
  const label=checkbox.locator('xpath=ancestor::label[1]');
  await expect(label).toBeVisible();
  const metrics=await controls.evaluate(element=>{
    const checkbox=element.querySelector('input[type="checkbox"]')!.closest('label')!;
    const rect=checkbox.getBoundingClientRect();
    const row=checkbox.parentElement!;
    const adjacent=Array.from(row.children).filter(child=>child!==checkbox).flatMap(child=>Array.from(child.querySelectorAll('button,input:not([type="checkbox"])'))).map(el=>el.getBoundingClientRect()).filter(other=>other.bottom>rect.top&&other.top<rect.bottom);
    return {height:rect.height,center:rect.top+rect.height/2,others:adjacent.map(rect=>({center:rect.top+rect.height/2,height:rect.height}))};
  });
  expect(metrics.height).toBe(hasTouch?44:32);
  for(const other of metrics.others) {
    expect(Math.abs(other.center-metrics.center)).toBeLessThanOrEqual(0.5);
    expect(other.height).toBe(metrics.height);
  }
  if(width===1280)expect(metrics.others.length).toBeGreaterThan(0);
  await checkbox.locator('xpath=ancestor::label[1]').click();
  await expect(checkbox).toBeChecked();
  await expect(page.getByRole('region',{name:'Prop playground',exact:true}).locator('[data-docs-preview]').getByRole('button',{name:'Publish course',exact:true})).toBeDisabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`/tmp/sgui-playground-control-alignment-${width}-${hasTouch}.png`});
  await context.close();
});
