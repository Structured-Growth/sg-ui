import { expect, test, type Page } from '@playwright/test';

// History reconciliation can leave class="" on otherwise identical text spans.
// Normalize that exact attribute and attribute order on a detached clone.
// Attribute names/values, element structure and text otherwise stay exact.
export function canonicalMixedFormattingMarkup(root: HTMLElement): string {
  const clone = root.cloneNode(true) as HTMLElement;
  for (const node of clone.querySelectorAll('*')) {
    if (node.getAttribute('class') === '') node.removeAttribute('class');
    const attributes = [...node.attributes].sort((left, right) =>
      left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
    for (const attribute of attributes) node.removeAttributeNode(attribute);
    for (const attribute of attributes) node.setAttributeNode(attribute);
  }
  return clone.innerHTML;
}

type Run = { type: string; version: number; detail: number; mode: string; text: string; format: number; style: string };
type Document = { root: { children: { children: Run[] }[] } };
async function saved(page: Page): Promise<Document> {
  return JSON.parse((await page.getByLabel('Saved mixed formatting JSON').textContent())!);
}
function characters(document: Document) {
  return document.root.children[0].children.flatMap(run => [...run.text].map(text => ({ ...run, text })));
}
// Read native endpoints as text offsets without constructing or changing a Range.
function nativeSelectionState(root: HTMLElement) {
  const selection = window.getSelection();
  const textOffset = (node: Node | null, offset: number) => {
    if (!node || !root.contains(node)) return null;
    let total = node.nodeType === Node.TEXT_NODE ? offset
      : [...node.childNodes].slice(0, offset).reduce((sum, child) => sum + (child.textContent?.length ?? 0), 0);
    for (let current = node; current !== root; current = current.parentNode!) {
      for (let sibling = current.previousSibling; sibling; sibling = sibling.previousSibling) {
        total += sibling.textContent?.length ?? 0;
      }
    }
    return total;
  };
  return {
    focused: document.activeElement === root, documentFocused: document.hasFocus(),
    editable: root.isContentEditable, text: selection?.toString(), collapsed: selection?.isCollapsed,
    anchor: textOffset(selection?.anchorNode ?? null, selection?.anchorOffset ?? 0),
    focus: textOffset(selection?.focusNode ?? null, selection?.focusOffset ?? 0),
  };
}

async function selectMixedRange(page: Page) {
  const editor = page.getByRole('textbox', { name: 'Mixed formatting document', exact: true });
  await editor.click();
  try {
    await expect(editor).toBeFocused();
    await expect.poll(() => editor.evaluate(nativeSelectionState)).toMatchObject({
      focused: true, documentFocused: true, editable: true,
    });
    // One short line: macOS Home scrolls instead of establishing the caret anchor.
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+ArrowLeft' : 'Home');
    await expect.poll(() => editor.evaluate(nativeSelectionState)).toMatchObject({
      focused: true, documentFocused: true, editable: true, collapsed: true, anchor: 0, focus: 0,
    });
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => editor.evaluate(nativeSelectionState)).toMatchObject({
      focused: true, documentFocused: true, editable: true, collapsed: true, anchor: 2, focus: 2,
    });
    for (let index = 0; index < 'ld plain Ita'.length; index++) await page.keyboard.press('Shift+ArrowRight');
    // Observation only: no DOM Range, dispatchEvent, selection.modify or Lexical injection.
    await expect(editor).toHaveText('Bold plain Italic');
    await expect.poll(() => editor.evaluate(nativeSelectionState)).toEqual({
      focused: true, documentFocused: true, editable: true,
      text: 'ld plain Ita', collapsed: false, anchor: 2, focus: 14,
    });
  } finally {
    await test.info().attach('native-mixed-selection-precondition', {
      body: JSON.stringify({ platform: process.platform, ...await editor.evaluate(nativeSelectionState) }),
      contentType: 'application/json',
    });
  }
  return editor;
}

for (const theme of ['light', 'dark']) {
  for (const [label, mask, remove] of [['Bold', 1, true], ['Italic', 2, false], ['Underline', 8, false]] as const) {
    test(`${theme} native mixed-run ${label} preserves history and serialized reload`, async ({ page }, info) => {
      const diagnostics: string[] = [];
      page.on('pageerror', error => diagnostics.push(error.message));
      page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
      await page.goto(`/iframe.html?id=editors-pagerichtexteditorsection-mixed-formatting--mixed-run-history&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      const editor = await selectMixedRange(page);
      const toolbar = page.getByRole('group', { name: 'Text formatting', exact: true });
      const button = toolbar.getByRole('button', { name: label, exact: true });
      await expect(toolbar.getByRole('button', { name: 'Bold', exact: true })).toHaveAttribute('aria-pressed', 'false');
      await expect(toolbar.getByRole('button', { name: 'Italic', exact: true })).toHaveAttribute('aria-pressed', 'false');
      await expect(toolbar.getByRole('button', { name: 'Underline', exact: true })).toHaveAttribute('aria-pressed', 'false');
      // Wait for the actual initial callback rather than treating the fixture seed as emitted JSON.
      await expect.poll(async () => (await saved(page)).root.children[0]).toHaveProperty('textFormat');
      const before = await saved(page);
      const beforeMarkup = await editor.evaluate(canonicalMixedFormattingMarkup);
      const expected = characters(before).map((character, index) => index >= 2 && index < 14
        ? { ...character, format: remove ? character.format & ~mask : character.format | mask } : character);
      await button.click();
      await expect.poll(async () => characters(await saved(page))).toEqual(expected);
      await expect(button).toHaveAttribute('aria-pressed', String(!remove));
      await expect(editor).toHaveText('Bold plain Italic');
      await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('ld plain Ita');
      const formatted = await saved(page);
      const formattedMarkup = await editor.evaluate(canonicalMixedFormattingMarkup);
      await page.getByRole('button', { name: 'Undo', exact: true }).click();
      await expect.poll(() => saved(page)).toEqual(before);
      await expect.poll(() => editor.evaluate(canonicalMixedFormattingMarkup)).toBe(beforeMarkup);
      await expect(editor).toHaveText('Bold plain Italic');
      await page.getByRole('button', { name: 'Redo', exact: true }).click();
      await expect.poll(() => saved(page)).toEqual(formatted);
      await expect.poll(() => editor.evaluate(canonicalMixedFormattingMarkup)).toBe(formattedMarkup);
      await page.getByRole('button', { name: 'Reload saved mixed document', exact: true }).click();
      await expect(editor).toHaveText('Bold plain Italic');
      // The toolbar exposes the command, not history availability. An empty new history is inert.
      await page.getByRole('button', { name: 'Undo', exact: true }).click();
      await expect.poll(() => saved(page)).toEqual(formatted);
      await expect.poll(() => editor.evaluate(canonicalMixedFormattingMarkup)).toBe(formattedMarkup);
      // Select again after replacement: this proves the new editor is usable and emits its own JSON.
      await selectMixedRange(page);
      await expect(button).toHaveAttribute('aria-pressed', String(!remove));
      await expect.poll(() => saved(page)).toEqual(formatted);
      await expect.poll(() => editor.evaluate(canonicalMixedFormattingMarkup)).toBe(formattedMarkup);
      await expect.poll(async () => characters(await saved(page))).toEqual(expected);
      // Toggle the same action off/on in the replacement lifetime, then undo its new history entry.
      await button.click();
      await expect.poll(() => saved(page)).not.toEqual(formatted);
      await expect(editor).toHaveText('Bold plain Italic');
      await page.getByRole('button', { name: 'Undo', exact: true }).click();
      await expect.poll(() => saved(page)).toEqual(formatted);
      await expect.poll(() => editor.evaluate(canonicalMixedFormattingMarkup)).toBe(formattedMarkup);
      expect(diagnostics).toEqual([]);
      await info.attach('mixed-formatting-saved-document', { body: JSON.stringify(formatted), contentType: 'application/json' });
    });
  }
}
