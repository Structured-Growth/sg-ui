import json
from pathlib import Path
p=Path('docs/developer/final-acceptance/wave-02-11')
r=json.loads((p/'results.json').read_text())
a=json.loads((p/'input-receipt.json').read_text())
intro='''# Wave 02 / 11 — calendar and date acceptance

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
'''
sections=[intro]
for x in r['leaves']:
 s=f"\n## {x['id']} — {x['status']}\n\nOriginal requirement: {x['originalRequirement']}\n\n{x['findings']}\n\n"
 s+='Source references: '+ '; '.join('`'+v+'`' for v in x['sourceReferences'])+'.\n\n'
 s+='Test/evidence references: '+ '; '.join('`'+v+'`' for v in x['testReferences'])+'. Matching tests use the retained FA-04 evidence described above unless explicitly identified as new probes or changed-source tests. Merely listing a native spec is not an execution claim.\n\n'
 s+='Checks actually performed: full-leaf/source/assertion reconciliation and current scoped hash comparison.'
 if x['id'] in ['A-K-04','A-K-09','A-K-17']:s+=' New isolated probe executed; see `probe.log` and the exact named case in `acceptance.test.tsx`.'
 s+='\n\nLimits: '+x['limits']+'\n\n'
 if x['successors']:
  s+='Required successors:\n\n'
  for nxt in x['successors']:s+=f"- **{nxt['id']}**: {nxt['deliverable']} Validation/prerequisites: {nxt['validation']}\n\n"
 else:s+='Successor: none required for this leaf; independent acceptance and final production gates remain open.\n'
 sections.append(s)
sections.append('''\n## Handoff boundary\n\n`results.json` contains exactly one record for each of the 14 assigned IDs, with original text, status, findings, source/tests/evidence, actual checks, input/head/host limits and concrete successor deliverables. `input-receipt.json` supplies exact hashes. Retained historical browser receipts identify their earlier heads/hosts; no native, physical-device, AT, remote CI, legal, release or production result was created in this wave. Coordinator review must reconcile the seven recommendations for closure and retain the seven partial obligations.\n''')
(p/'report.md').write_text(''.join(sections))
print('report written; '+str(len(r['leaves']))+' leaf sections')
