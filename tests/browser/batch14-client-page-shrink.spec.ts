import { expect, test } from '@playwright/test';

for (const surface of ['grid', 'list', 'cards']) {
  test(`${surface} keeps shrunk display coherent and enters only accepted pages`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const id = surface === 'grid' ? 'data-appdatagrid' : 'data-display-appdatagridshell';
    await page.goto(`/iframe.html?id=${id}--client-dataset-shrink&viewMode=story&globals=a11y.manual:!true`);
    await expect(page.getByText('Course 31', { exact: true })).toBeVisible();
    if (surface === 'cards') await page.getByRole('button', { name: 'Cards', exact: true }).click();
    await page.getByRole('button', { name: 'Shrink to 11 rows', exact: true }).click();
    await expect(page.getByText('Course 11', { exact: true })).toBeVisible();
    await expect(page.getByText('11-11 of 11', { exact: true })).toBeVisible();
    await expect(page.getByRole('status', { name: 'Host pagination' })).toHaveText('Requested page 3, requests 0');
    await expect(page.getByRole('button', { name: 'Shrink to 11 rows', exact: true })).toBeFocused();
    await page.getByRole('button', { name: 'Previous page', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Last pagination request' })).toHaveText('Page 0, size 10');
    await expect(page.getByRole('status', { name: 'Host pagination' })).toHaveText('Requested page 3, requests 1');
    await expect(page.getByRole('button', { name: 'Previous page', exact: true })).toBeFocused();
    await expect(page.getByText('Course 11', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Accept navigation', exact: true }).click();
    await page.getByRole('button', { name: 'Previous page', exact: true }).click();
    await expect(page.getByRole('status', { name: 'Host pagination' })).toHaveText('Requested page 0, requests 2');
    const entry = surface === 'cards' ? page.locator('[data-sgui-part="grid-card"]').first()
      : page.locator('tbody [data-grid-field="name"]').first();
    await expect(entry).toBeFocused();
    await expect(entry).toContainText('Course 1');
    const scroll = page.locator('[data-sgui-part="grid-container"]');
    if (surface !== 'cards') {
      await expect.poll(() => scroll.evaluate(node => node.scrollTop)).toBe(0);
      await scroll.evaluate(node => { node.scrollTop = node.scrollHeight; });
      await page.getByRole('button', { name: 'Next page', exact: true }).click();
      await expect.poll(() => scroll.evaluate(node => node.scrollTop)).toBe(0);
      await expect(entry).toBeFocused();
      await expect(entry).toContainText('Course 11');
    }
    await page.getByRole('button', { name: 'Empty dataset', exact: true }).click();
    await expect(page.getByText('0-0 of 0', { exact: true })).toBeVisible();
    if (surface !== 'grid') await expect(page.getByText('1 selected', { exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });
}
