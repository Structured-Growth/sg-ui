# Batch 01 dialogs acceptance report

Assignment: dialogs. Task IDs: U-08, U-19, X-04, X-05 (bounded partial acceptance).

## Slice

Added an AppModal nested-overlay story, a colocated nested-modal behavior
regression and an exclusive browser suite. The suite checks three overlay
levels, forward/reverse native focus containment, initial focus and return focus
at each surviving trigger, top-only Escape/outside dismissal and exact host
callback sequence, explicit Close, menu/combobox Escape isolation, narrow Arabic
menu portal scope, and all twenty tabbed fields/footer actions with enlarged text
at 640 × 320 CSS pixels in light and dark themes. Existing stationary tab-strip
and clipping checks remain in the shared display-preferences suite.

No runtime dialog defect required an implementation change in the tested slice.
The tests use existing owned primitives and host-controlled modal state. Editor
and image-upload dialogs were untouched.

## Files

- `src/components/AppModal/AppModal.stories.tsx`
- `src/components/AppModal/AppModal.test.tsx`
- `tests/browser/batch01-dialogs.spec.ts`
- `docs/developer/react-aria-modal-shells.md`
- `docs/developer/parallel-batch-01/dialogs.md`

## Checkout

Base: `9f153642e827a14033d646cf0160730c0793bdfc`.
Worktree: `/Users/thomashall/.codex/worktrees/batch01-dialogs/sg-ui`.
Branch: `codex/batch01-dialogs`.
Implementation commit: `4466db3` (`test: cover nested dialog dismissal and constrained focus`).
Draft PR: [#7](https://github.com/Structured-Growth/sg-ui/pull/7).
The report is committed separately on the same review branch.

## Validation

- Frozen-lockfile dependency installation passed; no tracked dependency changes.
- Targeted AppModal/Dialog Vitest: 2 files, 11 tests passed.
- First full `pnpm check`: 143 files, 969 tests passed; foundation/token,
  type/build/release/package checks passed.
- First fresh `pnpm build-storybook` passed.
- First all-engine browser run: Chromium/WebKit passed nested modal/popover,
  pointer dismissal and both enlarged-text cases. Menu explicit-direction
  assertion failed in both engines; Firefox failed before test execution with
  `Could not find profile folder`.
- Final `pnpm check` passed again: 143 files and 969 tests, plus all foundation,
  token, type, build, release and package checks. Final fresh Storybook passed.
- Final all-engine new browser suite: 10 passed (all five cases each in Chromium
  and WebKit); five Firefox launch failures with the same missing-profile error,
  even with `TMPDIR=/tmp`. The browser command exits nonzero; Firefox assertions
  remain unverified. No project was skipped in these two all-engine attempts.
- Supplemental existing `display-preferences.spec.ts` sticky-tab and initial
  footer-focus checks: 10 passed across Chromium/WebKit (five cases each), on
  the same fresh build. Confirms stationary chrome at 320px, panel clipping,
  all native tab stops, nested focus scroll isolation and initial footer focus.
- Final source/browser typechecks, modal-doc local links and whitespace passed.
- Heavy checks/builds and browser server used the shared atomic mkdir lock with
  owner record and exit cleanup. A bounded initial lock wait expired; the next
  bounded wait acquired the lock without removing another owner's lock.

## Findings, limitations and central follow-up

The first browser run found an out-of-scope direction defect: an English
interaction locale with `Provider dir="rtl"` reaches the modal, but the nested
Menu portal root renders `dir="ltr"`. The final story uses the canonical Arabic
host locale through Storybook globals and validates locale-driven direction.
Do not interpret that passing case as fixing explicit direction overrides.
A central owner should inspect React Aria portal attribute merging in Menu,
Popover, ComboBox and other overlays, and add explicit direction regressions.
No outside-ownership file was changed to fix it.

Firefox's initial profile failure is a local launch prerequisite, rather than
an assertion failure. The rerun directs temporary profiles to `/tmp` without
changing Playwright configuration or skipping any configured project.

Actual browser chrome zoom, physical-device interaction, screen-reader
announcement/order, focus recovery after host trigger removal, every collision
placement and the rest of broad U/X acceptance remain open. Enlarged root text
and CSS viewport sizing are scoped simulations. Shared AGENTS/master/progress
updates are reserved for coordinator integration; add the evidence link without
marking broad gates complete.

Suggested next bounded assignment: explicit direction override propagation in
portaled interaction roots, then removed-trigger focus fallback and screen-reader
nested-modal acceptance.
