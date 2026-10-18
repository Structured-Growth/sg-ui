# Migration proof performance reference

Task references: B-10, P-08, X-19. The checked-in
[measurement record](migration-baseline/proof-measurements.json) contains local
reference measurements, not a claim about universal framework performance.

Run `pnpm build` followed by `node scripts/measure-migration-proofs.mjs`.
Optionally pass packed-consumer fixture directories to include their production
asset sizes. The script uses three warm-ups and nine synchronous server renders
per subject. It reports the median and maximum sample. Fixtures cover 100 buttons,
40 fields, 200 async options, 1,000 host rows with a 50-row grid page, and two calendar
months. The existing extracted button is measured before its replacement changes.
Server-rendered HTML bytes include the original runtime's style serialization and
are not browser-transfer comparisons by themselves.

The first reference used an Apple M4, arm64 macOS and Node 26.5.0. Owned subjects
had median server times of 2.78–16.12ms. The React 18 and 19 packed proof pages
include React plus form, dialog, async-selection and date-range controls: 162,102
and 176,968 gzip JavaScript bytes respectively. Their full shared CSS was 4,795
gzip bytes. This is a composed workload, not a minimal button import.

Initial regression investigation budgets for this machine and these workloads:

| Workload | Median server-render budget |
| --- | --- |
| 100 owned buttons | 8ms |
| 40 fields | 6ms |
| 200 async options | 18ms |
| 1,000 rows / 50 rendered rows | 34ms |
| Two calendar months | 10ms |

The composed proof-page transfer budget is 215KiB gzip JavaScript and 8KiB gzip
shared CSS. These bounds allow measurement noise and planned shared-control
additions. Investigate changes beyond the budgets; do not automatically rewrite
the reference to make a regression disappear. Changes to workloads, output shape,
React/runtime version or hardware must be recorded when comparing results.

Browser initial-render/update latency, touch responsiveness, large-grid memory,
virtualization thresholds and lifecycle cleanup remain open. Server times and
bundle sizes do not close those tasks. CI and representative slower consumer
hardware need their own measured reference before enforcing timing gates there.


## Production profiling successor (A-B-10, A-P-08, A-G-20, A-X-19)

The `packages/ui/tests/performance` fixture is a separate production Vite host
using compiled public exports. Build the library once at an immutable reviewed
snapshot, then build the fixture with `pnpm --filter @structured-growth/sg-ui exec
vite build --config tests/performance/vite.config.mjs`. Start its preview using
`pnpm --filter @structured-growth/sg-ui exec vite preview --config
tests/performance/vite.config.mjs` in the coordinator's allocated profiling window.
It uses port 4179 and must not replace the user's docs server. Run
`pnpm --filter @structured-growth/sg-ui exec node
tests/performance/measure-browser.mjs /absolute/new-result.json`.
The output path must be new; preserve the original reference.

The small workload preserves the original 1,000 rows/two columns/page 50 shape;
wide uses 10,000 rows/20 columns/page 50; largePage uses the same data/page 200;
selector renders 2,000 host-provided options. Each workload uses three warmup
navigations and nine recorded navigations, sequential search input, selection,
grid sorting, and 50 updates at 100ms intervals affecting ten rows. Measurements
run from event capture, the selector's public selection callback, or the timer
callback to two post-commit animation frames;
they estimate presentation opportunities, not actual paint or standardized INP.
Initial measurements start at fixture module evaluation, excluding network startup.
Asset records include all emitted chunks, raw/gzip bytes and content hashes;
they are conservative output totals rather than per-route transfer sizes.

Compare only matching fixture hashes, workload, React/runtime/browser version,
hardware, viewport, throttling and measurement method. Store candidate and baseline
package/source hashes, load average, raw samples and exact commands. Use medians
and nearest-rank p95 across recorded samples, with separate initial, input, click
and update distributions. Do not compare historical SSR timings to browser latency.
Do not turn shared-checkout measurements into CI budgets. Select representative
slower consumer hardware and obtain two stable repeated sessions before proposing
browser timing/memory thresholds. Budget approval remains an owner decision;
regressions require investigation, not automatic reference inflation.

Lifecycle regression budgets are ownership counts: after final scope disposal,
zero owned pending scrollbar timers and document listeners; repeated disposal must
not release a live sibling. Existing ImageUploadModal tests verify preview URL
revocation on replacement, cancel and unmount, including late upload settlement.
These bounded regressions do not establish heap plateau. A browser allocation
profile must separately inspect retained grid/selector/portal/upload owners after
repeated mount/unmount and explicit GC where the profiling tool supports it;
record that instrumented method separately from responsiveness runs.

The historical 8KiB CSS budget belongs to its old composed consumer fixture.
The 2026-10-16 local distribution stylesheet measures 262,185 raw / 21,871 level-9
gzip bytes. This is a different artifact and must not be represented as a passing
old consumer budget or a minimal-import size. Editor-only, grid-only and composed
packed-consumer build graphs still require separate current-artifact receipts.

### Selector measurement boundary

The selector now records selection at its public `onValueChange` callback, followed
by the same two post-commit animation frames. The original click-target heuristic
recorded a generic click despite actual selected state during the update burst;
that failed assertion remains in `backlog-to-ten/performance-01` and
`backlog-to-ten/performance-02`. The callback measures host state-request to frame
opportunity and excludes work before the callback; it is not full input latency.
Grid selection retains its existing event-capture boundary. Compare only runs
with identical fixture and runner hashes.

After native query clear, the driver verifies the first result's text, focuses
the actual option, checks focus ownership and sends a native Space key; it then
requires `aria-selected=true`. This avoids repeated
accessible-name enumeration across 2,000 results during the fixed update burst.
All fifty updates and input/selection overlap assertions remain mandatory.


## Instrumented same-document disposal successor

`tests/performance/measure-memory.mjs` adds a separate Chromium/CDP profiling run.
After the coordinator builds the reviewed fixture once and serves its immutable
production output on loopback4179, run from `packages/ui`:

```sh
node tests/performance/measure-memory.mjs /absolute/new-memory-evidence --snapshots
```

Do this in a serialized validation window under the existing coordinator lease.
The destination must be new. The runner checks every served fixture asset against
local build hashes, saves the compiled library output inventory before and after,
and records browser/runtime/hardware/load metadata. Each of seven configurations (three grid workloads per renderer and the inline
selector) gets five warmup and 25 recorded same-document mount/unmount cycles.
Grid cycles select/sort; selector cycles query/select their inline ListBox. Catalog grid cycles reopen
the sort-menu portal before disposal. Each cycle starts periodic updates and disposes while updates are active.
The fixture cancels its own interval/RAFs; the runner checks empty root/scopes/options,
stopped updates, and no new samples during a later observation window. These
assertions supplement the existing resource-owner unit checks.

After explicit GC, raw whole-page DOM-node/listener/document and JS-heap counters
are retained for every cycle. Optional warm/final heap snapshots (maximum256MiB,
60s each) support manual retaining-path review. Snapshots may contain fixture data;
use this synthetic workload. Failed/partial captures remain evidence, not valid
heap snapshots. Counters include React/browser/runtime caches; a flat counter or
absence of growth does not establish that every SGUI owner was released. Review
retaining paths and repeated sessions before proposing a plateau/byte threshold.
No new numeric memory budget is invented or automatically approved here.

GC-instrumented runs are separate from uninstrumented latency runs and are not
RSS, INP, Firefox/WebKit, physical-device or upload/editor allocation evidence. AsyncMultiSelect uses an
inline ListBox; its option removal alone is not portal-cleanup evidence.
Existing ImageUploadModal URL and FloatingTextSelectionToolbar observer/queued
command regressions remain independently attributable. Extend actual allocation
profiling to those owners only if their broader A-X-19 successor requires it.


## Catalog-grid and overlapping-update protocol

The wave-04 successor expands the same production fixture with
`?renderer=catalog` using public AppDataGrid, alongside the processing-grid and
selector workloads. Search and selection now occur during 50 updates at 10Hz.
Pending event marks are queued so a row update cannot overwrite a captured input
mark. A sample still measures the next host commit's frame opportunities, rather
than isolating the completion or paint of that individual action. The runner
requires both input and selection samples while updating and exactly 50 updates.
The catalog host observes public state-change notifications to commit its own
measurement boundary; that host overhead is part of this fixed workload.

After a coordinator freezes and builds the reviewed package plus fixture, run
from `packages/ui`, under its existing serial profiling lease:

```sh
SGUI_PERF_SOURCE_HEAD=<full-reviewed-commit> node tests/performance/measure-browser.mjs /absolute/new-catalog.json catalog
SGUI_PERF_SOURCE_HEAD=<full-reviewed-commit> node tests/performance/measure-browser.mjs /absolute/new-processing.json processing
node tests/performance/compare-performance.mjs /absolute/baseline-catalog.json /absolute/candidate-catalog.json /absolute/new-comparison.json
```

Keep each renderer's baseline and candidate separate. Use the same new fixture
and runner bytes on both compiled production packages, browser/runtime/hardware,
viewport and measurement method; repeat sequentially under comparable load.
The comparator recomputes median and nearest-rank p95 from raw non-warmup samples,
rejects missing/duplicate iterations or missing update/input/selection evidence,
and reports deltas without declaring an approved performance threshold. It refuses
to overwrite the output. Record source commit, actual built package/asset hashes,
React version, exact build/preview commands, throttle policy, load and any source
overlay used to build an older package with this fixed fixture. Historical schema-1
measurements and SSR timings are incomparable to this overlapping-input protocol.

This protocol has been typechecked and its offline comparison guards exercised
with synthetic receipts. Until baseline and candidate production browser runs
exist, it supplies no measured latency result and does not close G-20. It is
Chromium-only tooling; physical touch and spoken AT remain separate evidence.

### Large-page driver correction

The original fixed-update run failed while the automation repeated accessible-role
lookup for every key in a 4,000-cell page. The driver now resolves/focuses the input
once and sends native keyboard events, retaining per-key frame waits, all 50
updates and both interaction-overlap assertions. Failures preserve browser samples
as well as driver wall times. A same-candidate continuation passed 3 warmup and
9 recorded large-page navigations plus active-update disposal. The
[receipt](final-acceptance/wave-04/02/performance-contention/receipt.json) retains
the original failure and exact candidate/asset identity.

Recorded browser input-to-frame median was about 235ms and p95 414ms; driver wall
time includes protocol, frame waits and telemetry and is reported separately.
The nominal 100ms timer target does not establish sustained 10Hz delivery under
contention. These measurements cover the original candidate's processing large-page
workload; they establish neither current-candidate performance, a full renderer
matrix, approved budgets nor an old-foundation comparison.

## Instrumented memory execution — 2026-10-17

The [finite execution receipt](final-acceptance/wave-04/02/instrumented-memory/receipt.json) records all 210 cycles passing: seven configurations, each with five warmup and 25 recorded cycles. It used Chromium 153, Node 24.19 and an Apple M4 host against the fresh grid candidate `551f00034fe52027ce77285a517075b322d82508a4fc938ea21f4616303ce301`. Each unmount occurred during active updates; root children, scopes, options, menus, pending frames and owned timers returned to zero, and no later samples appeared. Catalog sort-menu disposal and inline selector cleanup are covered separately.

| Configuration | Post-GC used-heap final minus first recorded (bytes) | Recorded DOM-node range | Recorded listener count |
| --- | ---: | ---: | ---: |
| processing-small | 465,332 | 32–34 | 178 |
| processing-wide | 458,828 | 24–26 | 178 |
| processing-largePage | 472,804 | 22–22 | 178 |
| catalog-small | 470,080 | 28–32 | 317 |
| catalog-wide | 574,660 | 22–24 | 317 |
| catalog-largePage | 519,516 | 22–22 | 317 |
| processing-selector | 441,924 | 19–19 | 178 |

Listener counts remained fixed, while whole-page used heap grew in every configuration. Sampled strong paths locate native media-query groups under the document's StyleEngine, performance entries under browser buffers, and remaining React bookkeeping through the fixture's imported module context. No accumulating live SGUI callback/data path was identified in this bounded review; that is not a universal leak-free or plateau conclusion. The heap/native-cache growth remains a causal follow-up, and no numerical memory or latency budget is approved by this run.

The [artifact manifest](final-acceptance/wave-04/02/instrumented-memory/artifact-manifest.json) indexes 14 local-only heap snapshots (174,219,779 bytes) and compact measurements/retaining paths. Their hashes and sizes were independently verified. Raw heaps are not committed to Git; the [retention record](final-acceptance/wave-04/02/instrumented-memory/coordinator-retention.json) also describes byte-identical compressed resource telemetry. Original fixture-build failure is retained: a broad import alias intercepted the grid's public subpath. The specific alias correction passed a fresh fixture build, three import-resolution checks, seven policy tests and the full unchanged run. No library build or dependency installation was needed.

## Current production comparison — 2026-10-18

A-B-10/A-G-20 close with the [measurement/phase receipt](backlog-to-ten/performance-grid-closure.json).
The exact library source matches draft candidate `f049b215e28e4157200f99ebf5fe52a7c04cae5a`;
the root checkout's historical HEAD is separately recorded. Fresh installed tarball
SHA256 `238c37c0b6c0c705cb4da9000f43ae4e6ddcb023c51dde955b8ef318e746a56c`
passes its package audit, independent React19 consumer and14 import-boundary builds.
This is a local retained artifact, not an official Actions tarball.

| Import boundary | Emitted JS bytes | gzip9 bytes |
| --- | ---: | ---: |
| Button | 70,293 | 20,255 |
| AppDataGrid | 711,248 | 177,177 |
| PageRichTextEditorSection | 888,349 | 237,379 |

The separate shared stylesheet is253,155bytes /22,250gzip9bytes. Full fourteen-entry
module inventories and output hashes remain in `backlog-to-ten/bundles-02`;
these are emitted audit-fixture sizes, not universal application transfer sizes.

`performance-06` runs84 current production navigations across seven configurations,
with three warmups and nine recorded navigations each,4200 actual update samples,
and seven successful active-update disposal probes. It reuses the exact
`performance-05` baseline JSON; strict comparisons verify identical fixture/runner,
method, runtime/browser, viewport, hardware and workload. Both artifacts are owned
foundation builds; this does not compare React Aria with an original MUI build.

| Measurement | Older baseline median ms | Current median ms | Baseline p95 ms | Current p95 ms |
| --- | ---: | ---: | ---: | ---: |
| Processing grid, large-page initial | 315.2 | 312.9 | 371.3 | 324.5 |
| Catalog grid, large-page initial | 354.4 | 370.8 | 431.2 | 393.8 |
| Catalog grid, large-page input during updates | 277.0 | 264.7 | 410.8 | 381.9 |
| Catalog grid, large-page updates | 278.4 | 267.9 | 628.5 | 598.5 |
| Catalog grid, large-page selection during updates | 265.8 | 266.2 | 343.3 | 514.5 |
| Selector initial | 170.4 | 157.3 | 210.3 | 182.6 |

The pre-fix catalog startup median476.1ms prompted removal of redundant DOM-ref
state; the current370.8ms observation retains the remaining16.4ms median difference
from the older baseline. The selection tail is explicitly unresolved:514.5ms is
the maximum of nine recorded selection samples (nearest-rank p95), at iteration4;
that iteration is also the baseline's343.3ms maximum. Every sample overlaps actual
updates and its host selection is verified. Median selection remains nearly equal.
No trace establishes a GC/load cause. Required A-P-08/A-X-19 work must evaluate
stable repeats and representative consumer hardware before approving budgets;
these results do not imply all distributions improved.

Raw samples, baseline/candidate inventories, frame-opportunity method, timings and
host load averages remain retained. The composed host totals246,048baseline and
246,979currentgzipbytes across all emitted output, including both renderers;
these are conservative totals, not minimum route payloads, paint timings or INP.

## Package-size follow-up after native focus fixes

The separately retained `backlog-to-ten/bundles-03` audit consumes archive
`885f3fd9fa90ad80dd1871dd77feab3283c992f219c49c4b1127adc780c57d68`
from distribution digest
`393ebefedd7db8586ecba34b8564b52a67e91b92e7160967fefaff3fbc9b7871`.
All fourteen installed import boundaries and the independent React19 foundation
consumer pass. `source-input-join-03.json` joins all874 UI files to local proposed
commit `c7b2192dbb6d51284a64135ab5ebbebb4cd8fd91` and the fresh native-27 build.
This remains local, unmerged evidence, separate from official Actions artifacts.

Compared with bundles-02 under the same Node24/React19 import method, Button and
AppDataGrid JavaScript bytes remain identical. Shared CSS grows612 raw bytes /
76 gzip-level9 bytes to253,767 /22,326. The editor JavaScript grows248 raw /62
compressed bytes to888,597 /237,441. Per-boundary values, hashes and deltas are in
`bundles-03/comparison.json`. Earlier grid timings retain their exact f049 source;
this follow-up does not relabel those timings, claim improved latency or supply
representative-machine budgets for A-P-08/A-X-19.

### Bounded catalog selection-tail repeat

`backlog-to-ten/performance-07-catalog-tail` repeats only the catalog large-page
workload (three warmups, nine measured navigations and450 recorded updates) on
the c7b2192 local distribution above. It is an explicit diagnostic, not a new
complete matrix or a replacement for performance-06. Fixture/runner bytes,
method, viewport and the recorded runtime/browser/hardware fields match. The
active-update disposal probe and all post-navigation cleanup checks pass.
Selection median/p95 are268.1/318ms, versus266.2/514.5ms in performance-06;
input median/p95 are269.3/375.9ms versus264.7/381.9ms. Update median/p95 are
270.7/585.7ms versus267.9/598.5ms. The nine-sample selection maximum did not recur;
its cause remains unestablished. Required slower-hardware/budget work and stable
repetitions remain open; this is no universal speed, INP or physical-input claim.
