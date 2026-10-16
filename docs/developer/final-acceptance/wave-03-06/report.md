# Wave 03-06 — distributed licenses and notices

Prepared two ready-to-apply patches and equal proposed file mirrors. **All four assigned A leaves remain partial**: the concrete text gaps are corrected in drafts, while final integration, candidate packing and provenance/reviewer evidence remain outstanding. No checklist/count changed and no legal approval is inferred.

Only this directory was written. No source, live legal document, manifest, lockfile, generated output, shared ledger, server, Git state or remote setting was modified. No install/build/catalog generation/browser run, commit/push/tag/publish or delegated work occurred.

## Concrete changes

- `notices.patch`: both THIRD_PARTY_NOTICES copies receive the 18 missing whole installed license texts, including the exact Apache-2.0 text and **Copyright 2024 SWC contributors.** from `@swc/helpers@0.5.23/LICENSE` (SHA-256 `d96eba1f1881334d50ffc144276dfa98e147a415e7c591ecdfcb81680361dc91`). Other additions cover five Floating UI packages, Preact signals, React types, aria-hidden, clsx, csstype, isomorphic.js, lib0, prismjs, react-error-boundary, tabbable, tslib and yjs. These are inclusive supplemental notices for the resolved runtime closure, not a declaration that each dependency is bundled in SGUI.
- All **20 existing full legal blocks** remain byte-identical within the Markdown fences. All five Emotion/MUI historical notice sections remain. No existing license, copyright, Lucide/Feather attribution or potentially applicable notice was removed.
- Existing grouped Adobe/TanStack/Lucide sections become ordinary package/version/license headings, with explicit cross-references to the shared license text. This resolves the current parser's three grouped-heading and six direct/peer-reference misses without modifying the checker or treating them as six missing licenses. The Adobe section includes `@internationalized/number@3.6.8`. Outdated proof/experimental-only descriptions are corrected.
- `factual-descriptions.patch`: separate reviewable correction to both LICENSE §7 example package lists and commercial guidance. Only dependency examples/inventory prose change. Every other LICENSE byte, including commercial rights, written agreement requirement and third-party rights, is preserved. Neither patch changes commercial terms or appoints a legal reviewer.

`proposed-files/` contains the exact proposed counterparts for all five changed documents. `baseline/` preserves the original two legal texts so the focused tests also remain runnable after integration. Patches pass `git apply --check`; they have **not** been applied.

## Evidence reuse and distribution classification

Read AGENTS, final acceptance, assignment, both prior reports/results, prior license inventories and coordinator integration evidence. `evidence.json` records current SHA-256s and confirms prior library manifest, repository lock, installed lock and all **55 previously compared installed license files** are unchanged. Prior report/results hashes still match the assignment. Existing full-text coverage therefore remains usable without rerunning the broad installed dependency inventory.

The draft contains all 55 normalized full texts (previously 18 absent). This is bounded text retention, not a legal compatibility ruling. The 18 additions are runtime-reachable; React types and csstype also have development scope. None is reclassified as development-only merely because its main contribution is types. `client-only@0.0.1` remains the sole runtime identity lacking recognized installed legal-file evidence; its MIT package field and React homepage are not a license text and no copyright was guessed.

All **1,778 current dist hashes match the coordinator's build** that passed actual packed-file equality. The retained coordinator `package.txt` proves its packed legal files matched the existing legal bytes. Its temporary tarball was removed by the checker; there is no durable final archive identity to reuse. This unchanged-output comparison does not certify concurrently modified source as rebuilt or establish packing of the new draft notices.

`output-ast.json` independently parses current JS/declarations using TypeScript 5.9.3: 981 external import/export/import-type references across 17 external package names. All 846 source maps lack embedded source content. The inspected library build uses per-file tsc emission and CSS compilation, not a JavaScript dependency bundler. `distribution-map.json` maps the 56 runtime/peer closure identities to bounded lexical reference evidence; the AST receipt is authoritative for syntactic references. Dependency packages remain external references where observed; transitive lock reachability alone does not establish bundled third-party bytes. Source-map paths and lack of embedded content do not prove absence of copied code. Docs/application bundle obligations remain separate from the library tarball.

Recursive named legal-file scans across all eight installed runtime Apache package roots found their LICENSE files and no separately named NOTICE/COPYING files. This does not rule out inline attribution, original upstream source notices or copied/adapted code; those still require provenance disposition. The old Adobe statement that no upstream implementation/styles were copied is preserved historical source documentation, not newly verified provenance approval.

## Executed validation

From repository root:

```sh
python3 docs/developer/final-acceptance/wave-03-06/prepare.py
/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node docs/developer/final-acceptance/wave-03-06/inspect-output.mjs
/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /tmp/sgui-calendar-validate.mjs /Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test docs/developer/final-acceptance/wave-03-06/verify-notices.test.mjs
git apply --check docs/developer/final-acceptance/wave-03-06/notices.patch
git apply --check docs/developer/final-acceptance/wave-03-06/factual-descriptions.patch
```

All exited 0. Node **24.19.0**, TypeScript **5.9.3**; Python **3.9.6** (actual runtime captured in results). Tests used the existing lease wrapper, acquired/released its own claims and passed **3/3**. These checks read document/input/output bytes; they are not native/browser/AT evidence. First receipt `notice-tests.txt` is retained. After making the baseline comparison independent of post-integration live LICENSE text, only these three affected document checks reran; final receipt is `notice-tests-final.txt`. No failed suite/build was hidden. An exploratory shell command looking for optional Node installations exited 1 because those paths were absent; bundled Node24 was then located with the workspace dependency tool. No install followed.

## Per-leaf disposition

| Original A leaf | Result | Concrete progress | Remaining exact successor |
| --- | --- | --- | --- |
| A-L-01 — verify actual selected dependency/asset/transitive licenses | Partial | Reused hash-equal per-version installed evidence, mapped 56 runtime/peer identities, retained 18 missing texts in draft and inspected emitted external references. | Obtain client-only verified legal/provenance bytes; resolve copied/inline/asset and docs-bundle distribution obligations; designated reviewer accepts final per-version conclusions. |
| A-L-02 — preserve Apache licenses/notices and required modified-file statements | Partial | Exact SWC license/copyright addition; all Adobe texts and existing notices retained; recursive Apache named legal-file evidence. No upstream implementation modified here. | Integrate reviewed text, prove final packed-byte retention; reviewer resolves copied/adapted/inline notices and any required prominent modification notices. No blanket “none required” conclusion. |
| A-L-04 — refresh notices from final shipped inventory, remove only after absence proved | Partial | Equal notice drafts, 18 additions, package/version parsing corrections, stale description corrections and all prior attributions retained. | Review/integrate, rerun scoped inventory/package check, retain final tarball/hash, record final provenance/notice decision. |
| A-Z-06 — remove obsolete notices only after source/asset absence, final notices match work | Partial | No notice removed; historical status is explicit. Concrete factual prose correction is separated from commercial rights. | Owner/reviewer resolves any historical-derived-material obligations before deletion; no deletion is needed for this patch. Join accepted final text to candidate tarball hashes. |

The exact original checklist statements, commands, input/evidence hashes and successors are preserved per leaf in `results.json`. `validation-plan.json` supplies exact coordinator commands and expected assertions. `verify-packed-notices.mjs` reads an existing candidate archive without extraction and verifies root/package/proposed notice equality plus packed LICENSE equality, printing archive/member hashes. It is prepared, **not executed**, because this chat cannot integrate shared files or claim a final approved archive. No browser/native suite or library rebuild is necessary for notice-only integration when the frozen build remains unchanged; independent source changes still require coordinator validation.
