# Batch 13 — control-link (U-10/H-03)

## Review location and ownership

Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch13-control-link/sg-ui`.
Branch: `codex/batch13-control-link`; draft base: `codex/dev`.
Implementation/tested source head: `6cb5a34b2690dbbdf4f0da3c1b9f0a844357a55a`.
Draft PR: [#68](https://github.com/Structured-Growth/sg-ui/pull/68).
Final report-only commit/head is included in the coordinator handoff; no source
changes follow the tested implementation.

Exclusive write allowlist:
- `src/experimental/Link/`
- `tests/browser/batch13-control-link.spec.ts`
- `docs/developer/parallel-batch-13/control-link.md`

No other tracked paths changed; primary and other worktrees remain preserved.

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
Link tests; that is not browser evidence. Native browser result: **QUEUED / NOT
RUN**. Fresh Storybook build and focused spec execution must use the approved
browser pool after isolation review; the coordinator was notified. No Firefox
retry, heavy build, full suite, consumer matrix or GitHub CI dispatch was run.

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

Required next validation: at implementation head (plus this report-only commit),
approved pool builds fresh Storybook and runs
`pnpm exec playwright test tests/browser/batch13-control-link.spec.ts` on the
approved engines. Record exact runtime/head/counts; queued is not passed. Retain
shared lock `/tmp/sgui-parallel-batch-01-validation.lock` and yield to
`/tmp/sgui-browser-validation-priority.json` according to pool policy.

Broader source follow-up, if separately assigned: `src/adapters/Link.tsx` and
`src/adapters/navigation.test.tsx` for native mixed-case `_SELF` routing ownership;
this task did not modify the adapter. Any disabled-link API decision needs a
separate owned contract assignment rather than deriving suppression from ARIA
attributes. Shared guides/checklists/AGENTS/barrels/configs remain read-only here.
