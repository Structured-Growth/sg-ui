# SGUI backlog

Updated: 2026-10-22. **14 active tasks; 6 deferred features.** This is the single
working backlog and lists unfinished work only. Historical validation captures are not retained in the working tree.
Parent rollups are not additional tasks.

Use the existing IDs when recording work. Task type describes the work, not its
priority. Preserve functionality → regression → hardening execution order; see
[execution policy and architecture](react-aria-execution-policy.md). Existing baseline functionality and regression assertions remain required.

## Active tasks

| ID | Task type | Work remaining | Evidence, next step and assistance needed |
| --- | --- | --- | --- |
| A-L-01 | License review | Verify the exact dependency and asset licenses, including interaction/state/date utilities, icons, grid/editor packages and distributed transitive code. |Current package/docs inventories and notice joins are reconciled; client-only@0.0.1 lacks authentic publisher notice/copyright evidence. First-party rights are confirmed. **Assistance:** authentic client-only publisher evidence; no additional first-party review is required. |
| A-L-04 | License compliance | Refresh final shipped THIRD_PARTY_NOTICES.md; remove retired notices only when the associated code/assets are no longer distributed. |Current package/docs notice reconciliation and retired-code absence checks are complete; the remaining notice evidence is client-only. **Assistance:** authentic client-only publisher notice/copyright evidence before finalizing that entry. |
| A-P-07 | Accessibility / validation | Record prototype findings for keyboard, screen readers, zoom, touch, dark appearance, reduced motion, SSR/hydration and production bundles. |Complete missing authentic environment/AT observations; preserve existing bounded evidence. **Assistance:** authentic manual screen-reader/physical-device observations for the remaining supported environments. |
| A-X-11 | Accessibility review | Manually review representative dialogs, selectors, calendars, navigation, tables and editors with screen readers. |Record platform/browser/AT versions, findings and follow-up fixes for all six families. **Assistance:** a human screen-reader/device reviewer for dialogs, selectors, calendars, navigation, tables and editors. |
| A-R-17 | Release readiness | Verify npm scope ownership/public access, trusted publishing or token setup, release/tag permissions, provenance and commercial notices. |Owner-supplied access/control and reviewed notices; publication remains separately authorized. **Assistance:** resume npm setup when desired and confirm @structure-growth versus configured @structured-growth. Publication is deferred. |
| A-R-21 | Security review | Preserve minimal AI workflow permissions, trusted/untrusted input separation, credential isolation, separate validation and draft-PR review; no automatic merging. |Pinned source/CLI and bounded source/guard checks pass. **Assistance:** maintainer review of credential/trust boundaries, approval of required account settings and authorized harmless live AI draft isolation evidence. |
| A-R-23 | CI / automation | Verify AI-created default-token drafts receive full validation even when PR creation does not trigger another workflow. |Actual successful default-token draft flow; do not infer it from ordinary authenticated PR checks. **Assistance:** enable draft-PR capability for the default Actions token (verify the current account setting); no setting change is inferred from general development authorization. |
| A-R-27 | Release controls | Ensure release-blocking checks run for PR/main paths, AI proposals and infrastructure changes; effective protection must require the actual final check contexts. |Owner-reviewed settings plus observed failed/missing-check blocking; do not push main as a probe. **Assistance:** confirm authorized enforcement/bypass policy and resolve any GitHub plan/permission restriction; verify current settings before relying on protection. PR review remains required policy. |
| A-Z-06 | License compliance | Confirm final notices match shipped work, and remove obsolete notices only after associated source/assets are absent from both package and catalog. |Final distribution/rights disposition; shares evidence with A-L-01/02/04 but retains its acceptance ID. First-party ownership is resolved; **assistance:** authentic client-only publisher evidence remains needed; no additional first-party review is required. |
| A-Z-11 | Production validation | Verify supported package/type/build, docs/native browser, accessibility, visual, SSR and performance checks; document genuine limitations. |Run supported Node 22/24 package, docs, browser and consumer validation on the release candidate. **Assistance:** authentic device/AT/visual/support observations; automated results do not establish those observations. |
| A-Z-14 | Release readiness | Confirm licensing/notices, public npm setup, Actions-only official builds/releases, draft AI PRs and absence of Changesets remain consistent. |Final owner decisions and the corresponding legal/npm/release-control evidence. **Assistance:** npm setup is explicitly deferred; unresolved live account/protection and third-party obligations still apply. |
| A-Z-15 | Acceptance / documentation | Record final dependency/feature decisions, accepted evidence, completed PRs and explicitly deferred future tasks. |Reconcile required work without reclassifying unfinished obligations as optional; retains ACCEPT-001 rollup intent. **Assistance:** final acceptance of the completed evidence and explicitly recorded limitations after independent reconciliation. |
| A-Z-16 | Final acceptance | Mark migration complete only after every required acceptance obligation is satisfied. |Depends on all required work above; retains ACCEPT-002 rollup intent. Publishing remains a separate authorized release action. **Assistance:** final human acceptance after all required obligations are satisfied; no release authorization is implied. |
| DOCS-007 | Docs / deployment | Complete immutable release documentation deployments and host-level missing-page version fallback. |DOCS-007-a implements/tests manifest-based route preservation and overview fallback; static export, snapshot assembly and latest rules are prepared in [Amplify guidance](../deployment/amplify.md). Build, deploy and validate actual host behavior. AWS Amplify/domain/URL convention confirmed; **assistance:** connect/configure the Amplify application and DNS, then make a deployed target available for verification. |

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

## Decisions and supporting guidance

[Owner decisions](owner-decisions.md) record the confirmed hosting target,
first-party source ownership and delegated performance-profile selection. npm
publication remains deferred. Each active task above identifies the remaining
assistance; completed technical portions do not waive unmet acceptance obligations.

- Owner evidence and decisions needed.
- [Owner follow-through](owner-follow-through.md).
- [Docs architecture and migration evidence](docs-website.md).
- [Supported environment evidence](react-aria-browser-support.md).

When a task finishes, remove its active row. Keep completed-task narratives and
historical evidence out of this working backlog.
