import { expect, test } from '@playwright/test';

// Existing fixed, source-backed reference example; no new fixture or shared state.
for (const colorScheme of ['light', 'dark'] as const) {
  test(`neutral filled Button has keyboard pressed feedback in ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce', contrast: 'no-preference' });
    await page.goto('/docs/components/button');
    const button = page.getByRole('button', { name: 'View details', exact: true });
    await expect(button).toHaveAttribute('data-tone', 'neutral');
    await expect(button).toHaveAttribute('data-variant', 'filled');
    await expect(button.locator('xpath=ancestor::*[@data-docs-preview]')).toHaveAttribute('data-sgui-theme', colorScheme);
    const background = () => button.evaluate(node => getComputedStyle(node).backgroundColor);
    const resting = await background();
    await button.hover();
    await expect(button).toHaveAttribute('data-hovered');
    const hovered = await background();
    expect(hovered).not.toBe(resting);
    await page.mouse.move(0, 0);
    await expect(button).not.toHaveAttribute('data-hovered');
    // Native focus positions the existing fixed example, then actual Space holds a press.
    await button.focus();
    await page.keyboard.down('Space');
    try {
      await expect(button).toHaveAttribute('data-pressed');
      await expect(button).toHaveAttribute('data-focus-visible');
      await expect.poll(background).toBe(hovered);
      const focus = await button.evaluate(node => {
        const css = getComputedStyle(node);
        return { style: css.outlineStyle, width: parseFloat(css.outlineWidth) };
      });
      expect(focus.style).toBe('solid');
      expect(focus.width).toBeGreaterThan(0);
    } finally {
      await page.keyboard.up('Space');
    }
    await expect(button).not.toHaveAttribute('data-pressed');
    await expect.poll(background).toBe(resting);
  });
}
