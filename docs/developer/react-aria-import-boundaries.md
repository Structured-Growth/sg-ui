# Import boundaries and package decision

Tasks: A-A-18, A-E-08, A-I-04, A-R-03, A-R-04. The development distribution decision follows the target architecture: keep the existing package with explicit subpaths. The focused packed validation below has passed. Existing exports remain supported; no dependency, version or release change is introduced.

## Current distribution decision

Keep `@structured-growth/sg-ui` as the compatibility package for this migration.
Use its existing declared subpaths as domain boundaries. Do not add `/core`,
`/grid`, `/editor` or `/learning` aggregate barrels: aliases do not reduce
installation weight and broad aggregates increase traversal. The root and
`/components` remain convenience imports, including editor and grid exports.
Hosts that require bounded dependency traversal should choose individual paths.

| Consumer concern | Supported import recipe |
| --- | --- |
| Core action | `Button` from `/components/Button` |
| Theme scope | `Provider`, `ThemeScope` from `/theme` |
| Token data without React | `tokens` from `/tokens` |
| CSS | Explicit side-effect import of `/styles.css` once in the host |
| Primitive controls | Named exports from `/primitives`; this is an interaction barrel, not a React Aria-free presentation entry |
| Presentation frame | `CourseCardFrame` from `/components/CourseCardFrame`; React and JSX runtime only in the current emitted SGUI graph |
| Individual glyph | `AddIcon` from `/icons/AddIcon`; other declared `*Icon` paths use the same rule |
| State helpers | Named exports from `/hooks` |
| Host routing/accounts | Named exports from `/adapters` |
| Translations | Named exports from `/i18n` |
| Grid | `AppDataGrid` from `/components/AppDataGrid`; TanStack is intentional |
| Grid composition | `AppDataGridShell` from `/components/AppDataGridShell` |
| Editor | `PageRichTextEditorSection` from `/components/PageRichTextEditorSection`; Lexical is intentional |
| Learning compositions | `/components/LearnerCourseCard`, `/components/InstructorCourseCard` |

All paths in the table are relative to `@structured-growth/sg-ui`. Component types
are exported alongside their component. `AppPaginationFooter` uses the preserved
`/components/CardPaginationFooter` path. There are no public `src` or `dist`
imports. `/experimental` remains a proof API and includes grid code; it is not a
core-isolation shortcut. `/icons` remains supported when a host deliberately
wants the catalog, but library implementations import individual icon modules.

```tsx
import "@structured-growth/sg-ui/styles.css";
import { Button } from "@structured-growth/sg-ui/components/Button";
import { AddIcon } from "@structured-growth/sg-ui/icons/AddIcon";
import { Provider } from "@structured-growth/sg-ui/theme";

export function AddCourseAction({ onAdd }: { onAdd: () => void }) {
  return <Provider>
    <Button startIcon={<AddIcon />} onPress={onAdd}>Add course</Button>
  </Provider>;
}
```

In an application that already owns a Provider, render the action inside that
scope. A Next.js host places the callback-owning composition in a Client Component.
Granular imports do not change a component's `use client` contract. Tokens can be
imported without an interaction scope; scopes and explicit CSS remain required
for rendered controls. Root imports stay supported, including existing host
Client Components; they do not promise a presentation-only server dependency graph.
See [server contracts](react-aria-server-components.md).

## Installation cost and alternative

Subpaths affect JavaScript traversal/bundling, not package-manager dependency
installation. The current manifest installs ten direct Lexical packages for every
host, including hosts that import only Button. Do not describe an unused editor
as optional under this manifest.

The 2026-10-16 read-only installed-tree assessment records 48 resolved runtime
dependency directories and 79,051,504 regular-file bytes, excluding peers and
nested node_modules. Removing the direct Lexical roots from that dependency
closure removes 32 editor-exclusive directories and 9,250,028 bytes. These are
logical unpacked installed bytes, including declarations, maps and legal files;
they are not network transfer, compressed package sizes, a fresh install result
or a core-only product footprint. The remaining package still installs TanStack,
Lucide and React Aria. Exact manifest hashes and identities are retained in
the assessment.

The current compatibility choice accepts this measured installation cost and avoids adding peer setup or breaking established root editor imports. This follows the existing target architecture's instruction to keep the package and explicit subpaths before considering separate packages. No separate package is required for the migration's module-graph isolation; a dependency-light installation would require the different distribution described below. If avoiding
mandatory editor installation is required, create a separate optional editor
package and a dependency-light core package, with the existing package retained
as an umbrella depending on both. Existing root consumers would retain the cost;
new core-only consumers would explicitly switch package names. Moving Lexical
to optional dependencies or optional peers while retaining eager root reexports
is insufficient: root module resolution could fail when the editor is absent.

A split requires reviewed package names, exports, CSS/token ownership without
conflicting duplicate scopes, aligned release/dependency ranges, legal notices,
editor type imports, root compatibility tests and clean core/editor installations.
No new package names are reserved and no existing paths are removed. No breaking migration is needed for the existing-package choice; a later split must supply an explicit import/dependency migration map.

## Bounded validation

`check-icon-import-boundaries.mjs` rejects production imports from the full SGUI
icon barrel while preserving public reexports. Run it from the repository root:

```sh
node packages/ui/scripts/check-icon-import-boundaries.mjs packages/ui/src
```

After integrating the direct icon imports and building once, run the packed
boundary auditor against one already installed packed Vite consumer fixture:

```sh
node packages/ui/scripts/audit-packed-import-boundaries.mjs /absolute/packed-fixture /absolute/import-receipt.json
```

It uses in-memory builds, records resolved and rendered modules separately,
requires selected AddIcon/Plus retention and unrelated glyph elimination, verifies
explicit CSS, rejects editor/grid traversal from core paths, and includes positive
grid/editor controls plus a diagnostic supported-root Button case. Upstream
Lucide can resolve its own catalog before tree shaking; the relevant output
assertion checks rendered modules. This is not a browser, Flight or fresh-install
receipt. Preserve existing packed SSR/Flight checks for server behavior; do not
infer their success from this module audit.

The retained package-contract review records a passing 14-probe installed-consumer audit against frozen archive SHA-256 `4af68cf00eca568596d2acc0b057b67e94700428c23be444cd6049ef2a228959`. The raw audit is unavailable here; its availability record preserves the digest and links the surviving review. That review records that all eleven basic/presentation probes avoid both Lexical and grid modules; the grid and editor positive controls retain their intended engines. The supported root Button probe resolves both engines through convenience reexports but removes them from rendered JavaScript, matching the granular Button output. Each probe explicitly loads one stylesheet; CSS remains the shared full-library stylesheet, not component-split CSS. These are historical production bundler checks, not current-source execution, installation-size or browser-performance measurements.

The later fresh grid-layout package audit verifies the updated archive's build/exports/consumer types and byte inventory. It does not relabel the earlier fourteen probes as a new run. The grid fix changes layout only; package dependencies, public exports and import topology remain unchanged. Separate packages remain an available future product decision if avoiding mandatory editor installation becomes a requirement.
