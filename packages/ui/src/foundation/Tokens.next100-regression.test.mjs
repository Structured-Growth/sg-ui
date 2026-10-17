import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compileTokens } from '../../scripts/tokens.mjs';
import ts from 'typescript';

// Node 22.12 has no default TypeScript loader. Compile the actual generated source
// with the existing toolchain instead of relying on newer Node's type stripping.
const generated = await readFile(new URL('./tokens.generated.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(generated, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  reportDiagnostics: true,
});
assert.deepEqual(compiled.diagnostics, []);
const { tokens, tokenTiers } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);

test('disabled public references emit in both themes without mutating or leaking between compilations', async () => {
  const source = JSON.parse(await readFile(new URL('./tokens.json', import.meta.url), 'utf8'));
  const before = JSON.stringify(source);
  const original = compileTokens(source);
  const resolve = (input, path) => {
    const [group, key] = path.split('.');
    const value = input[group][key].$value;
    const alias = /^\{(.+)\}$/.exec(String(value));
    return alias ? resolve(input, alias[1]) : value;
  };
  for (const role of ['textDisabled', 'surfaceDisabled', 'borderDisabled']) {
    const name = `--sgui-${role.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`;
    assert.equal(tokens[role], `var(${name})`);
    assert(tokenTiers.semantic.includes(role));
    assert(original.ts.includes(`"${role}": "var(${name})"`));
    for (const theme of ['light', 'dark']) {
      const selector = theme === 'light' ? '[data-sgui-theme="light"], [data-sgui-theme="system"]' : '[data-sgui-theme="dark"]';
      const block = original.css.split(`:where(${selector}) {`)[1].split('}')[0];
      const value = source[theme][role].$value;
      const localAlias = new RegExp(`^\\{${theme}\\.(.+)\\}$`).exec(value);
      const expected = localAlias
        ? `var(--sgui-${localAlias[1].replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)})`
        : resolve(source, `${theme}.${role}`);
      assert(block.includes(`${name}: ${expected};`), `${theme}: ${role}`);
    }
  }
  const alternate = structuredClone(source);
  alternate.base.slate600.$value = '#123456';
  assert.notDeepEqual(compileTokens(alternate), original);
  assert.equal(JSON.stringify(source), before);
  assert.deepEqual(compileTokens(source), original);
});
