import { readFileSync, realpathSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { gunzipSync } from 'node:zlib';
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

// A reviewed historical manifest may bind tracked inputs to an immutable Git
// commit and non-Git outputs to retained artifact copies. Neither reads HEAD or
// the current candidate's source files. The review still hashes this manifest.
function validateSourceFiles(manifest, repositoryRoot) {
  if (!manifest.files || !Object.keys(manifest.files).length) throw Error('Empty source files manifest');
  const provenance = manifest.provenance;
  if (!provenance) {
    // Explicit compatibility for existing receipts; migration is required before
    // an old current-tree manifest can compare a later candidate.
    for (const [file, expected] of Object.entries(manifest.files)) {
      if (!sha(expected) || digest(contained(repositoryRoot, file)) !== expected) throw Error(`Stale source ${file}`);
    }
    return;
  }
  if (provenance.kind !== 'git-and-artifact-snapshot' || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(provenance.commit ?? '')) throw Error('Immutable source commit required');
  const git = args => execFileSync('git', args, {cwd: repositoryRoot, stdio: 'pipe', maxBuffer: 128 * 1024 * 1024});
  const commit = git(['rev-parse', '--verify', `${provenance.commit}^{commit}`]).toString().trim();
  if (commit !== provenance.commit) throw Error('Source commit does not match immutable commit');
  const tree = new Map(git(['ls-tree', '-r', '-z', commit]).toString().split('\0').filter(Boolean).map(entry => {
    const tab = entry.indexOf('\t'), metadata = entry.slice(0, tab).split(' ');
    return [entry.slice(tab + 1), {mode:metadata[0], type:metadata[1], object:metadata[2]}];
  }));
  const tracked = [];
  let artifacts;
  const usedArtifacts = new Set();
  const loadArtifacts = () => {
    if (artifacts) return artifacts;
    const record = provenance.artifactSnapshot;
    const packedPath = contained(repositoryRoot, record?.path);
    if (!sha(record?.sha256) || digest(packedPath) !== record.sha256) throw Error('Historical artifact snapshot hash mismatch');
    const packed = JSON.parse(gunzipSync(readFileSync(packedPath), {maxOutputLength:128 * 1024 * 1024}).toString('utf8'));
    if (packed.schemaVersion !== 1 || !packed.files || typeof packed.files !== 'object' || Array.isArray(packed.files)) throw Error('Invalid historical artifact map');
    for (const [file, encoded] of Object.entries(packed.files)) {
      if (!text(file) || isAbsolute(file) || file.split(/[\\/]/).some(part => part === '..' || part === '.' || !part) || /[\r\n\0]/.test(file)) throw Error('Invalid historical artifact path');
      if (typeof encoded !== 'string' || Buffer.from(encoded, 'base64').toString('base64') !== encoded) throw Error('Invalid historical artifact base64');
    }
    artifacts = packed.files;
    return artifacts;
  };
  for (const [file, expected] of Object.entries(manifest.files)) {
    // Validate names even when Git is their byte source.
    if (!text(file) || isAbsolute(file) || file.split(/[\\/]/).includes('..') || /[\r\n]/.test(file) || !sha(expected)) throw Error('Invalid source manifest entry');
    if (tree.has(file)) {
      const entry = tree.get(file);
      if (entry.type !== 'blob' || !['100644','100755'].includes(entry.mode)) throw Error(`Non-regular Git source ${file}`);
      tracked.push({file, expected, object:entry.object});
    } else {
      const entries = loadArtifacts();
      if (!Object.hasOwn(entries, file)) throw Error(`Missing historical artifact ${file}`);
      usedArtifacts.add(file);
      if (createHash('sha256').update(Buffer.from(entries[file], 'base64')).digest('hex') !== expected) throw Error(`Historical artifact hash mismatch ${file}`);
    }
  }
  if (artifacts && Object.keys(artifacts).some(file => !usedArtifacts.has(file))) throw Error('Unexpected historical artifact entry');
  // One batch, by immutable object ID: never evaluate candidate paths as refs.
  if (tracked.length) {
    const bytes = execFileSync('git', ['cat-file', '--batch'], {cwd:repositoryRoot, stdio:'pipe',
      input:tracked.map(entry => entry.object + '\n').join(''), maxBuffer:128 * 1024 * 1024});
    let offset = 0;
    for (const entry of tracked) {
      const end = bytes.indexOf(10, offset), header = bytes.subarray(offset, end).toString().split(' '), size = Number(header[2]);
      if (end < 0 || header[0] !== entry.object || header[1] !== 'blob' || !Number.isSafeInteger(size) || size < 0) throw Error('Invalid Git blob response');
      const content = bytes.subarray(end + 1, end + 1 + size);
      if (content.length !== size || createHash('sha256').update(content).digest('hex') !== entry.expected) throw Error(`Historical Git source hash mismatch ${entry.file}`);
      offset = end + 1 + size + 1;
    }
  }
}

/** Bind a separately recorded candidate manifest to the mutable candidate tree. */
export function validateVisualCandidate({candidatePath, candidateSha256, repositoryRoot}) {
  try {
    if (!isAbsolute(candidatePath ?? '') || !sha(candidateSha256)) throw Error('Absolute candidate manifest and SHA-256 required');
    const path = contained(repositoryRoot, relative(repositoryRoot, candidatePath));
    if (digest(path) !== candidateSha256) throw Error('Candidate manifest hash mismatch');
    const candidate = JSON.parse(readFileSync(path, 'utf8'));
    if (candidate.provenance) throw Error('Candidate manifest must bind current inputs');
    validateSourceFiles(candidate, repositoryRoot);
    return [];
  } catch (error) { return [`candidate: ${error.message}`]; }
}

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
        validateSourceFiles(manifest, repositoryRoot);
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
  baselineRoot, receiptPath, repositoryRoot, candidatePath, candidateSha256, argv = [] }) {
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
    errors.push(...validateVisualCandidate({candidatePath, candidateSha256, repositoryRoot}));
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
