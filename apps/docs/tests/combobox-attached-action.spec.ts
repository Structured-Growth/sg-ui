import {test,expect} from './fixtures';
import {exampleName} from './example-name';

test('combobox arrow shares its editable field frame with icons and both densities',async({page},testInfo)=>{
  await page.goto('/docs/components/combo-box');
  for(const density of ['compact','comfortable']) {
    const panel=page.getByRole('region',{name:exampleName(`Icons at both ends — ${density}`),exact:true});
    await panel.scrollIntoViewIfNeeded();
    const input=panel.getByRole('combobox');
    const arrow=panel.getByRole('button',{name:'Show options Course subject',exact:true});
    const frame=panel.locator('[data-sgui-part="combo-box-control"]');
    const geometry=await frame.evaluate(element=>{
      const input=element.querySelector('input')!,button=element.querySelector('button')!;
      const box=element.getBoundingClientRect(),field=input.getBoundingClientRect(),action=button.getBoundingClientRect();
      const frameStyle=getComputedStyle(element),inputStyle=getComputedStyle(input),buttonStyle=getComputedStyle(button);
      return {frame:{x:box.x,y:box.y,right:box.right,bottom:box.bottom,height:box.height},input:{x:field.x,right:field.right,height:field.height},
        arrow:{x:action.x,y:action.y,right:action.right,bottom:action.bottom,height:action.height},
        border:frameStyle.borderTopWidth,inputBorder:inputStyle.borderTopWidth,divider:buttonStyle.borderInlineStartWidth};
    });
    expect(geometry.border).toBe('1px');expect(geometry.inputBorder).toBe('0px');expect(geometry.divider).toBe('1px');
    expect(geometry.arrow.x).toBeGreaterThan(geometry.input.right);
    expect(geometry.arrow.right).toBeLessThanOrEqual(geometry.frame.right);
    expect(geometry.arrow.y).toBeCloseTo(geometry.frame.y,0);
    expect(geometry.arrow.bottom).toBeCloseTo(geometry.frame.bottom,0);
    expect(geometry.input.height).toBeCloseTo(geometry.arrow.height,0);
    await input.click();await arrow.click();await expect(page.getByRole('option',{name:'Design systems',exact:true})).toBeVisible();
    await page.keyboard.press('Escape');
    await input.click();await input.pressSequentially('Design');
    await input.press('ArrowDown');await input.press('Enter');
    await expect(input).toHaveValue('Design systems');
    const focus=await frame.evaluate(element=>({within:element.contains(document.activeElement),outline:getComputedStyle(element).outlineStyle}));
    expect(focus.within).toBe(true);expect(focus.outline).toBe('solid');
  }
  await page.screenshot({path:testInfo.outputPath('combobox-attached-action.png')});
});
