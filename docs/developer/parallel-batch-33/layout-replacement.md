# M-21 F6a: live layout slot replacement

Baseline: exact reviewed `codex/dev` commit
`4c9f859bad204a7d7fd2e3787aa6f293db268525`. Created and attached managed worktree
`/Users/thomashall/.codex/worktrees/m21-f6a-layout-replacement/sg-ui` before edits;
unique branch `codex/m21-f6a-layout-replacement`. Exclusive writes are
`src/components/DocumentEditorLayout/`,
`tests/browser/inventory-layout-replacement.spec.ts` and this report. Other editor
and shared source, the primary image-upload work and all other worktrees are unchanged.

The [batch30 review](../parallel-batch-30/inventory-acceptance-13-24.md) identifies
F6a as missing evidence. [Batch13](../parallel-batch-13/editor-layout.md) remains
inspection-only evidence. Existing tests already cover static region order,
removal, native root props/ref, keyboard action order and SSR; those assertions
are retained rather than duplicated in the new cases.

## Change and focused proof

Added the [SlotReplacement story](../../../src/components/DocumentEditorLayout/DocumentEditorLayout.stories.tsx)
with host-owned bounded scrolling and Alt+1/2/3 state controls. The stable host
child and ref callbacks stay in place as header actions, menu and toolbar are
added, replaced, removed and re-added. Content remains focusable and independently
scrollable. Story labels are host sample data. No production implementation,
CSS, public API or dependency changed; no product defect has been demonstrated.

One new [colocated composed test](../../../src/components/DocumentEditorLayout/DocumentEditorLayout.test.tsx)
asserts the unchanged focused host node and native root/host refs through live
slot changes. Its jsdom scrollTop assertion is state retention, not native geometry.

The [focused native spec](../../../tests/browser/inventory-layout-replacement.spec.ts)
contains four cases: both production themes at 260px, with normal and 200% browser
text. A trusted wheel positions a focused document action near the host viewport
top; native Alt shortcuts change chrome without refocusing content. Cases assert
same root/content-wrapper/host/action nodes, unchanged ref attachment counts and
scrollTop, complete focused-action bounds, slot presence and replacement labels,
no horizontal overflow, and host overflow ownership. Final Tab traversal and wheel
scrolling verify continued keyboard access and a stationary header. Geometry is
attached to the browser result. 200% CSS root text is not actual browser zoom.

## Validation and evidence classification

Runtime: Node `v26.5.0`, pnpm `10.29.3`. Frozen-lockfile install passed (608 packages;
esbuild lifecycle script ignored by the existing pnpm policy). Atomically acquired
install slot0 and light-validation slot1 with unique token ownership; released only
owned slots after their work. No heavy build/server/browser or scheduler changes.

Executed targeted checks:

- `pnpm exec vitest run src/components/DocumentEditorLayout/DocumentEditorLayout.test.tsx`: **5 passed**.
- First `pnpm typecheck`: **failed**, new story omitted required Storybook args.
  Classified as fixture/type-authoring error, not product or environment failure.
  Added required title/children args; preserved this red result here.
- Repeated `pnpm typecheck`: **passed**.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: **passed**.
- `pnpm foundations:check`: **passed**.
- `pnpm tokens:check`: **passed**.
- Report link existence and `git diff --check`: **passed** before delivery.

Fresh focused Chromium execution is requested from the coordinator's immutable
browser pool at the clean committed source head. No native result is claimed until
that exact head executes. Source scope remains reserved pending Chromium evidence.
Firefox/WebKit belong to the deferred batch checkpoint. No per-task full check,
Storybook build, CI dispatch, main merge, publication or credential access.

This slice does not close M-21, E-03/X-05, manual zoom/device or assistive-technology
acceptance. Arbitrary host chrome taller than its bounded viewport still needs a
host reflow policy; this representative composition does not add another scroll
owner or claim arbitrary-slot overflow acceptance. Defects outside the allowlist
require a reserved successor, not edits from this task.

## Coordinator wave21 and bounded driver correction

Coordinator executed exact clean head
`f4eaa333be2cf24916a144e7b35d17d5f06f3f13` under Node `v24.19.0` with a fresh
immutable Storybook. Chromium: **2 passed, 2 failed, zero skips/flaky**. Initial
and final heads were identical and clean; build digest remained
`da96bbc477bdc84ce08caf1a1fb34a4aa622ee6758b86b20b21f3ece89004a7a`.
Original red evidence remains unmodified at
`artifacts/browser-pool/08bcd092-720d-44b6-9ff1-d0b7c49daa6d/evidence.json`, with
adjacent `results.json`, `browser.log`, report and retained failure traces.

Both normal-text cases fail at initial trusted-wheel setup, before any chrome
change. The DOMRect-derived requested absolute scroll is `1828.5`; Chromium
settles at `1829`. The old `toBeCloseTo(..., 0)` requires a difference strictly
less than 0.5, so exactly 0.5 fails. This is a wheel-position expectation/driver
precision issue, not demonstrated product scroll drift or an environment failure.
Both enlarged-text cases complete all chrome transitions: observed scrollTop is
exactly `6541` throughout, action top stays `40.0625` below the host top, and node
identity, ref attachments, visible focus and ownership assertions pass.

Bounded spec correction permits at most **one CSS pixel only during initial wheel
positioning**. This reflects fractional rectangle versus native wheel scroll
representation; it does not loosen the behavior being investigated. The replacement
scroll assertion is tightened to exact equality with the observed baseline, so
any actual scroll drift during a slot change still fails. Identity, focus bounds,
ref attachment and single host scroll-owner criteria remain unchanged. No story,
production source or CSS correction is made.

After correction, `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json` and
`git diff --check` pass. Atomic token-owned light slot1 was released. The prior
unit/source/foundation/token results remain applicable to unchanged files; no
independent heavy/native execution or unchanged browser retry occurred. Corrected
clean head is submitted for a fresh coordinator Chromium run; normal-text native
replacement proof remains pending until that run passes. Firefox/WebKit and all
broader acceptance limits remain open.

## Final focused Chromium evidence: wave22 candidate

**Four passed, zero failed/skipped/flaky**, Chromium, Node `v24.19.0`.
Actual tested head is the coordinator's separate clean shared candidate
`e6270941ea8828d8868fef0798451a599a9db25f`, not worker head
`bcb33fe172095afe87b93068feb46ebbfe275bb2`. Coordinator composed ten disjoint
allowlists, built fresh Storybook and browser types once, then ran isolated
focused shards. Exact layout selection:
`pnpm exec playwright test '(?:^|/)tests/browser/inventory-layout-replacement\.spec\.ts$' --project=chromium`.

Read and verified layout evidence/results:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/400c7da0-2b1c-447c-8101-fbd7237b63c5/layout-replacement/evidence.json`
and adjacent `results.json`, `browser.log` and geometry attachments. Root snapshot
provenance is the adjacent parent `evidence.json`. Initial/final candidate heads
are identical, final Git status is clean, and source/build digests remain:

- Source: `d4c78b7a57d00a53a63a75fe5090b4b24c8681b532a5ba51c663a60049a2d9f0`.
- Storybook: `2a06f15980b85cd3f8eb36bc2ad8ce05693dc11aaafe52edc2c21b7ca10dc9ca`.

Coordinator attribution at `/tmp/sgui-batch45-candidate-source-attribution.json`
maps worker `bcb33fe172095afe87b93068feb46ebbfe275bb2` to the candidate. Before
this report-only finalization, independently compared all four worker-owned files
against the recorded SHA-256 byte digests; all match. The source/spec digests are:

- Story: `69ca7f3d749159ff2ff61949cd64cdeef29a1c684028e1449edc17c158693446`.
- Colocated tests: `04fb3d114e7b88b1e16548f0bf842775bf91bb035c50623e4c714a6623ccb399`.
- Native spec: `984917df042c4efa7c8ff63fd51bc5e2c64510667ebc1d30fe6fbc342695feb6`.

Both normal-text themes retain exactly `1829` scrollTop and focused action top
`39.5` CSS pixels below host top through draft/review/absent/draft. Both enlarged
text themes retain exactly `6541` and `40.0625` respectively. All node/ref identity,
slot replacement, visible focus bounds, scroll ownership, keyboard traversal and
stationary-header wheel assertions pass. This confirms the initial wheel rounding
correction without hiding slot-change drift. Original wave21 red artifacts remain
preserved. No product defect or production correction is claimed.

The root wave22 snapshot status is failed because other disjoint shards failed;
this report claims only the successful layout shard, not a whole wave/full suite
pass. Finalization edits this report only; source/spec remain byte-identical to the
prepared attribution. No repeated runtime checks or independent heavy execution.
F6a is ready for coordinator review and provisional integration; coordinator alone
integrates worker history and releases source reservation. Firefox/WebKit checkpoint,
M-21 whole-row, manual/device/zoom/AT and broader acceptance remain open.
