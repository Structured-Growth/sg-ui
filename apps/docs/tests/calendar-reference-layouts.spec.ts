import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

for(const [slug,title,popup] of [
 ['calendar','Three-month calendar',false],
 ['date-range-selector','Three-month range',false],
 ['date-range-picker','Three-month range dropdown',true],
] as const)test(`${slug}: three months fit and wrap without widening day targets`,async({page},info)=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto(`/docs/components/${slug}`);
 const panel=page.getByRole('region',{name:exampleName(title),exact:true});await panel.scrollIntoViewIfNeeded();
 if(popup)await panel.getByRole('button',{name:'Choose Reporting period',exact:true}).click();
 const host=popup?page.getByRole('dialog',{name:'Reporting period',exact:true}):panel;
 const grids=host.getByRole('grid');await expect(grids).toHaveCount(3);
 const boxes=await grids.evaluateAll(elements=>elements.map(element=>{const r=element.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width};}));
 for(const box of boxes){expect(box.width).toBeCloseTo(224,0);expect(box.y).toBeCloseTo(boxes[0].y,0);}
 if(popup)await page.keyboard.press('Escape');
 await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('months={3}');expect(checkSources([{slug,source}])).toEqual([]);
 await page.setViewportSize({width:375,height:1000});
 if(popup)await panel.getByRole('button',{name:'Choose Reporting period',exact:true}).click();
 const narrow=await grids.evaluateAll(elements=>elements.map(element=>{const r=element.getBoundingClientRect();return{x:r.x,y:r.y};}));
 expect(narrow[1].y).toBeGreaterThan(narrow[0].y);expect(narrow[2].y).toBeGreaterThan(narrow[1].y);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await info.attach('three-months',{body:await page.screenshot({path:info.outputPath('three-months.png')}),contentType:'image/png'});
});

for(const dir of ['ltr','rtl'])test(`presets after calendars preserve visual and keyboard order: ${dir}`,async({page},info)=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/date-range-selector');
 const panel=page.getByRole('region',{name:exampleName('Presets after the calendars'),exact:true});
 const preview=panel.locator('[data-docs-preview]');await preview.evaluate((element,dir)=>element.setAttribute('dir',dir),dir);
 await preview.scrollIntoViewIfNeeded();
 const presets=panel.getByRole('group',{name:'Date presets',exact:true}),grids=panel.getByRole('grid');
 const side=(await presets.boundingBox())!,first=(await grids.first().boundingBox())!,last=(await grids.last().boundingBox())!;
 if(dir==='ltr')expect(side.x).toBeGreaterThan(last.x+last.width);else expect(side.x+side.width).toBeLessThan(last.x);
 const apply=panel.getByRole('button',{name:'Apply',exact:true});await apply.focus();await apply.press('Tab');
 await expect(presets.getByRole('button',{name:'Autumn launch',exact:true})).toBeFocused();
 await presets.getByRole('button',{name:'This month',exact:true}).click();
 await expect(panel.getByRole('textbox',{name:'Start date',exact:true})).toHaveValue('10/01/2026');
 await expect(panel.getByRole('textbox',{name:'End date',exact:true})).toHaveValue('10/31/2026');
 await panel.getByRole('button',{name:'Show source: Presets after the calendars',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('presetPlacement="end"');expect(checkSources([{slug:'end-presets',source}])).toEqual([]);
 await page.setViewportSize({width:375,height:1000});
 const stacked=(await presets.boundingBox())!,calendar=(await grids.last().boundingBox())!;
 expect(stacked.y).toBeGreaterThan(calendar.y+calendar.height);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await info.attach('end-presets',{body:await page.screenshot({path:info.outputPath('end-presets.png')}),contentType:'image/png'});
});
