import { test, expect, type Page } from '@playwright/test';

type ObservedPage = Page & { diagnostics?: string[] };
test.beforeEach(async ({ page }) => {
  const diagnostics: string[] = [];
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) diagnostics.push(message.text()); });
  page.on('dialog', dialog => { diagnostics.push(`Unexpected dialog: ${dialog.message()}`); void dialog.dismiss(); });
  (page as ObservedPage).diagnostics = diagnostics;
});
test.afterEach(async ({ page }) => { expect((page as ObservedPage).diagnostics).toEqual([]); });
async function saved(page: Page) {
  return JSON.parse((await page.getByLabel('Saved link JSON').textContent()) ?? 'null');
}
for (const theme of ['light', 'dark']) {
  test(`saved links retain host schema and reject unsafe activation; new tabs isolate opener: ${theme}`, async ({ page, context }) => {
    await context.route('**/link-policy-destination', route => route.fulfill({ contentType: 'text/html', body: '<title>Guide</title><p>Course guide</p>' }));
    await page.goto(`/iframe.html?id=editors-pagerichtexteditorsection--link-destinations&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
    const editor = page.getByRole('textbox', { name: 'Link document', exact: true });
    await expect(editor.getByRole('link', { name: 'Web guide', exact: true })).toHaveAttribute('href', 'https://www.example.org/guide');
    for (const readOnly of [false, true]) {
      if (readOnly) await page.getByRole('button', { name: 'Make read-only' }).click();
      for (const name of ['Rejected script', 'Rejected data', 'Rejected network path', 'Rejected scheme']) {
        const anchor = editor.getByRole('link', { name, exact: true });
        await expect(anchor).toHaveAttribute('href', 'about:blank');
        await anchor.click();
        await anchor.click({ button: 'middle' });
      }
      expect(context.pages()).toHaveLength(1);
      for (const options of [{}, { modifiers: ['ControlOrMeta'] as ('ControlOrMeta')[] }, { button: 'middle' as const }]) {
        const popupPromise = context.waitForEvent('page');
        await editor.getByRole('link', { name: 'Relative guide', exact: true }).click(options);
        const popup = await popupPromise;
        await popup.waitForLoadState();
        expect(popup.url()).toContain('/link-policy-destination');
        expect(await popup.evaluate(() => window.opener)).toBeNull();
        await popup.close();
      }
    }
    await page.getByRole('button', { name: 'Enable editing' }).click();
    await editor.locator('p').last().click();
    await page.keyboard.press('End');
    await page.keyboard.type(' saved');
    const value = await saved(page);
    expect(JSON.stringify(value)).not.toContain('sgui-link');
    expect(value.root.children[2].children[0]).toMatchObject({ type: 'link', url: "javascript:alert('unsafe-link')", target: '_blank', rel: 'author', title: 'Rejected script', children: [expect.objectContaining({ format: 3 })] });
    await page.getByRole('button', { name: 'Reload saved document' }).click();
    await expect(editor).toContainText('Edit link document saved');
    await expect(editor.getByRole('link', { name: 'Rejected script' })).toHaveAttribute('href', 'about:blank');
  });

  test(`native pasted links share the saved destination policy through reload: ${theme}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=editors-pagerichtexteditorsection--link-destinations&viewMode=story&globals=theme:${theme};a11y.manual:!true`);
    const source = page.getByRole('textbox', { name: 'Link clipboard source', exact: true });
    await source.focus();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('ControlOrMeta+C');
    const editor = page.getByRole('textbox', { name: 'Link document', exact: true });
    await editor.focus();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('ControlOrMeta+V');
    await expect(editor.getByRole('link', { name: 'Pasted guide', exact: true })).toHaveJSProperty('href', new URL('/link-policy-destination', page.url()).href);
    await expect(editor.getByRole('link', { name: 'Pasted rejected script', exact: true })).toHaveAttribute('href', 'about:blank');
    await expect(editor.locator('strong, b')).toHaveText('Pasted guide');
    await expect(editor.locator('em, i')).toHaveText('Pasted rejected script');
    const value = await saved(page);
    expect(JSON.stringify(value)).not.toContain('sgui-link');
    await page.getByRole('button', { name: 'Reload saved document' }).click();
    await expect(editor.getByRole('link', { name: 'Pasted rejected script', exact: true })).toHaveAttribute('href', 'about:blank');
    await page.getByRole('button', { name: 'Make read-only' }).click();
    await editor.getByRole('link', { name: 'Pasted rejected script', exact: true }).click();
  });
}
