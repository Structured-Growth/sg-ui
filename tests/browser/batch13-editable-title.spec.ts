import { test, expect } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  test(`host revokes title editing after persistence rejection: ${theme}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/iframe.html?id=editors-editabletitlefield--host-read-only-after-rejection&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
    await page.getByRole('button', { name: 'Edit title', exact: true }).click();
    const input = page.getByRole('textbox', { name: 'Document title' });
    await input.fill('Retry draft'); await input.press('Enter');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Could not save title. Try again.');
    await page.getByRole('button', { name: 'Make title read-only' }).click();
    await expect(input).toHaveAttribute('readonly', '');
    await expect(input).toBeFocused();
    await input.press('End'); await input.press('x'); await input.press('Enter');
    await expect(input).toHaveValue('Retry draft');
    await input.press('Tab');
    await expect(page.getByRole('button', { name: 'Allow title editing' })).toBeFocused();
    await expect(page.getByLabel('Save attempts')).toHaveText('1');
    await input.click(); await input.press('Escape');
    await expect(input).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Page title' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit title', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: 'Allow title editing' }).click();
    await page.getByRole('button', { name: 'Edit title', exact: true }).click();
    await expect(input).toHaveValue('Page title');
    await expect(page.getByLabel('Save attempts')).toHaveText('1');
    expect(errors).toEqual([]);
  });
}
