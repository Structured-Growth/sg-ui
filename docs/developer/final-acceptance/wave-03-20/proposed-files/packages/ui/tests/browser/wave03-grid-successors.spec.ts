import { expect, test } from '@playwright/test';

const focusFixture = '/fixtures/?id=migration-proofs-catalog-grid-interaction--focus-retention&globals=a11y.manual:!true';
test('native Tab and Shift+Tab enter and leave the remembered grid entry', async ({ page }, info) => {
  await page.goto(focusFixture);
  const host = page.getByRole('button', { name: 'Host action', exact: true });
  const grid = page.getByRole('grid', { name: 'Focus courses', exact: true });
  // Only the external host button is seeded; grid entry is exclusively native Tab.
  await host.focus(); await page.keyboard.press('Tab');
  await expect.poll(() => grid.evaluate(node => node.contains(document.activeElement))).toBe(true);
  const entry = await page.evaluate(() => ({ role: document.activeElement?.getAttribute('role'),
    field: document.activeElement?.getAttribute('data-grid-field'), label: document.activeElement?.getAttribute('aria-label') }));
  await page.keyboard.press('Shift+Tab'); await expect(host).toBeFocused();
  await page.keyboard.press('Tab');
  await expect.poll(() => grid.evaluate(node => node.contains(document.activeElement))).toBe(true);
  expect(await page.evaluate(() => ({ role: document.activeElement?.getAttribute('role'), field: document.activeElement?.getAttribute('data-grid-field'), label: document.activeElement?.getAttribute('aria-label') }))).toEqual(entry);
  await info.attach('native-entry', { body: JSON.stringify(entry), contentType: 'application/json' });
  await page.keyboard.press('Tab');
  await expect.poll(() => grid.evaluate(node => node.contains(document.activeElement))).toBe(false);
});

test('selected focused row disappearance preserves sibling selection, focus ownership and scroll', async ({ page }, info) => {
  await page.goto(focusFixture);
  const grid = page.getByRole('grid', { name: 'Focus courses', exact: true });
  const sibling = page.getByRole('grid', { name: 'Independent focus courses', exact: true });
  await expect(grid.getByRole('checkbox', { name: 'Select Course 8', exact: true })).toBeChecked();
  await sibling.getByRole('checkbox', { name: 'Select Course 2', exact: true }).focus();
  await page.keyboard.press('Space');
  const container = grid.locator('..'), other = sibling.locator('..');
  await grid.locator('tbody [data-grid-row="7"][data-grid-field="status"]').focus();
  await container.evaluate(node => { node.scrollTop = 150; node.scrollLeft = 120; });
  const before = await container.evaluate(node => [node.scrollTop, node.scrollLeft]);
  const otherBefore = await other.evaluate(node => [node.scrollTop, node.scrollLeft]);
  await page.keyboard.press('Alt+d');
  await expect(grid.getByRole('checkbox', { name: 'Select Course 8', exact: true })).toHaveCount(0);
  await expect.poll(() => grid.evaluate(node => node.contains(document.activeElement) && document.activeElement?.getAttribute('data-grid-field') === 'status')).toBe(true);
  await expect.poll(() => container.evaluate(node => [node.scrollTop, node.scrollLeft])).toEqual(before);
  await expect(sibling.getByRole('checkbox', { name: 'Select Course 2', exact: true })).toBeChecked();
  await expect.poll(() => other.evaluate(node => [node.scrollTop, node.scrollLeft])).toEqual(otherBefore);
  await info.attach('selected-removal', { body: JSON.stringify({ before, otherBefore,
    active: await page.evaluate(() => document.activeElement?.outerHTML) }), contentType: 'application/json' });
});

test('optimistic row action rollback, retry, reorder cancel and late settlement remain per host', async ({ page }) => {
  await page.goto('/fixtures/?id=data-display-appdatagridshell-host-operations--optimistic-actions');
  const first = page.getByRole('region', { name: 'First operation host', exact: true });
  const second = page.getByRole('region', { name: 'Second operation host', exact: true });
  await first.getByRole('button', { name: 'Move Alpha down', exact: true }).click();
  await expect(first.getByRole('grid').locator('tbody [data-grid-field="name"]').first()).toHaveText('Beta');
  await page.getByRole('button', { name: 'Reject 1', exact: true }).click();
  await expect(first.getByRole('alert')).toContainText('Save failed');
  await expect(first.getByRole('grid').locator('tbody [data-grid-field="name"]').first()).toHaveText('Alpha');
  await first.getByRole('button', { name: 'Retry First', exact: true }).click();
  await page.getByRole('button', { name: 'Resolve 2', exact: true }).click();
  await expect(first.getByRole('status').filter({ hasText: 'Changes saved' })).toBeVisible();
  await first.getByRole('button', { name: 'Move Beta down', exact: true }).click();
  await first.getByRole('button', { name: 'Cancel First', exact: true }).click();
  await page.getByRole('button', { name: 'Resolve 3', exact: true }).click();
  await expect(first.getByRole('status').filter({ hasText: 'Changes canceled' })).toBeVisible();
  await expect(first.getByRole('grid').locator('tbody [data-grid-field="name"]').first()).toHaveText('Beta');
  await expect(second.getByRole('grid').locator('tbody [data-grid-field="name"]').first()).toHaveText('Alpha');
  await expect(second.getByRole('status').filter({ hasText: 'Ready' })).toBeVisible();
  await first.getByRole('button', { name: 'Actions for Alpha', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Rename course', exact: true }).click();
  await expect(first.getByRole('grid').getByText('Alpha revised', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reject 4', exact: true }).click();
  await expect(first.getByRole('grid').getByText('Alpha', { exact: true })).toBeVisible();
  await first.getByRole('button', { name: 'Retry First', exact: true }).click();
  await page.getByRole('button', { name: 'Resolve 5', exact: true }).click();
  await expect(first.getByRole('grid').getByText('Alpha revised', { exact: true })).toBeVisible();
  await expect(second.getByRole('grid').getByText('Alpha', { exact: true })).toBeVisible();
});
