import { test, expect, type Locator } from '@playwright/test';

async function reachable(control: Locator) {
  await expect(control).toBeFocused();
  await expect.poll(() => control.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    let top = 0, bottom = innerHeight, left = 0, right = innerWidth;
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const css = getComputedStyle(parent);
      const clip = parent.getBoundingClientRect();
      if (/auto|scroll|hidden|clip/.test(css.overflowY)) {
        top = Math.max(top, clip.top); bottom = Math.min(bottom, clip.bottom);
      }
      if (/auto|scroll|hidden|clip/.test(css.overflowX)) {
        left = Math.max(left, clip.left); right = Math.min(right, clip.right);
      }
    }
    const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
    return bounds.width > 0 && bounds.height > 0 && bounds.left >= left - 1 && bounds.right <= right + 1
      && bounds.top >= top - 1 && bounds.bottom <= bottom + 1
      && Boolean(hit && (element.contains(hit) || hit.contains(element)));
  })).toBe(true);
}

for (const size of ['medium', 'large']) {
  for (const viewport of [
    { name: 'ordinary', width: 1024, height: 768, enlarged: false },
    { name: 'narrow', width: 320, height: 640, enlarged: false },
    { name: 'short enlarged', width: 640, height: 320, enlarged: true },
    { name: 'narrow short enlarged', width: 320, height: 320, enlarged: true },
  ]) {
    test(`${size} header: ${viewport.name} preserves whole controls and native reachability`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`/iframe.html?id=migration-proofs-dialog--${size}-header-reflow&viewMode=story&globals=a11y.manual:!true`);
      if (viewport.enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; } [data-sgui-part="dialog-overlay"] * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }' });
      const opener = page.getByRole('button', { name: 'Open header reflow', exact: true });
      await opener.focus(); await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Custom chrome settings', exact: true });
      const header = dialog.locator('[data-sgui-part="dialog-header"]');
      await expect(header.getByRole('heading', { name: 'Course settings with host supplied header details' })).toHaveCount(1);
      const help = header.getByRole('button', { name: 'Header help', exact: true });
      if (viewport.name === 'ordinary') {
        const headingBounds = await header.getByRole('heading').boundingBox();
        const closeBounds = await header.getByRole('button', { name: 'Close', exact: true }).boundingBox();
        expect(closeBounds!.y).toBeLessThan(headingBounds!.y + headingBounds!.height);
      }
      const close = header.getByRole('button', { name: 'Close', exact: true });
      // A control taller than its outer scrollport cannot be revealed by focus scrolling.
      expect(await help.evaluate(element => element.getBoundingClientRect().height <= element.closest('[role="dialog"]')!.clientHeight)).toBe(true);
      for (let index = 1; index <= 12; index++) {
        await reachable(dialog.getByRole('textbox', { name: `Custom field ${index}`, exact: true }));
        await page.keyboard.press('Tab');
      }
      await reachable(dialog.getByRole('button', { name: 'Cancel', exact: true }));
      await page.keyboard.press('Tab'); await reachable(dialog.getByRole('button', { name: 'Save', exact: true }));
      await page.keyboard.press('Tab'); await reachable(help);
      await page.keyboard.press('Enter'); await expect(header.getByText('Host supplied guidance', { exact: true })).toBeVisible();
      await reachable(help);
      await page.keyboard.press('Tab'); await reachable(close);
      await page.keyboard.press('Shift+Tab'); await reachable(help);
      await page.keyboard.press('Tab'); await reachable(close);
      expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
      await page.keyboard.press('Enter'); await expect(dialog).toHaveCount(0);
      await expect(page.getByRole('status')).toHaveText('close-button'); await expect(opener).toBeFocused();
    });
  }
}
