import{expect,test}from'@playwright/test';
import{waitForNativeScrollToSettle}from'./native-scroll-settling';
for(const theme of ['light','dark'])for(const density of ['compact','comfortable'])for(const locale of ['en-US','ar-EG']){
 test(`localized form presentation: ${theme}/${density}/${locale}`,async({page},info)=>{
  const rtl=locale==='ar-EG';await page.setViewportSize({width:360,height:1000});await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(`/fixtures/?id=migration-proofs-box--localized-fields-presentation&embed=true&globals=theme:${theme};density:${density};locale:${locale}`);
  const root=page.getByTestId('localized-fields');await expect(root).toHaveAttribute('lang',locale);await expect(root).toHaveAttribute('dir',rtl?'rtl':'ltr');await page.addStyleTag({content:'html{font-size:150%;}'});
  const labels=rtl?['فريق مراجعة مواد التعلم والتطوير المهني','مجموعة التخطيط والتعاون بين المدرسين الدوليين']:['Learning materials and professional development review team','International teaching planning and collaboration group'];
  const notes=root.getByRole('textbox',{name:rtl?'ملاحظات مراجعة مواد التعلم':'Learning materials review notes',exact:true});await expect(notes).toHaveValue(labels[0]);await notes.fill(labels.join('\n'));await expect(notes).toHaveValue(labels.join('\n'));
  const radios=root.getByRole('radiogroup',{name:rtl?'فريق المراجعة':'Review team',exact:true});await radios.getByRole('radio').first().focus();await page.keyboard.press('ArrowDown');await expect(radios.getByRole('radio',{name:labels[1],exact:true})).toBeChecked();
  const combo=root.getByRole('combobox',{name:rtl?'المجموعة التعليمية':'Teaching group',exact:true});await root.getByRole('button',{name:rtl?'إظهار الخيارات المجموعة التعليمية':'Show options Teaching group',exact:true}).click();
  const popup=page.locator(`[id="${await combo.getAttribute('aria-controls')}"]`);await expect(popup).toHaveAttribute('role','listbox');await expect(popup).toHaveAccessibleName(new RegExp(rtl?'المجموعة التعليمية':'Teaching group'));await expect(popup).toBeVisible();
  const popupBounds=await popup.evaluate(element=>{const r=element.getBoundingClientRect();return{left:r.left,right:r.right};});expect(popupBounds.left).toBeGreaterThanOrEqual(0);expect(popupBounds.right).toBeLessThanOrEqual(361);
  await popup.getByRole('option',{name:labels[1],exact:true}).click();await expect(combo).toHaveValue(labels[1]);await expect(popup).toHaveCount(0);
  const multi=root.getByRole('listbox',{name:rtl?'دعوة المتعاونين':'Invite collaborators',exact:true});await multi.getByRole('option',{name:labels[0],exact:true}).click();await expect(multi.getByRole('option',{name:labels[0],exact:true})).toHaveAttribute('aria-selected','true');
  await expect(root.getByRole('button',{name:(rtl?'إزالة ':'Remove ')+labels[0],exact:true})).toHaveCount(2);
  const tags=root.locator('[data-sgui-part="tag-group"]');await tags.getByRole('button',{name:(rtl?'إزالة ':'Remove ')+labels[0],exact:true}).click();await expect(tags.locator('[data-sgui-part="tag"]')).toHaveCount(1);
  const avatar=root.getByRole('img',{name:rtl?'منسق فريق التعلم الدولي':'International learning team coordinator',exact:true});
  const center=await avatar.evaluate(element=>{const a=element.getBoundingClientRect(),b=element.firstElementChild!.getBoundingClientRect();return{square:Math.abs(a.width-a.height),x:Math.abs(a.left+a.width/2-b.left-b.width/2),y:Math.abs(a.top+a.height/2-b.top-b.height/2)};});expect(center.square).toBeLessThanOrEqual(.5);expect(center.x).toBeLessThanOrEqual(.5);expect(center.y).toBeLessThanOrEqual(.5);
  const layout=await root.evaluate(element=>{const h=element.getBoundingClientRect();return{left:h.left,right:h.right,overflow:element.scrollWidth-element.clientWidth,
   contained:[...element.querySelectorAll('textarea,[role="radiogroup"],[role="listbox"],[role="option"],[data-sgui-part="tag"],button')].every(child=>{const r=child.getBoundingClientRect();return r.left>=h.left-1&&r.right<=h.right+1&&child.scrollWidth<=child.clientWidth+1;})};});
  expect(layout.left).toBeGreaterThanOrEqual(0);expect(layout.right).toBeLessThanOrEqual(361);expect(layout.overflow).toBeLessThanOrEqual(1);expect(layout.contained).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);
  await waitForNativeScrollToSettle(root);await info.attach('localized-fields',{body:await root.screenshot(),contentType:'image/png'});
 });
}
