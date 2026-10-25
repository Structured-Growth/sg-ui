import {test,expect} from './fixtures';
import {exampleName} from './example-name';
for(const {clicks,target,expected} of [
 {clicks:[1],target:4,expected:[1,2,3,4]},
 {clicks:[1,3],target:5,expected:[1,3,4,5]},
 {clicks:[1,5],target:3,expected:[1,3,4,5]},
])test(`row selector adds ${clicks} then Shift-${target}`,async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const checkbox=(n:number)=>panel.getByRole('checkbox',{name:`Select Course ${n}`,exact:true});
 for(const n of clicks)await checkbox(n).locator('xpath=ancestor::label[1]').click();
 await checkbox(target).locator('xpath=ancestor::label[1]').click({modifiers:['Shift']});
 for(let n=1;n<=6;n++){
  if(expected.includes(n))await expect(checkbox(n)).toBeChecked();
  else await expect(checkbox(n)).not.toBeChecked();
  await expect(panel.getByRole('row',{name:`Course ${n}`,exact:true})).toHaveAttribute('aria-selected',String(expected.includes(n)));
 }
 await expect(page.getByRole('region',{name:'AppDataGridShell at a glance',exact:true}).getByRole('checkbox',{name:'Select Course 1',exact:true})).not.toBeChecked();
});

test('successive Shift-clicks check or uncheck intervals and advance the anchor',async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const steps=[
  {row:1,shift:false,expected:[1]},
  {row:6,shift:true,expected:[1,2,3,4,5,6]},
  {row:4,shift:true,expected:[1,2,3]},
  {row:2,shift:true,expected:[1]},
  {row:5,shift:true,expected:[1,2,3,4,5]},
  {row:3,shift:false,expected:[1,2,4,5]},
  {row:1,shift:true,expected:[4,5]},
 ];
 for(const {row,shift,expected} of steps){
  await panel.getByRole('checkbox',{name:`Select Course ${row}`,exact:true}).locator('xpath=ancestor::label[1]').click({modifiers:shift?['Shift']:[]});
  for(let n=1;n<=6;n++){
   if(expected.includes(n))await expect(panel.getByRole('checkbox',{name:`Select Course ${n}`,exact:true})).toBeChecked();
   else await expect(panel.getByRole('checkbox',{name:`Select Course ${n}`,exact:true})).not.toBeChecked();
   await expect(panel.getByRole('row',{name:`Course ${n}`,exact:true})).toHaveAttribute('aria-selected',String(expected.includes(n)));
  }
 }
 await expect(page.getByRole('region',{name:'AppDataGridShell at a glance',exact:true}).getByRole('checkbox',{name:'Select Course 1',exact:true})).not.toBeChecked();
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 await expect(panel.getByRole('code')).toContainText('new Set(["4","5"])');
});
