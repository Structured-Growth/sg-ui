# SGUI backlog

Updated: 2026-10-21. This is the single working backlog, not a formal requirements
specification. **14 active tasks; 6 deferred features.** The 2026-10-18 consolidation
completed, waived or authorized no tasks; subsequent closures are recorded below.
Parent rollups and historical checkbox totals are not additional tasks.

Use the existing IDs when recording work. Task type describes the work, not its
priority. Preserve functionality → regression → hardening execution order; see
[execution policy and architecture](react-aria-execution-policy.md). Completed
baseline/regression work must not be reopened merely because it is archived.

## Active tasks

| ID | Task type | Work remaining | Evidence, next step and assistance needed |
| --- | --- | --- | --- |
| A-L-01 | License review | Verify the exact dependency and asset licenses, including interaction/state/date utilities, icons, grid/editor packages and distributed transitive code. |Current package/docs inventories and notice joins are reconciled; client-only@0.0.1 lacks authentic publisher notice/copyright evidence. First-party rights are confirmed. **Assistance:** authentic client-only publisher evidence; no additional first-party review is required. |
| A-L-04 | License compliance | Refresh final shipped THIRD_PARTY_NOTICES.md; remove retired notices only when the associated code/assets are no longer distributed. |Current package/docs notice reconciliation and retired-code absence checks are complete; the remaining notice evidence is client-only. **Assistance:** authentic client-only publisher notice/copyright evidence before finalizing that entry. |
| A-P-07 | Accessibility / validation | Record prototype findings for keyboard, screen readers, zoom, touch, dark appearance, reduced motion, SSR/hydration and production bundles. |Complete missing authentic environment/AT observations; preserve existing bounded evidence. **Assistance:** authentic manual screen-reader/physical-device observations for the remaining supported environments. |
| A-X-11 | Accessibility review | Manually review representative dialogs, selectors, calendars, navigation, tables and editors with screen readers. |Record platform/browser/AT versions, findings and follow-up fixes for all six families. **Assistance:** a human screen-reader/device reviewer for dialogs, selectors, calendars, navigation, tables and editors. |
| A-R-17 | Release readiness | Verify npm scope ownership/public access, trusted publishing or token setup, release/tag permissions, provenance and commercial notices. |Owner-supplied access/control and reviewed notices; publication remains separately authorized. **Assistance:** resume npm setup when desired and confirm @structure-growth versus configured @structured-growth. Publication is deferred. |
| A-R-21 | Security review | Preserve minimal AI workflow permissions, trusted/untrusted input separation, credential isolation, separate validation and draft-PR review; no automatic merging. |Pinned source/CLI and bounded source/guard checks pass. **Assistance:** maintainer review of credential/trust boundaries, approval of required account settings and authorized harmless live AI draft isolation evidence. |
| A-R-23 | CI / automation | Verify AI-created default-token drafts receive full validation even when PR creation does not trigger another workflow. |Actual successful default-token draft flow; do not infer it from ordinary authenticated PR checks. **Assistance:** enable draft-PR capability for the default Actions token (read-only API reports it disabled on 2026-10-21); no setting change is inferred from general development authorization. |
| A-R-27 | Release controls | Ensure release-blocking checks run for PR/main paths, AI proposals and infrastructure changes; effective protection must require the actual final check contexts. |Owner-reviewed settings plus observed failed/missing-check blocking; do not push main as a probe. **Assistance:** confirm authorized enforcement/bypass policy and resolve any GitHub plan/permission restriction; current main/dev protection is absent and inherited rulesets are empty. A [main protection proposal](backlog-to-ten/main-protection-proposal.md) is ready for review. PR review remains required policy. |
| A-Z-06 | License compliance | Confirm final notices match shipped work, and remove obsolete notices only after associated source/assets are absent from both package and catalog. |Final distribution/rights disposition; shares evidence with A-L-01/02/04 but retains its acceptance ID. First-party ownership is resolved; **assistance:** authentic client-only publisher evidence remains needed; no additional first-party review is required. |
| A-Z-11 | Production validation | Verify supported package/type/build, docs/native browser, accessibility, visual, SSR and performance checks; document genuine limitations. |The [exact-head automated matrix](backlog-to-ten/owner-final-ci-2026-10-21/README.md) passes on Node 22/24 and all three native engines. Complete genuine device/AT/visual/support observations; the automated pass does not supply them. **Assistance:** remaining authentic device/AT/visual/support observations; automated supported-runtime/browser/consumer checks are complete in the linked packet. |
| A-Z-14 | Release readiness | Confirm licensing/notices, public npm setup, Actions-only official builds/releases, draft AI PRs and absence of Changesets remain consistent. |Final owner decisions and the corresponding legal/npm/release-control evidence. **Assistance:** npm setup is explicitly deferred; unresolved live account/protection and third-party obligations still apply. |
| A-Z-15 | Acceptance / documentation | Record final dependency/feature decisions, accepted evidence, completed PRs and explicitly deferred future tasks. |Reconcile required work without reclassifying unfinished obligations as optional; retains ACCEPT-001 rollup intent. **Assistance:** final acceptance of the completed evidence and explicitly recorded limitations after independent reconciliation. |
| A-Z-16 | Final acceptance | Mark migration complete only after every required acceptance obligation is satisfied. |Depends on all required work above; retains ACCEPT-002 rollup intent. Publishing remains a separate authorized release action. **Assistance:** final human acceptance after all required obligations are satisfied; no release authorization is implied. |
| DOCS-007 | Docs / deployment | Complete immutable release documentation deployments and host-level missing-page version fallback. |DOCS-007-a implements/tests manifest-based route preservation and overview fallback; static export, snapshot assembly and latest rules are prepared in [Amplify guidance](../deployment/amplify.md); [batch evidence](backlog-to-ten/nine-corrections-2026-10-21.md). The [fresh static/normal host checks](backlog-to-ten/owner-final-host-2026-10-21/README.md) pass; deploy and validate actual host behavior. AWS Amplify/domain/URL convention confirmed; **assistance:** connect/configure the Amplify application and DNS, then make a deployed target available for verification. |

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

[Owner decisions](owner-decisions.md) resolve hosting choice, first-party rights and performance-profile selection. npm publishing is deferred. Each active row identifies any further assistance; unmet external acceptance remains open.

[Owner follow-through](owner-follow-through.md) records the source-history cleanup,
current inventory checks, hosting compatibility finding and exact-ref validation
route. Edited historical summaries are labelled and do not replace raw evidence.

On 2026-10-21, completed nine bounded corrective children: A-Z-15-a, A-R-12-b,
A-R-21-a, A-R-23-a, A-L-01-a, A-L-04-a, A-Z-06-a, DOCS-005-l-a and DOCS-007-a.
The [combined correction/test receipt](backlog-to-ten/nine-corrections-2026-10-21.md)
maps each deliverable to its source and evidence: 69 JavaScript tests, six Python
tests, nine focused Chromium cases and the fresh production docs/library build
pass. All nine broken maintained-documentation links are repaired without
manufacturing missing evidence. These children do not close their broader
owner/external acceptance parents; the active parent count remains 19.

HM-ADOPT-01 completed on 2026-10-21: the documentation sidebar now consumes
HierarchicalMenu for category drilldown, controlled paths, directional motion and
focus recovery, retaining SearchField and the Next navigation adapter. The host
keeps route/category metadata, current markers and the sole sidebar scroll pane.
The production library/docs build, 98-route catalog checks, seven HierarchicalMenu
units, five focused Chromium sidebar cases, library typecheck and foundation
guards pass. See [adoption evidence](hierarchical-menu-scope.md#documentation-sidebar-adoption--2026-10-21).
This closes the integration leaf and reduces the active count from 20 to 19;
broader cross-browser/device/AT and release obligations remain separate.

On 2026-10-21, reconciled the completed checkpoint run 39177563118: docs, all
three native engines and Node 22 passed; Node 24 failed before its first packed
browser assertion because its runner lacked the Playwright executable. A-R-12-a
adds job-local browser/OS dependency provisioning and guards its engine scope,
condition and ordering. All 25 CI enforcement/artifact verifier tests pass locally.
See [the repair receipt](backlog-to-ten/ci-consumer-browser-repair.md). The corrected
workflow still needs an exact-head Actions run and artifact verification;
A-R-12 and DOCS-005-l remain open. No active task count changes.

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

On 2026-10-21, A-L-02 closes after Apache runtime text preservation and restoration
of the pinned copied-action LICENSE/NOTICE were verified. See the
[technical reconciliation](backlog-to-ten/owner-license-reconciliation.md).
The active count is 18; other all-license, docs-output and release gates remain open.

Read-only [GitHub control observations](backlog-to-ten/github-control-observations-2026-10-21.json)
record the default-token and main/dev enforcement blockers without changing settings.


On 2026-10-21, A-P-08 and A-X-19 close with the owner-delegated
[reference budgets and bounded lifecycle review](final-acceptance/owner-reference-2026-10-21/README.md):
two full latency sessions, 210 active-update mount/dispose cycles, 14 verified
snapshots, explicit regression ceilings and a byte-identical current benchmark
asset join. These are finite reference observations, not universal device/INP or
permanent plateau claims.

A-R-12 and DOCS-005-l close with the successful exact-head
[official checkpoint and verified artifact packet](backlog-to-ten/owner-final-ci-2026-10-21/README.md).
Node 22.12.0 and 24.22.0, the complete maintained native engine collections,
247 docs cases and required packed consumers pass. Existing protocol/device skips
are explicitly retained. DOCS-005 closes with its final leaf and is not counted
again. These four parent/leaf closures reduce the active count from 18 to 14.
All remaining active rows retain their stated assistance; DOCS-007 still requires
actual AWS/DNS/release hosting, and npm publication remains deferred.
