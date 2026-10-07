# Batch 13 control-tooltip evidence

U-08/X-04: bounded trigger replacement/unmount cleanup, independent portal scopes,
keyboard descriptions and the native disabled-trigger contract. Broad gates remain open.

## Checkout and ownership

- Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Created and attached one managed isolated worktree before edits:
  `/Users/thomashall/.codex/worktrees/batch13-control-tooltip/sg-ui`.
- Branch: `codex/batch13-control-tooltip`.
- Draft PR base `codex/dev`: [#82](https://github.com/Structured-Growth/sg-ui/pull/82).
- Exclusive writes: `src/experimental/Tooltip/`,
  `tests/browser/batch13-control-tooltip.spec.ts`, and this report.
- Owner token: `01a116b0-de67-7b53-adbc-fd67abbbc9e6`.

## Review and demonstrated defects

Existing `Tooltip.test.tsx` already covers immediate keyboard description, Escape
without focus loss, pointer hover/leave, nested theme/density/direction/language/token
inheritance and tooltip-level disabling. The remaining-controls contract already
requires an owned named button and supplementary plain text. No scope/style or
public API migration was needed. Batch 05 portal direction evidence concerns
Menu/Popover; Tooltip already preserves explicit visual direction.

A new regression on the exact baseline showed an open tooltip and its
`aria-describedby` transferred to an unfocused replacement button when the host
changed the trigger's React key (5 passed/1 failed after correcting a test's scope
identity). The initial exploratory scope test accidentally reused React identity;
adding distinct scope keys made existing independent-scope/unmount behavior pass.

After keyed state isolation, a separate cold-warmup regression demonstrated a
pending hover delivering `onOpenChange(true)` from a detached trigger. The final
implementation gives each trigger key an internal lifetime and suppresses callbacks
from detached lifetimes. Ordinary same-key content updates preserve native trigger
and overlay identity/focus. Controlled `open` remains authoritative; `defaultOpen`
applies to each new lifetime. Hosts must change the trigger key when replacing its
action identity. No wrapper focus stop, new translated library strings or upstream
public types were introduced.

Pending-hover coverage runs in a separate Vitest file to isolate React Aria's shared
hover warmup, and includes Strict Mode. An exploratory fake-timer test timed out;
a combined real-timer test had an invalid cold-warmup precondition. The isolated
regression confirmed the actual late-callback defect before the callback guard.
These exploratory attempts are not counted as successful evidence.

The guard invalidates host notifications and the keyed lifetime removes descriptions,
refs and mounted portals. It does not replace React Aria's internal global warmup
scheduler or promise underlying timer cancellation. Interactive help remains Popover.

## Commits

- `39b2c1c38d867d4c280435ea5860dc7201265c7f`: implementation, regressions, story and native cases.
- `1ccc2cf`: remove a trailing test-file blank line found by the diff check.
- Final Strict Mode test/report commit follows; its SHA is recorded in the coordinator handoff.

## Local validation

Install: `pnpm install --frozen-lockfile`, host Node 26.5.0/pnpm 10.29.3, passed with
no tracked dependency changes. Atomic install slot1 held this owner token and was
released by its own shell finally/trap; occupied slot0 was left alone.

Checks use bundled Node **24.19.0**, pnpm **10.29.3** via
`PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`.

- Baseline `pnpm exec vitest run src/experimental/Tooltip/Tooltip.test.tsx --maxWorkers=1`:
  5 passed/1 failed, stale replacement description.
- After keyed isolation, `pnpm exec vitest run src/experimental/Tooltip/Tooltip.lifetime.test.tsx --maxWorkers=1`:
  1 failed, detached pending callback.
- Final `pnpm exec vitest run src/experimental/Tooltip --maxWorkers=1`:
  **2 files/9 tests passed**, including Strict Mode pending lifetime checks.
- `pnpm typecheck`: passed after runtime changes.
- `pnpm foundations:check`: passed after runtime changes.
- `pnpm tokens:check`: passed; no token/style edits.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- Final `git diff b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818 --check`: passed.

Vitest used one atomically acquired slot from `/tmp/sgui-light-validation-slots/slot0..slot3`,
with maxWorkers1 and this owner token. Occupied attempts queued (exit75), never
counted as a pass. Owner-checked finally/traps released only this worker's slot.
Logs: `/tmp/sgui-batch13-tooltip-baseline-final.log`,
`/tmp/sgui-batch13-tooltip-pending-baseline.log`, `/tmp/sgui-batch13-tooltip-final.log`.

## Native evidence

Pending shared priority queue and global lock; this section will be updated after
a fresh Storybook build and focused browser execution. No jsdom result establishes
native timing, positioning, focus or assistive-technology acceptance.

## Limits and follow-up scope

No full `pnpm check`, broad browser matrix, packed consumer, React 18 runtime,
manual/device/assistive-technology checks, CI rerun/dispatch or gate closure.
Firefox's known launch prerequisite will not be repeatedly retried unchanged.
No edits outside the allowlist; no dependencies, licensing, workflow permissions,
secrets, releases, main changes or merges.

Coordinator-owned guidance follow-up: link this evidence and state that a trigger
key identifies a new tooltip action lifetime; unmount/replacement invalidates late
notifications without requesting host controlled-state changes. Reserve central
AGENTS/master/progress/contract edits for integration. Broader nested dialog tooltip
dismissal ordering and spoken descriptions remain separate acceptance tasks.

## Authorized checkout recovery and common prerequisite

The original attached checkout disappeared before pool bootstrap; its directory was
missing and `git worktree list` had no Tooltip registration. Both local and pushed
`codex/batch13-control-tooltip` retained exact source head
`d264c5715cf9aa3f6acb10db3635843c39f0f560`. No primary edits, metadata cleanup,
pruning or independent replacement happened before explicit recovery authorization.

The managed API recovered that exact clean commit under the requested original
name, allocating and attaching
`/Users/thomashall/.codex/worktrees/batch13-control-tooltip-3440/sg-ui`.
This is the authorized missing-checkout exception; the original source branch and
history were preserved. The old attachment identity remains historical.

A normal conflict-free full-ancestry merge of reviewed browser-pool commit
`6b9da4423f1e6675c37571d5552474da25e90258` produced
`9470f80131c4e9a1d78424448b88c71c8ccd5052`. Its six unchanged harness/documentation
files are an explicitly authorized common prerequisite, separate from this task's
exclusive source writes. No copied harness, graft, ours strategy or config edits.
No behavior conflict resolution occurred, so no additional lightweight suite was
required. The coordinator owns fresh builds/browser execution; this worker runs no
build, server or browser while frozen. Firefox/manual evidence remains unverified.

Additional task commits before bootstrap: `7fa4bb6c8486fbed8b83c701e922951bd0eed5d1`
records Strict Mode evidence; `7c9e156` and `d264c5715cf9aa3f6acb10db3635843c39f0f560`
make browser focus checks enter keyboard modality explicitly. Recovery documentation
is committed after the prerequisite merge; the exact clean frozen head is sent to
the coordinator and preserved for its pool evidence.
