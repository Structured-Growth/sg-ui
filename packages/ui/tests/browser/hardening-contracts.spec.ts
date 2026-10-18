import { expect, test, type Page } from '@playwright/test';

const fixture = (name: string) => `/fixtures/?id=migration-proofs-${name}&embed=true&globals=a11y.manual:!true`;
const errors = new WeakMap<Page, string[]>();
test.beforeEach(({ page }) => {
  const messages: string[] = []; errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
});
test.afterEach(({ page }) => expect(errors.get(page), 'uncaught browser errors').toEqual([]));

test('host routing, list selection and collapse retain their separate semantics', async ({ page }) => {
  await page.goto(fixture('navigation--host-routing-and-expansion'));
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  const geometry = nav.getByRole('link', { name: 'Geometry', exact: true });
  await geometry.focus(); await page.keyboard.press('Enter');
  await expect(geometry).toHaveAttribute('aria-current', 'page');
  await expect(geometry).toBeFocused();
  await nav.getByRole('button', { name: 'Courses', exact: true }).click();
  await expect(geometry).toBeHidden();
  await expect(nav.getByRole('link', { name: 'Settings' })).toBeVisible();
  await page.goto(fixture('list--selected-actions'));
  const list = page.getByRole('list', { name: 'Course selection' });
  const selected = list.getByRole('button', { name: /Geometry/ });
  await selected.focus(); await page.keyboard.press('Space');
  await expect(selected).toHaveAttribute('aria-pressed', 'true');
  await expect(list.getByRole('button', { name: /Algebra/ })).toHaveAttribute('aria-pressed', 'false');
  await expect(list.getByRole('button', { name: 'Archived course' })).toBeDisabled();
  await page.goto(fixture('collapse--host-controlled'));
  const toggle = page.getByRole('button', { name: 'Toggle content' });
  await toggle.focus(); await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByText('Collapsible presentation content')).toBeHidden();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Collapsible presentation content')).toBeVisible();
  await expect(toggle).toBeFocused();
});

test('table headers, pagination requests and toggle selection use public native semantics', async ({ page }) => {
  await page.goto(fixture('table--default'));
  const table = page.getByRole('table', { name: 'Course enrollment' });
  await expect(table.getByRole('columnheader')).toHaveCount(2);
  await expect(table.getByRole('rowheader', { name: 'React fundamentals' })).toHaveAttribute('scope', 'row');
  await expect(table.getByRole('cell', { name: '12', exact: true })).toBeVisible();
  await page.goto(fixture('pagination--atomic-page-size'));
  const pagination = page.getByRole('navigation', { name: 'Pagination' });
  await expect(pagination).toContainText('Page 3 of 4');
  await pagination.getByLabel('Rows per page').selectOption('25');
  await expect(pagination).toContainText('Page 1 of 4');
  await expect(pagination.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  await pagination.getByRole('button', { name: 'Next page' }).click();
  await expect(pagination).toContainText('Page 2 of 4');
  await page.goto(fixture('togglebutton--single-selection'));
  const cards = page.getByRole('radio', { name: 'Cards', exact: true });
  await cards.focus(); await page.keyboard.press('Space');
  await expect(cards).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByRole('radio', { name: 'Grid', exact: true })).toHaveAttribute('aria-checked', 'false');
  await expect(page.getByRole('radio', { name: 'List', exact: true })).toBeDisabled();
});

test('public icon catalogue renders decorative SVGs and explicitly named graphics', async ({ page }) => {
  await page.goto(fixture('icons--catalog-story'));
  const graphics = page.locator('#sgui-fixture-root svg');
  await expect(graphics.first()).toBeVisible();
  expect(await graphics.count()).toBeGreaterThan(90);
  const invalid = await graphics.evaluateAll(nodes => nodes.filter(node => {
    const rect = node.getBoundingClientRect();
    return rect.width !== 24 || rect.height !== 24 || node.getAttribute('aria-hidden') !== 'true' || node.getAttribute('focusable') !== 'false';
  }).length);
  expect(invalid).toBe(0);
  await page.goto(fixture('icons--meaningful'));
  await expect(page.getByRole('img', { name: 'Completed' })).toBeVisible();
});

test('typeface catalogue keeps semantic headings and all public visual roles', async ({ page }) => {
  await page.goto('/fixtures/?id=foundations-typefaces--defaults&embed=true&globals=a11y.manual:!true');
  await expect(page.getByRole('heading', { name: 'Typography Variants', level: 2 })).toBeVisible();
  for (const variant of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'bodyAlt2', 'subtitle1', 'subtitle2', 'button', 'caption', 'overline', 'code']) {
    const sample = page.locator(`[data-variant="${variant}"]`).filter({ hasText: 'The quick brown fox' });
    await expect(sample).toHaveCount(1);
    const style = await sample.evaluate(element => ({ size: parseFloat(getComputedStyle(element).fontSize), family: getComputedStyle(element).fontFamily, tag: element.tagName }));
    expect(style.size).toBeGreaterThan(0);
    expect(style.family).not.toBe('');
    expect(style.tag).toBe(variant === 'code' ? 'CODE' : 'P');
  }
});

test('pagination state survives reload and resets through the host callback', async ({ page }) => {
  const url = '/fixtures/?id=hooks-pagination-state--session-persistence&embed=true&globals=a11y.manual:!true';
  await page.goto(url);
  const pagination = page.getByRole('navigation', { name: 'Pagination' });
  await pagination.getByRole('button', { name: 'Next page' }).click();
  await expect(pagination).toContainText('Page 2 of 100');
  await page.reload();
  await expect(pagination).toContainText('Page 2 of 100');
  await page.getByRole('button', { name: 'Reset pagination' }).click();
  await expect(pagination).toContainText('Page 1 of 100');
  await page.reload();
  await expect(pagination).toContainText('Page 1 of 100');
  await expect(pagination.getByRole('button', { name: 'Previous page' })).toBeDisabled();
});

test('public admin and instructor presets keep independent host column choices', async ({ page }) => {
  await page.goto('/fixtures/?id=data-display-datatoolbar--public-preset-hosts&embed=true&globals=a11y.manual:!true');
  for (const [name, first, optional] of [
    ['Admin courses', 'Section Name', 'Site'], ['Admin people', 'Name', 'Status'],
    ['Instructor courses', 'Section Name', 'Site'], ['Instructor learners', 'Learner', 'Status'],
  ]) {
    const host = page.getByRole('region', { name, exact: true });
    await expect(page.locator('output')).toHaveCount(4);
    await expect.poll(() => page.locator('output').allTextContents()).toEqual(expect.arrayContaining([expect.stringContaining('Section Name'), expect.stringContaining('Learner')]));
    const before = await page.locator('output').allTextContents();
    await host.getByRole('button', { name: 'Columns', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Columns', exact: true });
    await expect(dialog.getByRole('checkbox', { name: first, exact: true })).toBeDisabled();
    await expect(dialog.getByRole('checkbox', { name: 'Action', exact: true })).toBeDisabled();
    const choice = dialog.getByRole('checkbox', { name: optional, exact: true });
    await expect(choice).toBeChecked();
    await choice.focus();
    await page.keyboard.press('Space');
    await expect(choice).not.toBeChecked();
    await expect(host.getByLabel(`${name} visible columns`)).not.toContainText(optional);
    const after = await page.locator('output').allTextContents();
    expect(after.filter((value, index) => value !== before[index])).toHaveLength(1);
    await dialog.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(host.getByLabel(`${name} visible columns`)).toContainText(optional);
    await page.keyboard.press('Escape');
  }
});
