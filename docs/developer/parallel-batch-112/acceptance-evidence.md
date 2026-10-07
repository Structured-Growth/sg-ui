# Batch 112: acceptance evidence for U-20, M-38, M-44 and G-04

Read-only criterion inspection on 2026-10-07 at reviewed source head
`e43bf604be74e0daf731bc990e6c3097f05ed89b`. Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-112-evidence/sg-ui`; branch
`codex/batch-112-acceptance-evidence`. Sole changed file is this report.
No parent checkbox, inventory row, production source, shared configuration or
other report is changed. Coordinator alone accepts criteria and integrates.

## Per-ID matrix

| ID | Current evidence and bounded finding | Disposition and exact remaining gate |
| --- | --- | --- |
| U-20 | **Source removal supported.** A read-only scan of all 758 `.ts`/`.tsx`/`.css` files under `src` found zero `@mui`, `@emotion`, `Mui[A-Z]` or `\bsx[=:]` hits. [Boundary guard](../../../scripts/check-foundations.mjs) registers all 37 migrated directories and recursively resolves relative imports/reexports using a TypeScript AST. Explicit [AppThemeProvider alias](../../../src/theme/AppThemeProvider.tsx) directly reexports the owned Provider; it is a preserved public name, not a temporary retired-runtime bridge. [Storage conversion](../../../src/components/AppDataGrid/ownedGridPersistence.ts) is internal, reads four named legacy keys, normalizes owned values and explicitly refuses retired sort/filter models. | **Partial whole criterion; no missing runtime behavior identified.** Source evidence establishes the absence of the named retired patterns at the inspected head, not a newly executed AST/declaration/tarball check. Retain final emitted/package verification and the coordinator's explicit disposition of surviving compatibility paths. Do not remove a preserved public alias or host storage migration merely to satisfy wording. Historical/legal references remain governed by the [removal audit](../react-aria-removal-audit.md). |
| M-38 | **Individual tracking supported.** The [inventory acceptance record](../react-aria-migration-inventory-acceptance.md) contains exactly 37 distinct M-01–M-37 rows. Each separates implementation, linked evidence and remaining whole-row limits. It links original [draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1) and the [execution record](../react-aria-progress.md); later reports supply task-specific PRs/heads. Guard registration and current source scan support the transitive-boundary policy; no directory is treated as accepted merely because it has tests. | **Partial.** The record's original source review is `cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`, with later explicit coordinator reconciliations, not one current-head all-row validation. Original PR attribution is shared at document level rather than a complete explicit per-row PR + exact validation/artifact index. Coordinator must reconcile those links and held statuses against current source changes before closing M-38. This report does not repeat or supersede completed [29](../parallel-batch-29/inventory-acceptance-02-12.md), [30](../parallel-batch-30/inventory-acceptance-13-24.md), [31](../parallel-batch-31/inventory-acceptance-25-37.md) row reviews. |
| M-44 | **Concrete separation and fixtures supported.** [Grid capability matrix](../react-aria-grid-contracts.md) calls ordered multi-sort an enhancement over the legacy single-rule clamp, distinguishes nine-cell parity, state-owner correction, locking semantics and deferred features. [Shell contract](../react-aria-modal-shells.md) explicitly identifies responsive stacking and error/focus improvements as deliberate behavior changes. Historical [inventory](../migration-baseline/inventory.json) and [API snapshot](../migration-baseline/public-api.json) retain the original `21adebd61bedfc6a1ed395fe664ff4be83896821` provenance. Existing model/processing fixtures retain single-rule filtering, server host order, null/invalid values and stable ties alongside multi-sort; shell native fixtures retain desktop and narrow host compositions. | **Partial.** Concrete improvements are documented separately from parity and regression fixtures exist; this does not establish an exhaustive migration-wide improvement-to-legacy-use-case map or execution of every retained fixture at current head. Remaining work is evidence reconciliation, not demonstrated absent behavior. Coordinator should map each deliberate improvement and breaking mapping to its retained use-case fixture and original validation, preserving actual device/AT/manual limits. No new story or duplicate native regression is warranted by this audit. |
| G-04 | **Implementation and tests supported.** [Model](../../../src/components/AppDataGrid/ownedGridModel.ts) filters/searches before `createTable`, then uses TanStack sorted and pagination row models. Number parsing excludes blank/null/boolean/nonfinite/invalid operands including `neq`; date-only values use calendar validation and instants require an explicit timezone, with UTC-day filters and instant sorting. Text criteria trim/case-fold; null/blank and literal `null` remain distinct. Comparator uses natural English base-sensitive text order; equal keys retain source order. [Model tests](../../../src/components/AppDataGrid/ownedGridModel.test.ts) cover all operators, null/date/number/text, stable ties/frozen inputs and server bypass; [composed tests](../../../src/components/AppDataGrid/ownedGridProcessing.test.tsx) assert applied toolbar rules affect visible pages. Public AppDataGrid consumes the same model unless the host supplies `processingResult`. | **Partial retained execution, ready for coordinator targeted validation.** [Batch05 report](../parallel-batch-05/grid-processing.md) records 51 tests/2 files passing at `e77f604d44e38041b67aab5d9d37d6a1a0d85cd1`, Node24.21.0, PR15. Current model is changed by the later client display clamp, so that historical pass is not a current-head pass. [Batch14 report](../parallel-batch-14/client-page-shrink.md) records 120 tests/7 files at code head `3d4b9df15236bf30fbb3c6f0b2ec0e3d7384506c` and later distinct public/native corrections. Original unit logs are absent locally. Run existing model + processing tests at the coordinator's frozen candidate; no browser-specific processing gap or source fix was established. Broad G/native/device/AT acceptance remains separate. |

## Exact Git blob anchors at inspected head

All identifiers below were obtained with `git rev-parse HEAD:<path>` in the clean
isolated checkout. They anchor inspected bytes, not test execution.

| File | Git blob |
| --- | --- |
| `scripts/check-foundations.mjs` | `ecc96a852355231cc7845642c589980825a6356d` |
| `src/theme/AppThemeProvider.tsx` | `42008e61fe333ebe8d36f461b7d85e0d4f352f14` |
| `src/components/AppDataGrid/ownedGridPersistence.ts` | `81fdc3a2da57986fdb3e04c71a45a608bc12796e` |
| `docs/developer/react-aria-migration-inventory-acceptance.md` | `6688515f8ce8648dbcc3b5a5e025e2d8ef379473` |
| `docs/developer/react-aria-grid-contracts.md` | `a5bf300a3b1e31f8afdd208583d8d6f652f70fc9` |
| `docs/developer/react-aria-modal-shells.md` | `294a3e1d9882a565f95ebc793af42d786cbc3ba3` |
| `src/components/AppDataGrid/ownedGridModel.ts` | `9aec70184dc15e297f247647a67b6667d6bb0051` |
| `src/components/AppDataGrid/ownedGridModel.test.ts` | `c3671f338d127e01a0fb96632526fa34a4aa3837` |
| `src/components/AppDataGrid/ownedGridProcessing.test.tsx` | `9261d4d03a248147927496f6e06f66c724143430` |
| `docs/developer/parallel-batch-05/grid-processing.md` | `f4fe1c6996105a308db7a11d44d70cd94823764e` |
| `docs/developer/migration-baseline/inventory.json` | `780460f2faf7513135b6eaa6efacb230b2f9c3ea` |
| `docs/developer/migration-baseline/public-api.json` | `26d82ff5765f1c667bc025e88ac107cc6f44ad99` |

## Execution provenance and retention

Direct `git diff e77f604d44e38041b67aab5d9d37d6a1a0d85cd1 HEAD --` inspection
of the three processing files shows the model's later display-page clamp,
additional shrink tests and the date pagination assertion adjusted to the bounded
page. Parsing/comparison/filtering bodies are unchanged in that diff; the composed
processing test file is identical. The model's latest modifying commit is
`3d4b9df15236bf30fbb3c6f0b2ec0e3d7384506c`. This is narrow byte/source attribution,
not proof of unchanged transitive dependencies or an execution pass.

Direct filesystem existence checks found `/tmp/sgui-batch14-shrink-final-unit.log`
and `/tmp/sgui-batch14-shrink-red.log` absent, as well as original managed
`batch05-grid-processing/sg-ui` and `batch14-client-page-shrink/sg-ui` checkouts.
The committed reports and source/test bytes remain retained in Git; this worker
did not independently inspect the original unit output. Batch14's report records
three Chromium passes at `c9790bdbb2d16f288de8926086759d222a3c25bc` under
`artifacts/browser-pool/ff05d2df-5ab0-4bfb-8125-6d9583464c53/`, with Firefox/WebKit
pending in that record. Those native results concern shrink/focus/scroll, not all
G-04 semantics; their raw artifacts were not verified by this assignment.
No historical browser result is promoted to a current full-engine matrix.

## Checks actually performed and handoff

Read-only checks: clean baseline/status/head verification; source/report searches
with `rg`; direct guard/model/persistence/theme/contracts/report/test inspection;
Git blob resolution and the historical-to-current three-file diff; Python text
scan of 758 source files with zero named-pattern matches; Python row count with
37 unique IDs; filesystem retention checks above. The text scan is not execution
of the TypeScript AST transitive guard, nor a source audit superseding earlier
removal reports. A mistaken root `migration-baseline` lookup and guessed batch29
filename were corrected to the existing paths linked here.

Documentation checks: local relative-link existence and `git diff --check`.
No install, test, foundation guard, build, pack, browser, performance, CI or global
lease command ran. No optional `acceptance-pack-112.spec.ts` was created because
existing deterministic fixtures already cover the concrete semantics inspected.
No actual missing product behavior was established, so there is no exclusive
production-source fix allowlist or new fix conversation.

Requested coordinator window: existing targeted
`pnpm exec vitest run src/components/AppDataGrid/ownedGridModel.test.ts src/components/AppDataGrid/ownedGridProcessing.test.tsx`
at a frozen reviewed candidate, recording exact head/runtime/results; this is
**UNRUN** here. Final emitted/package removal belongs to the root's acceptance
checkpoint. Per-row PR/provenance and improvement/fixture reconciliation should
be handled in root-owned central documentation, without expanding this worker's
allowlist. All parent criteria remain unchanged; device, native/manual and spoken
assistive-technology evidence must retain their original limits.
