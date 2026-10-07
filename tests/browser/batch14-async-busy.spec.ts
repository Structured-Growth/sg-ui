import { test, expect, type Locator, type Page } from '@playwright/test';

// locator.click waits for aria-disabled options to become enabled. A real mouse
// gesture is needed to verify the control itself ignores a disabled result.
async function clickDisabledOption(page: Page, option: Locator) {
  await expect(option).toBeVisible();
  await expect(option).toHaveAttribute('aria-disabled', 'true');
  await option.scrollIntoViewIfNeeded();
  const bounds = await option.boundingBox();
  expect(bounds).not.toBeNull();
  const point = { x: bounds!.x + bounds!.width / 2, y: bounds!.y + bounds!.height / 2 };
  expect(await option.evaluate((node, coordinates) => node.contains(document.elementFromPoint(coordinates.x, coordinates.y)), point)).toBe(true);
  await page.mouse.click(point.x, point.y);
}

test('AsyncMultiSelect forwards native busy state through host failure, retry and success independently', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/iframe.html?id=migration-proofs-asyncmultiselect--native-busy-lifecycle&viewMode=story&globals=a11y.manual:!true');
  const pending = page.getByRole('listbox', { name: 'Pending courses', exact: true });
  const other = page.getByRole('listbox', { name: 'Independent courses', exact: true });
  const input = page.getByRole('searchbox', { name: 'Pending courses', exact: true });
  await expect(pending).toHaveAttribute('aria-busy', 'true');
  await expect(other).not.toHaveAttribute('aria-busy');
  const nativeList = await pending.elementHandle();
  const nativeInput = await input.elementHandle();
  await clickDisabledOption(page, page.getByRole('option', { name: 'Retained result', exact: true }));
  await expect(page.getByLabel('Selection changes')).toHaveText('0');
  await expect(pending).toHaveAttribute('aria-busy', 'true');
  await page.getByRole('button', { name: 'Fail host search', exact: true }).click();
  await expect(pending).not.toHaveAttribute('aria-busy');
  await expect(page.getByRole('status').first()).toHaveText('Host search failed');
  await clickDisabledOption(page, page.getByRole('option', { name: 'Retained result', exact: true }));
  await expect(page.getByLabel('Selection changes')).toHaveText('0');
  await expect(pending).not.toHaveAttribute('aria-busy');
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(pending).toHaveAttribute('aria-busy', 'true');
  await expect(other).not.toHaveAttribute('aria-busy');
  await page.getByRole('button', { name: 'Resolve host search', exact: true }).click();
  await expect(pending).not.toHaveAttribute('aria-busy');
  await expect(input).toHaveValue('Host query');
  expect(await pending.evaluate((node, original) => node === original, nativeList)).toBe(true);
  expect(await input.evaluate((node, original) => node === original, nativeInput)).toBe(true);
  await expect(page.getByLabel('Query changes')).toHaveText('0');
  await page.getByRole('option', { name: 'Current result', exact: true }).click();
  await expect(page.getByLabel('Selection changes')).toHaveText('1');
  await page.getByRole('button', { name: 'Start host search', exact: true }).click();
  await expect(pending).toHaveAttribute('aria-busy', 'true');
  await expect(other).not.toHaveAttribute('aria-busy');
  await expect(page.getByRole('button', { name: 'Remove Current result', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
