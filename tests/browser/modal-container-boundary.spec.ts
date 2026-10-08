import { expect, test, type Locator, type Page } from '@playwright/test';

async function story(page: Page, theme = 'light', density = 'comfortable') {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`/iframe.html?id=overlays-appmodal--container-boundary&viewMode=story&globals=theme:${theme};density:${density};a11y.manual:!true`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}

async function visibleFocus(control: Locator) {
  await expect(control).toBeFocused();
  await expect.poll(() => control.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return rect.left >= 0 && rect.right <= innerWidth + 1 && rect.top >= 0 && rect.bottom <= innerHeight + 1
      && Boolean(hit && (element.contains(hit) || hit.contains(element)));
  })).toBe(true);
}

async function arrangement(dialog: Locator, compact: boolean) {
  const footer = dialog.locator('[data-sgui-part="dialog-footer"] > div');
  await expect(footer).toHaveCSS('flex-direction', compact ? 'column' : 'row');
  const cancel = dialog.getByRole('button', { name: 'Cancel changes', exact: true });
  const save = dialog.getByRole('button', { name: 'Save course settings', exact: true });
  const step = dialog.getByText('Step 2 of 3: Review course settings', { exact: true });
  await expect.poll(async () => {
    const [a, b, s, f] = await Promise.all([cancel.boundingBox(), save.boundingBox(), step.boundingBox(), footer.boundingBox()]);
    if (!a || !b || !s || !f) return false;
    return compact
      ? a.y >= s.y + s.height && b.y >= a.y + a.height && Math.abs(a.width - f.width) <= 1 && Math.abs(b.width - f.width) <= 1
      : Math.abs(a.y - b.y) <= 1 && b.x >= a.x + a.width;
  }).toBe(true);
  expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
}

for (const [theme, density] of [['light', 'comfortable'], ['dark', 'compact']]) {
test(`independent portaled surfaces select local footer geometry in a wide viewport (${theme}/${density})`, async ({ page }) => {
  await story(page, theme, density);
  for (const kind of ['narrow', 'wide'] as const) {
    const opener = page.getByRole('button', { name: `Open ${kind} surface`, exact: true });
    await opener.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: `${kind === 'narrow' ? 'Narrow' : 'Wide'} surface settings`, exact: true });
    await visibleFocus(dialog.getByRole('textbox', { name: 'Surface field 1', exact: true }));
    await expect(dialog).toHaveCSS('container-name', 'sgui-app-modal');
    await expect(dialog).toHaveCSS('container-type', 'inline-size');
    const scope = dialog.locator('xpath=ancestor::*[@data-sgui-part="dialog-overlay"][1]');
    await expect(scope).toHaveAttribute('data-sgui-theme', theme);
    await expect(scope).toHaveAttribute('data-sgui-density', density);
    await expect.poll(() => dialog.evaluate(element => Math.round(element.getBoundingClientRect().width))).toBe(kind === 'narrow' ? 360 : 800);
    expect(await dialog.evaluate(element => !document.querySelector('#storybook-root')?.contains(element))).toBe(true);
    await arrangement(dialog, kind === 'narrow');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();
  }
});
}

test('live surface width changes keep native focus and update actions without viewport changes', async ({ page }) => {
  await story(page);
  await page.getByRole('button', { name: 'Open wide surface' }).click();
  const dialog = page.getByRole('dialog', { name: 'Wide surface settings', exact: true });
  const toggle = dialog.getByRole('button', { name: 'Toggle surface width', exact: true });
  await toggle.focus();
  for (const compact of [true, false, true]) {
    await page.keyboard.press('Enter');
    await expect.poll(() => dialog.evaluate(element => Math.round(element.getBoundingClientRect().width))).toBe(compact ? 360 : 800);
    await visibleFocus(toggle);
    await arrangement(dialog, compact);
    expect(await page.evaluate(() => innerWidth)).toBe(1440);
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open wide surface' })).toBeFocused();
});

test('local narrow surface preserves sticky tabs, panel scrolling and keyboard action access', async ({ page }) => {
  await story(page);
  await page.getByRole('button', { name: 'Open narrow surface' }).click();
  const dialog = page.getByRole('dialog', { name: 'Narrow surface settings' });
  const panel = dialog.getByRole('tabpanel');
  const tabs = dialog.getByRole('tablist');
  const before = await tabs.boundingBox();
  for (let index = 1; index <= 20; index++) {
    await visibleFocus(dialog.getByRole('textbox', { name: `Surface field ${index}`, exact: true }));
    await page.keyboard.press('Tab');
  }
  await visibleFocus(dialog.getByRole('button', { name: 'Cancel changes', exact: true }));
  await page.keyboard.press('Tab');
  await visibleFocus(dialog.getByRole('button', { name: 'Save course settings', exact: true }));
  expect(await panel.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  const after = await tabs.boundingBox();
  expect(before && after && Math.abs(before.y - after.y) <= 1).toBe(true);
  expect(await dialog.evaluate(element => element.scrollTop)).toBe(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open narrow surface' })).toBeFocused();
});

test('enlarged text and short viewport allow whole-dialog scrolling with visible keyboard focus', async ({ page }) => {
  await story(page);
  await page.setViewportSize({ width: 1440, height: 320 });
  await page.addStyleTag({ content: 'html { font-size: 200%; } [data-sgui-part="dialog-overlay"] * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }' });
  const opener = page.getByRole('button', { name: 'Open narrow surface', exact: true });
  await opener.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Narrow surface settings' });
  for (let index = 1; index <= 20; index++) {
    await visibleFocus(dialog.getByRole('textbox', { name: `Surface field ${index}`, exact: true }));
    await page.keyboard.press('Tab');
  }
  await visibleFocus(dialog.getByRole('button', { name: 'Cancel changes', exact: true }));
  await page.keyboard.press('Tab');
  await visibleFocus(dialog.getByRole('button', { name: 'Save course settings', exact: true }));
  expect(await dialog.evaluate(element => element.scrollHeight > element.clientHeight && element.scrollTop > 0)).toBe(true);
  expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await expect(dialog.locator('[data-sgui-part="dialog-footer"] > div')).toHaveCSS('flex-direction', 'column');
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
});
