# Batch 05: Tabs native overflow (U-09)

## Scope and result

This bounded slice adds native coverage for the owned experimental Tabs. The
existing four colocated unit tests already covered automatic/manual activation,
disabled skipping, controlled selection, host-locale RTL arrows and a mocked
clipped-tab scroll. No browser spec exercised this proof Tabs component.

Eight new browser cases cover automatic/manual activation in en-US/ar-EG at
100%/200% root text size with a 380px viewport and a constrained strip. They assert
horizontal orientation, disabled skipping, Space/Enter activation, Home/End and
reverse wrapping, reciprocal aria-controls/aria-labelledby, and native Tab and
Shift+Tab panel access. The focused tab must fit fully inside the actual strip and
viewport after each tested keyboard move. Two colocated stories expose overflow.
No implementation defect surfaced; no public defaults or AppPageTabs changes.

## Files and ownership

- `src/experimental/Tabs/Tabs.stories.tsx`
- `tests/browser/batch05-tabs-overflow.spec.ts`
- `docs/developer/parallel-batch-05/tabs-overflow.md`

Worktree: `/Users/thomashall/.codex/worktrees/batch05-tabs-overflow/sg-ui`.
Branch: `codex/batch05-tabs-overflow`.
Exact clean baseline verified before edits: `cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`.
Implementation/coverage commit: `28a2f447b9b4d3b88eb0e4fc2a1350c7627f8d05`.
Final commit is the report-only commit containing this record, on the same branch;
its exact hash is supplied in the coordinator completion message and PR head.
Draft PR: [#16](https://github.com/Structured-Growth/sg-ui/pull/16), targeting `codex/dev`.
Primary and other checkouts were not edited.

## Validation

Runtime: Node `v24.21.0`, pnpm `10.29.3`, React `19.2.3`, macOS arm64.
All commands ran in the isolated worktree with the Node 24 binary directory
prepended to PATH. The binary is
`/Users/thomashall/Library/pnpm/store/v11/links/@/node/24.21.0/8e3363dcf6f5ccdfdbb0a5b55fe716a72499ddb103e848ba9405f4e34d178319/node_modules/node/bin/node`.

- `pnpm install --frozen-lockfile`: passed; lockfile unchanged.
- `pnpm exec vitest related --run src/experimental/Tabs/Tabs.tsx src/experimental/Tabs/scrollTabIntoView.ts`:
  passed, five files / 18 tests, 1.09s. Related tests emitted a jsdom navigation
  not-implemented diagnostic; it did not fail tests and native behavior is covered
  separately by the browser cases.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed, including the
  final eight-case version of the browser spec.
- `pnpm typecheck`: passed on implementation commit `28a2f44`.
- `pnpm foundations:check`: passed.
- `pnpm build-storybook`: passed, freshly built for this change. Log:
  `/tmp/sgui-batch05-tabs-storybook.log`.
- `pnpm exec playwright test tests/browser/batch05-tabs-overflow.spec.ts`:
  **matrix incomplete**, exit 1; 16 passed (eight Chromium, eight WebKit), eight
  Firefox launch failures. Duration 13.0s. Firefox exited before test execution
  with `Could not find profile folder`. No Firefox assertion ran or passed.
  Log: `/tmp/sgui-batch05-tabs-browser.log`; detailed results in ignored
  `artifacts/browser-results.json` and `artifacts/browser-traces/`.
- `git diff --check`: passed.

The behavioral checks tested baseline plus the exact changes committed in
`28a2f44`; the final report commit only adds this Markdown record.
Fresh Storybook build and the browser process/server held the atomic directory
lock `/tmp/sgui-parallel-batch-01-validation.lock`, with owner chat
`01a11673-c7d0-75a2-948c-0c07aece3334`. Python cleanup verified this owner before
removing the lock after browser/server completion. Storybook was not rebuilt
during the suite. No full check, consumer suite or broad browser suite ran.

## Limits and next bounded task

Firefox execution remains pending in an environment where its profile launches.
The text-enlargement cases alter the root rem size; they do not claim browser zoom,
physical device, touch or assistive-technology acceptance. Vertical orientation is
not exposed by this Tabs API; no new orientation API is introduced. Wider U-09 and
broad acceptance gates remain open.

Proposed next slice: define the owned vertical-orientation contract, then implement
and verify Up/Down navigation and vertical layout/overflow within the Tabs directory.
A separate environment repair/CI run should provide Firefox evidence for this spec.

Central guidance updates proposed for the coordinator: link this bounded U-09
native horizontal/RTL record from progress guidance; preserve the open vertical,
manual/device/AT and Firefox limits. No central guidance was edited because it lies
outside this assignment's allowlist.
