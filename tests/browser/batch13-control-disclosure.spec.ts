import { expect, test } from '@playwright/test';

test('host collapse preserves outside focus after focused draft removal', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-disclosure--removed-focused-draft&viewMode=story');
  const trigger = page.getByRole('button', { name: 'Details', exact: true });
  const host = page.getByRole('button', { name: 'Toggle details from host' });
  const draft = page.getByRole('textbox', { name: 'Temporary draft' });
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await draft.focus();
  await draft.press('Escape');
  await expect(draft).toHaveCount(0);
  await host.focus();
  await host.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(host).toBeFocused();
  await host.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(host).toBeFocused();
});
