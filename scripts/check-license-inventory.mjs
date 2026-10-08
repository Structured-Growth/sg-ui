import { readFile, readdir, lstat } from 'node:fs/promises';
import { resolve, relative, join, isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const sort = values => [...values].sort();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const scalar = value => {
  if (value.startsWith("'")) {
    if (!value.endsWith("'")) throw new Error('Unsupported lock scalar');
    return value.slice(1, -1).replaceAll("''", "'");
  }
  if (value.startsWith('"')) return JSON.parse(value);
  if (/^[*&!>|\[{]/.test(value)) throw new Error('Unsupported lock scalar');
  return value;
};
const identity = key => {
  const bare = key.split('(')[0];
  const at = bare.lastIndexOf('@');
  if (at <= 0 || !/^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(bare.slice(at + 1))) {
    throw new Error(`Unsupported pnpm package identity: ${key}`);
  }
  return { name: bare.slice(0, at), version: bare.slice(at + 1), id: bare };
};

// Deliberately reads only pnpm v9 identity/importer/edge fields. This is not a
// general YAML parser; unsupported identities fail rather than guessing licenses.
export function parseLock(text) {
  if (!/^lockfileVersion: ['"]?9\.0['"]?$/m.test(text)) throw new Error('Only pnpm lockfile v9 is supported');
  const result = { importer: {}, packages: new Map(), snapshots: new Map() };
  let section, rootImporter = false, group, entry, snapshot;
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    const match = /^( *)(.+?):(?: (.*))?$/.exec(line);
    if (!match) continue;
    const indent = match[1].length;
    const key = scalar(match[2]);
    const value = match[3];
    if (indent === 0) { section = key; group = entry = snapshot = undefined; continue; }
    if (section === 'importers') {
      if (indent === 2) rootImporter = key === '.';
      if (!rootImporter) continue;
      if (indent === 4) { group = key; result.importer[group] ??= {}; }
      if (indent === 6 && ['dependencies', 'devDependencies', 'optionalDependencies'].includes(group)) {
        entry = key; result.importer[group][entry] = {};
      }
      if (indent === 8 && entry && ['specifier', 'version'].includes(key)) result.importer[group][entry][key] = scalar(value ?? '');
    }
    if (section === 'packages' && indent === 2) result.packages.set(key, identity(key));
    if (section === 'snapshots') {
      if (indent === 2) { snapshot = key; identity(key); result.snapshots.set(key, []); }
      if (indent === 4) group = key;
      if (indent === 6 && snapshot && ['dependencies', 'optionalDependencies'].includes(group)) {
        result.snapshots.get(snapshot).push({ name: key, reference: scalar(value ?? ''), optional: group === 'optionalDependencies' });
      }
    }
  }
  if (!rootImporter && !Object.keys(result.importer).length) throw new Error('Missing root importer');
  return result;
}

export async function inventory(root) {
  root = resolve(root);
  const issues = [];
  const issue = (code, subject, detail) => issues.push({ code, subject, detail });
  const path = file => relative(root, file).split('\\').join('/');
  async function bytes(file) {
    try { return await readFile(file); }
    catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  }
  async function json(file) { const data = await bytes(file); return data ? JSON.parse(data) : null; }
  const manifestBytes = await bytes(join(root, 'package.json'));
  const lockBytes = await bytes(join(root, 'pnpm-lock.yaml'));
  if (!manifestBytes || !lockBytes) throw new Error('package.json and pnpm-lock.yaml are required');
  const manifest = JSON.parse(manifestBytes);
  const lock = parseLock(lockBytes.toString());
  const installedLock = await bytes(join(root, 'node_modules/.pnpm/lock.yaml'));
  if (!installedLock) issue('missing-installed-lock', 'node_modules/.pnpm/lock.yaml', 'Installed resolution cannot be corroborated');
  else if (!installedLock.equals(lockBytes)) issue('installed-lock-mismatch', 'node_modules/.pnpm/lock.yaml', 'Installed lock bytes differ from repository lock');

  const scopes = new Map();
  const direct = [];
  function reach(key, scope) {
    const id = identity(key).id;
    const visitedKey = `${scope}:${key}`;
    if (visited.has(visitedKey)) return;
    visited.add(visitedKey);
    if (!lock.packages.has(id)) { issue('missing-lock-package', key, `Referenced by ${scope}`); return; }
    if (!scopes.has(id)) scopes.set(id, new Set());
    scopes.get(id).add(scope);
    if (!lock.snapshots.has(key)) { issue('missing-snapshot', key, `Referenced by ${scope}`); return; }
    for (const edge of lock.snapshots.get(key)) {
      try { reach(`${edge.name}@${edge.reference}`, scope); }
      catch { issue('unsupported-edge', key, `${edge.name}@${edge.reference}`); }
    }
  }
  const visited = new Set();
  for (const [group, scope] of [['dependencies', 'runtime'], ['optionalDependencies', 'runtime-optional'], ['devDependencies', 'dev']]) {
    const declared = manifest[group] ?? {};
    const locked = lock.importer[group] ?? {};
    for (const name of sort(new Set([...Object.keys(declared), ...Object.keys(locked)]))) {
      const record = { name, scope, declared: declared[name] ?? null, lockedSpecifier: locked[name]?.specifier ?? null, resolution: locked[name]?.version ?? null };
      direct.push(record);
      if (record.declared !== record.lockedSpecifier) issue('manifest-lock-mismatch', name, group);
      if (!record.resolution) { issue('missing-direct-resolution', name, group); continue; }
      reach(`${name}@${record.resolution}`, scope);
      const metadata = await json(join(root, 'node_modules', name, 'package.json'));
      const expected = identity(`${name}@${record.resolution}`);
      if (!metadata) issue('missing-direct-metadata', name, group);
      else if (metadata.name !== name || metadata.version !== expected.version) issue('direct-metadata-mismatch', name, group);
    }
  }
  const peers = [];
  for (const name of sort(Object.keys(manifest.peerDependencies ?? {}))) {
    const resolutions = sort([...lock.packages.values()].filter(pkg => pkg.name === name).map(pkg => pkg.id));
    peers.push({ name, declared: manifest.peerDependencies[name], resolutions, optional: manifest.peerDependenciesMeta?.[name]?.optional === true });
    // Peer ranges belong to the consumer. Report locked development realizations
    // without claiming that these satisfy every supported peer range.
    for (const key of lock.snapshots.keys()) if (identity(key).name === name) reach(key, 'peer-realization');
    if (!resolutions.length) issue('missing-peer-realization', name, 'No locked local realization');
  }

  const metadataIndex = new Map();
  async function entries(dir) {
    try { return (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0); }
    catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  }
  const store = join(root, 'node_modules/.pnpm');
  for (const slot of await entries(store)) {
    if (!slot.isDirectory() || slot.name === 'node_modules') continue;
    const modules = join(store, slot.name, 'node_modules');
    const candidates = [];
    for (const child of await entries(modules)) {
      if (!child.isDirectory()) continue; // Dependency symlinks are not store owners.
      if (child.name.startsWith('@')) {
        for (const scoped of await entries(join(modules, child.name))) {
          if (scoped.isDirectory()) candidates.push(join(modules, child.name, scoped.name));
        }
      } else candidates.push(join(modules, child.name));
    }
    for (const directory of candidates.sort()) {
      const file = join(directory, 'package.json');
      const data = await bytes(file);
      if (!data) { issue('missing-store-metadata', path(directory), 'No package.json'); continue; }
      const metadata = JSON.parse(data);
      const id = `${metadata.name}@${metadata.version}`;
      const evidence = [];
      for (const legal of await entries(directory)) if (/^(licen[sc]e|copying|notice)(?:[.-].*)?$/i.test(legal.name) && legal.isFile()) {
        const legalPath = join(directory, legal.name);
        evidence.push({ path: path(legalPath), sha256: hash(await readFile(legalPath)) });
      }
      const item = { path: path(file), sha256: hash(data), license: metadata.license ?? null, legacyLicenses: metadata.licenses ?? null, repository: metadata.repository ?? null, evidence };
      if (!metadataIndex.has(id)) metadataIndex.set(id, []);
      metadataIndex.get(id).push(item);
      if (!lock.packages.has(id)) issue('unlocked-installed-package', id, item.path);
    }
  }
  const packages = [];
  for (const [id, pkg] of [...lock.packages].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) {
    const metadata = metadataIndex.get(id) ?? [];
    const signatures = new Set(metadata.map(item => JSON.stringify([item.license, item.legacyLicenses, item.repository, item.evidence.map(e => e.sha256)])));
    if (!metadata.length) issue('missing-installed-metadata', id, 'May be omitted optional/platform dependency; no license inferred');
    if (signatures.size > 1) issue('ambiguous-installed-evidence', id, 'Installed instances disagree on license/provenance evidence');
    for (const item of metadata) {
      if (typeof item.license !== 'string' || !item.license.trim()) issue('unknown-license', id, item.path);
      if (!item.evidence.length) issue('missing-license-file', id, item.path);
      if (!item.repository) issue('missing-package-provenance', id, item.path);
    }
    const declarations = direct.filter(item => item.name === pkg.name && item.resolution && identity(`${item.name}@${item.resolution}`).id === id);
    packages.push({ ...pkg, relationship: declarations.length ? 'direct' : 'transitive', scopes: sort(scopes.get(id) ?? ['unclassified-locked']), metadata });
  }

  const assets = [];
  const distributionRoots = [];
  async function walk(file) {
    const stat = await lstat(file);
    if (stat.isSymbolicLink()) { issue('unresolved-distribution-symlink', path(file), 'Not followed'); return; }
    if (stat.isDirectory()) { for (const child of await entries(file)) await walk(join(file, child.name)); }
    else if (stat.isFile() && /\.(svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf|eot|wasm|mp[34]|webm|pdf)$/i.test(file)) {
      assets.push({ path: path(file), sha256: hash(await readFile(file)), provenance: 'unknown', scope: 'distributed-asset-candidate' });
      issue('unknown-asset-provenance', path(file), 'Bytes do not establish origin or license; owner review required');
    }
  }
  for (const declared of sort(manifest.files ?? [])) {
    if (typeof declared !== 'string' || /[*?!{}\[\]]/.test(declared) || isAbsolute(declared) || relative(root, resolve(root, declared)).startsWith('..')) {
      issue('unsupported-distribution-pattern', String(declared), 'Only literal in-repository files/directories are inspected'); continue;
    }
    const file = resolve(root, declared);
    try { await walk(file); distributionRoots.push({ path: path(file), status: 'inspected' }); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      distributionRoots.push({ path: path(file), status: 'missing' });
      issue('missing-distribution-root', path(file), 'No build/install is performed');
    }
  }
  const legalFiles = [];
  for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
    const data = await bytes(join(root, name));
    legalFiles.push({ path: name, sha256: data ? hash(data) : null });
    if (!data) issue('missing-project-legal-file', name, 'Existing legal material required');
  }
  const notices = [];
  const noticeBytes = await bytes(join(root, 'THIRD_PARTY_NOTICES.md'));
  for (const [index, line] of (noticeBytes?.toString() ?? '').split(/\r?\n/).entries()) {
    if (!line.startsWith('## ')) continue;
    const match = /^## (\S+) (\d+\.\d+\.\d+(?:[-+][\w.-]+)?) \((.+)\)$/.exec(line);
    if (!match) { issue('unparsed-notice-heading', `THIRD_PARTY_NOTICES.md:${index + 1}`, line); continue; }
    const id = `${match[1]}@${match[2]}`;
    notices.push({ id, declaredLicense: match[3], line: index + 1, locked: lock.packages.has(id) });
    if (!lock.packages.has(id)) issue('unmatched-notice-reference', id, 'Heading has no locked identity; removal requires shipped-code/asset review');
    for (const item of metadataIndex.get(id) ?? []) if (typeof item.license === 'string' && item.license !== match[3]) {
      issue('notice-metadata-license-difference', id, 'Exact strings differ; no SPDX equivalence or legal conclusion inferred');
    }
  }
  const noticeIds = new Set(notices.map(item => item.id));
  const noticeCandidates = new Set([
    ...direct.filter(item => ['runtime', 'runtime-optional'].includes(item.scope) && item.resolution).map(item => identity(`${item.name}@${item.resolution}`).id),
    ...peers.flatMap(item => item.resolutions),
  ]);
  for (const id of sort(noticeCandidates)) if (!noticeIds.has(id)) issue('missing-notice-reference', id, 'No recognized direct runtime/peer heading; legal review required');
  return {
    schemaVersion: 1,
    inputs: { manifestSha256: hash(manifestBytes), lockSha256: hash(lockBytes), installedLockSha256: installedLock ? hash(installedLock) : null },
    project: { name: manifest.name, version: manifest.version, license: manifest.license ?? null, legalFiles },
    direct, peers, packages, notices,
    lockedSnapshots: [...lock.snapshots].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([resolution, edges]) => ({ resolution, edges: edges.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0) })),
    distributionRoots, assets: assets.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0),
    issues: issues.sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : JSON.stringify(a) > JSON.stringify(b) ? 1 : 0),
    limits: ['Metadata is evidence, not legal approval or SPDX validation.', 'Locked reachability is not proof of bundled or distributed code.', 'Literal manifest files are candidates, not an npm tarball inventory.', 'Copied/generated code, inline icons, CSS assets and external fonts need owner provenance review.', 'Notice completeness and commercial/license compatibility are not decided.'],
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length > 1 || args[0]?.startsWith('-')) {
    console.error('Usage: node scripts/check-license-inventory.mjs [repository-root]');
    process.exitCode = 2;
  } else {
    try {
      const report = await inventory(args[0] ?? process.cwd());
      process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
      process.exitCode = report.issues.length ? 1 : 0;
    } catch (error) { console.error(`Inventory input error: ${error.message}`); process.exitCode = 2; }
  }
}
