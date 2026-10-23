import{expect,test}from'@playwright/test';
import{waitForNativeScrollToSettle}from'./native-scroll-settling';
test.use({timezoneId:'UTC'});
for(const theme of ['light','dark'])for(const density of ['compact','comfortable'])for(const locale of ['en-US','ar-EG'])for(const kind of ['learner','instructor']){
 test(`${kind} card collection: ${theme}/${density}/${locale}`,async({page},info)=>{
  const rtl=locale==='ar-EG';await page.setViewportSize({width:360,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(`/fixtures/?id=migration-proofs-box--localized-${kind}-cards&embed=true&globals=theme:${theme};density:${density};locale:${locale}`);
  const root=page.getByTestId('localized-cards');await expect(root).toHaveAttribute('lang',locale);await expect(root).toHaveAttribute('dir',rtl?'rtl':'ltr');await page.addStyleTag({content:'html{font-size:150%;}'});
  const cards=root.getByRole('article');await expect(cards).toHaveCount(1);
  const title=(n:number)=>rtl?`التخطيط التعاوني ومراجعة مواد التعلم للمجموعات الدولية ${n}`:`Collaborative planning and learning materials review for international cohorts ${n}`;
  await expect(cards.getByRole('heading')).toHaveText(title(1));
  const nav=root.getByRole('navigation',{name:rtl?'صفحات الدورات التدريبية':'Course collection pages',exact:true});
  const next=nav.getByRole('button',{name:rtl?'الصفحة التالية':'Next page',exact:true});await next.focus();await next.press('Enter');
  await expect(cards.getByRole('heading')).toHaveText(title(2));await expect(nav).toContainText(rtl?'الصفحة 2 من 3':'Page 2 of 3');await expect(next).toBeFocused();
  if(kind==='learner'){
   await expect(cards.getByRole('progressbar',{name:rtl?'تقدم الدورة':'Course progress',exact:true})).toHaveAttribute('aria-valuenow','62');
   await expect(cards.getByRole('link',{name:rtl?'التفاصيل':'Details',exact:true})).toHaveAttribute('href','#course-details');
   await expect(cards.getByRole('button',{name:rtl?'متابعة':'Continue',exact:true})).toBeEnabled();
  }else await expect(cards.getByRole('link',{name:rtl?'مراجعة الدورة ومواد التعلم':'Review course and learning materials',exact:true})).toHaveAttribute('href','#review-course');
  const layout=await root.evaluate(element=>{const host=element.getBoundingClientRect();return{left:host.left,right:host.right,overflow:element.scrollWidth-element.clientWidth,
   contained:[...element.querySelectorAll('article,h3,button,select,footer,nav,[data-sgui-part^="course-card-"]')].every(child=>{const r=child.getBoundingClientRect();return child.closest('[aria-hidden="true"]')!==null || r.left>=host.left-1&&r.right<=host.right+1&&child.scrollWidth<=child.clientWidth+1;})};});
  expect(layout.left).toBeGreaterThanOrEqual(0);expect(layout.right).toBeLessThanOrEqual(361);expect(layout.overflow).toBeLessThanOrEqual(1);expect(layout.contained).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);
  const size=nav.getByRole('button',{name:new RegExp(rtl?'صفوف في الصفحة':'Rows per page')});await size.click(); await page.getByRole('option',{name:'2',exact:true}).click();await expect(cards).toHaveCount(2);await expect(cards.first().getByRole('heading')).toHaveText(title(1));await expect(nav).toContainText(rtl?'الصفحة 1 من 2':'Page 1 of 2');
  await nav.getByRole('button',{name:rtl?'الصفحة الأولى':'First page',exact:true}).isDisabled().then(value=>expect(value).toBe(true));
  // Return to one card for a readable, complete presentation capture.
  await size.click(); await page.getByRole('option',{name:'1',exact:true}).click();await expect(cards).toHaveCount(1);await root.scrollIntoViewIfNeeded();await waitForNativeScrollToSettle(root);await info.attach('localized-card-collection',{body:await root.screenshot(),contentType:'image/png'});
 });
}
