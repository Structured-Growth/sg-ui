# Batch 127: R-20–R-23 acceptance evidence

Date: 2026-10-07. Reviewed source head: `e43bf604be74e0daf731bc990e6c3097f05ed89b`
(assigned pushed `codex/dev` baseline). Isolated managed worktree:
`/Users/thomashall/.codex/worktrees/batch-127-evidence/sg-ui`;
branch: `codex/batch-127-acceptance-evidence`.

This is a fresh source reconciliation of four unchecked parent criteria, not a
repeat of inventory-row acceptance or the historical release audit. Only this
report is changed. No parent checkbox, ledger, workflow, production source,
configuration or other report was changed. The coordinator alone accepts and
integrates evidence. “Fully supported” below means the named documentation
criterion is supported by retained source, not that broad release acceptance is
complete.

## Exact retained source

All blob IDs below are from `git ls-tree HEAD` at the reviewed head. Links point to
the retained repository files; the blob/head pair identifies the exact inspected
version even after integration moves those links forward.

| Ref | Retained file | Git blob |
| --- | --- | --- |
| AI | [AI workflow](../../../.github/workflows/ai-code.yml) | `e0afebe1206a9c28544035effb8aa00d39c87465` |
| ISSUE | [UI issue form](../../../.github/ISSUE_TEMPLATE/ui-change.yml) | `3b626c2ee067a084c4cc4571d0dbcc50da151d30` |
| PR | [PR template](../../../.github/pull_request_template.md) | `9bf8035fcf121f4e67194a59fec7434af73ce236` |
| SETUP | [GitHub setup](../../github-setup.md) | `01e2aca71f153ec44ff6fce1b996577c71721116` |
| CI | [CI workflow](../../../.github/workflows/ci.yml) | `d1d9f200e46767226b6022925c40358680cd40c5` |
| PKG | [Package scripts](../../../package.json) | `f83bab2065c9ae79b31aa6b0aa143b7ae0b2a3f0` |
| POLICY | [Development validation policy](../react-aria-development-validation.md) | `93e7f6612b6b315f452636277d7140f318177a6d` |
| PRIOR | [Historical release/AI audit](../react-aria-release-gate-audit.md) | `b4cf9351ad301ba401eddc38446f257f286eebf7` |
| TROUBLE | [Validation troubleshooting](../../troubleshooting/validation.md) | `b2385442cd12388a55185f5c365fcf5d854ed213` |
| RULES | [Agent rules](../../../AGENTS.md) | `11fa44a2628c9eb80cfebc595c5f31661b39a71b` |
| PARENT | [Master criteria](../react-aria-master-task-list.md) | `930c3c94d0d8b4a9c18e7528e860eabdb55ec5a1` |

## Per-ID evidence matrix

| ID / criterion | Current-head finding and exact evidence | Disposition / remaining gate |
| --- | --- | --- |
| R-20: task IDs, owned APIs, stories/behavior and validation evidence in AI task templates/generated PR expectations | ISSUE lines 20–46 and PR lines 4–10 explicitly request IDs, owned/native contracts, host boundaries, changed-state stories, behavior evidence, commands/results/head/artifacts and remaining gates. SETUP lines 94–109 explains these requirements and the generated-body gap. AI line 35 asks for tests/stories and reads AGENTS, but its literal prompt does not explicitly require task IDs, owned contracts or exact evidence. AI lines 95–98 use only the summary's first nonempty title; line 110 overrides the PR template with a static success sentence. | **Partial; concrete missing generation behavior.** Human-facing templates are supported. Generated prompt/body remain incomplete; reading AGENTS does not prove those requirements appear in generated PR evidence. Maintainer workflow follow-up below. |
| R-21: minimal permissions, input separation, credential isolation, separate validation, draft review, no auto-merge | AI lines 9–10 default to contents-read; lines 22/67 disable checkout credential persistence. Lines 30–35 pass task data through an environment value into a file rather than interpolate it into shell code. Lines 37–43 configure workspace-write/drop-sudo and reference the OpenAI key at the Codex action. Lines 57–58 establish a fresh dependent proposal job; lines 74–83 check application and filename scope; lines 95–103 validate the title and execute checks. Line 111 requires a draft; there is no merge step in this workflow. RULES requires draft review and forbids auto-merge. | **Partial; concrete privilege separation gap.** AI lines 61–63 grant contents/PR write to the entire proposal job, which runs generated tests/build at lines 102–103. Fresh generation/validation jobs do not isolate untrusted validation from write authority. Filename scope is not content/symlink security, and the check occurs after patch application. Sandbox settings/key placement are configuration evidence, not tested resistance to credential access/prompt injection. No secrets or exploit probes were inspected/run. |
| R-22: document manual Actions trigger; issue/label trigger is a separate decision | AI lines 2–8 expose only `workflow_dispatch`, with a required task; line 16 restricts implementation to main. SETUP lines 87–92 provides the Actions → AI implementation → Run workflow → main procedure and explicitly states issue/form/label activity does not invoke AI. ISSUE lines 8–9 repeats that boundary. Read-only inspection of all checked-in workflow trigger blocks found no issue/label AI path. | **Fully supported for this documentation criterion.** No trigger implementation or runtime execution is claimed. Adding issue/label dispatch requires a separate maintainer decision. Coordinator may reconcile this narrow criterion; no parent checklist was modified here. |
| R-23: verify AI draft validation independently of absent default-token CI events | AI lines 58/74–103 make allowlist/title/`pnpm check`/Storybook prerequisites to draft creation, independent of a later PR event. PKG's `check` includes guards/types/unit/release-policy/build/package checks, but not browser/packed consumers. CI explicitly adds Node 22.12/24, Node 24 Chromium/Firefox/WebKit, React 18/19 foundation/editor and Next consumers. AI does not call that full CI. SETUP lines 111–120 and TROUBLE's “Missing AI draft-PR checks” instruct exact-head inspection and acknowledge unverified repository token behavior. | **Partial; runtime/full-CI guarantee missing.** Source proves configured narrower prerequisites, not executed checks. No current-head AI-created PR, default-token approval/run state, tested artifact or complete consumer/browser matrix was inspected. Guarantee and observe full validation for the exact proposal head without treating an absent PR event or static body as success. Preserve the intentional dev-PR CI pause in POLICY. |

## Retained evidence and limits

PRIOR records a historical audit at `d8342a1b76c2fffe986ecce22252c8282873dbf1`,
including `total_count: 0` for visible AI runs at its snapshot and ordinary PR CI
metadata. That is retained historical reporting, not a fresh API observation at
the assigned head and not proof of AI-created draft validation. Its old unfiltered
PR-trigger description is superseded by CI/POLICY, which exclude `codex/dev` PRs.
This report re-read the live checked-in workflow rather than inherit that claim.

No run artifacts were downloaded or verified. `ai-proposal` and CI artifacts have
configured 14-day retention; existence, contents or continued availability cannot
be inferred from their upload steps. No workflow was dispatched, no PR/token path
was exercised, and no owner settings/required contexts were queried. Existing
guidance's GitHub token-event wording was read as repository documentation; this
assignment did not independently reverify external service behavior. Owner evidence
must record event, token class (never value), approval state, exact proposed head,
run/job conclusions and retained artifacts. Browser engine/manual/device/AT
acceptance is unrun here and cannot be established by workflow filenames or old
run summaries. Broad R/G/U/X/Z acceptance remains open.

## Minimal exclusive follow-up handoffs (proposed, not reserved or edited)

The three workflow gaps share a single file. Assign them sequentially to one
maintainer owner, or one combined bounded owner; do not dispatch concurrent writers
against `.github/workflows/ai-code.yml`. These are infrastructure tasks outside the
component-only AI patch allowlist. No native Storybook regression applies to these
workflow/documentation criteria, so no optional browser spec was fabricated.

| Slice | Minimum source allowlist | Targeted verification required before acceptance |
| --- | --- | --- |
| R-20 generation | `.github/workflows/ai-code.yml` only; a new workflow fixture test file requires separately assigned ownership | Inspect/dry-render trusted prompt and generated body using inert fixture task/summary inputs: IDs, owned contract, relevant stories/behavior, exact checked head/results/artifact links and unverified gates survive; multiline/quote/backtick/shell-looking data remains data. Validate YAML/action wiring without dispatch. Do not substitute static “passed” text for measured results. |
| R-21 isolation | `.github/workflows/ai-code.yml` only; separately authorize fixture tests if needed | Move generated-code validation to contents-read authority, and create the draft in a fresh write-authorized job that does not execute generated source. Check permission/job dependency graph, credential placement, patch scope/file-type handling, failure blocking and draft-only behavior with inert fixtures. Preserve no-auto-merge; runtime credential isolation remains an owner/security acceptance gate. |
| R-23 prerequisites | `.github/workflows/ai-code.yml` only, using existing read-only `.github/workflows/ci.yml` reusable entry where suitable | Make full validation an explicit exact-proposal-head prerequisite or documented guaranteed path. A reusable call must validate the applied proposal, not silently checkout main. Check dependency/failure behavior, matrix coverage and evidence handoff; then obtain separately authorized owner observation of an AI draft under default-token/approval conditions with exact head/run/artifacts. Coordinator owns heavy-validation scheduling. No token/permission/secret setting changes are authorized by this report. |

## Checks performed

- Confirmed the original checkout was clean and both HEAD and
  `refs/remotes/origin/codex/dev` equaled the assigned baseline. Created the isolated
  managed worktree at that exact commit before edits, then created the named branch.
- Used `rg --files`, `rg -n`, `cat`, `sed` and `nl -ba` to inspect workflow triggers,
  literal AI prompt/body, permission/credential references, job dependencies,
  package check expansion, templates, setup/troubleshooting and retained audit.
  The initially guessed `ai-task.yml` path was absent; the actual inspected form
  is `ui-change.yml` above. No missing form behavior is inferred from that guess.
- Recorded exact blob IDs with `git ls-tree HEAD`; reviewed source at the stated
  head, not a runtime-tested head. Verified report relative file links exist and
  `git diff --check`; checked the final changed-path allowlist and clean commit.
- No install, tests, build, pack, browser, performance, CI or global-lease commands
  were run. There are no fresh test passes, engine results or generated artifacts.
  Only the evidence report is ready for coordinator review/integration.
