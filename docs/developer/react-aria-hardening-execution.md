# Resumable hardening execution

This is an execution index for the existing V checklist, not additional acceptance
tasks or another completion count. Preserve independently passing evidence across
sessions. The starting request has 300 open V leaves; acceptance/future items are
outside this pass.

## Batch rules

- Choose one component family and one requirement. Split engine evidence into
  separate results, retaining every successful engine when another fails.
- Record completion immediately: V IDs, exact test cases, command, browser,
  changed inputs, result path and any remaining limitation.
- After a failure, run only the failing cases and tests affected by the fix.
  A failure in one component does not invalidate unrelated passing components.
- Reuse accepted coverage when neither its behavior nor relevant inputs changed.
  Review implementation, imported interaction/style helpers, shared tokens,
  fixtures and assertions when deciding the affected scope. A documentation-only
  edit does not invalidate component behavior evidence.
- For shared changes, run representative affected families first. Reserve a full
  cross-browser suite for a deliberate checkpoint or a concrete broad regression.
- Build each fixture host once for a source snapshot. Never rebuild a host while
  a suite is using it. Keep canonical validation leases and one native worker.
- At a stopping boundary, record the first unfinished batch and exact failure
  or next action. Do not restart completed batches to reconstruct status.

## Current batches

| Batch | Bounded requirement | Evidence / next action |
| --- | --- | --- |
| HB-01 | Supporting module failure/cleanup | Complete: 88 supporting unit checks, 13 cell checks, 12 token checks and five CSS checks. V mappings are in the execution receipt. |
| HB-02 | Missing primary engine evidence | Complete: independent reports retained; 58 missing engine leaves closed. |
| HB-03 | Presentation primitives: bounded long labels and semantics | Complete: eight new cases in all three engines; rendered review recorded separately. |
| HB-04 | Shared controls: geometry and alignment | Complete: sixteen configurations in all three engines, including strict viewport bounds. Rerun only affected configurations for alignment fixes. |
| HB-05 | Missing native consuming contracts | Complete: six contracts in all three engines; the corrected preset case was rerun alone in Chromium. |
| HB-06 | Previously reported website sizing defects | Complete: 23 passing cases retained, two atomic icon-measurement cases passed after test correction; no broad rerun. |

HB-03–05 share one updated host build. Their runtime assertions stay separate
from screenshot review. Subsequent families should receive similarly bounded
batches as the remaining V-04/V-05 gaps are reviewed; do not prepopulate empty
defect tasks or invent acceptance evidence.

Results and exact V closures belong in
[the execution receipt](backlog-execution-2026-10-15.md). The canonical remaining
items stay in [the hardening checklist](react-aria-hardening-tasks.md).

Current canonical progress: **286 / 300 complete; 14 remaining**. This counts V
checklist items only, not test cases, engine executions, acceptance or future work.

HB-07 complete: AppInlineProgress/AppOperationSteps/Status long-content and
Arabic RTL presentation. Eight new Chromium cases passed; all eight rendered
combinations were reviewed. Existing primary-engine/state evidence was retained.
C02-04/05, C03-04/05 and P34-04/05 were removed from the active list.

HB-08 complete: AppPageHeader/AppPageTabs composed presentation. Eight cases per
engine passed independently in Chromium, Firefox and WebKit. Long-content header
reflow, translated names, RTL keyboard traversal, disabled skipping and selected-tab
visibility are permanent assertions. All eight Chromium and Firefox screenshots
were reviewed; breadcrumb mirroring and focus remained correct. C04-04/05 and
C05-04/05 were removed from the active list.

HB-09 complete: AppShell/AuthShell. Sixteen cases per engine passed; all retained
screenshots were reviewed in each engine. Header/form/footer bounds, localized
labels and desktop-to-stacked RTL shell geometry are permanent assertions.
C06-04/05 and C07-04/05 were removed from the active list.

HB-10 complete: AppModal and its actual Dialog implementation. Eight unique cases
per engine passed across retained first pass plus seven-case continuation; all
successful screenshots reviewed. C08-04/05 and P22-04/05 removed. HB-09 also closes
C09-04/05: its composed host renders the actual SideNavigation with long translated
rows and landmark names in both layouts/directions, reviewed in all engines.

First unfinished family in checklist order: FloatingTextSelectionToolbar (V-C25-04/05).
Retain unaffected prior batches and rerun only relevant source or assertion changes.

HB-11 complete: Link/Breadcrumbs/Navigation/Disclosure/Collapse. Eight configurations
per engine passed. Firefox's inline clientWidth=0 required a test-only correction;
actual line fragment bounds remain enforced, alongside scroll bounds for boxes.
Its eight failed/unrun cases ran alone against the same host; Chromium and WebKit
passes were retained. All successful screenshots reviewed. P24/P25/P26/P28/P29
V-04/V-05 rows removed. HB-12 adds the course-card/pagination composed family.


HB-12 complete: CardCollectionWithFooter/AppPaginationFooter/ClassCardFrame/
InstructorClassCard/LearnerClassCard and underlying Pagination. Sixteen cases per
engine passed, all screenshots reviewed. C11–C15 and P37 V-04/V-05 removed. HB-08
also exercises the actual public Tabs implementation through AppPageTabs; combined
with retained native vertical/menu overflow coverage, it closes P23-04/05 without
another engine run. Browser TypeScript passed after HB-08–12 additions.


HB-13 complete: TextArea/RadioGroup/ComboBox/AsyncMultiSelect/TagGroup/Avatar.
Eight cases per engine passed and all screenshots reviewed. Two authored ComboBox
selector errors were corrected; Chromium verified the complete authored flow
before Firefox/WebKit continued in parallel. The same fixture host was reused.
P12/P15/P17/P18/P32/P35 V-04/V-05 removed. Keep original failed reports and final
successful per-engine reports separately. No production implementation changed.


HB-14 complete: ExperiencePageNavigator/EditableTitleField and ButtonGroup/
SplitAction/Menu/Popover/Tooltip. Sixteen unique cases per engine passed; all
40 screenshot attachments per engine reviewed. One boolean data attribute
expectation was corrected in Chromium; its original passing case was retained.
C10/C24/P09/P10/P19/P20/P21 V-04/V-05 removed. HB-15 reproduced a real shared
calendar overflow (BUG-0004); a fresh library/fixture build validates its fix.


HB-15 complete: DateField/TimeField/Calendar/DatePicker/DateRangePicker/
DateRangeSelector, including BUG-0004. Final eight new cases passed in each
engine; 28 affected existing regressions passed in each engine. All 24 new
captures per engine reviewed. Permanent assertions cover weekday readability,
fixed captions, both-edge touch focus/targets and page bounds. P39–P44 V-04/V-05
and the completed defect were removed. Exact final reports and earlier red
snapshots remain in the execution receipt. Unaffected browser batches retained.


HB-16 complete: Typefaces, native Table and Provider scope inheritance. Eight
configurations passed in each engine. Fifteen public typography roles, localized
native table header associations/RTL order and horizontal focus reveal are
permanent assertions. Parent density cascades while an explicit nested override
stays fixed. Firefox inline code required fragment-based measurement rather than
clientWidth=0; only its eight failed/unrun cases continued against the same host.
All 32 captures per engine reviewed. C35/P36/P45 V-04/V-05 removed.


C37 primitives barrel V-04/V-05 reconciled without another browser run: its
runtime exports are direct aliases of the owned implementations already covered
by HB-03/04/07/11/13/14/16. Progress adapters are covered by HB-07 and Table by
HB-16; no separate barrel styles or interaction implementation exists. Public
entry/tarball validation preserves alias identity. Evidence mapping is in receipt.


HB-17 complete for AppDataGrid/AppDataGridShell/AppDataGridRowDnd/
LearnerClassesDataGrid/DataToolbar: C16–C20 V-04/V-05 removed. BUG-0005/0006 fixed
and validated. New32cases plus14existing grid regressions passed in eachengine;
all40newcaptures/engine reviewed. HB-18 completes the four Arabic proof-label follow-ups and closes P46-04/05.
Reports and exact retained earlier passes belong in the receipt. Bridge released.

HB-18 complete: ColumnsLayoutModal/ImageUploadModal/LinkUrlModal plus the four
Arabic proof-grid label follow-ups. C31/C32/C33/P46 V-04/V-05 removed. BUG-0007
fixed through shared Dialog focus-ring reveal bounds and owned scroll margin.
Eight new dialog cases and 26 existing affected overlay cases passed in each
engine; 24 new final captures per engine reviewed. Prior four Arabic proof cases
per engine retained. Dialog/AppModal units, browser types, catalog guards and
final tarball validation recorded in receipt. All jobs and bridges settled.

Stopping boundary requested by the user: wrap this task, commit all workspace
changes to dev and push. Do not start HB-19 in this pass. Resume at the 20 remaining
V leaves for editor layout/chrome/formatting controls and rich editor (C21/C22/C23/
C25/C26/C27/C28/C29/C30/C34). Accepted original300 progress is280; final acceptance
and explicitly deferred future items remain separate. No production release.

## iOS Simulator and actual VoiceOver automation — 2026-10-16

The user prefers a simulated phone. Xcode27.1 and an installed iOS27.0 iPhone18Pro runtime were verified locally. The private XCTest project in `packages/ui/tests/apple` drives Safari on that simulator, changes First status to Active, enables Apple's `XCUIDevice.shared.voiceOverService`, moves forward and captures actual returned utterances. Names/values for both independent selectors are asserted; the transcript and screenshot are retained in the xcresult. This uses no Appium/Guidepup or new consumer/runtime dependency.

From repository root with supported Node22/24 and fresh compiled native fixtures:

```sh
node packages/ui/tests/apple/run-simulator.mjs --output /absolute/new/evidence-directory
```

The output directory must not exist. The driver acquires the existing serial validation leases itself; do not wrap it in another lease helper. It uses loopback6183 by default (`--port` can override, excluding3000), snapshots fixture bytes, builds a standalone UI-test runner, picks an installed iOS27+ iPhone simulator (`--device` accepts a specific simulator ID), sets the generated xctestrun environment, and runs without parallel workers or automatic failure diagnostics. It restores shutdown state if it booted the device, closes its own host, and saves source/fixture hashes, logs, process statuses, summary and xcresult. No runtime download, device erase, account sign-in, physical phone or changes to user server3000 are needed. First-use Xcode components may initialize through xcrun.

[Proof and repeat receipts](final-acceptance/apple-simulator/results.json) retain the initial locator failure and two successful executions. The repeatable driver passed build/test/summary/shutdown. Returned speech includes `Active First status Pop up button` and `Draft Second status Pop up button`; speech hints/verbosity are not exact snapshots. Xcode toolchain warnings remain in the logs.

This establishes actual automated simulator VoiceOver capability, reducing required operator work. It does not certify physical gestures or complete A-X-11's manual six-family review, browser/OS support matrices, all announcements, rotor/gesture usability, or the20 editor V leaves. Expand the existing named scenarios next; keep human experience and physical-device observations separate. No acceptance checkbox/count changes follow from this one smoke.


HB-19 complete: DocumentEditorLayout/DocumentEditorToolbar/ContentEditorChrome
C21/C22/C23 V-04/V-05 close with the reused AcceptanceComposition host and
strengthened existing wave03 chrome spec. Nine cases pass across all three engines,
covering 24 theme/density/locale configurations; all 24 screenshots were inspected.
Native Arabic/English bold and heading commands, dialog direction/return focus,
resolved production scopes, semantic reading order and independent host scrolling
are permanent assertions. No library source changed. Evidence:
[editor chrome presentation](final-acceptance/editor-chrome-presentation/results.json).
Resume at the remaining 14 editor V leaves; A and future counts are unchanged.
