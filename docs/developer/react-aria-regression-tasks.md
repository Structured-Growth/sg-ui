# Expanded regression coverage: detailed checklist

Priority: P2 — second. Start these assignments only after the required all-component functionality baseline and its milestones are complete. Finish required regression tasks before scheduling hardening. During P1, primary-flow blockers belong to functionality tasks with minimal smoke evidence.

Each `T-*` below depends on the matching `F-*` feature. Add or accept a targeted behavior regression covering the specified behavior; use real owned components and public callbacks. Record the exact test and what it establishes. If existing coverage is adequate, check the item with that evidence rather than adding a duplicate test.

These are independent tasks, not additional acceptance requirements for the baseline implementation chat. Browser, visual, device and assistive-technology work is tracked separately in the hardening checklist.

## C01: AppButton

Scope: [src/components/AppButton](../../src/components/AppButton). Original scope: `M-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C01-01 Add or accept a focused regression for AppButton: owned onPress and native button type. Dependency: `F-C01-01`.
- [ ] T-C01-02 Add or accept a focused regression for AppButton: variant tone and density mapping. Dependency: `F-C01-02`.
- [ ] T-C01-03 Add or accept a focused regression for AppButton: disabled and pending activation. Dependency: `F-C01-03`.
- [ ] T-C01-04 Add or accept a focused regression for AppButton: native ref className and style. Dependency: `F-C01-04`.
- [ ] T-C01-90 Verify AppButton public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C01-91 Verify AppButton instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C02: AppInlineProgress

Scope: [src/components/AppInlineProgress](../../src/components/AppInlineProgress). Original scope: `M-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C02-01 Add or accept a focused regression for AppInlineProgress: determinate percentage and finite fallback. Dependency: `F-C02-01`.
- [ ] T-C02-02 Add or accept a focused regression for AppInlineProgress: translated status label. Dependency: `F-C02-02`.
- [ ] T-C02-03 Add or accept a focused regression for AppInlineProgress: Owned barWidth and percentage label layout. Dependency: `F-C02-03`.
- [ ] T-C02-90 Verify AppInlineProgress public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C02-91 Verify AppInlineProgress instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C03: AppOperationSteps

Scope: [src/components/AppOperationSteps](../../src/components/AppOperationSteps). Original scope: `M-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C03-01 Add or accept a focused regression for AppOperationSteps: active completed and error step rendering. Dependency: `F-C03-01`.
- [ ] T-C03-02 Add or accept a focused regression for AppOperationSteps: ordered labels and status text. Dependency: `F-C03-02`.
- [ ] T-C03-03 Add or accept a focused regression for AppOperationSteps: single-step numbering suppression. Dependency: `F-C03-03`.
- [ ] T-C03-90 Verify AppOperationSteps public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C03-91 Verify AppOperationSteps instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C04: AppPageHeader

Scope: [src/components/AppPageHeader](../../src/components/AppPageHeader). Original scope: `M-04` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C04-01 Add or accept a focused regression for AppPageHeader: primary and subpage surface hierarchy. Dependency: `F-C04-01`.
- [ ] T-C04-02 Add or accept a focused regression for AppPageHeader: breadcrumb navigation through owned links. Dependency: `F-C04-02`.
- [ ] T-C04-03 Add or accept a focused regression for AppPageHeader: left split actions and right actions. Dependency: `F-C04-03`.
- [ ] T-C04-04 Add or accept a focused regression for AppPageHeader: metadata and title wrapping. Dependency: `F-C04-04`.
- [ ] T-C04-90 Verify AppPageHeader public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C04-91 Verify AppPageHeader instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C05: AppPageTabs

Scope: [src/components/AppPageTabs](../../src/components/AppPageTabs). Original scope: `M-05` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C05-01 Add or accept a focused regression for AppPageTabs: tab and panel association. Dependency: `F-C05-01`.
- [ ] T-C05-02 Add or accept a focused regression for AppPageTabs: controlled selection callback. Dependency: `F-C05-02`.
- [ ] T-C05-03 Add or accept a focused regression for AppPageTabs: disabled tabs and arrow activation. Dependency: `F-C05-03`.
- [ ] T-C05-04 Add or accept a focused regression for AppPageTabs: overflow strip with visible active tab. Dependency: `F-C05-04`.
- [ ] T-C05-90 Verify AppPageTabs public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C05-91 Verify AppPageTabs instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C06: AppShell

Scope: [src/components/AppShell](../../src/components/AppShell). Original scope: `M-06` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C06-01 Add or accept a focused regression for AppShell: main and navigation landmarks. Dependency: `F-C06-01`.
- [ ] T-C06-02 Add or accept a focused regression for AppShell: responsive navigation presentation. Dependency: `F-C06-02`.
- [ ] T-C06-03 Add or accept a focused regression for AppShell: host content and header slots. Dependency: `F-C06-03`.
- [ ] T-C06-04 Add or accept a focused regression for AppShell: owned scope propagation. Dependency: `F-C06-04`.
- [ ] T-C06-90 Verify AppShell public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C06-91 Verify AppShell instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C07: AuthShell

Scope: [src/components/AuthShell](../../src/components/AuthShell). Original scope: `M-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C07-01 Add or accept a focused regression for AuthShell: presentation-only authentication layout. Dependency: `F-C07-01`.
- [ ] T-C07-02 Add or accept a focused regression for AuthShell: content and branding slots. Dependency: `F-C07-02`.
- [ ] T-C07-03 Add or accept a focused regression for AuthShell: small-container content sizing. Dependency: `F-C07-03`.
- [ ] T-C07-90 Verify AuthShell public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C07-91 Verify AuthShell instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C08: AppModal

Scope: [src/components/AppModal](../../src/components/AppModal). Original scope: `M-08` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C08-01 Add or accept a focused regression for AppModal: owned size title description and parts. Dependency: `F-C08-01`.
- [ ] T-C08-02 Add or accept a focused regression for AppModal: open close and dismissal reasons. Dependency: `F-C08-02`.
- [ ] T-C08-03 Add or accept a focused regression for AppModal: primary secondary and pending actions. Dependency: `F-C08-03`.
- [ ] T-C08-04 Add or accept a focused regression for AppModal: sticky tabs with scrollable body. Dependency: `F-C08-04`.
- [ ] T-C08-05 Add or accept a focused regression for AppModal: multi-step labels and single-step suppression. Dependency: `F-C08-05`.
- [ ] T-C08-06 Add or accept a focused regression for AppModal: initial focus and trigger return. Dependency: `F-C08-06`.
- [ ] T-C08-90 Verify AppModal public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C08-91 Verify AppModal instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C09: SideNavigation

Scope: [src/components/SideNavigation](../../src/components/SideNavigation). Original scope: `M-09` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C09-01 Add or accept a focused regression for SideNavigation: pathname selected navigation item. Dependency: `F-C09-01`.
- [ ] T-C09-02 Add or accept a focused regression for SideNavigation: child expansion and collapsed navigation. Dependency: `F-C09-02`.
- [ ] T-C09-03 Add or accept a focused regression for SideNavigation: router adapter activation. Dependency: `F-C09-03`.
- [ ] T-C09-04 Add or accept a focused regression for SideNavigation: organization action callback. Dependency: `F-C09-04`.
- [ ] T-C09-05 Add or accept a focused regression for SideNavigation: logout action callback. Dependency: `F-C09-05`.
- [ ] T-C09-06 Add or accept a focused regression for SideNavigation: pending and error account presentation. Dependency: `F-C09-06`.
- [ ] T-C09-90 Verify SideNavigation public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C09-91 Verify SideNavigation instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C10: ExperiencePageNavigator

Scope: [src/components/ExperiencePageNavigator](../../src/components/ExperiencePageNavigator). Original scope: `M-10` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C10-01 Add or accept a focused regression for ExperiencePageNavigator: previous and next callbacks. Dependency: `F-C10-01`.
- [ ] T-C10-02 Add or accept a focused regression for ExperiencePageNavigator: first and last disabled boundaries. Dependency: `F-C10-02`.
- [ ] T-C10-03 Add or accept a focused regression for ExperiencePageNavigator: link versus action rendering. Dependency: `F-C10-03`.
- [ ] T-C10-04 Add or accept a focused regression for ExperiencePageNavigator: translated destination labels. Dependency: `F-C10-04`.
- [ ] T-C10-90 Verify ExperiencePageNavigator public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C10-91 Verify ExperiencePageNavigator instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C11: CardCollectionWithFooter

Scope: [src/components/CardCollectionWithFooter](../../src/components/CardCollectionWithFooter). Original scope: `M-11` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C11-01 Add or accept a focused regression for CardCollectionWithFooter: stable item keys and card rendering. Dependency: `F-C11-01`.
- [ ] T-C11-02 Add or accept a focused regression for CardCollectionWithFooter: responsive collection layout. Dependency: `F-C11-02`.
- [ ] T-C11-03 Add or accept a focused regression for CardCollectionWithFooter: empty and loading presentation. Dependency: `F-C11-03`.
- [ ] T-C11-04 Add or accept a focused regression for CardCollectionWithFooter: shared pagination footer state. Dependency: `F-C11-04`.
- [ ] T-C11-90 Verify CardCollectionWithFooter public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C11-91 Verify CardCollectionWithFooter instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C12: CardPaginationFooter

Scope: [src/components/CardPaginationFooter](../../src/components/CardPaginationFooter). Original scope: `M-12` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C12-01 Add or accept a focused regression for CardPaginationFooter: appPaginationFooter preserved export. Dependency: `F-C12-01`.
- [ ] T-C12-02 Add or accept a focused regression for CardPaginationFooter: page and page-size callbacks. Dependency: `F-C12-02`.
- [ ] T-C12-03 Add or accept a focused regression for CardPaginationFooter: known and unknown totals. Dependency: `F-C12-03`.
- [ ] T-C12-04 Add or accept a focused regression for CardPaginationFooter: page-zero request before size change. Dependency: `F-C12-04`.
- [ ] T-C12-05 Add or accept a focused regression for CardPaginationFooter: first and last boundary disabling. Dependency: `F-C12-05`.
- [ ] T-C12-90 Verify CardPaginationFooter public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C12-91 Verify CardPaginationFooter instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C13: ClassCardFrame

Scope: [src/components/ClassCardFrame](../../src/components/ClassCardFrame). Original scope: `M-13` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C13-01 Add or accept a focused regression for ClassCardFrame: owned frame surface and spacing. Dependency: `F-C13-01`.
- [ ] T-C13-02 Add or accept a focused regression for ClassCardFrame: image and content slots. Dependency: `F-C13-02`.
- [ ] T-C13-03 Add or accept a focused regression for ClassCardFrame: responsive frame width. Dependency: `F-C13-03`.
- [ ] T-C13-04 Add or accept a focused regression for ClassCardFrame: native styling slots. Dependency: `F-C13-04`.
- [ ] T-C13-90 Verify ClassCardFrame public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C13-91 Verify ClassCardFrame instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C14: InstructorClassCard

Scope: [src/components/InstructorClassCard](../../src/components/InstructorClassCard). Original scope: `M-14` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C14-01 Add or accept a focused regression for InstructorClassCard: course status and metadata. Dependency: `F-C14-01`.
- [ ] T-C14-02 Add or accept a focused regression for InstructorClassCard: menu actions with host callbacks. Dependency: `F-C14-02`.
- [ ] T-C14-03 Add or accept a focused regression for InstructorClassCard: date and icon fallback. Dependency: `F-C14-03`.
- [ ] T-C14-04 Add or accept a focused regression for InstructorClassCard: long title and description presentation. Dependency: `F-C14-04`.
- [ ] T-C14-90 Verify InstructorClassCard public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C14-91 Verify InstructorClassCard instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C15: LearnerClassCard

Scope: [src/components/LearnerClassCard](../../src/components/LearnerClassCard). Original scope: `M-15` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C15-01 Add or accept a focused regression for LearnerClassCard: progress and completion presentation. Dependency: `F-C15-01`.
- [ ] T-C15-02 Add or accept a focused regression for LearnerClassCard: due-date and status labels. Dependency: `F-C15-02`.
- [ ] T-C15-03 Add or accept a focused regression for LearnerClassCard: owned link and action regions. Dependency: `F-C15-03`.
- [ ] T-C15-04 Add or accept a focused regression for LearnerClassCard: translated empty metadata. Dependency: `F-C15-04`.
- [ ] T-C15-90 Verify LearnerClassCard public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C15-91 Verify LearnerClassCard instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C16: AppDataGrid

Scope: [src/components/AppDataGrid](../../src/components/AppDataGrid). Original scope: `M-16 G-04–G-16 G-21 G-22` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C16-01 Add or accept a focused regression for AppDataGrid: owned row and column IDs with generics. Dependency: `F-C16-01`.
- [ ] T-C16-02 Add or accept a focused regression for AppDataGrid: filter-before-sort-before-page processing. Dependency: `F-C16-02`.
- [ ] T-C16-03 Add or accept a focused regression for AppDataGrid: controlled client and server state. Dependency: `F-C16-03`.
- [ ] T-C16-04 Add or accept a focused regression for AppDataGrid: row checkboxes and selected count. Dependency: `F-C16-04`.
- [ ] T-C16-05 Add or accept a focused regression for AppDataGrid: visibility locks and last action column. Dependency: `F-C16-05`.
- [ ] T-C16-06 Add or accept a focused regression for AppDataGrid: owned cell renderer dispatch. Dependency: `F-C16-06`.
- [ ] T-C16-07 Add or accept a focused regression for AppDataGrid: loading empty no-results and error parts. Dependency: `F-C16-07`.
- [ ] T-C16-08 Add or accept a focused regression for AppDataGrid: width resizing and ordered columns. Dependency: `F-C16-08`.
- [ ] T-C16-09 Add or accept a focused regression for AppDataGrid: opt-in persistence and complete reset snapshot. Dependency: `F-C16-09`.
- [ ] T-C16-90 Verify AppDataGrid public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C16-91 Verify AppDataGrid instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C17: AppDataGridShell

Scope: [src/components/AppDataGridShell](../../src/components/AppDataGridShell). Original scope: `M-17 H-17` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C17-01 Add or accept a focused regression for AppDataGridShell: one shared grid and card state owner. Dependency: `F-C17-01`.
- [ ] T-C17-02 Add or accept a focused regression for AppDataGridShell: search and toolbar integration. Dependency: `F-C17-02`.
- [ ] T-C17-03 Add or accept a focused regression for AppDataGridShell: filter and page-size page reset. Dependency: `F-C17-03`.
- [ ] T-C17-04 Add or accept a focused regression for AppDataGridShell: grid and card switching. Dependency: `F-C17-04`.
- [ ] T-C17-05 Add or accept a focused regression for AppDataGridShell: footer and pending error integration. Dependency: `F-C17-05`.
- [ ] T-C17-90 Verify AppDataGridShell public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C17-91 Verify AppDataGridShell instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C18: AppDataGridRowDnd

Scope: [src/components/AppDataGridRowDnd](../../src/components/AppDataGridRowDnd). Original scope: `M-18 G-17 G-18 G-28` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C18-01 Add or accept a focused regression for AppDataGridRowDnd: complete single-page reorder eligibility. Dependency: `F-C18-01`.
- [ ] T-C18-02 Add or accept a focused regression for AppDataGridRowDnd: pointer handle and owned drag preview. Dependency: `F-C18-02`.
- [ ] T-C18-03 Add or accept a focused regression for AppDataGridRowDnd: keyboard Move alternative. Dependency: `F-C18-03`.
- [ ] T-C18-04 Add or accept a focused regression for AppDataGridRowDnd: cancel and source-focus return. Dependency: `F-C18-04`.
- [ ] T-C18-05 Add or accept a focused regression for AppDataGridRowDnd: host reorder request and rollback boundary. Dependency: `F-C18-05`.
- [ ] T-C18-90 Verify AppDataGridRowDnd public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C18-91 Verify AppDataGridRowDnd instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C19: LearnerClassesDataGrid

Scope: [src/components/LearnerClassesDataGrid](../../src/components/LearnerClassesDataGrid). Original scope: `M-19` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C19-01 Add or accept a focused regression for LearnerClassesDataGrid: owned learner presentation model. Dependency: `F-C19-01`.
- [ ] T-C19-02 Add or accept a focused regression for LearnerClassesDataGrid: date link and status columns. Dependency: `F-C19-02`.
- [ ] T-C19-03 Add or accept a focused regression for LearnerClassesDataGrid: host row and action callbacks. Dependency: `F-C19-03`.
- [ ] T-C19-04 Add or accept a focused regression for LearnerClassesDataGrid: shared filtering selection and pagination. Dependency: `F-C19-04`.
- [ ] T-C19-05 Add or accept a focused regression for LearnerClassesDataGrid: public LearnerClassesDataGridProps export. Dependency: `F-C19-05`.
- [ ] T-C19-90 Verify LearnerClassesDataGrid public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C19-91 Verify LearnerClassesDataGrid instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C20: DataToolbar

Scope: [src/components/DataToolbar](../../src/components/DataToolbar). Original scope: `M-20 G-08–G-11` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C20-01 Add or accept a focused regression for DataToolbar: search and refresh callbacks. Dependency: `F-C20-01`.
- [ ] T-C20-02 Add or accept a focused regression for DataToolbar: selected count and selected actions. Dependency: `F-C20-02`.
- [ ] T-C20-03 Add or accept a focused regression for DataToolbar: sort draft apply and clear. Dependency: `F-C20-03`.
- [ ] T-C20-04 Add or accept a focused regression for DataToolbar: filter draft apply cancel and All semantics. Dependency: `F-C20-04`.
- [ ] T-C20-05 Add or accept a focused regression for DataToolbar: columns visibility locks and order. Dependency: `F-C20-05`.
- [ ] T-C20-06 Add or accept a focused regression for DataToolbar: grid and card view callback. Dependency: `F-C20-06`.
- [ ] T-C20-07 Add or accept a focused regression for DataToolbar: neutral outlined split actions. Dependency: `F-C20-07`.
- [ ] T-C20-90 Verify DataToolbar public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C20-91 Verify DataToolbar instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C21: DocumentEditorLayout

Scope: [src/components/DocumentEditorLayout](../../src/components/DocumentEditorLayout). Original scope: `M-21` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C21-01 Add or accept a focused regression for DocumentEditorLayout: toolbar content and menu slots. Dependency: `F-C21-01`.
- [ ] T-C21-02 Add or accept a focused regression for DocumentEditorLayout: host-owned scrolling boundary. Dependency: `F-C21-02`.
- [ ] T-C21-03 Add or accept a focused regression for DocumentEditorLayout: native status styles and refs. Dependency: `F-C21-03`.
- [ ] T-C21-90 Verify DocumentEditorLayout public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C21-91 Verify DocumentEditorLayout instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C22: DocumentEditorToolbar

Scope: [src/components/DocumentEditorToolbar](../../src/components/DocumentEditorToolbar). Original scope: `M-22` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C22-01 Add or accept a focused regression for DocumentEditorToolbar: owned actions and menu triggers. Dependency: `F-C22-01`.
- [ ] T-C22-02 Add or accept a focused regression for DocumentEditorToolbar: controlled active formatting state. Dependency: `F-C22-02`.
- [ ] T-C22-03 Add or accept a focused regression for DocumentEditorToolbar: disabled and pending actions. Dependency: `F-C22-03`.
- [ ] T-C22-04 Add or accept a focused regression for DocumentEditorToolbar: narrow toolbar overflow. Dependency: `F-C22-04`.
- [ ] T-C22-90 Verify DocumentEditorToolbar public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C22-91 Verify DocumentEditorToolbar instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C23: ContentEditorChrome

Scope: [src/components/ContentEditorChrome](../../src/components/ContentEditorChrome). Original scope: `M-23` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C23-01 Add or accept a focused regression for ContentEditorChrome: editor menu and toolbar composition. Dependency: `F-C23-01`.
- [ ] T-C23-02 Add or accept a focused regression for ContentEditorChrome: selection preparation before actions. Dependency: `F-C23-02`.
- [ ] T-C23-03 Add or accept a focused regression for ContentEditorChrome: host onPress anchor callbacks. Dependency: `F-C23-03`.
- [ ] T-C23-04 Add or accept a focused regression for ContentEditorChrome: loading and disabled chrome. Dependency: `F-C23-04`.
- [ ] T-C23-90 Verify ContentEditorChrome public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C23-91 Verify ContentEditorChrome instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C24: EditableTitleField

Scope: [src/components/EditableTitleField](../../src/components/EditableTitleField). Original scope: `M-24` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C24-01 Add or accept a focused regression for EditableTitleField: controlled draft and committed title. Dependency: `F-C24-01`.
- [ ] T-C24-02 Add or accept a focused regression for EditableTitleField: enter commit and Escape cancel. Dependency: `F-C24-02`.
- [ ] T-C24-03 Add or accept a focused regression for EditableTitleField: blur commit callback. Dependency: `F-C24-03`.
- [ ] T-C24-04 Add or accept a focused regression for EditableTitleField: validation and read-only presentation. Dependency: `F-C24-04`.
- [ ] T-C24-90 Verify EditableTitleField public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C24-91 Verify EditableTitleField instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C25: FloatingTextSelectionToolbar

Scope: [src/components/FloatingTextSelectionToolbar](../../src/components/FloatingTextSelectionToolbar). Original scope: `M-25` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C25-01 Add or accept a focused regression for FloatingTextSelectionToolbar: selection-based toolbar visibility. Dependency: `F-C25-01`.
- [ ] T-C25-02 Add or accept a focused regression for FloatingTextSelectionToolbar: owned selection anchor placement. Dependency: `F-C25-02`.
- [ ] T-C25-03 Add or accept a focused regression for FloatingTextSelectionToolbar: selection preserved on action press. Dependency: `F-C25-03`.
- [ ] T-C25-04 Add or accept a focused regression for FloatingTextSelectionToolbar: keyboard toolbar access. Dependency: `F-C25-04`.
- [ ] T-C25-05 Add or accept a focused regression for FloatingTextSelectionToolbar: overlay cleanup on selection loss. Dependency: `F-C25-05`.
- [ ] T-C25-90 Verify FloatingTextSelectionToolbar public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C25-91 Verify FloatingTextSelectionToolbar instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C26: RichTextFormattingToolbar

Scope: [src/components/RichTextFormattingToolbar](../../src/components/RichTextFormattingToolbar). Original scope: `M-26 E-04` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C26-01 Add or accept a focused regression for RichTextFormattingToolbar: named inline formatting callbacks. Dependency: `F-C26-01`.
- [ ] T-C26-02 Add or accept a focused regression for RichTextFormattingToolbar: controlled active and mixed states. Dependency: `F-C26-02`.
- [ ] T-C26-03 Add or accept a focused regression for RichTextFormattingToolbar: undo and redo callback availability. Dependency: `F-C26-03`.
- [ ] T-C26-04 Add or accept a focused regression for RichTextFormattingToolbar: selection preparation before command. Dependency: `F-C26-04`.
- [ ] T-C26-05 Add or accept a focused regression for RichTextFormattingToolbar: unavailable commands disabled. Dependency: `F-C26-05`.
- [ ] T-C26-90 Verify RichTextFormattingToolbar public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C26-91 Verify RichTextFormattingToolbar instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C27: InsertContentMenuControl

Scope: [src/components/InsertContentMenuControl](../../src/components/InsertContentMenuControl). Original scope: `M-27` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C27-01 Add or accept a focused regression for InsertContentMenuControl: insert image columns and rule actions. Dependency: `F-C27-01`.
- [ ] T-C27-02 Add or accept a focused regression for InsertContentMenuControl: unavailable insertion actions disabled. Dependency: `F-C27-02`.
- [ ] T-C27-03 Add or accept a focused regression for InsertContentMenuControl: selection preparation and command focus. Dependency: `F-C27-03`.
- [ ] T-C27-90 Verify InsertContentMenuControl public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C27-91 Verify InsertContentMenuControl instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C28: TextAlignMenuControl

Scope: [src/components/TextAlignMenuControl](../../src/components/TextAlignMenuControl). Original scope: `M-28` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C28-01 Add or accept a focused regression for TextAlignMenuControl: alignment actions and active state. Dependency: `F-C28-01`.
- [ ] T-C28-02 Add or accept a focused regression for TextAlignMenuControl: indent and outdent callbacks. Dependency: `F-C28-02`.
- [ ] T-C28-03 Add or accept a focused regression for TextAlignMenuControl: direction-aware labels and icons. Dependency: `F-C28-03`.
- [ ] T-C28-90 Verify TextAlignMenuControl public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C28-91 Verify TextAlignMenuControl instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C29: TextColorPickerControl

Scope: [src/components/TextColorPickerControl](../../src/components/TextColorPickerControl). Original scope: `M-29` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C29-01 Add or accept a focused regression for TextColorPickerControl: foreground and background mode. Dependency: `F-C29-01`.
- [ ] T-C29-02 Add or accept a focused regression for TextColorPickerControl: semantic preset swatches. Dependency: `F-C29-02`.
- [ ] T-C29-03 Add or accept a focused regression for TextColorPickerControl: clear and reset callbacks. Dependency: `F-C29-03`.
- [ ] T-C29-04 Add or accept a focused regression for TextColorPickerControl: accessible selected-color labeling. Dependency: `F-C29-04`.
- [ ] T-C29-90 Verify TextColorPickerControl public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C29-91 Verify TextColorPickerControl instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C30: TextStyleMenuControl

Scope: [src/components/TextStyleMenuControl](../../src/components/TextStyleMenuControl). Original scope: `M-30` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C30-01 Add or accept a focused regression for TextStyleMenuControl: style and typeface options. Dependency: `F-C30-01`.
- [ ] T-C30-02 Add or accept a focused regression for TextStyleMenuControl: controlled selected formatting style. Dependency: `F-C30-02`.
- [ ] T-C30-03 Add or accept a focused regression for TextStyleMenuControl: tokenized option typography. Dependency: `F-C30-03`.
- [ ] T-C30-04 Add or accept a focused regression for TextStyleMenuControl: selection and focus callback integration. Dependency: `F-C30-04`.
- [ ] T-C30-90 Verify TextStyleMenuControl public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C30-91 Verify TextStyleMenuControl instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C31: ColumnsLayoutModal

Scope: [src/components/ColumnsLayoutModal](../../src/components/ColumnsLayoutModal). Original scope: `M-31 E-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C31-01 Add or accept a focused regression for ColumnsLayoutModal: layout preset selection. Dependency: `F-C31-01`.
- [ ] T-C31-02 Add or accept a focused regression for ColumnsLayoutModal: draft reset on reopen. Dependency: `F-C31-02`.
- [ ] T-C31-03 Add or accept a focused regression for ColumnsLayoutModal: apply committed layout callback. Dependency: `F-C31-03`.
- [ ] T-C31-04 Add or accept a focused regression for ColumnsLayoutModal: cancel without commit. Dependency: `F-C31-04`.
- [ ] T-C31-90 Verify ColumnsLayoutModal public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C31-91 Verify ColumnsLayoutModal instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C32: ImageUploadModal

Scope: [src/components/ImageUploadModal](../../src/components/ImageUploadModal). Original scope: `M-32 E-06` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C32-01 Add or accept a focused regression for ImageUploadModal: picker and drop file selection. Dependency: `F-C32-01`.
- [ ] T-C32-02 Add or accept a focused regression for ImageUploadModal: nonempty file and MIME extension presentation checks. Dependency: `F-C32-02`.
- [ ] T-C32-03 Add or accept a focused regression for ImageUploadModal: preview and description draft. Dependency: `F-C32-03`.
- [ ] T-C32-04 Add or accept a focused regression for ImageUploadModal: host upload pending error and retry. Dependency: `F-C32-04`.
- [ ] T-C32-05 Add or accept a focused regression for ImageUploadModal: cancellation invalidates late results. Dependency: `F-C32-05`.
- [ ] T-C32-06 Add or accept a focused regression for ImageUploadModal: clean reopen and preview release. Dependency: `F-C32-06`.
- [ ] T-C32-90 Verify ImageUploadModal public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C32-91 Verify ImageUploadModal instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C33: LinkUrlModal

Scope: [src/components/LinkUrlModal](../../src/components/LinkUrlModal). Original scope: `M-33 E-06 E-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C33-01 Add or accept a focused regression for LinkUrlModal: shared owned destination validation. Dependency: `F-C33-01`.
- [ ] T-C33-02 Add or accept a focused regression for LinkUrlModal: Display-text and URL-or-null submit payload. Dependency: `F-C33-02`.
- [ ] T-C33-03 Add or accept a focused regression for LinkUrlModal: apply and Cancel draft behavior. Dependency: `F-C33-03`.
- [ ] T-C33-04 Add or accept a focused regression for LinkUrlModal: Configurable protocol and relative-path options. Dependency: `F-C33-04`.
- [ ] T-C33-90 Verify LinkUrlModal public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C33-91 Verify LinkUrlModal instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C34: PageRichTextEditorSection

Scope: [src/components/PageRichTextEditorSection](../../src/components/PageRichTextEditorSection). Original scope: `M-34 E-01–E-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C34-01 Add or accept a focused regression for PageRichTextEditorSection: owned Lexical configuration and saved nodes. Dependency: `F-C34-01`.
- [ ] T-C34-02 Add or accept a focused regression for PageRichTextEditorSection: document serialization preserving host data. Dependency: `F-C34-02`.
- [ ] T-C34-03 Add or accept a focused regression for PageRichTextEditorSection: live read-only state and keyboard focus. Dependency: `F-C34-03`.
- [ ] T-C34-04 Add or accept a focused regression for PageRichTextEditorSection: editorKey document replacement. Dependency: `F-C34-04`.
- [ ] T-C34-05 Add or accept a focused regression for PageRichTextEditorSection: formatting-preserving link edit. Dependency: `F-C34-05`.
- [ ] T-C34-06 Add or accept a focused regression for PageRichTextEditorSection: image source rejection placeholder. Dependency: `F-C34-06`.
- [ ] T-C34-07 Add or accept a focused regression for PageRichTextEditorSection: local object URL document lifetime. Dependency: `F-C34-07`.
- [ ] T-C34-08 Add or accept a focused regression for PageRichTextEditorSection: late host upload result invalidation. Dependency: `F-C34-08`.
- [ ] T-C34-09 Add or accept a focused regression for PageRichTextEditorSection: list and rule commands. Dependency: `F-C34-09`.
- [ ] T-C34-10 Add or accept a focused regression for PageRichTextEditorSection: scoped select-all and native copy. Dependency: `F-C34-10`.
- [ ] T-C34-90 Verify PageRichTextEditorSection public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C34-91 Verify PageRichTextEditorSection instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C35: Typefaces

Scope: [src/components/Typefaces](../../src/components/Typefaces). Original scope: `M-35` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C35-01 Add or accept a focused regression for Typefaces: owned typography role catalog. Dependency: `F-C35-01`.
- [ ] T-C35-02 Add or accept a focused regression for Typefaces: bodyAlt2 compatibility role. Dependency: `F-C35-02`.
- [ ] T-C35-03 Add or accept a focused regression for Typefaces: semantic element and visual role independence. Dependency: `F-C35-03`.
- [ ] T-C35-90 Verify Typefaces public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C35-91 Verify Typefaces instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C36: icons

Scope: [src/components/icons](../../src/components/icons). Original scope: `M-36 I-01–I-08` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C36-01 Add or accept a focused regression for icons: public icon name mapping. Dependency: `F-C36-01`.
- [ ] T-C36-02 Add or accept a focused regression for icons: native size color style and ref contract. Dependency: `F-C36-02`.
- [ ] T-C36-03 Add or accept a focused regression for icons: decorative versus meaningful labeling. Dependency: `F-C36-03`.
- [ ] T-C36-04 Add or accept a focused regression for icons: known and unknown activity icon mapping. Dependency: `F-C36-04`.
- [ ] T-C36-05 Add or accept a focused regression for icons: individual icon import paths. Dependency: `F-C36-05`.
- [ ] T-C36-90 Verify icons public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C36-91 Verify icons instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## C37: primitives

Scope: [src/components/primitives](../../src/components/primitives). Original scope: `M-37 U-01–U-20` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-C37-01 Add or accept a focused regression for primitives: public owned primitive and alias mapping. Dependency: `F-C37-01`.
- [ ] T-C37-02 Add or accept a focused regression for primitives: owned props without upstream type leakage. Dependency: `F-C37-02`.
- [ ] T-C37-03 Add or accept a focused regression for primitives: documented removed primitive APIs. Dependency: `F-C37-03`.
- [ ] T-C37-04 Add or accept a focused regression for primitives: relative imports into owned implementations. Dependency: `F-C37-04`.
- [ ] T-C37-90 Verify primitives public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-C37-91 Verify primitives instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P01: Box

Scope: [src/experimental/Box](../../src/experimental/Box). Original scope: `U-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P01-01 Add or accept a focused regression for Box: native element and ref. Dependency: `F-P01-01`.
- [ ] T-P01-02 Add or accept a focused regression for Box: owned spacing and native style. Dependency: `F-P01-02`.
- [ ] T-P01-90 Verify Box public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P01-91 Verify Box instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P02: Stack

Scope: [src/experimental/Stack](../../src/experimental/Stack). Original scope: `U-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P02-01 Add or accept a focused regression for Stack: direction alignment and gap. Dependency: `F-P02-01`.
- [ ] T-P02-02 Add or accept a focused regression for Stack: wrapping and logical spacing. Dependency: `F-P02-02`.
- [ ] T-P02-90 Verify Stack public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P02-91 Verify Stack instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P03: Surface

Scope: [src/experimental/Surface](../../src/experimental/Surface). Original scope: `U-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P03-01 Add or accept a focused regression for Surface: surface and elevation tokens. Dependency: `F-P03-01`.
- [ ] T-P03-02 Add or accept a focused regression for Surface: native element and styling. Dependency: `F-P03-02`.
- [ ] T-P03-90 Verify Surface public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P03-91 Verify Surface instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P04: Card

Scope: [src/experimental/Card](../../src/experimental/Card). Original scope: `U-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P04-01 Add or accept a focused regression for Card: card and CardContent slots. Dependency: `F-P04-01`.
- [ ] T-P04-02 Add or accept a focused regression for Card: owned padding and surface. Dependency: `F-P04-02`.
- [ ] T-P04-90 Verify Card public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P04-91 Verify Card instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P05: Divider

Scope: [src/experimental/Divider](../../src/experimental/Divider). Original scope: `U-02` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P05-01 Add or accept a focused regression for Divider: horizontal and vertical separator. Dependency: `F-P05-01`.
- [ ] T-P05-02 Add or accept a focused regression for Divider: decorative versus semantic role. Dependency: `F-P05-02`.
- [ ] T-P05-90 Verify Divider public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P05-91 Verify Divider instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P06: Typography

Scope: [src/experimental/Typography](../../src/experimental/Typography). Original scope: `U-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P06-01 Add or accept a focused regression for Typography: semantic element selection. Dependency: `F-P06-01`.
- [ ] T-P06-02 Add or accept a focused regression for Typography: all owned roles including bodyAlt2. Dependency: `F-P06-02`.
- [ ] T-P06-90 Verify Typography public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P06-91 Verify Typography instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P07: Button

Scope: [src/experimental/Button](../../src/experimental/Button). Original scope: `U-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P07-01 Add or accept a focused regression for Button: press once and native submit type. Dependency: `F-P07-01`.
- [ ] T-P07-02 Add or accept a focused regression for Button: variant tone density and pending. Dependency: `F-P07-02`.
- [ ] T-P07-90 Verify Button public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P07-91 Verify Button instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P08: IconButton

Scope: [src/experimental/IconButton](../../src/experimental/IconButton). Original scope: `U-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P08-01 Add or accept a focused regression for IconButton: accessible name and icon rendering. Dependency: `F-P08-01`.
- [ ] T-P08-02 Add or accept a focused regression for IconButton: press disabled and pending. Dependency: `F-P08-02`.
- [ ] T-P08-90 Verify IconButton public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P08-91 Verify IconButton instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P09: ButtonGroup

Scope: [src/experimental/ButtonGroup](../../src/experimental/ButtonGroup). Original scope: `U-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P09-01 Add or accept a focused regression for ButtonGroup: shared group border and divider. Dependency: `F-P09-01`.
- [ ] T-P09-02 Add or accept a focused regression for ButtonGroup: group density and action layout. Dependency: `F-P09-02`.
- [ ] T-P09-90 Verify ButtonGroup public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P09-91 Verify ButtonGroup instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P10: SplitAction

Scope: [src/experimental/SplitAction](../../src/experimental/SplitAction). Original scope: `U-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P10-01 Add or accept a focused regression for SplitAction: primary callback and secondary menu. Dependency: `F-P10-01`.
- [ ] T-P10-02 Add or accept a focused regression for SplitAction: neutral shared-border presentation. Dependency: `F-P10-02`.
- [ ] T-P10-90 Verify SplitAction public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P10-91 Verify SplitAction instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P11: TextField

Scope: [src/experimental/TextField](../../src/experimental/TextField). Original scope: `U-04 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P11-01 Add or accept a focused regression for TextField: controlled and default text value. Dependency: `F-P11-01`.
- [ ] T-P11-02 Add or accept a focused regression for TextField: label description and validation. Dependency: `F-P11-02`.
- [ ] T-P11-03 Add or accept a focused regression for TextField: native name value and reset. Dependency: `F-P11-03`.
- [ ] T-P11-90 Verify TextField public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P11-91 Verify TextField instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P12: TextArea

Scope: [src/experimental/TextArea](../../src/experimental/TextArea). Original scope: `U-04 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P12-01 Add or accept a focused regression for TextArea: controlled and default multiline value. Dependency: `F-P12-01`.
- [ ] T-P12-02 Add or accept a focused regression for TextArea: label and validation association. Dependency: `F-P12-02`.
- [ ] T-P12-03 Add or accept a focused regression for TextArea: native reset and read-only behavior. Dependency: `F-P12-03`.
- [ ] T-P12-90 Verify TextArea public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P12-91 Verify TextArea instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P13: Checkbox

Scope: [src/experimental/Checkbox](../../src/experimental/Checkbox). Original scope: `U-05 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P13-01 Add or accept a focused regression for Checkbox: controlled default and mixed state. Dependency: `F-P13-01`.
- [ ] T-P13-02 Add or accept a focused regression for Checkbox: space activation and disabled guard. Dependency: `F-P13-02`.
- [ ] T-P13-03 Add or accept a focused regression for Checkbox: native name value and reset. Dependency: `F-P13-03`.
- [ ] T-P13-90 Verify Checkbox public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P13-91 Verify Checkbox instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P14: Switch

Scope: [src/experimental/Switch](../../src/experimental/Switch). Original scope: `U-05 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P14-01 Add or accept a focused regression for Switch: controlled and default checked state. Dependency: `F-P14-01`.
- [ ] T-P14-02 Add or accept a focused regression for Switch: accessible switch labeling. Dependency: `F-P14-02`.
- [ ] T-P14-03 Add or accept a focused regression for Switch: native form value and reset. Dependency: `F-P14-03`.
- [ ] T-P14-90 Verify Switch public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P14-91 Verify Switch instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P15: RadioGroup

Scope: [src/experimental/RadioGroup](../../src/experimental/RadioGroup). Original scope: `U-05 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P15-01 Add or accept a focused regression for RadioGroup: owned string option identity. Dependency: `F-P15-01`.
- [ ] T-P15-02 Add or accept a focused regression for RadioGroup: arrow selection and disabled skipping. Dependency: `F-P15-02`.
- [ ] T-P15-03 Add or accept a focused regression for RadioGroup: native submitted value and reset. Dependency: `F-P15-03`.
- [ ] T-P15-90 Verify RadioGroup public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P15-91 Verify RadioGroup instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P16: Select

Scope: [src/experimental/Select](../../src/experimental/Select). Original scope: `U-06 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P16-01 Add or accept a focused regression for Select: owned option IDs and controlled value. Dependency: `F-P16-01`.
- [ ] T-P16-02 Add or accept a focused regression for Select: selection and disabled options. Dependency: `F-P16-02`.
- [ ] T-P16-03 Add or accept a focused regression for Select: native serialization and reset. Dependency: `F-P16-03`.
- [ ] T-P16-90 Verify Select public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P16-91 Verify Select instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P17: ComboBox

Scope: [src/experimental/ComboBox](../../src/experimental/ComboBox). Original scope: `U-06 U-18` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P17-01 Add or accept a focused regression for ComboBox: query filtering and owned option IDs. Dependency: `F-P17-01`.
- [ ] T-P17-02 Add or accept a focused regression for ComboBox: keyboard selection and disabled options. Dependency: `F-P17-02`.
- [ ] T-P17-03 Add or accept a focused regression for ComboBox: empty and read-only presentation. Dependency: `F-P17-03`.
- [ ] T-P17-04 Add or accept a focused regression for ComboBox: native serialization and reset. Dependency: `F-P17-04`.
- [ ] T-P17-90 Verify ComboBox public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P17-91 Verify ComboBox instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P18: AsyncMultiSelect

Scope: [src/experimental/AsyncMultiSelect](../../src/experimental/AsyncMultiSelect). Original scope: `U-06 H-05` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P18-01 Add or accept a focused regression for AsyncMultiSelect: host query and result callback. Dependency: `F-P18-01`.
- [ ] T-P18-02 Add or accept a focused regression for AsyncMultiSelect: multiple selected IDs outside results. Dependency: `F-P18-02`.
- [ ] T-P18-03 Add or accept a focused regression for AsyncMultiSelect: loading error retry and empty states. Dependency: `F-P18-03`.
- [ ] T-P18-04 Add or accept a focused regression for AsyncMultiSelect: cancel and reject stale query results. Dependency: `F-P18-04`.
- [ ] T-P18-05 Add or accept a focused regression for AsyncMultiSelect: remove token and retain usable focus. Dependency: `F-P18-05`.
- [ ] T-P18-90 Verify AsyncMultiSelect public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P18-91 Verify AsyncMultiSelect instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P19: Menu

Scope: [src/experimental/Menu](../../src/experimental/Menu). Original scope: `U-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P19-01 Add or accept a focused regression for Menu: owned item actions and checked state. Dependency: `F-P19-01`.
- [ ] T-P19-02 Add or accept a focused regression for Menu: keyboard navigation and disabled skipping. Dependency: `F-P19-02`.
- [ ] T-P19-03 Add or accept a focused regression for Menu: compact menu and close callback. Dependency: `F-P19-03`.
- [ ] T-P19-90 Verify Menu public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P19-91 Verify Menu instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P20: Popover

Scope: [src/experimental/Popover](../../src/experimental/Popover). Original scope: `U-07 U-19` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P20-01 Add or accept a focused regression for Popover: controlled and default open state. Dependency: `F-P20-01`.
- [ ] T-P20-02 Add or accept a focused regression for Popover: trigger focus return and dismissal. Dependency: `F-P20-02`.
- [ ] T-P20-03 Add or accept a focused regression for Popover: scope locale and direction in portal. Dependency: `F-P20-03`.
- [ ] T-P20-90 Verify Popover public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P20-91 Verify Popover instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P21: Tooltip

Scope: [src/experimental/Tooltip](../../src/experimental/Tooltip). Original scope: `U-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P21-01 Add or accept a focused regression for Tooltip: keyboard focus and hover description. Dependency: `F-P21-01`.
- [ ] T-P21-02 Add or accept a focused regression for Tooltip: escape dismissal. Dependency: `F-P21-02`.
- [ ] T-P21-03 Add or accept a focused regression for Tooltip: owned portal scope and placement. Dependency: `F-P21-03`.
- [ ] T-P21-90 Verify Tooltip public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P21-91 Verify Tooltip instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P22: Dialog

Scope: [src/experimental/Dialog](../../src/experimental/Dialog). Original scope: `U-08` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P22-01 Add or accept a focused regression for Dialog: title description and owned dismissal reasons. Dependency: `F-P22-01`.
- [ ] T-P22-02 Add or accept a focused regression for Dialog: focus entry containment and return. Dependency: `F-P22-02`.
- [ ] T-P22-03 Add or accept a focused regression for Dialog: scroll locking and nested dismissal. Dependency: `F-P22-03`.
- [ ] T-P22-04 Add or accept a focused regression for Dialog: portal scope inheritance. Dependency: `F-P22-04`.
- [ ] T-P22-90 Verify Dialog public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P22-91 Verify Dialog instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P23: Tabs

Scope: [src/experimental/Tabs](../../src/experimental/Tabs). Original scope: `U-09` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P23-01 Add or accept a focused regression for Tabs: owned tab IDs and associated panels. Dependency: `F-P23-01`.
- [ ] T-P23-02 Add or accept a focused regression for Tabs: manual versus automatic activation. Dependency: `F-P23-02`.
- [ ] T-P23-03 Add or accept a focused regression for Tabs: orientation direction and disabled skipping. Dependency: `F-P23-03`.
- [ ] T-P23-90 Verify Tabs public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P23-91 Verify Tabs instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P24: Link

Scope: [src/experimental/Link](../../src/experimental/Link). Original scope: `U-10 H-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P24-01 Add or accept a focused regression for Link: native anchor fallback and ref. Dependency: `F-P24-01`.
- [ ] T-P24-02 Add or accept a focused regression for Link: host navigation callback with replace. Dependency: `F-P24-02`.
- [ ] T-P24-03 Add or accept a focused regression for Link: target download and external attributes. Dependency: `F-P24-03`.
- [ ] T-P24-90 Verify Link public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P24-91 Verify Link instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P25: Breadcrumbs

Scope: [src/experimental/Breadcrumbs](../../src/experimental/Breadcrumbs). Original scope: `U-10` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P25-01 Add or accept a focused regression for Breadcrumbs: owned routed ancestor links. Dependency: `F-P25-01`.
- [ ] T-P25-02 Add or accept a focused regression for Breadcrumbs: current page semantics. Dependency: `F-P25-02`.
- [ ] T-P25-03 Add or accept a focused regression for Breadcrumbs: long ancestor label wrapping. Dependency: `F-P25-03`.
- [ ] T-P25-90 Verify Breadcrumbs public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P25-91 Verify Breadcrumbs instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P26: Navigation

Scope: [src/experimental/Navigation](../../src/experimental/Navigation). Original scope: `U-11 H-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P26-01 Add or accept a focused regression for Navigation: navigation and NavigationItem exports. Dependency: `F-P26-01`.
- [ ] T-P26-02 Add or accept a focused regression for Navigation: selected and expanded item state. Dependency: `F-P26-02`.
- [ ] T-P26-03 Add or accept a focused regression for Navigation: owned host links and action items. Dependency: `F-P26-03`.
- [ ] T-P26-90 Verify Navigation public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P26-91 Verify Navigation instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P27: List

Scope: [src/experimental/List](../../src/experimental/List). Original scope: `U-11` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P27-01 Add or accept a focused regression for List: list and all item text icon button exports. Dependency: `F-P27-01`.
- [ ] T-P27-02 Add or accept a focused regression for List: native list versus interactive item semantics. Dependency: `F-P27-02`.
- [ ] T-P27-03 Add or accept a focused regression for List: selected and disabled item presentation. Dependency: `F-P27-03`.
- [ ] T-P27-90 Verify List public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P27-91 Verify List instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P28: Disclosure

Scope: [src/experimental/Disclosure](../../src/experimental/Disclosure). Original scope: `U-11` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P28-01 Add or accept a focused regression for Disclosure: controlled and default expanded state. Dependency: `F-P28-01`.
- [ ] T-P28-02 Add or accept a focused regression for Disclosure: trigger and content association. Dependency: `F-P28-02`.
- [ ] T-P28-90 Verify Disclosure public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P28-91 Verify Disclosure instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P29: Collapse

Scope: [src/experimental/Collapse](../../src/experimental/Collapse). Original scope: `U-11` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P29-01 Add or accept a focused regression for Collapse: expanded content visibility. Dependency: `F-P29-01`.
- [ ] T-P29-02 Add or accept a focused regression for Collapse: reduced-motion-compatible transition. Dependency: `F-P29-02`.
- [ ] T-P29-90 Verify Collapse public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P29-91 Verify Collapse instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P30: Chip

Scope: [src/experimental/Chip](../../src/experimental/Chip). Original scope: `U-12` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P30-01 Add or accept a focused regression for Chip: owned token label and tone. Dependency: `F-P30-01`.
- [ ] T-P30-02 Add or accept a focused regression for Chip: remove action accessible name. Dependency: `F-P30-02`.
- [ ] T-P30-90 Verify Chip public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P30-91 Verify Chip instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P31: Badge

Scope: [src/experimental/Badge](../../src/experimental/Badge). Original scope: `U-12` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P31-01 Add or accept a focused regression for Badge: badge value and overflow presentation. Dependency: `F-P31-01`.
- [ ] T-P31-02 Add or accept a focused regression for Badge: accessible count description. Dependency: `F-P31-02`.
- [ ] T-P31-90 Verify Badge public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P31-91 Verify Badge instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P32: TagGroup

Scope: [src/experimental/TagGroup](../../src/experimental/TagGroup). Original scope: `U-12` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P32-01 Add or accept a focused regression for TagGroup: owned token IDs and removal callback. Dependency: `F-P32-01`.
- [ ] T-P32-02 Add or accept a focused regression for TagGroup: keyboard token navigation. Dependency: `F-P32-02`.
- [ ] T-P32-03 Add or accept a focused regression for TagGroup: focus after token removal. Dependency: `F-P32-03`.
- [ ] T-P32-90 Verify TagGroup public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P32-91 Verify TagGroup instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P33: Progress

Scope: [src/experimental/Progress](../../src/experimental/Progress). Original scope: `U-13` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P33-01 Add or accept a focused regression for Progress: determinate min max value. Dependency: `F-P33-01`.
- [ ] T-P33-02 Add or accept a focused regression for Progress: indeterminate loading. Dependency: `F-P33-02`.
- [ ] T-P33-03 Add or accept a focused regression for Progress: finite fallback and accessible label. Dependency: `F-P33-03`.
- [ ] T-P33-90 Verify Progress public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P33-91 Verify Progress instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P34: Status

Scope: [src/experimental/Status](../../src/experimental/Status). Original scope: `U-13` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P34-01 Add or accept a focused regression for Status: owned status tone and message. Dependency: `F-P34-01`.
- [ ] T-P34-02 Add or accept a focused regression for Status: appropriate live-region priority. Dependency: `F-P34-02`.
- [ ] T-P34-90 Verify Status public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P34-91 Verify Status instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P35: Avatar

Scope: [src/experimental/Avatar](../../src/experimental/Avatar). Original scope: `U-14` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P35-01 Add or accept a focused regression for Avatar: image source and accessible label. Dependency: `F-P35-01`.
- [ ] T-P35-02 Add or accept a focused regression for Avatar: loading and failed-image fallback. Dependency: `F-P35-02`.
- [ ] T-P35-03 Add or accept a focused regression for Avatar: stable aspect ratio and owned size. Dependency: `F-P35-03`.
- [ ] T-P35-90 Verify Avatar public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P35-91 Verify Avatar instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P36: Table

Scope: [src/experimental/Table](../../src/experimental/Table). Original scope: `U-15` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P36-01 Add or accept a focused regression for Table: all semantic table part exports. Dependency: `F-P36-01`.
- [ ] T-P36-02 Add or accept a focused regression for Table: header associations and caption. Dependency: `F-P36-02`.
- [ ] T-P36-03 Add or accept a focused regression for Table: owned cell style and ref contracts. Dependency: `F-P36-03`.
- [ ] T-P36-90 Verify Table public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P36-91 Verify Table instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P37: Pagination

Scope: [src/experimental/Pagination](../../src/experimental/Pagination). Original scope: `U-15` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P37-01 Add or accept a focused regression for Pagination: page and page-size requests. Dependency: `F-P37-01`.
- [ ] T-P37-02 Add or accept a focused regression for Pagination: known unknown and empty totals. Dependency: `F-P37-02`.
- [ ] T-P37-03 Add or accept a focused regression for Pagination: disabled boundaries and translated labels. Dependency: `F-P37-03`.
- [ ] T-P37-90 Verify Pagination public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P37-91 Verify Pagination instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P38: ToggleButton

Scope: [src/experimental/ToggleButton](../../src/experimental/ToggleButton). Original scope: `U-16` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P38-01 Add or accept a focused regression for ToggleButton: controlled and default pressed state. Dependency: `F-P38-01`.
- [ ] T-P38-02 Add or accept a focused regression for ToggleButton: single and multiple ToggleButtonGroup selection. Dependency: `F-P38-02`.
- [ ] T-P38-03 Add or accept a focused regression for ToggleButton: disabled skipping and keyboard direction. Dependency: `F-P38-03`.
- [ ] T-P38-90 Verify ToggleButton public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P38-91 Verify ToggleButton instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P39: DateField

Scope: [src/experimental/DateField](../../src/experimental/DateField). Original scope: `K-02 K-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P39-01 Add or accept a focused regression for DateField: owned date-only and local datetime value. Dependency: `F-P39-01`.
- [ ] T-P39-02 Add or accept a focused regression for DateField: segment input and description association. Dependency: `F-P39-02`.
- [ ] T-P39-03 Add or accept a focused regression for DateField: native serialization and reset. Dependency: `F-P39-03`.
- [ ] T-P39-90 Verify DateField public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P39-91 Verify DateField instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P40: TimeField

Scope: [src/experimental/TimeField](../../src/experimental/TimeField). Original scope: `K-02 K-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P40-01 Add or accept a focused regression for TimeField: owned clock value and seconds. Dependency: `F-P40-01`.
- [ ] T-P40-02 Add or accept a focused regression for TimeField: segment editing and disabled behavior. Dependency: `F-P40-02`.
- [ ] T-P40-03 Add or accept a focused regression for TimeField: native serialization and reset. Dependency: `F-P40-03`.
- [ ] T-P40-90 Verify TimeField public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P40-91 Verify TimeField instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P41: Calendar

Scope: [src/experimental/Calendar](../../src/experimental/Calendar). Original scope: `K-02 K-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P41-01 Add or accept a focused regression for Calendar: selection focused date and visible month. Dependency: `F-P41-01`.
- [ ] T-P41-02 Add or accept a focused regression for Calendar: minimum maximum and unavailable dates. Dependency: `F-P41-02`.
- [ ] T-P41-03 Add or accept a focused regression for Calendar: host locale and direction. Dependency: `F-P41-03`.
- [ ] T-P41-04 Add or accept a focused regression for Calendar: multiple-date selection where supported. Dependency: `F-P41-04`.
- [ ] T-P41-90 Verify Calendar public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P41-91 Verify Calendar instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P42: DatePicker

Scope: [src/experimental/DatePicker](../../src/experimental/DatePicker). Original scope: `K-02 K-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P42-01 Add or accept a focused regression for DatePicker: synchronized field and calendar value. Dependency: `F-P42-01`.
- [ ] T-P42-02 Add or accept a focused regression for DatePicker: popover open clear and focus return. Dependency: `F-P42-02`.
- [ ] T-P42-03 Add or accept a focused regression for DatePicker: controlled commit and native reset. Dependency: `F-P42-03`.
- [ ] T-P42-90 Verify DatePicker public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P42-91 Verify DatePicker instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P43: DateRangePicker

Scope: [src/experimental/DateRangePicker](../../src/experimental/DateRangePicker). Original scope: `K-02 K-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P43-01 Add or accept a focused regression for DateRangePicker: owned start and end fields. Dependency: `F-P43-01`.
- [ ] T-P43-02 Add or accept a focused regression for DateRangePicker: range selection and clear. Dependency: `F-P43-02`.
- [ ] T-P43-03 Add or accept a focused regression for DateRangePicker: apply Cancel and focus return. Dependency: `F-P43-03`.
- [ ] T-P43-04 Add or accept a focused regression for DateRangePicker: native serialization and reset. Dependency: `F-P43-04`.
- [ ] T-P43-90 Verify DateRangePicker public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P43-91 Verify DateRangePicker instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P44: DateRangeSelector

Scope: [src/experimental/DateRangeSelector](../../src/experimental/DateRangeSelector). Original scope: `K-01–K-07 K-17` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P44-01 Add or accept a focused regression for DateRangeSelector: preset descriptions and draft selection. Dependency: `F-P44-01`.
- [ ] T-P44-02 Add or accept a focused regression for DateRangeSelector: apply commit and Cancel restoration. Dependency: `F-P44-02`.
- [ ] T-P44-03 Add or accept a focused regression for DateRangeSelector: multi-month range and typed endpoints. Dependency: `F-P44-03`.
- [ ] T-P44-04 Add or accept a focused regression for DateRangeSelector: unavailable-date explanation. Dependency: `F-P44-04`.
- [ ] T-P44-05 Add or accept a focused regression for DateRangeSelector: host-supplied date and availability data. Dependency: `F-P44-05`.
- [ ] T-P44-90 Verify DateRangeSelector public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P44-91 Verify DateRangeSelector instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P45: Provider

Scope: [src/experimental/Provider](../../src/experimental/Provider). Original scope: `D-16 H-06` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P45-01 Add or accept a focused regression for Provider: theme density locale and direction scope. Dependency: `F-P45-01`.
- [ ] T-P45-02 Add or accept a focused regression for Provider: host translation locale bridge. Dependency: `F-P45-02`.
- [ ] T-P45-03 Add or accept a focused regression for Provider: portal inheritance and nested overrides. Dependency: `F-P45-03`.
- [ ] T-P45-90 Verify Provider public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P45-91 Verify Provider instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P46: DataGrid

Scope: [src/experimental/DataGrid](../../src/experimental/DataGrid). Original scope: `P-06 G-25` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P46-01 Add or accept a focused regression for DataGrid: owned proof row and column contracts. Dependency: `F-P46-01`.
- [ ] T-P46-02 Add or accept a focused regression for DataGrid: tanStack processing with one state authority. Dependency: `F-P46-02`.
- [ ] T-P46-03 Add or accept a focused regression for DataGrid: controlled selection sort filter and page. Dependency: `F-P46-03`.
- [ ] T-P46-04 Add or accept a focused regression for DataGrid: owned column resize and reorder proof. Dependency: `F-P46-04`.
- [ ] T-P46-90 Verify DataGrid public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P46-91 Verify DataGrid instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## P47: icons

Scope: [src/experimental/icons](../../src/experimental/icons). Original scope: `I-01–I-08` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-P47-01 Add or accept a focused regression for icons: owned SVG factory and icon props. Dependency: `F-P47-01`.
- [ ] T-P47-02 Add or accept a focused regression for icons: direct icon and activity mapping. Dependency: `F-P47-02`.
- [ ] T-P47-03 Add or accept a focused regression for icons: individual import and decorative semantics. Dependency: `F-P47-03`.
- [ ] T-P47-90 Verify icons public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-P47-91 Verify icons instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S01: ThemeScope

Scope: [src/foundation/ThemeScope.tsx](../../src/foundation/ThemeScope.tsx). Original scope: `D-16 D-17` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S01-01 Add or accept a focused regression for ThemeScope: light dark and system setting. Dependency: `F-S01-01`.
- [ ] T-S01-02 Add or accept a focused regression for ThemeScope: nested density and token override. Dependency: `F-S01-02`.
- [ ] T-S01-03 Add or accept a focused regression for ThemeScope: server-safe initial scope attributes. Dependency: `F-S01-03`.
- [ ] T-S01-90 Verify ThemeScope public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S01-91 Verify ThemeScope instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S02: Tokens

Scope: [src/foundation/tokens.json](../../src/foundation/tokens.json). Original scope: `D-01–D-20` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S02-01 Add or accept a focused regression for Tokens: palette semantic and component aliases. Dependency: `F-S02-01`.
- [ ] T-S02-02 Add or accept a focused regression for Tokens: typography spacing size and surface scales. Dependency: `F-S02-02`.
- [ ] T-S02-03 Add or accept a focused regression for Tokens: deterministic generated CSS and typed references. Dependency: `F-S02-03`.
- [ ] T-S02-04 Add or accept a focused regression for Tokens: focus error selected and disabled roles. Dependency: `F-S02-04`.
- [ ] T-S02-90 Verify Tokens public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S02-91 Verify Tokens instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S03: CSSPipeline

Scope: [scripts/build.mjs](../../scripts/build.mjs). Original scope: `C-01–C-21 R-01` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S03-01 Add or accept a focused regression for CSSPipeline: compiled module classes and emitted styles. Dependency: `F-S03-01`.
- [ ] T-S03-02 Add or accept a focused regression for CSSPipeline: namespaced cascade layers and scoped normalization. Dependency: `F-S03-02`.
- [ ] T-S03-03 Add or accept a focused regression for CSSPipeline: stylesheet exports and asset paths. Dependency: `F-S03-03`.
- [ ] T-S03-04 Add or accept a focused regression for CSSPipeline: logical properties and owned customization slots. Dependency: `F-S03-04`.
- [ ] T-S03-90 Verify CSSPipeline public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S03-91 Verify CSSPipeline instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S04: NavigationAdapter

Scope: [src/adapters/navigation.tsx](../../src/adapters/navigation.tsx). Original scope: `H-01 H-03` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S04-01 Add or accept a focused regression for NavigationAdapter: native fallback and custom router provider. Dependency: `F-S04-01`.
- [ ] T-S04-02 Add or accept a focused regression for NavigationAdapter: pathname and replace request. Dependency: `F-S04-02`.
- [ ] T-S04-03 Add or accept a focused regression for NavigationAdapter: forwarded ref and link attributes. Dependency: `F-S04-03`.
- [ ] T-S04-90 Verify NavigationAdapter public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S04-91 Verify NavigationAdapter instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S05: AccountAdapter

Scope: [src/adapters/accounts.tsx](../../src/adapters/accounts.tsx). Original scope: `H-04 H-05` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S05-01 Add or accept a focused regression for AccountAdapter: organization and logout host callbacks. Dependency: `F-S05-01`.
- [ ] T-S05-02 Add or accept a focused regression for AccountAdapter: pending state and duplicate request guard. Dependency: `F-S05-02`.
- [ ] T-S05-03 Add or accept a focused regression for AccountAdapter: error delivery and result lifetime. Dependency: `F-S05-03`.
- [ ] T-S05-90 Verify AccountAdapter public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S05-91 Verify AccountAdapter instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S06: TranslationAdapter

Scope: [src/i18n/index.tsx](../../src/i18n/index.tsx). Original scope: `H-06–H-09` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S06-01 Add or accept a focused regression for TranslationAdapter: key namespace locale and values forwarding. Dependency: `F-S06-01`.
- [ ] T-S06-02 Add or accept a focused regression for TranslationAdapter: defaultMessage English fallback. Dependency: `F-S06-02`.
- [ ] T-S06-03 Add or accept a focused regression for TranslationAdapter: host-owned supported locale policy. Dependency: `F-S06-03`.
- [ ] T-S06-90 Verify TranslationAdapter public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S06-91 Verify TranslationAdapter instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S07: ICUFormatting

Scope: [src/i18n/icu.ts](../../src/i18n/icu.ts). Original scope: `H-08` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S07-01 Add or accept a focused regression for ICUFormatting: interpolation variable matching. Dependency: `F-S07-01`.
- [ ] T-S07-02 Add or accept a focused regression for ICUFormatting: plural and select message formatting. Dependency: `F-S07-02`.
- [ ] T-S07-03 Add or accept a focused regression for ICUFormatting: malformed message fallback. Dependency: `F-S07-03`.
- [ ] T-S07-90 Verify ICUFormatting public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S07-91 Verify ICUFormatting instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S08: PersistentState

Scope: [src/hooks/usePersistentState.ts](../../src/hooks/usePersistentState.ts). Original scope: `H-13 H-14` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S08-01 Add or accept a focused regression for PersistentState: opt-in local or session storage. Dependency: `F-S08-01`.
- [ ] T-S08-02 Add or accept a focused regression for PersistentState: versioned validation and in-memory fallback. Dependency: `F-S08-02`.
- [ ] T-S08-03 Add or accept a focused regression for PersistentState: key changes and independent view state. Dependency: `F-S08-03`.
- [ ] T-S08-90 Verify PersistentState public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S08-91 Verify PersistentState instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S09: PaginationState

Scope: [src/hooks/usePersistentPaginationModel.ts](../../src/hooks/usePersistentPaginationModel.ts). Original scope: `H-15 H-16` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S09-01 Add or accept a focused regression for PaginationState: positive safe integer page sizes. Dependency: `F-S09-01`.
- [ ] T-S09-02 Add or accept a focused regression for PaginationState: page-zero request on size or filter change. Dependency: `F-S09-02`.
- [ ] T-S09-03 Add or accept a focused regression for PaginationState: known-total clamp and unknown-total behavior. Dependency: `F-S09-03`.
- [ ] T-S09-90 Verify PaginationState public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S09-91 Verify PaginationState instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S10: AdminPresets

Scope: [src/components/AdminDataGridOptions.ts](../../src/components/AdminDataGridOptions.ts). Original scope: `M-39` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S10-01 Add or accept a focused regression for AdminPresets: course-named factory and Class compatibility. Dependency: `F-S10-01`.
- [ ] T-S10-02 Add or accept a focused regression for AdminPresets: canonical status options. Dependency: `F-S10-02`.
- [ ] T-S10-03 Add or accept a focused regression for AdminPresets: first-text and last-action visibility locks. Dependency: `F-S10-03`.
- [ ] T-S10-04 Add or accept a focused regression for AdminPresets: empty filter criteria and translated labels. Dependency: `F-S10-04`.
- [ ] T-S10-90 Verify AdminPresets public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S10-91 Verify AdminPresets instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S11: InstructorPresets

Scope: [src/components/InstructorDataGridOptions.ts](../../src/components/InstructorDataGridOptions.ts). Original scope: `M-39` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S11-01 Add or accept a focused regression for InstructorPresets: course-named factory and Class compatibility. Dependency: `F-S11-01`.
- [ ] T-S11-02 Add or accept a focused regression for InstructorPresets: canonical status options. Dependency: `F-S11-02`.
- [ ] T-S11-03 Add or accept a focused regression for InstructorPresets: first-text and last-action visibility locks. Dependency: `F-S11-03`.
- [ ] T-S11-04 Add or accept a focused regression for InstructorPresets: empty filter criteria and translated labels. Dependency: `F-S11-04`.
- [ ] T-S11-90 Verify InstructorPresets public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S11-91 Verify InstructorPresets instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S12: GridCells

Scope: [src/components/AppDataGrid](../../src/components/AppDataGrid). Original scope: `M-40 G-21` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S12-01 Add or accept a focused regression for GridCells: text and multiline truncation contract. Dependency: `F-S12-01`.
- [ ] T-S12-02 Add or accept a focused regression for GridCells: date and datetime localized fallbacks. Dependency: `F-S12-02`.
- [ ] T-S12-03 Add or accept a focused regression for GridCells: link and copyable cell callbacks. Dependency: `F-S12-03`.
- [ ] T-S12-04 Add or accept a focused regression for GridCells: escaped JSON and custom rendering. Dependency: `F-S12-04`.
- [ ] T-S12-05 Add or accept a focused regression for GridCells: image failure and action-menu cells. Dependency: `F-S12-05`.
- [ ] T-S12-90 Verify GridCells public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S12-91 Verify GridCells instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S13: GridHelpers

Scope: [src/components/AppDataGrid](../../src/components/AppDataGrid). Original scope: `M-41` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S13-01 Add or accept a focused regression for GridHelpers: owned column and action builders. Dependency: `F-S13-01`.
- [ ] T-S13-02 Add or accept a focused regression for GridHelpers: subheader and loading empty parts. Dependency: `F-S13-02`.
- [ ] T-S13-03 Add or accept a focused regression for GridHelpers: toolbar options and header sort menu. Dependency: `F-S13-03`.
- [ ] T-S13-90 Verify GridHelpers public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S13-91 Verify GridHelpers instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S14: PublicExports

Scope: [src/index.ts](../../src/index.ts). Original scope: `M-42 R-03 R-05` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S14-01 Add or accept a focused regression for PublicExports: root component and granular exports. Dependency: `F-S14-01`.
- [ ] T-S14-02 Add or accept a focused regression for PublicExports: owned model and callback declarations. Dependency: `F-S14-02`.
- [ ] T-S14-03 Add or accept a focused regression for PublicExports: react peers and CSS sideEffects. Dependency: `F-S14-03`.
- [ ] T-S14-04 Add or accept a focused regression for PublicExports: explicit source client directives. Dependency: `F-S14-04`.
- [ ] T-S14-90 Verify PublicExports public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S14-91 Verify PublicExports instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S15: SavedEditorNodes

Scope: [src/components/PageRichTextEditorSection/lexical](../../src/components/PageRichTextEditorSection/lexical). Original scope: `E-02 E-07` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S15-01 Add or accept a focused regression for SavedEditorNodes: image metadata and JSON preservation. Dependency: `F-S15-01`.
- [ ] T-S15-02 Add or accept a focused regression for SavedEditorNodes: saved code-highlight node registration. Dependency: `F-S15-02`.
- [ ] T-S15-03 Add or accept a focused regression for SavedEditorNodes: rule selection and root caret handling. Dependency: `F-S15-03`.
- [ ] T-S15-04 Add or accept a focused regression for SavedEditorNodes: saved and pasted inert rejected links. Dependency: `F-S15-04`.
- [ ] T-S15-90 Verify SavedEditorNodes public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S15-91 Verify SavedEditorNodes instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S16: EditorUploadLifetime

Scope: [src/components/PageRichTextEditorSection](../../src/components/PageRichTextEditorSection). Original scope: `E-06` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S16-01 Add or accept a focused regression for EditorUploadLifetime: local preview retained through undo. Dependency: `F-S16-01`.
- [ ] T-S16-02 Add or accept a focused regression for EditorUploadLifetime: owned URLs released on reset and unmount. Dependency: `F-S16-02`.
- [ ] T-S16-03 Add or accept a focused regression for EditorUploadLifetime: host URLs remain host-owned. Dependency: `F-S16-03`.
- [ ] T-S16-04 Add or accept a focused regression for EditorUploadLifetime: cancelled upload result ignored. Dependency: `F-S16-04`.
- [ ] T-S16-90 Verify EditorUploadLifetime public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S16-91 Verify EditorUploadLifetime instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S17: DateContracts

Scope: [src/experimental/DateRangeSelector/date-contract.ts](../../src/experimental/DateRangeSelector/date-contract.ts). Original scope: `H-10 H-11 K-10` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S17-01 Add or accept a focused regression for DateContracts: serializable date-only local datetime and instant. Dependency: `F-S17-01`.
- [ ] T-S17-02 Add or accept a focused regression for DateContracts: valid parsing and callback payload. Dependency: `F-S17-02`.
- [ ] T-S17-03 Add or accept a focused regression for DateContracts: host timezone conversion boundary. Dependency: `F-S17-03`.
- [ ] T-S17-90 Verify DateContracts public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S17-91 Verify DateContracts instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.

## S18: Models

Scope: [src/models.ts](../../src/models.ts). Original scope: `A-14 E-09 E-10` in the [scope ledger](react-aria-scope-ledger.md).

- [ ] T-S18-01 Add or accept a focused regression for Models: course terminology for new models. Dependency: `F-S18-01`.
- [ ] T-S18-02 Add or accept a focused regression for Models: class compatibility exports. Dependency: `F-S18-02`.
- [ ] T-S18-03 Add or accept a focused regression for Models: presentation-only data independent of HTTP contracts. Dependency: `F-S18-03`.
- [ ] T-S18-90 Verify Models public contract in a consuming composition or typed fixture; cover the exposed callback/ref/value shape rather than private internals.
- [ ] T-S18-91 Verify Models instance isolation and lifecycle behavior where state/resources exist; for pure utilities verify repeated deterministic calls.
