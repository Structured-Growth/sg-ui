import { test, expect, type Locator } from '@playwright/test';

test.use({ timezoneId: 'UTC', viewport: { width: 320, height: 900 } });

async function readable(root: Locator) {
  expect(await root.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  for (const button of await root.getByRole('button').all()) {
    expect(await button.evaluate(element => {
      const box = element.getBoundingClientRect();
      return box.left >= -1 && box.right <= innerWidth + 1 && element.scrollWidth <= element.clientWidth + 1;
    })).toBe(true);
  }
}

for (const mode of ['english-fallback', 'pseudo-localized-long-labels', 'arabic-plural-and-direction']) {
  test(`${mode}: public locale, fixed date/number, count/clear and 320px reflow`, async ({ page }, info) => {
    await page.goto(`/fixtures/?id=foundations-translations--${mode}&globals=a11y.manual:!true`);
    const root = page.getByTestId('translation-example');
    const scope = root.locator('xpath=ancestor::*[@data-sgui-scope][1]');
    const ar = mode === 'arabic-plural-and-direction';
    const pseudo = mode === 'pseudo-localized-long-labels';
    await expect(scope).toHaveAttribute('lang', ar ? 'ar-EG' : 'en-US');
    await expect(scope).toHaveAttribute('dir', ar ? 'rtl' : 'ltr');
    await expect(root.getByTestId('localized-number')).toHaveText(ar ? '١٢٬٣٤٥٫٥' : '12,345.5');
    await expect(root.getByTestId('localized-date')).toHaveText(await page.evaluate(locale =>
      new Intl.DateTimeFormat(locale).format(new Date('2026-10-16T12:00:00Z')), ar ? 'ar-EG' : 'en-US'));
    const nextName = ar ? 'حدد صفًا آخر' : pseudo ? '⟦Select another row — expanded label⟧' : 'Select another row';
    const clearName = ar ? 'مسح التحديد' : pseudo ? '⟦Clear selection — expanded label⟧' : 'Clear selection';
    const next = root.getByRole('button', { name: nextName, exact: true });
    const clear = root.getByRole('button', { name: clearName, exact: true });
    const status = root.getByRole('status');
    const arabic: Record<number, string> = { 0: 'لم يتم تحديد صفوف', 1: 'تم تحديد صف واحد', 2: 'تم تحديد صفين', 3: 'تم تحديد ٣ صفوف', 11: 'تم تحديد ١١ صفًا', 100: 'تم تحديد ١٠٠ صف' };
    function expected(n: number) {
      if (ar) return arabic[n];
      if (pseudo) return `⟦${n === 0 ? 'Nöö rööws' : `${n} ${n === 1 ? 'rööw' : 'rööws'}`} sëëlëëctëëd — ëëxpààndëëd tràànslààtïïöön⟧`;
      return n === 0 ? 'No rows selected' : `${n} ${n === 1 ? 'row' : 'rows'} selected`;
    }
    await expect(status).toHaveAttribute('aria-live', 'polite');
    await expect(status).toHaveText(expected(0));
    await next.focus();
    for (let n = 1; n <= 100; n++) {
      await next.press('Enter');
      if ([1, 2, 3, 11, 100].includes(n)) {
        await expect(status).toHaveText(expected(n));
        await expect(next).toBeFocused();
      }
    }
    await readable(root);
    await clear.focus();
    await clear.press('Space');
    await expect(status).toHaveText(expected(0));
    await expect(clear).toBeFocused();
    expect(await clear.evaluate(element => {
      const css = getComputedStyle(element);
      return css.outlineStyle !== 'none' && parseFloat(css.outlineWidth) > 0;
    })).toBe(true);
    // Root-size enlargement is explicitly not browser zoom or AT evidence.
    await page.addStyleTag({ content: 'html { font-size: 150%; }' });
    await readable(root);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);
    await info.attach('localized-reflow', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  });
}
