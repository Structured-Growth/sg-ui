# Consumer integration

SGUI owns its public React contracts, tokens, styles and component compositions.
Applications own routing, data, authentication, translations and persistence.
Use the [architecture](developer/component-architecture.md) and
[backlog](developer/backlog.md) for current development requirements.

Load `@structured-growth/sg-ui/styles.css` once and wrap the application in
`Provider` or an appropriate `ThemeScope`. Use public root or declared subpath
imports; source imports within the library are relative. React and React DOM
18.3/19 are the only peer dependencies.

## Public APIs

Row dragging now shows only a handle by default. Opt into arrow controls with
`rowDrag.showMoveButtons: true`; `rowDrag.dragDisabled: true` disables the handle
while leaving enabled move buttons usable.

Row reorder callbacks include ordered `sourceRows` and `sourceRowIds` alongside the
initiating `sourceRow`/`sourceRowId`. Hosts must accept the full group: remove all
source IDs, then insert the source rows together before/after the target. Dragging
a selected row moves its selection; an unselected row moves independently.

Breaking change: the learner-specific grid component, its prop type, subpath and
column/sort option arrays are removed. Compose course collections with
`AppDataGridShell`, supplying `columns`, `label` and `getRowLabel`. Use column
`formatValue` callbacks for localized due dates and `createActionMenuColumn` for
host-supplied Details/Continue destinations. The shell already owns the shared
selection, sorting, filtering, pagination, persistence and row-action behavior.


Course presentation uses `CourseCardFrame`, `InstructorCourseCard`,
`LearnerCourseCard`, `LearnerCourse`, `CoursesViewMode`
and `CourseIcon`. InstructorCourseCard's content prop is `courseName`.
Administrative/instructor preset factories return fresh translated defaults and
use `courseName` for the course data field. Hosts provide their own action and
activity strings; cards render those strings verbatim.

Use `Provider` for the visual and interaction scope. Typography text tones are
`default`, `muted`, `subtle`, `accent` and `danger`. Component and prop references
are generated from built declarations in the [component catalog](/docs/components).

`AppPaginationFooter` and `CardCollectionWithFooter` require
`onPaginationModelChange({page, pageSize})`. A size change requests page zero and
the new size together. The host accepts the complete state transaction.

Persisted grid state uses only `sgui:grid:<view-key>:v1`. The grid does not read,
convert or clear other storage keys. Generic persisted state with a configured
version accepts only that version; the hook does not transform older data.

These API changes remove compatibility support. There are no old-name aliases,
shared preset-default arrays or callback fallback paths. Hosts must adopt the
current contracts. Versions are determined by release automation; this cleanup
does not publish or authorize a release.

## Host responsibilities

Use owned Button `onPress` actions, declared native class/style/ref props and
scoped tokens. See [primitives](developer/react-aria-primitives.md),
[theme](developer/react-aria-theme.md), [grid](developer/react-aria-catalog-grid.md),
[card pagination](developer/react-aria-card-pagination.md) and
[persistent view state](developer/persistent-view-state.md).

Hosts supply accessible names, contextual labels, router and translation
adapters, datasets, fetching, saving and account actions. Library components do
not import application APIs, sessions or framework routes.
