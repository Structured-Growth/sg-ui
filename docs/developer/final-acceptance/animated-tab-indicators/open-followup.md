# TABS-MENU-WEBKIT-RO — closed, 2026-10-17

The two WebKit `tabs-overflow.spec.ts` pointer/touch cases finish their functional
assertions, including selected-line alignment, then fail the existing zero-page-
error assertion with `ResizeObserver loop completed with undelivered notifications.`
Chromium/Firefox pass. All 24 new indicator cases pass in all three engines.

The saved browser diagnostic bypassed the compiled TabIndicator function with an
early null return, removing its DOM, hooks and observers. The warning remains.
This isolates it from the indicator; it is not an exact full-repository baseline
checkout. Recent native resize deliveries involved the More tabs trigger and menu
popover. Investigate the owned Menu/React Aria positioning path as a separate
bounded follow-up. Do not suppress the warning, remove the error assertion or
disable native positioning/resize handling to close it.

Acceptance: both existing WebKit cases pass all functional and zero-page-error
assertions; retain native focus, scrolling, touch and responsive overflow behavior.
The diagnostic source is stored as text to keep it out of normal test discovery.


Resolution: the same native warning reproduced when the localized rich editor
opened its insertion menu, before floating selection was involved. Native resize
delivery diagnostics identified the command-menu popover/trigger. An explicit
`inline-size: max-content` on the owned Menu popover prevents width changing merely
because native left/right positioning updates, while its viewport cap and every
native positioning/resize observer remain intact. Explicit max-height and unused
trigger-width measurement experiments did not fix it and were reverted.

All 33 tab indicator/overflow cases pass against freshly built docs, including
both original WebKit pointer/touch cases and their unchanged zero-page-error
assertion. All 24 rich-editor configurations pass too. Original red evidence above
is preserved. [Fix and acceptance receipt](../rich-editor-presentation/results.json).
