import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';
for(const [slug,title] of [['year-picker','YearPicker'],['date-picker','DatePicker'],['date-range-picker','DateRangePicker'],['date-range-selector','DateRangeSelector'],['calendar','Calendar']])test(`${title}: four-column scroll default and explicit pagination`,async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto(`/docs/components/${slug}`);
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]');
 const popup=slug==='date-picker'||slug==='date-range-picker';
 if(popup)await preview.getByRole('button',{name:'Choose Course schedule',exact:true}).click();
 const host=popup?page.getByRole('dialog',{name:'Course schedule',exact:true}):preview;
 await host.scrollIntoViewIfNeeded();
 const before=(await host.boundingBox())!;
 if(slug!=='year-picker')await host.getByRole('button',{name:'Choose year, 2026',exact:true}).first().click();
 const scroll=host.locator('[data-sgui-part="year-scroll"]');await expect(scroll).toBeVisible();
 if(slug!=='year-picker'){
  const view=host.locator('[data-sgui-part="calendar-period-view"]');
  await expect.poll(async()=>{const a=(await scroll.boundingBox())!,b=(await view.boundingBox())!;return Math.abs(a.height-b.height)+Math.abs(a.y-b.y);}).toBeLessThan(2);
  if(slug==='date-range-picker'||slug==='date-range-selector'){
   const frame=host.locator('[data-sgui-part="date-range-selector"]');
   const a=(await scroll.boundingBox())!,b=(await frame.boundingBox())!;expect(Math.abs(a.y+a.height-b.y-b.height)).toBeLessThan(2);
  }
 }

 await expect(host.getByRole('button',{name:'Previous years',exact:true})).toHaveCount(0);await expect(host.getByRole('button',{name:'Next years',exact:true})).toHaveCount(0);
 expect(await scroll.locator(':scope > div').evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(4);
 if(slug!=='year-picker'){expect(Math.abs((await host.boundingBox())!.height-before.height)).toBeLessThan(1);const view=host.locator('[data-sgui-part="calendar-period-view"]');expect(await view.evaluate(element=>element.scrollHeight<=element.clientHeight+1)).toBe(true);}
 const selected=scroll.getByRole('button',{name:'2026',exact:true});await expect(selected).toBeInViewport();await host.screenshot({path:`/tmp/year-scroll-${slug}.png`});await selected.focus();await selected.press('Home');await expect.poll(()=>scroll.evaluate(element=>element.scrollTop)).toBeLessThan(5);
 await page.keyboard.press('End');await expect.poll(()=>scroll.evaluate(element=>element.scrollTop)).toBeGreaterThan(0);await expect.poll(()=>scroll.evaluate(element=>{const button=document.activeElement;if(!button||!element.contains(button))return false;const a=button.getBoundingClientRect(),b=element.getBoundingClientRect();return a.top>=b.top&&a.bottom<=b.bottom+1;})).toBe(true);
 await scroll.getByRole('button',{name:'2028',exact:true}).scrollIntoViewIfNeeded();await scroll.getByRole('button',{name:'2028',exact:true}).click();
 if(slug!=='year-picker'){await expect(scroll).toHaveCount(0);await expect(host.getByRole('button',{name:'Choose year, 2028',exact:true}).first()).toBeFocused();if(popup)await page.keyboard.press('Escape');}
 await panel.getByRole('button',{name:slug==='year-picker'?'Year navigation':'Period year navigation',exact:false}).click();await page.getByRole('option',{name:'Pages',exact:true}).click();
 if(popup)await preview.getByRole('button',{name:'Choose Course schedule',exact:true}).click();
 if(slug!=='year-picker')await host.getByRole('button',{name:/Choose year,/}).first().click();
 await expect(host.locator('[data-sgui-part="year-scroll"]')).toHaveCount(0);await expect(host.getByRole('button',{name:'Previous years',exact:true})).toHaveCount(1);await expect(host.getByRole('button',{name:'Next years',exact:true})).toHaveCount(1);
 if(popup){await page.keyboard.press('Escape');await page.keyboard.press('Escape');}
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('yearNavigation');expect(source).toContain('paged');expect(checkSources([{slug,source}])).toEqual([]);
});

test('Calendar: independent month/year changes keep sibling views and selection intact',async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/calendar');
 const panel=page.getByRole('region',{name:exampleName('Three-month calendar'),exact:true});
 const views=panel.locator('[data-docs-preview]').getByRole('application');
 const first=views.nth(1),second=views.nth(2),third=views.nth(3);
 await second.getByRole('button',{name:'Choose month, November',exact:true}).click();await second.getByRole('button',{name:'May',exact:true}).click();
 await expect(first.getByRole('button',{name:'Choose month, October',exact:true})).toBeVisible();await expect(third.getByRole('button',{name:'Choose month, December',exact:true})).toBeVisible();
 await third.getByRole('button',{name:'Choose year, 2026',exact:true}).click();await third.getByRole('button',{name:'2028',exact:true}).scrollIntoViewIfNeeded();await third.getByRole('button',{name:'2028',exact:true}).click();
 await expect(second.getByRole('button',{name:'Choose month, May',exact:true})).toBeVisible();await expect(second.getByRole('button',{name:'Choose year, 2026',exact:true})).toBeVisible();await expect(first.getByRole('button',{name:/Wednesday, October 14, 2026 selected/})).toBeVisible();
 await panel.getByRole('button',{name:'Show source: Three-month calendar',exact:true}).click();expect(checkSources([{slug:'calendar',source:(await panel.getByRole('code').textContent())!}])).toEqual([]);
});
