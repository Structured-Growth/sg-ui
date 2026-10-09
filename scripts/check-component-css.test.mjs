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

test('percentage and dimension math offsets fail; unitless token arithmetic passes', () => {
  for (const value of ['calc(var(--sgui-body-size) + 10%)', 'min(var(--sgui-body-size), 100%)', 'max(1%, var(--sgui-body-size))', 'clamp(10%, var(--sgui-body-size), 20%)', 'calc(var(--sgui-body-size) * (1 + 5%))', 'calc(var(--sgui-body-size) + 0.1em)']) {
    assert(check(layer(`.root { font-size: ${value}; }`)).some(e => e.includes('Ad hoc typography')), value);
  }
  for (const value of ['calc(var(--sgui-body-size) * 1.25)', 'calc(var(--sgui-body-size) / 2)', 'min(var(--sgui-body-size), var(--sgui-body-size))', 'clamp(var(--sgui-body-size), calc(var(--sgui-body-size) * 1.5), var(--sgui-body-size))']) {
    assert.deepEqual(check(layer(`.root { font-size: ${value}; }`)), [], value);
  }
});

test('quoted attribute data is inert but actual retired identifiers still fail', () => {
  for (const selector of ['.root [title=".MuiButton-root"]', ".root [title='.css-abc .jss-12 data-emotion']", '.root [data-note="data-emotion"]', '.root [title="escaped \\" .MuiButton-root"]', '.root [data-emotional="cache"]']) {
    assert.deepEqual(check(layer(`${selector} { color: red; }`)), [], selector);
  }
  for (const selector of ['.root [data-emotion]', '.root [data-emotion~="cache"]', '.root [title="safe"] .MuiButton-root', '.root :is(.css-abc, .jss-12)', '.root [title=".MuiButton-root"] .css-abc']) {
    assert(check(layer(`${selector} { color: red; }`)).some(e => e.includes('Retired foundation selector')), selector);
  }
  assert(check(layer('[title=".root .MuiButton-root"] { color: red; }')).some(e => e.includes('Unscoped')));
});

const richDocumentPath = 'src/components/PageRichTextEditorSection/PageRichTextEditorSection.module.css';
const semanticCheck = code => validateComponentCss(code, { path: richDocumentPath, variables });
test('only exact shared rich-document semantic declarations have a literal contract', () => {
  for (const [selector, declaration] of [
    ['.document :global(.editor-text-bold)', 'font-weight: 700'],
    ['.document :global(.editor-text-subscript)', 'font-size: 0.75em'],
    ['.document :global(.editor-text-superscript)', 'font-size: 0.75em'],
  ]) {
    const rule = `${selector} { ${declaration}; }`;
    assert.deepEqual(semanticCheck(layer(rule)), []);
    assert(check(layer(rule)).some(e => e.includes('Ad hoc typography')), 'other file');
    for (const altered of [rule.replace(selector, `.other ${selector}`), rule.replace(selector, `${selector}, .other`), rule.replace(declaration, 'font-weight: 800'), rule.replace(declaration, 'font-size: 0.8em'), rule.replace(declaration, 'line-height: 1.5')]) {
      assert(semanticCheck(layer(altered)).some(e => e.includes('Ad hoc typography')), altered);
    }
    assert(semanticCheck(rule).some(e => e.includes('Unlayered')));
    assert(semanticCheck(layer(`${selector} { ${declaration}; color: var(--sgui-unknown); }`)).some(e => e.includes('Unknown token')));
    assert(semanticCheck(layer(`${selector} { ${declaration}; font-family: Arial; }`)).some(e => e.includes('Ad hoc typography')));
  }
});
