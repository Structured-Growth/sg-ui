# GitHub Actions setup

This guide describes the checked-in workflows and owner prerequisites. Repository
Actions settings, rulesets/branch protection, installed secrets, npm ownership and
publishing identity are unverified here; workflow YAML alone does not establish them.
Task slice: W-17/W-19 and R-20/R-22 documentation; broad release gates remain open.

## Repository settings and validation

An owner must enable Actions and permit Actions to create pull requests under
Settings → Actions → General for the default-token AI proposal path. Protect `main`
with PR review and both matrix checks, **Validate Node 22.12.0** and **Validate Node 24**,
plus **conventional-title**. `validate` is the YAML job ID, not its matrix display name.
Confirm the exact contexts from an actual PR run before configuring required checks;
reusable release runs can display a caller prefix. No protection setting is asserted.

Enable squash merging with **Pull request title** as the default commit title.
Squash-merge using the validated Conventional Commit title, preserving `!` for
breaking changes. If using a `BREAKING CHANGE:` footer instead, preserve it in the
squash commit body: the title check cannot validate that eventual body. Never
auto-merge AI proposals. Preserve commercial licensing and third-party notices.

Use Node 24 from [`.nvmrc`](../.nvmrc) for development, PR-title validation, both AI
jobs and releases, with pnpm 10.29.3 from [package.json](../package.json). The consumer
engine is Node >=22.12.0; React/React DOM peers are 18.3.1 or 19. CI validates the
exact Node 22.12.0 minimum and the Node 24 line.

[CI](../.github/workflows/ci.yml) runs on `pull_request`, pushes to `main` and
`workflow_call`; it has no documentation path exclusion. Both matrix jobs install
the frozen lockfile, run `pnpm check` and `pnpm build-storybook`, then serially run
packed foundation and editor consumers with React 18.3 and 19. The React 19
foundation consumer includes Flight. Node 24 additionally installs Chromium,
Firefox and WebKit, runs `pnpm test:browser`, enables foundation browser hydration
and runs the packed Next.js production/browser consumer. `pnpm check` includes
foundation/token guards, foundation tests, typecheck, Vitest, release-policy tests,
a library build and package-entry smoke checks; it does not itself run the browser
or packed consumer suites.

Each matrix job has a 30-minute timeout and uploads these artifacts with 14-day
retention (availability must be checked on the producing run):

| Artifact | Contents and upload condition |
| --- | --- |
| `sgui-package-node-22.12.0`, `sgui-package-node-24` | Validated tarball after successful checks |
| `sgui-storybook-node-22.12.0`, `sgui-storybook-node-24` | Built static Storybook after successful checks |
| `sgui-validation-node-22.12.0`, `sgui-validation-node-24` | Runtime/check/build/consumer logs, uploaded even on failure |
| `sgui-browser-node-24` | Reports, traces, JSON and packed browser evidence, uploaded even on failure |

See [runtime evidence](developer/react-aria-runtime-ci.md) and
[browser acceptance](developer/react-aria-browser-acceptance.md) for recorded heads
and limits; prior success does not certify a later commit. For local failure triage,
see [validation troubleshooting](troubleshooting/validation.md).

## Secrets and publishing identity

Owner configuration must establish publishing access to `@structured-growth/sg-ui`.
[package.json](../package.json) configures public npm access; public distribution
still requires a written commercial license for use. Review [LICENSE](../LICENSE),
[commercial licensing](commercial-licensing.md) and [notices](../THIRD_PARTY_NOTICES.md).

- `NPM_TOKEN`: publishing credential if using token authentication. The owner must
  verify current npm package access and automation/2FA policy; no credential is
  inspected or stored by this guide.
- Alternatively, configure an npm Trusted Publisher for `Structured-Growth`,
  repository `sg-ui`, workflow filename `release.yml`. The release job already has
  `id-token: write` on a GitHub-hosted runner. Verify package setup, direct publish
  permission and the effective publishing npm CLI before relying on OIDC. Current
  npm guidance requires npm >=11.5.1 and Node >=22.14.0. Node 24 selection alone
  does not prove the effective CLI or publisher setup. If bootstrap publication is
  needed, it belongs to the owner-approved Actions release path.
- `OPENAI_API_KEY`: required by the manual AI implementation workflow.
- `AI_PR_TOKEN`: optional alternative to `github.token` with repository contents
  and PR write access. It can allow normal PR workflows to start automatically.

The release job uses `GITHUB_TOKEN` for tags and GitHub releases, and passes
`NPM_TOKEN` from secrets. There is no `RELEASE_TOKEN` reference or version-update
commit/PR plugin. Consumers of public npm packages need no package-read credentials.
Never commit or log credentials. npm trusted-publisher and provenance conditions
are documented in [official npm guidance](https://docs.npmjs.com/trusted-publishers/);
configured source permissions are prerequisites, not proof of a successful publish.

## Manual AI task and draft review

[AI implementation](../.github/workflows/ai-code.yml) uses only `workflow_dispatch`
with a required `task` string; the implementation job runs only on `main`. In
Actions, choose **AI implementation**, **Run workflow**, select `main`, and supply
the request plus acceptance criteria. The [UI issue form](../.github/ISSUE_TEMPLATE/ui-change.yml)
captures a request for triage. Opening/labeling an issue or submitting that form
does not invoke AI; no issue/label trigger is implemented (R-22).

Include applicable backlog task IDs, owned props/native refs, CSS tokens and
`/styles.css` with Provider or ThemeScope, host-owned data/routing/translation/save
boundaries, relevant stories/behavior criteria, validation commands and remaining
gates. Use the [canonical recipe](developer/react-aria-component-recipe.md) and
[PR template](../.github/pull_request_template.md). State the bounded scope rather
than requiring every broad G/K/E/U/X/R/Z gate for each request.

The checked-in AI prompt and patch allowlist permit only `src/`, `.storybook/`,
`docs/` and `README.md`. Package/workflow/agent changes and `.github` template edits
require ordinary maintainer PRs. The implementation job uploads `ai-proposal`
(patch and summary, 14 days); the separate proposal job checks the allowlist,
validates the generated Conventional Commit title, runs `pnpm check` and
`pnpm build-storybook`, then creates a draft PR on `ai/sgui-<run_id>`. Its generated
body is a short static summary; task IDs, detailed evidence and remaining gates
must be added during review. Updating the generated prompt/body is separate
workflow work (R-20), not accomplished by these templates.

Do not assume default-token creation automatically runs full PR CI. Current
[GitHub trigger guidance](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)
says `GITHUB_TOKEN` PR opened/synchronize/reopened events create approval-required
runs; a user with write access can select **Approve workflows to run**. Other PR
activity types do not receive that exception. Verify the actual PR's run state
and required contexts. The proposal job's title/package/Storybook checks remain
independent, but it does **not** execute full CI browser or packed-consumer gates.
Approve and inspect those PR runs where offered, or report missing validation to
an owner; do not equate the generated summary with full CI evidence. This guide
has not verified actual default-token PR behavior for this repository (R-23/R-27).

## Validation by change scope

| Change scope | Evidence to provide before completion |
| --- | --- |
| Documentation/template guidance only | Relevant links/anchors, paths, commands, exports/example contracts, issue-form structure and `git diff --check`; no unrelated UI tests or local builds |
| Component/API/style/behavior | `pnpm check`, `pnpm build-storybook`, changed-state stories and meaningful colocated tests; composed/browser checks when native timing, focus, scrolling or positioning matters |
| Dependency/build/release/workflow | `pnpm check`, `pnpm build-storybook` plus affected runtime, packed consumer, release-policy and workflow evidence; owner prerequisites and publication effects explicitly reviewed |

Run `pnpm install --frozen-lockfile` when dependencies are needed. Documentation-only
local validation does not skip configured PR CI. Record commands, results, exact
head/run/artifact links and anything unverified. Broader device/assistive-technology
and final artifact/legal acceptance remain separate unless part of the request.

## Automatic versioning and release flow

[release.config.mjs](../release.config.mjs) analyzes Conventional Commits since the
last release tag, using `main` and tags `v${version}`:

| Commit example | Release |
| --- | --- |
| `fix: correct modal focus` or `perf: improve grid rendering` | Patch |
| `feat: add a compact button` | Minor |
| `feat!: remove a deprecated prop` | Major |
| Any commit with a `BREAKING CHANGE:` footer | Major |
| `docs:`, `chore:`, `test:`, `ci:`, `build:`, `refactor:` without breaking changes | None |

The highest required bump wins. [PR title](../.github/workflows/pr-title.yml) checks
opened/edited/synchronize/reopened/ready-for-review events with commitlint. Direct
commits must also follow the convention. Do not add changesets, edit tracked
versions manually or publish locally.

[Release](../.github/workflows/release.yml) triggers on pushes to `main` or manual
`workflow_dispatch`. It calls CI as its own `validate` prerequisite, then publishes
only on `main` after that job succeeds; it does not merely wait for a separate CI
run. The release job checks out full history, installs, rebuilds the library and
runs `pnpm release`. It serializes release runs without canceling an in-progress
release. Manual dispatch uses the same commit analysis and does not force a bump.

With no previous release tag and a qualifying commit, semantic-release starts at
`1.0.0`; the tracked `0.0.0-development` is a placeholder. Published package versions,
npm and release tags are authoritative; versions are not committed back to `main`.
See [semantic-release FAQ](https://semantic-release.gitbook.io/semantic-release/support/faq).
A release-worthy merge to `main` can publish automatically once owner prerequisites
are configured. This guide establishes no first-publication approval or live status.

The npm plugin publishes and creates a tarball in `artifacts/release`; the GitHub
plugin attaches it and creates the tag/release notes. It disables issue/PR release
comments and labels. Release rebuilds output rather than downloading the CI tarball;
exact-artifact identity remains a separate audit. Published files include `dist`,
package metadata, README, LICENSE and THIRD_PARTY_NOTICES.md; there is no CommonJS
entry. The workflow enables provenance for a public repository. npm documents OIDC
provenance for public packages from public repositories; package/repository visibility
and the successful attestation must be verified by the owner before claiming it.
