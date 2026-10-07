# Batch 49: M-07 short embedded AuthShell host

## Scope and frozen handoff

Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch49-auth-embedded-host/sg-ui`.
Clean exact base before edits: `0186aff866d1b0b568817631f3d0da83ee0d49e3`.
This bounded evidence task follows the missing short-host slice recorded by
[batch 29](../parallel-batch-29/inventory-acceptance-02-12.md) and extends
[batch 10](../parallel-batch-10/auth-shell-reflow.md), without duplicating its
viewport-only cases. Production AuthShell and shared primitives remain unchanged.

The `EmbeddedScrollingHost` story has a 320 CSS-pixel-wide, 300-pixel-high scrolling
host inside a 352-pixel clipping ancestor. The host explicitly sets AuthShell's
native `minBlockSize` to `100%`. Native email entry updates the controlled value,
heading, subtitle, guidance and footer while preserving the field. This is host
presentation state, with no login/session/API behavior.

The new [browser spec](../../../tests/browser/inventory-auth-embedded-host.spec.ts)
contains four light/dark and normal/200% root-text cases at 368 × 700 CSS pixels.
Native forward/reverse keyboard traversal must expose complete inputs, submit
button and footer link within both ancestor bounds, with hit testing and visible
focus outlines. Keyboard entry must retain native element identity, value and
focus through the live host update, submit exactly once, and scroll only the host
without horizontal overflow. The enlarged cases add line/letter/word spacing.
No synthetic focus, selection or scroll repair is injected. The WebKit keyboard
mapping follows batch 10's native Option+Tab finding, but is not new engine proof.

## Targeted local evidence

Node `v24.19.0` from
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`;
pnpm `10.29.3`. Commands run in the managed worktree.

- `pnpm install --frozen-lockfile`: installation passed, unchanged lockfile. The
  wrapper initially called nonexistent `lease.release()` after installation and
  exited red. This is a local orchestration error, not a dependency/product failure.
  The exact owned installation token was verified and released with exported
  `releaseLease`; no foreign lease was touched.
- `pnpm exec vitest run src/components/AuthShell/AuthShell.test.tsx --maxWorkers=1`:
  initial six cases passed; final seven cases passed (681 ms).
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed on the final story/spec/unit sources. This extends the source TypeScript configuration.
- `pnpm foundations:check`: owned import/layer/token guards passed.
- `git diff --check`: passed.

Installation uses an atomic owned slot under `/tmp/sgui-install-slots`; lightweight
checks use atomic owned slots under `/tmp/sgui-light-validation-slots`, with one
Vitest worker. Coordinator exclusively owns the fresh build/browser pool.

## Native evidence preparation (historical)

Focused arguments: `tests/browser/inventory-auth-embedded-host.spec.ts --project=chromium`.
Source/head/report freeze precedes coordinator execution against a fresh reviewed
mutually disjoint testing candidate. Candidate SHA and immutable native artifacts
will be recorded after results, in a report-only commit. No browser result or
confirmed product regression is claimed at this preparation stage.

Firefox/WebKit are intentionally deferred to the batch checkpoint. Actual browser
zoom, physical devices and assistive technology remain unverified. This does not
close M-07 or broad U/X/R/Z acceptance. No full check, independent build/server/
native run, GitHub CI/title operation, dev integration, merge or publication ran.

## Pre-admission driver correction

Coordinator independent review of preparation head
`9e940fe60c96d3016fe7a07367da2747c0fb98d4` found an expectation defect before any
native execution: `singleHostScroll` required positive host scroll after every
focus, including an already wholly visible email control. AuthShell correctly
reveals only clipped controls. The corrected spec keeps stationary shell/content/
clip/document checks on every traversal step, and proves actual host movement
between initial position and the lower footer, then reverse movement back to the
email. Whole-control bounds, hit testing, focus outline, native typing, element
identity/value retention and exactly-once submission assertions are preserved.
This is driver/expectation evidence, not a runtime product regression or browser
failure. Production code remains unchanged. Browser/source TypeScript validation
passed after the correction under an owned light slot; no native/build run occurs in this worktree.

## Wave 23 verified focused Chromium evidence

On 2026-10-07 the coordinator built and ran the frozen shared testing candidate
`c64c4377eb42c936f3cf8f1e3f5de2a5b33bdc05` from
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui`.
The tested worker contribution was `65473cd8936d9e4eae42eaf583b4adfbdb2059eb`;
the candidate, rather than the isolated worker head, is the actual browser-tested
head. The worker independently read the root/shard evidence and results, then
verified SHA256 hashes for all four owned files against both candidate and worker
bytes and `/tmp/sgui-batch45-candidate-wave23-attribution.json`.

Focused Chromium result: **4 passed, 0 failed, 0 skipped, 0 flaky**; Playwright
result duration 6546.011 ms. The fresh immutable Storybook build and source remained
unchanged through execution, with matching initial/final attestations:

- Source digest: `b6047a36c2eb6749f427c775e1f0c716225a303dd276fd272da6608de5efcc56`.
- Build digest: `1afdb63861962fc7858ba9c42ec5a7e7e5dcc9b89d4f02fad7d6d9ddead899ca`.
- Story SHA256: `5ddd6ad64bdfb869d00a671f926af62a07cc127ac5d487ddd416a6bb422b2252`.
- Unit SHA256: `28ce1976097ed050d5f1fd8da96b77c6c4e2006d19a67e4646cdd3ca345bc000`.
- Spec SHA256: `b4a06b6816c13dfbd956ec3d2197008dc042785720df05093fda03713f52a213`.

Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/16f6feff-4479-4f37-8c96-451b694ba457`.
Its `evidence.json` records candidate/build/source/runtime attribution; the
`auth-embedded-host/evidence.json`, `results.json`, `browser.log` and adjacent
resources/report/traces preserve this focused result. Actual runtime was Node
`v24.19.0` at the supported bundled path, pnpm `10.29.3`, Playwright `1.63.0`.
The selected shard executed this spec on Chromium under the coordinator pool.

The overall wave failed in six other shards; this report claims only the green
AuthShell slice. The pre-admission expectation finding and installation wrapper
error above remain preserved. No AuthShell production defect was demonstrated,
and production code is unchanged. The final commit changes only this report,
retaining the tested story/unit/spec bytes. This enables coordinator review for
provisional integration; it does not establish dev acceptance or whole M-07
completion. Firefox/WebKit checkpoint, actual zoom/device/AT and broad U/X/R/Z
acceptance remain pending. No worker integration/push/merge/publication occurred.
