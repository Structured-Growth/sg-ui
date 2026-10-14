/** Read-only, dependency-free local Markdown link audit. Not a full CommonMark renderer.
 * CLI: node scripts/check-document-links.mjs [--json] [--root directory] [files...]
 * With no files, scans tracked Markdown (including root dotfiles) via git ls-files.
 * Scope: Markdown inline/image links, definitions/full/collapsed/shortcut refs,
 * ATX/setext headings, HTML id/name anchors. Ignores code/comments and all schemes.
 * Does not validate raw HTML href/src, MDX, autolinks, prose paths, examples/commands,
 * remote URLs, or fragments on non-Markdown files. GitHub slugs are local approximations.
 * Temporary absolute paths and historical batch binary/JSON/log artifacts are
 * retention findings (heuristic categories), never behavioral acceptance failures.
 * Exit 1: document defects; exit 0: clean or retention-only; exit 2: audit failure.
 */
import { readFile, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, relative, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

const blank = text => text.replace(/[^\r\n]/g, ' ');
const escaped = (text, at) => {
  let count = 0;
  for (let i = at - 1; i >= 0 && text[i] === '\\'; i--) count++;
  return count % 2 === 1;
};
const unescape = text => text.replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~])/g, '$1');
const entities = text => text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (all, key) => {
  if (key[0] === '#') {
    const n = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1));
    return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : all;
  }
  return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' }[key.toLowerCase()];
});
const labelKey = text => entities(unescape(text)).trim().replace(/\s+/g, ' ').toLowerCase();

// Preserve offsets so findings always refer to the original source, including CRLF.
function prose(text, inline = true) {
  let fence;
  let result = '';
  for (const line of text.match(/[^\n]*\n|[^\n]+$/g) ?? []) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fence) {
      result += blank(line);
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && /^\s*$/.test(line.slice(marker[0].length))) fence = undefined;
    } else if (marker) { fence = marker[1]; result += blank(line); }
    else result += /^ {4}|^\t/.test(line) ? blank(line) : line;
  }
  result = result.replace(/<!--[\s\S]*?(?:-->|$)/g, blank);
  if (!inline) return result;
  for (let i = 0; i < result.length; i++) {
    if (result[i] !== '`' || escaped(result, i)) continue;
    const run = result.slice(i).match(/^`+/)[0];
    let end = i + run.length;
    while ((end = result.indexOf(run, end)) !== -1) {
      if (result[end - 1] !== '`' && result[end + run.length] !== '`') break;
      end += run.length;
    }
    if (end !== -1) {
      result = result.slice(0, i) + blank(result.slice(i, end + run.length)) + result.slice(end + run.length);
      i = end + run.length - 1;
    }
  }
  return result;
}
function bracketEnd(text, start) {
  let depth = 1;
  for (let i = start + 1; i < text.length; i++) {
    if (escaped(text, i)) continue;
    if (text[i] === '[') depth++;
    if (text[i] === ']' && --depth === 0) return i;
  }
  return -1;
}
// Destination parsing handles escaped punctuation, balanced parentheses, angle
// destinations and optional quoted titles, rather than stopping at the first ')'.
function destination(text, start, closing) {
  let i = start;
  while (/\s/.test(text[i] ?? '') && i < text.length) i++;
  let value = '';
  if (text[i] === '<') {
    const begin = ++i;
    while (i < text.length && (text[i] !== '>' || escaped(text, i)) && text[i] !== '\n') i++;
    if (text[i] !== '>') return;
    value = text.slice(begin, i++);
  } else {
    const begin = i;
    let depth = 0;
    for (; i < text.length; i++) {
      if (escaped(text, i)) continue;
      if (text[i] === '(') depth++;
      else if (text[i] === ')') { if (!depth) break; depth--; }
      if (/\s/.test(text[i])) break;
    }
    if (depth) return;
    value = text.slice(begin, i);
  }
  while (/\s/.test(text[i] ?? '') && i < text.length) i++;
  if (text[i] === '"' || text[i] === "'" || text[i] === '(') {
    const endQuote = text[i] === '(' ? ')' : text[i];
    i++;
    while (i < text.length && (text[i] !== endQuote || escaped(text, i))) i++;
    if (i === text.length) return;
    i++;
    while (/\s/.test(text[i] ?? '') && i < text.length) i++;
  }
  if (closing && text[i] !== closing) return;
  if (!closing && i < text.length) return;
  return { value: entities(unescape(value)), end: closing ? i + 1 : i };
}
export function markdownLinks(source) {
  let text = prose(source);
  const definitions = new Map();
  const links = [];
  for (const match of text.matchAll(/^ {0,3}\[([^\n]+?)\]:[ \t]*(?:\n[ \t]*)?([^\n]*)(?:\n|$)/gm)) {
    const dest = destination(match[2], 0);
    if (!dest) continue;
    const key = labelKey(match[1]);
    if (!definitions.has(key)) definitions.set(key, dest.value);
    // Check even unused definitions; references get their own usage locations.
    links.push({ offset: match.index + match[0].indexOf('['), destination: dest.value, kind: 'definition' });
    text = text.slice(0, match.index) + blank(match[0]) + text.slice(match.index + match[0].length);
  }
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== '[' || escaped(text, i)) continue;
    const end = bracketEnd(text, i);
    if (end < 0) continue;
    const label = source.slice(i + 1, end);
    let next = end + 1;
    if (text[next] === '(') {
      const dest = destination(text, next + 1, ')');
      if (dest) { links.push({ offset: i, destination: dest.value, kind: 'inline' }); i = dest.end - 1; }
      continue;
    }
    if (text[next] === '[') {
      const refEnd = bracketEnd(text, next);
      if (refEnd < 0) continue;
      const key = labelKey(source.slice(next + 1, refEnd) || label);
      links.push({ offset: i, destination: definitions.get(key), reference: key, kind: 'reference' });
      i = refEnd;
    } else if (definitions.has(labelKey(label))) {
      links.push({ offset: i, destination: definitions.get(labelKey(label)), kind: 'reference' }); i = end;
    }
  }
  return links.sort((a, b) => a.offset - b.offset);
}
export function markdownAnchors(source) {
  const text = prose(source, false);
  const anchors = new Set();
  const headingIds = new Set();
  for (const match of text.matchAll(/<[a-z][^>]*\s(?:id|name)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi)) {
    anchors.add(entities(match[1] ?? match[2] ?? match[3]));
  }
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const atx = lines[i].match(/^ {0,3}#{1,6}(?:[ \t]+(.*?)|[ \t]*)$/);
    let heading = atx?.[1];
    if (atx) heading = (heading ?? '').replace(/[ \t]+#+[ \t]*$/, '');
    else if (lines[i].trim() && /^ {0,3}(?:=+|-+)\s*$/.test(lines[i + 1] ?? '')) heading = lines[i++].trim();
    if (heading === undefined) continue;
    heading = heading.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/<[^>]*>/g, '');
    const base = entities(unescape(heading)).toLowerCase().replace(/[^\p{L}\p{M}\p{N}_\-\s]/gu, '').replace(/ /g, '-');
    let id = base;
    let suffix = 0;
    while (headingIds.has(id)) id = `${base}-${++suffix}`;
    headingIds.add(id); anchors.add(id);
  }
  return anchors;
}
function location(source, offset) {
  const before = source.slice(0, offset);
  return { line: before.split('\n').length, column: offset - before.lastIndexOf('\n') };
}
function retentionKind(file, target, suppliedPath) {
  if (isAbsolute(suppliedPath) && (/^\/(?:tmp|private\/tmp|var\/folders)\//.test(target) || /\/\.codex\/worktrees\//.test(target))) return 'temporary-artifact';
  if (/(?:^|\/)parallel-batch-\d+\//.test(file) && /\.(?:json|log|png|jpe?g|zip|tgz|pdf|webm)$/i.test(target)) return 'historical-artifact';
  return 'document';
}
export async function checkDocumentLinks({ root = process.cwd(), files } = {}) {
  root = resolve(root);
  files ??= execFileSync('git', ['ls-files', '-z', '--', '*.md', '*.markdown', '*.MD'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const findings = [];
  const cache = new Map();
  let checkedLinks = 0;
  let excludedLinks = 0;
  for (const file of files) {
    const absolute = resolve(root, file);
    const source = await readFile(absolute, 'utf8');
    for (const link of markdownLinks(source)) {
      const base = { file: relative(root, absolute), ...location(source, link.offset), kind: link.kind, destination: link.destination ?? link.reference };
      if (link.destination === undefined) { findings.push({ ...base, category: 'document', code: 'missing-reference' }); continue; }
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(link.destination)) { excludedLinks++; continue; }
      if (!link.destination) continue;
      checkedLinks++;
      const hash = link.destination.indexOf('#');
      let path = (hash < 0 ? link.destination : link.destination.slice(0, hash)).split('?')[0];
      let fragment = hash < 0 ? '' : link.destination.slice(hash + 1);
      try { path = decodeURIComponent(path); fragment = decodeURIComponent(fragment); }
      catch { findings.push({ ...base, category: 'document', code: 'invalid-encoding' }); continue; }
      const target = path ? resolve(dirname(absolute), path) : absolute;
      let exists;
      try { exists = await stat(target); }
      catch (error) {
        if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
        findings.push({ ...base, target, category: retentionKind(base.file, target, path), code: 'missing-path' }); continue;
      }
      if (fragment && /\.(md|markdown)$/i.test(target) && exists.isFile()) {
        if (!cache.has(target)) cache.set(target, markdownAnchors(await readFile(target, 'utf8')));
        if (!cache.get(target).has(fragment)) findings.push({ ...base, target, category: 'document', code: 'missing-anchor' });
      }
    }
  }
  return { root, files: files.length, checkedLinks, excludedLinks, findings,
    defects: findings.filter(f => f.category === 'document').length,
    retentionFindings: findings.filter(f => f.category !== 'document').length };
}
async function main() {
  const args = process.argv.slice(2);
  let root = process.cwd();
  let json = false;
  const files = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--json') json = true;
    else if (args[i] === '--root') { if (!args[++i]) throw new Error('--root requires a directory'); root = args[i]; }
    else if (args[i].startsWith('--')) throw new Error(`Unknown option: ${args[i]}`);
    else files.push(args[i]);
  }
  const result = await checkDocumentLinks({ root, ...(files.length ? { files } : {}) });
  if (json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else {
    for (const f of result.findings) process.stdout.write(`${f.file}:${f.line}:${f.column} ${f.category} ${f.code}: ${f.destination}\n`);
    process.stdout.write(`${result.files} files; ${result.checkedLinks} local links; ${result.excludedLinks} external links excluded; ${result.defects} document defects; ${result.retentionFindings} retention findings\n`);
  }
  process.exitCode = result.defects ? 1 : 0;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch(error => { process.stderr.write(`Document link audit failed: ${error.message}\n`); process.exitCode = 2; });
}
