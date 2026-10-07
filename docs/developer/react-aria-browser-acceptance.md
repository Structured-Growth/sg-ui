# Executable browser acceptance

Task references: H-02, R-11 and X-12, with representative G/X/editor evidence.
The Playwright suite runs the built static Storybook iframe, using production
scopes, styles and existing host adapters. It requires no authentication, database
or external application service. Test fixtures and assertions live in
`tests/browser/acceptance.spec.ts`; `playwright.config.ts` requires Chromium,
Firefox and WebKit. These engines do not establish real-device or assistive-
technology conformance.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build-storybook
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm test:browser
```

The suite typechecks before executing. The server binds only to loopback, serves
fresh static output without caching and rejects paths outside that output. Never
rebuild Storybook while the suite is reading it. Package consumer fixtures still
run serially and must not overlap a `dist` rebuild.

| Gate | Observable behavior |
| --- | --- |
| Native links/downloads | Empty, named and boolean downloads are saved and read back as exact bytes, with no router call. Explicit false routes. Consumer click precedes routing; cancellation prevents routing; modifier clicks and targets open native tabs; explicit external links remain native. |
| Dialog/overlay focus | Keyboard activation focuses the field; Escape dismisses the nested popover first, keeps the dialog open and restores its trigger; another Escape restores the outer trigger. |
| Grid interaction | Arrow navigation retains row/field identity; nested selection and action menus remain independent; sorting updates the grid's exposed sort state. |
| Real editor | Native typing and keyboard selection precede formatting; selected text and document content survive the command. |
| Read-only scrolling | The named document scroll region takes keyboard focus and native PageDown moves its scroll position. |
| Host-owned reorder | Move controls request host changes, preserve source focus, and host failure restores previous row order. Availability toggles retain their own focus. |
| Performance smoke | A deterministic 1,000-row dataset renders a 250-row page and completes sorting within a generous 15-second hang/regression budget. Timings are attached per engine. This is not a hardware SLA, virtualization decision or memory profile. |

Accessibility scans cover the public grid, editable editor, read-only editor and
open nested dialog in light/dark globals. Axe WCAG 2 A/AA, 2.1 A/AA and 2.2 AA
violations fail tests. There are no disabled rules or excluded failing nodes.
Every scan attaches complete results. Library maintainers own remediation in the
corresponding source component; consumers retain responsibility for their content,
labels and overrides. New exceptions require a scoped documented reason and
remediation owner, rather than a blanket suppression.
Harness URLs set the Storybook addon's manual-scan global so the addon and
Playwright do not launch competing axe runs in the same iframe. Playwright is the
mandatory scan owner for these tests; its rules and violation assertions remain
enabled.
The read-only fixture deliberately sets its own dark scope; repeating outer
globals checks its embedding, not a separate light read-only appearance.

The first scan found a genuine keyboard-accessibility defect in the editor's
scrollable viewport. It is now a translated named region with `tabIndex=0` and a
token-based focus outline. Colocated editable/read-only tests preserve the next
editable tab stop; browser tests verify native scrolling. No public prop changed.

Browser runtime errors and warnings fail the suite. Retries are disabled; CI
forbids focused tests. Failure screenshots and traces, full JSON results, HTML
report, axe results and smoke timings are retained as `sgui-browser-node-24` for
14 days. The Node 24 CI job installs and runs all three engines after building
Storybook. The Node 22.12.0 job independently validates package/consumer checks.
See [runtime and artifact evidence](react-aria-runtime-ci.md).

The broad browser matrix, physical touch dragging, manual screen-reader reviews,
zoom/reflow, visual snapshots, IME/paste, clipboard permissions, framework
hydration and full performance/memory budgets remain separate acceptance tasks.
Representative executed gates must not be treated as completion of every G/U/X
or framework requirement.

Local Firefox could not launch on this Mac: its installed Playwright executable
reported `Could not find profile folder` before a test page opened. A different
temporary profile directory did not resolve it. This is consistent with the
reported macOS app-data restriction in [Playwright issue 42768](https://github.com/microsoft/playwright/issues/42768),
but local tests alone do not prove that cause. Firefox is not skipped in CI;
its behavior must be established by the required Linux job. No OS permissions or
browser branding were changed to work around the local failure.

## Packed browser consumers (R-08/X-18)

`pnpm test:hydration-consumer` builds and packs the library into independent React
18.3.1 and 19.2.3 Vite fixtures. Each browser loads the production output first
with JavaScript disabled, then with hydration enabled. Checks include dark
theme/English locale, committed leap-day dates, unique accessible IDs, hydrated
reference resolution, unchanged server scope identity and real dialog/tab/action
callbacks with focus restoration. React's recoverable hydration errors are
forwarded into the mandatory browser diagnostic assertion.

`pnpm test:next-consumer` independently packs the library and installs exact
Next.js 16.4.0 with React 19.2.3 in a disposable consumer. Its production App
Router build executes server presentation/pagination modules and passes server
content through a client-owned scope and action composition. No Next dependency,
source alias or framework configuration is added to SGUI's runtime package.
The Next fixture checks a host `fr-FR` adapter, French month names, committed
2024-02-28/29 endpoints, light/dark tokens and server presentation node identity.
Date segment helper descriptions are inserted by React Aria client effects:
some SSR-only IDREF targets are absent before JavaScript runs. Duplicate IDs fail
before and after hydration; all IDREF targets must resolve after hydration and
after the dialog portal mounts. This does not claim complete pre-JavaScript date
accessibility.

Node 24 CI executes all three engines for both Vite React versions and Next.
Each fixture has fresh server markup and browser contexts; it never shares the
Storybook server. The helper enforces 30-second native action/navigation deadlines
and fails on every page error or console warning/error. JSON evidence and failure
screenshots/traces live under `artifacts/packed-browser` and are retained with the
14-day browser artifact. Explicit local engine subsets remain reported as subsets;
CI refuses a subset.

## Native reorder input (G-17/G-18 partial)

`tests/browser/reorder.spec.ts` exercises the first handle gesture with native
mouse input, trusted dragstart/drop/dragend events, before/after host order changes
and originating handle focus. Dropping outside cancels without a host request;
host rejection restores the prior order. Multiple selection and sorting prevent
native drag initiation. There is no injected drag event, DataTransfer or CSS fix
in the acceptance test. The test exposed the upstream drag-slot pass-through
style; the owned handle now enables pointer hit testing.

A separate 390px touchscreen context uses trusted taps on non-drag Move controls
and verifies commit/rollback. This covers the touch alternative, not physical
touch long-press dragging. G-17/G-18 stay open for their remaining device,
screen-reader and cleanup/preview matrix.

Final local Node 24 execution passes 30/30 tests across Chromium and WebKit,
including 16 accessibility scans, in 23.7 seconds. Results:
`/tmp/sgui-browser-final.log` and `artifacts/browser-results.json`. The default
three-engine command remains mandatory in Linux CI; this local subset does not
claim Firefox behavior. Full `pnpm check` passes on Node 24 and exact-minimum
22.12.0 (138 files, 857 tests); Storybook and all eight packed foundation/editor
React 18/19 consumers across both runtimes pass.

Remote [CI run 37560065588](https://github.com/Structured-Growth/sg-ui/actions/runs/37560065588)
passes on exact implementation commit `83b8dae2148002e79d2df331fd105c274f97ca96`:
45/45 browser tests across Chromium, Firefox and WebKit, including 24 axe scans,
with zero skipped, unexpected or flaky tests. The downloaded JSON report records
95.7 seconds. Firefox executes the actual byte transfers and keyboard/focus tests;
its Linux success does not remove the local Mac launch limitation.

| CI engine | Navigation/render | Sort/render |
| --- | --- | --- |
| Chromium | 1,720ms | 1,987ms |
| Firefox | 2,065ms | 2,797ms |
| WebKit | 1,910ms | 2,246ms |

These are the bounded smoke fixture's recorded timings, not consumer SLAs.
Both runtime jobs, all eight packed consumers and title validation pass. All seven
artifacts are unexpired. Browser artifact ID `11456069764` expires
2026-10-21 02:10:07 UTC. Downloaded evidence is in
`/tmp/sgui-ci-83b8dae2-artifacts`; later commits require independent CI inspection.

## Display preferences and modal reflow (X-05/X-06 partial)

`tests/browser/display-preferences.spec.ts` runs the public tabbed AppModal in
light/dark at 320 CSS pixels and with 200% root text plus line/letter/word/paragraph
spacing overrides. Native Tab traverses all twenty fields and both footer actions;
geometry and hit testing require the complete focused control inside the viewport
and its panel, without another element covering its center. Header/footer positions
stay stationary where the layout fits. Native tab switching, a nested portaled
field, action callbacks and Escape restoration are also checked. No corrective
layout CSS or synthetic scroll is injected into the tests.

The tests exposed two production defects. Enlarged chrome could squeeze the panel
out of a fixed-height modal, hiding fields and actions. A token-sized minimum panel
and outer dialog scroll fallback keep them reachable. Initial focus can suppress
native scrolling, and WebKit can expose only an input's caret during Tab navigation.
The owned dialog now checks the focused control against intersecting scrollports
after focus restoration/layout and scrolls it fully into view when needed. Deferred
work stops if focus moved or the element unmounted; nested portaled focus stays
local to its own dialog. See [modal contracts](react-aria-modal-shells.md).

Reduced-motion tests switch the browser preference and check that linear/circular
loading and button spinners stop animating while indeterminate/pending semantics
remain. Forced-color tests record each engine's actual media-query capability,
require every configured engine to apply the emulated preference, use system
Highlight focus outlines and preserve accessible disabled/pending indications.
An unsupported media query fails instead of silently certifying ordinary focus.
These checks use production styles rather than a test palette.

A 320px layout corresponds to the effective width of 1280px at 400% zoom; root font
scaling verifies text resizing. Neither operation drives browser chrome zoom.
Actual browser zoom, physical high-contrast settings, the complete catalog contrast
and state matrix, assistive technology and device acceptance remain open. X-05 and
X-06 stay unchecked; formal closure remains 94/320 required tasks.

The prior implementation head `1a6c3d51` passes both runtime checks and the Linux
three-engine Storybook suite, but its Node 24 packed React 18 browser step fails:
[run 37561495918](https://github.com/Structured-Growth/sg-ui/actions/runs/37561495918).
The fixture server wrote 200 headers before an asynchronous file read and then
attempted 404 headers for a missing request. It now reads first; a Node regression
requires missing/malformed paths to return 404, outside paths 403 and subsequent
valid requests to retain exact bytes. The clean Vite HTML declares an empty data
favicon. Browser errors remain mandatory failures. That failed run is not evidence
of passing packed Firefox/Next hydration.

Final local Chromium/WebKit execution passes 54/54 in 48.8 seconds, including
initial footer action focus under enlarged chrome, with zero skipped, unexpected
or flaky tests. Header/body/footer use the same scoped visibility repair. Results:
`artifacts/browser-results.json`, `/tmp/sgui-display-complete-browser-results.json`
and `/tmp/sgui-display-complete-browser.log`.

## Calendar explanations (K-17 partial)

`tests/browser/calendar.spec.ts` exercises visible preset descriptions, disabled
preset explanation access, accessible description references and native keyboard
activation in both themes. Enter on an available preset changes the draft before
Apply commits to the host. Tab/ArrowRight reaches an unavailable day, retains its
complete date name, exposes its reason and cannot select or commit it. Enter/Space
opens and closes the native availability disclosure with focus retained. Browser
runtime warnings/errors remain mandatory failures. This covers availability and
preset access; intermediate range previews and live screen-reader announcements
remain open under K-17.

Final local validation: Node 24 and exact-minimum Node 22.12.0 `pnpm check`
pass 138 files/861 behavior tests, five foundation and four release tests, source/
story typing, ESM/declarations/public imports and owned boundary/token/layer guards.
Fresh Storybook builds with existing upstream warnings. The complete local
Chromium/WebKit suite passes 62/62 in 53.9 seconds, with zero skipped, unexpected
or flaky tests and mandatory diagnostics; eight cases cover the new calendar
behavior. Fresh serial packed React 18/19 Vite SSR/browser (React 19 Flight) and
Next 16.4.0 production/browser pass both local engines with no browser diagnostics.
Local Firefox retains its documented launch limitation and remains mandatory in CI.
Evidence: `/tmp/sgui-calendar-final-check-storybook.log`,
`/tmp/sgui-calendar-final-check22.log`, `/tmp/sgui-calendar-final-browser.log`,
`/tmp/sgui-calendar-final-browser-results.json` and
`/tmp/sgui-calendar-final-consumers.log`. Current-head CI is independently required.

## Native editor clipboard (E-05/X-09 partial)

`tests/browser/editor-clipboard.spec.ts` uses native keyboard Select All/Copy/Paste
between a textarea, a browser-native rich contenteditable source and the actual
Lexical editor. Event observation requires trusted copy/paste and the transferred
`text/plain`/`text/html` MIME types. No ClipboardEvent, DataTransfer, clipboard API
write, permission grant or editor-state injection supplies the paste payload.
Light/dark cases check two-paragraph plain paste, native undo/redo, rich bold/italic
JSON, saved-document reload, ordinary bold and typing shortcuts, and read-only
rejection of paste/typing with exact native copying to another textarea.

The document-only read-only copy assertion exposed a production defect: the non-editable
textbox could not take keyboard focus, so Select All copied surrounding host UI.
It now has a native focus stop and handles only unmodified Ctrl/Command+A within
that focused read-only root, selecting its contents. Editable handling stays with
Lexical. Colocated regressions cover Tab focus and both modifiers; the browser
gates require exact copied content and live editable/read-only state transitions.

Actual OS clipboard security prompts, physical devices, IME composition and live
assistive technology remain open. E-05 and X-09 are not closed by these cases.
Firefox stays mandatory in Linux CI despite its documented local launch limitation.

Final local validation: Node 24 and exact-minimum Node 22.12.0 `pnpm check`
pass 138 files/863 behavior tests, five foundation and four release tests, source/
story typing, ESM/declarations/public imports and owned boundary/token/layer guards.
Fresh Storybook passes with existing upstream warnings. Full Chromium/WebKit
passes 70/70 in 58.7 seconds, with zero skipped, unexpected or flaky tests and
mandatory diagnostics. Eight new clipboard cases pass, alongside 16 axe scans.
Fresh serial Node 24 packed React 18/19 editor SSR/hydration-entry builds and
foundation Vite SSR/hydration browser consumers (React 19 Flight) pass; both local
engines report no browser diagnostics. Firefox remains mandatory in Linux CI and
retains its documented local launch limitation. Evidence: `/tmp/sgui-clipboard-final-check-storybook.log`,
`/tmp/sgui-clipboard-final-check22.log`, `/tmp/sgui-clipboard-final-browser.log`,
`/tmp/sgui-clipboard-final-browser-results.json` and `/tmp/sgui-clipboard-final-consumers.log`.

## Local editor image lifetimes (E-06 partial)

`tests/browser/editor-image-lifecycle.spec.ts` inserts actual PNG files through
ImageUploadModal into Lexical, requires the native image to load, and observes
native object-URL allocation/revocation without replacing their behavior. Native
undo/redo restores a loaded image. Read-only changes retain its URL; replacing the
document and unmounting release each editor URL exactly once. Modal preview URLs
have independent balanced lifetimes. Light/dark cases retain mandatory browser
warning/error checks. Colocated tests also require that host-returned blob URLs
are never revoked by the section. These cases cover local resource ownership;
they do not close E-06's protocol, content-validation and wider upload acceptance.

Final local validation: fresh Storybook and Node 24/exact Node 22.12.0 checks
pass (138 files/865 behavior tests). Full Chromium/WebKit passes 74/74 in 66.2
seconds, with zero skipped, unexpected or flaky tests, 16 axe scans and four new
image lifecycle cases. Fresh serial packed React 18/19 editor SSR/hydration-entry
builds pass. Vite/Next browser consumers were not repeated for this batch; see
[runtime evidence](react-aria-runtime-ci.md) for independently successful calendar
CI. Firefox stays mandatory in CI despite its local launch limitation. Evidence:
`/tmp/sgui-image-check-storybook.log`, `/tmp/sgui-image-check22.log`,
`/tmp/sgui-image-browser.log`, `/tmp/sgui-image-browser-results.json` and
`/tmp/sgui-image-consumers.log`.
