# Batch 13 review 3: bounded integration review

Task slices: X-01 / W-19 / Z-13. Reviewed on 2026-10-07.

Review baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`, verified clean
before edits. One managed attached worktree:
`/Users/thomashall/.codex/worktrees/batch13-review-3/sg-ui`.
Branch: `codex/batch13-review-3`; draft PR base: `codex/dev`.
Exclusive write allowlist: this report only. Worker code, shared guidance, exports,
checklists and workflows remained read-only. No merge or product changes.

All three workers share exact baseline
`d0fcc6298004ad23d1a75480b216b39142e6df96`. Decisions below concern those exact
heads and their bounded claims, not broad acceptance or a later integrated head.

## Decisions

| Worker and exact head | Decision | Changed files versus its baseline |
| --- | --- | --- |
| editor-serialization: `d0e1b49a2f61d4f6a290cd51391f9ee9aa45d8c5`, [PR #34](https://github.com/Structured-Growth/sg-ui/pull/34) | **accept** | Only `src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.test.ts` and `docs/developer/parallel-batch-11/editor-serialization.md`; exact allowlist subset. |
| editor-link-activation: `f982cebd4c4a1869232cefbe7c3b9e0c83777c2c`, [PR #39](https://github.com/Structured-Growth/sg-ui/pull/39) | **accept** | Only `src/components/PageRichTextEditorSection/lexical/OwnedLinkActivationPlugin.test.ts`, `src/components/PageRichTextEditorSection/lexical/OwnedLinkNode.test.ts` and `docs/developer/parallel-batch-11/editor-link-activation.md`; exact allowlist subset. |
| public-api-reconciliation: `153b9817210b65e6fd13a5ae0b6fb08e258dc39d`, [PR #41](https://github.com/Structured-Growth/sg-ui/pull/41) | **accept** | Only `docs/developer/react-aria-public-api-reconciliation.md` and `docs/developer/parallel-batch-11/public-api-reconciliation.md`; exact allowlist. |

No blocking defect found in these diffs. The workers have disjoint changed files.
Accepting their tests/documents does not approve any pending ref or export change.

### Serialization regression quality and evidence

Five tests directly exercise pure structural traversal, unlike the existing live
OwnedLinkNode and registered-node editorConfig tests. They check nested list/table
links, rich fields, deeply frozen input and structural copies, opaque document-shaped
asset metadata, arrays/unknown nodes/non-array children and JSON idempotency.
Expected values are specified independently of calling the serializer again;
the idempotency assertion supplements explicit schema/metadata expectations.
The metadata guarantee is deliberately limited to fields outside traversed
root/children structure. It does not establish arbitrary Lexical node import/export
preservation, cyclic input handling or a deep clone.

Worker report plus authorized completion message identify final source/test content
at `d0e1b49a2f61d4f6a290cd51391f9ee9aa45d8c5`: Node `v24.21.0`, pnpm
`10.29.3`, Vitest `4.1.11`; explicit serializer/editorConfig/OwnedLinkNode run
passed 3 files / 19 tests, and related serializer consumers passed 8 files / 51 tests.
Reported commands use `node /tmp/sgui-run24.mjs exec vitest run` with those three
test paths, and `node /tmp/sgui-run24.mjs exec vitest related --run
src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.ts`.
Frozen install and whitespace checks were reported passed. These are attributed
worker passes; this reviewer did not rerun them. Runtime implementation is unchanged,
so no changed-state story or new native timing evidence is required for this diff.

### Link activation regression quality and evidence

The replaced cleanup test previously canceled events on the anchor, masking root
listener leaks. The replacement verifies both listener removals, activation on the
new root and uncanceled events after disposal. Actual React StrictMode effect replay
checks setup/cleanup counts and one open per event; null-root reattachment checks
duplicate activation. Other cases cover selected and rejected modified/middle
gestures, prior host cancellation, excluded mouse buttons, text-node targets and
live accepted/rejected/normalized URL updates while preserving anchor/children and
serialized host attributes. Nested independent-editor tests use opposite selection
states and expected inner URL/open counts, so outer participation would fail them.

Worker's tested test/evidence commit is
`9a27c56e213fb4686fde8f9a835b210c2f3396c2`; exact final head
`f982cebd4c4a1869232cefbe7c3b9e0c83777c2c` changes only the report thereafter.
Completion message confirms Node `v24.21.0`, pnpm `10.29.3`, Vitest `4.1.11`,
React `19.2.3`, Lexical `0.41.0`; `pnpm exec vitest run` on
OwnedLinkActivationPlugin.test.ts, OwnedLinkNode.test.ts and
`src/components/LinkUrlModal/linkUrlPolicy.test.ts` passed 3 files / 71 tests;
`pnpm typecheck` and whitespace checks passed. These are attributed worker results.
The implementation files are unchanged from baseline. Existing
`tests/browser/editor-links.spec.ts` covers ordinary/modified/middle popups,
null opener, rejected activation and paste/reload; source inspection is not a fresh
browser pass. New jsdom cases establish synchronous contracts, not native selection
timing or operating-system navigation. The report states that limit accurately.

### Public API audit quality and evidence

Source/barrel inspection confirms the three recorded discrepancies at the worker
baseline: Checkbox forwards HTMLLabelElement while the primitive guide promises
input ref; TextField permits label or aria-label while the guide says required label;
AppDataGridViewState is explicitly exported from the granular grid index and absent
from the root/component selection. The audit distinguishes intended package routes
from emitted declaration and packed-package evidence. Historical inventory is
provenance and remains immutable. Editor description/upload arguments and host
transport/asset ownership are described without inventing an API extension.

Worker completion message identifies final content
`153b9817210b65e6fd13a5ae0b6fb08e258dc39d`: explicit bundled Node `v24.19.0`
`--input-type=module` source-route/signature/provenance assertions passed, as did
55 local links, 2 inline paths, exact two-file ownership and whitespace checks.
No unit/build/declaration/packed-consumer pass is claimed or necessary for this
documentation-only contribution. Its inline scripts are described rather than
checked in; results are attributed evidence, not independently reproducible suites.

## Reviewer local validation

Read AGENTS.md, [development validation](../react-aria-development-validation.md),
[editor contracts](../react-aria-editor-section.md), primitive guidance, baseline
tests and worker reports. Inspected complete `git diff <worker-baseline> <exact-head>`,
`git diff --name-status`, `git log` and relevant source/barrels. Read each worker's
final chat and its authorized coordinator completion payload to reconcile tested
content with final heads. Existing reports/tests are not claimed as fresh passes.

Reviewer runtime: Python `3.9.6`; shell Node `v26.5.0` was identified but used for
no package validation. No install or UI suite was needed for this read-only review.
Local `python3` assertions invoking Git passed all three exact changed-file sets,
`git diff --check <worker-baseline> <exact-head>` for each, and 59 relative worker
document link targets via `git cat-file -e <exact-head>:<resolved-path>`.
`git diff --exit-code` confirmed serializer/link runtime files unchanged at both
editor worker heads. Link-target checks establish paths, not every Markdown anchor.
This report's local relative links and sole changed-file allowlist are checked
before commit; final report commit/PR are recorded in delivery, avoiding a self hash.

No validation slots, browser/build lock or priority queue were acquired or changed.
No full check, Storybook build, browser matrix or packed-consumer run; no paused
dev GitHub CI/title wait, rerun, dispatch or re-enable. Licensing, workflow
permissions/secrets, main and publication remain untouched.

## Bounded prerequisites and follow-ups

1. Coordinator may integrate the three accepted exact heads after its usual
   conflict/ownership check. Conflict resolutions or concrete interactions require
   affected validation at the resulting head; this report is not integrated-head
   validation. No worker revision is required for the bounded contributions.
2. Reserve native link selection/nested-editor lifetime work to an exclusive
   story/browser task: PageRichTextEditorSection story fixture plus a new focused
   browser spec and evidence report. Exercise selected-text click/middle suppression
   and independent editors through document replacement, Chromium/WebKit first;
   Firefox requires a changed profile-launch prerequisite. Use the current shared
   queue/pool policy; do not repeat unchanged Firefox launch failures.
3. Reserve API-guide corrections to react-aria-primitives.md (Checkbox label ref,
   exact TextField naming union) and approved reset-type route wording in
   react-aria-catalog-grid.md, with a unique evidence report. Keep implementation
   read-only unless the API owner explicitly chooses a ref/export change. A reset
   type reexport needs a separate src/components/index.ts/export-consumer scope and
   fresh declaration/packed-import checks; input-ref change needs breaking mapping
   and composed/native evidence.
4. Pure serialization coverage does not close registered-node metadata import/export.
   A separate editorConfig/ImageNode test scope may assess that boundary after
   checking existing rich-document fixtures; no demonstrated defect is asserted here.

Broad E/G/U/X/R/Z, Z-13/W-19 and production acceptance remain open, including
manual/device/spoken assistive-technology evidence. No new product behavior or
acceptance checkbox change follows from this review.
