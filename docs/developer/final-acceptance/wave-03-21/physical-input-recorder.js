// Paste into the physical device's remote browser console on the named fixture.
// Read-only observation: never dispatches input, calls host actions, or repairs focus.
(() => {
  window.sguiReorderCapture?.stop();
  const events = [];
  const types = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel',
    'touchstart', 'touchmove', 'touchend', 'touchcancel',
    'dragstart', 'dragenter', 'dragover', 'drop', 'dragend', 'keydown', 'focusin'];
  const identify = node => {
    const element = node instanceof Element ? node : null;
    return { name: element?.getAttribute('aria-label') ?? element?.textContent?.slice(0, 80) ?? null,
      grid: element?.closest('table[aria-label]')?.getAttribute('aria-label') ?? null,
      row: element?.closest('[data-grid-row]')?.getAttribute('data-grid-row') ?? null };
  };
  const record = event => {
    if (events.length >= 20000) { window.sguiReorderCapture.stop(); return; }
    const touch = 'touches' in event ? event.touches[0] ?? event.changedTouches[0] : null;
    events.push({ at: performance.now(), type: event.type, trusted: event.isTrusted,
      pointerType: event.pointerType ?? null, key: event.key ?? null,
      x: event.clientX ?? touch?.clientX ?? null, y: event.clientY ?? touch?.clientY ?? null,
      target: identify(event.target), focus: identify(document.activeElement) });
  };
  const snapshot = () => ({
    at: performance.now(), focus: identify(document.activeElement),
    grids: [...document.querySelectorAll('table[aria-label]')].map(table => ({
      label: table.getAttribute('aria-label'),
      rows: [...table.querySelectorAll('[data-grid-field="name"][data-grid-row]')].map(cell => ({ id: cell.dataset.gridRow, text: cell.textContent })),
      selection: [...table.querySelectorAll('input[type="checkbox"]:checked')].map(node => node.getAttribute('aria-label')),
    })),
    statuses: [...document.querySelectorAll('[role="status"]')].map(node => ({ name: node.getAttribute('aria-label'), text: node.textContent })),
    indicators: document.querySelectorAll('[aria-roledescription="drop indicator"], [data-drop-target], [data-dragging]').length,
  });
  const snapshots = [snapshot()];
  for (const type of types) document.addEventListener(type, record, { capture: true, passive: true });
  const observer = new MutationObserver(() => {
    if (snapshots.length >= 10000) { window.sguiReorderCapture.stop(); return; }
    snapshots.push(snapshot());
  });
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
  window.sguiReorderCapture = {
    mark(label) { events.push({ at: performance.now(), type: 'operator-mark', label }); snapshots.push(snapshot()); },
    export() { return { capturedAt: new Date().toISOString(), url: location.href, userAgent: navigator.userAgent,
      maxTouchPoints: navigator.maxTouchPoints, events, snapshots }; },
    stop() { for (const type of types) document.removeEventListener(type, record, true); observer.disconnect(); },
  };
})();
