import { test, expect, type Locator } from '@playwright/test';

async function offset(panel: Locator) {
  return panel.evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).m41);
}
for (const locale of ['en-US', 'ar-EG']) {
  test(`${locale}: drill motion mirrors, interrupted Back restores focus, reduced motion suppresses animation`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/fixtures/?id=navigation-sidenavigation--${locale === 'en-US' ? 'english' : 'arabic'}-drill-motion&globals=a11y.manual:!true`);
    const scope = page.getByTestId('navigation-locale');
    await expect(scope).toHaveAttribute('lang', locale);
    await expect(scope).toHaveAttribute('dir', locale === 'en-US' ? 'ltr' : 'rtl');
    const nav = scope.getByRole('navigation', { name: 'Course workspace navigation' });
    // Freeze each native CSS animation at its first frame, before animationend.
    // This is a transform-direction assertion, not a timing/perceptual-motion review.
    await nav.evaluate(node => node.addEventListener('animationstart', event => {
      const target = event.target as HTMLElement;
      if (!target.matches('[data-direction]')) return;
      for (const animation of target.getAnimations()) { animation.pause(); animation.currentTime = 0; }
    }));
    const settings = nav.getByRole('button', { name: 'Settings', exact: true });
    await settings.focus();
    await settings.press('Enter');
    const forward = nav.locator('[data-direction="forward"]');
    await expect(forward).toBeVisible();
    await expect.poll(() => offset(forward)).toBe(locale === 'en-US' ? 16 : -16);
    const back = forward.getByRole('button', { name: 'Settings', exact: true });
    await expect(back).toBeFocused();
    // Reverse before forward completes: the same menu owner must restore its trigger.
    await back.press('Enter');
    const backward = nav.locator('[data-direction="back"]');
    await expect(backward).toBeVisible();
    await expect.poll(() => offset(backward)).toBe(locale === 'en-US' ? -16 : 16);
    await expect(settings).toBeFocused();
    await backward.evaluate(node => node.getAnimations().forEach(animation => animation.finish()));
    await expect(nav.locator('[data-direction]')).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await settings.press('Enter');
    const reduced = nav.locator('[data-direction="forward"]');
    await expect(reduced).toHaveCSS('animation-name', 'none');
    await expect(reduced.getByRole('button', { name: 'Settings', exact: true })).toBeFocused();
    expect(await reduced.evaluate(node => node.getAnimations().length)).toBe(0);
    await reduced.getByRole('button', { name: 'Settings', exact: true }).press('Enter');
    await expect(settings).toBeFocused();
  });
}
