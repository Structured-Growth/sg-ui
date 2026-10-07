import { expect, test, type Locator, type Page } from '@playwright/test';

// Host statuses remain in the DOM while a modal hides its background from AT.
// Their text proves request delivery only; it does not prove spoken announcements.
const story = '/iframe.html?id=editors-insertcontentmenucontrol--native-insertion-handoff&viewMode=story&globals=a11y.manual:!true';

async function clickVisibleCenter(page: Page, target: Locator) {
  await expect(target).toBeVisible();
  const bounds = await target.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.width).toBeGreaterThan(0);
  expect(bounds!.height).toBeGreaterThan(0);
  const point = { x: bounds!.x + bounds!.width / 2, y: bounds!.y + bounds!.height / 2 };
  expect(await target.evaluate((element, center) => {
    const hit = element.ownerDocument.elementFromPoint(center.x, center.y);
    return hit === element || (hit !== null && element.contains(hit));
  }, point)).toBe(true);
  await page.mouse.click(point.x, point.y);
}

// Programmatic trigger focus establishes setup; keyboard presses perform menu entry.
test.beforeEach(async ({ page }) => { await page.goto(story); });

for (const [command, navigation] of [
  ['Image', 'Home'], ['Horizontal Rule', 'ArrowDown'], ['Columns Layout', 'End'],
] as const) {
  test(`native ${command} activation delivers once, keeps the host form safe and returns focus`, async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Insert', exact: true });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Image', exact: true })).toBeFocused();
    await page.keyboard.press(navigation);
    await expect(page.getByRole('menuitem', { name: command, exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('[role="menu"]')).toHaveCount(0);
    await expect(page.locator('[role="status"][aria-label="Host insertion requests"]')).toHaveText(`Original host: ${command}`);
    if (command !== 'Horizontal Rule') {
      const dialog = page.getByRole('dialog', { name: `Host ${command} insertion` });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('textbox', { name: 'Host insertion description' })).toBeFocused();
      await page.keyboard.type('Host-owned detail');
      if (command === 'Image') await page.keyboard.press('Escape');
      else await dialog.getByRole('button', { name: 'Finish host insertion' }).click();
      await expect(dialog).toHaveCount(0);
    }
    await expect(trigger).toBeFocused();
    // Cross native focus restoration and a task boundary before checking no duplicate delivery.
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await expect(page.locator('[role="status"][aria-label="Host insertion requests"]')).toHaveText(`Original host: ${command}`);
    await expect(page.locator('[role="status"][aria-label="Host form submissions"]')).toHaveText('0');
  });
}

test('open insertion menu uses replacement callbacks and current availability on native entry', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Insert', exact: true });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('F2');
  await expect(page.locator('[role="status"][aria-label="Insertion callback owner"]')).toHaveText('Replacement host');
  await expect(page.getByRole('menuitem', { name: 'Image', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Host Image insertion' });
  await expect(dialog.getByRole('textbox', { name: 'Host insertion description' })).toBeFocused();
  await expect(page.locator('[role="status"][aria-label="Host insertion requests"]')).toHaveText('Replacement host: Image');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('F3');
  for (const name of ['Image', 'Columns Layout']) {
    await expect(page.getByRole('menuitem', { name, exact: true })).toHaveAttribute('aria-disabled', 'true');
  }
  await page.keyboard.press('End');
  const rule = page.getByRole('menuitem', { name: 'Horizontal Rule', exact: true });
  await expect(rule).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(rule).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(rule).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(trigger).toBeFocused();
  await expect(page.locator('[role="status"][aria-label="Host insertion requests"]')).toHaveText('Replacement host: Image; Replacement host: Horizontal Rule');
  await expect(page.locator('[role="status"][aria-label="Host form submissions"]')).toHaveText('0');
});

test('unavailable insertion commands skip native entry, Escape cancels and disabled trigger cannot open', async ({ page }) => {
  await page.getByRole('button', { name: 'Make dialog commands unavailable' }).click();
  const trigger = page.getByRole('button', { name: 'Insert', exact: true });
  await trigger.focus();
  for (const entry of ['ArrowUp', 'Enter', 'Space']) {
    await page.keyboard.press(entry);
    await expect(page.getByRole('menuitem', { name: 'Horizontal Rule', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="menu"]')).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
  await trigger.click();
  await clickVisibleCenter(page, page.getByRole('menuitem', { name: 'Image', exact: true }));
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.locator('[role="status"][aria-label="Host insertion requests"]')).toHaveText('No insertion requests');
  await expect(page.locator('[role="status"][aria-label="Host form submissions"]')).toHaveText('0');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await page.getByRole('button', { name: 'Toggle insertion disabled' }).click();
  await expect(trigger).toBeDisabled();
  // Real keyboard tabbing bypasses the disabled trigger, and pointer input cannot open it.
  await page.keyboard.press('Tab');
  await expect(trigger).not.toBeFocused();
  await clickVisibleCenter(page, trigger);
  await expect(page.locator('[role="menu"]')).toHaveCount(0);
  await expect(page.locator('[role="status"][aria-label="Host insertion requests"]')).toHaveText('No insertion requests');
  await expect(page.locator('[role="status"][aria-label="Host form submissions"]')).toHaveText('0');
});
