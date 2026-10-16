# Wave 03-31 — performance and resource ownership

All four original leaves remain **partial**. Delivered a reproduced cleanup fix,
three applicable unified patches, a production profiling host/runner, a fresh
bounded production SSR receipt, explicit local budget policy and validation plan.
No shared source, tests, documentation, generated output or ledger was modified.
All artifacts are inside this directory. No build/install/server/browser/unit
suite, Git mutation or external messaging was performed. Starting coordinator
count remains 153 A / 20 V / six future; no count changes are proposed here.

## Concrete changes ready for review

- `scrollbar-disposal.patch`: makes `observeScrollbarActivity`'s returned release
  function idempotent. Today, with two observing scopes, invoking the first release
  twice decrements the shared count to zero and removes the second scope's listener.
  An overdue disposer can also corrupt later ownership bookkeeping. The fix changes
  only the private disposer, preserving normal Provider/ThemeScope behavior.
  Two colocated unit cases protect sibling/later-generation ownership and 100
  repeated lifetimes with timer rescheduling and zero residual owned timers.
- `observer-cleanup.patch`: adds one focused FloatingTextSelectionToolbar regression
  proving the particular ResizeObserver observing its visible group disconnects
  exactly once on unmount. It uses existing mount/selection helpers and restores
  its global stub. No speculative implementation change is proposed there.
- `production-profiling.patch`: adds a production Vite host importing public
  compiled exports, four fixed workloads, and a Chromium measurement runner.
  Adds maintained profiling guidance to `react-aria-performance.md`. Grid workloads
  are 1,000 rows/two columns/page 50, 10,000 rows/20 columns/page 50 and page 200;
  selector workload is 2,000 options. Each uses three warmup/nine recorded navigations,
  sequential key input, selection, grid sorting and 50 ten-row updates at 10Hz.
  The runner records raw samples and median/nearest-rank p95/max per workload/action,
  browser/hardware/runtime metadata and every production asset's raw/gzip/hash.
  It rejects missing updates/page errors and refuses to overwrite a result file.
  Production fixture timers and RAFs are disposed when it unmounts each run.

The runner measures event capture/timer callback to two post-commit animation-frame
opportunities. Initial measurement starts at fixture module evaluation, excluding
network startup. This is neither physical paint nor standardized INP. Warmup
navigations are retained but excluded from summaries. All emitted assets are a
conservative output total, not per-route bytes or tree-shaking proof. Browser
execution and the new observer/Vitest regressions are explicitly **unrun**.

## Executed evidence and reuse

Read AGENTS.md and final acceptance first, then assignment, all assigned prior
reports/results and coordinator evidence. `input-evidence.json` verifies all eight
prior report/results references against assignment hashes: every match succeeds.
Prior complete results are retained within their original bounds. The older SSR
and CSS artifacts are historical references, not fresh browser/consumer results.

Executed from repository root:

1. `python3 docs/developer/final-acceptance/wave-03-31/prepare.py` prepares only owned
   mirrors/patch; `verify-lifecycle.mjs` runs the actual current/candidate TypeScript
   through installed TypeScript 5.9.3 into isolated VM contexts with a fake document
   and deterministic timers. Current code fails the double-dispose ownership
   assertion; candidate passes it and both implementations pass 100 normal
   lifetimes. Candidate ends at zero listeners, timers and attributes. Full exact
   hashes/failure in `lifecycle-result.json`. The harness first failed because its
   TypeScript default ES5 target miscompiled Map iteration; setting ES2022 fixed
   the harness. `harness-first-failure.txt` preserves that separate failure.
2. `node docs/developer/final-acceptance/wave-03-31/measure-local.mjs` invokes the
   existing SSR script with NODE_ENV=production, an owned cwd and **no --record**
   or consumer argument. `local-ssr.json` preserves its raw output and
   `local-measurement-receipt.json` contains before/after hashes for 1,827 selected
   source/output/config paths, exact command/cwd and environment. Every captured
   path stayed stable during the run. All coordinator-built library hashes match.
   Three DateField source inputs differ from wave-02-07; no later-source/build
   synchronization is inferred. Script only creates its legacy empty nested
   baseline directories inside this owned directory.
3. `node .../check-fixture-types.mjs` passes noEmit strict TypeScript 5.9.3 checking
   of the proposed TSX at its intended virtual path against current built public
   declarations. It writes no shared files and runs no application.
4. `node --check` passes for proposed Vite config and browser runner. `git apply
   --check` passes separately for all three patches; **none was applied**.

All Node executions used `/opt/homebrew/Cellar/node/26.5.0/bin/node`, Darwin 27.0.0
arm64, Apple M4 (10 logical CPUs), 24GiB RAM. SSR used React 19.2.3 production.
This is allowed lightweight local analysis, **not supported Node22/24 unit/matrix
acceptance**. Load averages were 7.23/5.52/4.10 on the shared 40-chat machine;
there was no isolated profiling window. No perf CI gate follows from this run.

| Existing SSR subject | New local median | Maximum of nine samples |
| --- | ---: | ---: |
| 100 buttons | 2.16ms | 3.37ms |
| 40 fields | 1.92ms | 2.36ms |
| 200 options | 5.13ms | 29.71ms |
| 1,000 rows/page 50 | 16.77ms | 30.08ms |
| Two calendar months | 2.66ms | 4.03ms |

The legacy script calls its maximum `p90Ms`; with nine samples this is the
nearest-rank p90 maximum, not a high-resolution tail estimate. It does not retain
raw samples; the new browser runner does. Historical baseline NODE_ENV was not
recorded, and HTML/source shape changed, so no historical speedup/regression ranking
is made. Current distribution CSS is 262,185 raw / 21,871 level-9 gzip bytes,
SHA256 `f7e2433696ce8d6ebd0cae60912c759f9ad83f66eb72453387a75ce557e0bb60`.
This differs from the old 8KiB composed-consumer CSS budget's artifact and is not
represented as passing that budget.

`budgets.json` preserves the original machine-specific 8/6/18/34/10ms SSR median
investigation thresholds, with original environment and comparison limitations.
It defines exact resource-ownership regression limits: zero final owned scrollbar
timers/listeners, idempotent disposal preserving a sibling, after 100 lifetimes.
These are test invariants, not heap budgets. Browser latency and memory budgets
remain pending measured repeat sessions and representative hardware selection;
no universal ranking or fabricated approval was added.

## Original requirements and remaining successors

| Original leaf | Original requirement | Result and remaining work |
| --- | --- | --- |
| A-B-10 | Measure production consumer bundles, CSS, editor/grid imports, initial render and interactive updates with reproducible fixtures. | Partial: current production SSR/CSS receipt and concrete production browser fixture advance reproducibility. Integrate and execute fixture on immutable output; retain separate packed editor-only/grid-only/root/composed asset/module receipts using existing consumer tooling. |
| A-P-08 | Set reproducible budgets from baseline and representative consumer hardware; avoid universal rankings. | Partial: explicit local investigation/ownership budgets and exact runtime/hardware/hash receipts supplied. Owner must select slower supported hardware; collect two stable repeated baseline/candidate sessions and approve workload-specific browser/memory thresholds. |
| A-G-20 | Benchmark large row/column counts and frequent updates including selection/text input; compare production builds to baseline. | Partial: runnable proposed wide/large-page workloads, typing/selection/sorting and 10Hz updates, raw tails plus baseline-compatible workload definition. Actual production browser run and matching baseline are still absent. |
| A-X-19 | Record performance/memory budgets, profile large grids/selectors and test listener/observer/timer/object-URL cleanup on mount/unmount. | Partial: concrete listener/timer fix reproduced and candidate verified in pure Node; observer-disconnect test prepared. Existing ImageUploadModal tests already cover URL replacement/cancel/unmount/late settlement, and floating toolbar tests cancel queued commands. Preserve/reuse these instead of duplicating them. Coordinator must integrate, run focused supported-runtime tests and collect browser allocation/retainer/plateau evidence for grid/selector/portal/upload cycles. |

`validation-plan.json` gives exact commands and expected results, including the
existing validation lease, dedicated preview4179 and preservation of server3000.
The production profiling host is deliberately outside the component catalog: it
is a test workload, does not change docs navigation/examples and needs no catalog
regeneration. Source hashes and patch context must be rechecked at integration.
No runtime acceptance leaf closes on a patch-only result or a simulated DOM count.
