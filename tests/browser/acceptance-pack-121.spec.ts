import { expect, test } from '@playwright/test';

// X-02: prepared coverage only; coordinator owns native execution.
test('batch121 Menu typeahead focuses an enabled match and ignores disabled-only matches', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/iframe.html?id=migration-proofs-menu--native-autofocus&viewMode=story&globals=a11y.manual:!true');
  const trigger = page.getByRole('button', { name: 'Native actions', exact: true });
  const first = page.getByRole('menuitem', { name: 'First enabled', exact: true });
  const last = page.getByRole('menuitem', { name: 'Last enabled', exact: true });
  await expect(trigger).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(first).toBeFocused();
  await page.keyboard.type('l');
  await expect(last).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  // New lifetime avoids any dependence on the engine's typeahead timeout.
  await page.keyboard.press('ArrowDown');
  await expect(first).toBeFocused();
  await expect(page.getByRole('menuitem', { name: 'Unavailable middle', exact: true })).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.type('u');
  await expect(first).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors, 'browser runtime errors').toEqual([]);
});
