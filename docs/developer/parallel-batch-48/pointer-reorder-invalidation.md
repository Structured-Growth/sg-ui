# Batch 48 — M-18 pointer reorder invalidation (F7)

## Scope and ownership

Managed, attached worktree:
`/Users/thomashall/.codex/worktrees/batch48-pointer-reorder-invalidation/sg-ui`.
Verified clean starting HEAD: `0186aff866d1b0b568817631f3d0da83ee0d49e3`.
Only the following reserved files change:

- [Host fixture](../../../src/components/AppDataGrid/AppDataGrid.reorder-invalidation.stories.tsx).
- [Composed tests](../../../src/components/AppDataGrid/AppDataGrid.pointer-invalidation.test.tsx).
- [Native spec](../../../tests/browser/inventory-pointer-reorder-invalidation.spec.ts).
- This report.

Production grid/RowDnd implementations, existing stories/tests and the integration
checkout remain read-only. This slice follows [reorder contracts](../react-aria-grid-reorder.md),
[targeted development validation](../react-aria-development-validation.md) and
[coordinator browser scheduling](../react-aria-parallel-browser-validation.md).
The requested abbreviated `parallel-browser-validation.md` path does not exist;
the last link is the actual repository policy.

## Added evidence and limits

The host arms a dataset or identity-function replacement before pointer dragging.
Entering the host strip applies it once, with equal row IDs and preserved source
controls. Dataset replacement uses a new array and new row objects. Identity
replacement uses a different function with the same returned IDs. A second grid
deliberately shares those IDs and supplies its own independent request counter.
No timer, programmatic focus or synthetic native drag driver exists in the story.

Three native cases require trusted pointer dragstart/dragend and, for replacement,
a trusted drop back onto a valid non-adjacent source-grid target. Cross-grid release
must actually enter the other collection. Each case requires zero requests from
both hosts, unchanged row order, cleared drop indicators/target/dragging attributes
and source-handle focus. The spec observes DOM drag affordance cleanup and native
dragend; it does not visually inspect an operating-system drag image.

Three composed tests validate one-shot host replacement and independent request
oracles after identity replacement. Their synthetic dragenter targets only the
host strip; they do not claim native drag proof. Existing first-gesture pointer,
keyboard dataset replacement, Strict Mode cleanup and Move rollback coverage is
read-only and is not reproduced here.

## Local validation — 2026-10-07

Node `v24.19.0` from the required bundled runtime. Commands run in this worktree.
Installation and lightweight commands use atomic token-owned slots from the
repository harness; owned leases were released after commands settled.

| Command | Outcome |
| --- | --- |
| Initial `acquireInstallSlot` | Refused: both slots occupied; installation did not execute. Environment/admission evidence, not a product failure. No foreign lease released. |
| `pnpm install --frozen-lockfile` after successful owned admission | Passed; 608 packages, lockfile unchanged. Reported ignored esbuild build scripts; no approval/configuration change made. |
| `pnpm exec vitest run src/components/AppDataGrid/AppDataGrid.pointer-invalidation.test.tsx src/components/AppDataGrid/AppDataGrid.reorder.test.tsx --maxWorkers=1` | Passed: 2 files, 24 tests (3 new composed, 21 existing reorder cases), 3.42 seconds. |
| `pnpm exec tsc --noEmit` | Passed. |
| `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` | Passed. |
| `pnpm foundations:check` | Passed owned import/layer/token guard. |
| `git diff --check` | Passed. |

## Initial frozen source attribution and native handoff

SHA-256 of the three executable files:

| File | SHA-256 |
| --- | --- |
| Story | `eab9f5ee84aeca4ab1616e46bac2b27875f10c5f90583bfb3f6e66c6570c6360` |
| Composed tests | `2f09c9affabc97d65a599dc17828015f76e00cf9a276ba258c783e73a428de79` |
| Native spec | `3dc360ed48aa059b00fbb606e203149691c214a52271358633101537150f1439` |

Ready focus arguments:
`tests/browser/inventory-pointer-reorder-invalidation.spec.ts --project=chromium`.
At initial handoff, fresh native validation was **pending** the coordinator's reviewed testing-only
candidate and immutable fresh Storybook pool. No independent build, server or
browser suite ran. The exact frozen commit is supplied in the coordinator handoff;
this report will receive a report-only follow-up after native evidence arrives.
The next section records the subsequent tested candidate; no dev acceptance is claimed.

Firefox/WebKit await the batch checkpoint. Physical-device long-press drag,
spoken AT, host production network races and broad M-18/G/U/X/R/Z acceptance remain
unverified/open. No GitHub dispatch/rerun/wait, integration/push/main merge,
publication, workflow permission/secret/version change or broad acceptance closure.
Historical red evidence remains intact; any native failure must be classified as
product, fixture/driver/expectation, environment or unclassified, with retained
logs and a reserved successor for production defects.

## Wave 23 red evidence and bounded driver correction

Coordinator tested candidate `c64c4377eb42c936f3cf8f1e3f5de2a5b33bdc05`
in `/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui`,
attributing these four owned files to worker `a841946586e88375c0206442524aef3c79aff318`
via `/tmp/sgui-batch45-candidate-wave23-attribution.json`. Fresh immutable build
SHA-256: `1afdb63861962fc7858ba9c42ec5a7e7e5dcc9b89d4f02fad7d6d9ddead899ca`.
Evidence directory:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/16f6feff-4479-4f37-8c96-451b694ba457/pointer-reorder-invalidation`.
`evidence.json`, `results.json`, `browser.log`, screenshots, attached native logs
and both failing traces remain untouched. Result: **1 passed, 2 failed**, zero
skipped/flaky. All sessions settled and owned leases released; source/build bytes
unchanged, per coordinator attestation. This testing-only candidate is not dev
acceptance.

Both replacement cases passed revision, trusted start/end, zero requests in both
grids, unchanged orders, cleared drag indicators/attributes and source focus.
They failed the required `dragstart, drop, dragend` sequence because no `drop`
arrived. Read-only trace/screenshot diagnosis identifies **fixture/driver geometry**:
the 360px frame clipped row 4 below the grid's scroll container. The dataset trace
released at `(333, 652.5)`, in the pagination footer, after transiently entering
`course-4` then leaving the table (native log grid became null). The screenshot
shows only source rows 1–3 fully visible. The identity case has the same path and
failure. This is not evidence that replacement legally cancels an otherwise valid
native drop. No production defect is established by these failed cases.

The cross-grid case passed but shared the clipped-row driver; it established
trusted entry into the other collection and safe outside release, not release on
the intended other-grid row. Its green outcome is retained with that scope limit.

Correction enlarges both reserved fixture frames to 480px and the browser viewport
to 1500px tall. Before and after pointer movement, read-only `elementFromPoint`
assertions now require the precise intended `course-4` row and table at the actual
release point. Required trusted start/drop/end assertions and all zero-stale,
order, cleanup and focus assertions remain unchanged. No synthetic focus/selection,
forced drop, permissive alternative event sequence or product edits were added.

After correction, an owned light slot on Node 24.19.0 ran:

- `pnpm exec vitest run src/components/AppDataGrid/AppDataGrid.pointer-invalidation.test.tsx --maxWorkers=1`: 3/3 pass, 1.42 seconds.
- `pnpm exec tsc --noEmit`: pass.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: pass.
- `pnpm foundations:check`: pass.
- `git diff --check`: pass.

Revised executable SHA-256: story
`73d78ef89bb557bf4941bbd8c248f4cc3427f3f10217bf488e93059a4013bea3`,
native spec `ec608c320db9275f4b7f9228805e30f013a22e9b8d1c95076a1097c357502915`;
composed test hash unchanged. Fresh coordinator Chromium proof of these changed
bytes remains pending; original reds have not been relabeled as a pass.

Coordinator separately reports an earlier pre-browser PATH error and cleanup
EPERM, with retained evidence and verified owner recovery of dead owned leases.
No browser proof is attributed to that environment failure. Actual wave 23 child
PATH used Node 24.19.0 correctly. This worker did not release any coordinator or
foreign lease. Cross-engine/device/AT and broad acceptance limits remain as above.

## Wave 27 — valid native drops reveal source-control focus defect

The corrected worker implementation is `64f0edd8277bb8939cd2a5e51c4c0b9722dfa4c5`.
Actual coordinator testing-only candidate:
`4987a1fe046c37f2e612d6de159aa09e1e840043`. The three executable file hashes
match the corrected hashes above. Fresh immutable Storybook digest:
`101bdd11ab686d9bad4c31857100322d960ee4edfcd19068dc77c1c06aec7a3e`.
Retained evidence directory:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/afadf38b-8476-4c9b-a10e-2a78d786822d/pointer-reorder-invalidation/`.
The coordinator attests clean/immutable source and build, all commands settled.
This worker only inspected evidence and production/dependency source read-only.

Result: **1 passed, 2 failed**, zero skipped/flaky. Cross-grid release now reaches
the actual visible other-grid row and passes zero requests, unchanged order,
cleared drag affordances and source-handle focus. Each replacement case proves
revision change and visible source-grid target hit, and records trusted native
`dragstart` on source `course-2`, `drop` on source `course-4`, then `dragend` on
source `course-2`. Both pass zero-stale requests, unchanged host orders and cleanup.
Both fail only the strict source-handle focus assertion (line 71) for five seconds.
The sequence assertions after that focus assertion were not reached, although the
attached native logs independently contain the complete trusted sequence.

Classification: **product source-control focus restoration defect**. The retained
screenshots show the source row outlined; post-drop trace DOM moves `data-focused`
from the enabled source handle to `TR[data-grid-row="course-2"]`. The fixture and
driver never focus or select another control after beginning the drag, and no
host/other-grid focus ownership change appears. Exact `document.activeElement`
was not explicitly captured by the original telemetry; the final row destination
is supported by the screenshot/DOM attributes, rather than a direct activeElement
dump. Do not claim direct telemetry or a fully observed event-loop causal chain.

Read-only code identifies a likely scheduling race: ownedGridInteraction's
`onDragEnd` restores the handle in a single animation frame, while React Aria
`useDroppableCollection` schedules `updateFocusAfterDrop` after 50ms. Its internal
reorder branch promotes a cell focused key to the parent source row and marks the
collection focused. A rejected stale request causes no host commit to trigger the
separate pending-reorder focus repair. That later collection repair can override
the early handle restoration. This causal mechanism is an inference from the
retained state and code; any successor must validate the corrected timing natively.

Reported requested successor production scope to the coordinator:
`src/components/AppDataGrid/ownedGridInteraction.tsx`, plus a separately reserved
colocated regression test. Existing production files and existing interaction/
reorder tests remain read-only in batch 48. A fix needs owned scheduled-cleanup and
outside-focus/unmount guards; simply taking focus after an arbitrary timeout must
not steal a deliberate host or other-grid focus move. The strict source-control
assertion remains unchanged. Read-only focusin/activeElement diagnostics in this
reserved spec can supply exact ownership/timing if requested for the successor.

All wave 23 and wave 27 reds/logs/traces/screenshots remain intact. No unchanged
native retry, assertion weakening, product edit, integration or dev acceptance
occurred. Source scope stays reserved pending the coordinator's exclusive successor
and fresh changed-source proof. Cross-engine/device/AT and broad acceptance remain
open. This report-only update records the actual failed proof, not a completed F7
acceptance slice.

## Wave 34 — bounded Chromium acceptance after reserved production successor

Fresh coordinator candidate `12db3601e7fa0707c7c8d43f6e04c7fabf3c52ae`
passes all three batch 48 cases. Attribution in
`/tmp/sgui-batch45-candidate-wave34-attribution.json` maps this slice to worker
`573f31b68b742a2edfc43af1bdd92231900c6b65`, baseline
`0186aff866d1b0b568817631f3d0da83ee0d49e3`. The unchanged executable hashes
are exactly story `73d78ef89bb557bf4941bbd8c248f4cc3427f3f10217bf488e93059a4013bea3`,
composed tests `2f09c9affabc97d65a599dc17828015f76e00cf9a276ba258c783e73a428de79`,
native spec `ec608c320db9275f4b7f9228805e30f013a22e9b8d1c95076a1097c357502915`.
The report digest at testing time was
`ff38222a4f55900a0dec955d60194781da4b9f03225682883c29f65b4a82ad5f`;
this final report-only addition does not change the tested executable bytes.

The candidate includes the independently reserved batch 59 successor worker
`c7634ceb77453b0566814cf78196f875a819c65a` (baseline
`352dc493f64520f544b489d656d30972ea63727b`). Its interaction SHA-256 is
`2d55999e42473069c6128ee569eb0629126768c067f317164ac15c617c38535d` and
drop-focus regression SHA-256 is
`3c2e41a441f2f15b44db9dbfdab276caf0547be6e48518f993e8c50a4302a9c1`.
See its separate [production fix history](../parallel-batch-59/pointer-drop-focus.md)
in the combined candidate. That successor document is outside this worker's
isolated four-file scope. Batch 48 never edited those production files; this green
evidence requires the combined candidate containing that successor, rather than
the isolated original batch 48 base plus coverage alone.

Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/46471bab-1194-490a-bbc4-86adfcbb76e7/`.
Root `evidence.json` records exact source/build/head immutability, Node 24.19.0,
one fresh Storybook build and browser typecheck; the coordinator attests settled
commands and released owned leases. Build SHA-256:
`867868632be1585f81d0a8d3b00088e917f6d69e4e561cae22ae6b9698d97933`.
The `pointer-reorder-invalidation/` shard retains `evidence.json`, `results.json`,
browser logs and attached trusted native event records. Actual focused command:
`pnpm exec playwright test (?:^|/)tests/browser/inventory-pointer-reorder-invalidation\.spec\.ts$ --project=chromium`.

| Batch 48 native case | Actual outcome |
| --- | --- |
| Dataset replacement during trusted pointer drag; valid source-grid drop | Pass: no stale host request, unchanged orders, clean drag state, source-handle focus, trusted start/drop/end. |
| Identity-function replacement during trusted pointer drag; valid source-grid drop | Pass: same complete assertions with changed identity function and equal IDs. |
| Trusted release on other-grid row with colliding IDs | Pass: other-grid native entry and precise row hit, neither host receives a move, clean drag state and source-handle focus. |

All three results are `passed`, retry 0, with zero skipped/flaky cases. Root wave
coverage is **17/17 Chromium cases**: this slice 3, existing reorder 5, batch01 grid
3 and separately owned editor 6. Total elapsed 44.299 seconds, browser window
9.638 seconds, peak load 4.727, swap delta 0, per coordinator metrics. Adjacent
green regressions support the shared candidate; the editor slice is not batch 48
work or evidence for the reorder contract.

Wave 23 driver reds and wave 27 product-focus reds retain their classifications,
logs/screenshots/traces and actual tested candidates above. The later changed-source
green proof does not rewrite them. Batch 48's bounded F7 native slice now has fresh
Chromium evidence with unchanged strict assertions. Firefox/WebKit remain pending
the batch checkpoint; physical touch long-press, spoken AT, manual coverage, host
production network races and broad M-18/G/U/X/R/Z acceptance remain open. This is a
reviewed testing-only candidate, not a claim of dev integration or production/main
acceptance. No executable/story/spec edit, further native/build/CI run, push or
integration accompanies this final report-only update; the coordinator owns
individual history review and integration.

### Final report checkout

The original attached batch 48 checkout was absent when finalization resumed;
the attempted report edit failed before applying any change. A new managed and
attached checkout was created at the exact clean frozen worker head
`573f31b68b742a2edfc43af1bdd92231900c6b65`:
`/Users/thomashall/.codex/worktrees/batch48-pointer-final-report/sg-ui`.
Only this report changes there. The prior worktree attachment and all candidate
evidence were left untouched. `git diff --check` and unchanged executable hashes
validate this documentation-only completion; no dependency install or UI checks
were rerun. The final report-only commit is supplied in the coordinator handoff.
