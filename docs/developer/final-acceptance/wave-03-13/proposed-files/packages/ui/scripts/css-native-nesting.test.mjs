import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import postcss from 'postcss';
import modules from 'postcss-modules';
import { scopedName } from './css-modules.mjs';

test('production shallow nesting remains native and component scoped', async () => {
  const from = resolve('src/experimental/TextField/TextField.module.css');
  const source = await readFile(from, 'utf8');
  const ast = postcss.parse(source);
  const nested = [];
  ast.walkRules(rule => { if (rule.parent.type === 'rule') nested.push(rule); });
  assert.equal(nested.length, 1);
  assert.equal(nested[0].selector, '& > svg');
  assert.equal(nested[0].parent.selector, '.adornment');
  let classes;
  const result = await postcss([modules({ generateScopedName: scopedName, getJSON: (_file, value) => { classes = value; } })])
    .process(source, { from, map: false });
  assert(result.css.includes('& > svg'));
  assert(result.css.includes('.' + classes.adornment));
  assert(!result.css.includes('.adornment > svg'));
});
