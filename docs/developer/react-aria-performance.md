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
