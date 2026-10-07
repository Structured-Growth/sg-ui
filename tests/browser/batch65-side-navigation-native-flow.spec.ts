import { expect, test, type Locator, type Page } from '@playwright/test';

async function keyboardReach(page: Page, target: Locator, key: string, drilldown?: { scrollport: Locator; name: string }) {
  if (drilldown) {
    const samples: Array<Record<string, unknown>> = [];
    const sample = async (presses: number) => {
      const focused = await page.evaluate(() => {
        const element = document.activeElement;
        return {
          tag: element?.tagName, id: element?.id, role: element?.getAttribute('role'),
          label: element?.getAttribute('aria-label'), text: element?.textContent?.trim(),
          part: element?.getAttribute('data-sgui-part'),
          tabIndex: element instanceof HTMLElement ? element.tabIndex : null,
          documentFocused: document.hasFocus(),
          scrollTop: element instanceof HTMLElement ? element.scrollTop : null,
          clientHeight: element instanceof HTMLElement ? element.clientHeight : null,
          scrollHeight: element instanceof HTMLElement ? element.scrollHeight : null,
        };
      });
      const state = {
        presses, key, ...focused,
        targetFocused: await target.evaluate(element => element === document.activeElement),
        scrollportFocused: await drilldown.scrollport.evaluate(element => element === document.activeElement),
      };
      samples.push(state);
      return state;
    };
    try {
      await sample(0);
      // An overflowing Firefox scrollport can be a native sequential stop
      // between Back and People. Permit only that stop, never another control
      // or a wrap through the page, in either traversal direction.
      for (let presses = 1; presses <= 2; presses++) {
        await page.keyboard.press(key);
        const state = await sample(presses);
        if (state.targetFocused) break;
        expect(state.scrollportFocused, `${drilldown.name}: unexpected native focus stop`).toBe(true);
      }
      await expect(target).toBeFocused();
    } finally {
      await test.info().attach(drilldown.name, {
        body: JSON.stringify(samples, null, 2), contentType: 'application/json',
      });
    }
    return;
  }
  for (let count = 0; count < 24; count++) {
    if (await target.evaluate(element => element === document.activeElement)) return;
    await page.keyboard.press(key);
  }
  await expect(target).toBeFocused();
}

async function focusGeometry(control: Locator) {
  return control.evaluate(element => {
    const port = element.closest<HTMLElement>('[data-sgui-part="side-navigation-scroll"]');
    const rect = element.getBoundingClientRect();
    const css = getComputedStyle(element);
    const outline = css.outlineStyle === 'none' ? 0
      : Math.max(0, (parseFloat(css.outlineWidth) || 0) + (parseFloat(css.outlineOffset) || 0));
    const box = port?.getBoundingClientRect();
    const top = box && port ? box.top + port.clientTop : null;
    const left = box && port ? box.left + port.clientLeft : null;
    return {
      label: element.textContent?.trim(), focused: element === document.activeElement,
      documentFocused: document.hasFocus(), outline,
      control: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right },
      scrollport: port && top !== null && left !== null ? {
        top, bottom: top + port.clientHeight, left, right: left + port.clientWidth,
        clientTop: port.clientTop, clientHeight: port.clientHeight, clientWidth: port.clientWidth,
        scrollTop: port.scrollTop, scrollLeft: port.scrollLeft, scrollHeight: port.scrollHeight,
      } : null,
    };
  });
}

async function visibleFocus(control: Locator) {
  await expect(control).toBeFocused();
  try {
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
    // Retain the ancestor/hit/outline checks above, and measure the actual client
    // area as well: border boxes include borders and native scrollbar space.
    await expect.poll(async () => {
      const geometry = await focusGeometry(control);
      const port = geometry.scrollport;
      return !port || (geometry.control.top - geometry.outline >= port.top - 1
        && geometry.control.bottom + geometry.outline <= port.bottom + 1
        && geometry.control.left - geometry.outline >= port.left - 1
        && geometry.control.right + geometry.outline <= port.right + 1);
    }).toBe(true);
  } finally {
    await test.info().attach('native focused navigation geometry', {
      body: JSON.stringify(await focusGeometry(control), null, 2), contentType: 'application/json',
    });
  }
}

for (const presentation of [{ direction: 'ltr', density: 'comfortable' }, { direction: 'rtl', density: 'compact' }]) {
for (const theme of ['light', 'dark']) {
  for (const enlarged of [false, true]) {
    test(`catalog hierarchy keyboard flow (${theme}, ${enlarged ? '200% text' : 'normal text'})${presentation.direction === 'rtl' ? ' (RTL, compact)' : ''}`, async ({ page, browserName }) => {
      const diagnostics: string[] = [];
      page.on('pageerror', error => diagnostics.push(error.message));
      page.on('console', message => { if (['warning', 'error'].includes(message.type())) diagnostics.push(message.text()); });
      await page.setViewportSize({ width: 320, height: 720 });
      await page.goto(`/iframe.html?id=navigation-sidenavigation--native-hierarchy&viewMode=story&globals=theme:${theme};direction:${presentation.direction};density:${presentation.density};a11y.manual:!true`);
      const navigation = page.getByRole('navigation', { name: 'Course workspace navigation' });
      await expect(navigation).toBeVisible();
      await expect(navigation.locator('xpath=ancestor::*[@data-sgui-scope][1]')).toHaveAttribute('dir', presentation.direction);
      await expect(navigation.locator('xpath=ancestor::*[@data-sgui-scope][1]')).toHaveAttribute('data-sgui-density', presentation.density);
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
      const scrollport = navigation.locator('[data-sgui-part="side-navigation-scroll"]');
      await keyboardReach(page, people, tab, { scrollport, name: 'native Back to People focus order' });
      await visibleFocus(people);
      await page.keyboard.press('Enter');
      await expect(people).toHaveAttribute('aria-current', 'page');
      await expect(page.getByLabel('Host current route')).toHaveText('/settings/people');
      await expect(page.getByLabel('Host route requests')).toHaveText('["/courses/active","/settings","/settings/people"]');
      await expect(page.getByLabel('Host item selections')).toHaveText('["active","people"]');
      await keyboardReach(page, settings, backTab, { scrollport, name: 'native People to Back focus order' });
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
}
