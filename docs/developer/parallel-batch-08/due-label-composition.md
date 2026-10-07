# Batch 08 — LearnerClassCard due-label composition

Bounded M-15/H-12 slice. Chat: `01a1167a-e64f-7ff2-83b9-8cd88b6f25de`.
Clean baseline verified before edits: `d77132097bbe495b11c9fd9e2a4f047a1f03140d`.
One managed attached isolated worktree:
`/Users/thomashall/.codex/worktrees/batch08-due-label-composition/sg-ui`.
Branch: `codex/batch08-due-label-composition`.
Draft PR: [#24](https://github.com/Structured-Growth/sg-ui/pull/24), base `codex/dev`.
Primary and other worktrees preserved; no merge/publication.

Implementation and final tested code head:
`c7db18d4913ea8f7e9ab6ada0de584082ed00d0f`.
The final head includes a separate report-only commit; its exact hash is sent in
the authorized completion message and available as the branch/PR head.

## Audit and changes

Read root `AGENTS.md`, the [development validation policy](../react-aria-development-validation.md),
the integrated [batch05 report](../parallel-batch-05/due-date.md) and
[due-date acceptance contract](../react-aria-due-date-acceptance.md).
Existing tests covered formatter boundaries, fallback and helper identity, plus
card progress/navigation/translation values. They did not exercise due-label
provider replacement or due-label SSR/hydration. Inspection and new passing tests
found no bounded production defect; the card already recomputes from current
provider locale and translator on every render.

Changed files (exclusive allowlist only):

- `src/components/LearnerClassCard/LearnerClassCard.due-label.test.tsx`
- `docs/developer/parallel-batch-08/due-label-composition.md` (this report)

Twelve new composition cases cover:

- Independent locale and translator replacement with retained card heading node,
  namespaced keys/default messages and primitive date/time/count values.
- Malformed, empty and unsupported locale fallback to explicit English date/time
  even with German runtime default and failed host lookup.
- Invalid due Date/string fallback, translated unavailable-label replacement and
  restoration of provider-free fallback.
- Server Date to JSON/ISO client due instant with a restored reference Date,
  en-US/de-DE/ar-EG/malformed locales, zero recoverable hydration errors and
  translator replacement after hydration.
- Invalid due and invalid reference hydration through missing-translation fallback,
  with the same declared fake clock on server/client; invalid reference uses that
  current clock rather than falsely reporting an invalid due date.

No runtime, props, styles, public names, shared utils/i18n/grid or timezone API
changed. Existing stories remain valid because no behavior/prop changed; no new
native timing/focus/positioning gap required a browser spec or fresh Storybook.

## Validation

Node `24.21.0`, pnpm `10.29.3`, Vitest `4.1.11`, React `19.2.3`.
Every command used this PATH prefix:

```sh
PATH=/Users/thomashall/Library/pnpm/store/v11/links/@/node/24.21.0/8e3363dcf6f5ccdfdbb0a5b55fe716a72499ddb103e848ba9405f4e34d178319/node_modules/node/bin:$PATH
```

`pnpm install --frozen-lockfile` passed; lockfile unchanged. The ignored esbuild
lifecycle warning did not prevent targeted validation.
On tested code head `c7db18d4913ea8f7e9ab6ada0de584082ed00d0f`, all passed:

```sh
LANG=de_DE.UTF-8 LC_ALL=de_DE.UTF-8 TZ=UTC pnpm exec vitest run src/components/LearnerClassCard
LANG=de_DE.UTF-8 LC_ALL=de_DE.UTF-8 TZ=America/New_York pnpm exec vitest run src/components/LearnerClassCard
LANG=de_DE.UTF-8 LC_ALL=de_DE.UTF-8 TZ=Pacific/Kiritimati pnpm exec vitest run src/components/LearnerClassCard
pnpm typecheck
pnpm foundations:check
git diff --check
```

Each focused test run passed 3 files / 17 tests. Typechecking and owned
import/layer/token guards passed. Report links resolve. These lightweight checks
ran without acquiring/altering the shared heavy-validation lock. No full suite,
Storybook, browser engine, server, packed consumer or heavy process was run.

## Host contract and limitations

The same reference instant and execution timezone are prerequisites for the
SSR/hydration evidence here. Locale changes formatting conventions, not timezone;
input offsets identify instants, not display timezone. The host must coordinate
server/browser timezone and serialize/restore its reference clock. Invalid or
absent reference time falls back to the execution clock; this test freezes both
sides and does not establish parity for real independently advancing clocks.
A calendar boundary, different local timezones or differing ICU output can change
labels and produce hydration mismatches. This batch introduces no guarantee for
those mismatches and does not suppress them.

jsdom hydration with Node Intl does not verify browser Intl/ICU differences,
React 18 packed hydration, physical devices or assistive technology. Firefox
launch diagnosis remains separately assigned; no reinstall/TMPDIR retry or engine
requirement reduction occurred. Broad M/H/G/U/X/R/Z acceptance remains open.

Next bounded task: browser-engine ICU due-label parity using a fresh, fixed-clock
story in a declared browser timezone once shared browser validation is scheduled;
retain the existing engine requirements and host timezone contract.
Coordinator guidance suggestion: record this composition evidence beside H-12 and
M-15 and link this report from the central card/translation acceptance record.
Central guidance remains coordinator-owned; no broad gate should be closed.
