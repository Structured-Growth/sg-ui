# Token tiers and semantic states

Task slice: D-02/D-04, batch164. This defines token data and generated contracts;
component adoption and broad design/accessibility acceptance remain open.
See [component architecture](component-architecture.md) and
[development validation](react-aria-development-validation.md).

Import `@structured-growth/sg-ui/styles.css` and use Provider or ThemeScope.
The public `/tokens` entry exports `tokens`, `TokenName`, `tokenTiers`,
`SemanticTokenName` and `ComponentTokenName`. Existing token names and their
resolved values are preserved. New component tokens describe intended slot
relationships; existing component CSS has **not** been switched to them in this slice.

## Source tiers and integrity

| Source group | Tier | Allowed references | CSS treatment |
| --- | --- | --- | --- |
| `base` | Palette and scale | Literals only | Private source values, not CSS variables |
| `shared` | Shared typography, spacing, geometry, motion and elevation roles | `base` | Existing variables retain literal values |
| `light`, `dark` | Semantic color roles | `base` or same-theme semantic role | Palette aliases resolve to literals; same-theme aliases remain `var()` |
| `compact`, `comfortable` | Density roles | `base`, `shared` | Existing variables retain literal values |
| `component` | Component slot aliases | `shared`, `light`, `compact`, `component` | Always emitted as `var()` |

In component source references, `light` and `compact` identify the canonical key
sets, not a forced theme/density: `{light.action}` emits `var(--sgui-action)` and
`{compact.controlHeight}` emits `var(--sgui-control-height)`. Dark/comfortable
provide the corresponding same-named variable. Direct component palette references
and component literals are rejected. Shared, semantic and density tiers cannot
depend on component tokens; base cannot depend on roles. Every role must alias an
allowed tier; palette/scale literals belong only in base.

The compiler rejects unknown or missing groups, malformed names/records, invalid
values/types, missing references, cycles, cross-tier references, emitted-name
collisions and light/dark or compact/comfortable key/type differences. Semantic
same-theme alias topology must also match between light and dark. This makes the
alias graph safe to re-declare on a scope that inherits its theme.

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
one component group for both themes and densities. Consumers may use the variables
before component adoption; this does not add new component variants or props.

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

## Scoped overrides and generation

Component declarations and same-theme semantic aliases are re-declared on every
`[data-sgui-scope]`, explicit light/dark/system theme boundary and compact/comfortable
density boundary. System dark uses the existing media query. This avoids inheriting
an ancestor's already-computed alias when a descendant overrides the source variable.
There are no `:root` defaults or global host resets. Existing selector order, low
specificity, `sgui.tokens` layer, color schemes and density declarations remain.

For example, a host rule on a nested scope may set `--sgui-action: #005a9c`;
`--sgui-button-primary-background` remains `var(--sgui-action)` on that scope.
Setting `--sgui-danger` also updates the derived destructive and error aliases there.
Setting `--sgui-surface-raised` independently leaves plain/overlay surfaces available.
Use owned scopes for descendant overrides; a variable changed on an arbitrary child
without a scope does not cause an inherited computed alias to rebind. Portals must
continue to receive the production scope and host variable overrides through Provider.
Existing shared/density tokens stay literal in CSS to preserve prior override behavior;
source scale deduplication does not silently make every legacy public role dynamic.

Run `pnpm tokens:generate` after editing JSON. Commit JSON, CSS and TypeScript together.
`pnpm tokens:check` detects stale outputs. `node --test scripts/tokens.test.mjs`
checks deterministic generation, failure fixtures, tier integrity, emitted alias
relationships at all six CSS blocks, all pre-batch scoped literals and contrast pairs.

## Declared contrast pairs and remaining evidence

The tests evaluate opaque sRGB defaults in both themes:

- 4.5:1 for body/muted text on plain, raised and overlay surfaces; body text on
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
