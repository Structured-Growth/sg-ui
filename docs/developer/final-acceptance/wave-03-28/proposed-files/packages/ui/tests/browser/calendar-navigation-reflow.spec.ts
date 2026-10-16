import {expect,test} from '@playwright/test';
for(const theme of ['light','dark'])for(const density of ['compact','comfortable']){
 test(`K05 month/year navigation and resize ${theme}/${density}`,async({page},info)=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error'||message.type()==='warning')errors.push(message.text());});
  await page.setViewportSize({width:1100,height:900});
  await page.goto(`/fixtures/?id=migration-proofs-calendar--navigation-reflow&embed=true&globals=theme:${theme};density:${density}`);
  await expect(page.getByRole('grid')).toHaveCount(2);
  await expect(page.getByRole('gridcell',{selected:true})).toHaveCount(1);
  await page.getByRole('button',{name:/year/i}).click();
  await page.getByRole('option',{name:'1984',exact:true}).click();
  await page.getByRole('button',{name:'Jan month',exact:true}).click();
  await page.getByRole('option',{name:'Feb',exact:true}).click();
  // Jumps did not select a new date; original selected January 2000 is now offscreen.
  await expect(page.getByRole('gridcell',{selected:true})).toHaveCount(0);
  const leap=page.getByRole('button',{name:'Wednesday, February 29, 1984',exact:true});
  await leap.focus();await leap.press('Enter');
  await expect(leap.locator('..')).toHaveAttribute('aria-selected','true');
  for(const width of [360,1100]){
   await page.setViewportSize({width,height:900});
   await expect(leap.locator('..')).toHaveAttribute('aria-selected','true');
   await leap.focus();await expect(leap).toBeFocused();
   const bounds=await leap.evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right};});
   expect(bounds.left).toBeGreaterThanOrEqual(0);expect(bounds.right).toBeLessThanOrEqual(width+1);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);
   await info.attach(`navigation-${width}`,{body:await page.screenshot(),contentType:'image/png'});
  }
  expect(errors).toEqual([]);
 });
}
