import { expect, test, type Page } from '@playwright/test';

const story = '/iframe.html?id=data-display-appdatagridshell--controlled-host-responses&viewMode=story&globals=a11y.manual:!true';
const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const messages: string[] = [];
  errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
  page.on('console', message => { if (message.type() === 'error') messages.push(message.text()); });
  await page.goto(story);
  await expect(page.getByRole('grid', { name: 'Controlled host courses', exact: true })).toBeVisible();
});
test.afterEach(async ({ page }) => { expect(errors.get(page), 'browser runtime errors').toEqual([]); });

for (const mode of ['List', 'Cards']) {
  test(`${mode} retains selection and host rows across deferred, pending and failed responses`, async ({ page }) => {
    if (mode === 'Cards') await page.getByRole('button', { name: 'Cards', exact: true }).click();
    await expect(page.getByText('2 selected', { exact: true })).toBeVisible();
    await expect(page.getByText('Total unknown', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Next page', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Host callback order' })).toHaveText('page → state');
    await expect(page.getByRole('status', { name: 'Accepted host page' })).toHaveText('Page 1, size 10');
    await expect(page.getByText(mode === 'Cards' ? 'Open Course 11' : 'Course 11', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Pending response', exact: true }).click();
    await expect(page.getByText('Refreshing rows', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Failed response', exact: true }).click();
    await expect(page.getByText('Host request failed', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Retry', exact: true }).click();
    await expect(page.getByText('Refreshing rows', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Accept request', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Accepted host page' })).toHaveText('Page 2, size 10');
    await expect(page.getByText(mode === 'Cards' ? 'Open Course 21' : 'Course 21', { exact: true })).toBeVisible();
    await expect(page.getByText('2 selected', { exact: true })).toBeVisible();
    // Host acceptance must leave the host action focused, even with a pending footer request.
    await expect(page.getByRole('button', { name: 'Accept request', exact: true })).toBeFocused();
    await page.getByRole('button', { name: 'Empty terminal response', exact: true }).click();
    await expect(page.getByText('No rows available', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next page', exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Previous page', exact: true })).toBeEnabled();
    await expect(page.getByText('2 selected', { exact: true })).toBeVisible();
  });
}

test('filter and page-size requests reach page zero before host acceptance', async ({ page }) => {
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
  await page.getByRole('button', { name: /Columns 1/ }).click();
  await page.getByRole('option', { name: 'Course', exact: true }).click();
  await page.getByLabel('Value 1', { exact: true }).fill('Course 2');
  await expect(page.getByRole('status', { name: 'Host callback order' })).toHaveText('No request');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Host callback order' })).toHaveText('page → filter → state');
  await expect(page.getByRole('status', { name: 'Accepted host page' })).toHaveText('Page 1, size 10');
  await expect(page.getByRole('button', { name: 'Filter', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Accept request', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Accepted host page' })).toHaveText('Page 0, size 10');
  await expect(page.getByRole('checkbox', { name: 'Select Course 2', exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'Rows per page', exact: true }).selectOption('25');
  await expect(page.getByRole('status', { name: 'Host callback order' })).toHaveText('page → state');
  await expect(page.getByRole('combobox', { name: 'Rows per page', exact: true })).toHaveValue('10');
  await page.getByRole('button', { name: 'Accept request', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Rows per page', exact: true })).toHaveValue('25');
  await expect(page.getByRole('status', { name: 'Accepted host page' })).toHaveText('Page 0, size 25');
  await expect(page.getByText('2 selected', { exact: true })).toBeVisible();
});

test('a disappearing focused card repairs native focus without leaking into host actions', async ({ page }) => {
  await page.getByRole('button', { name: 'Cards', exact: true }).click();
  await page.getByRole('button', { name: 'Open Course 11', exact: true }).focus();
  await page.keyboard.press('Alt+d');
  await expect(page.getByRole('button', { name: 'Open Course 11', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open Course 12', exact: true })).toBeFocused();
  await expect(page.getByText('2 selected', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Failed response', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Failed response', exact: true })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Open Course 12', exact: true })).toBeVisible();
});
