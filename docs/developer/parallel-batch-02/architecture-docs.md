# Parallel batch 02: architecture documentation completion report

Task slice: W-12/W-18, A-06–A-10, documentation reconciliation only. These changes
complete this bounded assignment, not whole tasks or broad G/K/E/U/X/R/Z gates.

## Changes and source evidence

- [Architecture](../react-aria-architecture.md): replace early-proof/legacy catalog
  status with shipped owned catalog/grid/editor/theme status; correct AppButton
  onClick to onPress and link breaking mappings; explain inherited Menu density,
  current boundary checks, required CSS/scopes and shipped dependency removal.
- [Primitives](../react-aria-primitives.md): distinguish generic inherited density
  from explicit compact catalog compositions; replace pending public theme removal
  claims with owned Provider/ThemeScope/AppThemeProvider and remaining audit limits.
- [Proof controls](../react-aria-proof-controls.md): record current AppModal/Dialog
  and AppPageTabs/Tabs composition, public Provider/ComboBox, current optional Dialog
  naming and six size choices, enlarged-chrome scrolling and separate AsyncMultiSelect.
- All three guides link the [canonical recipe](../react-aria-component-recipe.md)
  and [read-only adoption checklist](../react-aria-adoption-checklist.md).

Reviewed source includes AppButton/Button, Menu/useOverlayScope, ThemeScope/Provider,
public primitive/theme barrels, AppThemeProvider alias, Dialog/CSS, Popover, Tabs,
ComboBox, experimental exports, AppModal/AppPageTabs, DataToolbar selection menus,
Link NavigationSemantics story, CSS compiler and foundation boundary scripts.
Package exports/dependencies/scripts and existing component/theme/browser/server
contracts establish the remaining claims. No source or API changes were made.

## Ownership and review artifacts

Dedicated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-02-architecture-docs/sg-ui`.
Branch: `codex/batch-02-architecture-docs`.
Verified prerequisite baseline: `9554f1eb6a6f630e98f21eec6bdb6fa592450064`.
Prerequisite draft PR: [#2](https://github.com/Structured-Growth/sg-ui/pull/2),
branch `codex/batch-01-docs`.
Documentation commit: `44f0794` (`docs: reconcile shipped architecture and primitive contracts`).
This report follows in a separate docs commit; the branch head includes both.
Draft follow-up PR: [#3](https://github.com/Structured-Growth/sg-ui/pull/3), stacked
on `codex/batch-01-docs`; merge the prerequisite first and review/rebase the stack.
No merge, publication or version change.

Exclusive changed paths are the three linked guides and this report. Shared
AGENTS/master/progress, other docs, source, package/build/workflows, LICENSE/notices
and host applications were not changed. The primary checkout and other worker
worktrees were not edited/reset/stashed/cleaned. No other chats or agents launched.

## Validation

- PASS: scripted verification of 50 local links/anchors in the three changed guides.
- PASS: declared package subpaths/commands, AppButton onPress/no onClick/default type,
  Menu inherited density, explicit compact DataToolbar selection composition,
  light/comfortable scope defaults, public exports and AppThemeProvider alias.
- PASS: Dialog optional title/sizes/default/ref/style slots, separate AsyncMultiSelect
  export and primitive form-example names/props matched source.
- PASS: package dependency inspection confirms no retired MUI/Emotion runtime,
  peer or development packages. No dependency change was made.
- PASS: direct source and canonical guide review for scope/locale/portal behavior,
  modal scrolling, public wrappers, boundary checking and CSS output behavior.
- PASS: git diff --check and changed-path ownership audit against the prerequisite.
- PASS: draft PR base/head/draft and follow-up-only file list checked through GitHub CLI.
- Not run: dependency installation, pnpm check/build-storybook, UI/browser/packed
  consumer checks. Documentation-only validation does not require those runs;
  examples were reviewed against source, not executed in a host.

## Remaining gaps and next bounded suggestion

Implementation/dependency removal does not certify final historical/legal-reference
or exact-artifact audits. Broad browser/device/assistive-technology, strict CSP,
calendar/editor/grid, compatibility and support-policy acceptance remain open.
No new formal support policy, deprecation promise or experimental compatibility
promise is established. Host application adoption remains separately authorized.

Suggested next bounded docs slice: audit GitHub setup, fixtures/templates and
troubleshooting links/commands against current repository files. Coordinate shared
AGENTS/master/progress updates centrally; do not infer broad gate closure from this
report. Licensing/provenance remain unchanged pending separate legal review.
