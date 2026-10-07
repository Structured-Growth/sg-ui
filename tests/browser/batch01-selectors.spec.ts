import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  (page as Page & { browserErrors?: string[] }).browserErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { browserErrors?: string[] }).browserErrors, 'browser runtime errors').toEqual([]);
});

async function story(page: Page, name: string) {
  await page.goto(`/iframe.html?id=migration-proofs-${name}&viewMode=story&globals=a11y.manual:!true`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}
async function values(page: Page, name: string) {
  return page.locator('form').evaluate((form, key) => new FormData(form as HTMLFormElement).getAll(key), name);
}

test('Select keyboard skips disabled IDs and returns focus without changing the second instance', async ({ page }) => {
  await story(page, 'select--independent');
  const first = page.getByRole('button', { name: /First status/ });
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'Unavailable' })).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('Enter');
  await expect(first).toBeFocused();
  await expect(first).toContainText('Active');
  expect(await values(page, 'first')).toEqual(['active']);
  expect(await values(page, 'second')).toEqual(['draft']);
  const second = page.getByRole('button', { name: /Second status/ });
  await second.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');
  await expect(second).toBeFocused();
  expect(await values(page, 'second')).toEqual(['draft']);
});

test('ComboBox keyboard skips disabled options and independent IDs retain their labels', async ({ page }) => {
  await story(page, 'combobox--independent');
  const first = page.getByRole('combobox', { name: 'First category' });
  const second = page.getByRole('combobox', { name: 'Second category' });
  expect(await first.getAttribute('id')).not.toBe(await second.getAttribute('id'));
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'Archived' })).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(first).toBeFocused();
  await expect(first).toHaveValue('Mathematics');
  await expect(second).toHaveValue('Science');
  expect(await values(page, 'first')).toEqual(['math']);
  expect(await values(page, 'second')).toEqual(['science']);
});

test('Multi-select native arrows skip disabled IDs; token removal restores its own search focus', async ({ page }) => {
  await story(page, 'asyncmultiselect--independent');
  const first = page.getByRole('listbox', { name: 'First courses' });
  const input = page.getByRole('searchbox', { name: 'First courses' });
  await input.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Home');
  await page.keyboard.press('Space');
  await expect(first.getByRole('option', { name: 'Science' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Space');
  await expect(first.getByRole('option', { name: 'Mathematics' })).toHaveAttribute('aria-selected', 'true');
  expect(await values(page, 'first')).toEqual(['01', '1']);
  expect(await values(page, 'second')).toEqual(['1']);
  await page.getByRole('button', { name: 'Remove Science' }).click();
  await expect(input).toBeFocused();
  expect(await values(page, 'first')).toEqual(['1']);
});

test('Host async adapter ignores stale success/failure and supports current failure retry and empty results', async ({ page }) => {
  await story(page, 'asyncmultiselect--request-race');
  await expect(page.getByRole('status')).toHaveText('Loading options…');
  await page.getByRole('searchbox').fill('x');
  await page.getByRole('button', { name: 'Resolve request 1', exact: true }).click();
  await expect(page.getByRole('option', { name: 'Result x' })).toBeVisible();
  await page.getByRole('button', { name: 'Resolve request 0', exact: true }).click();
  await expect(page.getByRole('option', { name: 'Result initial' })).toHaveCount(0);
  await page.getByRole('searchbox').fill('y');
  await expect(page.getByRole('option', { name: 'Result x' })).toHaveAttribute('aria-disabled', 'true');
  await page.getByRole('button', { name: 'Reject request 2', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Search failed. Try again.');
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Loading options…');
  await page.getByRole('button', { name: 'Resolve request 3', exact: true }).click();
  await expect(page.getByRole('option', { name: 'Result y' })).toBeVisible();
  await page.getByRole('searchbox').fill('z');
  await page.getByRole('searchbox').fill('w');
  await page.getByRole('button', { name: 'Resolve request 5', exact: true }).click();
  await expect(page.getByRole('option', { name: 'Result w' })).toBeVisible();
  await page.getByRole('button', { name: 'Reject request 4', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('1 options available');
  await story(page, 'asyncmultiselect--empty');
  await expect(page.getByRole('status')).toHaveText('No options found');
});

test('Single selectors explain empty results and validation without changing native selection', async ({ page }) => {
  await story(page, 'select--empty');
  await expect(page.getByRole('button')).toHaveAccessibleDescription('No options found');
  await page.getByRole('button').click();
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await story(page, 'combobox--empty');
  await page.getByRole('button', { name: 'Show options Category' }).click();
  await expect(page.getByText('No options found', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('combobox')).toBeFocused();
  await story(page, 'combobox--invalid');
  await expect(page.getByRole('combobox')).toHaveAccessibleDescription(/Choose an available category/);
});
