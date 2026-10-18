# X08 source revision: inline calendar and shelf controls

This supersedes the popup prototype preserved in popup-prototype-superseded-*.
The prototype was rejected because the human wants one popup at a time. No heavy
validation, browser host or build was started during this source revision. No Git
index/branch/commit/push/release or acceptance-count mutation was made.

## Calendar contract

Adjust dates toggles an inline mode inside the existing calendar surface. It
reveals Whole range, Start date and End date operation buttons, restricted to the
enabled rangeDragBehavior. Click a day in the existing month grid as the target;
move uses the selected range's start as its anchor. Existing month/year inline
navigation and previous/next arrows supply arbitrary target jumps. One-day buttons
remain available for the selected operation. Toggling Adjust dates again restores
normal day-click policy. There is no Popover or DatePicker inside these controls.
All locale/reference/navigation context remains the owning selector's context.

A candidate is resolved with resolveRangeDrag, validated over the complete interval
and passed to the existing edit path. The same candidate validation controls day
availability and its explanation while adjustment mode is active. Disabled dates
include coupled endpoint/length/bounds/availability failures. Outside adjustment
mode the original static/endpoint-aware availability behavior is preserved,
including a static unavailable record whose reason is empty. Bounded length pushes
the opposite boundary just as dragging does. Required hidden-field ranges can
collapse without Clear; arbitrary target jumps bypass invalid intermediate ranges.
Rejected controlled hosts retain committed form wires while draft requests remain
local under the existing contract. No action appears for disabled, read-only,
no-drag, incomplete/malformed or fixed-duration ranges. Fixed ranges retain their
existing one-click relocation. No public API/export was added.

Three focused calendar tests preserve required nearest collapse, bounded
adjust-end coupling with a rejected host, invalid limits, fixed relocation and
unavailable gesture states. They also exercise a direct calendar target and a
cross-month jump, assert zero dialogs for the inline selector, and assert one
DateRangePicker dialog while adjusting. An immediate picker commit then closes
its sole dialog as before; it does not keep a popup open artificially.

## Shelf resize contract

When resizable is true and a panel is open, Narrower/Wider buttons appear inline
below its existing heading, outside the role=separator. Each click changes the
measured rendered width by one CSS pixel through the exact existing resize()
geometry/clamp and onResize path. The rail retains that request per panel and
calls onPanelWidthChange(width, itemId). This is independent of rail side/RTL;
physical separator arrows/drag directions retain their existing mapping. Buttons
have translated labels and one-pixel descriptions, disable at effective measured
limits, and open no popup. Turning resizable off removes separator and buttons.
No controlled width prop, host persistence or new public API was introduced.
The existing resize unit case now verifies pointer callbacks, fixed bounds, no
interactive descendants of the separator and default-off absence while retaining
its keyboard/direction/limit assertions. Existing resizable docs examples now
explain the one-pixel alternative; component usage and JSDoc are current.

## Editor

The separate two-click Lexical table rectangle selection and visible selected-cell
outline remain. The new unit test verifies the actual 2×2 TableSelection, four
DOM markers, cancellation and read-only/re-enable. Existing table editing/history
is retained. No speculative image-resize feature was added.

Root's follow-up review identified root-only table discovery. ColumnsLayoutModal
inserts ordinary TableNodes rather than a distinct column/layout node. The editor
also registers QuoteNode, admission recursively accepts registered nodes, and
Lexical's mutation-based table observer attaches handlers below the root. Discovery
now uses public $nodesOfType(TableNode) plus isAttached() in this editor's read
context. The nested-editor ownership guard and merged-cell selection solver are
unchanged. One new focused case uses the production registered node set: a 2×2
table remains inside a quote with TablePlugin mounted, survives prepareEditorDocument
admission, exposes the pointer action and produces the same 2×2 TableSelection
and four selected-cell DOM markers. This establishes a supported below-root shape;
no claim about a speculative custom layout or image/block feature is needed.
The two editor selection cases passed under Node 24.19.0 and library type checking
passed. Together with the prior 27-test suite this is 28 unique focused tests;
the full suite was not repeated solely for freshness. The finite browser plan
remains nine X08 cases, sharing the upcoming host with root's six D15 cases.

## Light evidence and finite heavy plan

Node 24.19.0: five focused unit files passed 27 unique tests. The final amended
calendar case is checked again as a focused three-test run; do not add duplicate
reruns to the unique evidence count. Library/browser-spec/docs/native-fixture
TypeScript checks and owned foundation guard passed; final library type check and
git diff --check are recorded in the transcript. Registry generation: 498 fixture
IDs. Initial popup-test expectation incorrectly kept an immediate picker popup
open after commit; it was corrected to retain the existing close-on-commit
contract, while asserting exactly one dialog before commit. No passing native
browser evidence is claimed here.

Ready finite coordinated lane:
1. Build the library once; then catalog:generate and catalog:check from fresh
   declarations, including updated Contains/API metadata.
2. Build one immutable private fixture tree using canonical heavy/host/port leases.
   Keep owned 6173 and exclude the user's 3000.
3. Run only x08-pointer-alternatives.spec.ts, one worker/no retries. There are now
   three tests × three engines = nine cases: calendar required/bounded/rejected
   host plus no-extra-dialog picker; two-click editor rectangle; and shelf width
   steps/maximum/callback/retention on LTR-start and RTL-end rails. The new shelf
   case is why this plan expands the earlier six to nine cases.

The private calendar fixture owns accepted-nearest and rejected-bounded instances
separately plus a picker. The existing saved-rich-document fixture is the editor
host. A new Foundation Catalogue pointer-panel-widths fixture provides independent
LTR-start and RTL-end shelves with a small bounded width for finite assertions.
All three tests are authored/typechecked, not executed. Native focus, actual width
clamping and rendering still require that coordinated evidence. X08 remains open
pending validation/review; the previously named separator source gap is addressed.
Grid widths/Move alternatives reuse accepted evidence without new matrix runs.

## Escape review correction

Removed the adjustment wrapper's blanket onKeyDown stopPropagation, left over
from the rejected nested-field/popup prototype. RangeGestures already gates its
modifier handler on actual data-sgui-date targets; operation buttons therefore do
not need suppression. Escape now reaches the containing DateRangePicker overlay.
The existing third calendar unit case now dismisses from the End date operation
button, waits for the normal asynchronous trigger-focus restoration, reopens and
retains its immediate-commit assertions. All three calendar cases pass on Node
24.19.0. The existing calendar browser case adds the same Escape/closed-dialog/
trigger-focus assertions after interacting with the inline operation. It remains
one case, so the native plan stays three scenarios × three engines = nine. The
browser-spec type check passed. No CSS, host or heavy build was touched.

## Executed validation and concrete native focus correction

The initial shared library/catalog/private fixture build succeeded. Catalog
validation passed, declarations were available for the coordinator, and nine X08
native cases ran with one worker/no retries. Calendar and shelf cases passed all
three engines (six retained passes). All three editor cases selected their table
rectangle, then failed the retained Escape cancellation assertion: suppressing
native cell pointer focus left focus on the action outside the editor root.
The two-file correction deliberately focuses that owning root before setting the
Lexical TableSelection. Its strengthened unit uses actual user pointer clicks and
keyboard Escape. A test-only virtual overlay reproduced the failure, the proposed
implementation passed both root/quote cases, and the actual applied source also
passed both. No native assertion was weakened.

Root completed its first D15 run before the original host was closed and all three
claims released. The focus fix required a fresh library/fixture output; all 445
public declarations remained byte-identical. The second attempt preserved two
setup conditions: an incorrectly anchored Playwright filter selected no cases,
and the incoming root direction-decorator/test changes caused stability rejection.
That attempt closed its host and claims, and contributes no passing cases.

The third attempt verified/reused the exact focus-fixed library digest, rebuilt
only root's corrected private fixtures, passed browser typing, and ran exactly the
three editor cases across Chromium/Firefox/WebKit. All three passed in 5.1 seconds;
admitted source and output digests stayed stable. The effective X08 evidence is
nine passes: retained six calendar/shelf cases plus current three editor cases.
The relevant retained component/fixture/spec hashes were reconciled unchanged
between the first and third admissions in completion-receipt.json. The full nine
and all-state matrix were not repeated.

The latest immutable host remains http://127.0.0.1:6173 for root's corrected D15
Chromium run, using editor-native-03 admission. Invoke run-root-d15-retry.mjs with
Node24; it uses state.config.cjs, six cases/one worker/no retries, and no build.
Root owns D15 context/visual reconciliation and its acceptance conclusion. Stop
file editor-native-03/stop-request remains pending root completion; original and
second host cleanup receipts are retained. No baseline was updated, no paused
Apple file was touched and no Git index/commit/release action occurred.

## Final coordinator handoff

Root reported all six corrected D15 Chromium cases passed with measured contexts.
On that signal editor-native-03 was stopped and all owned claims released; its
cleanup receipt is final. No host remains running. operation-mapping.md/json maps
every original drag-alternatives row and the additional active sort/shelf families
to keyboard and non-drag pointer paths, with inactive editor resize/host-extension
boundaries stated explicitly. selective-stage.json enumerates exactly 25 source/
docs/generated metadata files, precise summary/reproduction files and bounded raw
evidence; root-owned D15 changes are separate except the deliberately shared
DateRangeSelector CSS file. Paused Apple files and unrelated work are excluded.
Coordinator review/integration is the remaining action; no acceptance counts were
changed by this task.
