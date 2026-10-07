# Batch 13 control-box audit

Assignment: U-02/A-08, bounded Box native attributes/ref and style/slot precedence.
Result: no demonstrated in-scope defect; no product, story or test changes.
This audit does not close U-02, A-08 or broad U/X/R/Z, manual, device or
assistive-technology acceptance.

## Isolation and ownership

- Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- One managed worktree created and attached before edits:
  `/Users/thomashall/.codex/worktrees/batch13-control-box/sg-ui`.
- Branch: `codex/batch13-control-box`; draft PR base: `codex/dev`.
- Exclusive allowlist: `src/experimental/Box/`,
  `tests/browser/batch13-control-box.spec.ts`, and this report.
- Actual change: this report only. Primary and all other worktrees preserved.
- Inspected head: the verified baseline above. Final report head and draft PR
  identity are recorded in the handoff below; a commit cannot contain its own SHA.

Read root AGENTS.md and the
[development validation policy](../react-aria-development-validation.md).
`rg --files -g AGENTS.md` found only the root instructions.

## Existing evidence and contract review

The [public mapping](../react-aria-primitives.md) declares bounded `as`, token
padding, native refs and native CSS/style for Box. The
[layout contract](../react-aria-layout-actions.md) permits padding steps 0–4 and
context-specific native styles. The
[architecture](../react-aria-architecture.md) specifies native attributes/refs,
class/style escape hatches and no inherited upstream slot types.

[Box implementation](../../../src/experimental/Box/Box.tsx) supports nine native
container tags: div, section, article, main, nav, aside, header, footer and span.
It removes owned layout options before spreading native attributes onto the
selected element, forwards the ref directly, combines the scoped root class with
the host class, and spreads host style after its token padding default. The
container marker is derived from the owned `container` option.
[Scoped CSS](../../../src/experimental/Box/Box.module.css) supplies border-box,
minimum inline size and the optional centered width bound in `sgui.components`.
There is no Box slot/part override API to establish a second precedence contract.
No missing interactive-element attribute support was inferred: anchors, inputs
and buttons are outside the explicitly bounded `as` vocabulary.

The existing [two tests](../../../src/experimental/Box/Box.test.tsx) cover:

1. A main element with accessible name, native ref, token padding, container,
   host class and native maxWidth style, without leaking `padding` into the DOM.
2. Server rendering without a provider or browser globals, retaining native id.

The [existing story](../../../src/experimental/Box/Box.stories.tsx) uses the shared
Provider. The [execution record](../react-aria-progress.md) already records native
server-renderable Box implementation and colocated stories/tests while explicitly
keeping whole U-02 acceptance open. The previous
[architecture completion report](../parallel-batch-02/architecture-docs.md)
reconciles the shipped public primitive/native style contracts without claiming
runtime acceptance. Source history attributes Box to commit `51734ed`.

Existing representative tests plus source review are adequate for this bounded
no-defect disposition. They are not exhaustive coverage of every tag, native event,
ref lifecycle or computed container geometry. No artificial failing regression,
new API, redundant browser suite or unrelated styling change was introduced.

## Validation and limits

Read-only inspection used `git rev-parse HEAD`, `git log -- src/experimental/Box`,
`git status --short`, `rg --files -g AGENTS.md`, targeted `rg`, `cat` and `sed` over
Box, the relevant owned contracts, public primitive barrel, foundation/package
checks and previous completion reports. Branch creation used
`git switch -c codex/batch13-control-box` after exact baseline verification.

Report checks: local Markdown file links resolve; changed-path audit contains
exactly this report; `git diff --check` passes. Exact commands and counts are
recorded in the handoff addition below.

Runtime queried for provenance: Node `v26.5.0`, Python `3.9.6`.
No dependency install, Vitest, typecheck, foundation/token guard, build, Storybook,
browser or packed-consumer run was needed for this documentation-only result.
Existing test cases were inspected, not rerun; there is no fresh runtime pass
claim. No install/light/heavy slot or browser lock was acquired, removed or
bypassed. No Firefox launch/retry, CI wait/rerun/dispatch, merge, publication,
workflow permission or secret change occurred.

## Follow-ups

No product fix is reserved: no defect was demonstrated. If a concrete host issue
requires expanding the bounded tag/ref API or checking computed container geometry,
assign a separate Box-focused task with a failing reproduction and the necessary
fresh-browser slot. Broad native/device/AT acceptance remains independently open.
The stale opening catalog-status sentence in `react-aria-layout-actions.md` is
outside this allowlist; a coordinator documentation task may reconcile only that
sentence against the current architecture and public primitive migration record.
