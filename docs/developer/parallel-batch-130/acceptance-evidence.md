# Batch 130: W-06 / W-07 / W-08 / W-10 acceptance evidence

Read-only source assessment on 2026-10-07. Inspected head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (assigned reviewed `codex/dev` baseline). Isolated managed checkout: `/Users/thomashall/.codex/worktrees/batch130-acceptance/sg-ui`.

Only this report is changed. No install, test, build, package, browser, performance, CI or validation-lease commands were executed. **There is no runtime tested head for this batch.** Git object inspection and source/document comparison establish the bounded findings below. Root owns criterion acceptance, ledger/master updates and integration; this report does not check off any parent task.

## Per-criterion matrix

| Criterion | Finding at inspected head | Exact support | Remaining gate / owner |
| --- | --- | --- | --- |
| W-06 | **Partial: substantial source mapping is retained.** | [Guidance mapping](../../agent-guidance-migration.md) names the source repository and commit, has twelve source-section decisions and nine owned-foundation reconciliation rows. Terminology/testing/documentation principles are retained; styling, grids, modal layouts, translations and architecture are adapted; seed/API/authentication policies are explicitly omitted. The reasons distinguish presentation models/host callbacks from database seeds, endpoint schemas, credentials/login sequences, account operations and application locale catalogs. | The mapping is section-level, not an independently verified per-original-rule inventory. The original learner-platform AGENTS bytes at `8e63f1e16fc3d43d851908b312603a1099ca13d9` were not available or fetched in this batch. Root should reconcile every original rule to these rows or an explicit disposition before accepting the word **each**. This is a provenance/documentation gate, not a demonstrated runtime defect. |
| W-07 | **Fully supported for the requested canonical document, by retained source.** | [Canonical recipe](../react-aria-component-recipe.md), explicitly tagged W-07, contains observable contract/acceptance scope (step 1), owned props/native attributes/native refs (2), private React Aria mapping (3), generated tokens/compiled CSS (4), stories (7), behavior/composed/browser tests (8), exports (6), validation (9) and a final acceptance paragraph. Architecture and guidance mapping link to this one recipe. | Root may accept this bounded document criterion after review. This does not certify that every control implements the recipe or that its checks passed at this head. Step 9 still says full check/Storybook for code changes; the newer [development policy](../react-aria-development-validation.md) and user instructions authorize targeted dev validation. Coordinator owns reconciliation of that wording; this batch did not edit it. |
| W-08 | **Partial: rules and executable guards exist; fresh execution and broader prevention are not established.** | [Architecture](../component-architecture.md), AGENTS and the recipe prescribe owned contracts, production tokens, private interaction imports, compiled layered CSS and shared stories. `check-foundations.mjs` parses static module-reference forms, restricts interaction engines to registered implementations, walks reachable relative dependencies, rejects retired foundation/style references, validates `--sgui-*` variables in CSS Modules, requires `sgui.components` rules and rejects host selectors. `check-package.mjs` rejects named upstream types in emitted declarations and retired output/dependencies. `tokens.mjs --check` verifies generated outputs. `package.json` wires these checks into `pnpm check`. | No current-head pass is claimed. Source guards are deliberately bounded: unknown non-SGUI CSS variables/literal visual values and alternative styling dependencies are not generically forbidden by the shown checks; the token loop only matches `--sgui-*`. A blanket claim that every parallel styling system is prevented exceeds evidence. Root must decide the intended enforceable policy and validate it; any source work requires a separately assigned guard scope. Do not ban legitimate native host/layout styles merely to close this row. |
| W-10 | **Fully supported for source retention and added category coverage.** | All **33/33** original story paths from SGUI initial commit `21adebd61bedfc6a1ed395fe664ff4be83896821` exist as Git blobs at the inspected head; current source has **106** matching story files. Exact path/blob reconciliation below. New primitive, adapter, calendar and grid-helper examples have observable stories; `.storybook/main.ts` includes their locations through `../src/**/*.stories.@(ts|tsx)`. | Root may accept source retention/additional coverage after review. Retained paths do not prove every historical story export or behavior is unchanged. Story registration/runtime/a11y/rendering at this head remains UNRUN; broad X/K/G/U/R/Z and manual/device/AT acceptance is not closed by counts or filenames. |

## W-08 executable scope and retained test intent

Source inspection, not execution:

- `assertInteractionBoundary` reads imports, reexports, import types, side-effect imports, literal dynamic imports and require forms via TypeScript AST; registered interaction files may import React Aria/Stately. Relative dependency recursion extends enforcement beyond initially visited directories.
- `assertOwnedDeclaration` rejects named React Aria/Stately/react-types/MUI/Emotion/Lucide/TanStack references. The package checker audits root/public exports, recursive theme/experimental/catalog declaration directories and explicit internal owned grid declarations. It depends on fresh emitted output and is not a source-only proof that declaration generation passed.
- `react-stately-boundaries.test.mjs` retains negative cases for syntax variants, ordinary/transitive helper escapes and emitted declaration escapes, including tests calling actual checker functions/processes. `tokens.test.mjs` retains drift, alias/cycle/dimension/theme-pairing and contrast checks. `css-modules.test.mjs` retains stable/distinct names and compiled-layer checks. These are test **definitions**, not pass artifacts.
- Neither documentation rules nor name-based checks prove semantic absence of every possible upstream structurally copied type or all future styling systems. No such exhaustive claim is made.

If root determines broader executable enforcement is required, the minimal candidate handoff is `scripts/check-foundations.mjs` plus one new colocated script regression file and explicit `package.json` test registration only if needed. Root should first define permitted literal/layout/custom-property cases, then require meaningful negative/positive cases and targeted source/token/declaration checks. That is a policy/checker follow-up, not permission for this worker to alter shared guards. No native regression is appropriate for these four documentation/guard/inventory criteria, so no optional browser spec was created.

## W-10 category evidence

| Category | Retained source examples (not executed) |
| --- | --- |
| Public primitives | `src/components/primitives/primitives.stories.tsx`: `OwnedPublicForm` composes exported TextField, Checkbox, Select, Autocomplete, Menu, progress and reset with owned Provider. Individual proof stories remain under `src/experimental`. |
| Host adapters | `src/adapters/adapters.stories.tsx`: `Routing` demonstrates native fallback, replacement, cancellation, external/download/custom links and native ref focus; `AsyncAccounts` demonstrates host-controlled pending/success/failure. No account network or storage service is introduced. |
| Calendars | `src/experimental/Calendar/Calendar.stories.tsx`: `Single`, `Multiple`, `Unavailable`, deterministic February 2024 focus and owned Provider. DateRangeSelector, DatePicker, DateRangePicker and native-locale stories provide additional standalone/popover/range fixtures. This is not full K-11/K-17 acceptance. |
| Grid helpers | `ownedGridCells.stories.tsx`: `AllCellTypes`, `HostLocale`, `PublicTextWrapping`, `ColumnTextWrapping`, `ClipboardFeedback`; `ownedGridParts.stories.tsx`: `Interactive`, `EmptyStates`; `ownedGridProcessing.stories.tsx`: `Client`, `Server`. These exercise cells/status/sort/processing composition, without implying historical grid proof cases passed now. |

## Exact retained blobs

Every blob below resolves with `git rev-parse e43bf604be74e0daf731bc990e6c3097f05ed89b:<path>` and can be read with `git show e43bf604be74e0daf731bc990e6c3097f05ed89b:<path>`. Blobs establish exact retained source, not executed artifacts.

| Source path | Git blob at inspected head |
| --- | --- |
| `docs/agent-guidance-migration.md` | `cb414d84c958ee0096c5754245421ff593e2f5c9` |
| `docs/developer/react-aria-component-recipe.md` | `651d3a10138372c9863363426821efb86bc7d85e` |
| `docs/developer/component-architecture.md` | `802b8086c11e2c28460596214775653f75ac886d` |
| `AGENTS.md` | `11fa44a2628c9eb80cfebc595c5f31661b39a71b` |
| `scripts/check-foundations.mjs` | `ecc96a852355231cc7845642c589980825a6356d` |
| `scripts/check-package.mjs` | `744f86595899989d90edc6cf590a757534c58f17` |
| `scripts/tokens.mjs` | `ffdeac9ea13db3107fa90eb3760cfae743b38bb5` |
| `scripts/tokens.test.mjs` | `c06e8cbe72a0460ab9f54198bea95d3c74bf2b01` |
| `scripts/css-modules.test.mjs` | `5a7305d07b9a70a10e648c31c4ef6b34978d10a0` |
| `scripts/react-stately-boundaries.test.mjs` | `ea88ab4de1042005f99088c95b997460b27678bf` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `.storybook/main.ts` | `0774f805dda513b2422a02692c5f4ccec8d6c131` |
| `.storybook/preview.tsx` | `b84d33831293a155cc571eef6545d7deed67b683` |
| `docs/extraction-manifest.json` | `430d1211d1c2e0d5047da41eb2ced2ed745bbcf1` |
| `src/components/primitives/primitives.stories.tsx` | `d1a7e9d8ad11f2919b62a44e1c8a666efbac269e` |
| `src/adapters/adapters.stories.tsx` | `15efd81e03623931fc9ee89da1fbf791a2b9849f` |
| `src/experimental/Calendar/Calendar.stories.tsx` | `2981da5966743138fd31d51e98addcd0e2cc0c11` |
| `src/experimental/DateRangeSelector/DateRangeSelector.stories.tsx` | `882f1b89873ec379fa85aa07293ff17e5c45fcef` |
| `src/components/AppDataGrid/ownedGridCells.stories.tsx` | `161d47fd5971cebd8133c7d1ab4a48f3a4908826` |
| `src/components/AppDataGrid/ownedGridParts.stories.tsx` | `c1cee550ccdaa400a66a20652758172406a02f2e` |
| `src/components/AppDataGrid/ownedGridProcessing.stories.tsx` | `b4bd2f445154ff16cdbefbdf566c3d06e1f990ce` |

## Original 33 story paths

The initial commit is a local retained SGUI extraction baseline, not an independent fetch of learner-platform source. Comparing `git ls-tree -r --name-only` for both heads and filtering `\.stories\.(ts|tsx)$` gives original 33, current 106, missing-original set empty. The retained extraction manifest identifies learner-platform provenance separately. All rows below are **present/adapted at the same path**; no path replacement is needed. Path retention alone does not establish identical story exports or interactions.

| Original path (also current path) | Current Git blob |
| --- | --- |
| `src/components/AppButton/AppButton.stories.tsx` | `81d785a261d4b1a61b17939a682ce9a23e783039` |
| `src/components/AppDataGrid/AppDataGrid.stories.tsx` | `37e2735e11d6cbeed82277ce43f1fce36b4a05da` |
| `src/components/AppDataGridRowDnd/DataGridDragHandle.stories.tsx` | `8dc7d48e36d0cdd550ffb564c24f4a340b7412a8` |
| `src/components/AppDataGridShell/AppDataGridShell.stories.tsx` | `dc10ba9dbdaafb561cb9620c8075e1e8ec25d639` |
| `src/components/AppInlineProgress/AppInlineProgress.stories.tsx` | `bfa67fb39a4d9179648d7a4963c5d27d8e59802e` |
| `src/components/AppModal/AppModal.stories.tsx` | `82846596103dbcc3b8811b928837378b7a03cdae` |
| `src/components/AppOperationSteps/AppOperationSteps.stories.tsx` | `b5fdb5f0032a4fc61d74d9b2a22afffbd0b48303` |
| `src/components/AppPageHeader/AppPageHeader.stories.tsx` | `b177bf6fb6e98a97efe0fe45883e174e214d8aa1` |
| `src/components/AppPageTabs/AppPageTabs.stories.tsx` | `80d126e92b332677e5411e993ce2b187d3122225` |
| `src/components/AppShell/AppShell.stories.tsx` | `8e5cfa9ca9993aab05aeaea2e11ce8071daf6354` |
| `src/components/AuthShell/AuthShell.stories.tsx` | `060c10764521e39c5fe3aa4616fe84adfffe2678` |
| `src/components/CardPaginationFooter/CardPaginationFooter.stories.tsx` | `09b4e0241ef3c37072a523e6809e00dea5dc0615` |
| `src/components/ClassCardFrame/ClassCardFrame.stories.tsx` | `1beac35e231c57917824a4a61a8a84ff0d20cf1c` |
| `src/components/ColumnsLayoutModal/ColumnsLayoutModal.stories.tsx` | `e5a904704fee8974d5652fd63f5b6b59525cc184` |
| `src/components/ContentEditorChrome/ContentEditorChrome.stories.tsx` | `7e0aba0dacfeec9f6b43b1ca70bfd44087e3d4ad` |
| `src/components/DataToolbar/DataToolbar.stories.tsx` | `b134c9177e06c42cfdca5c4e8ecbd009d85e9aa1` |
| `src/components/DocumentEditorLayout/DocumentEditorLayout.stories.tsx` | `cd8c93f3a31d2502ea4abf24c2e311cab0ef10ae` |
| `src/components/DocumentEditorToolbar/DocumentEditorToolbar.stories.tsx` | `f1bb371752a5fbd80e7d1a0c43d9f604e227351d` |
| `src/components/EditableTitleField/EditableTitleField.stories.tsx` | `c87aa7429a3cbe3c1fb2595953954ce1296dafce` |
| `src/components/FloatingTextSelectionToolbar/FloatingTextSelectionToolbar.stories.tsx` | `bd2688d450f0f08b79074c11da7170d968b8f24e` |
| `src/components/ImageUploadModal/ImageUploadModal.stories.tsx` | `5871da39c92a59b2ab8f2ae1721b6fdd8a53a785` |
| `src/components/InsertContentMenuControl/InsertContentMenuControl.stories.tsx` | `ba442a30872db5da9ffce0841e1e9ca999abd7c7` |
| `src/components/InstructorClassCard/InstructorClassCard.stories.tsx` | `60381a68409f02ff804fa75cfe83a2d6dd82adfc` |
| `src/components/LearnerClassCard/LearnerClassCard.stories.tsx` | `d86cb85a2e5a2682f11884723a7b98f07d9be168` |
| `src/components/LearnerClassesDataGrid/LearnerClassesDataGrid.stories.tsx` | `eb6d52ecb6ff79d736e63d0d26bdbf858cd4981f` |
| `src/components/LinkUrlModal/LinkUrlModal.stories.tsx` | `31967c95399bfd7dda5ca6716cfba73bf5bea4c2` |
| `src/components/PageRichTextEditorSection/PageRichTextEditorSection.stories.tsx` | `9cbc57dc02373cd09604320618cc50d177dd2428` |
| `src/components/RichTextFormattingToolbar/RichTextFormattingToolbar.stories.tsx` | `c1a2eb6e7893852a6232ef5409b8df0815e3a39c` |
| `src/components/SideNavigation/SideNavigation.stories.tsx` | `0a0f2076215d166d5c749d2e9d977f2e92a5018e` |
| `src/components/TextAlignMenuControl/TextAlignMenuControl.stories.tsx` | `2d45daee056564d43562a44bb258fee538e59f53` |
| `src/components/TextColorPickerControl/TextColorPickerControl.stories.tsx` | `130c731e30d654348fc8246fbd14e940b8df8f59` |
| `src/components/TextStyleMenuControl/TextStyleMenuControl.stories.tsx` | `4c56e2b19177dbbe5a4ad658974b76efd0dc0cb9` |
| `src/components/Typefaces/Typefaces.stories.tsx` | `aca68f85eb8d0d0003a4bce37196d3a00abcad21` |

## Checks actually performed and evidence limits

Performed only Git/source/document reads: `git status --short`, `git rev-parse HEAD`, `git log --reverse --all -- docs/migration.md`, `git ls-tree` comparison for the two exact heads, `git rev-parse <head>:<path>` for every evidence blob, and targeted `rg`/file reads of mappings, recipe, architecture, validation policy, guard/test definitions, package scripts and selected story definitions. The Python comparison used Git output and did not run library tests or interpret story files as passing tests. Report-local relative links and recorded blob/path existence were checked; `git diff --check` checks report whitespace only.

No external learner-platform checkout, build artifacts, Playwright results, CI logs or temporary historical logs were retrieved or authenticated. Consequently no retained runtime artifact, engine version, build head, device or AT pass is attached. Historical execution-record prose and `/tmp` paths are not promoted to current evidence; artifacts may have been lost or expired. No Chromium/Firefox/WebKit matrix, physical input, screen-reader output, performance or full acceptance result is asserted. Root owns any requested validation window and final source/provenance reconciliation.
