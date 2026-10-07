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
      ['text', 'surfaceSubtle', 4.5], ['action', 'surface', 4.5],
      ['onAction', 'action', 4.5], ['onAction', 'actionHover', 4.5],
      ['danger', 'surface', 4.5], ['focus', 'surface', 3], ['border', 'surface', 3],
    ]) {
      const a = color(source[mode][foreground].$value), b = color(source[mode][background].$value);
      assert((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= minimum, `${mode}: ${foreground}/${background}`);
    }
  }
});
