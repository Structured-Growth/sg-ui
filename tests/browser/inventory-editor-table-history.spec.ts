import { test, expect, type Page } from '@playwright/test';

async function saved(page: Page) {
  return JSON.parse((await page.getByLabel('Saved table JSON').textContent()) ?? 'null');
}

for (const theme of ['light', 'dark']) {
  test(`twoEqual insertion, selected cell editing, history and host reload: ${theme}`, async ({ page }, info) => {
    const diagnostics: string[] = [];
    page.on('pageerror', error => diagnostics.push(error.message));
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
    await page.goto(`/iframe.html?id=editors-pagerichtexteditorsection--table-history&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
    const editor = page.getByRole('textbox', { name: 'Table history document', exact: true });
    await expect(editor).toBeVisible();
    await expect(editor).toHaveAttribute('contenteditable', 'true');
    const toolbar = page.getByRole('group', { name: 'Text formatting', exact: true });
    await expect(toolbar).toBeVisible();
    await editor.click();
    await page.keyboard.type('Course introduction');
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: 'Insert', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Columns Layout', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Choose columns layout' });
    await expect(dialog.getByRole('radio', { name: '2 columns (equal width)' })).toBeChecked();
    await dialog.getByRole('button', { name: 'Insert', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(editor).toBeFocused();
    const cells = editor.getByRole('cell');
    await expect(cells).toHaveCount(2);
    await cells.nth(0).click();
    await page.keyboard.type('First lesson');
    // Tab is handled by the actual table plugin, moving the native caret to cell two.
    await page.keyboard.press('Tab');
    await page.keyboard.type('Second lesson');
    await expect(cells).toHaveText(['First lesson', 'Second lesson']);
    const before = await saved(page);
    const table = before.root.children.find((node: { type: string }) => node.type === 'table');
    expect(table.children).toHaveLength(1);
    expect(table.children[0].children).toHaveLength(2);
    expect(table.colWidths).toBeUndefined();
    // A native range inside cell one must survive pointer focus on the toolbar.
    // Remain in the table plugin's keyboard path instead of clicking blank cell space.
    await page.keyboard.press('Shift+Tab');
    await expect.poll(() => cells.nth(0).evaluate(node => {
      const selection = window.getSelection();
      return Boolean(selection?.anchorNode && node.contains(selection.anchorNode));
    })).toBe(true);
    for (let i = 0; i < 'First lesson'.length; i++) await page.keyboard.press('ArrowLeft');
    await expect.poll(() => cells.nth(0).evaluate(node => {
      const selection = window.getSelection();
      return Boolean(selection?.anchorNode && node.contains(selection.anchorNode) && selection.anchorOffset === 0);
    })).toBe(true);
    for (let i = 0; i < 5; i++) await page.keyboard.press('Shift+ArrowRight');
    await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('First');
    await toolbar.getByRole('button', { name: 'Bold', exact: true }).click();
    await expect(cells.nth(0).locator('strong, b')).toHaveText('First');
    const formatted = await saved(page);
    expect(formatted).not.toEqual(before);
    await page.getByRole('button', { name: 'Undo', exact: true }).click();
    await expect.poll(() => saved(page)).toEqual(before);
    await page.getByRole('button', { name: 'Redo', exact: true }).click();
    await expect.poll(() => saved(page)).toEqual(formatted);
    await page.getByRole('button', { name: 'Reload saved table', exact: true }).click();
    await expect(cells).toHaveText(['First lesson', 'Second lesson']);
    await expect(cells.nth(0).locator('strong, b')).toHaveText('First');
    await expect(editor).toContainText('Course introduction');
    await expect.poll(() => saved(page)).toEqual(formatted);
    // Require the replacement editor to emit its own edit, then exercise its new history.
    await cells.nth(1).getByText('Second lesson', { exact: true }).click();
    await expect.poll(() => cells.nth(1).evaluate(node => {
      const selection = window.getSelection();
      return Boolean(selection?.anchorNode && node.contains(selection.anchorNode));
    })).toBe(true);
    // The table plugin selects the adjacent cell end; End is platform-dependent.
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect.poll(() => cells.nth(1).evaluate(node => {
      const selection = window.getSelection();
      return Boolean(selection?.isCollapsed && selection.anchorNode?.nodeType === Node.TEXT_NODE &&
        node.contains(selection.anchorNode) && selection.anchorNode.textContent === 'Second lesson' &&
        selection.anchorOffset === 'Second lesson'.length);
    })).toBe(true);
    await page.keyboard.type('!');
    await expect(cells.nth(1)).toHaveText('Second lesson!');
    const afterReload = await saved(page);
    expect(afterReload).not.toEqual(formatted);
    await page.getByRole('button', { name: 'Undo', exact: true }).click();
    await expect.poll(() => saved(page)).toEqual(formatted);
    await page.getByRole('button', { name: 'Redo', exact: true }).click();
    await expect.poll(() => saved(page)).toEqual(afterReload);
    expect(diagnostics).toEqual([]);
    await info.attach('table-history-saved-document', { body: JSON.stringify(afterReload), contentType: 'application/json' });
  });
}
