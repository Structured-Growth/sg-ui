# Batch 11 standalone field reset audit — U-18/K-06

Baseline: `d0fcc6298004ad23d1a75480b216b39142e6df96`.
Worktree: `/Users/thomashall/.codex/worktrees/batch11-standalone-form-reset/sg-ui`.
Branch: `codex/batch11-standalone-form-reset`; draft PR base: `codex/dev`.

## Evidence and changes

Existing TextField coverage restored uncontrolled values/native errors. Existing
DateField coverage restored a complete date. Neither asserted delegated prevention
or callback silence, and composite reset evidence did not exercise standalone fields.
New regressions initially failed for both complete-value prevention and controlled
callback silence. TextField also cleared displayed native validation after prevented
reset. The implementation now owns the uncontrolled value, feeds controlled values
to the interaction engine, suppresses engine reset callbacks during a capture-phase
transaction, and restores defaults after delegated prevention completes. It retains
TextField's displayed native error when reset is prevented. The transaction uses a
macrotask because browsers can checkpoint microtasks between native listeners, and
cleans pending timers on unmount. Forwarded refs remain native.

Implementation commit: `83900ba78c6cf3a5c1492a602bb5b3d79085cc67`.
Final source/test head and fresh-browser tested head:
`462be545fbaa6968dc52e856097de954a92ea8b8`.
Draft PR: [#42](https://github.com/Structured-Growth/sg-ui/pull/42).

Coverage adds controlled/uncontrolled callback silence, delegated prevention,
programmatic reset, current TextField defaults/external form association, invalid
DateField default restoration, and accepted empty-date incomplete-draft clearing.
Standalone stories and native browser cases demonstrate the changed behavior.
No public props, styles, tokens, translations, licenses, or shared reset/composite
modules changed.

## Known remaining defect and next bounded task

A temporary focused probe reproduced DateField incomplete-segment loss on prevented
reset: render an empty DateField in a form inside `onReset={event =>
event.preventDefault()}`, type `28` into the day segment, then click a native reset
button. The day segment's `aria-valuenow` becomes absent instead of retaining `28`.
The interaction engine clears its internal incomplete display before invoking the
owned callback; the callback exposes only complete ISO dates/null. Complete-value
prevention and callback suppression do not fix this private draft reset.
The probe was not retained as a passing test. Reserve a bounded DateField segment
state/reset ownership follow-up with native prevention, accepted clearing, focus,
validation and controlled-null coverage; do not reconstruct drafts from DOM text or
mutate upstream state. U-18/K-06 and broad acceptance remain open.

## Validation

Use [central development validation](../react-aria-development-validation.md).
Node 24.21.0 via `node /tmp/sgui-run24.mjs` (the wrapper prepends the installed Node24
binary to PATH before invoking pnpm). Dependencies installed with
`pnpm install --frozen-lockfile`, then verified with the Node24 wrapper.

- `pnpm exec vitest related --run src/experimental/TextField/TextField.tsx src/experimental/DateField/DateField.tsx`: passed, 33 files / 228 tests.
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`, `pnpm tokens:check`, `git diff --check`: passed.
- `pnpm build-storybook`: passed on fresh tested head `462be545fbaa6968dc52e856097de954a92ea8b8`; log `/tmp/sgui-batch11-standalone-storybook.log`.
- `pnpm exec playwright test tests/browser/batch11-standalone-reset.spec.ts --project=chromium --project=webkit`: passed, 6 tests (3 per engine); log `/tmp/sgui-batch11-standalone-browser.log`.

Heavy validation honored the priority queue, atomically acquired the shared lock
with this chat ID as owner, and released only its matching lock and first queue
entry after the suite ended. Storybook was not rebuilt during the suite. Visible
complete-date segments were asserted alongside native FormData. The final docs-only
commit does not change the tested source.

No full check/build/consumer suite or paused GitHub CI/title run was requested.
Firefox remains unverified due to the previously diagnosed local launch prerequisite;
no repeat launch/install/TMPDIR attempt. Production still requires the full matrix.
No physical-device or assistive-technology claims.

## Resumed review: live form reassociation

PR92/coordinator review held PR42 acceptance and identified a separate genuine
source gap: the reset effect depended only on the stable native ref, so changing
TextField's `form` from A to B left owned reset restoration attached to A.
The original managed directory was absent. A new managed attached worktree at
`/Users/thomashall/.codex/worktrees/batch11-standalone-form-reset-review/sg-ui`
was recreated from exact PR head `9e430312b0fc8f662dcf51800be1a8982b081cec`,
then checked out the existing `codex/batch11-standalone-form-reset` branch.
The primary checkout was untouched.

New regression tests failed before the fix for old-A reset restoration and an
old-A pending timer surviving reassociation. The helper now checks native form
association after each React commit, disposes the old binding and pending timers
only when that association changes, and cleans the current binding on unmount.
Unrelated commits keep the current pending transaction. TextField accepts changes
from native input edit events, so a stale upstream reset callback from A cannot
request a host edit or replace the owned value. The native input/ref is retained.
Tests cover A cleanup, B prevention/accepted reset, pending cancellation, controlled
host authority and continued native editing. The live-association story and browser
case were added for the coordinator's queued native rerun.

Node24 targeted validation used `/tmp/sgui-batch11-review-slotted.py`, which
atomically leases one of four `/tmp/sgui-light-validation-slots` around each command
and invokes `node /tmp/sgui-run24.mjs`:

- `pnpm exec vitest related --run src/experimental/TextField/TextField.tsx src/experimental/DateField/DateField.tsx`: 33 files / 231 tests passed.
- `pnpm typecheck`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`, `pnpm tokens:check`, `git diff --check`: passed.

Dependencies were installed with Node24 `pnpm install --frozen-lockfile` in the
recreated worktree. That short install preceded discovery of the current install
slot wrapper; all validation commands used light slots. No standalone heavy build
or browser process ran for this follow-up. Earlier six-browser-case evidence
belongs to `462be54`, not this new follow-up. The current reassociation spec needs
the coordinator's fresh-build queued native execution. The incomplete DateField
segment draft defect above remains a hold; complete-date evidence does not certify
that case or close U-18/K-06.
