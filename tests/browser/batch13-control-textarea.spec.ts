import { test, expect } from '@playwright/test';

test('native textarea reset respects host prevention and latest defaults without value callbacks', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/iframe.html?id=migration-proofs-textarea--native-reset&viewMode=story&globals=a11y.manual:!true');
  const draft = page.getByRole('textbox', { name: 'Draft summary', exact: true });
  const controlled = page.getByRole('textbox', { name: 'Controlled summary', exact: true });
  await draft.fill('Edited\ndraft');
  await page.getByRole('button', { name: 'Replace default', exact: true }).click();
  await expect(draft).toHaveValue('Edited\ndraft');
  const changes = await page.getByLabel('Value changes').textContent();
  await page.getByText('Prevent reset', { exact: true }).click();
  await page.getByRole('button', { name: 'Reset summaries', exact: true }).click();
  // Observe after the component's deferred reset decision.
  await page.waitForTimeout(50);
  await expect(draft).toHaveValue('Edited\ndraft');
  await expect(page.getByLabel('Value changes')).toHaveText(changes!);
  await page.getByText('Prevent reset', { exact: true }).click();
  await page.getByRole('button', { name: 'Reset summaries', exact: true }).click();
  await expect(draft).toHaveValue('Latest\nsummary');
  await expect(controlled).toHaveValue('Host-owned summary');
  await expect(page.getByLabel('Value changes')).toHaveText(changes!);
  expect(await page.locator('#textarea-host-form').evaluate(form => Object.fromEntries(new FormData(form as HTMLFormElement))))
    .toEqual({ summary: 'Latest\nsummary', controlledSummary: 'Host-owned summary' });
  expect(errors).toEqual([]);
});

test('textarea ref focus and validation descriptions preserve the native field name', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-textarea--native-reset&viewMode=story&globals=a11y.manual:!true');
  const draft = page.getByRole('textbox', { name: 'Draft summary', exact: true });
  await page.getByRole('button', { name: 'Focus draft through ref', exact: true }).click();
  await expect(draft).toBeFocused();
  await expect(draft).toHaveAttribute('rows', '5');
  await expect(draft).toHaveAttribute('autocomplete', 'off');
  await page.getByRole('button', { name: 'Toggle validation', exact: true }).click();
  await expect(draft).toHaveAccessibleDescription('Host guidance Multiline guidance Add a summary');
  await expect(draft).toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('button', { name: 'Toggle validation', exact: true }).click();
  await expect(draft).toHaveAccessibleDescription('Host guidance Multiline guidance');
});
