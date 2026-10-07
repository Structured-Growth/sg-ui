import { test, expect, type Page } from '@playwright/test';

async function story(page: Page, id: string, theme: 'light' | 'dark' = 'light') {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=a11y.manual:!true`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
  await page.locator('#storybook-root [data-sgui-scope]').evaluateAll((scopes, theme) => {
    scopes.forEach(scope => scope.setAttribute('data-sgui-theme', theme));
  }, theme);
}

for (const theme of ['light', 'dark'] as const) {
  test(`inline percentage layout and token styles remain native and quiet: ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await story(page, 'components-appinlineprogress--layout-states', theme);
    const rows = page.locator('[data-sgui-part="inline-progress"]');
    const bars = page.getByRole('progressbar', { name: 'Progress', exact: true });
    await expect(bars).toHaveCount(4);
    for (const [index, value] of [0, 25, 100, 0].entries()) {
      await expect(bars.nth(index)).toHaveAttribute('aria-valuenow', String(value));
      await expect(rows.nth(index)).toHaveText(`${value}%`);
    }
    for (const motion of ['no-preference', 'reduce'] as const) {
      await page.emulateMedia({ reducedMotion: motion });
      expect(await rows.evaluateAll(elements => elements.every(element =>
        [element, ...element.querySelectorAll('*')].every(child => getComputedStyle(child).animationName === 'none')))).toBe(true);
    }
    expect(await bars.nth(0).evaluate(element => element.getBoundingClientRect().width)).toBe(60);
    expect(await bars.nth(1).evaluate(element => element.getBoundingClientRect().width)).toBe(120);
    expect(await rows.nth(2).evaluate(element => {
      const bar = element.querySelector('[role="progressbar"]')!;
      return Math.abs(bar.getBoundingClientRect().width / element.getBoundingClientRect().width - .5) < .01;
    })).toBe(true);
    await expect(bars.first().locator('span[aria-hidden]')).toHaveCSS('height', '12px');
    // Override owned tokens to prove the compiled label/layout responds to the scope.
    await page.addStyleTag({ content: '[data-sgui-scope] { --sgui-space2: 10px; --sgui-body2-size: 20px; --sgui-body2-line-height: 30px; }' });
    await expect(rows.first()).toHaveCSS('gap', '10px');
    await expect(rows.first().locator('[data-variant="body2"]')).toHaveCSS('font-size', '20px');
    await expect(rows.first().locator('[data-variant="body2"]')).toHaveCSS('line-height', '30px');
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    expect(await rows.evaluateAll(elements => elements.every(element => element.scrollWidth <= element.clientWidth + 1))).toBe(true);
    await expect(page.locator('[role="status"], [role="alert"], [aria-live]')).toHaveCount(0);
  });

  test(`operation states distinguish icons and owned tones without numbering: ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await story(page, 'components-appoperationsteps--all-states', theme);
    const items = page.getByRole('listitem');
    await expect(items).toHaveCount(4);
    await expect(items.nth(0)).toHaveText('Queued: Pending');
    await expect(items.nth(1)).toHaveText('Uploading: In progress');
    await expect(items.nth(2)).toHaveText('Saved: Completed');
    await expect(items.nth(3)).toHaveText('Upload failed: Error');
    await expect(items.nth(2).locator('svg.lucide-check')).toHaveCount(1);
    await expect(items.nth(3).locator('svg.lucide-x')).toHaveCount(1);
    await expect(items.nth(0).locator('svg.lucide-circle')).toHaveCount(1);
    for (const [index, token] of [[0, 'text-muted'], [2, 'action'], [3, 'danger']] as const) {
      expect(await items.nth(index).locator('span[aria-hidden]').evaluate((element, token) => {
        const probe = document.createElement('span');
        probe.style.color = `var(--sgui-${token})`;
        element.append(probe);
        const matches = getComputedStyle(element).color === getComputedStyle(probe).color;
        probe.remove();
        return matches;
      }, token)).toBe(true);
    }
    await page.addStyleTag({ content: '[data-sgui-scope] { --sgui-action: rgb(1, 2, 3); --sgui-danger: rgb(4, 5, 6); --sgui-text-muted: rgb(7, 8, 9); }' });
    await expect(items.nth(2).locator('span[aria-hidden]')).toHaveCSS('color', 'rgb(1, 2, 3)');
    await expect(items.nth(3).locator('span[aria-hidden]')).toHaveCSS('color', 'rgb(4, 5, 6)');
    await expect(items.nth(3).locator('[data-tone="danger"]')).toHaveCSS('color', 'rgb(4, 5, 6)');
    await expect(items.nth(0).locator('span[aria-hidden]')).toHaveCSS('color', 'rgb(7, 8, 9)');
    const spinner = page.getByRole('progressbar', { name: 'Uploading' });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    expect(await spinner.locator('svg').evaluate(element => getComputedStyle(element).animationName)).not.toBe('none');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(spinner.locator('svg')).toHaveCSS('animation-name', 'none');
    await expect(spinner).not.toHaveAttribute('aria-valuenow');
    await expect(page.getByRole('list')).toHaveCSS('list-style-type', 'none');
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    expect(await page.locator('[data-sgui-part="operation-steps"]').evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  });
}

test('native host transitions retain focus and a mounted milestone region; a single step has no count', async ({ page }) => {
  await story(page, 'components-appoperationsteps--transitions');
  const region = page.getByRole('status');
  await region.evaluate(element => element.setAttribute('data-original-region', 'true'));
  await expect(region).toBeEmpty();
  await page.getByRole('button', { name: 'Start', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('progressbar', { name: 'Save draft' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeFocused();
  await expect(region).toBeEmpty();
  await page.getByRole('button', { name: 'Complete', exact: true }).click();
  await expect(page.getByRole('progressbar', { name: 'Save draft' })).toHaveCount(0);
  await expect(page.getByRole('progressbar', { name: 'Progress', exact: true })).toHaveAttribute('aria-valuenow', '100');
  await expect(region).toHaveText('Draft saved');
  await page.getByRole('button', { name: 'Fail', exact: true }).click();
  await expect(page.getByRole('listitem')).toHaveText('Save draft: Error');
  await expect(region).toHaveText('Draft save failed');
  await expect(region).toHaveAttribute('data-original-region', 'true');
  await expect(region).toHaveAttribute('aria-live', 'polite');
  await expect(page.locator('[data-sgui-part="operation-steps"] [aria-live]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(region).toBeEmpty();
  await expect(page.getByRole('listitem')).toHaveText('Save draft: Pending');
  await expect(page.getByRole('list')).toHaveCSS('list-style-type', 'none');
  await expect(page.getByText('Step 1 of 1')).toHaveCount(0);
});
