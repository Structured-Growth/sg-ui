import { expect, test, type Locator, type Page } from '@playwright/test';

async function settledFocus(page: Page, control: Locator) {
  await expect(control).toBeFocused();
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await expect(control).toBeFocused();
}
async function visibleFocus(control: Locator) {
  await control.focus();
  await expect(control).toBeFocused();
  expect(await control.evaluate(element => {
    const r = element.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return r.left >= 0 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= innerHeight + 1 && !!hit && element.contains(hit);
  }), 'focused control remains visible and unobscured').toBe(true);
}

for (const theme of ['light', 'dark']) {
  for (const enlarged of [false, true]) {
    test(`combined editor chrome host focus and live states: ${theme}, ${enlarged ? '200% text' : '320px'}`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setViewportSize({ width: enlarged ? 640 : 320, height: 900 });
      await page.goto(`/iframe.html?id=editors-contenteditorchrome--native-host-composition&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
      const host = page.getByTestId('native-editor-host');
      await expect(host).toBeVisible();
      await expect(host.locator('xpath=ancestor::*[@data-sgui-scope][1]')).toHaveAttribute('data-sgui-theme', theme);
      if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200%; }' });
      const editor = page.getByRole('textbox', { name: 'Host editor' });
      const original = await editor.elementHandle();
      const requests = page.getByTestId('host-requests');
      const file = page.getByRole('button', { name: 'File', exact: true });
      const heading = page.getByRole('button', { name: /Text style heading/ });
      const bold = page.getByRole('button', { name: 'Bold', exact: true });
      await editor.focus();
      await page.keyboard.press('Home');
      await heading.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByRole('listbox')).toBeVisible();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await expect(heading).toContainText('H1');
      await settledFocus(page, editor);
      await expect(editor).toHaveText('Host document text stays in this unchanged native node.');
      await expect(requests).toHaveText('{"file":0,"menu":0,"heading":1,"bold":0,"zoom":0}');
      await bold.focus();
      await page.keyboard.press('Space');
      await expect(bold).toHaveAttribute('aria-pressed', 'true');
      await settledFocus(page, editor);

      // Chrome emits its actual button anchor. The host's controlled owned Menu
      // positions at Document commands; the host restores editor focus on close.
      await file.focus();
      await page.keyboard.press('Enter');
      const menu = page.getByRole('menu', { name: 'Host file menu' });
      await expect(menu).toBeVisible();
      await expect(page.getByTestId('host-anchor')).toHaveText('BUTTON:File');
      await expect(file).toHaveAttribute('aria-expanded', 'true');
      // External controlled opening enters the menu container with no trigger
      // focus strategy. Native ArrowDown establishes first-item keyboard entry.
      await settledFocus(page, menu);
      await page.keyboard.press('ArrowDown');
      await expect(page.getByRole('menuitem', { name: 'Return to editor' })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(menu).toHaveCount(0);
      await settledFocus(page, editor);
      await expect(requests).toHaveText('{"file":1,"menu":1,"heading":1,"bold":1,"zoom":0}');
      await file.click();
      await expect(menu).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(menu).toHaveCount(0);
      await settledFocus(page, editor);
      await expect(requests).toHaveText('{"file":2,"menu":1,"heading":1,"bold":1,"zoom":0}');

      for (const state of ['read-only', 'pending', 'unavailable']) {
        // The preceding Zoom click intentionally leaves focus on Zoom. Each
        // replacement case starts with the editor focused, as its own precondition.
        await editor.focus();
        await settledFocus(page, editor);
        // Virtual host update leaves native editor focus in place while props
        // change; no fixture interaction substitutes for library controls.
        await page.getByRole('button', { name: `Use ${state}`, exact: true }).evaluate((node: HTMLButtonElement) => node.click());
        await expect(editor).toHaveAttribute('aria-readonly', 'true');
        await settledFocus(page, editor);
        expect(await editor.evaluate((node, prior) => node === prior, original)).toBe(true);
        await expect(file).toBeDisabled();
        await expect(heading).toBeDisabled();
        await expect(bold).toBeDisabled();
        await expect(bold).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByRole('button', { name: 'Edit title' })).toBeDisabled();
        await expect(page.getByRole('progressbar', { name: 'Pending' })).toHaveCount(state === 'pending' ? 1 : 0);
        const zoomIn = page.getByRole('button', { name: 'Zoom in', exact: true });
        await zoomIn.click();
        await settledFocus(page, zoomIn);
        await expect(page.getByLabel('Zoom', { exact: true })).toHaveText(`${state === 'read-only' ? 110 : state === 'pending' ? 120 : 130}%`);
      }
      await expect(requests).toHaveText('{"file":2,"menu":1,"heading":1,"bold":1,"zoom":3}');
      await page.getByRole('button', { name: 'Use editable', exact: true }).click();
      await expect(file).toBeEnabled();
      await expect(heading).toBeEnabled();
      await expect(bold).toBeEnabled();
      await page.getByRole('button', { name: 'Toggle optional groups' }).click();
      for (const name of ['Zoom in', 'Align left', 'Custom component']) await expect(page.getByRole('button', { name, exact: true })).toHaveCount(0);
      await expect(bold).toHaveAttribute('aria-pressed', 'true');
      await page.getByRole('button', { name: 'Toggle optional groups' }).click();
      for (const name of ['Align left', 'Custom component', 'Unavailable command']) await expect(page.getByRole('button', { name, exact: true })).toBeDisabled();
      for (const control of [file, heading, bold, page.getByRole('button', { name: 'Zoom in', exact: true }), editor]) await visibleFocus(control);
      for (const part of ['content-editor-chrome', 'document-editor-toolbar']) {
        expect(await host.locator(`[data-sgui-part="${part}"]`).evaluate(node => node.scrollWidth <= node.clientWidth + 1), `${part} wraps within host width`).toBe(true);
      }
      await info.attach('host-document-geometry', { contentType: 'application/json', body: JSON.stringify(await host.evaluate(node => ({
        viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
        children: Array.from(node.children).map(child => ({ tag: child.tagName, part: child.getAttribute('data-sgui-part'), testId: child.getAttribute('data-testid'), width: child.getBoundingClientRect().width, scrollWidth: child.scrollWidth })),
      }))) });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      expect(errors).toEqual([]);
      await info.attach('combined-editor-chrome', { body: await host.screenshot(), contentType: 'image/png' });
    });
  }
}
