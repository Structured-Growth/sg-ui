import {expect,test,type Locator,type Page} from '@playwright/test';
const fixture=(name:string)=>`/fixtures/?id=data-display-appdatagridshell--${name}&globals=a11y.manual:!true`;
const rowIds=(grid:Locator)=>grid.locator('tbody tr[data-grid-row]').evaluateAll(rows=>rows.map(row=>(row as HTMLElement).dataset.gridRow));
const errors=new WeakMap<Page,string[]>();
test.beforeEach(async({page})=>{
 const messages:string[]=[];errors.set(page,messages);page.on('pageerror',error=>messages.push(error.message));
 await page.addInitScript(()=>{
  const events:unknown[]=[];(window as unknown as {gridFocusEvents:unknown[]}).gridFocusEvents=events;
  for(const type of ['focusin','keydown','keyup','click'])document.addEventListener(type,event=>{
   const target=event.target instanceof HTMLElement?event.target:null,active=document.activeElement;
   const describe=(node:Element|null)=>node?{tag:node.tagName,role:node.getAttribute('role'),label:node.getAttribute('aria-label'),text:node.textContent?.slice(0,100),row:node.closest('[data-grid-row]')?.getAttribute('data-grid-row'),field:node.closest('[data-grid-field]')?.getAttribute('data-grid-field')}:null;
   events.push({type,key:'key' in event?event.key:undefined,trusted:event.isTrusted,target:describe(target),active:describe(active)});
  },true);
 });
});
test.afterEach(async({page})=>{
 await test.info().attach('native-grid-focus-events',{body:JSON.stringify(await page.evaluate(()=>(window as unknown as {gridFocusEvents:unknown[]}).gridFocusEvents??[]),null,2),contentType:'application/json'});
 expect(errors.get(page),'page errors').toEqual([]);
});

// Enter the collection through its native Tab stop before addressing a child.
// Off-entry child.focus() bypasses the collection's remembered keyboard entry.
async function enterGrid(page:Page,grid:Locator,host:Locator){
 await host.focus();
 for(let step=0;step<20;step++){
  await page.keyboard.press('Tab');
  if(await grid.evaluate(node=>node.contains(document.activeElement)))return;
 }
 throw new Error('Native Tab did not enter the grid');
}
async function focusChild(child:Locator){
 const cell=child.locator('xpath=ancestor::*[@data-grid-field][1]');
 await cell.focus();await child.focus();await expect(child).toBeFocused();
}

test('sectioned host keeps hidden selection and activity order, criteria and per-kind destinations coherent',async({page})=>{
 await page.goto(fixture('host-sectioned-operations'));
 const grid=page.getByRole('grid',{name:'Sectioned courses',exact:true});
 const selected=()=>grid.getByRole('checkbox',{name:'Select Lift and drag',exact:true});
 await expect(selected()).toBeChecked();
 await expect(grid.getByRole('button',{name:'Reorder Flight principles',exact:true})).toBeDisabled();
 await enterGrid(page,grid,page.getByRole('button',{name:'Refresh',exact:true}));
 await focusChild(grid.getByRole('button',{name:'Collapse Flight principles',exact:true}));await page.keyboard.press('Enter');
 await expect(selected()).toHaveCount(0);await expect(page.getByText('1 selected',{exact:true})).toBeVisible();
 await focusChild(grid.getByRole('button',{name:'Expand Flight principles',exact:true}));await page.keyboard.press('Enter');
 await expect(selected()).toBeChecked();
 await focusChild(grid.getByRole('button',{name:'Move Lift and drag down',exact:true}));await page.keyboard.press('Enter');
 await expect.poll(()=>rowIds(grid)).toEqual(['module-1','stable','lift','module-2','checklist','incident']);await expect(selected()).toBeChecked();
 for(const [id,label,href] of [['module-1','Flight principles','/modules/module-1'],['lift','Lift and drag','/activities/lift']]){
  await grid.locator(`tr[data-grid-row="${id}"]`).getByRole('button',{name:`Actions for ${label}`,exact:true}).click();
  await expect(page.getByRole('menuitem',{name:id==='module-1'?'Open module':'Open activity',exact:true})).toHaveAttribute('href',href);
  await page.keyboard.press('Escape');
 }
 await page.getByRole('button',{name:'Filter',exact:true}).click();await page.getByRole('button',{name:/Columns 1/}).click();
 await page.getByRole('option',{name:'Status',exact:true}).click();await page.getByRole('button',{name:'Value 1',exact:true}).click();
 const draft=page.getByRole('checkbox',{name:'draft',exact:true});await draft.focus();await expect(draft).toBeFocused();await page.keyboard.press('Space');await expect(draft).toBeChecked();await page.keyboard.press('Escape');await page.getByRole('button',{name:'Apply',exact:true}).click();
 await expect(grid.getByText('Stable flight',{exact:true})).toBeVisible();await expect(selected()).toHaveCount(0);
 await expect(grid.getByRole('button',{name:'Reorder Stable flight',exact:true})).toBeDisabled();
 await page.getByRole('button',{name:'Refresh',exact:true}).click();await expect(selected()).not.toBeChecked();
 await expect.poll(()=>rowIds(grid)).toEqual(['module-1','lift','stable','module-2','checklist','incident']);
 await page.getByRole('button',{name:'Search',exact:true}).click();const search=page.getByRole('searchbox',{name:'Search',exact:true});await search.fill('Stable');
 await expect(selected()).toHaveCount(0);await expect(grid.getByText('Stable flight',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Refresh',exact:true}).click();await expect(search).toHaveValue('');await expect(selected()).not.toBeChecked();
 await enterGrid(page,grid,page.getByRole('button',{name:'Refresh',exact:true}));await focusChild(selected());await page.keyboard.press('Space');await page.getByRole('button',{name:'Clear selection',exact:true}).click();await expect(selected()).not.toBeChecked();
});

test('debounced server search retains the old page before debounce, then accepts sort and email matching',async({page})=>{
 await page.goto(fixture('debounced-server-search-and-sort'));
 const grid=page.getByRole('grid',{name:'Server courses',exact:true});
 await expect.poll(()=>rowIds(grid)).toEqual(['course-1','course-10','course-11','course-12','course-13']);
 await expect(grid.getByRole('columnheader',{name:/Course/})).toHaveAttribute('aria-sort','ascending');
 await page.getByRole('button',{name:'Search',exact:true}).click();const search=page.getByRole('searchbox',{name:'Search',exact:true});await search.fill('Course 2');
 // The local query takes 150ms. This observation is after that latency and before
 // the 250ms debounce: removing the debounce would already replace this page.
 await page.waitForTimeout(200);expect(await rowIds(grid)).toEqual(['course-1','course-10','course-11','course-12','course-13']);
 await expect.poll(()=>rowIds(grid)).toEqual(['course-2','course-20','course-21','course-22','course-23']);
 await grid.getByRole('button',{name:'Sort Course',exact:true}).click();await page.getByRole('menuitemradio',{name:'Sort Descending',exact:true}).click();
 await expect.poll(async()=>(await rowIds(grid))[0]).toBe('course-29');
 await expect(grid.getByRole('columnheader',{name:/Course/})).toHaveAttribute('aria-sort','descending');
 await search.fill('course-3@example.test');await expect.poll(()=>rowIds(grid)).toEqual(['course-3']);
});

test('linked cards preserve list selection and one footer, then navigate natively once with Enter',async({page})=>{
 await page.goto(fixture('shared-list-and-cards'));
 const grid=page.getByRole('grid');
 await enterGrid(page,grid,page.getByRole('radio',{name:'Cards',exact:true}));
 await focusChild(page.getByRole('checkbox',{name:'Select Course 1',exact:true}));await page.keyboard.press('Space');
 await expect(page.getByRole('checkbox',{name:'Select Course 1',exact:true})).toBeChecked();
 await page.getByRole('radio',{name:'Cards',exact:true}).click();
 const link=()=>page.getByRole('link',{name:'Open Course 1',exact:true});
 await expect(link()).toHaveAttribute('href','/courses/course-1');await expect(page.getByRole('button',{name:'Next page',exact:true})).toHaveCount(1);
 await page.getByRole('radio',{name:'List',exact:true}).click();await expect(page.getByRole('checkbox',{name:'Select Course 1',exact:true})).toBeChecked();
 await page.getByRole('radio',{name:'Cards',exact:true}).click();let requests=0;
 await page.route('**/courses/course-1',async route=>{requests++;await route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Course destination</title><h1>Course destination</h1>'});});
 await link().focus();await test.info().attach('grid-events-before-navigation',{body:JSON.stringify(await page.evaluate(()=>(window as unknown as {gridFocusEvents:unknown[]}).gridFocusEvents),null,2),contentType:'application/json'});await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/courses\/course-1$/);expect(requests).toBe(1);
});
