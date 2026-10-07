import { expect, test, type Page } from '@playwright/test';

const initial = ['2024-02-28', '2024-02-29'];
const replacement = ['2024-02-20', '2024-02-21'];
const march = { start: '2024-03-01', end: '2024-03-31' };
const trigger = (page: Page) => page.getByRole('button', { name: 'Choose Reporting dates', exact: true });
const draft = (page: Page) => page.locator('[data-sgui-part="date-range-draft"]');
const preview = (page: Page) => page.locator('[data-sgui-part="date-range-preview"]');
const requests = (page: Page) => page.getByLabel('Range requests', { exact: true });
const form = (page: Page) => page.locator('form[aria-label="Controlled range form"]');
const endpoints = (page: Page) => form(page).evaluate(node => {
  const data = new FormData(node as HTMLFormElement);
  return [data.get('range.start'), data.get('range.end')];
});

const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/iframe.html?id=migration-proofs-daterangepicker-controlled-transactions--controlled-host&viewMode=story&globals=locale:en-US;a11y.manual:!true');
  await expect(form(page)).toBeVisible();
});

test.afterEach(({ page }) => expect(runtimeErrors.get(page), 'range picker runtime errors').toEqual([]));

// Reach the grid's native tab stop from the trigger. No programmatic focus or
// selected-state injection: Enter establishes the anchor and arrows extend it.
async function beginPreview(page: Page) {
  await expect(trigger(page)).toBeFocused();
  await page.keyboard.press('Enter');
  const anchor = page.getByRole('button', { name: /Wednesday, February 28, 2024/ }).and(page.locator(':not([data-outside-month])'));
  for (let step = 0; step < 16; step++) {
    if (await anchor.evaluate(node => node === document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  await expect(anchor).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: /Friday, March 1, 2024/ }).and(page.locator(':not([data-outside-month])'))).toBeFocused();
  await expect(preview(page)).toHaveText('Range preview: 2024-02-28 – 2024-03-01. Choose an end date to finish.');
  await expect(page.getByRole('button', { name: 'Apply', exact: true })).toBeDisabled();
}

test('rejected Apply requests once while submitted endpoints and reopened draft follow the host; accepted Apply commits', async ({ page }) => {
  await trigger(page).click();
  await page.getByRole('button', { name: 'March', exact: true }).click();
  expect(await endpoints(page)).toEqual(initial);
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(requests(page)).toHaveText(JSON.stringify([march]));
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger(page)).toBeFocused();
  expect(await endpoints(page)).toEqual(initial);
  await page.getByRole('button', { name: 'Submit range', exact: true }).click();
  await expect(page.getByLabel('Submitted range')).toHaveText(initial.join(' – '));
  await trigger(page).click();
  await expect(draft(page)).toHaveText(initial.join(' – '));
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByLabel('Accept range requests').check();
  await trigger(page).click();
  await page.getByRole('button', { name: 'March', exact: true }).click();
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(requests(page)).toHaveText(JSON.stringify([march, march]));
  expect(await endpoints(page)).toEqual([march.start, march.end]);
  await page.getByRole('button', { name: 'Submit range', exact: true }).click();
  await expect(page.getByLabel('Submitted range')).toHaveText(`${march.start} – ${march.end}`);
  await trigger(page).click();
  await expect(draft(page)).toHaveText(`${march.start} – ${march.end}`);
});

test('changed host endpoints while calendar focus stays inside invalidate draft and pending anchor', async ({ page }) => {
  await trigger(page).click();
  await page.keyboard.press('Escape');
  await beginPreview(page);
  expect(await endpoints(page)).toEqual(initial);
  await page.keyboard.press('Alt+h');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(preview(page)).toHaveCount(0);
  expect(await page.getByRole('application').evaluate(node => node.contains(document.activeElement))).toBe(true);
  await expect(draft(page)).toHaveText(replacement.join(' – '));
  await expect(page.getByRole('button', { name: 'Apply', exact: true })).toBeEnabled();
  expect(await endpoints(page)).toEqual(replacement);
  await expect(requests(page)).toHaveText('[]');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(requests(page)).toHaveText(JSON.stringify([{ start: replacement[0], end: replacement[1] }]));
  expect(await endpoints(page)).toEqual(replacement);
  await trigger(page).click();
  await expect(draft(page)).toHaveText(replacement.join(' – '));
});

test('real form.reset while calendar remains focused preserves prevented preview, then closes without stale requests', async ({ page }) => {
  await page.getByLabel('Prevent range reset').check();
  await trigger(page).click();
  await page.keyboard.press('Escape');
  await beginPreview(page);
  // Selected cells share a range-summary prefix; match the cell's own date suffix.
  const endpoint = page.getByRole('button', { name: /(?:^|, )Friday, March 1, 2024(?: selected)?$/ }).and(page.locator(':not([data-outside-month])'));
  await form(page).evaluate(node => (node as HTMLFormElement).reset());
  await expect(page.getByLabel('Reset prevention ledger')).toHaveText('[true]');
  await expect(endpoint).toBeFocused();
  await expect(preview(page)).toHaveText('Range preview: 2024-02-28 – 2024-03-01. Choose an end date to finish.');
  await expect(draft(page)).toHaveText(initial.join(' – '));
  await expect(page.getByRole('button', { name: 'Apply', exact: true })).toBeDisabled();
  expect(await endpoints(page)).toEqual(initial);
  // Complete the retained pending range to prove prevention did not discard it.
  await page.keyboard.press('Enter');
  await expect(draft(page)).toHaveText('2024-02-28 – 2024-03-01');
  await expect(preview(page)).toHaveCount(0);
  await expect(requests(page)).toHaveText('[]');
  await page.keyboard.press('Alt+p');
  await expect(page.getByLabel('Prevent range reset')).not.toBeChecked();
  await expect(endpoint).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await expect(preview(page)).toBeVisible();
  await form(page).evaluate(node => (node as HTMLFormElement).reset());
  await expect(page.getByLabel('Reset prevention ledger')).toHaveText('[true,false]');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger(page)).toBeFocused();
  expect(await endpoints(page)).toEqual(initial);
  await expect(requests(page)).toHaveText('[]');
  await page.keyboard.press('Enter');
  await expect(preview(page)).toHaveCount(0);
  await expect(draft(page)).toHaveText(initial.join(' – '));
  await expect(page.getByRole('button', { name: 'Apply', exact: true })).toBeEnabled();
  await expect(requests(page)).toHaveText('[]');
});
