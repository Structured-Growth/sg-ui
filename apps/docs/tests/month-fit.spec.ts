import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';
for(const density of ['compact','comfortable'])test(`month choices adapt to host height and width at ${density} density`,async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('/docs/components/month-picker');
 for(const [shape,columns] of [['tall',2],['medium',3],['short and wide',6]] as const){
  const title=`Month choices — ${shape} — ${density}`,panel=page.getByRole('region',{name:exampleName(title),exact:true});
  const grid=panel.locator('[data-docs-preview]').getByRole('group',{name:'Month choices',exact:true});await grid.scrollIntoViewIfNeeded();
  await expect(grid).toHaveAttribute('data-month-columns',String(columns));
  expect(await grid.evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(columns);
  expect(await grid.evaluate(element=>{const rect=element.getBoundingClientRect();return Array.from(element.querySelectorAll('button')).every(button=>{const r=button.getBoundingClientRect();return r.left>=rect.left&&r.right<=rect.right+1&&r.top>=rect.top&&r.bottom<=rect.bottom+1&&button.scrollWidth<=button.clientWidth+1;});})).toBe(true);
  await grid.getByRole('button',{name:'May',exact:true}).click();await expect(grid.getByRole('button',{name:'May',exact:true})).toHaveAttribute('aria-pressed','true');
  await grid.screenshot({path:`/tmp/month-fit-${shape.replaceAll(' ','-')}-${density}.png`});
  await panel.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();expect(checkSources([{slug:'month-picker',source:(await panel.getByRole('code').textContent())!}])).toEqual([]);
 }
 const tall=page.getByRole('region',{name:exampleName(`Month choices — tall — ${density}`),exact:true}).locator('[data-docs-preview]').getByRole('group',{name:'Month choices',exact:true});
 await tall.locator('..').evaluate(element=>{(element as HTMLElement).style.inlineSize='32rem';(element as HTMLElement).style.blockSize='calc(2 * max(var(--sgui-control-height), var(--sgui-control-minimum-target-size)) + 3 * var(--sgui-space1))';});
 await expect(tall).toHaveAttribute('data-month-columns','6');await expect(tall.getByRole('button',{name:'May',exact:true})).toHaveAttribute('aria-pressed','true');
 await tall.locator('..').evaluate(element=>{(element as HTMLElement).style.blockSize='calc(6 * max(var(--sgui-control-height), var(--sgui-control-minimum-target-size)) + 7 * var(--sgui-space1))';});await expect(tall).toHaveAttribute('data-month-columns','2');
});
for(const slug of ['calendar','date-picker','date-range-picker','date-range-selector'])test(`${slug}: month chooser fills the reserved frame with two columns`,async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto(`/docs/components/${slug}`);
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}),preview=panel.locator('[data-docs-preview]'),popup=slug==='date-picker'||slug==='date-range-picker';
 if(popup)await preview.getByRole('button',{name:'Choose Course schedule',exact:true}).click();
 const host=popup?page.getByRole('dialog',{name:'Course schedule',exact:true}):preview;await host.scrollIntoViewIfNeeded();const before=(await host.boundingBox())!;
 await host.getByRole('button',{name:'Choose month, October',exact:true}).click();const choices=host.getByRole('group',{name:'Month choices',exact:true}),view=host.locator('[data-sgui-part="calendar-period-view"]');
 await expect(choices).toHaveAttribute('data-month-columns','2');const a=(await choices.boundingBox())!,b=(await view.boundingBox())!;expect(Math.abs(a.height-b.height)).toBeLessThan(2);
 expect(Math.abs((await host.boundingBox())!.height-before.height)).toBeLessThan(1);
 const center=await choices.evaluate(element=>{const buttons=Array.from(element.querySelectorAll('button')).map(button=>button.getBoundingClientRect());return (Math.min(...buttons.map(r=>r.top))+Math.max(...buttons.map(r=>r.bottom)))/2;});
 const frame=slug==='date-picker'?host:choices;const frameBounds=(await frame.boundingBox())!;expect(Math.abs(center-frameBounds.y-frameBounds.height/2)).toBeLessThan(2);
 await host.screenshot({path:`/tmp/month-centered-${slug}.png`,animations:'disabled'});

 await choices.getByRole('button',{name:'May',exact:true}).click();await expect(host.getByRole('button',{name:'Choose month, May',exact:true})).toBeFocused();
 if(popup)await expect(preview.getByRole('textbox',{name:'Course schedule',exact:true})).toHaveValue(slug==='date-picker'?'10/14/2026':'10/12/2026 – 10/16/2026');
});
