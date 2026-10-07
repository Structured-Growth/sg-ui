import { test, expect } from '@playwright/test';

for (const kind of ['select', 'combobox']) {
  test(`${kind} keeps mixed visual scopes, live popup state and native keyboard focus`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(`/iframe.html?id=migration-proofs-${kind}--explicit-portal-directions&viewMode=story&globals=a11y.manual:!true`);
    for (const [visit, locale] of ['en-US', 'ar-EG', 'en-US'].entries()) {
      const dir = locale === 'en-US' ? 'rtl' : 'ltr';
      const trigger = page.getByRole('button', { name: kind === 'select' ? new RegExp(locale) : `Show options ${locale}`, exact: kind !== 'select' });
      const input = page.getByRole('combobox', { name: locale, exact: true });
      await trigger.focus();
      await page.keyboard.press('Enter');
      const list = page.getByRole('listbox');
      const portal = list.locator('xpath=ancestor::*[@data-sgui-scope][1]');
      // F4 in the previous English visit restored its locale direction.
      const initial = visit === 2 ? 'ltr' : dir;
      await expect(portal).toHaveAttribute('dir', initial);
      await expect(portal).toHaveAttribute('lang', locale);
      await expect(portal).toHaveAttribute('data-sgui-theme', locale === 'en-US' ? 'dark' : 'light');
      await expect(portal).toHaveAttribute('data-sgui-density', locale === 'en-US' ? 'compact' : 'comfortable');
      expect(await portal.evaluate(element => getComputedStyle(element).direction)).toBe(initial);
      expect(await portal.evaluate(element => (element as HTMLElement).style.padding)).toBe('');
      expect(await portal.evaluate(element => (element as HTMLElement).style.getPropertyValue('--sgui-focus'))).toBe('#a78bfa');
      const listHandle = await list.elementHandle();
      const focused = await page.evaluateHandle(() => document.activeElement);
      await page.keyboard.press('F3');
      expect(await list.evaluate((element, previous) => element === previous, listHandle)).toBe(true);
      expect(await page.evaluate(previous => document.activeElement === previous, focused)).toBe(true);
      await expect(portal).toHaveAttribute('dir', initial);
      await page.keyboard.press('F2');
      await expect(portal).toHaveAttribute('dir', initial === 'rtl' ? 'ltr' : 'rtl');
      expect(await page.evaluate(previous => document.activeElement === previous, focused)).toBe(true);
      await page.keyboard.press('F4');
      await expect(portal).toHaveAttribute('dir', locale === 'en-US' ? 'ltr' : 'rtl');
      expect(await page.evaluate(previous => document.activeElement === previous, focused)).toBe(true);
      const beta = page.getByRole('option', { name: 'Beta', exact: true });
      await expect(beta).toBeVisible();
      expect(await beta.evaluate(element => {
        const rect = element.getBoundingClientRect();
        return rect.left >= 0 && rect.right <= innerWidth + 1;
      })).toBe(true);
      await page.keyboard.press('Escape');
      await expect(list).toHaveCount(0);
      await expect(kind === 'select' ? trigger : input).toBeFocused();
      // Reopen by keyboard, commit host state while retaining the disabled option.
      if (kind === 'select') {
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('End');
      } else {
        await input.fill('Be');
        await page.keyboard.press('ArrowDown');
      }
      await expect(page.getByRole('option', { name: 'Beta', exact: true })).toBeVisible();
      await page.keyboard.press('Enter');
      await expect(list).toHaveCount(0);
      if (kind === 'select') await expect(trigger).toContainText('Beta');
      else await expect(input).toHaveValue('Beta');
      await expect(kind === 'select' ? trigger : input).toBeFocused();
    }
  });
}
