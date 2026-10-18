import { test, expect } from '@playwright/test';

test('functionality column order requests preserve visibility in controlled shell', async ({ page }) => {
  await page.goto('/fixtures/?id=data-display-datatoolbar-column-order--controlled-host-order&globals=a11y.manual:!true');
  const order = page.locator('output[aria-label="Host column order"]');
  const visibility = page.locator('output[aria-label="Host column visibility"]');
  await expect(order).toHaveText('name,site,score,notes,actions');
  await expect(visibility).toHaveText('{"notes":false}');
  await page.getByRole('button', { name: 'Columns', exact: true }).click();
  const menu = page.getByRole('dialog', { name: 'Columns', exact: true });
  await expect(menu.getByRole('checkbox', { name: 'Course', exact: true })).toBeDisabled();
  await menu.getByRole('searchbox', { name: 'Search', exact: true }).fill('Site');
  await menu.getByRole('button', { name: 'Move Site down', exact: true }).click();
  await expect(order).toHaveText('name,score,site,notes,actions');
  expect(JSON.parse((await visibility.textContent())!)).toEqual({ name: true, site: true, score: true, notes: false, actions: true });
  await page.keyboard.press('Escape');
  const headers = page.getByRole('grid', { name: 'Course column order' }).getByRole('columnheader');
  await expect(headers).toHaveCount(5);
  const names=await headers.evaluateAll(nodes=>nodes.slice(1).map(node=>node.getAttribute('data-grid-field')));
  expect(names).toEqual(['name', 'score', 'site', 'actions']);
  for (const [index,label] of ['Course','Score','Site','Actions'].entries()) await expect(headers.nth(index+1).getByText(label,{exact:true})).toBeVisible();
});

test('functionality DatePicker Clear closes restores focus and preserves silent reset', async ({ page }) => {
  await page.goto('/fixtures/?id=migration-proofs-datepicker--native-form-reset&globals=a11y.manual:!true');
  const trigger = page.getByRole('button', { name: 'Choose Reset date', exact: true });
  const changes = page.locator('output[aria-label="Date changes"]');
  const value = () => page.locator('form').evaluate(form => new FormData(form as HTMLFormElement).get('date'));
  await expect(changes).toHaveText('0');
  expect(await value()).toBe('2024-02-28');
  await trigger.click();
  await page.getByRole('dialog', { name: 'Reset date', exact: true }).getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Reset date', exact: true })).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(changes).toHaveText('1');
  expect(await value()).toBe('');
  await page.getByRole('button', { name: 'Reset dates', exact: true }).click();
  await expect.poll(value).toBe('2024-02-28');
  await expect(changes).toHaveText('1');
});
