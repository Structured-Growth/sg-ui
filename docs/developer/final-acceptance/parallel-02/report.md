# A-A-02 / A-A-03 acceptance reconciliation

Result: **A-A-02 complete; A-A-03 partial**. These are proposed leaf dispositions for coordinator reconciliation, not edits to shared acceptance counts. No implementation changes were authorized in this directory-only assignment.

## Evidence and execution boundary

- Branch `dev`, HEAD `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, existing modified/untracked checkout. Findings apply to the captured working bytes, not merely that commit.
- Read the current AGENTS, final-acceptance ledger, and full original leaf statements in `react-aria-hardening-tasks.md:152–153`; reviewed architecture, README and migration guidance. Historical open/checked states were not treated as closure.
- Reused FA-02's `2026-10-16-source-inventory.json` (captured `2026-10-16T22:23:01.865Z`) and `fa02-foundations.txt`. Reused the successful foundation/token and guard-test stages in `fa04-original-check.txt:6–57`; that command later failed unit tests, so this is not a claim that the entire original check passed. FA-04's corrected affected tests and output equality remain retained evidence rather than new runs here.
- New bounded analysis: `node docs/developer/final-acceptance/parallel-02/analyze.cjs` from repository root. `graph-check.txt` records the summary; `graph-evidence.json` records timestamp, hashes, source cycle edges/lines, and supporting-input comparisons. The script reads source and writes only this directory. It reuses saved imports for unchanged files and adds AST classification of explicitly type-only named imports/reexports, which the original inventory did not represent fully.
- All **424 production TS/JS input hashes match FA-02**. This set excludes tests, native fixtures and stories. There are **1,608 module references**, **1,146 resolved internal production edges**, **zero unresolved non-CSS/JSON relative references**, and **zero computed module references**. No root import was found. Architecture, guard, guard-test, build and TS configuration hashes match FA-02; the shared hardening checklist has changed, and was read in its current form.
- No suites, installs, builds, servers, browser/device/AT checks or release actions ran. This source-graph evidence does not establish native behavior, bundle weight, actual emitted module evaluation, or conformance. Existing inventory/output snapshots were not regenerated.

## A-A-02 — complete

Original obligation: “Establish layers: tokens/styles; native presentation primitives; interaction primitives; composed UI; optional grid/editor/learning extensions; host adapters.”

Each requested role has an established architecture contract and corresponding source boundary:

| Requested layer | Contract and concrete source evidence |
| --- | --- |
| Tokens/styles | `react-aria-architecture.md:25–46`, `component-architecture.md:14–35`; `packages/ui/src/foundation/tokens.json`, generated token files, `ThemeScope.tsx`; generated `tokens.css:2–3` establishes `sgui.tokens, sgui.components`; CSS modules and `scripts/check-component-css.mjs:78` enforce component-layer placement. FA-02 guard and FA-04 token/CSS guard tests supply retained execution evidence. Token-cycle validation is distinct from source-cycle detection. |
| Native presentation primitives | `packages/ui/src/experimental/Box/Box.tsx`, Typography, Stack, Surface and Divider implementations use owned/native contracts and compiled modules; public aliases route through `src/components/primitives/index.ts` and `src/primitives/index.ts`. Presentation is an architectural role, not the entire experimental directory. Box imports React and its CSS module, without an interaction-engine import. |
| Interaction primitives | `src/components/Button/Button.tsx`, `src/experimental/TextField/TextField.tsx`, DateField, Calendar and other registered implementations own the interaction mapping. `scripts/check-foundations.mjs:9–51` registers permitted interaction files and uses AST module references. `scripts/react-stately-boundaries.test.mjs` has positive and negative guard cases; their prior passing execution is preserved in FA-04. A-A-04's exhaustive interaction/public-contract review remains separate. |
| Composed UI | AppModal, AppShell, AppPageHeader/Tabs and SideNavigation under `src/components` compose owned controls. Architecture explicitly sets composition → controls → foundations. Directory location alone is not a layer: Button is an interaction implementation under components. |
| Grid/editor/learning extensions | `src/components/AppDataGrid/ownedGrid*`, `src/experimental/DataGrid`, PageRichTextEditorSection, editor toolbar/layout components, LearnerClassesDataGrid and class-card compositions implement the specialist roles. Architecture explicitly retains one package with granular public subpaths rather than requiring separate packages. The graph's one coarse specialist candidate is `experimental/DataGrid/DataGrid.tsx:3` importing TanStack; it is correctly a specialist implementation, not a basic-control inversion. |
| Host adapters | `src/adapters/navigation.tsx`, navigationContext, Link and accounts; `src/i18n/index.tsx`; models/hooks provide owned host integration. Low-level foundation/adapter/i18n/utils modules have no imports into components/experimental/theme/primitives/icons in the audited production graph. Hosts retain routing, account and data ownership. |

The complete disposition is limited to **establishing these layers**. It does not close general enforcement (A-A-03), basic-control payload isolation (A-A-18/A-R-04), editor dependency packaging (A-E-08), or all component behavior gates. No successor is required for A-A-02's named obligation; preserve the role-based mappings when adding controls.

## A-A-03 — partial

Original obligation: “Define one-way dependency boundaries; prevent root-barrel imports from internal implementations and prevent circular imports.”

The direction is defined in `react-aria-architecture.md:25–46` and `component-architecture.md:27–35`. The audited graph has **zero internal package-root imports** and **zero strongly connected components using only value-bearing syntax**. Type imports are removed only when explicitly marked; this is a conservative source classification, not a bundler claim.

Three unresolved **source** strongly connected components remain. Each has one explicitly type-only return edge, so none is an observed runtime cycle:

| Cycle | Exact edges |
| --- | --- |
| Navigation context | `src/adapters/navigation.tsx:3` imports `./navigationContext`; `src/adapters/navigationContext.ts:3` imports type `SGNavigationAdapter` from `./navigation`. |
| DateField | `src/experimental/DateField/DateField.tsx:11` imports `./TextDateField`; `src/experimental/DateField/TextDateField.tsx:5` imports type `DateFieldProps` from `./DateField`. |
| TimeField | `src/experimental/TimeField/TimeField.tsx:3` imports `./TextTimeField`; `src/experimental/TimeField/TextTimeField.tsx:3` imports type `TimeFieldProps` from `./TimeField`. |

All paths in that table are relative to `packages/ui`. All internal SCC edges, their kinds and hashes appear in `graph-evidence.json`. There is no documented explicit exemption for these type-only source cycles in the inspected layer rules; do not silently treat “no runtime cycles” as fulfilling the full unqualified circular-import obligation.

Enforcement remains incomplete:

- `scripts/check-foundations.mjs:68–70` rejects a textual subset of root imports during selected directory visits: `from` forms using package root or exactly `../index` / `../../index`. It does not resolve module targets, cover all depths or `.ts` forms, or match side-effect/dynamic/import-type forms. Its transitive walk does not apply this root-import assertion. Current absence of a violation therefore does not establish prevention.
- `auditDependencies` at approximately lines 89–108 uses one `audited` set and returns immediately for visited modules. It has no active-stack/SCC check and cannot reject cycles. Token-cycle tests verify token aliases, not this source graph.
- React Aria allowlisting and retired-dependency checks are valuable retained safeguards, but they do not encode general role-to-role dependency direction or prohibit a basic module from importing a specialist. The graph's low-layer and specialist checks are bounded evidence, not an exhaustive production enforcement rule.

### Specific successors

1. **AA03-S1 — source cycle policy and extraction.** Move navigation contract types into an independent leaf module and reexport from the existing public surface. Likewise move DateFieldProps and TimeFieldProps to independent contract modules and update both implementations to import those modules. Preserve public exports and native refs. Alternatively obtain an explicit architectural decision on whether type-only cycles are permitted; no such waiver is assumed here. Acceptance: source SCCs empty under the approved policy, public API typing unchanged, relevant existing component/adapter tests pass.
2. **AA03-S2 — resolved root-barrel and cycle guard.** Extend the maintained guard with TypeScript-resolved module references and SCC/active-stack detection across maintained production source, including unreachable files. Reject any internal edge to `src/index.ts` or the package root regardless of syntax/depth, and enforce the chosen type-cycle policy. Add bounded positive/negative fixture cases for renamed/deep index paths, import-type, dynamic/side-effect imports, two/three-node cycles, and ordinary acyclic reexports. Reproduce the current gap by reading the existing visited-set walk; reproduce current cycles with the supplied script. No shared mutation was performed to inject failures.
3. **AA03-S3 — enforce role direction.** Encode an explicit role map for foundation, presentation, interaction, compositions, specialists and adapters, with documented entries for Button, Provider and the experimental DataGrid. Reject lower-layer → composition/specialist edges and transitive specialist reachability from basic controls while permitting specialist → owned-control and public facade reexports. Add meaningful rejected-inversion fixtures. Preserve existing React Aria/token/retired-foundation checks. Reconcile with A-A-18/A-R-04 rather than treating package-wide root exports as a basic implementation import.

The coordinator should retain A-A-03 open until these prevention obligations are implemented and validated. No shared checklist, ledger, source or generated output was edited here.
