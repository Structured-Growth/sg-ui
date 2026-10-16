import { expect, test, type Page } from '@playwright/test';
import { waitForNativeScrollToSettle } from './native-scroll-settling';

const fixture = (name: string) => `/fixtures/?id=migration-proofs-${name}&embed=true&globals=a11y.manual:!true`;
const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const messages: string[] = []; errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
});
test.afterEach(({ page }) => expect(errors.get(page), 'uncaught browser errors').toEqual([]));

for (const theme of ['light', 'dark']) for (const density of ['compact', 'comfortable']) for (const dir of ['ltr', 'rtl']) for (const mode of ['pointer', 'touch']) {
  test(`shared control geometry: ${theme}, ${density}, ${dir}, ${mode}`, async ({ page }, info) => {
    const rtl = dir === 'rtl';
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto(fixture('box--control-geometry'));
    const scope = page.getByTestId(`${theme}-${density}-${dir}-${mode}`);
    const input = scope.getByRole('textbox', { name: rtl ? 'عنوان الدورة' : 'Course title' });
    const select = scope.getByRole('button', { name: new RegExp(rtl ? 'الحالة' : 'Status') });
    const checkbox = scope.getByRole('checkbox', { name: rtl ? 'معطل' : 'Disabled', exact: true });
    const checkboxLabel = checkbox.locator('xpath=ancestor::label[1]');
    const switchLabel = scope.getByRole('switch').locator('xpath=ancestor::label[1]');
    const icon = scope.getByRole('button', { name: rtl ? 'إضافة دورة' : 'Add course' });
    const dimensions = (target: typeof input) => target.evaluate(element => {
      const rect = element.getBoundingClientRect(), css = getComputedStyle(element);
      return { height: rect.height, center: rect.top + rect.height / 2, top: rect.top, bottom: rect.bottom,
        font: css.fontSize, weight: css.fontWeight, padding: css.padding, lineHeight: css.lineHeight, radius: css.borderRadius };
    });
    for (const enlarged of [false, true]) {
      if (enlarged) await page.addStyleTag({ content: 'html { font-size: 150%; }' });
      const field = await dimensions(input), selection = await dimensions(select);
      expect(selection.height).toBeCloseTo(field.height, 0);
      expect(selection.font).toBe(field.font);
      expect(selection.weight).toBe(field.weight);
      expect(selection.padding).toBe(field.padding);
      expect(selection.lineHeight).toBe(field.lineHeight);
      expect(selection.radius).toBe(field.radius);
      for (const control of [checkboxLabel, switchLabel, icon]) {
        const box = await dimensions(control);
        expect(box.height).toBeCloseTo(field.height, 0);
        if (box.top < field.bottom && box.bottom > field.top) expect(box.center).toBeCloseTo(field.center, 0);
      }
      const offset = await icon.evaluate(button => {
        const a = button.getBoundingClientRect(), i = button.querySelector('svg')!.getBoundingClientRect();
        return { x: i.left + i.width / 2 - a.left - a.width / 2, y: i.top + i.height / 2 - a.top - a.height / 2 };
      });
      expect(Math.abs(offset.x)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(offset.y)).toBeLessThanOrEqual(0.5);
      const widths = await scope.locator('[data-sgui-part="toggle-button-group"] button').evaluateAll(buttons => buttons.map(button => button.getBoundingClientRect().width));
      expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(0.5);
      if (mode === 'touch') expect(field.height).toBeGreaterThanOrEqual(44);
    }
    const initial = (await select.boundingBox())!.width;
    await select.click();
    const long = rtl ? 'جاهز للمراجعة من قبل المدرسين ومسؤولي البرامج التعليمية' : 'Ready for review by instructors and program administrators';
    await page.getByRole('option', { name: long, exact: true }).click();
    await expect(select).toContainText(long);
    expect((await select.boundingBox())!.width).toBeCloseTo(initial, 0);
    const value = select.locator('> span').last();
    await expect(value).toHaveCSS('text-overflow', 'ellipsis');
    expect(await value.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
    await checkboxLabel.click();
    await expect(checkbox).toBeChecked();
    await switchLabel.click();
    await expect(scope.getByRole('switch')).toBeChecked();
    await page.setViewportSize({ width: 360, height: 900 });
    await scope.scrollIntoViewIfNeeded();
    await waitForNativeScrollToSettle(scope);
    expect(await scope.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
    const bounds = (await scope.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(361);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(361);
    await info.attach(`${theme}-${density}-${dir}-${mode}-controls`, { body: await scope.screenshot(), contentType: 'image/png' });
  });
}
