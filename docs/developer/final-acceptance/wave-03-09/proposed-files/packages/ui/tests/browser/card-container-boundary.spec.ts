import { test, expect, type Locator } from '@playwright/test';

async function padding(card: Locator) {
  return card.locator('[data-sgui-part="class-card-header"]').evaluate(e => parseFloat(getComputedStyle(e).paddingInlineStart));
}

test('card query follows its allocation and preserves sibling and native focus', async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/fixtures/?id=components-classcardframe--container-boundary');
  const firstHost = page.getByTestId('card-host-compact');
  const secondHost = page.getByTestId('card-host-comfortable');
  const first = firstHost.locator('[data-sgui-part="class-card-frame"]');
  const second = secondHost.locator('[data-sgui-part="class-card-frame"]');
  for (const card of [first, second]) {
    await expect(card).toHaveCSS('container-name', 'sgui-class-card');
    await expect(card).toHaveCSS('container-type', 'inline-size');
    expect(await card.evaluate(e => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
  }
  const tokens = await first.evaluate(e => {
    const s = getComputedStyle(e); const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return { narrow: parseFloat(s.getPropertyValue('--sgui-space3')) * rem, wide: parseFloat(s.getPropertyValue('--sgui-space4')) * rem };
  });
  expect(await padding(first)).toBeCloseTo(tokens.narrow, 1);
  expect(await padding(second)).toBeCloseTo(tokens.wide, 1);
  const button = first.getByRole('button', { name: 'Open compact course' });
  await button.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  // Host layout update deliberately keeps the focused native element mounted.
  await firstHost.evaluate(e => { e.style.inlineSize = '420px'; });
  await expect.poll(() => padding(first)).toBeCloseTo(tokens.wide, 1);
  await expect(button).toBeFocused();
  expect(await padding(second)).toBeCloseTo(tokens.wide, 1);
  await page.addStyleTag({ content: 'html {font-size:200%} [data-sgui-part="class-card-frame"] * {font-family:monospace!important;line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} [data-sgui-part="class-card-frame"] p {margin-block-end:2em!important}' });
  await expect.poll(() => padding(first)).toBeCloseTo(tokens.narrow * 2, 1);
  for (const card of [first, second]) expect(await card.evaluate(e => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
  await expect(button).toBeFocused();
  expect(await button.evaluate(e => { const r=e.getBoundingClientRect(),p=e.closest('[data-sgui-part="class-card-frame"]')!.getBoundingClientRect(),s=getComputedStyle(e),ring=parseFloat(s.outlineWidth)+Math.max(0,parseFloat(s.outlineOffset)||0);return r.left-ring>=p.left && r.right+ring<=p.right; })).toBe(true);
  await info.attach('card-container-enlarged', { body: await firstHost.screenshot(), contentType: 'image/png' });
});
