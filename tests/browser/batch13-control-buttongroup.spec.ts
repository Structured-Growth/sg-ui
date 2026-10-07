import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  (page as Page & { browserErrors?: string[] }).browserErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { browserErrors?: string[] }).browserErrors, 'browser runtime errors').toEqual([]);
});

test('joined groups round outer ends in both orientations and inherit density', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-buttongroup--joined-orientations&viewMode=story&globals=a11y.manual:!true');
  for (const dir of ['ltr', 'rtl']) {
    for (const density of ['comfortable', 'compact']) {
      for (const orientation of ['horizontal', 'vertical']) {
        const group = page.getByRole('group', { name: `${dir} ${density} ${orientation}` });
        const buttons = group.getByRole('button');
        const geometry = await buttons.evaluateAll(elements => elements.map(element => {
          const css = getComputedStyle(element);
          return { corners: [css.borderTopLeftRadius, css.borderTopRightRadius, css.borderBottomRightRadius, css.borderBottomLeftRadius], height: element.getBoundingClientRect().height };
        }));
        expect(geometry).toHaveLength(3);
        const radius = await group.evaluate(element => getComputedStyle(element).borderTopLeftRadius);
        const first = orientation === 'vertical' ? [radius, radius, '0px', '0px'] : dir === 'ltr' ? [radius, '0px', '0px', radius] : ['0px', radius, radius, '0px'];
        const last = orientation === 'vertical' ? ['0px', '0px', radius, radius] : dir === 'ltr' ? ['0px', radius, radius, '0px'] : [radius, '0px', '0px', radius];
        expect(geometry[0].corners).toEqual(first);
        expect(geometry[1].corners).toEqual(['0px', '0px', '0px', '0px']);
        expect(geometry[2].corners).toEqual(last);
        const height = await group.evaluate((_, value) => value * parseFloat(getComputedStyle(document.documentElement).fontSize), density === 'compact' ? 2 : 2.75);
        for (const button of geometry) expect(button.height).toBeGreaterThanOrEqual(height);
        await expect(buttons.nth(1)).toBeDisabled();
      }
    }
  }
});

test('nested children remain independent native Tab stops without arrow navigation', async ({ page }) => {
  await page.goto('/iframe.html?id=migration-proofs-buttongroup--nested-actions&viewMode=story&globals=a11y.manual:!true');
  const group = page.getByRole('group', { name: 'Nested course actions' });
  await expect(group).not.toHaveAttribute('tabindex');
  await page.getByRole('button', { name: 'Before group', exact: true }).focus();
  for (const name of ['Create', 'Archive', 'Course details', 'After group']) {
    await page.keyboard.press('Tab');
    await expect(page.getByRole(name === 'Course details' ? 'link' : 'button', { name, exact: true })).toBeFocused();
  }
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link', { name: 'Course details' })).toBeFocused();
  await group.getByRole('button', { name: 'Create', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(group.getByRole('button', { name: 'Create', exact: true })).toBeFocused();
  await expect(group.getByRole('button', { name: 'Import', exact: true })).toBeDisabled();
});
