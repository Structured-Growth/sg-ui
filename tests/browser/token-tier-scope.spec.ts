import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';

// This spec exercises changed tier aliases. FoundationCatalogue continues to own
// the baseline palette/spacing, native keyboard and reduced-motion cases.
async function story(page: Page, name: string, info: TestInfo) {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text());
  });
  (page as Page & { tierErrors?: string[] }).tierErrors = errors;
  const id = `foundations-tokentierscope--${name}`;
  await page.goto(`/iframe.html?id=${id}&viewMode=story&embed=true&globals=theme:light;density:comfortable;a11y.manual:!true`);
  await expect.poll(() => page.evaluate(storyId => {
    const channel = (window as Window & { __STORYBOOK_ADDONS_CHANNEL__?: { last(event: string): unknown[] } }).__STORYBOOK_ADDONS_CHANNEL__;
    const result = channel?.last('storyFinished')?.[0] as { storyId?: string; status?: string } | undefined;
    return result?.storyId === storyId ? result.status : undefined;
  }, id)).toBe('success');
  await info.attach('tier-story', { body: JSON.stringify({ id, engine: info.project.name, autoplay: false }), contentType: 'application/json' });
}
test.afterEach(({ page }) => {
  expect((page as Page & { tierErrors?: string[] }).tierErrors ?? []).toEqual([]);
});
const background = (node: Locator) => node.evaluate(element => getComputedStyle(element).backgroundColor);
async function colors(scope: Locator) {
  return scope.locator('[data-token-role]').evaluateAll(elements => {
    const result: Record<string, string> = {};
    for (const element of elements) {
      const role = element.getAttribute('data-token-role')!;
      // Parent scopes own their first swatch; nested descendants are tested separately.
      result[role] ??= getComputedStyle(element).backgroundColor;
    }
    return result;
  });
}
async function geometry(scope: Locator) {
  return scope.locator('[data-token-geometry]').first().evaluate(element => {
    const css = getComputedStyle(element);
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return { height: parseFloat(css.minHeight) / root, padding: parseFloat(css.paddingInlineStart) / root,
      radius: css.borderRadius, outline: css.outlineColor, shadow: css.boxShadow };
  });
}
async function actual(scope: Locator, label: string) {
  return scope.getByRole('button', { name: label, exact: true }).evaluate(element => {
    const css = getComputedStyle(element), root = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return { background: css.backgroundColor, height: parseFloat(css.minHeight) / root, padding: parseFloat(css.paddingInlineStart) / root };
  });
}

test('nested source overrides rebind semantic and component aliases without changing adjacent slots', async ({ page }, info) => {
  await story(page, 'nested-overrides', info);
  const parent = page.getByTestId('alias-parent'), child = page.getByTestId('alias-child');
  const component = page.getByTestId('alias-component'), dark = page.getByTestId('alias-dark');
  const p = await colors(parent), c = await colors(child), slot = await colors(component), d = await colors(dark);
  for (const role of ['action', 'actionPressed', 'buttonPrimaryBackground', 'buttonPrimaryPressedBackground']) {
    expect(p[role], `parent ${role}`).toBe('rgb(0, 90, 156)');
    expect(c[role], `child ${role}`).toBe('rgb(107, 33, 168)');
  }
  for (const role of ['danger', 'actionDestructive', 'validationError', 'buttonDestructiveBackground', 'fieldInvalidBorder']) {
    expect(p[role], `parent ${role}`).toBe('rgb(153, 27, 27)');
    expect(c[role], `child ${role}`).toBe('rgb(159, 18, 57)');
  }
  expect(c.surfaceRaised).toBe('rgb(254, 243, 199)');
  expect(c.cardBackground).toBe(c.surfaceRaised);
  for (const role of ['surface', 'surfaceOverlay', 'menuBackground', 'dialogBackground']) expect(c[role]).toBe('rgb(255, 255, 255)');
  expect(slot.buttonPrimaryBackground).toBe('rgb(22, 101, 52)');
  expect(slot.action).toBe(c.action);
  expect(slot.buttonPrimaryPressedBackground).toBe(c.action);
  expect((await actual(component, 'Component scope actual action')).background).toBe(c.action);
  expect((await actual(child, 'Child actual action')).background).toBe(c.action);
  expect(d.text).toBe('rgb(226, 232, 240)');
  expect(d.cardBackground).toBe('rgb(15, 23, 42)');
  expect(d.buttonPrimaryBackground).toBe(p.action);
  expect(d.fieldInvalidBorder).toBe(p.danger);
  expect(await geometry(parent)).toMatchObject({ height: 2.75, padding: 1 });
  expect(await geometry(child)).toMatchObject({ height: 2, padding: 0.75 });
  await info.attach('nested-computed-colors', { body: JSON.stringify({ p, c, slot, d }), contentType: 'application/json' });
});

test('live light dark system and density changes recompute all displayed aliases at inherited boundaries', async ({ page }, info) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await story(page, 'switching', info);
  const scope = page.getByTestId('switch-scope'), inherited = page.getByTestId('switch-inherited'), fixed = page.getByTestId('switch-fixed');
  const light = await colors(page.getByTestId('reference-light')), dark = await colors(page.getByTestId('reference-dark'));
  expect(light.buttonPrimaryBackground).toBe('rgb(29, 78, 216)');
  expect(dark.buttonPrimaryBackground).toBe('rgb(96, 165, 250)');
  expect(Object.keys(light)).toHaveLength(68);
  for (const theme of ['dark', 'light', 'system'] as const) {
    await page.getByRole('button', { name: `Use ${theme} theme`, exact: true }).click();
    await expect(scope).toHaveAttribute('data-sgui-theme', theme);
    for (const preference of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: preference });
      const expected = theme === 'dark' || (theme === 'system' && preference === 'dark') ? dark : light;
      await expect.poll(() => colors(scope)).toEqual(expected);
      await expect.poll(() => colors(inherited)).toEqual(expected);
      expect(await colors(fixed)).toEqual(dark);
      expect((await actual(scope, 'Switch actual action')).background).toBe(expected.action);
      for (const density of ['compact', 'comfortable'] as const) {
        await page.getByRole('button', { name: `Use ${density} density`, exact: true }).click();
        await expect(scope).toHaveAttribute('data-sgui-density', density);
        const dimensions = density === 'compact' ? { height: 2, padding: 0.75 } : { height: 2.75, padding: 1 };
        expect(await geometry(scope)).toMatchObject(dimensions);
        expect(await geometry(inherited)).toMatchObject(dimensions);
        expect(await geometry(fixed)).toMatchObject({ height: 2, padding: 0.75 });
        expect(await actual(inherited, 'Inherited actual action')).toMatchObject(dimensions);
        expect(await colors(scope)).toEqual(expected);
      }
    }
  }
});

test('Provider portal forwards host tier overrides while adjacent scope and layout remain isolated', async ({ page }, info) => {
  await story(page, 'portaled-scope', info);
  const owner = page.getByTestId('portal-owner'), adjacent = page.getByTestId('adjacent-host');
  const before = await colors(adjacent);
  await page.getByRole('button', { name: 'Open scoped token dialog', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Scoped token dialog', exact: true });
  await expect(dialog).toBeVisible();
  const content = page.getByTestId('portal-content');
  expect(await content.evaluate(element => Boolean(element.closest('[data-testid="portal-owner"]')))).toBe(false);
  const portal = dialog.locator('..');
  await expect(portal).toHaveAttribute('data-sgui-theme', 'dark');
  await expect(portal).toHaveAttribute('data-sgui-density', 'compact');
  expect(await portal.evaluate(element => (element as HTMLElement).style.width)).toBe('');
  const values = await colors(content);
  expect(values).toEqual(await colors(owner));
  expect(values.menuBackground).toBe('rgb(23, 37, 84)');
  expect(values.dialogBackground).toBe(values.menuBackground);
  expect(values.cardBackground).toBe('rgb(49, 46, 129)');
  expect(values.buttonPrimaryBackground).toBe('rgb(163, 230, 53)');
  expect(values.fieldInvalidBorder).toBe('rgb(253, 164, 175)');
  expect(await background(portal)).toBe(values.surface);
  expect(await actual(content, 'Portal actual action')).toMatchObject({ background: 'rgb(34, 211, 238)', height: 2, padding: 0.75 });
  expect(await geometry(content)).toMatchObject({ height: 2, padding: 0.75 });
  expect(await geometry(page.getByTestId('portal-comfortable'))).toMatchObject({ height: 2.75, padding: 1 });
  expect(await colors(adjacent)).toEqual(before);
  expect(before.buttonPrimaryBackground).toBe('rgb(146, 64, 14)');
  expect(before.dialogBackground).toBe('rgb(255, 247, 237)');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Open scoped token dialog', exact: true })).toBeFocused();
  expect(await colors(adjacent)).toEqual(before);
});

function luminance(color: string) {
  const channels = color.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
  expect(channels, `opaque computed sRGB: ${color}`).not.toBeNull();
  const linear = channels!.slice(1).map(value => {
    const n = Number(value) / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

test('declared default role pairs meet contrast thresholds using native computed colors', async ({ page }, info) => {
  await page.emulateMedia({ forcedColors: 'none' });
  await story(page, 'declared-pairs', info);
  const pairs: Array<[string, string, number]> = [];
  for (const surface of ['surface', 'surfaceRaised', 'surfaceOverlay']) for (const text of ['text', 'textMuted']) pairs.push([text, surface, 4.5]);
  for (const surface of ['surfaceSubtle', 'surfaceHover', 'surfacePressed']) pairs.push(['text', surface, 4.5]);
  pairs.push(['textSelected', 'surfaceSelected', 4.5], ['action', 'surface', 4.5], ['danger', 'surface', 4.5]);
  for (const [foreground, backgrounds] of [
    ['onAction', ['action', 'actionHover', 'actionPressed']],
    ['onActionNeutral', ['actionNeutral', 'actionNeutralHover', 'actionNeutralPressed']],
    ['onActionDestructive', ['actionDestructive', 'actionDestructiveHover', 'actionDestructivePressed']],
  ] as const) for (const background of backgrounds) pairs.push([foreground, background, 4.5]);
  for (const role of ['validationError', 'validationSuccess', 'validationWarning', 'validationInfo']) {
    pairs.push([role, 'surface', 4.5], [role, 'validationSurface', 4.5]);
  }
  pairs.push(['border', 'surface', 3], ['focus', 'surface', 3], ['borderSelected', 'surfaceSelected', 3],
    ['focusOnRaised', 'surfaceRaised', 3], ['focusOnOverlay', 'surfaceOverlay', 3]);
  for (const theme of ['light', 'dark']) {
    const values = await colors(page.getByTestId(`pairs-${theme}`));
    const results = pairs.map(([fg, bg, minimum]) => ({ fg, bg, minimum, ratio: contrast(values[fg], values[bg]) }));
    await info.attach(`${theme}-declared-computed-contrast`, { body: JSON.stringify({ values, results }), contentType: 'application/json' });
    for (const pair of results) expect(pair.ratio, `${theme} ${pair.fg}/${pair.bg}`).toBeGreaterThanOrEqual(pair.minimum);
  }
});

test('forced-color preference retains owned button boundaries and disabled readability', async ({ page }, info) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await story(page, 'declared-pairs', info);
  // Fail closed if this engine cannot emulate the requested preference; never
  // report a normal-color pass as forced-color evidence.
  expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(true);
  const nativeTab = process.platform === 'darwin' && info.project.name === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.keyboard.press(nativeTab);
  const focused = page.getByRole('button', { name: 'Forced colors light action', exact: true });
  await expect(focused).toBeFocused();
  await expect(focused).toHaveAttribute('data-focus-visible');
  const ring = await focused.evaluate(element => {
    const css = getComputedStyle(element);
    return { color: css.outlineColor, style: css.outlineStyle, width: css.outlineWidth, background: css.backgroundColor };
  });
  expect(ring.style).toBe('solid');
  expect(parseFloat(ring.width)).toBeGreaterThan(0);
  expect(ring.color).not.toBe(ring.background);
  await info.attach('emulated-forced-color-focus', { body: JSON.stringify(ring), contentType: 'application/json' });
  for (const theme of ['light', 'dark']) {
    const scope = page.getByTestId(`pairs-${theme}`);
    const enabled = scope.getByRole('button', { name: `Forced colors ${theme} action`, exact: true });
    const disabled = scope.getByRole('button', { name: `Forced colors ${theme} disabled`, exact: true });
    await expect(enabled).toBeEnabled();
    await expect(disabled).toBeDisabled();
    const styles = await disabled.evaluate(element => {
      const css = getComputedStyle(element);
      return { opacity: css.opacity, adjust: css.forcedColorAdjust, color: css.color, border: css.borderColor, borderWidth: css.borderWidth };
    });
    expect(styles.opacity).toBe('1');
    expect(styles.adjust).toBe('auto');
    expect(parseFloat(styles.borderWidth)).toBeGreaterThan(0);
    expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
    const boundary = await enabled.evaluate(element => {
      const css = getComputedStyle(element);
      return { border: css.borderColor, background: css.backgroundColor, width: css.borderWidth };
    });
    expect(parseFloat(boundary.width)).toBeGreaterThan(0);
    expect(boundary.border).not.toBe(boundary.background);
    await info.attach(`${theme}-emulated-forced-colors`, { body: JSON.stringify({ styles, boundary, physicalDevice: false }), contentType: 'application/json' });
  }
});
