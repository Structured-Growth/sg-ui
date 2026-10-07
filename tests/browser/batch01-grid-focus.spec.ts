import { expect, test, type Page } from '@playwright/test';

const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
});
test.afterEach(async ({ page }, info) => {
  const state = await page.evaluate(() => ({
    active: document.activeElement?.outerHTML.slice(0, 1000),
    grids: [...document.querySelectorAll('[data-sgui-part="grid-container"]')].map(node => ({
      label: node.querySelector('[role="grid"]')?.getAttribute('aria-label'),
      scrollTop: node.scrollTop, scrollLeft: node.scrollLeft,
    })),
  }));
  await info.attach('native-focus-scroll', { body: JSON.stringify(state), contentType: 'application/json' });
  expect(runtimeErrors.get(page), 'browser runtime errors').toEqual([]);
});

async function open(page: Page) {
  await page.goto('/iframe.html?id=migration-proofs-catalog-grid-interaction--focus-retention&viewMode=story&globals=a11y.manual:!true');
  await expect(page.getByRole('grid', { name: 'Focus courses', exact: true })).toBeVisible();
}
const firstGrid = (page: Page) => page.getByRole('grid', { name: 'Focus courses', exact: true });

test('refresh retains stable nested focus and both native scroll axes', async ({ page }) => {
  await open(page);
  const grid = firstGrid(page);
  const review = grid.getByRole('button', { name: 'Review Course 8', exact: true });
  await review.focus();
  const container = grid.locator('..');
  await container.evaluate(node => { node.scrollTop = 240; node.scrollLeft = 160; });
  const before = await container.evaluate(node => [node.scrollTop, node.scrollLeft]);
  await page.keyboard.press('Alt+r');
  await expect(grid).toHaveAttribute('aria-busy', 'true');
  await expect(review).toBeFocused();
  await expect.poll(() => container.evaluate(node => [node.scrollTop, node.scrollLeft])).toEqual(before);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Nested actions: 1' })).toBeVisible();
  await expect(grid.getByRole('checkbox', { name: 'Select Course 8', exact: true })).not.toBeChecked();
});

test('hidden columns, deleted focused rows and empty results retain a grid entry', async ({ page }) => {
  await open(page);
  const grid = firstGrid(page);
  await grid.getByRole('button', { name: 'Review Course 8', exact: true }).focus();
  await page.keyboard.press('Alt+h');
  await expect.poll(() => grid.locator('[data-grid-row="7"]').evaluateAll(nodes => nodes.some(node => node.contains(document.activeElement)))).toBe(true);
  const cell = grid.locator('tbody [data-grid-row="7"][data-grid-field="status"]');
  await cell.focus();
  await page.keyboard.press('Alt+d');
  await expect(grid.locator('tbody [data-grid-row="7"]')).toHaveCount(0);
  await expect.poll(() => grid.evaluate(node => node.contains(document.activeElement) && document.activeElement?.getAttribute("data-grid-field") === "status" && !!document.activeElement?.closest("tbody"))).toBe(true);
  await page.keyboard.press('Alt+e');
  await expect(grid).toBeFocused();
});

test('accepted page and size transitions reset scroll and enter the first text cell', async ({ page }) => {
  await open(page);
  const grid = firstGrid(page);
  const container = grid.locator('..');
  await grid.locator('tbody [data-grid-row="7"][data-grid-field="status"]').focus();
  await page.keyboard.press('Alt+p');
  await expect(grid.locator('tbody [data-grid-field="name"]').first()).toBeFocused();
  await expect(grid.locator('tbody [data-grid-field="name"]').first()).toHaveText('Course 26');
  await expect.poll(() => container.evaluate(node => [node.scrollTop, node.scrollLeft])).toEqual([0, 0]);
  await page.keyboard.press('Alt+s');
  await expect(grid.locator('tbody [data-grid-field="name"]').first()).toHaveText('Course 1');
  await expect(grid.locator('tbody [data-grid-field="name"]').first()).toBeFocused();
});

test('another grid and a host action keep focus when the first grid changes', async ({ page }) => {
  await open(page);
  const other = page.getByRole('grid', { name: 'Independent focus courses', exact: true });
  const review = other.getByRole('button', { name: 'Review Course 2', exact: true });
  await review.focus();
  await page.keyboard.press('Alt+e');
  await expect(review).toBeFocused();
  await page.getByRole('button', { name: 'Host action', exact: true }).focus();
  await page.keyboard.press('Alt+p');
  await expect(page.getByRole('button', { name: 'Host action', exact: true })).toBeFocused();
});

test('arrow navigation follows body and nested controls while Tab exits the grid', async ({ page }) => {
  await open(page);
  const grid = firstGrid(page);
  const name = grid.locator('tbody [data-grid-row="0"][data-grid-field="name"]');
  await name.focus();
  await page.keyboard.press('ArrowDown');
  await expect(grid.locator('tbody [data-grid-row="1"][data-grid-field="name"]')).toBeFocused();
  await page.keyboard.press('ArrowRight');
  // React Aria enters the first focusable control in an interactive cell.
  await expect(grid.getByRole('button', { name: 'Inspect Course 2', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(grid.getByRole('button', { name: 'Review Course 2', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Nested actions: 1' })).toBeVisible();
  await expect(grid.getByRole('checkbox', { name: 'Select Course 2', exact: true })).not.toBeChecked();
  await page.keyboard.press('Tab');
  await expect.poll(() => grid.evaluate(node => node.contains(document.activeElement))).toBe(false);
});
