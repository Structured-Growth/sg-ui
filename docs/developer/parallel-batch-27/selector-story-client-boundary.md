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

No full package build/check, `pnpm check`, Storybook build or native/browser suite
was run: this task explicitly reserves heavy validation for the coordinator's
authorized queue. A fresh full package check is still needed to establish emitted
artifact acceptance and discover any later package failures; no such failures are
claimed absent. No behavior test was added for the single directive.

The primary image-upload edits and other workers' checkouts were untouched. No
integration, CI, main, publishing, workflow permissions or secrets were changed.
