# Batch 69 focused range-preview contract — K-17 partial

Base: `2d6f357d10b2a65bc988aba6280e69f92f3b1147` (verified reviewed ref).
Worktree: `/Users/thomashall/.codex/worktrees/batch69-range-preview-contract/sg-ui`.

## Documentation change

Updated the [calendar contract](../react-aria-calendar-contracts.md) to match the integrated batch61 focused range preview. The visible translated preview and context describe the anchor, actual focused endpoint and unchanged draft. Only the currently focused calendar cell receives the preview/context associations; moving focus transfers them, and completion/existing anchor invalidation clears them. The preview adds no extra per-arrow live status; existing interaction-engine announcements and draft/availability statuses remain. Complete localized date names remain intact.

The private native-ref bridge merges owned description IDs and removes only its own IDs, preserving unrelated references at attachment/cleanup. This is not a guarantee that arbitrary post-mount attribute mutations survive upstream rerenders. The context follows the engine's constrained endpoint at unavailable boundaries. Same serialized controlled host endpoints preserve pending selection.

Existing reset/prevented-reset, DatePicker, DateRangePicker, DateField, validation, draft and Apply/Cancel policies were preserved. No source, AGENTS or master task-list changes; no checkbox closure.

Exclusive changed files:

- `docs/developer/react-aria-calendar-contracts.md`
- `docs/developer/parallel-batch-69/range-preview-contract.md`

## Evidence and consistency review

Read the [batch61 report and proposed contract wording](../parallel-batch-61/keyboard-range-preview.md), the integrated [selector source](../../../src/experimental/DateRangeSelector/DateRangeSelector.tsx), [unit tests](../../../src/experimental/DateRangeSelector/DateRangeSelector.test.tsx), [focused-endpoint story](../../../src/experimental/DateRangeSelector/DateRangeSelector.stories.tsx) and [native spec](../../../tests/browser/batch61-keyboard-range-preview.spec.ts).

The batch61 report records 16/16 selector and 20/20 related unit tests, plus a fresh Chromium light/dark shard passing 2/2 on attributed worker source `913b79d753d5f5b0495e144da95d9c1c918dd97b` in candidate `5cc976dc1b9af6ced3980ec0e93fe930a9a8237b`. That evidence belongs to batch61; this docs-only batch did not rerun it or inspect other worktrees. The shared candidate was not a whole-candidate pass, as detailed in the linked report.

Targeted validation: local relative Markdown links and referenced source paths resolve; contract wording was compared with the source, unit/native assertions and batch61 evidence; `git diff --check` passes; the diff contains only the two allowed documentation files. Existing Picker/DateField/reset text is unchanged. No install, full check, Storybook build, native run or GitHub operation was performed.

## Remaining gates

K-17 stays open. Actual assistive-technology spoken output and announcement timing, manual acceptance, Firefox/WebKit for this focused slice and the broader locale/calendar/device/touch matrix remain pending. DOM association and the recorded Chromium shard do not establish screen-reader conformance or completion of broader calendar gates. No main integration, publication, CI, workflow permission or secret changes.
