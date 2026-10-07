# M-28 alignment direction native regression

Base: reviewed `codex/dev` commit `4c9f859bad204a7d7fd2e3787aa6f293db268525`.
Branch: `codex/batch38-align-direction-native`.
Worktree: `/Users/thomashall/.codex/worktrees/batch38-align-direction/sg-ui`.

## Evidence and scope

The [batch31 inventory](../parallel-batch-31/inventory-acceptance-25-37.md)
identifies missing native LTR/RTL logical start/end versus physical left/right
command evidence. Existing Center and
[portal-direction cases](../../../tests/browser/batch05-portal-direction.spec.ts)
are prerequisites and are not duplicated here. The
[menu contract](../react-aria-editor-menus.md) leaves alignment and indentation
state with the host.

The [DirectionCommands story](../../../src/components/TextAlignMenuControl/TextAlignMenuControl.stories.tsx)
records requests without accepting their alignment. F2 represents an external
host selection replacement while the menu is open. Outdent has a callback but
is host-restricted; Indent has no callback. The
[focused spec](../../../tests/browser/inventory-align-direction.spec.ts) has four
cases, two in each explicit visual direction with the same English locale:

- Compare visible logical icon paths with physical left/right icon paths in the
  actual browser CSS cascade; verify physical icons have no mirroring transform,
  logical trigger icons and unchanged physical labels.
- Activate physical left/right and logical start/end using native keyboard input;
  assert exact ordered host requests, unchanged controlled alignment, closure and
  trigger focus after each command.
- Replace the host value while open; assert exactly one checked radio item and
  updated trigger label/icon, without delivering a command.
- Navigate End and wrapping arrows past both unavailable indentation commands;
  Escape closes and restores focus to the updated trigger without any request.

Two new colocated unit cases exercise live replacement and unavailable-command
navigation in LTR/RTL. No demonstrated product defect required implementation,
CSS, public API, shared Menu, editor, or toolbar changes. All writes are inside
this task's exclusive allowlist.

## Executed targeted validation

On 2026-10-07, in the isolated worktree, using atomic token-owned installation
and light-validation slots (released only after matching ownership):

- `pnpm install --frozen-lockfile`: pass; lockfile unchanged. pnpm reported its
  existing ignored esbuild build-script warning; no approval/config change made.
- `pnpm exec vitest run src/components/TextAlignMenuControl/TextAlignMenuControl.test.tsx --maxWorkers=1`:
  pass, one file/eight tests, 1.35 seconds.
- `pnpm typecheck`: pass.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: pass.
- `pnpm foundations:check`: pass.
- `pnpm tokens:check`: pass.
- `git diff --check`: pass.

No failed behavior run occurred in this worker. An initial read in the primary
checkout could not find the development-validation document; it was available
and read at the required reviewed worktree base. That path lookup is not product
or test failure evidence.

## Immutable browser handoff and remaining limits

Coordinator arguments for a freshly built immutable pool at the delivered head:
`tests/browser/inventory-align-direction.spec.ts --project=chromium --workers=1`.
The worker has not started a browser server or heavy build. Chromium is **pending**,
not a pass. Assigned source remains reserved pending actual coordinated native
proof. Firefox/WebKit are pending the coordinated batch checkpoint, with any
failures to be preserved and classified as product, driver/expectation,
environment, or unclassified evidence.

No full per-task check, Storybook build, CI/title dispatch, main merge, publish,
secrets/permissions change or master-checkbox upgrade occurred. Targeted evidence
is not completion of M-28 or broad G/U/X/R/Z acceptance. Physical devices,
assistive technology, translated label review and real host-editor selection
semantics remain outside these automated checks. Coordinator alone reviews and
integrates; delivery supplies the exact clean committed head separately.
