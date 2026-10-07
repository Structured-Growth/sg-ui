# Batch 68: pooled touchscreen test navigation

## Scope and frozen source

This bounded browser driver correction starts from reviewed `codex/dev` ref
`1e3a6dc7c5cada97b463031078adc59f4c606694` in the attached managed worktree
`/Users/thomashall/.codex/worktrees/batch68-pooled-touch-url/sg-ui`.
Only `tests/browser/reorder.spec.ts` and this report are changed. Prepared worker
head `efdd0495f3a8c9c6229274ba672bbd2624dbad44` remained clean and frozen during
wave 31. After coordinator settlement, only this report was updated; the final
report-only commit SHA is delivered in the completion message.

Corrected spec SHA-256:
`48485ccc9c464397fd72577dd9750db494e5ecc4655683b5bd42dc3e4a82a169`.

## Before and after

Wave 30 served the isolated pool on port 6613, but the manually created touch
context navigated to `http://127.0.0.1:6173${storyUrl}`. The touch case failed at
line 125 with `page.goto: net::ERR_CONNECTION_REFUSED`, before its interactions.
This is a confirmed test-driver URL defect. The separate Strict Mode focus
failure belongs to batch 59 and is not resolved or reclassified here.

Retained red evidence, read without modification:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/80b00fee-f55f-45e8-88dc-4666223d88cc/pointer-drop-focus/browser.log`.
Its SHA-256 is
`85476c1f51d9ecef55c9872997660aeaab1175a71de6ffed0f69c7f47cd3bb8a`.
That run reported nine passes and two failures; it is not passing evidence.

The touch case now requests Playwright's `baseURL` fixture, passes it into
`browser.newContext`, and navigates to the relative `storyUrl`, matching the
existing configured harness contract. The configured origin therefore follows
the pool's selected port. Touch emulation, viewport, three native taps, commit
and rollback order checks, trusted-event checks, runtime error checks, context
cleanup and all other cases are unchanged. No production, configuration,
scheduler or other browser-spec edits were made; retries remain zero.

## Targeted local validation

Followed [development validation](../react-aria-development-validation.md) and
[parallel browser validation](../react-aria-parallel-browser-validation.md).
Runtime: Node `v24.19.0` via
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.

- `pnpm install --frozen-lockfile`: passed under an atomic owner-exclusive
  `/tmp/sgui-install-slots/slot0` claim, released by the same owner.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed under an atomic
  owner-exclusive `/tmp/sgui-light-validation-slots/slot0` claim.
- Inline Node/TypeScript mocked driver regression: passed. It transpiles the
  actual spec, captures the registered touch callback, and invokes it with
  mocked browser contexts and baseURL fixtures at 6173, 6613 and 6673. Each
  context receives that exact baseURL and retains touch/viewport settings;
  relative navigation resolves to that origin and `finally` closes the context.
  It stops before native interactions and is not browser proof.
- Exact baseline comparison: passed after applying only the three intended
  replacements to the reviewed baseline. All remaining source bytes, including
  interactions and assertions, match. The first inline diagnostic attempted an
  inverse replacement and matched an earlier pointer case's relative goto;
  that diagnostic failed. It was corrected to compare forward replacements
  from the baseline; no spec or assertion changes were needed.
- `git diff --check`: passed. Lightweight claims were released by their owners.

## Coordinator wave 31 Chromium proof

The settled coordinator run tested candidate
`1a378accd909a471e653fe4e27fe9457c9531049` in
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui`.
This testing-only candidate is distinct from the prepared worker head above.
Attribution maps batch 68 to that worker head and the corrected spec hash.
Reading the candidate's committed spec independently confirmed the same
SHA-256 `48485ccc9c464397fd72577dd9750db494e5ecc4655683b5bd42dc3e4a82a169`.
The current worker spec bytes remain identical. Integration is of reviewed
individual worker history after final delta review, never the whole candidate.

One fresh build served four disjoint Chromium shards on ports 6673–6676.
The `pooled-touch-url` shard on **6673** selected exactly the touch case and
passed **1/1**, retry zero, with zero skipped, flaky or unexpected cases and
no case errors. The other shards' 20 passes are separate scope; the wave's
21/21 does not claim the full reorder spec or broad acceptance.

Actual spawned argument array:

```json
["pnpm", "exec", "playwright", "test", "(?:^|/)tests/browser/reorder\\.spec\\.ts$", "--project=chromium", "--grep", "touchscreen non-drag Move alternative commits and rolls back with trusted touch input$"]
```

Runtime was Node `v24.19.0`, pnpm `10.29.3`, Playwright `1.63.0` on Darwin.
The selected case took 2529 ms; Playwright reported 3464.65 ms total and
the coordinator measured 4351.08 ms for the command. The session ran
2026-10-07 13:31:57.688–13:32:02.040 America/Chicago (18:31 UTC).
The `native-touch-alternative-events` JSON attachment contains three trusted
`touchstart` events and three trusted `pointerdown` events, all with pointer
type `touch`; no dragstart is recorded. The unchanged commit and rollback
assertions passed. This verifies emulated touch Move actions, not physical
long-press dragging.

Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/7c82140b-3a18-4b19-aca5-9a5f0720af5f`.
Paths below are relative to that retained root; hashes are SHA-256:

| Evidence | Hash |
| --- | --- |
| `evidence.json` | `5cb3d884baa20acc27afbaef230469ebabddf30d48f6c10a0dc32c69f5c1b59c` |
| `pooled-touch-url/browser.log` | `d61c1df39bacf649c77f49edb42764c252484e7e65e568ef7c97571e5c744cfa` |
| `pooled-touch-url/results.json` | `1954167d8ca540d71598a6d899506ee0cca9e3a1be14d805daaf5bd0134d17f0` |

External coordinator provenance:

- `/tmp/sgui-batch45-candidate-wave31-attribution.json`, SHA-256
  `71c504cfbeea41b8cdae012d16fdcedc5d646227d6feed18e0e0e3b440d13ced`.
- `/tmp/sgui-thirtyfirst-ready-native-plan.json`, SHA-256
  `bdf5f9e9aba37ec11d5de75979be882e594f9857ab829f9ee3f9f3622d50dfa5`.

Root evidence records unchanged initial/final candidate head, empty final Git
status, matching source digest
`d693faa54cb1419030282fe955d89f92f44f941cea24db640f3c519c60ae73ce`
and matching build digest
`ec6eca4336c63f839bde0508a026992dd9110b342f6072e714a5eaf6f14cde75`.
Cleanup records `owned commands settled`; the coordinator confirmed owned
leases released. No redundant browser, build, scheduler or GitHub Actions
run was launched by this worker for report finalization.

Focused Chromium proof is complete. Firefox/WebKit, physical-device, manual,
assistive-technology and whole acceptance gates remain pending. DatePicker
paste observations belong to the separately owned batch 73 report; this touch
shard provides no evidence for generic paste support or the batch 59 focus case.
