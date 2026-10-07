import { expect, test, type Page } from '@playwright/test';

let runtimeErrors: string[] = [];
test.beforeEach(({ page }) => {
  runtimeErrors = [];
  page.on('pageerror', error => runtimeErrors.push(error.message));
});
test.afterEach(() => expect(runtimeErrors, 'native DatePicker runtime errors').toEqual([]));

async function story(page: Page, name: string) {
  await page.goto(`/iframe.html?id=migration-proofs-datepicker-native-transactions--${name}&viewMode=story&globals=locale:en-US;a11y.manual:!true`);
  await expect(page.getByRole('form', { name: 'Date transaction form' })).toBeVisible();
}
const form = (page: Page) => page.getByRole('form', { name: 'Date transaction form' });
const civil = (page: Page) => form(page).evaluate(node => new FormData(node as HTMLFormElement).get('date'));
const requests = (page: Page) => page.getByLabel('Date requests');
const trigger = (page: Page) => page.getByRole('button', { name: 'Choose Course date', exact: true });
const day = (page: Page) => form(page).getByRole('spinbutton', { name: /day/ });

test('partial keyboard segments survive blur without a civil commit and block native required submission', async ({ page }) => {
  await story(page, 'partial-required-edit');
  await day(page).click();
  await page.keyboard.type('29');
  await page.getByRole('button', { name: 'Leave date field' }).click();
  await expect(day(page)).toHaveAttribute('aria-valuenow', '29');
  expect(await civil(page)).toBe('');
  await expect(requests(page)).toHaveText('[]');
  await page.getByRole('button', { name: 'Submit course date' }).click();
  await expect(page.getByLabel('Submitted course date')).toHaveText('Not submitted');
  expect(await form(page).evaluate(node => {
    const input = (node as HTMLFormElement).elements.namedItem('date');
    return input instanceof HTMLInputElement && input.validity.valueMissing;
  })).toBe(true);
  await expect(day(page)).toHaveAttribute('aria-invalid', 'true');
  await expect(form(page).getByText('Enter a complete course date within the booking window')).toBeVisible();
  for (const [name, text] of [[/month/, '02'], [/year/, '2024']] as const) {
    await form(page).getByRole('spinbutton', { name }).click();
    await page.keyboard.type(text);
  }
  await page.getByRole('button', { name: 'Submit course date' }).click();
  await expect(page.getByLabel('Submitted course date')).toHaveText('2024-02-29');
  await expect(requests(page)).toHaveText('["0020-02-29","2024-02-29"]');
  await expect(day(page)).not.toHaveAttribute('aria-invalid', 'true');
});

test('a complete out-of-window segment edit commits a civil request but fails native validation', async ({ page }) => {
  await story(page, 'complete-civil-edit');
  await day(page).click();
  await page.keyboard.type('27');
  await page.getByRole('button', { name: 'Leave date field' }).click();
  expect(await civil(page)).toBe('2024-02-27');
  await expect(requests(page)).toHaveText('["2024-02-02","2024-02-27"]');
  await page.getByRole('button', { name: 'Submit course date' }).click();
  await expect(page.getByLabel('Submitted course date')).toHaveText('Not submitted');
  await expect(day(page)).toHaveAttribute('aria-invalid', 'true');
  expect(await form(page).evaluate(node => {
    const input = (node as HTMLFormElement).elements.namedItem('date');
    return input instanceof HTMLInputElement && !input.validity.valid;
  })).toBe(true);
  await expect(form(page).getByText('Enter a complete course date within the booking window')).toBeVisible();
});

for (const timezoneId of ['America/Chicago', 'Asia/Tokyo']) {
  test.describe(`civil DatePicker transactions in ${timezoneId}`, () => {
    test.use({ timezoneId });
    test('typed leap day submits and reopens unchanged; keyboard calendar commit updates every segment', async ({ page }) => {
      await story(page, 'complete-civil-edit');
      await day(page).click();
      await page.keyboard.type('29');
      await page.getByRole('button', { name: 'Submit course date' }).click();
      await expect(page.getByLabel('Submitted course date')).toHaveText('2024-02-29');
      await expect(requests(page)).toHaveText('["2024-02-02","2024-02-29"]');
      await trigger(page).click();
      const leap = page.getByRole('button', { name: /Thursday, February 29, 2024/ });
      await expect(page.getByRole('gridcell').filter({ has: leap })).toHaveAttribute('aria-selected', 'true');
      await leap.focus();
      await expect(leap).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(trigger(page)).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('gridcell').filter({ has: leap })).toHaveAttribute('aria-selected', 'true');
      await leap.focus();
      await expect(leap).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(page.getByRole('button', { name: /Friday, March 1, 2024/ })).toBeFocused();
      // Navigation is focus only; activation owns the commit.
      expect(await civil(page)).toBe('2024-02-29');
      await expect(requests(page)).toHaveText('["2024-02-02","2024-02-29"]');
      await page.keyboard.press('Enter');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(trigger(page)).toBeFocused();
      expect(await civil(page)).toBe('2024-03-01');
      for (const [name, value] of [[/month/, '3'], [/day/, '1'], [/year/, '2024']] as const) {
        await expect(form(page).getByRole('spinbutton', { name })).toHaveAttribute('aria-valuenow', value);
      }
      await expect(requests(page)).toHaveText('["2024-02-02","2024-02-29","2024-03-01"]');
      await page.getByRole('button', { name: 'Submit course date' }).click();
      await expect(page.getByLabel('Submitted course date')).toHaveText('2024-03-01');
      await trigger(page).click();
      await expect(page.getByRole('gridcell').filter({ has: page.getByRole('button', { name: /Friday, March 1, 2024/ }) })).toHaveAttribute('aria-selected', 'true');
    });
  });
}

test('rejecting controlled host keeps field, calendar and FormData authoritative after both edit sources', async ({ page }) => {
  await story(page, 'controlled-host-reject');
  await day(page).click();
  await page.keyboard.press('ArrowUp');
  await page.getByRole('button', { name: 'Leave date field' }).click();
  await expect(requests(page)).toHaveText('["2024-02-29"]');
  await expect(day(page)).toHaveAttribute('aria-valuenow', '28');
  expect(await civil(page)).toBe('2024-02-28');
  await trigger(page).click();
  await expect(page.getByRole('gridcell').filter({ has: page.getByRole('button', { name: /Wednesday, February 28, 2024/ }) })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: /Thursday, February 29, 2024/ }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(requests(page)).toHaveText('["2024-02-29","2024-02-29"]');
  await expect(day(page)).toHaveAttribute('aria-valuenow', '28');
  await page.getByRole('button', { name: 'Submit course date' }).click();
  await expect(page.getByLabel('Submitted course date')).toHaveText('2024-02-28');
  await trigger(page).click();
  await expect(page.getByRole('gridcell').filter({ has: page.getByRole('button', { name: /Wednesday, February 28, 2024/ }) })).toHaveAttribute('aria-selected', 'true');
});

test('observes real full-date paste before classifying support', async ({ page }, info) => {
  await story(page, 'complete-civil-edit');
  await page.evaluate(() => {
    const events: { trusted: boolean; plain: string }[] = [];
    (window as unknown as { datePasteEvents: typeof events }).datePasteEvents = events;
    document.addEventListener('paste', event => {
      events.push({ trusted: event.isTrusted, plain: event.clipboardData?.getData('text/plain') ?? '' });
    });
  });
  await page.getByRole('textbox', { name: 'Clipboard date source' }).click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('ControlOrMeta+C');
  await form(page).getByRole('spinbutton', { name: /month/ }).click();
  await page.keyboard.press('ControlOrMeta+V');
  await page.getByRole('button', { name: 'Leave date field' }).click();
  const events = await page.evaluate(() => (window as unknown as { datePasteEvents: { trusted: boolean; plain: string }[] }).datePasteEvents);
  expect(events).toContainEqual({ trusted: true, plain: '02/29/2024' });
  const value = await civil(page);
  const ledger = await requests(page).textContent();
  await info.attach('native-date-paste-observation', {
    body: JSON.stringify({ events, value, ledger, supported: value === '2024-02-29' }), contentType: 'application/json',
  });
  // This is an observation, not a promise of upstream paste support. A supported
  // full-date paste must use the same civil callback/form contract; an ignored
  // paste must preserve the existing value. Synthetic events are not substituted.
  expect(['2024-02-28', '2024-02-29']).toContain(value);
  await expect(requests(page)).toHaveText(value === '2024-02-29' ? '["2024-02-29"]' : '[]');
});
