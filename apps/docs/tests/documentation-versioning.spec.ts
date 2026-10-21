import {test,expect} from './fixtures';
test('a missing versioned page explains the fallback and keeps overview navigation usable',async({page})=>{
 await page.goto('/?documentation-unavailable=%2Fdocs%2Fcomponents%2Ffuture');
 await expect(page.getByRole('status')).toHaveText('This documentation version does not include /docs/components/future. Showing its overview.');
 await page.getByRole('navigation',{name:'Documentation',exact:true}).getByRole('link',{name:'Overview',exact:true}).click();
 await expect(page).toHaveURL(/:\d+\/$/);
 await expect(page.getByText('Showing its overview.',{exact:false})).toHaveCount(0);
 await page.getByRole('navigation',{name:'Documentation',exact:true}).getByRole('link',{name:'Installation',exact:true}).click();
 await expect(page).toHaveURL(/\/installation$/);
 await expect(page.getByText('Showing its overview.',{exact:false})).toHaveCount(0);
});
test('the built route manifest includes canonical component and general pages',async({request})=>{
 const response=await request.get('/documentation-routes.json');expect(response.ok()).toBe(true);
 const manifest=await response.json();expect(manifest.schemaVersion).toBe(1);
 expect(manifest.routes).toContain('/');expect(manifest.routes).toContain('/installation');expect(manifest.routes).toContain('/docs/components/button');
 expect(manifest.routes).not.toContain('/docs/installation');expect(new Set(manifest.routes).size).toBe(manifest.routes.length);
});
