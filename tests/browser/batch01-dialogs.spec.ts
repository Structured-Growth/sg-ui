import { test, expect, type Page, type Locator } from '@playwright/test';

async function story(page: Page, id = 'overlays-appmodal--nested-overlays') {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=a11y.manual:!true`);
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

test('three overlay levels dismiss in order and return native focus at each level', async ({ page }) => {
  await story(page);
  const parentTrigger = page.getByRole('button', { name: 'Open parent', exact: true });
  await parentTrigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Parent name' })).toBeFocused();
  const childTrigger = page.getByRole('button', { name: 'Open child', exact: true });
  await childTrigger.click();
  await expect(page.getByRole('textbox', { name: 'Child name' })).toBeFocused();
  const child = page.getByRole('dialog', { name: 'Child settings' });
  for (const key of ['Tab', 'Shift+Tab']) {
    for (let index = 0; index < 6; index++) {
      await page.keyboard.press(key);
      expect(await child.evaluate(element => element.contains(document.activeElement))).toBe(true);
    }
  }
  const guidance = page.getByRole('button', { name: 'Open guidance' });
  await guidance.click();
  await expect(page.getByRole('textbox', { name: 'Guidance note' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Child guidance' })).toHaveCount(0);
  await expect(guidance).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(child).toHaveCount(0);
  await expect(childTrigger).toBeFocused();
  await expect(page.getByRole('dialog', { name: 'Parent settings' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(parentTrigger).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('Dismissals: child:escape, parent:escape');
});

test('menu and combobox consume Escape before the modal and retain portal scope at narrow width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await story(page);
  await page.getByRole('button', { name: 'Open parent' }).click();
  const actions = page.getByRole('button', { name: 'Open actions' });
  await actions.focus();
  await page.keyboard.press('Enter');
  const item = page.getByRole('menuitem', { name: 'Review settings' });
  await visibleFocus(item);
  const scope = item.locator('xpath=ancestor::*[@data-sgui-scope][1]');
  await expect(scope).toHaveAttribute('data-sgui-theme', 'dark');
  await expect(scope).toHaveAttribute('data-sgui-density', 'compact');
  await expect(scope).toHaveAttribute('dir', 'rtl');
  await expect(scope).toHaveAttribute('lang', 'ar-EG');
  await page.keyboard.press('Escape');
  await expect(actions).toBeFocused();
  const category = page.getByRole('combobox', { name: 'Category' });
  await category.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(category).toBeFocused();
  await expect(page.getByRole('dialog', { name: 'Parent settings' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('status')).toHaveText('Dismissals: parent:escape');
});

test('outside pointer dismisses only the child; explicit close then restores the parent trigger', async ({ page }) => {
  await story(page);
  const trigger = page.getByRole('button', { name: 'Open parent' });
  await trigger.click();
  const childTrigger = page.getByRole('button', { name: 'Open child' });
  await childTrigger.click();
  await page.mouse.click(4, 4);
  await expect(page.getByRole('dialog', { name: 'Child settings' })).toHaveCount(0);
  await expect(childTrigger).toBeFocused();
  await expect(page.getByRole('dialog', { name: 'Parent settings' })).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('Dismissals: child:outside, parent:close-button');
});

for (const dark of [false, true]) {
  test(`short viewport and enlarged text keep tabbed content and footer focus reachable (${dark ? 'dark' : 'light'})`, async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 320 });
    await story(page, dark ? 'overlays-appmodal--dark-tabbed' : 'overlays-appmodal--text-reflow');
    await page.addStyleTag({ content: 'html { font-size: 200%; } [data-sgui-part="dialog-overlay"] * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }' });
    const trigger = page.getByRole('button', { name: 'Open modal', exact: true });
    await trigger.focus();
    await page.keyboard.press('Enter');
    for (let index = 1; index <= 20; index++) {
      await visibleFocus(page.getByRole('textbox', { name: `Field ${index}`, exact: true }));
      await page.keyboard.press('Tab');
    }
    await visibleFocus(page.getByRole('button', { name: 'Cancel', exact: true }));
    await page.keyboard.press('Tab');
    await visibleFocus(page.getByRole('button', { name: 'Next', exact: true }));
    expect(await page.locator('[data-sgui-part="dialog-surface"]').evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });
}
