import { test, expect, type Locator, type Page } from '@playwright/test';

async function openContainers(page: Page, theme: string, direction: string) {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto(`/iframe.html?id=layout-appshell--independent-containers&viewMode=story&globals=theme:${theme};direction:${direction};a11y.manual:!true`);
  await expect(page.getByRole('main', { name: 'First container workspace' })).toBeVisible();
}

function shell(page: Page, name: string) {
  return page.locator('[data-sgui-part="app-shell"]').filter({ has: page.getByRole('main', { name: `${name} container workspace` }) });
}

async function checkLayout(root: Locator, stacked: boolean, direction: string) {
  await expect.poll(() => root.locator('main').evaluate(main => getComputedStyle(main.parentElement!).flexDirection)).toBe(stacked ? 'column' : 'row');
  const navigation = root.getByRole('navigation');
  const main = root.getByRole('main');
  const navBox = (await navigation.boundingBox())!;
  const mainBox = (await main.boundingBox())!;
  const rootBox = (await root.boundingBox())!;
  expect(mainBox.width).toBeGreaterThan(0);
  expect(mainBox.height).toBeGreaterThan(0);
  expect(mainBox.x).toBeGreaterThanOrEqual(rootBox.x - 1);
  expect(mainBox.x + mainBox.width).toBeLessThanOrEqual(rootBox.x + rootBox.width + 1);
  if (stacked) {
    expect(mainBox.y).toBeGreaterThanOrEqual(navBox.y + navBox.height - 1);
    expect(navBox.width).toBeCloseTo(rootBox.width, 0);
    expect(navBox.height).toBeLessThanOrEqual(800 * .45 + 1);
    expect(await navigation.evaluate(node => getComputedStyle(node).borderInlineEndWidth)).toBe('0px');
    expect(await navigation.evaluate(node => getComputedStyle(node).borderBlockEndWidth)).toBe('1px');
  } else {
    expect(mainBox.y).toBeCloseTo(navBox.y, 0);
    if (direction === 'rtl') expect(mainBox.x + mainBox.width).toBeLessThanOrEqual(navBox.x + 1);
    else expect(mainBox.x).toBeGreaterThanOrEqual(navBox.x + navBox.width - 1);
  }
  expect(await root.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
  expect(await main.evaluate(node => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
}

async function visibleMainFocus(control: Locator) {
  await expect(control).toBeFocused();
  await expect.poll(() => control.evaluate(node => {
    const rect = node.getBoundingClientRect();
    const main = node.closest('main')!.getBoundingClientRect();
    const style = getComputedStyle(node);
    const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    return rect.x >= main.x - 1 && rect.right <= main.right + 1
      && rect.y >= main.y - 1 && rect.bottom <= main.bottom + 1
      && Boolean(hit && node.contains(hit)) && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
  })).toBe(true);
}

for (const theme of ['light', 'dark']) {
  for (const direction of ['ltr', 'rtl']) {
    test(`independent width, resizing and collapsed rails (${theme}, ${direction})`, async ({ page }) => {
      await openContainers(page, theme, direction);
      const first = shell(page, 'First');
      const second = shell(page, 'Second');
      await expect(first).toHaveCSS('direction', direction);
      await expect(first).toHaveCSS('container-name', 'sgui-app-shell');
      await expect(first).toHaveCSS('container-type', 'inline-size');
      await checkLayout(first, true, direction);
      await checkLayout(second, false, direction);
      const input = first.getByRole('textbox', { name: 'First host title' });
      await input.fill('Unsaved container draft');
      await input.evaluate(node => { node.setAttribute('data-retained-host-field', 'true'); });
      await first.getByRole('main').evaluate(node => { node.setAttribute('data-retained-main', 'true'); });
      await page.getByRole('button', { name: 'Resize first shell' }).click();
      await checkLayout(first, false, direction);
      await checkLayout(second, false, direction);
      await expect(input).toHaveAttribute('data-retained-host-field', 'true');
      await expect(input).toHaveValue('Unsaved container draft');
      await expect(first.getByRole('main')).toHaveAttribute('data-retained-main', 'true');
      await first.getByRole('button', { name: 'Collapse navigation' }).click();
      await expect(first.getByRole('navigation')).toHaveAttribute('data-collapsed', 'true');
      await expect(first.getByRole('button', { name: 'Expand navigation' })).toBeFocused();
      expect((await first.getByRole('navigation').boundingBox())!.width).toBeCloseTo(48, 0);
      await page.getByRole('button', { name: 'Resize first shell' }).click();
      await checkLayout(first, true, direction);
      await checkLayout(second, false, direction);
      expect((await first.getByRole('navigation').boundingBox())!.height).toBeLessThan(80);
      await first.getByRole('button', { name: 'Expand navigation' }).click();
      await expect(first.getByRole('button', { name: 'Collapse navigation' })).toBeFocused();
      await checkLayout(first, true, direction);
      await expect(input).toHaveValue('Unsaved container draft');
    });
  }

  test(`local breakpoint preserves keyboard focus and independent main scrolling (${theme})`, async ({ page, browserName }) => {
    await openContainers(page, theme, 'ltr');
    const first = shell(page, 'First');
    const second = shell(page, 'Second');
    const main = first.getByRole('main');
    const input = first.getByRole('textbox', { name: 'First host title' });
    await input.fill('Focused draft');
    const next = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
    const previous = browserName === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab';
    await page.keyboard.press(next);
    await page.keyboard.press(previous);
    for (const width of [641, 640, 639, 320, 896]) {
      // The host changes the native root size without moving focus or remounting.
      await first.evaluate((node, value) => { (node as HTMLElement).style.inlineSize = `${value}px`; }, width);
      await checkLayout(first, width <= 640, 'ltr');
      await checkLayout(second, false, 'ltr');
      await visibleMainFocus(input);
      await expect(input).toHaveValue('Focused draft');
    }
    await first.evaluate(node => { (node as HTMLElement).style.inlineSize = '320px'; });
    await checkLayout(first, true, 'ltr');
    const navScroll = first.locator('[data-sgui-part="side-navigation-scroll"]');
    const initialNav = await navScroll.evaluate(node => node.scrollTop);
    expect(await main.evaluate(node => node.scrollHeight > node.clientHeight)).toBe(true);
    await main.hover();
    await page.mouse.wheel(0, 300);
    await expect.poll(() => main.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
    expect(await navScroll.evaluate(node => node.scrollTop)).toBe(initialNav);
    expect(await second.getByRole('main').evaluate(node => node.scrollTop)).toBe(0);
    const mainScroll = await main.evaluate(node => node.scrollTop);
    await navScroll.evaluate(node => { node.scrollTop = node.scrollHeight; });
    await expect.poll(() => navScroll.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
    expect(await main.evaluate(node => node.scrollTop)).toBe(mainScroll);
    const navAfter = await navScroll.evaluate(node => node.scrollTop);
    await input.focus();
    for (let i = 1; i <= 12; i++) {
      await page.keyboard.press(next);
      await visibleMainFocus(first.getByRole('button', { name: `First host action ${i}`, exact: true }));
    }
    expect(await navScroll.evaluate(node => node.scrollTop)).toBe(navAfter);
    expect(await second.getByRole('main').evaluate(node => node.scrollTop)).toBe(0);
  });
}
