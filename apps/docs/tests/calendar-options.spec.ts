import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';
import {waitForNativeScrollToSettle} from '../../../packages/ui/tests/browser/native-scroll-settling';

test('Calendar navigation, compact footprints, stable months and centered days',async({page},info)=>{
  await page.setViewportSize({width:1440,height:1100});
  await page.goto('/installation');
  const navigation=page.getByRole('navigation',{name:'Documentation',exact:true});
  await navigation.getByRole('button',{name:'Calendar',exact:true}).click();
  await navigation.getByRole('link',{name:'Calendar',exact:true}).click();
  await expect(page).toHaveURL(/\/docs\/components\/calendar$/);
  for(const density of ['Compact','Comfortable']){
    const panel=page.getByRole('region',{name:exampleName(`${density} calendar footprint`),exact:true});
    await panel.scrollIntoViewIfNeeded();
    const calendar=panel.getByRole('application');
    const grid=panel.getByRole('grid');
    const viewport=grid.locator('..');
    const initial=(await viewport.boundingBox())!;
    const target=density==='Compact'?32:44;
    expect(initial.width).toBeCloseTo(7*target,0);
    const day=await grid.locator('[data-selected]').first().boundingBox();
    expect(day!.width).toBeCloseTo(target,0);expect(day!.height).toBeCloseTo(target,0);
    const center=await grid.locator('[data-selected]').first().evaluate(element=>{
      const box=element.getBoundingClientRect(),label=element.querySelector('span')!.getBoundingClientRect();
      return Math.abs((box.top+box.bottom-label.top-label.bottom)/2);
    });
    expect(center).toBeLessThan(1);
    const heights:number[]=[];
    for(let month=0;month<12;month++){
      heights.push((await viewport.boundingBox())!.height);
      await calendar.getByRole('button',{name:'Next month',exact:true}).click();
    }
    expect(Math.max(...heights)-Math.min(...heights)).toBeLessThan(1);
    await info.attach(`${density}-calendar`,{body:await panel.screenshot({path:info.outputPath(`${density}-calendar.png`)}),contentType:'image/png'});
  }
});

test('date dropdown normalizes text, selects from calendar and keeps sibling examples isolated',async({page},info)=>{
  await page.goto('/docs/components/calendar');
  const panel=page.getByRole('region',{name:exampleName('Type a date or open the calendar'),exact:true});
  await panel.scrollIntoViewIfNeeded();
  const sibling=page.getByRole('region',{name:exampleName('Compact calendar footprint'),exact:true});
  await sibling.getByRole('button',{name:'Show source: Compact calendar footprint',exact:true}).click();
  const before=await sibling.getByRole('code').textContent();
  const input=panel.getByRole('textbox',{name:'Appointment date',exact:true});
  await input.fill('1/1/26');await input.press('Tab');await expect(input).toHaveValue('01/01/2026');
  await input.fill('Oct 17, 2026');await input.press('Tab');await expect(input).toHaveValue('10/17/2026');
  await panel.getByRole('button',{name:'Choose Appointment date',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Appointment date',exact:true});
  await dialog.getByRole('button',{name:'Tuesday, October 20, 2026',exact:true}).click();
  await expect(dialog).toHaveCount(0);await expect(input).toHaveValue('10/20/2026');
  await panel.getByRole('button',{name:'Show source: Type a date or open the calendar',exact:true}).click();
  const source=await panel.getByRole('code').textContent();expect(source).toContain('2026-10-20');
  expect(checkSources([{slug:'calendar-dropdown',source:source!}])).toEqual([]);
  expect(await sibling.getByRole('code').textContent()).toBe(before);
  await info.attach('date-dropdown',{body:await panel.screenshot({path:info.outputPath('calendar-panel.png')}),contentType:'image/png'});
});

for(const months of [1,2])test(`range dropdown with ${months} calendars supports typed and picked endpoints`,async({page},info)=>{
  await page.setViewportSize({width:1440,height:1100});
  await page.goto('/docs/components/date-range-picker');
  const title=`Range dropdown with ${months===1?'one calendar':'two calendars'}`;
  const panel=page.getByRole('region',{name:exampleName(title),exact:true});
  await panel.scrollIntoViewIfNeeded();
  const trigger=panel.getByRole('button',{name:'Choose Travel dates',exact:true});
  await trigger.click();
  const dialog=page.getByRole('dialog',{name:'Travel dates',exact:true});
  await expect(dialog.getByRole('grid')).toHaveCount(months);
  const start=dialog.getByRole('textbox',{name:'Start date',exact:true});
  const end=dialog.getByRole('textbox',{name:'End date',exact:true});
  expect((await start.boundingBox())!.y).toBeLessThan((await dialog.getByRole('grid').first().boundingBox())!.y);
  await start.fill('Feb 30, 2026');await start.press('Tab');await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeDisabled();
  await start.fill('Oct 13, 2026');await start.press('Tab');await end.fill('2026/10/17');await end.press('Tab');
  await expect(start).toHaveValue('10/13/2026');await expect(end).toHaveValue('10/17/2026');
  await waitForNativeScrollToSettle(dialog);
  const beforeSelection=(await dialog.boundingBox())!;
  await dialog.getByRole('button',{name:/Monday, October 19, 2026/}).first().click();
  await expect(start).toHaveValue('10/13/2026');await expect(end).toHaveValue('10/19/2026');
  await waitForNativeScrollToSettle(dialog);
  const duringSelection=(await dialog.boundingBox())!;
  expect(duringSelection.y).toBeCloseTo(beforeSelection.y,0);expect(duringSelection.height).toBeCloseTo(beforeSelection.height,0);
  await dialog.getByRole('button',{name:/Thursday, October 22, 2026/}).first().click();
  await expect(start).toHaveValue('10/13/2026');await expect(end).toHaveValue('10/22/2026');
  const grids=await dialog.getByRole('grid').evaluateAll(elements=>elements.map(element=>{const r=element.getBoundingClientRect();return{x:r.x,y:r.y};}));
  if(months===2){expect(Math.abs(grids[0].y-grids[1].y)).toBeLessThan(1);expect(grids[1].x).toBeGreaterThan(grids[0].x);}
  await info.attach(`range-${months}-dropdown`,{body:await dialog.screenshot({path:info.outputPath('range-popup.png')}),contentType:'image/png'});
  await dialog.getByRole('button',{name:'Apply',exact:true}).click();await expect(panel.getByRole('textbox',{name:'Travel dates',exact:true})).toHaveValue('10/13/2026 – 10/22/2026');
  await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();
  const source=await panel.getByRole('code').textContent();expect(source).toContain('2026-10-22');expect(checkSources([{slug:`range-${months}`,source:source!}])).toEqual([]);
  await trigger.click();await page.setViewportSize({width:375,height:900});
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const bounds=(await dialog.boundingBox())!;expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(375);
  await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
});
