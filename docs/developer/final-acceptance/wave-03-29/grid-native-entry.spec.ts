import {test,expect} from '../../../../packages/ui/node_modules/@playwright/test/index.mjs';
// Closes only the missing trusted Tab-entry slice; existing focus-update cases are retained.
test('native Tab enters and Shift+Tab returns to host without seeding grid focus',async({page},info)=>{
 const errors:string[]=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/fixtures/?id=migration-proofs-catalog-grid-interaction--focus-retention&embed=true');
 const grid=page.getByRole('grid',{name:'Focus courses',exact:true});
 const sibling=page.getByRole('grid',{name:'Independent focus courses',exact:true});
 await expect(grid).toBeVisible();
 const host=page.getByRole('button',{name:'Host action',exact:true});
 await host.click(); // real preceding focus target; never focus()/dispatchEvent inside collection
 await expect(host).toBeFocused();
 await page.keyboard.press('Tab');
 await expect.poll(()=>grid.evaluate(node=>node.contains(document.activeElement))).toBe(true);
 const entry=await page.locator(':focus').evaluate(node=>({tag:node.tagName,role:node.getAttribute('role'),label:node.getAttribute('aria-label'),html:node.outerHTML}));
 await page.keyboard.press('Shift+Tab');
 await expect(host).toBeFocused();
 await page.keyboard.press('Tab');
 await expect.poll(()=>grid.evaluate(node=>node.contains(document.activeElement))).toBe(true);
 await page.keyboard.press('Tab');
 await expect.poll(()=>grid.evaluate(node=>node.contains(document.activeElement))).toBe(false);
 await expect(sibling).toBeVisible();
 await expect(grid.getByRole('checkbox',{name:/Select Course/}).first()).not.toBeChecked();
 await expect(sibling.getByRole('checkbox',{name:/Select Course/}).first()).not.toBeChecked();
 await info.attach('trusted-entry-observation',{body:JSON.stringify({entry,fixture:await page.evaluate(()=>(window as Window & {__SGUI_FIXTURE__?:unknown}).__SGUI_FIXTURE__),limits:'Desktop engine keyboard input; no screen-reader or physical touch claim'}),contentType:'application/json'});
 expect(errors).toEqual([]);
});
