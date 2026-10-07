# Batch 04 release audit report

Scope: bounded R-13/R-14/R-19/R-21/R-23/R-27/R-28 evidence audit. Baseline
`d8342a1b76c2fffe986ecce22252c8282873dbf1`; managed worktree
`/Users/thomashall/.codex/worktrees/batch-04-release-audit/sg-ui`; unique branch
`codex/batch-04-release-audit`. The primary checkout and other workers' worktrees
were not changed. Exclusive written files are this report and the
[saved release gate audit](../react-aria-release-gate-audit.md).

The audit is complete as a documentation slice; all broad release/AI gates remain
open. It records configured source, actual run/job/check metadata and owner
settings separately. Draft stack dependency: #4 (`codex/batch-03-setup-docs`) →
#3 → #2 → #1. This slice is based on #4 and must be reviewed/retargeted with that
stack; it is not an independent implementation or publishing approval.

## Findings

- Current PR #1 and #2 heads have successful matrix and title checks. #3/#4
  still had pending matrix work at the 12:37:57 UTC snapshot; their exact heads,
  run IDs and results are saved in the audit. Non-main PR bases did not suppress CI.
- Live main has no visible protection/rulesets, and squash defaults are
  `COMMIT_OR_PR_TITLE`/`COMMIT_MESSAGES`, rather than a guaranteed validated PR
  title. Owner enforcement and final merge-message preservation remain required.
- Main's historical CI success uses the old single Node 22 job. Its sole release
  run 37403150637 passed old reusable CI, then failed at semantic-release. Cause,
  npm state and publication identity remain unverified; visible tags/releases
  are empty. New full main/release matrix execution is unobserved.
- No AI runs exist in the visible workflow history. Proposal checks are narrower
  than full CI; actual default-token PR approval/validation is unverified. Current
  official docs explicitly describe approval-required PR opened/synchronize/
  reopened runs, so no categorical token no-run claim is retained.
- AI generated-code validation runs inside a job with repository/PR write
  authority. Separate generation and validation jobs do not fully isolate this
  privilege. The static prompt/body also needs reserved R-20 implementation.

## Read-only verification

Read AGENTS.md, README, migration/component architecture, setup, master task
criteria and runtime/execution contracts. Inspected numbered CI/release/title/AI
workflow source, release/commitlint config, package scripts, release-policy tests
and issue/PR templates. No code, workflow, package, shared guidance or licensing
file was modified. No dependencies, builds, browser servers or tests were run.

GitHub metadata was queried through `gh` without printing authentication:

```sh
gh pr list --repo Structured-Growth/sg-ui --state all --limit 20 \
  --json number,title,isDraft,baseRefName,headRefName,headRefOid,url,statusCheckRollup
gh pr view 2 --repo Structured-Growth/sg-ui --json headRefOid,statusCheckRollup
gh pr view 3 --repo Structured-Growth/sg-ui --json headRefOid,statusCheckRollup
gh pr view 4 --repo Structured-Growth/sg-ui --json headRefOid,statusCheckRollup
gh api repos/Structured-Growth/sg-ui/actions/runs/37620201571/jobs
gh api repos/Structured-Growth/sg-ui/actions/runs/37620201571/artifacts
gh api repos/Structured-Growth/sg-ui/actions/runs/37403150637/jobs
gh api repos/Structured-Growth/sg-ui/actions/runs/37403150028/jobs
gh api repos/Structured-Growth/sg-ui/branches/main/protection
gh api repos/Structured-Growth/sg-ui/rulesets
gh api repos/Structured-Growth/sg-ui/actions/permissions
gh api repos/Structured-Growth/sg-ui/actions/permissions/workflow
gh api 'repos/Structured-Growth/sg-ui/tags?per_page=100'
gh api 'repos/Structured-Growth/sg-ui/releases?per_page=30'
gh api 'repos/Structured-Growth/sg-ui/actions/workflows/ai-code.yml/runs?per_page=10'
gh api 'repos/Structured-Growth/sg-ui/actions/workflows/release.yml/runs?per_page=10'
```

Repository/default-branch metadata and the latest 30 runs were also inspected;
output was restricted to relevant metadata. Raw release logs, artifact contents,
credentials, secret inventories/values and npm account settings were not read.
No runs were dispatched, approved or retried; no proposal, merge or publication
was performed. Official GitHub, semantic-release and npm sources linked beside
the corresponding audit claims were checked on 2026-10-07.

Documentation verification checks relative links/files, source line claims,
exclusive file ownership and `git diff --check`. It does not certify remote
settings persistence, test coverage, browser/device behavior or successful
publication. Actual run snapshots are intentionally dated and should be refreshed
when a reviewer relies on them for a later head.

Next concrete bounded assignment: a maintainer R-21 workflow change to move AI
patch validation to a contents-read job and reserve contents/PR write authority
for a fresh non-executing proposal job, with safe allowlist/input regressions.
Reserve the static R-20 prompt/body and R-23/R-27 full-CI prerequisite work as
explicit follow-ups. Owner settings and first-publication decisions are separate.
