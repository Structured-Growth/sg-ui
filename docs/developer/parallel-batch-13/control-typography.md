# Batch 13 control typography inspection

Assignment: control-typography, bounded A-08/U-02 inspection. Typography's
specific U-03 implementation is already recorded as complete; this report does
not close broad A/U/X/R/Z, manual/device or assistive-technology gates.

## Isolation and result

- Exact verified baseline and inspected source head: `b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
- Managed attached worktree: `/Users/thomashall/.codex/worktrees/batch13-control-typography/sg-ui`.
- Branch: `codex/batch13-control-typography`; draft PR targets `codex/dev`.
- Exclusive write allowlist: `src/experimental/Typography/`,
  `tests/browser/batch13-control-typography.spec.ts`, and this report.
- Actual changed file: this report only. No demonstrated in-scope product defect
  was established; no source, stories, tests or public API changes were made.
- Primary checkout and all other worktrees were preserved. Isolation and baseline
  verification preceded edits. Root AGENTS.md was the only AGENTS.md found.

## Existing evidence inspected

[Typography implementation](../../../src/experimental/Typography/Typography.tsx)
selects the native semantic element through `as` independently of `variant`.
The default is a paragraph, including when a visual heading role is supplied.
Native attributes and `style` pass through the remaining props; the native ref is
forwarded directly and host classes are appended to the compiled module class.
Owned role/tone/no-wrap data attributes are applied after the native prop spread.
No upstream public types or interaction dependency are used.

[Colocated tests](../../../src/experimental/Typography/Typography.test.tsx)
contain two DOM cases (independent heading hierarchy; bodyAlt2/native span ref,
host class and accessible name) and 15 parameterized server-rendered visual roles.
The [SSR composition test](../../../src/experimental/Typography/Typography.ssr.test.tsx)
adds one case with absent browser globals and Box/Stack/Surface/Card/Divider.
There are 18 existing cases across these two files. These are inspected assertions,
not fresh test results from this task. The DOM test title mentions styles but its
body does not actually supply/assert `style`; do not cite it as cascade evidence.

[Typography CSS](../../../src/experimental/Typography/Typography.module.css)
uses `sgui.components` exclusively. Every role's size, line-height and weight use
owned variables; bodyAlt2 maps to `--sgui-body-alt2-*`, and code uses the shared
monospace family. No local font metric values or token duplication were found.
The native style is not rewritten by the implementation. The
[architecture contract](../react-aria-architecture.md#styles-and-packaging)
specifies that normal unlayered host CSS outranks the library layer. Source
inspection establishes this wiring, not an executed native-browser cascade test.

[Existing stories](../../../src/experimental/Typography/Typography.stories.tsx)
already include default bodyAlt2, all roles and independent semantic heading
selection under the production Provider. No changed behavior required a new story.
The [public primitive mapping](../react-aria-primitives.md),
[U-03/M-35 execution record](../react-aria-progress.md#owned-controls-and-first-catalog-migrations)
and [prior inventory evidence report](../parallel-batch-05/inventory-evidence.md)
confirm shipped ownership rather than an unfinished Typography migration.
The [inventory acceptance row](../react-aria-migration-inventory-acceptance.md)
identifies no remaining Typefaces catalog criterion. The packed consumer source
already composes public Typography with `as="h2"` and `variant="bodyAlt2"`;
[prior packaging evidence](../parallel-batch-01/packaging.md) records React 18/19
consumer passes at its own historical head, not this baseline.

## Validation and limits

Runtime observed: Node `v26.5.0`, pnpm `10.29.3`. Runtime versions were queried
only; no support-matrix assertion is made for Node 26.

Commands: `git rev-parse HEAD`, `git status --short`, `rg --files -g AGENTS.md`,
focused `cat`/`sed`/`rg` source and evidence inspection, `git log -5 --oneline --
src/experimental/Typography`, `node --version`, `pnpm --version`, local report
link verification and `git diff --check`.

No dependency install, Vitest, typecheck, build, Storybook or browser suite was
run. Fresh test count: zero. The guidance-only validation policy applies. No
install/light-validation slots or shared heavy/browser lock were acquired. No
browser pool was bypassed, Firefox retry attempted, or GitHub CI/title job
waited for, dispatched, rerun or re-enabled. No merge/publication occurred.

## Bounded follow-up

No broader source edit is reserved by this report. If the coordinator requires
new native cascade evidence, assign exactly `src/experimental/Typography/`,
`tests/browser/batch13-control-typography.spec.ts` and this report to a fresh
follow-up after the browser-pool policy is resolved. That evidence should combine
bodyAlt2, independent heading semantics, native ref access, token overrides,
unlayered host class precedence and non-font native inline style precedence in
light/dark scopes. It would be an explicit coverage task; no observed product
failure currently justifies manufacturing a fix. Full device/AT acceptance,
text enlargement and the wider native-browser matrix remain unverified here.
