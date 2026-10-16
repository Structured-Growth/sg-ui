# Wave 03 / 27 — calendar entry contracts

Three assigned leaves remain **partial**. This handoff supplies a ready-to-apply five-file patch, four focused unit cases, four native browser cases, explicit consumer clipboard/submission guidance and an operator AT worksheet. No shared implementation, test, documentation, generated output, checklist or count was changed. The starting 153 A / 20 V / six future count is context, not a recomputed outcome.

## Substantive deliverables

`clipboard-contracts.patch` contains exactly these proposed targets, also mirrored under `proposed-files/`:

- `packages/ui/src/experimental/DatePicker/DateEntryClipboard.test.tsx`: three parameterized synthetic paste transaction cases (date, time and range), plus one DatePicker inclusive bounds/required/optional case. Tests assert no acceptance on insertion, normalized acceptance on Enter, no implicit submit on Enter, invalid/partial retained text, unchanged accepted FormData, blocked native validity and prevented versus accepted silent reset. Date tests add impossible dates and exact min/max/outside-window candidates; range paste covers reversed endpoints.
- `apps/docs/native-fixtures/scenarios/experimental/DatePicker/DatePicker.native-transactions.fixture.tsx`: append three separate state-owning clipboard scenarios to the existing registered module, preserving every original native transaction scenario. The fixture imports only public components and contains no synthetic paste handler. Clipboard source, callback and submit diagnostics belong only to the private test host.
- `packages/ui/tests/browser/date-entry-clipboard.spec.ts`: three trusted clipboard cases require actual copy/paste gestures, `isTrusted=true`, exact text/plain payloads, blur/Enter/form authority and native reset. Each attaches actual engine/browser version, clipboard events, accepted fields, callback ledger and errors. A fourth case checks available/disabled preset descriptions during keyboard draft selection and Cancel using the existing availability fixture. No new runtime implementation is invented to force a browser outcome.
- `docs/developer/react-aria-calendar-contracts.md`: explicit text/segmented paste decision table, parsing boundaries, Enter versus native submit, validity versus readable FormData, required/optional and reset ownership. States the existing segmented min/max behavior honestly: a complete out-of-bounds civil request may be emitted while native validity blocks submission. Availability rejection retains the stronger corrected contract. Whole-value paste grammar is promised only for flexible text, not segmented/combined datetime.
- `apps/docs/content/component-usage/forms.json`: component-specific paste/validation/host responsibilities for DateField, DatePicker, DateRangePicker, DateRangeSelector and TimeField; removes an existing contradictory DateField sentence saying two-digit years were rejected while the following instruction described their supported century window. No catalog IDs or public APIs changed.

`acceptance.test.tsx` and `vitest.config.mjs` allow the same new unit cases to run directly from this evidence directory before integration. They are **unexecuted**, not passing evidence. The colocated proposed test differs only in import paths. `AT-observation-worksheet.md` gives concrete existing fixture routes, keyboard actions, expected semantic content and blank actual-output fields. `validation-plan.json` gives exact integration, unit, metadata, fixture, spec typecheck, native and operator steps.

## Actual checks and reuse

Read AGENTS.md, final acceptance policy, assignment/prior report/results, prior input receipt, coordinator integration and BUG0010/11 fix reports/results. Base HEAD is `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, modified `dev`. All writes are inside this exclusive directory. No install, shared build, browser server, broad suite, Git mutation or other-chat message occurred. User server 3000 and personal workspace state were not accessed or changed.

`input-receipt.json` hashes 184 selected input/output files. **119 compared integrated input/output hashes match**, with zero differences; all **seven fix-08 input hashes match**; **82 wave-02 hashes match**. These sets overlap and must not be added as independent cases. Eleven wave-02 differences are listed exactly: AGENTS.md, current docs/examples/contracts and the corrected Calendar/DateField/DatePicker source/test inputs. They are not silently treated as old unchanged evidence. The integrated map supplies the subsequent Calendar type correction; fix-08 explicitly supplies the seven DatePicker/private field-policy hashes absent from that integrated input map. Other observed files without matching receipt hashes are recorded but receive no inferred execution proof. The comparison is bounded, not a fresh whole-tree/transitive/build certification.

Retain fix-08's Node 24.21.0 / Vitest 4.1.11 **37 cases in three suites**, fix-09's scoped callback-reason DOM evidence, and the coordinator's corrected three-engine availability evidence. The latter retains 18 unchanged executions plus three enriched datetime replacements within its 21-execution scope; do not add the original datetime passes again. These tests were not rerun. Original negative GAP K04/K17 probes remain historical defect characterizations and were not inverted or relabeled.

Actually executed from repository root:

```sh
python3 docs/developer/final-acceptance/wave-03-27/capture-receipt.py
/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node docs/developer/final-acceptance/wave-03-27/check-syntax.mjs
git apply --check docs/developer/final-acceptance/wave-03-27/clipboard-contracts.patch
```

Results: hash capture succeeds; four TS/TSX files have zero `transpileModule` syntax diagnostics (Node 24.21.0, TypeScript 5.9.3); read-only patch applicability succeeds. Proposed usage JSON parses. Syntax diagnostics do **not** establish semantic types, assertions, native clipboard or AT behavior.

After inspecting `/tmp/sgui-calendar-validate.mjs` and the canonical lease implementation, attempted this exact command twice, separated by artifact work:

```sh
PATH=/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin:$PATH node /tmp/sgui-calendar-validate.mjs pnpm --filter @structured-growth/sg-ui exec vitest run --config ../../docs/developer/final-acceptance/wave-03-27/vitest.config.mjs
```

Both stopped **before Vitest started**, `EEXIST` on `/tmp/sgui-parallel-batch-01-validation.lock`; logs are `units-first.txt` and `units-second.txt`. The observed owner was `calendar-options:22145`. No lease was bypassed, reclaimed or repeatedly polled. This is an occupied validation prerequisite, not a test assertion failure or a passing suite. New test runtime results remain pending.

## A-K-04 — partial

Original requirement: “Reconcile original `K-04`: Support minimum/maximum, unavailable-date explanations, validation, required/optional input, and host-supplied availability without fetching business data. Historical status: open.”

Accepted BUG0010 parity correction and BUG0011 explanations are retained for their exact matched inputs. Existing range constraints validate inclusive endpoints/interior dates, host callback context, static records and required Apply. DatePicker text and datetime use candidate bounds; segmented fields preserve their existing complete-value/native-validity distinction. No component fetches availability data. New patch adds exact lower/upper boundary, outside-window, required-empty and optional-null assertions plus consumer guidance. Patch-only tests are not new runtime acceptance.

Evidence/commands/hashes/runtime: prior fix-08/report/results, fix-09/report/results and coordinator integration receipts; exact inputs and output hashes in `input-receipt.json`; new commands and limitations above. Proposed artifacts still need integration.

Residual successor **K04-window-submit-evidence**: integrate and execute the one new bounds/required/optional unit case and the date trusted-paste native case with its min/max rejection checks; validate usage metadata after integration. Reuse accepted static/dynamic/segmented/datetime availability runs unchanged. No broader device or AT claim follows.

## A-K-07 — partial

Original requirement: “Reconcile original `K-07`: Keep typed/segmented input and calendar selection synchronized; define invalid/partial typing, paste, blur, and form submission behavior. Historical status: open.”

K07-entry-policy is satisfied by the retained BUG0010 correction within its unit/native scope. The patch defines supported flexible text grammar and separates it from the unsupported portable whole-value segmented/datetime paste contract. It makes commit versus native submit and FormData authority explicit, adds invalid/partial/reversed paste and reset assertions, and supplies actual-trust native clipboard tests rather than another observation-only generic inventory. Existing keyboard/calendar, controlled rejecting-host and reset assertions are preserved, not duplicated.

Evidence/commands/hashes/runtime: matching fix-08 and coordinator integration receipts; four new unit cases are runnable but lease-blocked; three new paste cases are unexecuted native plans. Syntax and applicability only passed. Proposed documentation/tests/fixtures still need integration.

Residual successor **K07-paste-contract**: integrate the patch, execute the synthetic suite and trusted date/time/range paste cases once per supported engine against the frozen fixture build; preserve failures and clipboard prerequisites. Existing segmented paste observation remains observation-only and cannot establish the textbox grammar for segmented/datetime controls. No synthetic event substitutes for trusted clipboard. Controlled-host and calendar synchronization evidence may be reused only while corresponding hashes remain unchanged.

## A-K-17 — partial

Original requirement: “Reconcile original `K-17`: Define keyboard and non-hover access to availability explanations, range previews, and preset descriptions; rich date-cell decorations must not replace meaningful date labels. Historical status: open.”

K17-callback-reason-access is already corrected and receives retained matched unit/native evidence. Current Calendar preserves complete localized date names and hides decorative content from the accessible name; callback/static reasons share an associated description and visible-interval disclosure. Current DateRangeSelector has focused preview/context association, stale-reference removal and described single-select preset options. Existing preview and reason tests were inspected, not rerun unchanged. A new proposed native case fills keyboard preset-description/draft/Cancel evidence without repeating the corrected disclosure suite.

Evidence/commands/hashes/runtime: fix-09 positive reason tests and coordinator three-engine receipt, unchanged mapped DateRangeSelector preset/preview assertions, bounded input hashes, proposed native preset case, operator worksheet. No actual AT session or physical device was supplied. DOM accessible descriptions are not spoken output.

Residual successor **K17-native-and-AT**: execute the new keyboard preset case, retain/reconcile the existing focused endpoint preview native case on the frozen host if its inputs changed, and complete the operator worksheet with named OS/browser/AT versions and actual output for preset descriptions, range previews, complete date names and non-hover availability disclosure. Physical touch claims require an actual device observation. Proposed files require integration before they count as shipped guidance/tests.

No central checklist, count, full production acceptance or release approval is asserted.
