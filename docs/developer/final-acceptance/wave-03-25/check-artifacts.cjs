const { createRequire } = require('node:module');
const { readFileSync, readdirSync, statSync } = require('node:fs');
const { resolve, relative } = require('node:path');
const assert = require('node:assert/strict');
const base = __dirname;
const repository = resolve(base, '../../../..');
const fromUI = createRequire(resolve(repository, 'packages/ui/package.json'));
const ts = fromUI('typescript');
function walk(dir) { return readdirSync(dir).flatMap(name => { const path = resolve(dir, name); return statSync(path).isDirectory() ? walk(path) : [path]; }); }
const files = walk(resolve(base, 'proposed-files')).filter(path => /\.tsx?$/.test(path));
for (const file of files) {
 const source = readFileSync(file, 'utf8');
 const output = ts.transpileModule(source, { fileName: file, compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true });
 const errors = output.diagnostics.filter(item => item.category === ts.DiagnosticCategory.Error);
 assert.equal(errors.length, 0, JSON.stringify(errors));
 console.log(`Syntax passed: ${relative(base, file)}`);
}
const mirror = readFileSync(resolve(base, 'editorConfig.acceptance-successors.test.ts'), 'utf8')
 .replaceAll('"../../../../packages/ui/src/components/PageRichTextEditorSection/lexical/editorConfig"', '"./editorConfig"')
 .replaceAll('"../../../../packages/ui/src/components/PageRichTextEditorSection/lexical/serializeEditorDocument"', '"./serializeEditorDocument"')
 .replaceAll('"../../../../packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.native-fixtures"', '"../PageRichTextEditorSection.native-fixtures"');
assert.equal(mirror, readFileSync(files.find(file => file.endsWith('.test.ts')), 'utf8'));
console.log('Runnable unit artifact matches proposed colocated test (imports only differ).');
console.log('Syntax/mirror checks only; no typecheck, unit assertions, native engine or IME execution.');
