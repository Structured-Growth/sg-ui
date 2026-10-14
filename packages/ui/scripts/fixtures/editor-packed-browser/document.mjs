import assert from 'node:assert/strict';

/** @typedef {{type: string, version: number, text?: string, format?: number|string, children?: DocumentNode[]}} DocumentNode */
/** @typedef {{root: DocumentNode}} SavedDocument */

/** Read the public JSON boundary, rejecting a fixture that only changes DOM text.
 * @param {string} json
 * @returns {SavedDocument}
 */
export function readDocument(json) {
  const value = JSON.parse(json);
  assert.equal(value?.root?.type, 'root');
  assert.equal(value.root.version, 1);
  assert(Array.isArray(value.root.children));
  for (const paragraph of value.root.children) {
    assert.equal(paragraph.type, 'paragraph');
    assert.equal(paragraph.version, 1);
    assert(Array.isArray(paragraph.children));
    for (const text of paragraph.children) {
      assert.equal(text.type, 'text');
      assert.equal(text.version, 1);
      assert.equal(typeof text.text, 'string');
      assert.equal(typeof text.format, 'number');
    }
  }
  return value;
}

/** @param {SavedDocument} value */
export function paragraphs(value) {
  return value.root.children?.map(node => node.children?.map(child => child.text).join(''));
}

export const initialParagraphs = Array.from({ length: 12 }, (_, i) => `Packed course paragraph ${i + 1} for editing.`);
export const editedParagraphs = ['Native packed edit', 'Second native paragraph'];
export const replacementParagraphs = ['Replacement packed document'];

/** @param {SavedDocument} value @param {string[]} texts @param {number[]} formats */
export function assertDocument(value, texts, formats) {
  assert.deepEqual(paragraphs(value), texts);
  assert.deepEqual(value.root.children?.map(node => node.children?.map(child => child.format)), formats.map(format => [format]));
}
