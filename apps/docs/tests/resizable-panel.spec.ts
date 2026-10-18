import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('documentation shelf resizes by pointer and keyboard and stays within narrow viewports',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:1440,height:1000});await page.goto('/docs/components/text-field');
 const tools=page.getByRole('complementary',{name:'Component tools'});
 await tools.getByRole('button',{name:'Demo settings',exact:true}).click();
 await expect(tools.getByRole('separator')).toHaveCount(0);
 await tools.getByRole('button',{name:'Page documentation',exact:true}).click();
 const panel=tools.getByRole('region',{name:'Page documentation',exact:true});
 const handle=tools.getByRole('separator',{name:'Resize Page documentation panel',exact:true});
 const initial=(await panel.boundingBox())!.width;await handle.focus();await handle.press('ArrowLeft');
 await expect.poll(async()=>(await panel.boundingBox())!.width).toBeGreaterThan(initial+5);
 const box=(await handle.boundingBox())!;const start=(await panel.boundingBox())!.width;
 await page.mouse.move(box.x+box.width/2,box.y+80);await page.mouse.down();await expect(handle).toHaveAttribute('data-dragging','true');await page.mouse.move(box.x+80,box.y+80,{steps:8});await page.mouse.up();
 await expect.poll(async()=>(await panel.boundingBox())!.width).toBeLessThan(start-50);
 const resized=(await panel.boundingBox())!.width;
 const cancelBox=(await handle.boundingBox())!;
 await page.mouse.move(cancelBox.x+cancelBox.width/2,cancelBox.y+80);await page.mouse.down();await page.mouse.move(cancelBox.x+40,cancelBox.y+80,{steps:4});
 await handle.press('Escape');await page.mouse.up();
 await expect.poll(async()=>Math.abs((await panel.boundingBox())!.width-resized)).toBeLessThan(1);
 await tools.getByRole('button',{name:'Page documentation',exact:true}).click();await tools.getByRole('button',{name:'Page documentation',exact:true}).click();
 expect(Math.abs((await panel.boundingBox())!.width-resized)).toBeLessThan(1);
 await panel.screenshot({path:'/tmp/sgui-docs-resized-panel.png'});
 await page.setViewportSize({width:375,height:850});
 await expect(panel).toBeVisible();await expect.poll(async()=>(await panel.boundingBox())!.x).toBeGreaterThanOrEqual(-1);const narrow=(await panel.boundingBox())!;expect(narrow.x).toBeGreaterThanOrEqual(-1);expect(narrow.x+narrow.width).toBeLessThanOrEqual(376);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('reusable resize prop is opt-in and example source matches',async({page})=>{
 await page.goto('/docs/components/icon-panel-navigation');
 const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const preview=playground.locator('[data-docs-preview]');await preview.getByRole('button',{name:'Notes',exact:true}).click();
 await expect(preview.getByRole('separator')).toHaveCount(0);
 const toggle=playground.getByRole('checkbox',{name:'Resizable panel',exact:true});await toggle.focus();await toggle.press('Space');
 const handle=preview.getByRole('separator');await expect(handle).toBeVisible();
 await handle.focus();const before=Number(await handle.getAttribute('aria-valuenow'));await handle.press('ArrowRight');
 await expect.poll(async()=>Number(await handle.getAttribute('aria-valuenow'))).toBeGreaterThan(before);
 const ltrWidth=Number(await handle.getAttribute('aria-valuenow'));
 await preview.evaluate(element=>element.setAttribute('dir','rtl'));
 await handle.press('ArrowLeft');
 await expect.poll(async()=>Number(await handle.getAttribute('aria-valuenow'))).toBeGreaterThan(ltrWidth);
 await playground.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await playground.getByRole('code').textContent())!;expect(source).toContain('resizable={true}');expect(checkSources([{slug:'icon-panel-navigation',source}])).toEqual([]);
});
