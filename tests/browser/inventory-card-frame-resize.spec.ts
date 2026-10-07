import { expect, test } from '@playwright/test';

for (const layout of ['flex', 'grid']) {
  for (const theme of ['light', 'dark']) {
    for (const enlarged of [false, true]) {
      test(`parent resize and slot replacement retain focused action: ${layout}, ${theme}, ${enlarged ? '200% text' : 'narrow'}`, async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.setViewportSize({ width: enlarged ? 800 : 360, height: 900 });
        await page.goto(`/iframe.html?id=components-classcardframe--${layout}-parent-resize&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
        const example = page.getByTestId('resize-example');
        await expect(example).toBeVisible();
        await expect(example.locator('xpath=ancestor::*[@data-sgui-scope][1]')).toHaveAttribute('data-sgui-theme', theme);
        if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; }' });
        const frame = example.getByRole('article');
        const action = frame.getByRole('button', { name: 'Resize course preview', exact: true });
        const originalFrame = await frame.elementHandle();
        const originalAction = await action.elementHandle();
        const originalBody = await frame.locator('[data-sgui-part="class-card-body"]').elementHandle();
        await action.focus();
        const widths: number[] = [];
        for (const [state, requests] of [['expanded', 0], ['compact', 1], ['expanded', 2]] as const) {
          if (requests) await action.press(requests === 1 ? 'Enter' : 'Space');
          await expect(example).toHaveAttribute('data-state', state);
          await expect(example.getByLabel('Resize requests')).toHaveText(String(requests));
          await expect(action).toBeFocused();
          expect(await frame.evaluate((node, prior) => node === prior, originalFrame)).toBe(true);
          expect(await action.evaluate((node, prior) => node === prior, originalAction)).toBe(true);
          expect(await frame.locator('[data-sgui-part="class-card-body"]').evaluate((node, prior) => node === prior, originalBody)).toBe(true);
          const image = frame.getByRole('img', { name: state === 'compact' ? 'Footer landscape' : 'Header portrait' });
          await expect(frame.getByRole('img')).toHaveCount(1);
          await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
          const geometry = await frame.evaluate(element => {
            const bounds = element.getBoundingClientRect();
            const media = element.querySelector('img')!.getBoundingClientRect();
            return {
              width: bounds.width, available: element.parentElement!.getBoundingClientRect().width,
              max: getComputedStyle(element).maxInlineSize,
              fits: Array.from(element.querySelectorAll('[data-sgui-part^="class-card-"]')).every(slot => slot.scrollWidth <= slot.clientWidth + 1),
              imageWidth: media.width, ratio: media.width / media.height,
            };
          });
          expect(geometry.max).toBe('420px');
          expect(geometry.width).toBeCloseTo(Math.min(420, geometry.available), 0);
          expect(geometry.fits, 'replaced header/footer content fits its slots').toBe(true);
          expect(geometry.imageWidth).toBeLessThan(geometry.width);
          expect(geometry.ratio).toBeCloseTo(state === 'compact' ? 2 : 2 / 3, 2);
          widths.push(geometry.width);
          await expect.poll(() => action.evaluate(element => {
            const bounds = element.getBoundingClientRect();
            const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
            return bounds.left >= 0 && bounds.right <= innerWidth && bounds.top >= 0 && bounds.bottom <= innerHeight && Boolean(hit && element.contains(hit));
          }), { message: 'retained focused action stays visible and unobscured after slot/parent replacement' }).toBe(true);
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
        }
        expect(widths[1]).toBeLessThan(widths[0]!);
        expect(widths[2]).toBeCloseTo(widths[0]!, 0);
        expect(errors).toEqual([]);
      });
    }
  }
}
