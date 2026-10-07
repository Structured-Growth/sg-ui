import { test, expect, type Page } from '@playwright/test';

const storyUrl = '/iframe.html?id=data-appdatagrid--host-owned-reorder&viewMode=story&globals=a11y.manual:!true';
type NativeEvent = { type: string; trusted: boolean; row: string | null; pointerType?: string };

async function observe(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  await page.addInitScript(() => {
    const events: NativeEvent[] = [];
    Object.assign(window, { sguiNativeReorderEvents: events });
    for (const type of ['dragstart', 'drop', 'dragend', 'touchstart', 'pointerdown']) {
      document.addEventListener(type, event => events.push({
        type, trusted: event.isTrusted,
        row: (event.target as Element).closest('[data-grid-row]')?.getAttribute('data-grid-row') ?? null,
        pointerType: event instanceof PointerEvent ? event.pointerType : undefined,
      }), true);
    }
  });
  return errors;
}
const events = (page: Page) => page.evaluate(() => (window as unknown as Window & { sguiNativeReorderEvents: NativeEvent[] }).sguiNativeReorderEvents);
const names = (page: Page) => page.locator('[data-grid-field="name"][data-grid-row]');
const initial = ['Course 1', 'Course 2', 'Course 3', 'Course 4', 'Course 5'];

async function beginDrag(page: Page, sourceId: string) {
  const source = page.getByRole('button', { name: `Reorder Course ${sourceId}`, exact: true });
  await expect(source).toBeEnabled();
  await source.scrollIntoViewIfNeeded();
  const box = (await source.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2, { steps: 5 });
  await expect.poll(async () => (await events(page)).filter(event => event.type === 'dragstart')).toEqual([
    { type: 'dragstart', trusted: true, row: `course-${sourceId}`, pointerType: undefined },
  ]);
}

async function dropAt(page: Page, targetId: string, position: 'before' | 'after') {
  const box = (await page.locator(`tr[data-grid-row="course-${targetId}"]`).boundingBox())!;
  const x = box.x + 300;
  const y = box.y + (position === 'after' ? box.height - 2 : 2);
  await page.mouse.move(x, y, { steps: 10 });
  // A second native movement delivers dragover before mouseup in every engine.
  await page.mouse.move(x, y + (position === 'after' ? -1 : 1));
  await page.mouse.up();
}

for (const position of ['before', 'after'] as const) {
  test(`first native pointer drag commits ${position} target and restores source handle focus`, async ({ page }, info) => {
    const errors = await observe(page);
    await page.goto(storyUrl);
    await expect(names(page)).toHaveText(initial);
    const sourceId = position === 'after' ? '1' : '3';
    await beginDrag(page, sourceId);
    await dropAt(page, position === 'after' ? '3' : '1', position);
    await expect(page.getByRole('status').filter({ hasText: 'Order saved.' })).toBeVisible();
    await expect(names(page)).toHaveText(position === 'after' ? ['Course 2', 'Course 3', 'Course 1', 'Course 4', 'Course 5'] : ['Course 3', 'Course 1', 'Course 2', 'Course 4', 'Course 5']);
    await expect(page.getByRole('button', { name: `Reorder Course ${sourceId}`, exact: true })).toBeFocused();
    const native = (await events(page)).filter(event => ['dragstart', 'drop', 'dragend'].includes(event.type));
    expect(native.map(event => event.type)).toEqual(['dragstart', 'drop', 'dragend']);
    expect(native.every(event => event.trusted)).toBe(true);
    await info.attach('native-drag-events', { body: JSON.stringify(native), contentType: 'application/json' });
    expect(errors, 'browser runtime errors').toEqual([]);
  });
}

test('native pointer drop outside cancels; rejected pointer move rolls back to host order', async ({ page }) => {
  const errors = await observe(page);
  await page.goto(storyUrl);
  await expect(names(page)).toHaveText(initial);
  await beginDrag(page, '1');
  await page.mouse.move(500, 5, { steps: 10 });
  await page.mouse.move(501, 5);
  await page.mouse.up();
  await expect.poll(async () => (await events(page)).filter(event => event.type === 'dragend').length).toBe(1);
  await expect(page.getByRole('status').filter({ hasText: 'Ready' })).toBeVisible();
  await expect(names(page)).toHaveText(initial);
  await expect(page.getByRole('button', { name: 'Reorder Course 1', exact: true })).toBeFocused();
  expect((await events(page)).filter(event => event.type === 'drop')).toHaveLength(0);
  await page.getByRole('button', { name: 'Reject next move', exact: true }).click();
  // Observe a fresh drag; no synthetic DragEvent/DataTransfer or callback dispatch.
  await page.evaluate(() => { (window as unknown as Window & { sguiNativeReorderEvents: NativeEvent[] }).sguiNativeReorderEvents.length = 0; });
  await beginDrag(page, '1');
  await dropAt(page, '3', 'after');
  await expect(page.getByRole('status').filter({ hasText: 'Save failed; previous order restored.' })).toBeVisible();
  await expect(names(page)).toHaveText(initial);
  await expect(page.getByRole('button', { name: 'Reorder Course 1', exact: true })).toBeFocused();
  expect(errors, 'browser runtime errors').toEqual([]);
});

test('multiple selection and sorting disable native reorder without emitting host moves', async ({ page }) => {
  const errors = await observe(page);
  await page.goto(storyUrl);
  await expect(names(page)).toHaveText(initial);
  for (const name of ['Course 1', 'Course 2']) await page.getByRole('checkbox', { name: `Select ${name}`, exact: true }).locator('xpath=ancestor::label').click();
  const source = page.getByRole('button', { name: 'Reorder Course 1', exact: true });
  for (const boundary of ['selection', 'sorting']) {
    if (boundary === 'sorting') {
      for (const name of ['Course 1', 'Course 2']) await page.getByRole('checkbox', { name: `Select ${name}`, exact: true }).locator('xpath=ancestor::label').click();
      await page.getByRole('button', { name: 'Sort Course', exact: true }).click();
      await page.getByRole('menuitemradio', { name: 'Sort Ascending', exact: true }).click();
    }
    await expect(source).toBeDisabled();
    const box = (await source.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2, { steps: 5 });
    await page.mouse.move(400, box.y + 120, { steps: 10 });
    await page.mouse.up();
    expect((await events(page)).filter(event => event.type === 'dragstart')).toHaveLength(0);
    await expect(page.getByRole('status').filter({ hasText: 'Ready' })).toBeVisible();
    await expect(names(page)).toHaveText(initial);
  }
  expect(errors, 'browser runtime errors').toEqual([]);
});

test('touchscreen non-drag Move alternative commits and rolls back with trusted touch input', async ({ browser, baseURL }, info) => {
  // Touch emulation verifies the alternative, not physical-device long-press dragging.
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    const errors = await observe(page);
    await page.goto(storyUrl);
    await expect(names(page)).toHaveText(initial);
    await page.getByRole('button', { name: 'Move Course 1 down', exact: true }).tap();
    await expect(page.getByRole('status').filter({ hasText: 'Order saved.' })).toBeVisible();
    await expect(names(page)).toHaveText(['Course 2', 'Course 1', 'Course 3', 'Course 4', 'Course 5']);
    await page.getByRole('button', { name: 'Reject next move', exact: true }).tap();
    await page.getByRole('button', { name: 'Move Course 1 down', exact: true }).tap();
    await expect(page.getByRole('status').filter({ hasText: 'Save failed; previous order restored.' })).toBeVisible();
    await expect(names(page)).toHaveText(['Course 2', 'Course 1', 'Course 3', 'Course 4', 'Course 5']);
    const native = await events(page);
    expect(native.filter(event => event.type === 'touchstart')).toHaveLength(3);
    expect(native.filter(event => event.type === 'pointerdown').every(event => event.pointerType === 'touch')).toBe(true);
    expect(native.every(event => event.trusted)).toBe(true);
    expect(native.filter(event => event.type === 'dragstart')).toHaveLength(0);
    await info.attach('native-touch-alternative-events', { body: JSON.stringify(native), contentType: 'application/json' });
    expect(errors, 'browser runtime errors').toEqual([]);
  } finally {
    await context.close();
  }
});
