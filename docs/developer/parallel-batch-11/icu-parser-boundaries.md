# Batch 11 ICU parser boundaries

Task: bounded H-08 parser audit. Baseline:
`d0fcc6298004ad23d1a75480b216b39142e6df96` (verified before edits).
Worktree: `/Users/thomashall/.codex/worktrees/batch11-icu-parser-boundaries/sg-ui`.
Branch: `codex/batch11-icu-parser-boundaries`; draft PR base: `codex/dev`.
Implementation/test head: `f601e995a3c2a0a420abe26f2ce4be81ecaeee5d`.
The final report supplies the final documentation commit head and PR URL.

## Findings and changes

Existing coverage already exercised plural/ordinal categories, exact-before-offset
selection, basic nested plural/select pound scope, apostrophe quoting, scalar
interpolation, dates/numbers, invalid syntax/types, duplicate selectors, variable
parity and rejection above the 50-level limit. No reproducible parser defect was
found in this bounded audit; `src/i18n/icu.ts` is unchanged.

Added ten focused cases in `src/i18n/icu.test.ts`:

- Nested offsets retain the outer adjusted count through a select, replace it in
  an inner plural, restore it afterward, and reset across sibling arguments.
  Exact selection uses the original inner count; top-level pound stays literal.
- Repeated argument names across number, cardinal and ordinal formats deduplicate;
  inactive nested branches still contribute variables to catalog validation.
- Quoted closing braces do not terminate a branch; doubled apostrophes inside
  quoted braces stay literal and hidden arguments/pound remain excluded.
- Invalid inactive nested types, missing `other`, unclosed nested branches/quotes,
  unsafe offsets and numerically equivalent duplicate exact selectors reject the
  whole message, without interpolating its valid prefix. Catalog validation throws.
- Exactly 50 branch levels format and extract variables successfully, complementing
  existing rejection at 51 levels.

Only the test file and this report changed. No public API, grammar, provider,
locale policy, story, or rendering behavior changed.

## Local validation

Runtime: Node `v24.21.0`, pnpm `10.29.3`, Vitest `4.1.11`.
`/tmp/sgui-run24.mjs` prepends the existing Node 24 binary directory to PATH
before invoking pnpm. Commands from the isolated worktree:

```sh
node /tmp/sgui-run24.mjs install --frozen-lockfile
node /tmp/sgui-run24.mjs exec vitest run src/i18n/icu.test.ts src/i18n/index.test.tsx
git diff --check
```

Frozen installation passed without changing the lockfile. Both test files passed:
52 tests, including all ten new cases, at implementation/test head above.
Whitespace checks passed. Report links were checked against repository paths.
No full check, typecheck, Storybook, browser, consumer or GitHub CI/title suite was
run for this test-only change. No heavy-validation lock was acquired or disturbed.
The user-paused dev automation remains paused. No device/AT claims are made.

## Limits and next bounded work

This does not close H-08 or broad translation/native/AT acceptance. It preserves
[the documented owned subset](../react-aria-i18n-acceptance.md#owned-icu-subset),
including host-owned full MessageFormat styles and locale policy. No out-of-scope
source fix was identified or reserved. A next bounded task could exercise the
existing pseudo-localized and Arabic translation stories for visible long-label
and RTL behavior when its browser-validation queue turn permits it.

Central guidance remains [development validation](../react-aria-development-validation.md),
[translation acceptance](../react-aria-i18n-acceptance.md), and
[the master task list](../react-aria-master-task-list.md). Broad gates stay open.
