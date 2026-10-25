import { expect, test, type Locator } from '@playwright/test';

async function border(element: Locator) {
  return element.evaluate(node => {
    const css = getComputedStyle(node), box = node.getBoundingClientRect();
    return { width: box.width, height: box.height, startWidth: parseFloat(css.borderInlineStartWidth),
      startStyle: css.borderInlineStartStyle, startColor: css.borderInlineStartColor, endColor: css.borderInlineEndColor,
      outlineWidth: parseFloat(css.outlineWidth), outlineOffset: parseFloat(css.outlineOffset), outlineStyle: css.outlineStyle };
  });
}
for (const forcedColors of ['none', 'active'] as const) for (const kind of ['navigation', 'list', 'calendar'] as const) {
  test(`${kind} keeps selection separate from focus (${forcedColors})`, async ({ page }, info) => {
    await page.emulateMedia({ forcedColors });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const snapshots: unknown[] = [];
    // Two representative combinations; not the historical full Cartesian proposal.
    for (const [theme,density,direction] of [['light','compact','ltr'],['dark','comfortable','rtl']] as const) {
      const id = kind === 'navigation' ? 'migration-proofs-navigation--host-routing-and-expansion' : kind === 'list' ? 'migration-proofs-list--selected-actions' : 'migration-proofs-calendar--speech-semantics';
      await page.goto(`/fixtures/?id=${id}&embed=true&globals=theme:${theme};density:${density};direction:${direction}`);
      const active = await page.evaluate(() => matchMedia('(forced-colors: active)').matches);
      test.skip(forcedColors === 'active' && !active, 'Engine cannot emulate forced colors; no normal-color substitution.');
      if (kind === 'calendar') {
        // React Aria puts grid semantics on td and interaction/styles on its button.
        const selected = page.getByRole('gridcell', { selected: true }).getByRole('button');
        await expect(selected).toHaveCount(1);
        expect(await selected.evaluate(node => getComputedStyle(node).direction)).toBe(direction);
        const before = await selected.boundingBox();
        await selected.focus();
        await page.keyboard.press('ArrowRight');
        const focused = page.locator('[data-focus-visible][data-focused]');
        await expect(selected).not.toBeFocused();
        await expect(focused).toBeFocused();
        const ring = await selected.evaluate(node => {
          const css = getComputedStyle(node, '::after');
          return { content: css.content, width: parseFloat(css.borderTopWidth), style: css.borderTopStyle, color: css.borderTopColor, inset: css.insetInlineStart, pointerEvents: css.pointerEvents };
        });
        if (active) { expect(ring.content).toBe('""'); expect(ring.width).toBe(1); expect(ring.style).toBe('solid');
        expect(ring.inset).toBe('3px'); expect(ring.pointerEvents).toBe('none'); } else { expect(ring.content).toBe('none'); expect(ring.width).toBe(0); expect(await selected.evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe(await focused.evaluate(node => getComputedStyle(node).backgroundColor)); }
        const after = await selected.boundingBox();
        expect(after!.width).toBe(before!.width); expect(after!.height).toBe(before!.height);
        expect((await border(focused)).outlineWidth).toBeGreaterThanOrEqual(2);
        snapshots.push({ theme, density, direction, ring, before, after });
      } else {
        const first = kind === 'navigation' ? page.getByRole('link', { name: 'Algebra', exact: true }) : page.getByRole('button', { name: /Algebra/ });
        const second = kind === 'navigation' ? page.getByRole('link', { name: 'Geometry', exact: true }) : page.getByRole('button', { name: /Geometry/ });
        expect(await second.evaluate(node => getComputedStyle(node).direction)).toBe(direction);
        const before = await border(second);
        await second.focus();
        await page.keyboard.press(kind === 'navigation' ? 'Enter' : 'Space');
        await expect(second).toHaveAttribute(kind === 'navigation' ? 'aria-current' : 'aria-pressed', kind === 'navigation' ? 'page' : 'true');
        if (kind === 'navigation') await expect(first).not.toHaveAttribute('aria-current', 'page');
        else await expect(first).toHaveAttribute('aria-pressed', 'false');
        const after = await border(second);
        expect(after.startWidth).toBe(3);
        expect(before.startStyle).toBe('solid');
        expect(after.startStyle).toBe('solid');
        expect(after.startColor).not.toBe('rgba(0, 0, 0, 0)');
        expect(after.outlineStyle).toBe('solid'); expect(after.outlineWidth).toBeGreaterThanOrEqual(2);
        expect(after.outlineOffset).toBeGreaterThanOrEqual(0);
        expect(Math.abs(after.width - before.width)).toBeLessThan(0.1);
        expect(Math.abs(after.height - before.height)).toBeLessThan(0.1);
        await first.focus();
        await expect(first).toBeFocused();
        await expect(second).not.toBeFocused();
        expect((await border(second)).startWidth).toBe(3);
        snapshots.push({ theme, density, direction, before, after });
      }
      await info.attach(`${theme}-${density}-${direction}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
    }
    expect(errors).toEqual([]);
    await info.attach('state-geometry', { body: JSON.stringify({ kind, forcedColors, snapshots }), contentType: 'application/json' });
  });
}
