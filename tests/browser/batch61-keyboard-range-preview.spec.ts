import { test, expect, type Page } from '@playwright/test';

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

for (const theme of ['light', 'dark']) {
  test(`focused range preview describes its endpoint without committing; unavailable boundary and Cancel: ${theme}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=migration-proofs-daterangeselector--focused-endpoint-preview&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
    const anchor = page.getByRole('button', { name: /Wednesday, February 28, 2024/ });
    await anchor.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    const unavailable = page.getByRole('button', { name: /Friday, March 1, 2024/ });
    await expect(unavailable).toBeFocused();
    await expect(unavailable).toHaveAccessibleDescription('No remaining capacity');
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-sgui-part="date-range-preview"]')).toHaveCount(0);
    await expect(page.getByLabel('Range commit count')).toHaveText('0');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(anchor).toBeFocused();
    await page.keyboard.press('Enter');
    const endpoint = page.getByRole('button', { name: /Thursday, February 29, 2024/ });
    await expect(endpoint).toBeFocused();
    const preview = page.locator('[data-sgui-part="date-range-preview"]');
    const context = page.locator('[data-sgui-part="date-range-preview-context"]');
    await expect(preview).toHaveText('Range preview: 2024-02-28 – 2024-02-29. Choose an end date to finish.');
    await expect(context).toHaveText('Anchor: 2024-02-28. Focused endpoint: 2024-02-29. Draft: 2024-02-28 – 2024-02-29. Apply commits the draft.');
    await expect(context).toBeVisible();
    await expect(endpoint).toHaveAccessibleDescription(/Range preview:.*Anchor: 2024-02-28. Focused endpoint: 2024-02-29. Draft:/);
    await expect(anchor).not.toHaveAccessibleDescription(/Range preview:/);
    await expect(preview).not.toHaveAttribute('role', 'status');
    await page.keyboard.press('ArrowRight');
    await expect(endpoint).toBeFocused();
    await expect(context).toContainText('Focused endpoint: 2024-02-29');
    await expect(unavailable).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByRole('button', { name: 'Apply', exact: true })).toBeDisabled();
    expect(await page.locator('form').evaluate(form => new FormData(form as HTMLFormElement).get('range.end'))).toBe('2024-02-29');
    await page.keyboard.press('ArrowLeft');
    await expect(anchor).toBeFocused();
    await expect(endpoint).not.toHaveAccessibleDescription(/Range preview:/);
    await expect(anchor).toHaveAccessibleDescription(/Focused endpoint: 2024-02-28/);
    const cancel = page.getByRole('button', { name: 'Cancel', exact: true });
    await cancel.focus();
    await page.keyboard.press('Enter');
    await expect(preview).toHaveCount(0);
    await expect(context).toHaveCount(0);
    await expect(anchor).not.toHaveAccessibleDescription(/Range preview:/);
    await expect(page.locator('[data-sgui-part="date-range-draft"]')).toHaveText('2024-02-28 – 2024-02-29');
    await expect(page.getByLabel('Committed preview dates')).toHaveText('2024-02-28 – 2024-02-29');
    await expect(page.getByLabel('Range commit count')).toHaveText('0');
  });
}
