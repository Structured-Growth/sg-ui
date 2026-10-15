import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compileTokens, generateTokens } from './tokens.mjs';

const source = JSON.parse(await readFile(new URL('../src/foundation/tokens.json', import.meta.url), 'utf8'));

test('generated files match the source', async () => {
  await generateTokens({ check: true });
});
test('rejects missing references, cycles, invalid dimensions, type mismatch and unpaired themes', () => {
  for (const [edit, message] of [
    [value => { value.light.text.$value = '{base.missing}'; }, /Unknown token/],
    [value => { value.base.white.$value = '{light.surface}'; }, /Token cycle/],
    [value => { value.shared.space1.$value = '4px'; }, /Invalid token/],
    [value => { value.shared.space1.$value = '{base.white}'; }, /Alias type mismatch/],
    [value => { delete value.dark.focus; }, /Unpaired/],
  ]) {
    const copy = structuredClone(source);
    edit(copy);
    assert.throws(() => compileTokens(copy), message);
  }
});

function color(value) {
  const alias = /^\{(.+)\}$/.exec(value);
  if (alias) { const [group, key] = alias[1].split('.'); return color(source[group][key].$value); }
  const channels = value.slice(1).match(/../g).map(channel => Number.parseInt(channel, 16) / 255);
  const [r, g, b] = channels.map(channel => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
test('proof text, action, error and focus combinations meet declared contrast thresholds', () => {
  for (const mode of ['light', 'dark']) {
    for (const [foreground, background, minimum] of [
      ['text', 'surface', 4.5], ['textMuted', 'surface', 4.5],
      ...['surface','surfaceSubtle','surfaceRaised','surfaceOverlay'].map(bg => ['textSubtle', bg, 4.5]),
      ['text', 'surfaceSubtle', 4.5], ['action', 'surface', 4.5],
      ['onAction', 'action', 4.5], ['onAction', 'actionHover', 4.5],
      ['danger', 'surface', 4.5], ['focus', 'surface', 3], ['border', 'surface', 3],
      ['text', 'surfaceRaised', 4.5], ['text', 'surfaceOverlay', 4.5],
      ['textMuted', 'surfaceRaised', 4.5], ['textMuted', 'surfaceOverlay', 4.5],
      ['text', 'surfaceHover', 4.5], ['text', 'surfacePressed', 4.5],
      ['textSelected', 'surfaceSelected', 4.5], ['borderSelected', 'surfaceSelected', 3],
      ...['action', 'actionHover', 'actionPressed'].map(bg => ['onAction', bg, 4.5]),
      ...['actionNeutral', 'actionNeutralHover', 'actionNeutralPressed'].map(bg => ['onActionNeutral', bg, 4.5]),
      ...['actionDestructive', 'actionDestructiveHover', 'actionDestructivePressed'].map(bg => ['onActionDestructive', bg, 4.5]),
      ...['validationError', 'validationSuccess', 'validationWarning', 'validationInfo'].flatMap(fg => [[fg, 'surface', 4.5], [fg, 'validationSurface', 4.5]]),
      ['focusOnRaised', 'surfaceRaised', 3], ['focusOnOverlay', 'surfaceOverlay', 3],
    ]) {
      const a = color(source[mode][foreground].$value), b = color(source[mode][background].$value);
      assert((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= minimum, `${mode}: ${foreground}/${background}`);
    }
  }
});


test('generation is deterministic and emits typed component and semantic tiers', () => {
  const first = compileTokens(source);
  assert.deepEqual(compileTokens(JSON.parse(JSON.stringify(source))), first);
  assert.match(first.ts, /export type ComponentTokenName = typeof tokenTiers.component\[number\]/);
  assert.match(first.ts, /export type SemanticTokenName = typeof tokenTiers.semantic\[number\]/);
  assert.match(first.ts, /export const componentTokenReferences/);
  for (const key of Object.keys(source.component)) assert(first.ts.includes(`"${key}": "var(--sgui-`));
});

test('public component metadata names the same scoped dependency that CSS consumes', () => {
  const generated=compileTokens(source);
  const references=JSON.parse(generated.ts.match(/export const componentTokenReferences = ([\s\S]+?) as const;/)[1]);
  assert.deepEqual(Object.keys(references),Object.keys(source.component));
  for(const [key,token] of Object.entries(source.component)) {
    const [,group,target]=token.$value.match(/^\{([^.]+)\.([^}]+)\}$/);
    assert.deepEqual(references[key],{tier:({light:'semantic',shared:'shared',compact:'density',pointer:'interaction',component:'component'})[group],token:target});
    const cssName=name=>`--sgui-${name.replace(/[A-Z]/g,letter=>`-${letter.toLowerCase()}`)}`;
    assert(generated.css.includes(`${cssName(key)}: var(${cssName(target)})`),key);
  }
});

test('rejects unknown groups, malformed records and tier direction/type/parity violations', () => {
  for (const [edit, message] of [
    [s => { s.unemitted = {}; }, /Unknown token group/],
    [s => { delete s.component; }, /Missing token group/],
    [s => { s.component.cardBackground = null; }, /Invalid token record/],
    [s => { s.component.cardBackground.$value = '#ffffff'; }, /must alias/],
    [s => { s.light.surface.$value = '#ffffff'; }, /must alias/],
    [s => { s.shared.space1.$value = '0.25rem'; }, /must alias/],
    [s => { s.compact.controlHeight.$value = '2rem'; }, /must alias/],
    [s => { s.component.cardBackground.$value = '{base.white}'; }, /Invalid tier alias/],
    [s => { s.light.surface.$value = '{dark.surface}'; }, /Invalid tier alias/],
    [s => { s.component.cardBackground.$value = '{dark.surface}'; }, /Invalid tier alias/],
    [s => { s.component.buttonHeight.$value = '{comfortable.controlHeight}'; }, /Invalid tier alias/],
    [s => { s.shared.space1.$value = '{compact.controlHeight}'; }, /Invalid tier alias/],
    [s => { s.base.white.$value = '{dark.action}'; }, /Invalid tier alias/],
    [s => { s.component.cardBackground.$value = '{component.cardBackground}'; }, /Token cycle/],
    [s => { s.component.cardBackground.$value = '{shared.space1}'; }, /Alias type mismatch/],
    [s => { s.dark.surfaceRaised.$value = '{dark.surfaceSubtle}'; }, /Unpaired semantic alias/],
    [s => { s.dark.text = { $type: 'number', $value: 1 }; }, /Unpaired token types/],
    [s => { s.component.text = { $type: 'color', $value: '{light.text}' }; }, /Duplicate emitted token/],
    [s => { delete s.comfortable.controlPadding; }, /Unpaired/],
  ]) {
    const copy = structuredClone(source);
    edit(copy);
    assert.throws(() => compileTokens(copy), message);
  }
});

const cssName = key => `--sgui-${key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`;
const blocks = css => [...css.matchAll(/:where\(([^)]+)\) \{([^}]+)\}/g)].map(([, selector, body]) => ({ selector, values: Object.fromEntries([...body.matchAll(/(--sgui-[\w-]+): ([^;]+);/g)].map(([, k, v]) => [k, v])) }));

test('emitted component relationships rebind at scope, theme/system and density boundaries', () => {
  const emitted = blocks(compileTokens(source).css);
  assert.equal(emitted.length, 9);
  for (const { values } of emitted.slice(0,6)) {
    for (const [key, token] of Object.entries(source.component)) {
      const target = token.$value.slice(1, -1).split('.')[1];
      assert.equal(values[cssName(key)], `var(${cssName(target)})`);
    }
  }
  for (const { values } of emitted.slice(0,6)) {
    assert.equal(values['--sgui-surface-raised'], 'var(--sgui-surface)');
    assert.equal(values['--sgui-action-destructive'], 'var(--sgui-danger)');
  }
  assert.equal(emitted[2].values['--sgui-action'], '#60a5fa');
  assert.equal(emitted[3].values['--sgui-action'], '#60a5fa');
  assert.equal(emitted[4].values['--sgui-control-height'], 'var(--sgui-compact-control-height)');
  assert.equal(emitted[5].values['--sgui-control-height'], 'var(--sgui-comfortable-control-height)');
  // A local host semantic override is referenced, never flattened into the component.
  assert.equal(emitted[0].values['--sgui-button-primary-background'], 'var(--sgui-action)');
});

test('palette/scale owns deduplicated shared values; component tier contains aliases only', () => {
  const literals = Object.values(source.base).map(t => JSON.stringify([t.$type, t.$value]));
  assert.equal(new Set(literals).size, literals.length);
  for (const token of Object.values(source.shared)) assert.match(token.$value, /^\{base\./);
  for (const token of Object.values(source.component)) assert.match(token.$value, /^\{(light|shared|compact|pointer|component)\./);
});

// Literal snapshot before D-02/D-04: every existing scoped declaration stays unchanged.
const legacyDeclarations = [
  {
    "--sgui-font-family": "\"Geist\", \"Geist Fallback\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    "--sgui-body-size": "1rem",
    "--sgui-label-size": "0.875rem",
    "--sgui-body-line-height": "1.6",
    "--sgui-label-line-height": "1.45",
    "--sgui-label-weight": "500",
    "--sgui-action-weight": "600",
    "--sgui-space1": "0.25rem",
    "--sgui-space2": "0.5rem",
    "--sgui-space3": "0.75rem",
    "--sgui-space4": "1rem",
    "--sgui-control-radius": "0.625rem",
    "--sgui-field-radius": "0.375rem",
    "--sgui-focus-width": "0.125rem",
    "--sgui-focus-offset": "0.125rem",
    "--sgui-motion-duration": "120ms",
    "--sgui-heading-size": "1.25rem",
    "--sgui-heading-line-height": "1.4",
    "--sgui-overlay-layer": "1400",
    "--sgui-popover-layer": "1410",
    "--sgui-overlay-shadow": "0rem 1rem 3rem #00000040",
    "--sgui-h1-size": "2.5rem",
    "--sgui-h1-line-height": "1.2",
    "--sgui-h1-weight": "700",
    "--sgui-h2-size": "2rem",
    "--sgui-h2-line-height": "1.25",
    "--sgui-h2-weight": "700",
    "--sgui-h3-size": "1.75rem",
    "--sgui-h3-line-height": "1.3",
    "--sgui-h3-weight": "600",
    "--sgui-h4-size": "1.5rem",
    "--sgui-h4-line-height": "1.35",
    "--sgui-h4-weight": "600",
    "--sgui-h5-size": "1.25rem",
    "--sgui-h5-line-height": "1.4",
    "--sgui-h5-weight": "600",
    "--sgui-h6-size": "1.125rem",
    "--sgui-h6-line-height": "1.45",
    "--sgui-h6-weight": "600",
    "--sgui-body1-size": "1rem",
    "--sgui-body1-line-height": "1.6",
    "--sgui-body1-weight": "400",
    "--sgui-body2-size": "0.875rem",
    "--sgui-body2-line-height": "1.55",
    "--sgui-body2-weight": "400",
    "--sgui-body-alt2-size": "0.875rem",
    "--sgui-body-alt2-line-height": "1.45",
    "--sgui-body-alt2-weight": "500",
    "--sgui-subtitle1-size": "1rem",
    "--sgui-subtitle1-line-height": "1.5",
    "--sgui-subtitle1-weight": "500",
    "--sgui-subtitle2-size": "0.875rem",
    "--sgui-subtitle2-line-height": "1.45",
    "--sgui-subtitle2-weight": "600",
    "--sgui-caption-size": "0.75rem",
    "--sgui-caption-line-height": "1.4",
    "--sgui-caption-weight": "400",
    "--sgui-overline-size": "0.75rem",
    "--sgui-overline-line-height": "1.4",
    "--sgui-overline-weight": "600",
    "--sgui-button-size": "0.875rem",
    "--sgui-button-line-height": "1.45",
    "--sgui-button-weight": "600",
    "--sgui-code-size": "0.875rem",
    "--sgui-code-line-height": "1.5",
    "--sgui-code-weight": "400",
    "--sgui-code-font-family": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
  },
  {
    "--sgui-surface": "#ffffff",
    "--sgui-surface-subtle": "#f8fafc",
    "--sgui-text": "#0f172a",
    "--sgui-text-muted": "#475569",
    "--sgui-border": "#475569",
    "--sgui-divider": "#cbd5e1",
    "--sgui-action": "#1d4ed8",
    "--sgui-action-hover": "#1e40af",
    "--sgui-on-action": "#ffffff",
    "--sgui-danger": "#b91c1c",
    "--sgui-focus": "#1d4ed8",
    "--sgui-backdrop": "#0f172a80"
  },
  {
    "--sgui-surface": "#0f172a",
    "--sgui-surface-subtle": "#1e293b",
    "--sgui-text": "#e2e8f0",
    "--sgui-text-muted": "#cbd5e1",
    "--sgui-border": "#cbd5e1",
    "--sgui-divider": "#475569",
    "--sgui-action": "#60a5fa",
    "--sgui-action-hover": "#93c5fd",
    "--sgui-on-action": "#0f172a",
    "--sgui-danger": "#f87171",
    "--sgui-focus": "#60a5fa",
    "--sgui-backdrop": "#000000b3"
  },
  {
    "--sgui-surface": "#0f172a",
    "--sgui-surface-subtle": "#1e293b",
    "--sgui-text": "#e2e8f0",
    "--sgui-text-muted": "#cbd5e1",
    "--sgui-border": "#cbd5e1",
    "--sgui-divider": "#475569",
    "--sgui-action": "#60a5fa",
    "--sgui-action-hover": "#93c5fd",
    "--sgui-on-action": "#0f172a",
    "--sgui-danger": "#f87171",
    "--sgui-focus": "#60a5fa",
    "--sgui-backdrop": "#000000b3"
  },
  {
    "--sgui-control-height": "2rem",
    "--sgui-control-padding": "0.75rem"
  },
  {
    "--sgui-control-height": "2.75rem",
    "--sgui-control-padding": "1rem"
  }
];

test('preserves legacy resolved defaults and nesting selectors', () => {
  const emitted = blocks(compileTokens(source).css);
  assert.deepEqual(emitted.map(b => b.selector), [
    '[data-sgui-scope]', '[data-sgui-theme="light"], [data-sgui-theme="system"]',
    '[data-sgui-theme="dark"]', '[data-sgui-theme="system"]',
    '[data-sgui-density="compact"]', '[data-sgui-density="comfortable"]',
    '[data-sgui-interaction="pointer"]', '[data-sgui-interaction="touch"]', '[data-sgui-interaction="auto"]',
  ]);
  assert(legacyDeclarations.every(d => Object.keys(d).length > 0));
  for (const [i, declarations] of legacyDeclarations.entries()) {
    const values={...emitted[0].values,...emitted[i].values};
    const resolve=value=>/^var\((--sgui-[\w-]+)\)$/.test(value)?resolve(values[value.slice(4,-1)]):value;
    for (const [key, value] of Object.entries(declarations)) assert.equal(resolve(values[key]), value, `${i}: ${key}`);
  }
});


test('public default theme snapshots are generated from the shipped shared and semantic source',()=>{
  const {ts}=compileTokens(source);
  const match=ts.match(/export const defaultThemeTokens = ([\s\S]*?) as const;/);
  assert.ok(match);
  const defaults=JSON.parse(match[1]);
  const resolveValue=value=>{const alias=/^\{(.+)\}$/.exec(String(value));if(!alias)return value;const [group,key]=alias[1].split('.');return resolveValue(source[group][key].$value);};
  for(const mode of ['light','dark']) {
    const expected=Object.fromEntries(['shared',mode].flatMap(group=>Object.entries(source[group]).map(([key,token])=>[`--sgui-${key.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase())}`,resolveValue(token.$value)])));
    assert.deepEqual(defaults[mode],expected);
    for(const role of ['action','action-neutral','validation-error','validation-warning','validation-success','validation-info','focus'])assert.match(defaults[mode][`--sgui-${role}`],/^#[0-9a-f]{6}$/i);
    assert.equal(defaults[mode]['--sgui-control-height'],undefined,'density remains scope-owned');
    assert.equal(defaults[mode]['--sgui-button-primary-background'],undefined,'component aliases remain scope-owned');
  }
});


test('interaction roles are paired, theme-backed and independently scoped from density',()=>{
  const output=compileTokens(source), emitted=blocks(output.css);
  assert.match(output.ts,/export type InteractionTokenName/);
  assert.equal(emitted[6].values['--sgui-minimum-target-size'],'var(--sgui-pointer-target-size)');
  for(const index of [7,8]) {
    assert.equal(emitted[index].values['--sgui-minimum-target-size'],'var(--sgui-touch-target-size)');
    assert.equal(emitted[index].values['--sgui-navigation-icon-size'],'var(--sgui-touch-navigation-icon-size)');
  }
  assert.match(output.css,/@media \(any-pointer: coarse\)/);
  assert(!('minimumTargetSize' in source.compact));
  const invalid=structuredClone(source);delete invalid.touch.navigationIconSize;
  assert.throws(()=>compileTokens(invalid),/Unpaired/);
});
