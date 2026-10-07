# Batch 13 control-list completion evidence

Assignment: bounded U-02/X-03 semantic list/native attribute composition. Broad
U/X acceptance, manual/device and assistive-technology gates remain open.

## Isolation and ownership

- Verified baseline before any edit: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- One managed, attached worktree: `/Users/thomashall/.codex/worktrees/batch13-control-list/sg-ui`.
- Branch: `codex/batch13-control-list`.
- Implementation and tested content head: `a430ec12d76fe0dc4d9b9552d908c7da28cc6f5b`.
  The report-only commit follows; final branch head is recorded in the PR and
  coordinator handoff without a self-referential report hash.
- Draft PR base `codex/dev`: [#73](https://github.com/Structured-Growth/sg-ui/pull/73).
- Exclusive write allowlist: `src/experimental/List/`,
  `tests/browser/batch13-control-list.spec.ts`, and this report.
- Actual changes: `List.tsx`, `List.test.tsx`, `List.stories.tsx` under the assigned
  List directory, and this report. No browser spec was added.

Primary/other worktrees, source outside the allowlist, barrels, dependencies,
configuration, shared guides/checklists, workflows and licensing were preserved.
No merges, publication, secret/permission edits, CI dispatches or reruns occurred.

## Inspection, reproduction and fix

Read repository AGENTS, development-validation guidance, README, migration,
component/owned architecture, primitive and remaining-control contracts, existing
List/Button implementation/tests/stories, migration progress/master references
and previous batch reports. The List directory had only the original migration
commit and two behavior tests (selected Space activation/ref/decorative icon;
disabled action). The contract already separates native list structure from
nested actions and requires sibling actions outside the button. No additional
list selection model, collection engine or focus manager was needed.

One demonstrated defect: `ListItemButtonProps` inherits native `aria-pressed`, but
the implementation unconditionally replaced it with optional `selected`. A host
passing `aria-pressed="mixed"` without `selected` got no pressed attribute. The
baseline regression failed at that assertion (expected `mixed`, received `null`).

The implementation now uses native `aria-pressed` when `selected` is omitted.
Explicit `selected={false}` or `selected={true}` keeps precedence, so the owned
selection contract stays authoritative. Omission of both removes toggle state.
No API/type, timing, layout, focus or translation behavior changed.

The final composed regression additionally verifies native list/item/button refs,
host list attributes and button description references, semantic list/item roles,
separate sibling actions, and unchanged keyed DOM nodes after host reordering.
The mixed-state story demonstrates a presentation item plus a host-owned mixed
action with a separate restore button. Existing disabled and keyboard checks were
reused; no new focus/timing/device claims are made.

## Local validation and resource limits

Runtime: bundled Node **24.19.0**, pnpm **10.29.3**, React **19.2.3**,
Vitest **4.1.11**. Commands prefixed the bundled Node directory:
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.

- `pnpm install --frozen-lockfile`: passed, no tracked dependency changes.
- Baseline `pnpm exec vitest run src/experimental/List/List.test.tsx --maxWorkers=1`:
  **1 file, 1 failed / 2 passed**; expected failure reproduced missing mixed state.
- Initial and final `pnpm exec vitest related --run src/experimental/List/List.tsx --maxWorkers=1`:
  **7 files / 17 tests passed** on each run. The final run includes keyed/sibling/ref
  assertions committed in the implementation head above.
- `pnpm typecheck`: passed, covering production source and updated story.
- `pnpm foundations:check`: passed.
- `pnpm tokens:check`: passed.
- `git diff --check`: passed; final baseline diff/file allowlist verified before handoff.

Logs: `/tmp/sgui-batch13-control-list-{baseline,related,final,typecheck}.log`.
Install output and foundation/token guard results are preserved in this chat.

Install acquisition used atomic `mkdir` on an available slot in
`/tmp/sgui-install-slots/slot0..slot1` (limit 2), owner token
`batch13-control-list-01a116b1-install`. Vitest acquisition used atomic `mkdir`
on an available slot in `/tmp/sgui-light-validation-slots/slot0..slot3` (limit 4),
owner token `batch13-control-list-01a116b1-vitest`, and `maxWorkers=1`. Occupied
slots were left untouched; queued attempts were not counted as passes. Waits
were bounded to 30 seconds or less. Cleanup released only matching owned slots.

No heavy build/browser lock was acquired and no browser pool was bypassed. The
existing `/tmp/sgui-parallel-batch-01-validation.lock` and priority file remained
untouched. No Firefox retry or worker/process interruption occurred.

Per the authorized targeted-local validation policy, no full `pnpm check`,
Storybook build, full suites, packed consumers or React 18 run was performed.
The change only forwards a declared DOM state attribute; it changes no native
event timing, focus, scrolling, positioning or layout. Browser and spoken AT
verification are unclaimed. Paused dev CI/title checks were not waited on,
dispatched, rerun or re-enabled.

## Follow-ups reserved outside this slice

- If central documentation is updated, reserve exactly the list subsection in
  `docs/developer/react-aria-remaining-controls.md` and ListItemButton row in
  `docs/developer/react-aria-primitives.md` to mention native pressed-state
  fallback and explicit-selected precedence. Existing text remains accurate;
  these shared files were read-only here.
- Reserve native keyboard/dynamic-removal focus and spoken mixed-state AT
  acceptance as a separate task with its own browser/device scope. This report
  establishes DOM attributes/identity only and closes no broad U-02/X-03 IDs.
