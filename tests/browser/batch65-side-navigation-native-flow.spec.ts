import { expect, test, type Locator, type Page } from '@playwright/test';

async function keyboardReach(page: Page, target: Locator, key: string) {
  for (let count = 0; count < 24; count++) {
    if (await target.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press(key);
  }
  await expect(target).toBeFocused();
}

async function visibleFocus(control: Locator) {
  await expect(control).toBeFocused();
  await expect.poll(() => control.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    if (rect.left < 0 || rect.right > innerWidth + 1 || rect.top < 0 || rect.bottom > innerHeight + 1
      || !hit || !element.contains(hit) || style.outlineStyle === 'none' || parseFloat(style.outlineWidth) <= 0) return false;
    for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
      const css = getComputedStyle(ancestor);
      const box = ancestor.getBoundingClientRect();
      if (/(auto|scroll|hidden|clip)/.test(css.overflowY) && (rect.top < box.top - 1 || rect.bottom > box.bottom + 1)) return false;
      if (/(auto|scroll|hidden|clip)/.test(css.overflowX) && (rect.left < box.left - 1 || rect.right > box.right + 1)) return false;
    }
    return true;
  })).toBe(true);
}

for (const theme of ['light', 'dark']) {
  for (const enlarged of [false, true]) {
    test(`catalog hierarchy keyboard flow (${theme}, ${enlarged ? '200% text' : 'normal text'})`, async ({ page, browserName }) => {
      const diagnostics: string[] = [];
      page.on('pageerror', error => diagnostics.push(error.message));
      page.on('console', message => { if (['warning', 'error'].includes(message.type())) diagnostics.push(message.text()); });
      await page.setViewportSize({ width: 320, height: 720 });
      await page.goto(`/iframe.html?id=navigation-sidenavigation--native-hierarchy&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      const navigation = page.getByRole('navigation', { name: 'Course workspace navigation' });
      await expect(navigation).toBeVisible();
      if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; }' });
      await expect(page.getByLabel('Native navigation ref')).toHaveText('NAV');
      const tab = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
      const backTab = browserName === 'webkit' ? 'Alt+Shift+Tab' : 'Shift+Tab';
      const account = navigation.getByRole('button', { name: 'John Doe Tulsa Public Schools' });
      await keyboardReach(page, account, tab);
      await visibleFocus(account);
      const accountBox = await account.boundingBox();
      const overview = navigation.getByRole('link', { name: 'Overview', exact: true });
      expect(accountBox!.y).toBeLessThan((await overview.boundingBox())!.y);
      await page.keyboard.press('ArrowDown');
      const menu = page.getByRole('menu');
      await expect(menu).toBeVisible();
      await expect(menu.locator('xpath=ancestor::*[@data-sgui-theme][1]')).toHaveAttribute('data-sgui-theme', theme);
      await expect(menu.locator('xpath=ancestor::*[@data-sgui-density][1]')).toHaveAttribute('data-sgui-density', 'compact');
      await expect(page.getByRole('menuitem', { name: 'Logout', exact: true })).toHaveAttribute('aria-disabled', 'true');
      await page.keyboard.press('Escape');
      await visibleFocus(account);
      await keyboardReach(page, overview, tab);
      await visibleFocus(overview);
      await expect(overview).toHaveAttribute('aria-current', 'page');
      const courses = navigation.getByRole('button', { name: 'Courses', exact: true });
      await page.keyboard.press(tab);
      await visibleFocus(courses);
      await expect(courses).toHaveAttribute('aria-expanded', 'false');
      await expect(navigation.getByRole('link', { name: 'Active courses' })).toHaveCount(0);
      await page.keyboard.press('Space');
      await expect(courses).toHaveAttribute('aria-expanded', 'true');
      const active = navigation.getByRole('link', { name: 'Active courses' });
      await page.keyboard.press(tab);
      await visibleFocus(active);
      await page.keyboard.press('Enter');
      await expect(active).toHaveAttribute('aria-current', 'page');
      await expect(overview).not.toHaveAttribute('aria-current', 'page');
      await expect(page.getByLabel('Host route requests')).toHaveText('["/courses/active"]');
      await expect(page.getByLabel('Host item selections')).toHaveText('["active"]');
      await page.keyboard.press(backTab);
      await visibleFocus(courses);
      await page.keyboard.press('Enter');
      await expect(courses).toHaveAttribute('aria-expanded', 'false');
      await expect(active).toHaveCount(0);
      await page.keyboard.press('Space');
      await expect(courses).toHaveAttribute('aria-expanded', 'true');
      // Traverse every actual child Tab stop and force native scroll into view.
      for (const name of ['Active courses', 'Archived courses', ...Array.from({ length: 5 }, (_, i) => `Course collection ${i + 1}`)]) {
        const child = navigation.getByRole('link', { name, exact: true });
        await keyboardReach(page, child, tab);
        await visibleFocus(child);
      }
      const settings = navigation.getByRole('button', { name: 'Settings', exact: true });
      await keyboardReach(page, settings, tab);
      await visibleFocus(settings);
      await page.keyboard.press('Enter');
      await expect(navigation.getByRole('link', { name: 'Overview' })).toHaveCount(0);
      await expect(page.getByLabel('Host route requests')).toHaveText('["/courses/active","/settings"]');
      // The catalog puts focus on its Back control in the new menu.
      await visibleFocus(settings);
      const people = navigation.getByRole('link', { name: 'People', exact: true });
      await page.keyboard.press(tab);
      await visibleFocus(people);
      await page.keyboard.press('Enter');
      await expect(people).toHaveAttribute('aria-current', 'page');
      await expect(page.getByLabel('Host current route')).toHaveText('/settings/people');
      await expect(page.getByLabel('Host route requests')).toHaveText('["/courses/active","/settings","/settings/people"]');
      await expect(page.getByLabel('Host item selections')).toHaveText('["active","people"]');
      await page.keyboard.press(backTab);
      await visibleFocus(settings);
      await page.keyboard.press('Enter');
      await expect(people).toHaveCount(0);
      await expect(overview).toBeVisible();
      await visibleFocus(settings);
      // Back stays within the matching parent route and sends no extra request.
      await expect(page.getByLabel('Host route requests')).toHaveText('["/courses/active","/settings","/settings/people"]');
      const collapse = navigation.getByRole('button', { name: 'Collapse navigation' });
      await keyboardReach(page, collapse, tab);
      await visibleFocus(collapse);
      await page.keyboard.press('Enter');
      await expect(navigation).toHaveAttribute('data-collapsed', 'true');
      const expand = navigation.getByRole('button', { name: 'Expand navigation' });
      await visibleFocus(expand);
      await expect(account).toHaveCount(0);
      await expect(navigation.getByRole('link')).toHaveCount(0);
      await page.keyboard.press('Space');
      await expect(navigation).not.toHaveAttribute('data-collapsed', 'true');
      await visibleFocus(collapse);
      await keyboardReach(page, settings, backTab);
      await visibleFocus(settings);
      await page.keyboard.press('Space');
      await expect(people).toBeVisible();
      await visibleFocus(settings);
      await expect(page.getByLabel('Host route requests')).toHaveText('["/courses/active","/settings","/settings/people","/settings"]');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      expect(diagnostics).toEqual([]);
    });
  }
}
