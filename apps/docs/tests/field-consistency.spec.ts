import {expect, test} from './fixtures';

for (const hasTouch of [false, true]) test(`adjacent select and text fields share geometry and typography (touch=${hasTouch})`, async ({browser, baseURL}) => {
  const context = await browser.newContext({baseURL, viewport:{width:1280,height:900}, hasTouch});
  const page = await context.newPage();
  await page.goto('/docs/components/menu');
  const playground = page.getByRole('region',{name:'Prop playground',exact:true});
  const input = playground.getByRole('textbox',{name:'label',exact:true});
  const select = playground.getByRole('button',{name:/placement/});
  await expect(input).toBeVisible();
  for (const enlarged of [false,true]) {
    if (enlarged) await page.addStyleTag({content:'[data-sgui-scope] { --sgui-compact-control-text-size: 1.5rem; }'});
    const metrics = async (control:typeof input) => control.evaluate(element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {height:rect.height, top:rect.top, fontSize:style.fontSize, weight:style.fontWeight, lineHeight:style.lineHeight, padding:style.padding, radius:style.borderRadius, border:style.borderWidth};
    });
    const {height:inputHeight, top:inputTop, ...inputStyle} = await metrics(input);
    const {height:selectHeight, top:selectTop, ...selectStyle} = await metrics(select);
    expect(Math.abs(selectHeight-inputHeight)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(selectTop-inputTop)).toBeLessThanOrEqual(0.5);
    expect(selectStyle).toEqual(inputStyle);
  }
  await select.click();
  await page.getByRole('option',{name:'bottom end',exact:true}).click();
  await expect(select).toContainText('bottom end');
  await expect(select).toBeFocused();
  await input.fill('Course tools');
  await expect(input).toHaveValue('Course tools');
  await page.screenshot({path:`/tmp/sgui-field-consistency-${hasTouch}.png`});
  await context.close();
});
