# Batch 05 — due-date formatting

Task slice: H-12 formatter roundtrip/fallback and temporal/localization boundaries.
Chat: `01a11673-d2b3-76a0-9fc3-3d33770c2276`.
Exact clean baseline verified before edits:
`cca9452f384d5ffaa34ad5bd4ddd015b43a2870b`.
Read root `AGENTS.md` and the
[targeted development validation policy](../react-aria-development-validation.md).
No architecture or public API change.

## Review location and commits

One managed worktree was created and attached:
`/Users/thomashall/.codex/worktrees/batch05-due-date/sg-ui`.
Branch: `codex/batch05-due-date`. Primary and other checkouts were preserved.
Implementation/final tested code commit:
`4529de0ccefc11ebed799a8480477baf5e931324`.
This report is the separate final documentation commit; its exact hash is sent
to the coordinator after commit and available as the branch/PR head.
Draft PR: [#20](https://github.com/Structured-Growth/sg-ui/pull/20), targeting
`codex/dev`, attached to this chat. No merge or publication.

## Change and evidence

Malformed/empty locale input previously threw `RangeError`. Unsupported locales
previously inherited the runtime locale: with `LANG=de_DE.UTF-8` and
`LC_ALL=de_DE.UTF-8`, Node resolves its default to `de-DE` and formats `zz-ZZ`
January 1 as `1. Jan.`. The owned helper now canonicalizes supported locales and
uses explicit `en-US` for malformed/empty/unsupported ones. Supported German and
Arabic formatting, callback keys/default messages/primitive values, native input
parsing and elapsed/local-calendar rules remain intact.

Tests add exact midnight/deadline/minute/hour thresholds, month/year/leap day,
23/25-hour calendar tomorrow, spring gap and fall repeated hour, day/week
thresholds, Date/ISO JSON/epoch/equivalent-offset roundtrip and nonmutation,
missing/invalid due input and fake-clock invalid reference fallback. The public
card re-export remains identical to the shared helper and retains JSON/fallback
behavior. An existing tomorrow test assumed UTC; its fixture now states local
calendar intent and passes UTC+14. The weak current-time test was replaced with
exact fake-clock assertions.

Changed files, all within the exclusive allowlist:

- `src/utils/formatDueDateLabel.ts`
- `src/utils/formatDueDateLabel.test.ts`
- `src/components/LearnerClassCard/formatDueDateLabel.test.ts`
- `docs/developer/react-aria-due-date-acceptance.md`
- This completion report.

The re-export implementation, card/API/translation modules and stories were not
edited. Existing stories cover relative/absolute due labels; supported-locale
visual behavior and props are unchanged. The locale-fallback regression is
covered by pure helper tests.

## Validation

Runtime: Node `24.21.0`, pnpm `10.29.3`, Vitest `4.1.11`.
Each command below used this exact PATH prefix:

```sh
PATH=/Users/thomashall/Library/pnpm/store/v11/links/@/node/24.21.0/8e3363dcf6f5ccdfdbb0a5b55fe716a72499ddb103e848ba9405f4e34d178319/node_modules/node/bin:$PATH
```

- `pnpm install --frozen-lockfile`: passed, lockfile unchanged; pnpm reported
  ignored esbuild lifecycle script, which did not prevent targeted validation.
- Pre-fix `TZ=America/New_York pnpm exec vitest run src/utils/formatDueDateLabel.test.ts src/components/LearnerClassCard/formatDueDateLabel.test.ts`:
  2 expected failures from malformed/empty locale, 43 passes. Unsupported-locale
  machine-default evidence was verified separately with native Intl under German
  locale. A temporary constructor spy introduced test-only failures; it was
  removed in favor of actual German-runtime validation.
- On final code commit `4529de0ccefc11ebed799a8480477baf5e931324`, each command below
  passed 5 files / 59 tests, including learner-card and learner-grid compositions:

```sh
LANG=de_DE.UTF-8 LC_ALL=de_DE.UTF-8 TZ=UTC pnpm exec vitest related --run src/utils/formatDueDateLabel.ts src/components/LearnerClassCard/formatDueDateLabel.ts
LANG=de_DE.UTF-8 LC_ALL=de_DE.UTF-8 TZ=America/New_York pnpm exec vitest related --run src/utils/formatDueDateLabel.ts src/components/LearnerClassCard/formatDueDateLabel.ts
LANG=de_DE.UTF-8 LC_ALL=de_DE.UTF-8 TZ=Asia/Kathmandu pnpm exec vitest related --run src/utils/formatDueDateLabel.ts src/components/LearnerClassCard/formatDueDateLabel.ts
LANG=de_DE.UTF-8 LC_ALL=de_DE.UTF-8 TZ=Pacific/Kiritimati pnpm exec vitest related --run src/utils/formatDueDateLabel.ts src/components/LearnerClassCard/formatDueDateLabel.ts
```

- `pnpm typecheck`: passed at that commit.
- `pnpm foundations:check`: owned import/layer/token guards passed at that commit.
- `git diff --check` and the new Markdown relative-link targets: passed.
- No full `pnpm check`, Storybook, browser, packed-consumer or heavy process was
  run. This pure formatter slice requires no native browser timing. Lightweight
  unit/type/guard runs did not acquire or alter the shared heavy/browser lock.

## Limits, next bounded task and central guidance

The helper still uses execution-local timezone; input offsets identify instants,
and locale does not set timezone. Cross-timezone SSR/hydration must be coordinated
by the host. Native `Date` parsing is deliberately preserved, including date-only
string behavior. The host adapter still owns failed/missing translation lookups.
Browser ICU differences, physical devices, assistive technology and Firefox were
not tested by this slice. No broad acceptance gate is automatically closed.

Proposed next bounded task: audit LearnerClassCard's translated due-label
composition across provider replacement and consistent-reference SSR/hydration;
add targeted composition/browser evidence only for demonstrated gaps. That task
requires a separate card/story/browser allowlist and explicit timezone contract
before any timezone API expansion.

Coordinator guidance update: link the
[due-date acceptance record](../react-aria-due-date-acceptance.md) from the relevant
card/translation entry documentation and record this H-12 evidence in central
progress/task guidance. Central files remain coordinator-owned; do not infer
whole H/G/K/E/U/X/R/Z acceptance from this worker report.
