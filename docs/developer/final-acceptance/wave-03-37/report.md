# Wave 03-37 — AI workflow trust and required-check successors

Delivered a ready-to-apply seven-file patch and complete proposed-file mirrors. **All four original leaves remain partial pending integration and the stated external evidence.** No acceptance count/checklist was changed. No actual PR, dispatch, merge, release or repository-setting mutation occurred.

The substantive repair separates generated-code validation from write credentials, preserves immutable proposal bytes across jobs, explicitly validates the resulting draft SHA through full reusable CI, and updates task/PR expectations to the current docs host. The branch/protection successor has a concrete read-only collection plan and executable, fail-closed offline receipt verifier; it has no fabricated owner observations.

## Artifacts and checks

- `workflow-trust-and-templates.patch`: proposed `.github/workflows/ai-code.yml`, `.github/workflows/ci.yml`, UI issue form, PR template, `packages/ui/scripts/ai-component-scope.test.mjs`, `docs/github-setup.md`, and `docs/troubleshooting/validation.md`.
- `proposed-files/`: exact integrated-content mirrors. No source file outside this owned directory was edited.
- `validation-plan.json`: exact integrated checks, safe read-only GitHub evidence commands, full Actions/native/packed expectations and remaining security-owner evidence.
- `verify-check-receipt.mjs`, `receipt.test.mjs`: offline consistency/completeness verifier and explicitly synthetic tests. A structurally complete receipt is not authenticated remote or owner evidence.
- `input-receipt.json`: base `540f47d4059a9cea8890b80927f34f51ef2fbc3e`, exact input/proposed SHA-256 values, prior-result comparisons, and matching prior report/result hashes. Both workflow files, templates and existing AI VM test still match wave 02; setup guidance has since changed and is patched from its current bytes. Coordinator evidence is read and hashed; its UI/browser results do not settle these workflow leaves.

Commands actually run from repository root:

1. `python3 docs/developer/final-acceptance/wave-03-37/prepare.py`, `prepare-docs.py`, and `finalize.py`: generate only owned mirrors/patch/receipts. `finalize.py` runs `git apply --check` only: exit 0, no application or index mutation. See `patch-check.txt`.
2. `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node /tmp/sgui-calendar-validate.mjs /Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node docs/developer/final-acceptance/wave-03-37/run-tests.mjs`: **8/8 pass on Node 24.21.0**, final proposal bytes. The existing lease wrapper was inspected first; no lock bypass/reclamation. See `proposal-tests-node24.txt`.
3. `node docs/developer/final-acceptance/wave-03-37/run-tests.mjs`: inert VM/config checks on host Node 26.5.0, supporting development evidence only. Initial two assertion failures (outdated prompt phrase and a comment matching `secrets.`) are preserved in `proposal-tests-initial-failure.txt`, then corrected. No failing runtime was concealed.
4. `node --test docs/developer/final-acceptance/wave-03-37/receipt.test.mjs`: **2/2 pass on Node 26.5.0**; rejects empty/stale/missing/skipped/failed/queued/mismatched-head evidence and missing required contexts/block observations. Synthetic fixtures are never live acceptance receipts.
5. `ruby -e 'require "psych"; ARGV.each { |path| Psych.parse_file(path); puts "Parsed #{path}" }'` with the mirrored AI workflow, CI workflow and issue form: all parse. See `yaml-parse.txt`. Psych syntax parsing is not Actions expression/action-interface validation. `actionlint` is unavailable; its exact follow-up command is in the plan. Python PyYAML is also unavailable; no dependency installation was attempted.

No shared install/build/catalog/server or broad suite ran. No browser/AT/device evidence is claimed. The tests execute extracted inline scripts in VM fixtures with mocked IO, plus configuration assertions; they do not execute actions, generated components, tokens or remote services. Scripts and raw results are retained; `artifact-hashes.json` identifies final deliverable/log bytes.

## A-R-20 — partial, concrete template/documentation fix supplied

Original requirement: Add task IDs, owned API requirements, story/behavior criteria, and validation evidence to AI task templates and generated PR expectations.

The patch replaces obsolete Storybook request fields with docs playground/reference examples, source-context unit fixtures and docs-owned native scenarios. It asks for source/copy correspondence, observable changed props/states, exact head/base/patch identity, commands/results and failed/unrun gates. The prompt keeps owned APIs, internal React Aria, tokens, refs/scopes, host adapters, semantic maintainer boundaries and five required evidence sections. Generated PR metadata still rejects missing/empty sections and treats task/body text as data. The setup/troubleshooting guidance describes actual workspace paths, native-fixture commands/artifacts, independent preflight and exact-head full validation. Manual development dispatch/base now use dev, consistent with AGENTS; new draft branches use the codex prefix. Each panel's state/source ownership is included in generated task expectations.

Evidence: mirrored templates/prompt/guides, eight passing Node 24 VM/config tests (including hostile-looking task text, nonempty evidence and precise receipt), successful patch check and YAML parse. Residual successor: coordinator integrate the patch, run the source-context tests/actionlint and verify maintained guidance links/commands. This is patch-only, so no runtime acceptance closure yet. Historical story evidence remains historical rather than relabeled.

## A-R-21 — partial, credential-boundary repair supplied

Original requirement: Preserve minimal workflow permissions, trusted/untrusted input separation, credential isolation, separate validation, and draft-PR review; never auto-merge AI proposals.

Current write-permission proposal execution of install/check/build is removed. A fresh read-only validate-proposal job applies/guards the patch and runs those checks without API/PR secrets or persisted checkout credentials. A separate write-permission propose job executes trusted inline data handling and actions, applies the proposal, and creates a draft against dev. It does not install dependencies or run generated package/component scripts, inherit secrets, use an alternative PR credential or auto-merge. All AI checkouts bind the dispatch SHA. The original ai-proposal artifact is downloaded independently in the write job and compared by SHA-256 to the validated patch; replaced validation-runner patch bytes fail closed. Validated metadata is assembled under one artifact root so download paths are deterministic.

Evidence: distinct permissions/job graph in proposal, eight Node 24 tests including patch substitution rejection and write-job forbidden operations. Residual successors: integrate; review resolved upstream action source/permissions (including codex-action API-key/sandbox behavior and create-pull-request outputs), effective platform tokens, semantic patch scope and live harmless-fixture isolation. Read-only jobs still execute untrusted code and may manipulate local receipts; path/VM/hash checks cannot prove adversarial credential containment or truthful self-reported tests. The implementation action still needs OPENAI_API_KEY; no claim of its containment is made. Major-tag pin policy is separate A-R-25 work. No credential was inspected/logged.

## A-R-23 — partial, absent-event dependency removed in proposal

Original requirement: Verify AI-created draft PR validation even when default-token PR creation does not trigger another workflow; do not rely on absent CI events.

After draft creation, the workflow requires a nonempty PR number and 40-hex head, exports the action's resulting head and explicitly calls reusable CI with that SHA. Both CI checkout jobs use the supplied SHA and assert the checked HEAD before package scripts run; ordinary PR/main/release callers retain their triggering SHA by default. The explicit call does not depend on a PR event and remains active despite the approved dev PR automatic-CI pause. It runs existing Node 22/24 matrix, native-browser/packed-consumer gates and separate Next.js docs, without inheriting secrets. Title preflight remains before draft creation. A missing draft identity prevents validation from being inferred. There is no claim that caller checks will automatically attach to the future PR check suite; inspect exact checkout SHA, real run URLs and observed contexts.

Evidence: proposed job graph and exact-SHA checkout assertion; eight Node 24 tests include explicit call wiring, missing-head rejection and separate preflight receipt. Residual successors: coordinator integrate/lint, then separately authorized operator exercises a harmless default-token draft and records actual resulting head, action outputs, check contexts/conclusions and any approval-pending/missing runs. No dispatch or PR creation was authorized for this worker and none was attempted. Later head/title edits require new corresponding evidence.

## A-R-27 — partial, concrete required-check evidence tooling supplied

Original requirement: Ensure release-blocking checks actually run on the PR and main paths, including AI proposals and maintainer infrastructure PRs; check branch-protection names against the final workflow jobs.

The patch retains unrestricted production-bound PR/main triggers, matrix/Next.js docs names and unchanged release dependency on reusable CI. It keeps the dev exception. Setup/troubleshooting now include Next.js docs alongside Validate Node 22.12.0/24 and conventional-title, and require observed caller-prefix mapping rather than guessing required names. Infrastructure PRs receive no path bypass. Exact checkout assertions also make head mismatches fail before validation commands.

The offline verifier requires separate observations for production PR, maintainer infrastructure PR, main and default-token AI draft, maps logical jobs to actual contexts, rejects absent/ambiguous/stale/pending/skipped/failed checks, and requires effective production requirements plus real failed/missing-check blocking observations. It also requires dev-exception and existing authorized release-prerequisite observations. `validation-plan.json` provides read-only protection/rules/check/run API commands; an owner must review bypass/effective rules and supply authentic observations. No settings were queried or changed in this worker. Residual successors: integrate/lint and obtain exact-head actual PR/main/caller runs and owner protection evidence. Configuration/synthetic tests cannot establish merge blocking, release enforcement or human approval; unknowns stay open.
