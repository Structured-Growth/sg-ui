# Pending operator and presentation validation

No operator outcome is recorded by this file. Record actual device/OS/browser/IME/AT versions, operator, locale, timestamp, source/build hashes, callback JSON and observations before marking any row passed. A Playwright `keyboard.type`, `insertText`, `CompositionEvent`, `isComposing` flag, DOM label assertion or axe report cannot supply OS IME or spoken AT evidence.

## W03-E05-IME

Use the existing docs-owned fixtures on the coordinator's validated host. Keep live API callbacks observed through the fixture's saved output; do not substitute a callback inside production code.

| Row | Starting host and operation | Required observation |
| --- | --- | --- |
| IME-content-confirm | `editors-pagerichtexteditorsection--saved-rich-document`: caret after `Edit this ending`; use the OS Japanese IME to compose `にほんご`, open conversion candidates and choose `日本語`, then press conversion-confirming Enter | No editor paragraph split during confirmation; one final committed string at caret, no duplicate or lost characters; saved JSON contains the committed text; ordinary Enter afterward performs the normal paragraph operation. Record actual interim callbacks instead of assuming all engines defer them. |
| IME-content-cancel | In a fresh document compose the same phonetic input; cancel conversion with Escape using the named IME's native sequence | Record the IME's defined cancellation result, candidate dismissal, caret and exact JSON; the floating toolbar must not consume Escape intended for the active composition. |
| IME-history-paste | After committed composition, undo/redo with the OS shortcut, then copy/paste real composed text into the editor | Record text, caret and saved JSON before/after each operation; no duplicate commit or stuck selected range; reload the fixture from its saved callback JSON and compare. |
| IME-title | `editors-editabletitlefield--default`: activate Edit title; compose/convert text in Document title | Conversion Enter must not prematurely invoke title persistence or exit edit mode. After composition ends, an ordinary Enter may commit exactly once. Re-enter, compose and Escape; record cancellation behavior and callback count. |
| IME-color | `editors-textcolorpickercontrol--default`: open Text color, focus Hex color; compose text and confirm conversion with Enter | No color callback while confirming composition. After composition ends, invalid text must show the existing validation error without committing; replacing it with `#336699` and ordinary Enter commits once. This is independent of native OS color chooser acceptance. |
| IME-transition | In editor composition use the fixture's Make read-only action; repeat with document replacement through Reload saved document | Record whether the platform commits/cancels composition on blur before the host transition. After read-only/replacement, no stale callback may change the new document and no floating action may remain reachable for stale selection. Re-enable editing and type normally. |

Run at least one configured real IME; Japanese is a concrete proposed protocol, not a new platform support promise. If another supported Chinese/Korean IME is used, record its candidate/confirmation/cancellation sequence and chosen text rather than claiming the Japanese sequence passed.

## W03-E05-DEVICE-AT

On a named physical device, copy rich/plain text into/out of `editors-pagerichtexteditorsection--clipboard-editing`, then select/copy while read-only. Preserve text/format evidence and actual permission failures. Record browser and physical clipboard path. Desktop browser-emulated mobile context is insufficient.

With the named screen reader active, traverse content, select words using the platform editing commands, reach selection formatting with Alt+F10 where supported, inspect Bold's announced name/state, traverse actions, activate and Escape back. Record exact spoken output and focus destination. Check normal arrows, Home/End, Delete/Backspace, Enter, selection shortcuts, undo/redo and copy/paste in the editor. In read-only mode confirm selection/copy remains available and editing actions cannot change the saved JSON. Treat unsupported platform shortcut differences as recorded findings.

## W03-C25-V / W03-C34-V

Use `editors-floatingtextselectiontoolbar--nested-host-boundary` for native range geometry and `editors-pagerichtexteditorsection--saved-rich-document` for the full rich composition. Retain existing `inventory-selection-boundary.spec.ts` coverage rather than repeating scroll cleanup as new acceptance. Run the proposed `editor-selection-editing-successors.spec.ts` after integration for the two missing state transitions.

For the remaining presentation pair, review 320px-wide light/compact and dark/comfortable hosts and a wide host; then Arabic translated labels in RTL (record actual translation adapter and strings). These fixtures do not currently expose every matrix axis: coordinator must prepare host Provider density/direction/translation overrides using shipped public APIs before treating results as that configuration. Browser viewport resize alone does not establish density, translation or RTL.

Capture native selection and toolbar rectangles, viewport and scroll-boundary rectangles before/after Alt+F10, Escape, inner/outer scroll and resize. Toolbar actions must stay within the visible boundary, wrapping without clipping focused buttons; selection stays attached to its native text and dismissed actions are absent from keyboard access. In the rich editor inspect table horizontal overflow, scroll owner, long controls, saved styles and content. Save and visually review screenshots, and record translated accessible names/order independently of spoken AT. A screenshot file without review is pending evidence.
