import { expect, test } from '@playwright/test';

// Engine touch emulation only. No physical-device, speech or real zoom claim.
test('auto coarse-pointer and explicit touch preserve control targets, tag spacing, activation and focus', async ({ browser, baseURL }, info) => {
  test.skip(info.project.name === 'firefox', 'Firefox Playwright does not implement hasTouch contexts');
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('/fixtures/?id=migration-proofs-taggroup--target-sizing&embed=true&globals=a11y.manual:!true');
    const media = await page.evaluate(() => ({ coarse: matchMedia('(any-pointer: coarse)').matches, touch: navigator.maxTouchPoints }));
    expect(media.coarse).toBe(true);
    // WebKit desktop emulates touch and coarse-pointer media while reporting
    // maxTouchPoints=0. Verify actual trusted touch dispatch rather than using
    // that navigator hint as a prerequisite for executing the interaction audit.
    await page.evaluate(() => {
      const touches: { trusted: boolean; count: number }[] = [];
      (window as unknown as { targetAuditTouches: typeof touches }).targetAuditTouches = touches;
      document.addEventListener('touchstart', event => touches.push({ trusted: event.isTrusted, count: event.touches.length }), true);
    });
    const measurements: unknown[] = [];
    for (const density of ['compact', 'comfortable']) for (const mode of ['auto', 'touch']) {
      const scope = page.getByTestId(`${density}-${mode}`);
      const remove = scope.getByRole('button', { name: 'Remove React', exact: true });
      await remove.scrollIntoViewIfNeeded();
      const geometry = await remove.evaluate(element => {
        const a = element.getBoundingClientRect();
        const siblings = [...element.closest('[data-sgui-part="tag-group"]')!.querySelectorAll('[data-sgui-part="tag-remove"]')];
        return { width: a.width, height: a.height, hit: element.contains(document.elementFromPoint(a.x + a.width / 2, a.y + a.height / 2)),
          overlaps: siblings.filter(other => other !== element).some(other => { const b = other.getBoundingClientRect(); return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }) };
      });
      measurements.push({ density, mode, ...geometry });
      expect(geometry.width).toBeGreaterThanOrEqual(44); expect(geometry.height).toBeGreaterThanOrEqual(44);
      expect(geometry.hit).toBe(true); expect(geometry.overlaps).toBe(false);
      for (const target of [scope.getByRole('button', { name: 'Add topic', exact: true }), scope.getByRole('button', { name: 'Remove added topic', exact: true }),
        scope.getByRole('checkbox').locator('xpath=ancestor::label[1]'), scope.getByRole('switch').locator('xpath=ancestor::label[1]'),
        scope.getByRole('button', { name: 'Actions', exact: true })]) {
        const bounds = (await target.boundingBox())!;
        expect(bounds.width).toBeGreaterThanOrEqual(44); expect(bounds.height).toBeGreaterThanOrEqual(44);
        measurements.push({ density, mode, control: await target.textContent(), width: bounds.width, height: bounds.height });
      }
      await remove.tap();
      await expect(remove).toHaveCount(0);
      const design = scope.getByRole('button', { name: 'Remove Design', exact: true });
      // Native collection navigation paints the surviving tag's focus indicator.
      const row = scope.getByRole('row', { name: 'Design', exact: true });
      await row.focus(); await page.keyboard.press('ArrowLeft');
      await expect(row).toBeFocused();
      const focus = await row.evaluate(element => { const css = getComputedStyle(element); return { width: css.outlineWidth, style: css.outlineStyle }; });
      expect(parseFloat(focus.width)).toBeGreaterThan(0); expect(focus.style).not.toBe('none');
      await scope.getByRole('button', { name: 'Add topic', exact: true }).tap();
      await expect(scope.getByRole('button', { name: 'Remove New topic', exact: true })).toBeVisible();
      await scope.getByRole('button', { name: 'Remove added topic', exact: true }).tap();
      await expect(scope.getByRole('button', { name: 'Remove New topic', exact: true })).toHaveCount(0);
      await scope.getByRole('checkbox').locator('xpath=ancestor::label[1]').tap();
      await expect(scope.getByRole('checkbox')).toBeChecked();
      await scope.getByRole('switch').locator('xpath=ancestor::label[1]').tap();
      await expect(scope.getByRole('switch')).toBeChecked();
      await scope.getByRole('button', { name: 'Actions', exact: true }).tap();
      const action = page.getByRole('menuitem', { name: 'Clear topics', exact: true });
      const actionBounds = (await action.boundingBox())!;
      expect(actionBounds.width).toBeGreaterThanOrEqual(44); expect(actionBounds.height).toBeGreaterThanOrEqual(44);
      await action.tap(); await expect(scope.getByText('No tags', { exact: true })).toBeVisible();
    }
    const touches = await page.evaluate(() => (window as unknown as { targetAuditTouches: { trusted: boolean; count: number }[] }).targetAuditTouches);
    expect(touches).toHaveLength(28); // Seven actual single-touch activations in each of four scopes.
    expect(touches.every(event => event.trusted && event.count === 1)).toBe(true);
    expect(errors).toEqual([]);
    await info.attach('emulated-coarse-targets', { body: JSON.stringify({ media, touches, measurements }), contentType: 'application/json' });
  } finally { await context.close(); }
});

for (const [id, label] of [['migration-proofs-datagrid--client', 'Score'], ['migration-proofs-catalog-grid-interaction--client', 'Status']] as const) {
  test(`${id}: column resize handles remain available without width menus`, async ({ page }, info) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/fixtures/?id=${id}&embed=true&globals=a11y.manual:!true`);
    await expect(page.getByRole('button', { name: `Width of ${label}`, exact: true })).toHaveCount(0);
    await expect(page.getByRole('slider', { name: new RegExp(`^Resize ${label}\\b`) })).toBeVisible();
  });
}
