# Wave 03-08 — foundation scale, split actions and state successors

Prepared a reviewable **seven-file patch** and a focused native regression for
A-D-06, A-D-13 and A-D-15. **All three remain partial pending coordinator integration;
no acceptance counts changed.** Only this evidence directory was written. No
shared source, generated file, build output, lockfile, Git state or server changed.

## Concrete changes ready for integration

[implementation.patch](implementation.patch) and [proposed-files](proposed-files/)
contain the exact candidate changes; [before-files](before-files/) preserves the
four existing-file inputs for review. The patch currently passes `git apply --check`.

- **A-D-06:** New `react-aria-foundation-scales.md` defines the shipped spacing,
  density/targets, radii, border/stroke, icon, elevation and motion decisions.
  Button and Card intentionally share the .625rem control radius; fields retain
  the separate .375rem field role. Material rounded geometry is preserved.
  Existing 1px outline, 2px spinner, 3 SVG-unit progress stroke, default 1em/2-unit
  icon, 800ms Button spin and 1.2s progress timing are explicitly bounded local
  implementation exceptions. They are not falsely described as generated tokens.
  The 120ms transition is not substituted for continuous indicator timing. No
  authored token change or token regeneration is needed. Theme guidance links
  the new contract.
- **A-D-13:** Button usage and owned action guidance now specify a filled primary
  Button for one dominant form/dialog confirmation, neutral outlined/text actions
  for alternatives/toolbars, and the existing neutral joined SplitAction with
  shared border/divider. No unsupported SplitAction variant or tone is introduced.
- **A-D-15:** Corrected a real CSS inconsistency in the candidate: neutral filled
  Button hover uses subtle background, but keyboard press with the pointer away
  resolves back to the neutral resting surface. Add its missing `data-pressed`
  selector beside hover. This preserves primary/outlined/text configurations and
  existing radius/focus/disabled/pending behavior. A prepared Playwright regression
  uses the existing source-backed neutral reference and actual held Space in
  light/dark; a hovered pointer would conceal this bug.

The new state contract links the [machine matrix](state-matrix.json): **214 named
catalogued exports across 94 routes**, including aliases, compound children,
individual icons and pure helper exclusions. Each has eleven applicability/design
entries, source locations, existing reference tests where available, public example
route and composed public parts. Presentation parts explicitly do not acquire an
invented action API. Tooltip disabled is distinguished from trigger disabled;
read-only page navigation preserves selection; operation-step pending/error status
is distinguished from an in-flight Button action.

The matrix does **not** close D-15: standard-mode selected/current styling in
ToggleButton/ToggleButtonGroup, ListItemButton and NavigationItem still needs a
non-color structural indicator. Single-day Calendar selection needs the same
review; range endpoint shape and forced-color-only outlines are not sufficient
proof. Exact files/expected checks are in [validation-plan.json](validation-plan.json).
No generic broad suite or hundreds of duplicate unit cases are proposed.

## Evidence reconciliation and validation

The assigned prior report/results hashes both match. Compared 115 inspected inputs
with wave 02: 113 match; the current acceptance ledger and TextArea CSS differ.
The TextArea change is the integrated BUG-0009 correction, not an unexplained
failure. All 61 compared coordinator-integration inputs, all 9 compared BUG-0008/0009
inputs and three selected built outputs match their saved hashes. Retain their
bounded results and limits, without adding overlapping native runs. Details and
exact SHA-256 values are in [evidence.json](evidence.json). Current base HEAD is
`540f47d4059a9cea8890b80927f34f51ef2fbc3e`, dirty `dev`.

The report-owned [scoped validator](checks/scoped-validation.mjs) passes on
**Node 26.5.0 / darwin arm64**: a bounded PostCSS selector-cascade probe reproduces
the old neutral-filled press resolution and verifies the candidate, checks all
six tone/variant hover/press pairs and unchanged rests, verifies 214 named matrix
rows with all eleven decisions and existing reference paths, checks proposed
local links/usage JSON and transpiles the native spec/config syntax. It is
**source validation, not native CSS execution, supported Node 22/24 unit evidence,
full TypeScript checking, AT, physical-device or real-zoom evidence**. Receipt:
[scoped-validation.txt](scoped-validation.txt). Existing reference tests in the
matrix are locations, not newly executed passes.

The initial report-owned link checker failed because it resolved proposed target
paths outside the mirror; its failure log is preserved and the checker corrected.
The report-owned matrix generator also had an early-return/local-variable error;
its transcript and correction are preserved. Neither changed production code.

## Remaining coordinator work

Review/reconcile and apply the seven-file patch, build fresh library CSS and docs,
run catalog guidance validation, then run the prepared two-case native regression
in each desktop engine against the coordinator-owned host. The supplied config
has no server startup and requires `SGUI_ACCEPTANCE_BASE_URL`; it will not touch
user server 3000. Exact commands, expected assertions and closure policy are in the plan.

A-D-06 and A-D-13 can be reviewed for definition closure after their documents are
integrated and guidance checks pass. A-D-15 additionally requires the named
non-color visual successors and their focused runtime evidence. No new native,
packed-consumer, remote CI, operator, legal, owner-release or production approval
is claimed.
