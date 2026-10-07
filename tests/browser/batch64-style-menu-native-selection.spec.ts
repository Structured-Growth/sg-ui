import { expect, test, type Locator, type Page } from '@playwright/test';

async function tabTo(page: Page, target: Locator) {
  for (let index = 0; index < 16; index++) {
    if (await target.evaluate(node => node === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  await expect(target).toBeFocused();
}

async function selectSample(page: Page) {
  const editor = page.getByRole('textbox', { name: 'Native style document', exact: true });
  await editor.click();
  await page.keyboard.press('Home');
  await page.keyboard.press('Shift+End');
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe(await editor.textContent());
  return editor;
}

const diagnostics = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = []; diagnostics.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
});
test.afterEach(async ({ page }) => { expect(diagnostics.get(page), 'browser runtime diagnostics').toEqual([]); });

for (const theme of ['light', 'dark']) {
  test(`${theme} native style commands hand keyboard-selected text back to the host`, async ({ page }) => {
    await page.goto(`/iframe.html?id=editors-textstylemenucontrol--native-selection&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
    const editor = await selectSample(page);
    const trigger = page.getByRole('button', { name: 'Text style', exact: true });
    const menu = page.getByRole('menu', { name: 'Text style', exact: true });
    const commands = [
      ['Lowercase', 'lowercase', 'mixed text', ['lowercase']],
      ['Uppercase', 'uppercase', 'MIXED TEXT', ['uppercase']],
      ['Capitalize', 'capitalize', 'Mixed Text', ['capitalize']],
      ['Strikethrough', 'strikethrough', 'Mixed Text', ['capitalize', 'strikethrough']],
      ['Subscript', 'subscript', 'Mixed Text', ['capitalize', 'strikethrough', 'subscript']],
      ['Superscript', 'superscript', 'Mixed Text', ['capitalize', 'strikethrough', 'superscript']],
      ['Highlight', 'highlight', 'Mixed Text', ['capitalize', 'strikethrough', 'superscript', 'highlight']],
      ['Clear Formatting', 'clear', 'Mixed Text', []],
    ] as const;
    const requests: string[] = [];
    let previousText = 'MiXeD text';
    let previousStyles: readonly string[] = [];
    for (const [index, [label, id, text, active]] of commands.entries()) {
      await tabTo(page, trigger);
      await page.keyboard.press('ArrowDown');
      await expect(menu).toBeVisible();
      await expect(menu.getByRole('menuitemcheckbox', { name: 'Lowercase', exact: true })).toBeFocused();
      for (const [styleLabel, styleId] of commands.slice(0, 7)) {
        await expect(menu.getByRole('menuitemcheckbox', { name: styleLabel, exact: true })).toHaveAttribute('aria-checked', String(previousStyles.includes(styleId)));
      }
      const clear = menu.getByRole('menuitem', { name: 'Clear Formatting', exact: true });
      await expect(clear).not.toHaveAttribute('aria-disabled', 'true');
      await expect(clear).not.toHaveAttribute('aria-checked');
      for (let step = 0; step < index; step++) await page.keyboard.press('ArrowDown');
      await expect(menu.getByRole(id === 'clear' ? 'menuitem' : 'menuitemcheckbox', { name: label, exact: true })).toBeFocused();
      await page.keyboard.press('Enter');
      requests.push(`original:${id}:${previousText}`);
      await expect(menu).toHaveCount(0);
      // The story's documented host adapter performs restoration. Assertions
      // only observe native focus/selection; no test code manufactures either.
      await expect(editor).toBeFocused();
      await expect(editor).toHaveText(text);
      await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe(text);
      await expect(editor.locator('span')).toHaveAttribute('data-host-styles', active.join(' '));
      await expect(page.getByLabel('Host active styles')).toHaveText(JSON.stringify(active));
      await expect(page.getByLabel('Host style requests')).toHaveText(JSON.stringify(requests));
      previousStyles = active; previousText = text;
    }
    await tabTo(page, trigger);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await expect(page.getByLabel('Host style requests')).toHaveText(JSON.stringify(requests));
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Return to selection', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(editor).toBeFocused();
    await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('Mixed Text');
  });
}

test('open native menu follows live callback, checked-state and availability replacement without accepting requests', async ({ page }) => {
  await page.goto('/iframe.html?id=editors-textstylemenucontrol--native-selection&viewMode=story&globals=a11y.manual:!true');
  await page.getByRole('button', { name: 'Reject host changes', exact: true }).click();
  const editor = await selectSample(page);
  const trigger = page.getByRole('button', { name: 'Text style', exact: true });
  await tabTo(page, trigger);
  await page.keyboard.press('ArrowDown');
  const menu = page.getByRole('menu', { name: 'Text style', exact: true });
  await page.keyboard.press('F2');
  await expect(page.getByLabel('Host callback generation')).toHaveText('replacement');
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Highlight', exact: true })).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('F3');
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Highlight', exact: true })).toHaveAttribute('aria-disabled', 'true');
  await expect(menu.getByRole('menuitem', { name: 'Clear Formatting', exact: true })).toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('End');
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Superscript', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Lowercase', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(editor).toBeFocused();
  await expect(editor).toHaveText('MiXeD text');
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString())).toBe('MiXeD text');
  await expect(page.getByLabel('Host style requests')).toHaveText('["replacement:lowercase:MiXeD text"]');
  await tabTo(page, trigger);
  await page.keyboard.press('ArrowDown');
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Highlight', exact: true })).toHaveAttribute('aria-checked', 'true');
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Lowercase', exact: true })).toHaveAttribute('aria-checked', 'false');
  await page.keyboard.press('F3');
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Highlight', exact: true })).not.toHaveAttribute('aria-disabled', 'true');
  await expect(menu.getByRole('menuitem', { name: 'Clear Formatting', exact: true })).not.toHaveAttribute('aria-disabled', 'true');
  await page.keyboard.press('End');
  await expect(menu.getByRole('menuitem', { name: 'Clear Formatting', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(editor).toBeFocused();
  await expect(page.getByLabel('Host style requests')).toHaveText('["replacement:lowercase:MiXeD text","replacement:clear:MiXeD text"]');
  await expect(page.getByLabel('Host active styles')).toHaveText('["highlight"]');
});
