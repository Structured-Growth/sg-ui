# SGUI component architecture

The shipped catalog uses SGUI-owned contracts, React Aria interactions, generated
tokens, compiled CSS Modules, TanStack row processing and Lexical editing. The
learner platform is extraction provenance and supplies no runtime dependency.
Public App/Class names remain where useful; new learning presentation APIs use Course.
Implementation removal and final acceptance are separate: consult the
[execution record](react-aria-progress.md), [master list](react-aria-master-task-list.md)
and [removal audit](react-aria-removal-audit.md) for remaining gates.

## Layers and source layout

| Layer | Source and responsibility |
| --- | --- |
| Tokens | `src/foundation/tokens.json` and generated outputs own values/variable names |
| Presentation | Native elements, owned typography and compiled CSS; no interaction engine requirement for eligible modules |
| Interaction | Selected React Aria subpath imports inside implementations; map to owned props/events/refs |
| Catalog compositions | `src/components/<Component>` composes owned controls, colocated stories and tests |
| Specialist behavior | Grid uses TanStack row processing and React Aria interaction; editor uses Lexical behind owned section contracts |
| Visual/locale scope | `src/theme` exposes Provider/ThemeScope/AppThemeProvider; foundation owns scope and tokens |
| Host integration | `src/adapters`, `src/i18n`, hooks and presentation models; routing/accounts/translations/data policy stay host-owned |
| Package surface | `src/index.ts`, public barrels and explicit package.json exports; compiled ESM/declarations/CSS |

Dependency direction runs from compositions to owned controls to foundations.
Basic controls must not import grid/editor code. React Aria collection/state/date
objects and full upstream prop types never become public contracts. Source uses
relative imports and sibling entry points, not the package root or host aliases.
The public primitives/icons and catalog use strict source/transitive/declaration
checks; `/experimental` preserves proofs, not a parallel visual system.

## Styling, scope and accessibility

Load `/styles.css` once and provide Provider or ThemeScope, including editor dialogs
and nested grid controls. Provider bridges the host translation locale into
interactions; ThemeScope sets visuals. Theme/density/language/direction and custom
SGUI variables propagate to portals, while local layout styles do not.
`system` colors use CSS media queries with stable initial SSR markup. Fonts,
body backgrounds and global resets belong to the host.

CSS layers are `sgui.tokens` then `sgui.components`. Use generated variables,
logical properties and shared typography roles. Prefer props/variants; extend shared
tokens/styles for reusable changes. Native class/style and documented
`data-sgui-part` hooks support context-specific overrides. Unlayered host rules
outrank normal library declarations; avoid routine `!important`, whose layer
priority reverses. Do not target generated class names or private engine markup.

Density is compact or comfortable. General scopes default comfortable. Prefer compact
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
and migrations. Stories use production scopes/theme/density/locale/direction,
representative fixtures and adapters. Behavior tests live beside implementations;
composed and browser tests cover nested focus, native timing, scrolling and positioning.
Do not equate DOM assertions with screen-reader or physical-device acceptance.

For code/build changes run `pnpm check` and `pnpm build-storybook`, plus meaningful
targeted/browser/packed consumer checks for changed behavior. Build static Storybook
before browser suites; never rebuild during a run. Documentation-only work verifies
links, source paths, exports and examples without adding unrelated UI tests.

[AGENTS.md](../../AGENTS.md) provides active rules. [Migration mappings](../migration.md)
and the [read-only adoption checklist](react-aria-adoption-checklist.md) guide hosts.
