# Controls/navigation batch continuation

The new HierarchicalMenu implementation is still frozen. The coordinator's
`controls-layout-first-results.json` contains all9 passing native executions
(three existing tests in Chromium, Firefox and WebKit). Exact extracted cases,
raw report hash and current source hashes are in hierarchical-native-reuse.json.
This reuses actual coordinator evidence; the earlier interrupted run's unrun
cases remain unrun and are not counted as passes.

Ready additions, all patch-only during the pack/lock window:

1. `hierarchical-render-capture.patch`: adds3 screenshot attachments to the
   existing first native case. It preserves every assertion and adds no test case.
   After freeze, apply then execute only that case on the admitted host and review
   the root compact/comfortable view, scrolled deep-level Back, and mixed-inline
   return-focus images. The other6 passing engine executions need no rerun for
   this capture-only edit. This is the remaining concrete HM-F04 rendered-review
   deliverable; passing interaction tests alone do not supply that observation.
2. `overlay-zoom/runner-addition.patch` plus additive `overlay-zoom/checks.mjs`:
   extends wave04/07's existing real Chrome zoom runner with `--suite overlays`,
   using13 existing fixture configurations per requested density. Instructions,
   exact zoom200/400 commands and evidence limits are in overlay-zoom/README.md.
   This covers the distinct A-U19 overlay gap without duplicating the C12 runner
   or requiring a fixture rebuild. It is prepared and statically checked, not run.

No leaf statuses/counts or coordinator-closed items changed. No build/browser,
package suite, simulator, Git index/branch, publication or audible Apple work ran.
Root should relay these artifacts to batch lead5 and the existing zoom runner
owner so that shared-runner integration remains serial.
