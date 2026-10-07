import { test, expect, type Page, type Locator } from '@playwright/test';

async function story(page: Page, id: string) {
  await page.goto(`/iframe.html?id=overlays-appmodal--${id}&viewMode=story&globals=a11y.manual:!true`);
  await expect(page.locator('#storybook-root')).not.toBeEmpty();
}

async function visibleFocus(control: Locator) {
  await expect(control).toBeFocused();
  await expect.poll(() => control.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const visible = rect.width > 0 && rect.height > 0 && rect.left >= 0 && rect.right <= innerWidth + 1
      && rect.top >= 0 && rect.bottom <= innerHeight + 1
      && Boolean(hit && (element.contains(hit) || hit.contains(element)));
    return { visible, rect: rect.toJSON(), viewport: { width: innerWidth, height: innerHeight },
      hit: hit?.outerHTML.slice(0, 300), active: document.activeElement?.outerHTML.slice(0, 500) };
  })).toMatchObject({ visible: true });
}

for (const dismissal of ['escape', 'outside', 'close-button'] as const) {
  for (const hostFocus of [false, true]) {
    test(`removed child opener: ${dismissal} ${hostFocus ? 'preserves host destination' : 'recovers parent focus'}`, async ({ page }) => {
      await story(page, 'removed-opener');
      const outerTrigger = page.getByRole('button', { name: 'Open recovery parent', exact: true });
      await outerTrigger.click();
      await page.getByRole('button', { name: 'Open removable child', exact: true }).click();
      await visibleFocus(page.getByRole('textbox', { name: 'Child input', exact: true }));
      await page.getByRole('button', { name: hostFocus ? 'Remove opener and choose host destination' : 'Remove child opener', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Open removable child', exact: true })).toHaveCount(0);
      const child = page.getByRole('dialog', { name: 'Recovery child', exact: true });
      await expect(child).toBeVisible();
      if (dismissal === 'escape') await page.keyboard.press('Escape');
      else if (dismissal === 'outside') await page.mouse.click(4, 4);
      else await child.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(child).toHaveCount(0);
      const parent = page.getByRole('dialog', { name: 'Recovery parent', exact: true });
      await expect(parent).toBeVisible();
      const destination = page.getByRole('textbox', { name: hostFocus ? 'Host destination' : 'Parent fallback', exact: true });
      await test.info().attach('dismissal-focus-diagnostic', { contentType: 'application/json', body: JSON.stringify(await page.evaluate(async () => {
        const snapshot = () => ({ active: document.activeElement?.outerHTML,
          dialogs: [...document.querySelectorAll('[role="dialog"]')].map(element => ({ html: element.outerHTML,
            inertAncestor: element.closest('[inert]')?.outerHTML.slice(0, 500) })) });
        const immediate = snapshot();
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        return { immediate, deferred: snapshot() };
      }), null, 2) });
      if (hostFocus) {
        // A successful host placement is required evidence, not an inert-time attempt.
        await expect.poll(async () => JSON.parse(await destination.getAttribute('data-host-focus-attempt') ?? '{}'))
          .toMatchObject({ inert: false, succeeded: true });
      }
      await visibleFocus(destination);
      // Wait past the deferred restoration frame and ensure it did not steal host focus.
      await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
      await expect(destination).toBeFocused();
      await expect(page.getByRole('status')).toHaveText(`Child dismissal: ${dismissal}`);
      await page.keyboard.press('Tab');
      expect(await parent.evaluate(element => element.contains(document.activeElement))).toBe(true);
      await page.keyboard.press('Escape');
      await expect(parent).toHaveCount(0);
      await expect(outerTrigger).toBeFocused();
    });
  }
}


for (const dismissal of ['escape', 'outside', 'close-button'] as const) {
  test(`surviving child opener: ${dismissal} returns to child trigger and then page trigger`, async ({ page }) => {
    await story(page, 'nested-overlays');
    const outer = page.getByRole('button', { name: 'Open parent', exact: true });
    await outer.click();
    const trigger = page.getByRole('button', { name: 'Open child', exact: true });
    await trigger.click();
    const child = page.getByRole('dialog', { name: 'Child settings', exact: true });
    await visibleFocus(page.getByRole('textbox', { name: 'Child name', exact: true }));
    if (dismissal === 'escape') await page.keyboard.press('Escape');
    else if (dismissal === 'outside') await page.mouse.click(4, 4);
    else await child.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(child).toHaveCount(0);
    await visibleFocus(trigger);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Parent settings', exact: true })).toHaveCount(0);
    await visibleFocus(outer);
  });
}
