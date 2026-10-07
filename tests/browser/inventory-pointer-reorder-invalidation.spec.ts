import { test, expect, type Locator, type Page } from '@playwright/test';

const storyUrl = '/iframe.html?id=data-appdatagrid-pointer-invalidation--host-replacement-and-cross-grid&viewMode=story&globals=a11y.manual:!true';
type NativeEvent = { type: string; trusted: boolean; grid: string | null; row: string | null };
const region = (page: Page, name: 'Source' | 'Other') => page.getByRole('region', { name: `${name} grid`, exact: true });
const order = (page: Page, name: 'Source' | 'Other') => region(page, name).locator('[data-grid-field="name"][data-grid-row]');
const initial = (name: string) => Array.from({ length: 5 }, (_, index) => `${name} Course ${index + 1}`);
const sourceHandle = (page: Page) => page.getByRole('button', { name: 'Reorder Source Course 2', exact: true });
const events = (page: Page) => page.evaluate(() => (window as unknown as { pointerInvalidationEvents: NativeEvent[] }).pointerInvalidationEvents);

async function observe(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  await page.addInitScript(() => {
    const log: NativeEvent[] = [];
    Object.assign(window, { pointerInvalidationEvents: log });
    for (const type of ['dragstart', 'dragenter', 'drop', 'dragend']) document.addEventListener(type, event => {
      const target = event.target instanceof Element ? event.target : null;
      log.push({ type, trusted: event.isTrusted,
        grid: target?.closest('table[aria-label]')?.getAttribute('aria-label') ?? null,
        row: target?.closest('[data-grid-row]')?.getAttribute('data-grid-row') ?? null });
    }, true);
  });
  await page.setViewportSize({ width: 1200, height: 1500 });
  await page.goto(storyUrl);
  for (const name of ['Source', 'Other'] as const) await expect(order(page, name)).toHaveText(initial(name));
  return errors;
}

async function beginDrag(page: Page) {
  const source = sourceHandle(page);
  await expect(source).toBeEnabled();
  const box = (await source.boundingBox())!;
  // Trusted first pointer gesture. No locator.focus(), selection priming,
  // dispatched DragEvent/DataTransfer or fixture callback invocation.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2, { steps: 5 });
  await expect.poll(async () => (await events(page)).filter(event => event.type === 'dragstart')).toEqual([
    { type: 'dragstart', trusted: true, grid: 'Source courses', row: 'course-2' },
  ]);
}

async function moveTo(page: Page, target: Locator, after = false, expectedGrid?: 'Source courses' | 'Other courses') {
  const box = (await target.boundingBox())!;
  const x = box.x + Math.min(300, box.width / 2);
  const y = box.y + (after ? box.height - 2 : box.height / 2);
  const hit = (probeY = y) => page.evaluate(({ x, y }) => {
    const element = document.elementFromPoint(x, y);
    return { grid: element?.closest('table[aria-label]')?.getAttribute('aria-label') ?? null,
      row: element?.closest('tr[data-grid-row]')?.getAttribute('data-grid-row') ?? null };
  }, { x, y: probeY });
  // boundingBox includes clipped rows. Prove that this actual release point
  // hits the intended visible row, rather than a footer or an outside surface.
  if (expectedGrid) expect(await hit()).toEqual({ grid: expectedGrid, row: 'course-4' });
  await page.mouse.move(x, y, { steps: 10 });
  // A second native movement delivers dragover before mouseup.
  await page.mouse.move(x, y + (after ? -1 : 1));
  // Recheck after drag affordances render; no focus or DOM state is changed.
  if (expectedGrid) expect(await hit(y + (after ? -1 : 1))).toEqual({ grid: expectedGrid, row: 'course-4' });
}

async function expectCancelled(page: Page) {
  await expect.poll(async () => (await events(page)).filter(event => event.type === 'dragend').length).toBe(1);
  for (const name of ['Source', 'Other'] as const) {
    await expect(page.getByRole('status', { name: `${name} requests`, exact: true })).toHaveText(`${name} requests: 0`);
    await expect(order(page, name)).toHaveText(initial(name));
  }
  await expect(page.locator('[aria-roledescription="drop indicator"], [data-drop-target], [data-dragging]')).toHaveCount(0);
  await expect(sourceHandle(page)).toBeFocused();
}

for (const kind of ['dataset', 'identity'] as const) {
  test(`F7 trusted pointer drop after ${kind} replacement emits no stale move and restores source focus`, async ({ page }, info) => {
    const errors = await observe(page);
    await page.getByRole('button', { name: `Arm ${kind} replacement`, exact: true }).click();
    await beginDrag(page);
    await moveTo(page, page.getByRole('region', { name: 'Host replacement strip', exact: true }));
    await expect(page.getByRole('status', { name: 'Replacement state', exact: true }))
      .toHaveText(`Revision 1; last ${kind}; armed none`);
    await moveTo(page, region(page, 'Source').locator('tr[data-grid-row="course-4"]'), true, 'Source courses');
    await page.mouse.up();
    await info.attach('trusted-pointer-events', { body: JSON.stringify(await events(page)), contentType: 'application/json' });
    await expectCancelled(page);
    const native = (await events(page)).filter(event => ['dragstart', 'drop', 'dragend'].includes(event.type));
    expect(native.map(event => event.type)).toEqual(['dragstart', 'drop', 'dragend']);
    expect(native.every(event => event.trusted)).toBe(true);
    expect(native.find(event => event.type === 'drop')?.grid).toBe('Source courses');
    expect(errors, 'browser runtime errors').toEqual([]);
  });
}

test('F7 trusted pointer release over another grid cancels with colliding row IDs and no stale move', async ({ page }, info) => {
  const errors = await observe(page);
  await beginDrag(page);
  await moveTo(page, region(page, 'Other').locator('tr[data-grid-row="course-4"]'), true, 'Other courses');
  await expect.poll(async () => (await events(page)).some(event => event.type === 'dragenter' && event.grid === 'Other courses' && event.trusted)).toBe(true);
  await page.mouse.up();
  await info.attach('trusted-cross-grid-events', { body: JSON.stringify(await events(page)), contentType: 'application/json' });
  await expectCancelled(page);
  const native = (await events(page)).filter(event => ['dragstart', 'drop', 'dragend'].includes(event.type));
  expect(native.filter(event => event.type === 'dragstart')).toHaveLength(1);
  expect(native.filter(event => event.type === 'dragend')).toHaveLength(1);
  expect(native.every(event => event.trusted)).toBe(true);
  expect(errors, 'browser runtime errors').toEqual([]);
});
