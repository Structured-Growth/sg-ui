import { test, expect, type Page } from '@playwright/test';

async function events(page: Page) {
  return JSON.parse((await page.getByLabel('Host link events').textContent()) ?? '[]');
}
async function selectRichFragment(page: Page) {
  const fragment = page.getByLabel('Host rich fragment');
  const first = await fragment.locator('strong').boundingBox();
  const last = await fragment.locator('em').boundingBox();
  if (!first || !last) throw new Error('Host rich fragment is not visible');
  // Start in paragraph whitespace, outside the draggable native link. Starting
  // on its first glyph requests link dragging rather than text selection.
  await page.mouse.move(last.x + last.width + 4, last.y + last.height / 2);
  await page.mouse.down();
  await page.mouse.move(first.x + 1, first.y + first.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('Course guide');
}
async function returned(page: Page) {
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Edit selected link' })).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('Course guide');
  await expect(page.getByLabel('Host rich fragment').locator('strong')).toHaveText('Course');
  await expect(page.getByLabel('Host rich fragment').locator('em')).toHaveText('guide');
}
for (const theme of ['light', 'dark']) {
  test.describe(`LinkUrlModal local host: ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/iframe.html?id=editors-linkurlmodal--native-host-selection&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      await selectRichFragment(page);
    });

    test('invalid protocol stays in modal; correction applies once with host selection and return focus', async ({ page }) => {
      const trigger = page.getByRole('button', { name: 'Edit selected link' });
      await trigger.click();
      await expect(page.getByRole('textbox', { name: 'Display Text', exact: true })).toBeFocused();
      const url = page.getByRole('textbox', { name: 'URL', exact: true });
      await url.fill('javascript:alert(1)');
      await page.getByRole('button', { name: 'Apply', exact: true }).click();
      await expect(url).toBeFocused();
      await expect(url).toHaveAttribute('aria-invalid', 'true');
      const error = page.getByText('Enter a valid URL using an allowed protocol or a relative path.', { exact: true });
      await expect(error).toBeVisible();
      const errorId = await error.getAttribute('id');
      expect(errorId).toBeTruthy();
      expect((await url.getAttribute('aria-describedby'))?.split(' ')).toContain(errorId);
      expect(await events(page)).toEqual([{ action: 'open', selection: 'Course guide' }]);
      await expect(page.getByLabel('Host rich fragment').locator('a')).toHaveAttribute('href', 'https://example.org/original');
      await url.fill('  https://example.org/corrected  ');
      await expect(error).toHaveCount(0);
      await url.press('Enter');
      await returned(page);
      expect(await events(page)).toEqual([
        { action: 'open', selection: 'Course guide' },
        { action: 'submit', displayText: 'Course guide', url: 'https://example.org/corrected', selection: 'Course guide' },
      ]);
      await expect(page.getByLabel('Host rich fragment').locator('a')).toHaveAttribute('href', 'https://example.org/corrected');
      await trigger.press('Enter');
      await expect(url).toHaveValue('https://example.org/corrected');
      await expect(url).not.toHaveAttribute('aria-invalid', 'true');
      await page.keyboard.press('Escape');
      await returned(page);
      expect((await events(page)).filter((event: { action: string }) => event.action === 'submit')).toHaveLength(1);
    });

    test('remove preserves rich children; Cancel and Escape discard drafts on mounted reopen', async ({ page }) => {
      const trigger = page.getByRole('button', { name: 'Edit selected link' });
      await trigger.focus();
      await trigger.press('Enter');
      const url = page.getByRole('textbox', { name: 'URL', exact: true });
      await url.fill('   ');
      await url.press('Enter');
      await returned(page);
      await expect(page.getByLabel('Host rich fragment').locator('a')).toHaveCount(0);
      expect(await events(page)).toEqual([
        { action: 'open', selection: 'Course guide' },
        { action: 'submit', displayText: 'Course guide', url: null, selection: 'Course guide' },
      ]);
      for (const dismiss of ['Cancel', 'Escape']) {
        await trigger.press('Enter');
        await expect(page.getByRole('textbox', { name: 'Display Text', exact: true })).toHaveValue('Course guide');
        await expect(url).toHaveValue('');
        await page.getByRole('textbox', { name: 'Display Text', exact: true }).fill('Discard this draft');
        await url.fill('ftp://example.org/draft');
        await url.press('Enter');
        await expect(url).toHaveAttribute('aria-invalid', 'true');
        if (dismiss === 'Cancel') await page.getByRole('button', { name: 'Cancel', exact: true }).click();
        else await page.keyboard.press('Escape');
        await returned(page);
        await expect(page.getByLabel('Host rich fragment').locator('a')).toHaveCount(0);
      }
      await trigger.press('Enter');
      await expect(url).toHaveValue('');
      await expect(url).not.toHaveAttribute('aria-invalid', 'true');
      await expect(page.getByRole('textbox', { name: 'Display Text', exact: true })).toBeFocused();
      await page.keyboard.press('Escape');
      await returned(page);
      const observed = await events(page);
      expect(observed.filter((event: { action: string }) => event.action === 'submit')).toHaveLength(1);
      expect(observed.filter((event: { action: string }) => event.action === 'close')).toHaveLength(3);
      expect(observed.every((event: { selection: string }) => event.selection === 'Course guide')).toBe(true);
    });
  });
}
