# Batch 13 control-collapse evidence report

Assignment: U-02/X-06 mounted/hidden content focus, reduced motion and
interrupted controlled transitions. Inspected 2026-10-07.

Verified clean baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
One managed, attached isolated worktree:
`/Users/thomashall/.codex/worktrees/batch13-control-collapse/sg-ui`.
Branch: `codex/batch13-control-collapse`; draft PR base: `codex/dev`.
Exclusive write allowlist: `src/experimental/Collapse/`,
`tests/browser/batch13-control-collapse.spec.ts`, and this report.
Only this report changes. Primary and all other worktrees were preserved.

## Result

No demonstrated in-scope product defect was found. No source, API, story or test
was changed. The existing contract already implements immediate controlled
visibility and preserves mounted child state by default. Adding an animated
transition or automatic standalone focus destination would introduce behavior
outside that contract. No acceptance checkbox is closed.

The [owned contract](../react-aria-remaining-controls.md) explicitly specifies
native hidden/unmount behavior, no animated height transition and no render-time
layout measurement. [Primitive mappings](../react-aria-primitives.md) remove
transition-engine props. The [implementation](../../../src/experimental/Collapse/Collapse.tsx)
derives `hidden` directly from `expanded` and derives children directly from
`expanded || !unmountOnCollapse`. It contains no timer, effect, animation,
measurement, cached expansion state or deferred completion to survive a later
host update. Reduced motion therefore has no Collapse-owned motion to suppress;
an interrupted animation is not an unfinished combination in this implementation.
This source conclusion does not certify host CSS animations.

Standalone Collapse supplies no trigger or focus destination. Compositions own
their trigger; [Disclosure](../../../src/experimental/Disclosure/Disclosure.tsx)
owns restoration when its focused panel collapses. Inventing focus restoration
inside Collapse would compete with that existing owner.

## Existing evidence, with limits

- [Collapse tests](../../../src/experimental/Collapse/Collapse.test.tsx): two
  existing cases cover native ref, retained hidden children, re-expansion and
  optional unmounting.
- [Public primitive composed tests](../../../src/components/primitives/primitives.test.tsx):
  the retained-state case edits a real TextField, collapses it, and reopens with
  the edited value. This is stronger than checking initial markup alone.
- [Disclosure behavior tests](../../../src/experimental/Disclosure/Disclosure.test.tsx):
  three existing cases cover keyboard panel access, controlled host authority,
  focus restoration with unmounting, independent retained state and disabling.
- [Disclosure SSR tests](../../../src/experimental/Disclosure/Disclosure.ssr.test.tsx):
  two existing cases cover stable linked semantics without browser globals and
  deterministic retained/unmounted collapsed markup.
- [Previous execution record](../react-aria-progress.md) reports native focused
  panel removal with trigger focus retained, and packed React 18/19 Disclosure
  hydration. These are historical representative checks with the original
  record's runtime/head limits, not fresh browser evidence for this baseline.

Existing DOM tests are not native focus or assistive-technology evidence. There
is no focused committed standalone Collapse browser spec in this baseline.
That evidence gap does not establish a runtime defect. No regression was
manufactured merely to exercise the implementation.

## Validation and delivery

Read root AGENTS.md (no nested AGENTS found), README, migration/architecture
guides, [development validation policy](../react-aria-development-validation.md),
contracts, source, existing tests/stories, public exports and previous reports.
Read-only commands included `git rev-parse HEAD`, `git status --short`,
`rg --files -g AGENTS.md`, `rg -n`, `cat`, and `sed`; created the branch only
after managed isolation and exact baseline verification.

Report validation: Python checked relative link targets, existing test counts,
the source facts described above and the exclusive changed-file list;
`git diff --check` checked whitespace. Exact delivery head and draft PR are
reported to the coordinator after commit to avoid a self-referential commit SHA.

Runtime queried: Node `v26.5.0`, pnpm `10.29.3`, Python version recorded in the
validation output. Zero installs, test suites, builds, Storybook builds or fresh
browser cases were executed for this documentation-only result. No Node 24 or
current-head full-suite pass is claimed. No install/light-validation slot or
heavy/browser lock was claimed. The existing heavy lock owner and browser
priority queue were read and left untouched; the browser pool was not bypassed.
GitHub dev CI/title runs were not dispatched, rerun, enabled or waited on.
No merge, main update, publication, workflow/permission/secret or license change.

## Exact next scope

If fresh native acceptance is desired, assign an evidence-only task after the
browser pool policy is approved: `src/experimental/Collapse/Collapse.stories.tsx`
and `tests/browser/batch13-control-collapse.spec.ts`, plus a unique report.
Exercise a host-controlled open/closed/open sequence, retained edited input,
optional unmount/remount, hidden keyboard/programmatic focus exclusion and
host-owned return focus under normal/reduced motion. Use freshly built static
Storybook under the shared lock; preserve manual/device/AT limits. A separately
demonstrated Disclosure focus defect would require explicit scope for
`src/experimental/Disclosure/`; that directory is read-only in this task.
U-02/X-06 and broad G/U/X/R/Z acceptance remain open.
