# Calendar proof contracts and limits

Tasks: P-04/P-05, H-10/H-11, K-01/K-10/K-12/K-16. The controls are experimental;
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
has a visible localized heading. Availability explanations are also in a native
disclosure so they are reachable by keyboard rather than relying on hover titles.

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
