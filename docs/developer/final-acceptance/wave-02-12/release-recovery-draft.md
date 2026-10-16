# Publication recovery — maintainer review draft

This is a proposed procedure for A-R-26, saved only in the acceptance evidence directory. It has not been adopted as repository policy, exercised against npm/GitHub, or approved by an owner. It authorizes no release, tag, package, dist-tag, permission or credential mutation. The checked-in troubleshooting guide expressly leaves publication recovery undefined.

## Establish the failure state before choosing an action

The incident owner records the failed Actions run/job/step, intended version, exact validated commit, semantic-release log, computed release notes and intended package integrity. Preserve logs and artifacts before their configured 14-day expiry. Do not log credential values.

Read the registry package/version/integrity and dist-tags, Git tag target, GitHub release and attached tarball independently through approved owner tooling. Distinguish absence from unavailable/unauthorized responses. Compare those observations with the intended commit and preserved artifact hash. Local package.json remains a development placeholder and is not evidence of what was published.

Record a state table with columns: intended version/commit; npm version present and integrity; Git tag present/target; GitHub release present; attached tarball hash; validation receipt; observed time; reviewing owner. An unknown cell blocks a publication retry. A failed job does not establish that no package was published.

## Select the matching recovery branch

| Observed state | Proposed owner decision |
| --- | --- |
| No registry version, no tag or GitHub release, all validation complete | Owner reviews the original failure and authorizes a retry through the protected Actions path. Revalidate changed inputs first. |
| Registry version exists and matches intended bytes, tag/release missing | Preserve the published immutable version. Owner reviews narrowly completing the missing GitHub metadata with the intended target and notes; do not blindly rerun a publishing step. |
| Tag exists, registry version absent | Compare tag target and run history before retry. Owner determines a safe supported recovery through Actions; do not delete or move a public tag to force release discovery. |
| Registry/package or tag bytes disagree with intended version/commit | Treat as an integrity incident. Preserve evidence and escalate to owners. Do not overwrite a version, move the tag or conceal the mismatch. |
| Published package is reproducibly defective | Record affected versions/consumer impact and a fix/revert on dev. Owner selects a new validated release through the approved main promotion. Separately review deprecation messaging or dist-tag changes if needed; these are public mutations requiring explicit owner authorization. |

## Recovery approval and verification

Before any public mutation, the release owner signs off the observed state, intended action, exact target/version, credentials route, required checks and consumer communication. A corrective release uses semantic-release's configured version inference; never hand-edit tracked versions, republish an existing version, introduce changesets or publish locally. Dist-tag changes affect future installs; they do not repair existing lockfiles or installed copies. Git source reverts also do not remove a published package.

After an authorized action, independently compare registry integrity, tag target, GitHub release asset and retained validated tarball. Record the new run/action link and any unresolved discrepancy. Close the incident only after the owner has reviewed those observations and the correction's consumer evidence. Retain the failed receipt alongside the successful one.

## Required adoption evidence

A maintainer must reconcile this draft with the installed semantic-release/npm/GitHub plugin versions and repository-owner practices, designate an incident/release owner, link an adopted procedure from setup and troubleshooting guidance, and exercise an offline state-table drill. Any live registry/tag/dist-tag/deprecation action remains separately human-authorized. This draft does not close A-R-17, A-R-26, A-R-27 or A-R-28.
