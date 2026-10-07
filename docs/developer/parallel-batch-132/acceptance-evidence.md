# Batch 132: W-15–W-19 acceptance evidence

Read-only assessment on 2026-10-07 of reviewed baseline `e43bf604be74e0daf731bc990e6c3097f05ed89b`.
Managed isolated checkout: `/Users/thomashall/.codex/worktrees/batch-132-evidence/sg-ui`.
Only this report is changed. This examines documentation criteria, not completed
M-row inventory reviews, historical source audits or proof-control implementation.
The coordinator alone accepts criteria and updates the master list. No parent
checkbox is changed or whole migration acceptance claimed.

## Per-ID matrix

| Criterion | Conclusion at inspected head | Current evidence | Precise remaining gate |
| --- | --- | --- | --- |
| W-15 | Fully supported for the stated documentation criterion | [Read-only adoption checklist](../react-aria-adoption-checklist.md), opening scope and review list, Vite/Next compositions and rollout limits; [migration](../../migration.md), adoption section. Checklist explicitly prohibits assuming application editing/removal authorization and requires separate host rollout. | Coordinator acceptance only for this narrow criterion. Actual learner-platform adoption, host parity, device/AT and rollout remain separately authorized implementation work. No application checkout was edited or executed. |
| W-16 | Fully supported for current migration/provenance documentation and manifest filesystem reconciliation | [Migration](../../migration.md) preserves source repo/commit/root and clearly distinguishes extraction from owned architecture. [Manifest](../../extraction-manifest.json) retains `Structured-Growth/learning-platform`, `8e63f1e16fc3d43d851908b312603a1099ca13d9`, `apps/web/src/ui`; all 201 destination presence flags match current files, six absent entries have removal/rename metadata, and all 16 replacement paths exist. | Coordinator acceptance of this narrow criterion. Original source provenance is retained, not independently revalidated against the remote learner repository. Literal historical/legal removal and final package acceptance remain separate Z gates. Manifest is extraction history, not an exhaustive inventory of new library files. |
| W-17 | Partial | [Architecture](../component-architecture.md), [GitHub setup](../../github-setup.md), [commercial guide](../../commercial-licensing.md), [PR template](../../../.github/pull_request_template.md), [issue form](../../../.github/ISSUE_TEMPLATE/ui-change.yml), [troubleshooting](../../troubleshooting/validation.md), and three packed consumer generators (blob table). Source has owned contracts, CSS/scope, draft PR/release boundaries, packed fixtures and exact-head evidence limits. | Commercial guide still says full notices cover current direct runtime/peer packages while naming MUI/Emotion; those packages are absent from current package dependencies. Notices deliberately retain them and label React Aria as migration proof dependencies. Do not remove legal text without owner attribution review. Architecture validation paragraph still requests full check/Storybook for every code/build change, conflicting with current targeted dev policy. Root must reconcile final wording and legal/owner conclusions; fixture source existence is not current packed execution acceptance. |
| W-18 | Partial | [Migration](../../migration.md), adoption limits, documents grid/calendar/editor deferred capabilities, React/Node compatibility bounds, retained Class/App names (not implicitly deprecated), experimental limits, breaking release markers and React Aria replacement cost: focus/keyboard/collections/overlays/locale/dates, observable contracts, renewed browser/SSR/package/accessibility and license review. [GitHub setup](../../github-setup.md) states release impact; commercial guide places support in the written agreement. | No explicit final operational support policy/owner commitment is established. [Primitive mappings](../react-aria-primitives.md) explicitly says this documentation slice does not establish a new support policy. Root/owner must specify supported engines/devices/frameworks, compatibility/deprecation policy and support responsibility, or explicitly document that these remain undecided. Do not invent support guarantees or deprecate retained names. Device/IME/AT, broad rich-content trust and physical drag remain unverified. |
| W-19 | Partial; fresh bounded repository-wide link scan performed | Fresh tracked Markdown inline-link/path/heading scan, manifest paths and replacement scan, package script-token inspection, manual public theme/navigation examples inspection. Results below. No UI tests needed for this report. | One missing absolute temporary artifact link; eight heading anchor mismatches; all prose/backtick paths, reference-style links, commands with full arguments and exported example types across all documents still require complete validation. No compiler/example execution was permitted. Current-head build/browser/packed matrix is not claimed. |

## Fresh checks performed

Commands were read-only `git status --short`, `git rev-parse`, `git ls-files`,
`rg`/`rg --files`, `cat`/`sed`, and inline Python using only stdlib filesystem,
JSON, regular expressions and Git metadata. No dependency install, test, build,
pack, browser, performance, CI or shared lease command ran.

1. Parsed manifest JSON; compared each `present` boolean with
   `Path(destination).exists()`: **201 entries, zero mismatches**. Inspected six
   absent entries and checked every migration replacement: **16 paths, zero missing**.
2. Enumerated **216 tracked Markdown files**. Inline Markdown destination scan
   found **1,326 nonempty local paths**, **one missing**. Relative destinations
   resolve from their containing document; URL schemes are excluded. Missing link:
   `docs/developer/parallel-batch-41/learner-card-native.md:68` references
   `/tmp/sgui-batch45-candidate-source-attribution.json`, absent on this host.
   This is actual retained-artifact loss, not proof that its historical assertions failed.
3. Checked **82 local Markdown heading destinations**, including same-file links,
   by heading-derived GitHub-style IDs (lowercase, punctuation stripped, spaces
   replaced by hyphens, duplicate suffixes) and explicit HTML IDs. **Eight unresolved**:
   four master-list links and four same-file links in
   `react-aria-migration-inventory-acceptance.md`, for M-06/M-13/M-19/M-21.
   Each requested `m-NN-criterion-reconciliation-2026-10-07`; actual heading is
   `M-NN criterion reconciliation — 2026-10-07`. Removing the em dash retains
   two adjacent spaces, yielding `m-NN-criterion-reconciliation--2026-10-07`.
   These are link findings only; this report does not redo those M-row reviews.
   This heuristic is not a rendered GitHub/browser verification of every anchor.
4. Scanned `pnpm` first tokens in tracked Markdown against `package.json`
   scripts/builtins. **30 distinct tokens**; unmatched candidates were prose/version
   mentions and punctuation (`check:`, `build-storybook:`), not established missing
   executable commands. Full arguments, shell semantics, Node scripts, workflow
   context and all commands remain unverified. Read primary-doc commands against
   package scripts and current runtime/consumer generator files manually.
5. Read README, migration, architecture, adoption, GitHub setup, commercial guide,
   issue/PR templates, troubleshooting, removal/runtime/server records and fixture
   generator source. Checked `/theme` Provider/AppThemeProvider exports and adapter
   navigation shape against adoption examples: `pathname`, `navigate(href, {replace})`,
   Provider theme/density/dir mappings exist. Package declares used theme/adapters/
   AppButton/CSS subpaths. This is source inspection, not compiled example validation.

## Minimal handoffs (no edits made)

- W-17 wording: exclusive candidate allowlist `docs/developer/component-architecture.md`
  and `docs/commercial-licensing.md`; cross-check current dev policy, package dependency
  sections and preserved notices; verify links and `git diff --check`. Any notice
  disposition requires separate owner/legal scope, not automatic deletion.
- W-18 policy: exclusive candidate allowlist `docs/migration.md` after owner provides
  support responsibility/bounds. Check consistency with package peers/engine,
  acceptance limits, commercial agreement and breaking-name policy.
- W-19 link repair: candidate files `docs/developer/react-aria-master-task-list.md`,
  `docs/developer/react-aria-migration-inventory-acceptance.md`, and
  `docs/developer/parallel-batch-41/learner-card-native.md`. These are root-controlled
  or other-report files, so no worker edit is authorized here. Correct anchors or
  add stable explicit IDs; retain artifact-loss explanation rather than inventing
  the missing JSON. Re-run local path/anchor inspection and diff whitespace check.
  Root should assign remaining all-document examples/commands/path validation
  separately with an exact scope. No native regression proposed: these are docs
  criteria and no missing native behavior was identified.

## Evidence identity and retention limits

All blobs below are from the inspected baseline, not the new report commit.
Resolve with `git show e43bf604be74e0daf731bc990e6c3097f05ed89b:path` or
`git rev-parse e43bf604be74e0daf731bc990e6c3097f05ed89b:path`. The report's commit changes documentation only.

| Inspected file | Baseline Git blob |
| --- | --- |
| `docs/developer/react-aria-adoption-checklist.md` | `366a8e935fd912aedc1b98f60169821c086bf000` |
| `docs/migration.md` | `c16a7ab44e0533329f80d69c3c0c43db766e877f` |
| `docs/extraction-manifest.json` | `430d1211d1c2e0d5047da41eb2ced2ed745bbcf1` |
| `docs/developer/component-architecture.md` | `802b8086c11e2c28460596214775653f75ac886d` |
| `docs/github-setup.md` | `01e2aca71f153ec44ff6fce1b996577c71721116` |
| `docs/commercial-licensing.md` | `3a676fabaebdfc256855fc66aa53b8f95dc86f00` |
| `.github/ISSUE_TEMPLATE/ui-change.yml` | `3b626c2ee067a084c4cc4571d0dbcc50da151d30` |
| `.github/pull_request_template.md` | `9bf8035fcf121f4e67194a59fec7434af73ce236` |
| `docs/troubleshooting/validation.md` | `b2385442cd12388a55185f5c365fcf5d854ed213` |
| `docs/troubleshooting/firefox-profile-launch.md` | `bf2f8db98f53c51336eca3317385bf16ad841fd3` |
| `scripts/test-foundation-consumer.mjs` | `ff994cb7c9eaae3fbab58461c98ab0269a276c9c` |
| `scripts/test-next-consumer.mjs` | `5f45613658f5d40d8f5da4d76fb3de6babe529e3` |
| `scripts/test-editor-consumer.mjs` | `3acd1f927d7de3c882d3927ac7862683520bc57e` |
| `docs/developer/react-aria-runtime-ci.md` | `9319d05492e47bcd15f751d3db7e042aa604fe0e` |
| `docs/developer/react-aria-server-components.md` | `52750245160e7a0618483639eaefce58973e900c` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `src/theme/index.ts` | `32e4e1d82d1af0a7f10c51ed29d95ca4680ff444` |
| `src/adapters/index.ts` | `422639cc475322b63cfcc62bd4561deec463007d` |
| `docs/developer/react-aria-primitives.md` | `e3d7832c63d99f33f312935b69d7447dc6268d6b` |
| `docs/developer/react-aria-migration-inventory-acceptance.md` | `6688515f8ce8648dbcc3b5a5e025e2d8ef379473` |
| `docs/developer/react-aria-master-task-list.md` | `930c3c94d0d8b4a9c18e7528e860eabdb55ec5a1` |
| `docs/developer/parallel-batch-41/learner-card-native.md` | `5ec7d860a39c3d8423deb899cd3768e3891f9022` |
| `THIRD_PARTY_NOTICES.md` | `a5a5cdef430e435077f85c002f4c7398a09c4c62` |

Runtime record cites historical head `7f03a35108bbf861e9b123b646694f64b21bb369`,
[run 37560788949](https://github.com/Structured-Growth/sg-ui/actions/runs/37560788949),
browser artifact `11456977272`, with recorded expiration 2026-10-21 02:18:34 UTC
and temporary downloaded paths. This worker did not query Actions or download,
open or revalidate those artifact bytes; recorded retention is not present-day
availability proof. No historical run is promoted to baseline/full-matrix evidence.
There is **no tested head** for runtime in this assignment. The only checked head
is the baseline above for source/filesystem/document inspection. Manual screen-reader,
physical device, native IME, browser-engine matrix and live repository/npm/owner
settings are not verified. Existing exact-head runtime records retain their own
limits and do not close W or broad G/K/E/U/X/R/Z acceptance.
