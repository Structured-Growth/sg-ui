# Batch 116: current-head acceptance evidence

Assigned parent criteria: **G-18, G-19, G-21, G-23**. Inspection date: 2026-10-07.
Inspected source head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev`).
This report evaluates the unchecked parent criteria at that exact head; it does
not repeat completed component-inventory reviews or declare migrated components
accepted. Only the coordinator accepts criteria and updates shared ledgers.

## Scope and checks performed

- Created and attached isolated managed worktree
  `/Users/thomashall/.codex/worktrees/batch-116-evidence/sg-ui` at the supplied head
  before any edit; branch `codex/batch-116-acceptance-evidence`.
- Read the master criteria, chosen capability matrix, engine ownership decision,
  current renderer/types/cells/native helper and relevant CSS/test assertions.
  Used `rg -n` and `rg --files` to locate actual implementation and test content.
- Inspected `AppDataGrid`, `AppDataGridRowDnd` and `AppDataGridShell` for
  `virtual|overscan|pinned|expanded|grouped|onEdit|onCommit|onCancel|editMode|dangerouslySetInnerHTML|Mui|MuiDataGrid`.
  Hits include test assertions rejecting pinning and the retained RowSubHeader
  host-action surface; they are explained below. This is a bounded search, not
  a whole-repository literal/declaration audit.
- Resolved the source/doc/spec Git blobs listed below using `git rev-parse
  HEAD:<path>`. Resolved retained historical commit objects and compared selected
  historical blobs to current blobs; inspected the clipboard-spec diff.
- Checked filesystem existence at the exact recorded artifact paths below.
  No CI API, remote artifact download, browser launch, install, test, typecheck,
  build, package, performance check or shared validation lease was performed.
  **Current-head runtime results: UNRUN.** Source assertions are inspected
  coverage, never inferred test passes.

## Per-ID evidence matrix

| ID | Current assessment | Concrete evidence at inspected head | Exact remaining gate / owner |
| --- | --- | --- | --- |
| G-18 | **Partial**: owned row resolution, token preview and cleanup implementation supported by inspection | Native helper resolves owned `data-sgui-part`/`data-grid-row` hooks, honors optional root ref, tracks preview/document refs and removes capture listener plus preview on dragend, replacement, cleanup/unmount and `setDragImage` failure. Preview uses textContent, compiled CSS and nearest owned theme scope. Public renderer uses container/table refs and owned data hooks for source focus, React Aria drag hooks and DropIndicator. Helper unit assertions and existing reorder specs cover bounded cancellation/cleanup. | Fresh coordinator validation at integrated head; native helper preview colors/lifecycle across supported engines, actual physical long-press and spoken AT cancellation/drop feedback remain unverified here. React Aria owns catalog native drag imagery; helper token styling is not proof that every browser-generated catalog drag image is theme-aware. Do not close G-18 from helper inspection. |
| G-19 | **Partial**: ownership/conditional feature decision supported; optimization acceptance unestablished | Capability matrix makes virtualization conditional and true sticky/pinned columns deferred. Engine decision assigns virtualization to SGUI rendering, disabled until workload need. Renderer has ordinary TableBody over pageRows and visible columns, no virtualizer/overscan API. Container ResizeObserver reads clientWidth and disconnects on cleanup; it measures column layout, not virtual row heights. | Coordinator must establish workload need/measurement evidence. If virtualization is selected, define row/column overscan, dynamic/variable-height measurements, focus across unmounts, logical screen-reader row/column positions, and interaction with any selected pinning before implementing. Current nonvirtualized focus/resize/wrapping coverage cannot prove these future contracts. Physical AT position reading remains a separate gate. |
| G-21 | **Partial**: required cell behavior present and inspected coverage retained | Owned cells route links through owned Link/SGLink, preserve target/rel and full labels, render text/JSON as React text, format dates via host locale/timezone/formatter and UTC date-only handling, show image fallback and retry changed src. Copy cells announce translated success/error in polite atomic status, disable unavailable values, bound feedback to three seconds and invalidate late completion on replacement/unmount. Unit/public-composed assertions and existing native clipboard spec are concrete retained coverage. | Fresh native execution at integrated head, especially changed clipboard spec and Linux Firefox; actual OS permission dialogs, physical device clipboard, spoken AT independent status regions/repeated announcements, and broad native cell image/date/link-focus presentation remain unestablished by this report. Source image onError and DOM role=status do not establish network/AT acceptance. |
| G-23 | **Supported for the chosen conditional scope by source/contract inspection**; parent checkbox remains coordinator-owned | Matrix explicitly defers grouped headers, row expansion and inline editing; public renderer has a single flat TableHeader and flat pageRows, and inspected props/column types expose no grid expansion/edit/commit/cancel/validation model. Thus none of these unchosen features needs adding for parity. Existing RowSubHeader is required host-action parity, not grid row expansion or inline cell editing. | No production implementation handoff is warranted under current matrix. If the coordinator changes requirements, first choose the feature and document edit/commit/cancel/validation and state ownership before implementation. This conditional finding does not close unrelated G or broad acceptance gates. |

## G-18: distinctions that affect acceptance

[Native helper](../../../src/components/AppDataGridRowDnd/useDataGridRowDnd.ts)
uses `closest(rowSelector)` and coordinate/composed-path fallback. Its default
selector is an owned part/data identity selector, not a retired renderer class.
The public renderer still legitimately queries owned data hooks within its ref
for source/focus recovery; G-18 is not a claim that all DOM queries disappeared.
The helper's optional rowSelector remains consumer control.

[Preview styles](../../../src/components/AppDataGridRowDnd/DataGridDragHandle.module.css)
use surface/text/border/focus tokens and forced-colors rules. Scope falls back to
body when the caller supplies no owned scope; consumers must load styles and
provide Provider/ThemeScope. Theme-aware CSS is inspectable evidence, not a native
screenshot. [Helper tests](../../../src/components/AppDataGridRowDnd/useDataGridRowDnd.test.tsx)
assert root isolation, composed paths, coordinate fallback, scope placement,
replacement/unmount, listener balance, dragend and rejected drag imagery. Their
synthetic jsdom dragend does not certify trusted physical native cancellation.

[Batch 01 record](../parallel-batch-01/grid-reorder.md) retains a historical report
of six helper unit passes and 16 Chromium/WebKit reorder cases, with Firefox
blocked at launch (`Could not find profile folder`). It identifies implementation
commit `4fbab81aa4b992e6dff475b98ec0f3a4d06b9a5d`; the final clean browser run's
exact committed test head is not stated there. I verified that helper source,
helper unit spec and batch01 browser spec blobs at that commit equal the current
blobs. Equality of selected files does not establish unchanged dependencies,
build output, device behavior, or a current-head run. Physical touch Move taps
are distinct from long-press dragging. Host network persistence/abort/rollback
ownership remains intact.

## G-19 and G-23: chosen requirements, not missing implementations

[Capability matrix](../react-aria-grid-contracts.md#required-capability-matrix)
and [ownership decision](../react-aria-grid-decision.md#authoritative-ownership)
are current retained decision evidence. They defer true pinning rather than
relabeling column locks/order as pinning. The 1,000-row/250-row smoke described in
browser acceptance is neither workload justification nor an overscan decision.
No benchmark was rerun or promoted into virtualization acceptance.

[RowSubHeader](../../../src/components/AppDataGrid/ownedGridParts.tsx) exposes
controlled expanded display, onToggle and onTitleDoubleClick/keyboard Edit
callbacks. It does not store expanded row IDs or edit a cell value; the host
chooses resulting UI. Its existence prevents claiming an absence of all expansion
or editing words, but does not contradict deferred grid expansion/edit models.
AppDataGridProps is built from OwnedGridInteractionProps; source inspection of
that underlying props surface, renderer and owned columns is part of this finding.
No fresh package/declaration audit was run.

## G-21: historical execution and artifact limits

[Cell source](../../../src/components/AppDataGrid/ownedGridCells.tsx),
[owned tests](../../../src/components/AppDataGrid/ownedGridCells.test.tsx) and
[public composition](../../../src/components/AppDataGrid/AppDataGrid.cells.test.tsx)
show the actual behavior/assertions, including invalid dates, host timestamp zones,
cyclic/BigInt JSON fallback, link adapter calls, image error/retry, copy payloads
and independence from selection. [Link CSS](../../../src/experimental/Link/Link.module.css)
uses native :focus-visible with owned tokens. That styling does not prove native
focus visibility for every grid link in every engine/theme.

[Batch 05 record](../parallel-batch-05/grid-clipboard.md) retains the exact historical
browser head `07e514ec86fb4d6bb7025a9ae1cd1f349b3fc82f`: Chromium 4 passes,
WebKit 3 passes/one Chromium-only denial skip, Firefox 4 pre-page launch failures.
It records Storybook built at `e39e6947384e37c5e02cc3293e816b2acc086e93`, not
a rebuild at the final test head. Native Chromium permission denial is distinct
from injected API rejection in its other case. The report's 19 unit tests are
historical and identified with `b86053683861927ce5710fb6d8287cfe9e7ce360`.

The current cell source and unit-test blobs equal those at `07e514e`; the current
browser spec **differs**: it derives/validates the loaded loopback origin and
applies grant/denial after opening the story, replacing a fixed port. Its historical
blob is `e0e35c8906083b3c92e0d7648f417dbb56210892`; current blob is listed below.
Historical passes therefore do not validate even that current spec. Rerun the
existing meaningful spec in the coordinator window; a duplicate Batch 116 spec
would add no demonstrated regression coverage.

Filesystem inspection found these exact referenced artifacts **absent**:

- `/tmp/sgui-batch05-grid-clipboard-browser-final.log`
- `/tmp/sgui-batch05-grid-clipboard-firefox-tmp.log`
- `/tmp/sgui-batch05-grid-clipboard-storybook.log`
- `/tmp/sgui-cell-wrapping.png` (the representative wrapping screenshot referenced
  by the cell acceptance document)
- `artifacts/browser-results.json` in this isolated worktree

Git retains report/source/spec blobs and the historical commit objects. Missing
local files do not prove remote artifacts expired or were lost globally; remote
retention was not inspected. No reconstructable current tested build/head/engine
matrix or manual/device/AT artifact was established. The cell acceptance report's
33-test run and wrapping image also lack an exact tested head in that report;
they remain historical narrative rather than fresh acceptance evidence.

## Bounded next work and readiness

No actual missing required behavior was demonstrated by this read-only inspection.
No production source handoff or optional acceptance-pack-116 spec was created.
No new story/fixture/config is needed for the existing bounded regressions.
Coordinator-owned next validation should use the existing helper/cell unit specs
and `batch01-grid-reorder.spec.ts`, `reorder.spec.ts`,
`batch05-grid-clipboard.spec.ts` against one freshly built integrated head, recording
exact build/test head, engines, skips/failures and retained artifacts. All are
**UNRUN in Batch 116**; no window or lease was taken. Broader preview/device/AT and
conditional virtualization requirements must remain separately bounded work.
Only this report is changed; no acceptance ledger, source, shared config, master
checkbox, other report, primary image-upload worktree or other managed worktree
is changed. No merge/publish is performed.

Report-only verification: `git diff --check` passed; every relative Markdown
file link resolves to a retained repository file. No UI validation is implied.

## Exact retained Git blobs at inspected head

Use `git show e43bf604be74e0daf731bc990e6c3097f05ed89b:<path>` or the blob object
to reproduce the inspected text independently of later branch movement.

| Path | Git blob |
| --- | --- |
| `docs/developer/react-aria-master-task-list.md` | `930c3c94d0d8b4a9c18e7528e860eabdb55ec5a1` |
| `docs/developer/react-aria-grid-contracts.md` | `a5bf300a3b1e31f8afdd208583d8d6f652f70fc9` |
| `docs/developer/react-aria-grid-decision.md` | `cf388695dc6ef491bbf64145ceb89bc570a4dd1f` |
| `src/components/AppDataGridRowDnd/useDataGridRowDnd.ts` | `6c2c6d76954c7f1cd2351de9b1c0804c57e1f9f7` |
| `src/components/AppDataGridRowDnd/useDataGridRowDnd.test.tsx` | `061bf18e9b281c84efb083b0532c6df59d79a079` |
| `src/components/AppDataGridRowDnd/DataGridDragHandle.module.css` | `f331bcbd9abba031a83899ced65c30a16903ac17` |
| `src/components/AppDataGrid/AppDataGrid.tsx` | `a0eee627e275734ad8e7eac95caf7913bf6dc94e` |
| `src/components/AppDataGrid/ownedGridInteraction.tsx` | `c44cfd77b60afb1ad970351e6aaa9c34feb15473` |
| `src/components/AppDataGrid/ownedGridColumns.ts` | `5c5ae8541622c9689db5ed74d5eaf1c1c5f8f18d` |
| `src/components/AppDataGrid/types.ts` | `aa61aad90e0d22b1f75addbf4b01c5fec63a5db7` |
| `src/components/AppDataGrid/ownedGridParts.tsx` | `ccdbb11cc12e1a15b8406be1317320d74e2eb3f3` |
| `src/components/AppDataGrid/ownedGridCells.tsx` | `f1c3deb30e843e74b3b065d7e847374593acdd8d` |
| `src/components/AppDataGrid/ownedGridCells.test.tsx` | `40a647b4693408d5d1168fbbfe07f50dae527b8d` |
| `src/components/AppDataGrid/AppDataGrid.cells.test.tsx` | `f8e96a3fb538c63539ddc9c3eaf6cb7015287c3a` |
| `src/experimental/Link/Link.tsx` | `0eb6f15f598350a6b6e246eed3b7e59367dcae49` |
| `src/experimental/Link/Link.module.css` | `ded1ad785fa022d1cb0c1fc612d9a8e4d34e153d` |
| `docs/developer/parallel-batch-01/grid-reorder.md` | `0967aa5a34fff0317cd5f2e80bbed93d6459a99e` |
| `docs/developer/parallel-batch-05/grid-clipboard.md` | `4b70d6e68ce6c61c8a5568c4485e0add3e68e2e9` |
| `docs/developer/react-aria-grid-cell-acceptance.md` | `6c5e7cd5c60e716a77d8885c596820d6469845d4` |
| `tests/browser/batch01-grid-reorder.spec.ts` | `eeca05b54067ec5526fd5fce44c0de7ed3cef68e` |
| `tests/browser/reorder.spec.ts` | `2449eb6339a6bf5eb9c1d193fe0ad3cc5d9acc91` |
| `tests/browser/batch05-grid-clipboard.spec.ts` | `bcc2517d1a5a41b30f7253d4a97c1812a00c4590` |
