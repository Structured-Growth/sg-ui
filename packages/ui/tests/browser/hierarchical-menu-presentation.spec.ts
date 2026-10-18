import { expect, test } from '@playwright/test';

for (const direction of ['ltr', 'rtl']) test(`menu motion reverses on Back and follows ${direction}`, async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`/fixtures/?id=migration-proofs-hierarchicalmenu--independent&globals=direction:${direction};locale:${direction === 'rtl' ? 'ar-EG' : 'en-US'}`);
  const first = page.getByRole('navigation', { name: 'First navigation' });
  await page.evaluate(() => {
    const observations: unknown[] = [];
    Object.assign(window, { menuMotionObservations: observations });
    document.addEventListener('animationstart', event => {
      const target = event.target as HTMLElement;
      if (!target.dataset.direction) return;
      for (const animation of target.getAnimations()) {
        const frames = (animation.effect as KeyframeEffect).getKeyframes();
        const transform = String(frames[0]?.transform ?? 'none');
        // Firefox retains rem/calc() in keyframes; DOMMatrix accepts resolved
        // lengths only. Resolve those frames through CSS before reading direction.
        const probe = document.createElement('div');
        Object.assign(probe.style, { position: 'fixed', visibility: 'hidden', transform });
        target.append(probe);
        const x = new DOMMatrix(getComputedStyle(probe).transform).m41; probe.remove();
        observations.push({ direction: target.dataset.direction, localeDirection: getComputedStyle(target).direction, x });
      }
    });
  });
  await first.getByRole('button', { name: 'Course settings', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(first.getByRole('button', { name: 'People', exact: true })).toBeFocused();
  await info.attach('forward-runtime', { body: JSON.stringify(await first.evaluate(node => {
    const level = node.parentElement!, css = getComputedStyle(level);
    return { direction: level.dataset.direction, animation: css.animation, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, animations: level.getAnimations().map(animation => ({ state: animation.playState, frames: (animation.effect as KeyframeEffect).getKeyframes() })) };
  })), contentType: 'application/json' });
  const directions = () => page.evaluate(() => (window as unknown as { menuMotionObservations: { direction: string }[] }).menuMotionObservations.map(row => row.direction));
  // Focus commits before the browser's animationstart event. Observe forward
  // motion before replacing its level with Back, otherwise the driver cancels it.
  await expect.poll(directions).toContain('forward');
  await first.getByRole('button', { name: 'Back to Course settings' }).focus();
  await page.keyboard.press('Enter');
  await expect(first.getByRole('button', { name: 'Course settings', exact: true })).toBeFocused();
  await expect.poll(directions).toContain('back');
  const observations = await page.evaluate(() => (window as unknown as { menuMotionObservations: { direction: string; localeDirection: string; x: number }[] }).menuMotionObservations);
  const forward = observations.find(row => row.direction === 'forward')!;
  const back = observations.find(row => row.direction === 'back')!;
  expect(forward).toBeDefined(); expect(back).toBeDefined();
  expect(forward.localeDirection).toBe(direction);
  expect(Math.sign(forward.x)).toBe(direction === 'rtl' ? -1 : 1);
  expect(Math.sign(back.x)).toBe(-Math.sign(forward.x));
  expect(errors).toEqual([]);
  await info.attach('motion', { body: JSON.stringify(observations), contentType: 'application/json' });
});

test('menu retains focus and visible Back with enlarged text, reduced motion and forced colors in a narrow host', async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 360, height: 640 });
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await page.goto('/fixtures/?id=migration-proofs-hierarchicalmenu--independent&globals=direction:rtl;locale:ar-EG');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const first = page.getByRole('navigation', { name: 'First navigation' });
  await first.getByRole('button', { name: 'Course settings', exact: true }).focus(); await page.keyboard.press('Enter');
  await expect(first.getByRole('button', { name: 'People', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(first.getByRole('button', { name: 'Invite learner', exact: true })).toBeFocused();
  await first.getByRole('button', { name: 'Learner 15', exact: true }).focus();
  const back = first.getByRole('button', { name: 'Back to People' });
  await expect(back).toBeInViewport();
  expect(await first.evaluate(node => node.getAnimations({ subtree: true }).length)).toBe(0);
  const geometry = await first.evaluate(node => { const r = node.getBoundingClientRect(); return { x: r.x, right: r.right, viewport: innerWidth, width: r.width, overflow: document.documentElement.scrollWidth - innerWidth }; });
  expect(geometry.overflow).toBeLessThanOrEqual(1);
  expect(geometry.x).toBeGreaterThanOrEqual(0); expect(geometry.right).toBeLessThanOrEqual(geometry.viewport);
  await back.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab'); await expect(back).toBeFocused();
  const focus = await back.evaluate(node => { const css = getComputedStyle(node); return { width: parseFloat(css.outlineWidth), style: css.outlineStyle, adjust: css.forcedColorAdjust }; });
  expect(focus.width).toBeGreaterThan(0); expect(focus.style).not.toBe('none'); expect(focus.adjust).not.toBe('none');
  await info.attach('narrow-enlarged-forced-menu', { body: await page.screenshot(), contentType: 'image/png' });
  await info.attach('geometry-focus', { body: JSON.stringify({ geometry, focus }), contentType: 'application/json' });
  await page.keyboard.press('Enter'); await expect(first.getByRole('button', { name: 'People', exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});
