# SGUI backlog

Updated: 2026-10-25. **34 active tasks; 6 deferred features.** This is the single
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
| AUD-001 | CSS / build cleanup | Emit shared composed CSS without redundant dependency blocks. |P3, high. See actionable scope below; preserve deterministic cascade order. |
| AUD-002 | CSS / architecture guards | Close color-policy and inline-style validation gaps. |P3, high. Named-color bypass reproduced; distinguish owned runtime values from visual constants. |
| AUD-003 | CSS / ownership cleanup | Separate website shell, preview and control styling; remove structural component overrides. |P3, medium. Keep website identity separate and retain the minimal host reset. |
| AUD-004 | Overlay / maintainability | Give each Popover presentation one positioning owner. |P3, medium. Replace CSS/inline placement conflicts without changing dismissal or native scroll locking. |
| AUD-005 | Forms / lifecycle regression | Reconcile reset helpers and form-association lifetime. |P2, high. Source shows inconsistent rebinding; reproduce reassociation before claiming a runtime defect. |
| AUD-006 | DOM / host hardening | Bind editor and panel geometry/listeners to the owning document. |P3, medium. Replace ambient document/window assumptions in the named implementations. |
| AUD-007 | Docs / rendering cleanup | Render catalog phases explicitly instead of mounting full families and hiding unrelated output. |P3, medium. Preserve one state owner per Example and the processing-grid exception. |
| AUD-008 | Editor / code organization | Extract editor selection/formatting bridge responsibilities from the main editor implementation. |P3, medium. Keep public contracts, document admission and host persistence ownership intact. |
| AUD-009 | Source / readability | Expand compressed navigation geometry and range-gesture code into reviewable functions. |P3, low. Bounded formatting/naming change; no repository-wide formatting churn. |
| AUD-010 | Theme / geometry consistency | Make the tab indicator thickness an owned shared value. |P3, low. Remove repeated geometry literals while preserving orientation, RTL and animation behavior. |
| AUD-012 | Forms / validation regression | Prevent error-message removal during blur from canceling the first corrected-value submit click. |P2, high. Reproduced in existing TextField “Native form reset” and new whole-dollar form: clear required Learner name, click Prepare registration, enter Taylor and click Prepare registration again. Native validity is now valid, but blur removes the error and shifts the pressed button between pointer down/up; only a second click submits. Keyboard blur followed by activation succeeds. Fix shared validation/layout timing without duplicate submits, permanent empty error rows or disabling native validity; add a focused pointer regression preserving source, density and enlarged-text behavior. Affix rendering is not the cause. |
| SS-T-01 | SearchableSelect / regression | Expand the bounded baseline into focused canceled-reset, duplicate-label alias, changing-options/selected-record, controlled rejection and nested-overlay regressions for both layouts. |P2. Reuse the baseline selection/form/status cases and [contract](searchable-select.md). Done when each transition preserves stable IDs, current labels and host authority without sibling state changes; split independent fixes if a case fails. Do not infer remote fetching or custom-value creation. |
| SS-V-01 | SearchableSelect / environment hardening | Verify both search locations with RTL/non-English locale, IME, zoom, touch keyboard, screen readers and supported browser engines. |P3, after SS-T-01. Retain focused Chromium keyboard/form/source checks and collect actual Firefox/WebKit and manual device/AT results; verify sticky popup search, viewport fit, contrast/forced colors and focus return. Shares broad environment obligations with A-P-07/A-X-11/A-Z-11 without replacing them. |

| SL-T-01 | Slider / regression | Expand baseline coverage for canceled/reset reassociation, controlled rejection during dragging, changing bounds/step/thumb count and increment/snap grids, decimal snapping and overlapping thumb activation. |P2. Preserve the three baseline cases and [Slider contract](slider.md); verify native data, stable thumb identity, focus and host authority without decorative debug outputs. |
| SL-V-01 | Slider / environment hardening | Verify physical touch/pen, touch screen readers, zoom, forced colors/contrast and supported Firefox/WebKit engines for scalar, range and vertical sliders. |P3, after SL-T-01. Retain bounded production Chromium pointer/keyboard/form/source observations. Collect actual device/AT results; do not claim these from emulation or automated roles alone. |

| RT-T-01 | Rating / regression | Expand baseline coverage for canceled/reassociated resets, option/disabled/name changes, controlled rejection during hover/clear and repeated group IDs. |P2. Preserve the three baseline cases and [Rating contract](rating.md). Verify enabled Tab entry, numeric zero, native data/validation and no implicit answer or extra callbacks; isolate any reproduced fix. |
| RT-V-01 | Rating / environment hardening | Verify manual screen readers, physical touch, zoom, contrast and supported Firefox/WebKit engines for every presentation and custom icon group. |P3, after RT-T-01. Keep bounded Chromium keyboard/pointer/form/RTL/source observations separate from actual device/AT evidence; include read-only, disabled and forced-color interpretation. |

## Audit cleanup and fix scopes

These are open implementation tasks, not completed audit history. Priorities above
are relative within their phase: finish required P2 work before P3 cleanup, and
honor the execution policy if new baseline functionality is discovered. No release,
dependency replacement or compatibility layer is authorized by these tasks.

Review scope: foundation/token generation, CSS compilation and guards, shared
primitives, overlays/forms, navigation, editor organization, persistence, grid
boundaries and docs rendering/theme ownership. This is a source review with focused
guard checks, not a complete runtime, accessibility, security or performance audit.
The current checkout contains in-progress grid/docs edits; reconcile them before
implementation and do not treat uncommitted work as a missing feature.

### AUD-001 — Shared CSS emission

- **Finding:** [compileStyles](../../packages/ui/scripts/css-modules.mjs) creates a
  fresh CSS Modules processor/loader for each file and concatenates every output.
  Composed dependencies are therefore included repeatedly. The existing
  `packages/ui/dist/styles.css` contains 11 copies of the shared
  `scrollbar-width: thin` rule from
  [Scrollbars.module.css](../../packages/ui/src/foundation/Scrollbars.module.css).
  That count describes the existing build, not a fresh release artifact.
- **Change:** resolve shared dependencies as a build graph and emit their rules
  once where cascade semantics permit. Do not blindly delete repeated text;
  preserve ordering-sensitive compositions, layers and exported class mappings.
- **Done when:** a fresh stylesheet contains no redundant copies of this shared
  block, repeat builds are byte-stable, and diamond-composition ordering tests,
  CSS pipeline tests and the packed consumer proof pass. Report the actual byte
  reduction without inferring a runtime performance improvement.

### AUD-002 — Enforce visual ownership beyond current CSS checks

- **Finding:** [validateComponentCss](../../packages/ui/scripts/check-component-css.mjs)
  rejects hex/function colors but accepts `color: red` and arbitrary non-SGUI
  custom properties in color declarations. A direct validator invocation with
  semantic color checking enabled returned no diagnostics for either `color: red`
  or `color: var(--arbitrary-accent)`. The
  [foundation guard](../../packages/ui/scripts/check-foundations.mjs) validates
  module declarations but does not apply equivalent visual ownership checks to
  JSX style objects. Passing it alone does not establish complete style ownership.
- **Change:** validate color syntax/property use with explicit handling for
  currentColor, inheritance, transparent, forced-color system values and documented
  local variables. Add AST checks for static component color/typography in inline
  styles; allow host styles, measured geometry, generated theme maps and editor
  document content through explicit ownership rules. This is a guard gap, not
  evidence that every supported local custom property is invalid.
- **Done when:** focused positive/negative guard fixtures cover these bypasses,
  shipped source passes, and normal dynamic geometry/theme scopes remain valid.
  Preserve all current layer/token/selector checks rather than replacing them.

### AUD-003 — Website CSS ownership and component boundaries

- **Finding:** [docs.module.css](../../apps/docs/components/docs.module.css) mixes
  shell layout, navigation, preview framing, catalog phase filtering, tool panels,
  source presentation and playground controls. Selectors such as
  `.versionPicker > :first-child`, `.componentMenu :where(a,button)` and
  `.playgroundControls [data-direction="row"]` depend on child markup or affect
  all matching descendants. [DocsShell](../../apps/docs/components/DocsShell.tsx)
  also keeps static content padding in JSX.
- **Change:** colocate shell, Example and catalog-specific rules with their owners;
  move static shell padding into its module. Prefer supported props, explicit
  docs-owned classes or deliberate component part contracts over positional and
  broad descendant overrides. Keep site layout in docs, palette/semantic maps in
  `apps/docs/theme`, shared component behavior in library modules and generated
  aliases in the library token source. Do not move the docs global host reset into
  reusable library CSS or introduce a blanket library reset.
- **Done when:** shell widths, independent scrolling, overlay resize/scroll locking,
  compact navigation, focus and narrow-screen tools retain their current behavior;
  changing demo identity does not restyle the shell. Run focused docs shell/theme
  checks and catalog source checks after a fresh library/docs build.

### AUD-004 — Popover presentation and positioning ownership

- **Finding:** [Popover.tsx](../../packages/ui/src/experimental/Popover/Popover.tsx)
  installs anchored positioning for all presentations, while
  [Popover.module.css](../../packages/ui/src/experimental/Popover/Popover.module.css)
  uses repeated `!important` position/inset/height declarations to override the
  engine's inline geometry for dialog/drawer/auto modes. Static underlay/group
  styling also lives in JSX. This is an explicit implementation conflict, not a
  newly reproduced overlay failure.
- **Change:** separate anchored placement from viewport presentation so one owner
  supplies geometry for the active mode; keep static presentation in the module
  and measured values in JS. Preserve React Aria modality, focus and dismissal.
  Reuse only genuinely shared scheduling logic from
  [FramePositionedPopover](../../packages/ui/src/experimental/Select/FramePositionedPopover.tsx);
  retain its ResizeObserver feedback-loop protection.
- **Done when:** supported presentations open/dismiss and survive viewport resize,
  ancestor scrolling and enlarged content without positioning overrides fighting.
  Retain existing overlay/browser assertions and verify docs shell width stability.

### AUD-005 — Native form reset lifetime and duplication

- **Finding:** [useFormReset](../../packages/ui/src/experimental/useFormReset.ts)
  and [useCalendarFormReset](../../packages/ui/src/experimental/DateRangeSelector/useCalendarFormReset.ts)
  duplicate deferred cancellation-aware reset logic and bind the closest form only
  in an effect depending on the ref object. By contrast,
  [useStandaloneFormReset](../../packages/ui/src/experimental/TextField/useStandaloneFormReset.ts)
  rechecks native form association after each commit. [Switch](../../packages/ui/src/experimental/Switch/Switch.tsx)
  has another independent implementation. A stable ref can outlive a changed form
  association; stale subscriptions in those scenarios need a focused reproduction.
- **Change:** reproduce by moving a still-mounted control between native forms,
  rerendering, editing it and resetting each form. Expected: only its current form
  resets it; canceled reset preserves it; reset does not emit edit callbacks.
  Consolidate shared subscription/task cleanup mechanics while preserving each
  control's draft restoration and controlled/uncontrolled rules. Do not collapse
  intentionally different reset semantics merely because the code looks similar.
- **Done when:** a targeted regression establishes current-form ownership and
  cleanup, existing canceled/native reset tests pass, and calendar composites,
  choice controls and standalone fields retain their documented behavior.

### AUD-006 — Owning-document DOM operations

- **Finding:** [FloatingTextSelectionToolbar](../../packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx)
  reads selection, active element and viewport bounds and subscribes through ambient
  `window`/`document`. [PanelResizeHandle](../../packages/ui/src/components/IconPanelNavigation/PanelResizeHandle.tsx)
  uses ambient `getComputedStyle`, `ResizeObserver` and window resize despite
  measuring a panel's ownerDocument. Other overlay implementations already obtain
  the owning view explicitly. Cross-document failure has not been browser-reproduced.
- **Change:** derive document/view and constructors from the active editor/panel
  root, handle missing views, and rebind/dispose when that root changes. Inspect
  cross-realm `instanceof Node`/element checks in the affected paths as well.
- **Done when:** focused alternate-document tests confirm selection/listeners and
  resize observations target the correct document and clean up; existing SSR,
  floating toolbar focus/selection and panel keyboard/pointer tests remain green.
  Do not claim general iframe support beyond the behavior actually verified.

### AUD-007 — Explicit catalog phase rendering

- **Finding:** [ComponentCatalogPage](../../apps/docs/components/ComponentCatalogPage.tsx)
  mounts the same family through separate overview/playground/examples
  [CatalogPlayground](../../apps/docs/components/CatalogPlayground.tsx) instances.
  [Example](../../apps/docs/components/Example.tsx) returns null for excluded panels
  only after their state-owning parent runs; the broad `.catalogPhase` CSS selector
  hides unrelated wrappers/headings. Invisible owners can still allocate state,
  subscriptions and compute source. No measured performance regression is claimed.
- **Change:** select explicit phase entry components before mounting their owners;
  retain the shared Example panel, source behavior and independent state. Remove
  CSS-based structural suppression once the render tree expresses the template.
  Keep overview, playground and references separate rather than sharing setters.
- **Done when:** only requested owners mount, sibling interaction/source isolation
  still passes, and every route retains its intended overview, playground or
  processing-grid exception, named examples and bottom relationship lists. Run
  catalog checks and production browser/source compilation checks.

### AUD-008 — Extract editor bridge responsibilities

- **Finding:** [PageRichTextEditorSection.impl.tsx](../../packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx)
  combines style parsing, selection reads, formatting resets, history/toolbar
  bridges, dialog state and the main editor composition in one 1,261-line file.
  Responsibility overlap, rather than length alone, makes selection changes hard
  to review independently from document lifecycle and dialog behavior.
- **Change:** extract the selection/formatting helpers and ToolbarBridge into
  private modules with explicit inputs/callbacks. Keep document admission and
  serialization in their existing lexical boundary. Preserve public exports;
  avoid a new generic controller or public API solely for internal organization.
- **Done when:** existing document-admission, selection, formatting, history and
  dialog assertions pass with public types unchanged. Run editor source-graph
  checks and affected docs/source validation; preserve document typography/color
  data rather than mistaking it for hard-coded UI theme styling.

### AUD-009 — Readable interaction algorithms

- **Finding:** [TabIndicator](../../packages/ui/src/experimental/Tabs/TabIndicator.tsx),
  [PanelResizeHandle](../../packages/ui/src/components/IconPanelNavigation/PanelResizeHandle.tsx)
  and [RangeGestures](../../packages/ui/src/experimental/DateRangeSelector/RangeGestures.tsx)
  compress geometry, guards and event registration into long multi-statement lines.
  This obscures cleanup symmetry and coordinate/duration rules during review.
- **Change:** expand these three files using existing readable source conventions,
  name geometry/boundary calculations and use explicit internal prop types. Keep
  formatting separate from behavior changes; reconcile AUD-006/AUD-010 first if
  they touch the same code. Do not reformat unrelated files or generated output.
- **Done when:** a reviewer can trace registration/disposal and coordinate rules
  without unpacking chained statements; targeted existing tests and typecheck pass
  with no changed callbacks, DOM semantics or public declarations.

### AUD-010 — Tab indicator geometry ownership

- **Finding:** [TabIndicator](../../packages/ui/src/experimental/Tabs/TabIndicator.tsx)
  repeats the literal `2` for line thickness and endpoint offsets across horizontal,
  vertical and RTL calculations. Its
  [CSS module](../../packages/ui/src/experimental/Tabs/TabIndicator.module.css)
  owns the line color and motion, leaving the shared visual thickness embedded in
  runtime geometry. This is cleanup, not a confirmed incorrect current rendering.
- **Change:** define one owned thickness value at the appropriate shared component
  boundary; if it becomes a theme token, define/regenerate it through the token
  source and use the resolved value consistently for CSS and measured offsets.
  Leave genuinely measured tab coordinates in JS; do not tokenize every number.
- **Done when:** tab strips and page-tab consumers align correctly in both
  orientations, RTL, both densities, scroll/resize and reduced-motion modes, with
  no duplicate thickness constants or hand-edited generated tokens.

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

## General interactive content follow-up

User-requested functionality baseline: Survey, SurveyQuestion, AnswerFeedback,
TextConversation and VideoPlayer. See [contracts](interactive-content.md). These
follow-ups are separate from baseline functionality and existing acceptance gates.

- **IC-T-01 — Regression:** expand canceled/reset form behavior, dynamic question
  removal/branching, asynchronous controlled rejection and conversation draft edits
  during delivery; preserve the minimal primary-flow baseline cases.
- **IC-T-02 — Video regression:** expand buffering/rate/seek event ordering,
  malformed persisted ranges, changed policies, fractional-duration coverage and
  saved progress reconciliation in real media playback.
- **IC-V-01 — Environment hardening:** after regression, verify native video controls,
  captions/described alternatives/fullscreen/PiP in supported browser engines;
  physical mobile controls, screen-reader question/log announcements, enlarged text,
  RTL and forced colors require actual device/manual evidence.
