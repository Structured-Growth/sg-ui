import{expect,test,type Locator}from'@playwright/test';
import{waitForNativeScrollToSettle}from'./native-scroll-settling';
test.use({timezoneId:'UTC'});
async function fits(locator:Locator){
 const bounds=await locator.evaluate(element=>{const r=element.getBoundingClientRect();return{left:r.left,right:r.right,scroll:element.scrollWidth,client:element.clientWidth};});
 expect(bounds.left).toBeGreaterThanOrEqual(0);expect(bounds.right).toBeLessThanOrEqual(361);expect(bounds.scroll,JSON.stringify(bounds)).toBeLessThanOrEqual(bounds.client+1);
}
async function readableWeekdays(calendar:Locator){
 const headers=calendar.getByRole('columnheader',{includeHidden:true});await expect(headers).toHaveCount(7);
 expect(await headers.evaluateAll(elements=>elements.every(element=>{const r=element.getBoundingClientRect(),style=getComputedStyle(element);return element.scrollWidth<=element.clientWidth+1&&r.height<=parseFloat(style.lineHeight)*1.6;}))).toBe(true);
}
for(const theme of ['light','dark'])for(const density of ['compact','comfortable'])for(const locale of ['en-US','ar-EG']){
 test(`date/calendar presentation: ${theme}/${density}/${locale}`,async({page},info)=>{
  const rtl=locale==='ar-EG';await page.setViewportSize({width:360,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(`/fixtures/?id=migration-proofs-box--localized-dates-presentation&embed=true&globals=theme:${theme};density:${density};locale:${locale}`);
  const root=page.getByTestId('localized-dates');await expect(root).toHaveAttribute('lang',locale);await expect(root).toHaveAttribute('dir',rtl?'rtl':'ltr');await page.addStyleTag({content:'html{font-size:150%;}'});
  const date=root.getByTestId('date-entry');await expect(date.getByRole('spinbutton')).toHaveCount(3);const day=date.locator('[data-type="day"]');await day.focus();await day.press('ArrowUp');await expect(date.locator('input[name="review-date"]')).toHaveValue('2026-10-16');
  const time=root.getByTestId('time-entry');const hour=time.locator('[data-type="hour"]');await hour.focus();await hour.press('ArrowUp');await expect(time.locator('input[name="meeting-time"]')).toHaveValue('13:30:00');
  await fits(date);await fits(time);await fits(root.getByTestId('inline-calendar'));await fits(root.getByTestId('inline-range'));await fits(root);
  for(const [label,range]of [[rtl?'تاريخ نشر مواد التعلم':'Learning materials publication date',false],[rtl?'فترة مراجعة الخطة التعليمية':'Learning plan review period',true]]as const){
   const opener=root.getByRole('button',{name:(rtl?'اختر ':'Choose ')+label,exact:true});await opener.click();const dialog=page.getByRole('dialog',{name:label,exact:true});await expect(dialog).toBeVisible();await fits(dialog);await expect(dialog.getByRole('grid')).toHaveCount(1);await readableWeekdays(dialog);await info.attach(range?'localized-range-popup':'localized-date-popup',{body:await page.screenshot(),contentType:'image/png'});
   if(range){await dialog.getByRole('button',{name:rtl?'تطبيق':'Apply',exact:true}).click();await expect(opener).toContainText(new Intl.DateTimeFormat(locale,{calendar:'gregory',year:'numeric',month:'2-digit',day:'2-digit',timeZone:'UTC'}).format(new Date('2026-10-12T00:00:00Z')));}else await page.keyboard.press('Escape');
   await expect(dialog).toHaveCount(0);await expect(opener).toBeFocused();
  }
  const calendar=root.getByTestId('inline-calendar');await readableWeekdays(calendar);await calendar.getByRole('button',{name:rtl?'الشهر التالي':'Next month',exact:true}).click();await calendar.getByRole('button',{name:rtl?'الشهر السابق':'Previous month',exact:true}).click();
  const touchToggle=root.getByRole('button',{name:rtl?'تبديل أهداف اللمس':'Toggle touch targets',exact:true});await touchToggle.focus();await touchToggle.press('Enter');
  await expect(root).toHaveAttribute('data-sgui-interaction','touch');
  const joined=root.locator('[data-sgui-part="date-field-control-group"]');
  const inputBox=(await joined.locator(':scope > :first-child').boundingBox())!,actionBox=(await joined.getByRole('button').boundingBox())!;
  expect(actionBox.height).toBeGreaterThanOrEqual(44);
  expect(actionBox.y).toBeCloseTo(inputBox.y,1);expect(actionBox.height).toBeCloseTo(inputBox.height,1);
  expect(rtl?actionBox.x+actionBox.width:inputBox.x+inputBox.width).toBeCloseTo(rtl?inputBox.x:actionBox.x,1);
  const month=calendar.getByRole('grid').locator('..');const cells=month.getByRole('button');
  const heading=calendar.locator('header').getByRole('heading',{includeHidden:true});await expect(heading).toHaveCount(1);const headingLeft=await heading.evaluate(element=>element.getBoundingClientRect().left);
  expect(await cells.first().evaluate(element=>{const r=element.getBoundingClientRect();return Math.min(r.width,r.height);})).toBeGreaterThanOrEqual(44);
  const week=calendar.getByRole('grid').getByRole('row').nth(1).getByRole('button');await expect(week).toHaveCount(7);
  const offsets:number[]=[];
  for(const edge of [week.first(),week.last()]){
   await edge.focus();await expect(edge).toBeFocused();
   await expect.poll(()=>edge.evaluate(element=>{const r=element.getBoundingClientRect(),clip=element.closest('table')!.parentElement!.getBoundingClientRect();return r.left>=clip.left-1&&r.right<=clip.right+1;})).toBe(true);
   offsets.push(await month.evaluate(element=>element.scrollLeft));expect(await page.evaluate(()=>scrollX)).toBe(0);
   await expect.poll(()=>edge.evaluate(element=>parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThan(0);
   const focus=await edge.evaluate(element=>{const s=getComputedStyle(element);return{width:parseFloat(s.outlineWidth),offset:parseFloat(s.outlineOffset),style:s.outlineStyle};});expect(focus.width).toBeGreaterThan(0);expect(focus.style).not.toBe('none');expect(focus.offset).toBeLessThanOrEqual(-focus.width);
   const caption=await heading.evaluate(element=>{const r=element.getBoundingClientRect();return{left:r.left,right:r.right};});expect(caption.left).toBeCloseTo(headingLeft,1);expect(caption.left).toBeGreaterThanOrEqual(0);expect(caption.right).toBeLessThanOrEqual(361);
  }
  expect(Math.abs(offsets[0]-offsets[1])).toBeGreaterThan(1);
  await fits(root);await fits(root.getByTestId('inline-calendar'));await fits(root.getByTestId('inline-range'));
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);await waitForNativeScrollToSettle(root);await info.attach('localized-date-controls',{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
 });
}
