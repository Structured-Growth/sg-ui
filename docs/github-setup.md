# GitHub Actions setup

The workflows become active after this checkout is pushed to
`Structured-Growth/sg-ui`. No remote settings or secrets have been changed.

## Repository settings

Enable Actions and permit Actions to create pull requests under Settings →
Actions → General. Protect `main` with the `validate` and `conventional-title`
checks and PR review. Enable squash merging and use **Pull request title** as
its default commit title. Squash-merge with the validated title, preserving `!`
for breaking changes. A BREAKING CHANGE footer must be preserved in the squash
commit body if used instead of `!`.

The package scope is `@structured-growth`. Ensure the publishing npm account
can publish under that scope. `publishConfig.access` remains `public`.
The custom commercial license requires a separate agreement before use.
Review LICENSE and docs/commercial-licensing.md before publication.

Use Node 24 for development (see .nvmrc); the release job uses Node 24 to meet
semantic-release's tool requirements. The library's consumer requirements are
unchanged. The CI build uses Node 22.

## Secrets and publishing identity

- `NPM_TOKEN`: npm publishing token with access to `@structured-growth/sg-ui`,
  for the initial release or when npm trusted publishing is not configured.
  Configure its publish/2FA permissions for automation.
- Alternatively, configure an npm Trusted Publisher for organization
  `Structured-Growth`, repository `sg-ui`, workflow `release.yml`. The release
  job already grants `id-token: write`. Once configured, publishing can use OIDC
  without an npm token. Initial publication may need a token to create the package.
- `OPENAI_API_KEY`: required for the manual AI implementation workflow.
- `AI_PR_TOKEN`: optional token with repository contents and PR write permission
  so AI-created draft PRs trigger normal PR CI. With the default GITHUB_TOKEN,
  GitHub does not trigger additional workflows for that PR creation. The proposal
  job still validates the title and runs package and Storybook checks itself.

Releases use the automatic GITHUB_TOKEN for Git tags and GitHub releases.
RELEASE_TOKEN is no longer needed. The release workflow does not create version
PRs or push version-update commits to main. Consumers install from public npm
without package-read credentials. Never commit publishing credentials.

## Automatic versioning

semantic-release analyzes Conventional Commits since the latest `vX.Y.Z` tag:

| Commit example | Release |
| --- | --- |
| `fix: correct modal focus` | Patch |
| `perf: improve grid rendering` | Patch |
| `feat: add a compact button` | Minor |
| `feat!: remove a deprecated prop` | Major |
| Any commit with a `BREAKING CHANGE:` footer | Major |
| `docs:`, `chore:`, `test:`, `ci:`, `build:`, `refactor:` without breaking changes | None |

If several changes land together, the highest required bump wins. A PR-title
workflow checks the convention so the squash commit can be analyzed. Direct
commits to main must follow the same convention. No changeset files are needed.

The first semantic-release publication is `1.0.0` when no release tag exists and
there is a release-worthy commit. After that, tags determine the next version.
The tracked `package.json` version is `0.0.0-development`; semantic-release writes
the actual version into the published package. npm and GitHub release tags are
the version sources of truth. Version updates are not committed back to main.

## Trigger and release flow

1. Run **AI implementation** on main with a task prompt. It proposes component
   changes and generates a Conventional Commit PR title; the proposal job checks
   that title before creating a draft PR.
2. Review and squash-merge using the validated PR title. Workflow/package changes
   remain ordinary maintainer PRs.
3. CI builds the library and Storybook. The Release workflow waits for the same
   checks, then semantic-release computes the version, generates release notes,
   publishes the package to public npm, and creates a version tag and GitHub release
   with the package tarball attached.
4. Commits with no release impact skip publishing. A manual Release run uses the
   same commit analysis; it does not force a new version without qualifying changes.

Publishing supports npm provenance when the source repository is public. Trusted
publishing also generates provenance according to npm's current requirements.
Published packages include dist, package metadata, README, the commercial LICENSE,
and THIRD_PARTY_NOTICES.md. There is no CommonJS entry point.

Sources: [semantic-release GitHub Actions guidance](https://semantic-release.org/recipes/ci-configurations/github-actions/),
[semantic-release version tracking](https://semantic-release.org/support/faq/), and
[official Codex GitHub Action documentation](https://learn.chatgpt.com/docs/github-action).
