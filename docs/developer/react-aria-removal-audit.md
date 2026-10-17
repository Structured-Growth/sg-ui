# Retired foundation removal audit

Task references: Z-02–Z-08. This record separates implementation removal from
historical and legal text. It does not claim literal removal from every file.

The initial audit inspected all 779 tracked files at `c78a24e`, including hidden
configuration, the lockfile, extraction records, baseline captures, instructions,
scripts and notices. A broad case-insensitive search found 29 matching files and
752 matching lines; every matching file was inspected. These counts describe
that snapshot rather than a permanent acceptance threshold.

| Matches | Finding and disposition |
| --- | --- |
| Active source | No retired positive imports, reexports, selectors, augmentation or branded implementation filenames remain. Two SSR assertions explicitly reject retired markup. |
| Guard scripts | Twelve lines reject retired imports, declarations, dependencies or exports. The consumer type proof deliberately imports an unavailable former export with `@ts-expect-error`. These are regression checks, not runtime requirements. |
| Baseline captures | 689 matching lines in `migration-baseline/inventory.json`, `package.json` and `public-api.json` record baseline commit `21adebd61bedfc6a1ed395fe664ff4be83896821`. They remain historical snapshots, not installable manifests or current API guidance. |
| Extraction manifest | Six deleted/renamed destinations were incorrectly marked present. Their existence flags and owned replacement metadata are now reconciled. Original source repository, commit and paths remain unchanged. |
| Lockfile | Four broad substring matches occur inside opaque integrity hashes. No retired package key or dependency resolution remains. |
| Guides and instructions | Migration mappings and historical execution entries identify removed APIs. Stale current grid descriptions were corrected; historical entries retain their original batch scope. |
| Legal files | LICENSE and five retired-package notice sections still contain names. They are preserved. Removing obsolete notices requires a separate source/asset provenance review; this batch makes no license or notice change. |

Z-03's physical filename removal and referencing-file review are complete. The
old grid styling module is replaced by the owned interaction/grid/cell/status CSS
modules and associated behavior tests. Typography augmentation and theme objects
are removed, with generated typography tokens and owned scopes as replacements.
The [extraction manifest](../extraction-manifest.json) records the exact paths.
Z-04's tracked-file inspection is complete. The current historical-reference
policy is documented in the lineage reconciliation below; Z-06's notice
reconciliation remains open.

The initial generated `dist` audit inspected 1,628 files and found no retired
references, including source maps. `pnpm test:package` now recursively rejects
retired filenames and text in emitted JavaScript, declarations, CSS, JSON/maps,
SVG, HTML and text assets. This extends the existing source/transitive and public
declaration guards to emitted modules outside public declaration directories.
The guard does not silently exclude source maps.

An existing final Node 24 foundation tarball contained 1,632 files. Its only
retired references were in LICENSE and notices; no packaged implementation,
declaration, CSS, map, asset or package dependency required the retired foundation.
Its grid declarations/styles matched the audited `dist`, but its README predates
this batch. This is prior-artifact evidence, not final exact-head validation.
Z-08 remains open for complete final tarball and legal reconciliation.

The generated Storybook includes Emotion in its own vendored DocsRenderer and
manager runtime. That is development-tool code outside the library tarball.
Other broad substring hits such as `decompressFromUint8Array` are unrelated.
Do not patch vendored Storybook output or claim its text is the shipped library.
This batch rebuilt dist/Storybook and produced eight fresh packed consumer
fixtures, closing Z-07. Final complete tarball/legal reconciliation remains Z-08.

## Current provenance supplement — 2026-10-16

The counts and Storybook output references above retain their dated audit scope.
Current source/scripts live under `packages/ui`; current private native scenarios
live under `apps/docs/native-fixtures`. The extraction manifest now accounts for
workspace moves and removed story modules. See [lineage reconciliation](extraction-lineage.md)
for exact local AppButton story/unit dispositions and the upstream evidence limit.
Keep original Git objects, source paths, snapshots and execution receipts unchanged.
These precise historical identifiers do not establish active dependencies.
Repository instructions preserve original acceptance names, source provenance
and historical execution evidence. Maintained implementations and consumer
examples use current owned APIs, with emitted-output/dependency guards enforcing
removal. Legal-notice reconciliation retains its separate open decision.


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
