import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

async function story(page: Page, id: string, theme = 'light') {
  // The harness owns axe execution; keep the addon from launching a concurrent scan.
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  // Deferred until the test finishes so asynchronous React/portal errors fail too.
  (page as Page & { browserErrors?: string[] }).browserErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { browserErrors?: string[] }).browserErrors, 'browser runtime errors').toEqual([]);
});

test('native downloads transfer exact bytes and bypass routing; canceled/router/target/external links retain semantics', async ({ page, context }, info) => {
  await story(page, 'migration-proofs-link--navigation-semantics');
  for (const label of ['Download with empty filename', 'Download named file', 'Download boolean file']) {
    const pending = page.waitForEvent('download');
    await page.getByRole('link', { name: label, exact: true }).click();
    const download = await pending;
    const path = info.outputPath(`${label}.txt`);
    await download.saveAs(path);
    expect(await download.failure()).toBeNull();
    expect(await readFile(path, 'utf8')).toBe('SGUI download regression');
    if (label === 'Download named file') expect(download.suggestedFilename()).toBe('course.txt');
  }
  const events = page.getByLabel('Navigation events');
  await expect(events).not.toContainText('navigate:');
  await page.getByRole('link', { name: 'Router course', exact: true }).click();
  await expect(events).toContainText('route:click\nnavigate:#course\nroute:defaultPrevented=true');
  await page.getByRole('link', { name: 'Cancel navigation' }).click();
  await expect(events).toContainText('cancel:defaultPrevented=true');
  await expect(events).not.toContainText('navigate:#cancel');
  await page.getByRole('link', { name: 'Route with download false' }).click();
  await expect(events).toContainText('false-download:click\nnavigate:#false-download\nfalse-download:defaultPrevented=true');
  const modifiedPopup = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Router course', exact: true }).click({ modifiers: ['ControlOrMeta'] });
  const modifiedTab = await modifiedPopup;
  await modifiedTab.waitForLoadState();
  expect(modifiedTab.url()).toContain('#course');
  await modifiedTab.close();
  await expect(events).toContainText('route:defaultPrevented=false');
  expect((await events.innerText()).match(/navigate:#course/g)).toHaveLength(1);
  const popup = context.waitForEvent('page');
  await page.getByRole('link', { name: 'New tab course' }).click();
  const tab = await popup;
  await tab.waitForLoadState();
  expect(tab.url()).toContain('#target');
  await tab.close();
  await expect(events).not.toContainText('navigate:#target');
  await page.getByRole('link', { name: 'Native external link' }).click();
  await expect(page).toHaveURL(/#external$/);
  await expect(events).not.toContainText('navigate:#external');
});

test('nested dialog keyboard dismissal closes the inner popover first and restores trigger focus', async ({ page }) => {
  await story(page, 'migration-proofs-dialog--nested-form');
  const trigger = page.getByRole('button', { name: 'Create course', exact: true });
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Course name' })).toBeFocused();
  const help = page.getByRole('button', { name: 'Naming help' });
  await help.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Private note' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('textbox', { name: 'Private note' })).toBeHidden();
  await expect(page.getByRole('dialog', { name: 'Create course' })).toBeVisible();
  await expect(help).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Create course' })).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('grid nested actions, selection, sorting and native keyboard cell navigation coexist', async ({ page }) => {
  await story(page, 'data-appdatagrid--default');
  const grid = page.getByRole('grid', { name: 'Courses', exact: true });
  await expect(grid).toBeVisible();
  const cell = grid.getByRole('row').nth(1).getByRole('rowheader').first();
  await cell.focus();
  await page.keyboard.press('ArrowRight');
  await expect(grid.locator('[data-grid-row="course-1"][data-grid-field="score"]')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(grid.locator('[data-grid-row="course-2"][data-grid-field="score"]')).toBeFocused();
  await page.getByRole('checkbox', { name: 'Select Course 1', exact: true }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('checkbox', { name: 'Select Course 1', exact: true })).toBeChecked();
  await grid.getByRole('row').nth(1).getByRole('button', { name: /Actions/ }).click();
  await expect(page.getByRole('menuitem', { name: 'Open Course 1' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('checkbox', { name: 'Select Course 1', exact: true })).toBeChecked();
  await grid.getByRole('button', { name: /Sort Score/ }).click();
  await page.getByRole('menuitemradio', { name: 'Sort Ascending', exact: true }).click();
  await expect(grid.getByRole('columnheader', { name: /Score/ })).toHaveAttribute('aria-sort', 'ascending');
});

test('real Lexical typing, keyboard selection and bold preserve document text', async ({ page }) => {
  await story(page, 'editors-pagerichtexteditorsection--full-tools');
  const editor = page.getByRole('textbox', { name: 'Document', exact: true });
  await editor.fill('Browser acceptance text');
  await editor.press('ControlOrMeta+A');
  await expect.poll(() => editor.evaluate(() => window.getSelection()?.toString())).toBe('Browser acceptance text');
  await page.keyboard.press('Alt+F10');
  const bold = page.getByRole('group', { name: 'Selection formatting', exact: true }).getByRole('button', { name: 'Bold', exact: true });
  await expect(bold).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(editor.locator('strong, b')).toHaveText('Browser acceptance text');
  await expect(editor).toHaveText('Browser acceptance text');
});

for (const theme of ['light', 'dark']) {
  for (const id of ['data-appdatagrid--default', 'editors-pagerichtexteditorsection--full-tools', 'editors-pagerichtexteditorsection--dark-read-only', 'migration-proofs-dialog--nested-form']) {
    test(`WCAG A/AA axe gate: ${id}, ${theme}`, async ({ page }, info) => {
      await story(page, id, theme);
      if (id.includes('dialog')) await page.getByRole('button', { name: 'Create course', exact: true }).click();
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      await info.attach('axe-results', { body: JSON.stringify(results, null, 2), contentType: 'application/json' });
      expect(results.violations).toEqual([]);
    });
  }
}


test('read-only document can be scrolled with native keyboard input', async ({ page }) => {
  await story(page, 'editors-pagerichtexteditorsection--dark-read-only');
  const viewport = page.getByRole('region', { name: 'Document scroll region' });
  await viewport.focus();
  await expect(viewport).toBeFocused();
  await page.keyboard.press('PageDown');
  await expect.poll(() => viewport.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
});

test('1000-row processing and 250-row render performance smoke remains responsive', async ({ page }, info) => {
  const started = Date.now();
  await story(page, 'data-appdatagrid--browser-performance');
  const grid = page.getByRole('grid', { name: 'Courses', exact: true });
  await expect(grid.getByRole('row')).toHaveCount(251);
  const rendered = Date.now();
  await grid.getByRole('button', { name: 'Sort Score', exact: true }).click();
  await page.getByRole('menuitemradio', { name: 'Sort Descending', exact: true }).click();
  await expect(grid.getByRole('columnheader', { name: /Score/ })).toHaveAttribute('aria-sort', 'descending');
  await expect(grid.locator('[data-grid-field="score"][data-grid-row]').first()).toHaveText('10');
  const sorted = Date.now();
  await info.attach('performance-smoke', { body: JSON.stringify({ rows: 1000, renderedRows: 250, navigationAndRenderMs: rendered - started, sortAndRenderMs: sorted - rendered, browser: info.project.name }), contentType: 'application/json' });
  // A generous hang/regression guard. Hardware baselines and memory budgets remain P-08/X-19 work.
  expect(sorted - started).toBeLessThan(15_000);
});

test('host-owned keyboard Move requests preserve source focus and rollback restores row order', async ({ page }) => {
  await story(page, 'data-appdatagrid--host-owned-reorder');
  const grid = page.getByRole('grid', { name: 'Reorder courses', exact: true });
  const names = () => grid.locator('[data-grid-field="name"][data-grid-row]').allTextContents();
  const source = page.getByRole('button', { name: 'Move Course 1 down', exact: true });
  await grid.locator('tr[data-grid-row="course-1"]').focus();
  // React Aria enters draggable rows before traversing their nested controls.
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await expect(source).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByRole('status').filter({ hasText: 'Order saved.' })).toBeVisible();
  expect(await names()).toEqual(['Course 2', 'Course 1', 'Course 3', 'Course 4', 'Course 5']);
  await expect(page.getByRole('button', { name: 'Move Course 1 down', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Reject next move', exact: true }).click();
  await grid.locator('tr[data-grid-row="course-1"]').focus();
  for (let index = 0; index < 4; index++) await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: 'Move Course 1 down', exact: true })).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByRole('status').filter({ hasText: 'Save failed; previous order restored.' })).toBeVisible();
  expect(await names()).toEqual(['Course 2', 'Course 1', 'Course 3', 'Course 4', 'Course 5']);
  const toggle = page.getByRole('button', { name: 'Enable row reorder', exact: true });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /^Reorder Course/ })).toHaveCount(0);
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /^Reorder Course/ })).toHaveCount(5);
  await expect(toggle).toBeFocused();
});
