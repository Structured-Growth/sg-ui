import { expect, test } from '@playwright/test';

for (const forcedColors of ['none', 'active'] as const) {
  test(`toggle selection has independent geometry and focus (${forcedColors})`, async ({ page }, info) => {
    await page.emulateMedia({ forcedColors });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/fixtures/?id=migration-proofs-togglebutton--selection-geometry');
    const active = await page.evaluate(() => matchMedia('(forced-colors: active)').matches);
    test.skip(forcedColors === 'active' && !active, 'Engine cannot apply forced-colors media; no system-color result.');
    const observations: unknown[] = [];
    for (const theme of ['light', 'dark']) for (const density of ['compact', 'comfortable']) for (const mode of ['pointer', 'touch']) {
      const scope = page.getByTestId(`${theme}-${density}-${mode}`);
      const toggle = scope.getByRole('button', { name: 'Bold', exact: true });
      const read = () => toggle.evaluate(element => {
        const box = element.getBoundingClientRect(), css = getComputedStyle(element);
        return { width: box.width, height: box.height, borderStyle: css.borderTopStyle, borderWidth: parseFloat(css.borderTopWidth), backgroundClip: css.backgroundClip,
          outlineStyle: css.outlineStyle, outlineWidth: parseFloat(css.outlineWidth), outlineOffset: parseFloat(css.outlineOffset) };
      });
      await toggle.scrollIntoViewIfNeeded();
      const rest = await read();
      expect(rest.borderStyle).toBe('solid');
      await toggle.focus();
      await page.keyboard.press('Space');
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      await expect(toggle).toHaveAttribute('data-focus-visible');
      const selected = await read();
      expect(selected.borderStyle).toBe('double');
      expect(selected.borderWidth).toBe(3);
      expect(selected.backgroundClip).toBe('padding-box');
      // Hover and forced-color paints must not reset the selected border gap.
      await toggle.hover();
      await expect(toggle).toHaveAttribute('data-hovered');
      const hovered = await read();
      expect(hovered.backgroundClip).toBe('padding-box');
      expect(hovered.borderStyle).toBe('double');
      expect(hovered.borderWidth).toBe(3);
      expect(Math.abs(hovered.width - rest.width)).toBeLessThan(0.1);
      expect(Math.abs(hovered.height - rest.height)).toBeLessThan(0.1);
      await page.mouse.move(0, 0);
      expect(selected.outlineStyle).toBe('solid');
      expect(selected.outlineWidth).toBeGreaterThanOrEqual(2);
      expect(selected.outlineOffset).toBeGreaterThanOrEqual(0);
      expect(Math.abs(selected.width - rest.width)).toBeLessThan(0.1);
      expect(Math.abs(selected.height - rest.height)).toBeLessThan(0.1);
      if (mode === 'touch') {
        expect(selected.width).toBeGreaterThanOrEqual(44);
        expect(selected.height).toBeGreaterThanOrEqual(44);
      }
      const group = scope.getByRole('radiogroup', { name: 'View', exact: true });
      const grid = group.getByRole('radio', { name: 'Grid', exact: true });
      const cards = group.getByRole('radio', { name: 'Cards', exact: true });
      await expect(grid).toBeChecked();
      const before = await cards.boundingBox();
      await cards.focus();
      await page.keyboard.press('Space');
      await expect(cards).toBeChecked();
      await expect(grid).not.toBeChecked();
      const after = await cards.boundingBox();
      expect(Math.abs(after!.width - before!.width)).toBeLessThan(0.1);
      expect(Math.abs(after!.height - before!.height)).toBeLessThan(0.1);
      const hit = await cards.evaluate(element => {
        const rect = element.getBoundingClientRect();
        return element.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
      });
      expect(hit).toBe(true);
      // Moving native keyboard focus leaves selection geometry visible.
      await page.keyboard.press('Tab');
      await expect(toggle).toHaveAttribute('aria-pressed', 'true');
      expect((await read()).borderStyle).toBe('double');
      await toggle.focus();
      await page.keyboard.press('Space');
      await expect(toggle).toHaveAttribute('aria-pressed', 'false');
      expect((await read()).borderStyle).toBe('solid');
      observations.push({ theme, density, mode, rest, selected, hovered, groupBefore: before, groupAfter: after, hit });
    }
    expect(errors).toEqual([]);
    await info.attach('toggle-geometry', { body: JSON.stringify({ forcedColors, active, observations, physicalTouch: false }), contentType: 'application/json' });
    await info.attach('toggle-rendered-review', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
  });
}
