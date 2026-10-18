import {expect,test} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

test('native adornment nesting and flat fallback preserve rendered size, value and focus',async({page,browser},info)=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.setViewportSize({width:800,height:700});
 await page.goto('/fixtures/?id=migration-proofs-popover--css-contract&globals=a11y.manual:!true');
 // Exercise the untransformed stylesheet shipped by the package. The host's
 // ordinary bundled CSS may be downleveled by Vite.
 const raw=await page.request.get('/fixtures/sgui-library-styles.css');expect(raw.ok()).toBe(true);
 const rawBytes=await raw.body(),builtBytes=await readFile(new URL('../../dist/styles.css',import.meta.url));
 expect(rawBytes.equals(builtBytes)).toBe(true);
 const stylesheetSha256=createHash('sha256').update(rawBytes).digest('hex');
 await page.addStyleTag({url:'/fixtures/sgui-library-styles.css'});
 const input=page.getByRole('textbox',{name:'Decorated note',exact:true});
 await input.fill('Native nesting note');await input.focus();
 const proof=await input.evaluate(async element=>{
  const field=element.closest('[data-sgui-part="field"]')!;
  const wrapper=field.querySelector<HTMLElement>('[data-sgui-part="field-start-icon"]')!;
  const svg=wrapper.querySelector('svg')!;
  const local=[...wrapper.classList].find(name=>name.startsWith('sgui_adornment_'))!;
  const parentSelector='.'+local,flatSelector=parentSelector+'>svg';
  const flats:CSSStyleRule[]=[];let nested:CSSStyleRule|undefined;
  function walk(rules:CSSRuleList,parent?:string){for(const rule of rules){
   const style=rule as CSSStyleRule,selector=typeof style.selectorText==='string'?style.selectorText:undefined;
   if(selector?.split(',').some(part=>part.replace(/\s+/g,'')===flatSelector))flats.push(style);
   if(parent===parentSelector&&selector?.replace(/\s+/g,'')==='&>svg')nested=style;
   if('cssRules'in rule)walk((rule as CSSGroupingRule).cssRules,selector??parent);
  }}
  for(const sheet of document.styleSheets)walk(sheet.cssRules);
  if(!flats.length||!nested)throw Error('Expected compiled flat fallback and native nested adornment rule');
  const baseline=()=>{const a=wrapper.getBoundingClientRect(),b=svg.getBoundingClientRect();return{wrapperWidth:a.width,wrapperHeight:a.height,svgWidth:b.width,svgHeight:b.height};};
  const settle=()=>new Promise<void>(done=>requestAnimationFrame(()=>requestAnimationFrame(()=>done())));
  const saved=[...flats,nested].map(rule=>({rule,cssText:rule.style.cssText}));
  const original=baseline();let nativeOnly,nativeHalf,fallbackOnly;
  try{
   for(const flat of flats){flat.style.removeProperty('inline-size');flat.style.removeProperty('block-size');}await settle();nativeOnly=baseline();
   nested.style.setProperty('inline-size','50%');await settle();nativeHalf=baseline();
   for(const{rule,cssText}of saved)rule.style.cssText=cssText;
   nested.style.removeProperty('inline-size');nested.style.removeProperty('block-size');await settle();fallbackOnly=baseline();
  }finally{for(const{rule,cssText}of saved)rule.style.cssText=cssText;await settle();}
  return{original,nativeOnly,nativeHalf,fallbackOnly,parentSelector,nativeSelector:nested.selectorText,flatSelectors:flats.map(rule=>rule.selectorText),supportsAmpersand:CSS.supports('selector(&)')};
 });
 for(const box of [proof.original,proof.nativeOnly!,proof.fallbackOnly!]){
  expect(box.wrapperWidth).toBeGreaterThan(0);expect(box.svgWidth).toBeCloseTo(box.wrapperWidth,1);expect(box.svgHeight).toBeCloseTo(box.wrapperHeight,1);
 }
 expect(proof.nativeHalf!.svgWidth).toBeCloseTo(proof.nativeHalf!.wrapperWidth/2,1);
 await expect(input).toHaveValue('Native nesting note');await expect(input).toBeFocused();
 await page.setViewportSize({width:320,height:700});
 const fit=await input.evaluate(element=>{const field=element.closest('[data-sgui-part="field"]')!,wrapper=field.querySelector('[data-sgui-part="field-start-icon"]')!,svg=wrapper.querySelector('svg')!,a=wrapper.getBoundingClientRect(),b=svg.getBoundingClientRect();return{width:a.width,svgWidth:b.width,left:b.left,right:b.right,viewport:innerWidth};});
 expect(fit.svgWidth).toBeCloseTo(fit.width,1);expect(fit.left).toBeGreaterThanOrEqual(0);expect(fit.right).toBeLessThanOrEqual(fit.viewport);
 await expect(input).toHaveValue('Native nesting note');await expect(input).toBeFocused();expect(errors).toEqual([]);
 await info.attach('native-and-fallback-parity',{body:JSON.stringify({engine:info.project.name,version:browser.version(),stylesheetSha256,proof,fit}),contentType:'application/json'});
});
