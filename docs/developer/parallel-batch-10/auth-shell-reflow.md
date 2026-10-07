# Batch 10 AuthShell reflow: M-07/U-02, native validation blocked

The bounded implementation adds host-owned representative stories and focused
reflow regressions. Four colocated behavior tests pass, including preserved native
field identity/focus/state across shell section changes and independent host form
submission. No observed shell layout defect was established, so no speculative
runtime/CSS change was made. Native resilient sizing/reflow remains unverified;
M-07 stays Hold and no broad U/X/R/Z gate is closed.

## Ownership and heads

Managed attached isolated worktree:
`/Users/thomashall/.codex/worktrees/batch10-auth-shell-reflow/sg-ui`.
Branch: `codex/batch10-auth-shell-reflow`; draft base: `codex/dev`.
Clean baseline verified before edits: `061a88233f40ebaf4ce554c0add18b2e4af56424`.
Implementation/lightweight-tested head: `37715f7b60993b57224ab55465f08758d8fc5b6f`.
Final head is the subsequent report-only commit; exact hash is in the coordinator
message and [draft PR #30](https://github.com/Structured-Growth/sg-ui/pull/30).
Primary and all other worktrees were preserved.

Changed files (exclusive allowlist):

- `src/components/AuthShell/AuthShell.test.tsx`: native field continuity and two
  independent host form callbacks; presentation-only shell assertions.
- `src/components/AuthShell/AuthShell.stories.tsx`: NativeReflow host form with long
  heading/footer links and host submission counter; IndependentContent wide body.
- `tests/browser/batch10-auth-shell-reflow.spec.ts`: four light/dark normal/200%
  text cases at 320 CSS pixels, resize continuity, document/panel/footer overflow,
  native keyboard submit, visible focus and document scrolling; independent wide
  body scrolling case. These five cases are authored/typechecked, not executed.
- `docs/developer/parallel-batch-10/auth-shell-reflow.md`: this bounded report.

## Local validation

Runtime: macOS, Node `v24.19.0`, pnpm `10.29.3`, React `19.2.3`,
Playwright `1.63.0`. Commands ran in this worktree with
`PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`.

- `pnpm install --frozen-lockfile`: passed, no tracked dependency changes.
- `pnpm exec vitest run src/components/AuthShell/AuthShell.test.tsx`: baseline
  three tests passed; final four tests passed.
- `pnpm typecheck`: passed with new stories.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed with final test/story sources.
- `pnpm foundations:check`: passed owned imports/layers/tokens.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed.

The atomic `mkdir` acquisition of
`/tmp/sgui-parallel-batch-01-validation.lock` failed fast because owner
`01a1167a-e25f-7c62-a2b4-126127c725ab` held it. No owner file was changed,
no process/server was launched and no lock was released. No fresh Storybook build
or browser run occurred. Do not interpret authored assertions as native evidence.
Firefox was not retried: the existing [native profile diagnostic](../parallel-batch-05/firefox-runtime.md)
establishes an unchanged local environment prerequisite.

No full check, full browser/consumer matrix, GitHub dispatch/rerun/wait, workflow
change, merge or publication occurred. Automatic dev CI/PR-title checks remain
user-paused. Physical devices, browser chrome zoom and spoken AT are unverified;
automated CSS text enlargement, when run, will not establish them.

## Next bounded task and central guidance suggestions

When the shared heavy-validation lock is available, acquire it atomically with the
executing chat ID, build fresh Storybook once, then run only
`pnpm exec playwright test tests/browser/batch10-auth-shell-reflow.spec.ts --project=chromium --project=webkit`.
Never rebuild during that suite. Release only the executing chat's lock after an
exact-owner Python check. Evaluate failures before editing: fix observed AuthShell
layout defects only, reserve out-of-scope primitive/story-provider defects, and
record exact tested head/runtime/results. Native acceptance is still required.

Coordinator suggestion: link this report from the M-07 inventory record as
**blocked native evidence preparation**, retaining Hold. Do not mark M-07/U-02
complete until focused execution proves the bounded cases and any remaining
criteria are reconciled. Owned props/tokens/refs/public names/translations,
host account boundaries and licensing are unchanged.
