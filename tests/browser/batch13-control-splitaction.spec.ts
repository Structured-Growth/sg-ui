import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-splitaction--host-updates&viewMode=story&globals=a11y.manual:!true');
  await expect(page.getByRole('button', { name: 'Create course' })).toBeVisible();
});

for (const [key, state] of [['l', 'pending'], ['d', 'disabled']] as const) {
  test(`host ${state} closes the focused menu and recovery does not reopen it`, async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'More actions' });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Import courses' })).toBeFocused();
    await page.keyboard.press(`Alt+${key}`);
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(trigger).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Create course' })).toBeDisabled();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('No action');
    await page.getByRole('button', { name: 'Restore actions' }).click();
    await expect(trigger).toBeEnabled();
    await expect(page.getByRole('menu')).toHaveCount(0);
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('Original import');
    await expect(trigger).toBeFocused();
  });
}

test('host replacement keeps its anchor, uses current actions and returns focus after activation', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'More actions' });
  const anchor = await trigger.elementHandle();
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Alt+r');
  await expect(page.getByRole('menuitem', { name: 'Import courses' })).toHaveCount(0);
  const replacement = page.getByRole('menuitem', { name: 'Upload courses' });
  await expect(replacement).toBeVisible();
  expect(await trigger.evaluate((element, original) => element === original, anchor)).toBe(true);
  await replacement.click();
  await expect(page.getByRole('status')).toHaveText('Replacement upload');
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'Create course' }).click();
  await expect(page.getByRole('status')).toHaveText('Replacement primary');
});

test('removing the host control removes its open portal without dispatching an action', async ({ page }) => {
  await page.getByRole('button', { name: 'More actions' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Alt+u');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'More actions' })).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveText('No action');
  await page.getByRole('button', { name: 'Restore actions' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'More actions' })).toBeVisible();
  await expect(page.getByRole('menu')).toHaveCount(0);
});
