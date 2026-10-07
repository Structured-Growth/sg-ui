import { test, expect } from '@playwright/test';

const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==', 'base64');
for (const mode of ['reset', 'read-only', 'unmount']) {
  for (const outcome of ['success', 'failure']) {
    test(`late host ${outcome} after ${mode} leaves the document untouched`, async ({ page }) => {
      const diagnostics: string[] = [];
      page.on('pageerror', error => diagnostics.push(error.message));
      page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
      await page.goto('/iframe.html?id=editors-pagerichtexteditorsection--host-upload-lifecycle&viewMode=story&globals=a11y.manual:!true');
      await page.getByRole('button', { name: `Use ${mode}`, exact: true }).click();
      await page.getByRole('button', { name: `Late ${outcome}`, exact: true }).click();
      const editor = page.getByRole('textbox', { name: 'Host upload document', exact: true });
      await editor.fill('Preserved host text');
      await expect(page.getByLabel('Host upload document JSON')).toContainText('Preserved host text');
      await page.getByRole('button', { name: 'Insert', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Image', exact: true }).click();
      await page.getByLabel('Choose image').setInputFiles({ name: 'cover.png', mimeType: 'image/png', buffer: pixel });
      await page.getByRole('textbox', { name: 'Image description' }).fill('Abandoned description');
      await page.getByRole('dialog').getByRole('button', { name: 'Insert', exact: true }).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(page.getByLabel('Host upload completion')).toHaveText('1');
      await expect(page.getByRole('alert')).toHaveCount(0);
      await page.getByRole('button', { name: 'Resume editor' }).click();
      await expect(editor).toHaveAttribute('contenteditable', 'true');
      await expect(editor.locator('[data-sgui-part="editor-image"]')).toHaveCount(0);
      expect(await page.getByLabel('Host upload document JSON').textContent()).not.toContain('stale-host-image');
      expect(await page.getByLabel('Host upload document JSON').textContent()).not.toContain('Abandoned description');
      // Reopening proves a stale promise did not retain the draft or busy state.
      await editor.focus();
      await page.getByRole('button', { name: 'Insert', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Image', exact: true }).click();
      await expect(page.getByRole('textbox', { name: 'Image description' })).toHaveValue('');
      await expect(page.getByRole('button', { name: 'Search Files' })).toBeEnabled();
      await expect(page.getByRole('dialog').getByRole('button', { name: 'Insert', exact: true })).toBeDisabled();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      if (mode === 'read-only') await expect(editor).toHaveText('Preserved host text');
      expect(diagnostics).toEqual([]);
    });
  }
}
