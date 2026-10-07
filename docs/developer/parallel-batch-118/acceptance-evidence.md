# Batch118: K-01, K-02, K-04 and K-05 acceptance evidence

Assessment date: October 7, 2026. Reviewed source head:
`e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev` assigned baseline).
Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-118-calendar-evidence/sg-ui`.
Branch: `codex/batch-118-calendar-evidence`.

This is a fresh read-only assessment of four unchecked parent criteria and actual
retained evidence, not another migration inventory or a new browser execution.
Only this report changed. The coordinator alone accepts criteria and integrates.
No master acceptance, ledger, production, shared configuration or other report edits.
No dependency install, tests, build, pack, browser, performance, lease or CI command
ran in this assignment. No production defect was demonstrated by inspection.

## Per-ID decision matrix

| Criterion | Evidence assessment at reviewed head | Exact supported scope | Remaining gate / owner |
| --- | --- | --- | --- |
| K-01 | Fully supported **as a requirements-and-examples definition** | [Calendar contracts](../react-aria-calendar-contracts.md), “Serializable values”, “Selection and drafts”, “Initial scope and accessibility limits”, define civil date, local datetime, clock, inclusive range, presets, host unavailable days, draft Clear, explicit Apply/Cancel, and deferred scheduling features. `DateField` DateOnly/TimezoneResolution, `TimeField` Clock, `DateRangeSelector` Reporting/Availability/KeyboardRangePreview and `DateRangePicker` stories provide concrete examples. | Root may reconcile this narrow definition criterion. This does not establish runtime success of every example or production calendar acceptance; K-02/K-04/K-05 and broader K/manual/device/AT gates remain separate. |
| K-02 | Partial parent acceptance; all six requested implementation roles are source-supported | Owned `DateField`, `Calendar`, `DatePicker`, `DateRangePicker`, `TimeField` exports exist in `src/experimental/index.ts`. `DateRangeSelector` implements the sixth role, range calendar, with an internal React Aria `RangeCalendar`, owned string/range props and owned CSS. All six have colocated tests/stories. No standalone owned public `RangeCalendar` export exists. | Coordinator must decide whether the composed selector satisfies the required range-calendar building block or a standalone owned primitive is required. These are experimental proof controls; public production acceptance, current-head guards/runtime coverage and the full field/range/time matrix are not established by file presence or this inspection. No independent new primitive is authorized here. |
| K-04 | Partial | `DateField`/`TimeField` expose min/max, native validation, required/optional, invalid/error/description; `Calendar` accepts bounds and host availability; `DatePicker` invalidates a selected unavailable date; range validator rejects malformed/reversed/out-of-bound/inclusive-unavailable ranges. Selector blocks invalid/pending Apply, disables required Clear, and exposes focused reasons, full labels and native disclosure. Retained E31 DatePicker native tests prove missing-required and a complete below-min edit cannot submit in Chromium; E30 proves unavailable constrained range focus/activation in both themes. | Complete max-bound, optional/required, datetime/time and availability-change validation matrix across engines at an attributed current candidate; spoken error/reason acceptance. Range hidden committed inputs are not a native required-range validator: documented host final-submission validation remains necessary. Calendar itself supplies a reason `title` and a keyboard/touch disclosure, not the selector's focused reason association. Host owns availability computation/business data and final validation. |
| K-05 | Partial | Calendar and selector implement one/two localized month headings, previous/next buttons, keyboard interaction delegated internally, token CSS container sizing and a 38rem stacking rule. E31 Calendar proves two-month keyboard selection/deselection, focus distinct from selection, RTL arrows and Hebrew/Gregorian callbacks. E31 DatePicker proves Escape focus return and reopened leap/cross-month synchronization. E30 proves focused range descriptions without committing. | No retained explicit keyboard year-jump regression was found in inspected calendar specs/tests (no PageUp/PageDown/Shift year navigation assertions). CSS is not native responsive geometry proof; `calendar.spec.ts` checks narrow preset wrapping, not both grids' stacking/containment. Screen-reader month/date/range announcement content/timing, zoom/enlarged-text, physical-device behavior and full locale/calendar/engine coverage need coordinator/manual acceptance. Previous/next month buttons can traverse years, but that does not prove efficient/direct year navigation. |

K-01's success examples have meaningful definitions: complete civil values serialize
without an implicit timezone; datetime resolves only with a host timezone; a preset
changes the range draft until Apply; Cancel restores committed endpoints; optional
Clear changes the draft until Apply; unavailable endpoints/interior days cannot
produce an accepted range. The definition includes required Clear disabling.
This distinguishes a defined success example from an executed current-head proof.

## Source evidence and ownership

The exact Git blobs below were read at the reviewed head using `git ls-tree` /
`git rev-parse HEAD:path`. They identify source bytes, not passing test results.
Links resolve to the inspected files in this repository.

| Source / evidence file | Git blob at reviewed head |
| --- | --- |
| [docs/developer/react-aria-calendar-contracts.md](../../developer/react-aria-calendar-contracts.md) | `3a3c1a7efbad904f16155e9977768c375f4d2c94` |
| [src/experimental/index.ts](../../../src/experimental/index.ts) | `1ddfaaa40ff4e61f53d5853428abbe000075f61b` |
| [src/experimental/DateField/DateField.tsx](../../../src/experimental/DateField/DateField.tsx) | `559fd4918096a536452e8ebd57abc48a84e1a619` |
| [src/experimental/DateField/DateField.stories.tsx](../../../src/experimental/DateField/DateField.stories.tsx) | `26c0398a7a5ccb8a44d4322e127c069f5be817d9` |
| [src/experimental/TimeField/TimeField.tsx](../../../src/experimental/TimeField/TimeField.tsx) | `8fce7e8099024b632dd62b2af5fe4e4d4bf80fc6` |
| [src/experimental/TimeField/TimeField.test.tsx](../../../src/experimental/TimeField/TimeField.test.tsx) | `e63691e7195548d48be3bb2dcce6b3055f5d7a0a` |
| [src/experimental/Calendar/Calendar.tsx](../../../src/experimental/Calendar/Calendar.tsx) | `398c4d756b023c025d514a1b718d075ddec07c85` |
| [src/experimental/Calendar/Calendar.native-locales.stories.tsx](../../../src/experimental/Calendar/Calendar.native-locales.stories.tsx) | `099fd58d5d14510a6973da814a9e60eb0b0781f4` |
| [src/experimental/Calendar/Calendar.native-locales.test.tsx](../../../src/experimental/Calendar/Calendar.native-locales.test.tsx) | `623179da6adf2e56e400c902253f7b7253f4b0fa` |
| [src/experimental/DatePicker/DatePicker.tsx](../../../src/experimental/DatePicker/DatePicker.tsx) | `cdb6cd6618b78587ecab3a4044f5c349945d0dcd` |
| [src/experimental/DatePicker/DatePicker.native-transactions.stories.tsx](../../../src/experimental/DatePicker/DatePicker.native-transactions.stories.tsx) | `5654e1048847904614f84cefd1fec971f9a1ef09` |
| [src/experimental/DateRangePicker/DateRangePicker.tsx](../../../src/experimental/DateRangePicker/DateRangePicker.tsx) | `fca985f8e6ba544cde35d8d98591ab10877a9d75` |
| [src/experimental/DateRangeSelector/DateRangeSelector.tsx](../../../src/experimental/DateRangeSelector/DateRangeSelector.tsx) | `0f570bbec2e6acafe464557fe471649fe3f23f44` |
| [src/experimental/DateRangeSelector/DateRangeSelector.module.css](../../../src/experimental/DateRangeSelector/DateRangeSelector.module.css) | `b7052417e3fbdeef01f25540a3f1f11619404ca9` |
| [src/experimental/DateRangeSelector/date-contract.ts](../../../src/experimental/DateRangeSelector/date-contract.ts) | `28fe61014fb64dbfa5e2c79dd433926548a75855` |
| [src/experimental/DateRangeSelector/DateRangeSelector.stories.tsx](../../../src/experimental/DateRangeSelector/DateRangeSelector.stories.tsx) | `882f1b89873ec379fa85aa07293ff17e5c45fcef` |
| [src/experimental/DateRangeSelector/DateRangeSelector.test.tsx](../../../src/experimental/DateRangeSelector/DateRangeSelector.test.tsx) | `dd0e99e530e3575a5ba156e07b761ac0623b51a7` |
| [tests/browser/calendar-native-locales.spec.ts](../../../tests/browser/calendar-native-locales.spec.ts) | `dfb3d49cdb935658ecb2b8d3f70906b4ee27ef7a` |
| [tests/browser/datepicker-native-transactions.spec.ts](../../../tests/browser/datepicker-native-transactions.spec.ts) | `9b3e45920dbe43d2f565e356e44759885916240f` |
| [tests/browser/batch61-keyboard-range-preview.spec.ts](../../../tests/browser/batch61-keyboard-range-preview.spec.ts) | `b94fc1cd689f7766aaa9d61f6d8d8c031e8cd110` |
| [tests/browser/calendar.spec.ts](../../../tests/browser/calendar.spec.ts) | `6c41cdcd740ad4d96b2d7ee555eda4d18e8cd636` |
| [tests/browser/batch01-calendar.spec.ts](../../../tests/browser/batch01-calendar.spec.ts) | `433ebf51c722cee0330eff59c9bdc7645f1d1195` |
| [docs/developer/parallel-batch-74/calendar-native-locales.md](../../developer/parallel-batch-74/calendar-native-locales.md) | `fef75a25ef804c47219bd4b80344fed975c8504a` |
| [docs/developer/parallel-batch-73/datepicker-native-transactions.md](../../developer/parallel-batch-73/datepicker-native-transactions.md) | `29c2992c8bf12a370fc12f24837c6443d74dc7f6` |
| [docs/developer/parallel-batch-61/keyboard-range-preview.md](../../developer/parallel-batch-61/keyboard-range-preview.md) | `e999b84027b1931df1eb0b2682918ce6ca43bd2f` |

All six implementations receive UI values/callbacks from the host. Inspection of
the six directories found no `fetch(`, `axios` or `XMLHttpRequest` references.
This is a bounded direct-source search, not a complete network/dependency audit.
Date/time parsing and internal interaction types remain behind the owned public
contracts. Availability arrays are host supplied; no booking service, permission
policy or persistence is implemented by the controls.

`Calendar.tsx`: options and `shared` map bounds, focus, host unavailable dates,
visibleDuration and disabled/readOnly; header/grids supply localized month headings.
`DateField.tsx` / `TimeField.tsx`: safe parsing, stable parsed values and native
field hooks expose required/bounds validation and descriptions. `DatePicker.tsx`
composes field/calendar/owned Popover; `DateRangePicker.tsx` composes selector and
committed hidden fields. `DateRangeSelector.tsx` lines 14–140 contain the owned
props, whole draft transaction, constraints, month grids, availability reasons,
Clear/Cancel/Apply and committed-only hidden fields. `date-contract.ts` supplies
inclusive range validation. No API fetch was required to demonstrate these roles.

## Retained native evidence inspected now

E31 root (absolute local artifact directory):
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/7c82140b-3a18-4b19-aca5-9a5f0720af5f`.

E30 root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/80b00fee-f55f-45e8-88dc-4666223d88cc`.

I opened and parsed each root `evidence.json`, each listed shard's `evidence.json`
and `results.json`, and checked its `browser.log` exists. Result files contain
`errors: []`, zero skipped/unexpected/flaky and the counts below. I did not rerun
or render the HTML reports, rehash the entire Storybook build, or establish every
transitive dependency matches the historical candidates. Root artifacts retain
build/types commands and source/build digests; the checks here verify retained
records and relevant Git source bytes, not a new current-head whole-matrix pass.

| Evidence | Actual tested head | Retained outcome / scope | Results SHA-256 |
| --- | --- | --- | --- |
| E31 `calendar-native-locales/` | `1a378accd909a471e653fe4e27fe9457c9531049` | Chromium 10 expected, 0 skipped/unexpected/flaky; 4884.726ms; light/dark two-month, first-weekday, Arabic arrows, Hebrew display and unavailable activation. | `41fc87ab346d56bf596022612fa6170d83815e0ffd18ae93b4b11bdd193aca66` |
| E31 `datepicker-native-transactions/` | `1a378accd909a471e653fe4e27fe9457c9531049` | Chromium 6 expected, 0 skipped/unexpected/flaky; 4680.426ms; required partial input, below-min rejection, two timezone civil transactions, controlled rejection and paste observation. | `8af7b9c7f1d600703f52aabfe25372e4b394fa2e025c8816eb6633a588fef60d` |
| E30 `keyboard-range-preview/` | `5cc976dc1b9af6ced3980ec0e93fe930a9a8237b` | Chromium 2 expected, 0 skipped/unexpected/flaky; 3516.446ms; light/dark focused preview, constrained unavailable traversal, unchanged committed data and Cancel. Whole root has another failed pointer shard. | `66d6c2993823c7fc8331c9c2f03bf8b05ac0f1614d6a9e8e16f62f9db703b0d5` |

E31 source digest:
`d693faa54cb1419030282fe955d89f92f44f941cea24db640f3c519c60ae73ce`;
recorded build digest:
`ec6eca4336c63f839bde0508a026992dd9110b342f6072e714a5eaf6f14cde75`.
E30 source digest:
`43bd8083dad4209f05ab036ef66e5107eadee96747ee37fa2307da8fc2d934e3`;
recorded build digest:
`6978ebf422790330db7d1a041dfa973e0d3f01c06362a9afbefb43719c5a6ee0`.
Runtime records identify Node v24.19.0/Darwin 27.0.0. Shards explicitly select
Chromium; none establishes Firefox/WebKit or spoken assistive-technology output.

Direct Git comparison found identical reviewed-head / tested-head blobs for:
E31 Calendar implementation/native story/unit/spec, DatePicker implementation/native
story/unit/spec; E30 selector implementation/CSS/story/unit/range-preview spec.
Current Calendar SHA-256 hashes also match the four hashes printed in batch74's
report. This recovers relevant source identity even though the temporary wave30
and wave31 attribution JSON files are **missing**. It is not whole-source identity.

Artifact retention limits: `/tmp/sgui-batch45-candidate-wave30-attribution.json`,
`/tmp/sgui-batch45-candidate-wave31-attribution.json` and
`/tmp/sgui-calendar-final-browser-results.json` do not exist at inspection time.
The older aggregate calendar pass in the browser acceptance document therefore
remains a historical report, not fresh inspected executable proof. Batch01's
report records older Chromium/WebKit success and Firefox launch failure; it is not
an execution of the current baseline. Its source specs remain useful for root's
next window. E31's DatePicker full-date paste case intentionally observed ignored
trusted text; its pass must not be read as full-date paste support.

## Bounded handoff and exact checks performed

No source correction or new test was justified by a demonstrated failure, so no
optional `tests/browser/acceptance-pack-118.spec.ts` was created. Existing suites
should be admitted first rather than duplicated. All proposed executions below
are **UNRUN in batch118** and require the coordinator's validation window.

- K-04: root can run existing DatePicker transactions, calendar explanations,
  batch01 range transactions and relevant field/time suites against one frozen
  candidate. Retain exact candidate head/source/build identity and per-engine
  results. Add only uncovered max-bound/optional/time/datetime/host-availability
  cases after checking other workers' evidence; preserve host committed-range
  validation boundary. No behavior failure / exclusive production allowlist yet.
- K-05: reserve at most `tests/browser/acceptance-pack-118.spec.ts` for a future
  native year navigation and responsive-grid geometry slice using the existing
  deterministic `migration-proofs-calendar-native-locales--sunday-first` story.
  Assert focus/civil callback separation during month/year traversal, both grids'
  geometry at wide/narrow containers and retained native focus. Check the actual
  supported year keystroke first; do not invent a year selector requirement or
  infer it from labels. No source/new-story change needed unless a native failure
  demonstrates one; then assign minimal exclusive source scope separately.
- K-02: if root requires a standalone owned range-calendar public building block,
  first reserve its new implementation/test/story/export paths in a separate task;
  no authorized source allowlist exists in this report-only assignment.
- K-04/K-05 AT/device: manual owner records reader/device/browser/locale/version,
  exact head, focused date/reason/error and actual spoken content/timing, plus
  physical touch and zoom/enlarged-text geometry. DOM names/statuses cannot supply
  that evidence. Host owns business availability and final required-range submit.

Performed: managed worktree creation at exact assigned baseline, branch creation,
`git rev-parse HEAD`, source/doc/spec reads with `rg`/`cat`/`sed`, test assertion
inspection (no execution), `git ls-tree`/blob comparison at the two historical
candidate commits, SHA-256 reads of Calendar source and retained JSON/logs,
retained result JSON statistics inspection and explicit missing-artifact checks.
The source search for network calls/year-key assertions returned no matches
(`rg` exit 1, expected search result). Documentation links and allowed-path diff
are checked before commit; no validation lease acquired or global job started.

Report is ready for coordinator review. No parent criterion or broader K/G/U/X/R/Z
acceptance is marked complete by this worker; root retains all acceptance and
integration ownership.
