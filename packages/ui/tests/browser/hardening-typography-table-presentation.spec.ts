import{expect,test}from'@playwright/test';
import{waitForNativeScrollToSettle}from'./native-scroll-settling';
for(const theme of ['light','dark'])for(const density of ['compact','comfortable'])for(const locale of ['en-US','ar-EG']){
 test(`typography/table/scope presentation: ${theme}/${density}/${locale}`,async({page},info)=>{
  const rtl=locale==='ar-EG';await page.setViewportSize({width:360,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(`/fixtures/?id=migration-proofs-box--localized-typography-table-presentation&embed=true&globals=theme:${theme};density:${density};locale:${locale}`);
  const root=page.getByTestId('localized-typography-table');await expect(root).toHaveAttribute('data-sgui-theme',theme);await expect(root).toHaveAttribute('data-sgui-density',density);await expect(root).toHaveAttribute('dir',rtl?'rtl':'ltr');await expect(root).toHaveAttribute('lang',locale);await page.addStyleTag({content:'html{font-size:150%;}'});
  const inherited=root.getByTestId('inherited-density').getByRole('button');const explicit=root.getByTestId('explicit-density').getByRole('button');
  const heights=await Promise.all([inherited.evaluate(element=>element.getBoundingClientRect().height),explicit.evaluate(element=>element.getBoundingClientRect().height)]);
  expect(heights[0]).not.toBe(heights[1]);const toggle=root.getByRole('button',{name:rtl?'تبديل كثافة الحاوية':'Toggle parent density',exact:true});await toggle.click();await expect(root).toHaveAttribute('data-sgui-density',density==='compact'?'comfortable':'compact');
  await expect.poll(()=>inherited.evaluate(element=>element.getBoundingClientRect().height)).toBeCloseTo(heights[1],1);expect(await explicit.evaluate(element=>element.getBoundingClientRect().height)).toBeCloseTo(heights[1],1);
  await toggle.click();await expect(root).toHaveAttribute('data-sgui-density',density);
  const samples=root.getByTestId('typeface-sample');await expect(samples).toHaveCount(15);expect(await samples.evaluateAll(elements=>elements.map(element=>element.getAttribute('data-variant')))).toEqual(['h1','h2','h3','h4','h5','h6','body1','body2','bodyAlt2','subtitle1','subtitle2','button','caption','overline','code']);
  expect(await samples.evaluateAll(elements=>elements.every(element=>{const r=element.getBoundingClientRect(),s=getComputedStyle(element);return r.left>=0&&r.right<=innerWidth+1&&[...element.getClientRects()].every(fragment=>fragment.left>=0&&fragment.right<=innerWidth+1)&&(s.display==='inline'||element.scrollWidth<=element.clientWidth+1)&&parseFloat(s.fontSize)>0&&parseFloat(s.lineHeight)>0;}))).toBe(true);
  for(const group of [0,1,2])await info.attach(`typeface-roles-${group}`,{body:await root.getByTestId(`typeface-group-${group}`).screenshot(),contentType:'image/png'});
  const viewport=root.getByRole('region',{name:rtl?'منطقة تمرير جدول الدورات':'Course table scroll area',exact:true});
  const table=viewport.getByRole('table',{name:rtl?'خطط التعلم ومراجعة المواد للدورات الدولية':'Learning plans and materials review for international courses',exact:true});await expect(table.getByRole('columnheader')).toHaveCount(2);await expect(table.getByRole('rowheader')).toHaveCount(1);await expect(table.getByRole('cell').first()).toHaveAttribute('headers','course-status plan-name');
  const order=await table.getByRole('columnheader').evaluateAll(elements=>elements.map(element=>element.getBoundingClientRect().left));if(rtl)expect(order[0]).toBeGreaterThan(order[1]);else expect(order[0]).toBeLessThan(order[1]);
  expect(await viewport.evaluate(element=>element.scrollWidth>element.clientWidth)).toBe(true);
  const link=table.getByRole('link',{name:rtl?'مراجعة الخطة':'Review plan',exact:true});await link.focus();await expect(link).toBeFocused();await expect.poll(()=>link.evaluate(element=>{const r=element.getBoundingClientRect(),v=element.closest('[role="region"]')!.getBoundingClientRect();return r.left>=v.left-1&&r.right<=v.right+1;})).toBe(true);await link.press('Enter');await expect(page).toHaveURL(/#review-learning-plan$/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);await waitForNativeScrollToSettle(viewport);await info.attach('native-table-scroll',{body:await viewport.screenshot(),contentType:'image/png'});
 });
}
