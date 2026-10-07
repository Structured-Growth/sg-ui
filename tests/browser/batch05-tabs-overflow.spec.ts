import { test, expect, type Locator } from '@playwright/test';

async function fullyVisibleInStrip(tab: Locator) {
  await expect(tab).toBeFocused();
  await expect.poll(() => tab.evaluate(element => {
    const strip = element.closest('[role="tablist"]')!;
    const viewport = strip.getBoundingClientRect();
    const bounds = element.getBoundingClientRect();
    const left = viewport.left + strip.clientLeft;
    return bounds.left >= left - 1 && bounds.right <= left + strip.clientWidth + 1
      && bounds.left >= 0 && bounds.right <= innerWidth + 1;
  })).toBe(true);
}

async function associatedPanel(tab: Locator, panel: Locator, content: string) {
  await expect(tab).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toHaveText(content);
  expect(await tab.getAttribute('aria-controls')).toBe(await panel.getAttribute('id'));
  expect(await panel.getAttribute('aria-labelledby')).toBe(await tab.getAttribute('id'));
}

for (const locale of ['en-US', 'ar-EG']) {
  for (const activation of ['automatic', 'manual']) {
    for (const textSize of [100, 200]) {
      test(`${activation} activation and overflow at ${textSize}% text in ${locale}`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.setViewportSize({ width: 380, height: 720 });
        const story = activation === 'manual' ? 'manual-overflow' : 'narrow-overflow';
        await page.goto(`/iframe.html?id=migration-proofs-tabs--${story}&viewMode=story&globals=locale:${locale};a11y.manual:!true`);
        const list = page.getByRole('tablist', { name: 'Course settings' });
        await expect(list).toBeVisible();
        // Real rem-based enlargement, rather than mocked element rectangles.
        await page.addStyleTag({ content: `html { font-size: ${textSize}%; }` });
        expect(await list.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
        await expect(list).toHaveAttribute('aria-orientation', 'horizontal');
        const details = page.getByRole('tab', { name: 'Details', exact: true });
        const disabled = page.getByRole('tab', { name: 'Unavailable', exact: true });
        const access = page.getByRole('tab', { name: 'Access', exact: true });
        const history = page.getByRole('tab', { name: 'History', exact: true });
        const panel = page.getByRole('tabpanel');
        await expect(disabled).toHaveAttribute('aria-disabled', 'true');
        await details.focus();
        await associatedPanel(details, panel, 'Course details');
        const forward = locale === 'ar-EG' ? 'ArrowLeft' : 'ArrowRight';
        const backward = locale === 'ar-EG' ? 'ArrowRight' : 'ArrowLeft';
        await page.keyboard.press(forward);
        await fullyVisibleInStrip(access);
        if (activation === 'manual') {
          await expect(access).toHaveAttribute('aria-selected', 'false');
          await associatedPanel(details, panel, 'Course details');
          await page.keyboard.press('Space');
        }
        await associatedPanel(access, panel, 'Course access');
        await page.keyboard.press('End');
        await fullyVisibleInStrip(history);
        if (activation === 'manual') {
          await associatedPanel(access, panel, 'Course access');
          await page.keyboard.press('Enter');
        }
        await associatedPanel(history, panel, 'Course history');
        await page.keyboard.press('Tab');
        await expect(panel).toBeFocused();
        await page.keyboard.press('Shift+Tab');
        await fullyVisibleInStrip(history);
        await page.keyboard.press('Home');
        await fullyVisibleInStrip(details);
        if (activation === 'manual') {
          await associatedPanel(history, panel, 'Course history');
          await page.keyboard.press('Enter');
        }
        await associatedPanel(details, panel, 'Course details');
        // Reverse wrapping must reveal the opposite end too (including negative RTL scrollLeft).
        await page.keyboard.press(backward);
        await fullyVisibleInStrip(history);
        if (activation === 'manual') await page.keyboard.press('Enter');
        await associatedPanel(history, panel, 'Course history');
        expect(errors).toEqual([]);
      });
    }
  }
}
