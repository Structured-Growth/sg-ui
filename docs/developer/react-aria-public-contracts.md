# Owned public contracts and migration defaults

Use the component's exported prop type. Variant, size, tone and placement are
component-specific domains; there is no common upstream prop bag. Load
`@structured-growth/sg-ui/styles.css` once and put visual controls under `Provider`
or `ThemeScope`. Hooks and pure presentation models need no visual scope.

## Visual and overlay contracts

| Contract | Accepted values and omitted behavior |
| --- | --- |
| ThemeScope | `theme`: light/dark/system, root light; `density`: compact/comfortable, root comfortable; `interactionMode`: auto/pointer/touch, root auto. Nested unspecified values inherit. System theme resolves through CSS. |
| Button | `variant`: filled/outlined/text, default filled; `tone`: primary/neutral, default primary; type button and loading false. Density inherits the scope. Use `onPress()` and explicitly choose submit/reset for native form actions. |
| Typography | Variant body1, semantic element p and tone default when omitted. Its text tones are default/muted/subtle/accent/danger; primary remains an accent alias. Button's primary tone has a different role. |
| Menu | Placement bottom start/bottom end/top start/top end, default bottom start. Selection mode defaults multiple. Density inherits; catalog wrappers may explicitly choose compact. `onOpenChange` receives a boolean, not a dismissal reason. |
| Popover | Same four placement strings, default bottom start. Size md/lg/content, default md. Presentation popover/dialog/drawer/auto, default popover. Auto uses a narrow-screen drawer. `onOpenChange` receives a boolean. |
| Tooltip | Default top placement, 700ms open delay and 100ms close delay. It supplements an existing control name. |
| Dialog | Size xs/sm/md/lg/xl/full, default md. Controlled open, required `onDismiss(reason)`; outside and Escape allowed, close button shown by default. |
| AppModal | Same size domain, default sm; heightMode auto/sm/md/lg, default auto. Controlled open; optional `onClose(reason)`. Escape/backdrop locks default false; close button defaults hidden. The host owns persistence and closing after actions. |

Dialog and AppModal reasons are exactly `escape`, `outside`, `close-button` and
`dismiss`. The old `(event, reason)` callback must become a one-argument callback;
old `escapeKeyDown` maps to `escape` and `backdropClick` to `outside`. Handle explicit
close separately. A callback requests a host state change; it does not accept or
persist one. Dialog is the lower-level overlay; AppModal adds application actions,
step chrome and content sizing. See [modal contracts](react-aria-modal-shells.md).

## Field validation and commit ownership

`undefined` selects locally owned value state on the controls with a value/default
pair; keep that ownership mode stable. An explicit `null` clears the nullable
selection/date/time controls. TextField/TextArea use strings, with an empty string
for clear. A host-supplied value remains authoritative when it rejects a request.
Do not translate every empty value into null or treat a callback as a saved record.

TextField/TextArea use native form validation, host `invalid` and optional
`errorMessage`; their reset transaction restores the current default silently.
Date/time text entry keeps a visible draft apart from its committed civil value.
DateField defaults to segmented entry; choose `entryMode="text"` for date-only
freehand input. DatePicker date-only entry and TimeField default to text; choose
`entryMode="segments"` to retain segments. Datetime DateField/DatePicker entry
remains segmented. DateField defaults kind date. Date-only values
are YYYY-MM-DD; datetime values have no implicit timezone; TimeField exposes
HH:mm:ss. The host supplies reference anchors, availability and instant conversion.

Text date/time fields reveal host-invalid feedback immediately and local feedback
after blur, Enter or native invalid handling. Editing clears the local attempted
flag. Invalid drafts do not request a commit. Disabled/read-only text commits are
guarded. `onValidityChange` reports current validity for composition; it is not a
value-change callback or persistence signal. The exact grammar and bounds remain
in [calendar contracts](react-aria-calendar-contracts.md).

Message precedence differs: text DateField uses an availability reason, then
host errorMessage, then its translated fallback. Text TimeField uses host
errorMessage, then availability reason, then its translated fallback. Segmented
fields use their owned native-validation path. Do not assume one global validation
timing or message precedence across these implementations. DatePicker passes its
availability policy into DateField; its unavailable committed text-date value is
omitted from the named hidden value. Host server validation remains necessary.

## Grid and hook compatibility

AppDataGrid and AppDataGridShell enable selection when omitted. An extracted
consumer that previously omitted selection should now pass `selection={false}`
to retain that presentation. Existing `selection.selectedRowIds` and its callback
already used Set values; retain that shape. The removed upstream model alias and
engine parameter types are separate changes. Custom getRowId moves to the top
level and returns a stable string; the default converts numeric row.id to string.

Grid defaults are client mode, page zero, page size 25 and empty criteria/selected
IDs unless controlled, default or restored values apply. Checkbox selection is
enabled when omitted; use `selection={false}` to preserve the extracted wrapper
without a selection column. Selection, rows and errors
are excluded from saved grid view state. A size action requests page zero before
the size callback; the optional atomic footer callback supersedes legacy calls.
The two legacy footer callback props are still required by their public type.

Persistent hooks retain the key-first call but default to memory only. Opt into
local/session storage explicitly. Suggested page sizes 25/50/100 do not cap valid
custom sizes; use pageSizeOptions for a host policy. See
[pagination and storage](react-aria-pagination-state.md) and
[grid migration](react-aria-catalog-grid.md) for copyable controlled examples.

## Calendar and field-placement changes since the saved snapshot

Calendar, DatePicker and the range controls now default to `navigation="period"`:
month/year heading buttons open immediate in-place choices. Pass
`navigation="arrows"` to retain static headings, or `"month-year"` for direct
selects. `allowMonthSelection` and `allowYearSelection` default true; these control
heading affordances, while min/max and availability control selectable dates.

Calendar and range controls default to independent multi-month navigation. Pass
`calendarNavigation="linked"` for consecutive views moving together. Range endpoint
assignment (`calendarEndpoints`) is separate and applies to independent paged views.
DateRangeSelector now omits endpoint fields: set `showFields` explicitly to retain
the saved snapshot's inline fields. DateRangePicker already omitted them.

DateRangeSelector and DateRangePicker now default `rangeClickBehavior` to
`"adjust-nearest"`, editing the closest civil-day endpoint of a complete range.
Equal distances use `nearestEndpointTieBreak="end"`. Use
`rangeClickBehavior="adjust-end"` for the saved snapshot's endpoint policy.
Navigation never commits dates; retain the control's Apply/Cancel and availability
rules. These changed omitted behaviors need release review even though the new
union members and optional configuration props are additive.

Supported fields inherit message placement from `FormFieldScope`: description
above the control, after its separate label, and validation below at the root.
Individual descriptionPlacement/errorPlacement settings win over scope values.
Switch, SearchField and AsyncMultiSelect expose descriptionPlacement only.
FormFieldScope renders no DOM or native form and does not own values, validation
or IDs. Use explicit placement to retain a previous host layout. See the
focused follow-up for naming, scope,
installed-declaration proof and remaining historical/release evidence.

See the inherited styling migration
for the original locked style/slot/system-prop mappings, and the
public boundary index for current naming,
composition, ref and visual domains.

## Release review

Removed upstream types/style props, changed callback arity and changed omitted
behavior are consumer migration changes even when a component name survives.
Preserved aliases (Provider, Typography primary and Class-prefixed names)
are not automatically deprecated. Course preset factories and optional controls
are additions; do not label every new export breaking.

When an intentional incompatible change affects an already released API, the
integrating Conventional Commit or final squash title must use `!` or an actual
`BREAKING CHANGE:` footer explaining the migration. A proposed title is not an
existing commit. Initial extraction is comparison provenance, not proof that its
API was published. The pre-first-release AppButton-to-Button consolidation needs
consumer instructions but does not establish a past published major boundary.
Semantic-release owns version calculation; never edit versions manually. A final
release requires the separate human-approved production process.
