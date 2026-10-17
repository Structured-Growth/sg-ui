import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';
for(const kind of ['date-range-picker','date-range-selector'])for(const density of ['compact','comfortable'])test(`${kind} shares month/year choices at ${density} density without committing`,async({page})=>{
 await page.goto(`/docs/components/${kind}`);
 const title=`Shared month/year — ${density}`,panel=page.getByRole('region',{name:exampleName(title),exact:true});
 if(kind==='date-range-picker')await panel.getByRole('button',{name:'Choose Travel dates',exact:true}).click();
 const host=kind==='date-range-picker'?page.getByRole('dialog',{name:'Travel dates',exact:true}):panel;
 const before=(await host.boundingBox())!;
 const first=host.getByRole('application',{name:/^Travel dates, calendar 1,/}),second=host.getByRole('application',{name:/^Travel dates, calendar 2,/});
 await host.getByRole('button',{name:'Choose month, October',exact:true}).click();
 const chooser=host.getByRole('group',{name:'Choose month',exact:true});
 await expect(chooser.getByRole('button')).toHaveCount(12);
 for(const name of ['Apply','Cancel','Clear'])await expect(host.getByRole('button',{name,exact:true})).toHaveCount(0);
 expect(Math.abs((await host.boundingBox())!.height-before.height)).toBeLessThan(1);expect(Math.abs((await host.boundingBox())!.width-before.width)).toBeLessThan(1);
 await host.screenshot({path:`/tmp/shared-range-month-${kind}-${density}.png`});
 await chooser.getByRole('button',{name:'December',exact:true}).click();
 await expect(host.getByRole('button',{name:'Choose month, December',exact:true})).toBeFocused();
 await expect(second.getByRole('button',{name:'Choose month, November',exact:true})).toBeVisible();
 await first.getByRole('button',{name:'Choose year, 2026',exact:true}).click();
 await host.screenshot({path:`/tmp/shared-range-year-${kind}-${density}.png`});
 await host.getByRole('group',{name:'Choose year',exact:true}).getByRole('button',{name:'2027',exact:true}).click();
 await expect(first.getByRole('button',{name:'Choose year, 2027',exact:true})).toBeFocused();
 await expect(second.getByRole('button',{name:'Choose year, 2026',exact:true})).toBeVisible();
 if(kind==='date-range-picker'){
  await expect(panel.getByRole('textbox',{name:'Travel dates',exact:true})).toHaveValue('10/07/2026 – 10/16/2026');
  await host.getByRole('button',{name:'Choose month, December',exact:true}).click();await host.getByRole('button',{name:'December',exact:true}).press('Escape');await expect(page.getByRole('dialog')).toHaveCount(1);
  await host.getByRole('button',{name:'Cancel',exact:true}).click();
 }
 await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('2026-10-07');expect(source).toContain('2026-10-16');expect(checkSources([{slug:kind,source}])).toEqual([]);
});
test('independent range calendars use endpoint restrictions, one chooser, and preserve narrow reflow',async({page})=>{
 await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Shared month/year — independent From and To'),exact:true});
 await panel.getByRole('button',{name:'Choose Travel dates',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Travel dates',exact:true});
 const from=dialog.getByRole('application',{name:/^Travel dates, Start date, calendar 1,/}),to=dialog.getByRole('application',{name:/^Travel dates, End date, calendar 2,/});
 await from.getByRole('button',{name:'Choose year, 2026'}).click();await expect(from.getByRole('button',{name:'2027',exact:true})).toBeDisabled();
 await to.getByRole('button',{name:'Choose year, 2026'}).click();await expect(dialog.locator('[data-sgui-part="calendar-period-view"]')).toHaveCount(1);
 await to.getByRole('button',{name:'2027',exact:true}).click();await expect(from.getByRole('button',{name:'Choose month, October'})).toBeVisible();await expect(to.getByRole('button',{name:'Choose month, November'})).toBeVisible();await expect(to.getByRole('button',{name:'Choose year, 2027'})).toBeFocused();
 await page.setViewportSize({width:375,height:900});
 await to.getByRole('button',{name:'Choose month, November'}).click();await expect(page.getByRole('dialog')).toHaveCount(1);const box=(await dialog.boundingBox())!;expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(375);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await to.getByRole('button',{name:'November',exact:true}).press('Escape');await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
 await expect(panel.getByRole('textbox',{name:'Travel dates',exact:true})).toHaveValue('10/07/2026 – 10/16/2026');
});
test('standalone shared pickers expose independent source-backed controls',async({page})=>{
 for(const slug of ['month-picker','year-picker']){
  await page.goto(`/docs/components/${slug}`);
  const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  if(slug==='month-picker')await panel.getByRole('button',{name:'May',exact:true}).click();else await panel.getByRole('button',{name:'2025',exact:true}).click();
  await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  const source=(await panel.getByRole('code').textContent())!;expect(checkSources([{slug,source}])).toEqual([]);
  expect(source).toContain(slug==='month-picker'?'useState<number|null>(5)':'useState<number|null>(2025)');
 }
});
