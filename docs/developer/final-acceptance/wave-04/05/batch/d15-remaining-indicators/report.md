# D15 remaining structural indicators: completed finite handoff

HierarchicalMenu current-page items now retain a double start bar, while selected
MonthPicker and YearPicker choices retain an inset ring. These absolute,
noninteractive indicators preserve box allocation and existing focus outlines.
Current/selected state remains distinct while focus moves to another control.
Standard colors use owned menu text or Button foreground; forced colors use
Highlight and automatic system color adjustment remains enabled. No public API,
availability, callback or selection behavior changed.

Nine existing meaningful unit cases pass with added focus/selection assertions;
no new unit cases or broad regression expansion. Library/browser/private-fixture
typing, owned foundation guard, JSON parsing and diff whitespace checks passed.
One fresh library build and one private fixture build compiled the changes.
All 445 declaration files stayed identical. Per root instruction, no unnecessary
catalog/source-site/baseline rebuild was performed: APIs, exports and composition
metadata are unchanged.

The six Chromium native cases pass with no skips: menu/month/year in standard
and actual forced colors. Each observes light+compact+LTR and
dark+comfortable+RTL, with direction/control pixels/color scheme measured rather
than inferred from labels. Both YearPicker scroll and paged branches run inside
the same year case. Measurements preserve selected/current and independent focus
markers, unchanged dimensions, disabled restrictions, and indicator transfer on
month/year activation. Eight forced-color observations measured contrast against
the resolved selected surface from 15.13:1 to 19.04:1, exceeding the 3:1 assertion.
The twelve direct screenshot attachments have been reviewed; labels and structural
markers remain distinct. The bounded year-wrapper crop is documented in
image-review.json; no screenshot pixels or visual baselines were edited.

The first six-case attempt stopped at a setup error: parseFloat of the raw 2rem
height token yielded 2. All original failures/traces/screenshots are retained.
The corrected driver resolves the same token through a noninteractive scoped
measurement probe and preserves the expected 32/44-pixel checks. The retry reused
the exact same immutable built outputs, with no extra build. Source/output
stability and cleanup passed in both runs. No host or owned claim remains active.

Completion and exact admissions are in completion-receipt.json; runtime geometry,
actual contrast and screenshot paths are in native-02/observed-results-summary.json.
Source planning is preserved in source-plan.md. selective-stage.json lists the
fourteen intended source/docs/fixture/spec files and bounded evidence. The shared
state-applicability guide retains root's Avatar/passive-loading correction.
No ledger/count, Git index/commit, paused Apple or baseline change occurred.

This closes only the named finite implementation/evidence task for coordinator
review. It does not claim all D15, all engines, the Cartesian state matrix or
unmeasured system palettes. No additional build or test loops are proposed.
