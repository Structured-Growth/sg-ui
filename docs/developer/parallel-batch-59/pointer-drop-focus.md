# Batch 59 — M-18 pointer drop source-control focus recovery

Managed worktree: `/Users/thomashall/.codex/worktrees/batch59-pointer-drop-focus/sg-ui`.
Verified clean starting HEAD: `352dc493f64520f544b489d656d30972ea63727b`.
Exclusive changed files: [interaction](../../../src/components/AppDataGrid/ownedGridInteraction.tsx),
[new regression](../../../src/components/AppDataGrid/ownedGridInteraction.drop-focus.test.tsx), and this report.
No batch 48 source/spec/test/report, primary checkout, dependency manifest or lockfile changes.

Read the architecture, migration, [development validation](../react-aria-development-validation.md),
[reorder contracts](../react-aria-grid-reorder.md), existing interaction/reorder tests,
and batch 48 report using `git show 573f31b68b742a2edfc43af1bdd92231900c6b65:docs/developer/parallel-batch-48/pointer-reorder-invalidation.md`.
Inspected retained wave 27 trace archives and error attachments read-only under
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/afadf38b-8476-4c9b-a10e-2a78d786822d/pointer-reorder-invalidation/`.
Those historical native failures remain failures.

## Change and focus ownership

The dependency's internal `useDroppableCollection` schedules `updateFocusAfterDrop`
after 50ms and can promote an internal reorder's focused cell to its source row.
This explains a plausible override of the former single animation-frame handle
repair. The dependency code is read-only; native causality remains inferred until
fresh coordinator proof.

The owned interaction retains the actual source handle at drag start. On drag end,
it validates the retained handle/row and keeps the initial frame repair for existing
cancellation behavior. A document capture focus listener then reacts to the exact
source TR receiving focus and schedules one owned frame to restore that handle
with `preventScroll`. It does not copy the dependency's delay, poll, or fork upstream
behavior. During idle ownership there is no scheduled work.

The post-drop ownership ends on a new pointer/key gesture, another control receiving
focus, a new drag, a post-drop rows/identity/reorder-availability change, or unmount.
Every owned frame and capture listener is cancelled together. The scheduled callback
also checks connection, enablement, source containment/ID and the end-of-drag
rows/identity snapshot. Host focus that leaves during the drag invalidates handle
restoration even if that host control is removed before drag end.

A replacement during the drag still invalidates the reorder request. It can preserve
source focus when the exact handle and row ID survive; a later replacement after the
end-of-drag snapshot cancels this repair. Existing host commit/rollback and Move
focus repair remain separate and are covered by the unchanged reorder tests.

## Targeted evidence — 2026-10-07

Node `v24.19.0`, pnpm `10.29.3`; required bundled Node PATH. Installation and light
commands acquired atomic token-owned repository harness slots before execution and
released only their own leases after settlement. No independent full check, build,
Storybook, browser suite, server or GitHub dispatch ran.

The new regression delegates to the real React Aria hook/collection/controls while
exposing the owned drag callback boundary to jsdom. It explicitly reproduces source
TR focus after the original repair frame, independently of any guessed delay.
This is meaningful interaction evidence, not trusted native drag evidence.

| Validation | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Pass; lockfile unchanged. esbuild ignored-build-script notice retained; configuration unchanged. |
| New 13-case regression against original interaction at starting SHA | **4 failed / 9 passed**: dataset/identity late source-row focus, successful-request late source-row focus, and external focus removed during drag. |
| New regression + existing `ownedGridInteraction.test.tsx` + existing `AppDataGrid.reorder.test.tsx`, `--maxWorkers=1` | **57/57 pass**, 3 files, 5.39s. |
| `pnpm exec tsc --noEmit` | Pass. |
| `pnpm foundations:check` | Pass without guard changes. |
| `git diff --check` | Pass. |

Retained final logs: `/tmp/sgui-batch59-red.log`, `/tmp/sgui-batch59-unit.log`,
`/tmp/sgui-batch59-types.log`, `/tmp/sgui-batch59-guard.log`.
The baseline run temporarily restored only the allowlisted interaction from the exact
starting commit, then restored the fixed bytes in `finally` before final validation.
Earlier diagnostic runs exposed an overly narrow initial focus guard (revised to
preserve collection cancellation) and an unnecessary upstream type import in the
mock (replaced with an owned structural test boundary). No checks were weakened.
The regression additionally covers independent-grid/host focus, next pointer/key
input, post-drop rows/identity changes, disabled/removed sources, and Strict Mode
unmount cancellation.

## Frozen native handoff

Executable SHA-256:

- Interaction: `a55196738f1cc99061c013db57f4dc130c210570e2f921c9802ce1ae1f85fd94`.
- New regression: `cd49f962a873059b8c7d044cba35c611d7f87302c21b71cb3a5c9c91b07d4983`.

Coordinator should combine this reviewed source with the unchanged batch 48 candidate
fixture/spec and run:
`tests/browser/inventory-pointer-reorder-invalidation.spec.ts --project=chromium`.
Also relevant existing focus args:
`tests/browser/reorder.spec.ts tests/browser/batch01-grid-reorder.spec.ts --project=chromium`.
The frozen commit is in the completion handoff. Source/report remain frozen pending
coordinator proof. Chromium is **pending**; Firefox/WebKit await the batch checkpoint.
No provisional dev integration, M-18/G/U/X/R/Z completion, physical-device long-press
or assistive-technology acceptance is claimed. Coordinator alone integrates reviewed
full histories into `codex/dev`; no main/push/publication/permissions/secrets changes.

## Ownership review correction — current frozen successor

The preceding handoff describes initial commit
`6c53e92e24aeb06162112b7b887b9d6503c15700`, not the current source.
Coordinator's independent exact-source review blocked native admission: the initial
frame permitted any focus inside the grid and ignored every initial same-grid
focus event. That could steal a deliberate checkbox/button/cell focus transfer,
including one followed by removal to body. Its 57-test green result did not cover
this ownership defect; the original red/green logs above remain untouched.

The successor cancels on every focus transfer except the retained handle, exact
source TR/cell, and one narrowly captured native keyboard-cancellation entry.
React Aria's real cancellation path with a different selected row first restores
the drag handle, then briefly focuses that selected TR. Therefore only when the
reported drag-end operation is `cancel`, and exactly one row was selected, that
exact selected TR is admitted before the first frame. Its controls/cells receive
no exception; the exception ends after the first repair. Arbitrary same-grid
control focus immediately cancels the frame/listeners, even when the control is
then removed. Drag-end admission also refuses to arm when another same-grid
control already owns focus. Only body, the retained source entry, the captured
cancellation TR, or the existing transient drop indicator can admit recovery.
No time delay, polling, dependency edit or assertion weakening was introduced.

The regression setup now uses a user-event click and **asserts source-handle focus
before invoking the simulated drag callback**. The former direct programmatic
focus could enter a not-yet-focused collection and reconcile to its first row;
this setup gap was discovered while narrowing ownership. All drop-boundary focus
assertions remain, and source TR/cell before-first-frame repair is explicitly
covered. The removal oracle focuses an existing enabled same-grid Move control,
asserts that focus, removes it to BODY, then restores the DOM node in `finally`
for React cleanup. It requires both no handle focus call and BODY ownership.

Current final validation on Node 24.19.0 under an owned light slot:

| Validation | Result |
| --- | --- |
| Final strengthened 20-case regression against initial `6c53e92` source | **5 failed / 15 passed**: checkbox/button/cell transfer before the first frame, transfer then removal to BODY, and other control already focused at drag end then removed. |
| Final regression + unchanged interaction/reorder tests | **64/64 pass**, 3 files, 6.70s. Includes the existing unselected-source/selected-other-row keyboard cancellation case. |
| `pnpm exec tsc --noEmit` | Pass. |
| `pnpm foundations:check` | Pass, guards unchanged. |
| `git diff --check` | Pass. |

Preserved correction evidence:
`/tmp/sgui-batch59-correction-final-red.log`,
`/tmp/sgui-batch59-correction-admission-unit.log`,
`/tmp/sgui-batch59-correction-admission-types.log`,
`/tmp/sgui-batch59-correction-admission-guard.log`.
Earlier correction red/diagnostic logs use separate `correction-*` names; they do
not overwrite the original `/tmp/sgui-batch59-{red,unit,types,guard}.log`.
The prior-commit comparison again temporarily changes only the reserved interaction
and restores successor bytes in `finally` before final validation.

Current executable SHA-256, superseding the initial handoff hashes:

- Interaction: `029a83d46f1e35ab4b17c480422f46ca5e4b347f935704a4b0d616b14094b8d5`.
- Regression: `e4587b45ca08ce7e2c2539249a7f650e5714fb863dd8222d219b699dd32ff513`.

Current source/report freeze resumes at the successor commit supplied in the
completion handoff. Native admission still requires the coordinator's independent
ownership review of these exact bytes and fresh Chromium proof with the unchanged
batch 48 candidate. Browser focus args and all open engine/device/AT/acceptance
limits remain as stated above. No native execution or integration occurred here.
