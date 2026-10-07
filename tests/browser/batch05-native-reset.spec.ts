import { test, expect, type Page } from '@playwright/test';

const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const messages: string[] = []; errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) messages.push(message.text()); });
});
test.afterEach(({ page }) => { expect(errors.get(page), 'browser runtime errors').toEqual([]); });
async function story(page: Page, id: string) {
  await page.goto(`/iframe.html?id=migration-proofs-${id}&viewMode=story&globals=a11y.manual:!true`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}
async function values(page: Page) {
  return page.locator('form').evaluate(form => Object.fromEntries(new FormData(form as HTMLFormElement)));
}
// An actual native click is essential: scripted dispatch does not expose the
// browser's microtask checkpoints between native and delegated React listeners.
test('DatePicker waits for delegated prevention, restores defaults and leaves controlled values silent', async ({ page }) => {
  await story(page, 'datepicker--native-form-reset');
  const trigger = page.getByRole('button', { name: 'Choose Reset date', exact: true });
  await trigger.click();
  await page.getByRole('button', { name: 'Thursday, February 29, 2024', exact: true }).click();
  await expect(page.getByLabel('Date changes')).toHaveText('1');
  await page.getByLabel('Prevent form reset').check();
  await page.getByRole('button', { name: 'Reset dates', exact: true }).click();
  await expect.poll(() => values(page)).toEqual({ date: '2024-02-29', controlledDate: '2024-03-01' });
  await trigger.click();
  // form.reset() while focus remains in the popup must also preserve it.
  await page.locator('form').evaluate(form => (form as HTMLFormElement).reset());
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Date changes')).toHaveText('1');
  await page.keyboard.press('Escape');
  await page.getByLabel('Prevent form reset').uncheck();
  await trigger.click();
  await page.locator('form').evaluate(form => (form as HTMLFormElement).reset());
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect.poll(() => values(page)).toEqual({ date: '2024-02-28', controlledDate: '2024-03-01' });
  await expect(page.getByLabel('Date changes')).toHaveText('1');
});

test('AsyncMultiSelect native reset preserves prevented/controlled values and emits no selection or query callbacks', async ({ page }) => {
  await story(page, 'asyncmultiselect--native-form-reset');
  const input = page.getByRole('searchbox', { name: 'Reset courses', exact: true });
  await input.fill('Science');
  const queryChanges = await page.getByLabel('Query changes').textContent();
  await page.getByRole('button', { name: 'Remove Course 1', exact: true }).click();
  await expect(page.getByLabel('Selection changes')).toHaveText('1');
  await page.getByLabel('Prevent form reset').check();
  await page.getByRole('button', { name: 'Reset courses', exact: true }).click();
  await expect.poll(() => values(page)).toEqual({ controlledCourses: '1' });
  await expect(input).toHaveValue('Science');
  await page.getByLabel('Prevent form reset').uncheck();
  await page.getByRole('button', { name: 'Reset courses', exact: true }).click();
  await expect.poll(() => values(page)).toEqual({ courses: '0', controlledCourses: '1' });
  await expect(input).toHaveValue('Science');
  await expect(page.getByRole('searchbox', { name: 'Controlled courses', exact: true })).toHaveValue('Controlled');
  await expect(page.getByLabel('Selection changes')).toHaveText('1');
  await expect(page.getByLabel('Query changes')).toHaveText(queryChanges!);
});

test('native reset does not restart host searches or let late requests restore selected records', async ({ page }) => {
  await story(page, 'asyncmultiselect--native-search-reset');
  // StrictMode starts an aborted request 0 and current request 1.
  await page.getByRole('button', { name: 'Resolve request 1', exact: true }).click();
  await page.getByRole('option', { name: 'Result initial', exact: true }).click();
  await page.getByRole('searchbox').fill('x');
  await expect(page.getByRole('button', { name: 'Resolve request 2', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset search selection', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Remove Result initial', exact: true })).toHaveCount(0);
  await expect(page.getByRole('searchbox')).toHaveValue('x');
  await expect(page.getByRole('button', { name: 'Resolve request 3', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reject request 0', exact: true }).click();
  await page.getByRole('button', { name: 'Resolve request 2', exact: true }).click();
  await expect(page.getByRole('option', { name: 'Result x', exact: true })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('1 options available');
  await expect(page.getByRole('button', { name: /Remove Result/ })).toHaveCount(0);
});
