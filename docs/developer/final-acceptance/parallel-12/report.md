# Icon acceptance reconciliation — parallel-12

Result: **five complete, three partial, zero blocked**. These are recommendations for the coordinator; no shared acceptance checkbox or count was edited. All eight full original obligations at `docs/developer/react-aria-hardening-tasks.md:220` were reviewed, including those historically checked. No production/release action occurred.

## Evidence and limits

Base/current HEAD: `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, branch `dev`, existing modified checkout. This is working-tree evidence, not a committed final artifact. Run time, individual input hashes and comparisons are in [evidence.json](evidence.json). Reproduce the bounded analysis from repository root with `python3 docs/developer/final-acceptance/parallel-12/reconcile.py`. The script writes only this owned directory.

Reused FA-01's complete icon/export inventory rather than reimporting/rebuilding the catalog. Compared 215 relevant source/config/docs inputs with FA-01/FA-02 saved hashes: **zero changed or missing**, all had saved hashes. Compared 794 icon output/declaration/map files plus the stylesheet (794 total) with FA-01 output hashes: **zero changed or missing**. FA-04 already establishes zero deltas across the complete distributable after its test-only corrections. The five production barrel consumers below also retain their FA-02 hashes. Installed dependency identities remain those described by FA-02; no installation or new registry audit was performed.

Reused `fa04-original-check.txt`: its full unit invocation has 275 passing and four failing suites, all four named failures are date-family suites; icon tests belong to the retained passing scope. Its reporter suppresses individual passing-suite lines, so this is aggregate retained evidence, not a new isolated icon-test receipt. FA-04's affected rerun reconciles the four failing suites separately. `fa04-package.txt` establishes current-output import/type/packed-file/notices checks. None of those receipts establishes browser rendering, actual spoken AT output, physical-device behavior or consumer bundle pruning. The relevant icon test inputs and outputs are unchanged, so no completed tests were rerun.

New checks were limited to byte comparisons, original-name/mapping/implementation/gallery parity, default-direction flags, saved import-reference review, and installed-license text retention. No browser, broad/full suite, consumer fixture, shared build/output, install, server, Git mutation or legal-notice edit was performed. This analysis does not claim fresh legal approval.

## Leaf decisions

### A-I-01 — complete

Original obligation: select an independently licensed SVG source or owned vector set covering all current symbols and editor controls.

`packages/ui/package.json:258` pins `lucide-react` 1.52.0; individual implementations import named Lucide vectors and wrap them in the owned factory. The historical baseline at `docs/developer/migration-baseline/inventory.json` records 95 distinct direct `@mui/icons-material/<symbol>` source names, including the old public barrel and editor controls. All 95 occur in `packages/ui/src/experimental/icons/icon-map.json`; every mapping matches the actual `createIcon` vector argument. There are 96 current wrappers, with BrushIcon/Paintbrush added beyond the original 95. No missing original symbol or mapping mismatch was found. The installed upstream ISC plus Feather MIT license text is retained verbatim in both equal repository/package notices. FA-02 finds no retired production foundation dependency. References: `docs/developer/react-aria-icons.md`, `packages/ui/src/experimental/icons/icons.test.tsx`, `packages/ui/src/components/icons/icons.test.tsx` and FA-01 runtime/declaration parity.

Completion is selection/coverage reconciliation. Wider legal/provenance leaves remain separate. Successor: none required for this leaf; mapping-documentation maintenance is recorded under A-I-08.

### A-I-02 — complete

Original obligation: replace every direct/public icon including account/logout, arrows, calendar, filters, status, editor formatting, undo/redo and activity symbols.

The same 95/95 baseline reconciliation includes AccountCircle/Logout, ArrowForward/KeyboardArrowLeft, CalendarToday/Event, FilterList/Tune, Check/TaskAlt, formatting/indentation, Undo/Redo and five activity vectors. No historical name is missing. Public `packages/ui/src/icons/<Name>Icon.tsx` modules reexport their shared experimental wrappers, and the public component barrel reexports the same implementations. FA-01 already resolves all wildcard routes and compares runtime/declaration exports; its 96 public icon-path modules and 97 experimental icon-path modules include the activity helper path and are not unique-glyph counts. Tests: `packages/ui/src/components/icons/icons.test.tsx` checks public/barrel equality, while its `icons.next100-regression.test.tsx` resolves every individual public icon module repeatedly. Current gallery contains all 96 wrappers. No new inventory or test run was needed.

Successor: none required for original replacement coverage. BrushIcon's implemented/gallery/public entry exists, but its absent mapping metadata should be added under A-I-08; this is not an unmapped original symbol.

### A-I-03 — complete

Original obligation: owned size, stroke/fill, current color, class/style, decorative/meaningful and ref contract.

`packages/ui/src/experimental/icons/createVector.tsx:3` defines the narrow owned `IconProps`. At line 17 defaults are `size="1em"`, `strokeWidth=2`, `color="currentColor"`, `fill="none"`; width and height share size. It forwards a native SVG ref, id, native CSSProperties style and className; owned mirrorInRtl remains optional. `packages/ui/src/icons/AddIcon.tsx` illustrates the public type reexport. No upstream SVG prop surface escapes the public interface. `docs/developer/react-aria-icons.md` gives the breaking mappings and style/scope prerequisite. Public and experimental icon tests cover all catalog refs/default decoration; both next100 files cover rerender/unmount ref cleanup, meaningful-to-decorative transitions and sibling isolation. FA-04 type/unit and package declaration checks are retained with unchanged inputs.

Successor: none for contract definition. The host still controls meaningful labels and arbitrary CSS color/fill; the API does not promise contrast for arbitrary overrides.

### A-I-04 — partial

Original obligation: individual imports and avoiding the whole catalog in basic components.

Individual imports are complete: FA-01/FA-04 package receipts and the public repeated-import regression cover direct routes. AddIcon's direct module reexports one experimental file; that file imports Plus and the shared factory without an icon barrel. Activity helper imports five explicit icons. Existing `packages/ui/scripts/test-foundation-consumer.mjs:289` checks emitted CSS and rejects three unused Lucide vector markers in the representative basic Vite bundle. Historical `react-aria-progress.md:1375` records React 18/19 pruning passes, but does not bind those runs to this acceptance working tree with durable source/output receipts. FA-04's package check is not a bundle-pruning check.

FA-02 records five implementation barrel consumers: AppDataGrid/ownedGridInteraction.tsx, AppDataGrid/ownedGridParts.tsx, AppDataGridRowDnd/DataGridDragHandle.tsx, DataToolbar/DataToolbar.tsx and SideNavigation/SideNavigation.tsx. Their hashes are unchanged. A barrel import alone is not proof that a bundler retains the entire catalog; likewise individual route support alone does not prove pruning. No runtime bundle defect is asserted.

Required successor **I-S1**: in a separately authorized consumer-validation batch, preserve a durable current-input production bundle/module-map receipt for granular AddIcon/basic control and representative toolbar/navigation consumers. Confirm selected vectors remain and unrelated catalog vectors disappear; include source/output hashes and CSS side effects. Reuse any equivalent coordinator receipt if it becomes available. Consider granular internal imports only if that check shows an actual problem. This conversation was expressly forbidden to run consumer suites/build shared outputs.

### A-I-05 — partial

Original obligation: optical size/weight/alignment, RTL policy and theme contrast.

The source establishes shared dimensions, stroke width 2, inherited currentColor, inline-block/flex-none/middle alignment (`createVector.tsx`, `icons.module.css:2`). Eight defaults mirror: ArrowForward, ChevronRight, KeyboardArrowLeft, Logout, FormatIndentDecrease/Increase, Undo and Redo; mirrorInRtl can override them. CSS uses `:dir(rtl)` within the owned compiled layer. The tests assert mirror metadata and explicit disabling, not rendered transform or optical geometry. Contract guidance says directional arrows/navigation mirror but does not classify every physical versus logical usage. Current color inherits host control contrast and permits arbitrary host overrides.

Required successor **I-S2**: record a symbol/usage direction policy, especially physical arrow names and editor left/right alignment versus logical navigation/indentation. Validate the gallery and real control contexts at 16/20/24px in both directions and supported densities, checking optical weight, baseline and clipping. Add bounded native computed-transform evidence for inherited and nested RTL, default/forced mirror and override=false. Record representative named foreground/background pairs in light/dark/increased contrast and forced colors. Review actual rendered results; jsdom attribute assertions and source inspection do not close those obligations. No browser/device/AT or visual-conformance result is claimed here.

### A-I-06 — complete

Original obligation: decorative icons hidden and meaningful names at the appropriate control level.

The factory enforces decorative `aria-hidden=true` and `focusable=false`; nonempty label switches to role=img plus aria-label (`createVector.tsx:19`). Empty label remains decorative. `packages/ui/src/experimental/IconButton/IconButton.tsx` requires label:string, passes it to the owned button's aria-label and hides its child span. `packages/ui/src/components/Button/Button.tsx:44` hides start/end icon slots; the containing visible action text supplies the name. The public contract and usage guidance explain standalone versus containing-control naming and host translation. Public/experimental tests exercise getByRole(img) naming and decoration; next100 tests verify label removal and isolation. This closes the implementation/naming-policy obligation with retained DOM evidence, not cross-platform spoken AT conformance. Strings cannot statically prevent a host from passing an empty action name.

Successor: none required for this original contract leaf. Wider AT/control audits remain separate; avoid counting this as those gates.

### A-I-07 — complete

Original obligation: preserve known/unknown activity fallbacks and consumer options.

`packages/ui/src/experimental/icons/activityTypeIcon.tsx:12` normalizes case and checks own override keys first. Lesson maps to MenuBookOutlined; quiz/exam to QuizOutlined; assignment/project to FactCheckOutlined; lab/practice to ScienceOutlined; unknown/empty/null/undefined to WorkOutlineOutlined. Default size is 20. Host options retain size, known/unknown node overrides, explicit null suppression and fallback replacement/null suppression. The own-property guard prevents inherited toString from being treated as an override. Public component helper shares this implementation. `packages/ui/src/components/icons/icons.test.tsx` compares exact server-rendered mapped symbols for eleven inputs and covers uppercase, 20px, host overrides, nulls and inherited-property fallback; experimental tests provide additional retained coverage. Documentation matches the implementation. Host ReactNodes retain their own naming/style responsibility.

Successor: none required; no backend or application metadata contract was introduced.

### A-I-08 — partial

Original obligation: icon catalog, accessibility/bundle checks and notices for every shipped vector asset.

The docs route definition in `apps/docs/examples/catalog/primitives-actions.tsx:1805` registers all 96 icons plus activity helper. Its separate state owners at lines 1637, 1657 and 1676 provide gallery, activity and prop playground using Example with copyable source; source controls size/stroke/label in the playground. Gallery parity check finds zero missing/unknown implementations. Usage guidance exists at `apps/docs/content/component-usage/presentation.json:23`. Existing unit tests cover naming, refs and default decoration, and the consumer script provides pruning assertions (limits as A-I-04). This analysis did not exercise gallery search/source/copy in a browser.

Both notice copies are equal and include the complete installed Lucide LICENSE verbatim, including ISC and Feather list/MIT text; FA-04 package equality confirms notices are packed. No notice edit is warranted from this comparison. This retention evidence does not close wider legal review.

Finding **I-S3**: BrushIcon is implemented with Paintbrush and exposed in the public gallery, but absent from the 95-entry icon-map.json and the contract's “Complete symbol mapping” table. Reproduce with reconcile.py: implementedButNotInMappingJson / implementedButNotInMappingDocumentation both contain BrushIcon; gallery parity remains complete. An authorized implementation/docs successor should add Brush→Paintbrush to both maintained mappings and add an inexpensive parity guard to prevent new drift. No wrapper or vector replacement is needed.

Required successors: I-S1 bundle receipt and I-S2 presentation checks; **I-S4** bounded production docs icon-route verification of gallery search, meaningful/decorative transition, copy/source correspondence and independent state, retaining exact source/output/engine receipt. Prefer existing valid durable coordinator results over rerunning. Reconcile these with legal-owner final asset provenance review without deleting historical notices. Until the missing checks and metadata maintenance are reconciled, keep this full leaf open.

## Handoff

Coordinator may reconcile A-I-01/02/03/06/07 as complete using these bounded results. Keep A-I-04/05/08 open with I-S1–I-S4. No implementation changes or shared state were made, and the 20 editor V leaves and all production validation remain untouched.
