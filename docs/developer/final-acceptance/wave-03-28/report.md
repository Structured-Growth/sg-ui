# Wave 03 / 28 — periods, navigation and civil boundaries

Result: **A-K-12 complete; A-K-05 and A-K-08 partial.** This recommendation does not change any central checklist or count. Work is confined to `wave-03-28`; three unified patches and matching proposed-file mirrors are ready for coordinator review. No production implementation defect was established in this scope and no runtime/API change is proposed.

Read AGENTS.md, final-acceptance policy, assignment, prior wave-02-11 report/results/receipt and coordinator-integration evidence. `input-receipt.json` compares 93 previous calendar-related inputs: 82 match wave-02-11; all 33 with coordinator-integration counterparts match that newer accepted input. All 132 scoped built library/private fixture outputs match the coordinator receipt. This is bounded hash reconciliation, not a fresh build. The receipt retains exact old report/results hashes, source/output paths and runtime-helper hash. No unchanged accepted suite was rerun.

## A-K-05 — partial

Original requirement: Support multi-month presentation, responsive container sizing, month/year navigation, keyboard navigation, focus return, and meaningful date announcements.

Current Calendar, CalendarNavigation and their tests match the newer coordinator source receipt. Existing `calendar-native-locales.spec.ts` covers two-month selection, unavailable traversal, leap day, Arabic RTL and Hebrew date names. Existing `hardening-date-presentation.spec.ts` covers both densities/themes, en/ar, 360px reflow, 150% text and picker Escape/Apply focus restoration. These are concrete executable scenarios, not new executions in this chat. They retain historical host evidence without claiming current native or AT acceptance.

`native-navigation.patch` adds a dedicated `NavigationReflow` export to the existing docs-owned Calendar fixture module and a four-case native spec (light/dark × compact/comfortable). The fixture uses public package imports and explicit Provider theme/density. The spec jumps from January 2000 to February 1984 without selecting a date, selects February 29 by keyboard, then resizes 1100→360→1100 while asserting selection, focus visibility and no document horizontal overflow. It records screenshots and fails on browser errors/warnings. It does not modify existing fixtures or assertions. Vite's existing registry generator discovers the new export during the coordinator fixture build; this chat did not regenerate any shared registry.

Residuals: apply/review the proposed fixture/spec, run the exact bounded native commands in `validation-plan.json` against a frozen host, and attach diagnostics and source/build/host digests. No AT session or operator was provided. A representative spoken announcement observation with named AT/browser/platform versions remains required. DOM labels are not spoken evidence. Text enlargement is not real zoom. This leaf remains partial.

## A-K-08 — partial

Original requirement: Test leap years, month boundaries, daylight-saving gaps/overlaps, date-only timezone independence, midnight ranges, and inclusive/exclusive endpoints.

Retain unchanged DateField DST gap/overlap assertions (reject, earlier, later in Chicago), DateContracts timezone-independence assertions (Chicago/Tokyo), and civil arithmetic/leap tests through their matching accepted inputs. Do not repeat them merely to produce a newer timestamp.

New `exclusive-boundaries.mjs` ran successfully with Node **24.21.0**, first with TZ unset and then `TZ=America/Chicago` and `TZ=Asia/Tokyo`. All three logs are saved. It imports the currently built pure utility modules, whose scoped hashes match accepted coordinator output. It asserts leap-day/non-leap/month/year rollover, domain overflow rejection, inclusive one-day bounds, unavailable inclusive endpoint rejection, and unchanged civil values. Resolving the next civil midnight explicitly in Chicago with `reject` yields the exact expected instants and **23-/25-hour** spring/fall days. The elapsed-time subtraction only measures resolved instants; it never advances an end by 24 hours. `addCivilDays` is an internal utility used by this evidence-local host-policy probe, not a newly promised public API.

Commands from repository root:

```sh
/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node docs/developer/final-acceptance/wave-03-28/exclusive-boundaries.mjs
TZ=America/Chicago /Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node docs/developer/final-acceptance/wave-03-28/exclusive-boundaries.mjs
TZ=Asia/Tokyo /Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node docs/developer/final-acceptance/wave-03-28/exclusive-boundaries.mjs
```

`boundaries.patch` adds three focused DateTimeRangePicker cases: atomic overnight edit from `2026-10-07T23:30:00` to `2026-10-08T00:15:00` retaining edited seconds; reversed same-date end rejection with Cancel preservation; exact midnight min/max inclusivity and max+one-second rejection. Assertions inspect both actual submitted hidden fields and exact callbacks. The evidence-local runnable copy imports the same current working source; the proposed colocated mirror uses ordinary local component imports.

The first lease-admitted Vitest 4.1.11 attempt failed before collecting tests because evidence-directory imports could not resolve `@testing-library/react`. The corrected runnable copy resolves testing dependencies through the existing library node_modules. Two subsequent admissions found the shared lease occupied and started no tests. All logs are retained as `unit-first-resolution-failure.log`, `unit-lease-occupied.log`, and `unit.log`. No lease was bypassed/reclaimed and no UI assertion is represented as passed. Exact supported-runtime lease command and post-integration command are in `validation-plan.json`.

`contracts.patch` adds host guidance for inclusive civil→exclusive API conversion, overflow, explicit reporting timezone/disambiguation, seconds and same-date overnight rejection. It preserves deterministic relative grammar/referenceDate, reverse-first completion and drag policies. There is no new clock, timezone inference, fiscal engine or parser change.

Residual: integrate and execute the three UI cases; integrate/review contract guidance. Pure utility success does not close UI acceptance. Native/AT claims remain independent.

## A-K-12 — complete (bounded feature decision and behavior proof)

Original requirement: [Decision] Define whether multiple arbitrary dates, comparison periods, fiscal periods, or month/year-only selectors belong in the first advanced release; implement selected features with proof of behavior.

The prior requested decision wording is now maintained in `react-aria-calendar-contracts.md`, Current scope and accessibility limits and selected-feature sections. Its exact current hash matches coordinator-integration. The selected contract is:

| Feature | Decision |
| --- | --- |
| Arbitrary multiple dates | Selected: Calendar multiple civil selection |
| Comparison periods | Selected: none, adjacent equal-inclusive-length previous period, previous-year endpoint shift with leap-day clamp, custom |
| Gregorian week/month/quarter/year selection | Selected: PeriodPicker; explicit civil reference date, Monday default or explicit Sunday week start |
| Month/year navigation | Selected: changes calendar view/focus; distinct from whole-period selection |
| Fiscal/business/holiday periods | Host-resolved explicit preset endpoints; no organizational policy engine |
| Recurrence/resource/booking engine | Outside initial scope |

Current PeriodPicker and comparison implementation **and test** hashes exactly match both coordinator-fixes and coordinator-integration. Reuse `coordinator-fixes/units.txt` (5 suites / 31 cases), its exact input hash receipt, and the later composed integration receipt (5 suites / 24 cases). Existing tests explicitly prove quarter Apply, unavailable interior in full year, adjacent previous period atomic callback, previous-year leap clamp and whole-composition Cancel. The coordinator's browser receipts additionally prove later disabled/readOnly policy for period and comparison in Chromium/Firefox/WebKit. Those policy cases do not claim a native run of every unit assertion. Matching arbitrary-multiple tests reuse accepted earlier evidence; no rerun was necessary.

This closes the decision/selected-feature proof successor left by wave-02-11 and attaches the now-available BUG0008 evidence. It does not mean the whole calendar family or first release has passed final acceptance. K05 native/AT and K08 new endpoint cases remain separate. No scope expansion or release approval is inferred.

## Review and integration

`git apply --check` succeeded separately for `boundaries.patch`, `contracts.patch`, and `native-navigation.patch` against the current checkout. Nothing was applied. `validation-plan.json` gives exact targets, prerequisites, commands and assertions. Only the assigned evidence directory was written. No shared install/build/catalog generation/server startup, stage/commit/push, branch/version/tag change or publication occurred; the personal workspace file and user port 3000 were untouched.
