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

Tested implementation head: `61194fb4150290d464f818e2cab60b7f2cb9a8de`.
Tracked-source SHA-256 (sorted `git ls-files -z` paths, each pathname plus NUL
followed by its file bytes):
`72020ff7c22b18b7d15f90bf0daee786e5c7a3516f25235a63bc647fc9a8d7b3`.
The subsequent evidence-only commit changes this report, not tested scripts.

| Actual command (using the absolute Node executable above) | Result | stdout+stderr SHA-256 |
| --- | --- | --- |
| `node --test scripts/check-component-css.test.mjs` | 6 passed, 0 failed, exit 0 | `2b79a934f7e7c64babfbabb7f940824412271a90f920a79c5344662d220d0754` |
| `node scripts/check-foundations.mjs` | 3 exact source findings above, exit 1 | `d50d0d7f904d5d171b4dfb9debd57eefb4400a4a8b1335b8d7de7f71971648ea` |

Final units claimed canonical light slot1 plus its legacy transition guard with
owner `batch169:5c23b2e0-5e46-41cf-b95e-d3fe78d6945b`; final scan used the same
slot with owner `batch169:62755352-1ce1-4256-92da-7519cbd2574a`. Receipts are
`artifacts/batch169/reviewed-css-units.json` and `reviewed-foundations.json`, with
matching `.log` files. Both leases released normally.

At earlier implementation head `3c510de9642ae6a528d15cc357ffe7333245d764`,
`node --test scripts/check-component-css.test.mjs scripts/react-stately-boundaries.test.mjs`
reported **9 passed, 1 failed, exit 1**. The existing source-checker fixture copies
current production source and expects its allowed-reference scan to exit 0;
the three new CSS findings prevent that prerequisite. Its later visited/transitive
rejection phases did not execute. This is retained collateral failure evidence,
not an interaction-boundary pass. Log SHA-256:
`e60395375f20cf22519e7d42ca810fbde57dafa0459e7059eaaf6a16b6299fca`;
canonical light slot2 owner `batch169:e18cef75-71fa-485a-8c10-dfb873fe4329`.
No fixture was weakened or source excluded. The final comment-only guard repair
was tested separately and rescanned, not retried against the unchanged known-red
interaction fixture. Final scripts' SHA-256:

- Validator: `fda01743cdd372b0d9ce78f5401ee2ebc988cdacea3722fc70dacb0599db0bf3`
- Fixtures: `8be8d147ef63723671b48049b6c706a36d3cead8846117f417974f30227984a3`
- Foundation wiring: `952bf6f19fd63ec258e4914ce02101ff08809453230a744f506338f61ba5d2cb`

`git diff --check` passed. No TypeScript/API source changed; no production typecheck
ran. JavaScript imports and parsing executed in the targeted tests and scan.
No browser/native case preparation is applicable to this build-time validator.
C-18 and broader acceptance remain open; continuous fixture registration and the
three production typography sites need separately authorized follow-up scope.
