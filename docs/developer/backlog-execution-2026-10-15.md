# Backlog execution — 2026-10-15

This receipt tracks work against the active functionality → regression → hardening
order. It is development evidence from the shared, modified `dev` checkout based
on `d3201f0`, not a frozen release checkpoint or production approval. Historical
Storybook evidence is retained separately; these runs use docs-owned native fixtures.

## Inventory at start

- Functionality: 570 checked, no open leaves.
- Regression: 553 checked, 17 open leaves.
- Hardening/final acceptance: 782 open leaves, including separate human, device,
  release and deferred-feature requirements.
- Website transition: 18 open checklist entries, including overlapping parents.

## Remaining regression evidence

The native fixture host was rebuilt from public compiled exports with Node 24.19.0
and typechecked before browser execution (427 fixture IDs). The browser suite uses
Chromium, one worker, canonical heavyweight/legacy validation leases, and no retries.
The initial 54-case run passed; a second focused 11-case run passed. The combined 63-case run passed in Chromium. Browser-test TypeScript validation
also passed. The report is retained under `packages/ui/artifacts/backlog-2026-10-15-regression/`.

| Task | Focused evidence under `packages/ui/tests/browser` unless stated otherwise |
| --- | --- |
| T-C05-04 | `batch05-tabs-overflow.spec.ts`: active tab visible after keyboard wrapping, automatic/manual activation, LTR/RTL and enlarged text |
| T-C06-02 | `inventory-shell-responsive.spec.ts`: responsive navigation, preserved host input, independent scroll regions |
| T-C08-04 | `modal-container-boundary.spec.ts`: narrow local surface, sticky tabs and independently scrolling panel, keyboard actions |
| T-C13-01 | `batch10-card-frame-reflow.spec.ts`: frame and slots remain bounded at narrow width/enlarged text, light/dark |
| T-C25-02 | `inventory-selection-boundary.spec.ts`: measured native selection anchor, nested scroll collision, viewport resize, focused action and host replacement |
| T-C34-10 | `editor-clipboard.spec.ts`: scoped native copy, rich/multiline paste and undo without altering another editor |
| T-P02-02 | `backlog-layout-regression.spec.ts`: real wrapped rows, token gap/padding and logical start alignment in LTR/RTL; existing `Stack.next100-regression.test.tsx` verifies public updates and isolated refs |
| T-P09-01 | `batch13-control-buttongroup.spec.ts`: shared outer border, visible logical divider, outer corners in both orientations/directions/densities |
| T-P09-02 | Same suite: density minimum height, disabled action and independent native Tab stops |
| T-P10-02 | `backlog-layout-regression.spec.ts`: neutral text action, transparent background, outer border and adjacent menu trigger with visible inner divider |
| T-P21-03 | `batch13-control-tooltip.spec.ts`: portal theme/density/direction/language and description lifetime; `backlog-layout-regression.spec.ts`: measured adjacent placement inside viewport |
| T-P25-03 | `backlog-layout-regression.spec.ts`: long ancestor has multiple real text lines inside a 220px host without overflow; current page preserved |
| T-P26-03 | Existing `src/experimental/Navigation/Navigation.test.tsx` and `Navigation.next100-regression.test.tsx`: host route callbacks, current-page ownership, native anchors, independent ListItemButton command and Disclosure expansion |
| T-P35-03 | `backlog-layout-regression.spec.ts`: loaded and rejected images preserve 40px/48px square dimensions and fallback |
| T-P46-04 | `acceptance-pack-114.spec.ts`, `batch01-grid-reorder.spec.ts`, `reorder.spec.ts`: native numeric resize, bounded commit/cancel/rollback, keyboard and trusted touch non-drag Move alternatives |
| T-S15-04 | `editor-links.spec.ts`: saved/pasted rejected destinations inert, safe links retain opener isolation, light/dark |
| T-S16-01 | `editor-image-lifecycle.spec.ts`: preview remains loaded through undo/redo/read-only, revoked once after reset/unmount, light/dark |

Unit reconciliation: Navigation (3), Navigation composition (1), Stack updates (2)
passed on Node 24.19.0. These are DOM-emulation evidence, not native browser claims.

Requested regression recheck after the docs scenario work: rebuilt and typechecked
the native fixture host from current public compiled exports, then reran the same
63 Chromium cases. All passed in 48.6 seconds with no retries, skips or failures;
the three Navigation/Stack unit files also passed all six tests. Results are in
`packages/ui/artifacts/backlog-2026-10-15-regression-recheck/results.json`.
The regression checklist remains 570 checked leaves and zero open leaves. This
recheck used the modified `dev` workspace based on `d3201f0`, not a frozen commit.

No screen-reader, physical-device, manual visual review, frozen full production
matrix, deployment or publication acceptance is implied by these focused checks.

## Initial hardening batch

The same 63 native cases passed independently in Chromium (48.7s), Firefox
(1.0m) and WebKit (1.0m), with no retries or skips. Separate results/report/traces
are retained under `packages/ui/artifacts/backlog-2026-10-15-regression`,
`backlog-2026-10-15-firefox` and `backlog-2026-10-15-webkit`. This closes the
39 primary-flow V leaves for the 13 component scopes named in the hardening
receipt, plus V-S15-01/02 and V-S16-01. Native clipboard and touch-context
cases passed in all three engines; these are browser emulation rather than
physical-device evidence. Broader upload failure/cleanup remains open.

## Website scenario completion

The existing AppShell two/three-column examples were reconciled against
`independent-scroll.spec.ts`. The remaining missing customer scenarios now use
independent Example owners and public package imports, with matching source:

| Task | Page / example implementation | Focused browser evidence |
| --- | --- | --- |
| DOCS-005-b01 | TextField / `FormIntegrationExamples.tsx`, native form reset | required/email validation, controlled and uncontrolled defaults, native reset |
| DOCS-005-b02 | AsyncMultiSelect / `AsyncSearchExample.tsx` | request pending/failure/retry, superseded query, retained selection |
| DOCS-005-b03 | DateField / `FormIntegrationExamples.tsx`, timezone instant | ambiguous time rejected, explicit earlier instant accepted |
| DOCS-005-b04 | DateRangeSelector / `LocalizedRangeExample.tsx` | independent German/Arabic locale/direction scopes retain identical civil ISO range |
| DOCS-005-b05 | AppShell / existing `AppShellScrollingExample.tsx` | separate native scroll positions, optional right navigation, narrow reflow |
| DOCS-005-b06 | AuthShell / `ShellContentExamples.tsx` | long required form, submit and footer accessible through bounded scrolling |
| DOCS-005-b07 | AppPageHeader / `ShellContentExamples.tsx` | primary action slot, condensed ancestors, current page and source |
| DOCS-005-b08 | AppDataGridShell / `GridHostExamples.tsx`, server host | combined criteria owner, stale success discarded, rejection/retry, sort and filter |
| DOCS-005-b09 | AppDataGridShell / `GridHostExamples.tsx`, persisted view | reload restores scoped storage; reset restores declared defaults without persisted selection |
| DOCS-005-b10 | LearnerClassCard / `LearnerDueExamples.tsx` | deterministic due labels, unavailable/missing content, continuation callback |
| DOCS-005-b11 | Editor / `SavedDocumentExamples.tsx`, saved guide | heading/link/list/code/table/image output, editable/read-only isolation |
| DOCS-005-b12 | Editor / `SavedDocumentExamples.tsx`, upload host | rejected first upload retains dialog; retry inserts loaded durable local asset |

The mock upload deliberately returns the predefined `/course-guide.svg` asset; it
does not transfer selected bytes. The host integration limitation is disclosed in
the example and copied source references the required host-served asset. The
required dueAt API is unchanged: unavailable host data uses its existing empty
string fallback, not an invented optional prop.

DOCS-006 is reconciled against generated public declarations, all 201 catalog
export names and the generated prop/compound/function contracts. The API compiler
host now has a fixed current directory; a focused test checks identical metadata
from repository-root and docs invocations (BUG-0001). The API/isolation/theme suite
passes 15 Node tests, and browser source panels compile against built exports.

## Library watch mode

DOCS-008 adds `pnpm build:watch` at the root and UI workspace. The command polls
only source/scripts/config build inputs once per second, coalesces changes,
serializes full public-package builds and then regenerates docs metadata. It
shares the canonical native validation leases, waits when those are occupied,
and preserves changes received during a build for the next run. SIGINT/SIGTERM
stop polling and terminate the owned child process group.

Native fs.watch exhausted the restricted environment's watcher resources during
verification; the final implementation uses a bounded polling scan. Verification
on Node 24.19.0 completed the initial build plus two stylesheet-triggered builds,
including a queued change received while building. Each emitted package/metadata
ready. Shutdown exited successfully, source SHA-256 remained identical, and both
validation leases were released. Syntax and whitespace checks passed. No Next.js
dev hot-reload or physical Windows-process shutdown evidence is claimed.

## Intermediate validation and remaining scope

The final fresh production docs build and all 21 targeted Chromium checks passed
(1.0m), including all 90 catalog routes, 904 public setup/initial/changed source
snapshots, all twelve scenario groups, source compilation, server sorting/filtering,
late response rejection, upload retry and independent shell scrolling. Local JSON
results: `apps/docs/test-results/backlog-docs-results.json`. API/isolation/theme
checks passed 15 Node tests; catalog check and docs/browser TypeScript checks
passed. `git diff --check` and syntax checks passed.

After reconciliation: F 570/570, T 570/570; 659 hardening/final-acceptance leaves
remain open (the newly discovered BUG-0001 is separately closed). Three website
entries remain open: DOCS-007 hosting/deployment/version fallback, DOCS-005-l final
production matrix, and its DOCS-005 parent. A hosting-target question is pending.
The requested complete-code audit follows backlog completion and has not been
claimed complete. Existing human screen-reader/device and release gates require
their own real evidence; they cannot be closed by these automated checks.

## Second hardening batch

The preserved 44-case control suite passed with no retries/skips in Chromium
(15.9s), Firefox (23.2s) and WebKit (23.7s). Per-engine reports/results/traces
are under `packages/ui/artifacts/backlog-2026-10-15-<engine>-controls`. These are
docs-owned native fixtures from the same public implementation as the first
fixture build; later library-watch builds changed no library source content.

| Scopes | Existing focused native evidence |
| --- | --- |
| C01 / P07 Button | `batch13-control-button.spec.ts`: native reset/submit suppression while pending/disabled, latest host press and keyboard/pointer input |
| C02 / P33 Progress | `batch07-progress-status.spec.ts`: AppInlineProgress explicitly renders public Progress, bounded values and token layout at 320px, light/dark, reduced motion |
| C03 AppOperationSteps | Same suite: milestone completion/failure/reset, stable host announcement region and single-step count omission |
| C24 EditableTitleField | `batch13-editable-title.spec.ts`: native edit/persistence rejection and host revocation in light/dark |
| P11 TextField / P13 Checkbox / P14 Switch / P15 RadioGroup | `batch01-forms.spec.ts` plus component-specific batch13 suites: real required validation, serialization, native/prevented reset, controlled host authority, disabled/read-only and selected-option replacement |
| P12 TextArea | `batch13-control-textarea.spec.ts`: native reset prevention/default replacement, refs and validation description |
| P16 Select / P17 ComboBox / P18 AsyncMultiSelect | `batch01-selectors.spec.ts`: keyboard skip/selection, focus return, empty/invalid state, retained selected records, async stale response and retry |
| P19 Menu / P20 Popover / P22 Dialog | `batch01-dialogs.spec.ts`: three owned overlay levels, native trap/dismissal/return focus, child menu/combobox Escape handling, narrow viewport and enlarged text |
| P24 Link | `batch13-control-link.spec.ts` and adapters suite: native nested-pointer/keyboard new tabs, ref focus and opener isolation |
| P28 Disclosure | `batch13-control-disclosure.spec.ts`: host collapse/removal and stable outside focus |
| P32 TagGroup | `batch13-control-taggroup.spec.ts`: removal requests, host rejection, native focus and independent tags |
| P40 TimeField | `batch13-control-timefield.spec.ts`: invalid imported default, reset feedback, midnight replacement, keyboard segment wrap and host authority in English/German |
| P43 DateRangePicker / P44 DateRangeSelector | `batch01-calendar.spec.ts`: native leap/month traversal, Apply/Cancel/Clear/reset, unavailable interior date, same civil values in Chicago/Tokyo |
| S04 / S05 consuming page only | `batch01-adapters.spec.ts`: native/custom routing, modified/external anchors, pending account callback rejection and retry |

Those 23 component scopes close 69 primary native-flow leaves. Four additional
Chromium leaves (C04/C07/C15/C17) are supported by the production docs tests for
header actions/deep breadcrumbs, long AuthShell scrolling, learner card due labels
and continuation, and persisted/server grid interactions respectively.

Six utility consuming-output leaves are reconciled narrowly: S01 ThemeScope
(scoped portal attributes and inherited identity/density), S02 Tokens and S03
CSSPipeline (built public stylesheet output with measured control/frame geometry
and named token CSS checks), S06 TranslationAdapter (German/Arabic Provider scopes
retain civil dates), S07 ICUFormatting (fallback interpolation produces the native
`Remove Design systems` name in the async selection flow), S17 DateContracts
(ambiguous datetime rejects and explicit earlier resolution returns the exact ISO
instant). These do not close the corresponding failure/cleanup leaves.

After the second batch: 570 F and 570 T checked; 123 V leaves plus the discovered BUG-0001
closed; 659 hardening/final-acceptance leaves and three website entries remain
open. This is ongoing backlog execution, not completion of the entire request.

## Broader development checkpoint

Git HEAD remains `d3201f0f0ca68aa006a880a2f63a9dd8d8c8845e` on modified dev;
these are source-scoped development results, not a frozen release attestation.

- Full library unit run: 262 files / 1,660 tests passed on Node 24.19.0.
  Report: `packages/ui/artifacts/backlog-2026-10-15-unit-results.json`.
- Initial full Chromium native run: 509 passed / 4 failed in 4.1m.
  Report: `packages/ui/artifacts/backlog-2026-10-15-chromium-checkpoint/results.json`.
  The four failures expected pre-change compact padding or the old semantic
  inventory. The exact assertions now use the density controlPadding contract,
  0.5rem compact padding, and 69 declared role swatches including textSubtle.
- After rebuilding the public native host, all 16 foundation/token cases passed
  in Chromium (6.8s), Firefox (8.7s) and WebKit (7.7s), zero skips/retries.
  Reports: `packages/ui/artifacts/backlog-2026-10-15-<engine>-foundation/`.
  No assertion was removed, skipped or made less precise. The complete 513-case
  native suite was not rerun as one green run after those updates.
- Fresh package build/import/declaration/consumer/pack audits pass. The packed
  JavaScript, types, CSS, source maps, assets and notices match current output.
- Library and browser TypeScript, foundation boundary checks, token generation
  checks and 35 token/CSS/packed-server/state-boundary/release-policy Node checks
  pass. The packed-server test requires local loopback permission; release-title
  checks use the local package-manager adapter rather than auto-downloading pnpm.

BUG-0002 was found by the first full unit run: BrushIcon had a catalog export
but lacked its supported individual public module. Added the forwarding module;
the existing per-icon import test passes, and the full 1,660-test run is green.
BUG-0003 was found by the fresh package guard: useTabOverflow used React client
hooks without its own explicit client directive. Added the directive, retaining
the SSR-safe effect selection. All 13 focused Tabs cases and the package guard pass.

The successful independent Chromium cases in the broad report supply these
additional primary-flow mappings (each remains a Chromium-only leaf):

| Scopes | Existing native evidence |
| --- | --- |
| C09 SideNavigation | `batch65-side-navigation-native-flow.spec.ts`, `navigation-shell-container-boundary.spec.ts`: hierarchy, route/action ownership, local collapse and focus |
| C10 ExperiencePageNavigator | `page-navigator-native-transactions.spec.ts`: rename, removal, accepted/rejected Move and read-only transitions |
| C11 CardCollectionWithFooter / C12 AppPaginationFooter | `inventory-card-collection.spec.ts`, `inventory-grid-shell-responsive.spec.ts`: retained card drafts, footer replacement, page-zero-before-size and accepted footer transitions |
| C14 InstructorClassCard | `batch66-instructor-card-native-presentation.spec.ts`: model replacement, native focus/one route request, host date and missing-content fallbacks |
| C16 AppDataGrid / C18 row reorder | grid focus, clipboard, numeric resize, bounded pointer/keyboard/non-drag Move and rollback scenarios in the full report |
| C19 LearnerClassesDataGrid | `inventory-learner-grid-cells.spec.ts`: encoded destinations, isolated opener, locale/fallback and host acceptance/rejection |
| C20 DataToolbar | `inventory-toolbar-composition.spec.ts`, `toolbar-container-boundary.spec.ts`: locked columns, filter/search/view requests and independent native focus |
| C21 DocumentEditorLayout / C22 DocumentEditorToolbar / C23 ContentEditorChrome | `inventory-layout-replacement.spec.ts`, `inventory-editor-chrome.spec.ts`: stable host drafts/actions, keyboard reveal and live states |
| C26 RichTextFormattingToolbar | `batch13-formatting-toolbar.spec.ts`: native heading/font-family activation with live host callback/availability replacement |
| C27 InsertContentMenuControl | `batch62-insert-menu-native-focus.spec.ts`: one native command, current callbacks, safe host form and return focus |
| C28 TextAlignMenuControl | `inventory-align-direction.spec.ts`: logical icons/physical commands, native actions and host replacement in LTR/RTL |
| C29 TextColorPickerControl | `batch63-color-menu-native-transactions.spec.ts`: native correction, commit, DOM format, clear/reset and host reload |
| C30 TextStyleMenuControl | `batch64-style-menu-native-selection.spec.ts`: real selected text, native command and host authority |
| C31 ColumnsLayoutModal | editor table-history and local modal-boundary scenarios: preset insertion and owned dialog actions |
| C32 ImageUploadModal | `image-upload-validation.spec.ts`, editor image-source/lifecycle/upload suites: file validation, retry and lifetime boundaries |
| C33 LinkUrlModal | `inventory-link-modal.spec.ts`: invalid protocol/correction, one Apply, removal preserving rich children, Cancel/Escape and reopen |
| P23 Tabs | `batch05-tabs-overflow.spec.ts` plus tabbed-dialog/native focus cases: selected panel relationships, keyboard activation and visible active tab |
| P34 Status | grid error/retry/status cases exercise the public Status primitive through OwnedGridStatus's explicit composition |
| P39 DateField | `batch11-standalone-reset.spec.ts`, `batch20-datefield-incomplete-reset.spec.ts`: standalone/programmatic reset, incomplete focus and required validity |
| P41 Calendar / P42 DatePicker | `datepicker-native-transactions.spec.ts` and native reset cases; DatePicker explicitly composes the public Calendar |

Provider (P45) has all three primary engine leaves from the fresh 16-case
foundation/token run: scoped theme/density forwarding and portal isolation.
PersistentState (S08) has a consuming browser proof through genuine multi-page
storage events and injected quota recovery (`batch15-persistent-recovery.spec.ts`);
the full unit run also covers unsubscribe on unmount and retained session fallback
(`usePersistentState.test.ts` and `.behavior.test.tsx`). Together these provide the
consumer/failure-cleanup review without substituting emulation for native storage.

Latest ledger: F 570/570 and T 570/570; 153 V leaves and three discovered bugs
closed, with 629 hardening/final-acceptance leaves still open. The website retains
three open entries. The complete-code audit requested after backlog completion
has not been declared complete or replaced by this development checkpoint.

Final reconciliation also accepts V-S14-01 from the fresh public entry/consumer/
packed-output audit; V-S16-02 from the full native upload cancellation, reset,
read-only, unmount and stale-result scenarios plus object-URL/undo lifetime checks;
and V-S17-02 from the production timezone rejection/recovery example. The date
contract module contains only parse/validation/conversion functions and types: it
owns no listener, timer, DOM or upload resource to dispose, so resource cleanup
is not applicable to that module. This is a concrete source boundary, not omitted
cleanup evidence for the stateful date controls.

Latest count after these three reconciliations: 156 completed V leaves, three
repaired bugs, 626 open hardening/final-acceptance leaves, and three open website
entries. The full-code audit remains after backlog completion.

## Requested hardening pass — supporting lifetimes

The targeted 14-file supporting-module run passed all 88 unit checks on Node
24.19.0. These are DOM-emulation/pure-function checks; no new browser or manual
accessibility claim is made by this table.

| Closed leaf | Source review and focused evidence |
| --- | --- |
| V-S01-02 | ThemeScope public replacement/unmount releases refs; `scrollbar-activity.test.ts` verifies shared document ownership, final listener/timer cleanup and cleared portal attributes |
| V-S04-02 | NavigationAdapter next100 regression replaces/removes nested providers, isolates siblings, unmounts/remounts and verifies no stale routing callback; adapter owns no asynchronous operation |
| V-S05-02 | `accounts.test.tsx` verifies safe missing host, preserved rejection identity, pending settlement after adapter replacement/unmount and independent remount; host promises remain caller-owned |
| V-S06-02 | `i18n/index.test.tsx` verifies thrown/key/placeholder/non-string lookup failures, exact namespace forwarding, nested provider isolation and live replacement; provider owns no catalog fetch/listener |
| V-S07-02 | ICU malformed syntax/invalid locale/input checks and deterministic interleaved formatting; source contains per-call parser/Intl work and no lifecycle resource |
| V-S09-02 | Pagination hook restores/normalizes malformed/versioned storage, updates size policy and discards memory state after unmount while peers retain their own models |
| V-S10-02, V-S11-02 | All four public preset factories return fresh independently mutable column/filter/sort arrays; statuses are frozen, translation requests preserve fallback/namespace; factories own no listener or pending operation |
| V-S13-02 | `GridCellsHelpers.next100-regression.test.tsx` verifies repeated pure builder results survive unrelated consumer mutation and retain current callbacks; builders own no mounted resource |
| V-S18-02 | Models dependency graph is presentation-only and declarations have no runtime state, event listener or cleanup resource; existing model-boundary tests pass |

Native engine and presentation work for this pass is tracked separately below as
it completes.

V-S02-02 additionally closes against the 12 passing token compiler checks:
missing/cyclic/mistyped references, tier/role parity and invalid dimensions fail
explicitly; interleaved compiles do not mutate input or leak state. The JSON token
source and generated variable/type maps own no runtime resource to clean up.

V-S12-01/02 closes against the fresh Chromium grid clipboard/cell flows plus
13 passing `ownedGridCells.test.tsx` cases: rejection, feedback expiry, value
replacement, unmount, stale completion and independent pending cells. V-S13-01
uses the public createActionMenuColumn builder in the AppDataGrid native fixture:
the fresh acceptance flow activates its current row action and preserves selection.
V-S18-01 uses the typechecked public LearnerClassesDataGrid consumer (its row
contract is LearnerClass from models.ts) and native encoded-route, due-date
locale/fallback and host-acceptance flows; Models owns erased types only.

V-S03-02 closes with five passing CSS pipeline checks, including a new explicit
malformed-CSS failure/recovery regression. The isolated compiler reports the
file and CssSyntaxError, preserves the previous final stylesheet and input source,
and emits corrected styles on retry. Temporary fixture roots are test-owned and
removed by registered cleanup. This does not claim atomic whole-package rebuilds:
the package build intentionally clears dist before compiling, and a failed build
is not usable output. Consumers load static CSS; no stylesheet listener is owned.

V-S14-02 closes by reviewing the public barrels and the accepted fresh package
audit: entry imports/declarations/subpaths are checked before consumer use;
the discovered missing BrushIcon subpath and Tabs client-boundary defects are
covered by the existing granular import test and package guard. Barrels own no
mounted resource; lifecycle cleanup belongs to their implementations. The packed
audit owns its temporary extraction directory and removes it in finally even
when an assertion fails. No publish or release operation is performed by it.

## Full native hardening checkpoint

chromium: 513 passed, 0 capability skips, 238.7s. firefox: 512 passed, 1 capability skips, 320.4s. webkit: 512 passed, 1 capability skips, 323.6s. No retries or unexpected failures. The single non-Chromium
skip is the CDP-only native clipboard permission-denial case; deterministic
clipboard rejection/cleanup runs in every engine. The existing assertions and
capability distinctions are preserved. Reports are under
`packages/ui/artifacts/backlog-2026-10-15-<engine>-hardening/`.

The following scopes now have all three primary engine leaves accepted. The
files below are under `packages/ui/tests/browser` (suffix `.spec.ts`); each
reports the actual native focus/layout/state behavior, not screen-reader or
physical-device testing.

| Scope | Passing native suites |
| --- | --- |
| C04 | batch10-page-header-reflow |
| C07 | batch10-auth-shell-reflow |
| C09 | batch65-side-navigation-native-flow; navigation-shell-container-boundary |
| C10 | page-navigator-native-transactions |
| C11 | inventory-card-collection |
| C12 | inventory-grid-shell-responsive |
| C14 | batch66-instructor-card-native-presentation |
| C15 | inventory-learner-card |
| C16 | acceptance; batch01-grid-focus; batch05-grid-clipboard |
| C17 | batch05-grid-shell-state; grid-server-response-races; inventory-grid-shell-responsive |
| C18 | batch01-grid-reorder; inventory-pointer-reorder-invalidation; reorder |
| C19 | inventory-learner-grid-cells |
| C20 | inventory-toolbar-composition; toolbar-container-boundary |
| C21 | inventory-layout-replacement |
| C22 | inventory-editor-chrome |
| C23 | inventory-editor-chrome |
| C26 | batch13-formatting-toolbar; editor-mixed-formatting-history |
| C27 | batch62-insert-menu-native-focus |
| C28 | inventory-align-direction |
| C29 | batch63-color-menu-native-transactions |
| C30 | batch64-style-menu-native-selection |
| C31 | inventory-editor-table-history |
| C32 | image-upload-validation; editor-upload-lifecycle |
| C33 | inventory-link-modal |
| P23 | batch05-tabs-overflow; tabs-vertical-orientation |
| P34 | batch67-progress-steps-native-state; batch05-grid-shell-state |
| P39 | batch11-standalone-reset; batch20-datefield-incomplete-reset |
| P41 | calendar-native-locales |
| P42 | datepicker-native-transactions |

This checkpoint closes 58 previously open primary engine leaves.
Visual/density/translated-name requirements remain separately tracked.

## HB-03–05: retained focused evidence

New presentation/contract cases: Chromium has 29 passing cases in its original
presentation report and the corrected preset keyboard case in
`chromium-preset-corrected`; Firefox and WebKit each passed all 30 once. The
preset test correction uses keyboard Space on the hidden native input and the
actual public Learner label; no library assertion or behavior was weakened.

The control fixture initially had a grid minimum that allowed its host to widen.
It now supplies a bounded host, and the test additionally asserts scope and
document viewport bounds. Only this changed control batch was rerun: all 16
configurations passed independently in Chromium, Firefox and WebKit under
`backlog-2026-10-15-<engine>-control-bounds`. Other passing batches were retained.

| Accepted V scopes | Explicit repeatable evidence |
| --- | --- |
| C35 | Typeface catalogue: all 15 visual roles, semantic heading and code elements, nonempty computed typography |
| C36 / P47 | Native full decorative icon catalogue (24px, hidden/focus policy) and separately named graphic; the catalog public barrel reexports the same owned icon implementations |
| C37 | Public primitives consuming presentation/control fixtures include CircularProgress/LinearProgress; remaining barrel entries are the same owned implementations covered by their individual native suites and the public-entry/package guard |
| P01/P03/P04/P05/P06/P08/P27/P30/P31/P33 | Presentation matrix: bounded long English/Arabic content, heading/region/list/separator/progress semantics, icon center, visible focus and density/theme/direction |
| P26/P27/P29 | Host routing/current-page focus, independent list selected/disabled states and keyboard collapse/expand with retained focus |
| P36/P37/P38 | Native caption/column/row headers, atomic page-size reset and navigation, native single-selection radio semantics and disabled option |
| S09 | Native session restoration and host reset across reload; prior failure/cleanup evidence remains independently accepted |
| S10/S11 | All four preset factories in independent native toolbar hosts: locked first/action columns, one host's visibility update, peer preservation and reset |
| C01/P07/P11/P13/P14/P16/P38/P02 | Control matrix: equal field heights/typography/padding/radii, row centers, icon centers, touch minimum, equal toggle widths, stable constrained Select width/ellipsis, checkbox/switch state and narrow document bounds |

The primary scopes listed above now have all three engine leaves checked.
Visual/direction leaves close for C36, P01/P03/P04/P05/P06/P08/P27/P30/P31/P33/P47
and C01/P07/P11/P13/P14/P16/P38/P02. Reviewed screenshots: all eight Chromium
presentation combinations at 360px and all eight bounded Chromium control
theme/density/direction combinations with pointer policy, at 150% root text.
Touch configurations have independent automated target/geometry assertions. This
is rendered visual review and automated native evidence, not assistive-technology
or physical-device evidence. The IconButton/Box/Surface and other public aliases
use their explicit source mappings rather than a duplicate implementation claim.

Canonical count for this request: **300 starting V items; 172 closed during this
pass; 128 remaining**, all remaining items are V-04/V-05 presentation or
translated/RTL reviews. Test-case execution counts are not backlog-item counts.

HB-06 retains the 23 passing docs geometry cases. The icon test had an indexed
locator race while hydration replaced an SVG; it now waits for both density
previews/fonts and reads one atomic geometry snapshot. The same 0.5px centering
assertions remain. Both pointer/touch cases passed in the focused recheck against
the already built docs; other cases/builds were not repeated. Reports:
`apps/docs/test-results/hardening-geometry-results.json` and
`hardening-icon-alignment-recheck.json`. This is a test correction, not a product
misalignment defect or a retry-only pass. Docs TypeScript and whitespace pass.

## HB-07: progress and status locale presentation

Eight new Chromium cases passed in 3.4s with a freshly built native host. The
scene covers light/dark, compact/comfortable, English/Arabic RTL, 360px viewport
and 150% root text. Explicit assertions preserve all four ordered step states,
translated accessible names, determinate/indeterminate semantics, atomic host
status, bar/percentage vertical centers, long-label wrapping and document bounds.
All eight rendered screenshots were reviewed. Existing state-transition and
primary engine evidence was retained without another full-suite run. This closes
V-C02-04/05, V-C03-04/05 and V-P34-04/05. Results:
`packages/ui/artifacts/backlog-2026-10-15-chromium-progress-presentation/results.json`.

At the user's request, completed entries were removed from the active F/T/V
checklists and completed master-list planning rows. Evidence stays in this receipt
and the progress/scope history. Active hardening now contains **122 remaining V
items**: **178 of the requested 300 are complete**. This replaces the preceding
128-remaining snapshot after six additional items closed; test executions and
final-acceptance/future scope are separate units.


## HB-08 — page header and tabs presentation (2026-10-16)

Closed V-C04-04/05 and V-C05-04/05. Canonical progress is **182 / 300 complete;
118 remaining**. Completed rows were removed from the active checklist.

Permanent native spec: `packages/ui/tests/browser/hardening-header-tabs-presentation.spec.ts`.
The localized composed AppPageHeader fixture exercises light/dark, compact/comfortable,
English/Arabic, 360px viewport and 150% root text. Assertions cover actual viewport
bounds, header wrapping, translated breadcrumb/action menu names, keyboard menu
focus/return, RTL tab traversal, disabled-tab skipping, full long accessible names,
selected-panel ARIA linkage and selected short-tab visibility after scrolling.
All eight Chromium and Firefox screenshot attachments were visually inspected;
mirrored breadcrumb separators, metadata and focus presentation were correct.

One typechecked public-package fixture build was hashed and frozen once. Three
engine agents used separate canonical slots/ports, immutable server bytes, one
worker and zero retries. This is bounded development evidence from the current
uncommitted source, not clean-commit production acceptance. All jobs settled and
owned slot/port leases and the root legacy bridge were released.

Results: `packages/ui/artifacts/hb08-2026-10-16/{chromium,firefox,webkit}/results.json`.
Each engine passed all eight cases (Chromium 4.6s, Firefox 6.8s, WebKit 5.7s), no
skips/flakes/failures. The manifest records fixture/spec hashes and host digest;
engine logs/resource receipts retain command and cleanup evidence. No full suite
or prior passing batch was rerun. No library implementation change was required.


## HB-09 — application and authentication shells (2026-10-16)

Closed V-C06-04/05 and V-C07-04/05. Canonical progress: **186 / 300 complete;
114 remaining**. Completed active rows removed.

Permanent spec: `packages/ui/tests/browser/hardening-shell-presentation.spec.ts`.
The localized AppShell/AuthShell consumer fixtures use light/dark, both densities,
English/Arabic, 1100px desktop then 360px/150% text. Assertions retain native
landmark/textbox names, form entry/submission, actual document/control bounds,
RTL desktop navigation side, and narrow navigation/main stacking. All 16 retained
screenshots per engine were reviewed for wrapping, alignment, focus and RTL.
Application screenshots are intentionally post-submit independently scrolled main
panes, so their clipped top headings are scrollport clipping, not evidence of
initial full-heading visibility. Authentication headings and footer wrap visibly.

The initial new fixture build reported three authored TypeScript errors (required
navigation user and overly narrow globals type). Those fixture errors were fixed
before any browser execution; the original build diagnostic is retained. One
successful typechecked/frozen host then served all three independent engine jobs.
Results under `packages/ui/artifacts/hb09-2026-10-16/{chromium,firefox,webkit}/results.json`:
16/16 each, no retries/skips/flakes/failures (6.7s / 9.3s / 8.4s). Ownership settled;
all engine leases and root bridge released. Prior accepted batches were retained.
No library implementation change was needed. This is development evidence, not
clean-commit production acceptance.


## HB-10 — localized modal and shared Dialog presentation (2026-10-16)

Closed V-C08-04/05 and V-P22-04/05. Also reconciled V-C09-04/05 against HB-09's
actual SideNavigation: long translated navigation rows, localized landmark,
RTL/LTR desktop placement and narrow stacking in both themes/densities. Native
primary/navigation interactions remain covered by the accepted HB-02 checkpoint.
No new browser run was needed solely for that mapping. Canonical progress is
**192 / 300 complete; 108 remaining**; completed rows removed.

Permanent new spec: `packages/ui/tests/browser/hardening-modal-presentation.spec.ts`.
Eight theme/density/English-Arabic configurations exercise the actual AppModal →
Dialog portal at 360px/150% text: translated dialog/title/field/close/action names,
step template, initial field focus, native entry, strict surface/content viewport
bounds, keyboard-reachable footer buttons, Escape and opener focus restoration.
All eight successful screenshots per engine were reviewed for wrapped chrome,
RTL placement, footer separation and visible focus.

The first English case passed in each engine; the first Arabic case exposed an
authored expected-digit error. Bare ICU `{current}` interpolation preserves the
supplied number string, so the translated default template is `الخطوة 2 من 3`.
The test was corrected to the supplied-template contract; no library behavior or
geometry assertion was weakened. Original failed reports remain under
`packages/ui/artifacts/hb10-2026-10-16/{chromium,firefox,webkit}/results.json`.
Only seven failed/unrun cases per engine ran next using `--grep-invert
"modal presentation: light/compact/en-US"`. All seven passed (3.6s / 4.8s / 4.3s)
in `{engine}-corrected/results.json`. The prior English pass was not repeated.
The exact same immutable host was reused without rebuilding; corrected-manifest
records the new test hash. All groups and leases settled; root bridge released.


## HB-11 — navigation and disclosure primitives (2026-10-16)

Closed V-P24-04/05, V-P25-04/05, V-P26-04/05, V-P28-04/05 and V-P29-04/05.
Canonical progress: **202 / 300 complete; 98 remaining**. Completed rows removed.

Permanent spec: `packages/ui/tests/browser/hardening-navigation-presentation.spec.ts`.
A localized composed host exercises public Link/Breadcrumbs/Navigation and actual
Disclosure → Collapse at 360px/150% text in both themes/densities/locales. Native
assertions retain landmark and link names/order/hrefs/current state, hash routing,
long labels, Enter/Space expanded state, region labeling, hidden content, focus,
actual viewport bounds and inline line-fragment containment.

Chromium 8/8 (3.7s) and WebKit 8/8 (4.1s) passed immediately. Firefox's first case
failed because inline links report clientWidth=0 while scrollWidth contains text
width. A bounded diagnostic measured every element: all actual boxes were inside
host x24..336. The test now checks every inline fragment rectangle; scrollWidth
checks still apply to non-inline boxes. This corrects an invalid inline metric,
without relaxing viewport/fragment assertions. Only Firefox's eight failed/unrun
cases ran next, 8/8 (5.3s); its original failure is retained. One unchanged frozen
host served initial and corrected runs, no rebuild. All leases/processes settled.

Reports: `packages/ui/artifacts/hb11-2026-10-16/{chromium,webkit,firefox-corrected}/results.json`.
All eight successful screenshots per engine were reviewed. Initial root crops
cut off outer focus pixels in the artifact; Firefox's full-page capture confirms
that the real viewport has a 24px gutter and the complete focus ring is visible.
This was an artifact crop, not a production clipping defect. No source behavior
change or unrelated passing browser rerun was needed.


## HB-12 — course card collection and pagination (2026-10-16)

Closed V-C11-04/05, V-C12-04/05, V-C13-04/05, V-C14-04/05, V-C15-04/05 and
V-P37-04/05. Reconciled V-P23-04/05 against HB-08's actual Tabs implementation:
long Arabic/English tabs in both themes/densities at narrow enlarged text, plus
accepted vertical/menu-overflow suites from HB-02. No repeated run solely for
this shared implementation mapping. Canonical progress: **216 / 300 complete;
84 remaining**. Completed checklist rows removed.

Permanent spec: `packages/ui/tests/browser/hardening-card-presentation.spec.ts`.
Both learner/instructor compositions consume CardCollectionWithFooter → owned
ClassCardFrame and AppPaginationFooter → Pagination. Sixteen cases at 360px/150%
text exercise themes/densities/locales, real long host titles/organization/activity,
translated navigation/actions, native page requests, controlled page-size reset,
card counts and headings, progress semantics, hrefs and actual viewport/slot bounds.
UTC browser timezone and fixed reference date keep time presentation deterministic.

One typechecked immutable host, separate three engine agents/slots/ports, one
worker each, zero retries. Chromium16/16 (8.0s), Firefox16/16 (11.2s), WebKit16/16
(10.1s). All sixteen screenshots per engine reviewed: card and footer wrapping,
metadata alignment, RTL progress/arrows and visible focus were correct; aggressive
English midword wraps at the stress width remain contained. Reports under
`packages/ui/artifacts/hb12-2026-10-16/{chromium,firefox,webkit}/results.json`.
All jobs/leases settled and root bridge released. Browser test TypeScript passed
once after HB-08–12 additions (`/tmp/sgui-hb08-12-browser-types.log`). Prior accepted
batches stayed intact; no library implementation change needed.


## HB-13 — localized form and selection presentation (2026-10-16)

Closed V-P12-04/05, V-P15-04/05, V-P17-04/05, V-P18-04/05, V-P32-04/05 and
V-P35-04/05. Canonical progress: **228 / 300 complete; 72 remaining**. Completed
rows removed. Permanent spec: `packages/ui/tests/browser/hardening-fields-presentation.spec.ts`.

Eight light/dark × compact/comfortable × English/Arabic cases at 360px/150% text
retain textarea values/multiline entry, native radio keyboard selection, labelled
ComboBox trigger and aria-controls popup relation, long option selection, bounded
popup, async multi-selection and full remove names, controlled tag removal,
accessible Avatar fallback and 0.5px square/horizontal/vertical centering bounds.
Actual document/field/list/tag bounds are repeatable assertions. All eight final
screenshots per engine were reviewed for wrapping, center alignment and RTL.
Native editable textareas/inputs retain their internal scrolling; that is distinct
from the noneditable Select ellipsis contract tested in HB-04.

Initial runs stopped at an authored exact trigger-name mismatch (actual includes
both Show options and Teaching group). Corrected Chromium then found an authored
popup-name mismatch (RAC adds Suggestions). The permanent locator now follows
ComboBox aria-controls and asserts popup role plus translated field-name presence.
No production behavior changed. Chromium confirmed all eight after these test-only
corrections before Firefox/WebKit continued in parallel. Every failed report was
retained; no successful case was rerun. All continuations used the same frozen
host without rebuilding. Final reports under `packages/ui/artifacts/hb13-2026-10-16/`:
`chromium-corrected2/results.json` 8/8 (5.2s), `firefox-verified/results.json` 8/8
(6.2s), `webkit-verified/results.json` 8/8 (6.5s). All process/lease groups settled
and the retained root bridge was released.


## HB-14 — page navigation and action overlays (2026-10-16)

Closed V-C10-04/05, V-C24-04/05, V-P09-04/05, V-P10-04/05, V-P19-04/05,
V-P20-04/05 and V-P21-04/05. Canonical progress **242 / 300 complete; 58 remaining**.
Completed active rows removed. Permanent spec: `hardening-actions-presentation.spec.ts`.

Two composed hosts at 360px/150% text in eight theme/density/locale combinations
retain editable-title native entry/save/focus, page selection and rename-dialog
flow, long page names and rows, split action/menu group bounds and menu entry,
translated popup names/direction, focused popover input, Escape return focus,
keyboard-triggered tooltip text and viewport bounds. Public ButtonGroup is also
exercised vertically. Forty captures per engine reviewed: menus, popovers,
tooltips, final actions and page navigator.

Chromium first actions case passed, then authored data-active expectation was
corrected from empty string to boolean-serialized "true". Only fifteen failed/unrun
cases continued; original successful case retained. All sixteen unique cases passed
before Firefox/WebKit ran in parallel. No fixture rebuild: reports under
`packages/ui/artifacts/hb14-2026-10-16/` include initial Chromium, `chromium-corrected`
(15/15,8.3s), `firefox-verified` (16/16,11.4s) and `webkit-verified` (16/16,11.1s).
No concrete visual defect found; root-cropped focus pixels are artifact bounds,
while full-page overlay screenshots retain their complete outlines. All groups
and leases settled and root bridge released. No production implementation changed.

## HB-15 initial reproduction — confirmed calendar regression

BUG-0004: fresh permanent date/calendar geometry test reproduced 384px scroll width
inside312px host at360px viewport/150% text, hiding Saturday. Original red result:
`packages/ui/artifacts/hb15-2026-10-16/chromium/results.json`. DateField/TimeField
native segment/value assertions passed before the Calendar bounds failure. The
shared DateRangeSelector stylesheet is used by Calendar and both date pickers;
its fixed column minimum based on full control height caused page overflow.
A shared fix fits pointer columns with owned minimum targets/caption weekday
labels and reserves an internal month scrollport when enlarged touch targets
cannot fit. New regression checks preserve touch target size and keyboard reveal.
Fresh package build, foundation guard and fixture host are required; no V item
is closed for this unfinished batch yet.


## HB-15 completed — responsive localized calendars

BUG-0004 is fixed in the shared Calendar/DateRangeSelector styles and both picker
consumers. Pointer columns fit narrow hosts; enlarged touch columns retain their
minimum targets inside a grid-only horizontal scrollport. The month heading stays
fixed, locale-native narrow weekday initials remain readable, and inset focus rings
remain visible at both outer columns. Full accessible date names are preserved.
The private weekday helper uses Intl with fixed UTC reference dates. Public props
and dependencies did not change. Component guidance now explains the behavior.

Permanent `hardening-date-presentation.spec.ts` covers eight combinations of
light/dark, compact/comfortable and English/Arabic RTL at 360px with 150% text.
Assertions include native date/time segment values, picker names and transactions,
weekday readability, calendar bounds, pointer-to-touch scope changes, minimum
44px touch targets, keyboard reveal at both edges, fixed headings, inset focus
and unchanged document width. All 24 successful captures per engine were reviewed.

Final immutable source/host receipt:
`packages/ui/artifacts/hb15-fixed5-2026-10-16/manifest.json` and
`verified-manifest.json`. Results: `chromium/results.json` (8/8,6.9s),
`chromium-regressions/results.json` (28/28,9.9s),
`firefox-verified/results.json` (36/36,28.3s) and
`webkit-verified/results.json` (36/36,24.7s). Firefox/WebKit include eight new
cases plus the same 28 existing affected calendar/picker cases. The existing
specs are calendar, calendar-native-locales, datepicker-native-transactions,
range-picker-controlled-transactions and batch01-calendar. Zero retries, skips,
flakes or unexpected results. Engine process groups and ports settled; root
bridge released. Earlier red snapshots remain under hb15 and hb15-fixed through
fixed4; they are not accepted final evidence. Unrelated passing batches retained.

Fresh library build, foundation guard and fixture build passed. Focused unit
checks passed 21 tests in Calendar.native-locales and DateRangeSelector, including
locale-native narrow initials. Browser TypeScript, real tarball/package checks,
catalog generation and catalog check passed (90 pages,201 exports,143 isolated
example owners). Logs: `/tmp/sgui-hb15-final-{package,units,types,catalog-generate,catalog-check}.log`.
Closed V-P39/P40/P41/P42/P43/P44-04/05 and removed BUG-0004 from active work.
Canonical progress: **254 / 300 complete; 46 remaining**.


## HB-16 completed — typography, table and inherited density

Closed V-C35/P36/P45-04/05. Canonical progress: **260 / 300 complete; 40 remaining**.
The actual fifteen Typography roles used by Typefaces are covered in English and
Arabic RTL, both themes/densities at 360px/150% text; retained HB-05 covers the
catalog itself. Native Table caption, column/row headers and headers associations,
RTL ordering, deliberate horizontal scrolling and focused link reveal are asserted.
Provider parent density changes inherited Button height; a nested explicit scope
retains its chosen density. All 32 captures per engine were reviewed separately.

Immutable host/initial manifest: `packages/ui/artifacts/hb16-2026-10-16/`.
Reports: `chromium/results.json` (8/8,6.6s), `webkit-verified/results.json`
(8/8,7.1s), `firefox-corrected/results.json` (8/8,6.0s). No retries/skips/flakes.
Firefox initially failed because inline code has clientWidth=0 while its line
fragments fit. Read-only diagnostic recorded actual code bounds 24–314.95px and
all block bounds 24–336px; permanent assertions now verify every inline fragment
and retain scroll-width checks for boxes. Only Firefox failed/unrun cases resumed;
other engines and host build retained. Initial Firefox report and diagnostic import
failure preserved. Initial report global error is Playwright max-failures abort,
not a separate runtime exception. Full-page diagnostic supplements cropped samples.
All engine jobs settled and bridge released. No production implementation changed.


## Public primitives presentation reconciliation

Closed V-C37-04/05 without duplicating accepted native runs. Source reviewed:
`packages/ui/src/components/primitives/index.ts` reexports owned implementations;
it introduces no independent layout, translation or interaction behavior.
HB-03: Box/Stack/Typography/Divider/Chip/List/Table parts' shared text foundation;
HB-04: TextField/Checkbox/IconButton/Select/Switch/Button and shared control
geometry; HB-07: CircularProgress/LinearProgress adapters and Progress;
HB-11: Link/Collapse and nested list/navigation presentation; HB-13: ComboBox
(including Autocomplete alias); HB-14: Menu/Tooltip; HB-16: native Table and all
parts, Provider/ThemeScope inheritance, all Typography roles. Those batches retain
their named engine/theme/density/locale evidence. The public-entry tarball guard
passed after the latest production calendar changes; aliases have no duplicate
implementation to validate. Canonical progress: **262 / 300 complete; 38 remaining**.
Browser TypeScript passed after HB-16 and new grid assertions. Catalog API and
example-isolation unit files passed; logs `/tmp/sgui-hb16-types.log` and
`/tmp/sgui-hb16-catalog-units.log`.


## HB-17 completed shared grid fixes; proof-label follow-up retained

Closed V-C16/C17/C18/C19/C20-04/05: AppDataGrid, shell, reorder, learner grid and
DataToolbar. Canonical progress **272 / 300 complete; 28 remaining**. Public
DataGrid's P46 pair stays open for HB-18's four Arabic host-label cases; all its
runtime and bounds checks already pass. This distinction does not change the
original 300-leaf denominator.

BUG-0005 reproduced a stable 691px document width at360px/150% text. Read-only
native diagnostics identify two visually hidden absolute resize inputs ending at
427px/691px outside their unpositioned scroll ancestor. Public DataGrid's container
now establishes position:relative so those inputs stay inside its scrollport.
BUG-0006 was found by Firefox/WebKit screenshot review despite passing initial
assertions: enlarged reorder buttons/rings overlapped adjacent course links.
The owned reorder control group now wraps within its utility column and the drag
handle honors the shared minimum touch width. Row height grows with its content.
New permanent assertions bound each button and active focus ring inside its cell,
then switch the actual Provider to touch and require >=44px in both axes with cell
containment. Original red reports/diagnostics are preserved under
`packages/ui/artifacts/hb17-typed-2026-10-16/`; the initial missing learner-model
fields are preserved in `hb17-2026-10-16/build.log`.

Final source/immutable-host manifests: `packages/ui/artifacts/hb17-fixed-2026-10-16/`.
New `hardening-grid-presentation.spec.ts` covers four compositions × eight
light/dark, compact/comfortable, English/Arabic RTL combinations at360px/150% text.
It asserts labels, header order, native link/cell arrow navigation and reveal,
selection, host reorder, search, shell/card switching, local scrolling and page
bounds. Initial authored cell-entry assumptions were corrected by observing React
Aria focus; six then four then fourteen successful cases were retained during
continuations. After genuine production styles and localized fixture content changed,
the affected32-config matrix ran fresh. Unrelated earlier families were retained.

Final results: `chromium/results.json`32/32(19.2s),
`chromium-verified/results.json`14/14(14.7s),
`firefox-verified/results.json`46/46(48.0s),
`webkit-verified/results.json`46/46(41.8s). Existing regression files:
acceptance-pack-114(1), batch01-grid-focus(5), batch01-grid-reorder(3), reorder(5).
Zero retries/skips/flakes/unexpected results. All40newcaptures/engine reviewed:
original overlap resolved; tall proof rows reflect untruncated wrapping content,
not hidden or overlapping text. One Arabic proof fixture string, Select none,
remains English and is corrected/checked separately in HB-18. All jobs/ports
settled and root bridge released.

Fresh library, foundation and fixture builds passed. Eleven focused grid/handle
unit cases, browser TypeScript, catalog generation/check and API/isolation guard
units passed. Logs `/tmp/sgui-hb17-fixed-{types,grid-units,catalog-generate,catalog-check,catalog-units}.log`.
Guidance documents utility wrapping and resize containment. Fresh real tarball
validation runs with HB-18's build; no public API/dependency/version changes.


## HB-18 completed — editor dialogs and shared focus-outline clearance

Closed V-C31/C32/C33/P46-04/05. Canonical progress: **280 / 300 complete;
20 remaining**. Initial immutable host `packages/ui/artifacts/hb18-2026-10-16/`
passed12cases in each engine: eight editor-dialog configurations and only four
Arabic proof-grid follow-ups (Select none host translation). Reports:
`chromium/results.json`12/12(7.4s), `firefox-verified/results.json`12/12(11.6s),
`webkit-verified/results.json`12/12(10.8s). All28captures/engine reviewed. Proof
label passes retained through the subsequent shared Dialog fix; no broad grid rerun.

Screenshot review found BUG-0007: image-description input bounds fit, but the
lower focus outline was clipped by the body/footer boundary. The existing shared
Dialog reveal helper measured only the control rectangle. It now includes the
computed outer outline; focused descendants use token-backed scroll margin so
native scrollIntoView leaves outline clearance. This benefits every Dialog and
AppModal consumer. The permanent test uses native Tab/Shift+Tab to re-enter the
field and asserts all four outline edges remain inside the body scrollport.
It also covers long headers/filenames, actual file selection and descriptions,
radio presets, translated errors, invalid/valid URL submission and opener focus.

Final source/immutable host: `packages/ui/artifacts/hb18-fixed-2026-10-16/`.
Results: `chromium/results.json`8/8(5.4s),
`chromium-verified/results.json`26/26(18.6s),
`firefox-verified/results.json`34/34(32.2s),
`webkit-verified/results.json`34/34(30.5s). Existing affected cases are
batch01-dialogs(5), batch50-dialog-header-reflow(8),
hardening-modal-presentation(8), modal-container-boundary(5). Zero retries,
skips, flakes or unexpected results. All24newfinalcaptures per engine reviewed;
the complete bottom ring is visible above the footer in all configurations.
Every engine group/port/slot settled and both browser bridges released.

Fresh library/foundation/fixture builds, 23 focused Dialog/AppModal unit cases,
browser TypeScript, catalog generation/check and API/isolation guard units passed.
Logs `/tmp/sgui-hb18-fixed-{types,grid-units,catalog-generate,catalog-check,catalog-units}.log`
(the grid-units filename is inherited; its actual command targets Dialog/AppModal).
Real tarball checks also ran against the new grid build in HB-18 preparation;
final Dialog output validation is `/tmp/sgui-hb18-final-package.log`.
Guidance describes shared focus reveal. No API/dependency/version change in this
slice. BUG-0007 and completed checklist rows removed.

At the user's explicit stopping boundary, leave the remaining20editor V leaves
open and commit/push all workspace work to dev. Do not continue the next batch
or claim original300 completion. Final acceptance320/future6 stay separate.
