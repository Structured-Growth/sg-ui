import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';

for(const [slug,name] of [['date-range-selector','DateRangeSelector'],['date-range-picker','DateRangePicker']])test(`${name} defaults omit presets and keep them opt-in`,async({page})=>{
  await page.goto(`/docs/components/${slug}`);
  const overview=page.getByRole('region',{name:`${name} at a glance`,exact:true});
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  await expect(playground.getByRole('checkbox',{name:'Show presets',exact:true})).not.toBeChecked();
  if(name==='DateRangePicker')await overview.getByRole('button',{name:'Choose Course schedule',exact:true}).click();
  const overviewCalendar=name==='DateRangePicker'?page.getByRole('dialog'):overview;
  await expect(overviewCalendar.getByRole('grid')).toHaveCount(1);
  await expect(overviewCalendar.getByRole('listbox',{name:'Date presets',exact:true})).toHaveCount(0);
  await expect(playground.getByRole('listbox',{name:'Date presets',exact:true})).toHaveCount(0);
  if(name==='DateRangePicker')await page.keyboard.press('Escape');
  const showPresets=playground.getByRole('checkbox',{name:'Show presets',exact:true});
  await showPresets.focus();await showPresets.press('Space');
  if(name==='DateRangePicker')await playground.getByRole('button',{name:'Choose Course schedule',exact:true}).click();
  const presets=(name==='DateRangePicker'?page.getByRole('dialog'):playground).getByRole('listbox',{name:'Date presets',exact:true});
  await expect(presets).toHaveCount(1);
  for(const label of ['This week','Last week','This month','Last month'])await expect(presets.getByRole('option',{name:label,exact:true})).toBeVisible();
  if(name==='DateRangePicker')await page.keyboard.press('Escape');
  await expect(overview.getByRole('listbox',{name:'Date presets',exact:true})).toHaveCount(0);
  await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  await expect(playground.getByRole('code')).toContainText('this-week');
});

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
