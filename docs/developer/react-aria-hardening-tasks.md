# Remaining browser, visual and final acceptance work

**Current open work:** 20 hardening (V) items, 139 final-acceptance (A) items and six explicitly deferred future items. Completed items have been removed; evidence remains in the [execution receipt](backlog-execution-2026-10-15.md).

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

## C21: DocumentEditorLayout

Scope: [src/components/DocumentEditorLayout](../../packages/ui/src/components/DocumentEditorLayout). Original scope: `M-21` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] V-C21-04 Review DocumentEditorLayout light/dark and compact/comfortable presentation with long content at narrow width; split any found defect into its own fix task.
- [ ] V-C21-05 Review DocumentEditorLayout translated/RTL names and reading order in a composed host; verify semantic labels remain meaningful.

## C22: DocumentEditorToolbar

Scope: [src/components/DocumentEditorToolbar](../../packages/ui/src/components/DocumentEditorToolbar). Original scope: `M-22` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] V-C22-04 Review DocumentEditorToolbar light/dark and compact/comfortable presentation with long content at narrow width; split any found defect into its own fix task.
- [ ] V-C22-05 Review DocumentEditorToolbar translated/RTL names and reading order in a composed host; verify semantic labels remain meaningful.

## C23: ContentEditorChrome

Scope: [src/components/ContentEditorChrome](../../packages/ui/src/components/ContentEditorChrome). Original scope: `M-23` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] V-C23-04 Review ContentEditorChrome light/dark and compact/comfortable presentation with long content at narrow width; split any found defect into its own fix task.
- [ ] V-C23-05 Review ContentEditorChrome translated/RTL names and reading order in a composed host; verify semantic labels remain meaningful.

## C25: FloatingTextSelectionToolbar

Scope: [src/components/FloatingTextSelectionToolbar](../../packages/ui/src/components/FloatingTextSelectionToolbar). Original scope: `M-25` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] V-C25-04 Review FloatingTextSelectionToolbar light/dark and compact/comfortable presentation with long content at narrow width; split any found defect into its own fix task.
- [ ] V-C25-05 Review FloatingTextSelectionToolbar translated/RTL names and reading order in a composed host; verify semantic labels remain meaningful.

## C26: RichTextFormattingToolbar

Scope: [src/components/RichTextFormattingToolbar](../../packages/ui/src/components/RichTextFormattingToolbar). Original scope: `M-26 E-04` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] V-C26-04 Review RichTextFormattingToolbar light/dark and compact/comfortable presentation with long content at narrow width; split any found defect into its own fix task.
- [ ] V-C26-05 Review RichTextFormattingToolbar translated/RTL names and reading order in a composed host; verify semantic labels remain meaningful.

## C27: InsertContentMenuControl

Scope: [src/components/InsertContentMenuControl](../../packages/ui/src/components/InsertContentMenuControl). Original scope: `M-27` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] V-C27-04 Review InsertContentMenuControl light/dark and compact/comfortable presentation with long content at narrow width; split any found defect into its own fix task.
- [ ] V-C27-05 Review InsertContentMenuControl translated/RTL names and reading order in a composed host; verify semantic labels remain meaningful.

## C28: TextAlignMenuControl

Scope: [src/components/TextAlignMenuControl](../../packages/ui/src/components/TextAlignMenuControl). Original scope: `M-28` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] V-C28-04 Review TextAlignMenuControl light/dark and compact/comfortable presentation with long content at narrow width; split any found defect into its own fix task.
- [ ] V-C28-05 Review TextAlignMenuControl translated/RTL names and reading order in a composed host; verify semantic labels remain meaningful.

## C29: TextColorPickerControl

Scope: [src/components/TextColorPickerControl](../../packages/ui/src/components/TextColorPickerControl). Original scope: `M-29` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] V-C29-04 Review TextColorPickerControl light/dark and compact/comfortable presentation with long content at narrow width; split any found defect into its own fix task.
- [ ] V-C29-05 Review TextColorPickerControl translated/RTL names and reading order in a composed host; verify semantic labels remain meaningful.

## C30: TextStyleMenuControl

Scope: [src/components/TextStyleMenuControl](../../packages/ui/src/components/TextStyleMenuControl). Original scope: `M-30` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] V-C30-04 Review TextStyleMenuControl light/dark and compact/comfortable presentation with long content at narrow width; split any found defect into its own fix task.
- [ ] V-C30-05 Review TextStyleMenuControl translated/RTL names and reading order in a composed host; verify semantic labels remain meaningful.

## C34: PageRichTextEditorSection

Scope: [src/components/PageRichTextEditorSection](../../packages/ui/src/components/PageRichTextEditorSection). Original scope: `M-34 E-01–E-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] V-C34-04 Review PageRichTextEditorSection light/dark and compact/comfortable presentation with long content at narrow width; split any found defect into its own fix task.
- [ ] V-C34-05 Review PageRichTextEditorSection translated/RTL names and reading order in a composed host; verify semantic labels remain meaningful.

## P4: catalog component acceptance closure

These close the original inventory rows independently from their baseline leaves. Recorded migration implementations remain accepted history; each row needs its explicitly required later evidence.

- [ ] A-M-03 Reconcile AppOperationSteps final acceptance: State announcements, completed/error/active visuals, hide single-step numbering. Link its `F-C03`, `T-C03` and `V-C03` evidence and any unresolved defects.
- [ ] A-M-08 Reconcile AppModal final acceptance: Owned close reasons/size/parts, focus, sticky tabs, scroll, actions and steps. Link its `F-C08`, `T-C08` and `V-C08` evidence and any unresolved defects.
- [ ] A-M-10 Reconcile ExperiencePageNavigator final acceptance: Previous/next boundaries, labels, disabled states, link/action semantics. Link its `F-C10`, `T-C10` and `V-C10` evidence and any unresolved defects.
- [ ] A-M-14 Reconcile InstructorClassCard final acceptance: Status/menu/actions, callbacks, long text, date and icon fallbacks. Link its `F-C14`, `T-C14` and `V-C14` evidence and any unresolved defects.
- [ ] A-M-15 Reconcile LearnerClassCard final acceptance: Progress/due labels/status/actions, translation, accessible interactive regions. Link its `F-C15`, `T-C15` and `V-C15` evidence and any unresolved defects.
- [ ] A-M-16 Reconcile AppDataGrid final acceptance: Complete owned grid implementation, types and helpers; follow G tasks. Link its `F-C16`, `T-C16` and `V-C16` evidence and any unresolved defects.
- [ ] A-M-18 Reconcile AppDataGridRowDnd final acceptance: Replace DOM selectors/ghost styling; keyboard/touch/reorder/cancel behavior. Link its `F-C18`, `T-C18` and `V-C18` evidence and any unresolved defects.
- [ ] A-M-21 Reconcile DocumentEditorLayout final acceptance: Tokenized menu/toolbar/content layout and scroll boundaries. Link its `F-C21`, `T-C21` and `V-C21` evidence and any unresolved defects.
- [ ] A-M-22 Reconcile DocumentEditorToolbar final acceptance: Owned buttons/menus/toggles, formatting state, responsive overflow. Link its `F-C22`, `T-C22` and `V-C22` evidence and any unresolved defects.
- [ ] A-M-23 Reconcile ContentEditorChrome final acceptance: Menu composition, editor focus, disabled/loading actions, semantic structure. Link its `F-C23`, `T-C23` and `V-C23` evidence and any unresolved defects.
- [ ] A-M-25 Reconcile FloatingTextSelectionToolbar final acceptance: Selection anchoring, focus preservation, overlay cleanup, keyboard access. Link its `F-C25`, `T-C25` and `V-C25` evidence and any unresolved defects.
- [ ] A-M-26 Reconcile RichTextFormattingToolbar final acceptance: All formatting actions, mixed/active/disabled state, Lexical commands. Link its `F-C26`, `T-C26` and `V-C26` evidence and any unresolved defects.
- [ ] A-M-27 Reconcile InsertContentMenuControl final acceptance: Menu commands and insertion focus, disabled actions and announcements. Link its `F-C27`, `T-C27` and `V-C27` evidence and any unresolved defects.
- [ ] A-M-28 Reconcile TextAlignMenuControl final acceptance: Alignment/indent commands, active state, direction-aware presentation. Link its `F-C28`, `T-C28` and `V-C28` evidence and any unresolved defects.
- [ ] A-M-29 Reconcile TextColorPickerControl final acceptance: Foreground/background modes, clear/reset, swatches and accessible color control. Link its `F-C29`, `T-C29` and `V-C29` evidence and any unresolved defects.
- [ ] A-M-30 Reconcile TextStyleMenuControl final acceptance: Style/typeface options, tokenized labels, selection and focus behavior. Link its `F-C30`, `T-C30` and `V-C30` evidence and any unresolved defects.
- [ ] A-M-34 Reconcile PageRichTextEditorSection final acceptance: Editor composition, nodes/plugins, serialization and selection behavior. Link its `F-C34`, `T-C34` and `V-C34` evidence and any unresolved defects.

First inventory batch closed A-B-01/02/04; see [final acceptance execution](react-aria-final-acceptance.md).

## P4: original scope obligation closure

Each `A-*` acceptance item below reconciles one original parent with its implementation and regression evidence. Existing checked parents stay checked in the historical ledger; these new closure tasks start open because this rewrite did not perform a fresh acceptance audit. This does not reset accepted implementation work. A parent containing several requirements may close only when each is evidenced, or split into explicit children. Future scope remains deferred and outside the required baseline/acceptance denominator.

- [ ] A-B-05 Reconcile original `B-05`: Snapshot public props, callbacks, models, defaults, subpaths, and deprecations; identify changes that are actually breaking. Historical status: open.
- [ ] A-B-07 Reconcile original `B-07`: Capture representative screenshots and browser interactions for light/dark UI, compact/comfortable controls, editors, navigation, modals, and grids. Historical status: open.
- [ ] A-B-10 Reconcile original `B-10`: Measure production consumer bundles, CSS, editor/grid imports, initial render, and interactive updates with reproducible fixtures. Historical status: open.
- [ ] A-B-12 Reconcile original `B-12`: Review the extraction manifest against actual files so helpers, model presets, nodes/plugins, fixtures, and tests are not lost when directories move. Historical status: open.
- [ ] A-B-14 Reconcile original `B-14`: Keep the learner platform unchanged; collect reference behavior and source provenance read-only. Historical status: checked.
- [ ] A-A-06 Reconcile original `A-06`: Standardize controlled/uncontrolled pairs, defaults, change callbacks, null/empty semantics, disabled/read-only/loading behavior, and stable IDs. Historical status: open.
- [ ] A-A-07 Reconcile original `A-07`: Specify native click versus normalized press semantics without surprising consumers; prevent duplicate callback invocation and document keyboard/touch activation. Historical status: open.
- [ ] A-A-08 Reconcile original `A-08`: Define public variant, size, tone, density, placement, dismissal-reason, and validation contracts independently of any foundation. Historical status: open.
- [ ] A-A-09 Reconcile original `A-09`: Define accessible naming and description requirements for icon-only and compound controls; choose typed requirements where practical. Historical status: open.
- [ ] A-A-10 Reconcile original `A-10`: Define composition and escape hatches: supported slots/parts, render callbacks, refs, `className`/part classes, CSS variables, and native `style` where needed. Historical status: open.
- [ ] A-A-18 Reconcile original `A-18`: Keep heavyweight modules out of basic-control dependency paths; decide which require separate subpaths versus separate packages. Historical status: open.
- [ ] A-L-01 Reconcile original `L-01`: Verify the selected versions' actual licenses, including React Aria Components, hooks/state/date utilities, icon assets, grid engine, editor packages, and transitive distributed code. Historical status: open.
- [ ] A-L-02 Reconcile original `L-02`: Preserve Apache 2.0 licenses and applicable notices; record modifications where required if upstream code is copied or changed rather than merely depended on. Historical status: open.
- [ ] A-L-04 Reconcile original `L-04`: Refresh `THIRD_PARTY_NOTICES.md` from the final shipped dependency and asset inventory; remove a retired notice only after its code/assets are no longer distributed. Historical status: open.
- [ ] A-L-08 Reconcile original `L-08`: Add a repeatable dependency/license inventory check and assign ownership for updates; avoid automatically rewriting commercial terms. Historical status: open.
- [ ] A-L-09 Reconcile original `L-09`: Document dependency support/security update expectations and a deliberate upgrade process with behavioral regression checks. Historical status: open.
- [ ] A-D-09 Reconcile original `D-09`: Use rem-based text sizing and layouts that tolerate zoom, text spacing changes, long labels, and font substitution. Historical status: open.
- [ ] A-D-12 Reconcile original `D-12`: Make important touch controls comfortably operable; density must not erase minimum hit areas or keyboard focus indicators. Historical status: open.
- [ ] A-D-15 Reconcile original `D-15`: Design complete hover, focus, pressed, selected, disabled, read-only, invalid, pending, empty, loading, and error states; never rely on color alone for meaning. Historical status: open.
- [ ] A-D-16 Reconcile original `D-16`: Define scoped theme/density roots and nested overrides; ensure portaled overlays receive the correct scope and variables. Historical status: open.
- [ ] A-D-17 Reconcile original `D-17`: Specify explicit light/dark/system settings, initial server theme, `color-scheme`, and hydration behavior without unwanted flashes or browser-global assumptions. Historical status: open.
- [ ] A-D-18 Reconcile original `D-18`: Support reduced motion and forced-colors/high-contrast environments; avoid suppressing essential system indications. Historical status: open.
- [ ] A-D-20 Reconcile original `D-20`: Publish foundation stories for palettes, typography, spacing, density, surfaces, focus, and motion, all consuming production tokens. Historical status: open.
- [ ] A-C-04 Reconcile original `C-04`: Replace `sx`, `paperSx`, theme callbacks, object-style overrides, and retired DOM selectors with owned contracts and component styles; map each removed public styling prop. Historical status: open.
- [ ] A-C-07 Reconcile original `C-07`: Document stylesheet composition across library themes, components, utilities, and consumer overrides; avoid escalating specificity or routine `!important`. Historical status: checked.
- [ ] A-C-08 Reconcile original `C-08`: Use container size queries for reusable card, toolbar, navigation, and modal compositions; choose/document containment boundaries so consumers know what supplies the container. Historical status: open.
- [ ] A-C-09 Reconcile original `C-09`: Use logical properties and direction-aware icons/placement for RTL; do not assume physical left/right always means start/end. Historical status: open.
- [ ] A-C-11 Reconcile original `C-11`: Use native nesting with documented tooling/browser support; keep selector depth shallow and component ownership obvious. Historical status: open.
- [ ] A-C-12 Reconcile original `C-12`: Use fluid sizing such as `clamp` where beneficial without preventing text zoom; establish mobile/reflow fallbacks. Historical status: open.
- [ ] A-C-14 Reconcile original `C-14`: Define progressive enhancement with `@supports`; do not adopt limited-support anchor positioning, style queries, or transitions as unconditional dependencies. Historical status: open.
- [ ] A-C-15 Reconcile original `C-15`: Use `:focus-visible` or owned accessible focus-state attributes; preserve visible focus when replacing current outline suppression. Historical status: open.
- [ ] A-C-16 Reconcile original `C-16`: Define reduced-motion transitions, interruption/cancellation behavior, and focus timing; no motion runtime is added solely for simple CSS transitions. Historical status: open.
- [ ] A-C-17 Reconcile original `C-17`: Specify overlay stacking/portal ownership rather than maximum-integer z-index values; test nested dialog/menu/tooltip/editor overlays. Historical status: open.
- [ ] A-C-19 Reconcile original `C-19`: Verify CSP behavior, including unavoidable inline styles for placement/dynamic values; do not claim strict CSP support without testing. Historical status: open.
- [ ] A-C-20 Reconcile original `C-20`: Verify compiled CSS distribution, consumer production builds, stylesheet deduplication, and tree-shaking behavior; CSS must not be removed as a false side effect. Historical status: open.
- [ ] A-I-04 Reconcile original `I-04`: Keep icons individually importable; avoid pulling an entire icon catalog into basic components. Historical status: checked.
- [ ] A-I-05 Reconcile original `I-05`: Establish consistent optical size, weight, alignment, RTL mirroring policy, and theme contrast. Historical status: open.
- [ ] A-I-08 Reconcile original `I-08`: Add icon catalog, accessibility, and bundle checks; update notices for all shipped vector assets. Historical status: open.
- [ ] A-H-02 Reconcile original `H-02`: Verify modifier clicks, downloads, external links, targets, default prevention, and navigation callback ordering through browser tests. Exact-byte transfers and native semantics in all three engines, CI 37560065588; [browser evidence](react-aria-browser-acceptance.md). Historical status: checked.
- [ ] A-H-03 Reconcile original `H-03`: Integrate React Aria routing where needed behind the existing host adapter; avoid two competing navigation systems or a runtime Next.js dependency. Historical status: open.
- [ ] A-H-08 Reconcile original `H-08`: Validate ICU variables, pluralization, selection counts, date/number formatting, long labels, RTL, and pseudo-localized stories. Historical status: open.
- [ ] A-P-07 Reconcile original `P-07`: Include keyboard, screen-reader, zoom, touch, dark theme, reduced-motion, SSR/hydration, and production bundle checks in prototype findings. Historical status: open.
- [ ] A-P-08 Reconcile original `P-08`: Set reproducible performance budgets from baseline and representative consumer hardware; do not invent universal speed or size rankings. Historical status: open.
- [ ] A-U-02 Reconcile original `U-02`: Implement Box/container, Stack, surface/Paper, card/content, separator/Divider, and responsive layout primitives with scoped styles. Historical status: open.
- [ ] A-U-04 Reconcile original `U-04`: Implement TextField, input base, labels, descriptions, validation errors, required state, textarea, and grouped fields with correct associations. Historical status: open.
- [ ] A-U-05 Reconcile original `U-05`: Implement Checkbox, mixed state, Switch, RadioGroup, and label composition; document keyboard and form-submission semantics. Historical status: open.
- [ ] A-U-06 Reconcile original `U-06`: Implement Select and searchable ComboBox/Autocomplete; define value identity, filtering ownership, empty/loading/error, multiple selection where required, and disabled options. Historical status: open.
- [ ] A-U-07 Reconcile original `U-07`: Implement Menu/MenuItem, submenus when required, Popover, and Tooltip; distinguish menu commands from arbitrary form content in a popover. Historical status: open.
- [ ] A-U-08 Reconcile original `U-08`: Implement dialog primitives and modal composition with title/description, dismissal reasons, initial/return focus, scroll locking, background interaction handling, and nested overlays. Historical status: open.
- [ ] A-U-09 Reconcile original `U-09`: Implement Tabs with correct roles, panels, orientation, activation mode, disabled tabs, focus visibility, and overflow behavior. Historical status: open.
- [ ] A-U-17 Reconcile original `U-17`: Provide consistent focus ring, target size, disabled styling, validation, status announcement, and pointer/keyboard interactions across primitives. Historical status: open.
- [ ] A-U-18 Reconcile original `U-18`: Preserve native form participation, reset behavior, autofill, names/values, and submit behavior; test controlled and uncontrolled variants. Historical status: open.
- [ ] A-U-19 Reconcile original `U-19`: Define overlay collision/placement behavior at narrow widths and browser zoom; preserve theme/locale in portals and avoid clipped popovers. Historical status: open.
- [ ] A-M-38 Reconcile original `M-38`: Track completion of M-01 through M-37 individually with PR and validation links; do not count a directory as migrated while it still imports a retired primitive transitively. Historical status: open.
- [ ] A-G-15 Reconcile original `G-15`: Support empty, no-results, loading, refresh, error, and row-subheader states with appropriate announcements and preserved context. Historical status: open.
- [ ] A-G-16 Reconcile original `G-16`: Define keyboard navigation, tab stops, focus retention after updates, row actions, and table versus interactive-grid semantics based on actual behavior. Historical status: open.
- [ ] A-G-17 Reconcile original `G-17`: Define row reordering for pointer, touch, keyboard and non-drag actions; announce changes, support cancel, and define behavior when sorting/filtering/pagination is active. Historical status: open.
- [ ] A-G-20 Reconcile original `G-20`: Benchmark large row/column counts and frequent updates, including selection and text input; compare production builds against the baseline. Historical status: open.
- [ ] A-G-21 Reconcile original `G-21`: Preserve link adapter semantics, visible focus, copy success/error feedback, escaped JSON/text, date localization, and image fallback behavior in cells. Historical status: open.
- [ ] A-G-28 Reconcile original `G-28`: Define cancel/error/optimistic-update behavior for host-driven row actions and reorder requests; restore or reconcile visible state when persistence fails. Historical status: open.
- [ ] A-G-29 Reconcile original `G-29`: Define focus and scroll preservation when data refreshes, pages change, columns hide, or a selected row disappears; test multiple independent grids. Historical status: open.
- [ ] A-K-04 Reconcile original `K-04`: Support minimum/maximum, unavailable-date explanations, validation, required/optional input, and host-supplied availability without fetching business data. Historical status: open.
- [ ] A-K-05 Reconcile original `K-05`: Support multi-month presentation, responsive container sizing, month/year navigation, keyboard navigation, focus return, and meaningful date announcements. Historical status: open.
- [ ] A-K-07 Reconcile original `K-07`: Keep typed/segmented input and calendar selection synchronized; define invalid/partial typing, paste, blur, and form submission behavior. Historical status: open.
- [ ] A-K-17 Reconcile original `K-17`: Define keyboard and non-hover access to availability explanations, range previews, and preset descriptions; rich date-cell decorations must not replace meaningful date labels. Historical status: open.
- [ ] A-E-02 Reconcile original `E-02`: Preserve existing nodes/plugins: ImageNode, image insertion, horizontal-rule selection, editor configuration, and experience plugins; test saved-content round trips. Historical status: open.
- [ ] A-E-03 Reconcile original `E-03`: Replace editor toolbars, menus, modals, palettes and selection overlays with owned controls while preserving selection across commands and modal dismissal. Historical status: open.
- [ ] A-E-04 Reconcile original `E-04`: Cover undo/redo, links, lists, code, tables, alignment, indentation, colors, and inline formatting that current consumers use. Historical status: open.
- [ ] A-E-05 Reconcile original `E-05`: Address IME composition, paste, keyboard shortcuts, read-only/disabled state, and toolbar accessibility without hijacking ordinary editing keys. Historical status: open.
- [ ] A-E-06 Reconcile original `E-06`: Define safe URL/protocol handling, image metadata/alt text, host upload callbacks, file validation, cancellation, and object-URL cleanup. Shared saved/pasted link policy and activation: [partial contract](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial). Saved image sources and upload-result retry: [partial image contract](react-aria-editor-section.md#image-source-policy-e-06e-07-partial); [upload lifetime matrix](react-aria-editor-section.md#host-upload-lifetime-e-06-partial) covers stale results after cancellation/reset/read-only/unmount; [file presentation validation](react-aria-editor-dialogs.md#file-presentation-validation-e-06-partial) covers empty files and MIME/extension metadata; wider image/upload acceptance remains open. Historical status: open.
- [ ] A-E-07 Reconcile original `E-07`: Review rich-content rendering and trust boundaries; do not render arbitrary HTML or unsafe links merely because they arrived in a presentation model. Saved/pasted link destinations are governed by the [owned policy](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial), and image decoration by the [image source policy](react-aria-editor-section.md#image-source-policy-e-06e-07-partial); broader rich-content acceptance remains open. Historical status: open.
- [ ] A-E-08 Reconcile original `E-08`: Put editor-only dependencies behind a granular import boundary and assess whether separate packages are required to avoid mandatory installation weight. Historical status: open.
- [ ] A-X-01 Reconcile original `X-01`: Replace implementation-mirroring tests with behavior tests where needed; avoid mocks that hide the very focus/keyboard behavior under migration. Historical status: open.
- [ ] A-X-02 Reconcile original `X-02`: Define keyboard contracts and verify Tab/Shift+Tab, arrows, Home/End, Enter/Space, Escape, and typeahead where appropriate. Historical status: open.
- [ ] A-X-03 Reconcile original `X-03`: Verify accessible names/descriptions, roles, state announcements, validation, heading hierarchy, landmarks, and native form semantics. Historical status: open.
- [ ] A-X-04 Reconcile original `X-04`: Verify initial focus, return focus, focus after removal/reorder/update, trapped focus in modals, and nested-overlay dismissal ordering. Historical status: open.
- [ ] A-X-05 Reconcile original `X-05`: Ensure sticky headers/footers do not obscure focused controls; verify zoom/reflow/text-spacing behavior and scroll padding where needed. Historical status: open.
- [ ] A-X-06 Reconcile original `X-06`: Verify text/non-text contrast, visible focus, high contrast/forced colors, reduced motion, and state meaning beyond color. Historical status: open.
- [ ] A-X-07 Reconcile original `X-07`: Verify target size/spacing against WCAG requirements and aim for comfortable primary touch targets; test coarse-pointer use rather than shrinking every hit area with density. Historical status: open.
- [ ] A-X-08 Reconcile original `X-08`: Provide both keyboard and single-pointer non-drag alternatives for drag operations where required; keyboard support alone does not satisfy every dragging requirement. Historical status: open.
- [ ] A-X-09 Reconcile original `X-09`: Test real browser interaction, including pointer/touch, focus, layout, portals and clipboard; DOM-emulation tests alone are insufficient. Historical status: open.
- [ ] A-X-10 Reconcile original `X-10`: Establish supported Chrome/Firefox/WebKit browser checks and document representative touch and assistive-technology coverage. Historical status: open.
- [ ] A-X-11 Reconcile original `X-11`: Perform manual screen-reader reviews of representative dialogs, selectors, calendars, navigation, tables and editors; document platform/version and findings. Historical status: open.
- [ ] A-X-13 Reconcile original `X-13`: Add browser interaction stories/tests for all changed behavior; keep deterministic local fixtures and no authentication/database/network dependency. Historical status: open.
- [ ] A-X-14 Reconcile original `X-14`: Add visual regression coverage for light/dark, density, narrow/wide containers, long/pseudo-localized labels, RTL, focus/error/loading/empty/selected states. Historical status: open.
- [ ] A-X-15 Reconcile original `X-15`: Require deliberate review of screenshot changes; do not automatically accept new snapshots to silence regressions. Historical status: open.
- [ ] A-X-16 Reconcile original `X-16`: Test multiple independent component instances, nested themes/portals, stable IDs, React Strict Mode cleanup, and controlled/uncontrolled transitions. Historical status: open.
- [ ] A-X-17 Reconcile original `X-17`: Verify React 18.3 and 19 behavior and declaration compatibility using actual consumer fixtures, not just the development React version. Historical status: open.
- [ ] A-X-18 Reconcile original `X-18`: Add SSR render and hydration tests with no window/document at import time, no mismatched IDs, and correct initial locale/theme/date values. Historical status: checked.
- [ ] A-X-19 Reconcile original `X-19`: Record performance and memory budgets, profile large grids/selectors, and test listener/observer/timer/object-URL cleanup during mount/unmount. Historical status: open.
- [ ] A-X-20 Reconcile original `X-20`: Test API typing and package consumers, including generics, refs, callback payloads, CSS imports, isolated subpaths, and declaration dependency leakage. Historical status: open.
- [ ] A-R-03 Reconcile original `R-03`: Design root and granular entry points for core, theme/tokens/styles, primitives, icons, hooks, adapters, i18n, grid, editor and learning compositions. Historical status: open.
- [ ] A-R-04 Reconcile original `R-04`: Ensure barrels do not accidentally pull interactive/heavyweight dependencies into presentation-only imports or make server consumers import all editors. Historical status: open.
- [ ] A-R-07 Reconcile original `R-07`: Regenerate the lockfile through the package manager and inspect resolved transitive dependencies, overrides, patched dependencies and optional packages. Historical status: open.
- [ ] A-R-08 Reconcile original `R-08`: Verify packed artifacts rather than only source imports; install the tarball in clean Vite and Next.js/SSR consumer fixtures and build production output. Historical status: checked.
- [ ] A-R-09 Reconcile original `R-09`: Test published type declarations with supported TypeScript versions and ensure no retired imports/augmentation or accidental private upstream types escape. Historical status: open.
- [ ] A-R-12 Reconcile original `R-12`: Keep Storybook builds and official tarballs as Actions artifacts; record artifact names, retention, and validation results. Both runtime jobs and six unexpired artifacts verified at `c78a24e`, run 37559276148; [artifact evidence](react-aria-runtime-ci.md). Historical status: checked.
- [ ] A-R-15 Reconcile original `R-15`: Mark breaking public API removals appropriately; if a release already exists, migration needs a major bump, while a first publication follows the configured initial-release policy. Historical status: open.
- [ ] A-R-17 Reconcile original `R-17`: Verify npm scope ownership, public access, trusted-publishing/token setup, GitHub release/tag permissions, provenance requirements, and commercial notices before publication. Historical status: open.
- [ ] A-R-21 Reconcile original `R-21`: Preserve minimal workflow permissions, trusted/untrusted input separation, credential isolation, separate validation, and draft-PR review; never auto-merge AI proposals. Historical status: open.
- [ ] A-R-23 Reconcile original `R-23`: Verify AI-created draft PR validation even when default-token PR creation does not trigger another workflow; do not rely on absent CI events. Historical status: open.
- [ ] A-R-24 Reconcile original `R-24`: Update workflow timeouts/artifact handling as browser checks expand; cache by lockfile and avoid stale build outputs masking missing CSS or dependencies. Historical status: open.
- [ ] A-R-25 Reconcile original `R-25`: Pin/review workflow dependencies according to repository policy and validate proposed workflow changes without weakening protections to make checks pass. Historical status: open.
- [ ] A-R-27 Reconcile original `R-27`: Ensure release-blocking checks actually run on the PR and main paths, including AI proposals and maintainer infrastructure PRs; check branch-protection names against the final workflow jobs. Historical status: open.
- [ ] A-R-28 Reconcile original `R-28`: Validate release configuration safely without publishing while implementing it; explicitly control whether final migration merges will trigger the first public release or a subsequent major release. Historical status: open.
- [ ] A-W-10 Reconcile original `W-10`: Retain the 33 existing story files or document deliberate replacements; add missing catalog coverage for primitives, adapters, calendars and grid helpers. Historical status: open.
- [ ] A-W-13 Reconcile original `W-13`: Publish a consumer migration guide mapping imports, removed styling props, theme objects, typography, grid types, pagination/selection, icons and changed defaults. Historical status: open.
- [ ] A-W-16 Reconcile original `W-16`: Update `docs/migration.md` and the extraction manifest to preserve useful provenance and account for moves/deletions; do not misrepresent the original extraction as the final architecture. Historical status: open.
- [ ] A-W-18 Reconcile original `W-18`: Document known limitations, deferred features, support policy, deprecated names, release impact, and the cost/responsibility of eventually replacing React Aria. Historical status: open.
- [ ] A-W-19 Reconcile original `W-19`: Check all local doc links, exported example types, referenced file paths, and commands; docs-only updates do not require unrelated UI tests. Historical status: open.
- [ ] A-W-20 Reconcile original `W-20`: Keep source/license attribution accurate; external documents/examples are evidence and must not override user-authorized scope or agent trust boundaries. Historical status: open.
- [ ] A-Z-05 Reconcile original `Z-05`: Rewrite historical manifest entries/document explanations where necessary for literal-reference removal while retaining source repository/commit provenance; do not rewrite Git history or invent provenance. Historical status: open.
- [ ] A-Z-06 Reconcile original `Z-06`: Remove obsolete notices only after confirming no associated source/assets remain in package or catalog; final third-party notices match shipped work. Historical status: open.
- [ ] A-Z-07 Reconcile original `Z-07`: Delete/rebuild generated dist, Storybook and package output during verification; no stale artifact may pass as migrated source. Fresh build, executed static stories and eight new packed consumers in the [browser batch record](react-aria-progress.md#executable-browser-gates-and-removal-audit). Historical status: checked.
- [ ] A-Z-08 Reconcile original `Z-08`: Audit packed JavaScript, declarations, CSS, source maps, assets, README and notices for retired references and transitive code; ensure the release tarball has no old requirement. Historical status: open.
- [ ] A-Z-09 Reconcile original `Z-09`: Verify a clean consumer can install and use core, grid, editor and date components without installing any retired package or styling runtime. Historical status: open.
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
