import {createRequire} from 'node:module';
const {test,expect}=createRequire(new URL('../../../../packages/ui/package.json',import.meta.url))('@playwright/test') as typeof import('../../../../packages/ui/node_modules/@playwright/test/index.js');
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const base=resolve('docs/developer/final-acceptance/wave-03-15');
const metadata=JSON.parse(readFileSync(resolve(base,'native-fixture.json'),'utf8'));
test('96 current icons: native SVG geometry, inherited/overridden/nested RTL and optical captures',async({page},info)=>{
 await page.setViewportSize({width:1440,height:1000});await page.setContent(readFileSync(resolve(base,'icons-native.html'),'utf8'));
 const evidence=await page.locator('[data-matrix] [data-icon]').evaluateAll(cells=>cells.map(cell=>{
  const svg=cell.querySelector('svg')!,box=svg.getBBox(),rect=svg.getBoundingClientRect(),style=getComputedStyle(svg);
  return {matrix:cell.closest('[data-matrix]')!.getAttribute('data-matrix')!,name:cell.getAttribute('data-icon')!,width:rect.width,height:rect.height,strokeWidth:style.strokeWidth,transform:style.transform,viewBox:svg.getAttribute('viewBox'),bounds:{x:box.x,y:box.y,width:box.width,height:box.height}};
 }));
 expect(evidence).toHaveLength(1152);
 for(const row of evidence){const size=Number(row.matrix.split('-').at(-1));expect(row.width,row.name).toBeCloseTo(size,3);expect(row.height,row.name).toBeCloseTo(size,3);expect(row.viewBox).toBe('0 0 24 24');expect(row.strokeWidth).toBe('2px');expect(row.bounds.width+row.bounds.height).toBeGreaterThan(0);
  // Centerline geometry is numerical evidence. Stroke/antialias clipping and optical
  // weight require reviewing the saved images; do not infer those from getBBox().
  expect(row.bounds.x,row.name).toBeGreaterThanOrEqual(0);expect(row.bounds.y,row.name).toBeGreaterThanOrEqual(0);expect(row.bounds.x+row.bounds.width,row.name).toBeLessThanOrEqual(24);expect(row.bounds.y+row.bounds.height,row.name).toBeLessThanOrEqual(24);
  const mirrored=row.matrix.includes('-rtl-')&&metadata.mirrored.includes(row.name);expect(row.transform,row.matrix+row.name).toBe(mirrored?'matrix(-1, 0, 0, 1, 0, 0)':'none');
 }
 const transforms=async(id:string)=>page.locator(`[data-direction-case="${id}"] svg`).evaluateAll(icons=>icons.map(icon=>getComputedStyle(icon).transform));
 expect(await transforms('default-ltr')).toEqual(['none','none']);expect(await transforms('default-rtl')).toEqual(['matrix(-1, 0, 0, 1, 0, 0)','none']);expect(await transforms('override-off')).toEqual(['none','none']);expect(await transforms('force-on')).toEqual(['matrix(-1, 0, 0, 1, 0, 0)','matrix(-1, 0, 0, 1, 0, 0)']);expect(await transforms('nested')).toEqual(['matrix(-1, 0, 0, 1, 0, 0)','none']);
 await info.attach('geometry.json',{body:JSON.stringify(evidence,null,2),contentType:'application/json'});
 for(const matrix of await page.locator('[data-matrix]').all())await matrix.screenshot({path:info.outputPath((await matrix.getAttribute('data-matrix'))+'.png')});
});
test('named theme pairs and decorative/meaningful naming in native accessibility roles',async({page},info)=>{
 await page.setContent(readFileSync(resolve(base,'icons-native.html'),'utf8'));
 const receipts=[];
 for(const pair of await page.locator('[data-pair]').all()){
  const name=(await pair.getAttribute('data-pair'))!;await page.emulateMedia({forcedColors:name.endsWith('-forced')?'active':'none'});
  await expect(pair.getByRole('img',{name:'Completed',exact:true})).toHaveCount(1);await expect(pair.getByRole('img')).toHaveCount(1);await expect(pair.getByRole('button',{name:'Add lesson',exact:true})).toHaveCount(1);
  const colors=await pair.evaluate(element=>{
   const button=element.querySelector('button')!,svg=button.querySelector('svg')!,standalone=element.querySelector('[role="img"]')!;
   const rgb=(text:string)=>{const canvas=document.createElement('canvas'),context=canvas.getContext('2d')!;canvas.width=canvas.height=1;context.fillStyle=text;context.fillRect(0,0,1,1);return Array.from(context.getImageData(0,0,1,1).data).slice(0,3);};
   const luminance=(values:number[])=>values.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
   const ratio=(foreground:string,background:string)=>{const a=luminance(rgb(foreground)),b=luminance(rgb(background));return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);};
   const surface=getComputedStyle(element).backgroundColor,text=getComputedStyle(button).color,stroke=getComputedStyle(svg).stroke,standaloneColor=getComputedStyle(standalone).stroke;
   return {surface,text,stroke,standaloneColor,textRatio:ratio(text,surface),iconRatio:ratio(stroke,surface),standaloneRatio:ratio(standaloneColor,surface),forcedColorAdjust:getComputedStyle(svg).forcedColorAdjust};
  });
  expect(colors.textRatio,name).toBeGreaterThanOrEqual(4.5);expect(colors.iconRatio,name).toBeGreaterThanOrEqual(3);expect(colors.standaloneRatio,name).toBeGreaterThanOrEqual(3);expect(colors.forcedColorAdjust).not.toBe('none');receipts.push({name,...colors});
 }
 await info.attach('named-pairs.json',{body:JSON.stringify(receipts,null,2),contentType:'application/json'});
});
