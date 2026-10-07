import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  for (const enlarged of [false, true]) {
    test(`frame image and content slots reflow: ${theme}, ${enlarged ? '200% text' : '320px'}`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width: enlarged ? 640 : 320, height: 720 });
      await page.goto(`/iframe.html?id=components-classcardframe--responsive-slots&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      const cases = page.getByTestId('frame-cases');
      await expect(cases).toBeVisible();
      await expect(cases.locator('xpath=ancestor::*[@data-sgui-scope][1]')).toHaveAttribute('data-sgui-theme', theme);
      if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; }' });
      for (const name of ['default', 'minimum', 'custom', 'style override']) {
        const frame = page.getByTestId(`case-${name}`).getByRole('article');
        await expect(frame.getByRole('heading')).toContainText('AdvancedCourseMaterial');
        const image = frame.getByRole('img', { name: 'Course illustration' });
        await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
        const geometry = await frame.evaluate(element => {
          const bounds = element.getBoundingClientRect();
          const slots = Array.from(element.querySelectorAll('[data-sgui-part^="class-card-"]'));
          const img = element.querySelector('img')!.getBoundingClientRect();
          return { width: bounds.width, fits: slots.every(slot => slot.scrollWidth <= slot.clientWidth + 1), imageWidth: img.width, imageHeight: img.height, max: getComputedStyle(element).maxInlineSize, available: element.parentElement!.getBoundingClientRect().width };
        });
        expect(geometry.width).toBeCloseTo(Math.min(parseFloat(geometry.max), geometry.available), 0);
        expect(geometry.fits, `${name}: all slot content remains inside the frame`).toBe(true);
        expect(geometry.imageWidth).toBeLessThan(geometry.width);
        expect(geometry.imageWidth / geometry.imageHeight).toBeCloseTo(2, 1);
        expect(geometry.max).toBe(({ default: '420px', minimum: '360px', custom: '500px', 'style override': '280px' } as Record<string, string>)[name]);
        const action = frame.getByRole('button', { name: 'Open course' });
        await action.focus();
        await expect(action).toBeFocused();
        expect(await action.evaluate(element => {
          const bounds = element.getBoundingClientRect();
          const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
          return bounds.left >= 0 && bounds.right <= innerWidth && bounds.top >= 0 && bounds.bottom <= innerHeight && Boolean(hit && element.contains(hit));
        }), 'footer action is unobscured after native focus scrolling').toBe(true);
      }
      await expect(page.getByTestId('case-empty').locator('[data-sgui-part="class-card-footer"]')).toHaveCount(0);
      await expect(page.getByTestId('case-no-footer').locator('[data-sgui-part="class-card-footer"]')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      expect(errors).toEqual([]);
      await info.attach('representative-frame', { body: await page.getByTestId('case-default').getByRole('article').screenshot(), contentType: 'image/png' });
    });
  }
}

test('width changes retain native frame identity and image ratio', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 720 });
  await page.goto('/iframe.html?id=components-classcardframe--width-states&viewMode=story&globals=a11y.manual:!true');
  const frame = page.getByRole('article');
  await expect(frame).toBeVisible();
  const original = await frame.elementHandle();
  for (const [label, width] of [['Use 360', 360], ['Use 500', 500], ['Use default', 420]] as const) {
    await page.getByRole('button', { name: label, exact: true }).click();
    expect(await frame.evaluate((element, prior) => element === prior, original)).toBe(true);
    expect((await frame.boundingBox())!.width).toBeCloseTo(width, 0);
    const image = frame.getByRole('img', { name: 'Course illustration' });
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
    const bounds = (await image.boundingBox())!;
    expect(bounds.width / bounds.height).toBeCloseTo(2, 1);
    expect(bounds.width).toBeLessThan(width);
  }
});
