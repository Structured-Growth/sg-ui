# Selector direction fixture client boundary

Task: batch 27 package-guard regression correction, within the R-02 source-boundary
contract. Broad acceptance gates remain open.

## Scope and provenance

- Verified `codex/dev` base: `be7b0630ab447881a055d5e32af7950d0d55f9e6`.
- Base is an ancestor of the reviewed primary checkout HEAD `9f15364`; baseline
  `28d3931` is an ancestor of the base and already contains the missing directive.
- Managed, attached checkout:
  `/Users/thomashall/.codex/worktrees/batch27-selector-client/sg-ui`.
- Branch: `codex/batch27-selector-client-boundary`.
- Exclusive source change: `src/experimental/Select/SelectorDirectionStory.tsx`.
  This report is the only other changed file.

The [server boundary contract](../react-aria-server-components.md) requires explicit
source boundaries for React client APIs. The unchanged
[package guard](../../../scripts/check-package.mjs) includes this fixture because
its filename does not match the excluded `.stories.` or `.test.` patterns. It
imports `useState`, so it must declare `"use client"`.

Added that directive before the imports. All imports, direction/description/value
state and F2/F3/F4 fixture interactions are byte-for-byte unchanged after the added
directive and blank line. No build injection, guard/configuration changes or public
API changes were made. The earlier additive grid export did not introduce this
source defect.

## Validation

Node `24.21.0`, pnpm `10.29.3`:

- `pnpm install --frozen-lockfile`: passed in canonical install slot 0; the lockfile
  stayed unchanged. Existing esbuild build-script approval warning was not altered.
- Lightweight temporary harness extracted the exact `checkClientBoundaries`
  function from the unchanged package guard and supplied only this fixture plus its
  TypeScript ES2022/ESNext/react-jsx emit: baseline failed with
  `React client API requires explicit source directive`, fixed source/emit passed.
  This checks targeted directive preservation, not the complete package artifact.
- The harness asserted the fixed source is exactly the baseline prefixed with the
  directive and blank line: passed.
- Source-wide inspection using the package guard's file exclusions and React
  client-import predicate: no remaining source client-import violations.
- `pnpm exec tsc --noEmit`: passed, covering production source and stories.
- `git diff --check`: passed.

Boundary/typing checks used canonical light slot 0. Both slots were acquired by
atomic directory creation and released only after matching this task's ownership.
Temporary harness/logs are `/tmp/batch27-selector-boundary-check.mjs`,
`/tmp/batch27-selector-boundary.log` and `/tmp/batch27-selector-typecheck.log`.

No behavior test was added for the single directive.

## Authorized fresh package validation

After the initial clean commit, the coordinator authorized exactly one fresh
`pnpm build` followed by `pnpm test:package`, with source frozen at
`983bd79b582f872fa888dfdf87296b1189ca5991` in this same attached worktree.
Both commands passed on Node `24.21.0`. The complete package guard reported
successful entry-point imports and consumer owned-contract typechecking; it
reported no remaining package failures.

The run verified a clean checkout and exact HEAD before and after validation,
acquired the legacy and heavyweight locks atomically, and rechecked first queue
eligibility before execution. Owner: `01a1171b-5634-7320-9904-ee224b5695f8`.
Locks were `/tmp/sgui-parallel-batch-01-validation.lock` and the canonical exported
`HEAVY_LOCK`, `/var/folders/vp/bckxx0097z9gb5q8_d1chsvh0000gn/T/sgui-heavyweight-build.lock`.
The run released only its matching owned leases and its own first priority entry,
preserving the queue's remaining entries and metadata.

Validation ran from `2026-10-07T16:08:04.627Z` to
`2026-10-07T16:08:11.505Z`. Individual logs and exact-head evidence:
`/tmp/batch27-selector-package-build.log`,
`/tmp/batch27-selector-package-check.log`,
`/tmp/batch27-selector-package-evidence.json`. This report was finalized afterward;
the source remains identical to the checked commit.

No `pnpm check`, Storybook build or native/browser suite was run under this bounded
authorization. Broad acceptance gates remain open.

The primary image-upload edits and other workers' checkouts were untouched. No
integration, CI, main, publishing, workflow permissions or secrets were changed.
