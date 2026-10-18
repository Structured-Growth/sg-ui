import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';
for(const [mode,title] of [['text','Flexible entry availability'],['segments','Segmented entry availability'],['datetime','Date and time availability']] as const){
 test(`${mode}: host availability guards typed values and native submission`,async({page})=>{
  await page.goto('/docs/components/date-picker');
  const panel=page.getByRole('region',{name:exampleName(title),exact:true}),preview=panel.locator('[data-docs-preview]'),form=preview.getByRole('form',{name:'Booking form'});
  const accepted=()=>form.evaluate(element=>new FormData(element as HTMLFormElement).get('booking'));
  if(mode==='text'){
   const input=form.getByRole('textbox',{name:'Booking date',exact:true});await input.fill('10/16/2026');await input.press('Enter');
   await expect(input).toHaveValue('10/16/2026');await expect(input).toHaveAttribute('aria-invalid','true');expect(await accepted()).toBe('2026-10-14');
  }else{
   const day=form.getByRole('spinbutton',{name:/day/});await day.focus();await day.press('ArrowUp');await day.press('ArrowUp');
   expect(await accepted()).toBe(mode==='datetime'?'2026-10-15T08:00:00':'2026-10-15');
  }
  expect(await form.evaluate(element=>(element as HTMLFormElement).checkValidity())).toBe(false);
  await form.getByRole('button',{name:'Save appointment',exact:true}).click();await expect(form.getByRole('status')).toHaveCount(0);
  await expect(form.getByText('No appointment capacity',{exact:true})).toBeVisible();
  if(mode==='text'){
   const input=form.getByRole('textbox',{name:'Booking date',exact:true});await input.fill('10/15/2026');await input.press('Enter');
   await form.getByRole('button',{name:'Choose Booking date',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Booking date',exact:true});
   const day=dialog.getByRole('button',{name:/Friday, October 16, 2026/});await expect(day).toHaveAttribute('aria-disabled','true');
   const description=await day.getAttribute('aria-describedby');expect(description).toBeTruthy();
   expect(await day.evaluate(element=>(element.getAttribute('aria-describedby')??'').split(/\s+/).map(id=>document.getElementById(id)?.textContent).join(' '))).toContain('No appointment capacity');
   const summary=dialog.locator('summary').filter({hasText:'Unavailable dates'});await summary.focus();await summary.press('Enter');
   await expect(dialog.getByText('2026-10-16: No appointment capacity',{exact:true})).toBeVisible();await page.keyboard.press('Escape');
  }else{
   const day=form.getByRole('spinbutton',{name:/day/});await day.focus();await day.press('ArrowDown');
  }
  expect(await form.evaluate(element=>(element as HTMLFormElement).checkValidity())).toBe(true);
  await form.getByRole('button',{name:'Save appointment',exact:true}).click();await expect(form.getByRole('status')).toHaveText('Appointment saved locally.');
  if(mode==='datetime'){
   const policy=form.getByRole('checkbox',{name:'Accept bookings on October 16',exact:true});await form.getByText('Accept bookings on October 16',{exact:true}).click();await expect(policy).toBeChecked();
   await form.getByRole('button',{name:'Choose Booking date',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Booking date',exact:true});
   await dialog.getByRole('button',{name:/Friday, October 16, 2026/}).click();await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeEnabled();
   await policy.evaluate(element=>(element as HTMLInputElement).click());await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeDisabled();
   const blocked=dialog.getByRole('button',{name:/Friday, October 16, 2026/});await expect(blocked).toHaveAttribute('aria-disabled','true');
   expect(await blocked.evaluate(element=>(element.getAttribute('aria-describedby')??'').split(/\s+/).map(id=>document.getElementById(id)?.textContent).join(' '))).toContain('No appointment capacity');
   await dialog.getByRole('button',{name:'Cancel',exact:true}).click();expect(await accepted()).toBe('2026-10-15T08:00:00');
  }
  await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();expect(checkSources([{slug:`availability-${mode}`,source:(await panel.getByRole('code').textContent())!}])).toEqual([]);
 });
}
