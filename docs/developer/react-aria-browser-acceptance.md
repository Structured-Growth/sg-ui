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

The broad browser matrix, pointer/touch dragging, manual screen-reader reviews,
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

Final local Node 24 execution passes 30/30 tests across Chromium and WebKit,
including 16 accessibility scans, in 23.7 seconds. Results:
`/tmp/sgui-browser-final.log` and `artifacts/browser-results.json`. The default
three-engine command remains mandatory in Linux CI; this local subset does not
claim Firefox behavior. Full `pnpm check` passes on Node 24 and exact-minimum
22.12.0 (138 files, 857 tests); Storybook and all eight packed foundation/editor
React 18/19 consumers across both runtimes pass.
