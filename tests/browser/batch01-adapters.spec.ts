import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('host adapter preserves native navigation, routing, refs and external destinations', async ({ page }, info) => {
  await page.goto('/iframe.html?id=host-adapters-acceptance--routing&viewMode=story&globals=a11y.manual:!true');
  const native = page.getByRole('link', { name: 'Native fallback course' });
  await native.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#native-course$/);
  const events = page.getByLabel('Host navigation events');
  await expect(events).toBeEmpty();
  await page.getByRole('link', { name: 'Replace course', exact: true }).click();
  await expect(page.getByLabel('Host pathname')).toHaveText('/courses/one?tab=details#title');
  await expect(events).toHaveText('replace:/courses/one?tab=details#title');
  await page.getByRole('link', { name: 'Canceled course' }).click();
  await expect(events).not.toContainText('canceled');
  await page.getByRole('link', { name: 'Styled course' }).focus();
  await page.keyboard.press('Enter');
  await expect(events).toContainText('push:/courses/two');
  const downloading = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download course' }).click();
  const download = await downloading;
  const file = info.outputPath('adapter.txt');
  await download.saveAs(file);
  expect(await readFile(file, 'utf8')).toBe('SGUI host adapter');
  expect(await download.failure()).toBeNull();
  await expect(events).not.toContainText('data:');
  await page.route('https://adapter.example.test/course', route => route.fulfill({ contentType: 'text/html', body: '<title>External host</title><h1>External course host</h1>' }));
  await page.getByRole('link', { name: 'External course', exact: true }).click();
  await expect(page).toHaveURL('https://adapter.example.test/course');
  await expect(page.getByRole('heading')).toHaveText('External course host');
});

test('custom host router Link forwards native ref focus and owns keyboard and pointer routes', async ({ page }) => {
  await page.goto('/iframe.html?id=host-adapters-acceptance--routing&viewMode=story&globals=a11y.manual:!true');
  const storyUrl = page.url();
  const custom = page.getByRole('link', { name: 'Custom router course', exact: true });
  const events = page.getByLabel('Host navigation events');
  const pathname = page.getByLabel('Host pathname');
  await expect(pathname).toHaveText('/courses');
  await expect(events).toBeEmpty();
  await expect(custom).toHaveAttribute('href', '/courses/custom');
  await expect(custom).toHaveAttribute('data-host', 'course');
  await expect(custom).toHaveAttribute('aria-description', 'Host router course');
  await expect(custom).toHaveAttribute('data-router', 'host');

  await page.getByRole('button', { name: 'Focus custom router link', exact: true }).click();
  await expect(custom).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(pathname).toHaveText('/courses/custom');
  await expect(events).toHaveText('replace:/courses/custom');
  await expect(page).toHaveURL(storyUrl);
  await expect(custom).toBeFocused();

  // Change the shared host state before exercising the custom pointer path.
  await page.getByRole('link', { name: 'Replace course', exact: true }).click();
  await expect(pathname).toHaveText('/courses/one?tab=details#title');
  await expect(events).toHaveText('replace:/courses/custom\nreplace:/courses/one?tab=details#title');
  await custom.click();
  await expect(pathname).toHaveText('/courses/custom');
  await expect(events).toHaveText('replace:/courses/custom\nreplace:/courses/one?tab=details#title\nreplace:/courses/custom');
  await expect(page).toHaveURL(storyUrl);
  await page.getByRole('button', { name: 'Focus custom router link', exact: true }).click();
  await expect(custom).toBeFocused();
});

test('host-owned account pending guard, rejection and retry retain the callback outcome', async ({ page }) => {
  await page.goto('/iframe.html?id=host-adapters-acceptance--async-accounts&viewMode=story&globals=a11y.manual:!true');
  const logout = page.getByRole('button', { name: 'Log out account', exact: true });
  await logout.focus();
  await page.keyboard.press('Enter');
  await expect(logout).toBeDisabled();
  await expect(page.getByLabel('Host account status')).toHaveText('Pending');
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Host logout requests')).toHaveText('1');
  await page.getByRole('button', { name: 'Host rejects logout' }).click();
  await expect(page.getByLabel('Host account status')).toHaveText('Host logout failed');
  await expect(logout).toBeEnabled();
  await logout.click();
  await expect(page.getByLabel('Host logout requests')).toHaveText('2');
  await page.getByRole('button', { name: 'Host completes logout' }).click();
  await expect(page.getByLabel('Host account status')).toHaveText('Signed out');
});
