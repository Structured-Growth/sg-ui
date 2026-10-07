import { test, expect } from '@playwright/test';

for (const locale of ['en-US', 'ar-EG']) {
  test(`${locale} retains independent visual direction and locale in nested portals`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto('/iframe.html?id=migration-proofs-provider--explicit-portal-directions&viewMode=story&globals=a11y.manual:!true');
    const dir = locale === 'en-US' ? 'rtl' : 'ltr';
    const reverse = dir === 'rtl' ? 'ltr' : 'rtl';
    const trigger = page.getByRole('button', { name: `Open ${locale}`, exact: true });
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: `${locale} settings` });
    const popover = dialog.locator('xpath=ancestor::*[@data-sgui-scope][1]');
    await expect(popover).toHaveAttribute('dir', dir);
    const actions = page.getByRole('button', { name: `${locale} actions`, exact: true });
    await actions.focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('menu', { name: `${locale} actions` });
    const scope = menu.locator('xpath=ancestor::*[@data-sgui-scope][1]');
    for (const root of [popover, scope]) {
      await expect(root).toHaveAttribute('dir', dir);
      await expect(root).toHaveAttribute('lang', locale);
      await expect(root).toHaveAttribute('data-sgui-theme', locale === 'en-US' ? 'dark' : 'light');
      await expect(root).toHaveAttribute('data-sgui-density', locale === 'en-US' ? 'compact' : 'comfortable');
      expect(await root.evaluate(element => (element as HTMLElement).style.getPropertyValue('--sgui-focus'))).toBe('#a78bfa');
      expect(await root.evaluate(element => (element as HTMLElement).style.padding)).toBe('');
      expect(await root.evaluate(element => getComputedStyle(element).direction)).toBe(dir);
    }
    const review = page.getByRole('menuitem', { name: 'Review settings' });
    await expect(review).toBeFocused();
    expect(await review.evaluate(element => {
      const rect = element.getBoundingClientRect();
      return rect.left >= 0 && rect.right <= innerWidth + 1 && rect.top >= 0 && rect.bottom <= innerHeight + 1;
    })).toBe(true);
    await page.keyboard.press('Escape');
    await expect(actions).toBeFocused();
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Reverse visual direction' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(popover).toHaveAttribute('dir', reverse);
    await expect(actions).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(scope).toHaveAttribute('dir', reverse);
    await expect(scope).toHaveAttribute('lang', locale);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(actions).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
}
