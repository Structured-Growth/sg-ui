import { expect, test, type Page } from '@playwright/test';

const toolbar = (page: Page) => page.getByRole('group', { name: 'Selection formatting', exact: true });
const editor = (page: Page) => page.getByRole('textbox', { name: 'Boundary document', exact: true });

// Observe native calls/events without changing their arguments or result.
// Retain this evidence on failure so focus scrolling can be separated from setup.
async function observeSelectionScroll(page: Page) {
  await page.evaluate(() => {
    const boundary = document.querySelector<HTMLElement>('[data-testid="selection-boundary"]')!;
    const events: unknown[] = [];
    const describe = (node: EventTarget | null) => node instanceof HTMLElement
      ? node.getAttribute('aria-label') ?? node.dataset.testid ?? node.tagName : null;
    const record = (kind: string, target: EventTarget | null, detail?: unknown) => {
      events.push({ kind, time: performance.now(), target: describe(target),
        active: describe(document.activeElement), scrollTop: boundary.scrollTop,
        outerScrollTop: document.querySelector('[data-testid="selection-outer-scroll"]')!.scrollTop,
        selected: window.getSelection()?.toString(), collapsed: window.getSelection()?.isCollapsed,
        detail });
    };
    const focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function(options?: FocusOptions) {
      record('focus-call', this, { options, stack: new Error().stack });
      focus.call(this, options);
      record('focus-return', this);
    };
    for (const kind of ['focus', 'blur', 'scroll', 'selectionchange']) {
      document.addEventListener(kind, event => record(kind, event.target), true);
    }
    record('installed', boundary);
    // The page is disposed after this test; no production hook or state repair.
    Object.assign(window, { selectionScrollEvidence: events });
  });
}

async function selectFirstLine(page: Page, version = 1) {
  // Measure only; the native mouse gesture creates the range and Lexical selection.
  const rect = await editor(page).locator('p').first().evaluate(node => {
    const range = document.createRange();
    range.selectNodeContents(node);
    const box = range.getBoundingClientRect();
    return { left: box.left, right: box.right, y: box.top + box.height / 2 };
  });
  await page.mouse.move(rect.left, rect.y);
  await page.mouse.down();
  await page.mouse.move(rect.right + 1, rect.y, { steps: 12 });
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe(`Document ${version} selected line.`);
  await expect(toolbar(page)).toBeVisible();
}

async function expectAnchored(page: Page) {
  await expect.poll(async () => toolbar(page).evaluate(node => {
    const box = node.getBoundingClientRect();
    const boundary = document.querySelector('[data-testid="selection-boundary"]')!.getBoundingClientRect();
    const range = window.getSelection()!.getRangeAt(0);
    const selected = range.getClientRects()[0];
    const left = Math.max(12, boundary.left);
    const right = Math.min(window.innerWidth - 12, boundary.right);
    const top = Math.max(12, boundary.top);
    const bottom = Math.min(window.innerHeight - 12, boundary.bottom);
    const expectedLeft = Math.max(left, Math.min(selected.left, right - box.width));
    const above = selected.top - box.height - 8;
    const expectedTop = Math.max(top, Math.min(above >= top ? above : selected.bottom + 8, bottom - box.height));
    return box.left >= left - 1 && box.right <= right + 1 && box.top >= top - 1 && box.bottom <= bottom + 1 &&
      Math.abs(box.left - expectedLeft) < 2 && Math.abs(box.top - expectedTop) < 2;
  })).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/iframe.html?id=editors-floatingtextselectiontoolbar--nested-host-boundary&viewMode=story&globals=a11y.manual:!true');
  await expect(editor(page)).toBeVisible();
});

test('nested ancestor scroll and inner boundary collision reanchor the selected line', async ({ page }) => {
  await selectFirstLine(page);
  await expectAnchored(page);
  const initial = await toolbar(page).boundingBox();
  await page.getByTestId('selection-outer-scroll').evaluate(node => { node.scrollTop = 35; });
  await expect.poll(async () => (await toolbar(page).boundingBox())?.y).toBeLessThan(initial!.y - 20);
  await expectAnchored(page);
  await page.getByTestId('selection-boundary').evaluate(node => { node.scrollTop = 45; });
  await expectAnchored(page);
  // The selected line is still visible but there is no room above it: place below.
  expect(await toolbar(page).evaluate(node => node.getBoundingClientRect().top > window.getSelection()!.getRangeAt(0).getClientRects()[0].bottom)).toBe(true);
});

test('viewport resize with a focused action clamps and wraps without losing selection', async ({ page }) => {
  await selectFirstLine(page);
  await page.keyboard.press('Alt+F10');
  const bold = toolbar(page).getByRole('button', { name: 'Bold', exact: true });
  await expect(bold).toBeFocused();
  await page.setViewportSize({ width: 280, height: 620 });
  await expectAnchored(page);
  await expect(bold).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(editor(page).locator('strong, b')).toHaveText('Document 1 selected line.');
  await expect(editor(page)).toBeFocused();
  await expect(editor(page).locator('p').nth(1)).toHaveText('Host document paragraph 1.');
});

test('offscreen selection hides actions and returns focused toolbar to editor without host scroll repair', async ({ page }, testInfo) => {
  await observeSelectionScroll(page);
  try {
    await selectFirstLine(page);
    await page.keyboard.press('Alt+F10');
    await expect(toolbar(page).getByRole('button', { name: 'Bold', exact: true })).toBeFocused();
    await page.getByTestId('selection-boundary').evaluate(node => { node.scrollTop = 300; });
    await expect(toolbar(page)).toBeHidden();
    await expect(editor(page)).toBeFocused();
    await expect.poll(() => page.getByTestId('selection-boundary').evaluate(node => node.scrollTop)).toBe(300);
    await page.getByTestId('selection-boundary').evaluate(node => { node.scrollTop = 0; });
    await expect(toolbar(page)).toBeHidden();
    // Offscreen dismissal returns focus, retaining the native selected text. A
    // second drag beginning inside that selection can drag text rather than select.
    // Start a fresh selection with a real caret gesture, not a DOM range repair.
    await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('Document 1 selected line.');
    await page.keyboard.press('ArrowLeft');
    await expect.poll(() => page.evaluate(() => window.getSelection()?.isCollapsed)).toBe(true);
    await expect(editor(page)).toBeFocused();
    await expect(toolbar(page)).toBeHidden();
    await selectFirstLine(page);
    await expectAnchored(page);
  } finally {
    const evidence = await page.evaluate(() => Reflect.get(window, 'selectionScrollEvidence'));
    await testInfo.attach('native-selection-scroll-sequence', {
      body: JSON.stringify(evidence, null, 2), contentType: 'application/json',
    });
  }
});

test('host replacement clears the detached document selection and fresh actions target only new nodes', async ({ page }) => {
  await selectFirstLine(page);
  await page.keyboard.press('Alt+F10');
  const oldRoot = await editor(page).elementHandle();
  await page.getByRole('button', { name: 'Replace host document', exact: true }).click();
  await expect(page.getByLabel('Host document version')).toHaveText('2');
  expect(await oldRoot!.evaluate(node => node.isConnected)).toBe(false);
  await expect(toolbar(page)).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('');
  await expect(editor(page).locator('strong, b')).toHaveCount(0);
  await selectFirstLine(page, 2);
  await page.keyboard.press('Alt+F10');
  await expect(toolbar(page).getByRole('button', { name: 'Bold', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(editor(page).locator('strong, b')).toHaveText('Document 2 selected line.');
  await expect(editor(page)).not.toContainText('Document 1');
});
