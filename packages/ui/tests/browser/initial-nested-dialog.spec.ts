import {test,expect,type Locator} from '@playwright/test';
for(const strict of [false,true])test(`initial nested open authority, accessibility and topmost Escape (StrictMode=${strict})`,async({page,context,browserName},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(['error','warning'].includes(m.type()))errors.push(m.text());});
 const url=`/fixtures/?id=migration-proofs-dialog--initial-nested-stack${strict?'-strict':''}&embed=true`;
 await page.goto(url);
 const child=page.getByRole('dialog',{name:'Initially open child',exact:true});
 const parent=page.getByRole('dialog',{name:'Initially open parent',exact:true});
 const outside=page.getByRole('textbox',{name:'Outside draft',exact:true});
 const field=child.getByRole('textbox',{name:'Child initial field',exact:true});
 await expect(child).toBeVisible();await expect(field).toBeFocused();
 const inert=(node:Locator)=>node.evaluate(element=>({supportsInert:'inert'in HTMLElement.prototype,ancestorInert:!!element.closest('[inert]'),nativeInert:(element.closest('[inert]')as HTMLElement|null)?.inert??false,ariaHidden:!!element.closest('[aria-hidden="true"]')}));
 expect(await inert(child)).toEqual({supportsInert:true,ancestorInert:false,nativeInert:false,ariaHidden:false});
 expect(await inert(parent)).toMatchObject({supportsInert:true,ancestorInert:true,nativeInert:true});
 expect(await inert(outside)).toMatchObject({supportsInert:true,ancestorInert:true,nativeInert:true});
 // Playwright 1.63 role filtering omits native inert. Check browser isolation,
 // not an aria-hidden-only approximation of the accessibility tree.
 const roleQueryCounts={parent:await parent.count(),child:await child.count()};
 let ax:unknown;
 if(browserName==='chromium'){
  const session=await context.newCDPSession(page);await session.send('Accessibility.enable');const root=await session.send('DOM.getDocument');
  const inspect=async(locator:Locator)=>{
   const selectors=await locator.evaluate(el=>({id:el.id,labelledby:el.getAttribute('aria-labelledby'),role:el.getAttribute('role')}));
   const selector=selectors.id?`[id=${JSON.stringify(selectors.id)}]`:`[role=${JSON.stringify(selectors.role)}][aria-labelledby=${JSON.stringify(selectors.labelledby)}]`;
   const result=await session.send('DOM.querySelector',{nodeId:root.root.nodeId,selector});const dom=await session.send('DOM.describeNode',{nodeId:result.nodeId});
   const tree=await session.send('Accessibility.getPartialAXTree',{backendNodeId:dom.node.backendNodeId,fetchRelatives:false});return tree.nodes.find(n=>n.backendDOMNodeId===dom.node.backendNodeId);
  };
  const parentAX=await inspect(parent),childAX=await inspect(child),outsideAX=await inspect(outside);
  expect(parentAX?.ignored).toBe(true);expect(parentAX?.ignoredReasons?.some(r=>/inert/i.test(r.name))).toBe(true);
  expect(outsideAX?.ignored).toBe(true);expect(childAX?.ignored).toBe(false);ax={parentAX,childAX,outsideAX};await session.detach();
 }
 const focusAttempt=await outside.evaluate(el=>{(el as HTMLElement).focus();return document.activeElement===el;});expect(focusAttempt).toBe(false);await expect(field).toBeFocused();
 await outside.evaluate(el=>{const seen:string[]=[];(window as unknown as {outsideEvents:string[]}).outsideEvents=seen;for(const type of ['pointerdown','click','focus','input'])el.addEventListener(type,event=>seen.push(`${event.type}:${event.isTrusted}`));});
 const box=await outside.boundingBox();expect(box).not.toBeNull();await page.mouse.click(box!.x+box!.width/2,box!.y+box!.height/2);
 expect(await page.evaluate(()=>(window as unknown as {outsideEvents:string[]}).outsideEvents)).toEqual([]);await expect(outside).toHaveValue('Keep host draft');
 // Outside pointer may dismiss the topmost overlay by its controlled contract.
 // Reload for the original Escape/draft assertions; do not alter dismissal props.
 await page.goto(url);await expect(field).toBeFocused();const original=await field.elementHandle();const id=await field.getAttribute('id');await field.fill('Child draft');
 for(let i=0;i<6;i++){await page.keyboard.press('Tab');expect(await child.evaluate(node=>node.contains(document.activeElement))).toBe(true);}
 expect(await field.evaluate((node,before)=>node===before,original)).toBe(true);await expect(field).toHaveAttribute('id',id!);await expect(field).toHaveValue('Child draft');
 await page.keyboard.press('Escape');await expect(child).toHaveCount(0);await expect(parent).toBeVisible();expect(await inert(parent)).toMatchObject({ancestorInert:false,nativeInert:false,ariaHidden:false});await expect.poll(()=>parent.evaluate(node=>node.contains(document.activeElement))).toBe(true);
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);expect(await inert(outside)).toMatchObject({ancestorInert:false,nativeInert:false,ariaHidden:false});await expect(outside).toHaveValue('Keep host draft');expect(errors).toEqual([]);
 await info.attach('initial-stack-lifecycle',{body:JSON.stringify({strict,retainedChildId:id,initialChildOwnedFocus:true,topmostEscape:true,speechObserved:false}),contentType:'application/json'});
 await info.attach('native-isolation',{body:JSON.stringify({strict,browserName,roleQueryCounts,ax,focusAttempt,pointerReachedOutside:false,speechObserved:false}),contentType:'application/json'});
});
