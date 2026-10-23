# Executable browser acceptance

Task references: H-02, R-11 and X-12, with representative G/X/editor evidence.
The Playwright suite now runs the built docs-owned native React fixture host, using production
scopes, styles and existing host adapters. It requires no authentication, database
or external application service. Test fixtures and assertions live in
`packages/ui/tests/browser/acceptance.spec.ts`;
`packages/ui/playwright.config.ts` requires Chromium,
Firefox and WebKit. These engines do not establish real-device or assistive-
technology conformance.

Run these commands from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build:browser-docs
pnpm --filter @structured-growth/sg-ui exec playwright install --with-deps chromium firefox webkit
pnpm test:browser
```

The suite typechecks before executing. The server binds only to loopback, serves
fresh static output without caching and rejects paths outside that output. Never
rebuild the native fixture bundle while the suite is reading it. Package consumer fixtures still
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
Playwright is the sole axe scan owner for these tests; its rules and violation
assertions remain enabled. Retained legacy manual-scan query values are inert: the
new host has no documentation runtime or accessibility addon.
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
the native docs fixture bundle. The Node 22.12.0 job independently validates package/consumer checks.
See [runtime and artifact evidence](react-aria-runtime-ci.md).

The broad browser matrix, physical touch dragging, manual screen-reader reviews,
zoom/reflow, visual snapshots, IME/paste, clipboard permissions, framework
hydration and full performance/memory budgets remain separate acceptance tasks.
Representative executed gates must not be treated as completion of every G/U/X
or framework requirement.

## Packed browser consumers (R-08/X-18)

`pnpm test:hydration-consumer` builds and packs the library into independent React
18.3.1 and 19.2.3 Vite fixtures. Each browser loads the production output first
with JavaScript disabled, then with hydration enabled. Checks include dark
theme/English locale, committed leap-day dates, unique accessible IDs, hydrated
reference resolution, unchanged server scope identity and real dialog/tab/action
callbacks with focus restoration. React's recoverable hydration errors are
forwarded into the mandatory browser diagnostic assertion.

`pnpm test:next-consumer` independently packs the library and installs exact
Next.js 16.4.2 with React 19.2.3 in a disposable consumer. Its production App
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
native fixture server. The helper enforces 30-second native action/navigation deadlines
and fails on every page error or console warning/error. JSON evidence and failure
screenshots/traces live under `artifacts/packed-browser` and are retained with the
14-day browser artifact. Explicit local engine subsets remain reported as subsets;
CI refuses a subset.
