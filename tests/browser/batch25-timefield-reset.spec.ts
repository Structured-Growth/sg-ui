import { test, expect, type Page } from '@playwright/test';

// Run on a fresh immutable Storybook build. This retained spec can reproduce
// RED with the baseline TimeField.tsx while keeping its story/spec fixtures.
const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  runtimeErrors.set(page, errors);
});
test.afterEach(({ page }) => { expect(runtimeErrors.get(page)).toEqual([]); });

for (const story of ['incomplete-prevented-reset', 'controlled-null-reset']) {
  test(`${story}: prevented reset preserves partial clock, native validation and segment focus; acceptance clears silently`, async ({ page }) => {
    await page.goto(`/iframe.html?id=migration-proofs-timefield--${story}&viewMode=story&globals=a11y.manual:!true`);
    const form = page.getByRole('form', { name: 'Clock reset form' });
    const hour = form.getByRole('spinbutton', { name: /hour/ });
    await hour.click(); await page.keyboard.type('23');
    await expect(hour).toHaveAttribute('aria-valuenow', '23');
    await form.getByRole('button', { name: 'Validate clock' }).click();
    await expect(form.getByText('Complete the clock', { exact: true })).toBeVisible();
    const missing = () => form.evaluate(node => {
      const input = (node as HTMLFormElement).elements.namedItem('clock') as HTMLInputElement;
      return input.validity.valueMissing;
    });
    await expect.poll(missing).toBe(true);
    await hour.focus();
    await form.evaluate(node => (node as HTMLFormElement).reset());
    // Wait beyond the owned deferred reset transaction before asserting silence.
    await page.waitForTimeout(30);
    await expect(hour).toBeFocused();
    await expect(hour).toHaveAttribute('aria-valuenow', '23');
    await expect(hour).toHaveAttribute('aria-invalid', 'true');
    await expect(form.getByText('Complete the clock', { exact: true })).toBeVisible();
    await form.getByRole('button', { name: 'Reset clock' }).click();
    await page.waitForTimeout(30);
    await expect(hour).toHaveAttribute('aria-valuenow', '23');
    await expect(form.getByRole('button', { name: 'Reset clock' })).toBeFocused();
    for (const part of ['minute', 'second']) await expect(form.locator(`[data-type="${part}"]`)).not.toHaveAttribute('aria-valuenow');
    await expect.poll(() => form.evaluate(node => new FormData(node as HTMLFormElement).get('clock'))).toBe('');
    await expect(page.getByLabel('Clock change callbacks')).toHaveText('0');
    await page.getByRole('checkbox', { name: 'Prevent clock reset' }).uncheck();
    await hour.focus(); await form.evaluate(node => (node as HTMLFormElement).reset());
    await expect(hour).not.toHaveAttribute('aria-valuenow');
    await expect(hour).toBeFocused();
    await expect(form.getByText('Complete the clock', { exact: true })).toHaveCount(0);
    await expect.poll(missing).toBe(true);
    await expect(page.getByLabel('Clock change callbacks')).toHaveText('0');
  });
}

test('complete edited clock survives prevention and silently resets to the latest default', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-timefield--complete-reset-transaction&viewMode=story&globals=a11y.manual:!true');
  const form = page.getByRole('form', { name: 'Clock reset form' });
  const second = form.locator('[data-type="second"]');
  const data = () => form.evaluate(node => new FormData(node as HTMLFormElement).get('clock'));
  await second.click(); await page.keyboard.press('ArrowUp');
  await expect.poll(data).toBe('09:30:01');
  await expect(page.getByLabel('Clock change callbacks')).toHaveText('1');
  await form.evaluate(node => (node as HTMLFormElement).reset()); await page.waitForTimeout(30);
  await expect(second).toBeFocused(); await expect(second).toHaveAttribute('aria-valuenow', '1');
  await expect.poll(data).toBe('09:30:01');
  await expect(page.getByLabel('Clock change callbacks')).toHaveText('1');
  await form.getByRole('button', { name: 'Change reset default' }).click();
  await expect.poll(data).toBe('09:30:01');
  await page.getByRole('checkbox', { name: 'Prevent clock reset' }).uncheck();
  await second.focus(); await form.evaluate(node => (node as HTMLFormElement).reset());
  await expect.poll(data).toBe('12:45:59'); await expect(second).toBeFocused();
  await expect(second).toHaveAttribute('aria-valuenow', '59');
  await expect(page.getByLabel('Clock change callbacks')).toHaveText('1');
});

test('controlled host rejects edits and remains authoritative during silent native reset', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-timefield--controlled-reset-transaction&viewMode=story&globals=a11y.manual:!true');
  const form = page.getByRole('form', { name: 'Clock reset form' });
  const minute = form.locator('[data-type="minute"]');
  await minute.click(); await page.keyboard.press('ArrowUp');
  await expect(page.getByLabel('Clock change callbacks')).toHaveText('1');
  await expect(minute).toHaveAttribute('aria-valuenow', '0');
  await page.getByRole('checkbox', { name: 'Prevent clock reset' }).uncheck();
  await minute.focus(); await form.evaluate(node => (node as HTMLFormElement).reset()); await page.waitForTimeout(30);
  await expect(minute).toBeFocused(); await expect(minute).toHaveAttribute('aria-valuenow', '0');
  await expect.poll(() => form.evaluate(node => new FormData(node as HTMLFormElement).get('clock'))).toBe('09:00:00');
  await expect(page.getByLabel('Clock change callbacks')).toHaveText('1');
});
