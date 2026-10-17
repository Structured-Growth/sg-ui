import { readFileSync, realpathSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative, isAbsolute, dirname, basename } from 'node:path';

const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const text = value => typeof value === 'string' && value.trim().length > 0;
const sha = value => /^[a-f0-9]{64}$/.test(value ?? '');
function contained(root, path) {
  if (!text(path) || isAbsolute(path)) throw Error('Expected relative path');
  const candidate = realpathSync(resolve(root, path));
  const rel = relative(realpathSync(root), candidate);
  if (rel === '..' || rel.startsWith('../') || isAbsolute(rel)) throw Error('Path escapes evidence root');
  return candidate;
}
// The same matrix as visual-acceptance.spec.ts. Six images in each of eight cases.
export const visualBaselineNames = [
  'light-compact-360-en-US-ltr-long', 'light-compact-1280-en-US-ltr-short',
  'light-comfortable-360-ar-rtl-long', 'light-comfortable-1280-en-US-ltr-short',
  'dark-compact-360-ar-rtl-long', 'dark-compact-1280-en-US-ltr-short',
  'dark-comfortable-360-en-US-ltr-long', 'dark-comfortable-1280-ar-rtl-long',
].flatMap(key => ['focused-action', 'controls', 'grids', 'navigation', 'editor', 'overlay'].map(family => `${key}-${family}.png`));

/** Completeness/integrity gate only. It cannot perform or authenticate a review. */
export function validateVisualBaseline({ receiptPath, baselineRoot, repositoryRoot }) {
  const errors = [];
  let receipt;
  try { receipt = JSON.parse(readFileSync(receiptPath, 'utf8')); }
  catch { return ['Review receipt missing or invalid JSON']; }
  if (receipt?.schemaVersion !== 1) errors.push('Expected review schemaVersion 1');
  if (!text(receipt?.reviewer) || !Number.isFinite(Date.parse(receipt?.reviewedAt))) errors.push('Actual reviewer and reviewedAt required');
  for (const field of ['engineVersion', 'osVersion', 'fontEnvironment', 'reason']) if (!text(receipt?.[field])) errors.push(`Missing ${field}`);
  for (const kind of ['source', 'host', 'interaction']) {
    try {
      const record = receipt?.[kind];
      const path = contained(repositoryRoot, record?.path);
      if (!sha(record.sha256) || digest(path) !== record.sha256) throw Error('Receipt hash mismatch');
      if (kind === 'source') {
        const manifest = JSON.parse(readFileSync(path, 'utf8'));
        if (!manifest.files || !Object.keys(manifest.files).length) throw Error('Empty source files manifest');
        for (const [file, expected] of Object.entries(manifest.files)) {
          if (!sha(expected) || digest(contained(repositoryRoot, file)) !== expected) throw Error(`Stale source ${file}`);
        }
      }
    } catch (error) { errors.push(`${kind}: ${error.message}`); }
  }
  const expected = new Set(visualBaselineNames);
  const seen = new Set();
  if (!Array.isArray(receipt?.images)) errors.push('images must be an array');
  for (const entry of Array.isArray(receipt?.images) ? receipt.images : []) {
    if (!expected.has(entry?.name) || seen.has(entry?.name)) errors.push(`Unknown/duplicate image ${entry?.name}`);
    seen.add(entry?.name);
    if (entry?.disposition !== 'accepted' || !text(entry?.observation)) errors.push(`Unreviewed/rejected image ${entry?.name}`);
    try {
      const path = contained(baselineRoot, entry.path);
      if (path.split('/').pop() !== entry.name) throw Error('Image name does not match path');
      if (!sha(entry.sha256) || digest(path) !== entry.sha256) throw Error('Image hash mismatch');
    } catch (error) { errors.push(`${entry?.name}: ${error.message}`); }
  }
  for (const name of expected) if (!seen.has(name)) errors.push(`Missing reviewed image ${name}`);
  return errors;
}

// Bind the actual screenshot entry to reviewed baselines or fresh candidates.
// This also runs inside visual-acceptance.spec.ts, so another config cannot
// silently enable missing-snapshot updates or point at unreviewed images.
function destination(path) {
  let parent = resolve(path); const suffix = [];
  while (!existsSync(parent)) { suffix.unshift(basename(parent)); parent = dirname(parent); }
  return resolve(realpathSync(parent), ...suffix);
}
export function validateVisualExecution({ mode, updateSnapshots, snapshotPaths, outputDirectory,
  baselineRoot, receiptPath, repositoryRoot, argv = [] }) {
  const errors = [];
  if (!['capture', 'compare'].includes(mode)) return ['Explicit capture or compare mode required'];
  if (argv.some(argument => /^--update-snapshots(?:=|$)/.test(argument) || argument === '-u')) errors.push('Snapshot update flags are forbidden');
  if (updateSnapshots !== (mode === 'capture' ? 'all' : 'none')) errors.push('Snapshot update policy does not match deliberate capture/comparison');
  if (!isAbsolute(outputDirectory ?? '')) errors.push('Absolute visual output directory required');
  if (!Array.isArray(snapshotPaths) || !snapshotPaths.length) errors.push('Actual snapshot paths required');
  const root = mode === 'capture' && isAbsolute(outputDirectory ?? '') ? resolve(outputDirectory, 'candidates') : baselineRoot;
  if (mode === 'capture' && isAbsolute(outputDirectory ?? '')) {
    const rel = relative(destination(outputDirectory), destination(resolve(outputDirectory, 'candidates')));
    if (!rel || rel === '..' || rel.startsWith('../') || isAbsolute(rel)) errors.push('Candidate root escapes visual output directory');
  }
  if (!isAbsolute(root ?? '')) errors.push('Absolute reviewed baseline or candidate root required');
  else for (const path of Array.isArray(snapshotPaths) ? snapshotPaths : []) {
    try {
      if (!isAbsolute(path ?? '')) throw Error('Absolute snapshot path required');
      const rel = relative(destination(root), destination(path));
      if (!rel || rel === '..' || rel.startsWith('../') || isAbsolute(rel)) throw Error('Actual snapshot path escapes admitted visual root');
      if (mode === 'capture' && existsSync(path)) throw Error('Capture cannot overwrite an existing candidate');
    } catch (error) { errors.push(error.message); }
  }
  if (mode === 'compare') {
    if (!isAbsolute(receiptPath ?? '')) errors.push('Absolute actual review receipt required');
    else {
      errors.push(...validateVisualBaseline({ receiptPath, baselineRoot, repositoryRoot }));
      try {
        const reviewed = JSON.parse(readFileSync(receiptPath, 'utf8')).images;
        for (const path of Array.isArray(snapshotPaths) ? snapshotPaths : []) {
          const entry = reviewed.find(image => image.name === basename(path));
          if (!entry || destination(path) !== destination(resolve(baselineRoot, entry.path))) errors.push('Actual screenshot path is not the reviewed image path');
        }
      } catch (error) { errors.push('Cannot bind actual snapshots to reviewed image paths'); }
    }
  }
  return errors;
}
