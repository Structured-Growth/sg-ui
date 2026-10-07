# Batch 13 formatting toolbar — E-03/E-04 partial

## Isolation and scope

- Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Exactly one managed, attached worktree: `/Users/thomashall/.codex/worktrees/batch13-formatting-toolbar/sg-ui`.
- Branch: `codex/batch13-formatting-toolbar`; draft [PR #72](https://github.com/Structured-Growth/sg-ui/pull/72), base `codex/dev`.
- Implementation/tested head: `1226f53ebcc1aca9e8593dd13464dc80edecce09`.
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

Fresh Storybook/browser execution is **pending** approved browser scheduling. The existing heavy lock and `/tmp/sgui-browser-validation-priority.json` queue were respected; no other worker lock was removed or stolen, no process was stopped, and no independent browser pool bypass or unchanged Firefox retry was attempted. These native tests have only passed typechecking; queued work is not a browser pass. Do not integrate this native-timing change until focused fresh browser evidence is added.

Per the [development validation policy](../react-aria-development-validation.md), no full `pnpm check`, whole Storybook suite or GitHub CI/title workflow was run or dispatched. No merge, main change, publication, version, credentials, permissions, secrets or license modification occurred.

## Follow-up scope

1. Under approved shared browser scheduling, build fresh Storybook at the implementation head and run only `tests/browser/batch13-formatting-toolbar.spec.ts`; record commands, engines, counts and tested head here. Repair any demonstrated native defect within this same allowlist.
2. E-03/E-04 wider editor command/selection matrix and manual/device/assistive-technology gates remain open. Individual menu controls remain outside this task's write scope; any demonstrated issue there requires its own exact component/test/story allowlist.
