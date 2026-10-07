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
