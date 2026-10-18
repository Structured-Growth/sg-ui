import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

for(const slug of ['date-field','date-picker','date-range-selector','date-range-picker'])test(`${slug}: relative text uses explicit shared reference and copies absolute state`,async({page})=>{
 await page.goto(`/docs/components/${slug}`);
 const panel=page.getByRole('region',{name:exampleName('Relative dates from a fixed reference'),exact:true});
 const range=slug.includes('range'),popup=slug==='date-range-picker';
 if(popup)await panel.getByRole('button',{name:'Choose Relative travel dates',exact:true}).click();
 const host=popup?page.getByRole('dialog',{name:'Relative travel dates',exact:true}):panel;
 await expect(host.getByText(/Use a date such as|Two-digit years 00/)).toHaveCount(0);
 if(range){
  const start=host.getByRole('textbox',{name:'Start date',exact:true}),end=host.getByRole('textbox',{name:'End date',exact:true});
  await start.fill('today');await start.press('Tab');await expect(start).toHaveValue('10/16/2026');
  await end.fill('two weeks from today');await end.press('Tab');await expect(end).toHaveValue('10/30/2026');
  await host.getByRole('button',{name:'Apply',exact:true}).click();
  if(popup)await expect(panel.getByRole('textbox',{name:'Relative travel dates',exact:true})).toHaveValue('10/16/2026 – 10/30/2026');
 }else{
  const input=host.getByRole('textbox',{name:'Relative appointment date',exact:true});
  await input.fill('today');await input.press('Enter');await expect(input).toHaveValue('10/16/2026');
  await input.fill('a week from today');await input.press('Enter');await expect(input).toHaveValue('10/23/2026');
  await input.fill('next Monday');await input.press('Tab');await expect(input).toHaveValue('10/19/2026');
 }
 await panel.getByRole('button',{name:'Show source: Relative dates from a fixed reference',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;
 expect(source).toContain("const referenceDate='2026-10-16'");expect(source).toContain(range?'2026-10-30':'2026-10-19');
 expect(checkSources([{slug,source}])).toEqual([]);
 if(slug==='date-picker'){
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  const anchor=playground.getByRole('textbox',{name:'Relative reference date',exact:true}),input=playground.locator('[data-docs-preview]').getByRole('textbox',{name:'Course schedule',exact:true});
  await anchor.fill('2026-10-17');await input.fill('today');await input.press('Tab');await expect(input).toHaveValue('10/17/2026');
  await anchor.fill('2026-10-18');await expect(input).toHaveValue('10/17/2026');
  await input.fill('today');await input.press('Enter');await expect(input).toHaveValue('10/18/2026');
  await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
  const configured=(await playground.getByRole('code').textContent())!;expect(configured).toContain('referenceDate="2026-10-18"');expect(checkSources([{slug:'relative-playground',source:configured}])).toEqual([]);
  await expect(panel.getByRole('code')).toHaveText(source);
 }
});
