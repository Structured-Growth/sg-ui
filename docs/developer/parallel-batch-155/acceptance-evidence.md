# Batch 155 — R-19/R-20 automation evidence correction

Date: 2026-10-07 (America/Chicago). Inspected base:
`e53b6e20f4a6dd56e27ab0402923f3b5f9024fc3`, as assigned from `codex/dev`.
Isolated managed worktree: `/Users/thomashall/.codex/worktrees/batch155-automation-evidence/sg-ui`.
Only the [AI workflow](../../../.github/workflows/ai-code.yml), one inert
[fixture test](../../../scripts/ai-component-scope.test.mjs), and this report change.
The coordinator owns executable validation, integration and acceptance. No master
acceptance/state, source component, image-upload scope or other workflow changes.

## Retained gaps and bounded correction

The integrated [batch 126 R-19 evidence](../parallel-batch-126/acceptance-evidence.md)
identifies a missing semantic architecture exclusion behind broad source/doc paths.
The integrated [batch 127 R-20 evidence](../parallel-batch-127/acceptance-evidence.md)
identifies missing explicit task/owned-contract evidence in the prompt and a static
success PR body that discarded all summary text after the title.

| ID | Prepared behavior | Limits and remaining evidence |
| --- | --- | --- |
| R-19 | Prompt makes architecture/shared contracts, public exports/models, foundation, theme/tokens, adapters/i18n, dependencies/config and agent/workflow changes maintainer-only. Tasks needing them request no edits and a maintainer handoff. Both capture and proposal check the same known exclusions: foundation/theme/adapters/i18n/experimental/hooks directories, all source index barrels, models and named architecture/master/API/recipe guidance, in addition to the retained broad allowlist. | Known path exclusions are conservative guards, not semantic classification of every component redesign. A shared-contract change inside a permitted implementation/doc still needs human review. No content/symlink security, credential isolation or actual AI compliance is certified. |
| R-20 | Prompt explicitly asks for IDs (or none supplied), behavior/owned contracts, story/test paths/cases, exact validation evidence and unverified limitations. Metadata fails on absent/empty evidence sections; it preserves multiline summary content in a file-backed PR body, separately from the validated title. | Section presence cannot prove truthful or complete author evidence. Existing title validation remains. Fixtures are prepared but UNRUN; actual AI response quality and draft creation remain unverified. |
| R-20 receipt | After the existing proposal commitlint/check/Storybook steps succeed, a separate inline step appends base HEAD, original proposal patch SHA-256, completed command names, run/artifact location and limits. The PR action reads this body file instead of a static success sentence. | Identity is the checked-out base plus applied proposal artifact, not a future PR commit SHA or complete immutable working-tree attestation. Generated check/build code remains in the existing write-authorized job. Run links may expire; no artifact contents or external run are verified here. R-21/R-23 held gaps remain. |

No permission, secret reference, credential persistence, trigger, branch/job guard,
concurrency, timeout, action version, security strategy, release/CI field, existing
install/check/build command or draft-only setting is changed. The existing narrower
validation is retained; this does not restore paused dev CI or claim full acceptance.
Author-reported evidence is explicitly labelled for reviewer verification. The
receipt explicitly retains full browser/packed-consumer, token/isolation, device
and assistive-technology limitations.

## Prepared coordinator fixtures

Coordinator command (UNRUN here): `node --test scripts/ai-component-scope.test.mjs`.
The single test file extracts actual workflow inline JavaScript and runs it in a
VM with mocked filesystem/Git calls and inert environment inputs. No shell, Actions,
network, credential-backed execution or generated component code is invoked.
Fixtures cover emitted task bytes containing quotes/backticks/shell-looking text;
explicit boundaries/evidence headings; matching capture/proposal accepted/rejected
paths; multiline/CRLF title/body selection; missing/empty evidence failure; exact
base/patch digest/run link and limits in the receipt; and body-path/receipt ordering.
These are prepared assertions, not claimed test results or security penetration tests.

## Static inspection performed

Read repository AGENTS, targeted architecture/development policy, README, migration
and component architecture, and exact held batch 126/127 gaps. Reviewed the workflow
diff and scope. `git diff --check` passed. `node --check` for the fixture and extracted
inline JS and `bash -n` for five workflow run blocks passed without executing them.
A text comparison normalized only run bodies and PR body selection, removed the
new receipt step, and established that every other workflow byte matches the base.
This specifically preserves all trigger/permission/secret/security/release/CI fields.
Final static checks and exact file SHA-256/Git blob receipts accompany delivery.

No install, build, browser, unit/fixture execution, heavy validation, real workflow
dispatch, Actions run, PR creation, merge, push, publication, owner-setting query or
credential inspection occurred. There is no runtime-tested head in this worker
assignment. YAML parser/action validation and fixture execution remain coordinator
checks; shell/JS syntax alone is not YAML/action validation. No broad R/G/U/X/Z gate
is closed and the master acceptance/state remains unchanged.
