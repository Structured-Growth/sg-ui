# Wave 04 / 02 — Editor controls and content safety

**Review-ready: three complete recommendations, nine partial, zero blocked.** No central checklist, implementation, generated build or Git state was changed. All work is confined to this assignment directory.

The complete recommendations are A-M-26, A-M-28 and A-M-30. Their accepted F/T mappings, integrated real Lexical command fixes and HB-20 V review cover the named component contracts. Broader consumer/document/input/trust obligations remain with their original E IDs. The coordinator owns closure decisions.

## Concrete delivery

- `metadata-retry.patch`: two proposed replacement files, retaining existing assertions. The image-source fixture now returns unsafe URL → malformed object assetId on safe URL → valid result. The existing light/dark native retry cases assert both rejection paths, exact metadata error, unchanged saved JSON and image count, retained filename/description, then valid decoded image/IDs/alt and reload. Six focused cases across three engines are pending execution.
- `documentation.patch`: a new proposed successor guide reconciles superseded V holds, identifies current exact successors and preserves host/operator ownership.
- `results.json`: all twelve original obligations, individual recommendations, exact evidence paths/SHA-256, and concrete remaining successors.
- `run-validation.mjs` and `validation-plan.json`: ordered fresh build, fixture/browser typecheck and only the six affected native retry cases. The runner prints commands unless explicitly invoked with `--execute`; coordinator must hold the serial validation lease.

## Accepted evidence reconciliation

Read AGENTS.md, assignment.json, current final acceptance/hardening execution, wave-03 owners 23–26, integration/followup and HB-19/20. The active baseline and regression checklists explicitly state 570/570 complete each; historical next100 per-component reports retain exact F/T case maps and limits.

`evidence.json` records the current dev head 6c485ed79d0d6a521d188e5bde8315722296f518 and inspected input hashes. All 16 HB-19 recorded source hashes and all seven HB-20 recorded source hashes match. The earlier integration snapshot has 85 unchanged and eight changed overlapping inputs. The eight changes are section/modal restoration, floating selection, shared Menu CSS, editor usage, registry and fixture; the followup validated snapshot covers all three overlapping restoration inputs, while HB-20 supplies the later selection/menu/fixture evidence. Earlier changed-byte evidence is never relabeled a fresh current-head run.

Wave-03 reports still say patches/native/V work pending. The integration report, 190 current editor unit receipt, later 1,851-test checkpoint and all-engine native followup supersede those statements only for their named cases. HB-20 adds 239 affected units and closes C26/C27/C28/C29/C30/C34 V-04/V-05. Its screenshot review is Chromium; native interactions/geometry cover all three desktop engines. HB-19/20 do not close all-editor acceptance or spoken AT.

## Lightweight checks executed

`git apply --check` passes for both patches; neither was applied. TypeScript 5.9.3 transpilation passes both TS/TSX proposals without syntax diagnostics (`static-check.json`). The runner dry-run emits its four ordered commands (`validation-dry-run.json`). No build, browser, install, simulator, unit suite or shared output was run. Syntax checking does not establish semantic types or behavior.

## Per-original-obligation recommendations

### A-M-26 — complete

A-M-26 Reconcile RichTextFormattingToolbar final acceptance: All formatting actions, mixed/active/disabled state, Lexical commands. Link its `F-C26`, `T-C26` and `V-C26` evidence and any unresolved defects.

F/T retain named actions, true/mixed/disabled and deferred host callbacks; integrated real Lexical command suite supplies selected-run history/reload. HB-20 closes V-C26-04/05. All component-specific named defects are corrected; command-family consumer inventory remains independently under E-04.

Phase mapping: F-C26: accepted baseline receipt; active baseline checklist has no open entries; T-C26: next100 mapping and accepted regression receipt; V-C26: retained first three leaves plus HB-20 V-C26-04/05.

Evidence: `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.command-transactions.test.tsx`, `packages/ui/tests/browser/editor-style-range-transactions.spec.ts`, `docs/developer/parallel-next100/next100-c26.md`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

No unresolved component-specific defect demonstrated by the inspected records. Broader E successors remain independent.

### A-M-27 — partial

A-M-27 Reconcile InsertContentMenuControl final acceptance: Menu commands and insertion focus, disabled actions and announcements. Link its `F-C27`, `T-C27` and `V-C27` evidence and any unresolved defects.

F/T establish three insertion callbacks, disabled actions, current callbacks and trigger/dialog focus; HB-20 closes V-C27-04/05. Host insertion status text proves callback delivery, not successful insertion speech.

Phase mapping: F-C27: accepted baseline receipt; active baseline checklist has no open entries; T-C27: next100 mapping and accepted regression receipt; V-C27: retained first three leaves plus HB-20 V-C27-04/05.

Evidence: `packages/ui/tests/browser/batch62-insert-menu-native-focus.spec.ts`, `docs/developer/parallel-next100/next100-c27.md`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

Remaining:
- W04-27-ANNOUNCEMENT: Add/reconcile one real host successful insertion result announcement and editor focus; record actual announcement with named AT if spoken behavior is claimed. Keep command callbacks and announcements host-owned.

### A-M-28 — complete

A-M-28 Reconcile TextAlignMenuControl final acceptance: Alignment/indent commands, active state, direction-aware presentation. Link its `F-C28`, `T-C28` and `V-C28` evidence and any unresolved defects.

F/T retain six physical/logical alignment choices, checked host value, disabled indent/outdent and RTL icons. Integrated bridge derives active alignment from selected blocks through load/undo/redo; real command suite covers all six values and paragraph suite covers indentation. HB-20 closes V-C28-04/05.

Phase mapping: F-C28: accepted baseline receipt; active baseline checklist has no open entries; T-C28: next100 mapping and accepted regression receipt; V-C28: retained first three leaves plus HB-20 V-C28-04/05.

Evidence: `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.command-transactions.test.tsx`, `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.paragraph-transactions.test.tsx`, `packages/ui/tests/browser/inventory-align-direction.spec.ts`, `docs/developer/parallel-next100/next100-c28.md`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

No unresolved component-specific defect demonstrated by the inspected records. Broader E successors remain independent.

### A-M-29 — partial

A-M-29 Reconcile TextColorPickerControl final acceptance: Foreground/background modes, clear/reset, swatches and accessible color control. Link its `F-C29`, `T-C29` and `V-C29` evidence and any unresolved defects.

F/T plus real command transactions cover foreground/background, hex, swatches, clear/removal, preserved rich runs and history/reload. HB-20 closes V-C29-04/05. Synthetic color-input changes and hex editing do not exercise the OS chooser.

Phase mapping: F-C29: accepted baseline receipt; active baseline checklist has no open entries; T-C29: next100 mapping and accepted regression receipt; V-C29: retained first three leaves plus HB-20 V-C29-04/05.

Evidence: `packages/ui/tests/browser/batch63-color-menu-native-transactions.spec.ts`, `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.command-transactions.test.tsx`, `docs/developer/parallel-next100/next100-c29.md`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

Remaining:
- W04-29-CHOOSER: Operate the actual OS color chooser in foreground/background by keyboard and named AT; record initial focus, confirm/cancel, callback count/value, return focus and spoken output. Reuse wave-03-25 operator protocol.

### A-M-30 — complete

A-M-30 Reconcile TextStyleMenuControl final acceptance: Style/typeface options, tokenized labels, selection and focus behavior. Link its `F-C30`, `T-C30` and `V-C30` evidence and any unresolved defects.

F/T cover eight style actions, tokenized sample typography, host-controlled checked state and native menu focus. Typeface selection remains the approved toolbar API. Integrated partial-run/caret/Unicode fixes pass real commands/history/reload; native Uppercase/Clear pass all engines. HB-20 closes V-C30-04/05.

Phase mapping: F-C30: accepted baseline receipt; active baseline checklist has no open entries; T-C30: next100 mapping and accepted regression receipt; V-C30: retained first three leaves plus HB-20 V-C30-04/05.

Evidence: `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.command-transactions.test.tsx`, `packages/ui/tests/browser/editor-style-range-transactions.spec.ts`, `docs/developer/parallel-next100/next100-c30.md`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

No unresolved component-specific defect demonstrated by the inspected records. Broader E successors remain independent.

### A-M-34 — partial

A-M-34 Reconcile PageRichTextEditorSection final acceptance: Editor composition, nodes/plugins, serialization and selection behavior. Link its `F-C34`, `T-C34` and `V-C34` evidence and any unresolved defects.

F/T, integrated saved-node combinations, real history/reload, native selection/ordinary editing and HB-20 V-C34-04/05 are accepted within their scopes. Whole-editor acceptance still includes the separately assigned document, command, input and trust rows.

Phase mapping: F-C34: accepted baseline receipt; active baseline checklist has no open entries; T-C34: next100 mapping and accepted regression receipt; V-C34: retained first three leaves plus HB-20 V-C34-04/05.

Evidence: `packages/ui/src/components/PageRichTextEditorSection/lexical/editorConfig.acceptance-successors.test.ts`, `packages/ui/tests/browser/editor-selection-editing-successors.spec.ts`, `docs/developer/parallel-next100/next100-c34.md`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

Remaining:
- W04-34-COMPOSITION: Reconcile E-02 through E-07 successors below; no second whole-editor suite or repeat of accepted V evidence.

### A-E-02 — partial

A-E-02 Reconcile original `E-02`: Preserve existing nodes/plugins: ImageNode, image insertion, horizontal-rule selection, editor configuration, and experience plugins; test saved-content round trips. Historical status: open.

Integrated authored nested-list/merged-header/decorative-alt/Unicode asset corpus passes edit/reload/read-only; unknown-node failure is characterized. Registered nodes and plugins remain intact. This corpus is not the approved consumer inventory.

Evidence: `packages/ui/src/components/PageRichTextEditorSection/lexical/editorConfig.acceptance-successors.test.ts`, `packages/ui/src/components/PageRichTextEditorSection/lexical/editorConfig.ts`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

Remaining:
- W04-02-CORPUS: Obtain supported saved-document/node/version inventory and recovery decision. Add only missing approved fixtures. Assert edit/reload/read-only fidelity and that unknown/malformed input cannot overwrite the retained original.

### A-E-03 — partial

A-E-03 Reconcile original `E-03`: Replace editor toolbars, menus, modals, palettes and selection overlays with owned controls while preserving selection across commands and modal dismissal. Historical status: open.

Owned controls and integrated native modal rows now pass: six Cancel/Escape range combinations; Link Apply at caret/same-node/cross-node; read-only/key/unmount invalidation. Followup fixes Cancel restoration ordering. HB-19/20 close presentation; they do not prove every successful insertion shape.

Evidence: `packages/ui/tests/browser/wave03-editor-selection-acceptance.spec.ts`, `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.dialogs.test.tsx`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

Remaining:
- W04-03-INSERTION: Reconcile successful Image and Columns insertion at same-node/cross-node ranges against accepted tests; add only uncovered rows asserting exact unaffected rich runs/paragraphs, JSON, selection/focus, undo/reload.

### A-E-04 — partial

A-E-04 Reconcile original `E-04`: Cover undo/redo, links, lists, code, tables, alignment, indentation, colors, and inline formatting that current consumers use. Historical status: open.

Integrated 20-case real command suite and all-engine native Uppercase/Clear close the earlier concrete case/clear/alignment faults. Existing link/list/table/indent/color/history cases are retained. Wider currently consumed transformations are not declared by an owner.

Evidence: `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.command-transactions.test.tsx`, `packages/ui/tests/browser/editor-style-range-transactions.spec.ts`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

Remaining:
- W04-04-COMMANDS: Obtain required consumer list/code/table transformations and selection shapes. Compare with existing command-and-trust matrix and integrated tests, then implement only missing block-code/nested-list/nondefault table/header/merged/cross-cell outcomes actually required.

### A-E-05 — partial

A-E-05 Reconcile original `E-05`: Address IME composition, paste, keyboard shortcuts, read-only/disabled state, and toolbar accessibility without hijacking ordinary editing keys. Historical status: open.

Native Escape-to-typing/read-only successor cases and ordinary shortcut/clipboard evidence are retained. Synthetic composition guards are not OS IME conversion evidence. The existing simulator VoiceOver selector smoke does not exercise editor IME, toolbar or color chooser.

Evidence: `packages/ui/tests/browser/editor-selection-editing-successors.spec.ts`, `packages/ui/tests/browser/editor-clipboard.spec.ts`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

Remaining:
- W04-05-IME: Run real configured OS IME in content, title and color draft; record conversion/commit/cancel, composing Enter/Escape and ordinary shortcut behavior with exact versions.
- W04-05-AT: Record named device/browser/AT editor traversal, action pressed/mixed/disabled, focus return and read-only selection/copy; retain physical clipboard observation separately.

### A-E-06 — partial

A-E-06 Reconcile original `E-06`: Define safe URL/protocol handling, image metadata/alt text, host upload callbacks, file validation, cancellation, and object-URL cleanup. Shared saved/pasted link policy and activation: [partial contract](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial). Saved image sources and upload-result retry: [partial image contract](react-aria-editor-section.md#image-source-policy-e-06e-07-partial); [upload lifetime matrix](react-aria-editor-section.md#host-upload-lifetime-e-06-partial) covers stale results after cancellation/reset/read-only/unmount; [file presentation validation](react-aria-editor-dialogs.md#file-presentation-validation-e-06-partial) covers empty files and MIME/extension metadata; wider image/upload acceptance remains open. Historical status: open.

Runtime image field-shape guard and malformed-upload retry unit are integrated. Existing URL/source/file/lifetime/object-URL contracts and tests remain. New proposal adds the missing real native metadata retry step to existing image-source flow without changing policy.

Evidence: `packages/ui/src/components/PageRichTextEditorSection/lexical/imagePayloadPolicy.ts`, `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.dialogs.test.tsx`, `packages/ui/tests/browser/editor-image-sources.spec.ts`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

Remaining:
- W04-06-NATIVE: Integrate metadata-retry.patch, build once and execute six focused retry cases; preserve both rejected attempts and valid retry/reload.
- W04-06-HOST: Obtain owner-approved encoded/redirect/resource policy and actual host byte/type/size/dimension/authorization/abort/stale-asset cleanup evidence. UI must not revoke host URLs/delete assets.

### A-E-07 — partial

A-E-07 Reconcile original `E-07`: Review rich-content rendering and trust boundaries; do not render arbitrary HTML or unsafe links merely because they arrived in a presentation model. Saved/pasted link destinations are governed by the [owned policy](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial), and image decoration by the [image source policy](react-aria-editor-section.md#image-source-policy-e-06e-07-partial); broader rich-content acceptance remains open. Historical status: open.

Owned link/image rendering, runtime metadata checks, escaped React attributes and JSON fidelity are bounded protection. Saved rejected destinations remain raw data; editor rendering is not a downstream sanitizer. No atomic whole-document/style policy exists.

Evidence: `packages/ui/src/components/PageRichTextEditorSection/lexical/OwnedLinkNode.ts`, `packages/ui/src/components/PageRichTextEditorSection/lexical/ImageNode.tsx`, `packages/ui/src/components/PageRichTextEditorSection/lexical/imagePayloadPolicy.ts`. Exact SHA-256 and shared accepted receipts are in this leaf’s results.json entry.

Remaining:
- W04-07-TRUST: Owner defines author CSS/property/resource allowlist, malformed/unknown node/version recovery and downstream renderer policies. Then run hostile saved/pasted CSS/resource corpus with native request/geometry observations and original-retention assertions. Reuse wave-03-26 trust-review.md; do not purge author styles without a decision.

## Integration limits

Compare `proposal-targets.json` before applying because the shared fixture may change. Apply the code/test patch and the separate documentation patch after review. Build once in the coordinator slot; run only the named retry cases and affected typechecks. Preserve all passing historical evidence and original red logs.

Use the existing wave-03-25 operator protocol and wave-03-26 trust review for exact host/IME/chooser/AT decision fields. A host/service policy, approved consumer schema inventory and real OS interaction cannot be fabricated by adding synthetic tests. The prepared test addresses a concrete missing native boundary; it is not host backend verification.

Physical-device/spoken-AT, owner/legal approval, six deferred future leaves and production/release gates remain separate. No commit, push, branch, release, tag or publication was performed.
