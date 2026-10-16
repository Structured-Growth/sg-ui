import {expect, test} from '@playwright/test';

for (const hasTouch of [false, true]) test(`icon buttons center their icons at both densities (touch=${hasTouch})`, async ({browser, baseURL}) => {
  const context = await browser.newContext({baseURL, viewport:{width:1280,height:900}, hasTouch});
  const page = await context.newPage();
  await page.goto('/docs/components/icon-button');
  const icons = page.locator('[data-docs-preview] button svg');
  await expect(icons.first()).toBeVisible();
  for (const density of ['compact','comfortable']) {
    await expect(page.locator(`[data-docs-preview] [data-sgui-density="${density}"] button svg`).first()).toBeVisible();
  }
  await page.evaluate(() => document.fonts.ready);
  // Read one DOM snapshot: hydration can replace preview nodes between separate
  // indexed locator reads, leaving an nth() locator waiting for a removed icon.
  const samples = await icons.evaluateAll(nodes => nodes.map(svg => {
      const icon = svg.getBoundingClientRect();
      const button = svg.closest('button')!.getBoundingClientRect();
      return {x:icon.x+icon.width/2-button.x-button.width/2,y:icon.y+icon.height/2-button.y-button.height/2,
        density:svg.closest('[data-sgui-density]')?.getAttribute('data-sgui-density')};
  }));
  expect(samples.length).toBeGreaterThanOrEqual(3);
  expect(new Set(samples.map(sample=>sample.density))).toEqual(new Set(['compact','comfortable']));
  for (const centers of samples) {
    expect(Math.abs(centers.x)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(centers.y)).toBeLessThanOrEqual(0.5);
  }
  await page.screenshot({path:`/tmp/sgui-icon-button-centered-${hasTouch}.png`});
  await context.close();
});
