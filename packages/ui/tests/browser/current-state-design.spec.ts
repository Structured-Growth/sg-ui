import {expect,test,type Locator,type Page} from '@playwright/test';

type Marker='inset'|'start'|'border';
const profiles={
 side:'foundations-foundation-catalogue--current-side-navigation-states',
 document:'foundations-foundation-catalogue--current-document-toolbar-states',
 rich:'foundations-foundation-catalogue--current-rich-toolbar-states',
 floating:'editors-floatingtextselectiontoolbar--current-formatting-states',
 color:'foundations-foundation-catalogue--current-color-preset-states',
 quarter:'foundations-foundation-catalogue--current-quarter-states',
 range:'foundations-foundation-catalogue--current-range-intent-states',
 toggle:'foundations-foundation-catalogue--current-forced-toggle-states',
};
async function snapshot(element:Locator,marker:Marker){
 return element.evaluate((node,marker)=>{
  const css=getComputedStyle(node),mark=marker==='border'?css:getComputedStyle(node,marker==='start'?'::before':'::after'),box=node.getBoundingClientRect();
  let surface='';for(let ancestor:Element|null=node;ancestor;ancestor=ancestor.parentElement){const value=getComputedStyle(ancestor).backgroundColor;if(value!=='transparent'&&value!=='rgba(0, 0, 0, 0)'){surface=value;break;}}
  if(!surface){const probe=node.ownerDocument.createElement('span');probe.style.backgroundColor='Canvas';node.ownerDocument.body.append(probe);surface=getComputedStyle(probe).backgroundColor;probe.remove();}
  return {width:box.width,height:box.height,direction:css.direction,controlMinHeight:css.minBlockSize,outlineWidth:parseFloat(css.outlineWidth),outlineStyle:css.outlineStyle,outlineOffset:css.outlineOffset,markerWidth:parseFloat(mark.borderInlineStartWidth),markerStyle:mark.borderInlineStartStyle,markerColor:mark.borderInlineStartColor,content:mark.content,inset:mark.insetInlineStart,pointerEvents:mark.pointerEvents,position:mark.position,surface,background:css.backgroundColor,color:css.color,forcedColorAdjust:css.forcedColorAdjust};
 },marker);
}
function contrast(first:string,second:string){
 const luminance=(color:string)=>{const channels=(color.match(/[\d.]+/g)??[]).slice(0,3).map(Number);expect(channels).toHaveLength(3);const rgb=channels.map(channel=>{const value=channel/255;return value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
 const values=[luminance(first),luminance(second)].sort((a,b)=>b-a);return (values[0]+.05)/(values[1]+.05);
}
async function pair(page:Page,selected:Locator,peer:Locator,marker:Marker,key='Tab'){
 const before=await snapshot(selected,marker),peerBefore=await snapshot(peer,marker);
 await selected.focus();const nativeKey=test.info().project.name==='webkit'&&process.platform==='darwin'&&/^(Shift\+)?Tab$/.test(key)?'Alt+'+key:key;await page.keyboard.press(nativeKey);await expect(peer).toBeFocused();
 const after=await snapshot(selected,marker),focus=await snapshot(peer,marker);
 expect(after.width).toBe(before.width);expect(after.height).toBe(before.height);
 expect(focus.width).toBe(peerBefore.width);expect(focus.height).toBe(peerBefore.height);
 expect(after.markerWidth).toBe(marker==='inset'?2:3);expect(after.markerStyle).toBe(marker==='inset'?'solid':'double');
 if(marker!=='border'){expect(after.content).toBe('""');expect(after.position).toBe('absolute');expect(after.pointerEvents).toBe('none');expect(after.inset).toBe(marker==='start'?'1px':'3px');expect(focus.content).not.toBe('""');}
 else{expect(focus.markerWidth).toBe(1);expect(focus.markerStyle).toBe('solid');}
 expect(focus.outlineWidth).toBeGreaterThanOrEqual(2);expect(focus.outlineStyle).toBe('solid');
 return {before,after,focus,contrast:contrast(after.markerColor,after.surface)};
}
async function labelPaint(page:Page,element:Locator,scope:Locator){
 const bounds=await element.evaluate(node=>{const range=node.ownerDocument.createRange();range.selectNodeContents(node);const rect=range.getBoundingClientRect();return {x:rect.x,y:rect.y,width:rect.width,height:rect.height};});
 const scopeBounds=(await scope.boundingBox())!;
 const viewport=await page.evaluate(()=>({width:innerWidth,height:innerHeight}));
 const png=await page.screenshot();
 const {crop,...pixels}=await page.evaluate(async({encoded,bounds,viewport})=>{
  const img=new Image();img.src='data:image/png;base64,'+encoded;await img.decode();
  const scaleX=img.width/viewport.width,scaleY=img.height/viewport.height;
  const canvas=document.createElement('canvas');canvas.width=Math.ceil(bounds.width*scaleX);canvas.height=Math.ceil(bounds.height*scaleY);
  const ctx=canvas.getContext('2d')!;
  // Crop the actual viewport bitmap using its observed CSS-to-pixel scale.
  ctx.drawImage(img,bounds.x*scaleX,bounds.y*scaleY,bounds.width*scaleX,bounds.height*scaleY,0,0,canvas.width,canvas.height);
  const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
  const luminance=(r:number,g:number,b:number)=>[r,g,b].map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  const samples:number[]=[];let min=1,max=0;
  for(let i=0;i<data.length;i+=4){
   const x=(i/4)%canvas.width,y=Math.floor(i/4/canvas.width);
   if(x<canvas.width*.1||x>=canvas.width*.9||y<canvas.height*.1||y>=canvas.height*.9)continue;
   const value=luminance(data[i],data[i+1],data[i+2]);samples.push(value);min=Math.min(min,value);max=Math.max(max,value);
  }
  // System ButtonFace can be gray. Require both painted tones and actual 3:1
  // separation without assuming a pure-white backplate or pure-black glyphs.
  const spread=max-min,dark=samples.filter(value=>value<=min+spread*.2).length,light=samples.filter(value=>value>=max-spread*.2).length;
  return {width:canvas.width,height:canvas.height,min,max,dark,light,contrast:(max+.05)/(min+.05),crop:canvas.toDataURL('image/png').split(',')[1]};
 },{encoded:png.toString('base64'),bounds,viewport});
 await test.info().attach('painted-toggle-label',{body:Buffer.from(crop,'base64'),contentType:'image/png'});
 await test.info().attach('painted-label-metrics',{body:JSON.stringify({bounds,viewport,pixels}),contentType:'application/json'});
 // Sample the inner 80% of the text Range to exclude backplate edges, borders and focus.
 expect(pixels.contrast).toBeGreaterThanOrEqual(3);expect(pixels.dark).toBeGreaterThanOrEqual(5);expect(pixels.light).toBeGreaterThanOrEqual(5);
 return {...pixels,scopeRectangle:{x:bounds.x-scopeBounds.x,y:bounds.y-scopeBounds.y,width:bounds.width,height:bounds.height}};
}
async function actualContext(scope:Locator,theme:string,density:string,direction:string){
 await expect(scope).toHaveAttribute('data-sgui-theme',theme);await expect(scope).toHaveAttribute('data-sgui-density',density);
 const observed=await scope.evaluate(node=>{const css=getComputedStyle(node),probe=node.ownerDocument.createElement('span');Object.assign(probe.style,{position:'absolute',visibility:'hidden',display:'block',blockSize:'var(--sgui-control-height)',inlineSize:'0px'});node.append(probe);const height=probe.getBoundingClientRect().height;probe.remove();return {direction:css.direction,controlHeight:height,colorScheme:css.colorScheme};});
 expect(observed.direction).toBe(direction);expect(observed.controlHeight).toBe(density==='compact'?32:44);return observed;
}
async function prepareFloating(page:Page){
 const editor=page.getByRole('textbox',{name:'Document',exact:true});await expect(editor).toBeVisible();
 await editor.evaluate(node=>{(node as HTMLElement).focus();const text=node.ownerDocument.createTreeWalker(node.querySelector('p')!,NodeFilter.SHOW_TEXT).nextNode()!,range=node.ownerDocument.createRange();range.setStart(text,0);range.setEnd(text,6);const selection=node.ownerDocument.getSelection()!;selection.removeAllRanges();selection.addRange(range);});
 await expect.poll(()=>page.evaluate(()=>getSelection()?.toString())).toBe('Select');
 await page.keyboard.press('ControlOrMeta+b');await page.keyboard.press('Alt+F10');
 await expect(page.getByRole('button',{name:'Bold',exact:true})).toHaveAttribute('aria-pressed','true');
}
for(const forcedColors of ['none','active'] as const)for(const owner of ['side','document','rich','floating','color','quarter','range'] as const){
 test(`${owner} owned selected/pending design (${forcedColors})`,async({page},info)=>{
  await page.setViewportSize({width:1200,height:1100});await page.emulateMedia({forcedColors});
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));const observations:unknown[]=[];
  for(const [theme,density,direction] of [['light','compact','ltr'],['dark','comfortable','rtl']] as const){
   await page.goto(`/fixtures/?id=${profiles[owner]}&embed=true&globals=theme:${theme};density:${density};direction:${direction}`);
   const supportsAdjustment=await page.evaluate(()=>CSS.supports('forced-color-adjust','auto'));
   if(forcedColors==='active'&&!supportsAdjustment)info.annotations.push({type:'unsupported-css-branch',description:'Forced-color adjustment/UA paint is unsupported; native selection, system-color marker geometry and focus remain checked. No forced-paint contrast claim.'});
   const active=await page.evaluate(()=>matchMedia('(forced-colors: active)').matches);test.skip(forcedColors==='active'&&!active,'No normal-mode substitution for unsupported forced colors.');expect(active).toBe(forcedColors==='active');
   const scope=page.getByTestId('current-state-scope'),context=await actualContext(scope,theme,density,direction);if(!active)expect(context.colorScheme).toContain(theme);
   const states:unknown[]=[];let capture:Buffer|undefined;
   if(owner==='side'){
    const nav=page.getByRole('navigation',{name:'State navigation'}),selected=nav.getByRole('link',{name:'Current course'}),peer=nav.getByRole('link',{name:'Course reports'});
    const observed=await pair(page,selected,peer,'start');await expect(selected).toHaveAttribute('aria-current','page');if(active&&supportsAdjustment)expect(observed.contrast).toBeGreaterThanOrEqual(3);states.push(observed);
    capture=await scope.screenshot();
    const trigger=nav.getByRole('button',{name:/State user/});const triggerBefore=await trigger.boundingBox();await trigger.click();
    await page.getByRole('menuitem',{name:'Other',exact:true}).click();
    await expect.poll(()=>trigger.evaluate(node=>node.hasAttribute('data-pending'))).toBe(true);
    await expect(trigger.locator('[role="progressbar"]')).toHaveAttribute('aria-label','Pending');await expect(trigger.locator('[role="progressbar"]')).toBeVisible();
    await info.attach(`side-pending-${theme}-${density}-${direction}-${forcedColors}`,{body:await trigger.screenshot(),contentType:'image/png'});
    await expect(page.getByRole('menuitem',{name:'Other',exact:true})).toHaveAttribute('aria-disabled','true');
    const triggerAfter=await trigger.boundingBox();expect(triggerAfter!.width).toBe(triggerBefore!.width);expect(triggerAfter!.height).toBe(triggerBefore!.height);
    states.push({pendingHeaderBefore:triggerBefore,pendingHeaderAfter:triggerAfter,pendingMarkup:true,spokenOutputClaim:false});
   }else if(owner==='document'||owner==='rich'||owner==='floating'){
    if(owner==='floating')await prepareFloating(page);
    const selected=page.getByRole('button',{name:'Bold',exact:true}),peer=page.getByRole('button',{name:'Italic',exact:true});
    const observed=await pair(page,selected,peer,'inset');await expect(selected).toHaveAttribute('aria-pressed','true');if(active&&supportsAdjustment)expect(observed.contrast).toBeGreaterThanOrEqual(3);states.push(observed);
    if(owner==='rich'){await expect(peer).toHaveAttribute('aria-pressed','mixed');const mixed=await snapshot(peer,'border');expect(mixed.markerStyle).toBe('dashed');expect(mixed.markerWidth).toBe(1);states.push({mixed});}
    else await expect(peer).toHaveAttribute('aria-pressed','false');
    capture=await scope.screenshot();
   }else if(owner==='color'){
    await page.getByRole('button',{name:'Text color',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Text color',exact:true});
    const selected=dialog.getByRole('button',{name:'Primary',exact:true}),peer=dialog.getByRole('button',{name:'Primary emphasis',exact:true});
    await expect(selected).toHaveAttribute('aria-pressed','true');const observed=await pair(page,selected,peer,'border');if(active&&supportsAdjustment)expect(observed.contrast).toBeGreaterThanOrEqual(3);states.push(observed);
    expect(await selected.evaluate(node=>getComputedStyle(node).forcedColorAdjust)).not.toBe('none');
    const fill=selected.locator('[aria-hidden="true"]');if(active&&supportsAdjustment)expect(await fill.evaluate(node=>getComputedStyle(node).forcedColorAdjust)).toBe('none');
    capture=await dialog.screenshot();
   }else if(owner==='quarter'){
    const form=page.getByRole('form',{name:'Quarter state form'});const wire=()=>form.evaluate(node=>Object.fromEntries(new FormData(node as HTMLFormElement)));const initial=await wire();
    const original=page.getByRole('button',{name:'Quarter 4',exact:true});await expect(original).toHaveAttribute('aria-pressed','true');
    const selected=page.getByRole('button',{name:'Quarter 2',exact:true}),peer=page.getByRole('button',{name:'Quarter 3',exact:true});await selected.click();await expect(selected).toHaveAttribute('aria-pressed','true');await expect(original).toHaveAttribute('aria-pressed','false');expect(await wire()).toEqual(initial);
    const observed=await pair(page,selected,peer,'inset');if(active&&supportsAdjustment)expect(observed.contrast).toBeGreaterThanOrEqual(3);states.push(observed);capture=await scope.screenshot();
    await page.getByRole('button',{name:'Apply',exact:true}).click();expect(await wire()).toEqual({'quarter.start':'2026-04-01','quarter.end':'2026-06-30'});
   }else{
    const roots=scope.locator('[data-sgui-part="date-range-selector"]'),endpoint=roots.nth(0).getByRole('group',{name:'Edit range endpoint',exact:true});
    const end=endpoint.getByRole('button',{name:'End date',exact:true}),start=endpoint.getByRole('button',{name:'Start date',exact:true});await expect(end).toHaveAttribute('aria-pressed','true');
    const endpointState=await pair(page,end,start,'inset','Shift+Tab');if(active&&supportsAdjustment)expect(endpointState.contrast).toBeGreaterThanOrEqual(3);states.push(endpointState);
    const adjustRoot=roots.nth(1);await adjustRoot.getByRole('button',{name:'Adjust dates',exact:true}).click();const operations=adjustRoot.getByRole('group',{name:'Adjust dates',exact:true});
    const whole=operations.getByRole('button',{name:'Whole range',exact:true}),adjustStart=operations.getByRole('button',{name:'Start date',exact:true});await expect(whole).toHaveAttribute('aria-pressed','true');
    const operationState=await pair(page,whole,adjustStart,'inset');if(active&&supportsAdjustment)expect(operationState.contrast).toBeGreaterThanOrEqual(3);states.push(operationState);capture=await scope.screenshot();
   }
   observations.push({theme,density,direction,forcedColors,supportsAdjustment,actual:context,states});
   await info.attach(`${owner}-${theme}-${density}-${direction}-${forcedColors}`,{body:capture!,contentType:'image/png'});
  }
  await info.attach('observed-state-geometry',{body:JSON.stringify(observations,null,2),contentType:'application/json'});expect(errors).toEqual([]);
 });
}
test('toggle selected hover retains system colors and geometry (active)',async({page},info)=>{
 await page.setViewportSize({width:1200,height:900});await page.emulateMedia({forcedColors:'active'});const observations:unknown[]=[];
 for(const [theme,density,direction] of [['light','compact','ltr'],['dark','comfortable','rtl']] as const){
  await page.goto(`/fixtures/?id=${profiles.toggle}&embed=true&globals=theme:${theme};density:${density};direction:${direction}`);
  const active=await page.evaluate(()=>matchMedia('(forced-colors: active)').matches);test.skip(!active,'No forced-color substitution.');const scope=page.getByTestId('current-state-scope'),context=await actualContext(scope,theme,density,direction);
  const selected=scope.getByRole('radio',{name:'Selected option'}),peer=scope.getByRole('radio',{name:'Other option'}),before=await snapshot(selected,'border');
  await selected.hover();await expect(selected).toHaveAttribute('data-hovered');await selected.focus();await page.keyboard.press('Tab');await peer.focus();await expect(peer).toBeFocused();
  const after=await snapshot(selected,'border'),focus=await snapshot(peer,'border');expect(after.markerWidth).toBe(3);expect(after.markerStyle).toBe('double');if(await page.evaluate(()=>CSS.supports('forced-color-adjust','auto')))expect(after.forcedColorAdjust).toBe('auto');else{expect(after.forcedColorAdjust).toBeUndefined();info.annotations.push({type:'unsupported-css-branch',description:'forced-color-adjust is unsupported; system color, glyph paint, hover, selection and geometry remain checked.'});}expect(after.width).toBe(before.width);expect(after.height).toBe(before.height);expect(focus.outlineWidth).toBeGreaterThanOrEqual(2);await expect(selected).toHaveAttribute('aria-checked','true');
  // System text/backplate colors may be translucent. Screenshot pixels include
  // that compositing; comparing raw RGBA RGB channels would incorrectly report 1:1.
  const paintedLabel=await labelPaint(page,selected,scope),actualContrast=paintedLabel.contrast;expect(actualContrast).toBeGreaterThanOrEqual(3);expect(after.color).toBe(focus.color);expect(after.background).toBe(focus.background);
  observations.push({theme,density,direction,actual:context,before,after,focus,actualContrast,paintedLabel});await info.attach(`toggle-${theme}-${density}-${direction}-active`,{body:await scope.screenshot(),contentType:'image/png'});
 }
 await info.attach('observed-state-geometry',{body:JSON.stringify(observations,null,2),contentType:'application/json'});
});
