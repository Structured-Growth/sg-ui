# Owner-delegated performance reference — 2026-10-21

The owner delegated representative hardware and budget selection. This profile
uses an Apple M5 / 16GiB host and an explicit Chromium 4× CPU throttle for latency.
It is a reproducible conservative CPU proxy, not an asserted 15th-percentile
physical device, touch measurement, paint measurement or INP result. The recorded
browser/runtime, viewport, fixture hashes, load observations and emitted asset
hashes identify each packet independently.

## Protocol and policy

`budget-policy.json` fixes the selection rule before completion: two complete
sessions, each with three warmup and nine recorded navigations for all seven
processing/catalog grid and selector configurations. Every navigation retains all
50 updates plus input and selection during updates. Sort activation uses native
keyboard input. The separate sort diagnostic is not a budget baseline.

For each action median and nearest-rank p95, the reference ceiling is the larger
session observation plus 25%, rounded upward to 10ms. Composed fixture JS/CSS
gzip-level-9 ceilings add 10%, rounded upward to 1KiB. These are regression limits,
not claims that every observed latency meets a user experience target. In
particular, the large-page workload deliberately renders a demanding configuration.

Memory uses five warmup plus 25 recorded active-update mount/dispose cycles in
each configuration, with explicit unmount, zero remaining owned DOM/portal/timer/
frame state, no late publication, browser GC counters and 14 warm/final snapshots.
The preselected limits allow at most 1MiB final-minus-first recorded whole-page
used-heap growth, zero listener-count range and eight DOM nodes of range. A finite
window does not establish a permanent plateau or attribute all browser memory to
SGUI. `lifecycle-coverage.json` separately maps existing observer/frame/object-URL
ownership tests; their execution belongs to the exact-head CI packet.

## Reproduction

Build the reviewed library and performance fixture under the repository's serial
validation leases. Keep the build fixed throughout measurement; record
`SGUI_PERF_SOURCE_HEAD` and `SGUI_PERF_CPU_THROTTLE=4`. Run the browser measurement
script twice for each renderer, then the memory script with `--snapshots` as
recorded in `execution.json`. The baseline source is identified in the packets;
a later CI result must not relabel those measurements as a different source head.

`finalize-budgets.py` checks matching complete sessions, derives the initial
versioned limits and invokes the read-only verifier for each session separately.
It refuses to overwrite an existing budget. Future verification runs the checker
directly against that saved budget; it must not rerun the calculation to make a
regression pass:

```sh
node packages/ui/tests/performance/check-reference-budgets.mjs \
  docs/developer/final-acceptance/owner-reference-2026-10-21/reference-budgets.json \
  /absolute/new-memory.json /absolute/new-processing.json /absolute/new-catalog.json
```

Run `python3 review-heaps.py /absolute/raw-heap-directory` from this directory to
verify raw snapshot bytes and reuse the pinned retained strong-graph algorithm.
Raw snapshots are kept locally outside tracked source; the retention record names
the exact location. Grouped self-size and sampled strong retaining paths are
review aids, not allocation stacks or transitive retained-size calculations.

## Accepted results

A-P-08 and A-X-19 close for this recorded reference/bounded cleanup scope. Both
full latency sessions pass the frozen `reference-budgets.json`, with zero findings
in `verification-session-1.json` and `verification-session-2.json`. There are 168
reference navigations and 8,400 update samples including warmups; the 126 measured
navigations contain 6,300 update samples. Composed bundle ceilings are 246,784
JS gzip bytes and 25,600 CSS gzip bytes. Individual action median/p95 ceilings are
recorded explicitly in the budget rather than summarized as one universal limit.

Measurements retain source `7cf2db63f492ebcb143d2347c5c599d0f05bab27`.
`current-asset-join.json` verifies every emitted benchmark JS/CSS byte against a
fresh build of `fbc08a12a501aaf6982b1d090582c23d09900095`. This extends these exact
benchmark configurations to the tested current source, without relabelling the
original runs or claiming byte identity for every library module. Tooltip and
docs-adapter changes have their separate current-head behavior checks.

All 210 memory cycles pass. Recorded post-GC whole-page observations are:

| Configuration | Final minus first heap bytes | Listener-count range | DOM-node range |
| --- | ---: | ---: | ---: |
| processing-small | 456,504 | 0 | 2 |
| processing-wide | 463,452 | 0 | 2 |
| processing-largePage | 479,104 | 0 | 2 |
| catalog-small | 482,036 | 0 | 0 |
| catalog-wide | 569,524 | 0 | 2 |
| catalog-largePage | 418,400 | 0 | 0 |
| processing-selector | 450,856 | 0 | 0 |

All 14 snapshots (174,452,243 bytes) have independently verified size/SHA-256 in
`snapshot-retention.json`. Final snapshots have no raw detachedness-2 nodes.
React fiber/root shape counts stay constant at the warm/final observations; no
warm owner IDs persist into final candidate shapes, no fixture row-value shapes
are identified, and no direct strong native MediaQuerySet-to-closure edges are
found. Sampled native media-query paths pass through document StyleEngine/rules;
performance/layout records pass through browser performance buffers. Remaining
React bookkeeping paths pass through the fixture's imported createRoot module
context. These are observed paths, not allocation stacks or proof that every byte
is a browser cache. No accumulating live SGUI callback/row-data path was identified
in this bounded review. Whole-page heap still grows; no permanent plateau or
universal leak-free conclusion is made.

`lifecycle-coverage.json` maps existing observer/frame/object-URL ownership tests;
the accepted [official checkpoint](../../backlog-to-ten/owner-final-ci-2026-10-21/README.md)
executes the full current unit matrix. The local incidental-click verifier repair
retains every mandatory input/selection/update sample and has six passing guards.
An initial retention helper precreated its copy destination and was corrected;
raw measurements were unchanged and final copied bytes were verified before review.
Manual AT/device and broader production acceptance remain separate backlog tasks.
