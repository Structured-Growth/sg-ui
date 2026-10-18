# Wave 04 / 11 — iPhone Simulator and VoiceOver

Prepared concrete maintained Apple XCTest additions and a runner patch. **All five
assigned original A leaves remain partial; no acceptance checkbox/count changed.**
Coordinator reports that the Swift methods have now been merged with the calendar
and progress owners' methods and all nine integrated XCTest methods are executing
in `packages/ui/artifacts/wave04-apple-01`. This is an in-progress coordination
observation, not a passing receipt. Do not overwrite that running harness/host.

## Ready implementation

`apple-voiceover.patch` and the two exact repository-relative mirrors in
`proposed-files/packages/ui/tests/apple/` contain:

- `SimulatorAcceptance.swift`: retains the accepted Select capability method and
  adds four independent scenarios for Dialog, Navigation, semantic Table and
  PageRichTextEditorSection. The separate calendar owner supplies the sixth
  category; the progress owner supplies additional spoken milestone coverage.
- Actual Apple `voiceOverService` current/forward/backward utterances, bounded
  traversal, explicit name+role/state requirements within the same utterance,
  retained text/tree/screenshot attachments even when expectations fail. No tree
  string is substituted for speech. Role/state matches remain assertions, not
  optional warnings. SDK method names were verified against the installed Apple
  `XCUIVoiceOverService.h`; its path/hash is in `input-evidence.json`.
- Dialog title/description, required input and Cancel/dismissal; navigation
  expanded/current-route/collapsed speech; table caption/role and content; editor
  editable name/role, Bold control, typed phrase and retained read-only content.
  XCTest taps/typeText with VoiceOver temporarily disabled set up these states.
  They are explicitly not VoiceOver activation gestures or manual usability proof.
- `run-simulator.mjs`: default remains the original Select capability check;
  `--only testMethod` selects one method, including separately merged methods.
  `--fixture-dir` admits a frozen already-built host. Existing dedicated-port,
  immutable-host, legacy/heavy lease, installed-runtime-only and original device
  boot-state cleanup are preserved. One selected test has a 300-second XCTest
  limit and 360-second process limit. Export actual xcresult attachments on both
  success/failure, retain before/after harness/host hashes and reject input drift.

`manual-review.md` and `manual-review.json` provide an executable six-category
operator follow-up with empty observed fields. They keep the full original manual
obligation, including grid header context, nested dismissal, selection retention,
calendar reasons, editor toolbar/dialog/undo behavior and spoken focus recovery.
No observation is fabricated. `validation-plan.json` gives five serial per-method
commands and remaining exact successors. Coordinator may use its already merged
all-nine runner; preserve that actual command, method list and total wall budget.
The patch is a proposal against its captured starting harness, not an instruction
to apply over the coordinator's newly merged nine-method file.

## Checks actually executed here

`authoring-validation.json`: Node syntax, `swiftc -frontend -parse` and
`git apply --check` each exit0. Swift parsing does not typecheck the SDK or execute
an XCTest assertion. No simulator/browser/build/install occurred in this assignment.
The coordinator owns the running native validation and its eventual evidence.

`input-evidence.json` records exact SHA-256 values for original requirements,
prior per-leaf reports, newer acceptance/hardening status, retained Apple speech
and results, selected fixture/source files, harness, and SDK header. The initial
read-only capture found 4/4 prior Apple harness files unchanged. The final capture
finds 2/4 unchanged after coordinator integration began; this is expected shared
harness evolution, not a new accepted source attestation. Only 11/298 current
private-host output files match the historical Apple receipt. Therefore reuse the
historical Select speech as a dated capability proof; do not label it a current
host runtime pass. Sequential selected hashes do not freeze every transitive input.

Newer canonical evidence supersedes older reports' pending editor V counts:
`react-aria-hardening-execution.md` records **300/300 V complete**;
`react-aria-final-acceptance.md` records **139 A open, zero editor V open**, with
six future leaves separate. Wave03 follow-up retains297 suites/1851 unit passes,
161 distinct native passes plus one unsupported Firefox touch skip, and11 docs
passes including94 routes/1138 source snapshots. Those remain their original
bounded receipts, not executions of this proposal or manual AT findings.

## Original leaf recommendations

| ID | Recommendation and retained evidence | Specific remaining successor |
| --- | --- | --- |
| A-X-07 | Partial. Wave03-10 target fix/spec is integrated: TagGroup's width and height use the minimum-target token; acceptance-touch-targets.spec.ts measures >=44 CSS-pixel targets, overlap/center hits and trusted emulated touch across auto/touch compact/comfortable scopes. Newer native follow-up retains its explicit Firefox skip. | W04-11-X07: retain attributable per-case geometry attachments; measure uncovered calendar/inline/resize controls with CSS-pixel spacing/exception rationale; coordinator Simulator target activation and named human touch-comfort findings stay separately identified. |
| A-X-08 | Partial. Both grid width step controls and their complete-snapshot/focus assertions now exist; source presence is no longer the earlier missing-grid-UI defect. Retain existing row/page Move alternatives and dated native results. | W04-11-X08: prove equivalent calendar movement/resizing with fields hidden, variable/bounded/fixed constraints and rejected host changes; reconcile editor drag/resize extensions. Keyboard alternatives or generic text fields alone do not establish equivalent single-pointer operation. |
| A-X-10 | Partial. Retain supported Chrome/Firefox/WebKit follow-up and historical iPhone18Pro/iOS27 actual speech capability; new representative iPhone XCTest scenarios are ready/integrated and executing under coordinator ownership. | W04-11-X10: attach new frozen build/device/browser versions, per-method results and actual speech; record representative touch/AT coverage and unsupported pairings explicitly. No physical-device inference from Simulator. |
| A-X-11 | Partial. Existing actual Select speech plus four new executable category scenarios materially advance automated speech coverage. Calendar owner fills sixth family; manual review remains required. | W04-11-X11-AUTO: finish integrated nine-method execution and resolve actual failures with preserved speech assertions. W04-11-X11-MANUAL: operator performs all six categories using real AT navigation/activation, records exact speech/focus/findings, and verifies fixes. Automated spoken output does not satisfy the word manual. |
| A-P-07 | Partial. Existing prototype findings/operator plan and newer package/browser/SSR-related receipts retained, supplemented with explicit actual-VoiceOver runtime assertions. | W04-11-P07: link attributable prototype keyboard, zoom, touch, dark, reduced-motion, React18/19 executed hydration and production bundle evidence; record new spoken results and manual findings. CSS enlargement is not actual browser zoom; a built hydration bundle is not execution. |

Full original criterion strings are preserved verbatim in `results.json` from
`assignment.json`, with references/hashes, status and bounded validation plan.

Only this assigned wave04/11 directory was written here. No shared implementation,
checklist, build, branch, commit, push, install, release/account setting, runtime
download or physical-device operation. No legal/human release approval inferred.
