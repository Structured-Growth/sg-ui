import { expect, test, type Locator, type Page } from '@playwright/test';

type NativeDrag = { type: string; trusted: boolean; title: string | null; source: string | null };
const story = '/iframe.html?id=navigation-experiencepagenavigator-native-transactions--controlled-host&viewMode=story&globals=a11y.manual:!true';
const order = (page: Page) => page.getByLabel('Host page order');
const requests = (page: Page) => page.getByLabel('Host requests');
const actions = (page: Page, title: string) => page.getByRole('button', { name: `Actions for ${title}`, exact: true });
const row = (page: Page, title: string) => actions(page, title).locator('xpath=ancestor::li');

// Read-only observations select native traversal direction; never move focus here.
async function focusSnapshot(target: Locator) {
  return target.evaluate(element => {
    const describe = (node: Element | null) => {
      if (!node) return null;
      const style = getComputedStyle(node);
      return {
        tag: node.tagName, id: node.id, role: node.getAttribute('role'),
        label: node.getAttribute('aria-label'), text: node.textContent?.trim().slice(0, 120),
        connected: node.isConnected, tabIndex: node instanceof HTMLElement ? node.tabIndex : null,
        disabled: node.matches(':disabled'), ariaDisabled: node.getAttribute('aria-disabled'),
        hidden: node.hasAttribute('hidden'), inert: node.hasAttribute('inert'),
        ariaHidden: node.getAttribute('aria-hidden'), display: style.display, visibility: style.visibility,
        rects: node.getClientRects().length,
      };
    };
    const ancestors = (node: Element) => {
      const result = [];
      for (let parent = node.parentElement; parent; parent = parent.parentElement) result.push(describe(parent));
      return result;
    };
    const active = document.activeElement;
    const targetPositionFromActive = active?.compareDocumentPosition(element) ?? null;
    // These fixtures use ordinary DOM-ordered tab stops. BODY/HTML is document
    // entry, not a sequential focus anchor; take one forward step and observe it.
    const direction = active && active !== document.body && active !== document.documentElement &&
      targetPositionFromActive !== null && !(targetPositionFromActive & Node.DOCUMENT_POSITION_DISCONNECTED) &&
      (targetPositionFromActive & Node.DOCUMENT_POSITION_PRECEDING) ? 'backward' : 'forward';
    return {
      time: performance.now(), documentFocused: document.hasFocus(), visibility: document.visibilityState,
      targetPositionFromActive, direction,
      reached: element === active, target: describe(element), targetAncestors: ancestors(element),
      active: describe(active), activeAncestors: active ? ancestors(active) : [],
      // DOM markers establish scope lifetime/containment, not internal React Aria state.
      scopesAndOverlays: [...document.querySelectorAll('[data-focus-scope-start], [data-focus-scope-end], [data-overlay-container], [role="menu"], [role="dialog"]')]
        .map(node => ({ ...describe(node), scopeStart: node.hasAttribute('data-focus-scope-start'),
          scopeEnd: node.hasAttribute('data-focus-scope-end'), containsTarget: node.contains(element),
          containsActive: active ? node.contains(active) : false })),
    };
  });
}

async function observeFocusLifecycle(page: Page) {
  await page.addInitScript(() => {
    const records: unknown[] = [];
    let sequence = 0;
    const describe = (node: EventTarget | null) => node instanceof Element ? {
      tag: node.tagName, id: node.id, role: node.getAttribute('role'), label: node.getAttribute('aria-label'),
      text: node.textContent?.trim().slice(0, 120), connected: node.isConnected,
    } : null;
    const record = (value: object) => {
      records.push({ sequence: sequence++, time: performance.now(), documentFocused: document.hasFocus(),
        active: describe(document.activeElement), ...value });
      if (records.length > 256) records.shift();
    };
    Object.assign(window, { navigatorFocusLifecycle: records });
    for (const type of ['keydown', 'keyup', 'focusin', 'focusout']) document.addEventListener(type, event => {
      const key = event instanceof KeyboardEvent ? event : null;
      record({ type, trusted: event.isTrusted, target: describe(event.target),
        related: event instanceof FocusEvent ? describe(event.relatedTarget) : null,
        key: key?.key, alt: key?.altKey, shift: key?.shiftKey, preventedAtCapture: event.defaultPrevented });
    }, { capture: true, passive: true });
    for (const type of ['focus', 'blur']) window.addEventListener(type, event => {
      record({ type: `window-${type}`, trusted: event.isTrusted });
    }, { passive: true });
    const selector = '[data-focus-scope-start], [data-focus-scope-end], [data-overlay-container], [role="menu"], [role="dialog"]';
    new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          record({ type: 'attribute', attribute: mutation.attributeName, target: describe(mutation.target),
            value: (mutation.target as Element).getAttribute(mutation.attributeName!) });
        } else {
          for (const [type, nodes] of [['scope-added', mutation.addedNodes], ['scope-removed', mutation.removedNodes]] as const) {
            for (const node of nodes) {
              if (!(node instanceof Element)) continue;
              for (const marker of [...(node.matches(selector) ? [node] : []), ...node.querySelectorAll(selector)]) {
                record({ type, target: describe(marker), scopeStart: marker.hasAttribute('data-focus-scope-start'),
                  scopeEnd: marker.hasAttribute('data-focus-scope-end') });
              }
            }
          }
        }
      }
    }).observe(document, { subtree: true, childList: true, attributes: true,
      attributeFilter: ['inert', 'hidden', 'aria-hidden', 'disabled', 'aria-disabled', 'tabindex', 'aria-expanded'] });
  });
}

async function reach(page: Page, target: Locator, browserName: string) {
  const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  const backwardTab = browserName === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab';
  const observations = [{ tabs: 0, key: null as string | null, ...await focusSnapshot(target) }];
  try {
    for (let i = 0; i < 24; i++) {
      const current = observations[observations.length - 1];
      if (current.reached) return;
      const key = current.direction === 'backward' ? backwardTab : tab;
      await page.keyboard.press(key);
      observations.push({ tabs: i + 1, key, ...await focusSnapshot(target) });
    }
    await expect(target).toBeFocused();
  } finally {
    const finalObservation = await focusSnapshot(target);
    const lifecycle = await page.evaluate(() =>
      (window as unknown as { navigatorFocusLifecycle: unknown[] }).navigatorFocusLifecycle);
    await test.info().attach('navigator-native-tab-reach', { contentType: 'application/json',
      body: JSON.stringify({ browserName, key: tab, backwardKey: backwardTab, limit: 24, observations, finalObservation, lifecycle }) });
  }
}
async function openActions(page: Page, title: string, browserName: string) {
  await reach(page, actions(page, title), browserName);
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menu')).toBeVisible();
}
async function command(page: Page, name: string) {
  const item = page.getByRole('menuitem', { name, exact: true });
  await expect(item).not.toHaveAttribute('aria-disabled', 'true');
  for (let i = 0; i < 8; i++) {
    if (await item.evaluate(element => element === document.activeElement)) break;
    await page.keyboard.press('ArrowDown');
  }
  await expect(item).toBeFocused();
  await page.keyboard.press('Enter');
}
async function start(page: Page, theme: string) {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  await observeFocusLifecycle(page);
  await page.goto(`${story};theme:${theme}`);
  await expect(order(page)).toHaveText('["intro","lesson","summary"]');
  return errors;
}

for (const theme of ['light', 'dark']) {
  test(`keyboard rename saves once and Escape returns to its action trigger (${theme})`, async ({ page, browserName }) => {
    const errors = await start(page, theme);
    await openActions(page, 'Introduction', browserName);
    await command(page, 'Edit Page Name');
    const field = page.getByRole('textbox', { name: 'Page Name' });
    await expect(field).toBeFocused();
    await expect(page.getByRole('dialog').locator('xpath=ancestor::*[@data-sgui-theme][1]')).toHaveAttribute('data-sgui-theme', theme);
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.type('  Renamed intro  ');
    await reach(page, page.getByRole('button', { name: 'Save', exact: true }), browserName);
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(actions(page, 'Renamed intro')).toBeFocused();
    await expect(requests(page)).toHaveText('[["rename","intro","Renamed intro"]]');
    await expect(page.getByRole('button', { name: 'Renamed intro Page 1 • Active' })).toHaveAttribute('aria-current', 'page');
    await openActions(page, 'Renamed intro', browserName);
    await command(page, 'Edit Page Name');
    await expect(field).toBeFocused();
    await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.type('Discard this');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(actions(page, 'Renamed intro')).toBeFocused();
    await expect(requests(page)).toHaveText('[["rename","intro","Renamed intro"]]');
    expect(errors).toEqual([]);
  });

  test(`host removal focuses the next then previous survivor without selecting it (${theme})`, async ({ page, browserName }) => {
    const errors = await start(page, theme);
    await openActions(page, 'Lesson', browserName); await command(page, 'Remove');
    await expect(order(page)).toHaveText('["intro","summary"]');
    await expect(page.getByRole('button', { name: 'Summary Page 2', exact: true })).toBeFocused();
    await openActions(page, 'Summary', browserName); await command(page, 'Remove');
    await expect(order(page)).toHaveText('["intro"]');
    await expect(page.getByRole('button', { name: 'Introduction Page 1 • Active' })).toBeFocused();
    await expect(requests(page)).toHaveText('[["remove","lesson"],["remove","summary"]]');
    await openActions(page, 'Introduction', browserName);
    for (const name of ['Remove', 'Move up', 'Move down']) await expect(page.getByRole('menuitem', { name, exact: true })).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('Escape'); await expect(actions(page, 'Introduction')).toBeFocused();
    await expect(requests(page)).toHaveText('[["remove","lesson"],["remove","summary"]]');
    expect(errors).toEqual([]);
  });

  test(`keyboard Move boundaries respect accepted and rejected host order (${theme})`, async ({ page, browserName }) => {
    const errors = await start(page, theme);
    await openActions(page, 'Summary', browserName);
    await expect(page.getByRole('menuitem', { name: 'Move down' })).toHaveAttribute('aria-disabled', 'true');
    await page.keyboard.press('Escape');
    await reach(page, page.getByRole('button', { name: 'Reject next reorder', exact: true }), browserName);
    await page.keyboard.press('Enter'); await expect(page.getByLabel('Host reject next')).toHaveText('true');
    await openActions(page, 'Introduction', browserName);
    await expect(page.getByRole('menuitem', { name: 'Move up' })).toHaveAttribute('aria-disabled', 'true');
    await command(page, 'Move down');
    await expect(actions(page, 'Introduction')).toBeFocused();
    await expect(order(page)).toHaveText('["intro","lesson","summary"]');
    await expect(requests(page)).toHaveText('[["reorder","intro","lesson"]]');
    await openActions(page, 'Introduction', browserName); await command(page, 'Move down');
    await expect(actions(page, 'Introduction')).toBeFocused();
    await expect(order(page)).toHaveText('["lesson","intro","summary"]');
    await openActions(page, 'Introduction', browserName); await command(page, 'Move up');
    await expect(actions(page, 'Introduction')).toBeFocused();
    await expect(order(page)).toHaveText('["intro","lesson","summary"]');
    await expect(requests(page)).toHaveText('[["reorder","intro","lesson"],["reorder","intro","lesson"],["reorder","intro","lesson"]]');
    expect(errors).toEqual([]);
  });

  test(`live read-only and removed-page changes during rename suppress stale writes (${theme})`, async ({ page, browserName }) => {
    const errors = await start(page, theme);
    await openActions(page, 'Introduction', browserName); await command(page, 'Edit Page Name');
    const field = page.getByRole('textbox', { name: 'Page Name' });
    await expect(field).toBeFocused();
    await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.type('Unsaved');
    await page.keyboard.press('Alt+r');
    await expect(page.getByLabel('Host read-only')).toHaveText('true');
    await expect(field).toHaveAttribute('readonly', '');
    await expect(page.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();
    await page.keyboard.press('Enter'); await page.keyboard.press('Escape');
    await expect(requests(page)).toHaveText('[]');
    await expect(actions(page, 'Introduction')).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeDisabled();
    await expect(row(page, 'Introduction')).toHaveAttribute('draggable', 'false');
    const lesson = page.getByRole('button', { name: 'Lesson Page 2', exact: true });
    await reach(page, lesson, browserName); await page.keyboard.press('Enter');
    await expect(requests(page)).toHaveText('[["select","lesson"]]');
    await expect(page.getByRole('button', { name: 'Lesson Page 2 • Active' })).toHaveAttribute('aria-current', 'page');
    await page.keyboard.press('Alt+r');
    await openActions(page, 'Introduction', browserName);
    await page.keyboard.press('Alt+r');
    await expect(page.getByLabel('Host read-only')).toHaveText('true');
    for (const name of ['Edit Page Name', 'Remove', 'Move up', 'Move down']) {
      await expect(page.getByRole('menuitem', { name, exact: true })).toHaveAttribute('aria-disabled', 'true');
    }
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(requests(page)).toHaveText('[["select","lesson"]]');
    // The disabled menu opener cannot restore focus into the host shortcut wrapper.
    // Reach the explicit host control before requesting the next controlled change.
    await reach(page, page.getByRole('button', { name: 'Toggle read-only', exact: true }), browserName);
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Host read-only')).toHaveText('false');
    await expect(actions(page, 'Introduction')).toBeEnabled();
    await openActions(page, 'Introduction', browserName); await command(page, 'Edit Page Name');
    await expect(field).toBeFocused(); await page.keyboard.press('Alt+x');
    await expect(order(page)).toHaveText('["lesson","summary"]');
    await page.keyboard.press('ControlOrMeta+A'); await page.keyboard.type('Removed page');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(requests(page)).toHaveText('[["select","lesson"]]');
    expect(errors).toEqual([]);
  });
}

async function observeDrag(page: Page) {
  await page.addInitScript(() => {
    const events: NativeDrag[] = [];
    Object.assign(window, { navigatorNativeDrag: events });
    for (const type of ['dragstart', 'drop', 'dragend']) document.addEventListener(type, event => {
      const drag = event as DragEvent;
      events.push({ type, trusted: event.isTrusted, title: (event.target as Element).closest('li')?.querySelector('button')?.textContent ?? null,
        source: type === 'drop' ? drag.dataTransfer?.getData('text/page-key') ?? null : null });
    }, true);
  });
}
const dragEvents = (page: Page) => page.evaluate(() => (window as unknown as { navigatorNativeDrag: NativeDrag[] }).navigatorNativeDrag);
async function beginDrag(page: Page) {
  const box = (await row(page, 'Introduction').boundingBox())!;
  // The left decorative handle belongs to the native draggable li, outside its buttons.
  await page.mouse.move(box.x + 16, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 36, box.y + box.height / 2, { steps: 5 });
  await expect.poll(async () => (await dragEvents(page)).filter(event => event.type === 'dragstart').map(event => event.trusted)).toEqual([true]);
}
async function drop(page: Page, title: string) {
  const box = (await row(page, title).boundingBox())!;
  await page.mouse.move(box.x + 16, box.y + box.height / 2, { steps: 10 });
  await page.mouse.move(box.x + 17, box.y + box.height / 2);
  await page.mouse.up();
}
for (const scenario of ['accepted', 'self', 'removed source'] as const) {
  test(`first native mouse drag: ${scenario}`, async ({ page, browserName }, info) => {
    await observeDrag(page); const errors = await start(page, 'light');
    if (scenario === 'removed source') {
      await page.getByRole('button', { name: 'Remove source on native drag start', exact: true }).click();
      await expect(page.getByLabel('Host remove on drag')).toHaveText('true');
    }
    if (scenario === 'removed source' && browserName === 'chromium') {
      // Playwright's Chromium mouse.move waits for Input.dragIntercepted after
      // dragstart even when immediate source removal cancels the platform drag.
      // Raw browser mouse input exercises that cancellation without interception;
      // no DragEvent/DataTransfer is constructed or injected.
      const input = await page.context().newCDPSession(page);
      try {
        const box = (await row(page, 'Introduction').boundingBox())!;
        const x = box.x + 16; const y = box.y + box.height / 2;
        await input.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
        await input.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', buttons: 1, clickCount: 1 });
        await input.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x + 20, y, button: 'left', buttons: 1 });
        await expect.poll(async () => (await dragEvents(page)).filter(event => event.type === 'dragstart').map(event => event.trusted)).toEqual([true]);
        await expect(order(page)).toHaveText('["lesson","summary"]');
        const target = (await row(page, 'Summary').boundingBox())!;
        await input.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: target.x + 16, y: target.y + target.height / 2, button: 'left', buttons: 1 });
        await input.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: target.x + 16, y: target.y + target.height / 2, button: 'left', buttons: 0, clickCount: 1 });
      } finally { await input.detach(); }
    } else {
      await beginDrag(page);
      if (scenario === 'removed source') await expect(order(page)).toHaveText('["lesson","summary"]');
      await drop(page, scenario === 'self' ? 'Introduction' : 'Summary');
    }
    if (scenario === 'removed source') {
      // Removing the drag source can cancel the platform drag; no drop is required.
      await expect(requests(page)).toHaveText('[]');
      await expect(order(page)).toHaveText('["lesson","summary"]');
    } else {
      await expect.poll(async () => (await dragEvents(page)).filter(event => event.type === 'drop').map(event => [event.trusted, event.source])).toEqual([[true, 'intro']]);
      await expect(requests(page)).toHaveText(scenario === 'self' ? '[]' : '[["reorder","intro","summary"]]');
      await expect(order(page)).toHaveText(scenario === 'self' ? '["intro","lesson","summary"]' : '["lesson","summary","intro"]');
    }
    const native = await dragEvents(page);
    expect(native.every(event => event.trusted)).toBe(true);
    await info.attach('navigator-native-drag-events', { body: JSON.stringify(native), contentType: 'application/json' });
    expect(errors).toEqual([]);
  });
}
