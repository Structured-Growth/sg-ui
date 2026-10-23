import {test,expect} from './fixtures';
import {exampleName} from './example-name';

test('Columns handles move headers in both directions and retain locked visibility and action placement',async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const preview=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}).locator('[data-docs-preview]');
 const grid=preview.getByRole('grid');
 const headers=()=>grid.locator('thead [data-grid-field]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-grid-field')));
 await preview.getByRole('button',{name:'Columns',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Columns',exact:true});
 const row=(id:string)=>dialog.locator(`[data-sgui-part="column-option"][data-column-id="${id}"]`);
 await expect(dialog.locator('[data-sgui-part="column-option-handle"]')).toHaveCount(3);
 const drag=async(source:string,target:string,position:'before'|'after')=>{
  const handle=row(source).locator('[data-sgui-part="column-option-handle"]');
  await handle.scrollIntoViewIfNeeded();
  const start=(await handle.boundingBox())!,end=(await row(target).boundingBox())!;
  const x=end.x+40,y=end.y+(position==='before'?end.height/4:end.height*3/4);
  await page.mouse.move(start.x+start.width/2,start.y+start.height/2);await page.mouse.down();
  await page.mouse.move(x,y,{steps:8});
  const chip=dialog.locator('[data-sgui-part="column-drag-preview"]');
  await expect(chip).toBeVisible();await expect(row(target)).toHaveAttribute('data-drop-target',position);
  const bounds=(await chip.boundingBox())!;expect(bounds.x).toBeCloseTo(x+4,0);expect(bounds.y+bounds.height/2).toBeCloseTo(y,0);
  await page.mouse.up();await expect(chip).toHaveCount(0);
 };
 await drag('score','name','before');
 await expect.poll(headers).toEqual(['score','name','status','actions']);
 await expect(dialog.getByRole('checkbox',{name:'Course',exact:true})).toBeChecked();
 await expect(dialog.getByRole('checkbox',{name:'Course',exact:true})).toBeDisabled();
 await drag('score','status','after');
 await expect.poll(headers).toEqual(['name','status','score','actions']);
 await expect(row('actions').locator('[data-sgui-part="column-option-handle"]')).toHaveCount(0);
 await expect(row('actions').getByRole('button')).toHaveCount(0);
 await expect(dialog.getByRole('button',{name:'Move Score down',exact:true})).toBeDisabled();
 await expect.poll(headers).toEqual(['name','status','score','actions']);
 await dialog.getByRole('searchbox',{name:'Search',exact:true}).fill('s');
 await expect(dialog.locator('[data-sgui-part="column-option"]')).toHaveCount(3);
 await drag('score','status','before');
 await expect.poll(headers).toEqual(['name','score','status','actions']);
 await dialog.getByRole('searchbox',{name:'Search',exact:true}).fill('');
 await expect(dialog.getByRole('checkbox',{name:/^Actions?$/,exact:true})).toBeDisabled();
 await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);
});

test('standalone toolbar example fixes action position and exposes compilable public option metadata',async({page})=>{
 const {checkSources}=await import('./check-sources');
 await page.goto('/docs/components/data-toolbar');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await panel.locator('[data-docs-preview]').getByRole('button',{name:'Columns',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'Columns',exact:true});
 const action=dialog.locator('[data-column-id="actions"]');
 await expect(action.locator('[data-sgui-part="column-option-handle"]')).toHaveCount(0);
 await expect(action.getByRole('button')).toHaveCount(0);
 await expect(dialog.getByRole('button',{name:'Move Status down',exact:true})).toBeDisabled();
 await page.keyboard.press('Escape');
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByLabel('Source: Prop playground',{exact:true}).textContent())!;
 expect(source).toContain('"reorderable":false');expect(checkSources([{slug:'fixed-column-position',source}])).toEqual([]);
});
