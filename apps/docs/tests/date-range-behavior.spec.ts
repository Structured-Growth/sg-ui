import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';
for(const slug of ['date-range-picker','date-range-selector'])test(`${slug}: policies, reverse creation, source and prop documentation`,async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto(`/docs/components/${slug}`);
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await expect(panel.getByRole('button',{name:/Range selection behavior/})).toContainText('Adjust nearest endpoint (default)');
 const referenceSources=[];
 for(const mode of ['restart','adjust-end','adjust-start','adjust-boundaries','adjust-nearest']){
  const reference=page.getByRole('region',{name:exampleName(`Selection behavior: ${mode}`),exact:true});
  await reference.getByRole('button',{name:`Show source: Selection behavior: ${mode}`,exact:true}).click();
  const code=(await reference.getByRole('code').textContent())!;
  expect(code).toContain(`rangeClickBehavior="${mode}"`);
  referenceSources.push({slug:`${slug}-${mode}`,source:code});
 }
 expect(checkSources(referenceSources)).toEqual([]);
 const preview=panel.locator('[data-docs-preview]');
 const fields=panel.getByRole('checkbox',{name:'Show endpoint fields',exact:true});if(!await fields.isChecked()){await fields.focus();await fields.press('Space');}
 await panel.getByRole('button',{name:/Date entry/}).click();await page.getByRole('option',{name:'Flexible text',exact:true}).click();
 const sourceButton=panel.getByRole('button',{name:'Show source: Prop playground',exact:true});await sourceButton.click();
 for(const [mode,label,after,tie] of [
  ['adjust-end','Adjust end',['10/12/2026','10/14/2026']],
  ['adjust-start','Adjust start',['10/14/2026','10/16/2026']],
  ['restart','Restart',['10/14/2026','']],
  ['adjust-boundaries','Adjust boundaries',['10/12/2026','10/14/2026']],
  ['adjust-nearest','Adjust nearest endpoint (default)',['10/12/2026','10/14/2026'],'end'],
  ['adjust-nearest','Adjust nearest endpoint (default)',['10/14/2026','10/16/2026'],'start'],
 ] as const){
  await panel.getByRole('button',{name:/Range selection behavior/}).click();await page.getByRole('option',{name:label,exact:true}).click();
  if(tie){await panel.getByRole('button',{name:/Nearest endpoint tie preference/}).click();await page.getByRole('option',{name:tie==='end'?'End (default)':'Start',exact:true}).click();}
  const source=(await panel.getByRole('code').textContent())!;expect(source).toContain(`rangeClickBehavior="${mode}"`);expect(checkSources([{slug,source}])).toEqual([]);if(tie)expect(source).toContain(`nearestEndpointTieBreak="${tie}"`);
  if(slug==='date-range-picker')await preview.getByRole('button',{name:'Choose Course schedule',exact:true}).click();
  const calendar=slug==='date-range-picker'?page.getByRole('dialog',{name:'Course schedule',exact:true}):preview;
  const start=calendar.getByRole('textbox',{name:'Start date',exact:true}),end=calendar.getByRole('textbox',{name:'End date',exact:true});
  const activate=async(day:number,keyboard=false)=>{
   const cell=calendar.getByRole('button',{name:new RegExp(`October ${day}, 2026`)}).filter({hasText:new RegExp(`^${day}$`)});
   if(keyboard){await cell.focus();await cell.press('Enter');}else await cell.click();
  };
  await activate(14,mode==='adjust-start');await expect(start).toHaveValue(after[0]);await expect(end).toHaveValue(after[1]);
  await calendar.getByRole('button',{name:'Clear',exact:true}).click();
  await activate(5);await expect(end).toHaveValue('');await activate(1,true);await expect(start).toHaveValue('10/01/2026');await expect(end).toHaveValue('10/05/2026');
  await calendar.getByRole('button',{name:'Cancel',exact:true}).click();
 }
 for(const [i,mode] of ['restart','adjust-end','adjust-start','adjust-boundaries','adjust-nearest'].entries()){
  const reference=page.getByRole('region',{name:exampleName(`Selection behavior: ${mode}`),exact:true});
  await expect(reference.getByRole('code')).toHaveText(referenceSources[i].source);
 }
 // Both inherited public prop tables explain initial creation and every policy.
 const docs=await page.request.get(`/docs/components/${slug}`);const html=await docs.text();
 expect(html).toContain('rangeClickBehavior');expect(html).toContain('adjust-boundaries');expect(html).toContain('nearestEndpointTieBreak');expect(html).toContain('adjust-nearest');expect(html).toContain('5th then 1st');
});

test.describe('touch range policies',()=>{
 test.use({hasTouch:true,viewport:{width:390,height:900}});
 for(const behavior of ['adjust-end','adjust-nearest'] as const)test(`${behavior} rapid taps preserve the start; reverse creation completes`,async({page})=>{
  await page.goto('/docs/components/date-range-picker');
  const panel=page.getByRole('region',{name:exampleName(`Selection behavior: ${behavior}`),exact:true});
  await panel.getByRole('button',{name:'Choose Example range',exact:true}).tap();
  const dialog=page.getByRole('dialog',{name:'Example range',exact:true});
  const day=(n:number)=>dialog.getByRole('button',{name:new RegExp(`October ${n}, 2026`)}).filter({hasText:new RegExp(`^${n}$`)});
  const start=dialog.getByRole('textbox',{name:'Start date',exact:true}),end=dialog.getByRole('textbox',{name:'End date',exact:true});
  await day(16).tap();await expect(start).toHaveValue('10/07/2026');await expect(end).toHaveValue('10/16/2026');
  await day(13).tap();await expect(start).toHaveValue('10/07/2026');await expect(end).toHaveValue('10/13/2026');
  if(behavior==='adjust-nearest'){await day(5).tap();await expect(start).toHaveValue('10/05/2026');await expect(end).toHaveValue('10/13/2026');await dialog.getByRole('button',{name:'Clear',exact:true}).tap();}
  await day(5).tap();await expect(end).toHaveValue('');await day(1).tap();await expect(start).toHaveValue('10/01/2026');await expect(end).toHaveValue('10/05/2026');
  await dialog.getByRole('button',{name:'Apply',exact:true}).tap();
  await expect(panel.getByRole('textbox',{name:'Example range',exact:true})).toHaveValue('10/01/2026 – 10/05/2026');
 });
});
