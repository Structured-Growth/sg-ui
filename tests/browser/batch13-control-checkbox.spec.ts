import { test, expect } from '@playwright/test';

test('mixed required inputs honor fieldset transitions and host rejection', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/iframe.html?id=migration-proofs-checkbox--fieldset-acceptance&viewMode=story&globals=a11y.manual:!true');
  const form = page.getByRole('form', { name: 'Checkbox fieldset form' });
  const approval = page.getByRole('checkbox', { name: 'Mixed required approval', exact: true });
  const granted = page.getByRole('checkbox', { name: 'Mixed granted approval', exact: true });
  const rejected = page.getByRole('checkbox', { name: 'Host rejected approval', exact: true });
  await expect(approval).toBeDisabled();
  await page.getByText('Mixed required approval', { exact: true }).click();
  await page.getByText('Host rejected approval', { exact: true }).click();
  await expect(page.getByLabel('Rejected requests')).toHaveText('0');
  await page.getByRole('button', { name: 'Submit approvals' }).click();
  await expect(page.getByLabel('Submitted approvals')).toHaveText('{}');
  await page.getByRole('button', { name: 'Inspect ref' }).click();
  await expect(page.getByLabel('Ref targets')).toHaveText('LABEL/INPUT');
  await page.getByRole('button', { name: 'Enable approvals' }).click();
  await expect(approval).toBeEnabled();
  await expect(approval).toBeChecked({ indeterminate: true });
  await expect(granted).toBeChecked({ indeterminate: true });
  expect(await granted.evaluate(node => (node as HTMLInputElement).validity.valueMissing)).toBe(false);
  expect(await approval.evaluate(node => (node as HTMLInputElement).validity.valueMissing)).toBe(true);
  await page.getByRole('button', { name: 'Submit approvals' }).click();
  await expect(page.getByLabel('Submitted approvals')).toHaveText('{}');
  await expect(approval).toBeFocused();
  await expect(approval).toHaveAccessibleDescription('Mixed presentation does not grant approval. Check approval to submit.');
  await page.keyboard.press('Space');
  await page.getByText('Host rejected approval', { exact: true }).click();
  await expect(page.getByLabel('Rejected requests')).toHaveText('1');
  expect(await rejected.evaluate(node => (node as HTMLInputElement).checked)).toBe(false);
  await expect(rejected).toBeChecked({ indeterminate: true });
  await page.getByRole('button', { name: 'Submit approvals' }).click();
  await expect(page.getByLabel('Submitted approvals')).toHaveText('{"approval":"yes","granted":"yes"}');
  await page.getByRole('button', { name: 'Reset approvals' }).click();
  expect(await approval.evaluate(node => (node as HTMLInputElement).checked)).toBe(false);
  await expect(approval).toBeChecked({ indeterminate: true });
  await page.getByRole('button', { name: 'Disable approvals' }).click();
  await page.getByRole('button', { name: 'Submit approvals' }).click();
  await expect(page.getByLabel('Submitted approvals')).toHaveText('{}');
  await expect(page.getByLabel('Rejected requests')).toHaveText('1');
  expect(await form.evaluate(node => (node as HTMLFormElement).checkValidity())).toBe(true);
  expect(errors).toEqual([]);
});

test('delegated prevented reset preserves in-form policy and edited values without callbacks', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/iframe.html?id=migration-proofs-checkbox--reset-authority&viewMode=story&globals=a11y.manual:!true');
  const form = page.getByRole('form', { name: 'Checkbox reset authority' });
  const policy = page.getByRole('checkbox', { name: 'Prevent checkbox reset', exact: true });
  const uncontrolled = page.getByRole('checkbox', { name: 'Uncontrolled reset approval', exact: true });
  const controlled = page.getByRole('checkbox', { name: 'Controlled reset approval', exact: true });
  const events = page.getByLabel('Checkbox reset events');
  for (const name of ['Prevent checkbox reset', 'Uncontrolled reset approval', 'Controlled reset approval']) {
    await page.getByText(name, { exact: true }).click();
  }
  await expect(events).toHaveText('["policy:true","uncontrolled:true","controlled:true"]');
  await page.getByRole('button', { name: 'Clear reset events' }).click();
  await page.getByRole('button', { name: 'Reset checkboxes' }).click();
  await expect(events).toHaveText('["reset:prevented"]');
  for (const input of [policy, uncontrolled, controlled]) await expect(input).toBeChecked();
  expect(await form.evaluate(node => Object.fromEntries(new FormData(node as HTMLFormElement)))).toEqual({ prevent: 'on', uncontrolled: 'on', controlled: 'on' });
  // Repeated native reset keeps the policy in the form authoritative.
  await page.getByRole('button', { name: 'Reset checkboxes' }).click();
  await expect(events).toHaveText('["reset:prevented","reset:prevented"]');
  await expect(policy).toBeChecked();
  await page.getByText('Prevent checkbox reset', { exact: true }).click();
  await page.getByRole('button', { name: 'Clear reset events' }).click();
  await page.getByRole('button', { name: 'Reset checkboxes' }).click();
  await expect(events).toHaveText('["reset:accepted"]');
  for (const input of [policy, uncontrolled, controlled]) await expect(input).not.toBeChecked();
  expect(await form.evaluate(node => Object.fromEntries(new FormData(node as HTMLFormElement)))).toEqual({});
  expect(errors).toEqual([]);
});
