# Remaining operator evidence

These are unexecuted acceptance procedures, not results. Use the coordinator's
frozen source/package/fixture identity. Record actual browser and OS version,
operator/date, fixture ID, source/build SHA-256, viewport/visualViewport geometry,
focused element and observed outcome. Preserve a failure before changing code.

## U19 real browser zoom / collision

Use `overlays-appmodal--ownership` plus the existing
`migration-proofs-popover-collision--viewport-edge` and `--scrollable-host`.
In a real browser, set chrome zoom to 100%, 200%, then 400% using its zoom UI.
Record the visible chrome zoom indication; do not substitute root font size,
CSS zoom, transform, deviceScaleFactor or Playwright viewport size.

For each level, open the modal by keyboard, open its menu, dismiss with Escape,
focus its tooltip action, dismiss tooltip, then select text and open Edit link.
Record portal theme/dir/lang/density, actual topmost hit target and focused control
bounds; Tab/Shift+Tab remain in the active dialog. Resize the browser window while
open. Verify each requested Popover placement flips/shifts at edges, scroll-host
movement retains anchor adjacency, content is reachable by native keyboard, drafts
survive and dismissal returns focus. Also cover ComboBox/Select and date-overlay
fixtures identified in wave-02-09/operator-cases.md; the new combined case does not
claim those families. Record any clipping and the exact engine/zoom condition.

## U08/M08 dialog speech and modality

Use `overlays-appmodal--nested-overlays`, `--removed-opener` and `--ownership`
with a named actual screen reader. Record browser/OS/AT versions and spoken text.
Confirm title/description and control labels are announced once, only top modal
content is reachable, menu/tooltip supplement the correct control, Escape closes
the top interactive overlay, surviving opener return is announced, removed-opener
fallback remains in the parent, and an accepted host destination is preserved.
Do not equate ARIA attributes, DOM focus, axe or a browser accessibility snapshot
with spoken acceptance. No operator/AT approval is supplied by this artifact.
