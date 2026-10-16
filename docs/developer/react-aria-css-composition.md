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

The scoped acceptance fixture checks popover/dialog/drawer/auto at wide and narrow
widths, resize in both directions, preserved focused draft, Escape restoration and
reopen. Until the patch is integrated and that fixture runs against a fresh build,
this explanation is a source-based justification, not a new geometry pass.

## Enhancement and tooling boundaries

The package's PostCSS Modules pass scopes selectors and retains native CSS nesting;
it does not flatten nesting or inject a browser polyfill. Keep any nested selector
to one explicit component-owned `&` level and avoid grouped parent selectors whose
maximum specificity would change the flat selector contract. The proposed
`.adornment { & > svg { ... } }` has the same selector specificity (0,1,1) as
`.adornment > svg`; it is a separately reviewed migration candidate. Ship it only
when the host's browser policy includes native nesting and the chosen oldest
engine versions have rendered evidence. Current Playwright project names establish
engine coverage, not minimum browser versions or physical Safari/mobile support.
No new minimum browser-version promise is established here.

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
allows them. Only the fixture host's static style element receives a nonce.
A deliberately parser-created styled probe confirms the restrictive header is
enforced; every violation and actual overlay focus/geometry outcome is recorded.
This is response interception in a controlled browser host, not an approved
production server policy. There is no blanket strict-CSP compatibility promise,
no script `unsafe-inline` requirement, and no authorization to weaken a host policy.
Coordinator execution against a fresh immutable package/host remains required.
