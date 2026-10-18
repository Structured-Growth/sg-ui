# Wave 04 / 03 — Calendar and picker acceptance

A-K-04 and A-K-07 are coordinator-closed. Recommend **A-K-17 complete for its original definition obligation** and **A-K-05 partial for meaningful date announcements**. `criterion-closure.json` supersedes the earlier broader K17 spoken-review interpretation. These are coordinator-review recommendations; no central checklist, count, branch or index was changed. Baseline: `6c485ed79d0d6a521d188e5bde8315722296f518` on `dev`. All writes are inside this assigned directory.

## Evidence reconciliation and new deliverable

Read AGENTS.md, the current final-acceptance/hardening execution ledgers, Wave 03 / 27 and / 28 reports, integration reconciliation, follow-up validation and newer calendar receipts. The original Wave 03 runtime successors were integrated and subsequently executed: `retained-native-cases.json` extracts **24 passing historical executions** from the exact follow-up result file: twelve clipboard/preset executions and twelve navigation/reflow executions across Chromium, Firefox and WebKit. Of the first twelve, nine are trusted date/time/range clipboard cases and three are keyboard/DOM preset cases. None supplies spoken output. They were not rerun.

`input-reconciliation.json` records every selected current-versus-recorded source hash, including differences. Calendar/CalendarPeriodNavigation match the newer year-scroll receipt; range defaults and layouts have subsequent changes. The newer centered-month and default-nearest receipts retain their own scope, including 149 and 158 unit cases respectively; these overlapping suites must not be summed. The latter runs the DatePicker directory, including the unchanged four-case DateEntryClipboard suite. Retain the original 1,851-test checkpoint as its historical scope, not as a fresh full validation of this head.

The changed flexible field files require more than a blanket “hash matches” statement. `entry-core-reconciliation.json` compares exact state/validity/commit/reset fragments in TextDateField, TextTimeField and DateRangePicker against `bd169b54`: **all three are byte-identical**. Their whole-file hashes differ because message placement adds FieldMessages wrappers. Parsing utilities, existing native callback/form assertions and clipboard test content remain inspectable separately in the hashes. This is bounded semantic reuse of the accepted entry transaction, not a whole-tree/build certification. Changing range calendar click policy does not redefine typed range parsing.

HB-19 and HB-20 receipts are read and hashed in results.json. They close the named editor presentation V leaves and shared-menu defect. They do not establish calendar spoken announcements. The accepted Select simulator receipt demonstrates an available actual VoiceOver capture mechanism; its Select utterances are not relabeled calendar evidence.

**New substantive proposal:** `calendar-speech.patch`, with three exact replacement files mirrored under `proposed-files`:

- Append `SpeechSemantics` to the existing private Calendar fixture. It uses public Calendar/Provider ownership, fixed civil dates, static and callback reasons, and aria-hidden decoration content. No business fetch, application alias or inferred clock.
- Append three XCTest probes to the existing project-included SimulatorAcceptance.swift, preserving the original Select test. They capture actual `voiceOverService.currentSpeech/moveForward` utterances for full date names and non-hover static/callback disclosure, available/disabled preset descriptions, and the focused unfinished range preview. Screenshots and accessibility trees are diagnostic attachments; only returned speech satisfies the assertions. A distinctive decorative marker must remain absent from speech. Capture is bounded to 100 forward moves and retains attachments on failures.
- Add `--calendar-only` to the existing simulator driver, preserving its default behavior, lease acquisition, immutable-host hashes, explicit loopback port, results/cleanup handling and no-overwrite output rule. This filters to the three new tests without rerunning the accepted Select case for credit.

No runtime/API/CSS fix is proposed. The coordinator explicitly owns the unchanged Material `picker-radius.spec.ts` reproduction and any resulting fix; do not integrate a competing navigation stylesheet change. Merge the Swift proposal carefully if another acceptance owner also extends the common simulator source.

## A-K-04 — complete recommendation

Original obligation: **Support minimum/maximum, unavailable-date explanations, validation, required/optional input, and host-supplied availability without fetching business data.**

The shipped support contract is fulfilled: inclusive exact min/max acceptance and outside-window rejection; required-empty native invalidity; optional null/clear; static unavailable records and callback reasons; accepted values retained while invalid text blocks native submit; full range bounds/interior availability; datetime Apply revalidation and host policy authority. Availability is host-supplied and evaluated locally; Calendar's disclosure evaluates visible civil dates without fetching data.

BUG-0010/0011 receipts retain the corrected date-only text/segmented/datetime availability parity and reason associations/disclosure. The integration/follow-up receipts retain the three-engine evidence. The previously unrun `K04-window-submit-evidence` now has the integrated four-case clipboard/bounds unit suite in the later accepted DatePicker directory run and trusted date clipboard/native form checks in all three engines. Exact tests, source and receipt hashes are attached per ID in results.json and evidence-hashes.json. Existing callback/static tests are retained; no duplicate test is added.

This closes the named support obligation. Actual spoken explanation output remains A-K-17; full device/platform certification stays with its own obligations. Neither is silently claimed by this recommendation.

## A-K-05 — partial

Original obligation: **Support multi-month presentation, responsive container sizing, month/year navigation, keyboard navigation, focus return, and meaningful date announcements.**

Navigation/reflow's four configurations passed per desktop engine: year/month jumps without selecting, keyboard leap-day selection, 1100→360→1100 resize and focus/selection persistence. Newer receipts supply shared month/year controls, four-column year scrolling, independent multi-calendar navigation and popup chooser focus/size behavior. Their exact source differences and matching hashes are recorded; older DOM labels are not represented as spoken announcements.

Remaining: `K05-announcement-observation` needs actual calendar speech and keyboard chooser/selection/return-focus observation. The new simulator probe supplies an executable date-name/disclosure slice, not keyboard announcement timing or every locale. The existing Wave 03 / 28 operator protocol covers the remaining month/year, selected/disabled day, Escape/Apply sequence. `K05-material-fit-coordinator` is satisfied by the inspected radius-after-results.json: six expected passes across Chromium/Firefox/WebKit, zero unexpected/skipped/flaky results. Historical failure stays retained. No generic new inventory or redundant geometry suite is proposed.

## A-K-07 — complete recommendation

Original obligation: **Keep typed/segmented input and calendar selection synchronized; define invalid/partial typing, paste, blur, and form submission behavior.**

The shipped contract section “Text clipboard and submission transactions — K04/K07” defines flexible whole-value text grammar, paste as draft insertion, Enter commit without implicit submit, blur normalization, retained invalid/partial drafts, readable accepted FormData versus blocked native submission, controlled authority and prevented/accepted reset. Segmented/combined datetime intentionally use segment editing or popup selection; they do not promise the flexible textbox paste grammar. This is a defined supported boundary, not a removed test obligation.

Trusted clipboard/native cases now passed for date, time and range in Chromium/Firefox/WebKit, with actual paste trust/payload receipts, exact callback/form assertions and no synthetic-event substitute. Synthetic tests cover impossible dates, reversed ranges, incomplete drafts, min/max, required/optional and reset. Accepted earlier field/calendar synchronization and host-rejection tests remain intact. The unchanged entry-core fragments and later 158-case directory suite support reuse after the wrapper/default-navigation changes. `K07-paste-contract` and the integrated unit successor are satisfied; no current source defect or missing definition was found.

The recommendation is limited to the original definition/synchronization requirement and documented portable entry modes. It does not claim real-profile autofill, all locale engines, physical devices or unsupported whole-value segmented paste.

## A-K-17 — complete recommendation for the original definition

Original obligation: **Define keyboard and non-hover access to availability explanations, range previews, and preset descriptions; rich date-cell decorations must not replace meaningful date labels.**

The shipped contract satisfies each clause: keyboard-operable single-select presets carry descriptions; static/callback availability has date-associated reason IDs and a native disclosure; focused preview/context descriptions transfer and clean up without replacing full localized date names; rich decorations use aria-hidden. Existing corrected availability tests, keyboard preset/draft/Cancel native cases and focused endpoint-preview/cancellation assertions establish the bounded defined behavior. Exact names/source/receipt hashes are joined per clause in criterion-closure.json. Calendar.test.tsx's exact full-name lookup for a decorated static day excludes decoration content from that date name.

The earlier partial recommendation applied a broader spoken/operator requirement to a definition obligation. This revised recommendation agrees with lead05's original-wording review. Broader actual speech, operator timing, rotor/gesture and physical-device evaluation stays with A-X-11 and its respective platform obligations. Retain the unexecuted proposed speech probes for that separate work; no DOM/AX/axe or Select transcript is presented as calendar speech. No original K17 clause is waived, and no acceptance count was edited by this chat.

## Checks actually executed and handoff

Executed only lightweight checks from repository root:

```sh
python3 docs/developer/final-acceptance/wave-04/03/prepare.py
python3 docs/developer/final-acceptance/wave-04/03/capture-evidence.py
python3 docs/developer/final-acceptance/wave-04/03/write-results.py
git apply --check docs/developer/final-acceptance/wave-04/03/calendar-speech.patch
xcrun swiftc -frontend -parse docs/developer/final-acceptance/wave-04/03/proposed-files/packages/ui/tests/apple/SimulatorAcceptance.swift
/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node --check docs/developer/final-acceptance/wave-04/03/proposed-files/packages/ui/tests/apple/run-simulator.mjs
```

TypeScript 5.9.3 transpileModule also reports zero fixture syntax diagnostics on Node 24.21.0. Swift parse, JS parse and read-only patch applicability pass. These are syntax/applicability checks, not semantic typechecking, assertion execution or spoken proof. No install, build, browser, simulator, heavy suite, Git mutation, commit or push occurred.

`validation-plan.json` gives exact coordinator integration/build/typecheck commands and the calendar-only simulator command, with lease, output, failure and capture limits. Proposed runtime evidence remains **unexecuted**. All source/evidence and before/proposed replacement SHA-256 values are machine-readable. Preserve the six existing future leaves outside this scope and do not infer release/legal approval.

## Coordinator integration and additional action amendment

The coordinator reports the SpeechSemantics fixture and original three Swift methods are integrated into a nine-method run at `packages/ui/artifacts/wave04-apple-01`, with native fixture/type checks and 15 Checkbox/editor cases passed. That running job has no calendar speech outcome yet. Shared sources were not touched by this chat. The coordinator also reports all six radius cases and all six stronger month-fit cases pass; attach its exact receipts before closing that historical fit successor. The initial patch/applicability checks above describe the earlier snapshot: **do not reapply it over the coordinator's merged XCTest source**.

`range-preview-cancel.patch` is an additional concrete, proposed-only implementation against the integrated nine-method Swift snapshot. It adds `testCalendarCancelRemovesStalePreviewVoiceOverSpeech`: create a draft, require actual preview speech, Cancel using native XCTest setup, rewind with actual VoiceOver navigation to the fixture's introductory content, then traverse and assert obsolete preview/context speech is absent. It requires a calendar date, the fixture introduction and Cancel to occur in the actual transcript, preventing a toolbar-only absence from passing. The existing speech helper gains an optional rewind marker with its default preserving all prior callers. Each rewind/traversal is bounded to 100 moves; speech/screenshot/tree attachments remain retained on failure. Native taps are interaction setup, not evidence of VoiceOver activation gestures.

`preview-cancel-inputs.json` records exact before/proposed hashes and the coordinator's current `--only` single-method command. `handoff-amendment.json` retains the patch digest. Swift parse and read-only patch applicability passed; runtime remains unexecuted. Apply only after the current job settles and review any coordinator edits first. The current driver uses `--only`; the initial `--calendar-only` proposal is superseded by the coordinator's merged driver and must not overwrite it. This additional probe provides action on the stale-preview successor while keeping keyboard/timing and physical-device criteria intact.

## Fixture marker overflow correction — proposed only

The coordinator's actual simulator screenshot exposed long `DECORATION_SENTINEL` text overflowing every date cell. `marker-clip.patch` corrects only `SpeechSemantics.renderDayContent` in `apps/docs/native-fixtures/scenarios/experimental/Calendar/Calendar.fixture.tsx`. Its inline block is bounded to the decorative slot width and clips horizontal overflow without wrapping. Full sentinel text remains in the DOM; no additional aria-hidden, replacement label, opacity, display:none or speech assertion change conceals a broken library boundary. Library date targets, date labels and availability semantics are untouched.

The exact replacement is mirrored under `proposed-files` and its before/proposed hashes are in `marker-clip-inputs.json`. This fixture mirror now supersedes the initial unclipped proposal; the original `proposal-inputs.json` remains historical. Read-only patch applicability and TypeScript syntax checks pass. The shared fixture and frozen native build remain untouched during the running Xcode job. After it settles, the coordinator can apply this one-file patch, rebuild only private fixtures, inspect one full-calendar capture and rerun only the date/reason speech probe as needed. Preserve the original overflowing screenshot and transcript separately; do not reinterpret that run as validated geometry.

## Independent period navigation with a live typed draft — new concrete case

The coordinator has closed A-K-04/A-K-07 and integrated marker clipping. The next requested edge is prepared as `period-draft-isolation.patch`, touching only the existing DateRangeSelector private fixture module and a new `packages/ui/tests/browser/calendar-period-draft-isolation.spec.ts`. No shared changes were applied while the coordinator freezes/builds.

The existing shared-calendar/year-scroll cases already cover independent view isolation, endpoint-aware availability, unchanged committed selection, chooser focus, size and narrow reflow. The new `IndependentPeriodDraft` export reuses that two-calendar independent From/To configuration, including “No arrivals in 2027” start restrictions. It adds explicit flexible fields and a host-controlled active endpoint. Stable useCallback handlers record private draft/endpoint/commit ledgers without effect-driven callback loops; the component remains responsible for its draft and native inputs. All original fixture exports remain intact.

Exactly one compact/light/en-US native case fills the missing combination: edit the start to create a valid **uncommitted** draft, leave partial end text, explicitly select the Start endpoint, then change only the End calendar's month and year through the public period controls. It asserts both input values and original end input identity, unchanged draft, unchanged callback ledgers, unchanged accepted FormData, unchanged active endpoint, unchanged first view, target view/month/year changes and heading focus return. Apply stays blocked by partial text. Correcting that existing end field and applying must emit the preserved edited range once. Page errors and console warnings/errors remain failures.

`period-draft-inputs.json` has exact before/proposed hashes; `period-draft-reuse.json` hashes accepted tests/configuration source; `period-draft-validation-plan.json` gives coordinator integration, private-fixture build, browser typecheck and the single spec command. Scope is one case in each of the three existing desktop projects, with zero retries; no repeated density/theme matrix or new unit duplication. TypeScript syntax diagnostics are zero for both proposed files and read-only patch applicability passes. Semantic types/native assertions remain unexecuted and require coordinator validation. No interaction implementation or production calendar semantics were changed merely to make the test pass.

## Larger batch handoff

The registry now assigns A-K-05/A-K-17 to Controls calendars and navigation, lead conversation 5; root integrates and relays. Preserve all 19 coordinator closures and the 120 remaining count. `batch-readiness.json` hashes the registry and records that both period-draft proposal targets still match their exact pre-integration baseline (new spec absent, existing fixture unchanged). The one-case patch is ready to join the larger end-to-end batch; no overlapping lead work was started.

Audible Apple work is paused. The original running-job statement above is historical: the coordinator interrupted that job, with receipt retained at `wave-04/coordinator/apple-interrupted-receipt.json`. No calendar spoken outcome is inferred. Keep the proposed preview-Cancel method for a later admitted speech window; the browser draft-isolation case is the immediate concrete handoff. Source/fixture outputs remain frozen for the pack/lock window, and this chat made no shared edits or heavy execution.

## Resumed criterion review and finished integration handoff

`criterion-closure.json` now gives one decision per original clause: K05 has five complete support clauses and one partial meaningful-announcement clause; K17's four definition clauses recommend complete. K04/K07 remain coordinator-closed. The exact original wording governs these recommendations, without importing broader physical/manual/AT gates. The coordinator's accepted-closure receipt now reports 26 closures and 113 remaining; this chat has not changed those totals. The lead05 batch includes the period-draft patch in its next admitted window.

The period-draft fixture/spec now pass **semantic** TypeScript validation against the current built public declarations: Node24.21.0/TypeScript5.9.3, zero diagnostics in `period-draft-types.txt`. The read-only overlay compiler changes no shared source and emits no build. `playwright.period-draft.config.mjs` uses the existing frozen origin and lead05 output conventions, selects only the new spec, runs three desktop projects with one worker/zero retries and owns **no server**. Its syntax/config checks pass. This corrects the initial default Playwright command's unwanted server launcher; use the updated period-draft-validation-plan.json. Native execution still waits on root integration/admission, not another implementation inventory.

The next actionable evidence reconciliation inspected the interrupted Apple attachments. `interrupted-apple-attachment-review.json` records the manifest hash and exported attachment names: two query-chain debug descriptions, synthesized-event data and screen recording. There is no actual calendar VoiceOver utterance attachment. No library calendar defect is proven by this interrupted locator/setup run, and no production fix is invented. K05 meaningful announcements remain partial; audible Apple stays paused. The exact typed-draft edge is the immediate executable code handoff, and the existing unexecuted speech successor remains available for a later authorized observation mechanism.
