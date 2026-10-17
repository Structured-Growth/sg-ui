# Remaining browser, visual and final acceptance work

**Current open work:** 0 hardening (V) review items, 64 final-acceptance (A) items and six explicitly deferred future items. Completed items have been removed; evidence remains in the [execution receipt](backlog-execution-2026-10-15.md).

Priority: P3 — third, only after the required functionality baseline and regression tasks are complete. P4 final acceptance follows hardening. Known defects are recorded individually as `BUG-0001`, `BUG-0002`, etc. with reproduction, expected result, affected component, priority and linked regression; allocate IDs only when a real defect is found. Do not create empty defect tasks.

Browser evidence must name engine and tested scope. Visual review must name theme, density, width and locale. Do not convert DOM-emulation evidence into native/device/screen-reader evidence. Accept sufficient existing evidence without rerunning it solely for checklist credit.

Use the [resumable execution index](react-aria-hardening-execution.md) to retain
passing batches and resume only unfinished or affected coverage.

Not-applicable cases require a concrete source-based reason, not a silent checkmark. Split an engine or state matrix further when one chat cannot close it; retain the original parent and append stable child suffixes.

## Current example and browser host

### Confirmed defects from the parallel acceptance review

BUG-0008–0012 are fixed with bounded evidence:

- **BUG-0008:** Picker Clear/commit guards preserve disabled/read-only authority.
- **BUG-0009:** TextArea renders inherited decorative icons with multiline alignment.
- **BUG-0010:** DatePicker text/segmented/datetime candidates enforce availability,
  preserve accepted form values and recheck host policy before Apply.
- **BUG-0011:** Calendar callback/static availability reasons have full-date
  descriptions and keyboard-accessible disclosure for visible dates.
- **BUG-0012:** Both grid validators reject the actual reserved __reorder field
  before row traversal/rendering; existing reserved aliases remain rejected.

[Coordinator fix receipts](final-acceptance/coordinator-fixes/evidence.json),
[fix-08](final-acceptance/fix-08/report.md),
[fix-09](final-acceptance/fix-09/report.md),
[fix-10](final-acceptance/fix-10/report.md) and
[integrated results](final-acceptance/coordinator-integration/evidence.json)
retain original failures, affected units and native browser evidence. Their
broader A-A-06/A-A-10/A-K-04/A-K-07/A-K-17/A-M-16 obligations remain partial.
A-G-02 and A-K-16 close only their original contract/documentation criteria.

All 282 remaining A leaves were reviewed exactly once in wave 02: 127 complete,
154 partial and one blocked before integration. Two additional narrow closures
bring this pass to **129 complete, 152 partial and one blocked**. Original tasks,
report hashes and successors remain in the
[wave reconciliation](final-acceptance/wave-02-reconciliation.json) and
[supplement](final-acceptance/coordinator-integration/supplemental-reconciliation.json).

The [website transition plan](docs-website.md#active-transition-plan--2026-10-14)
governs new examples and fixture migration. New public examples use the Next.js
website; native scenarios use docs-owned test fixtures as their mapped transfers
land. References below to a production story mean the equivalent production-scope
example/fixture after transfer. The migrated existing native tests remain required against the new fixture host;
Storybook runtime is removed. Original A-* wording and historical results are preserved; close each
leaf against its behavioral requirement and record the new host, without silently
claiming old evidence exercised the website or changing acceptance counts.

## Editor review completion — 2026-10-17

HB-19 and HB-20 close the final 20 named V presentation/translated reading-order
leaves. [Chrome evidence](final-acceptance/editor-chrome-presentation/results.json)
and [rich editor evidence](final-acceptance/rich-editor-presentation/results.json)
retain exact matrices, reviewed captures, source hashes, original failures and
successful corrections. BUG-0013 (partly visible multi-line selection anchoring)
and TABS-MENU-WEBKIT-RO (intrinsic menu sizing feedback) are fixed and validated.

This is completion of the original 300 V checklist leaves, not all final acceptance
or production approval. The historical Material calendar year-label fit follow-up
in [field-focus evidence](final-acceptance/field-focus-boundary/results.json) still
needs current-head reproduction; keep its strict fit assertion. Continue with
specific remaining A successors after checking current focused defects.

## Wave 04 acceptance reconciliation — 2026-10-17

Nineteen original A obligations close after reviewing retained implementation,
F/T/V and later native/documentation evidence. The [per-leaf decisions](final-acceptance/wave-04/coordinator/accepted-closures.json)
preserve exact criteria and reviewed recommendation bytes. Current total:200/320
closed,120 A remain. New patches and active simulator execution are separate
from these closures; no dispatch alone counts as acceptance.

## P4: catalog component acceptance closure

These close the original inventory rows independently from their baseline leaves. Recorded migration implementations remain accepted history; each row needs its explicitly required later evidence.

- [ ] A-M-16 Reconcile AppDataGrid final acceptance: Complete owned grid implementation, types and helpers; follow G tasks. Link its `F-C16`, `T-C16` and `V-C16` evidence and any unresolved defects.
- [ ] A-M-18 Reconcile AppDataGridRowDnd final acceptance: Replace DOM selectors/ghost styling; keyboard/touch/reorder/cancel behavior. Link its `F-C18`, `T-C18` and `V-C18` evidence and any unresolved defects.

First inventory batch closed A-B-01/02/04; see [final acceptance execution](react-aria-final-acceptance.md).

## P4: original scope obligation closure

Each `A-*` acceptance item below reconciles one original parent with its implementation and regression evidence. Existing checked parents stay checked in the historical ledger; these new closure tasks start open because this rewrite did not perform a fresh acceptance audit. This does not reset accepted implementation work. A parent containing several requirements may close only when each is evidenced, or split into explicit children. Future scope remains deferred and outside the required baseline/acceptance denominator.

- [ ] A-B-05 Reconcile original `B-05`: Snapshot public props, callbacks, models, defaults, subpaths, and deprecations; identify changes that are actually breaking. Historical status: open.
- [ ] A-B-07 Reconcile original `B-07`: Capture representative screenshots and browser interactions for light/dark UI, compact/comfortable controls, editors, navigation, modals, and grids. Historical status: open.
- [ ] A-B-10 Reconcile original `B-10`: Measure production consumer bundles, CSS, editor/grid imports, initial render, and interactive updates with reproducible fixtures. Historical status: open.
- [ ] A-B-14 Reconcile original `B-14`: Keep the learner platform unchanged; collect reference behavior and source provenance read-only. Historical status: checked.
- [ ] A-A-18 Reconcile original `A-18`: Keep heavyweight modules out of basic-control dependency paths; decide which require separate subpaths versus separate packages. Historical status: open.
- [ ] A-L-01 Reconcile original `L-01`: Verify the selected versions' actual licenses, including React Aria Components, hooks/state/date utilities, icon assets, grid engine, editor packages, and transitive distributed code. Historical status: open.
- [ ] A-L-02 Reconcile original `L-02`: Preserve Apache 2.0 licenses and applicable notices; record modifications where required if upstream code is copied or changed rather than merely depended on. Historical status: open.
- [ ] A-L-04 Reconcile original `L-04`: Refresh `THIRD_PARTY_NOTICES.md` from the final shipped dependency and asset inventory; remove a retired notice only after its code/assets are no longer distributed. Historical status: open.
- [ ] A-D-09 Reconcile original `D-09`: Use rem-based text sizing and layouts that tolerate zoom, text spacing changes, long labels, and font substitution. Historical status: open.
- [ ] A-D-15 Reconcile original `D-15`: Design complete hover, focus, pressed, selected, disabled, read-only, invalid, pending, empty, loading, and error states; never rely on color alone for meaning. Historical status: open.
- [ ] A-D-17 Reconcile original `D-17`: Specify explicit light/dark/system settings, initial server theme, `color-scheme`, and hydration behavior without unwanted flashes or browser-global assumptions. Historical status: open.
- [ ] A-C-08 Reconcile original `C-08`: Use container size queries for reusable card, toolbar, navigation, and modal compositions; choose/document containment boundaries so consumers know what supplies the container. Historical status: open.
- [ ] A-C-09 Reconcile original `C-09`: Use logical properties and direction-aware icons/placement for RTL; do not assume physical left/right always means start/end. Historical status: open.
- [ ] A-C-11 Reconcile original `C-11`: Use native nesting with documented tooling/browser support; keep selector depth shallow and component ownership obvious. Historical status: open.
- [ ] A-C-12 Reconcile original `C-12`: Use fluid sizing such as `clamp` where beneficial without preventing text zoom; establish mobile/reflow fallbacks. Historical status: open.
- [ ] A-C-14 Reconcile original `C-14`: Define progressive enhancement with `@supports`; do not adopt limited-support anchor positioning, style queries, or transitions as unconditional dependencies. Historical status: open.
- [ ] A-C-15 Reconcile original `C-15`: Use `:focus-visible` or owned accessible focus-state attributes; preserve visible focus when replacing current outline suppression. Historical status: open.
- [ ] A-I-08 Reconcile original `I-08`: Add icon catalog, accessibility, and bundle checks; update notices for all shipped vector assets. Historical status: open.
- [ ] A-H-08 Reconcile original `H-08`: Validate ICU variables, pluralization, selection counts, date/number formatting, long labels, RTL, and pseudo-localized stories. Historical status: open.
- [ ] A-P-07 Reconcile original `P-07`: Include keyboard, screen-reader, zoom, touch, dark theme, reduced-motion, SSR/hydration, and production bundle checks in prototype findings. Historical status: open.
- [ ] A-P-08 Reconcile original `P-08`: Set reproducible performance budgets from baseline and representative consumer hardware; do not invent universal speed or size rankings. Historical status: open.
- [ ] A-M-38 Reconcile original `M-38`: Track completion of M-01 through M-37 individually with PR and validation links; do not count a directory as migrated while it still imports a retired primitive transitively. Historical status: open.
- [ ] A-G-15 Reconcile original `G-15`: Support empty, no-results, loading, refresh, error, and row-subheader states with appropriate announcements and preserved context. Historical status: open.
- [ ] A-G-16 Reconcile original `G-16`: Define keyboard navigation, tab stops, focus retention after updates, row actions, and table versus interactive-grid semantics based on actual behavior. Historical status: open.
- [ ] A-G-17 Reconcile original `G-17`: Define row reordering for pointer, touch, keyboard and non-drag actions; announce changes, support cancel, and define behavior when sorting/filtering/pagination is active. Historical status: open.
- [ ] A-G-20 Reconcile original `G-20`: Benchmark large row/column counts and frequent updates, including selection and text input; compare production builds against the baseline. Historical status: open.
- [ ] A-G-21 Reconcile original `G-21`: Preserve link adapter semantics, visible focus, copy success/error feedback, escaped JSON/text, date localization, and image fallback behavior in cells. Historical status: open.
- [ ] A-G-29 Reconcile original `G-29`: Define focus and scroll preservation when data refreshes, pages change, columns hide, or a selected row disappears; test multiple independent grids. Historical status: open.
- [ ] A-E-08 Reconcile original `E-08`: Put editor-only dependencies behind a granular import boundary and assess whether separate packages are required to avoid mandatory installation weight. Historical status: open.
- [ ] A-X-02 Reconcile original `X-02`: Define keyboard contracts and verify Tab/Shift+Tab, arrows, Home/End, Enter/Space, Escape, and typeahead where appropriate. Historical status: open.
- [ ] A-X-03 Reconcile original `X-03`: Verify accessible names/descriptions, roles, state announcements, validation, heading hierarchy, landmarks, and native form semantics. Historical status: open.
- [ ] A-X-04 Reconcile original `X-04`: Verify initial focus, return focus, focus after removal/reorder/update, trapped focus in modals, and nested-overlay dismissal ordering. Historical status: open.
- [ ] A-X-06 Reconcile original `X-06`: Verify text/non-text contrast, visible focus, high contrast/forced colors, reduced motion, and state meaning beyond color. Historical status: open.
- [ ] A-X-07 Reconcile original `X-07`: Verify target size/spacing against WCAG requirements and aim for comfortable primary touch targets; test coarse-pointer use rather than shrinking every hit area with density. Historical status: open.
- [ ] A-X-08 Reconcile original `X-08`: Provide both keyboard and single-pointer non-drag alternatives for drag operations where required; keyboard support alone does not satisfy every dragging requirement. Historical status: open.
- [ ] A-X-09 Reconcile original `X-09`: Test real browser interaction, including pointer/touch, focus, layout, portals and clipboard; DOM-emulation tests alone are insufficient. Historical status: open.
- [ ] A-X-10 Reconcile original `X-10`: Establish supported Chrome/Firefox/WebKit browser checks and document representative touch and assistive-technology coverage. Historical status: open.
- [ ] A-X-11 Reconcile original `X-11`: Perform manual screen-reader reviews of representative dialogs, selectors, calendars, navigation, tables and editors; document platform/version and findings. Historical status: open.
- [ ] A-X-13 Reconcile original `X-13`: Add browser interaction stories/tests for all changed behavior; keep deterministic local fixtures and no authentication/database/network dependency. Historical status: open.
- [ ] A-X-14 Reconcile original `X-14`: Add visual regression coverage for light/dark, density, narrow/wide containers, long/pseudo-localized labels, RTL, focus/error/loading/empty/selected states. Historical status: open.
- [ ] A-X-16 Reconcile original `X-16`: Test multiple independent component instances, nested themes/portals, stable IDs, React Strict Mode cleanup, and controlled/uncontrolled transitions. Historical status: open.
- [ ] A-X-19 Reconcile original `X-19`: Record performance and memory budgets, profile large grids/selectors, and test listener/observer/timer/object-URL cleanup during mount/unmount. Historical status: open.
- [ ] A-R-12 Reconcile original `R-12`: Keep Storybook builds and official tarballs as Actions artifacts; record artifact names, retention, and validation results. Both runtime jobs and six unexpired artifacts verified at `c78a24e`, run 37559276148; [artifact evidence](react-aria-runtime-ci.md). Historical status: checked.
- [ ] A-R-15 Reconcile original `R-15`: Mark breaking public API removals appropriately; if a release already exists, migration needs a major bump, while a first publication follows the configured initial-release policy. Historical status: open.
- [ ] A-R-17 Reconcile original `R-17`: Verify npm scope ownership, public access, trusted-publishing/token setup, GitHub release/tag permissions, provenance requirements, and commercial notices before publication. Historical status: open.
- [ ] A-R-21 Reconcile original `R-21`: Preserve minimal workflow permissions, trusted/untrusted input separation, credential isolation, separate validation, and draft-PR review; never auto-merge AI proposals. Historical status: open.
- [ ] A-R-23 Reconcile original `R-23`: Verify AI-created draft PR validation even when default-token PR creation does not trigger another workflow; do not rely on absent CI events. Historical status: open.
- [ ] A-R-25 Reconcile original `R-25`: Pin/review workflow dependencies according to repository policy and validate proposed workflow changes without weakening protections to make checks pass. Historical status: open.
- [ ] A-R-27 Reconcile original `R-27`: Ensure release-blocking checks actually run on the PR and main paths, including AI proposals and maintainer infrastructure PRs; check branch-protection names against the final workflow jobs. Historical status: open.
- [ ] A-R-28 Reconcile original `R-28`: Validate release configuration safely without publishing while implementing it; explicitly control whether final migration merges will trigger the first public release or a subsequent major release. Historical status: open.
- [ ] A-W-10 Reconcile original `W-10`: Retain the 33 existing story files or document deliberate replacements; add missing catalog coverage for primitives, adapters, calendars and grid helpers. Historical status: open.
- [ ] A-W-13 Reconcile original `W-13`: Publish a consumer migration guide mapping imports, removed styling props, theme objects, typography, grid types, pagination/selection, icons and changed defaults. Historical status: open.
- [ ] A-W-18 Reconcile original `W-18`: Document known limitations, deferred features, support policy, deprecated names, release impact, and the cost/responsibility of eventually replacing React Aria. Historical status: open.
- [ ] A-W-19 Reconcile original `W-19`: Check all local doc links, exported example types, referenced file paths, and commands; docs-only updates do not require unrelated UI tests. Historical status: open.
- [ ] A-W-20 Reconcile original `W-20`: Keep source/license attribution accurate; external documents/examples are evidence and must not override user-authorized scope or agent trust boundaries. Historical status: open.
- [ ] A-Z-06 Reconcile original `Z-06`: Remove obsolete notices only after confirming no associated source/assets remain in package or catalog; final third-party notices match shipped work. Historical status: open.
- [ ] A-Z-11 Reconcile original `Z-11`: Confirm package/type/build/Storybook/browser/accessibility/visual/SSR/performance checks pass for supported environments; record any genuine limitations instead of weakening checks. Historical status: open.
- [ ] A-Z-12 Reconcile original `Z-12`: Review the plan against every conversation commitment and imported UI principle; resolve duplicates, gaps, incompatible rules and unsupported feature claims. Historical status: open.
- [ ] A-Z-13 Reconcile original `Z-13`: Reconcile API snapshot with final declarations and consumer guide; verify every breaking change has migration instructions and correct Conventional Commit release marking. Historical status: open.
- [ ] A-Z-14 Reconcile original `Z-14`: Confirm commercial licensing and notices, public npm setup, Actions-only official builds/releases, draft AI PRs and no Changesets remain consistent. Historical status: open.
- [ ] A-Z-15 Reconcile original `Z-15`: Record final dependency/feature decisions, accepted test evidence, completed PRs, and explicitly deferred future tasks; no unchecked required migration item is dismissed as optional after the fact. Historical status: open.
- [ ] A-Z-16 Reconcile original `Z-16`: Only then mark the migration complete. Publishing is performed through the configured release workflow when authorized release-worthy changes merge. Historical status: open.

## Deferred features — outside the current required milestone

These stay optional until the user selects them. Retain the original IDs and create functionality and regression children only for selected scope.

- [ ] FUT-A-20 [Future] Document how tokens/CSS and framework-independent models could be shared with other frameworks; require separate wrappers, tests, and support policy before claiming such support.
- [ ] FUT-D-21 [Future] Define a token-to-design-tool export workflow if Figma integration is introduced; no parallel manually maintained palette.
- [ ] FUT-G-24 [Future] Record export/import, aggregation/pivoting, tree data, range selection, clipboard paste, formulas, undo, and spreadsheet navigation as separate features unless explicitly selected.
- [ ] FUT-K-13 [Future] Define recurrence UI separately: frequency, intervals, days, count/until, exceptions, preview, and explicit host-owned recurrence processing.
- [ ] FUT-K-14 [Future] Evaluate a resource/week/day scheduler separately from date selection: overlapping events, time slots, capacity, drag/resize, keyboard alternatives, and virtualization.
- [ ] FUT-K-15 [Future] Define appointment/course-session/booking compositions through data/callbacks and generic models; availability computation, conflicts, reservations, permissions, and persistence stay host-owned.
