import { expect, test } from '@playwright/test';

for (const action of ['account', 'all']) {
  for (const outcome of ['success', 'rejection']) {
    test(`${action} logout ignores stale ${outcome} after adapter replacement`, async ({ page }) => {
      await page.goto('/iframe.html?id=navigation-sidenavigation--logout-lifetime&viewMode=story');
      const trigger = page.getByRole('button', { name: 'John Doe Tulsa Public Schools' });
      await trigger.click();
      const logout = page.getByRole('menuitem', { name: action === 'all' ? 'Log out of all accounts' : 'Logout (a@example.com)', exact: true });
      await logout.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Host logout requests')).toHaveText('1');
      await expect(logout).toHaveAttribute('aria-disabled', 'true');
      // Simulate host updates through DOM clicks outside the modal menu; logout
      // activation and focus assertions use native keyboard interaction.
      await page.getByRole('button', { name: 'Replace account adapter' }).evaluate((button: HTMLButtonElement) => button.click());
      await expect(logout).not.toHaveAttribute('aria-disabled', 'true');
      await logout.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Host logout requests')).toHaveText('2');
      // Disabling the focused action clears its Aria focus key. Native focus
      // recovers to the menu; keyboard entry can reach the enabled profile action.
      await expect(page.getByRole('menu')).toBeFocused();
      await page.keyboard.press('ArrowDown');
      const profile = page.getByRole('menuitem', { name: 'Manage Profile', exact: true });
      await expect(profile).toBeFocused();
      await page.getByRole('button', { name: outcome === 'success' ? 'Complete oldest logout' : 'Reject oldest logout' }).evaluate((button: HTMLButtonElement) => button.click());
      await expect(page.getByLabel('Host navigation result')).toHaveText('None');
      await expect(page.getByRole('alert')).toHaveCount(0);
      await expect(page.getByRole('menu')).toBeVisible();
      await expect(logout).toHaveAttribute('aria-disabled', 'true');
      await expect(profile).toBeFocused();
      await page.getByRole('button', { name: 'Complete oldest logout' }).evaluate((button: HTMLButtonElement) => button.click());
      await expect(page.getByLabel('Host navigation result')).toHaveText('/login?next=%2Fcourses');
      await expect(page.getByRole('menu')).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }
}
