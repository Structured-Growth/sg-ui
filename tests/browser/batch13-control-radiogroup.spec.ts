import { test, expect, type Page } from '@playwright/test';

const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  await page.goto('/iframe.html?id=migration-proofs-radiogroup--dynamic-options&viewMode=story&globals=a11y.manual:!true');
  await expect(page.getByRole('form', { name: 'Dynamic radio form' })).toBeVisible();
});
test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page), 'browser runtime errors').toEqual([]);
});

for (const transition of ['Remove', 'Disable']) {
  test(`${transition} selected option preserves host value and native keyboard entry`, async ({ page }) => {
    const action = page.getByRole('button', { name: `${transition} selected option` });
    await action.click();
    await expect(action).toBeFocused();
    await expect(page.getByLabel('Host delivery value')).toHaveText('self');
    await expect(page.getByLabel('Delivery requests')).toHaveText('0');
    await page.getByRole('button', { name: 'Before delivery', exact: true }).click();
    await page.keyboard.press('Tab');
    const live = page.getByRole('radio', { name: 'Live', exact: true });
    await expect(live).toBeFocused();
    await expect(live).not.toBeChecked();
    await expect(page.getByLabel('Delivery requests')).toHaveText('0');
    await page.getByRole('button', { name: 'Restore options' }).click();
    await expect(page.getByRole('radio', { name: 'Self paced', exact: true })).toBeChecked();
    await action.click();
    await page.getByRole('button', { name: 'Before delivery', exact: true }).click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    await expect(live).toBeChecked();
    await expect(page.getByLabel('Delivery requests')).toHaveText('1');
    await expect(page.getByRole('radio', { name: 'Backup self paced' })).toBeChecked();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('radio', { name: 'Review', exact: true })).toBeFocused();
    await expect(page.getByRole('radio', { name: 'Review', exact: true })).toBeChecked();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'After delivery', exact: true })).toBeFocused();
  });
}

test('removed selection blocks required submit; distinct names and host empty reset survive native submission', async ({ page }) => {
  await page.getByRole('button', { name: 'Remove selected option' }).click();
  const group = page.getByRole('radiogroup', { name: 'Delivery', exact: true });
  const form = page.getByRole('form');
  expect(await form.evaluate(node => Object.fromEntries(new FormData(node as HTMLFormElement)))).toEqual({ backupDelivery: 'self' });
  await page.getByRole('button', { name: 'Submit formats' }).click();
  await expect(page.getByLabel('Submitted formats')).toHaveText('No submission');
  await expect(group).toHaveAttribute('aria-invalid', 'true');
  await expect(group).toHaveAccessibleDescription('Choose an available delivery format. Choose a delivery format.');
  await page.getByText('Live', { exact: true }).click();
  await page.getByRole('button', { name: 'Submit formats' }).click();
  await expect(page.getByLabel('Submitted formats')).toHaveText('{"delivery":"live","backupDelivery":"self"}');
  await page.getByRole('button', { name: 'Reset formats' }).click();
  await expect(page.getByLabel('Host delivery value')).toHaveText('empty');
  await expect(page.getByRole('radio', { name: 'Live', exact: true })).not.toBeChecked();
  expect(await form.evaluate(node => Object.fromEntries(new FormData(node as HTMLFormElement)))).toEqual({ backupDelivery: 'self' });
  await page.getByRole('button', { name: 'Submit formats' }).click();
  await expect(group).toHaveAttribute('aria-invalid', 'true');
  await page.getByRole('button', { name: 'Before delivery', exact: true }).click();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('radio', { name: 'Live', exact: true })).toBeFocused();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: 'Submit formats' }).click();
  await expect(group).not.toHaveAttribute('aria-invalid', 'true');
});
