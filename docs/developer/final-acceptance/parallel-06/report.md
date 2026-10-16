# App/Class naming and branded-export acceptance

Assigned leaves **A-A-12, A-A-13 and A-A-14: complete**, within their original naming/migration scope. These are recommendations for coordinator reconciliation; no shared checkbox or count was changed. Original requirements are `react-aria-hardening-tasks.md:162–164` and `react-aria-scope-ledger.md:132–134`. Historical checked status was not used as proof.

Evidence is the modified `dev` checkout at base/head `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, not a committed final distributable. Capture time and reference SHA-256 hashes are in [evidence.json](evidence.json). The historical `migration-baseline/public-api.json` and `package.json` remain untouched. [check-names.cjs](check-names.cjs) parses historical declaration exports with TypeScript, follows relative wildcard reexports, and compares each of the eight historical JS entry routes with FA-01's checker-resolved runtime/declaration inventory. No unresolved historical wildcard exists. It also scans every one of FA-01's 238 concrete current entry paths for retired public branding.

## A-A-12 — Retain useful App names

**Complete.** Of 45 historical App-prefixed root values/types, 42 remain. Each historical entry route retains its App names except the following deliberate changes:

| Historical export | Current mapping | Evidence |
| --- | --- | --- |
| AppButton / AppButtonProps | Button / ButtonProps; no compatibility alias | `react-aria-button.md:57–65`; `components/index.ts:1`; `primitives/index.ts`; [breaking commit receipt](button-breaking-commit.txt) |
| AppGridSortModel | AppDataGridSortRule[] with sortRules/onSortRulesChange | `react-aria-catalog-grid.md:43–49`; `react-aria-grid-contracts.md:61`; `components/AppDataGrid/index.ts` |

The first removal is expressly authorized in current AGENTS and documented before the first release. Commit `540f47d` includes both `feat!` and `BREAKING CHANGE: Remove AppButton and AppButtonProps`, with the owned replacement named. Button/ButtonProps are confirmed on root, `/components`, `/components/Button`, `/primitives` and `/experimental` in the saved declaration inventory. No entry retains AppButton/AppButtonProps. The second removal replaces an upstream sort-model type, rather than renaming an action/component; it has a concrete breaking mapping.

AppDataGrid, AppDataGridShell, AppInlineProgress, AppOperationSteps, AppModal, AppPageHeader, AppPageTabs, AppPaginationFooter, AppShell and AppThemeProvider remain public. AppDataGridRowDnd and CardPaginationFooter are historical directory names, not removed public component names: the baseline exposes DataGridDragHandle/useDataGridRowDnd and AppPaginationFooter respectively. The same public names remain. Existing SGAccount/Navigation/Translation adapters and SGLink remain: no new SG-prefixed root export exists relative to baseline, and there is no wholesale SG component rename.

Tests/evidence: retained `fa01-package.txt` and `fa04-package.txt`, `scripts/check-package.mjs:90–132`, and the new route/name assertions in `check-names.cjs`. This establishes name/export preservation, not compatibility of every old prop signature. **Successor outside this leaf:** A-B-05/A-Z-13 must reconcile full API signatures and all intentional breaking prop changes; retain the two explicit removal mappings above in release/adoption review.

## A-A-13 — Replace retired branded public names

**Complete.** Historical branded names are MuiLink and MuiLinkProps on root, `/components` and `/primitives`. Both are absent on every current entry. The scan of all 238 entry declarations finds zero names matching Mui, Emotion or Material UI branding (case insensitive). FA-02's source/dependency scan and the retained package guard provide broader implementation-reference evidence; this leaf does not redo or claim the legal/historical purge.

`react-aria-primitives.md:10–17,29` explicitly labels the primitive migration as breaking and maps MuiLink/MuiLinkProps to Link/LinkProps with native anchor ref and host navigation adapter. The same owned replacement is present on root, `/components`, `/primitives` and `/experimental`. Source: `components/primitives/index.ts:9`, `experimental/Link/Link.tsx:6–19`, `adapters/Link.tsx`, `adapters/navigation.ts`. Link owns declared native anchor props, href/replace/external, underline/tone and theme styles; SGLink is the existing host-routing adapter, not retired branding. Hosts load styles.css and provide the documented owned scope.

Tests/evidence: `experimental/Link/Link.test.tsx` covers internal adapter routing/native refs/modified clicks/cancellation, native external links/protective rel values and custom host links. `adapters/navigation.test.tsx` covers fallback native activation, forwarded attributes/replace/ref/cancellation and host pathname updates. These tests' unchanged inputs retain FA-04 unit evidence, not fresh browser execution. `scripts/check-package.mjs:52–59,126–128` rejects retired output references and runtime MuiLink exports; the saved package transcript passes. New assertions confirm Link value/LinkProps type availability and removed MuiLink names.

**Successors outside this leaf:** A-Z-08 and legal leaves retain historical/provenance/notice reconciliation; do not delete the old snapshots' MuiLink text. A-B-05/A-Z-13 retain detailed anchor prop-signature and release migration reconciliation. No missing branded-export implementation was found.

## A-A-14 — Class compatibility and new Course terminology

**Complete.** All 22 historical Class-related root names remain, and none disappears from any historical entry route. This includes ClassCardFrame, InstructorClassCard, LearnerClassCard, LearnerClassesDataGrid, LearnerClass, ClassesViewMode, ClassIcon, width constants and legacy admin/instructor/learner Class-named option exports. The only added Class-named exports are ClassCardFrameProps, LearnerClassCardProps and LearnerClassesDataGridProps: types for existing compatibility components, not new learning-domain APIs.

The six new learning exports use Course naming: adminCourseStatuses, instructorCourseStatuses, instructorCourseLearnerStatuses, createAdminCourseGridOptions, createInstructorCourseGridOptions and createInstructorCourseLearnersGridOptions. Source: `components/AdminDataGridOptions.ts`, `components/InstructorDataGridOptions.ts` and `components/index.ts`. `models.ts` retains LearnerClass with courseName rather than inventing a new Class domain model. Existing host column IDs such as className and translation identifiers remain compatible data identifiers, not newly introduced presentation API names.

`docs/migration.md:73–75,108–109,131–133`, `react-aria-architecture.md:58–60` and `react-aria-grid-presets.md:3–15` state the policy, retain English Class compatibility defaults, and explain localized fresh Course factories. Intentional Class-name removals: **none**, so no missing Class removal mapping exists. Future removals still require documented breaking migration and release markers.

Tests/evidence: `components/AdminDataGridOptions.test.tsx` checks factory freshness, translations/fallback/namespace, canonical statuses, no fabricated All filter and column locks. Existing ClassCardFrame, InstructorClassCard, LearnerClassCard and LearnerClassesDataGrid colocated smoke tests remain FA-04 evidence; their behavior was not rerun merely to confirm names. Retained package tests invoke Course factories through public exports; new assertions check every historical Class name plus the exact six Course additions.

**Successor outside this leaf:** A-B-05 must preserve legacy host data identifiers while reconciling signatures; use Course terminology if future domain APIs are added. No missing Course naming implementation or Class compatibility export was found.

## Checks and evidence limits

Executed `node docs/developer/final-acceptance/parallel-06/check-names.cjs` from repository root: **exit 0**, all bounded naming assertions passed. Saved stdout is `evidence.json`. Reproduce to stdout or redirect only within this owned directory. This is a source/snapshot reconciliation check, not a library/browser/consumer suite.

The check validates 1,778 existing output hashes against FA-01: **zero changed/missing output files**. Saved library source hashes show exactly the four calendar fixture/test deltas already recorded in `fa04-library-input-delta.json`, with identical before/after hashes. There are no new deltas affecting these naming contracts, so FA-01–04 results are reused. No dependency install, rebuild, package audit rerun, broad suite, browser suite, consumer matrix, server operation, Git mutation or release action was performed.

FA-04's original full command failed nine cases in four calendar suites; it is not described as green. Its corrected affected rerun and unchanged passing cases support the retained unit baseline. Package checks establish published routes and owned declarations; DOM-emulated tests establish only their asserted behavior. Nothing here certifies physical devices, native browsers, spoken AT, all prop compatibility or production readiness. The 20 editor V leaves and all unrelated acceptance leaves remain open. Any later relevant barrel/manifest/source/output change invalidates the corresponding saved name conclusions until reconciled.

Only this conversation's `docs/developer/final-acceptance/parallel-06/` was written. The coordinator should inspect these receipts before updating shared leaves/counts.
