import {exampleName} from './example-name';
import {test,expect} from './fixtures';

for(const width of [1280,375])for(const scrollbar of ['native','classic'])test(`Select popup fits its labels independently of the selected value at ${width}px with ${scrollbar} scrollbars`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/docs/components/typography');
  if(scrollbar==='classic')await page.addStyleTag({content:'[data-trigger="Select"] { scrollbar-width: auto; overflow-y: scroll; } [data-trigger="Select"]::-webkit-scrollbar { width: 17px; }'});
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  const trigger=playground.getByRole('button',{name:/variant/});
  await trigger.click();
  await page.getByRole('option',{name:'h1',exact:true}).click();
  await trigger.click();
  const popup=page.getByRole('listbox');
  const scroller=popup.locator('..');
  if(scrollbar==='native') {
    await expect(scroller).toHaveCSS('scrollbar-width','thin');
    await expect(scroller).toHaveCSS('scrollbar-gutter','stable');
    await expect.poll(()=>scroller.evaluate(element=>getComputedStyle(element).scrollbarColor)).not.toBe('rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)');
  }
  const triggerWidth=(await trigger.boundingBox())!.width;
  // Compare the popup border box, including its scrollbar gutter, with the trigger.
  const bounds=(await scroller.boundingBox())!;
  expect(bounds.width).toBeGreaterThanOrEqual(triggerWidth);
  expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(width);
  for(const option of await popup.getByRole('option').all()) {
    const size=await option.evaluate(element=>{const range=document.createRange();range.selectNodeContents(element);return {lines:range.getClientRects().length,scroll:element.scrollWidth,client:element.clientWidth};});
    expect(size.lines).toBe(1);expect(size.scroll).toBeLessThanOrEqual(size.client);
  }
  await page.screenshot({path:`/tmp/sgui-dropdown-sizing-${width}-${scrollbar}.png`,animations:'disabled'});
  await page.getByRole('option',{name:'bodyAlt2',exact:true}).click();
  await expect(trigger).toContainText('bodyAlt2');await expect(trigger).toBeFocused();
  await trigger.click();
  expect((await scroller.boundingBox())!.width).toBeGreaterThanOrEqual(bounds.width);
  if(scrollbar==='native') {
    await page.emulateMedia({forcedColors:'active'});
    await expect(scroller).toHaveCSS('scrollbar-color','auto');
  }
  await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
});

for (const hasTouch of [false, true]) test(`website compact controls and portaled version options share geometry (touch=${hasTouch})`, async ({browser, baseURL}) => {
  const context = await browser.newContext({baseURL, viewport:{width:1280,height:900}, hasTouch});
  const page = await context.newPage();
  await page.goto('/docs/components/button');
  const trigger = page.getByRole('button', {name:/Documentation version/});
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  const option = page.getByRole('option', {name:'Development · unreleased', exact:true});
  await expect(option).toBeVisible();
  for (const control of [trigger, option]) {
    await expect(control).toHaveCSS('font-size','12px');
    await expect(control).toHaveCSS('padding-left','8px');
    expect((await control.boundingBox())!.height).toBe(hasTouch ? 44 : 32);
  }
  const popup = option.locator('xpath=ancestor::*[@data-sgui-scope][1]');
  await expect(popup).toHaveAttribute('data-sgui-density','compact');
  await expect(popup).toHaveCSS('font-family',await trigger.evaluate(el=>getComputedStyle(el).fontFamily));
  await page.screenshot({path:`/tmp/sgui-version-compact-${hasTouch}.png`});
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await context.close();
});

for (const width of [375,1280]) test(`Select keeps its longest-option width and ellipsizes a host-constrained value at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/docs/components/typography');
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  const trigger=playground.getByRole('button',{name:/variant/});
  const initialWidth=(await trigger.boundingBox())!.width;
  for (const label of ['h1','bodyAlt2','h6']) {
    await trigger.click();
    await page.getByRole('option',{name:label,exact:true}).click();
    expect((await trigger.boundingBox())!.width).toBe(initialWidth);
  }
  // Host CSS can constrain the field without changing its selection contract.
  await trigger.evaluate(element=>{element.parentElement!.style.inlineSize='5rem';});
  await trigger.click();
  await page.getByRole('option',{name:'bodyAlt2',exact:true}).click();
  const value=trigger.getByText('bodyAlt2',{exact:true});
  await expect(value).toHaveText('bodyAlt2');
  await expect(value).toHaveCSS('text-overflow','ellipsis');
  expect(await value.evaluate(element=>element.scrollWidth>element.clientWidth)).toBe(true);
  expect((await trigger.boundingBox())!.width).toBe(80);
  await trigger.click();
  await page.getByRole('option',{name:'h1',exact:true}).click();
  expect((await trigger.boundingBox())!.width).toBe(80);
  await expect(trigger).toBeFocused();
});
