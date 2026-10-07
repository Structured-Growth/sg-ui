# Batch 126 — release-policy acceptance evidence

Reviewed head: `e43bf604be74e0daf731bc990e6c3097f05ed89b` (assigned pushed `codex/dev` baseline).
Inspection date: 2026-10-07, America/Chicago. Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-126-release-evidence/sg-ui`.
Branch: `codex/batch-126-release-evidence`. Exclusive write: this report.
No source, shared guidance, ledger or acceptance checkbox was changed. Root alone
accepts and integrates evidence. This is a fresh source/ownership assessment of
R-14/R-15/R-16/R-18/R-19, not another component inventory or a new full-matrix run.

## Per-criterion matrix

| ID | Assessment at reviewed head | Concrete supporting evidence | Precise remaining gate |
| --- | --- | --- | --- |
| R-14 | **Partial: source policy and retained tests supported.** | [Release config](../../../release.config.mjs) selects Conventional Commits; [release-policy tests](../../../scripts/release-policy.test.mjs) contain four tests covering fix/perf patch, feat minor, both major markers, maintenance no-release, highest impact, and title validity. [Title workflow](../../../.github/workflows/pr-title.yml) uses commitlint and safe title input; [setup](../../github-setup.md) requires the validated squash title and preserved breaking footer. | Tests were inspected, not run at this head. Dev-target title runs are deliberately excluded under the [development policy](../react-aria-development-validation.md). Fresh remote squash defaults remain `COMMIT_OR_PR_TITLE` / `COMMIT_MESSAGES`, so final title/footer preservation and owner enforcement remain unverified. Obtain coordinator release-policy validation and production PR/final merge-message evidence before full acceptance. |
| R-15 | **Partial: major markers and first-publication policy supported.** | Ancestor `bf2e412d8bc4893e55f5b16a7b12a919c0721053` has `feat!: consolidate owned foundation migration on dev`; representative ancestors `57abb6df848c424a39c7f4942ad25484926eee0e` (theme/presets), `98b4f9ff7b2aa6ededd88dd5fe30ecde169320a2` (icons/primitives), and `fa73abd805e9a020113801f9821c8376ec376d68` (public grids) also use `feat!:`. [Migration guide](../../migration.md) documents removed upstream surfaces and stylesheet/scope requirements. Setup states initial `1.0.0` without a previous release tag and subsequent major inference for breaking history. | Fresh GitHub tags/releases queries returned empty arrays; this does not establish npm state or exclude partial publication. [API reconciliation](../react-aria-public-api-reconciliation.md) explicitly leaves final declaration/API-to-marker reconciliation open. Owner must establish authoritative published/tag state and root must preserve the final breaking marker; no complete removal-to-commit audit or successful version inference at the final head is claimed. |
| R-16 | **Partial: coherent nonpublishing dev sequence supported.** | [Parallel sequence](../parallel-migration-batches.md) records reviewed full-history integration into `codex/dev`, preserves task histories, and reserves main/publication. [Release workflow](../../../.github/workflows/release.yml) triggers on main pushes/manual dispatch and guards the release job to main after reusable CI; config has only `branches: ['main']`. No prerelease branch/channel is configured. | This supports the isolation of current dev work from the configured release path. It does not prove future maintainer merge discipline, complete production acceptance, or safe eventual main history. Root must review the final main-bound PR sequence, breaking squash/body and remaining acceptance; do not publish intermediate APIs or assume a prerelease channel exists. |
| R-18 | **Supported for checked-in policy and this assignment; external owner state unverified.** | README/setup/AGENTS require validation-only local builds, Actions publication, no manual tracked version edits or changesets. `package.json` remains `0.0.0-development`; tracked-path inspection found no changeset files. Config delegates publication/versioning to semantic-release; this assignment ran no install/build/test/pack/publish commands and changes only this report. Setup explicitly calls publishing identity, owner settings and first-publication approval unverified. | A placeholder and absent changesets cannot prove all historical local actions. No npm identity, credentials, first-publication status or owner configuration is certified. Retain these owner limits; any future release requires its separately authorized owner-controlled path. No missing component behavior identified. |
| R-19 | **Partial with a concrete architecture-scope policy gap.** | [AI workflow](../../../.github/workflows/ai-code.yml) prompt, capture paths and proposal regex align on `src/`, `.storybook/`, `docs/`, `README.md`; prompt explicitly excludes workflows/package/AGENTS, and path filtering excludes those files. Setup routes package/workflow/agent changes to ordinary maintainer PRs. | The parent also reserves architecture changes for ordinary maintainer PRs. The prompt has no explicit architecture exclusion, and broad `src/`/`docs/` paths include foundation/public-contract/architecture files. No observed unauthorized proposal is alleged; source does not fully establish the semantic scope restriction. See the bounded maintainer handoff below. Actual AI execution/owner settings remain unverified and R-20/R-21/R-23/R-27 are separate scopes. |

## Immutable source receipts

All blob IDs below were read with `git ls-tree HEAD` at the reviewed head. They
identify exact inspected source bytes, not runtime output or passing checks.

| File | Git blob |
| --- | --- |
| `release.config.mjs` | `ee46e0de3e7545768032184650f0e1cc97f2c006` |
| `commitlint.config.mjs` | `6619009d80470d739677cfa33c019693cd87df15` |
| `scripts/release-policy.test.mjs` | `b1b6c0dfe4661475033d30ba968f4972484bdaf9` |
| `.github/workflows/pr-title.yml` | `931f4c0dfddfec63cf53febcf0bec155eb9cdad2` |
| `.github/workflows/release.yml` | `fdc2895cc6e7e48deb9f764dac75b65d6edc8f04` |
| `.github/workflows/ai-code.yml` | `e0afebe1206a9c28544035effb8aa00d39c87465` |
| `docs/github-setup.md` | `01e2aca71f153ec44ff6fce1b996577c71721116` |
| `docs/developer/react-aria-development-validation.md` | `93e7f6612b6b315f452636277d7140f318177a6d` |
| `docs/developer/react-aria-public-api-reconciliation.md` | `98165e3f545ddc7a3d08a5f0301ac8b0814d56b1` |
| `docs/developer/react-aria-release-gate-audit.md` | `b4cf9351ad301ba401eddc38446f257f286eebf7` |
| `docs/developer/parallel-migration-batches.md` | `da518aefa7ed7b356b54343b0e28ec8a39eda136` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |

## Retained execution evidence and limits

The [retained release audit](../react-aria-release-gate-audit.md) records successful
PR-title run [37620202388](https://github.com/Structured-Growth/sg-ui/actions/runs/37620202388)
and CI run [37620201571](https://github.com/Structured-Growth/sg-ui/actions/runs/37620201571)
for `9f153642e827a14033d646cf0160730c0793bdfc`. CI job success is broader historical
check evidence; it is not an isolated current-head release-test transcript.
The audit records package artifact IDs `11481268576` / `11481848718`, validation
IDs `11481553249` / `11481584496`, browser ID `11481739407`, and Storybook IDs
`11481238588` / `11481883591`, listed nonexpired at its earlier snapshot. Contents
were not inspected here, and availability was not refreshed; 14-day retention
can lose artifacts. Git-tracked audit text survives independently of those bytes.
Historical release run [37403150637](https://github.com/Structured-Growth/sg-ui/actions/runs/37403150637)
failed at semantic-release on `21adebd61bedfc6a1ed395fe664ff4be83896821`; neither
that failure nor empty GitHub lists establishes npm publication state.
No earlier success is promoted to current-head full-matrix evidence. Browser
engines, physical devices and spoken AT output were not exercised by this slice;
these policy criteria do not justify synthetic UI browser tests. Broad R/Z and
manual/device/AT production acceptance remain with their owners.

## Actual checks performed

- Read README, migration/component architecture, master R criteria, configs,
  release-policy test source, AI/title/release workflows, setup, development policy,
  retained release audit and relevant sequence/API reconciliation text.
- Inspected `git status`, exact HEAD, `git ls-tree`, commit history and local tag
  inventory; `git merge-base --is-ancestor bf2e412d8bc4893e55f5b16a7b12a919c0721053 HEAD`
  returned zero. Local tag inventory was empty; tracked changeset-path search
  matched no paths. Neither result is an npm/live-settings claim.
- Read-only `gh api repos/Structured-Growth/sg-ui` selected only default branch and
  squash metadata; `tags?per_page=100` and `releases?per_page=100` returned empty
  arrays. No authentication, secrets or raw release logs were inspected. No API
  writes, run dispatches, CI execution, approvals, merges or publication occurred.
- Report-only whitespace, relative-link and exact changed-path checks are recorded
  in the delivery receipt. No install, tests, builds, pack, browser, performance
  jobs or shared validation leases were started. There is no tested runtime head
  for this assignment: the named baseline is an inspected head.

## Exclusive maintainer handoff

R-19 needs a semantic architecture restriction in the component AI path. Proposed
minimal separate write allowlist: `.github/workflows/ai-code.yml`, a new
`scripts/ai-component-scope.test.mjs`, and a unique follow-up report. Root should
coordinate that reservation with the existing AI-workflow owners before dispatch;
this report does not acquire their files. Clarify architecture/public-contract
requests as maintainer-only in the prompt, and align enforceable exclusions with
that stated scope without silently expanding permitted paths. Targeted checks:
safe fixture assertions for allowed component/docs changes and rejected
package/workflow/agent/architecture paths, plus workflow prompt/capture/filter
consistency. These checks are **UNRUN** and require a coordinator validation
window. No workflow dispatch, publication or credential-backed proposal is needed.
Policy owners must define any ambiguous architecture boundary before encoding it;
a path regex alone cannot classify every semantic redesign. No production source
or new story/browser fixture is needed for this bounded handoff.
