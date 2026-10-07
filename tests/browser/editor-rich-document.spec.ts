import { test, expect, type Page, type Locator } from '@playwright/test';

type ObservedPage = Page & { diagnostics?: string[] };
test.beforeEach(async ({ page }) => {
  const diagnostics: string[] = [];
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
  (page as ObservedPage).diagnostics = diagnostics;
});
test.afterEach(async ({ page }) => { expect((page as ObservedPage).diagnostics).toEqual([]); });

async function saved(page: Page) {
  return JSON.parse((await page.getByLabel('Saved rich JSON').textContent()) ?? 'null');
}
async function assertRichContent(editor: Locator) {
  await expect(editor.getByRole('heading', { name: 'Saved course guide' })).toBeVisible();
  await expect(editor.locator('strong, b').filter({ hasText: /^Bold$/ })).toHaveCount(1);
  await expect(editor.locator('em, i').filter({ hasText: /^ Italic$/ })).toHaveCount(1);
  await expect(editor.locator('.editor-text-underline').filter({ hasText: /^ Underlined$/ })).toHaveCount(1);
  await expect(editor.locator('.editor-text-strikethrough')).toHaveText(' Struck');
  await expect(editor.locator('.editor-text-code')).toHaveText(' Inline code');
  await expect(editor.locator('sub')).toHaveText(' Subscript');
  await expect(editor.locator('sup')).toHaveText(' Superscript');
  await expect(editor.getByText(' Colored', { exact: true })).toHaveCSS('color', 'rgb(18, 52, 86)');
  await expect(editor.getByText(' Colored', { exact: true })).toHaveCSS('background-color', 'rgb(255, 245, 157)');
  await expect(editor.locator('p').filter({ hasText: 'Bold Italic' })).toHaveCSS('text-align', 'center');
  await expect(editor.locator('p').filter({ hasText: 'Bold Italic' })).toHaveAttribute('style', /padding-inline-start/);
  await expect(editor.getByRole('link', { name: 'Course link' })).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(editor.locator('ol')).toHaveAttribute('start', '3');
  await expect(editor.locator('ul li')).toHaveText('Practice lesson');
  await expect(editor.locator('blockquote')).toHaveText('Learning takes practice');
  await expect(editor.locator('code[data-language="javascript"]')).toHaveText('const course = 1;\nreturn course;', { useInnerText: true });
  await expect(editor.getByRole('columnheader', { name: 'Lesson heading' })).toHaveCSS('background-color', 'rgb(255, 245, 157)');
  await expect(editor.getByRole('cell', { name: '10 minutes' })).toHaveCount(1);
  const image = editor.getByRole('img', { name: 'Saved course illustration' });
  await expect.poll(() => image.evaluate(node => (node as HTMLImageElement).naturalWidth)).toBe(1);
  await expect(editor.locator('hr')).toHaveCount(1);
}

for (const theme of ['light', 'dark']) {
  test(`rich nodes survive native edit, host reload and read-only: ${theme}`, async ({ page }, info) => {
    await page.goto(`/iframe.html?id=editors-pagerichtexteditorsection--saved-rich-document&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
    const editor = page.getByRole('textbox', { name: 'Saved rich document', exact: true });
    await expect(editor).toBeVisible();
    await assertRichContent(editor);
    await editor.locator('p').filter({ hasText: /^Edit this ending$/ }).click();
    await page.keyboard.press('End');
    await page.keyboard.type(' saved');
    await expect(editor).toContainText('Edit this ending saved');
    const edited = await saved(page);
    expect(edited.root.children[8].children[0]).toMatchObject({ assetId: 'course-cover', assetVersionId: 'cover-v2', width: 640, height: 480, altText: 'Saved course illustration' });
    await page.getByRole('button', { name: 'Reload saved document' }).click();
    await assertRichContent(editor);
    await expect(editor).toContainText('Edit this ending saved');
    // Make another native edit to require the new editor's callback, not stale host JSON.
    await editor.locator('p').filter({ hasText: /^Edit this ending saved$/ }).click();
    await page.keyboard.press('End');
    await page.keyboard.type('!');
    await expect.poll(async () => (await saved(page)).root.children.at(-1).children[0].text).toBe('Edit this ending saved!');
    const reloaded = await saved(page);
    expect(reloaded.root.children.slice(0, -1)).toEqual(edited.root.children.slice(0, -1));
    await page.getByRole('button', { name: 'Make read-only' }).click();
    await expect(editor).toHaveAttribute('contenteditable', 'false');
    await assertRichContent(editor);
    await page.getByRole('button', { name: 'Reload saved document' }).click();
    await assertRichContent(editor);
    await expect(editor).toContainText('Edit this ending saved!');
    await info.attach('saved-rich-document', { body: JSON.stringify(reloaded), contentType: 'application/json' });
  });

  test(`saved lists continue and exit with native Enter; rules delete and undo: ${theme}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=editors-pagerichtexteditorsection--saved-rich-document&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
    const editor = page.getByRole('textbox', { name: 'Saved rich document', exact: true });
    const item = editor.locator('ol li').last();
    await item.click();
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Third lesson');
    await expect(editor.locator('ol li')).toHaveText(['First lesson', 'Second lesson', 'Third lesson']);
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.type('After the list');
    await expect(editor.locator('ol li')).toHaveCount(3);
    await expect(editor.locator('p').filter({ hasText: /^After the list$/ })).toHaveCount(1);
    const withRule = await saved(page);
    await editor.locator('hr').click();
    await page.keyboard.press('Backspace');
    await expect(editor.locator('hr')).toHaveCount(0);
    await page.keyboard.press('ControlOrMeta+Z');
    await expect(editor.locator('hr')).toHaveCount(1);
    await expect.poll(() => saved(page)).toEqual(withRule);
    await page.getByRole('button', { name: 'Reload saved document' }).click();
    await expect(editor.locator('ol li')).toHaveCount(3);
    await expect(editor.locator('p').filter({ hasText: /^After the list$/ })).toHaveCount(1);
    await expect(editor.locator('hr')).toHaveCount(1);
  });
}
