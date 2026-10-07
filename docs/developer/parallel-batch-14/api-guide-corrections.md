# Batch 14 API guide corrections

Bounded W-13/W-19/Z-13 documentation correction, 2026-10-07.

## Isolation and result

Exact verified baseline: `f1e5e457ce6240022ca07d6336ea06c5b67c917c`.
One managed worktree was created and attached before edits:
`/Users/thomashall/.codex/worktrees/batch14-api-guide-corrections/sg-ui`.
Branch: `codex/batch14-api-guide-corrections`; draft PR base: `codex/dev`.
Final head and PR are supplied in delivery; a commit cannot embed its own hash.

Exclusive write allowlist and actual changed files (three):

- `docs/developer/react-aria-primitives.md`
- `docs/developer/react-aria-layout-actions.md`
- `docs/developer/parallel-batch-14/api-guide-corrections.md`

The [primitive guide](../react-aria-primitives.md) now matches the current
[Checkbox](../../../src/experimental/Checkbox/Checkbox.tsx) HTMLLabelElement ref,
[TextField](../../../src/experimental/TextField/TextField.tsx) naming union
(label or aria-label), and passive
[Chip](../../../src/experimental/Chip/Chip.tsx) HTMLSpanElement presentation with
no onRemove. Removable tokens belong to TagGroup through `/experimental`, as
specified by the [remaining control contract](../react-aria-remaining-controls.md#chips-badges-and-removable-tags).
The [layout guide](../react-aria-layout-actions.md) opening paragraph now describes
owned implementations and catalog migration, distinguishing availability from
broad acceptance. Four claims corrected; no runtime, ref or export changes.

## Exact prior evidence and bounded review decisions

| Evidence | Exact inspected head | Decision and limits |
| --- | --- | --- |
| [PR #41](https://github.com/Structured-Growth/sg-ui/pull/41) | `153b9817210b65e6fd13a5ae0b6fb08e258dc39d` | Existing [review 3](../parallel-batch-13/review-3.md) accepts this exact audit head. PR is merged into dev; merge commit `32d014058b704bb90d34be9780c87dfb826fc555`. Source confirms F-01/F-02 still apply at this task baseline. Accept those findings for wording correction only. |
| [PR #56](https://github.com/Structured-Growth/sg-ui/pull/56) | `fc1fd53e763aac6d1d5f60adb3f37e8bed782fc0` | Inspected exact control-chip report and sole changed-file set; accept the passive Chip/no-onRemove finding for this guide correction. PR open, GitHub reviews empty, coordinator evidence review pending when checked; no claim of whole-PR integration approval. |
| [PR #51](https://github.com/Structured-Growth/sg-ui/pull/51) | `8b40247f17559eb8cbc29235cc7d4282d30b35fc` | Inspected exact control-box report and sole changed-file set; accept its stale opening-status finding, independently confirmed by baseline public primitive exports and AGENTS migration record. PR open, GitHub reviews empty, coordinator evidence review pending when checked. No Box runtime acceptance upgrade. |

PR #41 changes two audit documents; #56 and #51 each change one report and no
runtime. Their findings are attributed evidence, not fresh unit/browser passes.
Source and [public primitive barrel](../../../src/components/primitives/index.ts)
confirm the current mappings; [experimental barrel](../../../src/experimental/index.ts)
confirms the TagGroup route. No historical snapshot, previous report or required
breaking mapping was rewritten. Current owned contracts remain breaking mappings
from extracted upstream APIs; this documentation correction introduces no new
runtime breaking change and uses a `docs:` title without a breaking marker.

Read AGENTS.md, [development validation](../react-aria-development-validation.md),
[canonical task IDs](../react-aria-master-task-list.md), existing batch-11 audit,
batch-13 review and exact worker reports before edits. W-13 integrated guide,
W-19 repository-wide links/examples and Z-13 final declaration/release-marker
reconciliation remain open. U-06 is selectors; U-12 is Chip/Tag/Badge. No checkbox
or inventory score changed.

## Validation commands and limits

Runtime queried: Node `v26.5.0`, Python `3.9.6`. Only Python/Git executed local
document assertions; no package validation used Node. No dependencies needed.

Commands from this worktree:

```sh
git rev-parse --verify f1e5e457ce6240022ca07d6336ea06c5b67c917c^{commit}
git switch -c codex/batch14-api-guide-corrections
git rev-parse HEAD
cat AGENTS.md docs/developer/react-aria-development-validation.md
rg -n 'W-13|W-19|Z-13' docs/developer/react-aria-master-task-list.md
rg --files src
cat src/experimental/Checkbox/Checkbox.tsx src/experimental/TextField/TextField.tsx src/experimental/Chip/Chip.tsx
cat src/components/primitives/index.ts src/primitives/index.ts
node --version
python3 --version
git diff --check
```

Read-only GitHub queries: separate `gh pr view 41`, `56`, `51` with
`--json number,url,state,baseRefName,headRefName,headRefOid,mergeCommit,reviews,files`;
body/comments inspected for #56/#51. Exact reports read with
`git show <head>:docs/developer/parallel-batch-13/control-chip.md` and
`git show <head>:docs/developer/parallel-batch-13/control-box.md`.
Changed paths verified using `git diff --name-status <worker-baseline> <head>`:
#41 baseline `d0fcc6298004ad23d1a75480b216b39142e6df96`; #56/#51 baseline
`b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.

`python3 -` inline assertions validate all relative Markdown links/anchors in
these three documents, the corrected source signatures and explicit exports,
the unchanged CourseForm example's six imported public names and its supported
props, and the exact three-file allowlist. Result: passed 23 local links, including one heading anchor; six CourseForm
public imports and inspected props; three corrected primitive contracts and
TagGroup route; exact three-file ownership. `git diff --check` passed. These are source/text checks, not TypeScript, emitted declaration,
packed import, native focus or assistive-technology evidence.

Installs, unit/UI suites, typechecks, builds, Storybook, browser and packed-consumer
runs: zero. No install/light-validation slot, global heavy/browser lock, priority
queue or pool configuration was acquired or changed. No Firefox retries. No paused
dev CI/title wait, rerun, dispatch or re-enable. No main/merge/publish, credential,
permission, licensing, translation, host-authority or source change.

## Reserved follow-ups

- Switch row also claims an input ref while current source forwards
  HTMLLabelElement. This was discovered during scoped inspection and is reserved
  for an explicitly owned documentation task; it is outside these exact requested
  corrections. No Switch ref change is approved.
- F-03 reset named-type route, root export promotions and input-ref behavior changes
  remain API-owner decisions in the [existing audit](../react-aria-public-api-reconciliation.md).
  Any approved implementation needs a separate allowlist and fresh relevant
  declaration/consumer/native evidence; no decision was waived here.
- Final-head declaration/packed API and complete release-marker reconciliation,
  broad G/E/U/X/R/Z and manual/device/AT acceptance remain outstanding. Coordinator
  reviews this exact delivery head; conflict resolutions need affected validation.
