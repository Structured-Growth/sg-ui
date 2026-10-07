# Parallel batch 03: setup and template guidance report

Task slice: W-17/W-19 and R-20/R-22 documentation. Completed the assigned bounded
setup/template/troubleshooting reconciliation; no whole-task or broad G/K/E/U/X/R/Z
completion is claimed. R-20 generated workflow prompt/body implementation remains
outside this ownership, and R-23/R-27 default-token runtime evidence remains open.

## Changes and evidence

- [GitHub setup](../../github-setup.md): replace stale single-Node CI and source job-ID
  protection advice with Node 22.12.0/24 and configured display names; document full
  CI browser/packed consumers, artifact names/conditions/retention, actual release
  reusable validation dependency, rebuild and commercial/owner prerequisites.
- [PR template](../../../.github/pull_request_template.md): task IDs, bounded scope,
  owned API/ref/style/scope contracts, host boundaries, stories/behavior evidence,
  commands/results/head/run/artifacts, remaining gates and Conventional Commit impact.
- [UI issue form](../../../.github/ISSUE_TEMPLATE/ui-change.yml): manual-trigger
  explanation, corresponding optional prompts, explicit observable acceptance criteria.
  Only the original request/acceptance fields remain required; no scope expansion.
- [Validation troubleshooting](../../troubleshooting/validation.md): warranted by the
  actual proposal/full-CI validation gap and documented static server/pack prerequisites.
  Covers absent/approval-required checks, stale static Storybook, shared loopback port
  6173, serial consumer packs and available failure artifacts. No unrelated recovery
  policy, engine skip or protection workaround is introduced.

Direct source review: .github/workflows/ci.yml, ai-code.yml, pr-title.yml, release.yml;
package.json scripts/exports/peers/engines/files; .nvmrc; release.config.mjs;
commitlint.config.mjs; playwright.config.ts; serve-browser-storybook.mjs;
test-foundation-consumer.mjs, test-editor-consumer.mjs, test-next-consumer.mjs;
src/theme/index.ts and canonical runtime/browser/server/component docs. Read AGENTS,
README, migration, component architecture, master tasks and batch-01/batch-02 reports.

Official external guidance was read on 2026-10-07:

- [GitHub workflow triggers](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow):
  current default-token PR opened/synchronize/reopened behavior is approval-required
  runs, correcting the prior categorical no-run claim. This is a documentation fact,
  not repository-specific event evidence. Other worker docs may retain the old claim.
- [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/):
  checked current Node/npm minimums, hosted-runner/configuration/direct-publish and
  provenance prerequisites. No publisher connection, credential or scope-owner access
  was inspected. Effective release npm CLI/publisher readiness remains unverified.
- [semantic-release FAQ](https://semantic-release.gitbook.io/semantic-release/support/faq):
  initial version policy and tag-derived versioning, consistent with local config.

## Ownership and review artifacts

Dedicated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-03-setup-docs/sg-ui`.
Branch: `codex/batch-03-setup-docs`.
Exact assigned prerequisite: `f61d288af04260632abdaf58c5bdceed71c6aaab`.
Implementation documentation commit: `5a71d1d` (`docs: reconcile setup and task validation guidance`).
This report follows in a separate docs commit; branch head contains both.
Draft PR: [#4](https://github.com/Structured-Growth/sg-ui/pull/4), stacked on
`codex/batch-02-architecture-docs`, prerequisite [#3](https://github.com/Structured-Growth/sg-ui/pull/3),
which is stacked on [#2](https://github.com/Structured-Growth/sg-ui/pull/2).
Merge prerequisites first, then review/rebase the stack. Draft/base/head/file-list
were verified through GitHub CLI and the PR was attached to this chat.

Only the five assigned paths (including this report) changed. Shared AGENTS,
master/progress, other docs, source, scripts, package/lockfile, workflows and
LICENSE/notices are untouched. Primary/other worktrees were not edited, reset,
stashed or cleaned. No agents/chats launched; one authorized coordinator completion
report follows. No merge, publication, version edit, secret access, owner setting
or workflow permission change.

## Validation

- PASS: Python assertions checked 26 local links/anchors across setup, PR template,
  troubleshooting and this report; declared package commands, referenced source/script
  paths, styles/theme exports, Provider/ThemeScope exports, peers/engine/pnpm/.nvmrc.
- PASS: configured workflow assertions for matrix/job names, mandatory commands,
  consumers, artifact names/retention, manual-only AI dispatch/draft/limited checks,
  release needs/reusable CI/full history/concurrency and plugin settings.
- PASS: Ruby/Psych issue-form YAML parse plus supported element types, unique IDs,
  attribute/label presence and exactly the existing two required inputs. Form Markdown
  repository links point to existing paths (will reach these changes after integration).
- PASS: git diff --check and changed/untracked-file ownership audit against f61d288;
  draft PR file list matches this slice.
- Not run: dependency installation, pnpm check/build-storybook, UI/browser/packed
  consumer tests. This is guidance-only work. No new source/example behavior was
  introduced; local assertions do not establish exact-head CI success. Configured PR
  CI still applies and needs its own evidence. No shared server or heavy-suite lock used.

A temporary Python checker and PR body were kept outside the repository; Ruby's
existing YAML parser needed no dependency installation. No unrelated tests added.

## Remaining gates and next bounded suggestion

Owner settings, actual required status contexts, default-token event approval/run
behavior, npm scope access/effective publisher CLI/identity/provenance, exact CI versus
release tarball identity and publication readiness are unverified. Broad device,
assistive-technology, rich-content/calendar/grid/editor, legal and artifact gates remain.
Commercial licensing, fixture behavior and other W-17 docs were outside this slice.
The issue form/PR template do not automatically populate the AI workflow's static
prompt/body, whose scope excludes .github template changes.

Suggested next bounded infrastructure assignment: R-20/R-23/R-27 audit the AI prompt,
generated PR evidence and default-token draft workflow run/approval behavior on a
reviewable test proposal; align applicable validation with full CI without weakening
checks or expanding permissions. Owner review should establish required contexts and
publication effects before changing the workflow. Coordinator can record this bounded
slice centrally without ticking W-17/R-20 or broad acceptance complete. Consider
updating any other historical no-default-token-run wording using the official evidence
above, within the relevant worker's ownership.
