from pathlib import Path
import difflib,json,hashlib
root=Path(__file__).resolve().parents[4];out=Path(__file__).resolve().parent;patches=[];preconditions={}
def propose(f,s):
 old=(root/f).read_text();p=out/'proposed-files'/f;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s)
 preconditions[f]=hashlib.sha256(old.encode()).hexdigest()
 patches.extend(difflib.unified_diff(old.splitlines(True),s.splitlines(True),fromfile='a/'+f,tofile='b/'+f))
f='packages/ui/scripts/check-package.mjs';s=(root/f).read_text()
s=s.replace("import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';","import { copyFile, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';\nimport { createHash } from 'node:crypto';")
s=s.replace("import { join } from 'node:path';","import { join, resolve } from 'node:path';")
s=s.replace('export async function checkPackage() {','export async function checkPackage({ retainPackedDirectory } = {}) {')
anchor="  console.log('Packed JS, declarations, CSS, maps and assets match the fresh build; exports and notices are retained.');"
insert="""  if (retainPackedDirectory) {
    // A fresh destination prevents accidental replacement of earlier candidate evidence.
    const destination = resolve(retainPackedDirectory);
    await mkdir(destination);
    const archive = await readFile(join(packedAudit, tarballs[0]));
    const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
    const files = [];
    async function recordFiles(directory, prefix = '') {
      const entries = (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
      for (const entry of entries) {
        const path = join(directory, entry.name);
        const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) await recordFiles(path, relativePath);
        else {
          assert(entry.isFile(), `Unexpected packed member: ${relativePath}`);
          const bytes = await readFile(path);
          files.push({ path: relativePath, bytes: bytes.length, sha256: sha256(bytes) });
        }
      }
    }
    await recordFiles(packedRoot);
    await copyFile(join(packedAudit, tarballs[0]), join(destination, tarballs[0]));
    await writeFile(join(destination, 'packed-audit.json'), JSON.stringify({
      schemaVersion: 1, capturedAt: new Date().toISOString(), runtime: process.version,
      archive: tarballs[0], archiveSha256: sha256(archive), files,
      technicalPackageAudit: 'passed', legalApproval: false,
      limits: ['Exact development candidate; not an official release or legal/asset-provenance approval.'],
    }, null, 2) + '\\n');
    console.log(`Retained exact candidate archive and SHA-256 file manifest in ${destination}`);
  }
"""
assert anchor in s;s=s.replace(anchor,insert+anchor)
s=s.replace('  await checkPackage();',"  const args = process.argv.slice(2);\n  assert(args.length <= 1 && args.every(arg => arg.startsWith('--retain-packed=') && arg.length > '--retain-packed='.length), 'Usage: node scripts/check-package.mjs [--retain-packed=/new/absolute/directory]');\n  await checkPackage({ retainPackedDirectory: args[0]?.slice('--retain-packed='.length) });")
propose(f,s)
f='docs/developer/react-aria-removal-audit.md';s=(root/f).read_text()
s+='''

## Current workspace audit (2026-10-16)

The dated Storybook/build paragraphs above describe the historical host and its
artifacts. Current maintained code lives in `packages/ui`; the replacement native
host lives in `apps/docs/native-fixtures`. No Storybook runtime is required.
The current [tracked-text receipt](final-acceptance/wave-03-35/tracked-text-audit.json)
reads all 1,657 tracked current text files, including hidden configuration,
personal state and baseline records, without publishing personal contents.
Its 811 matching lines in 61 files are classified; personal state has no matches.
Names in immutable baselines, removed-API mappings, guards, independent demo
identities, legal text and opaque integrity strings are retained as such. Owned
`scaleMotionDuration` is a substring false positive. These matches do not supply
an old runtime dependency. Legal/reference-owner decisions remain separate.
The receipt describes its captured bytes; later changes require scoped delta review.

The [symbol dispositions](final-acceptance/wave-03-35/public-symbol-dispositions.json)
join all 638 baseline route/name identities to the 469 captured contracts,
including aliases, helpers, presets, hooks, adapters and experimental exports.
Retained names can have breaking owned contracts: `MenuItem` changed from a JSX
component to an item-record type; `AppThemeProvider` aliases Provider. The twelve
absent baseline names each have an explicit owned replacement and release impact.
This symbol join does not certify inherited prop compatibility or complete row
acceptance. Review attribution, extraction metadata and remaining V evidence
are tracked independently.

For a durable candidate receipt, after the coordinator freezes and validates the
build, run `node scripts/check-package.mjs --retain-packed=/new/absolute/directory`
from `packages/ui`. The optional destination must not exist. The existing package
checks run unchanged, then retain that exact archive and every packed file hash.
Archive reference classification is separately reproducible with
`python3 docs/developer/final-acceptance/wave-03-35/audit-packed.py ARCHIVE --output docs/developer/final-acceptance/wave-03-35/candidate-audit.json`
from the repository root. This does not authorize notice deletion or assert
legal approval, frozen installed dependency closure, or a release identity.
'''
propose(f,s)
f='docs/developer/react-aria-grid-presets.md';s=(root/f).read_text().replace('The colocated catalog preset stories wire columns, sort rules and filter rules\nthrough controlled DataToolbar state.','The docs website preset examples and docs-owned native fixtures wire columns,\nsort rules and filter rules through controlled DataToolbar state.');propose(f,s)
(out/'retain-packed-and-audit-docs.patch').write_text(''.join(patches));(out/'patch-preconditions.json').write_text(json.dumps(preconditions,indent=2)+'\n')
