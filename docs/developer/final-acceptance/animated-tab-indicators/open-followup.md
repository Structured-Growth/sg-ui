# TABS-MENU-WEBKIT-RO — open

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
