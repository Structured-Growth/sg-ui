# Wave 03-23: editor chrome and selection successors

Prepared one ready-to-apply patch with **four target files, two native hosts and six focused browser cases**. All four original A leaves remain **partial**. This wave adds executable acceptance work; it does not close runtime acceptance before integration. No production library source, central ledger, generated fixture registry, manifest or other owner's files were changed.

## Delivered implementation

[acceptance-successors.patch](acceptance-successors.patch) appends two exports to existing manifest-listed docs-owned fixture modules and adds two browser specs. [proposed-files](proposed-files) mirrors the four final targets. This avoids a manifest edit and preserves all existing fixtures/assertions.

- `ContentEditorChrome.fixture.tsx`: `AcceptanceComposition` composes public DocumentEditorLayout, ContentEditorChrome, DocumentEditorToolbar, AppModal, Button and Typography within production theme/density scopes. It provides long English/Arabic title/status/save/menu/heading/optional-action labels, a host-owned independent scroll pane, stateful draft/heading/pressed/zoom values, optional slot replacement, and pending/unavailable host transitions. Alt+1 replaces slots; Alt+2/3/4 requests pending/unavailable/editable state without moving native focus. A chrome action opens a genuine owned host dialog, including a pending primary action.
- `PageRichTextEditorSection.paragraph-transactions.fixture.tsx`: `SelectionAcceptance` reuses the accepted two-paragraph seed, retaining distinct rich text styles. Alt+1 makes the editor read-only, Alt+2 replaces its document key, and Alt+3 unmounts it. The native shortcuts bubble from dialogs; tests never click inert background controls or inject Lexical/DOM selections.
- `wave03-editor-chrome-acceptance.spec.ts`: three cases cover eight theme/density/English-or-Arabic 320px presentations with per-part geometry/screenshots; retained draft/focused scroll owner/scroll position through slot removal and readdition plus deferred heading return focus; and pending/unavailable command suppression with pressed-state retention, usable zoom and final dialog return focus.
- `wave03-editor-selection-acceptance.spec.ts`: three cases cover six deliberately selected Cancel/Escape rows across Link/Image/Columns Layout and caret/same-node/cross-node ranges; successful Link Apply for all three shapes while retaining exact target text, paragraph boundaries and rich runs; and pending draft invalidation by read-only/document replacement/unmount. Native pointer/keyboard selection follows the existing paragraph/mixed-range drivers. Selection access only observes endpoints, never repairs them.

The tests retain exact pre/post serialized documents, endpoints/focus observations, engine version and geometry attachments where relevant. Successful image/columns insertion at noncollapsed ranges and late asynchronous upload delivery are not silently inferred from dismissal tests.

## Validation and reuse

Read root AGENTS.md, final-acceptance guidance, this assignment, prior wave-02-03 report/results/command matrix and coordinator-integration evidence. [evidence.json](evidence.json) records HEAD/branch/runtime, 96 inspected input hashes and four patch base/proposed hashes. **All 94 overlapping prior editor inputs are byte-identical.** This includes all three assigned chrome implementation/test/CSS families and the editor section implementation. The earlier component F/T case mappings and accepted baseline/native receipts are retained with their original runtime, host, build and source limits. The coordinator integration input snapshot has no overlapping keys for these selected editor inputs; that snapshot is not substituted for the explicit wave-02 comparison.

Read-only command from repository root:

```sh
node docs/developer/final-acceptance/wave-03-23/check-proposals.mjs
```

[static-validation.txt](static-validation.txt): TypeScript 5.9.3, Node **26.5.0**, both fixture overlays and both browser spec overlays pass with **zero proposal and dependency diagnostics**. The checker overlays proposed contents at their actual destination paths without copying them into shared source or emitting files. This is static verification against current public declarations, not a supported Node22/24 unit result or native behavior result. The initial checker used repository-root implicit type lookup and could not locate workspace `@types/node`; [the failure](static-validation-first-failure.txt) is preserved. Correcting the checker workspace directory resolved it without dependency changes or suppressed diagnostics.

`git apply --check docs/developer/final-acceptance/wave-03-23/acceptance-successors.patch` passes (exit 0, empty [transcript](patch-check.txt)). The patch was not applied. No standalone validation host was running; only protected user server3000 was observed. It was not used or modified. No install, shared build, server startup or browser run occurred. Exact coordinator integration/build/native commands and expected assertions are in [validation-plan.json](validation-plan.json). Fixtures typecheck now; browser expectations and screenshots still require execution/review.

## A-M-21 — partial

Original: **Reconcile DocumentEditorLayout final acceptance: Tokenized menu/toolbar/content layout and scroll boundaries. Link its `F-C21`, `T-C21` and `V-C21` evidence and any unresolved defects.**

Retain `F-C21` and `T-C21` mappings in [next100-c21](../../parallel-next100/next100-c21.md), [editor layout contract](../../react-aria-editor-layout.md), existing `DocumentEditorLayout` unit suites and `inventory-layout-replacement.spec.ts`. Those inspected inputs are unchanged. The new composition and first two chrome cases directly implement W03-C21-V's missing long chrome/theme/density/RTL and host scroll/focus replacement checks.

Residual: integrate/build/run all engines, review screenshots/RTL reading order and geometry; reconcile V-C21-04/05 separately without auto-closing their checklist. No newly confirmed production defect. Patch integration still required.

## A-M-22 — partial

Original: **Reconcile DocumentEditorToolbar final acceptance: Owned buttons/menus/toggles, formatting state, responsive overflow. Link its `F-C22`, `T-C22` and `V-C22` evidence and any unresolved defects.**

Retain `F-C22` and `T-C22` mappings in [next100-c22](../../parallel-next100/next100-c22.md), existing toolbar heading-lifetime/next100/unit cases and `inventory-editor-chrome.spec.ts`. Prior evidence already covers the exact deferred owner-replacement/cancellation behavior; it is not retested with artificial delays. New cases expose long heading and optional action translations, all optional groups, pressed/disabled/zoom presentation and native heading commit/focus in the composed host.

Residual: execute/review the new native cases, confirm any reflow failures, preserve the original enlarged-text/native-tab evidence limits; V-C22-04/05 remain independent. No actual browser zoom or AT claim. Patch integration still required.

## A-M-23 — partial

Original: **Reconcile ContentEditorChrome final acceptance: Menu composition, editor focus, disabled/loading actions, semantic structure. Link its `F-C23`, `T-C23` and `V-C23` evidence and any unresolved defects.**

Retain `F-C23`/`T-C23` mappings in [next100-c23](../../parallel-next100/next100-c23.md), chrome unit/next100 suites and the existing native host-composition spec. New cases add long title/status/save/menu content, Arabic named groups/logical order, a genuine host-dialog anchor flow, and host pending action replacement while dialog focus remains active. Pending/unavailable states retain pressed value while zoom remains usable.

Residual: native execution, screenshot review and Arabic label/order inspection; V-C23-04/05 remain separate. A disabled pending trigger cannot be assumed to receive restored focus, so the test checks final return only after editing is restored and the trigger is enabled. Patch integration still required.

## A-E-03 — partial

Original: **Reconcile original `E-03`: Replace editor toolbars, menus, modals, palettes and selection overlays with owned controls while preserving selection across commands and modal dismissal. Historical status: open.**

Retain owned implementation boundaries and existing formatting/dialog, insertion-menu, link-modal and floating-selection evidence identified in [the prior command matrix](../wave-02-03/command-and-trust-matrix.md). Source-level selection/toolbar/dialog inputs overlap with the 94 unchanged hashes. Do not equate standalone host-link-modal success with the integrated Lexical editor; the new tests use the actual public PageRichTextEditorSection.

Prepared exact remaining rows: Link caret Cancel; Link cross-node Escape; Image same-node Cancel/cross-node Escape; Columns caret Escape/same-node Cancel. Each asserts no JSON edit, exact native range endpoints/text and command-owner return focus. Link Apply covers caret insertion, same-node formatting retention and cross-paragraph rich-run preservation. Read-only, document-key replacement and unmount dismiss their pending modal drafts without a new edit after frame delivery.

Residual: execute the proposed assertions and resolve any demonstrated faults; selected-range successful image/columns insertion still needs reconciliation against accepted cases. Existing late-upload lifecycle evidence is separately reusable only after its own input comparison. The new tests do not execute pending asynchronous upload completion, all palette/style commands, all undo/history permutations, physical devices or AT. Patch integration still required. Broader command/style successors assigned elsewhere and the twenty editor V leaves are unchanged.
