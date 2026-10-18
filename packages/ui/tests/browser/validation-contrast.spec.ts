import { expect, test, type Locator, type Page } from '@playwright/test';

async function paintedText(page: Page, label: Locator) {
  const clip = await label.evaluate(node => {
    const range = node.ownerDocument.createRange(); range.selectNodeContents(node);
    const r = range.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  const png = await page.screenshot({ clip });
  const observation = await page.evaluate(async encoded => {
    const image = new Image(); image.src = 'data:image/png;base64,' + encoded; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext('2d')!; context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, image.width, image.height).data;
    let min = 1, max = 0, ink = 0;
    for (let y = Math.ceil(image.height * .1); y < image.height * .9; y++) for (let x = Math.ceil(image.width * .1); x < image.width * .9; x++) {
      const offset = (y * image.width + x) * 4;
      const rgb = [data[offset], data[offset + 1], data[offset + 2]].map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
      const value = rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
      min = Math.min(min, value); max = Math.max(max, value); if (value < .3) ink++;
    }
    return { min, max, ink, contrast: (max + .05) / (min + .05), width: image.width, height: image.height };
  }, png.toString('base64'));
  expect(observation.ink).toBeGreaterThan(5);
  expect(observation.contrast).toBeGreaterThanOrEqual(4.5);
  return { observation, png };
}

for (const forcedColors of ['none', 'active'] as const) test(`validation success has actual text paint and keyboard focus (${forcedColors})`, async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ forcedColors });
  await page.goto(`/fixtures/?id=acceptance-validation-contrast--success&args=forced:${forcedColors === 'active'}`);
  expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(forcedColors === 'active');
  const observations = [];
  for (const identity of ['material', 'apple']) for (const contrast of ['standard', 'increased']) {
    const scope = page.getByTestId(`${identity}-${contrast}`);
    const label = scope.getByTestId('success-message');
    await expect(label).toHaveText('Validation succeeded. Your draft is ready.');
    await expect(scope.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    const { observation, png } = await paintedText(page, label);
    if (contrast === 'increased') expect(observation.contrast).toBeGreaterThanOrEqual(7);
    await info.attach(`${identity}-${contrast}-text`, { body: png, contentType: 'image/png' });
    observations.push({ identity, contrast, forcedColors, paint: observation, styles: await label.evaluate(node => {
      const css = getComputedStyle(node); return { color: css.color, forcedColorAdjust: css.forcedColorAdjust };
    }) });
  }
  // Keyboard entry, rather than programmatic focus, must expose the focus indicator.
  await page.keyboard.press('Tab');
  const first = page.getByTestId('material-standard').getByRole('button', { name: 'Review draft' });
  await expect(first).toBeFocused();
  const focus = await first.evaluate(node => { const css = getComputedStyle(node); return { width: parseFloat(css.outlineWidth), style: css.outlineStyle, color: css.outlineColor }; });
  expect(focus.width).toBeGreaterThan(0); expect(focus.style).not.toBe('none');
  await info.attach('validation-scopes-focused', { body: await page.screenshot(), contentType: 'image/png' });
  await info.attach('paint-observations', { body: JSON.stringify({ observations, focus }), contentType: 'application/json' });
  expect(errors).toEqual([]);
});
