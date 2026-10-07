# Batch56 — M-20 Firefox toolbar search focus

## Isolation and scope

Reviewed base: `496658081b8b8efcde21ab4f9b151adfd3aa32fe` (`codex/dev`).
Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch56-toolbar-firefox-search-focus/sg-ui`.
The supplied concatenated ref `codex/dev496658081b8b8efcde21ab4f9b151adfd3aa32fe`
was not a Git reference; the first managed creation failed without edits. Resolved
`codex/dev` and the dev worktree independently to the supplied exact SHA, then
created the managed worktree at that SHA. Initial status was clean.

Only `tests/browser/inventory-toolbar-composition.spec.ts` and this report change.
DataToolbar production/story/test files, shared Menu, shell and models are unchanged.
No architecture, callback, sort/filter transaction or removed-option/delimiter
policy change is required. Followed [toolbar contracts](../react-aria-data-toolbar.md),
[development validation](../react-aria-development-validation.md),
[browser acceptance](../react-aria-browser-acceptance.md) and
[parallel scheduling](../react-aria-parallel-browser-validation.md).
Read repository AGENTS, README, migration and component architecture guidance.

## Preserved red evidence and diagnosis

Evidence root (read-only, preserved):
`/Users/thomashall/.codex/worktrees/dev-integration/sg-ui/artifacts/browser-pool/62606ae5-219b-4fc7-816f-fb51691ea5fd/`.
Read root/shard evidence, results, browser log, both retained Firefox trace ZIPs
and the [prior completed worker record](../parallel-batch-47/toolbar-native-composition.md).
Root head equals the reviewed base; source digest is
`e61559b264946c5b5a416e3a7194fd634c0ec30c5e6d9f003530ba694bde8286`;
build digest is `c7bdf78df57d7eec5f9514bb77c4b944cbadd20a50021207e27a8b9bef0f1084`.
Root retained its immutable hashes and settled commands. The checkpoint had eight
sessions, peak load 11.33, sampled aggregate RSS 22.94 GiB and swap usage fell
16 MiB. These failures are not a resource abort.

Two Firefox failures are one **fixture/driver expectation defect**. Six other
Firefox/WebKit cases passed; the prior fresh Chromium run passed all four cases.
Both failed at `tabTo(clear)` before Clear activation. The helper pressed forward
Tab up to 24 times, assuming it would cycle back to a button preceding Columns.
Both traces show the same native sequence after the second column dismissal:

- `call@265` Escape dismisses the column popover; `call@267` confirms Columns focus.
- `call@273` first forward Tab focuses Cards.
- `call@279` second forward Tab focuses List.
- `call@285` and subsequent Tab snapshots have no focused toolbar control; every
  target evaluation is false, and `call@413` fails the Clear focus assertion.

The inspected Clear button remains enabled, `type="button"`, `tabindex="0"`.
Earlier native Tab from the filled search input reaches Clear then Columns and
successfully opens Columns, so Clear is not globally inaccessible. Forward Tab
moves beyond the last document control instead of revisiting an earlier control.
The traces do not expose browser-chrome focus directly; leaving the document is
inferred from the observed sequence and inactive target. No toolbar focus trap or
blocked Tab is demonstrated. Source inspection finds only Escape default prevention
in the search wrapper, no Tab interception. Button has native non-submit semantics;
TextField exposes the native input. The host search state updates synchronously
and has no timer, focus effect or key handler. Awaited dismissal/Columns-focus and
host-column assertions precede the failing traversal, excluding an unawaited host
request as the demonstrated cause. No Clear callback had run when failure occurred.
No production defect or separate RTL defect is established.

## Correction and retained strict behavior

Replace the wraparound helper at this one call site with three native key presses:
Columns → Shift+Tab → Clear → Shift+Tab → search input → Tab → Clear.
Each destination has an explicit `toBeFocused` assertion. This proves reverse and
forward adjacent input/button navigation without browser-chrome wrap assumptions.
Enter then exercises the original Clear behavior. No script focus, sleeps, retries,
new timeouts, skipped cases or weakened assertions are introduced.

Exact callback sequence, independent toolbar/column query lifetime, Clear/trigger
focus, reopening empty input, Escape, controlled view rejection, locked columns,
form non-submission and narrow LTR/RTL geometry assertions remain intact. The
existing production stories already represent both changed test paths.

## Local validation

Bundled Node `v24.19.0` PATH:
`/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.
PnPM `10.29.3`. Installation and lightweight checks used exported atomic slot
helpers, exact unique owner tokens and `releaseLease` cleanup after commands settled.
Both claims acquired slot-0; no foreign lease was removed.

- `pnpm install --frozen-lockfile`: passed (608 cached packages).
- `pnpm exec vitest run src/components/DataToolbar/DataToolbar.native-composition.test.tsx src/components/DataToolbar/DataToolbar.test.tsx --maxWorkers=1`:
  passed, six tests / two files, one worker.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `git diff --check`: passed.

No worker browser, native server, Storybook build, heavy/full check, merge,
publication, CI dispatch or manual/device/AT closure occurred.

## Frozen coordinator handoff

Commit containing this report identifies the frozen candidate; exact HEAD and
owned-file SHA256 values accompany the ready message. Coordinator alone reviews,
builds/typechecks the immutable shared candidate and verifies owned-byte attribution.

Focused args for fresh Chromium and the known affected engine **before the normal
checkpoint**:
`tests/browser/inventory-toolbar-composition.spec.ts --grep 'column locks and reset coexist' --project=chromium --project=firefox`.
This selects the two LTR/RTL column/search cases per engine (four total), without
repeating unchanged selection/view green cases or WebKit solely to create load.
The snapshot harness can use this spec with both projects if its shard format
requires a whole-spec selection; prefer the legacy focused-args route when available.
Native correction remains pending until fresh coordinator proof. Broad M-20,
G/U/X/R/Z, manual/device and assistive-technology acceptance remains open.

## Verified wave28 focused native result

The pending handoff above is historical. On 2026-10-07 coordinator wave28 tested
actual shared candidate `24f9b4abb6ae39675b5bdf9abe8c9764a14a059e`, with exact
worker source bytes from `92eec1e93d24107a8213fda12269de06078c1a88`.
Independently read root/shard evidence, raw JSON results and browser log. The
actual filter was `--grep 'column locks and reset'`, with projects Chromium and
Firefox and the anchored `inventory-toolbar-composition.spec.ts` selector.

All **four selected cases** passed: the column locks/reset/search Clear/Escape
and independent query lifetime case at 360px LTR and 320px RTL in each engine.
Raw results record expected 4, unexpected 0, skipped 0, flaky 0, no global errors,
and retry 0 for every result. The strict adjacent reverse/forward focus assertions
and subsequent original callbacks/Escape assertions passed in the affected Firefox
engine. This confirms the bounded driver correction. Selection/view cases and
WebKit were not selected in this wave; this is not a whole toolbar suite pass.

Root manifest records one fresh shared Storybook build and browser typecheck,
bundled Node `v24.19.0`, owner
`browser-snapshot:18139:69023eba-b79b-4ca5-8b57-9a7f3b42a1e8`, and queue owner
`01a1164f-41db-7f30-aaf9-f20133b6566f`. Final HEAD/source/build hashes equal their
initial values, final source status is clean, and owned commands settled.

- Source digest: `356333879fef4f68251b39abde4ced33fac328900c82fb47a9cbf8911176786e`.
- Build digest: `de160daed84eb81439957ab5fe4a760f5405a517f60cdb66a0111167dda23248`.
- Root evidence: `/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/ccfdb3fe-1f4a-4199-9564-3a8b2dbf6fc3/evidence.json`.
- Scoped evidence, raw results and log: the adjacent `toolbar-firefox-search-focus/` directory.
- Attribution: `/tmp/sgui-batch45-candidate-wave28-attribution.json`.

Independently hashed candidate Git bytes at the tested SHA and frozen worker files;
both match attribution for the spec
`09c4f7e9e5ff17081d101e4cfdeafd1ee2049420064e5ff422964c1cc1634e18`
and pre-append report
`0b698d5bdc39ab52edb8f1e48f6b7916e97c2f52d1e1bd12e4c21ffdcb4f75eb`.
Only this evidence append changes after proof; production/story/spec/test bytes
remain frozen. No additional validation command or native worker run occurred.

The overall pool remains red for separate selection-diagnostic/grid scopes;
those failures and the earlier Firefox red traces are preserved. Their outcomes
do not become product acceptance through this green shard. Coordinator retains
individual integration/acceptance ownership. Known affected-engine correction is
proven; unsupported/manual/device/AT and broad whole gates remain open.
