# Batch 13 — control-link (U-10/H-03)

## Review location and ownership

Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
Original managed worktree: `/Users/thomashall/.codex/worktrees/batch13-control-link/sg-ui` (later missing after app restart).
Attached recovery worktree: `/Users/thomashall/.codex/worktrees/batch13-control-link-recovery/sg-ui`.
Branch: `codex/batch13-control-link`; draft base: `codex/dev`.
Implementation/tested source head: `6cb5a34b2690dbbdf4f0da3c1b9f0a844357a55a`.
Draft PR: [#68](https://github.com/Structured-Growth/sg-ui/pull/68).
Native-tested frozen head: `b9e981ffea6ea6ab0d77125172d480242b2645c7`.
Final report-only commit/head is included in the coordinator handoff; no Link source
or spec changes follow the tested implementation.

Exclusive write allowlist:
- `src/experimental/Link/`
- `tests/browser/batch13-control-link.spec.ts`
- `docs/developer/parallel-batch-13/control-link.md`

Task edits remain inside that allowlist. Separately authorized common prerequisite:
normal conflict-free full-history merge of reviewed
`6b9da4423f1e6675c37571d5552474da25e90258`, producing `b9e981ffea6ea6ab0d77125172d480242b2645c7`.
Its six harness/config/docs files are shared prerequisite ancestry, not Link task
edits. Primary and other worktrees remain preserved.

The original checkout was confirmed missing before mutation. The coordinator
authorized exactly one managed recovery via create_worktree at retained/pushed
`6e15c6b50a098602f97f775ea1633bd5a5469744`; the returned replacement was attached
and the retained task branch selected. No foreign metadata pruning, manual
checkout recreation or primary copying occurred. Link source, spec and report
were byte-for-byte unchanged by recovery/prerequisite merge. One authorized
frozen-lock install in the replacement made dependencies ready (Node 24.21.0);
no tracked dependency changes resulted.

## Demonstrated defect and fix

The [owned layout/action contract](../react-aria-layout-actions.md) promises
supplied rel preservation plus noopener/noreferrer for new-tab links. Native
reserved `_blank` targets are case-insensitive. The implementation compared only
lowercase `_blank`, omitting noreferrer for `_BLANK` and `_Blank` with supplied
`rel="author noopener"`. Both new unit cases fail before the fix at the exact rel
assertion (3 existing passed / 2 new failed).

The comparison now uses `target?.toLowerCase()` while forwarding the original
target unchanged. Tests exercise relative href, rel de-duplication, native ref,
nested span activation and host navigate bypass. The NewTabTargets story uses the
owned Button to focus the anchor ref. The focused browser case checks native
pointer and Enter popup activation, null opener and no host route request.
No URL trust or host navigation policy is introduced.

Existing evidence was inspected before editing: Link's three unit cases,
[adapter completion report](../parallel-batch-01/adapters.md), navigation unit
coverage, batch01-adapters browser coverage and the NavigationSemantics browser
case in acceptance.spec.ts. Those already cover ordinary routing, downloads,
cancellation, modifiers, native fallback and custom refs. They do not cover
mixed-case new-tab rel augmentation.

## Targeted local validation

Runtime: Node 24.21.0, pnpm 10.29.3, React 19.2.3; node executable:
`/Users/thomashall/Library/pnpm/store/v11/links/@/node/24.21.0/8e3363dcf6f5ccdfdbb0a5b55fe716a72499ddb103e848ba9405f4e34d178319/node_modules/node/bin/node`.

Commands (same source tree as implementation head):
- `pnpm install --frozen-lockfile`: PASS, no tracked dependency changes.
- Before fix: `pnpm exec vitest run src/experimental/Link/Link.test.tsx --maxWorkers=1`:
  expected RED, 2 failed / 3 passed, both failures missing noreferrer.
- After fix: `pnpm exec vitest run src/experimental/Link/Link.test.tsx src/adapters/navigation.test.tsx --maxWorkers=1`:
  PASS, 2 files / 13 tests.
- `pnpm typecheck`: PASS.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: PASS.
- `pnpm foundations:check`: PASS (import/layer/token guard).
- `git diff --check`: PASS; report relative links resolve.

jsdom logs its pre-existing unsupported native navigation diagnostic in existing
Link tests; those logs are not browser evidence. The initial native check was
queued until the reviewed pool and recovery prerequisites were ready. The
coordinator then ran a fresh immutable Storybook build and the existing focused
spec at clean head `b9e981ffea6ea6ab0d77125172d480242b2645c7`.

Verified retained artifacts under
`artifacts/browser-pool/dd10086b-dd74-4279-ab72-13b99912f3f7/`:
- `evidence.json`: status passed; final head unchanged, final status clean.
- `results.json`: 3 expected passes (Chromium/Firefox/WebKit, 1 each), 0 skipped,
  0 unexpected, 0 flaky, all retry 0.
- Node 24.21.0, pnpm 10.29.3, Playwright 1.63.0, darwin OS release 27.0.0.
- Pool slot 1, isolated port 6274; browser interval 2026-10-07 10:38:04.882–
  10:38:09.659 America/Chicago (15:38 UTC).
- Before/after immutable build SHA-256:
  `98b3b8042b14b35dceca84cd57c29fdc200e427e6129959a7170ebc405b0da14`.

Coordinator pool commands:
- `pnpm exec storybook build --output-dir <worktree>/artifacts/browser-pool/dd10086b-dd74-4279-ab72-13b99912f3f7/storybook`
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`
- `pnpm exec playwright test tests/browser/batch13-control-link.spec.ts --project=chromium --project=firefox --project=webkit`

Native assertions confirm href/target/rel forwarding, host-ref focus, nested text
pointer and Enter new-tab activation, null opener and no host navigate callback.
No additional heavy/native run was launched by this worker; no unchanged Firefox
retry, full suite, consumer matrix or GitHub CI dispatch was performed.

Install used atomic mkdir under `/tmp/sgui-install-slots` (2-slot limit).
Targeted validations used atomic mkdir under `/tmp/sgui-light-validation-slots`
(4-slot limit), Vitest maxWorkers=1. Owners used unique control-link tokens;
only matching owned slots were released, polling intervals at most 30 seconds.
The existing heavy lock and browser priority queue were read and respected;
no other owner's lock was acquired, removed or stolen. No slots/processes remain
owned by this task.

## Limits and exact follow-ups

This is a bounded rel-forwarding fix, not U-10/H-03 completion. Physical devices,
AT, real host routers, broad keyboard/disabled acceptance remain open. Link uses
native anchor attributes and exposes no owned disabled prop; aria-disabled alone
does not suppress native activation. No new disabled API or upstream public types
were manufactured in this slice.

Required focused native validation is now complete for this bounded case. The
coordinator verified the exact frozen head/digest and released source freeze;
this final report-only commit does not change the native-tested source or spec.
Final source review and integration remain coordinator-owned; no merge into dev,
main or publication was performed by this worker.

Broader source follow-up, if separately assigned: `src/adapters/Link.tsx` and
`src/adapters/navigation.test.tsx` for native mixed-case `_SELF` routing ownership;
this task did not modify the adapter. Any disabled-link API decision needs a
separate owned contract assignment rather than deriving suppression from ARIA
attributes. Shared guides/checklists/AGENTS/barrels/configs remain read-only here.
