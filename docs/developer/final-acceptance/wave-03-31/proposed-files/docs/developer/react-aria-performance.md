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
run from event capture or the timer callback to two post-commit animation frames;
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
