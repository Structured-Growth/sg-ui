import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import { readDocument, assertDocument, initialParagraphs, editedParagraphs, replacementParagraphs } from './document.mjs';

/** One sequential case per engine/version; no retry runner or synthetic editor updates.
 * @param {import('@playwright/test').Page} page
 * @param {boolean} hydrated
 */
export async function verifyEditor(page, hydrated) {
  const serialized = page.getByLabel('Serialized course content', { exact: true });
  const hydration = page.getByLabel('Hydration state', { exact: true });
  if (!hydrated) {
    await expect(hydration).toHaveText('server');
    assertDocument(readDocument(await serialized.innerText()), initialParagraphs, initialParagraphs.map(() => 0));
    await expect(page.getByRole('button', { name: 'Replace course document', exact: true })).toBeVisible();
    return;
  }
  await expect(hydration).toHaveText('hydrated');
  const editor = page.getByLabel('Packed course content', { exact: true });
  await expect(editor).toHaveAttribute('contenteditable', 'true');
  await expect(editor).toHaveText(initialParagraphs.join(''));
  assertDocument(readDocument(await serialized.innerText()), initialParagraphs, initialParagraphs.map(() => 0));

  // Lexical owns native selection, formatting and paragraph insertion.
  await editor.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.press('ControlOrMeta+B');
  await editor.pressSequentially(editedParagraphs[0]);
  await page.keyboard.press('ControlOrMeta+B');
  await page.keyboard.press('Enter');
  await editor.pressSequentially(editedParagraphs[1]);
  await expect.poll(async () => readDocument(await serialized.innerText())).toMatchObject({ root: { children: [
    { type: 'paragraph', children: [{ type: 'text', text: editedParagraphs[0], format: 1 }] },
    { type: 'paragraph', children: [{ type: 'text', text: editedParagraphs[1], format: 0 }] },
  ] } });
  const edited = readDocument(await serialized.innerText());
  assertDocument(edited, editedParagraphs, [1, 0]);
  await expect(editor.locator('strong')).toHaveText(editedParagraphs[0]);

  // Recreate the editor from exactly the host's serialized native editing result.
  const beforeReload = await editor.elementHandle();
  assert(beforeReload);
  await page.getByRole('button', { name: 'Reload serialized course document', exact: true }).click();
  await expect.poll(() => beforeReload.evaluate(element => element.isConnected)).toBe(false);
  await beforeReload.dispose();
  await expect(editor).toHaveText(editedParagraphs.join(''));
  await expect(editor.locator('strong')).toHaveText(editedParagraphs[0]);
  await expect.poll(async () => readDocument(await serialized.innerText())).toEqual(edited);

  await page.getByRole('button', { name: 'Toggle read only', exact: true }).click();
  await expect(editor).toHaveAttribute('contenteditable', 'false');
  await editor.focus();
  await editor.pressSequentially('Forbidden edit');
  await page.keyboard.press('Enter');
  await expect(editor).toHaveText(editedParagraphs.join(''));
  assert.deepEqual(readDocument(await serialized.innerText()), edited);

  // Document identity replacement must work while read-only, without old content.
  const beforeReset = await editor.elementHandle();
  assert(beforeReset);
  await page.getByRole('button', { name: 'Replace course document', exact: true }).click();
  await expect.poll(() => beforeReset.evaluate(element => element.isConnected)).toBe(false);
  await beforeReset.dispose();
  await expect(editor).toHaveText(replacementParagraphs[0]);
  await expect(editor).toHaveAttribute('contenteditable', 'false');
  await expect(editor.locator('strong')).toHaveText(replacementParagraphs[0]);
  assertDocument(readDocument(await serialized.innerText()), replacementParagraphs, [1]);

  await page.getByRole('button', { name: 'Toggle read only', exact: true }).click();
  await expect(editor).toHaveAttribute('contenteditable', 'true');
  await editor.click();
  await page.keyboard.press('ControlOrMeta+End');
  await editor.pressSequentially(' after reset');
  await expect(editor).toHaveText('Replacement packed document after reset');
  await expect.poll(async () => readDocument(await serialized.innerText())).toMatchObject({ root: { children: [
    { children: [{ text: 'Replacement packed document after reset', format: 1 }] },
  ] } });
  assertDocument(readDocument(await serialized.innerText()), ['Replacement packed document after reset'], [1]);
}
