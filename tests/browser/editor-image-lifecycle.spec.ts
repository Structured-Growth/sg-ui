import { test, expect, type Page } from '@playwright/test';

type ObservedPage = Page & { diagnostics?: string[] };
test.beforeEach(async ({ page }) => {
  const diagnostics: string[] = [];
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
  (page as ObservedPage).diagnostics = diagnostics;
});
test.afterEach(async ({ page }) => { expect((page as ObservedPage).diagnostics).toEqual([]); });

for (const theme of ['light', 'dark']) {
  test(`local image undo/read-only lifetime and document cleanup: ${theme}`, async ({ page }, info) => {
    await page.goto(`/iframe.html?id=editors-pagerichtexteditorsection--local-image-lifecycle&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
    const editor = page.getByRole('textbox', { name: 'Local image document', exact: true });
    await expect(editor).toBeVisible();
    // Observe real allocation/release while preserving the native browser methods.
    await page.evaluate(() => {
      const events: { type: string; url: string }[] = [];
      (window as unknown as { imageUrlEvents: typeof events }).imageUrlEvents = events;
      const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
      URL.createObjectURL = object => { const url = create(object); events.push({ type: 'create', url }); return url; };
      URL.revokeObjectURL = url => { events.push({ type: 'revoke', url }); revoke(url); };
    });
    async function insertImage() {
      await editor.focus();
      await page.getByRole('button', { name: 'Insert', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Image', exact: true }).click();
      await page.getByLabel('Choose image').setInputFiles({ name: 'pixel.png', mimeType: 'image/png',
        buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a5XkAAAAASUVORK5CYII=', 'base64') });
      await page.getByRole('textbox', { name: 'Image description' }).fill('Course diagram');
      await page.getByRole('dialog', { name: 'Insert Image' }).getByRole('button', { name: 'Insert', exact: true }).click();
      const image = editor.getByRole('img', { name: 'Course diagram' });
      await expect(image).toBeVisible();
      await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(1);
      const url = (await image.getAttribute('src'))!;
      await expect(page.getByLabel('Saved image document')).toContainText(url);
      return url;
    }
    const first = await insertImage();
    await editor.focus();
    await page.keyboard.press('ControlOrMeta+Z');
    await expect(editor.getByRole('img')).toHaveCount(0);
    await page.keyboard.press('ControlOrMeta+Shift+Z');
    await expect(editor.getByRole('img')).toHaveAttribute('src', first);
    await expect.poll(() => editor.getByRole('img').evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(1);
    await page.getByRole('button', { name: 'Make read-only' }).click();
    await expect(editor).toHaveAttribute('contenteditable', 'false');
    const events = () => page.evaluate(() => (window as unknown as { imageUrlEvents: { type: string; url: string }[] }).imageUrlEvents);
    expect((await events()).filter(event => event.type === 'revoke' && event.url === first)).toHaveLength(0);
    await page.getByRole('button', { name: 'New document' }).click();
    await expect(editor.getByRole('img')).toHaveCount(0);
    await expect.poll(async () => (await events()).filter(event => event.type === 'revoke' && event.url === first).length).toBe(1);
    const second = await insertImage();
    await page.getByRole('button', { name: 'Close editor' }).click();
    await expect(editor).toHaveCount(0);
    await expect.poll(async () => (await events()).filter(event => event.type === 'revoke' && event.url === second).length).toBe(1);
    const observed = await events();
    // Both modal previews and both document images have separate, balanced lifetimes.
    expect(observed.filter(event => event.type === 'create')).toHaveLength(4);
    for (const event of observed.filter(event => event.type === 'create')) {
      expect(observed.filter(other => other.type === 'revoke' && other.url === event.url)).toHaveLength(1);
    }
    await info.attach('native-image-url-lifetimes', { body: JSON.stringify(observed), contentType: 'application/json' });
  });
}
