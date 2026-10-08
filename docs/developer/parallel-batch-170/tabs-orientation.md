# Batch170: owned Tabs orientation (U-09 partial)

## Scope and implementation

Clean isolated managed worktree `/Users/thomashall/.codex/worktrees/7168/sg-ui`
started at `1948d0b54688cf61dfa6708fd94cbc8ca6e21990` on 2026-10-08.
Branch `codex/batch170-tabs-orientation`; only the eight authorized paths changed.
No AppPageTabs or catalog wrapper changes. No broad U-09/manual/device/AT closure.

Owned optional `orientation` defaults to horizontal and maps privately to React Aria.
Vertical layout stacks the owning list beside its panel, with logical inline-end
selection and forced-colors rules. The helper reveals vertical focused items through
only the owning list's scrollTop; existing horizontal reveal remains the default.
Controlled selection, disabled tabs, activation, root ref and native style stay intact.
Consumer contract: [Tabs orientation](../react-aria-tabs-orientation.md).

## Exact-head lightweight evidence

Tested source head: `7de9eaf9cf0a288cc8ae669159b03a503fede46b` (feature commit).
The subsequent report-only commit does not change tested source bytes.
Node `v24.21.0` at `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`; pnpm executable
`/opt/homebrew/bin/pnpm`. All stdout/stderr, command args, exit, HEAD,
per-file SHA-256 and exact lease receipts remain in the ignored local evidence
`artifacts/batch170/`. This report is source-bound preparation, not native proof.

Frozen lock install exited 0 under canonical install slot0 with owner
`batch170-7168-install-6e5ecfdb-8707-4b1f-b040-14049f6b151a` and its legacy guard;
install log SHA-256 `6f52bcbe9cec9ee2f3f096de165e01288ecc160d294d2557a60edccc7cc5d9d1`.
Exact-head checks used `/tmp/sgui-light-validation-slots/slot1` and legacy guard
`/tmp/sgui-light-validation-slots/slot-1`, owner `batch170-7168-light-c3f9473e-c777-4e1a-a00e-dfbe4b133f67`.
All leases released by their matching owner; foreign85 light0 was untouched.

Commands:

- `pnpm exec vitest run src/experimental/Tabs/Tabs.test.tsx src/components/AppPageTabs/AppPageTabs.test.tsx --maxWorkers=1`: 14 tests in 2 files passed.
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

| Check | Exit | Actual stdout/stderr SHA-256 |
| --- | --- | --- |
| units | 0 | `ee391ee8575f7a0245a2358c21077656e41d9d2e3cc74a3600fe31ccc31f6edd` |
| types | 0 | `aca4855e97e8a1dbfd1cd18ad1e67f4ed8c80b43597c3c84359bbaf56bfdd973` |
| browser-types | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| foundations | 0 | `f65b7afcf06b99c32dc99fbcaa02fe3c65acc1b2c69f2087362cdf3382e38687` |
| tokens | 0 | `9ba322197bbaae6a43d561fb9fb979ebf7c92e727fafeb1cc0b3400155db8904` |

The unit logs include jsdom's unsupported hyperlink-navigation diagnostic from
AppPageTabs' existing link case; tests still exited 0. Initial vertical fixture
failed because a manually assigned scrollLeft lacked the native scroll event used
by React Aria's scroll-position memory. Dispatching that event corrected the
fixture without changing product behavior or weakening the assertion. Red log and
receipt are retained under `artifacts/batch170/attempt1/`; corrected precommit
checks are retained under `attempt2/`.

Final tested source hashes:

- `src/experimental/Tabs/Tabs.tsx`: `6e2a35d4cd78f005d9465fbe8d99de9b05340492ee6327458a298e9af81ce847`
- `src/experimental/Tabs/Tabs.module.css`: `799b8926f072f5a0cfe05a3583ffea5afe51de90daa393adb5d6e0fc50210190`
- `src/experimental/Tabs/scrollTabIntoView.ts`: `5730dbfc9024dd98ff9381d716bafb62c230b3fbaf289016b27e6d327b410618`
- `src/experimental/Tabs/Tabs.test.tsx`: `04c8f74c5f5c3ebf6cb7706a2897ce4b34c179ffc9accab649cc7efadab49567`
- `src/experimental/Tabs/Tabs.stories.tsx`: `68276dace3fd3467e3d83c2255ff3d915aad2111b2244cb268a2908ee081c7e4`
- `tests/browser/tabs-vertical-orientation.spec.ts`: `33cd870fcd2feecf75517fc2514bef6483496f1f93cc3672e309ffaca08afd40`

## Prepared native cases and pending validation

`tests/browser/tabs-vertical-orientation.spec.ts` prepares five distinct cases:
vertical automatic/manual in en-US/ar-EG at 200% text, and a default horizontal
RTL regression. Vertical cases assert Up/Down disabled skipping, Home/End and
reverse wrap, explicit manual activation, owning-list overflow reveal in both
directions, logical border layout and unchanged window/host/other-list scroll.
Stories include vertical automatic/manual and bounded two-list overflow compositions.
Existing batch05 horizontal overflow cases remain available to the coordinator.

No full check, build, Storybook, browser or native execution was performed here.
Fresh focused Chromium and later Firefox/WebKit execution, visual/density review,
manual and assistive-technology acceptance remain pending with the coordinator.
No merge, push, PR, publish, workflow/security edits or other worktree cleanup.
