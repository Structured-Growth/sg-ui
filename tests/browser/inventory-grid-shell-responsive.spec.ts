import { expect, test, type Locator, type Page } from '@playwright/test';

// Native sequential navigation only: no locator.focus or DOM focus injection.
async function tabTo(page: Page, target: Locator, browserName: string) {
  for (let attempt = 0; attempt < 50; attempt++) {
    if (await target.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  }
  await expect(target, 'reachable by native sequential navigation').toBeFocused();
}

async function visibleFocus(target: Locator) {
  await expect(target).toBeFocused();
  await expect.poll(() => target.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const style = getComputedStyle(element);
    const ancestors: Element[] = [];
    for (let parent = element.parentElement; parent; parent = parent.parentElement) ancestors.push(parent);
    const unclipped = ancestors.every(parent => {
      const bounds = parent.getBoundingClientRect();
      const css = getComputedStyle(parent);
      return (!/(auto|scroll|hidden|clip)/.test(css.overflowX) || (rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1))
        && (!/(auto|scroll|hidden|clip)/.test(css.overflowY) || (rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1));
    });
    return rect.width > 0 && rect.height > 0 && rect.left >= 0 && rect.right <= innerWidth + 1
      && rect.top >= 0 && rect.bottom <= innerHeight + 1 && unclipped
      && Boolean(hit && element.contains(hit)) && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
  }), 'native focus is visible, unclipped and has an indicator').toBe(true);
}

async function coherentShell(page: Page, mode: 'list' | 'cards', range: string) {
  await expect(page.locator('[data-sgui-part="data-grid-shell"]')).toHaveCount(1);
  await expect(page.locator('[data-sgui-part="data-toolbar"]')).toHaveCount(1);
  await expect(page.locator('[data-sgui-part="card-pagination-footer"]')).toHaveCount(1);
  await expect(page.getByText('1 selected', { exact: true })).toBeVisible();
  await expect(page.getByText(range, { exact: true })).toBeVisible();
  await expect(page.getByRole(mode === 'list' ? 'grid' : 'list', { name: 'Responsive courses', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no host horizontal overflow').toBe(true);
}

for (const theme of ['light', 'dark']) {
  for (const enlarged of [false, true]) {
    test(`responsive shell switches views and accepts footer/status transitions (${theme}, ${enlarged ? '200% text' : 'normal text'})`, async ({ page, browserName }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.setViewportSize({ width: 760, height: 900 });
      await page.goto(`/iframe.html?id=data-display-appdatagridshell--native-responsive-transitions&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      await expect(page.getByRole('grid', { name: 'Responsive courses', exact: true })).toBeVisible();
      if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; }' });
      const accepted = page.getByRole('status', { name: 'Responsive accepted state' });
      const cards = page.getByRole('button', { name: 'Cards', exact: true });
      const list = page.getByRole('button', { name: 'List', exact: true });
      await tabTo(page, cards, browserName);
      for (const width of [320, 760, 320]) {
        await page.setViewportSize({ width, height: 900 });
        await visibleFocus(cards);
        await coherentShell(page, 'list', '1-2 of 4');
      }
      await page.keyboard.press('Enter');
      await visibleFocus(cards);
      await expect(cards).toHaveAttribute('aria-pressed', 'true');
      await coherentShell(page, 'cards', '1-2 of 4');
      await expect(accepted).toHaveText('Page 0; requests 0; view cards');
      // Host status changes preserve the focused view control at narrow width.
      await page.keyboard.press('Alt+p');
      await expect(page.getByText('Refreshing rows', { exact: true })).toBeVisible();
      await expect(page.getByRole('list', { name: 'Responsive courses', exact: true })).toHaveAttribute('aria-busy', 'true');
      await visibleFocus(cards);
      await page.keyboard.press('Alt+e');
      await expect(page.getByText('Responsive host failed', { exact: true })).toBeVisible();
      await visibleFocus(cards);
      await tabTo(page, page.getByRole('button', { name: 'Retry', exact: true }), browserName);
      await visibleFocus(page.getByRole('button', { name: 'Retry', exact: true }));
      await page.keyboard.press('Enter');
      await expect(page.getByText('Refreshing rows', { exact: true })).toBeVisible();
      // Re-enter the persistent toolbar with real Tab after Retry unmounts.
      await tabTo(page, list, browserName);
      await page.keyboard.press('Alt+r');
      await page.keyboard.press('Enter');
      await visibleFocus(list);
      await coherentShell(page, 'list', '1-2 of 4');
      await expect(page.getByText('Refreshing rows', { exact: true })).toHaveCount(0);
      await page.keyboard.press('Alt+p');
      await expect(page.getByRole('grid', { name: 'Responsive courses', exact: true })).toHaveAttribute('aria-busy', 'true');
      await expect(page.getByText('Refreshing rows', { exact: true })).toBeVisible();
      await visibleFocus(list);
      await page.keyboard.press('Alt+e');
      await expect(page.getByText('Responsive host failed', { exact: true })).toBeVisible();
      await coherentShell(page, 'list', '1-2 of 4');
      await visibleFocus(list);
      await page.keyboard.press('Alt+r');
      await expect(page.getByText('Responsive host failed', { exact: true })).toHaveCount(0);
      const next = page.getByRole('button', { name: 'Next page', exact: true });
      await tabTo(page, next, browserName);
      await visibleFocus(next);
      await page.keyboard.press('Enter');
      await expect(accepted).toHaveText('Page 1; requests 1; view list');
      await coherentShell(page, 'list', '3-4 of 4');
      await visibleFocus(page.locator('tbody [data-grid-row="course-3"][data-grid-field="name"]'));
      await tabTo(page, cards, browserName);
      await page.keyboard.press('Enter');
      await visibleFocus(cards);
      await coherentShell(page, 'cards', '3-4 of 4');
      const previous = page.getByRole('button', { name: 'Previous page', exact: true });
      await tabTo(page, previous, browserName);
      await visibleFocus(previous);
      await page.keyboard.press('Enter');
      await expect(accepted).toHaveText('Page 0; requests 2; view cards');
      await coherentShell(page, 'cards', '1-2 of 4');
      await visibleFocus(page.locator('[data-sgui-part="grid-card"][data-grid-row="course-1"]'));
      await page.keyboard.press('Alt+p');
      await expect(page.getByText('Refreshing rows', { exact: true })).toBeVisible();
      await visibleFocus(page.locator('[data-sgui-part="grid-card"][data-grid-row="course-1"]'));
      await page.keyboard.press('Alt+r');
      await page.setViewportSize({ width: 760, height: 900 });
      await visibleFocus(page.locator('[data-sgui-part="grid-card"][data-grid-row="course-1"]'));
      await expect(accepted).toHaveText('Page 0; requests 2; view cards');
      expect(errors, 'browser runtime errors').toEqual([]);
    });
  }
}
