import { test, expect, type Locator } from '@playwright/test';

async function visibleVertically(tab: Locator) {
  await expect(tab).toBeFocused();
  await expect.poll(() => tab.evaluate(element => {
    const list = element.closest('[role="tablist"]')!;
    const top = list.getBoundingClientRect().top + list.clientTop;
    const bounds = element.getBoundingClientRect();
    return bounds.top >= top - 1 && bounds.bottom <= top + list.clientHeight + 1;
  })).toBe(true);
}

for (const locale of ['en-US', 'ar-EG']) {
  for (const activation of ['automatic', 'manual']) {
    test(`vertical ${activation} owns overflow and Up/Down focus in ${locale}`, async ({ page }) => {
      await page.setViewportSize({ width: 680, height: 720 });
      const story = activation === 'manual' ? 'vertical-manual-overflow' : 'vertical-overflow';
      await page.goto(`/iframe.html?id=migration-proofs-tabs--${story}&viewMode=story&globals=locale:${locale};a11y.manual:!true`);
      const list = page.getByRole('tablist', { name: 'Course settings' });
      await expect(list).toHaveAttribute('aria-orientation', 'vertical');
      await page.addStyleTag({ content: 'html { font-size: 200%; }' });
      expect(await list.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
      expect(await list.evaluate(el => getComputedStyle(el).flexDirection)).toBe('column');
      const host = page.getByTestId('tabs-orientation-host');
      const other = page.getByRole('tablist', { name: 'Other settings' });
      const details = list.getByRole('tab', { name: 'Details', exact: true });
      const access = list.getByRole('tab', { name: 'Access', exact: true });
      const history = list.getByRole('tab', { name: 'History', exact: true });
      await expect(list.getByRole('tab', { name: 'Unavailable' })).toHaveAttribute('aria-disabled', 'true');
      await details.focus();
      const ownedScroll = () => page.evaluate(() => {
        const host = document.querySelector('[data-testid="tabs-orientation-host"]')!;
        const other = document.querySelector('[role="tablist"][aria-label="Other settings"]')!;
        return [scrollX, scrollY, host.scrollLeft, host.scrollTop, other.scrollLeft, other.scrollTop];
      });
      const initial = await ownedScroll();
      await page.keyboard.press('ArrowDown');
      await visibleVertically(access);
      await expect(access).toHaveAttribute('aria-selected', activation === 'manual' ? 'false' : 'true');
      if (activation === 'manual') {
        await expect(details).toHaveAttribute('aria-selected', 'true');
        await page.keyboard.press('Space');
      }
      await expect(access).toHaveAttribute('aria-selected', 'true');
      await page.keyboard.press('End');
      await visibleVertically(history);
      if (activation === 'manual') await page.keyboard.press('Enter');
      await expect(history).toHaveAttribute('aria-selected', 'true');
      expect(await list.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
      await page.keyboard.press('Home');
      await visibleVertically(details);
      if (activation === 'manual') await page.keyboard.press('Enter');
      await page.keyboard.press('ArrowUp');
      await visibleVertically(history);
      expect(await ownedScroll()).toEqual(initial);
      expect(await other.evaluate(el => el.scrollTop)).toBe(0);
      // Selection indicator stays on the logical inline end, including RTL.
      expect(await history.evaluate(el => getComputedStyle(el).borderInlineEndWidth)).toBe('2px');
      await expect(host).toBeVisible();
    });
  }
}

test('default horizontal RTL keeps Left navigation after vertical orientation is added', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-tabs--narrow-overflow&viewMode=story&globals=locale:ar-EG;a11y.manual:!true');
  const list = page.getByRole('tablist', { name: 'Course settings' });
  await expect(list).toHaveAttribute('aria-orientation', 'horizontal');
  expect(await list.evaluate(el => getComputedStyle(el).flexDirection)).toBe('row');
  await list.getByRole('tab', { name: 'Details', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(list.getByRole('tab', { name: 'Access', exact: true })).toBeFocused();
  await expect(list.getByRole('tab', { name: 'Access', exact: true })).toHaveAttribute('aria-selected', 'true');
});
