# Batch 01: native forms acceptance

Assignment: forms. Task slices: U-04, U-05, U-18.

## Scope and owned contract

This slice covers existing TextField, Checkbox, Switch and RadioGroup in one
native form: names/values, required validation, submission blocking, reset,
controlled/uncontrolled state, mixed state, disabled omission, read-only behavior
and accessible label/description/error associations. It does not complete the
whole U-04/U-05/U-18 backlog.

Checkbox gains compatible optional `description`, `errorMessage` and `invalid`
props. React Aria owns validation and input state; visible error text follows its
invalid render state. Description/error IDs are distinct from the visible label,
so neither replaces or expands the control's accessible name. `errorMessage` is
host-supplied/translated and appears after failed native validation or explicit
`invalid`. Styling uses the shared muted-text/danger tokens in the component layer.
The existing native label ref and grid selection slot remain intact.

```tsx
<Checkbox label="Accept terms" name="terms" value="accepted" required
  description="Required to register." errorMessage="Accept before submitting." />
```

Consumers load `/styles.css` and provide Provider/ThemeScope. A checked checkbox
or switch contributes its `value` (default native value: `on`); unchecked and
disabled controls are omitted. `mixed` is presentation state: FormData follows
`checked`, and hosts own the mixed flag. RadioGroup contributes the selected
option value, not its label. Read-only controls stay focusable and serialize their
values. Switch has no required/error contract; use Checkbox for required consent.

Uncontrolled inputs restore declared defaults with native reset. Controlled hosts
accept or reject value callbacks; the host explicitly restores its draft in
`onReset`. The composed `NativeAcceptance` story demonstrates both state modes
and the `ControlledAuthority` story rejects editing requests to prove authority.
No control submits, stores or persists application data itself.

## Files

- `src/experimental/Checkbox/Checkbox.tsx`
- `src/experimental/Checkbox/Checkbox.module.css`
- `src/experimental/Checkbox/Checkbox.test.tsx`
- `src/experimental/Checkbox/Checkbox.stories.tsx`
- `src/experimental/TextField/TextField.stories.tsx`
- `tests/browser/batch01-forms.spec.ts`
- This report.

## Review and validation

Worktree: `/Users/thomashall/.codex/worktrees/batch01-forms/sg-ui`.
Base: `9f153642e827a14033d646cf0160730c0793bdfc`.
Branch: `codex/batch01-forms`.
Implementation commit: `ef74857739a818cb55b5c559e1084843e71d786b`.
Draft PR: [#6](https://github.com/Structured-Growth/sg-ui/pull/6), based on
`feat/react-aria-owned-foundation-cards` (verified remote head matches the pinned base).
This report is finalized in a subsequent documentation commit on the same branch.

- Frozen dependency install: passed.
- Targeted Vitest: 4 files, 13 tests passed.
- `pnpm check` on Node 24.21.0: passed; 143 Vitest files / 970 tests,
  foundation/token/type guards, four release-policy tests, ESM/declaration build,
  public-entry imports and consumer declaration checks.
- `pnpm build-storybook`: passed from fresh source, before browser execution.
  Standard bundle warnings about client directives/chunk sizes remain.
- `pnpm test:browser batch01-forms.spec.ts`: browser TypeScript passed. Final
  default-directory run: 8 passed (Chromium/WebKit), 4 Firefox launch failures
  before any story ran. Chromium/WebKit cover all four cases per engine, including
  light/dark WCAG-tagged axe scans with full attached results and no excluded rules.
- A task-owned `/tmp/sgui-batch01-forms-browser-tmp` TMPDIR diagnostic repeated
  the matrix: 8 passed, the same 4 Firefox launch failures (`Could not find profile
  folder`). No browser project was skipped and shared config was unchanged.
- The first browser attempt exposed test input hit-testing: the native input is
  visually hidden behind its indicator. After changing pointer tests to the
  visible labels (without force clicks), the Chromium/WebKit cases passed.
- Heavy checks/builds and all browser servers serialized through the shared
  atomic mkdir lock with this chat ID and an owner-checking cleanup trap.
- `git diff --check`: passed; changed paths match the assignment allowlist.

Local evidence logs: `/tmp/sgui-batch01-forms-check.log`,
`/tmp/sgui-batch01-forms-storybook.log`,
`/tmp/sgui-batch01-forms-browser-rerun.log`,
`/tmp/sgui-batch01-forms-browser-temp.log`. Browser results/traces and axe
attachments are under this worktree's ignored `artifacts/` directory. These are
local validation evidence, not official Actions artifacts.

Firefox native behavior is unverified locally. CI must execute the unchanged
three-browser suite; the launch failure is the existing documented local profile
limitation, not a successful Firefox acceptance claim. See the existing
[browser harness guidance](../../../tests/browser/README.md).

## Boundaries and next slice

No edits to primary checkout, shared guidance, barrels, tokens, package/lockfile,
Playwright configuration, buttons/selectors/date controls or other assignments.
Coordinator should integrate the optional Checkbox props and native form semantics
above into central primitive guidance; shared docs were outside this assignment.

Remaining broad gates include U-04 textarea/grouped fields, U-18 actual browser
profile autofill/password managers and externally associated forms, plus manual
assistive technology/device/zoom acceptance. Automated accessible-name/description
checks do not establish screen-reader announcement behavior.

Suggested next bounded assignment: externally associated form ownership/reset and
native required/disabled transitions for these same controls, followed separately
by textarea/grouped-field API acceptance.

Broad U/X/R/Z migration acceptance remains open. No whole task/gate is marked complete by this report.
