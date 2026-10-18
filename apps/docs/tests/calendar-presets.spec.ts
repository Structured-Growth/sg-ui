import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

for(const months of [1,2])test(`range preset panel: ${months} calendars, fixed/relative/custom choices and responsive draft ownership`,async({page},info)=>{
 await page.setViewportSize({width:1440,height:1100});
 await page.goto('/docs/components/date-range-picker');
 const title=`Preset panel with ${months===1?'one calendar':'two calendars'}`;
 const panel=page.getByRole('region',{name:exampleName(title),exact:true});
 await panel.scrollIntoViewIfNeeded();
 const trigger=panel.getByRole('button',{name:'Choose Reporting period',exact:true});
 const field=panel.getByRole('textbox',{name:'Reporting period',exact:true}); const initial=await field.inputValue();await trigger.click();
 const dialog=page.getByRole('dialog',{name:'Reporting period',exact:true});
 const presets=dialog.getByRole('group',{name:'Date presets',exact:true});
 await expect(presets.getByRole('option')).toHaveCount(6);
 await expect(dialog.getByRole('grid')).toHaveCount(months);
 const side=(await presets.boundingBox())!,calendar=(await dialog.getByRole('grid').first().boundingBox())!;
 expect(side.x+side.width).toBeLessThan(calendar.x);
 await expect(presets.getByRole('option',{name:'This week',exact:true})).toHaveAttribute('aria-selected','true');
 const start=dialog.getByRole('textbox',{name:'Start date',exact:true}),end=dialog.getByRole('textbox',{name:'End date',exact:true});
 const draft=async(a:string,b:string)=>{
  if(months===1){
   await expect(start).toHaveCount(0);await expect(end).toHaveCount(0);
   const iso=(value:string)=>`${value.slice(6)}-${value.slice(0,2)}-${value.slice(3,5)}`;
   await expect(dialog.locator('[data-sgui-part="date-range-draft"]')).toHaveText(`${iso(a)} – ${iso(b)}`);
  }else {await expect(start).toHaveValue(a);await expect(end).toHaveValue(b);}
 };
 for(const [label,a,b] of [['Autumn launch','09/01/2026','09/30/2026'],['This month','10/01/2026','10/31/2026'],['This year','01/01/2026','12/31/2026'],['Last year','01/01/2025','12/31/2025'],['Last business week','10/05/2026','10/09/2026']] as const){
  await presets.getByRole('option',{name:label,exact:true}).click();
  await draft(a,b);
  await expect(presets.getByRole('option',{name:label,exact:true})).toHaveAttribute('aria-selected','true');
  await expect(field).toHaveValue(initial!);
 }
 await info.attach('preset-side-panel',{body:await dialog.screenshot({path:info.outputPath('preset-side-panel.png')}),contentType:'image/png'});
 await dialog.getByRole('button',{name:'Apply',exact:true}).click();
 await expect(panel.getByRole('textbox',{name:'Reporting period',exact:true})).toHaveValue('10/05/2026 – 10/09/2026');
 await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();
 const source=await panel.getByRole('code').textContent();expect(source).toContain('getRelativeDateRange');expect(source).toContain('2026-10-09');
 expect(checkSources([{slug:`range-presets-${months}`,source:source!}])).toEqual([]);
 await trigger.click();await presets.getByRole('option',{name:'Last year',exact:true}).click();
 await dialog.getByRole('button',{name:'Cancel',exact:true}).click();await expect(panel.getByRole('textbox',{name:'Reporting period',exact:true})).toHaveValue('10/05/2026 – 10/09/2026');
 await page.setViewportSize({width:375,height:900});await trigger.click();
 const box=(await presets.boundingBox())!,grid=(await dialog.getByRole('grid').first().boundingBox())!;
 expect(box.y+box.height).toBeLessThan(grid.y);expect(box.x).toBeGreaterThanOrEqual(0);expect(box.x+box.width).toBeLessThanOrEqual(375);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await presets.getByRole('option',{name:'This month',exact:true}).click();await draft('10/01/2026','10/31/2026');
 await dialog.getByRole('button',{name:'Apply',exact:true}).click();await expect(panel.getByRole('textbox',{name:'Reporting period',exact:true})).toHaveValue('10/01/2026 – 10/31/2026');
});
