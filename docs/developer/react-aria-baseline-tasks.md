# Functionality baseline: detailed checklist

Priority: P1 — first. Reconcile existing functionality evidence and fill actual gaps within this phase. Finish the required all-component baseline before scheduling expanded regression or hardening work.

This is a baseline backlog, not a claim that these implementations are absent. For each checkbox, inspect the current source and linked execution evidence. Accept an existing result when sufficient; implement only the missing slice. Do not rebuild migrated components or rerun a broad matrix to count progress.

Each behavior is independently checkable. `F-*` owns functionality; the matching `T-*` owns expanded regression coverage. Baseline component completion requires its feature items, public wiring/story item, and minimal smoke item. It does not require its later `T-*` or `V-*` items.

Use 1–3 meaningful colocated smoke cases per interaction component or changed composition in total: renders its named primary state, primary interaction calls the owned callback, and one critical disabled/dismissal/invalid guard if needed. Reuse existing passing cases. Feature checkboxes do not each require another smoke test. Presentation-only utilities need a render/import check as appropriate.

Every item inherits the owned API, compiled CSS, production scope, host adapter, and export requirements from the master list. A checkbox needs a source path/commit or accepted existing record, observed result, and known limits in the execution record.

## C01: AppButton

Scope: [src/components/AppButton](../../src/components/AppButton). Original scope: `M-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C01-01 Confirm or complete AppButton: owned onPress and native button type.
- [ ] F-C01-02 Confirm or complete AppButton: variant tone and density mapping.
- [ ] F-C01-03 Confirm or complete AppButton: disabled and pending activation.
- [ ] F-C01-04 Confirm or complete AppButton: native ref className and style.
- [ ] F-C01-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AppButton; link any breaking mapping.
- [ ] F-C01-91 Accept or add the minimal smoke evidence for AppButton; record remaining bugs without making expanded coverage a baseline gate.

## C02: AppInlineProgress

Scope: [src/components/AppInlineProgress](../../src/components/AppInlineProgress). Original scope: `M-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C02-01 Confirm or complete AppInlineProgress: determinate percentage and finite fallback.
- [ ] F-C02-02 Confirm or complete AppInlineProgress: translated status label.
- [ ] F-C02-03 Confirm or complete AppInlineProgress: Owned barWidth and percentage label layout.
- [ ] F-C02-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AppInlineProgress; link any breaking mapping.
- [ ] F-C02-91 Accept or add the minimal smoke evidence for AppInlineProgress; record remaining bugs without making expanded coverage a baseline gate.

## C03: AppOperationSteps

Scope: [src/components/AppOperationSteps](../../src/components/AppOperationSteps). Original scope: `M-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C03-01 Confirm or complete AppOperationSteps: active completed and error step rendering.
- [ ] F-C03-02 Confirm or complete AppOperationSteps: ordered labels and status text.
- [ ] F-C03-03 Confirm or complete AppOperationSteps: single-step numbering suppression.
- [ ] F-C03-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AppOperationSteps; link any breaking mapping.
- [ ] F-C03-91 Accept or add the minimal smoke evidence for AppOperationSteps; record remaining bugs without making expanded coverage a baseline gate.

## C04: AppPageHeader

Scope: [src/components/AppPageHeader](../../src/components/AppPageHeader). Original scope: `M-04` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C04-01 Confirm or complete AppPageHeader: primary and subpage surface hierarchy.
- [ ] F-C04-02 Confirm or complete AppPageHeader: breadcrumb navigation through owned links.
- [ ] F-C04-03 Confirm or complete AppPageHeader: left split actions and right actions.
- [ ] F-C04-04 Confirm or complete AppPageHeader: metadata and title wrapping.
- [ ] F-C04-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AppPageHeader; link any breaking mapping.
- [ ] F-C04-91 Accept or add the minimal smoke evidence for AppPageHeader; record remaining bugs without making expanded coverage a baseline gate.

## C05: AppPageTabs

Scope: [src/components/AppPageTabs](../../src/components/AppPageTabs). Original scope: `M-05` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C05-01 Confirm or complete AppPageTabs: tab and panel association.
- [ ] F-C05-02 Confirm or complete AppPageTabs: controlled selection callback.
- [ ] F-C05-03 Confirm or complete AppPageTabs: disabled tabs and arrow activation.
- [ ] F-C05-04 Confirm or complete AppPageTabs: overflow strip with visible active tab.
- [ ] F-C05-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AppPageTabs; link any breaking mapping.
- [ ] F-C05-91 Accept or add the minimal smoke evidence for AppPageTabs; record remaining bugs without making expanded coverage a baseline gate.

## C06: AppShell

Scope: [src/components/AppShell](../../src/components/AppShell). Original scope: `M-06` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C06-01 Confirm or complete AppShell: main and navigation landmarks.
- [ ] F-C06-02 Confirm or complete AppShell: responsive navigation presentation.
- [ ] F-C06-03 Confirm or complete AppShell: host content and header slots.
- [ ] F-C06-04 Confirm or complete AppShell: owned scope propagation.
- [ ] F-C06-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AppShell; link any breaking mapping.
- [ ] F-C06-91 Accept or add the minimal smoke evidence for AppShell; record remaining bugs without making expanded coverage a baseline gate.

## C07: AuthShell

Scope: [src/components/AuthShell](../../src/components/AuthShell). Original scope: `M-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C07-01 Confirm or complete AuthShell: presentation-only authentication layout.
- [ ] F-C07-02 Confirm or complete AuthShell: content and branding slots.
- [ ] F-C07-03 Confirm or complete AuthShell: small-container content sizing.
- [ ] F-C07-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AuthShell; link any breaking mapping.
- [ ] F-C07-91 Accept or add the minimal smoke evidence for AuthShell; record remaining bugs without making expanded coverage a baseline gate.

## C08: AppModal

Scope: [src/components/AppModal](../../src/components/AppModal). Original scope: `M-08` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C08-01 Confirm or complete AppModal: owned size title description and parts.
- [ ] F-C08-02 Confirm or complete AppModal: open close and dismissal reasons.
- [ ] F-C08-03 Confirm or complete AppModal: primary secondary and pending actions.
- [ ] F-C08-04 Confirm or complete AppModal: sticky tabs with scrollable body.
- [ ] F-C08-05 Confirm or complete AppModal: multi-step labels and single-step suppression.
- [ ] F-C08-06 Confirm or complete AppModal: initial focus and trigger return.
- [ ] F-C08-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AppModal; link any breaking mapping.
- [ ] F-C08-91 Accept or add the minimal smoke evidence for AppModal; record remaining bugs without making expanded coverage a baseline gate.

## C09: SideNavigation

Scope: [src/components/SideNavigation](../../src/components/SideNavigation). Original scope: `M-09` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C09-01 Confirm or complete SideNavigation: pathname selected navigation item.
- [ ] F-C09-02 Confirm or complete SideNavigation: child expansion and collapsed navigation.
- [ ] F-C09-03 Confirm or complete SideNavigation: router adapter activation.
- [ ] F-C09-04 Confirm or complete SideNavigation: organization action callback.
- [ ] F-C09-05 Confirm or complete SideNavigation: logout action callback.
- [ ] F-C09-06 Confirm or complete SideNavigation: pending and error account presentation.
- [ ] F-C09-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for SideNavigation; link any breaking mapping.
- [ ] F-C09-91 Accept or add the minimal smoke evidence for SideNavigation; record remaining bugs without making expanded coverage a baseline gate.

## C10: ExperiencePageNavigator

Scope: [src/components/ExperiencePageNavigator](../../src/components/ExperiencePageNavigator). Original scope: `M-10` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C10-01 Confirm or complete ExperiencePageNavigator: previous and next callbacks.
- [ ] F-C10-02 Confirm or complete ExperiencePageNavigator: first and last disabled boundaries.
- [ ] F-C10-03 Confirm or complete ExperiencePageNavigator: link versus action rendering.
- [ ] F-C10-04 Confirm or complete ExperiencePageNavigator: translated destination labels.
- [ ] F-C10-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for ExperiencePageNavigator; link any breaking mapping.
- [ ] F-C10-91 Accept or add the minimal smoke evidence for ExperiencePageNavigator; record remaining bugs without making expanded coverage a baseline gate.

## C11: CardCollectionWithFooter

Scope: [src/components/CardCollectionWithFooter](../../src/components/CardCollectionWithFooter). Original scope: `M-11` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C11-01 Confirm or complete CardCollectionWithFooter: stable item keys and card rendering.
- [ ] F-C11-02 Confirm or complete CardCollectionWithFooter: responsive collection layout.
- [ ] F-C11-03 Confirm or complete CardCollectionWithFooter: empty and loading presentation.
- [ ] F-C11-04 Confirm or complete CardCollectionWithFooter: shared pagination footer state.
- [ ] F-C11-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for CardCollectionWithFooter; link any breaking mapping.
- [ ] F-C11-91 Accept or add the minimal smoke evidence for CardCollectionWithFooter; record remaining bugs without making expanded coverage a baseline gate.

## C12: CardPaginationFooter

Scope: [src/components/CardPaginationFooter](../../src/components/CardPaginationFooter). Original scope: `M-12` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C12-01 Confirm or complete CardPaginationFooter: appPaginationFooter preserved export.
- [ ] F-C12-02 Confirm or complete CardPaginationFooter: page and page-size callbacks.
- [ ] F-C12-03 Confirm or complete CardPaginationFooter: known and unknown totals.
- [ ] F-C12-04 Confirm or complete CardPaginationFooter: page-zero request before size change.
- [ ] F-C12-05 Confirm or complete CardPaginationFooter: first and last boundary disabling.
- [ ] F-C12-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for CardPaginationFooter; link any breaking mapping.
- [ ] F-C12-91 Accept or add the minimal smoke evidence for CardPaginationFooter; record remaining bugs without making expanded coverage a baseline gate.

## C13: ClassCardFrame

Scope: [src/components/ClassCardFrame](../../src/components/ClassCardFrame). Original scope: `M-13` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C13-01 Confirm or complete ClassCardFrame: owned frame surface and spacing.
- [ ] F-C13-02 Confirm or complete ClassCardFrame: image and content slots.
- [ ] F-C13-03 Confirm or complete ClassCardFrame: responsive frame width.
- [ ] F-C13-04 Confirm or complete ClassCardFrame: native styling slots.
- [ ] F-C13-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for ClassCardFrame; link any breaking mapping.
- [ ] F-C13-91 Accept or add the minimal smoke evidence for ClassCardFrame; record remaining bugs without making expanded coverage a baseline gate.

## C14: InstructorClassCard

Scope: [src/components/InstructorClassCard](../../src/components/InstructorClassCard). Original scope: `M-14` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C14-01 Confirm or complete InstructorClassCard: course status and metadata.
- [ ] F-C14-02 Confirm or complete InstructorClassCard: menu actions with host callbacks.
- [ ] F-C14-03 Confirm or complete InstructorClassCard: date and icon fallback.
- [ ] F-C14-04 Confirm or complete InstructorClassCard: long title and description presentation.
- [ ] F-C14-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for InstructorClassCard; link any breaking mapping.
- [ ] F-C14-91 Accept or add the minimal smoke evidence for InstructorClassCard; record remaining bugs without making expanded coverage a baseline gate.

## C15: LearnerClassCard

Scope: [src/components/LearnerClassCard](../../src/components/LearnerClassCard). Original scope: `M-15` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C15-01 Confirm or complete LearnerClassCard: progress and completion presentation.
- [ ] F-C15-02 Confirm or complete LearnerClassCard: due-date and status labels.
- [ ] F-C15-03 Confirm or complete LearnerClassCard: owned link and action regions.
- [ ] F-C15-04 Confirm or complete LearnerClassCard: translated empty metadata.
- [ ] F-C15-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for LearnerClassCard; link any breaking mapping.
- [ ] F-C15-91 Accept or add the minimal smoke evidence for LearnerClassCard; record remaining bugs without making expanded coverage a baseline gate.

## C16: AppDataGrid

Scope: [src/components/AppDataGrid](../../src/components/AppDataGrid). Original scope: `M-16 G-04–G-16 G-21 G-22` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C16-01 Confirm or complete AppDataGrid: owned row and column IDs with generics.
- [ ] F-C16-02 Confirm or complete AppDataGrid: filter-before-sort-before-page processing.
- [ ] F-C16-03 Confirm or complete AppDataGrid: controlled client and server state.
- [ ] F-C16-04 Confirm or complete AppDataGrid: row checkboxes and selected count.
- [ ] F-C16-05 Confirm or complete AppDataGrid: visibility locks and last action column.
- [ ] F-C16-06 Confirm or complete AppDataGrid: owned cell renderer dispatch.
- [ ] F-C16-07 Confirm or complete AppDataGrid: loading empty no-results and error parts.
- [ ] F-C16-08 Confirm or complete AppDataGrid: width resizing and ordered columns.
- [ ] F-C16-09 Confirm or complete AppDataGrid: opt-in persistence and complete reset snapshot.
- [ ] F-C16-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AppDataGrid; link any breaking mapping.
- [ ] F-C16-91 Accept or add the minimal smoke evidence for AppDataGrid; record remaining bugs without making expanded coverage a baseline gate.

## C17: AppDataGridShell

Scope: [src/components/AppDataGridShell](../../src/components/AppDataGridShell). Original scope: `M-17 H-17` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C17-01 Confirm or complete AppDataGridShell: one shared grid and card state owner.
- [ ] F-C17-02 Confirm or complete AppDataGridShell: search and toolbar integration.
- [ ] F-C17-03 Confirm or complete AppDataGridShell: filter and page-size page reset.
- [ ] F-C17-04 Confirm or complete AppDataGridShell: grid and card switching.
- [ ] F-C17-05 Confirm or complete AppDataGridShell: footer and pending error integration.
- [ ] F-C17-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AppDataGridShell; link any breaking mapping.
- [ ] F-C17-91 Accept or add the minimal smoke evidence for AppDataGridShell; record remaining bugs without making expanded coverage a baseline gate.

## C18: AppDataGridRowDnd

Scope: [src/components/AppDataGridRowDnd](../../src/components/AppDataGridRowDnd). Original scope: `M-18 G-17 G-18 G-28` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C18-01 Confirm or complete AppDataGridRowDnd: complete single-page reorder eligibility.
- [ ] F-C18-02 Confirm or complete AppDataGridRowDnd: pointer handle and owned drag preview.
- [ ] F-C18-03 Confirm or complete AppDataGridRowDnd: keyboard Move alternative.
- [ ] F-C18-04 Confirm or complete AppDataGridRowDnd: cancel and source-focus return.
- [ ] F-C18-05 Confirm or complete AppDataGridRowDnd: host reorder request and rollback boundary.
- [ ] F-C18-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AppDataGridRowDnd; link any breaking mapping.
- [ ] F-C18-91 Accept or add the minimal smoke evidence for AppDataGridRowDnd; record remaining bugs without making expanded coverage a baseline gate.

## C19: LearnerClassesDataGrid

Scope: [src/components/LearnerClassesDataGrid](../../src/components/LearnerClassesDataGrid). Original scope: `M-19` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C19-01 Confirm or complete LearnerClassesDataGrid: owned learner presentation model.
- [ ] F-C19-02 Confirm or complete LearnerClassesDataGrid: date link and status columns.
- [ ] F-C19-03 Confirm or complete LearnerClassesDataGrid: host row and action callbacks.
- [ ] F-C19-04 Confirm or complete LearnerClassesDataGrid: shared filtering selection and pagination.
- [ ] F-C19-05 Confirm or complete LearnerClassesDataGrid: public LearnerClassesDataGridProps export.
- [ ] F-C19-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for LearnerClassesDataGrid; link any breaking mapping.
- [ ] F-C19-91 Accept or add the minimal smoke evidence for LearnerClassesDataGrid; record remaining bugs without making expanded coverage a baseline gate.

## C20: DataToolbar

Scope: [src/components/DataToolbar](../../src/components/DataToolbar). Original scope: `M-20 G-08–G-11` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C20-01 Confirm or complete DataToolbar: search and refresh callbacks.
- [ ] F-C20-02 Confirm or complete DataToolbar: selected count and selected actions.
- [ ] F-C20-03 Confirm or complete DataToolbar: sort draft apply and clear.
- [ ] F-C20-04 Confirm or complete DataToolbar: filter draft apply cancel and All semantics.
- [ ] F-C20-05 Confirm or complete DataToolbar: columns visibility locks and order.
- [ ] F-C20-06 Confirm or complete DataToolbar: grid and card view callback.
- [ ] F-C20-07 Confirm or complete DataToolbar: neutral outlined split actions.
- [ ] F-C20-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for DataToolbar; link any breaking mapping.
- [ ] F-C20-91 Accept or add the minimal smoke evidence for DataToolbar; record remaining bugs without making expanded coverage a baseline gate.

## C21: DocumentEditorLayout

Scope: [src/components/DocumentEditorLayout](../../src/components/DocumentEditorLayout). Original scope: `M-21` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C21-01 Confirm or complete DocumentEditorLayout: toolbar content and menu slots.
- [ ] F-C21-02 Confirm or complete DocumentEditorLayout: host-owned scrolling boundary.
- [ ] F-C21-03 Confirm or complete DocumentEditorLayout: native status styles and refs.
- [ ] F-C21-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for DocumentEditorLayout; link any breaking mapping.
- [ ] F-C21-91 Accept or add the minimal smoke evidence for DocumentEditorLayout; record remaining bugs without making expanded coverage a baseline gate.

## C22: DocumentEditorToolbar

Scope: [src/components/DocumentEditorToolbar](../../src/components/DocumentEditorToolbar). Original scope: `M-22` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C22-01 Confirm or complete DocumentEditorToolbar: owned actions and menu triggers.
- [ ] F-C22-02 Confirm or complete DocumentEditorToolbar: controlled active formatting state.
- [ ] F-C22-03 Confirm or complete DocumentEditorToolbar: disabled and pending actions.
- [ ] F-C22-04 Confirm or complete DocumentEditorToolbar: narrow toolbar overflow.
- [ ] F-C22-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for DocumentEditorToolbar; link any breaking mapping.
- [ ] F-C22-91 Accept or add the minimal smoke evidence for DocumentEditorToolbar; record remaining bugs without making expanded coverage a baseline gate.

## C23: ContentEditorChrome

Scope: [src/components/ContentEditorChrome](../../src/components/ContentEditorChrome). Original scope: `M-23` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C23-01 Confirm or complete ContentEditorChrome: editor menu and toolbar composition.
- [ ] F-C23-02 Confirm or complete ContentEditorChrome: selection preparation before actions.
- [ ] F-C23-03 Confirm or complete ContentEditorChrome: host onPress anchor callbacks.
- [ ] F-C23-04 Confirm or complete ContentEditorChrome: loading and disabled chrome.
- [ ] F-C23-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for ContentEditorChrome; link any breaking mapping.
- [ ] F-C23-91 Accept or add the minimal smoke evidence for ContentEditorChrome; record remaining bugs without making expanded coverage a baseline gate.

## C24: EditableTitleField

Scope: [src/components/EditableTitleField](../../src/components/EditableTitleField). Original scope: `M-24` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C24-01 Confirm or complete EditableTitleField: controlled draft and committed title.
- [ ] F-C24-02 Confirm or complete EditableTitleField: enter commit and Escape cancel.
- [ ] F-C24-03 Confirm or complete EditableTitleField: blur commit callback.
- [ ] F-C24-04 Confirm or complete EditableTitleField: validation and read-only presentation.
- [ ] F-C24-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for EditableTitleField; link any breaking mapping.
- [ ] F-C24-91 Accept or add the minimal smoke evidence for EditableTitleField; record remaining bugs without making expanded coverage a baseline gate.

## C25: FloatingTextSelectionToolbar

Scope: [src/components/FloatingTextSelectionToolbar](../../src/components/FloatingTextSelectionToolbar). Original scope: `M-25` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C25-01 Confirm or complete FloatingTextSelectionToolbar: selection-based toolbar visibility.
- [ ] F-C25-02 Confirm or complete FloatingTextSelectionToolbar: owned selection anchor placement.
- [ ] F-C25-03 Confirm or complete FloatingTextSelectionToolbar: selection preserved on action press.
- [ ] F-C25-04 Confirm or complete FloatingTextSelectionToolbar: keyboard toolbar access.
- [ ] F-C25-05 Confirm or complete FloatingTextSelectionToolbar: overlay cleanup on selection loss.
- [ ] F-C25-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for FloatingTextSelectionToolbar; link any breaking mapping.
- [ ] F-C25-91 Accept or add the minimal smoke evidence for FloatingTextSelectionToolbar; record remaining bugs without making expanded coverage a baseline gate.

## C26: RichTextFormattingToolbar

Scope: [src/components/RichTextFormattingToolbar](../../src/components/RichTextFormattingToolbar). Original scope: `M-26 E-04` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C26-01 Confirm or complete RichTextFormattingToolbar: named inline formatting callbacks.
- [ ] F-C26-02 Confirm or complete RichTextFormattingToolbar: controlled active and mixed states.
- [ ] F-C26-03 Confirm or complete RichTextFormattingToolbar: undo and redo callback availability.
- [ ] F-C26-04 Confirm or complete RichTextFormattingToolbar: selection preparation before command.
- [ ] F-C26-05 Confirm or complete RichTextFormattingToolbar: unavailable commands disabled.
- [ ] F-C26-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for RichTextFormattingToolbar; link any breaking mapping.
- [ ] F-C26-91 Accept or add the minimal smoke evidence for RichTextFormattingToolbar; record remaining bugs without making expanded coverage a baseline gate.

## C27: InsertContentMenuControl

Scope: [src/components/InsertContentMenuControl](../../src/components/InsertContentMenuControl). Original scope: `M-27` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C27-01 Confirm or complete InsertContentMenuControl: insert image columns and rule actions.
- [ ] F-C27-02 Confirm or complete InsertContentMenuControl: unavailable insertion actions disabled.
- [ ] F-C27-03 Confirm or complete InsertContentMenuControl: selection preparation and command focus.
- [ ] F-C27-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for InsertContentMenuControl; link any breaking mapping.
- [ ] F-C27-91 Accept or add the minimal smoke evidence for InsertContentMenuControl; record remaining bugs without making expanded coverage a baseline gate.

## C28: TextAlignMenuControl

Scope: [src/components/TextAlignMenuControl](../../src/components/TextAlignMenuControl). Original scope: `M-28` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C28-01 Confirm or complete TextAlignMenuControl: alignment actions and active state.
- [ ] F-C28-02 Confirm or complete TextAlignMenuControl: indent and outdent callbacks.
- [ ] F-C28-03 Confirm or complete TextAlignMenuControl: direction-aware labels and icons.
- [ ] F-C28-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for TextAlignMenuControl; link any breaking mapping.
- [ ] F-C28-91 Accept or add the minimal smoke evidence for TextAlignMenuControl; record remaining bugs without making expanded coverage a baseline gate.

## C29: TextColorPickerControl

Scope: [src/components/TextColorPickerControl](../../src/components/TextColorPickerControl). Original scope: `M-29` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C29-01 Confirm or complete TextColorPickerControl: foreground and background mode.
- [ ] F-C29-02 Confirm or complete TextColorPickerControl: semantic preset swatches.
- [ ] F-C29-03 Confirm or complete TextColorPickerControl: clear and reset callbacks.
- [ ] F-C29-04 Confirm or complete TextColorPickerControl: accessible selected-color labeling.
- [ ] F-C29-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for TextColorPickerControl; link any breaking mapping.
- [ ] F-C29-91 Accept or add the minimal smoke evidence for TextColorPickerControl; record remaining bugs without making expanded coverage a baseline gate.

## C30: TextStyleMenuControl

Scope: [src/components/TextStyleMenuControl](../../src/components/TextStyleMenuControl). Original scope: `M-30` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C30-01 Confirm or complete TextStyleMenuControl: style and typeface options.
- [ ] F-C30-02 Confirm or complete TextStyleMenuControl: controlled selected formatting style.
- [ ] F-C30-03 Confirm or complete TextStyleMenuControl: tokenized option typography.
- [ ] F-C30-04 Confirm or complete TextStyleMenuControl: selection and focus callback integration.
- [ ] F-C30-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for TextStyleMenuControl; link any breaking mapping.
- [ ] F-C30-91 Accept or add the minimal smoke evidence for TextStyleMenuControl; record remaining bugs without making expanded coverage a baseline gate.

## C31: ColumnsLayoutModal

Scope: [src/components/ColumnsLayoutModal](../../src/components/ColumnsLayoutModal). Original scope: `M-31 E-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C31-01 Confirm or complete ColumnsLayoutModal: layout preset selection.
- [ ] F-C31-02 Confirm or complete ColumnsLayoutModal: draft reset on reopen.
- [ ] F-C31-03 Confirm or complete ColumnsLayoutModal: apply committed layout callback.
- [ ] F-C31-04 Confirm or complete ColumnsLayoutModal: cancel without commit.
- [ ] F-C31-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for ColumnsLayoutModal; link any breaking mapping.
- [ ] F-C31-91 Accept or add the minimal smoke evidence for ColumnsLayoutModal; record remaining bugs without making expanded coverage a baseline gate.

## C32: ImageUploadModal

Scope: [src/components/ImageUploadModal](../../src/components/ImageUploadModal). Original scope: `M-32 E-06` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C32-01 Confirm or complete ImageUploadModal: picker and drop file selection.
- [ ] F-C32-02 Confirm or complete ImageUploadModal: nonempty file and MIME extension presentation checks.
- [ ] F-C32-03 Confirm or complete ImageUploadModal: preview and description draft.
- [ ] F-C32-04 Confirm or complete ImageUploadModal: host upload pending error and retry.
- [ ] F-C32-05 Confirm or complete ImageUploadModal: cancellation invalidates late results.
- [ ] F-C32-06 Confirm or complete ImageUploadModal: clean reopen and preview release.
- [ ] F-C32-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for ImageUploadModal; link any breaking mapping.
- [ ] F-C32-91 Accept or add the minimal smoke evidence for ImageUploadModal; record remaining bugs without making expanded coverage a baseline gate.

## C33: LinkUrlModal

Scope: [src/components/LinkUrlModal](../../src/components/LinkUrlModal). Original scope: `M-33 E-06 E-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C33-01 Confirm or complete LinkUrlModal: shared owned destination validation.
- [ ] F-C33-02 Confirm or complete LinkUrlModal: Display-text and URL-or-null submit payload.
- [ ] F-C33-03 Confirm or complete LinkUrlModal: apply and Cancel draft behavior.
- [ ] F-C33-04 Confirm or complete LinkUrlModal: Configurable protocol and relative-path options.
- [ ] F-C33-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for LinkUrlModal; link any breaking mapping.
- [ ] F-C33-91 Accept or add the minimal smoke evidence for LinkUrlModal; record remaining bugs without making expanded coverage a baseline gate.

## C34: PageRichTextEditorSection

Scope: [src/components/PageRichTextEditorSection](../../src/components/PageRichTextEditorSection). Original scope: `M-34 E-01–E-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C34-01 Confirm or complete PageRichTextEditorSection: owned Lexical configuration and saved nodes.
- [ ] F-C34-02 Confirm or complete PageRichTextEditorSection: document serialization preserving host data.
- [ ] F-C34-03 Confirm or complete PageRichTextEditorSection: live read-only state and keyboard focus.
- [ ] F-C34-04 Confirm or complete PageRichTextEditorSection: editorKey document replacement.
- [ ] F-C34-05 Confirm or complete PageRichTextEditorSection: formatting-preserving link edit.
- [ ] F-C34-06 Confirm or complete PageRichTextEditorSection: image source rejection placeholder.
- [ ] F-C34-07 Confirm or complete PageRichTextEditorSection: local object URL document lifetime.
- [ ] F-C34-08 Confirm or complete PageRichTextEditorSection: late host upload result invalidation.
- [ ] F-C34-09 Confirm or complete PageRichTextEditorSection: list and rule commands.
- [ ] F-C34-10 Confirm or complete PageRichTextEditorSection: scoped select-all and native copy.
- [ ] F-C34-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for PageRichTextEditorSection; link any breaking mapping.
- [ ] F-C34-91 Accept or add the minimal smoke evidence for PageRichTextEditorSection; record remaining bugs without making expanded coverage a baseline gate.

## C35: Typefaces

Scope: [src/components/Typefaces](../../src/components/Typefaces). Original scope: `M-35` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C35-01 Confirm or complete Typefaces: owned typography role catalog.
- [ ] F-C35-02 Confirm or complete Typefaces: bodyAlt2 compatibility role.
- [ ] F-C35-03 Confirm or complete Typefaces: semantic element and visual role independence.
- [ ] F-C35-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Typefaces; link any breaking mapping.
- [ ] F-C35-91 Accept or add the minimal smoke evidence for Typefaces; record remaining bugs without making expanded coverage a baseline gate.

## C36: icons

Scope: [src/components/icons](../../src/components/icons). Original scope: `M-36 I-01–I-08` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C36-01 Confirm or complete icons: public icon name mapping.
- [ ] F-C36-02 Confirm or complete icons: native size color style and ref contract.
- [ ] F-C36-03 Confirm or complete icons: decorative versus meaningful labeling.
- [ ] F-C36-04 Confirm or complete icons: known and unknown activity icon mapping.
- [ ] F-C36-05 Confirm or complete icons: individual icon import paths.
- [ ] F-C36-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for icons; link any breaking mapping.
- [ ] F-C36-91 Accept or add the minimal smoke evidence for icons; record remaining bugs without making expanded coverage a baseline gate.

## C37: primitives

Scope: [src/components/primitives](../../src/components/primitives). Original scope: `M-37 U-01–U-20` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-C37-01 Confirm or complete primitives: public owned primitive and alias mapping.
- [ ] F-C37-02 Confirm or complete primitives: owned props without upstream type leakage.
- [ ] F-C37-03 Confirm or complete primitives: documented removed primitive APIs.
- [ ] F-C37-04 Confirm or complete primitives: relative imports into owned implementations.
- [ ] F-C37-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for primitives; link any breaking mapping.
- [ ] F-C37-91 Accept or add the minimal smoke evidence for primitives; record remaining bugs without making expanded coverage a baseline gate.

## P01: Box

Scope: [src/experimental/Box](../../src/experimental/Box). Original scope: `U-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P01-01 Confirm or complete Box: native element and ref.
- [ ] F-P01-02 Confirm or complete Box: owned spacing and native style.
- [ ] F-P01-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Box; link any breaking mapping.
- [ ] F-P01-91 Accept or add the minimal smoke evidence for Box; record remaining bugs without making expanded coverage a baseline gate.

## P02: Stack

Scope: [src/experimental/Stack](../../src/experimental/Stack). Original scope: `U-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P02-01 Confirm or complete Stack: direction alignment and gap.
- [ ] F-P02-02 Confirm or complete Stack: wrapping and logical spacing.
- [ ] F-P02-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Stack; link any breaking mapping.
- [ ] F-P02-91 Accept or add the minimal smoke evidence for Stack; record remaining bugs without making expanded coverage a baseline gate.

## P03: Surface

Scope: [src/experimental/Surface](../../src/experimental/Surface). Original scope: `U-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P03-01 Confirm or complete Surface: surface and elevation tokens.
- [ ] F-P03-02 Confirm or complete Surface: native element and styling.
- [ ] F-P03-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Surface; link any breaking mapping.
- [ ] F-P03-91 Accept or add the minimal smoke evidence for Surface; record remaining bugs without making expanded coverage a baseline gate.

## P04: Card

Scope: [src/experimental/Card](../../src/experimental/Card). Original scope: `U-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P04-01 Confirm or complete Card: card and CardContent slots.
- [ ] F-P04-02 Confirm or complete Card: owned padding and surface.
- [ ] F-P04-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Card; link any breaking mapping.
- [ ] F-P04-91 Accept or add the minimal smoke evidence for Card; record remaining bugs without making expanded coverage a baseline gate.

## P05: Divider

Scope: [src/experimental/Divider](../../src/experimental/Divider). Original scope: `U-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P05-01 Confirm or complete Divider: horizontal and vertical separator.
- [ ] F-P05-02 Confirm or complete Divider: decorative versus semantic role.
- [ ] F-P05-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Divider; link any breaking mapping.
- [ ] F-P05-91 Accept or add the minimal smoke evidence for Divider; record remaining bugs without making expanded coverage a baseline gate.

## P06: Typography

Scope: [src/experimental/Typography](../../src/experimental/Typography). Original scope: `U-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P06-01 Confirm or complete Typography: semantic element selection.
- [ ] F-P06-02 Confirm or complete Typography: all owned roles including bodyAlt2.
- [ ] F-P06-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Typography; link any breaking mapping.
- [ ] F-P06-91 Accept or add the minimal smoke evidence for Typography; record remaining bugs without making expanded coverage a baseline gate.

## P07: Button

Scope: [src/experimental/Button](../../src/experimental/Button). Original scope: `U-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P07-01 Confirm or complete Button: press once and native submit type.
- [ ] F-P07-02 Confirm or complete Button: variant tone density and pending.
- [ ] F-P07-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Button; link any breaking mapping.
- [ ] F-P07-91 Accept or add the minimal smoke evidence for Button; record remaining bugs without making expanded coverage a baseline gate.

## P08: IconButton

Scope: [src/experimental/IconButton](../../src/experimental/IconButton). Original scope: `U-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P08-01 Confirm or complete IconButton: accessible name and icon rendering.
- [ ] F-P08-02 Confirm or complete IconButton: press disabled and pending.
- [ ] F-P08-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for IconButton; link any breaking mapping.
- [ ] F-P08-91 Accept or add the minimal smoke evidence for IconButton; record remaining bugs without making expanded coverage a baseline gate.

## P09: ButtonGroup

Scope: [src/experimental/ButtonGroup](../../src/experimental/ButtonGroup). Original scope: `U-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P09-01 Confirm or complete ButtonGroup: shared group border and divider.
- [ ] F-P09-02 Confirm or complete ButtonGroup: group density and action layout.
- [ ] F-P09-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for ButtonGroup; link any breaking mapping.
- [ ] F-P09-91 Accept or add the minimal smoke evidence for ButtonGroup; record remaining bugs without making expanded coverage a baseline gate.

## P10: SplitAction

Scope: [src/experimental/SplitAction](../../src/experimental/SplitAction). Original scope: `U-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P10-01 Confirm or complete SplitAction: primary callback and secondary menu.
- [ ] F-P10-02 Confirm or complete SplitAction: neutral shared-border presentation.
- [ ] F-P10-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for SplitAction; link any breaking mapping.
- [ ] F-P10-91 Accept or add the minimal smoke evidence for SplitAction; record remaining bugs without making expanded coverage a baseline gate.

## P11: TextField

Scope: [src/experimental/TextField](../../src/experimental/TextField). Original scope: `U-04 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P11-01 Confirm or complete TextField: controlled and default text value.
- [ ] F-P11-02 Confirm or complete TextField: label description and validation.
- [ ] F-P11-03 Confirm or complete TextField: native name value and reset.
- [ ] F-P11-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for TextField; link any breaking mapping.
- [ ] F-P11-91 Accept or add the minimal smoke evidence for TextField; record remaining bugs without making expanded coverage a baseline gate.

## P12: TextArea

Scope: [src/experimental/TextArea](../../src/experimental/TextArea). Original scope: `U-04 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P12-01 Confirm or complete TextArea: controlled and default multiline value.
- [ ] F-P12-02 Confirm or complete TextArea: label and validation association.
- [ ] F-P12-03 Confirm or complete TextArea: native reset and read-only behavior.
- [ ] F-P12-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for TextArea; link any breaking mapping.
- [ ] F-P12-91 Accept or add the minimal smoke evidence for TextArea; record remaining bugs without making expanded coverage a baseline gate.

## P13: Checkbox

Scope: [src/experimental/Checkbox](../../src/experimental/Checkbox). Original scope: `U-05 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P13-01 Confirm or complete Checkbox: controlled default and mixed state.
- [ ] F-P13-02 Confirm or complete Checkbox: space activation and disabled guard.
- [ ] F-P13-03 Confirm or complete Checkbox: native name value and reset.
- [ ] F-P13-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Checkbox; link any breaking mapping.
- [ ] F-P13-91 Accept or add the minimal smoke evidence for Checkbox; record remaining bugs without making expanded coverage a baseline gate.

## P14: Switch

Scope: [src/experimental/Switch](../../src/experimental/Switch). Original scope: `U-05 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P14-01 Confirm or complete Switch: controlled and default checked state.
- [ ] F-P14-02 Confirm or complete Switch: accessible switch labeling.
- [ ] F-P14-03 Confirm or complete Switch: native form value and reset.
- [ ] F-P14-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Switch; link any breaking mapping.
- [ ] F-P14-91 Accept or add the minimal smoke evidence for Switch; record remaining bugs without making expanded coverage a baseline gate.

## P15: RadioGroup

Scope: [src/experimental/RadioGroup](../../src/experimental/RadioGroup). Original scope: `U-05 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P15-01 Confirm or complete RadioGroup: owned string option identity.
- [ ] F-P15-02 Confirm or complete RadioGroup: arrow selection and disabled skipping.
- [ ] F-P15-03 Confirm or complete RadioGroup: native submitted value and reset.
- [ ] F-P15-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for RadioGroup; link any breaking mapping.
- [ ] F-P15-91 Accept or add the minimal smoke evidence for RadioGroup; record remaining bugs without making expanded coverage a baseline gate.

## P16: Select

Scope: [src/experimental/Select](../../src/experimental/Select). Original scope: `U-06 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P16-01 Confirm or complete Select: owned option IDs and controlled value.
- [ ] F-P16-02 Confirm or complete Select: selection and disabled options.
- [ ] F-P16-03 Confirm or complete Select: native serialization and reset.
- [ ] F-P16-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Select; link any breaking mapping.
- [ ] F-P16-91 Accept or add the minimal smoke evidence for Select; record remaining bugs without making expanded coverage a baseline gate.

## P17: ComboBox

Scope: [src/experimental/ComboBox](../../src/experimental/ComboBox). Original scope: `U-06 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P17-01 Confirm or complete ComboBox: query filtering and owned option IDs.
- [ ] F-P17-02 Confirm or complete ComboBox: keyboard selection and disabled options.
- [ ] F-P17-03 Confirm or complete ComboBox: empty and read-only presentation.
- [ ] F-P17-04 Confirm or complete ComboBox: native serialization and reset.
- [ ] F-P17-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for ComboBox; link any breaking mapping.
- [ ] F-P17-91 Accept or add the minimal smoke evidence for ComboBox; record remaining bugs without making expanded coverage a baseline gate.

## P18: AsyncMultiSelect

Scope: [src/experimental/AsyncMultiSelect](../../src/experimental/AsyncMultiSelect). Original scope: `U-06 H-05` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P18-01 Confirm or complete AsyncMultiSelect: host query and result callback.
- [ ] F-P18-02 Confirm or complete AsyncMultiSelect: multiple selected IDs outside results.
- [ ] F-P18-03 Confirm or complete AsyncMultiSelect: loading error retry and empty states.
- [ ] F-P18-04 Confirm or complete AsyncMultiSelect: cancel and reject stale query results.
- [ ] F-P18-05 Confirm or complete AsyncMultiSelect: remove token and retain usable focus.
- [ ] F-P18-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AsyncMultiSelect; link any breaking mapping.
- [ ] F-P18-91 Accept or add the minimal smoke evidence for AsyncMultiSelect; record remaining bugs without making expanded coverage a baseline gate.

## P19: Menu

Scope: [src/experimental/Menu](../../src/experimental/Menu). Original scope: `U-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P19-01 Confirm or complete Menu: owned item actions and checked state.
- [ ] F-P19-02 Confirm or complete Menu: keyboard navigation and disabled skipping.
- [ ] F-P19-03 Confirm or complete Menu: compact menu and close callback.
- [ ] F-P19-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Menu; link any breaking mapping.
- [ ] F-P19-91 Accept or add the minimal smoke evidence for Menu; record remaining bugs without making expanded coverage a baseline gate.

## P20: Popover

Scope: [src/experimental/Popover](../../src/experimental/Popover). Original scope: `U-07 U-19` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P20-01 Confirm or complete Popover: controlled and default open state.
- [ ] F-P20-02 Confirm or complete Popover: trigger focus return and dismissal.
- [ ] F-P20-03 Confirm or complete Popover: scope locale and direction in portal.
- [ ] F-P20-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Popover; link any breaking mapping.
- [ ] F-P20-91 Accept or add the minimal smoke evidence for Popover; record remaining bugs without making expanded coverage a baseline gate.

## P21: Tooltip

Scope: [src/experimental/Tooltip](../../src/experimental/Tooltip). Original scope: `U-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P21-01 Confirm or complete Tooltip: keyboard focus and hover description.
- [ ] F-P21-02 Confirm or complete Tooltip: escape dismissal.
- [ ] F-P21-03 Confirm or complete Tooltip: owned portal scope and placement.
- [ ] F-P21-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Tooltip; link any breaking mapping.
- [ ] F-P21-91 Accept or add the minimal smoke evidence for Tooltip; record remaining bugs without making expanded coverage a baseline gate.

## P22: Dialog

Scope: [src/experimental/Dialog](../../src/experimental/Dialog). Original scope: `U-08` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P22-01 Confirm or complete Dialog: title description and owned dismissal reasons.
- [ ] F-P22-02 Confirm or complete Dialog: focus entry containment and return.
- [ ] F-P22-03 Confirm or complete Dialog: scroll locking and nested dismissal.
- [ ] F-P22-04 Confirm or complete Dialog: portal scope inheritance.
- [ ] F-P22-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Dialog; link any breaking mapping.
- [ ] F-P22-91 Accept or add the minimal smoke evidence for Dialog; record remaining bugs without making expanded coverage a baseline gate.

## P23: Tabs

Scope: [src/experimental/Tabs](../../src/experimental/Tabs). Original scope: `U-09` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P23-01 Confirm or complete Tabs: owned tab IDs and associated panels.
- [ ] F-P23-02 Confirm or complete Tabs: manual versus automatic activation.
- [ ] F-P23-03 Confirm or complete Tabs: orientation direction and disabled skipping.
- [ ] F-P23-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Tabs; link any breaking mapping.
- [ ] F-P23-91 Accept or add the minimal smoke evidence for Tabs; record remaining bugs without making expanded coverage a baseline gate.

## P24: Link

Scope: [src/experimental/Link](../../src/experimental/Link). Original scope: `U-10 H-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P24-01 Confirm or complete Link: native anchor fallback and ref.
- [ ] F-P24-02 Confirm or complete Link: host navigation callback with replace.
- [ ] F-P24-03 Confirm or complete Link: target download and external attributes.
- [ ] F-P24-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Link; link any breaking mapping.
- [ ] F-P24-91 Accept or add the minimal smoke evidence for Link; record remaining bugs without making expanded coverage a baseline gate.

## P25: Breadcrumbs

Scope: [src/experimental/Breadcrumbs](../../src/experimental/Breadcrumbs). Original scope: `U-10` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P25-01 Confirm or complete Breadcrumbs: owned routed ancestor links.
- [ ] F-P25-02 Confirm or complete Breadcrumbs: current page semantics.
- [ ] F-P25-03 Confirm or complete Breadcrumbs: long ancestor label wrapping.
- [ ] F-P25-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Breadcrumbs; link any breaking mapping.
- [ ] F-P25-91 Accept or add the minimal smoke evidence for Breadcrumbs; record remaining bugs without making expanded coverage a baseline gate.

## P26: Navigation

Scope: [src/experimental/Navigation](../../src/experimental/Navigation). Original scope: `U-11 H-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P26-01 Confirm or complete Navigation: navigation and NavigationItem exports.
- [ ] F-P26-02 Confirm or complete Navigation: selected and expanded item state.
- [ ] F-P26-03 Confirm or complete Navigation: owned host links and action items.
- [ ] F-P26-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Navigation; link any breaking mapping.
- [ ] F-P26-91 Accept or add the minimal smoke evidence for Navigation; record remaining bugs without making expanded coverage a baseline gate.

## P27: List

Scope: [src/experimental/List](../../src/experimental/List). Original scope: `U-11` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P27-01 Confirm or complete List: list and all item text icon button exports.
- [ ] F-P27-02 Confirm or complete List: native list versus interactive item semantics.
- [ ] F-P27-03 Confirm or complete List: selected and disabled item presentation.
- [ ] F-P27-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for List; link any breaking mapping.
- [ ] F-P27-91 Accept or add the minimal smoke evidence for List; record remaining bugs without making expanded coverage a baseline gate.

## P28: Disclosure

Scope: [src/experimental/Disclosure](../../src/experimental/Disclosure). Original scope: `U-11` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P28-01 Confirm or complete Disclosure: controlled and default expanded state.
- [ ] F-P28-02 Confirm or complete Disclosure: trigger and content association.
- [ ] F-P28-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Disclosure; link any breaking mapping.
- [ ] F-P28-91 Accept or add the minimal smoke evidence for Disclosure; record remaining bugs without making expanded coverage a baseline gate.

## P29: Collapse

Scope: [src/experimental/Collapse](../../src/experimental/Collapse). Original scope: `U-11` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P29-01 Confirm or complete Collapse: expanded content visibility.
- [ ] F-P29-02 Confirm or complete Collapse: reduced-motion-compatible transition.
- [ ] F-P29-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Collapse; link any breaking mapping.
- [ ] F-P29-91 Accept or add the minimal smoke evidence for Collapse; record remaining bugs without making expanded coverage a baseline gate.

## P30: Chip

Scope: [src/experimental/Chip](../../src/experimental/Chip). Original scope: `U-12` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P30-01 Confirm or complete Chip: owned token label and tone.
- [ ] F-P30-02 Confirm or complete Chip: remove action accessible name.
- [ ] F-P30-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Chip; link any breaking mapping.
- [ ] F-P30-91 Accept or add the minimal smoke evidence for Chip; record remaining bugs without making expanded coverage a baseline gate.

## P31: Badge

Scope: [src/experimental/Badge](../../src/experimental/Badge). Original scope: `U-12` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P31-01 Confirm or complete Badge: badge value and overflow presentation.
- [ ] F-P31-02 Confirm or complete Badge: accessible count description.
- [ ] F-P31-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Badge; link any breaking mapping.
- [ ] F-P31-91 Accept or add the minimal smoke evidence for Badge; record remaining bugs without making expanded coverage a baseline gate.

## P32: TagGroup

Scope: [src/experimental/TagGroup](../../src/experimental/TagGroup). Original scope: `U-12` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P32-01 Confirm or complete TagGroup: owned token IDs and removal callback.
- [ ] F-P32-02 Confirm or complete TagGroup: keyboard token navigation.
- [ ] F-P32-03 Confirm or complete TagGroup: focus after token removal.
- [ ] F-P32-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for TagGroup; link any breaking mapping.
- [ ] F-P32-91 Accept or add the minimal smoke evidence for TagGroup; record remaining bugs without making expanded coverage a baseline gate.

## P33: Progress

Scope: [src/experimental/Progress](../../src/experimental/Progress). Original scope: `U-13` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P33-01 Confirm or complete Progress: determinate min max value.
- [ ] F-P33-02 Confirm or complete Progress: indeterminate loading.
- [ ] F-P33-03 Confirm or complete Progress: finite fallback and accessible label.
- [ ] F-P33-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Progress; link any breaking mapping.
- [ ] F-P33-91 Accept or add the minimal smoke evidence for Progress; record remaining bugs without making expanded coverage a baseline gate.

## P34: Status

Scope: [src/experimental/Status](../../src/experimental/Status). Original scope: `U-13` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P34-01 Confirm or complete Status: owned status tone and message.
- [ ] F-P34-02 Confirm or complete Status: appropriate live-region priority.
- [ ] F-P34-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Status; link any breaking mapping.
- [ ] F-P34-91 Accept or add the minimal smoke evidence for Status; record remaining bugs without making expanded coverage a baseline gate.

## P35: Avatar

Scope: [src/experimental/Avatar](../../src/experimental/Avatar). Original scope: `U-14` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P35-01 Confirm or complete Avatar: image source and accessible label.
- [ ] F-P35-02 Confirm or complete Avatar: loading and failed-image fallback.
- [ ] F-P35-03 Confirm or complete Avatar: stable aspect ratio and owned size.
- [ ] F-P35-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Avatar; link any breaking mapping.
- [ ] F-P35-91 Accept or add the minimal smoke evidence for Avatar; record remaining bugs without making expanded coverage a baseline gate.

## P36: Table

Scope: [src/experimental/Table](../../src/experimental/Table). Original scope: `U-15` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P36-01 Confirm or complete Table: all semantic table part exports.
- [ ] F-P36-02 Confirm or complete Table: header associations and caption.
- [ ] F-P36-03 Confirm or complete Table: owned cell style and ref contracts.
- [ ] F-P36-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Table; link any breaking mapping.
- [ ] F-P36-91 Accept or add the minimal smoke evidence for Table; record remaining bugs without making expanded coverage a baseline gate.

## P37: Pagination

Scope: [src/experimental/Pagination](../../src/experimental/Pagination). Original scope: `U-15` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P37-01 Confirm or complete Pagination: page and page-size requests.
- [ ] F-P37-02 Confirm or complete Pagination: known unknown and empty totals.
- [ ] F-P37-03 Confirm or complete Pagination: disabled boundaries and translated labels.
- [ ] F-P37-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Pagination; link any breaking mapping.
- [ ] F-P37-91 Accept or add the minimal smoke evidence for Pagination; record remaining bugs without making expanded coverage a baseline gate.

## P38: ToggleButton

Scope: [src/experimental/ToggleButton](../../src/experimental/ToggleButton). Original scope: `U-16` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P38-01 Confirm or complete ToggleButton: controlled and default pressed state.
- [ ] F-P38-02 Confirm or complete ToggleButton: single and multiple ToggleButtonGroup selection.
- [ ] F-P38-03 Confirm or complete ToggleButton: disabled skipping and keyboard direction.
- [ ] F-P38-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for ToggleButton; link any breaking mapping.
- [ ] F-P38-91 Accept or add the minimal smoke evidence for ToggleButton; record remaining bugs without making expanded coverage a baseline gate.

## P39: DateField

Scope: [src/experimental/DateField](../../src/experimental/DateField). Original scope: `K-02 K-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P39-01 Confirm or complete DateField: owned date-only and local datetime value.
- [ ] F-P39-02 Confirm or complete DateField: segment input and description association.
- [ ] F-P39-03 Confirm or complete DateField: native serialization and reset.
- [ ] F-P39-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for DateField; link any breaking mapping.
- [ ] F-P39-91 Accept or add the minimal smoke evidence for DateField; record remaining bugs without making expanded coverage a baseline gate.

## P40: TimeField

Scope: [src/experimental/TimeField](../../src/experimental/TimeField). Original scope: `K-02 K-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P40-01 Confirm or complete TimeField: owned clock value and seconds.
- [ ] F-P40-02 Confirm or complete TimeField: segment editing and disabled behavior.
- [ ] F-P40-03 Confirm or complete TimeField: native serialization and reset.
- [ ] F-P40-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for TimeField; link any breaking mapping.
- [ ] F-P40-91 Accept or add the minimal smoke evidence for TimeField; record remaining bugs without making expanded coverage a baseline gate.

## P41: Calendar

Scope: [src/experimental/Calendar](../../src/experimental/Calendar). Original scope: `K-02 K-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P41-01 Confirm or complete Calendar: selection focused date and visible month.
- [ ] F-P41-02 Confirm or complete Calendar: minimum maximum and unavailable dates.
- [ ] F-P41-03 Confirm or complete Calendar: host locale and direction.
- [ ] F-P41-04 Confirm or complete Calendar: multiple-date selection where supported.
- [ ] F-P41-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Calendar; link any breaking mapping.
- [ ] F-P41-91 Accept or add the minimal smoke evidence for Calendar; record remaining bugs without making expanded coverage a baseline gate.

## P42: DatePicker

Scope: [src/experimental/DatePicker](../../src/experimental/DatePicker). Original scope: `K-02 K-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P42-01 Confirm or complete DatePicker: synchronized field and calendar value.
- [ ] F-P42-02 Confirm or complete DatePicker: popover open clear and focus return.
- [ ] F-P42-03 Confirm or complete DatePicker: controlled commit and native reset.
- [ ] F-P42-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for DatePicker; link any breaking mapping.
- [ ] F-P42-91 Accept or add the minimal smoke evidence for DatePicker; record remaining bugs without making expanded coverage a baseline gate.

## P43: DateRangePicker

Scope: [src/experimental/DateRangePicker](../../src/experimental/DateRangePicker). Original scope: `K-02 K-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P43-01 Confirm or complete DateRangePicker: owned start and end fields.
- [ ] F-P43-02 Confirm or complete DateRangePicker: range selection and clear.
- [ ] F-P43-03 Confirm or complete DateRangePicker: apply Cancel and focus return.
- [ ] F-P43-04 Confirm or complete DateRangePicker: native serialization and reset.
- [ ] F-P43-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for DateRangePicker; link any breaking mapping.
- [ ] F-P43-91 Accept or add the minimal smoke evidence for DateRangePicker; record remaining bugs without making expanded coverage a baseline gate.

## P44: DateRangeSelector

Scope: [src/experimental/DateRangeSelector](../../src/experimental/DateRangeSelector). Original scope: `K-01–K-07 K-17` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P44-01 Confirm or complete DateRangeSelector: preset descriptions and draft selection.
- [ ] F-P44-02 Confirm or complete DateRangeSelector: apply commit and Cancel restoration.
- [ ] F-P44-03 Confirm or complete DateRangeSelector: multi-month range and typed endpoints.
- [ ] F-P44-04 Confirm or complete DateRangeSelector: unavailable-date explanation.
- [ ] F-P44-05 Confirm or complete DateRangeSelector: host-supplied date and availability data.
- [ ] F-P44-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for DateRangeSelector; link any breaking mapping.
- [ ] F-P44-91 Accept or add the minimal smoke evidence for DateRangeSelector; record remaining bugs without making expanded coverage a baseline gate.

## P45: Provider

Scope: [src/experimental/Provider](../../src/experimental/Provider). Original scope: `D-16 H-06` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P45-01 Confirm or complete Provider: theme density locale and direction scope.
- [ ] F-P45-02 Confirm or complete Provider: host translation locale bridge.
- [ ] F-P45-03 Confirm or complete Provider: portal inheritance and nested overrides.
- [ ] F-P45-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Provider; link any breaking mapping.
- [ ] F-P45-91 Accept or add the minimal smoke evidence for Provider; record remaining bugs without making expanded coverage a baseline gate.

## P46: DataGrid

Scope: [src/experimental/DataGrid](../../src/experimental/DataGrid). Original scope: `P-06 G-25` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P46-01 Confirm or complete DataGrid: owned proof row and column contracts.
- [ ] F-P46-02 Confirm or complete DataGrid: tanStack processing with one state authority.
- [ ] F-P46-03 Confirm or complete DataGrid: controlled selection sort filter and page.
- [ ] F-P46-04 Confirm or complete DataGrid: owned column resize and reorder proof.
- [ ] F-P46-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for DataGrid; link any breaking mapping.
- [ ] F-P46-91 Accept or add the minimal smoke evidence for DataGrid; record remaining bugs without making expanded coverage a baseline gate.

## P47: icons

Scope: [src/experimental/icons](../../src/experimental/icons). Original scope: `I-01–I-08` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-P47-01 Confirm or complete icons: owned SVG factory and icon props.
- [ ] F-P47-02 Confirm or complete icons: direct icon and activity mapping.
- [ ] F-P47-03 Confirm or complete icons: individual import and decorative semantics.
- [ ] F-P47-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for icons; link any breaking mapping.
- [ ] F-P47-91 Accept or add the minimal smoke evidence for icons; record remaining bugs without making expanded coverage a baseline gate.

## S01: ThemeScope

Scope: [src/foundation/ThemeScope.tsx](../../src/foundation/ThemeScope.tsx). Original scope: `D-16 D-17` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S01-01 Confirm or complete ThemeScope: light dark and system setting.
- [ ] F-S01-02 Confirm or complete ThemeScope: nested density and token override.
- [ ] F-S01-03 Confirm or complete ThemeScope: server-safe initial scope attributes.
- [ ] F-S01-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for ThemeScope; link any breaking mapping.
- [ ] F-S01-91 Accept or add the minimal smoke evidence for ThemeScope; record remaining bugs without making expanded coverage a baseline gate.

## S02: Tokens

Scope: [src/foundation/tokens.json](../../src/foundation/tokens.json). Original scope: `D-01–D-20` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S02-01 Confirm or complete Tokens: palette semantic and component aliases.
- [ ] F-S02-02 Confirm or complete Tokens: typography spacing size and surface scales.
- [ ] F-S02-03 Confirm or complete Tokens: deterministic generated CSS and typed references.
- [ ] F-S02-04 Confirm or complete Tokens: focus error selected and disabled roles.
- [ ] F-S02-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Tokens; link any breaking mapping.
- [ ] F-S02-91 Accept or add the minimal smoke evidence for Tokens; record remaining bugs without making expanded coverage a baseline gate.

## S03: CSSPipeline

Scope: [scripts/build.mjs](../../scripts/build.mjs). Original scope: `C-01–C-21 R-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S03-01 Confirm or complete CSSPipeline: compiled module classes and emitted styles.
- [ ] F-S03-02 Confirm or complete CSSPipeline: namespaced cascade layers and scoped normalization.
- [ ] F-S03-03 Confirm or complete CSSPipeline: stylesheet exports and asset paths.
- [ ] F-S03-04 Confirm or complete CSSPipeline: logical properties and owned customization slots.
- [ ] F-S03-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for CSSPipeline; link any breaking mapping.
- [ ] F-S03-91 Accept or add the minimal smoke evidence for CSSPipeline; record remaining bugs without making expanded coverage a baseline gate.

## S04: NavigationAdapter

Scope: [src/adapters/navigation.tsx](../../src/adapters/navigation.tsx). Original scope: `H-01 H-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S04-01 Confirm or complete NavigationAdapter: native fallback and custom router provider.
- [ ] F-S04-02 Confirm or complete NavigationAdapter: pathname and replace request.
- [ ] F-S04-03 Confirm or complete NavigationAdapter: forwarded ref and link attributes.
- [ ] F-S04-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for NavigationAdapter; link any breaking mapping.
- [ ] F-S04-91 Accept or add the minimal smoke evidence for NavigationAdapter; record remaining bugs without making expanded coverage a baseline gate.

## S05: AccountAdapter

Scope: [src/adapters/accounts.tsx](../../src/adapters/accounts.tsx). Original scope: `H-04 H-05` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S05-01 Confirm or complete AccountAdapter: organization and logout host callbacks.
- [ ] F-S05-02 Confirm or complete AccountAdapter: pending state and duplicate request guard.
- [ ] F-S05-03 Confirm or complete AccountAdapter: error delivery and result lifetime.
- [ ] F-S05-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AccountAdapter; link any breaking mapping.
- [ ] F-S05-91 Accept or add the minimal smoke evidence for AccountAdapter; record remaining bugs without making expanded coverage a baseline gate.

## S06: TranslationAdapter

Scope: [src/i18n/index.tsx](../../src/i18n/index.tsx). Original scope: `H-06–H-09` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S06-01 Confirm or complete TranslationAdapter: key namespace locale and values forwarding.
- [ ] F-S06-02 Confirm or complete TranslationAdapter: defaultMessage English fallback.
- [ ] F-S06-03 Confirm or complete TranslationAdapter: host-owned supported locale policy.
- [ ] F-S06-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for TranslationAdapter; link any breaking mapping.
- [ ] F-S06-91 Accept or add the minimal smoke evidence for TranslationAdapter; record remaining bugs without making expanded coverage a baseline gate.

## S07: ICUFormatting

Scope: [src/i18n/icu.ts](../../src/i18n/icu.ts). Original scope: `H-08` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S07-01 Confirm or complete ICUFormatting: interpolation variable matching.
- [ ] F-S07-02 Confirm or complete ICUFormatting: plural and select message formatting.
- [ ] F-S07-03 Confirm or complete ICUFormatting: malformed message fallback.
- [ ] F-S07-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for ICUFormatting; link any breaking mapping.
- [ ] F-S07-91 Accept or add the minimal smoke evidence for ICUFormatting; record remaining bugs without making expanded coverage a baseline gate.

## S08: PersistentState

Scope: [src/hooks/usePersistentState.ts](../../src/hooks/usePersistentState.ts). Original scope: `H-13 H-14` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S08-01 Confirm or complete PersistentState: opt-in local or session storage.
- [ ] F-S08-02 Confirm or complete PersistentState: versioned validation and in-memory fallback.
- [ ] F-S08-03 Confirm or complete PersistentState: key changes and independent view state.
- [ ] F-S08-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for PersistentState; link any breaking mapping.
- [ ] F-S08-91 Accept or add the minimal smoke evidence for PersistentState; record remaining bugs without making expanded coverage a baseline gate.

## S09: PaginationState

Scope: [src/hooks/usePersistentPaginationModel.ts](../../src/hooks/usePersistentPaginationModel.ts). Original scope: `H-15 H-16` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S09-01 Confirm or complete PaginationState: positive safe integer page sizes.
- [ ] F-S09-02 Confirm or complete PaginationState: page-zero request on size or filter change.
- [ ] F-S09-03 Confirm or complete PaginationState: known-total clamp and unknown-total behavior.
- [ ] F-S09-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for PaginationState; link any breaking mapping.
- [ ] F-S09-91 Accept or add the minimal smoke evidence for PaginationState; record remaining bugs without making expanded coverage a baseline gate.

## S10: AdminPresets

Scope: [src/components/AdminDataGridOptions.ts](../../src/components/AdminDataGridOptions.ts). Original scope: `M-39` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S10-01 Confirm or complete AdminPresets: course-named factory and Class compatibility.
- [ ] F-S10-02 Confirm or complete AdminPresets: canonical status options.
- [ ] F-S10-03 Confirm or complete AdminPresets: first-text and last-action visibility locks.
- [ ] F-S10-04 Confirm or complete AdminPresets: empty filter criteria and translated labels.
- [ ] F-S10-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for AdminPresets; link any breaking mapping.
- [ ] F-S10-91 Accept or add the minimal smoke evidence for AdminPresets; record remaining bugs without making expanded coverage a baseline gate.

## S11: InstructorPresets

Scope: [src/components/InstructorDataGridOptions.ts](../../src/components/InstructorDataGridOptions.ts). Original scope: `M-39` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S11-01 Confirm or complete InstructorPresets: course-named factory and Class compatibility.
- [ ] F-S11-02 Confirm or complete InstructorPresets: canonical status options.
- [ ] F-S11-03 Confirm or complete InstructorPresets: first-text and last-action visibility locks.
- [ ] F-S11-04 Confirm or complete InstructorPresets: empty filter criteria and translated labels.
- [ ] F-S11-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for InstructorPresets; link any breaking mapping.
- [ ] F-S11-91 Accept or add the minimal smoke evidence for InstructorPresets; record remaining bugs without making expanded coverage a baseline gate.

## S12: GridCells

Scope: [src/components/AppDataGrid](../../src/components/AppDataGrid). Original scope: `M-40 G-21` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S12-01 Confirm or complete GridCells: text and multiline truncation contract.
- [ ] F-S12-02 Confirm or complete GridCells: date and datetime localized fallbacks.
- [ ] F-S12-03 Confirm or complete GridCells: link and copyable cell callbacks.
- [ ] F-S12-04 Confirm or complete GridCells: escaped JSON and custom rendering.
- [ ] F-S12-05 Confirm or complete GridCells: image failure and action-menu cells.
- [ ] F-S12-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for GridCells; link any breaking mapping.
- [ ] F-S12-91 Accept or add the minimal smoke evidence for GridCells; record remaining bugs without making expanded coverage a baseline gate.

## S13: GridHelpers

Scope: [src/components/AppDataGrid](../../src/components/AppDataGrid). Original scope: `M-41` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S13-01 Confirm or complete GridHelpers: owned column and action builders.
- [ ] F-S13-02 Confirm or complete GridHelpers: subheader and loading empty parts.
- [ ] F-S13-03 Confirm or complete GridHelpers: toolbar options and header sort menu.
- [ ] F-S13-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for GridHelpers; link any breaking mapping.
- [ ] F-S13-91 Accept or add the minimal smoke evidence for GridHelpers; record remaining bugs without making expanded coverage a baseline gate.

## S14: PublicExports

Scope: [src/index.ts](../../src/index.ts). Original scope: `M-42 R-03 R-05` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S14-01 Confirm or complete PublicExports: root component and granular exports.
- [ ] F-S14-02 Confirm or complete PublicExports: owned model and callback declarations.
- [ ] F-S14-03 Confirm or complete PublicExports: react peers and CSS sideEffects.
- [ ] F-S14-04 Confirm or complete PublicExports: explicit source client directives.
- [ ] F-S14-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for PublicExports; link any breaking mapping.
- [ ] F-S14-91 Accept or add the minimal smoke evidence for PublicExports; record remaining bugs without making expanded coverage a baseline gate.

## S15: SavedEditorNodes

Scope: [src/components/PageRichTextEditorSection/lexical](../../src/components/PageRichTextEditorSection/lexical). Original scope: `E-02 E-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S15-01 Confirm or complete SavedEditorNodes: image metadata and JSON preservation.
- [ ] F-S15-02 Confirm or complete SavedEditorNodes: saved code-highlight node registration.
- [ ] F-S15-03 Confirm or complete SavedEditorNodes: rule selection and root caret handling.
- [ ] F-S15-04 Confirm or complete SavedEditorNodes: saved and pasted inert rejected links.
- [ ] F-S15-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for SavedEditorNodes; link any breaking mapping.
- [ ] F-S15-91 Accept or add the minimal smoke evidence for SavedEditorNodes; record remaining bugs without making expanded coverage a baseline gate.

## S16: EditorUploadLifetime

Scope: [src/components/PageRichTextEditorSection](../../src/components/PageRichTextEditorSection). Original scope: `E-06` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S16-01 Confirm or complete EditorUploadLifetime: local preview retained through undo.
- [ ] F-S16-02 Confirm or complete EditorUploadLifetime: owned URLs released on reset and unmount.
- [ ] F-S16-03 Confirm or complete EditorUploadLifetime: host URLs remain host-owned.
- [ ] F-S16-04 Confirm or complete EditorUploadLifetime: cancelled upload result ignored.
- [ ] F-S16-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for EditorUploadLifetime; link any breaking mapping.
- [ ] F-S16-91 Accept or add the minimal smoke evidence for EditorUploadLifetime; record remaining bugs without making expanded coverage a baseline gate.

## S17: DateContracts

Scope: [src/experimental/DateRangeSelector/date-contract.ts](../../src/experimental/DateRangeSelector/date-contract.ts). Original scope: `H-10 H-11 K-10` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S17-01 Confirm or complete DateContracts: serializable date-only local datetime and instant.
- [ ] F-S17-02 Confirm or complete DateContracts: valid parsing and callback payload.
- [ ] F-S17-03 Confirm or complete DateContracts: host timezone conversion boundary.
- [ ] F-S17-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for DateContracts; link any breaking mapping.
- [ ] F-S17-91 Accept or add the minimal smoke evidence for DateContracts; record remaining bugs without making expanded coverage a baseline gate.

## S18: Models

Scope: [src/models.ts](../../src/models.ts). Original scope: `A-14 E-09 E-10` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] F-S18-01 Confirm or complete Models: course terminology for new models.
- [ ] F-S18-02 Confirm or complete Models: class compatibility exports.
- [ ] F-S18-03 Confirm or complete Models: presentation-only data independent of HTTP contracts.
- [ ] F-S18-90 Confirm owned public types and applicable ref/style wiring plus one production-scope story or consuming example for Models; link any breaking mapping.
- [ ] F-S18-91 Accept or add the minimal smoke evidence for Models; record remaining bugs without making expanded coverage a baseline gate.
