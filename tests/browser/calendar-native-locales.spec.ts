import { expect, test, type Page } from '@playwright/test';

const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const diagnostics: string[] = [];
  errors.set(page, diagnostics);
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text());
  });
});
test.afterEach(({ page }) => expect(errors.get(page), 'browser runtime errors').toEqual([]));
async function story(page: Page, name: string, theme: string) {
  await page.goto(`/iframe.html?id=migration-proofs-calendar-native-locales--${name}&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
  await expect(page.getByRole('grid')).toHaveCount(2);
  await expect(page.locator('[data-sgui-scope]').last()).toHaveAttribute('data-sgui-theme', theme);
}
async function committed(page: Page, values: string[], count: number) {
  await expect(page.getByLabel('Selected civil dates')).toHaveText(JSON.stringify(values));
  await expect(page.getByLabel('Selection callback count')).toHaveText(String(count));
}
for (const theme of ['light', 'dark']) {
  test(`native multiple selection, focus, unavailable day and deselection across two months: ${theme}`, async ({ page }) => {
    await story(page, 'sunday-first', theme);
    const start = page.getByRole('grid').nth(0).getByRole('button', { name: /Wednesday, February 28, 2024/ });
    await page.getByRole('button', { name: 'Next month', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(start).toBeFocused();
    await page.keyboard.press('Enter');
    await committed(page, ['2024-02-28'], 1);
    await expect(start.locator('..')).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');
    const leap = page.getByRole('grid').nth(0).getByRole('button', { name: /Thursday, February 29, 2024/ });
    await expect(leap).toBeFocused();
    await expect(leap.locator('..')).not.toHaveAttribute('aria-selected', 'true');
    await expect(page.getByLabel('Focused civil date')).toHaveText('2024-02-29');
    await committed(page, ['2024-02-28'], 1);
    await page.keyboard.press('ArrowRight');
    const unavailable = page.getByRole('grid').nth(1).getByRole('button', { name: /Friday, March 1, 2024/ });
    await expect(unavailable).toBeFocused();
    await expect(unavailable).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('Enter');
    await committed(page, ['2024-02-28'], 1);
    await page.keyboard.press('ArrowRight');
    const march = page.getByRole('grid').nth(1).getByRole('button', { name: /Saturday, March 2, 2024/ });
    await expect(march).toBeFocused();
    await page.keyboard.press('Space');
    await committed(page, ['2024-02-28', '2024-03-02'], 2);
    await expect(march.locator('..')).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Enter');
    await committed(page, ['2024-02-28'], 3);
    await expect(march).toBeFocused();
    await expect(march.locator('..')).not.toHaveAttribute('aria-selected', 'true');
    for (let step = 0; step < 3; step++) await page.keyboard.press('ArrowLeft');
    await expect(start).toBeFocused();
    await page.keyboard.press('Space');
    await committed(page, [], 4);
    await expect(start).toBeFocused();
  });

  for (const [name, order] of [
    ['sunday-first', ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']],
    ['monday-first', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']],
  ] as const) {
    test(`explicit ${name} headers in both months: ${theme}`, async ({ page }) => {
      await story(page, name, theme);
      for (const grid of await page.getByRole('grid').all()) {
        await expect(grid.locator('thead th')).toHaveText([...order]);
      }
    });
  }

  test(`Arabic locale native RTL traversal preserves Gregorian values: ${theme}`, async ({ page }) => {
    await story(page, 'arabic-traversal', theme);
    const current = page.locator('[role="grid"] [role="button"][tabindex="0"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAccessibleName(/فبراير/);
    await expect(current.locator('xpath=ancestor::*[@dir][1]')).toHaveAttribute('dir', 'rtl');
    await page.getByRole('button', { name: 'Next month', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(current).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByLabel('Focused civil date')).toHaveText('2024-02-29');
    await committed(page, ['2024-02-28'], 1);
    await page.keyboard.press('Space');
    await committed(page, ['2024-02-28', '2024-02-29'], 2);
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByLabel('Focused civil date')).toHaveText('2024-03-01');
    await expect(current).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('Enter');
    await committed(page, ['2024-02-28', '2024-02-29'], 2);
    await page.keyboard.press('ArrowRight');
    await expect(page.getByLabel('Focused civil date')).toHaveText('2024-02-29');
    await page.keyboard.press('Enter');
    await committed(page, ['2024-02-28'], 3);
  });

  test(`Hebrew calendar display emits exact Gregorian civil callbacks: ${theme}`, async ({ page }) => {
    await story(page, 'hebrew-calendar', theme);
    await expect(page.getByText('Adar I 5784', { exact: true })).toBeVisible();
    await expect(page.getByText('Adar II 5784', { exact: true })).toBeVisible();
    const start = page.getByRole('button', { name: /19 Adar I 5784/ });
    await page.getByRole('button', { name: 'Next month', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(start).toBeFocused();
    await page.keyboard.press('Enter');
    await committed(page, ['2024-02-28'], 1);
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('button', { name: /20 Adar I 5784/ })).toBeFocused();
    await expect(page.getByLabel('Focused civil date')).toHaveText('2024-02-29');
    await committed(page, ['2024-02-28'], 1);
    await page.keyboard.press('Enter');
    await committed(page, ['2024-02-28', '2024-02-29'], 2);
    await page.keyboard.press('ArrowRight');
    const unavailable = page.getByRole('button', { name: /21 Adar I 5784/ });
    await expect(unavailable).toBeFocused();
    await expect(unavailable).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByLabel('Focused civil date')).toHaveText('2024-03-01');
    await page.keyboard.press('Enter');
    await committed(page, ['2024-02-28', '2024-02-29'], 2);
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('button', { name: /22 Adar I 5784/ })).toBeFocused();
    await page.keyboard.press('Enter');
    await committed(page, ['2024-02-28', '2024-02-29', '2024-03-02'], 3);
  });
}
