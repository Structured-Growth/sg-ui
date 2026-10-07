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

## Selection and drafts

`Calendar` separates focused date from selected date and supports single or
arbitrary multiple dates. A keyboard arrow changes focus; activation changes
selection. The installed 1.21.1 interaction version has a native multiple-selection
contract, proven by selecting and removing noncontiguous February dates. The old
planning assumption that this necessarily requires lower-level hooks does not
apply to this version. No custom collection state is added merely to duplicate it.

`DateRangeSelector` keeps a draft until Apply. Cancel restores the committed range;
clear affects the draft and is disabled when required. Presets supply explicit
inclusive ranges and may include descriptions. A preset crossing a minimum,
maximum or unavailable day is disabled. Typed start/end segments and calendar
selection share one draft. Partial/reversed/unavailable drafts cannot Apply.
Controlled parent changes replace a draft only when serialized endpoints change.

`DatePicker` commits single-date field/calendar changes immediately. Its name
participates in native form data. `DateRangePicker` opens the advanced selector,
commits on Apply and closes on Cancel/Escape. Both restore trigger focus and
reset uncontrolled committed values when their containing native form resets;
the host can prevent reset. Controlled values always remain host-owned.

`DateField` and `TimeField` use native validation and form participation, with
keyboard-editable segments, descriptions/errors and controlled/uncontrolled
contracts. Standalone range-selector hidden fields submit committed values,
not an unconfirmed draft. A required range disables Apply when empty; the host
must enforce a required committed range in its final submission validation.

## Initial scope and accessibility limits

The initial scope includes single/arbitrary multiple civil dates, civil ranges,
local datetime/time fields, presets, unavailable days and explicit range Apply/
Cancel. A two-month display stacks in a narrow container. Each displayed month
has a visible localized heading. Preset descriptions are visible paragraphs, linked
to their buttons with `aria-describedby`, including disabled presets. Unavailable
date buttons retain their complete localized date labels and receive host-supplied
reason descriptions through a private native-ref bridge after mounting. The bridge
preserves other description references and removes only its own reference when
availability changes. It is needed because the interaction component filters
labelable ARIA props. No public prop or callback changes.

Calendar focus exposes the focused unavailable date and reason in a visible status
message. Arrow navigation changes focus without selecting a range; unavailable
dates cannot be activated. The native availability disclosure remains a keyboard
and touch alternative for reviewing all supplied dates. Host messages stay
host-owned. Draft endpoints remain a separate status and only Apply commits.

These changes address availability and preset access in K-17. Intermediate range
preview/anchor announcements, live screen-reader output and the full locale/device
matrix still need acceptance, so K-17 stays open. Descriptions on date buttons
attach after hydration; the visible descriptions and disclosure are server-rendered.

Comparison periods, computed fiscal rules, month/year-only selectors, recurrence,
resource scheduling and booking persistence are deferred. Hosts may supply a
precomputed fiscal preset with explicit endpoints; SGUI does not calculate
organization calendars or availability. Paste, autofill, live screen-reader output,
all locale/calendar systems, touch and browser zoom still require matrix validation.
Do not infer assistive-technology conformance from the DOM tests.

The host translation locale is supplied through `Provider`, which drives the
calendar's locale/direction. `ThemeScope.dir` alone controls visual direction and
does not establish an interaction locale. Stories demonstrate Arabic/German/
English display, availability and timezone conversion without application APIs.
