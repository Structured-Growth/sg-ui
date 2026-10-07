import { test, expect } from '@playwright/test';

test('keyed replacement and unmount clear descriptions without moving focus to a new action', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-tooltip--trigger-lifetime&viewMode=story&globals=a11y.manual:!true');
  await page.getByRole('button', { name: 'Replace trigger after delay' }).focus();
  await page.keyboard.press('Enter');
  const original = page.getByRole('button', { name: 'Action 0', exact: true });
  await original.focus();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toHaveText('Help for action 0');
  await expect(original).toHaveAttribute('aria-describedby', await tooltip.getAttribute('id') as string);
  await expect(tooltip).toHaveAttribute('dir', 'rtl');
  await expect(tooltip).toHaveAttribute('lang', 'en-US');
  await expect(tooltip).toHaveAttribute('data-sgui-theme', 'dark');
  await expect(tooltip).toHaveAttribute('data-sgui-density', 'compact');
  expect(await tooltip.evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(102, 51, 153)');
  const replacement = page.getByRole('button', { name: 'Action 1', exact: true });
  await expect(replacement).toBeVisible();
  await expect(tooltip).toHaveCount(0);
  await expect(replacement).not.toHaveAttribute('aria-describedby');
  await expect(replacement).not.toBeFocused();
  await replacement.focus();
  await expect(tooltip).toHaveText('Help for action 1');
  await page.keyboard.press('Escape');
  await expect(tooltip).toHaveCount(0);
  await expect(replacement).toBeFocused();
  await page.getByRole('button', { name: 'Remove tooltip after delay' }).focus();
  await page.keyboard.press('Enter');
  await replacement.focus();
  await expect(tooltip).toHaveText('Help for action 1');
  await expect(replacement).toHaveCount(0);
  await expect(tooltip).toHaveCount(0);
  const independent = page.getByRole('button', { name: 'Independent action', exact: true });
  await independent.focus();
  await expect(tooltip).toHaveText('Independent help');
  await expect(tooltip).toHaveAttribute('dir', 'ltr');
  await expect(tooltip).toHaveAttribute('lang', 'ar-EG');
  await expect(tooltip).toHaveAttribute('data-sgui-theme', 'light');
  await expect(independent).toHaveAttribute('aria-describedby', await tooltip.getAttribute('id') as string);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Next action', exact: true })).toBeFocused();
  await expect(tooltip).toHaveCount(0);
  const unavailable = page.getByRole('button', { name: 'Unavailable action', exact: true });
  await expect(unavailable).toBeDisabled();
  // Real hit testing on disabled buttons; locator.hover may intentionally wait for enabled.
  const bounds = await unavailable.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.waitForTimeout(350);
  await expect(tooltip).toHaveCount(0);
  await expect(unavailable).not.toHaveAttribute('aria-describedby');
});

test('pending pointer descriptions are cancelled with the old trigger lifetime', async ({ page }) => {
  for (const action of ['Replace trigger after delay', 'Remove tooltip after delay']) {
    await page.goto('/iframe.html?id=migration-proofs-tooltip--trigger-lifetime&viewMode=story&globals=a11y.manual:!true');
    await page.getByRole('button', { name: action }).click();
    const original = page.getByRole('button', { name: 'Action 0', exact: true });
    await original.hover();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await expect(original).toHaveCount(0);
    await page.mouse.move(1, 1);
    // Exceed the original 3000ms delay after its trigger was detached.
    await page.waitForTimeout(3200);
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText('Action open requests: 0');
    if (action.startsWith('Replace')) {
      const replacement = page.getByRole('button', { name: 'Action 1', exact: true });
      await expect(replacement).not.toHaveAttribute('aria-describedby');
      await page.keyboard.press('Tab');
      await replacement.focus();
      await expect(page.getByRole('tooltip')).toHaveText('Help for action 1');
    }
  }
});
