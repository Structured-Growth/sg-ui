import { test, expect, type Page } from '@playwright/test';

async function selectHostTextAndEnter(page: Page, mode: 'foreground' | 'background') {
  const document = page.getByRole('textbox', { name: 'Host document', exact: true });
  await document.focus();
  await page.keyboard.press('ControlOrMeta+A');
  expect(await document.evaluate(element => {
    const input = element as HTMLTextAreaElement;
    return [input.selectionStart, input.selectionEnd];
  })).toEqual([0, 18]);
  await page.keyboard.press('Tab');
  if (mode === 'background') await page.keyboard.press('Tab');
  const trigger = page.getByRole('button', { name: mode === 'foreground' ? 'Text color' : 'Background color', exact: true });
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Hex color' })).toBeFocused();
  return trigger;
}

for (const theme of ['light', 'dark']) {
  for (const mode of ['foreground', 'background'] as const) {
    test(`${theme} ${mode}: keyboard correction, one commit, native color DOM change, clear/reset and host selection`, async ({ page }) => {
      const diagnostics: string[] = [];
      page.on('pageerror', error => diagnostics.push(error.message));
      page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
      await page.goto(`/iframe.html?id=editors-textcolorpickercontrol--native-transactions&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      const trigger = await selectHostTextAndEnter(page, mode);
      const field = page.getByRole('textbox', { name: 'Hex color' });
      const requests = page.getByLabel('Host requests');
      const value = page.getByLabel(`Host ${mode}`);
      const other = page.getByLabel(`Host ${mode === 'foreground' ? 'background' : 'foreground'}`);
      const otherInitial = mode === 'foreground' ? '#fedcba' : '#123456';
      await expect(field).toHaveValue(mode === 'foreground' ? '#123456' : '#fedcba');
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.insertText('invalid');
      await page.keyboard.press('Enter');
      await expect(field).toHaveAttribute('aria-invalid', 'true');
      await expect(field).toBeFocused();
      const description = await field.getAttribute('aria-describedby');
      expect(description).toBeTruthy();
      expect(await field.evaluate(element => (element.getAttribute('aria-describedby') ?? '').split(/\s+/)
        .map(id => element.ownerDocument.getElementById(id)?.textContent ?? '').join(' '))).toContain('Enter a six-digit hex color');
      await expect(requests).toHaveText('[]');
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.insertText(' #AbCdEf ');
      await page.keyboard.press('Enter');
      await expect(value).toHaveText('#abcdef');
      await expect(field).toHaveValue('#abcdef');
      await expect(field).not.toHaveAttribute('aria-invalid', 'true');
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Text', exact: true })).toBeFocused();
      await expect(requests).toHaveText(JSON.stringify([`${mode}:#abcdef:0-18`]));
      // Traverse swatches with real Tab; do not activate the OS color chooser.
      for (let index = 0; index < 7; index++) await page.keyboard.press('Tab');
      const custom = page.getByLabel('Custom color');
      await expect(custom).toBeFocused();
      await expect(custom).toHaveAttribute('type', 'color');
      await expect(custom).toHaveValue('#abcdef');
      // DOM change boundary only: these events are synthetic, not physical chooser evidence.
      await custom.evaluate(element => {
        const input = element as HTMLInputElement;
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, '#2468ac');
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await expect(value).toHaveText('#2468ac');
      await expect(field).toHaveValue('#2468ac');
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Clear', exact: true })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(value).toHaveText('inherited');
      await expect(field).toHaveValue('');
      await page.keyboard.press('Enter'); // Repeated Clear must not duplicate the request.
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Reset', exact: true })).toBeFocused();
      await page.keyboard.press('Space');
      const reset = mode === 'foreground' ? '#000000' : '#ffffff';
      await expect(value).toHaveText(reset);
      await expect(field).toHaveValue(reset);
      await page.keyboard.press('Space');
      await expect(requests).toHaveText(JSON.stringify([
        `${mode}:#abcdef:0-18`, `${mode}:#2468ac:0-18`, `${mode}:inherited:0-18`, `${mode}:${reset}:0-18`,
      ]));
      await expect(other).toHaveText(otherInitial);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(trigger).toBeFocused();
      // The picker returns to its trigger; the host explicitly restores its selection.
      await page.getByRole('button', { name: 'Return to host selection' }).click();
      const document = page.getByRole('textbox', { name: 'Host document', exact: true });
      await expect(document).toBeFocused();
      expect(await document.evaluate(element => {
        const input = element as HTMLTextAreaElement;
        return input.value.slice(input.selectionStart, input.selectionEnd);
      })).toBe('Selected host text');
      expect(diagnostics).toEqual([]);
    });

    test(`${theme} ${mode}: live host reload/read-only and clean keyboard reopen`, async ({ page }) => {
      const diagnostics: string[] = [];
      page.on('pageerror', error => diagnostics.push(error.message));
      page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
      await page.goto(`/iframe.html?id=editors-textcolorpickercontrol--native-transactions&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      const trigger = await selectHostTextAndEnter(page, mode);
      const field = page.getByRole('textbox', { name: 'Hex color' });
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.insertText('bad');
      await page.keyboard.press('Enter');
      await expect(field).toHaveAttribute('aria-invalid', 'true');
      await page.keyboard.press('Alt+l');
      const reloaded = mode === 'foreground' ? '#654321' : '#abcdef';
      await expect(field).toHaveValue(reloaded);
      await expect(field).not.toHaveAttribute('aria-invalid', 'true');
      await expect(field).toBeFocused();
      await expect(page.getByLabel('Host requests')).toHaveText('[]');
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.insertText('#112233'); // Valid but uncommitted draft.
      await page.keyboard.press('Alt+r');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(trigger).toBeDisabled();
      await expect(page.getByLabel('Host editability')).toHaveText('read-only');
      await expect(page.getByLabel(`Host ${mode}`)).toHaveText(reloaded);
      await expect(page.getByLabel('Host requests')).toHaveText('[]');
      await page.getByRole('button', { name: 'Resume editing' }).click();
      await selectHostTextAndEnter(page, mode);
      await expect(field).toHaveValue(reloaded);
      await expect(field).not.toHaveAttribute('aria-invalid', 'true');
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(field).toBeFocused();
      await expect(field).toHaveValue(reloaded);
      await expect(page.getByLabel('Host requests')).toHaveText('[]');
      await page.keyboard.press('Escape');
      await expect(trigger).toBeFocused();
      expect(diagnostics).toEqual([]);
    });
  }
}
