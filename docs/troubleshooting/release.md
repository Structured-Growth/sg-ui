# Release decisions and publication recovery

This procedure covers A-R-07, A-R-15, A-R-17, A-R-26 and A-R-28. A release owner
records the decision and an incident owner handles a failure. Their identities and
approval must be recorded for each release; this document grants no publishing,
permission, tag, deprecation or dist-tag authority. Development integrates into
`dev`. A human-approved major/minor promotion to `main` can start publication
automatically after the Release workflow's validation job passes.

## Record the publication decision before promotion

Keep a dated receipt with the approved commit, main promotion/PR, release owner,
required validation run/head, package/artifact hashes, scope access, authentication
route and legal/notices reviewer. Use these explicit outcomes:

| Observed release history | Required decision |
| --- | --- |
| No authoritative previous release and a qualifying commit | Approve first publication; configured semantic-release starts at 1.0.0. |
| Existing release with a public breaking delta | Approve a subsequent major; preserve `!` or a `BREAKING CHANGE:` footer in the actual merge commit analyzed on main. |
| Existing release without a breaking delta | Apply the configured Conventional Commit policy; do not infer a breaking release from a checklist label. |
| Unknown/disagreeing registry, Git tag or release history | Stop promotion until the owner reconciles history. A public 404 or empty local tag list is insufficient. |

Use [consumer migration mappings](../migration.md#consumer-migration-mappings) and
the normalized public API comparison to list each changed export/prop/default,
replacement contract and release marker. The mappings cover upstream styling,
Button actions, grids, theme, icons, modals, calendar values and editor adapters;
they are not an exhaustive historical API comparison. Preserve Class/App names
that remain public. AppButton/AppButtonProps were removed before first release;
use Button/ButtonProps, and verify against the actual last published artifact
before calling that removal a published breaking change. Never hand-edit versions.

`feat!: migrate public UI contracts to the owned foundation` is a suitable proposed
squash title only when its accompanying migration ledger describes the complete
reviewed delta. A `docs:` or `refactor:` title without a breaking marker will not
request a major. The existing local analyzer tests cover both breaking markers;
they cannot prove the eventual squash title or authorize promotion.

## Verify publishing prerequisites without publishing a test

The release owner records status, reviewer/date and evidence location for each item.
Never copy tokens, environment dumps, npmrc content, or OIDC tokens into receipts.

- npm organization/scope membership and package write control, public access for
  `@structured-growth/sg-ui`, and the chosen authentication/2FA policy. An
  unauthenticated registry read cannot verify these permissions. If the package
  needs bootstrapping, approve that separately through Actions before relying on
  a package-specific trusted-publisher binding.
- For trusted publishing: organization `Structured-Growth`, repository `sg-ui`,
  workflow filename `release.yml`, GitHub-hosted runner, and any configured
  environment must match. The current workflow declares no environment. Confirm
  direct `npm publish` permission because the installed npm plugin uses that
  command; staged-publish permission alone is insufficient. The current job grants
  `id-token: write`. Record the effective CLI from the release plugin's local
  resolution, not only the runner's global npm. npm requires CLI >=11.5.1 and
  Node >=22.14.0. Review the installed plugin and lock after dependency changes.
- For token publishing: package write permission, expiration, applicable 2FA
  requirements and approved secret setup. The workflow passes `NPM_TOKEN` from
  secrets; its presence in YAML proves neither existence nor permission.
- GitHub contents/tag/release permission and effective branch/tag/ruleset policy.
  Workflow `contents: write` is configuration evidence only. Do not create a tag
  to test permissions. Confirm required validation and human approval for main.
- Public package/repository provenance eligibility and the provenance requirement;
  the job sets provenance according to repository visibility. Claim successful
  attestation only after verifying the real published version. Review README,
  LICENSE and THIRD_PARTY_NOTICES.md against packed bytes and obtain commercial
  notice approval; presence of files is not legal approval.

See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) for current
provider, CLI and direct-publish prerequisites. Offline configuration checks and
`semantic-release --dry-run` do not prove live write permission. The latter may
perform authenticated prerequisite/network checks; do not use it casually in the
shared checkout. Test pure commit analysis/version inference in offline fixtures.

## Preserve the failure state

Stop automatic retries. Preserve run/job/step, intended version and validated
commit, logs, notes, tarball integrity/hash and validation results before Actions
artifacts expire. Record observations independently: npm version/integrity/dist-tags;
Git tag target (including dereferenced annotated target); GitHub release and asset
hash; observation time and reviewing owner. An unknown cell blocks mutation.

The installed semantic-release 25.0.9 prepares output, creates and pushes its tag
and Git notes, then invokes plugins. The configured order invokes npm 13.2.0 before
GitHub 12.0.10. Thus a tag can exist without npm, and npm can exist without a GitHub
release. A failed job never establishes that publication did not happen. Recheck
this order after upgrades. The tracked development version is not publication truth.

| Observed state | Recovery decision |
| --- | --- |
| No npm version, tag, or release; validated intended bytes retained | Diagnose failure; release owner may authorize retry through protected Actions after prerequisite repair and validation of changed inputs. |
| Tag exists, npm version absent | Verify tag target, notes, logs and intended tarball. A plain rerun may discover the tag as the last release and do nothing. Owner must approve a reviewed recovery plan for the exact missing version through Actions; do not delete/move the tag to force rediscovery. |
| npm version matches intended bytes, GitHub release/asset missing | Preserve immutable npm version and tag. Owner may authorize completing only missing GitHub metadata/assets for the verified commit. Do not blindly rerun publishing. |
| npm version exists but tag missing, even if bytes match | Treat as inconsistent history. Verify registry provenance, intended commit and run history before an owner approves restoration of missing metadata; never infer a target from version text alone. |
| Version/tag/asset disagree with intended commit/bytes | Integrity incident: preserve evidence, stop retries and escalate to release/security owners. Never overwrite npm versions or move public tags. |
| Package is defective but identities agree | Repair or revert on dev and release a new validated version through approved main promotion. Separately approve exact-version deprecation message and/or dist-tag correction where needed. |
| Any state unknown | Gather authoritative observations first; no retry, tag repair, deprecation or dist-tag action. |

A source revert does not remove registry bytes. A dist-tag correction changes future
resolution, not installed copies or existing lockfiles. Deprecation warns consumers;
it does not repair the package. Avoid unpublishing as routine rollback and never
republish an existing version. Consult [npm deprecation guidance](https://docs.npmjs.com/deprecating-and-undeprecating-packages-or-package-versions/)
and [semantic-release troubleshooting](https://semantic-release.gitbook.io/semantic-release/support/troubleshooting)
when designing the owner-approved action. No mutation command is an automatic
response to this table.

## Review, drill and verify recovery

Before action, record the chosen row, exact version/commit, missing artifact,
authentication route, release/incident owners, required checks, consumer message and
explicit mutation approval. Exercise the table offline with no-state, tag-only,
npm-only, npm-without-GitHub, mismatch, bad-package and unknown cases. Retain the
operator's conclusions alongside the automated offline model; a model is not an
operator drill or owner acceptance.

After authorized recovery, independently compare registry integrity/provenance,
tag target, GitHub release and retained tarball. Attach corrective run/action links
and consumer verification. Retain the failed receipt and unresolved differences;
the incident owner closes only after release-owner review.

## Lockfile reproducibility receipt

On authorized dependency maintenance in an isolated checkout, use Node 24 and the
workspace's pinned pnpm. Record manifests, workspace configuration and lock hashes,
then run `pnpm install --lockfile-only --ignore-scripts` through the package manager.
Review any resolution delta, peer contexts, overrides, patches and platform optional
packages; do not manually repair YAML. Preserve the transcript even if bytes remain
identical. Follow with `pnpm install --frozen-lockfile` in a disposable clean checkout
and the required validation. Record OS/CPU/libc/runtime/package-manager versions,
physical optional-package selections and supported-platform exclusions. No lock
delta is a valid outcome; an old installed lock or structural audit alone does not
prove fresh reproducibility. Never regenerate the shared acceptance checkout just
to produce a receipt.


## Offline migration marking and trigger checks

Ordinary integration stays on `dev`. A push there does not match Release's `main`
push trigger, and a manual dispatch on another branch cannot pass the release
job's explicit `refs/heads/main` guard. The configured release branches also contain
only `main`. A future approved promotion to `main` can publish automatically after
the reusable validation dependency succeeds; it is not a validation-only merge.
Do not use a main push or workflow dispatch as a test.

From the repository root, `pnpm test:release` runs the maintained analyzer/version
policy tests; it does not invoke the semantic-release lifecycle. The tests call
only the configured Conventional Commit analyzer and installed pure version
calculator: a breaking commit yields `major`, with no previous release the initial
version is `1.0.0`, and an existing `1.4.2` becomes `2.0.0`. Both `!` and a real
`BREAKING CHANGE:` footer are covered. These examples do not set a version by hand
or select an actual release candidate. The workflow policy fixtures separately
reject a dev release trigger, a missing main-only guard and a skipped validation
prerequisite.

The [R-15/R-28 reconciliation](../developer/final-acceptance/wave-04/02/release-marking-safety/receipt.json)
retains the actual `339c958d` breaking-marker proof, exact configuration/tool inputs
and scoped read-only history observations. The marker must still reach the actual
main commit history analyzed by a future release; a maintenance-only squash can
lose it. Source/configuration acceptance does not grant R-17 publishing authority,
prove R-27 branch protection, or approve the full production candidate. Those
remain separate requirements before any promotion/publication.
