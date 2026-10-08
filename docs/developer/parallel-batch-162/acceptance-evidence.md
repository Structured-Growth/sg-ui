# Batch 162: bounded L-09 dependency policy implementation

Inspection date: 2026-10-07 (America/Chicago). Reviewed base:
`d5aec9b632e2d76631fb867325777c09391afc2a`. Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/38e2/sg-ui`; branch:
`codex/batch162-dependency-policy`. Before edits, `git status --short` was empty;
`git worktree list` showed this checkout separately from `codex/dev` and other
workers. The branch was created from this detached reviewed base.

Exclusive writes: [dependency guide](../react-aria-dependency-upgrades.md) and this
report. Architecture entry linkage is reserved for the coordinator after review;
no architecture, acceptance ledger or historical report was edited.

## Implementation and disposition

The historical read-only report at commit
`7335e41c35ea0af07f72b133ced92e04e1e896ca`, path
`docs/developer/parallel-batch-98/acceptance-evidence.md`, identified L-09 as partial:
upgrade/regression requirements existed, but support/security ownership, cadence,
urgency and unsupported/EOL handling did not. That report's base was
`e43bf604be74e0daf731bc990e6c3097f05ed89b`; its earlier evidence is not promoted
to a pass at this assignment's base. That path is absent from this base tree;
use `git show 7335e41c35ea0af07f72b133ced92e04e1e896ca:docs/developer/parallel-batch-98/acceptance-evidence.md`
for the historical report rather than a broken current-tree link.

The new guide supplies concrete review triggers, a triage receipt/procedure,
unsupported/EOL disposition options, deliberate upgrade steps and affected
behavior/declaration/SSR/packed React 18/19/native validation. It distinguishes
current declarations from tested fixture versions, development from publishing
runtime requirements, targeted Chromium-first dev integration from full production
checks, and paused dev CI from unchanged production/main/reusable release CI.

Security routing is grounded in the ordinary UI issue form and GitHub setup guide,
which do not establish a confidential intake channel. The guide explicitly leaves
channel/recipient, maintenance owner/backup, cadence, response targets/escalation,
supported-release/backport window and disclosure/risk authority **awaiting human
decision**. No person/team/email/SLA or external setting is invented. It does not
approve retention exceptions, appoint owners or change commercial/security promises.

**Disposition:** documentation procedure implemented for review; operational
owner-approved L-09 policy acceptance remains pending. The coordinator owns
independent review, architecture linkage, integration and acceptance decisions.
No future upgrade execution, vulnerability scan, monitoring operation, disclosure,
legal approval or broad migration gate is claimed passed.

## Exact retained source identities

All blobs below are at the reviewed base. The manifest and full lockfile are
retained inputs; importer/specifier/resolved peer contexts were read for current
version assertions. The workflows and consumer definitions were read as source,
not executed. README, migration, component architecture, commercial licensing,
issue form and package/server acceptance contracts were also consulted.

| Source | Git blob at reviewed base |
| --- | --- |
| package.json | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| pnpm-lock.yaml | `d312a82ec958b0badc4633899ec4510cbb655648` |
| .nvmrc | `a45fd52cc5891570d6299fab38643103c3955474` |
| .github/workflows/ci.yml | `d1d9f200e46767226b6022925c40358680cd40c5` |
| .github/workflows/pr-title.yml | `931f4c0dfddfec63cf53febcf0bec155eb9cdad2` |
| .github/workflows/release.yml | `fdc2895cc6e7e48deb9f764dac75b65d6edc8f04` |
| docs/developer/react-aria-architecture.md | `66280bea05b7f70b0e1bcc9e4b2388add91de97a` |
| docs/developer/react-aria-development-validation.md | `93e7f6612b6b315f452636277d7140f318177a6d` |
| docs/developer/react-aria-runtime-ci.md | `9319d05492e47bcd15f751d3db7e042aa604fe0e` |
| docs/developer/react-aria-package-acceptance.md | `7cf0740449017e0e1bb8d9c9450b51de154076e1` |
| docs/developer/react-aria-server-components.md | `52750245160e7a0618483639eaefce58973e900c` |
| docs/github-setup.md | `01e2aca71f153ec44ff6fce1b996577c71721116` |
| scripts/check-package.mjs | `744f86595899989d90edc6cf590a757534c58f17` |
| scripts/test-foundation-consumer.mjs | `ff994cb7c9eaae3fbab58461c98ab0269a276c9c` |
| scripts/test-editor-consumer.mjs | `3acd1f927d7de3c882d3927ac7862683520bc57e` |
| scripts/test-next-consumer.mjs | `5f45613658f5d40d8f5da4d76fb3de6babe529e3` |

New dependency guide Git blob: `124845b1db0c5d7815cd8f1cc3478f3a48869611`.
The containing commit identifies the final evidence-file blob; this report cannot
embed its own final hash without changing it. The completion receipt reports both
final file blobs and commit head.

## Checks performed and limits

- Read-only Git status/branch/worktree/base/blob inspection and exact historical
  `git show` of batch 98; targeted `rg` source/path/support/security/upgrade searches.
  Tracked discovery found no SECURITY.md, SUPPORT.md, CODEOWNERS, Dependabot or
  Renovate configuration. No claim about external ownership or live settings follows.
- Local Markdown relative-link/fragment checks for both new files, comparing
  fragment targets to headings; source consistency review of declared versions,
  peer ranges, fixture versions/flags, Node matrix and dev pause/production policy.
  The initial check found the historical batch 98 path absent from the base;
  replaced that link with the exact historical Git lookup and reran the check.
- `git diff --check` and two-file write-scope review before commit.

No dependencies were installed or updated. No unit tests, guards, build, package,
Storybook, browser/native/AT/device checks, audit/network queries or CI runs were
executed. **Runtime tested head: none.** Documentation checks apply to these files
on the stated base, not to runtime security or future upgrade behavior. No manifest,
lockfile, source, workflow, license, notices, credentials, shared validation state,
remote branch, PR, merge or publication change occurred.
