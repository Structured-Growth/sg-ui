import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';
import {waitForNativeScrollToSettle} from '../../../packages/ui/tests/browser/native-scroll-settling';

test('birthday supports a year jump, leap day, direct input and narrow popup',async({page},info)=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/date-picker');
 const panel=page.getByRole('region',{name:exampleName('Birthday with month and year jumps'),exact:true});
 const field=panel.getByRole('textbox',{name:'Select your birthday',exact:true}),trigger=panel.getByRole('button',{name:'Choose Select your birthday',exact:true});
 await expect(field).toHaveValue('');await trigger.click();
 const dialog=page.getByRole('dialog',{name:'Select your birthday',exact:true});
 await dialog.getByRole('button',{name:'Choose year, 2000',exact:true}).click();
 const chooser=dialog.getByRole('group',{name:'Choose year',exact:true});
 await expect(chooser.getByRole('button',{name:'Previous years',exact:true})).toHaveCount(0);
 await expect(chooser.locator('[data-sgui-part="year-scroll"]')).toBeVisible();
 await chooser.getByRole('button',{name:'2000',exact:true}).press('Home');
 await expect(chooser.getByRole('button',{name:'1900',exact:true})).toBeFocused();
 await expect(chooser.getByRole('button',{name:'2027',exact:true})).toHaveCount(0);
 await chooser.getByRole('button',{name:'1984',exact:true}).scrollIntoViewIfNeeded();
 await chooser.getByRole('button',{name:'1984',exact:true}).click();await expect(field).toHaveValue('');
 await dialog.getByRole('button',{name:'Choose month, January',exact:true}).click();await dialog.getByRole('group',{name:'Choose month',exact:true}).getByRole('button',{name:'February',exact:true}).click();
 const monthBox=(await dialog.getByRole('button',{name:'Choose month, February',exact:true}).boundingBox())!;
 for(const name of ['Previous month','Next month']){
  const arrow=(await dialog.getByRole('button',{name,exact:true}).boundingBox())!;
  expect(Math.abs(arrow.y+arrow.height/2-monthBox.y-monthBox.height/2)).toBeLessThan(1);
 }
 await page.setViewportSize({width:375,height:850});
 await expect.poll(async()=>{const b=(await dialog.boundingBox())!;return b.x>=0 && b.x+b.width<=375 && b.y>=0 && b.y+b.height<=page.viewportSize()!.height;}).toBe(true);
 await waitForNativeScrollToSettle(dialog);
 const box=(await dialog.boundingBox())!;expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(375);
 await info.attach('birthday-page',{body:await page.screenshot({path:info.outputPath('page.png')}),contentType:'image/png'});
 await info.attach('birthday-year-selection',{body:await dialog.screenshot({path:info.outputPath('birthday.png'),animations:'disabled'}),contentType:'image/png'});
 await dialog.getByRole('button',{name:'Wednesday, February 29, 1984',exact:true}).click();
 await expect(field).toHaveValue('02/29/1984');await expect(trigger).toBeFocused();
 await field.fill('May 21, 1972');await field.press('Tab');await expect(field).toHaveValue('05/21/1972');
 await panel.getByRole('button',{name:'Show source: Birthday with month and year jumps',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('1972-05-21');expect(checkSources([{slug:'birthday',source}])).toEqual([]);
});

for(const cycle of [12,24])test(`date/time ${cycle}: popup drafts, partial time guard and atomic Apply`,async({page},info)=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/date-picker');
 const title=`Date and time — ${cycle}-hour`,panel=page.getByRole('region',{name:exampleName(title),exact:true});
 const input=panel.locator('input[name="appointment"]'),trigger=panel.getByRole('button',{name:'Choose Appointment date and time',exact:true});
 await trigger.click();
 const dialog=page.getByRole('dialog',{name:'Appointment date and time',exact:true}),apply=dialog.getByRole('button',{name:'Apply',exact:true});
 const beforePeriod=(await dialog.boundingBox())!;await dialog.getByRole('button',{name:'Choose month, October',exact:true}).click();
 await expect(page.getByRole('dialog')).toHaveCount(1);await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toHaveCount(0);await expect(dialog.getByRole('textbox',{name:'Time',exact:true})).toHaveCount(0);
 expect(Math.abs((await dialog.boundingBox())!.height-beforePeriod.height)).toBeLessThan(1);await dialog.getByRole('group',{name:'Choose month',exact:true}).getByRole('button',{name:'October',exact:true}).press('Escape');
 await dialog.getByRole('button',{name:'Tuesday, October 20, 2026',exact:true}).click();
 await expect(input).toHaveValue('2026-10-14T09:30:00');
 await dialog.getByRole('textbox',{name:'Time',exact:true}).fill('8:31 am');await dialog.getByRole('textbox',{name:'Time',exact:true}).press('Tab');
 await dialog.getByRole('button',{name:'Cancel',exact:true}).click();await expect(input).toHaveValue('2026-10-14T09:30:00');
 await trigger.click();await dialog.getByRole('button',{name:'Tuesday, October 20, 2026',exact:true}).click();
 await dialog.getByRole('textbox',{name:'Time',exact:true}).fill('8:31 am');await dialog.getByRole('textbox',{name:'Time',exact:true}).press('Tab');
 await dialog.getByRole('textbox',{name:'Time',exact:true}).fill('8:');
 await expect(apply).toBeDisabled();
 await dialog.getByRole('textbox',{name:'Time',exact:true}).fill('8:31 am');await dialog.getByRole('textbox',{name:'Time',exact:true}).press('Tab');await expect(apply).toBeEnabled();
 await dialog.getByRole('button',{name:'Choose Time',exact:true}).click();
 const clock=page.getByRole('dialog',{name:'Time',exact:true});
 if(cycle===12)await expect(clock.getByRole('button',{name:/AM\/PM/})).toBeVisible();
 await clock.getByRole('button',{name:'Cancel',exact:true}).click();
 await page.setViewportSize({width:375,height:900});
 await expect.poll(async()=>{const b=(await dialog.boundingBox())!;return b.x>=0 && b.x+b.width<=375 && b.y>=0 && b.y+b.height<=page.viewportSize()!.height;}).toBe(true);
 await waitForNativeScrollToSettle(dialog);
 const box=(await dialog.boundingBox())!;expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(375);
 await info.attach('date-time',{body:await dialog.screenshot({path:info.outputPath('date-time.png'),animations:'disabled'}),contentType:'image/png'});
 await apply.click();await expect(input).toHaveValue('2026-10-20T08:31:00');await expect(trigger).toBeFocused();
 await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('2026-10-20T08:31:00');expect(checkSources([{slug:`datetime-${cycle}`,source}])).toEqual([]);
 if(cycle===24){
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  const toggle=playground.getByRole('checkbox',{name:'Include time segments',exact:true});await toggle.focus();await toggle.press('Space');
  await expect(playground.locator('input[name="schedule"]')).toHaveValue('2026-10-14T09:30:00');
  await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  const configured=(await playground.getByRole('code').textContent())!;expect(configured).toContain('kind="datetime"');
  expect(checkSources([{slug:'datetime-playground',source:configured}])).toEqual([]);
  await expect(panel.getByRole('code')).toHaveText(source);
 }

});

test('range month/year navigation changes view without committing the draft',async({page})=>{
 await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await panel.getByRole('button',{name:/Calendar navigation/}).click();await page.getByRole('option',{name:'Month and year dropdowns',exact:true}).click();
 const trigger=panel.getByRole('button',{name:'Choose Course schedule',exact:true});const before=await trigger.textContent();
 await trigger.click();const dialog=page.getByRole('dialog',{name:'Course schedule',exact:true});
 await dialog.getByRole('button',{name:/year$/i}).click();await page.getByRole('option',{name:'1984',exact:true}).click();
 await expect(dialog.getByRole('grid')).toHaveAttribute('aria-label',/1984/);
 await dialog.getByRole('button',{name:'Cancel',exact:true}).click();await expect(trigger).toHaveText(before!);
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('navigation="month-year"');expect(checkSources([{slug:'range-year',source}])).toEqual([]);
});
