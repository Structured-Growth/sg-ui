# Batch 10 AuthShell native reflow: M-07/U-02, bounded evidence

AuthShell now preserves useful content space in narrow hosts with enlarged text,
and reveals an entire focused host control when native scrolling exposes only its
caret. The focused Chromium/WebKit matrix passes in light/dark themes at normal
and 200% root text. This supplies the native sizing/reflow evidence missing from
M-07's inventory record; coordinator owns the whole-row acceptance decision.
No broad U/X/R/Z gate is closed.

## Observed defects and implementation

At 320 CSS pixels with 200% root text and increased line/letter/word spacing,
fixed token padding left only 94 pixels inside the panel. The first long footer
link measured 672 pixels tall, larger than the 640-pixel viewport, so native focus
could not reveal its complete bounds. Root and panel gutters now use the existing
spacing tokens as maximums and shrink with the containing width (`min` with
percentage padding). Preferred larger-screen spacing and owned theme surfaces
remain intact. Long headings and footer links wrap; tall content uses document
scrolling; intentionally wide host content scrolls within the body.

After that fix, macOS WebKit's native input focus could leave a control partly
below the viewport while revealing its caret. AuthShell's private focus helper
measures after native focus/layout, intersects viewport and ancestor clipping
bounds, and calls native nearest scrolling only for a clipped control. It stops
if focus moves, the shell/target unmounts, or the target belongs to a nested dialog
or portal outside the shell. The shell now has a client directive for this native
focus event implementation. It adds no login, validation, session, routing,
data-fetching or submission ownership; public props/names/refs remain unchanged.

macOS WebKit plain Tab skips native links in this runtime. A bounded native probe
confirmed Option+Tab reaches the footer anchor. The focused spec uses Option+Tab
and Option+Shift+Tab for WebKit, with ordinary Tab/Shift+Tab in Chromium. No
synthetic focus/scroll correction or layout CSS fix is injected into the tests.

## Ownership and heads

Managed attached isolated worktree:
`/Users/thomashall/.codex/worktrees/batch10-auth-shell-reflow/sg-ui`.
Branch: `codex/batch10-auth-shell-reflow`; draft base: `codex/dev`.
Clean baseline verified before edits: `061a88233f40ebaf4ce554c0add18b2e4af56424`.
Initial evidence-preparation head: `37715f7b60993b57224ab55465f08758d8fc5b6f`.
Final implementation/native-tested head: `be1b0b583f4377a6aaf3478b3573009cc2fec176`.
Final head is the subsequent report-only commit; exact hash is in the coordinator
message and [draft PR #30](https://github.com/Structured-Growth/sg-ui/pull/30).
Primary and all other worktrees were preserved; the same worktree/branch/PR was
continued after the coordinator restored the required validation work.

Changed files (exclusive allowlist):

- `src/components/AuthShell/AuthShell.tsx`: native focus capture/client boundary.
- `src/components/AuthShell/AuthShell.module.css`: responsive token-capped gutters.
- `src/components/AuthShell/revealFocusedControl.ts`: private native focus reveal.
- `src/components/AuthShell/AuthShell.test.tsx`: field identity/focus/state across
  section changes, independent host form callbacks, clipped/visible control behavior
  and deferred stale/removed/nested focus protection.
- `src/components/AuthShell/AuthShell.stories.tsx`: NativeReflow host form with long
  heading/footer links and host submission counter; IndependentContent wide body.
- `tests/browser/batch10-auth-shell-reflow.spec.ts`: five focused cases per engine.
- `docs/developer/parallel-batch-10/auth-shell-reflow.md`: this bounded report.

## Exact local validation and runtime

Runtime: macOS, Node `v24.19.0`, pnpm `10.29.3`, React `19.2.3`,
Playwright `1.63.0`. Commands ran in this worktree with
`PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`.

- `pnpm install --frozen-lockfile`: passed, no tracked dependency changes.
- `pnpm exec vitest run src/components/AuthShell/AuthShell.test.tsx`: baseline
  three tests passed; final implementation six tests passed.
- `pnpm typecheck`: passed with initial new stories.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed with final
  implementation, stories and browser cases (extends source TypeScript config).
- `pnpm foundations:check`: passed final owned import/layer/token boundaries.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed; report relative links verified.
- `pnpm build-storybook`: passed before initial browser execution; rebuilt after
  each observed runtime fix, always after the preceding suite had ended. Final
  fresh static build passed at `be1b0b583f4377a6aaf3478b3573009cc2fec176`.
- `pnpm exec playwright test tests/browser/batch10-auth-shell-reflow.spec.ts --project=chromium --project=webkit`:
  initial 3 passed / 7 failed (padding/focus and WebKit keyboard-path findings);
  gutter/keyboard fix 8 passed / 2 failed (WebKit partially revealed inputs);
  final exact implementation head **10 passed / 0 failed in 34.5 seconds**.

Final browser evidence covers 320 × 640 and 768 × 480 CSS-pixel resize continuity,
normal/200% text and increased text spacing in both themes, no horizontal document/
panel/footer overflow, native Tab focus bounds/hit testing/visible outline, preserved
email value, exactly one Enter submission, all form fields/actions/footer links,
document scrolling and independent wide-body scrolling with stationary heading/
footer horizontal positions. Five cases passed on each engine. Artifacts are the
local ignored `artifacts/browser-results.json` and browser report; logs are
`/tmp/sgui-batch10-auth-shell-browser-initial.log`,
`/tmp/sgui-batch10-auth-shell-browser-final.log` (intermediate gutter result) and
`/tmp/sgui-batch10-auth-shell-browser-focus.log` (final pass).

## Validation serialization and limits

The first atomic lock attempt failed while another chat held it; the initial
report recorded native validation blocked. That was not completion of M-07.
On continuation, the coordinator's priority queue placed this chat first. Bounded
waiting preserved the current grid owner's lock/processes. After the lock became
free, this chat acquired `/tmp/sgui-parallel-batch-01-validation.lock` atomically,
with owner `01a116a4-fa98-7d20-a217-302eca6279e1`. Every heavy build/native probe/
browser run was serialized under that ownership. No build overlapped a suite.
After the final suite exited, Python verified matching lock ownership and the
queue's FIRST entry, removed only this chat's FIRST entry, then rechecked ownership
and released only its own lock. No other worker process/worktree was stopped.

Firefox was not retried: the existing [native profile diagnostic](../parallel-batch-05/firefox-runtime.md)
establishes an unchanged local environment prerequisite. Firefox remains unverified.
No physical device, browser chrome zoom or spoken AT claim is made from automated
CSS text enlargement. Oversized host controls still require their own usable
content design; intentionally wide body content remains horizontally scrollable.
Full production acceptance and broader container/device/display matrices remain
separate. No full check/full browser/consumer matrix, GitHub dispatch/rerun/wait,
workflow change, merge or publication occurred. Dev CI/PR-title runs stay paused.

## Next bounded task and central guidance suggestions

Coordinator suggestion: link this exact-head native evidence from the M-07
inventory row and document token-capped gutters/native focused-control reveal in
AuthShell's shell contract. Reconcile whole-row acceptance separately without
closing broad U/X/R/Z gates. These central documents are outside this worker's
exclusive write allowlist and were preserved.

A next bounded display task could cover AuthShell embedded in a host scrolling
container at short viewport heights, including nested host overlays and focus after
host-controlled form updates. Actual devices/browser chrome zoom/spoken AT remain
manual acceptance work. Owned tokens/public contracts/translations/host account
boundaries and licensing are preserved.
