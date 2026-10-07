import { expect, test } from '@playwright/test';

for (const opener of ['Enter', 'Alt+ArrowDown']) {
  test(`${opener} header promotion and toolbar clear keep controlled sorting and native focus coherent`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/iframe.html?id=migration-proofs-catalog-grid-sort-acceptance--controlled-multi-sort&viewMode=story&globals=a11y.manual:!true');
    const grid = page.getByRole('grid', { name: 'Sort acceptance courses' });
    const group = grid.getByRole('button', { name: 'Sort Group', exact: true });
    await expect(group).toBeVisible();
    // Enter the collection through its cell so its roving focus key matches
    // the nested trigger before activation.
    await grid.locator('thead [data-grid-field="group"]').focus();
    await expect(group).toBeFocused();
    // Grid cells reserve plain arrows for row navigation. These keys activate
    // the nested menu while preserving that navigation contract.
    await page.keyboard.press(opener);
    await expect(page.getByRole('menuitemradio', { name: 'Sort Ascending' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(group).toBeFocused();
    await expect(page.getByLabel('Accepted sorting')).toHaveText('[{"field":"group","direction":"desc"},{"field":"score","direction":"asc"}]');
    await expect(grid.locator('tbody [data-grid-field="name"]')).toHaveText(['Delta', 'Alpha']);
    await expect(grid.locator('[data-direction="desc"]')).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');
    const sort = page.getByRole('group', { name: 'Data toolbar' }).getByRole('button', { name: /^Sort/ });
    await sort.focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: /Column 1/ })).toContainText('Group');
    await expect(page.getByRole('button', { name: /Column 2/ })).toContainText('Score');
    await expect(page.getByRole('button', { name: 'Move sort rule up 1', exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Move sort rule down 2', exact: true })).toBeDisabled();
    const up = page.getByRole('button', { name: 'Move sort rule up 2', exact: true });
    await up.focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: /Column 1/ })).toBeFocused();
    await expect(page.getByRole('button', { name: /Column 1/ })).toContainText('Score');
    await page.getByRole('button', { name: 'Cancel', exact: true }).focus(); await page.keyboard.press('Enter');
    await expect(sort).toBeFocused();
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: 'Reset', exact: true }).focus(); await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: /Column 1/ })).toBeFocused();
    await page.getByRole('button', { name: /Column 1/ }).press('Enter');
    await expect(page.getByRole('option', { name: 'Course', exact: true })).toHaveCount(0);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Apply', exact: true }).focus(); await page.keyboard.press('Enter');
    await expect(sort).toBeFocused();
    await expect(page.getByLabel('Accepted sorting')).toHaveText('[]');
    await expect(grid.locator('tbody [data-grid-field="name"]')).toHaveText(['Alpha', 'Beta']);
    expect(errors).toEqual([]);
  });
}
