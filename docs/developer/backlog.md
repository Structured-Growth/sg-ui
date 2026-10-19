# SGUI backlog

Updated: 2026-10-18. This is the single working backlog, not a formal requirements
specification. **20 active tasks; 6 deferred features.** No task was completed,
waived or newly authorized by this consolidation. Parent rollups and historical
checkbox totals are not additional tasks.

Use the existing IDs when recording work. Task type describes the work, not its
priority. Preserve functionality → regression → hardening execution order; see
[execution policy and architecture](react-aria-execution-policy.md). Completed
baseline/regression work must not be reopened merely because it is archived.

## Active tasks

| ID | Task type | Work remaining | Evidence or next step |
| --- | --- | --- | --- |
| A-L-01 | License review | Verify the exact dependency and asset licenses, including interaction/state/date utilities, icons, grid/editor packages and distributed transitive code. | Package-specific provenance, including client-only@0.0.1, and maintainer/rights disposition. |
| A-L-02 | License compliance | Preserve applicable Apache 2.0 licenses/notices and required modification statements for copied or adapted upstream code. | Review copied/adapted code and its notices; dependency use alone is a different case. |
| A-L-04 | License compliance | Refresh final shipped THIRD_PARTY_NOTICES.md; remove retired notices only when the associated code/assets are no longer distributed. | Join final dependency/asset inventory to package and docs output; resolve missing legal evidence. |
| A-P-07 | Accessibility / validation | Record prototype findings for keyboard, screen readers, zoom, touch, dark appearance, reduced motion, SSR/hydration and production bundles. | Complete missing authentic environment/AT observations; preserve existing bounded evidence. |
| A-P-08 | Performance | Set reproducible performance budgets using the measured baseline and representative consumer hardware. | Agree representative hardware and budgets; do not invent universal rankings. |
| A-X-11 | Accessibility review | Manually review representative dialogs, selectors, calendars, navigation, tables and editors with screen readers. | Record platform/browser/AT versions, findings and follow-up fixes for all six families. |
| A-X-19 | Performance / lifecycle | Record performance/memory budgets, profile large grids/selectors and verify listener, observer, timer and object-URL cleanup across mount/unmount. | Complete remaining profiling/cleanup scope and representative-hardware budget decisions. |
| A-R-12 | CI / artifacts | Retain official builds and package tarballs as Actions artifacts, with names, retention and validation results. | Verify a complete successful exact-head run and current artifact packet; current docs/native artifacts replace retired Storybook output. |
| A-R-17 | Release readiness | Verify npm scope ownership/public access, trusted publishing or token setup, release/tag permissions, provenance and commercial notices. | Owner-supplied access/control and reviewed notices; publication remains separately authorized. |
| A-R-21 | Security review | Preserve minimal AI workflow permissions, trusted/untrusted input separation, credential isolation, separate validation and draft-PR review; no automatic merging. | Maintainer trust/credential review and authorized harmless live AI draft isolation evidence. |
| A-R-23 | CI / automation | Verify AI-created default-token drafts receive full validation even when PR creation does not trigger another workflow. | Actual successful default-token draft flow; do not infer it from ordinary authenticated PR checks. |
| A-R-27 | Release controls | Ensure release-blocking checks run for PR/main paths, AI proposals and infrastructure changes; effective protection must require the actual final check contexts. | Owner-reviewed settings plus observed failed/missing-check blocking; do not push main as a probe. |
| A-Z-06 | License compliance | Confirm final notices match shipped work, and remove obsolete notices only after associated source/assets are absent from both package and catalog. | Final distribution/rights disposition; shares evidence with A-L-01/02/04 but retains its acceptance ID. |
| A-Z-11 | Production validation | Verify supported package/type/build, docs/native browser, accessibility, visual, SSR and performance checks; document genuine limitations. | Complete supported-environment matrix, including device/AT/visual/support evidence; one green CI run alone is insufficient. |
| A-Z-14 | Release readiness | Confirm licensing/notices, public npm setup, Actions-only official builds/releases, draft AI PRs and absence of Changesets remain consistent. | Final owner decisions and the corresponding legal/npm/release-control evidence. |
| A-Z-15 | Acceptance / documentation | Record final dependency/feature decisions, accepted evidence, completed PRs and explicitly deferred future tasks. | Reconcile required work without reclassifying unfinished obligations as optional; retains ACCEPT-001 rollup intent. |
| A-Z-16 | Final acceptance | Mark migration complete only after every required acceptance obligation is satisfied. | Depends on all required work above; retains ACCEPT-002 rollup intent. Publishing remains a separate authorized release action. |
| DOCS-005-l | Docs / production validation | Audit source/dev/runtime dependencies and CI references, complete a frozen install, production library/docs builds and preserved native/consumer gates; record zero active Storybook dependencies and full scenario mapping. | Accept the complete exact-head production/artifact matrix; then close parent DOCS-005 without counting it as another task. |
| DOCS-007 | Docs / deployment | Implement immutable release documentation deployments and missing-page version fallback. | Confirm hosting target and immutable URL convention, then implement and validate the version/fallback behavior. |
| HM-ADOPT-01 | Component integration | Adopt HierarchicalMenu in the intended current menu while preserving host adapters, pending/error behavior and existing states. | Confirm whether the adopter is SideNavigation or the documentation sidebar; implement and validate that integration. |

## Deferred features

These six features are outside the current required milestone. Listing them does
not authorize implementation. Split selected scope into concrete tasks later.

| ID | Task type | Potential future work |
| --- | --- | --- |
| FUT-A-20 | Architecture / framework support | Document how tokens/CSS and framework-independent models could be shared with other frameworks; require separate wrappers, tests, and support policy before claiming such support. |
| FUT-D-21 | Design tooling | Define a token-to-design-tool export workflow if Figma integration is introduced; no parallel manually maintained palette. |
| FUT-G-24 | Grid features | Record export/import, aggregation/pivoting, tree data, range selection, clipboard paste, formulas, undo, and spreadsheet navigation as separate features unless explicitly selected. |
| FUT-K-13 | Recurrence UI | Define recurrence UI separately: frequency, intervals, days, count/until, exceptions, preview, and explicit host-owned recurrence processing. |
| FUT-K-14 | Scheduler UI | Evaluate a resource/week/day scheduler separately from date selection: overlapping events, time slots, capacity, drag/resize, keyboard alternatives, and virtualization. |
| FUT-K-15 | Booking compositions | Define appointment/course-session/booking compositions through data/callbacks and generic models; availability computation, conflicts, reservations, permissions, and persistence stay host-owned. |

## Status and evidence

On 2026-10-19, reconciled `codex/tooltip-viewport-debug-9ca3e666` into
`dev`. Its tooltip lifetime and AppShell focus-outline fixes, affected tests,
native diagnostic attachment and usage guidance already match `dev` byte for
byte. The merge records ancestry and omits the temporary branch-only diagnostic
workflow. Targeted Tooltip/AppShell unit validation passes 15 tests in two files.
Existing browser evidence remains in
[the saved stop record](backlog-to-ten/STOP-STATE.md) and
[shell reconciliation receipt](backlog-to-ten/shell-focus-reconciliation.json).
This completes branch reconciliation only; A-Z-11, A-R-12 and DOCS-005-l retain
their broader outstanding acceptance obligations. No active task count changes.

The last execution closed nine leaves, reducing the active count from 29 to 20.
The saved [stop record](backlog-to-ten/STOP-STATE.md) identifies bounded passes and
the then-pending full checkpoint. Consolidation does not relabel that run as a
pass or claim the integrated dev head has complete acceptance.

- [Owner evidence and decisions needed](backlog-to-ten/owner-evidence-needed.md).
- [Final acceptance history](archive/2026-10-18-task-lists/react-aria-final-acceptance.md).
- [Execution history](archive/2026-10-18-task-lists/react-aria-progress.md).
- [Archived task lists and completed work](archive/2026-10-18-task-lists/README.md).
- [Docs architecture and migration evidence](docs-website.md).
- [HierarchicalMenu contract and evidence](hierarchical-menu-scope.md).
- [Supported environment evidence](react-aria-browser-support.md).

When a task finishes, move its result/evidence into the archive and remove its
active row. Keep one current backlog; guides, receipts, review templates and
historical snapshots must not become competing task queues.
