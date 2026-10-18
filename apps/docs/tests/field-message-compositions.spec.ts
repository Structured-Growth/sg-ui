import {test,expect,type Locator} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

for(const slug of ['period-picker','date-time-range-picker','date-range-comparison-picker','date-range-selector'])test(`${slug}: composed fields expose and forward message placement`,async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto(`/docs/components/${slug}`);
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]');
 await panel.getByRole('button',{name:/Error placement/}).click();await page.getByRole('option',{name:'Above input',exact:true}).click();
 await panel.getByRole('button',{name:/Description placement/}).click();await page.getByRole('option',{name:'Below input',exact:true}).click();
 let error:Locator,control:Locator;
 if(slug==='date-range-selector'){
  await panel.getByRole('button',{name:/Range length/}).click();await page.getByRole('option',{name:'bounded',exact:true}).click();
  await panel.getByRole('textbox',{name:'Minimum length',exact:true}).fill('10');
  error=preview.getByText('Choose an available date range.',{exact:true});control=preview.getByRole('grid').first();
 }else{
  const label=slug==='period-picker'?'Reporting period':slug==='date-time-range-picker'?'Meeting interval':'Compare reporting periods';
  await preview.getByRole('button',{name:label,exact:true}).click();
  const dialog=page.getByRole('dialog',{name:label,exact:true});
  if(slug==='period-picker'){
   control=dialog.getByRole('textbox',{name:'Year',exact:true});await control.fill('invalid');
   error=dialog.getByText('This period is unavailable.',{exact:true});
  }else if(slug==='date-time-range-picker'){
   const end=dialog.getByRole('textbox',{name:'End time',exact:true});await end.fill('7a');await end.press('Enter');
   control=dialog.getByRole('textbox',{name:'Start date',exact:true});error=dialog.getByText('Choose a complete, available start and end in order.',{exact:true});
  }else{
   control=dialog.getByRole('textbox',{name:'Primary period',exact:true});await control.fill('invalid');await control.press('Tab');
   error=dialog.getByText('Enter a valid date range in order, within the allowed dates.',{exact:true});
  }
 }
 await expect(error).toBeVisible();expect((await error.boundingBox())!.y).toBeLessThan((await control.boundingBox())!.y);
 if(slug!=='date-range-selector')await page.getByRole('dialog').getByRole('button',{name:'Cancel',exact:true}).click();
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;
 expect(source).toContain('descriptionPlacement="below"');expect(source).toContain('errorPlacement="above"');expect(checkSources([{slug,source}])).toEqual([]);
});
