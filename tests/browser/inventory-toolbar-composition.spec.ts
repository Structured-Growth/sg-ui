import { expect, test, type Locator, type Page } from '@playwright/test';

async function tabTo(page: Page, target: Locator) {
  for (let index = 0; index < 24; index++) {
    if (await target.evaluate(node => node === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  await expect(target).toBeFocused();
}
async function withinViewport(page: Page, target: Locator) {
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  const viewport = page.viewportSize()!;
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 1);
}
async function callbacks(page: Page, events: string[]) {
  await expect(page.getByLabel('Host callbacks')).toHaveText(JSON.stringify(events));
}

const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const messages: string[] = []; errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
  page.on('console', message => { if (message.type() === 'error') messages.push(message.text()); });
});
test.afterEach(async ({ page }) => { expect(errors.get(page), 'browser runtime errors').toEqual([]); });

for (const { width, rtl } of [{ width: 360, rtl: false }, { width: 320, rtl: true }]) {
  test.describe(`${width}px ${rtl ? 'RTL' : 'LTR'} toolbar composition`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width, height: 740 });
      await page.goto(`/iframe.html?id=data-display-datatoolbar--native-composition${rtl ? '-rtl' : ''}&viewMode=story&globals=a11y.manual:!true`);
      await expect(page.getByRole('group', { name: 'Native course toolbar', exact: true })).toBeVisible();
    });
    test('selection menu and rejected view request retain native focus and host ownership', async ({ page }) => {
      const checkbox = page.getByRole('checkbox', { name: 'Select rows', exact: true });
      await expect(page.getByText('2 selected', { exact: true })).toBeVisible();
      expect(await checkbox.evaluate(node => (node as HTMLInputElement).indeterminate)).toBe(true);
      await tabTo(page, checkbox);
      await page.keyboard.press('Space');
      await expect(page.getByText('5 selected', { exact: true })).toBeVisible();
      await expect(checkbox).toBeChecked();
      const trigger = page.getByRole('button', { name: 'Selection options', exact: true });
      await tabTo(page, trigger);
      await page.keyboard.press('ArrowDown');
      const menu = page.getByRole('menu', { name: 'Selection options', exact: true });
      await expect(menu).toBeVisible();
      await expect(menu).toHaveCSS('direction', rtl ? 'rtl' : 'ltr');
      await withinViewport(page, menu);
      await expect(page.getByRole('menuitem', { name: 'Select current page', exact: true })).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(page.getByRole('menuitem', { name: 'Clear selection', exact: true })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(menu).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await expect(checkbox).not.toBeChecked();
      await expect(page.getByText('5 selected', { exact: true })).toHaveCount(0);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      const list = page.getByRole('button', { name: 'List', exact: true });
      await tabTo(page, list);
      await page.keyboard.press('Space');
      await expect(list).toBeFocused();
      await withinViewport(page, list);
      await expect(list).toHaveAttribute('aria-pressed', 'false');
      await expect(page.getByRole('button', { name: 'Cards', exact: true })).toHaveAttribute('aria-pressed', 'true');
      await callbacks(page, ['toggle', 'selection:none', 'view:list']);
    });

    test('column locks and reset coexist with search clear/Escape and independent query lifetime', async ({ page }) => {
      const search = page.getByRole('button', { name: 'Search', exact: true });
      await tabTo(page, search);
      await page.keyboard.press('Enter');
      const input = page.getByRole('searchbox', { name: 'Search', exact: true });
      await expect(input).toBeFocused();
      await input.fill('course');
      const columns = page.getByRole('button', { name: 'Columns', exact: true });
      await tabTo(page, columns);
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Columns', exact: true });
      await expect(dialog).toBeVisible();
      await withinViewport(page, dialog);
      await expect(dialog).toHaveCSS('direction', rtl ? 'rtl' : 'ltr');
      await expect(dialog.getByRole('checkbox', { name: 'Course', exact: true })).toBeDisabled();
      await expect(dialog.getByRole('checkbox', { name: 'Actions', exact: true })).toBeDisabled();
      const status = dialog.getByRole('checkbox', { name: 'Status', exact: true });
      await tabTo(page, status);
      await page.keyboard.press('Space');
      await expect(status).not.toBeChecked();
      await expect(page.getByLabel('Visible host columns')).toHaveText('course,actions');
      await dialog.getByRole('searchbox').fill('Status');
      await page.keyboard.press('Escape');
      await expect(columns).toBeFocused();
      await expect(input).toHaveValue('course');
      await page.keyboard.press('Enter');
      await expect(dialog.getByRole('searchbox')).toHaveValue('');
      const reset = dialog.getByRole('button', { name: 'Reset', exact: true });
      await tabTo(page, reset);
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Visible host columns')).toHaveText('course,status,actions');
      await page.keyboard.press('Escape');
      await expect(columns).toBeFocused();
      const clear = page.getByRole('button', { name: 'Clear and close search', exact: true });
      // Clear precedes Columns in DOM order. Stay within the document rather
      // than assuming forward Tab wraps through browser chrome in every engine.
      await page.keyboard.press('Shift+Tab');
      await expect(clear).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(input).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(clear).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(search).toBeFocused();
      await expect(input).toHaveCount(0);
      await page.keyboard.press('Enter');
      await expect(input).toHaveValue('');
      await expect(input).toBeFocused();
      await input.fill('next');
      await page.keyboard.press('Escape');
      await expect(search).toBeFocused();
      await expect(input).toHaveCount(0);
      await callbacks(page, ['search:course', 'columns:course,actions', 'columns:course,status,actions', 'search:', 'search:next', 'search:']);
      await withinViewport(page, search);
    });
  });
}
