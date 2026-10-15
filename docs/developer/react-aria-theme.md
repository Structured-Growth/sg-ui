# Public theme and production scopes

Task references: W-09, A-15 (theme mapping), Z-01–Z-03 (implementation removal;
final historical/literal audit remains open). Public `/theme` and root exports
now expose `Provider`, `ThemeScope`, `AppThemeProvider` and their owned types.
`AppThemeProvider` is the same component as Provider under its preserved name.

```tsx
import "@structured-growth/sg-ui/styles.css";
import { AppThemeProvider, ThemeScope } from "@structured-growth/sg-ui/theme";

<AppThemeProvider theme="system" density="comfortable">
  <ThemeScope theme="dark" density="compact" style={{ "--sgui-focus": "#a78bfa" }}>
    Content
  </ThemeScope>
</AppThemeProvider>;
```

The stylesheet must be loaded once. Settings default to light/comfortable/auto interaction sizing;
nested scopes inherit unspecified settings. `system` uses CSS media queries,
so server and initial client markup stay stable without browser reads. ThemeScope
accepts native div attributes/style/ref. Provider additionally bridges the host
`SGTranslationProvider` locale to interaction locale and scope language/direction.
Its optional `dir="ltr|rtl"` overrides visual layout direction; interaction locale
continues to follow the host locale. Set a matching host locale for normal use;
the direction override also supports independent layout testing.

Portals inherit theme, density, interaction mode, language, direction and custom `--sgui-*` variables;
layout styles such as padding remain at the source root. There is no global CSS
baseline or runtime stylesheet injection. Applications own body/background/font
loading and any reset they require.

| Removed API | Owned mapping |
| --- | --- |
| `theme`, `lightTheme`, `darkTheme`, upstream ThemeProvider/theme objects | theme setting on Provider/ThemeScope |
| palette/typography/component override objects | generated `/tokens`, CSS variables and documented component parts |
| upstream typography augmentation | owned Typography roles, including `bodyAlt2` |
| global baseline installed by AppThemeProvider | host-owned global styles; scoped library normalization |

The docs website and private native fixtures import compiled production tokens and
use the public Provider. Native fixture globals preserve light/dark/system,
compact/comfortable, representative en-US/fr-FR/ar-EG locales and auto/ltr/rtl
layout direction. These locales are test examples, not a library supported-locale
policy. Translation fallback uses the same ICU formatter and locale adapter as
consumers. Nested explicit settings override outer globals as production scopes do.
The public website has separate fixed chrome and shared demo settings; see
[docs architecture](docs-website.md).

The public `/tokens` entry also exports `defaultThemeTokens.light` and `.dark`,
generated from the same source as the stylesheet. These resolved shared/color
snapshots can restore the built-in baseline inside an application-owned visual
scope. They exclude density settings and component aliases. Ordinary standalone
consumers already receive the defaults from styles.css and Provider and do not
need to apply a snapshot. The docs demo's None option uses them to prevent the
website identity from leaking into baseline examples; contrast and forced-color
policy remain host-owned. See the [token pipeline guide](theme-token-pipeline.md).

The retired runtime, peer and development packages were removed after source
imports and augmentation consumers were eliminated. Packed checks must confirm
React 18.3/19 consumers install without those peers. This closes dependency
removal, not full accessibility, screen-reader, browser, performance or final
historical-reference acceptance.

See the [classified removal audit](react-aria-removal-audit.md) for source/output
guards, reconciled extraction destinations and remaining historical/legal text.


### Shared scrollbar appearance

Provider/ThemeScope and overlay visual roots compose the owned Scrollbars module.
The shared rule applies thin native bars and transparent tracks within the scope;
thumbs appear on hover, focus within, or active scrolling on fine-pointer hover
devices. A passive document capture listener shared by mounted scopes marks only
the scrolling element for one second after its latest native scroll event. This
also covers scoped portal roots and does not depend on pointer-enter, wheel, or
window focus changes. The last scope removes the listener and pending timers.
Coarse pointers retain native visibility, and forced colors use automatic system
colors.
`--sgui-scrollbar-thumb` is a component alias of the border semantic, so identity
and appearance scopes supply its color. Override that alias in a scope to change
scrollbar color consistently. Containers still own overflow, height, width and
stable gutter allocation; the shared rule introduces no scrollports or gutters.


## Density, interaction sizing and responsive layout

`density="compact|comfortable"` selects spacing. `interactionMode="auto|pointer|touch"`
selects the target/icon presentation policy. Both inherit, independently, through
Provider/ThemeScope and owned overlay portals. AppThemeProvider accepts the same
props. Neither setting enables/disables any input or controls whether navigation
is expanded. Viewport breakpoints continue to own stacking and overlay placement.

Auto uses CSS `any-pointer: coarse`, conservatively adapting for touch-capable hybrid
hardware. Explicit pointer/touch modes override that policy locally. CSS resolves
auto without browser reads during SSR or hydration, and updates with capabilities.
Host applications own preference controls/persistence and can pass saved choices.

| Role | Pointer defaults | Touch defaults |
| --- | --- | --- |
| Control target floor | No added floor; density applies | 44px |
| Navigation icon | 16px | 20px |
| Compact control / navigation row | 32px / 32px | At least 44px |
| Comfortable control / navigation row | 44px / 36px | At least 44px |

These are theme-backed minimums, not fixed heights or device names. Controls can
grow to fit their text, padding and borders; density does not clip readable content.
Override `--sgui-compact-control-height`, `--sgui-comfortable-control-height`,
`--sgui-compact-navigation-item-height`, `--sgui-comfortable-navigation-item-height`,
`--sgui-touch-target-size`, or `--sgui-touch-navigation-icon-size` through scope
style. Density and interaction roles reference these shared values, then component
aliases consume the roles. A compact touch workspace can therefore use 48px
control targets and 24px navigation icons without altering body text or branding.

Common buttons/icon buttons, fields, selection controls, menus/options, tabs,
pagination and navigation consume the target floor. This is a sizing policy,
not certification of every specialized component or physical device. Host-provided
custom controls and explicit geometry overrides remain host responsibilities.
