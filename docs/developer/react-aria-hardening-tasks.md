# Remaining browser, visual and final acceptance work

**Current open work:** 20 hardening (V) items, 320 final-acceptance (A) items and six explicitly deferred future items. Completed items have been removed; evidence remains in the [execution receipt](backlog-execution-2026-10-15.md).

Priority: P3 — third, only after the required functionality baseline and regression tasks are complete. P4 final acceptance follows hardening. Known defects are recorded individually as `BUG-0001`, `BUG-0002`, etc. with reproduction, expected result, affected component, priority and linked regression; allocate IDs only when a real defect is found. Do not create empty defect tasks.

Browser evidence must name engine and tested scope. Visual review must name theme, density, width and locale. Do not convert DOM-emulation evidence into native/device/screen-reader evidence. Accept sufficient existing evidence without rerunning it solely for checklist credit.

Use the [resumable execution index](react-aria-hardening-execution.md) to retain
passing batches and resume only unfinished or affected coverage.

Not-applicable cases require a concrete source-based reason, not a silent checkmark. Split an engine or state matrix further when one chat cannot close it; retain the original parent and append stable child suffixes.

## Current example and browser host

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

- [ ] A-M-01 Reconcile Button final acceptance: Owned button props, variants/tones, native form behavior, press/click mapping. Link its `F-C01`, `T-C01` and `V-C01` evidence and any unresolved defects.
- [ ] A-M-02 Reconcile AppInlineProgress final acceptance: Progress/status semantics, reduced motion, tokenized label/layout. Link its `F-C02`, `T-C02` and `V-C02` evidence and any unresolved defects.
- [ ] A-M-03 Reconcile AppOperationSteps final acceptance: State announcements, completed/error/active visuals, hide single-step numbering. Link its `F-C03`, `T-C03` and `V-C03` evidence and any unresolved defects.
- [ ] A-M-04 Reconcile AppPageHeader final acceptance: Breadcrumbs, actions, metadata, primary/subpage hierarchy, responsive wrapping. Link its `F-C04`, `T-C04` and `V-C04` evidence and any unresolved defects.
- [ ] A-M-05 Reconcile AppPageTabs final acceptance: Tab/panel wiring, selected/disabled state, density, keyboard/overflow behavior. Link its `F-C05`, `T-C05` and `V-C05` evidence and any unresolved defects.
- [ ] A-M-06 Reconcile AppShell final acceptance: Landmark/layout semantics, responsive navigation, main-content reflow. Link its `F-C06`, `T-C06` and `V-C06` evidence and any unresolved defects.
- [ ] A-M-07 Reconcile AuthShell final acceptance: Presentation-only shell, no login flow/session behavior, resilient content sizing. Link its `F-C07`, `T-C07` and `V-C07` evidence and any unresolved defects.
- [ ] A-M-08 Reconcile AppModal final acceptance: Owned close reasons/size/parts, focus, sticky tabs, scroll, actions and steps. Link its `F-C08`, `T-C08` and `V-C08` evidence and any unresolved defects.
- [ ] A-M-09 Reconcile SideNavigation final acceptance: Selection/expansion, router/account adapters, organization menu, keyboard and collapse. Link its `F-C09`, `T-C09` and `V-C09` evidence and any unresolved defects.
- [ ] A-M-10 Reconcile ExperiencePageNavigator final acceptance: Previous/next boundaries, labels, disabled states, link/action semantics. Link its `F-C10`, `T-C10` and `V-C10` evidence and any unresolved defects.
- [ ] A-M-11 Reconcile CardCollectionWithFooter final acceptance: Responsive/container layout, keys, empty/loading states, pagination integration. Link its `F-C11`, `T-C11` and `V-C11` evidence and any unresolved defects.
- [ ] A-M-12 Reconcile CardPaginationFooter final acceptance: Owned pagination, labels/counts, disabled boundaries, unknown totals. Link its `F-C12`, `T-C12` and `V-C12` evidence and any unresolved defects.
- [ ] A-M-13 Reconcile ClassCardFrame final acceptance: Owned surface/spacing, image/content slots, responsive width and constants. Link its `F-C13`, `T-C13` and `V-C13` evidence and any unresolved defects.
- [ ] A-M-14 Reconcile InstructorClassCard final acceptance: Status/menu/actions, callbacks, long text, date and icon fallbacks. Link its `F-C14`, `T-C14` and `V-C14` evidence and any unresolved defects.
- [ ] A-M-15 Reconcile LearnerClassCard final acceptance: Progress/due labels/status/actions, translation, accessible interactive regions. Link its `F-C15`, `T-C15` and `V-C15` evidence and any unresolved defects.
- [ ] A-M-16 Reconcile AppDataGrid final acceptance: Complete owned grid implementation, types and helpers; follow G tasks. Link its `F-C16`, `T-C16` and `V-C16` evidence and any unresolved defects.
- [ ] A-M-17 Reconcile AppDataGridShell final acceptance: Grid/card modes, shared state, toolbar/footer, responsive shell. Link its `F-C17`, `T-C17` and `V-C17` evidence and any unresolved defects.
- [ ] A-M-18 Reconcile AppDataGridRowDnd final acceptance: Replace DOM selectors/ghost styling; keyboard/touch/reorder/cancel behavior. Link its `F-C18`, `T-C18` and `V-C18` evidence and any unresolved defects.
- [ ] A-M-19 Reconcile LearnerClassesDataGrid final acceptance: Owned model/columns, date/link/action cells, host callbacks and state. Link its `F-C19`, `T-C19` and `V-C19` evidence and any unresolved defects.
- [ ] A-M-20 Reconcile DataToolbar final acceptance: Search, refresh, selection/sort/filter/columns menus, badge, view switching. Link its `F-C20`, `T-C20` and `V-C20` evidence and any unresolved defects.
- [ ] A-M-21 Reconcile DocumentEditorLayout final acceptance: Tokenized menu/toolbar/content layout and scroll boundaries. Link its `F-C21`, `T-C21` and `V-C21` evidence and any unresolved defects.
- [ ] A-M-22 Reconcile DocumentEditorToolbar final acceptance: Owned buttons/menus/toggles, formatting state, responsive overflow. Link its `F-C22`, `T-C22` and `V-C22` evidence and any unresolved defects.
- [ ] A-M-23 Reconcile ContentEditorChrome final acceptance: Menu composition, editor focus, disabled/loading actions, semantic structure. Link its `F-C23`, `T-C23` and `V-C23` evidence and any unresolved defects.
- [ ] A-M-24 Reconcile EditableTitleField final acceptance: Controlled edit/commit/cancel, keyboard and blur behavior, validation. Link its `F-C24`, `T-C24` and `V-C24` evidence and any unresolved defects.
- [ ] A-M-25 Reconcile FloatingTextSelectionToolbar final acceptance: Selection anchoring, focus preservation, overlay cleanup, keyboard access. Link its `F-C25`, `T-C25` and `V-C25` evidence and any unresolved defects.
- [ ] A-M-26 Reconcile RichTextFormattingToolbar final acceptance: All formatting actions, mixed/active/disabled state, Lexical commands. Link its `F-C26`, `T-C26` and `V-C26` evidence and any unresolved defects.
- [ ] A-M-27 Reconcile InsertContentMenuControl final acceptance: Menu commands and insertion focus, disabled actions and announcements. Link its `F-C27`, `T-C27` and `V-C27` evidence and any unresolved defects.
- [ ] A-M-28 Reconcile TextAlignMenuControl final acceptance: Alignment/indent commands, active state, direction-aware presentation. Link its `F-C28`, `T-C28` and `V-C28` evidence and any unresolved defects.
- [ ] A-M-29 Reconcile TextColorPickerControl final acceptance: Foreground/background modes, clear/reset, swatches and accessible color control. Link its `F-C29`, `T-C29` and `V-C29` evidence and any unresolved defects.
- [ ] A-M-30 Reconcile TextStyleMenuControl final acceptance: Style/typeface options, tokenized labels, selection and focus behavior. Link its `F-C30`, `T-C30` and `V-C30` evidence and any unresolved defects.
- [ ] A-M-31 Reconcile ColumnsLayoutModal final acceptance: Layout presets, selected state, validation and modal Apply/Cancel. Link its `F-C31`, `T-C31` and `V-C31` evidence and any unresolved defects.
- [ ] A-M-32 Reconcile ImageUploadModal final acceptance: File selection/preview/errors, host upload callback, image alt text and cancellation. Link its `F-C32`, `T-C32` and `V-C32` evidence and any unresolved defects.
- [ ] A-M-33 Reconcile LinkUrlModal final acceptance: URL validation, protocol policy, edit/remove and focus restoration. Link its `F-C33`, `T-C33` and `V-C33` evidence and any unresolved defects.
- [ ] A-M-34 Reconcile PageRichTextEditorSection final acceptance: Editor composition, nodes/plugins, serialization and selection behavior. Link its `F-C34`, `T-C34` and `V-C34` evidence and any unresolved defects.
- [ ] A-M-35 Reconcile Typefaces final acceptance: Foundation catalog using new theme/tokens and native typography contract. Link its `F-C35`, `T-C35` and `V-C35` evidence and any unresolved defects.
- [ ] A-M-36 Reconcile icons final acceptance: Complete direct/public icon mapping and activity-type behavior. Link its `F-C36`, `T-C36` and `V-C36` evidence and any unresolved defects.
- [ ] A-M-37 Reconcile primitives final acceptance: Replace every reexport with an owned implementation/type or documented removal. Link its `F-C37`, `T-C37` and `V-C37` evidence and any unresolved defects.

## P4: original scope obligation closure

Each `A-*` acceptance item below reconciles one original parent with its implementation and regression evidence. Existing checked parents stay checked in the historical ledger; these new closure tasks start open because this rewrite did not perform a fresh acceptance audit. This does not reset accepted implementation work. A parent containing several requirements may close only when each is evidenced, or split into explicit children. Future scope remains deferred and outside the required baseline/acceptance denominator.

- [ ] A-B-01 Reconcile original `B-01`: Capture current Git status, relevant release tags, package metadata, and public exports without discarding existing work. Historical status: checked.
- [ ] A-B-02 Reconcile original `B-02`: Read `AGENTS.md`, `README.md`, `docs/migration.md`, `docs/developer/component-architecture.md`, and `docs/agent-guidance-migration.md` before architecture changes. Historical status: checked.
- [ ] A-B-03 Reconcile original `B-03`: Inventory dependency imports, transitive dependencies, public declarations, class names, DOM assumptions, augmentation, and generated artifacts; include hidden configuration files. Historical status: open.
- [ ] A-B-04 Reconcile original `B-04`: Inventory all primitive exports and all icons, including direct icon imports that are not present in the public icon barrel. Historical status: checked.
- [ ] A-B-05 Reconcile original `B-05`: Snapshot public props, callbacks, models, defaults, subpaths, and deprecations; identify changes that are actually breaking. Historical status: open.
- [ ] A-B-06 Reconcile original `B-06`: Baseline existing unit/package/release-policy checks and Storybook build; record pre-existing failures separately. Historical status: checked.
- [ ] A-B-07 Reconcile original `B-07`: Capture representative screenshots and browser interactions for light/dark UI, compact/comfortable controls, editors, navigation, modals, and grids. Historical status: open.
- [ ] A-B-08 Reconcile original `B-08`: Record current grid behavior, including selection across pages, sorting, filtering, column visibility, row drag, card mode, and server callbacks. Historical status: open.
- [ ] A-B-09 Reconcile original `B-09`: Audit focus removal, hover-only triggers, drag-only interactions, labels, contrast, and sticky content; document findings without claiming a conformance audit from source inspection alone. Historical status: open.
- [ ] A-B-10 Reconcile original `B-10`: Measure production consumer bundles, CSS, editor/grid imports, initial render, and interactive updates with reproducible fixtures. Historical status: open.
- [ ] A-B-11 Reconcile original `B-11`: Record browser, React, TypeScript, Node, bundler, SSR, and React Server Component support promises separately; maintain current React 18.3/19 support unless evidence justifies a documented change. Historical status: open.
- [ ] A-B-12 Reconcile original `B-12`: Review the extraction manifest against actual files so helpers, model presets, nodes/plugins, fixtures, and tests are not lost when directories move. Historical status: open.
- [ ] A-B-13 Reconcile original `B-13`: Inventory storage keys, persisted schema shapes, locale/date behavior, and error states that consumers rely on. Historical status: open.
- [ ] A-B-14 Reconcile original `B-14`: Keep the learner platform unchanged; collect reference behavior and source provenance read-only. Historical status: checked.
- [ ] A-A-01 Reconcile original `A-01`: Write an architecture decision record for React Aria, compiled CSS, the owned public API, specialist engines, and the reasons alternatives were not selected. Historical status: checked.
- [ ] A-A-02 Reconcile original `A-02`: Establish layers: tokens/styles; native presentation primitives; interaction primitives; composed UI; optional grid/editor/learning extensions; host adapters. Historical status: open.
- [ ] A-A-03 Reconcile original `A-03`: Define one-way dependency boundaries; prevent root-barrel imports from internal implementations and prevent circular imports. Historical status: open.
- [ ] A-A-04 Reconcile original `A-04`: Keep React Aria imports inside the interaction implementation layer; consumers and higher-level compositions use SGUI contracts. Historical status: open.
- [ ] A-A-05 Reconcile original `A-05`: Define SGUI-owned props instead of extending or aliasing all upstream props wholesale; selectively map native HTML attributes and ref behavior. Historical status: open.
- [ ] A-A-06 Reconcile original `A-06`: Standardize controlled/uncontrolled pairs, defaults, change callbacks, null/empty semantics, disabled/read-only/loading behavior, and stable IDs. Historical status: open.
- [ ] A-A-07 Reconcile original `A-07`: Specify native click versus normalized press semantics without surprising consumers; prevent duplicate callback invocation and document keyboard/touch activation. Historical status: open.
- [ ] A-A-08 Reconcile original `A-08`: Define public variant, size, tone, density, placement, dismissal-reason, and validation contracts independently of any foundation. Historical status: open.
- [ ] A-A-09 Reconcile original `A-09`: Define accessible naming and description requirements for icon-only and compound controls; choose typed requirements where practical. Historical status: open.
- [ ] A-A-10 Reconcile original `A-10`: Define composition and escape hatches: supported slots/parts, render callbacks, refs, `className`/part classes, CSS variables, and native `style` where needed. Historical status: open.
- [ ] A-A-11 Reconcile original `A-11`: Avoid exposing upstream collection/state objects, date object classes, grid column types, or unstable event payloads without an explicit reviewed contract. Historical status: open.
- [ ] A-A-12 Reconcile original `A-12`: Preserve useful existing `App*` exports where possible; do not invent a wholesale `SG*` rename merely because examples used that prefix. Historical status: open.
- [ ] A-A-13 Reconcile original `A-13`: Replace explicitly branded public exports such as `MuiLink`; document their owned replacement and migration since the final API must contain no retired branding. Historical status: open.
- [ ] A-A-14 Reconcile original `A-14`: Preserve Class-prefixed compatibility names when possible; use Course naming for new learning APIs and document intentional removals as breaking. Historical status: open.
- [ ] A-A-15 Reconcile original `A-15`: Create old-to-new API mappings for theme objects, typography, styling props, modal callbacks, selection, columns, and pagination. Historical status: open.
- [ ] A-A-16 Reconcile original `A-16`: Keep replacement implementations swappable behind observable behavior tests; do not promise a later rewrite will be cost-free or entirely nonbreaking. Historical status: open.
- [ ] A-A-17 Reconcile original `A-17`: Define extension points for advanced components without placing backend scheduling, booking, permission, or account logic inside UI controls. Historical status: open.
- [ ] A-A-18 Reconcile original `A-18`: Keep heavyweight modules out of basic-control dependency paths; decide which require separate subpaths versus separate packages. Historical status: open.
- [ ] A-A-19 Reconcile original `A-19`: Document package dependency placement, supported versions, upgrade policy, and deduplication requirements for React Aria and date utilities. Historical status: checked.
- [ ] A-L-01 Reconcile original `L-01`: Verify the selected versions' actual licenses, including React Aria Components, hooks/state/date utilities, icon assets, grid engine, editor packages, and transitive distributed code. Historical status: open.
- [ ] A-L-02 Reconcile original `L-02`: Preserve Apache 2.0 licenses and applicable notices; record modifications where required if upstream code is copied or changed rather than merely depended on. Historical status: open.
- [ ] A-L-03 Reconcile original `L-03`: Preserve SGUI's commercial-license requirement and distinguish SGUI-owned work from upstream open-source work; do not impose exclusive SGUI terms on independently licensed dependencies. Historical status: open.
- [ ] A-L-04 Reconcile original `L-04`: Refresh `THIRD_PARTY_NOTICES.md` from the final shipped dependency and asset inventory; remove a retired notice only after its code/assets are no longer distributed. Historical status: open.
- [ ] A-L-05 Reconcile original `L-05`: Avoid replacing icon imports with copied assets that retain the retired dependency or its licensing obligations unnoticed. Historical status: open.
- [ ] A-L-06 Reconcile original `L-06`: Record grid Community/Enterprise and redistribution implications before selecting an engine; no paid feature dependency is silently assumed. Historical status: open.
- [ ] A-L-07 Reconcile original `L-07`: Keep the commercial agreement's legal identity, permitted distribution, support, and other unresolved business terms on the existing pre-publication legal-review checklist. Historical status: open.
- [ ] A-L-08 Reconcile original `L-08`: Add a repeatable dependency/license inventory check and assign ownership for updates; avoid automatically rewriting commercial terms. Historical status: open.
- [ ] A-L-09 Reconcile original `L-09`: Document dependency support/security update expectations and a deliberate upgrade process with behavioral regression checks. Historical status: open.
- [ ] A-D-01 Reconcile original `D-01`: Create one reviewable token source using a documented schema compatible with the Design Tokens Community Group format where appropriate. Historical status: checked.
- [ ] A-D-02 Reconcile original `D-02`: Separate base palette/scale tokens, semantic roles, and component-specific tokens; use aliases rather than duplicating values. Historical status: open.
- [ ] A-D-03 Reconcile original `D-03`: Generate CSS custom properties and typed references from that source with deterministic output and validation. Historical status: checked.
- [ ] A-D-04 Reconcile original `D-04`: Define semantic colors for surfaces, raised/overlay surfaces, text, borders, separators, primary/neutral/destructive actions, selected/hover/pressed states, validation, and focus. Historical status: open.
- [ ] A-D-05 Reconcile original `D-05`: Define coordinated light/dark themes; validate readable states rather than mechanically inverting colors. Historical status: open.
- [ ] A-D-06 Reconcile original `D-06`: Define a consistent spacing, sizing, radius, elevation, border, icon, and motion scale; reconcile the current differing button/card radii intentionally. Historical status: open.
- [ ] A-D-07 Reconcile original `D-07`: Define heading, body, label, caption, table, and code typography roles, including a replacement for `bodyAlt2`; consumers must not need module augmentation. Historical status: open.
- [ ] A-D-08 Reconcile original `D-08`: Document semantic HTML independently of typography appearance; visual heading size must not determine document heading level. Historical status: open.
- [ ] A-D-09 Reconcile original `D-09`: Use rem-based text sizing and layouts that tolerate zoom, text spacing changes, long labels, and font substitution. Historical status: open.
- [ ] A-D-10 Reconcile original `D-10`: Retain a deliberate Geist/system font strategy; do not download fonts at runtime or require a licensed asset without documenting it. Historical status: open.
- [ ] A-D-11 Reconcile original `D-11`: Define compact and comfortable density, independently of brand/color theme; preserve legacy compact menus through an explicit compatibility default while documenting the new general default. Historical status: open.
- [ ] A-D-12 Reconcile original `D-12`: Make important touch controls comfortably operable; density must not erase minimum hit areas or keyboard focus indicators. Historical status: open.
- [ ] A-D-13 Reconcile original `D-13`: Define neutral split actions with shared border/divider and readable theme-aware primary text; define filled emphasis for contexts that genuinely need it. Historical status: open.
- [ ] A-D-14 Reconcile original `D-14`: Define primary/subpage surface hierarchy, card hierarchy, and overlay elevation through semantic tokens. Historical status: open.
- [ ] A-D-15 Reconcile original `D-15`: Design complete hover, focus, pressed, selected, disabled, read-only, invalid, pending, empty, loading, and error states; never rely on color alone for meaning. Historical status: open.
- [ ] A-D-16 Reconcile original `D-16`: Define scoped theme/density roots and nested overrides; ensure portaled overlays receive the correct scope and variables. Historical status: open.
- [ ] A-D-17 Reconcile original `D-17`: Specify explicit light/dark/system settings, initial server theme, `color-scheme`, and hydration behavior without unwanted flashes or browser-global assumptions. Historical status: open.
- [ ] A-D-18 Reconcile original `D-18`: Support reduced motion and forced-colors/high-contrast environments; avoid suppressing essential system indications. Historical status: open.
- [ ] A-D-19 Reconcile original `D-19`: Validate token references, names, types, aliases, cycles, and contrast combinations in CI; do not imply generated palettes automatically satisfy contrast. Historical status: open.
- [ ] A-D-20 Reconcile original `D-20`: Publish foundation stories for palettes, typography, spacing, density, surfaces, focus, and motion, all consuming production tokens. Historical status: open.
- [ ] A-C-01 Reconcile original `C-01`: Add a build pipeline that compiles colocated CSS Modules and emits browser-ready CSS with source maps where appropriate. Historical status: checked.
- [ ] A-C-02 Reconcile original `C-02`: Choose/document stylesheet entry points and import order; provide a basic installation example that requires no consumer Tailwind/PostCSS configuration. Historical status: checked.
- [ ] A-C-03 Reconcile original `C-03`: Use CSS variables for themes and dynamic values, variant/state attributes for predictable states, and supported part hooks for customization. Historical status: open.
- [ ] A-C-04 Reconcile original `C-04`: Replace `sx`, `paperSx`, theme callbacks, object-style overrides, and retired DOM selectors with owned contracts and component styles; map each removed public styling prop. Historical status: open.
- [ ] A-C-05 Reconcile original `C-05`: Define a named, namespaced library cascade layer and low-specificity selectors; document unlayered consumer override behavior and important-declaration caveats. Historical status: checked.
- [ ] A-C-06 Reconcile original `C-06`: Make a global reset optional; scope necessary component normalization and do not change host body, links, buttons, or typography merely by importing SGUI. Historical status: checked.
- [ ] A-C-07 Reconcile original `C-07`: Document stylesheet composition across library themes, components, utilities, and consumer overrides; avoid escalating specificity or routine `!important`. Historical status: checked.
- [ ] A-C-08 Reconcile original `C-08`: Use container size queries for reusable card, toolbar, navigation, and modal compositions; choose/document containment boundaries so consumers know what supplies the container. Historical status: open.
- [ ] A-C-09 Reconcile original `C-09`: Use logical properties and direction-aware icons/placement for RTL; do not assume physical left/right always means start/end. Historical status: open.
- [ ] A-C-10 Reconcile original `C-10`: Prefer Grid/Flexbox over JavaScript layout measurement; reserve observers/measurement for demonstrated interaction or virtualization needs and clean them up. Historical status: open.
- [ ] A-C-11 Reconcile original `C-11`: Use native nesting with documented tooling/browser support; keep selector depth shallow and component ownership obvious. Historical status: open.
- [ ] A-C-12 Reconcile original `C-12`: Use fluid sizing such as `clamp` where beneficial without preventing text zoom; establish mobile/reflow fallbacks. Historical status: open.
- [ ] A-C-13 Reconcile original `C-13`: Evaluate `color-mix`/OKLCH for palette tooling and state derivation; preserve tested fallback/contrast behavior for supported browsers. Historical status: open.
- [ ] A-C-14 Reconcile original `C-14`: Define progressive enhancement with `@supports`; do not adopt limited-support anchor positioning, style queries, or transitions as unconditional dependencies. Historical status: open.
- [ ] A-C-15 Reconcile original `C-15`: Use `:focus-visible` or owned accessible focus-state attributes; preserve visible focus when replacing current outline suppression. Historical status: open.
- [ ] A-C-16 Reconcile original `C-16`: Define reduced-motion transitions, interruption/cancellation behavior, and focus timing; no motion runtime is added solely for simple CSS transitions. Historical status: open.
- [ ] A-C-17 Reconcile original `C-17`: Specify overlay stacking/portal ownership rather than maximum-integer z-index values; test nested dialog/menu/tooltip/editor overlays. Historical status: open.
- [ ] A-C-18 Reconcile original `C-18`: Add CSS and token lint rules that catch retired selectors, accidental global rules, ad hoc typography, and unsupported token references. Historical status: open.
- [ ] A-C-19 Reconcile original `C-19`: Verify CSP behavior, including unavoidable inline styles for placement/dynamic values; do not claim strict CSP support without testing. Historical status: open.
- [ ] A-C-20 Reconcile original `C-20`: Verify compiled CSS distribution, consumer production builds, stylesheet deduplication, and tree-shaking behavior; CSS must not be removed as a false side effect. Historical status: open.
- [ ] A-C-21 Reconcile original `C-21`: [Decision] Keep CSS Modules as the default; adopt vanilla-extract or utility authoring only for an evidenced benefit and without imposing its toolchain on consumers. Historical status: checked.
- [ ] A-I-01 Reconcile original `I-01`: Select an independently licensed SVG source or owned vector set with full coverage of the current library's symbols and editor controls. Historical status: checked.
- [ ] A-I-02 Reconcile original `I-02`: Map every direct import and public icon export to a replacement, including account/logout, arrows, calendar, filters, status, editor formatting, undo/redo, and activity symbols. Historical status: checked.
- [ ] A-I-03 Reconcile original `I-03`: Define SGUI-owned icon props for size, stroke/fill, current color, class/style hooks, decorative versus meaningful use, and ref behavior where needed. Historical status: checked.
- [ ] A-I-04 Reconcile original `I-04`: Keep icons individually importable; avoid pulling an entire icon catalog into basic components. Historical status: checked.
- [ ] A-I-05 Reconcile original `I-05`: Establish consistent optical size, weight, alignment, RTL mirroring policy, and theme contrast. Historical status: open.
- [ ] A-I-06 Reconcile original `I-06`: Make decorative icons hidden from assistive technology and require meaningful names at the appropriate control level. Historical status: checked.
- [ ] A-I-07 Reconcile original `I-07`: Replace the activity-type icon map while preserving known/unknown fallbacks and consumer override options. Historical status: checked.
- [ ] A-I-08 Reconcile original `I-08`: Add icon catalog, accessibility, and bundle checks; update notices for all shipped vector assets. Historical status: open.
- [ ] A-H-01 Reconcile original `H-01`: Preserve native-anchor fallback, custom router links, pathname tracking, navigation replace behavior, refs, and forwarded attributes. Historical status: open.
- [ ] A-H-02 Reconcile original `H-02`: Verify modifier clicks, downloads, external links, targets, default prevention, and navigation callback ordering through browser tests. Exact-byte transfers and native semantics in all three engines, CI 37560065588; [browser evidence](react-aria-browser-acceptance.md). Historical status: checked.
- [ ] A-H-03 Reconcile original `H-03`: Integrate React Aria routing where needed behind the existing host adapter; avoid two competing navigation systems or a runtime Next.js dependency. Historical status: open.
- [ ] A-H-04 Reconcile original `H-04`: Preserve account/organization/logout callback boundaries; no credentials, platform fetches, or implicit session refresh enter SGUI. Historical status: open.
- [ ] A-H-05 Reconcile original `H-05`: Define pending/error handling for asynchronous host actions without duplicating requests or swallowing useful errors. Historical status: open.
- [ ] A-H-06 Reconcile original `H-06`: Connect host locale/direction settings to React Aria internationalization; avoid different locales in controls, SGUI strings, and date formatting. Historical status: open.
- [ ] A-H-07 Reconcile original `H-07`: Preserve translation keys, mandatory `defaultMessage`, interpolation values, namespace awareness, and deterministic English fallback. Historical status: open.
- [ ] A-H-08 Reconcile original `H-08`: Validate ICU variables, pluralization, selection counts, date/number formatting, long labels, RTL, and pseudo-localized stories. Historical status: open.
- [ ] A-H-09 Reconcile original `H-09`: Keep supported-language policy, database overrides, caching/invalidation, audit metadata, and diagnostic logging host-owned. Historical status: open.
- [ ] A-H-10 Reconcile original `H-10`: Define serializable owned date-only, local date-time, and zoned instant contracts; do not collapse all values into JavaScript `Date` or leak date-library classes casually. Historical status: open.
- [ ] A-H-11 Reconcile original `H-11`: Specify time zones, daylight-saving transitions, locale calendar display, parsing, invalid inputs, serialization, and round-trip behavior. Historical status: open.
- [ ] A-H-12 Reconcile original `H-12`: Preserve due-date formatting and missing/invalid value fallbacks; test midnight, timezone, and localization boundaries. Historical status: open.
- [ ] A-H-13 Reconcile original `H-13`: Make persistence opt-in/configurable with distinct keys per view; document ownership, schema versioning, migration/reset, and sensitive-data restrictions. [Hook contracts](react-aria-pagination-state.md) and [grid persistence/reset](react-aria-catalog-grid.md). Historical status: checked.
- [ ] A-H-14 Reconcile original `H-14`: Validate stored data and support SSR, blocked storage, quota failures, malformed JSON, key changes, cross-tab updates, and a working in-memory fallback. Real hook, live-settings and hydration regressions; [contracts](react-aria-pagination-state.md). Historical status: checked.
- [ ] A-H-15 Reconcile original `H-15`: Remove the pagination helper's inherited page-size cap unless it is deliberately part of SGUI policy; define supported sizes through owned configuration and test normalization. [Configured sizes](react-aria-pagination-state.md). Historical status: checked.
- [ ] A-H-16 Reconcile original `H-16`: Ensure filters/page-size changes reset or clamp pages coherently, including unknown row counts and disappearing rows. Historical status: open.
- [ ] A-H-17 Reconcile original `H-17`: Preserve independent view state for tabs/card/grid views; avoid leaking selection, sort, or filter state between unrelated instances. Historical status: open.
- [ ] A-P-01 Reconcile original `P-01`: Build a representative styled button and labeled field using the intended tokens, owned contracts, CSS output, and focus behavior. Historical status: checked.
- [ ] A-P-02 Reconcile original `P-02`: Build a dialog containing validation, tabs, a combobox, and a nested popover; test focus entry/restoration, Escape, dismissal, and scrolling. Historical status: checked.
- [ ] A-P-03 Reconcile original `P-03`: Build an asynchronous searchable multi-select using host-supplied loading/results; test cancellation, empty/error states, long lists, and keyboard behavior. Historical status: checked.
- [ ] A-P-04 Reconcile original `P-04`: Build the advanced date selector with presets, multi-month range, unavailable dates, Apply/Cancel, locale/direction, and timezone-aware examples. Historical status: checked.
- [ ] A-P-05 Reconcile original `P-05`: Identify requirements that React Aria's standard Calendar/RangeCalendar does not supply directly, such as arbitrary multiple-date or fiscal-period selection; test lower-level composition rather than assuming support. Historical status: checked.
- [ ] A-P-06 Reconcile original `P-06`: Compare candidate grid foundations against a concrete parity checklist using selection, server pagination, multiple sorting/filter rules, column visibility, resizing, actions, and row reordering. Historical status: checked.
- [ ] A-P-07 Reconcile original `P-07`: Include keyboard, screen-reader, zoom, touch, dark theme, reduced-motion, SSR/hydration, and production bundle checks in prototype findings. Historical status: open.
- [ ] A-P-08 Reconcile original `P-08`: Set reproducible performance budgets from baseline and representative consumer hardware; do not invent universal speed or size rankings. Historical status: open.
- [ ] A-P-09 Reconcile original `P-09`: [Decision] Record the grid engine and which layer owns data state, rendering, focus, virtualization, and drag; assign one authoritative owner for each state domain. Historical status: checked.
- [ ] A-P-10 Reconcile original `P-10`: [Decision] Keep React Aria as the primary foundation unless a demonstrated blocker warrants a recorded exception; no second general primitive system is added speculatively. Historical status: checked.
- [ ] A-P-11 Reconcile original `P-11`: Document prototype outcomes, API changes, limitations, and accessibility gaps; do not call prototype completion a production feature release. Historical status: open.
- [ ] A-U-01 Reconcile original `U-01`: Implement Button, IconButton, split action, and button groups with loading, disabled, form type, link/action distinction, and focus behavior. Historical status: open.
- [ ] A-U-02 Reconcile original `U-02`: Implement Box/container, Stack, surface/Paper, card/content, separator/Divider, and responsive layout primitives with scoped styles. Historical status: open.
- [ ] A-U-03 Reconcile original `U-03`: Implement Text/Typography with semantic element selection and all required typography roles. Historical status: checked.
- [ ] A-U-04 Reconcile original `U-04`: Implement TextField, input base, labels, descriptions, validation errors, required state, textarea, and grouped fields with correct associations. Historical status: open.
- [ ] A-U-05 Reconcile original `U-05`: Implement Checkbox, mixed state, Switch, RadioGroup, and label composition; document keyboard and form-submission semantics. Historical status: open.
- [ ] A-U-06 Reconcile original `U-06`: Implement Select and searchable ComboBox/Autocomplete; define value identity, filtering ownership, empty/loading/error, multiple selection where required, and disabled options. Historical status: open.
- [ ] A-U-07 Reconcile original `U-07`: Implement Menu/MenuItem, submenus when required, Popover, and Tooltip; distinguish menu commands from arbitrary form content in a popover. Historical status: open.
- [ ] A-U-08 Reconcile original `U-08`: Implement dialog primitives and modal composition with title/description, dismissal reasons, initial/return focus, scroll locking, background interaction handling, and nested overlays. Historical status: open.
- [ ] A-U-09 Reconcile original `U-09`: Implement Tabs with correct roles, panels, orientation, activation mode, disabled tabs, focus visibility, and overflow behavior. Historical status: open.
- [ ] A-U-10 Reconcile original `U-10`: Implement owned Link/Breadcrumbs with host navigation integration and meaningful external-link behavior. Historical status: open.
- [ ] A-U-11 Reconcile original `U-11`: Implement List/list items, navigation items, disclosure/Collapse, and selected/expanded state without misusing menu semantics for navigation. Historical status: checked.
- [ ] A-U-12 Reconcile original `U-12`: Implement Chip/Tag, Badge, and removable tokens with accessible action labels and predictable focus after removal. Historical status: checked.
- [ ] A-U-13 Reconcile original `U-13`: Implement progress indicators and status messages; distinguish determinate progress from loading and avoid noisy live-region announcements. Historical status: checked.
- [ ] A-U-14 Reconcile original `U-14`: Implement Avatar/image fallbacks and accessible image labeling; keep sizing and aspect ratio stable while loading. Historical status: checked.
- [ ] A-U-15 Reconcile original `U-15`: Implement semantic table parts and pagination primitives with owned contracts; do not export an engine's low-level table types as SGUI's entire API. Historical status: checked.
- [ ] A-U-16 Reconcile original `U-16`: Implement toggle buttons/groups for editor and view-mode controls with pressed state and appropriate single/multiple selection semantics. Historical status: checked.
- [ ] A-U-17 Reconcile original `U-17`: Provide consistent focus ring, target size, disabled styling, validation, status announcement, and pointer/keyboard interactions across primitives. Historical status: open.
- [ ] A-U-18 Reconcile original `U-18`: Preserve native form participation, reset behavior, autofill, names/values, and submit behavior; test controlled and uncontrolled variants. Historical status: open.
- [ ] A-U-19 Reconcile original `U-19`: Define overlay collision/placement behavior at narrow widths and browser zoom; preserve theme/locale in portals and avoid clipped popovers. Historical status: open.
- [ ] A-U-20 Reconcile original `U-20`: Make temporary migration shims explicit and internal where possible; remove all shims that depend on the retired foundation before completion. Historical status: open.
- [ ] A-M-38 Reconcile original `M-38`: Track completion of M-01 through M-37 individually with PR and validation links; do not count a directory as migrated while it still imports a retired primitive transitively. Historical status: open.
- [ ] A-M-39 Reconcile original `M-39`: Migrate `AdminDataGridOptions.ts` and `InstructorDataGridOptions.ts`, including column locks, static enums, filter/sort defaults, and translation labels. Historical status: checked.
- [ ] A-M-40 Reconcile original `M-40`: Migrate all grid cells: text, date, date-time, link, copyable, JSON, image, action menu, custom cell, and fallback; preserve escaping and truncation/accessibility behavior. [Cell evidence](react-aria-grid-cell-acceptance.md). Historical status: checked.
- [ ] A-M-41 Reconcile original `M-41`: Migrate grid subheaders, empty/loading overlays, column builders, action-menu builder, toolbar option builder, and header sort menu. [Helper evidence](react-aria-grid-cell-acceptance.md#m-41-helper-and-part-coverage). Historical status: checked.
- [ ] A-M-42 Reconcile original `M-42`: Reconcile root and subpath barrels, `src/models.ts`, fixtures, date helpers, pagination/state hooks, and all inferred exported declaration types. Owned model/fixture/date audit, public learner-grid prop export and built consumer typing; [hook mappings](react-aria-pagination-state.md). Historical status: checked.
- [ ] A-M-43 Reconcile original `M-43`: Update stories importing third-party layout primitives and tests mocking retired modules; behavioral replacements must render real owned components where practical. Historical status: checked.
- [ ] A-M-44 Reconcile original `M-44`: Document deliberate UX improvements separately from parity changes; retain regression fixtures for legacy use cases. Historical status: open.
- [ ] A-G-01 Reconcile original `G-01`: Create a capability matrix with required parity, agreed enhancements, and explicitly deferred spreadsheet/analytics features. [Design review](react-aria-grid-contracts.md); runtime parity remains open. Historical status: checked.
- [ ] A-G-02 Reconcile original `G-02`: Define owned row IDs, column IDs, accessors, cell renderers, value formatting, action callbacks, row models, and generic typing. [Target contracts](react-aria-grid-contracts.md); M-16 implementation/declaration validation remains open. Historical status: checked.
- [ ] A-G-03 Reconcile original `G-03`: Define controlled/default selection, sort, filters, pagination, visibility, order, width, and expansion; one state owner per concern. [State authority](react-aria-grid-contracts.md#state-authority-and-transactions); expansion explicitly deferred, runtime integration remains open. Historical status: checked.
- [ ] A-G-04 Reconcile original `G-04`: Support client filtering before sorting and pagination; implement stable null/date/number/text semantics with tests. Historical status: open.
- [ ] A-G-05 Reconcile original `G-05`: Support server mode through host callbacks, known/unknown totals, pending/error/refresh states, and stale-request handling examples; the grid does not fetch platform APIs. Historical status: open.
- [ ] A-G-06 Reconcile original `G-06`: Preserve first-column checkboxes, mixed header state, selected count, select-none, and explicit current-page versus all-matching selection semantics. Historical status: open.
- [ ] A-G-07 Reconcile original `G-07`: Preserve selection through sort/filter/page changes according to documented policy; handle disabled/deleted rows and avoid treating unloaded rows as known. Historical status: open.
- [ ] A-G-08 Reconcile original `G-08`: Preserve sort menus, direction indicators, clear sort, priority order, and multi-sort where promised; expose sortable affordances to keyboard/touch as well as hover. Historical status: open.
- [ ] A-G-09 Reconcile original `G-09`: Preserve shared filterFields/filterRules/onFilterRulesChange wiring, supported operators, canonical options, no-rule All semantics, active badge and page reset. Historical status: open.
- [ ] A-G-10 Reconcile original `G-10`: Preserve search, refresh, selected-actions menu, column menu, card/grid switching, and toolbar split-action visual conventions. Historical status: open.
- [ ] A-G-11 Reconcile original `G-11`: Preserve visibility locks for first text/actions columns; distinguish non-hideable columns from actual sticky/pinned columns in API/docs. Historical status: open.
- [ ] A-G-12 Reconcile original `G-12`: Implement width/resizing/order and any agreed pinning behavior with keyboard equivalents; record feature limits instead of exposing inert props. Historical status: open.
- [ ] A-G-13 Reconcile original `G-13`: Keep action menus last; maintain row/cell/link activation without interfering with checkbox, copy, drag, or nested controls. Historical status: open.
- [ ] A-G-14 Reconcile original `G-14`: Keep body text, icons, drag handles and actions vertically aligned through shared styles. Historical status: open.
- [ ] A-G-15 Reconcile original `G-15`: Support empty, no-results, loading, refresh, error, and row-subheader states with appropriate announcements and preserved context. Historical status: open.
- [ ] A-G-16 Reconcile original `G-16`: Define keyboard navigation, tab stops, focus retention after updates, row actions, and table versus interactive-grid semantics based on actual behavior. Historical status: open.
- [ ] A-G-17 Reconcile original `G-17`: Define row reordering for pointer, touch, keyboard and non-drag actions; announce changes, support cancel, and define behavior when sorting/filtering/pagination is active. Historical status: open.
- [ ] A-G-18 Reconcile original `G-18`: Replace native DOM-class queries and ad hoc drag ghosts with owned references/parts and theme-aware previews; clean up listeners and overlays. Historical status: open.
- [ ] A-G-19 Reconcile original `G-19`: Define virtualization responsibilities and row/column overscan only where needed; test variable content, dynamic measurements, focus, screen-reader position metadata, and pinned columns. Historical status: open.
- [ ] A-G-20 Reconcile original `G-20`: Benchmark large row/column counts and frequent updates, including selection and text input; compare production builds against the baseline. Historical status: open.
- [ ] A-G-21 Reconcile original `G-21`: Preserve link adapter semantics, visible focus, copy success/error feedback, escaped JSON/text, date localization, and image fallback behavior in cells. Historical status: open.
- [ ] A-G-22 Reconcile original `G-22`: Test view-state persistence and schema migration for retired grid models; restore defensively and offer reset-to-defaults. Public live reset with controlled callbacks, stale snapshot suppression, remount and native focus evidence; [contract](react-aria-catalog-grid.md). Historical status: checked.
- [ ] A-G-23 Reconcile original `G-23`: Add grouped headers, expandable rows, or inline editing only if part of the chosen requirement matrix; define edit/commit/cancel/validation contracts before adding them. Historical status: open.
- [ ] A-G-25 Reconcile original `G-25`: If combining TanStack and React Aria, prototype the integration and map row models/state/events deliberately; avoid two selection/sort models and unsupported virtualization assumptions. Historical status: open.
- [ ] A-G-26 Reconcile original `G-26`: Document table engine limitations and an extension strategy; do not imply a UI library foundation supplies a complete enterprise grid. Historical status: open.
- [ ] A-G-27 Reconcile original `G-27`: Complete grid migration before removing final dependencies; all public and generated grid types must be engine-independent or intentionally owned. Historical status: open.
- [ ] A-G-28 Reconcile original `G-28`: Define cancel/error/optimistic-update behavior for host-driven row actions and reorder requests; restore or reconcile visible state when persistence fails. Historical status: open.
- [ ] A-G-29 Reconcile original `G-29`: Define focus and scroll preservation when data refreshes, pages change, columns hide, or a selected row disappears; test multiple independent grids. Historical status: open.
- [ ] A-K-01 Reconcile original `K-01`: Define the initial advanced-selector requirements and success examples: date-only, date/time, range, presets, unavailable dates, clear, and explicit Apply/Cancel. Historical status: open.
- [ ] A-K-02 Reconcile original `K-02`: Implement owned date field, calendar, date picker, range calendar, range picker, and time field building blocks needed by those requirements. Historical status: open.
- [ ] A-K-03 Reconcile original `K-03`: Define selection versus focused date versus visible month separately; support controlled/default state and predictable clear/reset behavior. Historical status: open.
- [ ] A-K-04 Reconcile original `K-04`: Support minimum/maximum, unavailable-date explanations, validation, required/optional input, and host-supplied availability without fetching business data. Historical status: open.
- [ ] A-K-05 Reconcile original `K-05`: Support multi-month presentation, responsive container sizing, month/year navigation, keyboard navigation, focus return, and meaningful date announcements. Historical status: open.
- [ ] A-K-06 Reconcile original `K-06`: Implement presets with documented locale/time-zone/fiscal assumptions; preserve a draft selection until Apply and restore committed selection on Cancel. Historical status: open.
- [ ] A-K-07 Reconcile original `K-07`: Keep typed/segmented input and calendar selection synchronized; define invalid/partial typing, paste, blur, and form submission behavior. Historical status: open.
- [ ] A-K-08 Reconcile original `K-08`: Test leap years, month boundaries, daylight-saving gaps/overlaps, date-only timezone independence, midnight ranges, and inclusive/exclusive endpoints. Historical status: open.
- [ ] A-K-09 Reconcile original `K-09`: Test RTL, translated labels, first-day-of-week settings, non-Gregorian display where supported, and accessible available/unavailable/selected states. Historical status: open.
- [ ] A-K-10 Reconcile original `K-10`: Define serialization and host callbacks using the owned date contract; document conversion adapters to upstream date utilities. Historical status: open.
- [ ] A-K-11 Reconcile original `K-11`: Provide stories for booking-like availability, reporting ranges, long translations, dark/density modes, and standalone versus popover calendars. Historical status: open.
- [ ] A-K-12 Reconcile original `K-12`: [Decision] Define whether multiple arbitrary dates, comparison periods, fiscal periods, or month/year-only selectors belong in the first advanced release; implement selected features with proof of behavior. Historical status: open.
- [ ] A-K-16 Reconcile original `K-16`: Publish feature limits honestly; React Aria provides useful building blocks, not a complete recurrence or resource-scheduling engine. Historical status: open.
- [ ] A-K-17 Reconcile original `K-17`: Define keyboard and non-hover access to availability explanations, range previews, and preset descriptions; rich date-cell decorations must not replace meaningful date labels. Historical status: open.
- [ ] A-E-01 Reconcile original `E-01`: Retain Lexical as the editor engine unless a separate evidenced decision changes it; remove visual-foundation coupling without accidentally changing document serialization. Historical status: open.
- [ ] A-E-02 Reconcile original `E-02`: Preserve existing nodes/plugins: ImageNode, image insertion, horizontal-rule selection, editor configuration, and experience plugins; test saved-content round trips. Historical status: open.
- [ ] A-E-03 Reconcile original `E-03`: Replace editor toolbars, menus, modals, palettes and selection overlays with owned controls while preserving selection across commands and modal dismissal. Historical status: open.
- [ ] A-E-04 Reconcile original `E-04`: Cover undo/redo, links, lists, code, tables, alignment, indentation, colors, and inline formatting that current consumers use. Historical status: open.
- [ ] A-E-05 Reconcile original `E-05`: Address IME composition, paste, keyboard shortcuts, read-only/disabled state, and toolbar accessibility without hijacking ordinary editing keys. Historical status: open.
- [ ] A-E-06 Reconcile original `E-06`: Define safe URL/protocol handling, image metadata/alt text, host upload callbacks, file validation, cancellation, and object-URL cleanup. Shared saved/pasted link policy and activation: [partial contract](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial). Saved image sources and upload-result retry: [partial image contract](react-aria-editor-section.md#image-source-policy-e-06e-07-partial); [upload lifetime matrix](react-aria-editor-section.md#host-upload-lifetime-e-06-partial) covers stale results after cancellation/reset/read-only/unmount; [file presentation validation](react-aria-editor-dialogs.md#file-presentation-validation-e-06-partial) covers empty files and MIME/extension metadata; wider image/upload acceptance remains open. Historical status: open.
- [ ] A-E-07 Reconcile original `E-07`: Review rich-content rendering and trust boundaries; do not render arbitrary HTML or unsafe links merely because they arrived in a presentation model. Saved/pasted link destinations are governed by the [owned policy](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial), and image decoration by the [image source policy](react-aria-editor-section.md#image-source-policy-e-06e-07-partial); broader rich-content acceptance remains open. Historical status: open.
- [ ] A-E-08 Reconcile original `E-08`: Put editor-only dependencies behind a granular import boundary and assess whether separate packages are required to avoid mandatory installation weight. Historical status: open.
- [ ] A-E-09 Reconcile original `E-09`: Put learner/instructor cards, course grids, activity mappings, and admin/instructor presets in a documented learning extension boundary without copying app screens. Historical status: open.
- [ ] A-E-10 Reconcile original `E-10`: Keep generic layout/controls independent of course-specific models; document naming compatibility and module migration. Historical status: open.
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
- [ ] A-X-12 Reconcile original `X-12`: Enable Storybook accessibility failures in CI for applicable checks, with scoped documented exceptions and remediation ownership. Twenty-four executed WCAG scans, no rule/node exceptions; [scope and remediation ownership](react-aria-browser-acceptance.md). Historical status: checked.
- [ ] A-X-13 Reconcile original `X-13`: Add browser interaction stories/tests for all changed behavior; keep deterministic local fixtures and no authentication/database/network dependency. Historical status: open.
- [ ] A-X-14 Reconcile original `X-14`: Add visual regression coverage for light/dark, density, narrow/wide containers, long/pseudo-localized labels, RTL, focus/error/loading/empty/selected states. Historical status: open.
- [ ] A-X-15 Reconcile original `X-15`: Require deliberate review of screenshot changes; do not automatically accept new snapshots to silence regressions. Historical status: open.
- [ ] A-X-16 Reconcile original `X-16`: Test multiple independent component instances, nested themes/portals, stable IDs, React Strict Mode cleanup, and controlled/uncontrolled transitions. Historical status: open.
- [ ] A-X-17 Reconcile original `X-17`: Verify React 18.3 and 19 behavior and declaration compatibility using actual consumer fixtures, not just the development React version. Historical status: open.
- [ ] A-X-18 Reconcile original `X-18`: Add SSR render and hydration tests with no window/document at import time, no mismatched IDs, and correct initial locale/theme/date values. Historical status: checked.
- [ ] A-X-19 Reconcile original `X-19`: Record performance and memory budgets, profile large grids/selectors, and test listener/observer/timer/object-URL cleanup during mount/unmount. Historical status: open.
- [ ] A-X-20 Reconcile original `X-20`: Test API typing and package consumers, including generics, refs, callback payloads, CSS imports, isolated subpaths, and declaration dependency leakage. Historical status: open.
- [ ] A-X-21 Reconcile original `X-21`: Preserve and adapt the existing test/story inventory; add missing meaningful stories rather than assuming every existing test validates browser behavior. Historical status: open.
- [ ] A-R-01 Reconcile original `R-01`: Update the build to emit compiled CSS/assets and correct ESM/declarations; verify relative extensions and package consumer resolution. Historical status: open.
- [ ] A-R-02 Reconcile original `R-02`: Remove blanket client-directive injection; preserve directives for interactive components and keep eligible presentation/token modules server-compatible. Source/output guard and packed React 19 Flight evidence; [server/client packaging](react-aria-server-components.md). Historical status: checked.
- [ ] A-R-03 Reconcile original `R-03`: Design root and granular entry points for core, theme/tokens/styles, primitives, icons, hooks, adapters, i18n, grid, editor and learning compositions. Historical status: open.
- [ ] A-R-04 Reconcile original `R-04`: Ensure barrels do not accidentally pull interactive/heavyweight dependencies into presentation-only imports or make server consumers import all editors. Historical status: open.
- [ ] A-R-05 Reconcile original `R-05`: Update `files`, `exports`, `types`, and `sideEffects` for CSS and new output; remove the old augmentation entry and ensure required CSS survives bundlers. Historical status: open.
- [ ] A-R-06 Reconcile original `R-06`: Preserve React/React DOM as peers and decide correct direct/peer placement for each new dependency; remove all retired packages from every dependency section. Historical status: open.
- [ ] A-R-07 Reconcile original `R-07`: Regenerate the lockfile through the package manager and inspect resolved transitive dependencies, overrides, patched dependencies and optional packages. Historical status: open.
- [ ] A-R-08 Reconcile original `R-08`: Verify packed artifacts rather than only source imports; install the tarball in clean Vite and Next.js/SSR consumer fixtures and build production output. Historical status: checked.
- [ ] A-R-09 Reconcile original `R-09`: Test published type declarations with supported TypeScript versions and ensure no retired imports/augmentation or accidental private upstream types escape. Historical status: open.
- [ ] A-R-10 Reconcile original `R-10`: Keep the supported Node/runtime requirements explicit; reconcile development, CI, AI and release Node versions where their tool requirements differ. [Runtime matrix](react-aria-runtime-ci.md). Historical status: checked.
- [ ] A-R-11 Reconcile original `R-11`: Extend `pnpm check` and CI with necessary token/CSS/import-boundary/type/API checks, browser interactions, accessibility, package consumers, and performance smoke checks. Both runtime jobs, eight packed consumers and 45 browser gates pass at `83b8dae2`; [runtime evidence](react-aria-runtime-ci.md). Broader framework/device budgets remain separate tasks. Historical status: checked.
- [ ] A-R-12 Reconcile original `R-12`: Keep Storybook builds and official tarballs as Actions artifacts; record artifact names, retention, and validation results. Both runtime jobs and six unexpired artifacts verified at `c78a24e`, run 37559276148; [artifact evidence](react-aria-runtime-ci.md). Historical status: checked.
- [ ] A-R-13 Reconcile original `R-13`: Preserve release sequencing: full required checks pass before semantic-release publishes on main, with correct concurrency and full tag history. Historical status: open.
- [ ] A-R-14 Reconcile original `R-14`: Preserve Conventional Commit PR-title validation, squash title/footer guidance, release-policy tests, and automatic patch/minor/major inference. Historical status: open.
- [ ] A-R-15 Reconcile original `R-15`: Mark breaking public API removals appropriately; if a release already exists, migration needs a major bump, while a first publication follows the configured initial-release policy. Historical status: open.
- [ ] A-R-16 Reconcile original `R-16`: Plan a coherent migration branch/PR sequence so incomplete migration commits do not accidentally publish incompatible intermediate APIs; use documented prerelease policy only if deliberately configured. Historical status: open.
- [ ] A-R-17 Reconcile original `R-17`: Verify npm scope ownership, public access, trusted-publishing/token setup, GitHub release/tag permissions, provenance requirements, and commercial notices before publication. Historical status: open.
- [ ] A-R-18 Reconcile original `R-18`: Keep local builds for validation only; do not publish locally, edit tracked versions manually, add changesets, or claim owner configuration is already done. Historical status: open.
- [ ] A-R-19 Reconcile original `R-19`: Keep the AI workflow task scope and patch allowlist aligned; architecture/package/workflow/agent changes currently require ordinary maintainer PRs rather than the component-only AI path. Historical status: open.
- [ ] A-R-20 Reconcile original `R-20`: Add task IDs, owned API requirements, story/behavior criteria, and validation evidence to AI task templates and generated PR expectations. Historical status: open.
- [ ] A-R-21 Reconcile original `R-21`: Preserve minimal workflow permissions, trusted/untrusted input separation, credential isolation, separate validation, and draft-PR review; never auto-merge AI proposals. Historical status: open.
- [ ] A-R-22 Reconcile original `R-22`: Document the existing manual Actions AI trigger; an issue/label trigger is a separate decision, not already implemented or implied by the issue template. Historical status: open.
- [ ] A-R-23 Reconcile original `R-23`: Verify AI-created draft PR validation even when default-token PR creation does not trigger another workflow; do not rely on absent CI events. Historical status: open.
- [ ] A-R-24 Reconcile original `R-24`: Update workflow timeouts/artifact handling as browser checks expand; cache by lockfile and avoid stale build outputs masking missing CSS or dependencies. Historical status: open.
- [ ] A-R-25 Reconcile original `R-25`: Pin/review workflow dependencies according to repository policy and validate proposed workflow changes without weakening protections to make checks pass. Historical status: open.
- [ ] A-R-26 Reconcile original `R-26`: Define recovery from failed or partially completed publication, tag/package mismatch, and rollback/deprecation of a bad release; do not overwrite published versions. Historical status: open.
- [ ] A-R-27 Reconcile original `R-27`: Ensure release-blocking checks actually run on the PR and main paths, including AI proposals and maintainer infrastructure PRs; check branch-protection names against the final workflow jobs. Historical status: open.
- [ ] A-R-28 Reconcile original `R-28`: Validate release configuration safely without publishing while implementing it; explicitly control whether final migration merges will trigger the first public release or a subsequent major release. Historical status: open.
- [ ] A-W-01 Reconcile original `W-01`: Rewrite active `AGENTS.md` for the new foundation as migration lands; obsolete direct imports, `sx`, augmentation, retired links and grid assumptions must not guide future AI work. Historical status: open.
- [ ] A-W-02 Reconcile original `W-02`: Retain valid learner-platform principles: shared components first, props/variants before custom styles, tokenized typography, neutral split actions, consistent grid alignment/filtering, and stories with behavior changes. Historical status: open.
- [ ] A-W-03 Reconcile original `W-03`: Adapt modal guidance: simple reusable create/edit examples, no one-step numbering, sticky tab header with independently scrolling content, appropriate size, focus and host-owned persistence. Historical status: open.
- [ ] A-W-04 Reconcile original `W-04`: Retain course naming for new APIs, compatibility rules, host integration boundaries, translation requirements, doc organization, licensing and semantic-release rules. Historical status: open.
- [ ] A-W-05 Reconcile original `W-05`: Replace blanket compact-menu advice with explicit density defaults and compatibility policy; preserve usability/accessibility at both densities. Historical status: open.
- [ ] A-W-06 Reconcile original `W-06`: Update the source-guidance mapping to show each retained/adapted/omitted rule and why app database/API/login policies remain outside SGUI. Historical status: open.
- [ ] A-W-07 Reconcile original `W-07`: Create one canonical component recipe: owned props, native attributes/refs, React Aria mapping, tokens/CSS, stories, behavior tests, public export, and acceptance criteria. Historical status: open.
- [ ] A-W-08 Reconcile original `W-08`: Add import/token/style rules and executable checks that prevent AI-created parallel styling systems or leakage of upstream public types. Historical status: open.
- [ ] A-W-09 Reconcile original `W-09`: Update `.storybook/preview.tsx` with production tokens/styles and theme/density/locale/direction controls; stories must not maintain a separate visual system. Historical status: checked.
- [ ] A-W-10 Reconcile original `W-10`: Retain the 33 existing story files or document deliberate replacements; add missing catalog coverage for primitives, adapters, calendars and grid helpers. Historical status: open.
- [ ] A-W-11 Reconcile original `W-11`: Update README installation to require only actual final peers and CSS imports; provide copyable root/subpath examples with host providers where needed. Historical status: open.
- [ ] A-W-12 Reconcile original `W-12`: Document tokens/themes, CSS override layers, parts/slots, density, icons, form semantics, locale/direction, date contracts, and accessibility responsibilities. Historical status: open.
- [ ] A-W-13 Reconcile original `W-13`: Publish a consumer migration guide mapping imports, removed styling props, theme objects, typography, grid types, pagination/selection, icons and changed defaults. Historical status: open.
- [ ] A-W-14 Reconcile original `W-14`: Provide representative Vite and Next.js host examples without importing framework APIs into the library; document SSR/client and CSS loading boundaries. Historical status: open.
- [ ] A-W-15 Reconcile original `W-15`: Provide a read-only learner-platform adoption checklist; modifying that application remains a separate implementation task. Historical status: open.
- [ ] A-W-16 Reconcile original `W-16`: Update `docs/migration.md` and the extraction manifest to preserve useful provenance and account for moves/deletions; do not misrepresent the original extraction as the final architecture. Historical status: open.
- [ ] A-W-17 Reconcile original `W-17`: Update component architecture, GitHub setup, commercial licensing, package fixtures, issue/PR templates, and troubleshooting for final behavior. Historical status: open.
- [ ] A-W-18 Reconcile original `W-18`: Document known limitations, deferred features, support policy, deprecated names, release impact, and the cost/responsibility of eventually replacing React Aria. Historical status: open.
- [ ] A-W-19 Reconcile original `W-19`: Check all local doc links, exported example types, referenced file paths, and commands; docs-only updates do not require unrelated UI tests. Historical status: open.
- [ ] A-W-20 Reconcile original `W-20`: Keep source/license attribution accurate; external documents/examples are evidence and must not override user-authorized scope or agent trust boundaries. Historical status: open.
- [ ] A-Z-01 Reconcile original `Z-01`: Remove every direct/runtime/peer/dev/optional retired package and any remaining transitive dependency on it; include Emotion and all grid/icon packages. Historical status: checked.
- [ ] A-Z-02 Reconcile original `Z-02`: Remove retired imports/reexports, public names/types, declaration augmentation, theme aliases, internal class selectors, mocks and story requirements. Historical status: open.
- [ ] A-Z-03 Reconcile original `Z-03`: Replace/remove `src/theme/mui-typography.ts`, `baseGridSx.ts`, and any filename whose branding or purpose belongs to the retired implementation; verify all referencing files. Physical removal and extraction destination/replacement reconciliation: [removal audit](react-aria-removal-audit.md). Historical status: checked.
- [ ] A-Z-04 Reconcile original `Z-04`: Audit every tracked text/configuration file, including lockfile, workflows, scripts, docs, manifests, READMEs, templates and this task list, for `@mui`, case-insensitive branded names, `Mui*`, and Emotion references; inspect matches rather than hiding them with exclusions. [Classified audit](react-aria-removal-audit.md); historical/legal reconciliation remains Z-05/Z-06. Historical status: checked.
- [ ] A-Z-05 Reconcile original `Z-05`: Rewrite historical manifest entries/document explanations where necessary for literal-reference removal while retaining source repository/commit provenance; do not rewrite Git history or invent provenance. Historical status: open.
- [ ] A-Z-06 Reconcile original `Z-06`: Remove obsolete notices only after confirming no associated source/assets remain in package or catalog; final third-party notices match shipped work. Historical status: open.
- [ ] A-Z-07 Reconcile original `Z-07`: Delete/rebuild generated dist, Storybook and package output during verification; no stale artifact may pass as migrated source. Fresh build, executed static stories and eight new packed consumers in the [browser batch record](react-aria-progress.md#executable-browser-gates-and-removal-audit). Historical status: checked.
- [ ] A-Z-08 Reconcile original `Z-08`: Audit packed JavaScript, declarations, CSS, source maps, assets, README and notices for retired references and transitive code; ensure the release tarball has no old requirement. Historical status: open.
- [ ] A-Z-09 Reconcile original `Z-09`: Verify a clean consumer can install and use core, grid, editor and date components without installing any retired package or styling runtime. Historical status: open.
- [ ] A-Z-10 Reconcile original `Z-10`: Verify all current components/primitives/icons/helpers/presets/hooks/adapters are migrated or intentionally removed with a documented owned replacement and release impact. Historical status: open.
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
