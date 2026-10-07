# Popover ancestor-scroll classification (U-19 / U-07)

Batch89 succeeds the bounded [Batch83 proof](../parallel-batch-83/popover-native-collision.md).
Isolated managed worktree baseline: `d81eb13bb31922d49f14f2ae0a68ca89f647f595`.
Production Popover and both collision fixtures remain unchanged.

## Retained native evidence

The coordinator's fresh Chromium candidate was
`7248a80d79eb50a59a2e18b7bf461f8e9d26897c`. Its retained pool directory is
`/Users/thomashall/.codex/worktrees/batch80-83-native-candidate/sg-ui/artifacts/browser-pool/df2bc745-5e76-4922-80ae-03c3ccaa0f51`.
`batch83/results.json` records 16 passing viewport-edge cases and 16 failing
scroll-host cases. All host failures reach the same adjacency predicate at the
original spec line 64, called by line 84 after native host scroll. This is one
shared failure class, not sixteen independently classified defects.

Read-only inspection of all sixteen `batch83/traces/*/trace.zip` files shows:

- The native `scrollTop === 32` and measured trigger displacement assertions pass
  before the failing assertion. No forced click or focus repair is involved.
- Opening and live resize pass the placement, visibility/hit testing and adjacency
  assertions. After scroll, visibility/hit testing and placement still pass before
  the adjacency predicate times out.
- Bottom-resolved overlays retain `top: 281px` after the host scroll and through
  the last poll. Top-resolved normal-text overlays retain `bottom: 419px`.
  Before viewport resize these values were `top: 297px` / `bottom: 483px`.
  Enlarged top-requested cases legitimately flip to bottom during resize.
- The representative `popover-native-collision-b-fc206-ight-ltr-normal-scroll-host-chromium`
  error snapshot retains the active Note textbox containing `Native draft`.
  Its final full DOM snapshot retains absolute positioning at `left: 41px;
  top: 281px` at a 420×640 viewport.

The retained trace serializes inline positions and successful displacement checks,
but does not retain the raw `boundingBox()` return values for failed cases: the
original rectangle attachment occurs only after the complete case succeeds.
Do not present reconstructed rectangles or gap estimates as recorded measurements.

## Underlying cause and scope boundary

Read-only inspection of [Popover](../../../src/experimental/Popover/Popover.tsx),
its CSS and the actual retained Storybook assets establishes the positioning path.
Popover uses the default modal React Aria Popover. The shipped `usePopover` in
`storybook/assets/Menu-DYx8tmvJ.js` passes `onClose: null` to overlay positioning
for modal popovers. In `storybook/assets/useOverlayTriggerState-EOZvrdu2.js`,
the positioning hook updates on layout/resize, trigger/overlay ResizeObserver and
visual viewport scrolling during its resize window. It has no ancestor-scroll
position update subscription. The separate close-on-scroll path exits when
`onClose === null`.

Native ancestor `scrollBy` therefore moves the trigger without either repositioning
or dismissing this modal portal. A size observer does not detect that positional
movement. The fixed overflow host is a legitimate layout, and the explicit native
scroll contract is already documented by Batch83. No genuine fixture correction
was identified. Removing the scroll, dispatching a resize, repairing the position,
changing modality or loosening adjacency would hide or change the tested contract.

This is a confirmed runtime limitation against the requested moving-anchor
contract. The coordinator was notified before any production edit or source
reservation. Corrective runtime scope and API decisions require a separate
reservation; this batch does not implement a runtime fix.

## Diagnostic change and validation limits

The [native spec](../../../tests/browser/popover-native-collision.spec.ts) now
attaches `scroll-anchor-diagnostics` around the existing host-scroll adjacency
assertion, including on assertion failure. Each sample reads anchor/overlay/host
DOM rectangles, computed position/overflow/transform, ancestor scroll offsets,
overlay offset parent and inline position, resolved placement, gap/overlap,
document scroll, viewport and focus ownership in one browser evaluation.
Sampling is read-only and confined to the host branch. The sixteen passing
viewport-edge paths and all original assertions are unchanged. The story and
composition test bytes are unchanged.

`git diff --check` passes. No dependency installation, syntax/type/unit command,
native run, Storybook build or package command was executed in this worktree.
Light validation awaits coordinator-owned canonical slot permission. The new
diagnostics are unexecuted; retained candidate results are not validation of these
new bytes. No corrected native outcome is claimed.

After a separately authorized genuine correction, the first fresh native run
should target `tests/browser/popover-native-collision.spec.ts` with
`--project=chromium --grep 'scroll host' --workers=1 --retries=0`. Broaden to the
sixteen green cases only if corrective changes affect their paths. Preserve the
gap, focus, visibility, displacement and document-scroll assertions.
Broad U-19/U-07, other engines, devices and assistive-technology acceptance remain
open.
