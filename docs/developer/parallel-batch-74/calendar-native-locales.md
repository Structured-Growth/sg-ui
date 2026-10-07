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

## Coordinator admission and pending native checks

Worker did not run Storybook build, browser suites, full `pnpm check`, or GitHub CI.
Coordinator owns fresh candidate build and validation after read-only admission.
After the single fresh static Storybook build, exact targeted Chromium args are:

```sh
pnpm exec playwright test tests/browser/calendar-native-locales.spec.ts --project=chromium
```

The repository config uses one worker, zero retries, its validated loopback server,
and retained failure traces/screenshots. The spec uses fixed story IDs and native
`page.keyboard.press` Tab/Arrow/Enter/Space events; it has no click-driven selection.
Do not rebuild Storybook during the suite. Chromium execution is pending, not
claimed green. Firefox/WebKit checkpoint, physical-device, full locale/calendar
matrix and manual assistive-technology output remain pending. Shared contracts and
whole acceptance gates are intentionally not marked complete.
