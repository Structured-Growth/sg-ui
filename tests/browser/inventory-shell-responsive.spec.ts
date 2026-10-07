import { test, expect, type Locator, type Page } from '@playwright/test';

async function openWorkspace(page: Page, theme: string) {
  await page.goto(`/iframe.html?id=layout-appshell--native-responsive-workspace&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
  await expect(page.getByRole('main', { name: 'Responsive host workspace' })).toBeVisible();
}

async function layout(page: Page, stacked: boolean) {
  const shell = page.locator('[data-sgui-part="app-shell"]');
  await expect.poll(() => shell.evaluate(element => getComputedStyle(element).flexDirection)).toBe(stacked ? 'column' : 'row');
  const nav = await page.getByRole('navigation').boundingBox();
  const main = await page.getByRole('main').boundingBox();
  expect(nav).not.toBeNull();
  expect(main).not.toBeNull();
  expect(main!.height).toBeGreaterThan(0);
  expect(main!.width).toBeGreaterThan(0);
  if (stacked) {
    expect(nav!.height).toBeLessThanOrEqual(page.viewportSize()!.height * .45 + 1);
    expect(main!.y).toBeGreaterThanOrEqual(nav!.y + nav!.height - 1);
  } else {
    expect(main!.x).toBeGreaterThanOrEqual(nav!.x + nav!.width - 1);
    expect(main!.y).toBeCloseTo(nav!.y, 0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  expect(await page.getByRole('main').evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
}

async function visibleFocus(control: Locator) {
  await expect(control).toBeFocused();
  await expect.poll(() => control.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const main = element.closest('main')!.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const style = getComputedStyle(element);
    return rect.left >= main.left && rect.right <= main.right + 1
      && rect.top >= main.top && rect.bottom <= main.bottom + 1
      && rect.top >= 0 && rect.bottom <= innerHeight + 1
      && Boolean(hit && element.contains(hit))
      && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
  })).toBe(true);
}

for (const theme of ['light', 'dark']) {
  test(`breakpoint transitions retain host input, landmark and native focus (${theme})`, async ({ page, browserName }) => {
    await page.setViewportSize({ width: 900, height: 480 });
    await openWorkspace(page, theme);
    const input = page.getByRole('textbox', { name: 'Host workspace title' });
    await input.fill('Unsaved host title');
    // Enter keyboard modality before measuring the visible focus indicator.
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab');
    for (const width of [641, 640, 639, 320, 900]) {
      await page.setViewportSize({ width, height: 480 });
      await layout(page, width <= 640);
      await expect(page.getByRole('main')).toHaveCount(1);
      await expect(input).toHaveValue('Unsaved host title');
      await visibleFocus(input);
    }
    const collapse = page.getByRole('button', { name: 'Collapse navigation' });
    await collapse.click();
    await expect(page.getByRole('navigation')).toHaveAttribute('data-collapsed', 'true');
    await expect(input).toHaveValue('Unsaved host title');
    await layout(page, false);
    await page.setViewportSize({ width: 320, height: 480 });
    await layout(page, true);
    await expect(page.getByRole('main')).toContainText('Learning content section 12');
  });

  for (const enlarged of [false, true]) {
    test(`short host content scrolls independently with sequential focus (${theme}, ${enlarged ? '200% text' : 'normal text'})`, async ({ page, browserName }) => {
      await page.setViewportSize({ width: 320, height: 360 });
      await openWorkspace(page, theme);
      if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; }' });
      await layout(page, true);
      const main = page.getByRole('main');
      // Find the actual owned navigation scroll region rather than assuming
      // its generated CSS class or confusing it with the shell wrapper.
      const navigation = page.getByRole('navigation');
      const navState = () => navigation.evaluate(element => Array.from(element.querySelectorAll('div')).filter(node => getComputedStyle(node).overflowY === 'auto').map(node => node.scrollTop));
      expect(await navState()).toHaveLength(1);
      const initialNav = await navState();
      expect(await main.evaluate(element => element.scrollHeight > element.clientHeight)).toBe(true);
      await main.hover();
      await page.mouse.wheel(0, 500);
      await expect.poll(() => main.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
      expect(await navState()).toEqual(initialNav);
      const mainBeforeNavScroll = await main.evaluate(element => element.scrollTop);
      await navigation.evaluate(element => {
        const scroll = Array.from(element.querySelectorAll('div')).find(node => getComputedStyle(node).overflowY === 'auto')!;
        scroll.scrollTop = scroll.scrollHeight;
      });
      expect((await navState())[0]).toBeGreaterThan(0);
      expect(await main.evaluate(element => element.scrollTop)).toBe(mainBeforeNavScroll);
      const navAfterScroll = await navState();
      const input = page.getByRole('textbox', { name: 'Host workspace title' });
      await input.focus();
      for (let i = 1; i <= 12; i++) {
        await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
        await visibleFocus(page.getByRole('button', { name: `Host action ${i}`, exact: true }));
      }
      expect(await main.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
      expect(await navState()).toEqual(navAfterScroll);
      await page.keyboard.press(browserName === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab');
      await visibleFocus(page.getByRole('button', { name: 'Host action 11', exact: true }));
      await layout(page, true);
      expect(await page.evaluate(() => scrollY)).toBe(0);
    });
  }
}
