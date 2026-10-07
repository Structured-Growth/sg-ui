# Batch 137: controlled range reset locator correction

Task scope: bounded K-17 controlled DateRangePicker transaction evidence, based on
parent `60df360355082b5fac9fad30357e45ccbcab9fd2`. This correction changes only the
endpoint locator in the existing native form-reset browser case. See the
[calendar contract](../react-aria-calendar-contracts.md#selection-and-drafts) and
[browser case](../../../tests/browser/range-picker-controlled-transactions.spec.ts).

## Retained actual evidence

Coordinator-owned Chromium execution started at `2026-10-07T21:52:36.012Z`;
results report two expected passes, one unexpected failure, zero skipped tests,
zero flaky tests and no suite-level errors. The retained evidence manifest records
build digest `f0ca5109991ffb3da6faa8d9a0ee946639dc4a3522660366e1494c113df966d1`.

All paths below refer to the existing coordinator checkout; this task read them
without changing or copying the artifacts:

- [Results JSON](/Users/thomashall/.codex/worktrees/shared-native-reviewed-87-121/sg-ui/artifacts/browser-pool/cc560449-dab9-4153-8aeb-09a71f87e3f6/range-controlled/results.json)
- [Evidence manifest](/Users/thomashall/.codex/worktrees/shared-native-reviewed-87-121/sg-ui/artifacts/browser-pool/cc560449-dab9-4153-8aeb-09a71f87e3f6/range-controlled/evidence.json)
- [HTML report](/Users/thomashall/.codex/worktrees/shared-native-reviewed-87-121/sg-ui/artifacts/browser-pool/cc560449-dab9-4153-8aeb-09a71f87e3f6/range-controlled/report/index.html)
- [Failure context](/Users/thomashall/.codex/worktrees/shared-native-reviewed-87-121/sg-ui/artifacts/browser-pool/cc560449-dab9-4153-8aeb-09a71f87e3f6/range-controlled/traces/range-picker-controlled-tr-63a45-oses-without-stale-requests-chromium/error-context.md)
- [Native trace](/Users/thomashall/.codex/worktrees/shared-native-reviewed-87-121/sg-ui/artifacts/browser-pool/cc560449-dab9-4153-8aeb-09a71f87e3f6/range-controlled/traces/range-picker-controlled-tr-63a45-oses-without-stale-requests-chromium/trace.zip)

| Existing case | Actual Chromium result |
| --- | --- |
| rejected Apply requests once while submitted endpoints and reopened draft follow the host; accepted Apply commits | Passed, 1822 ms |
| changed host endpoints while calendar focus stays inside invalidate draft and pending anchor | Passed, 790 ms |
| real form.reset while calendar remains focused preserves prevented preview, then closes without stale requests | Failed, 661 ms, strict locator ambiguity at original line 111 |

The first two cases and their shared preview helper are unchanged. Their green
evidence is retained; no duplicate tests are added.

## Failure and scoped correction

After completing the pending range, both endpoint accessible names contain the
range summary. The actual failure lists:

```text
Selected Range: Wednesday, February 28 to Friday, March 1, 2024, Wednesday, February 28, 2024 selected
Selected Range: Wednesday, February 28 to Friday, March 1, 2024, Friday, March 1, 2024 selected
```

The original unanchored `/Friday, March 1, 2024/` therefore resolves to both cells.
The trace and context show the March 1 endpoint is active; this failure does not
establish a lost-focus regression. The new matcher
`/(?:^|, )Friday, March 1, 2024(?: selected)?$/` identifies the cell's own date at
the end of its accessible name, both during preview and after completed selection.
It excludes the February 28 endpoint despite the shared range summary. The
outside-month exclusion remains in place. Full localized labels and production
calendar behavior are unchanged; the fixture explicitly requests `en-US`.

## Native transaction and request trace retained

Read-only inspection of `test.trace` and `1-trace.trace` confirms the failed run
reached the calendar through trigger activation, Escape, Enter and native Tab
navigation, then established the anchor with Enter and extended it with ArrowRight.
The native `form.reset()` ran while the endpoint retained focus. Assertions passed
for prevention ledger `[true]`, unchanged preview, original draft and submitted
endpoints, and disabled Apply. Enter completed the retained range; the draft became
`2024-02-28 – 2024-03-01`, preview disappeared and the entire request ledger was
`[]`. Alt+P disabled prevention before the ambiguous focus assertion failed.

The remaining existing assertions are preserved: native Enter/ArrowRight starts
another preview, a second real `form.reset()` records `[true,false]`, closes the
dialog, restores trigger focus and keeps original submitted endpoints and an empty
request ledger. Reopening must clear preview, restore the host draft and enable
Apply while the entire ledger remains `[]`. These post-failure steps were **not
reached in the retained run** and require fresh coordinator proof.

## Validation boundary and next selection

Source/contracts, retained results/context/trace and the scoped diff were reviewed.
No install, build, typecheck, test, browser, performance, global-lease or CI command
was run by this successor, as explicitly requested. The correction is not claimed
to have passed native execution. Root alone integrates and accepts it.

Limit the next fresh Chromium selection to this existing failed case in
`tests/browser/range-picker-controlled-transactions.spec.ts`, using the exact title
`real form.reset while calendar remains focused preserves prevented preview, then closes without stale requests`.
Retain the other two green results; do not rerun or duplicate them for this bounded
correction. Broad K-17/device/assistive-technology acceptance remains open.
