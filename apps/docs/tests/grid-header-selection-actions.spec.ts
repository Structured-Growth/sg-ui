import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('first shell header replaces its second action and reveals a third for selected rows, independently',async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const overview=page.getByRole('region',{name:'AppDataGridShell at a glance',exact:true});
 const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const actions=overview.getByRole('group',{name:'Course actions',exact:true});
 const other=playground.getByRole('group',{name:'Course actions',exact:true});
 await expect(actions.getByRole('button')).toHaveCount(2);
 await expect(actions.getByRole('button',{name:'New course',exact:true})).toBeVisible();
 await expect(actions.getByRole('button',{name:'Export all',exact:true})).toBeVisible();
 const select=(name:string)=>overview.getByRole('checkbox',{name,exact:true}).locator('xpath=ancestor::label[1]').click();
 await select('Select Course 1');
 await expect(actions.getByRole('button')).toHaveCount(3);
 await expect(actions.getByRole('button',{name:'Export all',exact:true})).toHaveCount(0);
 await actions.getByRole('button',{name:'Export selected',exact:true}).click();
 await expect(overview.getByRole('status').filter({hasText:'Export requested for 1 selected course(s).'})).toBeVisible();
 await select('Select Course 2');
 await actions.getByRole('button',{name:'Archive selected',exact:true}).click();
 await expect(overview.getByRole('status').filter({hasText:'Archive requested for 2 selected course(s).'})).toBeVisible();
 await expect(other.getByRole('button')).toHaveCount(2);
 await expect(playground.getByRole('checkbox',{name:'Select Course 1',exact:true})).not.toBeChecked();
 await select('Select Course 1');await select('Select Course 2');
 await expect(actions.getByRole('button')).toHaveCount(2);
 await expect(actions.getByRole('button',{name:'Export all',exact:true})).toBeVisible();
 await expect(actions.getByRole('button',{name:'Archive selected',exact:true})).toHaveCount(0);
 await page.locator('#main-content').evaluate(element=>{element.scrollTop=0;});
 const box=(await overview.boundingBox())!;
 await page.mouse.move(box.x+box.width/2,Math.min(box.y+150,900));
 await page.mouse.wheel(0,250);
 await expect.poll(()=>page.locator('#main-content').evaluate(element=>element.scrollTop)).toBeGreaterThan(0);
 expect(await overview.evaluate(element=>element.scrollTop)).toBe(0);
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1000});
  const previews=await page.locator('[data-sgui-part="data-grid-shell"]').evaluateAll(shells=>shells.filter(shell=>shell.getBoundingClientRect().height>0).map(shell=>{
   const pane=shell.querySelector('[data-sgui-part="grid-container"]');
   const rows=pane?.querySelectorAll('tbody tr[data-grid-row]');
   const sixth=rows?.[5]?.getBoundingClientRect(),bounds=pane?.getBoundingClientRect();
   let ancestorsFit=true;
   if(sixth&&pane){
    let ancestor:Element|null=pane;
    while(ancestor){
     const style=getComputedStyle(ancestor),rect=ancestor.getBoundingClientRect();
     if(['auto','scroll','hidden','clip'].includes(style.overflowY)&& (sixth.top<rect.top-1||sixth.bottom>rect.bottom+1))ancestorsFit=false;
     if(ancestor.hasAttribute('data-docs-preview'))break;
     ancestor=ancestor.parentElement;
    }
   }
   return {ancestorsFit,label:shell.querySelector('[role="grid"]')?.getAttribute("aria-label"),height:shell.getBoundingClientRect().height,blankSpace:sixth&&bounds?bounds.bottom-sixth.bottom:0,sixthFits:!sixth||!bounds||sixth.bottom<=bounds.bottom+1};
  }));
  expect(previews.length).toBeGreaterThan(0);
  expect(previews.every(preview=>preview.ancestorsFit),`${width}px sixth row is not clipped by any preview ancestor`).toBe(true);
  expect(previews.filter(preview=>preview.blankSpace>2),`${width}px grid ends immediately after its rows`).toEqual([]);
  expect(previews.every(preview=>preview.sixthFits),`${width}px first six rows fit in every sample`).toBe(true);
  for(const selected of [false,true]){
   if(selected)await select('Select Course 1');
   expect(await overview.evaluate(element=>element.scrollHeight-element.clientHeight),`${width}px overview preview`).toBeLessThanOrEqual(1);
   const sixth=overview.locator('tbody tr').nth(5);
   await expect(sixth).toHaveCount(1);
   expect(await sixth.evaluate(row=>{const pane=row.closest('[data-sgui-part="grid-container"]')!;const r=row.getBoundingClientRect(),p=pane.getBoundingClientRect();return r.bottom<=p.bottom+1&&r.top>=p.top;}),`${width}px sixth row fits`).toBe(true);
   const overflow=await overview.locator('[data-sgui-part="data-grid-shell"]').evaluate(element=>({shell:element.scrollHeight-element.clientHeight,grid:[...element.querySelectorAll('[data-sgui-part="grid-container"]')].map(grid=>grid.scrollHeight-grid.clientHeight)}));
   expect(overflow.shell,`${width}px shell`).toBeLessThanOrEqual(1);
   expect(overflow.grid.every(value=>value<=1),`${width}px grid, selected=${selected}`).toBe(true);
   if(selected)await select('Select Course 1');
  }
 }
});

test('source-backed playground includes current selection and both header slots',async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await panel.getByRole('checkbox',{name:'Select Course 2',exact:true}).locator('xpath=ancestor::label[1]').click();
 await expect(panel.getByRole('button',{name:'Export selected',exact:true})).toBeVisible();
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByLabel('Source: Prop playground',{exact:true}).textContent())!;
 expect(source).toContain('new Set(["2"])');expect(source).toContain('leftContentWhenSelected:selectedActions');
 expect(checkSources([{slug:'selection-aware-header',source}])).toEqual([]);
});

 test('playground row sorter supports handles with and without checkboxes and copyable host order',async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const toggle=(name:string)=>panel.getByRole('checkbox',{name,exact:true}).locator('xpath=ancestor::label[1]').click();
 await toggle('Enable row sorter');
 await expect(panel.getByRole('button',{name:'Reorder Course 1',exact:true})).toBeEnabled();
 await expect(panel.getByRole('button',{name:'Move Course 1 down',exact:true})).toHaveCount(0);
 await toggle('Show row move buttons');
 await toggle('Disable row dragging');
 await expect(panel.getByRole('button',{name:'Reorder Course 1',exact:true})).toBeDisabled();
 await panel.getByRole('button',{name:'Move Course 1 down',exact:true}).click();
 await toggle('Disable row dragging');
 expect((await panel.locator('tbody [data-grid-field="name"]').allTextContents()).slice(0,2)).toEqual(['Course 2','Course 1']);
 await toggle('Enable row selection');
 await expect(panel.getByRole('checkbox',{name:'Select Course 1',exact:true})).toHaveCount(0);
 await expect(panel.getByRole('button',{name:'Reorder Course 1',exact:true})).toBeEnabled();
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByLabel('Source: Prop playground',{exact:true}).textContent())!;
 expect(source).toContain('rowDrag={{onReorder:reorder,showMoveButtons:true,dragDisabled:false}}');
 expect(checkSources([{slug:'playground-row-sorter',source}])).toEqual([]);
 const overview=page.getByRole('region',{name:'AppDataGridShell at a glance',exact:true});
 await expect(overview.getByRole('button',{name:/^Reorder /})).toHaveCount(0);
 });
