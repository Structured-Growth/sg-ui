import {expect,test} from '@playwright/test';
import {waitForNativeScrollToSettle} from './native-scroll-settling';
for(const theme of ['light','dark'])for(const density of ['compact','comfortable'])for(const locale of ['en-US','ar-EG'])for(const auth of [false,true]) {
 test(`${auth?'auth':'application'} shell: ${theme}/${density}/${locale}`,async({page},info)=>{
  const rtl=locale==='ar-EG';await page.setViewportSize({width:1100,height:900});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(`/fixtures/?id=layout-appshell--localized-${auth?'auth-':''}presentation&embed=true&globals=theme:${theme};density:${density};locale:${locale}`);
  const root=page.getByTestId('localized-shell');await expect(root).toHaveAttribute('dir',rtl?'rtl':'ltr');await expect(root).toHaveAttribute('lang',locale);
  const field=root.getByRole('textbox',{name:rtl?'عنوان خطة التعلم':'Learning plan title',exact:true});await expect(field).toBeVisible();
  if(!auth){
   const positions=await root.evaluate(element=>{const n=element.querySelector('[data-sgui-part="navigation"]')!.getBoundingClientRect(),m=element.querySelector('main')!.getBoundingClientRect();return {navLeft:n.left,navRight:n.right,mainLeft:m.left,mainRight:m.right};});
   if(rtl)expect(positions.navLeft).toBeGreaterThanOrEqual(positions.mainRight-1);else expect(positions.navRight).toBeLessThanOrEqual(positions.mainLeft+1);
  }
  await page.setViewportSize({width:360,height:900});await page.addStyleTag({content:'html{font-size:150%;}'});
  await field.fill(rtl?'خطة محدثة':'Updated plan');await expect(field).toHaveValue(rtl?'خطة محدثة':'Updated plan');
  const submit=root.getByRole('button',{name:rtl?'حفظ خطة التعلم':'Save learning plan',exact:true});await submit.focus();await submit.press('Enter');
  await expect(root.getByRole('status')).toHaveText(rtl?'تم حفظ المسودة للمراجعة.':'Draft saved for review.');
  if(!auth){
   const nav=root.getByRole('navigation',{name:rtl?'التنقل في الدورات':'Course navigation',exact:true});await expect(nav).toBeVisible();
   const panes=await root.evaluate(element=>{const n=element.querySelector('[data-sgui-part="navigation"]')!.getBoundingClientRect(),m=element.querySelector('main')!.getBoundingClientRect();return {navBottom:n.bottom,mainTop:m.top};});
   expect(panes.navBottom).toBeLessThanOrEqual(panes.mainTop+1);
  }
  const bounds=await root.evaluate(element=>{const r=element.getBoundingClientRect();return {left:r.left,right:r.right,overflow:element.scrollWidth-element.clientWidth,
   bounded:[...element.querySelectorAll('h1,h2,input,button,main,[data-sgui-part="auth-shell-panel"],[data-sgui-part="auth-shell-footer"]')].every(child=>{const c=child.getBoundingClientRect();return c.left>=r.left-1&&c.right<=r.right+1;})};});
  expect(bounds.left).toBeGreaterThanOrEqual(0);expect(bounds.right).toBeLessThanOrEqual(361);expect(bounds.overflow).toBeLessThanOrEqual(1);expect(bounds.bounded).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);
  await waitForNativeScrollToSettle(root);await info.attach('localized-shell',{body:await root.screenshot(),contentType:'image/png'});
 });
}
