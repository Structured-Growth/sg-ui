# Batch 13 — Card presentation and nested action inspection

Bounded U-02/X-03 inspection; no whole acceptance ID is closed.
Coordinator chat: `01a1164f-41db-7f30-aaf9-f20133b6566f`.
Exact baseline and inspected implementation head:
`b139a0d06fb06ba4a5a5aa6adc69c5cb3b206818`.
One managed isolated worktree was created and attached before edits:
`/Users/thomashall/.codex/worktrees/batch13-control-card/sg-ui`.
Branch: `codex/batch13-control-card`; draft PR [#54](https://github.com/Structured-Growth/sg-ui/pull/54), base: `codex/dev`.
Reviewed report head: `9c2777b7e8bf6b0e0dbde31eb988e87e8bdd07b5`.
The report commit's exact final head and PR URL are supplied in the authorized
completion message; the implementation remains the baseline above.

## Scope and result

Exclusive write allowlist:

- `src/experimental/Card/`
- `tests/browser/batch13-control-card.spec.ts`
- `docs/developer/parallel-batch-13/control-card.md`

Only this report changed. No demonstrated in-scope product defect was found.
No API, source, story, test, dependency, shared guide or workflow changed.
Existing Default story remains consistent with the unchanged presentation contract.
No new regression was manufactured, and no interactive card API was invented.

Read root `AGENTS.md`, the [development validation policy](../react-aria-development-validation.md),
[architecture](../react-aria-architecture.md), [layout/action contract](../react-aria-layout-actions.md),
[primitive mappings](../react-aria-primitives.md), [proof controls](../react-aria-proof-controls.md),
and previous [grid-shell composition](../parallel-batch-05/grid-shell-state.md)
and [learner-card composition](../parallel-batch-08/due-label-composition.md) reports.
Batch 10–12 completion-report directories do not exist at this exact baseline;
no unpublished worker evidence is attributed to it.

`Card` forwards its native ref and props to `Surface`, defaulting to `article`
and `outlined`. `Surface` forwards to `Box`; `Box` creates the declared native
presentation element. `CardContent` forwards its native ref to `Box` and defaults
to padding step 4. Neither wrapper installs activation, selection, focus repair,
routing or a second state owner. Native HTML attributes remain host-owned;
adding a host click handler does not create a library normalized press contract.
Hosts should compose owned Button/Link actions inside the presentation content,
with each action owning its native semantics and accessible name. There is no
CardActionArea or Card-owned onPress contract in this implementation/export.

## Existing evidence and exact limits

Inspected tests at the baseline, not newly executed passes:

- `src/experimental/Card/Card.test.tsx`: 2 cases. Named native article and root
  ref, outlined default, CardContent padding, nested native button presence;
  provider-free server markup.
- `src/experimental/Surface/Surface.test.tsx`: 2 cases. Named section/ref,
  tone/variant handling without leaking tone attributes, provider-free SSR.
- `src/experimental/Box/Box.test.tsx`: 2 cases. Native main/ref, token padding,
  host class/style and omitted presentation-only attribute, provider-free SSR.
- `src/experimental/Typography/Typography.ssr.test.tsx`: 1 composed case with
  browser globals absent, native main/article/h2 and separator hierarchy.
- `src/experimental/Button/Button.test.tsx`: 3 separate action cases covering
  pointer/Enter/Space callback counts and ref, disabled/loading, explicit submit.
- `src/experimental/Link/Link.test.tsx`: 3 separate navigation cases covering
  host adapter/ref, cancellation/modifiers, external rel and custom host router.

These 13 existing cases in 6 files are source evidence, not a fresh test result.
Separate Button/Link tests do not establish browser behavior when nested in Card.
Card's existing nested-button assertion establishes markup presence, not native
keyboard order, callback isolation, CardContent ref identity or AT output.
Source inspection establishes direct ref forwarding; it does not certify every
consumer override or native event combination.

## Validation, resources and commands

Observed shell runtime: Node `v26.5.0`; pnpm `10.29.3`; gh `2.95.0`.
No runtime compatibility claim follows from reading documentation under Node 26.
No dependencies were installed and no unit/browser/build/typecheck suite ran:
this is a documentation-only result under the targeted validation policy.
Install slots, lightweight test slots, shared build/browser lock and browser
priority/pool files were not claimed or modified. No server/engine retry ran.
GitHub CI/title workflows remain paused; no wait, rerun, dispatch or policy change.

Inspection commands included:

```sh
git rev-parse HEAD
git switch -c codex/batch13-control-card
rg --files src/experimental/Card docs/developer tests/browser
cat docs/developer/react-aria-development-validation.md src/experimental/Card/Card.tsx src/experimental/Card/Card.test.tsx src/experimental/Card/Card.stories.tsx
rg -n 'U-02|X-03|ControlCard|interactive card|InteractiveCard|CardAction|PresentationCard' docs/developer tests/browser src/experimental
rg -n 'Card|Surface|presentation' scripts/check-foundations.mjs
node --version
pnpm --version
gh --version
git diff --check
```

Report links and referenced source paths were checked locally. The initial read
of the development-validation file in the primary checkout failed because that
checkout lacks the file; all scoped inspection used the attached baseline
worktree, where it exists. Missing batch-report directories were likewise recorded
as missing rather than treated as completed evidence.

## Follow-up ownership

No necessary broader source fix was identified. If the coordinator schedules
additional native evidence, reserve exactly `src/experimental/Card/Card.stories.tsx`,
`src/experimental/Card/Card.test.tsx`, `tests/browser/batch13-control-card.spec.ts`
and this report for a host-composed CardContent containing sibling owned Button
and Link actions: test native Tab order, independent activation/navigation,
nonfocusable presentation wrapper and native CardContent ref. Obtain the reviewed
browser pool path and fresh Storybook under the existing shared lock first.
This is a remaining evidence scope, not a reproduced bug or a reason to invent
production changes now. Manual/device/assistive-technology and broad U/X/R/Z
acceptance remain open. Primary and other worktrees are preserved; no merge,
publication, permission, credential or licensing change occurred.
