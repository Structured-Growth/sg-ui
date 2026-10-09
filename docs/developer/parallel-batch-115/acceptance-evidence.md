# Batch 115: current G-14–G-17 acceptance evidence

Reviewed on 2026-10-07 at exact pushed baseline
`e43bf604be74e0daf731bc990e6c3097f05ed89b` (B). Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-115-evidence/sg-ui`;
branch `codex/batch-115-acceptance-evidence`. Only this report changes.
The [four parent criteria](../react-aria-master-task-list.md) remain unchecked.
This is a distinct assessment of those criteria, not another M-row inventory,
migration/removal audit, or acceptance closure. Coordinator alone accepts and
integrates evidence and changes shared acceptance records.

## Per-ID matrix

| ID | Current finding | Exact evidence and remaining gate |
| --- | --- | --- |
| G-14 | **Partial; shared-style requirement supported by current source.** | Interaction CSS uses `vertical-align: middle` for headers/cells and shared centered flex wrappers for selection/reorder controls. Every owned cell type, including custom/image/menu/copyable/link, passes through the same centered `grid-cell-content` wrapper; parts share centered header/subheader styles. See blobs S1–S4. This establishes the implementation mechanism, not measured rendered baselines. No retained alignment-specific native result or enlarged-text/light/dark visual measurement was established here. Arbitrary host custom content/style remains host-owned. Coordinator can decide whether this narrow source proof satisfies the literal shared-style criterion; this report does not close it or claim whole visual acceptance. |
| G-15 | **Partial; all requested presentation states and announcement sources exist.** | S5 selects error first, then empty loading, retained refresh/loading, filtered/search no-results, ordinary empty. Retained statuses sit outside the scroller and retain rows; empty statuses use `renderEmptyState`. S6/S7 supply translated polite atomic status or assertive atomic alert, pending progress and host Retry. Public RowSubHeader forwards S6's title/toggle/edit/trailing content; expansion remains a host action, not a built-in grouped-row model. Existing parts/interaction tests assert these contracts, but were not run here. Historical busy/Retry results H1/H2 have missing original artifact directories. Named screen-reader/browser output and timing, including an empty status inside a busy table, remain unverified; no success announcement is fabricated after host pending clears. |
| G-16 | **Partial; interaction semantics and bounded focus behavior are defined.** | S5 uses React Aria Table/Cell/Row, selection and `onRowAction`, with owned identity/control-index focus repair, independent-grid ownership, page/page-size entry reset, and disappearing Retry repair. H3 defines an interactive `grid`, arrow movement across body cells/nested controls, roving entry and Tab exit; S8 contains the corresponding native assertions. H1/H2/H3 are historical bounded Chromium/WebKit reports, not current-head runs. Retained E1 supplies current-byte-matching Chromium reorder-focus/cancellation checks only. Manual keyboard/AT acceptance, full current engine matrix, arbitrary host widgets/off-entry focus and shell/footer composition remain open; static table mode is not claimed. |
| G-17 | **Partial; boundary and input alternatives are defined, retained native reorder proof exists.** | S5 and [reorder contract](../react-aria-grid-reorder.md) require complete client data on page zero in one page, no sort/filter/search, no pending/error, and at most one selected ID. Controls remain disabled outside that boundary. Drag snapshots reject replaced rows/identity, cross-grid and no-op moves; Move up/down emits the same host-owned request. React Aria owns drag announcements/cancel navigation, and S5 adds translated request status without claiming persistence. E1 retains 11/11 Chromium cases for pointer before/after, invalidation/cross-grid cancel, keyboard Escape/remount, Move commit/rollback/focus and emulated-touch Move. Physical-device long-press drag, spoken AT output, Firefox/WebKit successor proof and broader host/network behavior remain open. Emulated-touch taps do not establish touch dragging. |

## Current-source identities

Each identity below was obtained with `git rev-parse B:path`; links point at the
reviewed repository files. These are Git blobs, not asserted runtime passes.

| Ref | File | Git blob at B |
| --- | --- | --- |
| S1 | [Interaction styles](../../../src/components/AppDataGrid/ownedGridInteraction.module.css) | `5755e97b79b1befefca13e7b76126869ddfa9aa3` |
| S2 | [Cell styles](../../../src/components/AppDataGrid/ownedGridCells.module.css) | `498a1e051aef7671ade5091e994cbac03a48f464` |
| S3 | [Part styles](../../../src/components/AppDataGrid/ownedGridParts.module.css) | `a3e038bfea25cd1e0044c5ee51f52117842cf202` |
| S4 | [Cell renderer](../../../src/components/AppDataGrid/ownedGridCells.tsx) | `f1c3deb30e843e74b3b065d7e847374593acdd8d` |
| S5 | [Interaction](../../../src/components/AppDataGrid/ownedGridInteraction.tsx) | `c44cfd77b60afb1ad970351e6aaa9c34feb15473` |
| S6 | [Parts](../../../src/components/AppDataGrid/ownedGridParts.tsx) | `ccdbb11cc12e1a15b8406be1317320d74e2eb3f3` |
| S7 | [Status primitive](../../../src/experimental/Status/Status.tsx) | `58d1d5e1aba096e902199a2d71b5dd1a16325a8f` |
| S8 | [Native focus spec](../../../tests/browser/batch01-grid-focus.spec.ts) | `ce2134a4dac2c6f1049c41982a14c2eaa1d490ff` |
| S9 | [Busy spec](../../../tests/browser/batch05-grid-busy.spec.ts) | `8cde1ae1e96d196d134dcd756bd6e25be4a218a5` |
| S10 | [Retry spec](../../../tests/browser/batch08-grid-retry-focus.spec.ts) | `649ab065f8aa40408367cf0d5007178fc1ab5d6b` |
| S11 | [Reorder spec](../../../tests/browser/reorder.spec.ts) | `2449eb6339a6bf5eb9c1d193fe0ad3cc5d9acc91` |
| S12 | [Keyboard/Move spec](../../../tests/browser/batch01-grid-reorder.spec.ts) | `eeca05b54067ec5526fd5fce44c0de7ed3cef68e` |
| S13 | [Pointer invalidation spec](../../../tests/browser/inventory-pointer-reorder-invalidation.spec.ts) | `d2844873d0f38ff4d7b31cc35429ecb35eda643a` |
| S14 | [Public RowSubHeader mapping](../../../src/components/AppDataGrid/components/RowSubHeader.tsx) | `6730e8f6883fd0f72b6351b7dd6e64355febb93a` |

## Retained evidence and attribution

**E1 — directly inspected retained wave 34 evidence.** Root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/46471bab-1194-490a-bbc4-86adfcbb76e7/`.
Read root `evidence.json` and individual `results.json` files. Root initial/final
head is `12db3601e7fa0707c7c8d43f6e04c7fabf3c52ae` (T), final status empty,
source digest `96336b42b6263065483d14b25e5d7193e86d4d864f544b9b135f2b864eb5b110`,
build digest `867868632be1585f81d0a8d3b00088e917f6d69e4e561cae22ae6b9698d97933`.
Recorded runtime: Node 24.19.0, macOS Darwin 27.0.0, pnpm 10.29.3,
Playwright 1.63.0. All three relevant sessions specify Chromium:

| Retained session/results | Expected | Unexpected/skipped/flaky | Duration |
| --- | --- | --- | --- |
| `pointer-reorder-invalidation/results.json` | 3 | 0/0/0 | 3239.449ms |
| `grid-reorder-regression/results.json` | 5 | 0/0/0 | 8820.232ms |
| `grid-pointer-focus/results.json` | 3 | 0/0/0 | 6320.709ms |

Root also contains six separate editor passes; they are outside this assignment
and do not enlarge grid evidence. The [batch 59 report](../parallel-batch-59/pointer-drop-focus.md)
retains prior failed waves and ownership corrections. No earlier failure is
relabelled as a pass. `git diff --quiet T B -- path` returned success independently
for S1–S3, S5–S13: these selected source/spec bytes are identical. This transfers
narrow relevance to B, not a claim that the whole current source tree/build or
every runtime dependency was tested at B. The artifacts are local ignored files;
durable CI archival and the full current matrix remain coordinator-owned.

**H1 — historical busy record, artifact loss retained.**
[Batch 05](../parallel-batch-05/grid-busy.md) reports Chromium 2/2 and WebKit 2/2 at
`3219f168429cbadcc6d8300aa3a3a72490a1bda1`; Firefox 0/2 executed due to profile
launch failures (overall command exit 1). Direct existence check of original
`/Users/thomashall/.codex/worktrees/batch05-grid-busy/sg-ui/artifacts` returned
false. This report did not independently recover raw native results elsewhere.
Do not treat the documented counts as newly verified/current full-matrix proof.

**H2 — historical Retry record, artifact loss retained.**
[Batch 08](../parallel-batch-08/grid-retry-focus.md) reports Chromium 4/4 and
WebKit 4/4 at `a887cc06237bf3e677efff0b0529aa0759b1a5a7`; Firefox was not rerun.
Original `batch08-grid-retry-focus/sg-ui/artifacts` directory under managed
worktrees is absent. Report describes retained/empty Retry disappearance, scroll,
selection and external focus, with manual AT explicitly open. No fresh run here.

**H3 — historical focus record, artifact loss retained.**
[Batch 01](../parallel-batch-01/grid-focus.md) reports five cases per Chromium and
WebKit (10/10), native regression head
`39151928713a83f86785e15068b1df6a96cdb71b`, implementation
`60450cbe120111804d45c9004a1358bcebffccab`; Firefox failed before execution.
Original `batch01-grid-focus/sg-ui/artifacts` directory is absent. Its Node 26
local run is not supported-runtime/current-head proof. Focus/scroll contract is
still explicit and S8 remains, but filenames are not passing evidence.

## Exact inspection and bounded next work

Performed read-only Git status/HEAD/baseline verification; criterion and contract
searches; source reads of interaction, cells, CSS, Status and parts; test assertion
reads for parts/interaction/focus; report reads for busy, Retry, focus and pointer
invalidation/drop-focus; root/session JSON inspection and original-directory
existence checks; selected Git blob lookups and T-to-B file comparisons.
Two guessed browser filenames and one guessed RowSubHeader subdirectory did not
exist; those unsuccessful lookups establish no evidence. Actual paths were found
with `rg --files` before final link verification.

No install, tests, typecheck, build, pack, browser, performance, CI or global lease
command ran. This assignment establishes no new test pass. No demonstrated
missing production behavior requires an exclusive source fix handoff here.
No optional spec was added: existing deterministic native focus/busy/Retry/reorder
fixtures already cover the relevant automated contracts, while the remaining AT
and device gates cannot be truthfully closed by another Playwright test.

Coordinator validation handoff, **UNRUN at B**: if fresh focus/status evidence is
needed because original artifacts are unavailable, admit the existing
`batch01-grid-focus.spec.ts`, `batch05-grid-busy.spec.ts` and
`batch08-grid-retry-focus.spec.ts` in a fresh immutable build through the owned
validation window, retaining exact head and per-engine results. G-14 needs a
bounded rendered alignment review (mixed text/icons/actions/handles, multiline,
enlarged text and themes); no new production/story scope is reserved. G-15/G-16
need named screen-reader/browser pending/error/Retry/empty verification. G-17
needs physical touchscreen drag/cancel and spoken announcements plus current
engine checkpoint. Host network abort, persistence/rollback and stale-response
ownership remain host responsibilities; broader acceptance is not waived.
