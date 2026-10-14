import type { Locator } from '@playwright/test';

/** Wait for observed native scrolling, without assuming a wheel delta or scrollend support. */
export async function waitForNativeScrollToSettle(region: Locator) {
  await region.evaluate(async node => {
    const sample = () => {
      const content = node.firstElementChild?.getBoundingClientRect();
      const bounds = node.getBoundingClientRect();
      return [node.scrollTop, node.scrollLeft, bounds.x, bounds.y, bounds.width, bounds.height,
        content?.x ?? 0, content?.y ?? 0, content?.width ?? 0, content?.height ?? 0];
    };
    let previous = sample();
    let stableFrames = 0;
    // Scroll offsets and descendant geometry must agree across consecutive
    // rendered frames before another independent region is manipulated.
    while (stableFrames < 6) {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      const current = sample();
      stableFrames = current.every((value, index) => Math.abs(value - previous[index]) < .1) ? stableFrames + 1 : 0;
      previous = current;
    }
  });
}
