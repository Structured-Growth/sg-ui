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

for (const size of ['medium', 'large']) {
  for (const configuration of [
    { name: 'narrow', width: 320, height: 640, enlarged: false },
    { name: 'short enlarged text', width: 640, height: 320, enlarged: true },
    { name: 'narrow short enlarged text', width: 320, height: 320, enlarged: true },
  ]) {
    test(`${size} custom chrome: ${configuration.name} keeps initial and keyboard focus visible`, async ({ page }) => {
      await page.setViewportSize({ width: configuration.width, height: configuration.height });
      await story(page, `${size}-custom-chrome`);
      if (configuration.enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; } [data-sgui-part="dialog-overlay"] * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }' });
      const trigger = page.getByRole('button', { name: `Open custom ${size === 'medium' ? 'md' : 'lg'} modal`, exact: true });
      await trigger.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: 'Custom chrome settings', exact: true });
      await expect(dialog).toBeVisible();
      for (let index = 1; index <= 12; index++) {
        await visibleFocus(page.getByRole('textbox', { name: `Custom field ${index}`, exact: true }));
        await page.keyboard.press('Tab');
      }
      await visibleFocus(page.getByRole('button', { name: 'Custom cancel', exact: true }));
      await page.keyboard.press('Tab');
      await visibleFocus(page.getByRole('button', { name: 'Custom save', exact: true }));
      await page.keyboard.press('Tab');
      await visibleFocus(page.getByRole('button', { name: 'Header help', exact: true }));
      await page.keyboard.press('Tab');
      await visibleFocus(dialog.getByRole('button', { name: 'Close', exact: true }));
      await page.keyboard.press('Tab');
      await visibleFocus(page.getByRole('tab', { name: 'Details', exact: true }));
      await page.keyboard.press('ArrowRight');
      await visibleFocus(page.getByRole('tab', { name: 'Access', exact: true }));
      await page.keyboard.press('Tab');
      await visibleFocus(page.getByRole('textbox', { name: 'Custom permission', exact: true }));
      expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
      expect(await page.locator('[data-sgui-part="dialog-surface"]').evaluate(element => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }
}
