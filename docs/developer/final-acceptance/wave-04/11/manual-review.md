# Actual operator review still required — A-X-11

Status: unrun. This worksheet complements the existing detailed six-category sequence in
`docs/developer/final-acceptance/wave-03-29/screen-reader-operator.md`. No expected
sentence below is an observation. Automated XCTest speech captures are separate
from operator findings. Neither XCTest taps nor a screenshot proves VoiceOver
activation, focus return, useful announcements or comfortable touch use.

Coordinator runs the five maintained methods serially; merge calendar/progress
methods from their owners without overwriting this file's shared helpers. Record
Xcode/OS/runtime/Safari build, speech language and verbosity, source and frozen host
hashes, method, command, timestamp, xcresult/attachment hashes and failures. Prior
successful platform was Xcode27.1 build27A9275 / iPhone18Pro iOS27.0 Simulator;
those are historical versions until the new runner records its own environment.

An operator should then use VoiceOver navigation/activation gestures, not XCTest,
on the same frozen build. Record exact commands, mode transitions, expected semantic
information, actual speech verbatim or labeled paraphrase, focus before/after,
pass/fail/blocked, severity and defect successor. Leave unobserved fields null.

| Category | Existing fixture ID | Minimum manual observations remaining |
| --- | --- | --- |
| Dialog | migration-proofs-dialog--nested-form | Title/description and initial required field; nested Category and Naming help dismissal order; empty Save validation; Cancel/Escape return; no background traversal |
| Selector | migration-proofs-select--independent | Open/closed state; Draft/Active and disabled Unavailable; actual AT selection; second control stays independent; Escape preserves value/focus |
| Calendar | migration-proofs-calendar--unavailable | Date, selected/unavailable state and Fully booked reason; navigate and activate a date; period chooser return; add calendar-owner range/preset Apply/Cancel/constraints review |
| Navigation | migration-proofs-navigation--host-routing-and-expansion | Landmark, link role/current Algebra then Geometry; expanded/collapsed Courses; focus recovery after collapse; additional SideNavigation native-hierarchy Back/drilldown from prior runbook |
| Table/grid | migration-proofs-table--default | Caption, row/column header associations and numerical cells in reading order; also review migration-proofs-catalog-grid-interaction--focus-retention for grid entry, cell actions, selection, busy updates and exit |
| Editor | editors-pagerichtexteditorsection--clipboard-editing | Editable name/multiline state, typing and content reading; formatting/pressed state, selection retention, link dialog Cancel and focus, undo/redo; discover read-only state and blocked edits |

For each automated failure retain complete actual speech and tree attachments. Classify
whether expectation wording, native locator, fixture or library behavior caused it;
inspect before changing. Do not delete a name/role/state assertion merely to obtain
success. Same-utterance patterns intentionally bind state/role to its named control.
A tree attachment is diagnostic data, not the transcript. A scanner finding the
trigger later does not establish initial focus restoration. Automated absence of
an exception does not establish a human usability pass.

A-X-07 additionally needs scoped CSS-pixel geometry/spacing and WCAG exception
rationale for uncovered controls; XCTest frame points must not be relabeled CSS
pixels. Existing trusted emulated-touch tests and Simulator taps are valuable
representative coverage but not physical-device comfort observations. A-X-08 needs
calendar/editor non-drag equivalence under constraints and host rejection, beyond
the already integrated grid width step buttons and Move alternatives.
