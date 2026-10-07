import { test, expect, type Locator, type Page } from '@playwright/test';

const placements = ['bottom start', 'bottom end', 'top start', 'top end'] as const;
// Each placement covers both themes, both directions and both text sizes.
const scopes = [
  { theme: 'light', dir: 'ltr', enlarged: false },
  { theme: 'dark', dir: 'rtl', enlarged: true },
  { theme: 'light', dir: 'rtl', enlarged: true },
  { theme: 'dark', dir: 'ltr', enlarged: false },
] as const;

async function wholeAndHitTested(locator: Locator) {
  await expect.poll(() => locator.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const inside = rect.width > 0 && rect.height > 0 && rect.left >= 0 && rect.top >= 0 &&
      rect.right <= innerWidth && rect.bottom <= innerHeight;
    const points = [[rect.left + 3, rect.top + 3], [rect.right - 3, rect.top + 3],
      [rect.left + 3, rect.bottom - 3], [rect.right - 3, rect.bottom - 3],
      [rect.left + rect.width / 2, rect.top + rect.height / 2]];
    return inside && points.every(([x, y]) => {
      const hit = document.elementFromPoint(x, y);
      return hit !== null && (hit === element || element.contains(hit));
    });
  })).toBe(true);
}

for (const placement of placements) for (const scope of scopes) for (const host of [false, true]) {
  test(`${placement}, ${scope.theme}/${scope.dir}/${scope.enlarged ? 'enlarged' : 'normal'}, ${host ? 'scroll host' : 'viewport edge'}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 640, height: 720 });
    const args = `placement:${placement};theme:${scope.theme};dir:${scope.dir};enlarged:${scope.enlarged}`;
    await page.goto(`/iframe.html?id=migration-proofs-popover-collision--${host ? 'scrollable-host' : 'viewport-edge'}&viewMode=story&args=${encodeURIComponent(args)}&globals=a11y.manual:!true`);
    const trigger = page.getByRole('button', { name: 'Open settings', exact: true });
    await wholeAndHitTested(trigger);
    const initialDocumentScroll = await documentScroll(page);
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Collision settings' });
    const overlay = dialog.locator('xpath=ancestor::*[@data-sgui-scope][1]');
    const field = dialog.getByRole('textbox', { name: 'Note', exact: true });
    const review = dialog.getByRole('button', { name: 'Review note', exact: true });
    await expect(dialog).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(field).toBeFocused();
    await page.keyboard.type('Native draft');
    const observations: unknown[] = [];

    async function assertState(label: string) {
      for (const target of [overlay, dialog, field, review]) await wholeAndHitTested(target);
      await expect(overlay).toHaveAttribute('data-sgui-theme', scope.theme);
      await expect(overlay).toHaveAttribute('dir', scope.dir);
      await expect(overlay).toHaveAttribute('lang', 'en-US');
      await expect(overlay).toHaveAttribute('data-sgui-density', 'comfortable');
      expect(await overlay.evaluate(element => getComputedStyle(element).direction)).toBe(scope.dir);
      if (scope.enlarged) expect(await overlay.evaluate(element => getComputedStyle(element).fontSize)).toBe('24px');
      const resolved = host ? /^(top|bottom)$/ : placement.startsWith('bottom') ? 'top' : 'bottom';
      await expect(overlay).toHaveAttribute('data-placement', resolved);
      await expect.poll(async () => {
        const anchor = await trigger.boundingBox();
        const box = await overlay.boundingBox();
        const side = await overlay.getAttribute('data-placement');
        if (!anchor || !box) return false;
        const gap = side === 'top' ? anchor.y - (box.y + box.height) : box.y - (anchor.y + anchor.height);
        const horizontalOverlap = Math.min(anchor.x + anchor.width, box.x + box.width) - Math.max(anchor.x, box.x);
        return gap >= -1 && gap <= 16 && horizontalOverlap > 0;
      }).toBe(true);
      await expect(field).toBeFocused();
      await expect(field).toHaveValue('Native draft');
      expect(await documentScroll(page)).toEqual(initialDocumentScroll);
      observations.push({ label, requested: placement, resolved: await overlay.getAttribute('data-placement'),
        anchor: await trigger.boundingBox(), overlay: await overlay.boundingBox(), dialog: await dialog.boundingBox(),
        field: await field.boundingBox(), review: await review.boundingBox() });
    }

    await assertState('opened');
    await page.setViewportSize({ width: 420, height: 640 });
    await assertState('live resize');
    if (host) {
      const scroller = page.getByTestId('collision-host');
      const scrollDiagnostics = [{ label: 'before host scroll', ...await scrollAnchorDiagnostics(overlay) }];
      const before = await trigger.boundingBox();
      // Native host scroll while modal focus stays inside. Wheel outside a modal is
      // intentionally locked; use the host's native scroll API, never focus repair.
      await scroller.evaluate(element => element.scrollBy({ top: 32, behavior: 'instant' }));
      await expect.poll(() => scroller.evaluate(element => element.scrollTop)).toBe(32);
      await expect.poll(async () => Math.round((before?.y ?? 0) - (await trigger.boundingBox())!.y)).toBe(32);
      try {
        await assertState('host scroll');
      } finally {
        scrollDiagnostics.push({ label: 'after host scroll assertion', ...await scrollAnchorDiagnostics(overlay) });
        await testInfo.attach('scroll-anchor-diagnostics', {
          body: JSON.stringify(scrollDiagnostics, null, 2), contentType: 'application/json',
        });
      }
    }
    await page.keyboard.press('Tab');
    await expect(review).toBeFocused();
    await wholeAndHitTested(review);
    await review.click();
    await expect(review).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(field).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await wholeAndHitTested(trigger);
    expect(await documentScroll(page)).toEqual(initialDocumentScroll);
    await testInfo.attach('resolved-collision-rectangles', { body: JSON.stringify(observations, null, 2), contentType: 'application/json' });
  });
}

async function documentScroll(page: Page) {
  return page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }));
}

// Read-only geometry in one browser evaluation, retained even when adjacency fails.
async function scrollAnchorDiagnostics(overlay: Locator) {
  return overlay.evaluate(element => {
    const host = document.querySelector<HTMLElement>('[data-testid="collision-host"]')!;
    const anchor = host.querySelector<HTMLButtonElement>('button')!;
    const box = element.getBoundingClientRect();
    const target = anchor.getBoundingClientRect();
    const side = element.getAttribute('data-placement');
    const describe = (node: Element) => ({
      tag: node.tagName, testId: node.getAttribute('data-testid'),
      rect: node.getBoundingClientRect().toJSON(),
      scrollTop: node.scrollTop, scrollLeft: node.scrollLeft,
      position: getComputedStyle(node).position,
      overflow: getComputedStyle(node).overflow,
      transform: getComputedStyle(node).transform,
    });
    const ancestors = [];
    for (let node = anchor.parentElement; node; node = node.parentElement) ancestors.push(describe(node));
    return {
      anchor: describe(anchor), overlay: describe(element), host: describe(host), ancestors,
      placement: side,
      gap: side === 'top' ? target.top - box.bottom : box.top - target.bottom,
      horizontalOverlap: Math.min(target.right, box.right) - Math.max(target.left, box.left),
      overlayInlineStyle: element.getAttribute('style'),
      overlayOffsetParent: (element as HTMLElement).offsetParent
        ? describe((element as HTMLElement).offsetParent!) : null,
      documentScroll: { x: window.scrollX, y: window.scrollY },
      viewport: { width: innerWidth, height: innerHeight },
      activeElement: document.activeElement && {
        tag: document.activeElement.tagName, id: document.activeElement.id,
        insideOverlay: element.contains(document.activeElement),
      },
    };
  });
}
