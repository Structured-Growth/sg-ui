# Batch 13 control-chip inspection

Assignment: U-06 / X-04 disabled/action/remove interactions and callback
replacement without adding TagGroup behavior. Inspection date: 2026-10-07.

## Isolation and result

Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
One managed isolated worktree was created and attached before any edits:
`/Users/thomashall/.codex/worktrees/batch13-control-chip/sg-ui`.
Branch: `codex/batch13-control-chip`; draft PR base: `codex/dev`.
Primary and other worktrees were preserved.

Exclusive write allowlist:

- `src/experimental/Chip/`
- `tests/browser/batch13-control-chip.spec.ts`
- This report, `docs/developer/parallel-batch-13/control-chip.md`

Only this report changed. No demonstrated defect in the existing Chip contract
was identified. The requested combination cannot be exercised through its current
owned API: Chip is a passive native span, with children, tone, variant, density,
ARIA attributes, id/title and native class/style/ref. It has no disabled,
onPress or onRemove props. Adding those would introduce a new interaction
contract rather than fix callback replacement in an existing control. No tests,
stories or browser spec were manufactured for unsupported behavior.

## Exact evidence and contract mismatch

- [Chip source](../../../src/experimental/Chip/Chip.tsx) explicitly documents a
  presentation label and directs keyboard-navigable/removable tokens to TagGroup.
  Read-only `git show 51734ed:src/experimental/Chip/Chip.tsx` confirms the same
  passive contract at the foundation implementation commit; it is not a recent
  callback regression.
- [Public primitive barrel](../../../src/components/primitives/index.ts) exports
  that exact implementation; [experimental barrel](../../../src/experimental/index.ts)
  exports it too. There is no alternate interactive Chip implementation.
- [Remaining-control contract](../react-aria-remaining-controls.md#chips-badges-and-removable-tags)
  explicitly specifies passive Chip and Badge, with removal assigned to TagGroup.
- [Primitive mapping](../react-aria-primitives.md) contradicts source and the
  remaining-control contract: its Chip row claims “optional named `onRemove`”.
  This guide is outside the exclusive write allowlist and was left unchanged.
- [Master task list](../react-aria-master-task-list.md) assigns U-06 to selectors
  and U-12 to Chip/Tag/Badge. X-04 remains open. No task checkbox was changed.
- [Existing Chip test](../../../src/experimental/Chip/Chip.test.tsx) has one case:
  passive label, native span ref, host title, tone and absence of a button.
  Existing stories show passive default/light/dark/tone/variant combinations.
- [TagGroup tests](../../../src/experimental/TagGroup/TagGroup.test.tsx) have six
  cases covering keyboard removal and adjacent/empty focus, host-authoritative
  removal requests/native ref, pointer focus, item/read-only/group disabling,
  and translated/host removal labels. They belong to a different control outside
  this assignment, and do not prove callback replacement or Chip actions.
- [Previous completion record](../react-aria-progress.md#owned-controls-and-first-catalog-migrations)
  records nine U-12 tests across Chip (one), Badge (two) and TagGroup (six), plus
  historical browser removal focus observations. Those observations remain
  historical evidence; they were not rerun or relabeled as fresh baseline passes.
- [Batch 01 selector report](../parallel-batch-01/selectors.md) confirms U-06
  selector/token boundaries and previous evidence without establishing an
  interactive Chip contract.

## Validation and delivery

Read root AGENTS.md (no nested AGENTS.md found),
[development validation policy](../react-aria-development-validation.md), owned
architecture/control/primitive contracts, existing source/tests/stories, master
IDs and previous completion reports. No architecture or product code changed.

Runtime observed: Node `v26.5.0`, pnpm `10.29.3`. Documentation-only inspection
requires no install or test suite. Fresh unit/browser/build/consumer runs: zero.
No install/light-validation slot or shared heavy/browser lock was claimed; no
other lock, pool, worker or priority reservation was touched. No Firefox retry.
GitHub CI/title runs remain paused; none were awaited, rerun or dispatched.

Commands included:

```sh
git rev-parse HEAD
git switch -c codex/batch13-control-chip
rg --files -g AGENTS.md
rg --files src/experimental/Chip
cat AGENTS.md docs/developer/react-aria-development-validation.md
cat src/experimental/Chip/*
rg -n 'Chip|U-06|X-04' docs/developer/parallel-batch-* docs/developer/react-aria-* tests/browser
rg -n 'Chip' src
git log -8 --oneline -- src/experimental/Chip
git show 51734ed:src/experimental/Chip/Chip.tsx
node --version
pnpm --version
git diff --check
```

Local report validation checks all relative links/anchors, exact baseline,
source/export assertions, test counts and the exclusive changed-file allowlist.
Delivery head and draft PR are reported to the coordinator after creation;
this avoids embedding a self-referential commit hash. No merge or publication.

## Exact follow-up scope

1. Documentation reconciliation task: exclusive
   `docs/developer/react-aria-primitives.md` Chip mapping row and its own completion
   report. Align the unsupported `onRemove` claim with the shipped passive contract,
   or record an explicit owner decision to extend it.
2. If an interactive Chip is intended, first approve exact owned action/removal,
   accessible naming, disabled and focus/ref contracts. Then assign
   `src/experimental/Chip/`, the relevant owned contract docs/interaction registry,
   and a focused browser spec with the approved browser validation reservation.
   Cover callback replacement only after those callbacks exist. Preserve
   TagGroup's separate collection focus behavior; do not copy it into Chip.

This inspection does not close U-06, X-04, manual/device/assistive-technology or
any broad acceptance gate. The requested interactive combination remains
unverified because it is absent from the current owned Chip API.

Delivery: evidence commit `0d3d0d412663da9aab1cd736fa548d09cef2288c`, draft PR [#56](https://github.com/Structured-Growth/sg-ui/pull/56),
base `codex/dev`, attached to this chat. Local validation passed 11 relative
links/anchors plus baseline/source/count and report-only allowlist assertions.
`git diff --check` passed. Final report-only delivery commit is reported separately.
