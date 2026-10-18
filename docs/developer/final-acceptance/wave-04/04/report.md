> **Latest peer-review decisions:** recommend G-16 and G-29 complete under their
> original definition/test clauses, alongside already-closed G-28. Summary is now
>3complete/6partial for this assignment; root alone changes shared counts.
> `grid-closure/closure-decisions.json` supersedes the older speech/layout blockers
> below. `grid-closure/keyboard-focus-contract.patch` documents exact contracts.
> The active frozen-preview patch now has4passing deterministic tests and fixes
> final browser-close failure recording before a pass can be saved.

# Grid behavior and reordering — final wave04/04 handoff

Recommend **A-G-28 complete; eight assigned leaves partial; none blocked**.
[results.json](results.json) records all nine original obligations verbatim, exact
source/evidence references with SHA-256, proposed changes and remaining successors.
No central count/checklist was edited.

## Code completed and coordinator-integrated

The coordinator integrated this conversation's production performance successor
and maintained host-controller tests, then merged conversation09's stronger memory
runner. Reviewed the actual merged fixture: renderers, queued marks, lifecycle
counters and same-document mount/unmount coexist; its public-declaration typecheck
has zero diagnostics on Node24.19. No runtime fixture correction remains.

Exact implemented files:

- `packages/ui/tests/performance/fixture.tsx`: public AppDataGrid, existing
  DataGrid and selector workloads; queued event marks; owned interval/RAF counters;
  repeatable mount/unmount. Catalog uses public TextField and host-owned search.
- `packages/ui/tests/performance/measure-browser.mjs`: native typing and selection
  during50updates at10Hz, three warmup/nine measured navigations per workload;
  full source/fixture/runtime/React/browser/load/asset receipts; measured-unmount
  and separate active-update cleanup probes with zero owned pending work and no
  late publication. Catalog and processing runs are separate.
- `packages/ui/tests/performance/compare-performance.mjs`: offline raw-sample
  median/p95 comparison; incompatible fixture/environment, missing iterations,
  incomplete overlap/update and cleanup failures reject. No automatic threshold
  approval or baseline overwrite.
- `packages/ui/tests/performance/vite.config.mjs`: compiled public root alias for
  AppDataGrid, preserving public experimental/style aliases.
- `apps/docs/scripts/grid-host-operation.test.mjs`: **three deterministic tests
  pass** against the actual integrated controller on Node24.19. They cover stale
  settlements, confirmed rollback/retry/new signals, authoritative responses,
  synchronous failure, cancel/replacement/subscription cleanup and sibling isolation.
- `docs/developer/react-aria-performance.md`: fixed workload/build/measurement and
  interpretation guidance, preserving09's instrumented-memory guidance.

Conversation09/coordinator subsequently corrected native selection in
`measure-memory.mjs` using visible-label clicks plus exact checked-state assertions,
added all seven renderer/workload combinations, and strengthened catalog sort-menu
portal disposal through `performance-proof-policy.mjs`. That code supersedes my
pending overlapping correction. I reviewed its actual source and preserved it.
Selector ListBox coverage remains inline; catalog sort menus establish portal
coverage. No additional delta is needed.

**Do not reapply** `performance-successor.patch` or
`historical-continuation.patch`: they are integrated/superseded historical artifacts.
`proposed-files` now mirrors the coordinator's final integration for review;
[handoff-validation.json](handoff-validation.json) records exact current hashes.
All writes by this conversation stayed within its assigned folder. The coordinator
owns the shared edits. No commit/push/release action occurred here.

## Evidence recovered instead of repeated

The newer raw receipt
`packages/ui/artifacts/wave03-integration/followup-final-results.json` has SHA-256
`af50ca0dbfd79d38bb53cbfb18072cea76c151bf1f9842c97e2717273b91b170`, matching
`wave-03-followup/validation-results.json`. It contains **nine passing executions**:
three grid successor cases in Chromium, Firefox and WebKit. Exact case/engine/
timestamp/result extraction is in [retained-grid-native.json](retained-grid-native.json).

Those passes resolve the older wave03 unrun-entry/host-operation/removal gaps:
native external-button Tab/ShiftTab entry, selected-row disappearance with exact
scroll/sibling preservation, and rendered optimistic row-action rollback/retry/
reorder cancel/late settlement. Original timeout/Firefox-entry failures remain in
the older logs. This is retained native execution, not fresh current-head browser
execution or spoken AT evidence.

A-G-28 defines host mutation behavior and restoration after failure. Its integrated
guide/controller, earlier pure Node24 race checks and three-engine rendered
rollback/retry/cancel passes satisfy that bounded obligation. Cancellation cannot
undo server writes; real revision/idempotency and ambiguous network reconciliation
remain explicitly host-owned. No production-backend or speech approval is inferred.

Retain F-C16/F-C18 reconciliation through `wave-02-02/results.json`; original
completed F subleaves were removed, so none are invented. Exact T-C16/T-C18 maps
remain in `parallel-next100/next100-c16.md` and `next100-c18.md`. HB17 accepted
V-C16/V-C18 presentation/native scope remains in
`backlog-execution-2026-10-15.md:720` and hardening execution; some original raw
HB17 artifacts are unavailable locally, a retained-evidence limitation.
Integrated seven-case reorder-policy tests already cover active criteria/sibling
cancellation. GRID-R1/BUG-0012 and Firefox extra scroll-pane Tab entry are resolved.
HB19/HB20 editor V receipts are retained without repetition or borrowing them for
grid speech/touch/performance claims.

## Remaining original obligations

| ID | Recommendation | Concrete successor |
| --- | --- | --- |
| A-M-16 | Partial | Finish remaining G obligations through their owners; retain F/T/V mappings. |
| A-M-18 | Partial | Physical long-press before/after/cancel/invalidation/rollback and observed drag speech. |
| A-G-15 | Partial | Actual empty/retained pending/success/error/Retry/no-results/subheader speech with focus/context. |
| A-G-16 | Partial | Grid-specific AT roles/context and nested-action sequence versus plain table; native entry already passes3engines. |
| A-G-17 | Partial | Named physical-touch/colliding-ID sibling/cancel cases and request-versus-saved/error speech; policy/native pointer/keyboard/Move retained. |
| A-G-20 | Partial | Run matching baseline/candidate production workloads and compare actual raw latency/assets/load. Executable mechanism is now implemented. |
| A-G-21 | Partial | Recover newer clipboard/adapter receipts; only if missing run bounded Firefox native paste spec; observe independent copy speech separately. |
| A-G-28 | Complete recommendation | Defined host contract plus pure and three-engine rendered evidence; no additional source change required. |
| A-G-29 | Partial | Reconcile post6ddf3326 choice-label layout receipt or execute only selected-removal case across3engines; retain prior focus/Retry evidence. |

The original143-input snapshot compared110 scoped source/test/fixture paths:
96 matched the limited prior manifest,13 were unrecorded, and selection CSS was
the one recorded changed grid input (explicit choice-label replaces last-child).
The later coordinator integration changed five captured inputs, separately recorded
in handoff validation. Original dated evidence is preserved rather than rewritten
as a current immutable-host pass.

## Checks and next executable work

Completed lightweight checks only:

- Merged fixture public-declaration overlay:0diagnostics, Node24.19
  ([receipt](integrated-fixture-types-node24.log)).
- Maintained host controller tests:3passed ([receipt](host-operation-tests.log)).
- Offline comparator:10synthetic cases pass, including leaked-timer/late-publication
  rejection ([receipt](comparator-check.log)); these are not timing measurements.
- Current integrated MJS syntax/hash review passes; nine historical native outcomes
  authenticate. No browser/build/install/simulator/heavy suite was started here.

[validation-plan.json](validation-plan.json) provides exact commands and bounds.
After Xcode releases its lease, the coordinator builds/freezes the production
preview and runs the latency and memory jobs separately. Catalog latency has36
navigations plus3cleanup probes; processing has48plus4probes. Memory uses seven
combinations with5warmup+25recorded same-document active-update disposal cycles.
Observed counters are not global listener, heap plateau, paint or INP guarantees.

Reuse wave03-20's operator worksheet and wave03-21's physical-touch protocol/passive
observer for remaining speech/device evidence. Existing automated iOS VoiceOver
currently tests selectors; it cannot certify grid announcements or physical drag.
Six future leaves remain separate. No required gate is waived and no legal or
release approval is inferred.

## Larger-batch continuation: frozen production proof guard

Prepared one further concrete A-G-20 successor without changing shared source or
frozen output: [frozen-preview-successor/frozen-preview.patch](frozen-preview-successor/frozen-preview.patch).
The latency runner previously measured whichever server answered4179 without
authenticating served bytes. The3-file patch adds `frozen-preview.mjs` and its
maintained3case `node:test` file, verifies served HTML/assets against the local
immutable production build, records full preview/library output hashes and rejects
changed output after measurement. It also rejects an existing evidence destination
before launching a browser and saves failed-run/partial-result evidence for
exceptions during the run.

All3deterministic guard tests pass on Node24.19 (55ms total runner duration);
runner syntax and patch dry-run pass. No browser, build, install, heavy suite,
simulator or audible Apple work ran. [Readiness](frozen-preview-successor/readiness.json)
and exact input hashes are supplied for root integration after the14pack+lock
window. This does not duplicate lead15's provenance/reconciliation work or09's
memory runner. Preserve the registry's19closed/120remaining counts; this code
prepares trustworthy production measurements and does not manufacture them.

## Clause-specific closure and guard peer review

[grid-closure/closure-decisions.json](grid-closure/closure-decisions.json) recommends
A-G-16 and A-G-29 complete. The original leaves require defined navigation/focus/
semantics and tested independent-grid transitions. Those have shipped source,
retained native3engine cases and explicit regression mappings. Current focus,
controller and focused unit-test bytes match the validated snapshot. The later
choice-label CSS change targets new label markup without changing ownership or
scroll-transition logic. The prior report unnecessarily expanded these definition
leaves into speech/full-current-visual gates. Those actual AT/device obligations
remain under their original owners and are neither claimed nor waived here.

[keyboard-focus-contract.patch](grid-closure/keyboard-focus-contract.patch) adds
a source-backed keyboard/semantics/transition table, corrects both-axis page reset
and replaces a stale statement that reorder/persistence are future batches. Its
patch check passes. No runtime change or duplicate browser run is needed for this
precise documentation clarification. Root/lead15 must review the recommendations
before updating shared acceptance counts; the existing19closures are preserved.

The grid-host operation peer review found no missing primary-flow assertion: the
maintained tests cover stale success/failure, exact rollback/retry/new signal,
canonical response, cancel/replace/unsubscribe and colliding-ID sibling isolation;
the retained3engine rendered host case establishes actual displayed behavior.
G28remains closed and was not rerun for credit.

Frozen-preview peer review found a real harness problem: the old runner wrote a
passing receipt before `browser.close()` settled. The revised3file patch finalizes
shutdown first and writes one final receipt. A shutdown failure forces failure
without erasing the original run error or partial results. All4deterministic guard
tests pass on Node24.19, runner syntax and patch dry-run pass. The patch leaves09's
fixture/memory/consumer files untouched and awaits root integration after09's
active window. No build/browser/Apple/audio work ran in this follow-up.
