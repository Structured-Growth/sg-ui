# Browser, touch and assistive-technology coverage

The maintained native Playwright projects cover Chromium, Firefox and WebKit.
Tests use the pinned distributions in the installed Playwright package. Browser
emulation does not certify branded-browser channels, physical touch devices or
screen-reader speech. Production validation requires supported environments and
the manual review listed in the active backlog.

Use fresh compiled public fixtures for changed controls. Validate keyboard,
focus, enlarged text, reduced motion, contrast, layout and touch behavior in the
relevant engine. Record actual runtime/browser/device/AT identities when reporting
results; never infer real-device or screen-reader results from DOM assertions.

The native Chromium project selects the full chromium channel because its
Autofill checks require CDP support. WebKit forced-color emulation does not
establish native forced-color-adjust paint behavior. Preserve the maintained
state/geometry assertions and their explicit engine limits.

See [browser checks](react-aria-browser-acceptance.md),
[development validation](react-aria-development-validation.md) and
[open obligations](backlog.md).
