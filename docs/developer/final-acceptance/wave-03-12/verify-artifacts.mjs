import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const out = dirname(fileURLToPath(import.meta.url));
const root = resolve(out, '../../../..');
const require = createRequire(resolve(root, 'packages/ui/package.json'));
const ts = require('typescript');
const postcss = require('postcss');
const input = JSON.parse(readFileSync(resolve(out, 'patch-inputs.json')));
const result = { runtime: process.version, platform: process.platform, arch: process.arch, kind: 'artifact syntax and CSS structure only', files: [] };
for (const path of Object.keys(input)) {
  const source = readFileSync(resolve(out, 'proposed-files', path), 'utf8');
  if (/\.tsx?$/.test(path)) {
    const output = ts.transpileModule(source, { fileName: path, reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
    assert.equal(output.diagnostics?.length ?? 0, 0, path);
  }
  if (path.endsWith('.css')) {
    const ast = postcss.parse(source);
    const exceptions = [];
    ast.walkDecls('forced-color-adjust', decl => exceptions.push({ selector: decl.parent.selector, value: decl.value }));
    assert.deepEqual(exceptions, [{ selector: '.swatchFill', value: 'none' }]);
    let selected, focused;
    ast.walkRules(rule => {
      if (rule.parent.type !== 'atrule' || rule.parent.params !== '(forced-colors: active)') return;
      if (rule.selector === '.swatch[aria-pressed="true"]') selected = rule.toString();
      if (rule.selector === '.swatch[data-focus-visible]') focused = rule.toString();
    });
    assert.match(selected, /3px double Highlight/);
    assert.match(focused, /solid Highlight/);
    assert.match(focused, /outline-offset: var\(--sgui-control-focus-offset\)/);
  }
  result.files.push({ path, result: 'pass' });
}
writeFileSync(resolve(out, 'artifact-check.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
