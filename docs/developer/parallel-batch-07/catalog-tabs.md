# Batch 07: catalog page tabs (M-05/U-09)

## Scope

Baseline `fbaba5b424816be7f386b919113d0b664546bff7` already integrates batch05
experimental Tabs overflow coverage. That prerequisite is distinct from catalog
wrapper acceptance. Existing AppPageTabs tests cover basic manual/controlled
selection and route overflow. This slice adds the missing native tab-mode density
and keyboard matrix, plus composed independent-instance/host-control evidence.
No implementation defect surfaced; public defaults,
names and routing contracts are preserved. No orientation API is added.

The new NativeKeyboard story composes two independently controlled AppPageTabs
instances with duplicate item IDs, a disabled middle item, panel content and hrefs.
Tab mode continues to own selection and panels even when hrefs are supplied.
Two new unit cases check host-withheld manual selection requests followed by host
acceptance, unique reciprocal tab/panel IDs, isolated instances, and route-mode
normal link keyboard behavior without tab panels or arrow selection.

The 32 catalog browser cases cover automatic/manual activation, en-US/ar-EG,
100%/200% root rem size, default density inherited from both scope densities, and
explicit compact/comfortable overrides of the opposite scope. A 380px viewport
and constrained strip exercise real overflow. Cases assert disabled skipping,
Space/Enter, Home/End, reverse wrapping, reciprocal wiring, native Tab/Shift+Tab
panel access, full focused-tab visibility and a nonzero rendered focus outline.
Both instances are operated and selection isolation is checked. Compact explicit
cases use the dark theme; other cases use the light theme.

## Ownership and heads

Worktree: `/Users/thomashall/.codex/worktrees/batch07-catalog-tabs/sg-ui`.
Branch: `codex/batch07-catalog-tabs`. Clean exact baseline verified before edits.
Coverage commit: `13f3c5536ad2b0673839a617c6fafd16911fa0a3`.
Draft PR: [#33](https://github.com/Structured-Growth/sg-ui/pull/33), targeting `codex/dev`.
Final head is the report-only commit containing this record; its exact hash is
supplied in the coordinator completion message and PR metadata.

Exclusive changed files:

- `src/components/AppPageTabs/AppPageTabs.stories.tsx`
- `src/components/AppPageTabs/AppPageTabs.test.tsx`
- `tests/browser/batch07-catalog-tabs.spec.ts`
- `docs/developer/parallel-batch-07/catalog-tabs.md`

Primary and other worktrees were not edited. Shared guidance was not edited.

## Validation

Runtime: Node `v24.21.0`, pnpm `10.29.3`, React `19.2.3`, macOS arm64.
Node 24 binary directory was prepended to PATH:
`/Users/thomashall/Library/pnpm/store/v11/links/@/node/24.21.0/8e3363dcf6f5ccdfdbb0a5b55fe716a72499ddb103e848ba9405f4e34d178319/node_modules/node/bin`.

- `pnpm install --frozen-lockfile`: passed, tracked lockfile unchanged.
- `pnpm exec vitest run src/components/AppPageTabs/AppPageTabs.test.tsx src/experimental/Tabs/Tabs.test.tsx`:
  passed, two files / 10 tests.
- `pnpm exec vitest related --run src/components/AppPageTabs/AppPageTabs.tsx`:
  passed, three files / 14 tests. jsdom emitted its existing navigation
  not-implemented diagnostic from the modified-click test; assertions passed.
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

- `pnpm build-storybook`: passed; freshly built from coverage commit `13f3c55`.
  Log: `/tmp/sgui-batch07-catalog-tabs-storybook.log`.
- `pnpm exec playwright test tests/browser/batch07-catalog-tabs.spec.ts tests/browser/batch05-tabs-overflow.spec.ts --project=chromium --project=webkit`:
  passed, 80 cases / 36.7s: 32 new catalog cases and eight prerequisite cases per
  engine. No assertion or launch failures in the selected engines.
  Log: `/tmp/sgui-batch07-catalog-tabs-browser.log`; detailed ignored results:
  `artifacts/browser-results.json` and `artifacts/browser-traces/`.

All behavioral checks exercised the coverage changes committed in
`13f3c5536ad2b0673839a617c6fafd16911fa0a3`. Fresh Storybook and browser checks ran
at that exact HEAD; the subsequent report-only commit does not alter source/tests.
The full three-engine matrix remains incomplete because Firefox was intentionally
not attempted under the separate diagnosis assignment. No Firefox test passed.

The fresh build and browser/server process were serialized under the atomic
`/tmp/sgui-parallel-batch-01-validation.lock`, owner chat
`01a11678-c0d7-7f33-9a88-25e2cfe54643`. Queued acquisitions yielded while the
coordinator's priority queue was nonempty. Python cleanup checked the owner before
releasing only this chat's lock after the browser/server completed. Storybook was
not rebuilt during the suite. No full check, broad browser or consumer suite ran.
The coordinator's human-authorized pause of automatic codex/dev CI/PR-title runs
is honored: no GitHub dev checks were dispatched, retried or awaited, and no
workflow file was edited. Main/production validation remains outside this slice.

## Limits and next bounded task

Firefox macOS launch diagnosis belongs to a separate chat. This worker does not
repeat the known profile launch failure or alter engine configuration. No Firefox
acceptance is claimed. Root rem enlargement is not browser zoom. Physical devices,
touch, actual assistive-technology announcements and manual visual acceptance
remain unverified. The horizontal API has no vertical orientation contract.
Whole-row M-05/U-09 and broad acceptance gates remain held/open.

Next bounded task: run this catalog spec in repaired Firefox/CI, followed by
explicit manual browser zoom and assistive-technology tab/panel checks. Do not
invent a vertical API merely to close an inventory row.

Central guidance suggestion: link this catalog evidence alongside batch05's
experimental prerequisite while preserving Firefox/manual/device/AT limits and
held inventory status. No shared master, AGENTS or progress edits were made.
