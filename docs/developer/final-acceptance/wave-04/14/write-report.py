import json, pathlib, hashlib
b=pathlib.Path(__file__).resolve().parent;r=json.loads((b/'results.json').read_text());e=json.loads((b/'evidence.json').read_text())
sourceById={
'A-R-12':['.github/workflows/ci.yml','packages/ui/scripts/ci-artifacts.mjs','docs/developer/react-aria-runtime-ci.md'],
'A-R-17':['packages/ui/package.json','.github/workflows/release.yml','packages/ui/release.config.mjs','docs/commercial-licensing.md','packages/ui/LICENSE','packages/ui/THIRD_PARTY_NOTICES.md'],
'A-R-21':['.github/workflows/ai-code.yml','packages/ui/scripts/ai-component-scope.test.mjs'],
'A-R-23':['.github/workflows/ai-code.yml','.github/workflows/ci.yml'],
'A-R-24':['.github/workflows/ci.yml','packages/ui/scripts/ci-artifacts.mjs','packages/ui/src/foundation/Tokens.next100-regression.test.mjs'],
'A-R-25':['docs/developer/workflow-dependency-policy.md','docs/developer/final-acceptance/wave-03-36/remote/action-pins.json','.github/workflows/ci.yml','.github/workflows/ai-code.yml','.github/workflows/release.yml','.github/workflows/pr-title.yml'],
'A-R-27':['.github/workflows/ci.yml','.github/workflows/pr-title.yml','.github/workflows/ai-code.yml','.github/workflows/release.yml','docs/developer/final-acceptance/wave-03-37/verify-check-receipt.mjs'],
'A-R-28':['packages/ui/release.config.mjs','packages/ui/scripts/release-policy.test.mjs','.github/workflows/release.yml','docs/troubleshooting/release.md'],
'A-Z-14':['packages/ui/package.json','packages/ui/scripts/check-governance-policy.mjs','.github/workflows/release.yml','.github/workflows/ai-code.yml','docs/commercial-licensing.md'],
'A-Z-07':['packages/ui/scripts/ci-artifacts.mjs','docs/developer/final-acceptance/wave-03-followup/validation-results.json','docs/developer/final-acceptance/editor-chrome-presentation/results.json','docs/developer/final-acceptance/rich-editor-presentation/results.json']}
remoteById={
'A-R-12':['remote/ci-runs.json','remote/37873270629-jobs.json','remote/37873270629-artifacts.json'],
'A-R-17':['remote/npm-package.json','remote/tags.json','remote/releases.json','remote/repository.json','remote/main-protection.json','remote/main-rules.json'],
'A-R-21':['remote/ai-runs.json','remote/workflow-permissions.json','remote/actions-permissions.json'],
'A-R-23':['remote/ai-runs.json'],
'A-R-24':['remote/37873270629-jobs.json','remote/ci-runs.json'],
'A-R-25':['remote/actions-permissions.json'],
'A-R-27':['remote/main-protection.json','remote/main-rules.json','remote/rulesets.json','remote/repository.json','remote/37873270629-jobs.json','remote/ai-runs.json'],
'A-R-28':['remote/npm-package.json','remote/tags.json','remote/releases.json','remote/release-runs.json'],
'A-Z-14':['remote/npm-package.json','remote/tags.json','remote/releases.json','remote/main-protection.json','remote/rulesets.json'],
'A-Z-07':['remote/ci-runs.json','remote/37873270629-jobs.json']}
for x in r['entries']:
 x['sourceEvidence']=[{'path':p,'sha256':e['sourceSHA256'][p]} for p in sourceById[x['id']]]
 x['remoteEvidence']=[{'path':p,'sha256':hashlib.sha256((b/p).read_bytes()).hexdigest()} for p in remoteById[x['id']]]
(b/'results.json').write_text(json.dumps(r,indent=2)+'\n')
report='''# Wave04/14 — CI release safety and external readiness

Delivered concrete proposed fixes/tooling and fresh read-only platform observations.
**All10 original leaves remain partial.** No central checklist/count changed. Baseline
is `6c485ed79d0d6a521d188e5bde8315722296f518`; initially only the assigned directory was written. Subsequent coordinator steering
authorized direct creation of NEW policy scripts/tests. Four new script/test files
are now present in packages/ui/scripts; existing source/workflows/checklists remain
unchanged. No build edit, install, browser/simulator, commit/push/switch, draft PR,
workflow dispatch, account setting, tag or publication occurred.

## Reviewable deliverables

- [Combined patch](ci-release-readiness.patch), with three remaining proposed edits and full repository-relative
  [proposed files](proposed-files/). Apply-check passes; remaining patch is **unapplied**. Four NEW scripts/tests were
  directly created under the later explicit coordinator authorization.
- Assertion-preserving Node22 token-test fix: compile the actual generated TS module
  using existing TypeScript rather than Node's newer default type stripping.
  Original current-source Node22.12 error is reproduced in [failure log](node22-original.txt).
  Same one existing smoke passes in owned mirror on [Node22.12](node22-proposed.txt)
  and [Node24.21](node24-proposed.txt). All former assertions remain, plus diagnostic
  validation. No generated file/dependency/support-floor/CI selection changes.
- Read-only downloaded CI archive/receipt verifier plus four synthetic tests,
  passing on [Node22](download-verifier-node22.txt) and [Node24](download-verifier-node24.txt).
  Rejects wrong SHA/attempt, missing/skipped/expired evidence, changed archive,
  tarball/output/input receipt and mismatched packaged legal files. It checks
  operator-supplied data consistency, not API authenticity or legal approval.
- [Collection guide](proposed-files/docs/developer/ci-release-readiness.md), linked
  by the proposed workflow-policy update: effective main rules, actual event/check
  mapping, safe retrieval/extraction, receipt identity, timeout headroom and exact
  owner-controlled npm/auth/provenance/release evidence. Reuses existing owner
  template/check verifier; no fabricated owners or approval fields.
- [GET-only collector](collect-metadata.py) and timestamped [raw metadata](remote/index.json).
  Only fixed read endpoints are queried; credential/auth headers are never printed.

## Material findings and retained evidence

Authenticated repository API reports admin capability. Main protection returns404
with `Branch not protected`; effective main rules and repository/inherited rulesets
return empty lists. Owner needs to resolve this production protection gap before
A-R-27 can close. Current default workflow permission is read; PR review approval
is false. Actions are allowed generally and platform SHA pinning is not required;
repository source pins remain intact. These dated responses do not establish every
possible organization policy or authorize a setting change.

The latest10 CI runs returned contain no current baseline run. Latest full run
`37873270629` at `ddb624fdad1289be71be62da06fe2908a2386a03` remains failed:
Node22 failed and Node24 cancelled. Its prior historical logs already documented
Node22's `.ts` loader error; this pass demonstrates it still exists in current source
and supplies the bounded fix. The second inspected run was cancelled with a skipped
full job. No AI runs returned; latest release runs failed. These queries are bounded,
not an exhaustive history search or proof that an unseen workflow never ran.

Unauthenticated npm package GET remains404; public tags/releases lists are empty.
This cannot establish private history, npm scope availability/control or first-release
approval. Existing release workflow/config public-access/provenance intent is source
evidence only. No semantic-release lifecycle or credentialed dry-run was invoked.

Read prior wave03 reconciliation and all relevant07/36/37/38 leaf reports/results,
then newer follow-up/HB19/HB20 evidence. All linked prior report/result hashes match
reconciliation ([exact hashes](evidence.json)). Retain all300 accepted V leaves and
139 open A leaves. Those local library/docs/native/package/UI receipts retain their
original heads and scopes; none is relabeled as current remote CI, npm or legal evidence.

Current integrated workflow YAML/bash/pin configuration and AI inert VM checks pass
**10/10 on Node24.21** ([log](integrated-workflow-node24.txt)). They test configuration,
mocked inline IO and patch substitution guards, not actual token containment or a
live default-token draft. `actionlint` is absent; no installation attempted.

Only lightweight pure tests and own-mirror writes were used. The token mirror copies
current token JSON/generated TS/compiler and changes only TypeScript module resolution
to the already-installed workspace package. [Harness](verify-token-fix.mjs) preserves
that exact substitution. It is not production integration or a full Node22 check.

## Per-leaf recommendations

'''
for x in r['entries']:
 report+=f"### {x['id']} — partial\n\nOriginal: {x['originalCriterion'].removeprefix('- [ ] ')}\n\n{x['finding']}\n\n"
 report+='Source/evidence: '+', '.join('`'+p['path']+'`' for p in x['sourceEvidence'])+'. Remote: '+', '.join('`'+p['path']+'`' for p in x['remoteEvidence'])+'. Exact SHA256 values are per-ID in [results.json](results.json).\n\nRemaining successors:\n\n'
 for successor in x['remainingSuccessors']:report+='- '+successor+'\n'
 report+='\n'
report+='''## Coordinator boundary

[Validation plan](validation-plan.json) gives exact bounded integration checks and
separately identifies serialized full CI, artifact retrieval and owner successors.
Review hashes and apply the patch before running the one affected token test on22/24
and four verifier cases. No UI build is needed for the docs/tooling patch itself;
required final production matrix remains mandatory and coordinator-owned.
Do not dispatch Release/push main merely to obtain a receipt. Owner adoption,
legal approval, actual default-token AI behavior and effective merge blocking
cannot be manufactured by offline fixtures or by this report.
'''
(b/'report.md').write_text(report)
