import {expect,test}from'@playwright/test';
import{waitForNativeScrollToSettle}from'./native-scroll-settling';
for(const theme of ['light','dark'])for(const density of ['compact','comfortable'])for(const locale of ['en-US','ar-EG']){
 test(`navigation/disclosure presentation: ${theme}/${density}/${locale}`,async({page},info)=>{
  const rtl=locale==='ar-EG';await page.setViewportSize({width:360,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(`/fixtures/?id=migration-proofs-box--localized-navigation&embed=true&globals=theme:${theme};density:${density};locale:${locale}`);
  const root=page.getByTestId('localized-navigation');await expect(root).toHaveAttribute('lang',locale);await expect(root).toHaveAttribute('dir',rtl?'rtl':'ltr');
  await page.addStyleTag({content:'html{font-size:150%;}'});
  const names=rtl?['المؤسسة التعليمية والبرامج الدولية','مكتبة مواد التعلم والتطوير المهني','خطة التعاون بين المدرسين والمتعلمين']:['Educational organization and international programs','Learning materials and professional development library','Teaching and learner collaboration plan'];
  const crumbs=root.getByRole('navigation',{name:rtl?'مسار التنقل':'Breadcrumbs',exact:true});await expect(crumbs.getByRole('listitem')).toHaveCount(3);
  await expect(crumbs.getByRole('link',{name:names[0],exact:true})).toHaveAttribute('href','#level-0');await expect(crumbs.locator('[aria-current="page"]')).toHaveText(names[2]);
  const nav=root.getByRole('navigation',{name:rtl?'التنقل في مساحة العمل':'Workspace navigation',exact:true});await expect(nav.getByRole('link')).toHaveText(names);await expect(nav.locator('[aria-current="page"]')).toHaveText(names[1]);
  const first=nav.getByRole('link').first();await first.focus();await expect(first).toBeFocused();await first.press('Enter');await expect(page).toHaveURL(/#section-0$/);await expect(first).toBeFocused();
  const label=rtl?'مراجعة مواد التعلم والمستندات الداعمة قبل نشر الدورة التدريبية':'Review learning materials and supporting documents before publishing the course';
  const trigger=root.getByRole('button',{name:label,exact:true});const region=root.getByRole('region',{name:label,exact:true});
  await expect(region).toBeVisible();expect(await trigger.getAttribute('aria-controls')).toBe(await region.getAttribute('id'));
  const support=region.getByRole('link',{name:rtl?'تواصل مع فريق الدعم التعليمي':'Contact the learning support team',exact:true});await expect(support).toHaveAttribute('href','#support');
  await trigger.focus();await trigger.press('Space');await expect(trigger).toHaveAttribute('aria-expanded','false');await expect(region).toBeHidden();
  await trigger.press('Enter');await expect(trigger).toHaveAttribute('aria-expanded','true');await expect(region).toBeVisible();await expect(trigger).toBeFocused();
  const bounds=await root.evaluate(element=>{const host=element.getBoundingClientRect();return{left:host.left,right:host.right,overflow:element.scrollWidth-element.clientWidth,
   contained:[...element.querySelectorAll('nav,li,a,button,[role="region"]')].every(child=>{const r=child.getBoundingClientRect();return r.left>=host.left-1&&r.right<=host.right+1&&[...child.getClientRects()].every(fragment=>fragment.left>=host.left-1&&fragment.right<=host.right+1)&&(getComputedStyle(child).display==='inline'||child.scrollWidth<=child.clientWidth+1);})};});
  expect(bounds.left).toBeGreaterThanOrEqual(0);expect(bounds.right).toBeLessThanOrEqual(361);expect(bounds.overflow).toBeLessThanOrEqual(1);expect(bounds.contained).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);
  await waitForNativeScrollToSettle(root);await info.attach('localized-navigation',{body:await page.screenshot(),contentType:'image/png'});
 });
}
