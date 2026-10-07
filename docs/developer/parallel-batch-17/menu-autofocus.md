# Batch 17 owned Menu native autofocus

Bounded focus correction on 2026-10-07; no whole G/U/X/R acceptance gate is closed.
The grid-sort worker retains its grid scope and native assertions. This contribution
changes only the owned Menu implementation and its isolated regression fixtures.

## Ownership and source heads

One managed attached worktree was created before edits:
`/Users/thomashall/.codex/worktrees/batch17-menu-autofocus/sg-ui`.
Branch: `codex/batch17-menu-autofocus`.
Reviewed baseline `3e1c82bf7e3439599cf7899bab26dd57b02ac685` resolved from
`3e1c82b`, equalled local `codex/dev` at creation, and passed ancestry verification.
No primary, integration or other worker checkout was modified.

Exclusive changed paths:

- `src/experimental/Menu/Menu.tsx`
- `src/experimental/Menu/Menu.test.tsx`
- `src/experimental/Menu/Menu.stories.tsx`
- `tests/browser/batch17-menu-autofocus.spec.ts`
- `docs/developer/parallel-batch-17/menu-autofocus.md`

Test-only baseline: `06af8a6a14923749718345e5ac713131d3b2c2db`.
Implementation: `588952a8b23cef81109e220a2781c592224c9fe0`.
The final report commit is reported separately to the coordinator. No common
harness bootstrap was needed: the reviewed base already contains it.

## Independently reproduced native defect

The supplied grid-sort evidence at `3154be8` suggested a virtual-modality focus
race. The owned Menu fixture independently reproduced it without grid code.
It programmatically focuses the trigger, then sends real Alt+ArrowDown, ArrowUp
or Enter. It does not click or Tab first to change entry modality.
Disabled first/last endpoints require the correct enabled first/last item.
Assertions require native focus, keyboard navigation skipping disabled items,
Escape restoration and a clean reopen. Focus is sampled again after two frames.

The coordinator's fresh baseline run at exact `06af8a6` produced **5 passes and
1 failure** across Chromium/WebKit, with zero skipped/flaky tests and no retries.
Chromium Alt+ArrowDown failed the native item-focus assertion at spec line 18.
Its attachment records `document.hasFocus() === true`, an active `role=menu`
container, and a different first enabled `role=menuitem` with `data-focused=true`
and `tabIndex=0`. Other five cases passed. The unchanged source head and build
digest were verified by the supervisor.

Evidence directory in this worktree:
`artifacts/browser-pool/b8648f52-7d28-4027-82bc-11dbaa9c0081/`.
`evidence.json` and `results.json` were independently read by this worker.
Build digest:
`e6e631d4d44b71e06b662b5b32000ea66e9802172ed1c4c510a1ca10d00b76b4`.
Native result duration: 8.55 seconds. Attachments are named
`menu-native-autofocus`; they preserve actual active and committed item markup.

## Bounded implementation

Installed React Aria source shows that virtual `focusSafely` defers item focus
and abandons it when another element has gained focus meanwhile. Non-Mac Alt
keys preserve virtual modality. Collection autofocus can win that race; this
mechanism is an inference from upstream source plus the observed native mismatch.

The native menu ref now listens for focus on the collection itself and schedules
one reconciliation frame. It follows the current committed React Aria item with
`data-focused=true` and `tabIndex=0`; it does not invent a first-item strategy.
Disabled items and descendants of another menu cannot become repair targets.
The callback moves focus only while the same connected collection is still the
active element. Focus elsewhere, including elsewhere in the overlay, is retained.
Ref cleanup removes the listener, cancels the frame and invalidates that lifetime,
including a later attachment of the same native node. Native focus prevents scroll,
matching upstream item focus behavior.

Owned public props, trigger refs, scope/style contracts, portal ownership,
selection state and dismissal remain unchanged. Callback refs return void for
React 18/19 compatibility; browser objects are accessed only from a mounted native
node. No dependency, shared helper, configuration or export was changed.

## Targeted validation

`pnpm install --frozen-lockfile` passed under one of two atomic install slots;
the tracked lockfile did not change. Initial baseline typing/guards ran on Node
26.5.0; final corrected-source validation used Node **24.21.0**, pnpm 10.29.3,
React 19.2.3 under one of four `/tmp/sgui-light-validation-slots` atomic slots.

- Two explicit first/last container-focus mismatch unit regressions failed on
  unfixed Menu, then passed after correction. The ordinary jsdom Alt-entry test
  passed before the fix and is not claimed as native defect reproduction.
- `pnpm exec vitest related --run src/experimental/Menu/Menu.tsx`: **41 files /
  251 tests passed**, including 14 Menu tests, affected grid/editor/navigation
  compositions, empty/all-disabled menus, moved focus and ended menu lifetime.
- `pnpm exec tsc --noEmit`: passed (source and stories).
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: passed.
- `pnpm foundations:check`: passed.
- `git diff --check`: passed.

Final targeted log: `/tmp/sgui-batch17-menu-targeted.log`.
Existing native-link unit cases emit jsdom's navigation-not-implemented diagnostic;
their assertions pass. No warning/error suppression was introduced.

## Corrected native validation pending

No worker build, browser or server was launched. Source/report will remain frozen
while the coordinator runs the corrected clean head. Exact supervisor spec args:

```text
tests/browser/batch17-menu-autofocus.spec.ts --project=chromium --project=webkit
```

The supervisor owns its one-worker setting and max-two-session pool. The native
spec is unchanged from the demonstrated baseline; no focus assertion was relaxed.
Corrected native success must be recorded before this fix is accepted. Grid owner
adoption and its retained sort-opener assertions require a separate composed run.

Firefox, physical devices, OS/browser-menu interception, assistive technology,
React 18 packed consumers, SSR/hydration/browser consumers and broad manual gates
were not revalidated in this slice. React compatibility is preserved by source
contract, not certified by a new packed run. Full suites, Storybook and native
browsers are coordinator-owned per [targeted validation](../react-aria-development-validation.md)
and [parallel browser policy](../react-aria-parallel-browser-validation.md).
Paused dev Actions/title checks were not run, dispatched or re-enabled.
