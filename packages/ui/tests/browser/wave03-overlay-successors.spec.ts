import { test, expect, type Locator, type Page } from '@playwright/test';

async function fixture(page: Page, name: string) {
  await page.addInitScript(() => {
    const samples: unknown[] = [];
    (window as unknown as { __sguiOverlayViewport: unknown[] }).__sguiOverlayViewport = samples;
    const initialViewport = visualViewport;
    const record = (event: string) => samples.push({ event, time: performance.now(), width: innerWidth, height: innerHeight, outerWidth, outerHeight, documentFocused: document.hasFocus(), active: document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.tagName, devicePixelRatio, sameViewportObject: initialViewport === visualViewport, initialViewportScale: initialViewport?.scale,
      visual: visualViewport && { width: visualViewport.width, height: visualViewport.height, scale: visualViewport.scale } });
    window.addEventListener('resize', () => record('window-resize'));
    visualViewport?.addEventListener('resize', () => record('visual-resize'));
    for (const name of ['scroll', 'blur', 'focus', 'pointerout', 'mouseout']) window.addEventListener(name, event => {
      const target = event.target;
      const node = target instanceof Element ? target : null;
      record(name + ':' + (node?.getAttribute('data-sgui-part') ?? node?.tagName ?? 'window'));
    }, true);
    document.addEventListener('DOMContentLoaded', () => {
      new MutationObserver(records => {
        for (const mutation of records) for (const [kind, nodes] of [['added', mutation.addedNodes], ['removed', mutation.removedNodes]] as const) {
          for (const node of nodes) if (node instanceof Element && (node.matches('[role="tooltip"]') || node.querySelector('[role="tooltip"]'))) record('tooltip-' + kind);
        }
      }).observe(document.documentElement, { childList: true, subtree: true });
    });
    record('initial');
  });
  await page.goto(`/fixtures/?id=overlays-appmodal--${name}&globals=a11y.manual:!true`);
  await expect(page.locator('#sgui-fixture-root')).not.toBeEmpty();
}
async function hit(target: Locator) {
  await expect.poll(() => target.evaluate(element => {
    const r = element.getBoundingClientRect();
    const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return r.width > 0 && r.height > 0 && r.left >= 0 && r.right <= innerWidth + 1 &&
      r.top >= 0 && r.bottom <= innerHeight + 1 && !!top && element.contains(top);
  })).toBe(true);
}
async function locked(page: Page, expected: boolean) {
  await expect.poll(() => page.evaluate(() =>
    /hidden|clip/.test(getComputedStyle(document.documentElement).overflowY) ||
    /hidden|clip/.test(getComputedStyle(document.body).overflowY))).toBe(expected);
}
async function snapshot(page: Page) {
  return page.locator('[data-sgui-part="dialog-overlay"], [role="menu"], [role="tooltip"]').evaluateAll(elements => elements.map(element => ({
    role: element.getAttribute('role'), part: element.getAttribute('data-sgui-part'),
    parent: element.parentElement?.tagName, rect: element.getBoundingClientRect().toJSON(),
    zIndex: getComputedStyle(element).zIndex, theme: element.closest('[data-sgui-scope]')?.getAttribute('data-sgui-theme'),
    inert: !!element.closest('[inert]'),
  })));
}

test('combined dialog, menu, tooltip and editor dialog preserve ownership and live portal scope', async ({ page }, info) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await fixture(page, 'ownership');
  const observations: unknown[] = [];
  try {
    const opener = page.getByRole('button', { name: 'Open ownership modal', exact: true });
    await opener.focus(); await page.keyboard.press('Enter');
    const parent = page.getByRole('dialog', { name: 'Ownership settings', exact: true });
    await expect(parent.getByRole('textbox', { name: 'Ownership name' })).toBeFocused();
    await locked(page, true);
    for (const alternate of [false, true]) {
      if (alternate) await parent.getByRole('button', { name: 'Change active scope' }).click();
      const menuTrigger = parent.getByRole('button', { name: 'Ownership actions', exact: true });
      await menuTrigger.focus(); await page.keyboard.press('Enter');
      const item = page.getByRole('menuitem', { name: 'Review ownership' });
      await expect(item).toBeFocused(); await hit(item);
      const scope = item.locator('xpath=ancestor::*[@data-sgui-scope][1]');
      await expect(scope).toHaveAttribute('data-sgui-theme', alternate ? 'dark' : 'light');
      await expect(scope).toHaveAttribute('data-sgui-density', alternate ? 'compact' : 'comfortable');
      await expect(scope).toHaveAttribute('dir', alternate ? 'rtl' : 'ltr');
      await expect(scope).toHaveAttribute('lang', alternate ? 'ar-EG' : 'en-US');
      observations.push({ stage: `menu-${alternate}`, overlays: await snapshot(page) });
      await page.setViewportSize({ width: 360, height: 640 });
      await expect(item).toBeFocused(); await hit(item);
      observations.push({ stage: `menu-narrow-${alternate}`, overlays: await snapshot(page) });
      await page.setViewportSize({ width: 1100, height: 900 });
      await expect(item).toBeFocused(); await hit(item);
      await page.keyboard.press('Escape'); await expect(menuTrigger).toBeFocused();
      await expect(parent).toBeVisible(); await locked(page, true);
      const help = parent.getByRole('button', { name: 'Ownership help', exact: true });
      await help.focus();
      const tooltip = page.getByRole('tooltip');
      await expect(tooltip).toHaveText('Help for the current settings');
      await expect(tooltip).toHaveAttribute('data-sgui-theme', alternate ? 'dark' : 'light');
      await hit(help);
      observations.push({ stage: `tooltip-${alternate}`, overlays: await snapshot(page) });
      await page.setViewportSize({ width: 360, height: 640 });
      await expect(help).toBeFocused(); await hit(help);
      await expect.poll(() => tooltip.evaluate(element => {
        const r = element.getBoundingClientRect();
        return r.left >= 0 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= innerHeight + 1;
      })).toBe(true);
      observations.push({ stage: `tooltip-narrow-${alternate}`, overlays: await snapshot(page) });
      await page.setViewportSize({ width: 1100, height: 900 });
      await page.keyboard.press('Escape');
      await expect(tooltip).toHaveCount(0); await expect(parent).toBeVisible();
    }
    const editor = parent.getByRole('textbox', { name: 'Ownership document', exact: true });
    await editor.click(); await page.keyboard.type('Overlay draft');
    await editor.press(process.platform === 'darwin' ? 'Meta+Shift+ArrowLeft' : 'Shift+Home');
    await expect.poll(() => editor.evaluate(() => window.getSelection()?.toString())).toBe('Overlay draft');
    await parent.getByRole('button', { name: 'Edit link', exact: true }).click();
    const link = page.getByRole('dialog', { name: 'Insert Link', exact: true });
    await expect(link.getByRole('textbox', { name: 'Display Text', exact: true })).toHaveValue('Overlay draft');
    await expect(link.getByRole('textbox', { name: 'Display Text', exact: true })).toBeFocused();
    await hit(link.getByRole('textbox', { name: 'Display Text', exact: true }));
    observations.push({ stage: 'editor-link', overlays: await snapshot(page) });
    await page.keyboard.press('Escape'); await expect(link).toHaveCount(0);
    // Pointer link activation retains document focus; native dialog dismissal
    // returns there, with the captured range restored by the editor boundary.
    await expect(editor).toBeFocused();
    await expect.poll(() => editor.evaluate(() => window.getSelection()?.toString())).toBe('Overlay draft');
    await expect(parent).toBeVisible(); await locked(page, true);
    await expect(editor).toHaveText('Overlay draft');
    // Re-enter the same native selection and apply: this verifies the editor's
    // actual link transaction, rather than claiming DOM selection alone persists.
    await editor.click(); await editor.press(process.platform === 'darwin' ? 'Meta+ArrowRight' : 'End');
    await editor.press(process.platform === 'darwin' ? 'Meta+Shift+ArrowLeft' : 'Shift+Home');
    await parent.getByRole('button', { name: 'Edit link', exact: true }).click();
    await link.getByRole('textbox', { name: 'URL', exact: true }).fill('https://example.org/guide');
    await link.getByRole('button', { name: 'Apply', exact: true }).click();
    await expect(link).toHaveCount(0);
    await expect.poll(() => parent.evaluate(element => element.contains(document.activeElement))).toBe(true);
    await expect(editor.getByRole('link', { name: 'Overlay draft', exact: true })).toHaveAttribute('href', 'https://example.org/guide');
    const childTrigger = parent.getByRole('button', { name: 'Open ownership child' });
    for (let cycle = 0; cycle < 2; cycle++) {
      await childTrigger.click();
      const child = page.getByRole('dialog', { name: 'Ownership child', exact: true });
      const input = child.getByRole('textbox', { name: 'Ownership child name' });
      await expect(input).toBeFocused(); await hit(input);
      await page.keyboard.press('Escape'); await expect(child).toHaveCount(0);
      await expect(childTrigger).toBeFocused(); await locked(page, true);
    }
    await page.keyboard.press('Escape'); await expect(parent).toHaveCount(0);
    await expect(opener).toBeFocused(); await locked(page, false);
    const sibling = page.getByRole('textbox', { name: 'Independent sibling' });
    await expect(sibling).toHaveValue('Sibling draft');
    await expect(sibling.locator('xpath=ancestor::*[@data-sgui-scope][1]')).toHaveAttribute('data-sgui-theme', 'light');
  } finally {
    await info.attach('overlay-ownership', { body: JSON.stringify(observations, null, 2), contentType: 'application/json' });
    if (!page.isClosed()) await info.attach('overlay-final-viewport', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(() => ({
      width: innerWidth, height: innerHeight, visual: visualViewport && { width: visualViewport.width, height: visualViewport.height, scale: visualViewport.scale },
      events: (window as unknown as { __sguiOverlayViewport: unknown[] }).__sguiOverlayViewport,
      tooltips: [...document.querySelectorAll('[role="tooltip"]')].map(node => ({ rect: node.getBoundingClientRect().toJSON(), style: node.getAttribute('style') })),
    }))) });
  }
});

test('nested modal locks survive child close, block background scrolling and restore after final close', async ({ page }, info) => {
  await fixture(page, 'nested-overlays');
  // Establish a genuinely scrollable document. No overflow or lock styles are changed.
  await page.locator('#sgui-fixture-root').evaluate(element => { (element as HTMLElement).style.minHeight = '250vh'; });
  await page.mouse.move(10, 10); await page.mouse.wheel(0, 160);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.evaluate(() => scrollTo(0, 0));
  const opener = page.getByRole('button', { name: 'Open parent', exact: true });
  await opener.click(); await locked(page, true);
  const position = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
  await page.getByRole('button', { name: 'Open child', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Child name' })).toBeFocused();
  const child = page.getByRole('dialog', { name: 'Child settings', exact: true });
  for (const key of ['Tab', 'Shift+Tab']) for (let step = 0; step < 8; step++) {
    await page.keyboard.press(key);
    expect(await child.evaluate(element => element.contains(document.activeElement))).toBe(true);
  }
  await page.mouse.move(4, 4); await page.mouse.wheel(0, 240);
  // Two frames observe the wheel transaction; this is not programmatic focus repair.
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  expect(await page.evaluate(() => ({ x: scrollX, y: scrollY }))).toEqual(position);
  await page.keyboard.press('Escape'); await expect(child).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open child', exact: true })).toBeFocused();
  await locked(page, true);
  await page.mouse.wheel(0, 240);
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  expect(await page.evaluate(() => ({ x: scrollX, y: scrollY }))).toEqual(position);
  await info.attach('nested-lock', { body: JSON.stringify({ position, overlays: await snapshot(page) }), contentType: 'application/json' });
  await page.keyboard.press('Escape'); await expect(opener).toBeFocused(); await locked(page, false);
  await page.mouse.wheel(0, 160); await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(position.y);
});

test('AppModal sizes and height modes retain bounded surfaces, editable state and return focus', async ({ page }, info) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1280, height: 900 });
  await fixture(page, 'contract-matrix');
  const observations: unknown[] = [];
  try {
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl', 'full']) for (const mode of ['auto', 'sm', 'md', 'lg']) {
      const id = `${size}-${mode}`;
      const opener = page.getByRole('button', { name: `Open ${id}`, exact: true });
      await opener.click();
      const dialog = page.getByRole('dialog', { name: `Contract ${id}`, exact: true });
      const first = dialog.getByRole('textbox', { name: 'Contract field 1', exact: true });
      await expect(first).toBeFocused(); await first.fill(`Draft ${id}`);
      const surface = dialog.locator('xpath=ancestor::*[@data-sgui-part="dialog-surface"][1]');
      await expect(surface).toHaveAttribute('data-size', size);
      const expectedHeight = size === 'full' || mode === 'auto' ? '' : ({ sm: '56dvh', md: '68dvh', lg: '80dvh' } as Record<string,string>)[mode];
      expect(await surface.evaluate(element => (element as HTMLElement).style.height)).toBe(expectedHeight);
      for (const viewport of [{ width: 1280, height: 900 }, { width: 360, height: 640 }]) {
        await page.setViewportSize(viewport);
        await expect(first).toHaveValue(`Draft ${id}`);
        const last = dialog.getByRole('textbox', { name: 'Contract field 10', exact: true });
        await last.focus(); await hit(last);
        await page.keyboard.press('Tab');
        const done = dialog.getByRole('button', { name: 'Contract done', exact: true });
        await expect(done).toBeFocused(); await hit(done);
        expect(await surface.evaluate(element => {
          const r = element.getBoundingClientRect();
          return r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1;
        })).toBe(true);
        expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
        observations.push({ id, viewport, surface: await surface.boundingBox(), dialogScroll: await dialog.evaluate(element => element.scrollTop) });
      }
      await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await expect(opener).toBeFocused();
      await page.setViewportSize({ width: 1280, height: 900 });
    }
    const opener = page.getByRole('button', { name: 'Open md-lg-custom', exact: true });
    await opener.click();
    const custom = page.getByRole('dialog', { name: 'Contract md-lg-custom', exact: true });
    const surface = custom.locator('xpath=ancestor::*[@data-sgui-part="dialog-surface"][1]');
    expect(await surface.evaluate(element => ({ width: (element as HTMLElement).style.width, height: (element as HTMLElement).style.height })))
      .toEqual({ width: '540px', height: '440px' });
    await custom.getByRole('textbox', { name: 'Contract field 10', exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(custom.getByRole('button', { name: 'Custom done' })).toBeFocused();
    await hit(custom.getByRole('button', { name: 'Custom done' }));
    await custom.getByRole('button', { name: 'Custom done' }).click(); await expect(opener).toBeFocused();
  } finally {
    await info.attach('modal-contract-matrix', { body: JSON.stringify(observations, null, 2), contentType: 'application/json' });
  }
});
