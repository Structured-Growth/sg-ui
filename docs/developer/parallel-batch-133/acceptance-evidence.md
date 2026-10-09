# Batch 133: retained acceptance evidence

Assigned criteria: W-20, Z-02, Z-05, Z-06. Reviewed source head:
`e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev` supplied baseline).
Review date: October 7, 2026. Isolated managed checkout:
`/Users/thomashall/.codex/worktrees/batch-133-acceptance-evidence/sg-ui`.

This is a current-head, read-only evidence assessment, not a migration inventory
or a new source audit completion claim. Only this report changes. The coordinator
alone decides acceptance, edits the master checklist and integrates work.
No install, test, build, pack, browser, performance or CI command ran. The head
above is the **inspected head**, not a runtime-tested head.

## Per-ID matrix

| Criterion | Status and exact supported slice | Remaining gate / owner |
| --- | --- | --- |
| W-20 | **Partial.** [Root guidance](../../../AGENTS.md), Purpose and boundaries, explicitly gives user requests precedence and treats source documents/issues/examples as task data. [Guidance provenance](../../agent-guidance-migration.md) preserves `Structured-Growth/learning-platform` at `8e63f1e16fc3d43d851908b312603a1099ca13d9`, explains adapted/omitted host concerns, and ends with the same evidence-only rule. [Manifest](../../extraction-manifest.json) retains that repository, commit and source root. These tracked statements fully support the narrow documented trust-boundary requirement; they do not prove every agent obeyed it. | Attribution accuracy remains partial: LICENSE §7 describes retired packages as current use; notices introduction describes five retired sections as direct runtime/peer packages despite no such declaration in current package.json. Coordinator must commission source/asset provenance and notice reconciliation; written policy alone cannot establish final legal accuracy. |
| Z-02 | **Partial; tracked implementation removal supported.** Current `src` and `.storybook` search has only two negative SSR assertions against `Mui`; no positive retired import/reexport, selector, mock or story requirement matched. No matching tracked filename in those trees. Public theme exports owned Provider/ThemeScope; AppThemeProvider is deliberately the same owned Provider under its preserved public name, not a former theme object. Current package dependency groups contain no retired packages. Existing guards inspect source/transitive imports and emitted declarations/output. | Fresh emitted declarations, CSS, maps, package export surface and tarball at the reviewed/integrated head remain unrun. The preserved AppThemeProvider name is intentional per the [theme mapping](../react-aria-theme.md), not an instruction to remove compatible names. Coordinator owns the validation window; no whole-parent completion inferred from guards or search. |
| Z-05 | **Partial; current manifest existence/provenance reconciliation supported.** All 201 manifest destination `present` flags match disk, including six removed/renamed records; all declared replacement paths exist. Original repository/commit/source paths remain intact. [Removal audit](../react-aria-removal-audit.md) explicitly classifies baseline and legal text as retained history, and leaves historical-reference policy open. Baseline inventory explicitly records `21adebd61bedfc6a1ed395fe664ff4be83896821`. | Literal historical strings remain in manifest and three baseline snapshots. Root must decide the exact necessary rewrite/disposition consistent with retaining verifiable repository/commit/path provenance. An old snapshot must not be relabeled as current, replaced with invented history, or silently excluded from a claim of literal removal. No Git-history rewrite is needed or authorized. |
| Z-06 | **Partial; actual notice/manifest discrepancy found.** THIRD_PARTY_NOTICES retains `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/material`, `@mui/x-data-grid`; package.json has none in any dependency group. Current notices also retain Lexical, React, Adobe interaction utilities, TanStack and Lucide/Feather attribution, matching retained dependency families. Package audit code preserves notices byte-for-byte, which proves inclusion only when executed, not correctness. | Absence of dependency declarations or branded strings does not prove absence of derived/copied source/assets. Source/asset review and exact shipped tarball reconciliation must precede deletion of any obsolete notice. LICENSE §7 and notice descriptions require coordinated factual review without changing commercial terms. Coordinator/attribution owner decides deletions; no notice was removed. |

## Evidence identities

Every blob below is obtained with `git rev-parse HEAD:<path>` at the inspected
head. Relative links point to retained tracked material; blob IDs make review
independent of later edits. These are source/document identities, not test passes.

| Retained file | Git blob |
| --- | --- |
| `AGENTS.md` | `11fa44a2628c9eb80cfebc595c5f31661b39a71b` |
| `LICENSE` | `9dbc843502f2b1e8f74ed4c4940c471e7cca8acd` |
| `THIRD_PARTY_NOTICES.md` | `a5a5cdef430e435077f85c002f4c7398a09c4c62` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `pnpm-lock.yaml` | `d312a82ec958b0badc4633899ec4510cbb655648` |
| `docs/agent-guidance-migration.md` | `cb414d84c958ee0096c5754245421ff593e2f5c9` |
| `docs/extraction-manifest.json` | `430d1211d1c2e0d5047da41eb2ced2ed745bbcf1` |
| `docs/developer/react-aria-removal-audit.md` | `0fcffdabebd08a1531bb8a16510a967157921482` |
| `docs/developer/react-aria-master-task-list.md` | `930c3c94d0d8b4a9c18e7528e860eabdb55ec5a1` |
| `src/theme/index.ts` | `32e4e1d82d1af0a7f10c51ed29d95ca4680ff444` |
| `src/theme/AppThemeProvider.tsx` | `42008e61fe333ebe8d36f461b7d85e0d4f352f14` |
| `.storybook/preview.tsx` | `b84d33831293a155cc571eef6545d7deed67b683` |
| `scripts/check-foundations.mjs` | `ecc96a852355231cc7845642c589980825a6356d` |
| `scripts/check-package.mjs` | `744f86595899989d90edc6cf590a757534c58f17` |
| `scripts/test-foundation-consumer.mjs` | `ff994cb7c9eaae3fbab58461c98ab0269a276c9c` |
| `docs/developer/react-aria-theme.md` | `f4c013be5314931ed051863eeb1ead6501594772` |
| `docs/developer/react-aria-icons.md` | `f2524b342566b5727f41267a9990eb405c0a6f32` |
| `docs/developer/react-aria-package-acceptance.md` | `7cf0740449017e0e1bb8d9c9450b51de154076e1` |
| `docs/developer/parallel-batch-01/packaging.md` | `d70b458523df2351d5cab246b40466cd2acc9676` |
| `docs/developer/migration-baseline/package.json` | `6d165973ea2e5b43c63556ed6fb4bef4eebb13b8` |
| `docs/developer/migration-baseline/public-api.json` | `26d82ff5765f1c667bc025e88ac107cc6f44ad99` |
| `docs/developer/migration-baseline/inventory.json` | `780460f2faf7513135b6eaa6efacb230b2f9c3ea` |

## Checks actually performed

- `git status --short`, `git rev-parse HEAD` and `git rev-parse codex/dev`
  established a clean supplied checkout at the baseline before isolated worktree
  creation. All subsequent inspection and this report use the isolated checkout.
- Read the assigned unchecked rows in the master task list, root guidance,
  guidance provenance, extraction metadata, commercial license, notice headings
  and attribution descriptions, removal audit, public theme mapping/implementation,
  Storybook production scope, icon mapping and package acceptance/report.
- `rg -n -i '@mui|@emotion|\bmui\b|\bMui[A-Z]\w*|\bemotion\b|\bmaterial-ui\b|mui-typography|baseGridSx' src .storybook`
  returned only `src/components/AppPageHeader/AppPageHeader.ssr.test.tsx:8`
  and `src/components/ExperiencePageNavigator/ExperiencePageNavigator.ssr.test.tsx:10`.
  Both reject `Mui` in SSR markup. This is lexical inspection, not AST/type or
  runtime validation. A simpler branded search omitted these bare `Mui` literals;
  the expanded expression is the relevant result.
- A Python read-only scan over all 1,110 `git ls-files` paths using the same
  expanded expression found 32 matching text files / 750 matching lines **before
  this report**. Active source matches were the two negative assertions;
  baseline snapshots, guides, legal text, manifest and rejecting scripts account
  for the other files. This confirms retained text exists, not Z-04 reacceptance
  or blanket literal removal. Opaque lockfile substring matches under broader
  searches are not dependency declarations.
- Python JSON inspection of package.json found zero `@mui/` or `@emotion/` names
  in dependencies, peerDependencies, devDependencies or optionalDependencies.
  Filename inspection found zero matching tracked names under src/.storybook.
- Python compared every manifest `present` flag to destination existence: 201
  entries, zero mismatches; every migration replacement exists. This verifies
  existence and retained metadata, not equivalent behavior or provenance of every
  line. Removed records include baseGridSx implementation/test, typography
  augmentation, former theme implementation/test; row-DnD test is renamed.
- Inspected `scripts/check-foundations.mjs` source/transitive boundaries and
  `scripts/check-package.mjs` emitted retired-reference/declaration checks,
  explicit retired theme-object checks, dependency checks and actual tarball byte
  comparison. The scripts were **not executed**. Their legal-file equality check
  intentionally does not decide whether the retained notices are accurate.

## Retained artifact and run limits

[Packaging batch 01](../parallel-batch-01/packaging.md) identifies base
`9f153642e827a14033d646cf0160730c0793bdfc`, implementation/evidence commit
`6ec39e6`, Node 24.21.0, pnpm 10.29.3 and TypeScript 5.9.3. It reports an earlier
full check and corrected React 18.3.1/19.2.3 packed consumer pairs; its own text
explains that consumers were corrected after the full check. It does not provide
one immutable current-head pass for this assignment, and this report does not
promote its results to the inspected head.

Existence inspection found all six named `/tmp/sgui-packaging-*.log` paths absent:
check, storybook, react18, react19, editor18, editor19. No dist, storybook-static,
test-results or playwright-report directory exists in this isolated checkout.
`git ls-files` found no tracked tarball or generated runtime result. The retained
Markdown report is available; its temporary logs/tarball are not independently
reviewable here. The package script itself deletes its temporary packed audit
folder in `finally`. No artifact digest was reconstructed or invented.

No engine/browser matrix, physical device, manual or assistive-technology session
was performed. These four attribution/removal criteria do not need an invented
native UI regression. Browser/AT results cannot establish legal provenance, and
historical package results do not close final Z acceptance. No optional browser
spec was added; no root browser window is requested by this report.

## Bounded follow-up handoffs (not executed)

1. **Z-02 emitted acceptance:** no source change identified. In the coordinator's
   validation window, freshly build the selected integrated head and run existing
   foundation/type/package guards plus packed React 18/19 consumer checks as
   required by final acceptance. Retain exact head, command/environment, logs and
   tarball digest/file inventory. Failures get a separate minimal owner assignment;
   this report does not request speculative production edits.
2. **Z-05 historical-reference decision:** candidate exclusive edit allowlist
   `docs/extraction-manifest.json`, `docs/developer/migration-baseline/inventory.json`,
   `docs/developer/migration-baseline/package.json`,
   `docs/developer/migration-baseline/public-api.json`,
   `docs/developer/react-aria-removal-audit.md`. Root first decides which literal
   changes are necessary; do not blindly edit the historical snapshots. Targeted
   checks: compare repository/commit/source-path provenance before/after, JSON
   parse and destination/replacement existence, inspect all changed literal hits
   and links. Unchanged legal/guard references must remain explicitly classified.
3. **W-20/Z-06 attribution discrepancy:** candidate exclusive edit allowlist
   `LICENSE`, `THIRD_PARTY_NOTICES.md`, `docs/developer/react-aria-removal-audit.md`.
   Only after a separate read-only source/asset/catalog attribution review, correct
   factual package descriptions and remove sections demonstrably obsolete without
   altering commercial-license terms or independently applicable notices. Existing
   icon mappings and Lucide/Feather notices are evidence inputs, not permission to
   remove attribution. Targeted checks: retained/copy-derived source and asset
   inventory against exact packed bytes, lockfile-resolved dependency notice map,
   commercial terms diff and unchanged provenance, package inclusion checks.

These follow-ups are proposals for coordinator ownership, not authorization for
this chat to change read-only files or to waive any parent gate.
