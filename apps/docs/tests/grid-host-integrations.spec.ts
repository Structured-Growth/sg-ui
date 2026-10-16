import {test,expect} from '@playwright/test';
import {exampleName} from './example-name';
import {checkSources} from './check-sources';

test('isolated persisted view survives reload and reset restores declared defaults',async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName('Persisted course view and reset'),exact:true});
 await panel.getByRole('button',{name:'Search',exact:true}).click();
 await panel.getByRole('searchbox',{name:'Search',exact:true}).fill('Course 01');
 await panel.getByRole('button',{name:'Cards',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('sgui:grid:docs-course-view-v1:v1')??'{}').state?.searchValue)).toBe('Course 01');
 await page.reload();
 await expect(panel.getByRole('button',{name:'Cards',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(panel.getByRole('heading',{name:'Course 01',exact:true})).toBeVisible();
 await panel.getByRole('button',{name:'Reset view',exact:true}).click();
 await expect(panel.getByRole('button',{name:'List',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(panel.getByRole('grid',{name:'Saved course view',exact:true})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('sgui:grid:docs-course-view-v1:v1')??'{}').state?.searchValue)).toBe('');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('sgui:grid:docs-course-view-v1:v1')!).state);
 expect(saved.paginationModel).toEqual({page:0,pageSize:5});expect(saved.sortRules).toEqual([{field:'name',direction:'asc'}]);expect(saved.filterRules).toEqual([]);expect(saved.columnOrder).toEqual(['name','status','actions']);expect(saved.selectedRowIds).toBeUndefined();
 await panel.getByRole('button',{name:'Show source: Persisted course view and reset',exact:true}).click();
 expect(checkSources([{slug:'persisted-grid',source:await panel.getByLabel('Source: Persisted course view and reset',{exact:true}).innerText()}])).toEqual([]);
});

test('server criteria accept results, discard late responses and recover from rejection',async({page})=>{
 await page.goto('/docs/components/data-grid-shell');
 const panel=page.getByRole('region',{name:exampleName('Controlled server criteria and responses'),exact:true});
 const grid=panel.getByRole('grid',{name:'Server course search',exact:true});
 await expect(grid.getByRole('row',{name:/Course 01/})).toBeVisible();
 await panel.getByRole('button',{name:'Search',exact:true}).click();
 const search=panel.getByRole('searchbox',{name:'Search',exact:true});
 await search.fill('Course 01');await search.fill('Course 02');
 await expect(grid.getByRole('row',{name:/Course 02/})).toBeVisible();
 // The deliberately slower prior request must not replace the accepted result.
 await page.waitForTimeout(700);
 await expect(grid.getByRole('row',{name:/Course 02/})).toBeVisible();
 await expect(grid.getByRole('row',{name:/Course 01/})).toHaveCount(0);
 await search.fill('fail');
 await expect(panel.getByText('Sample course request failed. Retry to recover.',{exact:true})).toBeVisible();
 await panel.getByRole('button',{name:'Retry',exact:true}).click();
 await expect(panel.getByText('Sample course request failed. Retry to recover.',{exact:true})).not.toBeVisible();
 await search.fill('');
 await expect(grid.getByRole('row',{name:/Course 01/})).toBeVisible();
 await panel.getByRole('button',{name:'Sort Course',exact:true}).click();
 await page.getByRole('menuitemradio',{name:'Sort Descending',exact:true}).click();
 await expect(grid.getByRole('row',{name:/Course 18/})).toBeVisible();
 await panel.getByRole('button',{name:'Filter',exact:true}).click();
 const filter=page.getByRole('dialog',{name:'Filter',exact:true});
 await filter.getByRole('button',{name:/Columns 1/}).click();
 await page.getByRole('option',{name:'Status',exact:true}).click();
 await filter.getByRole('button',{name:'Value 1',exact:true}).click();
 await page.getByRole('checkbox',{name:'Archived',exact:true}).locator('xpath=ancestor::label').click();
 await page.keyboard.press('Escape');
 await filter.getByRole('button',{name:'Apply',exact:true}).click();
 await expect(grid.getByRole('row',{name:/Course 16/})).toBeVisible();
 await expect(grid.getByRole('row',{name:/Course 18/})).toHaveCount(0);
 await panel.getByRole('button',{name:'Show source: Controlled server criteria and responses',exact:true}).click();
 expect(checkSources([{slug:'server-grid',source:await panel.getByLabel('Source: Controlled server criteria and responses',{exact:true}).innerText()}])).toEqual([]);
});
