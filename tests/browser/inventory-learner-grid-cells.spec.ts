import { expect, test, type Page } from '@playwright/test';

const story = '/iframe.html?id=classes-learnerclassesdatagrid-native-cells--host-transitions&viewMode=story&globals=a11y.manual:!true';
const courseId = 'course /?#% 日本';
const detailsHref = `/sections/${encodeURIComponent(courseId)}/learner/me`;
const dueAt = '2000-02-02T12:00:00.000Z';
const runtimeErrors = new WeakMap<Page, string[]>();

test.use({ timezoneId: 'UTC' });
for (const theme of ['light', 'dark']) {
  test.describe(`learner cells ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      const errors: string[] = [];
      runtimeErrors.set(page, errors);
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.clock.setFixedTime(new Date('2026-10-07T12:00:00Z'));
      await page.goto(`${story};theme:${theme}`);
      await expect(page.getByRole('grid', { name: 'Native learner courses' })).toBeVisible();
    });
    test.afterEach(async ({ page }) => {
      expect(runtimeErrors.get(page), 'learner fixture runtime errors').toEqual([]);
    });

    test('course link and keyboard Details route once; dismissal returns focus', async ({ page }) => {
      const link = page.getByRole('link', { name: 'Route laboratory', exact: true });
      await expect(link).toHaveAttribute('href', detailsHref);
      await link.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Learner routes')).toHaveText(`1: ${detailsHref}`);
      const trigger = page.getByRole('button', { name: 'Actions for Route laboratory', exact: true });
      await trigger.focus();
      await page.keyboard.press('Enter');
      const details = page.getByRole('menuitem', { name: 'Details', exact: true });
      await expect(details).toHaveAttribute('href', detailsHref);
      await expect(details).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Learner routes')).toHaveText(`2: ${detailsHref}`);
      await expect(page.getByRole('menu')).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      await expect(page.getByLabel('Learner routes')).toHaveText(`2: ${detailsHref}`);
      await expect(page.getByLabel('Learner requests')).toHaveText('0: none');
    });

    test('Continue launches encoded activity and course fallback with no opener or host route', async ({ page, context }) => {
      // Fulfill only the local launch routes: the fixture makes no application request.
      await context.route('**/content-library/activities/**/launch', route => route.fulfill({ contentType: 'text/html', body: '<title>Host launch fixture</title><p>Launch accepted</p>' }));
      for (const [name, id] of [['Route laboratory', 'activity /?#% 日本'], ['Fallback laboratory', 'fallback /?#% 日本']]) {
        const trigger = page.getByRole('button', { name: `Actions for ${name}`, exact: true });
        await trigger.focus();
        await page.keyboard.press('Enter');
        await page.keyboard.press('ArrowDown');
        const launch = page.getByRole('menuitem', { name: 'Continue', exact: true });
        await expect(launch).toBeFocused();
        const href = `/content-library/activities/${encodeURIComponent(id)}/launch`;
        await expect(launch).toHaveAttribute('href', href);
        await expect(launch).toHaveAttribute('target', '_blank');
        const popupPromise = context.waitForEvent('page');
        await page.keyboard.press('Enter');
        const popup = await popupPromise;
        await popup.waitForLoadState();
        expect(new URL(popup.url()).pathname).toBe(href);
        expect(await popup.evaluate(() => window.opener === null)).toBe(true);
        await popup.close();
        await expect(page.getByRole('menu')).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await expect(page.getByLabel('Learner routes')).toHaveText('0: none');
      }
      await expect(page.getByLabel('Learner requests')).toHaveText('0: none');
    });

    test('live locale and due fallback replacement retain learner destinations', async ({ page }) => {
      await expect(page.getByText('Due date unavailable', { exact: true })).toHaveCount(2);
      await page.getByRole('button', { name: 'German valid dates', exact: true }).click();
      await expect(page.getByRole('columnheader', { name: /Kursname/ })).toBeVisible();
      const expected = await page.evaluate(value => {
        const date = new Date(value);
        return `Fällig ${new Intl.DateTimeFormat('de-DE', { month: 'short', day: 'numeric' }).format(date)} um ${new Intl.DateTimeFormat('de-DE', { hour: 'numeric', minute: '2-digit' }).format(date)}`;
      }, dueAt);
      await expect(page.getByText(expected, { exact: true })).toHaveCount(2);
      await expect(page.getByText('Due date unavailable', { exact: true })).toHaveCount(0);
      const trigger = page.getByRole('button', { name: 'Actions for Route laboratory', exact: true });
      await trigger.click();
      await expect(page.getByRole('menuitem', { name: 'Einzelheiten', exact: true })).toHaveAttribute('href', detailsHref);
      await expect(page.getByRole('menuitem', { name: 'Fortsetzen', exact: true })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      await page.getByRole('button', { name: 'German unavailable dates', exact: true }).click();
      await expect(page.getByText('Termin nicht verfügbar', { exact: true })).toHaveCount(2);
      await expect(page.getByText(expected, { exact: true })).toHaveCount(0);
      await page.getByRole('button', { name: 'English unavailable dates', exact: true }).click();
      await expect(page.getByText('Due date unavailable', { exact: true })).toHaveCount(2);
      await expect(page.getByText(expected, { exact: true })).toHaveCount(0);
      await expect(page.getByRole('columnheader', { name: /Kursname/ })).toHaveCount(0);
      await expect(page.getByRole('link', { name: 'Route laboratory', exact: true })).toHaveAttribute('href', detailsHref);
      await expect(page.getByLabel('Learner routes')).toHaveText('0: none');
    });

    test('learner host rejects then accepts exactly one request per native activation', async ({ page }) => {
      const next = page.getByRole('button', { name: 'Next page', exact: true });
      await next.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Learner requests')).toHaveText('1: 1');
      await expect(page.getByLabel('Learner accepted page')).toHaveText('0');
      await expect(page.getByRole('link', { name: 'Route laboratory', exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Reject learner request', exact: true }).click();
      await expect(page.getByLabel('Learner accepted page')).toHaveText('0');
      await next.focus();
      await page.keyboard.press('Space');
      await expect(page.getByLabel('Learner requests')).toHaveText('2: 1');
      const accept = page.getByRole('button', { name: 'Accept learner request', exact: true });
      await accept.click();
      await expect(page.getByLabel('Learner accepted page')).toHaveText('1');
      await expect(page.getByRole('link', { name: 'Accepted host course', exact: true })).toHaveAttribute('href', '/sections/accepted/learner/me');
      await expect(page.getByRole('link', { name: 'Route laboratory', exact: true })).toHaveCount(0);
      await page.getByRole('button', { name: 'Actions for Accepted host course', exact: true }).click();
      await page.getByRole('menuitem', { name: 'Details', exact: true }).click();
      await expect(page.getByLabel('Learner routes')).toHaveText('1: /sections/accepted/learner/me');
      await expect(page.getByLabel('Learner requests')).toHaveText('2: 1');
    });
  });
}
