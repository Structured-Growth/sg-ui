# Dialog and form interaction proof

Task references: P-02, A-06–A-11, D-16, C-17, H-06, U-06–U-09.
These contracts are available under `/experimental` while proof gates continue.
The existing `AppModal`, `AppPageTabs` and catalog remain unchanged.

## Owned APIs

`Provider` wraps the visual scope and uses `SGTranslationProvider.locale` for
React Aria internationalization, language attributes and keyboard direction.
Use it for interactive multilingual UI. `ThemeScope` remains a visual primitive;
its native `dir` attribute alone does not configure the interaction engine.
The host still owns supported locales and translations. No new application
catalog, routing, account or data-loading policy is introduced.

`Dialog` takes controlled `open`, required `title`, optional `description`,
content, footer and `sm | md | lg` size. `onDismiss` requests that the host close
the dialog. It reports `escape`, `outside`, `close-button`, or `dismiss` for a
generic assistive dismissal. Separate flags control Escape/outside dismissal.
Native refs on child controls and their `autoFocus` provide initial focus;
the interaction engine contains focus and restores the previously focused control.
The host remains responsible for removing its open state in response to dismissal.

The dismissal implementation classifies actual outside-interaction callbacks
and captures Escape without scheduling a reason reset between native event
listeners. A nested overlay can consume Escape; a later outside press is still
classified independently. Close buttons use translated labels. No upstream event
object or dismissal enum escapes the contract.

`Popover` takes an owned `Button` trigger, title and arbitrary content. It supports
controlled `open` or uncontrolled `defaultOpen`, boolean `onOpenChange` and a small
owned placement vocabulary. It represents a dialog containing form/help content;
it does not turn arbitrary content into menu items. Placement is calculated by the
interaction engine with collision handling; dynamic positioning uses inline styles.
Strict CSP support has not been verified.

`Tabs` takes string-ID items with labels, content and optional disabled state.
It supports `value`, `defaultValue`, `onValueChange` and automatic/manual activation.
Arrow navigation respects the host locale and skips disabled items. Inactive
panels unmount. Hosts should keep drafts in controlled state and validate the full
draft when submitting across tabs. The nested-form story demonstrates this,
including returning to the details tab for a missing course name. Native `style`
can bound the tab root's block size so the selected panel scrolls independently.

`ComboBox` takes host-supplied options with string IDs, labels and disabled state.
It filters the supplied collection locally and commits an ID or `null`, with
controlled/uncontrolled selection, named form participation, required/disabled/
read-only/invalid state, descriptions and errors. Native form values are option
IDs rather than labels. Input refs point to the native combobox input. Empty
collections remain openable and show a translated empty message. Asynchronous
loading and multiple selection are P-03 work, not claimed by this control.

## Scope and stacking

Body portals receive the nearest scope's color theme, density, language, direction
and explicitly supplied `--sgui-*` custom properties. Layout styles do not travel
to portals. Token values set only through arbitrary ancestor CSS selectors are
not captured; style the overlay's scope directly or supply scope custom properties
through the owned `ScopeStyle` contract. Nested provider settings take precedence.

Overlay and popover layers use shared tokens at 1400 and 1410 rather than arbitrary
maximum z-index values. The dialog header/footer remain outside the scrolling body;
the proof tabs have a bounded root and separately scrolling panel. Modal background
interaction and document scroll locking remain owned by the interaction engine.
No host body/global normalization is added to the stylesheet.

## Tests and evidence

Each of Button, TextField, ThemeScope, Provider, Dialog, Popover, Tabs and ComboBox
has colocated behavior tests. The nested dialog tests additionally exercise focus
containment/restoration, local Escape, dismissal locks and portal settings. The
package check scans all new declarations for upstream type leakage, and the
foundation check requires test files beside registered interaction controls.

jsdom does not implement `CSS.escape`; the test setup uses a standards polyfill
only in that environment. Collection/navigation implementations run normally.
Browser checks complement tests for native event timing, popup geometry and
scrolling. The browser caught an Escape classification problem that synchronous
jsdom dispatch did not reproduce; its fix was rechecked with native keyboard and
outside presses. These checks do not constitute a full screen-reader, touch,
zoom, forced-colors, hydration or browser compatibility audit.

See the [execution record](react-aria-progress.md) for current counts and validation,
and the [architecture decision](react-aria-architecture.md) for build/distribution.

## Link navigation and native downloads

The owned Link (also exported from `/primitives`) defaults absolute/protocol-relative
URLs to native navigation; `external` can override that choice. Internal links
use the navigation adapter. Native `onClick` runs before the adapter and may cancel
navigation. Only an unmodified primary click with no target or `_self` is routed.
Other targets and modifier clicks preserve browser behavior. `download=""`, a
filename, or `download={true}` preserve native downloads; `download={false}` and
an omitted download attribute permit routing. Host custom Link implementations
receive these attributes and own equivalent behavior.

The Link `NavigationSemantics` story supplies a local data-URL download fixture
and reports callback ordering and the completed event's default-prevented state.
It complements the adapter unit regressions with native browser verification.
