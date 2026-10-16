import {exampleName} from './example-name';
import {test,expect} from '@playwright/test';
const transparent='rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)';

test('page and sidebar scroll thumbs remain visible during scrolling without hover or focus',async({page})=>{
  await page.setViewportSize({width:1280,height:650});
  await page.goto('/docs/components/button');
  const main=page.getByRole('main');
  const sidebar=page.getByRole('navigation',{name:'Documentation',exact:true});
  for(const pane of [main,sidebar]) {
    await expect.poll(()=>pane.evaluate(element=>element.scrollHeight>element.clientHeight)).toBe(true);
    const before=await pane.evaluate(element=>element.scrollTop);
    const bounds=(await pane.boundingBox())!;
    await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
    await page.mouse.wheel(0,240);
    await expect.poll(()=>pane.evaluate(element=>element.scrollTop)).toBeGreaterThan(before);
    await page.mouse.move(600,30);
    await expect(pane).toHaveAttribute('data-sgui-scrolling','');
    expect(await pane.evaluate(element=>element.matches(':hover,:focus-within'))).toBe(false);
    await expect(pane).not.toHaveCSS('scrollbar-color',transparent);
    await expect(pane).not.toHaveAttribute('data-sgui-scrolling','',{timeout:2500});
    await expect(pane).toHaveCSS('scrollbar-color',transparent);
  }
  // Keyboard scrolling uses the same native scroll signal as wheel/autoscroll.
  await main.focus();await page.keyboard.press('PageDown');
  await expect(main).toHaveAttribute('data-sgui-scrolling','');
});

test('portal dropdown scroll activity uses the shared thumb style and preserves forced colors',async({page})=>{
  await page.goto('/docs/components/typography');
  const playground=page.getByRole('region',{name:exampleName('Prop playground'),exact:true});
  await playground.getByRole('button',{name:/variant/}).click();
  const scroller=page.getByRole('listbox').locator('..');
  expect(await scroller.evaluate(element=>element.scrollHeight>element.clientHeight)).toBe(true);
  // Native scroll changes also cover dragging or middle-button autoscroll,
  // independently of any pointer-enter or wheel handler.
  await scroller.evaluate(element=>{element.scrollTop+=100;});
  await expect(scroller).toHaveAttribute('data-sgui-scrolling','');
  await expect(scroller).not.toHaveCSS('scrollbar-color',transparent);
  await page.emulateMedia({forcedColors:'active'});
  await expect(scroller).toHaveCSS('scrollbar-color','auto');
  await page.keyboard.press('Escape');
});
