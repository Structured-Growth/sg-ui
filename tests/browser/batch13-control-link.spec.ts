import { test, expect } from '@playwright/test';

test('mixed-case new-tab target preserves native nested activation and ref focus', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-link--new-tab-targets&viewMode=story&globals=a11y.manual:!true');
  const link = page.getByRole('link', { name: 'Mixed-case new tab reference' });
  await expect(link).toHaveAttribute('href', '#new-tab-reference');
  await expect(link).toHaveAttribute('target', '_BLANK');
  await expect(link).toHaveAttribute('rel', 'author noopener noreferrer');
  await page.getByRole('button', { name: 'Focus reference link' }).click();
  await expect(link).toBeFocused();
  for (const activation of ['nested pointer', 'keyboard']) {
    const popupEvent = page.waitForEvent('popup');
    if (activation === 'nested pointer') await link.locator('span').click();
    else {
      await link.focus();
      await page.keyboard.press('Enter');
    }
    const popup = await popupEvent;
    await expect(popup).toHaveURL(/#new-tab-reference$/);
    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    await popup.close();
  }
  await expect(page.getByLabel('New tab events')).toHaveText('reference:click\nreference:click');
});
