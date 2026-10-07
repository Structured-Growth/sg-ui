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
