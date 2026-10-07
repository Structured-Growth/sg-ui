# Batch 120 — K-12, K-16, K-17, E-01, E-02 acceptance evidence

Reviewed baseline: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (`codex/dev`).
Date: 2026-10-07. Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-120-evidence/sg-ui`.
Branch: `codex/batch-120-acceptance-evidence`.

This is a criterion-level read-only assessment at the pinned baseline, not an M-row inventory,
new runtime run, release acceptance or authority to check off parent criteria. The coordinator
alone owns acceptance and integration. Only this report changes. No optional spec is added:
inspection did not identify a missing native behavior that needs a distinct regression beyond
existing deterministic fixtures. Missing execution or manual evidence is not a production defect.

## Per-ID matrix

| ID | Assessment | Concrete current evidence | Remaining gate / owner |
| --- | --- | --- | --- |
| K-12 | **Partial; scope decision fully supported by retained documentation and source.** | [Calendar contracts](../react-aria-calendar-contracts.md#initial-scope-and-accessibility-limits) selects arbitrary multiple civil dates, alongside single dates/ranges/time/presets; defers comparison periods, computed fiscal rules and month/year-only selectors. A host may supply explicit fiscal preset endpoints. [Calendar](../../../src/experimental/Calendar/Calendar.tsx) owns a discriminated `selection: "multiple"` contract and uses internal Aria multiple selection; Gregorian values return as owned strings. [Unit case](../../../src/experimental/Calendar/Calendar.test.tsx) selects noncontiguous February 1/29 and removes February 1. | The selected behavior has an inspected assertion, not a fresh or retained executed result verified here. Coordinator should run the existing Calendar unit file and decide whether this proof plus the published scope satisfies the decision criterion. Broad advanced-release/device/AT acceptance is separate. No comparison/fiscal-engine/month-year implementation is requested by the retained decision. |
| K-16 | **Fully supported as a narrow publication criterion.** | [Calendar limits](../react-aria-calendar-contracts.md) explicitly state experimental proof status; defer recurrence, resource scheduling, booking persistence, fiscal calculation and comparison/month-year controls. Hosts supply availability and explicit presets; library does not calculate organization calendars. [Consumer migration limits](../../migration.md) repeat scheduling/recurrence/fiscal exclusions, and [README](../../../README.md) links these public contracts. The same document distinguishes internal interaction building blocks from host scheduling responsibility and enumerates unverified native/device/AT behavior. | Coordinator reviews publication wording and alone decides checkbox acceptance. This doc finding neither certifies runtime behavior nor closes the first advanced-release gates. No source handoff is needed. |
| K-17 | **Partial; designed non-hover access and retained Chromium preview proof.** | [Selector](../../../src/experimental/DateRangeSelector/DateRangeSelector.tsx) exposes visible preset paragraphs with `aria-describedby`, unavailable focused-date status/disclosure, and pending preview/context descriptions associated only with the focused cell. Native bridge merges/removes owned description IDs without replacing complete Aria date names. Standalone Calendar provides a keyboard/touch native disclosure even though its per-cell reason is a `title`. Existing [calendar native spec](../../../tests/browser/calendar.spec.ts) covers disabled preset descriptions, full date name, unavailable focus and Enter/Space disclosure. [Batch61 native spec](../../../tests/browser/batch61-keyboard-range-preview.spec.ts) covers anchor/focused endpoint/unchanged committed values, unavailable clamping and Cancel. Retained artifacts below prove only its historical light/dark Chromium 2/2; five selector/test/story blobs match the baseline. | No fresh current-head run here. Preview Firefox/WebKit, live spoken output/announcement timing and complete localized-calendar/device/touch matrix remain unverified by this retained shard. Historical calendar broad-run JSON is absent. Coordinator owns the existing native specs' execution window; manual AT owner must supply platform/version and observed output. DOM descriptions do not prove AT acceptance. |
| E-01 | **Partial; retained engine and owned visual composition supported by source.** | [Editor implementation](../../../src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx) still mounts LexicalComposer/RichTextPlugin/ContentEditable with existing namespace, registered nodes, editorKey and serialized host seed; renders owned dialogs/toolbar and token CSS Modules. [ImageNode](../../../src/components/PageRichTextEditorSection/lexical/ImageNode.tsx) uses owned Typography/CSS and retains image JSON fields. [Serializer](../../../src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.ts) normalizes internal `sgui-link` back to public `link`, traversing root/children only, retaining opaque asset metadata. [Serializer tests](../../../src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.test.ts) assert frozen input, metadata isolation, unknown node preservation and JSON roundtrip; [editor contract](../react-aria-editor-section.md) documents retained host JSON and intentional visual/source-policy changes. | Source inspection establishes Lexical retention and the serializer mechanism, not universal pre/post-migration document equivalence or fresh transitive/package boundary execution. Coordinator owns targeted serializer/configuration tests and relevant owned-boundary checks. A representative fixture cannot establish every consumer serialization combination; host document corpus and compatibility sign-off remain owner work. |
| E-02 | **Partial; named nodes/plugins retained, representative roundtrip assertions inspected.** | [Configuration](../../../src/components/PageRichTextEditorSection/lexical/editorConfig.ts) includes ImageNode, HorizontalRuleNode, code/highlight, heading/quote, list/list-item, link replacement and table nodes. [Experience plugins](../../../src/components/PageRichTextEditorSection/lexical/ExperienceEditorPlugins.tsx) retain History, Link, List, owned link activation, HorizontalRule, HorizontalRuleSelection, ImageInsert, Table and OnChange. [Image insertion](../../../src/components/PageRichTextEditorSection/lexical/ImageInsertPlugin.tsx) inserts image plus trailing paragraph and unregisters its command. [Rule selection](../../../src/components/PageRichTextEditorSection/lexical/HorizontalRuleSelectionPlugin.tsx) handles selected rules for Backspace/Delete. [Config roundtrip test](../../../src/components/PageRichTextEditorSection/lexical/editorConfig.test.ts) parses the saved fixture twice and compares JSON including rich nodes/metadata. [Native rich-document spec](../../../tests/browser/editor-rich-document.spec.ts) compares unchanged nodes after actual edit/reload/read-only, list Enter continuation/exit and rule Backspace/Undo. | No fresh execution here; old rich-browser JSON is absent. Full node/plugin/command/selection/history/merge-table/consumer-document matrix remains open as stated in the editor contract. Coordinator can reuse SavedRichDocument and existing unit/native specs; manual/device/AT and host-corpus owners must supply their evidence. No demonstrated source defect, hence no exclusive production fix allowlist is proposed. |

## Retained runtime artifact inspection

Inspected retained pool directory (read-only):
`/Users/thomashall/.codex/worktrees/batch45-shared-native-candidate/sg-ui/artifacts/browser-pool/80b00fee-f55f-45e8-88dc-4666223d88cc`.

- `evidence.json` identifies actual tested candidate `5cc976dc1b9af6ced3980ec0e93fe930a9a8237b`, source tree `b468c7d33f618c07690fc81cb362a8653df83c2a`, source digest `43bd8083dad4209f05ab036ef66e5107eadee96747ee37fa2307da8fc2d934e3`, Node `v24.19.0`, Darwin `27.0.0`, Chromium project and coordinator queue owner `01a1164f-41db-7f30-aaf9-f20133b6566f`. Root **status is failed** due to another scope. It is not a whole-candidate pass.
- `keyboard-range-preview/evidence.json` has status `passed`, exactly two light/dark cases of `batch61-keyboard-range-preview.spec.ts`, finished `2026-10-07T18:12:00.086Z`. `results.json` reports expected 2, skipped 0, unexpected 0, flaky 0, duration 3516.446 ms. The spec includes mandatory runtime diagnostics assertions.
- Root command records Storybook build and browser TypeScript checks before the shard. Shard build digest is `6978ebf422790330db7d1a041dfa973e0d3f01c06362a9afbefb43719c5a6ee0`. This assessment reads their records; it does not rebuild or independently recompute the build-directory digest.
- Git object comparison against that candidate confirms identical baseline blobs for DateRangeSelector implementation, CSS, unit tests, stories and Batch61 spec (table below). This transfers attribution for these exact files only, not the entire current dependency graph/build/runtime matrix.
- [Batch61 report](../parallel-batch-61/keyboard-range-preview.md) names worker `913b79d753d5f5b0495e144da95d9c1c918dd97b` and the candidate separately. Its `/tmp/sgui-batch45-candidate-wave30-attribution.json` is **absent** now. Current blob comparison and retained candidate records are the verified attribution here; the missing attribution file is not reconstructed.

Read-file SHA-256 values:

| Artifact relative to pool | SHA-256 |
| --- | --- |
| `evidence.json` | `90350686ab0cfbf59c7710d977eeacb54268f61dc303abaf8e5568c7e1d55c2d` |
| `keyboard-range-preview/evidence.json` | `6012d362e05ec35340ed467d5d36a7f42751aef36ae74e20f651965d3b39cce2` |
| `keyboard-range-preview/results.json` | `66d6c2993823c7fc8331c9c2f03bf8b05ac0f1614d6a9e8e16f62f9db703b0d5` |
| `keyboard-range-preview/browser.log` | `1855acb93089a1857c3146c5e8e43694a83b64fb32784702c945289fddc8f0a3` |

The older `/tmp/sgui-calendar-final-browser-results.json` and
`/tmp/sgui-rich-final-browser-results.json` are **absent** at inspection. The counts in
[historical browser acceptance](../react-aria-browser-acceptance.md) remain historical
narrative claims, not independently verified current-head results. Its calendar section
still says intermediate previews are open; the more recent contract/Batch61 record supports
a bounded preview implementation/proof, while broad K-17 remains open. No historical
Chromium/WebKit count becomes current full-matrix evidence, and local Firefox launch
failure does not prove Firefox behavior. No CI artifacts or expiration statuses were queried.

## Exact baseline Git blobs

Resolve any row with `git show e43bf604be74e0daf731bc990e6c3097f05ed89b:<path>`.
These are source/document identities, not tested-head claims.

| Repository path | Git blob | Same as retained preview candidate? |
| --- | --- | --- |
| `README.md` | `0af615ed0dc6984d08b57aed8eea8ecb8ddce9a4` | Not compared |
| `docs/migration.md` | `c16a7ab44e0533329f80d69c3c0c43db766e877f` | Not compared |
| `docs/developer/component-architecture.md` | `802b8086c11e2c28460596214775653f75ac886d` | Not compared |
| `docs/developer/react-aria-calendar-contracts.md` | `3a3c1a7efbad904f16155e9977768c375f4d2c94` | Not compared |
| `docs/developer/react-aria-editor-section.md` | `f97be4c1c517846bd71f76b50113426ae2fce712` | Not compared |
| `src/experimental/Calendar/Calendar.tsx` | `398c4d756b023c025d514a1b718d075ddec07c85` | Not compared |
| `src/experimental/Calendar/Calendar.test.tsx` | `1e05033848c3609b9e1556a8c3772e04139cf197` | Not compared |
| `src/experimental/DateRangeSelector/DateRangeSelector.tsx` | `0f570bbec2e6acafe464557fe471649fe3f23f44` | Yes |
| `src/experimental/DateRangeSelector/DateRangeSelector.module.css` | `b7052417e3fbdeef01f25540a3f1f11619404ca9` | Yes |
| `src/experimental/DateRangeSelector/DateRangeSelector.test.tsx` | `dd0e99e530e3575a5ba156e07b761ac0623b51a7` | Yes |
| `src/experimental/DateRangeSelector/DateRangeSelector.stories.tsx` | `882f1b89873ec379fa85aa07293ff17e5c45fcef` | Yes |
| `tests/browser/batch61-keyboard-range-preview.spec.ts` | `b94fc1cd689f7766aaa9d61f6d8d8c031e8cd110` | Yes |
| `tests/browser/calendar.spec.ts` | `6c41cdcd740ad4d96b2d7ee555eda4d18e8cd636` | Not compared |
| `tests/browser/editor-rich-document.spec.ts` | `e68b2de21dcf0776ad304138159e3eb4d7e3f096` | Not compared |
| `src/components/PageRichTextEditorSection/PageRichTextEditorSection.impl.tsx` | `09b1048767dcbe788779d59129382f33536e0b80` | Not compared |
| `src/components/PageRichTextEditorSection/PageRichTextEditorSection.module.css` | `eb123f89aeb360eb8394ab88be8d3b68774fe889` | Not compared |
| `src/components/PageRichTextEditorSection/PageRichTextEditorSection.stories.fixtures.ts` | `033d8e63ea4ec450f12cf717af8540883dbd4b0a` | Not compared |
| `src/components/PageRichTextEditorSection/lexical/editorConfig.ts` | `6c9b329f1830bf1bfd096026836794f82ee81905` | Not compared |
| `src/components/PageRichTextEditorSection/lexical/editorConfig.test.ts` | `6dfcbdcefc3f2d4af83017f10291377c192f3233` | Not compared |
| `src/components/PageRichTextEditorSection/lexical/ExperienceEditorPlugins.tsx` | `b3d03074cd809213192ea00b740f2f3abe42ff60` | Not compared |
| `src/components/PageRichTextEditorSection/lexical/ImageNode.tsx` | `3bb6ba024cc5f1b79cc66618fa03f03324e871ee` | Not compared |
| `src/components/PageRichTextEditorSection/lexical/ImageInsertPlugin.tsx` | `3b2568a6437b6adde2fee6eb76b357a86a3296fa` | Not compared |
| `src/components/PageRichTextEditorSection/lexical/HorizontalRuleSelectionPlugin.tsx` | `864d89c4baf89809ff14b396df1e9fa19133de34` | Not compared |
| `src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.ts` | `fa8fa6edf9429512493e8b8d08f7696c559be9f5` | Not compared |
| `src/components/PageRichTextEditorSection/lexical/serializeEditorDocument.test.ts` | `095f1d06509bc38698502519668482056b124112` | Not compared |

## Checks performed and bounded coordinator handoff

Performed only repository reads (`rg`, `cat`, `sed`, file inventory), baseline/head/status
inspection, Git blob identity comparisons, and Python reads/hashes/JSON parsing of retained
artifacts. Read the supplied AGENTS instructions and relevant README, migration/architecture,
calendar/editor contracts and historical evidence sections. No install, tests, builds, packs,
browser/performance run, lease acquisition or CI commands were performed. Existing test
assertions described above are **inspected / UNRUN in this assignment**.

Coordinator-owned proposed validation, using existing files and stories:

- K-12: Calendar.test.tsx noncontiguous selection/removal; no new browser spec needed from this inspection.
- K-17: calendar.spec.ts plus batch61-keyboard-range-preview.spec.ts against one coordinated fresh build for the accepted engine selection. Batch01 calendar coverage remains available for draft/reset/blur; do not duplicate its cases merely to create a Batch120 file.
- E-01/E-02: lexical/editorConfig.test.ts, serializeEditorDocument.test.ts, ImageNode.test.tsx, ImageInsertPlugin.test.tsx and HorizontalRuleSelectionPlugin.test.tsx; editor-rich-document.spec.ts uses the existing SavedRichDocument story for native reload/list/rule behavior. Relevant boundary checking remains root-owned.

All proposed executions require the coordinator window and are UNRUN here. The minimum
handoff is evidence/validation ownership, with no production source edits. If a coordinated
run reveals an actual behavior defect, root should create a bounded fix assignment with
its demonstrated failing scenario and an exclusive source allowlist. This report does not
invent a source defect, waive manual/device/AT gates, alter shared ledgers or mark any whole
parent complete. Report-only link/scope/whitespace checks precede the individual commit.
