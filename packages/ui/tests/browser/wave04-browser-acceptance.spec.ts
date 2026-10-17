import { test, expect, type Locator, type Page } from '@playwright/test';

const diagnostics = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page, baseURL }) => {
  const errors: string[] = []; diagnostics.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  const origin = new URL(baseURL!).origin;
  // Native fixtures may load local assets, but no external account/data service.
  await page.route('**/*', route => {
    if (new URL(route.request().url()).origin !== origin) {
      errors.push(`Unexpected external request: ${route.request().url()}`);
      return route.abort();
    }
    return route.continue();
  });
});
test.afterEach(async ({ page }, info) => {
  const errors = diagnostics.get(page) ?? [];
  await info.attach('browser-diagnostics', { body: JSON.stringify(errors), contentType: 'application/json' });
  expect(errors).toEqual([]);
});

async function fixture(page: Page, id: string, locale = 'en-US') {
  await page.goto(`/fixtures/?${new URLSearchParams({ id, embed: 'true', globals: `theme:light;density:compact;locale:${locale};direction:auto` })}`);
  await expect.poll(() => page.evaluate(() => (window as Window & { __SGUI_FIXTURE__?: { status: string } }).__SGUI_FIXTURE__?.status)).toBe('success');
}
async function focusObservation(target: Locator) {
  await expect(target).toBeFocused();
  const observe = () => target.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const pointHits = [0.15, 0.5, 0.85].map(x => {
      const hit = document.elementFromPoint(rect.left + rect.width * x, rect.top + rect.height / 2);
      return { x: rect.left + rect.width * x, y: rect.top + rect.height / 2, unobscured: Boolean(hit && (element.contains(hit) || hit.contains(element))), hit: hit?.outerHTML.slice(0, 500) ?? null };
    });
    const points = pointHits.map(point => point.unobscured);
    const clipping: { tag: string; top: number; bottom: number; left: number; right: number; part: string | null; overflowX: string; overflowY: string; scrollTop: number; scrollLeft: number; clientHeight: number; clientWidth: number; scrollHeight: number; scrollWidth: number }[] = [];
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const css = getComputedStyle(parent);
      if (/auto|scroll|hidden|clip/.test(`${css.overflowX} ${css.overflowY}`)) {
        const box = parent.getBoundingClientRect();
        clipping.push({ tag: parent.tagName, part: parent.getAttribute('data-sgui-part'), overflowX: css.overflowX, overflowY: css.overflowY, scrollTop: parent.scrollTop, scrollLeft: parent.scrollLeft, clientHeight: parent.clientHeight, clientWidth: parent.clientWidth, scrollHeight: parent.scrollHeight, scrollWidth: parent.scrollWidth, top: box.top, bottom: box.bottom, left: box.left, right: box.right });
      }
    }
    return { label: element.getAttribute('aria-label'), id: element.id, active: element === document.activeElement, viewport: { width: innerWidth, height: innerHeight }, rect: rect.toJSON(), points, pointHits, clipping, visible: rect.width > 0 && rect.height > 0 &&
      rect.left >= -1 && rect.right <= innerWidth + 1 && rect.top >= -1 && rect.bottom <= innerHeight + 1 && points.every(Boolean) &&
      clipping.every(box => rect.top >= box.top - 1 && rect.bottom <= box.bottom + 1 && rect.left >= box.left - 1 && rect.right <= box.right + 1) };
  });
  // Keep the original geometry predicate intact and preserve the failing stop,
  // including its hit targets and ancestor scroll state, rather than an empty log.
  try {
    await expect.poll(observe).toMatchObject({ visible: true });
    return observe();
  } catch (error) {
    await test.info().attach('failed-focused-control', { body: JSON.stringify(await observe(), null, 2), contentType: 'application/json' });
    await test.info().attach('failed-focus-viewport', { body: await target.page().screenshot(), contentType: 'image/png' });
    throw error;
  }
}

for (const locale of ['en-US', 'ar-EG']) test(`composed shell names, heading hierarchy and native form submit survive reflow (${locale})`, async ({ page }, info) => {
  const rtl = locale === 'ar-EG';
  await page.setViewportSize({ width: 1280, height: 900 });
  await fixture(page, 'layout-appshell--localized-presentation', locale);
  const title = rtl ? 'مساحة عمل التخطيط والتعاون بين فرق التدريس الدولية' : 'International teaching team planning and collaboration workspace';
  const main = page.getByRole('main', { name: title, exact: true });
  await expect(main).toHaveCount(1);
  await expect(main.getByRole('heading', { level: 1 })).toHaveText(title);
  await expect(main.getByRole('heading', { level: 2 })).toHaveCount(12);
  await expect(main.getByRole('heading', { level: 3 })).toHaveCount(0);
  const navigation = page.getByRole('navigation', { name: rtl ? 'التنقل في الدورات' : 'Course navigation', exact: true });
  await expect(navigation).toHaveCount(1);
  await expect(navigation.getByRole('link').and(navigation.locator('[aria-current="page"]'))).toHaveCount(1);
  const field = main.getByRole('textbox', { name: rtl ? 'عنوان خطة التعلم' : 'Learning plan title', exact: true });
  await expect(field).toHaveAccessibleName(rtl ? 'عنوان خطة التعلم' : 'Learning plan title');
  await expect.poll(() => field.evaluate(node => Boolean((node as HTMLInputElement).form))).toBe(true);
  const original = await field.elementHandle();
  // Reach the form through native keyboard navigation; no pointer/focus repair.
  for (let stop = 0; stop < 40 && !(await field.evaluate(node => node === document.activeElement)); stop++) {
    await page.keyboard.press('Tab');
  }
  await expect(field).toBeFocused();
  await field.fill(rtl ? 'خطة المراجعة' : 'Review plan');
  await page.setViewportSize({ width: 320, height: 640 });
  await expect(field).toBeFocused();
  expect(await field.evaluate((node, old) => node === old, original)).toBe(true);
  await expect(field).toHaveValue(rtl ? 'خطة المراجعة' : 'Review plan');
  // These are genuine native Enter/form semantics, not a click on a fake save control.
  await expect(main.getByRole('status')).toHaveCount(0);
  await page.keyboard.press('Enter');
  await expect(main.getByRole('status')).toHaveText(rtl ? 'تم حفظ المسودة للمراجعة.' : 'Draft saved for review.');
  await expect(field).toBeFocused();
  await expect(page.getByTestId('localized-shell')).toHaveAttribute('dir', rtl ? 'rtl' : 'ltr');
  await info.attach('composed-shell-semantics', { body: JSON.stringify({ locale, widths: [1280, 320], h1: title, h2Count: 12, nativeEnterSubmitted: true, hostPersistence: false }), contentType: 'application/json' });
});

test('every tabbed-modal field and footer stop remains unobscured with text spacing and open resize', async ({ page }, info) => {
  const stops: unknown[] = [];
  await page.setViewportSize({ width: 1280, height: 900 });
  await fixture(page, 'overlays-appmodal--text-reflow');
  const trigger = page.getByRole('button', { name: 'Open modal', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Course settings', exact: true });
  await expect(dialog.getByRole('textbox', { name: 'Field 1', exact: true })).toBeFocused();
  // A text-spacing/root-font stress fixture; deliberately not reported as browser zoom.
  await page.addStyleTag({ content: 'html{font-size:200% !important} *{line-height:1.5 !important;letter-spacing:.12em !important;word-spacing:.16em !important} p{margin-block-end:2em !important}' });
  await page.setViewportSize({ width: 320, height: 640 });
  try {
    for (let field = 1; field <= 20; field++) {
      const input = dialog.getByRole('textbox', { name: `Field ${field}`, exact: true });
      stops.push({ field, observation: await focusObservation(input) });
      await page.keyboard.press('Tab');
    }
    const cancel = dialog.getByRole('button', { name: 'Cancel', exact: true });
    stops.push({ footer: 'Cancel', observation: await focusObservation(cancel) });
    await page.keyboard.press('Tab');
    const next = dialog.getByRole('button', { name: 'Next', exact: true });
    stops.push({ footer: 'Next', observation: await focusObservation(next) });
    await info.attach('narrow-focused-footer', { body: await page.screenshot(), contentType: 'image/png' });
    await page.setViewportSize({ width: 900, height: 700 });
    stops.push({ footer: 'Next after resize', observation: await focusObservation(next) });
    await page.keyboard.press('Shift+Tab');
    await focusObservation(cancel);
    await page.keyboard.press('Shift+Tab');
    await focusObservation(dialog.getByRole('textbox', { name: 'Field 20', exact: true }));
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0); await expect(trigger).toBeFocused();
  } finally {
    await info.attach('native-tab-focus-stops', { body: JSON.stringify({ stops, rootTextScale: '200%', actualBrowserZoom: false, physicalInput: false, speechObserved: false }), contentType: 'application/json' });
  }
});
