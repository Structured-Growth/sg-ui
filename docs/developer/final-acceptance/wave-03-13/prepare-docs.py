from pathlib import Path
import difflib
own=Path(__file__).resolve().parent;root=own.parents[3]
changes={}
p='docs/developer/react-aria-css-composition.md';old=(root/p).read_text();start=old.index('## Retained Popover geometry exceptions')
new=old[:start]+'''## Popover geometry exceptions

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
'''
changes[p]=(old,new)
p='docs/developer/react-aria-architecture.md';old=(root/p).read_text();new=old.replace('[master backlog](react-aria-master-task-list.md).','[master backlog](react-aria-master-task-list.md). See [CSS composition and compatibility](react-aria-css-composition.md) for layer order, consumer overrides, geometry exceptions and enhancement/CSP boundaries.',1);changes[p]=(old,new)
for p,(old,new) in changes.items():
 out=own/'proposed-files'/p;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(new)
(own/'documentation.patch').write_text(''.join(''.join(difflib.unified_diff(a.splitlines(True),b.splitlines(True),fromfile='a/'+p,tofile='b/'+p)) for p,(a,b) in changes.items()))
