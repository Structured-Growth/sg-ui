# Batch 13 formatting toolbar — E-03/E-04 partial

## Isolation and scope

- Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Exactly one managed, attached worktree: `/Users/thomashall/.codex/worktrees/batch13-formatting-toolbar/sg-ui`.
- Branch: `codex/batch13-formatting-toolbar`; draft [PR #72](https://github.com/Structured-Growth/sg-ui/pull/72), base `codex/dev`.
- Implementation/unit-tested head: `1226f53ebcc1aca9e8593dd13464dc80edecce09`.
- Fresh static Storybook source head: `1e93e1c1ff5dff3df029465c8d30ab1a6dca70bd`; final native spec head: `7967dfc9a885497807894efd74e419b5cd81305a`. The intervening commit changes only browser-test result selectors; implementation/story bytes remain identical.
- Exclusive write allowlist: `src/components/RichTextFormattingToolbar/`, `tests/browser/batch13-formatting-toolbar.spec.ts`, this report. All other components, contracts, barrels, configuration and workflows remained read-only. No public API or breaking mapping changed.

## Finding and change

Existing [M-26 evidence](../react-aria-progress.md#rich-text-formatting-toolbar) and colocated tests already cover ordinary controlled pressed state, missing callbacks, pointer link preparation, Enter/Space actions, form safety, nested commands and chooser focus ordering. Real Lexical-host tests cover selection-preserving formatting and pointer link preparation. Those completed paths were not reimplemented.

The small unfinished combination was host callback availability replacement during deferred chooser delivery. Heading/font choices intentionally defer commands until native chooser handling completes. Five new regressions demonstrated that replacing the callback, removing it, or disabling the heading control/set before delivery still invoked the previous callback.

Deferred delivery now reads the current committed heading/font callbacks and disabled restrictions. Available replacement callbacks receive the chosen value once; missing/disabled callbacks receive no request. Controlled values remain host-owned. The delay and unmount timer cleanup remain intact. The new `CallbackReplacement` story demonstrates host owner replacement before delivery and editor refocus after accepted delivery.

## Targeted local evidence

Runtime: Node `26.5.0`, pnpm `10.29.3`, Vitest `4.1.11`, React `19.2.3`, Playwright `1.63.0`. This is not Node 24 or React 18 evidence.

- `pnpm install --frozen-lockfile`: passed; 608 packages reused, zero downloads. Existing ignored esbuild build-script warning; no approval settings changed.
- `pnpm exec vitest run src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.test.tsx --maxWorkers=1`: before the fix, 5 failed / 7 passed (12 tests); after the fix, 12 passed.
- `pnpm exec vitest run src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.test.tsx src/components/PageRichTextEditorSection/PageRichTextEditorSection.floating.test.tsx --maxWorkers=1`: 2 files / 14 tests passed. The host file was read-only.
- `pnpm typecheck`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `git diff --check`: passed.

Atomic install slot0 and light-validation slot1 were claimed under the shared slot directories with unique owner token `batch13-formatting-toolbar-01a116b2` and released only after verifying matching ownership. Install concurrency stayed within 2; Vitest used one worker within the four shared light slots.

## Native evidence and limits

Six focused Playwright cases are checked in for heading/font Enter selection while the host replaces/removes/disables callbacks. They assert current-owner delivery or rejection, retained controlled chooser values, unchanged host text and accepted-command editor focus.

`pnpm build-storybook` passed freshly at `1e93e1c1ff5dff3df029465c8d30ab1a6dca70bd` with existing module-directive/sourcemap/large-chunk warnings. After the priority queue emptied, the legacy lock was atomically claimed with exact chat owner `01a116b2-1308-7332-a5e6-c85bd6cccf25`. Coordinator rollout instructions then explicitly allowed this already-active build/suite to finish normally. No new browser pool/config was copied or independently merged.

`pnpm exec playwright test tests/browser/batch13-formatting-toolbar.spec.ts --project=chromium --project=webkit --workers=1`: initial attempt had 12 failures solely from an ambiguous unnamed `getByRole('status')` assertion also matching the toolbar font-size output. The test locator was narrowed to the unnamed host result, browser-test typechecking passed again, and the same focused command passed **12/12** (6 Chromium + 6 WebKit) in 5.8 seconds at `7967dfc9a885497807894efd74e419b5cd81305a`. Product/story source did not change; the original fresh static build was reused without rebuilding during either suite.

Native evidence covers chooser Enter, host replacement before deferred delivery, unavailable request rejection, retained controlled values, unchanged contenteditable text and accepted-command focus. The suite captured no page errors. Results are in worktree-local ignored `artifacts/browser-results.json` / `artifacts/browser-report/`. The fixed-port server completed under Playwright; only the matching own legacy lock was released after completion. No other worker lock or process was touched. Firefox was not attempted because the existing unchanged environment prerequisite remains unresolved; no reinstall/launch retry was made.
Per the [development validation policy](../react-aria-development-validation.md), no full `pnpm check`, whole browser matrix or GitHub CI/title workflow was run or dispatched. No merge, main change, publication, version, credentials, permissions, secrets or license modification occurred.

## Follow-up scope

1. Once the Firefox environment prerequisite is repaired, run the same focused spec through the approved browser harness on Firefox; do not treat the two-engine result as the complete browser matrix.
2. E-03/E-04 wider editor command/selection matrix and manual/device/assistive-technology gates remain open. Individual menu controls remain outside this task's write scope; any demonstrated issue there requires its own exact component/test/story allowlist.
