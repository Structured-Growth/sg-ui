import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { readDocument, assertDocument, initialParagraphs, editedParagraphs } from './document.mjs';

const document = (texts, formats = texts.map(() => 0)) => ({ root: { type: 'root', version: 1, children: texts.map((text, i) => ({ type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text, format: formats[i] }] })) } });

test('public serialization oracle rejects text-only, stale, reordered and lost-format results', () => {
  const initial = readDocument(JSON.stringify(document(initialParagraphs)));
  assertDocument(initial, initialParagraphs, initialParagraphs.map(() => 0));
  const edited = readDocument(JSON.stringify(document(editedParagraphs, [1, 0])));
  assertDocument(edited, editedParagraphs, [1, 0]);
  assert.throws(() => readDocument(JSON.stringify({ text: editedParagraphs.join('') })));
  assert.throws(() => assertDocument(initial, editedParagraphs, [1, 0]));
  assert.throws(() => assertDocument(edited, [...editedParagraphs].reverse(), [1, 0]));
  assert.throws(() => assertDocument(edited, editedParagraphs, [0, 0]));
  assert.throws(() => readDocument(JSON.stringify({ root: { type: 'root', version: 1, children: [{ type: 'paragraph', version: 1, children: [{ type: 'text', version: 1, text: 'wrong', format: 'bold' }] }] } })));
});

test('browser entry remains opt-in, packed, and uses matching SSR/client props', async () => {
  const runner = await readFile(new URL('../../test-editor-consumer.mjs', import.meta.url), 'utf8');
  assert.match(runner, /const browserProof = process.argv.includes\('--browser'\)/);
  assert.match(runner, /'18\.3\.1' : '19\.2\.3'/);
  assert.match(runner, /hydrateRoot\(document.getElementById\('root'\),<Proof browserProof=\{\$\{browserProof\}\}/);
  assert.match(runner, /React.createElement\(Proof,\{browserProof:\$\{browserProof\}\}\)/);
  assert.match(runner, /onRecoverableError: error => console.error\(error\)/);
  assert.match(runner, /if \(browserProof\) \{\s+const \{ runEditorBrowser \} = await import/);
  assert.match(runner, /runEditorBrowser\(join\(fixture, 'dist'\), reactVersion\)/);
  assert.match(runner, /browser execution not implied/);
  const fixture = await readFile(new URL('./Proof.jsx', import.meta.url), 'utf8');
  assert(!/from ['"].*(?:src\/|worktrees\/|@ui\/app)/.test(fixture));
  assert.match(fixture, /editorKey=\{browserProof \? 'packed-section-' \+ documentVersion : 'packed-section'\}/);
  assert.match(fixture, /onLexicalChange=\{setSectionValue\}/);
  const harness = await readFile(new URL('../../packed-browser.mjs', import.meta.url), 'utf8');
  assert.match(harness, /javaScriptEnabled: false/);
  assert.match(harness, /page.on\('pageerror'/);
  assert.match(harness, /\['error', 'warning'\]/);
  assert.match(harness, /assert.deepEqual\(errors, \[\]/);
});

test('extracted JSX proof parses without a Vite build', async () => {
  const { default: ts } = await import('typescript');
  const source = await readFile(new URL('./Proof.jsx', import.meta.url), 'utf8');
  const result = ts.transpileModule(source, {
    fileName: 'Proof.jsx', reportDiagnostics: true,
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  assert.deepEqual(result.diagnostics, []);
});

test('runner and browser helpers pass Node syntax checks', async () => {
  const { execFileSync } = await import('node:child_process');
  const { fileURLToPath } = await import('node:url');
  for (const path of ['../../test-editor-consumer.mjs', './browser.mjs', './editor.spec.mjs', './document.mjs']) {
    execFileSync(process.execPath, ['--check', fileURLToPath(new URL(path, import.meta.url))], { stdio: 'pipe' });
  }
});
