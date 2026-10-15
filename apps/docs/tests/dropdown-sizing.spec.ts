import {exampleName} from './example-name';
import {test,expect} from '@playwright/test';

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
  const bounds=(await popup.boundingBox())!;
  expect(bounds.width).toBeGreaterThan(triggerWidth);
  expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(width);
  for(const option of await popup.getByRole('option').all()) {
    const size=await option.evaluate(element=>{const range=document.createRange();range.selectNodeContents(element);return {lines:range.getClientRects().length,scroll:element.scrollWidth,client:element.clientWidth};});
    expect(size.lines).toBe(1);expect(size.scroll).toBeLessThanOrEqual(size.client);
  }
  await page.screenshot({path:`/tmp/sgui-dropdown-sizing-${width}-${scrollbar}.png`,animations:'disabled'});
  await page.getByRole('option',{name:'bodyAlt2',exact:true}).click();
  await expect(trigger).toContainText('bodyAlt2');await expect(trigger).toBeFocused();
  await trigger.click();
  expect((await popup.boundingBox())!.width).toBeGreaterThanOrEqual(bounds.width);
  if(scrollbar==='native') {
    await page.emulateMedia({forcedColors:'active'});
    await expect(scroller).toHaveCSS('scrollbar-color','auto');
  }
  await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
});
