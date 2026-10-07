# Selector acceptance: U-06 / X-16 (batch 01)

This bounded slice adds selector identity, independent-instance and native keyboard
acceptance evidence. It does not mark the broad U-06 or X-16 gates complete.
No runtime selector defect was found by the added unit scenarios; implementation
changes document the existing owned contracts.

## Contracts verified

- Select and ComboBox values are stable, unique host-provided string IDs, or null
  for a controlled empty selection. Duplicate labels and numeric-looking IDs
  (`01` versus `1`) remain distinct. Host changes update the displayed label.
- Uncontrolled values use defaultValue and reset with the native form; controlled
  hosts receive requests and retain authority when they decline an update. Keep
  a control's mode stable within a mount; changing modes is not covered here.
- ComboBox filters host-provided options by label using the existing interaction
  locale. Select shows the host collection without filtering. Fetching, supported
  locale policy, and freshness of replaced collections remain host-owned.
- AsyncMultiSelect selects records by string ID and retains selected records that
  disappear from current search results. It serializes each selected ID as a
  repeated native form value. Loading/error results cannot be selected; token
  removal remains available to correct a selection. Disabled/read-only controls
  block selection changes; disabled values are omitted from native form data. Current errors expose a host retry callback.
- Select empty collections explain that no options exist without opening an
  empty overlay; ComboBox presents an empty list message. Single-selector loading
  and remote errors are host composition concerns (disabled, description and
  invalid/errorMessage), rather than an added fetching API. AsyncMultiSelect owns
  translated loading/error/empty presentation from supplied state.
- HostSearchExample aborts each superseded request, rejects both late success and
  failure even if transport ignores abort, and cleans up in Strict Mode/unmount.
  The RequestRace story allows manual settlement in any order without networking.

## Files

- `src/experimental/Select/Select.tsx`
- `src/experimental/Select/Select.test.tsx`
- `src/experimental/Select/Select.stories.tsx`
- `src/experimental/ComboBox/ComboBox.tsx`
- `src/experimental/ComboBox/ComboBox.test.tsx`
- `src/experimental/ComboBox/ComboBox.stories.tsx`
- `src/experimental/AsyncMultiSelect/AsyncMultiSelect.tsx`
- `src/experimental/AsyncMultiSelect/AsyncMultiSelect.test.tsx`
- `src/experimental/AsyncMultiSelect/AsyncMultiSelect.stories.tsx`
- `tests/browser/batch01-selectors.spec.ts`
- This exclusive completion report.

Implementation changes are contract comments only; behavior remains unchanged. No shared barrel, token, config, guidance
or primary checkout files were edited.

## Validation

- pnpm install --frozen-lockfile: passed; no tracked lockfile change.
- Targeted Vitest: 3 files / 18 tests passed on Node 26.5.0, React 19.2.3.
- Browser TypeScript check: passed with all five native scenarios and runtime diagnostics.
- pnpm check: passed on Node 26.5.0; 143 Vitest files / 975 tests,
  foundation/token/release checks, source/story types, ESM/declarations and public
  package imports passed.
- pnpm build-storybook: passed with existing directive/sourcemap/chunk warnings.
- Native Playwright: 10 Chromium/WebKit cases passed, no runtime warnings/errors;
  all five Firefox cases failed before interaction at browser launch with
  `Could not find profile folder.` Thus the three-engine command returned 1.
  Firefox acceptance remains required in Linux CI; no skip, suppression or shared
  config change was added.
- Heavy checks, fresh build and static browser server ran under the atomic shared
  validation lock, which was released on exit. The first 15-minute wait timed out;
  the second was paused to give the coordinator its requested integration turn,
  then resumed only after the first integration outcomes marker appeared.
  No further lock acquisition occurred after the second priority request.
- git diff --check: passed.

Logs: `/tmp/batch01-selectors-check.log`,
`/tmp/batch01-selectors-storybook.log`, `/tmp/batch01-selectors-browser.log`.
Browser JSON/traces are in this worktree's `artifacts/browser-results.json` and
`artifacts/browser-traces`; these generated artifacts are not committed.

## Review and remaining scope

Worktree: `/Users/thomashall/.codex/worktrees/batch01-selectors/sg-ui`.
Branch: `codex/batch01-selectors`, based on
`9f153642e827a14033d646cf0160730c0793bdfc`.
Implementation commit: `b1119a0504004200bfdb8f0938cf78c4e47ca4dc`.
Draft PR: [#11](https://github.com/Structured-Growth/sg-ui/pull/11), targeting
`codex/dev`. The report is added in a subsequent documentation commit. No merge,
main integration or publication was performed.

Unverified: Firefox selector interactions in this local environment, physical touch devices, assistive technologies, supported Node 22/24
and packed React 18 selector-specific behavior, controlled/uncontrolled mode
switching, nested theme/portal permutations, long localized result lists and
performance budgets. Broad U/X/R/Z acceptance remains open.

Coordinator integration: link this evidence from the master/progress records and
public primitive contract; preserve the explicit stable-ID, host freshness and
stable control-mode guidance. No central API/export/token/config change is needed.
Suggested next bounded assignment: selector portal locale/RTL/zoom and packed
React 18/19 hydration acceptance, followed by manual screen-reader review.
