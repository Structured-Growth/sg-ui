import { test, expect } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  for (const mode of ['replace', 'remove', 'read-only', 'unmount', 'remove-restore', 'read-only-restore', 'unchanged']) {
    test(`queued heading ${mode} uses committed availability and owner: ${theme}`, async ({ page }) => {
      const diagnostics: string[] = [];
      page.on('pageerror', error => diagnostics.push(error.message));
      page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
      await page.goto(`/iframe.html?id=components-documenteditortoolbar-heading-lifetime--queued-host-transition&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      await page.getByRole('button', { name: mode, exact: true }).click();
      const heading = page.getByRole('button', { name: /Text style heading/ });
      await heading.focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('ArrowDown');
      await expect(page.getByRole('option', { name: 'H1', exact: true })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Heading host commits')).toHaveText('1');
      await expect(page.getByLabel('Heading delivery checkpoint')).toHaveText('drained');
      const accepted = mode === 'replace' || mode === 'unchanged';
      await expect(page.getByLabel('Heading requests')).toHaveText(accepted ? `["${mode === 'replace' ? 'current' : 'original'}:h1"]` : '[]');
      const editor = page.getByRole('textbox', { name: 'Heading host editor' });
      await expect(editor).toHaveText('Preserved document');
      if (accepted) await expect(editor).toBeFocused();
      if (mode === 'unmount') await expect(heading).toHaveCount(0);
      else {
        await expect(heading).toContainText('Normal');
        if (mode === 'remove' || mode === 'read-only') await expect(heading).toBeDisabled();
        else await expect(heading).toBeEnabled();
      }
      expect(diagnostics).toEqual([]);
    });
  }
}
