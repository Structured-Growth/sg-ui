# Unexecuted operator and evidence records

These records advance the prior acceptance successors into concrete observations
and completion criteria. They are **not test results**, new product contracts,
legal interpretations or authorization to operate the user's browser/profile.
No operator, physical device, spoken AT session or approval has been supplied in
this wave. The coordinator schedules the appropriate owners after source/build
attribution. Reuse equivalent valid receipts first; only changed or uncovered
scopes need new execution. One receipt can support several leaves if its limits
are explicit; never count a test as an acceptance leaf.

Every completed record must contain: exact working-tree source hashes plus HEAD;
compiled output/native-host hashes; date, operator, browser/engine/OS versions;
actual input mode/settings; controlled host acceptance policy; observed result
for each transition; relevant accessibility tree, bounds, screenshot/log or
spoken transcript; failures and remediation owner. A configured project or a
prepared spec is not a completed record. Current PeriodPicker, DateTimeRangePicker,
DateRangeComparisonPicker and TextArea must use coordinator's corrected inputs
and newly attributed affected outputs; old FA output hashes cannot certify them.

## AF-1 — real profile autofill (U-18)

Owner prerequisite: QA/operator with a populated disposable browser profile and
consented synthetic contact data. Do not record personal profile contents or
passwords. Actual browser autofill UI must be used; script .value assignment and
forwarded autocomplete attributes cannot satisfy this record.

Use TextField name/email and TextArea address fields in (a) uncontrolled,
(b) controlled accepting and (c) controlled rejecting host forms. Include an
external form association and disabled/read-only counterparts where supported.

| Transition | Required observation |
| --- | --- |
| Choose browser's offered autofill data | Native visible value, host callback sequence and accepted controlled state; no invented synthetic edit |
| Submit using Enter, then explicit submit | Exact host FormData key/value policy, submit count, no disabled fields, read-only values retained |
| Reset, then cancel a reset | Latest default restored for uncontrolled; controlled host authority retained; no reset-as-edit request; prevented reset changes nothing |
| Reassociate external form, autofill and reset new form | Old form cannot reset current field; current form owns submitted/reset values |
| Change disabled/readOnly while data is offered | No illegal edit request; record actual browser behavior and field policy rather than assuming a disabled trigger is focusable |

Existing assertion entry points: batch01-forms, batch05-native-reset,
batch11-standalone-reset, TextField/TextArea and per-collection unit files.
A real password-manager integration is an additional named host case if supported;
this contact-data record does not promise password-manager compatibility.

## AT-1 / SEM-1 — names, state and spoken results (X-03, X-10, U-17)

Owner prerequisite: accessibility operator names actual OS, screen reader/version
and browser/version, announces the intended supported pairing and records speech.
Axe and DOM assertions cannot substitute. No specific untested pairing is called
supported here.

| State/operation | Observe and retain |
| --- | --- |
| Landmark/headings traversal | Distinct navigation names, main, host hierarchy; visual typography must not choose heading level |
| Field focus + invalid native submission + correction | Name, description and live error IDREF; focus destination; actual invalid/correction speech, no dangling IDs |
| Progress unknown → known zero → updating → complete | Unknown has no numeric current value, zero remains determinate; no progress tick live-region spam; deliberate milestone spoken once |
| Pending → failure → retry → success | Actual order/content and interrupted speech; mounted polite/assertive region policy; busy grid with empty versus retained rows |
| Remove middle/last/only tag | Remove action has host-translated label; next/previous/empty collection focus and actual announcement; rejecting host retains item/focus |
| Nested modal close and host update | Dialog naming, topmost dismissal and focus context announced; no hidden background traversal |

Record errors owned by library versus missing host labels/data. Do not render raw
backend diagnostic objects as an accessibility fix. The 20 editor V leaves retain
their independent locale/selection/focus and AT gaps.

## FOCUS-1 — transition matrix (X-04)

Map these transitions to existing receipts before any run. Use TagGroup,
Disclosure, Dialog/Popover, grid reorder and page navigator fixtures rather than
a new generic dummy component.

| Transition | Acceptance observation |
| --- | --- |
| Open modal by pointer/Enter | Intended initial target; Tab/Shift+Tab containment; no background action |
| Escape/outside/Close in nested child | Only top overlay dismissed once, actual reason; surviving trigger focus |
| Remove opener while child open | Parent/explicit host destination, stable after two frames; no stolen later host focus |
| Collapse after removing a focused child | Trigger recovery only when no later outside focus owns the page |
| Accepted and rejected tag removal | Adjacent/empty target for accepted removal; rejected host preserves current item |
| Grid/page reorder, row replacement, stale drop, update/unmount | Surviving source/destination target with host authority; stale async work cannot steal focus |

Sources to reconcile: batch01-dialogs, batch52-dialog-removed-opener,
batch01-grid-reorder, reorder, TagGroup and Disclosure tests. Old batch122 shards
cover named historical slices, not every current composition.

## ZOOM-1 — actual zoom, text spacing and font substitution (U-19, X-05)

Owner prerequisite: browser/native test operator with real zoom controls and an
attributed immutable host. Record browser zoom percentage, CSS viewport size,
device scale and visualViewport scale separately. Root font-size 150%/200% is
retained enlargement evidence but is not browser-chrome zoom.

Open a sticky AppModal tabbed form and AppShell independent panes; include edge
Popover/Menu/Select/ComboBox/date portals. At real 200% and 400% zoom, Tab to last
field/action, open/dismiss overlay, resize viewport and repeat in RTL and both
densities. Apply line-height 1.5, letter-spacing .12em, word-spacing .16em and
paragraph spacing 2em. Change optional Geist to system/monospace substitution
and record computed font availability, as required by prior parallel-09 D09 work.

Retain whole focused target/ring bounds, hit tests, sticky chrome/panel bounds,
actual scroll owner, keyboard reveal, no unintended document overflow, portal
scope/direction/lang, overlay collision side and draft preservation. Deliberate
internal scrolling is not a failure. Check document-width preservation during
native scroll lock. Do not disable scroll locking to make a check pass.
Existing display-preferences and popover-native-collision assertions provide
most geometry checks; actual zoom and font inputs remain the missing evidence.

## MEDIA-1 / TARGET-1 — rendered states and actual targets (X-06/07)

Owner prerequisite: accessibility/visual reviewer records the applicable target
criterion and exception rationale; no blanket 44px requirement or compliance
claim is made by this packet. Device reviewer supplies actual coarse-pointer
hardware for primary-touch usability; emulated touch remains labeled emulation.

Measure actual active hit rectangles and neighbor distances/overlap, not just
CSS indicator dimensions, for inline links, checkbox/radio labeled regions,
resizers, calendar days, icon/menu/tag actions and primary form actions. Cover
compact/comfortable; auto on coarse pointer and explicit touch; enlarged text,
LTR/RTL, enabled/disabled and viewport edges. Verify click/tap results and complete
focus outline containment. Record target-size/spacing exceptions by usage.

Reuse HB-15 calendar and HB-17 grid target/bounds reports with retained manifests
before scheduling uncovered cases. Their observed 44px targets are bounded proof,
not every primitive's conformance. Generated interaction tokens now supply a
coarse-pointer branch, superseding batch123's old missing-branch observation.

For text/non-text contrast, retain named foreground/background/composited pairs
through normal/hover/pressed/selected/error/loading/disabled/focus in light/dark,
increased contrast and actual OS forced colors. Verify reduced-motion behavior
and state meaning with color removed: text/icons/shape/state semantics must remain.
Token graph tests cover named mathematical pairs, not arbitrary host surfaces or
opacity. Do not turn off forced-color adjustment to preserve branding.

## Drag alternative inventory (X-08)

This is a bounded current-source inventory, **not full dragging conformance**.

| Operation / implementation | Keyboard and non-drag pointer evidence | Exact remaining decision/deliverable |
| --- | --- | --- |
| Grid row reorder, public experimental DataGrid and AppDataGrid | Drag slot plus owned Move up/down buttons. Buttons are pointer-clickable and keyboard activatable; existing reorder/native specs cover host requests and cancellation. | Retain current accepted/rejected/stale-drop/first-last/pending evidence; physical touch is separate. |
| Grid column width, both DataGrid renderers | React Aria ColumnResizer receives keyboard/pointer context; bounded shared sizing retains fill column. Inspected columns menu exposes visibility and Move-order only, no width field. | Observe native resizer press path first. If it cannot supply an equivalent single-pointer non-drag operation, add owned width entry/step/reset UI tied to complete width snapshots, min/max/fixed bounds and flexible fill. Keyboard-only resize is insufficient evidence of a pointer alternative. |
| Grid column order | DataToolbarColumnsMenu Move up/down buttons emit owned reordered records. | Verify locks/actions-last normalization and accepted/rejecting host focus. No need to implement a second drag path. |
| ExperiencePageNavigator page reorder | Native draggable row and per-page Menu Move up/down both invoke onReorderPages(source,target); first/last/readOnly disabled. | Verify identical ordering result and focus through accepted/rejected host updates with native pointer menu activation; retain existing page-navigation evidence first. |
| DateRangeSelector complete-range move/resize | RangeGestures supports pointer drag and Shift/Alt arrows. Endpoint fields and day-click policies offer non-drag edits where shown. | Prove equivalent final result in fields-hidden hosts, fixed/bounded duration and active-endpoint cases. Mere keyboard alternative or two independently edited endpoints does not automatically establish equivalent duration-preserving move. Document host policy; implement missing non-drag action only after decision. |
| Editor image/table resizing or host-provided draggable content | This wave did not establish an exhaustive Lexical/editor operation inventory. | Editor owner inventories active resize/drag plugins and any host extension, identifies essential/exempt operations with accessibility owner, and maps keyboard plus single-pointer alternatives. Keep the 20 editor V leaves open. |

No new production bug ID is allocated from source-only absence of a width editor;
native engine behavior and applicability still need the named decision. This
advances batch123's deferred resize investigation without inventing a test pass.

## CLIP-1 / TOUCH-1 — real clipboard and touch (X-09/10)

Owner prerequisite: native browser/OS operator and actual touch-device reviewer.
Record clipboard permission state and real prompts; use disposable known text.
Perform Copy/Paste through actual keyboard and control actions; verify transferred
bytes/content, success announcement and denial/failure fallback with selectable
source retained. Test editor/grid independently; browser-injected transfer data
is labeled synthetic and cannot replace OS clipboard behavior. Existing
editor-clipboard and batch05-grid-clipboard native receipts are reused for their
exact scopes before any new test.

On named physical OS/browser/device, tap primary controls, menu/tag actions,
calendar dates and row Move actions at both densities, including scrolling and
edge targets. Record no overlapping activation, focus/context, gesture cancel,
viewport changes and the actual coarse-pointer media result. An engine project
named Desktop Safari is WebKit coverage; it does not certify branded Safari/iOS.
Accessibility/QA owner must name supported AT/device pairings and record gaps,
then coordinator attaches the source/build/engine matrix. No new remote CI
success, actual device result or legal/release approval is asserted here.
