import { expect, test } from '@playwright/test';
import { waitForNativeScrollToSettle } from './native-scroll-settling';

for (const theme of ['light','dark']) for (const density of ['compact','comfortable']) for (const locale of ['en-US','ar-EG']) {
  test(`progress/status presentation: ${theme}/${density}/${locale}`, async ({ page }, info) => {
    const rtl = locale === 'ar-EG';
    await page.setViewportSize({ width:360, height:900 });
    await page.emulateMedia({ reducedMotion:'reduce' });
    await page.goto(`/fixtures/?id=components-appoperationsteps--localized-presentation&embed=true&globals=theme:${theme};density:${density};locale:${locale}`);
    const root = page.getByTestId('localized-progress');
    await expect(root).toHaveAttribute('dir',rtl?'rtl':'ltr');
    await expect(root).toHaveAttribute('lang',locale);
    await page.addStyleTag({ content:'html { font-size:150%; }' });
    const steps = root.getByRole('listitem');
    await expect(steps).toHaveCount(4);
    for (const [index, state] of (rtl ? ['اكتمل','قيد التنفيذ','في الانتظار','خطأ'] : ['Completed','In progress','Pending','Error']).entries()) {
      await expect(steps.nth(index)).toContainText(`: ${state}`);
    }
    const percentage = root.getByRole('progressbar',{name:rtl?'التقدم':'Progress',exact:true});
    await expect(percentage).toHaveAttribute('aria-valuenow','73');
    await expect(root.locator('[data-sgui-part="inline-progress"]')).toHaveText('73%');
    const spinner = steps.nth(1).getByRole('progressbar');
    await expect(spinner).toHaveAccessibleName(rtl ? 'نسخ محتوى الدروس والأنشطة إلى المسودة الجديدة' : 'Copy the lesson content and activities into the new draft');
    await expect(spinner).not.toHaveAttribute('aria-valuenow');
    await expect(root.getByRole('status')).toHaveText(rtl ? 'تم حفظ مسودة الدورة والمستندات الداعمة للمراجعة قبل النشر.' : 'The course draft and supporting documents were saved for review before publication.');
    await expect(root.getByRole('status')).toHaveAttribute('aria-atomic','true');
    await expect(root.getByRole('list').locator('button,a,[tabindex]')).toHaveCount(0);
    const layout = await root.evaluate(element => {
      const host = element.getBoundingClientRect();
      const progress = element.querySelector('[data-sgui-part="inline-progress"]')!;
      const bar = progress.querySelector('[role="progressbar"]')!.getBoundingClientRect();
      const label = progress.querySelector('[data-variant="body2"]')!.getBoundingClientRect();
      return { overflow:element.scrollWidth-element.clientWidth, left:host.left, right:host.right,
        centered:Math.abs(bar.top+bar.height/2-label.top-label.height/2),
        bounded:[...element.querySelectorAll('li,[data-sgui-part="status"],[data-sgui-part="operation-steps"]')].every(node=>{
          const r=node.getBoundingClientRect();return r.left>=host.left-1&&r.right<=host.right+1&&node.scrollWidth<=node.clientWidth+1;
        }) };
    });
    expect(layout.overflow).toBeLessThanOrEqual(1);
    expect(layout.left).toBeGreaterThanOrEqual(0);expect(layout.right).toBeLessThanOrEqual(361);
    expect(layout.bounded).toBe(true);expect(layout.centered).toBeLessThanOrEqual(0.5);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);
    await root.scrollIntoViewIfNeeded(); await waitForNativeScrollToSettle(root);
    await info.attach('progress-status-presentation',{body:await root.screenshot(),contentType:'image/png'});
  });
}
