# Batch 16 runtime contribution review

Read-only source review on 2026-10-07, based on verified `codex/dev` commit
`de3e8ec22e5c3cbba7376df758d0438e429cc8ba`. The attached isolated worktree is
`/Users/thomashall/.codex/worktrees/runtime-review-b16/sg-ui`; this report is its
only working-tree write. No sources, central guidance, dependencies or workflows
were changed. Coordinator alone integrates; no merge or gate closure is authorized.

Ownership was read from the coordinator's durable
`/Users/thomashall/.codex/visualizations/2026/10/07/01a1164f-41db-7f30-aaf9-f20133b6566f/parallel-migration-state.json`.
GitHub read-only PR metadata confirmed all four exact requested heads below,
draft status and base `codex/dev`. Each baseline-to-head diff stays entirely within
its original exclusive allowlist. Diff whitespace checks pass. Git merge-tree
previews found no textual conflicts against the pinned reviewed dev commit;
these previews do not establish composed runtime correctness or future mergeability.

## Decisions per exact head

| PR / exact head | Decision | Ownership and evidence |
| --- | --- | --- |
| [#42](https://github.com/Structured-Growth/sg-ui/pull/42) `9e430312b0fc8f662dcf51800be1a8982b081cec` | **HOLD** standalone reset acceptance; complete-value/TextField improvements are credible partial evidence | TextField/ and DateField/ only, unique batch11 browser spec and report; 9 changed files. Baseline `d0fcc6298004ad23d1a75480b216b39142e6df96`. |
| [#67](https://github.com/Structured-Growth/sg-ui/pull/67) `c90e4def00c3d4d1c2a5d17771a1313311636fde` | **ACCEPT bounded parse-feedback fix**; existing TimeField reset acceptance remains **HOLD** | TimeField/ only, unique batch13 browser spec and report; 5 changed files. Baseline `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`. |
| [#63](https://github.com/Structured-Growth/sg-ui/pull/63) `21faadf6201cbae51173898d778a4f318d77b3f2` | **ACCEPT bounded host-blocking fix** | SplitAction/ only, unique batch13 browser spec and report; 5 changed files. Same batch13 baseline. Task evidence belongs to U-01/X-04, rather than dispatched U-03 (Typography). |
| [#72](https://github.com/Structured-Growth/sg-ui/pull/72) `b22cf93bd4906f7bf76658002747bd2b439b613b` | **ACCEPT bounded deferred chooser callback fix** | RichTextFormattingToolbar/ only, unique batch13 browser spec and report; 5 changed files. Same batch13 baseline. E-03/E-04 remain partial. |

“Accept” recommends coordinator integration of the bounded implementation, not
whole-task acceptance. No recommendation releases existing reset holds.

## Standalone reset: demonstrated defect and additional lifecycle gap

The [worker report](https://github.com/Structured-Growth/sg-ui/blob/9e430312b0fc8f662dcf51800be1a8982b081cec/docs/developer/parallel-batch-11/standalone-form-reset.md) accurately states
that incomplete DateField drafts still disappear when a delegated host prevents
reset. The new owned complete-date state and capture-phase callback suppression
cannot restore React Aria's private incomplete segment display. The retained passing
tests cover complete-date prevention and accepted clearing of incomplete drafts;
they do not cover prevented incomplete drafts. Six native passes cannot close
U-18/K-06. The report's failing probe was temporary, so its claimed reproduction
is worker evidence, not a retained regression independently executed here.

Source inspection also finds `useStandaloneFormReset` binds the form listener only
in an effect depending on the stable ref object. TextField exposes a live `form`
prop, but changing association from form A to B leaves the listener on A. The
external-form test changes defaultValue while retaining the same form ID; it does
not exercise reassociation. B therefore lacks owned suppression/reset handling.
This is a source-demonstrated lifecycle gap; no new runtime probe was run.

Recommended bounded follow-up: reserve DateField segment-state/reset ownership
and retained failing/passing native tests for prevented partial drafts, controlled
null, accepted clearing, focus and validation. Separately fix TextField listener
reassociation with A-to-B reset/callback tests and cleanup assertions. Avoid DOM
draft reconstruction or upstream mutation. Shared composite reset modules remain
outside this PR's ownership.

Fresh tested source/spec head is `462be545fbaa6968dc52e856097de954a92ea8b8`;
its delta to final `9e430312` is solely the unique report. The retained
`/tmp/sgui-batch11-standalone-storybook.log` records successful fresh build and
`/tmp/sgui-batch11-standalone-browser.log` records six successful Chromium/WebKit
cases matching the exact spec (including visible complete-date segments and
FormData). The original worktree is absent at review time, so its ignored JSON/
HTML artifacts cannot be inspected. Reported 228 related tests and type/guard
passes are worker claims; this review did not rerun or independently recover
their complete outputs.

## TimeField: narrow fix versus retained reset holds

The [report](https://github.com/Structured-Growth/sg-ui/blob/c90e4def00c3d4d1c2a5d17771a1313311636fde/docs/developer/parallel-batch-13/control-timefield.md) correctly limits this fix
to restoring owned invalid-default feedback after accepted native reset. The
native-ref bridge forwards function/object refs and the shared helper waits for
delegated prevention before changing that feedback. The final source still lets
React Aria own value/segment reset and forwards its onChange directly: there is
no owned reset callback suppression and no partial-draft preservation here.
Current defaultValue versus engine reset-default coherence and form reassociation
also remain reserved; passing ordinary reset does not resolve those concerns.

Implementation/test/story head `ff3dab5a5f1d871a42659d538f4bec8d811f586f` differs
from final head only by the report. Retained red/green logs
`/tmp/sgui-batch13-timefield-{red,green}.log` show the feedback regression failing
(1 failure / 6 skipped) then all seven tests passing. The red log itself does not
attest the temporary source hash; exact-baseline restoration is worker-reported.
Fresh build/browser logs `/tmp/sgui-batch13-timefield-{storybook,browser}.log`
exist and show success. The worker's clean tracked checkout is at the exact head;
its `artifacts/browser-results.json` contains six expected passes, no retries,
skips, unexpected or flaky cases, in Chromium/WebKit. Titles match the retained
spec: feedback restoration and English/German host midnight replacement/local
second wrap/read-only/disabled form behavior. No prevented-reset or callback-
silence native assertion is present. Type/guard results remain report evidence.

Recommended bounded follow-up: separately reserve TimeField reset prevention,
callback silence, partial segment preservation, changed defaults and reassociation
with native visible-segment/FormData/focus assertions. Retain the existing reset
hold while integrating only the proven parse-feedback improvement if desired.

## SplitAction: current availability and menu lifetime

The [report](https://github.com/Structured-Growth/sg-ui/blob/21faadf6201cbae51173898d778a4f318d77b3f2/docs/developer/parallel-batch-13/control-splitaction.md) matches the implementation:
blocked rendering closes the menu synchronously, an effect clears remembered open
state, and a current blocked guard rejects secondary actions. Primary Button
loading/disabled behavior is reused. Existing menu anchor/items remain intact;
recovery needs a fresh gesture. No source defect was found in this bounded change.

Implementation `ed5bb11ca8a76c55597202c9cce1706fe16004fc` and fresh native-tested
head `f5f824e99edd6e7a17b6ac031b0adcc337b6f4c3` have identical source/spec/story
bytes. The latter differs from final head only by the report. Durable state lists
the implementation as testedHead; the report provides the more precise build head.
Retained `/tmp/sgui-batch13-control-splitaction-{storybook,browser}.log` confirms
fresh build and eight passes. The clean exact-head worktree JSON has eight expected
Chromium/WebKit passes without retries/skips/flakes. The four spec cases genuinely
assert focused-menu closure on pending/disabled, recovery without reopening,
current replacement callbacks/anchor identity/activation return focus and portal
cleanup on removal. Reported 15 final units and type/guard passes were not rerun.

Entire-control removal checks subsequent usable keyboard access, not automatic
fallback focus. That host policy, nested collision/zoom and physical touch/AT
remain open; reserve a separate task if a prescribed removal focus policy is needed.

## Formatting toolbar: tested source and selector-only correction

The [report](https://github.com/Structured-Growth/sg-ui/blob/b22cf93bd4906f7bf76658002747bd2b439b613b/docs/developer/parallel-batch-13/formatting-toolbar.md) describes the small change
accurately: queued heading/font delivery reads current committed callbacks and
disabled-control/set restrictions; existing timer cleanup remains. No public API,
individual control or Lexical host source was modified. No bounded defect was
found. Hidden-control cancellation and the broader editor command matrix are not
established by these tests.

Unit-tested implementation is `1226f53ebcc1aca9e8593dd13464dc80edecce09`.
Fresh static source head `1e93e1c1ff5dff3df029465c8d30ab1a6dca70bd` differs from
native spec head `7967dfc9a885497807894efd74e419b5cd81305a` only in two status
locators narrowed to the unnamed host result. Product/story bytes are identical;
the final `b22cf93` delta is report-only. Thus reusing the fresh build for the
corrected spec is justified and no during-suite rebuild was needed.

The clean exact-head worktree's `artifacts/browser-results.json` exists and records
12 expected passes with no retries/skips/flakes: heading/font Enter selection in
replace/remove/disable modes, Chromium/WebKit. Its six titles match the final spec,
which waits across a task boundary for rejected requests and checks controlled
chooser text, unchanged contenteditable text and accepted-command focus. The
reported initial ambiguous-status failures are explained by the verified locator
diff; the overwritten final JSON does not independently preserve that failed run.
Reported 14 unit tests and type/guard/build success remain report evidence where
no separate retained output was inspected. Runtime is explicitly Node 26 evidence,
not Node 24/React 18 certification.

## Limits and validation of this review

No dependency installation, test suite, browser run, Storybook rebuild or full
check was performed by this documentation-only review. The source/spec diffs,
report links, local log paths, available JSON test titles/results, exact commit
deltas, original ownership and GitHub heads were inspected. Local artifacts lack
a cryptographic source-head attestation: commit-byte equivalence and worker build
reports establish provenance to the extent available, not reproducible Actions
artifacts. Unrecovered targeted/guard output is explicitly worker-reported.

Firefox, full supported runtime/consumer matrix, physical-device/IME and manual
assistive-technology acceptance remain unverified. Development CI remains paused.
Broad K/E/U/X/R/Z gates remain open. Conflict previews target only the pinned dev
commit; coordinator must evaluate later integration ancestry and composed behavior.
