import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
/** Validates evidence completeness only; never performs or grants visual approval. */
export function validateReceipt(receipt, root = process.cwd()) {
 const errors = [];
 if (receipt.schemaVersion !== 1) errors.push('schemaVersion must be 1');
 for (const field of ['reviewer','reviewedAt','sourceManifestPath','hostManifestPath','engineVersion','reason']) {
  if (!nonempty(receipt[field])) errors.push(`missing ${field}`);
 }
 if (!Number.isFinite(Date.parse(receipt.reviewedAt))) errors.push('invalid reviewedAt');
 for (const prefix of ['sourceManifest','hostManifest']) {
  try { if (hash(resolve(root,receipt[`${prefix}Path`])) !== receipt[`${prefix}Sha256`]) errors.push(`${prefix} hash mismatch`); }
  catch { errors.push(`${prefix} unreadable`); }
 }
 if (!Array.isArray(receipt.changes) || !receipt.changes.length) errors.push('no image changes');
 const seen = new Set();
 for (const [i, change] of (receipt.changes ?? []).entries()) {
  const fail = text => errors.push(`image ${i}: ${text}`);
  if (seen.has(change.afterPath)) fail('duplicate afterPath'); seen.add(change.afterPath);
  for (const field of ['family','theme','density','viewport','fixtureId','interactionReceipt','observation']) if (!nonempty(change[field])) fail(`missing ${field}`);
  if (!['accepted','rejected','deferred'].includes(change.disposition)) fail('explicit disposition required');
  if (change.disposition !== 'accepted' && !nonempty(change.followUp)) fail('followUp required');
  if (change.beforePath === null && !nonempty(change.newBaselineReason)) fail('new baseline requires reason');
  for (const prefix of ['before','after']) {
   if (prefix === 'before' && change.beforePath === null) continue;
   try { if (hash(resolve(root,change[`${prefix}Path`])) !== change[`${prefix}Sha256`]) fail(`${prefix} hash mismatch`); }
   catch { fail(`${prefix} unreadable`); }
  }
 }
 return errors;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
 const errors=validateReceipt(JSON.parse(readFileSync(process.argv[2],'utf8')));
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
 else console.log('Receipt structurally complete; human observations remain review evidence, not verified by this tool.');
}
