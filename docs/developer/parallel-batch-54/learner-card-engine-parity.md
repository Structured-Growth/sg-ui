# M-15 learner-card engine expectation correction

Date: 2026-10-07. Reviewed base: `496658081b8b8efcde21ab4f9b151adfd3aa32fe`.
Managed worktree created and attached before edits:
`/Users/thomashall/.codex/worktrees/batch54-learner-card-engine-parity/sg-ui`.
Initial `git status --porcelain` was empty and HEAD exactly matched the base.
The assignment's concatenated `codex/dev496658...` was not a Git ref; creation
failed without editing a checkout. Read-only ref inspection identified `codex/dev`
at the requested hash; creation then used the exact 40-character hash.

Exclusive scope: `src/components/LearnerClassCard/`,
`tests/browser/inventory-learner-card.spec.ts`, and this report.
Only the spec and this report change. Product source, stories, shared frame,
Link, models and adapters remain byte-identical to the reviewed base.

## Frozen red evidence and classification

Read the [prior completion report](../parallel-batch-41/learner-card-native.md),
[owned card contracts](../react-aria-card-frames.md),
[development policy](../react-aria-development-validation.md),
[browser acceptance](../react-aria-browser-acceptance.md), and
[parallel browser contract](../react-aria-parallel-browser-validation.md).

The retained checkpoint directory is
`/Users/thomashall/.codex/worktrees/dev-integration/sg-ui/artifacts/browser-pool/62606ae5-219b-4fc7-816f-fb51691ea5fd/`.
Read root/shard evidence, learner-card results, command/resource log, all three
error contexts and zipped trace snapshots. Root initial/final HEAD, source digest
and build digest match; final status is clean and cleanup says owned commands
settled. Learner command resources say `settled: true`, no signal errors, exit 1.
This is actual failed acceptance evidence, not an infrastructure-aborted run.
Results: 11 expected, 3 unexpected, 0 skipped, 0 flaky across Firefox/WebKit.
No retained artifact was modified. Build digest:
`c7bdf78df57d7eec5f9514bb77c4b944cbadd20a50021207e27a8b9bef0f1084`.
The pool used eight sessions; supplied resource evidence records peak load 11.33,
sampled aggregate RSS 22.94 GiB and swap-used reduction 16 MiB. Those measurements
do not convert failed assertions into passes or establish an environment cause.

Two underlying test-policy defects explain three cases; no product defect is
demonstrated:

1. **Intl expectation defect**: Firefox's saved DOM contains exactly
   `First: Due 1. Jan. at 09:05`; the literal expected `9:05`. WebKit's German
   case passed the unpadded literal, as did prior fresh Chromium. Native ICU
   numeric-hour padding is engine-dependent. The spec independently evaluates
   browser `Intl.DateTimeFormat('de-DE', { hour: 'numeric', minute: '2-digit',
   timeZone: 'America/Chicago' })` for the fixed UTC instant, requires `0?9:05`,
   then asserts the complete literal date/translated label with that exact native
   time. It does not import the product formatter or loosen the entire label.
   en-US/ar-EG literal labels, invalid-locale English fallback, fixed clock,
   imminent/invalid dates, focused node identity and translation replacement
   assertions remain intact.
2. **Native keyboard-driver policy defect**: both WebKit destination variants
   retain an ordinary native anchor but fail after unmodified Tab. macOS WebKit
   defaults distinguish control traversal from link traversal. Apple's
   [native preference documentation](https://developer.apple.com/documentation/webkit/wkpreferences/tabfocuseslinks)
   explains that Option temporarily reverses the Tab-to-links preference.
   Existing [ButtonGroup evidence](../parallel-batch-13/control-buttongroup.md)
   already establishes this platform distinction. The learner spec now uses
   Alt+Tab/Alt+Shift+Tab only for macOS WebKit; every other platform/engine keeps
   ordinary Tab/Shift+Tab. All engines must traverse Details → Continue → Details
   → Continue with native keys. There is no forced Continue focus, skipped case,
   retry, sleep, production tabIndex change or synthetic activation.
   Enter, exact host route/callback counts, native popup URL, null opener,
   target/rel attributes and source focus after popup close remain strict.
   The no-destination button test still uses ordinary Tab and native Enter/Space.

Corrections are classified as fixture/driver/expectation defects. At the initial handoff, fresh native
confirmation remained coordinator-owned and pending. Wave28 confirmation is
recorded below; earlier red evidence remains failed. M-15 and broad device/AT
acceptance are not closed.

## Local validation

Bundled PATH: `/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
Node `v24.19.0`, pnpm `10.29.3`. Each stage used the existing pool helper with a
unique `batch54-*:<UUID>` token. Atomic install slot
`/tmp/sgui-install-slots/slot-0` and light slot
`/tmp/sgui-light-validation-slots/slot-0` were acquired before commands and
released only by exact owner comparison. No foreign lease cleanup occurred.

- `pnpm install --frozen-lockfile`: passed, unchanged lockfile; 608 packages reused.
  Existing ignored esbuild build-script warning retained; no approval/config change.
- `pnpm exec vitest run src/components/LearnerClassCard/LearnerClassCard.test.tsx --maxWorkers=1`: 1 file, 3 tests passed (existing composed route/progress/callback tests).
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed owned import/layer/token guard.
- `git diff --check`: passed.

Only test/report bytes change, so no new product unit test, style/token change,
source API typecheck, standalone build or heavy/browser run was introduced.
User-authorized targeted policy supersedes full per-task checks. Coordinator
will build and typecheck the immutable shared candidate once with exact owned-byte
attribution. Spec SHA-256 at handoff:
`5cfdf74fa44c88a16598f445e4f071797a12ba1c1bcd69328a6bc38e5c62d296`.

## Focused native handoff

Freeze committed spec/report/head before the coordinator starts. Required fresh
selections against its newly built immutable candidate, one worker/zero retries:

```sh
pnpm exec playwright test '(?:^|/)tests/browser/inventory-learner-card\.spec\.ts$' --project=chromium --grep 'browser ICU de-DE|preserves Details route and native isolated Continue activation'
pnpm exec playwright test '(?:^|/)tests/browser/inventory-learner-card\.spec\.ts$' --project=firefox --grep 'browser ICU de-DE'
pnpm exec playwright test '(?:^|/)tests/browser/inventory-learner-card\.spec\.ts$' --project=webkit --grep 'preserves Details route and native isolated Continue activation'
```

These are three Chromium cases, one affected Firefox case and two affected
WebKit cases. Known engine failures warrant this earlier focused check. Do not
repeat unchanged en-US/ar-EG/fallback/no-destination green cases solely for load.
The coordinator owns admission and execution of these focused args; this report
does not authorize a worker browser/server run or a harness change.

Coordinator alone reviews/integrates/accepts. No dev/main merge, PR, push,
publication, workflow dispatch, permissions/secrets change or broad closure.
Source and report were frozen after initial handoff. After wave28 settled, the
coordinator authorized only the report update below; all source/spec/test bytes
remain frozen.


## Wave28 focused native result and final report-only handoff

The coordinator ran the exact frozen correction bytes from worker head
`d34ca299cecba28ed24f61ec8bd8058dbb950a04` on shared testing candidate
`24f9b4abb6ae39675b5bdf9abe8c9764a14a059e`, not on the worker checkout.
Read the actual root manifest, shard evidence, results, log and resource evidence
under
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/ccfdb3fe-1f4a-4199-9564-3a8b2dbf6fc3/`.
The shard is `learner-card-engine-parity`, slot 1, port 6504. One fresh shared
build and typecheck preceded execution under Node `v24.19.0`.

The actual coordinator filter was broader than the initial proposed selections:

```sh
pnpm exec playwright test '(?:^|/)tests/browser/inventory-learner-card\.spec\.ts$' --project=chromium --project=firefox --project=webkit --grep 'browser ICU de-DE|native isolated Continue activation|native activation'
```

Read and verified all selected case identities: exactly these four titles in each
of Chromium, Firefox and WebKit, twelve cases total:

- `browser ICU de-DE replaces due text while the same action retains keyboard focus`
- `both preserves Details route and native isolated Continue activation`
- `continue only preserves Details route and native isolated Continue activation`
- `no destinations exposes two keyboard buttons and invokes Continue once per native activation`

Result: **12 passed, 0 unexpected, 0 skipped, 0 flaky**, one attempt each, no
retries. Session ran 2026-10-07 17:45:23.686–17:45:39.108 UTC; test duration
14.513 seconds. The command exited 0, `settled: true`, with no signal errors.
No learner-card diagnostic attachment was emitted. en-US/ar-EG and invalid-host-
locale fallback cases were not selected; this is not a complete 21-case matrix.
The passing German and link cases prove the known affected-engine correction;
broader M-15/manual/device/AT and whole acceptance gates remain held.

Root initial/final HEAD, source digest and build digest match, final Git status
is clean, and cleanup records all owned commands settled. Build SHA-256:
`de160daed84eb81439957ab5fe4a760f5405a517f60cdb66a0111167dda23248`.
Source SHA-256:
`356333879fef4f68251b39abde4ced33fac328900c82fb47a9cbf8911176786e`.
The root pool remains red from separate selection diagnostic/grid scopes; this
shard's pass does not relabel those results or the earlier failed checkpoint.
Batch53 expected-red diagnostics do not provide learner-card acceptance.

Read `/tmp/sgui-batch45-candidate-wave28-attribution.json` and independently
hashed both worker/candidate owned files before this report-only update. Both
matched the recorded prepared worker digests:

| File | SHA-256 at tested worker/candidate |
| --- | --- |
| `tests/browser/inventory-learner-card.spec.ts` | `5cfdf74fa44c88a16598f445e4f071797a12ba1c1bcd69328a6bc38e5c62d296` |
| This report before final update | `1808e341d824606f42278d6a1538676506444e5bbafde27c9e861fcf921fd436` |

Only this report changes after the authorized scoped outcome. Report links and
`git diff --check` pass; no unit/type/build/browser/server rerun was performed.
Spec and all product/story/test bytes remain identical to the tested head.
Coordinator reviews the final report delta before individual integration; no
worker dev/main merge, push, publication or acceptance closure occurred.
