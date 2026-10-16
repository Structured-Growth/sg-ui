# Wave 02-09: primitives and accessibility acceptance

Seven implementation/removal leaves are complete recommendations; thirteen broad behavior/accessibility leaves remain partial. All 20 full original requirements are reproduced below. This report writes only wave-02-09; it changes no shared checklist/count, source, prior report or release state. The coordinator owns closure. The 20 editor V leaves remain open.

Source base: modified dev at `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, 2026-10-16. [Structured results](results.json) contain one record per assigned ID. [Input evidence](input-evidence.json) records exact SHA-256 values, assertion titles/lines, mock census and receipt existence. [capture.py](capture.py) writes only this directory. [Operator cases](operator-cases.md) turn existing broad successors into explicit observation/deliverable records and a bounded drag-alternative inventory.

## Evidence reuse and limits

145 selected maintained inputs were compared with FA-02: 134 equal, 11 changed, zero missing/unmatched. Changes are two coordinator-owned acceptance documents plus implementation/tests for PeriodPicker, DateTimeRangePicker and DateRangeComparisonPicker, and TextArea implementation/style/tests. The nine component files are concurrent BUG-0008/0009 work. Their current hashes are dated attribution, not acceptance; no old built-output equality is claimed for them. Sixteen additional leaf references were hashed after the main capture; all match FA-02. Capture is sequential, not an atomic snapshot of concurrent edits.

Reuse FA-01 export/package snapshot, FA-02 inventory/guard, FA-04 original failure plus affected rerun/package receipts, and parallel-03/04/08/09/12/13 reconciliations. FA-04 retains 1,738 reconciled cases across 279 suites for its inputs; it does not turn the original failed full command into a pass or prove behavior of subsequently changed inputs. Unchanged scoped test inputs retain that aggregate evidence; no individual hidden passing-suite transcript is invented. No passed suite, complete source inventory, build, browser, packed consumer, install or remote CI check was rerun. All new analysis is read-only except these reports.

Historical acceptance batches 111/112/121/122/123 remain bounded to `e43bf604be74e0daf731bc990e6c3097f05ed89b` source review and their separately named tested candidates. Their raw-artifact observations are historical facts, not artifacts reopened in this wave. Current HB-07/11/15/16/17/18 backlog receipts add later native presentation evidence; they do not imply browser-chrome zoom, devices or speech. The four representative HB raw paths checked in input-evidence.json are absent here (HB-11 Chromium, HB-16 manifest, HB-17 Chromium and HB-07 progress results). Locate/archive retained manifests before current-host attribution; do not rerun unchanged completed cases merely to replace absent local paths.

## Progress beyond prior partial reports

- Replaced batch111/123 stale no-coarse-pointer observation with actual auto/pointer/touch scope, generated coarse-pointer branch and later HB-15/17 target measurements.
- Classified 17 real module-mock calls in *.test.tsx files by exact file/line; primitive behavior tests remain real, grid callback instrumentation and removed editor toolbar are explicit evidence limits.
- Located batch121 prepared Menu typeahead case in current docs host; preserved unestablished execution status instead of creating a duplicate test.
- Completed narrow investigation of resize alternatives: column menu only changes visibility/order; both renderers still expose resizers, with no owned width editor in inspected paths. Added row/page/range alternatives and remaining equivalence issues to the operation inventory.
- Converted autofill/AT/zoom/targets/clipboard successors into concrete transition records and named ownership prerequisites. They remain unexecuted and are not claimed as evidence.

## Leaf decisions

### A-U-11 — complete

Original requirement: Implement List/list items, navigation items, disclosure/Collapse, and selected/expanded state without misusing menu semantics for navigation.

Native ul/li lists, nav/anchor navigation with host current route, and Disclosure/Collapse implement selected/expanded state without navigation menu roles. List actions use aria-pressed; route links use aria-current=page. Collapse uses hidden or opt-in unmount. Disclosure links trigger/panel IDs and repairs focus on host collapse while respecting later outside focus.

Sources: `packages/ui/src/experimental/List/List.tsx`, `packages/ui/src/experimental/Navigation/Navigation.tsx`, `packages/ui/src/experimental/Disclosure/Disclosure.tsx`, `packages/ui/src/experimental/Collapse/Collapse.tsx`.

Tests/assertions: `packages/ui/src/experimental/List/List.test.tsx`, `packages/ui/src/experimental/Navigation/Navigation.test.tsx`, `packages/ui/src/experimental/Disclosure/Disclosure.test.tsx`, `packages/ui/src/experimental/Collapse/Collapse.test.tsx`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. HB-11 reports 8 cases per engine at 360px/150% text in both themes/densities/locales; it is retained report evidence, not a fresh exact-host pass.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

No required successor for this narrow implementation/removal leaf; broader X/device/AT obligations remain separately open.

### A-U-12 — complete

Original requirement: Implement Chip/Tag, Badge, and removable tokens with accessible action labels and predictable focus after removal.

Chip is deliberately passive; removable tokens are TagGroup. Badge preserves zero/text, names an optional group and preserves anchor names. TagGroup exposes host remove labels, translated Remove {label}, string ID requests, disabled/read-only removal policy and adjacent/empty-list focus. Tests cover accepted/rejected Delete/Backspace, pointer removal, sibling isolation and next/previous/empty focus.

Sources: `packages/ui/src/experimental/Chip/Chip.tsx`, `packages/ui/src/experimental/Badge/Badge.tsx`, `packages/ui/src/experimental/TagGroup/TagGroup.tsx`.

Tests/assertions: `packages/ui/src/experimental/Chip/Chip.test.tsx`, `packages/ui/src/experimental/Badge/Badge.test.tsx`, `packages/ui/src/experimental/TagGroup/TagGroup.test.tsx`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. Existing batch13-control-taggroup.spec.ts is native assertion coverage; no current native or spoken-AT claim.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

No required successor for this narrow implementation/removal leaf; broader X/device/AT obligations remain separately open.

### A-U-13 — complete

Original requirement: Implement progress indicators and status messages; distinguish determinate progress from loading and avoid noisy live-region announcements.

Progress distinguishes undefined/nonfinite loading from determinate zero, clamps values and normalizes invalid bounds; exposes names/valueText without a live region. Status defaults announcement=off; opt-in polite/status or assertive/alert is atomic. Contract comments prohibit progress-tick announcements. This closes the implementation/noisy-default requirement, not spoken announcement conformance.

Sources: `packages/ui/src/experimental/Progress/Progress.tsx`, `packages/ui/src/experimental/Status/Status.tsx`.

Tests/assertions: `packages/ui/src/experimental/Progress/Progress.test.tsx`, `packages/ui/src/experimental/Status/Status.test.tsx`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. HB-07 retains 8 Chromium localized narrow/enlarged presentation passes, native state/value and atomic-region assertions. No speech result follows.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

No required successor for this narrow implementation/removal leaf; broader X/device/AT obligations remain separately open.

### A-U-14 — complete

Original requirement: Implement Avatar/image fallbacks and accessible image labeling; keep sizing and aspect ratio stable while loading.

Avatar owns one named role=img root or decorative aria-hidden root. Inner image and fallback are hidden from AT; load reveals absolute image, error removes it, changed src remounts image state. CSS fixes small/medium/large square dimensions and aspect-ratio:1, making loading independent of intrinsic image size.

Sources: `packages/ui/src/experimental/Avatar/Avatar.tsx`, `packages/ui/src/experimental/Avatar/Avatar.module.css`.

Tests/assertions: `packages/ui/src/experimental/Avatar/Avatar.test.tsx`, `packages/ui/src/experimental/Avatar/Avatar.next100-regression.test.tsx`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. Load/error/source-replacement and one-name/root stability have DOM evidence; geometric stability is source-defined, not newly browser-measured.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

No required successor for this narrow implementation/removal leaf; broader X/device/AT obligations remain separately open.

### A-U-15 — complete

Original requirement: Implement semantic table parts and pagination primitives with owned contracts; do not export an engine's low-level table types as SGUI's entire API.

Table/table sections/row/caption/th/td use native elements, native refs, scope/headers/spans and owned props. Pagination is host-controlled zero-based with one-based presentation, known/unknown totals, safe sizes, disabled/boundary controls and atomic page-zero/size transaction. No engine low-level table type is the public API.

Sources: `packages/ui/src/experimental/Table/Table.tsx`, `packages/ui/src/experimental/Pagination/Pagination.tsx`, `packages/ui/src/components/primitives/index.ts`.

Tests/assertions: `packages/ui/src/experimental/Table/Table.test.tsx`, `packages/ui/src/experimental/Pagination/Pagination.test.tsx`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. Parallel-03 confirms public declarations have no non-React upstream type dependency; HB-16 retains native table header associations/scroll/reveal evidence (report-only here).

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

No required successor for this narrow implementation/removal leaf; broader X/device/AT obligations remain separately open.

### A-U-16 — complete

Original requirement: Implement toggle buttons/groups for editor and view-mode controls with pressed state and appropriate single/multiple selection semantics.

ToggleButton owns selected/defaultSelected/onSelectedChange and aria-pressed via React Aria. ToggleButtonGroup owns string IDs, single/multiple selection, allowEmpty, disabled options and orientation. Tests cover one Enter/Space toggle, host rejection, multiple selection, required single, RTL/vertical arrows, disabled skipping/fieldset, repeated IDs and remount defaults. Commands remain non-submit buttons.

Sources: `packages/ui/src/experimental/ToggleButton/ToggleButton.tsx`.

Tests/assertions: `packages/ui/src/experimental/ToggleButton/ToggleButton.test.tsx`, `packages/ui/src/experimental/ToggleButton/ToggleButton.next100-regression.test.tsx`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. Parallel-04 independently characterizes distinct onPress and onSelectedChange calls; two notifications are intentional, not duplicate activation.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

No required successor for this narrow implementation/removal leaf; broader X/device/AT obligations remain separately open.

### A-U-17 — partial

Original requirement: Provide consistent focus ring, target size, disabled styling, validation, status announcement, and pointer/keyboard interactions across primitives.

Shared focus/interaction tokens and owned validation/status primitives exist. Progress since batch111: auto/pointer/touch policy, 2.75rem touch minimum, control-text metrics and portal propagation replace its old no-coarse-pointer observation. HB-15/17 report target/bounds fixes. Consistency across every primitive/state and speech remains unverified.

Sources: `packages/ui/src/experimental/TextField/TextField.tsx`, `packages/ui/src/experimental/Checkbox/Checkbox.tsx`, `packages/ui/src/experimental/Switch/Switch.tsx`, `packages/ui/src/experimental/RadioGroup/RadioGroup.tsx`, `packages/ui/src/experimental/Status/Status.tsx`, `packages/ui/src/foundation/ThemeScope.tsx`, `packages/ui/src/foundation/tokens.css`.

Tests/assertions: `packages/ui/src/experimental/TextField/TextField.test.tsx`, `packages/ui/src/experimental/Checkbox/Checkbox.test.tsx`, `packages/ui/src/experimental/Switch/Switch.test.tsx`, `packages/ui/src/experimental/RadioGroup/RadioGroup.test.tsx`, `packages/ui/src/experimental/Status/Status.test.tsx`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. Parallel-08 retained named token-pair checks; HB-15/17 native report slices. Token existence is not measured target/contrast conformance.

Limits: Current TextArea and three picker inputs differ from FA-02; their state guards/style changes await coordinator correction receipts. Do not apply FA-04 output evidence to those changes.

Required successor deliverables:

- U17-MATRIX: produce per-public-primitive focus/disabled/error/status/target/keyboard/pointer evidence rows using operator-cases.md; attach existing valid receipts before scheduling only uncovered/changed scopes. Include inline-link/indicator hit-area exceptions and named AT status results.

### A-U-18 — partial

Original requirement: Preserve native form participation, reset behavior, autofill, names/values, and submit behavior; test controlled and uncontrolled variants.

Native input/form/name/value, controlled/default, reset prevention/reassociation and explicit submit/reset have extensive retained assertions. Progressed manual successor into concrete autofill observation protocol in operator-cases.md and categorized current test entry points. autocomplete forwarding is not real populated-profile autofill. TextArea and three picker fixes are changed inputs; current-head form closure is not established.

Sources: `packages/ui/src/experimental/TextField/TextField.tsx`, `packages/ui/src/experimental/TextArea/TextArea.tsx`, `packages/ui/src/experimental/Checkbox/Checkbox.tsx`, `packages/ui/src/experimental/Switch/Switch.tsx`, `packages/ui/src/experimental/RadioGroup/RadioGroup.tsx`, `packages/ui/src/experimental/Select/Select.tsx`, `packages/ui/src/experimental/ComboBox/ComboBox.tsx`, `packages/ui/src/components/Button/Button.tsx`.

Tests/assertions: `packages/ui/src/experimental/TextField/TextField.test.tsx`, `packages/ui/src/experimental/TextArea/TextArea.test.tsx`, `packages/ui/src/experimental/Checkbox/Checkbox.test.tsx`, `packages/ui/src/experimental/Switch/Switch.test.tsx`, `packages/ui/src/experimental/RadioGroup/RadioGroup.test.tsx`, `packages/ui/src/experimental/Select/Select.test.tsx`, `packages/ui/src/experimental/ComboBox/ComboBox.test.tsx`, `packages/ui/tests/browser/batch01-forms.spec.ts`, `packages/ui/tests/browser/batch05-native-reset.spec.ts`, `packages/ui/tests/browser/batch11-standalone-reset.spec.ts`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. Parallel-04 state/activation characterization retained; no complete native autofill receipt.

Limits: Concurrent TextArea and picker changes invalidate their original implementation/test hashes. Browser autofill and password-manager behavior need actual operator/browser evidence.

Required successor deliverables:

- U18-AUTOFILL: execute protocol AF-1 with populated browser profile; retain accepted/rejecting controlled and uncontrolled values/callbacks/FormData, reset and submit observations without storing profile secrets.
- U18-CHANGED: coordinator attach BUG-0008/0009 expected-zero-edit and corrected TextArea receipts; rebuild once in an authorized window and verify only affected form/native transactions. Preserve unchanged form evidence.

### A-U-19 — partial

Original requirement: Define overlay collision/placement behavior at narrow widths and browser zoom; preserve theme/locale in portals and avoid clipped popovers.

Popover defines four owned placements, md/lg/content sizing and popover/dialog/drawer/auto presentation (auto drawer below 40rem). One position owner clamps an offscreen anchor to visualViewport, flips/shifts then scroll-constrains; ancestor scroll updates are owned/cleaned. ThemeScope copies theme/density/interaction/variables, dir/lang into portals. Native collision spec already covers four placements, light/dark, LTR/RTL, enlarged text, edge/scroll hosts, bounds/hit testing and retained draft/focus. Actual browser zoom and full overlay families remain open.

Sources: `packages/ui/src/experimental/Popover/Popover.tsx`, `packages/ui/src/experimental/Menu/Menu.tsx`, `packages/ui/src/experimental/Tooltip/Tooltip.tsx`, `packages/ui/src/foundation/ThemeScope.tsx`.

Tests/assertions: `packages/ui/src/experimental/Popover/Popover.test.tsx`, `packages/ui/src/experimental/Menu/Menu.test.tsx`, `packages/ui/src/experimental/Tooltip/Tooltip.test.tsx`, `packages/ui/tests/browser/popover-native-collision.spec.ts`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. Existing collision assertion map is reused; its source is not a new passing native execution.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

Required successor deliverables:

- U19-ZOOM: collect actual browser zoom/visualViewport collision results for Popover, Menu, Tooltip, ComboBox/Select and date overlays; include nested scopes, independent scrolling, viewport resize and focus return. Reuse existing collision case assertions, retain exact host/source/engine receipt, add cases only for uncovered composition behavior.

### A-U-20 — complete

Original requirement: Make temporary migration shims explicit and internal where possible; remove all shims that depend on the retired foundation before completion.

Retired-foundation dependency removal is established by FA-02 source/dependency inventory and FA-04 foundation/package guards, supplemented by parallel-03 declaration/API closure. Explicit AppThemeProvider is a preserved public alias of owned Provider, not a retired bridge. Internal ownedGridPersistence converts four legacy presentation keys, normalizes owned state and deliberately refuses retired sort/filter models; it is not a foundation shim. Keep both; deleting them would remove supported compatibility without satisfying a missing runtime dependency.

Sources: `packages/ui/src/theme/AppThemeProvider.tsx`, `packages/ui/src/components/AppDataGrid/ownedGridPersistence.ts`, `packages/ui/scripts/check-foundations.mjs`, `docs/migration.md`, `docs/developer/react-aria-removal-audit.md`.

Tests/assertions: `packages/ui/src/components/AppDataGrid/ownedGridPersistence.test.tsx`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. FA-02 installed graph has no MUI/Emotion; parallel-03 public declaration scan reports no escaping engine types. Relevant alias/persistence/guard inputs remain unchanged.

Limits: No repeat all-source scan or rebuilt-output claim. Current independent bug fixes do not reintroduce retired imports in the inspected scopes; wider legal/historical-reference acceptance remains separate.

No required successor for this narrow implementation/removal leaf; broader X/device/AT obligations remain separately open.

### A-X-01 — partial

Original requirement: Replace implementation-mirroring tests with behavior tests where needed; avoid mocks that hide the very focus/keyboard behavior under migration.

Purpose-specific current census finds 17 vi.mock calls across source *.test.tsx files. No experimental primitive test replaces an interaction module. Grid drop-focus wrapper delegates the real useDragAndDrop but exposes callbacks: useful lifecycle characterization, not trusted drag. Editor tests remove floating toolbar and instrument Lexical/plugins, so they cannot prove hidden toolbar focus/selection. This advances batch121 successor with exact path/line census and classification rather than another suite.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridInteraction.drop-focus.test.tsx`, `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.floating.test.tsx`, `packages/ui/src/components/PageRichTextEditorSection/PageRichTextEditorSection.dialogs.test.tsx`.

Tests/assertions: `packages/ui/tests/browser/editor-clipboard.spec.ts`, `packages/ui/tests/browser/batch01-grid-reorder.spec.ts`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. Mock locations and primitive assertion titles captured in input-evidence.json; historical batch121 native insertion is a bounded report receipt.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

Required successor deliverables:

- X01-REVIEW: retain the instrumentation tests, but attach real unmocked floating-toolbar focus/selection and native drag evidence to their requirements. Review remaining component assertions against named behavior, identify any assertion that only mirrors implementation, and replace only those concrete gaps. Keep 20 editor V leaves open.

### A-X-02 — partial

Original requirement: Define keyboard contracts and verify Tab/Shift+Tab, arrows, Home/End, Enter/Space, Escape, and typeahead where appropriate.

Current contracts/assertions cover Tab directions, arrows/Home/End, Enter/Space/Escape in appropriate controls. Batch121 typeahead successor exists as acceptance-pack-121.spec.ts and now uses the docs /fixtures host; it checks enabled Menu match, disabled-only match, dismissal and return focus. Search found no other explicit typeahead-named source/spec assertion; this bounded text result does not prove absent implicit coverage. No retained execution for that prepared case was established here.

Sources: `packages/ui/src/experimental/Menu/Menu.tsx`, `packages/ui/src/experimental/Select/Select.tsx`, `packages/ui/src/experimental/ComboBox/ComboBox.tsx`, `packages/ui/src/experimental/ToggleButton/ToggleButton.tsx`, `packages/ui/src/experimental/Disclosure/Disclosure.tsx`.

Tests/assertions: `packages/ui/src/experimental/Menu/Menu.test.tsx`, `packages/ui/src/experimental/Select/Select.test.tsx`, `packages/ui/src/experimental/ComboBox/ComboBox.test.tsx`, `packages/ui/src/experimental/ToggleButton/ToggleButton.test.tsx`, `packages/ui/src/experimental/Disclosure/Disclosure.test.tsx`, `packages/ui/tests/browser/acceptance-pack-121.spec.ts`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. Historical batch121 prepared-case status remains UNRUN in that report. HB-11 adds navigation/disclosure native report evidence, not complete collection/typeahead closure.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

Required successor deliverables:

- X02-KEYS: execute existing Menu typeahead case only if no valid coordinator receipt exists; retain current docs-host provenance. Explicitly map noneditable Select/Menu typeahead versus editable ComboBox/SearchField text input, Tab/Shift+Tab, Home/End, activation and Escape per control. Fill uncovered keys, including editor/grid paths, with focused native evidence.

### A-X-03 — partial

Original requirement: Verify accessible names/descriptions, roles, state announcements, validation, heading hierarchy, landmarks, and native form semantics.

Primitive names, descriptions, native roles/state and form associations are covered in focused tests; Typography semantic hierarchy was completed in parallel-09. HB-07/11/16 add localized status/nav/table reports, beyond batch122 historical slices. Full composed names/IDREF/heading/landmark/state matrix and actual announcements are missing. BUG-0008/9 corrections must be attributed separately.

Sources: `packages/ui/src/experimental/Status/Status.tsx`, `packages/ui/src/experimental/TextField/TextField.tsx`, `packages/ui/src/experimental/Navigation/Navigation.tsx`, `packages/ui/src/experimental/Disclosure/Disclosure.tsx`, `packages/ui/src/experimental/Table/Table.tsx`, `packages/ui/src/experimental/Progress/Progress.tsx`.

Tests/assertions: `packages/ui/src/experimental/Status/Status.test.tsx`, `packages/ui/src/experimental/TextField/TextField.test.tsx`, `packages/ui/src/experimental/Navigation/Navigation.test.tsx`, `packages/ui/src/experimental/Disclosure/Disclosure.test.tsx`, `packages/ui/src/experimental/Table/Table.test.tsx`, `packages/ui/src/experimental/Progress/Progress.test.tsx`, `packages/ui/tests/browser/acceptance.spec.ts`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. Named token/DOM/axe results cannot establish speech; historical batch122 modal-validation slices are bounded to their old candidate heads.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

Required successor deliverables:

- X03-SEMANTICS: produce per-route/state name/description IDREF and heading/landmark audit for docs compositions; use SEM-1 and AT-1 in operator-cases.md for native validation and pending/error/success speech, recording browser/AT/OS versions and host-supplied labels. Do not certify announcement timing from aria-live alone.

### A-X-04 — partial

Original requirement: Verify initial focus, return focus, focus after removal/reorder/update, trapped focus in modals, and nested-overlay dismissal ordering.

TagGroup accepted/rejected removal and Disclosure host-collapse recovery have focused retained evidence. Dialog/Popover own containment/dismissal/recovery; grid owns reorder/update focus repair. HB-17 reports repaired wrapped reorder targets and native focus regressions. Historical batch122 removed-opener/mixed-modal slices and current test files do not cover every overlay/grid/update composition or editor flow.

Sources: `packages/ui/src/experimental/TagGroup/TagGroup.tsx`, `packages/ui/src/experimental/Disclosure/Disclosure.tsx`, `packages/ui/src/experimental/Dialog/Dialog.tsx`, `packages/ui/src/experimental/Popover/Popover.tsx`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`.

Tests/assertions: `packages/ui/src/experimental/TagGroup/TagGroup.test.tsx`, `packages/ui/src/experimental/Disclosure/Disclosure.test.tsx`, `packages/ui/src/experimental/Dialog/Dialog.test.tsx`, `packages/ui/src/experimental/Popover/Popover.test.tsx`, `packages/ui/tests/browser/batch52-dialog-removed-opener.spec.ts`, `packages/ui/tests/browser/batch01-grid-reorder.spec.ts`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. HB-11/17 report native slices; no fresh execution or complete device/AT focus behavior.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

Required successor deliverables:

- X04-FOCUS: reconcile FOCUS-1 transition rows with existing nested/removed-opener/grid receipts, then execute only changed or uncovered transitions; require initial/trapped/return/removal/reorder focus and nested topmost Escape/outside ordering, with actual focused element and two-frame stability. Include host explicit focus destinations and 20 editor V leaves separately.

### A-X-05 — partial

Original requirement: Ensure sticky headers/footers do not obscure focused controls; verify zoom/reflow/text-spacing behavior and scroll padding where needed.

Earlier parallel-09 already kept D-09 partial; rem metrics and 150% root-text presentation are retained. HB-08/09/10/18 add narrow header/shell/modal/editor-dialog reflow reports; HB-18 includes the discovered textarea focus-outline clipping repair. display-preferences covers 200% root text plus text spacing. Actual browser chrome zoom and complete sticky/focus/scrollport coverage remain absent.

Sources: `packages/ui/src/experimental/Dialog/Dialog.module.css`, `packages/ui/src/components/AppShell/AppShellMain.tsx`, `packages/ui/src/components/AppPageHeader/AppPageHeader.module.css`.

Tests/assertions: `packages/ui/tests/browser/display-preferences.spec.ts`, `packages/ui/tests/browser/hardening-header-tabs-presentation.spec.ts`, `packages/ui/tests/browser/hardening-shell-presentation.spec.ts`.

Evidence: Reuse parallel-09 D09 successors and HB reports; current TextArea changes are outside older output acceptance. Root font scaling is not actual browser zoom.

Limits: No actual chrome zoom, physical-device or all-catalog reflow pass. Current TextArea focus/style fixes need new affected-input receipts.

Required successor deliverables:

- X05-ZOOM: perform ZOOM-1 operator transitions at actual 200%/400% zoom and explicit spacing, with independent panes, sticky chrome, overlay opening/dismissal and viewport resize. Record focused control bounds/ring and scroll owner. Locate HB receipts before considering any repeat of completed enlargement checks.

### A-X-06 — partial

Original requirement: Verify text/non-text contrast, visible focus, high contrast/forced colors, reduced motion, and state meaning beyond color.

Parallel-08 supports named token contrast checks and docs 21-map theme assertions. Controls implement forced-colors/reduced-motion and explicit selected/disabled/error/state semantics. Historical batch122 header ratios and later HB screenshots cover selected contexts, not all composited text/non-text/focus states. Source does not certify actual OS high contrast or state meaning without color.

Sources: `packages/ui/src/foundation/tokens.json`, `packages/ui/src/experimental/Progress/Progress.module.css`, `packages/ui/src/experimental/ToggleButton/ToggleButton.module.css`, `apps/docs/theme/theme-graph.test.mjs`.

Tests/assertions: `packages/ui/scripts/tokens.test.mjs`, `packages/ui/tests/browser/display-preferences.spec.ts`.

Evidence: Reuse FA-04 foundation and retained docs theme checks via parallel-08; no repeated contrast test run, browser measurement or OS/AT session.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

Required successor deliverables:

- X06-MEDIA: execute MEDIA-1 for computed text/non-text/focus pairs through hover/pressed/selected/disabled/error/loading in representative composed controls and supplied surfaces; retain actual forced-colors/high-contrast and reduced-motion observations and grayscale/non-color cues. Separate host override responsibility; repair only observed failing pair/state.

### A-X-07 — partial

Original requirement: Verify target size/spacing against WCAG requirements and aim for comfortable primary touch targets; test coarse-pointer use rather than shrinking every hit area with density.

Batch123 old finding of no coarse-pointer branch is superseded: generated any-pointer:coarse auto scope plus explicit touch mode bind 2.75rem target minimum. HB-15 calendar and HB-17 grid reports assert computed >=44px controls in both axes and containment; HB-17 found overlap despite initial passing checks and corrected it. No blanket WCAG compliance follows: links, resizers, indicators plus labels, adjacent spacing and exceptions require geometry review.

Sources: `packages/ui/src/foundation/ThemeScope.tsx`, `packages/ui/src/foundation/tokens.css`, `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`.

Tests/assertions: `packages/ui/tests/browser/hardening-grid-presentation.spec.ts`, `packages/ui/tests/browser/hardening-date-presentation.spec.ts`.

Evidence: HB-15/17 retained report evidence; declared 44px minimum and touchscreen emulation are not physical touch usability or a complete target/spacing audit.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

Required successor deliverables:

- X07-TARGETS: use TARGET-1 to record actual hit rectangles/spacing/overlap for inline links, field labels/indicators, grid resize handles, calendar dates, menus and primary actions across compact/comfortable and auto coarse/explicit touch. Record chosen applicable WCAG requirement/exception rationale with accessibility owner; obtain named physical primary-touch observations.

### A-X-08 — partial

Original requirement: Provide both keyboard and single-pointer non-drag alternatives for drag operations where required; keyboard support alone does not satisfy every dragging requirement.

Advanced prior batch123 investigation: both DataGrid renderers expose ColumnResizer and keyboard/pointer resize ownership, while inspected DataToolbarColumnsMenu has visibility and order Move buttons but no width entry/step action. Grid row reorder and ExperiencePageNavigator expose pointer-clickable Move up/down alternatives; range dragging has endpoint fields/day-click policies plus keyboard Shift/Alt arrows. Exact equivalent duration-preserving range move for a no-fields host is not established. See drag-alternatives table in operator-cases.md.

Sources: `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`, `packages/ui/src/experimental/DataGrid/DataGrid.tsx`, `packages/ui/src/components/DataToolbar/components/DataToolbarColumnsMenu.tsx`, `packages/ui/src/components/ExperiencePageNavigator/ExperiencePageNavigator.tsx`, `packages/ui/src/experimental/DateRangeSelector/RangeGestures.tsx`.

Tests/assertions: `packages/ui/tests/browser/reorder.spec.ts`, `packages/ui/tests/browser/batch01-grid-reorder.spec.ts`, `packages/ui/tests/browser/batch61-keyboard-range-preview.spec.ts`.

Evidence: FA-04 corrected aggregate baseline (1,738 cases/279 suites) and package receipts reused only for unchanged inputs. Original all-in-one run failed calendar cases; affected correction/rerun remains separate. Individual passing suite counts are not reconstructed from compact logs. Historical batch123 Chromium emulated-touch Move case is bounded report evidence; no new drag/touch result.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

Required successor deliverables:

- X08-RESIZE: accessibility/product owner decides required single-pointer non-drag width path. Existing resizer press interaction must first be observed natively; if it does not expose an equivalent non-drag action, implement owned numeric width/step/reset controls invoking the same bounded/flexible width core and complete-snapshot callback. Test pointer-only edits, min/max/fill preservation, keyboard alternative and rejection. Do not assume keyboard resize satisfies pointer alternative.
- X08-RANGE: document/verify equivalent move/resize result through endpoint/day controls under fields hidden, fixed/bounded length and active-endpoint policies. Add a non-drag action only where equivalence is missing; retain native pointer evidence and cancellation.
- X08-INVENTORY: complete editor-image/table resizing and any host drag-only extension inventory; do not infer it from row reorder.

### A-X-09 — partial

Original requirement: Test real browser interaction, including pointer/touch, focus, layout, portals and clipboard; DOM-emulation tests alone are insufficient.

Real native infrastructure/specs and retained HB reports cover actual pointer/keys/focus/layout/portals; grid touch and clipboard historical slices remain distinct. DOM tests, event injection and fixture builds are not native passes. Current shared acceptance preserved 20 editor V gaps; actual clipboard denial/OS prompts/IME and physical touch cannot be inferred from source.

Sources: `packages/ui/playwright.config.ts`, `apps/docs/playwright.config.ts`.

Tests/assertions: `packages/ui/tests/browser/acceptance.spec.ts`, `packages/ui/tests/browser/reorder.spec.ts`, `packages/ui/tests/browser/editor-clipboard.spec.ts`, `packages/ui/tests/browser/batch05-grid-clipboard.spec.ts`, `packages/ui/tests/browser/popover-native-collision.spec.ts`.

Evidence: Reuse existing HB and batch123 reports, with exact historical head/output limits. No remote/browser/clipboard/device action performed.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

Required successor deliverables:

- X09-NATIVE: assemble evidence rows by pointer/touch/focus/layout/portal/clipboard capability from retained manifests; identify changed scopes before authorized bounded native runs. Collect CLIP-1 OS/browser permission/denial and actual transfer observations; preserve editor V obligations and physical touch distinction.

### A-X-10 — partial

Original requirement: Establish supported Chrome/Firefox/WebKit browser checks and document representative touch and assistive-technology coverage.

Supported engine infrastructure is established: Playwright Chromium/Firefox/WebKit projects, one worker, zero retries, loopback docs-owned host and failure traces; CI installs engines. FA-03 defines React/Node/browser support boundaries. HB reports contain later three-engine slices. No current remote CI, physical Safari/iOS/Android or named spoken AT coverage is established.

Sources: `packages/ui/playwright.config.ts`, `.github/workflows/ci.yml`, `docs/developer/react-aria-runtime-ci.md`, `docs/developer/react-aria-browser-acceptance.md`.

Tests/assertions: `packages/ui/tests/browser/acceptance.spec.ts`.

Evidence: Configuration and report evidence only; WebKit engine is not branded Safari or iOS; axe is not AT. No external review/owner signoff is implied.

Limits: Unchanged selected inputs retain FA-04 aggregate unit evidence. No new runtime/native/device/AT result. Full transitive host/build equivalence is not established.

Required successor deliverables:

- X10-SUPPORT: accessibility/QA owner names supported browser/OS/device/AT pairings and completes AT-1/TOUCH-1 records, or documents explicitly scoped unsupported combinations. Coordinator archives valid three-engine source/build/results receipts and runs only changed/uncovered checks before future full production gate.

## Checks actually performed

Read full assigned leaves and acceptance guidance; inspected cited current implementations/styles/assertions plus prior reports and HB receipts; bounded input hash comparisons; purpose-specific test mock census; reviewed the existing native collision/typeahead assertions and generated interaction policy; checked four representative native receipt paths. No source behavior failure was reproduced and no test result was manufactured. See operator cases for exact next deliverables and owner prerequisites. No stage/commit/push/reset/clean/worktree/server/publication action occurred.
