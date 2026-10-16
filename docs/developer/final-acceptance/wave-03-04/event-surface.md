# Scoped action-surface reconciliation

Current source inspected under `packages/ui/src`. This extends the accepted
fix-02 guidance; it does not repeat that patch or rename historical callbacks.
Exact input hashes are in input-hashes.json and supplemental-hashes.json.

| Public surface | Contract and implementation path |
| --- | --- |
| Button, experimental Button alias, IconButton | Parameterless onPress. IconButton delegates to Button. Ordinary action uses normalized press; submit/reset use guarded click capture before the native default. Pending reset changes native type to button. Existing Button tests cover exact-once/default ordering and pending transitions. |
| ToggleButton | Parameterless onPress plus boolean onSelectedChange, each once. Found upstream PressEvent leaked at runtime through direct callback forwarding. actions.patch wraps onPress, retaining selection behavior. Relative selection/press order is intentionally not specified. |
| ToggleButtonGroup | Owns string-ID onSelectionChange; no public onPress, native click or event payload. Child selection drives the group. |
| DataGridDragHandle | Parameterless onPress; native onKeyDown is an intentional keyboard escape hatch for reorder. Found same upstream PressEvent leak. actions.patch wraps only onPress, preserving slot, style, ref and keyboard handlers. |
| SplitAction | Primary onPress delegates to Button; secondary onAction receives menu item ID. Pending/disabled blocks both. |
| AppModalAction | onPress delegates to Button; host controls async pending/errors and open state. |
| ContentEditorChromeMenuItem | onPress(anchor: HTMLButtonElement) explicitly derives native anchor from ref. Existing test verifies pointer/Enter/Space once with same anchor and no submit. New private native scenario checks that exception. |
| AppPageHeaderMenuItem | Legacy parameterless onClick is invoked from Menu onAction with no event; label does not imply native MouseEvent. |
| DocumentEditorToolbar.actions | Legacy parameterless onClick callbacks delegate to Button.onPress; preserve names for compatibility. |
| OwnedGridAction | onPress(row) is a composed row payload, supplied by the renderer; no upstream event payload. |
| TextStyleMenuControl | Private TextStyleAction.onPress is parameterless and invoked as an editor command; not an additional public Button event. |
| SGLink/styled Link/custom Link | Native cancellable onClick(event), followed by eligible navigation. Do not bind a second business action to press. Custom host links own native modifiers/targets/downloads/cancellation and ref forwarding. Retain fix-02 and separate routing acceptance evidence. |
| Native HTML props on primitives, fields and containers | Explicit native event escape hatches retain DOM event meanings; field onChange/value callbacks and menu onAction are not additional activation callbacks. No broad replacement of native callbacks is proposed. |

A type `() => void` alone does not discard runtime arguments in JavaScript.
The two direct upstream forwarders were therefore concrete owned-contract gaps,
even though typical host callbacks ignore the event. Proposed wrappers discard
upstream arguments at the boundary without adding callbacks or new public APIs.
No public declaration shape changes. Physical touch/AT acceptance remains separate
from the prepared desktop and emulated-touch spec.
