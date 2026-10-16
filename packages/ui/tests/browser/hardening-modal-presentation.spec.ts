import {expect,test} from '@playwright/test';
import {waitForNativeScrollToSettle} from './native-scroll-settling';
for(const theme of ['light','dark'])for(const density of ['compact','comfortable'])for(const locale of ['en-US','ar-EG']){
 test(`modal presentation: ${theme}/${density}/${locale}`,async({page},info)=>{
  const rtl=locale==='ar-EG';await page.setViewportSize({width:360,height:900});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(`/fixtures/?id=overlays-appmodal--localized-presentation&embed=true&globals=theme:${theme};density:${density};locale:${locale}`);
  await page.addStyleTag({content:'html{font-size:150%;}'});
  const opener=page.getByRole('button',{name:rtl?'فتح إعدادات الدورة':'Open course settings',exact:true});await opener.click();
  const dialog=page.getByRole('dialog',{name:rtl?'مراجعة إعدادات الدورة ومواد التعلم للمجموعات الدولية':'Review course settings and learning materials for international cohorts',exact:true});
  await expect(dialog).toBeVisible();
  const input=dialog.getByRole('textbox',{name:rtl?'عنوان الدورة التدريبية':'Course title',exact:true});await expect(input).toBeFocused();
  await expect(dialog).toContainText(rtl?'الخطوة 2 من 3':'Step 2 of 3');
  const close=dialog.getByRole('button',{name:rtl?'إغلاق':'Close',exact:true});await expect(close).toBeVisible();
  const primary=dialog.getByRole('button',{name:rtl?'حفظ إعدادات الدورة للمراجعة':'Save course settings for review',exact:true});
  const cancel=dialog.getByRole('button',{name:rtl?'إلغاء التغييرات والعودة':'Cancel changes and return',exact:true});
  await input.fill(rtl?'دورة محدثة':'Updated course');await expect(input).toHaveValue(rtl?'دورة محدثة':'Updated course');
  const layout=await dialog.evaluate(element=>{const r=element.getBoundingClientRect(),s=getComputedStyle(element);return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,direction:s.direction,overflow:element.scrollWidth-element.clientWidth,
   bounded:[...element.querySelectorAll('h2,p,input,button')].every(child=>{const b=child.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1;})};});
  expect(layout.direction).toBe(rtl?'rtl':'ltr');expect(layout.left).toBeGreaterThanOrEqual(0);expect(layout.right).toBeLessThanOrEqual(361);expect(layout.top).toBeGreaterThanOrEqual(0);expect(layout.bottom).toBeLessThanOrEqual(901);expect(layout.overflow).toBeLessThanOrEqual(1);expect(layout.bounded).toBe(true);
  await primary.focus();await expect(primary).toBeFocused();await expect(primary).toBeInViewport();
  await cancel.focus();await expect(cancel).toBeFocused();await expect(cancel).toBeInViewport();
  await waitForNativeScrollToSettle(dialog);await info.attach('localized-modal',{body:await page.screenshot(),contentType:'image/png'});
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(opener).toBeFocused();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);
 });
}
