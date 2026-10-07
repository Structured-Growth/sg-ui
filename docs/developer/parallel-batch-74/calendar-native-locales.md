# Batch74 Calendar native locale proof candidate

Task scope: bounded K-03/K-05/K-09 evidence for `Calendar` itself. This is not
whole-K completion or manual assistive-technology acceptance. Existing range
selector browser evidence is not used as Calendar proof.

## Ownership and base

Isolated managed worktree: `batch74-calendar-native-locales/sg-ui`, created and
attached at verified dev commit `2d6f357d10b2a65bc988aba6280e69f92f3b1147`.
Only these allowlisted files changed:

- `src/experimental/Calendar/Calendar.native-locales.stories.tsx`
- `src/experimental/Calendar/Calendar.native-locales.test.tsx`
- `tests/browser/calendar-native-locales.spec.ts`
- `docs/developer/parallel-batch-74/calendar-native-locales.md`

`Calendar.tsx` remains unchanged: no demonstrated implementation regression or new
public API. DateField/reset/range, shared calendar contracts, other workers and
primary/integration checkouts remained read-only.

## Candidate behavior

The controlled fixture uses existing owned `selection="multiple"`, `months={2}`,
`firstDayOfWeek`, translation adapter and Provider APIs. It exposes selection,
focus and selection callback count separately, allowing rejection and focus-only
movement to be distinguished from a commit.

Native specs cover light and dark (10 cases total):

- Native Tab entry, Enter/Space selection and deselection of noncontiguous
  `2024-02-28` / `2024-03-02` across the two displayed Gregorian months. Arrow focus
  on leap day leaves selection/callback count unchanged. Selection is asserted on
  grid cells independently of native button focus.
- Both month headers explicitly ordered Sunday-first and Monday-first. These are
  visible-header assertions; the interaction engine hides its header row from the
  accessibility tree. Date buttons retain their localized accessible names.
- `ar-EG` localized labels and RTL scope; ArrowLeft advances the civil date and
  ArrowRight retreats. Selection callbacks still contain exact Gregorian strings.
- `en-US-u-ca-hebrew` displays Adar I / Adar II 5784 and days 19–22 of Adar I;
  keyboard activation returns exact Gregorian February 28/29 and March 2 values.
- Unavailable March 1 is focusable, disabled for activation, and produces no
  selection callback in Gregorian, Arabic and Hebrew fixtures.

Outside-month duplicate cells are scoped to the owning grid in DOM tests. No
DateRangeSelector fixture, host network service, Date object/timezone conversion,
new Calendar prop or implementation test hook is used.

## Local red/green evidence

All commands used Node `v24.19.0` via:

```sh
export PATH=/Users/thomashall/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH
```

Install held task-owned atomic install slot0 and released it after success:
`pnpm install --frozen-lockfile` passed (lockfile unchanged). Targeted checks held
atomic light slot0, released before freezing.

Initial targeted Vitest run: 3 failed / 5 passed. Failures were fixture-query
assumptions: jsdom exposes duplicated outside-month date buttons without CSS, and
role queries omit the aria-hidden visible weekday header. No Calendar regression.
Queries were corrected to owning-month scope and explicit hidden header lookup.
Final targeted run:

```sh
pnpm exec vitest run src/experimental/Calendar/Calendar.native-locales.test.tsx src/experimental/Calendar/Calendar.test.tsx
```

Passed: 2 files / 8 tests (5 new, 3 existing). Additional local checks passed:

```sh
pnpm exec tsc --noEmit
pnpm exec tsc --noEmit -p tests/browser/tsconfig.json
pnpm foundations:check
```

## Coordinator admission and native execution

Worker did not run Storybook build, browser suites, full `pnpm check`, or GitHub CI.
Coordinator owns fresh candidate build and validation after read-only admission.
The prepared targeted Chromium command (before coordinator scheduling) was:

```sh
pnpm exec playwright test tests/browser/calendar-native-locales.spec.ts --project=chromium
```

The repository config uses one worker, zero retries, its validated loopback server,
and retained failure traces/screenshots. The spec uses fixed story IDs and native
`page.keyboard.press` Tab/Arrow/Enter/Space events; it has no click-driven selection.
The settled coordinator run below supplies Chromium evidence. Firefox/WebKit
checkpoint, physical-device, full locale/calendar matrix and manual
assistive-technology output remain pending. Shared contracts and whole acceptance
gates are intentionally not marked complete.


## Settled wave31 Chromium evidence

Coordinator wave31 passed the complete Calendar shard: **10 passed, 0 skipped,
0 unexpected, 0 flaky**, with no browser runtime errors. These are the five
behaviors listed above in each of light/dark; no grep excluded a Calendar case.
Playwright reported 4.9 seconds (JSON duration 4884.726 ms); the owned command took
5728.196 ms. Session ran 2026-10-07 18:31:57.692–18:32:03.420 UTC.

Testing-only candidate head was `1a378accd909a471e653fe4e27fe9457c9531049`,
not worker prepared head `1fa72511a69d25bf0471eaef532148efd3007504`.
Candidate worktree was
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui`.
Read-only SHA-256 comparison confirmed identical worker/candidate Calendar source,
story, unit and browser spec bytes after the run:

| File | SHA-256 |
| --- | --- |
| `src/experimental/Calendar/Calendar.tsx` | `5f04728f0349af685e1a8735cc06c9370f282d58797aaa5f580f4404e35d6342` |
| `src/experimental/Calendar/Calendar.native-locales.stories.tsx` | `35e748391ed476a5d52ab50360af9a3fd11557b1c420a51f51135cba33e17f56` |
| `src/experimental/Calendar/Calendar.native-locales.test.tsx` | `82d968e025ac0fa6e7fa74d366ff070854ac8e400773c4ac94a9328f03ccda31` |
| `tests/browser/calendar-native-locales.spec.ts` | `a877e35f3f0cc5d12d0fae5b1a6ad5b7aa51f76cb41d95f6e20d96b05db6cfc9` |

Actual coordinator selection arguments were:

```sh
pnpm exec playwright test '(?:^|/)tests/browser/calendar-native-locales\.spec\.ts$' --project=chromium
```

This was session `calendar-native-locales`, pool slot3, nondefault loopback port
**6676**, using Node `v24.19.0`, pnpm `10.29.3`, Playwright `1.63.0` on Darwin
27.0.0. One worker, zero retries. Four disjoint sessions shared one fresh static
Storybook build; the complete wave had 21 passed cases, of which only these 10
belong to this batch. No worker rerun/build was performed.

Pool evidence root:
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/7c82140b-3a18-4b19-aca5-9a5f0720af5f`.
The root `evidence.json` records build/types commands and immutable final head,
source/build digests and clean final status. Calendar session `evidence.json`,
`browser.log`, and `results.json` live under its `calendar-native-locales/` directory.
Build log: root `build.log`; source/spec attribution:
`/tmp/sgui-batch45-candidate-wave31-attribution.json`; scheduling plan:
`/tmp/sgui-thirtyfirst-ready-native-plan.json`.

- Candidate source digest: `d693faa54cb1419030282fe955d89f92f44f941cea24db640f3c519c60ae73ce`
- Fresh static build digest: `ec6eca4336c63f839bde0508a026992dd9110b342f6072e714a5eaf6f14cde75`
- Lockfile digest: `786f56018e5278bc36f59b02d0c2d2ee0ab2df7fc7883178aeb4b9deb3d13438`
- Harness digest: `2a356b667f224018b0e51f1c698e5d7ae044857cbd6e1ddddae96aa786efb1d2`

Root evidence reports owned commands settled; coordinator reports leases released.
Only this unique report changed after the freeze. Integration remains an individual
coordinator review of this batch, not integration of the whole testing candidate.
Firefox/WebKit, manual assistive-technology/device and whole-K gates remain open.
