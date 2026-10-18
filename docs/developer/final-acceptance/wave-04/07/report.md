# Wave 04 / 07 — cards, progress and layout

Recommendation: **one complete (A-U-02), five partial**. These are review
recommendations, not shared checklist edits. HEAD is
`6c485ed79d0d6a521d188e5bde8315722296f518` on the assigned dev snapshot.
Only this evidence directory was written. No build, install, browser/package
suite, simulator run, Git index/branch action, commit or push occurred.

## New reviewable work

Two exact replacements under `proposed-files/packages/ui/tests/apple/` prepare a
bounded real-speech successor for AppOperationSteps:

- `SimulatorAcceptance.swift` preserves the existing Select case and adds
  `testOperationStepsVoiceOverMilestones`. It enables Apple's actual VoiceOver
  service and samples `currentSpeech()` after Start, percentage updates,
  completion, failure and retry. It requires the full completion/failure/retry
  messages, and attaches timestamped observed samples and a screenshot even on
  failure. It never moves the VoiceOver cursor to the Status to satisfy an
  announcement assertion by explicitly reading its text.
- `run-simulator.mjs` adds a validated `--only-test` selection and records the
  selected case. The successor can run without repeating the accepted Select
  smoke; existing lease, fixture/source hashing, xcresult and cleanup remain.

Swift parsing and JavaScript syntax checks pass (`artifact-checks.json`). No
XCTest compilation or Safari/VoiceOver run is claimed. A 100ms current-speech
sampler cannot prove silence between observations or distinguish repeated
snapshots from repeated announcements. `speech-review.md` preserves the actual
operator silence/count/focus work; no DOM/axe result substitutes for speech.
`validation-plan.json` supplies concrete serial execution commands and limits.
`owner-decisions.json` supplies unfilled, specific card-scope decision records.

## Reconciliation of later evidence

Read AGENTS.md, current final acceptance/hardening execution, wave-03-09/18/22
reports and their successors, integration reconciliation/application records,
wave-03-followup validation results, and HB-19/HB-20 receipts. The former 20 editor
presentation leaves are closed by the later receipts and are not blockers here.

`evidence.json` captures 169 existing file paths with SHA-256 hashes. Seventy-two
paths have an integrated/follow-up snapshot comparison; **all 72 match**. It also
retains the older wave-03-22 comparisons, including separately dated output
hashes. Uncompared paths are explicit nulls, not matches. This is a narrow reuse
check, not an assertion that every current source and generated output is equal.

The later follow-up unit receipt records 297 files / 1,851 passing tests; the
instructor literal-label regression source now matches its integrated snapshot.
The prior unapplied/unvalidated patch status is superseded. The durable native
log contains the card query and layout composition pass in **each of Chromium,
Firefox and WebKit** (exact lines 18/74/130 and 38/94/150 respectively, copied into
evidence.json). These scopes need no repeat merely to resolve stale reports.
The aggregate receipt's unrelated corrected color case and unsupported Firefox
touch skip retain their original limits; this report does not relabel that whole
first run as all-green or physical touch/AT evidence.

## Per-leaf decisions

### A-M-03 — partial

Original: Reconcile AppOperationSteps final acceptance: State announcements,
completed/error/active visuals, hide single-step numbering. Link its `F-C03`,
`T-C03` and `V-C03` evidence and any unresolved defects.

Retain F-C03/T-C03/V-C03 lineage in wave-02-01/report.md and wave-03-22/report.md:
ordered noninteractive status text, distinct completed/error/active presentation,
quiet percentage semantics, persistent host Status and single-step no-numbering;
HB-07 and batch67 supply the existing native/presentation scope. No extra library
live region is proposed. The host owns milestone announcements.

Successors: run the new `W04-07-C03-SIMULATOR` candidate; finish `W02-01-C03-AT`
operator observations via speech-review.md. A passing sampler would establish
observed messages only; duplicate counts, quietness and keyboard experience stay
explicit. No actual step-speech observation exists in this handoff.

### A-M-14 — partial

Original: Reconcile InstructorClassCard final acceptance: Status/menu/actions,
callbacks, long text, date and icon fallbacks. Link its `F-C14`, `T-C14` and
`V-C14` evidence and any unresolved defects.

Retain F-C14/T-C14/V-C14 in wave-02-01/report.md, batch66 native status/focus/
router/date-fallback results and HB-12 localized geometry. The double-formatting
fix and two literal-label regressions are now integrated, input-matched and
covered by the later green unit checkpoint. Do not reapply wave-03-22's patch.
No newly reproduced source defect is claimed.

`W02-01-C14-intent` remains: the shipped card offers one host-routed Link, required
host-formatted activity text and fixed decorative assets. Original menu/callback/
date/icon wording requires explicit owner attribution or a separately specified
extension. `owner-decisions.json` leaves the owner/decision/date empty. Automated
passing evidence does not imply that approval.

### A-M-15 — partial

Original: Reconcile LearnerClassCard final acceptance: Progress/due
labels/status/actions, translation, accessible interactive regions. Link its
`F-C15`, `T-C15` and `V-C15` evidence and any unresolved defects.

Retain F-C15/T-C15/V-C15 in wave-02-01/report.md, corrected all-engine native
ICU/destination parity and HB-12. Named normalized progress, due locale/clock,
invalid-date fallback, translated text and independent Details/Continue regions
are shipped. No lifecycle-status prop exists. `W02-01-C15-status` still requires
explicit owner attribution of status to progress/due presentation or an approved
new contract. No accepted routing/due suite should be repeated for that decision.

### A-U-02 — complete recommendation

Original: Reconcile original `U-02`: Implement Box/container, Stack,
surface/Paper, card/content, separator/Divider, and responsive layout primitives
with scoped styles. Historical status: open.

Box supplies bounded container/native element/padding; Stack supplies responsive
direction, gap and wrapping; Surface supplies owned flat/outlined/raised styles;
Card and CardContent reuse Surface/Box; Divider supplies semantic/decorative
presentation. Their current implementation/tests match the integrated snapshot.
They use scoped CSS Modules and owned tokens. The later native layout case now
establishes actual responsive bounds, wrapping, nested light/dark surfaces,
separator semantics, native Tab order and enlarged-text/forced-color reflow in
all three engines. This supersedes wave-03-18's missing-native-execution hold.

Close the original implementation obligation. Its wording does not require a new
Paper alias, browser-controls zoom, screen-reader speech or an external visual
baseline approval; do not import those separate broader gates into this leaf.
No successor within U-02; broader zoom/review/AT gates remain separately open.

### A-C-08 — partial

Original: Reconcile original `C-08`: Use container size queries for reusable
card, toolbar, navigation, and modal compositions; choose/document containment
boundaries so consumers know what supplies the container. Historical status: open.

All four boundaries are shipped/documented: ClassCardFrame `sgui-class-card`,
DataToolbar `sgui-data-toolbar`, AppShell `sgui-app-shell`, and AppModal
`sgui-app-modal`. Host allocation/intrinsic sizing and portaled-dialog ownership
are explicit in their maintained contracts. Later three-engine card query passes
supersede the prototype-only/pending-integration hold. Generic Card intentionally
remains a surface primitive; the reusable composed frame supplies containment.

`W04-07-C08-BOUNDARIES`: execute the existing toolbar, navigation-shell and modal
container specs in the coordinator's immutable-host window. No corresponding
execution is present in the examined later scoped receipt. Keep every geometry,
focus, state, scroll and enlarged-label assertion; prepared specs alone do not
supply results. Do not repeat the accepted card case for unchanged inputs.

### A-C-12 — partial

Original: Reconcile original `C-12`: Use fluid sizing such as `clamp` where
beneficial without preventing text zoom; establish mobile/reflow fallbacks.
Historical status: open.

The integrated card guide documents the benefit assessment: preserve rem text,
fluid collection min/max allocation, capped overlay width, rem query thresholds
and short-dialog fallback; no benefit was shown for adding a viewport-only font
clamp. The obligation does not demand the literal `clamp()` syntax. Later native
card/layout passes establish integrated root-text/reflow evidence beyond the old
CSS prototype. Retain the prior four bounded Chromium long-title/spacing/font
configurations without calling them browser zoom.

`W03-09-ZOOM` remains: actual browser-controls 200%/400%, remaining font/fallback
and focused-action reflow review. validation-plan.json preserves the exact
measurements and browser UI evidence required. CSS root enlargement, pinch or
page scaling cannot close this successor.

## Integration boundary

Coordinator reviews the proposed replacements against evidence.json base hashes,
serially applies compatible changes, admits the bounded checks and records any
closure. No shared acceptance count/checklist was changed. No production approval,
release, physical device or broader whole-library conformance is implied.

## Action follow-up — executable container acceptance

The user requested completion of code and executable tests. A new five-file
`container-evidence.patch` is prepared, with exact replacements in proposed-files:

1. `apps/docs/native-fixtures/scenarios/components/DataToolbar/DataToolbar.fixture.tsx`
   now doubles the actual compact/comfortable control text source tokens in its
   enlarged fixture. The old label/body overrides did not affect current Button
   and TextField control typography. It retains those original overrides too.
2. `packages/ui/tests/browser/toolbar-container-boundary.spec.ts` keeps every
   original width/geometry/keyboard/menu/draft/focus assertion and adds exact
   computed control-font checks, so the stress case cannot pass at normal text
   size. It also validates the full focus indicator against clipping ancestors.
3. `packages/ui/tests/browser/navigation-shell-container-boundary.spec.ts` retains
   the complete six existing cases and adds full focus-ring clipping checks at
   the existing resize and keyboard-scroll stops.
4. `packages/ui/tests/browser/modal-container-boundary.spec.ts` retains the five
   existing cases, strengthens each focus stop to include the full outline and
   clipping ancestors, and captures open surfaces before dismissal.
5. `packages/ui/tests/browser/container-boundary-observations.ts` supplies
   read-only JSON geometry and full-page PNG attachments, including on an
   assertion failure. It never changes focus, scroll offsets or styles. Its ring
   assertion preserves the existing focus, center-hit and layout assertions.

All 13 existing cases remain. No case, assertion or capability branch is removed.
Strict in-memory TypeScript checking at the original five paths against the
built public declarations passes with **zero diagnostics on Node24.19.0**; patch
dry-run passes. These are type/application checks only. The coordinator must
apply serially, refresh fixture bytes after the running Apple suite settles and
execute the three-engine command in validation-plan.json. Every native failure
remains actionable; no production clipping fix is invented before reproduction.
Input/replacement SHA-256 hashes are in container-proposal-inputs.json.

Coordinator reports the earlier Apple proposals have been merged into nine
XCTest methods and are executing in its hashed simulator run. This worker did
not edit shared Apple sources or generated native output during that run.

## Action follow-up — actual desktop browser zoom

The coordinator requested the next actual200% zoom slice while audible Apple
probes stay paused. `browser-zoom/run.mjs`, `checks.mjs` and a private ManifestV3
extension now prepare eight serial configurations across layout/cards, toolbar,
navigation and modal at both densities. The unique new public-package fixture
is delivered in `browser-zoom-fixture.patch` with its exact proposed-file mirror.
No shared runner, fixture, registry, build or Apple file was changed by this worker.

The runner uses the **already installed Playwright Chrome for Testing binary**,
verified by read-only path existence. It creates its persistent profile only under
a new owned evidence run and never accepts/reuses a user profile or attaches to
an existing browser. It acquires its own serial leases, serves immutable fixture
bytes, and refuses port3000. No browser was launched or downloaded here.

The extension explicitly claims exact loopback fixture URLs and uses automatic
per-tab `setZoom`, `getZoom` and `onZoomChange`. A sibling control tab remains at
its original zoom. Runtime assertions require constant outer dimensions, CSS
viewport contraction/DPR increase matching the requested factor, unchanged root
font size/visualViewport scale/CSS zoom/transforms, and restoration of only owned
tabs. The navigation case requires actual wide-to-stacked reflow after zoom.
Toolbar search widths are checked against actual allocated container size.
Keyboard flow, full focus-ring/clipping bounds, independent state/scrolling and
modal field/footer reachability remain actual Playwright operations. Captures
and receipts include failures, exact source/served/helper hashes and build-receipt
identity. Official primary documentation and exact bounded execution steps are
in browser-zoom/README.md and browser-zoom/validation-plan.json.

Strict noEmit fixture typechecking passes with zero diagnostics on Node24.19.0.
Its initial missing-required-user-model failure is retained separately; the
corrected fixture supplies that public contract. Three mocked worker isolation
tests pass, covering owned-tab restoration, unowned/replaced/ambiguous tab
rejection and unsupported factor rejection. JavaScript syntax and new-fixture
patch dry-run pass. These are preparation checks; none is actual browser zoom
evidence. Coordinator must integrate/build/execute/review the saved screenshots.
A successful eight-case200% slice would still leave400%, remaining font/locale/
spacing configurations and broad/manual/device/AT acceptance separate.

## End-to-end batch readiness follow-up

Added `browser-zoom/preflight.mjs` (offline prerequisite checks) and
`browser-zoom/verify-receipt.mjs` (eight-case runtime and capture integrity checks).
The runner now records original API zoom/settings and sibling baseline, rejects
source/helper/extension changes during a run, and preserves original fixture
immutability checks. The verifier refuses emulated/missing browser zoom evidence,
repeated configurations, hollow captures, sibling contamination or failed
restoration/cleanup. Eight synthetic verifier tests pass; candidate-only offline
preflight passes. Full preflight and runtime wait for serial integration/build
after the pack/lock freeze. No shared source/output, Apple/audio test, lead-owned
implementation, closed item or central count was changed.

## Unified zoom ownership —07 canonical driver

Reconciled05's standalone controls zoom plan and06's additive overlay plan. One
07 driver/extension/profile owner now handles all19 scenarios: four layout
compositions plus15 overlays/controls. The copied06 checks preserve its scope,
placement, anchor, draft, selection/commit, native focus and actual window-resize
assertions;05's distinct native Menu and long-description Tooltip inputs are
retained too. Historical runners/patches remain dated preparation and must not be
started as competing implementations. `browser-zoom/consolidation.json` hashes
the reviewed05/06 sources. `suite-manifest.mjs` is one pure catalog for driver,
preflight and verifier.

The next packet is38 configurations at200%, scheduled via lead10 after09's heavy
window. The same driver supports38 at400% or the explicitly selected76 combined
batch; no planned configuration counts as a pass. Every capture/case identity
includes its factor, fixture and requested placement, so factors/cases cannot
overwrite or substitute for each other. Actual open-overlay window changes and
restoration are recorded. The verifier now validates any selected catalog subset
and refuses incomplete factors, substituted fixtures/placements, missing native
window resize evidence or failed cleanup.

Fifteen pure tests pass on Node24.19.0 (12 synthetic verifier cases plus3 mocked
worker-isolation cases). Unified overlay/layout semantic typechecking and
candidate-only offline preflight pass. Original failed type logs are retained.
The unique new fixture patch remains integration-ready with exact proposed/current
hashes in fixture-integration-readiness.json. Root relays lead10-next-window.json;
this worker does not start a browser, alter shared production/fixture outputs,
resume Apple/audio work, duplicate lead implementation or change closed counts.
