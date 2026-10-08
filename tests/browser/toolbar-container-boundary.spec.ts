import { expect, test, type Locator, type Page } from '@playwright/test';

async function tabTo(page: Page, target: Locator) {
  for (let index = 0; index < 24; index++) {
    if (await target.evaluate(node => node === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  await expect(target).toBeFocused();
}

async function insideInlineBounds(parent: Locator, child: Locator) {
  const outer = await parent.boundingBox();
  const inner = await child.boundingBox();
  expect(outer).not.toBeNull(); expect(inner).not.toBeNull();
  expect(inner!.x).toBeGreaterThanOrEqual(outer!.x - 1);
  expect(inner!.x + inner!.width).toBeLessThanOrEqual(outer!.x + outer!.width + 1);
}

for (const enlarged of [false, true]) {
  test(`independent container widths, resizing and keyboard actions${enlarged ? ' with enlarged labels' : ''}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/iframe.html?id=data-display-datatoolbar--container-boundary${enlarged ? '-enlarged' : ''}&viewMode=story&globals=a11y.manual:!true`);
    const narrow = page.getByRole('group', { name: 'Narrow container toolbar', exact: true });
    const wide = page.getByRole('group', { name: 'Wide container toolbar', exact: true });
    const narrowInput = narrow.getByRole('searchbox');
    const wideInput = wide.getByRole('searchbox');
    for (const toolbar of [narrow, wide]) {
      await expect(toolbar).toHaveCSS('container-name', 'sgui-data-toolbar');
      await expect(toolbar).toHaveCSS('container-type', 'inline-size');
      await tabTo(page, toolbar.getByRole('button', { name: 'Search', exact: true }));
      await page.keyboard.press('Enter');
      await expect(toolbar.getByRole('searchbox')).toBeFocused();
    }
    // Both toolbars share a wide viewport and a wide same-name ancestor.
    // Exact input widths distinguish adaptation from incidental flex shrinking.
    await expect(narrowInput).toHaveCSS('width', '160px');
    await expect(wideInput).toHaveCSS('width', '240px');
    const narrowAction = await narrow.getByRole('button', { name: 'Create course', exact: true }).boundingBox();
    const narrowSearch = await narrowInput.boundingBox();
    expect(narrowSearch!.y).toBeGreaterThanOrEqual(narrowAction!.y + narrowAction!.height);
    const wideAction = await wide.getByRole('button', { name: 'Create course', exact: true }).boundingBox();
    const wideSearch = await wideInput.boundingBox();
    expect(Math.abs(wideAction!.y + wideAction!.height / 2 - wideSearch!.y - wideSearch!.height / 2)).toBeLessThanOrEqual(1);
    await narrowInput.fill('draft'); await wideInput.fill('published');
    for (const toolbar of [narrow, wide]) {
      for (const control of await toolbar.getByRole('button').all()) await insideInlineBounds(toolbar, control);
      await insideInlineBounds(toolbar, toolbar.getByRole('searchbox'));
      const searchBox = await toolbar.getByRole('searchbox').boundingBox();
      const closeBox = await toolbar.getByRole('button', { name: 'Clear and close search' }).boundingBox();
      expect(searchBox!.x + searchBox!.width).toBeLessThanOrEqual(closeBox!.x + 1);
    }
    // The fixture's host resize leaves the independently allocated sibling alone.
    await page.getByRole('button', { name: 'Resize narrow host' }).click();
    await expect(narrowInput).toHaveCSS('width', '240px');
    await expect(wideInput).toHaveCSS('width', '240px');
    await expect(narrowInput).toHaveValue('draft'); await expect(wideInput).toHaveValue('published');
    // A host layout update while typing preserves the same native focus owner.
    await tabTo(page, narrowInput);
    await narrow.locator('..').evaluate(node => { (node as HTMLElement).style.inlineSize = '320px'; });
    await expect(narrowInput).toHaveCSS('width', '160px');
    await expect(narrowInput).toBeFocused();
    await expect(narrowInput).toHaveAttribute('data-focus-visible', 'true');
    expect(await narrowInput.evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe('none');
    const trigger = narrow.getByRole('button', { name: 'Narrow course actions', exact: true });
    await tabTo(page, trigger); await page.keyboard.press('ArrowDown');
    const menu = page.getByRole('menu', { name: 'Narrow course actions', exact: true });
    await expect(menu).toBeVisible();
    const item = menu.getByRole('menuitem', { name: 'Import courses for review', exact: true });
    await expect(item).toBeFocused();
    const menuBox = await menu.boundingBox();
    expect(menuBox!.x).toBeGreaterThanOrEqual(0);
    expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(1441);
    await page.keyboard.press('Enter');
    await expect(menu).toHaveCount(0); await expect(trigger).toBeFocused();
    await expect(page.getByLabel('Container host callbacks')).toContainText('Narrow:import');
    await tabTo(page, narrowInput); await page.keyboard.press('Escape');
    await expect(narrowInput).toHaveCount(0);
    await expect(narrow.getByRole('button', { name: 'Search', exact: true })).toBeFocused();
    await expect(wideInput).toHaveValue('published');
    expect(errors).toEqual([]);
  });
}
