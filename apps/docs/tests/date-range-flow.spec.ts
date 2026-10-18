import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {waitForNativeScrollToSettle} from '../../../packages/ui/tests/browser/native-scroll-settling';

for(const months of [1,2])test(`bidirectional draft creation and default nearest-endpoint adjustment with ${months} calendars`,async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName(`Range dropdown with ${months===1?'one calendar':'two calendars'}`),exact:true});
 const trigger=panel.getByRole('button',{name:'Choose Travel dates',exact:true});await trigger.click();
 const dialog=page.getByRole('dialog',{name:'Travel dates',exact:true});
 const start=dialog.getByRole('textbox',{name:'Start date',exact:true}),end=dialog.getByRole('textbox',{name:'End date',exact:true});
 // Explicitly clear the draft to exercise creation, rather than adjusting the
 // supplied range under the later user-approved nearest-endpoint default.
 await dialog.getByRole('button',{name:'Clear',exact:true}).click();
 await expect(start).toHaveValue('');await expect(end).toHaveValue('');
 const first=dialog.getByRole('button',{name:/Saturday, October 10, 2026/}).first();
 if(months===2){await first.focus();await first.press('Enter');}else await first.click();
 await expect(start).toHaveValue('10/10/2026');await expect(end).toHaveValue('');
 const earlier=dialog.getByRole('button',{name:/Wednesday, October 7, 2026/}).first();
 if(months===2){await earlier.focus();await earlier.press('Enter');}else await earlier.click();
 await expect(start).toHaveValue('10/07/2026');await expect(end).toHaveValue('10/10/2026');
 await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeEnabled();
 await expect(panel.getByRole('textbox',{name:'Travel dates',exact:true})).toHaveValue('10/12/2026 – 10/16/2026');
 await dialog.getByRole('button',{name:/Thursday, October 22, 2026/}).first().click();
 await expect(end).toHaveValue('10/22/2026');await dialog.getByRole('button',{name:'Apply',exact:true}).click();
 await expect(panel.getByRole('textbox',{name:'Travel dates',exact:true})).toHaveValue('10/07/2026 – 10/22/2026');
});

test('range dropdown shifts within the viewport before scrolling',async({page},info)=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Range dropdown with one calendar'),exact:true});
 const trigger=panel.getByRole('button',{name:'Choose Travel dates',exact:true});
 await trigger.scrollIntoViewIfNeeded();
 await trigger.evaluate(element=>{const main=document.getElementById('main-content')!;main.scrollTop+=element.getBoundingClientRect().top-650;});
 await waitForNativeScrollToSettle(trigger);
 await trigger.click();const dialog=page.getByRole('dialog',{name:'Travel dates',exact:true});
 const overlay=dialog.locator('xpath=ancestor::*[@data-trigger="DialogTrigger"][1]');
 await expect.poll(()=>overlay.evaluate(element=>element.scrollHeight<=element.clientHeight+1)).toBe(true);
 const box=(await overlay.boundingBox())!,anchor=(await trigger.boundingBox())!;
 expect(box.y).toBeGreaterThanOrEqual(11);expect(box.y+box.height).toBeLessThanOrEqual(989);
 expect(box.y).toBeLessThan(anchor.y);
 await info.attach('calendar-shifted',{body:await page.screenshot({path:info.outputPath('calendar-shifted.png')}),contentType:'image/png'});
 await page.setViewportSize({width:1440,height:400});
 await expect.poll(()=>overlay.evaluate(element=>element.scrollHeight>element.clientHeight+1)).toBe(true);
 const small=(await overlay.boundingBox())!;expect(small.y).toBeGreaterThanOrEqual(11);expect(small.y+small.height).toBeLessThanOrEqual(389);
 await dialog.getByRole('button',{name:'Cancel',exact:true}).click();await expect(trigger).toBeFocused();
});
