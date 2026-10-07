import { expect, test, type Locator } from '@playwright/test';

async function fits(header: Locator) {
  expect(await header.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return element.scrollWidth <= element.clientWidth + 1 &&
      [...element.querySelectorAll('h1, p, li, button, [data-sgui-part="page-header-metadata"]')].every(child => {
        const rect = child.getBoundingClientRect();
        return rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1;
      });
  }), 'header content reflows inside its bounds').toBe(true);
}
async function visibleFocus(control: Locator) {
  await expect(control).toBeFocused();
  expect(await control.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
    return rect.left >= 0 && rect.right <= innerWidth + 1 && rect.top >= 0 && rect.bottom <= innerHeight + 1 &&
      !!hit && (hit === element || element.contains(hit));
  }), 'keyboard focus stays visible and unobscured').toBe(true);
}
for (const theme of ['light', 'dark']) {
  for (const width of [1280, 320, 640]) {
    const enlarged = width === 640;
    for (const kind of ['actions', 'menu']) {
      test(`${theme} ${enlarged ? '200% text' : `${width}px`} ${kind} reflow and keyboard menus`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/iframe.html?id=layout-apppageheader--reflow-${kind}&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
        const header = page.locator('[data-sgui-part="page-header"]');
        await expect(header).toBeVisible();
        if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; }' });
        await fits(header);
        // Verify actual resolved owned surfaces and readable inherited text, independently of the DOM hierarchy marker.
        const colors = await header.evaluate(element => {
          const style = getComputedStyle(element);
          const rgb = (value: string) => value.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(n => { const c = n / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; });
          const luminance = (value: string) => { const [r,g,b] = rgb(value); return .2126*r + .7152*g + .0722*b; };
          const fg = luminance(style.color), bg = luminance(style.backgroundColor);
          const subpage = style.backgroundColor;
          element.setAttribute('data-hierarchy', 'primary');
          const primary = getComputedStyle(element).backgroundColor;
          element.setAttribute('data-hierarchy', 'subpage');
          return { contrast: (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05), subpage, primary };
        });
        expect(colors.contrast).toBeGreaterThanOrEqual(4.5);
        expect(colors.primary).not.toBe(colors.subpage);
        if (theme === 'light') expect(colors.primary).toBe('rgb(255, 255, 255)');
        const path = page.getByRole('button', { name: 'Show path', exact: true });
        await path.focus();
        await visibleFocus(path);
        await page.keyboard.press('ArrowDown');
        await expect(page.getByRole('menuitem', { name: 'Shared content library', exact: true })).toBeFocused();
        await page.keyboard.press('Escape');
        await visibleFocus(path);
        if (kind === 'menu') {
          const more = page.getByRole('button', { name: 'More actions', exact: true });
          await page.keyboard.press('Tab'); // penultimate breadcrumb link
          await page.keyboard.press('Tab');
          await visibleFocus(more);
          await page.keyboard.press('ArrowDown');
          await expect(page.getByRole('menuitem', { name: 'Review course details', exact: true })).toBeFocused();
          await page.keyboard.press('Enter');
          await expect(page.getByRole('menu')).toHaveCount(0);
          await visibleFocus(more);
        } else {
          await page.keyboard.press('Tab'); // penultimate breadcrumb link
          await page.keyboard.press('Tab');
          await visibleFocus(page.getByRole('button', { name: 'AddCourseToAnotherSectionWithAnUnbrokenHostLabel', exact: true }));
          await page.keyboard.press('Tab');
          await visibleFocus(page.getByRole('button', { name: 'Review learner participation', exact: true }));
        }
        await fits(header);
      });
    }
  }
}
