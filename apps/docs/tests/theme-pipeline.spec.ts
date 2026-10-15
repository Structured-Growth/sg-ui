import {openSiteTool} from './site-tools';
import {exampleName} from './example-name';
import {test,expect} from '@playwright/test';
import {checkSources} from './check-sources';
import {demoTokens,identities} from '../components/demo-theme';
const rgb=(hex:string)=>`rgb(${hex.slice(1).match(/../g)!.map(part=>parseInt(part,16)).join(', ')})`;

test('component aliases resolve locally through modes, density boundaries and live portals',async({page,context})=>{
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.emulateMedia({colorScheme:'light',contrast:'no-preference',forcedColors:'none'});
  await page.goto('/theming');
  await expect(page.getByRole('main').getByRole('heading',{level:2})).toHaveText(['The framework','1. Global theming','2. Semantic theming','3. Color palettes','4. From palettes to semantics','5. Application','6. Overrides','Inspect the token pipeline','Component token override']);
  await expect(page.getByRole('main')).not.toContainText(/Apple Human Interface|Material Design color reference|These are SGUI interpretations/);
  await page.screenshot({path:'/tmp/sgui-theming-framework.png',animations:'disabled'});
  const inspector=page.getByRole('region',{name:exampleName('Theme token pipeline')});
  await expect(inspector).toContainText('component.buttonPrimaryBackground → semantic.action → palette.material');
  const example=page.getByRole('region',{name:exampleName('Component token override'),exact:true});
  await example.getByRole('button',{name:'Show source: Component token override',exact:true}).click();
  const code=example.getByLabel('Source: Component token override',{exact:true});
  const snapshots=[{slug:'theme-default',source:(await code.textContent())!}];
  const preview=example.locator('[data-docs-preview]');
  const sibling=preview.getByRole('button',{name:'Identity button',exact:true});
  const scoped=preview.getByRole('button',{name:'Scoped button',exact:true});
  await expect(sibling).toHaveCSS('background-color',rgb('#6750a4'));
  await expect(scoped).toHaveCSS('background-color',rgb('#6750a4'));
  await example.getByRole('checkbox').locator('xpath=ancestor::label[1]').click();
  await expect(code).toContainText('"--sgui-button-primary-background": "var(--sgui-action-neutral)"');
  snapshots.push({slug:'theme-override',source:(await code.textContent())!});
  for(const identity of identities)for(const appearance of ['light','dark'] as const)for(const contrast of ['standard','increased'] as const) {
    await page.getByRole('main').getByRole('link',{name:'Inspect themed buttons →',exact:true}).click();
    await openSiteTool(page,'Demo settings');
    for(const [label,value] of [['Demo theme',identity.label],['Demo appearance',appearance==='light'?'Light':'Dark'],['Demo contrast',contrast==='standard'?'Standard':'Increased']]) {
      await page.getByRole('button',{name:new RegExp(label)}).click();await page.getByRole('option',{name:value,exact:true}).click();
    }
    await page.getByRole('navigation',{name:'Documentation'}).getByRole('button',{name:'Back to Components',exact:true}).click();
    await page.getByRole('navigation',{name:'Documentation'}).getByRole('link',{name:'Theming',exact:true}).click();
    await expect(page.getByRole('region',{name:exampleName('Demo settings'),exact:true})).toHaveCount(0);
    await example.getByRole('checkbox').locator('xpath=ancestor::label[1]').click();
    await page.mouse.move(0,0);
    const tokens=demoTokens(appearance,identity.id,contrast);
    await expect(sibling).toHaveCSS('background-color',rgb(String(tokens['--sgui-action'])));
    await expect(scoped).toHaveCSS('background-color',rgb(String(tokens['--sgui-action-neutral'])));
    await expect(scoped).toHaveCSS('color',rgb(String(tokens['--sgui-on-action-neutral'])));
    await expect(preview).toHaveAttribute('data-sgui-density','comfortable');
    await expect(preview.locator('[data-token-override]')).toHaveAttribute('data-sgui-density','compact');
    await expect(preview.getByRole('textbox',{name:'Unchanged field'})).toHaveCSS('background-color',rgb(String(tokens['--sgui-surface'])));
    await preview.getByRole('button',{name:'Open scoped dialog',exact:true}).click();
    const dialog=page.getByRole('dialog',{name:'Scoped dialog',exact:true});
    await expect(dialog.getByRole('button',{name:'Portal action'})).toHaveCSS('background-color',rgb(String(tokens['--sgui-action-neutral'])));
    await expect(dialog.locator('xpath=ancestor::*[@data-sgui-scope][1]')).toHaveAttribute('data-sgui-density','compact');
    await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
    expect(await page.locator('header').filter({hasText:'Component documentation'}).evaluate(el=>getComputedStyle(el).getPropertyValue('--sgui-action').trim())).toBe('#0b233e');
  }
  await example.getByRole('button',{name:'Show source: Component token override',exact:true}).click();
  await example.getByRole('button',{name:'Copy code: Component token override',exact:true}).click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(await code.textContent());
  await example.getByRole('checkbox').locator('xpath=ancestor::label[1]').click();await page.mouse.move(0,0);
  await expect(scoped).toHaveCSS('background-color',rgb(String(demoTokens('dark','editorial','increased')['--sgui-action'])));
  snapshots.push({slug:'theme-dark-increased',source:(await code.textContent())!});
  expect(checkSources(snapshots)).toEqual([]);
  expect(errors).toEqual([]);
});
