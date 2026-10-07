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
Clear affects the draft and is disabled when required. Presets supply explicit
inclusive ranges and may include descriptions. A preset crossing a minimum,
maximum or unavailable day is disabled. Typed start/end segments and calendar
selection share one draft. Partial/reversed/unavailable drafts cannot Apply.
Controlled parent changes replace a draft only when serialized endpoints change.
After activating the first endpoint, a visible translated `date-range-preview`
follows the interaction engine's highlighted range, including reverse and
cross-month keyboard navigation. A translated visible context paragraph distinguishes
the first activated anchor, the focused endpoint and the unchanged draft. Both
paragraphs describe only the currently focused date cell while the calendar has
interaction focus; moving focus removes the preview references from the prior cell.
The preview adds no extra live-status announcement on each arrow; the interaction
engine's announcements and existing draft/availability statuses remain unchanged.
The complete localized date-cell names remain intact. The first activation moves
focus to the nearest available endpoint; arrows
then adjust the preview. Apply is disabled until the second endpoint is activated,
so an unfinished selection cannot accidentally commit the previous draft.
Cancel, Clear, presets, typed edits, changed committed host values and native reset
invalidate the pending anchor. Leaving the calendar cancels an unfinished preview
without synthesizing a second endpoint or changing the draft. A preview is
neither a draft commit nor submitted
form data; after completing both endpoints, Apply still controls the commit.
Completion and the existing anchor invalidation paths remove the preview/context
paragraphs and their focused-cell associations. Replacing a controlled host value
with the same serialized endpoints preserves the pending selection. At unavailable
boundaries, the context describes the interaction engine's constrained focused
endpoint; it does not imply that an unavailable endpoint can be selected.

`DatePicker` commits single-date field/calendar changes immediately. Its name
participates in native form data. `DateRangePicker` opens the advanced selector,
commits on Apply and closes on Cancel/Escape. Both restore trigger focus and
reset uncontrolled committed values when their containing native form resets;
the host can prevent reset. Controlled values always remain host-owned.

`DateField` and `TimeField` use native validation and form participation, with
keyboard-editable segments, descriptions/errors and controlled/uncontrolled
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

## Initial scope and accessibility limits

The initial scope includes single/arbitrary multiple civil dates, civil ranges,
local datetime/time fields, presets, unavailable days and explicit range Apply/
Cancel. A two-month display stacks in a narrow container. Each displayed month
has a visible localized heading. Preset descriptions are visible paragraphs, linked
to their buttons with `aria-describedby`, including disabled presets. Unavailable
date buttons retain their complete localized date labels and receive host-supplied
reason descriptions through a private native-ref bridge after mounting. The bridge
merges availability and focused-preview description IDs with existing references
and removes only its owned IDs when those associations change, preserving unrelated
IDs at each attachment/cleanup. This does not promise persistence of arbitrary
post-mount native attribute mutations across interaction-engine rerenders. It is
needed because the interaction component filters
labelable ARIA props. No public prop or callback changes.

Calendar focus exposes the focused unavailable date and reason in a visible status
message. Arrow navigation changes focus without selecting a range; unavailable
dates cannot be activated. The native availability disclosure remains a keyboard
and touch alternative for reviewing all supplied dates. Host messages stay
host-owned. Draft endpoints remain a separate status and only Apply commits.

These changes address availability, preset access and visible keyboard range
preview in K-17. The [batch61 focused-endpoint evidence](parallel-batch-61/keyboard-range-preview.md)
records source/unit coverage and a fresh Chromium light/dark shard passing 2/2 in
[`batch61-keyboard-range-preview.spec.ts`](../../tests/browser/batch61-keyboard-range-preview.spec.ts).
That shard covers focused association/removal, constrained unavailable traversal,
unchanged committed form data and Cancel; it does not establish spoken output or
announcement timing. Firefox/WebKit, actual assistive-technology/manual acceptance
and the broader locale/calendar/device/touch matrix remain pending for this slice.
Native browser regressions in
`tests/browser/batch01-calendar.spec.ts` exercise leap-day/month-boundary previews,
unavailable interior dates, draft/Apply/Cancel/Clear/reset form transactions and
picker Escape/focus return. The same civil endpoints are exercised in Chicago and
Tokyo browser timezones. Live screen-reader output and the full locale/device
matrix still need acceptance, so K-03–K-10 and K-17 remain broad open gates. Descriptions on date buttons
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
