import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';
import {waitForNativeScrollToSettle} from '../../../packages/ui/tests/browser/native-scroll-settling';

for(const cycle of [12,24])test(`time textbox ${cycle}: shorthand, validation, dropdown transaction and source isolation`,async({page},info)=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/time-field');
 const title=`Type or select a time — ${cycle}-hour`,panel=page.getByRole('region',{name:exampleName(title),exact:true});
 const input=panel.getByRole('textbox',{name:'Appointment time',exact:true}),saved=panel.locator('input[name="appointmentTime"]');
 const sibling=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await sibling.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();const before=await sibling.getByRole('code').textContent();
 const group=panel.locator('[data-sgui-part="time-field-control-group"]');
 const a=(await input.boundingBox())!,b=(await group.getByRole('button',{name:'Choose Appointment time',exact:true}).boundingBox())!;
 expect(Math.abs(a.y-b.y)).toBeLessThan(1);expect(Math.abs(a.height-b.height)).toBeLessThan(1);expect(Math.abs(a.x+a.width-b.x)).toBeLessThan(1);
 await input.fill('1300');await input.press('Enter');await expect(saved).toHaveValue('13:00:00');await expect(input).toHaveValue(cycle===12?'1:00 PM':'13:00');
 await input.fill('315p');await input.press('Tab');await expect(saved).toHaveValue('15:15:00');await expect(input).toHaveValue(cycle===12?'3:15 PM':'15:15');
 await input.fill('1260');await input.press('Enter');await expect(input).toHaveAttribute('aria-invalid','true');await expect(saved).toHaveValue('15:15:00');
 await input.fill('8a');await input.press('Tab');await expect(saved).toHaveValue('08:00:00');
 await expect(input).toHaveValue(cycle===12?'8:00 AM':'08:00');
 await input.fill('8:99');await input.press('Tab');await expect(input).toHaveValue('8:99');await expect(saved).toHaveValue('08:00:00');
 expect(await input.evaluate((element:HTMLInputElement)=>element.checkValidity())).toBe(false);
 await input.fill('');await input.press('Tab');await expect(saved).toHaveValue('');
 await input.press('Alt+ArrowDown');const dialog=page.getByRole('dialog',{name:'Appointment time',exact:true});
 const choose=async(hour:string,minute:string,period='AM')=>{
  await dialog.getByRole('button',{name:/Hour/}).click();await page.getByRole('option',{name:hour,exact:true}).click();
  await dialog.getByRole('button',{name:/Minute/}).click();await page.getByRole('option',{name:minute,exact:true}).click();
  if(cycle===12){await dialog.getByRole('button',{name:/AM\/PM/}).click();await page.getByRole('option',{name:period,exact:true}).click();}
 };
 await choose('8','00');await expect(saved).toHaveValue('');
 await dialog.getByRole('button',{name:'Cancel',exact:true}).click();await expect(input).toHaveValue('');
 await panel.getByRole('button',{name:'Choose Appointment time',exact:true}).click();await choose('8','00');
 await dialog.getByRole('button',{name:'Apply',exact:true}).click();await expect(saved).toHaveValue('08:00:00');
 await expect(panel.getByRole('button',{name:'Choose Appointment time',exact:true})).toBeFocused();
 await panel.getByRole('button',{name:'Choose Appointment time',exact:true}).click();
 await choose(cycle===12?'7':'19','00',cycle===12?'PM':'AM');await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeDisabled();
 await page.setViewportSize({width:375,height:850});
 await expect.poll(async()=>{const b=(await dialog.boundingBox())!;return b.x>=0&&b.x+b.width<=375&&b.y>=0&&b.y+b.height<=850;}).toBe(true);
 await waitForNativeScrollToSettle(dialog);await info.attach('time-picker',{body:await dialog.screenshot({path:info.outputPath('time-picker.png')}),contentType:'image/png'});
 await page.keyboard.press('Escape');await expect(saved).toHaveValue('08:00:00');
 await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('08:00:00');expect(checkSources([{slug:`time-${cycle}`,source}])).toEqual([]);
 await expect(sibling.getByRole('code')).toHaveText(before!);
 if(cycle===24){
  await sibling.getByRole('button',{name:/Time entry/}).click();await page.getByRole('option',{name:'Time segments',exact:true}).click();
  await expect(sibling.locator('[data-docs-preview]').getByRole('spinbutton',{name:/hour/i})).toBeVisible();
  const configured=(await sibling.getByRole('code').textContent())!;expect(configured).toContain('entryMode="segments"');expect(checkSources([{slug:'time-segments',source:configured}])).toEqual([]);
  await expect(panel.getByRole('code')).toHaveText(source);
 }
});
