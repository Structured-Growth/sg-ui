# Token tiers and semantic states

Current source contract: A-D-01 / P08-D01-SCHEMA, reconciled 2026-10-16.
The original D-02/D-04 batch164 role table is retained and updated below; current
component CSS consumes owned component aliases. This guide describes the shipped
compiler, not broad design/accessibility acceptance. See
[component architecture](component-architecture.md),
[token pipeline](theme-token-pipeline.md) and
[development validation](react-aria-development-validation.md).

Import `@structured-growth/sg-ui/styles.css` and use Provider or ThemeScope.
The single authored source for built-in library defaults is
`packages/ui/src/foundation/tokens.json`; its compiler is
`packages/ui/scripts/tokens.mjs`. Docs identities in `apps/docs/theme` are separate
host configuration. They do not replace the built-in token source.

## Record and value schema

The JSON root contains exactly the nine nonempty object groups listed below.
Each group is a flat map of token names to records. A name matches
`^[a-z][A-Za-z0-9]*$`: lower-case initial, then ASCII letters/digits; camelCase is
the convention. Nested groups, group-level metadata and inherited types are not
implemented. Each record explicitly supplies `$type` and `$value`, for example
`"surface": { "$type": "color", "$value": "{base.white}" }` in `light`.
The compiler requires those two fields but does not reject or validate additional
record fields; `$description`, `$extensions` or `$deprecated` would be ignored and
are not propagated into outputs. Do not rely on them as generated metadata.

Only `base` may hold literals. Every other record's entire value is a case-sensitive
`"{group.key}"` alias to an existing record of the same `$type`. Alias chains are
resolved recursively; missing targets and cycles fail generation. Embedded
interpolation, fallback expressions, partial/property references, JSON Pointer and
external-file references are unsupported. The compiler recognizes an alias by
`^\{([^}]+)\}$` after string coercion; authored aliases must be strings.

| `$type` | Literal `$value` accepted in `base` |
| --- | --- |
| `color` | Six or eight hexadecimal digits with `#`, case-insensitive; e.g. `"#ffffff"`, `"#00000040"` (RGBA) |
| `dimension` | Nonnegative integer/decimal with leading digit and `rem`; e.g. `"0rem"`, `"0.125rem"`; no sign, exponent, `px`, percentage or leading-dot fraction |
| `duration` | Nonnegative integer followed by `ms`, e.g. `"120ms"`; no fractions or seconds |
| `number` | Finite JSON number; no unit or quoted number |
| `fontFamily` | String without semicolon, braces or newline; the current stack is CSS family-list text, including quotes/commas |
| `shadow` | String matching `^\d+rem \d+(\.\d+)?rem \d+(\.\d+)?rem #[\da-f]{8}$` (case-insensitive); x offset is an integer, y/blur may be decimals; no spread, inset, negatives or multiple shadows |

These are compiler validation rules, not a general CSS parser. In particular the
font-family check does not validate family grammar or require a nonempty string;
regex-based literal checks use JavaScript coercion. Author the documented string
forms rather than relying on accidental coercion. Other `$type` values fail.

## DTCG compatibility boundary

The comparison target is the [DTCG Format Module 2025.10](https://www.designtokens.org/tr/2025.10/format/),
a Community Group report. SGUI adapts its `$type`/`$value` records and whole-token
curly-brace aliases; this source is not a conforming interchange document or a
conforming general-purpose DTCG reader.

Compared with that revision's [types](https://www.designtokens.org/tr/2025.10/format/#types)
and [shadow](https://www.designtokens.org/tr/2025.10/format/#shadow) representations,
SGUI uses hex strings instead of structured colors, rem/ms strings instead of
value/unit objects, and CSS shadow strings instead of objects/arrays. Family
stacks are CSS strings, not structured fallback arrays; weights use `number`, not
`fontWeight`. Finite numbers and simple family strings overlap. SGUI does not
implement arbitrary nesting, type inheritance, `$root`, `$extends`, JSON Pointer,
property references, or the remaining composite/type forms.

An interchange adapter would need representation conversion, reference/group
mapping and round-trip fixtures. None is shipped or promised here. Use the
SGUI-specific schema above and generated public exports below for current work.

## Source tiers and integrity

| Source group | Tier | Allowed reference groups | CSS treatment |
| --- | --- | --- | --- |
| `base` | Palette and scale | None; literals only | Private values; no base CSS variables |
| `shared` | Shared typography, spacing, geometry, motion and elevation | `base` | Resolved literals |
| `light` | Semantic color | `base`, `light` | Base resolves to literal; same-theme alias stays `var()` |
| `dark` | Semantic color | `base`, `dark` | Base resolves to literal; same-theme alias stays `var()` |
| `compact` | Density | `base`, `shared` | Base resolves to literal; shared alias stays `var()` |
| `comfortable` | Density | `base`, `shared` | Base resolves to literal; shared alias stays `var()` |
| `pointer` | Interaction | `shared` | `var()` |
| `touch` | Interaction | `shared` | `var()` |
| `component` | Component slots | `shared`, `light`, `compact`, `pointer`, `component` | `var()` |

In component references, `light`, `compact` and `pointer` identify canonical key
sets, not forced settings: `{light.action}` emits `var(--sgui-action)`,
`{compact.controlHeight}` emits `var(--sgui-control-height)` and
`{pointer.minimumTargetSize}` emits `var(--sgui-minimum-target-size)`.
Dark/comfortable/touch provide the corresponding same-named variables. Direct
component references to base/dark/comfortable/touch and component literals fail.
Tier direction is exactly the table; shared/semantic/density/interaction cannot
point back to components. Semantic records must have `$type: "color"`.

The compiler requires identical key sets and types for light/dark,
compact/comfortable and pointer/touch. Same-theme alias topology must also match
between light/dark: a role aliasing another semantic role must target the same key
in both themes. This keeps inherited-theme rebinding unambiguous.

CSS names are `--sgui-` plus the token key with each uppercase letter changed to
`-` plus lowercase; the group name is omitted (`bodyAlt2` → `--sgui-body-alt2`).
The canonical emitted groups shared/light/compact/pointer/component must have no
colliding CSS names, including collisions caused by case conversion. Paired groups
intentionally emit the same names; private base names do not enter that collision
check. Generation preserves source insertion order and uses fixed group/selector
order; byte determinism does not mean arbitrary JSON key reordering is normalized.

Base literals are deduplicated by **type and value**, not value alone. For example,
body/spacing values can share one dimension scale entry; body1/body and h5/heading
roles can share scale values. Number line heights and weights remain typed numbers.
The first existing scale role names provide stable canonical source names. Roles
with different meaning keep separate public keys even when currently equal:
raised/overlay/plain surfaces, pressed/hover surfaces, destructive/error colors,
neutral text/action colors and separator/divider. These are deliberate role aliases,
not accidental duplicate palette literals. A host can override a derived role
independently or override its source role and let the alias follow.

## Complete light/dark role table

Values below are resolved defaults. The alias column gives same-theme relationships
that survive in emitted CSS; `palette` means a resolved source literal. The legacy
roles `surface`, `surfaceSubtle`, `text`, `textMuted`, `border`, `divider`, `action`,
`actionHover`, `onAction`, `danger`, `focus`, `backdrop` keep their previous defaults.

| Role | Light | Dark | Alias / intended use |
| --- | --- | --- | --- |
| `surface` | `#ffffff` | `#0f172a` | `palette`; plain surface |
| `surfaceSubtle` | `#f8fafc` | `#1e293b` | `palette`; subtle surface |
| `text` | `#0f172a` | `#e2e8f0` | `palette`; body text |
| `textMuted` | `#475569` | `#cbd5e1` | `palette`; secondary text |
| `textSubtle` | `#64748b` | `#94a3b8` | `palette`; subtle text |
| `border` | `#475569` | `#cbd5e1` | `palette`; essential control boundary |
| `divider` | `#cbd5e1` | `#475569` | `palette`; decorative division |
| `action` | `#1d4ed8` | `#60a5fa` | `palette`; primary default |
| `actionHover` | `#1e40af` | `#93c5fd` | `palette`; primary hover |
| `onAction` | `#ffffff` | `#0f172a` | `palette`; primary foreground |
| `danger` | `#b91c1c` | `#f87171` | `palette`; legacy error/destructive foreground |
| `focus` | `#1d4ed8` | `#60a5fa` | `palette`; focus ring |
| `backdrop` | `#0f172a80` | `#000000b3` | `palette`; translucent overlay scrim |
| `surfaceRaised` | `#ffffff` | `#0f172a` | `surface`; raised surface (equal default, separate role) |
| `surfaceOverlay` | `#ffffff` | `#0f172a` | `surface`; overlay surface (equal default, separate role) |
| `surfaceHover` | `#f8fafc` | `#1e293b` | `surfaceSubtle`; generic hover surface |
| `surfacePressed` | `#f8fafc` | `#1e293b` | `surfaceSubtle`; generic pressed surface |
| `textInverse` | `#ffffff` | `#0f172a` | `surface`; inverse foreground |
| `textDisabled` | `#475569` | `#cbd5e1` | `textMuted`; disabled foreground |
| `borderSubtle` | `#cbd5e1` | `#475569` | `divider`; decorative boundary |
| `separator` | `#cbd5e1` | `#475569` | `divider`; decorative separator |
| `actionPressed` | `#1e40af` | `#93c5fd` | `actionHover`; primary pressed |
| `actionNeutral` | `#0f172a` | `#e2e8f0` | `text`; neutral default |
| `actionNeutralHover` | `#475569` | `#cbd5e1` | `textMuted`; neutral hover |
| `actionNeutralPressed` | `#0f172a` | `#e2e8f0` | `text`; neutral pressed |
| `onActionNeutral` | `#ffffff` | `#0f172a` | `surface`; neutral foreground |
| `actionDestructive` | `#b91c1c` | `#f87171` | `danger`; destructive default |
| `onActionDestructive` | `#ffffff` | `#0f172a` | `onAction`; destructive foreground |
| `surfaceSelected` | `#f8fafc` | `#1e293b` | `surfaceSubtle`; selected surface |
| `textSelected` | `#0f172a` | `#e2e8f0` | `text`; selected foreground |
| `borderSelected` | `#1d4ed8` | `#60a5fa` | `action`; selected indicator |
| `surfaceDisabled` | `#f8fafc` | `#1e293b` | `surfaceSubtle`; disabled surface |
| `borderDisabled` | `#cbd5e1` | `#475569` | `divider`; disabled boundary |
| `validationError` | `#b91c1c` | `#f87171` | `danger`; error foreground/indicator |
| `validationInfo` | `#1d4ed8` | `#60a5fa` | `action`; information foreground/indicator |
| `validationSurface` | `#f8fafc` | `#1e293b` | `surfaceSubtle`; validation surface |
| `focusOnRaised` | `#1d4ed8` | `#60a5fa` | `focus`; ring on raised surface |
| `focusOnOverlay` | `#1d4ed8` | `#60a5fa` | `focus`; ring on overlay surface |
| `actionDestructiveHover` | `#991b1b` | `#fca5a5` | `palette`; destructive hover |
| `actionDestructivePressed` | `#991b1b` | `#fca5a5` | `palette`; destructive pressed |
| `validationSuccess` | `#15803d` | `#4ade80` | `palette`; success foreground/indicator |
| `validationWarning` | `#92400e` | `#fcd34d` | `palette`; warning foreground/indicator |

Validation roles only supply presentation colors. They do not add validation rules,
messages, status announcements, upload checks or host data behavior. Selected,
hovered and pressed roles similarly do not add runtime interaction state.
Disabled text/borders, decorative separators and translucent backdrops are not
asserted as essential text/control contrast pairs. Do not use them for essential
information. State color alone does not communicate meaning.

## Component relationships

All entries are aliases, including dimensions, density and shadow slots. There is
one component group for both themes, densities and interaction policies. The table
below is a selected mapping; the generated `componentTokenReferences` export
provides the full current inventory. Component CSS uses these owned slot aliases;
adding an alias does not itself add a component variant or prop.

| Component slot | Semantic/shared/density source |
| --- | --- |
| `buttonPrimaryBackground` | `light.action` |
| `buttonPrimaryHoverBackground` | `light.actionHover` |
| `buttonPrimaryPressedBackground` | `light.actionPressed` |
| `buttonPrimaryText` | `light.onAction` |
| `buttonNeutralBackground` | `light.actionNeutral` |
| `buttonNeutralHoverBackground` | `light.actionNeutralHover` |
| `buttonNeutralPressedBackground` | `light.actionNeutralPressed` |
| `buttonNeutralText` | `light.onActionNeutral` |
| `buttonDestructiveBackground` | `light.actionDestructive` |
| `buttonDestructiveHoverBackground` | `light.actionDestructiveHover` |
| `buttonDestructivePressedBackground` | `light.actionDestructivePressed` |
| `buttonDestructiveText` | `light.onActionDestructive` |
| `buttonRadius` | `shared.controlRadius` |
| `buttonHeight` | `compact.controlHeight` |
| `buttonPadding` | `compact.controlPadding` |
| `fieldBackground` | `light.surface` |
| `fieldText` | `light.text` |
| `fieldBorder` | `light.border` |
| `fieldInvalidBorder` | `light.validationError` |
| `menuBackground` | `light.surfaceOverlay` |
| `menuHoverBackground` | `light.surfaceHover` |
| `menuPressedBackground` | `light.surfacePressed` |
| `menuSelectedBackground` | `light.surfaceSelected` |
| `menuSelectedText` | `light.textSelected` |
| `menuSeparator` | `light.separator` |
| `dialogBackground` | `light.surfaceOverlay` |
| `dialogBackdrop` | `light.backdrop` |
| `dialogShadow` | `shared.overlayShadow` |
| `cardBackground` | `light.surfaceRaised` |
| `cardBorder` | `light.borderSubtle` |
| `controlFocusColor` | `light.focus` |
| `controlFocusWidth` | `shared.focusWidth` |
| `controlFocusOffset` | `shared.focusOffset` |
| `fieldControlRadius` | `shared.fieldRadius` |

## Scopes, density and interaction policy

Generated CSS uses low-specificity `:where()` selectors in `sgui.tokens`, preceding
`sgui.components`. There are no `:root` defaults or global host resets. The six
scope/theme/density blocks declare component aliases; scope and density blocks
also redeclare same-theme semantic aliases. Light/system, explicit dark and system
dark (`prefers-color-scheme: dark`) blocks supply semantic values and color-scheme.
The scope block supplies shared literals and pointer defaults. Compact/comfortable
blocks preserve references to shared density scales. Current density keys are
`controlHeight`, `controlPadding`, `navigationItemHeight` and `controlTextSize`.

Three further blocks select interaction values: explicit pointer, explicit touch,
and auto under `@media (any-pointer: coarse)`. All preserve shared references for
`minimumTargetSize` and `navigationIconSize`. Auto starts with pointer values from
the scope block and uses touch values if any coarse pointer exists. Touch scale
currently supplies 2.75rem minimum targets and 1.25rem navigation icons; pointer
uses 0rem minimum target and 1rem navigation icons. Density remains independent:
compact controls can still have touch-sized targets. This presentation policy does
not disable any input device or substitute for keyboard accessibility.

ThemeScope defaults outside a parent to light/comfortable/auto and inherits omitted
props from its parent. It emits all scope/theme/density/interaction attributes;
Provider supplies the owned scope integration. Nested scopes and owned overlay
roots carry these settings and host `--sgui-*` style overrides. Interaction-only
attribute blocks do not themselves redeclare component aliases: use ThemeScope or
the owned overlay bridge for a complete boundary.

For example, a host rule on a nested scope may set `--sgui-action: #005a9c`;
`--sgui-button-primary-background` remains `var(--sgui-action)` there. Setting
`--sgui-danger` updates derived destructive/error aliases. A variable changed on
an arbitrary child without a scope does not rebind an inherited computed alias.
Shared roles resolve base literals, while density references to shared roles and
interaction references remain dynamic. Portals require the owned scope bridge;
this source contract alone is not native computed-style/portal verification.

## Private source and public generation

The authored base palette/scale is private: its keys are absent from public CSS and
`tokens`. The generated `packages/ui/src/foundation/tokens.css` supplies scoped
variables. `packages/ui/src/foundation/tokens.generated.ts` supplies the `/tokens`
public entry after build:

- `tokens`: key to `var(--sgui-...)` reference, and `TokenName`: its key union.
- `tokenTiers`: shared, semantic, density, interaction and component key inventories;
  `SemanticTokenName`, `InteractionTokenName`, `ComponentTokenName`: tier unions.
- `componentTokenReferences`: each component slot's immediate dependency tier/key.
- `defaultThemeTokens`: resolved light/dark shared and semantic snapshots keyed by
  CSS variable name; density, interaction and component aliases are excluded.

These are generated consumer references/metadata, not a DTCG export. Never edit
outputs by hand. From the repository root, run `pnpm tokens:generate` after changing
source, and review JSON/CSS/TypeScript together. `pnpm tokens:check` checks exact
output bytes without writing. For direct library scripts use `packages/ui` as cwd:

```sh
node scripts/tokens.mjs --check
node --test scripts/tokens.test.mjs
```

The token tests cover deterministic generation, failure fixtures, tier integrity,
metadata/dependency parity, nine CSS blocks (component rebinding in the first six),
legacy resolved defaults, interaction policy and declared contrast pairs. Base
literal deduplication by type/value is a test invariant, not a compileTokens error.
Reuse matching recorded evidence unless affected inputs change. This guide does
not require rerunning a build or broad browser suite for documentation edits.

## Declared contrast pairs and remaining evidence

The tests evaluate opaque sRGB defaults in both themes:

- 4.5:1 for body/muted/subtle text on plain, raised and overlay surfaces; subtle
  text also on subtle surface; body text on
  subtle/hover/pressed surfaces; selected text on selected surface.
- 4.5:1 for each primary, neutral and destructive foreground against its default,
  hover and pressed action background; primary/error foreground on plain surface.
- 4.5:1 for error/success/warning/information foreground against plain and validation
  surfaces. Validation background is currently the subtle surface.
- 3:1 for essential border/focus against plain surface, selected border against
  selected surface, and focus rings against raised/overlay surfaces.

These are declared pair tests, not every possible juxtaposition. Decorative separators
and disabled boundaries are intentionally excluded. Focus uses the existing offset;
the pair checks do not certify focus visibility in every composed context. Custom
host values need their own contrast review. Native computed-style, nested portal,
forced-color and actual assistive-technology evidence require coordinator-owned
follow-ups/checkpoints. D-02/D-04 parent acceptance is not closed by this slice.
