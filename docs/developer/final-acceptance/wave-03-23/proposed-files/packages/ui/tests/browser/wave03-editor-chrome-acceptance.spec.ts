import { expect, test, type Locator } from '@playwright/test';

const fixture = 'editors-contenteditorchrome--acceptance-composition';
const labels = (arabic: boolean) => arabic ? {
  file: 'ملف وإجراءات المستند الطويلة', save: 'حفظ تغييرات المستند', doc: 'محتوى المستند',
  heading: 'نمط عنوان النص', bold: 'عريض', zoom: 'تكبير', group: 'إجراءات المستند',
  tools: 'أدوات تحرير المستند', dialog: 'إجراءات المستند', close: 'إغلاق', edit: 'تعديل العنوان',
} : {
  file: 'File and long document actions', save: 'Save document changes', doc: 'Acceptance document',
  heading: 'Text style heading', bold: 'Bold', zoom: 'Zoom in', group: 'Document actions',
  tools: 'Document editing', dialog: 'Document command dialog', close: 'Close', edit: 'Edit title',
};
async function geometry(locator: Locator) {
  return locator.evaluate(root => ({
    rect: root.getBoundingClientRect().toJSON(), width: root.clientWidth, scrollWidth: root.scrollWidth,
    parts: [...root.querySelectorAll<HTMLElement>('[data-sgui-part]')].map(node => ({
      part: node.dataset.sguiPart, rect: node.getBoundingClientRect().toJSON(),
      width: node.clientWidth, scrollWidth: node.scrollWidth,
    })),
    documentWidth: document.documentElement.scrollWidth, viewport: innerWidth,
  }));
}
async function visibleFocus(control: Locator) {
  await expect(control).toBeFocused();
  expect(await control.evaluate(node => {
    const r = node.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return r.left >= -1 && r.right <= innerWidth + 1 && r.top >= -1 && r.bottom <= innerHeight + 1 && !!hit && node.contains(hit);
  }), 'focused control is in viewport and unobscured').toBe(true);
}

test('long chrome reflows in both production themes/densities and Arabic RTL', async ({ page, browser }, info) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const theme of ['light', 'dark']) for (const density of ['compact', 'comfortable']) for (const arabic of [false, true]) {
    await page.setViewportSize({ width: 320, height: 1000 });
    await page.goto(`/fixtures/?id=${fixture}&globals=theme:${theme};density:${density};locale:${arabic ? 'ar' : 'en-US'};direction:${arabic ? 'rtl' : 'ltr'};a11y.manual:!true`);
    const host = page.getByTestId('chrome-acceptance');
    const l = labels(arabic);
    await expect(host).toBeVisible();
    await expect(page.getByRole('group', { name: l.group, exact: true })).toBeVisible();
    await expect(page.getByRole('group', { name: l.tools, exact: true })).toBeVisible();
    expect(await host.evaluate(node => getComputedStyle(node).direction)).toBe(arabic ? 'rtl' : 'ltr');
    await expect(host.locator('[data-sgui-part="content-editor-chrome"]')).toHaveCount(1);
    const measured = await geometry(host);
    expect(measured.documentWidth).toBeLessThanOrEqual(measured.viewport + 1);
    for (const part of measured.parts.filter(part => part.width > 0)) {
      expect(part.scrollWidth, `${part.part} does not overflow horizontally`).toBeLessThanOrEqual(part.width + 1);
    }
    // These are observed logical DOM order and translated names, not spoken AT.
    const order = await host.locator('[data-sgui-part="editor-actions"] button').allTextContents();
    expect(order[0]).toContain(l.file);
    const id = `${theme}-${density}-${arabic ? 'ar' : 'en'}`;
    await info.attach(`${id}-geometry`, { body: JSON.stringify({ browser: browser.version(), ...measured }), contentType: 'application/json' });
    await info.attach(`${id}-chrome`, { body: await host.screenshot(), contentType: 'image/png' });
  }
  expect(errors).toEqual([]);
});

test('host slot replacement retains draft, focused node and its independent scroll owner', async ({ page }, info) => {
  await page.setViewportSize({ width: 640, height: 1000 });
  await page.goto(`/fixtures/?id=${fixture}&globals=theme:dark;density:compact;a11y.manual:!true`);
  const editor = page.getByRole('textbox', { name: labels(false).doc, exact: true });
  const original = await editor.elementHandle();
  await editor.fill('Draft retained through all chrome replacements');
  const scroll = page.getByTestId('acceptance-scroll');
  await scroll.evaluate(node => { node.scrollTop = 160; node.focus({ preventScroll: true }); });
  await expect(scroll).toBeFocused();
  const top = await scroll.evaluate(node => node.scrollTop);
  expect(top).toBeGreaterThan(0);
  for (let index = 0; index < 2; index++) {
    await page.keyboard.press('Alt+Digit1');
    await expect(page.locator('[data-sgui-part="content-editor-chrome"]')).toHaveCount(index === 0 ? 0 : 1);
    await expect(scroll).toBeFocused();
    expect(await scroll.evaluate(node => node.scrollTop)).toBe(top);
    expect(await editor.evaluate((node, previous) => node === previous, original)).toBe(true);
    await expect(editor).toHaveValue('Draft retained through all chrome replacements');
  }
  // Native keyboard entry into heading completes its deferred host callback.
  const heading = page.getByRole('button', { name: /Text style heading/ });
  await heading.focus(); await heading.press('Enter');
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
  await expect(heading).toContainText('H1');
  await visibleFocus(editor);
  await info.attach('slot-replacement-geometry', { body: JSON.stringify(await geometry(page.getByTestId('chrome-acceptance'))), contentType: 'application/json' });
});

test('pending and unavailable replacements suppress actions while preserving pressed state and zoom', async ({ page }) => {
  const l = labels(false);
  await page.goto(`/fixtures/?id=${fixture}&globals=a11y.manual:!true`);
  const bold = page.getByRole('button', { name: l.bold, exact: true });
  await bold.click(); await expect(bold).toHaveAttribute('aria-pressed', 'true');
  const file = page.getByRole('button', { name: l.file, exact: true });
  await file.click();
  const dialog = page.getByRole('dialog', { name: l.dialog, exact: true });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Alt+Digit2');
  await expect(dialog.getByRole('button', { name: l.save, exact: true })).toBeDisabled();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(file).toBeDisabled();
  await expect(bold).toBeDisabled();
  await expect(bold).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: l.edit, exact: true })).toBeDisabled();
  await page.getByRole('button', { name: l.zoom, exact: true }).click();
  await expect(page.getByLabel('Zoom', { exact: true })).toHaveText('110%');
  await page.keyboard.press('Alt+Digit3');
  await expect(file).toBeDisabled();
  await page.keyboard.press('Alt+Digit4');
  await expect(file).toBeEnabled();
  await file.click(); await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: l.close, exact: true }).click();
  await expect(file).toBeFocused();
});
