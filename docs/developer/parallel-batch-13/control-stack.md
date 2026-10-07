# Batch 13 control-stack evidence report

Assignment: U-02 / A-08, semantic element/ref, wrapping/order/gap tokens and
independently scoped density. Inspection found no demonstrated in-scope product
defect. This delivery adds only this report; it does not close U-02, A-08 or any
broad/manual/device/assistive-technology acceptance gate.

## Isolation and scope

Verified baseline: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
One managed worktree created and attached before edits:
`/Users/thomashall/.codex/worktrees/batch13-control-stack/sg-ui`.
Branch: `codex/batch13-control-stack`; draft PR base: `codex/dev`.
Primary and other worktrees preserved. Read root AGENTS.md and the
[development validation policy](../react-aria-development-validation.md);
`rg --files -g AGENTS.md` found only the root instructions.

Exclusive write allowlist:

- `src/experimental/Stack/`
- `tests/browser/batch13-control-stack.spec.ts`
- `docs/developer/parallel-batch-13/control-stack.md`

Actual changes: this report alone. Source, stories, tests, barrels, configuration,
shared guides/checklists and workflows remain unchanged.

## Existing evidence and limits

| Concern | Existing baseline evidence | What it establishes / remaining limit |
| --- | --- | --- |
| Native semantics/ref | [Stack.test.tsx](../../../src/experimental/Stack/Stack.test.tsx), two cases | Existing jsdom case combines `as="nav"`, accessible name, native ref, row, gap 4, alignment, justification, wrapping and responsive attributes; second case covers SSR without a provider. These cases were inspected, not freshly run. Child count is asserted, but native visual/tab order is not. |
| Wrapping/responsive/order | [Stack.module.css](../../../src/experimental/Stack/Stack.module.css), [Stack.tsx](../../../src/experimental/Stack/Stack.tsx) | Source uses ordinary row/column flex flow, conditional wrapping and column direction below 38rem; children pass directly through Box. No reverse/order rule exists. This is source evidence, not browser geometry/focus acceptance. |
| Token gaps and overrides | [Box.tsx](../../../src/experimental/Box/Box.tsx), [tokens.css](../../../src/foundation/tokens.css) | Shared Spacing is 0–4; zero maps to 0px, others to generated variables. Default gap is 2 and caller native style has final precedence. Space tokens are density-independent by design; density changes control height/padding, not Stack gaps. No new Stack density API is warranted by these contracts. |
| Independent density | [ThemeScope.test.tsx](../../../src/foundation/ThemeScope.test.tsx), two cases; [ThemeScope.tsx](../../../src/foundation/ThemeScope.tsx) | Existing server case verifies nested theme and density overrides independently; scope context inherits omitted settings. It does not measure composed Stack/control sizes in a browser. |
| Public composition | [primitives.test.tsx](../../../src/components/primitives/primitives.test.tsx), three cases; [primitives.stories.tsx](../../../src/components/primitives/primitives.stories.tsx) | Existing Provider/Box/Stack form exercises public controls, values and reset. Public primitive export points to the same Stack implementation. These are existing tests, not new runtime passes. |
| Stories | [Stack.stories.tsx](../../../src/experimental/Stack/Stack.stories.tsx) | Default story uses the owned Provider. It does not cover a wrapping action row or independently scoped nested density; no changed behavior required a story update in this report-only delivery. |

Read the [layout contract](../react-aria-layout-actions.md),
[primitive mappings](../react-aria-primitives.md),
[theme mappings](../react-aria-theme.md) and
[execution record](../react-aria-progress.md). The execution record already calls
U-02 partial. Previous [inventory evidence](../parallel-batch-05/inventory-evidence.md)
and [wording report](../parallel-batch-09/inventory-contract-wording.md) distinguish
source/test presence from full acceptance; neither supplies Stack-native evidence.
Read README.md, docs/migration.md and component architecture as context; no
architecture change was made.

A search across `tests/browser` found no Stack-specific layout test. Existing
`display-preferences.spec.ts` exercises button density stories for reduced motion
and forced colors, not Stack wrapping, gap or independent density geometry.
Existing tests are sufficient reason to avoid duplicating the semantics/ref
regression, but are not sufficient to certify the whole assigned combination.
No failure was reproduced, so no speculative implementation or manufactured
regression was added.

## Validation and delivery

Inspected head: assigned baseline above. Report validation runs against that
baseline plus this uncommitted report and then the committed report update.
Delivery head and PR URL are recorded below; the final report commit SHA is sent
to the coordinator to avoid a self-referential hash.

Commands used: managed `create_worktree`/status tools, `git cat-file -t` baseline,
`git switch -c codex/batch13-control-stack`, `git rev-parse HEAD`,
`git status --short`, `rg --files -g AGENTS.md`, targeted `cat`/`sed`/`rg` reads
of the linked implementations/contracts/tests/reports, `git log -1` for Stack,
`node --version`, `pnpm --version`, `git diff --check`, and a Python local-link
and exclusive-allowlist audit. Two initial optional glob searches matched no
files; explicit-directory searches were subsequently completed.

Runtime inventory: Node 26.5.0, pnpm 10.29.3, Python 3.9.6. No Node 24, React 18/19 or engine support claim is made.
Fresh test/build/browser counts: **0**. Dependencies were absent and were not
needed for this documentation-only change. No install, Vitest, typecheck,
foundation/token execution guards, build, Storybook, browser or packed-consumer
suite was run. No install/light slots or heavy browser lock were acquired; the
existing `/tmp/sgui-parallel-batch-01-validation.lock`, browser priority file and
browser pool were untouched. Queued checks are not labeled passed.
GitHub dev CI/title runs remain paused; none dispatched, retried or awaited.
No merge/main/publication/permissions/secrets/licensing changes.

## Next bounded evidence slice

Reserve a follow-up with exact write scope `src/experimental/Stack/` and
`tests/browser/batch13-control-stack.spec.ts` plus its own unique report. Add one
representative wrapping row story using existing owned controls, semantic nav
and a native ref, with compact and comfortable sibling/nested scopes. Under the
approved browser scheduler, build fresh Storybook and measure both sides of the
38rem responsive breakpoint, real wrap geometry, declared/zero gaps, stable DOM
and Tab order, and independent control density while gaps remain shared.
Include RTL and enlarged-text geometry if needed by that specific composition.
A failing case should determine any implementation change. Scope/token/barrel
changes would require a separate explicit allowlist; none is currently justified.
Physical-device and spoken AT acceptance remain independent and open.
