# Batch 169 CSS guard evidence (C-18 partial)

The isolated auto-managed worktree `/Users/thomashall/.codex/worktrees/c11d/sg-ui`
started clean with detached HEAD at requested baseline
`1948d0b54688cf61dfa6708fd94cbc8ca6e21990`. Only the five authorized guard/test/docs
paths changed. No production CSS, token/generator source, state ledger or shared
master documents changed. Token164 ownership is preserved.

The exported PostCSS validator is wired into the existing foundation traversal.
[Exact enforced scope and limits](../react-aria-css-lint.md) distinguish rule
ownership from full CSS semantics and broad C-18 acceptance. Six inert fixture
cases cover valid layers/scoped descendants, variable math, inheritance, forced
colors, keyframes, retired/global selectors, literal typography, preserved token
and layer failures, inert comments and source locations.

## Current source findings

The production foundation scan reports these three failures without exemptions:

| Source | Declaration | Meaning requiring review |
| --- | --- | --- |
| `src/components/PageRichTextEditorSection/PageRichTextEditorSection.module.css:131:5` | `font-weight: 700` | Lexical bold presentation uses a literal weight |
| `src/components/PageRichTextEditorSection/PageRichTextEditorSection.module.css:146:5` | `font-size: 0.75em` | Lexical subscript uses a relative literal size |
| `src/components/PageRichTextEditorSection/PageRichTextEditorSection.module.css:150:5` | `font-size: 0.75em` | Lexical superscript uses a relative literal size |

These can be intentional rich-text semantics, but violate the enforced token policy.
They need a separately owned source/token solution or narrow explicit policy review.
No broad C-18 closure or green production scan is claimed. Coordinator owns
independent review, follow-up ownership and integration; this task does not push,
merge or publish.

## Validation record

Node executable: `/Users/thomashall/.npm/_npx/387698761821791d/node_modules/node/bin/node`
(**24.21.0**), with its directory first in PATH. Frozen install used pnpm 10.29.3
and exited 0 under canonical install slot0, owner
`batch169:daf8ce5d-b31f-40d2-9913-c1fb0b16d1ea`. Initial fixture run passed six tests;
initial scan exited 1 with the three findings above. All actual stdout, commands,
exit codes, Node version, script hashes and complete canonical/legacy lease
receipts remain in ignored `artifacts/batch169/`. Owned leases were released by
exact-owner verification; foreign light slot0 was untouched.

Final committed-head evidence is recorded below after targeted reruns. No full
check, Storybook, build, browser, packed consumer or native execution ran.
