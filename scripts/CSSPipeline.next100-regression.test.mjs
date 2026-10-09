import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import postcss from 'postcss';

const pipeline = pathToFileURL(resolve('scripts/css-modules.mjs')).href;
const buttonPath = 'experimental/Button/Button.module.css';
const fieldPath = 'experimental/TextField/TextField.module.css';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'sgui-css-next100-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const path of ['foundation/tokens.css', buttonPath, fieldPath]) {
    const target = join(root, 'src', path);
    await mkdir(resolve(target, '..'), { recursive: true });
    await writeFile(target, await readFile(join('src', path)));
  }
  await mkdir(join(root, 'dist'));
  await writeFile(join(root, 'package.json'), await readFile('package.json'));
  return root;
}
function compile(root) {
  execFileSync(process.execPath, ['--input-type=module', '-e',
    `const {compileStyles} = await import(${JSON.stringify(pipeline)}); await compileStyles();`], { cwd: root });
}
async function emitted(root) {
  const css = await readFile(join(root, 'dist/styles.css'), 'utf8');
  const maps = await Promise.all([buttonPath, fieldPath].map(async path => {
    const code = await readFile(join(root, 'dist', `${path}.js`), 'utf8');
    return JSON.parse(code.slice('export default '.length).trim().replace(/;$/, ''));
  }));
  return { css, maps };
}

test('emits real module maps with ordered layers, scoped normalization and logical token slots', async t => {
  const root = await fixture(t);
  compile(root);
  const { css, maps } = await emitted(root);
  const tree = postcss.parse(css);
  assert(css.startsWith(await readFile('src/foundation/tokens.css', 'utf8')));
  const layers = [];
  tree.walkAtRules('layer', rule => layers.push(rule.params));
  assert.deepEqual(layers, ['sgui.tokens, sgui.components', 'sgui.tokens', 'sgui.components', 'sgui.components']);
  assert.notEqual(maps[0].root, maps[1].root);
  for (const map of maps) for (const name of Object.values(map)) {
    assert.match(name, /^sgui_/);
    assert(css.includes(`.${name}`) || css.includes(`@keyframes ${name}`));
  }
  tree.walkRules(rule => assert(!/(^|[,\s])(body|html|:root|\*)(?=[\s,{.:#]|$)/.test(rule.selector), rule.selector));
  const button = tree.nodes.flatMap(node => node.nodes ?? []).find(node => node.selector === `.${maps[0].root}`);
  const declarations = Object.fromEntries(button.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value]));
  assert.equal(declarations['box-sizing'], 'border-box');
  assert.equal(declarations['padding-inline'], 'var(--sgui-control-padding)');
  assert.equal(declarations['min-block-size'], 'var(--sgui-control-height)');
  assert.equal(declarations.background, 'var(--sgui-action)');
  assert(!Object.keys(declarations).some(prop => /^(margin|padding)-(left|right)$/.test(prop)));
});

test('resolves the public stylesheet export and consumes generated ESM class assets', async t => {
  const root = await fixture(t);
  compile(root);
  await writeFile(join(root, 'consumer.mjs'), `
    import assert from 'node:assert/strict';
    import {readFile} from 'node:fs/promises';
    import button from './dist/${buttonPath}.js';
    const stylesheet = import.meta.resolve('@structured-growth/sg-ui/styles.css');
    assert.equal(stylesheet, new URL('./dist/styles.css', import.meta.url).href);
    assert((await readFile(new URL(stylesheet), 'utf8')).includes('.' + button.root));
  `);
  execFileSync(process.execPath, [join(root, 'consumer.mjs')], { cwd: root });
  const manifest = JSON.parse(await readFile('package.json', 'utf8'));
  assert(manifest.sideEffects.includes('./dist/**/*.css'));
});

test('repeated compilation is deterministic across roots and replaces stylesheet contents', async t => {
  const first = await fixture(t);
  const second = await fixture(t);
  compile(first);
  const original = await emitted(first);
  compile(first);
  assert.deepEqual(await emitted(first), original);
  compile(second);
  assert.deepEqual(await emitted(second), original);
  await writeFile(join(first, 'src', buttonPath), '@layer sgui.components { .replacement { padding-inline: var(--sgui-space2); } }');
  compile(first);
  const changed = await emitted(first);
  assert(!changed.css.includes(`.${original.maps[0].root}`));
  assert(changed.css.includes(`.${changed.maps[0].replacement}`));
  assert.deepEqual(await emitted(second), original);
});
