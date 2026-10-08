# React Aria migration architecture decision

Task references: A-01–A-19, C-01–C-07, C-21, P-01, R-01–R-06, W-12, W-18.
Accepted direction: React Aria Components internally, owned contracts and compiled
CSS Modules externally. Implementation began on 2026-10-05. The catalog, grid,
editor, primitives, icons and public theme now use owned implementations; broad
G/K/E/U/X/R/Z acceptance remains open. `/experimental` retains proof contracts
and shared implementations without authorizing public catalog renames. See the
[execution record](react-aria-progress.md) and
[master backlog](react-aria-master-task-list.md).

AppButton, ExperiencePageNavigator, AppPageTabs and AppPageHeader also use the owned
foundation. See [button mappings](react-aria-button.md),
[page navigation](react-aria-page-navigation.md) and
[page layout](react-aria-page-layout.md). AppButton now uses onPress,
owned variant/tone/density and native class/style; the upstream button prop surface
is removed. Load /styles.css and provide Provider or ThemeScope.

AppModal, AuthShell, SideNavigation and AppShell now use the owned foundation.
Apply the migrated-module boundaries to these directories. See [modal and shell
contracts](react-aria-modal-shells.md) for owned dismissal/action callbacks, native style slots,
responsive navigation and host adapter behavior. Load /styles.css and provide an
owned scope, including for editor dialogs.

## Layers and dependency direction

1. `src/foundation/tokens.json` owns token values. The generator resolves aliases,
   validates types/cycles and produces deterministic CSS and typed variable names.
2. Presentation uses native HTML, scoped CSS and owned props. `ThemeScope` manages
   visual settings without depending on an interaction engine or an editor.
3. Interaction implementations selectively map owned props to React Aria. The
   shared button and field implementations live under `src/experimental` and also
   back public catalog/primitives exports; their source location is not a migration gate.
4. Compositions depend on owned primitives and host adapters. They must not import
   React Aria collection/state objects or the package root internally.
5. Grid, editor and learning extensions depend on shared controls, never the reverse.
   Keep the existing package and explicit subpaths before considering
   separate packages. The specialist grid decision selects TanStack v8 row processing and React Aria
   interaction; see [grid ownership](react-aria-grid-decision.md).
   The [catalog grid contracts](react-aria-grid-contracts.md) define the required
   capability matrix, owned API mappings and state transitions for M-16–M-19.

The import/token/layer check enforces owned foundation and registered catalog
boundaries, including grid/reorder, editor, icons, primitives and public theme.
Migrated implementation dependencies are audited transitively; emitted declarations
and package entry points have separate checks. Implementation/dependency removal
does not close the final historical/legal-reference or exact-artifact audits.
See the [removal audit](react-aria-removal-audit.md).

React Aria supplies interactions and accessibility machinery, while SGUI owns
appearance, composition and consumer contracts. Base UI, Ark, Radix and the other
researched libraries were not selected because the approved direction is React
Aria; no comparative performance advantage is claimed. No second general primitive
foundation or runtime stylesheet engine is introduced.

## Owned contracts

Preserve useful `App*` and existing Class-prefixed names during component migration.
New learning models use Course naming. Proof names under `/experimental` are
temporary and do not authorize renaming the current public catalog.

Use selectively chosen native attributes and native element refs, then declare
owned interaction options explicitly. Do not extend an upstream component's full
prop type. Upstream events, state objects and date classes stay inside wrappers.

For new action contracts, use `onPress: () => void` for a single normalized
activation. Do not invoke both a native click callback and a press callback for the
same activation. `AppButton` already uses the owned `onPress()` contract and no
longer accepts `onClick`; migrate old event handlers using the documented
[breaking button mappings](react-aria-button.md). Native Link click cancellation
is a separate navigation contract, not a second button activation callback.
Action buttons default to `type="button"`; submit/reset must be explicit. Link
actions use an owned link with the host navigation adapter, not a polymorphic
button. The proof intentionally offers no `href` or `component` prop.

Use `value`/`defaultValue`/`onValueChange` for text values, with strings including
the empty string. Controlled values stay authoritative; uncontrolled inputs
participate in native form submission/reset. Disabled prevents editing/activation;
read-only permits focus and copying. Loading suppresses activation while preserving
button focus and announces a translated pending status. Do not invent asynchronous
host persistence inside these controls.

The initial visual vocabulary is `filled | outlined | text`,
`primary | neutral`, and `compact | comfortable`. General density defaults to
comfortable, inherited by generic Menu unless its `density` is explicit. Catalog
menu compositions prefer compact density and set it explicitly (for example,
DataToolbar selection menus). Do not assume a generic Menu is compact. Placement,
dismissal, selection, date and grid contracts are owned; consult their component
guides for supported vocabularies and remaining acceptance limits.

Fields require either a visible `label` string or `aria-label` in their type.
Icon-only buttons require an accessible name from the consumer; decorative icon
slots are hidden. Labels supplied by hosts are translated by those hosts. New
library-owned status text uses the translation adapter with `defaultMessage`.

Use class names, native style, documented `data-sgui-part` hooks and CSS variables
as escape hatches. No `sx`, styling callbacks or upstream slot types enter new
contracts. Do not let the semantic heading level depend on its visual text role.
Complex compound slots/render callbacks are introduced only when a composition
demonstrates a need. A future engine swap must retain observable tests; it will
still require engineering work and may reveal API changes.

Host routing, locale, translations, accounts, data loading, scheduling permissions
and booking rules remain host-owned. Provider and ThemeScope are public owned
scopes, also exported by `/theme`; AppThemeProvider aliases Provider. Use Provider
for locale integration alongside visual scope and portaled scope inheritance.
It takes the host translation locale as the interaction locale; visual scope and
explicit token overrides are copied to body portals. Owned Link and Breadcrumbs now use the existing routing adapter. See the [proof control contracts](react-aria-proof-controls.md).

## Styles and packaging

Import `@structured-growth/sg-ui/styles.css` once and wrap owned UI, including
catalog compositions and dialogs, in `Provider` or `ThemeScope`.
The build compiles CSS Module classes into deterministic, namespaced identifiers,
emits JavaScript class maps and collects production CSS into one exported stylesheet.
Storybook uses the same naming function and generated production tokens. Consumers
do not compile CSS Modules or configure PostCSS. CSS is marked as a side effect.
The initial output has no CSS source map; add one when consumer debugging proves
it useful. JavaScript/declaration maps retain the existing build behavior.

The ordered layers are `sgui.tokens` then `sgui.components`. Unlayered consumer
rules outrank normal library declarations; important declarations reverse layer
priority, so avoid routine `!important`. Required normalization is scoped to
controls. This stylesheet has no body/global reset. The public theme provider now uses the owned scoped root without a global baseline.

`ThemeScope` supports light/dark/system and independent nested density roots.
System colors use media queries, with stable server markup and no render-time
browser reads. Geist is host-supplied with system fallbacks. Rem sizing, logical
properties, focus rings, reduced motion and forced colors are included in proofs.
Token contrast checks cover declared pairs, not complete accessibility
conformance or consumer overrides. Representative native focus/scroll, portal,
zoom, browser and SSR/hydration checks have evidence in
[browser acceptance](react-aria-browser-acceptance.md) and
[runtime validation](react-aria-runtime-ci.md). Full assistive-technology, physical
device, strict CSP and broader browser/consumer acceptance remain open.

The migrated catalog controls expose granular `/components/AppInlineProgress`,
`/components/AppOperationSteps` and `/components/EditableTitleField` paths. They
preserve prop names while requiring the foundation stylesheet/scope. Root and
`/components` imports resolve the owned catalog. See
[remaining controls](react-aria-remaining-controls.md) and
[progress/avatar](react-aria-progress-avatar.md).

The build preserves source client directives without adding any. Interactive
implementations and context providers declare their own boundaries; barrels,
tokens, models and eligible presentation modules remain server-compatible.
The package check verifies source/output directive fidelity and requires explicit
boundaries for React client APIs. See [server and client packaging](react-aria-server-components.md)
for the packed Flight proof and consumer composition rules. Other R acceptance
requirements remain separately tracked.

The owned boundary additionally covers CardCollectionWithFooter, CardPaginationFooter,
ClassCardFrame, InstructorClassCard and LearnerClassCard, with granular component
subpaths, transitive guards and declaration/packed-consumer checks. See [pagination](react-aria-card-pagination.md)
and [frame contracts](react-aria-card-frames.md).

## Dependency and license policy

Follow the [dependency support, security and upgrade procedure](react-aria-dependency-upgrades.md). Operational owner and confidential intake decisions remain pending.

Use the [read-only dependency/license inventory](react-aria-license-inventory.md)
for deterministic local evidence and explicit unresolved owner/legal decisions.

React and React DOM remain peers with the existing React 18.3/19 ranges.
React Aria Components 1.21.1 is an exact direct runtime dependency, with subpath
imports inside wrappers to keep unrelated collections out of basic-control paths.
The package manager owns the lockfile and deduplication. Consumers do not need to
install the interaction foundation as an additional peer. Its React peer ranges
include the supported majors; packed React 18.3/19 SSR/hydration proofs are recorded in the execution record.
Date implementations directly depend on @internationalized/date 3.12.4.
TanStack Table 8.21.3 and Lucide React 1.52.0 are exact runtime dependencies
behind owned grid/icon contracts; MIT/ISC and applicable Feather notices are retained.

PostCSS and CSS Modules compilation are development dependencies only. The
testing-library user-event dependency drives meaningful keyboard/form tests.
Upgrades require regenerated lockfiles, license review, owned declaration checks,
behavior checks, Storybook and packed-consumer validation. No upstream examples,
implementation code or icon assets were copied. Adobe dependencies retain Apache
2.0 licensing; existing commercial terms and notices remain in place.

The catalog and public theme now resolve to owned implementations; retired runtime,
peer and development foundation packages have been removed. Z still includes final
historical/legal-reference and exact-artifact acceptance. See
[public theme mappings](react-aria-theme.md) and the removal audit. No publication,
version edit, prerelease channel or remote workflow setting is part of this change.

ColumnsLayoutModal, ImageUploadModal and LinkUrlModal also use the owned foundation.
Apply migrated boundaries to these directories; see [editor dialog contracts](react-aria-editor-dialogs.md)
for preset draft reset, URL protocol validation and optional host-owned image descriptions.
Load /styles.css and provide Provider or ThemeScope.

InsertContentMenuControl, TextAlignMenuControl, TextColorPickerControl and
TextStyleMenuControl now use the owned foundation and migrated-module boundaries.
See [editor menu contracts](react-aria-editor-menus.md) for host callbacks,
checked formatting state and the breaking semantic color preset mapping. Load
/styles.css and provide Provider or ThemeScope. Broader editor acceptance remains open.

RichTextFormattingToolbar now uses the owned foundation and migrated-module
boundaries. See [formatting toolbar contracts](react-aria-formatting-toolbar.md)
for named formatting actions, controlled active state, selection preparation and
callback availability. Load /styles.css and provide Provider or ThemeScope.
See the owned editor section contract below.

FloatingTextSelectionToolbar, DocumentEditorLayout, DocumentEditorToolbar and
ContentEditorChrome now use the owned foundation and migrated-module boundaries.
See [editor layout and selection contracts](react-aria-editor-layout.md) for host scrolling, keyboard selection access, native
status colors and the breaking menu onPress(anchor) callback mapping. Load
/styles.css and provide Provider or ThemeScope. Broad editor/grid acceptance gates remain open.

PageRichTextEditorSection (M-34), including its Lexical image decoration, now uses
the owned foundation and migrated-module boundaries. See [editor section contracts](react-aria-editor-section.md)
for stylesheet/scope requirements, native styling/ref, live read-only state,
document reset and formatting-preserving link behavior. Broad editor/grid and
U/X/R/Z acceptance gates remain open.

DataToolbar (M-20), including columns, sort, filter and selection menus, now uses
the owned foundation and migrated-module boundaries. See [data toolbar contracts](react-aria-data-toolbar.md) for controlled host state, draft menus, native styling/ref and scope requirements.
Load `/styles.css` and provide Provider or ThemeScope. AppDataGrid, AppDataGridShell,
LearnerClassesDataGrid and row reorder also use owned implementations; broad G
acceptance remains open. See [catalog grid integration](react-aria-catalog-grid.md)
and [reorder contracts](react-aria-grid-reorder.md).

The public icons (M-36) and primitives (M-37) now use owned implementations,
with whole-directory source/transitive/declaration boundaries. See
[icon mappings](react-aria-icons.md) and
[primitive mappings](react-aria-primitives.md) for preserved names,
owned props and deliberate breaking removals. Import `/styles.css` and provide
Provider or ThemeScope. The public theme is owned; broad acceptance remains open.

See [public theme mappings](react-aria-theme.md) for the shipped scope API and Storybook globals.

Use the [canonical component recipe](react-aria-component-recipe.md) for new controls
and migrations. The [read-only adoption checklist](react-aria-adoption-checklist.md)
provides host planning and representative integration examples; it does not authorize
application changes or certify every host. This W-12/W-18 and A-06–A-10 documentation
reconciliation does not close those whole tasks or broad acceptance gates.
