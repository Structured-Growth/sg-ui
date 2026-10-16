# Wave 03-12: motion and system indications

All three assigned original leaves remain **partial**. This delivers a reviewable
implementation patch, an updated existing unit smoke, two native fixture exports,
three focused browser cases and maintained guidance changes. Nothing outside this
owned directory was changed. No original acceptance checkbox/count is changed.

## Concrete patch

`system-indications.patch` and `proposed-files/` contain six target files:

- TextColorPickerControl implementation/CSS: move preset color backgrounds to an
  aria-hidden, pointer-transparent chip. Previously `.swatch { forced-color-adjust:
  none }` exempted the entire interactive button. Limit that exception to actual
  color data; retain system-painted button chrome. Set ButtonText borders,
  Highlight double-border selection and a separate outward Highlight focus ring.
  Ordinary appearance still uses owned Button/color-picker aliases and the same
  owned preset token values. No palette literals, new motion dependency, upstream
  public API, generated token edits or host data operations are introduced.
- Existing picker unit test: preserve its callback, validation and selection
  assertions; add assertions that color data belongs to a decorative child.
- Existing registered FoundationCatalogue fixture: add independent start/end
  MotionCancellation examples consuming public exports and production ThemeScope.
  The controlled host can replace a focused panel or close from an outside action.
  No migration manifest/registry was edited. Coordinator generation discovers the
  new exported stories in the already registered module.
- New `wave03-system-indications.spec.ts`: both rail directions retain drafts,
  repair/preserve focus, stop animation on live media change and settle after
  frame-separated host activations. A third case observes selected swatch system
  border/focus colors, decorative opt-out, non-color double-border selection and
  Escape focus restoration. Attachments retain media capability and observations.
- Theme guidance: adopt interruption/cancellation/focus ownership rules and explain
  the color-data exception and host contrast responsibility.

The source-confirmed concern is the overly broad color-data opt-out and shared
selected/focus outline presentation. This is **not a captured native rendering
failure**: existing Button forced-color rules already explicitly supply some
system indicators. The proposed containment and distinct selection border need
native validation before any visual acceptance claim.

## Original leaves and remaining work

| Leaf | Original requirement | Result and residual successor |
| --- | --- | --- |
| A-C-16 | Define reduced-motion transitions, interruption/cancellation behavior, and focus timing; no motion runtime added solely for simple CSS transitions. | Partial. Maintained-guide patch adopts the prior seven-row contract; new rail cases cover both sides, controlled replacement, rapid host activations, draft lifetime and live reduction. Integration/build/native execution remain required. SideNavigation rapid forward/Back and Dialog/Tooltip lifetime receipts still need exact input reconciliation or bounded execution; no all-component cancellation claim. |
| A-D-18 | Support reduced motion and forced-colors/high-contrast environments; avoid suppressing essential system indications. | Partial. Actual opt-out containment/system chrome patch plus focused swatch case supplied. Existing Button/progress/nav reduced-motion rules and explicit system-painted Progress/ToggleButton exceptions were reviewed, without removing their system-color preservation. Current native preference execution is pending; unsupported engines must be recorded. OS/AT observations remain separate. |
| A-X-06 | Verify text/non-text contrast, visible focus, high contrast/forced colors, reduced motion, and state meaning beyond color. | Partial. Swatch selected state gains a double-border geometry cue in forced colors, retaining accessible preset names/aria-pressed. Proposed case verifies outward keyboard ring and selected geometry independently. Full composed text/non-text/hover/pressed/disabled/error/loading checks and operator environments remain unverified. Token ratios alone do not establish rendered conformance. |

## Evidence actually obtained

Commands ran from repository root:

1. `python3 docs/developer/final-acceptance/wave-03-12/prepare.py` creates only
   owned mirrors/patch/base hashes. It does not modify target source.
2. `git apply --check docs/developer/final-acceptance/wave-03-12/system-indications.patch`
   passes against inspected checkout. This is a dry run only.
3. `node docs/developer/final-acceptance/wave-03-12/verify-artifacts.mjs` passes
   syntax transpilation and PostCSS structure assertions. `artifact-check.json`
   records Node **26.5.0**, Darwin arm64. This is neither a supported Node22/24
   test pass nor typechecking, CSS compilation, DOM, native or contrast evidence.
4. `python3 docs/developer/final-acceptance/wave-03-12/inspect.py` captures 29
   selected current inputs/output paths, prior hashes, and coordinator matches in
   `input-reconciliation.json`. All six assigned prior report/results hashes match
   assignment.json. Three selected built outputs match the coordinator integration
   receipt; selected source paths absent from that receipt are explicitly unknown,
   not silently grandfathered. Wave02-07 selected source comparisons are included.

`patch-inputs.json` is the exact integration precondition for target files. The
coordinator BUG0008–0012 receipt is retained only for its own declared scope;
A-G02/A-K16 are not reopened. Original reports remain untouched. No generic full
inventory or accepted broad suite was repeated. Named token/old native checks stay
at their own recorded snapshots, without a new run or broader inferred result.

The legacy validation lease was occupied at inspection; no acquisition, bypass,
reclaim, spin or unit runner was attempted. Native execution also requires the
unapplied fixture and matching package/host builds, forbidden in this worker.
No server was started or altered. User3000 and .obsidian are untouched.

`validation-plan.json` supplies exact supported-runtime unit/build/browser commands,
expected assertions, source/build receipts and remaining external evidence. A
patch-only fix does not close any runtime leaf. Coordinator integration and these
bounded checks are the next actionable step; production release remains unrelated.
