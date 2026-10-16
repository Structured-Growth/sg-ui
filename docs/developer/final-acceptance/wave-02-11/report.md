# Wave 02 / 11 — calendar and date acceptance

**Recommendation: 7 complete, 7 partial, 0 blocked across the 14 assigned leaves.** No shared checklist/count was changed. Every original leaf is reproduced below and in `results.json`; historical checkmarks were not inherited. Twenty editor V leaves, required future production validation and human release approval remain separate.

## Evidence and actual work

Read AGENTS.md, the current final-acceptance execution policy, full assigned K leaves and current contracts/implementation/test assertions. Reused FA-01–04, coordinator parallel reconciliation and the earlier parallel-11 CSS conclusions; no completed suite, inventory, build or consumer/browser matrix was repeated. This report is restricted to calendar acceptance, not a renewal of the earlier CSS closure.

Base HEAD is `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, branch `dev`, existing uncommitted checkout. `input-receipt.json` records exact SHA-256 values, capture time and retained evidence hashes. The bounded comparison reads 93 relevant files: 86 match FA-02/FA-01 with FA-04's four explicit test/fixture corrections applied. Seven differ: the source/test pair for each of PeriodPicker, DateTimeRangePicker and DateRangeComparisonPicker, plus `apps/docs/examples/catalog/forms-dates.tsx`. The first six are the coordinator's concurrent BUG-0008 scope; the docs router changed alongside the concurrent TextArea work. Changes are observed, not written or validated by this conversation. No assertion is made that old built artifacts cover these changed files. Recheck the receipt if a later input changes.

Retained FA-04 unit evidence is the original **1,729 passing / 1,738 total** run plus the corrected affected **10 passing cases in four suites**; count the originally passing case in those suites once. The original full command failed and is not presented as green. The accepted reconciliation gives current matching initial-family tests passing evidence. FA-04's fixture/package/build transcripts remain dated evidence, not proof of current changed compositions or a fresh replacement-host browser run. Their Node 24 host differs from the new probe host.

New command, from repository root:

```sh
pnpm --filter @structured-growth/sg-ui exec vitest run --config ../../docs/developer/final-acceptance/wave-02-11/vitest.config.mjs
```

Final output is saved in `probe.log`: **1 file, 3 tests passed**, Vitest 4.1.11, Node 26.5.0, jsdom. Two are deliberately passing defect characterizations; one is positive translated-state evidence. This is outside the declared Node 22/24 production validation matrix and is useful bounded diagnosis, not production or native conformance. An initial two-case run passed; after adding the missing translated-label case, the final three-case run passed. No broad suite was rerun. Test source/config/log hashes are captured in the receipt.

New receipt command: `python3 docs/developer/final-acceptance/wave-02-11/reconcile.py` (exit 0). It compares only the selected current inputs and writes inside this directory. It does not regenerate the FA inventories. No source/shared output, earlier report, Git index/history, release, server or dependency installation was changed. No other conversation was contacted and no agent was spawned.

## Concrete new findings

1. **K04 DatePicker availability bypass:** render a default text DatePicker with `defaultValue="2026-10-14"`, `name="appointment"`, and a `getDateUnavailableReason` returning `No appointment capacity` for `2026-10-16`. Type `10/16/2026` and press Enter. The isolated probe observes an accepted callback for `2026-10-16`, valid native input and submitted hidden value `2026-10-16`. Source routes the rule into Calendar but not the DateField commit path; datetime Apply also omits that callback from candidate validation. The current test records the wrong behavior, not acceptance. Fix ownership remains the coordinator.
2. **K17 missing non-hover dynamic reason:** standalone Calendar with the same callback renders the October 16 button `aria-disabled="true"`, but no reason text, availability disclosure or `aria-describedby`. Static arrays have a disclosure; callback-only availability does not. The probe preserves the complete date name, proving the gap is reason access, not a missing date label.
3. **K09 positive evidence:** an actual host Arabic translation adapter renders translated Next/Previous month and unavailable-dates controls while preserving selected gridcell and unavailable button semantics. This supplements the retained Arabic RTL traversal and Hebrew Gregorian-callback tests without reexecuting those passing suites.

## Initial success-example mapping (K01)

| Requirement | Concrete owned example/contract | Success boundary |
| --- | --- | --- |
| Date-only | `CalendarDropdownExample`, DatePicker/DateField | Valid civil text normalizes; calendar selection commits; ISO date remains timezone-free. |
| Date/time | `DateTimePickerExample`, `TimezoneInstantExample` | Popup date and time Apply atomically; Cancel discards; host chooses timezone/DST conversion. |
| Range | `RangeDropdownExample`, inline DateRangeSelector | Draft endpoints are separate from accepted hidden fields; Apply commits once. |
| Presets | `RangePresetExample` | Fixed/relative/custom host endpoints share the draft model; no implicit clock/fiscal rule. |
| Availability | native `DateRangeSelector.Availability`, `AdvancedRangeExample` availability | Complete interval validates bounds/interior/endpoint policy; host supplies data/reasons. DatePicker parity defect remains K04. |
| Optional Clear | DatePicker/range controls | Clear requests null; required controls suppress clearing; controlled host remains authoritative. |
| Explicit Apply/Cancel | range selectors and datetime popup | Invalid/incomplete drafts cannot Apply; Cancel preserves accepted values. |

## Current feature decision table (K12/K16 successor content)

This table reconciles current public source. It is ready for incorporation into the maintained contract; it is **not** a claim that every selected feature has passed final acceptance.

| Feature | Current selected contract | Evidence/remaining boundary |
| --- | --- | --- |
| Arbitrary multiple civil dates | `Calendar selection="multiple"` | Retained noncontiguous select/deselect, two-month/RTL/Hebrew tests. |
| Comparison periods | `DateRangeComparisonPicker`: none, adjacent equal-inclusive-length previous period, previous year, custom | Previous-year shifts/clamps endpoints; no weekday alignment. Source/tests changed for BUG-0008; attach new coordinator results. |
| Whole periods | `PeriodPicker`: Gregorian week/month/quarter/year | Monday default week start or explicit Sunday; civil reference date. Current changed tests need coordinator validation. |
| Fiscal/business/holiday periods | Host-resolved explicit preset endpoints | No organizational fiscal/holiday engine; relative helper does not infer business policy. |
| Recurrence/resource scheduling | Outside initial library engine | Availability callback may express a host recurring rule; this does not create recurrence expansion, booking inventory, conflicts or persistence. |
| Locale/calendar systems | Locale display with Gregorian owned serialization | Representative Arabic/Hebrew DOM evidence; no all-locale/calendar/device/AT promise. |
| Relative natural language | Bounded English keyword grammar with explicit civil referenceDate | Localized digits/weekday names are supported; no generic translated prose parser, implicit today or timezone. |

Ready replacement wording for stale initial-limit paragraphs in `react-aria-calendar-contracts.md`:

> The experimental calendar family includes arbitrary multiple civil dates, inclusive ranges, local datetime/time fields, Gregorian week/month/quarter/year selectors and atomic comparison periods. Comparison modes are none, adjacent equal-length previous period, previous-year endpoint shifts with leap-day clamping, or host-selected custom dates. Fiscal/business/holiday policies remain host-resolved presets; no recurrence/resource-scheduling or booking-persistence engine is provided. All accepted values use the owned serializable contracts. Hosts choose a reporting civil reference date, timezone and DST disambiguation explicitly.
>
> Presets are keyboard-operable single-select options. Their optional descriptions are associated option descriptions and are visually hidden in the current presentation. Range previews/context describe the focused endpoint without replacing complete localized date names; supplemental day decorations are hidden from accessible names. Static unavailable records have a keyboard/touch disclosure. Callback-only Calendar reasons and DatePicker typed availability parity require the K17/K04 corrections recorded in wave-02-11. Native clipboard, replacement-host browser matrices and spoken AT results must retain their actual evidence limits.

Replace the older comparison/month-year deferral and visible-preset-button claims rather than appending another contradictory section. Maintained-guide publication remains K16 partial because this conversation can write only its evidence directory.

## A-K-01 — complete

Original requirement: Define the initial advanced-selector requirements and success examples: date-only, date/time, range, presets, unavailable dates, clear, and explicit Apply/Cancel.

Initial success requirements are explicit and have concrete examples: date-only immediate commit, local datetime atomic popup Apply/Cancel, inclusive range draft/Apply/Cancel, presets, host availability, optional Clear and required suppression. The report supplies a requirement-to-example matrix. Completion is definition/examples, not proof every implementation satisfies every acceptance gate.

Source references: `docs/developer/react-aria-calendar-contracts.md:6-94`; `docs/developer/react-aria-calendar-contracts.md:352-392`; `apps/docs/examples/CalendarCompositionExamples.tsx`; `apps/docs/examples/AdvancedCalendarExamples.tsx`.

Test/evidence references: `packages/ui/src/experimental/DatePicker/DatePicker.test.tsx`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.test.tsx`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.

Limits: Known DatePicker availability defect remains K04; newer composition validation remains K12. Stale scope prose is K16.

Successor: none required for this leaf; independent acceptance and final production gates remain open.

## A-K-02 — complete

Original requirement: Implement owned date field, calendar, date picker, range calendar, range picker, and time field building blocks needed by those requirements.

All six requested owned building blocks exist and are exported through experimental. DateRangeSelector is the range-calendar building block; it embeds React Aria RangeCalendar while retaining owned civil props and can hide fields/actions. No separate public RangeCalendar export is promised. Implementation and unit evidence exist; initial family inputs match retained FA04.

Source references: `packages/ui/src/experimental/index.ts`; `packages/ui/src/experimental/DateField/DateField.tsx`; `packages/ui/src/experimental/Calendar/Calendar.tsx`; `packages/ui/src/experimental/DatePicker/DatePicker.tsx`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx`; `packages/ui/src/experimental/DateRangePicker/DateRangePicker.tsx`; `packages/ui/src/experimental/TimeField/TimeField.tsx`.

Test/evidence references: `packages/ui/src/experimental/DateField/DateField.test.tsx`; `packages/ui/src/experimental/Calendar/Calendar.test.tsx`; `packages/ui/src/experimental/DatePicker/DatePicker.test.tsx`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.test.tsx`; `packages/ui/src/experimental/DateRangePicker/DateRangePicker.test.tsx`; `packages/ui/src/experimental/TimeField/TimeField.test.tsx`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.

Limits: Existence/owned implementation closure does not close behavioral/native gaps. PeriodPicker/DateTimeRangePicker/comparison are separate K12 selected features with changed inputs.

Successor: none required for this leaf; independent acceptance and final production gates remain open.

## A-K-03 — complete

Original requirement: Define selection versus focused date versus visible month separately; support controlled/default state and predictable clear/reset behavior.

Core calendar separates selected owned values from focused date and engine visible range. Month/year jumps and sibling visible-month isolation have direct tests. Range state separates committed value, draft and engine anchor/focus; Clear, accepted/prevented reset, identical versus replaced host endpoints and controlled rejection are tested. FA04 affected rerun covers corrected controlled transactions.

Source references: `packages/ui/src/experimental/Calendar/Calendar.tsx`; `packages/ui/src/experimental/Calendar/CalendarNavigation.tsx`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx:119-172`; `packages/ui/src/experimental/DateRangeSelector/useCalendarFormReset.ts`; `packages/ui/src/experimental/DatePicker/DatePicker.tsx`; `packages/ui/src/experimental/DateRangePicker/DateRangePicker.tsx`.

Test/evidence references: `packages/ui/src/experimental/Calendar/Calendar.test.tsx`; `packages/ui/src/experimental/Calendar/Calendar.next100-regression.test.tsx`; `packages/ui/src/experimental/Calendar/CalendarNavigation.test.tsx`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.test.tsx`; `packages/ui/src/experimental/DateRangePicker/DateRangePicker.controlled-transactions.test.tsx`; `packages/ui/src/experimental/DatePicker/DatePicker.native-transactions.test.tsx`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.

Limits: This is state-contract and executed DOM evidence for initial blocks, not native focus/scroll certification or a fresh pass of the three concurrent compositions.

Successor: none required for this leaf; independent acceptance and final production gates remain open.

## A-K-04 — partial

Original requirement: Support minimum/maximum, unavailable-date explanations, validation, required/optional input, and host-supplied availability without fetching business data.

Bounds, required/optional behavior and host-owned data/callbacks are present. New GAP K04 probe demonstrates DatePicker default text input accepts 2026-10-16 despite getDateUnavailableReason returning No appointment capacity: callback fires, native input is valid and hidden FormData submits the blocked date. Calendar disables such dates, but text commit does not apply that rule. Static unavailable array is checked against accepted value after commit rather than the candidate. Datetime candidate validation also omits the callback.

Source references: `packages/ui/src/experimental/DateRangeSelector/date-contract.ts`; `packages/ui/src/experimental/DateField/TextDateField.tsx`; `packages/ui/src/experimental/DatePicker/DatePicker.tsx:40-77`; `packages/ui/src/experimental/Calendar/Calendar.tsx`.

Test/evidence references: `packages/ui/src/experimental/Calendar/Calendar.next100-regression.test.tsx`; `packages/ui/src/experimental/DateRangeSelector/RangeGestures.test.tsx`; `docs/developer/final-acceptance/wave-02-11/acceptance.test.tsx`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison. New isolated probe executed; see `probe.log` and the exact named case in `acceptance.test.tsx`.

Limits: New probe is Node26/jsdom characterization; passing means gap reproduced, not acceptance. Reason accessibility is also K17.

Required successors:

- **K04-datepicker-entry-parity**: Validate DatePicker date-only text/segments and datetime candidates through the same explicit unavailable-array and host callback policy as calendar selection. Retain invalid draft text, suppress accepted callbacks/hidden values for forbidden candidates, surface the host reason and keep controlled authority. Recheck current rules when applying datetime drafts. Validation/prerequisites: Use GAP K04 exact probe as a regression (change expected behavior), add focused array/segments/datetime parity cases; run affected supported-runtime tests and one bounded native typed/calendar form path. No data fetching in library.


## A-K-05 — partial

Original requirement: Support multi-month presentation, responsive container sizing, month/year navigation, keyboard navigation, focus return, and meaningful date announcements.

One/two/three month presentation, independent or linked range months, month/year navigation, local scroll sizing and keyboard/focus-return tests exist. Native specs exercise localized reflow at 360px and 150% text. Retained older receipts describe earlier host/head runs; no current replacement-host execution or spoken announcement result is supplied.

Source references: `packages/ui/src/experimental/Calendar/Calendar.tsx`; `packages/ui/src/experimental/Calendar/CalendarNavigation.tsx`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.module.css`; `packages/ui/src/experimental/Popover/Popover.tsx`.

Test/evidence references: `packages/ui/src/experimental/Calendar/Calendar.test.tsx`; `packages/ui/src/experimental/Calendar/CalendarNavigation.test.tsx`; `packages/ui/tests/browser/calendar-native-locales.spec.ts`; `packages/ui/tests/browser/hardening-date-presentation.spec.ts`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.

Limits: DOM focus tests and CSS source do not establish native reflow, announcement timing or AT conformance.

Required successors:

- **K05-native-reflow-focus**: At a frozen current source/build run only relevant existing calendar-native-locales and hardening-date-presentation cases plus picker Escape/Apply focus-return; record light/dark, both densities, narrow/wide and resized viewport, localized date names, source/build/host digests and diagnostics. Validation/prerequisites: Coordinator supplies fresh fixture host after changed source is built; preserve existing assertions. Use targeted failures to scope repairs.

- **K05-announcement-observation**: Record a representative calendar date/focus announcement review with named AT/browser/platform versions, selected and unavailable traversal, month jumps and focus restoration; distinguish observed output from DOM labels. Validation/prerequisites: Operator/AT session required; no such session provided here.


## A-K-06 — complete

Original requirement: Implement presets with documented locale/time-zone/fiscal assumptions; preserve a draft selection until Apply and restore committed selection on Cancel.

Resolved host presets document Gregorian inclusive civil endpoints, explicit reference date/reporting timezone, Monday default or supplied week start and no ambient clock. Business/fiscal/holiday rules remain explicit host calculations. Preset choices update local draft only; Cancel restores committed selection and Apply validates before requesting a commit. Fixed/relative/host custom choices and nested groups have retained passing evidence.

Source references: `docs/developer/react-aria-calendar-contracts.md:188-218`; `packages/ui/src/utils/relative-dates.ts`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx`; `apps/docs/examples/CalendarCompositionExamples.tsx:49-86`.

Test/evidence references: `packages/ui/src/experimental/DateRangeSelector/relative-date-range.test.ts`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.presets.test.tsx`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.test.tsx`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.

Limits: No fiscal engine is supplied. Older prose about preset buttons is stale, addressed under K16; current implementation is described selectable options. Native/AT coverage remains independent.

Successor: none required for this leaf; independent acceptance and final production gates remain open.

## A-K-07 — partial

Original requirement: Keep typed/segmented input and calendar selection synchronized; define invalid/partial typing, paste, blur, and form submission behavior.

Typed/segmented/calendar synchronization, incomplete drafts, committed hidden fields, native validity, Enter/blur normalization and error timing are defined/tested. Full-date segmented paste is only an observation spec that allows ignored paste; current guide explicitly lists paste/autofill matrix as pending. Thus the full paste contract is not settled by existing typed-entry evidence. New K04 entry-policy defect also prevents unconditional synchronization/validation closure.

Source references: `packages/ui/src/experimental/DateField/TextDateField.tsx`; `packages/ui/src/experimental/DateField/DateField.tsx`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx`; `packages/ui/src/experimental/DateRangePicker/DateRangePicker.tsx`; `docs/developer/react-aria-calendar-contracts.md:623-635`.

Test/evidence references: `packages/ui/src/experimental/DateField/TextDateField.test.tsx`; `packages/ui/src/experimental/DatePicker/DatePicker.native-transactions.test.tsx`; `packages/ui/src/experimental/DateRangePicker/DateRangePicker.test.tsx`; `packages/ui/tests/browser/datepicker-native-transactions.spec.ts:172-200`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.

Limits: No new browser clipboard, autofill or submit run. Source onChange handling is not proof of trusted paste behavior.

Required successors:

- **K07-paste-contract**: Document supported paste for flexible date/time/range text and segmented/date-time fields: accepted clipboard formats, ignored/rejected behavior, partial/reversed/invalid paste, blur/Enter, native submit and accepted hidden values. Record actual trusted clipboard event outcome per supported engine rather than substituting a synthetic event. Validation/prerequisites: Use existing datepicker-native-transactions paste observation as starting point; bounded native clipboard run requires coordinator-owned fixture/server and clipboard-capable environment. Add assertions for declared supported outcomes and retain controlled rejection/reset assertions.

- **K07-entry-policy**: Carry the K04 DatePicker availability fix through typed/segmented/calendar synchronization without emitting invalid accepted values. Validation/prerequisites: K04 exact reproduction and affected synchronized form cases.


## A-K-08 — partial

Original requirement: Test leap years, month boundaries, daylight-saving gaps/overlaps, date-only timezone independence, midnight ranges, and inclusive/exclusive endpoints.

Retained tests cover leap/century/month/year boundaries, Chicago spring gap/fall overlap with reject/earlier/later, Tokyo midnight conversion, timezone-free JSON values, explicit inclusive days versus nights, and a 400-year civil oracle. Clock midnight parsing is tested. These are not an exercised overnight DateTimeRangePicker interval: current composition tests cover same-day edits/endpoint refusal and changed guard regressions, not a cross-midnight accepted interval. Inclusive-only civil endpoints are documented; host exclusive-end conversion lacks direct boundary evidence.

Source references: `packages/ui/src/experimental/DateRangeSelector/date-contract.ts`; `packages/ui/src/utils/relative-dates.ts`; `docs/developer/react-aria-calendar-contracts.md:6-26`.

Test/evidence references: `packages/ui/src/experimental/DateField/DateField.test.tsx:51-65`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.test.tsx:10-15`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.test.tsx:128-135`; `packages/ui/src/experimental/DateRangeSelector/DateContracts.next100-regression.test.tsx`; `packages/ui/src/experimental/DateRangeSelector/RangeGestures.test.tsx`; `packages/ui/src/utils/relative-dates.test.ts`; `packages/ui/src/experimental/DateTimeRangePicker/DateTimeRangePicker.test.tsx`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.

Limits: DateTimeRangePicker source/tests changed concurrently; FA04 output and old same-day tests are not fresh acceptance of the changed composition. No fresh native timezone matrix.

Required successors:

- **K08-overnight-and-exclusive**: After BUG0008 is frozen, add focused DateTimeRangePicker evidence for 2026-10-07T23:30:00 to 2026-10-08T00:15:00, reversed same-date end rejection, bounds at midnight and retained seconds; assert atomic callback and both accepted hidden values. Document/test conversion of inclusive civil range end to next civil day when a host API requires exclusive end, including month/leap and a DST-short/long local day. Validation/prerequisites: Use explicit timezone and disambiguation for instant conversions; do not add 24h to an instant to derive the next civil date. Reuse passed DST/civil tests, run only new affected cases.


## A-K-09 — complete

Original requirement: Test RTL, translated labels, first-day-of-week settings, non-Gregorian display where supported, and accessible available/unavailable/selected states.

Retained executed DOM tests cover explicit Sunday/Monday order in both months, Arabic RTL arrow semantics, available/unavailable/selected dates, and Hebrew display emitting Gregorian leap-day values. New passing K09 DOM test supplies actual Arabic translations for previous/next month and availability disclosure, checking translated controls plus selected and disabled calendar semantics. This closes a concrete translated-label evidence gap without claiming native or AT coverage.

Source references: `packages/ui/src/experimental/Calendar/Calendar.tsx`; `packages/ui/src/experimental/Calendar/Calendar.native-locales.native-fixture.tsx`; `packages/ui/src/experimental/Provider/Provider.tsx`; `packages/ui/src/i18n/index.tsx`.

Test/evidence references: `packages/ui/src/experimental/Calendar/Calendar.native-locales.test.tsx`; `packages/ui/src/experimental/Calendar/Calendar.test.tsx`; `docs/developer/final-acceptance/wave-02-11/acceptance.test.tsx (K09)`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison. New isolated probe executed; see `probe.log` and the exact named case in `acceptance.test.tsx`.

Limits: Representative DOM matrix only: ar-EG and en-US-u-ca-hebrew, Sunday/Monday tests. Not every calendar/locale, spoken output, translation quality or physical RTL device certification. K17 callback-reason defect remains open.

Successor: none required for this leaf; independent acceptance and final production gates remain open.

## A-K-10 — complete

Original requirement: Define serialization and host callbacks using the owned date contract; document conversion adapters to upstream date utilities.

Owned DateOnly string, inclusive DateRange, local datetime and HH:mm:ss contracts and host callback serialization are documented. Internal parseDate/parseDateTime plus toCalendar(...,GregorianCalendar) adapt engine classes before callbacks; explicit dateTimeToInstant is the exported host adapter for timezone/disambiguation and returns UTC ISO. JSON immutability and timezone conversion tests pass in retained FA04 evidence. No upstream class escapes public values.

Source references: `packages/ui/src/experimental/DateRangeSelector/date-contract.ts`; `packages/ui/src/experimental/DateRangeSelector/DateContracts.next100-regression.test.tsx`; `docs/developer/react-aria-calendar-contracts.md:6-26`; `apps/docs/examples/FormIntegrationExamples.tsx:33-60`; `packages/ui/src/experimental/Calendar/Calendar.tsx`.

Test/evidence references: `packages/ui/src/experimental/DateField/DateField.test.tsx:58-65`; `packages/ui/src/experimental/DateRangeSelector/DateContracts.next100-regression.test.tsx`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.

Limits: Types use strings, not a branded static validator; hosts supply valid complete values. No implicit timezone/fiscal/database mapping or runtime fetching is promised. New compositions remain K12.

Successor: none required for this leaf; independent acceptance and final production gates remain open.

## A-K-11 — complete

Original requirement: Provide stories for booking-like availability, reporting ranges, long translations, dark/density modes, and standalone versus popover calendars.

Approved docs-host replacement provides booking availability/reporting presets, compact and comfortable standalone/popover examples, shared light/dark settings and Arabic/long-label date presentations in private native fixtures. Each source-backed docs panel has its own state owner. Existing native fixture build is retained only for matching inputs. The catalog router file has a changed hash (concurrent TextArea docs fix), so no new blanket docs-build pass is claimed.

Source references: `apps/docs/examples/catalog/forms-dates.tsx`; `apps/docs/examples/CalendarCompositionExamples.tsx`; `apps/docs/examples/AdvancedCalendarExamples.tsx`; `apps/docs/examples/LocalizedRangeExample.tsx`; `apps/docs/native-fixtures/scenarios/experimental/DateRangeSelector/DateRangeSelector.fixture.tsx`; `apps/docs/native-fixtures/scenarios/experimental/Box/Box.fixture.tsx:150-172`.

Test/evidence references: `packages/ui/tests/browser/hardening-date-presentation.spec.ts`; `packages/ui/tests/browser/calendar.spec.ts`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.

Limits: Original leaf asks to provide scenarios; existence/provenance closure is not screenshot, current browser execution or broad visual acceptance. Storybook runtime is intentionally absent.

Successor: none required for this leaf; independent acceptance and final production gates remain open.

## A-K-12 — partial

Original requirement: [Decision] Define whether multiple arbitrary dates, comparison periods, fiscal periods, or month/year-only selectors belong in the first advanced release; implement selected features with proof of behavior.

Current selected first advanced features include arbitrary multiple dates, previous-period/previous-year/custom comparisons and whole Gregorian week/month/quarter/year selectors. Fiscal calculation remains host-supplied resolved presets. Multiple selection has retained proof. Period/comparison source and tests changed for BUG0008; earlier tests do not certify current bytes. Guide initial limits still call comparison/month-year-only deferred, contradicting the current family section.

Source references: `docs/developer/react-aria-calendar-contracts.md:518-593`; `packages/ui/src/experimental/Calendar/Calendar.tsx`; `packages/ui/src/experimental/PeriodPicker/PeriodPicker.tsx`; `packages/ui/src/experimental/DateRangeComparisonPicker/DateRangeComparisonPicker.tsx`; `apps/docs/examples/AdvancedCalendarExamples.tsx`.

Test/evidence references: `packages/ui/src/experimental/Calendar/Calendar.test.tsx`; `packages/ui/src/experimental/Calendar/Calendar.native-locales.test.tsx`; `packages/ui/src/experimental/PeriodPicker/PeriodPicker.test.tsx`; `packages/ui/src/experimental/DateRangeComparisonPicker/DateRangeComparisonPicker.test.tsx`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.

Limits: Coordinator owns current source/test validation. This report observes source guards and new tests but does not run or certify them. Definition of fiscal engine remains deferred, not silently implemented.

Required successors:

- **K12-decision-and-proof**: Adopt the explicit selected/deferred feature table in this report into the maintained calendar contract, removing contradictory initial-deferred statements. Coordinator must attach fresh targeted BUG0008 results for exact PeriodPicker/comparison inputs plus existing quarter/unavailable/previous-year/adjacent-period/Cancel assertions. Validation/prerequisites: Do not rerun unaffected arbitrary-multiple Calendar tests; compare hashes and reuse FA04. Run changed composition scopes only. No first-release acceptance inferred from examples alone.


## A-K-16 — partial

Original requirement: Publish feature limits honestly; React Aria provides useful building blocks, not a complete recurrence or resource-scheduling engine.

Host ownership and recurrence/resource-scheduling limitations are published, but internally contradictory older paragraphs say comparison/month-year-only selectors are deferred and describe visible preset paragraphs/pressed buttons after implementation changed to selectable rows with visually hidden option descriptions. Broadly publishing honest current limits is incomplete while these claims remain. The report provides ready replacement wording and a current feature table rather than repeating only the stale-doc finding.

Source references: `docs/developer/react-aria-calendar-contracts.md:96-145`; `docs/developer/react-aria-calendar-contracts.md:188-218`; `docs/developer/react-aria-calendar-contracts.md:518-659`; `packages/ui/src/experimental/DateRangeSelector/date-contract.ts`; `apps/docs/examples/AdvancedCalendarExamples.tsx`.

Test/evidence references: `packages/ui/src/experimental/DateRangeSelector/relative-date-range.test.ts`; `packages/ui/src/experimental/DateRangeComparisonPicker/DateRangeComparisonPicker.test.tsx`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.

Limits: Only owned report can be changed in this wave; maintained guide was not edited, so publication obligation remains partial.

Required successors:

- **K16-publish-reconciled-limits**: Replace outdated initial scope/availability/preset paragraphs using the supplied report wording; retain the meaningful experimental, matrix, native clipboard/AT and host-owned timezone/business-policy limitations. State shipped comparison/Gregorian period features, narrow English relative grammar and availability-callback gaps until fixed. Validation/prerequisites: Review against exact current public props and render patterns; documentation-only review suffices unless changed behavior is claimed. Link this report and K04/K17 successors until remediation.


## A-K-17 — partial

Original requirement: Define keyboard and non-hover access to availability explanations, range previews, and preset descriptions; rich date-cell decorations must not replace meaningful date labels.

Range selector associates focused-cell reasons/preview/context, keeps full date names, offers keyboard preset descriptions and hides day annotations from accessible names. Static unavailable lists have keyboard/touch details disclosure. Historical batch61 reports Chromium light/dark 2/2 at candidate 5cc976d / worker 913b79d, not current source. New GAP K17 proves standalone Calendar dynamic availability callback disables a date but renders no reason, disclosure or aria-describedby; title only handles static records. Calendar/DatePicker dynamic restrictions therefore lack the requested non-hover explanation.

Source references: `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx:295-320`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx:385-418`; `packages/ui/src/experimental/Calendar/Calendar.tsx`; `docs/developer/parallel-batch-61/keyboard-range-preview.md`.

Test/evidence references: `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.test.tsx:50-126`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.test.tsx:191-235`; `packages/ui/tests/browser/batch61-keyboard-range-preview.spec.ts`; `docs/developer/final-acceptance/wave-02-11/acceptance.test.tsx (GAP K17)`. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.

Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison. New isolated probe executed; see `probe.log` and the exact named case in `acceptance.test.tsx`.

Limits: No screen reader, real touch or current native browser execution here. Rich decorations remain aria-hidden supplemental content, never replacement date names.

Required successors:

- **K17-callback-reason-access**: Expose Calendar getDateUnavailableReason results through non-hover, focused-cell descriptions/status and/or keyboard/touch disclosure; preserve localized complete date names and remove stale owned associations. Static records and callback reasons should share a consistent policy without fetching data. Include DatePicker, which composes Calendar. Validation/prerequisites: Turn GAP K17 into positive reason-association coverage and test callback replacement/removal, read-only/disabled and focus traversal; retain range preview/preset description assertions.

- **K17-native-and-AT**: After fixing callback reasons, execute bounded native keyboard/touch-disclosure and focused-preview scenarios on the replacement docs fixture host; record named browser and AT/platform versions, actual spoken reasons/preview behavior and preserved date names. Validation/prerequisites: Operator/AT environment and coordinator-owned frozen fixture build required. Historical DOM/browser receipts do not establish current spoken output.


## Handoff boundary

`results.json` contains exactly one record for each of the 14 assigned IDs, with original text, status, findings, source/tests/evidence, actual checks, input/head/host limits and concrete successor deliverables. `input-receipt.json` supplies exact hashes. Retained historical browser receipts identify their earlier heads/hosts; no native, physical-device, AT, remote CI, legal, release or production result was created in this wave. Coordinator review must reconcile the seven recommendations for closure and retain the seven partial obligations.
