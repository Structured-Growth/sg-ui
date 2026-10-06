# Learner platform UI extraction

Source: `Structured-Growth/learning-platform`, commit
`8e63f1e16fc3d43d851908b312603a1099ca13d9`, `apps/web/src/ui`.
The file-by-file [manifest](extraction-manifest.json) confirms every shared UI
source file has a destination in this library. Original components, helpers,
stories, and tests were copied; framework coupling was then adapted.
The learner platform checkout has not been modified.

The subsequent foundation migration has begun with scoped tokens and experimental
button/field proofs. See the [execution record](developer/react-aria-progress.md).
The inventory and adaptations below remain extraction provenance; they do not
describe a completed foundation migration. Catalog migration now includes
AppInlineProgress, AppOperationSteps, EditableTitleField and the Typefaces stories.
These keep their public names while moving to the foundation stylesheet/scope;
see [owned control contracts](developer/react-aria-remaining-controls.md) and
[progress/avatar contracts](developer/react-aria-progress-avatar.md).

The card collection/footer and frame/instructor/learner cards now also use the
owned foundation. See [card pagination](developer/react-aria-card-pagination.md) and
[card frame mappings](developer/react-aria-card-frames.md) for breaking integration
changes, retained presentation props, routing and callbacks.

AppButton, ExperiencePageNavigator, AppPageTabs and AppPageHeader also use the owned
foundation. See [button mappings](developer/react-aria-button.md),
[page navigation](developer/react-aria-page-navigation.md) and
[page layout](developer/react-aria-page-layout.md). AppButton now uses onPress,
owned variant/tone/density and native class/style; the upstream button prop surface
is removed. Load /styles.css and provide Provider or ThemeScope.

AppModal, AuthShell, SideNavigation and AppShell now use the owned foundation.
Apply the migrated-module boundaries to these directories. See [modal and shell
contracts](developer/react-aria-modal-shells.md) for owned dismissal/action callbacks, native style slots,
responsive navigation and host adapter behavior. Load /styles.css and provide an
owned scope, including for editor dialogs.

## Source architecture

The learner platform is a pnpm/Turbo monorepo with a Next.js React web application,
a separate API application, and shared API contracts. Its web UI is organized as:

| Layer | Source | SGUI treatment |
| --- | --- | --- |
| Shared visual components | `apps/web/src/ui/components` | Copied, preserving public names |
| MUI theme and typography | `apps/web/src/ui/theme` | Copied; augmentation shipped with types |
| Persistent state/pagination | `apps/web/src/ui/hooks` | Copied and publicly exported |
| Component catalog | Colocated Storybook stories | Copied into React/Vite Storybook |
| Router links/navigation | Next.js imports in shared UI | Replaced with host navigation adapter |
| Account operations | Auth/session imports in SideNavigation | Replaced with host account adapter |
| Translated labels | App translation provider imports | Replaced with host translation adapter |
| Learner grid model | Feature LearnerClass type | Local presentation model |
| Due date formatter | Feature formatting helper | Copied with behavior tests |
| Application screens | `apps/web/src/features` and `apps/web/app` | Remain in the learner platform |
| API/contracts/session storage | API and app services | Remain host-owned |

## Component inventory

- AppButton
- AppDataGrid
- AppDataGridRowDnd
- AppDataGridShell
- AppInlineProgress
- AppModal
- AppOperationSteps
- AppPageHeader
- AppPageTabs
- AppShell
- AuthShell
- CardCollectionWithFooter
- CardPaginationFooter
- ClassCardFrame
- ColumnsLayoutModal
- ContentEditorChrome
- DataToolbar
- DocumentEditorLayout
- DocumentEditorToolbar
- EditableTitleField
- ExperiencePageNavigator
- FloatingTextSelectionToolbar
- ImageUploadModal
- InsertContentMenuControl
- InstructorClassCard
- LearnerClassCard
- LearnerClassesDataGrid
- LinkUrlModal
- PageRichTextEditorSection
- RichTextFormattingToolbar
- SideNavigation
- TextAlignMenuControl
- TextColorPickerControl
- TextStyleMenuControl
- Typefaces
- icons
- primitives

Also included: admin/instructor grid option presets, activity icons, theme
variants, editor nodes/plugins and public MUI primitive/icon reexports.
The component catalog has 33 story files. Existing Class-prefixed exports are
retained for compatibility; broader renaming requires a separate migration.

## Adaptations and limits

- Root imports and subpath entry points work without Next.js or the source
  platform. SGUI keeps MUI as its foundation; this extraction does not replace
  MUI's rendering implementation.
- Links use the host navigation adapter; replace behavior is preserved. Provide
  pathname when using SideNavigation so selected/expanded menus track your router.
- SideNavigation reads accounts through host-provided functions. Logout actions
  are disabled until SGAccountProvider is supplied. The host performs any
  refresh/navigation required after an organization switch.
- Translation keys/default messages are retained, with an English fallback and
  host translation integration. Application translation catalogs and database
  overrides are not part of the library.
- AppThemeProvider preserves the original light theme. Applications can use MUI
  ThemeProvider with the exported darkTheme or a derived theme.
- Production type checking corrected false selection handling, optional
  navigation child arrays, and React drag events' native composedPath access.
- Storybook uses representative navigation fixtures rather than app routes.
  The source global CSS and app-owned font loading are not imposed on consumers.
- MUI X community behavior is retained. Licensed Pro-only grid capabilities
  are not added by this migration.

## Adopt SGUI in the learner platform

After the first release, install the package and peer dependencies, then redirect
`@ui` imports to SGUI's public exports. Connect the existing router, translations,
and auth/session functions through the three adapters. Keep API-bound screens and
application navigation models in the learner platform. Check visual and interaction
parity before removing the old shared UI tree.

This task copies the reusable library into SGUI. It does not yet change the learner
platform to consume a published package, remove original source, or extract full
application screens into neutral templates. The user confirmed the shared UI library is the requested scope.

## Agent guidance

The learner platform's reusable UI conventions have also been merged into SGUI's
root AGENTS.md. See [agent guidance migration](agent-guidance-migration.md) for
the source inventory and section-by-section decisions, and
[component architecture](developer/component-architecture.md) for the adapted
architecture guidance. Application-only rules remain with the learner platform.
