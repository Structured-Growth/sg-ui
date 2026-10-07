# Batch 13: IconButton control evidence

## Decision and scope

Assignment: control-iconbutton, dispatched as U-03/X-03. The baseline master list
uses U-01 for Button/IconButton; U-03 is Typography. This report preserves the
assignment identifier without changing shared tracking or closing either gate.

No product defect was demonstrated. IconButton already delegates to the owned
Button implementation, preserving the required host action label, decorative icon
boundary, native ref, accessible description attributes and explicit native form
attributes. No implementation, API, styling, translation or story change is needed.
The existing Default story remains accurate because behavior is unchanged.

Two new colocated tests cover previously unasserted wrapper combinations:

- Host description association survives a label change and pending transition,
  the host action name updates, and the icon stays decorative.
- Default button versus explicit submit/reset types retain externally associated
  form ownership, plus the submit button's host name/value attributes.

Both tests passed against the unchanged baseline implementation on their first
run. They are additional regression protection, not a claimed red/green fix.

## Existing evidence reviewed

- [IconButton tests](../../../src/experimental/IconButton/IconButton.test.tsx): the
  original two tests cover the action name rather than the icon label, native ref,
  pointer/Enter/Space activation and pending pointer suppression/progress.
- [Button tests](../../../src/experimental/Button/Button.test.tsx): three existing
  tests cover normalized pointer/keyboard activation, disabled/pending suppression,
  pending focusability, default button type and submit-only form participation.
- [Owned button contract](../react-aria-button.md) and
  [architecture](../react-aria-architecture.md): host naming, translated pending
  status, native form attributes and owned callback boundaries.
- Earlier batch reports/browser cases were searched; no dedicated IconButton
  native browser acceptance case was found. Existing Button jsdom evidence is
  not promoted to native browser or spoken assistive-technology evidence.

## Ownership and commits

- Exact verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed attached worktree:
  `/Users/thomashall/.codex/worktrees/batch13-control-iconbutton/sg-ui`.
- Branch: `codex/batch13-control-iconbutton`; draft PR base: `codex/dev`.
- Exclusive allowlist: `src/experimental/IconButton/`,
  `tests/browser/batch13-control-iconbutton.spec.ts`, and this report.
- Actual writes: `src/experimental/IconButton/IconButton.test.tsx` and this report.
- Test commit/tested code: `2c326a094fffa8177d98f31e1dc7e687358e2f9b`.
- The report-only commit is discoverable with
  `git log -1 --format=%H -- docs/developer/parallel-batch-13/control-iconbutton.md`.
- Draft PR: pending creation; the URL will be added in a report-only update.

## Local validation

Runtime: macOS, Node `v26.5.0`, pnpm `10.29.3`, locked React `19.2.3`,
React Aria Components `1.21.1`, Vitest `4.1.11`, jsdom `26.1.0`.
This is not Node 22/24 or React 18 consumer evidence.

- `pnpm install --frozen-lockfile`: passed, only after acquiring an atomic shared
  install slot under `/tmp/sgui-install-slots`. Owner token
  `batch13-control-iconbutton`; own slot released in finally. Other owners were
  left untouched. Initial occupied-slot attempts were queued, not passes.
- `pnpm exec vitest run src/experimental/IconButton/IconButton.test.tsx src/experimental/Button/Button.test.tsx --maxWorkers=1`:
  passed, **2 files / 7 tests** (IconButton 4, Button 3), in a shared lightweight
  slot under `/tmp/sgui-light-validation-slots`, same owner token and finally
  cleanup. Includes the original 5 tests and 2 new tests. Test run preceded the
  test commit; that commit contains exactly the tested changes.
- `pnpm exec tsc --noEmit`: passed at the test commit (repository TypeScript check).
- `git diff --check`: passed.

Full check/Storybook/browser/packed-consumer suites were not run. No native timing,
focus, layout or implementation behavior changed. No browser lock was acquired,
no Storybook was built, no browser pool was migrated, and no Firefox launch was
attempted. The priority queue was nonempty and the global browser lock belonged
to another chat when inspected. Unit assertions establish DOM contracts only.

## Review and reserved follow-up

Review decision: test-only evidence is suitable for coordinator review/integration;
there is no product fix to review. Preserve current owned API/ref/translation and
host authority. No merge, main/publish, licensing, workflow/permission/secret or
CI/title changes were made. No manual/device/AT acceptance was closed.

Reserved next-task scope: when the browser pool and priority queue permit, assign
an isolated IconButton native fixture and focused Chromium/Firefox/WebKit checks
for external submit/reset activation, disabled/pending pointer and Enter/Space
suppression, pending focus continuity, and host description/name updates.
A failure inside shared Button must reserve `src/experimental/Button/` explicitly;
it is outside this task's write allowlist. Spoken pending/name/description behavior
still requires manual assistive-technology acceptance. Broad U/X/R/Z remain open.
