# Batch 109: H-16, H-17, P-11 and U-01 evidence

Reviewed 2026-10-07 at exact baseline/source head
`e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev`). Isolated managed
worktree was created before edits at
`/Users/thomashall/.codex/worktrees/batch-109-evidence/sg-ui`;
branch `codex/batch-109-acceptance-evidence`.
Only this report changes. Coordinator alone accepts criteria and integrates.

This is a fresh read-only assessment of four unchecked parent criteria, not an
M-row inventory review or a new runtime pass. No install, test, build, pack,
browser, performance, CI or resource-lease command ran. Historical test outcomes
below are attributed to their reports; absent raw artifacts are not reconstructed.

## Criterion matrix

| Criterion | Current-head finding | Disposition and remaining gate |
| --- | --- | --- |
| H-16: coherent page reset/clamp for filters, sizes, unknown counts and disappearing rows | `ownedGridState` resets filter/search/sort and changed-size transactions to page zero; callbacks emit pagination before one complete state snapshot. `ownedGridModel` clamps the complete filtered client dataset's display page while retaining requested host criteria. Public grid requests use `processed.rowCount`; server rows remain pass-through and unknown counts use `hasNextPage`. Shell tests retain controlled rejection/acceptance, zero/unknown totals and grid/list/cards shrink coverage. | **Partial runtime acceptance.** The old batch11 client mismatch is resolved in current source, not a new missing behavior. Existing tests/specs suffice for a coordinator current-head run. Source changed since historical shell native evidence; missing artifacts and incomplete engine/manual/device/AT evidence prevent a parent pass. Hosts own server request cancellation, stale-response filtering and response/deletion reconciliation. |
| H-17: independent tab/card/grid view state | Controller criteria live in instance-local React state. Memory-only persistent hooks default to isolation, even with equal keys; local/session scopes and distinct keys are separate. Shell composed tests explicitly isolate selection/sort/filter for independent grid/card instances, preserve distinct-key preferences on remount and omit saved selection. Tabs receive host-controlled selection and content; inactive panels unmount and the contract tells hosts to retain cross-tab drafts. | **Partial.** Grid/card isolation has concrete source and retained test assertions. No current execution pass is inferred. The inspected evidence does not establish a combined tab-switched grid/card view with preserved host state and unrelated-instance isolation. Define host-owned state retention on tab unmount and exercise that composition before parent acceptance. Same storage scope/key deliberately shares persistent preferences; it is not an unrelated-view guarantee. One shell intentionally shares state between its list/card presentations. |
| P-11: document prototype outcomes, APIs, limits and accessibility gaps without claiming a production release | Execution record distinguishes first button/field proof, dialog/form continuation, async/calendar/grid proof and engine findings from catalog migration. Proof-control documentation records owned callbacks, refs, controlled state, panel unmounting and portal limits. Calendar documentation records accessibility limits; grid comparison records ownership, missing virtualization and device/AT gaps. Migration guide expressly retains experimental proof status and says no release or migration completion is claimed. | **Fully supported as a documentation criterion at the reviewed head.** This finding does not accept P-07, runtime prototype behavior, a production release or whole P completion. No runtime artifact is necessary to establish that these documentation statements exist. Coordinator may reconcile P-11 using the exact Git blobs below. |
| U-01: Button, IconButton, split action and groups with pending/disabled/form/link/focus semantics | Button owns default `type="button"`, native form attributes/ref, disabled/pending mapping and pending-reset suppression. Native submit/reset host callbacks use click capture to run once before the form default. IconButton composes Button with required action label and decorative icon. SplitAction separates primary/menu callbacks and closes/guards the menu during host loading/disabled changes. ButtonGroup is a named native group with child-owned behavior; links remain separate controls. Tests explicitly cover the requested semantics. | **Partial runtime acceptance.** Historical focused Button and SplitAction Chromium/WebKit and ButtonGroup Chromium evidence exists as committed reports, with exact heads below. Isolated IconButton native coverage is explicitly missing in its report. ButtonGroup corrected Firefox/WebKit, current composed link/action/form/focus checks and manual/device/AT acceptance remain pending. No implementation defect is established by this inspection. |

## Exact source identity

All values are Git blob IDs from `git rev-parse <reviewed-head>:<path>`, not
checksums of an assumed build. Paths are repository-relative.

| Path | Blob |
| --- | --- |
| `docs/developer/react-aria-master-task-list.md` | `930c3c94d0d8b4a9c18e7528e860eabdb55ec5a1` |
| `docs/developer/react-aria-progress.md` | `ba00dce42931499695a89c8ae67bf5129007892f` |
| `docs/developer/react-aria-proof-controls.md` | `cdab2ff6b34438f02fdeaa0784b76c2169b0b107` |
| `docs/developer/react-aria-calendar-contracts.md` | `3a3c1a7efbad904f16155e9977768c375f4d2c94` |
| `docs/developer/react-aria-grid-decision.md` | `cf388695dc6ef491bbf64145ceb89bc570a4dd1f` |
| `docs/migration.md` | `c16a7ab44e0533329f80d69c3c0c43db766e877f` |
| `src/components/AppDataGrid/ownedGridModel.ts` | `9aec70184dc15e297f247647a67b6667d6bb0051` |
| `src/components/AppDataGrid/ownedGridState.ts` | `9ef583ee584e484ef148952e6531a48635929073` |
| `src/components/AppDataGrid/AppDataGrid.tsx` | `a0eee627e275734ad8e7eac95caf7913bf6dc94e` |
| `src/components/AppDataGridShell/AppDataGridShell.tsx` | `32310c5053ef335e38709f1650a7909be214722f` |
| `src/components/AppDataGridShell/AppDataGridShell.test.tsx` | `8021a0ae121cc0ea415e62bbb7d6e0070e8d3ed1` |
| `src/hooks/usePersistentState.ts` | `af48e9db8a583efbbe08fd290ef5a9d7eb8b8335` |
| `src/hooks/usePersistentState.behavior.test.tsx` | `d8449eccb334150c16e7dd89340a7cba806ac673` |
| `src/experimental/Tabs/Tabs.tsx` | `1ebeec17270334ad7f52a32dd966ebd43595955a` |
| `src/experimental/Button/Button.tsx` | `4969d84ac106e7346c8e054974d7d6a38a5d0cfc` |
| `src/experimental/IconButton/IconButton.tsx` | `4e138431786d5c5166a54fab22171824960fdf0c` |
| `src/experimental/SplitAction/SplitAction.tsx` | `50f18c4dd2f083f8a8428b08120283d1b306a23c` |
| `src/experimental/ButtonGroup/ButtonGroup.tsx` | `51a1ccdc929654f454afec16e8d1aa594ef5c414` |

## Historical runtime attribution and retention

| Retained Git report/spec | Reported tested head and outcome | Verification at reviewed head |
| --- | --- | --- |
| [Shell state](../parallel-batch-05/grid-shell-state.md), `tests/browser/batch05-grid-shell-state.spec.ts` | `556df283d8ecc5e664528a7a2a302abf0205d677`: 8 Chromium/WebKit cases; Firefox failed launch before assertions. 17 shell unit cases, later 28 composed cases reported. | Spec blob `63accb4f81f13f82c9de0a788ba59ff265495969` matches historical head. Current shell test blob differs; retained assertions were inspected, not executed. `/tmp/batch05-grid-shell-browser.log` is absent. |
| [Client shrink](../parallel-batch-14/client-page-shrink.md), `tests/browser/batch14-client-page-shrink.spec.ts` | `c9790bdbb2d16f288de8926086759d222a3c25bc`: 3 Chromium cases; Firefox/WebKit pending. Earlier source/unit evidence: 120 tests/7 files and correction 30/2 reported. | Model, AppDataGrid and spec match historical Git blobs; spec `73c089164056935815e1882842b87df3004c2a08`. Shell differs from historical blob `505d9f66cde70b77f632437e5da9937a5f24a58c`: subsequent card measurement, focus-reveal/repair and entry-scroll changes. `/tmp/sgui-batch14-shrink-final-unit.log` absent. Pool `ff05d2df-5ab0-4bfb-8125-6d9583464c53` not recovered. |
| [Button](../parallel-batch-13/control-button.md), `tests/browser/batch13-control-button.spec.ts` | `0c6fc7664e1faffee0071ac55e48390603bfd748`: corrected 2 Chromium/WebKit cases after retained earlier failures. | Button and spec blobs match; spec `b2664dfd3c6c49da852d7e3278f8c819370a2118`. `/tmp/batch13-control-button-after.log` absent. Pool `eff31a65-03c7-4663-877e-9bca8a541041` not recovered. Transitive dependency equality/full current matrix not established. |
| [IconButton](../parallel-batch-13/control-iconbutton.md) | `2c326a094fffa8177d98f31e1dc7e687358e2f9b`: 2 files/7 unit tests reported; no isolated native execution. | Current four IconButton tests cover names/ref, pending, description/decorative boundary and native form/external owner. Existence and assertions are not a pass. |
| [SplitAction](../parallel-batch-13/control-splitaction.md), `tests/browser/batch13-control-splitaction.spec.ts` | `f5f824e99edd6e7a17b6ac031b0adcc337b6f4c3`: 8 Chromium/WebKit cases, Firefox unverified; 15 SplitAction/Menu unit cases reported. | SplitAction and spec blobs match; spec `57bf2fcc4352c092157ba79703d602bac9071031`. `/tmp/sgui-batch13-control-splitaction-browser.log` and original worktree `artifacts/` absent. Removal coverage promises usable subsequent access, not a specific host fallback-focus policy. |
| [ButtonGroup](../parallel-batch-13/control-buttongroup.md), `tests/browser/batch13-control-buttongroup.spec.ts` | `6037f1b5313766d39a832e0af8a461ce9e3eef59`: corrected 2 Chromium cases. Earlier all-engine layout and WebKit traversal failures stay failed; corrected Firefox/WebKit pending. | Group and spec blobs match; spec `50395a45da5f90ff4cf9145b81e75d1e025dc85d`. Pool `0c5ac786-8f5c-42ef-af94-b5cf8ddf413f` not recovered. Native Mac WebKit link traversal uses documented Option-Tab semantics. |

Artifact absence above was checked with `Path.exists` in this managed checkout,
the original task checkout `/Users/thomashall/.codex/worktrees/3d29/sg-ui`, and
`/Users/thomashall/Projects/sg-ui`. A bounded glob also checked
`/Users/thomashall/.codex/worktrees/*/sg-ui/artifacts/browser-pool/<run>/evidence.json`
for the three named runs and found none. This does not prove absence from the
coordinator's separate archive, remote storage or another project path. The reports
are retained Git evidence of historical claims; raw JSON/log/build identity was
not recovered or independently revalidated here.

## Performed checks and bounded handoff

Read canonical criterion text, current implementation, named test assertions,
proof/migration contracts and the historical reports above. Compared historical
and current Git blobs for the named source/spec pairs; inspected the full shell
delta from `c9790bd` to the reviewed head. Used `rg` to locate isolation and
pagination assertions and `git rev-parse` for exact identity. Final report checks
are whitespace, relative Markdown links and exclusive changed-file ownership.
No test discovery is counted as execution and no historical suite is promoted to
a current-head pass.

No optional spec was added: H-16 native regressions already exist; U-01 existing
specs already cover their identified historical fixes. H-17's missing combined
tab composition and isolated IconButton native fixture are evidence gaps, not
proven implementation defects, and a synthetic duplicate test would not close them.

Coordinator validation window, if assigned: run current shell/model/state/shrink
and persistence affected unit files; run existing shell-state/client-shrink and
Button/SplitAction/ButtonGroup native specs against one fresh frozen build, with
exact head, selected engines and retained artifacts. Firefox/WebKit success must
be actually observed. For a later H-17 composition task, reserve only a new
deterministic story/test in `src/components/AppDataGridShell/` and a unique browser
spec after defining host tab-state lifetime. For isolated IconButton native
acceptance, reserve its own existing stories plus unique spec; do not modify
shared Button/Menu solely to generate evidence. Neither follow-up is created here.

No minimal production-fix allowlist is proposed because this inspection found no
actual missing behavior. Any future red regression requires a separately bounded
source owner. Host-specific persistence keys, network reconciliation and tab draft
ownership remain host responsibilities. Physical devices, spoken AT, full current
consumer/engine matrix and production release acceptance remain open.
