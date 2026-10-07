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

## Authorized emitted-package validation

Coordinator authorized one fresh build window at clean frozen source commit
`6cf993b0e0d60f654dba0294d30280b36de4cc2c`. Node 24.21.0 results:

- `pnpm build`: passed (3.90 seconds).
- Emitted fixture: passed (0.67 seconds), including all negative shape assertions.
- Focused package route/runtime and owned grid/shell declaration audit: passed.
- `pnpm test:package`: failed before entry-point checks (0.57 seconds) because
  `src/experimental/Select/SelectorDirectionStory.tsx` uses a React client API
  without an explicit source client directive. This file is unchanged from the
  reviewed baseline; the defect is outside the three-file assignment. No check
  was weakened and no out-of-scope source fix or repeat build was attempted.

The emitted fixture config `/tmp/sgui-batch26-grid-reset-type-emitted.json` derives
all three mappings from actual package.json `exports[*].types`: `dist/index.d.ts`,
`dist/components/index.d.ts`, and `dist/components/AppDataGrid/index.d.ts`.
Command: `pnpm exec tsc --noEmit -p /tmp/sgui-batch26-grid-reset-type-emitted.json`.
The fixture needs this explicit targeted config because the default repository
config excludes tests/types. No shared config changes are included.

The focused audit independently used TypeScript's Bundler resolver without path
aliases and Node `import.meta.resolve` to verify the three actual package export
routes, imported each runtime entry, verified the snapshot stays type-only, and
used the existing `assertOwnedDeclaration`/`checkOwnedDeclarations` checks on the
entry declarations and entire emitted AppDataGrid/AppDataGridShell directories.
No upstream type references escaped those declarations.

Evidence logs: `/tmp/sgui-batch26-grid-reset-type-build.log`,
`/tmp/sgui-batch26-grid-reset-type-emitted.log`,
`/tmp/sgui-batch26-grid-reset-type-package.log`,
`/tmp/sgui-batch26-grid-reset-type-route-audit.log`, and
`/tmp/sgui-batch26-grid-reset-type-package-evidence.json`.
Both heavy/legacy leases were acquired atomically with this chat's unique token,
priority-first ownership rechecked, and only owned leases and this chat's first
queue entry released on completion. The focused audit used canonical light slots
with token-verified cleanup. Source HEAD and checkout remained frozen through the
build/audit; only this report changed afterward. Broad acceptance remains open.
