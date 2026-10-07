import { test, expect, type Page } from '@playwright/test';

const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==', 'base64');
type ObservedPage = Page & { diagnostics?: string[] };
test.beforeEach(async ({ page }) => {
  const diagnostics: string[] = [];
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
  page.on('dialog', dialog => { diagnostics.push(`Unexpected dialog: ${dialog.message()}`); void dialog.dismiss(); });
  (page as ObservedPage).diagnostics = diagnostics;
  await page.route('**/image-policy-pixel.png', route => route.fulfill({ contentType: 'image/png', body: pixel }));
});
test.afterEach(async ({ page }) => { expect((page as ObservedPage).diagnostics).toEqual([]); });
async function saved(page: Page) {
  return JSON.parse((await page.getByLabel('Saved image source JSON').textContent()) ?? 'null');
}
async function open(page: Page, theme: string) {
  await page.goto(`/iframe.html?id=editors-pagerichtexteditorsection--image-sources&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
  return page.getByRole('textbox', { name: 'Image source document', exact: true });
}

for (const theme of ['light', 'dark']) {
  test(`saved image sources preserve metadata and suppress rejected requests after reload: ${theme}`, async ({ page }) => {
    const rejectedRequests: string[] = [];
    page.on('request', request => { if (request.url().includes('rejected-image-policy') || request.url().startsWith('file:')) rejectedRequests.push(request.url()); });
    const editor = await open(page, theme);
    for (const name of ['Relative illustration', 'Web illustration', 'Embedded illustration', 'Embedded SVG illustration']) {
      const image = editor.getByRole('img', { name, exact: true });
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(1);
    }
    const before = await saved(page);
    for (const mode of ['editable', 'read-only']) {
      if (mode === 'read-only') await page.getByRole('button', { name: 'Make read-only' }).click();
      await page.getByRole('button', { name: 'Reload saved document' }).click();
      await expect(editor).toHaveAttribute('contenteditable', mode === 'editable' ? 'true' : 'false');
      for (const name of ['Rejected script image', 'Rejected HTML image', 'Rejected network image', 'Rejected file image']) {
        const fallback = editor.getByRole('img', { name, exact: true });
        await expect(fallback).toHaveText('Image unavailable');
        expect(await fallback.evaluate(element => element.tagName)).toBe('SPAN');
        await expect(fallback).not.toHaveAttribute('src');
      }
      await expect(editor.locator('[data-sgui-part="editor-image-unavailable"][aria-hidden="true"]')).toHaveCount(1);
      // Lexical adds empty WebKit linebreak images outside the owned decoration.
      await expect(editor.locator('[data-sgui-part="editor-image"] > img')).toHaveCount(4);
      expect(await saved(page)).toEqual(before);
    }
    expect(rejectedRequests).toEqual([]);
  });

  test(`unsupported host upload remains retryable with the same description: ${theme}`, async ({ page }) => {
    const editor = await open(page, theme);
    const before = await saved(page);
    await editor.focus();
    await page.keyboard.press('ControlOrMeta+End');
    await page.getByRole('button', { name: 'Insert', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Image', exact: true }).click();
    await page.getByLabel('Choose image').setInputFiles({ name: 'cover.png', mimeType: 'image/png', buffer: pixel });
    await page.getByRole('textbox', { name: 'Image description' }).fill('Uploaded course cover');
    const dialog = page.getByRole('dialog', { name: 'Insert Image' });
    await dialog.getByRole('button', { name: 'Insert', exact: true }).click();
    await expect(dialog.getByRole('alert')).toHaveText('The uploaded image address is not supported. Try again.');
    await expect(dialog.getByText('cover.png', { exact: true })).toBeVisible();
    await expect(dialog.getByRole('textbox', { name: 'Image description' })).toHaveValue('Uploaded course cover');
    expect(await saved(page)).toEqual(before);
    await dialog.getByRole('button', { name: 'Insert', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    const image = editor.getByRole('img', { name: 'Uploaded course cover', exact: true });
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(1);
    const output = JSON.stringify(await saved(page));
    expect(output).toContain('"assetId":"uploaded-image"');
    expect(output).toContain('"altText":"Uploaded course cover"');
    expect(output).not.toContain('unsafe-upload');
    await page.getByRole('button', { name: 'Reload saved document' }).click();
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(1);
  });
}
