import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scopedName } from './css-modules.mjs';
import { resolve } from 'node:path';
import postcss from 'postcss';
import modules from 'postcss-modules';

test('module names are stable, namespaced and distinct between components', async () => {
  const a = resolve('src/experimental/Button/Button.module.css');
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
