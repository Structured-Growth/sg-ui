import { expect, test, type Page } from '@playwright/test';

const fixture = (name: string) => `/fixtures/?id=migration-proofs-${name}&embed=true&globals=a11y.manual:!true`;
const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const messages: string[] = []; errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
});
test.afterEach(({ page }) => expect(errors.get(page), 'uncaught browser errors').toEqual([]));

for (const theme of ['light', 'dark']) for (const density of ['compact', 'comfortable']) for (const dir of ['ltr', 'rtl']) {
  test(`presentation boundary: ${theme}, ${density}, ${dir}`, async ({ page }, info) => {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto(fixture('box--hardening-matrix'));
    const scope = page.getByTestId(`${theme}-${density}-${dir}`);
    await expect(scope).toBeVisible();
    await expect(scope).toHaveAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    const title = dir === 'rtl' ? 'تفاصيل الدورة التدريبية للمدرسين ومسؤولي البرامج التعليمية' : 'Professional development course details for instructors and administrators';
    const label = dir === 'rtl' ? 'اكتملت المراجعة' : 'Review complete';
    await expect(scope.getByRole('heading', { name: title, level: 2 })).toBeVisible();
    await expect(scope.getByRole('region', { name: title })).toBeVisible();
    await expect(scope.getByRole('list', { name: title }).getByRole('listitem')).toHaveCount(1);
    await expect(scope.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(scope.getByRole('group', { name: dir === 'rtl' ? '١٢٣ رسالة غير مقروءة' : '123 unread messages' })).toHaveText('99+');
    await expect(scope.getByRole('img', { name: dir === 'rtl' ? 'مكتمل' : 'Completed', exact: true })).toBeVisible();
    const progress = scope.getByRole('progressbar');
    await expect(progress).toHaveCount(2);
    await expect(progress.first()).toHaveAttribute('aria-valuenow', '50');
    await expect(progress.last()).not.toHaveAttribute('aria-valuenow');
    const action = scope.getByRole('button', { name: label });
    await action.focus();
    await expect(action).toBeFocused();
    const geometry = await scope.evaluate(element => {
      const bounds = element.getBoundingClientRect();
      const heading = element.querySelector('h2')!;
      const range = document.createRange(); range.selectNodeContents(heading);
      const action = element.querySelector('button')!;
      const icon = action.querySelector('svg')!;
      const a = action.getBoundingClientRect(), i = icon.getBoundingClientRect();
      return { overflow: element.scrollWidth - element.clientWidth, direction: getComputedStyle(element).direction,
        lines: [...range.getClientRects()].map(r => ({ top: r.top, left: r.left, right: r.right })),
        left: bounds.left, right: bounds.right,
        iconOffset: (i.top + i.height / 2) - (a.top + a.height / 2),
        targets: [...element.querySelectorAll('[data-testid], article, ul, [data-sgui-part="chip"], [role="progressbar"]')].map(node => {
          const b = node.getBoundingClientRect(); return { left: b.left, right: b.right };
        }), focusOutline: getComputedStyle(action).outlineStyle };
    });
    expect(geometry.direction).toBe(dir);
    expect(geometry.overflow).toBeLessThanOrEqual(1);
    expect(new Set(geometry.lines.map(line => line.top)).size).toBeGreaterThan(1);
    for (const bounds of [...geometry.lines, ...geometry.targets]) {
      expect(bounds.left).toBeGreaterThanOrEqual(geometry.left - 1);
      expect(bounds.right).toBeLessThanOrEqual(geometry.right + 1);
    }
    expect(Math.abs(geometry.iconOffset)).toBeLessThanOrEqual(1);
    expect(geometry.focusOutline).not.toBe('none');
    await info.attach(`${theme}-${density}-${dir}`, { body: await scope.screenshot(), contentType: 'image/png' });
  });
}
