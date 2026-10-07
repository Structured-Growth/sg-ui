# Batch 121: E-09, E-10, X-01 and X-02 parent-criterion evidence

Inspected baseline: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev`).
Date: 2026-10-07. Isolated managed checkout:
`/Users/thomashall/.codex/worktrees/batch-121-evidence/sg-ui`.
Only this report and the new `tests/browser/acceptance-pack-121.spec.ts` change.
The coordinator alone decides acceptance and integration; no parent checkbox,
inventory row, ledger, shared configuration, production source or other report changed.

## Per-ID decision matrix

| Criterion | Evidence classification at inspected baseline | Precise remaining gate / owner |
| --- | --- | --- |
| E-09 | **Partial.** Learning presentation members and host responsibilities are documented below and in the architecture/migration guides. Cards/grid/presets consume generic controls; there is no application API dependency in the inspected members. Activity mapping remains exported by the shared icon barrel, which generic grid/toolbar sources import. A documented logical boundary exists, but strict source separation of that mapping is not established. | Coordinator must decide whether same-package documented grouping with shared icon exports satisfies the intended boundary. If strict import separation is required, hand off the three generic icon-barrel import sites below; do not silently invent a new package or relocate public exports. |
| E-10 | **Fully supported for the stated source/documentation criterion**, subject to coordinator acceptance. Selected generic layout/control/grid source graph does not reach `src/models.ts`, learning cards/grid, or learning presets. Class compatibility and Course naming, owned prop migration and granular entry points are explicitly documented. | This is source inspection, not an emitted/bundled package or host adoption certificate. Preserve the icon-barrel reachability limit from E-09; broad release/browser/device/AT gates remain separate. |
| X-01 | **Partial.** Real interaction components and native browser tests cover focus/keyboard behavior; retained Chromium insertion evidence was independently read. Editor unit instrumentation delegates to real Lexical components/plugins, while several formatting/dialog/table cases intentionally remove the floating toolbar and directly establish editor selections. These cases cannot prove that removed toolbar's native selection/focus behavior. | A complete component-to-behavior review and retained exact-artifact coverage for focus/keyboard-sensitive paths is still required. Existing native editor specs should be validated/attributed first; no concrete production defect or necessary test replacement was demonstrated in this read-only slice. |
| X-02 | **Partial.** Contracts and existing specs cover Tab/Shift+Tab, arrows, Home/End, Enter/Space and Escape in applicable controls. No explicit typeahead assertion was found in the inspected Menu/Select tests or browser suite. A single Menu regression is prepared using an unchanged deterministic story. | New regression **UNRUN**, including browser typing. Coordinator owns source/story/browser typechecking, fresh immutable build and selected Chromium/Firefox/WebKit execution. Typeahead contracts/coverage for other applicable collections still need review; engine/manual/device/AT limits are not waived. |

## Learning extension boundary and naming (E-09 / E-10)

This is an optional logical extension inside the existing package, consistent with
[architecture dependency direction](../react-aria-architecture.md#layers-and-dependency-direction).
It does not require consumers to copy screens or introduce a separate package.

| Boundary member | Exact source responsibility | Host boundary |
| --- | --- | --- |
| `ClassCardFrame`, `InstructorClassCard`, `LearnerClassCard` | Reusable card slots and supplied course/instructor/progress/status/due presentation; owned Card, Typography, Link, Avatar and controls underneath | Host supplies presentation values and navigation/action callbacks; no screen, persistence or API service |
| `LearnerClassesDataGrid` and `src/models.ts` | LearnerClass presentation record, course-specific columns and generic AppDataGrid composition | Rows, identity, launch paths and controlled state supplied by host |
| `AdminDataGridOptions.ts`, `InstructorDataGridOptions.ts` | Translated Course-named factories, immutable UI status vocabularies, first/action column locks and fresh empty criteria arrays | Backend vocabulary mapping, requests, filters and persistence stay host-owned |
| `experimental/icons/activityTypeIcon.tsx`, `components/icons/activityTypeIcon.tsx` | String-to-icon mapping with override/fallback; public compatibility forwarding | Host chooses activity strings/overrides; no application contract import |

The activity implementation maps lesson, quiz/exam, assignment/project and
lab/practice strings; unknown values use host fallback or WorkOutlineIcon. This
mapping is currently also exported by `src/experimental/icons/index.ts`, then the
public icon barrel. Generic `ownedGridParts.tsx`, `ownedGridInteraction.tsx` and
`DataToolbar.tsx` import that shared barrel. Reachability of the mapping is a
syntactic export-graph observation, **not proof of emitted bytes, execution or a
course-specific model dependency**. No bundler/tree-shaking claim is made.

[Migration mappings](../../migration.md#consumer-migration-mappings),
[preset contracts](../react-aria-grid-presets.md) and
[component architecture](../component-architecture.md) document preserved Class/App
names, Course terminology for new presentation APIs, owned replacement contracts,
explicit public subpaths, stylesheet/scopes, and host-owned routing/data/accounts.
The remaining `LearnerClass` name and Class-prefixed components are compatibility
exports, not an authorization to rename them. Preset column identifiers such as
`className` continue to match host datasets. Extraction provenance is documented;
this review does not inspect the external learner-platform repository or certify
all historical copying. It inspects the actual SGUI source members and their imports.

## Read-only source checks performed

Read README, migration, component architecture, master criteria, architecture,
preset, primitive, proof-control and layout-action contracts. Used `rg` to locate
assigned criteria, learning members, keyboard assertions and mock declarations.
Read card/grid/preset/activity implementation imports and the relevant real editor
instrumentation rather than treating `vi.mock` occurrences as automatic defects.

A local Python read-only source traversal considered `.ts`/`.tsx` files under
`src`, excluding filenames containing `.test.` or `.stories.`. It matched literal
`from`, side-effect `import` and `import(...)` specifiers, resolved relative paths
with `.ts`, `.tsx`, `index.ts`, `index.tsx`, and followed import/reexport edges
(including type-only edges conservatively). The selected generic root directories:

`foundation`, `theme`, `primitives`, `AppShell`, `AuthShell`, `AppModal`,
`AppPageHeader`, `AppPageTabs`, `AppButton`, `AppDataGrid`, `AppDataGridShell`,
`DataToolbar`, `CardCollectionWithFooter`, `CardPaginationFooter`.

Result: **67 roots, 201 reachable source files**. Learning target set: **14**
production files consisting of models, presets, both activity mapping files and
all production files under ClassCardFrame/InstructorClassCard/LearnerClassCard/
LearnerClassesDataGrid. Only `experimental/icons/activityTypeIcon.tsx` was reached.
Direct production importers of `models.ts` were `LearnerClassesDataGrid.tsx` and
`src/index.ts` (aggregate public export). No selected generic graph path reached
that model. The regex scan is bounded static evidence, not a TypeScript semantic
analyzer, runtime guard, package build or universal audit of all future controls.

## Behavioral evidence and its limits (X-01 / X-02)

- `Menu.test.tsx` renders real Menu/Button: disabled skipping, actual activeElement,
  Escape/source focus, and ended/moved focus ownership. Container-focus mismatch
  injection checks a repair boundary; it does not replace native defect evidence.
- `PageRichTextEditorSection.floating.test.tsx` delegates LexicalComposer/plugins to
  actual implementations and adds an editor capture. Geometry is synthetic because
  jsdom lacks it; selection is established through Lexical APIs. Formatting and
  table-history tests similarly use real plugins but remove FloatingTextSelectionToolbar.
  Do not count those as native selection timing or floating-toolbar focus proof.
- `ownedGridInteraction.drop-focus.test.tsx` wraps and delegates real useDragAndDrop
  while exposing event callbacks for a previously observed collection-focus case.
  Callback injection is not physical drag proof; the real collection stays rendered.
- [Layout action contract](../react-aria-layout-actions.md) defines Menu arrows,
  disabled skipping, activation/dismissal/source focus and ButtonGroup normal Tab.
  [Proof contract](../react-aria-proof-controls.md) defines modal containment/restoration
  and tab activation/locale/disabled behavior.
- `batch07-catalog-tabs.spec.ts` asserts native Tab/Shift+Tab panels, locale-sensitive
  arrows, Home/End, manual Enter/Space, disabled skipping, actual focus/overflow and
  independent instances. Its [retained report](../parallel-batch-07/catalog-tabs.md)
  attributes historical Chromium/WebKit results to `13f3c5536ad2b0673839a617c6fafd16911fa0a3`;
  no current-head pass or Firefox/manual zoom/device/AT pass follows from it. Its
  old logs/results were not independently retrieved in this slice.
- `batch01-dialogs.spec.ts` asserts nested Escape ownership, restoration and both
  Tab directions. `batch01-selectors.spec.ts` asserts real selection, disabled
  skipping and independent form values. These are retained assertions, **not newly
  executed passes**. Existing editor/grid/native specs remain available; this
  report does not repeat completed inventory 29/30/31 reviews.

### Actual retained artifact independently inspected

Read the coordinator's wave30 root `evidence.json` and insertion shard `results.json`:

`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/80b00fee-f55f-45e8-88dc-4666223d88cc/`.

Tested head: `5cc976dc1b9af6ced3980ec0e93fe930a9a8237b`;
source tree `b468c7d33f618c07690fc81cb362a8653df83c2a`;
Node `v24.19.0`, Darwin host context. Insertion shard: Chromium,
5 expected / 0 skipped / 0 unexpected / 0 flaky, results duration 4979.876 ms.
Build digest `6978ebf422790330db7d1a041dfa973e0d3f01c06362a9afbefb43719c5a6ee0`.
**Root status is failed** due to the pointer-drop-focus shard. Only the selected
insertion shard passed; no full candidate pass is claimed.

SHA-256 of root evidence:
`90350686ab0cfbf59c7710d977eeacb54268f61dc303abaf8e5568c7e1d55c2d`.
SHA-256 of `insert-menu-native-focus/results.json`:
`9205e9943ac4dbffde3940718149da40445047efb293f91b65d31e8b1fdcd2bf`.
The separate `/tmp/sgui-batch45-candidate-wave30-attribution.json` is **absent**.
The five worker source/story/unit/spec Git blobs listed below match the tested
candidate and inspected baseline; this independently replaces that missing file
for those five comparisons only. Transitive dependencies/current build are not
certified by matching five files. Firefox/WebKit, spoken AT, physical devices and
whole-editor/parent acceptance remain outside this artifact.

## Prepared missing regression / coordinator handoff

`tests/browser/acceptance-pack-121.spec.ts` is **UNRUN**. The existing
`migration-proofs-menu--native-autofocus` story supplies two enabled endpoints and
three disabled Unavailable items. The test enters by native Tab/ArrowDown, types
`l` to focus Last enabled, dismisses/restores source focus, reopens to reset the
search lifetime, types `u` to ensure disabled-only matches do not steal focus, then
activates the current enabled item with Enter. It uses no mocked engine, selection
injection, arbitrary timeout or new story. One case is prepared per selected engine.

Requested root validation window: browser/source typecheck as appropriate, build
fresh static Storybook once at frozen candidate, then selected spec in Chromium,
Firefox and WebKit using the coordinator harness. Record exact candidate head,
immutable build digest, engine/version/results and retained artifacts. A failure
must be reported without weakening the assertion. This test addresses Menu
coverage; it does not certify Select/ComboBox/other collection typeahead.

No production behavior failure was observed. If root requires strict icon mapping
separation for E-09, the minimal prospective source allowlist is:
`src/components/AppDataGrid/ownedGridParts.tsx`,
`src/components/AppDataGrid/ownedGridInteraction.tsx`,
`src/components/DataToolbar/DataToolbar.tsx` (replace barrel imports with existing
individual icon modules). Targeted handoff: affected grid/toolbar behavior tests,
types and foundation import guard plus read-only reachability reinspection.
Public barrel relocation/package changes need separate reviewed scope.

No install, test, build, pack, browser, performance, CI or lease command ran in
this assignment. Only read-only inspection, allowlisted file authoring and Git
whitespace/link/changed-path verification are performed. No acceptance is waived.

## Exact inspected Git blobs

All rows below identify baseline Git objects, independent of filenames implying a
pass. Runtime-tested five-file insertion rows additionally match candidate
`5cc976dc1b9af6ced3980ec0e93fe930a9a8237b` as described above.

| Baseline path | Git blob |
| --- | --- |
| `docs/migration.md` | `c16a7ab44e0533329f80d69c3c0c43db766e877f` |
| `docs/developer/react-aria-architecture.md` | `66280bea05b7f70b0e1bcc9e4b2388add91de97a` |
| `docs/developer/component-architecture.md` | `802b8086c11e2c28460596214775653f75ac886d` |
| `docs/developer/react-aria-grid-presets.md` | `113dfd8a046af272fc15563354bf8ed07dbc31ed` |
| `docs/developer/react-aria-layout-actions.md` | `d5bb37391920da442d64ed16979bb97ed8e34159` |
| `docs/developer/react-aria-proof-controls.md` | `cdab2ff6b34438f02fdeaa0784b76c2169b0b107` |
| `src/models.ts` | `08b008fb77535eaba532cdc1a0502267e5f3edcb` |
| `src/components/ClassCardFrame/ClassCardFrame.tsx` | `89a99b92463c1a6dbb9350fdd7a2d4ddadeb9a71` |
| `src/components/InstructorClassCard/InstructorClassCard.tsx` | `83ec860b0c0ad65363441152b893b2889cf46bcc` |
| `src/components/LearnerClassCard/LearnerClassCard.tsx` | `3e8d73e0e48d68c9dc324ad49e4507a2060b5417` |
| `src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.tsx` | `6ba451df32c7b971f63342f2c68b70d459dfc5b3` |
| `src/components/AdminDataGridOptions.ts` | `2149e949bb429adb23281748490efa29979a76da` |
| `src/components/InstructorDataGridOptions.ts` | `6289bbe308424625e079db723ffd440176736691` |
| `src/experimental/icons/activityTypeIcon.tsx` | `7bf865e1728396445aaf45364750b473ecc26490` |
| `src/experimental/icons/index.ts` | `846fa349975b182d018da435cd3ca4623170fd13` |
| `src/components/AppDataGrid/ownedGridParts.tsx` | `ccdbb11cc12e1a15b8406be1317320d74e2eb3f3` |
| `src/components/AppDataGrid/ownedGridInteraction.tsx` | `c44cfd77b60afb1ad970351e6aaa9c34feb15473` |
| `src/components/DataToolbar/DataToolbar.tsx` | `18157c396ad513d698b3cb7e3a56ae220294dffc` |
| `src/experimental/Menu/Menu.test.tsx` | `8c7b3e01a429070d9a36166067cd335012f1d06c` |
| `src/experimental/Menu/Menu.stories.tsx` | `225b8f19b471907fe9c07e664ac8beab80b85e52` |
| `src/components/PageRichTextEditorSection/PageRichTextEditorSection.floating.test.tsx` | `fc283468aaaec9359ba2bc1be44a42521ebd9336` |
| `src/components/PageRichTextEditorSection/PageRichTextEditorSection.formatting.test.tsx` | `2f4171012b24077a629978fc35ea58246f33a26b` |
| `src/components/PageRichTextEditorSection/PageRichTextEditorSection.table-history.test.tsx` | `16bfafd6d13c5529b60e6e83dd4b233679eab619` |
| `src/components/AppDataGrid/ownedGridInteraction.drop-focus.test.tsx` | `87491322ff54102db213261a322693187df4daae` |
| `tests/browser/batch07-catalog-tabs.spec.ts` | `441d3650fd8041965888c92a719e742c63f13d35` |
| `tests/browser/batch01-dialogs.spec.ts` | `b8a9ac949241c6d0e8f753e4bc782e44fb7a6322` |
| `tests/browser/batch01-selectors.spec.ts` | `c2565a4f08f2f979ce637377412d318ce9ff27de` |
| `src/components/InsertContentMenuControl/InsertContentMenuControl.tsx` | `97c24ed0a4bcb6ab30d89b9cfa75df41864194a9` |
| `src/components/InsertContentMenuControl/InsertContentMenuControl.stories.tsx` | `ba442a30872db5da9ffce0841e1e9ca999abd7c7` |
| `src/components/InsertContentMenuControl/InsertContentMenuControl.test.tsx` | `6aefacc2dbbd556fd3876a6a99dd04c2d2234955` |
| `src/components/InsertContentMenuControl/NativeInsertionHost.test.tsx` | `9b250fcef69db8c84e070267d8f553660ac1c7bb` |
| `tests/browser/batch62-insert-menu-native-focus.spec.ts` | `dc8ce7daa16c4ba967b212e193931159230d5c71` |
