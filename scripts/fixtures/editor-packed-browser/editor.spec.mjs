import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { expect } from '@playwright/test';
import { readDocument, assertDocument, initialParagraphs, editedParagraphs, replacementParagraphs } from './document.mjs';

/** Fixture-only passive DOM diagnostics. Never supplies a selection or editor update.
 * @param {import('@playwright/test').Page} page
 */
async function formatAttribution(page) {
  if (process.env.SGUI_PACKED_EDITOR_FORMAT_ATTRIBUTION !== '1') return null;
  const path = `artifacts/packed-browser/editor-format-attribution-${randomUUID()}.json`;
  const report = {
    diagnosticOnly: true, acceptanceEvidence: false,
    node: process.version, url: page.url(), title: await page.title(),
    engine: page.context().browser()?.browserType().name() ?? null,
    startedAt: new Date().toISOString(),
    lexicalSelection: 'Inaccessible through the public fixture boundary; DOM selection and toolbar state are not Lexical selection kind/format.',
    snapshots: /** @type {unknown[]} */ ([]),
  };
  await mkdir('artifacts/packed-browser', { recursive: true });
  const persist = () => writeFile(path, JSON.stringify(report, null, 2));
  await persist();
  const observer = await page.evaluateHandle(() => {
    const editor = () => document.querySelector('[aria-label="Packed course content"]');
    const identities = new WeakMap();
    let nextIdentity = 1;
    /** @param {Node | null} node */
    function describe(node) {
      if (!node) return null;
      if (!identities.has(node)) identities.set(node, nextIdentity++);
      const path = [];
      for (let current = /** @type {Node | null} */ (node); current; current = current.parentNode) {
        const index = current.parentNode ? Array.from(current.parentNode.childNodes).findIndex(child => child === current) : 0;
        path.unshift(`${current.nodeName}[${index}]`);
      }
      const element = node instanceof Element ? node : node.parentElement;
      return { identity: identities.get(node), path: path.join('/'),
        nodeName: node.nodeName, nodeType: node.nodeType, text: node.textContent,
        id: element?.id ?? null, label: element?.getAttribute('aria-label') ?? null,
        role: element?.getAttribute('role') ?? null,
        contenteditable: element?.getAttribute('contenteditable') ?? null,
        connected: node.isConnected, insideEditor: !!editor()?.contains(node) };
    }
    const receipts = /** @type {{event: KeyboardEvent, receipt: Record<string, unknown>}[]} */ ([]);
    /** @param {KeyboardEvent} event */
    function receive(event) {
      const receipt = { type: event.type, time: performance.now(),
        target: describe(event.target instanceof Node ? event.target : null),
        activeElement: describe(document.activeElement),
        key: event.key, code: event.code, ctrlKey: event.ctrlKey, metaKey: event.metaKey,
        altKey: event.altKey, shiftKey: event.shiftKey, repeat: event.repeat,
        isTrusted: event.isTrusted, defaultPreventedAtCapture: event.defaultPrevented };
      // Retain the event for a later snapshot read after keyboard.press has returned.
      // A capture-listener microtask could run before later listeners; do not infer
      // final cancellation there, or cancel/replay any event here.
      receipts.push({ event, receipt });
    }
    const options = { capture: true, passive: true };
    document.addEventListener('keydown', receive, options);
    document.addEventListener('keyup', receive, options);
    return {
      snapshot() {
        const selection = document.getSelection();
        const section = editor()?.closest('[data-sgui-part="editor-section"]');
        const buttons = section?.querySelectorAll('button[aria-pressed]') ?? [];
        const serialized = document.querySelector('[aria-label="Serialized course content"]')?.textContent ?? null;
        let serializedJSON = null;
        try { serializedJSON = serialized === null ? null : JSON.parse(serialized); } catch { /* Retain raw invalid JSON. */ }
        return { time: performance.now(), activeElement: describe(document.activeElement),
          editor: describe(editor()),
          nativeSelection: selection ? { anchor: describe(selection.anchorNode),
            anchorOffset: selection.anchorOffset, focus: describe(selection.focusNode),
            focusOffset: selection.focusOffset, text: selection.toString(),
            isCollapsed: selection.isCollapsed, rangeCount: selection.rangeCount } : null,
          toolbarPressed: Array.from(buttons).map(button => ({ element: describe(button),
            pressed: button.getAttribute('aria-pressed'),
            visible: button.getClientRects().length > 0 && getComputedStyle(button).visibility !== 'hidden'
              && getComputedStyle(button).display !== 'none' })),
          serializedJSON, serializedRaw: serialized, keyReceipts: receipts.splice(0).map(({ event, receipt }) =>
            ({ ...receipt, defaultPreventedAtSnapshot: event.defaultPrevented })) };
      },
      stop() {
        document.removeEventListener('keydown', receive, options);
        document.removeEventListener('keyup', receive, options);
      },
    };
  });
  /** @param {string} boundary */
  async function capture(boundary) {
    try {
      report.snapshots.push({ boundary, capturedAt: new Date().toISOString(),
        ...await observer.evaluate(value => value.snapshot()) });
    } catch (error) {
      report.snapshots.push({ boundary, diagnosticError: String(error) });
    }
    await persist();
  }
  return { capture, async finish() {
    try { await capture('verification-exit'); }
    finally { await observer.evaluate(value => value.stop()).catch(() => {}); await observer.dispose(); }
    console.log(`Diagnostic-only packed editor format attribution (never acceptance): ${path}`);
  } };
}

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
  const attribution = await formatAttribution(page);
  try {
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

    await attribution?.capture('before-readonly-toggle');
    await page.getByRole('button', { name: 'Toggle read only', exact: true }).click();
    await attribution?.capture('after-readonly-toggle');
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

    await attribution?.capture('before-enable-editing-toggle');
    await page.getByRole('button', { name: 'Toggle read only', exact: true }).click();
    await attribution?.capture('after-enable-editing-toggle');
    await expect(editor).toHaveAttribute('contenteditable', 'true');
    await attribution?.capture('before-editor-click');
    await editor.click();
    await attribution?.capture('after-editor-click');
    await attribution?.capture('before-end-navigation');
    await page.keyboard.press('ControlOrMeta+End');
    await attribution?.capture('after-end-navigation');
    // Establish the insertion format rather than assuming saved text sets the caret format.
    const bold = page.locator('[data-sgui-part="editor-section"]')
      .getByRole('group', { name: 'Text formatting', exact: true })
      .getByRole('button', { name: 'Bold', exact: true });
    await expect(bold).toBeVisible();
    await expect(bold).toHaveAttribute('aria-pressed', /^(true|false)$/);
    if (await bold.getAttribute('aria-pressed') === 'false') {
      await attribution?.capture('before-bold-shortcut');
      await page.keyboard.press('ControlOrMeta+B');
      await attribution?.capture('after-bold-shortcut');
    }
    await attribution?.capture('before-strict-bold-precondition');
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
    await attribution?.capture('after-strict-bold-precondition');
    await expect(editor).toBeFocused();
    await editor.pressSequentially(' after reset');
    await expect(editor).toHaveText('Replacement packed document after reset');
    await expect.poll(async () => readDocument(await serialized.innerText())).toMatchObject({ root: { children: [
      { children: [{ text: 'Replacement packed document after reset', format: 1 }] },
    ] } });
    assertDocument(readDocument(await serialized.innerText()), ['Replacement packed document after reset'], [1]);
  } finally {
    await attribution?.finish();
  }
}
