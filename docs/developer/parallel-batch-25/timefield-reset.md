# Batch 25: TimeField reset ownership

Bounded U-18/K-07/X-04 follow-up. Broad K/U/X/R/Z, native/device and
assistive-technology acceptance remain open.

## Exact baseline and scope

- Reviewed baseline: `28d3931aee25413f3f147be7088c634dee53a664`.
- Attached managed worktree:
  `/Users/thomashall/.codex/worktrees/batch25-timefield-reset/sg-ui`.
- Branch: `codex/batch25-timefield-reset`.
- Immutable RED fixture head: `3c4962855e9ac002449247b08f4bf76a21ff012f`.
  Its TimeField implementation is byte-identical to the reviewed baseline;
  only retained tests, stories and the unique browser spec are added.
- Immutable implementation/spec/story head:
  `d47a3b2fdc049f002e4104a143ddaa3013228d7f`.
- Final evidence commit is reported separately; it changes only this report.
- Exclusive changed files: `src/experimental/TimeField/TimeField.tsx`,
  `TimeField.test.tsx`, `TimeField.stories.tsx` in the same directory,
  `tests/browser/batch25-timefield-reset.spec.ts`, and this report.

Read the existing c90e4def batch13 source/report and batch16 reset holds,
batch24 throughput audit, and the separately owned batch20 DateField lower-hook
implementation/spec. The baseline already includes lower-hook dependencies and
guards. Shared helpers, DateField, dependencies, config, central guidance and the
primary image-upload checkout are unchanged.

## Reproduced defects and implementation

Retained jsdom regressions reproduce five failures against exact baseline source:
prevented uncontrolled partial reset, prevented controlled-null partial reset,
prevented complete reset, unwanted controlled reset callback, and accepted reset
to a changed default. The initial run had four failures/seven existing passes;
the final targeted RED run had five failures/ten skips, exit 1.

TimeField now owns its complete clock state and delegates segment interactions
and native form/validation semantics to public `useTimeFieldState`, `useTimeField`
and `useDateSegment` hooks. The field-hook state facade ignores engine reset
value/validation setters; the existing standalone form helper waits until
host-delegated cancellation has settled. A prevented reset leaves engine partial
segments and displayed validation untouched. Acceptance calls the real engine
setter and resets submitted validation, suppressing edit callbacks and retaining
the latest controlled host value or latest uncontrolled default. Explicit null
clears incomplete engine display even when the complete value was already null.

No DOM draft reconstruction, private engine imports or new public props were
introduced. The engine's internal calendar carrier is converted back to a local
Time for callbacks/FormData; the contract remains HH:mm:ss without date/timezone.
Existing invalid-default feedback, refs, German read-only behavior, disabled
omission and segment wrapping tests remain. Added coverage verifies required
validation/focus, stable partial drafts through host rerenders, and 12-hour
period/description/boundary behavior. Typing two digits in the final segment
normally emits two complete edit values; the once-only completion assertion uses
one digit rather than changing that existing edit behavior.

## Local validation

Node 24 through `/tmp/sgui-run24.mjs`, pnpm 10.29.3, locked React 19.2.3.
Each command acquired an atomic global install slot (2 slots) or light slot
(4 slots), releasing only its owner token in finally. Wrapper:
`/tmp/sgui-batch25-timefield-slotted.py`.

- Frozen-lockfile install: passed; no manifest/lockfile change.
  Log `/tmp/sgui-b25-install.log`.
- Exact-baseline RED with final retained tests: five failures/ten skips, exit 1.
  Log `/tmp/sgui-b25-red-final.log`; source restored in finally.
- Final TimeField + read-only DateField/TextField related run: 3 files,
  35 tests passed. Log `/tmp/sgui-b25-composed.log`.
- `pnpm typecheck`: passed, `/tmp/sgui-b25-types.log`.
- Browser TypeScript: passed, `/tmp/sgui-b25-browser-types.log`.
- Foundation boundaries: passed, `/tmp/sgui-b25-guards.log`.
- Foundation guard/token/CSS tests: 9 passed,
  `/tmp/sgui-b25-foundation-tests.log`.
- Token generation consistency: passed, `/tmp/sgui-b25-tokens.log`.
- `git diff --check`: passed.

## Coordinator-owned native and heavy validation

The worker launched no browser, server, build, native session, CI, merge, push,
publication or manual acceptance. Fresh Storybook and targeted native validation
are coordinator-owned. The human's targeted validation policy does not require
per-task `pnpm check`; a full check is not an acceptance prerequisite. Native RED
is not claimed and the coordinator does not request an additional RED browser
build unless a new diagnostic warrants it. Unit/jsdom evidence is not native
acceptance.

The four retained native cases are prepared for Chromium first:

```sh
pnpm test:browser tests/browser/batch25-timefield-reset.spec.ts --project=chromium
```

The RED head remains preserved for diagnostics. Run the selected GREEN head in
an immutable snapshot; never replace source or rebuild while a suite runs. Assertions cover partial/uncontrolled
and controlled-null clocks, submitted required validation, delegated prevention,
button/programmatic reset, FormData, callback counts, latest defaults and native
focus. GREEN should also include existing `batch13-control-timefield.spec.ts`
for migrated rendering parity. Firefox/WebKit run at the coordinator's checkpoint
(after ten native behavior integrations or the daily first checkpoint).
Physical devices, IME/paste/autofill, broader locale/AT and form-tree reassociation
are not certified by this bounded evidence. TimeField has no public form prop;
no shared helper reassociation contract was changed.


## First coordinator native run and driver correction

The released coordinator pool token `0de69d01-c339-4d90-9d5e-6ed73ebb7fcd`
records clean head `19a72ca85ca99b6c632cc99e9cedb94f08d57940`, Node 24.21.0,
a successful fresh Storybook build, unchanged initial/final build digest, and
seven selected Chromium cases. Final `browser.log` records **four failures and
three passes** (the initial coordinator preview described three failures).
The three existing batch13 parity cases passed. All four new batch25 cases
reached `locator.uncheck()` on the visually hidden policy Checkbox input and
timed out because the visible decorative indicator intercepted pointer events.
The preserved contexts/snapshots establish the preceding prevention/host-state
assertions were reached; later accepted-reset assertions were not proved.
These failures identify a test driver target problem, not four TimeField product
defects or a browser-capacity failure.

Local immutable failure evidence is retained under
`artifacts/browser-pool/0de69d01-c339-4d90-9d5e-6ed73ebb7fcd/`:
`evidence.json`, `results.json`, `browser.log`, report and per-case traces,
screenshots and `error-context.md`. These ignored files are local evidence;
no claim is made that they are checked-in or Actions artifacts.

After the coordinator released the pool, spec-only correction commit
`c11c8770b0817b5860379ed0ecd9fdf7127132e9` uses a real click on the visible
associated `Prevent clock reset` label, with checked/unchecked assertions
before/after. No force click, synthetic event, DOM state mutation, fixture hiding
or weakened TimeField assertion is used. Source and stories are byte-unchanged
from the initially tested head. Browser TypeScript and foundation boundaries
passed under light slots, with logs `/tmp/sgui-b25-label-browser-types.log` and
`/tmp/sgui-b25-label-guards.log`; diff whitespace passed. Only spec/report changed.
Corrected native acceptance is pending the coordinator's seven-case selection:

```sh
pnpm test:browser tests/browser/batch25-timefield-reset.spec.ts tests/browser/batch13-control-timefield.spec.ts --project=chromium
```
