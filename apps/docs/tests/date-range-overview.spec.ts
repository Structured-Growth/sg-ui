import {test,expect} from '@playwright/test';

for(const width of [1440,375])test(`range selector overview expands to its content at ${width}px`,async({page},info)=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/docs/components/date-range-selector');
  const preview=page.getByRole('region',{name:'DateRangeSelector at a glance',exact:true});
  await expect(preview.getByRole('grid')).toHaveCount(1);
  await expect(preview.getByRole('button',{name:'Apply',exact:true})).toBeAttached();
  const dimensions=await preview.evaluate(element=>{
    const component=element.querySelector('[data-sgui-part="date-range-selector"]')!;
    const box=element.getBoundingClientRect(),content=component.getBoundingClientRect();
    return {height:element.clientHeight,scrollHeight:element.scrollHeight,bottom:box.bottom,contentBottom:content.bottom,maxBlockSize:getComputedStyle(element).maxBlockSize};
  });
  expect(dimensions.maxBlockSize).toBe('none');
  expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.height+1);
  expect(dimensions.contentBottom).toBeLessThanOrEqual(dimensions.bottom);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const main=page.locator('main#main-content');
  expect(await main.evaluate(element=>element.scrollHeight>element.clientHeight)).toBe(true);
  await preview.getByRole('button',{name:'Apply',exact:true}).scrollIntoViewIfNeeded();
  await expect(preview.getByRole('button',{name:'Apply',exact:true})).toBeInViewport();
  expect(await preview.evaluate(element=>element.scrollTop)).toBe(0);
  await info.attach('range-overview-actions',{body:await page.screenshot({path:info.outputPath('range-overview.png')}),contentType:'image/png'});
});
