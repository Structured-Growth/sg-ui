import {test,expect,type Locator} from '@playwright/test';

async function assertBands(grids:Locator, forced=false) {
 const cells=await grids.evaluateAll(tables=>tables.flatMap(table=>Array.from(table.querySelectorAll<HTMLElement>('tbody [data-selected]:not([data-outside-month])')).map(cell=>{
  const td=cell.parentElement!,previous=td.previousElementSibling?.firstElementChild,next=td.nextElementSibling?.firstElementChild;
  const selected=(element:Element|null|undefined)=>Boolean(element?.hasAttribute('data-selected')&&!element.hasAttribute('data-outside-month'));
  const style=getComputedStyle(cell),box=cell.getBoundingClientRect(),adjacent=next?.getBoundingClientRect();
  return {label:cell.getAttribute('aria-label'),start:cell.hasAttribute('data-selection-start')||!selected(previous),end:cell.hasAttribute('data-selection-end')||!selected(next),
   startRadius:parseFloat(style.borderStartStartRadius),startBottomRadius:parseFloat(style.borderEndStartRadius),endRadius:parseFloat(style.borderStartEndRadius),endBottomRadius:parseFloat(style.borderEndEndRadius),
   gap:selected(next)&&adjacent?Math.abs(style.direction==='rtl'?box.left-adjacent.right:box.right-adjacent.left):0,
   borderTop:parseFloat(style.borderTopWidth),borderStart:parseFloat(style.borderInlineStartWidth),borderEnd:parseFloat(style.borderInlineEndWidth),background:style.backgroundColor};
 })));
 expect(cells.length).toBeGreaterThan(0);
 for(const cell of cells){
  expect(cell.gap,JSON.stringify(cell)).toBeLessThan(.6);
  if(cell.start)expect(cell.startRadius,JSON.stringify(cell)).toBeGreaterThan(0);else expect(cell.startRadius,JSON.stringify(cell)).toBe(0);
  if(cell.start)expect(cell.startBottomRadius,JSON.stringify(cell)).toBeGreaterThan(0);else expect(cell.startBottomRadius,JSON.stringify(cell)).toBe(0);
  if(cell.end)expect(cell.endRadius,JSON.stringify(cell)).toBeGreaterThan(0);else expect(cell.endRadius,JSON.stringify(cell)).toBe(0);
  if(cell.end)expect(cell.endBottomRadius,JSON.stringify(cell)).toBeGreaterThan(0);else expect(cell.endBottomRadius,JSON.stringify(cell)).toBe(0);
  expect(cell.background).not.toBe('rgba(0, 0, 0, 0)');
  if(forced){expect(cell.borderTop).toBeGreaterThan(0);expect(cell.borderStart).toBe(cell.start?1:0);expect(cell.borderEnd).toBe(cell.end?1:0);}
 }
}
for(const [locale,density,forced] of [['en-US','compact',false],['en-US','comfortable',false],['ar-EG','compact',false],['ar-EG','comfortable',false],['en-US','compact',true]] as const){
 test(`continuous range rows: ${locale}/${density}/forced=${forced}`,async({page},info)=>{
  await page.setViewportSize({width:1000,height:1100});
  await page.emulateMedia({forcedColors:forced?'active':'none',reducedMotion:'reduce'});
  await page.goto(`/fixtures/?id=migration-proofs-daterangeselector--reporting&embed=true&globals=locale:${locale};density:${density};theme:light`);
  await page.getByRole('option',{name:'February reporting period',exact:true}).click();
  const grids=page.getByRole('grid');await expect(grids).toHaveCount(2);
  expect((await grids.first().locator('[role="button"]:not([data-outside-month])').first().boundingBox())!.height).toBe(density==='compact'?24:36);
  for(const grid of await grids.all()){
   const target=density==='compact'?192/7:36;
   expect((await grid.boundingBox())!.width).toBeCloseTo(7*target,0);
   expect((await grid.locator('[role="button"]:not([data-outside-month])').first().boundingBox())!.width).toBeCloseTo(target,0);
  }
  await assertBands(grids,forced);
  if(forced){
   expect(await page.evaluate(()=>matchMedia('(forced-colors: active)').matches)).toBe(true);
   const colors=await grids.first().locator('[data-selected]:not([data-outside-month]) > span').first().evaluate(element=>({text:getComputedStyle(element).color,background:getComputedStyle(element).backgroundColor,parent:getComputedStyle(element.parentElement!).backgroundColor}));
   expect(colors.background).toBe(colors.parent);expect(colors.text).not.toBe(colors.background);
  }
  await info.attach('month-bands',{body:await page.screenshot({path:info.outputPath('month-bands.png'),fullPage:true}),contentType:'image/png'});
  // Day text is localized, but the ISO February/March values remain unchanged.
  const february=grids.first(),march=grids.nth(1);
  // CalendarCell's title-free date labels are locale-specific; use visible local numerals.
  const number=new Intl.NumberFormat(locale);
  const visibleDay=(grid:Locator,date:number)=>grid.locator('[role="button"]:not([data-outside-month])').filter({has:page.locator('span').filter({hasText:new RegExp(`^${number.format(date)}$`)})});
  await visibleDay(february,27).click();await visibleDay(march,4).click();await assertBands(grids,forced);
  await expect(page.locator('[data-sgui-part="date-range-draft"]')).toHaveText('2024-02-27 – 2024-03-04');
  await visibleDay(february,27).click();await visibleDay(february,27).click();await assertBands(grids,forced);
  await expect(page.locator('[data-sgui-part="date-range-draft"]')).toHaveText('2024-02-27 – 2024-02-27');
  const selected=february.locator('[data-selected]:not([data-outside-month])');await selected.focus();await page.keyboard.press('Tab');await selected.focus();
  await expect.poll(()=>selected.evaluate(element=>parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThan(0);
 });
}

test('independent Calendar dates retain separate rounded boxes',async({page})=>{
 await page.setViewportSize({width:1000,height:900});
 await page.goto('/fixtures/?id=migration-proofs-calendar--multiple&embed=true&globals=locale:en-US;density:compact;theme:light');
 await page.getByRole('button',{name:'Monday, February 5, 2024',exact:true}).click();
 await page.getByRole('button',{name:'Tuesday, February 6, 2024',exact:true}).click();
 const selected=page.getByRole('grid').first().locator('[data-selected]:not([data-outside-month])');await expect(selected).toHaveCount(2);
 const boxes=await selected.evaluateAll(elements=>elements.map(element=>{const style=getComputedStyle(element),box=element.getBoundingClientRect();return{left:box.left,right:box.right,start:parseFloat(style.borderStartStartRadius),end:parseFloat(style.borderStartEndRadius)};}));
 for(const box of boxes){expect(box.start).toBeGreaterThan(0);expect(box.end).toBeGreaterThan(0);}
 expect(Math.abs(boxes[1].left-boxes[0].right)).toBeLessThan(.6);
});
