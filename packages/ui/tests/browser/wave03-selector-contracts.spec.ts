import { expect, test, type Page } from '@playwright/test';

async function fixture(page: Page, id: string) {
  await page.goto(`/fixtures/?id=migration-proofs-${id}&globals=a11y.manual:!true`);
  await expect(page.locator('#sgui-fixture-root')).not.toBeEmpty();
}
async function values(page: Page) {
  return page.locator('form').evaluate(form => Object.fromEntries(new FormData(form as HTMLFormElement)));
}
// Resolve IDREFs in the owning document, including IDs generated in portal roots.
async function expectResolvedReferences(page: Page) {
  const missing = await page.evaluate(() => [...document.querySelectorAll('[aria-labelledby],[aria-describedby],[aria-controls],[aria-activedescendant]')]
    .flatMap(node => ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-activedescendant']
      .flatMap(attribute => (node.getAttribute(attribute)?.trim().split(/\s+/).filter(Boolean) ?? [])
        .filter(id => !document.getElementById(id)).map(id => ({ tag: node.tagName, attribute, id })))));
  expect(missing, 'all mounted name/description/active-option references resolve').toEqual([]);
}

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  // Test-local attachment retains diagnostics without changing browser configuration.
  (page as Page & { contractErrors: string[] }).contractErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { contractErrors: string[] }).contractErrors).toEqual([]);
});

test('Select noneditable keys serialize distinct IDs, reset, and preserve rejecting host authority', async ({ page }) => {
  await fixture(page, 'select--native-contracts');
  const trigger = page.getByRole('button', { name: /Identity status/ });
  await expect(trigger).toHaveAccessibleDescription('Choose a stable status ID');
  await trigger.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Before status', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Space');
  const list = page.getByRole('listbox');
  await expect(list).toBeVisible();
  await expect(page.getByRole('option', { name: 'Unavailable', exact: true })).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('End');
  await expect(page.getByRole('option', { name: 'Zulu', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('option', { name: 'Same', exact: true }).first()).toBeFocused();
  await page.keyboard.type('z');
  await expect(page.getByRole('option', { name: 'Zulu', exact: true })).toBeFocused();
  await expectResolvedReferences(page);
  await page.keyboard.press('Enter');
  await expect(trigger).toBeFocused();
  expect(await values(page)).toEqual({ identity: 'z', host: '' });
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'Same', exact: true }).nth(1)).toBeFocused();
  await page.keyboard.press('Enter');
  expect(await values(page)).toEqual({ identity: '1', host: '' });
  await page.getByRole('button', { name: /Host status/ }).click();
  await page.getByRole('option', { name: 'Same', exact: true }).first().click();
  await expect(page.getByLabel('Status request', { exact: true })).toHaveText('01');
  expect(await values(page)).toEqual({ identity: '1', host: '' });
  await page.getByRole('button', { name: 'Reset status', exact: true }).click();
  await expect.poll(() => values(page)).toEqual({ identity: '01', host: '' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');
  await expect(list).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await values(page)).toEqual({ identity: '01', host: '' });
});

test('ComboBox text editing/filtering, duplicate IDs, description, reset and controlled authority', async ({ page }) => {
  await fixture(page, 'combobox--native-contracts');
  const input = page.getByRole('combobox', { name: 'Identity category', exact: true });
  await expect(input).toHaveAccessibleDescription('Search stable category IDs');
  await input.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Before category', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(input).toBeFocused();
  await input.fill('Sam');
  await expect(page.getByRole('option', { name: 'Same', exact: true })).toHaveCount(2);
  await expect(page.getByRole('option', { name: 'Zulu', exact: true })).toHaveCount(0);
  // With input focus Home/End edit text; do not apply Menu collection behavior.
  await page.keyboard.press('Home');
  expect(await input.evaluate(node => (node as HTMLInputElement).selectionStart)).toBe(0);
  await page.keyboard.press('End');
  expect(await input.evaluate(node => (node as HTMLInputElement).selectionStart)).toBe(3);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expectResolvedReferences(page);
  await page.keyboard.press('Enter');
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('Same');
  expect(await values(page)).toEqual({ identity: '1', host: '' });
  await page.getByRole('button', { name: 'Show options Host category', exact: true }).click();
  await page.getByRole('option', { name: 'Zulu', exact: true }).click();
  await expect(page.getByLabel('Category request', { exact: true })).toHaveText('z');
  await expect(page.getByRole('combobox', { name: 'Host category', exact: true })).toHaveValue('');
  expect(await values(page)).toEqual({ identity: '1', host: '' });
  // A rejecting controlled host may keep suggestions open for the unresolved draft.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset category', exact: true }).click();
  await expect.poll(() => values(page)).toEqual({ identity: '01', host: '' });
  await input.focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(input).toBeFocused();
  await expectResolvedReferences(page);
});

test('Menu key endpoints/typeahead skip disabled commands; Space acts once and Tab/Escape dismiss', async ({ page }) => {
  await fixture(page, 'menu--native-contracts');
  const trigger = page.getByRole('button', { name: 'Contract actions', exact: true });
  const first = page.getByRole('menuitem', { name: 'First enabled', exact: true });
  const last = page.getByRole('menuitem', { name: 'Last enabled', exact: true });
  await trigger.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Before commands', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menu', { name: 'Contract commands', exact: true })).toBeVisible();
  await expect(first).toBeFocused();
  await page.keyboard.press('End'); await expect(last).toBeFocused();
  await page.keyboard.press('Home'); await expect(first).toBeFocused();
  await page.keyboard.press('ArrowDown'); await expect(last).toBeFocused();
  await page.keyboard.press('ArrowUp'); await expect(first).toBeFocused();
  await page.keyboard.type('l'); await expect(last).toBeFocused();
  await expectResolvedReferences(page);
  // Space extends an active typeahead query; test command activation separately.
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByLabel('Command requests', { exact: true })).toHaveText('');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('End'); await expect(last).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByLabel('Command requests', { exact: true })).toHaveText('last');
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(first).toBeFocused();
  await page.keyboard.type('u'); await expect(first).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByLabel('Command requests', { exact: true })).toHaveText('last');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'After commands', exact: true })).toBeFocused();
});

test('Popover exposes named dialog/form content and restores trigger after Escape', async ({ page }) => {
  await fixture(page, 'popover--default');
  const trigger = page.getByRole('button', { name: 'Edit note', exact: true });
  await trigger.focus(); await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Course note', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: 'Course note', exact: true })).toBeVisible();
  expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
  await expect(page.getByRole('menu')).toHaveCount(0);
  const field = dialog.getByRole('textbox', { name: 'Note', exact: true });
  await field.fill('Host draft');
  await expect(field).toHaveValue('Host draft');
  await expectResolvedReferences(page);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
});

test('Tooltip supplements keyboard trigger name with description and Escape retains focus', async ({ page }) => {
  await fixture(page, 'tooltip--default');
  const trigger = page.getByRole('button', { name: 'Refresh', exact: true });
  await page.keyboard.press('Tab'); await expect(trigger).toBeFocused();
  await expect(page.getByRole('tooltip')).toHaveText('Refresh the course list');
  await expect(trigger).toHaveAccessibleName('Refresh');
  await expect(trigger).toHaveAccessibleDescription('Refresh the course list');
  await expectResolvedReferences(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0); await expect(trigger).toBeFocused();
});
