import {test,expect,type Locator} from '@playwright/test';
async function bounded(control:Locator){expect(await control.evaluate(node=>{const r=node.getBoundingClientRect();return r.width>0&&r.left>=-1&&r.right<=innerWidth+1&&node.scrollWidth<=node.clientWidth+1;})).toBe(true);}
for(const theme of ['light','dark'])for(const density of ['compact','comfortable'])for(const locale of ['en-US','ar-EG'])test(`rich editor presentation: ${theme}/${density}/${locale}`,async({page,browserName},info)=>{
 const rtl=locale==='ar-EG';const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:360,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(`/fixtures/?id=editors-pagerichtexteditorsection--localized-presentation&embed=true&globals=theme:${theme};density:${density};locale:${locale};direction:${rtl?'rtl':'ltr'}`);
 await page.addStyleTag({content:'html{font-size:150%;}'});
 const host=page.getByTestId('localized-rich-editor');const editor=host.getByRole('textbox',{name:rtl?'المستند التعليمي الطويل':'Long learning document',exact:true});
 const toolbar=host.getByRole('group',{name:rtl?'تنسيق النص':'Text formatting',exact:true});
 const scroll=host.getByRole('region',{name:rtl?'منطقة تمرير المستند':'Document scroll region',exact:true});
 await expect(editor.locator('p')).toHaveCount(18);await expect(host).toHaveCSS('direction',rtl?'rtl':'ltr');
 await bounded(host);await bounded(toolbar);await bounded(editor);
 expect(await scroll.evaluate(node=>node.clientHeight>100&&node.scrollHeight>node.clientHeight)).toBe(true);
 const capture=async(name:string,node:Locator)=>{await bounded(node);if(browserName==='chromium')await info.attach(name,{body:await node.screenshot(),contentType:'image/png'});};
 await capture('document',host);
 const insert=toolbar.getByRole('button',{name:rtl?'إدراج محتوى':'Insert',exact:true});await insert.focus();await insert.press('Enter');
 let menu=page.getByRole('menu',{name:rtl?'إدراج محتوى':'Insert',exact:true});await expect(menu).toHaveCSS('direction',rtl?'rtl':'ltr');
 await expect(menu.getByRole('menuitem')).toHaveCount(3);await capture('insert',menu);await page.keyboard.press('Escape');await expect(insert).toBeFocused();
 const align=toolbar.getByRole('button',{name:rtl?'محاذاة لليسار':'Left Align',exact:true});await align.focus();await align.press('Enter');
 menu=page.getByRole('menu',{name:rtl?'محاذاة النص':'Text alignment',exact:true});await expect(menu.getByRole('menuitemradio')).toHaveCount(6);
 await capture('alignment',menu);await menu.getByRole('menuitemradio',{name:new RegExp(rtl?'محاذاة لبداية السطر':'Start Align')}).click();
 await expect(toolbar.getByRole('button',{name:rtl?'محاذاة لبداية السطر':'Start Align',exact:true})).toBeVisible();
 const style=toolbar.getByRole('button',{name:rtl?'نمط النص':'Text style',exact:true});await style.focus();await style.press('Enter');
 menu=page.getByRole('menu',{name:rtl?'نمط النص':'Text style',exact:true});await capture('style',menu);await page.keyboard.press('Escape');await expect(style).toBeFocused();
 const color=toolbar.getByRole('button',{name:rtl?'لون النص':'Text color',exact:true});await color.click();
 const dialog=page.getByRole('dialog',{name:rtl?'لون النص':'Text color',exact:true});await expect(dialog).toHaveCSS('direction',rtl?'rtl':'ltr');
 const hex=dialog.getByRole('textbox',{name:rtl?'رمز اللون':'Hex color',exact:true});await hex.fill('bad color');await hex.press('Enter');await expect(hex).toHaveAttribute('aria-invalid','true');
 await capture('color',dialog);await hex.fill('#336699');await hex.press('Enter');await expect(hex).not.toHaveAttribute('aria-invalid','true');await page.keyboard.press('Escape');await expect(color).toBeFocused();
 // Select real document content by native keyboard; no injected DOM/Lexical range.
 await editor.locator('p').first().click();await expect(editor).toBeFocused();await page.keyboard.press('ControlOrMeta+A');
 await expect.poll(()=>page.evaluate(()=>window.getSelection()?.toString().length??0)).toBeGreaterThan(50);
 await info.attach('selection-geometry',{body:JSON.stringify(await editor.evaluate(node=>{
  const range=window.getSelection()?.rangeCount?window.getSelection()!.getRangeAt(0):null;
  const boundary=node.closest('[data-sgui-part="editor-viewport"]')!;
  return {active:document.activeElement?.getAttribute('aria-label'),rects:range?[...range.getClientRects()].map(r=>({x:r.x,y:r.y,width:r.width,height:r.height})):[],boundary:boundary.getBoundingClientRect().toJSON(),scrollTop:boundary.scrollTop};
 })),contentType:'application/json'});
 const floating=host.getByRole('group',{name:rtl?'تنسيق النص المحدد':'Selection formatting',exact:true});await expect(floating).toBeVisible();
 await expect(editor).toBeFocused();await page.keyboard.press('Alt+F10');await expect(floating.getByRole('button').first()).toBeFocused();await capture('selection',floating);
 await expect(floating.getByRole('button',{name:rtl?'عريض':'Bold',exact:true})).toBeFocused();
 await page.keyboard.press('Escape');await expect(editor).toBeFocused();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);expect(errors).toEqual([]);
});
