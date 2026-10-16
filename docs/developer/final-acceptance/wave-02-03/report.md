# Wave 02-03 acceptance reconciliation

Reviewed all 24 assigned leaves: **7 complete, 17 partial, 0 blocked**. Complete recommendations: A-M-24/31/32/33 and A-E-01/09/10. These are named architectural/component results; the 20 editor V leaves, broader editor trust/device/AT and production gates remain open.

## Evidence and attribution

Modified dev HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`; capture `2026-10-16T22:45:11.552723+00:00`. [evidence.json](evidence.json) records 238 focused input hashes and 264 unit/native test declarations. All fourteen assigned editor source/test/CSS directories match FA-02. The saved production graph has only the four coordinator picker/TextArea deltas listed in that file. Current imports were inspected for their domain boundary; no claim that old dist contains those fixes.

FA-04 Node 24 unit evidence is retained: its original overall check failed nine calendar cases, corrected in the affected rerun. The editor suites were among the passing unaffected suites. Existing package/foundation evidence and parallel-03 owned API review are reused without rerunning suites. Local analysis used Python 3.9.6 and Node 26.5.0 on macOS; no new supported-runtime result is claimed.

F and T active files contain no open rows; individual family case mappings survive in next100-c21 through next100-c34 reports. Their older native holds for T-C25-02 and T-C34-10 are superseded by the later executed docs-owned fixture results in `backlog-execution-2026-10-15.md:17–64`. Historical Storybook evidence is retained separately, never represented as a docs-host execution.

HB-14 supplies EditableTitleField presentation/RTL evidence; HB-18 supplies ColumnsLayoutModal, ImageUploadModal and LinkUrlModal. The accepted execution receipts describe actual native engines and reviewed screenshots. Their named ignored `packages/ui/artifacts/...` raw directories are absent locally, as explicitly tested in evidence.json. This report reuses the accepted receipts and current source/assertions; it does not claim fresh screenshot inspection or recover missing raw artifacts. Exact historical source/host/build limits remain those of each receipt (modified dev, including d3201f0-based batches), not this current HEAD.

The [command and trust matrix](command-and-trust-matrix.md) is new review work: it enumerates retained positive evidence and missing acceptance deliverables instead of repeating blanket editor holds. Shared ledgers/counts were not edited.

## A-M-21 — partial

**Original requirement:** Reconcile DocumentEditorLayout final acceptance: Tokenized menu/toolbar/content layout and scroll boundaries. Link its `F-C21`, `T-C21` and `V-C21` evidence and any unresolved defects.

Token CSS separates header/menu/toolbar/content; zero minimum dimensions and host-owned scroll preserve the live child node, draft, focus and scroll on chrome replacement.

**Concrete evidence:** `packages/ui/src/components/DocumentEditorLayout/DocumentEditorLayout.tsx`; `packages/ui/src/components/DocumentEditorLayout/DocumentEditorLayout.test.tsx`; `docs/developer/react-aria-editor-layout.md`; `packages/ui/tests/browser/inventory-layout-replacement.spec.ts`; `docs/developer/parallel-next100/next100-c21.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`.

**F/T/V reconciliation:** `F-C21` retained complete; `T-C21` exact case mapping is in `docs/developer/parallel-next100/next100-c21.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: V-C21-04 and -05 remain open in active hardening checklist. Primary flow: `packages/ui/tests/browser/inventory-layout-replacement.spec.ts`.

**Required successors:**

- **W03-C21-V:** Validate long title/menu/toolbar/content at narrow width, both densities/themes, then Arabic RTL labels and reading order; preserve the host scroll owner and focus through slot replacement. Evidence: Close V-C21-04/05 with native engine/version/source/fixture hashes, measured geometry, reviewed screenshots and translated names/order; do not infer spoken AT from DOM labels.

## A-M-22 — partial

**Original requirement:** Reconcile DocumentEditorToolbar final acceptance: Owned buttons/menus/toggles, formatting state, responsive overflow. Link its `F-C22`, `T-C22` and `V-C22` evidence and any unresolved defects.

Owned Button/Select map controlled heading and pressed actions; unavailable callbacks disable actions, zoom remains available read-only, and deferred heading requests use current callbacks/cancel on lost availability or unmount. Alignment/custom actions are documented disabled placeholders, not newly promised APIs.

**Concrete evidence:** `packages/ui/src/components/DocumentEditorToolbar/DocumentEditorToolbar.tsx`; `packages/ui/src/components/DocumentEditorToolbar/DocumentEditorToolbar.test.tsx`; `docs/developer/react-aria-editor-layout.md`; `packages/ui/tests/browser/inventory-editor-chrome.spec.ts`; `docs/developer/parallel-next100/next100-c22.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`.

**F/T/V reconciliation:** `F-C22` retained complete; `T-C22` exact case mapping is in `docs/developer/parallel-next100/next100-c22.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: V-C22-04 and -05 remain open in active hardening checklist. Primary flow: `packages/ui/tests/browser/inventory-editor-chrome.spec.ts`.

**Required successors:**

- **W03-C22-V:** Review responsive wrap/overflow with long heading/status and all optional groups; verify translated accessible names/order and RTL in a composed editor. Include disabled/pressed/zoom and deferred heading focus after host replacement. Evidence: Close V-C22-04/05 with native engine/version/source/fixture hashes, measured geometry, reviewed screenshots and translated names/order; do not infer spoken AT from DOM labels.

## A-M-23 — partial

**Original requirement:** Reconcile ContentEditorChrome final acceptance: Menu composition, editor focus, disabled/loading actions, semantic structure. Link its `F-C23`, `T-C23` and `V-C23` evidence and any unresolved defects.

Owned chrome composes EditableTitleField, native button anchors, named action group and host status slots. Pending/unavailable actions suppress calls. onPress(anchor) hands selection/focus preparation to the host; chrome does not own Lexical selection.

**Concrete evidence:** `packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.tsx`; `packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.test.tsx`; `docs/developer/react-aria-editor-layout.md`; `packages/ui/tests/browser/inventory-editor-chrome.spec.ts`; `docs/developer/parallel-next100/next100-c23.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`.

**F/T/V reconciliation:** `F-C23` retained complete; `T-C23` exact case mapping is in `docs/developer/parallel-next100/next100-c23.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: V-C23-04 and -05 remain open in active hardening checklist. Primary flow: `packages/ui/tests/browser/inventory-editor-chrome.spec.ts`.

**Required successors:**

- **W03-C23-V:** Review title/save/menu/status wrap at narrow widths in both themes/densities; check Arabic RTL heading/action order, named groups and anchor-to-host-dialog focus with pending action replacement. Evidence: Close V-C23-04/05 with native engine/version/source/fixture hashes, measured geometry, reviewed screenshots and translated names/order; do not infer spoken AT from DOM labels.

## A-M-24 — complete

**Original requirement:** Reconcile EditableTitleField final acceptance: Controlled edit/commit/cancel, keyboard and blur behavior, validation. Link its `F-C24`, `T-C24` and `V-C24` evidence and any unresolved defects.

Host title remains committed state; local draft trims, ignores empty/unchanged values, commits once on Enter/blur, cancels Escape without blur persistence, guards composing Enter, exposes rejection/retry and preserves next-control focus. HB-14 supplies the missing presentation/RTL pair, so this individual row can close.

**Concrete evidence:** `packages/ui/src/components/EditableTitleField/EditableTitleField.tsx`; `packages/ui/src/components/EditableTitleField/EditableTitleField.test.tsx`; `docs/developer/react-aria-remaining-controls.md`; `packages/ui/tests/browser/batch13-editable-title.spec.ts`; `docs/developer/parallel-next100/next100-c24.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`; `packages/ui/tests/browser/hardening-actions-presentation.spec.ts`.

**F/T/V reconciliation:** `F-C24` retained complete; `T-C24` exact case mapping is in `docs/developer/parallel-next100/next100-c24.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: HB-14, receipt section at line 600 Primary flow: `packages/ui/tests/browser/batch13-editable-title.spec.ts`.

No required successor within this named leaf. Related broader gates and the common attribution limits remain in force.

## A-M-25 — partial

**Original requirement:** Reconcile FloatingTextSelectionToolbar final acceptance: Selection anchoring, focus preservation, overlay cleanup, keyboard access. Link its `F-C25`, `T-C25` and `V-C25` evidence and any unresolved defects.

Lexical range snapshots survive toolbar focus; Alt+F10/Tab/Enter/Escape, hidden semantics, read-only/node-deletion guards, ancestor scroll/resize collision, deferred command cleanup and instance isolation have focused tests. The later docs-host native receipt supersedes the older remaining-T report hold for T-C25-02.

**Concrete evidence:** `packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx`; `packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx`; `docs/developer/react-aria-editor-layout.md`; `packages/ui/tests/browser/inventory-selection-boundary.spec.ts`; `docs/developer/parallel-next100/next100-c25.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`.

**F/T/V reconciliation:** `F-C25` retained complete; `T-C25` exact case mapping is in `docs/developer/parallel-next100/next100-c25.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: V-C25-04 and -05 remain open in active hardening checklist. Primary flow: `packages/ui/tests/browser/inventory-selection-boundary.spec.ts`.

**Required successors:**

- **W03-C25-V:** Review selected-text geometry, wrapping and viewport/boundary collisions at narrow width, both themes/densities, and Arabic RTL names/order. Exercise Alt+F10, Escape, scroll while a toolbar button is focused and read-only/unmount cleanup using native selection. Evidence: Close V-C25-04/05 with native engine/version/source/fixture hashes, measured geometry, reviewed screenshots and translated names/order; do not infer spoken AT from DOM labels.

## A-M-26 — partial

**Original requirement:** Reconcile RichTextFormattingToolbar final acceptance: All formatting actions, mixed/active/disabled state, Lexical commands. Link its `F-C26`, `T-C26` and `V-C26` evidence and any unresolved defects.

Owned controls expose heading/typeface/size/history/inline/color/alignment/style/insertion, controlled true/false/mixed flags and disabled/hidden control sets. Component callbacks are tested independently; complete Lexical mixed selection/history semantics remain A-E-02/04.

**Concrete evidence:** `packages/ui/src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.tsx`; `packages/ui/src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.test.tsx`; `docs/developer/react-aria-formatting-toolbar.md`; `packages/ui/tests/browser/batch13-formatting-toolbar.spec.ts`; `docs/developer/parallel-next100/next100-c26.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`; `packages/ui/src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.impl.tsx`.

**F/T/V reconciliation:** `F-C26` retained complete; `T-C26` exact case mapping is in `docs/developer/parallel-next100/next100-c26.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: V-C26-04 and -05 remain open in active hardening checklist. Primary flow: `packages/ui/tests/browser/batch13-formatting-toolbar.spec.ts`.

**Required successors:**

- **W03-C26-V:** Review long text/typeface/color/menu content, responsive wrapping, both themes/densities and translated RTL order. Reconcile each active/mixed/disabled action against the editor command matrix in this report; retain incomplete combinations under A-E-04. Evidence: Close V-C26-04/05 with native engine/version/source/fixture hashes, measured geometry, reviewed screenshots and translated names/order; do not infer spoken AT from DOM labels.
- **W03-C26-E:** Reconcile the missing E-family command/content/IME/trust rows from command-and-trust-matrix.md. Evidence: Retain one result per missing row; no duplicate suite or broad parent closure from one fixture.

## A-M-27 — partial

**Original requirement:** Reconcile InsertContentMenuControl final acceptance: Menu commands and insertion focus, disabled actions and announcements. Link its `F-C27`, `T-C27` and `V-C27` evidence and any unresolved defects.

Image/rule/columns each request the current parameterless callback once; unavailable commands disable, menus are compact/form-safe, and native ref/style plus host-dialog handoff are covered. Insertion announcements and final selection/focus belong to the host, not this generic menu.

**Concrete evidence:** `packages/ui/src/components/InsertContentMenuControl/InsertContentMenuControl.tsx`; `packages/ui/src/components/InsertContentMenuControl/InsertContentMenuControl.test.tsx`; `docs/developer/react-aria-editor-menus.md`; `packages/ui/tests/browser/batch62-insert-menu-native-focus.spec.ts`; `docs/developer/parallel-next100/next100-c27.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`.

**F/T/V reconciliation:** `F-C27` retained complete; `T-C27` exact case mapping is in `docs/developer/parallel-next100/next100-c27.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: V-C27-04 and -05 remain open in active hardening checklist. Primary flow: `packages/ui/tests/browser/batch62-insert-menu-native-focus.spec.ts`.

**Required successors:**

- **W03-C27-V:** Review translated long insertion labels and keyboard focus at narrow width in both themes/densities and Arabic RTL. In the composed host confirm one named insertion result announcement and correct editor/dialog return focus. Evidence: Close V-C27-04/05 with native engine/version/source/fixture hashes, measured geometry, reviewed screenshots and translated names/order; do not infer spoken AT from DOM labels.

## A-M-28 — partial

**Original requirement:** Reconcile TextAlignMenuControl final acceptance: Alignment/indent commands, active state, direction-aware presentation. Link its `F-C28`, `T-C28` and `V-C28` evidence and any unresolved defects.

All six owned physical/logical alignment values and indent/outdent availability are covered; host-controlled checked state and latest callback replacement remain authoritative. CSS mirrors start/end icons in RTL while physical left/right commands keep their values.

**Concrete evidence:** `packages/ui/src/components/TextAlignMenuControl/TextAlignMenuControl.tsx`; `packages/ui/src/components/TextAlignMenuControl/TextAlignMenuControl.test.tsx`; `docs/developer/react-aria-editor-menus.md`; `packages/ui/tests/browser/inventory-align-direction.spec.ts`; `docs/developer/parallel-next100/next100-c28.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`.

**F/T/V reconciliation:** `F-C28` retained complete; `T-C28` exact case mapping is in `docs/developer/parallel-next100/next100-c28.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: V-C28-04 and -05 remain open in active hardening checklist. Primary flow: `packages/ui/tests/browser/inventory-align-direction.spec.ts`.

**Required successors:**

- **W03-C28-V:** Review all physical/logical icons and translated long labels at narrow width, both themes/densities and RTL. Confirm single checked alignment, logical placement, native keyboard focus/return and disabled indent/outdent. Evidence: Close V-C28-04/05 with native engine/version/source/fixture hashes, measured geometry, reviewed screenshots and translated names/order; do not infer spoken AT from DOM labels.

## A-M-29 — partial

**Original requirement:** Reconcile TextColorPickerControl final acceptance: Foreground/background modes, clear/reset, swatches and accessible color control. Link its `F-C29`, `T-C29` and `V-C29` evidence and any unresolved defects.

Foreground/background modes, labelled native color input, semantic swatches, hex normalization, invalid feedback, IME Enter suppression, deduped Enter/blur, clear/reset and host draft replacement have unit/native cases. Native color-dialog accessibility is not proven by changing input values in automation.

**Concrete evidence:** `packages/ui/src/components/TextColorPickerControl/TextColorPickerControl.tsx`; `packages/ui/src/components/TextColorPickerControl/TextColorPickerControl.test.tsx`; `docs/developer/react-aria-editor-menus.md`; `packages/ui/tests/browser/batch63-color-menu-native-transactions.spec.ts`; `docs/developer/parallel-next100/next100-c29.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`; `packages/ui/src/components/TextColorPickerControl/TextColorPickerControl.impl.tsx`.

**F/T/V reconciliation:** `F-C29` retained complete; `T-C29` exact case mapping is in `docs/developer/parallel-next100/next100-c29.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: V-C29-04 and -05 remain open in active hardening checklist. Primary flow: `packages/ui/tests/browser/batch63-color-menu-native-transactions.spec.ts`.

**Required successors:**

- **W03-C29-V:** Review foreground and background popovers with long labels at narrow width, both themes/densities and Arabic RTL; verify focus/error/swatch contrast. Obtain an operator/platform record for actual native OS color chooser keyboard and AT interaction separately from DOM change events. Evidence: Close V-C29-04/05 with native engine/version/source/fixture hashes, measured geometry, reviewed screenshots and translated names/order; do not infer spoken AT from DOM labels.
- **W03-C29-NATIVE-COLOR:** Record actual native color chooser operation on named OS/browser with keyboard and spoken AT. Evidence: Operator, OS/browser/AT versions, focus/confirm/cancel behavior for foreground/background; browser input change events alone insufficient.

## A-M-30 — partial

**Original requirement:** Reconcile TextStyleMenuControl final acceptance: Style/typeface options, tokenized labels, selection and focus behavior. Link its `F-C30`, `T-C30` and `V-C30` evidence and any unresolved defects.

Eight style commands, controlled checked state, missing-callback skipping and tokenized case labels are implemented/tested. The approved F-C30-01 contract has no typeface API: typeface selection belongs to RichTextFormattingToolbar, whose heading/font tests provide the related evidence. No unsupported prop is invented to satisfy old shorthand.

**Concrete evidence:** `packages/ui/src/components/TextStyleMenuControl/TextStyleMenuControl.tsx`; `packages/ui/src/components/TextStyleMenuControl/TextStyleMenuControl.test.tsx`; `docs/developer/react-aria-editor-menus.md`; `packages/ui/tests/browser/batch64-style-menu-native-selection.spec.ts`; `docs/developer/parallel-next100/next100-c30.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`.

**F/T/V reconciliation:** `F-C30` retained complete; `T-C30` exact case mapping is in `docs/developer/parallel-next100/next100-c30.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: V-C30-04 and -05 remain open in active hardening checklist. Primary flow: `packages/ui/tests/browser/batch64-style-menu-native-selection.spec.ts`.

**Required successors:**

- **W03-C30-V:** Review long translated style labels/case glyphs and checked/disabled choices at narrow width in both themes/densities and Arabic RTL; verify native selection survives command/return focus. Reconcile the old typeface shorthand to the already approved split in central acceptance wording. Evidence: Close V-C30-04/05 with native engine/version/source/fixture hashes, measured geometry, reviewed screenshots and translated names/order; do not infer spoken AT from DOM labels.

## A-M-31 — complete

**Original requirement:** Reconcile ColumnsLayoutModal final acceptance: Layout presets, selected state, validation and modal Apply/Cancel. Link its `F-C31`, `T-C31` and `V-C31` evidence and any unresolved defects.

Five stable presets use one controlled radio choice; invalid runtime defaults normalize, open/default changes reset drafts, Insert emits once and Cancel/Escape never submit. Table-history native host proves integration; HB-18 closes the presentation/RTL pair. No persistence service is promised.

**Concrete evidence:** `packages/ui/src/components/ColumnsLayoutModal/ColumnsLayoutModal.tsx`; `packages/ui/src/components/ColumnsLayoutModal/ColumnsLayoutModal.test.tsx`; `docs/developer/react-aria-editor-dialogs.md`; `packages/ui/tests/browser/inventory-editor-table-history.spec.ts`; `docs/developer/parallel-next100/next100-c31.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`; `packages/ui/tests/browser/hardening-editor-dialogs-presentation.spec.ts`.

**F/T/V reconciliation:** `F-C31` retained complete; `T-C31` exact case mapping is in `docs/developer/parallel-next100/next100-c31.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: HB-18 final, receipt section at line 770 Primary flow: `packages/ui/tests/browser/inventory-editor-table-history.spec.ts`.

No required successor within this named leaf. Related broader gates and the common attribution limits remain in force.

## A-M-32 — complete

**Original requirement:** Reconcile ImageUploadModal final acceptance: File selection/preview/errors, host upload callback, image alt text and cancellation. Link its `F-C32`, `T-C32` and `V-C32` evidence and any unresolved defects.

Picker/drop share nonempty image MIME/extension metadata validation. File/description callbacks, decorative empty alt, preview ownership/revocation, pending duplicate guard, cancellation/reset, rejected upload retry and stale-session invalidation are covered. HB-18 validates translated/long file/description focus outline. This closes the named modal row; byte sniffing, service authorization and wider E-06 trust remain host/broader obligations.

**Concrete evidence:** `packages/ui/src/components/ImageUploadModal/ImageUploadModal.tsx`; `packages/ui/src/components/ImageUploadModal/ImageUploadModal.test.tsx`; `docs/developer/react-aria-editor-dialogs.md`; `packages/ui/tests/browser/image-upload-validation.spec.ts`; `docs/developer/parallel-next100/next100-c32.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`; `packages/ui/tests/browser/hardening-editor-dialogs-presentation.spec.ts`.

**F/T/V reconciliation:** `F-C32` retained complete; `T-C32` exact case mapping is in `docs/developer/parallel-next100/next100-c32.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: HB-18 final, receipt section at line 770 Primary flow: `packages/ui/tests/browser/image-upload-validation.spec.ts`.

No required successor within this named leaf. Related broader gates and the common attribution limits remain in force.

## A-M-33 — complete

**Original requirement:** Reconcile LinkUrlModal final acceptance: URL validation, protocol policy, edit/remove and focus restoration. Link its `F-C33`, `T-C33` and `V-C33` evidence and any unresolved defects.

Shared owned protocol policy rejects executable/malformed/network-path/control-character destinations; allowed protocol/relative restrictions, trimmed spelling, blank-to-unlink, Enter/Apply dedupe, edit/remove rich children, Cancel/Escape/reset and native opener focus are covered. HB-18 closes presentation/RTL. Broader saved/pasted rich-content trust remains A-E-06/07, rather than expanding this dialog row into a sanitizer.

**Concrete evidence:** `packages/ui/src/components/LinkUrlModal/LinkUrlModal.tsx`; `packages/ui/src/components/LinkUrlModal/LinkUrlModal.test.tsx`; `docs/developer/react-aria-editor-dialogs.md`; `packages/ui/tests/browser/inventory-link-modal.spec.ts`; `docs/developer/parallel-next100/next100-c33.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`; `packages/ui/tests/browser/hardening-editor-dialogs-presentation.spec.ts`.

**F/T/V reconciliation:** `F-C33` retained complete; `T-C33` exact case mapping is in `docs/developer/parallel-next100/next100-c33.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: HB-18 final, receipt section at line 770 Primary flow: `packages/ui/tests/browser/inventory-link-modal.spec.ts`.

No required successor within this named leaf. Related broader gates and the common attribution limits remain in force.

## A-M-34 — partial

**Original requirement:** Reconcile PageRichTextEditorSection final acceptance: Editor composition, nodes/plugins, serialization and selection behavior. Link its `F-C34`, `T-C34` and `V-C34` evidence and any unresolved defects.

Owned Lexical composition retains nodes, JSON callbacks/editorKey, read-only changes, selection snapshots, safe saved/pasted links, image metadata/URL lifetime and guarded upload retries. Real history/table/mixed-run, clipboard and public reload suites provide bounded coverage. T-C34-10 native copy was subsequently executed in the docs host; its old report hold is superseded. Full E-02/04/05/06/07 matrices and its V presentation/RTL pair remain open.

**Concrete evidence:** `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.tsx`; `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.test.tsx`; `docs/developer/react-aria-editor-section.md`; `packages/ui/tests/browser/editor-rich-document.spec.ts`; `docs/developer/parallel-next100/next100-c34.md`; `docs/developer/backlog-execution-2026-10-15.md`; `docs/developer/react-aria-migration-inventory-acceptance.md`; `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx`.

**F/T/V reconciliation:** `F-C34` retained complete; `T-C34` exact case mapping is in `docs/developer/parallel-next100/next100-c34.md`. Retained complete; exact leaf/case mappings in next100 report, with later native closure in backlog receipt for C25/C34. V: V-C34-04 and -05 remain open in active hardening checklist. Primary flow: `packages/ui/tests/browser/editor-rich-document.spec.ts`.

**Required successors:**

- **W03-C34-V:** Review the full composed editor with saved rich content, narrow scroll region, table overflow, long translated controls, both themes/densities and Arabic RTL. Finish only missing E-02/04/05/06/07 successors below; do not rerun completed clipboard/image/selection cases. Evidence: Close V-C34-04/05 with native engine/version/source/fixture hashes, measured geometry, reviewed screenshots and translated names/order; do not infer spoken AT from DOM labels.
- **W03-C34-E:** Reconcile the missing E-family command/content/IME/trust rows from command-and-trust-matrix.md. Evidence: Retain one result per missing row; no duplicate suite or broad parent closure from one fixture.

## A-E-01 — complete

**Original requirement:** Reconcile original `E-01`: Retain Lexical as the editor engine unless a separate evidenced decision changes it; remove visual-foundation coupling without accidentally changing document serialization. Historical status: open.

Lexical remains the engine and direct dependencies are retained. Editor/chrome/dialog visuals use owned controls and compiled token CSS. Registered node and saved-schema adapters preserve the public link/image document representation; serialization tests assert exact node metadata across reload. This closes engine/visual separation and schema-preservation architecture, without closing E-02 every-node/command combinations.

**Concrete evidence:** `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx`; `packages/ui/src/components/PageRichTextEditorSection/lexical/editorConfig.ts`; `packages/ui/src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.ts`; `packages/ui/src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.test.ts`; `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.formatting.test.tsx`; `packages/ui/package.json`; `docs/developer/react-aria-editor-section.md`.

No required successor within this named leaf. Related broader gates and the common attribution limits remain in force.

## A-E-02 — partial

**Original requirement:** Reconcile original `E-02`: Preserve existing nodes/plugins: ImageNode, image insertion, horizontal-rule selection, editor configuration, and experience plugins; test saved-content round trips. Historical status: open.

ImageNode/insertion/rule-selection/config/experience plugins remain registered. Golden saved rich-document fixtures cover headers/quotes/lists/code-highlight/tables/styles/links/images and reload, but the contract explicitly limits this representative set; unsupported-node/version/error and full consumer-document combinations have not been reconciled to final acceptance.

**Concrete evidence:** `packages/ui/src/components/PageRichTextEditorSection/lexical/editorConfig.ts`; `packages/ui/src/components/PageRichTextEditorSection/lexical/ExperienceEditorPlugins.tsx`; `packages/ui/src/components/PageRichTextEditorSection/lexical/ImageNode.test.tsx`; `packages/ui/src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.test.ts`; `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.formatting.test.tsx`; `packages/ui/tests/browser/editor-rich-document.spec.ts`; `docs/developer/react-aria-editor-section.md`.

**Required successors:**

- **W03-E02-ROUNDTRIP:** Complete the node/plugin-to-fixture inventory in command-and-trust-matrix.md against approved consumer saved documents. Add missing schema/version/malformed input and node combinations only; preserve author metadata and public link spelling. Evidence: Per missing document fixture: input JSON, registered type/plugin, output JSON comparison after edit/reload/read-only and error policy, exact source/test hashes; reuse existing golden round trips.

## A-E-03 — partial

**Original requirement:** Reconcile original `E-03`: Replace editor toolbars, menus, modals, palettes and selection overlays with owned controls while preserving selection across commands and modal dismissal. Historical status: open.

Every toolbar/menu/dialog/palette/selection-overlay composition uses owned controls. Real Lexical tests cover pointer preparation, keyboard link commit, formatting after focus transfer, modal cancellation and selection anchoring. Native docs-host selection and link flows exist, but the complete modal/selection outcome matrix (especially cross-node selections and cancelled insertion) has not been accepted; source replacement alone cannot certify it.

**Concrete evidence:** `packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx`; `packages/ui/src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.impl.tsx`; `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.dialogs.test.tsx`; `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.formatting.test.tsx`; `packages/ui/tests/browser/inventory-link-modal.spec.ts`; `packages/ui/tests/browser/inventory-selection-boundary.spec.ts`; `docs/developer/react-aria-editor-layout.md`.

**Required successors:**

- **W03-E03-SELECTION:** Reconcile modal/image/link/columns and floating/menu commands for collapsed, same-node and cross-node ranges; include Cancel/Escape and document/read-only replacement. Use existing selection-driver fixtures; add only uncovered rows. Evidence: Native retained-range/text/format and focus outcome per uncovered row; late/unmounted actions make no edit. Keep remaining presentation/RTL V leaves independent.

## A-E-04 — partial

**Original requirement:** Reconcile original `E-04`: Cover undo/redo, links, lists, code, tables, alignment, indentation, colors, and inline formatting that current consumers use. Historical status: open.

History, links, lists/code, table insertion/edit/reload, all alignment IDs/indent, foreground/background colors and inline/mixed formatting have concrete existing cases, but the complete currently-consumed command x selection x undo/redo matrix is not closed. The matrix file maps existing evidence and identifies missing blocks instead of treating the whole editor as untested.

**Concrete evidence:** `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.table-history.test.tsx`; `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.mixed-formatting.test.tsx`; `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.paragraph-transactions.test.tsx`; `packages/ui/tests/browser/inventory-editor-table-history.spec.ts`; `packages/ui/tests/browser/editor-mixed-formatting-history.spec.ts`; `packages/ui/tests/browser/editor-paragraph-transactions.spec.ts`; `docs/developer/react-aria-editor-section.md`.

**Required successors:**

- **W03-E04-COMMANDS:** Use the command matrix to obtain current consumer-required combinations; reconcile selection boundaries/active-mixed-disabled values and real undo/redo for remaining list/code/table/alignment/color/inline commands. No blanket every-permutation expansion. Evidence: Each missing named command scenario shows exact JSON/text/style before/after, selection retention, undo/redo and editorKey reload; reuse existing table/mixed/paragraph native receipts.

## A-E-05 — partial

**Original requirement:** Reconcile original `E-05`: Address IME composition, paste, keyboard shortcuts, read-only/disabled state, and toolbar accessibility without hijacking ordinary editing keys. Historical status: open.

Native clipboard/paste, ordinary shortcuts/history, scoped read-only select-all/copy and editor focus have retained browser evidence. EditableTitleField and color form guard composing Enter. Actual Japanese/Chinese/Korean composition sessions, physical-device clipboard and spoken editor-toolbar AT are explicitly absent, so synthetic composition or trusted desktop clipboard cannot close this leaf.

**Concrete evidence:** `packages/ui/tests/browser/editor-clipboard.spec.ts`; `packages/ui/src/components/EditableTitleField/EditableTitleField.tsx`; `packages/ui/src/components/TextColorPickerControl/TextColorPickerControl.impl.tsx`; `packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx`; `docs/developer/react-aria-editor-section.md`; `docs/developer/react-aria-browser-acceptance.md`.

**Required successors:**

- **W03-E05-IME:** An operator must exercise real OS IME composition (Japanese/Chinese/Korean as supported by host) in editable content/title/color draft, including Enter/Escape, conversion, paste, undo and read-only transitions. Evidence: Named OS/browser/IME versions, text/caret/host callback outcomes; composing Enter never commits a title/color prematurely or replaces native editor conversion.
- **W03-E05-DEVICE-AT:** Run the remaining physical-device clipboard and manual editor/toolbar screen-reader review with ordinary editing keys and Alt+F10/Escape. Evidence: Operator/device/OS/browser/AT versions and spoken/focus findings; preserve missing outcomes rather than substituting axe or jsdom.

## A-E-06 — partial

**Original requirement:** Reconcile original `E-06`: Define safe URL/protocol handling, image metadata/alt text, host upload callbacks, file validation, cancellation, and object-URL cleanup. Shared saved/pasted link policy and activation: [partial contract](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial). Saved image sources and upload-result retry: [partial image contract](react-aria-editor-section.md#image-source-policy-e-06e-07-partial); [upload lifetime matrix](react-aria-editor-section.md#host-upload-lifetime-e-06-partial) covers stale results after cancellation/reset/read-only/unmount; [file presentation validation](react-aria-editor-dialogs.md#file-presentation-validation-e-06-partial) covers empty files and MIME/extension metadata; wider image/upload acceptance remains open. Historical status: open.

Owned destination/image-source policies, metadata/alt preservation, File callback, MIME/extension/nonempty validation, upload retry, cancellation invalidation and exact object-URL lifetime are implemented and tested. Standalone ImageUploadModal can satisfy its named row while broader byte/size/dimension/authorization policy, host network abort/asset cleanup and complete upload race/trust acceptance remain outside those UI tests.

**Concrete evidence:** `packages/ui/src/components/LinkUrlModal/linkUrlPolicy.ts`; `packages/ui/src/components/ImageUploadModal/ImageUploadModal.tsx`; `packages/ui/src/components/PageRichTextEditorSection/EditorUploadLifetime.next100-regression.test.tsx`; `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.dialogs.test.tsx`; `packages/ui/src/components/PageRichTextEditorSection/lexical/imageSourcePolicy.ts`; `packages/ui/tests/browser/editor-upload-lifecycle.spec.ts`; `packages/ui/tests/browser/editor-image-lifecycle.spec.ts`; `docs/developer/react-aria-editor-dialogs.md`; `docs/developer/react-aria-editor-section.md`.

**Required successors:**

- **W03-E06-HOST:** Document and obtain owner acceptance for host upload byte/type/size/dimension/asset authorization, network abort semantics and cleanup of host-created stale assets. Preserve File callback and UI-only cancellation ownership. Evidence: Host adapter/service policy with tested rejection/cleanup outcomes; no credentials or real service changes are authorized by this report.
- **W03-E06-MATRIX:** Reconcile remaining upload/URL paths using trust matrix: malformed encoded sources/redirect ownership, description/metadata fidelity, retry and late result after each termination. Add only gaps beyond retained lifecycle cases. Evidence: Named source/host/promise ownership, exact output/error/insert count and released URL owner per missing case; physical-device/AT evidence remains distinct.

## A-E-07 — partial

**Original requirement:** Reconcile original `E-07`: Review rich-content rendering and trust boundaries; do not render arbitrary HTML or unsafe links merely because they arrived in a presentation model. Saved/pasted link destinations are governed by the [owned policy](react-aria-editor-section.md#link-destination-policy-e-06e-07-partial), and image decoration by the [image source policy](react-aria-editor-section.md#image-source-policy-e-06e-07-partial); broader rich-content acceptance remains open. Historical status: open.

This report supplies a concrete trust-boundary review: no arbitrary HTML insertion in the owned ImageNode decorator; saved/pasted links are normalized to safe browser destinations, invalid images do not request resources, and JSON keeps original data. Lexical imports author-supplied styles and serialized content; syntactic URI validation is neither a sanitizer nor authorization/redirect policy. There is no complete approved untrusted-document/style policy.

**Concrete evidence:** `packages/ui/src/components/PageRichTextEditorSection/lexical/ImageNode.tsx`; `packages/ui/src/components/PageRichTextEditorSection/lexical/OwnedLinkNode.ts`; `packages/ui/src/components/PageRichTextEditorSection/lexical/OwnedLinkActivationPlugin.tsx`; `packages/ui/src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.ts`; `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx`; `packages/ui/tests/browser/editor-links.spec.ts`; `packages/ui/tests/browser/editor-image-sources.spec.ts`; `docs/developer/react-aria-editor-section.md`.

**Required successors:**

- **W03-E07-TRUST:** Approve a rich-document trust policy for imported/pasted author CSS, malformed/unregistered node/version data, data/blob/remote image requests and downstream JSON renderers; convert the trust matrix into bounded rejection/fidelity fixtures. Evidence: Owner decision states allowed/rejected/preserved fields and host CSP/authorization/redirect responsibilities. Browser evidence demonstrates inert hostile markup/styles/URLs per approved policy without corrupting saved metadata; do not silently broaden current URL policy.

## A-E-08 — partial

**Original requirement:** Reconcile original `E-08`: Put editor-only dependencies behind a granular import boundary and assess whether separate packages are required to avoid mandatory installation weight. Historical status: open.

Granular editor entry exists and earlier packed fixtures reject Lexical traversal from representative basic imports. The manifest still installs lexical and @lexical/* as direct dependencies for every consumer; a code graph boundary does not avoid installation weight. The existing package acceptance document explicitly leaves the package/dependency design decision open.

**Concrete evidence:** `packages/ui/package.json`; `packages/ui/scripts/test-foundation-consumer.mjs`; `packages/ui/scripts/test-editor-consumer.mjs`; `docs/developer/react-aria-package-acceptance.md`; `docs/developer/parallel-batch-01/packaging.md`.

**Required successors:**

- **W03-E08-DESIGN:** Obtain an explicit owner decision: separate optional editor package/entry dependency scheme, or accept the single package installation cost with measured justification. Retain granular core/editor SSR/client contracts. Evidence: Decision compares packed/install dependency graph and bytes for core and editor; then implementation/export/dependency changes with focused packed core/editor tests. No install/rebuild was authorized for this wave.

## A-E-09 — complete

**Original requirement:** Reconcile original `E-09`: Put learner/instructor cards, course grids, activity mappings, and admin/instructor presets in a documented learning extension boundary without copying app screens. Historical status: open.

The documented specialist learning boundary is a set of presentation compositions, models and host adapters: course cards, LearnerClassesDataGrid, activity helpers and admin/instructor preset factories. Granular card/grid paths and icon helper paths exist; no host screen/API/session dependency is introduced. docs/migration.md and component architecture document provenance, Course naming and Class compatibility. This leaf requires a documented module boundary, not a newly separated npm package (that decision remains E-08/R).

**Concrete evidence:** `docs/developer/component-architecture.md`; `docs/migration.md`; `docs/developer/react-aria-card-frames.md`; `docs/developer/react-aria-grid-presets.md`; `docs/developer/react-aria-catalog-grid.md`; `packages/ui/src/models.ts`; `packages/ui/src/components/AdminDataGridOptions.ts`; `packages/ui/src/components/InstructorDataGridOptions.ts`; `packages/ui/src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.tsx`; `packages/ui/src/components/LearnerClassCard/LearnerClassCard.test.tsx`; `packages/ui/package.json`; `docs/developer/final-acceptance/parallel-06/results.json`.

No required successor within this named leaf. Related broader gates and the common attribution limits remain in force.

## A-E-10 — complete

**Original requirement:** Reconcile original `E-10`: Keep generic layout/controls independent of course-specific models; document naming compatibility and module migration. Historical status: open.

Generic foundation/layout/control code has no course-model dependency in the reused FA-02 reference inventory and resolved parallel-02 graph. The sole candidate in the unfiltered inventory is a source-context native fixture composing ClassCardFrame, not production code. Four current picker/TextArea changes were checked at their import boundaries and contain no domain dependency. Models remain host presentation records; existing Class exports and Course factory naming/migration are documented. No runtime or future cycle-enforcement promise is inferred.

**Concrete evidence:** `docs/developer/component-architecture.md`; `docs/migration.md`; `docs/developer/react-aria-grid-presets.md`; `packages/ui/src/models.ts`; `docs/developer/final-acceptance/parallel-02/graph-evidence.json`; `docs/developer/final-acceptance/parallel-06/results.json`; `packages/ui/src/experimental/TextArea/TextArea.tsx`; `packages/ui/src/experimental/PeriodPicker/PeriodPicker.tsx`; `packages/ui/src/experimental/DateTimeRangePicker/DateTimeRangePicker.tsx`; `packages/ui/src/experimental/DateRangeComparisonPicker/DateRangeComparisonPicker.tsx`.

No required successor within this named leaf. Related broader gates and the common attribution limits remain in force.

## Checks actually performed and limits

Read every original leaf, its source/contracts/test assertions and retained F/T/V case mappings; compare focused hashes with FA-02 and the saved parallel-02 graph; inspect current changed import boundaries; check raw artifact availability; validate one result record per ID and all cited source paths. No implementation defect newly confirmed. No unit/browser/native/consumer/CI suite, install or shared build ran. No real upload service, release action or server was touched.

The 17 partial records retain explicit operator/owner/evidence deliverables. No legal or security approval follows from source inspection. Read-only review cannot replace actual IME, OS color picker, physical-device, spoken AT or untrusted-content acceptance. Later source/fixture/token/dependency changes invalidate only their relevant conclusions; use the saved hashes and scoped successors before rerunning anything.
