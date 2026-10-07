import { expect, test, type Page } from '@playwright/test';

const grid = (page: Page) => page.getByRole('grid', { name: 'Retry courses', exact: true });
const independent = (page: Page) => page.getByRole('grid', { name: 'Independent retry courses', exact: true });
async function open(page: Page, empty: boolean) {
  await page.goto('/iframe.html?id=migration-proofs-catalog-grid-interaction--retry-focus&viewMode=story&globals=a11y.manual:!true');
  await expect(grid(page)).toBeVisible();
  if (empty) {
    await page.getByRole('button', { name: 'Host action', exact: true }).focus();
    await page.keyboard.press('Alt+n');
    await expect(grid(page).locator('tbody [data-grid-row]')).toHaveCount(0);
  }
}

for (const empty of [false, true]) {
  test(`Retry removal repairs ${empty ? 'empty' : 'retained'} grid focus without scrolling or changing selection`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await open(page, empty);
    const table = grid(page);
    const container = table.locator('..');
    const entry = empty ? table.locator('thead [data-grid-field="name"]') : table.locator('tbody [data-grid-row="0"][data-grid-field="name"]');
    await entry.evaluate(node => node.setAttribute('data-identity', 'original'));
    for (const transition of ['retry', 'pending', 'success', 'callback removed']) {
      await page.getByRole('button', { name: 'Host action', exact: true }).focus();
      await page.keyboard.press('Alt+e');
      await page.getByRole('button', { name: 'Retry', exact: true }).focus();
      await container.evaluate(node => { node.scrollTop = 150; node.scrollLeft = 120; });
      const before = await container.evaluate(node => [node.scrollTop, node.scrollLeft]);
      expect(before[1]).toBeGreaterThan(0);
      if (!empty) expect(before[0]).toBeGreaterThan(0);
      await page.keyboard.press(transition === 'retry' ? 'Enter' : transition === 'pending' ? 'Alt+p' : transition === 'success' ? 'Alt+s' : 'Alt+x');
      await expect(page.getByRole('button', { name: 'Retry', exact: true })).toHaveCount(0);
      await expect(entry).toBeFocused();
      await expect(entry).toHaveAttribute('data-identity', 'original');
      await expect.poll(() => container.evaluate(node => [node.scrollTop, node.scrollLeft])).toEqual(before);
      if (transition === 'retry' || transition === 'pending') await expect(table).toHaveAttribute('aria-busy', 'true');
      else await expect(table).not.toHaveAttribute('aria-busy');
      await expect(independent(page)).not.toHaveAttribute('aria-busy');
      await expect(page.locator('[data-retry-requests]')).toHaveAttribute('data-retry-requests', '1');
      if (!empty) await expect(table.getByRole('checkbox', { name: 'Select Course 2', exact: true })).toBeChecked();
    }
    // Native keyboard navigation remains available after the focused trigger is gone.
    await page.keyboard.press('ArrowRight');
    expect(await table.evaluate(node => node.contains(document.activeElement))).toBe(true);
    expect(errors).toEqual([]);
  });

  test(`host and independent focus end ${empty ? 'empty' : 'retained'} Retry ownership`, async ({ page }) => {
    await open(page, empty);
    const host = page.getByRole('button', { name: 'Host action', exact: true });
    const other = independent(page).locator('tbody [data-grid-row="2"][data-grid-field="name"]');
    for (const target of [host, other]) {
      await target.focus();
      await page.keyboard.press('Alt+e');
      await page.getByRole('button', { name: 'Retry', exact: true }).focus();
      await target.focus();
      await page.keyboard.press('Alt+p');
      await expect(grid(page)).toHaveAttribute('aria-busy', 'true');
      await expect(target).toBeFocused();
      await page.keyboard.press('Alt+s');
      await expect(target).toBeFocused();
    }
  });
}
