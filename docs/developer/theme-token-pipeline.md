# Identity and component token pipeline

Task family: DOCS-012. Implement in dependency order: identity palette →
appearance/contrast semantic mappings → component tokens → component styles.
The existing library palette and public scope contracts remain compatible. The
website retains its Structured Growth identity; demo identities remain Material,
Apple and Editorial. This task does not change commercial terms or F/T/V/A counts.

## Functionality tasks

- [x] DOCS-012-a01 Define named raw palettes for all four identities and shared
  validation/system colors. Palette values have no component names or UI roles.
- [x] DOCS-012-a02 Separate identity font/shape settings from colors. Preserve
  current family, radius, density and standard/increased focus behavior.
- [x] DOCS-012-b01 Define complete light/dark standard semantic maps for all 41
  owned color roles using palette or semantic references rather than literal colors.
- [x] DOCS-012-b02 Define complete increased-contrast maps independently of
  appearance. Keep meaningful text/action/validation and focus/border pairs readable.
- [x] DOCS-012-b03 Define forced-color system mappings that take precedence over
  selected appearance/contrast. Retain stable SSR and live system subscriptions.
- [x] DOCS-012-c01 Audit existing component aliases and introduce owned slots for
  remaining component color dependencies. Preserve the exact semantic role of each
  migrated declaration; do not silently switch a surface or interaction state.
- [x] DOCS-012-c02 Route every library CSS module's semantic color dependencies
  through component aliases. Keep shared spacing/typography roles and intentional
  native system-color rules; preserve compiled layers, focus and scroll behavior.
- [x] DOCS-012-d01 Emit typed component-reference metadata with public tokens so
  the docs can inspect the actual graph through compiled exports.
- [x] DOCS-012-d02 Validate palette/semantic references, cycles, role completeness,
  alias types and component style routing. Reject literal palette colors and direct
  semantic color consumption in library component styles.
- [x] DOCS-012-f01 Show the pipeline, role mappings and component dependencies on
  the theming page using SGUI elements. Explain component override points and shared
  geometry; copied component examples use the same resolved theme as their preview.

## Bounded validation tasks

- [x] DOCS-012-e01 Run existing theme/source/portal checks and meaningful graph
  failures. Verify website/demo isolation and component-only overrides with real
  production components at both densities and relevant contrast/appearance modes.
- [x] DOCS-012-e02 Run owned token/style/type guards and affected native scope
  checks after rebuilding once. Record exact tested inputs and remaining acceptance
  limits; do not rebuild a fixture host during a suite.

Do not check a leaf merely because its source file exists. Record implemented
boundaries, commands and outcomes in the receipt below; broaden regression only
when a concrete failure or changed contract warrants it.

## Implementation receipt

Implementation started on 2026-10-14. The existing library already supplies named
base tokens, 42 semantic color roles and 34 component aliases; scoped CSS rebinds
aliases at visual and density boundaries. Current gaps are app identities defined
as inline semantic literals/component overrides, and component styles bypassing
their declared component tier. The work removes those shortcuts while preserving
their intended dependencies.


### Completed baseline — 2026-10-14

All leaves above are complete for this bounded implementation. Four identities
have named raw palettes, separate font/shape settings and 42 semantic color roles
for each light/dark × standard/increased combination (16 complete maps), plus
one forced-OS map. Material, Apple and Editorial remain selectable demo identities;
Structured Growth remains the fixed website identity. The docs theme resolver
emits 42 semantic variables and four font/shape/focus settings, without component
color overrides or CSS reset shortcuts. Apple's standard light border was darkened
slightly to meet the existing 3:1 surface-pair checks; accent and background colors
were preserved. Increased text/action/status pairs meet the named 7:1 checks and
focus/border pairs meet 3:1. These are bounded named-pair checks, not full visual,
device or assistive-technology acceptance.

The library component tier now contains 284 aliases (34 existing plus 250 new).
64 CSS modules route 321 previously direct semantic color references through
component aliases while retaining each declaration's original semantic target.
85 focus/shape references also reuse existing component aliases. Shared typography,
spacing and intentional native forced-color rules remain. Generated public
`componentTokenReferences` metadata reports the actual token dependency. Guards
reject direct semantic color consumption and literal palette colors in library
CSS modules; generation validates tier direction, type, completeness and cycles.
The private Select positioning helper now has an owned declaration boundary;
its previous upstream prop-type leak was found by the packed package check.

The theming page exposes a token-chain inspector, named palettes and the current
semantic map. Its copyable example demonstrates a component-only primary-button
override in a nested compact scope and a dialog portal, with the sibling button,
field and website theme preserved. Existing component examples share the same
resolved identity mappings as their source panels. AGENTS.md records the layering
rule. The library has no runtime dependency on the Next.js website.

Validated working source is based on Git head
`ddb624fdad1289be71be62da06fe2908a2386a03`, with uncommitted migration work.
The 963-file source manifest at `/tmp/sgui-theme-source-manifest.json` has aggregate
SHA-256 `337ffe629daac200465671fab484a053e46f8303c1bf1d56f86e9c021c5dbb01`.
The digest hashes sorted lines of `<file SHA-256>  <relative path>`, covering UI
source/scripts/browser tests and docs app/components/examples/theme/tests/scripts/
content plus both package manifests; documentation receipts and build outputs are
excluded. This receipt does not claim a committed or production-approved head.

Validation used Node 24.19.0 and pnpm 10.29.3:

- `pnpm --filter @structured-growth/sg-ui build`, `typecheck`,
  `foundations:check` and `test:package`: pass. Package entry imports, consumer
  types, packed CSS/declarations/assets and preserved notices pass.
- `pnpm --filter @structured-growth/sg-ui test:foundations`: 29/29 pass.
  The CSS pipeline assertion now checks both the consumed component alias and its
  unchanged action dependency. The first sandboxed run needed local-server access;
  the subsequent stale assertion was corrected and the final run passed.
- Existing Button/Menu/Dialog/TextField unit tests: 45/45 pass. Existing private
  Select positioning helper smoke: 1/1 pass. Its unit/type checks were run after
  replacing the leaking declaration; the final fresh build passed the package gate.
- `pnpm --filter @structured-growth/docs theme:check`: 7/7 pass, including exact
  semantic inventory parity with compiled public tokens, missing references,
  cycles, completeness, named contrast pairs and forced-OS precedence.
- Docs `typecheck` and production `build`: pass. Catalog guard covers 90 pages
  and all 200 public component/icon names with usage guidance.
- `pnpm --filter @structured-growth/docs exec playwright test`: 10/10 pass.
  All 90 routes, 360 component examples and 720 initial/changed source snapshots
  remain valid; three new theme-override source snapshots also compile. New browser
  evidence covers all three demo identities × two appearances × two contrasts,
  both densities, actual component overrides, portal inheritance, website
  isolation and clipboard/source parity. Log: `/tmp/sgui-theme-docs-tests-final.log`.
- Fresh native fixtures, then `pnpm --filter @structured-growth/sg-ui exec
  playwright test token-tier-scope.spec.ts`: 15/15 pass across Chromium, Firefox
  and WebKit. Two former expectations per engine assumed real buttons ignored
  component overrides; they now require the explicit component slot to win.
  The portal case was then rerun in all three engines with an additional actual
  comfortable-density button assertion: 3/3 pass. No host was rebuilt during any
  suite. Log:
  `/tmp/sgui-theme-native-tests-final.log`.
- Visually inspected the production theme inspector; preview restored at
  `http://127.0.0.1:3000/theming`.

Broader F/T/V/A counts, full production/browser matrices, version archives,
physical-device and assistive-technology acceptance remain separate backlog work.
No package version, commercial license, release or publication was changed.

The [Structured Growth website color guide](structured-growth-style-guide.md)
records the current navy/gold direction with white and cool-gray surfaces, observed source colors, adaptations
and accessible usage. It applies to the fixed website identity, independently of
the three selectable demo identities.


### Global-default demo baseline — DOCS-041, 2026-10-14

The demo selector also offers `none` (None — global defaults). The four named
identities remain; this baseline adds four appearance/contrast maps, bringing the
current inventory to 21 maps including forced OS colors. Standard defaults come
from generated `defaultThemeTokens` in the public `/tokens` entry. The generator
resolves shared and light/dark semantic values from the same source as styles.css;
it excludes density and component aliases, which continue to rebind inside scopes.
Do not maintain a second handwritten baseline palette.

The docs preview applies these generated defaults explicitly to replace inherited
website overrides. A standalone consumer loading styles.css with Provider already
receives these defaults without this snapshot. Increased contrast uses a
contrast-checked neutral/blue map, and forced colors retain system priority.
None means no demo identity override, not an unstyled/native HTML mode. Built-in
roles already include action/onAction, neutral actions, validation error, warning,
success, information, text, surfaces and focus. It does not add secondary/tertiary
brand-color families or change button priority APIs.


### Density and interaction sizing — 2026-10-15

The token source adds paired pointer/touch dimension groups. Generated CSS establishes
pointer defaults, explicit pointer/touch scope overrides, and auto touch adaptation
under any-pointer: coarse. Interaction roles are a public typed token tier; component
metadata describes that dependency. Nested density-only controls inherit interaction
roles, and portals rebind against their inherited scope policy. Density roles now
reference theme-owned shared size values rather than flattening them, preserving
built-in effective defaults while allowing theme-specific compact/comfortable sizes.
The built-in default snapshots exclude active density/interaction roles and component
aliases, so restoring an identity does not freeze the input-capability policy.
