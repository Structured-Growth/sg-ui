# Calendar proof contracts and limits

Tasks: P-04/P-05, H-10/H-11, K-01/K-10/K-12/K-16, with partial K-17 evidence. The controls are experimental;
this is proof evidence, not completion of the production calendar/browser gates.

## Serializable values

| Domain | Owned value | Meaning |
| --- | --- | --- |
| Date only | `YYYY-MM-DD` string | Gregorian civil day, independent of timezone |
| Date range | `{start, end}` | Inclusive date-only endpoints, ordered start ≤ end |
| Local datetime | `YYYY-MM-DDTHH:mm:ss` | Civil datetime without a timezone or offset |
| Clock time | `HH:mm:ss` | Clock value without a date |
| Instant | ISO UTC string from `dateTimeToInstant` | Exact instant resolved using an explicit host timezone |

Public props and callbacks contain no upstream date classes. Internal calendar
values are converted back to Gregorian before serialization, including localized
calendar display. Consumers supply complete valid ISO values to segmented fields;
partial editing stays inside the interaction engine until it has a complete value.
The date-only validator rejects malformed strings and non-existent leap days.

`dateTimeToInstant(local, timeZone, disambiguation)` rejects daylight-saving gaps
and overlaps by default. A host may explicitly choose `earlier` or `later`;
there is no implicit browser timezone. Tests exercise both Chicago transitions,
Tokyo midnight crossing, and leap-day boundaries. This follows the installed
date utility's [documented conversion semantics](https://react-aria.adobe.com/internationalized/date/CalendarDateTime).

## Host conversion to an exclusive end

SGUI date ranges include both civil endpoints. If a host API uses an exclusive
end, advance the inclusive end by **one Gregorian civil day first**, then resolve
the start and new end at local midnight in the host's explicit reporting timezone.
Use `dateTimeToInstant` with an explicit DST disambiguation policy; handle rejection
rather than silently substituting an instant. Do not add 24 hours to an instant:
Chicago 2024-03-10 spans 23 hours and 2024-11-03 spans 25 hours between local
midnights. A February 29 inclusive end becomes March 1; December 31 becomes
January 1 of the next year. Reject overflow beyond 9999-12-31 in host conversion.
This conversion belongs to the host adapter and does not alter the picker value.

Local datetime ranges may cross midnight when the end's civil date advances.
Their minimum and maximum bounds are inclusive and retain seconds. A same-date
end earlier than the start is invalid; the control does not infer an overnight
date rollover. Hosts choose any API-specific datetime endpoint inclusivity and
convert the complete local endpoints using their timezone/DST policy.

## Selection and drafts

`Calendar` separates focused date from selected date and supports single or
arbitrary multiple dates. A keyboard arrow changes focus; activation changes
selection. The installed 1.21.1 interaction version has a native multiple-selection
contract, proven by selecting and removing noncontiguous February dates. The old
planning assumption that this necessarily requires lower-level hooks does not
apply to this version. No custom collection state is added merely to duplicate it.

`DateRangeSelector` defaults to keeping a draft until Apply. With
`commitBehavior="immediate"`, only complete valid edits commit; Cancel discards
unfinished edits without undoing earlier accepted selections. In Apply mode,
Cancel restores the committed range. Clear edits the draft and is disabled when
required; immediate mode also commits an allowed clear. Presets supply explicit
inclusive ranges and may include descriptions. A preset crossing a minimum,
maximum or unavailable day is disabled. Typed start/end segments and calendar
selection share one draft. When creating or restarting a range, a new calendar
anchor sets the draft start and clears the end. For day selection without fixed
`rangeLength`, a second activated date before or after that anchor completes a
sorted inclusive range under every `rangeClickBehavior`; completed-range edits follow that policy. Fixed length and
whole-period selection resolve complete ranges from one activation (see below).
Partial, typed reversed and unavailable drafts cannot Apply.
Controlled parent changes replace a draft only when serialized endpoints change.
After activating the first endpoint, a visually hidden translated `date-range-preview`
follows the interaction engine's highlighted range, including reverse and
cross-month keyboard navigation. A translated visually hidden context paragraph distinguishes
the current anchor, the focused endpoint and the local draft. Both
paragraphs describe only the currently focused date cell while the calendar has
interaction focus; moving focus removes the preview references from the prior cell.
The preview adds no extra live-status announcement on each arrow; the interaction
engine's announcements and existing draft/availability statuses remain unchanged.
The complete localized date-cell names remain intact. The first activation moves
focus to the nearest available endpoint; arrows
then adjust the preview. In this two-activation flow, Apply mode disables Apply
until the second endpoint is activated, so an unfinished selection cannot
accidentally commit the previous draft.
Cancel, Clear, presets, typed edits, changed committed host values and native reset
invalidate the pending anchor. Leaving the calendar cancels an unfinished preview
without synthesizing a second endpoint. The incomplete draft remains editable
until completed or discarded with Cancel. A preview is
neither a draft commit nor submitted
form data; after completing both endpoints in Apply mode, Apply still controls
the commit.
Completion and the existing anchor invalidation paths remove the preview/context
paragraphs and their focused-cell associations. Replacing a controlled host value
with the same serialized endpoints preserves the pending selection. At unavailable
boundaries, the context describes the interaction engine's constrained focused
endpoint; it does not imply that an unavailable endpoint can be selected.

`DatePicker` commits single-date field/calendar changes immediately. Its name
participates in native form data. Its segmented or text input and calendar action
share one bordered control row with an inner divider and logical rounded ends.
Labels remain above; help and validation text remain below the complete row.
The private DateField composition slot keeps the native input/segment ref and
calendar Button as separate keyboard targets, without label-height offsets.
`DateRangePicker` opens the advanced selector,
commits on Apply and closes on Cancel/Escape. Both restore trigger focus and
reset uncontrolled committed values when their containing native form resets;
the host can prevent reset. Controlled values always remain host-owned.

`DateField` and `TimeField` use native validation and form participation, with
keyboard-editable segments or time text entry, descriptions/errors and controlled/uncontrolled
contracts. Standalone range-selector hidden fields submit committed values,
not an unconfirmed draft. Its nearest native form reset restores uncontrolled
committed defaults and the draft, or restores the draft to the controlled host
value. Preventing the native reset preserves both values. A host `form.reset()` while
calendar focus remains inside also preserves the pending preview; moving focus
outside cancels that preview independently of form reset.
Segmented fields' reset requests are suppressed during that transaction so they
cannot independently overwrite one endpoint. Reset does not emit a commit callback. Range controls defer the transaction to a
new task, because native dispatch can run a microtask before React's delegated
host reset handler has prevented the event.
A required range disables Apply when empty; the host
must enforce a required committed range in its final submission validation.

<a id="initial-scope-and-accessibility-limits"></a>

## Current scope and accessibility limits

The experimental calendar family includes arbitrary multiple civil dates, inclusive
ranges, local datetime/time fields, Gregorian week/month/quarter/year selectors
and atomic comparison periods. Comparison modes are none, adjacent equal-length
previous period, previous-year endpoint shifts with leap-day clamping, or
host-selected custom dates. Fiscal/business/holiday policies remain host-resolved
presets; no recurrence/resource-scheduling or booking-persistence engine is
provided. All accepted values use the owned serializable contracts. Hosts choose
a reporting civil reference date, timezone and DST disambiguation explicitly.
PeriodPicker and DateRangeComparisonPicker expose these selected features; their
implementation does not imply completion of behavioral or browser acceptance.
Month/year navigation changes the visible calendar, while PeriodPicker selects a
whole Gregorian period. The feature details below retain those distinct contracts.

Presets are keyboard-operable single-select options. Their optional descriptions
are associated option descriptions and are visually hidden in the current
presentation. Range previews/context describe the focused endpoint without
replacing complete localized date names; supplemental day decorations are hidden
from accessible names. Static unavailable records have a keyboard/touch disclosure.
Host messages stay host-owned; unavailable dates cannot be activated. In Apply
mode, draft endpoints remain separate from accepted form data until Apply.

Range date buttons receive reason descriptions through a private native-ref
bridge after mounting. The bridge merges availability and focused-preview
IDs with existing description references and removes only its owned IDs when
associations change. This does not promise persistence of arbitrary post-mount
native attribute mutations across interaction-engine rerenders. The bridge is
needed because the interaction component filters labelable ARIA props; it does
not change the public prop or callback surface. Range focus also exposes the
unavailable date and reason in a visible status message. Hidden date descriptions
and the static availability disclosure render with the component; the button
associations attach after hydration.

### Validated availability corrections — 2026-10-16

The [wave-02-11 review](final-acceptance/wave-02-11/report.md#a-k-04--partial)
reproduced DatePicker typed availability bypass and missing non-hover explanations
for callback-only standalone Calendar restrictions. **BUG-0010 /
K04-datepicker-entry-parity** and **BUG-0011 / K17-callback-reason-access** are now
corrected. DatePicker text, segmented and datetime candidates share host
availability validation; invalid drafts preserve accepted form values and block
submission. Datetime Apply rechecks the current host policy. Calendar associates
callback/static reasons with full date names and supplies a keyboard-accessible
disclosure for the visible interval. It does not enumerate the host's entire
recurring or remote availability policy.

[Integrated receipts](final-acceptance/coordinator-integration/evidence.json)
retain supported Node 24 affected units, fresh library/type, package, docs and
private-fixture builds, and focused Chromium/Firefox/WebKit checks of typed,
segmented and datetime rejection/recovery, native form authority, dynamic host
policy changes and keyboard disclosure. The original failures remain dated
evidence. These targeted corrections do not close the broader K04/K07/K17
matrices, certify spoken assistive-technology output or establish physical-device
behavior. Calendar's private native-ref description bridge merges/removes only
its own IDs; the integration also narrows its private date type to CalendarDate
for the shipped cell contract without changing the public API.

Native clipboard, replacement-host browser matrices and spoken AT results retain
their actual evidence limits. Paste, autofill, touch, zoom and the full
locale/calendar/device matrix remain separate acceptance work. Parser/source and
DOM tests do not establish trusted clipboard outcomes or assistive-technology
conformance. Flexible text grammar below does not imply every segmented or
combined datetime field accepts those same paste formats. See
[K07-paste-contract](final-acceptance/wave-02-11/report.md#a-k-07--partial) and
[K17-native-and-AT](final-acceptance/wave-02-11/report.md#a-k-17--partial).

The host translation locale is supplied through `Provider`, which drives the
calendar's locale/direction. `ThemeScope.dir` alone controls visual direction and
does not establish an interaction locale. Examples demonstrate Arabic/German/
English display, availability and timezone conversion without application APIs;
these are representative scenarios, not all-locale certification.

### Historical browser receipts and uncompleted matrices

The [batch61 focused-endpoint evidence](parallel-batch-61/keyboard-range-preview.md)
records source/unit coverage and a Chromium light/dark shard passing 2/2 at its
recorded candidate/worker heads in
[`batch61-keyboard-range-preview.spec.ts`](../../packages/ui/tests/browser/batch61-keyboard-range-preview.spec.ts).
That dated shard covers focused association/removal, constrained unavailable
traversal, unchanged committed form data and Cancel; it does not establish current
changed-source browser results, spoken output or announcement timing.
Firefox/WebKit, actual assistive-technology/manual acceptance and the broader
locale/calendar/device/touch matrix remain pending for that slice.

Native browser scenarios in
[`batch01-calendar.spec.ts`](../../packages/ui/tests/browser/batch01-calendar.spec.ts)
cover leap-day/month-boundary previews, unavailable interior dates,
draft/Apply/Cancel/Clear/reset form transactions and picker Escape/focus return,
with civil endpoints exercised in Chicago and Tokyo timezones. Their retained
execution receipts remain dated evidence; listing the spec is not a new run.
The [wave-02-11 reconciliation](final-acceptance/wave-02-11/report.md) distinguishes
retained FA-04 evidence from changed inputs and its Node 26/jsdom defect probes.
No current browser, native clipboard, physical device or spoken AT execution is
claimed by this documentation update. K03–K10 and K17 retain their remaining
behavioral/matrix obligations independently of this feature-limit publication.

## Calendar sizing and flexible entry — 2026-10-16

Calendar grids reserve six week rows without stretching shorter months' day targets.
Day labels are centered in both directions. The website Calendar category groups
all six date/time controls; the Calendar page includes independent compact and
comfortable examples without host width overrides, a single-date dropdown and
one/two-month range dropdowns. Months fit seven day columns with no horizontal gaps: 24px compact pointer cell
height, 36px comfortable pointer cell height, and at least 44px touch targets.
A 12rem minimum month width keeps the heading and text navigation buttons usable.
They do not stretch across wider hosts. Two months wrap in narrow hosts; enlarged
text and touch targets retain the local grid scrollport when space is insufficient.

`DateField` adds `entryMode="text"` for date-only input; `segments` remains the default
and datetime continues to use segments. `DatePicker`, `DateRangeSelector` and
`DateRangePicker` pass through this choice. Text accepts ISO, YYYYMMDD, year-first
slash/dot dates, locale-ordered numeric dates with two- or four-digit years, and localized
or English month names. Valid input normalizes on blur/Enter to a localized Gregorian
display. Values/callbacks/form serialization remain ISO civil dates. Invalid dates
never roll over; timestamps and unsupported prose are rejected. Relative phrases require an explicit host referenceDate (see deterministic relative text below). Two-digit years use a fixed 1950–2049 window: 00–49 expand to 2000–2049 and 50–99 to 1950–1999. This applies to numeric and named-month text; other centuries require four digits. Host bounds are checked after expansion.
Ambiguous numeric order follows the active Provider locale, never a guessed order.
No browser Date.parse or implicit timezone conversion is used.

`onValidityChange` reports text-mode field validity for composed commit guards.
Invalid drafts remain editable and block native submission; disabled/read-only
fields preserve their native restrictions. Controlled hosts may reject an edit,
in which case the accepted value is displayed. Accepted native resets discard
text drafts without emitting changes; prevented resets preserve them.

Range text fields sit above the calendar and share its draft; invalid text blocks
Apply independently of the last valid endpoints. Cancel, Clear, presets, calendar
selection and native reset discard stale text errors. The range trigger displays
localized committed endpoints; the submitted endpoints remain ISO. `months={1}`
uses a single-month popup and `months={2}` uses adjacent months that stack in a
narrow host. These changes do not select deferred scheduler/booking features.

Range preview descriptions stay visually hidden, so they cannot resize the popup
between pointerdown and pointerup. One-month range popups fit the calendar and
endpoint fields, plus any side preset panel, bounded by the viewport;
inline-size containment must not collapse them to the trigger title width.
See [CAL-UX evidence](backlog-execution-2026-10-15.md#cal-ux--calendar-options-and-entry-2026-10-16).


## Configurable fixed and relative presets — 2026-10-16

`DateRangeSelector` and `DateRangePicker` accept `presetPlacement="side"` to place
`presets` beside the calendar area at logical start. `"end"` places them after
the calendars; `"above"` places them before the fields/calendars. Narrow hosts wrap
the choices above. `"side"` is the default. Presets render as single-select label
rows with selected semantics, a checkmark and subtle background, without
individual button outlines or a bordered preset card. Optional descriptions are
associated with options and visually hidden. Arrow keys navigate; Enter/Space
selects an available option. Choosing a preset edits the draft; default Apply
mode waits for Apply, while immediate mode commits a complete valid choice.
Bounds, unavailable ranges, disabled/read-only states, Cancel and reset retain
their contracts.

`DateRangePreset` remains an extensible host-supplied list of IDs, translated
labels, optional descriptions and resolved ISO endpoints. SGUI imposes no list of
named relative presets. The public experimental helper
`getRelativeDateRange(referenceDate, {unit, offset, weekStartsOn})` resolves full
inclusive Gregorian weeks, months or years. Offset zero selects the containing
period, -1 the previous period; weeks default to Monday and accept an explicit
Sunday-through-Saturday start (0–6). A full current period may include future
dates; it is not implicitly a period-to-date range.

The host supplies a civil reference date in its reporting timezone, decides when
to refresh it and chooses which helper results to include. The helper reads no
browser clock or locale and performs no implicit timezone conversion. Native form
data and onValueChange still return resolved endpoints, not a persisted relative
rule. Saving/re-evaluating a relative policy remains host-owned.

Custom periods such as last business week, holiday-adjusted weeks, fiscal years
or campaign dates use the same ordinary DateRangePreset values. No enum extension
or arbitrary English-label parser is required. The source-backed examples mix a
fixed autumn launch, This week/month/year, Last year and a custom Last business
week calculated by a Monday-Friday host policy without holiday adjustments. The
business option is an example, not a built-in or mandatory option.


## Connected range rows — 2026-10-16

DateRangeSelector and its picker render selected/previewed dates as continuous
bands within each week. Range grids have no horizontal cell gaps. Logical corner
rules round both corners at each interval endpoint, week-row edge and visible
month boundary, including RTL. A single-day interval has both caps. The styling
is scoped to range grids; Calendar's independent single/multiple dates keep their
separate rounded boxes. Native day targets, inset keyboard focus and the six-week
height reservation are preserved.

Forced colors uses connected outlined rows with Canvas/CanvasText and Highlight
borders/focus, preserving readable native text backplates and rounded caps without
disabling forced-color adjustment. Standard themes keep the owned filled selected
surface/text aliases. No new public prop or callback is required.


## Forward ranges and viewport fitting — 2026-10-16

The original Southwest-inspired earlier-end restart rule is superseded by the
owned `rangeClickBehavior` contract. Initial two-date creation with
`selectionUnit="day"` and no fixed `rangeLength` completes in either direction
under every `rangeClickBehavior`. Fixed length and whole-period selection instead
resolve a complete range from one activation. After a complete draft,
`adjust-end` (default)
keeps the start and edits the end, restarting on or before the start;
`adjust-start` mirrors that rule; `restart` always begins a new incomplete range;
`adjust-boundaries` extends the relevant outside boundary and edits the end for
inside clicks. In adjust-boundaries mode, clicking the start produces a one-day range and
clicking the end is unchanged. `active-endpoint` edits the selected Start/End
boundary; crossing the other boundary restarts with an incomplete range.
Typed endpoints/presets retain their own contracts.
React Aria still owns native press/drag, focus, bounds, availability and initial
range completion. A private anchor observer applies the owned completed-range
policy without replacing the state object or its identity-based cell metadata.
Presets, text entry, Cancel, native reset and changed host values invalidate
pending anchors. Only complete valid ranges reach onValueChange and committed
form values. Apply remains the default; the expanded family below adds immediate
commit and explicit active-endpoint editing.

Owned Popover positioning first retains native flipping when either side fits.
When neither side fits, its positioning target shifts vertically within the
visual viewport before constraining height. This allows a date dropdown to overlap
its trigger while displaying the whole calendar. Content scrolls only when its
natural height exceeds the viewport minus the positioner's 12px edge clearance.
One position owner still handles native focus, ancestor scrolling, resize and
visual-viewport geometry; no host/document scroll or hard-coded calendar height
is introduced. All Popover consumers inherit this collision behavior.

## Analytics reference inventory — 2026-10-16

The user supplied `date-picker.avif`, `dates-1024x358.jpg` and
`thread-131868502-7019530899921192485.png`. All three were inspected; the AVIF was
decoded to a temporary PNG for inspection only. They illustrate one family of
controls, not three unrelated picker implementations.

| Reference requirement | Component boundary | Current status |
| --- | --- | --- |
| One, two or three consecutive visible months | Calendar / DateRangeSelector configuration, inherited by DateRangePicker | Implemented: `months={1}`, `months={2}` or `months={3}`; shared selection/navigation, minimum month width, responsive wrapping |
| Presets above, before or after calendars | DateRangeSelector configuration, inherited by DateRangePicker | Implemented: `presetPlacement="above"`, `"side"` (logical start), `"end"` (logical end); DOM and visual order agree |
| Fixed and relative quick choices | Existing host-configurable preset data | Supported; full weeks/months/years have a helper; rolling days and period-to-date rules can be host-resolved |
| Direct month/year jumps | Header navigation configuration on the shared calendar implementation | CAL-REF-03: implemented with navigation="month-year" and visibleYears; arrows, native focus and host min/max policy remain |
| Independently navigable From/To calendars, including nonconsecutive months | A new endpoint-navigation view of the same single-range control | CAL-REF-04: implemented via calendarNavigation="independent", with shared range and separate month navigation |
| Vertical scrolling through months | A new calendar layout/navigation mode | CAL-REF-05: implemented via calendarLayout="scroll" and scrollMonths; distinct bounded month browser, separate from overheight overlay scrolling |
| Last / Current / Custom categories and nested relative choices | Preset presentation composed with an owned Select category control | CAL-REF-06: implemented via nested presetGroups and an owned category selector; host retains resolved range semantics and explicit reference date |
| Compare with previous period, previous year or a custom range | New composed comparison selector and dropdown wrapper | CAL-REF-07: implemented by public DateRangeComparisonPicker with previous-period, previous-year and custom atomic comparisons |

The configuration leaves, independent navigation, month browser, grouped presets
and comparison picker are implemented with source-backed examples and controls.
Their functionality evidence is separate from broad acceptance matrices.

The comparison composition needs a primary range, an optional comparison range,
comparison mode/enablement and a single Apply/Cancel transaction. Reuse shared date
fields and calendar rendering, but do not stack two independently committing range
selectors behind an outer Apply button. Cancel must restore both committed ranges;
controlled host authority, bounds, validation, reset and named native form fields
must remain clear. Relative comparison rules must specify inclusive duration,
leap-day/year alignment and the host's reporting timezone. Business/fiscal/holiday
comparison policies remain host-supplied. Preserve relative preset identity/mode
separately when the host needs it; resolved date endpoints alone cannot encode it.
Simultaneous primary/comparison highlighting needs distinct labels and accessible
non-color cues for overlap, keyboard focus and forced colors. Shared comparison
state belongs in the composition rather than being imposed on basic Calendar.

These are functionality leaves in the user's requested order, separate from
existing editor V / all-library A and future acceptance counts. They do not reopen
or claim completion of historical migration IDs.

## Optional titles and month navigation

Calendar, DateRangeSelector, DatePicker and DateRangePicker default showTitle to false. Their required labels continue to name the accessible calendar or dialog; picker field labels remain visible. Set showTitle to true for a visible title. Pickers render that title once on the popover, leaving the nested calendar title hidden. Generic Popover retains its visible-title default and accepts showTitle=false while keeping its accessible dialog name. The month/year is aligned to logical start (left in LTR), with both previous/next controls at logical end. Linked multi-month views group both controls in the last month header; independent views retain a pair in each header.


## Birthday entry and date/time selection research (2026-10-16)

GOV.UK recommends date input for memorable dates that users already know
([Date input](https://design-system.service.gov.uk/components/date-input/)).
The birthday examples therefore start empty and permit direct entry rather than
requiring a calendar. The optional calendar offers explicit month/year controls.
WAI's [date picker dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
establishes keyboard month/year navigation and restoring focus after dismissal.
React Aria's [month/year picker contract](https://react-aria.adobe.com/Calendar#month-and-year-pickers)
provides localized year/era and calendar-month choices through the existing state.

Implementation: navigation="month-year" adds localized dropdowns inside a single
month heading row; multi-month views place the shared focus-navigation controls
above the months so each grid keeps its correct month heading. Arrows remain. Calendar, both range controls and DatePicker
expose this choice. visibleYears defaults to 120 and normalizes to 1–9999; the
interaction engine shifts the offered window to fit min/max. It is a navigation
window, not an age rule or a replacement for date validation. Birthday demos use
explicit 1900-01-01 / 2026-10-16 limits and 200 choices, not the client clock.
Navigating does not commit a value; day selection does. For non-Gregorian locales,
the interaction engine owns month count, era, labels and leap-day adjustment;
public callbacks retain Gregorian ISO strings.

DatePicker kind="datetime" extends the existing control rather than adding a
separate export. Its main segmented field supports direct date/time edits. The
popup offers Calendar plus TimeField and Apply/Cancel. Each open initializes a
fresh draft from the accepted value. Choosing a day keeps time, changing time
keeps the day, and Apply emits one complete local datetime. Partial or invalid time entry,
unavailable days and datetime min/max block Apply. Cancel/Escape discard popup
changes; native form reset closes it and retains the existing controlled-authority
contract. Clear remains an explicit immediate action. Date-only mode continues
to commit on day selection. hourCycle selects 12/24-hour presentation; stored
values always use HH:mm:ss. TimeField onValidityChange tracks completeness even
when a partial edit emits no value callback.

A birthday is a civil date and must not acquire timezone semantics. Appointment
datetimes are local civil values; hosts own the timezone, DST disambiguation,
availability and conversion through dateTimeToInstant. DateRangeSelector and
DateRangePicker continue to represent inclusive civil days; they do not silently
become datetime intervals. See the 12/24-hour examples and birthday scenarios on
the DatePicker page, with related entry examples on DateField and Calendar.

Resize correction: when responsive reflow puts a trigger outside its scroll pane, Popover bounds its virtual anchor to the visual viewport before evaluating available space. An offscreen trigger must not be mistaken for unlimited space above or below. Native focus restoration, scroll locking and position ownership remain intact.


## Flexible time textbox and selection popup (2026-10-16)

Research: [USWDS time picker](https://designsystem.digital.gov/components/time-picker/)
combines typed entry and dropdown choices, recommends stable options and explicit
submission, and distinguishes scheduled increments from exact-time entry.
[Carbon's date/time picker specification](https://www.carbondesignsystem.com/building-blocks/core/components/date-picker/specifications)
combines time text input with selectors. The requested separate hour/minute/period
choices are implemented using owned Select controls, without dependent option
filtering. This preserves every minute and avoids inferring an appointment step.

TimeField now defaults to entryMode="text": an ordinary labeled textbox and joined
clock button. entryMode="segments" retains the prior native segmented interaction.
The public outer div ref, HH:mm:ss/null values, form name, hourCycle and bounds
stay the same. This is an explicit pre-release default-interaction change.
Historical segment tests/fixtures opt in to segments and keep their assertions;
the new textbox has separate unit and docs-browser evidence.

Parse a/p or AM/PM suffixes (8a, 8:30 pm), localized digits and day periods, and
24-hour clock text with optional seconds. Bare hours use 24-hour meaning.
No date/timezone, prose interpretation, nearest-slot rounding or overflow
correction is inferred. Blur or Enter normalizes valid text; invalid drafts
remain visible, invalidate the native input and report onValidityChange(false),
without replacing the accepted serialized value. Empty optional fields commit
null; required fields remain incomplete. Controlled hosts can reject requests.

Clock or Alt+Down opens a dialog with Hour, Minute and AM/PM in 12-hour mode;
24-hour mode omits day period. No choice is silently filled in for an empty field.
Apply commits all parts; Cancel/Escape discard popup edits. Existing nonzero
seconds are preserved, displayed in the textbox and exposed in the popup rather
than discarded when editing minutes. Same-day min/max validate typed and popup
values; malformed/reversed bounds cannot apply. Disabled/read-only guards and
silent accepted versus prevented native reset remain. User-editable text commits
on blur independently from the popup's Apply/Cancel transaction.

DatePicker kind="datetime" uses this default TimeField in its calendar popup.
Its combined outer datetime field remains segmented. The time dropdown applies
to the date/time draft; the outer Apply still commits date and time together.
Host ownership of dates, timezone/DST, availability and persistence is unchanged.
Source-backed 12/24-hour scenarios and a text/segments playground control are
available on the TimeField page; DatePicker scenarios show the composition.

## DatePicker flexible-entry default (2026-10-16)

DatePicker date-only entry now defaults to entryMode="text", including the overview, playground and fixed scenarios. Users can type supported freehand dates and normalize on blur/Enter, or use the calendar. Explicit entryMode="segments" remains available. Combined datetime entry continues to use segments. DateField remains segmented; range selectors now default to flexible endpoint text (see presentation follow-up below). Historical segment-native DatePicker hosts opt in explicitly; default textbox behavior has separate evidence.


## Deterministic relative text (2026-10-16)

DateField, DatePicker and both range controls accept referenceDate, a host-supplied
Gregorian YYYY-MM-DD date. This enables relative phrases in flexible date-only
entry. No browser/server clock or implicit timezone is read. The host derives its
business/user civil today and pins the same reference for the editing session and
SSR/hydration. Changing the anchor can re-evaluate an uncommitted relative draft;
already committed ISO dates never drift. An absent/invalid anchor disables
relative text, without invalidating ordinary absolute input. Both endpoints of
a range use the same anchor.

The bounded English grammar is today/tomorrow/yesterday, next/last day/week/month/
year, in N days/weeks/months/years, N units ago and next/last weekday.
Weekday names accept the active locale and English. English keywords are not a
claim of translated natural-language support. Whitespace/case and localized
digits normalize; unknown prose and business-day rules are rejected.

Next/last weekdays are strictly after/before the anchor (same weekday moves seven
days). Weeks are seven civil days. Month/year shifts preserve the calendar position
and clamp to the destination month's last day, e.g. Jan 31 + one month becomes
Feb 28/29; Feb 29 + one year becomes Feb 28. These are single dates, distinct from
the full inclusive periods returned by getRelativeDateRange. Resolution uses
owned Gregorian civil-day arithmetic, with no DST/instant conversion.
Overflow outside supported civil years is rejected. Existing bounds, unavailable
days, controlled authority, native validation and range Apply/Cancel still govern
the resolved absolute value.

All affected playgrounds expose the reference in flexible mode; named date/range
examples use the disclosed fixed 2026-10-16 anchor for reproducible interaction and
source. Production hosts must supply their actual civil today; the demo does not
pretend that its fixed anchor is a live clock.


## Rounded field groups (2026-10-16)

DatePicker and flexible TimeField preserve the theme field radius on the outside
of their joined input/icon controls, with square inner seams. Shared field padding
adapts to the radius and target height; the trailing action receives matching cap
clearance. DateRangePicker uses the field radius and text weight with an owned
CalendarTodayIcon in Button's trailing-icon slot. Material demo fields share the
existing 1.5rem action radius. Other identities retain their field radius. Compact
month/year selectors use a bounded inset so full year labels remain readable.
Logical corners, keyboard focus, forced colors and native target sizes remain.


## Editable range trigger (2026-10-16)

DateRangePicker defaults to fieldMode="text": one flexible range textbox joined
with a calendar action. fieldMode="button" preserves a selection-only trigger;
entryMode still controls the two endpoint fields inside DateRangeSelector.
Absolute endpoints reuse DateField locale order, written months, strict civil
validation and fixed 1950–2049 two-digit years. Separate endpoints with a spaced
hyphen, en/em dash or "to"; ISO hyphens remain part of their dates. Reversed or
incomplete ranges are invalid rather than silently reordered.

With referenceDate, bounded English this/last/next week/month/year phrases resolve
complete inclusive periods through getRelativeDateRange. Weeks use firstDayOfWeek
with Monday as the relative default. Business/fiscal/holiday rules stay in host
presets. No clock or timezone is inferred, and accepted absolute ranges never drift.
Blur/Enter normalizes valid drafts; optional empty input clears. Availability checks
cover the whole interval. Invalid drafts remain visible, block native textbox form
validation and never replace hidden accepted start/end values. The outer field
supports description/invalid/errorMessage/onValidityChange. Calendar Apply commits;
Cancel/Escape preserves accepted values. Controlled authority and native reset remain.


## Owned relative-date engine (2026-10-16)

All relative phrase parsing, civil-date validation, weekday offsets, month/year
clamping and full-period range resolution live in
`packages/ui/src/utils/relative-dates.ts`. It has no imports or third-party runtime
dependencies. DateField and DateRangePicker parsers delegate relative phrases to
it; the existing experimental getRelativeDateRange export reexports its owned
implementation. Absolute civil validation also delegates to the shared rules.
Calendar UI interactions and explicit datetime-to-instant conversion retain their
separate integration dependencies; they do not resolve relative phrases.

Arithmetic uses integer Gregorian day numbers for years 0001–9999. A whole range
must fit those bounds; partial edge weeks and unsafe offsets are rejected. The
Gregorian leap-year rule includes century exceptions. Native Intl supplies only
localized digit/weekday display names from a fixed date, never relative arithmetic
or a current date. No ambient clock, Date.parse, local-time, DST or permissive
natural-language parser participates. Reference-date, week-start, grammar, null
parser results and RangeError helper contracts remain unchanged.

Keep new supported relative expressions and calendar rules in this module, with
focused tests there. Foundation validation enforces its dependency-free boundary.
Business/fiscal/holiday rules remain explicit host policies/presets rather than
implicit parser guesses. Existing syntax and public entry points remain compatible.


### Conversational civil offsets (2026-10-16)

The shared single-date parser accepts "a week from today", "two weeks from today",
"in a month" and "a week ago". Quantities are nonnegative digits, "a", or English
zero through twelve; units remain day/week/month/year. "from now" is an alias for
"from today" and uses the host's same referenceDate, never a live clock. Month/year
offsets retain the existing day-preserving clamp. Unsupported prose, fractional or
negative quantities, missing anchors and overflow still reject. Both endpoints
of an explicit range use the same grammar, e.g. "today - a week from today".
A lone offset specifies one date, not an implicit range. Complete this/last/next
period phrases retain their existing full-range semantics.


### Compact time text (2026-10-16)

TimeField's owned flexible parser accepts HMM and HHMM as hour/minute pairs:
1300 becomes 13:00:00 and 315p becomes 15:15:00. The last two digits are minutes;
no suffix uses 24-hour meaning, while a/am/p/pm retains strict 1–12 hour semantics.
Display follows the configured hour cycle. Localized digits also work. Existing
colon/seconds entry, bounds, accepted form values, blur/Enter normalization and
invalid draft behavior remain. Reject invalid minutes/hours, five-digit input or
compact input mixed with colon seconds rather than guessing or rolling values.

### Responsive range dropdown layout

DateRangeSelector defaults presets to `side`; explicit `above` and `end` remain supported. Start/end fields share a row down to their usable field width. Presets reflow as wrapping choices on narrow hosts; month grids retain their density and touch targets. Preview descriptions and draft status stay available to assistive technology without duplicate visible value summaries or reserved debug-text height. DateRangePicker uses the public `Popover size="content"` so the dropdown follows the selector width (including one, two or three months and presets), capped to the viewport. Its textbox width is independent.

Layout references reviewed: [Mantine presets beside the calendar](https://mantine.dev/dates/date-picker-input/#presets), [React Suite date range picker](https://www.rsuitejs.com/components/date-range-picker/), and the user-supplied Google Analytics preset-sidebar and horizontal-month examples. These inform the owned layout; no parser or UI dependency was added.

## Flexible calendar family — 2026-10-16

Pre-release API revision: `rangeClickBehavior` replaces `rangeSelectionBehavior`;
`adjust-boundaries` replaces `preserve-range`. `active-endpoint` uses controlled
`activeEndpoint`/`onActiveEndpointChange` (or `defaultActiveEndpoint`) and visible
Start/End controls; endpoint-field focus also changes intent. Explicit endpoint
intent is independent of move/resize gestures and length constraints.

`rangeDragBehavior` supports none, move, resize and move-and-resize. In combined
mode the first/last day itself resizes its boundary; interior days move the interval.
No separate grip is rendered. Shift-drag moves from any selected day, including
one/two-day selections without interior dates. Move-only translates from every
selected day; resize-only enables endpoint gestures and leaves interior drags alone.
A one-day range grows toward the pointer (start when earlier, end when later).

The grabbed endpoint stays under the pointer. At bounded min/max length the opposite
boundary follows; endpoints never reverse. A capped three-day 7th–9th range becomes
10th–12th when the end is dragged to the 12th. Fixed duration makes endpoint gestures
translate the whole interval, including resize-only mode. Inclusive days and nights
use the shared length math. These rules also apply to Alt keyboard endpoint edits.
Shift and horizontal arrows move; Alt changes end and Alt+Shift changes start. These
shortcuts apply only within calendar cells. Escape/pointer cancellation discard
the preview. Invalid availability/bounds or an outside-selector drop keeps the prior
draft and original focus; length limits do not bypass availability. Reset/host
replacement cleans up gesture subscriptions. Pointer identities are isolated, and
synthetic drag clicks cannot consume later action-button presses.

`rangeLength` is a fixed positive duration or bounded min/max duration. Inclusive
`days` differ from overnight `nights`. Fixed activation resolves a complete range
from one start and disables resizing. `getDateRangeLength` exposes the same owned
civil counting used by validation and the Keep trip length example. Invalid or
reversed inputs return NaN. `getDateUnavailableReason(date,{range,endpoint})`
checks rendering intent and final validation; every interior day receives null
endpoint. Explicit unavailable records and bounds remain supported. Keep data
fetching, translations, timezone and holiday policy in host adapters.

`calendarNavigation="independent"` gives displayed months their own view/focus
state while sharing one range. `calendarLayout="scroll"` displays a bounded
consecutive month browser (`scrollMonths`, default 12, max 120) and preserves its
scroll ownership. Linked paged months remain the default. `selectionUnit` selects
a full week/month/quarter/year directly. `showFields` and `showActions` allow
embedding in a composition that owns fields/actions. `presetGroups` provides
nested categories with host-defined labels and resolved presets. `renderDayContent`
adds decorative annotations without changing native full-date accessible names.
`commitBehavior="immediate"` commits only complete valid drafts; the default
remains explicit Apply. Cancel in immediate mode discards unfinished edits and
does not undo previously accepted selections. `onDraftChange` is separate from
accepted `onValueChange`.

Popover and picker `presentation` supports anchored popover, centered dialog,
bottom drawer and auto (drawer on narrow screens). The portaled dialog and its
content stay mounted during responsive changes; native modality/focus restoration
remain owned by the existing overlay. Drawers use viewport bounds and native
scrolling rather than shrinking day targets.

New public compositions:

- PeriodPicker: whole Gregorian week/month/quarter/year with explicit civil
  reference date; no implicit clock. Year/month/quarter controls and a highlighted
  week calendar resolve through the single owned civil-date engine.
- DateTimeRangePicker: atomic local YYYY-MM-DDTHH:mm:ss start/end, flexible date
  and time fields, suggested minute increments, endpoint-aware datetime rules,
  full interval validation and explicit host timezone/DST conversion.
- DateRangeComparisonPicker: primary plus none/previous-period/previous-year/custom
  comparison. Previous period is adjacent and equal in inclusive days; previous
  year shifts each endpoint and clamps leap days, without weekday alignment.
  Invalid child input blocks outer Apply even when the last accepted child value
  is valid. The outer dialog commits the pair atomically.

Button-triggered compositions participate in native required/custom validity even
while closed, focus the real trigger on invalid submit, submit accepted canonical
values only, and use the shared native form-reset transaction. Read-only/disabled
states gate edits and commits. TimeField minuteStep changes suggestions without
rounding typed values; getTimeUnavailableReason also validates segmented mode.
All new controls have independent overview/playground/reference owners and public
source; global theme and host persistence remain outside copied examples.


### Range presentation follow-up — 2026-10-16

DateRangePicker defaults showFields=false: its outer editable range already provides
freehand entry, so the dropdown opens directly to presets and calendars. Enable
showFields to add start/end textboxes. Inline DateRangeSelector also defaults showFields=false; enable showFields explicitly when endpoint entry is useful.
Both default endpoint entryMode to text, normalizing supported dates on blur/Enter;
segmented entry remains an explicit option. This presentation does not change
accepted values, validation, endpoint intent or Apply/Cancel ownership.

Presets are a single-select list of label rows with a checkmark and subtle selected
background, without individual button outlines or a bordered preset card. The list
uses the same owned interaction pattern as Select/AsyncMultiSelect. Descriptions
remain accessible through option descriptions while staying visually hidden.
Arrow keys navigate; Enter/Space selects a draft. Disabled choices retain availability
rules; narrow layouts reflow label rows above calendars without changing selection.


### Clean flexible date fields — 2026-10-16

Flexible DateField and the DateRangePicker range textbox render no automatic format, two-digit-year or relative-anchor
instructions. This also cleans DatePicker and the optional range endpoint fields.
Explicit host descriptions remain supported; blank descriptions produce no helper
row or dangling aria-describedby. Invalid drafts still show associated validation
errors. Parsing, century expansion, reference-date determinism and normalization
are unchanged; detailed entry guidance stays in documentation rather than previews.


### Validation timing for flexible text — 2026-10-16

Date, date-range and time text inputs separate live validity from error presentation.
Incomplete prose remains editable without invalid styling, aria-invalid or error
text. Enter, blur or native validation reveals invalid feedback; the next edit
hides local feedback while correcting. Native validity and onValidityChange remain
live, so partial drafts never submit or enable composed Apply. Explicit host invalid
is immediate. Native reset and changed host values clear local presentation state.
Range, datetime and comparison summaries defer to invalid child fields, avoiding an
extra live error while those children are still being typed. Semantic cross-field
errors still appear after valid individual inputs commit. Segmented entry retains
its existing interaction.


### Gesture continuation: host changes and real touch — 2026-10-16

Pointer release rechecks its actual coordinates and current host availability and
bounds. It never accepts a stale preview or stale validation closure. Disabling,
read-only, changed drag/length policy, reset or changed committed value cancels
pending listeners and previews. Re-enabling permits a fresh independent gesture.

Cross-month drops focus the actual destination cell, including independently
navigated calendars. Endpoint gestures use their actual boundary role even when
the active click endpoint differs. Model range membership owns touch-action, so a
selected endpoint unavailable for the current click role still supports a valid
drag in its own role. Its selected row band and gridcell selection state remain
intact while the current click role is unavailable. Owned range validity remains
authoritative, so a valid departure is not announced as an invalid range merely
because arrival on that day is unavailable. The original full date label
and restriction explanation remain available. Resize-only leaves interior touch panning available; disabled
and read-only controls do not claim drag touch gestures.

Gesture tracking follows the initiating pointer. Another pointer's movement,
release or cancellation does not finish or cancel that gesture. Window blur still
cancels the active gesture. Escape, pointer cancellation and an outside drop leave
the previous range intact and allow a fresh subsequent drag.

## Text clipboard and submission transactions — K04/K07

Pasting into a flexible textbox edits the same draft as typing. Paste itself does
not commit. Enter prevents implicit form submission and attempts a commit; blur
also attempts a commit. A separate host submit action runs native validation.
The host must not bypass it with `form.submit()` or infer successful persistence
from a change request. `FormData` can be read even when a form is invalid: it
contains the last accepted values, not a validated booking or the draft text.

| Input | Supported plain-text grammar | Rejected/incomplete examples |
| --- | --- | --- |
| Date-only `entryMode="text"` | ISO `2026-10-16`, compact `20261016`, locale numeric dates, named months; relative phrases require `referenceDate` | `2/30/2026`, `10/`, timestamps, prose outside the documented relative grammar |
| Time `entryMode="text"` | `315p`, `08:15`, `08:15:30`, localized digits/day periods; bare hours and compact digits use the 24-hour clock | `25:00`, `8:`, a date or timezone/instant string |
| DateRangePicker text trigger | Two supported date expressions separated by spaced hyphen, en/em dash, or `to`; complete supported relative periods need `referenceDate` | Reversed ranges, a missing endpoint, three endpoints, impossible dates |
| Segmented date/time and combined datetime | Segment keyboard editing; flexible whole-value paste is not a supported portable API contract | Do not infer textbox grammar support from an engine's contenteditable behavior. Use individual segments or the calendar/time popup. |

Invalid or partial text stays visible after blur/Enter, reports invalidity and
blocks native submission without emitting an accepted-value request. Error
feedback appears after a commit/validation attempt, then clears while correcting.
Valid text normalizes to locale display; callbacks and named fields use ISO civil
dates, inclusive range endpoint fields (`name.start`, `name.end`), or `HH:mm:ss`.
Optional empty text requests null; required empty text remains invalid. A
controlled host can reject requests, keeping its accepted display and form values.
Accepted native reset discards drafts and restores uncontrolled defaults silently;
a prevented reset preserves the draft and accepted values. Reset does not request
persistence or clear an unrelated field's state.

Date and time bounds are inclusive. DatePicker text validates candidate bounds
before requesting acceptance. Segmented DateField/DatePicker can emit a complete
civil edit outside min/max while native validity still blocks submission; hosts
must use validity as well as change callbacks. Availability restrictions in
DatePicker are stricter: static records and callback reasons reject candidate
acceptance from text, segments and calendar. Datetime popup Apply rechecks current
bounds and host availability against the combined date/time. Calendar selection
never authorizes a forbidden date. No path fetches business data; the host supplies
canonical bounds, translated reasons, availability records and callbacks.

These are input/form contracts, not new trusted clipboard receipts. The focused
wave-03-27 synthetic tests and proposed native copy/paste fixtures are recorded in
[the acceptance handoff](final-acceptance/wave-03-27/report.md). Trusted clipboard
execution must retain actual `paste.isTrusted`, clipboard payload, accepted
callbacks, native form result, browser version and source/build hashes per engine.
Unavailable clipboard access is a blocked prerequisite; do not substitute
`dispatchEvent`, `insertText` or a synthetic clipboard event. Segmented paste
remains observation-only in the existing native transaction scenario; it does
not expand the supported textbox grammar to combined datetime or segmented fields.

### Compact range defaults and month sliding

The clean default omits endpoint fields and month/year dropdowns (`showFields=false`, `navigation="arrows"`). Both densities reduce day-cell width and height; touch mode retains the owned minimum 44px target. A 12rem minimum month width accommodates a single-line month heading and two text navigation buttons. With fields hidden, inline width follows the visible months rather than reserving 23rem for textboxes. Optional fields retain their usable width, and very constrained/enlarged-text hosts retain local scrolling instead of clipping dates or shrinking touch targets.

Paged grids slide on visible-month changes, including keyboard navigation and direct month/year jumps. A private presentation helper snapshots only the outgoing grid, removes its IDs/form names/tab stops, and marks it inert/aria-hidden. The live grid is never remounted for animation. Previous animations are canceled on rapid navigation/unmount; OS reduced-motion changes immediately remove the outgoing copy. The owned motion-duration token controls timing; RTL reverses the horizontal slide. Vertical month browsing remains a separate explicit layout without this paged slide.

### Endpoint intent per independent calendar

Navigation and endpoint intent are separate. `calendarNavigation="independent"`
alone keeps shared range-click behavior. Add `calendarEndpoints={["start", "end"]}`
with `months={2}` to make the first calendar a From editor and the second a To
editor. The mapping is indexed by rendered calendar, not the month it displays;
navigation never changes its role. Missing/null entries use `rangeClickBehavior`.
Linked calendars and the scrolling browser ignore this optional mapping.

Assigned calendar activations override the shared click policy and global
`activeEndpoint`, report `onActiveEndpointChange`, and evaluate date availability
with their assigned endpoint. With 7th–16th selected, From→9th gives 9th–16th;
To→13th gives 7th–13th. Crossing the opposite endpoint clears only that opposite
date: From→20th gives start=20th/end=empty; To→5th gives start=empty/end=5th.
Either endpoint may be entered first; equal endpoints select one day. Incomplete
drafts cannot Apply or commit immediately. Fixed-length and whole-period selection
retain precedence. Bounds, length and whole-interval availability still validate
the result; fields, presets, gestures, Cancel and host-controlled values retain
their existing contracts. `DateRangePicker` forwards the same prop.

## Month/year heading navigation (2026-10-17)

Calendar, DatePicker, DateRangeSelector and DateRangePicker default to
`navigation="period"`, using the same MonthPicker and YearPicker components. Separate month and year
text buttons form the heading at logical start; arrows remain at logical end.
Each button replaces the day view in the same frame: month shows all 12 months,
year opens paged years directly. Selecting a choice immediately returns to days,
restores heading focus, and changes focus/view only. There is no Apply, Cancel or
Clear in either choice view. Escape returns without navigating. Hidden day/time/
clear controls retain the frame dimensions while being removed from interaction.
Non-Gregorian calendars retain their native heading; `month-year` retains the
existing direct native selects, and `arrows` retains a static heading.

`allowMonthSelection` and `allowYearSelection` default true, independently enabling
the corresponding heading button in period navigation. False renders static text.
They do not change date validity or disable arrows: use min/max and availability
to constrain actual dates, including typed input. For a week-only event:

```tsx
<DatePicker label="Event date" min="2026-10-19" max="2026-10-25"
  defaultFocusedDate="2026-10-19"
  allowMonthSelection={false} allowYearSelection={false} />
```

`periodPickerProps` forwards yearEntry, yearsPerPage, visibleYears, minYear,
maxYear and message placements. Calendar owns labels, navigationView, display,
unit, purpose, date bounds, availability and callbacks. Additional year bounds
narrow only the chooser, never broaden actual date constraints. Months/years
with no eligible day are disabled. A year choice keeps the visible month if it
has an eligible day, otherwise focuses the first eligible date of that year.
Month choices focus their first eligible day, including partially available months.

Year buttons are the default; yearsPerPage defaults 12 (also 16/24). Optional
`yearEntry="text"` accepts a four-digit year on Enter or blur; invalid drafts
are reported only after that attempt. Two-sided year/date bounds
offer the complete applicable year interval; otherwise visibleYears defaults to
120 around focus, clipped to bounds and years 1–9999. Availability callbacks
remain synchronous and pure. Hidden headings do not enumerate choices.

Standalone PeriodPicker defaults remain display="popup", purpose="selection";
selection validates and serializes the whole period with explicit actions.
For inline navigation, `navigationView="month"|"year"` isolates choices with
immediate navigation. Omit it to retain the combined draft chooser with actions.
Navigation never participates in native form serialization.

### Shared standalone MonthPicker and YearPicker

Both controls are public through the root, components and experimental entry
points. They render inline choices with no popup or action footer. MonthPicker
requires a Gregorian year, uses numeric month values 1–12 and localized labels.
YearPicker uses numeric years 1–9999, a deterministic referenceYear (selected year
or 2000 by default), optional text entry, and paged buttons. Each supports
controlled value/onValueChange and uncontrolled defaultValue, disabled/readOnly,
date bounds, unavailable records and additional choice-level availability.
Density inherits from the surrounding scope. These controls return a number;
hosts own native form serialization, selected days/ranges and persistence.

Month/year availability requires any eligible day. PeriodPicker composes the
same choices for inline modes and adds whole-period validation when selecting
an interval; its original popup/selection defaults remain unchanged. No copied
month/year grids exist in the single-date and range calendar implementations.
A private shared adapter handles engine focus and stable in-place view changes.

Range navigation inherits endpoint-aware availability with the current draft.
Independent From/To calendars navigate separately and preserve the other view;
linked calendars navigate together. calendarEndpoints still assigns selection
intent. At most one chooser is visible within a selector. Choice views hide
range actions, fields and presets while retaining layout space, and restore them
on return to days. Navigation never changes a committed range or its draft.
DateRangePicker inherits all navigation props directly from DateRangeSelector.
