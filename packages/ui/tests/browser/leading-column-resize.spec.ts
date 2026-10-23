import {test,expect} from '@playwright/test';
for(const kind of ['proof','catalog'])test(`${kind}: leading divider widens left, narrows right and respects limits over repeated drags`,async({page})=>{
 await page.goto('/fixtures/?id=acceptance-target-sizes--resize-targets&embed=true');
 const grid=page.getByTestId('target-pointer').getByTestId(`grid-${kind}`);
 const slider=grid.getByRole('slider',{name:/^Resize Score\b/});
 const handle=slider.locator('xpath=ancestor::*[@data-resizable-direction][1]');
 const drag=async(delta:number)=>{
  await handle.scrollIntoViewIfNeeded();const bounds=(await handle.boundingBox())!;
  await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.mouse.down();
  await page.mouse.move(bounds.x+bounds.width/2+delta,bounds.y+bounds.height/2,{steps:8});await page.mouse.up();
 };
 const before=Number(await slider.inputValue());
 await drag(-30);await expect(slider).toHaveValue(String(before+30));
 await drag(20);await expect(slider).toHaveValue(String(before+10));
 await drag(300);await expect(slider).toHaveValue('120');
 // Move farther left than the remaining range, then start a new narrowing drag.
 await drag(-100);await expect(slider).toHaveValue('220');
 await drag(-100);await expect(slider).toHaveValue('300');
 await drag(20);await expect(slider).toHaveValue('280');
});
