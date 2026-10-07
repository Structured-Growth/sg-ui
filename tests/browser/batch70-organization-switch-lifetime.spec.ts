import { expect, test } from '@playwright/test';

const story = '/iframe.html?id=navigation-sidenavigation-organization-lifetime--deferred-switch&viewMode=story';
for (const replacement of ['account adapter', 'organization callback']) {
  for (const outcome of ['success', 'failure']) {
    test(`organization switch ignores obsolete ${outcome} after ${replacement} replacement`, async ({ page }) => {
      await page.goto(story);
      const trigger = page.getByRole('button', { name: /^John (School|Other)$/ });
      await trigger.focus(); await page.keyboard.press('ArrowDown');
      const target = page.getByRole('menuitem', { name: 'Other (b@example.com)', exact: true });
      await target.focus(); await page.keyboard.press('Enter');
      await expect(page.getByLabel('Host switch requests')).toHaveText('1');
      await expect(target).toHaveAttribute('aria-disabled', 'true');
      // Host lifecycle changes occur outside the menu; operation/focus checks use native input.
      await page.getByRole('button', { name: `Replace ${replacement}`, exact: true }).evaluate((button: HTMLButtonElement) => button.click());
      await expect(target).not.toHaveAttribute('aria-disabled', 'true');
      await target.click();
      await expect(page.getByLabel('Host switch requests')).toHaveText('2');
      await expect(page.getByRole('menu')).toBeFocused();
      await page.keyboard.press('ArrowDown');
      const profile = page.getByRole('menuitem', { name: 'Manage Profile', exact: true });
      await expect(profile).toBeFocused();
      await page.getByRole('button', { name: outcome === 'success' ? 'Complete oldest switch' : 'Reject oldest switch' }).evaluate((button: HTMLButtonElement) => button.click());
      await expect(page.getByLabel('Host switch settlements')).toHaveText('1');
      await expect(page.getByLabel('Host adapter commits')).toHaveText('[]');
      expect(await page.evaluate(() => localStorage.getItem('batch70:organization'))).not.toBe('"two"');
      await expect(page.getByRole('alert')).toHaveCount(0);
      await expect(target).toHaveAttribute('aria-disabled', 'true');
      await expect(profile).toBeFocused();
      await page.getByRole('button', { name: 'Complete oldest switch', exact: true }).evaluate((button: HTMLButtonElement) => button.click());
      const generation = replacement === 'account adapter' ? '1' : '0';
      await expect(page.getByLabel('Host adapter commits')).toHaveText(`["${generation}:account:b","${generation}:marked"]`);
      await expect(page.getByRole('menu')).toHaveCount(0);
      await expect(trigger).toHaveAccessibleName('John Other');
      await expect(trigger).toBeFocused();
      expect(await page.evaluate(() => localStorage.getItem('batch70:organization'))).toBe('"two"');
      await expect(page.getByLabel('Host navigation result')).toHaveText('None');
    });
  }
}
for (const outcome of ['success', 'failure']) {
  test(`organization switch ignores ${outcome} after unmount`, async ({ page }) => {
    await page.goto(story);
    await page.getByRole('button', { name: 'John School', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Other (b@example.com)', exact: true }).click();
    await page.getByRole('button', { name: 'Toggle navigation', exact: true }).evaluate((button: HTMLButtonElement) => button.click());
    const owner = page.getByRole('button', { name: 'Toggle navigation', exact: true });
    await owner.focus();
    await page.getByRole('button', { name: outcome === 'success' ? 'Complete oldest switch' : 'Reject oldest switch' }).evaluate((button: HTMLButtonElement) => button.click());
    await expect(page.getByLabel('Host switch settlements')).toHaveText('1');
    await expect(page.getByLabel('Host adapter commits')).toHaveText('[]');
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(owner).toBeFocused();
  });
}
