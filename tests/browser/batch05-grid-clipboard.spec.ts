import { expect, test, type Page } from '@playwright/test';

const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) messages.push(message.text()); });
});
test.afterEach(({ page }) => { expect(errors.get(page)).toEqual([]); });
async function open(page: Page, theme = 'light') {
  await page.goto(`/iframe.html?id=migration-proofs-catalog-grid-cells--clipboard-feedback&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
  const grid = page.getByRole('grid', { name: 'Clipboard courses', exact: true });
  await expect(grid).toBeVisible();
  return grid;
}
const text = '<img src=x onerror="alert(1)"> & "quoted"\nSecond line';
const json = JSON.stringify({ html: '<script>alert("quoted")</script>', text: 'First\nSecond & third' });

for (const theme of ['light', 'dark']) {
  test(`native keyboard copy preserves focus, selection and escaped text/JSON: ${theme}`, async ({ page, context, browserName }) => {
    if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:6173' });
    const grid = await open(page, theme);
    const destination = page.getByRole('textbox', { name: 'Clipboard destination' });
    for (const [rowId, key, payload] of [['text', 'Enter', text], ['json', 'Space', json]] as const) {
      const cell = grid.locator(`tbody [data-grid-row="${rowId}"][data-grid-field="value"]`);
      const button = cell.getByRole('button', { name: 'Copy', exact: true });
      // Enter nested controls through the collection's keyboard navigation.
      await grid.locator(`tbody [data-grid-row="${rowId}"][data-grid-field="name"]`).focus();
      await page.keyboard.press('ArrowRight');
      await expect(button).toBeFocused();
      await expect(button).toHaveAttribute('data-focus-visible', 'true');
      const outline = await button.evaluate(node => getComputedStyle(node).outlineStyle);
      expect(outline).not.toBe('none');
      await page.keyboard.press(key);
      await expect(cell.getByRole('status')).toHaveText('Copied');
      await expect(button).toBeFocused();
      await expect(grid.getByRole('checkbox', { name: `Select ${rowId === 'text' ? 'Text' : 'JSON'} course`, exact: true })).not.toBeChecked();
      await expect(cell.locator('img, script')).toHaveCount(0);
      await destination.fill('');
      await destination.focus();
      await page.keyboard.press('ControlOrMeta+V');
      await expect(destination).toHaveValue(payload);
      await expect(cell.getByRole('status')).toHaveText('', { timeout: 5000 });
      await expect(destination).toBeFocused();
    }
    await expect(grid.locator('tbody [data-grid-row="empty"] [data-grid-field="value"]').getByRole('button', { name: 'Copy' })).toBeDisabled();
  });
}

test('native denied clipboard write announces error and keeps keyboard focus', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'CDP denial is Chromium-only; deterministic rejection is tested on every engine.');
  const session = await context.newCDPSession(page);
  const { targetInfo } = await session.send('Target.getTargetInfo');
  await session.send('Browser.setPermission', { permission: { name: 'clipboard-write' }, setting: 'denied', origin: 'http://127.0.0.1:6173', browserContextId: targetInfo.browserContextId });
  const grid = await open(page);
  const cell = grid.locator('tbody [data-grid-row="text"][data-grid-field="value"]');
  await grid.locator('tbody [data-grid-row="text"][data-grid-field="name"]').focus();
  await page.keyboard.press('ArrowRight');
  const button = cell.getByRole('button', { name: 'Copy' });
  await page.keyboard.press('Enter');
  await expect(cell.getByRole('status')).toHaveText('Unable to copy');
  await expect(button).toBeFocused();
  await expect(cell.getByRole('status')).toHaveText('', { timeout: 5000 });
  await expect(button).toBeFocused();
});

test('controlled rejection isolates feedback and replacement/unmount cleanup', async ({ page }) => {
  // Deliberate API rejection, separate from the native clipboard cases above.
  await page.addInitScript(() => {
    Object.defineProperty(navigator.clipboard, 'writeText', { configurable: true, value: () => Promise.reject(new DOMException('Denied', 'NotAllowedError')) });
  });
  const grid = await open(page);
  const first = grid.locator('tbody [data-grid-row="text"][data-grid-field="value"]');
  const second = grid.locator('tbody [data-grid-row="json"][data-grid-field="value"]');
  const independent = page.getByRole('region', { name: 'Independent copy cell' });
  await first.getByRole('button', { name: 'Copy' }).click();
  await expect(first.getByRole('status')).toHaveText('Unable to copy');
  await expect(second.getByRole('status')).toHaveText('');
  await independent.getByRole('button', { name: 'Copy' }).click();
  await expect(independent.getByRole('status')).toHaveText('Unable to copy');
  await page.getByRole('button', { name: 'Replace independent value' }).click();
  await expect(independent.getByRole('status')).toHaveText('');
  await expect(first.getByRole('status')).toHaveText('Unable to copy');
  await independent.getByRole('button', { name: 'Copy' }).click();
  await expect(independent.getByRole('status')).toHaveText('Unable to copy');
  await page.getByRole('button', { name: 'Toggle independent cell' }).click();
  await expect(independent.getByRole('status')).toHaveCount(0);
  await page.getByRole('button', { name: 'Toggle independent cell' }).click();
  await expect(independent.getByRole('status')).toHaveText('');
  await page.getByRole('button', { name: 'Host action', exact: true }).click();
  await expect(first.getByRole('status')).toHaveText('', { timeout: 5000 });
  await expect(page.getByRole('button', { name: 'Host action', exact: true })).toBeFocused();
});
