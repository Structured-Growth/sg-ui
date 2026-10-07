# Structured Growth UI (SGUI)

A reusable React library for Structured Growth, extracted from the learner platform.
SGUI owns its public contracts, design tokens and compiled CSS Modules. React Aria
implements interactions, TanStack processes grid rows, and Lexical powers rich text.
The catalog, primitives, icons and public theme use the owned foundation; `/experimental`
retains proof controls and does not replace the established App-prefixed names.

**Commercial license required.** Public npm availability does not grant permission
to use this library. Obtain a written agreement from Structured Growth before use.
See [LICENSE](LICENSE) and [commercial licensing](docs/commercial-licensing.md).

Implementation migration is distinct from final acceptance. The
[execution record](docs/developer/react-aria-progress.md),
[master task list](docs/developer/react-aria-master-task-list.md) and
[removal audit](docs/developer/react-aria-removal-audit.md) record evidence and
remaining browser, device, assistive-technology, packaging and legal gates.

## Use in an application

The package is `@structured-growth/sg-ui`, configured for public npm publication
through Actions. Install an available published version under your commercial
agreement, or use a validated packed artifact before publication:

```sh
pnpm add @structured-growth/sg-ui react react-dom
```

React and React DOM are the only peers, both supporting `^18.3.1 || ^19.0.0`.
React Aria, date utilities, TanStack, Lucide and Lexical are package dependencies;
consumers do not install them as extra peers. The package engine is Node >=22.12.0.

Load the stylesheet once at the application's CSS entry and provide an owned scope:

```tsx
import "@structured-growth/sg-ui/styles.css";
import { AppButton, Provider } from "@structured-growth/sg-ui";

export function Example() {
  return <Provider theme="system">
    <AppButton onPress={() => console.log("Save requested")}>Save</AppButton>
  </Provider>;
}
```

The equivalent granular imports are:

```tsx
import "@structured-growth/sg-ui/styles.css";
import { AppButton } from "@structured-growth/sg-ui/components/AppButton";
import { Provider } from "@structured-growth/sg-ui/theme";

export function Example() {
  return <Provider><AppButton variant="outlined" tone="neutral">Save</AppButton></Provider>;
}
```

`Provider` defaults to light/comfortable, bridges the host translation locale into
interactions and propagates scope settings to overlays. `ThemeScope` supplies visual
settings alone. `AppThemeProvider` preserves its name as an alias of Provider;
old theme objects and typography augmentation are removed. Applications own global
backgrounds, resets and optional Geist font loading; system fonts are the fallback.
There is no Tailwind or runtime CSS-engine requirement.

The package exports the root, `/components`, `/theme`, `/tokens`, `/styles.css`,
`/hooks`, `/icons`, `/primitives`, `/adapters`, `/i18n`, `/experimental` and
`/experimental/icons`, plus the component and individual icon paths declared in
[package.json](package.json). These are explicit exports, not unrestricted source
paths. For example, AppPaginationFooter uses `/components/CardPaginationFooter`.
Do not import `dist` internals. Prefer granular paths for bounded module graphs;
root imports remain supported.

For an existing host, follow the [consumer migration mappings](docs/migration.md#consumer-migration-mappings)
and [read-only adoption checklist](docs/developer/react-aria-adoption-checklist.md).
They cover Vite and Next.js integration, adapters, controlled grid state and CSS/client
boundaries. See [theme contracts](docs/developer/react-aria-theme.md),
[primitives](docs/developer/react-aria-primitives.md),
[icons](docs/developer/react-aria-icons.md) and
[calendar contracts](docs/developer/react-aria-calendar-contracts.md) for detailed
settings, styling, form, date and accessibility responsibilities.

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

The [browser acceptance suite](docs/developer/react-aria-browser-acceptance.md)
executes built Storybook interactions, accessibility failures and a bounded
performance smoke workload through `pnpm test:browser`.
`pnpm test:hydration-consumer` executes packed React 18/19 Vite SSR and hydration
in browsers; `pnpm test:next-consumer` builds and runs a clean packed Next.js App
Router production consumer. See [server boundaries](docs/developer/react-aria-server-components.md).

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


For library development, use the [component architecture](docs/developer/component-architecture.md)
and [canonical component recipe](docs/developer/react-aria-component-recipe.md).
