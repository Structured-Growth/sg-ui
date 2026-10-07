# Grid reset snapshot type route

Task references: batch24/F03, W-19/X-20; additive public-contract repair.
Baseline: `28d3931aee25413f3f147be7088c634dee53a664`.
Isolated attached worktree: `/Users/thomashall/.codex/worktrees/grid-reset-type-route/sg-ui`.

The granular AppDataGrid entry already exports the owned `AppDataGridViewState`
from `ownedGridReset`. The explicit components barrel omitted it, so the root's
star export omitted it too. Adding the type to that barrel exposes the same
contract through root, `/components`, and `/components/AppDataGrid`, without
changing reset behavior, runtime exports, or the owned shape.

The fixture at [tests/types/app-data-grid-view-state.tsx](../../../tests/types/app-data-grid-view-state.tsx)
imports those three package routes. It verifies exact type identity with both
AppDataGrid and AppDataGridShell `onResetView` parameters, complete host snapshot
construction and callback assignments, required layout fields, and the optional
list/cards mode union. The existing [reset contract](../react-aria-catalog-grid.md)
remains authoritative. No broad acceptance gate is closed.

## Validation

Node 24.21.0; `pnpm install --frozen-lockfile` passed. Targeted TypeScript fixture
passed against source entry points. Without the added barrel export, the same
fixture failed with TS2305 missing exports for root and components; restoring the
export passed. No UI/browser or full check/Storybook runs were needed for this
type-only change under the task's targeted validation authorization.

The temporary config `/tmp/sgui-batch26-grid-reset-type-source.json` extends the
worktree tsconfig, includes only this fixture and `src/css-modules.d.ts`, and sets
absolute baseUrl/typeRoots plus these route mappings:

```json
{
  "@structured-growth/sg-ui": ["src/index.ts"],
  "@structured-growth/sg-ui/components": ["src/components/index.ts"],
  "@structured-growth/sg-ui/components/AppDataGrid": ["src/components/AppDataGrid/index.ts"]
}
```

Command: `pnpm exec tsc --noEmit -p /tmp/sgui-batch26-grid-reset-type-source.json`.
Evidence: `/tmp/sgui-batch26-grid-reset-type-red.log` and
`/tmp/sgui-batch26-grid-reset-type-green.log`.
The first temporary-config attempt could not locate Node types because it lived
outside the worktree; absolute typeRoots corrected the fixture runner.

Slot naming was clarified by the coordinator after initial install/red-green runs
used the existing `slot-N` naming. Those task-owned directories were released;
the final green check used an atomic `slot1` directory with owner verification
before cleanup. The coordinator subsequently corrected the canonical ranges to
light `slot0`–`slot3` and install `slot0`–`slot1`; the used `slot1` was within
that light range. All task-owned directories were released. No foreign slot was
removed.

Emitted-package proof is pending the coordinator's authorized build window;
no independent heavy build was launched. After a fresh package build, compile the
same fixture with the three mappings above changed to the corresponding
`dist/index.d.ts`, `dist/components/index.d.ts`, and
`dist/components/AppDataGrid/index.d.ts` files, then run `pnpm test:package`.
This remains separate from the successful source-route proof. The fixture is not
part of the repository's default tsconfig include; it needs that explicit targeted
config. No shared config changes are included in this reserved three-file scope.
