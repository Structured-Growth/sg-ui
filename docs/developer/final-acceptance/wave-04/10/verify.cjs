const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const ts = require(path.resolve('packages/ui/node_modules/typescript/lib/typescript.js'));
const dir = path.resolve('docs/developer/final-acceptance/wave-04/10');
const diagnostics = [];
for (const rel of ['apps/docs/native-fixtures/scenarios/experimental/ToggleButton/ToggleButton.fixture.tsx', 'packages/ui/tests/browser/wave04-toggle-presentation.spec.ts']) {
  const result = ts.transpileModule(fs.readFileSync(path.join(dir, 'proposed-files', rel), 'utf8'), { fileName: rel, reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  diagnostics.push(...(result.diagnostics || []).map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')));
}
if (diagnostics.length) throw new Error(diagnostics.join('\n'));
const targets = Object.keys(JSON.parse(fs.readFileSync(path.join(dir, 'patch-preconditions.json'), 'utf8')));
const integrated = targets.every(rel => fs.existsSync(rel) && fs.readFileSync(rel).equals(fs.readFileSync(path.join(dir, 'proposed-files', rel))));
if (!integrated) cp.execFileSync('git', ['apply', '--check', path.join(dir, 'implementation.patch')]);
cp.execFileSync('git', ['apply', '--check', path.join(dir, 'state-indicators.patch')]);
cp.execFileSync(process.execPath, ['--check', path.join(dir, 'native.config.mjs')]);
const css = fs.readFileSync(path.join(dir, 'proposed-files/packages/ui/src/experimental/ToggleButton/ToggleButton.module.css'), 'utf8');
if (!css.includes('min-inline-size: max(var(--sgui-control-height), var(--sgui-control-minimum-target-size))') || !css.includes('border-style: double; border-width: 3px;')) throw new Error('Missing proposed geometry');
const original = fs.readFileSync('packages/ui/src/experimental/ToggleButton/ToggleButton.module.css', 'utf8');
if (!integrated && original.includes('border-style: double')) throw new Error('Source changed: reconcile new base before review');
const receipt = { runtime: process.version, platform: process.platform, diagnostics, patchDryRun: integrated ? 'original already present byte-for-byte; extension dry-run passes' : 'pass', nativeConfigSyntax: 'pass', scope: 'TypeScript transpilation, proposal-presence checks and patch dry-run only; no semantic types, CSS compilation or runtime behavior executed.' };
fs.writeFileSync(path.join(dir, 'preparation-checks.json'), JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));
