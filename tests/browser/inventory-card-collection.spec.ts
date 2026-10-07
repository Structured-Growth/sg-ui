import { test, expect, type Page } from '@playwright/test';

async function openCollection(page: Page, theme = 'light', density = 'comfortable') {
  await page.goto(`/iframe.html?id=data-display-cardcollectionwithfooter--native-collection&viewMode=story&globals=theme:${theme};density:${density};a11y.manual:!true`);
  await expect(page.getByRole('textbox', { name: 'Note for Course 1', exact: true })).toBeVisible();
}

for (const theme of ['light', 'dark']) for (const density of ['compact', 'comfortable']) {
  test(`M-11 container resize preserves keyed drafts, focus and scroll (${theme}, ${density})`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openCollection(page, theme, density);
    const container = page.getByTestId('collection-container');
    const grid = page.locator('[data-sgui-part="card-collection-grid"]');
    const footer = page.locator('[data-sgui-part="card-pagination-footer"]');
    const note = page.getByRole('textbox', { name: 'Note for Course 1', exact: true });
    await note.fill('Retained native draft');
    await note.focus();
    const original = await note.elementHandle();
    const root = await page.locator('[data-sgui-part="card-collection"]').elementHandle();
    // Change host geometry without moving focus to a fixture control.
    for (const width of [800, 780, 760, 360, 320, 800]) {
      await container.evaluate((node, width) => { node.style.width = `${width}px`; node.style.height = '260px'; }, width);
      await expect(note).toBeFocused();
      expect(await note.evaluate((node, prior) => node === prior, original)).toBe(true);
      await expect(note).toHaveValue('Retained native draft');
      await expect.poll(() => grid.evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length)).toBe(width >= 780 ? 2 : 1);
      expect(await container.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      const hostBounds = (await container.boundingBox())!;
      const footerBounds = (await footer.boundingBox())!;
      expect(footerBounds.y + footerBounds.height).toBeLessThanOrEqual(hostBounds.y + hostBounds.height + 1);
      expect(await grid.evaluate(node => node.scrollHeight > node.clientHeight)).toBe(true);
    }
    // Native text enlargement keeps the footer reachable in a constrained host.
    await page.locator('html').evaluate(node => { node.style.fontSize = '200%'; });
    await container.evaluate(node => { node.style.width = '320px'; node.style.height = '420px'; });
    await expect(note).toBeFocused();
    expect(await container.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox', { name: 'Note for Course 2', exact: true })).toBeFocused();
    const second = page.getByRole('textbox', { name: 'Note for Course 2', exact: true });
    const secondBounds = (await second.boundingBox())!;
    const gridBounds = (await grid.boundingBox())!;
    expect(secondBounds.y).toBeGreaterThanOrEqual(gridBounds.y - 1);
    expect(secondBounds.y + secondBounds.height).toBeLessThanOrEqual(gridBounds.y + gridBounds.height + 1);
    expect(await grid.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
    // Oversized footer chrome remains reachable through the collection's outer scroll.
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(footer.getByRole('combobox')).toBeFocused();
    const selectorBounds = (await footer.getByRole('combobox').boundingBox())!;
    const collectionBounds = (await container.boundingBox())!;
    expect(selectorBounds.y).toBeGreaterThanOrEqual(collectionBounds.y - 1);
    expect(selectorBounds.y + selectorBounds.height).toBeLessThanOrEqual(collectionBounds.y + collectionBounds.height + 1);
    expect(await page.locator('[data-sgui-part="card-collection"]').evaluate(node => node.scrollTop)).toBeGreaterThan(0);
    // Reordering within the same rendered page retains the same keyed input and focus.
    await page.locator('html').evaluate(node => { node.style.fontSize = ''; });
    await page.getByRole('button', { name: 'Accept requests', exact: true }).click();
    await page.getByRole('combobox').selectOption('8');
    // Reverse all 12 rows would legitimately remove Course 1 from the current slice;
    // use an accepted size covering the shared overlap, Course 5.
    const shared = page.getByRole('textbox', { name: 'Note for Course 5', exact: true });
    await shared.fill('Keyed reorder draft');
    await shared.focus();
    const keyed = await shared.elementHandle();
    await page.getByRole('button', { name: 'Reverse cards', exact: true }).evaluate((node: HTMLButtonElement) => node.click());
    await expect(shared).toBeFocused();
    expect(await shared.evaluate((node, prior) => node === prior, keyed)).toBe(true);
    await expect(shared).toHaveValue('Keyed reorder draft');
    expect(await page.locator('[data-sgui-part="card-collection"]').evaluate((node, prior) => node === prior, root)).toBe(true);
  });
}

test('M-11 loading/empty/ready replacement keeps one collection and footer', async ({ page }) => {
  await openCollection(page);
  const root = page.locator('[data-sgui-part="card-collection"]');
  const footer = page.locator('[data-sgui-part="card-pagination-footer"]');
  const original = await root.elementHandle();
  const originalFooter = await footer.elementHandle();
  for (const state of ['loading', 'empty', 'ready', 'loading', 'ready']) {
    await page.getByRole('button', { name: `Show ${state}`, exact: true }).click();
    await expect(root.locator('[aria-busy]')).toHaveAttribute('aria-busy', String(state === 'loading'));
    await expect(root.getByRole('textbox')).toHaveCount(state === 'ready' ? 4 : 0);
    await expect(root.locator('[data-sgui-part="status"]')).toHaveCount(state === 'ready' ? 0 : 1);
    if (state !== 'ready') {
      const status = root.locator('[data-sgui-part="status"]');
      await expect(status).toHaveText(state === 'loading' ? 'Loading courses' : 'No courses');
      await expect(status).toHaveAttribute('aria-live', 'off');
      await expect(status).not.toHaveAttribute('role');
    }
    for (const button of await footer.getByRole('button').all()) {
      if (state !== 'ready') await expect(button).toBeDisabled();
    }
    if (state === 'loading') await expect(footer.getByRole('combobox')).toBeDisabled();
    expect(await root.evaluate((node, prior) => node === prior, original)).toBe(true);
    expect(await footer.evaluate((node, prior) => node === prior, originalFooter)).toBe(true);
  }
  await expect(footer.getByRole('button', { name: 'Next page' })).toBeEnabled();
  await expect(footer).toContainText('1-4 of 12');
  await expect(page.getByLabel('Pagination requests')).toHaveText('None');
});

test('M-11 host rejection then acceptance controls cards and page-zero-before-size requests', async ({ page }) => {
  await openCollection(page);
  const requests = page.getByLabel('Pagination requests');
  const host = page.getByLabel('Host pagination');
  const next = page.getByRole('button', { name: 'Next page', exact: true });
  await next.click();
  await expect(requests).toHaveText('page:1');
  await expect(host).toHaveText('page:0,size:4');
  await expect(page.getByRole('textbox', { name: 'Note for Course 1', exact: true })).toBeVisible();
  await expect(next).toBeFocused();
  await page.getByRole('button', { name: 'Accept requests', exact: true }).click();
  await next.click();
  await expect(host).toHaveText('page:1,size:4');
  await expect(page.getByRole('textbox', { name: 'Note for Course 5', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reject requests', exact: true }).click();
  await page.getByRole('combobox').selectOption('8');
  await expect(requests).toHaveText('page:1 | page:1 | page:0 | size:8');
  await expect(host).toHaveText('page:1,size:4');
  await expect(page.getByRole('combobox')).toHaveValue('4');
  await expect(page.getByRole('textbox', { name: 'Note for Course 5', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Accept requests', exact: true }).click();
  await page.getByRole('combobox').selectOption('8');
  await expect(requests).toHaveText('page:1 | page:1 | page:0 | size:8 | page:0 | size:8');
  await expect(host).toHaveText('page:0,size:8');
  await expect(page.locator('[data-sgui-part="card-collection-grid"]').getByRole('textbox')).toHaveCount(8);
  await expect(page.locator('[data-sgui-part="card-pagination-footer"]')).toContainText('1-8 of 12');
});
