import { test, expect, type Page } from '@playwright/test';

async function story(page: Page, theme: string) {
  await page.goto(`/iframe.html?id=migration-proofs-daterangeselector--availability&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  (page as Page & { browserErrors?: string[] }).browserErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { browserErrors?: string[] }).browserErrors, 'browser runtime errors').toEqual([]);
});

for (const theme of ['light', 'dark']) {
  test(`preset explanations are visible and associated before native keyboard commit: ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await story(page, theme);
    const blocked = page.getByRole('button', { name: 'February reporting period', exact: true });
    const blockedDescription = 'Includes the unavailable capacity date.';
    const early = page.getByRole('button', { name: 'Early February', exact: true });
    const earlyDescription = 'First two weeks, before capacity closes.';
    await expect(blocked).toBeDisabled();
    await expect(blocked).toHaveAccessibleDescription(blockedDescription);
    await expect(page.getByText(blockedDescription, { exact: true })).toBeVisible();
    await expect(page.getByText(earlyDescription, { exact: true })).toBeVisible();
    await expect(early).toHaveAccessibleDescription(earlyDescription);
    for (const description of [blockedDescription, earlyDescription]) {
      expect(await page.getByText(description, { exact: true }).evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return bounds.left >= 0 && bounds.right <= innerWidth + 1 && element.scrollWidth <= element.clientWidth + 1;
      }), 'preset description wraps within the narrow viewport').toBe(true);
    }
    const committed = page.getByLabel('Committed booking dates');
    await expect(committed).toHaveText('No committed dates');
    await early.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status').filter({ hasText: '2024-02-01 – 2024-02-14' })).toBeVisible();
    await expect(committed).toHaveText('No committed dates');
    const apply = page.getByRole('button', { name: 'Apply', exact: true });
    await apply.focus();
    await page.keyboard.press('Enter');
    await expect(committed).toHaveText('2024-02-01 – 2024-02-14');
  });

  test(`native calendar focus exposes unavailability without selecting; disclosure works without hover: ${theme}`, async ({ page }) => {
    await story(page, theme);
    const next = page.getByRole('button', { name: 'Next month', exact: true });
    await next.focus();
    await page.keyboard.press('Tab');
    const february14 = page.getByRole('button', { name: /February 14, 2024/ });
    await expect(february14).toBeFocused();
    await page.keyboard.press('ArrowRight');
    const february15 = page.getByRole('button', { name: /February 15, 2024/ });
    await expect(february15).toBeFocused();
    await expect(february15).toHaveAttribute('aria-disabled', 'true');
    await expect.poll(() => february15.evaluate(element => (element.getAttribute('aria-describedby') ?? '').split(/\s+/).map(id => element.ownerDocument.getElementById(id)?.textContent).filter(Boolean).join(' '))).toBe('No remaining capacity');
    await expect(february15).toHaveAccessibleDescription('No remaining capacity');
    await expect(page.getByRole('status').filter({ hasText: '2024-02-15: No remaining capacity' })).toBeVisible();
    await expect(page.getByRole('status').filter({ hasText: 'No dates selected' })).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status').filter({ hasText: 'No dates selected' })).toBeVisible();
    await expect(page.getByLabel('Committed booking dates')).toHaveText('No committed dates');
    await expect(page.getByRole('button', { name: 'Apply', exact: true })).toBeDisabled();
    const disclosure = page.locator('details');
    const summary = disclosure.locator('summary');
    await expect(summary).toHaveText('Unavailable dates');
    await expect(disclosure).not.toHaveAttribute('open', '');
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(disclosure).toHaveAttribute('open', '');
    await expect(disclosure.getByText('2024-02-15: No remaining capacity', { exact: true })).toBeVisible();
    await expect(summary).toBeFocused();
    await page.keyboard.press('Space');
    await expect(disclosure).not.toHaveAttribute('open', '');
    await expect(summary).toBeFocused();
  });
}
