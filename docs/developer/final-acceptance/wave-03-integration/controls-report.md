# Controls source integration

Reviewed and applied all compatible assigned source/script hunks, preserving the existing dirty `dev` checkout. No staging, commits, branch operations or pushes. `controls.json` records exact original patch hashes, integrated paths and current source hashes. Only `packages/ui/src` and assigned `packages/ui/scripts` were integrated, plus these evidence records; docs/app/browser/performance patch portions remain with the coordinator. Editor-owned source was untouched.

Applied fixes and regression coverage:

- 02: extract date/time/navigation type leaves and preserve public reexports; maintained resolved source graph forbids internal root imports and runtime/type-involving cycles, with mutation regressions invoked by foundations.
- 03: five focused public composition/state/naming/ref tests.
- 04: parameterless owned ToggleButton and grid drag-handle notifications; operation-specific SideNavigation diagnostics/error/stale-owner tests.
- 05: individual icon imports in five compositions; source boundary guard and packed-consumer import auditor.
- 08: neutral filled Button pressed background.
- 09: ClassCardFrame named inline-size container and narrow allocated-card padding.
- 10: TagGroup minimum target width; private shared exact-width/one-pixel width popover for both grid renderers, preserving complete host snapshots, bounds, rejecting-host control and flexible fill. Four focused tests now execute successfully.
- 13: preserve input focus fallback without `:has`, visible grid final-card fallback focus, justified Popover position/height important declarations with ordinary width rules, vh fallbacks for Dialog/Popover.
- 17: RTL drill animation directions, retaining reduced-motion suppression.
- 18: shared textarea form reset coordination, canceled validation preservation, external form reassociation, RadioGroup reset control; focused regressions.
- 21: grid reorder-policy regression coverage.
- 22: remove duplicate interpolation from translated InstructorClassCard labels; literal braces/dollars retained by tests.
- 28: datetime overnight, reversed-end and inclusive-boundary tests.
- 31: idempotent scrollbar release preserves siblings/later generations; repeated disposal/timer tests.

All patches applied sequentially without rejects, including shared DataGridDragHandle icon/notification and owned-grid icon/width hunks. Reviewed resulting source and preservation of earlier TextArea icons and DateField availability behavior. No speculative API or dependency change was introduced.

The optional native nesting proposal from 13 is deliberately deferred: it changes only spelling of the same selector while minimum-version policy is unresolved. The existing flat selector is sufficient; a test requiring nesting would assert implementation style rather than needed behavior. The editor observer regression from 31 belongs to the editor owner.

## Integrated checks

Node 24.21.0 with the existing validation lease, no shared build:

- `controls-units.log`: **77 passed / 15 files**, zero failures. New focused tests plus existing navigation/date/time suites. Duration 2.54s.
- `controls-graph-tests.log`: aggregate source graph real-source mutations and enforcement regression passes (3.55s).
- `controls-icon-boundary.log`: source icon guard passes, 429 modules scanned. This read-only AST check needs no server/build.

The leases released normally. All targeted assertions executed; prior handoff attempts that never collected assertions are superseded only for these exact integrated suites. No claim of native pointer geometry, real touch/autofill/AT, CSP deployment, performance budget or whole-library acceptance follows from jsdom/AST results.

Coordinator must run the fresh library/type/package/foundation check and regenerate docs composition metadata for the private grid helper, then execute bounded native checks from delivered fixtures/specs. Broader acceptance leaves remain open where their stated successors require external observations or unexecuted matrices.

## Supplemental coordinator assignments

Applied source-only 11/scoped-lifecycle.patch (Provider composed SSR, live nested portal update, StrictMode scope cleanup tests) and 27/clipboard-contracts.patch (DateEntryClipboard synthetic transaction/native form tests). No production ThemeScope change was proposed. `controls-lifecycle-clipboard.log`: **7 passed / 4 files**, zero failures (1.36s), Node24 and normal lease cleanup. Total controls checks: **84 passed /19 unit files**, plus graph mutation and icon guards. Synthetic clipboard does not establish trusted OS clipboard behavior.

## Full-checkpoint assertion correction

The coordinator's full checkpoint retained one failure at ownedGridInteraction.test.tsx:69: exact header text changed from Name/Actions to Name↔/Actions↔ because of the new width action. Updated the exact ordered expectation, retained native refs/locked visibility/order checks, and added scoped width-button names for both locked columns plus absence for hidden Score. This corrects an expected changed UI contract, without reducing assertions or changing runtime behavior. `units-checkpoint.log` preserves the failure; `controls-grid-stale-assertion.log` passes **23/23** affected tests on Node24. The full suite was not repeated.

## Native width-trigger focus defect

Fresh Chromium width actions exposed a real focus-return defect in both grids: after the successful step request and popup close, focus returned to the same header's Sort action instead of Width. Diagnostic native rerun retained exact active-element attachments in `controls-width-native-diagnostic.json`; original failures and traces stay separate. Added focused assertions to both caller tests, reproducing both failures in `controls-width-focus-units.log`. Focusing the trigger only on opening did not resolve restoration and was replaced. The private width control now repairs focus in an owned, cancelable post-close animation frame only when the still-connected enabled trigger's focus is stranded on body or the same header. Unrelated host focus is preserved. The existing native exact one-pixel/no-drag and focus assertions remain intact; added only diagnostic attachment. `controls-width-focus-units-corrected.log`: **4/4 passed, 2 files**, Node24. Fresh build and native rerun remain coordinator work.

## CSS width-box correction and primitive drivers

The second native run confirms both width controls restore focus; generic DataGrid then reveals a separate real box-model defect: using a 524px padded bounding rectangle as CSS width and requesting523 produced539px on reopen (16pxpadding reapplied). Width entry now reads the computed CSS width, preserving content-box/border-box semantics. Focused regression supplies a196pxborder rectangle with180pxCSSwidth/padding, asserts entry180 and exact request179. `controls-width-css-box-units.log`: **5/5 passed,2files**, Node24. Native width assertion remains unchanged, awaiting fresh build/rerun.

Primitive first-run failures are driver defects: Playwright check/uncheck hit visually hidden native inputs covered by their indicator; use visible label clicks and exact checked-state assertions for Cancel reset, Live radio, Cancel radio reset and Accept tab requests. Tab requests substring also matched Accept tab requests checkbox; use exact status role/name for output. All original form/reset/host/selection/focus assertions remain. No PrimitiveAcceptance fixture or production form change was needed. Rerun this test-only correction against frozen host.

## Native selected-row disappearance driver

The original test focused row7/status, then manually scrolled it offscreen to150/120. Native successor focus correctly revealed itself to488/160, conflicting with that artificial baseline. The corrected driver scrolls/focuses the selected cell visibly, waits six stable rendered frames, asserts full pane containment and both nonzero scroll axes, then retains **exact** scroll coordinates and full successor focus visibility after deletion. Its first focused rerun passed those checks, exposing another precondition defect: programmatic sibling checkbox focus plus Space had selected Course1 through grid entry focus, not the asserted Course2. The driver now clicks the visible Course2 native label and verifies its checked state before testing preservation. Native Tab entry remains covered by its independent test. No production/fixture change was needed. `controls-grid-visible-removal.log` retains the intermediate failure; `controls-grid-visible-removal-corrected.log` passes the exact scroll/focus/field/sibling selection checks in Chromium (693ms).

## Optimistic grid host fixture registration

The final native run's optimistic host timeout was not an executed host-operation failure: the host rendered `Unknown native fixture: data-display-appdatagridshell-host-operations--optimistic-actions`. The standalone GridHostOperations fixture existed but was absent from the migration manifest, which is the registry generator's module-discovery source. Coordinator added its manifest registration; regeneration/build must occur after the active frozen-host suite ends. Reviewed fixture/controller and driver sequencing (failure rollback, retry acceptance, canceled late settlement, rename rollback/retry); no speculative implementation or test weakening was needed. No host-operation runtime pass is claimed before the registered fixture executes.

## Firefox native collection entry

Firefox's first Tab entered the native overflowing scroll DIV, not its owned table, while Chromium entered the collection. The exact diagnostic active-element HTML and explicit zero-tab targets are preserved in `controls-firefox-tab-diagnostic.json`; the unchanged driver still failed. This was a real extra implicit scroll-pane Tab stop, not a mismatch in remembered payloads. Set owned ResizableTableContainer `tabIndex={-1}` so the native table remains the collection's one entry while the scroll pane retains programmatic focus/ref semantics. Added explicit container=-1/table=0 assertions to the existing native refs/locks/order unit. `controls-firefox-scroll-entry-units.log`: **23/23 passed**, Node24. Native Tab assertions remain unchanged (diagnostic attachment added), with no programmatic collection focus. Fresh package/native build and engine rerun remain coordinator work.
