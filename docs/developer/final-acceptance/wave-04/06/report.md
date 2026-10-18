# Wave04/06: dialogs, navigation and menus

**Recommendation:4 complete,5 partial,0 blocked.** Coordinator review owns closure; central ledgers unchanged. Baseline/head `6c485ed79d0d6a521d188e5bde8315722296f518` on dev. No new suites run.

## Reviewable work

- `documentation.patch` and exact proposed-file mirrors correct obsolete Firefox action evidence and removed Storybook wording. Patch applies read-only; no shared files changed.
- `zoom-probe.js` is a read-only console expression for the real browser zoom successor; it records geometry, scope, focus, hit targets and scroll metrics without setting or inferring zoom. `remaining-cases.md` requires browser chrome screenshots, keyboard traversal and real zoom; `fixture-ids.json` fixes current host IDs.
- `evidence.json` extracts63 exact passing native executions from the retained raw report and hashes evidence.97 scoped source files match retained inputs after layering animated indicator and HB20 receipts. This is not a transitive/build-output audit.
- `validation-plan.json` separates checks actually performed here from unexecuted manual/AT/owner successors. Existing Select simulator speech cannot stand in for Dialog speech.

## Per-leaf recommendations

### A-M-08 — partial

- [ ] A-M-08 Reconcile AppModal final acceptance: Owned close reasons/size/parts, focus, sticky tabs, scroll, actions and steps. Link its `F-C08`, `T-C08` and `V-C08` evidence and any unresolved defects.

F-C08/T-C08 baseline and regression links remain in wave-02-01/report.md; V-C08 HB10/18 stays accepted. The formerly unrun 24 size×heightMode matrix plus custom540×440 override, lock/wheel and ownership cases now pass all three engines (9 native executions total). Owned reasons, actions and step assertions remain in AppModal units. Sticky tab and whole-dialog fallback remain separately documented in modal-container-boundary/display-preferences evidence.

**Outstanding:** M08-SPEECH: retain named dialog/menu/popover title/description, background virtual-cursor isolation, removed-opener and accepted host destination speech review from wave-03-14/operator-cases.md. No speech result found.

**Proposal:** No implementation patch; remaining-cases.md gives exact speech successor.

Evidence: `docs/developer/final-acceptance/wave-02-01/report.md`, `docs/developer/final-acceptance/wave-03-14/results.json`, `docs/developer/final-acceptance/wave-03-followup/validation-results.json`. Exact SHA256 values are in results.json/evidence.json.

### A-M-10 — partial

- [ ] A-M-10 Reconcile ExperiencePageNavigator final acceptance: Previous/next boundaries, labels, disabled states, link/action semantics. Link its `F-C10`, `T-C10` and `V-C10` evidence and any unresolved defects.

F-C10/T-C10 authoring-list units and HB14 V-C10 native presentation remain accepted. Current public model contains pages/activePageKey and add/select/rename/remove/reorder callbacks. Move up/down are reorder commands; there is no adjacent href or previous/next API.

**Outstanding:** M10-INTENT: product/API owner must explicitly dispose of previous/next and link clauses or approve adjacent navigation contract; use decision fields in remaining-cases.md. No decision is fabricated.

**Proposal:** Proposed page-navigation guide removes stale Stories claim and identifies exact requirement mismatch.

Evidence: `docs/developer/final-acceptance/wave-02-01/report.md`, `docs/developer/final-acceptance/wave-03-16/results.json`. Exact SHA256 values are in results.json/evidence.json.

### A-U-07 — partial

- [ ] A-U-07 Reconcile original `U-07`: Implement Menu/MenuItem, submenus when required, Popover, and Tooltip; distinguish menu commands from arbitrary form content in a popover. Historical status: open.

Flat Menu commands, Home/End/typeahead/disabled skipping/Space/Tab/Escape, named form Popover and supplemental Tooltip all have passing native cases in three engines. HB14 presentation and HB20 intrinsic Menu width fix are retained.

**Outstanding:** U07-HIERARCHY: implement HM-F-01–04 reusable sliding drilldown/Back panel per hierarchical-menu-scope.md. Existing SideNavigation hierarchy does not supply the standalone component.

**Proposal:** No speculative public API or flyout implementation. remaining-cases.md preserves approved no-flyout requirements.

Evidence: `docs/developer/final-acceptance/wave-03-19/results.json`, `docs/developer/final-acceptance/wave-03-followup/validation-results.json`, `docs/developer/final-acceptance/rich-editor-presentation/results.json`. Exact SHA256 values are in results.json/evidence.json.

### A-U-08 — partial

- [ ] A-U-08 Reconcile original `U-08`: Implement dialog primitives and modal composition with title/description, dismissal reasons, initial/return focus, scroll locking, background interaction handling, and nested overlays. Historical status: open.

Dialog title/description and owned reason contracts are implemented; prior native trap/return/topmost/outside cases remain. New integrated overlay cases establish actual pre/post document scrollability, nested wheel locking, child Tab/Shift+Tab containment, repeated child return, live portals and final unlock in all engines.

**Outstanding:** U08-SPEECH: preserve prior actual dialog announcement/modality successor. DOM focus/trap/hit tests do not establish virtual-cursor isolation or title/description speech. Use remaining-cases.md; existing simulator Select proof is not Dialog evidence.

**Proposal:** Prepared concrete speech execution scope; no simulator or operator run claimed.

Evidence: `docs/developer/final-acceptance/wave-02-08/report.md`, `docs/developer/final-acceptance/wave-03-14/results.json`, `docs/developer/final-acceptance/wave-03-followup/validation-results.json`. Exact SHA256 values are in results.json/evidence.json.

### A-U-09 — complete

- [ ] A-U-09 Reconcile original `U-09`: Implement Tabs with correct roles, panels, orientation, activation mode, disabled tabs, focus visibility, and overflow behavior. Historical status: open.

Original roles/panels/orientation/manual/automatic/disabled skipping/focus/overflow clauses have retained Tabs tests and native evidence. Controlled accepting/rejecting hosts run both densities/orientations/activation modes in3 engines. Six changed/new indicator files match animated-tab-indicators receipt; its two WebKit warnings are superseded by HB20 all33 tab/overflow passes with strict zero-page-error assertions intact.

**Outstanding:** None within original U09 implementation/behavior criterion. Broader actual zoom/device/spoken-AT gates stay separate; coordinator owns checkbox decision.

**Proposal:** No new tests or implementation; do not repeat accepted33-case tabs matrix.

Evidence: `docs/developer/final-acceptance/wave-03-18/results.json`, `docs/developer/final-acceptance/wave-03-followup/validation-results.json`, `docs/developer/final-acceptance/animated-tab-indicators/results.json`, `docs/developer/final-acceptance/rich-editor-presentation/results.json`. Exact SHA256 values are in results.json/evidence.json.

### A-U-19 — partial

- [ ] A-U-19 Reconcile original `U-19`: Define overlay collision/placement behavior at narrow widths and browser zoom; preserve theme/locale in portals and avoid clipped popovers. Historical status: open.

Live Menu/Tooltip1100↔360 collision and theme/density/dir/lang scope tests now pass3 engines. Existing Popover edge/scroll-host assertions retained. HB20 Menu intrinsic width correction has matching source hash. Text enlargement/native CSS viewport cases are not actual browser zoom.

**Outstanding:** U19-ZOOM: execute real browser chrome100/200/400% collision/reachability for Menu/Tooltip/Popover/ComboBox/Select/DatePicker/DateRangePicker, recording chrome zoom evidence plus keyboard/resize/scope results.

**Proposal:** New read-only zoom-probe.js, exact registry fixture-ids.json, and bounded remaining-cases.md procedure. None are execution results.

Evidence: `docs/developer/final-acceptance/wave-02-09/report.md`, `docs/developer/final-acceptance/wave-03-14/results.json`, `docs/developer/final-acceptance/wave-03-followup/validation-results.json`, `docs/developer/final-acceptance/rich-editor-presentation/results.json`. Exact SHA256 values are in results.json/evidence.json.

### A-H-02 — complete

- [ ] A-H-02 Reconcile original `H-02`: Verify modifier clicks, downloads, external links, targets, default prevention, and navigation callback ordering through browser tests. Exact-byte transfers and native semantics in all three engines, CI 37560065588; [browser evidence](react-aria-browser-acceptance.md). Historical status: checked.

Six composed browser cases×3 engines =18 passes. Fallback and Custom modes assert native ControlOrMeta/target popup URLs, relative named download exact bytes/filename, external native bypass, download=false routing, cancellation and consumer→navigate→prevented bubble ordering. Historical all-three-engine exact transfers/CI37560065588 retained at original scope.

**Outstanding:** None within original H02 browser semantics criterion. No new CI, installed framework history or physical gesture claim.

**Proposal:** No implementation change; retire prior unrun composed-routing successor after coordinator review.

Evidence: `docs/developer/final-acceptance/wave-03-16/results.json`, `docs/developer/final-acceptance/wave-03-followup/validation-results.json`. Exact SHA256 values are in results.json/evidence.json.

### A-H-03 — complete

- [ ] A-H-03 Reconcile original `H-03`: Integrate React Aria routing where needed behind the existing host adapter; avoid two competing navigation systems or a runtime Next.js dependency. Historical status: open.

Integrated routing-ownership guide and composed Menu/Breadcrumbs/SideNavigation/Link fixture route through one host adapter. Native pointer/Enter one-owner counts, replace, disabled Menu item, host pathname replacement, current state and native anchor/ref identity pass both modes/all3 engines. Menu routing is internal to owned interactions; no competing router or runtime Next.js dependency added.

**Outstanding:** None within original H03 integration criterion; framework-specific host history remains host-owned.

**Proposal:** No second routing system introduced. Retained public host-adapter documentation is integrated.

Evidence: `docs/developer/final-acceptance/wave-03-16/results.json`, `docs/developer/final-acceptance/wave-03-followup/validation-results.json`. Exact SHA256 values are in results.json/evidence.json.

### A-A-07 — complete

- [ ] A-A-07 Reconcile original `A-07`: Specify native click versus normalized press semantics without surprising consumers; prevent duplicate callback invocation and document keyboard/touch activation. Historical status: open.

Integrated ToggleButton/DataGridDragHandle wrappers discard upstream event payloads. Owned callbacks notify once for pointer/Enter/Space; native submit/reset order and emulated touch pass9 native executions across3 engines. Button guide specifies ordinary normalized press, native click capture before form defaults, and distinct selection notification order as unspecified. Native Link click remains cancellable and separate.

**Outstanding:** None within original specify/prevent-duplicates/document-activation criterion. Actual physical touch and spoken AT remain separate; emulation is not a device claim.

**Proposal:** Proposed button guide corrects obsolete Firefox hold, linking integrated results and retaining physical/AT limits.

Evidence: `docs/developer/final-acceptance/wave-03-04/results.json`, `docs/developer/final-acceptance/wave-03-followup/validation-results.json`. Exact SHA256 values are in results.json/evidence.json.

## Validation and evidence limits

Executed: `python3 docs/developer/final-acceptance/wave-04/06/capture.py`; `node --check docs/developer/final-acceptance/wave-04/06/zoom-probe.js`; `git apply --check docs/developer/final-acceptance/wave-04/06/documentation.patch`; JSON/assignment consistency checks in finalize.py. All pass. No build/install/package/browser/simulator run, Git mutation, main promotion or publication.

The63 extracted cases comprise9 action,18 routing,12 primitive (only3 are controlled tabs),9 overlay and15 selector cases (9 directly Menu/Popover/Tooltip). Counts are executions, not acceptance leaves. The source-equality97 includes implementation/styles/tests in named directories plus foundation/adapters; only that scope is claimed. HB20 changed shared Menu CSS and reran33 tabs plus rich-editor scopes. Earlier flat-selector/routing/overlay results remain dated; matching implementation and later bounded CSS regressions justify reuse, not a claim they were all rerun after HB20.

Do not infer speech from DOM/axe/hit testing. Dialog/AppModal retain the earlier explicit speech successor. No owner has disposed of M10 previous/next wording. U07 hierarchy implementation is now prepared under user steering; public integration and runtime/rendered checks remain required. U19 real browser zoom remains unexecuted.

## Later user-authorized implementation

HierarchicalMenu is now written directly in the exclusive new source/test/fixture paths. See [hierarchical-ready.md](hierarchical-ready.md) and [hierarchical-ready.json](hierarchical-ready.json) for the exact8 actual files and9 proposed shared integration files, hashes, static checks and coordinator commands. The earlier design-only U07 successor is superseded by **integrate and run**. No new runtime suite/build was launched. Original four complete/five partial recommendations and central counts remain unchanged pending validation.

Coordinator follow-up: the three baseline units now pass after preserving the
command collection across path changes. Initial failure and frame-only failed
retry are retained. No source assertion was weakened. Native/build remains
coordinator-owned. Apply hierarchical-native-manifest.patch for the new fixture.
