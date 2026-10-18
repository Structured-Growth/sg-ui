# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: current-state-design.spec.ts >> toggle selected hover retains system colors and geometry (active)
- Location: tests/browser/current-state-design.spec.ts:105:1

# Error details

```
Test timeout of 45000ms exceeded.
```

```
Error: locator.evaluate: Test timeout of 45000ms exceeded.
Call log:
  - waiting for getByTestId('current-state-scope').getByRole('button', { name: 'Selected option' })

```

# Page snapshot

```yaml
- radiogroup "Forced toggle choices" [ref=e5]:
  - radio "Selected option" [checked] [ref=e6] [cursor=pointer]
  - radio "Other option" [ref=e7] [cursor=pointer]
```

# Test source

```ts
  1   | import {expect,test,type Locator,type Page} from '@playwright/test';
  2   | 
  3   | type Marker='inset'|'start'|'border';
  4   | const profiles={
  5   |  side:'foundations-foundation-catalogue--current-side-navigation-states',
  6   |  document:'foundations-foundation-catalogue--current-document-toolbar-states',
  7   |  rich:'foundations-foundation-catalogue--current-rich-toolbar-states',
  8   |  floating:'editors-floatingtextselectiontoolbar--current-formatting-states',
  9   |  color:'foundations-foundation-catalogue--current-color-preset-states',
  10  |  quarter:'foundations-foundation-catalogue--current-quarter-states',
  11  |  range:'foundations-foundation-catalogue--current-range-intent-states',
  12  |  toggle:'foundations-foundation-catalogue--current-forced-toggle-states',
  13  | };
  14  | async function snapshot(element:Locator,marker:Marker){
> 15  |  return element.evaluate((node,marker)=>{
      |                 ^ Error: locator.evaluate: Test timeout of 45000ms exceeded.
  16  |   const css=getComputedStyle(node),mark=marker==='border'?css:getComputedStyle(node,marker==='start'?'::before':'::after'),box=node.getBoundingClientRect();
  17  |   let surface='';for(let ancestor:Element|null=node;ancestor;ancestor=ancestor.parentElement){const value=getComputedStyle(ancestor).backgroundColor;if(value!=='transparent'&&value!=='rgba(0, 0, 0, 0)'){surface=value;break;}}
  18  |   if(!surface){const probe=node.ownerDocument.createElement('span');probe.style.backgroundColor='Canvas';node.ownerDocument.body.append(probe);surface=getComputedStyle(probe).backgroundColor;probe.remove();}
  19  |   return {width:box.width,height:box.height,direction:css.direction,controlMinHeight:css.minBlockSize,outlineWidth:parseFloat(css.outlineWidth),outlineStyle:css.outlineStyle,outlineOffset:css.outlineOffset,markerWidth:parseFloat(mark.borderInlineStartWidth),markerStyle:mark.borderInlineStartStyle,markerColor:mark.borderInlineStartColor,content:mark.content,inset:mark.insetInlineStart,pointerEvents:mark.pointerEvents,position:mark.position,surface,background:css.backgroundColor,color:css.color,forcedColorAdjust:css.forcedColorAdjust};
  20  |  },marker);
  21  | }
  22  | function contrast(first:string,second:string){
  23  |  const luminance=(color:string)=>{const channels=(color.match(/[\d.]+/g)??[]).slice(0,3).map(Number);expect(channels).toHaveLength(3);const rgb=channels.map(channel=>{const value=channel/255;return value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
  24  |  const values=[luminance(first),luminance(second)].sort((a,b)=>b-a);return (values[0]+.05)/(values[1]+.05);
  25  | }
  26  | async function pair(page:Page,selected:Locator,peer:Locator,marker:Marker,key='Tab'){
  27  |  const before=await snapshot(selected,marker),peerBefore=await snapshot(peer,marker);
  28  |  await selected.focus();await page.keyboard.press(key);await expect(peer).toBeFocused();
  29  |  const after=await snapshot(selected,marker),focus=await snapshot(peer,marker);
  30  |  expect(after.width).toBe(before.width);expect(after.height).toBe(before.height);
  31  |  expect(focus.width).toBe(peerBefore.width);expect(focus.height).toBe(peerBefore.height);
  32  |  expect(after.markerWidth).toBe(marker==='inset'?2:3);expect(after.markerStyle).toBe(marker==='inset'?'solid':'double');
  33  |  if(marker!=='border'){expect(after.content).toBe('""');expect(after.position).toBe('absolute');expect(after.pointerEvents).toBe('none');expect(after.inset).toBe(marker==='start'?'1px':'3px');expect(focus.content).not.toBe('""');}
  34  |  else{expect(focus.markerWidth).toBe(1);expect(focus.markerStyle).toBe('solid');}
  35  |  expect(focus.outlineWidth).toBeGreaterThanOrEqual(2);expect(focus.outlineStyle).toBe('solid');
  36  |  return {before,after,focus,contrast:contrast(after.markerColor,after.surface)};
  37  | }
  38  | async function actualContext(scope:Locator,theme:string,density:string,direction:string){
  39  |  await expect(scope).toHaveAttribute('data-sgui-theme',theme);await expect(scope).toHaveAttribute('data-sgui-density',density);
  40  |  const observed=await scope.evaluate(node=>{const css=getComputedStyle(node),probe=node.ownerDocument.createElement('span');Object.assign(probe.style,{position:'absolute',visibility:'hidden',display:'block',blockSize:'var(--sgui-control-height)',inlineSize:'0px'});node.append(probe);const height=probe.getBoundingClientRect().height;probe.remove();return {direction:css.direction,controlHeight:height,colorScheme:css.colorScheme};});
  41  |  expect(observed.direction).toBe(direction);expect(observed.controlHeight).toBe(density==='compact'?32:44);return observed;
  42  | }
  43  | async function prepareFloating(page:Page){
  44  |  const editor=page.getByRole('textbox',{name:'Document',exact:true});await expect(editor).toBeVisible();
  45  |  await editor.evaluate(node=>{(node as HTMLElement).focus();const text=node.querySelector('p')!.firstChild!,range=node.ownerDocument.createRange();range.setStart(text,0);range.setEnd(text,6);const selection=node.ownerDocument.getSelection()!;selection.removeAllRanges();selection.addRange(range);});
  46  |  await expect.poll(()=>page.evaluate(()=>getSelection()?.toString())).toBe('Select');
  47  |  await page.keyboard.press('ControlOrMeta+b');await page.keyboard.press('Alt+F10');
  48  |  await expect(page.getByRole('button',{name:'Bold',exact:true})).toHaveAttribute('aria-pressed','true');
  49  | }
  50  | for(const forcedColors of ['none','active'] as const)for(const owner of ['side','document','rich','floating','color','quarter','range'] as const){
  51  |  test(`${owner} owned selected/pending design (${forcedColors})`,async({page},info)=>{
  52  |   await page.setViewportSize({width:1200,height:1100});await page.emulateMedia({forcedColors});
  53  |   const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));const observations:unknown[]=[];
  54  |   for(const [theme,density,direction] of [['light','compact','ltr'],['dark','comfortable','rtl']] as const){
  55  |    await page.goto(`/fixtures/?id=${profiles[owner]}&embed=true&globals=theme:${theme};density:${density};direction:${direction}`);
  56  |    const active=await page.evaluate(()=>matchMedia('(forced-colors: active)').matches);test.skip(forcedColors==='active'&&!active,'No normal-mode substitution for unsupported forced colors.');expect(active).toBe(forcedColors==='active');
  57  |    const scope=page.getByTestId('current-state-scope'),context=await actualContext(scope,theme,density,direction);if(!active)expect(context.colorScheme).toContain(theme);
  58  |    const states:unknown[]=[];let capture:Buffer|undefined;
  59  |    if(owner==='side'){
  60  |     const nav=page.getByRole('navigation',{name:'State navigation'}),selected=nav.getByRole('link',{name:'Current course'}),peer=nav.getByRole('link',{name:'Course reports'});
  61  |     const observed=await pair(page,selected,peer,'start');await expect(selected).toHaveAttribute('aria-current','page');if(active)expect(observed.contrast).toBeGreaterThanOrEqual(3);states.push(observed);
  62  |     capture=await scope.screenshot();
  63  |     const trigger=nav.getByRole('button',{name:/State user/});const triggerBefore=await trigger.boundingBox();await trigger.click();
  64  |     await page.getByRole('menuitem',{name:'Other',exact:true}).click();
  65  |     await expect.poll(()=>trigger.evaluate(node=>node.hasAttribute('data-pending'))).toBe(true);
  66  |     await expect(trigger.locator('[role="progressbar"]')).toHaveAttribute('aria-label','Pending');await expect(trigger.locator('[role="progressbar"]')).toBeVisible();
  67  |     await info.attach(`side-pending-${theme}-${density}-${direction}-${forcedColors}`,{body:await trigger.screenshot(),contentType:'image/png'});
  68  |     await expect(page.getByRole('menuitem',{name:'Other',exact:true})).toHaveAttribute('aria-disabled','true');
  69  |     const triggerAfter=await trigger.boundingBox();expect(triggerAfter!.width).toBe(triggerBefore!.width);expect(triggerAfter!.height).toBe(triggerBefore!.height);
  70  |     states.push({pendingHeaderBefore:triggerBefore,pendingHeaderAfter:triggerAfter,pendingMarkup:true,spokenOutputClaim:false});
  71  |    }else if(owner==='document'||owner==='rich'||owner==='floating'){
  72  |     if(owner==='floating')await prepareFloating(page);
  73  |     const selected=page.getByRole('button',{name:'Bold',exact:true}),peer=page.getByRole('button',{name:'Italic',exact:true});
  74  |     const observed=await pair(page,selected,peer,'inset');await expect(selected).toHaveAttribute('aria-pressed','true');if(active)expect(observed.contrast).toBeGreaterThanOrEqual(3);states.push(observed);
  75  |     if(owner==='rich'){await expect(peer).toHaveAttribute('aria-pressed','mixed');const mixed=await snapshot(peer,'border');expect(mixed.markerStyle).toBe('dashed');expect(mixed.markerWidth).toBe(1);states.push({mixed});}
  76  |     else await expect(peer).toHaveAttribute('aria-pressed','false');
  77  |     capture=await scope.screenshot();
  78  |    }else if(owner==='color'){
  79  |     await page.getByRole('button',{name:'Text color',exact:true}).click();const dialog=page.getByRole('dialog',{name:'Text color',exact:true});
  80  |     const selected=dialog.getByRole('button',{name:'Primary',exact:true}),peer=dialog.getByRole('button',{name:'Primary emphasis',exact:true});
  81  |     await expect(selected).toHaveAttribute('aria-pressed','true');const observed=await pair(page,selected,peer,'border');if(active)expect(observed.contrast).toBeGreaterThanOrEqual(3);states.push(observed);
  82  |     expect(await selected.evaluate(node=>getComputedStyle(node).forcedColorAdjust)).not.toBe('none');
  83  |     const fill=selected.locator('[aria-hidden="true"]');if(active)expect(await fill.evaluate(node=>getComputedStyle(node).forcedColorAdjust)).toBe('none');
  84  |     capture=await dialog.screenshot();
  85  |    }else if(owner==='quarter'){
  86  |     const form=page.getByRole('form',{name:'Quarter state form'});const wire=()=>form.evaluate(node=>Object.fromEntries(new FormData(node as HTMLFormElement)));const initial=await wire();
  87  |     const original=page.getByRole('button',{name:'Quarter 4',exact:true});await expect(original).toHaveAttribute('aria-pressed','true');
  88  |     const selected=page.getByRole('button',{name:'Quarter 2',exact:true}),peer=page.getByRole('button',{name:'Quarter 3',exact:true});await selected.click();await expect(selected).toHaveAttribute('aria-pressed','true');await expect(original).toHaveAttribute('aria-pressed','false');expect(await wire()).toEqual(initial);
  89  |     const observed=await pair(page,selected,peer,'inset');if(active)expect(observed.contrast).toBeGreaterThanOrEqual(3);states.push(observed);capture=await scope.screenshot();
  90  |     await page.getByRole('button',{name:'Apply',exact:true}).click();expect(await wire()).toEqual({'quarter.start':'2026-04-01','quarter.end':'2026-06-30'});
  91  |    }else{
  92  |     const roots=scope.locator('[data-sgui-part="date-range-selector"]'),endpoint=roots.nth(0).getByRole('group',{name:'Edit range endpoint',exact:true});
  93  |     const end=endpoint.getByRole('button',{name:'End date',exact:true}),start=endpoint.getByRole('button',{name:'Start date',exact:true});await expect(end).toHaveAttribute('aria-pressed','true');
  94  |     const endpointState=await pair(page,end,start,'inset','Shift+Tab');if(active)expect(endpointState.contrast).toBeGreaterThanOrEqual(3);states.push(endpointState);
  95  |     const adjustRoot=roots.nth(1);await adjustRoot.getByRole('button',{name:'Adjust dates',exact:true}).click();const operations=adjustRoot.getByRole('group',{name:'Adjust dates',exact:true});
  96  |     const whole=operations.getByRole('button',{name:'Whole range',exact:true}),adjustStart=operations.getByRole('button',{name:'Start date',exact:true});await expect(whole).toHaveAttribute('aria-pressed','true');
  97  |     const operationState=await pair(page,whole,adjustStart,'inset');if(active)expect(operationState.contrast).toBeGreaterThanOrEqual(3);states.push(operationState);capture=await scope.screenshot();
  98  |    }
  99  |    observations.push({theme,density,direction,forcedColors,actual:context,states});
  100 |    await info.attach(`${owner}-${theme}-${density}-${direction}-${forcedColors}`,{body:capture!,contentType:'image/png'});
  101 |   }
  102 |   await info.attach('observed-state-geometry',{body:JSON.stringify(observations,null,2),contentType:'application/json'});expect(errors).toEqual([]);
  103 |  });
  104 | }
  105 | test('toggle selected hover retains system colors and geometry (active)',async({page},info)=>{
  106 |  await page.setViewportSize({width:1200,height:900});await page.emulateMedia({forcedColors:'active'});const observations:unknown[]=[];
  107 |  for(const [theme,density,direction] of [['light','compact','ltr'],['dark','comfortable','rtl']] as const){
  108 |   await page.goto(`/fixtures/?id=${profiles.toggle}&embed=true&globals=theme:${theme};density:${density};direction:${direction}`);
  109 |   const active=await page.evaluate(()=>matchMedia('(forced-colors: active)').matches);test.skip(!active,'No forced-color substitution.');const scope=page.getByTestId('current-state-scope'),context=await actualContext(scope,theme,density,direction);
  110 |   const selected=scope.getByRole('button',{name:'Selected option'}),peer=scope.getByRole('button',{name:'Other option'}),before=await snapshot(selected,'border');
  111 |   await selected.hover();await expect(selected).toHaveAttribute('data-hovered');await selected.focus();await page.keyboard.press('Tab');await peer.focus();await expect(peer).toBeFocused();
  112 |   const after=await snapshot(selected,'border'),focus=await snapshot(peer,'border');expect(after.markerWidth).toBe(3);expect(after.markerStyle).toBe('double');expect(after.forcedColorAdjust).toBe('auto');expect(after.width).toBe(before.width);expect(after.height).toBe(before.height);expect(focus.outlineWidth).toBeGreaterThanOrEqual(2);await expect(selected).toHaveAttribute('aria-pressed','true');
  113 |   const actualContrast=contrast(after.color,after.background);expect(actualContrast).toBeGreaterThanOrEqual(3);
  114 |   observations.push({theme,density,direction,actual:context,before,after,focus,actualContrast});await info.attach(`toggle-${theme}-${density}-${direction}-active`,{body:await scope.screenshot(),contentType:'image/png'});
  115 |  }
```