import {test,expect,type Locator} from '@playwright/test';
import {checkSources} from './check-sources';

async function choose(owner:Locator,label:string,value:string) {
  await owner.getByRole('button',{name:new RegExp(label)}).click();
  await owner.page().getByRole('option',{name:value,exact:true}).click();
}

test('scope playgrounds keep density and interaction independent, including overlay menus',async({page})=>{
  for(const slug of ['provider','theme-scope']) {
    await page.goto(`/docs/components/${slug}`);
    const owner=page.getByRole('region',{name:'Prop playground',exact:true});
    const preview=owner.locator('[data-docs-preview]');
    const field=preview.getByRole('textbox',{name:'Workspace name',exact:true});
    await choose(owner,'Preview density','Compact');
    await choose(owner,'Interaction mode','Pointer');
    await expect(field).toHaveCSS('min-block-size','32px');
    await choose(owner,'Interaction mode','Touch');
    expect((await field.boundingBox())!.height).toBe(44);
    await preview.getByRole('button',{name:'A scoped action',exact:true}).click();
    const menu=page.getByRole('menu',{name:'Workspace actions',exact:true});
    expect((await menu.getByRole('menuitem').first().boundingBox())!.height).toBe(44);
    await expect(menu.locator('xpath=ancestor-or-self::*[@data-sgui-scope][1]')).toHaveAttribute('data-sgui-interaction','touch');
    await page.keyboard.press('Escape');
    await choose(owner,'Interaction mode','Pointer');
    await expect(field).toHaveCSS('min-block-size','32px');
    const nav=page.getByRole('navigation',{name:'Documentation',exact:true});
    expect((await nav.getByRole('link',{name:'Overview',exact:true}).boundingBox())!.height).toBe(32);
    const sources=await owner.locator('code[aria-label^="Source:"]').allTextContents();
    expect(checkSources(sources.map((source,index)=>({slug:`${slug}-${index}`,source})))).toEqual([]);
    expect(sources.join('\n')).toContain('interactionMode="pointer"');
  }
});

test('auto sizing adapts to a touch-capable desktop without changing the desktop layout',async({browser,baseURL})=>{
  for(const hasTouch of [false,true]) {
    const context=await browser.newContext({baseURL,viewport:{width:1280,height:900},hasTouch});
    const page=await context.newPage();
    await page.goto('/docs/components/provider');
    const nav=page.getByRole('navigation',{name:'Documentation',exact:true});
    const row=nav.getByRole('link',{name:'Overview',exact:true});
    expect((await nav.boundingBox())!.width).toBe(272);
    expect((await row.boundingBox())!.height).toBe(hasTouch?44:32);
    expect((await row.locator('svg').boundingBox())!.width).toBe(hasTouch?20:16);
    const tools=page.getByRole('navigation',{name:'Component tools navigation',exact:true});
    expect((await tools.boundingBox())!.width).toBe(hasTouch?52:40);
    const tool=tools.getByRole('button',{name:'Demo settings',exact:true});
    expect((await tool.boundingBox())!.height).toBe(hasTouch?44:32);
    expect((await tool.locator('svg').boundingBox())!.width).toBe(hasTouch?20:16);
    const owner=page.getByRole('region',{name:'Prop playground',exact:true});
    await choose(owner,'Preview density','Compact');
    const field=owner.locator('[data-docs-preview]').getByRole('textbox',{name:'Workspace name',exact:true});
    await expect(field).toHaveCSS('min-block-size',hasTouch?'44px':'32px');
    if(hasTouch) {
      await choose(owner,'Interaction mode','Pointer');
      await expect(field).toHaveCSS('min-block-size','32px');
      expect((await row.boundingBox())!.height).toBe(44);
    }
    await context.close();
  }
});

test('a sizing theme customizes touch targets and navigation icons across nested scopes and portals',async({page})=>{
  await page.goto('/docs/components/theme-scope');
  const owner=page.getByRole('region',{name:'ThemeScope: Theme-sized touch targets',exact:true});
  const preview=owner.locator('[data-docs-preview]');
  const field=preview.getByRole('textbox',{name:'Workspace name',exact:true});
  expect((await field.boundingBox())!.height).toBe(48);
  const row=preview.getByRole('link',{name:'Workspace',exact:true});
  expect((await row.boundingBox())!.height).toBe(48);
  expect((await row.locator('svg').boundingBox())!.width).toBe(24);
  await preview.getByRole('button',{name:'Open workspace actions',exact:true}).click();
  const menu=page.getByRole('menu',{name:'Workspace actions',exact:true});
  expect((await menu.getByRole('menuitem').first().boundingBox())!.height).toBe(48);
  await page.keyboard.press('Escape');
  const sources=await owner.locator('code[aria-label^="Source:"]').allTextContents();
  expect(checkSources(sources.map((source,index)=>({slug:`sizing-theme-${index}`,source})))).toEqual([]);
});
