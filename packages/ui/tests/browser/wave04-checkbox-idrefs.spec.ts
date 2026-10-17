import {expect, test, type Locator} from '@playwright/test';
async function expectMountedDescriptions(input: Locator) {
  expect(await input.evaluate(element => (element.getAttribute('aria-describedby') ?? '')
    .split(/\s+/).filter(Boolean).filter(id => !document.getElementById(id)))).toEqual([]);
}
test('Checkbox error IDREF resolves before validation and after native reset', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/fixtures/?id=migration-proofs-checkbox--fieldset-acceptance&globals=a11y.manual:!true');
  const approval = page.getByRole('checkbox', {name: 'Mixed required approval', exact: true});
  await expectMountedDescriptions(approval);
  await expect(approval).toHaveAccessibleDescription('Mixed presentation does not grant approval.');
  await page.getByRole('button', {name: 'Enable approvals', exact: true}).click();
  await page.getByRole('button', {name: 'Submit approvals', exact: true}).click();
  await expect(approval).toHaveAttribute('aria-invalid', 'true');
  await expectMountedDescriptions(approval);
  await expect(approval).toHaveAccessibleDescription('Mixed presentation does not grant approval. Check approval to submit.');
  await page.getByRole('button', {name: 'Reset approvals', exact: true}).click();
  await expect(approval).not.toHaveAttribute('aria-invalid', 'true');
  await expectMountedDescriptions(approval);
  await expect(approval).toHaveAccessibleDescription('Mixed presentation does not grant approval.');
  await expect(approval).toBeChecked({indeterminate: true});
  expect(errors).toEqual([]);
});
