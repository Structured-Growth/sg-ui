# Release and AI validation gate audit

Task slice: R-13/R-14/R-19/R-21/R-23/R-27/R-28. This is a bounded,
read-only infrastructure audit, not completion of those gates or authorization
to publish. Evidence was collected on 2026-10-07, with the PR snapshot at
12:37:57 UTC (07:37:57 America/Chicago). Source baseline:
`d8342a1b76c2fffe986ecce22252c8282873dbf1`, the head of draft PR #4.
See the [batch report](parallel-batch-04/release-audit.md) for ownership,
reproduction commands and validation limits, the [master list](react-aria-master-task-list.md)
for acceptance criteria and [setup guide](../github-setup.md) for owner procedures.

## Evidence levels and live state

Source inspection establishes configured paths. GitHub run/job/check metadata
establishes observed execution at the named head. Earlier worker validation in
the [execution record](react-aria-progress.md) is separate evidence and was not
rerun here. Job success does not establish every assertion's coverage, artifact
contents, native/device acceptance or publication identity.

All four observed PRs are drafts. Checks below are from their current head
rollups, not an earlier successful head. Each CI entry comprises exactly
`Validate Node 22.12.0` and `Validate Node 24`; each title check is named
`conventional-title`.

| PR / head | Base | CI run / snapshot result | Title run / result |
| --- | --- | --- | --- |
| [#1](https://github.com/Structured-Growth/sg-ui/pull/1), `9f153642e827a14033d646cf0160730c0793bdfc` | `main` | [37620201571](https://github.com/Structured-Growth/sg-ui/actions/runs/37620201571), both success | [37620202388](https://github.com/Structured-Growth/sg-ui/actions/runs/37620202388), success; duplicate title run 37620200938 also success |
| [#2](https://github.com/Structured-Growth/sg-ui/pull/2), `9554f1eb6a6f630e98f21eec6bdb6fa592450064` | `feat/react-aria-owned-foundation-cards` | [37621232415](https://github.com/Structured-Growth/sg-ui/actions/runs/37621232415), both success | [37621232418](https://github.com/Structured-Growth/sg-ui/actions/runs/37621232418), success |
| [#3](https://github.com/Structured-Growth/sg-ui/pull/3), `f61d288af04260632abdaf58c5bdceed71c6aaab` | `codex/batch-01-docs` | [37621573895](https://github.com/Structured-Growth/sg-ui/actions/runs/37621573895), 22.12.0 success; 24 in progress | [37621573769](https://github.com/Structured-Growth/sg-ui/actions/runs/37621573769), success |
| [#4](https://github.com/Structured-Growth/sg-ui/pull/4), `d8342a1b76c2fffe986ecce22252c8282873dbf1` | `codex/batch-02-architecture-docs` | [37622149498](https://github.com/Structured-Growth/sg-ui/actions/runs/37622149498), both in progress | [37622149482](https://github.com/Structured-Growth/sg-ui/actions/runs/37622149482), success |

The baseline [CI workflow](../../.github/workflows/ci.yml), lines 2–6, has
unfiltered `pull_request`, main-only `push`, and `workflow_call` triggers. There
is no PR base or documentation path filter. The non-main stacked PRs above
actually have runs; no missing-run or main-only PR-filter defect is observed.
If another revision adds a PR branch filter, it matches the target/base branch,
not the source branch, per [GitHub trigger documentation](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow).

Read-only owner metadata returned:

| Endpoint under `repos/Structured-Growth/sg-ui` | Observed response |
| --- | --- |
| Repository metadata | Public; default branch `main`; squash, merge and rebase all enabled; squash title `COMMIT_OR_PR_TITLE`; squash message `COMMIT_MESSAGES` |
| `branches/main` | `protected: false`; head `21adebd61bedfc6a1ed395fe664ff4be83896821` |
| `branches/main/protection` | HTTP 404, explicitly `Branch not protected` |
| `rulesets` | HTTP 200, empty array |
| `actions/permissions` | Enabled; `allowed_actions: all`; `sha_pinning_required: false` |
| `actions/permissions/workflow` | `default_workflow_permissions: read`; `can_approve_pull_request_reviews: false` |
| `tags` and `releases` | Both HTTP 200, empty arrays |
| `actions/workflows/ai-code.yml/runs` | `total_count: 0` |

These responses establish no visible enforced required contexts on main at the
snapshot. They do not establish unqueried enterprise policy or npm settings.
The API documents the false workflow-permissions flag as disallowing approving
PR reviews. It does not provide observed evidence that default-token PR creation
works here; the owner must separately verify the effective PR-creation policy.
No secret inventory or values were inspected. See the
[GitHub permissions API](https://docs.github.com/en/rest/actions/permissions#get-default-workflow-permissions-for-a-repository).

## R-13 and R-27: configured checks versus executed paths

Baseline CI lines 10–56 configure the Node 22.12.0/24 matrix, frozen install,
`pnpm check`, Storybook and four serial packed React foundation/editor consumers.
Node 24 also installs Chromium/Firefox/WebKit, runs browser tests, enables packed
foundation browser hydration and runs the packed Next.js production/browser
consumer. Explicit bash preserves pipeline failure through `tee` under
[GitHub's documented pipefail semantics](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepsshell).
Package script `check` includes release-policy tests but
does not include those browser or packed-consumer suites.

For PR #1, jobs `112788242752` (22.12.0) and `112788242567` (24) actually report
success for those configured steps. Node 22's browser and Next.js steps are
skipped by design. Seven artifacts were listed as nonexpired on run 37620201571:
package, Storybook and validation for each runtime, plus `sgui-browser-node-24`.
Artifact IDs respectively include package 22 `11481268576`, package 24
`11481848718`, Storybook 22 `11481238588`, Storybook 24 `11481883591`,
validation 22 `11481553249`, validation 24 `11481584496`, browser `11481739407`.
No artifacts were downloaded or contents certified in this audit.

The live main head is older than the audit baseline. Its successful push CI run
[37403150028](https://github.com/Structured-Growth/sg-ui/actions/runs/37403150028)
has a single `validate` job on Node 22 and package/Storybook checks, without the
new matrix/browser/consumer steps. Thus main-path execution of the new full
matrix remains unobserved. Maintainer infrastructure and stacked documentation
PR paths do have the current matrix contexts, but enforced protection is absent.

Baseline [release workflow](../../.github/workflows/release.yml), lines 8–25,
uses `sgui-release` concurrency, `cancel-in-progress: false`, its own reusable CI
prerequisite, `needs: validate`, main-only publishing and `fetch-depth: 0`.
This is configured validation-before-publication and full-history checkout;
it does not depend on the separately triggered CI run. The title job is not a
release dependency, so PR protection and final squash discipline must preserve
the release message before it reaches main.

Concurrency protects an in-progress run, but the default queue replaces an
already pending run; it is not a guarantee that every push receives a release
attempt. No concurrent release execution was observed. See
[GitHub concurrency guidance](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency).

The sole visible release run,
[37403150637](https://github.com/Structured-Growth/sg-ui/actions/runs/37403150637),
started 2026-10-06T02:14:20Z on main head `21adebd61bedfc6a1ed395fe664ff4be83896821`.
Its old `validate / validate` job `112074643366` succeeded; `release` job
`112074891613` failed at `Version and publish with semantic-release`. Sequencing
was exercised with the old check set; successful publication and the new matrix
release prerequisite were not. Failure cause is unverified because raw logs were
not read. Empty GitHub tags/releases do not prove npm has no package or partial
publication. Release rebuilds `dist` (lines 31–34) instead of consuming the CI
tarball, leaving exact-artifact identity unverified.

## R-14 and R-28: release inference and publication control

[PR-title workflow](../../.github/workflows/pr-title.yml), lines 3–28, checks
opened/edited/synchronize/reopened/ready-for-review events, carries the title
through an environment variable and writes it with Node before commitlint.
This avoids expression interpolation into shell source. The observed title
checks above passed. The check does not validate the eventual squash body or
prevent a merger changing the final title.

[Release config](../../release.config.mjs), lines 2–9, selects main, `v${version}`,
Conventional Commits, npm publication and a GitHub tarball asset.
[Commitlint config](../../commitlint.config.mjs), lines 2–6, permits either
breaking marker independently. [Release-policy tests](../../scripts/release-policy.test.mjs),
lines 16–52, cover fix/perf patch, feat minor, exclamation/footer major,
maintenance non-release, largest-bump inference and valid/invalid PR titles.
These are safe analyzer/commitlint tests, not publication calls. Their source
was inspected; this worker did not execute them. The PR #1 successful package
check is broader run evidence, not a newly isolated test transcript.

The repository squash default differs from the setup recommendation of **Pull
request title**: `COMMIT_OR_PR_TITLE` may use the sole commit's title. Merge and
rebase are also allowed. An owner must enforce or operationally guarantee the
validated title and preserve any `BREAKING CHANGE:` footer; enabling squash alone
does not do so. See [GitHub squash defaults](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/configuring-commit-squashing-for-pull-requests).

No previous GitHub release/tag is visible. A qualifying history with no release
tag normally starts at 1.0.0, even if a breaking migration is the first release;
subsequent qualifying breaking commits imply a major bump. The development
version is not the publication version. See the
[semantic-release FAQ](https://semantic-release.gitbook.io/semantic-release/support/faq).
Before final migration merges, the owner must reconcile remote Git tags, npm
versions/ownership and the intended first-versus-subsequent release, and explicitly
decide publication timing. The YAML has no environment approval gate or explicit
first-publication hold. Passing validation and configured publishing access can
publish automatically on a main push. This audit neither runs semantic-release
(including dry-run) nor authorizes a merge, retry or publication.

Publishing credentials, npm package access/trusted-publisher identity, effective
npm CLI, provenance and any environment protection remain unverified. OIDC write
permission and Node 24 selection alone prove none of those; current npm trusted
publishing requires npm >=11.5.1 and Node >=22.14.0, according to
[npm's official guidance](https://docs.npmjs.com/trusted-publishers/).

## R-19/R-21/R-23: AI proposal boundary

[AI workflow](../../.github/workflows/ai-code.yml), lines 3–43, is manual and
main-only; the task enters through `TASK` and Node file writing. Prompt and staged
patch scope agree on `src/`, `.storybook/`, `docs/`, `README.md`. Lines 74–83
apply the artifact patch and then check NUL-delimited changed filenames against
that allowlist before validation. Package/workflow/agent changes remain outside
this component path. The filename check is not a content, executable-code or
symlink policy, and it occurs after application; no adversarial patch test was
run here.

The implementation job has contents-read permission, checkout credential
persistence disabled, workspace-write sandbox and drop-sudo; the OpenAI key is
referenced only by the Codex action. The fresh `propose` job separately applies
and checks the patch, validates a file-derived title and runs package/Storybook
checks before creating a draft PR. No auto-merge step or npm credential is
configured in either AI job. These are useful configured boundaries, not proof
of resistance to prompt injection or credential isolation.

There is a concrete remaining privilege separation gap: `propose` has contents
and PR write permissions for its entire job (lines 61–63), and executes generated
source/tests/Storybook at lines 102–103 before the credentialed PR action. Fresh
jobs separate generation from validation, but do not separate validation from
write authority. Disabling persisted checkout credentials does not remove the
job's token authority. Treat generated code/artifacts as untrusted; a bounded
maintainer fix should validate in a read-only job and reserve write authority for
a fresh proposal job that does not execute generated code. Also review the allowed
patch file types and action pinning. No exploit or token access was attempted.
These recommendations follow [GitHub's secure-use guidance](https://docs.github.com/en/actions/reference/security/secure-use).

Lines 102–110 run no browser or packed consumer suites and use a static PR body.
Thus proposal validation alone is narrower than full CI. The static prompt lacks
explicit owned contract/task-ID/evidence requirements, and the generated body
does not incorporate the new PR template or model summary beyond its first-line
title. Reserve a bounded R-20 maintainer workflow change to update both and record
exact validation evidence and remaining gates, rather than claiming template
documentation changed runtime generation.

There are zero visible AI workflow runs and no observed AI-created PR; actual
default-token creation/approval/full-CI behavior is unverified. Current GitHub
documentation says default-token PR opened/synchronize/reopened events create
approval-required runs, while alternate App/PAT tokens can start them without
that approval. Do not claim default-token PRs categorically create no runs.
See [official trigger guidance](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow),
rechecked directly by this audit on 2026-10-07, independently of the coordinator's
earlier worker report. Ordinary PR runs above do not prove the AI token path.

## Remaining assignments and owner prerequisites

1. **R-21 maintainer implementation:** split AI read-only validation from fresh
   credentialed proposal creation; test allowlist rejection/file-type handling and
   input/title handling without credentials or workflow dispatch. Preserve draft
   review and do not expand the component allowlist implicitly.
2. **R-20 bounded workflow fix:** update static prompt/generated body with task
   IDs, owned contracts, relevant stories/tests, exact evidence and remaining
   gates. The R-20 documentation stack is preparatory only.
3. **R-23/R-27 bounded full-CI fix and later owner evidence:** make full reusable
   CI an explicit proposal prerequisite or otherwise guarantee its recorded
   completion; keep proposal-only checks distinct. Resolve the Actions PR-creation
   setting/token choice with an owner, then observe a separately authorized AI PR
   at its exact head and approval state. No test proposal was dispatched here.
4. **R-14/R-27 owner settings:** configure review and observed required contexts
   `Validate Node 22.12.0`, `Validate Node 24`, `conventional-title`; choose PR-title
   squash defaults and preserve breaking footers. Reinspect after stack retargets
   or workflow changes. The old main `validate` name is insufficient for the new
   matrix; release caller names must be observed after the new workflow lands.
5. **R-13/R-28 owner release decision:** resolve the failed historical release,
   publishing identity/version/tag state and first-publication timing before
   merges; preserve validation sequencing/history/concurrency. Observe new
   main/reusable-CI execution and later publication only in an authorized release
   task. Exact released artifact identity remains a separate acceptance item.

No backlog checkbox or shared guidance was changed. Broad R/Z gates remain open.
