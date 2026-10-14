# Next.js docs workspace

The public repository is a pnpm workspace. `packages/ui` remains the only
publishable UI library. `apps/docs` is a private Next.js App Router application
using compiled public SGUI exports and `/styles.css`. Next.js is not a UI runtime
or peer dependency. Library scripts and existing browser specs live with the UI
workspace; the docs app owns public examples and the separate native fixture host.

## Website boundaries and identity

Use owned Box, Stack, Surface, Typography, Link and controls to compose the site.
HTML/body and native forms remain framework/semantic hosts. Next routing is supplied
through SGNavigationProvider. A shared demo toolbar selects identity/appearance/contrast; local density controls use owned APIs;
app-owned token overrides are supplied as Provider style so portals inherit them.
Do not change library defaults to brand the docs app. CSS Modules own only website
layout. No external font request, runtime styling engine or copied MUI UI is used.

## Examples and Storybook transition

MUI X's public docs workspace is the structural reference. The current catalog has
90 routes and 360 source-backed examples covering all 200 public React component
and icon export names, including aliases, compound children and host providers.
Pages include adjustable prop playgrounds, density comparisons, state/variant
matrices and local host workflows. Forms/date controls have independent compact,
comfortable and host-flow sections; AppModal has 12 size/content/workflow examples.
The icon page searches the 95 SVG icons and supports sizing, stroke and labels.

Catalog metadata is generated from the literal entries in the four component-family
modules. Server routes use that metadata; client family chunks load the appropriate
playground. Both the component index and expandable sidebar are searchable.
`catalog:check` rejects undocumented public component exports. Register every new
component and provide meaningful controls plus current copyable source.

Storybook runtime, configuration, dependencies and original story files have been
removed. `apps/docs/native-fixtures` now owns the isolated React browser host, built
with Vite from compiled public exports (plus a bounded private compiled allowlist
for historical grid proofs). This test bundle is separate from the public Next.js
site. The library keeps source-context unit fixtures under `*.native-fixture*` so
colocated tests retain the same React context instances.

The [scenario ledger](docs-fixture-migration.md) maps all 102 existing native specs
to their preserved fixture IDs and provenance. IDs retain their historical spelling;
execution now uses `/fixtures/?id=...` and owned render/play receipts. Assertions
continue to exercise the real production components. Every new public example
belongs to the website; new isolated native scenarios belong to the private host.

Production docs Playwright checks visit every catalog route, reject browser errors,
compile rendered source snippets before/after control changes, exercise search and
navigation, and check representative mobile layouts. Existing palette/system/
forced-color, dialog/focus and clipboard assertions remain. The migrated native
suite retains Chromium, Firefox and WebKit; its executed evidence is recorded in
the retirement receipt below when validation completes.

## Versions and licensing

The manifest in `apps/docs/content/navigation.ts` currently contains development
only. No release is fabricated. Later releases should build isolated immutable docs
snapshots using the matching library tag and examples; version navigation preserves
the current route, with deployment fallback for missing pages. Do not bundle all
historical package versions into one app. Archive publication and purchasing are
future workflow work, not implemented by this skeleton. Existing commercial terms
and notices are unchanged. There is no license-key enforcement or checkout yet.

## Commands

Run installation at repository root with `pnpm install --frozen-lockfile`.
Root `pnpm dev:docs`, `build:docs`, `check:docs` and `test:docs` build the library
before docs. Restart/rebuild when changing the UI package during this initial setup;
a watch build is a follow-up. `pnpm check` and `build:browser-docs` forward to UI. `pnpm test:browser` executes
the standalone native host; `pnpm test:docs` executes the public Next.js site.
Direct library scripts run with `packages/ui` as cwd. Full checkpoint coordinators
must select that workspace and record the move before continuing historical plans;
frozen prior worktree receipts must not be rewritten or reused as current passes.

## Delivery checklist

- [x] DOCS-001 Establish library/docs workspaces, public package dependency and docs theme.
- [x] DOCS-002 Add navigable skeleton and development version manifest.
- [x] DOCS-003 Transfer AppButton examples and add live Button/Dialog playgrounds.
- [x] DOCS-004 Validate production app, library checks, Storybook build and docs browser smoke.
- [ ] DOCS-005 Complete docs migration reconciliation: Storybook retirement and native-test transfer are delivered; public scenario parity and complete production gates remain under DOCS-005-b/l.
- [ ] DOCS-006 Generate a complete public prop reference (catalog/examples/search delivered by DOCS-011).
- [ ] DOCS-007 Add immutable release docs deployment and missing-page version fallback.
- [ ] DOCS-008 Add library watch mode (isolated demo/website scopes already delivered).
- [x] DOCS-011 Complete the current public component catalog, expanded examples and searchable navigation.
- [x] DOCS-012 Complete palette → semantic → component token separation for the website and demo identities.
- [x] DOCS-013 Add component-specific when/how guidance and related-component choices to every catalog page, with required coverage checks.
- [x] DOCS-014 Isolate playground settings from fixed reference examples and expand meaningful layout/density/state matrices with independent interactions and current source.
- [x] DOCS-015 Simplify copyable source to component imports, state/callbacks and JSX; keep application theme setup in dedicated guidance.
- [x] DOCS-016 Document one-level component composition with linked children, distinct compound-part lists and source-derived metadata.
- [x] DOCS-017 Group sidebar components by purpose, with expandable categories, active-page visibility and alias-aware search.
- [x] DOCS-018 Preserve document/content width across dropdown and dialog scroll locks, including native scrollbar and resize checks.
- [x] DOCS-019 Give every example block its own interaction-state owner and prevent sibling state/source changes across the full catalog.
- [x] PLAN-DOCS-001 Make the Next.js website the target for examples and browser fixtures; preserve legacy evidence and define the removal work.

This backlog supplements the migration checklist; no T/V/A acceptance is closed by
website restructuring. Build and browser outcomes are recorded below after execution.

## Active transition plan — 2026-10-14

The Next.js website is the permanent documentation and UI design environment.
Author new public examples in `apps/docs`, with prop playgrounds and current
copyable source. Use real exported SGUI components for both website chrome and
previews. The website's Structured Growth identity is independent from the Material,
Apple Human Interface and Editorial demonstrations. Each demo retains light/dark,
system preferences and increased contrast; density belongs to individual examples.
All 102 native browser spec files now target the docs-owned fixture host. Storybook
is removed; fixture provenance and previous acceptance receipts remain recorded. Catalog completion does not establish public-facing scenario parity. Preserved
native scenarios are mapped separately, and their execution receipts remain
separate from the public-example reconciliation.

Execute DOCS-005-a/b/c before porting dependent families. Complete each family as
one bounded scenario/spec migration, splitting a family leaf into stable numbered
children in the scenario ledger. Existing React Aria F/T/V/A priority and counts
remain unchanged; this work moves existing evidence to a new host rather than
adding broad coverage ahead of its assigned phase. DOCS-012 records the completed bounded
UI design token pipeline; DOCS-006/007/008 retain their independent deliverables.

### DOCS-005: retire Storybook without losing behavior coverage

- [x] DOCS-005-a Inventory every remaining story/export, all 102 native browser spec files, helper and CI/script reference. Create a scenario ledger naming existing fixture/story ID, assertions, acceptance IDs, destination route, owning family and transfer status. Classify demonstration-only stories separately from required native fixtures; assign every spec to exactly one transfer leaf.
- [ ] DOCS-005-b Reconcile existing website examples against that ledger. Transfer missing variants, tones, content, density, loading/empty/error states and composed host flows into their owning pages. Retain playground/source requirements; do not recreate examples that already exist. A catalog export entry alone is not evidence of scenario parity.
- [x] DOCS-005-c Establish docs-owned native test entry points using compiled public package imports, production scopes and host adapters. Specify build/route boundaries so private test fixtures are absent from public deployments; verify public builds return 404 and exclude their fixture code. Avoid embedding test-only controls in public component pages.
- [x] DOCS-005-d Port shared Playwright navigation, frame/locator helpers, web-server/build lifecycle and browser configuration to the new host. Use immutable fresh builds, never rebuild during a suite. Keep engine coverage, focus/keyboard, portal, clipboard and native event assertions intact; no skipped or weakened checks to make a port pass.
- [x] DOCS-005-e Transfer primitives, actions, forms and date/calendar scenarios. Keep native form/reset/validation, selection, overlays, range availability and focus assertions; record old/new fixture paths and the executed engine for each mapped spec.
- [x] DOCS-005-f Transfer grid, toolbar, course-card, pagination and row-reorder scenarios. Preserve state ownership, sorting/filtering, selection, viewport/scroll, server response and native drag/Move assertions with equivalent datasets.
- [x] DOCS-005-g Transfer editor, formatting/menu and editor-dialog scenarios. Preserve Lexical document/selection, read-only/reset, clipboard, link/image policies, upload lifetime and host scrolling assertions.
- [x] DOCS-005-h Transfer shells, navigation, page layout, typography, icons and supporting theme/adapter scenarios. Preserve route/account callbacks, responsive layout, density, direction, locale and scoped portal assertions.
- [x] DOCS-005-i Transfer existing axe, visual, download/performance and browser artifact checks to the correct new fixtures. Retain applicable rules, remediation ownership and thresholds. Keep library/tarball measurements comparable; separately record docs-host payload costs. Document any required host-specific baseline change with before/after evidence.
- [x] DOCS-005-j Run all mapped existing native specs against the new host in Chromium, Firefox and WebKit, plus affected consumer/type/import/token checks. Reconcile failures without weakening assertions; record exact tested source/build and coverage boundaries. Verify every ledger row has evidence and no spec still targets Storybook.
- [x] DOCS-005-k Remove transferred story files, Storybook configuration/dependencies/scripts, server helpers and CI build/artifact steps once their references are reconciled. Replace active commands/artifacts with docs equivalents and update their policy tests, README and agent guidance. Preserve legal notices, historical evidence and original acceptance IDs.
- [ ] DOCS-005-l Audit runtime/source/dev dependency and CI references, perform a clean frozen install and production library/docs builds, and run the preserved native/consumer gates. Record zero active Storybook dependencies and a complete scenario mapping; then close DOCS-005. Historical/legal prose may still name Storybook. Local dependency audit, frozen install, builds and affected consumer gates are delivered; the complete final production matrix remains separate from bounded development validation.

### DOCS-005-b: bounded public-example parity follow-ups

The [public scenario audit](docs-fixture-migration.md#public-example-parity-audit--docs-005-b) compares actual current example source with preserved fixture provenance. The 90-route/269-example export catalog is complete; public scenario parity is **not** complete. These leaves name confirmed customer-facing gaps, while specialized diagnostic probes remain private. Existing equivalent examples must be reused rather than recreated. Framework retirement is structurally delivered: Storybook is removed and 425 native fixture identities are retained. The leaves below expand public customer documentation; they do not require restoring Storybook or moving private diagnostic controls into the website. Existing-suite execution and final retirement validation remain the coordinator's separate receipts.

- [ ] DOCS-005-b01 `text-field` — Native form reset composition. Current host flow controls a single field and has no Reset action. Add a customer-facing native form combining required input and controlled/uncontrolled defaults, explicit host reset and submit handling. Reuse current input/state/density controls; do not expose diagnostic callback counters as the purpose.
- [ ] DOCS-005-b02 `async-multi-select` — Host-owned asynchronous search. Current search filters a local array synchronously; pending/failure are manually toggled. Add a bounded mock async search adapter showing query-to-request, pending, rejection/retry and retained selections with defined host cancellation/freshness handling. Keep existing loading/error examples; no real endpoint or application backend.
- [ ] DOCS-005-b03 `date-field` — Local datetime to explicit-timezone instant. Current DateField exposes date/datetime and hour-cycle controls but no timezone integration. Add a local datetime plus host timezone example using public dateTimeToInstant; disclose ambiguous/nonexistent-time policy and keep civil dates separate from instants.
- [ ] DOCS-005-b04 `date-range-selector` — Localized civil calendar presentation. Current calendar/range controls support weekday and availability, but examples inherit the default locale and do not explain locale versus timezone. Add named locale scopes and one civil-range comparison with explicit host reference context; preserve ISO values and copyable Provider setup.
- [ ] DOCS-005-b05 `app-shell` — Independent navigation and long main-content scrolling. Current fixed-height shell has only short main text; it does not demonstrate independent overflowing regions. Add a bounded long navigation/main-content composition and narrow reflow example using shared SGUI UI. Preserve existing shell playground.
- [ ] DOCS-005-b06 `auth-shell` — Long authentication form and footer content. Current auth choices change the heading around the same short email/action form. Add representative long host-owned form/help/footer content that visibly scrolls within a constrained host; use actual fields and defined host callbacks without account APIs.
- [ ] DOCS-005-b07 `page-header` — Primary actions and deep breadcrumb compositions. Current header demonstrates primary/subpage surfaces, metadata and More menu, but does not supply its primary action-button slot. Add action-button and condensed/deep-breadcrumb examples from the preserved variants, with long labels and current source; reuse existing hierarchy modes.
- [ ] DOCS-005-b08 `data-grid-shell` — Controlled server criteria and response ownership. Current shell playground is a client dataset with local view/state controls. Learner grid shows server pagination but not shell server search/sort/filter acceptance or rejected/stale host responses. Add a copyable controlled shell composition with one criteria owner and a bounded local async host adapter; avoid test-only resolve-request buttons.
- [ ] DOCS-005-b09 `data-grid-shell` — Opt-in persisted view and complete reset. Current client shell enables Reset view but does not opt into persistence or demonstrate declared reset defaults. Add an isolated storage-key composition and declared defaults with reset source; keep production SSR-safe initialization and host ownership.
- [ ] DOCS-005-b10 `learner-card` — Due-label and course-content variations. Current learner card varies completion only and uses one fixed future dueAt/referenceNow pair. Add a deterministic due-label matrix (overdue/today/tomorrow/later/no due date) plus long/missing supporting content using host locale/reference clock; reuse the completion matrix.
- [ ] DOCS-005-b11 `page-rich-text-editor-section` — Representative saved rich document. Current editor initializes a single plain paragraph and offers tools/read-only/replacement. Add a customer-facing saved document containing representative headings, formatted/link text, list/code/table/image content, alongside a read-only presentation. Preserve public JSON and scope/style setup; keep diagnostic history/clipboard probes private.
- [ ] DOCS-005-b12 `page-rich-text-editor-section` — Host image-upload integration and retry. Current editor uses default temporary local previews; separate ImageUploadModal examples only report selection or simulate rejection. Add a bounded mock host onUploadImage workflow returning a durable host URL and a recoverable failure, with defined callbacks and copied integration code. Explain host network/asset ownership; do not imply a real backend.

Close each leaf only after its shared Example/playground/source deliverable and bounded relevant validation exist. This source audit adds no new browser/AT acceptance and does not reset historical F/T/V/A counts. Additional scenario findings may receive new bounded leaves; the twelve entries above do not imply exhaustive parity across private fixtures.

### DOCS-012: consistent UI design token layers

Execute the granular tasks and validation in the
[token pipeline checklist](theme-token-pipeline.md). The bounded baseline is implemented and validated;
the parent leaves below summarize its acceptance criteria and completed evidence.

- [x] DOCS-012-a Extract named raw palettes for Material, Apple and Editorial; give the fixed Structured Growth website its own explicit palette. Keep colors out of component styles and semantic definitions where a palette reference is appropriate.
- [x] DOCS-012-b Map each identity's palettes into complete semantic roles for light/dark and standard/increased contrast, including surfaces, text, actions, focus, borders, selection, disabled and validation states. Preserve live system preference resolution and forced-color precedence.
- [x] DOCS-012-c Audit and complete component aliases for actions, fields, menus, dialogs, cards, grids and remaining components. Replace direct semantic color consumption with component aliases where component-specific override is intended; preserve public APIs and interaction behavior.
- [x] DOCS-012-d Generate/validate the palette → semantic → component references and token types. Reject missing references, cycles and unintended hard-coded component colors; ensure source examples include the same identity/mode mappings as previews.
- [x] DOCS-012-e Verify representative components and portals across identities, appearances and contrast, with local density and visible focus. Record bounded color/contrast evidence; confirm website branding and controls remain isolated from demo changes.
- [x] DOCS-012-f Document token layers, component override points and theme-authoring examples in the website. Keep named palettes, semantics, component mappings and source panels inspectable; do not present inspired themes as native platform implementations.

Planning completion is not implementation completion. Checked migration leaves
have the source deliverables described in the retirement receipt; execution and
remaining reconciliation leaves close only with their named evidence. DOCS-012
is complete for the bounded token-pipeline baseline; its receipt records the limits.
Historical receipts below retain their original commands, hosts and results.

## Validation receipt — 2026-10-14

Working changes based on `ddb624fdad1289be71be62da06fe2908a2386a03`; no commit,
push, deployment or publication performed. Node 24.19.0, pnpm 10.29.3.

- Frozen workspace installation passed after resolving the new lockfile.
- Full `pnpm check` passed: 257 Vitest files / 1,640 tests, foundation/token/import
  guards, source/story typecheck, four release tests, ESM/declarations and packed
  output/public API checks. Log: `/tmp/sgui-workspace-node24-check.log`.
- Fresh transitional Storybook build passed with existing upstream warnings:
  `/tmp/sgui-workspace-storybook.log` (initial build used host Node 26.5.0).
- Production Next.js build and typechecking passed on Node 24; nine routes,
  including the not-found route, are prerendered. `/tmp/sgui-docs-build.log`.
- One production Chromium docs smoke passed, including visible-label checkbox
  activation, disabled state, host navigation, dark portal identity, docs primary
  color, save/focus restoration and 375px overflow. `/tmp/sgui-docs-browser.log`.
  The first run's native-input click was intercepted by its styled indicator;
  corrected the driver to use the visible label and retained checked/disabled
  assertions. No production checkbox change or forced click was used.
- Screenshot review caught host padding overrides from Box's default inline
  padding; docs now supplies owned padding props/native layout style. Final mobile
  screenshot: `/tmp/sgui-docs-dark-mobile.png`.
- Five AI scope guard tests and eleven license-inventory tests passed; workspace
  importer selection keeps the UI manifest distinct from docs dependencies.
- Five entry documents: 75 local links checked, zero document defects. License and
  third-party notice copies are byte-identical; `git diff --check` passed.

The existing 102-spec library browser matrix, packed Next/Vite runtime consumers,
Firefox/WebKit docs smoke and remote CI were not rerun. Local package/tarball checks
are not those browser consumers. Existing migration acceptance remains unchanged.
Frozen historical checkpoints require new workspace-aware plans; prior receipts
retain their original identity. The docs app's localhost preview is not a deployment.


## Example density and theme direction — 2026-10-14

Density is no longer a header control. The docs shell uses the default comfortable
scope. Button examples expose a local density prop and independently scoped compact
and comfortable Button/TextField comparisons. Theme appearance (light/dark/system)
is distinct from identity: docs identity currently overrides semantic tokens;
future example identities can supply their own light/dark token sets through scoped
style. Keep docs navigation stable while example identities vary. The existing
ColorTheme union remains appearance only; alternate identities are not additional
values of that prop. No alternate identity is implemented by this density change.

Density follow-up validation: docs typecheck and fresh production build passed on
Node 24.19.0. The existing Chromium smoke passed with added assertions for absence
of header density and presence of both local comparison scopes; existing callback,
disabled, themed portal, save/focus and overflow assertions remain. Logs:
`/tmp/sgui-docs-density-build.log`, `/tmp/sgui-docs-density-browser.log`. No library
source change or broader browser acceptance is claimed.


## Prop playgrounds and current-example source — 2026-10-14

Every component docs page must include an interactive prop playground, and every
example must pair preview and copyable source using `apps/docs/components/Example.tsx`.
The source generator includes real public imports, React state, stylesheet, Provider,
current theme tokens, and current props; user strings are JSX expressions with JSON
serialization. Button and Dialog pages implement this contract. Button variant/tone
rows, both density scopes, content states and native form each have their own source.
Keyboard-expandable code uses owned Disclosure and AppButton; copy errors leave
selectable code and a visible fallback message. Instructions are in root AGENTS.md.

The source smoke compiles all currently displayed snippets against built package
exports and exercises native clipboard copying after changing a consumer label.
A docs page is not complete until its playground and source panels exist. The per-component rollout below is completed by DOCS-011; historical receipts below
retain their original validation scope.

### Per-component playground rollout

- [x] DOCS-PLAY-C01 AppButton: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C02 AppInlineProgress: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C03 AppOperationSteps: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C04 AppPageHeader: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C05 AppPageTabs: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C06 AppShell: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C07 AuthShell: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C08 AppModal: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C09 SideNavigation: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C10 ExperiencePageNavigator: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C11 CardCollectionWithFooter: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C12 CardPaginationFooter: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C13 ClassCardFrame: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C14 InstructorClassCard: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C15 LearnerClassCard: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C16 AppDataGrid: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C17 AppDataGridShell: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C18 AppDataGridRowDnd: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C19 LearnerClassesDataGrid: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C20 DataToolbar: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C21 DocumentEditorLayout: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C22 DocumentEditorToolbar: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C23 ContentEditorChrome: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C24 EditableTitleField: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C25 FloatingTextSelectionToolbar: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C26 RichTextFormattingToolbar: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C27 InsertContentMenuControl: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C28 TextAlignMenuControl: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C29 TextColorPickerControl: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C30 TextStyleMenuControl: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C31 ColumnsLayoutModal: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C32 ImageUploadModal: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C33 LinkUrlModal: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C34 PageRichTextEditorSection: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C35 Typefaces: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C36 icons: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-C37 primitives: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P01 Box: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P02 Stack: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P03 Surface: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P04 Card: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P05 Divider: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P06 Typography: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P07 Button: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P08 IconButton: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P09 ButtonGroup: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P10 SplitAction: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P11 TextField: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P12 TextArea: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P13 Checkbox: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P14 Switch: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P15 RadioGroup: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P16 Select: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P17 ComboBox: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P18 AsyncMultiSelect: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P19 Menu: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P20 Popover: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P21 Tooltip: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P22 Dialog: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P23 Tabs: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P24 Link: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P25 Breadcrumbs: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P26 Navigation: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P27 List: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P28 Disclosure: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P29 Collapse: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P30 Chip: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P31 Badge: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P32 TagGroup: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P33 Progress: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P34 Status: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P35 Avatar: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P36 Table: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P37 Pagination: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P38 ToggleButton: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P39 DateField: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P40 TimeField: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P41 Calendar: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P42 DatePicker: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P43 DateRangePicker: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P44 DateRangeSelector: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P45 Provider: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P46 DataGrid: playground, applicable props and per-example current source.
- [x] DOCS-PLAY-P47 icons: playground, applicable props and per-example current source.

Source-panel validation: Node 24 docs typecheck and fresh production build passed.
The existing Chromium smoke passed, compiling nine rendered source snippets against
the built package, checking quoted/brace/angle-bracket label serialization, changed
density-field content and light/dark source updates, and comparing native clipboard
bytes with the exact displayed code after the Copy code gesture. It retains prior
callback, disabled, themed dialog, focus and narrow-width assertions. Logs:
`/tmp/sgui-docs-source-build.log`, `/tmp/sgui-docs-source-browser.log`. Clipboard
read/write permissions are granted by the test context; the app requests no grants.
Firefox/WebKit and all-library example coverage remain pending.


## Website versus demonstration scopes — 2026-10-14

The docs shell is fixed to the Structured Growth identity/light mode. It no longer
has a header theme switch. ComponentExamples owns page-local identity and mode
settings; Example applies them only to a nested live-preview ThemeScope. Example
settings, prop controls, headings and source/copy panels remain in the website
scope. Density comparisons similarly scope the preview rather than their frame.
Portals inherit the preview theme through SGUI's owned scope bridge.

The initial isolation slice offered Structured Growth and SGUI Default, with
light/dark modes; the identities/system/contrast continuation below expands it. SGUI Default resets the inherited website overrides with CSS `revert-layer`
so the owned library token layer applies, including in portals. Snippets include
the exact selected tokens, mode and density. That slice did not implement system appearance or increased contrast; the
continuation below does. Its historical verification scope remains unchanged.

Isolation validation: Node 24 docs typecheck and fresh production build passed.
The single production Chromium smoke passed: Structured Growth/dark and SGUI
Default/dark previews have their respective actual computed button colors; website
header tokens, navigation and source-panel appearance remain light/Structured
Growth; dialog portals inherit both selected identities. Nine generated snippets
still typecheck; source settings, native clipboard bytes, host callbacks, focus
and narrow-width checks remain. An initial ambiguous header selector matched
the dialog header too; it now identifies the website header by its documentation
content. No assertions were removed. Logs: `/tmp/sgui-docs-isolation-build.log`,
`/tmp/sgui-docs-isolation-browser.log`. Library source and acceptance counts did
not change; Firefox/WebKit and high-contrast/system modes are not claimed.


## Identities, appearance, contrast and system preferences — 2026-10-14

- [x] DOCS-009 Add three independently scoped demo identities, system-following
  appearance/contrast, increased palettes and OS forced-color precedence.

Identities: Structured Growth (indigo), SGUI Default (owned palette), Editorial
(warm palette, serif typography and smaller corners). Appearance: system/light/dark.
Contrast: system/standard/increased. Both system options are the initial defaults.
Native matchMedia subscriptions respond to changes without reload and unsubscribe
on unmount; useSyncExternalStore retains a deterministic light/standard server and
hydration snapshot. Explicit appearance/contrast override their respective system
preferences, except that forced-colors always retains the user's system palette.

The higher-contrast palettes target at least 7:1 for named normal/muted text and
button-label pairs, and 3:1 for named border/focus pairs against preview surfaces.
Focus width increases to 3px. These bounded measurements do not certify whole-site
or all-component WCAG conformance. OS colors use Canvas/CanvasText, ButtonText and
Highlight/HighlightText, without disabling browser forced-color adjustment. In OS
forced-colors the browser may recolor the website shell too, as the user intends;
ordinary demo selections never change website identity.

Every copied example includes the selected identity's light/dark standard/increased
and system-color tokens, complete preference subscriptions and explicit override
logic. Examples use public package APIs and preserve identity/mode/density for
portals. The library's ColorTheme API remains light/dark/system; contrast/identity
are app-owned token profiles, not newly introduced upstream public types.

References: [enhanced contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html),
[prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-contrast).

DOCS-009 validation on Node 24.19.0/pnpm 10.29.3: docs typecheck and fresh production
Next.js build pass. All three targeted tests pass in production Chromium: palette
ratios across three identities/two appearances, live system-preference changes and
manual overrides, forced-color emulation with native keyboard focus, Editorial
increased-contrast dialog portal text/action colors, and existing website isolation,
clipboard and nine generated-source compilation checks. Logs:
`/tmp/sgui-docs-modes-build.log`, `/tmp/sgui-docs-modes-browser.log`. Whitespace and
entry-link checks pass. No library runtime change, publication or broad migration
acceptance is claimed. Browser-emulated preferences are not physical OS/device
or spoken assistive-technology acceptance; Firefox/WebKit were not rerun.


## Shared Demo settings toolbar — 2026-10-14

- [x] DOCS-010 Replace per-page appearance panels with one persistent demo toolbar.

DemoSettingsProvider lives in the root DocsShell, above route children. It owns
identity, appearance, contrast and native preference subscriptions. One website-
styled DemoSettingsToolbar appears below the main header. Component pages consume
shared settings without mounting their own provider or control panel. The existing
Example scope still limits settings to live previews and their portals, while
source generation reflects current shared choices. Density remains example-local.
Client-side navigation preserves all three selections, including via non-component
pages. A full reload/new tab starts with the system defaults; no storage/backend
persistence was added. Earlier page-local owner descriptions are historical slices
superseded by this section. No library runtime or migration acceptance changes.

DOCS-010 validation: Node 24 docs typecheck and fresh Next.js production build
passed. All three existing targeted checks passed, including one toolbar/no old
appearance heading, shared identity/appearance/contrast across client navigation
from Buttons through Theming to Dialogs, scoped preview/dialog colors, unchanged
website palette, native system/forced-color behavior, nine generated snippet
compilations and clipboard bytes. Narrow viewport overflow remains checked. Logs:
`/tmp/sgui-docs-toolbar-build.log`, `/tmp/sgui-docs-toolbar-browser.log`. Source
links/whitespace pass. No extra test matrix, backend storage, package runtime change
or migration acceptance is claimed.


## Complete public component catalog — DOCS-011, 2026-10-14

Delivered 90 component routes / 269 live examples. The export guard covers all
200 current public React component/icon names from root, components, experimental,
primitives, theme, adapters and translation entry points. Compound children and
aliases share the owning component page. Historical Typefaces maps to Typography;
CardPaginationFooter maps to its public AppPaginationFooter export;
AppDataGridRowDnd maps to DataGridDragHandle and the host-accepted grid reorder
composition. Noncomponent utility functions/constants are not promised separate
playgrounds; grid factory helpers and activity-icon mapping have composed examples.

Every route has a prop playground and at least two source panels. Per-family modules
contain independent interaction state, owned density scopes, realistic local data,
loading/empty/restricted action examples and public imports. The source scaffold
uses reserved SGUI appearance variable names to avoid collisions with host state.
Labels with quotes, angle brackets and braces remain valid JSX after editing.
No API, authentication, upload endpoint, publication or commercial licensing change.

Validation: Node 24.19.0 / pnpm 10.29.3 frozen installation, catalog generation and
export guard, TypeScript and fresh production Next build passed. All five production
Chromium checks passed: every route rendered without console/page errors; all 538
initial/changed snippets compiled; native clipboard bytes matched the displayed
source; inherited scopes, system changes/explicit overrides/forced colors and
portal focus retained prior assertions. Search, sidebar navigation and representative
375px grid/calendar/editor layouts passed. The learner server-mode example locally
responds to page requests with the matching dataset slice. Source and diagnostics
receipts: `/tmp/sgui-catalog-sources.json`, `/tmp/sgui-catalog-diagnostics.json`.

Working tree is based on `ddb624fdad1289be71be62da06fe2908a2386a03`; changes are
uncommitted. This closes the 84 DOCS-PLAY leaf tasks and DOCS-011 only. Remaining
legacy Storybook fixture transfer, full generated API reference, release archives
and library watch mode remain separately tracked. No F/T/V/A library acceptance
counts, previous evidence receipts or native/AT acceptance claims change.

Final tested docs-file manifest: 44 TS/TSX/MJS/CSS/JSON files, aggregate SHA-256
`34ee6c8c8640008af5ed06dafd126be037614eb5124739907af5ac4d0180bf19`.
Individual hashes: `/tmp/sgui-docs-catalog-tested-files.sha256`. Final browser log:
`/tmp/sgui-docs-catalog-browser.log` (5 checks, 23.0s). Documentation link audit:
3 affected guidance files / 124 local links, zero defects. `git diff --check` passed.

## Material and Apple demo identities — 2026-10-14

The user requested replacing the Structured Growth and SGUI Default demo choices.
The toolbar now offers Material Design (default), Apple Human Interface and the
existing Editorial alternative. Material uses purple tonal surfaces, rounded actions
and a Roboto/system fallback stack. Apple uses system typography, neutral surfaces,
blue accents and smaller rounded controls. These are SGUI token-based interpretations
of the design languages; their interaction implementations remain SGUI-owned.
References: [Material color roles](https://m3.material.io/styles/color/the-color-system)
and [Apple HIG](https://developer.apple.com/design/human-interface-guidelines).
No font downloads, component dependencies or library-default changes are introduced.
The fixed Structured Growth website scope is unchanged. All demo identities retain
light/dark/system appearance, standard/increased/system contrast and forced colors;
copied source embeds their matching palettes. Earlier named-identity receipts above
are historical. The theming page describes the current options.
Validation: fresh Next.js production build/type/export guards passed. All five
production Chromium checks passed (16.7s), including all 90 routes / 538 source
snapshots, Material and Apple shape/color assertions, removal of retired picker
options, Apple dialog portal/source/navigation inheritance, contrast/system/forced
colors and existing clipboard/mobile checks. Website brand assertions remain.

## Transition backlog planning receipt — 2026-10-14

PLAN-DOCS-001 is complete. Updated the docs checklist, master task list,
regression/hardening host guidance and AGENTS.md to target the website. Added
12 Storybook migration/removal leaves and six token-layer leaves; implementation
leaves remain open. Confirmed the current native inventory contains 102 spec files.
Documentation-only validation: five affected files, 497 local links, zero defects;
`git diff --check` passed. No runtime code, tests, CI gates or acceptance totals changed.

## Storybook retirement receipt — 2026-10-14

Storybook is structurally retired. Removed its configuration, dependencies, scripts,
CI build references, original story files and unused source-only helpers. All **425**
scenario identities remain in the private docs fixture registry, including all **164**
IDs referenced by the **102** original native specs. Nineteen source-context unit
fixtures preserve React context identity; the package excludes those files from its
distribution. No Storybook imports, dependencies, `/iframe.html` routes or old build
commands remain in active source, package metadata, lockfile or CI. Legal notices and
historical acceptance receipts remain intact.

The existing tests were migrated and reconciled before new public-site tests ran.
The first full three-engine run executed 1,521 cases: **1,505 passed, 14 failed and
two existing skips**. The failures exposed timing assumptions and actual focus/popup
issues; their assertions and diagnostic checks were retained. Bounded follow-ups
resolved every reported failure:

- Popup collision, portal direction and responsive modal checks: **123/123** across
  Chromium, Firefox and WebKit. Owned popup updates coalesce into animation frames
  and avoid writes when the anchor geometry is unchanged.
- Grid shell focus/reflow: **12/12** across all engines. Focus entering its local
  viewport is revealed without taking outside focus or moving sibling regions.
- Select sizing and editor chrome: **27/27** across all engines, including the
  WebKit observer-cycle failure. A private owned sizing adapter schedules updates
  outside native observer delivery while retaining React Aria positioning. The new
  sizing case covers collision, text growth, resize, ancestor scroll, RTL and reopen.
- Shell/navigation/toolbar and controlled calendar reset: **102/102**, all engines,
  each existing case repeated twice. AppShell remains server eligible; its private
  client main-region leaf reveals clipped controls. Accepted reset repairs only
  stranded body focus after closing, preserving host/outside focus.
- Token-scope checks: **15/15**. WebKit emulates the forced-colors preference but
  lacks `forced-color-adjust`; its unsupported CSS capability is recorded separately.
  Native focus, readable disabled text, opacity and visible boundaries still run.

These are a full initial run plus bounded corrections on later source, **not a claim
of a single all-green final 1,521-case run**. Full production/main CI remains required.
Logs/results: `/tmp/sgui-retirement-native-matrix.log`,
`/tmp/sgui-popover-native-results.json`, `/tmp/sgui-grid-focus-gates/results.json`,
`/tmp/sgui-select-results-actual.json`, `/tmp/sgui-shell-reset-final-results.json` and
`/tmp/sgui-root-token-results.json`. Original failures are retained in the initial
native report rather than overwritten by the passing corrections.

The full library check passed **257 files / 1,640 unit tests**, plus release,
type/import/token/style, build and public package checks. Subsequent source fixes
passed their affected unit sets (29 Select/popup cases, 32 grid cases, 16 shell/reset
cases, 12 owned Popover cases and the retained insertion-host case) and final
foundation guards. Runner/checkpoint policy checks passed 59 cases with two explicit
server-test gates skipped; the new canonical-root/escaping-symlink server regression
was separately executed and passed. Fresh frozen installation, library/native-host
builds and production Next.js build passed. Final packed **React 18.3.1 and 19.2.3**
consumer checks passed public API/subpath, SSR and hydration-fixture builds; React 19
also passed Flight with the exact private main-region client reference.

After the existing failures were resolved, all **eight public docs checks passed**,
including three new tests for async selection/loading/failure/retry source and copied
bytes, date/time/density/segment source and copied bytes, and production fixture
isolation. All 90 routes and 269 examples rendered; **538 initial/changed source
snapshots** compiled. Public `/fixtures/` endpoints return 404, and public Next.js
manifests/bundles omit the native host. Evidence:
`/tmp/sgui-retirement-public-docs.log`, `/tmp/sgui-retirement-final-next-build.log`,
`/tmp/sgui-retirement-final-consumer18.log`,
`/tmp/sgui-retirement-final-consumer19.log` and
`/tmp/sgui-retirement-final-foundation-guard.log`.

The private host is 284 files / 2,706,636 bytes; JS/CSS is 2,487,191 bytes and
763,219 bytes independently gzip-compressed. This is test-host cost, not public
website or library payload. Existing native performance thresholds and exact download
bytes are unchanged; no host-specific baseline was relaxed. Measurements:
`/tmp/sgui-retirement-native-payload.json`.

Working tree remains based on `ddb624fdad1289be71be62da06fe2908a2386a03`, uncommitted.
Final runtime-input manifest: 1,094 files, aggregate SHA-256
`5cea146a495fd00be1ca2517653020b045c961ddeccd752345596e713425e93c`,
individual hashes in `/tmp/sgui-retirement-final-source.json`. Node 24.19.0 and
pnpm 10.29.3. The local production preview was restarted on port 3000. No publish,
deployment, licensing change or F/T/V/A acceptance-count change occurred.
DOCS-005-b01–b12 remain public-example enhancements with preserved native evidence;
they are not missing fixture transfers or a remaining Storybook dependency. DOCS-005-l
retains complete production-gate execution before main acceptance; this development
receipt does not close that broader gate.

Final guidance validation: 14 affected entry/architecture documents, 1,003 local
links, zero broken targets; `git diff --check` passed. The scenario ledger links
this receipt separately from its preserved historical evidence.

## Menu corner alignment — 2026-10-14

The shared Menu highlight now derives its radius from the popup radius minus its
border and inner padding, rather than the unrelated field radius. Its scrolling
menu surface also follows the popup's inner curve. This keeps focused/selected
backgrounds inside rounded corners without hiding the popup's overflow or removing
the inset keyboard focus outline. Small-radius identities clamp safely to zero.

Validation: 14 existing Menu unit cases and foundation/style guards passed; fresh
library and production docs builds passed. A focused production browser probe
passed all 36 combinations of Material/Apple/Editorial, light/dark, compact/
comfortable and Chromium/Firefox/WebKit. It measured nested corner geometry and
retained first/last-item keyboard focus, Escape dismissal and trigger restoration.
Theme/density changes were awaited through committed scopes and rendered frames
before opening the menu. The rounded Material menu screenshot was visually checked.
Evidence: `/tmp/sgui-menu-radius-unit.log`, `/tmp/sgui-menu-radius-guard.log`,
`/tmp/sgui-menu-radius-build.log`, `/tmp/sgui-menu-radius-browser-results.json` and
`/tmp/sgui-menu-rounded-highlight.png`. Production preview restarted on port 3000.
No broader acceptance gate was closed by this visual correction.

## Component usage guidance — 2026-10-14

DOCS-013 is complete. All 90 component pages now show a fixed-website-scope usage
panel before their examples: a specific "When to use" description, practical "How
to use" instructions and related-component links. Four content-family JSON files
provide 306 instructions grounded in the shipped public props, contracts and host
responsibilities. Aliases and compound exports share their owning page's guidance.
Dialog and AppModal explain their shared modal behavior and differing composition
levels; Popover, Menu, Tooltip and editor dialogs explain their distinct tasks.

The panel uses public SGUI Surface, List, typography and links. `catalog:check`
requires guidance for each route, rejects stale/duplicate entries and validates
related links. AGENTS.md requires guidance to stay current with component contracts.
Playwright's existing catalog check now verifies the usage headings and instruction
list on every route. Playground and server-example selectors use their named regions
so the inserted documentation panel does not displace interaction coverage.

Validation: catalog/type checks and the production Next.js build passed. All eight
public docs browser checks passed in 19.7 seconds, including every route, 269
examples and 538 initial/changed compilable source snapshots. Existing appearance,
clipboard, async/date flows and production fixture isolation remain checked.
Dialog-to-AppModal related navigation and 375px mobile layout also passed; desktop
and mobile usage panels were visually inspected. No library implementation or
public API changed; unrelated library unit/native suites were not rerun.
Logs: `/tmp/sgui-component-usage-types.log`, `/tmp/sgui-component-usage-build.log`,
`/tmp/sgui-component-usage-browser.log`, `/tmp/sgui-component-usage-visual.log`.
Screenshots: `/tmp/sgui-dialog-usage-desktop.png` and
`/tmp/sgui-dialog-usage-mobile.png`. Local preview restarted on port 3000.

## Independent example matrices — 2026-10-14

DOCS-014 is complete. Playground configuration is local to its own preview;
reference panels use fixed configurations and their own host state. Reference
instances reuse the same implementation where useful, without inheriting the
playground's props or freezing rendered children/callbacks. Global demo identity,
appearance and contrast remain intentionally shared across the page.

ButtonGroup now has 12 named examples: its playground, eight horizontal/vertical
× compact/comfortable × joined/separate references, filled and text action groups,
and long-content/disabled/pending actions. Each fixed group owns its action result
and matching source; natural-width layout shows the group shape clearly.
Tabs, Stack and Navigation add supported layout/density/activation/direction
combinations. RadioGroup and ToggleButtonGroup show both orientations and densities
at once with independent selection. Editor/catalog pages add fixed activation,
hierarchy, navigation, viewport, read-only and host-flow configurations without
inventing unsupported props. Data examples isolate reference state and add fixed
table/card density and loading/empty/error cases. AppButton's variant matrices now
compare both tones at both densities and own their counters separately from its
playground. The dedicated AppModal examples retain their existing independent state.

The catalog grows from 269 to **360 examples** across the same 90 routes / 200
public export names. AGENTS.md requires fixed reference configurations, local
playground controls and meaningful supported combinations for future documentation.
Existing all-route browser coverage now asserts that editing playground controls
leaves every reference source unchanged. A new ButtonGroup test verifies all eight
matrix configurations and physical horizontal/vertical geometry, changes playground
orientation/density/label independently, activates one reference without changing
its siblings, and copies the source for that reference's current action state.

Validation: catalog/type guards and production Next.js builds passed. Final public
browser suite: **9/9 passed in 23.0 seconds**, all 90 routes / 360 examples and **720
initial/changed compilable source snapshots**. Mobile coverage includes ButtonGroup,
Tabs, RadioGroup and ToggleButtonGroup alongside existing large compositions.
Existing theme/contrast, clipboard, async/date and private-fixture isolation checks
remain intact. Horizontal compact and vertical comfortable fixed groups were
visually inspected; the initial review exposed unintended parent stretching, which
was corrected with owned Stack alignment and checked again in the final build.
No library implementation or public API changed. Production preview restarted on
port 3000; no broader library acceptance gate closed.

Evidence: `/tmp/sgui-example-matrices-types.log`,
`/tmp/sgui-example-matrices-build.log`, `/tmp/sgui-example-matrices-browser-final.log`,
`/tmp/sgui-group-horizontal-compact.png` and `/tmp/sgui-group-vertical-comfortable.png`.
Public-example parity follow-ups under DOCS-005-b retain their separate criteria;
additional variants alone do not establish every historical composed workflow.


## Component-only source receipt — 2026-10-14

DOCS-015 follows the user's revised source-panel requirement and supersedes earlier
receipts requiring repeated palette/system-preference setup in copied component
examples. `examples/source.ts` now emits public component imports, required React
state and component JSX. It omits the demo palettes, appearance/contrast resolution,
media subscriptions, stylesheet import and automatic theme Provider. Imports for
explicit density scopes or documented Provider/override examples remain only when
used by the example itself. Applications load styles and provide their theme once,
as explained in installation/theming guidance. Live demo themes and portals still
use the existing theme pipeline; ordinary theme selections leave component snippets
unchanged. Prop changes and interaction state still update source and clipboard.

Updated AGENTS.md, source callers and the theming page to preserve this boundary.
The catalog browser check explicitly rejects demo theme boilerplate from every
component snippet; the existing production smoke verifies source stays identical
while identity/appearance changes and verifies the actual preview still changes.

Validation: docs typecheck and production build pass; `pnpm --filter
@structured-growth/docs exec playwright test` passes 10/10 (26.5s), including all
90 routes, 360 component examples and 720 initial/changed compilable source
snapshots, plus three explicit theme-override snapshots. Log:
`/tmp/sgui-component-source-tests.log`. Preview restored at port 3000. Library
runtime, licensing and broader acceptance counts are unchanged.


## Component composition receipt — 2026-10-14

DOCS-016 adds a Contains section to all 90 component pages alongside when/how
usage. Lists show the next documented UI component boundary, without recursively
flattening its descendants. Each child links to its documentation; compound
components with different compositions have separate named sections and same-page
anchors. Alias groups with identical children share a list. Leaf components and
application-supplied content are described explicitly; configuration factories are
not presented as rendered components.

`component-composition.mjs` resolves owned public symbols and private renderer
helpers from working library source at catalog generation/check time. The website
imports only generated metadata, not library source. Public component boundaries
stop traversal. Native elements, upstream interaction internals and host slots do
not become documented children. An explicit mapping preserves the public
AppDataGrid boundary for the shell's private ComposedAppDataGrid entry. Noncomponent
factories/hooks are not component boundaries. Updating library composition requires
regeneration; catalog checks reject stale metadata. AGENTS.md records this policy.

AppDataGridShell contains AppDataGrid, AppPaginationFooter, Button, DataToolbar,
Progress and Status. The shell does not list the grid's Checkbox or the footer's
Pagination as direct children. The grid and footer list those on their own pages.
AppShell's navigation/main content remain application-provided, rather than being
misrepresented as fixed SideNavigation or other arbitrary component children.

Validation: docs typecheck and final production build pass. The production docs
browser suite passes 11/11 (30.3s), checking Contains coverage/links across all
90 pages, preserved 360 examples/720 source snapshots, the shell → grid → footer →
pagination navigation, exclusion of grandchildren, host-content separation, distinct
List/ListItemText children and same-page CircularProgress → Progress navigation.
Log: `/tmp/sgui-composition-tests.log`. Visually inspected the grid shell's Contains
section; preview restored at port 3000. Library APIs, runtime, licensing and broader
F/T/V/A acceptance counts are unchanged.


## Grouped navigation receipt — 2026-10-14

DOCS-017 replaces the flat All components list with ten expandable categories:
Buttons & actions, Form components, Text & content, Data grids & tables, Cards &
collections, Dialogs & overlays, Navigation & layout, Rich text editors, Feedback &
progress, and Themes & integration. Child links are visually indented. Existing
primary documentation links remain available. Every catalog page belongs to one
category, enforced by the catalog guard using `component-navigation.json`.

The current route's category opens automatically and its link retains aria-current.
Users can expand/collapse groups with the owned Disclosure control; other groups
retain their state during client navigation. Search stays visible and filters across
category names, component titles and public aliases, revealing matching groups and
showing an empty-results message when needed. Clearing search restores group state.
The fixed website theme and demo settings remain separate. AGENTS.md records the
navigation coverage and interaction requirements.

Validation: docs typecheck and production build pass; the docs browser suite passes
12/12 (29.6s). Evidence includes all 90 catalog routes/720 source snapshots, keyboard
expansion, cross-group alias search, active-page selection after navigation, empty
search results, and narrow-screen navigation without horizontal overflow. Existing
catalog navigation smoke was updated for persistent grouped search. Log:
`/tmp/sgui-grouped-nav-tests.log`. Visually inspected the grouped sidebar on
AppDataGridShell; local preview restored at port 3000. No library APIs, licensing,
release or broader acceptance counts changed.


## Stable overlay layout receipt — 2026-10-14

DOCS-018 prevents content width changes when menus, selects and dialogs lock
page scrolling. The document reserves a stable scrollbar gutter. WebKit's classic
custom-scrollbar case still dropped that gutter under overflow:hidden, so a
docs-only layout hook measures the unlocked document width and constrains the
body to the same available width. It preserves the measured gutter while locked,
updates on resize/restoration, and cleans up its observers/style on unmount.
Observer updates run in an animation frame and write only changed values. Native
scroll locking, overlay placement, focus restoration and library scopes remain.
There is no global host-style change in the UI package or copied component code.

Validation: final production build and docs TypeScript checks pass. The full docs
browser suite passes 14/14 (33.6s), including 90 catalog routes and 720 source
snapshots. Bounded scrollbar cases pass at 1280px and 375px in Chromium, Firefox
and WebKit, measuring the header, sidebar, main content and every preview before,
during and after menu/select/dialog opening. They verify Escape focus restoration,
viewport growth and restoration, and no horizontal document overflow. The native
fixture initializes custom scrollbar mode before sampling (WebKit requires an
initial overflow transition); equality assertions remain exact. Initial CSS-only
WebKit failures were resolved by the layout constraint, not weaker assertions.
The six-engine/width cases passed initially; after adding resize coverage,
Chromium's two cases passed in the 14-test suite and Firefox/WebKit's four cases
passed again (7.2s). Logs: `/tmp/sgui-scrollbar-docs-tests.log` and
`/tmp/sgui-scrollbar-resize-tests.log`. The separate
`playwright.scrollbars.config.ts` bounds the three-browser run to this spec.
Preview restored at port 3000. Library APIs, releases, licensing and broad native/
physical-device/assistive-technology acceptance counts are unchanged.


## Independent example state receipt — 2026-10-14

DOCS-019 closes the reported Owned Button reference-state leak. Earlier separation
of the playground from reference examples did not fully separate every reference
block. A composed Save draft action and the density comparison still shared the
same action state. Each panel now mounts its own state-owning component. The
composed button example displays its own status and source; pressing Save draft
leaves the comparison and playground unchanged.

Audited every example family. Split multi-panel owners in presentation components,
data/catalog components and the AppButton page, including individually mounted
compact/comfortable AppButton examples. Forms, date and editor scenarios already
mount separate single-panel owners; their structure was retained. All 124 example
templates now have one Example block per named component owner; they instantiate
the existing 360 catalog examples. Visual demo settings remain intentionally shared.
Local controls, action/selection/open state, drafts, queries, pagination, errors and
source snapshots remain confined to their own example instance. Contents within
one comparison block may share that block's state; separate blocks do not.

The catalog guard rejects multiple Example blocks under one owner and inline mapped
panels capturing page state. It covers ordinary and self-closing JSX. Three guard
cases verify independent owners pass, multiple blocks fail, and inline mapped
examples fail. `examples:check` runs these guard cases from catalog:check and hence
build/typecheck. AGENTS.md now explicitly requires independently mounted state
owners and sibling preview/source preservation.

Validation: docs typecheck and production build pass; the isolation guard passes
124 templates, with 3/3 guard tests. The Save draft regression and full-catalog
interaction sweep pass 2/2 (24.9s). Across all 90 routes, 260 panel interactions
preserved every sibling source; 136 updated the current source locally. The sweep
covers editable fields, checkboxes, enabled actions and overlay opening/dismissal;
static/read-only panels are covered by ownership/catalog checks. Existing docs
checks pass 14/14 separately (33.0s), including all 360 examples and 720
initial/changed compilable source snapshots. Logs:
`/tmp/sgui-independent-isolation-tests.log` and
`/tmp/sgui-independent-docs-tests.log`. Preview restored at port 3000. Library APIs,
licensing, releases and broader acceptance counts are unchanged.
