import {test,expect} from './fixtures';
import {exampleName} from './example-name';
for(const [slug,label,valid,formatted] of [
 ['date-picker','Course schedule','dec 3 2026','12/03/2026'],
 ['date-range-picker','Course schedule','dec 3 2026 - dec 4 2026','12/03/2026 – 12/04/2026'],
 ['time-field','Course start time','315p','3:15 PM'],
] as const)test(`${slug}: typing is quiet, Enter and blur validate`,async({page})=>{
 await page.goto(`/docs/components/${slug}`);
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const preview=panel.locator('[data-docs-preview]');
 if(slug==='date-range-picker'){const fields=panel.getByRole('checkbox',{name:'Show endpoint fields',exact:true});await fields.focus();await fields.press('Space');}
 const input=preview.getByRole('textbox',{name:label,exact:true});
 await input.fill(slug==='time-field'?'pm':'dec');
 await expect(input).not.toHaveAttribute('aria-invalid','true');expect(await input.evaluate(e=>(e as HTMLInputElement).validity.valid)).toBe(false);
 await input.press('Enter');await expect(input).toHaveAttribute('aria-invalid','true');
 await input.press('Backspace');await expect(input).not.toHaveAttribute('aria-invalid','true');
 await input.press('Tab');await expect(input).toHaveAttribute('aria-invalid','true');
 await input.fill(valid);await expect(input).not.toHaveAttribute('aria-invalid','true');await input.press('Enter');
 if(slug==='time-field')await expect(input).toHaveValue(/3:15\s*PM/i);else await expect(input).toHaveValue(formatted);
 if(slug==='date-range-picker'){
  await preview.getByRole('button',{name:'Choose Course schedule',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Course schedule',exact:true}),start=dialog.getByRole('textbox',{name:'Start date',exact:true});
  await start.fill('dec');await expect(start).not.toHaveAttribute('aria-invalid','true');
  await expect(dialog.getByText('Choose an available date range.',{exact:true})).toHaveCount(0);
  await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeDisabled();
  await start.press('Enter');await expect(start).toHaveAttribute('aria-invalid','true');
  await start.fill('dec 3 2026');await expect(start).not.toHaveAttribute('aria-invalid','true');await start.press('Tab');
  await dialog.getByRole('button',{name:'Apply',exact:true}).click();await expect(input).toHaveValue('12/03/2026 – 12/04/2026');
 }
});
