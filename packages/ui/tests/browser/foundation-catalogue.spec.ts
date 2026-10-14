import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type tokenSourceShape from '../../src/foundation/tokens.json';

// Read production bytes without a runtime JSON import attribute dependency.
const tokenSource = JSON.parse(
  readFileSync(new URL('../../src/foundation/tokens.json', import.meta.url), 'utf8'),
) as typeof tokenSourceShape;

const prefix = 'foundations-foundation-catalogue--';
const stories = ['palettes', 'spacing', 'density', 'surfaces', 'keyboard-focus', 'motion-and-preferences'] as const;
type Theme = 'light' | 'dark';
type FixtureReceipt={id:string;status:string;autoplay:boolean;hasPlay:boolean;error?:string};
type PreviewWindow=Window & {__SGUI_FIXTURE__?:FixtureReceipt};

// Reuse the static fixture/manual-a11y and diagnostic contracts in display-preferences.spec.ts.
// There is no exported shared browser helper at this source head.
test.beforeEach(({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) errors.push(message.text());
  });
  (page as Page & { browserErrors?: string[] }).browserErrors = errors;
});
test.afterEach(({ page }) => {
  expect((page as Page & { browserErrors?: string[] }).browserErrors, 'browser runtime errors and warnings').toEqual([]);
});

async function story(page: Page, name: typeof stories[number], info: TestInfo, options: { theme?: Theme; play?: boolean } = {}) {
  const id = prefix + name;
  // Native cases disable authored actions so keyboard entry starts fresh.
  await page.goto(`/fixtures/?id=${id}${options.play ? '' : '&embed=true'}&globals=theme:${options.theme ?? 'light'};density:comfortable;a11y.manual:!true`);
  await expect(page.locator('#sgui-fixture-root')).not.toBeEmpty();
  await expect.poll(() => page.evaluate(fixtureId => {
    const result=(window as PreviewWindow).__SGUI_FIXTURE__;return result?.id===fixtureId&&result.status!=='loading';
  }, id), {message:`${id} must finish rendering, including authored actions when requested`}).toBe(true);
  const receipt=await page.evaluate(()=>(window as PreviewWindow).__SGUI_FIXTURE__!);
  await info.attach(`${name}-${options.play?'composed-play':'render'}-receipt`,{body:JSON.stringify(receipt),contentType:'application/json'});
  expect(receipt.status,JSON.stringify(receipt)).toBe('success');
  expect(receipt.autoplay).toBe(Boolean(options.play));
  expect(receipt.error).toBeUndefined();
  if(options.play)expect(receipt.hasPlay).toBe(true);
}

function themeScope(page: Page, theme: Theme) {
  // Select the explicit comparison scope, excluding the outer global Provider
  // and nested density scopes (all of which intentionally inherit a theme).
  return page.locator(`[data-sgui-scope][data-sgui-theme="${theme}"]`).filter({
    has: page.getByRole('heading', { name: `${theme} theme`, exact: true }),
  }).last();
}

function sourceValue(section:string,name:string,seen:string[]=[]):string|number {
  const key=section+'.'+name;
  if(seen.includes(key))throw new Error('Token reference cycle: '+[...seen,key].join(' -> '));
  const source=tokenSource as unknown as Record<string,Record<string,{$value:string|number}>>;
  const value=source[section]?.[name]?.$value;
  if(value===undefined)throw new Error('Missing token '+key);
  const reference=typeof value==='string'?/^\{([^.]+)\.([^}]+)\}$/.exec(value):null;
  return reference?sourceValue(reference[1],reference[2],[...seen,key]):value;
}

function color(theme: Theme, name: keyof typeof tokenSource.light) {
  const value = tokenSource[theme][name].$value;
  const reference = /^\{base\.(\w+)\}$/.exec(value);
  const baseToken = reference
    ? Object.entries(tokenSource.base).find(([key]) => key === reference[1])?.[1]
    : undefined;
  if (reference && baseToken?.$type !== 'color') {
    throw new Error(`${theme}.${name} must reference a base color token: ${value}`);
  }
  const hex = reference ? baseToken?.$value : value;
  // Base tokens also contain numeric scales and other non-color values. Fail
  // explicitly instead of coercing those values into the palette oracle.
  if (typeof hex !== 'string' || !/^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(hex)) {
    throw new Error(`${theme}.${name} must resolve to a six- or eight-digit hex color: ${String(hex)}`);
  }
  const channels = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
  return hex.length === 7 ? `rgb(${channels.join(', ')})` : `rgba(${channels.join(', ')}, ${Math.round(parseInt(hex.slice(7, 9), 16) / 255 * 1000) / 1000})`;
}

async function css(element: Locator) {
  return element.evaluate(node => {
    const style = getComputedStyle(node);
    return {
      background: style.backgroundColor, color: style.color, border: style.borderColor,
      padding: parseFloat(style.paddingInlineStart), minHeight: parseFloat(style.minBlockSize),
      height: node.getBoundingClientRect().height, radius: parseFloat(style.borderRadius),
      outline: style.outlineStyle, outlineWidth: parseFloat(style.outlineWidth),
      outlineOffset: parseFloat(style.outlineOffset), outlineColor: style.outlineColor,
      shadow: style.boxShadow, animation: style.animationName, transition: style.transitionDuration,
    };
  });
}

test('built catalogue IDs and production light/dark palette pairs resolve', async ({ page, request }, info) => {
  const response = await request.get('/fixtures/index.json');
  expect(response.ok()).toBe(true);
  const index = await response.json() as { entries: Record<string, { type: string; importPath: string }> };
  for (const name of stories) {
    expect(index.entries[prefix + name]).toMatchObject({ type: 'fixture', importPath: './scenarios/foundation/FoundationCatalogue.fixture.tsx' });
  }
  expect(index.entries['foundations-typefaces--defaults']?.type).toBe('fixture');
  await story(page, 'palettes', info);
  for (const theme of ['light', 'dark'] as const) {
    const scope = themeScope(page, theme);
    expect((await css(scope)).background).toBe(color(theme, 'surface'));
    // Representative swatches plus real foreground/background pairs; no pixel matrix.
    for (const name of ['surface', 'surfaceSubtle', 'action', 'onAction', 'border', 'focus'] as const) {
      const sample = scope.locator('[data-direction="column"]').filter({ has: page.getByText(name, { exact: true }) }).last();
      expect((await css(sample.locator('[aria-hidden="true"]'))).background).toBe(color(theme, name));
    }
    for (const [label, token] of [['Default text on surface', 'text'], ['Muted text on surface', 'textMuted'], ['Primary text on surface', 'action'], ['Danger text on surface', 'danger']] as const) {
      expect((await css(scope.getByText(label, { exact: true }))).color).toBe(color(theme, token));
    }
    const action = scope.getByRole('button', { name: 'Action / onAction', exact: true });
    const style = await css(action);
    expect(style.background).toBe(color(theme, 'action'));
    expect(style.color).toBe(color(theme, 'onAction'));
  }
});

test('shared spacing bars and surface padding follow host root text size', async ({ page }, info) => {
  await story(page, 'spacing', info);
  const baseRootSize = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
  for (const scale of [1, 2]) {
    // Host text scaling only; this does not claim browser-chrome zoom or device proof.
    if (scale === 2) await page.evaluate(size => { document.documentElement.style.fontSize = `${size * 2}px`; }, baseRootSize);
    for (const name of ['space1', 'space2', 'space3', 'space4'] as const) {
      const expected = parseFloat(String(sourceValue('shared',name))) * baseRootSize * scale;
      const bar = page.locator(`[data-spacing-bar="${name}"]`);
      expect(await bar.evaluate(node => node.getBoundingClientRect().width)).toBeCloseTo(expected, 2);
      const padding = page.locator('[data-variant="outlined"]').filter({ hasText: `Padding uses var(--sgui-${name})` });
      expect((await css(padding)).padding).toBeCloseTo(expected, 2);
    }
  }
});

test('compact and comfortable controls render production dimensions in both themes', async ({ page }, info) => {
  await story(page, 'density', info);
  const rootSize = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
  for (const theme of ['light', 'dark'] as const) {
    const scope = themeScope(page, theme);
    for (const density of ['compact', 'comfortable'] as const) {
      const action = scope.getByRole('button', { name: `${density} primary`, exact: true });
      const style = await css(action);
      const paddingToken = density === 'compact' ? 'space3' : 'space4';
      expect(style.minHeight).toBeCloseTo(parseFloat(String(sourceValue(density,'controlHeight'))) * rootSize, 2);
      expect(style.height).toBeCloseTo(style.minHeight, 2);
      expect(style.padding).toBeCloseTo(parseFloat(String(sourceValue('shared',paddingToken))) * rootSize, 2);
      expect(style.background).toBe(color(theme, 'action'));
      await expect(scope.getByRole('button', { name: `${density} disabled`, exact: true })).toBeDisabled();
    }
  }
});

test('representative outlined and raised surfaces use production theme treatments', async ({ page }, info) => {
  await story(page, 'surfaces', info);
  for (const theme of ['light', 'dark'] as const) {
    const scope = themeScope(page, theme);
    for (const [tone, variant] of [['default', 'outlined'], ['subtle', 'raised']] as const) {
      const surface = scope.locator(`[data-tone="${tone}"][data-variant="${variant}"]`);
      await expect(surface.getByRole('heading', { name: `${tone} / ${variant}`, exact: true })).toBeVisible();
      const style = await css(surface);
      expect(style.background).toBe(color(theme, tone === 'default' ? 'surface' : 'surfaceSubtle'));
      expect(style.color).toBe(color(theme, 'text'));
      expect(style.radius).toBeGreaterThan(0);
      if (variant === 'outlined') expect(style.border).toBe(color(theme, 'divider'));
      else expect(style.shadow).not.toBe('none');
    }
  }
});

async function nativeFocus(action: Locator, theme: Theme) {
  await expect(action).toBeFocused();
  await expect(action).toHaveAttribute('data-focus-visible');
  expect(await action.evaluate(node => node.matches(':focus-visible'))).toBe(true);
  const style = await css(action);
  const rootSize = await action.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
  expect(style.outline).toBe('solid');
  expect(style.outlineWidth).toBeCloseTo(parseFloat(String(sourceValue('shared','focusWidth'))) * rootSize, 2);
  expect(style.outlineOffset).toBeCloseTo(parseFloat(String(sourceValue('shared','focusOffset'))) * rootSize, 2);
  expect(style.outlineColor).toBe(color(theme, 'focus'));
  // Observe native focus scrolling/hit testing, without focus(), scrollIntoView or CSS repair.
  await expect.poll(() => action.evaluate(node => {
    const bounds = node.getBoundingClientRect();
    const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
    return bounds.width > 0 && bounds.height > 0 && bounds.left >= 0 && bounds.top >= 0
      && bounds.right <= innerWidth && bounds.bottom <= innerHeight && Boolean(hit && (hit === node || node.contains(hit)));
  })).toBe(true);
}

for (const theme of ['light', 'dark'] as const) {
  test(`${theme}: native keyboard entry, activation, disabled skipping and reverse focus`, async ({ page }, info) => {
    await story(page, 'keyboard-focus', info, { theme });
    const primary = page.getByRole('button', { name: 'Primary focus action', exact: true });
    const neutral = page.getByRole('button', { name: 'Neutral focus action', exact: true });
    const text = page.getByRole('button', { name: 'Text focus action', exact: true });
    const status = page.getByRole('status');
    await expect(status).toHaveText('Activations: 0');
    // The document starts fresh; no authored play or programmatic focus seeds entry.
    const tab = process.platform === 'darwin' && info.project.name === 'webkit' ? 'Alt+Tab' : 'Tab';
    await page.keyboard.press(tab);
    await nativeFocus(primary, theme);
    await page.keyboard.press('Enter');
    await expect(status).toHaveText('Activations: 1');
    await page.keyboard.press(tab);
    await nativeFocus(neutral, theme);
    await page.keyboard.press('Space');
    await expect(status).toHaveText('Activations: 2');
    await expect(page.getByRole('button', { name: 'Disabled focus action', exact: true })).toBeDisabled();
    await page.keyboard.press(tab);
    await nativeFocus(text, theme);
    await page.keyboard.press(tab === 'Tab' ? 'Shift+Tab' : 'Shift+Alt+Tab');
    await nativeFocus(neutral, theme);
    await expect(status).toHaveText('Activations: 2');
  });
}

test('browser preference emulation stops real production motion and retains progress semantics', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await story(page, 'motion-and-preferences', info);
  const button = page.getByRole('button', { name: 'Hover or press action', exact: true });
  const pending = page.getByRole('button', { name: 'Pending action', exact: true });
  const spinner = pending.getByRole('progressbar', { name: 'Pending', exact: true });
  const linear = page.getByRole('progressbar', { name: 'Indeterminate linear work', exact: true });
  const fill = linear.locator('span[aria-hidden="true"] > span');
  const circular = page.getByRole('progressbar', { name: 'Indeterminate circular work', exact: true });
  const determinate = page.getByRole('progressbar', { name: 'Determinate work', exact: true });
  for (const preference of ['no-preference', 'reduce'] as const) {
    await page.emulateMedia({ reducedMotion: preference });
    const reduced = preference === 'reduce';
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(reduced);
    const motion = { button: await css(button), spinner: await css(spinner), linear: await css(fill), circular: await css(circular.locator('svg')) };
    await info.attach(`browser-emulated-${preference}`, { body: JSON.stringify({ engine: info.project.name, preference, physicalDeviceProof: false, motion }), contentType: 'application/json' });
    expect(parseFloat(motion.button.transition)).toBe(reduced ? 0 : parseFloat(String(sourceValue('shared','motionDuration'))) / 1000);
    for (const animated of [motion.spinner, motion.linear, motion.circular]) {
      if (reduced) expect(animated.animation).toBe('none');
      else expect(animated.animation).not.toBe('none');
    }
    if (reduced) {
      expect(await fill.evaluate(node => getComputedStyle(node).transform)).toBe('none');
      expect(await fill.evaluate(node => node.getBoundingClientRect().width / node.parentElement!.getBoundingClientRect().width)).toBeCloseTo(1, 3);
    }
    await expect(pending).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByRole('button', { name: 'Unavailable action', exact: true })).toBeDisabled();
    await expect(linear).not.toHaveAttribute('aria-valuenow');
    await expect(circular).not.toHaveAttribute('aria-valuenow');
    await expect(determinate).toHaveAttribute('aria-valuenow', '40');
    await expect(determinate).toHaveAttribute('aria-valuetext', '40 of 100');
  }
});

// Authored userEvent plays are composed interaction evidence, distinct from the
// fresh-document browser keyboard and media-preference cases above.
for (const name of ['spacing', 'density', 'keyboard-focus', 'motion-and-preferences'] as const) {
  test(`authored composed play completes: ${name}`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await story(page, name, info, { play: true });
    if (name === 'keyboard-focus') await expect(page.getByRole('status')).toHaveText('Activations: 1');
  });
}
