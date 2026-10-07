import { test, expect, type Page } from '@playwright/test';

const browserErrors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text());
  });
});
test.afterEach(({ page }) => {
  expect(browserErrors.get(page), 'browser runtime errors').toEqual([]);
});

async function story(page: Page, id: string) {
  await page.goto(`/iframe.html?id=migration-proofs-${id}&viewMode=story&globals=a11y.manual:!true`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}
const preview = (page: Page) => page.locator('[data-sgui-part="date-range-preview"]');
const draft = (page: Page) => page.locator('[data-sgui-part="date-range-draft"]');
const read = async (page: Page, value: string) => {
  await page.getByRole('button', { name: 'Read committed form dates', exact: true }).click();
  await expect(page.getByLabel('Submitted dates')).toHaveText(value);
};

for (const timezoneId of ['America/Chicago', 'Asia/Tokyo']) {
  test.describe(`civil range in ${timezoneId}`, () => {
    test.use({ timezoneId });
    test('keyboard preview crosses leap/month boundary; only Apply changes form dates', async ({ page }) => {
      await story(page, 'daterangeselector--keyboard-range-preview');
      await page.getByRole('button', { name: /Wednesday, February 28, 2024/ }).focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('button', { name: /Thursday, February 29, 2024/ })).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(page.getByRole('button', { name: /Friday, March 1, 2024/ })).toBeFocused();
      await expect(preview(page)).toHaveText('Range preview: 2024-02-28 – 2024-03-01. Choose an end date to finish.');
      await expect(page.getByRole('button', { name: 'Apply', exact: true })).toBeDisabled();
      await expect(draft(page)).toHaveText('2024-02-28 – 2024-02-29');
      // Read hidden values while leaving the native keyboard focus on the endpoint.
      expect(await page.locator('form').evaluate(form => {
        const data = new FormData(form as HTMLFormElement);
        return [data.get('range.start'), data.get('range.end')];
      })).toEqual(['2024-02-28', '2024-02-29']);
      await page.keyboard.press('Enter');
      await expect(preview(page)).toHaveCount(0);
      await expect(draft(page)).toHaveText('2024-02-28 – 2024-03-01');
      await read(page, '2024-02-28 – 2024-02-29');
      await page.getByRole('button', { name: 'Apply', exact: true }).click();
      await read(page, '2024-02-28 – 2024-03-01');
    });
  });
}

test('standalone Cancel/Clear/reset end previews; prevented reset preserves the draft', async ({ page }) => {
  await story(page, 'daterangeselector--keyboard-range-preview');
  await page.getByLabel('Prevent form reset').check();
  await page.getByRole('button', { name: /Wednesday, February 28, 2024/ }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(preview(page)).toContainText('2024-02-27 – 2024-02-28');
  await page.locator('form').evaluate(form => (form as HTMLFormElement).reset());
  await expect(preview(page)).toContainText('2024-02-27 – 2024-02-28');
  await expect(page.getByRole('button', { name: 'Apply', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(preview(page)).toHaveCount(0);
  await expect(draft(page)).toHaveText('2024-02-28 – 2024-02-29');
  await page.getByLabel('Prevent form reset').uncheck();
  await page.getByRole('button', { name: 'March reporting period', exact: true }).click();
  await page.getByLabel('Prevent form reset').check();
  await page.getByRole('button', { name: 'Reset dates', exact: true }).click();
  await expect(draft(page)).toHaveText('2024-03-01 – 2024-03-31');
  await expect(page.getByRole('spinbutton', { name: /day/ }).nth(1)).toHaveAttribute('aria-valuenow', '31');
  await read(page, '2024-02-28 – 2024-02-29');
  await page.getByLabel('Prevent form reset').uncheck();
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await read(page, '2024-03-01 – 2024-03-31');
  await page.getByRole('button', { name: 'Reset dates', exact: true }).click();
  await expect(draft(page)).toHaveText('2024-02-28 – 2024-02-29');
  await read(page, '2024-02-28 – 2024-02-29');
  await page.getByRole('button', { name: /Wednesday, February 28, 2024/ }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Read committed form dates', exact: true }).focus();
  await expect(preview(page)).toHaveCount(0);
  await expect(draft(page)).toHaveText('2024-02-28 – 2024-02-29');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(preview(page)).toHaveCount(0);
  await expect(draft(page)).toHaveText('No dates selected');
  await read(page, '2024-02-28 – 2024-02-29');
});

test('range picker Escape/Cancel discard drafts, Apply restores focus and native reset restores defaults', async ({ page }) => {
  await story(page, 'daterangepicker--native-form-reset');
  const trigger = page.getByRole('button', { name: 'Choose Reporting dates', exact: true });
  await trigger.click();
  await page.getByRole('button', { name: 'March', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(draft(page)).toHaveText('2024-02-01 – 2024-02-29');
  await page.getByRole('button', { name: 'March', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(trigger).toBeFocused();
  await read(page, '2024-02-01 – 2024-02-29');
  await trigger.click();
  await page.getByRole('button', { name: 'March', exact: true }).click();
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(trigger).toBeFocused();
  await read(page, '2024-03-01 – 2024-03-31');
  await page.getByLabel('Prevent form reset').check();
  await page.getByRole('button', { name: 'Reset dates', exact: true }).click();
  await read(page, '2024-03-01 – 2024-03-31');
  await page.getByLabel('Prevent form reset').uncheck();
  await trigger.click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Reset dates', exact: true }).click();
  await read(page, '2024-02-01 – 2024-02-29');
  await trigger.click();
  await expect(draft(page)).toHaveText('2024-02-01 – 2024-02-29');
});

test('keyboard range traversal stops before an unavailable interior date', async ({ page }) => {
  await story(page, 'daterangeselector--availability');
  await page.getByRole('button', { name: /February 14, 2024/ }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: /February 14, 2024/ })).toBeFocused();
  await expect(page.getByRole('button', { name: /February 16, 2024/ })).toHaveAttribute('aria-disabled', 'true');
  await expect(preview(page)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Apply', exact: true })).toBeDisabled();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Committed booking dates')).toHaveText('No committed dates');
  await expect(preview(page)).toHaveCount(0);
  await expect(draft(page)).toHaveText('2024-02-14 – 2024-02-14');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(page.getByLabel('Committed booking dates')).toHaveText('2024-02-14 – 2024-02-14');
});
