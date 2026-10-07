# Batch 128: release infrastructure acceptance evidence

Scope: **R-24, R-25, R-26, R-28 only**. Read-only assessment of reviewed
`codex/dev` baseline `e43bf604be74e0daf731bc990e6c3097f05ed89b`, not another
M-row inventory or a repeat of historical proof cases. Worktree:
`/Users/thomashall/.codex/worktrees/batch-128-evidence/sg-ui`; branch
`codex/batch-128-acceptance-evidence`. Only this report is edited.
The [parent criteria](../react-aria-master-task-list.md) remain unchecked;
root alone decides acceptance/integration. No criterion is fully supported.

Source inspection head is the baseline above. **Tested head: none in this
assignment**; no install, test, build, pack, browser, performance, workflow
execution/dispatch, global lease or publication command ran. Existing test
source is coverage intent, not a pass. Read-only remote metadata was inspected
2026-10-07 at approximately 21:34 UTC (16:34 America/Chicago).

## Per-ID matrix

| ID / verdict | Concrete support at the assigned head | Precise remaining gate |
| --- | --- | --- |
| **R-24 — partial** | [CI](../../../.github/workflows/ci.yml) bounds each runtime job to 30 minutes, retains logs/browser evidence under `always()`, sets 14-day retention and rejects missing successful package/Storybook artifacts. Explicit bash preserves pipeline failures. Node 24 installs Chromium/Firefox/WebKit before the browser suite; consumer packs run serially. `setup-node` requests the pnpm dependency cache and every workflow uses a frozen-lockfile install; no `dist` or Storybook build-output cache is configured. [Build](../../../scripts/build.mjs) deletes `dist` before emitting it; [package guard](../../../scripts/check-package.mjs) reads required CSS, checks token/component output and verifies packed files match the fresh build. [Playwright](../../../playwright.config.ts) refuses server reuse and serves static output. | Current expanded suite duration and failure/cancellation/timeout artifact survival are unexecuted at this head. The YAML does not explicitly set `cache-dependency-path` or document a reviewed action implementation's lockfile cache-key semantics, so this inspection does not certify the resolved cache key. Verify lockfile-key behavior and cold/fresh output in the coordinator's run; review timeout capacity with actual duration. `always()`/warn does not promise artifacts exist after runner loss or before files were produced. No static build-head stamp is enforced in this inspected path. |
| **R-25 — partial; dependency review/pinning evidence missing** | Frozen `pnpm-lock.yaml`, explicit pnpm `10.29.3`, Node `22.12.0`/`24` matrix and owned validation policy provide reproducibility/review constraints. [Development policy](../react-aria-development-validation.md) requires workflow syntax/event/selection checks and preserves full production validation; `codex/dev` PR exclusion is explicitly user-authorized, not a workaround invented here. | All external workflow actions use mutable major tags (`@v4`, `@v1`, `@v7`); no SHA pin/update policy or action-update automation was found in `.github` and relevant guidance. Fresh API snapshot reports `allowed_actions: all`, `sha_pinning_required: false`; that is a setting observation, not proof that tags violate an established repository policy. Owner must specify/approve the dependency policy, retain reviewed resolved identities/update procedure, and safely validate any proposed YAML/event/permission changes without relaxing protections. No workflow change is proposed or validated here. |
| **R-26 — missing documented recovery behavior** | [Setup](../../github-setup.md) defines main-only analysis, version inference and publication; [troubleshooting](../../troubleshooting/validation.md) preserves failure evidence and expressly says it does not define a rollback procedure. [Release workflow](../../../.github/workflows/release.yml) serializes release attempts without cancelling an active run and requires reusable CI; full history is checked out. | No repository procedure was found for failed/partial npm versus GitHub publication, tag/package mismatch, bad-version rollback/deprecation or preventing an unsafe retry from attempting an already published version. Historical failed publication remains unresolved in the metadata inspected below. Owner needs a bounded recovery runbook with identity/integrity reconciliation and decision branches, preserving immutable published versions. This report neither diagnoses the failure cause nor recommends blindly retrying. |
| **R-28 — partial; explicit owner release decision missing** | [Release-policy test source](../../../scripts/release-policy.test.mjs) invokes commit analysis/commitlint rather than publication; cases cover patch/minor/major, both breaking markers, largest-bump selection and maintenance non-release. `pnpm check` includes this test. [Configuration](../../../release.config.mjs) selects main, `v${version}`, npm publication and GitHub tarball assets. Setup distinguishes first `1.0.0` from subsequent major inference and development placeholder version. | Safe tests have no newly retained execution at this head. There is no explicit first-publication hold/environment approval gate in YAML and no retained owner decision authorizing which final migration merge should publish or whether registry/tag history makes it first versus subsequent major. A release-worthy main push can publish after configured checks. Reconcile actual registry/tag/release state and intended merge markers/timing in an owner task before production integration; dry-run semantic-release was not invoked. |

## Exact retained evidence and limits

Fresh read-only metadata corroborates available historical evidence; it does not
promote historical full matrices to this baseline:

- [Run 37620201571](https://github.com/Structured-Growth/sg-ui/actions/runs/37620201571)
  has seven artifacts at exact head `9f153642e827a14033d646cf0160730c0793bdfc`.
  All returned `expired: false`. Node 22 package/Storybook/log IDs are
  `11481268576`, `11481238588`, `11481553249`, expiring respectively
  2026-10-21 12:24:46, 12:24:46, 12:24:48 UTC. Node 24 package/Storybook/log IDs
  are `11481848718`, `11481883591`, `11481584496`, expiring respectively
  2026-10-21 12:30:53, 12:30:54, 12:30:57 UTC. Browser ID `11481739407` expires
  2026-10-21 12:30:55 UTC. Artifact metadata is retained availability evidence;
  **no artifact was downloaded or its contents certified here**. Expiration,
  deletion or local `/tmp` loss invalidates assumed future availability.
- [Release run 37403150637](https://github.com/Structured-Growth/sg-ui/actions/runs/37403150637)
  is still the only listed release run, at exact head
  `21adebd61bedfc6a1ed395fe664ff4be83896821`, created 2026-10-06 02:14:20 UTC.
  Job `112074643366` (`validate / validate`) succeeded with the older check set;
  job `112074891613` failed at `Version and publish with semantic-release` after
  install/build succeeded. No raw logs, npm registry/account state, credentials,
  secret inventory, tag mutation or retry was accessed. Failure does not prove
  nothing published; it also does not prove a package/tag mismatch occurred.
- [Earlier release audit](../react-aria-release-gate-audit.md) is preserved at
  its named older baseline `d8342a1b76c2fffe986ecce22252c8282873dbf1` and records
  older owner-state snapshots and missing publication decisions. It is context,
  not current remote protection/tag/npm certification. This assignment refreshed
  only artifact/release-job/action-policy metadata, not all its endpoints.

These infrastructure criteria establish neither native/device nor spoken
assistive-technology acceptance. Historical Chromium/Firefox/WebKit success,
manual acceptance, host integration and current checkpoint ownership remain
separate. No physical-device/AT result is inferred from workflow configuration.
Release rebuilds rather than consuming CI's tarball; exact published artifact
identity remains unverified and is not waived by caching/fresh-build support.

## Source identity ledger

Every blob below is from `git ls-tree HEAD` at the assigned baseline. A reviewer
can recover exact source with `git show <baseline>:<path>` or `git cat-file -p
<blob>`; report commit does not change these inputs.

| Path | Git blob |
| --- | --- |
| `.github/workflows/ci.yml` | `d1d9f200e46767226b6022925c40358680cd40c5` |
| `.github/workflows/release.yml` | `fdc2895cc6e7e48deb9f764dac75b65d6edc8f04` |
| `.github/workflows/ai-code.yml` | `e0afebe1206a9c28544035effb8aa00d39c87465` |
| `.github/workflows/pr-title.yml` | `931f4c0dfddfec63cf53febcf0bec155eb9cdad2` |
| `package.json` | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| `pnpm-lock.yaml` | `d312a82ec958b0badc4633899ec4510cbb655648` |
| `release.config.mjs` | `ee46e0de3e7545768032184650f0e1cc97f2c006` |
| `scripts/release-policy.test.mjs` | `b1b6c0dfe4661475033d30ba968f4972484bdaf9` |
| `scripts/build.mjs` | `c6e328b74748cda5090c2cf2ccbc582944a7df2d` |
| `scripts/css-modules.mjs` | `32dec71c69010e4208e835be364f726fac2d65fe` |
| `scripts/check-package.mjs` | `744f86595899989d90edc6cf590a757534c58f17` |
| `playwright.config.ts` | `ef2fb5556b35d18e74c7c02cdc512e92f2964223` |
| `docs/github-setup.md` | `01e2aca71f153ec44ff6fce1b996577c71721116` |
| `docs/troubleshooting/validation.md` | `b2385442cd12388a55185f5c365fcf5d854ed213` |
| `docs/developer/react-aria-runtime-ci.md` | `9319d05492e47bcd15f751d3db7e042aa604fe0e` |
| `docs/developer/react-aria-release-gate-audit.md` | `b4cf9351ad301ba401eddc38446f257f286eebf7` |
| `docs/developer/react-aria-development-validation.md` | `93e7f6612b6b315f452636277d7140f318177a6d` |

## Bounded handoffs for root reservation

These are proposed exclusive scopes for a later assignment, **not authority to
edit shared files now**. Root should reconcile infrastructure owners before
reserving them; this worker owns only its report.

| Gap | Minimal proposed allowlist | Targeted evidence/check |
| --- | --- | --- |
| R-24 cache and duration/failure evidence | `.github/workflows/ci.yml` only if explicit cache-key/timeout/artifact adjustment is needed; unique new follow-up report | Inspect reviewed setup-node cache implementation/lockfile key; workflow syntax/event checks; coordinator cold/fresh full checkpoint recording exact head, engine/runtime durations and failed/timeout artifact availability. Do not create per-worker full runs. |
| R-25 action review policy | Existing four `.github/workflows/*.yml` only for approved reviewed pins; `docs/github-setup.md` for the owner policy; unique follow-up report | Verify each SHA's trusted upstream identity and update procedure; YAML/action references, event and permission diffs. Preserve dev pause/full production checks/draft PR boundary; do not alter secrets or permissions to force success. |
| R-26 recovery definition | New `docs/troubleshooting/release-recovery.md`, link from `docs/github-setup.md` | Owner-reviewed decision table for no publication, npm-only/tag-only/GitHub-asset failure, integrity mismatch and bad release; safe reconciliation, consumer fallback/deprecation/replacement decisions, immutable-version rule. Tabletop cases without publishing, overwriting or moving tags; live recovery separately authorized. |
| R-28 safe policy and release timing | `scripts/release-policy.test.mjs` only if missing safe configuration assertions are required; `docs/github-setup.md` for explicit owner decision; `.github/workflows/release.yml` only if owner chooses an implementation hold | Coordinator runs existing `pnpm test:release` at exact head; safe source/config/event tests and reviewed final merge-marker history. Owner reconciles registry/tags before explicitly choosing first/subsequent major and timing. No publication or semantic-release dry-run required for this report. |

No native regression was added: an existing deterministic UI story cannot
meaningfully validate publication recovery, action pinning or lockfile keys.
Inventing a browser test would provide no acceptance evidence for these IDs.

## Checks actually performed

Read/queried `git status --short`, `git rev-parse HEAD`, `git ls-tree HEAD` for
listed sources; `rg --files`/`rg -n` for assigned criteria, workflow/cache/release
policy and recovery terms across `.github`, scripts and relevant documentation;
read the cited configs/scripts/guidance. Read-only GitHub API calls:

```sh
gh api repos/Structured-Growth/sg-ui/actions/runs/37620201571/artifacts
gh api 'repos/Structured-Growth/sg-ui/actions/workflows/release.yml/runs?per_page=3'
gh api repos/Structured-Growth/sg-ui/actions/runs/37403150637/jobs
gh api repos/Structured-Growth/sg-ui/actions/permissions
```

Output selections restricted metadata to artifact identity/expiry/head,
job/step conclusions and action policy. Report verification checks local relative
links and `git diff --check`, then checks exclusive changed-file ownership. Those
checks do not execute or certify workflows/tests. No master acceptance, ledger,
other report, shared config, source or primary image-upload worktree was changed.
