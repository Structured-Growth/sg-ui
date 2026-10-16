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

### Initial server appearance and live overlay updates

Render the same `theme`, density, host locale, initial field values and civil-date
anchors on the server and first client render. The default theme is `light`;
`system` keeps that literal setting in markup and lets the loaded stylesheet
resolve `prefers-color-scheme` and `color-scheme`. It needs no preference read in
render or effect to choose the initial colors. Explicit `light` and `dark` scopes
retain their own color scheme when the system preference changes.

Load `styles.css` in the document's initial stylesheet path before showing the
interface. A late stylesheet, client-only preference restoration or a different
server/client host locale can cause a visible change outside the scope contract.
If a host persists an explicit theme, serialize the server's chosen value for the
first client render; apply later user changes through props. The host also owns
locale negotiation and timezone conversion. Supply civil `referenceDate` values
for calendar workflows rather than deriving an initial view from a client clock.

An already open owned overlay receives subsequent context changes to theme,
density, language, direction and inline `--sgui-*` overrides. A nested explicit
theme or density still wins, and sibling scopes stay independent. Arbitrary CSS
classes and layout styles do not transfer across portals: express portaled color
customization through owned variables on Provider/ThemeScope. The grid state
contract fixes controlled/uncontrolled ownership per instance; remount when changing
that ownership. Other controls retain their documented value/default/reset contracts;
a theme change does not authorize changing their ownership. Controlled hosts must
accept a requested value before it becomes authoritative.

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
| Comfortable control / navigation row | 44px / 44px | At least 44px |

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


### Shared control typography and spacing

Density owns `--sgui-control-text-size` alongside height and horizontal padding.
Compact controls use 12px text, 32px minimum height and 8px horizontal padding;
comfortable controls use 14px text, 44px minimum height and 16px horizontal padding.
Buttons, text fields, selection controls, tabs, menus and selection popups consume
this role. Body text and heading typography remain independent. Navigation label
aliases use the same control text role, and navigation row defaults follow the
corresponding control height. Existing navigation-specific tokens remain available
for explicit host overrides.

Customize `--sgui-compact-control-text-size`, `--sgui-comfortable-control-text-size`,
and the corresponding control height/padding tokens on Provider or ThemeScope.
Use scope `style` for theme overrides so nested scopes and portal overlays receive
them; CSS variables on an individual trigger cannot theme a detached portal.
Popup options inset their corner radius by popup padding and border, matching the
existing menu convention. Control and field radius roles remain independently
customizable for identities that distinguish buttons from fields.

The documentation website selects compact density at its outer Provider. Header
controls, prop controls and right-panel controls therefore share one sizing policy,
including their portals. Each live Example explicitly supplies its own density.


Select triggers and TextField/ComboBox inputs share the same field control styles:
control text size, regular content weight, line height, padding, border, radius and
focus ring. A Select is a field rather than an action button, so its selected value
does not inherit action weight or button radius. Content widths remain host/layout
owned; matching field height does not require equal widths or fixed heights that
clip enlarged text.


Select uses invisible, accessibility-hidden option labels to establish a stable
intrinsic trigger width from the longest option or placeholder. This requires no
DOM measurement and follows font, density and option changes during SSR and on the
client. Host CSS on the field can set a fixed width or maximum width; the selected
value truncates with an ellipsis inside that constraint, and the popup retains
complete option labels within its viewport bounds.


## Foundation geometry and motion scales

See [the scale contract](react-aria-foundation-scales.md) for spacing, density,
radius, border, icon, elevation and motion decisions, including intentionally
local indicator constants. See [state applicability](react-aria-state-applicability.md)
for public parts, non-color indicators and outstanding visual-state evidence.

## Motion interruption and system indications

Simple visual effects use compiled CSS and the owned motion duration; no motion
runtime or transition-end callback gates an action, dismissal or focus update.
A live reduced-motion preference cancels running navigation, spinner and progress
animations and button transitions. Pending/indeterminate semantics remain present;
ordinary animation resumes only while the corresponding state still requires it.

SideNavigation forward/Back changes select the latest menu immediately. Focus
belongs to the current menu, without a delayed animation callback. IconPanelNavigation
shows only the accepted active panel: hidden mounted panels retain drafts and stay
out of Tab order. Closing from within a panel returns focus to its trigger; replacing
the panel from within moves focus to the accepted panel's trigger. Closing from an
already focused host control preserves that host focus. These changes do not wait
for animation completion. Collapse hides/unmounts immediately; the host chooses a
replacement focus destination when it removes the focused descendant.

Dialog/Popover use native interaction focus restoration at dismissal. Dialog's
removed-opener repair runs after native restoration and inert cleanup and must
preserve valid host or surviving-overlay focus, including immediate reopen. Tooltip
trigger replacement/unmount invalidates delayed open/close callbacks; a tooltip
never becomes an interactive focus destination.

Forced colors take priority over identity and explicit contrast preferences.
Exceptions belong to actual color data or explicit system-color painting. Color
picker swatches preserve only their decorative chip pixels; their interactive
border, selected double border and outward keyboard focus ring use system colors.
The accessible preset name and aria-pressed state remain independent of the sample.
Hosts own contrast validation for custom token overrides and application content.
Browser media emulation verifies CSS preference handling; actual OS high contrast,
spoken assistive technology and physical devices require separately recorded runs.
