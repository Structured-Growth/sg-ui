# Due-date formatting acceptance — H-12

The shared `src/utils/formatDueDateLabel.ts` formatter and preserved
`LearnerClassCard` re-export retain the host's due-date contract. The host supplies
an instant as a `Date`, parseable string (prefer ISO with `Z` or an explicit offset),
or epoch milliseconds to the helper. The card's existing `string | Date` props and
presentation model's string field are unchanged. JSON serialization of `Date`
values to ISO strings preserves the formatted instant; the formatter does not
mutate inputs, parse a display label back into data, or persist application state.

## Preserved time semantics

Calendar comparisons and displayed date/time use the execution environment's local
timezone. An offset in an input identifies its instant; it does not override the
display timezone. A locale controls date/time conventions, not the timezone.
There is no new timezone option or application timezone policy in this slice.

- Same-calendar-day future deadlines use upward-rounded elapsed minutes/hours.
- Tomorrow means the next local calendar day, including 23/25-hour DST days.
- Past deadlines and the exact deadline use an absolute date and time.
- A future deadline across two calendar days but less than 48 elapsed hours uses
  an absolute date and time. Longer ranges keep the existing upward-rounded
  elapsed-day count and the weeks branch above 21 days.
- Midnight, month/year rollover and leap day retain these rules.

For SSR/hydration parity, the host must supply consistent instants/reference time
and arrange consistent execution timezones. Invalid or absent reference time
intentionally uses the current instant. This helper does not make server and
browser local clocks/timezones equivalent.

## Fallback and localization

Missing/invalid due inputs return `Due date unavailable` through `due.unavailable`.
Invalid `Date`, unparseable/empty strings, non-date objects, booleans and non-finite
numbers receive that fallback. Parsing remains native `Date` parsing; this does
not introduce strict ISO/calendar validation or change date-only string semantics.

Omitted, malformed, empty or unsupported locales use explicit `en-US` date/time
formatting. Supported locales retain native Intl formatting, including localized
digits and time conventions. Previously malformed locales threw and unsupported
locales inherited the runtime default; these defects are corrected.

Without a translator, message interpolation uses deterministic English defaults.
With one, the existing key/default-message/primitive-values callback is preserved:
`date` and `time` are strings, and `count` is a number. The host translation adapter
continues to own lookup errors, missing-key handling and translation catalogs; see
[translation acceptance](react-aria-i18n-acceptance.md).

## Evidence and limits

Colocated helper tests cover exact deadline/minute/hour thresholds, midnight,
month/year/leap boundaries, spring gap/fall repeated hour, 23/25-hour tomorrow,
day/week thresholds, JSON/epoch/offset roundtrips, input preservation, invalid due
inputs and fake-clock invalid reference fallback. Locale tests cover German and
Arabic formatting plus malformed/unsupported English fallback. The card re-export
test verifies helper identity and JSON/fallback behavior.

Targeted related tests include the existing learner-card composition. Runs use
Node 24 with `UTC`, `America/New_York`, `Asia/Kathmandu` and
`Pacific/Kiritimati`; a German runtime default proves unsupported locales cannot
silently inherit machine formatting. See the
[batch 05 report](parallel-batch-05/due-date.md) for exact commands and commits.

This records the bounded H-12 formatter slice. Browser Intl/ICU differences,
cross-timezone hydration, physical devices, assistive technology and Firefox are
not newly verified. No broad G/K/E/U/X/R/Z gate is closed. Production acceptance
still follows the [development validation policy](react-aria-development-validation.md).
