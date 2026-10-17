import { expect, test, type Page } from '@playwright/test';
const url = '/fixtures/?id=editors-pagerichtexteditorsection-paragraph-transactions--selection-acceptance&globals=a11y.manual:!true';
const root = (page: Page) => page.getByRole('textbox', { name: 'Selection acceptance document', exact: true });
const toolbar = (page: Page) => page.getByRole('group', { name: 'Text formatting', exact: true });
type Node = { type: string; text?: string; format?: number | string; style?: string; children?: Node[]; [key: string]: unknown };
type Document = { root: Node & { children: Node[] } };
const saved = async (page: Page): Promise<Document> => JSON.parse((await page.getByLabel('Selection acceptance JSON').textContent())!);
const descendants = (node: Node): Node[] => [node, ...(node.children ?? []).flatMap(descendants)];
const textRuns = (node: Node) => descendants(node).filter(n => n.type === 'text');
const text = (node: Node) => textRuns(node).map(n => n.text).join('');
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg==', 'base64');
for (const command of ['Image', 'Columns Layout'] as const) for (const shape of ['same-node', 'cross-node'] as const) {
 test(`${command} replaces ${shape} selection and retains exact saved history`, async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(url);
  await root(page).locator('p').first().locator('strong').click();
  await page.keyboard.press(process.platform === 'darwin' ? 'Meta+ArrowUp' : 'Control+Home');
  if (shape === 'cross-node') {
   await page.keyboard.press('ControlOrMeta+A');
   await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toContain('Adjacent paragraph');
  } else {
   await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
   for (let i = 0; i < 6; i++) await page.keyboard.press('Shift+ArrowRight');
   await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('rget p');
  }
  const before = await saved(page);
  const trigger = toolbar(page).getByRole('button', { name: 'Insert', exact: true });
  await trigger.focus(); await trigger.press('Enter');
  await page.getByRole('menuitem', { name: command, exact: true }).press('Enter');
  const dialog = page.getByRole('dialog', { name: command === 'Image' ? 'Insert Image' : 'Choose columns layout', exact: true });
  await expect(dialog).toBeVisible();
  if (command === 'Image') {
   await dialog.getByLabel('Choose image').setInputFiles({ name: 'selected-cover.png', mimeType: 'image/png', buffer: pixel });
   await dialog.getByRole('textbox', { name: 'Image description' }).fill('Selected course cover');
  } else {
   await dialog.getByText('3 columns (25% - 50% - 25%)', { exact: true }).click();
   await expect(dialog.getByRole('radio', { name: '3 columns (25% - 50% - 25%)', exact: true })).toBeChecked();
  }
  await dialog.getByRole('button', { name: 'Insert', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(root(page)).toBeFocused();
  const insertedType = command === 'Image' ? 'image' : 'table';
  await expect.poll(async () => descendants((await saved(page)).root).filter(n => n.type === insertedType).length).toBe(1);
  const after = await saved(page);
  const result = page.getByRole('status').filter({ hasText: command === 'Image' ? 'Image inserted' : 'Columns layout inserted' });
  await expect(result).toHaveText(command === 'Image' ? 'Image inserted' : 'Columns layout inserted');
  await expect(result).toHaveAttribute('aria-live', 'polite');
  if (shape === 'same-node') {
   expect(text(after.root)).toBe('TaaragraphAdjacent paragraph');
   expect(after.root.children.at(-1)).toEqual(before.root.children[1]);
   const retained = textRuns(after.root).filter(n => n.text !== 'Adjacent paragraph');
   expect(retained.map(n => n.text).join('')).toBe('Taaragraph');
   for (const run of retained) expect(run).toMatchObject({ format: 1, style: 'color: var(--sgui-action);' });
  } else expect(text(after.root)).toBe('');
  const inserted = descendants(after.root).find(n => n.type === insertedType)!;
  if (command === 'Image') {
   expect(inserted).toMatchObject({ assetId: 'range-cover', assetVersionId: 'range-v1', altText: 'Selected course cover', width: 1, height: 1 });
   await expect.poll(() => root(page).getByRole('img', { name: 'Selected course cover', exact: true }).evaluate(n => (n as HTMLImageElement).naturalWidth)).toBe(1);
  } else {
   expect(inserted.colWidths).toEqual([250, 500, 250]);
   expect(descendants(inserted).filter(n => n.type === 'tablecell')).toHaveLength(3);
  }
  await toolbar(page).getByRole('button', { name: 'Undo', exact: true }).click();
  await expect.poll(() => saved(page)).toEqual(before);
  await toolbar(page).getByRole('button', { name: 'Redo', exact: true }).click();
  await expect.poll(() => saved(page)).toEqual(after);
  await page.getByRole('button', { name: 'Reload selected document', exact: true }).click();
  await expect(page.getByTestId('selection-acceptance')).toHaveAttribute('data-revision', '1');
  await expect.poll(() => saved(page)).toEqual(after);
  if (command === 'Image') await expect.poll(() => root(page).getByRole('img', { name: 'Selected course cover', exact: true }).evaluate(n => (n as HTMLImageElement).naturalWidth)).toBe(1);
  await expect(toolbar(page).getByRole('button', { name: 'Undo', exact: true })).toBeDisabled();
  expect(errors).toEqual([]);
  await info.attach(`${command}-${shape}-documents`, { body: JSON.stringify({ before, after, reloaded: await saved(page) }), contentType: 'application/json' });
 });
}
