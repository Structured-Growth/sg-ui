import {test,expect} from './fixtures';
import {checkSources} from './check-sources';

for(const slug of ['app-data-grid','data-grid-shell'])test(`${slug} playground configures pagination, content and visibility independently`,async({page})=>{
 await page.goto(`/docs/components/${slug}`);
 const panel=page.getByRole('region',{name:'Prop playground',exact:true});
 const preview=panel.locator('[data-docs-preview]');
 const comparison=page.getByRole('region',{name:/Wrapped and truncated cells/});
 const before=await comparison.locator('[data-docs-preview]').innerHTML();
 async function choose(label:string,option:string){
  await panel.getByRole('button',{name:new RegExp(`${label}$`)}).click();
  await page.getByRole('option',{name:option,exact:true}).click();
 }
 await choose('Page-size options','Small pages: 5, 10, 25');
 await expect(preview.locator('tbody tr[data-grid-row]')).toHaveCount(5);
 await choose('Initial rows per page','10');
 await expect(preview.locator('tbody tr[data-grid-row]')).toHaveCount(10);
 await panel.getByRole('textbox',{name:'Grid accessible label',exact:true}).fill('Configured courses');
 await expect(preview.getByRole('grid',{name:'Configured courses',exact:true})).toBeVisible();
 await panel.getByText('Use long course names',{exact:true}).click();
 await panel.getByText('Wrap cell text',{exact:true}).click();
 await expect(preview.locator('[data-grid-field="name"] [data-truncate="false"]').first()).toBeVisible();
 await panel.getByText('Show pagination footer',{exact:true}).click();
 await expect(preview.locator('[data-sgui-part="card-pagination-footer"]')).toHaveCount(0);
 await panel.getByText('Show Reset view',{exact:true}).click();
 await expect(preview.getByRole('button',{name:'Reset view',exact:true})).toHaveCount(0);
 if(slug==='data-grid-shell'){
  await panel.getByText('Allow view switching',{exact:true}).click();
  await expect(preview.getByRole('radiogroup',{name:'View mode'})).toHaveCount(0);
  for(const [control,action] of [['Show search action','Search'],['Show refresh action','Refresh'],['Show columns action','Columns'],['Show sort action','Sort'],['Show filter action','Filter']]){
   await panel.getByText(control,{exact:true}).click();
   await expect(preview.getByRole('button',{name:action,exact:true})).toHaveCount(0);
  }
  await panel.getByText('Show toolbar',{exact:true}).click();
  await expect(preview.locator('[data-sgui-part="data-toolbar"]')).toHaveCount(0);
 }
 await panel.getByRole('button',{name:'Show source: Prop playground',exact:true}).click();
 const code=panel.getByLabel('Source: Prop playground',{exact:true});
 await expect(code).toContainText('pageSizeOptions={[5,10,25]}');
 await expect(code).toContainText('pageSize:10');
 await expect(code).toContainText('truncate:false');
 await expect(code).toContainText('hideFooter={true}');
 await expect(code).toContainText('label="Configured courses"');
 expect(await comparison.locator('[data-docs-preview]').innerHTML()).toBe(before);
 expect(checkSources([{slug,source:await code.innerText()}])).toEqual([]);
});
