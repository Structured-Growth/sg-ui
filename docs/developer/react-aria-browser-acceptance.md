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
