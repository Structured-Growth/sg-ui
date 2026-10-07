import { test, expect, type Page } from '@playwright/test';

type ObservedPage = Page & { diagnostics?: string[] };
test.beforeEach(async ({ page }) => {
  const diagnostics: string[] = [];
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
  (page as ObservedPage).diagnostics = diagnostics;
});
test.afterEach(async ({ page }) => { expect((page as ObservedPage).diagnostics).toEqual([]); });

async function setup(page: Page, theme: string) {
  await page.goto(`/iframe.html?id=editors-pagerichtexteditorsection--clipboard-editing&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
  const editor = page.getByRole('textbox', { name: 'Clipboard document', exact: true });
  await expect(editor).toBeVisible();
  // Observe real browser events without dispatching or changing clipboard data.
  await page.evaluate(() => {
    const events: { type: string; trusted: boolean; types: string[]; html: string; plain: string }[] = [];
    (window as unknown as { clipboardEvents: typeof events }).clipboardEvents = events;
    for (const type of ['copy', 'paste']) document.addEventListener(type, event => {
      const clipboard = event as ClipboardEvent;
      events.push({ type, trusted: event.isTrusted, types: Array.from(clipboard.clipboardData?.types ?? []),
        html: clipboard.clipboardData?.getData('text/html') ?? '', plain: clipboard.clipboardData?.getData('text/plain') ?? '' });
    }, true);
  });
  return editor;
}
async function nativeCopy(page: Page, name: string) {
  const source = page.getByRole('textbox', { name, exact: true });
  await source.focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('ControlOrMeta+C');
}
async function saved(page: Page) {
  return JSON.parse((await page.getByLabel('Saved document').textContent()) ?? 'null');
}
for (const theme of ['light', 'dark']) {
  test(`native multiline paste, undo/redo, serialization and read-only copy: ${theme}`, async ({ page }, info) => {
    const editor = await setup(page, theme);
    await nativeCopy(page, 'Plain clipboard source');
    await editor.focus();
    await page.keyboard.press('ControlOrMeta+V');
    await expect(editor).toContainText('First course line');
    await expect(editor).toContainText('Second course line');
    await expect.poll(async () => (await saved(page))?.root.children.length).toBe(2);
    const pasted = await saved(page);
    await page.keyboard.press('ControlOrMeta+Z');
    await expect(editor).toHaveText('');
    await page.keyboard.press('ControlOrMeta+Shift+Z');
    await expect(editor).toContainText('Second course line');
    await expect.poll(() => saved(page)).toEqual(pasted);
    await page.getByRole('button', { name: 'Reload saved document' }).click();
    await expect(editor).toContainText('Second course line');
    await page.getByRole('button', { name: 'Make read-only' }).click();
    await expect(editor).toHaveAttribute('contenteditable', 'false');
    const viewport = page.getByRole('region', { name: 'Document scroll region' });
    await viewport.focus();
    await page.keyboard.press('Tab');
    await expect(editor).toBeFocused();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('ControlOrMeta+C');
    const destination = page.getByRole('textbox', { name: 'Copy destination', exact: true });
    await destination.focus();
    await page.keyboard.press('ControlOrMeta+V');
    await expect(destination).toHaveValue(/^First course line\s+Second course line$/);
    await nativeCopy(page, 'Rich clipboard source');
    await editor.focus();
    await expect(editor).toBeFocused();
    await page.keyboard.press('ControlOrMeta+V');
    await page.keyboard.type('Rejected edit');
    await expect(editor).not.toContainText('Bold course');
    await expect(editor).not.toContainText('Rejected edit');
    await expect.poll(() => saved(page)).toEqual(pasted);
    const events = await page.evaluate(() => (window as unknown as { clipboardEvents: unknown[] }).clipboardEvents);
    await info.attach('native-clipboard-events', { body: JSON.stringify(events), contentType: 'application/json' });
    expect(events).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'copy', trusted: true }), expect.objectContaining({ type: 'paste', trusted: true, types: expect.arrayContaining(['text/plain']) })]));
    expect(events.every(event => (event as { trusted: boolean }).trusted)).toBe(true);
  });

  test(`native rich paste retains formatting through host serialization and ordinary shortcuts: ${theme}`, async ({ page }, info) => {
    const editor = await setup(page, theme);
    await nativeCopy(page, 'Rich clipboard source');
    await editor.focus();
    await page.keyboard.press('ControlOrMeta+V');
    await expect(editor.locator('strong, b')).toHaveText('Bold course');
    await expect(editor.locator('em, i')).toHaveText('italic lesson');
    const pasted = await saved(page);
    expect(pasted.root.children).toHaveLength(2);
    expect(pasted.root.children[0].children).toEqual(expect.arrayContaining([
      expect.objectContaining({ text: 'Bold course', format: 1 }), expect.objectContaining({ text: 'italic lesson', format: 2 }),
    ]));
    await page.getByRole('button', { name: 'Reload saved document' }).click();
    await expect(editor.locator('strong, b')).toHaveText('Bold course');
    await expect(editor.locator('em, i')).toHaveText('italic lesson');
    await editor.focus();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('ArrowRight');
    // Give native selectionchange delivery time between physical key gestures.
    for (let index = 0; index < 'Second paragraph'.length; index++) await page.keyboard.press('Shift+ArrowLeft', { delay: 25 });
    await expect.poll(() => editor.evaluate(() => window.getSelection()?.toString())).toBe('Second paragraph');
    await page.keyboard.press('ControlOrMeta+B');
    await expect.poll(async () => (await saved(page)).root.children[1].children[0].format).toBe(1);
    await expect(editor).toContainText('Second paragraph');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.type('!');
    await expect(editor).toContainText('Second paragraph!');
    const events = await page.evaluate(() => (window as unknown as { clipboardEvents: { type: string; trusted: boolean; types: string[]; html: string }[] }).clipboardEvents);
    // Linux WebKit can deliver native HTML while exposing an empty types list.
    // Require actual HTML bytes from that same trusted transfer, not enumeration.
    expect(events).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'paste', trusted: true,
      html: expect.stringMatching(/<(?:b|strong)[^>]*>Bold course<\/(?:b|strong)>/) })]));
    expect(events.every(event => event.trusted)).toBe(true);
    await info.attach('native-clipboard-events', { body: JSON.stringify(events), contentType: 'application/json' });
  });
}
