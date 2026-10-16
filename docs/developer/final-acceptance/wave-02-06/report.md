# Wave 02-06 — semantic design and CSS acceptance

Recommended outcome: **5 complete, 10 partial** across the 15 assigned obligations. No shared acceptance count or checkbox changed.

Reviewed modified `dev` checkout at `540f47d4059a9cea8890b80927f34f51ef2fbc3e`; capture timestamp `2026-10-16T22:43:03.113445+00:00`. Exact requirements, source/test references, hashes, performed checks and limits are in [results.json](results.json) and [evidence.json](evidence.json). These are acceptance obligations, not a request for 15 new unit tests.

## Evidence and new work

Reused FA-01–04 and parallel-06/08/10 reconciliation; did not repeat accepted inventories or passed suites. The source list for CSS and geometry review comes from FA-02, so no new repository inventory was generated. 167 selected inputs were initially hashed; targeted later reads and reference validation extend the receipt to 175 inputs. No input was missing. Token source/generator/tests, reviewed container/overlay/layout implementations and docs theme inputs match saved bytes. The shared acceptance checklist/ledger changed, as expected. TextArea.tsx and TextArea.module.css changed concurrently during coordinator BUG-0009 work; the new decorated multiline implementation is observed source only. No old build/guard/unit result is attributed to those changes. The three concurrently repaired picker implementations are outside this report’s behavioral claims.

The only new executable evidence is a bounded selected-input/source receipt and an in-memory PostCSS/CSS Modules nesting probe. The probe passed parent/child class-scoping assertions and preserves native & syntax; it wrote no shared output and ran on local Node 26.5.0. That is compiler behavior, not the required Node 22/24 production matrix or browser support. [styling-mappings.json](styling-mappings.json) supplies a newly reconciled five-field historical wrapper migration table. [successor-deliverables.md](successor-deliverables.md) supplies concrete emphasis guidance, scale decisions, state applicability matrix, containment map, RTL reproduction, nesting support/adoption requirements, fluid sizing assessment and publication/preference selections. Drafts are reviewable but not landed source changes.

FA-04’s original all-in-one command remained failed; only its corrected calendar rerun and unchanged passing cases were reconciled. Token/CSS tests and selected unchanged units retain their recorded aggregate local evidence. The passed package audit is evidence for its saved distributable, not current modified TextArea/pickers. Old container-query reports explicitly prepared native cases without executing them; inspecting their assertions does not upgrade them to passed geometry evidence. No current native/browser/OS/device/AT, remote CI, owner/legal sign-off or release result is claimed.

## Per-leaf results

### A-D-04 — complete

Original: Define semantic colors for surfaces, raised/overlay surfaces, text, borders, separators, primary/neutral/destructive actions, selected/hover/pressed states, validation, and focus.

Both light/dark maps define all requested surface, text, border/separator, primary/neutral/destructive, selected/hover/pressed, validation and focus roles. Shared role relationships are explicit aliases; component colors consume aliases. Definition obligation is met; custom-host visual contrast remains separate.

Source: `packages/ui/src/foundation/tokens.json`; `docs/developer/react-aria-theme.md`; `apps/docs/app/theming/page.tsx`.

Tests/evidence: `packages/ui/scripts/tokens.test.mjs`; `docs/developer/final-acceptance/parallel-08/report.md`; `docs/developer/final-acceptance/fa04-original-check.txt`.

Limit: Token role definitions and retained source validators; no all-state native/AT proof.

Successor W02-06-D04-DOC (adjacent, not required for this definition leaf): Correct stale card-frame prose saying success/warning tokens do not exist; both roles are present in tokens.json. Preserve translated status labels.

### A-D-05 — complete

Original: Define coordinated light/dark themes; validate readable states rather than mechanically inverting colors.

Light/dark maps explicitly select different palette values rather than invert colors. Matching retained token tests validate named text, muted/subtle, primary/neutral/destructive action state, validation, selection, border and raised/overlay focus pairs; docs graph verifies independent standard/increased maps. Readability validation covers declared pairs, not every composited/custom-host combination.

Source: `packages/ui/src/foundation/tokens.json`; `apps/docs/theme/theme-graph.ts`; `apps/docs/app/theming/page.tsx`.

Tests/evidence: `packages/ui/scripts/tokens.test.mjs:34`; `apps/docs/theme/theme-graph.test.mjs:77`; `docs/developer/final-acceptance/parallel-08/report.md`; `docs/developer/final-acceptance/fa04-retained-docs-build.txt`.

Limit: Named numeric opaque-color pairs only; alpha, arbitrary overrides and full native presentation remain independent.

Successor: none required for this source/definition/strategy leaf; separate native, component and production gates remain open.

### A-D-06 — partial

Original: Define a consistent spacing, sizing, radius, elevation, border, icon, and motion scale; reconcile the current differing button/card radii intentionally.

Spacing, density/target, radii, focus, overlay layer/shadow and typography scales exist. Button/Card currently share the control-radius role, fields are independently customizable. A complete named border/icon/motion scale and intentional former radius reconciliation are not fully documented; indicator animation durations are hardcoded 800ms and 1.2s apart from 120ms transition token.

Source: `packages/ui/src/foundation/tokens.json`; `packages/ui/src/components/Button/Button.module.css`; `packages/ui/src/experimental/Surface/Surface.module.css`; `packages/ui/src/experimental/Progress/Progress.module.css`; `packages/ui/src/experimental/icons/createVector.tsx`; `docs/developer/react-aria-theme.md`.

Tests/evidence: `packages/ui/scripts/tokens.test.mjs`; `docs/developer/final-acceptance/parallel-08/report.md`.

Limit: Source constants are review candidates, not proof of a visual bug; no retokenization executed.

Successor W02-06-D06 (required): Land/review the concrete scale decisions in successor-deliverables.md: border/stroke/icon/transition/indicator/easing roles or narrow documented exceptions, explicit shared Button/Card and separate field radius rationale; regenerate only if authored tokens change and validate affected inputs.

### A-D-13 — partial

Original: Define neutral split actions with shared border/divider and readable theme-aware primary text; define filled emphasis for contexts that genuinely need it.

SplitAction implements a neutral text primary action plus secondary menu trigger within joined ButtonGroup, with shared token border/divider and independent callbacks. Button neutral text is theme-aware and filled variant exists. Existing guidance names split neutrality but does not give explicit filled-emphasis context rules.

Source: `packages/ui/src/experimental/SplitAction/SplitAction.tsx`; `packages/ui/src/experimental/ButtonGroup/ButtonGroup.module.css`; `packages/ui/src/components/Button/Button.module.css`; `docs/developer/react-aria-layout-actions.md`; `apps/docs/content/component-usage/presentation.json`.

Tests/evidence: `packages/ui/src/experimental/SplitAction/SplitAction.test.tsx`; `docs/developer/final-acceptance/fa04-original-check.txt`.

Limit: Retained unit assertions establish callback/state attributes, not native border geometry. Draft guidance is not landed documentation.

Successor W02-06-D13 (required): Land the source-compatible two-sentence emphasis guidance draft in successor-deliverables.md in Button usage/action contracts; preserve neutral SplitAction and do not invent its variant prop. Verify docs links/catalog guidance.

### A-D-14 — complete

Original: Define primary/subpage surface hierarchy, card hierarchy, and overlay elevation through semantic tokens.

Primary AppPageHeader surface and subpage subtle surface are separate theme aliases. Surface/Card provide flat/outlined/raised variants and default/subtle tone; raised uses owned overlayShadow, dialogs use surfaceOverlay plus overlay layer/shadow and forced-color border fallback. Component aliases preserve semantic surface/divider/text dependencies.

Source: `packages/ui/src/components/AppPageHeader/AppPageHeader.module.css`; `packages/ui/src/experimental/Surface/Surface.module.css`; `packages/ui/src/experimental/Card/Card.tsx`; `packages/ui/src/experimental/Dialog/Dialog.module.css`; `packages/ui/src/foundation/tokens.json`; `docs/developer/react-aria-layout-actions.md`.

Tests/evidence: `packages/ui/src/components/ClassCardFrame/ClassCardFrame.test.tsx`; `packages/ui/tests/browser/foundation-catalogue.spec.ts:157`; `docs/developer/final-acceptance/parallel-08/report.md`.

Limit: Definition/token hierarchy closure only; browser fixture assertions are inspected, not newly run. Built-in raised/overlay colors may intentionally equal base surface while shadow/border communicates depth.

Successor: none required for this source/definition/strategy leaf; separate native, component and production gates remain open.

### A-D-15 — partial

Original: Design complete hover, focus, pressed, selected, disabled, read-only, invalid, pending, empty, loading, and error states; never rely on color alone for meaning.

Representative Button/field/menu/grid/collection states include non-color semantics: disabled interaction, named pending progress, aria-selected/checked or check glyphs, associated error text, read-only value and busy/empty/error content. No exhaustive applicability/design matrix across all public/compound components is established by available source and aggregate tests.

Source: `packages/ui/src/components/Button/Button.tsx`; `packages/ui/src/components/Button/Button.module.css`; `packages/ui/src/experimental/TextField/TextField.tsx`; `packages/ui/src/experimental/TextField/TextField.module.css`; `packages/ui/src/experimental/Menu/Menu.tsx`; `packages/ui/src/components/CardCollectionWithFooter/CardCollectionWithFooter.module.css`.

Tests/evidence: `packages/ui/src/components/Button/Button.public-contract.test.tsx`; `packages/ui/src/experimental/TextField/TextField.test.tsx`; `docs/developer/final-acceptance/fa04-original-check.txt`.

Limit: Broad all-states obligation is not closed from representative controls. Concurrent picker/TextArea fixes have no new behavior evidence in this report.

Successor W02-06-D15 (required): Complete/land the applicability matrix drafted in successor-deliverables.md, with all public parts and justified N/A states, concrete non-color indicator/source/example/test references; incorporate coordinator BUG-0008/0009 receipts. Preserve existing tests; add only genuine gap evidence.

### A-D-18 — partial

Original: Support reduced motion and forced-colors/high-contrast environments; avoid suppressing essential system indications.

Button/progress/navigation remove transitions/animation under reduced motion. Forced colors restore system focus/disabled/border/selected indicators; docs graph forces OS colors before identity/appearance/contrast. Explicit forced-color-adjust:none cases are system-painted progress/selected controls or color-data swatches, not a universal branding override. Current native/OS/AT coverage for full scope is missing.

Source: `packages/ui/src/components/Button/Button.module.css`; `packages/ui/src/experimental/Progress/Progress.module.css`; `packages/ui/src/components/SideNavigation/SideNavigation.module.css`; `packages/ui/src/components/TextColorPickerControl/TextColorPickerControl.module.css`; `packages/ui/src/experimental/ToggleButton/ToggleButton.module.css`; `apps/docs/theme/theme-graph.ts`.

Tests/evidence: `packages/ui/tests/browser/foundation-catalogue.spec.ts:221`; `packages/ui/tests/browser/display-preferences.spec.ts`; `apps/docs/theme/theme-graph.test.mjs:104`; `docs/developer/final-acceptance/parallel-10/report.md`.

Limit: No browser emulation, physical OS/device, screen reader or remote CI executed. Operator prerequisites remain external to this report.

Successor W02-06-D18 (required): Execute existing preference assertions against a coordinated candidate host for affected scopes and retain input/build/engine receipts; inspect color-swatch and system-color exceptions; obtain separate operator OS-high-contrast/AT evidence when claiming those environments. Existing dated native narratives cannot certify current changes.

### A-D-20 — partial

Original: Publish foundation stories for palettes, typography, spacing, density, surfaces, focus, and motion, all consuming production tokens.

Private docs-owned FoundationCatalogue preserves palette, spacing, density, surfaces, focus and motion scenarios with public production imports; Typefaces preserves typography. Public theming inspector covers palette/map/overrides and component pages show typography/surfaces. No public foundation spacing/focus/motion example publication equivalent is established.

Source: `apps/docs/native-fixtures/scenarios/foundation/FoundationCatalogue.fixture.tsx`; `apps/docs/native-fixtures/scenarios/components/Typefaces/Typefaces.fixture.tsx`; `docs/developer/docs-fixture-migration.md`; `apps/docs/app/theming/page.tsx`; `apps/docs/components/ThemePipelineExplorer.tsx`.

Tests/evidence: `packages/ui/tests/browser/foundation-catalogue.spec.ts`; `docs/developer/final-acceptance/fa04-fixtures.txt`.

Limit: A private fixture build is not publication or current native success. User-approved docs-host migration replaces original story runtime.

Successor W02-06-D20 (required): Publish missing source-backed spacing, focus traversal and motion/preference demonstrations in public docs using shared Example owners and production tokens; link existing palette/typography/density/surface examples. Preserve migrated private scenarios and historical evidence; do not restore Storybook.

### A-C-03 — complete

Original: Use CSS variables for themes and dynamic values, variant/state attributes for predictable states, and supported part hooks for customization.

Owned theme/density/interaction aliases are scoped CSS variables; component CSS state/variant selectors are predictable data attributes and native states; public data-sgui-part hooks/native class/style support documented customization. Dynamic overlay positioning uses scoped variables and native geometry style; native host layout/ref escape hatches are explicitly supported rather than reintroducing sx.

Source: `packages/ui/src/foundation/ThemeScope.tsx`; `packages/ui/src/components/Button/Button.tsx`; `packages/ui/src/components/Button/Button.module.css`; `packages/ui/src/components/ClassCardFrame/ClassCardFrame.tsx`; `packages/ui/src/experimental/Popover/Popover.tsx`; `docs/developer/react-aria-theme.md`; `docs/developer/react-aria-card-frames.md`.

Tests/evidence: `packages/ui/src/foundation/ThemeScope.test.tsx`; `packages/ui/src/components/ClassCardFrame/ClassCardFrame.test.tsx`; `docs/developer/final-acceptance/parallel-08/report.md`; `docs/developer/final-acceptance/fa04-package.txt`.

Limit: Mechanism/support-contract closure, not every prop/part or native-customization conformance. Changed TextArea markup/style is observed source only and excluded from retained compiled evidence.

Successor: none required for this source/definition/strategy leaf; separate native, component and production gates remain open.

### A-C-04 — partial

Original: Replace `sx`, `paperSx`, theme callbacks, object-style overrides, and retired DOM selectors with owned contracts and component styles; map each removed public styling prop.

Five explicit historical wrapper SxProps fields now have concrete owned mappings: AppDataGrid.sx; AppModal.paperSx; ClassCardFrame.headerSx/bodySx/footerSx. styling-mappings.json pairs each with documented native style/class/token/part contract. Generic primitive/theme callback/object/selector removal is documented and guarded. Exhaustive inherited upstream styling-field mapping is not yet proven.

Source: `docs/developer/migration-baseline/public-api.json`; `docs/developer/react-aria-card-frames.md`; `docs/developer/react-aria-modal-shells.md`; `docs/developer/react-aria-catalog-grid.md`; `docs/developer/react-aria-primitives.md`; `docs/developer/react-aria-theme.md`; `packages/ui/scripts/check-package.mjs`.

Tests/evidence: `packages/ui/src/components/ClassCardFrame/ClassCardFrame.test.tsx`; `packages/ui/src/components/AppModal/AppModal.test.tsx`; `docs/developer/final-acceptance/fa04-package.txt`; `styling-mappings.json`.

Limit: Saved baseline does not inline upstream Button/primitive declarations, so five explicit fields are not an exhaustive inherited prop census. No new package audit run.

Successor W02-06-C04 (required): Join styling-mappings.json to A-B-05 historical API delta; identify inherited upstream styling hooks, and explicitly map each former supported field to native style/parts/tokens or a documented breaking removal. Verify public types/consumer examples against current candidate, not stale built TextArea/pickers.

### A-C-08 — partial

Original: Use container size queries for reusable card, toolbar, navigation, and modal compositions; choose/document containment boundaries so consumers know what supplies the container.

Toolbar, AppShell navigation and portaled AppModal own named inline-size boundaries, documented host allocation/intrinsic-size consequences and descendant queries. Card collection uses fluid Grid/minmax; Card/ClassCardFrame have no card size-query boundary. Prepared old native cases are not passed evidence.

Source: `packages/ui/src/components/DataToolbar/DataToolbar.module.css`; `packages/ui/src/components/AppShell/AppShell.module.css`; `packages/ui/src/components/AppModal/AppModal.module.css`; `packages/ui/src/components/CardCollectionWithFooter/CardCollectionWithFooter.module.css`; `docs/developer/react-aria-data-toolbar.md`; `docs/developer/react-aria-navigation-container.md`; `docs/developer/react-aria-modal-container.md`.

Tests/evidence: `packages/ui/tests/browser/toolbar-container-boundary.spec.ts`; `packages/ui/tests/browser/navigation-shell-container-boundary.spec.ts`; `packages/ui/tests/browser/modal-container-boundary.spec.ts`; `docs/developer/parallel-batch-165/toolbar-container-boundary.md`; `docs/developer/parallel-batch-167/navigation-shell-container-boundary.md`; `docs/developer/parallel-batch-168/modal-container-boundary.md`.

Limit: Host allocation documentation is source evidence; CSS query syntax and jsdom tests do not certify native independent-container geometry.

Successor W02-06-C08 (required): Use the report-owned containment table to implement/document a meaningful card query boundary or explicitly accept fluid-grid alternative to original requirement; execute prepared affected specs in current docs fixture host and retain exact geometry/focus/scroll receipts.

### A-C-09 — partial

Original: Use logical properties and direction-aware icons/placement for RTL; do not assume physical left/right always means start/end.

Most inspected layouts use inline/block/start/end and native Provider/portal dir; directional SVGs default to mirrorInRtl and :dir(rtl), calendar keyboard offsets use interaction direction. SideNavigation forward/back animation has physical +1/-1rem X signs independent of RTL. Broad editor/portal RTL acceptance remains open.

Source: `packages/ui/src/foundation/ThemeScope.tsx`; `packages/ui/src/experimental/icons/createVector.tsx`; `packages/ui/src/experimental/icons/icons.module.css`; `packages/ui/src/components/SideNavigation/SideNavigation.module.css`; `packages/ui/src/experimental/DateRangeSelector/DateRangeSelector.tsx`.

Tests/evidence: `packages/ui/src/components/SideNavigation/SideNavigation.test.tsx`; `packages/ui/tests/browser/navigation-shell-container-boundary.spec.ts`; `docs/developer/final-acceptance/parallel-10/report.md`.

Limit: Same animation sign is a demonstrated source omission, not native usability failure. Visual-dir/interaction-locale mismatch is documented host policy; no physical left/right blanket replacement.

Successor W02-06-C09 (required): Review/mirror SideNavigation drill-motion direction with bounded reproduction in successor-deliverables.md; retain reduced-motion and Back focus; finish existing editor V RTL leaves and candidate portal/arrow/placement checks. Preserve physical coordinate math used for viewport hit tests.

### A-C-10 — complete

Original: Prefer Grid/Flexbox over JavaScript layout measurement; reserve observers/measurement for demonstrated interaction or virtualization needs and clean them up.

Ordinary card/header/toolbar/shell layout is CSS Grid/Flex and container queries. Reused FA-02 candidate list localizes JS geometry to grid numeric resizing/status/focus, overlay collision, tab overflow/scroll, drag hit testing, and focused-control reveal. Owned observers/listeners/recurring frames disconnect or cancel; guarded one-shot focus/recovery work is deliberately scheduled after native layout/unmount.

Source: `packages/ui/src/components/AppDataGrid/ownedGridInteraction.tsx`; `packages/ui/src/components/AppDataGridShell/AppDataGridShell.tsx`; `packages/ui/src/components/AppShell/AppShellMain.tsx`; `packages/ui/src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.tsx`; `packages/ui/src/experimental/Popover/Popover.tsx`; `packages/ui/src/experimental/Select/FramePositionedPopover.tsx`; `packages/ui/src/experimental/Tabs/useTabOverflow.ts`; `packages/ui/src/components/SideNavigation/SideNavigation.tsx`; `packages/ui/src/components/AuthShell/revealFocusedControl.ts`; `packages/ui/src/experimental/Dialog/Dialog.tsx`.

Tests/evidence: `docs/developer/final-acceptance/2026-10-16-source-inventory.json`; `docs/developer/final-acceptance/fa04-original-check.txt`; `docs/developer/react-aria-grid-contracts.md`; `docs/developer/react-aria-editor-layout.md`.

Limit: Implementation-strategy/lifecycle closure only. Candidate inventory is reused, not full new runtime effect audit; no native measurement accuracy, performance or resource-leak run claimed. Intentional post-unmount dialog focus repair cannot be canceled indiscriminately.

Successor: none required for this source/definition/strategy leaf; separate native, component and production gates remain open.

### A-C-11 — partial

Original: Use native nesting with documented tooling/browser support; keep selector depth shallow and component ownership obvious.

Production CSS Modules reviewed from saved file list use flat selectors; no native nested rules found. New in-memory installed pipeline probe confirms PostCSS/CSS Modules scope classes while preserving &, with no nesting transpiler. Minimum browser support and actual adoption/persistent fixture policy remain undefined.

Source: `packages/ui/scripts/css-modules.mjs`; `packages/ui/scripts/css-modules.test.mjs`; `packages/ui/scripts/check-component-css.mjs`; `docs/developer/react-aria-css-lint.md`.

Tests/evidence: `nesting-probe.cjs`; `nesting-probe.json`; `docs/developer/final-acceptance/parallel-08/report.md`.

Limit: Synthetic Node 26.5 probe proves compiler behavior only; no actual browser support, production Node matrix or nesting adoption proved.

Successor W02-06-C11 (required): Land one shallow production native-nesting case and persistent owned pipeline/guard fixture; document no-transpilation tooling and owner-selected engine/version support boundary; validate output/specificity/ownership and chosen engine boundary. No need to recapture token inventory.

### A-C-12 — partial

Original: Use fluid sizing such as `clamp` where beneficial without preventing text zoom; establish mobile/reflow fallbacks.

Fluid Grid/Flex min/max/percentage/rem caps and shrink/wrap/scroll fallbacks exist for card, modal, header and navigation. No CSS clamp() appears, which alone is not a defect. Report-owned assessment now names where fluid sizing benefits layout and preserves rem typography; candidate native and actual browser zoom evidence remains incomplete.

Source: `packages/ui/src/components/CardCollectionWithFooter/CardCollectionWithFooter.module.css`; `packages/ui/src/experimental/Dialog/Dialog.module.css`; `packages/ui/src/components/AppPageHeader/AppPageHeader.module.css`; `packages/ui/src/components/SideNavigation/SideNavigation.module.css`; `packages/ui/src/foundation/tokens.json`; `docs/developer/parallel-batch-104/acceptance-evidence.md`.

Tests/evidence: `packages/ui/tests/browser/foundation-catalogue.spec.ts:126`; `packages/ui/tests/browser/modal-container-boundary.spec.ts`; `packages/ui/tests/browser/navigation-shell-container-boundary.spec.ts`.

Limit: Historical batch104 Chromium shards and root-size scaling do not establish current-head browser-chrome zoom or physical mobile support; no rerun here.

Successor W02-06-C12 (required): Land/review fluid-sizing benefit assessment in successor-deliverables.md and execute existing affected reflow/root-text-scale cases on candidate host; obtain separately authorized operator actual 200% zoom/320px reflow receipt where required. Keep calendar internal-scroll and whole-dialog fallbacks; do not add viewport-only font clamp.

## Authority and remaining work

Only this wave-owned directory was written. No installs, dependency changes, shared rebuilds, heavy/browser/consumer suites, server operations, staging, commits, worktrees, pushes or release actions occurred. No new conversations/subagents were created or messaged. Complete recommendations are bounded to definition/mechanism/strategy requirements; they do not close all visual component states or the 20 editor V leaves. Partial recommendations must remain open until the specific successor deliverables are landed and their necessary evidence exists. The coordinator owns shared reconciliation and any future serialized native validation.
