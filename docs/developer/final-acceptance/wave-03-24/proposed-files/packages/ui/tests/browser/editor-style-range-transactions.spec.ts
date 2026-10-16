import { expect, test, type Page } from '@playwright/test';
type Run = { text: string; format: number; style: string; type: string; version: number; detail: number; mode: string };
type SavedDocument = { root: { children: { children: Run[] }[] } };
async function saved(page: Page): Promise<SavedDocument> {
  return JSON.parse((await page.getByLabel('Saved mixed formatting JSON').textContent())!);
}
function characters(value: SavedDocument) {
  return value.root.children[0].children.flatMap(run => [...run.text].map(text => ({ ...run, text })));
}
for (const label of ['Uppercase', 'Clear Formatting'] as const) {
  test(`${label} respects native partial-run boundaries and saved history`, async ({ page }, info) => {
    await page.goto('/fixtures/?id=editors-pagerichtexteditorsection-mixed-formatting--mixed-run-history&globals=theme:light;a11y.manual:!true');
    const editor = page.getByRole('textbox', { name: 'Mixed formatting document', exact: true });
    await editor.click();
    await expect(editor).toBeFocused();
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+ArrowLeft' : 'Home');
    await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
    for (let index = 0; index < 'ld plain Ita'.length; index++) await page.keyboard.press('Shift+ArrowRight');
    // Observe only. Selection setup uses native pointer/keyboard input.
    await expect.poll(() => editor.evaluate(() => window.getSelection()?.toString())).toBe('ld plain Ita');
    const before = await saved(page);
    const expected = characters(before).map((character, index) => index < 2 || index >= 14 ? character : {
      ...character, text: label === 'Uppercase' ? character.text.toUpperCase() : character.text,
      format: label === 'Clear Formatting' ? 0 : character.format,
      style: label === 'Clear Formatting' ? '' : character.style,
    });
    await page.getByRole('button', { name: 'Text style', exact: true }).click();
    await page.keyboard.press(label === 'Uppercase' ? 'Home' : 'End');
    if (label === 'Uppercase') await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: label, exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect.poll(async () => characters(await saved(page))).toEqual(expected);
    await expect(editor).toBeFocused();
    await expect.poll(() => editor.evaluate(() => window.getSelection()?.toString())).toBe(label === 'Uppercase' ? 'LD PLAIN ITA' : 'ld plain Ita');
    const changed = await saved(page);
    await page.getByRole('button', { name: 'Undo', exact: true }).click();
    await expect.poll(() => saved(page)).toEqual(before);
    await page.getByRole('button', { name: 'Redo', exact: true }).click();
    await expect.poll(() => saved(page)).toEqual(changed);
    await page.getByRole('button', { name: 'Reload saved mixed document', exact: true }).click();
    await expect.poll(() => saved(page)).toEqual(changed);
    await expect(editor).toHaveText(label === 'Uppercase' ? 'BoLD PLAIN ITAlic' : 'Bold plain Italic');
    await page.getByRole('button', { name: 'Undo', exact: true }).click();
    await expect.poll(() => saved(page)).toEqual(changed);
    await info.attach('style-range-before-after', { body: JSON.stringify({ before, changed }), contentType: 'application/json' });
  });
}
