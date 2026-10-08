import assert from 'node:assert/strict';
import test from 'node:test';
import { validateComponentCss } from './check-component-css.mjs';
const variables = new Set(['--sgui-font-family', '--sgui-body-size', '--sgui-body-weight', '--sgui-body-line-height']);
const check = code => validateComponentCss(code, { path: 'fixture.module.css', variables });
const layer = code => `@layer sgui.components { ${code} }`;

test('owned layers, local descendants, variable math, inheritance and forced colors pass', () => {
  assert.deepEqual(check(layer(`
    .root, .other:hover { font-family: var(--sgui-font-family); font-size: calc(var(--sgui-body-size) * 1.25); font-weight: var(--sgui-body-weight); line-height: var(--sgui-body-line-height); }
    .root :global(.editor-link), .root > p, :local(.root) input { font: inherit /* deliberate */; }
    .root :is(button, input) { line-height: unset; }
    .root { &:hover { font-size: revert-layer; } }
    @media (forced-colors: active) { .root { color: CanvasText; border-color: Highlight; } }
    @keyframes spin { from { opacity: 0; } to { opacity: 1; } }
  `)), []);
});

test('every selector branch must be local; global wrappers and negative pseudos are not anchors', () => {
  for (const selector of ['button', '*', '[data-selected]', ':global(.editor-link)', ':global .leak', '.safe, input', ':not(.root)', ':is(.root, button)', ':has(.root)', ':global(:is(.leak))', '/* .fake */ button']) {
    assert(check(layer(`${selector} { color: red; }`)).some(e => e.includes('Unscoped component selector')), selector);
  }
  assert.deepEqual(check(layer('.root :global .editor-link { color: red; }')), []);
});

test('host and retired selectors fail even underneath a local anchor', () => {
  for (const selector of ['body', 'html.root', '.root:root', '.root :global(body)', ':is(html, .root)', '.root .MuiButton-root', '.root .css-abc', '.root .jss-12', '.root [data-emotion="cache"]']) {
    assert(check(layer(`${selector} { color: red; }`)).some(e => /Global host selector|Retired foundation selector/.test(e)), selector);
  }
  assert.deepEqual(check(layer('.root [title="body, html, .class"] { color: red; }')), []);
});

test('layer and token checks remain enforced, including whitespace before token names', () => {
  assert(check('.root { color: red; }').some(e => e.includes('Unlayered')));
  assert(check('@layer other { .root { color: red; } }').some(e => e.includes('Unlayered')));
  assert(check(layer('.root { color: var( --sgui-unknown); }')).some(e => e.includes('Unknown token')));
  assert(check('@keyframes spin { to { opacity: 1; } }').some(e => e.includes('Unlayered')));
});

test('typography literals, shorthand, token fallback and token decoration fail', () => {
  for (const declaration of ['font-family: Arial', 'font-size: 14px', 'font-weight: 700', 'line-height: 1.5', 'font: 14px Arial', 'font-size: var(--host-size)', 'font-size: var(--sgui-body-size, 14px)', 'font-family: var(--sgui-font-family), Arial', 'font-size: calc(var(--sgui-body-size) + 2px)', 'font-weight: normal', 'font-size: initial']) {
    assert(check(layer(`.root { ${declaration}; }`)).some(e => e.includes('Ad hoc typography')), declaration);
  }
  for (const keyword of ['inherit', 'unset', 'revert', 'revert-layer']) assert.deepEqual(check(layer(`.root { font: ${keyword}; }`)), []);
});

test('comments are inert; diagnostics retain exact source locations and all violations', () => {
  const errors = check('@layer sgui.components {\n/* body { font-size: 12px; } */\nbutton { font-size: 12px; line-height: 2; }\n}');
  assert.equal(errors.length, 3);
  assert(errors.every(e => e.startsWith('fixture.module.css:3:')));
  assert.deepEqual(check(layer('.root /* .MuiButton body */ { font-size: var(--sgui-body-size) /* var(--sgui-unknown) */; }')), []);
  assert.throws(() => check('.root {'), /Unclosed block/);
});
