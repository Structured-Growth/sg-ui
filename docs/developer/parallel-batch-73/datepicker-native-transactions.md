# Batch73: DatePicker native field/calendar transactions

Tasks: K-07/U-18, bounded evidence only. Base verified as
`2d6f357d10b2a65bc988aba6280e69f92f3b1147` before creating the managed worktree
`/Users/thomashall/.codex/worktrees/batch73-datepicker-native-transactions/sg-ui`.
Primary/integration and other worker checkouts were not edited.

## Ownership and implementation

Changed only the owned allowlist paths:

- `src/experimental/DatePicker/DatePicker.native-transactions.stories.tsx`
- `src/experimental/DatePicker/DatePicker.native-transactions.test.tsx`
- `tests/browser/datepicker-native-transactions.spec.ts`
- `docs/developer/parallel-batch-73/datepicker-native-transactions.md`

`DatePicker.tsx` is unchanged: no meaningful new implementation regression was
demonstrated. DateField, Calendar, shared reset code and shared documentation stayed
read-only. Existing reset/synchronization tests were retained without duplication.

Three Storybook fixtures use the production global Provider and locale. They expose
a host callback ledger and native form submission result, with empty required,
uncontrolled populated and controlled rejecting-host variants. Only successful
native submit is prevented to display FormData; no reset, segment-input or paste
event is manufactured. Diagnostic strings are fixture-owned, not library messages.

## Regression evidence

New jsdom coverage establishes partial segment isolation, a complete typed leap
day and reopened selected calendar, cross-month calendar commit to field segments,
and controlled host rejection of both field and calendar requests.

Initial run: 3 tests failed due to test assumptions, not a proven source bug:

- Entering `2024` into the last missing year segment emits complete
  `0020-02-29` before `2024-02-29`.
- Replacing populated day `28` with `29` emits `2024-02-02` before
  `2024-02-29`.
- Selected calendar button names include selection text; `aria-selected` belongs
  to the containing gridcell.

After correcting those assertions, the focused new and existing DatePicker suites
passed **8/8 tests, 2/2 files**. This is test red-to-green only; no implementation
red-to-green claim is made. Immediate complete civil callbacks remain unchanged,
including complete dates outside the permitted booking window. Native validation
determines whether such a value can submit.

## Local validation

All commands used Node 24 via
`PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH`.

- `pnpm install --frozen-lockfile`: passed, no manifest/lock edits; install slot1.
- `pnpm exec vitest run src/experimental/DatePicker/DatePicker.native-transactions.test.tsx src/experimental/DatePicker/DatePicker.test.tsx`: 8/8 passed.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `git diff --check`: passed.

Light checks held atomically acquired light slot0; both acquired slots were
released by this task owner. No occupied slot was stolen.

## Native admission and remaining limits

The frozen browser spec contains six tests per browser: partial draft through blur
and required form validation/correction; complete out-of-window edit and blocked
submission; leap-day keyboard edit through submission/reopened calendar and
keyboard cross-month commit in Chicago and Tokyo; controlled host rejection; and
native paste observation. Focus is explicitly placed on the selected calendar
cell before arrow/activation; no automatic calendar focus-placement claim is made.

The paste case uses native keyboard Copy from a read-only textbox followed by
native Paste into the month segment. It records trusted paste event/plain data,
actual FormData and callback ledger in `native-date-paste-observation`. It classifies
acceptance only if the complete civil date and callback agree; ignored paste must
preserve the existing civil value. No ClipboardEvent mock, engine setter or
synthetic input is substituted. **Paste support has not been observed yet.**

No independent Storybook build, browser run, full check or GitHub CI was run, per
the bounded batch instruction. Coordinator owns a fresh candidate Storybook build
and Chromium admission after read-only review. Intended native invocation against
that fresh candidate:

```sh
pnpm exec playwright test tests/browser/datepicker-native-transactions.spec.ts --project=chromium
```

Use the coordinator's allocated `SGUI_BROWSER_PORT` and matching
`SGUI_BROWSER_BASE_URL`, plus its result/report/output paths, rather than a reused
server or guessed running artifact. Firefox/WebKit checkpoint, clipboard behavior,
physical device/assistive technology/manual acceptance, `pnpm check`, Storybook
build and broad K/U gates remain pending. If the native run proves a bug in a
read-only dependency, reserve a separate correction; do not expand this batch.
