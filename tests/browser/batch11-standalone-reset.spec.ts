import { test, expect, type Page } from '@playwright/test';
async function values(page: Page) {
  return page.locator('form').evaluate(form => Object.fromEntries(new FormData(form as HTMLFormElement)));
}
for (const field of ['textfield', 'datefield']) {
  test(`${field} native and programmatic resets honor delegated prevention and stay silent`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/iframe.html?id=migration-proofs-${field}--standalone-reset&viewMode=story&globals=a11y.manual:!true`);
    const initial = field === 'textfield' ? 'Initial' : '2024-02-28';
    const edited = field === 'textfield' ? 'Changed' : '2024-02-29';
    const controlled = field === 'textfield' ? 'Host title' : '2024-03-10';
    if (field === 'textfield') await page.getByRole('textbox', { name: 'Uncontrolled field', exact: true }).fill(edited);
    else {
      await page.getByRole('group', { name: 'Uncontrolled field', exact: true }).getByRole('spinbutton', { name: /day/ }).click();
      await page.keyboard.press('ArrowUp');
    }
    await expect.poll(() => values(page)).toEqual({ uncontrolled: edited, controlled });
    const day = field === 'datefield' ? page.getByRole('group', { name: 'Uncontrolled field', exact: true }).getByRole('spinbutton', { name: /day/ }) : null;
    const controlledDay = field === 'datefield' ? page.getByRole('group', { name: 'Controlled field', exact: true }).getByRole('spinbutton', { name: /day/ }) : null;
    const callbacks = await page.getByLabel('Change callbacks').textContent();
    await page.getByLabel('Prevent form reset').check();
    await page.getByRole('button', { name: 'Reset fields' }).click();
    await expect.poll(() => values(page)).toEqual({ uncontrolled: edited, controlled });
    await page.locator('form').evaluate(form => (form as HTMLFormElement).reset());
    await expect.poll(() => values(page)).toEqual({ uncontrolled: edited, controlled });
    await expect(page.getByLabel('Change callbacks')).toHaveText(callbacks!);
    if (controlledDay) await expect(controlledDay).toHaveAttribute('aria-valuenow', '10');
    if (day) await expect(day).toHaveAttribute('aria-valuenow', '29');
    await page.getByLabel('Prevent form reset').uncheck();
    await page.getByRole('button', { name: 'Reset fields' }).click();
    await expect.poll(() => values(page)).toEqual({ uncontrolled: initial, controlled });
    await expect(page.getByLabel('Change callbacks')).toHaveText(callbacks!);
    if (controlledDay) await expect(controlledDay).toHaveAttribute('aria-valuenow', '10');
    await page.locator('form').evaluate(form => (form as HTMLFormElement).reset());
    await expect.poll(() => values(page)).toEqual({ uncontrolled: initial, controlled });
    await expect(page.getByLabel('Change callbacks')).toHaveText(callbacks!);
    if (controlledDay) await expect(controlledDay).toHaveAttribute('aria-valuenow', '10');
    if (day) await expect(day).toHaveAttribute('aria-valuenow', '28');
    expect(errors).toEqual([]);
  });
}

test('prevented text reset preserves displayed native validation; accepted reset clears it', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-textfield--prevented-validation-reset&viewMode=story&globals=a11y.manual:!true');
  const input = page.getByRole('textbox', { name: 'Required course', exact: true });
  await input.fill(''); await page.getByRole('button', { name: 'Validate' }).click();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('button', { name: 'Reset validation' }).click();
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(input).toHaveValue('');
  await page.getByLabel('Prevent form reset').uncheck();
  await page.getByRole('button', { name: 'Reset validation' }).click();
  await expect(input).toHaveValue('Initial');
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
});
