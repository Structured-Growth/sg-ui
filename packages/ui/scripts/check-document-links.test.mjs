import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { markdownLinks, markdownAnchors, checkDocumentLinks } from './check-document-links.mjs';
const script = fileURLToPath(new URL('./check-document-links.mjs', import.meta.url));
async function fixture(t, entries) {
  const root = await mkdtemp(join(tmpdir(), 'sgui-doc-links-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const [path, text] of Object.entries(entries)) {
    await mkdir(join(root, path, '..'), { recursive: true });
    await writeFile(join(root, path), text);
  }
  return root;
}

test('balanced/escaped labels and destinations, angle spaces, titles and images', () => {
  const source = String.raw`[outer [inner] and \] label](folder/a(b(c)).md "title")
[escaped](a\(b\).md) [spaces](<a b.md> 'title') [paren](ok.md (title)) ![picture](image.png)
\[ordinary](ignored.md) [external](https://example.com/a(b))`;
  assert.deepEqual(markdownLinks(source).map(x => x.destination), ['folder/a(b(c)).md', 'a(b).md', 'a b.md', 'ok.md', 'image.png', 'https://example.com/a(b)']);
});
test('forward full/collapsed/shortcut references normalize escaped labels and whitespace', () => {
  const links = markdownLinks(String.raw`[full][ Mixed  REF ] [mixed ref][] [Mixed REF] [missing][unknown]
[escape][a\]b]
[mixed ref]: <target file.md> "title"
[a\]b]: other.md
[unused]: absent.md`);
  assert.deepEqual(links.map(x => x.destination), ['target file.md', 'target file.md', 'target file.md', undefined, 'other.md', 'target file.md', 'other.md', 'absent.md']);
  assert.equal(links[3].reference, 'unknown');
});
test('code, comments, escapes, and unmatched inline ticks do not invent links', () => {
  const source = '[real](ok.md)\n`[fake](bad.md)`\n`` two ` [fake](bad.md) ``\n~~~md\n[fake](bad.md)\n~~~~\n    [fake](bad.md)\n<!-- [fake](bad.md) -->\n`unclosed [still real](ok.md)';
  assert.deepEqual(markdownLinks(source).map(x => x.destination), ['ok.md', 'ok.md']);
});
test('GitHub heading duplication, punctuation, unicode, setext, formatting and explicit HTML ids', () => {
  const source = '# Hello, *world*!\n# Hello world\n# Hello world-1\n# Hello world\n## M-06 criterion reconciliation — 2026-10-07\nTitle &amp; `code`\n----\n# Café 日本語\n<a id="manual&amp;id"></a> <span id=plain></span>\n```html\n<h2 id="fake">Ignore</h2>\n# Fake\n```';
  assert.deepEqual([...markdownAnchors(source)], ['manual&id', 'plain', 'hello-world', 'hello-world-1', 'hello-world-1-1', 'hello-world-2', 'm-06-criterion-reconciliation--2026-10-07', 'title--code', 'café-日本語']);
});
test('relative paths, encoded paths, same-file anchors and exact CRLF usage locations', async t => {
  const source = '# Local\r\n[good](target.md#repeat-1)\r\n[local](#local)\r\n[space](a%20b.md)\r\n[bad](target.md#absent)\r\n[ref][lost]\r\n[lost]: missing.md\r\n';
  const root = await fixture(t, { 'docs/source.md': source, 'docs/target.md': '# Repeat\n# Repeat\n', 'docs/a b.md': '' });
  const result = await checkDocumentLinks({ root, files: ['docs/source.md'] });
  assert.equal(result.checkedLinks, 6);
  assert.deepEqual(result.findings.map(f => [f.line, f.column, f.code]), [[5, 1, 'missing-anchor'], [6, 1, 'missing-path'], [7, 1, 'missing-path']]);
  assert.equal(await readFile(join(root, 'docs/source.md'), 'utf8'), source);
});
test('external schemes and protocol-relative URLs excluded, malformed encoding reported', async t => {
  const root = await fixture(t, { 'index.md': '[a](https://x) [b](mailto:a@b) [c](data:image/png;base64,eA==) [d](app://x) [e](//example.com/x) [f](file:///tmp/x) [bad](x%zz.md) [empty]()' });
  const result = await checkDocumentLinks({ root, files: ['index.md'] });
  assert.equal(result.excludedLinks, 6);
  assert.equal(result.defects, 1);
  assert.equal(result.findings[0].code, 'invalid-encoding');
});
test('missing temporary/historical artifacts are retention findings, ordinary missing docs fail', async t => {
  const missing = `/tmp/sgui-missing-${process.pid}-historical.json`;
  const root = await fixture(t, { 'docs/parallel-batch-1/report.md': `[temp](${missing})\n[historical](gone.png)\n[document](gone.md)\n[undefined][unknown]` });
  const result = await checkDocumentLinks({ root, files: ['docs/parallel-batch-1/report.md'] });
  assert.deepEqual(result.findings.map(f => f.category), ['temporary-artifact', 'historical-artifact', 'document', 'document']);
  assert.equal(result.retentionFindings, 2);
  assert.equal(result.defects, 2);
});
test('CLI exit statuses and JSON retain exact findings without rewriting source', async t => {
  const root = await fixture(t, { 'retained.md': `[lost](/tmp/sgui-nonexistent-${process.pid}.json)`, 'broken.md': '[lost](missing.md)', 'clean.md': '# Local\n[good](#local)' });
  for (const [file, status] of [['retained.md', 0], ['broken.md', 1], ['clean.md', 0]]) {
    const result = spawnSync(process.execPath, [script, '--json', '--root', root, file], { encoding: 'utf8' });
    assert.equal(result.status, status, result.stderr);
    const parsed = JSON.parse(result.stdout);
    assert.equal(parsed.files, 1);
    if (file === 'retained.md') assert.equal(parsed.retentionFindings, 1);
  }
  const unreadable = spawnSync(process.execPath, [script, '--root', root, 'absent.md'], { encoding: 'utf8' });
  assert.equal(unreadable.status, 2);
  assert.match(unreadable.stderr, /audit failed/);
});

test('continued references, first definition wins, and code definitions stay inert', () => {
  const source = '[full][ref] [ref][] [ref]\n[ref]:\n  target.md \"title\"\n[ref]: other.md\n~~~\n[hidden]: absent.md\n~~~\n[hidden]';
  assert.deepEqual(markdownLinks(source).map(x => x.destination), ['target.md', 'target.md', 'target.md', 'target.md', 'other.md']);
});
test('default CLI scans Git-tracked Markdown, leaving untracked files alone', async t => {
  const root = await fixture(t, { 'index.md': '# Home\n[local](#home)', 'untracked.md': '[broken](absent.md)' });
  execFileSync('git', ['init', '--quiet', root]);
  execFileSync('git', ['-C', root, 'add', 'index.md']);
  const result = spawnSync(process.execPath, [script, '--json', '--root', root], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).files, 1);
});
