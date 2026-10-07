import { test, expect, type Locator, type Page } from '@playwright/test';

async function wholeFocusedControl(control: Locator) {
  await expect(control).toBeFocused();
  await expect.poll(() => control.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    const host = document.querySelector('[data-testid="auth-scroll-host"]')!.getBoundingClientRect();
    const clip = document.querySelector('[data-testid="auth-host-clip"]')!.getBoundingClientRect();
    const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
    const css = getComputedStyle(element);
    return bounds.top >= Math.max(0, host.top, clip.top) - 1
      && bounds.bottom <= Math.min(innerHeight, host.bottom, clip.bottom) + 1
      && bounds.left >= Math.max(0, host.left, clip.left) - 1
      && bounds.right <= Math.min(innerWidth, host.right, clip.right) + 1
      && Boolean(hit && (element.contains(hit) || hit.contains(element)))
      && css.outlineStyle !== 'none' && parseFloat(css.outlineWidth) > 0;
  })).toBe(true);
}

async function singleHostScroll(page: Page) {
  expect(await page.evaluate(() => {
    const host = document.querySelector('[data-testid="auth-scroll-host"]')!;
    const shell = document.querySelector('[data-sgui-part="auth-shell"]')!;
    const content = document.querySelector('[data-sgui-part="auth-shell-content"]')!;
    const clip = document.querySelector('[data-testid="auth-host-clip"]')!;
    return host.scrollTop > 0 && host.scrollWidth <= host.clientWidth + 1
      && shell.scrollTop === 0 && content.scrollTop === 0 && content.scrollLeft === 0
      && clip.scrollTop === 0 && scrollY === 0 && scrollX === 0
      && document.documentElement.scrollWidth <= innerWidth + 1;
  })).toBe(true);
}

for (const theme of ['light', 'dark']) {
  for (const enlarged of [false, true]) {
    test(`short embedded host preserves native entry and single scrolling (${theme}, ${enlarged ? '200% text' : 'normal text'})`, async ({ page, browserName }) => {
      await page.setViewportSize({ width: 368, height: 700 });
      await page.goto(`/iframe.html?id=layout-authshell--embedded-scrolling-host&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      const host = page.getByTestId('auth-scroll-host');
      await expect(host).toBeVisible();
      if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; } [data-sgui-part="auth-shell"] * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }' });
      const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
      const backTab = browserName === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab';
      const email = page.getByRole('textbox', { name: 'School email', exact: true });
      // Native Tab and typing drive focus, scroll and the host's React update.
      await page.keyboard.press(tab);
      await wholeFocusedControl(email);
      const originalInput = await email.elementHandle();
      await page.keyboard.type('student@example.org');
      await expect(page.getByRole('heading', { name: 'Continue entry' })).toBeVisible();
      await expect(page.getByTestId('auth-host-copy')).toHaveText('Updated host guidance');
      await expect(email).toHaveValue('student@example.org');
      expect(await email.evaluate((element, original) => element === original, originalInput)).toBe(true);
      await wholeFocusedControl(email);
      await singleHostScroll(page);
      for (const name of ['School name', 'Host reference']) {
        await page.keyboard.press(tab);
        const field = page.getByRole('textbox', { name, exact: true });
        await wholeFocusedControl(field);
        await page.keyboard.type('Host value');
        await expect(field).toHaveValue('Host value');
        await wholeFocusedControl(field);
        await singleHostScroll(page);
      }
      await page.keyboard.press(tab);
      await wholeFocusedControl(page.getByRole('button', { name: 'Continue', exact: true }));
      await page.keyboard.press('Enter');
      await expect(page.getByRole('status')).toHaveText('Host submissions: 1');
      await page.keyboard.press(tab);
      await wholeFocusedControl(page.getByRole('link', { name: 'Updated support', exact: true }));
      await singleHostScroll(page);
      // Reverse native traversal must reveal whole controls as the same host scrolls back.
      for (const control of [page.getByRole('button', { name: 'Continue', exact: true }), page.getByRole('textbox', { name: 'Host reference' }), page.getByRole('textbox', { name: 'School name' }), email]) {
        await page.keyboard.press(backTab);
        await wholeFocusedControl(control);
        await singleHostScroll(page);
      }
      await expect(email).toHaveValue('student@example.org');
      await expect(page.getByRole('status')).toHaveText('Host submissions: 1');
    });
  }
}
