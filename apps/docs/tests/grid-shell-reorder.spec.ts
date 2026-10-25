import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test.beforeEach(async({page})=>{await page.setViewportSize({width:1440,height:1400});});

test('shell examples support handle-only and selectable reorder with independent state and source',async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=(title:string)=>page.getByRole('region',{name:exampleName(title),exact:true});
 const only=panel('Drag handles without checkboxes'),both=panel('Checkbox selection and drag handles');
 const first=only.getByRole('grid'),second=both.getByRole('grid');
 const order=(grid:ReturnType<typeof page.getByRole>)=>grid.locator('tbody [data-grid-field="name"]').allTextContents();
 const initial=await order(first);
 async function keyboardMove(grid:ReturnType<typeof page.getByRole>,name:string,target:string,direction='ArrowDown'){
  const handle=grid.getByRole('button',{name:`Reorder ${name}`,exact:true});
  await handle.scrollIntoViewIfNeeded();
  await grid.locator('tbody tr[data-grid-row]').first().focus();
  await handle.focus();await expect(handle).toBeFocused();await page.keyboard.press('Enter');
  await expect(page.locator(':focus')).toHaveAttribute('aria-roledescription','drop indicator');
  for(let step=0;step<12;step++){
   if(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label'))===target)break;
   await page.keyboard.press(direction);
  }
  await expect(page.locator(':focus')).toHaveAttribute('aria-label',target);
  await page.keyboard.press('Enter');
 }

 await expect(first.getByRole('checkbox')).toHaveCount(0);
 await expect(first.getByRole('button',{name:/^Reorder /})).toHaveCount(4);
 await expect(second.getByRole('checkbox')).toHaveCount(5);
 await expect(second.getByRole('button',{name:/^Reorder /})).toHaveCount(4);
 await expect(first.getByRole('button',{name:/^Move .+ (up|down)$/})).toHaveCount(0);
 await keyboardMove(first,'Plan the project','Insert between Research the topic and Draft the proposal');
 expect(await order(first)).toEqual([initial[1],initial[0],...initial.slice(2)]);
 expect(await order(second)).toEqual(initial);
 await second.getByRole('checkbox',{name:'Select Draft the proposal',exact:true}).locator('xpath=ancestor::label[1]').click();
 await second.getByRole('checkbox',{name:'Select Plan the project',exact:true}).locator('xpath=ancestor::label[1]').click();
 await expect(second.getByRole('button',{name:'Reorder Draft the proposal',exact:true})).toBeEnabled();
 await second.getByRole('checkbox',{name:'Select Plan the project',exact:true}).locator('xpath=ancestor::label[1]').click();
 await keyboardMove(second,'Draft the proposal','Insert between Plan the project and Research the topic','ArrowUp');
 expect(await order(second)).toEqual([initial[0],initial[2],initial[1],initial[3]]);
 await expect(second.getByRole('checkbox',{name:'Select Draft the proposal',exact:true})).toBeChecked();
 expect(await order(first)).toEqual([initial[1],initial[0],...initial.slice(2)]);
 for(const [owner,title] of [[only,'Drag handles without checkboxes'],[both,'Checkbox selection and drag handles']] as const){
  await owner.getByRole('button',{name:`Show source: ${title}`,exact:true}).click();
  const source=(await owner.getByLabel(`Source: ${title}`,{exact:true}).textContent())!;
  expect(checkSources([{slug:title,source}])).toEqual([]);
  if(title==='Drag handles without checkboxes')expect(source.indexOf('"id":"research"')).toBeLessThan(source.indexOf('"id":"plan"'));
  // Only the first panel moves Research ahead of Plan.
  if(title==='Checkbox selection and drag handles')expect(source).toContain('new Set(["draft"])');
 }
});

for(const title of ['Drag handles without checkboxes','Checkbox selection and drag handles'])test(`${title}: grabber accepts a native pointer reorder`,async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName(title),exact:true});
 const grid=panel.getByRole('grid');
 const handle=grid.getByRole('button',{name:'Reorder Review the proposal',exact:true});
 await handle.scrollIntoViewIfNeeded();
 const source=(await handle.boundingBox())!;
 const target=(await grid.locator('tr[data-grid-row="plan"]').boundingBox())!;
 await page.mouse.move(source.x+source.width/2,source.y+source.height/2);
 await page.mouse.down();
 await page.mouse.move(source.x+source.width/2+20,source.y+source.height/2,{steps:5});
 await page.mouse.move(target.x+200,target.y+2,{steps:10});
 await page.mouse.move(target.x+200,target.y+3);
 await page.mouse.up();
 await expect.poll(()=>grid.locator('tbody [data-grid-field="name"]').allTextContents()).toEqual(['Review the proposal','Plan the project','Research the topic','Draft the proposal']);
 await expect.poll(()=>grid.locator('[data-sgui-part="grid-drag-handle"]:focus').count()).toBe(0);
 await expect(grid.locator('[data-sgui-part="grid-drag-handle"][data-focus-visible]')).toHaveCount(0);
});

test('dragging a selected handle moves the whole selection and preserves selection and source order',async({page})=>{
 await page.addInitScript(()=>{
  const original=DataTransfer.prototype.setDragImage;
  DataTransfer.prototype.setDragImage=function(element,x,y){
   (window as Window & {rowDragPreview?:string}).rowDragPreview=element.textContent??'';
   original.call(this,element,x,y);
  };
 });
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName('Checkbox selection and drag handles'),exact:true});
 const grid=panel.getByRole('grid');
 for(const name of ['Draft the proposal','Plan the project'])await grid.getByRole('checkbox',{name:`Select ${name}`,exact:true}).locator('xpath=ancestor::label[1]').click();
 await grid.scrollIntoViewIfNeeded();
 const handle=grid.getByRole('button',{name:'Reorder Plan the project',exact:true});
 await handle.scrollIntoViewIfNeeded();
 const start=(await handle.boundingBox())!,target=(await grid.locator('tr[data-grid-row="research"]').boundingBox())!;
 await page.mouse.move(start.x+start.width/2,start.y+start.height/2);await page.mouse.down();
 await page.mouse.move(start.x+start.width/2+20,start.y+start.height/2,{steps:5});
 await page.mouse.move(target.x+200,target.y+target.height/2+2,{steps:10});
 await page.mouse.move(target.x+200,target.y+target.height/2+3);
 expect(await page.evaluate(()=>(window as Window & {rowDragPreview?:string}).rowDragPreview)).toBe('2 rows');
 await page.mouse.up();
 await expect.poll(()=>grid.locator('tbody [data-grid-field="name"]').allTextContents()).toEqual(['Research the topic','Plan the project','Draft the proposal','Review the proposal']);
 for(const name of ['Plan the project','Draft the proposal'])await expect(grid.getByRole('checkbox',{name:`Select ${name}`,exact:true})).toBeChecked();
 await panel.getByRole('button',{name:'Show source: Checkbox selection and drag handles',exact:true}).click();
 const source=(await panel.getByLabel('Source: Checkbox selection and drag handles',{exact:true}).textContent())!;
 expect(source).toContain('sourceRowIds.includes(row.id)');
 expect(checkSources([{slug:'multi-row-reorder',source}])).toEqual([]);
});

test('bare grips appear beside checkboxes on row hover and focus without a reorder column',async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName('Checkbox selection and drag handles'),exact:true});
 const row=panel.getByRole('row',{name:'Plan the project',exact:true});
 const grip=row.getByRole('button',{name:'Reorder Plan the project',exact:true});
 await row.scrollIntoViewIfNeeded();
 await page.mouse.move(5,5);
 await expect(grip).toHaveCSS('opacity','0');
 await expect(panel.locator('tbody [data-grid-field="__reorder"]')).toHaveCount(0);
 expect(await panel.locator('thead').innerText()).not.toContain('Reorder');
 await row.hover();await expect(grip).toHaveCSS('opacity','1');
 const checkbox=(await row.getByRole('checkbox',{name:'Select Plan the project',exact:true}).locator('xpath=ancestor::label[1]').boundingBox())!;
 const icon=(await grip.boundingBox())!;
 expect(icon.x-checkbox.x-checkbox.width).toBeGreaterThanOrEqual(0);
 expect(icon.x-checkbox.x-checkbox.width).toBeLessThanOrEqual(8);
 expect(icon.width).toBeLessThanOrEqual(32);
 await expect(grip).toHaveCSS('border-top-width','0px');
 await expect(grip).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
 // Pointer selection keeps the row selected without keeping the grip revealed.
 await row.getByRole('rowheader').click();
 await expect(row).toHaveAttribute('aria-selected','true');
 await page.mouse.move(5,5);await expect(grip).toHaveCSS('opacity','0');
 await expect(row.getByRole('checkbox',{name:'Select Plan the project',exact:true})).toBeChecked();
 await row.getByRole('checkbox',{name:'Select Plan the project',exact:true}).locator('xpath=ancestor::label[1]').click();
 await page.mouse.move(5,5);await expect(grip).toHaveCSS('opacity','0');
 await expect(row).toHaveAttribute('aria-selected','false');
 // Keyboard focus still reveals the grip even when the pointer is elsewhere.
 await page.keyboard.press('Tab');await grip.focus();await page.mouse.move(5,5);await expect(grip).toHaveCSS('opacity','1');
 const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 for(const name of ['Enable row sorter','Show row move buttons'])await playground.getByRole('checkbox',{name,exact:true}).locator('xpath=ancestor::label[1]').click();
 await expect(playground.locator('thead').getByText('Reorder',{exact:true})).toBeVisible();
 await expect(playground.getByRole('button',{name:'Reorder Course 1',exact:true})).toHaveCount(1);
});
