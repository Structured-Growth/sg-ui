import { test, expect, type Page } from '@playwright/test';

async function tabTo(page: Page, target: ReturnType<Page['getByRole']>, recordFocus?: (gesture: string) => Promise<void>) {
  for (let index = 0; index < 100; index++) {
    await page.keyboard.press('Tab');
    await recordFocus?.(`Tab ${index + 1}`);
    if (await target.evaluate(element => element === document.activeElement)) return;
  }
  throw new Error('Native Tab did not reach the requested control');
}

// G-12 evidence gap: existing deterministic fixture, no source/story changes.
test('batch114 native column resize commits only its field and host keyboard order keeps actions last', async ({ page }, testInfo) => {
  const diagnostics: string[] = [];
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text());
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/iframe.html?id=migration-proofs-catalog-grid-interaction--client&viewMode=story&globals=a11y.manual:!true');
  const grid = page.getByRole('grid', { name: 'Courses', exact: true });
  const scoreHeader = grid.getByRole('columnheader').and(grid.locator('[data-grid-field="score"]'));
  const score = scoreHeader.getByRole('slider', { name: /^Resize Score\b/ });
  await expect(score).toBeVisible();
  const before = Number(await score.inputValue());
  // The Client fixture declares Score's 100–240 range. This increase case
  // starts inside it; a saturated initial width cannot establish an increase.
  expect(before).toBeGreaterThan(100);
  expect(before).toBeLessThan(240);
  // Fresh forward Tab entry focuses the first body row, not a header child.
  // ArrowUp enters the selection header; horizontal arrows then traverse
  // its children and each data header's sort/resizer pair.
  let focusSample = 0;
  const recordFocus = async (gesture: string) => {
    const active = await page.evaluate(() => {
      const element = document.activeElement;
      return element ? {
        tag: element.tagName,
        id: element.id,
        role: element.getAttribute('role'),
        label: element.getAttribute('aria-label'),
        text: element.textContent?.trim().slice(0, 160),
        tabIndex: element.getAttribute('tabindex'),
        field: element.closest('[data-grid-field]')?.getAttribute('data-grid-field'),
        row: element.closest('[data-grid-row]')?.getAttribute('data-grid-row'),
      } : null;
    });
    await testInfo.attach(`native-focus-${focusSample++}`, {
      body: JSON.stringify({ gesture, active }, null, 2),
      contentType: 'application/json',
    });
  };
  await recordFocus('initial before native Tab');
  const firstRow = grid.locator('tbody [data-sgui-part="grid-row"]').first();
  await tabTo(page, firstRow, recordFocus);
  await expect(firstRow).toBeFocused();
  const selectPage = grid.getByRole('checkbox', { name: 'Select page', exact: true });
  await page.keyboard.press('ArrowUp');
  await recordFocus('ArrowUp from first body row');
  await expect(selectPage).toBeFocused();
  for (const target of [
    grid.getByRole('button', { name: 'Selection actions', exact: true }),
    grid.getByRole('button', { name: 'Sort Course', exact: true }),
    grid.locator('thead [data-grid-field="name"]').getByRole('slider', { name: /^Resize Course\b/ }),
    scoreHeader.getByRole('button', { name: 'Sort Score', exact: true }),
    score,
  ]) {
    await page.keyboard.press('ArrowRight');
    await recordFocus('ArrowRight within headers');
    await expect(target).toBeFocused();
  }
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect.poll(async () => Number(await score.inputValue())).toBeGreaterThan(before);
  const committed = page.getByRole('status').filter({ hasText: 'Committed widths:' });
  await expect.poll(async () => {
    const text = await committed.innerText();
    return Object.keys(JSON.parse(text.split('Committed widths: ')[1]!));
  }).toEqual(['score']);
  await expect(score).toBeFocused();
  const order = page.getByRole('button', { name: 'Put score first', exact: true });
  await tabTo(page, order);
  await page.keyboard.press('Enter');
  await expect.poll(() => grid.locator('thead [data-grid-field]').evaluateAll(elements => elements.map(element => element.getAttribute('data-grid-field')))).toEqual(['score', 'name', 'status', 'due', 'actions']);
  await expect(order).toBeFocused();
  await expect(page.getByRole('checkbox', { name: 'Select Course 1', exact: true })).not.toBeChecked();
  expect(diagnostics).toEqual([]);
});
