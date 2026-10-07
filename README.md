# Structured Growth UI (SGUI)

A reusable React component library built on owned controls and React Aria, extracted from the learning
platform. Includes light/dark themes, primitives and icons, page layouts,
navigation, modals, cards, data grids, toolbars, pagination, and Lexical editors.
The package is `@structured-growth/sg-ui`. Published versions are calculated
automatically by semantic-release.

The approved migration direction is React Aria Components, SGUI-owned APIs and
design tokens, compiled CSS Modules, and complete removal of the existing UI
foundation. The [master task list](docs/developer/react-aria-master-task-list.md)
records the full migration scope, component inventory, sequencing, and acceptance
checks. Implementation has begun with scoped tokens, compiled CSS Modules and
experimental controls including button/field and nested dialog/form proofs. See the [execution record](docs/developer/react-aria-progress.md).
`AppInlineProgress`, `AppOperationSteps`, `EditableTitleField`
and the Typefaces catalog have migrated; their public prop names remain, but they
now need the foundation stylesheet and visual scope. See the
[owned control contracts](docs/developer/react-aria-remaining-controls.md) and
[progress/avatar guide](docs/developer/react-aria-progress-avatar.md).

CardCollectionWithFooter, AppPaginationFooter, ClassCardFrame, InstructorClassCard
and LearnerClassCard also use the owned foundation. See the [card pagination](docs/developer/react-aria-card-pagination.md)
and [card frame mappings](docs/developer/react-aria-card-frames.md) for styling and
callback integration changes. Each has a granular `/components/<directory>` export.

**Commercial license required.** Public npm availability does not grant permission
to use this library. Obtain a written agreement from Structured Growth before use.
See [LICENSE](LICENSE) and [commercial licensing](docs/commercial-licensing.md).

AppButton, ExperiencePageNavigator, AppPageTabs and AppPageHeader also use the owned
foundation. See [button mappings](docs/developer/react-aria-button.md),
[page navigation](docs/developer/react-aria-page-navigation.md) and
[page layout](docs/developer/react-aria-page-layout.md). AppButton now uses onPress,
owned variant/tone/density and native class/style; the upstream button prop surface
is removed. Load /styles.css and provide Provider or ThemeScope.

AppModal, AuthShell, SideNavigation and AppShell now use the owned foundation.
Apply the migrated-module boundaries to these directories. See [modal and shell
contracts](docs/developer/react-aria-modal-shells.md) for owned dismissal/action callbacks, native style slots,
responsive navigation and host adapter behavior. Load /styles.css and provide an
owned scope, including for editor dialogs.

ColumnsLayoutModal, ImageUploadModal and LinkUrlModal also use the owned foundation.
Apply migrated boundaries to these directories; see [editor dialog contracts](docs/developer/react-aria-editor-dialogs.md)
for preset draft reset, URL protocol validation and optional host-owned image descriptions.
Load /styles.css and provide Provider or ThemeScope.

## Development

Use Node 24 (see `.nvmrc`) and pnpm 10.29.3. The supported consumer minimum is
Node 22.12.0; [runtime and CI validation](docs/developer/react-aria-runtime-ci.md)
documents the runtime matrix, packed React consumers and retained artifacts:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm storybook
pnpm build-storybook
```

`pnpm check` typechecks production source and stories, runs unit and release-policy tests, builds
ESM/declarations, and imports each public package entry point. Vitest executes
colocated tests independently of TypeScript's production/story checking.
GitHub Actions runs these checks and builds the package and Storybook on PRs and
main. Local builds are for validation; official build artifacts and releases
come from Actions.

## Use in an application

Releases are public on npm under the `@structured-growth` scope. Install SGUI
and its peer dependencies after the first release:

```sh
pnpm add @structured-growth/sg-ui react react-dom
```

```tsx
import "@structured-growth/sg-ui/styles.css";
import { AppButton } from "@structured-growth/sg-ui/components/AppButton";
import { Provider } from "@structured-growth/sg-ui/theme";

export function Example() {
  return <Provider><AppButton>Save</AppButton></Provider>;
}
```

Public entry points: the package root, `/components`, `/theme`, `/hooks`,
`/icons`, `/primitives`, `/adapters`, and `/i18n`. React and React DOM are the only peers. Lexical editor dependencies ship with SGUI.

The theme references Geist, with system-font fallbacks; applications supply the
font if desired. No application-global CSS or Tailwind requirement is imposed.

To review the migration proofs, import the compiled stylesheet once and use the
experimental controls inside their visual scope:

```tsx
import "@structured-growth/sg-ui/styles.css";
import { Button, TextField, ThemeScope } from "@structured-growth/sg-ui/experimental";

export function MigrationProof() {
  return <ThemeScope theme="system" density="comfortable">
    <TextField label="Course name" name="course" />
    <Button onPress={() => {}}>Save</Button>
  </ThemeScope>;
}
```

These are proof contracts that may change during migration. Public catalog components now use owned contracts. Broad acceptance remains open. See the
[architecture and styling guide](docs/developer/react-aria-architecture.md).
Run `pnpm test:foundation-consumer` to validate a packed Vite proof consumer.

Migrated catalog controls also have granular subpaths so a consumer can avoid
resolving the unmigrated catalog:

```tsx
import "@structured-growth/sg-ui/styles.css";
import { Provider } from "@structured-growth/sg-ui/theme";
import { AppInlineProgress } from "@structured-growth/sg-ui/components/AppInlineProgress";

export function CourseProgress() {
  return <Provider><AppInlineProgress value={40} /></Provider>;
}
```

The other granular migrated paths are `/components/AppOperationSteps` and
`/components/EditableTitleField`. The retired foundation peer requirements have been removed. During the transition,
wrap mixed compositions such as ContentEditorChrome in the foundation scope too.

Routing uses native anchors by default. Supply `SGNavigationProvider` with
`pathname` and `navigate` for your router, plus an optional custom `Link`.
`navigate` accepts an optional `{ replace }` argument. Next.js integration belongs
in the consumer:

```tsx
"use client";
import { usePathname, useRouter } from "next/navigation";
import { SGNavigationProvider } from "@structured-growth/sg-ui/adapters";
import type { ReactNode } from "react";

export function UIRouter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return <SGNavigationProvider value={{
    pathname,
    navigate: (href, options) => options?.replace ? router.replace(href) : router.push(href),
  }}>{children}</SGNavigationProvider>;
}
```

Translation defaults are English with variable interpolation. Use
`SGTranslationProvider` to connect an application's translation engine and
namespace loading. Use `SGAccountProvider` for navigation account operations;
SGUI never stores credentials or calls platform authentication endpoints.
The host handles refresh/navigation after organization changes.

Pagination and state hooks use explicit opt-in local/session persistence and accept
arbitrary page sizes. See [hook mappings](docs/developer/react-aria-pagination-state.md)
for configuration, hydration and breaking persistence defaults. See
[server component boundaries](docs/developer/react-aria-server-components.md) for
server rendering and selective client entry points.

## AI coding and releases

[AGENTS.md](AGENTS.md) defines the library's development conventions, including
the UI rules adapted from the learner platform. See [guidance provenance](docs/agent-guidance-migration.md)
and [component architecture](docs/developer/component-architecture.md).
[GitHub setup](docs/github-setup.md) explains required secrets and settings.
[Migration inventory](docs/migration.md) records the extraction and application
integration boundaries.

Start **AI implementation** in GitHub Actions with a task and acceptance criteria.
The workflow generates a patch and a Conventional Commit PR title, checks them in
a separate job, and opens a draft PR. Squash-merge using the validated title.

Once checks pass on main, semantic-release automatically versions, publishes to
public npm, and creates GitHub release notes and tags. There are no changeset files
or release PRs to maintain. The highest impact since the last tag determines the bump:

- `fix:` or `perf:`: patch
- `feat:`: minor
- `!` or a `BREAKING CHANGE:` footer: major
- Documentation/maintenance commits without breaking changes: no release

The first release is `1.0.0` if no previous release tag exists. The repository's
`0.0.0-development` version is a placeholder; published packages contain the real
version. Releases require configured npm credentials or trusted publishing.
AI-generated changes remain draft PRs for review; merging a release-worthy change
to main triggers publication automatically.

InsertContentMenuControl, TextAlignMenuControl, TextColorPickerControl and
TextStyleMenuControl now use the owned foundation and migrated-module boundaries.
See [editor menu contracts](docs/developer/react-aria-editor-menus.md) for host callbacks,
checked formatting state and the breaking semantic color preset mapping. Load
/styles.css and provide Provider or ThemeScope. Surrounding editor migration remains open.

RichTextFormattingToolbar now uses the owned foundation and migrated-module
boundaries. See [formatting toolbar contracts](docs/developer/react-aria-formatting-toolbar.md)
for named formatting actions, controlled active state, selection preparation and
callback availability. Load /styles.css and provide Provider or ThemeScope.
See the owned editor section contract below.

FloatingTextSelectionToolbar, DocumentEditorLayout, DocumentEditorToolbar and
ContentEditorChrome now use the owned foundation and migrated-module boundaries.
See [editor layout and selection contracts](docs/developer/react-aria-editor-layout.md) for host scrolling, keyboard selection access, native
status colors and the breaking menu onPress(anchor) callback mapping. Load
/styles.css and provide Provider or ThemeScope. Broad editor/grid acceptance gates remain open.

PageRichTextEditorSection (M-34), including its Lexical image decoration, now uses
the owned foundation and migrated-module boundaries. See [editor section contracts](docs/developer/react-aria-editor-section.md)
for stylesheet/scope requirements, native styling/ref, live read-only state,
document reset and formatting-preserving link behavior. Broad editor/grid and
U/X/R/Z acceptance gates remain open.

DataToolbar (M-20), including columns, sort, filter and selection menus, now uses
the owned foundation and migrated-module boundaries. See [data toolbar contracts](docs/developer/react-aria-data-toolbar.md) for controlled host state, draft menus, native styling/ref and scope requirements.
Load `/styles.css` and provide Provider or ThemeScope. Grid migration remains open.

AppDataGrid public renderer/types/helpers/parts, AppDataGridShell and
LearnerClassesDataGrid now use the owned foundation and strict whole-directory
boundaries. See [catalog grid integration](docs/developer/react-aria-catalog-grid.md)
for breaking mappings, one shared shell state owner and opt-in hydration-safe
persistence. Load /styles.css and provide Provider or ThemeScope.
Broad G/U/X/R/Z acceptance remains open.

AppDataGridRowDnd and public catalog grid row reorder now use the owned
foundation and migrated-module boundaries. See [grid reorder contracts](docs/developer/react-aria-grid-reorder.md)
for the complete single-page dataset boundary, drag/Move requests, cancellation,
source focus and host persistence/rollback ownership. Broad G/U/X/R/Z gates remain open.

The public icons (M-36) and primitives (M-37) now use owned implementations,
with whole-directory source/transitive/declaration boundaries. See
[icon mappings](docs/developer/react-aria-icons.md) and
[primitive mappings](docs/developer/react-aria-primitives.md) for preserved names,
owned props and deliberate breaking removals. Import `/styles.css` and provide
Provider or ThemeScope. The public theme also uses owned scopes; broad acceptance remains open.

See the [public theme migration](docs/developer/react-aria-theme.md) for scoped settings, token overrides and removed theme objects.

[Grid preset factories](docs/developer/react-aria-grid-presets.md) supply host-translated labels, canonical statuses and default column locks.
