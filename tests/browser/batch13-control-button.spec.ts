import { expect, test } from '@playwright/test';

test('pending reset suppresses native defaults and resumes with the latest host press', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text());
  });
  await page.goto('/iframe.html?id=migration-proofs-button--native-form-transitions&viewMode=story&globals=a11y.manual:!true');
  const title = page.getByRole('textbox', { name: 'Course title' });
  const reset = page.getByRole('button', { name: 'Reset course', exact: true });
  const submit = page.getByRole('button', { name: 'Submit course', exact: true });
  const events = page.getByLabel('Button events');
  await title.fill('Draft course');
  await page.getByRole('button', { name: 'Toggle pending' }).click();
  await page.getByRole('button', { name: 'Replace host press' }).click();
  await reset.focus();
  await expect(reset).toBeFocused();
  await expect(reset).toHaveAttribute('aria-disabled', 'true');
  // aria-disabled deliberately retains native focus; use physical input to exercise its defaults.
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  const bounds = (await reset.boundingBox())!;
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(title).toHaveValue('Draft course');
  await expect(events).toHaveText('No events');
  await expect(reset).toBeFocused();
  await submit.focus();
  await page.keyboard.press('Enter');
  await expect(events).toHaveText('No events');
  await page.getByRole('button', { name: 'Toggle pending' }).click();
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await expect(reset).toBeDisabled();
  await expect(submit).toBeDisabled();
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(title).toHaveValue('Draft course');
  await expect(events).toHaveText('No events');
  await page.getByRole('button', { name: 'Toggle disabled' }).click();
  await reset.focus();
  await page.keyboard.press('Space');
  await expect(events).toHaveText('reset press 2 | reset');
  await expect(title).toHaveValue('Original course');
  await submit.focus();
  await page.keyboard.press('Enter');
  await expect(events).toHaveText('reset press 2 | reset | submit press 2 | submit');
  expect(errors).toEqual([]);
});
