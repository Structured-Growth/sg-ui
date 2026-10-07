# Batch 57: M-07 Firefox embedded AuthShell keyboard entry

Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch57-auth-firefox-keyboard-entry/sg-ui`.
Clean exact base verified before edits: `496658081b8b8efcde21ab4f9b151adfd3aa32fe`.
The supplied concatenated branch/SHA string was not a Git ref; `codex/dev` and
`origin/codex/dev` both resolved to the requested exact SHA. Managed creation at
that SHA succeeded; initial `git status --porcelain` was empty. Primary/dev/
candidate/other worker sources were never edited.

## Preserved red evidence and classification

Read root/shard evidence, results, browser log, resource settlement, all four
Firefox traces and normal-text screenshot, plus the
[prior report](../parallel-batch-49/auth-embedded-host.md).
Frozen reviewed checkpoint evidence remains untouched at:
`/Users/thomashall/.codex/worktrees/dev-integration/sg-ui/artifacts/browser-pool/62606ae5-219b-4fc7-816f-fb51691ea5fd`.

Actual checkpoint head: `496658081b8b8efcde21ab4f9b151adfd3aa32fe`.
Source tree: `94ab72f476f9e0335ff8ab5ce05e93455401b125`.
Source digest: `e61559b264946c5b5a416e3a7194fd634c0ec30c5e6d9f003530ba694bde8286`.
Build digest: `c7bdf78df57d7eec5f9514bb77c4b944cbadd20a50021207e27a8b9bef0f1084`.
The immutable checkpoint completed with settled owned commands. The Auth shard
resource record reports code 1, no signal errors and `settled: true`, duration
30840.367 ms. Results: Firefox four failures at the first email focus assertion;
WebKit four passes; zero skipped/flaky. Earlier Chromium four passes are recorded
in the prior report. Resource samples were within the admitted budget (eight
sessions, peak load 11.33, sampled RSS 22.94 GiB, swap fell 16 MiB); this is not
classified as a resource abort or four separate product defects.

The old driver pressed one Tab from the document and assumed email focus.
Traces show that exact single Tab followed by the inactive-email failure in all
four cases. The normal screenshot shows the blue focus edge on the scroll host,
not the input. The old trace format does not serialize `document.activeElement`,
so exact active-node identity is inferred from the screenshot, not claimed as a
recorded evaluation. Mozilla documents native scroll-container tab stops in
[bug 616594](https://bugzilla.mozilla.org/show_bug.cgi?id=616594) and
[bug 254966](https://bugzilla.mozilla.org/show_bug.cgi?id=254966).

Classification: **fixture/driver/expectation defect indicated; precise native
sequence awaits fresh coordinator proof**. No production AuthShell defect has
been demonstrated. AuthShell implementation, CSS and reveal helper are unchanged.

## Bounded correction

- The embedded story includes a real SGUI predecessor button outside the clipping
  ancestor. The 300px scrolling host, 352px clipping ancestor, 320px maximum width,
  minBlockSize override and live host form remain intact.
- The driver asserts native predecessor focus, presses native Tab, and attaches
  the observed active tag/test ID/name as `native-entry-focus`. It permits exactly
  one additional native Tab only when the exact scroll host is active. Any other
  target still fails the mandatory email assertion. This is explicit native
  navigation, not a generic search-until-focused loop or programmatic repair.
- All complete-control bounds/hit testing/outline, single-host scroll ownership,
  native typing, live node/value/focus retention, submit-once and reverse traversal
  assertions remain. No sleeps, retries, skipped cases, focus calls, scroll writes,
  login/session/API behavior or shared primitive changes were added.
- The colocated controlled-entry composition test now enters from the same host
  predecessor and retains its identity/value/focus assertions. JSDOM is not native
  scroll-container tab-order proof.

## Local validation and frozen coordinator handoff

Bundled Node v24.19.0 path:
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
pnpm 10.29.3. Commands in this worktree:

- `pnpm install --frozen-lockfile`: passed; lockfile unchanged. Atomic own install
  lease acquired with `acquireInstallSlot`, released with `releaseLease` in finally.
- `pnpm exec vitest run src/components/AuthShell/AuthShell.test.tsx --maxWorkers=1`:
  seven passed initially (871 ms), then seven passed after updating the predecessor
  composition (645 ms). The second run followed a real test-source change.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed before and after
  the composition update. This extends source TypeScript configuration.
- `pnpm foundations:check`: passed; production source unchanged thereafter.
- `git diff --check`: passed.

Light commands used `acquireLightSlot` (four-slot root) with unique own tokens and
finally `releaseLease`; Vitest used one worker. No independent browser/server/build/
heavy run or full check occurred. Source/report freeze precedes coordinator review.

Changed files: AuthShell story/test, `tests/browser/inventory-auth-embedded-host.spec.ts`
and this unique report. No other tracked files changed.

Focused coordinator arguments:
`tests/browser/inventory-auth-embedded-host.spec.ts --project=chromium --project=firefox`.
For the shared immutable snapshot use one shard with that spec and
`"project": ["chromium", "firefox"]` (four cases per engine).
Firefox must run earlier than the normal checkpoint because it is the known
failure. Chromium needs fresh proof because the fixture/driver changed. Do not
repeat the unchanged green WebKit checkpoint solely for load; no WebKit keyboard
mapping changed. Inspect the `native-entry-focus` attachments to confirm the
actual predecessor → host (where native) → email sequence. Review any new failure
before further edits; no unchanged retry is requested.

Coordinator alone builds/typechecks the shared immutable candidate once, records
exact worker-byte attribution and accepts/integrates. Native success is pending;
no M-07 or broad U/X/R/Z gate is closed. Actual zoom, device and assistive technology
remain unverified. No PR/main/dev merge, publication, force push, CI/title dispatch,
permissions or secret operation occurred.

## Wave 28 verified focused native result

Coordinator wave 28 tested the exact frozen contribution
`96f8cbdecfb6979a642e8d513daa9cfaeb8712f4` on shared candidate
`24f9b4abb6ae39675b5bdf9abe8c9764a14a059e` in
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui`.
This candidate is the actual browser-tested head. The worker independently read
root/shard manifests, results, native-entry attachments and command settlement,
and compared all four owned file SHA256 values against the candidate and
`/tmp/sgui-batch45-candidate-wave28-attribution.json`; all matched.

Selected command:
`pnpm exec playwright test '(?:^|/)tests/browser/inventory-auth-embedded-host\.spec\.ts$' --project=chromium --project=firefox`.
The shard has `grep: null`: exactly the four light/dark × normal/200% text cases
on each of Chromium and Firefox. **Eight passed, zero failed/skipped/flaky;
each result retry 0.** Playwright duration: 13526.218 ms. WebKit was not selected
for this correction run; its prior checkpoint green remains historical evidence.

The `native-entry-focus` attachments confirm the cause directly in every case:
Chromium's native Tab from the asserted predecessor lands on `INPUT name=email`;
Firefox lands on `DIV data-testid=auth-scroll-host`, then the one additional
native Tab passes the mandatory whole-email-focus assertion. The remaining
visibility, focus outline, host-only scroll, typing, live node/value/focus,
submit-once and reverse-traversal assertions all passed. Final classification:
**one confirmed fixture/driver/expectation defect**, corrected without changing
production AuthShell. The earlier red checkpoint artifacts remain untouched.

Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/ccfdb3fe-1f4a-4199-9564-3a8b2dbf6fc3`.
The `auth-firefox-keyboard-entry/` shard contains the case identities, selected
arguments, `results.json`, `browser.log` and settlement resources. Root manifest
attests matching initial/final head, empty final source status and these immutable
source/build digests:

- Source: `356333879fef4f68251b39abde4ced33fac328900c82fb47a9cbf8911176786e`.
- Build: `de160daed84eb81439957ab5fe4a760f5405a517f60cdb66a0111167dda23248`.
- Story: `59a762527b8064736f137bf017419cb5f8d0b3c2a3be26a2ab6598dd26131a0b`.
- Unit: `ccd32abd24751b7a54c4a6c714057a8ff9ac353be207c02dc965af688b9e01f0`.
- Spec: `671c59e4f6877774e98652b1932ccc84910522f673c87bce21dda6b4e97e1656`.

The shared fresh Storybook build, source/browser typecheck and this browser shard
all exited 0, with `settled: true` and no signal errors. Runtime: bundled Node
v24.19.0, pnpm 10.29.3, Playwright 1.63.0. Overall pool status remains red from
separate diagnostic/grid scopes; this report claims only this eight-case slice.
No diagnostic expected-red capture is counted as AuthShell product acceptance.

This follow-up changes only this report. All tested story/spec/unit/production
bytes remain frozen. No worker browser/build/server or additional tests ran.
Coordinator review/integration remains separate. The known Firefox correction
and fresh Chromium slice are proven; whole M-07 and broad U/X/R/Z, actual zoom,
physical-device and assistive-technology gates remain held.
