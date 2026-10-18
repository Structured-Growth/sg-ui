import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scopedName } from './css-modules.mjs';
import { resolve } from 'node:path';
import postcss from 'postcss';
import modules from 'postcss-modules';

test('module names are stable, namespaced and distinct between components', async () => {
  const a = resolve('src/components/Button/Button.module.css');
  const b = resolve('src/experimental/TextField/TextField.module.css');
  assert.equal(scopedName('root', a), scopedName('root', a));
  assert.notEqual(scopedName('root', a), scopedName('root', b));
  let classes;
  const result = await postcss([modules({ generateScopedName: scopedName, getJSON: (_file, value) => { classes = value; } })])
    .process('@layer sgui.components { .root { color: red; } }', { from: a, map: false });
  assert.equal(classes.root, scopedName('root', a));
  assert(result.css.includes(`.${classes.root}`));
  assert(result.css.includes('@layer sgui.components'));
});


test('shallow native nesting retains scoped parent/child and an equivalent flat baseline', async () => {
  let classes;
  const result = await postcss([modules({ generateScopedName: scopedName, getJSON: (_file, value) => { classes = value; } })])
    .process('@layer sgui.components { .adornment > svg { inline-size: 100%; block-size: 100%; } .adornment { & > svg { inline-size: 100%; block-size: 100%; } } .owner { & > .child { display: block; } } }', { from: resolve('src/experimental/TextField/TextField.module.css'), map: false });
  const ast = postcss.parse(result.css);
  const found = new Map();
  ast.walkRules(rule => found.set(rule.selector, rule));
  assert(found.has(`.${classes.adornment} > svg`));
  const nested = found.get('& > svg');
  assert.equal(nested.parent.selector, `.${classes.adornment}`);
  const declarations = rule => rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value]);
  assert.deepEqual(declarations(nested), declarations(found.get(`.${classes.adornment} > svg`)));
  assert(found.has(`& > .${classes.child}`));
});
