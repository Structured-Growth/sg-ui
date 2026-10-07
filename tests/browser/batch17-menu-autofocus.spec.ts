import { expect, test } from '@playwright/test';

for (const opener of ['Alt+ArrowDown', 'ArrowUp', 'Enter']) {
  test(`programmatic Menu entry ${opener} focuses the enabled strategy item`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
    await page.goto('/iframe.html?id=migration-proofs-menu--native-autofocus&viewMode=story&globals=a11y.manual:!true');
    const trigger = page.getByRole('button', { name: 'Native actions', exact: true });
    await expect(trigger).toBeVisible();
    // Deliberate virtual/programmatic entry: no click/Tab to change modality first.
    await trigger.focus();
    await page.keyboard.press(opener);
    const menu = page.getByRole('menu', { name: 'Native focus actions' });
    const expected = page.getByRole('menuitem', { name: opener === 'ArrowUp' ? 'Last enabled' : 'First enabled', exact: true });
    await expect(menu).toBeVisible();
    try {
      await expect(expected).toBeFocused();
      // Retain focus beyond deferred upstream callbacks, rather than sampling a flash.
      await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      await expect(expected).toBeFocused();
    } finally {
      await testInfo.attach('menu-native-autofocus', { contentType: 'application/json', body: JSON.stringify(await menu.evaluate(element => ({
        hasFocus: document.hasFocus(), activeElement: document.activeElement?.outerHTML,
        committed: element.querySelector('[data-focused="true"]')?.outerHTML,
      }))) });
    }
    await page.keyboard.press(opener === 'ArrowUp' ? 'ArrowUp' : 'ArrowDown');
    await expect(page.getByRole('menuitem', { name: opener === 'ArrowUp' ? 'First enabled' : 'Last enabled', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
    // Reopening gets a new committed menu lifetime and first-item strategy.
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'First enabled', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    expect(errors, 'browser runtime diagnostics').toEqual([]);
  });
}
