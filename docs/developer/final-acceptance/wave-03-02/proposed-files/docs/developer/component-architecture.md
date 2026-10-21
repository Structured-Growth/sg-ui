# SGUI component architecture

The shipped catalog uses SGUI-owned contracts, React Aria interactions, generated
tokens, compiled CSS Modules, TanStack row processing and Lexical editing. The
host application is extraction provenance and supplies no runtime dependency.
Public App/Class names remain where useful; new learning presentation APIs use Course.
Implementation removal and final acceptance are separate: consult the
[execution record](react-aria-progress.md), [master list](react-aria-master-task-list.md)
and [removal audit](react-aria-removal-audit.md) for remaining gates.

Library paths in this document are relative to `packages/ui`. The Next.js app
`apps/docs` consumes public compiled exports; see [docs architecture](docs-website.md).

## Layers and source layout

| Layer | Source and responsibility |
| --- | --- |
| Tokens | `src/foundation/tokens.json` and generated outputs own values/variable names |
| Presentation | Native elements, owned typography and compiled CSS; no interaction engine requirement for eligible modules |
| Interaction | Selected React Aria subpath imports inside implementations; map to owned props/events/refs |
| Catalog compositions | `src/components/<Component>` composes owned controls and colocated tests; docs owns examples/native scenarios |
| Specialist behavior | Grid uses TanStack row processing and React Aria interaction; editor uses Lexical behind owned section contracts |
| Visual/locale scope | `src/theme` exposes Provider/ThemeScope/AppThemeProvider; foundation owns scope and tokens |
| Host integration | `src/adapters`, `src/i18n`, hooks and presentation models; routing/accounts/translations/data policy stay host-owned |
| Package surface | `src/index.ts`, public barrels and explicit package.json exports; compiled ESM/declarations/CSS |

Dependency direction runs from compositions to owned controls to foundations.
Basic controls must not import grid/editor code. React Aria collection/state/date
objects and full upstream prop types never become public contracts. Source uses
relative imports and sibling entry points, not the package root or host aliases.
The foundation check resolves every production TypeScript/JavaScript module reference
using the library compiler options. Internal references to `src/index.ts` or the
package root are forbidden at any depth, including aliases, type imports, reexports,
side effects and dynamic imports. Both runtime cycles and cycles involving erased
type edges are forbidden; reports distinguish these graphs rather than claiming
a type-only return edge is a runtime cycle. Extract shared contracts to dependency
leaves and preserve public type reexports. Nonliteral module references fail the
audit because their targets cannot be established. Tests and native fixtures are
outside this production graph. Run `node scripts/check-source-graph.mjs` and
`node --test scripts/check-source-graph.test.mjs` from `packages/ui`; both checks
also run through `foundations:check`.

The public primitives/icons and catalog use strict source/transitive/declaration
checks; `/experimental` preserves proofs, not a parallel visual system.

## Styling, scope and accessibility

Load `/styles.css` once and provide Provider or ThemeScope, including editor dialogs
and nested grid controls. Provider bridges the host translation locale into
interactions; ThemeScope sets visuals. Theme/density/interactionMode/language/direction and custom
SGUI variables propagate to portals, while local layout styles do not.
`system` colors use CSS media queries with stable initial SSR markup. Fonts,
body backgrounds and global resets belong to the host.

CSS layers are `sgui.tokens` then `sgui.components`. Use generated variables,
logical properties and shared typography roles. Prefer props/variants; extend shared
tokens/styles for reusable changes. Native class/style and documented
`data-sgui-part` hooks support context-specific overrides. Unlayered host rules
outrank normal library declarations; avoid routine `!important`, whose layer
priority reverses. Do not target generated class names or private engine markup.
See [CSS composition](react-aria-css-composition.md) for host utility-layer order,
reset ownership and the current Popover geometry exceptions.

Density is compact or comfortable. General scopes default comfortable. Interaction
sizing is an independent auto/pointer/touch policy (auto by default), inherited
through scopes and portals. Theme-backed density and interaction roles determine
geometry; viewport layout stays separate. Prefer compact
menus in catalog compositions; generic Menu inherits its scope unless density is explicit.
Verify both densities and enlarged text rather than
assuming compact means inaccessible. Semantic heading level is independent of
Typography variant; preserve bodyAlt2. Decorative icons are hidden; name icon-only
controls and standalone meaningful icons. Disabled/read-only/loading states must
retain their distinct focus/form/announcement behavior.

Host labels are host-translated. New library strings use translation keys with
`defaultMessage`. The host owns supported locales, namespaces and diagnostics;
Provider follows its locale. Visual direction overrides do not replace locale.
See [theme](react-aria-theme.md), [primitives](react-aria-primitives.md),
[icons](react-aria-icons.md) and [calendar contracts](react-aria-calendar-contracts.md).

## State and host boundaries

Each state concern has one owner. Controlled props stay authoritative; callbacks
request host acceptance. Never add UI-owned network/data/authentication services.
Grid criteria reset page zero before requesting rows and expose a combined state
snapshot; shell, cards and footer share processing/identity. Persistence is opt-in,
hydration-safe and distinct per view. Reorder requests do not persist or roll back
host data themselves. Editor uploads/save and durable assets remain host-owned.
See [grid](react-aria-catalog-grid.md), [reorder](react-aria-grid-reorder.md),
[hooks](react-aria-pagination-state.md) and [editor](react-aria-editor-section.md).

Browser globals are guarded. Interactive/context modules declare source `use client`
boundaries; the build preserves them without blanket injection. Eligible presentation
and token modules remain server-importable. Host Client Components own event handlers
and function props; Server Components may pass presentation children through scopes.
See [server packaging](react-aria-server-components.md).

## Implementation and validation

Use the [canonical component recipe](react-aria-component-recipe.md) for new controls
and migrations. Docs examples and native fixtures use production scopes/theme/density/locale/direction,
representative fixtures and adapters. Behavior tests live beside implementations;
composed and browser tests cover nested focus, native timing, scrolling and positioning.
Do not equate DOM assertions with screen-reader or physical-device acceptance.

During the user-authorized pre-production migration into `codex/dev`, follow the
[development validation policy](react-aria-development-validation.md): run meaningful
affected unit/composed tests, type/import/token guards relevant to the change, and
focused browser or build/packed-consumer checks where behavior or packaging requires
them. Update affected docs examples and native fixtures; build a fresh static fixture host
when browser checks need it, and never rebuild during a suite run. Neither each task
nor each dev integration requires `pnpm check`, a fixture-host build or the entire
browser/consumer matrix.

The coordinator runs occasional full checkpoints, initially at most once each
24 hours while new code lands, recording the exact tested head and bounded follow-up
tasks for failures. Broaden checks when a concrete regression warrants it. Targeted
passes do not establish full-suite or whole-gate acceptance. Production-bound PRs,
main pushes and reusable release CI retain complete checks; full validation remains
required before production acceptance, including outstanding manual, device and
assistive-technology gates. Documentation-only work verifies links, source paths, exports and
examples without adding unrelated UI tests.

[AGENTS.md](../../AGENTS.md) provides active rules. [Migration mappings](../migration.md)
and the [read-only adoption checklist](react-aria-adoption-checklist.md) guide hosts.

The [sliding drilldown panel scope](hierarchical-menu-scope.md) compares the
reference platform's level transitions and Back button with current SGUI support,
and tracks reusable panel extraction separately from shipped APIs.


## Field placeholders and icons (2026-10-16)

TextField, Select and ComboBox expose decorative startIcon/endIcon ReactNode slots.
AsyncMultiSelect forwards those slots and placeholder to its owned query TextField.
Slots are aria-hidden, noninteractive and follow logical text direction; actions
remain real buttons outside these slots. Labels, refs, native form values/reset,
validation and keyboard interactions retain their existing ownership. Select keeps
its chevron and intrinsic width sizing, and ComboBox keeps its options action.
Shared field CSS owns icon sizing, cap padding, rounded frame focus, read-only/
invalid/disabled styling and forced colors. Icon-free input markup remains unchanged.

Each affected docs page exposes placeholder and icon-position controls plus eight
independent source-backed examples: empty, start, end and both at both densities.
Search-like TextField/ComboBox/AsyncMultiSelect examples use owned icons; this does
not add server querying to the library or make Select a searchable combobox.


## Standard search composition (2026-10-16)

SearchField is a public root/primitives/experimental component composing TextField,
Button, Link and Typography with a React Aria nonmodal results portal. It owns query
controls, clear action, local label/keyword filtering, result presentation,
empty/loading/error/retry states, focus and Arrow/Home/End/Escape behavior. Href
results preserve native modified clicks through the SGUI navigation adapter;
action results request onResultSelect. Enter in the input can request onSearch.
Controlled/uncontrolled query, accepted native form reset and scope/density/RTL
portal ownership follow the field contracts. Component aliases own search colors.

showResults=false provides a standalone search input for hosts rendering results
elsewhere. filter="none" accepts host-filtered results; fetching, cancellation and
stale-response protection stay host-owned. Docs sidebar and catalog index both
consume this public component. Do not recreate their search markup, icon positioning,
result dropdown or keyboard handlers in site files. The site supplies catalog data,
contextual labels, page-grid filtering and routing. SearchField is for search/navigation;
ComboBox selects a form option ID and AsyncMultiSelect retains multiple records.
