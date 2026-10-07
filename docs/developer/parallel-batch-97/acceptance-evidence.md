# Batch 97: licensing acceptance evidence (L-03–L-06)

Inspected head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (reviewed
`codex/dev` baseline). Date: 2026-10-07. This report changes no acceptance
checkbox, commercial term, notice, dependency, source, or shared configuration.
The coordinator owns acceptance and integration.

## Per-ID evidence matrix

| ID | Disposition at inspected head | Concrete support | Precise remaining gate / handoff |
| --- | --- | --- | --- |
| L-03 | Fully supported for the repository requirement to preserve and distinguish terms | [LICENSE](../../../LICENSE) §§1–3 require a written commercial agreement for original SGUI materials; §7 excludes separately licensed third-party rights from commercial restrictions. [README](../../../README.md) prominently states commercial licensing; [package metadata](../../../package.json) uses `SEE LICENSE IN LICENSE` and includes LICENSE/notices in its file list. Notices explicitly distinguish SGUI wrappers/styles from Adobe, TanStack and Lucide code. | This establishes the stated source/document boundary, not enforceability, publisher identity, customer agreement coverage or final publication. [Commercial licensing](../../commercial-licensing.md) explicitly requires counsel review before publication/customer use. Its MUI/Emotion examples and LICENSE §7 dependency examples remain stale; inventory wording belongs to the bounded legal reconciliation, without weakening §7. |
| L-04 | Partial; actual notice reconciliation missing | [Notices](../../../THIRD_PARTY_NOTICES.md) retain full MIT text for five retired packages, Apache-2.0 text, TanStack MIT and Lucide ISC/Feather MIT. Current package/lockfile contain the owned dependencies. [Removal audit](../react-aria-removal-audit.md) explicitly preserves retired notices pending provenance review and leaves Z-06/Z-08 open. | Notices still call TanStack an experimental grid dependency and Adobe packages migration proofs. Their opening claims a current direct inventory while listing retired Emotion/MUI sections. Final shipped direct/transitive/code/asset inventory and removal disposition are absent. Root may assign exclusive edits to `THIRD_PARTY_NOTICES.md`, `docs/commercial-licensing.md` and, only with legal-owner review of stale examples, LICENSE §7; preserve all substantive commercial terms and required upstream notices. Compare resolved package license/NOTICE files with the exact final tarball, retained byte hashes and asset/source provenance before removing any retired section. No deletion is authorized by this report. |
| L-05 | Supported for current source replacement; final distributed-artifact scope partial | Every one of 95 `src/icons/*Icon.tsx` files reexports its experimental equivalent. All 95 uppercase-named experimental icon modules import named vectors from `lucide-react`; `activityTypeIcon.tsx` composes five such modules. [createVector](../../../src/experimental/icons/createVector.tsx) wraps the supplied component and contains no copied vector geometry. [Icon mappings](../react-aria-icons.md) records symbols; notices retain Lucide ISC and Feather MIT obligations. No tracked SVG/raster/font asset paths were found. Source/package/lockfile search found no retired package imports or paid-grid packages. | Final emitted/package inventory remains necessary: source text and absence of tracked asset files cannot prove that arbitrary copied geometry or generated/untracked assets never enter a final distribution. Use existing emitted/tarball guard and source-to-asset provenance review at the final head. Keep notices until that review establishes retired assets/code are absent; no icon source fix or native regression identified. |
| L-06 | Partial; selected-engine licensing decision supported | [Grid decision](../react-aria-grid-decision.md) names L-06, selects TanStack Table 8.21.3 with React Aria 1.21.1, assigns ownership, and explicitly says both TanStack packages use MIT, no commercial feature tier is used and no Enterprise dependency is added. TanStack MIT text in notices includes distribution/sublicensing rights independently of SGUI terms. Current grid imports confirm those engines; package/lockfile contain no MUI X Pro/Premium, AG Grid Enterprise or license-key dependency. | The retained candidate comparison covers React Aria/TanStack capabilities, not an explicit retired Community/Enterprise tier and redistribution comparison. Decision first appears in the same implementation commit `51734ed691ac2b6c383b70c5152e32c1c22f33e5`; an independently retained decision *before* selection is not established. Root may assign only `docs/developer/react-aria-grid-decision.md` to record legacy Community versus paid tiers, selected MIT redistribution obligations and deferred features, with exact version license evidence and owner review. Do not fabricate historical sequencing or infer paid tier acceptance from feature names. No engine change is indicated. |

## Exact retained Git evidence

Every blob below was resolved using `git rev-parse HEAD:<path>` at the inspected
head. These are retained Git source artifacts, not test runs or release tarballs.

| Path | Git blob |
| --- | --- |
| `LICENSE` | `9dbc843502f2b1e8f74ed4c4940c471e7cca8acd` |
| `README.md` | `0af615ed0dc6984d08b57aed8eea8ecb8ddce9a4` |
| `docs/commercial-licensing.md` | `3a676fabaebdfc256855fc66aa53b8f95dc86f00` |
| `THIRD_PARTY_NOTICES.md` | `a5a5cdef430e435077f85c002f4c7398a09c4c62` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `pnpm-lock.yaml` | `d312a82ec958b0badc4633899ec4510cbb655648` |
| `docs/developer/react-aria-architecture.md` | `66280bea05b7f70b0e1bcc9e4b2388add91de97a` |
| `docs/developer/react-aria-grid-decision.md` | `cf388695dc6ef491bbf64145ceb89bc570a4dd1f` |
| `docs/developer/react-aria-icons.md` | `f2524b342566b5727f41267a9990eb405c0a6f32` |
| `src/icons/AddIcon.tsx` | `2f46828d45cba8d5a8b656b05056a07d8f63151b` |
| `src/experimental/icons/AddIcon.tsx` | `09ec4625fbdf1ecd80ce7f85e99c75f55522026f` |
| `src/experimental/icons/createVector.tsx` | `96de9b9204544bce519a2d32564d1e8a65355a93` |
| `src/components/AppDataGrid/ownedGridModel.ts` | `9aec70184dc15e297f247647a67b6667d6bb0051` |
| `src/components/AppDataGrid/ownedGridInteraction.tsx` | `c44cfd77b60afb1ad970351e6aaa9c34feb15473` |
| `scripts/build.mjs` | `c6e328b74748cda5090c2cf2ccbc582944a7df2d` |
| `scripts/check-package.mjs` | `744f86595899989d90edc6cf590a757534c58f17` |
| `docs/developer/react-aria-removal-audit.md` | `0fcffdabebd08a1531bb8a16510a967157921482` |

## Checks actually performed and evidence limits

Read README, migration guidance, component architecture, LICENSE, commercial
guidance, notices, dependency policy, icon mapping/wrappers, grid decision/current
imports, build script and packed-output guard. Read package/lockfile dependencies;
searched source/package/lockfile for `@mui`, `@emotion`, `material-ui`, `ag-grid`,
`handsontable`, `licenseKey` and `LicenseInfo` (no matches). Enumerated all public
icon reexports and experimental vector imports with read-only Python; inspected
the activity-helper exception rather than treating it as a vector. Enumerated
tracked image/font suffixes with `git ls-files` (zero paths). Read grid-decision
history and its first committed version; its license paragraph is retained in
that first implementation commit. Resolved the exact blobs above.

The build script emits per-file TypeScript modules and compiled styles; it does
not bundle upstream package code. This narrows, but does not eliminate, the
transitive consumer distribution/license inventory. The packed-output guard
checks retired references and byte equality for LICENSE/notices/README and emitted
files; it does not validate complete upstream licenses or asset provenance. Its
script existence is not a passing execution result.

No install, unit suite, browser, build, pack, performance or CI job was run.
Tested head: **none**; inspected source head is stated above. No browser engine,
device, manual or assistive-technology acceptance is claimed or required to
establish these narrow documentary findings. No optional browser test was added:
a native UI test cannot resolve legal inventory or historical decision timing.

The removal audit describes an earlier 1,632-file tarball and earlier dist audit;
this assignment did not inspect those bytes, recover an artifact/hash or establish
their exact tested head. That historical narrative cannot certify the current
head or replace lost/non-retained artifacts. Final shipped inventory requires
coordinator-scheduled exact-head packaging and retained output, with legal-owner
review. L-01/L-02/L-08, Z-06/Z-08 and broad parent acceptance remain independent
open gates; this report does not update them or mark the L parent complete.
