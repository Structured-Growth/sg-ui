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
 const preview=page.getByRole('region',{name:'Compact density'}).locator('[data-docs-preview]');
 await expect(preview).toHaveAttribute('data-sgui-theme','light');await expect(preview).toHaveAttribute('data-demo-contrast','standard');
 await page.emulateMedia({colorScheme:'dark',contrast:'more'});
 await expect(preview).toHaveAttribute('data-sgui-theme','dark');await expect(preview).toHaveAttribute('data-demo-contrast','increased');
 for(const identity of identities) {
   await page.getByRole('button',{name:/Demo theme/}).click();await page.getByRole('option',{name:identity.label,exact:true}).click();
   await expect(preview).toHaveAttribute('data-demo-identity',identity.id);
   if(identity.id==='material') {await expect(preview.getByRole('button',{name:'Example action',exact:true})).toHaveCSS('border-radius','24px');await expect(preview).toHaveCSS('font-family','Roboto, \"Noto Sans\", Arial, sans-serif');}
   if(identity.id==='apple') await expect(preview.getByRole('button',{name:'Example action',exact:true})).toHaveCSS('border-radius','10px');
   const button=preview.getByRole('button',{name:'Example action',exact:true});
   await expect(button).toHaveCSS('background-color', identity.id==='material'?'rgb(234, 221, 255)':identity.id==='editorial'?'rgb(255, 237, 213)':'rgb(179, 217, 255)');
 }
 await expect(preview.getByRole('button',{name:'Example action'})).toHaveCSS('border-radius','2px');
 await expect(preview).toHaveCSS('font-family','Georgia, "Times New Roman", serif');
 await expect(page.getByRole('navigation',{name:'Documentation'}).locator('xpath=ancestor::*[@data-sgui-scope][1]')).toHaveAttribute('data-sgui-theme','light');
 expect(await page.locator('header').filter({hasText:'Component documentation'}).evaluate(el=>getComputedStyle(el).getPropertyValue('--sgui-action').trim())).toBe('#4338ca');
 await page.getByRole('button',{name:/Demo appearance/}).click();await page.getByRole('option',{name:'Light',exact:true}).click();
 await page.getByRole('button',{name:/Demo contrast/}).click();await page.getByRole('option',{name:'Standard',exact:true}).click();
 await expect(preview).toHaveAttribute('data-sgui-theme','light');await expect(preview).toHaveAttribute('data-demo-contrast','standard');
 await expect(preview.getByRole('button',{name:'Example action'})).toHaveCSS('background-color','rgb(124, 45, 18)');
 await page.emulateMedia({forcedColors:'active'});
 await expect(preview).toHaveAttribute('data-demo-forced-colors','true');
 expect(await preview.evaluate(el=>getComputedStyle(el).getPropertyValue('--sgui-surface').trim())).toBe('Canvas');
 const action=preview.getByRole('button',{name:'Example action'});await action.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');await expect(action).toBeFocused();await expect(action).toHaveCSS('outline-style','solid');
 await page.emulateMedia({forcedColors:'none',colorScheme:'light',contrast:'no-preference'});
 await expect(preview).not.toHaveAttribute('data-demo-forced-colors','true');await expect(action).toHaveCSS('background-color','rgb(124, 45, 18)');
 await page.getByRole('navigation',{name:'Documentation'}).getByRole('link',{name:'Theming',exact:true}).click();
 await expect(page.getByRole('region',{name:'Demo settings'})).toHaveCount(1);await expect(page.getByRole('button',{name:/Demo theme/})).toHaveText('Editorial');
 await page.getByRole('navigation',{name:'Documentation'}).getByRole('link',{name:'Dialogs',exact:true}).click();
 await expect(page.getByRole('button',{name:/Demo theme/})).toHaveText('Editorial');await expect(page.getByRole('button',{name:/Demo appearance/})).toHaveText('Light');await expect(page.getByRole('button',{name:/Demo contrast/})).toHaveText('Standard');
 await page.getByRole('button',{name:/Demo appearance/}).click();await page.getByRole('option',{name:'Follow system',exact:true}).click();
 await page.getByRole('button',{name:/Demo contrast/}).click();await page.getByRole('option',{name:'Follow system',exact:true}).click();
 await page.emulateMedia({colorScheme:'dark',contrast:'more',forcedColors:'none'});
 await page.getByRole('button',{name:/Demo theme/}).click();await page.getByRole('option',{name:'Editorial',exact:true}).click();
 await page.getByRole('button',{name:'Open example dialog'}).click();const dialog=page.getByRole('dialog',{name:'Course settings'});
 await expect(dialog.locator('xpath=ancestor::*[@data-sgui-scope][1]')).toHaveAttribute('data-sgui-theme','dark');
 await expect(dialog.getByRole('button',{name:'Save settings'})).toHaveCSS('background-color','rgb(255, 237, 213)');
 await expect(dialog.getByRole('textbox',{name:'Course name'})).toHaveCSS('color','rgb(255, 255, 255)');
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
 expect(errors).toEqual([]);
});
