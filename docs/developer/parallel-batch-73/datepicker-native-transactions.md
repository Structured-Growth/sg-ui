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
synthetic input is substituted. At worker freeze, paste support was unobserved; the settled Chromium observation
is recorded below.

No independent Storybook build, browser run, full check or GitHub CI was run, per
the bounded batch instruction. Coordinator performed the fresh candidate Storybook build and Chromium admission
after read-only review (see settled evidence below). Prepared native invocation:

```sh
pnpm exec playwright test tests/browser/datepicker-native-transactions.spec.ts --project=chromium
```

Use the coordinator's allocated `SGUI_BROWSER_PORT` and matching
`SGUI_BROWSER_BASE_URL`, plus its result/report/output paths, rather than a reused
server or guessed running artifact. Firefox/WebKit checkpoint, broader clipboard behavior, physical device/assistive
technology/manual acceptance, full `pnpm check` and broad K/U gates remain pending. If the native run proves a bug in a
read-only dependency, reserve a separate correction; do not expand this batch.


## Settled coordinator wave31 evidence

On October 7, 2026, the coordinator ran the exact whole DatePicker shard on testing
candidate `1a378accd909a471e653fe4e27fe9457c9531049`. This is a shared testing candidate,
not the worker commit. Worker source/story/unit/spec freeze was
`149cae23af015e3a25d7bc67f673b9aaa3a8377e`; this final amendment changes only this
report. The candidate is not approved for whole-candidate integration.

**Chromium: 6 passed, 0 skipped, 0 unexpected, 0 flaky; no result errors.** All
six cases above passed, including both browser timezones. The spec's page-error
assertion passed for every case. Playwright reported 4.680426 seconds; the pooled
command elapsed 5.501006417 seconds, from `2026-10-07T18:31:57.690Z` to
`2026-10-07T18:32:03.191Z`. The four-session wave passed 21 cases total, of which
only six belong to this batch.

Runtime: Node `v24.19.0` at the requested Node executable, pnpm `10.29.3`,
Playwright `1.63.0`, Darwin `27.0.0`. DatePicker used pool slot2 on nondefault
port **6675**, matching origin `http://127.0.0.1:6675`. Exact selection arguments:

```text
pnpm exec playwright test (?:^|/)tests/browser/datepicker-native-transactions\.spec\.ts$ --project=chromium
```

The fresh Storybook build was produced once in the evidence root's `storybook`
directory, then shared unchanged across the four disjoint sessions. Candidate
head, source digest and build digest were identical before/after; final candidate
status was clean. Evidence records owned commands settled and no owned processes
remaining; the coordinator reports leases released. No worker rerun/build occurred.

Evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/7c82140b-3a18-4b19-aca5-9a5f0720af5f`.
Relevant evidence/logs, relative to that root:

- `evidence.json`: whole-wave command/build/runtime/immutability evidence.
- `build.log` and `types.log`: fresh build and browser TypeScript commands.
- `datepicker-native-transactions/evidence.json`: selected six cases and port.
- `datepicker-native-transactions/browser.log`: six individual passes.
- `datepicker-native-transactions/results.json`: result stats and paste attachment.
- `datepicker-native-transactions/report/index.html`: native HTML report.

Worker attribution: `/tmp/sgui-batch45-candidate-wave31-attribution.json`.
SHA-256 provenance:

| Artifact | Digest |
| --- | --- |
| Candidate source | `d693faa54cb1419030282fe955d89f92f44f941cea24db640f3c519c60ae73ce` |
| Fresh shared build | `ec6eca4336c63f839bde0508a026992dd9110b342f6072e714a5eaf6f14cde75` |
| Worker story | `cfea6cdbcbaeb9ecee332b576eaad7daa37868f7279ca9b5176ecffb68444e24` |
| Worker unit test | `1497cafa75ed858aa950f44ab2cded15f5213481ffc82bfc2d480de783ca1998` |
| Worker browser spec | `aafd60a8142736ad64e183140a184271e68e2dd11ab5650705677b48b828ca7a` |
| Native results JSON | `8af7b9c7f1d600703f52aabfe25372e4b394fa2e025c8816eb6633a588fef60d` |

### Actual native paste observation

The `native-date-paste-observation` JSON attachment records:

```json
{"events":[{"trusted":true,"plain":"02/29/2024"}],"value":"2024-02-28","ledger":"[]","supported":false}
```

Thus native keyboard Copy/Paste delivered trusted full-date text to the month
segment, but this tested Chromium/en-US field retained its previous civil date
and emitted no callback. This is an **ignored full-date paste observation**, not a
successful paste-commit or general paste-support claim. No mocked clipboard/input
was used. Other paste formats, locales, engines and devices remain unverified.
Firefox/WebKit, manual/assistive technology/device coverage and whole K/U gates
remain pending; coordinator integration is conditional on individual delta review.
