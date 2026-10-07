import { expect, test, type Page } from '@playwright/test';

const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text());
  });
});
test.afterEach(({ page }) => { expect(runtimeErrors.get(page)).toEqual([]); });

test('correcting a partial imported default then native reset restores parse feedback', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-timefield--invalid-default-reset&viewMode=story&globals=a11y.manual:!true');
  await expect(page.getByText('Enter a valid time.')).toBeVisible();
  for (const segment of ['hour', 'minute', 'second']) {
    await page.locator(`[data-type="${segment}"]`).click();
    await page.keyboard.type('1');
    await page.keyboard.press('ArrowRight');
  }
  await expect(page.getByText('Enter a valid time.')).toHaveCount(0);
  expect(await page.locator('form').evaluate(form => new FormData(form as HTMLFormElement).get('clock'))).toBe('01:01:01');
  await page.getByRole('button', { name: 'Reset imported clock' }).click();
  await expect(page.getByText('Enter a valid time.')).toBeVisible();
  expect(await page.locator('form').evaluate(form => new FormData(form as HTMLFormElement).get('clock'))).toBe('');
});

for (const locale of ['en-US', 'de-DE']) {
test(`midnight host replacement, segment wrap and host authority (${locale})`, async ({ page }) => {
  await page.goto(`/iframe.html?id=migration-proofs-timefield--host-replacement&viewMode=story&globals=a11y.manual:!true;locale:${locale}`);
  const hour = page.locator('[data-type="hour"]');
  const minute = page.locator('[data-type="minute"]');
  const second = page.locator('[data-type="second"]');
  await hour.click();
  await page.keyboard.type('23');
  await minute.click();
  await page.keyboard.type('59');
  await expect(page.getByLabel('Host clock value')).toHaveText('empty');
  await page.getByRole('button', { name: 'Replace with midnight' }).click();
  for (const segment of [hour, minute, second]) await expect(segment).toHaveAttribute('aria-valuenow', '0');
  await second.click();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByLabel('Host clock value')).toHaveText('00:00:59');
  await page.getByRole('button', { name: 'Make read only' }).click();
  await second.focus();
  await page.keyboard.press('ArrowUp');
  await expect(second).toBeFocused();
  await expect(page.getByLabel('Host clock value')).toHaveText('00:00:59');
  expect(await page.locator('form').evaluate(form => new FormData(form as HTMLFormElement).get('clock'))).toBe('00:00:59');
  await page.getByRole('button', { name: 'Disable clock' }).click();
  expect(await page.locator('form').evaluate(form => new FormData(form as HTMLFormElement).has('clock'))).toBe(false);
});
}
