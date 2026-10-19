# Editor chrome and floating selection acceptance

Reconciled on 2026-10-17 against development baseline
`6c485ed79d0d6a521d188e5bde8315722296f518`. This record recommends closure of
A-M-21, A-M-22, A-M-23 and A-M-25 within their original component obligations.
The coordinator owns acceptance checklist changes. No production release approval
or completion of broader editor/device/assistive-technology obligations follows.

The [wave-04 receipt](final-acceptance/wave-04/01/results.json) records the exact
original obligations, source/evidence hashes, prior successors and disposition.
Its [input evidence](final-acceptance/wave-04/01/evidence.json) compares the accepted
HB-19/HB-20 inputs with current source. Historical host evidence retains its
original limits. New documentation does not require repeating accepted browser work.

## A-M-21 — DocumentEditorLayout

F-C21 is retained complete from the [owned implementation record](archive/2026-10-18-task-lists/react-aria-progress.md#editor-layout-and-floating-selection)
and the [prior reconciliation](final-acceptance/wave-02-03/report.md).
T-C21's exact unit cases are mapped in [next100-c21](parallel-next100/next100-c21.md).
The current [layout tests](../../packages/ui/src/components/DocumentEditorLayout/DocumentEditorLayout.test.tsx)
assert ordered header/menu/toolbar/content, native refs and title semantics,
keyboard reachability and live child retention through slot replacement.
The [layout CSS](../../packages/ui/src/components/DocumentEditorLayout/DocumentEditorLayout.module.css)
uses owned component color aliases and zero minimum flex dimensions; the host
owns the content overflow region.

[HB-19](final-acceptance/editor-chrome-presentation/results.json) resolves
W03-C21-V and V-C21-04/05. Its three named cases per desktop engine in
[the chrome spec](../../packages/ui/tests/browser/wave03-editor-chrome-acceptance.spec.ts)
cover long labels at 320px in both themes/densities and English/Arabic RTL,
retained host draft/node/focus/scroll through chrome removal and readdition,
and live action availability. Twenty-four screenshots were reviewed in the
accepted receipt. No unresolved defect within this obligation is identified.

## A-M-22 — DocumentEditorToolbar

F-C22 is retained complete from the same implementation/prior reconciliation.
[T-C22](parallel-next100/next100-c22.md) maps controlled heading/pressed actions,
translated native controls, unavailable/read-only behavior with usable zoom,
and deferred heading cancellation/current-owner delivery. The current
[heading lifetime suite](../../packages/ui/src/components/DocumentEditorToolbar/DocumentEditorToolbar.heading-lifetime.test.tsx)
preserves suspended-render and unmount ownership assertions.

HB-19 resolves W03-C22-V and V-C22-04/05 with localized heading and bold
commands, optional-group reflow, final host focus, pressed-state retention and
pending/unavailable chrome replacement. The toolbar itself has no loading prop;
pending presentation belongs to the composed host actions. Alignment and custom
component controls remain documented disabled placeholders, not supported
commands awaiting acceptance. No unresolved defect within the shipped contract
is identified.

## A-M-23 — ContentEditorChrome

F-C23 is retained complete. [T-C23](parallel-next100/next100-c23.md) maps native
anchor handoff, exactly one pointer/Enter/Space activation without form submit,
controlled title commit/focus, empty-group omission, loading/disabled suppression,
anchor retention and sibling isolation. The [current tests](../../packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.test.tsx)
retain those assertions. The host owns editor selection and menu/dialog state;
`onPress(anchor)` supplies its native button anchor.

HB-19 resolves W03-C23-V and V-C23-04/05 through real host-dialog composition,
localized direction/named groups/order, long title/status/action reflow and
pending replacement followed by enabled-trigger focus return. A disabled trigger
is not promised return focus while unavailable. No unresolved component defect
is identified.

## A-M-25 — FloatingTextSelectionToolbar

F-C25 is retained complete. [T-C25](parallel-next100/next100-c25.md) maps real
Lexical commands, saved ranges, Alt+F10/Tab/Enter/Space/Escape, collapse/offscreen
hiding, read-only/unmount cancellation and sibling isolation. Its old native
boundary hold was superseded by the [docs-host execution receipt](archive/2026-10-18-task-lists/backlog-execution-2026-10-15.md).
Current [unit tests](../../packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.test.tsx)
also assert exact selected formatting scope, observer disconnect and multi-line
visible-fragment anchoring. Synthetic unit geometry remains explicitly jsdom evidence.

[HB-20](final-acceptance/rich-editor-presentation/results.json) resolves W03-C25-V
and V-C25-04/05. BUG-0013 is fixed: a range whose first line is offscreen anchors
to a later visible selected rectangle. The bounded 360px/150%-text
English/Arabic matrix passed all 24 engine configurations; its 48 Chromium
captures were reviewed. This is text scaling, not actual browser zoom.
The [four selection-boundary cases](../../packages/ui/tests/browser/inventory-selection-boundary.spec.ts)
passed in all engines: nested scrolling/collision, focused-action viewport resize
and formatting, fully offscreen dismissal with preserved host scrolling, and
replacement targeting only new nodes. The retained 18-pass receipt also includes
six editor-focus presentation passes; do not count all 18 as boundary cases.

The [ordinary editing successors](../../packages/ui/tests/browser/editor-selection-editing-successors.spec.ts)
were integrated and passed in all engines in the
[wave-03 native follow-up](final-acceptance/wave-03-followup/native-final.log).
Those six named passes establish Escape-to-typing and read-only invalidation;
the aggregate report retains its unrelated unsupported touch skip and follow-up
correction. HB-20 subsequently revalidates the changed floating source through
its unit/matrix/boundary evidence. No unresolved defect within this obligation
is identified. Shared Menu's WebKit observer defect is separately fixed and
covered by HB-20's 33 tab/overflow passes.

## Reuse boundaries

The current shared fixture has a concurrent change only in the unrelated
ImageSources upload retry scenario. Its accepted HB-20 localized-presentation
region and module imports remain byte-identical; the committed full fixture hash
matches HB-20. The wave-04 diff and region hash retain this qualification rather
than claiming the whole working file is unchanged. No new upload acceptance
follows from that comparison.

No new native/unit/build execution or screenshot review occurred during this
reconciliation. HB-19/HB-20 receipts are the accepted runtime/review records;
exact browser version strings are not reproduced in their compact JSON receipts.
The text/keyboard/DOM evidence does not establish spoken screen-reader output.
Physical touch, configured OS IME, clipboard/device behavior, broader editor
commands/document compatibility, installed-consumer matrices, legal/owner and
production gates retain their separate obligations. The six deferred future
items stay outside these component closure recommendations.
