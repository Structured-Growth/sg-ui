import { expect, test } from '@playwright/test';

// Genuine browser key gestures; no setSelection, insertText, fill, or synthetic
// composition events. Real OS IME remains the separate operator requirement.
test('Escape from floating formatting returns to ordinary editing without a sticky selection', async ({ page }) => {
  await page.goto('/fixtures/?id=editors-pagerichtexteditorsection--saved-rich-document&globals=a11y.manual:!true');
  const editor = page.getByRole('textbox', { name: 'Saved rich document', exact: true });
  const toolbar = page.getByRole('group', { name: 'Selection formatting', exact: true });
  const ending = editor.locator('p').filter({ hasText: /^Edit this ending$/ });
  await ending.click();
  await page.keyboard.press('End');
  for (let i = 0; i < 'ending'.length; i++) await page.keyboard.press('Shift+ArrowLeft', { delay: 25 });
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('ending');
  await expect(toolbar).toBeVisible();
  await page.keyboard.press('Alt+F10');
  await expect(toolbar.getByRole('button', { name: 'Bold', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toolbar).toBeHidden();
  await expect(editor).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.type('!');
  await expect(ending).toHaveCount(0);
  await expect(editor.locator('p').filter({ hasText: /^Edit this ending!$/ })).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => window.getSelection()?.isCollapsed)).toBe(true);
  await expect(toolbar).toBeHidden();
  await expect(editor).not.toHaveAttribute('data-focus-visible', 'true');
  await page.keyboard.press('Backspace');
  await expect(editor.locator('p').filter({ hasText: /^Edit this ending$/ })).toHaveCount(1);
  await page.getByRole('button', { name: 'Reload saved document', exact: true }).click();
  await expect(editor.locator('p').filter({ hasText: /^Edit this ending$/ })).toHaveCount(1);
});

test('read-only invalidation removes floating actions and re-enabling preserves plain typing', async ({ page }) => {
  await page.goto('/fixtures/?id=editors-pagerichtexteditorsection--saved-rich-document&globals=a11y.manual:!true');
  const editor = page.getByRole('textbox', { name: 'Saved rich document', exact: true });
  const toolbar = page.getByRole('group', { name: 'Selection formatting', exact: true });
  await editor.locator('p').filter({ hasText: /^Edit this ending$/ }).click();
  await page.keyboard.press('End');
  await page.keyboard.press('Shift+Home');
  await expect(toolbar).toBeVisible();
  const saved = await page.getByLabel('Saved rich JSON', { exact: true }).textContent();
  await page.getByRole('button', { name: 'Make read-only', exact: true }).click();
  await expect(editor).toHaveAttribute('contenteditable', 'false');
  await expect(toolbar).toBeHidden();
  await editor.focus();
  await page.keyboard.type('Rejected edit');
  await expect(page.getByLabel('Saved rich JSON', { exact: true })).toHaveText(saved!);
  await expect(editor).not.toContainText('Rejected edit');
  await page.getByRole('button', { name: 'Enable editing', exact: true }).click();
  await editor.locator('p').filter({ hasText: /^Edit this ending$/ }).click();
  await page.keyboard.press('End');
  await page.keyboard.type(' accepted');
  await expect(editor).toContainText('Edit this ending accepted');
  await expect(toolbar).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.getSelection()?.isCollapsed)).toBe(true);
});
