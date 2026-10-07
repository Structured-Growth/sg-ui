# Page header native reflow acceptance preparation

Bounded task: M-04/U-19. Status: **blocked native execution; not accepted**.
No broad U/X/R/Z gate or inventory row is closed.

## Ownership and baseline

Worktree: `/Users/thomashall/.codex/worktrees/batch10-page-header-reflow/sg-ui`.
Branch: `codex/batch10-page-header-reflow`; draft PR base: `codex/dev`.
The single managed attached worktree was created from
`061a88233f40ebaf4ce554c0add18b2e4af56424`; initial status was clean and HEAD
matched that ref before edits. Primary and all other worktrees were preserved.
Applicable AGENTS, [development validation](../react-aria-development-validation.md),
[inventory acceptance](../react-aria-migration-inventory-acceptance.md) and
[page layout contract](../react-aria-page-layout.md) were inspected.

Implementation/test commit: `823b31a` (full hash available through Git).
The final report commit is the branch HEAD following this implementation commit;
its exact hash and draft PR URL are supplied in the completion report and PR body
rather than embedded recursively in its own committed content.

## Changes

- [Header stories](../../../src/components/AppPageHeader/AppPageHeader.stories.tsx)
  add ReflowActions and ReflowMenu with long spaced/unbroken host breadcrumbs,
  title, description, icon metadata, multiple supplied actions and disabled menu
  commands. They use production scope/tokens and existing owned controls.
- [Focused browser spec](../../../tests/browser/batch10-page-header-reflow.spec.ts)
  prepares 12 cases per engine: light/dark, 1280px/320px/640px with 200% root text,
  and supplied-action/overflow-menu variants. Assertions measure header/descendant
  horizontal bounds, resolved hierarchy surfaces and inherited text contrast,
  collapsed-path keyboard focus/Escape restoration, disabled action skipping,
  menu activation/restoration, and visible/unobscured action tab stops.
- This report is the only documentation changed. No runtime/style fix was made:
  missing native evidence alone does not demonstrate a product defect.

## Local validation

Runtime: Node `24.21.0`, pnpm `10.29.3`, Vitest `4.1.11`, React `19.2.3`.
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
again after adding the wide-layout cases. Typechecking/guards are not evidence
that the newly authored native assertions pass.

Atomic `os.mkdir('/tmp/sgui-parallel-batch-01-validation.lock')` attempts failed
fast with an existing lock. The existing owner was
`01a1167a-e25f-7c62-a2b4-126127c725ab`. This worker never acquired, changed or
released that owner's lock, launched a heavy build/browser/fixed-port server,
rebuilt during a suite, or stopped another worker.
Fresh Storybook and Chromium/WebKit execution are **unverified** because the
required shared heavy-validation lock was unavailable. Firefox remains unverified
under the recorded local native/profile prerequisite; no unchanged launch,
reinstall or TMPDIR diagnostic was repeated. GitHub CI/PR-title automation for
`codex/dev` remains user-paused; no dispatch, rerun, wait or reenable was attempted.
No routine full check/browser/consumer suite was run.

## Next bounded task and coordinator guidance

When the shared lock is available, acquire it atomically with this chat's owner
ID, build fresh Storybook, and run only this spec with Chromium and WebKit:

```sh
pnpm build-storybook
pnpm exec playwright test tests/browser/batch10-page-header-reflow.spec.ts --project=chromium --project=webkit
```

Keep the lock through the suite and release only after checking the owner file
matches the acquiring chat. Diagnose any actual failure before touching runtime
CSS; restrict fixes to AppPageHeader and rerun affected cases. A failed shared
menu/scope/tab dependency belongs in a separately owned task. No such defect was
established in this attempt. Record exact native-tested head and final results
before recommending M-04's row acceptance.

Coordinator suggestion: link this preparation from the inventory only as pending
native evidence. Do not update master/AGENTS/progress to imply acceptance.
Automated root text enlargement does not verify physical devices, browser chrome
zoom or spoken assistive technology. Firefox and production/full acceptance
remain separate requirements.
