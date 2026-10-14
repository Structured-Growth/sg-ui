import { expect, test, type Locator } from '@playwright/test';

async function insideViewport(popup: Locator) {
  await expect.poll(() => popup.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return rect.left >= -1 && rect.right <= innerWidth + 1 && rect.top >= -1 && rect.bottom <= innerHeight + 1;
  }), { message: 'Select popup collision sizing remains inside the native viewport' }).toBe(true);
}

test('Select positions initially and updates scoped popup sizing, viewport and ancestor scrolling without observer errors', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  await page.setViewportSize({ width: 320, height: 420 });
  await page.goto('/fixtures/?id=migration-proofs-select--explicit-portal-directions&globals=a11y.manual:!true');
  for (const locale of ['en-US', 'ar-EG']) {
    const trigger = page.getByRole('button', { name: new RegExp(locale) });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.focus();
    await page.keyboard.press('Enter');
    const list = page.getByRole('listbox');
    const popup = list.locator('xpath=ancestor::*[@data-sgui-scope][1]');
    await expect(list).toBeVisible();
    await expect(popup).toHaveAttribute('dir', locale === 'en-US' ? 'rtl' : 'ltr');
    await insideViewport(popup);
    await page.setViewportSize({ width: 640, height: 900 });
    await insideViewport(popup);
    const height = await popup.evaluate(element => element.getBoundingClientRect().height);
    await page.addStyleTag({ content: 'html { font-size: 150%; }' });
    await expect.poll(() => popup.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThan(height);
    await insideViewport(popup);
    // The host changes its scrollport, not the component or observer implementation.
    await trigger.evaluate(button => {
      const host = button.closest('[data-sgui-scope]') as HTMLElement;
      host.style.maxHeight = '200px'; host.style.overflow = 'auto';
      const spacer = document.createElement('div'); spacer.style.height = '320px'; host.append(spacer);
    });
    const before = await trigger.evaluate(button => button.getBoundingClientRect().top);
    await trigger.evaluate(button => { (button.closest('[data-sgui-scope]') as HTMLElement).scrollTop = 30; });
    await expect.poll(() => trigger.evaluate(button => button.getBoundingClientRect().top)).toBeLessThan(before);
    await expect(list).toBeVisible();
    await insideViewport(popup);
    await expect.poll(async () => {
      const placement = await popup.getAttribute('data-placement');
      const rect = await popup.evaluate(element => element.getBoundingClientRect().toJSON());
      const anchor = await trigger.evaluate(element => element.getBoundingClientRect().toJSON());
      return placement === 'top' ? anchor.top - rect.bottom : rect.top - anchor.bottom;
    }, { message: 'Scrolled Select retains its native anchor gap' }).toBeCloseTo(8, 0);
    await page.keyboard.press('Escape');
    await expect(list).toHaveCount(0); await expect(trigger).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(list).toBeVisible(); await insideViewport(popup);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await page.addStyleTag({ content: 'html { font-size: 100%; }' });
    await page.setViewportSize({ width: 320, height: 420 });
  }
  expect(errors, 'all native observer errors and runtime warnings remain failures').toEqual([]);
  await info.attach('select-popup-sizing', { body: JSON.stringify({ browser: info.project.name, scopes: ['rtl', 'ltr'], textScale: '150%', initialWidth: 320, resizedWidth: 640 }), contentType: 'application/json' });
});
