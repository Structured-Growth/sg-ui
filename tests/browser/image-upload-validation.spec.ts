import { test, expect } from '@playwright/test';

const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==', 'base64');
for (const theme of ['light', 'dark']) {
  test(`image picker rejects invalid metadata and empty files before host submission: ${theme}`, async ({ page }) => {
    const diagnostics: string[] = [];
    page.on('pageerror', error => diagnostics.push(error.message));
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
    await page.goto(`/iframe.html?id=editors-imageuploadmodal--file-validation&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
    const trigger = page.getByRole('button', { name: 'Validate image file' });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    const input = page.getByLabel('Choose image');
    const insert = dialog.getByRole('button', { name: 'Insert', exact: true });
    await page.getByRole('textbox', { name: 'Image description' }).fill('Retained description');
    await input.setInputFiles({ name: 'valid.png', mimeType: 'image/png', buffer: pixel });
    await expect(dialog.locator('img')).toHaveJSProperty('naturalWidth', 1);
    // A native DataTransfer drop must use the same validation as the picker.
    await dialog.locator('[data-sgui-part="image-upload"] > div').first().evaluate(zone => {
      const transfer = new DataTransfer();
      transfer.items.add(new File([], 'empty.png', { type: 'image/png' }));
      zone.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
    });
    await expect(dialog.locator('img')).toHaveCount(0);
    await expect(dialog.getByRole('alert')).toHaveText('Choose a nonempty image file.');
    await expect(insert).toBeDisabled();
    for (const mimeType of ['image/', 'image/*', 'image/png;charset=utf-8', 'text/plain']) {
      await input.setInputFiles({ name: 'misleading.png', mimeType, buffer: pixel });
      await expect(dialog.getByRole('alert')).toHaveText('Choose a nonempty image file.');
      await expect(input).toHaveValue('');
      await expect(insert).toBeDisabled();
      await expect(page.getByLabel('Received image file')).toHaveText('No submission');
    }
    // Playwright's file picker infers MIME from the extension; construct a truly
    // MIME-less native File to exercise the extension fallback.
    await dialog.locator('[data-sgui-part="image-upload"] > div').first().evaluate((zone, bytes) => {
      const transfer = new DataTransfer();
      transfer.items.add(new File([new Uint8Array(bytes)], 'fallback.PNG'));
      zone.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer }));
    }, [...pixel]);
    await expect(dialog.getByRole('alert')).toHaveCount(0);
    await expect(dialog.locator('img')).toHaveJSProperty('naturalWidth', 1);
    await expect(page.getByRole('textbox', { name: 'Image description' })).toHaveValue('Retained description');
    await insert.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toHaveCount(0);
    await expect(page.getByLabel('Received image file')).toHaveText('fallback.PNG; no MIME; Retained description');
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(page.getByRole('textbox', { name: 'Image description' })).toHaveValue('');
    await expect(insert).toBeDisabled();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    expect(diagnostics).toEqual([]);
  });
}
