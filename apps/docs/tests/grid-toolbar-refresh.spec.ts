import {test,expect} from './fixtures';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

for(const mode of ['List','Cards'])test(`toolbar refreshing preserves ${mode.toLowerCase()} geometry and restores the refresh action`,async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 if(mode==='Cards'){
  await panel.getByRole('button',{name:/View mode/}).click();
  await page.getByRole('option',{name:'Cards',exact:true}).click();
 }
 const shell=panel.locator('[data-sgui-part="data-grid-shell"]');
 const metrics=()=>shell.evaluate(root=>{
  const bounds=root.getBoundingClientRect();
  const content=root.querySelector('[role="grid"], [data-sgui-part="grid-cards"]')!;
  const first=content.querySelector('tbody tr[data-grid-row], [data-sgui-part="grid-card"]')!;
  return {height:bounds.height,content:content.getBoundingClientRect().top-bounds.top,first:first.getBoundingClientRect().top-bounds.top};
 });
 const before=await metrics();
 const refresh=panel.getByRole('button',{name:'Refresh',exact:true});const refreshBox=(await refresh.boundingBox())!;
 async function state(value:string){await panel.getByRole('button',{name:/Dataset state/}).click();await page.getByRole('option',{name:value,exact:true}).click();}
 await state('refreshing');
 const pending=panel.getByRole('button',{name:/^Refreshing rows/});
 await expect(pending).toHaveAttribute('aria-disabled','true');
 await expect(pending.getByRole('progressbar')).toHaveCount(1);
 expect((await pending.boundingBox())!.width).toBeCloseTo(refreshBox.width,1);
 expect(await metrics()).toEqual(before);
 await expect(panel.locator('[data-sgui-part="grid-status-message"]')).toHaveText('Refreshing rows');
 expect((await panel.locator('[data-sgui-part="status"][data-grid-state="refreshing"]').boundingBox())!.height).toBeLessThanOrEqual(1);
 await state('ready');await expect(refresh).toBeVisible();expect(await metrics()).toEqual(before);
 await state('error');
 const toolbar=shell.locator('[data-sgui-part="data-toolbar"]');
 await expect(toolbar.getByRole('alert')).toHaveText('Unable to load courses');
 await expect(toolbar.getByRole('button',{name:'Retry',exact:true})).toBeVisible();
 expect(await metrics()).toEqual(before);
 await expect(shell.locator('[data-grid-state="error"]')).toHaveCount(0);
 await toolbar.getByRole('button',{name:'Retry',exact:true}).click();
 await expect(panel.getByText('Retry requested',{exact:true})).toBeVisible();
 await state('loading');
 await expect(panel.getByText('Loading rows',{exact:true})).toBeVisible();
 await expect(shell.locator('[data-sgui-part="data-toolbar"]').getByRole('progressbar')).toHaveCount(0);
 await expect(refresh).toBeDisabled();
 await expect(shell.getByRole('progressbar')).toHaveCount(1);
 await expect(shell.locator('tbody tr[data-grid-row], [data-sgui-part="grid-card"]')).toHaveCount(0);
 const initial=page.getByRole('region',{name:exampleName('Loading dataset · comfortable'),exact:true});
 await expect(initial.locator('tbody tr[data-grid-row]')).toHaveCount(0);
 const retained=page.getByRole('region',{name:exampleName('Refreshing dataset · comfortable'),exact:true});
 await expect(retained.locator('tbody tr[data-grid-row]')).toHaveCount(6);
});

test('toolbar playground exposes pending state with matching public source',async({page})=>{
 await page.goto('/docs/components/data-toolbar');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await panel.getByRole('checkbox',{name:'Refreshing',exact:true}).locator('xpath=ancestor::label[1]').click();
 await expect(panel.getByRole('button',{name:/^Refreshing rows/}).getByRole('progressbar')).toHaveCount(1);
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;expect(source).toContain('refreshing={true}');
 expect(checkSources([{slug:'toolbar-refresh',source}])).toEqual([]);
});

test('locked first Course column has no visibility or reorder choices',async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 await panel.getByRole('button',{name:'Columns',exact:true}).click();
 const course=page.getByRole('checkbox',{name:'Course',exact:true});
 await expect(course).toBeChecked();await expect(course).toBeDisabled();
 await expect(page.getByRole('button',{name:'Move Course down',exact:true})).toHaveCount(0);
 await expect(page.locator('[data-sgui-part="column-option"][data-column-id="name"] [data-sgui-part="column-option-handle"]')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Move Status up',exact:true})).toBeDisabled();
});

test('playground density updates only its preview and copied source',async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
 const sibling=page.getByRole('region',{name:exampleName('List · comfortable'),exact:true});
 const preview=panel.locator('[data-docs-preview]');
 await expect(preview).toHaveAttribute('data-sgui-density','comfortable');
 await panel.getByRole('checkbox',{name:'Select Course 1',exact:true}).locator('xpath=ancestor::label[1]').click();
 await panel.getByRole('button',{name:/Density/}).click();
 await page.getByRole('option',{name:'Compact',exact:true}).click();
 await expect(preview).toHaveAttribute('data-sgui-density','compact');
 await expect(sibling.locator('[data-docs-preview]')).toHaveAttribute('data-sgui-density','comfortable');
 await expect(panel.getByRole('checkbox',{name:'Select Course 1',exact:true})).toBeChecked();
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const source=(await panel.getByRole('code').textContent())!;
 expect(source).toContain('<ThemeScope density="compact">');
 expect(checkSources([{slug:'grid-shell-density',source}])).toEqual([]);
 await panel.getByRole('button',{name:/Density/}).click();
 await page.getByRole('option',{name:'Comfortable',exact:true}).click();
 await expect(preview).toHaveAttribute('data-sgui-density','comfortable');
 await expect(panel.getByRole('code')).toContainText('<ThemeScope density="comfortable">');
});
