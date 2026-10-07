import { expect, test } from '@playwright/test';

// G-29: deliberately UNRUN until the coordinator grants a native window.
test('batch117 selected focused row disappearance preserves independent selection and repairs body entry', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text());
  });
  await page.goto('/iframe.html?id=migration-proofs-catalog-grid-interaction--focus-retention&viewMode=story&globals=a11y.manual:!true');
  const first = page.getByRole('grid', { name: 'Focus courses', exact: true });
  const second = page.getByRole('grid', { name: 'Independent focus courses', exact: true });
  const independent = second.getByRole('checkbox', { name: 'Select Course 2', exact: true });
  await independent.locator('xpath=ancestor::label').click();
  await expect(independent).toBeChecked();
  const selected = first.getByRole('checkbox', { name: 'Select Course 8', exact: true });
  await selected.locator('xpath=ancestor::label').click();
  await expect(selected).toBeChecked();
  // Establish a collection cell entry, as in the existing focus-retention spec.
  // No focus is injected after the host removes the selected row.
  const cell = first.locator('tbody [data-grid-row="7"][data-grid-field="status"]');
  await cell.focus();
  await expect(cell).toBeFocused();
  await page.keyboard.press('Alt+d');
  await expect(first.locator('tbody [data-grid-row="7"]')).toHaveCount(0);
  await expect.poll(() => first.evaluate(node => {
    const active = document.activeElement;
    return node.contains(active) && active?.getAttribute('data-grid-field') === 'status'
      && !!active.closest('tbody') && active.getAttribute('data-grid-row') !== '7';
  })).toBe(true);
  await expect(independent).toBeChecked();
  await expect(second.locator('tbody [data-grid-row="7"][data-grid-field="name"]')).toHaveText('Course 8');
  await info.attach('batch117-selected-row-removal', {
    body: JSON.stringify(await page.evaluate(() => ({ active: document.activeElement?.outerHTML,
      grids: [...document.querySelectorAll('[role="grid"]')].map(node => ({ label: node.getAttribute('aria-label'),
        checked: [...node.querySelectorAll('input:checked')].map(input => input.getAttribute('aria-label')) })) }))),
    contentType: 'application/json',
  });
  expect(errors).toEqual([]);
});
