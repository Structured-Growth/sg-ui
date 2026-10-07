# M-21 F6a: live layout slot replacement

Baseline: exact reviewed `codex/dev` commit
`4c9f859bad204a7d7fd2e3787aa6f293db268525`. Created and attached managed worktree
`/Users/thomashall/.codex/worktrees/m21-f6a-layout-replacement/sg-ui` before edits;
unique branch `codex/m21-f6a-layout-replacement`. Exclusive writes are
`src/components/DocumentEditorLayout/`,
`tests/browser/inventory-layout-replacement.spec.ts` and this report. Other editor
and shared source, the primary image-upload work and all other worktrees are unchanged.

The [batch30 review](../parallel-batch-30/inventory-acceptance-13-24.md) identifies
F6a as missing evidence. [Batch13](../parallel-batch-13/editor-layout.md) remains
inspection-only evidence. Existing tests already cover static region order,
removal, native root props/ref, keyboard action order and SSR; those assertions
are retained rather than duplicated in the new cases.

## Change and focused proof

Added the [SlotReplacement story](../../../src/components/DocumentEditorLayout/DocumentEditorLayout.stories.tsx)
with host-owned bounded scrolling and Alt+1/2/3 state controls. The stable host
child and ref callbacks stay in place as header actions, menu and toolbar are
added, replaced, removed and re-added. Content remains focusable and independently
scrollable. Story labels are host sample data. No production implementation,
CSS, public API or dependency changed; no product defect has been demonstrated.

One new [colocated composed test](../../../src/components/DocumentEditorLayout/DocumentEditorLayout.test.tsx)
asserts the unchanged focused host node and native root/host refs through live
slot changes. Its jsdom scrollTop assertion is state retention, not native geometry.

The [focused native spec](../../../tests/browser/inventory-layout-replacement.spec.ts)
contains four cases: both production themes at 260px, with normal and 200% browser
text. A trusted wheel positions a focused document action near the host viewport
top; native Alt shortcuts change chrome without refocusing content. Cases assert
same root/content-wrapper/host/action nodes, unchanged ref attachment counts and
scrollTop, complete focused-action bounds, slot presence and replacement labels,
no horizontal overflow, and host overflow ownership. Final Tab traversal and wheel
scrolling verify continued keyboard access and a stationary header. Geometry is
attached to the browser result. 200% CSS root text is not actual browser zoom.

## Validation and evidence classification

Runtime: Node `v26.5.0`, pnpm `10.29.3`. Frozen-lockfile install passed (608 packages;
esbuild lifecycle script ignored by the existing pnpm policy). Atomically acquired
install slot0 and light-validation slot1 with unique token ownership; released only
owned slots after their work. No heavy build/server/browser or scheduler changes.

Executed targeted checks:

- `pnpm exec vitest run src/components/DocumentEditorLayout/DocumentEditorLayout.test.tsx`: **5 passed**.
- First `pnpm typecheck`: **failed**, new story omitted required Storybook args.
  Classified as fixture/type-authoring error, not product or environment failure.
  Added required title/children args; preserved this red result here.
- Repeated `pnpm typecheck`: **passed**.
- `pnpm exec tsc --noEmit -p tests/browser/tsconfig.json`: **passed**.
- `pnpm foundations:check`: **passed**.
- `pnpm tokens:check`: **passed**.
- Report link existence and `git diff --check`: **passed** before delivery.

Fresh focused Chromium execution is requested from the coordinator's immutable
browser pool at the clean committed source head. No native result is claimed until
that exact head executes. Source scope remains reserved pending Chromium evidence.
Firefox/WebKit belong to the deferred batch checkpoint. No per-task full check,
Storybook build, CI dispatch, main merge, publication or credential access.

This slice does not close M-21, E-03/X-05, manual zoom/device or assistive-technology
acceptance. Arbitrary host chrome taller than its bounded viewport still needs a
host reflow policy; this representative composition does not add another scroll
owner or claim arbitrary-slot overflow acceptance. Defects outside the allowlist
require a reserved successor, not edits from this task.
