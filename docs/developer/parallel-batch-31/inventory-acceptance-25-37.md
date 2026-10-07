# Batch 31: whole-row inventory acceptance, M-25–M-37

Read-only evidence reconciliation, 2026-10-07. Exact reviewed `codex/dev` baseline:
`3e910311acee5b5c83184eeb191441acb793147a` (commit subject: `docs: record four-session shared-build success`).
The supplied `codex/dev3e91031` identifies that branch/head pair; no literal ref
of that name exists. Verified full SHA before creating/attaching the isolated
managed worktree `/Users/thomashall/.codex/worktrees/batch31-inventory-25-37/sg-ui`.
Branch: `codex/batch31-inventory-25-37`. Sole write scope: this report.

Recommendations use the unchanged [master row criteria](../react-aria-master-task-list.md),
[inventory acceptance record](../react-aria-migration-inventory-acceptance.md),
[execution record](../react-aria-progress.md) and
[durable coordination ledger](../parallel-migration-batches.md).
All paths below were inspected at the exact baseline unless another evidence head
is stated. Source availability is not an execution result. The public component
[barrel](../../../src/components/index.ts), [root](../../../src/index.ts) and
[package routes](../../../package.json) expose the scoped runtime components;
Typefaces is deliberately story-only. Colocated stories/tests and registered
[source/transitive boundaries](../../../scripts/check-foundations.mjs) exist.
Historical passes retain their original head/runtime/engine limitations.

**Decision: retain three existing ACCEPT rows; HOLD ten; propose zero new whole-row acceptances.**
M-01/M-12/M-24 are outside scope and unchanged; the six previously accepted rows
are preserved. This report neither changes percentages nor assigns fractional
credit to implementation batches. Coordinator alone reconciles status after review.

| ID / complete row criterion | Exact reviewable evidence and limits | Whole-row recommendation / concrete remaining dependency |
| --- | --- | --- |
| M-25 — selection anchoring, focus preservation, cleanup, keyboard access | [Implementation](../../../src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx), [six real-Lexical tests](../../../src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx), [composed tests](../../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.floating.test.tsx), [position/focus contract](../react-aria-editor-layout.md). Last product commit `2eaacda3da6d5449933ee7f07c2b23d267db1909`. Execution record covers Alt+F10, offscreen focus return, 260px geometry and React 18/19 packed consumers; [native acceptance spec](../../../tests/browser/acceptance.spec.ts) covers selected-text Bold, not the complete anchoring matrix. | **HOLD — native evidence.** No complete supported-engine boundary/ancestor-scroll/resize collision and focus-preservation proof. Fixed-position host restriction is documented, not a defect to remove speculatively. Bounded follow-up A below; physical selection/device/AT review remains manual. |
| M-26 — all actions, mixed/active/disabled state, Lexical commands | [Toolbar implementation](../../../src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.impl.tsx), [tests](../../../src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.test.tsx), [real host formatting tests](../../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.formatting.test.tsx), [contract](../react-aria-formatting-toolbar.md). [Reviewed/integrated callback fix](../parallel-batch-13/formatting-toolbar.md): source `1226f53ebcc1aca9e8593dd13464dc80edecce09`, native spec `7967dfc9a885497807894efd74e419b5cd81305a`, 14 related units and 12 Chromium/WebKit cases; Node 26, no Firefox. | **HOLD — E-02/E-04 dependency.** Deferred callback ownership is complete for that slice; do not repeat it. Mixed multi-node selection, history and the complete supported command matrix remain unproved in the real editor; toolbar props alone cannot establish host Lexical command correctness. Assign with M-34 scope C, not a second toolbar state owner. |
| M-27 — insertion commands/focus, disabled actions, announcements | [Source](../../../src/components/InsertContentMenuControl/InsertContentMenuControl.tsx), [tests](../../../src/components/InsertContentMenuControl/InsertContentMenuControl.test.tsx), [contract](../react-aria-editor-menus.md). All three callbacks, unavailable commands, outer-form safety and actual ColumnsLayoutModal focus handoff are covered. Execution record has packed native insertion/focus. [Shared Menu correction](../parallel-batch-17/menu-autofocus.md) proves collection autofocus at `f567db7eaaaf3ec68b84b4f8b5377276aa25c3ab`, not every insertion handoff. | **HOLD — native/manual/host dependency.** Complete image/rule/columns insertion handoff and announcement acceptance is missing. Host owns document announcements and final selection; do not add an independent menu live region. Native host-dialog/editor-return evidence belongs in scope C; spoken announcement review requires host fixture plus platform/AT record. |
| M-28 — alignment/indent, active state, direction-aware presentation | [Source](../../../src/components/TextAlignMenuControl/TextAlignMenuControl.tsx), [six tests](../../../src/components/TextAlignMenuControl/TextAlignMenuControl.test.tsx), [logical icon/checked-state contract](../react-aria-editor-menus.md). Execution record covers physical Center, logical RTL icon rendering and narrow menu sizing; controlled value and restrictions remain host-owned. | **HOLD — native evidence.** Full LTR/RTL start/end versus physical left/right activation, checked host replacement and indent restrictions are not established across supported engines by the portal-attribute tests. Dependency-ready scope B; no new alignment API or duplicate state. |
| M-29 — foreground/background, clear/reset, swatches, accessible color control | [Source](../../../src/components/TextColorPickerControl/TextColorPickerControl.tsx), [tests](../../../src/components/TextColorPickerControl/TextColorPickerControl.test.tsx), [semantic color contract](../react-aria-editor-menus.md). Tests cover hex/error association, composing Enter, native input change, swatches, Clear/background Reset and reopen; real-host dialogs test covers semantic Clear. Recorded native evidence covers hex/preset foreground and focus, not OS chooser operation. | **HOLD — native/manual evidence.** Foreground/background chooser, Clear/Reset selection retention and accessible OS color chooser acceptance remain incomplete. Manual OS chooser/AT review cannot be replaced by dispatching input/change events. Exclusive prospective scope: this component's stories, unique color browser spec/report; editor command assertions require scope C owner. |
| M-30 — style/typeface, tokenized labels, selection/focus | [Source](../../../src/components/TextStyleMenuControl/TextStyleMenuControl.tsx), [five tests](../../../src/components/TextStyleMenuControl/TextStyleMenuControl.test.tsx), [preserved eight-command contract](../react-aria-editor-menus.md), [completed intent audit](../react-aria-inventory-contract-reconciliation.md) at `e372781c2b1ceca630cda6fc7a989af2d6c05c33`, [report PR #29](../parallel-batch-09/inventory-contract-wording.md). Typeface chooser actually belongs to M-26; M-35 is no chooser. | **HOLD — owner decision, then native dependency.** Owner must dispose of the original typeface clause or approve additional behavior. Do not repeat the completed wording audit or silently drop the clause. Existing style callbacks/checked semantics do not prove the complete native editor-selection/focus matrix. Only coordinator records attribution; any confirmed evidence slice then uses M-30 stories/unique spec, sharing editor ownership with C. |
| M-31 — presets, selected state, validation, Apply/Cancel | [Source](../../../src/components/ColumnsLayoutModal/ColumnsLayoutModal.tsx), [five tests](../../../src/components/ColumnsLayoutModal/ColumnsLayoutModal.test.tsx), [dialog contract](../react-aria-editor-dialogs.md), existing packed native execution. [Inspection-only PR #60](../parallel-batch-13/columns-dialog.md), product baseline `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`, found no defect and executed zero new tests. | **ACCEPT — preserve existing row acceptance.** No concrete regression found. Suggested live-host replacement/editor-interruption checks in the prior report concern broader compositions; they do not downgrade this already accepted preset/Apply/Cancel row. Do not reassign completed review. |
| M-32 — file selection/preview/errors, host callback, alt, cancellation | [Source](../../../src/components/ImageUploadModal/ImageUploadModal.tsx), [tests](../../../src/components/ImageUploadModal/ImageUploadModal.test.tsx), [file-only/optional-alt and lifetime contract](../react-aria-editor-dialogs.md), [picker/drop spec](../../../tests/browser/image-upload-validation.spec.ts), [integrated lifetime spec](../../../tests/browser/editor-upload-lifecycle.spec.ts). Latest metadata implementation is `1dbf1f69e98609924013e2dcbf3f3e7d4aab5978`. Selection rejects empty/invalid metadata; host promise/session guards preserve retry and invalidate stale completions. | **HOLD — evidence reconciliation/native dependency.** The guide asserts presentation-validation browser coverage, but an exact tested-head/engine execution record for this metadata change was not located in the inspected durable records; checked-in cases are not a pass. Broader upload/preview/error/cancel matrix remains partial E-06. First retrieve existing execution evidence, then assign only uncovered native cases. Byte decoding, size and asset authorization remain host policy, not new library features or a reason to invent sniffing. |
| M-33 — URL validation/protocol, edit/remove, focus restoration | [Source](../../../src/components/LinkUrlModal/LinkUrlModal.tsx), [dialog tests](../../../src/components/LinkUrlModal/LinkUrlModal.test.tsx), [policy tests](../../../src/components/LinkUrlModal/linkUrlPolicy.test.ts), [contract](../react-aria-editor-dialogs.md), [existing activation/paste spec](../../../tests/browser/editor-links.spec.ts). [Reviewed link activation evidence](../parallel-batch-13/review-3.md) at `f982cebd4c4a1869232cefbe7c3b9e0c83777c2c` adds 71 attributed unit tests, not a fresh browser pass. | **HOLD — native evidence.** Complete modal invalid-policy correction, edit/unlink selection and return-focus matrix remains unproved; saved-link activation/paste is a different slice. Exclusive prospective scope: LinkUrlModal stories/unique browser spec/report; real editor edit/unlink/reset selection uses C. Do not repeat 71 completed unit cases. |
| M-34 — composition, nodes/plugins, serialization, selection | [Implementation](../../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx), [contract](../react-aria-editor-section.md), [registered-node tests](../../../src/components/PageRichTextEditorSection/lexical/editorConfig.test.ts), [image metadata tests](../../../src/components/PageRichTextEditorSection/lexical/ImageNode.test.tsx), [native rich-document spec](../../../tests/browser/editor-rich-document.spec.ts). [Independent review](../parallel-batch-13/review-3.md) accepted serializer `d0e1b49a2f61d4f6a290cd51391f9ee9aa45d8c5` (19 explicit/51 related units) and link activation; runtime unchanged in those slices. Existing clipboard/link/image/upload suites are partial. | **HOLD — E-02/E-04/E-05/E-06/E-07 dependencies.** Pure traversal does not prove all registered node/plugin roundtrips; representative lists/rules do not prove table preset editing/history or mixed selection. Actual IME/device/AT and broader trust/upload evidence remain open. Scope C prioritizes the already-required table/history/selection combination; do not repeat frozen serializer or ordinary image metadata tests. |
| M-35 — foundation catalog, new theme/tokens, native typography | [Catalog](../../../src/components/Typefaces/Typefaces.stories.tsx), [Typography behavior](../../../src/experimental/Typography/Typography.test.tsx), [SSR](../../../src/experimental/Typography/Typography.ssr.test.tsx), [contract](../react-aria-remaining-controls.md). Production Provider/token source and all declared roles including bodyAlt2/code are present. | **ACCEPT — preserve existing row acceptance.** No runtime Typefaces export is required and no concrete regression found. Broader visual/AT gates do not turn the accepted story-only catalog into a new chooser task. |
| M-36 — complete direct/public icon mapping and activity behavior | [Barrel](../../../src/components/icons/index.ts), [public tests](../../../src/components/icons/icons.test.tsx), [activity helper](../../../src/components/icons/activityTypeIcon.tsx), [complete mapping](../react-aria-icons.md). Execution record covers 49 preserved barrel names, 95 direct mapped icons, all-vector/public tests, activity aliases/overrides/fallback and packed React 18/19. | **ACCEPT — preserve existing row acceptance.** No concrete regression found. No repeat icon audit; legal/final-artifact and display/AT gates remain separately owned. |
| M-37 — every reexport replaced by owned implementation/type or documented removal | Compared [extracted barrel](../migration-baseline/inventory.json) provenance (`21adebd61bedfc6a1ed395fe664ff4be83896821`, read with git show) with [current barrel](../../../src/components/primitives/index.ts), [Progress wrappers](../../../src/components/primitives/Progress.tsx), [composed tests](../../../src/components/primitives/primitives.test.tsx) and [mapping guide](../react-aria-primitives.md). Implementations/removals are present; aliasing shares state ownership. [Completed corrections](../parallel-batch-14/api-guide-corrections.md) at `7f947a262f2d5edff67d11dab65fb05a8dc2d115` repaired Checkbox/TextField/Chip only. | **HOLD — concrete docs gap plus acceptance dependency.** Guide still says Switch has a native input ref; [exported source](../../../src/experimental/Switch/Switch.tsx) forwards `HTMLLabelElement`. That reserved correction is unfinished, not a request to change refs. Scope D is ready. Original inventory hold also retains all-control native/state acceptance under U/X; shared Menu's six-engine-case result is not that matrix. Evidence owner must reconcile remaining control/engine coverage after D without duplicating completed control reviews. |

## Dependency-ready prospective scopes

These are proposed NEW assignments, not claimed reservations or executed work.
Check the current coordinator ownership record again before dispatch. At this
frozen baseline TimeField reset, logout lifetime, client shrink and AsyncSelect
busy/native diagnosis remain assigned; none is reused here. Completed columns,
editor-layout, serialization, activation and primitive inspection reviews are not
new work. Firefox checkpoint ownership remains with the coordinator; retrieve
existing runs before scheduling only genuinely uncovered cases.

- **D — first, bounded docs correction:** `docs/developer/react-aria-primitives.md`
  Switch row and a unique successor report only. Compare exported label-ref type
  with source, correct wording, check links/signature; no runtime/ref changes,
  build or new tests. The earlier API guide report explicitly reserved this gap.
- **A — M-25 native anchoring:** FloatingTextSelectionToolbar story fixture,
  unique `tests/browser/batch32-selection-boundary.spec.ts` and unique report.
  Exercise nested host scrolling/boundary clipping, resize while a toolbar action
  has focus, offscreen hide/editor return and replaced document selection cleanup;
  retain fixed-position host contract. Product edits only after demonstrated
  failure and explicit expanded ownership. Supported-engine proof and manual
  physical selection/AT remain distinct.
- **B — M-28 native direction commands:** TextAlignMenuControl stories,
  unique `tests/browser/batch32-align-direction.spec.ts` and unique report.
  Prove LTR/RTL start/end and fixed left/right labels/icons/actions, controlled
  active replacement, unavailable indent navigation and Escape return. Existing
  Center and portal-attribute tests are prerequisites, not tasks to repeat.
- **C — one editor owner for M-26/M-27/M-33/M-34:** PageRichTextEditorSection
  stories, a unique table/history/selection composed test and browser spec/report.
  Start with twoEqual table insertion, selection editing, Undo/Redo and editorKey
  reload preserving declared layout and document content; inspect existing dialogs,
  editorConfig and rich-document tests first. Add only missing assertions. Keep
  toolbar/menu state controlled by the editor, not a second owner. Dialog-interrupt
  and link-edit matrix are follow-on slices with disjoint specs, not simultaneous
  source assignments. Manual IME/AT cannot be certified by this native suite.

M-30's owner decision and M-32's existing-execution lookup precede new code/native
tasks. No future feature, host upload service or broad U/X matrix is assigned as
busywork. Completing D/A/B/C would add bounded evidence, not automatically accept
their dependent whole rows.

## Validation and delivery boundary

Inspected exact source/public indices, types, colocated tests/stories, master
criteria, contracts, integration ledger and cited independent reviews. Checked
local report links/anchors, all thirteen IDs exactly once in the decision table,
sole changed-file ownership and `git diff --check`. No installs, tests, builds,
browser runs, servers, heavy locks, GitHub CI, main/publish, credentials or workflow
changes. New execution evidence: zero. Report-only Conventional Commit SHA is
supplied in delivery; no self-referential hash is embedded here. Human-authorized
single completion handoff goes to chat `01a1164f-41db-7f30-aaf9-f20133b6566f`.
