import {expect,test,type Locator} from '@playwright/test';

async function appearance(element:Locator,pseudo:'::before'|'::after') {
  return element.evaluate((node,pseudo)=>{
    const box=node.getBoundingClientRect(),css=getComputedStyle(node),mark=getComputedStyle(node,pseudo);
    let surface='';
    for(let ancestor:Element|null=node;ancestor;ancestor=ancestor.parentElement){const background=getComputedStyle(ancestor).backgroundColor;if(background!=='transparent'&&background!=='rgba(0, 0, 0, 0)'){surface=background;break;}}
    if(!surface){const probe=node.ownerDocument.createElement('span');probe.style.backgroundColor='Canvas';node.ownerDocument.body.append(probe);surface=getComputedStyle(probe).backgroundColor;probe.remove();}
    return {width:box.width,height:box.height,direction:css.direction,minHeight:parseFloat(css.minBlockSize),
      outlineWidth:parseFloat(css.outlineWidth),outlineStyle:css.outlineStyle,
      content:mark.content,pointerEvents:mark.pointerEvents,markPosition:mark.position,
      markWidth:parseFloat(mark.borderInlineStartWidth),markStyle:mark.borderInlineStartStyle,
      inset:mark.insetInlineStart,color:mark.borderInlineStartColor,surface};
  },pseudo);
}


function contrast(first:string,second:string){
  const luminance=(color:string)=>{
    const channels=(color.match(/[\d.]+/g)??[]).slice(0,3).map(Number);expect(channels).toHaveLength(3);
    const linear=channels.map(channel=>{const value=channel/255;return value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4;});
    return linear[0]*0.2126+linear[1]*0.7152+linear[2]*0.0722;
  };
  const values=[luminance(first),luminance(second)].sort((a,b)=>b-a);return (values[0]+0.05)/(values[1]+0.05);
}

for(const forcedColors of ['none','active'] as const)for(const kind of ['menu','month','year'] as const){
  test(`${kind} structural selection remains independent from focus (${forcedColors})`,async({page},info)=>{
    await page.emulateMedia({forcedColors});
    const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
    const evidence:unknown[]=[];
    // Two observed contexts, not a Cartesian theme/density/direction matrix.
    for(const [theme,density,direction] of [['light','compact','ltr'],['dark','comfortable','rtl']] as const){
      await page.goto(`/fixtures/?id=foundations-foundation-catalogue--structural-selection-indicators&embed=true&globals=theme:${theme};density:${density};direction:${direction}`);
      const forced=await page.evaluate(()=>matchMedia('(forced-colors: active)').matches);
      test.skip(forcedColors==='active'&&!forced,'No normal-color substitute for unavailable forced-color emulation.');
      expect(forced).toBe(forcedColors==='active');
      const scope=page.getByTestId('structural-indicator-scope');
      await expect(scope).toHaveAttribute('data-sgui-theme',theme);
      await expect(scope).toHaveAttribute('data-sgui-density',density);
      expect(await scope.evaluate(node=>getComputedStyle(node).direction)).toBe(direction);
      const measuredScope=await scope.evaluate(node=>{const css=getComputedStyle(node),probe=node.ownerDocument.createElement('span');Object.assign(probe.style,{position:'absolute',visibility:'hidden',display:'block',blockSize:'var(--sgui-control-height)',inlineSize:'0px',pointerEvents:'none'});node.append(probe);const controlHeight=probe.getBoundingClientRect().height;probe.remove();return {controlHeight,colorScheme:css.colorScheme,direction:css.direction};});
      expect(measuredScope.controlHeight).toBe(density==='compact'?32:44);
      if(!forced)expect(measuredScope.colorScheme).toContain(theme);
      const pseudo=kind==='menu'?'::before':'::after';
      const branches=kind==='year'?['scroll','paged']:['default'];
      let contextImage:Buffer|undefined;
      for(const branch of branches){
      const group=kind==='menu'?scope.getByRole('navigation',{name:'Current page indicators'}):scope.getByRole('group',{name:kind==='month'?'Selected month indicators':branch==='paged'?'Paged year indicators':'Selected year indicators'});
      const selected=kind==='menu'?group.getByRole('link',{name:'Current course'}):group.getByRole('button',{name:kind==='month'?'April':'2026',exact:true});
      const other=kind==='menu'?group.getByRole('link',{name:'Course reports'}):group.getByRole('button',{name:kind==='month'?'May':branch==='paged'?'2028':'2030',exact:true});
      const before=await appearance(selected,pseudo);
      await selected.focus();
      await page.keyboard.press(kind==='year'&&branch==='scroll'?'ArrowDown':'Tab');
      await expect(other).toBeFocused();
      const after=await appearance(selected,pseudo),focus=await appearance(other,pseudo);
      expect(after.width).toBe(before.width);expect(after.height).toBe(before.height);
      expect(after.content).toBe('""');expect(after.markPosition).toBe('absolute');expect(after.pointerEvents).toBe('none');
      expect(after.markWidth).toBe(kind==='menu'?3:2);expect(after.markStyle).toBe(kind==='menu'?'double':'solid');
      expect(after.inset).toBe(kind==='menu'?'1px':'3px');
      expect(after.color).not.toBe('rgba(0, 0, 0, 0)');
      expect(focus.content).not.toBe('""');
      expect(focus.outlineWidth).toBeGreaterThanOrEqual(kind==='menu'&&forced?1:2);
      expect(focus.outlineStyle).toBe('solid');
      const ringContrast=contrast(after.color,after.surface);if(forced)expect(ringContrast).toBeGreaterThanOrEqual(3);
      if(branch===branches[branches.length-1])contextImage=await (kind==='year'?scope.getByTestId('year-indicator-examples'):group).screenshot();
      if(kind==='menu')await expect(selected).toHaveAttribute('aria-current','page');
      else{
        await expect(selected).toHaveAttribute('aria-pressed','true');await expect(other).toHaveAttribute('aria-pressed','false');
        await expect(group.getByRole('button',{name:kind==='month'?'February':'2027',exact:true})).toBeDisabled();
        await other.click();
        await expect(other).toHaveAttribute('aria-pressed','true');await expect(selected).toHaveAttribute('aria-pressed','false');
        const next=await appearance(other,pseudo);expect(next.width).toBe(focus.width);expect(next.height).toBe(focus.height);expect(next.content).toBe('""');expect(next.markWidth).toBe(2);
      }
      evidence.push({theme,density,direction,forcedColors,branch,measuredScope,before,after,focus,ringContrast});
      }
      await info.attach(`${kind}-${theme}-${density}-${direction}-${forcedColors}`,{body:contextImage!,contentType:'image/png'});
    }
    await info.attach('observed-contexts-and-geometry',{body:JSON.stringify(evidence,null,2),contentType:'application/json'});
    expect(errors).toEqual([]);
  });
}
