import { expect, test } from '@playwright/test';

test('BASE-002 host navigation, course form, card action and editor callback', async ({ page }, info) => {
  await page.goto('/iframe.html?id=foundations-baseline-host-flow--primary&viewMode=story&globals=theme:light;density:comfortable;a11y.manual:!true');
  await page.getByRole('tab', { name: 'Courses', exact: true }).click();
  await expect(page.getByLabel('Host navigation', { exact: true })).toHaveText('courses');
  await page.getByRole('button', { name: 'Create course', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Create course', exact: true });
  await dialog.getByRole('textbox', { name: 'Course title', exact: true }).fill('Course basics');
  await dialog.getByRole('button', { name: 'Save course', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByLabel('Host course submissions', { exact: true })).toHaveText('1');
  await expect(page.getByRole('heading', { name: 'Course basics', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit introduction', exact: true }).click();
  await expect(page.getByLabel('Host opened course', { exact: true })).toHaveText('Course basics');
  await expect(page.getByLabel('Host navigation', { exact: true })).toHaveText('editor');
  await expect(page.getByRole('tab', { name: 'Introduction', exact: true })).toHaveAttribute('aria-selected', 'true');
  const editor = page.getByRole('textbox', { name: 'Course introduction', exact: true });
  await editor.click();
  await page.keyboard.type('Welcome to Course basics');
  await expect(editor).toContainText('Welcome to Course basics');
  const saved = page.getByLabel('Host saved introduction', { exact: true });
  await expect.poll(async () => {
    const value = JSON.parse(await saved.textContent() ?? 'null');
    return value?.root?.children?.[0]?.children?.map((child: { text?: string }) => child.text ?? '').join('');
  }).toBe('Welcome to Course basics');
  await info.attach('host-saved-introduction', { body: await saved.textContent() ?? 'null', contentType: 'application/json' });
});
