import { test, expect, type Locator } from '@playwright/test';

async function visibleFocus(tab: Locator) {
  await expect(tab).toBeFocused();
  await expect.poll(() => tab.evaluate(element => {
    const strip = element.closest('[role="tablist"]')!;
    const viewport = strip.getBoundingClientRect();
    const bounds = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return bounds.left >= viewport.left + strip.clientLeft - 1
      && bounds.right <= viewport.left + strip.clientLeft + strip.clientWidth + 1
      && bounds.left >= 0 && bounds.right <= innerWidth + 1
      && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
  })).toBe(true);
}

async function wiredPanel(tab: Locator, panel: Locator, content: string) {
  await expect(tab).toHaveAttribute('aria-selected', 'true');
  await expect(panel).toHaveText(content);
  expect(await tab.getAttribute('aria-controls')).toBe(await panel.getAttribute('id'));
  expect(await panel.getAttribute('aria-labelledby')).toBe(await tab.getAttribute('id'));
}

// The experimental Tabs matrix is a prerequisite (batch05), not catalog evidence.
for (const { density, scope } of [
  { density: 'default', scope: 'comfortable' },
  { density: 'default', scope: 'compact' },
  { density: 'comfortable', scope: 'compact' },
  { density: 'compact', scope: 'comfortable' },
]) {
  for (const activation of ['automatic', 'manual']) {
    for (const locale of ['en-US', 'ar-EG']) {
      for (const textSize of [100, 200]) {
        test(`catalog ${density} in ${scope}/${activation}/${locale} at ${textSize}% text`, async ({ page }) => {
          const errors: string[] = [];
          page.on('pageerror', error => errors.push(error.message));
          await page.setViewportSize({ width: 380, height: 720 });
          await page.goto(`/iframe.html?id=layout-apppagetabs--native-keyboard&viewMode=story&args=density:${density};activation:${activation}&globals=locale:${locale};density:${scope};theme:${density === 'compact' ? 'dark' : 'light'};a11y.manual:!true`);
          const first = page.getByRole('tablist', { name: 'Course sections', exact: true });
          const second = page.getByRole('tablist', { name: 'Independent sections', exact: true });
          await expect(first).toBeVisible();
          await page.addStyleTag({ content: `html { font-size: ${textSize}%; }` });
          const details = first.getByRole('tab', { name: 'Details', exact: true });
          const access = first.getByRole('tab', { name: 'Access', exact: true });
          const history = first.getByRole('tab', { name: 'History', exact: true });
          const other = second.getByRole('tab', { name: 'Details', exact: true });
          const panel = page.getByRole('tabpanel').nth(0);
          const otherPanel = page.getByRole('tabpanel').nth(1);
          await expect(page.getByRole('link')).toHaveCount(0); // href stays inert in tab mode.
          await expect(first).toHaveAttribute('aria-orientation', 'horizontal');
          await expect(first.getByRole('tab', { name: 'Unavailable' })).toHaveAttribute('aria-disabled', 'true');
          expect(await first.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
          const height = await details.evaluate(element => getComputedStyle(element).minHeight);
          expect(parseFloat(height)).toBeCloseTo(((density === 'default' ? scope : density) === 'compact' ? 32 : 44) * textSize / 100, 0);
          expect(await details.getAttribute('id')).not.toBe(await other.getAttribute('id'));
          expect(await details.getAttribute('aria-controls')).not.toBe(await other.getAttribute('aria-controls'));
          // Native Tab establishes keyboard modality and a visible focus ring.
          await page.keyboard.press('Tab');
          await visibleFocus(details);
          await wiredPanel(details, panel, 'Course details');
          const forward = locale === 'ar-EG' ? 'ArrowLeft' : 'ArrowRight';
          const backward = locale === 'ar-EG' ? 'ArrowRight' : 'ArrowLeft';
          await page.keyboard.press(forward);
          await visibleFocus(access);
          if (activation === 'manual') {
            await wiredPanel(details, panel, 'Course details');
            await expect(access).toHaveAttribute('aria-selected', 'false');
            await page.keyboard.press('Space');
          }
          await wiredPanel(access, panel, 'Course access');
          await page.keyboard.press('End');
          await visibleFocus(history);
          if (activation === 'manual') {
            await wiredPanel(access, panel, 'Course access');
            await page.keyboard.press('Enter');
          }
          await wiredPanel(history, panel, 'Course history');
          await page.keyboard.press('Tab');
          await expect(panel).toBeFocused();
          await page.keyboard.press('Shift+Tab');
          await visibleFocus(history);
          await page.keyboard.press('Home');
          await visibleFocus(details);
          if (activation === 'manual') {
            await wiredPanel(history, panel, 'Course history');
            await page.keyboard.press('Enter');
          }
          await wiredPanel(details, panel, 'Course details');
          await page.keyboard.press(backward);
          await visibleFocus(history);
          if (activation === 'manual') await page.keyboard.press('Enter');
          await wiredPanel(history, panel, 'Course history');
          await wiredPanel(other, otherPanel, 'Course details');
          expect(await second.evaluate(element => element.scrollLeft)).toBe(0);
          await page.keyboard.press('Tab');
          await expect(panel).toBeFocused();
          await page.keyboard.press('Tab');
          await visibleFocus(other);
          await page.keyboard.press(forward);
          const otherAccess = second.getByRole('tab', { name: 'Access', exact: true });
          await visibleFocus(otherAccess);
          if (activation === 'manual') await page.keyboard.press('Enter');
          await wiredPanel(otherAccess, otherPanel, 'Course access');
          await wiredPanel(history, panel, 'Course history');
          expect(errors).toEqual([]);
        });
      }
    }
  }
}
