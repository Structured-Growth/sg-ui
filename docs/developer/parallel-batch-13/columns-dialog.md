# Batch 13 columns-dialog inspection

Assignment: E-03/U-08, preset draft reset under host changes, cancellation,
dismissal and commit availability. Inspection-only result: no demonstrated
in-scope defect and no product, story or test changes. Existing evidence is
sufficient to avoid repeating the already exercised slice; it does not establish
full columns/editor acceptance.

## Isolation and ownership

- Verified baseline and inspected source head: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed worktree: `/Users/thomashall/.codex/worktrees/batch13-columns-dialog/sg-ui`.
- Branch: `codex/batch13-columns-dialog`; draft PR base: `codex/dev`.
- Draft PR: [#60](https://github.com/Structured-Growth/sg-ui/pull/60).
- Initial report head: `102398186131daccd8b9424992089aa0b94819df`; final evidence-link commit is reported to the coordinator.
- Exclusive write allowlist: `src/components/ColumnsLayoutModal/`,
  `tests/browser/batch13-columns-dialog.spec.ts`, and this report.
- Actual tracked change: this report only. Other source, shared contracts,
  configuration and worktrees remained read-only. The browser file was not created.

## Existing evidence and inspection

The [owned dialog contract](../react-aria-editor-dialogs.md) already specifies
five unchanged preset IDs, invalid-runtime fallback, draft reset on opening or
`defaultPreset` change, and cancellation without commit.

[ColumnsLayoutModal](../../../src/components/ColumnsLayoutModal/ColumnsLayoutModal.tsx)
normalizes the initial draft and reloads it in an effect depending on both `open`
and `defaultPreset`. Radio changes accept only declared preset IDs. Insert uses
the current render's selected ID and current host callback; Cancel uses `onClose`.
Dismissal delegates to AppModal. The callback is required by the public type:
absence is not a supported standalone commit-availability state. The contract
permits one commit per press, rather than disabling subsequent independent presses
when the host deliberately keeps the dialog open.

The [five colocated tests](../../../src/components/ColumnsLayoutModal/ColumnsLayoutModal.test.tsx)
already exercise one selected radio with arrow navigation; Space commit once
without outer-form submission; trigger focus restoration; Cancel without submit;
reopening with a changed host default; invalid runtime fallback; Escape without
submit; closed SSR; and translation defaults. Default/Dark stories already display
the committed host layout and reopen from it.

The [insert-menu tests](../../../src/components/InsertContentMenuControl/InsertContentMenuControl.test.tsx)
cover disabled insertion and missing callback availability, plus keyboard handoff
to the real ColumnsLayoutModal, commit delivery and return to the Insert trigger.
These are composed DOM checks, not native focus acceptance.

The [M-31 execution record](../react-aria-progress.md) reports prior packed React
18.3.1/19.2.3 native keyboard selection, insertion and trigger focus restoration;
it also records the light columns story's selected radio, focus outline and host
status. This is historical evidence, not a rerun at this baseline.
The [batch 01 dialogs report](../parallel-batch-01/dialogs.md) records AppModal
nested Escape/outside dismissal and constrained focus in Chromium/WebKit, with
Firefox launch failures. Those checks concern the shared modal, not columns
insertion interrupted by host changes.

Read-only inspection of the
[editor implementation](../../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx)
found that `editorKey` or `readOnly` changes close the columns dialog and clear
saved selection; the opening callback checks `readOnly`, and editing controls are
hidden in read-only mode. The
[editor contract](../react-aria-editor-section.md) already documents this boundary.
Existing upload interruption tests do not prove equivalent columns insertion
behavior. AppModal and the editor were outside this task's write ownership.

## Local verification and limits

Runtime inspected: Node `v26.5.0`, pnpm `10.29.3`. Dependency directory was absent;
no dependency installation was needed for this documentation-only result.

Executed inspection: `git rev-parse HEAD`, `git switch -c codex/batch13-columns-dialog`,
source/contract/report reads using `cat`, `sed` and `rg`, `git status --short`,
`node --version`, `pnpm --version`. Relevant local report links and `git diff --check`
were checked before commit. Two initial read commands encountered unmatched/missing
report paths; subsequent searches located the actual records. These were inspection
path errors, not product or test failures.

New tests executed: **0**; installations: **0**; Storybook builds: **0**;
browser runs: **0**; full checks: **0**. Historical counts above are not fresh results.
No light/install slot or heavy-validation lock was acquired. No browser pool,
priority file or another worker's lock was modified. No paused GitHub validation
was dispatched, retried or awaited. Manual/device/assistive-technology and broad
E/U/X/R/Z gates remain open.

## Reserved follow-up scope

A future bounded acceptance task may own this ColumnsLayoutModal directory and
its exclusive browser test to exercise live `defaultPreset` replacement while a
user has an uncommitted choice, subsequent commit through a replaced host callback,
and cancellation/reopening after that replacement. No current failure is asserted.

For native editor interruption, explicitly allocate
`src/components/PageRichTextEditorSection/PageRichTextEditorSection.stories.tsx`,
a colocated columns integration test and an exclusive browser suite. Exercise
columns draft interruption by `editorKey`/read-only changes, assert no table enters
the replacement/read-only document, then reopen and insert the selected width/count
into the current document. Any repair requires demonstrated failure and ownership
of the affected editor implementation. Use the reviewed browser pool and shared
lock/priority protocol. Do not broaden or close acceptance IDs based on this report.
