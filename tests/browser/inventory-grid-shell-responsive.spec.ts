import { expect, test, type Locator, type Page } from '@playwright/test';

// Observe lifecycle and native events without assigning focus or changing tab order.
async function observeNativeFocus(page: Page) {
  return page.evaluateHandle(() => {
    const shell = document.querySelector('[data-sgui-part="data-grid-shell"]');
    const records: unknown[] = [];
    let sequence = 0;
    let droppedRecords = 0;
    const identities = new WeakMap<Element, number>();
    let nextIdentity = 0;
    const initialList = shell?.querySelector('button[aria-label="List"]') ?? null;
    let retry: Element | null = null;
    const describe = (element: Element | null) => {
      if (!(element instanceof HTMLElement)) return null;
      if (!identities.has(element)) identities.set(element, ++nextIdentity);
      const bounds = element.getBoundingClientRect();
      const blockedAncestors: unknown[] = [];
      for (let parent: HTMLElement | null = element; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        if (parent.hidden || parent.inert || parent.getAttribute('aria-hidden') === 'true'
          || style.display === 'none' || style.visibility === 'hidden') {
          blockedAncestors.push({ tag: parent.tagName, id: parent.id, part: parent.dataset.sguiPart,
            hidden: parent.hidden, inert: parent.inert, ariaHidden: parent.getAttribute('aria-hidden'),
            display: style.display, visibility: style.visibility });
        }
      }
      return { identity: identities.get(element), tag: element.tagName, id: element.id, label: element.getAttribute('aria-label'),
        text: element.textContent?.trim().slice(0, 120), part: element.dataset.sguiPart,
        row: element.dataset.gridRow, field: element.dataset.gridField, connected: element.isConnected,
        disabled: element.matches(':disabled'), tabIndex: element.tabIndex, blockedAncestors,
        bounds: { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
        inShell: Boolean(shell?.contains(element)),
        inToolbar: Boolean(element.closest('[data-sgui-part="data-toolbar"]')),
        inFooter: Boolean(element.closest('[data-sgui-part="card-pagination-footer"]')),
        inStatus: Boolean(element.closest('[data-sgui-part="status"]')) };
    };
    const capture = (reason: string, event?: Event) => {
      const currentRetry = [...(shell?.querySelectorAll('button') ?? [])]
        .find(element => element.textContent?.trim() === 'Retry') ?? null;
      if (currentRetry) retry = currentRetry;
      // Bounded diagnostic storage only; this does not bound or alter event handling.
      if (records.length >= 1000) { droppedRecords++; return; }
      const keyEvent = event instanceof KeyboardEvent ? event : null;
      records.push({ sequence: sequence++, time: performance.now(), reason,
        documentFocused: document.hasFocus(), active: describe(document.activeElement),
        eventTarget: event?.target instanceof Element ? describe(event.target) : null,
        relatedTarget: event instanceof FocusEvent && event.relatedTarget instanceof Element
          ? describe(event.relatedTarget) : null,
        key: keyEvent?.key, altKey: keyEvent?.altKey, shiftKey: keyEvent?.shiftKey,
        defaultPrevented: event?.defaultPrevented,
        retryPresent: Boolean(currentRetry), retainedRetry: describe(retry),
        retainedInitialList: describe(initialList),
        list: describe(shell?.querySelector('button[aria-label="List"]') ?? null),
        status: shell?.querySelector('[data-sgui-part="status"]')?.textContent?.trim() ?? null,
        shellConnected: shell?.isConnected, shellScrollTop: shell?.scrollTop,
        overlays: [...document.querySelectorAll('[role="dialog"], [role="menu"], [data-sgui-part="popover"]')]
          .map(describe),
        focusScopeMarkers: [...document.querySelectorAll('[data-focus-scope-start], [data-focus-scope-end]')]
          .map(element => ({ start: element.hasAttribute('data-focus-scope-start'),
            end: element.hasAttribute('data-focus-scope-end'), element: describe(element) })) });
    };
    const onEvent = (event: Event) => capture(`native:${event.type}`, event);
    const events = ['focusin', 'focusout', 'keydown', 'keyup'];
    for (const name of events) document.addEventListener(name, onEvent);
    window.addEventListener('focus', onEvent);
    window.addEventListener('blur', onEvent);
    let previousLifecycle = '';
    const lifecycleSelector = '[role="dialog"], [role="menu"], [data-sgui-part="popover"], [data-focus-scope-start], [data-focus-scope-end]';
    const observer = new MutationObserver(() => {
      const lifecycle = JSON.stringify({ retry: Boolean(shell?.querySelector('button')
        && [...shell.querySelectorAll('button')].some(element => element.textContent?.trim() === 'Retry')),
        status: shell?.querySelector('[data-sgui-part="status"]')?.textContent,
        boundaries: [...document.querySelectorAll(lifecycleSelector)].map(element => {
          if (!identities.has(element)) identities.set(element, ++nextIdentity);
          return identities.get(element);
        }) });
      if (lifecycle !== previousLifecycle) { previousLifecycle = lifecycle; capture('lifecycle:mutation'); }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true,
      attributeFilter: ['hidden', 'inert', 'aria-hidden', 'disabled', 'tabindex'] });
    capture('observer:installed');
    return { capture, read: () => ({ records, droppedRecords }), dispose: () => {
      observer.disconnect();
      for (const name of events) document.removeEventListener(name, onEvent);
      window.removeEventListener('focus', onEvent);
      window.removeEventListener('blur', onEvent);
    } };
  });
}
type FocusObservation = Awaited<ReturnType<typeof observeNativeFocus>>;

// Native sequential navigation only: no locator.focus or DOM focus injection.
async function tabTo(page: Page, target: Locator, browserName: string, observation: FocusObservation,
  removedFocusDirection?: 'backward') {
  const targetName = await target.getAttribute('aria-label') ?? await target.innerText();
  // BODY does not expose the engine's sequential starting point after Retry unmounts.
  // That return has an explicit backwards route; connected controls use DOM order.
  const direction = await target.evaluate((element, removedDirection) => {
    const active = document.activeElement;
    if (!active || active === document.body || active === document.documentElement) {
      return removedDirection ?? 'forward';
    }
    return element.compareDocumentPosition(active) & Node.DOCUMENT_POSITION_FOLLOWING
      ? 'backward' : 'forward';
  }, removedFocusDirection);
  const key = `${browserName === 'webkit' ? 'Alt+' : ''}${direction === 'backward' ? 'Shift+' : ''}Tab`;
  await observation.evaluate((observer, step) => observer.capture(`traversal:start:${step}`),
    `${targetName}:${direction}:${key}`);
  for (let attempt = 0; attempt < 50; attempt++) {
    if (await target.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press(key);
    await observation.evaluate((observer, step) => observer.capture(`traversal:after-tab:${step}`),
      `${targetName}:${attempt + 1}:${direction}:${key}`);
  }
  await expect(target, 'reachable by native sequential navigation').toBeFocused();
}

async function visibleFocus(target: Locator) {
  await expect(target).toBeFocused();
  await expect.poll(() => target.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const style = getComputedStyle(element);
    const ancestors: Element[] = [];
    for (let parent = element.parentElement; parent; parent = parent.parentElement) ancestors.push(parent);
    const unclipped = ancestors.every(parent => {
      const bounds = parent.getBoundingClientRect();
      const css = getComputedStyle(parent);
      return (!/(auto|scroll|hidden|clip)/.test(css.overflowX) || (rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1))
        && (!/(auto|scroll|hidden|clip)/.test(css.overflowY) || (rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1));
    });
    return rect.width > 0 && rect.height > 0 && rect.left >= 0 && rect.right <= innerWidth + 1
      && rect.top >= 0 && rect.bottom <= innerHeight + 1 && unclipped
      && Boolean(hit && element.contains(hit)) && style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
  }), 'native focus is visible, unclipped and has an indicator').toBe(true);
}

async function coherentShell(page: Page, mode: 'list' | 'cards', range: string) {
  await expect(page.locator('[data-sgui-part="data-grid-shell"]')).toHaveCount(1);
  await expect(page.locator('[data-sgui-part="data-toolbar"]')).toHaveCount(1);
  await expect(page.locator('[data-sgui-part="card-pagination-footer"]')).toHaveCount(1);
  await expect(page.getByText('1 selected', { exact: true })).toBeVisible();
  await expect(page.getByText(range, { exact: true })).toBeVisible();
  await expect(page.getByRole(mode === 'list' ? 'grid' : 'list', { name: 'Responsive courses', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'no host horizontal overflow').toBe(true);
}

for (const theme of ['light', 'dark']) {
  for (const enlarged of [false, true]) {
    test(`responsive shell switches views and accepts footer/status transitions (${theme}, ${enlarged ? '200% text' : 'normal text'})`, async ({ page, browserName }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.setViewportSize({ width: 760, height: 900 });
      await page.goto(`/iframe.html?id=data-display-appdatagridshell--native-responsive-transitions&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      await expect(page.getByRole('grid', { name: 'Responsive courses', exact: true })).toBeVisible();
      const observation = await observeNativeFocus(page);
      try {
        if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; }' });
        const accepted = page.getByRole('status', { name: 'Responsive accepted state' });
        const cards = page.getByRole('button', { name: 'Cards', exact: true });
        const list = page.getByRole('button', { name: 'List', exact: true });
        await tabTo(page, cards, browserName, observation);
        for (const width of [320, 760, 320]) {
          await page.setViewportSize({ width, height: 900 });
          await visibleFocus(cards);
          await coherentShell(page, 'list', '1-2 of 4');
        }
        await page.keyboard.press('Enter');
        await visibleFocus(cards);
        await expect(cards).toHaveAttribute('aria-pressed', 'true');
        await coherentShell(page, 'cards', '1-2 of 4');
        await expect(accepted).toHaveText('Page 0; requests 0; view cards');
        // Host status changes preserve the focused view control at narrow width.
        await page.keyboard.press('Alt+p');
        await expect(page.getByText('Refreshing rows', { exact: true })).toBeVisible();
        await expect(page.getByRole('list', { name: 'Responsive courses', exact: true })).toHaveAttribute('aria-busy', 'true');
        await visibleFocus(cards);
        await page.keyboard.press('Alt+e');
        await expect(page.getByText('Responsive host failed', { exact: true })).toBeVisible();
        await visibleFocus(cards);
        await tabTo(page, page.getByRole('button', { name: 'Retry', exact: true }), browserName, observation);
        await visibleFocus(page.getByRole('button', { name: 'Retry', exact: true }));
        await observation.evaluate(observer => observer.capture('retry:before-enter'));
        await page.keyboard.press('Enter');
        await expect(page.getByText('Refreshing rows', { exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Retry', exact: true })).toHaveCount(0);
        await expect(list).toBeEnabled();
        await expect(list).toHaveAttribute('tabindex', '0');
        await observation.evaluate(observer => observer.capture('retry:removed-pending-visible'));
        // List precedes the removed Retry starting point in native sequential order.
        await tabTo(page, list, browserName, observation, 'backward');
        await page.keyboard.press('Alt+r');
        await page.keyboard.press('Enter');
        await visibleFocus(list);
        await coherentShell(page, 'list', '1-2 of 4');
        await expect(page.getByText('Refreshing rows', { exact: true })).toHaveCount(0);
        await page.keyboard.press('Alt+p');
        await expect(page.getByRole('grid', { name: 'Responsive courses', exact: true })).toHaveAttribute('aria-busy', 'true');
        await expect(page.getByText('Refreshing rows', { exact: true })).toBeVisible();
        await visibleFocus(list);
        await page.keyboard.press('Alt+e');
        await expect(page.getByText('Responsive host failed', { exact: true })).toBeVisible();
        await coherentShell(page, 'list', '1-2 of 4');
        await visibleFocus(list);
        await page.keyboard.press('Alt+r');
        await expect(page.getByText('Responsive host failed', { exact: true })).toHaveCount(0);
        const next = page.getByRole('button', { name: 'Next page', exact: true });
        await tabTo(page, next, browserName, observation);
        await visibleFocus(next);
        await page.keyboard.press('Enter');
        await expect(accepted).toHaveText('Page 1; requests 1; view list');
        await coherentShell(page, 'list', '3-4 of 4');
        await visibleFocus(page.locator('tbody [data-grid-row="course-3"][data-grid-field="name"]'));
        await tabTo(page, cards, browserName, observation);
        await page.keyboard.press('Enter');
        await visibleFocus(cards);
        await coherentShell(page, 'cards', '3-4 of 4');
        const previous = page.getByRole('button', { name: 'Previous page', exact: true });
        await tabTo(page, previous, browserName, observation);
        await visibleFocus(previous);
        await page.keyboard.press('Enter');
        await expect(accepted).toHaveText('Page 0; requests 2; view cards');
        await coherentShell(page, 'cards', '1-2 of 4');
        await visibleFocus(page.locator('[data-sgui-part="grid-card"][data-grid-row="course-1"]'));
        await page.keyboard.press('Alt+p');
        await expect(page.getByText('Refreshing rows', { exact: true })).toBeVisible();
        await visibleFocus(page.locator('[data-sgui-part="grid-card"][data-grid-row="course-1"]'));
        await page.keyboard.press('Alt+r');
        await page.setViewportSize({ width: 760, height: 900 });
        await visibleFocus(page.locator('[data-sgui-part="grid-card"][data-grid-row="course-1"]'));
        await expect(accepted).toHaveText('Page 0; requests 2; view cards');
        expect(errors, 'browser runtime errors').toEqual([]);
      } finally {
        await observation.evaluate(observer => { observer.capture('test:finally'); observer.dispose(); });
        const diagnostic = await observation.evaluate(observer => observer.read());
        await test.info().attach('native-focus-lifecycle', {
          body: JSON.stringify({ browserName, theme, enlarged, ...diagnostic }, null, 2),
          contentType: 'application/json',
        });
        await observation.dispose();
      }
    });
  }
}
