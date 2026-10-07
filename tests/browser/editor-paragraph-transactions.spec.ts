import { expect, test, type Page } from '@playwright/test';

type Paragraph = { format: string; indent: number; children: unknown[] };
type SavedDocument = { root: { children: Paragraph[] } };
async function saved(page: Page): Promise<SavedDocument> {
  return JSON.parse((await page.getByLabel('Saved paragraph JSON').textContent())!);
}
async function selectTarget(page: Page) {
  const editor = page.getByRole('textbox', { name: 'Paragraph transaction document', exact: true });
  await editor.locator('p').first().click();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  for (let index = 0; index < 6; index++) await page.keyboard.press('Shift+ArrowRight');
  await expect(editor).toBeFocused();
  await expect.poll(() => selection(page)).toEqual({ text: 'rget p', anchor: 2, focus: 8, target: true });
  return editor;
}
async function selection(page: Page) {
  // Observation only: all selection setup above uses trusted native keyboard events.
  return page.getByRole('textbox', { name: 'Paragraph transaction document', exact: true }).evaluate(root => {
    const selection = window.getSelection();
    const paragraph = root.querySelector('p')!;
    return { text: selection?.toString(), anchor: selection?.anchorOffset, focus: selection?.focusOffset,
      target: !!selection?.anchorNode && !!selection.focusNode && paragraph.contains(selection.anchorNode) && paragraph.contains(selection.focusNode) };
  });
}
for (const theme of ['light', 'dark']) {
  test(`${theme} real paragraph commands preserve native selection, history and saved reload`, async ({ page }, info) => {
    const diagnostics: string[] = [];
    page.on('pageerror', error => diagnostics.push(error.message));
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
    await page.goto(`/iframe.html?id=editors-pagerichtexteditorsection-paragraph-transactions--paragraph-command-history&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
    const editor = await selectTarget(page);
    await expect.poll(async () => (await saved(page)).root.children[0]).toHaveProperty('textFormat');
    const before = await saved(page);
    const expected = (indent: number) => ({ ...before, root: { ...before.root,
      children: before.root.children.map((paragraph, index) => index === 0 ? { ...paragraph, format: 'center', indent } : paragraph) } });
    async function assertDocument(value: SavedDocument) {
      await expect.poll(() => saved(page)).toEqual(value);
      await expect(editor).toHaveText('Target paragraphAdjacent paragraph');
      await expect(editor.locator('p').first()).toHaveCSS('text-align', value.root.children[0].format);
      await expect(editor.locator('p').nth(1)).toHaveCSS('text-align', 'right');
      await expect(editor.locator('p').first().locator('strong')).toHaveText('Target paragraph');
      await expect(editor.locator('p').nth(1).locator('em')).toHaveText('Adjacent paragraph');
    }
    for (const [label, indent, keys] of [
      ['Center Align', 0, ['Home', 'ArrowDown']],
      ['Indent', 1, ['End']],
      ['Outdent', 0, ['End', 'ArrowUp']],
    ] as const) {
      const previous = await saved(page);
      const trigger = page.getByRole('button', { name: /^(Left|Center) Align$/ });
      await trigger.click();
      const menu = page.getByRole('menu', { name: 'Text alignment', exact: true });
      for (const key of keys) await page.keyboard.press(key);
      await expect(menu.getByRole(label === 'Center Align' ? 'menuitemradio' : 'menuitem', { name: label, exact: true })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(menu).toHaveCount(0);
      await expect(trigger).toBeFocused();
      const next = expected(indent);
      await assertDocument(next);
      await expect.poll(() => selection(page)).toEqual({ text: 'rget p', anchor: 2, focus: 8, target: true });
      await page.getByRole('button', { name: 'Undo', exact: true }).click();
      await assertDocument(previous);
      await expect.poll(() => selection(page)).toEqual({ text: 'rget p', anchor: 2, focus: 8, target: true });
      await page.getByRole('button', { name: 'Redo', exact: true }).click();
      await assertDocument(next);
      await expect.poll(() => selection(page)).toEqual({ text: 'rget p', anchor: 2, focus: 8, target: true });
    }
    const final = await saved(page);
    await page.getByRole('button', { name: 'Reload saved paragraphs', exact: true }).click();
    await assertDocument(final);
    await page.getByRole('button', { name: 'Undo', exact: true }).click();
    await assertDocument(final);
    await selectTarget(page);
    await assertDocument(final);
    expect(diagnostics).toEqual([]);
    await info.attach('paragraph-command-saved-document', { body: JSON.stringify(final), contentType: 'application/json' });
  });
}
