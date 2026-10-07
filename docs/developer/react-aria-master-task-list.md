# SGUI React Aria migration: master task list

Status: in progress; owned control coverage and first catalog migrations implemented.
See the [execution record](react-aria-progress.md) for evidence and remaining gates.
Prepared: 2026-10-05. Source: the full SGUI planning conversation, the current
SGUI checkout, and the learner platform UI guidance.

This is the execution backlog for turning the extracted UI into an independent,
commercial React design system. An unchecked item is work to do, not a claim that
the capability already exists. Mark an item complete only with reviewable evidence.
This document does not authorize publishing, changing commercial terms, or
modifying the learner platform checkout.

## 1. Accepted direction and boundaries

- React Aria Components is the chosen primary interaction foundation. Use its
  lower-level hooks when component composition cannot meet a demonstrated need.
  This is an implementation dependency, not SGUI's public API or visual identity.
- SGUI owns its component APIs, design tokens, styles, compositions, documentation,
  and observable behavior. It must be possible to replace the foundation later.
- Remove the entire existing MUI foundation: Material components, X DataGrid,
  icons, Emotion, augmentation, public type coupling, styling selectors, tests,
  stories, consumer requirements, and obsolete guidance. The grid may migrate
  last, but keeping it indefinitely is not an acceptable completion state.
- Use compiled CSS Modules and CSS custom properties as the default. Tailwind,
  Sass, a runtime styling engine, or a typed CSS authoring tool is not required of
  consumers. Additional tooling needs a documented benefit before adoption.
- Select the advanced table/grid engine separately. React Aria is not presumed to
  replace every grid feature, and combining engines is not presumed effortless.
- UI library only: do not move application screens, APIs, database models, session
  storage, authentication flows, or platform contracts into SGUI.
- Preserve routing, translation, and account adapters and host-owned data fetching.
- React is the current supported framework. Multi-framework packages are a future
  decision, not an automatic consequence of using headless primitives.
- Publish `@structured-growth/sg-ui` publicly on npm under the existing commercial
  license requirements. Public distribution does not grant a free-use license.
- GitHub Actions produces official builds and releases. semantic-release uses
  Conventional Commits; no manually authored changesets or version bumps.
- AI-generated changes are reviewable draft PRs. Do not automatically merge them.

Alternatives researched were Base UI, Ark UI/Zag, Radix, Headless UI, Mantine, and
shadcn/ui. They are comparison evidence, not approved additional foundations.
React-specific APIs do not prove superior performance; measure actual workloads.

## 2. How to execute and maintain this backlog

Task IDs are stable. Split a task into linked subtasks if a PR cannot review it
comfortably. Record owner, status, PR/commit, dependencies, and validation evidence
in the execution issue or a linked progress record. `[Decision]` means resolve and
record a technical/product choice; it does not mean pause automatically for approval.
`[Future]` is an explicitly deferred feature, not a blocker for removing the old
foundation. Do not represent a deferred feature as shipped.

| Phase | Task group | Depends on | Exit evidence |
| --- | --- | --- | --- |
| Baseline | B | None | Inventory, API snapshot, behavior and visual baseline |
| Architecture | A, L | Baseline | Owned contracts, dependency and licensing decisions |
| Foundations | D, C, I, H | Architecture | Tokens, CSS pipeline, icons, host integration |
| Proof | P | Foundations sufficient for prototypes | Calendar/form/table findings and engine decision |
| Controls | U | Proof and foundations | Replacement primitives and public contracts |
| Existing UI | M, E | Required replacement controls | Every extracted component accounted for |
| Grid | G | Grid decision and shared controls | Existing behavior parity and selected enhancements |
| Calendar | K | Calendar proof and date contracts | Agreed advanced selector and documented limits |
| Distribution | X, R | Work incrementally; final gate after migration | Package, browser, CI and release verification |
| Documentation | W | Work throughout | Agents, consumer guides, stories and migration instructions |
| Completion | Z | All required tasks; future tasks dispositioned | Strict removal audit and final review |

Work on tests, stories, documentation, licensing, and performance within each
implementation PR. Do not leave them all until the end. Migration-only changes and
optional new product features should remain distinguishable in PRs and release notes.

For every implementation task, completion evidence includes the changed public
contract (or confirmation that it is preserved), the resulting implementation,
relevant stories and behavioral checks, package/type validation when applicable,
consumer migration notes, and any known limitation. Use small reviewable PRs;
do not defer all public API decisions to a final cleanup PR.

The first execution milestone is B-01 through B-14 and A-01 through A-19, followed
by enough D/C/I/H work to run P-01 through P-11. Do not perform a mass import
replacement before those proofs establish the contracts and grid strategy.

## 3. Repository baseline and migration inventory

Observed in this checkout: 216 files under `src`, 129 implementation TypeScript
files excluding stories/tests, 33 story files, and 54 test files. 54 implementation
files contain an old-foundation import or reference. There are 37 directories in
`src/components`, including the story-only Typefaces directory, icons, and primitives.
Counts are a planning snapshot, not a future completion metric.

Important coupling points: `package.json`, `pnpm-lock.yaml`, `src/theme`, public
barrels, primitive/icon reexports, `AppButtonProps`, modal styling/close types,
`AppDataGridColumn`, grid selection/pagination types, `baseGridSx.ts`, row-drag DOM
selectors, story decorators, test mocks, and the built-package consumer fixture.
`scripts/build.mjs` currently prefixes every built JavaScript module with a client
directive. `AppThemeProvider` currently installs a global baseline stylesheet.

- [x] B-01 Capture current Git status, relevant release tags, package metadata, and public exports without discarding existing work.
- [x] B-02 Read `AGENTS.md`, `README.md`, `docs/migration.md`, `docs/developer/component-architecture.md`, and `docs/agent-guidance-migration.md` before architecture changes.
- [ ] B-03 Inventory dependency imports, transitive dependencies, public declarations, class names, DOM assumptions, augmentation, and generated artifacts; include hidden configuration files.
- [ ] B-04 Inventory all primitive exports and all icons, including direct icon imports that are not present in the public icon barrel.
- [ ] B-05 Snapshot public props, callbacks, models, defaults, subpaths, and deprecations; identify changes that are actually breaking.
- [x] B-06 Baseline existing unit/package/release-policy checks and Storybook build; record pre-existing failures separately.
- [ ] B-07 Capture representative screenshots and browser interactions for light/dark UI, compact/comfortable controls, editors, navigation, modals, and grids.
- [ ] B-08 Record current grid behavior, including selection across pages, sorting, filtering, column visibility, row drag, card mode, and server callbacks.
- [ ] B-09 Audit focus removal, hover-only triggers, drag-only interactions, labels, contrast, and sticky content; document findings without claiming a conformance audit from source inspection alone.
- [ ] B-10 Measure production consumer bundles, CSS, editor/grid imports, initial render, and interactive updates with reproducible fixtures.
- [ ] B-11 Record browser, React, TypeScript, Node, bundler, SSR, and React Server Component support promises separately; maintain current React 18.3/19 support unless evidence justifies a documented change.
- [ ] B-12 Review the extraction manifest against actual files so helpers, model presets, nodes/plugins, fixtures, and tests are not lost when directories move.
- [ ] B-13 Inventory storage keys, persisted schema shapes, locale/date behavior, and error states that consumers rely on.
- [x] B-14 Keep the learner platform unchanged; collect reference behavior and source provenance read-only.

## 4. Architecture, public API ownership, and replaceability

- [x] A-01 Write an architecture decision record for React Aria, compiled CSS, the owned public API, specialist engines, and the reasons alternatives were not selected.
- [ ] A-02 Establish layers: tokens/styles; native presentation primitives; interaction primitives; composed UI; optional grid/editor/learning extensions; host adapters.
- [ ] A-03 Define one-way dependency boundaries; prevent root-barrel imports from internal implementations and prevent circular imports.
- [ ] A-04 Keep React Aria imports inside the interaction implementation layer; consumers and higher-level compositions use SGUI contracts.
- [ ] A-05 Define SGUI-owned props instead of extending or aliasing all upstream props wholesale; selectively map native HTML attributes and ref behavior.
- [ ] A-06 Standardize controlled/uncontrolled pairs, defaults, change callbacks, null/empty semantics, disabled/read-only/loading behavior, and stable IDs.
- [ ] A-07 Specify native click versus normalized press semantics without surprising consumers; prevent duplicate callback invocation and document keyboard/touch activation.
- [ ] A-08 Define public variant, size, tone, density, placement, dismissal-reason, and validation contracts independently of any foundation.
- [ ] A-09 Define accessible naming and description requirements for icon-only and compound controls; choose typed requirements where practical.
- [ ] A-10 Define composition and escape hatches: supported slots/parts, render callbacks, refs, `className`/part classes, CSS variables, and native `style` where needed.
- [ ] A-11 Avoid exposing upstream collection/state objects, date object classes, grid column types, or unstable event payloads without an explicit reviewed contract.
- [ ] A-12 Preserve useful existing `App*` exports where possible; do not invent a wholesale `SG*` rename merely because examples used that prefix.
- [ ] A-13 Replace explicitly branded public exports such as `MuiLink`; document their owned replacement and migration since the final API must contain no retired branding.
- [ ] A-14 Preserve Class-prefixed compatibility names when possible; use Course naming for new learning APIs and document intentional removals as breaking.
- [ ] A-15 Create old-to-new API mappings for theme objects, typography, styling props, modal callbacks, selection, columns, and pagination.
- [ ] A-16 Keep replacement implementations swappable behind observable behavior tests; do not promise a later rewrite will be cost-free or entirely nonbreaking.
- [ ] A-17 Define extension points for advanced components without placing backend scheduling, booking, permission, or account logic inside UI controls.
- [ ] A-18 Keep heavyweight modules out of basic-control dependency paths; decide which require separate subpaths versus separate packages.
- [x] A-19 Document package dependency placement, supported versions, upgrade policy, and deduplication requirements for React Aria and date utilities.
- [ ] A-20 [Future] Document how tokens/CSS and framework-independent models could be shared with other frameworks; require separate wrappers, tests, and support policy before claiming such support.

## 5. Licensing and dependency governance

- [ ] L-01 Verify the selected versions' actual licenses, including React Aria Components, hooks/state/date utilities, icon assets, grid engine, editor packages, and transitive distributed code.
- [ ] L-02 Preserve Apache 2.0 licenses and applicable notices; record modifications where required if upstream code is copied or changed rather than merely depended on.
- [ ] L-03 Preserve SGUI's commercial-license requirement and distinguish SGUI-owned work from upstream open-source work; do not impose exclusive SGUI terms on independently licensed dependencies.
- [ ] L-04 Refresh `THIRD_PARTY_NOTICES.md` from the final shipped dependency and asset inventory; remove a retired notice only after its code/assets are no longer distributed.
- [ ] L-05 Avoid replacing icon imports with copied assets that retain the retired dependency or its licensing obligations unnoticed.
- [ ] L-06 Record grid Community/Enterprise and redistribution implications before selecting an engine; no paid feature dependency is silently assumed.
- [ ] L-07 Keep the commercial agreement's legal identity, permitted distribution, support, and other unresolved business terms on the existing pre-publication legal-review checklist.
- [ ] L-08 Add a repeatable dependency/license inventory check and assign ownership for updates; avoid automatically rewriting commercial terms.
- [ ] L-09 Document dependency support/security update expectations and a deliberate upgrade process with behavioral regression checks.

## 6. Design tokens and visual foundations

- [x] D-01 Create one reviewable token source using a documented schema compatible with the Design Tokens Community Group format where appropriate.
- [ ] D-02 Separate base palette/scale tokens, semantic roles, and component-specific tokens; use aliases rather than duplicating values.
- [x] D-03 Generate CSS custom properties and typed references from that source with deterministic output and validation.
- [ ] D-04 Define semantic colors for surfaces, raised/overlay surfaces, text, borders, separators, primary/neutral/destructive actions, selected/hover/pressed states, validation, and focus.
- [ ] D-05 Define coordinated light/dark themes; validate readable states rather than mechanically inverting colors.
- [ ] D-06 Define a consistent spacing, sizing, radius, elevation, border, icon, and motion scale; reconcile the current differing button/card radii intentionally.
- [ ] D-07 Define heading, body, label, caption, table, and code typography roles, including a replacement for `bodyAlt2`; consumers must not need module augmentation.
- [ ] D-08 Document semantic HTML independently of typography appearance; visual heading size must not determine document heading level.
- [ ] D-09 Use rem-based text sizing and layouts that tolerate zoom, text spacing changes, long labels, and font substitution.
- [ ] D-10 Retain a deliberate Geist/system font strategy; do not download fonts at runtime or require a licensed asset without documenting it.
- [ ] D-11 Define compact and comfortable density, independently of brand/color theme; preserve legacy compact menus through an explicit compatibility default while documenting the new general default.
- [ ] D-12 Make important touch controls comfortably operable; density must not erase minimum hit areas or keyboard focus indicators.
- [ ] D-13 Define neutral split actions with shared border/divider and readable theme-aware primary text; define filled emphasis for contexts that genuinely need it.
- [ ] D-14 Define primary/subpage surface hierarchy, card hierarchy, and overlay elevation through semantic tokens.
- [ ] D-15 Design complete hover, focus, pressed, selected, disabled, read-only, invalid, pending, empty, loading, and error states; never rely on color alone for meaning.
- [ ] D-16 Define scoped theme/density roots and nested overrides; ensure portaled overlays receive the correct scope and variables.
- [ ] D-17 Specify explicit light/dark/system settings, initial server theme, `color-scheme`, and hydration behavior without unwanted flashes or browser-global assumptions.
- [ ] D-18 Support reduced motion and forced-colors/high-contrast environments; avoid suppressing essential system indications.
- [ ] D-19 Validate token references, names, types, aliases, cycles, and contrast combinations in CI; do not imply generated palettes automatically satisfy contrast.
- [ ] D-20 Publish foundation stories for palettes, typography, spacing, density, surfaces, focus, and motion, all consuming production tokens.
- [ ] D-21 [Future] Define a token-to-design-tool export workflow if Figma integration is introduced; no parallel manually maintained palette.

## 7. Modern CSS and styling pipeline

- [x] C-01 Add a build pipeline that compiles colocated CSS Modules and emits browser-ready CSS with source maps where appropriate.
- [x] C-02 Choose/document stylesheet entry points and import order; provide a basic installation example that requires no consumer Tailwind/PostCSS configuration.
- [ ] C-03 Use CSS variables for themes and dynamic values, variant/state attributes for predictable states, and supported part hooks for customization.
- [ ] C-04 Replace `sx`, `paperSx`, theme callbacks, object-style overrides, and retired DOM selectors with owned contracts and component styles; map each removed public styling prop.
- [x] C-05 Define a named, namespaced library cascade layer and low-specificity selectors; document unlayered consumer override behavior and important-declaration caveats.
- [x] C-06 Make a global reset optional; scope necessary component normalization and do not change host body, links, buttons, or typography merely by importing SGUI.
- [x] C-07 Document stylesheet composition across library themes, components, utilities, and consumer overrides; avoid escalating specificity or routine `!important`.
- [ ] C-08 Use container size queries for reusable card, toolbar, navigation, and modal compositions; choose/document containment boundaries so consumers know what supplies the container.
- [ ] C-09 Use logical properties and direction-aware icons/placement for RTL; do not assume physical left/right always means start/end.
- [ ] C-10 Prefer Grid/Flexbox over JavaScript layout measurement; reserve observers/measurement for demonstrated interaction or virtualization needs and clean them up.
- [ ] C-11 Use native nesting with documented tooling/browser support; keep selector depth shallow and component ownership obvious.
- [ ] C-12 Use fluid sizing such as `clamp` where beneficial without preventing text zoom; establish mobile/reflow fallbacks.
- [ ] C-13 Evaluate `color-mix`/OKLCH for palette tooling and state derivation; preserve tested fallback/contrast behavior for supported browsers.
- [ ] C-14 Define progressive enhancement with `@supports`; do not adopt limited-support anchor positioning, style queries, or transitions as unconditional dependencies.
- [ ] C-15 Use `:focus-visible` or owned accessible focus-state attributes; preserve visible focus when replacing current outline suppression.
- [ ] C-16 Define reduced-motion transitions, interruption/cancellation behavior, and focus timing; no motion runtime is added solely for simple CSS transitions.
- [ ] C-17 Specify overlay stacking/portal ownership rather than maximum-integer z-index values; test nested dialog/menu/tooltip/editor overlays.
- [ ] C-18 Add CSS and token lint rules that catch retired selectors, accidental global rules, ad hoc typography, and unsupported token references.
- [ ] C-19 Verify CSP behavior, including unavoidable inline styles for placement/dynamic values; do not claim strict CSP support without testing.
- [ ] C-20 Verify compiled CSS distribution, consumer production builds, stylesheet deduplication, and tree-shaking behavior; CSS must not be removed as a false side effect.
- [x] C-21 [Decision] Keep CSS Modules as the default; adopt vanilla-extract or utility authoring only for an evidenced benefit and without imposing its toolchain on consumers.

## 8. Icon system

- [x] I-01 Select an independently licensed SVG source or owned vector set with full coverage of the current library's symbols and editor controls.
- [x] I-02 Map every direct import and public icon export to a replacement, including account/logout, arrows, calendar, filters, status, editor formatting, undo/redo, and activity symbols.
- [x] I-03 Define SGUI-owned icon props for size, stroke/fill, current color, class/style hooks, decorative versus meaningful use, and ref behavior where needed.
- [x] I-04 Keep icons individually importable; avoid pulling an entire icon catalog into basic components.
- [ ] I-05 Establish consistent optical size, weight, alignment, RTL mirroring policy, and theme contrast.
- [x] I-06 Make decorative icons hidden from assistive technology and require meaningful names at the appropriate control level.
- [ ] I-07 Replace the activity-type icon map while preserving known/unknown fallbacks and consumer override options.
- [ ] I-08 Add icon catalog, accessibility, and bundle checks; update notices for all shipped vector assets.

## 9. Host adapters, translations, dates, and persistence

- [ ] H-01 Preserve native-anchor fallback, custom router links, pathname tracking, navigation replace behavior, refs, and forwarded attributes.
- [ ] H-02 Verify modifier clicks, downloads, external links, targets, default prevention, and navigation callback ordering through browser tests.
- [ ] H-03 Integrate React Aria routing where needed behind the existing host adapter; avoid two competing navigation systems or a runtime Next.js dependency.
- [ ] H-04 Preserve account/organization/logout callback boundaries; no credentials, platform fetches, or implicit session refresh enter SGUI.
- [ ] H-05 Define pending/error handling for asynchronous host actions without duplicating requests or swallowing useful errors.
- [ ] H-06 Connect host locale/direction settings to React Aria internationalization; avoid different locales in controls, SGUI strings, and date formatting.
- [ ] H-07 Preserve translation keys, mandatory `defaultMessage`, interpolation values, namespace awareness, and deterministic English fallback.
- [ ] H-08 Validate ICU variables, pluralization, selection counts, date/number formatting, long labels, RTL, and pseudo-localized stories.
- [ ] H-09 Keep supported-language policy, database overrides, caching/invalidation, audit metadata, and diagnostic logging host-owned.
- [ ] H-10 Define serializable owned date-only, local date-time, and zoned instant contracts; do not collapse all values into JavaScript `Date` or leak date-library classes casually.
- [ ] H-11 Specify time zones, daylight-saving transitions, locale calendar display, parsing, invalid inputs, serialization, and round-trip behavior.
- [ ] H-12 Preserve due-date formatting and missing/invalid value fallbacks; test midnight, timezone, and localization boundaries.
- [ ] H-13 Make persistence opt-in/configurable with distinct keys per view; document ownership, schema versioning, migration/reset, and sensitive-data restrictions.
- [ ] H-14 Validate stored data and support SSR, blocked storage, quota failures, malformed JSON, key changes, cross-tab updates, and a working in-memory fallback.
- [ ] H-15 Remove the pagination helper's inherited page-size cap unless it is deliberately part of SGUI policy; define supported sizes through owned configuration and test normalization.
- [ ] H-16 Ensure filters/page-size changes reset or clamp pages coherently, including unknown row counts and disappearing rows.
- [ ] H-17 Preserve independent view state for tabs/card/grid views; avoid leaking selection, sort, or filter state between unrelated instances.

## 10. Proof-of-concept and selection gates

- [x] P-01 Build a representative styled button and labeled field using the intended tokens, owned contracts, CSS output, and focus behavior.
- [x] P-02 Build a dialog containing validation, tabs, a combobox, and a nested popover; test focus entry/restoration, Escape, dismissal, and scrolling.
- [x] P-03 Build an asynchronous searchable multi-select using host-supplied loading/results; test cancellation, empty/error states, long lists, and keyboard behavior.
- [x] P-04 Build the advanced date selector with presets, multi-month range, unavailable dates, Apply/Cancel, locale/direction, and timezone-aware examples.
- [x] P-05 Identify requirements that React Aria's standard Calendar/RangeCalendar does not supply directly, such as arbitrary multiple-date or fiscal-period selection; test lower-level composition rather than assuming support.
- [x] P-06 Compare candidate grid foundations against a concrete parity checklist using selection, server pagination, multiple sorting/filter rules, column visibility, resizing, actions, and row reordering.
- [ ] P-07 Include keyboard, screen-reader, zoom, touch, dark theme, reduced-motion, SSR/hydration, and production bundle checks in prototype findings.
- [ ] P-08 Set reproducible performance budgets from baseline and representative consumer hardware; do not invent universal speed or size rankings.
- [x] P-09 [Decision] Record the grid engine and which layer owns data state, rendering, focus, virtualization, and drag; assign one authoritative owner for each state domain.
- [x] P-10 [Decision] Keep React Aria as the primary foundation unless a demonstrated blocker warrants a recorded exception; no second general primitive system is added speculatively.
- [ ] P-11 Document prototype outcomes, API changes, limitations, and accessibility gaps; do not call prototype completion a production feature release.

## 11. Owned replacement primitives and interaction standards

Every replacement needs owned props, semantic HTML, state coverage, refs where
appropriate, production styles, a story, and meaningful behavior verification.
Native HTML/CSS is preferable for presentation-only primitives; not every element
needs a React Aria wrapper.

- [ ] U-01 Implement Button, IconButton, split action, and button groups with loading, disabled, form type, link/action distinction, and focus behavior.
- [ ] U-02 Implement Box/container, Stack, surface/Paper, card/content, separator/Divider, and responsive layout primitives with scoped styles.
- [x] U-03 Implement Text/Typography with semantic element selection and all required typography roles.
- [ ] U-04 Implement TextField, input base, labels, descriptions, validation errors, required state, textarea, and grouped fields with correct associations.
- [ ] U-05 Implement Checkbox, mixed state, Switch, RadioGroup, and label composition; document keyboard and form-submission semantics.
- [ ] U-06 Implement Select and searchable ComboBox/Autocomplete; define value identity, filtering ownership, empty/loading/error, multiple selection where required, and disabled options.
- [ ] U-07 Implement Menu/MenuItem, submenus when required, Popover, and Tooltip; distinguish menu commands from arbitrary form content in a popover.
- [ ] U-08 Implement dialog primitives and modal composition with title/description, dismissal reasons, initial/return focus, scroll locking, background interaction handling, and nested overlays.
- [ ] U-09 Implement Tabs with correct roles, panels, orientation, activation mode, disabled tabs, focus visibility, and overflow behavior.
- [ ] U-10 Implement owned Link/Breadcrumbs with host navigation integration and meaningful external-link behavior.
- [x] U-11 Implement List/list items, navigation items, disclosure/Collapse, and selected/expanded state without misusing menu semantics for navigation.
- [x] U-12 Implement Chip/Tag, Badge, and removable tokens with accessible action labels and predictable focus after removal.
- [x] U-13 Implement progress indicators and status messages; distinguish determinate progress from loading and avoid noisy live-region announcements.
- [x] U-14 Implement Avatar/image fallbacks and accessible image labeling; keep sizing and aspect ratio stable while loading.
- [x] U-15 Implement semantic table parts and pagination primitives with owned contracts; do not export an engine's low-level table types as SGUI's entire API.
- [x] U-16 Implement toggle buttons/groups for editor and view-mode controls with pressed state and appropriate single/multiple selection semantics.
- [ ] U-17 Provide consistent focus ring, target size, disabled styling, validation, status announcement, and pointer/keyboard interactions across primitives.
- [ ] U-18 Preserve native form participation, reset behavior, autofill, names/values, and submit behavior; test controlled and uncontrolled variants.
- [ ] U-19 Define overlay collision/placement behavior at narrow widths and browser zoom; preserve theme/locale in portals and avoid clipped popovers.
- [ ] U-20 Make temporary migration shims explicit and internal where possible; remove all shims that depend on the retired foundation before completion.

### Existing primitive reexports to account for

Box, Stack, Typography, TextField, CircularProgress, Checkbox, FormControlLabel,
IconButton, MuiLink, Menu, MenuItem, Select/SelectChangeEvent, Autocomplete, Divider,
Chip, LinearProgress, Switch, List, ListItem, ListItemButton, ListItemText, Table,
TableHead, TableBody, TableRow, TableCell, Collapse, and Tooltip.

Additional directly used controls must also be covered: Avatar, Badge, Breadcrumbs,
Card/CardContent, dialog sections, InputBase, ListItemIcon, Paper, Popover, SvgIcon,
Tab/Tabs, TablePagination, ToggleButton/ToggleButtonGroup, theme hooks, and baseline
normalization. Merely replacing the public primitive barrel does not cover these.

## 12. Existing component-by-component migration

For every row, migrate implementation, public types/exports, styles, helper files,
stories, and behavior tests together. Preserve useful names and behavior except
where the owned contract or accessibility correction explicitly changes them.
Checklist IDs cover all 37 current directories, including catalog-only directories.

| Task | Existing directory | Required migration and acceptance focus |
| --- | --- | --- |
| M-01 | AppButton | Owned button props, variants/tones, native form behavior, press/click mapping |
| M-02 | AppInlineProgress | Progress/status semantics, reduced motion, tokenized label/layout |
| M-03 | AppOperationSteps | State announcements, completed/error/active visuals, hide single-step numbering |
| M-04 | AppPageHeader | Breadcrumbs, actions, metadata, primary/subpage hierarchy, responsive wrapping |
| M-05 | AppPageTabs | Tab/panel wiring, selected/disabled state, density, keyboard/overflow behavior |
| M-06 | AppShell | Landmark/layout semantics, responsive navigation, main-content reflow |
| M-07 | AuthShell | Presentation-only shell, no login flow/session behavior, resilient content sizing |
| M-08 | AppModal | Owned close reasons/size/parts, focus, sticky tabs, scroll, actions and steps |
| M-09 | SideNavigation | Selection/expansion, router/account adapters, organization menu, keyboard and collapse |
| M-10 | ExperiencePageNavigator | Previous/next boundaries, labels, disabled states, link/action semantics |
| M-11 | CardCollectionWithFooter | Responsive/container layout, keys, empty/loading states, pagination integration |
| M-12 | CardPaginationFooter | Owned pagination, labels/counts, disabled boundaries, unknown totals |
| M-13 | ClassCardFrame | Owned surface/spacing, image/content slots, responsive width and constants |
| M-14 | InstructorClassCard | Status/menu/actions, callbacks, long text, date and icon fallbacks |
| M-15 | LearnerClassCard | Progress/due labels/status/actions, translation, accessible interactive regions |
| M-16 | AppDataGrid | Complete owned grid implementation, types and helpers; follow G tasks |
| M-17 | AppDataGridShell | Grid/card modes, shared state, toolbar/footer, responsive shell |
| M-18 | AppDataGridRowDnd | Replace DOM selectors/ghost styling; keyboard/touch/reorder/cancel behavior |
| M-19 | LearnerClassesDataGrid | Owned model/columns, date/link/action cells, host callbacks and state |
| M-20 | DataToolbar | Search, refresh, selection/sort/filter/columns menus, badge, view switching |
| M-21 | DocumentEditorLayout | Tokenized menu/toolbar/content layout and scroll boundaries |
| M-22 | DocumentEditorToolbar | Owned buttons/menus/toggles, formatting state, responsive overflow |
| M-23 | ContentEditorChrome | Menu composition, editor focus, disabled/loading actions, semantic structure |
| M-24 | EditableTitleField | Controlled edit/commit/cancel, keyboard and blur behavior, validation |
| M-25 | FloatingTextSelectionToolbar | Selection anchoring, focus preservation, overlay cleanup, keyboard access |
| M-26 | RichTextFormattingToolbar | All formatting actions, mixed/active/disabled state, Lexical commands |
| M-27 | InsertContentMenuControl | Menu commands and insertion focus, disabled actions and announcements |
| M-28 | TextAlignMenuControl | Alignment/indent commands, active state, direction-aware presentation |
| M-29 | TextColorPickerControl | Foreground/background modes, clear/reset, swatches and accessible color control |
| M-30 | TextStyleMenuControl | Style/typeface options, tokenized labels, selection and focus behavior |
| M-31 | ColumnsLayoutModal | Layout presets, selected state, validation and modal Apply/Cancel |
| M-32 | ImageUploadModal | File selection/preview/errors, host upload callback, image alt text and cancellation |
| M-33 | LinkUrlModal | URL validation, protocol policy, edit/remove and focus restoration |
| M-34 | PageRichTextEditorSection | Editor composition, nodes/plugins, serialization and selection behavior |
| M-35 | Typefaces | Foundation catalog using new theme/tokens and native typography contract |
| M-36 | icons | Complete direct/public icon mapping and activity-type behavior |
| M-37 | primitives | Replace every reexport with an owned implementation/type or documented removal |

Recorded catalog completions ([draft PR #1](https://github.com/Structured-Growth/sg-ui/pull/1), pending review): M-02, M-03, M-24,
M-35, M-11, M-12, M-13, M-14, M-15, M-01, M-04, M-05, M-10, M-06–M-09 and M-31–M-33, M-26–M-30, M-21–M-23, M-25 and M-34.
The [editor section contracts](react-aria-editor-section.md) and
[execution evidence](react-aria-progress.md#page-rich-text-editor-section) cover M-34.
The [editor layout/selection contracts](react-aria-editor-layout.md) and
[execution evidence](react-aria-progress.md#editor-layout-and-floating-selection) cover M-21–M-23/M-25.
The [editor menu contracts](react-aria-editor-menus.md) and
[execution record](react-aria-progress.md#editor-menu-controls) cover M-27–M-30.
The [formatting toolbar contract](react-aria-formatting-toolbar.md) and
[execution record](react-aria-progress.md#rich-text-formatting-toolbar) cover M-26
with colocated/composed tests, package validation and native timing/focus evidence.
The [editor dialog record](react-aria-progress.md#editor-dialogs) and
[dialog contracts](react-aria-editor-dialogs.md) cover the latest batch.
The [modal/shell record](react-aria-progress.md#modal-and-application-shells) and
[consumer mappings](react-aria-modal-shells.md) cover the latest batch.
The [page/action migration record](react-aria-progress.md#page-actions-and-navigation) records the new batch. The [card migration record](react-aria-progress.md#card-pagination-and-course-cards)
links the new card batch evidence. The [execution record](react-aria-progress.md#owned-controls-and-first-catalog-migrations)
links implementation, stories, tests and consumer evidence. The other rows remain
open; M-38 is the final reconciliation of every catalog row, not a completion claim.

- [ ] M-38 Track completion of M-01 through M-37 individually with PR and validation links; do not count a directory as migrated while it still imports a retired primitive transitively.
- [ ] M-39 Migrate `AdminDataGridOptions.ts` and `InstructorDataGridOptions.ts`, including column locks, static enums, filter/sort defaults, and translation labels.
- [ ] M-40 Migrate all grid cells: text, date, date-time, link, copyable, JSON, image, action menu, custom cell, and fallback; preserve escaping and truncation/accessibility behavior.
- [ ] M-41 Migrate grid subheaders, empty/loading overlays, column builders, action-menu builder, toolbar option builder, and header sort menu.
- [ ] M-42 Reconcile root and subpath barrels, `src/models.ts`, fixtures, date helpers, pagination/state hooks, and all inferred exported declaration types.
- [ ] M-43 Update stories importing third-party layout primitives and tests mocking retired modules; behavioral replacements must render real owned components where practical.
- [ ] M-44 Document deliberate UX improvements separately from parity changes; retain regression fixtures for legacy use cases.

## 13. Advanced table and grid work

The chosen foundation must meet SGUI's concrete requirements. React Aria Table
provides interaction building blocks; TanStack Table provides headless table/data
logic; a dedicated grid provides more assembled functionality. None is assumed to
be a drop-in replacement for the extracted grid. Assess licensing, accessibility,
styling, performance, and implementation effort together.

- [ ] G-01 Create a capability matrix with required parity, agreed enhancements, and explicitly deferred spreadsheet/analytics features.
- [ ] G-02 Define owned row IDs, column IDs, accessors, cell renderers, value formatting, action callbacks, row models, and generic typing.
- [ ] G-03 Define controlled/default selection, sort, filters, pagination, visibility, order, width, and expansion; one state owner per concern.
- [ ] G-04 Support client filtering before sorting and pagination; implement stable null/date/number/text semantics with tests.
- [ ] G-05 Support server mode through host callbacks, known/unknown totals, pending/error/refresh states, and stale-request handling examples; the grid does not fetch platform APIs.
- [ ] G-06 Preserve first-column checkboxes, mixed header state, selected count, select-none, and explicit current-page versus all-matching selection semantics.
- [ ] G-07 Preserve selection through sort/filter/page changes according to documented policy; handle disabled/deleted rows and avoid treating unloaded rows as known.
- [ ] G-08 Preserve sort menus, direction indicators, clear sort, priority order, and multi-sort where promised; expose sortable affordances to keyboard/touch as well as hover.
- [ ] G-09 Preserve shared filterFields/filterRules/onFilterRulesChange wiring, supported operators, canonical options, no-rule All semantics, active badge and page reset.
- [ ] G-10 Preserve search, refresh, selected-actions menu, column menu, card/grid switching, and toolbar split-action visual conventions.
- [ ] G-11 Preserve visibility locks for first text/actions columns; distinguish non-hideable columns from actual sticky/pinned columns in API/docs.
- [ ] G-12 Implement width/resizing/order and any agreed pinning behavior with keyboard equivalents; record feature limits instead of exposing inert props.
- [ ] G-13 Keep action menus last; maintain row/cell/link activation without interfering with checkbox, copy, drag, or nested controls.
- [ ] G-14 Keep body text, icons, drag handles and actions vertically aligned through shared styles.
- [ ] G-15 Support empty, no-results, loading, refresh, error, and row-subheader states with appropriate announcements and preserved context.
- [ ] G-16 Define keyboard navigation, tab stops, focus retention after updates, row actions, and table versus interactive-grid semantics based on actual behavior.
- [ ] G-17 Define row reordering for pointer, touch, keyboard and non-drag actions; announce changes, support cancel, and define behavior when sorting/filtering/pagination is active.
- [ ] G-18 Replace native DOM-class queries and ad hoc drag ghosts with owned references/parts and theme-aware previews; clean up listeners and overlays.
- [ ] G-19 Define virtualization responsibilities and row/column overscan only where needed; test variable content, dynamic measurements, focus, screen-reader position metadata, and pinned columns.
- [ ] G-20 Benchmark large row/column counts and frequent updates, including selection and text input; compare production builds against the baseline.
- [ ] G-21 Preserve link adapter semantics, visible focus, copy success/error feedback, escaped JSON/text, date localization, and image fallback behavior in cells.
- [ ] G-22 Test view-state persistence and schema migration for retired grid models; restore defensively and offer reset-to-defaults.
- [ ] G-23 Add grouped headers, expandable rows, or inline editing only if part of the chosen requirement matrix; define edit/commit/cancel/validation contracts before adding them.
- [ ] G-24 [Future] Record export/import, aggregation/pivoting, tree data, range selection, clipboard paste, formulas, undo, and spreadsheet navigation as separate features unless explicitly selected.
- [ ] G-25 If combining TanStack and React Aria, prototype the integration and map row models/state/events deliberately; avoid two selection/sort models and unsupported virtualization assumptions.
- [ ] G-26 Document table engine limitations and an extension strategy; do not imply a UI library foundation supplies a complete enterprise grid.
- [ ] G-27 Complete grid migration before removing final dependencies; all public and generated grid types must be engine-independent or intentionally owned.
- [ ] G-28 Define cancel/error/optimistic-update behavior for host-driven row actions and reorder requests; restore or reconcile visible state when persistence fails.
- [ ] G-29 Define focus and scroll preservation when data refreshes, pages change, columns hide, or a selected row disappears; test multiple independent grids.

## 14. Calendar/date/time and advanced selector roadmap

The calendar prototype is required to validate the foundation. Product-specific
advanced features need a concrete requirement; this list does not silently commit
to a full booking backend or scheduling product.

- [ ] K-01 Define the initial advanced-selector requirements and success examples: date-only, date/time, range, presets, unavailable dates, clear, and explicit Apply/Cancel.
- [ ] K-02 Implement owned date field, calendar, date picker, range calendar, range picker, and time field building blocks needed by those requirements.
- [ ] K-03 Define selection versus focused date versus visible month separately; support controlled/default state and predictable clear/reset behavior.
- [ ] K-04 Support minimum/maximum, unavailable-date explanations, validation, required/optional input, and host-supplied availability without fetching business data.
- [ ] K-05 Support multi-month presentation, responsive container sizing, month/year navigation, keyboard navigation, focus return, and meaningful date announcements.
- [ ] K-06 Implement presets with documented locale/time-zone/fiscal assumptions; preserve a draft selection until Apply and restore committed selection on Cancel.
- [ ] K-07 Keep typed/segmented input and calendar selection synchronized; define invalid/partial typing, paste, blur, and form submission behavior.
- [ ] K-08 Test leap years, month boundaries, daylight-saving gaps/overlaps, date-only timezone independence, midnight ranges, and inclusive/exclusive endpoints.
- [ ] K-09 Test RTL, translated labels, first-day-of-week settings, non-Gregorian display where supported, and accessible available/unavailable/selected states.
- [ ] K-10 Define serialization and host callbacks using the owned date contract; document conversion adapters to upstream date utilities.
- [ ] K-11 Provide stories for booking-like availability, reporting ranges, long translations, dark/density modes, and standalone versus popover calendars.
- [ ] K-12 [Decision] Define whether multiple arbitrary dates, comparison periods, fiscal periods, or month/year-only selectors belong in the first advanced release; implement selected features with proof of behavior.
- [ ] K-13 [Future] Define recurrence UI separately: frequency, intervals, days, count/until, exceptions, preview, and explicit host-owned recurrence processing.
- [ ] K-14 [Future] Evaluate a resource/week/day scheduler separately from date selection: overlapping events, time slots, capacity, drag/resize, keyboard alternatives, and virtualization.
- [ ] K-15 [Future] Define appointment/course-session/booking compositions through data/callbacks and generic models; availability computation, conflicts, reservations, permissions, and persistence stay host-owned.
- [ ] K-16 Publish feature limits honestly; React Aria provides useful building blocks, not a complete recurrence or resource-scheduling engine.
- [ ] K-17 Define keyboard and non-hover access to availability explanations, range previews, and preset descriptions; rich date-cell decorations must not replace meaningful date labels.

## 15. Editors and optional domain extensions

- [ ] E-01 Retain Lexical as the editor engine unless a separate evidenced decision changes it; remove visual-foundation coupling without accidentally changing document serialization.
- [ ] E-02 Preserve existing nodes/plugins: ImageNode, image insertion, horizontal-rule selection, editor configuration, and experience plugins; test saved-content round trips.
- [ ] E-03 Replace editor toolbars, menus, modals, palettes and selection overlays with owned controls while preserving selection across commands and modal dismissal.
- [ ] E-04 Cover undo/redo, links, lists, code, tables, alignment, indentation, colors, and inline formatting that current consumers use.
- [ ] E-05 Address IME composition, paste, keyboard shortcuts, read-only/disabled state, and toolbar accessibility without hijacking ordinary editing keys.
- [ ] E-06 Define safe URL/protocol handling, image metadata/alt text, host upload callbacks, file validation, cancellation, and object-URL cleanup.
- [ ] E-07 Review rich-content rendering and trust boundaries; do not render arbitrary HTML or unsafe links merely because they arrived in a presentation model.
- [ ] E-08 Put editor-only dependencies behind a granular import boundary and assess whether separate packages are required to avoid mandatory installation weight.
- [ ] E-09 Put learner/instructor cards, course grids, activity mappings, and admin/instructor presets in a documented learning extension boundary without copying app screens.
- [ ] E-10 Keep generic layout/controls independent of course-specific models; document naming compatibility and module migration.

## 16. Accessibility, interaction, and verification

Target WCAG 2.2 AA for applicable component behavior, with explicit consumer
responsibilities. Automated checks help but do not establish complete conformance.

- [ ] X-01 Replace implementation-mirroring tests with behavior tests where needed; avoid mocks that hide the very focus/keyboard behavior under migration.
- [ ] X-02 Define keyboard contracts and verify Tab/Shift+Tab, arrows, Home/End, Enter/Space, Escape, and typeahead where appropriate.
- [ ] X-03 Verify accessible names/descriptions, roles, state announcements, validation, heading hierarchy, landmarks, and native form semantics.
- [ ] X-04 Verify initial focus, return focus, focus after removal/reorder/update, trapped focus in modals, and nested-overlay dismissal ordering.
- [ ] X-05 Ensure sticky headers/footers do not obscure focused controls; verify zoom/reflow/text-spacing behavior and scroll padding where needed.
- [ ] X-06 Verify text/non-text contrast, visible focus, high contrast/forced colors, reduced motion, and state meaning beyond color.
- [ ] X-07 Verify target size/spacing against WCAG requirements and aim for comfortable primary touch targets; test coarse-pointer use rather than shrinking every hit area with density.
- [ ] X-08 Provide both keyboard and single-pointer non-drag alternatives for drag operations where required; keyboard support alone does not satisfy every dragging requirement.
- [ ] X-09 Test real browser interaction, including pointer/touch, focus, layout, portals and clipboard; DOM-emulation tests alone are insufficient.
- [ ] X-10 Establish supported Chrome/Firefox/WebKit browser checks and document representative touch and assistive-technology coverage.
- [ ] X-11 Perform manual screen-reader reviews of representative dialogs, selectors, calendars, navigation, tables and editors; document platform/version and findings.
- [ ] X-12 Enable Storybook accessibility failures in CI for applicable checks, with scoped documented exceptions and remediation ownership.
- [ ] X-13 Add browser interaction stories/tests for all changed behavior; keep deterministic local fixtures and no authentication/database/network dependency.
- [ ] X-14 Add visual regression coverage for light/dark, density, narrow/wide containers, long/pseudo-localized labels, RTL, focus/error/loading/empty/selected states.
- [ ] X-15 Require deliberate review of screenshot changes; do not automatically accept new snapshots to silence regressions.
- [ ] X-16 Test multiple independent component instances, nested themes/portals, stable IDs, React Strict Mode cleanup, and controlled/uncontrolled transitions.
- [ ] X-17 Verify React 18.3 and 19 behavior and declaration compatibility using actual consumer fixtures, not just the development React version.
- [ ] X-18 Add SSR render and hydration tests with no window/document at import time, no mismatched IDs, and correct initial locale/theme/date values.
- [ ] X-19 Record performance and memory budgets, profile large grids/selectors, and test listener/observer/timer/object-URL cleanup during mount/unmount.
- [ ] X-20 Test API typing and package consumers, including generics, refs, callback payloads, CSS imports, isolated subpaths, and declaration dependency leakage.
- [ ] X-21 Preserve and adapt the existing test/story inventory; add missing meaningful stories rather than assuming every existing test validates browser behavior.

## 17. Packaging, builds, GitHub Actions, AI work, and releases

- [ ] R-01 Update the build to emit compiled CSS/assets and correct ESM/declarations; verify relative extensions and package consumer resolution.
- [ ] R-02 Remove blanket client-directive injection; preserve directives for interactive components and keep eligible presentation/token modules server-compatible.
- [ ] R-03 Design root and granular entry points for core, theme/tokens/styles, primitives, icons, hooks, adapters, i18n, grid, editor and learning compositions.
- [ ] R-04 Ensure barrels do not accidentally pull interactive/heavyweight dependencies into presentation-only imports or make server consumers import all editors.
- [ ] R-05 Update `files`, `exports`, `types`, and `sideEffects` for CSS and new output; remove the old augmentation entry and ensure required CSS survives bundlers.
- [ ] R-06 Preserve React/React DOM as peers and decide correct direct/peer placement for each new dependency; remove all retired packages from every dependency section.
- [ ] R-07 Regenerate the lockfile through the package manager and inspect resolved transitive dependencies, overrides, patched dependencies and optional packages.
- [ ] R-08 Verify packed artifacts rather than only source imports; install the tarball in clean Vite and Next.js/SSR consumer fixtures and build production output.
- [ ] R-09 Test published type declarations with supported TypeScript versions and ensure no retired imports/augmentation or accidental private upstream types escape.
- [ ] R-10 Keep the supported Node/runtime requirements explicit; reconcile development, CI, AI and release Node versions where their tool requirements differ.
- [ ] R-11 Extend `pnpm check` and CI with necessary token/CSS/import-boundary/type/API checks, browser interactions, accessibility, package consumers, and performance smoke checks.
- [ ] R-12 Keep Storybook builds and official tarballs as Actions artifacts; record artifact names, retention, and validation results.
- [ ] R-13 Preserve release sequencing: full required checks pass before semantic-release publishes on main, with correct concurrency and full tag history.
- [ ] R-14 Preserve Conventional Commit PR-title validation, squash title/footer guidance, release-policy tests, and automatic patch/minor/major inference.
- [ ] R-15 Mark breaking public API removals appropriately; if a release already exists, migration needs a major bump, while a first publication follows the configured initial-release policy.
- [ ] R-16 Plan a coherent migration branch/PR sequence so incomplete migration commits do not accidentally publish incompatible intermediate APIs; use documented prerelease policy only if deliberately configured.
- [ ] R-17 Verify npm scope ownership, public access, trusted-publishing/token setup, GitHub release/tag permissions, provenance requirements, and commercial notices before publication.
- [ ] R-18 Keep local builds for validation only; do not publish locally, edit tracked versions manually, add changesets, or claim owner configuration is already done.
- [ ] R-19 Keep the AI workflow task scope and patch allowlist aligned; architecture/package/workflow/agent changes currently require ordinary maintainer PRs rather than the component-only AI path.
- [ ] R-20 Add task IDs, owned API requirements, story/behavior criteria, and validation evidence to AI task templates and generated PR expectations.
- [ ] R-21 Preserve minimal workflow permissions, trusted/untrusted input separation, credential isolation, separate validation, and draft-PR review; never auto-merge AI proposals.
- [ ] R-22 Document the existing manual Actions AI trigger; an issue/label trigger is a separate decision, not already implemented or implied by the issue template.
- [ ] R-23 Verify AI-created draft PR validation even when default-token PR creation does not trigger another workflow; do not rely on absent CI events.
- [ ] R-24 Update workflow timeouts/artifact handling as browser checks expand; cache by lockfile and avoid stale build outputs masking missing CSS or dependencies.
- [ ] R-25 Pin/review workflow dependencies according to repository policy and validate proposed workflow changes without weakening protections to make checks pass.
- [ ] R-26 Define recovery from failed or partially completed publication, tag/package mismatch, and rollback/deprecation of a bad release; do not overwrite published versions.
- [ ] R-27 Ensure release-blocking checks actually run on the PR and main paths, including AI proposals and maintainer infrastructure PRs; check branch-protection names against the final workflow jobs.
- [ ] R-28 Validate release configuration safely without publishing while implementing it; explicitly control whether final migration merges will trigger the first public release or a subsequent major release.

## 18. Storybook, agent guidance, and consumer documentation

- [ ] W-01 Rewrite active `AGENTS.md` for the new foundation as migration lands; obsolete direct imports, `sx`, augmentation, retired links and grid assumptions must not guide future AI work.
- [ ] W-02 Retain valid learner-platform principles: shared components first, props/variants before custom styles, tokenized typography, neutral split actions, consistent grid alignment/filtering, and stories with behavior changes.
- [ ] W-03 Adapt modal guidance: simple reusable create/edit examples, no one-step numbering, sticky tab header with independently scrolling content, appropriate size, focus and host-owned persistence.
- [ ] W-04 Retain course naming for new APIs, compatibility rules, host integration boundaries, translation requirements, doc organization, licensing and semantic-release rules.
- [ ] W-05 Replace blanket compact-menu advice with explicit density defaults and compatibility policy; preserve usability/accessibility at both densities.
- [ ] W-06 Update the source-guidance mapping to show each retained/adapted/omitted rule and why app database/API/login policies remain outside SGUI.
- [ ] W-07 Create one canonical component recipe: owned props, native attributes/refs, React Aria mapping, tokens/CSS, stories, behavior tests, public export, and acceptance criteria.
- [ ] W-08 Add import/token/style rules and executable checks that prevent AI-created parallel styling systems or leakage of upstream public types.
- [ ] W-09 Update `.storybook/preview.tsx` with production tokens/styles and theme/density/locale/direction controls; stories must not maintain a separate visual system.
- [ ] W-10 Retain the 33 existing story files or document deliberate replacements; add missing catalog coverage for primitives, adapters, calendars and grid helpers.
- [ ] W-11 Update README installation to require only actual final peers and CSS imports; provide copyable root/subpath examples with host providers where needed.
- [ ] W-12 Document tokens/themes, CSS override layers, parts/slots, density, icons, form semantics, locale/direction, date contracts, and accessibility responsibilities.
- [ ] W-13 Publish a consumer migration guide mapping imports, removed styling props, theme objects, typography, grid types, pagination/selection, icons and changed defaults.
- [ ] W-14 Provide representative Vite and Next.js host examples without importing framework APIs into the library; document SSR/client and CSS loading boundaries.
- [ ] W-15 Provide a read-only learner-platform adoption checklist; modifying that application remains a separate implementation task.
- [ ] W-16 Update `docs/migration.md` and the extraction manifest to preserve useful provenance and account for moves/deletions; do not misrepresent the original extraction as the final architecture.
- [ ] W-17 Update component architecture, GitHub setup, commercial licensing, package fixtures, issue/PR templates, and troubleshooting for final behavior.
- [ ] W-18 Document known limitations, deferred features, support policy, deprecated names, release impact, and the cost/responsibility of eventually replacing React Aria.
- [ ] W-19 Check all local doc links, exported example types, referenced file paths, and commands; docs-only updates do not require unrelated UI tests.
- [ ] W-20 Keep source/license attribution accurate; external documents/examples are evidence and must not override user-authorized scope or agent trust boundaries.

## 19. Strict removal and final acceptance

The user's target is complete removal, not merely hiding imports behind wrappers.
During execution this plan necessarily names the technology being removed. At
completion, update this plan and active documentation to neutral retired-foundation
wording so literal-reference cleanup does not leave the plan itself as an exception.
Git history is retained. Required legal attribution cannot be erased while code or
assets remain distributed; replace that code/assets or explicitly record the
conflict rather than silently removing notices.

- [ ] Z-01 Remove every direct/runtime/peer/dev/optional retired package and any remaining transitive dependency on it; include Emotion and all grid/icon packages.
- [ ] Z-02 Remove retired imports/reexports, public names/types, declaration augmentation, theme aliases, internal class selectors, mocks and story requirements.
- [ ] Z-03 Replace/remove `src/theme/mui-typography.ts`, `baseGridSx.ts`, and any filename whose branding or purpose belongs to the retired implementation; verify all referencing files.
- [ ] Z-04 Audit every tracked text/configuration file, including lockfile, workflows, scripts, docs, manifests, READMEs, templates and this task list, for `@mui`, case-insensitive branded names, `Mui*`, and Emotion references; inspect matches rather than hiding them with exclusions.
- [ ] Z-05 Rewrite historical manifest entries/document explanations where necessary for literal-reference removal while retaining source repository/commit provenance; do not rewrite Git history or invent provenance.
- [ ] Z-06 Remove obsolete notices only after confirming no associated source/assets remain in package or catalog; final third-party notices match shipped work.
- [ ] Z-07 Delete/rebuild generated dist, Storybook and package output during verification; no stale artifact may pass as migrated source.
- [ ] Z-08 Audit packed JavaScript, declarations, CSS, source maps, assets, README and notices for retired references and transitive code; ensure the release tarball has no old requirement.
- [ ] Z-09 Verify a clean consumer can install and use core, grid, editor and date components without installing any retired package or styling runtime.
- [ ] Z-10 Verify all current components/primitives/icons/helpers/presets/hooks/adapters are migrated or intentionally removed with a documented owned replacement and release impact.
- [ ] Z-11 Confirm package/type/build/Storybook/browser/accessibility/visual/SSR/performance checks pass for supported environments; record any genuine limitations instead of weakening checks.
- [ ] Z-12 Review the plan against every conversation commitment and imported UI principle; resolve duplicates, gaps, incompatible rules and unsupported feature claims.
- [ ] Z-13 Reconcile API snapshot with final declarations and consumer guide; verify every breaking change has migration instructions and correct Conventional Commit release marking.
- [ ] Z-14 Confirm commercial licensing and notices, public npm setup, Actions-only official builds/releases, draft AI PRs and no Changesets remain consistent.
- [ ] Z-15 Record final dependency/feature decisions, accepted test evidence, completed PRs, and explicitly deferred future tasks; no unchecked required migration item is dismissed as optional after the fact.
- [ ] Z-16 Only then mark the migration complete. Publishing is performed through the configured release workflow when authorized release-worthy changes merge.

## 20. Conversation coverage and review record

| Conversation requirement or principle | Task coverage |
| --- | --- |
| Standalone SGUI, UI library only, preserve extracted behavior | B, A, M, E, H |
| React Aria chosen, custom visual identity, future replaceability | A, D, C, U, X |
| Completely remove original components/grid/icons/styling/types | B, I, M, G, R, W, Z |
| Modern stylesheets, layers, tokens, containers, RTL, density | D, C, H, X |
| Advanced calendars and limitations of generic libraries | P, K |
| Complex grid evaluated separately; own data/interaction contract | P, G |
| Compare native React versus state-machine claims through evidence | P-08, X-19, architecture rationale |
| Other companies/libraries are evidence, not mandatory dependencies | Accepted direction, sources, A-01 |
| Future multi-framework support is not automatic | A-20 |
| Application routing/accounts/translations/data stay host-owned | H, A-17, W |
| Storybook components, fixtures and interaction/a11y coverage | B, M, X, W |
| Learner platform agent guidance carried forward appropriately | B-02, W-01 through W-06 |
| Public npm with commercial SGUI license and upstream licenses | L, R-17, W-17, Z-14 |
| GitHub Actions AI triggers/builds/releases and reviewable changes | R-11 through R-26 |
| Automatic semantic-release; no manual changesets | R-14 through R-18, Z-14 |
| SSR, selective client boundaries, granular packages and CSS output | A-18, C-20, E-08, X-18, R-01 through R-09 |
| Complete inventory, no lost UI, final second-pass audit | B, M inventory, Z |

Documentation-delivery review (not migration completion): record the repository
inventory comparison, conversation coverage comparison, ID/link checks, and any
remaining implementation decisions here after the task list has been reviewed.

Review completed on 2026-10-05:

- Compared the full conversation against the coverage matrix, including public
  npm/commercial licensing, automatic releases, foundation replaceability,
  calendar limitations, grid independence, and modern CSS guidance.
- Compared all 37 actual component directories with M-01 through M-37; no missing
  or extra directory entries. Also checked directly imported controls, public
  primitive/icon barrels, presets, adapters, hooks, editor plugins and helpers.
- Re-read the original learner-platform agent file and the imported guidance;
  retained useful UI principles while keeping database/API/authentication rules
  outside the library. Resolved the compact-menu versus configurable-density rule.
- Reviewed package/build/story/AI/release configuration and added explicit tasks
  for CSS packaging, blanket client directives, strict cleanup, infrastructure
  allowlist constraints, selection/persistence semantics, and first-release risk.
- Second-pass additions cover asynchronous grid rollback, focus/scroll after data
  changes, accessible calendar explanations, and actual release-blocking checks.
- Verified unique task IDs, complete component coverage, existing local link
  targets, and whitespace. Implementation checkboxes remained unchecked at that documentation-delivery review; subsequent completion evidence is in the execution record.
- This delivery changes documentation only. UI tests and builds have not been
  rerun, and no migration, publication, remote configuration, or learner-platform
  modification is represented as completed.

Remaining decisions are explicit tasks: grid engine/integration (P-09), final
owned API mappings (A), icon source (I-01), browser/performance budgets (B-11/P-08),
initial advanced-calendar scope (K-01/K-12), heavy-package separation (A-18/E-08),
and publishing/license prerequisites (L/R). They are not hidden assumptions or
reasons to stop preparing the implementation backlog.

## 21. Primary references

These document upstream capabilities and standards. Prototype findings and SGUI
requirements decide implementation; marketing claims are not performance evidence.
Reverify versions and browser support when each task is implemented.

- [React Aria Components and composition](https://react-aria.adobe.com/getting-started)
- [React Aria date picker](https://react-aria.adobe.com/DatePicker)
- [React Aria calendar](https://react-aria.adobe.com/Calendar)
- [React Aria range calendar](https://react-aria.adobe.com/RangeCalendar)
- [React Aria table](https://react-aria.adobe.com/Table)
- [React Aria Components package/license](https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/package.json)
- [Apache 2.0 terms](https://www.apache.org/licenses/LICENSE-2.0)
- [Design Tokens Community Group stable reports](https://www.designtokens.org/technical-reports/)
- [CSS cascade layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)
- [CSS container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@container)
- [CSS logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Logical_properties_and_values)
- [CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting)
- [vanilla-extract theme contracts](https://vanilla-extract.style/documentation/theming/)
- [Tailwind theme variables](https://tailwindcss.com/docs/theme)
- [Tailwind browser requirements](https://tailwindcss.com/docs/compatibility)
- [WCAG 2.2 guidance](https://www.w3.org/WAI/WCAG22/Understanding/)
- [Focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
- [Target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [Dragging alternatives](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)
- [Storybook accessibility checks](https://storybook.js.org/docs/writing-tests/accessibility-testing)
- [TanStack Table's headless responsibilities](https://tanstack.com/table/v8/docs/overview)
- [AG Grid Community/Enterprise comparison](https://www.ag-grid.com/react-data-grid/community-vs-enterprise/)
- [Base UI architecture](https://base-ui.com/react/overview/about)
- [Ark UI architecture](https://ark-ui.com/docs/overview/about)
- [Ark UI date picker](https://ark-ui.com/docs/components/date-picker)
- [Zag framework adapters](https://zagjs.com/guides/framework-adapters)
- [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Headless UI](https://headlessui.com/)
- [Mantine CSS Modules](https://mantine.dev/styles/css-modules/)
- [shadcn/ui code ownership](https://ui.shadcn.com/docs)
- [HeroUI's React Aria implementation](https://heroui.com/docs/introduction)

Local background: [current component architecture](component-architecture.md),
[extraction inventory](../migration.md), [guidance provenance](../agent-guidance-migration.md),
[GitHub setup](../github-setup.md), [commercial licensing](../commercial-licensing.md),
and [agent instructions](../../AGENTS.md).
