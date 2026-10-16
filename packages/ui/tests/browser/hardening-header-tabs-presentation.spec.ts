import { expect, test } from '@playwright/test';
import { waitForNativeScrollToSettle } from './native-scroll-settling';

for (const theme of ['light','dark']) for (const density of ['compact','comfortable']) for (const locale of ['en-US','ar-EG']) {
  test(`header/tab presentation: ${theme}/${density}/${locale}`, async ({ page }, info) => {
    const rtl = locale === 'ar-EG';
    await page.setViewportSize({width:360,height:1000});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.goto(`/fixtures/?id=layout-apppageheader--localized-presentation&embed=true&globals=theme:${theme};density:${density};locale:${locale}`);
    const root = page.getByTestId('localized-header-tabs');
    await expect(root).toHaveAttribute('dir',rtl?'rtl':'ltr');
    await expect(root).toHaveAttribute('lang',locale);
    await page.addStyleTag({content:'html {font-size:150%;}'});
    const header=root.locator('[data-sgui-part="page-header"]');
    await expect(header.getByRole('heading')).toHaveText(rtl?'التخطيط للدورات التدريبية والتعاون بين فرق التدريس الدولية':'International course planning and teaching team collaboration');
    const path=root.getByRole('button',{name:rtl?'إظهار المسار':'Show path',exact:true});
    await path.focus();await path.press('ArrowDown');
    await expect(page.getByRole('menuitem',{name:rtl?'مكتبة المحتوى المشترك':'Shared content library',exact:true})).toBeFocused();
    await page.keyboard.press('Escape');await expect(path).toBeFocused();
    const more=root.getByRole('button',{name:rtl?'المزيد من الإجراءات':'More actions',exact:true});
    await more.focus();await more.press('ArrowDown');
    await expect(page.getByRole('menuitem',{name:rtl?'مراجعة تفاصيل الدورة':'Review course details',exact:true})).toBeFocused();
    await page.keyboard.press('Escape');await expect(more).toBeFocused();
    const list=root.getByRole('tablist',{name:rtl?'أقسام الصفحة':'Page sections',exact:true});
    const tabs=list.getByRole('tab');await expect(tabs).toHaveCount(5);
    await tabs.first().focus();await tabs.first().press(rtl?'ArrowLeft':'ArrowRight');
    await expect(tabs.nth(2)).toBeFocused();await expect(tabs.nth(2)).toHaveAttribute('aria-selected','true');
    await tabs.nth(2).press(rtl?'ArrowLeft':'ArrowRight');
    await expect(tabs.nth(3)).toBeFocused();
    await expect(tabs.nth(3)).toHaveAccessibleName(rtl?'مراجعة مواد الدورة التدريبية والمستندات الداعمة من قبل فريق التدريس والإدارة':'Review the course materials and supporting documents with the teaching and administration team');
    await tabs.nth(3).press('End');await expect(tabs.last()).toBeFocused();await expect(tabs.last()).toHaveAttribute('aria-selected','true');
    await expect(root.getByRole('tabpanel')).toHaveText(rtl?'السجل':'History');
    expect(await tabs.last().getAttribute('aria-controls')).toBe(await root.getByRole('tabpanel').getAttribute('id'));
    await waitForNativeScrollToSettle(list);
    const bounds=await root.evaluate(element=>{
      const host=element.getBoundingClientRect();const header=element.querySelector('[data-sgui-part="page-header"]')!;
      const strip=element.querySelector('[role="tablist"]')!.getBoundingClientRect();const selected=element.querySelector('[aria-selected="true"]')!.getBoundingClientRect();
      return {left:host.left,right:host.right,overflow:element.scrollWidth-element.clientWidth,headerFits:header.scrollWidth<=header.clientWidth+1,
        contentFits:[...header.querySelectorAll('h1,p,li,button')].every(child=>{const r=child.getBoundingClientRect();return r.left>=host.left-1&&r.right<=host.right+1;}),
        selectedFits:selected.left>=strip.left-1&&selected.right<=strip.right+1};
    });
    expect(bounds.left).toBeGreaterThanOrEqual(0);expect(bounds.right).toBeLessThanOrEqual(361);expect(bounds.overflow).toBeLessThanOrEqual(1);
    expect(bounds.headerFits).toBe(true);expect(bounds.contentFits).toBe(true);expect(bounds.selectedFits).toBe(true);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);
    await info.attach('localized-header-tabs',{body:await root.screenshot(),contentType:'image/png'});
  });
}
