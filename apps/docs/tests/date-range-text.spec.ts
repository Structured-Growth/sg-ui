import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('range textbox: normalized dates, relative weeks, calendar transaction and isolated source',async({page},info)=>{
 await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Type a range or a relative period'),exact:true});
 const input=panel.getByRole('textbox',{name:'Reporting period',exact:true}),trigger=panel.getByRole('button',{name:'Choose Reporting period',exact:true});
 const sibling=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}).locator('[data-docs-preview]').getByRole('textbox',{name:'Course schedule',exact:true});
 const initial=await sibling.inputValue();
 await input.fill('1/1/2026 - 1/3/26');await input.press('Enter');await expect(input).toHaveValue('01/01/2026 – 01/03/2026');
 await trigger.click();await expect(page.getByRole('dialog',{name:'Reporting period',exact:true}).getByRole('grid')).toHaveAttribute('aria-label',/January 2026/);await page.keyboard.press('Escape');
 await input.fill('today - a week from today');await input.press('Enter');await expect(input).toHaveValue('10/16/2026 – 10/23/2026');
 await input.fill('last week');await input.press('Tab');await expect(input).toHaveValue('10/05/2026 – 10/11/2026');
 await trigger.click();const dialog=page.getByRole('dialog',{name:'Reporting period',exact:true});
 await expect(dialog.getByRole('textbox',{name:'Start date',exact:true})).toHaveValue('10/05/2026');
 await dialog.getByRole('textbox',{name:'End date',exact:true}).fill('10/13/26');await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
 await expect(input).toHaveValue('10/05/2026 – 10/11/2026');await expect(trigger).toBeFocused();
 await trigger.click();await dialog.getByRole('textbox',{name:'End date',exact:true}).fill('10/13/26');await dialog.getByRole('button',{name:'Apply',exact:true}).click();
 await expect(input).toHaveValue('10/05/2026 – 10/13/2026');
 await input.fill('1/3/26 - 1/1/26');await input.press('Enter');await expect(input).toHaveAttribute('aria-invalid','true');await expect(input).toHaveValue('1/3/26 - 1/1/26');
 await panel.getByRole('button',{name:'Show source: Type a range or a relative period',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('2026-10-13');expect(checkSources([{slug:'range-text',source}])).toEqual([]);
 await expect(sibling).toHaveValue(initial);
 await input.fill('last month');await input.press('Enter');await expect(input).toHaveValue('09/01/2026 – 09/30/2026');
 await info.attach('range-text',{body:await panel.locator('[data-docs-preview]').screenshot({path:info.outputPath('range-text.png')}),contentType:'image/png'});
});

test('range field playground: week policy, bounds, native submission and button alternative',async({page})=>{
 await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]'),input=preview.getByRole('textbox',{name:'Course schedule',exact:true});
 await panel.getByRole('button',{name:/First weekday/}).click();await page.getByRole('option',{name:'Sunday',exact:true}).click();
 await input.fill('last week');await input.press('Enter');await expect(input).toHaveValue('10/04/2026 – 10/10/2026');
 await panel.getByRole('textbox',{name:'Relative reference date',exact:true}).fill('2026-10-23');await expect(input).toHaveValue('10/04/2026 – 10/10/2026');
 await input.fill('last week');await input.press('Enter');await expect(input).toHaveValue('10/11/2026 – 10/17/2026');
 const bounds=panel.getByRole('checkbox',{name:'Limit to October 2026',exact:true});await bounds.focus();await bounds.press('Space');await expect(bounds).toBeChecked();await input.fill('last year');await input.press('Tab');await expect(input).toHaveAttribute('aria-invalid','true');
 await panel.getByRole('button',{name:/Range field/}).click();await page.getByRole('option',{name:'Selection button',exact:true}).click();await expect(input).toHaveCount(0);
 await expect(preview.getByRole('button',{name:'Choose Course schedule',exact:true})).toContainText('10/11/2026 – 10/17/2026');
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('fieldMode="button"');expect(checkSources([{slug:'range-button',source}])).toEqual([]);
 const form=page.getByRole('region',{name:exampleName('Controlled host flow'),exact:true}),formInput=form.getByRole('textbox',{name:'Course schedule',exact:true});
 await formInput.fill('nonsense');await form.getByRole('button',{name:'Submit schedule locally',exact:true}).click();await expect(form.getByRole('status')).toContainText('Submitted 0 times');
 await formInput.fill('1/1/26 - 1/3/26');await form.getByRole('button',{name:'Submit schedule locally',exact:true}).click();await expect(form.getByRole('status')).toContainText('Submitted 1 times');
});
