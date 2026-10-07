# Batch 95: A-11–A-14 acceptance evidence

Inspected source head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (reviewed pushed
`codex/dev` baseline). Date: 2026-10-07. Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-95-acceptance/sg-ui`, branch
`codex/batch-95-acceptance`. Only this report is edited.

This assesses the four unchecked parent criteria in the
[master list](../react-aria-master-task-list.md), not
M-row completion or historical inventory acceptance. Recommendations below are
for the coordinator; no acceptance checkbox, ledger or production API is changed.
Git blobs below identify retained source evidence. **No runtime tested head or
fresh package artifact exists for this assignment.** Inspection head is not a
runtime tested head.

## Per-ID matrix

| Criterion | Disposition and concrete evidence at inspected head | Precise limit / coordinator gate |
| --- | --- | --- |
| A-11: owned collection/state/date/grid/event contracts | **Partial; inspected contract slices supported.** [Grid aliases](../../../src/components/AppDataGrid/types.ts) expose owned presentation columns, string IDs, native Set/Record and owned pagination; [column callbacks](../../../src/components/AppDataGrid/ownedGridColumns.ts) receive host rows/values, not engine cell parameters. [Processing](../../../src/components/AppDataGrid/ownedGridModel.ts) imports TanStack ColumnDef internally while declared owned columns/results contain host rows and owned records. [Date contract](../../../src/experimental/DateRangeSelector/date-contract.ts) uses ISO strings/range records; [Calendar](../../../src/experimental/Calendar/Calendar.tsx) converts private date classes to strings before callbacks. [Select](../../../src/experimental/Select/Select.tsx) returns string/null, [Menu](../../../src/experimental/Menu/Menu.tsx) returns item ID, and [Button](../../../src/experimental/Button/Button.tsx) exposes `onPress(): void`. [Architecture](../react-aria-architecture.md#owned-contracts), [calendar guide](../react-aria-calendar-contracts.md) and [grid migration](../react-aria-catalog-grid.md) explicitly review these mappings. | This is not an exhaustive emitted public-type graph audit. Coordinator must retain fresh exact-head emitted declarations and consumer/type-check result, including reachable internal types. Existing declaration regex rejects React Aria/Stately, TanStack and retired foundation types but **does not explicitly match `@internationalized/date`**; a successful existing guard alone cannot prove the date-class part. No actual public date-class leak was found in inspected slices. Review all emitted public date signatures explicitly or separately assign guard coverage if desired. |
| A-12: retain useful App names, no wholesale SG rename | **Fully supported for the narrow source naming criterion.** Root forwards the [component barrel](../../../src/components/index.ts); AppButton, AppDataGrid, AppDataGridShell, AppInlineProgress, AppOperationSteps, AppModal, AppPageHeader, AppPageTabs, AppPaginationFooter and AppShell remain. [Theme barrel](../../../src/theme/index.ts) retains AppThemeProvider. Comparison of historical explicit export clauses against current barrels found 64 distinct App/Class compatibility identifiers, with only AppGridSortModel absent. The [catalog guide](../react-aria-catalog-grid.md) documents its owned sortRules replacement; the [API reconciliation](../react-aria-public-api-reconciliation.md) identifies AppDataGridSortRule[] explicitly. Existing SGLink/navigation/translation adapters do not rename the App catalog. | This supports naming preservation, not old prop compatibility or migration acceptance. Package export manifest routes are source declarations, not imported artifacts; root owns final exact-head package verification. Removed upstream grid sort alias is an intentional contract migration, not a wholesale naming change. |
| A-13: remove branded public exports and document replacement | **Partial overall; source removal and migration documentation supported.** [Primitive barrel](../../../src/components/primitives/index.ts) exports owned Link/LinkProps. Root/components and `/primitives` forward that barrel. [Link implementation](../../../src/experimental/Link/Link.tsx) uses native anchor props/ref, owned tone/underline and host navigation. [Primitive guide](../react-aria-primitives.md) calls these breaking mappings and explicitly maps MuiLink/MuiLinkProps to Link/LinkProps. Read-only production-source scan found no Mui identifier or @mui/@emotion reference. Migration commit `98b4f9ff7b2aa6ededd88dd5fe30ecde169320a2` is titled `feat!: migrate public icons and primitives to owned foundation`. [Package consumer](../../../scripts/package-consumer.tsx) has a negative MuiLink import; [package checker](../../../scripts/check-package.mjs) rejects the runtime export and retired emitted text. | Negative fixture/checker existence is not a pass. Need current-head emitted and packed export/type verification, with retained output/artifact. Historical/legal references in baseline snapshots and notices remain provenance and are not branded API exports; no legal text is removed here. Broader Z-05/Z-06/Z-08 remain open. |
| A-14: Class compatibility, Course for new learning APIs, breaking removals | **Fully supported for the narrow inspected source naming criterion.** [Component barrel](../../../src/components/index.ts) retains ClassCardFrame and constants, InstructorClassCard/status/props, LearnerClassCard, LearnerClassesDataGrid and compatibility option exports. [Root](../../../src/index.ts) retains LearnerClass. [Admin presets](../../../src/components/AdminDataGridOptions.ts) and [instructor presets](../../../src/components/InstructorDataGridOptions.ts) add Course-named factories/status constants while exporting existing Classes/ClassLearners arrays. [Preset guide](../react-aria-grid-presets.md) documents their English compatibility/default versus translated factory roles; [migration guide](../../migration.md) says existing Class exports are not implicitly deprecated. Historical explicit export comparison found no removed Class-family identifier. | No Class-name removal was found, so no invented removal or breaking change is proposed. Preserved names do not certify unchanged upstream props, data contracts or behavior. Full package/host acceptance and future intentional breaking removals remain coordinator/owner responsibilities. |

## Retained artifact and historical evidence limits

This worktree has no `dist`, `storybook-static`, `test-results` or
`playwright-report`. No install, test, build, pack, browser, performance, CI or
validation-pool command was run. No browser spec was added: these criteria concern
public contracts/naming; no missing native regression was established that an
existing deterministic story would meaningfully prove.

The tracked [removal audit](../react-aria-removal-audit.md) records an earlier
1,632-file tarball with retained legal references and explicitly says it is not
final exact-head validation. The tracked [runtime record](../react-aria-runtime-ci.md)
identifies head `7f03a35108bbf861e9b123b646694f64b21bb369`, Actions run
`37560788949`, browser artifact `11456977272`, and a recorded expiry of
2026-10-21 02:18:34 UTC. These are **historical report claims**, not newly verified
availability/results. This assignment did not fetch remote artifacts or inspect
those `/tmp` captures. Their continued retention and exact contents are therefore
unverified here. Earlier Chromium/Firefox/WebKit, Node or React results do not
establish success at the inspected baseline.

Source naming and DOM/type mappings do not establish spoken assistive-technology,
manual review, physical-device/IME or broad native acceptance. The coordinator
alone accepts/integrates criteria; hosts retain navigation, persistence, datasets
and translation ownership. No whole A/G/K/E/U/X/R/Z parent is marked complete.

## Checks actually performed

- Read README, migration/component architecture guidance, root AGENTS.md and the
  four exact master criteria. `rg --files -g AGENTS.md` found only root AGENTS.md.
- Confirmed initial HEAD and local codex/dev resolve to the assigned full SHA and
  the initial checkout is clean. Created/attached the isolated managed worktree
  at that SHA before writing; switched it to the unique branch above.
- Read current public root/component/primitive/theme barrels, package checker and
  consumer fixture, owned grid aliases/columns/model/state/renderer, representative
  calendar/collection/action contracts and migration guides. This does not claim
  every public inferred type was followed transitively.
- Python parsed the tracked historical API JSON and extracted explicit export
  clauses from components/index.d.ts, theme/index.d.ts and index.d.ts; 64 distinct
  identifiers with App/Class-related prefixes were compared against current
  root/component/theme barrel identifiers. Only AppGridSortModel was absent.
  This lexical identifier comparison is source evidence, not compiled resolution.
- Python scanned non-test/non-story `.ts`/`.tsx` production files under src for
  `\bMui\w*|@mui|@emotion`: no matches. Inspected primitive and package export
  routing separately; no historical/legal documents were counted as active APIs.
- Read `git log` for the primitive barrel and verified the breaking migration
  commit/title above. Recorded exact baseline blobs below via `git rev-parse HEAD:path`.
- Verified report relative links resolve locally and `git diff --check` is clean.
  The final report commit SHA is supplied in the handoff rather than self-embedded.

## Exact retained Git evidence

All blobs are resolved from inspected head
`e43bf604be74e0daf731bc990e6c3097f05ed89b`; source links describe that snapshot,
not later coordinator changes. Historical baseline JSON itself describes
`21adebd61bedfc6a1ed395fe664ff4be83896821`.

| Evidence file | Git blob |
| --- | --- |
| `src/index.ts` | `4b0ea0e0ad7845f2a34e1820a490aa4b6986411f` |
| `src/components/index.ts` | `fd4f424ed4cb0a8ee3b7da1f70ccc3e06ec42122` |
| `src/theme/index.ts` | `32e4e1d82d1af0a7f10c51ed29d95ca4680ff444` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `src/components/primitives/index.ts` | `43de81eedf14f9fc4119ff29cf9ae99cb8245c4f` |
| `src/experimental/Link/Link.tsx` | `0eb6f15f598350a6b6e246eed3b7e59367dcae49` |
| `src/components/AppDataGrid/types.ts` | `aa61aad90e0d22b1f75addbf4b01c5fec63a5db7` |
| `src/components/AppDataGrid/ownedGridColumns.ts` | `5c5ae8541622c9689db5ed74d5eaf1c1c5f8f18d` |
| `src/components/AppDataGrid/ownedGridModel.ts` | `9aec70184dc15e297f247647a67b6667d6bb0051` |
| `src/components/AppDataGrid/ownedGridState.ts` | `9ef583ee584e484ef148952e6531a48635929073` |
| `src/experimental/DateRangeSelector/date-contract.ts` | `28fe61014fb64dbfa5e2c79dd433926548a75855` |
| `src/experimental/Calendar/Calendar.tsx` | `398c4d756b023c025d514a1b718d075ddec07c85` |
| `src/experimental/Menu/Menu.tsx` | `60ebffe51e492d220465271c2b783c422ccc716a` |
| `src/experimental/Select/Select.tsx` | `e4d05fbdef870aec23f46fbe34deef6bc723f62e` |
| `src/experimental/Button/Button.tsx` | `4969d84ac106e7346c8e054974d7d6a38a5d0cfc` |
| `src/components/AdminDataGridOptions.ts` | `2149e949bb429adb23281748490efa29979a76da` |
| `src/components/InstructorDataGridOptions.ts` | `6289bbe308424625e079db723ffd440176736691` |
| `scripts/check-package.mjs` | `744f86595899989d90edc6cf590a757534c58f17` |
| `scripts/package-consumer.tsx` | `d76357e13bbc26142f9bd21cb77091db4a0663e8` |
| `docs/developer/react-aria-primitives.md` | `e3d7832c63d99f33f312935b69d7447dc6268d6b` |
| `docs/developer/react-aria-grid-presets.md` | `113dfd8a046af272fc15563354bf8ed07dbc31ed` |
| `docs/developer/react-aria-removal-audit.md` | `0fcffdabebd08a1531bb8a16510a967157921482` |
| `docs/developer/react-aria-runtime-ci.md` | `9319d05492e47bcd15f751d3db7e042aa604fe0e` |
| `docs/developer/migration-baseline/public-api.json` | `26d82ff5765f1c667bc025e88ac107cc6f44ad99` |

## Coordinator handoff

No actual missing source behavior was identified within the inspected slices;
there is no proposed production source allowlist and no fix chat requested.
The remaining A-11/A-13 work is evidence: coordinator-owned fresh build/declaration,
package and packed-consumer inspection at the accepted integration head, retaining
artifact bytes/logs and checking public date types beyond the present regex.
Suggested targeted checks in that authorized validation window are the existing
foundation and package guards plus React 18/19 foundation consumers; **UNRUN here**.
A-12/A-14 source naming recommendations may be accepted independently of broader
runtime gates after root review. Preserve primary image-upload work and all other
worktrees; no merge/main/publication action was taken.
