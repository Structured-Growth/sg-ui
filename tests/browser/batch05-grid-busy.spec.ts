import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  await page.goto('/iframe.html?id=migration-proofs-catalog-grid-interaction--busy-lifecycle&viewMode=story&globals=a11y.manual:!true');
  await expect(page.getByRole('grid', { name: 'Busy courses', exact: true })).toBeVisible();
}
const first = (page: Page) => page.getByRole('grid', { name: 'Busy courses', exact: true });
const other = (page: Page) => page.getByRole('grid', { name: 'Independent busy courses', exact: true });
const message = (page: Page) => page.locator('[data-sgui-part="grid-status-message"]');

test('native busy and one announcement track retained-row requests without replacing focus or scroll', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await open(page);
  const grid = first(page);
  const cell = grid.locator('tbody [data-grid-row="7"][data-grid-field="name"]');
  const container = grid.locator('..');
  await cell.focus();
  await cell.evaluate(node => { node.setAttribute('data-focus-sentinel', 'retained'); });
  await container.evaluate(node => { node.scrollTop = 240; node.scrollLeft = 160; });
  const before = await container.evaluate(node => [node.scrollTop, node.scrollLeft]);
  expect(before.every(value => value > 0)).toBe(true);
  for (const shortcut of ['Alt+l', 'Alt+r']) {
    await page.keyboard.press(shortcut);
    await expect(grid).toHaveAttribute('aria-busy', 'true');
    await expect(other(page)).not.toHaveAttribute('aria-busy');
    await expect(message(page)).toHaveCount(1);
    await expect(message(page)).toHaveText('Refreshing rows');
    const live = message(page).locator('..');
    await expect(live).toHaveAttribute('role', 'status');
    await expect(live).toHaveAttribute('aria-live', 'polite');
    await expect(live).toHaveAttribute('aria-atomic', 'true');
    expect(await grid.locator('[data-sgui-part="grid-status-message"]').count()).toBe(0);
    await expect(cell).toBeFocused();
    await expect(cell).toHaveAttribute('data-focus-sentinel', 'retained');
    await expect.poll(() => container.evaluate(node => [node.scrollTop, node.scrollLeft])).toEqual(before);
  }
  // Count native live-region mutations, rather than inferring spoken output.
  await message(page).locator('..').evaluate(node => {
    node.setAttribute('data-mutations', '0');
    const observer = new MutationObserver(records => {
      node.setAttribute('data-mutations', String(Number(node.getAttribute('data-mutations')) + records.length));
    });
    observer.observe(node, { childList: true, characterData: true, subtree: true });
  });
  await page.keyboard.press('Alt+u');
  await expect(page.locator('[data-revision="1"]')).toHaveCount(1);
  await expect(message(page).locator('..')).toHaveAttribute('data-mutations', '0');
  await page.keyboard.press('Alt+e');
  await expect(grid).not.toHaveAttribute('aria-busy');
  await expect(message(page)).toHaveCount(1);
  await expect(page.getByRole('alert')).toHaveText('Course request failedRetry');
  await expect(page.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  await expect(cell).toBeFocused();
  await expect.poll(() => container.evaluate(node => [node.scrollTop, node.scrollLeft])).toEqual(before);
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(page.locator('[data-retries="1"]')).toHaveCount(1);
  await expect(grid).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(message(page)).toHaveCount(1);
  // Retry is outside the table; deliberate focus moves are host-owned.
  await cell.focus();
  await container.evaluate((node, values) => { [node.scrollTop, node.scrollLeft] = values; }, before);
  await page.keyboard.press('Alt+s');
  await expect(grid).not.toHaveAttribute('aria-busy');
  await expect(message(page)).toHaveCount(0);
  await expect(cell).toBeFocused();
  await expect(cell).toHaveAttribute('data-focus-sentinel', 'retained');
  await expect(grid.locator('tbody [data-sgui-part="grid-row"]')).toHaveCount(25);
  await expect.poll(() => container.evaluate(node => [node.scrollTop, node.scrollLeft])).toEqual(before);
  expect(errors).toEqual([]);
});

test('another grid keeps focus and busy state during the first grid lifecycle', async ({ page }) => {
  await open(page);
  const independent = other(page);
  const cell = independent.locator('tbody [data-grid-row="2"][data-grid-field="name"]');
  await cell.focus();
  const container = independent.locator('..');
  await container.evaluate(node => { node.scrollTop = 100; node.scrollLeft = 80; });
  const before = await container.evaluate(node => [node.scrollTop, node.scrollLeft]);
  for (const shortcut of ['Alt+r', 'Alt+e', 'Alt+l', 'Alt+s']) {
    await page.keyboard.press(shortcut);
    if (shortcut === 'Alt+r' || shortcut === 'Alt+l') await expect(first(page)).toHaveAttribute('aria-busy', 'true');
    else await expect(first(page)).not.toHaveAttribute('aria-busy');
    await expect(independent).not.toHaveAttribute('aria-busy');
    await expect(cell).toBeFocused();
    await expect.poll(() => container.evaluate(node => [node.scrollTop, node.scrollLeft])).toEqual(before);
  }
});
