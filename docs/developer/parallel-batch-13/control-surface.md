# Batch 13 control-surface review

Assignment: A-08/U-02, native ref/element and owned Surface variants across nested
scopes. This is a bounded review with no demonstrated implementation defect;
A-08/U-02 and broad U/X/R/Z, manual, physical-device and AT acceptance remain open.

## Isolation and scope

- Exact verified baseline and reviewed implementation head:
  `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed, attached worktree:
  `/Users/thomashall/.codex/worktrees/batch13-control-surface/sg-ui`.
- Branch: `codex/batch13-control-surface`; draft PR base: `codex/dev`.
- Exclusive write allowlist: `src/experimental/Surface/`,
  `tests/browser/batch13-control-surface.spec.ts`, and this report.
- Only this report changed. Source, stories, tests, APIs, exports, shared guidance,
  dependencies and workflows are unchanged. Primary/other worktrees are preserved.
- The report commit and draft PR identify the final documentation head; all source
  evidence below is at the exact baseline above.

## Existing evidence and findings

The reviewed combination is a semantic Surface inside an independently themed
nested scope, retaining the owned tone/variant contract and native element/ref.
No source defect was identified; no product fix or manufactured regression was added.
Existing evidence is sufficient for the declarative contract review below, not
for native rendered-style acceptance of every combination.

- [Surface implementation](../../../src/experimental/Surface/Surface.tsx) declares
  `default | subtle` tone and `flat | outlined | raised` variant, defaults to
  default/flat, consumes those props and forwards the native ref and remaining
  owned Box/native props to Box. No upstream public type is exposed.
- [Surface tests](../../../src/experimental/Surface/Surface.test.tsx) contain two
  existing cases: section/region accessible name, exact native ref identity,
  subtle/raised data attributes and absence of a leaked tone attribute; and
  provider-free server rendering. These were inspected, not rerun in this task.
- [Box implementation](../../../src/experimental/Box/Box.tsx) creates the bounded
  native element selected by `as` and forwards its ref directly. Its two existing
  [tests](../../../src/experimental/Box/Box.test.tsx) cover native main/ref,
  className, container, padding, host style and provider-free SSR.
- [ThemeScope tests](../../../src/foundation/ThemeScope.test.tsx) have two existing
  cases covering server-safe system markup and nested inheritance/independent
  theme/density overrides. [ThemeScope](../../../src/foundation/ThemeScope.tsx)
  preserves nearest owned context values and native scope attributes.
- [Surface CSS](../../../src/experimental/Surface/Surface.module.css) resolves
  default/subtle backgrounds, text, radius, outlined divider and raised shadow
  through owned tokens in `sgui.components`. Raised surfaces have a CanvasText
  border fallback in forced colors. [Generated tokens](../../../src/foundation/tokens.css)
  assign light/dark/system colors on scope roots, so nested themes resolve locally
  without Surface maintaining a second theme owner.
- The existing [Default story](../../../src/experimental/Surface/Surface.stories.tsx)
  uses the production Provider. No changed behavior required a story update.
- [Architecture](../react-aria-architecture.md),
  [proof contracts](../react-aria-proof-controls.md),
  [primitive mappings](../react-aria-primitives.md), README, migration guidance,
  component architecture, AGENTS and previous batch reports were inspected.
  The bounded review does not infer shipped acceptance from planning checkboxes.

## Commands and validation limits

Runtime inspection: `node --version` reported `v26.5.0`; `pnpm --version` reported
`10.29.3`. No runtime tests were executed on Node 26, and no supported Node 22/24
runtime pass is claimed.

Read-only commands included `git rev-parse HEAD`, `git status --short`,
`git log -5 --oneline -- src/experimental/Surface src/foundation/ThemeScope.test.tsx`,
`rg --files`, targeted `rg -n`, `cat`/`sed` of the linked implementation/contracts,
and `git remote -v`. `git switch -c codex/batch13-control-surface` ran only after
managed isolation completed and the exact baseline was verified. Report validation
uses `git diff --check` and a local relative-link existence check.

Counts: 0 source changes, 0 added tests, 0 test executions, 0 installs, 0 builds,
0 browser executions. Six relevant existing unit cases were inspected across
Surface, Box and ThemeScope; inspection is not a fresh pass. No full check,
Storybook suite, packed consumer or GitHub CI/title run was requested or claimed.
The targeted development-validation policy permits documentation-only link/path
review without installing dependencies or running unrelated suites.

No install/light/heavy-validation slots or browser locks were acquired because
this remained a read-only code review plus documentation. The shared
`/tmp/sgui-parallel-batch-01-validation.lock`, browser-priority state and other
workers were untouched. The new browser pool was not bypassed. No Firefox retries,
CI dispatches, permissions/secrets, merges, version edits or publication occurred.

## Reserved follow-up

There is no dedicated existing native Surface matrix proving computed background,
text, border and shadow values for all six tone/variant combinations across
nested light/dark/system scopes, host style overrides and forced colors. Unit
attributes and SSR scope tests do not substitute for that evidence.

After the coordinator approves the browser pool, a bounded acceptance task can
own exactly `src/experimental/Surface/Surface.stories.tsx`,
`tests/browser/batch13-control-surface.spec.ts`, and this report. Add a representative
nested-scope story and native computed-style assertions, using a fresh static
Storybook under the shared heavy lock and priority policy. Retain all engines;
record environmental failures separately. Widen source ownership only if that
matrix demonstrates a defect outside Surface. No scope/theme implementation
change is justified by this review.
