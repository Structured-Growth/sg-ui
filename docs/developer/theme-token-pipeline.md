# Identity and component token pipeline

Task family: DOCS-012. Implement in dependency order: identity palette →
appearance/contrast semantic mappings → component tokens → component styles.
The existing library palette and public scope contracts remain compatible. The
website retains its Structured Growth identity; demo identities remain Material,
Apple and Editorial. This task does not change commercial terms or F/T/V/A counts.

## Completed delivery

All twelve token-pipeline tasks are complete. Their checklist is
archived.
This guide retains technical decisions and evidence; current work belongs in
[the unified backlog](backlog.md).

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

Validation used Node 24.19.0 and pnpm 10.29.3:

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
