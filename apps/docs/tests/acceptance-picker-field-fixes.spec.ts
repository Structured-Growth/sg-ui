import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources,type SourceSnapshot} from './check-sources';

for(const [slug,label] of [['period-picker','Reporting period'],['date-time-range-picker','Meeting interval'],['date-range-comparison-picker','Compare reporting periods']] as const){
 test(`${slug}: an open panel respects later disabled and read-only state`,async({page})=>{
  await page.goto(`/docs/components/${slug}`);
  const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]');
  const trigger=preview.getByRole('button',{name:label,exact:true});
  // Start the empty period example with an accepted value before testing locks.
  if(slug==='period-picker'){await trigger.click();await page.getByRole('dialog',{name:label,exact:true}).getByRole('button',{name:'Apply',exact:true}).click();}
  const accepted=await trigger.textContent();
  for(const policy of ['Disabled','Read only']){
   await trigger.click();
   const dialog=page.getByRole('dialog',{name:label,exact:true});
   // A host update can arrive while the modal traps user focus. Trigger the
   // playground's host callback programmatically, not a click through its overlay.
   const control=panel.getByRole('checkbox',{name:policy,exact:true});
   await control.evaluate(element=>(element as HTMLInputElement).click());
   await expect(control).toBeChecked();
   await expect(dialog.getByRole('button',{name:'Clear',exact:true})).toBeDisabled();
   await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeDisabled();
   await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
   await expect(dialog).toHaveCount(0);await expect(trigger).toHaveText(accepted!);
   await control.evaluate(element=>(element as HTMLInputElement).click());await expect(control).not.toBeChecked();
  }
  await trigger.click();await page.getByRole('dialog',{name:label,exact:true}).getByRole('button',{name:'Clear',exact:true}).click();await expect(trigger).toHaveText(label);
 });
}

test('TextArea icon slots preserve multiline geometry, focus, source and sibling state',async({page},info)=>{
 await page.goto('/docs/components/text-area');const sources:SourceSnapshot[]=[];
 for(const density of ['compact','comfortable'])for(const [position,title] of [['none','Placeholder only'],['start','Icon at the start'],['end','Icon at the end'],['both','Icons at both ends']]){
  const name=`${title} — ${density}`,panel=page.getByRole('region',{name:exampleName(name),exact:true}),preview=panel.locator('[data-docs-preview]'),input=preview.getByRole('textbox');
  await preview.scrollIntoViewIfNeeded();await expect(input).toHaveAttribute('rows','3');
  const start=preview.locator('[data-sgui-part="field-start-icon"]'),end=preview.locator('[data-sgui-part="field-end-icon"]');
  await expect(start).toHaveCount(position==='start'||position==='both'?1:0);await expect(end).toHaveCount(position==='end'||position==='both'?1:0);
  if(position!=='none'){
   const frame=preview.locator('[data-sgui-part="field-icon-control"]'),box=(await frame.boundingBox())!;
   expect(box.height).toBeGreaterThanOrEqual(96);
   for(const icon of [start,end])if(await icon.count()){
    await expect(icon).toHaveAttribute('aria-hidden','true');const b=(await icon.boundingBox())!;
    expect(b.x).toBeGreaterThanOrEqual(box.x);expect(b.x+b.width).toBeLessThanOrEqual(box.x+box.width);expect(b.y).toBeGreaterThanOrEqual(box.y);expect(b.y-box.y).toBeLessThan(24);
   }
   await preview.evaluate(e=>e.setAttribute('dir','rtl'));
   if(position==='both')expect((await start.boundingBox())!.x).toBeGreaterThan((await end.boundingBox())!.x);
   await input.focus();await input.press('Tab');await page.keyboard.press('Shift+Tab');await expect(frame).toHaveCSS('outline-style','solid');
   if(position==='both')await preview.screenshot({path:info.outputPath(`textarea-${density}.png`)});
  }
  await panel.getByRole('button',{name:`Show source: ${name}`,exact:true}).click();sources.push({slug:`textarea-${density}-${position}`,source:(await panel.getByRole('code').textContent())!});
 }
 expect(checkSources(sources)).toEqual([]);
 const both=page.getByRole('region',{name:exampleName('Icons at both ends — compact'),exact:true});
 await both.locator('[data-docs-preview]').getByRole('textbox').fill('First line\nSecond line');
 await expect(both.getByRole('code')).not.toHaveText(sources.find(s=>s.slug==='textarea-compact-both')!.source);
 const sibling=page.getByRole('region',{name:exampleName('Icons at both ends — comfortable'),exact:true});await expect(sibling.getByRole('code')).toHaveText(sources.find(s=>s.slug==='textarea-comfortable-both')!.source);
});
