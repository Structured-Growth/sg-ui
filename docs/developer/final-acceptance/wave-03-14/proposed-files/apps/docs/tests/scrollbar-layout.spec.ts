import {openSiteTool} from './site-tools';
import {exampleName} from './example-name';
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
for(const width of [1920,1280,375])test(`page geometry stays stable during scroll locking at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto('/docs/components/menu');
  // Use a classic scrollbar width where supported, including overlay-scrollbar hosts.
  await classicScrollbar(page);
  await expect(page.getByRole('navigation',{name:'Documentation'}).getByRole('heading',{name:exampleName('Buttons & actions'),exact:true})).toBeVisible();
  const trigger=page.getByRole('region',{name:exampleName('Prop playground'),exact:true}).locator('[data-docs-preview]').getByRole('button',{name:'Actions',exact:true});
  await trigger.scrollIntoViewIfNeeded();
  const before=await geometry(page);
  await trigger.click();
  const menu=page.getByRole('menu',{name:'Course actions',exact:true});
  await expect(menu).toBeVisible();
  await expect(menu).toHaveCSS('scrollbar-width','thin');
  await expect(menu).toHaveCSS('scrollbar-gutter','stable');
  await expect.poll(()=>geometry(page)).toEqual(before);
  await page.keyboard.press('Escape');await expect(trigger).toBeFocused();
  await expect.poll(()=>geometry(page)).toEqual(before);
  await openSiteTool(page,'Demo settings');
  const select=page.getByRole('button',{name:/Demo theme/});
  await select.scrollIntoViewIfNeeded();
  const beforeSelect=await geometry(page);
  await select.click();await expect(page.getByRole('option',{name:'Material Design',exact:true})).toBeVisible();
  await expect.poll(()=>geometry(page)).toEqual(beforeSelect);
  await page.keyboard.press('Escape');await expect(select).toBeFocused();
  await expect.poll(()=>geometry(page)).toEqual(beforeSelect);
  await page.goto('/docs/components/dialog');
  await classicScrollbar(page);
  const open=page.getByRole('region',{name:'Prop playground',exact:true}).getByRole('button',{name:'Open example dialog',exact:true});
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


test('AppModal preserves docs shell width through live locked viewport resize', async ({page}, info) => {
  await page.setViewportSize({width:1280,height:900});
  await page.goto('/docs/components/dialog');
  await classicScrollbar(page);
  const opener=page.getByRole('region',{name:'Prop playground',exact:true}).getByRole('button',{name:'Open example dialog',exact:true});
  const dialog=page.getByRole('dialog',{name:'Course settings',exact:true});
  const observations:unknown[]=[];
  const isLocked=()=>page.evaluate(()=>getComputedStyle(document.documentElement).overflowY==='hidden');
  await opener.scrollIntoViewIfNeeded();
  const original=await geometry(page);
  await opener.click();await expect(dialog).toBeVisible();
  await expect.poll(isLocked).toBe(true);
  await expect.poll(()=>geometry(page)).toEqual(original);
  try {
    for(const width of [960,375,1280]) {
      // Resize while the native modal lock is active, then compare at the SAME
      // viewport after dismissing. Never remove/override the engine lock styles.
      await page.setViewportSize({width,height:900});
      await expect(dialog).toBeVisible();await expect.poll(isLocked).toBe(true);
      const during=await geometry(page);
      await page.keyboard.press('Escape');await expect(opener).toBeFocused();
      await expect.poll(isLocked).toBe(false);
      await expect.poll(()=>geometry(page)).toEqual(during);
      observations.push({width,locked:during,unlocked:await geometry(page)});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      await opener.click();await expect(dialog).toBeVisible();await expect.poll(isLocked).toBe(true);
      await expect.poll(()=>geometry(page)).toEqual(during);
    }
    await page.keyboard.press('Escape');await expect(opener).toBeFocused();
    await expect.poll(isLocked).toBe(false);
    await expect.poll(()=>geometry(page)).toEqual(original);
  } finally {
    await info.attach('locked-live-resize',{body:JSON.stringify(observations,null,2),contentType:'application/json'});
  }
});
