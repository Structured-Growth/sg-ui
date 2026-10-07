import { test, expect, type Page } from '@playwright/test';

const url = '/iframe.html?id=data-display-datagriddraghandle--strict-mode-reorder&viewMode=story&globals=a11y.manual:!true';
const initial = ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5'];
const names = (page: Page) => page.locator('[data-grid-field="name"][data-grid-row]');
const handle = (page: Page) => page.getByRole('button', { name: 'Reorder Course 2', exact: true });
const requests = (page: Page) => page.getByRole('status', { name: 'Host requests' });

function runtimeErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  return errors;
}
async function keyboardDrag(page: Page) {
  await handle(page).focus();
  await expect(handle(page)).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('[aria-roledescription="drop indicator"]:focus')).toBeVisible();
}

test('Strict Mode keyboard cancellation keeps selection, source focus and no host request across remount', async ({ page }) => {
  const errors = runtimeErrors(page);
  await page.goto(url);
  await expect(names(page)).toHaveText(initial);
  const selected = page.getByRole('checkbox', { name: 'Select Course 1', exact: true });
  await selected.locator('xpath=ancestor::label').click();
  for (let attempt = 0; attempt < 2; attempt++) {
    await keyboardDrag(page);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    await expect(handle(page)).toBeFocused();
    await expect(page.locator('[aria-roledescription="drop indicator"]')).toHaveCount(0);
    await expect(requests(page)).toHaveText('0 requests');
    await expect(names(page)).toHaveText(initial);
    if (attempt === 0) {
      await expect(selected).toBeChecked();
      await page.getByRole('button', { name: 'Unmount grid', exact: true }).click();
      await expect(page.getByRole('grid')).toHaveCount(0);
      await page.getByRole('button', { name: 'Mount grid', exact: true }).click();
    }
  }
  // A fresh keyboard drop after cancellation must emit exactly once.
  await keyboardDrag(page);
  await page.keyboard.press('End');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('[aria-roledescription="drop indicator"]:focus')).toHaveAttribute('aria-label', 'Insert between Course 3 and Course 4');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Order saved.' })).toBeVisible();
  await expect(names(page)).toHaveText(['Course 1', 'Course 3', 'Course 2', 'Course 4', 'Course 5']);
  await expect(handle(page)).toBeFocused();
  await expect(requests(page)).toHaveText('1 requests');
  expect(errors).toEqual([]);
});

test('keyboard Move alternatives keep source focus through pending commit and host failure rollback', async ({ page }) => {
  const errors = runtimeErrors(page);
  await page.goto(url);
  await expect(names(page)).toHaveText(initial);
  const down = page.getByRole('button', { name: 'Move Course 2 down', exact: true });
  // Enter the collection before focusing its nested action. The first entry
  // delegates focus to a row, independently of later nested-control focus.
  await page.getByRole('rowheader', { name: 'Course 1', exact: true }).click();
  await down.focus();
  await expect(down).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Saving order…' })).toBeVisible();
  await expect(down).toBeDisabled();
  await expect(page.getByRole('status').filter({ hasText: 'Order saved.' })).toBeVisible();
  const committed = ['Course 1', 'Course 3', 'Course 2', 'Course 4', 'Course 5'];
  await expect(names(page)).toHaveText(committed);
  await expect(down).toBeFocused();
  await page.getByRole('button', { name: 'Reject next move', exact: true }).click();
  const up = page.getByRole('button', { name: 'Move Course 2 up', exact: true });
  await up.focus();
  await expect(up).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByRole('status').filter({ hasText: 'Saving order…' })).toBeVisible();
  await expect(names(page)).toHaveText(initial); // Host optimistic snapshot.
  await expect(page.getByRole('status').filter({ hasText: 'Save failed; previous order restored.' })).toBeVisible();
  await expect(names(page)).toHaveText(committed);
  await expect(up).toBeFocused();
  await expect(requests(page)).toHaveText('2 requests');
  expect(errors).toEqual([]);
});

test('single pointer Move alternative repairs source focus when the destination disables its action', async ({ page }) => {
  const errors = runtimeErrors(page);
  await page.goto(url);
  await expect(names(page)).toHaveText(initial);
  const down = page.getByRole('button', { name: 'Move Course 4 down', exact: true });
  await down.click();
  await expect(page.getByRole('status').filter({ hasText: 'Order saved.' })).toBeVisible();
  await expect(names(page)).toHaveText(['Course 1', 'Course 2', 'Course 3', 'Course 5', 'Course 4']);
  await expect(down).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Reorder Course 4', exact: true })).toBeFocused();
  await expect(requests(page)).toHaveText('1 requests');
  expect(errors).toEqual([]);
});
