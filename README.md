# Structured Growth UI (SGUI)

A reusable React component library built on MUI, extracted from the learning
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
Most catalog components and the peer installation instructions below still describe
the extracted library. `AppInlineProgress`, `AppOperationSteps`, `EditableTitleField`
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

## Development

Use Node 24 (see `.nvmrc`) and pnpm 10.29.3:

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
pnpm add @structured-growth/sg-ui react react-dom @mui/material@^7 @mui/icons-material@^7 @mui/x-data-grid@^8 @emotion/react @emotion/styled
```

```tsx
import { AppButton, AppThemeProvider } from "@structured-growth/sg-ui";

export function Example() {
  return <AppThemeProvider><AppButton>Save</AppButton></AppThemeProvider>;
}
```

Public entry points: the package root, `/components`, `/theme`, `/hooks`,
`/icons`, `/primitives`, `/adapters`, and `/i18n`. MUI/Emotion/React are peers so
applications share one runtime. Lexical editor dependencies ship with SGUI.

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

These are proof contracts that may change during migration. Existing `AppButton`
and catalog components retain their current APIs and peers. See the
[architecture and styling guide](docs/developer/react-aria-architecture.md).
Run `pnpm test:foundation-consumer` to validate a packed Vite proof consumer.

Migrated catalog controls also have granular subpaths so a consumer can avoid
resolving the unmigrated catalog:

```tsx
import "@structured-growth/sg-ui/styles.css";
import { Provider } from "@structured-growth/sg-ui/experimental";
import { AppInlineProgress } from "@structured-growth/sg-ui/components/AppInlineProgress";

export function CourseProgress() {
  return <Provider><AppInlineProgress value={40} /></Provider>;
}
```

The other granular migrated paths are `/components/AppOperationSteps` and
`/components/EditableTitleField`. The package's legacy peer requirements remain
until the complete migration and removal audit finish. During the transition,
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
