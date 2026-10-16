# Wave 03-24 — real formatting transactions

Prepared a four-file integration patch, `command-transactions.patch`, with production fixes, a 20-case real Lexical composed suite, two focused native browser cases and contract documentation. **All six assigned original A leaves remain partial.** The proposed implementation passes 20/20 composed cases; the unchanged implementation fails 12 targeted assertions. This validates the owned proposal, not integration or native acceptance. No central checklist/count, shared source, generated output, server or Git state was modified.

## Concrete changes

`PageRichTextEditorSection.impl.tsx`:

- Case conversion previously transformed each entire selected TextNode, including characters outside partial-run boundaries. The proposal extracts/splits selected runs first, ignores collapsed selections and updates the selected endpoint when Unicode conversion expands its length (`ß` → `SS`). Text formats/styles survive case conversion.
- Clear Formatting previously restyled the whole containing run, even at a caret. The proposal clears only extracted selected runs. At a caret it resets selection format/style for future typing without changing existing content. It avoids creating empty CSS declarations after clearing.
- The alignment trigger previously started at Left Align even for a loaded right-aligned paragraph, and remained at the last requested value after Undo/Redo. The internal Lexical bridge now derives its value from the selected block on updates. The standalone menu's controlled API is unchanged.

The new composed test invokes the real public toolbar and menus, real ExperienceEditorPlugins, real history and serialization. Its only substitutions capture the editor and omit floating geometry in jsdom; commands/callbacks, interaction controls, selection, plugins and history are not mocked. Nine formatting cases cover lowercase/uppercase/capitalize, strike/sub/superscript, highlight, clear and inline code. Two color cases verify foreground/background hex and Clear affect only selected characters, preserve other styles, Undo/Redo and reload. Six alignment cases verify physical/logical values, adjacent paragraph preservation and active trigger through Undo/Redo; all reload exact saved JSON. Three boundary cases cover expanding Unicode and collapsed case/clear. Style/color history checks assert the latest controlled callback receives the exact saved JSON; stale callbacks are not invoked after replacement. Highlight preserves selected extent but Lexical normalizes its direction forward; no backwards-direction guarantee is asserted for that existing engine operation.

The native spec reuses the existing docs-owned public `MixedRunHistory` host; no new registry or manifest is needed. Keyboard input establishes partial-run selection, activates Uppercase/Clear, observes exact saved characters and editor return focus, and checks Undo/Redo/new-key reload. It is prepared and syntax-checked, **not executed**.

## Evidence and commands

Runtime: macOS arm64, Node **24.21.0**, React **19.2.3**, Lexical **0.41.0**, Vitest **4.1.11**, jsdom **26.1.0**, TypeScript **5.9.3**. `unit-execution.json` records the exact executable and argument arrays; the outer lease invocation is in `validation-plan.json` and `run-validation.mjs`. No install, package build, fixture build or browser server was run.

1. Read the existing `/tmp/sgui-calendar-validate.mjs` admission helper. Occupied lease attempts are preserved in `proposed-unit.log`, `proposed-unit-03.log` and `proposed-unit-04.log`; no lease was reclaimed or bypassed. The first admitted run exposed an owned config JSX issue (`proposed-unit-02.log`), corrected with automatic JSX. The next exposed two test expectations, preserved in `proposed-unit-05.log`: the accessible action is **Inline code**, and Lexical highlight preserves the range while normalizing direction. Corrected tests retain exact text/style/format and history assertions.
2. `python3 docs/developer/final-acceptance/wave-03-24/prepare-runtime.py` generates owned copies with relative imports resolved back to their real source locations, plus an alias for the proposed/baseline implementation. The test's editor-capture mock resolves to the real plugin module in both variants. The owned `node_modules` symlink supplies existing dependencies without installation.
3. Leased `<Node24> docs/developer/final-acceptance/wave-03-24/run-validation.mjs`: final proposed run **20 passed**, 3.87 seconds, `proposed-unit-final.log`. Baseline selected subset **12 failed / 1 passed / 7 skipped**, 8.29 seconds, `baseline-unit-final.log`. Six failures discriminate partial-run/caret/Unicode defects; six discriminate the initial alignment trigger defect. Baseline alignment cases intentionally fail before their later command assertions. The lowercase selected subset is the one baseline pass because surrounding text was already lowercase; the remaining seven were intentionally excluded from the baseline subset.
4. `<Node24> docs/developer/final-acceptance/wave-03-24/static-check.mjs`: all three proposed TypeScript/TSX files transpile without diagnostics (`static-check.json`). This is syntax validation, not a full typecheck.
5. `git apply --check docs/developer/final-acceptance/wave-03-24/command-transactions.patch`: passed against the current dirty checkout; no apply occurred.

`evidence.json` hashes source, proposals, runtime copies, commands, logs and prior receipts. **All 71 compared editor/control/contract/assertion inputs match wave-02-03. All 121 compared built library/private fixture outputs match coordinator-integration.** Existing accepted results are retained under their original engine/host/time limits. Unchanged built output contains none of this proposal; it is not patch validation. Prior report/results hashes are checked separately against assignment.json.

## Per-original-leaf disposition

### A-M-26 — partial

Original: Reconcile RichTextFormattingToolbar final acceptance: All formatting actions, mixed/active/disabled state, Lexical commands. Link its F-C26, T-C26 and V-C26 evidence and any unresolved defects.

Retain F-C26 and T-C26 from `parallel-next100/next100-c26.md` and the unchanged wave-02-03 report/results; standalone callback/disabled/mixed presentation evidence remains valid. The proposal adds exact real inline/style/color transaction/history/reload results and latest host callback coverage, without claiming a new mixed-state host API. Integrate the patch and rerun affected suites. V-C26-04/05 long-content, density/theme and translated RTL native presentation remain open; full consumer command combinations stay under A-E-04.

### A-M-27 — partial

Original: Reconcile InsertContentMenuControl final acceptance: Menu commands and insertion focus, disabled actions and announcements. Link its F-C27, T-C27 and V-C27 evidence and any unresolved defects.

Retain F-C27/T-C27 from `parallel-next100/next100-c27.md`, existing `NativeInsertionHost.test.tsx`, `batch62-insert-menu-native-focus.spec.ts` and the accepted docs-host receipt named by wave-02-03. Existing image/rule/columns callbacks, disabled actions and host dialog focus have unchanged inputs. Existing real twoEqual insertion/edit/history/reload remains in `PageRichTextEditorSection.table-history.test.tsx` and `inventory-editor-table-history.spec.ts`. No duplicate command-mock test or insertion source patch is proposed. V-C27-04/05 still needs long translated labels, narrow themes/densities, RTL, one named successful insertion result announcement and editor/dialog return focus in the composed native host. Announcements belong to that host.

### A-M-28 — partial

Original: Reconcile TextAlignMenuControl final acceptance: Alignment/indent commands, active state, direction-aware presentation. Link its F-C28, T-C28 and V-C28 evidence and any unresolved defects.

Retain F-C28/T-C28 from `parallel-next100/next100-c28.md` and `inventory-align-direction.spec.ts`; retain Center/Indent/Outdent native paragraph history from `editor-paragraph-transactions.spec.ts`. New six-case proposal executes left/center/right/justify/start/end through the menu into exact Lexical paragraph JSON, preserves adjacent blocks/text/styles/selection, and proves Undo/Redo plus saved reload. The proposed alignment bridge fixes the reproduced loaded/undo active-trigger defect. Integration, affected-suite rerun and native verification are pending. V-C28-04/05 still requires translated long labels/icons, both themes/densities, RTL, checked choice and native focus/disabled indent/outdent review.

### A-M-29 — partial

Original: Reconcile TextColorPickerControl final acceptance: Foreground/background modes, clear/reset, swatches and accessible color control. Link its F-C29, T-C29 and V-C29 evidence and any unresolved defects.

Retain F-C29/T-C29 from `parallel-next100/next100-c29.md` and `batch63-color-menu-native-transactions.spec.ts` for hex/reset/swatches and callback/draft behavior. New real composed foreground/background cases verify partial-run CSS commit/removal, other styles/characters unchanged, controlled saved callback, both history transitions and new-key reload. Integration rerun remains pending. V-C29-04/05 presentation/RTL and the separately named actual OS chooser keyboard/spoken-AT operator record remain open; jsdom/input changes do not satisfy them.

### A-M-30 — partial

Original: Reconcile TextStyleMenuControl final acceptance: Style/typeface options, tokenized labels, selection and focus behavior. Link its F-C30, T-C30 and V-C30 evidence and any unresolved defects.

Retain F-C30/T-C30 from `parallel-next100/next100-c30.md` and `batch64-style-menu-native-selection.spec.ts`. Typeface remains on RichTextFormattingToolbar; this control has eight style callbacks, as already approved. All eight now have real composed selected-character/history/reload cases in the proposal; case/clear range defects are reproduced against baseline and fixed in the owned implementation. Native range/focus regression spec is ready. Integrate and execute it; V-C30-04/05 long translated labels/case glyphs, densities/themes and RTL remain open.

### A-E-04 — partial

Original: Reconcile original E-04: Cover undo/redo, links, lists, code, tables, alignment, indentation, colors, and inline formatting that current consumers use. Historical status: open.

Reuse unchanged rich-link edit/unlink/dialog cases, ordered-list insertion/removal, rich-document native list continuation, twoEqual selected-cell history/reload, paragraph indent/outdent, mixed Bold/Italic/Underline history and their previously accepted receipts. The proposal fills named inline-code/style/color/six-alignment transaction gaps with exact JSON/text/style before/after, selection and saved reload. Case transformations preserve backwards selection; highlight's existing forward normalization is explicit. It does not claim block-code transform, nested-list, merged/header/cross-cell table, every mixed-selection combination, OS chooser or current-consumer inventory approval. Obtain the actual supported consumer list/code/table combinations before adding missing cases; integrate and validate these named new cases first.

## Handoff

`validation-plan.json` contains exact integrated unit, type, fresh fixture-build and three-engine native commands and expected assertions. `proposed-files` mirrors all four intended destinations. Do not copy `runtime`, logs, configs or the dependency symlink into production. Apply/rebase only the unified patch after comparing input hashes. No assigned A leaf is recommended closed before integration and its remaining native/operator evidence; no broad suite, release or acceptance-count update is requested.
