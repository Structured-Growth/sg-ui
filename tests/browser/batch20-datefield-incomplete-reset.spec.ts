import { test, expect } from '@playwright/test';

// These retained acceptance cases expose the known U-18/K-06 defect until the
// interaction reset owner can preserve incomplete state before engine clearing.
for (const story of ['incomplete-prevented-reset', 'controlled-null-incomplete-reset']) {
  test(`${story} retains an incomplete draft, focus and native required validity on prevented reset`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/iframe.html?id=migration-proofs-datefield--${story}&viewMode=story&globals=a11y.manual:!true`);
    const form = page.getByRole('form', { name: 'Incomplete date reset form' });
    const day = form.getByRole('spinbutton', { name: /day/ });
    await day.click();
    await page.keyboard.type('28');
    await expect(day).toHaveAttribute('aria-valuenow', '28');
    await expect(page.getByLabel('Prevent incomplete reset')).toBeChecked();
    await form.getByRole('button', { name: 'Validate draft' }).click();
    const missingValue = () => form.evaluate(node => {
      const input = (node as HTMLFormElement).elements.namedItem('date');
      return input instanceof HTMLInputElement && input.validity.valueMissing;
    });
    await expect.poll(missingValue).toBe(true);
    // Reset directly while the keyboard focus remains in a segment. The host's
    // delegated prevention stays outside the form; the fixture never intercepts
    // submission or manufactures a reset event.
    await day.focus();
    await form.evaluate(node => (node as HTMLFormElement).reset());
    await expect(day).toBeFocused();
    await expect(day).toHaveAttribute('aria-valuenow', '28');
    await expect.poll(missingValue).toBe(true);
    await form.getByRole('button', { name: 'Reset draft' }).click();
    await expect(form.getByRole('button', { name: 'Reset draft' })).toBeFocused();
    await expect(day).toHaveAttribute('aria-valuenow', '28');
    await expect.poll(missingValue).toBe(true);
    for (const name of [/month/, /year/]) {
      await expect(form.getByRole('spinbutton', { name })).not.toHaveAttribute('aria-valuenow');
    }
    await expect.poll(() => form.evaluate(node => new FormData(node as HTMLFormElement).get('date'))).toBe('');
    await expect(page.getByLabel('Draft change callbacks')).toHaveText('0');
    await page.getByLabel('Prevent incomplete reset').uncheck();
    await form.getByRole('button', { name: 'Reset draft' }).click();
    await expect(day).not.toHaveAttribute('aria-valuenow');
    await expect.poll(missingValue).toBe(true);
    await expect(page.getByLabel('Draft change callbacks')).toHaveText('0');
    expect(errors).toEqual([]);
  });
}
