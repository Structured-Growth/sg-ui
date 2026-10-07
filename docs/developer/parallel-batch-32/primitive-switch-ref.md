# Batch 32: Switch primitive ref mapping (M-37)

Documentation correction, 2026-10-07. Exact verified reviewed `codex/dev` baseline:
`3e910311acee5b5c83184eeb191441acb793147a`.
Created and attached the isolated managed worktree before edits:
`/Users/thomashall/.codex/worktrees/batch-32-switch-ref/sg-ui`.
Branch: `codex/batch-32-switch-ref`. Commit SHA is supplied in delivery.

## Scope and source evidence

Exclusive writes are [the primitive guide](../react-aria-primitives.md) and this
report. The guide's Switch row now specifies `HTMLLabelElement`, and the adjacent
paragraph explains obtaining the associated native input with
`switchRef.current?.control`, narrowing to `HTMLInputElement` before reading
`checked` or focusing it.

The [public primitive barrel](../../../src/components/primitives/index.ts)
directly reexports [the experimental Switch](../../../src/experimental/Switch/Switch.tsx);
[the public entry point](../../../src/primitives/index.ts) reexports that barrel.
The implementation declares `forwardRef<HTMLLabelElement, SwitchProps>`, holds a
label root ref and exposes that root through `useImperativeHandle`. Its internal
input lookup handles native form reset and disabled-fieldset behavior. There is
no public input-ref prop. The existing
[Switch tests](../../../src/experimental/Switch/Switch.test.tsx) read the role's
native input for checked/form behavior; the
[public composition tests](../../../src/components/primitives/primitives.test.tsx)
do not independently assert Switch ref identity. These tests were read, not run.
The [API reconciliation contract](../react-aria-public-api-reconciliation.md)
already identifies the label ref.

This resolves the Switch documentation follow-up explicitly reserved in
[batch14](../parallel-batch-14/api-guide-corrections.md#reserved-follow-ups) and
scope D in inventory review commit
`b240a7185aa5e5531218b9b879313d20568ef8f4`
(`docs/developer/parallel-batch-31/inventory-acceptance-25-37.md`, inspected with
`git show` because that report is outside this worktree baseline).
Other primitive mappings and examples are preserved. No runtime, public ref/type,
central AGENTS, master checkbox or unrelated guide changed.

## Validation and remaining acceptance

Source/text assertions checked the direct exports, label-ref signature and
imperative root mapping, absence of a public input-ref prop, the exact corrected
row and associated-input guidance. All relative Markdown links and heading
anchors in the two changed documents resolve. Exact two-file ownership and
`git diff --check` passed. These are documentation/source consistency checks,
not emitted declaration, native focus or assistive-technology execution evidence.

No install, unit test, build, Storybook, browser or CI run was needed or performed.
No shared checkouts, validation queues/locks, paused CI, main, publishing,
workflow permissions or secrets were changed. The coordinator alone integrates;
all checkouts are preserved.

This correction closes only the confirmed M-37 documentation gap. Remaining
all-control native/state acceptance under U/X still requires evidence-owner
reconciliation across controls and supported engines; manual/device and
assistive-technology acceptance remains open. It does not establish whole M-37
acceptance or close broad U/X/R/Z gates. W-13 integrated consumer guidance,
W-19 repository-wide links/examples and Z-13 final declaration/release-marker
reconciliation remain open in the [master task list](../react-aria-master-task-list.md).
