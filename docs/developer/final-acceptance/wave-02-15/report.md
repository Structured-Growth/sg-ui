# Wave 02-15 — 23 acceptance obligations

**2 complete, 21 partial, 0 blocked.** A-A-19 and A-D-01 are complete for their documentation/schema obligations after concurrent fixes were independently read and reconciled. All other full leaves retain the explicit remaining work below. These are coordinator reconciliation recommendations, not shared checklist edits.

Base: modified dev `540f47d4059a9cea8890b80927f34f51ef2fbc3e`. Only this wave directory was authored. Every original leaf was read from the hardening task list; historical checks were not inherited as completion. The prior 15 reports, shared reconciliation and FA-01–04 remain the evidence base.

## New reviewable work

- `public-contract-index.json`: all 469 saved resolved contracts/alias routes projected by state, visual, naming and composition concerns; exact declaration references and changed-source flags. No rebuilt-output claim.
- `defaults-and-state.md`: 34 family rows plus candidate-kind classification and local historical default/schema reconciliation.
- `contracts.typecheck.tsx`, `typecheck.cjs`, `typecheck.json`: seven accepted audit assignments and eleven exact rejected contracts; latest source compile has one Calendar TS2322 diagnostic, preserved rather than treated green. Removing expectation directives yields eleven actual source type errors, retained in JSON.
- `source-cycle-extraction.patch`, `cycle-proposal.json`: exact unapplied three-SCC contract extraction, initial application check passed; a late DateField edit makes the final check fail context at line 13. Public type reexports are preserved in the proposal; regenerate from stable source before integration. The maintained SCC/root guard remains required.
- `local-extraction-reference.json`: six exact local initial-extraction Git files, preserving hooks/presets/ImageNode/editor registration. No other checkout was read.
- `documentation-payload.md` and `native-protocols.md`: concrete remaining token/CSS/direction/error-policy wording and bounded validation procedures. Sections superseded by concurrent fixes are explicitly marked; do not redo their edits.

## Evidence and concurrency limits

Input receipt reuses saved paths rather than rescanning exports/source graphs. It records BUG-0008/0009 implementations plus later concurrent Calendar/DateField/DatePicker changes, and changed tests/CSS/metadata/guidance. Each delta is explicit; assumptions that only four files would change were revoked. Current declaration output is not asserted equivalent to these fixes. The coordinator reports 19 picker and 12 TextArea unit passes and a preliminary four-new/eight-existing Chromium pass; final TextArea CSS rebuild/recheck remains coordinator-owned. This wave executed no runtime/native/consumer suite.

Concurrent fix-02 resolved action callback prose; fix-04 corrected dependency placement/upgrade commands; fix-06 resolved Brush metadata and parity; fix-07 documented readonly trigger/form exceptions. fix-05 repairs all 36 manifest mismatches and proves local Button assertion continuity while qualifying original-platform story lineage. fix-01 completes maintained token schema; fix-03 completes stylesheet composition prose but leaves the Popover necessity decision open. Their exact reports/receipts are reused when available. This wave abandoned obsolete manifest/icon/dependency patches rather than overwriting them.

New source-only TypeScript check uses installed TypeScript and React declarations, strict/noEmit and skipLibCheck. Node26.5.0 does not add supported Node22/24 CI proof. Initial harness module-resolution errors were corrected; an earlier source-bound pass preceded concurrent Calendar changes. The final program reports TS2322 at Calendar.tsx:88, DateValue versus CalendarDate. Eleven expected audit rejections remain intact and no audit-file positive assignment fails; the whole compile is failed, not green. findings.json supplies exact hash and successor. History is retained. A preparer assertion encountered the concurrently fixed Brush entry and was updated; this was draft-tool state, not a component test failure. No broad test/build/browser/install, Git mutation, original-platform checkout, remote CI query or legal approval occurred. FA-04 original failure remains a failure with separately reconciled affected rerun; device/AT/first-paint/native claims remain separate. The 20 editor V leaves and production gates are unchanged.

## Per-leaf reconciliation

### A-B-05 — partial

- [ ] A-B-05 Reconcile original `B-05`: Snapshot public props, callbacks, models, defaults, subpaths, and deprecations; identify changes that are actually breaking. Historical status: open.

Progress: Indexed all 469 saved resolved contracts and every saved alias/subpath, separating state/visual/naming/composition properties; exact signatures remain in the reused snapshot. Classified saved 678 candidates into 213 destructuring defaults, 31 parameter defaults, 434 fallback expressions. Added family default/state ledger and six exact local initial-extraction references for hooks/presets/editor schema. Four production TS sources changed since saved declaration snapshot; no fresh artifact compatibility is asserted. Final source-backed compile has a separate current Calendar.tsx:88 TS2322 (DateValue is not CalendarDate); eleven expected audit rejections remain valid but overall compile fails. See findings.json; no shared repair attempted.

Checks: Reused snapshot routes/contracts; no export rescan; Saved-candidate classification; Six read-only local git show captures; Scoped input hash reconciliation.

Sources: `packages/ui/src/index.ts`, `packages/ui/src/hooks/usePersistentState.ts`, `packages/ui/src/components/PageRichTextEditorSection/lexical/ImageNode.tsx`.

Tests/evidence: `packages/ui/src/hooks/usePersistentState.behavior.test.tsx`, `packages/ui/src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.test.ts`, `public-contract-index.json`, `defaults-and-state.md`, `local-extraction-reference.json`, `docs/developer/final-acceptance/parallel-01/api-snapshot.json`, `findings.json`.

Remaining deliverables:
- Normalize remaining per-symbol indirect context/CSS/composed defaults; explicitly classify private and non-applicable candidates.
- Resolve inherited original APIs at initial locked dependency versions; classify complete breaking/removal/additive/preserved contract deltas, link migrations and release-marker decisions.
- Calendar source owner resolves W02-15-F1 date-prop typing and retains a targeted current-input type receipt; do not treat the final wave compiler invocation as passing.

### A-A-03 — partial

- [ ] A-A-03 Reconcile original `A-03`: Define one-way dependency boundaries; prevent root-barrel imports from internal implementations and prevent circular imports. Historical status: open.

Progress: Retained graph identifies three type-only return-edge SCCs and no observed runtime SCC. Prepared exact unapplied extraction patch: SGNavigationAdapter/SGLinkProps, DateFieldProps and TimeFieldProps move into independent contract leaves and keep existing public type reexports. An initial patch application check passed; latest DateField context changed and final patch check fails at line 13. No mutation occurred.

Checks: Reused saved graph/SCCs; Exact source contract extraction patch generation; git apply --check only; patch not applied or behavior-tested.

Sources: `packages/ui/src/adapters/navigation.tsx`, `packages/ui/src/adapters/navigationContext.ts`, `packages/ui/src/experimental/DateField/DateField.tsx`, `packages/ui/src/experimental/TimeField/TimeField.tsx`, `packages/ui/scripts/check-foundations.mjs`.

Tests/evidence: `packages/ui/src/adapters/navigation.test.tsx`, `packages/ui/src/experimental/DateField/DateField.test.tsx`, `packages/ui/src/experimental/TimeField/TimeField.test.tsx`, `source-cycle-extraction.patch`, `cycle-proposal.json`, `docs/developer/final-acceptance/parallel-02/graph-evidence.json`.

Remaining deliverables:
- Integrate source-cycle-extraction.patch after reviewing current context; run affected existing type/component checks.
- Implement maintained TypeScript-resolved internal-root-barrel/SCC guard covering every production module and import kind; negative fixtures must include deep/renamed root, import-type/dynamic/side-effect edges, two/three-node cycles and permitted acyclic reexports.
- Either eliminate type-only cycles as proposed or record explicit approved policy; no implicit waiver.

### A-A-06 — partial

- [ ] A-A-06 Reconcile original `A-06`: Standardize controlled/uncontrolled pairs, defaults, change callbacks, null/empty semantics, disabled/read-only/loading behavior, and stable IDs. Historical status: open.

Progress: Expanded state/default index through every saved contract plus explicit grid/shell/card/editor/host ownership family ledger. BUG-0008 current source guards Clear/commit under disabled/readOnly; coordinator reports 19 picker cases including twelve new parameter cases. This is coordinator-reported runtime evidence pending its exact receipt, not a test run here. fix-07 resolves readonly-focus prose successor P04-S2, preserving form values and component exceptions. Final source-backed compile has a separate current Calendar.tsx:88 TS2322 (DateValue is not CalendarDate); eleven expected audit rejections remain valid but overall compile fails. See findings.json; no shared repair attempted.

Checks: Inspected changed guards/tests; Read coordinator runtime report with its limits; Reconciled fix-07 documentation evidence; no repeated suite.

Sources: `packages/ui/src/experimental/PeriodPicker/PeriodPicker.tsx`, `packages/ui/src/experimental/DateTimeRangePicker/DateTimeRangePicker.tsx`, `packages/ui/src/experimental/DateRangeComparisonPicker/DateRangeComparisonPicker.tsx`, `docs/developer/react-aria-adoption-checklist.md`.

Tests/evidence: `packages/ui/src/experimental/PeriodPicker/PeriodPicker.test.tsx`, `packages/ui/src/experimental/DateTimeRangePicker/DateTimeRangePicker.test.tsx`, `packages/ui/src/experimental/DateRangeComparisonPicker/DateRangeComparisonPicker.test.tsx`, `defaults-and-state.md`, `public-contract-index.json`, `docs/developer/final-acceptance/fix-07/report.md`, `findings.json`.

Remaining deliverables:
- Reconcile coordinator BUG-0008 runtime/native receipts against final source/output hashes.
- Complete all-public-control null/default/reset/ID/hydration matrix and control-mode-stability exceptions, including grid/editor transitions; type projection/useId alone cannot settle runtime behavior.
- Calendar source owner resolves W02-15-F1 date-prop typing and retains a targeted current-input type receipt; do not treat the final wave compiler invocation as passing.

### A-A-07 — partial

- [ ] A-A-07 Reconcile original `A-07`: Specify native click versus normalized press semantics without surprising consumers; prevent duplicate callback invocation and document keyboard/touch activation. Historical status: open.

Progress: fix-02 completed stale ContentEditorChrome anchor and ToggleButton dual-notification guidance. Current docs now match implementation; no duplicate repair authored here. New negative type case rejects Button onClick while onPress is accepted. Retained programmatic/old two-engine receipts remain dated.

Checks: Current guidance/source review; Source type assertion for owned activation; Reused existing receipts only.

Sources: `packages/ui/src/components/Button/Button.tsx`, `packages/ui/src/components/ContentEditorChrome/ContentEditorChrome.tsx`, `docs/developer/react-aria-button.md`.

Tests/evidence: `packages/ui/src/components/Button/Button.test.tsx`, `contracts.typecheck.tsx`, `typecheck.json`, `docs/developer/final-acceptance/fix-02/report.md`, `native-protocols.md`.

Remaining deliverables:
- Finish composed/public event-surface reconciliation and scoped current docs-host pointer/keyboard/native form ordering evidence described in native-protocols.md.
- Retain separate physical-touch and AT evidence; do not translate jsdom or old host execution into these results.

### A-A-08 — partial

- [ ] A-A-08 Reconcile original `A-08`: Define public variant, size, tone, density, placement, dismissal-reason, and validation contracts independently of any foundation. Historical status: open.

Progress: Produced all-469-contract visual/placement/dismissal/validation projection with exact declaration references and source-change flags. Negative type checks reject legacy contained Button variant and backdropClick Dialog reason; explicit owned examples remain accepted. Final source-backed compile has a separate current Calendar.tsx:88 TS2322 (DateValue is not CalendarDate); eleven expected audit rejections remain valid but overall compile fails. See findings.json; no shared repair attempted.

Checks: Saved declaration projection; New source-backed enum/reason type assertions.

Sources: `packages/ui/src/components/Button/Button.tsx`, `packages/ui/src/experimental/Dialog/Dialog.tsx`, `packages/ui/src/experimental/DateField/DateField.tsx`.

Tests/evidence: `contracts.typecheck.tsx`, `packages/ui/src/experimental/Dialog/Dialog.test.tsx`, `public-contract-index.json`, `typecheck.json`, `defaults-and-state.md`, `findings.json`.

Remaining deliverables:
- Complete semantic feedback-timing/host-invalid/commit precedence reconciliation across composed and segmented fields; projection is not behavior evidence.
- Review every alias/compound contract and indirect inherited definitions before declaring exhaustive public policy.
- Calendar source owner resolves W02-15-F1 date-prop typing and retains a targeted current-input type receipt; do not treat the final wave compiler invocation as passing.

### A-A-09 — partial

- [ ] A-A-09 Reconcile original `A-09`: Define accessible naming and description requirements for icon-only and compound controls; choose typed requirements where practical. Historical status: open.

Progress: Completed requested bounded source type assertions: unnamed IconButton/TextField/TextArea/Select/Menu/Calendar rejected; labelled field alternatives and generic Button/Dialog exceptions accepted. All saved public symbols now have a naming/description property index; it distinguishes absent captured owned props from inherited/native contracts. Final source-backed compile has a separate current Calendar.tsx:88 TS2322 (DateValue is not CalendarDate); eleven expected audit rejections remain valid but overall compile fails. See findings.json; no shared repair attempted.

Checks: Seven valid audit assignments and eleven rejected cases; latest source program has one separate production Calendar diagnostic; Stripped-directive pass confirms actual expected diagnostics.

Sources: `packages/ui/src/experimental/IconButton/IconButton.tsx`, `packages/ui/src/experimental/TextField/TextField.tsx`, `packages/ui/src/experimental/TextArea/TextArea.tsx`, `packages/ui/src/experimental/Menu/Menu.tsx`.

Tests/evidence: `contracts.typecheck.tsx`, `packages/ui/src/experimental/IconButton/IconButton.test.tsx`, `typecheck.json`, `public-contract-index.json`, `findings.json`.

Remaining deliverables:
- Finish compound/repeated row-action/editor/navigation-rail naming ownership, callback content and required descriptions against current public APIs.
- Maintain runtime nonempty contextual label and host ID requirements; type checks do not prove computed/spoken names.
- Calendar source owner resolves W02-15-F1 date-prop typing and retains a targeted current-input type receipt; do not treat the final wave compiler invocation as passing.

### A-A-10 — partial

- [ ] A-A-10 Reconcile original `A-10`: Define composition and escape hatches: supported slots/parts, render callbacks, refs, `className`/part classes, CSS variables, and native `style` where needed. Historical status: open.

Progress: Added all saved contract composition/ref/class/style/render property projection and negative assertions for intentional unsupported Select/Calendar root style. Coordinator implemented TextArea decorative slots and reports twelve passing unit cases. Current source renders hidden logical start/end frames; subsequent CSS alignment correction remains under coordinator rebuild/recheck. Final source-backed compile has a separate current Calendar.tsx:88 TS2322 (DateValue is not CalendarDate); eleven expected audit rejections remain valid but overall compile fails. See findings.json; no shared repair attempted.

Checks: Source prop-hatch type assertions; Inspected new TextArea slots and focused test source; Coordinator-reported runtime result retained separately.

Sources: `packages/ui/src/experimental/TextArea/TextArea.tsx`, `packages/ui/src/experimental/TextArea/TextArea.module.css`, `packages/ui/src/experimental/Calendar/Calendar.tsx`.

Tests/evidence: `contracts.typecheck.tsx`, `packages/ui/src/experimental/TextArea/TextArea.test.tsx`, `public-contract-index.json`, `typecheck.json`, `defaults-and-state.md`, `findings.json`.

Remaining deliverables:
- Reconcile BUG-0009 final implementation/CSS/render receipt, regenerated declarations/docs and source-copy evidence at final tested hashes.
- Finish alias/compound native ref/part/style/render callback ownership inventory; index does not resolve arbitrary callback content or private DOM stability.
- Calendar source owner resolves W02-15-F1 date-prop typing and retains a targeted current-input type receipt; do not treat the final wave compiler invocation as passing.

### A-A-19 — complete

- [ ] A-A-19 Reconcile original `A-19`: Document package dependency placement, supported versions, upgrade policy, and deduplication requirements for React Aria and date utilities. Historical status: checked.

Progress: Current dependency guide now has correct library/root/docs placement, exact interaction/date family, peer ranges and compatible resolution/deduplication policy. Current operational guidance uses dev, docs-owned static host, correct cwd/root forwarding/build commands and full-production gates; old Storybook/codex-dev workflow gap is resolved by separate fix-04. Physical singleton proof, security status and human maintenance/support owner decisions remain explicitly outside this documentation obligation.

Checks: Reviewed current complete guide placement/support/upgrade/dedup sections; Reused fix-04 bounded validation; no upgrade or fresh install.

Sources: `docs/developer/react-aria-dependency-upgrades.md`, `packages/ui/package.json`, `package.json`, `pnpm-lock.yaml`.

Tests/evidence: `packages/ui/scripts/test-foundation-consumer.mjs`, `docs/developer/final-acceptance/fix-04/validation.json`, `concurrent-documentation.json`, `input-receipt.json`, `docs/developer/final-acceptance/fix-04/report.md`.

No successor required for the named documentation leaf. Dependency security/governance and runtime execution remain separately scoped.

### A-D-01 — complete

- [ ] A-D-01 Reconcile original `D-01`: Create one reviewable token source using a documented schema compatible with the Design Tokens Community Group format where appropriate. Historical status: checked.

Progress: Concurrent fix-01 now supplies the maintained complete nine-group/value/tier/naming/parity/emission schema and replaces stale adoption/density prose. Reviewed current source guide against compiler; it explicitly compares DTCG 2025.10, documents adapted/unsupported representations and makes no interchange conformance promise. Reused fix-01 doc-validation: nine groups, 42 semantic roles, 34 selected component aliases, local links and interaction defaults. Token suite not rerun.

Checks: Read final maintained guide and current compiler; Reused fix-01 documented-schema validation; no independent external-standard certification.

Sources: `packages/ui/scripts/tokens.mjs`, `packages/ui/src/foundation/tokens.json`, `docs/developer/react-aria-token-roles.md`.

Tests/evidence: `packages/ui/scripts/tokens.test.mjs`, `docs/developer/final-acceptance/fix-01/report.md`, `docs/developer/final-acceptance/fix-01/doc-validation.json`, `input-receipt.json`.

No successor required for the named documentation leaf. Dependency security/governance and runtime execution remain separately scoped.

### A-D-09 — partial

- [ ] A-D-09 Reconcile original `D-09`: Use rem-based text sizing and layouts that tolerate zoom, text spacing changes, long labels, and font substitution. Historical status: open.

Progress: Converted prior zoom/font/evidence successor into concrete host inputs, exact spacing values, font substitutions, zoom/viewport and capture protocol. Existing HB-16 raw manifest/captures remain unavailable in this assignment; no source inspection was promoted into native layout conformance.

Checks: Reused prior source/evidence review; Prepared bounded missing-input protocol; no zoom/device execution.

Sources: `packages/ui/src/experimental/Typography/Typography.tsx`, `docs/developer/backlog-execution-2026-10-15.md`.

Tests/evidence: `packages/ui/tests/browser/display-preferences.spec.ts`, `native-protocols.md`, `docs/developer/final-acceptance/parallel-09/report.md`.

Remaining deliverables:
- Recover HB-16 durable host/results/captures and reconcile hashes; reuse attributable unchanged cases.
- Execute only uncovered actual 200/400% browser zoom, long English/Arabic labels, both densities, text spacing and font-substitution cases; retain reviewed capture/content/focus/scroll outcomes.

### A-D-12 — partial

- [ ] A-D-12 Reconcile original `D-12`: Make important touch controls comfortably operable; density must not erase minimum hit areas or keyboard focus indicators. Historical status: open.

Progress: Prepared exact coarse-auto policy protocol extending rather than duplicating existing explicit pointer/touch tests: both dimensions, activation and keyboard focus after portal.

Checks: Existing spec-source review; no native execution.

Sources: `packages/ui/src/foundation/tokens.css`, `packages/ui/src/components/Button/Button.module.css`.

Tests/evidence: `packages/ui/tests/browser/hardening-control-geometry.spec.ts`, `native-protocols.md`, `docs/developer/final-acceptance/parallel-10/report.md`.

Remaining deliverables:
- Record media-query coarse capability, compact auto target dimensions >=44 CSS px, actual activation and focus across Button/IconButton/checkbox/switch/menu; retain exact native host/results.
- Keep physical device obligations separately classified.

### A-D-16 — partial

- [ ] A-D-16 Reconcile original `D-16`: Define scoped theme/density roots and nested overrides; ensure portaled overlays receive the correct scope and variables. Historical status: open.

Progress: Prepared composed live-theme/density/token portal protocol covering nested Menu/Tooltip, overridden descendants and sibling isolation without copying layout styles. Existing static Dialog portal evidence remains bounded; no source-based all-overlay conclusion.

Checks: Read actual scope propagation and existing case; no repeated baseline.

Sources: `packages/ui/src/foundation/ThemeScope.tsx`, `packages/ui/src/experimental/Popover/Popover.tsx`, `packages/ui/src/experimental/Menu/Menu.tsx`.

Tests/evidence: `packages/ui/tests/browser/token-tier-scope.spec.ts`, `packages/ui/src/foundation/ThemeScope.next100-regression.test.tsx`, `native-protocols.md`, `docs/developer/final-acceptance/parallel-10/report.md`.

Remaining deliverables:
- Recover prior token-tier portal raw receipt or run only unreconciled existing case; add missing live nested-overlay scope-change case with computed attribute/token results and focus return.

### A-D-17 — partial

- [ ] A-D-17 Reconcile original `D-17`: Specify explicit light/dark/system settings, initial server theme, `color-scheme`, and hydration behavior without unwanted flashes or browser-global assumptions. Historical status: open.

Progress: Prepared first-styled-frame and hydration protocol with pre-navigation light/dark preferences, blocked JS comparison, same server root and preference transition. CSS system resolution and deterministic default light remain implemented; host stylesheet timing/initial preference is outside source proof.

Checks: Reused source/SSR boundaries; no packed rebuild/hydration execution.

Sources: `packages/ui/src/foundation/ThemeScope.tsx`, `packages/ui/scripts/test-foundation-consumer.mjs`.

Tests/evidence: `packages/ui/src/foundation/ThemeScope.test.tsx`, `native-protocols.md`, `docs/developer/final-acceptance/parallel-10/report.md`.

Remaining deliverables:
- Use authorized packed SSR window for system theme first paint/hydration/raw results; record stylesheet and server initial-theme assumptions, zero recoverable errors and preference change.

### A-C-07 — partial

- [ ] A-C-07 Reconcile original `C-07`: Document stylesheet composition across library themes, components, utilities, and consumer overrides; avoid escalating specificity or routine `!important`. Historical status: checked.

Progress: Prepared complete host.reset/sgui.tokens/sgui.components/host.utilities/host.overrides composition example and normal/unlayered/important cascade consequences. Current 13 Popover presentation-geometry important declarations are explicitly explained as overriding anchored inline positioning, without assuming every lock is necessary. Concurrent fix-03 completes maintained composition guidance and property inventory; only C07-popover-important necessity/strategy decision remains, plus architecture entry-link integration.

Checks: Current important selector/style-merge review; Concrete composition/exception prose drafted; no CSS/native change.

Sources: `docs/developer/react-aria-architecture.md`, `packages/ui/src/experimental/Popover/Popover.module.css`, `packages/ui/src/experimental/Popover/Popover.tsx`, `docs/developer/react-aria-css-composition.md`.

Tests/evidence: `packages/ui/src/experimental/Popover/Popover.test.tsx`, `documentation-payload.md`, `docs/developer/final-acceptance/parallel-11/inspection.json`, `docs/developer/final-acceptance/fix-03/report.md`, `docs/developer/final-acceptance/fix-03/validation.json`.

Remaining deliverables:
- Coordinator links/reviews the new maintained CSS composition guide from architecture; do not reapply this wave draft.
- Review necessity of each retained geometry lock or separately omit inappropriate anchored geometry and verify affected presentation/resize/reopen flow; preserve consumer override constraints.

### A-I-04 — partial

- [ ] A-I-04 Reconcile original `I-04`: Keep icons individually importable; avoid pulling an entire icon catalog into basic components. Historical status: checked.

Progress: Retained direct-entry evidence and prepared precise bundle/module-map acceptance inputs for granular/basic plus toolbar/navigation consumers. No new bundle output or pruning proof; barrel syntax alone is not catalog retention.

Checks: Reused entry inventory and prior graph findings; no consumer suite.

Sources: `packages/ui/src/icons/AddIcon.tsx`, `packages/ui/src/experimental/icons/AddIcon.tsx`, `packages/ui/scripts/test-foundation-consumer.mjs`.

Tests/evidence: `packages/ui/src/components/icons/icons.next100-regression.test.tsx`, `native-protocols.md`, `docs/developer/final-acceptance/parallel-12/evidence.json`.

Remaining deliverables:
- Capture current-input production module maps proving selected glyph presence/unrelated glyph elimination and CSS side effects; reuse existing attributable packed receipt if available.

### A-I-05 — partial

- [ ] A-I-05 Reconcile original `I-05`: Establish consistent optical size, weight, alignment, RTL mirroring policy, and theme contrast. Historical status: open.

Progress: Authored concrete logical-navigation/indentation versus physical-alignment usage direction table, with exact default mirror set and host override semantics. Prepared 16/20/24px optical/transform/contrast receipt protocol; currentColor/RTL attributes are not rendered evidence.

Checks: Direction/source-policy reconciliation; No visual/browser/contrast measurements.

Sources: `packages/ui/src/experimental/icons/createVector.tsx`, `packages/ui/src/experimental/icons/icons.module.css`, `docs/developer/react-aria-icons.md`.

Tests/evidence: `packages/ui/src/experimental/icons/icons.test.tsx`, `documentation-payload.md`, `native-protocols.md`.

Remaining deliverables:
- Integrate/review direction-use table, then record optical size/weight/alignment/clipping, computed default/override/nested RTL and named light/dark/increased/forced-color pairs.

### A-I-08 — partial

- [ ] A-I-08 Reconcile original `I-08`: Add icon catalog, accessibility, and bundle checks; update notices for all shipped vector assets. Historical status: open.

Progress: Concurrent fix-06 resolves I-S3: Brush->Paintbrush metadata/docs now complete with 96/96 parity; reused its implementation-aware guard receipt. New saved-inventory-to-current-map assertion likewise yields no mismatch. Initial preparation saw concurrent fix and was adapted; no duplicate source edit applied. Bundle/visual/gallery execution and final legal-owner provenance remain unproven here.

Checks: Reused fix-06 parity for changed metadata; Compared retained implementation inventory to current map; no icon tests rerun.

Sources: `packages/ui/src/experimental/icons/icon-map.json`, `docs/developer/react-aria-icons.md`, `THIRD_PARTY_NOTICES.md`.

Tests/evidence: `packages/ui/src/experimental/icons/icons.test.tsx`, `icon-parity.json`, `docs/developer/final-acceptance/fix-06/report.md`, `docs/developer/final-acceptance/fix-06/parity.json`, `native-protocols.md`.

Remaining deliverables:
- Complete I-S1 bundle and I-S2 rendered checks, then I-S4 production icon-route search/label/source-copy/state-isolation receipt.
- Reconcile legal-owner final asset provenance separately; retained notices are not legal approval.

### A-H-02 — partial

- [ ] A-H-02 Reconcile original `H-02`: Verify modifier clicks, downloads, external links, targets, default prevention, and navigation callback ordering through browser tests. Exact-byte transfers and native semantics in all three engines, CI 37560065588; [browser evidence](react-aria-browser-acceptance.md). Historical status: checked.

Progress: Specified only existing download/native-host cases for a future immutable current-host three-engine receipt. Old CI 37560065588 and one-case custom router receipt retain their source/host limits; no new browser claim.

Checks: Read preserved spec assertions and dated receipts; no browser/network CI query.

Sources: `packages/ui/src/adapters/Link.tsx`, `packages/ui/src/experimental/Link/Link.tsx`.

Tests/evidence: `packages/ui/tests/browser/acceptance.spec.ts`, `packages/ui/tests/browser/batch01-adapters.spec.ts`, `native-protocols.md`, `docs/developer/final-acceptance/parallel-13/report.md`.

Remaining deliverables:
- Execute/reconcile current docs-host exact-byte download, modifier/target/external/default-prevention and callback-order cases across three configured engines after build lease; retain popup/download raw outcomes.

### A-H-03 — partial

- [ ] A-H-03 Reconcile original `H-03`: Integrate React Aria routing where needed behind the existing host adapter; avoid two competing navigation systems or a runtime Next.js dependency. Historical status: open.

Progress: Prepared one-router-owner composed Menu/Breadcrumbs/SideNavigation scenario with accepted pathname, replace, modified targets and ref focus after rerender. Existing navigation context is shared behind owned adapters; no new runtime Next or competing router added.

Checks: Reused routing-owner review; concrete composed scenario protocol.

Sources: `packages/ui/src/adapters/navigation.tsx`, `packages/ui/src/experimental/Menu/Menu.tsx`, `packages/ui/src/experimental/Breadcrumbs/Breadcrumbs.tsx`, `packages/ui/src/components/SideNavigation/SideNavigation.tsx`.

Tests/evidence: `packages/ui/src/experimental/Menu/Menu.test.tsx`, `packages/ui/tests/browser/batch01-adapters.spec.ts`, `native-protocols.md`, `docs/developer/final-acceptance/parallel-13/report.md`.

Remaining deliverables:
- Implement/execute the bounded composed fixture in docs-native host, recording exactly-once pointer/Enter navigation and native bypass/ref/pathname behavior; keep framework dependency host-only.

### A-H-05 — partial

- [ ] A-H-05 Reconcile original `H-05`: Define pending/error handling for asynchronous host actions without duplicating requests or swallowing useful errors. Historical status: open.

Progress: Delivered safe host diagnostic wrapper preserving unknown rejection identity before rethrow; distinguishes generic UI alert from diagnostic transport. Prepared three-operation failure/cause/opaque/duplicate/retry/stale-owner assertions; no new logging service/callback installed.

Checks: Error-path source review; Concrete reviewable host wrapper/protocol authored; no request execution.

Sources: `packages/ui/src/adapters/accounts.tsx`, `packages/ui/src/components/SideNavigation/SideNavigation.tsx`.

Tests/evidence: `packages/ui/src/adapters/accounts.test.tsx`, `packages/ui/src/components/SideNavigation/SideNavigation.organization-lifetime.test.tsx`, `documentation-payload.md`, `native-protocols.md`, `docs/developer/final-acceptance/parallel-13/report.md`.

Remaining deliverables:
- Adopt/document chosen host diagnostics ownership or an owned optional notification API, then execute operation-specific exact-once diagnostic/request, safe alert, retry and stale-owner cases.

### A-H-08 — partial

- [ ] A-H-08 Reconcile original `H-08`: Validate ICU variables, pluralization, selection counts, date/number formatting, long labels, RTL, and pseudo-localized stories. Historical status: open.

Progress: Prepared exact existing pseudo/Arabic fixture IDs, 320px actions, plural counts 0/1/2/3/11, scoped lang/dir, source/engine receipts and separate operator spoken-output record. Retained ICU variable/default parsing and unit evidence; no duplicate formatter scan or no-provider tests.

Checks: Reused completed ICU source/default parsing; Prepared native/operator acceptance specification only.

Sources: `packages/ui/src/i18n/icu.ts`, `apps/docs/native-fixtures/scenarios/i18n/Translations.fixture.tsx`.

Tests/evidence: `packages/ui/src/i18n/icu.test.ts`, `packages/ui/src/i18n/ICUFormatting.next100-regression.test.tsx`, `native-protocols.md`, `docs/developer/final-acceptance/parallel-14/reconciliation.json`.

Remaining deliverables:
- Add focused native specs for existing pseudo/Arabic scenarios and only missing fixed-clock locale/date/number coverage; retain reviewed reflow/focus/state/format receipts.
- Operator records actual English/Arabic count/clear announcements with named AT/browser/OS/device/language; DOM status alone is insufficient.

### A-B-12 — partial

- [ ] A-B-12 Reconcile original `B-12`: Review the extraction manifest against actual files so helpers, model presets, nodes/plugins, fixtures, and tests are not lost when directories move. Historical status: open.

Progress: Progressed original metadata successors using concurrent fix-05 validation: 201 rows, 159 present/42 absent, zero presence mismatches, 36 repaired rows and 53 replacement references checked. Abandoned own manifest draft to preserve fix-05 qualified Button lineage and related-source metadata. No duplicate edit or repeated original file scan. Current helper/model/preset/editor continuity inventory remains reusable; local initial-extraction editor/hook references added. Final fix-05 demonstrates exact local AppButton assertion continuity to Button.public-contract.test.tsx after name substitution; local story versions contain no executable play/expect/assert assertions. Original-platform story mapping is still explicitly unverified.

Checks: Read changed manifest rows and reused fix-05 path validation; Read-only local Git reference supplement; no manifest mutation.

Sources: `docs/extraction-manifest.json`, `apps/docs/native-fixtures/migration-manifest.json`, `packages/ui/src/models.ts`, `packages/ui/src/components/PageRichTextEditorSection/lexical/editorConfig.ts`.

Tests/evidence: `packages/ui/src/components/Button/Button.test.tsx`, `packages/ui/src/models.remaining-T-boundary.test.ts`, `packages/ui/src/components/Button/Button.public-contract.test.tsx`, `docs/developer/final-acceptance/fix-05/validation.json`, `docs/developer/final-acceptance/parallel-15/manifest-audit.json`, `local-extraction-reference.json`, `docs/developer/final-acceptance/fix-05/report.md`, `docs/developer/final-acceptance/fix-05/button-lineage.json`.

Remaining deliverables:
- Attach original-platform source-commit-bound evidence, or explicitly reconcile/accept proposed AppButton story mappings in separately owned migration metadata. Preserve the current qualified mapping; no accidental file loss was found.

### A-B-14 — partial

- [ ] A-B-14 Reconcile original `B-14`: Keep the learner platform unchanged; collect reference behavior and source provenance read-only. Historical status: checked.

Progress: Collected six exact local initial-extraction files from sg-ui Git at 21adebd plus reused twelve historical contracts, without opening another checkout. Recorded original platform repository/root/commit remains preserved; local hook default/preset/editor-schema differences are reviewable in defaults-and-state.md. Local extracted code does not independently verify original platform commit or native reference behavior.

Checks: Six bounded git show reads from existing sg-ui object store; No original platform network/checkout access.

Sources: `docs/extraction-manifest.json`, `docs/migration.md`, `docs/agent-guidance-migration.md`.

Tests/evidence: `local-extraction-reference.json`, `defaults-and-state.md`, `docs/developer/final-acceptance/parallel-01/api-snapshot.json#historical`.

Remaining deliverables:
- Attach durable original-source-commit-bound read-only reference captures or separately authorize original provenance review; reconcile helper/preset/editor/Button behavior against those references.
- Preserve unchanged learner platform; no mutation or access to another checkout authorized here.

All findings are limited to the exact input hashes and hosts above. Coordinator alone updates shared acceptance counts.

Late concurrency note: source-cycle-extraction.patch is an unapplied design payload. Its final application check fails against newly edited DateField context; patch-check.json preserves the exact failure. Regenerate it from stable source before integration. Current post-capture input deltas are retained in results.json/integrity.json rather than silently certifying changed bytes.
