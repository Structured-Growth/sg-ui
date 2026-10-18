# X08 operation mapping

Original families are retained from wave-02-09 operator-cases.md and the X08-RESIZE/RANGE/INVENTORY successors, reconciled with wave-04/11 A-X-08. Additional active sort-priority and shelf-resize families are included. No fresh pass is claimed for retained grid/page evidence.

## Grid row reorder (DataGrid/AppDataGrid/AppDataGridRowDnd)

Keyboard: Owned Move up/down buttons activate with Enter/Space; React Aria also retains keyboard drag/drop.

Single pointer: Click the same Move up/down buttons; shared host reorder request, boundaries/pending/read-only guards.

Evidence: Retained reorder.spec.ts, batch01-grid-reorder.spec.ts, inventory-pointer-reorder-invalidation.spec.ts; wave-04/11 report preserves dated evidence. No new run claimed.

## Column width (both grid renderers)

Keyboard: ColumnResizer keyboard path plus keyboard-operable width entry/Apply and one-pixel controls.

Single pointer: GridColumnWidthControl width action with Narrower/Wider by one pixel; same bounded/flexible width core and complete width snapshot callback.

Evidence: Already reconciled in wave-04/11 A-X-08 row: both width step controls and complete-snapshot/focus assertions exist. acceptance-touch-targets.spec.ts retains width-action assertions. Reused accepted evidence, no new grid matrix.

## Grid column order

Keyboard: Keyboard-activate DataToolbarColumnsMenu Move up/down.

Single pointer: Click those same actions; reordered records preserve existing locking/actions-last host normalization. This menu does not add another drag interaction.

Evidence: Historical operator-cases.md row retained; current handler moveColumn verified, no new drag path or test pass invented.

## Page reorder (ExperiencePageNavigator)

Keyboard: Menu navigation/Enter activates Move up/down.

Single pointer: Click per-page Move up/down; both call the same onReorderPages(sourceKey,targetKey) adapter as native row drop.

Evidence: Retained page-navigator-native-transactions.spec.ts covers accepted/rejected host order and read-only boundaries; historical wave-02-09 operator table retained.

## Sort priority (additional owned drag inventory)

Keyboard: Activate Move sort rule up/down buttons.

Single pointer: Click the same buttons next to pointer drag handle; both invoke moveRule with draft IDs.

Evidence: Current shared moveRule source and retained batch06-grid-sort.spec.ts; no extra run.

## Complete calendar range movement/end/start resizing

Keyboard: Retained Shift+Left/Right moves; Alt+Left/Right resizes end, Alt+Shift resizes start. Date-cell owner guard retained.

Single pointer: Inline Adjust dates operation + target day in existing calendar (including month jumps), or selected-operation one-day controls. Same resolveRangeDrag/validation/edit; bounded coupling, required hidden fields and rejected host wires preserved. Fixed range retains existing one-click relocation.

Evidence: Three focused calendar unit cases plus 18 retained gesture cases; three-engine calendar case passed in shared-native-01, unchanged component/fixture/spec hashes reconciled to final admission. No extra popup; Escape dismisses containing picker.

## Editor table cell rectangle drag selection

Keyboard: Lexical table keyboard selection/Shift+arrow handling retained; owned action remains keyboard-activatable.

Single pointer: Select table cells then two ordinary same-table clicks; public Lexical rectangle solver, actual editor-root focus and Escape cancellation. Attached below-root TableNodes discovered; nested-editor ownership guard retained.

Evidence: Two root/quote unit cases with actual keyboard input; initial three native Escape failures retained; editor-native-03 three engines passed after concrete focus fix.

## Optional IconPanelNavigation panel resize (additional owned drag inventory)

Keyboard: Separator Left/Right, Shift step, Home/End and Escape rollback retained.

Single pointer: Inline one-pixel Narrower/Wider outside separator; same measured geometry clamp, per-item width retention and callback. Effective-limit disabled states; default resizable=false adds no UI.

Evidence: Existing resize unit expanded in place; three-engine shelf native case passed in shared-native-01, unchanged source/fixture hashes reconciled. LTR/start and RTL/end measured in that case.

## Editor image/table resizing, custom block drag and host extensions

Keyboard: Not an enabled shipped owned operation; no substitute feature is invented.

Single pointer: No owned image/table resize handles or custom block-drag plugin are registered. Image dimensions and table colWidths are serialized presentation metadata. ColumnsLayoutModal inserts an ordinary TableNode. Browser-native text/image selection/drag remains browser-owned.

Evidence: Fixed shipped plugin/node registry and public host callbacks audited. This does not certify arbitrary separately authored consumer editors/plugins. Active shipped TablePlugin drag selection is addressed in its own row, not dismissed as inactive.

