# Batch 09 inventory contract wording report

Assignment: bounded W-19 / M-10 / M-14 / M-30 reconciliation, 2026-10-07.
Baseline verified clean at `e372781c2b1ceca630cda6fc7a989af2d6c05c33` before edits.
Managed attached isolated worktree:
`/Users/thomashall/.codex/worktrees/batch09-inventory-contract-wording/sg-ui`.
Branch: `codex/batch09-inventory-contract-wording`; draft PR base: `codex/dev`.
Primary and all other worktrees were preserved. Root AGENTS.md and
[development validation policy](../react-aria-development-validation.md) were
read; `rg --files -g AGENTS.md` found no nested instructions.

## Result

Exclusive changed files:

- [Reconciliation record](../react-aria-inventory-contract-reconciliation.md):
  exact current public APIs, preserved baseline/extraction provenance, original
  criterion mapping, existing tests and historical native evidence, missing
  acceptance, concrete owner decisions, bounded alternatives and exact proposed
  master wording for the three held rows.
- This report.

No source, master checklist, AGENTS, progress or other guidance was changed.
No 37-row re-audit or rescore of the six prior recommendations. A mismatch with
the current/preserved contract is proven; approval to discard additional target
behavior is not. Original previous/next/link, card menu/callback/date/icon and
M-30 typeface clauses remain explicit decisions. Broad native/manual/device/AT
and G/K/E/U/X/R/Z acceptance remains open.

## Validation and delivery

Documentation-only checks: relative local links and heading anchors in both new
documents; exact type/prop/callback/choice names against source and indexes;
baseline public contracts through read-only `git show`; referenced command and
file paths; whitespace and final exclusive-allowlist audit. No dependencies,
install, unit/UI/full/build/Storybook/browser/consumer checks or shared browser
lock were needed. Historical passes retain their source reports' runtime/head
limitations and are not relabeled as fresh acceptance of this baseline.

Commands used include:

```sh
git rev-parse HEAD
git status --short
git switch -c codex/batch09-inventory-contract-wording
rg --files -g AGENTS.md
cat AGENTS.md docs/developer/react-aria-development-validation.md
git show 21adebd61bedfc6a1ed395fe664ff4be83896821:src/components/ExperiencePageNavigator/ExperiencePageNavigator.tsx
git show 21adebd61bedfc6a1ed395fe664ff4be83896821:src/components/InstructorClassCard/InstructorClassCard.tsx
git show 21adebd61bedfc6a1ed395fe664ff4be83896821:src/components/TextStyleMenuControl/TextStyleMenuControl.tsx
git diff --check
git diff --name-only e372781c2b1ceca630cda6fc7a989af2d6c05c33 HEAD
```

Additional read-only `rg`, `cat`, `sed` and Python checks inspect source,
exports, guides, inventory and execution records. Delivery commit/PR identifiers
are recorded below after creation; final report commit SHA is sent to the
coordinator to avoid a self-referential hash. Draft PR is attached to this chat;
no merge or publication is authorized.

Coordinator's human-authorized policy update pauses automatic GitHub CI and
PR-title runs for dev PRs (`4758ca8` on dev). Local documentation validation
remains required; no checks are dispatched/rerun/waited on and no workflow file
is touched. Production/main validation remains unchanged.

## Unresolved decisions and next bounded task

Coordinator/product/API owner must record whether M-10 needs adjacent/route
navigation beyond the authoring list, whether M-14 needs new menu/actions or
date/icon inputs versus host presentation, and whether M-30's typeface clause
is attributed to M-26 or requires a new menu contract. The reconciliation gives
specific bounded alternatives without inventing public APIs.

Next task: record those three dispositions and assign one bounded evidence or
implementation slice for the confirmed requirement. All three rows remain held;
wording reconciliation alone is not acceptance. One completion report to the
coordinator is authorized; no ongoing messages/automation are created.
