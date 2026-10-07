# Page header native reflow acceptance

Bounded task: M-04/U-19. Status: **bounded Chromium/WebKit slice passed**. Firefox and whole-row/broad
acceptance remain separate.
No broad U/X/R/Z gate or inventory row is closed.

## Ownership and baseline

Worktree: `/Users/thomashall/.codex/worktrees/batch10-page-header-reflow/sg-ui`.
Branch: `codex/batch10-page-header-reflow`; draft PR base: `codex/dev`.
[Draft PR #32](https://github.com/Structured-Growth/sg-ui/pull/32).
The single managed attached worktree was created from
`061a88233f40ebaf4ce554c0add18b2e4af56424`; initial status was clean and HEAD
matched that ref before edits. Primary and all other worktrees were preserved.
Applicable AGENTS, [development validation](../react-aria-development-validation.md),
[inventory acceptance](../react-aria-migration-inventory-acceptance.md) and
[page layout contract](../react-aria-page-layout.md) were inspected.

Initial fixture/test commit: `823b31a717a6c871a752f0c51ee5b04ed8421c24`.
Final native-tested implementation head:
`f1ec49bbd9934d1ab975adf876ca12d9898c6aa2`.
Fresh Storybook was built at `a6e704f434e152a2e7a0cab2b0938ad37f943986`;
the subsequent commit changes only the browser spec, so those exact story/runtime
sources remain identical. No rebuild occurred during either suite.
The final documentation commit is the branch HEAD following this tested head;
its exact hash and draft PR URL are supplied in the completion report and PR body
rather than embedded recursively in its own committed content.

## Changes

- [Header stories](../../../src/components/AppPageHeader/AppPageHeader.stories.tsx)
  add ReflowActions and ReflowMenu with long spaced/unbroken host breadcrumbs,
  title, description, icon metadata, multiple supplied actions and disabled menu
  commands. They use production scope/tokens and existing owned controls.
- [Focused browser spec](../../../tests/browser/batch10-page-header-reflow.spec.ts)
  runs 12 cases per engine: light/dark, 1280px/320px/640px with 200% root text,
  and supplied-action/overflow-menu variants. Assertions measure header/descendant
  horizontal bounds, resolved hierarchy surfaces and inherited text contrast,
  collapsed-path keyboard focus/Escape restoration, disabled action skipping,
  menu activation/restoration, and visible/unobscured action tab stops.
- This report is the only documentation changed. No runtime/style fix was made:
  the native matrix confirms the existing owned wrapping implementation.

## Local validation

Runtime: Node `24.21.0`, pnpm `10.29.3`, Vitest `4.1.11`, Playwright `1.63.0`, React `19.2.3`.
Commands used `node /tmp/sgui-run24.mjs <pnpm arguments>`; that launcher resolves
Node 24 and prepends its binary directory to PATH. Equivalent reproducible setup:

```sh
PATH=/Users/thomashall/Library/pnpm/store/v11/links/@/node/24.21.0/8e3363dcf6f5ccdfdbb0a5b55fe716a72499ddb103e848ba9405f4e34d178319/node_modules/node/bin:$PATH
pnpm install --frozen-lockfile
pnpm exec vitest run src/components/AppPageHeader/AppPageHeader.test.tsx src/components/AppPageHeader/AppPageHeader.ssr.test.tsx
pnpm typecheck
pnpm exec tsc --noEmit -p tests/browser/tsconfig.json
pnpm foundations:check
pnpm tokens:check
git diff --check
```

All listed commands passed: 2 unit/SSR files, 5 tests. Browser TypeScript passed
again after adding wide-layout cases and after correcting native tab sequencing.
No runtime code/style change required repeating unit tests or broader source checks.

Native commands, also under Node 24:

```sh
pnpm build-storybook
pnpm exec playwright test tests/browser/batch10-page-header-reflow.spec.ts --project=chromium --project=webkit
```

Fresh Storybook passed. Initial native run at `a6e704f` had 12 Chromium passes and
12 WebKit failures at action-focus assertions, after bounds/contrast/path-menu
assertions passed. A bounded diagnostic against that same build recorded actual
native focus after Escape and each Tab: WebKit in this profile skips the ancestor
anchor with plain Tab, whereas Chromium includes it. The test had assumed both
engines include that anchor. The correction permits only this specific breadcrumb
as an intermediate stop, verifies its focus visibility if visited, then requires
the action focus/visibility and subsequent action/menu keyboard behavior. It does
not skip arbitrary controls, remove a failing layout assertion or change production
focus behavior. Final focused run at `f1ec49b`: **24 passed (10.2 seconds)**,
12 Chromium and 12 WebKit. No demonstrated runtime reflow defect was found.

The original atomic lock attempts failed fast with existing owner
`01a1167a-e25f-7c62-a2b4-126127c725ab`; this was reported as a temporary blocker.
On continuation, the coordinator established the priority queue. This worker
waited in bounded intervals behind auth-shell/card-frame, acquired the shared
lock only when its own ID was first and the directory free, and wrote owner
`01a116a4-f72f-7853-b068-47a3e2ebe9cb`. The lock covered the build, both suites and
bounded diagnostic. After completion, Python checked both queue-first and lock
ownership, removed only its own first queue entry, then checked owner again and
removed only its own owner file/lock directory. No other worker/server/worktree
was stopped, modified or released.

Firefox remains unverified under the recorded local native/profile prerequisite;
no unchanged launch, reinstall or TMPDIR diagnostic was repeated. GitHub
CI/PR-title automation for `codex/dev` remains user-paused; no dispatch, rerun,
wait or reenable was attempted. No routine full check/browser/consumer suite ran.

## Next bounded task and coordinator guidance

The missing representative M-04 native responsive wrapping slice now has fresh
Chromium/WebKit evidence. Coordinator can link this report from the inventory
and distinguish those passes from Firefox/whole-row acceptance. No master,
AGENTS, progress or shared tabs/menu/scope files changed in this exclusive task.
No out-of-scope product defect was established.

Suggested next bounded task: execute this same matrix after the independently
owned Firefox native/profile prerequisite is repaired, preserving exact tested
head/runtime evidence. Further browser-chrome zoom, physical-device and spoken
assistive-technology validation need their own native/manual evidence; automated
root text enlargement does not establish them. Production/full acceptance and
broad U/X/R/Z gates remain open.
