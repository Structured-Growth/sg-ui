import {openSiteTool,closeSiteTool} from './site-tools';
import {exampleName} from './example-name';
import { test, expect } from '@playwright/test';
import { demoTokens, identities } from '../components/demo-theme';

function luminance(hex: string) {
  const rgb = hex.slice(1).match(/.{2}/g)!.map(value => parseInt(value,16)/255).map(value => value <= 0.04045 ? value/12.92 : ((value+0.055)/1.055)**2.4);
  return rgb[0]*0.2126 + rgb[1]*0.7152 + rgb[2]*0.0722;
}
function ratio(first: string, second: string) {const a=luminance(first), b=luminance(second);return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);}
test('increased palettes retain enhanced text and visible control contrast in every identity and appearance', () => {
  for (const identity of identities) for (const mode of ['light','dark'] as const) {
    const tokens = demoTokens(mode,identity.id,'increased');
    const token = (name:string) => String(tokens[`--sgui-${name}` as keyof typeof tokens]);
    for(const surface of ['surface','surface-subtle','surface-raised','surface-overlay']) {
      expect(ratio(token('text'),token(surface)),`${identity.id}/${mode} text on ${surface}`).toBeGreaterThanOrEqual(7);
      expect(ratio(token('text-muted'),token(surface)),`${identity.id}/${mode} muted text on ${surface}`).toBeGreaterThanOrEqual(7);
      expect(ratio(token('focus'),token(surface)),`${identity.id}/${mode} focus on ${surface}`).toBeGreaterThanOrEqual(3);
      expect(ratio(token('border'),token(surface)),`${identity.id}/${mode} border on ${surface}`).toBeGreaterThanOrEqual(3);
    }
    for(const action of ['action','action-hover','action-pressed']) expect(ratio(token('on-action'),token(action))).toBeGreaterThanOrEqual(7);
  }
});

test('native system changes, explicit overrides and forced colors remain scoped to live demonstrations', async ({page}) => {
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.emulateMedia({colorScheme:'light',contrast:'no-preference',forcedColors:'none'});
 await page.goto('/docs/components/button');
 const preview=page.getByRole('region',{name:exampleName('Compact density')}).locator('[data-docs-preview]');
 await expect(preview).toHaveAttribute('data-sgui-theme','light');await expect(preview).toHaveAttribute('data-demo-contrast','standard');
 await page.emulateMedia({colorScheme:'dark',contrast:'more'});
 await expect(preview).toHaveAttribute('data-sgui-theme','dark');await expect(preview).toHaveAttribute('data-demo-contrast','increased');
 for(const identity of identities) {
   await openSiteTool(page,'Demo settings');await page.getByRole('button',{name:/Demo theme/}).click();await page.getByRole('option',{name:identity.label,exact:true}).click();
   await expect(preview).toHaveAttribute('data-demo-identity',identity.id);
   if(identity.id==='material') {await expect(preview.getByRole('button',{name:'Example action',exact:true})).toHaveCSS('border-radius','24px');await expect(preview).toHaveCSS('font-family','Roboto, \"Noto Sans\", Arial, sans-serif');}
   if(identity.id==='apple') await expect(preview.getByRole('button',{name:'Example action',exact:true})).toHaveCSS('border-radius','10px');
   const button=preview.getByRole('button',{name:'Example action',exact:true});
   await expect(button).toHaveCSS('background-color', identity.id==='none'?'rgb(147, 197, 253)':identity.id==='material'?'rgb(234, 221, 255)':identity.id==='editorial'?'rgb(255, 237, 213)':'rgb(179, 217, 255)');
 }
 await expect(preview.getByRole('button',{name:'Example action'})).toHaveCSS('border-radius','2px');
 await expect(preview).toHaveCSS('font-family','Georgia, "Times New Roman", serif');
 await expect(page.getByRole('navigation',{name:'Documentation'}).locator('xpath=ancestor::*[@data-sgui-scope][1]')).toHaveAttribute('data-sgui-theme','light');
 expect(await page.locator('header').filter({hasText:'Component documentation'}).evaluate(el=>getComputedStyle(el).getPropertyValue('--sgui-action').trim())).toBe('#0b233e');
 await openSiteTool(page,'Demo settings');await page.getByRole('button',{name:/Demo appearance/}).click();await page.getByRole('option',{name:'Light',exact:true}).click();
 await openSiteTool(page,'Demo settings');await page.getByRole('button',{name:/Demo contrast/}).click();await page.getByRole('option',{name:'Standard',exact:true}).click();
 await expect(preview).toHaveAttribute('data-sgui-theme','light');await expect(preview).toHaveAttribute('data-demo-contrast','standard');
 await expect(preview.getByRole('button',{name:'Example action'})).toHaveCSS('background-color','rgb(124, 45, 18)');
 await page.emulateMedia({forcedColors:'active'});
 await expect(preview).toHaveAttribute('data-demo-forced-colors','true');
 expect(await preview.evaluate(el=>getComputedStyle(el).getPropertyValue('--sgui-surface').trim())).toBe('Canvas');
 const action=preview.getByRole('button',{name:'Example action'});await action.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(action).toBeFocused();await expect(action).toHaveCSS('outline-style','solid');
 await page.emulateMedia({forcedColors:'none',colorScheme:'light',contrast:'no-preference'});
 await expect(preview).not.toHaveAttribute('data-demo-forced-colors','true');await expect(action).toHaveCSS('background-color','rgb(124, 45, 18)');
 await page.getByRole('navigation',{name:'Documentation'}).getByRole('button',{name:'Back to Components',exact:true}).click();
 await page.getByRole('navigation',{name:'Documentation'}).getByRole('link',{name:'Theming',exact:true}).click();
 await expect(page.getByRole('region',{name:exampleName('Demo settings')})).toHaveCount(0);
 await page.getByRole('navigation',{name:'Documentation'}).getByRole('button',{name:'Dialogs & overlays',exact:true}).click();
 await page.getByRole('navigation',{name:'Documentation'}).getByRole('link',{name:'AppModal',exact:true}).click();
 await expect(page.getByRole('button',{name:/Demo theme/})).toHaveText('Editorial');await expect(page.getByRole('button',{name:/Demo appearance/})).toHaveText('Light');await expect(page.getByRole('button',{name:/Demo contrast/})).toHaveText('Standard');
 await openSiteTool(page,'Demo settings');await page.getByRole('button',{name:/Demo appearance/}).click();await page.getByRole('option',{name:'Follow system',exact:true}).click();
 await openSiteTool(page,'Demo settings');await page.getByRole('button',{name:/Demo contrast/}).click();await page.getByRole('option',{name:'Follow system',exact:true}).click();
 await page.emulateMedia({colorScheme:'dark',contrast:'more',forcedColors:'none'});
 await openSiteTool(page,'Demo settings');await page.getByRole('button',{name:/Demo theme/}).click();await page.getByRole('option',{name:'Editorial',exact:true}).click();
 await page.getByRole('region',{name:'Prop playground',exact:true}).getByRole('button',{name:'Open example dialog'}).click();const dialog=page.getByRole('dialog',{name:'Course settings'});
 await expect(dialog.locator('xpath=ancestor::*[@data-sgui-scope][1]')).toHaveAttribute('data-sgui-theme','dark');
 await expect(dialog).toHaveCSS('scrollbar-width','thin');
 await expect(dialog.getByRole('button',{name:'Save settings'})).toHaveCSS('background-color','rgb(255, 237, 213)');
 await expect(dialog.getByRole('textbox',{name:'Course name'})).toHaveCSS('color','rgb(255, 255, 255)');
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
 expect(errors).toEqual([]);
});


test('component tools belong to the shell and use an overlay on narrow screens',async({page})=>{
 for(const route of ['/','/docs/components','/installation','/theming','/releases','/licensing']) {
   await page.goto(route);
   await expect(page.getByRole('navigation',{name:'Component tools navigation'})).toHaveCount(0);
 }
 for(const width of [1280,375]) {
   await page.setViewportSize({width,height:900});
   await page.goto('/docs/components/button');
   const main=page.locator('main#main-content');
   const tools=page.getByRole('complementary',{name:'Component tools'});
   const rail=tools.getByRole('navigation',{name:'Component tools navigation'});
   await expect(rail.getByRole('button')).toHaveCount(2);
   expect((await rail.boundingBox())!.width).toBe(40);
   const tool=rail.getByRole('button',{name:'Demo settings',exact:true});
   expect((await tool.boundingBox())!.height).toBe(32);
   expect((await tool.locator('svg').boundingBox())!.width).toBe(16);
   await expect(rail.locator('[aria-expanded="true"]')).toHaveCount(0);
   const before=(await main.boundingBox())!;
   await openSiteTool(page,'Demo settings');
   const settings=tools.getByRole('region',{name:'Demo settings',exact:true});
   await expect(settings).toBeVisible();
   await expect(settings.getByRole('heading',{name:'Demo settings',exact:true})).toHaveCSS('font-size','12px');
   await expect(settings.getByRole('button',{name:/Demo theme/})).toHaveCSS('font-size','12px');
   await expect(main.getByRole('region',{name:'Demo settings',exact:true})).toHaveCount(0);
   const after=(await main.boundingBox())!;
   if(width>832)expect(after.width).toBeLessThan(before.width);
   else expect(after.width).toBe(before.width);
   await openSiteTool(page,'Page documentation');
   await expect(settings).toBeHidden();
   const documentation=tools.getByRole('region',{name:'Component documentation',exact:true});
   await expect(documentation.getByRole('table',{name:'Button props'})).toBeVisible();
   await expect(main.getByRole('region',{name:'Component documentation',exact:true})).toHaveCount(0);
   const scroll=tools.locator('[data-sgui-part="icon-navigation-content"]').last();
   const mainTop=await main.evaluate(element=>element.scrollTop);
   await scroll.hover();await page.mouse.wheel(0,300);
   await expect.poll(()=>scroll.evaluate(element=>element.scrollTop)).toBeGreaterThan(0);
   expect(await main.evaluate(element=>element.scrollTop)).toBe(mainTop);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await page.screenshot({path:`/tmp/sgui-site-tools-${width}.png`,animations:'disabled'});
   await closeSiteTool(page);
   await expect(rail.getByRole('button',{name:'Page documentation',exact:true})).toBeFocused();
   await expect.poll(async()=>(await main.boundingBox())!.width).toBe(before.width);
   await openSiteTool(page,'Page documentation');
   await page.getByRole('navigation',{name:'Documentation',exact:true}).getByRole('link',{name:'Icon button',exact:true}).click();
   await expect(tools.getByRole('table',{name:'IconButton props',exact:true})).toBeVisible();
   await expect.poll(()=>scroll.evaluate(element=>element.scrollTop)).toBe(0);
   await expect(tools.getByRole('table',{name:'Button props',exact:true})).toHaveCount(0);
 }
});
