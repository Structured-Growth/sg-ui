import { test, expect, type Locator } from '@playwright/test';

async function paths(icon: Locator) {
  return icon.locator('path').evaluateAll(nodes => nodes.map(node => node.getAttribute('d')));
}

for (const direction of ['ltr', 'rtl'] as const) {
  test(`${direction} alignment keeps logical icons and physical commands distinct under host control`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/iframe.html?id=editors-textalignmenucontrol--direction-commands&viewMode=story&globals=direction:${direction};a11y.manual:!true`);
    const trigger = page.getByRole('button', { name: 'Start Align', exact: true });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    const menu = page.getByRole('menu', { name: 'Text alignment' });
    const left = menu.getByRole('menuitemradio', { name: 'Left Align', exact: true });
    const right = menu.getByRole('menuitemradio', { name: 'Right Align', exact: true });
    const start = menu.getByRole('menuitemradio', { name: 'Start Align', exact: true });
    const end = menu.getByRole('menuitemradio', { name: 'End Align', exact: true });
    const leftPaths = await paths(left.locator('svg'));
    const rightPaths = await paths(right.locator('svg'));
    expect(leftPaths).not.toEqual(rightPaths);
    for (const physical of [left, right]) {
      await expect(physical.locator('svg')).toHaveCount(1);
      expect(await physical.locator('svg').evaluate(node => getComputedStyle(node).transform)).toBe('none');
    }
    for (const [item, alignment, side] of [[start, 'start', direction === 'rtl' ? 'right' : 'left'], [end, 'end', direction === 'rtl' ? 'left' : 'right']] as const) {
      const icons = item.locator(`[data-align="${alignment}"] svg`);
      await expect(icons).toHaveCount(2);
      const visibleIndex = side === 'left' ? 0 : 1;
      await expect(icons.nth(visibleIndex)).toBeVisible();
      await expect(icons.nth(1 - visibleIndex)).toBeHidden();
      expect(await paths(icons.nth(visibleIndex))).toEqual(side === 'left' ? leftPaths : rightPaths);
    }
    const triggerIcons = trigger.locator('[data-align="start"] svg');
    await expect(triggerIcons.nth(direction === 'rtl' ? 1 : 0)).toBeVisible();
    await expect(triggerIcons.nth(direction === 'rtl' ? 0 : 1)).toBeHidden();
    await expect(start).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();

    const requests: string[] = [];
    for (const [command, keys] of [['left', ['Home']], ['right', ['Home', 'ArrowDown', 'ArrowDown']], ['start', ['End', 'ArrowUp']], ['end', ['End']]] as const) {
      await page.keyboard.press('ArrowDown');
      for (const key of keys) await page.keyboard.press(key);
      await expect(menu.getByRole('menuitemradio', { name: `${command[0].toUpperCase()}${command.slice(1)} Align`, exact: true })).toBeFocused();
      await page.keyboard.press('Enter');
      requests.push(command);
      await expect(menu).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await expect(page.getByRole('status', { name: 'Host requests' })).toHaveText(requests.join(', '));
      await expect(page.getByRole('status', { name: 'Host alignment' })).toHaveText('start');
    }
    expect(errors).toEqual([]);
  });

  test(`${direction} live host replacement updates checked alignment and skips unavailable indent on native keys`, async ({ page }) => {
    await page.goto(`/iframe.html?id=editors-textalignmenucontrol--direction-commands&viewMode=story&globals=direction:${direction};a11y.manual:!true`);
    const trigger = page.getByRole('button', { name: 'Start Align', exact: true });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    const menu = page.getByRole('menu', { name: 'Text alignment' });
    await expect(menu.getByRole('menuitemradio', { name: 'Start Align', exact: true })).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('F2');
    await expect(menu).toBeVisible();
    await expect(page.getByRole('button', { name: 'End Align', exact: true })).toBeVisible();
    await expect(menu.getByRole('menuitemradio', { name: 'Start Align', exact: true })).toHaveAttribute('aria-checked', 'false');
    const end = menu.getByRole('menuitemradio', { name: 'End Align', exact: true });
    await expect(end).toHaveAttribute('aria-checked', 'true');
    await expect(menu.locator('[role="menuitemradio"][aria-checked="true"]')).toHaveCount(1);
    for (const name of ['Outdent', 'Indent']) await expect(menu.getByRole('menuitem', { name, exact: true })).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('End');
    await expect(end).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitemradio', { name: 'Left Align', exact: true })).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(end).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    const updatedTrigger = page.getByRole('button', { name: 'End Align', exact: true });
    await expect(updatedTrigger).toBeFocused();
    const icons = updatedTrigger.locator('[data-align="end"] svg');
    await expect(icons.nth(direction === 'rtl' ? 0 : 1)).toBeVisible();
    await expect(icons.nth(direction === 'rtl' ? 1 : 0)).toBeHidden();
    await expect(page.getByRole('status', { name: 'Host requests' })).toHaveText('No requests');
  });
}
