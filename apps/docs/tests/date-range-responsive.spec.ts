import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

for(const density of ['Compact density','Comfortable density'])test(`host-supplied presets use a wide responsive dropdown: ${density}`,async({page},info)=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await panel.getByRole('button',{name:/Example density/}).click();await page.getByRole('option',{name:density.startsWith('Compact')?'Compact':'Comfortable',exact:true}).click();
 // The clean reference has no host presets. Enable them only in this playground.
 const presetToggle=panel.getByRole('checkbox',{name:'Show presets',exact:true});await presetToggle.focus();await presetToggle.press('Space');await expect(presetToggle).toBeChecked();
 const trigger=panel.getByRole('button',{name:'Choose Course schedule',exact:true});await trigger.click();
 const dialog=page.getByRole('dialog',{name:'Course schedule',exact:true});
 const overlay=dialog.locator('xpath=ancestor::*[@data-trigger="DialogTrigger"][1]');
 const presets=dialog.getByRole('group',{name:'Date presets',exact:true});
 await expect(dialog.getByRole('textbox',{name:'Start date',exact:true})).toHaveCount(0);
 await expect(dialog.getByRole('spinbutton')).toHaveCount(0);
 const p=(await presets.boundingBox())!,grid=(await dialog.getByRole('grid').boundingBox())!;
 expect(p.x+p.width).toBeLessThan(grid.x);
 const choice=presets.getByRole('option',{name:'This week',exact:true});
 await expect(choice).toHaveAttribute('aria-selected','false');
 await expect(presets.getByRole('option')).toHaveText(['This week','Last week','This month','Last month']);
 expect(await presets.evaluate(e=>getComputedStyle(e).borderTopWidth)).toBe('0px');
 expect(await choice.evaluate(e=>getComputedStyle(e).borderTopWidth)).toBe('0px');
 const box=(await overlay.boundingBox())!;expect(box.width).toBeGreaterThan(density.startsWith('Compact')?400:470);expect(box.width).toBeLessThan(650);expect(box.height).toBeLessThan(610);
 await expect.poll(()=>overlay.evaluate(e=>e.scrollHeight<=e.clientHeight+1)).toBe(true);
 await expect(dialog.getByRole('button',{name:'Apply',exact:true})).toBeInViewport();
 await info.attach('desktop',{body:await page.screenshot({path:info.outputPath('desktop.png')}),contentType:'image/png'});
 await dialog.getByRole('option',{name:'Last week',exact:true}).click();await dialog.getByRole('button',{name:'Apply',exact:true}).click();
 await expect(panel.getByRole('textbox',{name:'Course schedule',exact:true})).toHaveValue('10/05/2026 – 10/11/2026');
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 expect(checkSources([{slug:'range-responsive',source:(await panel.getByRole('code').textContent())!}])).toEqual([]);
 await page.setViewportSize({width:375,height:900});await trigger.click();
 const narrow=(await overlay.boundingBox())!,np=(await presets.boundingBox())!,ng=(await dialog.getByRole('grid').boundingBox())!;
 expect(narrow.x).toBeGreaterThanOrEqual(0);expect(narrow.x+narrow.width).toBeLessThanOrEqual(375);expect(np.y+np.height).toBeLessThan(ng.y);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await info.attach('narrow',{body:await page.screenshot({path:info.outputPath('narrow.png')}),contentType:'image/png'});
 await dialog.getByRole('option',{name:'This week',exact:true}).click();await dialog.getByRole('button',{name:'Cancel',exact:true}).click();
 await expect(trigger).toBeFocused();await expect(panel.getByRole('textbox',{name:'Course schedule',exact:true})).toHaveValue('10/05/2026 – 10/11/2026');
});

test('optional endpoint fields use flexible text and preset rows support keyboard selection',async({page})=>{
 await page.goto('/docs/components/date-range-picker');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const fields=panel.getByRole('checkbox',{name:'Show endpoint fields',exact:true});
 await expect(fields).not.toBeChecked();await fields.focus();await fields.press('Space');
 const presetToggle=panel.getByRole('checkbox',{name:'Show presets',exact:true});await presetToggle.focus();await presetToggle.press('Space');await expect(presetToggle).toBeChecked();
 const trigger=panel.getByRole('button',{name:'Choose Course schedule',exact:true});await trigger.click();
 const dialog=page.getByRole('dialog',{name:'Course schedule',exact:true});
 await expect(dialog.getByRole('spinbutton')).toHaveCount(0);
 const next=dialog.getByRole('option',{name:'Last week',exact:true});const current=dialog.getByRole('option',{name:'This week',exact:true});await current.focus();await current.press('ArrowDown');await expect(next).toBeFocused();await next.press('Enter');
 await expect(next).toHaveAttribute('aria-selected','true');
 const start=dialog.getByRole('textbox',{name:'Start date',exact:true});await expect(start).toHaveValue('10/05/2026');
 await start.fill('10/06/26');await start.press('Tab');await expect(start).toHaveValue('10/06/2026');
 await dialog.getByRole('button',{name:'Apply',exact:true}).click();
 await expect(panel.locator('[data-docs-preview]').getByRole('textbox',{name:'Course schedule',exact:true})).toHaveValue('10/06/2026 – 10/11/2026');
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('showFields={true}');expect(source).toContain('entryMode="text"');
 expect(checkSources([{slug:'optional-range-fields',source}])).toEqual([]);
});
