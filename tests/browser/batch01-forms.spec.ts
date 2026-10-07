import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Page } from '@playwright/test';

const runtimeErrors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
});
test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page), 'browser runtime errors').toEqual([]);
});

async function openForm(page: Page, variant = 'native-acceptance', theme = 'light') {
  await page.goto(`/iframe.html?id=migration-proofs-textfield--${variant}&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
  await expect(page.getByRole('form', { name: 'Native course form' })).toBeVisible();
}
async function values(page: Page) {
  return page.getByRole('form').evaluate(form => Object.fromEntries(new FormData(form as HTMLFormElement)));
}

for (const theme of ['light', 'dark']) {
  test(`native required validation, submit and reset across composed controls: ${theme}`, async ({ page }) => {
    await openForm(page, 'native-acceptance', theme);
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    await test.info().attach(`native-form-axe-${theme}`, { body: JSON.stringify(scan, null, 2), contentType: "application/json" });
    expect(scan.violations).toEqual([]);
    const email = page.getByRole('textbox', { name: 'Contact email', exact: true });
    const terms = page.getByRole('checkbox', { name: 'Accept terms', exact: true });
    const delivery = page.getByRole('radiogroup', { name: 'Delivery', exact: true });
    await expect(email).toHaveAccessibleDescription('Use your course contact address.');
    await expect(email).toHaveAttribute('autocomplete', 'email');
    await expect(terms).toHaveAccessibleDescription('Required to register.');
    await expect(delivery).toHaveAccessibleDescription('Choose a course format.');
    await expect(page.getByRole('switch', { name: 'Course notifications', exact: true })).toHaveAccessibleDescription('Receive course updates.');
    await expect(page.getByRole('checkbox', { name: 'Mixed selection' })).toBeChecked({ indeterminate: true });
    await expect(page.getByRole('radio', { name: 'Unavailable', exact: true }).first()).toBeDisabled();
    await email.fill('invalid');
    await page.getByRole('button', { name: 'Submit course' }).click();
    await expect(page.getByLabel('Submitted form values')).toHaveText('No submission');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription('Use your course contact address. Enter a valid contact email.');
    await expect(terms).toHaveAttribute('aria-invalid', 'true');
    await expect(terms).toHaveAccessibleDescription('Required to register. Accept the terms before submitting.');
    await expect(delivery).toHaveAttribute('aria-invalid', 'true');
    await expect(delivery).toHaveAccessibleDescription('Choose a course format. Choose a delivery format.');
    await email.fill('updated@example.com');
    await terms.focus(); await page.keyboard.press('Space');
    const self = page.getByRole('radio', { name: 'Self paced', exact: true }).first();
    await self.focus(); await page.keyboard.press('Space'); await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('radio', { name: 'Live', exact: true }).first()).toBeChecked();
    const notifications = page.getByRole('switch', { name: 'Course notifications', exact: true });
    await notifications.focus(); await page.keyboard.press('Space');
    await page.getByRole('textbox', { name: 'Controlled title' }).fill('New controlled course');
    await page.getByText('Controlled approval', { exact: true }).click();
    await page.getByText('Controlled updates', { exact: true }).click();
    await page.getByText('Controlled Live', { exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Read only reference' })).toHaveAttribute('readonly', '');
    const expected = { email: 'updated@example.com', terms: 'accepted', delivery: 'live', mixed: 'selected', readonlyConsent: 'accepted', readonlyNotifications: 'enabled', readonlyDelivery: 'self', reference: 'COURSE-42', controlledTitle: 'New controlled course', controlledDelivery: 'live' };
    expect(await values(page)).toEqual(expected);
    await page.getByRole('button', { name: 'Submit course' }).click();
    await expect.poll(async () => Object.fromEntries(JSON.parse((await page.getByLabel('Submitted form values').textContent())!))).toEqual(expected);
    await page.getByRole('button', { name: 'Reset course' }).click();
    await expect(email).toHaveValue('learner@example.com');
    await expect(terms).not.toBeChecked();
    await expect(notifications).toBeChecked();
    await expect(delivery).not.toHaveAttribute('aria-invalid', 'true');
    await expect(email).not.toHaveAttribute('aria-invalid', 'true');
    await expect(terms).not.toHaveAttribute('aria-invalid', 'true');
    await expect(terms).toHaveAccessibleDescription('Required to register.');
    expect(await values(page)).toEqual({ email: 'learner@example.com', notifications: 'enabled', mixed: 'selected', readonlyConsent: 'accepted', readonlyNotifications: 'enabled', readonlyDelivery: 'self', reference: 'COURSE-42', controlledTitle: 'Controlled course', controlledApproval: 'approved', controlledUpdates: 'enabled', controlledDelivery: 'self' });
  });
}

test('controlled host authority survives editing and native reset', async ({ page }) => {
  await openForm(page, 'controlled-authority');
  const title = page.getByRole('textbox', { name: 'Controlled title' });
  const approval = page.getByRole('checkbox', { name: 'Controlled approval' });
  const updates = page.getByRole('switch', { name: 'Controlled updates' });
  const live = page.getByRole('radio', { name: 'Controlled Live' }).first();
  await title.fill('Rejected draft');
  // Click rather than check/uncheck: the host deliberately rejects requests.
  await page.getByText('Controlled approval', { exact: true }).click();
  await page.getByText('Controlled updates', { exact: true }).click();
  await page.getByText('Controlled Live', { exact: true }).click();
  await expect(title).toHaveValue('Controlled course');
  await expect(approval).toBeChecked(); await expect(updates).toBeChecked();
  await expect(live).not.toBeChecked();
  await page.getByRole('button', { name: 'Reset course' }).click();
  await expect(title).toHaveValue('Controlled course');
  await expect(approval).toBeChecked(); await expect(updates).toBeChecked();
  expect(await values(page)).toMatchObject({ controlledTitle: 'Controlled course', controlledApproval: 'approved', controlledUpdates: 'enabled', controlledDelivery: 'self' });
});

test('read-only values stay focusable and submitted while disabled values are omitted', async ({ page }) => {
  await openForm(page);
  const email = page.getByRole('textbox', { name: 'Read only reference' });
  await email.focus(); await page.keyboard.press('End'); await page.keyboard.type('changed');
  await expect(email).toHaveValue('COURSE-42');
  const consent = page.getByRole('checkbox', { name: 'Read only consent' });
  const notifications = page.getByRole('switch', { name: 'Read only notifications' });
  for (const control of [consent, notifications]) {
    await control.focus(); await expect(control).toBeFocused();
    await page.keyboard.press('Space'); await expect(control).toBeChecked();
  }
  const self = page.getByRole('radio', { name: 'Read only Self paced' });
  await self.focus(); await expect(self).toBeFocused(); await page.keyboard.press('ArrowDown');
  await page.getByText('Read only Live', { exact: true }).click(); await expect(self).toBeChecked();
  await expect(page.getByRole('checkbox', { name: 'Disabled consent' })).toBeDisabled();
  await expect(page.getByRole('switch', { name: 'Disabled notifications' })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: 'Disabled reference' })).toBeDisabled();
  const data = await values(page);
  expect(data).toMatchObject({ reference: 'COURSE-42', readonlyConsent: 'accepted', readonlyNotifications: 'enabled', readonlyDelivery: 'self' });
  for (const name of ['disabledConsent', 'disabledNotifications', 'disabledReference', 'disabledDelivery']) expect(data).not.toHaveProperty(name);
});
