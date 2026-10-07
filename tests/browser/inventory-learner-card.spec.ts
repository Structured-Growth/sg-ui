import { expect, test } from '@playwright/test';

const story = '/iframe.html?id=classes-learnerclasscard--native-due-actions&viewMode=story&globals=a11y.manual:!true';
test.use({ timezoneId: 'America/Chicago', locale: 'en-US' });
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-01-02T18:00:00Z'));
  await page.goto(story);
  await expect(page.getByRole('heading', { name: 'Defense Against the Dark Arts' })).toBeVisible();
});

for (const [locale, literalAbsolute] of [
  ['en-US', 'Due Jan 1 at 9:05 AM'],
  ['de-DE', 'Due 1. Jan. at 9:05'],
  ['ar-EG', 'Due ١ يناير at ٩:٠٥ ص'],
]) {
  test(`browser ICU ${locale} replaces due text while the same action retains keyboard focus`, async ({ page }) => {
    const details = page.getByRole('link', { name: 'Details', exact: true });
    await page.getByLabel('Host locale').selectOption(locale);
    let absolute = literalAbsolute;
    if (locale === 'de-DE') {
      // ICU may pad a German numeric hour (Firefox: 09, Chromium/WebKit: 9).
      // Read the browser's formatting policy independently of the card formatter,
      // while requiring the exact local hour/minute and complete literal date.
      const time = await page.evaluate(() => new Intl.DateTimeFormat('de-DE', {
        hour: 'numeric', minute: '2-digit', timeZone: 'America/Chicago',
      }).format(new Date('2026-01-01T15:05:00Z')));
      expect(time).toMatch(/^0?9:05$/);
      absolute = `Due 1. Jan. at ${time}`;
    }
    await expect(page.getByText(`First: ${absolute}`, { exact: true })).toBeVisible();
    // Observe node identity and focus across host updates without moving focus to a fixture control.
    const identity = await details.elementHandle();
    await details.focus();
    await page.getByRole('button', { name: 'Replace translation', exact: true }).evaluate((button: HTMLButtonElement) => button.click());
    await expect(page.getByText(`Replacement: ${absolute}`, { exact: true })).toBeVisible();
    await expect(details).toBeFocused();
    expect(await details.evaluate((node, previous) => node === previous, identity)).toBe(true);
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Details requests')).toHaveText('/course/details');
    await expect(details).toBeFocused();
    await page.getByRole('button', { name: 'Use imminent due date', exact: true }).click();
    await expect(page.getByText('Replacement: Due today in 25 minutes', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Use invalid due date', exact: true }).click();
    await expect(page.getByText('Replacement: Due date unavailable', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Use lookup fallback', exact: true }).click();
    await expect(page.getByText('Due date unavailable', { exact: true })).toBeVisible();
  });
}

test('invalid host locale and failed lookup retain English browser date fallback', async ({ page }) => {
  await page.getByLabel('Host locale').selectOption('bad_locale');
  await page.getByRole('button', { name: 'Use lookup fallback', exact: true }).click();
  await expect(page.getByText('Due Jan 1 at 9:05 AM', { exact: true })).toBeVisible();
});

for (const destinations of ['both', 'continue only']) {
  test(`${destinations} preserves Details route and native isolated Continue activation`, async ({ page, context, browserName }) => {
    await context.route('**/course/continue', route => route.fulfill({ contentType: 'text/html', body: '<title>Host course destination</title>' }));
    await page.getByLabel('Host destinations').selectOption(destinations);
    const details = page.getByRole('link', { name: 'Details', exact: true });
    const continueLink = page.getByRole('link', { name: 'Continue', exact: true });
    const expectedDetails = destinations === 'both' ? '/course/details' : '/course/continue';
    await expect(details).toHaveAttribute('href', expectedDetails);
    await details.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Details requests')).toHaveText(expectedDetails);
    await expect(details).toBeFocused();
    // macOS WebKit's native link traversal uses Option+Tab by default.
    const linkTab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
    const reverseLinkTab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Shift+Tab' : 'Shift+Tab';
    await page.keyboard.press(linkTab);
    await expect(continueLink).toBeFocused();
    await page.keyboard.press(reverseLinkTab);
    await expect(details).toBeFocused();
    await page.keyboard.press(linkTab);
    await expect(continueLink).toBeFocused();
    await expect(continueLink).toHaveAttribute('href', '/course/continue');
    await expect(continueLink).toHaveAttribute('target', '_blank');
    await expect(continueLink).toHaveAttribute('rel', 'noopener noreferrer');
    const popupPromise = context.waitForEvent('page');
    await page.keyboard.press('Enter');
    const popup = await popupPromise;
    await popup.waitForLoadState();
    await expect(popup).toHaveURL(/\/course\/continue$/);
    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    await expect(page.getByLabel('Continue requests')).toHaveText('1');
    await expect(page.getByLabel('Details requests')).toHaveText(expectedDetails);
    await popup.close();
    await expect(continueLink).toBeFocused();
  });
}

test('no destinations exposes two keyboard buttons and invokes Continue once per native activation', async ({ page }) => {
  await page.getByLabel('Host destinations').selectOption('none');
  const details = page.getByRole('button', { name: 'Details', exact: true });
  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(page.getByRole('link', { name: /^(Details|Continue)$/ })).toHaveCount(0);
  await details.focus();
  await page.keyboard.press('Enter');
  await expect(details).toBeFocused();
  await expect(page.getByLabel('Details requests')).toHaveText('No request');
  await expect(page.getByLabel('Continue requests')).toHaveText('0');
  await page.keyboard.press('Tab');
  await expect(continueButton).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Continue requests')).toHaveText('1');
  await page.keyboard.press('Space');
  await expect(page.getByLabel('Continue requests')).toHaveText('2');
  await expect(continueButton).toBeFocused();
});
