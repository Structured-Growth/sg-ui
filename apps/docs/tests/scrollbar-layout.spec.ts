import {test,expect,type Page} from '@playwright/test';

async function geometry(page:Page) {
  return page.locator('body > [data-sgui-scope] > header, nav[aria-label="Documentation"], main#main-content, [data-docs-preview]').evaluateAll(elements=>elements.map(element=>{
    const {x,width}=element.getBoundingClientRect();return {x,width};
  }));
}
async function classicScrollbar(page:Page) {
  await page.addStyleTag({content:'html { overflow-y: scroll; scrollbar-width: auto; } html::-webkit-scrollbar { width: 17px; }'});
  // WebKit applies custom scrollbar mode only after an overflow transition.
  // Establish that test mode before sampling; it is separate from opening an overlay.
  await page.evaluate(()=>{document.documentElement.style.overflow='hidden';});
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
  await page.evaluate(()=>{document.documentElement.style.removeProperty('overflow');});
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
}
for(const width of [1280,375])test(`page geometry stays stable during scroll locking at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/docs/components/menu');
  // Use a classic scrollbar width where supported, including overlay-scrollbar hosts.
  await classicScrollbar(page);
  await expect(page.getByRole('navigation',{name:'Documentation'}).getByRole('button',{name:'Buttons & actions',exact:true})).toHaveAttribute('aria-expanded','true');
  const trigger=page.getByRole('region',{name:'Prop playground',exact:true}).locator('[data-docs-preview]').getByRole('button',{name:'Actions',exact:true});
  await trigger.scrollIntoViewIfNeeded();
  const before=await geometry(page);
  await trigger.click();await expect(page.getByRole('menu',{name:'Course actions',exact:true})).toBeVisible();
  await expect.poll(()=>geometry(page)).toEqual(before);
  await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
  await expect.poll(()=>geometry(page)).toEqual(before);
  const select=page.getByRole('button',{name:/Demo theme/});
  await select.scrollIntoViewIfNeeded();
  const beforeSelect=await geometry(page);
  await select.click();await expect(page.getByRole('option',{name:'Material Design',exact:true})).toBeVisible();
  await expect.poll(()=>geometry(page)).toEqual(beforeSelect);
  await page.keyboard.press('Escape');await expect(select).toBeFocused();
  await expect.poll(()=>geometry(page)).toEqual(beforeSelect);
  await page.goto('/docs/components/dialog');
  await classicScrollbar(page);
  const open=page.getByRole('button',{name:'Open example dialog',exact:true});
  await open.scrollIntoViewIfNeeded();
  const beforeDialog=await geometry(page);
  await open.click();await expect(page.getByRole('dialog',{name:'Course settings',exact:true})).toBeVisible();
  await expect.poll(()=>geometry(page)).toEqual(beforeDialog);
  await page.keyboard.press('Escape');await expect(open).toBeFocused();
  await expect.poll(()=>geometry(page)).toEqual(beforeDialog);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const bodyWidth=await page.locator('body').evaluate(element=>element.getBoundingClientRect().width);
  await page.setViewportSize({width:width+64,height:900});
  await expect.poll(()=>page.locator('body').evaluate(element=>element.getBoundingClientRect().width)).toBe(bodyWidth+64);
  await page.setViewportSize({width,height:900});
  await expect.poll(()=>geometry(page)).toEqual(beforeDialog);
});
