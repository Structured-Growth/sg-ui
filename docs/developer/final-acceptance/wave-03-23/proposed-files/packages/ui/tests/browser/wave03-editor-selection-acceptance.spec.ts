import { expect, test, type Page } from '@playwright/test';

const url = '/fixtures/?id=editors-pagerichtexteditorsection-paragraph-transactions--selection-acceptance&globals=a11y.manual:!true';
const editor = (page: Page) => page.getByRole('textbox', { name: 'Selection acceptance document', exact: true });
const toolbar = (page: Page) => page.getByRole('group', { name: 'Text formatting', exact: true });
const saved = async (page: Page) => JSON.parse((await page.getByLabel('Selection acceptance JSON').textContent())!);
// Same native keyboard strategy as editor-paragraph-transactions / mixed-formatting;
// DOM selection access observes only, never constructs or repairs a range.
async function select(page: Page, shape: 'caret' | 'same-node' | 'cross-node') {
  const root = editor(page);
  await root.locator('p').first().locator('strong').click();
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+ArrowUp' : 'Control+Home');
  await expect.poll(() => page.evaluate(() => window.getSelection()?.isCollapsed)).toBe(true);
  if (shape === 'cross-node') {
    await page.keyboard.press('ControlOrMeta+A');
    await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toContain('Adjacent paragraph');
  } else {
    await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
    if (shape === 'same-node') for (let index = 0; index < 6; index++) await page.keyboard.press('Shift+ArrowRight');
    await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe(shape === 'caret' ? '' : 'rget p');
  }
  const before = await root.evaluate(node => {
    const s = window.getSelection()!;
    return { text: s.toString(), collapsed: s.isCollapsed, anchor: s.anchorOffset, focus: s.focusOffset,
      anchorText: s.anchorNode?.textContent, focusText: s.focusNode?.textContent,
      contained: !!s.anchorNode && !!s.focusNode && node.contains(s.anchorNode) && node.contains(s.focusNode) };
  });
  expect(before.contained).toBe(true);
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  return before;
}
async function open(page: Page, command: 'Link' | 'Image' | 'Columns Layout') {
  if (command === 'Link') await toolbar(page).getByRole('button', { name: 'Edit link', exact: true }).click();
  else {
    await toolbar(page).getByRole('button', { name: 'Insert', exact: true }).click();
    await page.getByRole('menuitem', { name: command, exact: true }).click();
  }
  const dialog = page.getByRole('dialog', { name: command === 'Link' ? 'Insert Link' : command === 'Image' ? 'Insert Image' : 'Choose columns layout', exact: true });
  await expect(dialog).toBeVisible();
  return dialog;
}

test('Cancel/Escape make no edit for caret, same-node and cross-node modal ranges', async ({ page }, info) => {
  test.setTimeout(120_000);
  // Six uncovered rows, not a command × range × dismissal Cartesian rerun.
  const rows = [
    ['Link', 'caret', 'Cancel'], ['Link', 'cross-node', 'Escape'],
    ['Image', 'same-node', 'Cancel'], ['Image', 'cross-node', 'Escape'],
    ['Columns Layout', 'caret', 'Escape'], ['Columns Layout', 'same-node', 'Cancel'],
  ] as const;
  for (const [command, shape, dismiss] of rows) {
    await page.goto(url);
    const range = await select(page, shape);
    const initial = await saved(page);
    const dialog = await open(page, command);
    if (command === 'Link') await dialog.getByRole('textbox', { name: 'URL', exact: true }).fill('/discarded-draft');
    if (dismiss === 'Escape') await page.keyboard.press('Escape');
    else await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect.poll(() => saved(page)).toEqual(initial);
    // Modal focus returns to the public command owner. Native selection and
    // endpoint observations must survive, independent of whether caret is visible.
    const focus = command === 'Link' ? toolbar(page).getByRole('button', { name: 'Edit link', exact: true }) : toolbar(page).getByRole('button', { name: 'Insert', exact: true });
    await expect(focus).toBeFocused();
    const after = await editor(page).evaluate(node => {
      const s = window.getSelection()!;
      return { text: s.toString(), collapsed: s.isCollapsed, anchor: s.anchorOffset, focus: s.focusOffset,
        anchorText: s.anchorNode?.textContent, focusText: s.focusNode?.textContent,
        contained: !!s.anchorNode && !!s.focusNode && node.contains(s.anchorNode) && node.contains(s.focusNode) };
    });
    await info.attach(`${command}-${shape}-${dismiss}`, { body: JSON.stringify({ before: range, after, document: initial }), contentType: 'application/json' });
    expect(after).toEqual(range);
  }
});

test('link Apply targets caret, same-node and cross-node ranges without discarding adjacent formatting', async ({ page }, info) => {
  test.setTimeout(90_000);
  for (const shape of ['caret', 'same-node', 'cross-node'] as const) {
    await page.goto(url);
    const range = await select(page, shape);
    const before = await saved(page);
    const dialog = await open(page, 'Link');
    const display = dialog.getByRole('textbox', { name: 'Display Text', exact: true });
    if (shape === 'caret') await display.fill('Inserted guide');
    if (shape === 'same-node') await expect(display).toHaveValue('rget p');
    await dialog.getByRole('textbox', { name: 'URL', exact: true }).fill('/selected-guide');
    await dialog.getByRole('button', { name: 'Apply', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    const links = editor(page).locator('a[href="/selected-guide"]');
    await expect(links.first()).toBeVisible();
    const after = await saved(page);
    if (shape === 'caret') {
      await expect(editor(page)).toHaveText('TaInserted guiderget paragraphAdjacent paragraph');
      await expect(links).toHaveText('Inserted guide');
    } else if (shape === 'same-node') {
      await expect(links).toHaveText('rget p');
      await expect(editor(page)).toHaveText('Target paragraphAdjacent paragraph');
      expect(after.root.children[0].children.find((node: { type: string }) => node.type === 'link').children).toEqual([
        expect.objectContaining({ text: 'rget p', format: 1, style: 'color: var(--sgui-action);' }),
      ]);
    } else {
      // Linking a cross-paragraph range keeps paragraph boundaries and each
      // original text run's format/style. Do not equate URL wrapper shape with
      // a promise to merge paragraphs or flatten rich text.
      await expect(editor(page)).toHaveText('Target paragraphAdjacent paragraph');
      await expect(links).toHaveCount(2);
      for (let index = 0; index < 2; index++) {
        expect(after.root.children[index].children[0]).toMatchObject({ type: 'link', url: '/selected-guide' });
        expect(after.root.children[index].children[0].children).toEqual(before.root.children[index].children);
      }
    }
    if (shape !== 'cross-node') {
      expect(after.root.children[1]).toEqual(before.root.children[1]);
      await expect(editor(page).locator('p').nth(1).locator('em')).toHaveText('Adjacent paragraph');
    }
    await expect(editor(page)).toBeFocused();
    await info.attach(`${shape}-link-before-after`, { body: JSON.stringify({ range, before, after }), contentType: 'application/json' });
  }
});

test('host read-only, document replacement and unmount invalidate pending modal drafts', async ({ page }, info) => {
  for (const [command, key] of [['Link', 'Alt+Digit1'], ['Columns Layout', 'Alt+Digit2'], ['Image', 'Alt+Digit3']] as const) {
    await page.goto(url);
    await select(page, 'cross-node');
    const before = await saved(page);
    const dialog = await open(page, command);
    if (command === 'Link') await dialog.getByRole('textbox', { name: 'URL', exact: true }).fill('/must-not-apply');
    await page.keyboard.press(key);
    await expect(dialog).toHaveCount(0);
    if (command === 'Link') await expect(editor(page)).toHaveAttribute('contenteditable', 'false');
    if (command === 'Columns Layout') await expect(page.getByTestId('selection-acceptance')).toHaveAttribute('data-revision', '1');
    if (command === 'Image') await expect(editor(page)).toHaveCount(0);
    // Cross two frames/task delivery; no arbitrary wait or source-injected command.
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await expect.poll(() => saved(page)).toEqual(before);
    await info.attach(`${command}-invalidation`, { body: JSON.stringify({ command, key, document: await saved(page) }), contentType: 'application/json' });
  }
});
