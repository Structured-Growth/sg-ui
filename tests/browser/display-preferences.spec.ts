import { test, expect, type Page, type Locator } from '@playwright/test';

async function story(page: Page, id: string) {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=a11y.manual:!true`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}

async function unobscured(control: Locator) {
  await expect(control).toBeFocused();
  await expect.poll(() => control.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const hit = document.elementFromPoint(x, y);
    const panel = element.closest('[role="tabpanel"]')?.getBoundingClientRect();
    return bounds.left >= -1 && bounds.right <= innerWidth + 1 && bounds.top >= -1 && bounds.bottom <= innerHeight + 1
      && (!panel || (bounds.top >= panel.top - 1 && bounds.bottom <= panel.bottom + 1))
      && Boolean(hit && (element.contains(hit) || hit.contains(element)));
  }), { message: 'focused control is inside its scrollport and visible viewport, with no overlay over its center' }).toBe(true);
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  (page as Page & { browserErrors?: string[] }).browserErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { browserErrors?: string[] }).browserErrors, 'browser runtime errors').toEqual([]);
});

for (const dark of [false, true]) {
  for (const enlargedText of [false, true]) {
    test(`tabbed modal keeps every native tab stop unobscured: ${dark ? 'dark' : 'light'}, ${enlargedText ? '200% text and spacing' : '320px reflow'}`, async ({ page }, info) => {
      // A 320 CSS-pixel layout is the effective width of a 1280px viewport at 400% zoom.
      // Root text scaling tests 200% text; neither operation pretends to drive browser chrome zoom.
      await page.setViewportSize(enlargedText ? { width: 640, height: 480 } : { width: 320, height: 640 });
      await story(page, dark ? 'overlays-appmodal--dark-tabbed' : 'overlays-appmodal--text-reflow');
      if (enlargedText) await page.addStyleTag({ content: 'html { font-size: 200%; } [data-sgui-part="dialog-overlay"] * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } [data-sgui-part="dialog-overlay"] p { margin-bottom: 2em !important; }' });
      const trigger = page.getByRole('button', { name: 'Open modal', exact: true });
      await trigger.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('textbox', { name: 'Field 1', exact: true })).toBeFocused();
      const header = page.locator('[data-sgui-part="dialog-header"]');
      const footer = page.locator('[data-sgui-part="dialog-footer"]');
      const headerTop = await header.evaluate(element => element.getBoundingClientRect().top);
      const footerTop = await footer.evaluate(element => element.getBoundingClientRect().top);
      for (let index = 1; index <= 20; index++) {
        await unobscured(page.getByRole('textbox', { name: `Field ${index}`, exact: true }));
        if (index < 20) await page.keyboard.press('Tab');
      }
      await page.keyboard.press('Tab');
      await unobscured(page.getByRole('button', { name: 'Cancel', exact: true }));
      await page.keyboard.press('Tab');
      const next = page.getByRole('button', { name: 'Next', exact: true });
      await unobscured(next);
      if (!enlargedText) expect(await header.evaluate(element => element.getBoundingClientRect().top)).toBeCloseTo(headerTop, 0);
      if (!enlargedText) expect(await footer.evaluate(element => element.getBoundingClientRect().top)).toBeCloseTo(footerTop, 0);
      const surface = page.locator('[data-sgui-part="dialog-surface"]');
      expect(await surface.evaluate(element => element.scrollWidth <= element.clientWidth + 1), 'modal has no horizontal overflow').toBe(true);
      await page.keyboard.press('Enter');
      await expect(page.getByText('Step 2 of 3', { exact: true })).toBeVisible();
      await page.getByRole('tab', { name: 'Details', exact: true }).focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.getByRole('tab', { name: 'Access', exact: true })).toHaveAttribute('aria-selected', 'true');
      await page.keyboard.press('Tab');
      await unobscured(page.getByRole('textbox', { name: 'Permission', exact: true }));
      await page.keyboard.press('Tab');
      const help = page.getByRole('button', { name: 'Help', exact: true });
      await unobscured(help);
      const dialogScroll = await page.getByRole('dialog', { name: 'Course settings', exact: true }).evaluate(element => element.scrollTop);
      await page.keyboard.press('Enter');
      await unobscured(page.getByRole('textbox', { name: 'Note', exact: true }));
      expect(await page.getByRole('dialog', { name: 'Course settings', exact: true }).evaluate(element => element.scrollTop), 'portaled focus does not scroll its outer dialog').toBe(dialogScroll);
      await page.keyboard.press('Escape');
      await expect(help).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      await info.attach('reflow-scope', { body: JSON.stringify({ viewport: page.viewportSize(), enlargedText, dark, nativeTabStops: 22, browser: info.project.name }), contentType: 'application/json' });
    });
  }
}

test('reduced motion stops loading animation without removing pending semantics', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await story(page, 'migration-proofs-progress--loading');
  const progress = page.getByRole('progressbar', { name: 'Loading courses' });
  const fill = progress.locator('span[aria-hidden] > span');
  expect(await fill.evaluate(element => getComputedStyle(element).animationName)).not.toBe('none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await fill.evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await expect(progress).not.toHaveAttribute('aria-valuenow');
  await story(page, 'migration-proofs-progress--circular-loading');
  expect(await page.getByRole('progressbar').locator('svg').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await story(page, 'migration-proofs-button--themes-and-density');
  const saving = page.getByRole('button', { name: 'Saving', exact: true }).first();
  expect(await saving.getByRole('progressbar', { name: 'Pending' }).count()).toBe(1);
  expect(await saving.getByRole('progressbar', { name: 'Pending' }).evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  expect(await saving.evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
  await expect(saving).toHaveAttribute('aria-disabled', 'true');
});

test('forced-colors preserves system keyboard focus and pending/disabled indications', async ({ page }, info) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await story(page, 'migration-proofs-button--themes-and-density');
  const supported = await page.evaluate(() => matchMedia('(forced-colors: active)').matches);
  await info.attach('forced-colors-capability', { body: JSON.stringify({ browser: info.project.name, supported }), contentType: 'application/json' });
  // Every configured engine must actually apply the emulated preference.
  expect(supported).toBe(true);
  const systemColors = await page.evaluate(() => {
    const probe = document.createElement('span');
    document.body.append(probe);
    const result = {} as Record<string, string>;
    for (const color of ['Highlight', 'ButtonText', 'GrayText']) {
      probe.style.color = color;
      result[color] = getComputedStyle(probe).color;
    }
    probe.remove();
    return result;
  });
  const cancel = page.getByRole('button', { name: 'Cancel', exact: true }).first();
  await cancel.focus();
  await page.keyboard.press('Tab');
  const details = page.getByRole('button', { name: 'Details', exact: true }).first();
  await expect(details).toBeFocused();
  const style = await details.evaluate(element => {
    const css = getComputedStyle(element);
    return { outline: css.outlineStyle, width: parseFloat(css.outlineWidth), outlineColor: css.outlineColor, border: css.borderStyle, borderWidth: parseFloat(css.borderWidth) };
  });
  expect(style.outline).toBe('solid');
  expect(style.width).toBeGreaterThanOrEqual(2);
  if (supported) { expect(style.outlineColor).toBe(systemColors.Highlight); expect(style.border).toBe('solid'); expect(style.borderWidth).toBeGreaterThanOrEqual(1); }
  await expect(page.getByRole('button', { name: 'Unavailable', exact: true }).first()).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Saving', exact: true }).first()).toHaveAttribute('aria-disabled', 'true');
  await story(page, 'migration-proofs-dialog--nested-form');
  await page.getByRole('button', { name: 'Create course', exact: true }).click();
  await page.getByRole('textbox', { name: 'Course name' }).press('Tab');
  const field = page.getByRole('combobox', { name: 'Category' });
  await expect(field).toBeFocused();
  expect(await field.evaluate(element => parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThanOrEqual(2);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Create course', exact: true })).toBeFocused();
});


test('initial footer action focus remains visible with enlarged modal chrome', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 480 });
  await story(page, 'overlays-appmodal--action-focus');
  await page.addStyleTag({ content: 'html { font-size: 200%; } [data-sgui-part="dialog-overlay"] * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }' });
  const trigger = page.getByRole('button', { name: 'Open modal', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await unobscured(page.getByRole('button', { name: 'Next', exact: true }));
  await page.keyboard.press('Enter');
  await expect(page.getByText('Step 2 of 3', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});
