from pathlib import Path
root=Path.cwd(); own=root/'docs/developer/final-acceptance/wave-03-37'; mirror=own/'proposed-files'
p=root/'docs/github-setup.md'; text=p.read_text()
text=text.replace('plus **conventional-title**.', 'plus **Next.js docs** and **conventional-title**.')
text=text.replace('both AI\njobs', 'AI validation\njobs')
text=text.replace('pnpm build-storybook','pnpm build:browser-docs').replace('sgui-storybook-node-','sgui-browser-docs-node-').replace('Built static Storybook','Built docs-owned native fixtures').replace('changed-state stories; focused browser checks with fresh Storybook', 'changed-state docs examples; focused browser checks with fresh native fixtures')
text=text.replace('or packed consumer suites.','or packed consumer suites. The separate **Next.js docs** job runs root\n`pnpm check:docs`, `pnpm build:docs` and the docs Chromium smoke. Storybook\nhas been removed; historical Storybook receipts retain their original host identity.')
text=text.replace('- `AI_PR_TOKEN`: optional alternative to `github.token` with repository contents\n  and PR write access. It can allow normal PR workflows to start automatically.', '- Draft creation uses `github.token` only in the separate write-permission job.\n  It does not require an alternative PR token. Do not pass publishing/API secrets\n  to generated-code validation or inherit secrets into reusable CI.')
text=text.replace('the implementation job runs only on `main`', 'the implementation job runs only on `dev`').replace('select `main`, and supply', 'select `dev`, and supply').replace('relevant stories/behavior criteria', 'docs playground/reference examples, unit/native fixtures and behavior criteria')
start=text.index('The checked-in AI prompt and patch allowlist')
end=text.index('\n## Validation by change scope',start)
text=text[:start]+'''The component AI workflow permits `packages/ui/src/`, `apps/docs/examples/`,
`apps/docs/native-fixtures/scenarios/`, `docs/` and `README.md`, subject to the
same explicit shared-system exclusions at capture and validation. Foundation,
theme, adapters, i18n, experimental implementations, hooks, architecture/shared
contracts, public exports/models, dependencies/package/workflow/agent changes
require maintainer work. A permitted path does not authorize architectural changes.

The implementation checks out the dispatch SHA on dev and uploads `ai-proposal`
(patch/summary, 14 days). A fresh **validate-proposal** job has contents:read,
no API/PR secrets and no persisted checkout credential. It applies the allowlist,
requires nonempty Task IDs, Behavior and owned contracts, Examples and tests,
Validation evidence and Unverified limitations sections, validates the title,
and runs `pnpm check` and `pnpm build:browser-docs`. Its receipt records the
applied base, patch SHA-256 and run; it is not a tested future PR commit.

The **propose** write-permission job consumes that validated artifact. It does
not install dependencies or execute generated package/component code. It creates
a draft against `dev` on `codex/ai-sgui-<run_id>`, never auto-merges, and fails
if draft number/head identity is absent. The separate **validate-draft** reusable
CI call checks out that exact resulting head with read-only permissions. It runs
the full Node matrix, native/packed-consumer checks and Next.js docs regardless
of whether a default-token PR event starts another run or dev PR CI is paused.
No PR event is evidence of success by itself. Inspect the explicit caller jobs'
actual conclusions and exact checked head. A later PR update requires new
validation of the new head; an old run does not transfer. Title validation
preceded draft creation; edits to the title also require revalidation.

Before production promotion, an owner must capture actual PR/main check contexts
(including reusable caller prefixes), ruleset/protection requirements, failed and
missing-check merge blocking, and release dependency behavior. The expected direct
CI names are **Validate Node 22.12.0**, **Validate Node 24**, **Next.js docs** and
**conventional-title**. Do not configure requirements from guessed prefixed names,
weaken protection, or count the dev exception as production evidence. The AI
preflight receipt and explicit call remain configured behavior until observed on
Actions; action-source/API credential isolation also needs security-owner review.
''' + text[end:]
(mirror/'docs/github-setup.md').write_text(text)
p=root/'docs/troubleshooting/validation.md'; text=p.read_text(); start=text.index('The manual AI proposal job'); end=text.index('\n## Browser server',start)
text=text[:start]+'''The manual AI flow validates its patch/title/package/native-fixture preflight in
a fresh read-only **validate-proposal** job before draft creation. The write-only
proposal phase executes trusted inline data handling and actions, with no install
or generated-code validation. After draft creation the explicit **validate-draft**
reusable CI call validates the resulting immutable draft head, including the full
browser/packed-consumer matrix and Next.js docs. Inspect that caller's actual
head, jobs and conclusions even if no default-token PR event runs. Missing, failed,
queued or approval-pending validation never means success. A changed PR head or
title needs corresponding new validation; the earlier receipt cannot certify it.

Direct CI names are **Validate Node 22.12.0**, **Validate Node 24**, **Next.js docs**
and the title job **conventional-title**. Confirm actual reusable caller prefixes
and effective ruleset contexts from real runs. Production-bound maintainer
infrastructure PRs retain these checks. Dev PR automatic CI/title runs remain paused
under the authorized exception, while the explicit AI reusable call still runs.
Report missing/failed required contexts to an owner with head/run/settings evidence;
do not change secrets, protection or permissions to obtain a pass. Live repository
permissions and default-token behavior require operator receipts.
''' + text[end:]
text=text.replace('static Storybook server','static docs-native fixture server').replace('does not build Storybook','does not build native fixtures').replace('pnpm build-storybook','pnpm build:browser-docs').replace('Never rebuild Storybook','Never rebuild native fixtures').replace('Package and Storybook artifacts','Package and native-fixture artifacts')
(mirror/'docs/troubleshooting/validation.md').write_text(text)
