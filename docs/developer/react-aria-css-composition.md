# Composing SGUI with host styles

Import `@structured-growth/sg-ui/styles.css` once at the application CSS entry,
before rendering owned UI inside `Provider` or `ThemeScope`. The public stylesheet
is precompiled: consumers do not need Tailwind, CSS Modules compilation or PostCSS
configuration. It declares `sgui.tokens` before `sgui.components`. There is no
SGUI utilities stylesheet or global reset. See [installation](../../README.md)
and [theme contracts](react-aria-theme.md) for the public scope APIs.

## Order and ownership

Choose the host layer order before loading styles that first establish those
layers. Layer order follows first declaration, not a later attempt to reorder it.
This example assumes the application's CSS entry resolves package imports:

```css
@layer host-reset, sgui, host-utilities, host-overrides;
@layer sgui.tokens, sgui.components;

/* Omit this import when the host does not use a reset. */
@import "./reset.css" layer(host-reset);
@import "@structured-growth/sg-ui/styles.css";
@import "./utilities.css" layer(host-utilities);
@import "./overrides.css" layer(host-overrides);
```

Keep the SGUI import in its own declared layers; wrapping it in another import
layer would change their names and priority. All imports precede style rules;
layer-order statements may precede imports. If the host loads CSS via JavaScript,
load the layer prelude first, then the public SGUI stylesheet, then host styles
that declare the chosen utility/override layers. Use the host's existing CSS
loader; the public package entry remains the same.

| Stage | Owner and effect for normal declarations |
| --- | --- |
| Optional `host-reset` | Host chooses document reset, fonts and body background. Earlier layered reset rules yield to SGUI component rules on the same element/property. |
| `sgui.tokens` | Generated owned variables on visual scope roots establish theme, density and component aliases. |
| `sgui.components` | Compiled local module classes consume those aliases; required control normalization stays scoped. |
| `host-utilities` | Host utilities in this later layer override normal SGUI rules when applied to the same element/property. |
| `host-overrides` | Later host layer handles deliberate per-component/context adjustments through public styling contracts. |
| Unlayered host rules | Normal unlayered stylesheet declarations outrank all normal layered stylesheet declarations, regardless of selector specificity or file order. |

An existing unlayered reset can therefore override library normalization. Layer it
if it should be a baseline. An unlayered utility or override also wins against
normal library stylesheet rules even if imported first; import order still matters
within a layer or among unlayered rules when the other cascade factors tie.
Normal inline styles take precedence over normal author stylesheet rules.

Use supported component props first. For visual identity, override owned tokens
through the public scope's `style` contract; component color aliases must retain
the palette → semantic → component relationship. Scope token variables supplied
this way are copied to owned overlay roots. Arbitrary host ancestor selectors and
layout styles do not propagate to body portals; a utility on a wrapper is not an
overlay-root styling API. For component layout, use documented `className`, native
`style` or part slots where exposed. Do not select generated module class names or
assume every component exposes a root style slot. Popover currently exposes no
`className`/`style` root prop. See [adoption guidance](react-aria-adoption-checklist.md).

## Important declarations change the order

Within author styles, `!important` reverses layer priority: important declarations
in an earlier layer outrank important declarations in a later layer, and layered
important declarations outrank unlayered important declarations. The example's
important order is `host-reset` before `sgui` before `host-utilities` before
`host-overrides`; within `sgui`, tokens precede components. An important declaration
also beats normal inline geometry. Important inline styles take precedence over
author stylesheet important declarations. Origin and active transition priorities
remain additional cascade factors; these comparisons concern author styling.

Consequently, adding `!important` in an unlayered utility or the later
`host-overrides` layer cannot reliably beat a library important rule. Avoid routine
important resets, utilities and specificity escalation. A host that deliberately
needs an important override must plan an earlier layer before SGUI is first
registered, select the actual element through a supported contract, and verify
the affected behavior. This is not a blanket recommendation to override geometry
or suppress focus, forced colors or scroll locking.

## Popover geometry exceptions

The Popover positioner writes normal inline `position`, physical offsets and
`maxHeight`, both in its returned props and directly while measuring. Dialog,
drawer and narrow auto share that positioning hook with anchored popovers. Their
CSS keeps three narrowly scoped important roles per presentation: fixed position,
inset reset and maximum block size. In horizontal writing these block caps must
beat the engine's physical inline `maxHeight`. The inset shorthand resets all
physical edges before centering a dialog or attaching a drawer to the bottom.
Dialog transform is normal CSS; anchored popover and wide auto retain the engine
geometry. Do not remove those locks without replacing the position owner.

Drawer and narrow auto width/max-width declarations use normal priority: the
positioner supplies no inline width or max-width, and these later selectors
already outrank size variants. The correction removes four unnecessary important
declarations. The remaining nine geometry roles use twelve declarations because
three height caps have ordered `vh` then `dvh` fallbacks. This is an intentional
exception for inline positioning interoperability, not a general consumer styling
pattern. Hosts must not override overlay geometry without validating containment,
focus, scroll and resize. Vertical writing mode is not certified by this analysis;
physical inline engine height and logical CSS caps need a separate validation if
that support is promised. RTL remains a separate direction concern.

The scoped acceptance fixture checks popover/dialog/drawer/auto at wide and narrow widths, resize in both directions, preserved focused draft, Escape restoration and reopen. The current bounded execution passes both existing cases across Chromium, Firefox and WebKit against the hash-verified built host. It also verifies the decorated input fallback and empty-grid focus ring, including forced colors. The unsupported-`:has` branch is injected by disabling its declared enhancement guard; this establishes the fallback branch, not minimum-version support in an older engine.

## Enhancement and tooling boundaries

The package's PostCSS Modules pass scopes parent/child classes and retains native
CSS nesting; it does not flatten nesting or inject a polyfill. The
[style guard](../../packages/ui/scripts/check-component-css.mjs) enforces at most
one component-owned style-rule level, a single parent selector and one explicit
leading `&` in each nested selector. Media/support conditions do not add a
style-rule level. Grouped parents, implicit/reverse ownership, repeated `&` and
Sass-style suffix concatenation are rejected; existing token, layer, global-host
and typography checks still apply.

[TextField's adornment](../../packages/ui/src/experimental/TextField/TextField.module.css)
uses `.adornment { & > svg { ... } }` and retains the identical flat
`.adornment > svg` baseline. Both have specificity (0,1,1), with no grouped parent
that could raise specificity. The flat rule preserves this styling when native
nesting is unavailable; it is intentionally retained rather than silently raising
the required browser syntax. The representative uses no bare nested type selector
or mixed declaration ordering. This is a bounded adoption, not a mechanical
rewrite of existing stylesheets.

Vendor syntax history distinguishes this explicit-`&` subset from relaxed parsing:
[Chrome](https://developer.chrome.com/blog/css-nesting-relaxed-syntax-update)
introduced initial nesting in 112 and relaxed element-name syntax in 120;
[Firefox 117](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/117)
introduced nesting and `&`; [Safari 16.5](https://webkit.org/blog/14154/webkit-features-in-safari-16-5/)
introduced initial nesting, while [Safari 17.2](https://webkit.org/blog/14787/webkit-features-in-safari-17-2/)
added relaxed element-selector parsing. These are syntax-history facts, not new
SGUI minimum-browser promises or executions in those historical versions.
Current Playwright projects establish engine coverage, not numeric browser floors
or physical Safari/mobile support. The existing flat baseline and recorded
current-engine evidence keep those claims separate.

The private native host may downlevel nesting in its normal Vite CSS bundle.
Its builder also copies the exact public `dist/styles.css` bytes to a raw
`sgui-library-styles.css` asset for this consumer-syntax check. The test verifies
byte equality, loads that stylesheet and temporarily disables all applicable
flat adornment declarations, including bundled duplicates, before exercising the
native rule. Consumer-bundler lowering is distinct from the library's distributed
CSS and does not demonstrate native browser parsing by itself.

Decorated TextField uses its input focus ring as the baseline. Only inside
`@supports selector(:has(*))` may it suppress that ring and move the ring to the
whole frame. The read-only frame background is in the same enhancement block;
the input retains its baseline read-only background. Forced-color focus uses
system colors. The empty grid content wrapper is an intentional programmatic
focus fallback and keeps an inset ring whenever it itself receives focus. Child
row/card focus does not outline that ancestor. Dialog XL/full heights have explicit
`vh` fallbacks when `dvh` is unsupported; Popover's viewport caps declare the `vh`
value before `dvh`. Dynamic viewport movement/physical devices still need their
own evidence. Existing JavaScript overlay placement remains the baseline; no
anchor positioning, style query or view-transition API is required by these edits.

## CSP compatibility boundary

Compiled stylesheet delivery does not establish strict CSP support. Owned theme
custom properties, Popover underlay/anchor placement, Dialog dimensions, grid
layout widths and editor floating geometry use dynamic style values. Host
`style` props, image URLs and editor content are additional policy inputs. A nonce
on the public stylesheet or a fixture's style element does not authorize arbitrary
style attributes. Property writes through CSSOM and parser-created `style`
attributes must be characterized separately; do not assume they have identical
CSP enforcement.

The scoped `wave-03-13` spec supplies two enforced document-response headers with
external scripts and styles from self: one disallows style attributes, the other
allows them. The document supplies `<meta property="csp-nonce" content="...">`
before application scripts, with the same per-response nonce authorized by
`style-src-elem`, and applies it to the fixture host's static style element.
The current interaction engine reads this meta value for its dynamically inserted
pressable touch-action stylesheet; its scroll-lock stylesheet also uses that
nonce lookup. A nonce on a different style element does not propagate to these
styles. The host owns nonce generation and the response policy; `sgui-test` is a
fixed fixture-only value, never a production nonce. The engine also supports
`__webpack_nonce__`, but the fixture uses document metadata and requires the
injected pressable style's nonce to match. These hooks authorize style elements,
not style attributes. No stable stylesheet hash contract is promised for private
interaction-engine CSS; a host relying on hashes must recalculate them for the
installed release.
A deliberately parser-created styled probe confirms the restrictive header is
enforced; every violation and actual overlay focus/geometry outcome is recorded.
This is response interception in a controlled browser host, not an approved
production server policy. There is no blanket strict-CSP compatibility promise,
no script `unsafe-inline` requirement, and no authorization to weaken a host policy.
Coordinator execution against a fresh immutable package/host remains required.
