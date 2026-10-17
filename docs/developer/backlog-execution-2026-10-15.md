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


## CAL-UX — calendar options and entry, 2026-10-16

User-requested follow-up on `dev` based on `540f47d`; this is a modified source
snapshot, not a release checkpoint. Completed the following bounded deliverables:

- CAL-UX-01: Calendar and range grids reserve six week rows; shared day targets
  center numbers vertically and horizontally. Existing touch minimum targets and
  horizontal grid scroll/reveal remain intact.
- CAL-UX-02: Source-backed independent Calendar examples show 12rem compact and
  20rem comfortable footprints. The Calendar page also demonstrates a single-date
  dropdown and both range dropdown configurations.
- CAL-UX-03: DateField's optional date-only `entryMode="text"` is forwarded by
  DatePicker and both range controls. Explicit ISO/compact/year-first formats,
  locale-ordered numeric dates, localized digits and localized/English month names
  normalize on blur/Enter. Invalid dates, rollover, two-digit years and relative
  prose are rejected. Controlled callbacks and form data retain ISO civil dates.
- CAL-UX-04: DateRangePicker shows localized committed endpoints in a field-shaped
  trigger, with editable start/end fields above one or two range calendars.
  Invalid text blocks Apply; Cancel/reset/presets/calendar selection clear stale
  text drafts. The one-month popup has an explicit bounded preferred width.
  Preview space is reserved before pointerdown, preventing the popup from moving
  the chosen day away before pointerup and cancelling a two-month selection.
- CAL-UX-05: A top-level Calendar component-navigation category groups Calendar,
  DateField, TimeField, DatePicker, DateRangePicker and DateRangeSelector. The
  category has its owned calendar icon and retains the shared Back/search behavior.

Validation on Node 24.21.0 after restoring this computer's dependency links with
`pnpm install --frozen-lockfile --force` (no lockfile/package changes):

- `pnpm --filter @structured-growth/sg-ui exec vitest run
  src/experimental/DateField src/experimental/Calendar src/experimental/DatePicker
  src/experimental/DateRangePicker src/experimental/DateRangeSelector`: 66 tests
  across 16 files passed. Five new cases cover parsing, form/reset/controlled text
  entry, invalid-range blocking and Apply/Cancel.
- Library typecheck/build, foundation guard, browser-test TypeScript and fresh
  production docs build passed. Catalog/API/isolation/theme checks passed; 90
  pages, 201 export names, 146 example owners. Generated API/composition metadata
  was reconciled against the built package.
- Production Chromium docs checks: the five existing grouped-navigation cases
  passed; both catalog cases passed, including all 90 routes and 920 compilable
  setup/initial/changed example snapshots. Four new calendar-option cases passed
  across retained unaffected passes and the final range verification. They cover
  12 successive month heights in each density, selected-day centering, typed and
  picked values, independent sibling source, both range layouts, stable preview
  height, narrow viewport bounds and Escape/focus return. Source snapshots compile
  against public declarations. Earlier red traces remain separate from final
  results; final range screenshots were reviewed.
- Fresh native fixture build and 38 Chromium cases passed, zero retries/skips:
  batch01-calendar, batch61-keyboard-range-preview, calendar, calendar-native-locales,
  datepicker-native-transactions, hardening-date-presentation and
  range-picker-controlled-transactions. Results:
  `packages/ui/artifacts/calendar-options-native/results.json`. Native cases retain
  reset/controlled ownership, timezone-civil behavior, keyboard descriptions,
  light/dark, both densities, English/Arabic RTL and enlarged touch target checks.
  The localized range-trigger assertion now checks the same civil start date in
  its documented localized presentation rather than ISO display text.

Logs are `/tmp/sgui-calendar-{units-final,foundations-final,browser-types}.log`,
`/tmp/sgui-calendar-final-sizing-build.log` and
`/tmp/sgui-calendar-native-regressions.log`. Website evidence is retained under
`apps/docs/artifacts/calendar-options-final` (catalog and unaffected cases),
`calendar-range-final` (both corrected range flows) and the initial
`/tmp/sgui-calendar-docs-browser.log` (grouped navigation).

Firefox/WebKit checks for this follow-up remain pending the next affected batch;
no physical-device, screen-reader or production-release acceptance is claimed.
The existing 20 editor V leaves, 320 A leaves and six deferred features stay open.
No scheduler/booking feature, version change, commit, push or release was performed.


## CAL-PRESET — configurable side panel, 2026-10-16

Completed the user-requested follow-up on the uncommitted CAL-UX snapshot based
on `540f47d`:

- CAL-PRESET-01: optional `presetPlacement="side"` on DateRangeSelector and its
  DateRangePicker wrapper. A bordered, named preset group sits beside one or two
  calendars and stacks in narrow hosts. The default above placement is preserved.
  Pressed state follows draft endpoints; selected choices use owned Button filled/
  primary props, including normal hover/focus/disabled behavior.
- CAL-PRESET-02: exported `getRelativeDateRange`/`RelativeDateRangeOptions` through
  `/experimental`, registered with the selector's public catalog metadata. The
  helper resolves full inclusive Gregorian weeks/months/years and integer offsets
  from an explicit civil reference date. Week start is explicit, Monday by default.
  No browser clock, automatic timezone, mandatory named list or business calendar.
- CAL-PRESET-03: independent source-backed examples on Calendar, DateRangePicker
  and DateRangeSelector. They mix a fixed range, This week/month/year, Last year
  and an optional host-defined Monday-Friday Last business week. Public callbacks
  and form serialization remain resolved ISO endpoints; relative persistence and
  refresh remain host responsibilities. Prop playgrounds expose preset placement.

Node 24.21.0 validation:

- 33 unit checks across nine files passed: relative-date-range, side preset
  draft/Cancel/Apply behavior and existing DateRangeSelector/DateRangePicker/text
  integration tests. New helper checks cover leap February, year boundaries,
  explicit Sunday/Monday weeks, offsets and invalid input.
- Library typecheck, generated tokens, foundation guard, production library/docs
  build and catalog/API/theme/isolation checks passed. Catalog has 90 pages,
  201 component/icon names plus the registered helper, and 147 isolated owners.
- Eight production Chromium docs cases passed, including all 90 routes and 930
  setup/initial/changed compilable source snapshots, the four CAL-UX checks and
  two new preset-panel checks. After visual review corrected the selected preset
  to use owned Button variants rather than competing local color rules, only the
  two affected panel cases ran again against a fresh production build; both passed.
  They verify fixed/relative/custom values, draft-only selection, Apply/Cancel,
  matching pressed/variant state, horizontal side geometry, one/two calendars,
  narrow stacking/bounds and source compilation. Final screenshots reviewed under
  `apps/docs/artifacts/calendar-presets-final`; unaffected catalog/CAL-UX results
  are retained under `apps/docs/artifacts/calendar-presets`.
- Actual package/tarball checks passed: public entry imports, strict consumer
  types, owned declarations, fresh packed JS/CSS/maps/assets, exports and notices.
- Fresh docs-owned native fixture build, followed by 18 Chromium cases passed:
  batch01-calendar (5), batch61-keyboard-range-preview (2),
  hardening-date-presentation (8), range-picker-controlled-transactions (3).
  Zero retries/skips. Results:
  `packages/ui/artifacts/calendar-presets-native/results.json`.

Logs: `/tmp/sgui-presets-{units-final,types,foundations-final,final-build,
 browser,browser-final,package,native-build,native}.log` (the brace notation names
 separate files). Canonical heavyweight/legacy validation leases were held for
 serialized builds/browser/package checks and released after completion.

Firefox/WebKit, physical-device and assistive-technology acceptance are not
claimed by this Chromium development slice. The existing 20 editor hardening,
320 acceptance and six deferred leaves remain unchanged. No commit, push, version
edit or release was performed; earlier local changes and Obsidian history remain.


## CAL-BAND — connected weekly range selection, 2026-10-16

Completed the requested presentation follow-up on the existing modified dev
snapshot based on `540f47d`. DateRangeSelector marks its grids with an owned range
class; DateRangePicker inherits that implementation. Range columns join without
horizontal gaps. Logical start/end corners round interval endpoints, visible
week-row ends and partial month boundaries. Single-day ranges retain all four
rounded corners; standalone Calendar single/multiple dates remain separate boxes.
Native button dimensions, inset keyboard focus and six-week height stay intact.
Guidance and existing source-backed dropdown descriptions are updated. No public
API, callback, dependency or version change was needed.

Node 24.21.0 validation:

- Fresh production library/docs build, catalog/API/theme/isolation checks,
  foundation guard and browser-test TypeScript passed.
- Six permanent Chromium cases in `date-range-bands.spec.ts` passed against the
  final fresh docs-owned native host. Four configurations assert English/Arabic
  RTL and compact/comfortable targets (32/44px), touching selected-cell edges,
  all four logical corner radii, full-month/cross-month/single-day ranges and
  native keyboard focus. One forced-color case checks connected system-color
  borders, explicit readable day-text backgrounds and focus. One case preserves
  adjacent independent Calendar boxes. Final results:
  `packages/ui/artifacts/range-bands-verified/results.json` (6/6, 2.8s).
- The existing 18 Chromium cases passed: batch01-calendar (5),
  batch61-keyboard-range-preview (2), hardening-date-presentation (8),
  range-picker-controlled-transactions (3). Results:
  `packages/ui/artifacts/range-bands-regressions/results.json` (18/18, 11.7s).
- Both production docs preset dropdown cases passed for one/two calendars,
  including source compilation, Apply/Cancel and narrow stacking/bounds.
  Website artifacts: `apps/docs/artifacts/calendar-range-bands` (2/2, 4.0s).

Representative English compact and Arabic comfortable filled bands were visually
reviewed. Forced-color visual review caught unreadable white native text backplates
inside a filled Highlight band despite passing geometry/contrast-style assertions.
That attempt is retained under `range-bands-forced-filled-attempt`; it is not final
visual evidence. The final forced-color presentation uses Canvas/CanvasText with
connected Highlight borders and was visually reviewed with readable numbers and
rounded row caps. No forced-color adjustment override was added. After that
forced-color-only correction, the unaffected standard-state regressions and docs
passes were retained and the complete six-case new suite passed again against
one final host, with stronger corner/border/density assertions. No retries/skips.

Logs: `/tmp/sgui-range-bands-{build,forced-outline-build,foundations-final,
 browser-types-final,native,regressions,docs,verified}.log` (separate files).
Canonical heavyweight/legacy leases were released after each settled run.
Chromium development evidence does not imply Firefox/WebKit, physical-device,
screen-reader or release acceptance. Existing 20 editor V, 320 A and six future
leaves are unchanged. Earlier workspace changes are retained; no commit/push/release.

### CAL-OVERVIEW — inline selector preview height (2026-10-16)

Removed the shared 24rem overview cap specifically for the DateRangeSelector
catalog page. Its preview expands around presets, fields, the calendar and actions;
the docs main pane owns vertical scrolling. Horizontal overflow handling remains.
The fresh production docs build passed, including catalog and isolation guards.
Two Chromium cases passed at 1440px and 375px: preview scroll height fits its client
height, the component fits its preview, document width stays bounded, and Apply
can be reached by main-pane scrolling with preview scrollTop remaining zero.
Evidence: `apps/docs/artifacts/date-range-overview`; logs:
`/tmp/sgui-range-overview-build.log`, `/tmp/sgui-range-overview-browser.log`.
No library API or broad acceptance status changed; work remains uncommitted.

### CAL-FIT — minimum default calendar width (2026-10-16)

Calendar and range months now fit seven square day targets with zero horizontal
column gaps, rather than stretching across the host. Compact pointer months are
224px (7 × 32px); comfortable/touch months are 308px (7 × 44px), subject to enlarged
text. Calendar roots use the matching one/two-month width, bounded by their host.
Months wrap naturally; preset side panels wrap when their combined content cannot
fit. The single-date popup uses the same target width, and the one-month range
wrapper fits its selector. Grid scrollports, six-week height, centered labels and
connected range caps remain intact. Calendar footprint examples now demonstrate
defaults without host width overrides; copied source and usage guidance match.

Fresh library, production docs and docs-owned native-fixture builds passed.
Foundation guards and browser TypeScript passed. Eight production docs Chromium
cases passed, including exact compact/comfortable default widths, twelve-month
height stability, typed/picked dates, source compilation, preset side layouts,
narrow dropdowns and the expanding range overview. Sixteen native Chromium cases
passed: range bands (6), keyboard range preview (2), and light/dark × density ×
English/Arabic date presentation (8), including touch/enlarged-text local scrolling.
Range-band cases additionally assert exact per-month and per-day default widths.
Compact and overview screenshots were visually reviewed.

Evidence: `apps/docs/artifacts/calendar-fit` and
`packages/ui/artifacts/calendar-fit-verified/results.json` (16/16, 10.0s).
Logs: `/tmp/sgui-calendar-fit-{library,docs,fixtures,browser,native-verified,
foundations,browser-types}.log` (separate files). An initial native run passed
but reported overlapping reporter/output directories; the verified run uses
separate trace/report paths. Canonical validation leases released after each run.
No public API/dependency/version changes, commit, push or release. Existing backlog
acceptance counts and earlier workspace changes remain unchanged.

### CAL-GROUP — align and join DatePicker input/action (2026-10-16)

DatePicker now puts its calendar Button beside the actual editable control using
a private DateField composition slot. Segmented and text entry share a bordered
row with one divider, logical rounded outer ends, labels above and help/errors
below. No label-height margin or absolute offset is used. Each target retains
its complete 32px compact / 44px comfortable or touch height; borders belong to
the controls so they do not subtract from interactive targets. The decorative
16px CalendarTodayIcon replaces the text glyph, while the Button's translated
accessible name stays intact. Standalone DateField rendering and public props
remain unchanged. Usage guidance and generated Contains metadata reflect the
composition; this does not add a public generic input/action-group API.

Validation: 22 existing affected unit cases passed across DatePicker, DateField
and TextDateField. Fresh library, production docs and native-fixture builds,
foundation guards, catalog/isolation checks and browser TypeScript passed.
Eight production docs Chromium cases passed: four existing calendar/dropdown
cases plus four entry-mode × density cases asserting matching top/height edges,
touching control edges, full target heights, icon semantics, popup dismissal/focus
and narrow wrapped labels/help/errors. Eight existing native date-presentation
cases passed at 150% text across light/dark, compact/comfortable and English/Arabic,
now also asserting joined alignment and full touch targets in LTR/RTL.
Final narrow screenshots were visually reviewed.

Evidence: `apps/docs/artifacts/date-picker-joined-final` (8/8, 11.3s),
`packages/ui/artifacts/date-picker-joined/results.json` (8/8, 7.2s).
Logs: `/tmp/sgui-date-picker-joined-{unit,library,docs,fixtures,foundations,
browser-types,browser-final,native}.log` (separate files). The first new docs
test attempted a pointer click on a visually covered custom checkbox input;
keyboard focus/Space correctly exercises that existing control and the final
suite passes without retries. Canonical leases released. No broad acceptance
counts, dependency/version changes, commit, push or release; earlier work retained.

### DOC-EDITOR-SAMPLE — quiet defaults for editor examples (2026-10-16)

Removed the Replace host document button and its revision/remount state from all
PageRichTextEditorSection overview/playground/reference examples and copied source.
A shared docs-owned sample initializes those editors, FloatingTextSelectionToolbar
hosts and the image-upload example with two standard Lorem ipsum paragraphs, each
containing two sentences. The sample is real editable Lexical content; empty-editor
placeholder behavior remains available after clearing. Purposeful saved-document
examples retain their headings, formatting, list, table, link, code and image.
The floating host's document-text control still accepts host changes, now splitting
blank-line-separated paragraphs. Each panel keeps independent document state.

The production docs build passed, including catalog, source-owner isolation and
theme checks. Two Chromium cases passed for the rich-text section and floating
toolbar pages: exact paragraph/sentence counts, no reset/replacement action, local
editing without sibling changes, source-state updates, compilation of every panel's
source, upload sample paragraphs and preservation of the saved rich document.
Evidence: `apps/docs/artifacts/editor-sample-content` (2/2, 3.8s); logs:
`/tmp/sgui-editor-sample-docs.log`, `/tmp/sgui-editor-sample-browser.log`.
Docs-only change; no library API, native fixture/assertion or acceptance-count
changes. Canonical leases released. Earlier edits retained; no commit/push/release.

### EDITOR-FOCUS — avoid bounding outlines during pointer editing (2026-10-16)

Replaced the editable document's native `:focus-visible` selector with owned,
input-aware React Aria focus visibility. Browsers can match native focus-visible
on pointer-focused contenteditable elements, producing the reported blue box while
typing. The new private DocumentContentEditable interaction boundary distinguishes
text editing from Tab/Escape navigation; pointer typing/caret changes do not enable
the outline, keyboard navigation retains it, and a pointer click clears it. The
separate document scroll region retains its native keyboard focus indicator.
Existing read-only scoped Select All handling moved intact into that boundary.
Registered only this private implementation in the foundation interaction allowlist,
with a colocated behavior test; public APIs and Lexical command ownership remain.
Usage guidance, developer contracts and AGENTS instructions reflect the behavior.

Six affected unit cases passed (document modality, scroll/readonly selection and
paragraph transactions). Fresh library, production docs and native-fixture builds,
foundation guards, catalog/isolation checks and browser TypeScript passed. Four
native Chromium cases passed in light/dark: pointer typing and Enter keep no
outline; Shift+Tab/Tab retain viewport/document cues; pointer re-entry clears the
ring. Existing paragraph formatting, selection, undo and reload cases also passed.
Two production docs cases passed, now asserting no outline after editing the real
PageRichTextEditorSection playground, preserving sibling state and compiling all
displayed editor sources.

Evidence: `packages/ui/artifacts/editor-focus/results.json` (4/4, 3.4s),
`apps/docs/artifacts/editor-focus` (2/2, 3.7s). Logs:
`/tmp/sgui-editor-focus-{unit,library,foundations,fixtures,browser-types,native,
docs,docs-browser}.log` (separate files). Canonical leases released. No release
acceptance claims, public API/dependency/version changes, commit, push or release;
earlier workspace work retained.

### CAL-FORWARD/FIT — Southwest reference and range dropdown behavior (2026-10-16)

Inspected the live Southwest homepage picker through its visible UI. With a
departure of October 25, activating October 22 while choosing return replaced
departure with October 22 and kept return empty. Changing departure later than an
existing return also cleared return. Its narrow presentation exposes active
Depart/Return choices and a scrolling month list; these are observations rather
than an instruction to replace SGUI's existing one/two-month presentation.

Calendar selection now initializes an incomplete local draft: start is the picked
date and end is empty. An earlier second activation restarts at the earlier date;
the same/later activation completes the range. A private native-state observer
preserves React Aria's state identity/cell metadata and restarts reverse completions
through its anchor setter. Apply stays disabled while incomplete, and no partial
range reaches callbacks or submitted committed endpoints. Manual segmented/text
reversed values retain validation rather than being reordered mid-entry. Cancel,
presets, host replacement and native resets keep their ownership. Existing pending
draft assertions were updated to the requested empty-end contract; committed-form
assertions remain intact. The invisible preview sizer reserves a complete-range
context even when end is empty, preventing a discovered 20px popup shrink/move
during pointer selection.

Owned Popover retains native flipping when either side fits. Otherwise its virtual
position target shifts along the vertical axis to fit the visible viewport before
height is constrained. Full content can overlap its trigger; genuinely overheight
content still scrolls with 12px viewport clearance. The existing positioner owns
focus, resize, visual-viewport and ancestor-scroll updates. This correction applies
to DatePicker, DateRangePicker and other Popover consumers without a new public prop.
Updated usage guidance, example descriptions, contracts and AGENTS instructions.

Final Node 24 validation: 30 affected unit cases across five files passed. Fresh
library, production docs and docs-owned native-fixture builds, foundation guards,
browser TypeScript, catalog and isolation checks passed. Nine production docs
Chromium cases passed: mouse/keyboard forward selection with one/two calendars,
committed trigger values, full-height shifting, genuinely short-viewport scrolling,
Escape/Cancel focus, stable selection geometry, source compilation and existing
calendar/preset flows (12.7s). Sixteen native calendar/range cases passed across
timezones, light/dark, RTL/densities/forced colors, controlled transactions, native
reset and unavailable boundaries (9.2s). Two focused Popover collision cases passed
for viewport-edge flipping and enlarged RTL scroll-host/repositioning (1.4s).
The shifted calendar screenshot was visually reviewed with all fields, six-week
calendar region and actions visible without an internal vertical scrollbar.

Evidence: `apps/docs/artifacts/range-flow-verified`,
`packages/ui/artifacts/range-flow-verified/results.json`,
`packages/ui/artifacts/range-flow-popover/results.json`. Logs:
`/tmp/sgui-range-flow-{unit,library,docs,foundations,types,fixtures,
docs-browser-verified,native-verified,popover}.log` (separate files). Earlier failed
attempts retain diagnostics; final runs have no retries/skips. Canonical leases
released. No API/dependency/version changes, commit, push, release or broader
acceptance-count changes; prior workspace work retained.

### CAL-REF-01/02 — analytics reference review and first configurations (2026-10-16)

Inspected all three user-provided screenshots, including decoding the AVIF to a
temporary PNG without changing the original. The references distinguish linked
visible months from independent endpoint navigation, preset presentation and
comparison-period transactions. Recorded a concrete inventory in
react-aria-calendar-contracts.md: CAL-REF-03 month/year jumps, CAL-REF-04 independent
From/To month navigation, CAL-REF-05 a vertical month list, CAL-REF-06 categorized
and nested presets, and CAL-REF-07 comparison selector/picker compositions remain
requested functionality. Proposed comparison names are not exported or claimed
implemented. Comparison requires one atomic Apply/Cancel transaction for primary
and optional comparison ranges, explicit relative policies and accessible overlap
presentation; it must not be two separately committing selectors behind an outer
Apply button.

The optional priority question received no answer during this pass, so the stated
calendar-configuration-first assumption was used. CAL-REF-01/02 are implemented:
Calendar, DateRangeSelector and DateRangePicker now support months 1/2/3; shared
minimum sizing expands to three consecutive months and wraps in narrow hosts.
DateRangeSelector/Picker support presetPlacement="end", retaining above and side
(logical start). The trailing panel is physically later in the DOM, preserving
keyboard/visual order in LTR/RTL and after narrow wrapping. Existing side behavior
is retained. No new base component/export is needed for these configurations.

Updated prop playgrounds, generated public API metadata, component usage guidance,
source-backed three-month examples on all three pages, and trailing-preset examples
on both range pages. The preset examples remain configurable host-owned fixed and
relative ranges with independent state. New unit cases cover third-month selection
and trailing preset DOM order/Apply. The first Calendar unit expectation was aligned
with the existing centered multi-month view (focused October displays September–
November); native Calendar alignment was preserved.

Validation: fresh library and production docs builds passed. Catalog/API/isolation
and foundation checks passed; the final usage-text clarification also passed
catalog:check. Twenty-six affected unit cases passed across four files. Ten
production docs Chromium cases passed (10.9s): five new layout cases cover all
three pages, exact 224px compact month widths, same-row placement, narrow wrapping,
source compilation, trailing presets in LTR/RTL, keyboard order and live draft
updates; five retained preset/forward-selection/viewport-fit cases also passed.
Evidence: `apps/docs/artifacts/calendar-reference-config`; logs:
`/tmp/sgui-calendar-config-{unit,library,docs,browser,foundations,catalog}.log`.
Only the first two configuration leaves are complete; the remaining requested
patterns are explicitly pending. Existing phase counts and earlier edits retained.
Canonical leases released; no commit, push, release or version/dependency change.

### CAL-TITLE — optional calendar titles and month-row navigation (2026-10-16)

Request: remove repeated picker titles and place previous/next navigation beside the month.
Calendar and DateRangeSelector now default showTitle to false. DatePicker and
DateRangePicker use that same default, displaying one Popover title when enabled.
Required accessible labels remain, as do visible picker field labels. Generic
Popover retains showTitle=true by default and names the dialog explicitly when its
heading is hidden. Navigation shares the month row at the first/last visible
months. All affected playgrounds expose the option with matching copied source;
public declarations and usage guidance are updated.

Validation: fresh library and production docs builds; 35 tests across Calendar,
DatePicker, DateRangeSelector and Popover; 14 production-browser cases covering
title/source toggles, accessible names, month-row alignment/navigation, compact
and comfortable footprints, stable month heights, date/range input transactions,
three-month wrap, RTL preset order and narrow-screen layouts. Owned foundation
guard and git diff --check pass. Browser artifacts:
apps/docs/artifacts/calendar-heading. This is targeted UX evidence, separate
from historical acceptance counts. Work remains uncommitted.

### CAL-REF-03 / CAL-DATETIME — birthday navigation and date/time picking (2026-10-16)

Researched GOV.UK memorable-date entry, WAI's keyboard date-picker dialog, and
React Aria's localized month/year pickers before implementation. Research and
links are recorded in react-aria-calendar-contracts.md.

Calendar, DateRangeSelector, DateRangePicker and DatePicker now expose
navigation="month-year" and visibleYears. Native localized month/year options
navigate focus without committing. Single-month dropdowns replace the month
heading; multi-month views retain each grid's month heading and place shared
navigation controls above them. Arrows remain available. The birthday scenarios
start empty, allow direct flexible text entry, and demonstrate host-owned bounds
and a jump across decades to a leap-day birthday.

DatePicker kind="datetime" reuses DateField, Calendar and TimeField rather than
adding a separate export. The outer field supports direct date/time editing.
The popup drafts date and time and commits one local datetime with Apply;
Cancel/Escape discard it. TimeField completeness reporting blocks partial entry
and datetime boundary times are validated. Both 12/24-hour examples have their own
state/source. Date-only behavior and host timezone/DST ownership remain intact.

Responsive testing exposed an existing Popover collision gap when reflow moved
the trigger outside its scrolling pane. Bound the virtual anchor to the visual
viewport before computing free space; preserve the native position owner,
dismissal, scroll lock and focus restoration.

Working-tree validation on dev base 540f47d: fresh library and production docs
builds, catalog/API/composition checks, 49 unit cases across the affected
Calendar navigation, DatePicker, TimeField, DateRangeSelector and Popover files;
production browser cases cover birthday direct input/year jumps/leap dates,
12/24-hour draft/Cancel/Apply/partial-time behavior and source compilation,
playground isolation, optional headings, existing forward range selection,
viewport fit/short viewport scrolling and focus restoration. Artifacts:
apps/docs/artifacts/calendar-birthday-complete (final run).
Owned foundation guard and git diff --check pass. This is targeted functionality
and UX evidence, separate from historical acceptance counts. Work is uncommitted.

### TIME-TEXT — shorthand textbox and time-selection popup (2026-10-16)

Research reviewed USWDS's text/dropdown time picker and stable-option guidance,
plus Carbon's text-and-select time picker. Links and the resulting behavior
contract are in react-aria-calendar-contracts.md.

TimeField now defaults to a joined textbox/clock button; entryMode="segments"
keeps the prior native segment interaction. Public refs remain outer divs and
values remain local HH:mm:ss/null. Flexible a/p and AM/PM input, localized
digits/day periods and 24-hour text normalize on blur/Enter. Invalid text remains
visible and invalidates the native field without replacing the accepted value.
Bare hours have explicit 24-hour meaning. Seconds are preserved when supplied.

The popup has independent Hour/Minute/AM-PM choices, omitting period in 24-hour
mode. All minute choices remain stable. Apply commits the complete clock;
Cancel/Escape discard popup edits. Bounds, incomplete values, controlled-host
authority, read-only/disabled guards and silent accepted/prevented resets remain.
DatePicker datetime popups use this same control and retain the outer atomic
date/time Apply. Historical segment unit tests and native fixtures explicitly
select segments, retaining their assertions. New default evidence is separate.

Validation on dev working tree (base 540f47d): library and production docs builds,
API/composition/catalog generation and checks, foundation guard, git diff --check,
29 unit cases in five affected time/parser/DatePicker test files, and six
production browser cases. Browser checks cover 8a normalization, invalid drafts,
12/24-hour presentation, hour/minute/period Apply/Cancel, bounds, keyboard opening,
narrow viewport fit, joined control alignment, dynamic segments playground source,
sibling isolation and the date/time nested composition. Time cases were rechecked
after the final alignment/source assertions. Artifacts:
apps/docs/artifacts/time-text-picker and apps/docs/artifacts/time-text-picker-final.
Targeted functionality evidence is separate from historical acceptance counts.
All work remains uncommitted.

### CAL-TEXT-DEFAULT — flexible DatePicker entry (2026-10-16)

DatePicker date-only input now defaults to entryMode="text". Its overview,
playground and fixed scenarios start with flexible date entry; the playground
still exposes explicit segments. Datetime entry remains segmented, and standalone
DateField/range defaults are unchanged. Usage guidance and declarations reflect
the default; historical segment-native DatePicker fixtures opt in explicitly.

Validation: fresh library/production docs builds, nine DatePicker unit cases
(including freehand entry without an entryMode prop, canonical callback and
calendar synchronization), four production browser cases checking the default
textbox/playground selection and both explicit modes/densities, narrow-screen
joined input/icon alignment and popup focus restoration. Foundation guard and
git diff --check pass. Artifacts: apps/docs/artifacts/date-picker-text-default.
Working tree on dev base 540f47d remains uncommitted.

### CAL-SHORT-YEAR — two-digit flexible date years (2026-10-16)

Flexible numeric and named-month date text now expands two-digit years using a
fixed 1950–2049 window: 00–49 become 2000–2049 and 50–99 become 1950–1999.
Thus 1/1/26 normalizes to January 1, 2026; birthdays such as 1/1/84 become 1984.
Four-digit input preserves its century. Locale month/day order, localized digits,
strict leap-day validation, host bounds and canonical ISO callbacks remain.
The shared parser covers DateField, DatePicker and flexible range endpoints.
Hints, public prop guidance, usage docs and example descriptions explain the rule.

Validation: fresh library/production docs builds and catalog checks; 14 unit cases
across parser, text date fields/range endpoints and DatePicker, covering century
boundaries, names, locales, leap years, canonical callbacks and calendar selection;
one targeted production-browser case for 1/1/26 normalization, calendar selection,
source compilation and sibling isolation. Artifact: apps/docs/artifacts/date-short-year.
git diff --check passes. Working tree on dev base 540f47d remains uncommitted.

### CAL-RELATIVE-TEXT — deterministic relative date entry (2026-10-16)

DateField, DatePicker and both range controls accept the optional host-owned
referenceDate (Gregorian YYYY-MM-DD). It enables bounded relative text without
reading any ambient clock or timezone. The host supplies civil today for its
chosen timezone and pins it for an editing session/SSR. Both range endpoints
share the same anchor. Already committed ISO dates do not drift when it changes.

Supported English keywords: today/tomorrow/yesterday, next/last weekday,
next/last day/week/month/year, in N units, and N units ago. Weekday names accept
English and the active locale. Next/last weekdays exclude the reference day;
weeks are seven days; Gregorian month/year offsets preserve the position and
clamp at month end. Unsupported prose, invalid/missing anchors and civil overflow
reject relative input. Existing absolute input and century rules remain, as do
bounds and range Apply/Cancel. All affected playgrounds expose the reference;
independent source-backed examples disclose their fixed 2026-10-16 anchor.

Validation: fresh library and production docs builds, API/composition/catalog
checks, 17 unit cases across absolute/relative parsers, date text/range endpoints
and DatePicker, plus four production browser cases (DateField, DatePicker,
DateRangeSelector and DateRangePicker). Cases cover normalized relative entry,
calendar arithmetic/century coexistence, canonical callbacks, bounds,
non-drifting committed values, shared range anchors, dynamic reference/source
changes and sibling isolation. Foundations and git diff --check pass.
Artifacts: apps/docs/artifacts/relative-date-entry. Working tree remains
uncommitted on dev base 540f47d; evidence is separate from historical acceptance.

### CAL-EXAMPLE-WIDTH — content-sized picker examples (2026-10-16)

Date-family scenario stacks now align controls at the start instead of stretching
them across the preview. This covers the overview, prop playground, density
references and local form flow. Date/range reference wrappers use fit-content with
responsive maximum widths; three-month dropdowns also receive content-sized hosts.
Standalone calendars retain their natural month widths and responsive wrap.
Copied source includes the same Stack alignment and Box sizing as each preview.
Library sizing contracts are unchanged; this is docs-owned host layout.

Validation: production docs build with catalog/API/composition checks and eleven
production browser cases. Cases cover compact control widths in both picker
pages' playground/density/form examples, copied-source compilation, native popup
focus, 375px reflow, birthday/date-time flows, three-month wraps and RTL/logical
preset placement. Screenshots inspected for both primary picker playgrounds.
No library code or unit tests were added for this layout-only change.
Artifacts: apps/docs/artifacts/date-picker-width. git diff --check passes.
Work remains uncommitted on dev base 540f47d.

### CAL-FIELD-RADIUS — rounded theme field groups (2026-10-16)

Material demo fields now share its existing 1.5rem action radius. Shared field
padding compensates for rounded caps without reducing the radius or target size.
DatePicker and flexible TimeField retain logical outside corners and square joined
seams; their trailing icons receive matching cap clearance. DateRangePicker follows
field shape and text styling and uses CalendarTodayIcon in Button's trailing-icon
slot instead of a text glyph. Compact month/year controls retain full year labels
with a bounded inset. Public props are unchanged. Other demo identities keep their
existing radii, and website styling remains independently scoped.

Validation: fresh library and production docs builds, generated API/composition/
catalog checks, five existing DateRangePicker/CalendarNavigation unit cases and
eight production browser cases. Browser evidence covers Material compact/light
and comfortable/dark radii, input/icon alignment, inset, RTL logical corners,
readable year navigation, keyboard focus and popup dismissal, plus existing joined
picker and flexible time flows. Inspected date and range picker screenshots.
Foundation guard passes. Artifacts: apps/docs/artifacts/picker-radius.
Work remains uncommitted on dev base 540f47d; separate from historical acceptance.

### CAL-RANGE-TEXT — editable range textbox and relative periods (2026-10-16)

DateRangePicker now defaults to one editable range textbox joined with a calendar
button, preserving rounded logical outside corners, native target heights and a
content-sized responsive footprint. fieldMode="button" retains the selection-only
presentation. entryMode still configures the calendar's separate endpoint fields.
Absolute endpoint parsing reuses DateField, including 1/1/2026 - 1/3/26, locale
order, written months and fixed two-digit years. Spaced hyphens, en/em dashes and
"to" delimit pairs without splitting ISO dates. Invalid/reversed/disallowed ranges
stay visible, fail native validation and preserve accepted hidden endpoints.
Optional empty input clears; controlled authority and native reset remain intact.

This/last/next week/month/year resolve complete inclusive periods against the
host's explicit referenceDate. The configured firstDayOfWeek governs relative
weeks and calendar presentation (Monday default). No ambient clock or timezone
is inferred; accepted values stay absolute. Calendar opening focuses the accepted
range's first month. Apply updates the textbox and Cancel/Escape preserves accepted
dates. New outer description/invalid/errorMessage/onValidityChange props, fieldMode
controls, generated public API metadata and consumer guidance are documented.
A separate source-backed example demonstrates mixed-year and relative range entry.

Validation: fresh library and production docs builds with API/composition/catalog
checks, eight unit cases across range parsing and picker behavior, and nineteen
production browser cases. Evidence includes native submit blocking/acceptance,
reference changes without drift, Sunday/Monday week policy, bounds, textbox/calendar
transactions, accepted-month opening, button alternative, source compilation and
sibling isolation. Existing presets, forward range selection, viewport fitting,
compact widths and Material compact/light + comfortable/dark corners still pass.
The initial browser run exposed a test's direct click on the custom checkbox input;
using keyboard Space fixes that test interaction. Final run passes all nineteen.
Inspected range textbox screenshots. Foundation guard, final catalog check and
git diff --check pass. Artifacts: apps/docs/artifacts/date-range-text-final.
Uncommitted on dev base 540f47d; no historical acceptance counts changed.

### CAL-RELATIVE-OWNED — centralized relative-date rules (2026-10-16)

Relative single-date grammar, range-period grammar, Gregorian civil validation,
day/week offsets, month/year clamping and complete-period boundaries now live in
packages/ui/src/utils/relative-dates.ts. The module has no imports or third-party
runtime dependency. Its integer day-number arithmetic covers years 0001–9999,
century leap rules and unsafe/overflow rejection. Native Intl supplies digit and
weekday names only, using a fixed UTC display date; there is no clock read,
Date.parse or local-time arithmetic. Absolute date-entry parsing uses the same
owned civil validator directly. Range text delegates period phrases to this core.
The existing getRelativeDateRange public entry is a compatibility reexport.
Calendar interaction and explicit timezone/instant conversion remain separate.

Preserved explicit host referenceDate, configurable week starts, bounded grammar,
day-preserving single-date offsets versus full inclusive range periods, null
parser failures and RangeError helper failures. Added a foundation guard forbidding
module dependencies in the shared engine. Developer/consumer guidance and AGENTS
require future supported relative rules to be added here rather than duplicated
or delegated to a third-party parser/date arithmetic library.

Validation: fresh library and production docs builds, generated public API/
composition/catalog checks, 41 unit cases across nine affected suites, foundation
guard and eight production browser cases. The owned-core tests compare month and
next-month boundaries with an independent UTC oracle across a complete 400-year
Gregorian cycle and all seven week starts throughout a leap year; edge fixtures
cover century exceptions, years 0001/0099/0100/9999, partial edge weeks, unsafe
offsets, whitespace/localized digits, unknown grammar and a throwing clock spy.
Existing single-date, range textbox, preset, native-form and source-isolation
checks pass. Final catalog check and git diff --check pass.
Artifacts: apps/docs/artifacts/owned-relative-dates. Work remains uncommitted on
dev base 540f47d; historical acceptance counts are unchanged.

### CAL-RELATIVE-PHRASES — conversational offset text (2026-10-16)

Extended only the owned shared relative-date grammar to accept "a week from today",
"two weeks from today", "in a month" and "a week ago". Quantities use nonnegative
digits, "a", or English zero through twelve from one shared word table. Day/week/
month/year shifts reuse owned arithmetic and clamping. "from now" is an alias for
the host's explicit civil referenceDate; it never reads a live clock. Unsupported
prose, fractions, negative quantities, missing anchors and overflow still reject.
Range endpoints accept the same grammar, including "today - a week from today";
one date does not implicitly define a complete range. Updated hints, source-backed
examples, consumer/developer guidance and AGENTS. Public API/dependencies unchanged.

Validation: 19 focused unit cases across five suites, fresh library and production
docs builds with API/composition/catalog checks, the dependency-free foundation
guard, and six production browser cases. Browser checks enter conversational text
in DateField/DatePicker, both range endpoint fields and the combined range textbox,
then preserve native validation, calendar transactions and independent source/state.
Artifacts: apps/docs/artifacts/conversational-relative-dates. git diff --check
passes. Work remains uncommitted on dev base 540f47d; historical counts unchanged.

### TIME-COMPACT-TEXT — military and suffixed compact time (2026-10-16)

The owned flexible time parser accepts HMM/HHMM with optional a/am/p/pm: 1300
commits 13:00:00 and 315p commits 15:15:00. Last two digits are minutes; no suffix
means 24-hour time. Display still follows hourCycle. Localized digits work and
existing colon/seconds entry is preserved. Invalid compact hours/minutes, incompatible
period hours and unsupported mixed compact/colon-seconds forms reject without
rollover or replacing accepted native values. Updated owned hints, both density/
hour-cycle examples, consumer/developer guidance and AGENTS. Public API unchanged.

Validation: 21 unit cases across parser/TextTimeField/TimeField, fresh library and
production docs builds with catalog/API/composition checks, foundation guard and
two production Chromium cases. Browser cases enter both requested forms in 12/24
hour displays, reject 1260, retain accepted hidden values, then preserve popup
Apply/Cancel, bounds, narrow viewport fit and sibling source isolation.
Artifacts: apps/docs/artifacts/compact-time-entry. git diff --check passes.
Changes remain uncommitted on dev base 540f47d; historical acceptance unchanged.

### FIELD-ICONS — standard placeholders and decorative icon slots (2026-10-16)

TextField, Select and ComboBox now expose logical startIcon/endIcon slots;
AsyncMultiSelect forwards them and the new placeholder prop to its query field.
Slots remain decorative/aria-hidden without tab stops. Select keeps its native
chevron and longest-label sizing; ComboBox keeps its options action. Shared field
CSS owns theme cap padding, rounded frames/focus, invalid/read-only/disabled and
forced-color behavior. Native input hit targets remain 32/44px including decorated
fields, with touch policy preserved. Icon-free native input markup is unchanged.

All four pages expose placeholder/icon-position controls and eight independent
source-backed references: placeholder-only/start/end/both, compact/comfortable.
Examples start empty to reveal placeholders. Unit coverage preserves labels,
native edits/values/reset and selection with icons. Browser coverage verifies all
configurations, source compilation, independent state/source, centering, logical
RTL layout, Material light/dark shapes, forced-color borders and narrow reflow.
The ComboBox driver waits for native scroll settling and types after focus; filling
a scrolled-away input could dismiss its options before selection. These checks are
included in the final SEARCH-STANDARD evidence below; no historical counts change.

### SEARCH-STANDARD — reusable search UI and site consumption (2026-10-16)

Added public SearchField/SearchFieldProps/SearchFieldItem through root, primitives
and experimental entries. It composes owned TextField/Button/Link/Typography and a
React Aria nonmodal results portal. It owns leading search/decorative end icons,
clear action, label/keyword matching, result descriptions, pluralized counts,
empty/loading/error/retry, Arrow/Home/End/Escape navigation, synchronous result
focus before rapid Enter activation, native links/modified clicks, selection and
optional input-submit callbacks. Controlled/default query, native forms/reset,
read-only/disabled, identity/density/RTL and forced colors retain owned contracts.
Search-specific component color aliases were generated from the token source.

showResults=false supports a standalone search with results rendered elsewhere;
filter="none" accepts host-filtered data. Hosts own routing, data and remote
freshness. Both docs sidebar and catalog index consume the public component.
Removed site-specific search markup, floating icon/input padding CSS, results
styles and keyboard/focus handlers. Sidebar now supplies items with aliases,
category descriptions, hrefs, contextual strings and a selection/routing callback.
The catalog index supplies its query and renders its existing page grid.

Registered the new Forms catalog route with its independent overview, prop
playground, compact/comfortable references, host-filtered retry and standalone
form-submit examples. Setup/props/behavior/accessibility/host guidance, public API,
composition metadata, navigation, architecture docs and AGENTS are current.

Final validation on uncommitted dev base 540f47d: fresh library and production docs
builds, generated token/API/composition/catalog checks, foundation guard, 42 unit
cases across five affected suites (three baseline SearchField cases), and fourteen
production Chromium cases. Browser evidence includes every new icon layout and
compilable source, standalone/retry callbacks, source isolation, portal theme,
actual sidebar/index reuse, aliases, rapid ArrowDown/Enter navigation, Escape focus,
Back/history navigation, 32px pointer and 44px touch targets, enlarged text, narrow
screens and existing Material date/time field radii. Initial target-height and
deferred-focus failures were corrected in library code; final fourteen pass.
Inspected shared results and real sidebar screenshots. git diff --check passes.
Artifacts: apps/docs/artifacts/standard-search-verified. No commits, pushes or
release actions; historical acceptance counts are unchanged.

## CAL-RANGE-LAYOUT — wider responsive range dropdown (2026-10-16)

Reviewed the supplied Google Analytics horizontal-month/preset-sidebar examples,
Mantine DatePickerInput's adjacent presets and React Suite DateRangePicker. Updated
the owned DateRangeSelector default from above presets to a logical-start sidebar.
The calendar/endpoint area reserves enough width for two complete Material-rounded
segmented fields on desktop; the grids retain their original day target widths and
center within that area. Narrow containers wrap preset choices and stack complete
endpoint fields; multi-month calendars continue wrapping without page overflow.
Explicit above/end configurations and their DOM/keyboard order remain supported.

DateRangePicker now uses public Popover size="content", capped to viewport width,
rather than selecting a narrow/fixed-wide popup allocation. The trigger textbox
remains compact. The Popover playground exposes content sizing and its usage
metadata explains intrinsic child sizing and reflow. Range preview descriptions
and draft status remain available to assistive technology, without duplicate
visible summaries or reserved diagnostic-text height under the calendar.

Validation on uncommitted dev base 540f47d: 32 affected unit cases across selector,
presets, picker and Popover; fresh library/production docs builds and generated
API/composition/catalog checks; owned foundation guard; sixteen production
Chromium cases. Browser evidence covers compact/comfortable default sidebar and
single-line endpoint fields, narrow 375px reflow, Apply/Cancel and focus return,
source compilation, preset draft ownership, forward range selection, typed and
relative ranges/native submission, viewport fitting/necessary scrolling,
content-sized trigger examples, three-month wrapping and end presets in LTR/RTL.
The existing viewport-fit case now positions its trigger lower because the shorter
dropdown can correctly fit below the old test anchor. Inspected final desktop and
narrow screenshots; artifacts: apps/docs/artifacts/range-wide-final. No commits,
pushes or release actions; historical acceptance counts are unchanged.

## CAL-RANGE-POLICY — configurable range editing (2026-10-16)

Added rangeSelectionBehavior to DateRangeSelector and inherited DateRangePicker
props: restart, adjust-end (default), adjust-start and preserve-range. Initial or
restarted selection always completes from two dates in either order (5th then
1st becomes 1st–5th). Completed drafts follow the agreed table: adjust-end keeps
the start unless clicking on/before it restarts; adjust-start mirrors that rule;
preserve-range extends the appropriate outside boundary and adjusts the end for
inside clicks. Preserve mode clicking the start produces a one-day range, and
clicking the end is unchanged. Typed endpoint edits and presets remain separate;
all calendar changes retain validation and Apply/Cancel/native form ownership.

The shared interaction retains the engine state identity. A private observer
handles new anchors only once; pointer gestures record the actual pressed civil
date because native boundary dragging temporarily anchors the opposite endpoint.
Policy interpretation waits for the gesture; keyboard and virtual activation
retain native focus semantics. This fixes both mouse clicks and touch taps on
existing boundaries. Gesture listeners/timers clean up on unmount.

Public JSDoc explains every value, default, initial creation, boundary equality,
typed/preset distinction and commit policy. Generated prop descriptions expose
this on both pages. Both playgrounds include a selection-behavior control and
four separately state-owned named reference examples with copyable public source.
Updated usage guidance, calendar contracts, AGENTS, affected docs browser cases
and historical native fixtures; historical anchor/transaction fixtures explicitly
choose restart rather than relying on the changed default.

Validation on uncommitted dev base 540f47d: 28 affected unit cases in four suites,
fresh library and production docs builds, generated API/composition/catalog checks,
owned foundation guard and sixteen production Chromium cases. Browser evidence
covers all four policies on both pages, eight reference sources and playground
source compilation/isolation, inherited prop explanations, reverse initial
creation, native touch endpoint taps, pointer/keyboard activation, one/two-month
flows, preset drafts, typed/relative range validation, Apply/Cancel, viewport
fitting and responsive layout. Native fixture changes preserve explicit historical
behavior; their full private-host matrix was not rerun for this bounded task.
Final browser artifacts: apps/docs/artifacts/range-policy-verified. Initial mouse
boundary and touch timing failures were fixed in shared library code; final checks
pass. git diff --check passes. No commit, push or release action; historical
acceptance totals remain unchanged.

## CAL-FLEX — expanded calendar family (2026-10-16)

User-authorized pre-release expansion keeps independent contracts for click intent,
active endpoint, dragging, duration, availability, navigation and presentation.
`rangeClickBehavior` replaces `rangeSelectionBehavior`, with `adjust-boundaries`
replacing `preserve-range`; the generated prop descriptions explain all five
policies, initial reverse creation, boundary equality, typed/preset differences
and Apply versus immediate commits. Controlled activeEndpoint and visible Start/End
controls express editing intent separately from click and drag behavior.

Completed ranges can move by their grabbed-day offset or resize from endpoint
grips, with keyboard alternatives, Escape cancellation and invalid-release rollback.
Fixed duration completes from one date and disables resizing; bounded duration
validates all entry paths. Inclusive days and overnight nights share owned civil
math and the public getDateRangeLength helper. Selection-aware availability receives
the candidate interval and start/end/interior context; a one-day interval validates
both endpoint rules. Explicit unavailable dates and min/max bounds remain intact.

Independent calendar navigation, a bounded scrolling month browser, direct whole
period selection, nested preset categories, decorative day content, immediate
commits and popover/dialog/drawer/auto presentation are public configuration.
Scrolling arrow navigation focuses the date in its own month without advancing a
neighboring month grid. Native focus/modality and responsive draft ownership remain
with the shared overlay. Host timezone, business policy and persistence stay outside
library components and copied examples.

New public experimental PeriodPicker, DateTimeRangePicker and
DateRangeComparisonPicker provide whole periods, atomic local date/time intervals
with minute suggestions, and atomic previous-period/previous-year/custom comparisons.
Invalid child input blocks outer Apply. Closed button-triggered compositions retain
native required/custom validity, accepted named values and form reset. Each component
has independent overview/playground/reference examples, public compilable source,
usage guidance, navigation registration and generated API/composition metadata.
The shared civil/relative engine remains owned; no dependency was added.

Final validation on uncommitted dev base 540f47d: 47 affected unit cases in ten
suites; fresh library and production docs builds; generated API/composition/catalog
and example-isolation checks; owned foundation guards; eighteen production Chromium
cases across calendar-expansion, date-range-behavior, date-range-flow,
date-range-responsive, date-range-text and calendar-presets. Browser checks include
23 new reference sources, configured playground source, pointer move/resize/cancel,
fixed duration, endpoint availability, independent/scroll navigation, immediate
commit, period selection, responsive drawer continuity, date/time increments,
comparison validation, existing range policies, touch, presets, text and viewport
fitting. Desktop range and narrow drawer screenshots were inspected. Final artifacts:
apps/docs/artifacts/calendar-expansion-final. Final browser log:
/tmp/calendar-expand-browser-verified.log. git diff --check passes. The full private
native-host and broad hardening matrices were not rerun for this bounded task.
No commit, push, release or historical acceptance-count changes.

## CAL-RANGE-PRESENTATION — optional text endpoints and preset rows (2026-10-16)

User-requested presentation follow-up hides repeated dropdown dates by default:
DateRangePicker showFields defaults false while its outer range textbox remains
editable. Explicit showFields enables flexible freehand start/end textboxes.
DateRangeSelector keeps inline fields visible and now defaults entryMode to text;
segmented fields remain an explicit alternative. Historical segment-native hosts
and assertions opt in explicitly. Named endpoint-editing examples opt in with
showFields and disclose this configuration in their descriptions and copied source.
Overview, playground and density references use the picker default.

Presets use the owned React Aria single-select list pattern already used internally
by Select/AsyncMultiSelect, with compact label rows, a checkmark and subtle selected
background. Removed individual outlined/filled buttons, the bordered preset card,
and visible descriptive paragraphs. Option descriptions remain accessible; disabled
availability and draft/Apply/Cancel semantics remain intact. Narrow hosts reflow
rows above calendars; keyboard arrows navigate and Enter/Space selects. Updated
component usage, generated API/composition metadata, maintained native fixtures
and affected role-based assertions.

Validation on uncommitted dev base 540f47d: 33 affected unit cases in five suites;
fresh library and production docs builds including generated catalog/source-owner
checks; owned foundation import/layer/token guard; nineteen production Chromium
cases across responsive range layout, presets, expansion, flow, behavior and text
entry. Checks cover hidden default fields, explicit freehand normalization, keyboard
preset selection, native values, Apply/Cancel, source compilation/isolation,
responsive placement and retained advanced range interactions. Inspected comfortable
desktop, compact narrow and two-month preset screenshots. Artifacts:
apps/docs/artifacts/range-presentation. Logs: /tmp/range-presentation-{unit,library,docs,foundation,browser}.log.
The broader private native-host matrix was not rerun for this bounded change.
git diff --check passes. No commit, push, release or historical acceptance-count changes.

### Generic range presets — 2026-10-16

Replaced the main date-range example's course-specific presets with This week,
Last week, This month and Last month. Values represent complete periods against
the fixed October 16, 2026 example reference, with Monday-start weeks. Grouped
presets now use the generic Date periods category. The shared scenario supplies
matching preview and copied source; custom host/business examples remain separate.
Production docs build/catalog checks, nine affected production Chromium cases and
git diff --check pass. Artifacts: apps/docs/artifacts/generic-range-presets.
Work remains uncommitted on dev; no historical acceptance counts changed.

### Clean calendar date hints — 2026-10-16

Removed automatic format, two-digit-year and relative-anchor helper paragraphs
from flexible DateField, including DatePicker and optional range endpoints.
Explicit descriptions remain opt-in; no empty helper row or dangling description
ID is rendered. Validation errors, parsing, normalization and native form behavior
remain intact. Updated description guidance and the relative-range example's
explicit endpoint-field opt-in, with matching copied source.
Validation: eighteen affected unit cases, fresh library and production docs builds,
owned foundation guards and seven production browser cases across date/relative
entry and responsive range examples pass. Browser assertions verify the removed
hint is absent in all four date-family pages; copied source still compiles.
Artifacts: apps/docs/artifacts/clean-date-hints. git diff --check passes. Work remains
uncommitted on dev; historical acceptance counts unchanged.

### Deferred flexible-date validation — 2026-10-16

User-requested change separates live validity from visible feedback for flexible
date, range and time entry. Partial typing such as dec remains quiet. Enter, blur
or a native form-validation attempt reveals errors; editing again clears local
feedback. Native validity and onValidityChange remain live, keeping incomplete
drafts out of commits/submission and composed Apply. Explicit host invalid remains
authoritative. Reset/changed host values clear local feedback. Range, datetime and
comparison summaries no longer surface child draft invalidity prematurely;
semantic cross-field errors remain available after individual inputs commit.

Validation: 22 affected unit cases across six suites, fresh library and production
docs builds, owned foundation guard and nine production Chromium cases pass.
Evidence covers Enter/blur/correction/reset/native validation, dec 3 2026 and
freehand range normalization, optional endpoint typing without duplicate errors,
time shorthand, blocked Apply and retained advanced calendar behavior/source.
Artifacts: apps/docs/artifacts/deferred-date-validation. git diff --check passes.
Work remains uncommitted on dev; no historical acceptance counts changed.

### CAL-ENDPOINT-DAY-DRAG — full day targets and duration limits (2026-10-16)

Removed the separate endpoint grips. In combined mode the first and last selected
days themselves resize; interior days move the whole interval. Shift-drag moves
from any selected day, including two-day ranges. Move-only translates endpoints;
resize-only ignores interior drags. A single selected day grows toward the pointer.

The grabbed boundary follows the pointer. Once bounded min/max duration is reached,
the opposite boundary follows too. A three-day capped 7th–9th selection dragged by
its end to the 12th becomes 10th–12th. Fixed duration makes endpoint gestures move
the whole interval, including resize-only mode. Inclusive days and nights share
owned civil math; Alt keyboard endpoint edits use the same rule. Endpoints never
invert. Date bounds/unavailability reject the candidate rather than silently skip
it; outside-selector drops and Escape retain the previous draft. Pointer identity,
source focus, synthetic click suppression and subsequent action presses remain
owned. Preview hit testing is limited to this selector. Public prop guidance,
usage, gesture help and source-backed trip examples explain the new behavior.

Validation: 31 affected unit cases in four suites, fresh library and production
docs builds/catalog checks, owned foundation guard and fourteen production Chromium
cases pass. Evidence covers full endpoint targets, one/two-day selections, interior
and Shift movement, fixed duration including resize-only, bounded min/max pushes,
keyboard fixed-length movement, leap arithmetic, availability/bounds/outside rollback,
Escape, Apply after dragging, existing click policies, reverse creation, native touch
taps, responsive presentation and public example source compilation. The browser
driver now identifies actual dates rather than matching range-summary date text.
Inspected the updated range screenshot: no endpoint grips or automatic format text.
Artifacts: apps/docs/artifacts/endpoint-day-drag. git diff --check passes. The full
private native-host/hardening matrices were not rerun. Work remains uncommitted on
dev; no historical acceptance counts, release state or production branches changed.

### CAL-GESTURE-CONTINUATION — live host state, touch and cross-month drops (2026-10-16)

Continued the user-requested drag edge-case audit. Reproduced three failures before
fixing them: pointer release accepted an older preview position; a changed host
availability list was ignored by a captured validation callback; and disabling
mid-drag still allowed the pending candidate to commit. Release now hit-tests its
actual coordinates, reads current validation/action callbacks and checks current
configuration. Disabling/read-only, drag/length changes, reset and changed host
values cancel pending listeners/previews. A new host value survives old pointerup;
re-enabling permits a new independent gesture.

Cross-month drops focus the actual destination cell, including independent month
calendars. Touch-action and drag cursors follow owned interval membership and drag
capability rather than the current click role. Resize-only interior cells and
read-only/disabled calendars retain touch panning. A selected departure restricted
only as an arrival retains readable selected text and its full native selected
label; invalid announcements reflect the actual owned interval, independently of
click-role unavailability. Existing availability explanations remain associated.

Validation on uncommitted dev base 540f47d: 35 affected unit cases in four suites;
fresh library and production docs builds/catalog/source checks; owned foundation
guard; seventeen production Chromium cases. New browser evidence covers independent
cross-month resize/move/focus, window-blur cancellation, endpoint-role restrictions
and native CDP touch resize/move/cancel followed by a normal tap and Apply. Existing
fixed/bounded duration, click policies, reverse creation, touch taps, viewport and
public-source compilation checks pass. Three reproduced unit failures pass after
the fix; an additional host-replacement case preserves controlled authority.
Artifacts: apps/docs/artifacts/gesture-continuation. Logs:
/tmp/gesture-continuation-{unit,library,docs,foundations,browser}.log.
The broader private-host/browser hardening matrix remains separate. git diff --check
passes. No commit, push, release or historical acceptance-count changes.

### CAL-GESTURE-ADDITIONAL-CASES — pointer isolation and cancellation (2026-10-16)

Added ten focused gesture unit cases: read-only, drag-policy and length-policy
changes during dragging; Escape, pointer cancellation and outside-drop rollback
followed by a successful independent gesture; second-pointer isolation; and
move-only/resize-only operation boundaries. The second-pointer case reproduced a
bug: the selector's outer cancellation tracker reset the range gesture on another
pointer's cancellation. Track the initiating pointer in that tracker and ignore
unrelated releases/cancellations. Window blur retains cancellation behavior.

Validation on uncommitted dev base 540f47d: 45 affected unit cases across four
suites; fresh library and production docs builds; catalog/source/isolation checks;
foundation guard; 17 production Chromium checks, including unrelated pointer
cancellation during a real cross-month mouse drag and native touch cancellation.
Logs: /tmp/gesture-additional-{unit,library,docs,foundations,browser}.log.
Browser artifacts: apps/docs/artifacts/gesture-additional. git diff --check passes.
No full hardening-matrix claim, commit, push or release changes.

### FA-01 — first final-acceptance inventory (2026-10-16)

User requested starting final acceptance. Closed A-B-01/02/04 against modified
dev base 540f47d: Git/package/public-entry snapshot, required guidance review and
complete primitive/direct icon export inventory. Reproducible capture script
records source/output hashes, local refs/tags/status and all runtime/type export
names; 238 concrete JavaScript entry comparisons pass. Fresh package audit passes
imports, consumer typechecking, owned declarations/client directives and actual
packed-file equality. Corrected the package guide's obsolete AppButton route.

See [final acceptance execution](react-aria-final-acceptance.md) for exact scope,
snapshot, commands and limits. Logs /tmp/acceptance-inventory-{package,capture}.log.
Remaining: 317 A leaves, 20 editor V leaves and six future leaves. A-B-03 is the
next inventory task. API behavior/defaults, legal notices, full baseline checks,
cross-browser/AT and production release gates remain separate. No Git cleanup,
staging, commit, push, version change, publication or production promotion.


### FA-02–04 — durable acceptance evidence and local baseline (2026-10-16)

Closed A-B-03 (source/dependency/DOM/CSS/ambient/generated-artifact inventory),
A-B-11 (separate support promises) and A-B-06 (local baseline). The
[resume ledger](react-aria-final-acceptance.md) now names completed leaves, durable
source/output snapshots, actual transcripts, invalidation rules and next A-B-05.
It preserves FA-01 evidence and the original failing full-check transcript.

Nine stale calendar cases across four files failed the first unit run. Explicit
segment fixtures, preset option roles and unchanged-Apply behavior were reconciled
without production changes or removed assertions. Ten affected cases pass on
rerun; retain 1728 unaffected cases, totaling 1738 passing cases/279 suites for
current inputs. Foundation32/release4, typecheck, fresh library/private fixture
builds and actual package audit pass; unchanged public docs build is retained.

Current remaining: 314 A, 20 V, six future leaves. Source inventory/guard pass;
installed graph has no retired foundation package. This closes inventory and local
baseline leaves, not legal, actual device/AT, complete engine or remote CI gates.
No stage, commit, push, release or production promotion.


### FA-PARALLEL — fifteen user-requested conversations (2026-10-16)

Dispatched fifteen separate project conversations covering 55 distinct open A
leaves: API, architecture, interaction/state/props, naming, host boundaries, tokens,
typography/density, CSS, icons, adapters/translations and extraction/storage. All
fifteen confirmed active. [Registry](final-acceptance/dispatch-2026-10-16.json)
retains thread IDs, task IDs and unique evidence directories. Each must reuse
FA-01–04, inspect full obligations and record actual status/evidence/successors.
Shared source/checklists/counts remain coordinator-owned. No task is closed merely
by dispatch; current counts stay 314 A, 20 V and six future leaves pending review.


### FA-PARALLEL-REVIEW — results reconciled (2026-10-16)

All 15 assigned conversations delivered reports. Coordinator reviewed original-leaf
criteria, source/evidence limits and concrete successors: 32 accepted complete,
23 partial, zero blocked across 55 leaves. The dispatch registry now records reviewed
outcomes; the machine reconciliation retains original statements and report hashes.
Completed rows removed, remaining counts 282 A / 20 V / six future; 38 A closed in total.

No production library input changed beyond FA-04 test/fixture deltas; 1,778 output
hashes match FA-01. Existing tests retained; new Node26/jsdom probes characterize
six Clear defects without establishing supported-runtime/native acceptance.
BUG-0008/9 and the 23 partial successors are tracked; no commit/push/release action.


## Wave 02 acceptance and integrated corrections — 2026-10-16

All 282 remaining A leaves were reviewed exactly once by the original fifteen
conversations: 127 complete, 154 partial, one blocked. Twelve additional
user-authorized fix conversations delivered and were reviewed; coordinator
validation closes A-G-02 and A-K-16 as two further narrow contract/publication
obligations. Current total **167/320 A closed; 153 A, 20 editor V and six future
items remain**. This pass closed 129 of 282. Original wording, outcomes and
successors are preserved in [wave reconciliation](final-acceptance/wave-02-reconciliation.json)
and [supplement](final-acceptance/coordinator-integration/supplemental-reconciliation.json).

BUG-0008–0012 are corrected: picker disabled/read-only Clear/commit guards,
TextArea inherited icons/multiline alignment, DatePicker availability parity,
Calendar callback reason access and grid reserved __reorder IDs. Retain affected
31 picker/TextArea, 37 DateField/DatePicker, Calendar/locale, 123 grid and 24
composed transaction unit results with their actual source boundaries. Fresh
Node 24 library/type, foundation guard, package-import/consumer type/packed-file,
docs production/catalog and docs-owned native fixture builds pass. Seven focused
native cases per desktop engine pass in Chromium/Firefox/WebKit (21 executions;
18 unaffected earlier passes plus three enriched datetime reruns). First build
and test-driver failures remain preserved alongside successful corrections.

[Integration receipts](final-acceptance/coordinator-integration/evidence.json)
record exact current working inputs and built outputs. Earlier FA snapshots and
report hashes are immutable dated evidence. Documentation/manifest fixes are
separate from physical device/AT, legal/owner approval and full production
matrices; A-X-11 remains blocked on actual screen-reader/operator observation.
Resume the remaining specific successors, not completed inventories or unchanged
passing checks. Uncommitted dev work only; no production branch/tag/publication.


## Wave 03 dispatch — 2026-10-16

Created forty user-requested local conversations for all153 remaining A leaves,
assigned exactly once. All40 confirmed active in the first status snapshot.
[Registry](final-acceptance/wave-03-dispatch.json) retains original requirements,
prior report/successor links and individual objectives. Each owns its numbered
patch/evidence directory; shared integration/builds/checklists remain coordinated.
Counts remain153A/20V/6future until reviewed evidence justifies closure.
No repeated completed inventories, production branch changes or release actions.


## Wave03 integration / dev push — 2026-10-16

Reviewed all40 handoffs; integrated compatible51patch-file portions and subsequent
reproduced native fixes, preserving the preexisting calendar/editor/search work.
Closed14 bounded original A leaves;181/320 closed,139 A /20V /6future remain.
[Per-leaf decisions](final-acceptance/wave-03-integration/reconciliation.json) and
[push receipts](final-acceptance/wave-03-integration/push-evidence.json) retain exact
evidence and unperformed gates. Fresh build/type/foundation/token/docs/fixture/
package/browser-type/release-policy checks pass. Initial full unit run1843pass/1fail
was corrected with focused23-case rerun; current editor190case run and Select6
pass. Earlier89 native passes/8failures/1skip/64unrun are not a green complete
matrix; corrected native/operator/consumer/visual/owner/legal gates stay open.
User explicitly requested committing current work to dev and pushing it now.
Personal .obsidian state excluded; main/tags/publication/version untouched.

## Browser follow-up after dev snapshot bd169b54

Known automated failures resolved:1,851 unit tests pass;161 native cases have passing evidence with one unsupported Firefox touch skip;11 docs cases pass, including94 routes/1,138 compiled source snapshots. Fresh build/type/foundation/token/docs/fixture/package checks pass. Retain full-run and targeted-rerun distinctions in [receipts](final-acceptance/wave-03-followup/validation-results.json). No broader acceptance-count changes:139 A,20 V and six future items remain.


## HB-19 — editor layout/chrome presentation, 2026-10-17

V-C21-04/05, V-C22-04/05 and V-C23-04/05 close with the existing public composed
host, strengthened native assertions and 24 individually reviewed screenshots.
Nine cases pass in Chromium/Firefox/WebKit. Long labels wrap at 320px in light/dark,
both densities and English/Arabic RTL; localized actions, heading callbacks,
independent scroll ownership, focus return and logical reading order pass.
No production implementation change or spoken AT claim. The host textarea does
not close the separate Lexical editor/formatting leaves. Exact source hashes,
commands/results, limits and screenshot names are in the
[HB-19 receipt](final-acceptance/editor-chrome-presentation/results.json).
Current hardening count: 286/300 complete, 14 remaining. Final acceptance remains
139 open A leaves, with six explicitly deferred future leaves separate.
