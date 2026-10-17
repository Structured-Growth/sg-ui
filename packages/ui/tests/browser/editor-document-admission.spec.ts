import { expect, test, type Page } from '@playwright/test';
const url='/fixtures/?id=editors-pagerichtexteditorsection--document-admission&globals=a11y.manual:!true';
const value=async(page:Page,name:string)=>JSON.parse((await page.getByLabel(name,{exact:true}).textContent())!);
test('rejects unknown nodes, active author CSS and malformed image metadata without requests or partial saves',async({page},info)=>{
 const errors:string[]=[];const rejectedRequests:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://rejected-editor-style.example/**',route=>{rejectedRequests.push(route.request().url());return route.abort();});
 await page.goto(url);
 const editor=page.getByRole('textbox',{name:'Admission document',exact:true});
 await expect(editor).toBeVisible();const baseline=await value(page,'Saved admission JSON');
 const callbacks=await page.getByLabel('Admission callback count',{exact:true}).textContent();
 for(const label of ['Load unknown node','Load resource style','Load inherited typing style','Load unsafe heading','Load malformed image']){
  await page.getByRole('button',{name:label,exact:true}).click();
  await expect(page.getByRole('alert')).toHaveText('This document could not be loaded safely. The original content has not been changed.');
  await expect(editor).toHaveCount(0);await expect(page.getByRole('group',{name:'Text formatting',exact:true})).toHaveCount(0);
  expect(await value(page,'Saved admission JSON')).toEqual(baseline);
  await expect(page.getByLabel('Admission callback count',{exact:true})).toHaveText(callbacks!);
  const rejected=await value(page,'Original admission JSON');
  await page.getByRole('button',{name:'Load valid document',exact:true}).click();
  await expect(page.getByRole('alert')).toHaveCount(0);await expect(editor).toContainText('Saved course guide');
  expect(await value(page,'Saved admission JSON')).toEqual(baseline);
  await info.attach(label,{body:JSON.stringify({rejected,unchangedSaved:baseline}),contentType:'application/json'});
 }
 expect(await page.evaluate(()=>(window as unknown as {__sguiSavedHeadingExecuted?:boolean}).__sguiSavedHeadingExecuted)).toBeUndefined();
 expect(rejectedRequests).toEqual([]);expect(errors).toEqual([]);
});
test('rejected lifetime requires explicit new-key recovery and accepts a subsequent ordinary edit',async({page})=>{
 await page.goto(url);await page.getByRole('button',{name:'Load unknown node',exact:true}).click();
 await expect(page.getByRole('alert')).toBeVisible();
 await page.getByRole('button',{name:'Change same-key input',exact:true}).click();
 await expect(page.getByRole('alert')).toBeVisible();
 await expect(page.getByRole('textbox',{name:'Admission document',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Load valid document',exact:true}).click();
 const editor=page.getByRole('textbox',{name:'Admission document',exact:true});
 await editor.locator('p').filter({hasText:/^Edit this ending$/}).click();
 await page.keyboard.press('End');await page.keyboard.type(' recovered');
 await expect(editor).toContainText('Edit this ending recovered');
 await expect.poll(async()=>JSON.stringify(await value(page,'Saved admission JSON'))).toContain('Edit this ending recovered');
});

test('native copy and paste rejects unsafe same-namespace JSON, preserves selection and then accepts safe rich content',async({page},info)=>{
 const errors:string[]=[];const requests:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://rejected-editor-style.example/**',route=>{requests.push(route.request().url());return route.abort();});await page.goto(url);
 const editor=page.getByRole('textbox',{name:'Admission document',exact:true});
 const copy=async()=>{await page.getByRole('textbox',{name:'Admission clipboard source',exact:true}).focus();await page.keyboard.press('ControlOrMeta+A');await page.keyboard.press('ControlOrMeta+C');};
 const caret=async()=>{await editor.locator('p').filter({hasText:/^Edit this ending$/}).click();await page.keyboard.press('End');};
 const range=()=>editor.evaluate(()=>{const s=window.getSelection();return{anchor:s?.anchorNode?.textContent,focus:s?.focusNode?.textContent,anchorOffset:s?.anchorOffset,focusOffset:s?.focusOffset};});
 await copy();await caret();const selected=await range();const before=await value(page,'Saved admission JSON');const callbacks=await page.getByLabel('Admission callback count',{exact:true}).textContent();
 await page.keyboard.press('ControlOrMeta+V');
 await expect(page.getByRole('alert')).toHaveText('This pasted content could not be inserted safely. The document has not been changed.');
 expect(await value(page,'Saved admission JSON')).toEqual(before);await expect(page.getByLabel('Admission callback count',{exact:true})).toHaveText(callbacks!);
 await expect(editor).toBeFocused();expect(await range()).toEqual(selected);await expect(editor).not.toContainText('Rejected clipboard text');
 await page.getByRole('button',{name:'Use safe clipboard content',exact:true}).click();await copy();await caret();await page.keyboard.press('ControlOrMeta+V');
 await expect(page.getByRole('alert')).toHaveCount(0);await expect(editor).toContainText('Safe clipboard text');
 const after=await value(page,'Saved admission JSON');expect(after.root.children.slice(0,10)).toEqual(before.root.children.slice(0,10));
 expect(requests).toEqual([]);expect(errors).toEqual([]);await info.attach('native-json-clipboard',{body:JSON.stringify({before,after,selected}),contentType:'application/json'});
});
