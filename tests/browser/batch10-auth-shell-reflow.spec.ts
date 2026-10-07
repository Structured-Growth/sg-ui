import { test, expect, type Locator, type Page } from '@playwright/test';

async function openStory(page: Page, id: string, theme = 'light') {
  await page.goto(`/iframe.html?id=layout-authshell--${id}&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
  await expect(page.locator('[data-sgui-part="auth-shell"]')).toBeVisible();
}

async function visibleFocus(control: Locator) {
  await expect(control).toBeFocused();
  await expect.poll(() => control.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const style = getComputedStyle(element);
    return rect.left >= 0 && rect.right <= innerWidth + 1 && rect.top >= 0 && rect.bottom <= innerHeight + 1
      && Boolean(hit && (element.contains(hit) || hit.contains(element)))
      && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
  })).toBe(true);
}

async function noDocumentOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  for (const part of ['auth-shell-panel', 'auth-shell-footer']) {
    expect(await page.locator(`[data-sgui-part="${part}"]`).evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  }
}

for (const theme of ['light', 'dark']) {
  for (const enlarged of [false, true]) {
    test(`host form reflows with native focus and submit (${theme}, ${enlarged ? '200% text' : 'normal text'})`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await openStory(page, 'native-reflow', theme);
      const email = page.getByRole('textbox', { name: 'School email', exact: true });
      await email.fill('student@example.org');
      if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; } [data-sgui-part="auth-shell"] * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }' });
      await noDocumentOverflow(page);
      await page.setViewportSize({ width: 768, height: 480 });
      await noDocumentOverflow(page);
      await page.setViewportSize({ width: 320, height: 640 });
      await expect(email).toHaveValue('student@example.org');
      await email.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      await visibleFocus(email);
      await page.keyboard.press('Enter');
      await expect(page.getByRole('status')).toHaveText('Host submissions: 1');
      for (const name of ['School name', 'Additional host information']) {
        await page.keyboard.press('Tab');
        await visibleFocus(page.getByRole('textbox', { name, exact: true }));
      }
      await page.keyboard.press('Tab');
      await visibleFocus(page.getByRole('button', { name: 'Continue', exact: true }));
      for (const name of ['ContactYourSchoolAdministratorForAccountAndLearningSupport', 'Read the school privacy and accessibility information']) {
        await page.keyboard.press('Tab');
        await visibleFocus(page.getByRole('link', { name, exact: true }));
      }
      await noDocumentOverflow(page);
      expect(await page.evaluate(() => scrollY > 0)).toBe(true);
      await expect(page.getByRole('status')).toHaveText('Host submissions: 1');
    });
  }
}

test('wide host content scrolls independently of the heading and footer', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await openStory(page, 'independent-content');
  const content = page.locator('[data-sgui-part="auth-shell-content"]');
  expect(await content.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  await noDocumentOverflow(page);
  const headerLeft = await page.getByRole('heading').evaluate(element => element.getBoundingClientRect().left);
  const footerLeft = await page.getByRole('link').evaluate(element => element.getBoundingClientRect().left);
  await content.evaluate(element => { element.scrollLeft = element.scrollWidth; });
  expect(await content.evaluate(element => element.scrollLeft > 0)).toBe(true);
  expect(await page.getByRole('heading').evaluate(element => element.getBoundingClientRect().left)).toBe(headerLeft);
  expect(await page.getByRole('link').evaluate(element => element.getBoundingClientRect().left)).toBe(footerLeft);
  const action = page.getByRole('button', { name: 'Host action' });
  await action.focus();
  await page.keyboard.press('Tab');
  await visibleFocus(page.getByRole('link'));
  await noDocumentOverflow(page);
});
