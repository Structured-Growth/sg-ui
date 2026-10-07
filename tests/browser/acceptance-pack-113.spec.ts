import { expect, test } from '@playwright/test';

// G-06/G-07: existing controlled story starts with course-55 selected and
// course-2 disabled. No new fixture or application state injection is needed.
test('batch113 page selection excludes disabled rows, becomes mixed and None clears retained pages', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/iframe.html?id=data-appdatagrid--retained-selection&viewMode=story&globals=a11y.manual:!true');
  const grid = page.getByRole('grid', { name: 'Courses', exact: true });
  const header = grid.getByRole('checkbox', { name: 'Select page', exact: true });
  await expect(grid).toBeVisible();
  await expect(grid.locator('thead th').first()).toContainText('Select page');
  await expect(header).not.toBeChecked();
  await expect(header).toHaveJSProperty('indeterminate', false);
  const first = grid.getByRole('checkbox', { name: 'Select Course 1', exact: true });
  await first.focus();
  await page.keyboard.press('Space');
  await expect(first).toBeChecked();
  await expect(header).toHaveJSProperty('indeterminate', true);
  await header.click();
  await expect(header).toBeChecked();
  await expect(header).toHaveJSProperty('indeterminate', false);
  const disabled = grid.getByRole('checkbox', { name: 'Select Course 2', exact: true });
  await expect(disabled).toBeDisabled();
  await expect(disabled).not.toBeChecked();
  for (let index = 0; index < 5; index++) await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(grid.getByRole('checkbox', { name: 'Select Course 55', exact: true })).toBeChecked();
  await expect(grid.getByRole('checkbox', { name: 'Select Course 51', exact: true })).not.toBeChecked();
  await expect(header).toHaveJSProperty('indeterminate', true);
  await grid.getByRole('button', { name: 'Selection actions', exact: true }).click();
  await page.getByRole('menuitem', { name: 'None', exact: true }).press('Enter');
  await expect(grid.getByRole('checkbox', { name: 'Select Course 55', exact: true })).not.toBeChecked();
  for (let course = 51; course <= 58; course++) {
    await expect(grid.getByRole('checkbox', { name: `Select Course ${course}`, exact: true })).not.toBeChecked();
  }
  await expect(header).toHaveJSProperty('indeterminate', false);
  for (let index = 0; index < 5; index++) await page.getByRole('button', { name: 'Previous page', exact: true }).click();
  await expect(first).not.toBeChecked();
  await expect(grid.getByRole('checkbox', { name: 'Select Course 3', exact: true })).not.toBeChecked();
  for (let course = 1; course <= 10; course++) {
    await expect(grid.getByRole('checkbox', { name: `Select Course ${course}`, exact: true })).not.toBeChecked();
  }
  await expect(header).not.toBeChecked();
  await expect(header).toHaveJSProperty('indeterminate', false);
  expect(errors).toEqual([]);
});
