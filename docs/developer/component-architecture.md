# SGUI component architecture

Adapted from `learning-platform/docs/developer/component-architecture.md` at
commit `8e63f1e16fc3d43d851908b312603a1099ca13d9`. The learner platform's UI was
organized for extraction into a library. SGUI is that standalone library.

This document describes the current extraction. The user-approved target and
execution backlog are in the [React Aria master task list](react-aria-master-task-list.md).
Migration work replaces the foundation while keeping SGUI's APIs, styles, and host
boundaries under SGUI ownership; update this architecture as that work lands.

The first implementation adds `src/foundation` for generated scoped tokens and
`ThemeScope`, and `src/experimental` for owned React Aria control proofs, including
button/field, dialog, tabs, combobox, popover and host locale integration, plus
calendar/date, async selection, grid, independent icons and native layout primitives.
The [layout/action contracts](react-aria-layout-actions.md),
[calendar contracts](react-aria-calendar-contracts.md),
[grid decision](react-aria-grid-decision.md) and
[persistent view state](persistent-view-state.md) document these additions.
AppInlineProgress, AppOperationSteps and EditableTitleField now compose these owned
controls, and Typefaces uses the owned typography catalog. These migrated directories
have the same boundary/token checks, with transitive source and declaration audits.
Their granular package subpaths avoid resolving the remaining legacy catalog.
Consumers must import the stylesheet and provide an owned visual scope, including
around mixed editor compositions. The [remaining control contracts](react-aria-remaining-controls.md)
and [progress/avatar guide](react-aria-progress-avatar.md) document this transition.
These use compiled CSS Modules and explicit client boundaries. Their
[architecture decision](react-aria-architecture.md) and
[execution evidence](react-aria-progress.md) govern new migration code. The current
catalog below retains its extraction architecture pending component migration.

CardCollectionWithFooter, CardPaginationFooter, ClassCardFrame, InstructorClassCard
and LearnerClassCard now follow these owned boundaries too. The [pagination](react-aria-card-pagination.md)
and [frame contracts](react-aria-card-frames.md) describe the styles and host callbacks.

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

## Source layout

- `src/components/<Component>`: component implementation, index, stories and tests.
- `src/components/primitives` and `src/components/icons`: owned public primitive/icon
  mappings, also exposed through `src/primitives` and `src/icons` entry points.
- `src/theme`: public owned scopes; `src/foundation` owns generated tokens.
- `src/hooks`: reusable state/pagination behavior.
- `src/adapters`: host routing and account integration.
- `src/i18n`: translation adapter and English fallback formatting.
- `src/models.ts`: library presentation models.
- `src/index.ts`: the root public API; package.json exports defines public subpaths.

## Rules for reusable components

Export reusable components and their prop types through the appropriate public
barrels. Avoid circular dependencies: a component should import a sibling's local
entry point rather than importing the library's root barrel back into itself.

Keep implementations independent of Next.js routing/image APIs, application
contracts, authentication endpoints and feature-module imports. Use adapters,
props and callbacks for host integration. Build scripts must not resolve paths
outside the SGUI package to make an import work.

Colocate `*.stories.tsx` and behavior tests with each component. Use representative
fixtures and adapters in stories so the catalog runs without the learner platform.
The catalog uses foundation tokens and CSS Modules. Storybook supplies the public production Provider with theme, density, locale and direction globals. Do not create a separate set of story-only tokens.

Use existing SGUI primitives and components for composed views. Owned wrappers and
themes must preserve the foundation interaction/presentation boundaries. Keep application-specific routing, persistence,
authentication and supported-language policy in the consuming application.

Guard browser globals for server rendering and preserve client boundaries. Keep
owned declarations reachable from published entry points. Verify
public imports with the package consumer checks after changing exports or types.

## Adopting the extracted library

The learner platform can replace its `@ui` imports with SGUI's public exports after
installation, using the host adapters for routing, accounts and translations.
See [migration.md](../migration.md) for the file inventory and integration limits.
Do not bring back its local aliases or move its API-bound screens into this library.

[AGENTS.md](../../AGENTS.md) holds the active development rules; this document
explains the architecture they apply to.

ColumnsLayoutModal, ImageUploadModal and LinkUrlModal also use the owned foundation.
Apply migrated boundaries to these directories; see [editor dialog contracts](react-aria-editor-dialogs.md)
for preset draft reset, URL protocol validation and optional host-owned image descriptions.
Load /styles.css and provide Provider or ThemeScope.

InsertContentMenuControl, TextAlignMenuControl, TextColorPickerControl and
TextStyleMenuControl now use the owned foundation and migrated-module boundaries.
See [editor menu contracts](react-aria-editor-menus.md) for host callbacks,
checked formatting state and the breaking semantic color preset mapping. Load
/styles.css and provide Provider or ThemeScope. Surrounding editor migration remains open.

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

The public icons (M-36) and primitives (M-37) now use owned implementations,
with whole-directory source/transitive/declaration boundaries. See
[icon mappings](react-aria-icons.md) and
[primitive mappings](react-aria-primitives.md) for preserved names,
owned props and deliberate breaking removals. Import `/styles.css` and provide
Provider or ThemeScope. Legacy theme removal and broad acceptance remain open.

The [public theme mapping](react-aria-theme.md) records removed theme objects and preserved AppThemeProvider.
