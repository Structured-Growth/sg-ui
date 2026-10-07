# Batch 01 — translations

Assignment: H-07, H-08, H-09. Base: `9f153642e827a14033d646cf0160730c0793bdfc`.
Chat: `01a11652-134a-7610-992e-9498b718417c`.

## Reviewable slice

Owned ICU fallback now supports cardinal/ordinal plurals, select, nested branches,
exact selectors, offsets and pound substitution, with native Intl formatting and
ICU apostrophe quoting. Invalid/unsupported locales resolve deterministically to
`en-US`. Malformed/unsupported messages and invalid plural inputs retain the whole
source message without partial interpolation or render exceptions. Recursive
variable extraction and public `validateIcuVariables` cover all branches and
explicitly reject malformed/unsupported catalog syntax.

The provider preserves original host key/options/value references, namespace
requests, locale and method receiver. Lookup exceptions, unresolved keys,
missing-translation markers and non-string results receive one English fallback;
intentional empty labels and already formatted strings are preserved. Hosts own
namespace errors, diagnostics, supported languages, caching and catalogs.

English, pseudo-localized long-label and Arabic plural/direction stories use the
production Provider and controls. Forty-two colocated tests cover the formatter,
catalog validation, adapter boundary and SSR fallback.

## Files

- `src/i18n/icu.ts`
- `src/i18n/index.tsx`
- `src/i18n/icu.test.ts`
- `src/i18n/index.test.tsx`
- `src/i18n/Translations.stories.tsx`
- `docs/developer/react-aria-i18n-acceptance.md`
- This exclusive completion report.

## Review location

Worktree: `/Users/thomashall/.codex/worktrees/batch01-translations/sg-ui`.
Branch: `codex/batch01-translations`.
Implementation commit: `b12fef8c9f8d5e7d0bd931128c1f1f115735453f`.
Draft PR: [#8](https://github.com/Structured-Growth/sg-ui/pull/8), targeting
`feat/react-aria-owned-foundation-cards`, whose head matches the assigned base.
This avoids including the 31 unmerged foundation commits in the translation diff.
The report is committed separately after implementation; no merge or publication.

## Validation

- `pnpm install --frozen-lockfile`: passed; lockfile unchanged.
- `pnpm exec vitest run src/i18n`: passed, 42 tests.
- `pnpm exec tsc --noEmit`: passed.
- Documentation link targets and `git diff --check`: passed.
- `pnpm check`: passed; 145 test files / 1,010 tests, type checking,
  foundation/token guards, release-policy checks, package build and public-entry
  import/type smoke checks.
- `pnpm build-storybook`: passed, including the three new translation stories;
  Vite emitted its non-failing chunk-size warning.
- Required heavy validations serialized with the shared atomic mkdir lock.
  The first ten-minute wait expired; the second acquired the lock, recorded this
  chat ID and released its own lock via shell trap. No other worker's lock was removed.
- Runtime: Node 26.5.0 / pnpm 10.29.3. Supported Node 22.12/24 CI remains unverified
  by this local slice. No Playwright server or fixed browser port was used.

## Limits and coordinator integration

This completes a bounded translation adapter/formatter slice, not the whole H-08
component catalog. No browser visual/RTL or screen-reader result is claimed for
these new stories. Full ICU number/date styles, skeletons and rich-text formatting
remain host-engine responsibilities; validation checks variable names rather than
argument-type parity. Runtime date/time zone behavior is unchanged and host-owned.
No application catalog, supported-locale policy, caching or diagnostics was added.
Broad G/U/X/R/Z and native/device/assistive-technology gates remain open.

Coordinator should link the new acceptance document from central guidance and
record this H-07/H-08/H-09 slice without checking off broad H-08. Shared AGENTS,
master/progress documents, components, theme, package/lockfiles, public root
barrels and browser configuration/specs were untouched.

Suggested next bounded assignment: execute the three translation stories in
Chromium/Firefox/WebKit and review long-label reflow, RTL and accessible status
announcements; separately validate argument-type parity against host catalogs if
that becomes a required catalog contract.
