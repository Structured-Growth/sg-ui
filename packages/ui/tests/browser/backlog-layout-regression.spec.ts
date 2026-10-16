import { test, expect } from '@playwright/test';

const fixture = (id: string) => `/fixtures/?id=migration-proofs-${id}&globals=a11y.manual:!true`;

test('Stack wraps actions with token spacing in both writing directions', async ({ page }) => {
  await page.goto(fixture('stack--wrapping'));
  for (const dir of ['ltr', 'rtl']) {
    const group = page.getByRole('group', { name: `${dir} wrapping actions` });
    const geometry = await group.evaluate(element => {
      const bounds = element.getBoundingClientRect();
      const css = getComputedStyle(element);
      return { left: bounds.left, right: bounds.right, padding: parseFloat(css.paddingInlineStart), gap: parseFloat(css.rowGap),
        buttons: [...element.querySelectorAll('button')].map(node => { const b = node.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom }; }) };
    });
    expect(geometry.padding).toBeGreaterThan(0);
    const [first, second, third] = geometry.buttons;
    expect(third.top).toBeGreaterThan(first.top);
    const nextRow = geometry.buttons.find(button => button.top > first.top)!;
    expect(nextRow.top - first.bottom).toBeCloseTo(geometry.gap, 0);
    if (dir === 'ltr') expect(first.left - geometry.left).toBeCloseTo(geometry.padding, 0);
    else expect(geometry.right - first.right).toBeCloseTo(geometry.padding, 0);
    for (const button of [first, second, third]) {
      expect(button.left).toBeGreaterThanOrEqual(geometry.left);
      expect(button.right).toBeLessThanOrEqual(geometry.right);
    }
  }
});

test('long breadcrumb ancestors wrap inside a narrow host', async ({ page }) => {
  await page.goto(fixture('breadcrumbs--long-ancestor'));
  const nav = page.getByRole('navigation', { name: 'Breadcrumbs' });
  await expect(nav.getByRole('link', { name: 'Professional development courses for instructors and administrators' })).toBeVisible();
  const geometry = await nav.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    const link = element.querySelector('a[href="/courses"]')!;
    const range = document.createRange(); range.selectNodeContents(link);
    return { overflow: element.scrollWidth - element.clientWidth,
      lines: [...range.getClientRects()].map(r => ({ left: r.left, right: r.right, top: r.top })), left: bounds.left, right: bounds.right };
  });
  expect(geometry.overflow).toBeLessThanOrEqual(1);
  expect(new Set(geometry.lines.map(line => line.top)).size).toBeGreaterThan(1);
  for (const line of geometry.lines) {
    expect(line.left).toBeGreaterThanOrEqual(geometry.left - 1);
    expect(line.right).toBeLessThanOrEqual(geometry.right + 1);
  }
  await expect(nav.locator('[aria-current="page"]')).toHaveText('Course details');
});

test('Avatar preserves owned dimensions for loaded and rejected images', async ({ page }) => {
  for (const [scenario, size] of [['image', 40], ['broken-image', 48]] as const) {
    await page.goto(fixture(`avatar--${scenario}`));
    const avatar = page.getByRole('img', { name: 'Ada Lovelace', exact: true });
    await expect(avatar).toBeVisible();
    const bounds = await avatar.boundingBox();
    expect(bounds!.width).toBe(size);
    expect(bounds!.height).toBe(size);
    if (scenario === 'broken-image') await expect(avatar).toHaveText('AL');
  }
});

test('SplitAction uses a neutral shared border and one inner divider', async ({ page }) => {
  await page.goto(fixture('splitaction--default'));
  const group = page.getByRole('group', { name: 'Create course', exact: true });
  const styles = await group.evaluate(element => {
    const css = getComputedStyle(element);
    const buttons = [...element.querySelectorAll('button')];
    const main = getComputedStyle(buttons[0]); const menu = getComputedStyle(buttons[1]);
    return { border: css.borderTopWidth, color: css.borderTopColor, expected: css.getPropertyValue('--sgui-button-group-border').trim(),
      divider: menu.borderInlineStartWidth, dividerColor: menu.borderInlineStartColor,
      dividerExpected: css.getPropertyValue('--sgui-button-group-divider').trim(),
      tone: buttons[0].getAttribute('data-tone'), variant: buttons[0].getAttribute('data-variant'),
      mainRight: buttons[0].getBoundingClientRect().right, menuLeft: buttons[1].getBoundingClientRect().left,
      mainBackground: main.backgroundColor };
  });
  expect(styles.border).toBe('1px');
  expect(styles.divider).toBe('1px');
  expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
  expect(styles.dividerColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(styles.tone).toBe('neutral'); expect(styles.variant).toBe('text');
  expect(styles.mainBackground).toBe('rgba(0, 0, 0, 0)');
  expect(styles.mainRight).toBeCloseTo(styles.menuLeft, 0);
});

test('Tooltip portal stays adjacent to its trigger and inside the viewport', async ({ page }) => {
  await page.goto(fixture('tooltip--default'));
  const trigger = page.getByRole('button', { name: 'Refresh', exact: true });
  await trigger.focus();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toBeVisible();
  const anchor = (await trigger.boundingBox())!; const box = (await tooltip.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.x).toBeGreaterThanOrEqual(0); expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  expect(Math.min(Math.abs(box.y + box.height - anchor.y), Math.abs(anchor.y + anchor.height - box.y))).toBeLessThanOrEqual(9);
  await expect(trigger).toHaveAttribute('aria-describedby', (await tooltip.getAttribute('id'))!);
});
