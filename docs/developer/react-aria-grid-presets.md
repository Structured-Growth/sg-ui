# Owned catalog grid presets

Task: M-39. Admin and instructor option presets use owned toolbar contracts.
Existing `adminClasses*`, `adminPeople*`, `instructorClasses*` and
`instructorClassLearners*` exports remain English compatibility defaults.

Use `createAdminCourseGridOptions`, `createAdminPeopleGridOptions`,
`createInstructorCourseGridOptions` or `createInstructorCourseLearnersGridOptions`
with the host translation adapter's `t` function for localized labels. Every
lookup includes an English `defaultMessage` and the `common.ui` namespace. Call
`useNamespace("common.ui")` in the consuming view and recreate label options when
the host locale changes. Calling a factory without a translator works in English.
New factory names use Course terminology; preserved column identifiers such as
`className` still match existing host datasets.

Each call returns fresh `columnOptions`, `sortOptions`, `filterFields`,
`defaultSortRules` and `defaultFilterRules`. Start each view's state from those
empty rule arrays; no implicit sorting or status filter is applied. “All” is the
absence of a rule, rather than an empty enum value. Changes to one view's arrays
or enum labels cannot affect another factory result. Admin people retains its
existing name-only sorting options and supplies no static filter fields because
its status/membership vocabulary remains host-owned.

All columns start visible. The first text column and final `actions` column have
`locked: true`, making them unavailable for hiding in the owned columns menu.
The action column is excluded from sorting and filtering. Pass `columnOptions`
directly to DataToolbar, or use them as AppDataGridShell's `baseColumnOptions`.
Match these locks in host-defined grid column contracts as well; these presets
provide toolbar options, not row renderers or complete grid column definitions.

`adminCourseStatuses`, `instructorCourseStatuses` and
`instructorCourseLearnerStatuses` are immutable canonical presentation status
records. Filter factories derive translated enum options from them. They are UI
vocabularies, independent of application HTTP/database contracts; the host owns
any mapping to its backend.

The colocated catalog preset stories wire columns, sort rules and filter rules
through controlled DataToolbar state. Hosts own filtering, page-zero resets,
per-view persistence, refresh and requests. See [catalog integration](react-aria-catalog-grid.md)
and [toolbar contracts](react-aria-data-toolbar.md). Load `/styles.css` and provide
Provider or ThemeScope for these controls.
