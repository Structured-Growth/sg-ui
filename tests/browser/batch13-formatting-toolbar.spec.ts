import { test, expect } from '@playwright/test';

for (const control of ['heading', 'fontFamily'] as const) {
  for (const mode of ['replace', 'remove', 'disable'] as const) {
    test(`${control} native Enter respects ${mode} before deferred host delivery`, async ({ page }) => {
      const diagnostics: string[] = [];
      page.on('pageerror', error => diagnostics.push(error.message));
      await page.goto('/iframe.html?id=editors-richtextformattingtoolbar--callback-replacement&viewMode=story&globals=a11y.manual:!true');
      await page.getByRole('button', { name: mode === 'replace' ? 'Replace callback' : mode === 'remove' ? 'Remove callback' : 'Disable controls', exact: true }).click();
      const trigger = page.getByRole('button', { name: control === 'heading' ? /Text style heading/ : /Font family/ });
      await trigger.focus();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Command owner')).toHaveText('Current owner');
      if (mode === 'replace') {
        await expect(page.getByRole('status')).toHaveText(`Current owner: ${control === 'heading' ? 'Heading 1' : 'Georgia'}`);
        await expect(page.getByRole('textbox', { name: 'Host editor' })).toBeFocused();
      } else {
        await expect(trigger).toBeDisabled();
        // Cross a task boundary so a stale queued callback cannot hide behind an early assertion.
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 30)));
        await expect(page.getByRole('status')).toHaveText('Waiting for a request');
      }
      await expect(page.getByRole('textbox', { name: 'Host editor' })).toHaveText('Guide');
      await expect(trigger).toContainText(control === 'heading' ? 'Normal' : 'Arial');
      expect(diagnostics).toEqual([]);
    });
  }
}
